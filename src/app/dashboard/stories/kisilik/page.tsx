"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, ArrowLeft, SkipForward, SkipBack,ChevronLeft, ChevronRight} from "lucide-react"
import Link from "next/link"
import { auth, db } from "../../../../../firebase"
import { onAuthStateChanged, type User } from "firebase/auth"
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore"
interface TextSegment {
  text: string
  duration: number
  begin: number
  index: number
  isTitle?: boolean
  isCenter?: boolean
}

export default function KirZincirleriniPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [audioDuration, setAudioDuration] = useState(0)
 const [user, setUser] = useState<User | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Story text segments with timing data - COMPLETE VERSION
  const textSegments: TextSegment[] = [
 // Initial speaking indicator
 
  
  // Title
  { text: "Ki", duration: 0.38, begin: 0.500, index: 1, isTitle: true, isCenter: true },
  { text: "şi", duration: 0.38, begin: 0.750, index: 2, isTitle: true, isCenter: true },
  { text: "lik", duration: 0.38, begin: 1.000, index: 3, isTitle: true, isCenter: true },
  
  // Story content
  { text: " Ga", duration: 0.28, begin: 2.000, index: 4 },
  { text: "zi", duration: 0.28, begin: 2.200, index: 5 },
  { text: " Ü", duration: 0.48, begin: 2.250, index: 6 },
  { text: "ni", duration: 0.48, begin: 2.500, index: 7 },
  { text: "ver", duration: 0.48, begin: 2.750, index: 8 },
  { text: "si", duration: 0.48, begin: 3.000, index: 9 },
  { text: "te", duration: 0.48, begin: 3.250, index: 10 },
  { text: "si", duration: 0.48, begin: 3.500, index: 11 },
  { text: " Ba", duration: 0.48, begin: 3.750, index: 12 },
  { text: "sın", duration: 0.48, begin: 4.000, index: 13 },
  { text: " Ya", duration: 0.48, begin: 4.250, index: 14 },
  { text: "yın", duration: 0.48, begin: 4.500, index: 15 },
  { text: " Yük", duration: 0.48, begin: 4.750, index: 16 },
  { text: "sek", duration: 0.48, begin: 5.000, index: 17 },
  { text: " O", duration: 0.28, begin: 5.250, index: 18 },
  { text: "ku", duration: 0.28, begin: 5.500, index: 19 },
  { text: "lun'", duration: 0.28, begin: 5.750, index: 20 },
  { text: "da", duration: 0.28, begin: 6.000, index: 21 },
  { text: " i", duration: 0.38, begin: 6.750, index: 22 },
  { text: "kin", duration: 0.38, begin: 7.000, index: 23 },
  { text: "ci", duration: 0.38, begin: 7.250, index: 24 },
  { text: " sı", duration: 0.38, begin: 7.500, index: 25 },
  { text: "nıf", duration: 0.38, begin: 7.750, index: 26 },
  { text: " öğ", duration: 0.38, begin: 8.000, index: 27 },
  { text: "ren", duration: 0.38, begin: 8.250, index: 28 },
  { text: "ci", duration: 0.38, begin: 8.500, index: 29 },
  { text: "le", duration: 0.38, begin: 8.750, index: 30 },
  { text: "ri", duration: 0.38, begin: 9.000, index: 31 },
  { text: " Tür", duration: 0.28, begin: 9.500, index: 32 },
  { text: "ki", duration: 0.28, begin: 9.750, index: 33 },
  { text: "ye", duration: 0.28, begin: 10.000, index: 34 },
  { text: " E", duration: 0.28, begin: 10.200, index: 35 },
  { text: "ko", duration: 0.28, begin: 10.400, index: 36 },
  { text: "no", duration: 0.28, begin: 10.600, index: 37 },
  { text: "mi", duration: 0.28, begin: 10.800, index: 38 },
  { text: "si", duration: 0.28, begin: 11.000, index: 39 },
  { text: " der", duration: 0.28, begin: 11.250, index: 40 },
  { text: "si", duration: 0.28, begin: 11.500, index: 41 },
  { text: "nin", duration: 0.28, begin: 11.750, index: 42 },
  { text: " öğ", duration: 0.28, begin: 12.000, index: 43 },
  { text: "ret", duration: 0.28, begin: 12.250, index: 44 },
  { text: "me", duration: 0.28, begin: 12.500, index: 45 },
  { text: "ni", duration: 0.28, begin: 12.750, index: 46 },
  { text: "ni", duration: 0.28, begin: 13.000, index: 47 },
  { text: " bek", duration: 0.28, begin: 13.250, index: 48 },
  { text: "li", duration: 0.28, begin: 13.500, index: 49 },
  { text: "yor", duration: 0.28, begin: 13.750, index: 50 },
  { text: "lar.", duration: 0.28, begin: 14.000, index: 51 },
  { text: " Sı", duration: 0.28, begin: 15.250, index: 52 },
  { text: "nıf,", duration: 0.28, begin: 15.500, index: 53 },
  { text: " öğ", duration: 0.28, begin: 16.000, index: 54 },
  { text: "ren", duration: 0.28, begin: 16.250, index: 55 },
  { text: "ci", duration: 0.28, begin: 16.500, index: 56 },
  { text: "le", duration: 0.28, begin: 16.750, index: 57 },
  { text: "rin", duration: 0.28, begin: 17.000, index: 58 },
  { text: " gü", duration: 0.28, begin: 17.250, index: 59 },
  { text: "rül", duration: 0.28, begin: 17.500, index: 60 },
  { text: "tü", duration: 0.28, begin: 17.750, index: 61 },
  { text: " pa", duration: 0.28, begin: 18.000, index: 62 },
  { text: "tır", duration: 0.28, begin: 18.250, index: 63 },
  { text: "tı", duration: 0.28, begin: 18.500, index: 64 },
  { text: "sıy", duration: 0.28, begin: 18.750, index: 65 },
  { text: "la", duration: 0.28, begin: 19.000, index: 66 },
  { text: " sal", duration: 0.28, begin: 19.250, index: 67 },
  { text: "la", duration: 0.28, begin: 19.500, index: 68 },
  { text: "nır", duration: 0.28, begin: 19.750, index: 69 },
  { text: "ken,", duration: 0.28, begin: 20.000, index: 70 },
  { text: " sert", duration: 0.28, begin: 21.000, index: 71 },
  { text: " gö", duration: 0.28, begin: 21.500, index: 72 },
  { text: "rü", duration: 0.28, begin: 21.750, index: 73 },
  { text: "nüm", duration: 0.28, begin: 22.000, index: 74 },
  { text: "lü", duration: 0.28, begin: 22.250, index: 75 },
  { text: " öğ", duration: 0.28, begin: 22.500, index: 76 },
  { text: "ret", duration: 0.28, begin: 22.750, index: 77 },
  { text: "men", duration: 0.28, begin: 23.000, index: 78 },
  { text: " ka", duration: 0.28, begin: 23.500, index: 79 },
  { text: "pı", duration: 0.28, begin: 23.750, index: 80 },
  { text: "da", duration: 0.28, begin: 24.000, index: 81 },
  { text: " be", duration: 0.28, begin: 24.250, index: 82 },
  { text: "li", duration: 0.28, begin: 24.500, index: 83 },
  { text: "ri", duration: 0.28, begin: 24.750, index: 84 },
  { text: "yor.", duration: 0.28, begin: 25.000, index: 85 },
  { text: " İ", duration: 0.28, begin: 26.000, index: 86 },
  { text: "çe", duration: 0.28, begin: 26.200, index: 87 },
  { text: "ri", duration: 0.28, begin: 26.400, index: 88 },
  { text: "ye", duration: 0.28, begin: 26.600, index: 89 },
  { text: " kız", duration: 0.28, begin: 27.000, index: 90 },
  { text: "gın", duration: 0.28, begin: 27.250, index: 91 },
  { text: " bir", duration: 0.28, begin: 27.500, index: 92 },
  { text: " ba", duration: 0.28, begin: 27.750, index: 93 },
  { text: "kış", duration: 0.28, begin: 28.000, index: 94 },
  { text: " a", duration: 0.28, begin: 28.250, index: 95 },
  { text: "tıp", duration: 0.28, begin: 28.500, index: 96 },
  { text: " kür", duration: 0.28, begin: 29.000, index: 97 },
  { text: "sü", duration: 0.28, begin: 29.250, index: 98 },
  { text: "ye", duration: 0.28, begin: 29.500, index: 99 },
  { text: " ge", duration: 0.28, begin: 29.750, index: 100 },
  { text: "çi", duration: 0.28, begin: 30.000, index: 101 },
  { text: "yor.", duration: 0.28, begin: 30.250, index: 102 },
  { text: " Te", duration: 0.28, begin: 31.250, index: 103 },
  { text: "be", duration: 0.28, begin: 31.500, index: 104 },
  { text: "şir", duration: 0.28, begin: 31.750, index: 105 },
  { text: "le", duration: 0.28, begin: 32.000, index: 106 },
  { text: " tah", duration: 0.28, begin: 32.250, index: 107 },
  { text: "ta", duration: 0.28, begin: 32.500, index: 108 },
  { text: "ya", duration: 0.28, begin: 32.750, index: 109 },
  { text: " ko", duration: 0.28, begin: 33.750, index: 110 },
  { text: "ca", duration: 0.28, begin: 34.000, index: 111 },
  { text: "man", duration: 0.28, begin: 34.250, index: 112 },
  { text: " bir", duration: 0.28, begin: 34.500, index: 113 },
  { text: " bir", duration: 0.28, begin: 35.000, index: 114 },
  { text: "ra", duration: 0.28, begin: 35.200, index: 115 },
  { text: "ka", duration: 0.28, begin: 35.400, index: 116 },
  { text: "mı", duration: 0.28, begin: 35.600, index: 117 },
  { text: " çi", duration: 0.28, begin: 36.000, index: 118 },
  { text: "zi", duration: 0.28, begin: 36.200, index: 119 },
  { text: "yor.", duration: 0.28, begin: 36.400, index: 120 },
  { text: " \"Ba", duration: 0.28, begin: 37.250, index: 121 },
  { text: "kın\"", duration: 0.28, begin: 37.500, index: 122 },
  { text: " di", duration: 0.28, begin: 37.750, index: 123 },
  { text: "yor.", duration: 0.28, begin: 38.000, index: 124 },
  { text: " \"Bu", duration: 0.28, begin: 39.000, index: 125 },
  { text: " ki", duration: 0.28, begin: 39.250, index: 126 },
  { text: "şi", duration: 0.28, begin: 39.500, index: 127 },
  { text: "lik", duration: 0.28, begin: 39.750, index: 128 },
  { text: "tir.", duration: 0.28, begin: 40.000, index: 129 },
  { text: " Ha", duration: 0.28, begin: 41.000, index: 130 },
  { text: "yat", duration: 0.28, begin: 41.250, index: 131 },
  { text: "ta", duration: 0.28, begin: 41.500, index: 132 },
  { text: " sa", duration: 0.28, begin: 41.750, index: 133 },
  { text: "hip", duration: 0.28, begin: 42.000, index: 134 },
  { text: " o", duration: 0.28, begin: 42.200, index: 135 },
  { text: "la", duration: 0.28, begin: 42.400, index: 136 },
  { text: "bi", duration: 0.28, begin: 42.600, index: 137 },
  { text: "le", duration: 0.28, begin: 42.800, index: 138 },
  { text: "ce", duration: 0.28, begin: 43.000, index: 139 },
  { text: "ği", duration: 0.28, begin: 43.200, index: 140 },
  { text: "niz", duration: 0.28, begin: 43.400, index: 141 },
  { text: " en", duration: 0.28, begin: 43.800, index: 142 },
  { text: " de", duration: 0.28, begin: 44.000, index: 143 },
  { text: "ğer", duration: 0.28, begin: 44.200, index: 144 },
  { text: "li", duration: 0.28, begin: 44.400, index: 145 },
  { text: " şey...\"", duration: 0.28, begin: 44.800, index: 146 },
  { text: " Son", duration: 0.28, begin: 46.500, index: 147 },
  { text: "ra", duration: 0.28, begin: 46.700, index: 148 },
  { text: " bir'", duration: 0.28, begin: 47.500, index: 149 },
  { text: "in", duration: 0.28, begin: 47.700, index: 150 },
  { text: " ya", duration: 0.28, begin: 47.900, index: 151 },
  { text: "nı", duration: 0.28, begin: 48.100, index: 152 },
  { text: "na", duration: 0.28, begin: 48.300, index: 153 },
  { text: " bir", duration: 0.28, begin: 48.700, index: 154 },
  { text: " sı", duration: 0.28, begin: 48.900, index: 155 },
  { text: "fır", duration: 0.28, begin: 49.100, index: 156 },
  { text: " ko", duration: 0.28, begin: 49.500, index: 157 },
  { text: "yu", duration: 0.28, begin: 49.700, index: 158 },
  { text: "yor.", duration: 0.28, begin: 49.900, index: 159 },
  { text: " \"Bu", duration: 0.28, begin: 51.400, index: 160 },
  { text: " ba", duration: 0.28, begin: 51.600, index: 161 },
  { text: "şa", duration: 0.28, begin: 51.800, index: 162 },
  { text: "rı", duration: 0.28, begin: 52.000, index: 163 },
  { text: "dır.", duration: 0.28, begin: 52.200, index: 164 },
  { text: " Ba", duration: 0.28, begin: 53.200, index: 165 },
  { text: "şa", duration: 0.28, begin: 53.400, index: 166 },
  { text: "rı", duration: 0.28, begin: 53.600, index: 167 },
  { text: "lı", duration: 0.28, begin: 53.800, index: 168 },
  { text: " bir", duration: 0.28, begin: 54.000, index: 169 },
  { text: " ki", duration: 0.28, begin: 54.400, index: 170 },
  { text: "şi", duration: 0.28, begin: 54.600, index: 171 },
  { text: "lik", duration: 0.28, begin: 54.800, index: 172 },
  { text: " bi", duration: 0.28, begin: 55.600, index: 173 },
  { text: "ri", duration: 0.28, begin: 55.800, index: 174 },
  { text: " on", duration: 0.28, begin: 56.000, index: 175 },
  { text: " ya", duration: 0.28, begin: 56.400, index: 176 },
  { text: "par.\"", duration: 0.28, begin: 56.600, index: 177 },
  { text: " Bir", duration: 0.28, begin: 58.000, index: 178 },
  { text: " sı", duration: 0.28, begin: 58.200, index: 179 },
  { text: "fır", duration: 0.28, begin: 58.400, index: 180 },
  { text: " da", duration: 0.28, begin: 58.800, index: 181 },
  { text: "ha...", duration: 0.28, begin: 59.000, index: 182 },
  { text: " \"Bu", duration: 0.38, begin: 60.200, index: 183 },
  { text: " tec", duration: 0.38, begin: 60.400, index: 184 },
  { text: "rü", duration: 0.38, begin: 60.600, index: 185 },
  { text: "be", duration: 0.38, begin: 60.800, index: 186 },
  { text: "dir.", duration: 0.38, begin: 61.000, index: 187 },
  { text: " On", duration: 0.42, begin: 62.200, index: 188 },
  { text: " i", duration: 0.42, begin: 62.400, index: 189 },
  { text: "ken", duration: 0.42, begin: 62.600, index: 190 },
  { text: " yüz", duration: 0.42, begin: 63.000, index: 191 },
  { text: " o", duration: 0.42, begin: 63.250, index: 192 },
  { text: "lur", duration: 0.42, begin: 63.500, index: 193 },
  { text: "su", duration: 0.42, begin: 63.750, index: 194 },
  { text: "nuz.\"", duration: 0.42, begin: 64.000, index: 195 },
  { text: " Sı", duration: 0.28, begin: 65.500, index: 196 },
  { text: "fır", duration: 0.28, begin: 65.750, index: 197 },
  { text: "lar", duration: 0.28, begin: 66.000, index: 198 },
  { text: " böy", duration: 0.28, begin: 66.250, index: 199 },
  { text: "le", duration: 0.28, begin: 66.500, index: 200 },
  { text: " u", duration: 0.28, begin: 66.750, index: 201 },
  { text: "za", duration: 0.28, begin: 67.000, index: 202 },
  { text: "yıp", duration: 0.28, begin: 67.250, index: 203 },
  { text: " gi", duration: 0.28, begin: 67.750, index: 204 },
  { text: "di", duration: 0.28, begin: 68.000, index: 205 },
  { text: "yor.", duration: 0.28, begin: 68.250, index: 206 },
  { text: " Ye", duration: 0.28, begin: 69.250, index: 207 },
  { text: "te", duration: 0.28, begin: 69.500, index: 208 },
  { text: "nek...", duration: 0.28, begin: 69.750, index: 209 },
  { text: " Di", duration: 0.28, begin: 70.500, index: 210 },
  { text: "sip", duration: 0.28, begin: 70.750, index: 211 },
  { text: "lin...", duration: 0.28, begin: 71.000, index: 212 },
  { text: " Sev", duration: 0.28, begin: 71.500, index: 213 },
  { text: "gi...", duration: 0.28, begin: 71.750, index: 214 },
  { text: " Ek", duration: 0.28, begin: 73.250, index: 215 },
  { text: "le", duration: 0.28, begin: 73.500, index: 216 },
  { text: "nen", duration: 0.28, begin: 73.750, index: 217 },
  { text: " her", duration: 0.28, begin: 74.000, index: 218 },
  { text: " ye", duration: 0.22, begin: 74.250, index: 219 },
  { text: "ni", duration: 0.22, begin: 74.500, index: 220 },
  { text: " sı", duration: 0.22, begin: 74.750, index: 221 },
  { text: "fı", duration: 0.22, begin: 75.000, index: 222 },
  { text: "rın", duration: 0.22, begin: 75.250, index: 223 },
  { text: " ki", duration: 0.28, begin: 75.750, index: 224 },
  { text: "şi", duration: 0.28, begin: 75.950, index: 225 },
  { text: "li", duration: 0.28, begin: 76.050, index: 226 },
  { text: "ği", duration: 0.28, begin: 76.250, index: 227 },
  { text: " on", duration: 0.28, begin: 76.500, index: 228 },
  { text: " kat", duration: 0.28, begin: 76.750, index: 229 },
  { text: " zen", duration: 0.28, begin: 77.250, index: 230 },
  { text: "gin", duration: 0.28, begin: 77.500, index: 231 },
  { text: "leş", duration: 0.28, begin: 77.750, index: 232 },
  { text: "tir", duration: 0.28, begin: 78.000, index: 233 },
  { text: "di", duration: 0.28, begin: 78.250, index: 234 },
  { text: "ği", duration: 0.28, begin: 78.500, index: 235 },
  { text: "ni", duration: 0.28, begin: 78.750, index: 236 },
  { text: " an", duration: 0.28, begin: 79.000, index: 237 },
  { text: "la", duration: 0.28, begin: 79.200, index: 238 },
  { text: "tı", duration: 0.28, begin: 79.400, index: 239 },
  { text: "yor", duration: 0.28, begin: 79.600, index: 240 },
  { text: " öğ", duration: 0.28, begin: 79.800, index: 241 },
  { text: "ret", duration: 0.28, begin: 80.000, index: 242 },
  { text: "men...", duration: 0.28, begin: 80.200, index: 243 },
  { text: " Son", duration: 0.28, begin: 81.600, index: 244 },
  { text: "ra", duration: 0.28, begin: 81.800, index: 245 },
  { text: " e", duration: 0.28, begin: 82.000, index: 246 },
  { text: "li", duration: 0.28, begin: 82.250, index: 247 },
  { text: "ne", duration: 0.28, begin: 82.500, index: 248 },
  { text: " sil", duration: 0.28, begin: 82.750, index: 249 },
  { text: "gi", duration: 0.28, begin: 83.000, index: 250 },
  { text: "yi", duration: 0.28, begin: 83.250, index: 251 },
  { text: " a", duration: 0.28, begin: 83.500, index: 252 },
  { text: "lıp", duration: 0.28, begin: 83.750, index: 253 },
  { text: " en", duration: 0.28, begin: 84.750, index: 254 },
  { text: "baş", duration: 0.28, begin: 85.000, index: 255 },
  { text: "ta", duration: 0.28, begin: 85.250, index: 256 },
  { text: "ki", duration: 0.28, begin: 85.500, index: 257 },
  { text: " bi", duration: 0.28, begin: 85.750, index: 258 },
  { text: "ri", duration: 0.28, begin: 86.000, index: 259 },
  { text: " si", duration: 0.28, begin: 86.250, index: 260 },
  { text: "li", duration: 0.28, begin: 86.500, index: 261 },
  { text: "yor.", duration: 0.28, begin: 86.750, index: 262 },
  { text: " Ge", duration: 0.28, begin: 87.500, index: 263 },
  { text: "ri", duration: 0.28, begin: 87.750, index: 264 },
  { text: " bir", duration: 0.28, begin: 88.250, index: 265 },
  { text: " sü", duration: 0.28, begin: 88.500, index: 266 },
  { text: "rü", duration: 0.28, begin: 88.750, index: 267 },
  { text: " sı", duration: 0.28, begin: 89.000, index: 268 },
  { text: "fır", duration: 0.28, begin: 89.250, index: 269 },
  { text: " ka", duration: 0.28, begin: 89.500, index: 270 },
  { text: "lı", duration: 0.28, begin: 89.750, index: 271 },
  { text: "yor.", duration: 0.28, begin: 90.000, index: 272 },
  { text: " Ve", duration: 0.28, begin: 91.000, index: 273 },
  { text: " öğ", duration: 0.28, begin: 91.250, index: 274 },
  { text: "ret", duration: 0.28, begin: 91.500, index: 275 },
  { text: "men", duration: 0.28, begin: 91.750, index: 276 },
  { text: " yo", duration: 0.28, begin: 92.200, index: 277 },
  { text: "ru", duration: 0.28, begin: 92.400, index: 278 },
  { text: "mu", duration: 0.28, begin: 92.600, index: 279 },
  { text: "nu", duration: 0.28, begin: 92.800, index: 280 },
  { text: " ya", duration: 0.28, begin: 93.000, index: 281 },
  { text: "pı", duration: 0.28, begin: 93.200, index: 282 },
  { text: "yor:", duration: 0.28, begin: 93.400, index: 283 },
  { text: " \"Ki", duration: 0.28, begin: 94.500, index: 284 },
  { text: "şi", duration: 0.28, begin: 94.700, index: 285 },
  { text: "li", duration: 0.28, begin: 94.900, index: 286 },
  { text: "ği", duration: 0.28, begin: 95.100, index: 287 },
  { text: "niz", duration: 0.28, begin: 95.300, index: 288 },
  { text: " yok", duration: 0.28, begin: 95.500, index: 289 },
  { text: "sa", duration: 0.28, begin: 95.700, index: 290 },
  { text: " ö", duration: 0.28, begin: 96.500, index: 291 },
  { text: "bür", duration: 0.28, begin: 96.700, index: 292 },
  { text: "le", duration: 0.28, begin: 96.900, index: 293 },
  { text: "ri", duration: 0.28, begin: 97.100, index: 294 },
  { text: " hiç", duration: 0.28, begin: 97.300, index: 295 },
  { text: "tir!\"", duration: 0.28, begin: 97.500, index: 296 },
  { text: " Sı", duration: 0.28, begin: 99.000, index: 297 },
  { text: "nıf", duration: 0.28, begin: 99.200, index: 298 },
  { text: " me", duration: 0.28, begin: 99.800, index: 299 },
  { text: "sa", duration: 0.28, begin: 100.000, index: 300 },
  { text: "jı", duration: 0.28, begin: 100.200, index: 301 },
  { text: " a", duration: 0.28, begin: 100.400, index: 302 },
  { text: "lıp", duration: 0.28, begin: 100.600, index: 303 },
  { text: " ses", duration: 0.28, begin: 101.000, index: 304 },
  { text: "siz", duration: 0.28, begin: 101.250, index: 305 },
  { text: "li", duration: 0.28, begin: 101.500, index: 306 },
  { text: "ğe", duration: 0.28, begin: 101.700, index: 307 },
  { text: " gö", duration: 0.28, begin: 101.900, index: 308 },
  { text: "mü", duration: 0.28, begin: 102.100, index: 309 },
  { text: "lü", duration: 0.28, begin: 102.300, index: 310 },
  { text: "yor.", duration: 0.28, begin: 102.500, index: 311 },
];
  

 useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Handle audio metadata loaded to get duration
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration)
    }
  }

  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    } else {
      audioRef.current.play()
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const time = audioRef.current.currentTime
          setCurrentTime(time)
          const activeSegment = textSegments.find(
            (segment) => time >= segment.begin && time < segment.begin + segment.duration,
          )
          if (activeSegment) {
            setActiveIndex(activeSegment.index)
          }
        }
      }, 50)
    }
    setIsPlaying(!isPlaying)
  }
  
  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current?.duration || 0)
    }
  }

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const progressWidth = rect.width
    const clickPercentage = clickX / progressWidth
    const newTime = clickPercentage * (audioRef.current.duration || 0)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }
// First useEffect: Listen for auth changes
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser)
  })
  return () => unsubscribe()
}, [])

// Second useEffect: Track visit when user is available
useEffect(() => {
  const trackVisit = async () => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (!userDoc.exists()) return

        const userData = userDoc.data()
        const username = userData.username || userData.firstName || "Unknown"

        // Get story ID from current URL (last part)
        const currentPath = window.location.pathname
        const storyId = currentPath.split('/').pop() || 'unknown'
        
        // Convert kebab-case to Title Case for display
        const storyName = storyId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

        await addDoc(collection(db, "storyVisits"), {
          userId: user.uid,
          username: username,
          storyName: storyName,
          storyId: storyId,
          visitedAt: serverTimestamp(),
        })
        
        console.log(`✅ Visit tracked: ${storyName}`)
      } catch (error) {
        console.error("❌ Error:", error)
      }
    }
  }
  trackVisit()
}, [user])
  const handleAudioEnded = () => {
    setIsPlaying(false)
    setActiveIndex(-1)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const renderTextSegments = () => {
    const titleSegments = textSegments.filter((segment) => segment.isTitle)
    const bodySegments = textSegments.filter((segment) => !segment.isTitle && segment.text.trim())

    return (
      <div className="space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
            {titleSegments.map((segment) => (
              <span
                key={segment.index}
                className={`transition-all duration-300 ${
                  activeIndex === segment.index
                    ? "text-black font-extrabold underline decoration-2 decoration-black opacity-100"
                    : segment.index < activeIndex
                      ? "text-black opacity-100"
                      : "text-slate-900 opacity-40"
                }`}
              >
                {segment.text}
              </span>
            ))}
          </h1>
        </div>
        {/* Story Text */}
        <div className="prose prose-lg max-w-none">
          <div className="text-lg md:text-xl leading-relaxed text-slate-700">
            {bodySegments.map((segment) => (
              <span
                key={segment.index}
                className={`transition-all duration-300 ${
                  activeIndex === segment.index
                    ? "text-black font-bold underline decoration-2 decoration-black opacity-100"
                    : segment.index < activeIndex
                      ? "text-black opacity-100"
                      : "text-slate-700 opacity-40"
                }`}
              >
                {segment.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/stories" className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Hikayelere Dön</span>
              <span className="sm:hidden">Geri</span>
            </Link>

            {/* Navigation Buttons */}
<div className="flex items-center space-x-5">
  <Link href="/dashboard/stories/garson-kiz" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/kavak-agaci-ile-kabak" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <span className="hidden sm:inline">Sonraki Hikaye</span>
    <span className="sm:hidden">Sonraki</span>
    <ChevronRight className="h-4 w-4 ml-1" />
  </Link>
</div>

            <div className="flex items-center text-sm text-slate-500">
              <Volume2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sesli Hikaye</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7x2 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Audio Controls - Compact Horizontal at Top */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 mb-6 backdrop-blur-sm bg-white/95">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Section - Title and Time */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
              <h2 className="text-lg font-semibold text-slate-900 whitespace-nowrap">Sesli Okuma</h2>
              <div className="text-sm text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded">
                {formatTime(currentTime)} / {formatTime(audioDuration)}
              </div>
            </div>

            {/* Center Section - Controls */}
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={handleSkipBackward}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200 hover:scale-105"
                title="10 saniye geri"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={handlePlayPause}
                className={`flex items-center justify-center w-12 h-12 rounded-full text-white transition-all duration-200 hover:scale-105 shadow-lg ${
                  isPlaying
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                }`}
                title={isPlaying ? "Duraklat" : "Oynat"}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>
              <button
                onClick={handleSkipForward}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200 hover:scale-105"
                title="10 saniye ileri"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            {/* Right Section - Interactive Progress Bar */}
            <div className="flex-1 lg:max-w-xs">
              <div
                className="w-full bg-slate-200 rounded-full h-3 cursor-pointer hover:h-4 transition-all duration-200 relative group"
                onClick={handleProgressClick}
                title="Zaman çubuğuna tıklayarak istediğiniz yere atlayın"
              >
                <div
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-200 relative"
                  style={{
                    width: `${audioDuration ? (currentTime / audioDuration) * 100 : 0}%`,
                  }}
                >
                  {/* Progress indicator dot */}
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
              </div>
            </div>
          </div>

          <audio
            ref={audioRef}
            src="/3-2.mp3"
            onEnded={handleAudioEnded}
            onLoadedMetadata={handleLoadedMetadata}
          />
        </div>

        {/* Story Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">{renderTextSegments()}</div>
      </div>
    </div>
  )
}