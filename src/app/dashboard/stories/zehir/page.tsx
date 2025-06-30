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
  { text: "", duration: 0.154, begin: 0.700, index: 0 },
  
  // Title
  { text: "Ze", duration: 0.28, begin: 0.700, index: 1, isTitle: true, isCenter: true },
  { text: "hir", duration: 0.38, begin: 1.218, index: 2, isTitle: true, isCenter: true },
  
  // Story content
  { text: " U", duration: 0.28, begin: 2.000, index: 3 },
  { text: "zun", duration: 0.53, begin: 2.250, index: 4 },
  { text: " yıl", duration: 0.53, begin: 2.500, index: 5 },
  { text: "lar", duration: 0.53, begin: 2.750, index: 6 },
  { text: " ön", duration: 0.53, begin: 3.000, index: 7 },
  { text: "ce", duration: 0.53, begin: 3.250, index: 8 },
  { text: " Çin'", duration: 0.53, begin: 4.250, index: 9 },
  { text: "de", duration: 0.53, begin: 4.500, index: 10 },
  { text: " Li", duration: 0.38, begin: 5.500, index: 11 },
  { text: "li", duration: 0.38, begin: 5.750, index: 12 },
  { text: " ad", duration: 0.53, begin: 6.000, index: 13 },
  { text: "lı", duration: 0.53, begin: 6.250, index: 14 },
  { text: " bir", duration: 0.53, begin: 6.500, index: 15 },
  { text: " kız", duration: 0.53, begin: 6.750, index: 16 },
  { text: " ev", duration: 0.53, begin: 7.000, index: 17 },
  { text: "le", duration: 0.53, begin: 7.250, index: 18 },
  { text: "nir,", duration: 0.53, begin: 7.500, index: 19 },
  { text: " ay", duration: 0.53, begin: 8.750, index: 20 },
  { text: "nı", duration: 0.53, begin: 9.000, index: 21 },
  { text: " ev", duration: 0.53, begin: 9.250, index: 22 },
  { text: "de", duration: 0.53, begin: 9.500, index: 23 },
  { text: " ko", duration: 0.53, begin: 10.500, index: 24 },
  { text: "ca", duration: 0.53, begin: 10.750, index: 25 },
  { text: "sı", duration: 0.53, begin: 11.000, index: 26 },
  { text: " ve", duration: 0.53, begin: 11.250, index: 27 },
  { text: " kay", duration: 0.53, begin: 11.500, index: 28 },
  { text: "na", duration: 0.53, begin: 11.750, index: 29 },
  { text: "na", duration: 0.53, begin: 12.000, index: 30 },
  { text: "sıy", duration: 0.53, begin: 12.250, index: 31 },
  { text: "la", duration: 0.53, begin: 12.500, index: 32 },
  { text: " bir", duration: 0.68, begin: 12.750, index: 33 },
  { text: "lik", duration: 0.68, begin: 13.000, index: 34 },
  { text: "te", duration: 0.68, begin: 13.250, index: 35 },
  { text: " ya", duration: 0.53, begin: 14.500, index: 36 },
  { text: "şa", duration: 0.53, begin: 14.750, index: 37 },
  { text: "ma", duration: 0.53, begin: 15.000, index: 38 },
  { text: "ya", duration: 0.53, begin: 15.250, index: 39 },
  { text: " baş", duration: 0.53, begin: 15.500, index: 40 },
  { text: "lar.", duration: 0.53, begin: 15.750, index: 41 },
  { text: " La", duration: 0.53, begin: 17.000, index: 42 },
  { text: "kin", duration: 0.53, begin: 17.250, index: 43 },
  { text: " kı", duration: 0.53, begin: 18.250, index: 44 },
  { text: "sa", duration: 0.53, begin: 18.500, index: 45 },
  { text: " sü", duration: 0.53, begin: 18.750, index: 46 },
  { text: "re", duration: 0.53, begin: 19.000, index: 47 },
  { text: " son", duration: 0.53, begin: 19.250, index: 48 },
  { text: "ra", duration: 0.53, begin: 19.500, index: 49 },
  { text: " ka", duration: 0.53, begin: 20.500, index: 50 },
  { text: "yın", duration: 0.53, begin: 20.750, index: 51 },
  { text: "va", duration: 0.53, begin: 21.000, index: 52 },
  { text: "li", duration: 0.53, begin: 21.250, index: 53 },
  { text: "de", duration: 0.53, begin: 21.500, index: 54 },
  { text: "siy", duration: 0.53, begin: 21.750, index: 55 },
  { text: "le", duration: 0.53, begin: 22.000, index: 56 },
  { text: " ge", duration: 0.53, begin: 22.250, index: 57 },
  { text: "çin", duration: 0.53, begin: 22.500, index: 58 },
  { text: "me", duration: 0.53, begin: 22.750, index: 59 },
  { text: "nin", duration: 0.53, begin: 23.000, index: 60 },
  { text: " çok", duration: 0.53, begin: 24.250, index: 61 },
  { text: " zor", duration: 0.53, begin: 24.500, index: 62 },
  { text: " ol", duration: 0.53, begin: 24.750, index: 63 },
  { text: "du", duration: 0.53, begin: 25.000, index: 64 },
  { text: "ğu", duration: 0.53, begin: 25.250, index: 65 },
  { text: "nu", duration: 0.53, begin: 25.500, index: 66 },
  { text: " an", duration: 0.53, begin: 25.750, index: 67 },
  { text: "lar.", duration: 0.53, begin: 26.000, index: 68 },
  { text: " İ", duration: 0.53, begin: 27.500, index: 69 },
  { text: "ki", duration: 0.53, begin: 27.750, index: 70 },
  { text: "si", duration: 0.53, begin: 28.000, index: 71 },
  { text: "nin", duration: 0.53, begin: 28.250, index: 72 },
  { text: " ki", duration: 0.53, begin: 28.500, index: 73 },
  { text: "şi", duration: 0.53, begin: 28.750, index: 74 },
  { text: "li", duration: 0.53, begin: 29.000, index: 75 },
  { text: "ği", duration: 0.53, begin: 29.250, index: 76 },
  { text: " ta", duration: 0.38, begin: 30.000, index: 77 },
  { text: "ma", duration: 0.38, begin: 30.250, index: 78 },
  { text: "men", duration: 0.38, begin: 30.500, index: 79 },
  { text: " fark", duration: 0.53, begin: 30.750, index: 80 },
  { text: "lı", duration: 0.53, begin: 31.000, index: 81 },
  { text: "dır,", duration: 0.53, begin: 31.250, index: 82 },
  { text: " bu", duration: 0.53, begin: 32.500, index: 83 },
  { text: " da", duration: 0.53, begin: 32.750, index: 84 },
  { text: " on", duration: 0.53, begin: 33.750, index: 85 },
  { text: "la", duration: 0.53, begin: 34.000, index: 86 },
  { text: "rın", duration: 0.53, begin: 34.250, index: 87 },
  { text: " sık", duration: 0.53, begin: 34.500, index: 88 },
  { text: " sık", duration: 0.53, begin: 34.750, index: 89 },
  { text: " kav", duration: 0.53, begin: 35.250, index: 90 },
  { text: "ga", duration: 0.53, begin: 35.500, index: 91 },
  { text: " e", duration: 0.53, begin: 35.750, index: 92 },
  { text: "dip", duration: 0.53, begin: 36.000, index: 93 },
  { text: " tar", duration: 0.53, begin: 37.250, index: 94 },
  { text: "tış", duration: 0.53, begin: 37.500, index: 95 },
  { text: "ma", duration: 0.53, begin: 37.750, index: 96 },
  { text: "la", duration: 0.53, begin: 38.000, index: 97 },
  { text: "rı", duration: 0.53, begin: 38.250, index: 98 },
  { text: "na", duration: 0.53, begin: 38.500, index: 99 },
  { text: " yol", duration: 0.53, begin: 38.750, index: 100 },
  { text: " a", duration: 0.53, begin: 39.000, index: 101 },
  { text: "çar.", duration: 0.53, begin: 39.250, index: 102 },
  { text: " Bu", duration: 0.53, begin: 40.250, index: 103 },
  { text: " Çin", duration: 0.53, begin: 41.250, index: 104 },
  { text: " ge", duration: 0.53, begin: 41.500, index: 105 },
  { text: "le", duration: 0.53, begin: 41.750, index: 106 },
  { text: "nek", duration: 0.53, begin: 42.000, index: 107 },
  { text: "le", duration: 0.53, begin: 42.250, index: 108 },
  { text: "ri", duration: 0.53, begin: 42.500, index: 109 },
  { text: "ne", duration: 0.53, begin: 42.750, index: 110 },
  { text: " gö", duration: 0.53, begin: 43.000, index: 111 },
  { text: "re", duration: 0.53, begin: 43.250, index: 112 },
  { text: " hoş", duration: 0.53, begin: 44.250, index: 113 },
  { text: " bir", duration: 0.53, begin: 44.500, index: 114 },
  { text: " dav", duration: 0.53, begin: 44.750, index: 115 },
  { text: "ra", duration: 0.53, begin: 45.000, index: 116 },
  { text: "nış", duration: 0.53, begin: 45.250, index: 117 },
  { text: " de", duration: 0.53, begin: 45.500, index: 118 },
  { text: "ğil", duration: 0.53, begin: 45.750, index: 119 },
  { text: "dir", duration: 0.53, begin: 46.000, index: 120 },
  { text: " ve", duration: 0.53, begin: 46.750, index: 121 },
  { text: " çev", duration: 0.53, begin: 47.500, index: 122 },
  { text: "re", duration: 0.53, begin: 47.750, index: 123 },
  { text: "nin", duration: 0.53, begin: 48.000, index: 124 },
  { text: " tep", duration: 0.68, begin: 48.250, index: 125 },
  { text: "ki", duration: 0.68, begin: 48.500, index: 126 },
  { text: "si", duration: 0.68, begin: 48.750, index: 127 },
  { text: "ne", duration: 0.68, begin: 49.000, index: 128 },
  { text: " yol", duration: 0.53, begin: 49.250, index: 129 },
  { text: " a", duration: 0.53, begin: 49.500, index: 130 },
  { text: "çar.", duration: 0.53, begin: 50.000, index: 131 },
  { text: " Bir", duration: 0.53, begin: 51.500, index: 132 },
  { text: " kaç", duration: 0.53, begin: 51.750, index: 133 },
  { text: " ay", duration: 0.53, begin: 52.000, index: 134 },
  { text: " son", duration: 0.53, begin: 52.250, index: 135 },
  { text: "ra", duration: 0.53, begin: 52.500, index: 136 },
  { text: " ev,", duration: 0.53, begin: 53.250, index: 137 },
  { text: " bit", duration: 0.53, begin: 54.250, index: 138 },
  { text: "mez", duration: 0.53, begin: 54.500, index: 139 },
  { text: " tü", duration: 0.53, begin: 54.750, index: 140 },
  { text: "ken", duration: 0.53, begin: 55.000, index: 141 },
  { text: "mez", duration: 0.53, begin: 55.250, index: 142 },
  { text: " ge", duration: 0.53, begin: 56.000, index: 143 },
  { text: "lin", duration: 0.53, begin: 56.250, index: 144 },
  { text: " kay", duration: 0.53, begin: 56.500, index: 145 },
  { text: "na", duration: 0.53, begin: 56.750, index: 146 },
  { text: "na", duration: 0.53, begin: 57.000, index: 147 },
  { text: " kav", duration: 0.53, begin: 57.250, index: 148 },
  { text: "ga", duration: 0.53, begin: 57.500, index: 149 },
  { text: "la", duration: 0.53, begin: 57.750, index: 150 },
  { text: "rın", duration: 0.53, begin: 58.000, index: 151 },
  { text: "dan", duration: 0.53, begin: 58.250, index: 152 },
  { text: " ken", duration: 0.53, begin: 59.500, index: 153 },
  { text: "di", duration: 0.53, begin: 59.750, index: 154 },
  { text: "si", duration: 0.53, begin: 60.000, index: 155 },
  { text: "nin", duration: 0.53, begin: 60.250, index: 156 },
  { text: " ve", duration: 0.53, begin: 61.000, index: 157 },
  { text: " an", duration: 0.53, begin: 61.500, index: 158 },
  { text: "ne", duration: 0.53, begin: 61.750, index: 159 },
  { text: "siy", duration: 0.53, begin: 62.000, index: 160 },
  { text: "le", duration: 0.53, begin: 62.250, index: 161 },
  { text: " ka", duration: 0.53, begin: 62.500, index: 162 },
  { text: "rı", duration: 0.53, begin: 62.750, index: 163 },
  { text: "sı", duration: 0.53, begin: 63.000, index: 164 },
  { text: " a", duration: 0.53, begin: 63.250, index: 165 },
  { text: "ra", duration: 0.53, begin: 63.500, index: 166 },
  { text: "sın", duration: 0.53, begin: 63.750, index: 167 },
  { text: "da", duration: 0.53, begin: 64.000, index: 168 },
  { text: " ka", duration: 0.53, begin: 64.250, index: 169 },
  { text: "lan", duration: 0.53, begin: 64.500, index: 170 },
  { text: " e", duration: 0.53, begin: 65.500, index: 171 },
  { text: "şi", duration: 0.53, begin: 65.750, index: 172 },
  { text: " i", duration: 0.53, begin: 66.000, index: 173 },
  { text: "çin", duration: 0.53, begin: 66.250, index: 174 },
  { text: " ce", duration: 0.53, begin: 67.000, index: 175 },
  { text: "hen", duration: 0.53, begin: 67.250, index: 176 },
  { text: "nem", duration: 0.53, begin: 67.500, index: 177 },
  { text: " ha", duration: 0.53, begin: 68.000, index: 178 },
  { text: "li", duration: 0.53, begin: 68.250, index: 179 },
  { text: "ne", duration: 0.53, begin: 68.500, index: 180 },
  { text: " gel", duration: 0.68, begin: 68.750, index: 181 },
  { text: "miş", duration: 0.68, begin: 69.000, index: 182 },
  { text: "tir.", duration: 0.68, begin: 69.250, index: 183 },
  { text: " Ar", duration: 0.53, begin: 71.250, index: 184 },
  { text: "tık", duration: 0.53, begin: 71.500, index: 185 },
  { text: " her", duration: 0.53, begin: 71.750, index: 186 },
  { text: "şe", duration: 0.53, begin: 72.000, index: 187 },
  { text: "yi", duration: 0.53, begin: 72.250, index: 188 },
  { text: " yap", duration: 0.53, begin: 72.500, index: 189 },
  { text: "mak", duration: 0.53, begin: 72.750, index: 190 },
  { text: " ge", duration: 0.53, begin: 73.250, index: 191 },
  { text: "rek", duration: 0.53, begin: 73.500, index: 192 },
  { text: "ti", duration: 0.53, begin: 73.750, index: 193 },
  { text: "ği", duration: 0.53, begin: 74.000, index: 194 },
  { text: "ne", duration: 0.53, begin: 74.250, index: 195 },
  { text: " i", duration: 0.53, begin: 74.500, index: 196 },
  { text: "na", duration: 0.53, begin: 74.750, index: 197 },
  { text: "nan", duration: 0.53, begin: 75.000, index: 198 },
  { text: " genç", duration: 0.53, begin: 75.500, index: 199 },
  { text: " kız", duration: 0.53, begin: 75.750, index: 200 },
  { text: " doğ", duration: 0.53, begin: 77.250, index: 201 },
  { text: "ru", duration: 0.53, begin: 77.500, index: 202 },
  { text: "ca", duration: 0.53, begin: 77.750, index: 203 },
  { text: " ba", duration: 0.28, begin: 78.750, index: 204 },
  { text: "ba", duration: 0.28, begin: 79.000, index: 205 },
  { text: "sı", duration: 0.28, begin: 79.250, index: 206 },
  { text: "nın", duration: 0.28, begin: 79.500, index: 207 },
  { text: " es", duration: 0.53, begin: 79.750, index: 208 },
  { text: "ki", duration: 0.53, begin: 80.000, index: 209 },
  { text: " ar", duration: 0.53, begin: 80.250, index: 210 },
  { text: "ka", duration: 0.53, begin: 80.500, index: 211 },
  { text: "da", duration: 0.53, begin: 80.750, index: 212 },
  { text: "şı", duration: 0.53, begin: 81.000, index: 213 },
  { text: " o", duration: 0.53, begin: 81.750, index: 214 },
  { text: "lan", duration: 0.53, begin: 82.000, index: 215 },
  { text: " ak", duration: 0.68, begin: 82.750, index: 216 },
  { text: "ta", duration: 0.68, begin: 83.000, index: 217 },
  { text: "ra", duration: 0.68, begin: 83.250, index: 218 },
  { text: " ko", duration: 0.68, begin: 83.500, index: 219 },
  { text: "şar", duration: 0.68, begin: 83.750, index: 220 },
  { text: " ve", duration: 0.53, begin: 84.250, index: 221 },
  { text: " der", duration: 0.53, begin: 85.500, index: 222 },
  { text: "di", duration: 0.53, begin: 85.750, index: 223 },
  { text: "ni", duration: 0.53, begin: 86.000, index: 224 },
  { text: " an", duration: 0.53, begin: 86.250, index: 225 },
  { text: "la", duration: 0.53, begin: 86.500, index: 226 },
  { text: "tır.", duration: 0.53, begin: 86.750, index: 227 },
  { text: " Yaş", duration: 0.53, begin: 88.250, index: 228 },
  { text: "lı", duration: 0.53, begin: 88.500, index: 229 },
  { text: " a", duration: 0.53, begin: 88.750, index: 230 },
  { text: "dam", duration: 0.53, begin: 89.000, index: 231 },
  { text: " o", duration: 0.53, begin: 90.000, index: 232 },
  { text: "na", duration: 0.53, begin: 90.250, index: 233 },
  { text: " bit", duration: 0.53, begin: 90.500, index: 234 },
  { text: "ki", duration: 0.53, begin: 90.750, index: 235 },
  { text: "ler", duration: 0.53, begin: 91.000, index: 236 },
  { text: "den", duration: 0.53, begin: 91.250, index: 237 },
  { text: " yap", duration: 0.68, begin: 91.500, index: 238 },
  { text: "tı", duration: 0.68, begin: 91.750, index: 239 },
  { text: "ğı", duration: 0.68, begin: 92.000, index: 240 },
  { text: " ze", duration: 0.53, begin: 92.500, index: 241 },
  { text: "hi", duration: 0.53, begin: 92.750, index: 242 },
  { text: "ri", duration: 0.53, begin: 93.000, index: 243 },
  { text: " ha", duration: 0.53, begin: 93.250, index: 244 },
  { text: "zır", duration: 0.53, begin: 93.500, index: 245 },
  { text: "lar", duration: 0.53, begin: 93.750, index: 246 },
  { text: " ve", duration: 0.53, begin: 94.500, index: 247 },
  { text: " bu", duration: 0.53, begin: 95.500, index: 248 },
  { text: "nu", duration: 0.53, begin: 95.750, index: 249 },
  { text: " üç", duration: 0.53, begin: 96.000, index: 250 },
  { text: " ay", duration: 0.53, begin: 96.250, index: 251 },
  { text: " bo", duration: 0.53, begin: 97.000, index: 252 },
  { text: "yun", duration: 0.53, begin: 97.250, index: 253 },
  { text: "ca", duration: 0.53, begin: 97.500, index: 254 },
  { text: " her", duration: 0.53, begin: 98.500, index: 255 },
  { text: " gün", duration: 0.53, begin: 98.750, index: 256 },
  { text: " a", duration: 0.53, begin: 99.750, index: 257 },
  { text: "zar", duration: 0.53, begin: 100.000, index: 258 },
  { text: " a", duration: 0.53, begin: 100.250, index: 259 },
  { text: "zar", duration: 0.53, begin: 100.500, index: 260 },
  { text: " kay", duration: 0.53, begin: 101.250, index: 261 },
  { text: "na", duration: 0.53, begin: 101.500, index: 262 },
  { text: "na", duration: 0.53, begin: 101.750, index: 263 },
  { text: "sı", duration: 0.53, begin: 102.000, index: 264 },
  { text: " i", duration: 0.53, begin: 102.250, index: 265 },
  { text: "çin", duration: 0.53, begin: 102.500, index: 266 },
  { text: " yap", duration: 0.53, begin: 103.500, index: 267 },
  { text: "tı", duration: 0.53, begin: 103.750, index: 268 },
  { text: "ğı", duration: 0.53, begin: 104.000, index: 269 },
  { text: " ye", duration: 0.53, begin: 104.250, index: 270 },
  { text: "mek", duration: 0.53, begin: 104.500, index: 271 },
  { text: "le", duration: 0.53, begin: 104.750, index: 272 },
  { text: "re", duration: 0.53, begin: 105.000, index: 273 },
  { text: " koy", duration: 0.53, begin: 105.250, index: 274 },
  { text: "ma", duration: 0.53, begin: 105.500, index: 275 },
  { text: "sı", duration: 0.53, begin: 105.750, index: 276 },
  { text: "nı", duration: 0.53, begin: 106.000, index: 277 },
  { text: " söy", duration: 0.53, begin: 106.250, index: 278 },
  { text: "ler.", duration: 0.53, begin: 106.500, index: 279 },
  { text: " Ze", duration: 0.53, begin: 108.250, index: 280 },
  { text: "hir", duration: 0.53, begin: 108.500, index: 281 },
  { text: " az", duration: 0.53, begin: 109.250, index: 282 },
  { text: " az", duration: 0.53, begin: 109.500, index: 283 },
  { text: " ve", duration: 0.53, begin: 110.250, index: 284 },
  { text: "ri", duration: 0.53, begin: 110.500, index: 285 },
  { text: "le", duration: 0.53, begin: 110.750, index: 286 },
  { text: "cek,", duration: 0.53, begin: 111.000, index: 287 },
  { text: " böy", duration: 0.53, begin: 112.000, index: 288 },
  { text: "le", duration: 0.53, begin: 112.250, index: 289 },
  { text: "ce", duration: 0.53, begin: 112.500, index: 290 },
  { text: " o", duration: 0.53, begin: 112.750, index: 291 },
  { text: "nu", duration: 0.53, begin: 113.000, index: 292 },
  { text: " ge", duration: 0.53, begin: 113.750, index: 293 },
  { text: "li", duration: 0.53, begin: 114.000, index: 294 },
  { text: "ni", duration: 0.53, begin: 114.250, index: 295 },
  { text: "nin", duration: 0.53, begin: 114.500, index: 296 },
  { text: " öl", duration: 0.53, begin: 114.750, index: 297 },
  { text: "dür", duration: 0.53, begin: 115.000, index: 298 },
  { text: "dü", duration: 0.53, begin: 115.250, index: 299 },
  { text: "ğü", duration: 0.53, begin: 115.500, index: 300 },
  { text: " bel", duration: 0.53, begin: 116.250, index: 301 },
  { text: "li", duration: 0.53, begin: 116.500, index: 302 },
  { text: " ol", duration: 0.53, begin: 116.750, index: 303 },
  { text: "ma", duration: 0.53, begin: 117.000, index: 304 },
  { text: "ya", duration: 0.53, begin: 117.250, index: 305 },
  { text: "cak", duration: 0.53, begin: 117.500, index: 306 },
  { text: "tır.", duration: 0.53, begin: 117.750, index: 307 },
  { text: " Yaş", duration: 0.53, begin: 119.500, index: 308 },
  { text: "lı", duration: 0.53, begin: 119.750, index: 309 },
  { text: " a", duration: 0.53, begin: 120.000, index: 310 },
  { text: "dam", duration: 0.53, begin: 120.250, index: 311 },
  { text: " genç", duration: 0.53, begin: 121.000, index: 312 },
  { text: " kı", duration: 0.53, begin: 121.250, index: 313 },
  { text: "za", duration: 0.53, begin: 121.500, index: 314 },
  { text: " kim", duration: 0.53, begin: 122.750, index: 315 },
  { text: "se", duration: 0.53, begin: 123.000, index: 316 },
  { text: "nin", duration: 0.53, begin: 123.250, index: 317 },
  { text: " ve", duration: 0.53, begin: 123.500, index: 318 },
  { text: " e", duration: 0.53, begin: 124.250, index: 319 },
  { text: "şi", duration: 0.53, begin: 124.500, index: 320 },
  { text: "nin", duration: 0.53, begin: 124.750, index: 321 },
  { text: " şüp", duration: 0.53, begin: 125.500, index: 322 },
  { text: "he", duration: 0.53, begin: 125.750, index: 323 },
  { text: "len", duration: 0.53, begin: 126.000, index: 324 },
  { text: "me", duration: 0.53, begin: 126.250, index: 325 },
  { text: "me", duration: 0.53, begin: 126.500, index: 326 },
  { text: "si", duration: 0.53, begin: 126.750, index: 327 },
  { text: " i", duration: 0.53, begin: 127.250, index: 328 },
  { text: "çin", duration: 0.53, begin: 127.500, index: 329 },
  { text: " kay", duration: 0.53, begin: 128.500, index: 330 },
  { text: "na", duration: 0.53, begin: 128.750, index: 331 },
  { text: "na", duration: 0.53, begin: 129.000, index: 332 },
  { text: "sı", duration: 0.53, begin: 129.250, index: 333 },
  { text: "na", duration: 0.53, begin: 129.500, index: 334 },
  { text: " çok", duration: 0.53, begin: 129.750, index: 335 },
  { text: " i", duration: 0.53, begin: 130.000, index: 336 },
  { text: "yi", duration: 0.53, begin: 130.250, index: 337 },
  { text: " dav", duration: 0.53, begin: 130.500, index: 338 },
  { text: "ran", duration: 0.53, begin: 130.750, index: 339 },
  { text: "ma", duration: 0.53, begin: 131.000, index: 340 },
  { text: "sı", duration: 0.53, begin: 131.250, index: 341 },
  { text: "nı,", duration: 0.53, begin: 131.500, index: 342 },
  { text: " o", duration: 0.53, begin: 133.000, index: 343 },
  { text: "na", duration: 0.53, begin: 133.250, index: 344 },
  { text: " en", duration: 0.53, begin: 133.500, index: 345 },
  { text: " gü", duration: 0.53, begin: 133.750, index: 346 },
  { text: "zel", duration: 0.53, begin: 134.000, index: 347 },
  { text: " ye", duration: 0.68, begin: 134.250, index: 348 },
  { text: "mek", duration: 0.68, begin: 134.500, index: 349 },
  { text: "le", duration: 0.68, begin: 134.750, index: 350 },
  { text: "ri", duration: 0.68, begin: 135.000, index: 351 },
  { text: " yap", duration: 0.68, begin: 135.250, index: 352 },
  { text: "ma", duration: 0.68, begin: 135.500, index: 353 },
  { text: "sı", duration: 0.68, begin: 135.750, index: 354 },
  { text: "nı,", duration: 0.68, begin: 136.000, index: 355 },
  { text: " her", duration: 0.68, begin: 137.500, index: 356 },
  { text: " za", duration: 0.68, begin: 137.750, index: 357 },
  { text: "man", duration: 0.68, begin: 138.000, index: 358 },
  { text: "kin", duration: 0.68, begin: 138.250, index: 359 },
  { text: "den", duration: 0.68, begin: 138.500, index: 360 },
  { text: " da", duration: 0.53, begin: 139.500, index: 361 },
  { text: "ha", duration: 0.53, begin: 139.750, index: 362 },
  { text: " bü", duration: 0.53, begin: 140.250, index: 363 },
  { text: "yük", duration: 0.53, begin: 140.500, index: 364 },
  { text: " bir", duration: 0.53, begin: 140.750, index: 365 },
  { text: " il", duration: 0.53, begin: 141.000, index: 366 },
  { text: "gi", duration: 0.53, begin: 141.250, index: 367 },
  { text: " gös", duration: 0.68, begin: 141.500, index: 368 },
  { text: "ter", duration: 0.68, begin: 141.750, index: 369 },
  { text: "me", duration: 0.68, begin: 142.000, index: 370 },
  { text: "si", duration: 0.68, begin: 142.250, index: 371 },
  { text: "ni", duration: 0.68, begin: 142.500, index: 372 },
  { text: " söy", duration: 0.68, begin: 143.250, index: 373 },
  { text: "ler.", duration: 0.68, begin: 143.500, index: 374 },
  { text: " Se", duration: 0.28, begin: 145.500, index: 375 },
  { text: "vinç", duration: 0.28, begin: 145.750, index: 376 },
  { text: " i", duration: 0.38, begin: 146.250, index: 377 },
  { text: "çin", duration: 0.38, begin: 146.500, index: 378 },
  { text: "de", duration: 0.38, begin: 146.750, index: 379 },
  { text: " e", duration: 0.53, begin: 147.000, index: 380 },
  { text: "ve", duration: 0.53, begin: 147.250, index: 381 },
  { text: " dö", duration: 0.53, begin: 147.500, index: 382 },
  { text: "nen", duration: 0.53, begin: 147.750, index: 383 },
  { text: " Li", duration: 0.53, begin: 148.250, index: 384 },
  { text: "li", duration: 0.53, begin: 148.500, index: 385 },
  { text: " yaş", duration: 0.53, begin: 149.250, index: 386 },
  { text: "lı", duration: 0.53, begin: 149.500, index: 387 },
  { text: " a", duration: 0.53, begin: 149.750, index: 388 },
  { text: "da", duration: 0.53, begin: 150.000, index: 389 },
  { text: "mın", duration: 0.53, begin: 150.250, index: 390 },
  { text: " de", duration: 0.53, begin: 150.500, index: 391 },
  { text: "dik", duration: 0.53, begin: 150.750, index: 392 },
  { text: "le", duration: 0.53, begin: 151.000, index: 393 },
  { text: "ri", duration: 0.53, begin: 151.250, index: 394 },
  { text: "ni", duration: 0.53, begin: 151.500, index: 395 },
  { text: " ay", duration: 0.53, begin: 152.500, index: 396 },
  { text: "nen", duration: 0.53, begin: 152.750, index: 397 },
  { text: " uy", duration: 0.53, begin: 153.000, index: 398 },
  { text: "gu", duration: 0.53, begin: 153.250, index: 399 },
  { text: "lar.", duration: 0.53, begin: 153.500, index: 400 },
  { text: " Her", duration: 0.53, begin: 155.000, index: 401 },
  { text: " gün", duration: 0.53, begin: 155.250, index: 402 },
  { text: " en", duration: 0.53, begin: 156.250, index: 403 },
  { text: " gü", duration: 0.53, begin: 156.500, index: 404 },
  { text: "zel", duration: 0.53, begin: 156.750, index: 405 },
  { text: " ye", duration: 0.53, begin: 157.000, index: 406 },
  { text: "mek", duration: 0.53, begin: 157.250, index: 407 },
  { text: "le", duration: 0.53, begin: 157.500, index: 408 },
  { text: "ri", duration: 0.53, begin: 157.750, index: 409 },
  { text: " ya", duration: 0.53, begin: 158.000, index: 410 },
  { text: "par", duration: 0.53, begin: 158.250, index: 411 },
  { text: " ve", duration: 0.53, begin: 159.000, index: 412 },
  { text: " kay", duration: 0.53, begin: 159.750, index: 413 },
  { text: "na", duration: 0.53, begin: 160.000, index: 414 },
  { text: "na", duration: 0.53, begin: 160.250, index: 415 },
  { text: "sı", duration: 0.53, begin: 160.500, index: 416 },
  { text: "nın", duration: 0.53, begin: 160.750, index: 417 },
  { text: " ta", duration: 0.68, begin: 161.250, index: 418 },
  { text: "ba", duration: 0.68, begin: 161.500, index: 419 },
  { text: "ğı", duration: 0.68, begin: 161.750, index: 420 },
  { text: "na", duration: 0.68, begin: 162.000, index: 421 },
  { text: " a", duration: 0.68, begin: 162.500, index: 422 },
  { text: "zar", duration: 0.68, begin: 162.750, index: 423 },
  { text: " a", duration: 0.68, begin: 163.000, index: 424 },
  { text: "zar", duration: 0.68, begin: 163.250, index: 425 },
  { text: " ze", duration: 0.68, begin: 163.750, index: 426 },
  { text: "hi", duration: 0.68, begin: 164.000, index: 427 },
  { text: "ri", duration: 0.68, begin: 164.250, index: 428 },
  { text: " dam", duration: 0.68, begin: 164.500, index: 429 },
  { text: "la", duration: 0.68, begin: 164.750, index: 430 },
  { text: "tır.", duration: 0.68, begin: 165.000, index: 431 },
  { text: " Kim", duration: 0.53, begin: 167.000, index: 432 },
  { text: "se", duration: 0.53, begin: 167.250, index: 433 },
  { text: "ler", duration: 0.53, begin: 167.500, index: 434 },
  { text: " şüp", duration: 0.53, begin: 167.750, index: 435 },
  { text: "he", duration: 0.53, begin: 168.000, index: 436 },
  { text: "len", duration: 0.53, begin: 168.250, index: 437 },
  { text: "me", duration: 0.53, begin: 168.500, index: 438 },
  { text: "sin", duration: 0.53, begin: 168.750, index: 439 },
  { text: " di", duration: 0.53, begin: 169.000, index: 440 },
  { text: "ye", duration: 0.53, begin: 169.250, index: 441 },
  { text: " de", duration: 0.53, begin: 169.500, index: 442 },
  { text: " o", duration: 0.53, begin: 170.500, index: 443 },
  { text: "na", duration: 0.53, begin: 170.750, index: 444 },
  { text: " çok", duration: 0.53, begin: 171.000, index: 445 },
  { text: " i", duration: 0.53, begin: 171.250, index: 446 },
  { text: "yi", duration: 0.53, begin: 171.500, index: 447 },
  { text: " dav", duration: 0.53, begin: 171.750, index: 448 },
  { text: "ra", duration: 0.53, begin: 172.000, index: 449 },
  { text: "nır.", duration: 0.53, begin: 172.250, index: 450 },
  { text: " Bir", duration: 0.53, begin: 173.750, index: 451 },
  { text: " sü", duration: 0.53, begin: 174.000, index: 452 },
  { text: "re", duration: 0.53, begin: 174.250, index: 453 },
  { text: " son", duration: 0.53, begin: 174.500, index: 454 },
  { text: "ra", duration: 0.53, begin: 174.750, index: 455 },
  { text: " ka", duration: 0.53, begin: 175.750, index: 456 },
  { text: "yın", duration: 0.53, begin: 176.000, index: 457 },
  { text: "va", duration: 0.53, begin: 176.250, index: 458 },
  { text: "li", duration: 0.53, begin: 176.500, index: 459 },
  { text: "de", duration: 0.53, begin: 176.750, index: 460 },
  { text: "si", duration: 0.53, begin: 177.000, index: 461 },
  { text: " de", duration: 0.53, begin: 177.750, index: 462 },
  { text: " çok", duration: 0.53, begin: 178.250, index: 463 },
  { text: " de", duration: 0.53, begin: 178.750, index: 464 },
  { text: "ğiş", duration: 0.53, begin: 179.000, index: 465 },
  { text: "miş", duration: 0.53, begin: 179.250, index: 466 },
  { text: "tir", duration: 0.53, begin: 179.500, index: 467 },
  { text: " ve", duration: 0.53, begin: 180.250, index: 468 },
  { text: " ge", duration: 0.53, begin: 181.000, index: 469 },
  { text: "li", duration: 0.53, begin: 181.250, index: 470 },
  { text: "ni", duration: 0.53, begin: 181.500, index: 471 },
  { text: "ne", duration: 0.53, begin: 181.750, index: 472 },
  { text: " ken", duration: 0.53, begin: 182.000, index: 473 },
  { text: "di", duration: 0.53, begin: 182.250, index: 474 },
  { text: " kı", duration: 0.53, begin: 182.500, index: 475 },
  { text: "zı", duration: 0.53, begin: 182.750, index: 476 },
  { text: " gi", duration: 0.53, begin: 183.000, index: 477 },
  { text: "bi", duration: 0.53, begin: 183.250, index: 478 },
  { text: " dav", duration: 0.53, begin: 183.500, index: 479 },
  { text: "ran", duration: 0.53, begin: 183.750, index: 480 },
  { text: "ma", duration: 0.53, begin: 184.000, index: 481 },
  { text: "ya", duration: 0.53, begin: 184.250, index: 482 },
  { text: " baş", duration: 0.53, begin: 185.000, index: 483 },
  { text: "lar.", duration: 0.53, begin: 185.250, index: 484 },
  { text: " Ev", duration: 0.53, begin: 186.250, index: 485 },
  { text: "de", duration: 0.53, begin: 186.500, index: 486 },
  { text: " ar", duration: 0.53, begin: 186.750, index: 487 },
  { text: "tık", duration: 0.53, begin: 187.000, index: 488 },
  { text: " ba", duration: 0.53, begin: 188.000, index: 489 },
  { text: "rış", duration: 0.53, begin: 188.250, index: 490 },
  { text: " rüz", duration: 0.53, begin: 188.500, index: 491 },
  { text: "gar", duration: 0.53, begin: 188.750, index: 492 },
  { text: "la", duration: 0.53, begin: 189.000, index: 493 },
  { text: "rı", duration: 0.53, begin: 189.250, index: 494 },
  { text: " e", duration: 0.53, begin: 189.750, index: 495 },
  { text: "si", duration: 0.53, begin: 190.000, index: 496 },
  { text: "yor", duration: 0.53, begin: 190.250, index: 497 },
  { text: "dur.", duration: 0.53, begin: 190.500, index: 498 },
  { text: " Genç", duration: 0.53, begin: 192.500, index: 499 },
  { text: " kız", duration: 0.53, begin: 192.750, index: 500 },
  { text: " ken", duration: 0.53, begin: 193.500, index: 501 },
  { text: "di", duration: 0.53, begin: 193.750, index: 502 },
  { text: "si", duration: 0.53, begin: 194.000, index: 503 },
  { text: "ni", duration: 0.53, begin: 194.250, index: 504 },
  { text: " a", duration: 0.38, begin: 194.750, index: 505 },
  { text: "ğır", duration: 0.53, begin: 195.000, index: 506 },
  { text: " bir", duration: 0.68, begin: 195.250, index: 507 },
  { text: "yük", duration: 0.68, begin: 195.500, index: 508 },
  { text: " al", duration: 0.78, begin: 195.750, index: 509 },
  { text: "tın", duration: 0.78, begin: 196.000, index: 510 },
  { text: "da", duration: 0.78, begin: 196.250, index: 511 },
  { text: " his", duration: 0.68, begin: 196.750, index: 512 },
  { text: "se", duration: 0.68, begin: 197.000, index: 513 },
  { text: "der.", duration: 0.68, begin: 197.250, index: 514 },
  { text: " Yap", duration: 0.53, begin: 199.000, index: 515 },
  { text: "tık", duration: 0.53, begin: 199.250, index: 516 },
  { text: "la", duration: 0.53, begin: 199.500, index: 517 },
  { text: "rın", duration: 0.53, begin: 199.750, index: 518 },
  { text: "dan", duration: 0.53, begin: 200.000, index: 519 },
  { text: " piş", duration: 0.53, begin: 200.750, index: 520 },
  { text: "man", duration: 0.53, begin: 201.000, index: 521 },
  { text: " va", duration: 0.53, begin: 201.250, index: 522 },
  { text: "zi", duration: 0.53, begin: 201.500, index: 523 },
  { text: "yet", duration: 0.53, begin: 201.750, index: 524 },
  { text: "te", duration: 0.53, begin: 202.000, index: 525 },
  { text: " ak", duration: 0.53, begin: 203.000, index: 526 },
  { text: "ta", duration: 0.53, begin: 203.250, index: 527 },
  { text: "rın", duration: 0.53, begin: 203.500, index: 528 },
  { text: " yo", duration: 0.53, begin: 203.750, index: 529 },
  { text: "lu", duration: 0.53, begin: 204.000, index: 530 },
  { text: "nu", duration: 0.53, begin: 204.250, index: 531 },
  { text: " tu", duration: 0.53, begin: 204.500, index: 532 },
  { text: "tar", duration: 0.53, begin: 204.750, index: 533 },
  { text: " ve", duration: 0.53, begin: 205.250, index: 534 },
  { text: " yaş", duration: 0.53, begin: 206.250, index: 535 },
  { text: "lı", duration: 0.53, begin: 206.500, index: 536 },
  { text: " a", duration: 0.53, begin: 206.750, index: 537 },
  { text: "da", duration: 0.53, begin: 207.000, index: 538 },
  { text: "ma,", duration: 0.53, begin: 207.250, index: 539 },
  { text: " şim", duration: 0.53, begin: 208.750, index: 540 },
  { text: "di", duration: 0.53, begin: 209.000, index: 541 },
  { text: "ye", duration: 0.53, begin: 209.250, index: 542 },
  { text: " ka", duration: 0.53, begin: 209.500, index: 543 },
  { text: "dar", duration: 0.53, begin: 209.750, index: 544 },
  { text: " kay", duration: 0.28, begin: 210.750, index: 545 },
  { text: "na", duration: 0.28, begin: 211.000, index: 546 },
  { text: "na", duration: 0.28, begin: 211.250, index: 547 },
  { text: "sı", duration: 0.28, begin: 211.500, index: 548 },
  { text: "na", duration: 0.28, begin: 211.750, index: 549 },
  { text: " ver", duration: 0.53, begin: 212.000, index: 550 },
  { text: "di", duration: 0.53, begin: 212.250, index: 551 },
  { text: "ği", duration: 0.53, begin: 212.500, index: 552 },
  { text: " ze", duration: 0.53, begin: 212.750, index: 553 },
  { text: "hir", duration: 0.53, begin: 213.000, index: 554 },
  { text: "le", duration: 0.53, begin: 213.250, index: 555 },
  { text: "ri", duration: 0.53, begin: 213.500, index: 556 },
  { text: " o", duration: 0.28, begin: 214.500, index: 557 },
  { text: "nun", duration: 0.28, begin: 214.750, index: 558 },
  { text: " ka", duration: 0.53, begin: 215.000, index: 559 },
  { text: "nın", duration: 0.53, begin: 215.250, index: 560 },
  { text: "dan", duration: 0.53, begin: 215.500, index: 561 },
  { text: " te", duration: 0.53, begin: 215.750, index: 562 },
  { text: "miz", duration: 0.53, begin: 216.000, index: 563 },
  { text: "le", duration: 0.53, begin: 216.250, index: 564 },
  { text: "ye", duration: 0.53, begin: 216.500, index: 565 },
  { text: "cek", duration: 0.53, begin: 216.751, index: 566 },
  { text: " bir", duration: 0.53, begin: 217.000, index: 567 },
  { text: " ik", duration: 0.53, begin: 218.000, index: 568 },
  { text: "sir", duration: 0.53, begin: 218.250, index: 569 },
  { text: " i", duration: 0.53, begin: 218.500, index: 570 },
  { text: "çin", duration: 0.53, begin: 218.750, index: 571 },
  { text: " yal", duration: 0.53, begin: 219.500, index: 572 },
  { text: "va", duration: 0.53, begin: 219.750, index: 573 },
  { text: "rır.", duration: 0.53, begin: 220.000, index: 574 },
  { text: " Ka", duration: 0.53, begin: 221.500, index: 575 },
  { text: "yın", duration: 0.53, begin: 221.750, index: 576 },
  { text: "va", duration: 0.53, begin: 222.000, index: 577 },
  { text: "li", duration: 0.53, begin: 222.250, index: 578 },
  { text: "de", duration: 0.53, begin: 222.500, index: 579 },
  { text: "si", duration: 0.53, begin: 222.750, index: 580 },
  { text: "nin", duration: 0.53, begin: 223.000, index: 581 },
  { text: " ar", duration: 0.53, begin: 223.750, index: 582 },
  { text: "tık", duration: 0.53, begin: 224.000, index: 583 },
  { text: " öl", duration: 0.38, begin: 224.750, index: 584 },
  { text: "me", duration: 0.38, begin: 225.000, index: 585 },
  { text: "si", duration: 0.38, begin: 225.250, index: 586 },
  { text: "ni", duration: 0.38, begin: 225.500, index: 587 },
  { text: " is", duration: 0.53, begin: 225.750, index: 588 },
  { text: "te", duration: 0.53, begin: 226.000, index: 589 },
  { text: "me", duration: 0.53, begin: 226.250, index: 590 },
  { text: "mek", duration: 0.53, begin: 226.500, index: 591 },
  { text: "te", duration: 0.53, begin: 226.750, index: 592 },
  { text: "dir.", duration: 0.53, begin: 227.000, index: 593 },
  { text: " Yaş", duration: 0.53, begin: 228.250, index: 594 },
  { text: "lı", duration: 0.53, begin: 228.500, index: 595 },
  { text: " a", duration: 0.53, begin: 228.750, index: 596 },
  { text: "dam", duration: 0.53, begin: 229.000, index: 597 },
  { text: " kar", duration: 0.68, begin: 229.250, index: 598 },
  { text: "şı", duration: 0.68, begin: 229.500, index: 599 },
  { text: "sın", duration: 0.68, begin: 229.750, index: 600 },
  { text: "da", duration: 0.68, begin: 230.000, index: 601 },
  { text: " göz", duration: 0.53, begin: 231.500, index: 602 },
  { text: "yaş", duration: 0.53, begin: 231.750, index: 603 },
  { text: "la", duration: 0.53, begin: 232.000, index: 604 },
  { text: "rı", duration: 0.53, begin: 232.250, index: 605 },
  { text: "nı", duration: 0.53, begin: 232.500, index: 606 },
  { text: " tu", duration: 0.53, begin: 232.750, index: 607 },
  { text: "ta", duration: 0.53, begin: 233.000, index: 608 },
  { text: "ma", duration: 0.53, begin: 233.250, index: 609 },
  { text: "dan", duration: 0.53, begin: 233.500, index: 610 },
  { text: " ko", duration: 0.38, begin: 234.000, index: 611 },
  { text: "nu", duration: 0.38, begin: 234.250, index: 612 },
  { text: "şup", duration: 0.38, begin: 234.500, index: 613 },
  { text: " du", duration: 0.38, begin: 234.750, index: 614 },
  { text: "ran", duration: 0.28, begin: 235.000, index: 615 },
  { text: " Li", duration: 0.28, begin: 235.500, index: 616 },
  { text: "li'", duration: 0.28, begin: 235.750, index: 617 },
  { text: "ye", duration: 0.28, begin: 236.000, index: 618 },
  { text: " ba", duration: 0.23, begin: 236.750, index: 619 },
  { text: "kar", duration: 0.23, begin: 237.000, index: 620 },
  { text: " ve", duration: 0.53, begin: 237.250, index: 621 },
  { text: " kah", duration: 0.53, begin: 238.000, index: 622 },
  { text: "ka", duration: 0.53, begin: 238.250, index: 623 },
  { text: "ha", duration: 0.53, begin: 238.500, index: 624 },
  { text: "lar", duration: 0.53, begin: 238.750, index: 625 },
  { text: "la", duration: 0.53, begin: 239.000, index: 626 },
  { text: " gül", duration: 0.53, begin: 239.500, index: 627 },
  { text: "me", duration: 0.53, begin: 239.750, index: 628 },
  { text: "ye", duration: 0.53, begin: 240.000, index: 629 },
  { text: " baş", duration: 0.53, begin: 240.250, index: 630 },
  { text: "lar.", duration: 0.53, begin: 240.500, index: 631 },
  { text: " Ar", duration: 0.53, begin: 242.000, index: 632 },
  { text: "dın", duration: 0.53, begin: 242.250, index: 633 },
  { text: "dan:", duration: 0.53, begin: 242.500, index: 634 },
  { text: " Sev", duration: 0.53, begin: 243.500, index: 635 },
  { text: "gi", duration: 0.53, begin: 243.750, index: 636 },
  { text: "li", duration: 0.53, begin: 244.000, index: 637 },
  { text: " Li", duration: 0.53, begin: 244.250, index: 638 },
  { text: "li!", duration: 0.53, begin: 244.500, index: 639 },
  { text: " Sa", duration: 0.53, begin: 245.750, index: 640 },
  { text: "na", duration: 0.53, begin: 246.000, index: 641 },
  { text: " ver", duration: 0.53, begin: 246.250, index: 642 },
  { text: "dik", duration: 0.53, begin: 246.500, index: 643 },
  { text: "le", duration: 0.53, begin: 246.750, index: 644 },
  { text: "rim", duration: 0.53, begin: 247.000, index: 645 },
  { text: " sa", duration: 0.53, begin: 248.000, index: 646 },
  { text: "de", duration: 0.53, begin: 248.250, index: 647 },
  { text: "ce", duration: 0.53, begin: 248.500, index: 648 },
  { text: " vi", duration: 0.68, begin: 248.750, index: 649 },
  { text: "ta", duration: 0.68, begin: 249.000, index: 650 },
  { text: "min", duration: 0.68, begin: 249.250, index: 651 },
  { text: "ler", duration: 0.68, begin: 249.500, index: 652 },
  { text: "den", duration: 0.68, begin: 249.750, index: 653 },
  { text: " o", duration: 0.68, begin: 250.000, index: 654 },
  { text: "lu", duration: 0.68, begin: 250.250, index: 655 },
  { text: "şan", duration: 0.68, begin: 250.500, index: 656 },
  { text: " bir", duration: 0.68, begin: 251.000, index: 657 },
  { text: " ka", duration: 0.68, begin: 251.500, index: 658 },
  { text: "rı", duration: 0.68, begin: 251.750, index: 659 },
  { text: "şım", duration: 0.68, begin: 252.000, index: 660 },
  { text: "dı.", duration: 0.68, begin: 252.250, index: 661 },
  { text: " Ol", duration: 0.53, begin: 253.750, index: 662 },
  { text: "sa", duration: 0.53, begin: 254.000, index: 663 },
  { text: " ol", duration: 0.53, begin: 254.250, index: 664 },
  { text: "sa", duration: 0.53, begin: 254.500, index: 665 },
  { text: " ka", duration: 0.38, begin: 255.750, index: 666 },
  { text: "yın", duration: 0.38, begin: 256.000, index: 667 },
  { text: "va", duration: 0.38, begin: 256.250, index: 668 },
  { text: "li", duration: 0.38, begin: 256.500, index: 669 },
  { text: "de", duration: 0.38, begin: 256.750, index: 670 },
  { text: "ni", duration: 0.38, begin: 257.000, index: 671 },
  { text: " da", duration: 0.53, begin: 257.750, index: 672 },
  { text: "ha", duration: 0.53, begin: 258.000, index: 673 },
  { text: " da", duration: 0.53, begin: 258.250, index: 674 },
  { text: " güç", duration: 0.53, begin: 258.500, index: 675 },
  { text: "len", duration: 0.53, begin: 258.750, index: 676 },
  { text: "dir", duration: 0.53, begin: 259.000, index: 677 },
  { text: "din,", duration: 0.53, begin: 259.250, index: 678 },
  { text: " hep", duration: 0.68, begin: 260.500, index: 679 },
  { text: "si", duration: 0.68, begin: 260.750, index: 680 },
  { text: " bun", duration: 0.68, begin: 261.000, index: 681 },
  { text: "dan", duration: 0.68, begin: 261.250, index: 682 },
  { text: " i", duration: 0.68, begin: 261.500, index: 683 },
  { text: "ba", duration: 0.68, begin: 261.750, index: 684 },
  { text: "ret.", duration: 0.68, begin: 262.000, index: 685 },
  { text: " Ger", duration: 0.53, begin: 263.500, index: 686 },
  { text: "çek", duration: 0.53, begin: 263.750, index: 687 },
  { text: " ze", duration: 0.53, begin: 264.000, index: 688 },
  { text: "hir", duration: 0.53, begin: 264.250, index: 689 },
  { text: " i", duration: 0.53, begin: 264.500, index: 690 },
  { text: "se", duration: 0.53, begin: 264.750, index: 691 },
  { text: " se", duration: 0.53, begin: 266.000, index: 692 },
  { text: "nin", duration: 0.68, begin: 266.250, index: 693 },
  { text: " bey", duration: 0.68, begin: 266.500, index: 694 },
  { text: "nin", duration: 0.68, begin: 266.750, index: 695 },
  { text: "de", duration: 0.68, begin: 267.000, index: 696 },
  { text: " o", duration: 0.68, begin: 267.250, index: 697 },
  { text: "lan", duration: 0.68, begin: 267.500, index: 698 },
  { text: "dı.", duration: 0.68, begin: 267.750, index: 699 },
  { text: " Sen", duration: 0.53, begin: 269.250, index: 700 },
  { text: " o", duration: 0.53, begin: 269.500, index: 701 },
  { text: "na", duration: 0.53, begin: 269.750, index: 702 },
  { text: " i", duration: 0.53, begin: 270.000, index: 703 },
  { text: "yi", duration: 0.53, begin: 270.250, index: 704 },
  { text: " dav", duration: 0.68, begin: 270.500, index: 705 },
  { text: "ran", duration: 0.68, begin: 270.750, index: 706 },
  { text: "dık", duration: 0.68, begin: 271.000, index: 707 },
  { text: "ça", duration: 0.68, begin: 271.250, index: 708 },
  { text: " o", duration: 0.68, begin: 272.750, index: 709 },
  { text: "da", duration: 0.68, begin: 273.000, index: 710 },
  { text: " sev", duration: 0.68, begin: 273.750, index: 711 },
  { text: "gi", duration: 0.68, begin: 274.000, index: 712 },
  { text: "ye", duration: 0.68, begin: 274.250, index: 713 },
  { text: " yö", duration: 0.68, begin: 274.500, index: 714 },
  { text: "nel", duration: 0.68, begin: 274.750, index: 715 },
  { text: "di.", duration: 0.68, begin: 275.000, index: 716 },
  { text: " Böy", duration: 0.53, begin: 276.500, index: 717 },
  { text: "le", duration: 0.53, begin: 276.750, index: 718 },
  { text: "ce", duration: 0.53, begin: 277.000, index: 719 },
  { text: " siz", duration: 0.53, begin: 277.250, index: 720 },
  { text: " ger", duration: 0.53, begin: 278.500, index: 721 },
  { text: "çek", duration: 0.53, begin: 278.750, index: 722 },
  { text: " an", duration: 0.68, begin: 279.000, index: 723 },
  { text: "ne", duration: 0.68, begin: 279.250, index: 724 },
  { text: " kız", duration: 0.68, begin: 279.500, index: 725 },
  { text: " ol", duration: 0.68, begin: 280.000, index: 726 },
  { text: "du", duration: 0.68, begin: 280.250, index: 727 },
  { text: "nuz!", duration: 0.68, begin: 280.500, index: 728 },
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
  <Link href="/dashboard/stories/kim-fark-eder" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/hemen-mi-olecegim" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/2-2.mp3"
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