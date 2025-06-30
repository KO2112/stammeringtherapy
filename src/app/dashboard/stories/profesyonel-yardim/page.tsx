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
  
  
  // Title
  { text: "Pro", duration: 0.28, begin: 0.700, index: 1, isTitle: true, isCenter: true },
  { text: "fes", duration: 0.38, begin: 1.000, index: 2, isTitle: true, isCenter: true },
  { text: "yo", duration: 0.38, begin: 1.250, index: 3, isTitle: true, isCenter: true },
  { text: "nel", duration: 0.28, begin: 1.500, index: 4, isTitle: true, isCenter: true },
  { text: " Yar", duration: 0.38, begin: 1.850, index: 5, isTitle: true, isCenter: true },
  { text: "dım", duration: 0.38, begin: 2.150, index: 6, isTitle: true, isCenter: true },
  
  // Story content
  { text: " Genç", duration: 0.28, begin: 3.250, index: 7 },
  { text: " ka", duration: 0.28, begin: 3.500, index: 8 },
  { text: "dın", duration: 0.28, begin: 3.750, index: 9 },
  { text: " iş", duration: 0.28, begin: 4.250, index: 10 },
  { text: "ye", duration: 0.28, begin: 4.500, index: 11 },
  { text: "rin", duration: 0.28, begin: 4.750, index: 12 },
  { text: "de", duration: 0.28, begin: 5.000, index: 13 },
  { text: " kö", duration: 0.28, begin: 5.250, index: 14 },
  { text: "tü", duration: 0.28, begin: 5.500, index: 15 },
  { text: " bir", duration: 0.28, begin: 5.750, index: 16 },
  { text: " ha", duration: 0.28, begin: 6.000, index: 17 },
  { text: "ber", duration: 0.28, begin: 6.250, index: 18 },
  { text: " a", duration: 0.28, begin: 6.500, index: 19 },
  { text: "lır.", duration: 0.28, begin: 6.750, index: 20 },
  { text: " Kü", duration: 0.28, begin: 7.500, index: 21 },
  { text: "çük", duration: 0.28, begin: 7.750, index: 22 },
  { text: " kı", duration: 0.28, begin: 8.000, index: 23 },
  { text: "zı", duration: 0.28, begin: 8.250, index: 24 },
  { text: "nın", duration: 0.28, begin: 8.500, index: 25 },
  { text: " ba", duration: 0.28, begin: 8.750, index: 26 },
  { text: "kı", duration: 0.28, begin: 9.000, index: 27 },
  { text: "cı", duration: 0.28, begin: 9.250, index: 28 },
  { text: "sı", duration: 0.28, begin: 9.500, index: 29 },
  { text: " te", duration: 0.28, begin: 10.250, index: 30 },
  { text: "le", duration: 0.28, begin: 10.500, index: 31 },
  { text: "fon", duration: 0.28, begin: 10.750, index: 32 },
  { text: "da", duration: 0.28, begin: 11.000, index: 33 },
  { text: " ço", duration: 0.28, begin: 11.250, index: 34 },
  { text: "cu", duration: 0.28, begin: 11.500, index: 35 },
  { text: "ğun", duration: 0.28, begin: 11.750, index: 36 },
  { text: " çok", duration: 0.28, begin: 12.000, index: 37 },
  { text: " a", duration: 0.28, begin: 12.250, index: 38 },
  { text: "teş", duration: 0.28, begin: 12.500, index: 39 },
  { text: "len", duration: 0.28, begin: 12.750, index: 40 },
  { text: "di", duration: 0.28, begin: 13.000, index: 41 },
  { text: "ği", duration: 0.28, begin: 13.250, index: 42 },
  { text: "ni", duration: 0.28, begin: 13.500, index: 43 },
  { text: " mut", duration: 0.28, begin: 14.000, index: 44 },
  { text: "la", duration: 0.28, begin: 14.250, index: 45 },
  { text: "ka", duration: 0.28, begin: 14.500, index: 46 },
  { text: " e", duration: 0.28, begin: 15.000, index: 47 },
  { text: "ve", duration: 0.28, begin: 15.250, index: 48 },
  { text: " gel", duration: 0.28, begin: 15.750, index: 49 },
  { text: "me", duration: 0.28, begin: 16.000, index: 50 },
  { text: "si", duration: 0.28, begin: 16.250, index: 51 },
  { text: " ge", duration: 0.28, begin: 16.500, index: 52 },
  { text: "rek", duration: 0.28, begin: 16.700, index: 53 },
  { text: "ti", duration: 0.28, begin: 16.900, index: 54 },
  { text: "ği", duration: 0.28, begin: 17.200, index: 55 },
  { text: "ni", duration: 0.28, begin: 17.500, index: 56 },
  { text: " bil", duration: 0.28, begin: 17.700, index: 57 },
  { text: "di", duration: 0.28, begin: 17.900, index: 58 },
  { text: "rir.", duration: 0.28, begin: 18.250, index: 59 },
  { text: " He", duration: 0.28, begin: 19.000, index: 60 },
  { text: "men", duration: 0.28, begin: 19.250, index: 61 },
  { text: " i", duration: 0.28, begin: 19.500, index: 62 },
  { text: "şin", duration: 0.28, begin: 19.750, index: 63 },
  { text: "den", duration: 0.28, begin: 20.000, index: 64 },
  { text: " i", duration: 0.28, begin: 20.250, index: 65 },
  { text: "zin", duration: 0.28, begin: 20.500, index: 66 },
  { text: " a", duration: 0.28, begin: 20.750, index: 67 },
  { text: "lır", duration: 0.28, begin: 21.000, index: 68 },
  { text: " ve", duration: 0.28, begin: 21.250, index: 69 },
  { text: " a", duration: 0.28, begin: 21.750, index: 70 },
  { text: "teş", duration: 0.28, begin: 22.000, index: 71 },
  { text: " dü", duration: 0.28, begin: 22.250, index: 72 },
  { text: "şü", duration: 0.28, begin: 22.500, index: 73 },
  { text: "rü", duration: 0.28, begin: 22.750, index: 74 },
  { text: "cü", duration: 0.28, begin: 23.000, index: 75 },
  { text: " bir", duration: 0.28, begin: 23.250, index: 76 },
  { text: " i", duration: 0.28, begin: 23.500, index: 77 },
  { text: "laç", duration: 0.28, begin: 23.750, index: 78 },
  { text: " i", duration: 0.28, begin: 24.000, index: 79 },
  { text: "çin", duration: 0.28, begin: 24.250, index: 80 },
  { text: " en", duration: 0.28, begin: 24.750, index: 81 },
  { text: " ya", duration: 0.28, begin: 25.000, index: 82 },
  { text: "kın", duration: 0.28, begin: 25.250, index: 83 },
  { text: " ec", duration: 0.28, begin: 25.500, index: 84 },
  { text: "za", duration: 0.28, begin: 25.750, index: 85 },
  { text: "ne", duration: 0.28, begin: 26.000, index: 86 },
  { text: "ye", duration: 0.28, begin: 26.250, index: 87 },
  { text: " ko", duration: 0.28, begin: 26.500, index: 88 },
  { text: "şar.", duration: 0.28, begin: 26.750, index: 89 },
  { text: " A", duration: 0.28, begin: 28.000, index: 90 },
  { text: "ra", duration: 0.28, begin: 28.250, index: 91 },
  { text: "ba", duration: 0.28, begin: 28.500, index: 92 },
  { text: "sı", duration: 0.28, begin: 28.750, index: 93 },
  { text: "nın", duration: 0.28, begin: 29.000, index: 94 },
  { text: " ya", duration: 0.28, begin: 29.250, index: 95 },
  { text: "nı", duration: 0.28, begin: 29.500, index: 96 },
  { text: "na", duration: 0.28, begin: 29.750, index: 97 },
  { text: " gel", duration: 0.28, begin: 30.000, index: 98 },
  { text: "di", duration: 0.28, begin: 30.250, index: 99 },
  { text: "ğin", duration: 0.28, begin: 30.500, index: 100 },
  { text: "de", duration: 0.28, begin: 30.750, index: 101 },
  { text: " a", duration: 0.28, begin: 31.250, index: 102 },
  { text: "ra", duration: 0.28, begin: 31.500, index: 103 },
  { text: "ba", duration: 0.28, begin: 31.750, index: 104 },
  { text: "yı", duration: 0.28, begin: 32.000, index: 105 },
  { text: " a", duration: 0.28, begin: 32.250, index: 106 },
  { text: "nah", duration: 0.28, begin: 32.500, index: 107 },
  { text: "ta", duration: 0.28, begin: 32.750, index: 108 },
  { text: "rı", duration: 0.28, begin: 33.000, index: 109 },
  { text: " i", duration: 0.28, begin: 33.500, index: 110 },
  { text: "çin", duration: 0.28, begin: 33.750, index: 111 },
  { text: "dey", duration: 0.28, begin: 34.000, index: 112 },
  { text: "ken", duration: 0.28, begin: 34.250, index: 113 },
  { text: " ki", duration: 0.28, begin: 34.500, index: 114 },
  { text: "lit", duration: 0.28, begin: 34.750, index: 115 },
  { text: "le", duration: 0.28, begin: 35.000, index: 116 },
  { text: "di", duration: 0.28, begin: 35.250, index: 117 },
  { text: "ği", duration: 0.28, begin: 35.500, index: 118 },
  { text: "nin", duration: 0.28, begin: 35.750, index: 119 },
  { text: " far", duration: 0.28, begin: 36.000, index: 120 },
  { text: "kı", duration: 0.28, begin: 36.250, index: 121 },
  { text: "na", duration: 0.28, begin: 36.500, index: 122 },
  { text: " va", duration: 0.28, begin: 36.750, index: 123 },
  { text: "rır.", duration: 0.28, begin: 37.000, index: 124 },
  { text: " E", duration: 0.28, begin: 37.500, index: 125 },
  { text: "ve", duration: 0.28, begin: 37.750, index: 126 },
  { text: " he", duration: 0.28, begin: 38.000, index: 127 },
  { text: "men", duration: 0.28, begin: 38.250, index: 128 },
  { text: " ye", duration: 0.28, begin: 38.500, index: 129 },
  { text: "tiş", duration: 0.28, begin: 38.750, index: 130 },
  { text: "me", duration: 0.28, begin: 39.000, index: 131 },
  { text: "si", duration: 0.28, begin: 39.250, index: 132 },
  { text: " ge", duration: 0.28, begin: 39.500, index: 133 },
  { text: "rek", duration: 0.28, begin: 39.750, index: 134 },
  { text: "mek", duration: 0.28, begin: 40.000, index: 135 },
  { text: "te", duration: 0.28, begin: 40.250, index: 136 },
  { text: "dir", duration: 0.28, begin: 40.500, index: 137 },
  { text: " a", duration: 0.28, begin: 41.000, index: 138 },
  { text: "ma", duration: 0.28, begin: 41.250, index: 139 },
  { text: " na", duration: 0.28, begin: 41.750, index: 140 },
  { text: "sıl?", duration: 0.28, begin: 41.808, index: 141 },
  { text: " E", duration: 0.28, begin: 43.500, index: 142 },
  { text: "vi", duration: 0.28, begin: 43.750, index: 143 },
  { text: "ni", duration: 0.28, begin: 44.000, index: 144 },
  { text: " a", duration: 0.28, begin: 44.250, index: 145 },
  { text: "rar,", duration: 0.28, begin: 44.500, index: 146 },
  { text: " an", duration: 0.28, begin: 45.000, index: 147 },
  { text: "cak", duration: 0.28, begin: 45.250, index: 148 },
  { text: " ço", duration: 0.28, begin: 45.500, index: 149 },
  { text: "cuk", duration: 0.28, begin: 45.750, index: 150 },
  { text: " ba", duration: 0.28, begin: 46.250, index: 151 },
  { text: "kı", duration: 0.28, begin: 46.500, index: 152 },
  { text: "cı", duration: 0.28, begin: 46.750, index: 153 },
  { text: "sı", duration: 0.28, begin: 47.000, index: 154 },
  { text: "nın", duration: 0.28, begin: 47.250, index: 155 },
  { text: " ver", duration: 0.28, begin: 47.500, index: 156 },
  { text: "di", duration: 0.28, begin: 47.750, index: 157 },
  { text: "ği", duration: 0.28, begin: 48.000, index: 158 },
  { text: " ha", duration: 0.28, begin: 48.250, index: 159 },
  { text: "ber", duration: 0.28, begin: 48.500, index: 160 },
  { text: " da", duration: 0.28, begin: 49.250, index: 161 },
  { text: "ha", duration: 0.28, begin: 49.500, index: 162 },
  { text: " kö", duration: 0.28, begin: 49.750, index: 163 },
  { text: "tü", duration: 0.28, begin: 50.000, index: 164 },
  { text: "dür.", duration: 0.28, begin: 50.250, index: 165 },
  { text: " Kı", duration: 0.28, begin: 50.750, index: 166 },
  { text: "zın", duration: 0.28, begin: 51.000, index: 167 },
  { text: " a", duration: 0.28, begin: 51.250, index: 168 },
  { text: "te", duration: 0.28, begin: 51.500, index: 169 },
  { text: "şi", duration: 0.28, begin: 51.750, index: 170 },
  { text: " bi", duration: 0.28, begin: 52.000, index: 171 },
  { text: "raz", duration: 0.28, begin: 52.250, index: 172 },
  { text: " da", duration: 0.28, begin: 52.500, index: 173 },
  { text: "ha", duration: 0.28, begin: 52.750, index: 174 },
  { text: " yük", duration: 0.28, begin: 53.000, index: 175 },
  { text: "sel", duration: 0.28, begin: 53.250, index: 176 },
  { text: "miş", duration: 0.28, begin: 53.500, index: 177 },
  { text: "tir.", duration: 0.28, begin: 53.750, index: 178 },
  { text: " Bu", duration: 0.28, begin: 54.750, index: 179 },
  { text: " a", duration: 0.28, begin: 55.000, index: 180 },
  { text: "ra", duration: 0.28, begin: 55.250, index: 181 },
  { text: "da", duration: 0.28, begin: 55.500, index: 182 },
  { text: " ka", duration: 0.28, begin: 55.750, index: 183 },
  { text: "dın", duration: 0.28, begin: 56.000, index: 184 },
  { text: " i", duration: 0.28, begin: 56.750, index: 185 },
  { text: "çin", duration: 0.28, begin: 57.000, index: 186 },
  { text: "de", duration: 0.28, begin: 57.250, index: 187 },
  { text: " bu", duration: 0.28, begin: 57.500, index: 188 },
  { text: "lun", duration: 0.28, begin: 57.750, index: 189 },
  { text: "du", duration: 0.28, begin: 58.000, index: 190 },
  { text: "ğu", duration: 0.28, begin: 58.250, index: 191 },
  { text: " du", duration: 0.28, begin: 58.500, index: 192 },
  { text: "ru", duration: 0.28, begin: 58.750, index: 193 },
  { text: "mu", duration: 0.28, begin: 59.000, index: 194 },
  { text: " ba", duration: 0.28, begin: 59.200, index: 195 },
  { text: "kı", duration: 0.28, begin: 59.400, index: 196 },
  { text: "cı", duration: 0.28, begin: 59.600, index: 197 },
  { text: "ya", duration: 0.28, begin: 59.800, index: 198 },
  { text: " an", duration: 0.28, begin: 60.000, index: 199 },
  { text: "la", duration: 0.28, begin: 60.200, index: 200 },
  { text: "tır.", duration: 0.28, begin: 60.400, index: 201 },
  { text: " Ba", duration: 0.28, begin: 61.250, index: 202 },
  { text: "kı", duration: 0.28, begin: 61.500, index: 203 },
  { text: "cı", duration: 0.28, begin: 61.750, index: 204 },
  { text: " a", duration: 0.28, begin: 62.250, index: 205 },
  { text: "ra", duration: 0.28, begin: 62.500, index: 206 },
  { text: "ba", duration: 0.28, begin: 62.750, index: 207 },
  { text: "nın", duration: 0.28, begin: 63.000, index: 208 },
  { text: " ki", duration: 0.28, begin: 63.200, index: 209 },
  { text: "li", duration: 0.28, begin: 63.400, index: 210 },
  { text: "di", duration: 0.28, begin: 63.600, index: 211 },
  { text: "ni", duration: 0.28, begin: 63.800, index: 212 },
  { text: " a", duration: 0.28, begin: 64.200, index: 213 },
  { text: "ça", duration: 0.28, begin: 64.400, index: 214 },
  { text: "bi", duration: 0.28, begin: 64.600, index: 215 },
  { text: "le", duration: 0.28, begin: 64.800, index: 216 },
  { text: "cek", duration: 0.28, begin: 65.000, index: 217 },
  { text: " bir", duration: 0.28, begin: 65.200, index: 218 },
  { text: " ser", duration: 0.28, begin: 65.600, index: 219 },
  { text: "vis", duration: 0.28, begin: 65.800, index: 220 },
  { text: " bul", duration: 0.28, begin: 66.000, index: 221 },
  { text: " ma", duration: 0.28, begin: 66.200, index: 222 },
  { text: "sı", duration: 0.28, begin: 66.400, index: 223 },
  { text: "nı", duration: 0.28, begin: 66.600, index: 224 },
  { text: " ya", duration: 0.28, begin: 67.800, index: 225 },
  { text: "da", duration: 0.28, begin: 68.000, index: 226 },
  { text: " ça", duration: 0.28, begin: 68.200, index: 227 },
  { text: "kı,", duration: 0.28, begin: 68.400, index: 228 },
  { text: " bı", duration: 0.28, begin: 69.600, index: 229 },
  { text: "çak", duration: 0.28, begin: 69.800, index: 230 },
  { text: " gi", duration: 0.28, begin: 70.000, index: 231 },
  { text: "bi", duration: 0.28, begin: 70.200, index: 232 },
  { text: " bir", duration: 0.28, begin: 70.400, index: 233 },
  { text: "şey", duration: 0.28, begin: 70.600, index: 234 },
  { text: "le", duration: 0.28, begin: 70.800, index: 235 },
  { text: " ken", duration: 0.28, begin: 71.600, index: 236 },
  { text: "di", duration: 0.28, begin: 71.800, index: 237 },
  { text: "si", duration: 0.28, begin: 72.000, index: 238 },
  { text: "nin", duration: 0.28, begin: 72.200, index: 239 },
  { text: " aç", duration: 0.28, begin: 72.600, index: 240 },
  { text: "ma", duration: 0.28, begin: 72.800, index: 241 },
  { text: "yı", duration: 0.28, begin: 73.000, index: 242 },
  { text: " de", duration: 0.28, begin: 73.200, index: 243 },
  { text: "ne", duration: 0.28, begin: 73.400, index: 244 },
  { text: "me", duration: 0.28, begin: 73.600, index: 245 },
  { text: "si", duration: 0.28, begin: 73.800, index: 246 },
  { text: "ni", duration: 0.28, begin: 74.000, index: 247 },
  { text: " söy", duration: 0.28, begin: 74.400, index: 248 },
  { text: "ler.", duration: 0.28, begin: 74.600, index: 249 },
  { text: " Ya", duration: 0.28, begin: 76.000, index: 250 },
  { text: "kın", duration: 0.28, begin: 76.250, index: 251 },
  { text: "da", duration: 0.28, begin: 76.500, index: 252 },
  { text: " bu", duration: 0.28, begin: 76.750, index: 253 },
  { text: "lu", duration: 0.28, begin: 77.000, index: 254 },
  { text: "nan", duration: 0.28, begin: 77.250, index: 255 },
  { text: " bir", duration: 0.28, begin: 77.500, index: 256 },
  { text: " mar", duration: 0.28, begin: 77.750, index: 257 },
  { text: "ket", duration: 0.28, begin: 78.000, index: 258 },
  { text: "ten", duration: 0.28, begin: 78.250, index: 259 },
  { text: " kü", duration: 0.28, begin: 79.250, index: 260 },
  { text: "çük", duration: 0.28, begin: 79.500, index: 261 },
  { text: " bir", duration: 0.28, begin: 79.750, index: 262 },
  { text: " ça", duration: 0.28, begin: 80.000, index: 263 },
  { text: "kı", duration: 0.28, begin: 80.250, index: 264 },
  { text: " a", duration: 0.28, begin: 80.500, index: 265 },
  { text: "lır", duration: 0.28, begin: 80.750, index: 266 },
  { text: " ve", duration: 0.28, begin: 81.000, index: 267 },
  { text: " a", duration: 0.28, begin: 81.750, index: 268 },
  { text: "ra", duration: 0.28, begin: 82.000, index: 269 },
  { text: "ba", duration: 0.28, begin: 82.250, index: 270 },
  { text: "nın", duration: 0.28, begin: 82.500, index: 271 },
  { text: " ya", duration: 0.28, begin: 82.750, index: 272 },
  { text: "nı", duration: 0.28, begin: 83.000, index: 273 },
  { text: "na", duration: 0.28, begin: 83.250, index: 274 },
  { text: " gi", duration: 0.28, begin: 83.500, index: 275 },
  { text: "der.", duration: 0.28, begin: 83.750, index: 276 },
  { text: " A", duration: 0.28, begin: 85.000, index: 277 },
  { text: "ma", duration: 0.28, begin: 85.250, index: 278 },
  { text: " bu", duration: 0.28, begin: 86.000, index: 279 },
  { text: "nun", duration: 0.28, begin: 86.250, index: 280 },
  { text: " na", duration: 0.28, begin: 86.500, index: 281 },
  { text: "sıl", duration: 0.28, begin: 86.750, index: 282 },
  { text: " kul", duration: 0.28, begin: 87.000, index: 283 },
  { text: "la", duration: 0.28, begin: 87.200, index: 284 },
  { text: "nı", duration: 0.28, begin: 87.400, index: 285 },
  { text: "la", duration: 0.28, begin: 87.600, index: 286 },
  { text: "ca", duration: 0.28, begin: 87.800, index: 287 },
  { text: "ğı", duration: 0.28, begin: 88.000, index: 288 },
  { text: "nı", duration: 0.28, begin: 88.200, index: 289 },
  { text: " bi", duration: 0.28, begin: 88.400, index: 290 },
  { text: "le", duration: 0.28, begin: 88.600, index: 291 },
  { text: "mez.", duration: 0.28, begin: 88.800, index: 292 },
  { text: " A", duration: 0.28, begin: 89.750, index: 293 },
  { text: "ra", duration: 0.28, begin: 90.000, index: 294 },
  { text: "ba", duration: 0.28, begin: 90.250, index: 295 },
  { text: "nın", duration: 0.28, begin: 90.500, index: 296 },
  { text: " ka", duration: 0.28, begin: 90.700, index: 297 },
  { text: "pı", duration: 0.28, begin: 90.900, index: 298 },
  { text: "la", duration: 0.28, begin: 91.100, index: 299 },
  { text: "rı", duration: 0.28, begin: 91.300, index: 300 },
  { text: "nı", duration: 0.28, begin: 91.500, index: 301 },
  { text: " zor", duration: 0.28, begin: 91.800, index: 302 },
  { text: "lar,", duration: 0.28, begin: 92.000, index: 303 },
  { text: " sal", duration: 0.28, begin: 92.800, index: 304 },
  { text: "lar", duration: 0.28, begin: 93.000, index: 305 },
  { text: " a", duration: 0.28, begin: 94.000, index: 306 },
  { text: "ma", duration: 0.28, begin: 94.250, index: 307 },
  { text: " hiç", duration: 0.28, begin: 94.500, index: 308 },
  { text: " bir", duration: 0.28, begin: 94.750, index: 309 },
  { text: " so", duration: 0.28, begin: 95.000, index: 310 },
  { text: "nuç", duration: 0.28, begin: 95.250, index: 311 },
  { text: " yok", duration: 0.28, begin: 95.500, index: 312 },
  { text: "tur.", duration: 0.28, begin: 95.750, index: 313 },
  { text: " Ba", duration: 0.28, begin: 97.200, index: 314 },
  { text: "şı", duration: 0.28, begin: 97.400, index: 315 },
  { text: "nı", duration: 0.28, begin: 97.600, index: 316 },
  { text: " gök", duration: 0.28, begin: 97.800, index: 317 },
  { text: "yü", duration: 0.28, begin: 98.000, index: 318 },
  { text: "zü", duration: 0.28, begin: 98.200, index: 319 },
  { text: "ne", duration: 0.28, begin: 98.400, index: 320 },
  { text: " doğ", duration: 0.28, begin: 98.600, index: 321 },
  { text: "ru", duration: 0.28, begin: 98.800, index: 322 },
  { text: " çe", duration: 0.28, begin: 99.000, index: 323 },
  { text: "vi", duration: 0.28, begin: 99.200, index: 324 },
  { text: "rir:", duration: 0.28, begin: 99.400, index: 325 },
  { text: " \"Tan", duration: 0.28, begin: 100.750, index: 326 },
  { text: "rım,", duration: 0.28, begin: 101.000, index: 327 },
  { text: " lüt", duration: 0.28, begin: 102.000, index: 328 },
  { text: "fen", duration: 0.28, begin: 102.250, index: 329 },
  { text: " kü", duration: 0.28, begin: 102.500, index: 330 },
  { text: "çük", duration: 0.28, begin: 102.750, index: 331 },
  { text: " kı", duration: 0.28, begin: 103.000, index: 332 },
  { text: "zı", duration: 0.28, begin: 103.250, index: 333 },
  { text: "ma", duration: 0.28, begin: 103.500, index: 334 },
  { text: " u", duration: 0.28, begin: 103.750, index: 335 },
  { text: "laş", duration: 0.28, begin: 104.000, index: 336 },
  { text: "mam", duration: 0.28, begin: 104.250, index: 337 },
  { text: " i", duration: 0.28, begin: 104.500, index: 338 },
  { text: "çin", duration: 0.28, begin: 104.750, index: 339 },
  { text: " ba", duration: 0.28, begin: 105.250, index: 340 },
  { text: "na", duration: 0.28, begin: 105.500, index: 341 },
  { text: " yar", duration: 0.28, begin: 105.750, index: 342 },
  { text: "dım", duration: 0.28, begin: 106.000, index: 343 },
  { text: " et\"", duration: 0.28, begin: 106.250, index: 344 },
  { text: " Bu", duration: 0.28, begin: 107.500, index: 345 },
  { text: " a", duration: 0.28, begin: 107.750, index: 346 },
  { text: "ra", duration: 0.28, begin: 108.000, index: 347 },
  { text: "da", duration: 0.28, begin: 108.250, index: 348 },
  { text: " ça", duration: 0.28, begin: 109.000, index: 349 },
  { text: "kıy", duration: 0.28, begin: 109.250, index: 350 },
  { text: "la", duration: 0.28, begin: 109.500, index: 351 },
  { text: " ka", duration: 0.28, begin: 109.750, index: 352 },
  { text: "pı", duration: 0.28, begin: 110.000, index: 353 },
  { text: "yı", duration: 0.28, begin: 110.250, index: 354 },
  { text: " kur", duration: 0.28, begin: 110.400, index: 355 },
  { text: "ca", duration: 0.28, begin: 110.600, index: 356 },
  { text: "la", duration: 0.28, begin: 110.800, index: 357 },
  { text: "ma", duration: 0.28, begin: 111.000, index: 358 },
  { text: "ya", duration: 0.28, begin: 111.200, index: 359 },
  { text: " de", duration: 0.28, begin: 111.400, index: 360 },
  { text: "vam", duration: 0.28, begin: 111.600, index: 361 },
  { text: " e", duration: 0.28, begin: 111.800, index: 362 },
  { text: "der.", duration: 0.28, begin: 112.000, index: 363 },
  { text: " O", duration: 0.28, begin: 113.200, index: 364 },
  { text: " sı", duration: 0.28, begin: 113.400, index: 365 },
  { text: "ra", duration: 0.28, begin: 113.600, index: 366 },
  { text: "da", duration: 0.28, begin: 113.800, index: 367 },
  { text: " yol", duration: 0.28, begin: 114.600, index: 368 },
  { text: "dan", duration: 0.28, begin: 114.800, index: 369 },
  { text: " geç", duration: 0.28, begin: 115.000, index: 370 },
  { text: "mek", duration: 0.28, begin: 115.250, index: 371 },
  { text: "te", duration: 0.28, begin: 115.500, index: 372 },
  { text: " o", duration: 0.28, begin: 115.750, index: 373 },
  { text: "lan", duration: 0.28, begin: 116.000, index: 374 },
  { text: " sa", duration: 0.28, begin: 117.000, index: 375 },
  { text: "kal", duration: 0.28, begin: 117.250, index: 376 },
  { text: "la", duration: 0.28, begin: 117.500, index: 377 },
  { text: "rı", duration: 0.28, begin: 117.750, index: 378 },
  { text: " u", duration: 0.28, begin: 118.000, index: 379 },
  { text: "za", duration: 0.28, begin: 118.250, index: 380 },
  { text: "mış,", duration: 0.28, begin: 118.500, index: 381 },
  { text: " üs", duration: 0.28, begin: 119.500, index: 382 },
  { text: "tü", duration: 0.28, begin: 119.750, index: 383 },
  { text: " ba", duration: 0.28, begin: 120.000, index: 384 },
  { text: "şı", duration: 0.28, begin: 120.250, index: 385 },
  { text: " ba", duration: 0.28, begin: 120.500, index: 386 },
  { text: "kım", duration: 0.28, begin: 120.750, index: 387 },
  { text: "sız", duration: 0.28, begin: 121.000, index: 388 },
  { text: " bir", duration: 0.28, begin: 121.200, index: 389 },
  { text: " a", duration: 0.28, begin: 121.400, index: 390 },
  { text: "dam", duration: 0.28, begin: 121.600, index: 391 },
  { text: " du", duration: 0.28, begin: 121.800, index: 392 },
  { text: "rup", duration: 0.28, begin: 122.000, index: 393 },
  { text: " ka", duration: 0.28, begin: 122.750, index: 394 },
  { text: "dı", duration: 0.28, begin: 123.000, index: 395 },
  { text: "nı", duration: 0.28, begin: 123.250, index: 396 },
  { text: " iz", duration: 0.28, begin: 123.500, index: 397 },
  { text: "ler", duration: 0.28, begin: 123.750, index: 398 },
  { text: " ve:", duration: 0.28, begin: 124.250, index: 399 },
  { text: " \"Ha", duration: 0.28, begin: 125.250, index: 400 },
  { text: "nım", duration: 0.28, begin: 125.500, index: 401 },
  { text: " e", duration: 0.28, begin: 125.750, index: 402 },
  { text: "fen", duration: 0.28, begin: 126.000, index: 403 },
  { text: "di,", duration: 0.28, begin: 126.250, index: 404 },
  { text: " is", duration: 0.28, begin: 127.000, index: 405 },
  { text: "ter", duration: 0.28, begin: 127.250, index: 406 },
  { text: "se", duration: 0.28, begin: 127.500, index: 407 },
  { text: "niz", duration: 0.28, begin: 127.750, index: 408 },
  { text: " yar", duration: 0.28, begin: 128.250, index: 409 },
  { text: "dım", duration: 0.28, begin: 128.500, index: 410 },
  { text: "cı", duration: 0.28, begin: 128.750, index: 411 },
  { text: " o", duration: 0.28, begin: 129.000, index: 412 },
  { text: "la", duration: 0.28, begin: 129.250, index: 413 },
  { text: "bi", duration: 0.28, begin: 129.500, index: 414 },
  { text: "li", duration: 0.28, begin: 129.750, index: 415 },
  { text: "rim\"", duration: 0.28, begin: 130.000, index: 416 },
  { text: " der.", duration: 0.28, begin: 130.250, index: 417 },
  { text: " Ka", duration: 0.28, begin: 131.500, index: 418 },
  { text: "dın:", duration: 0.28, begin: 131.750, index: 419 },
  { text: " \"Tan", duration: 0.28, begin: 132.500, index: 420 },
  { text: "rım", duration: 0.28, begin: 132.750, index: 421 },
  { text: " gön", duration: 0.28, begin: 133.500, index: 422 },
  { text: "der", duration: 0.28, begin: 133.750, index: 423 },
  { text: "di", duration: 0.28, begin: 134.000, index: 424 },
  { text: "ğin", duration: 0.28, begin: 134.250, index: 425 },
  { text: " yar", duration: 0.28, begin: 134.500, index: 426 },
  { text: "dım", duration: 0.28, begin: 134.750, index: 427 },
  { text: " bu", duration: 0.28, begin: 135.000, index: 428 },
  { text: " mu?\"", duration: 0.28, begin: 135.250, index: 429 },
  { text: " di", duration: 0.28, begin: 135.750, index: 430 },
  { text: "ye", duration: 0.28, begin: 136.000, index: 431 },
  { text: " dü", duration: 0.28, begin: 136.250, index: 432 },
  { text: "şü", duration: 0.28, begin: 136.500, index: 433 },
  { text: "nür.", duration: 0.28, begin: 136.750, index: 434 },
  { text: " Kı", duration: 0.28, begin: 137.750, index: 435 },
  { text: "lık", duration: 0.28, begin: 138.000, index: 436 },
  { text: "sız", duration: 0.28, begin: 138.250, index: 437 },
  { text: " a", duration: 0.28, begin: 138.500, index: 438 },
  { text: "dam", duration: 0.28, begin: 138.750, index: 439 },
  { text: " bir", duration: 0.28, begin: 139.500, index: 440 },
  { text: " kaç", duration: 0.28, begin: 139.750, index: 441 },
  { text: " da", duration: 0.28, begin: 140.000, index: 442 },
  { text: "ki", duration: 0.28, begin: 140.250, index: 443 },
  { text: "ka", duration: 0.28, begin: 140.500, index: 444 },
  { text: " i", duration: 0.28, begin: 140.750, index: 445 },
  { text: "çin", duration: 0.28, begin: 141.000, index: 446 },
  { text: "de", duration: 0.28, begin: 141.250, index: 447 },
  { text: " a", duration: 0.28, begin: 141.750, index: 448 },
  { text: "ra", duration: 0.28, begin: 142.000, index: 449 },
  { text: "ba", duration: 0.28, begin: 142.250, index: 450 },
  { text: "nın", duration: 0.28, begin: 142.500, index: 451 },
  { text: " ki", duration: 0.28, begin: 142.750, index: 452 },
  { text: "li", duration: 0.28, begin: 143.000, index: 453 },
  { text: "di", duration: 0.28, begin: 143.250, index: 454 },
  { text: "ni", duration: 0.28, begin: 143.500, index: 455 },
  { text: " aç", duration: 0.28, begin: 143.750, index: 456 },
  { text: "ma", duration: 0.28, begin: 144.000, index: 457 },
  { text: "yı", duration: 0.28, begin: 144.250, index: 458 },
  { text: " ba", duration: 0.28, begin: 144.500, index: 459 },
  { text: "şa", duration: 0.28, begin: 144.750, index: 460 },
  { text: "rır.", duration: 0.28, begin: 145.000, index: 461 },
  { text: " Ka", duration: 0.28, begin: 146.000, index: 462 },
  { text: "dın", duration: 0.28, begin: 146.250, index: 463 },
  { text: " şaş", duration: 0.28, begin: 146.750, index: 464 },
  { text: "kın", duration: 0.28, begin: 147.000, index: 465 },
  { text: "lık", duration: 0.28, begin: 147.250, index: 466 },
  { text: "la", duration: 0.28, begin: 147.500, index: 467 },
  { text: " a", duration: 0.28, begin: 148.250, index: 468 },
  { text: "da", duration: 0.28, begin: 148.500, index: 469 },
  { text: "ma", duration: 0.28, begin: 148.750, index: 470 },
  { text: " te", duration: 0.28, begin: 149.000, index: 471 },
  { text: "şek", duration: 0.28, begin: 149.250, index: 472 },
  { text: "kür", duration: 0.28, begin: 149.500, index: 473 },
  { text: " e", duration: 0.28, begin: 149.750, index: 474 },
  { text: "der,", duration: 0.28, begin: 150.000, index: 475 },
  { text: " kı", duration: 0.28, begin: 151.000, index: 476 },
  { text: "zı", duration: 0.28, begin: 151.250, index: 477 },
  { text: "nın", duration: 0.28, begin: 151.500, index: 478 },
  { text: " du", duration: 0.28, begin: 151.750, index: 479 },
  { text: "ru", duration: 0.28, begin: 152.000, index: 480 },
  { text: "mu", duration: 0.28, begin: 152.200, index: 481 },
  { text: "nu", duration: 0.28, begin: 152.400, index: 482 },
  { text: " an", duration: 0.28, begin: 152.600, index: 483 },
  { text: "la", duration: 0.28, begin: 152.800, index: 484 },
  { text: "tır.", duration: 0.28, begin: 153.000, index: 485 },
  { text: " He", duration: 0.28, begin: 154.000, index: 486 },
  { text: "men", duration: 0.28, begin: 154.250, index: 487 },
  { text: " ye", duration: 0.28, begin: 154.500, index: 488 },
  { text: "ti", duration: 0.28, begin: 154.700, index: 489 },
  { text: "şe", duration: 0.28, begin: 154.900, index: 490 },
  { text: "bi", duration: 0.28, begin: 155.100, index: 491 },
  { text: "le", duration: 0.28, begin: 155.300, index: 492 },
  { text: "ce", duration: 0.28, begin: 155.500, index: 493 },
  { text: "ği", duration: 0.28, begin: 155.700, index: 494 },
  { text: " i", duration: 0.28, begin: 155.900, index: 495 },
  { text: "çin", duration: 0.28, begin: 156.100, index: 496 },
  { text: " min", duration: 0.28, begin: 157.000, index: 497 },
  { text: "net", duration: 0.28, begin: 157.250, index: 498 },
  { text: "tar", duration: 0.28, begin: 157.500, index: 499 },
  { text: " ol", duration: 0.28, begin: 157.750, index: 500 },
  { text: "du", duration: 0.28, begin: 158.000, index: 501 },
  { text: "ğu", duration: 0.28, begin: 158.250, index: 502 },
  { text: "nu", duration: 0.28, begin: 158.500, index: 503 },
  { text: " be", duration: 0.28, begin: 158.750, index: 504 },
  { text: "lir", duration: 0.28, begin: 159.000, index: 505 },
  { text: "tir", duration: 0.28, begin: 159.250, index: 506 },
  { text: " ve", duration: 0.28, begin: 159.500, index: 507 },
  { text: " bir", duration: 0.28, begin: 160.500, index: 508 },
  { text: " mik", duration: 0.28, begin: 160.750, index: 509 },
  { text: "tar", duration: 0.28, begin: 161.000, index: 510 },
  { text: " pa", duration: 0.28, begin: 161.250, index: 511 },
  { text: "ra", duration: 0.28, begin: 161.500, index: 512 },
  { text: " u", duration: 0.28, begin: 161.750, index: 513 },
  { text: "za", duration: 0.28, begin: 162.000, index: 514 },
  { text: "tıp:", duration: 0.28, begin: 162.250, index: 515 },
  { text: " \"Çok", duration: 0.28, begin: 163.250, index: 516 },
  { text: " i", duration: 0.28, begin: 163.500, index: 517 },
  { text: "yi", duration: 0.28, begin: 163.750, index: 518 },
  { text: " bir", duration: 0.28, begin: 164.000, index: 519 },
  { text: " in", duration: 0.28, begin: 164.250, index: 520 },
  { text: "san", duration: 0.28, begin: 164.500, index: 521 },
  { text: "sı", duration: 0.28, begin: 164.750, index: 522 },
  { text: "nız\"", duration: 0.28, begin: 165.000, index: 523 },
  { text: " di", duration: 0.28, begin: 165.500, index: 524 },
  { text: "ye", duration: 0.28, begin: 165.750, index: 525 },
  { text: " te", duration: 0.28, begin: 166.000, index: 526 },
  { text: "şek", duration: 0.28, begin: 166.250, index: 527 },
  { text: "kür", duration: 0.28, begin: 166.500, index: 528 },
  { text: " e", duration: 0.28, begin: 166.750, index: 529 },
  { text: "der.", duration: 0.28, begin: 167.000, index: 530 },
  { text: " A", duration: 0.28, begin: 167.750, index: 531 },
  { text: "dam:", duration: 0.28, begin: 168.000, index: 532 },
  { text: " \"Ha", duration: 0.28, begin: 169.000, index: 533 },
  { text: "yır,", duration: 0.28, begin: 169.250, index: 534 },
  { text: " ha", duration: 0.28, begin: 170.200, index: 535 },
  { text: "nım", duration: 0.28, begin: 170.400, index: 536 },
  { text: " e", duration: 0.28, begin: 170.600, index: 537 },
  { text: "fen", duration: 0.28, begin: 170.800, index: 538 },
  { text: "di", duration: 0.28, begin: 171.000, index: 539 },
  { text: " ma", duration: 0.28, begin: 171.200, index: 540 },
  { text: "le", duration: 0.28, begin: 171.400, index: 541 },
  { text: "sef", duration: 0.28, begin: 171.600, index: 542 },
  { text: " i", duration: 0.28, begin: 172.000, index: 543 },
  { text: "yi", duration: 0.28, begin: 172.250, index: 544 },
  { text: " bir", duration: 0.28, begin: 172.500, index: 545 },
  { text: " in", duration: 0.28, begin: 172.750, index: 546 },
  { text: "san", duration: 0.28, begin: 173.000, index: 547 },
  { text: " de", duration: 0.28, begin: 173.250, index: 548 },
  { text: "ği", duration: 0.28, begin: 173.500, index: 549 },
  { text: "lim.", duration: 0.28, begin: 173.750, index: 550 },
  { text: " A", duration: 0.28, begin: 174.750, index: 551 },
  { text: "ra", duration: 0.28, begin: 175.000, index: 552 },
  { text: "ba", duration: 0.28, begin: 175.250, index: 553 },
  { text: " hır", duration: 0.28, begin: 175.500, index: 554 },
  { text: "sız", duration: 0.28, begin: 175.750, index: 555 },
  { text: "lı", duration: 0.28, begin: 176.000, index: 556 },
  { text: "ğın", duration: 0.28, begin: 176.250, index: 557 },
  { text: "dan", duration: 0.28, begin: 176.500, index: 558 },
  { text: " ha", duration: 0.28, begin: 177.250, index: 559 },
  { text: "pis", duration: 0.28, begin: 177.500, index: 560 },
  { text: " ha", duration: 0.28, begin: 177.750, index: 561 },
  { text: "ne", duration: 0.28, begin: 178.000, index: 562 },
  { text: "den", duration: 0.28, begin: 178.250, index: 563 },
  { text: " ye", duration: 0.28, begin: 178.500, index: 564 },
  { text: "ni", duration: 0.28, begin: 178.750, index: 565 },
  { text: " çık", duration: 0.28, begin: 179.000, index: 566 },
  { text: "tım.\"", duration: 0.28, begin: 179.250, index: 567 },
  { text: " Ka", duration: 0.28, begin: 180.500, index: 568 },
  { text: "dın", duration: 0.28, begin: 180.750, index: 569 },
  { text: " bir", duration: 0.28, begin: 181.250, index: 570 },
  { text: " sü", duration: 0.28, begin: 181.500, index: 571 },
  { text: "re", duration: 0.28, begin: 181.750, index: 572 },
  { text: " ses", duration: 0.28, begin: 182.250, index: 573 },
  { text: "siz", duration: 0.28, begin: 182.500, index: 574 },
  { text: " ka", duration: 0.28, begin: 182.750, index: 575 },
  { text: "lır.", duration: 0.28, begin: 183.000, index: 576 },
  { text: " A", duration: 0.28, begin: 184.000, index: 577 },
  { text: "dam", duration: 0.28, begin: 184.250, index: 578 },
  { text: " u", duration: 0.28, begin: 184.500, index: 579 },
  { text: "zak", duration: 0.28, begin: 184.750, index: 580 },
  { text: "laş", duration: 0.28, begin: 185.000, index: 581 },
  { text: "tık", duration: 0.28, begin: 185.250, index: 582 },
  { text: "tan", duration: 0.28, begin: 185.500, index: 583 },
  { text: " son", duration: 0.28, begin: 185.750, index: 584 },
  { text: "ra", duration: 0.28, begin: 186.000, index: 585 },
  { text: " tek", duration: 0.28, begin: 187.000, index: 586 },
  { text: "rar", duration: 0.28, begin: 187.250, index: 587 },
  { text: " yü", duration: 0.28, begin: 187.500, index: 588 },
  { text: "zü", duration: 0.28, begin: 187.750, index: 589 },
  { text: "nü", duration: 0.28, begin: 188.000, index: 590 },
  { text: " gök", duration: 0.28, begin: 188.250, index: 591 },
  { text: "yü", duration: 0.28, begin: 188.500, index: 592 },
  { text: "zü", duration: 0.28, begin: 188.750, index: 593 },
  { text: "ne", duration: 0.28, begin: 189.000, index: 594 },
  { text: " çe", duration: 0.28, begin: 189.250, index: 595 },
  { text: "vi", duration: 0.28, begin: 189.500, index: 596 },
  { text: "rir,", duration: 0.28, begin: 189.750, index: 597 },
  { text: " ken", duration: 0.28, begin: 190.500, index: 598 },
  { text: "di", duration: 0.28, begin: 190.750, index: 599 },
  { text: "ni", duration: 0.28, begin: 191.000, index: 600 },
  { text: " tu", duration: 0.28, begin: 191.250, index: 601 },
  { text: "ta", duration: 0.28, begin: 191.500, index: 602 },
  { text: "maz,", duration: 0.28, begin: 191.750, index: 603 },
  { text: " ağ", duration: 0.28, begin: 192.500, index: 604 },
  { text: "la", duration: 0.28, begin: 192.750, index: 605 },
  { text: "ya", duration: 0.28, begin: 193.000, index: 606 },
  { text: "rak:", duration: 0.28, begin: 193.250, index: 607 },
  { text: " \"Tan", duration: 0.28, begin: 194.250, index: 608 },
  { text: "rım,", duration: 0.28, begin: 194.500, index: 609 },
  { text: " bir", duration: 0.28, begin: 195.250, index: 610 },
  { text: " pro", duration: 0.28, begin: 195.500, index: 611 },
  { text: "fes", duration: 0.28, begin: 195.750, index: 612 },
  { text: "yo", duration: 0.28, begin: 196.000, index: 613 },
  { text: "nel", duration: 0.28, begin: 196.250, index: 614 },
  { text: " gön", duration: 0.28, begin: 196.750, index: 615 },
  { text: "der", duration: 0.28, begin: 197.000, index: 616 },
  { text: "di", duration: 0.28, begin: 197.250, index: 617 },
  { text: "ğin", duration: 0.28, begin: 197.500, index: 618 },
  { text: " i", duration: 0.28, begin: 197.750, index: 619 },
  { text: "çin", duration: 0.28, begin: 198.000, index: 620 },
  { text: " çok", duration: 0.28, begin: 198.750, index: 621 },
  { text: " te", duration: 0.28, begin: 199.000, index: 622 },
  { text: "şek", duration: 0.28, begin: 199.250, index: 623 },
  { text: "kür", duration: 0.28, begin: 199.500, index: 624 },
  { text: " e", duration: 0.28, begin: 199.750, index: 625 },
  { text: "de", duration: 0.28, begin: 200.000, index: 626 },
  { text: "rim\"", duration: 0.28, begin: 200.250, index: 627 },
  { text: " der.", duration: 0.28, begin: 200.750, index: 628 },
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
  <Link href="/dashboard/stories/on-yargi" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/hayallerinizden-vazgecmeyin" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/3-5.mp3"
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