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
  { text: "Ka", duration: 0.38, begin: 0.750, index: 1, isTitle: true, isCenter: true },
  { text: "vak", duration: 0.38, begin: 0.900, index: 2, isTitle: true, isCenter: true },
  { text: " A", duration: 0.38, begin: 1.100, index: 3, isTitle: true, isCenter: true },
  { text: "ğa", duration: 0.38, begin: 1.250, index: 4, isTitle: true, isCenter: true },
  { text: "cı", duration: 0.38, begin: 1.550, index: 5, isTitle: true, isCenter: true },
  { text: " i", duration: 0.38, begin: 1.750, index: 6, isTitle: true, isCenter: true },
  { text: "le", duration: 0.38, begin: 2.000, index: 7, isTitle: true, isCenter: true },
  { text: " Ka", duration: 0.38, begin: 2.250, index: 8, isTitle: true, isCenter: true },
  { text: "bak", duration: 0.38, begin: 2.500, index: 9, isTitle: true, isCenter: true },
  
  // Story content
  { text: " U", duration: 0.53, begin: 3.000, index: 10 },
  { text: "lu", duration: 0.53, begin: 3.250, index: 11 },
  { text: " bir", duration: 0.53, begin: 3.500, index: 12 },
  { text: " ka", duration: 0.53, begin: 3.750, index: 13 },
  { text: "vak", duration: 0.53, begin: 4.000, index: 14 },
  { text: " a", duration: 0.53, begin: 4.250, index: 15 },
  { text: "ğa", duration: 0.53, begin: 4.500, index: 16 },
  { text: "cı", duration: 0.53, begin: 4.750, index: 17 },
  { text: "nın", duration: 0.53, begin: 5.000, index: 18 },
  { text: " ya", duration: 0.53, begin: 5.250, index: 19 },
  { text: "nın", duration: 0.53, begin: 5.500, index: 20 },
  { text: "da", duration: 0.53, begin: 5.750, index: 21 },
  { text: " bir", duration: 0.53, begin: 6.750, index: 22 },
  { text: " ka", duration: 0.53, begin: 7.000, index: 23 },
  { text: "bak", duration: 0.53, begin: 7.250, index: 24 },
  { text: " fi", duration: 0.53, begin: 7.500, index: 25 },
  { text: "li", duration: 0.53, begin: 7.750, index: 26 },
  { text: "zi", duration: 0.53, begin: 8.000, index: 27 },
  { text: " boy", duration: 0.53, begin: 8.250, index: 28 },
  { text: " gös", duration: 0.53, begin: 8.500, index: 29 },
  { text: "ter", duration: 0.53, begin: 8.750, index: 30 },
  { text: "miş.", duration: 0.53, begin: 9.000, index: 31 },
  { text: " Ba", duration: 0.53, begin: 10.250, index: 32 },
  { text: "har", duration: 0.53, begin: 10.500, index: 33 },
  { text: " i", duration: 0.53, begin: 10.750, index: 34 },
  { text: "ler", duration: 0.53, begin: 11.000, index: 35 },
  { text: "le", duration: 0.53, begin: 11.250, index: 36 },
  { text: "dik", duration: 0.53, begin: 11.500, index: 37 },
  { text: "çe,", duration: 0.53, begin: 11.750, index: 38 },
  { text: " bit", duration: 0.53, begin: 12.750, index: 39 },
  { text: "ki", duration: 0.53, begin: 13.000, index: 40 },
  { text: " ka", duration: 0.53, begin: 13.250, index: 41 },
  { text: "vak", duration: 0.53, begin: 13.500, index: 42 },
  { text: " a", duration: 0.53, begin: 13.750, index: 43 },
  { text: "ğa", duration: 0.53, begin: 14.000, index: 44 },
  { text: "cı", duration: 0.53, begin: 14.250, index: 45 },
  { text: "na", duration: 0.53, begin: 14.500, index: 46 },
  { text: " sa", duration: 0.53, begin: 14.750, index: 47 },
  { text: "rı", duration: 0.53, begin: 15.000, index: 48 },
  { text: "la", duration: 0.53, begin: 15.250, index: 49 },
  { text: "rak", duration: 0.53, begin: 15.500, index: 50 },
  { text: " yük", duration: 0.53, begin: 15.750, index: 51 },
  { text: "sel", duration: 0.53, begin: 16.000, index: 52 },
  { text: "me", duration: 0.53, begin: 16.250, index: 53 },
  { text: "ye", duration: 0.53, begin: 16.500, index: 54 },
  { text: " baş", duration: 0.53, begin: 16.750, index: 55 },
  { text: "la", duration: 0.53, begin: 17.000, index: 56 },
  { text: "mış.", duration: 0.53, begin: 17.250, index: 57 },
  { text: " Yağ", duration: 0.53, begin: 18.750, index: 58 },
  { text: "mur", duration: 0.53, begin: 19.000, index: 59 },
  { text: "la", duration: 0.53, begin: 19.250, index: 60 },
  { text: "rın", duration: 0.53, begin: 19.500, index: 61 },
  { text: " ve", duration: 0.53, begin: 19.750, index: 62 },
  { text: " gü", duration: 0.53, begin: 20.000, index: 63 },
  { text: "ne", duration: 0.53, begin: 20.250, index: 64 },
  { text: "şin", duration: 0.53, begin: 20.500, index: 65 },
  { text: " et", duration: 0.53, begin: 20.750, index: 66 },
  { text: "ki", duration: 0.53, begin: 21.000, index: 67 },
  { text: "siy", duration: 0.53, begin: 21.250, index: 68 },
  { text: "le", duration: 0.53, begin: 21.500, index: 69 },
  { text: " müt", duration: 0.53, begin: 22.500, index: 70 },
  { text: "hiş", duration: 0.53, begin: 22.750, index: 71 },
  { text: " bir", duration: 0.53, begin: 23.000, index: 72 },
  { text: " hız", duration: 0.53, begin: 23.250, index: 73 },
  { text: "la", duration: 0.53, begin: 23.500, index: 74 },
  { text: " bü", duration: 0.53, begin: 24.000, index: 75 },
  { text: "yü", duration: 0.53, begin: 24.250, index: 76 },
  { text: "müş", duration: 0.53, begin: 24.500, index: 77 },
  { text: " ve", duration: 0.53, begin: 24.750, index: 78 },
  { text: " ne", duration: 0.53, begin: 25.750, index: 79 },
  { text: "re", duration: 0.53, begin: 26.000, index: 80 },
  { text: "dey", duration: 0.53, begin: 26.250, index: 81 },
  { text: "se", duration: 0.53, begin: 26.500, index: 82 },
  { text: " ka", duration: 0.53, begin: 26.750, index: 83 },
  { text: "vak", duration: 0.53, begin: 27.000, index: 84 },
  { text: " a", duration: 0.53, begin: 27.250, index: 85 },
  { text: "ğa", duration: 0.53, begin: 27.500, index: 86 },
  { text: "cı", duration: 0.53, begin: 27.750, index: 87 },
  { text: " i", duration: 0.53, begin: 28.000, index: 88 },
  { text: "le", duration: 0.53, begin: 28.250, index: 89 },
  { text: " ay", duration: 0.53, begin: 28.500, index: 90 },
  { text: "nı", duration: 0.53, begin: 28.750, index: 91 },
  { text: " bo", duration: 0.53, begin: 29.000, index: 92 },
  { text: "ya", duration: 0.53, begin: 29.250, index: 93 },
  { text: " gel", duration: 0.53, begin: 29.500, index: 94 },
  { text: "miş.", duration: 0.53, begin: 29.750, index: 95 },
  { text: " Bir", duration: 0.53, begin: 31.250, index: 96 },
  { text: " gün", duration: 0.53, begin: 31.500, index: 97 },
  { text: " da", duration: 0.53, begin: 31.750, index: 98 },
  { text: "ya", duration: 0.53, begin: 32.000, index: 99 },
  { text: "na", duration: 0.53, begin: 32.250, index: 100 },
  { text: "ma", duration: 0.53, begin: 32.500, index: 101 },
  { text: "yıp", duration: 0.53, begin: 32.750, index: 102 },
  { text: " sor", duration: 0.53, begin: 33.000, index: 103 },
  { text: "muş", duration: 0.53, begin: 33.250, index: 104 },
  { text: " ka", duration: 0.53, begin: 33.500, index: 105 },
  { text: "va", duration: 0.53, begin: 33.750, index: 106 },
  { text: "ğa:", duration: 0.53, begin: 34.000, index: 107 },
  { text: " \"Sen", duration: 0.53, begin: 35.500, index: 108 },
  { text: " kaç", duration: 0.53, begin: 35.750, index: 109 },
  { text: " ay", duration: 0.53, begin: 36.000, index: 110 },
  { text: "da", duration: 0.53, begin: 36.250, index: 111 },
  { text: " bu", duration: 0.53, begin: 36.750, index: 112 },
  { text: " ha", duration: 0.53, begin: 37.000, index: 113 },
  { text: "le", duration: 0.53, begin: 37.250, index: 114 },
  { text: " gel", duration: 0.53, begin: 37.500, index: 115 },
  { text: "din,", duration: 0.53, begin: 37.750, index: 116 },
  { text: " a", duration: 0.53, begin: 38.750, index: 117 },
  { text: "ğaç?\"", duration: 0.53, begin: 39.000, index: 118 },
  { text: " \"On", duration: 0.53, begin: 40.500, index: 119 },
  { text: " yıl", duration: 0.53, begin: 40.750, index: 120 },
  { text: "da,\"", duration: 0.38, begin: 41.000, index: 121 },
  { text: " de", duration: 0.38, begin: 41.750, index: 122 },
  { text: "miş", duration: 0.38, begin: 42.000, index: 123 },
  { text: " ka", duration: 0.38, begin: 42.250, index: 124 },
  { text: "vak.", duration: 0.38, begin: 42.500, index: 125 },
  { text: " \"On", duration: 0.53, begin: 43.250, index: 126 },
  { text: " yıl", duration: 0.53, begin: 43.500, index: 127 },
  { text: "da", duration: 0.53, begin: 43.750, index: 128 },
  { text: " mı?\"", duration: 0.53, begin: 44.000, index: 129 },
  { text: " Di", duration: 0.53, begin: 45.000, index: 130 },
  { text: "ye", duration: 0.53, begin: 45.250, index: 131 },
  { text: " gül", duration: 0.53, begin: 45.500, index: 132 },
  { text: "müş", duration: 0.53, begin: 45.750, index: 133 },
  { text: " ve", duration: 0.53, begin: 46.750, index: 134 },
  { text: " çi", duration: 0.53, begin: 47.000, index: 135 },
  { text: "cek", duration: 0.53, begin: 47.250, index: 136 },
  { text: "le", duration: 0.53, begin: 47.500, index: 137 },
  { text: "ri", duration: 0.53, begin: 47.750, index: 138 },
  { text: "ni", duration: 0.53, begin: 48.000, index: 139 },
  { text: " sal", duration: 0.53, begin: 48.250, index: 140 },
  { text: "la", duration: 0.53, begin: 48.500, index: 141 },
  { text: "mış", duration: 0.53, begin: 48.750, index: 142 },
  { text: " ka", duration: 0.53, begin: 49.000, index: 143 },
  { text: "bak.", duration: 0.53, begin: 49.250, index: 144 },
  { text: " Ben", duration: 0.53, begin: 50.500, index: 145 },
  { text: " ne", duration: 0.53, begin: 50.750, index: 146 },
  { text: "re", duration: 0.53, begin: 51.000, index: 147 },
  { text: "dey", duration: 0.53, begin: 51.250, index: 148 },
  { text: "se", duration: 0.53, begin: 51.500, index: 149 },
  { text: " i", duration: 0.53, begin: 52.500, index: 150 },
  { text: "ki", duration: 0.53, begin: 52.750, index: 151 },
  { text: " ay", duration: 0.53, begin: 53.000, index: 152 },
  { text: "da", duration: 0.53, begin: 53.250, index: 153 },
  { text: " se", duration: 0.53, begin: 53.500, index: 154 },
  { text: "nin", duration: 0.53, begin: 53.750, index: 155 },
  { text: "le", duration: 0.53, begin: 54.000, index: 156 },
  { text: " ay", duration: 0.53, begin: 54.500, index: 157 },
  { text: "nı", duration: 0.53, begin: 54.750, index: 158 },
  { text: " bo", duration: 0.53, begin: 55.000, index: 159 },
  { text: "ya", duration: 0.53, begin: 55.250, index: 160 },
  { text: " gel", duration: 0.53, begin: 55.750, index: 161 },
  { text: "dim.\"", duration: 0.53, begin: 56.000, index: 162 },
  { text: " \"Doğ", duration: 0.38, begin: 57.250, index: 163 },
  { text: "ru\"", duration: 0.38, begin: 57.500, index: 164 },
  { text: " de", duration: 0.38, begin: 58.250, index: 165 },
  { text: "miş", duration: 0.38, begin: 58.500, index: 166 },
  { text: " ka", duration: 0.38, begin: 58.750, index: 167 },
  { text: "vak.", duration: 0.38, begin: 59.000, index: 168 },
  { text: " Gün", duration: 0.53, begin: 60.000, index: 169 },
  { text: "ler", duration: 0.53, begin: 60.250, index: 170 },
  { text: " gün", duration: 0.53, begin: 60.500, index: 171 },
  { text: "le", duration: 0.53, begin: 60.750, index: 172 },
  { text: "ri", duration: 0.53, begin: 61.000, index: 173 },
  { text: " ko", duration: 0.53, begin: 61.250, index: 174 },
  { text: "va", duration: 0.53, begin: 61.500, index: 175 },
  { text: "la", duration: 0.53, begin: 61.750, index: 176 },
  { text: "mış", duration: 0.53, begin: 62.000, index: 177 },
  { text: " ve", duration: 0.53, begin: 62.250, index: 178 },
  { text: " son", duration: 0.53, begin: 63.250, index: 179 },
  { text: "ba", duration: 0.53, begin: 63.500, index: 180 },
  { text: "ha", duration: 0.53, begin: 63.750, index: 181 },
  { text: "rın", duration: 0.53, begin: 64.000, index: 182 },
  { text: " ilk", duration: 0.53, begin: 64.750, index: 183 },
  { text: " rüz", duration: 0.53, begin: 65.000, index: 184 },
  { text: "gar", duration: 0.53, begin: 65.250, index: 185 },
  { text: "la", duration: 0.53, begin: 65.500, index: 186 },
  { text: "rı", duration: 0.53, begin: 65.750, index: 187 },
  { text: " baş", duration: 0.53, begin: 66.000, index: 188 },
  { text: "la", duration: 0.53, begin: 66.250, index: 189 },
  { text: "dı", duration: 0.53, begin: 66.500, index: 190 },
  { text: "ğın", duration: 0.53, begin: 66.750, index: 191 },
  { text: "da", duration: 0.53, begin: 67.000, index: 192 },
  { text: " ka", duration: 0.53, begin: 68.000, index: 193 },
  { text: "bak", duration: 0.53, begin: 68.250, index: 194 },
  { text: " ü", duration: 0.53, begin: 68.500, index: 195 },
  { text: "şü", duration: 0.53, begin: 68.750, index: 196 },
  { text: "me", duration: 0.53, begin: 69.000, index: 197 },
  { text: "ye,", duration: 0.53, begin: 69.250, index: 198 },
  { text: " son", duration: 0.53, begin: 70.250, index: 199 },
  { text: "ra", duration: 0.53, begin: 70.500, index: 200 },
  { text: " yap", duration: 0.53, begin: 70.750, index: 201 },
  { text: "rak", duration: 0.53, begin: 71.000, index: 202 },
  { text: "la", duration: 0.53, begin: 71.250, index: 203 },
  { text: "rı", duration: 0.53, begin: 71.500, index: 204 },
  { text: "nı", duration: 0.53, begin: 71.750, index: 205 },
  { text: " dü", duration: 0.53, begin: 72.000, index: 206 },
  { text: "şür", duration: 0.53, begin: 72.250, index: 207 },
  { text: "me", duration: 0.53, begin: 72.500, index: 208 },
  { text: "ye,", duration: 0.53, begin: 72.750, index: 209 },
  { text: " so", duration: 0.53, begin: 74.250, index: 210 },
  { text: "ğuk", duration: 0.53, begin: 74.500, index: 211 },
  { text: "lar", duration: 0.53, begin: 74.750, index: 212 },
  { text: " art", duration: 0.68, begin: 75.000, index: 213 },
  { text: "tık", duration: 0.68, begin: 75.250, index: 214 },
  { text: "ça", duration: 0.68, begin: 75.500, index: 215 },
  { text: "da", duration: 0.68, begin: 75.750, index: 216 },
  { text: " a", duration: 0.28, begin: 77.250, index: 217 },
  { text: "şa", duration: 0.28, begin: 77.500, index: 218 },
  { text: "ğı", duration: 0.28, begin: 77.750, index: 219 },
  { text: "ya", duration: 0.28, begin: 78.000, index: 220 },
  { text: " doğ", duration: 0.28, begin: 78.250, index: 221 },
  { text: "ru", duration: 0.28, begin: 78.500, index: 222 },
  { text: " in", duration: 0.53, begin: 78.750, index: 223 },
  { text: "me", duration: 0.53, begin: 79.000, index: 224 },
  { text: "ye", duration: 0.53, begin: 79.250, index: 225 },
  { text: " baş", duration: 0.53, begin: 79.500, index: 226 },
  { text: "la", duration: 0.53, begin: 79.750, index: 227 },
  { text: "mış.", duration: 0.53, begin: 80.000, index: 228 },
  { text: " Sor", duration: 0.53, begin: 81.250, index: 229 },
  { text: "muş", duration: 0.53, begin: 81.500, index: 230 },
  { text: " en", duration: 0.53, begin: 81.750, index: 231 },
  { text: "di", duration: 0.53, begin: 82.000, index: 232 },
  { text: "şey", duration: 0.53, begin: 82.250, index: 233 },
  { text: "le", duration: 0.53, begin: 82.500, index: 234 },
  { text: " ka", duration: 0.53, begin: 82.750, index: 235 },
  { text: "va", duration: 0.53, begin: 83.000, index: 236 },
  { text: "ğa:", duration: 0.53, begin: 83.250, index: 237 },
  { text: " \"Ne", duration: 0.53, begin: 84.250, index: 238 },
  { text: "ler", duration: 0.53, begin: 84.500, index: 239 },
  { text: " o", duration: 0.53, begin: 84.750, index: 240 },
  { text: "lu", duration: 0.53, begin: 85.000, index: 241 },
  { text: "yor", duration: 0.53, begin: 85.250, index: 242 },
  { text: " ba", duration: 0.53, begin: 85.500, index: 243 },
  { text: "na", duration: 0.53, begin: 85.750, index: 244 },
  { text: " a", duration: 0.28, begin: 86.500, index: 245 },
  { text: "ğaç?\"", duration: 0.28, begin: 86.750, index: 246 },
  { text: " \"Ö", duration: 0.53, begin: 87.250, index: 247 },
  { text: "lü", duration: 0.53, begin: 87.500, index: 248 },
  { text: "yor", duration: 0.53, begin: 87.750, index: 249 },
  { text: "sun,\"", duration: 0.53, begin: 88.000, index: 250 },
  { text: " de", duration: 0.53, begin: 88.750, index: 251 },
  { text: "miş", duration: 0.53, begin: 89.000, index: 252 },
  { text: " ka", duration: 0.53, begin: 89.250, index: 253 },
  { text: "vak.", duration: 0.53, begin: 89.500, index: 254 },
  { text: " \"Ni", duration: 0.53, begin: 90.750, index: 255 },
  { text: "çin?\"", duration: 0.53, begin: 91.000, index: 256 },
  { text: " \"Be", duration: 0.53, begin: 92.250, index: 257 },
  { text: "nim", duration: 0.53, begin: 92.500, index: 258 },
  { text: " on", duration: 0.53, begin: 92.750, index: 259 },
  { text: " yıl", duration: 0.53, begin: 93.000, index: 260 },
  { text: "da", duration: 0.53, begin: 93.250, index: 261 },
  { text: " gel", duration: 0.53, begin: 93.750, index: 262 },
  { text: "di", duration: 0.53, begin: 94.000, index: 263 },
  { text: "ğim", duration: 0.53, begin: 94.250, index: 264 },
  { text: " ye", duration: 0.53, begin: 94.500, index: 265 },
  { text: "re,", duration: 0.53, begin: 94.750, index: 266 },
  { text: " i", duration: 0.53, begin: 95.750, index: 267 },
  { text: "ki", duration: 0.53, begin: 96.000, index: 268 },
  { text: " ay", duration: 0.53, begin: 96.250, index: 269 },
  { text: "da", duration: 0.53, begin: 96.500, index: 270 },
  { text: " gel", duration: 0.53, begin: 97.000, index: 271 },
  { text: "me", duration: 0.53, begin: 97.250, index: 272 },
  { text: "ye", duration: 0.53, begin: 97.500, index: 273 },
  { text: " ça", duration: 0.53, begin: 97.750, index: 274 },
  { text: "lış", duration: 0.53, begin: 98.000, index: 275 },
  { text: "tı", duration: 0.53, begin: 98.250, index: 276 },
  { text: "ğın", duration: 0.53, begin: 98.500, index: 277 },
  { text: " i", duration: 0.53, begin: 98.750, index: 278 },
  { text: "çin.\"", duration: 0.53, begin: 99.000, index: 279 },
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
  <Link href="/dashboard/stories/kisilik" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/on-yargi" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/3-3.mp3"
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