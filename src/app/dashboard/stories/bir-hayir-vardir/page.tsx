"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, ArrowLeft, SkipForward, SkipBack, ChevronRight,ChevronLeft} from "lucide-react"
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
 { text: "Bir", duration: 0.40, begin: 0.250, index: 1, isTitle: true, isCenter: true },
  { text: " Ha", duration: 0.40, begin: 0.500, index: 2, isTitle: true, isCenter: true },
  { text: "yır", duration: 0.40, begin: 0.750, index: 3, isTitle: true, isCenter: true },
  { text: " Var", duration: 0.40, begin: 1.000, index: 4, isTitle: true, isCenter: true },
  { text: "dır", duration: 0.40, begin: 1.250, index: 5, isTitle: true, isCenter: true },

  // Story content
  { text: " Bir", duration: 0.28, begin: 2.500, index: 6 },
  { text: " za", duration: 0.28, begin: 2.700, index: 7 },
  { text: "man", duration: 0.28, begin: 2.900, index: 8 },
  { text: "lar", duration: 0.28, begin: 3.100, index: 9 },
  { text: " Af", duration: 0.28, begin: 3.500, index: 10 },
  { text: "ri", duration: 0.28, begin: 3.700, index: 11 },
  { text: "ka'", duration: 0.28, begin: 3.900, index: 12 },
  { text: "da", duration: 0.28, begin: 4.100, index: 13 },
  { text: " ki", duration: 0.28, begin: 4.300, index: 14 },
  { text: " bir", duration: 0.28, begin: 4.500, index: 15 },
  { text: " ül", duration: 0.28, begin: 4.700, index: 16 },
  { text: "ke", duration: 0.28, begin: 5.000, index: 17 },
  { text: "de", duration: 0.28, begin: 5.200, index: 18 },
  { text: " hü", duration: 0.28, begin: 6.100, index: 19 },
  { text: "küm", duration: 0.28, begin: 6.300, index: 20 },
  { text: " sü", duration: 0.28, begin: 6.500, index: 21 },
  { text: "ren", duration: 0.28, begin: 6.700, index: 22 },
  { text: " bir", duration: 0.28, begin: 7.100, index: 23 },
  { text: " kral", duration: 0.28, begin: 7.400, index: 24 },
  { text: " var", duration: 0.28, begin: 7.700, index: 25 },
  { text: "dı.", duration: 0.28, begin: 8.000, index: 26 },
  { text: " Kral,", duration: 0.28, begin: 9.000, index: 27 },
  { text: " da", duration: 0.28, begin: 10.200, index: 28 },
  { text: "ha", duration: 0.28, begin: 10.400, index: 29 },
  { text: " ço", duration: 0.38, begin: 10.600, index: 30 },
  { text: "cuk", duration: 0.38, begin: 10.800, index: 31 },
  { text: "lu", duration: 0.38, begin: 11.000, index: 32 },
  { text: "ğun", duration: 0.38, begin: 11.200, index: 33 },
  { text: "dan", duration: 0.38, begin: 11.400, index: 34 },
  { text: " i", duration: 0.38, begin: 11.600, index: 35 },
  { text: "ti", duration: 0.38, begin: 11.900, index: 36 },
  { text: "ba", duration: 0.38, begin: 12.100, index: 37 },
  { text: "ren", duration: 0.38, begin: 12.300, index: 38 },
  { text: " ar", duration: 0.28, begin: 13.300, index: 39 },
  { text: "ka", duration: 0.28, begin: 13.500, index: 40 },
  { text: "daş", duration: 0.28, begin: 13.700, index: 41 },
  { text: " ol", duration: 0.28, begin: 14.100, index: 42 },
  { text: "du", duration: 0.28, begin: 14.300, index: 43 },
  { text: "ğu,", duration: 0.28, begin: 14.500, index: 44 },
  { text: " bir", duration: 0.28, begin: 15.300, index: 45 },
  { text: "lik", duration: 0.28, begin: 15.500, index: 46 },
  { text: "te", duration: 0.28, begin: 15.700, index: 47 },
  { text: " bü", duration: 0.40, begin: 15.900, index: 48 },
  { text: "yü", duration: 0.40, begin: 16.100, index: 49 },
  { text: "dü", duration: 0.40, begin: 16.300, index: 50 },
  { text: "ğü", duration: 0.40, begin: 16.500, index: 51 },
  { text: " bir", duration: 0.40, begin: 16.700, index: 52 },
  { text: " dos", duration: 0.40, begin: 16.900, index: 53 },
  { text: "tu", duration: 0.40, begin: 17.100, index: 54 },
  { text: "nu", duration: 0.40, begin: 17.300, index: 55 },
  { text: " hiç", duration: 0.40, begin: 18.300, index: 56 },
  { text: " ya", duration: 0.40, begin: 18.600, index: 57 },
  { text: "nın", duration: 0.40, begin: 18.800, index: 58 },
  { text: "dan", duration: 0.40, begin: 19.000, index: 59 },
  { text: " a", duration: 0.35, begin: 19.300, index: 60 },
  { text: "yır", duration: 0.35, begin: 19.500, index: 61 },
  { text: "maz", duration: 0.35, begin: 19.700, index: 62 },
  { text: "dı.", duration: 0.35, begin: 19.900, index: 63 },
  { text: " Ne", duration: 0.28, begin: 21.000, index: 64 },
  { text: "re", duration: 0.28, begin: 21.200, index: 65 },
  { text: "ye", duration: 0.28, begin: 21.400, index: 66 },
  { text: " git", duration: 0.28, begin: 21.600, index: 67 },
  { text: "se", duration: 0.28, begin: 21.800, index: 68 },
  { text: " o", duration: 0.28, begin: 22.800, index: 69 },
  { text: "nu", duration: 0.28, begin: 23.000, index: 70 },
  { text: "da", duration: 0.28, begin: 23.200, index: 71 },
  { text: " be", duration: 0.18, begin: 23.400, index: 72 },
  { text: "ra", duration: 0.18, begin: 23.600, index: 73 },
  { text: "be", duration: 0.18, begin: 23.800, index: 74 },
  { text: "rin", duration: 0.18, begin: 24.000, index: 75 },
  { text: "de", duration: 0.18, begin: 24.200, index: 76 },
  { text: " gö", duration: 0.28, begin: 24.400, index: 77 },
  { text: "tü", duration: 0.28, begin: 24.600, index: 78 },
  { text: "rür", duration: 0.28, begin: 24.800, index: 79 },
  { text: "dü.", duration: 0.28, begin: 25.000, index: 80 },
  { text: " Kral", duration: 0.28, begin: 26.000, index: 81 },
  { text: "ın", duration: 0.28, begin: 26.200, index: 82 },
  { text: " bu", duration: 0.28, begin: 26.500, index: 83 },
  { text: " ar", duration: 0.28, begin: 26.700, index: 84 },
  { text: "ka", duration: 0.28, begin: 26.900, index: 85 },
  { text: "da", duration: 0.28, begin: 27.100, index: 86 },
  { text: "şı", duration: 0.28, begin: 27.300, index: 87 },
  { text: "nın", duration: 0.28, begin: 27.500, index: 88 },
  { text: " i", duration: 0.28, begin: 27.700, index: 89 },
  { text: "se", duration: 0.28, begin: 27.900, index: 90 },
  { text: " de", duration: 0.28, begin: 28.800, index: 91 },
  { text: "ği", duration: 0.28, begin: 29.000, index: 92 },
  { text: "şik", duration: 0.28, begin: 29.200, index: 93 },
  { text: " bir", duration: 0.28, begin: 29.400, index: 94 },
  { text: " hu", duration: 0.28, begin: 29.600, index: 95 },
  { text: "yu", duration: 0.28, begin: 29.800, index: 96 },
  { text: " var", duration: 0.28, begin: 30.000, index: 97 },
  { text: "dı.", duration: 0.28, begin: 30.200, index: 98 },
  { text: " İs", duration: 0.40, begin: 31.200, index: 99 },
  { text: "ter", duration: 0.40, begin: 31.400, index: 100 },
  { text: " ken", duration: 0.40, begin: 31.800, index: 101 },
  { text: "di", duration: 0.40, begin: 32.000, index: 102 },
  { text: " ba", duration: 0.40, begin: 32.400, index: 103 },
  { text: "şı", duration: 0.40, begin: 32.600, index: 104 },
  { text: "na", duration: 0.40, begin: 32.800, index: 105 },
  { text: " gel", duration: 0.40, begin: 33.000, index: 106 },
  { text: "sin", duration: 0.40, begin: 33.200, index: 107 },
  { text: " is", duration: 0.28, begin: 34.200, index: 108 },
  { text: "ter", duration: 0.28, begin: 34.400, index: 109 },
  { text: " baş", duration: 0.28, begin: 34.600, index: 110 },
  { text: "ka", duration: 0.28, begin: 34.800, index: 111 },
  { text: "sı", duration: 0.28, begin: 35.000, index: 112 },
  { text: "nın,", duration: 0.28, begin: 35.200, index: 113 },
  { text: " is", duration: 0.28, begin: 36.200, index: 114 },
  { text: "ter", duration: 0.28, begin: 36.400, index: 115 },
  { text: " i", duration: 0.28, begin: 36.600, index: 116 },
  { text: "yi", duration: 0.28, begin: 36.800, index: 117 },
  { text: " ol", duration: 0.28, begin: 37.000, index: 118 },
  { text: "sun", duration: 0.28, begin: 37.200, index: 119 },
  { text: " is", duration: 0.28, begin: 37.800, index: 120 },
  { text: "ter", duration: 0.28, begin: 38.000, index: 121 },
  { text: " kö", duration: 0.28, begin: 38.200, index: 122 },
  { text: "tü", duration: 0.28, begin: 38.400, index: 123 },
  { text: " her", duration: 0.28, begin: 39.600, index: 124 },
  { text: " o", duration: 0.28, begin: 39.800, index: 125 },
  { text: "lay", duration: 0.28, begin: 40.000, index: 126 },
  { text: " kar", duration: 0.40, begin: 40.400, index: 127 },
  { text: "şı", duration: 0.40, begin: 40.600, index: 128 },
  { text: "sın", duration: 0.40, begin: 40.800, index: 129 },
  { text: "da", duration: 0.40, begin: 41.000, index: 130 },
  { text: " hep", duration: 0.40, begin: 41.400, index: 131 },
  { text: " ay", duration: 0.40, begin: 41.800, index: 132 },
  { text: "nı", duration: 0.40, begin: 42.000, index: 133 },
  { text: " şe", duration: 0.40, begin: 42.150, index: 134 },
  { text: "yi", duration: 0.40, begin: 42.300, index: 135 },
  { text: " söy", duration: 0.50, begin: 42.500, index: 136 },
  { text: "ler", duration: 0.50, begin: 42.700, index: 137 },
  { text: "di:", duration: 0.50, begin: 42.900, index: 138 },
  { text: " \"Bun", duration: 0.40, begin: 44.200, index: 139 },
  { text: "da", duration: 0.40, begin: 44.400, index: 140 },
  { text: " da", duration: 0.40, begin: 44.600, index: 141 },
  { text: " bir", duration: 0.40, begin: 44.800, index: 142 },
  { text: " ha", duration: 0.40, begin: 45.000, index: 143 },
  { text: "yır", duration: 0.40, begin: 45.200, index: 144 },
  { text: " var!\"", duration: 0.40, begin: 45.400, index: 145 },
  { text: " Bir", duration: 0.28, begin: 47.000, index: 146 },
  { text: " gün", duration: 0.28, begin: 47.250, index: 147 },
  { text: " kral", duration: 0.28, begin: 47.500, index: 148 },
  { text: "la", duration: 0.28, begin: 47.750, index: 149 },
  { text: " ar", duration: 0.28, begin: 48.250, index: 150 },
  { text: "ka", duration: 0.28, begin: 48.500, index: 151 },
  { text: "da", duration: 0.28, begin: 48.750, index: 152 },
  { text: "şı", duration: 0.28, begin: 49.000, index: 153 },
  { text: " bir", duration: 0.28, begin: 49.250, index: 154 },
  { text: "lik", duration: 0.28, begin: 49.500, index: 155 },
  { text: "te", duration: 0.28, begin: 49.750, index: 156 },
  { text: " a", duration: 0.28, begin: 50.000, index: 157 },
  { text: "va", duration: 0.28, begin: 50.250, index: 158 },
  { text: " çı", duration: 0.28, begin: 50.500, index: 159 },
  { text: "kar", duration: 0.28, begin: 50.750, index: 160 },
  { text: "lar.", duration: 0.28, begin: 51.000, index: 161 },
  { text: " Kral", duration: 0.28, begin: 52.000, index: 162 },
  { text: "ın", duration: 0.28, begin: 52.250, index: 163 },
  { text: " ar", duration: 0.10, begin: 52.500, index: 164 },
  { text: "ka", duration: 0.10, begin: 52.750, index: 165 },
  { text: "da", duration: 0.10, begin: 53.000, index: 166 },
  { text: "şı", duration: 0.10, begin: 53.250, index: 167 },
  { text: " tü", duration: 0.10, begin: 53.500, index: 168 },
  { text: "fek", duration: 0.10, begin: 53.700, index: 169 },
  { text: "le", duration: 0.10, begin: 53.900, index: 170 },
  { text: "ri", duration: 0.10, begin: 54.100, index: 171 },
  { text: " dol", duration: 0.10, begin: 54.300, index: 172 },
  { text: "du", duration: 0.10, begin: 54.500, index: 173 },
  { text: "ru", duration: 0.10, begin: 54.700, index: 174 },
  { text: "yor,", duration: 0.10, begin: 54.900, index: 175 },
  { text: " kral", duration: 0.28, begin: 55.750, index: 176 },
  { text: "a", duration: 0.28, begin: 56.000, index: 177 },
  { text: " ve", duration: 0.28, begin: 56.250, index: 178 },
  { text: "ri", duration: 0.28, begin: 56.500, index: 179 },
  { text: "yor,", duration: 0.28, begin: 56.750, index: 180 },
  { text: " kral", duration: 0.28, begin: 57.500, index: 181 },
  { text: "da", duration: 0.28, begin: 57.750, index: 182 },
  { text: " a", duration: 0.28, begin: 58.000, index: 183 },
  { text: "teş", duration: 0.28, begin: 58.250, index: 184 },
  { text: " e", duration: 0.28, begin: 58.500, index: 185 },
  { text: "di", duration: 0.28, begin: 58.750, index: 186 },
  { text: "yor", duration: 0.28, begin: 59.000, index: 187 },
  { text: "du.", duration: 0.28, begin: 59.250, index: 188 },
  { text: " Ar", duration: 0.28, begin: 60.250, index: 189 },
  { text: "ka", duration: 0.28, begin: 60.500, index: 190 },
  { text: "da", duration: 0.28, begin: 60.750, index: 191 },
  { text: "şı", duration: 0.28, begin: 61.000, index: 192 },
  { text: " muh", duration: 0.28, begin: 61.200, index: 193 },
  { text: "te", duration: 0.28, begin: 61.400, index: 194 },
  { text: "me", duration: 0.28, begin: 61.600, index: 195 },
  { text: "len", duration: 0.28, begin: 61.800, index: 196 },
  { text: " tü", duration: 0.28, begin: 62.000, index: 197 },
  { text: "fek", duration: 0.28, begin: 62.200, index: 198 },
  { text: "ler", duration: 0.28, begin: 62.400, index: 199 },
  { text: "den", duration: 0.28, begin: 62.600, index: 200 },
  { text: " bi", duration: 0.28, begin: 62.900, index: 201 },
  { text: "ri", duration: 0.28, begin: 63.100, index: 202 },
  { text: "ni", duration: 0.28, begin: 63.300, index: 203 },
  { text: " dol", duration: 0.28, begin: 63.600, index: 204 },
  { text: "du", duration: 0.28, begin: 63.800, index: 205 },
  { text: "rur", duration: 0.28, begin: 64.100, index: 206 },
  { text: "ken", duration: 0.28, begin: 64.300, index: 207 },
  { text: " bir", duration: 0.28, begin: 65.250, index: 208 },
  { text: " yan", duration: 0.28, begin: 65.500, index: 209 },
  { text: "lış", duration: 0.28, begin: 65.750, index: 210 },
  { text: "lık", duration: 0.28, begin: 66.000, index: 211 },
  { text: " yap", duration: 0.28, begin: 66.500, index: 212 },
  { text: "tı", duration: 0.28, begin: 66.750, index: 213 },
  { text: " ve", duration: 0.28, begin: 67.000, index: 214 },
  { text: " kral", duration: 0.28, begin: 68.000, index: 215 },
  { text: " a", duration: 0.28, begin: 68.500, index: 216 },
  { text: "teş", duration: 0.28, begin: 68.750, index: 217 },
  { text: " e", duration: 0.28, begin: 69.000, index: 218 },
  { text: "der", duration: 0.28, begin: 69.250, index: 219 },
  { text: "ken", duration: 0.28, begin: 69.500, index: 220 },
  { text: " tü", duration: 0.28, begin: 70.000, index: 221 },
  { text: "fe", duration: 0.28, begin: 70.250, index: 222 },
  { text: "ği", duration: 0.28, begin: 70.500, index: 223 },
  { text: " ge", duration: 0.28, begin: 70.750, index: 224 },
  { text: "ri", duration: 0.28, begin: 71.000, index: 225 },
  { text: "ye", duration: 0.28, begin: 71.250, index: 226 },
  { text: " doğ", duration: 0.10, begin: 71.500, index: 227 },
  { text: "ru", duration: 0.10, begin: 71.750, index: 228 },
  { text: " pat", duration: 0.30, begin: 72.000, index: 229 },
  { text: "la", duration: 0.30, begin: 72.250, index: 230 },
  { text: "dı", duration: 0.30, begin: 72.500, index: 231 },
  { text: " ve", duration: 0.30, begin: 73.500, index: 232 },
  { text: " kral", duration: 0.10, begin: 73.750, index: 233 },
  { text: "ın", duration: 0.10, begin: 74.000, index: 234 },
  { text: " baş", duration: 0.10, begin: 74.250, index: 235 },
  { text: " par", duration: 0.10, begin: 74.500, index: 236 },
  { text: "ma", duration: 0.10, begin: 74.750, index: 237 },
  { text: "ğı", duration: 0.10, begin: 75.000, index: 238 },
  { text: " kop", duration: 0.28, begin: 75.250, index: 239 },
  { text: "tu.", duration: 0.28, begin: 75.500, index: 240 },
  { text: " Du", duration: 0.18, begin: 76.750, index: 241 },
  { text: "ru", duration: 0.18, begin: 77.000, index: 242 },
  { text: "mu", duration: 0.18, begin: 77.250, index: 243 },
  { text: " gö", duration: 0.18, begin: 77.500, index: 244 },
  { text: "ren", duration: 0.18, begin: 77.750, index: 245 },
  { text: " ar", duration: 0.18, begin: 78.000, index: 246 },
  { text: "ka", duration: 0.18, begin: 78.250, index: 247 },
  { text: "da", duration: 0.18, begin: 78.500, index: 248 },
  { text: "şı", duration: 0.18, begin: 78.750, index: 249 },
  { text: " her", duration: 0.28, begin: 79.250, index: 250 },
  { text: " za", duration: 0.28, begin: 79.500, index: 251 },
  { text: "man", duration: 0.28, begin: 79.750, index: 252 },
  { text: " ki", duration: 0.28, begin: 80.000, index: 253 },
  { text: " sö", duration: 0.28, begin: 80.250, index: 254 },
  { text: "zü", duration: 0.28, begin: 80.500, index: 255 },
  { text: "nü", duration: 0.28, begin: 80.750, index: 256 },
  { text: " söy", duration: 0.28, begin: 81.000, index: 257 },
  { text: "le", duration: 0.28, begin: 81.250, index: 258 },
  { text: "di:", duration: 0.28, begin: 81.500, index: 259 },
  { text: " \"Bun", duration: 0.28, begin: 82.500, index: 260 },
  { text: "da", duration: 0.28, begin: 82.700, index: 261 },
  { text: " da", duration: 0.28, begin: 82.900, index: 262 },
  { text: " bir", duration: 0.28, begin: 83.100, index: 263 },
  { text: " ha", duration: 0.28, begin: 83.300, index: 264 },
  { text: "yır", duration: 0.28, begin: 83.500, index: 265 },
  { text: " var!\"", duration: 0.28, begin: 83.700, index: 266 },
  { text: " Kral", duration: 0.28, begin: 85.000, index: 267 },
  { text: " a", duration: 0.28, begin: 85.500, index: 268 },
  { text: "cı", duration: 0.28, begin: 85.750, index: 269 },
  { text: " ve", duration: 0.28, begin: 86.000, index: 270 },
  { text: " öf", duration: 0.28, begin: 86.250, index: 271 },
  { text: "key", duration: 0.28, begin: 86.500, index: 272 },
  { text: "le", duration: 0.28, begin: 86.750, index: 273 },
  { text: " ba", duration: 0.28, begin: 87.000, index: 274 },
  { text: "ğır", duration: 0.28, begin: 87.250, index: 275 },
  { text: "dı:", duration: 0.28, begin: 87.500, index: 276 },
  { text: " \"Bun", duration: 0.28, begin: 88.250, index: 277 },
  { text: "da", duration: 0.28, begin: 88.500, index: 278 },
  { text: " ha", duration: 0.28, begin: 88.750, index: 279 },
  { text: "yır", duration: 0.28, begin: 89.000, index: 280 },
  { text: " fi", duration: 0.28, begin: 89.250, index: 281 },
  { text: "lan", duration: 0.28, begin: 89.500, index: 282 },
  { text: " yok!", duration: 0.28, begin: 89.750, index: 283 },
  { text: " Gör", duration: 0.28, begin: 90.750, index: 284 },
  { text: "mü", duration: 0.28, begin: 91.000, index: 285 },
  { text: "yor", duration: 0.28, begin: 91.250, index: 286 },
  { text: " mu", duration: 0.28, begin: 91.500, index: 287 },
  { text: "sun,", duration: 0.28, begin: 91.750, index: 288 },
  { text: " par", duration: 0.28, begin: 92.250, index: 289 },
  { text: "ma", duration: 0.28, begin: 92.500, index: 290 },
  { text: "ğım", duration: 0.28, begin: 92.750, index: 291 },
  { text: " kop", duration: 0.28, begin: 93.000, index: 292 },
  { text: "tu!\"", duration: 0.28, begin: 93.250, index: 293 },
  { text: " Ve", duration: 0.28, begin: 94.250, index: 294 },
  { text: " son", duration: 0.28, begin: 94.500, index: 295 },
  { text: "ra", duration: 0.28, begin: 94.750, index: 296 },
  { text: " kız", duration: 0.28, begin: 95.500, index: 297 },
  { text: "gın", duration: 0.28, begin: 95.750, index: 298 },
  { text: "lı", duration: 0.28, begin: 96.000, index: 299 },
  { text: "ğı", duration: 0.28, begin: 96.250, index: 300 },
  { text: " geç", duration: 0.28, begin: 96.500, index: 301 },
  { text: "me", duration: 0.28, begin: 96.750, index: 302 },
  { text: "di", duration: 0.28, begin: 97.000, index: 303 },
  { text: "ği", duration: 0.28, begin: 97.250, index: 304 },
  { text: " i", duration: 0.28, begin: 97.500, index: 305 },
  { text: "çin", duration: 0.28, begin: 97.750, index: 306 },
  { text: " ar", duration: 0.28, begin: 98.250, index: 307 },
  { text: "ka", duration: 0.28, begin: 98.500, index: 308 },
  { text: "da", duration: 0.28, begin: 98.750, index: 309 },
  { text: "şı", duration: 0.28, begin: 99.000, index: 310 },
  { text: "nı", duration: 0.28, begin: 99.250, index: 311 },
  { text: " zin", duration: 0.28, begin: 99.500, index: 312 },
  { text: "da", duration: 0.28, begin: 99.750, index: 313 },
  { text: "na", duration: 0.28, begin: 100.000, index: 314 },
  { text: " at", duration: 0.28, begin: 100.250, index: 315 },
  { text: "tır", duration: 0.28, begin: 100.500, index: 316 },
  { text: "dı.", duration: 0.28, begin: 100.750, index: 317 },
  { text: " Bir", duration: 0.28, begin: 102.000, index: 318 },
  { text: " yıl", duration: 0.28, begin: 102.250, index: 319 },
  { text: " ka", duration: 0.28, begin: 102.500, index: 320 },
  { text: "dar", duration: 0.28, begin: 102.750, index: 321 },
  { text: " son", duration: 0.28, begin: 103.000, index: 322 },
  { text: "ra,", duration: 0.28, begin: 103.250, index: 323 },
  { text: " kral", duration: 0.28, begin: 104.250, index: 324 },
  { text: " in", duration: 0.28, begin: 104.750, index: 325 },
  { text: "san", duration: 0.28, begin: 105.000, index: 326 },
  { text: " yi", duration: 0.28, begin: 105.250, index: 327 },
  { text: "yen", duration: 0.28, begin: 105.500, index: 328 },
  { text: " ka", duration: 0.28, begin: 105.750, index: 329 },
  { text: "bi", duration: 0.28, begin: 106.000, index: 330 },
  { text: "le", duration: 0.28, begin: 106.250, index: 331 },
  { text: "le", duration: 0.28, begin: 106.500, index: 332 },
  { text: "rin", duration: 0.28, begin: 106.750, index: 333 },
  { text: " ya", duration: 0.28, begin: 107.000, index: 334 },
  { text: "şa", duration: 0.28, begin: 107.250, index: 335 },
  { text: "dı", duration: 0.28, begin: 107.500, index: 336 },
  { text: "ğı", duration: 0.28, begin: 107.750, index: 337 },
  { text: " ve", duration: 0.28, begin: 108.000, index: 338 },
  { text: " as", duration: 0.28, begin: 108.750, index: 339 },
  { text: "lın", duration: 0.28, begin: 109.000, index: 340 },
  { text: "da", duration: 0.28, begin: 109.250, index: 341 },
  { text: " u", duration: 0.28, begin: 109.500, index: 342 },
  { text: "zak", duration: 0.28, begin: 109.750, index: 343 },
  { text: " dur", duration: 0.28, begin: 110.000, index: 344 },
  { text: "ma", duration: 0.28, begin: 110.250, index: 345 },
  { text: "sı", duration: 0.28, begin: 110.500, index: 346 },
  { text: " ge", duration: 0.28, begin: 110.750, index: 347 },
  { text: "re", duration: 0.28, begin: 111.000, index: 348 },
  { text: "ken", duration: 0.28, begin: 111.250, index: 349 },
  { text: " bir", duration: 0.28, begin: 111.500, index: 350 },
  { text: " böl", duration: 0.28, begin: 111.750, index: 351 },
  { text: "ge", duration: 0.28, begin: 112.000, index: 352 },
  { text: "de", duration: 0.28, begin: 112.250, index: 353 },
  { text: " bir", duration: 0.28, begin: 113.000, index: 354 },
  { text: "kaç", duration: 0.28, begin: 113.250, index: 355 },
  { text: " a", duration: 0.28, begin: 113.500, index: 356 },
  { text: "da", duration: 0.28, begin: 113.750, index: 357 },
  { text: "mıy", duration: 0.28, begin: 114.000, index: 358 },
  { text: "la", duration: 0.28, begin: 114.250, index: 359 },
  { text: " bir", duration: 0.28, begin: 114.500, index: 360 },
  { text: "lik", duration: 0.28, begin: 114.750, index: 361 },
  { text: "te", duration: 0.28, begin: 115.000, index: 362 },
  { text: " av", duration: 0.28, begin: 115.600, index: 363 },
  { text: "la", duration: 0.28, begin: 115.800, index: 364 },
  { text: "nı", duration: 0.28, begin: 116.000, index: 365 },
  { text: "yor", duration: 0.28, begin: 116.200, index: 366 },
  { text: "du.", duration: 0.28, begin: 116.400, index: 367 },
  { text: " Yam", duration: 0.28, begin: 117.500, index: 368 },
  { text: " yam", duration: 0.28, begin: 117.750, index: 369 },
  { text: "lar", duration: 0.28, begin: 118.000, index: 370 },
  { text: " on", duration: 0.28, begin: 118.500, index: 371 },
  { text: "la", duration: 0.28, begin: 118.750, index: 372 },
  { text: "rı", duration: 0.28, begin: 119.000, index: 373 },
  { text: " e", duration: 0.28, begin: 119.200, index: 374 },
  { text: "le", duration: 0.28, begin: 119.400, index: 375 },
  { text: " ge", duration: 0.28, begin: 119.600, index: 376 },
  { text: "çir", duration: 0.28, begin: 119.800, index: 377 },
  { text: "dil", duration: 0.28, begin: 120.000, index: 378 },
  { text: "ler", duration: 0.28, begin: 120.200, index: 379 },
  { text: " ve", duration: 0.28, begin: 120.400, index: 380 },
  { text: " köy", duration: 0.28, begin: 121.250, index: 381 },
  { text: "le", duration: 0.28, begin: 121.500, index: 382 },
  { text: "ri", duration: 0.28, begin: 121.750, index: 383 },
  { text: "ne", duration: 0.28, begin: 122.000, index: 384 },
  { text: " gö", duration: 0.28, begin: 122.250, index: 385 },
  { text: "tür", duration: 0.28, begin: 122.500, index: 386 },
  { text: "dü", duration: 0.28, begin: 122.750, index: 387 },
  { text: "ler.", duration: 0.28, begin: 123.000, index: 388 },
  { text: " El", duration: 0.28, begin: 124.000, index: 389 },
  { text: "le", duration: 0.28, begin: 124.250, index: 390 },
  { text: "ri", duration: 0.28, begin: 124.500, index: 391 },
  { text: "ni,", duration: 0.28, begin: 124.750, index: 392 },
  { text: " a", duration: 0.28, begin: 125.500, index: 393 },
  { text: "yak", duration: 0.28, begin: 125.700, index: 394 },
  { text: "la", duration: 0.28, begin: 125.900, index: 395 },
  { text: "rı", duration: 0.28, begin: 126.100, index: 396 },
  { text: "nı", duration: 0.28, begin: 126.300, index: 397 },
  { text: " bağ", duration: 0.28, begin: 126.500, index: 398 },
  { text: "la", duration: 0.28, begin: 126.700, index: 399 },
  { text: "dı", duration: 0.28, begin: 126.900, index: 400 },
  { text: "lar", duration: 0.28, begin: 127.000, index: 401 },
  { text: " ve", duration: 0.28, begin: 127.250, index: 402 },
  { text: " kö", duration: 0.28, begin: 128.000, index: 403 },
  { text: "yün", duration: 0.28, begin: 128.250, index: 404 },
  { text: " mey", duration: 0.28, begin: 128.500, index: 405 },
  { text: "da", duration: 0.28, begin: 128.750, index: 406 },
  { text: "nı", duration: 0.28, begin: 129.000, index: 407 },
  { text: "na", duration: 0.28, begin: 129.250, index: 408 },
  { text: " o", duration: 0.28, begin: 129.750, index: 409 },
  { text: "dun", duration: 0.28, begin: 130.000, index: 410 },
  { text: " yığ", duration: 0.28, begin: 130.250, index: 411 },
  { text: "dı", duration: 0.28, begin: 130.500, index: 412 },
  { text: "lar.", duration: 0.28, begin: 130.750, index: 413 },
  { text: " Son", duration: 0.28, begin: 131.750, index: 414 },
  { text: "ra", duration: 0.28, begin: 132.000, index: 415 },
  { text: "da", duration: 0.28, begin: 132.250, index: 416 },
  { text: " o", duration: 0.28, begin: 132.500, index: 417 },
  { text: "dun", duration: 0.28, begin: 132.750, index: 418 },
  { text: "la", duration: 0.28, begin: 133.000, index: 419 },
  { text: "rın", duration: 0.28, begin: 133.250, index: 420 },
  { text: " or", duration: 0.28, begin: 133.500, index: 421 },
  { text: "ta", duration: 0.28, begin: 133.750, index: 422 },
  { text: "sı", duration: 0.28, begin: 134.000, index: 423 },
  { text: "na", duration: 0.28, begin: 134.250, index: 424 },
  { text: " dik", duration: 0.28, begin: 134.500, index: 425 },
  { text: "tik", duration: 0.28, begin: 134.750, index: 426 },
  { text: "le", duration: 0.28, begin: 135.000, index: 427 },
  { text: "ri", duration: 0.28, begin: 135.250, index: 428 },
  { text: " di", duration: 0.28, begin: 135.500, index: 429 },
  { text: "rek", duration: 0.28, begin: 135.700, index: 430 },
  { text: "le", duration: 0.28, begin: 135.900, index: 431 },
  { text: "re", duration: 0.28, begin: 136.100, index: 432 },
  { text: " bağ", duration: 0.28, begin: 136.300, index: 433 },
  { text: "la", duration: 0.28, begin: 136.500, index: 434 },
  { text: "dı", duration: 0.28, begin: 136.700, index: 435 },
  { text: "lar.", duration: 0.28, begin: 136.900, index: 436 },
  { text: " Tam", duration: 0.28, begin: 138.250, index: 437 },
  { text: " o", duration: 0.28, begin: 138.500, index: 438 },
  { text: "dun", duration: 0.28, begin: 138.750, index: 439 },
  { text: "la", duration: 0.28, begin: 139.000, index: 440 },
  { text: "rı", duration: 0.28, begin: 139.250, index: 441 },
  { text: " tu", duration: 0.28, begin: 139.500, index: 442 },
  { text: "tuş", duration: 0.28, begin: 139.750, index: 443 },
  { text: "tur", duration: 0.28, begin: 140.000, index: 444 },
  { text: "ma", duration: 0.28, begin: 140.250, index: 445 },
  { text: "ya", duration: 0.28, begin: 140.500, index: 446 },
  { text: " ge", duration: 0.28, begin: 140.700, index: 447 },
  { text: "li", duration: 0.28, begin: 140.900, index: 448 },
  { text: "yor", duration: 0.28, begin: 141.100, index: 449 },
  { text: "lar", duration: 0.28, begin: 141.300, index: 450 },
  { text: "dı", duration: 0.28, begin: 141.500, index: 451 },
  { text: " ki,", duration: 0.28, begin: 141.700, index: 452 },
  { text: " kral", duration: 0.28, begin: 142.900, index: 453 },
  { text: "ın", duration: 0.28, begin: 143.100, index: 454 },
  { text: " baş", duration: 0.40, begin: 143.250, index: 455 },
  { text: " par", duration: 0.40, begin: 143.500, index: 456 },
  { text: "ma", duration: 0.40, begin: 143.750, index: 457 },
  { text: "ğı", duration: 0.40, begin: 144.000, index: 458 },
  { text: "nın", duration: 0.40, begin: 144.250, index: 459 },
  { text: " ol", duration: 0.28, begin: 144.500, index: 460 },
  { text: "ma", duration: 0.28, begin: 144.750, index: 461 },
  { text: "dı", duration: 0.28, begin: 145.000, index: 462 },
  { text: "ğı", duration: 0.28, begin: 145.250, index: 463 },
  { text: "nı", duration: 0.28, begin: 145.500, index: 464 },
  { text: " fark", duration: 0.28, begin: 145.750, index: 465 },
  { text: " et", duration: 0.28, begin: 146.000, index: 466 },
  { text: "ti", duration: 0.28, begin: 146.250, index: 467 },
  { text: "ler.", duration: 0.28, begin: 146.500, index: 468 },
  { text: " Bu", duration: 0.28, begin: 147.750, index: 469 },
  { text: " ka", duration: 0.28, begin: 148.000, index: 470 },
  { text: "bi", duration: 0.28, begin: 148.250, index: 471 },
  { text: "le,", duration: 0.28, begin: 148.500, index: 472 },
  { text: " ba", duration: 0.28, begin: 149.250, index: 473 },
  { text: "tıl", duration: 0.28, begin: 149.500, index: 474 },
  { text: " i", duration: 0.28, begin: 149.750, index: 475 },
  { text: "nanç", duration: 0.28, begin: 150.000, index: 476 },
  { text: "la", duration: 0.28, begin: 150.250, index: 477 },
  { text: "rı", duration: 0.28, begin: 150.500, index: 478 },
  { text: " ne", duration: 0.28, begin: 150.750, index: 479 },
  { text: "de", duration: 0.28, begin: 151.000, index: 480 },
  { text: "niy", duration: 0.28, begin: 151.250, index: 481 },
  { text: "le", duration: 0.28, begin: 151.500, index: 482 },
  { text: " u", duration: 0.28, begin: 152.250, index: 483 },
  { text: "zuv", duration: 0.28, begin: 152.500, index: 484 },
  { text: "la", duration: 0.28, begin: 152.750, index: 485 },
  { text: "rın", duration: 0.28, begin: 153.000, index: 486 },
  { text: "dan", duration: 0.28, begin: 153.250, index: 487 },
  { text: " bi", duration: 0.28, begin: 153.500, index: 488 },
  { text: "ri", duration: 0.28, begin: 153.750, index: 489 },
  { text: " ek", duration: 0.28, begin: 154.000, index: 490 },
  { text: "sik", duration: 0.28, begin: 154.250, index: 491 },
  { text: " o", duration: 0.28, begin: 154.500, index: 492 },
  { text: "lan", duration: 0.28, begin: 154.750, index: 493 },
  { text: " in", duration: 0.28, begin: 155.000, index: 494 },
  { text: "san", duration: 0.28, begin: 155.250, index: 495 },
  { text: "la", duration: 0.28, begin: 155.500, index: 496 },
  { text: "rı", duration: 0.28, begin: 155.750, index: 497 },
  { text: " ye", duration: 0.28, begin: 156.500, index: 498 },
  { text: "mi", duration: 0.28, begin: 156.750, index: 499 },
  { text: "yor", duration: 0.28, begin: 157.000, index: 500 },
  { text: "du.", duration: 0.28, begin: 157.250, index: 501 },
  { text: " Böy", duration: 0.28, begin: 158.750, index: 502 },
  { text: "le", duration: 0.28, begin: 159.000, index: 503 },
  { text: " bir", duration: 0.28, begin: 159.250, index: 504 },
  { text: " in", duration: 0.28, begin: 159.500, index: 505 },
  { text: "sa", duration: 0.28, begin: 159.750, index: 506 },
  { text: "nı", duration: 0.28, begin: 160.000, index: 507 },
  { text: " ye", duration: 0.28, begin: 160.250, index: 508 },
  { text: "dik", duration: 0.28, begin: 160.500, index: 509 },
  { text: "le", duration: 0.28, begin: 160.750, index: 510 },
  { text: "ri", duration: 0.28, begin: 161.000, index: 511 },
  { text: " tak", duration: 0.28, begin: 161.250, index: 512 },
  { text: "dir", duration: 0.28, begin: 161.500, index: 513 },
  { text: "de", duration: 0.28, begin: 161.750, index: 514 },
  { text: " baş", duration: 0.28, begin: 162.500, index: 515 },
  { text: "la", duration: 0.28, begin: 162.700, index: 516 },
  { text: "rı", duration: 0.28, begin: 162.900, index: 517 },
  { text: "na", duration: 0.28, begin: 163.100, index: 518 },
  { text: " kö", duration: 0.28, begin: 163.500, index: 519 },
  { text: "tü", duration: 0.28, begin: 163.700, index: 520 },
  { text: " şey", duration: 0.28, begin: 163.900, index: 521 },
  { text: "ler", duration: 0.28, begin: 164.100, index: 522 },
  { text: " ge", duration: 0.13, begin: 164.500, index: 523 },
  { text: "le", duration: 0.13, begin: 164.700, index: 524 },
  { text: "ce", duration: 0.13, begin: 164.900, index: 525 },
  { text: "ği", duration: 0.13, begin: 165.100, index: 526 },
  { text: "ne", duration: 0.13, begin: 165.300, index: 527 },
  { text: " i", duration: 0.28, begin: 165.500, index: 528 },
  { text: "na", duration: 0.28, begin: 165.700, index: 529 },
  { text: "nı", duration: 0.28, begin: 165.900, index: 530 },
  { text: "yor", duration: 0.28, begin: 166.100, index: 531 },
  { text: "lar", duration: 0.28, begin: 166.300, index: 532 },
  { text: "dı.", duration: 0.28, begin: 166.500, index: 533 },
  { text: " Bu", duration: 0.40, begin: 167.500, index: 534 },
  { text: " kor", duration: 0.40, begin: 167.700, index: 535 },
  { text: "kuy", duration: 0.40, begin: 167.900, index: 536 },
  { text: "la,", duration: 0.40, begin: 168.100, index: 537 },
  { text: " kral", duration: 0.28, begin: 169.300, index: 538 },
  { text: "ı", duration: 0.28, begin: 169.500, index: 539 },
  { text: " çöz", duration: 0.38, begin: 169.700, index: 540 },
  { text: "dü", duration: 0.38, begin: 169.900, index: 541 },
  { text: "ler", duration: 0.38, begin: 170.100, index: 542 },
  { text: " ve", duration: 0.38, begin: 170.300, index: 543 },
  { text: " sa", duration: 0.38, begin: 170.700, index: 544 },
  { text: "lı", duration: 0.38, begin: 170.900, index: 545 },
  { text: "ver", duration: 0.38, begin: 171.100, index: 546 },
  { text: "di", duration: 0.38, begin: 171.300, index: 547 },
  { text: "ler.", duration: 0.38, begin: 171.500, index: 548 },
  { text: " Di", duration: 0.28, begin: 172.700, index: 549 },
  { text: "ğer", duration: 0.28, begin: 172.900, index: 550 },
  { text: " a", duration: 0.28, begin: 173.100, index: 551 },
  { text: "dam", duration: 0.28, begin: 173.300, index: 552 },
  { text: "la", duration: 0.28, begin: 173.500, index: 553 },
  { text: "rı", duration: 0.28, begin: 173.700, index: 554 },
  { text: " i", duration: 0.28, begin: 173.900, index: 555 },
  { text: "se", duration: 0.28, begin: 174.100, index: 556 },
  { text: " pi", duration: 0.28, begin: 174.500, index: 557 },
  { text: "şi", duration: 0.28, begin: 174.700, index: 558 },
  { text: "rip", duration: 0.28, begin: 174.900, index: 559 },
  { text: " ye", duration: 0.28, begin: 175.100, index: 560 },
  { text: "di", duration: 0.28, begin: 175.300, index: 561 },
  { text: "ler.", duration: 0.28, begin: 175.500, index: 562 },
  { text: " Sa", duration: 0.28, begin: 176.700, index: 563 },
  { text: "ra", duration: 0.28, begin: 176.900, index: 564 },
  { text: "yı", duration: 0.28, begin: 177.100, index: 565 },
  { text: "na", duration: 0.28, begin: 177.300, index: 566 },
  { text: " dön", duration: 0.28, begin: 177.500, index: 567 },
  { text: "dü", duration: 0.28, begin: 177.700, index: 568 },
  { text: "ğün", duration: 0.28, begin: 177.900, index: 569 },
  { text: "de,", duration: 0.28, begin: 178.100, index: 570 },
  { text: " kur", duration: 0.28, begin: 179.100, index: 571 },
  { text: "tu", duration: 0.28, begin: 179.300, index: 572 },
  { text: "lu", duration: 0.28, begin: 179.500, index: 573 },
  { text: "şu", duration: 0.28, begin: 179.700, index: 574 },
  { text: "nun", duration: 0.28, begin: 179.900, index: 575 },
  { text: " ko", duration: 0.28, begin: 180.300, index: 576 },
  { text: "puk", duration: 0.28, begin: 180.500, index: 577 },
  { text: " par", duration: 0.28, begin: 180.700, index: 578 },
  { text: "ma", duration: 0.28, begin: 180.900, index: 579 },
  { text: "ğı", duration: 0.28, begin: 181.100, index: 580 },
  { text: " sa", duration: 0.28, begin: 181.500, index: 581 },
  { text: "ye", duration: 0.28, begin: 181.700, index: 582 },
  { text: "sin", duration: 0.28, begin: 181.900, index: 583 },
  { text: "de", duration: 0.28, begin: 182.100, index: 584 },
  { text: " ger", duration: 0.28, begin: 182.500, index: 585 },
  { text: "çek", duration: 0.28, begin: 182.700, index: 586 },
  { text: "leş", duration: 0.28, begin: 182.900, index: 587 },
  { text: "ti", duration: 0.28, begin: 183.100, index: 588 },
  { text: "ği", duration: 0.28, begin: 183.300, index: 589 },
  { text: "ni", duration: 0.28, begin: 183.500, index: 590 },
  { text: " an", duration: 0.28, begin: 183.900, index: 591 },
  { text: "la", duration: 0.28, begin: 184.100, index: 592 },
  { text: "yan", duration: 0.28, begin: 184.300, index: 593 },
  { text: " kral,", duration: 0.28, begin: 184.700, index: 594 },
  { text: " on", duration: 0.28, begin: 186.100, index: 595 },
  { text: "ca", duration: 0.28, begin: 186.300, index: 596 },
  { text: " yıl", duration: 0.28, begin: 186.500, index: 597 },
  { text: "lık", duration: 0.28, begin: 186.700, index: 598 },
  { text: " ar", duration: 0.28, begin: 187.100, index: 599 },
  { text: "ka", duration: 0.28, begin: 187.300, index: 600 },
  { text: "da", duration: 0.28, begin: 187.500, index: 601 },
  { text: "şı", duration: 0.28, begin: 187.700, index: 602 },
  { text: "na", duration: 0.28, begin: 187.900, index: 603 },
  { text: " re", duration: 0.28, begin: 188.300, index: 604 },
  { text: "va", duration: 0.28, begin: 188.500, index: 605 },
  { text: " gör", duration: 0.28, begin: 188.700, index: 606 },
  { text: "dü", duration: 0.28, begin: 188.900, index: 607 },
  { text: "ğü", duration: 0.28, begin: 189.100, index: 608 },
  { text: " mu", duration: 0.28, begin: 189.300, index: 609 },
  { text: "a", duration: 0.28, begin: 189.500, index: 610 },
  { text: "me", duration: 0.28, begin: 189.700, index: 611 },
  { text: "le", duration: 0.28, begin: 189.900, index: 612 },
  { text: "den", duration: 0.28, begin: 190.100, index: 613 },
  { text: " do", duration: 0.28, begin: 190.300, index: 614 },
  { text: "la", duration: 0.28, begin: 190.500, index: 615 },
  { text: "yı", duration: 0.28, begin: 190.700, index: 616 },
  { text: " piş", duration: 0.28, begin: 191.900, index: 617 },
  { text: "man", duration: 0.28, begin: 192.100, index: 618 },
  { text: " ol", duration: 0.28, begin: 192.300, index: 619 },
  { text: "du.", duration: 0.28, begin: 192.500, index: 620 },
  { text: " He", duration: 0.28, begin: 193.700, index: 621 },
  { text: "men", duration: 0.28, begin: 193.900, index: 622 },
  { text: " zin", duration: 0.28, begin: 194.100, index: 623 },
  { text: "da", duration: 0.28, begin: 194.300, index: 624 },
  { text: "na", duration: 0.28, begin: 194.500, index: 625 },
  { text: " koş", duration: 0.28, begin: 194.900, index: 626 },
  { text: "tu", duration: 0.28, begin: 195.100, index: 627 },
  { text: " ve", duration: 0.28, begin: 195.300, index: 628 },
  { text: " zin", duration: 0.28, begin: 196.500, index: 629 },
  { text: "dan", duration: 0.28, begin: 196.700, index: 630 },
  { text: "dan", duration: 0.28, begin: 196.900, index: 631 },
  { text: " çı", duration: 0.28, begin: 197.300, index: 632 },
  { text: "kar", duration: 0.28, begin: 197.500, index: 633 },
  { text: "dı", duration: 0.28, begin: 197.700, index: 634 },
  { text: "ğı", duration: 0.28, begin: 197.900, index: 635 },
  { text: " ar", duration: 0.28, begin: 198.300, index: 636 },
  { text: "ka", duration: 0.28, begin: 198.500, index: 637 },
  { text: "da", duration: 0.28, begin: 198.700, index: 638 },
  { text: "şı", duration: 0.28, begin: 198.900, index: 639 },
  { text: "na", duration: 0.28, begin: 199.100, index: 640 },
  { text: " ba", duration: 0.28, begin: 200.100, index: 641 },
  { text: "şın", duration: 0.28, begin: 200.300, index: 642 },
  { text: "dan", duration: 0.28, begin: 200.500, index: 643 },
  { text: " ge", duration: 0.28, begin: 200.700, index: 644 },
  { text: "çen", duration: 0.28, begin: 200.900, index: 645 },
  { text: "le", duration: 0.28, begin: 201.100, index: 646 },
  { text: "ri", duration: 0.28, begin: 201.300, index: 647 },
  { text: " bir", duration: 0.28, begin: 201.700, index: 648 },
  { text: " bir", duration: 0.28, begin: 201.900, index: 649 },
  { text: " an", duration: 0.28, begin: 202.100, index: 650 },
  { text: "lat", duration: 0.28, begin: 202.300, index: 651 },
  { text: "tı.", duration: 0.28, begin: 202.500, index: 652 },
  { text: " \"Hak", duration: 0.28, begin: 203.900, index: 653 },
  { text: "lıy", duration: 0.28, begin: 204.100, index: 654 },
  { text: "mış", duration: 0.28, begin: 204.300, index: 655 },
  { text: "sın!\"", duration: 0.28, begin: 204.500, index: 656 },
  { text: " de", duration: 0.28, begin: 205.300, index: 657 },
  { text: "di.", duration: 0.28, begin: 205.500, index: 658 },
  { text: " \"Par", duration: 0.28, begin: 206.500, index: 659 },
  { text: "ma", duration: 0.28, begin: 206.700, index: 660 },
  { text: "ğı", duration: 0.28, begin: 206.900, index: 661 },
  { text: "mın", duration: 0.28, begin: 207.100, index: 662 },
  { text: " kop", duration: 0.28, begin: 207.500, index: 663 },
  { text: "ma", duration: 0.28, begin: 207.700, index: 664 },
  { text: "sın", duration: 0.28, begin: 207.900, index: 665 },
  { text: "da", duration: 0.28, begin: 208.100, index: 666 },
  { text: " ger", duration: 0.40, begin: 208.500, index: 667 },
  { text: "çek", duration: 0.40, begin: 208.700, index: 668 },
  { text: "ten", duration: 0.40, begin: 208.900, index: 669 },
  { text: "de", duration: 0.40, begin: 209.100, index: 670 },
  { text: " bir", duration: 0.28, begin: 210.300, index: 671 },
  { text: " ha", duration: 0.28, begin: 210.500, index: 672 },
  { text: "yır", duration: 0.28, begin: 210.700, index: 673 },
  { text: " var", duration: 0.28, begin: 210.900, index: 674 },
  { text: "mış.", duration: 0.28, begin: 211.100, index: 675 },
  { text: " İş", duration: 0.40, begin: 212.300, index: 676 },
  { text: "te", duration: 0.40, begin: 212.500, index: 677 },
  { text: " bu", duration: 0.40, begin: 212.700, index: 678 },
  { text: " yüz", duration: 0.40, begin: 212.900, index: 679 },
  { text: "den,", duration: 0.40, begin: 213.100, index: 680 },
  { text: " se", duration: 0.28, begin: 214.100, index: 681 },
  { text: "ni", duration: 0.28, begin: 214.300, index: 682 },
  { text: " bu", duration: 0.28, begin: 214.700, index: 683 },
  { text: " ka", duration: 0.28, begin: 214.900, index: 684 },
  { text: "dar", duration: 0.28, begin: 215.100, index: 685 },
  { text: " u", duration: 0.28, begin: 215.500, index: 686 },
  { text: "zun", duration: 0.28, begin: 215.700, index: 687 },
  { text: " sü", duration: 0.28, begin: 215.900, index: 688 },
  { text: "re", duration: 0.28, begin: 216.100, index: 689 },
  { text: " zin", duration: 0.40, begin: 216.300, index: 690 },
  { text: "dan", duration: 0.40, begin: 216.500, index: 691 },
  { text: "da", duration: 0.40, begin: 216.700, index: 692 },
  { text: " tut", duration: 0.40, begin: 216.900, index: 693 },
  { text: "tu", duration: 0.40, begin: 217.100, index: 694 },
  { text: "ğum", duration: 0.40, begin: 217.300, index: 695 },
  { text: " i", duration: 0.40, begin: 217.500, index: 696 },
  { text: "çin", duration: 0.40, begin: 217.700, index: 697 },
  { text: " ö", duration: 0.28, begin: 218.900, index: 698 },
  { text: "zür", duration: 0.28, begin: 219.100, index: 699 },
  { text: " di", duration: 0.28, begin: 219.300, index: 700 },
  { text: "li", duration: 0.28, begin: 219.500, index: 701 },
  { text: "yo", duration: 0.28, begin: 219.700, index: 702 },
  { text: "rum.", duration: 0.28, begin: 219.900, index: 703 },
  { text: " Yap", duration: 0.40, begin: 220.700, index: 704 },
  { text: "tı", duration: 0.40, begin: 220.900, index: 705 },
  { text: "ğım", duration: 0.40, begin: 221.100, index: 706 },
  { text: " çok", duration: 0.28, begin: 221.500, index: 707 },
  { text: " hak", duration: 0.28, begin: 221.900, index: 708 },
  { text: "sız", duration: 0.28, begin: 222.100, index: 709 },
  { text: " ve", duration: 0.28, begin: 222.300, index: 710 },
  { text: " kö", duration: 0.28, begin: 223.300, index: 711 },
  { text: "tü", duration: 0.28, begin: 223.500, index: 712 },
  { text: " bir", duration: 0.28, begin: 223.700, index: 713 },
  { text: " şey", duration: 0.28, begin: 223.900, index: 714 },
  { text: "di.\"", duration: 0.28, begin: 224.100, index: 715 },
  { text: " \"Ha", duration: 0.28, begin: 225.500, index: 716 },
  { text: "yır\"", duration: 0.28, begin: 225.700, index: 717 },
  { text: " di", duration: 0.28, begin: 226.300, index: 718 },
  { text: "ye", duration: 0.28, begin: 226.500, index: 719 },
  { text: " kar", duration: 0.28, begin: 226.700, index: 720 },
  { text: "şı", duration: 0.28, begin: 226.900, index: 721 },
  { text: "lık", duration: 0.28, begin: 227.100, index: 722 },
  { text: " ver", duration: 0.28, begin: 227.300, index: 723 },
  { text: "di", duration: 0.28, begin: 227.500, index: 724 },
  { text: " ar", duration: 0.28, begin: 227.900, index: 725 },
  { text: "ka", duration: 0.28, begin: 228.100, index: 726 },
  { text: "da", duration: 0.28, begin: 228.300, index: 727 },
  { text: "şı.", duration: 0.28, begin: 228.500, index: 728 },
  { text: " \"Bun", duration: 0.28, begin: 229.500, index: 729 },
  { text: "da", duration: 0.28, begin: 229.700, index: 730 },
  { text: " da", duration: 0.28, begin: 229.900, index: 731 },
  { text: " bir", duration: 0.28, begin: 230.100, index: 732 },
  { text: " ha", duration: 0.28, begin: 230.300, index: 733 },
  { text: "yır", duration: 0.28, begin: 230.500, index: 734 },
  { text: " var.\"", duration: 0.28, begin: 230.700, index: 735 },
  { text: " \"Ne", duration: 0.28, begin: 231.700, index: 736 },
  { text: " di", duration: 0.28, begin: 231.900, index: 737 },
  { text: "yor", duration: 0.28, begin: 232.100, index: 738 },
  { text: "sun", duration: 0.28, begin: 232.300, index: 739 },
  { text: " Al", duration: 0.28, begin: 232.700, index: 740 },
  { text: "lah", duration: 0.28, begin: 232.900, index: 741 },
  { text: " aş", duration: 0.28, begin: 233.100, index: 742 },
  { text: "kı", duration: 0.28, begin: 233.300, index: 743 },
  { text: "na?\"", duration: 0.28, begin: 233.500, index: 744 },
  { text: " di", duration: 0.28, begin: 234.300, index: 745 },
  { text: "ye", duration: 0.28, begin: 234.500, index: 746 },
  { text: " hay", duration: 0.28, begin: 234.900, index: 747 },
  { text: "ret", duration: 0.28, begin: 235.100, index: 748 },
  { text: "le", duration: 0.28, begin: 235.200, index: 749 },
  { text: " ba", duration: 0.28, begin: 235.700, index: 750 },
  { text: "ğır", duration: 0.28, begin: 235.900, index: 751 },
  { text: "dı", duration: 0.28, begin: 236.100, index: 752 },
  { text: " kral.", duration: 0.28, begin: 236.500, index: 753 },
  { text: " \"Bir", duration: 0.28, begin: 237.500, index: 754 },
  { text: " ar", duration: 0.28, begin: 237.700, index: 755 },
  { text: "ka", duration: 0.28, begin: 237.900, index: 756 },
  { text: "da", duration: 0.28, begin: 238.100, index: 757 },
  { text: "şı", duration: 0.28, begin: 238.300, index: 758 },
  { text: "mı", duration: 0.28, begin: 238.500, index: 759 },
  { text: " bir", duration: 0.28, begin: 239.300, index: 760 },
  { text: " yıl", duration: 0.28, begin: 239.500, index: 761 },
  { text: " bo", duration: 0.28, begin: 239.900, index: 762 },
  { text: "yun", duration: 0.28, begin: 240.100, index: 763 },
  { text: "ca", duration: 0.28, begin: 240.300, index: 764 },
  { text: " zin", duration: 0.28, begin: 240.700, index: 765 },
  { text: "dan", duration: 0.28, begin: 240.900, index: 766 },
  { text: "da", duration: 0.28, begin: 241.100, index: 767 },
  { text: " tut", duration: 0.28, begin: 241.500, index: 768 },
  { text: "ma", duration: 0.28, begin: 241.700, index: 769 },
  { text: "mın", duration: 0.28, begin: 241.900, index: 770 },
  { text: " ne", duration: 0.28, begin: 242.700, index: 771 },
  { text: "re", duration: 0.28, begin: 242.900, index: 772 },
  { text: "sin", duration: 0.28, begin: 243.100, index: 773 },
  { text: "de", duration: 0.28, begin: 243.300, index: 774 },
  { text: " ha", duration: 0.28, begin: 243.500, index: 775 },
  { text: "yır", duration: 0.28, begin: 243.700, index: 776 },
  { text: " o", duration: 0.28, begin: 243.900, index: 777 },
  { text: "la", duration: 0.28, begin: 244.100, index: 778 },
  { text: "bi", duration: 0.28, begin: 244.300, index: 779 },
  { text: "lir?\"", duration: 0.28, begin: 244.500, index: 780 },
  { text: " \"Dü", duration: 0.28, begin: 245.700, index: 781 },
  { text: "şün", duration: 0.28, begin: 245.900, index: 782 },
  { text: "se", duration: 0.28, begin: 246.100, index: 783 },
  { text: "ne,", duration: 0.28, begin: 246.300, index: 784 },
  { text: " ben", duration: 0.28, begin: 247.100, index: 785 },
  { text: " zin", duration: 0.28, begin: 247.500, index: 786 },
  { text: "dan", duration: 0.28, begin: 247.700, index: 787 },
  { text: "da", duration: 0.28, begin: 247.900, index: 788 },
  { text: " ol", duration: 0.28, begin: 248.300, index: 789 },
  { text: "ma", duration: 0.28, begin: 248.500, index: 790 },
  { text: "say", duration: 0.28, begin: 248.700, index: 791 },
  { text: "dım,", duration: 0.28, begin: 248.900, index: 792 },
  { text: " se", duration: 0.28, begin: 249.700, index: 793 },
  { text: "nin", duration: 0.28, begin: 249.900, index: 794 },
  { text: "le", duration: 0.28, begin: 250.100, index: 795 },
  { text: " bir", duration: 0.28, begin: 250.500, index: 796 },
  { text: "lik", duration: 0.28, begin: 250.700, index: 797 },
  { text: "te", duration: 0.28, begin: 250.900, index: 798 },
  { text: " av", duration: 0.28, begin: 251.100, index: 799 },
  { text: "da", duration: 0.28, begin: 251.300, index: 800 },
  { text: " o", duration: 0.28, begin: 251.500, index: 801 },
  { text: "lur", duration: 0.28, begin: 251.700, index: 802 },
  { text: "dum,", duration: 0.28, begin: 251.900, index: 803 },
  { text: " de", duration: 0.28, begin: 252.700, index: 804 },
  { text: "ğil", duration: 0.28, begin: 252.900, index: 805 },
  { text: " mi?", duration: 0.28, begin: 253.100, index: 806 },
  { text: " Ve", duration: 0.28, begin: 253.700, index: 807 },
  { text: " son", duration: 0.28, begin: 253.900, index: 808 },
  { text: "ra", duration: 0.28, begin: 254.100, index: 809 },
  { text: "sı", duration: 0.28, begin: 254.300, index: 810 },
  { text: "nı", duration: 0.28, begin: 254.500, index: 811 },
  { text: " dü", duration: 0.28, begin: 254.900, index: 812 },
  { text: "şün", duration: 0.28, begin: 255.100, index: 813 },
  { text: "se", duration: 0.28, begin: 255.300, index: 814 },
  { text: "ne?\"", duration: 0.28, begin: 255.500, index: 815 }
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
  <Link href="/dashboard/stories/firtina-ciktiginda-uyuyabilirim" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/stanford-universitesi" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/4-5.mp3"
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