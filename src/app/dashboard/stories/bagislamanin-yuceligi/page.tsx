"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, ArrowLeft, SkipForward, SkipBack,ChevronLeft} from "lucide-react"
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
  { text: "Ba", duration: 0.28, begin: 0.500, index: 1, isTitle: true, isCenter: true },
  { text: "ğış", duration: 0.28, begin: 0.700, index: 2, isTitle: true, isCenter: true },
  { text: "la", duration: 0.28, begin: 0.900, index: 3, isTitle: true, isCenter: true },
  { text: "ma", duration: 0.28, begin: 1.100, index: 4, isTitle: true, isCenter: true },
  { text: "nın", duration: 0.28, begin: 1.300, index: 5, isTitle: true, isCenter: true },
  { text: " Yü", duration: 0.28, begin: 1.500, index: 6, isTitle: true, isCenter: true },
  { text: "ce", duration: 0.28, begin: 1.700, index: 7, isTitle: true, isCenter: true },
  { text: "li", duration: 0.28, begin: 1.900, index: 8, isTitle: true, isCenter: true },
  { text: "ği", duration: 0.28, begin: 2.100, index: 9, isTitle: true, isCenter: true },

  // Story content
  { text: " Yal", duration: 0.40, begin: 3.000, index: 10 },
  { text: "nız", duration: 0.40, begin: 3.200, index: 11 },
  { text: "ca", duration: 0.40, begin: 3.400, index: 12 },
  { text: " bir", duration: 0.28, begin: 4.000, index: 13 },
  { text: "kaç", duration: 0.28, begin: 4.200, index: 14 },
  { text: " kez", duration: 0.28, begin: 4.400, index: 15 },
  { text: " ko", duration: 0.28, begin: 4.800, index: 16 },
  { text: "nuş", duration: 0.28, begin: 5.000, index: 17 },
  { text: "tu", duration: 0.28, begin: 5.200, index: 18 },
  { text: "ğu", duration: 0.28, begin: 5.400, index: 19 },
  { text: "nuz", duration: 0.28, begin: 5.600, index: 20 },
  { text: " bi", duration: 0.28, begin: 5.800, index: 21 },
  { text: "ri", duration: 0.28, begin: 6.000, index: 22 },
  { text: "si", duration: 0.28, begin: 6.200, index: 23 },
  { text: "nin", duration: 0.28, begin: 6.400, index: 24 },
  { text: " a", duration: 0.28, begin: 7.200, index: 25 },
  { text: "dı", duration: 0.28, begin: 7.400, index: 26 },
  { text: "nı", duration: 0.28, begin: 7.600, index: 27 },
  { text: " kırk", duration: 0.28, begin: 7.800, index: 28 },
  { text: " üç", duration: 0.28, begin: 8.000, index: 29 },
  { text: " yıl", duration: 0.28, begin: 8.200, index: 30 },
  { text: " son", duration: 0.28, begin: 8.400, index: 31 },
  { text: "ra", duration: 0.28, begin: 8.600, index: 32 },
  { text: " a", duration: 0.28, begin: 9.200, index: 33 },
  { text: "nım", duration: 0.28, begin: 9.400, index: 34 },
  { text: "sa", duration: 0.28, begin: 9.600, index: 35 },
  { text: "ma", duration: 0.28, begin: 9.800, index: 36 },
  { text: "nız", duration: 0.28, begin: 10.000, index: 37 },
  { text: " hiç", duration: 0.28, begin: 10.800, index: 38 },
  { text: " de", duration: 0.28, begin: 11.000, index: 39 },
  { text: " ko", duration: 0.28, begin: 11.200, index: 40 },
  { text: "lay", duration: 0.28, begin: 11.400, index: 41 },
  { text: " de", duration: 0.28, begin: 11.600, index: 42 },
  { text: "ğil", duration: 0.28, begin: 11.800, index: 43 },
  { text: "dir.", duration: 0.28, begin: 12.000, index: 44 },
  { text: " On", duration: 0.28, begin: 13.000, index: 45 },
  { text: " i", duration: 0.28, begin: 13.200, index: 46 },
  { text: "ki", duration: 0.28, begin: 13.400, index: 47 },
  { text: " yaş", duration: 0.28, begin: 14.000, index: 48 },
  { text: "la", duration: 0.28, begin: 14.200, index: 49 },
  { text: "rın", duration: 0.28, begin: 14.400, index: 50 },
  { text: "da", duration: 0.28, begin: 14.600, index: 51 },
  { text: " bir", duration: 0.28, begin: 14.800, index: 52 },
  { text: " ço", duration: 0.28, begin: 15.200, index: 53 },
  { text: "cuk", duration: 0.28, begin: 15.400, index: 54 },
  { text: "ken", duration: 0.28, begin: 15.600, index: 55 },
  { text: " o", duration: 0.28, begin: 16.400, index: 56 },
  { text: "kul", duration: 0.28, begin: 16.600, index: 57 },
  { text: " harç", duration: 0.28, begin: 16.800, index: 58 },
  { text: "lı", duration: 0.28, begin: 17.000, index: 59 },
  { text: "ğı", duration: 0.28, begin: 17.200, index: 60 },
  { text: "mı", duration: 0.28, begin: 17.400, index: 61 },
  { text: " çı", duration: 0.28, begin: 17.800, index: 62 },
  { text: "kar", duration: 0.28, begin: 18.000, index: 63 },
  { text: "mak", duration: 0.28, begin: 18.200, index: 64 },
  { text: " i", duration: 0.28, begin: 18.400, index: 65 },
  { text: "çin", duration: 0.28, begin: 18.600, index: 66 },
  { text: " ev", duration: 0.28, begin: 19.400, index: 67 },
  { text: "le", duration: 0.28, begin: 19.600, index: 68 },
  { text: "re", duration: 0.28, begin: 19.800, index: 69 },
  { text: " ga", duration: 0.28, begin: 20.000, index: 70 },
  { text: "ze", duration: 0.28, begin: 20.200, index: 71 },
  { text: "te", duration: 0.28, begin: 20.400, index: 72 },
  { text: " da", duration: 0.28, begin: 20.600, index: 73 },
  { text: "ğı", duration: 0.28, begin: 20.800, index: 74 },
  { text: "tı", duration: 0.28, begin: 21.000, index: 75 },
  { text: "yor", duration: 0.28, begin: 21.200, index: 76 },
  { text: "dum", duration: 0.28, begin: 21.400, index: 77 },
  { text: " ve", duration: 0.28, begin: 21.800, index: 78 },
  { text: " a", duration: 0.28, begin: 22.400, index: 79 },
  { text: "dı", duration: 0.28, begin: 22.600, index: 80 },
  { text: "nı", duration: 0.28, begin: 22.800, index: 81 },
  { text: " şim", duration: 0.28, begin: 23.000, index: 82 },
  { text: "di", duration: 0.28, begin: 23.200, index: 83 },
  { text: " a", duration: 0.28, begin: 23.600, index: 84 },
  { text: "nım", duration: 0.28, begin: 23.800, index: 85 },
  { text: "sa", duration: 0.28, begin: 24.000, index: 86 },
  { text: "ya", duration: 0.28, begin: 24.200, index: 87 },
  { text: "ma", duration: 0.28, begin: 24.400, index: 88 },
  { text: "dı", duration: 0.28, begin: 24.600, index: 89 },
  { text: "ğım", duration: 0.28, begin: 24.800, index: 90 },
  { text: " o", duration: 0.28, begin: 25.200, index: 91 },
  { text: " yaş", duration: 0.28, begin: 25.400, index: 92 },
  { text: "lı", duration: 0.28, begin: 25.600, index: 93 },
  { text: " ba", duration: 0.28, begin: 25.800, index: 94 },
  { text: "yan", duration: 0.28, begin: 26.000, index: 95 },
  { text: "da", duration: 0.28, begin: 26.200, index: 96 },
  { text: " be", duration: 0.28, begin: 27.000, index: 97 },
  { text: "nim", duration: 0.28, begin: 27.200, index: 98 },
  { text: " müş", duration: 0.40, begin: 27.400, index: 99 },
  { text: "te", duration: 0.40, begin: 27.600, index: 100 },
  { text: "rim", duration: 0.40, begin: 27.800, index: 101 },
  { text: "di.", duration: 0.28, begin: 28.000, index: 102 },
  { text: " Ba", duration: 0.28, begin: 29.200, index: 103 },
  { text: "na", duration: 0.28, begin: 29.400, index: 104 },
  { text: " \"ba", duration: 0.28, begin: 30.400, index: 105 },
  { text: "ğış", duration: 0.28, begin: 30.600, index: 106 },
  { text: "la", duration: 0.28, begin: 30.800, index: 107 },
  { text: "ma\"", duration: 0.28, begin: 31.000, index: 108 },
  { text: " ko", duration: 0.28, begin: 31.800, index: 109 },
  { text: "nu", duration: 0.28, begin: 32.000, index: 110 },
  { text: "sun", duration: 0.28, begin: 32.200, index: 111 },
  { text: "da", duration: 0.28, begin: 32.400, index: 112 },
  { text: " öy", duration: 0.28, begin: 32.600, index: 113 },
  { text: "le", duration: 0.28, begin: 32.800, index: 114 },
  { text: " gü", duration: 0.28, begin: 33.000, index: 115 },
  { text: "zel", duration: 0.28, begin: 33.200, index: 116 },
  { text: " ve", duration: 0.28, begin: 33.400, index: 117 },
  { text: " u", duration: 0.28, begin: 33.800, index: 118 },
  { text: "nu", duration: 0.28, begin: 34.000, index: 119 },
  { text: "tul", duration: 0.28, begin: 34.200, index: 120 },
  { text: "maz", duration: 0.28, begin: 34.400, index: 121 },
  { text: " bir", duration: 0.28, begin: 34.800, index: 122 },
  { text: " ders", duration: 0.28, begin: 35.000, index: 123 },
  { text: " ver", duration: 0.28, begin: 35.400, index: 124 },
  { text: "di", duration: 0.28, begin: 35.600, index: 125 },
  { text: " ki,", duration: 0.28, begin: 35.800, index: 126 },
  { text: " u", duration: 0.28, begin: 36.800, index: 127 },
  { text: "ma", duration: 0.28, begin: 37.000, index: 128 },
  { text: "rım", duration: 0.28, begin: 37.200, index: 129 },
  { text: " bir", duration: 0.28, begin: 37.400, index: 130 },
  { text: " gün", duration: 0.28, begin: 37.600, index: 131 },
  { text: " ben", duration: 0.28, begin: 38.200, index: 132 },
  { text: " de", duration: 0.28, begin: 38.400, index: 133 },
  { text: " bi", duration: 0.28, begin: 39.200, index: 134 },
  { text: "ri", duration: 0.28, begin: 39.400, index: 135 },
  { text: "si", duration: 0.28, begin: 39.600, index: 136 },
  { text: "ne", duration: 0.28, begin: 39.800, index: 137 },
  { text: " ay", duration: 0.28, begin: 40.200, index: 138 },
  { text: "nı", duration: 0.28, begin: 40.400, index: 139 },
  { text: " duy", duration: 0.28, begin: 40.600, index: 140 },
  { text: "gu", duration: 0.28, begin: 40.800, index: 141 },
  { text: "la", duration: 0.28, begin: 41.000, index: 142 },
  { text: "rı,", duration: 0.28, begin: 41.200, index: 143 },
  { text: " ay", duration: 0.28, begin: 42.000, index: 144 },
  { text: "nı", duration: 0.28, begin: 42.200, index: 145 },
  { text: " gü", duration: 0.28, begin: 42.400, index: 146 },
  { text: "zel", duration: 0.28, begin: 42.600, index: 147 },
  { text: "lik", duration: 0.28, begin: 42.800, index: 148 },
  { text: "te", duration: 0.28, begin: 43.000, index: 149 },
  { text: " ve", duration: 0.28, begin: 43.200, index: 150 },
  { text: "re", duration: 0.28, begin: 43.400, index: 151 },
  { text: "bi", duration: 0.28, begin: 43.600, index: 152 },
  { text: "li", duration: 0.28, begin: 43.800, index: 153 },
  { text: "rim.", duration: 0.28, begin: 44.000, index: 154 },
  { text: " Sı", duration: 0.28, begin: 45.000, index: 155 },
  { text: "kın", duration: 0.28, begin: 45.200, index: 156 },
  { text: "tı", duration: 0.28, begin: 45.400, index: 157 },
  { text: "dan", duration: 0.28, begin: 45.600, index: 158 },
  { text: " pat", duration: 0.28, begin: 46.000, index: 159 },
  { text: "la", duration: 0.28, begin: 46.200, index: 160 },
  { text: "mak", duration: 0.28, begin: 46.400, index: 161 },
  { text: " ü", duration: 0.28, begin: 46.600, index: 162 },
  { text: "ze", duration: 0.28, begin: 46.800, index: 163 },
  { text: "re", duration: 0.28, begin: 47.000, index: 164 },
  { text: " ol", duration: 0.28, begin: 47.200, index: 165 },
  { text: "du", duration: 0.28, begin: 47.400, index: 166 },
  { text: "ğu", duration: 0.28, begin: 47.600, index: 167 },
  { text: "muz", duration: 0.28, begin: 47.800, index: 168 },
  { text: " bir", duration: 0.28, begin: 48.000, index: 169 },
  { text: " cu", duration: 0.28, begin: 48.600, index: 170 },
  { text: "mar", duration: 0.28, begin: 48.800, index: 171 },
  { text: "te", duration: 0.28, begin: 49.000, index: 172 },
  { text: "si", duration: 0.28, begin: 49.200, index: 173 },
  { text: " gü", duration: 0.28, begin: 49.400, index: 174 },
  { text: "nüy", duration: 0.28, begin: 49.600, index: 175 },
  { text: "dü.", duration: 0.28, begin: 49.800, index: 176 },
  { text: " Ar", duration: 0.28, begin: 50.800, index: 177 },
  { text: "ka", duration: 0.28, begin: 51.000, index: 178 },
  { text: "da", duration: 0.28, begin: 51.200, index: 179 },
  { text: "şım", duration: 0.28, begin: 51.400, index: 180 },
  { text: "la", duration: 0.28, begin: 51.600, index: 181 },
  { text: " bir", duration: 0.28, begin: 51.800, index: 182 },
  { text: "lik", duration: 0.28, begin: 52.000, index: 183 },
  { text: "te", duration: 0.28, begin: 52.200, index: 184 },
  { text: " yaş", duration: 0.28, begin: 53.200, index: 185 },
  { text: "lı", duration: 0.28, begin: 53.400, index: 186 },
  { text: " ba", duration: 0.28, begin: 53.600, index: 187 },
  { text: "ya", duration: 0.28, begin: 53.800, index: 188 },
  { text: "nın", duration: 0.28, begin: 54.000, index: 189 },
  { text: " ar", duration: 0.28, begin: 54.400, index: 190 },
  { text: "ka", duration: 0.28, begin: 54.600, index: 191 },
  { text: " bah", duration: 0.28, begin: 54.800, index: 192 },
  { text: "çe", duration: 0.28, begin: 55.000, index: 193 },
  { text: "sin", duration: 0.28, begin: 55.200, index: 194 },
  { text: "de", duration: 0.28, begin: 55.400, index: 195 },
  { text: " bir", duration: 0.28, begin: 56.000, index: 196 },
  { text: " kö", duration: 0.28, begin: 56.200, index: 197 },
  { text: "şe", duration: 0.28, begin: 56.400, index: 198 },
  { text: "ye", duration: 0.28, begin: 56.600, index: 199 },
  { text: " giz", duration: 0.28, begin: 56.800, index: 200 },
  { text: "le", duration: 0.28, begin: 57.000, index: 201 },
  { text: "ne", duration: 0.28, begin: 57.200, index: 202 },
  { text: "rek,", duration: 0.28, begin: 57.400, index: 203 },
  { text: " yer", duration: 0.28, begin: 58.400, index: 204 },
  { text: "den", duration: 0.28, begin: 58.600, index: 205 },
  { text: " al", duration: 0.28, begin: 58.800, index: 206 },
  { text: "dı", duration: 0.28, begin: 59.000, index: 207 },
  { text: "ğı", duration: 0.28, begin: 59.200, index: 208 },
  { text: "mız", duration: 0.28, begin: 59.400, index: 209 },
  { text: " taş", duration: 0.28, begin: 59.600, index: 210 },
  { text: "la", duration: 0.28, begin: 59.800, index: 211 },
  { text: "rı", duration: 0.28, begin: 60.000, index: 212 },
  { text: " e", duration: 0.28, begin: 61.000, index: 213 },
  { text: "vin", duration: 0.28, begin: 61.200, index: 214 },
  { text: " ça", duration: 0.28, begin: 61.400, index: 215 },
  { text: "tı", duration: 0.28, begin: 61.600, index: 216 },
  { text: "sı", duration: 0.28, begin: 61.800, index: 217 },
  { text: "na", duration: 0.28, begin: 62.000, index: 218 },
  { text: " a", duration: 0.28, begin: 62.400, index: 219 },
  { text: "tı", duration: 0.28, begin: 62.600, index: 220 },
  { text: "yor", duration: 0.28, begin: 62.800, index: 221 },
  { text: "duk.", duration: 0.28, begin: 63.000, index: 222 },
  { text: " At", duration: 0.28, begin: 64.000, index: 223 },
  { text: "tı", duration: 0.28, begin: 64.200, index: 224 },
  { text: "ğı", duration: 0.28, begin: 64.400, index: 225 },
  { text: "mız", duration: 0.28, begin: 64.600, index: 226 },
  { text: " taş", duration: 0.28, begin: 65.000, index: 227 },
  { text: "la", duration: 0.28, begin: 65.200, index: 228 },
  { text: "rın", duration: 0.28, begin: 65.400, index: 229 },
  { text: " ça", duration: 0.28, begin: 66.200, index: 230 },
  { text: "tı", duration: 0.28, begin: 66.400, index: 231 },
  { text: "nın", duration: 0.28, begin: 66.600, index: 232 },
  { text: " ü", duration: 0.28, begin: 66.800, index: 233 },
  { text: "ze", duration: 0.28, begin: 67.000, index: 234 },
  { text: "rin", duration: 0.28, begin: 67.200, index: 235 },
  { text: "den", duration: 0.28, begin: 67.400, index: 236 },
  { text: " yu", duration: 0.28, begin: 67.800, index: 237 },
  { text: "var", duration: 0.28, begin: 68.000, index: 238 },
  { text: "la", duration: 0.28, begin: 68.200, index: 239 },
  { text: "na", duration: 0.28, begin: 68.400, index: 240 },
  { text: "rak,", duration: 0.28, begin: 68.600, index: 241 },
  { text: " kö", duration: 0.28, begin: 69.400, index: 242 },
  { text: "şe", duration: 0.28, begin: 69.600, index: 243 },
  { text: "ler", duration: 0.28, begin: 69.800, index: 244 },
  { text: "den", duration: 0.28, begin: 70.000, index: 245 },
  { text: " a", duration: 0.28, begin: 70.600, index: 246 },
  { text: "şa", duration: 0.28, begin: 70.800, index: 247 },
  { text: "ğı", duration: 0.28, begin: 71.000, index: 248 },
  { text: "ya", duration: 0.28, begin: 71.200, index: 249 },
  { text: " düş", duration: 0.28, begin: 71.400, index: 250 },
  { text: "me", duration: 0.28, begin: 71.600, index: 251 },
  { text: "si", duration: 0.28, begin: 71.800, index: 252 },
  { text: "ni", duration: 0.28, begin: 72.000, index: 253 },
  { text: " kuy", duration: 0.28, begin: 72.600, index: 254 },
  { text: "ruk", duration: 0.28, begin: 72.800, index: 255 },
  { text: "lu", duration: 0.28, begin: 73.000, index: 256 },
  { text: " yıl", duration: 0.28, begin: 73.400, index: 257 },
  { text: "dız", duration: 0.28, begin: 73.600, index: 258 },
  { text: "la", duration: 0.28, begin: 73.800, index: 259 },
  { text: "rın", duration: 0.28, begin: 74.000, index: 260 },
  { text: " sü", duration: 0.28, begin: 74.800, index: 261 },
  { text: "zü", duration: 0.28, begin: 75.000, index: 262 },
  { text: "le", duration: 0.28, begin: 75.200, index: 263 },
  { text: "rek", duration: 0.28, begin: 75.400, index: 264 },
  { text: " gök", duration: 0.28, begin: 76.000, index: 265 },
  { text: "yü", duration: 0.28, begin: 76.200, index: 266 },
  { text: "zün", duration: 0.28, begin: 76.400, index: 267 },
  { text: "den", duration: 0.28, begin: 76.600, index: 268 },
  { text: " a", duration: 0.28, begin: 77.000, index: 269 },
  { text: "şa", duration: 0.28, begin: 77.200, index: 270 },
  { text: "ğı", duration: 0.28, begin: 77.400, index: 271 },
  { text: "ya", duration: 0.28, begin: 77.600, index: 272 },
  { text: " doğ", duration: 0.28, begin: 77.800, index: 273 },
  { text: "ru", duration: 0.28, begin: 78.000, index: 274 },
  { text: " düş", duration: 0.28, begin: 78.200, index: 275 },
  { text: "me", duration: 0.28, begin: 78.400, index: 276 },
  { text: "si", duration: 0.28, begin: 78.600, index: 277 },
  { text: "ne", duration: 0.28, begin: 78.800, index: 278 },
  { text: " ben", duration: 0.28, begin: 79.000, index: 279 },
  { text: "ze", duration: 0.28, begin: 79.200, index: 280 },
  { text: "te", duration: 0.28, begin: 79.400, index: 281 },
  { text: "rek", duration: 0.28, begin: 79.600, index: 282 },
  { text: " eğ", duration: 0.28, begin: 80.600, index: 283 },
  { text: "le", duration: 0.28, begin: 80.800, index: 284 },
  { text: "ni", duration: 0.28, begin: 81.000, index: 285 },
  { text: "yor", duration: 0.28, begin: 81.200, index: 286 },
  { text: "duk.", duration: 0.28, begin: 81.400, index: 287 },
  { text: " Ken", duration: 0.28, begin: 82.600, index: 288 },
  { text: "di", duration: 0.28, begin: 82.800, index: 289 },
  { text: "me", duration: 0.28, begin: 83.000, index: 290 },
  { text: " yer", duration: 0.28, begin: 83.200, index: 291 },
  { text: "den", duration: 0.28, begin: 83.400, index: 292 },
  { text: " çok", duration: 0.28, begin: 84.400, index: 293 },
  { text: " düz", duration: 0.28, begin: 84.800, index: 294 },
  { text: "gün", duration: 0.28, begin: 85.000, index: 295 },
  { text: " bir", duration: 0.28, begin: 85.400, index: 296 },
  { text: " taş", duration: 0.28, begin: 85.600, index: 297 },
  { text: " bul", duration: 0.28, begin: 86.200, index: 298 },
  { text: "muş", duration: 0.28, begin: 86.400, index: 299 },
  { text: "tum.", duration: 0.28, begin: 86.600, index: 300 },
  { text: " E", duration: 0.28, begin: 87.400, index: 301 },
  { text: "li", duration: 0.28, begin: 87.600, index: 302 },
  { text: "me", duration: 0.28, begin: 87.800, index: 303 },
  { text: " a", duration: 0.28, begin: 88.000, index: 304 },
  { text: "lıp", duration: 0.28, begin: 88.200, index: 305 },
  { text: " tüm", duration: 0.28, begin: 88.600, index: 306 },
  { text: " gü", duration: 0.40, begin: 89.000, index: 307 },
  { text: "cüm", duration: 0.40, begin: 89.200, index: 308 },
  { text: "le", duration: 0.40, begin: 89.400, index: 309 },
  { text: " fır", duration: 0.40, begin: 89.600, index: 310 },
  { text: "lat", duration: 0.40, begin: 89.800, index: 311 },
  { text: "tım.", duration: 0.40, begin: 90.000, index: 312 },
  { text: " A", duration: 0.28, begin: 91.200, index: 313 },
  { text: "ma", duration: 0.28, begin: 91.400, index: 314 },
  { text: " taş", duration: 0.28, begin: 91.600, index: 315 },
  { text: " bu", duration: 0.28, begin: 92.000, index: 316 },
  { text: " kez", duration: 0.28, begin: 92.200, index: 317 },
  { text: " ça", duration: 0.28, begin: 93.000, index: 318 },
  { text: "tı", duration: 0.28, begin: 93.200, index: 319 },
  { text: "ya", duration: 0.28, begin: 93.400, index: 320 },
  { text: " de", duration: 0.28, begin: 93.600, index: 321 },
  { text: "ğil", duration: 0.28, begin: 93.800, index: 322 },
  { text: " dış", duration: 0.28, begin: 94.400, index: 323 },
  { text: " ka", duration: 0.28, begin: 94.600, index: 324 },
  { text: "pı", duration: 0.28, begin: 94.800, index: 325 },
  { text: "nın", duration: 0.28, begin: 95.000, index: 326 },
  { text: " pen", duration: 0.28, begin: 95.600, index: 327 },
  { text: "ce", duration: 0.28, begin: 95.800, index: 328 },
  { text: "re", duration: 0.28, begin: 96.000, index: 329 },
  { text: "si", duration: 0.28, begin: 96.200, index: 330 },
  { text: "ne", duration: 0.28, begin: 96.400, index: 331 },
  { text: " gel", duration: 0.28, begin: 96.800, index: 332 },
  { text: "miş", duration: 0.28, begin: 97.000, index: 333 },
  { text: "ti.", duration: 0.28, begin: 97.200, index: 334 },
  { text: " Kı", duration: 0.28, begin: 98.200, index: 335 },
  { text: "rı", duration: 0.28, begin: 98.400, index: 336 },
  { text: "lan", duration: 0.28, begin: 98.600, index: 337 },
  { text: " cam", duration: 0.28, begin: 99.000, index: 338 },
  { text: " se", duration: 0.28, begin: 99.200, index: 339 },
  { text: "si", duration: 0.28, begin: 99.400, index: 340 },
  { text: "ni", duration: 0.28, begin: 99.600, index: 341 },
  { text: " du", duration: 0.28, begin: 99.800, index: 342 },
  { text: "yun", duration: 0.28, begin: 100.000, index: 343 },
  { text: "ca,", duration: 0.28, begin: 100.200, index: 344 },
  { text: " giz", duration: 0.28, begin: 101.000, index: 345 },
  { text: "len", duration: 0.28, begin: 101.200, index: 346 },
  { text: "di", duration: 0.28, begin: 101.400, index: 347 },
  { text: "ği", duration: 0.28, begin: 101.600, index: 348 },
  { text: "miz", duration: 0.28, begin: 101.800, index: 349 },
  { text: " yer", duration: 0.28, begin: 102.200, index: 350 },
  { text: "den", duration: 0.28, begin: 102.400, index: 351 },
  { text: " fır", duration: 0.40, begin: 102.600, index: 352 },
  { text: "la", duration: 0.40, begin: 102.800, index: 353 },
  { text: "yıp", duration: 0.40, begin: 103.000, index: 354 },
  { text: " ar", duration: 0.28, begin: 104.000, index: 355 },
  { text: "dı", duration: 0.28, begin: 104.200, index: 356 },
  { text: "mı", duration: 0.28, begin: 104.400, index: 357 },
  { text: "za", duration: 0.28, begin: 104.600, index: 358 },
  { text: " bak", duration: 0.28, begin: 105.000, index: 359 },
  { text: "ma", duration: 0.28, begin: 105.200, index: 360 },
  { text: "dan", duration: 0.28, begin: 105.400, index: 361 },
  { text: " so", duration: 0.28, begin: 105.800, index: 362 },
  { text: "luk", duration: 0.28, begin: 106.000, index: 363 },
  { text: " so", duration: 0.28, begin: 106.200, index: 364 },
  { text: "lu", duration: 0.28, begin: 106.400, index: 365 },
  { text: "ğa", duration: 0.28, begin: 106.600, index: 366 },
  { text: " kaç", duration: 0.28, begin: 107.000, index: 367 },
  { text: "mış", duration: 0.28, begin: 107.200, index: 368 },
  { text: "tık", duration: 0.28, begin: 107.400, index: 369 },
  { text: " o", duration: 0.28, begin: 107.600, index: 370 },
  { text: "ra", duration: 0.28, begin: 107.800, index: 371 },
  { text: "dan.", duration: 0.28, begin: 108.000, index: 372 },
  { text: " Yaş", duration: 0.28, begin: 109.400, index: 373 },
  { text: "lı", duration: 0.28, begin: 109.600, index: 374 },
  { text: " ba", duration: 0.28, begin: 109.800, index: 375 },
  { text: "ya", duration: 0.28, begin: 110.000, index: 376 },
  { text: "nın", duration: 0.28, begin: 110.200, index: 377 },
  { text: " bi", duration: 0.28, begin: 110.800, index: 378 },
  { text: "zi", duration: 0.28, begin: 111.000, index: 379 },
  { text: " gör", duration: 0.28, begin: 111.200, index: 380 },
  { text: "müş", duration: 0.28, begin: 111.400, index: 381 },
  { text: " ol", duration: 0.28, begin: 112.000, index: 382 },
  { text: "ma", duration: 0.28, begin: 112.200, index: 383 },
  { text: "sı", duration: 0.28, begin: 112.400, index: 384 },
  { text: " o", duration: 0.28, begin: 112.800, index: 385 },
  { text: "la", duration: 0.28, begin: 113.000, index: 386 },
  { text: "nak", duration: 0.28, begin: 113.200, index: 387 },
  { text: "sız", duration: 0.28, begin: 113.400, index: 388 },
  { text: "dı.", duration: 0.28, begin: 113.600, index: 389 },
  { text: " Tüm", duration: 0.28, begin: 114.800, index: 390 },
  { text: " ge", duration: 0.28, begin: 115.000, index: 391 },
  { text: "ce", duration: 0.28, begin: 115.200, index: 392 },
  { text: " yaş", duration: 0.28, begin: 116.000, index: 393 },
  { text: "lı", duration: 0.28, begin: 116.200, index: 394 },
  { text: " ba", duration: 0.28, begin: 116.400, index: 395 },
  { text: "ya", duration: 0.28, begin: 116.600, index: 396 },
  { text: "nın", duration: 0.28, begin: 116.800, index: 397 },
  { text: " be", duration: 0.28, begin: 117.000, index: 398 },
  { text: "ni", duration: 0.28, begin: 117.200, index: 399 },
  { text: " ya", duration: 0.10, begin: 117.400, index: 400 },
  { text: "ka", duration: 0.10, begin: 117.600, index: 401 },
  { text: "la", duration: 0.10, begin: 117.800, index: 402 },
  { text: "ya", duration: 0.10, begin: 118.000, index: 403 },
  { text: "bi", duration: 0.10, begin: 118.200, index: 404 },
  { text: "le", duration: 0.10, begin: 118.400, index: 405 },
  { text: "ce", duration: 0.10, begin: 118.600, index: 406 },
  { text: "ği", duration: 0.10, begin: 118.800, index: 407 },
  { text: "ni", duration: 0.10, begin: 119.000, index: 408 },
  { text: " dü", duration: 0.10, begin: 119.200, index: 409 },
  { text: "şü", duration: 0.10, begin: 119.400, index: 410 },
  { text: "ne", duration: 0.10, begin: 119.600, index: 411 },
  { text: "rek,", duration: 0.10, begin: 119.800, index: 412 },
  { text: " kor", duration: 0.28, begin: 120.400, index: 413 },
  { text: "ku", duration: 0.28, begin: 120.600, index: 414 },
  { text: "dan", duration: 0.28, begin: 120.800, index: 415 },
  { text: " u", duration: 0.28, begin: 121.000, index: 416 },
  { text: "yu", duration: 0.28, begin: 121.200, index: 417 },
  { text: "ya", duration: 0.28, begin: 121.400, index: 418 },
  { text: "ma", duration: 0.28, begin: 121.600, index: 419 },
  { text: "dım.", duration: 0.28, begin: 121.800, index: 420 },
  { text: " Er", duration: 0.28, begin: 123.000, index: 421 },
  { text: "te", duration: 0.28, begin: 123.200, index: 422 },
  { text: "si", duration: 0.28, begin: 123.400, index: 423 },
  { text: " gün", duration: 0.28, begin: 123.600, index: 424 },
  { text: " ga", duration: 0.28, begin: 124.400, index: 425 },
  { text: "ze", duration: 0.28, begin: 124.600, index: 426 },
  { text: "te", duration: 0.28, begin: 124.800, index: 427 },
  { text: "si", duration: 0.28, begin: 125.000, index: 428 },
  { text: "ni", duration: 0.28, begin: 125.200, index: 429 },
  { text: " ver", duration: 0.28, begin: 125.400, index: 430 },
  { text: "mek", duration: 0.28, begin: 125.600, index: 431 },
  { text: " ü", duration: 0.28, begin: 125.800, index: 432 },
  { text: "ze", duration: 0.28, begin: 126.000, index: 433 },
  { text: "re", duration: 0.28, begin: 126.200, index: 434 },
  { text: " ka", duration: 0.28, begin: 126.600, index: 435 },
  { text: "pı", duration: 0.28, begin: 126.800, index: 436 },
  { text: "sı", duration: 0.28, begin: 127.000, index: 437 },
  { text: "nı", duration: 0.28, begin: 127.200, index: 438 },
  { text: " çal", duration: 0.28, begin: 127.600, index: 439 },
  { text: "dı", duration: 0.28, begin: 127.800, index: 440 },
  { text: "ğım", duration: 0.28, begin: 128.000, index: 441 },
  { text: " za", duration: 0.28, begin: 128.200, index: 442 },
  { text: "man", duration: 0.28, begin: 128.400, index: 443 },
  { text: " her", duration: 0.28, begin: 129.400, index: 444 },
  { text: " za", duration: 0.28, begin: 129.600, index: 445 },
  { text: "man", duration: 0.28, begin: 129.800, index: 446 },
  { text: " ki", duration: 0.28, begin: 130.000, index: 447 },
  { text: " gi", duration: 0.28, begin: 130.200, index: 448 },
  { text: "bi", duration: 0.28, begin: 130.400, index: 449 },
  { text: " iç", duration: 0.28, begin: 130.600, index: 450 },
  { text: "ten", duration: 0.28, begin: 130.800, index: 451 },
  { text: "lik", duration: 0.28, begin: 131.000, index: 452 },
  { text: "le", duration: 0.28, begin: 131.200, index: 453 },
  { text: " gü", duration: 0.28, begin: 131.600, index: 454 },
  { text: "lüm", duration: 0.28, begin: 131.800, index: 455 },
  { text: "se", duration: 0.28, begin: 132.000, index: 456 },
  { text: "ye", duration: 0.28, begin: 132.200, index: 457 },
  { text: "rek", duration: 0.28, begin: 132.400, index: 458 },
  { text: " ha", duration: 0.28, begin: 133.400, index: 459 },
  { text: "tı", duration: 0.28, begin: 133.600, index: 460 },
  { text: "rı", duration: 0.28, begin: 133.800, index: 461 },
  { text: "mı", duration: 0.28, begin: 134.000, index: 462 },
  { text: " sor", duration: 0.28, begin: 134.200, index: 463 },
  { text: "du.", duration: 0.28, begin: 134.400, index: 464 },
  { text: " A", duration: 0.28, begin: 135.200, index: 465 },
  { text: "ma", duration: 0.28, begin: 135.400, index: 466 },
  { text: " ben", duration: 0.28, begin: 135.600, index: 467 },
  { text: " suç", duration: 0.28, begin: 136.000, index: 468 },
  { text: "lu", duration: 0.28, begin: 136.200, index: 469 },
  { text: "luk", duration: 0.28, begin: 136.400, index: 470 },
  { text: " duy", duration: 0.28, begin: 136.800, index: 471 },
  { text: "gu", duration: 0.28, begin: 137.000, index: 472 },
  { text: "suy", duration: 0.28, begin: 137.200, index: 473 },
  { text: "la", duration: 0.28, begin: 137.400, index: 474 },
  { text: " yü", duration: 0.28, begin: 137.600, index: 475 },
  { text: "zü", duration: 0.28, begin: 137.800, index: 476 },
  { text: "ne", duration: 0.28, begin: 138.000, index: 477 },
  { text: " ba", duration: 0.28, begin: 138.200, index: 478 },
  { text: "ka", duration: 0.28, begin: 138.400, index: 479 },
  { text: "mı", duration: 0.28, begin: 138.600, index: 480 },
  { text: "yor", duration: 0.28, begin: 138.800, index: 481 },
  { text: "dum.", duration: 0.28, begin: 139.000, index: 482 },
  { text: " So", duration: 0.28, begin: 140.200, index: 483 },
  { text: "nun", duration: 0.28, begin: 140.400, index: 484 },
  { text: "da", duration: 0.28, begin: 140.600, index: 485 },
  { text: " ga", duration: 0.28, begin: 141.200, index: 486 },
  { text: "ze", duration: 0.28, begin: 141.400, index: 487 },
  { text: "te", duration: 0.28, begin: 141.600, index: 488 },
  { text: " da", duration: 0.28, begin: 141.800, index: 489 },
  { text: "ğı", duration: 0.28, begin: 142.000, index: 490 },
  { text: "tı", duration: 0.28, begin: 142.200, index: 491 },
  { text: "mın", duration: 0.28, begin: 142.400, index: 492 },
  { text: "dan", duration: 0.28, begin: 142.600, index: 493 },
  { text: " ka", duration: 0.28, begin: 142.800, index: 494 },
  { text: "zan", duration: 0.28, begin: 143.000, index: 495 },
  { text: "dı", duration: 0.28, begin: 143.200, index: 496 },
  { text: "ğım", duration: 0.28, begin: 143.400, index: 497 },
  { text: " pa", duration: 0.28, begin: 143.600, index: 498 },
  { text: "ra", duration: 0.28, begin: 143.800, index: 499 },
  { text: "yı", duration: 0.28, begin: 144.000, index: 500 },
  { text: " bi", duration: 0.28, begin: 144.200, index: 501 },
  { text: "rik", duration: 0.28, begin: 144.400, index: 502 },
  { text: "tir", duration: 0.28, begin: 144.600, index: 503 },
  { text: "me", duration: 0.28, begin: 144.800, index: 504 },
  { text: "ye", duration: 0.28, begin: 145.000, index: 505 },
  { text: " ka", duration: 0.28, begin: 145.600, index: 506 },
  { text: "rar", duration: 0.28, begin: 145.800, index: 507 },
  { text: " ver", duration: 0.28, begin: 146.000, index: 508 },
  { text: "dim.", duration: 0.28, begin: 146.200, index: 509 },
  { text: " Üç", duration: 0.28, begin: 147.200, index: 510 },
  { text: " haf", duration: 0.28, begin: 147.400, index: 511 },
  { text: "ta", duration: 0.28, begin: 147.600, index: 512 },
  { text: " son", duration: 0.28, begin: 148.000, index: 513 },
  { text: "ra", duration: 0.28, begin: 148.200, index: 514 },
  { text: " tam", duration: 0.28, begin: 149.200, index: 515 },
  { text: " ye", duration: 0.28, begin: 149.400, index: 516 },
  { text: "di", duration: 0.28, begin: 149.600, index: 517 },
  { text: " do", duration: 0.28, begin: 149.800, index: 518 },
  { text: "la", duration: 0.28, begin: 150.000, index: 519 },
  { text: "rım", duration: 0.28, begin: 150.200, index: 520 },
  { text: " ol", duration: 0.28, begin: 150.600, index: 521 },
  { text: "muş", duration: 0.28, begin: 150.800, index: 522 },
  { text: "tu.", duration: 0.28, begin: 151.000, index: 523 },
  { text: " Bir", duration: 0.28, begin: 152.200, index: 524 },
  { text: " ka", duration: 0.28, begin: 152.400, index: 525 },
  { text: "ğı", duration: 0.28, begin: 152.600, index: 526 },
  { text: "da;", duration: 0.28, begin: 152.800, index: 527 },
  { text: " \"Ca", duration: 0.28, begin: 153.800, index: 528 },
  { text: "mı", duration: 0.28, begin: 154.000, index: 529 },
  { text: "nı", duration: 0.28, begin: 154.200, index: 530 },
  { text: "zı", duration: 0.28, begin: 154.400, index: 531 },
  { text: " is", duration: 0.28, begin: 154.600, index: 532 },
  { text: "te", duration: 0.28, begin: 154.800, index: 533 },
  { text: "me", duration: 0.28, begin: 155.000, index: 534 },
  { text: "den", duration: 0.28, begin: 155.200, index: 535 },
  { text: " kır", duration: 0.28, begin: 155.400, index: 536 },
  { text: "dı", duration: 0.28, begin: 155.600, index: 537 },
  { text: "ğım", duration: 0.28, begin: 155.800, index: 538 },
  { text: " i", duration: 0.28, begin: 156.000, index: 539 },
  { text: "çin", duration: 0.28, begin: 156.200, index: 540 },
  { text: " üz", duration: 0.28, begin: 156.600, index: 541 },
  { text: "gü", duration: 0.28, begin: 156.800, index: 542 },
  { text: "nüm,", duration: 0.28, begin: 157.000, index: 543 },
  { text: " u", duration: 0.28, begin: 158.000, index: 544 },
  { text: "ma", duration: 0.28, begin: 158.200, index: 545 },
  { text: "rım", duration: 0.28, begin: 158.400, index: 546 },
  { text: " koy", duration: 0.28, begin: 159.000, index: 547 },
  { text: "du", duration: 0.28, begin: 159.200, index: 548 },
  { text: "ğum", duration: 0.28, begin: 159.400, index: 549 },
  { text: " pa", duration: 0.28, begin: 159.600, index: 550 },
  { text: "ra", duration: 0.28, begin: 159.800, index: 551 },
  { text: " o", duration: 0.28, begin: 160.000, index: 552 },
  { text: "na", duration: 0.28, begin: 160.200, index: 553 },
  { text: "rı", duration: 0.28, begin: 160.400, index: 554 },
  { text: "mı", duration: 0.28, begin: 160.600, index: 555 },
  { text: " i", duration: 0.28, begin: 160.800, index: 556 },
  { text: "çin", duration: 0.28, begin: 161.000, index: 557 },
  { text: " ye", duration: 0.28, begin: 161.200, index: 558 },
  { text: "ter", duration: 0.28, begin: 161.400, index: 559 },
  { text: "li", duration: 0.28, begin: 161.600, index: 560 },
  { text: "dir\"", duration: 0.28, begin: 161.800, index: 561 },
  { text: " ya", duration: 0.28, begin: 162.600, index: 562 },
  { text: "za", duration: 0.28, begin: 162.800, index: 563 },
  { text: "rak", duration: 0.28, begin: 163.000, index: 564 },
  { text: " pa", duration: 0.28, begin: 163.200, index: 565 },
  { text: "ray", duration: 0.28, begin: 163.400, index: 566 },
  { text: "la", duration: 0.28, begin: 163.600, index: 567 },
  { text: " bir", duration: 0.28, begin: 163.800, index: 568 },
  { text: "lik", duration: 0.28, begin: 164.000, index: 569 },
  { text: "te", duration: 0.28, begin: 164.200, index: 570 },
  { text: " zar", duration: 0.28, begin: 164.600, index: 571 },
  { text: "fın", duration: 0.28, begin: 164.800, index: 572 },
  { text: " i", duration: 0.28, begin: 165.200, index: 573 },
  { text: "çi", duration: 0.28, begin: 165.400, index: 574 },
  { text: "ne", duration: 0.28, begin: 165.600, index: 575 },
  { text: " koy", duration: 0.28, begin: 165.800, index: 576 },
  { text: "dum.", duration: 0.28, begin: 166.000, index: 577 },
  { text: " Ge", duration: 0.28, begin: 167.600, index: 578 },
  { text: "ce", duration: 0.28, begin: 167.800, index: 579 },
  { text: " ha", duration: 0.28, begin: 168.600, index: 580 },
  { text: "va", duration: 0.28, begin: 168.800, index: 581 },
  { text: "nın", duration: 0.28, begin: 169.000, index: 582 },
  { text: " ka", duration: 0.28, begin: 169.200, index: 583 },
  { text: "rar", duration: 0.28, begin: 169.400, index: 584 },
  { text: "ma", duration: 0.28, begin: 169.600, index: 585 },
  { text: "sı", duration: 0.28, begin: 169.800, index: 586 },
  { text: "nı", duration: 0.28, begin: 170.000, index: 587 },
  { text: " bek", duration: 0.28, begin: 170.200, index: 588 },
  { text: "le", duration: 0.28, begin: 170.400, index: 589 },
  { text: "ye", duration: 0.28, begin: 170.600, index: 590 },
  { text: "rek,", duration: 0.28, begin: 170.800, index: 591 },
  { text: " zar", duration: 0.28, begin: 171.600, index: 592 },
  { text: "fı", duration: 0.28, begin: 171.800, index: 593 },
  { text: " u", duration: 0.28, begin: 172.000, index: 594 },
  { text: "sul", duration: 0.28, begin: 172.200, index: 595 },
  { text: "ca", duration: 0.28, begin: 172.400, index: 596 },
  { text: " yaş", duration: 0.28, begin: 172.800, index: 597 },
  { text: "lı", duration: 0.28, begin: 173.000, index: 598 },
  { text: " ba", duration: 0.28, begin: 173.200, index: 599 },
  { text: "ya", duration: 0.28, begin: 173.400, index: 600 },
  { text: "nın", duration: 0.28, begin: 173.600, index: 601 },
  { text: " pos", duration: 0.28, begin: 174.000, index: 602 },
  { text: "ta", duration: 0.28, begin: 174.200, index: 603 },
  { text: " ku", duration: 0.28, begin: 174.400, index: 604 },
  { text: "tu", duration: 0.28, begin: 174.600, index: 605 },
  { text: "su", duration: 0.28, begin: 174.800, index: 606 },
  { text: "na", duration: 0.28, begin: 175.000, index: 607 },
  { text: " at", duration: 0.28, begin: 175.200, index: 608 },
  { text: "tım.", duration: 0.28, begin: 175.400, index: 609 },
  { text: " Ru", duration: 0.28, begin: 176.600, index: 610 },
  { text: "hum", duration: 0.28, begin: 176.800, index: 611 },
  { text: " bir", duration: 0.28, begin: 177.000, index: 612 },
  { text: " an", duration: 0.28, begin: 177.400, index: 613 },
  { text: "da", duration: 0.28, begin: 177.600, index: 614 },
  { text: " öz", duration: 0.28, begin: 177.800, index: 615 },
  { text: "gür", duration: 0.28, begin: 178.000, index: 616 },
  { text: "lü", duration: 0.28, begin: 178.200, index: 617 },
  { text: "ğe", duration: 0.28, begin: 178.400, index: 618 },
  { text: " ka", duration: 0.28, begin: 178.800, index: 619 },
  { text: "vuş", duration: 0.28, begin: 179.000, index: 620 },
  { text: "muş", duration: 0.28, begin: 179.200, index: 621 },
  { text: "tu", duration: 0.28, begin: 179.400, index: 622 },
  { text: " san", duration: 0.28, begin: 179.600, index: 623 },
  { text: "ki.", duration: 0.28, begin: 179.800, index: 624 },
  { text: " Ar", duration: 0.28, begin: 181.200, index: 625 },
  { text: "tık", duration: 0.28, begin: 181.400, index: 626 },
  { text: " es", duration: 0.28, begin: 181.600, index: 627 },
  { text: "ki", duration: 0.28, begin: 181.800, index: 628 },
  { text: "si", duration: 0.28, begin: 182.000, index: 629 },
  { text: " gi", duration: 0.28, begin: 182.200, index: 630 },
  { text: "bi", duration: 0.28, begin: 182.400, index: 631 },
  { text: " yaş", duration: 0.28, begin: 183.200, index: 632 },
  { text: "lı", duration: 0.28, begin: 183.400, index: 633 },
  { text: " ba", duration: 0.28, begin: 183.600, index: 634 },
  { text: "ya", duration: 0.28, begin: 183.800, index: 635 },
  { text: "nın", duration: 0.28, begin: 184.000, index: 636 },
  { text: " göz", duration: 0.28, begin: 184.400, index: 637 },
  { text: "le", duration: 0.28, begin: 184.600, index: 638 },
  { text: "ri", duration: 0.28, begin: 184.800, index: 639 },
  { text: "nin", duration: 0.28, begin: 185.000, index: 640 },
  { text: " i", duration: 0.13, begin: 185.200, index: 641 },
  { text: "çi", duration: 0.13, begin: 185.400, index: 642 },
  { text: "ne", duration: 0.13, begin: 185.600, index: 643 },
  { text: " ba", duration: 0.13, begin: 185.800, index: 644 },
  { text: "ka", duration: 0.13, begin: 186.000, index: 645 },
  { text: "bi", duration: 0.13, begin: 186.200, index: 646 },
  { text: "le", duration: 0.13, begin: 186.500, index: 647 },
  { text: "ce", duration: 0.13, begin: 186.600, index: 648 },
  { text: "ği", duration: 0.13, begin: 186.700, index: 649 },
  { text: "mi", duration: 0.13, begin: 186.800, index: 650 },
  { text: " dü", duration: 0.28, begin: 187.000, index: 651 },
  { text: "şü", duration: 0.28, begin: 187.200, index: 652 },
  { text: "ne", duration: 0.28, begin: 187.400, index: 653 },
  { text: "rek", duration: 0.28, begin: 187.600, index: 654 },
  { text: " mut", duration: 0.28, begin: 188.600, index: 655 },
  { text: "lu", duration: 0.28, begin: 188.800, index: 656 },
  { text: "luk", duration: 0.28, begin: 189.000, index: 657 },
  { text: " du", duration: 0.28, begin: 189.200, index: 658 },
  { text: "yu", duration: 0.28, begin: 189.400, index: 659 },
  { text: "yor", duration: 0.28, begin: 189.600, index: 660 },
  { text: "dum.", duration: 0.28, begin: 189.800, index: 661 },
  { text: " Er", duration: 0.28, begin: 191.000, index: 662 },
  { text: "te", duration: 0.28, begin: 191.200, index: 663 },
  { text: "si", duration: 0.28, begin: 191.400, index: 664 },
  { text: " gün", duration: 0.28, begin: 191.600, index: 665 },
  { text: " ka", duration: 0.28, begin: 192.000, index: 666 },
  { text: "pı", duration: 0.28, begin: 192.200, index: 667 },
  { text: "sı", duration: 0.28, begin: 192.400, index: 668 },
  { text: "nı", duration: 0.28, begin: 192.600, index: 669 },
  { text: " ça", duration: 0.28, begin: 192.800, index: 670 },
  { text: "lıp", duration: 0.28, begin: 193.000, index: 671 },
  { text: " ga", duration: 0.28, begin: 193.600, index: 672 },
  { text: "ze", duration: 0.28, begin: 193.800, index: 673 },
  { text: "te", duration: 0.28, begin: 194.000, index: 674 },
  { text: "si", duration: 0.28, begin: 194.200, index: 675 },
  { text: "ni", duration: 0.28, begin: 194.400, index: 676 },
  { text: " u", duration: 0.28, begin: 194.600, index: 677 },
  { text: "zat", duration: 0.28, begin: 194.800, index: 678 },
  { text: "tı", duration: 0.28, begin: 195.000, index: 679 },
  { text: "ğım", duration: 0.28, begin: 195.200, index: 680 },
  { text: " za", duration: 0.28, begin: 195.400, index: 681 },
  { text: "man", duration: 0.28, begin: 195.600, index: 682 },
  { text: " her", duration: 0.28, begin: 196.400, index: 683 },
  { text: " za", duration: 0.28, begin: 196.600, index: 684 },
  { text: "man", duration: 0.28, begin: 196.800, index: 685 },
  { text: " ki", duration: 0.28, begin: 197.000, index: 686 },
  { text: " gi", duration: 0.28, begin: 197.200, index: 687 },
  { text: "bi", duration: 0.28, begin: 197.400, index: 688 },
  { text: " iç", duration: 0.28, begin: 197.800, index: 689 },
  { text: "ten", duration: 0.28, begin: 198.000, index: 690 },
  { text: "lik", duration: 0.28, begin: 198.200, index: 691 },
  { text: "le", duration: 0.28, begin: 198.400, index: 692 },
  { text: " gü", duration: 0.28, begin: 198.600, index: 693 },
  { text: "lüm", duration: 0.28, begin: 198.800, index: 694 },
  { text: "se", duration: 0.28, begin: 199.000, index: 695 },
  { text: "di", duration: 0.28, begin: 199.200, index: 696 },
  { text: " göz", duration: 0.28, begin: 199.400, index: 697 },
  { text: "le", duration: 0.28, begin: 199.600, index: 698 },
  { text: "ri", duration: 0.28, begin: 199.800, index: 699 },
  { text: "me.", duration: 0.28, begin: 200.000, index: 700 },
  { text: " Bu", duration: 0.28, begin: 201.200, index: 701 },
  { text: " kez", duration: 0.28, begin: 201.400, index: 702 },
  { text: " ben", duration: 0.28, begin: 201.600, index: 703 },
  { text: "de", duration: 0.28, begin: 201.800, index: 704 },
  { text: " kar", duration: 0.28, begin: 202.000, index: 705 },
  { text: "şı", duration: 0.28, begin: 202.200, index: 706 },
  { text: "lık", duration: 0.28, begin: 202.400, index: 707 },
  { text: " ve", duration: 0.28, begin: 202.800, index: 708 },
  { text: "re", duration: 0.28, begin: 203.000, index: 709 },
  { text: "rek,", duration: 0.28, begin: 203.200, index: 710 },
  { text: " göz", duration: 0.28, begin: 204.000, index: 711 },
  { text: "le", duration: 0.28, begin: 204.200, index: 712 },
  { text: "ri", duration: 0.28, begin: 204.400, index: 713 },
  { text: "nin", duration: 0.28, begin: 204.600, index: 714 },
  { text: " i", duration: 0.28, begin: 204.800, index: 715 },
  { text: "çi", duration: 0.28, begin: 205.000, index: 716 },
  { text: "ne", duration: 0.28, begin: 205.200, index: 717 },
  { text: " bak", duration: 0.28, begin: 205.400, index: 718 },
  { text: "tım.", duration: 0.28, begin: 205.600, index: 719 },
  { text: " Tam", duration: 0.28, begin: 206.800, index: 720 },
  { text: " ar", duration: 0.28, begin: 207.000, index: 721 },
  { text: "ka", duration: 0.28, begin: 207.200, index: 722 },
  { text: "mı", duration: 0.28, begin: 207.400, index: 723 },
  { text: " dö", duration: 0.28, begin: 207.600, index: 724 },
  { text: "nüp", duration: 0.28, begin: 207.800, index: 725 },
  { text: " gi", duration: 0.28, begin: 208.000, index: 726 },
  { text: "de", duration: 0.28, begin: 208.200, index: 727 },
  { text: "ce", duration: 0.28, begin: 208.400, index: 728 },
  { text: "ğim", duration: 0.28, begin: 208.600, index: 729 },
  { text: " an", duration: 0.28, begin: 208.800, index: 730 },
  { text: "da;", duration: 0.28, begin: 209.000, index: 731 },
  { text: " \"Ah,", duration: 0.28, begin: 210.200, index: 732 },
  { text: " bir", duration: 0.28, begin: 210.800, index: 733 },
  { text: " da", duration: 0.28, begin: 211.000, index: 734 },
  { text: "ki", duration: 0.28, begin: 211.200, index: 735 },
  { text: "ka,", duration: 0.28, begin: 211.400, index: 736 },
  { text: " ne", duration: 0.28, begin: 212.400, index: 737 },
  { text: "re", duration: 0.28, begin: 212.600, index: 738 },
  { text: "dey", duration: 0.28, begin: 212.800, index: 739 },
  { text: "se", duration: 0.28, begin: 213.000, index: 740 },
  { text: " u", duration: 0.28, begin: 213.200, index: 741 },
  { text: "nu", duration: 0.28, begin: 213.400, index: 742 },
  { text: "tu", duration: 0.28, begin: 213.600, index: 743 },
  { text: "yor", duration: 0.28, begin: 213.800, index: 744 },
  { text: "dum,", duration: 0.28, begin: 214.000, index: 745 },
  { text: " al", duration: 0.28, begin: 214.800, index: 746 },
  { text: " ba", duration: 0.28, begin: 215.000, index: 747 },
  { text: "ka", duration: 0.28, begin: 215.200, index: 748 },
  { text: "lım", duration: 0.28, begin: 215.400, index: 749 },
  { text: " bu", duration: 0.28, begin: 216.200, index: 750 },
  { text: " ku", duration: 0.28, begin: 216.400, index: 751 },
  { text: "ra", duration: 0.28, begin: 216.600, index: 752 },
  { text: "bi", duration: 0.28, begin: 216.800, index: 753 },
  { text: "ye", duration: 0.28, begin: 217.000, index: 754 },
  { text: "ler", duration: 0.28, begin: 217.200, index: 755 },
  { text: " se", duration: 0.28, begin: 217.600, index: 756 },
  { text: "nin", duration: 0.28, begin: 217.800, index: 757 },
  { text: " i", duration: 0.28, begin: 218.000, index: 758 },
  { text: "çin\"", duration: 0.28, begin: 218.200, index: 759 },
  { text: " di", duration: 0.28, begin: 218.800, index: 760 },
  { text: "ye", duration: 0.28, begin: 219.000, index: 761 },
  { text: "rek", duration: 0.28, begin: 219.200, index: 762 },
  { text: " e", duration: 0.28, begin: 219.600, index: 763 },
  { text: "lin", duration: 0.28, begin: 219.800, index: 764 },
  { text: "de", duration: 0.28, begin: 220.000, index: 765 },
  { text: "ki", duration: 0.28, begin: 220.200, index: 766 },
  { text: " pa", duration: 0.28, begin: 220.400, index: 767 },
  { text: "ke", duration: 0.28, begin: 220.600, index: 768 },
  { text: "ti", duration: 0.28, begin: 220.800, index: 769 },
  { text: " u", duration: 0.28, begin: 221.000, index: 770 },
  { text: "zat", duration: 0.28, begin: 221.200, index: 771 },
  { text: "tı.", duration: 0.28, begin: 221.400, index: 772 },
  { text: " Ev", duration: 0.28, begin: 222.600, index: 773 },
  { text: "den", duration: 0.28, begin: 222.800, index: 774 },
  { text: " u", duration: 0.28, begin: 223.200, index: 775 },
  { text: "zak", duration: 0.28, begin: 223.400, index: 776 },
  { text: "la", duration: 0.28, begin: 223.600, index: 777 },
  { text: "şır", duration: 0.28, begin: 223.800, index: 778 },
  { text: "ken", duration: 0.28, begin: 224.000, index: 779 },
  { text: " ne", duration: 0.28, begin: 224.800, index: 780 },
  { text: "şe", duration: 0.28, begin: 225.000, index: 781 },
  { text: " i", duration: 0.28, begin: 225.200, index: 782 },
  { text: "çin", duration: 0.28, begin: 225.400, index: 783 },
  { text: "de", duration: 0.28, begin: 225.600, index: 784 },
  { text: " ku", duration: 0.28, begin: 225.800, index: 785 },
  { text: "ra", duration: 0.28, begin: 226.000, index: 786 },
  { text: "bi", duration: 0.28, begin: 226.200, index: 787 },
  { text: "ye", duration: 0.28, begin: 226.400, index: 788 },
  { text: "le", duration: 0.28, begin: 226.600, index: 789 },
  { text: "ri", duration: 0.28, begin: 226.800, index: 790 },
  { text: " ye", duration: 0.28, begin: 227.000, index: 791 },
  { text: "me", duration: 0.28, begin: 227.200, index: 792 },
  { text: "ye", duration: 0.28, begin: 227.400, index: 793 },
  { text: " baş", duration: 0.28, begin: 227.600, index: 794 },
  { text: "la", duration: 0.28, begin: 227.800, index: 795 },
  { text: "dım.", duration: 0.28, begin: 228.000, index: 796 },
  { text: " Bir", duration: 0.28, begin: 229.000, index: 797 },
  { text: " kaç", duration: 0.28, begin: 229.200, index: 798 },
  { text: " ku", duration: 0.28, begin: 229.400, index: 799 },
  { text: "ra", duration: 0.28, begin: 229.600, index: 800 },
  { text: "bi", duration: 0.28, begin: 229.800, index: 801 },
  { text: "ye", duration: 0.28, begin: 230.000, index: 802 },
  { text: " ye", duration: 0.28, begin: 230.400, index: 803 },
  { text: "dik", duration: 0.28, begin: 230.600, index: 804 },
  { text: "ten", duration: 0.28, begin: 230.800, index: 805 },
  { text: " son", duration: 0.28, begin: 231.200, index: 806 },
  { text: "ra", duration: 0.28, begin: 231.400, index: 807 },
  { text: " pa", duration: 0.28, begin: 232.200, index: 808 },
  { text: "ket", duration: 0.28, begin: 232.400, index: 809 },
  { text: "te", duration: 0.28, begin: 232.600, index: 810 },
  { text: " bir", duration: 0.28, begin: 233.000, index: 811 },
  { text: " zarf", duration: 0.28, begin: 233.200, index: 812 },
  { text: " ol", duration: 0.28, begin: 233.400, index: 813 },
  { text: "du", duration: 0.28, begin: 233.600, index: 814 },
  { text: "ğu", duration: 0.28, begin: 233.800, index: 815 },
  { text: "nu", duration: 0.28, begin: 234.000, index: 816 },
  { text: " gör", duration: 0.28, begin: 234.200, index: 817 },
  { text: "düm.", duration: 0.28, begin: 234.400, index: 818 },
  { text: " Zar", duration: 0.28, begin: 235.800, index: 819 },
  { text: "fı", duration: 0.28, begin: 236.000, index: 820 },
  { text: " aç", duration: 0.28, begin: 236.200, index: 821 },
  { text: "tı", duration: 0.28, begin: 236.400, index: 822 },
  { text: "ğım", duration: 0.28, begin: 236.600, index: 823 },
  { text: " za", duration: 0.28, begin: 237.000, index: 824 },
  { text: "man", duration: 0.28, begin: 237.200, index: 825 },
  { text: " i", duration: 0.28, begin: 237.800, index: 826 },
  { text: "çin", duration: 0.28, begin: 238.000, index: 827 },
  { text: "de", duration: 0.28, begin: 238.200, index: 828 },
  { text: " ye", duration: 0.28, begin: 238.400, index: 829 },
  { text: "di", duration: 0.28, begin: 238.600, index: 830 },
  { text: " do", duration: 0.28, begin: 238.800, index: 831 },
  { text: "lar", duration: 0.28, begin: 239.000, index: 832 },
  { text: " ve", duration: 0.28, begin: 239.400, index: 833 },
  { text: " kı", duration: 0.28, begin: 240.200, index: 834 },
  { text: "sa", duration: 0.28, begin: 240.400, index: 835 },
  { text: " bir", duration: 0.28, begin: 240.600, index: 836 },
  { text: " not", duration: 0.28, begin: 240.800, index: 837 },
  { text: " var", duration: 0.28, begin: 241.200, index: 838 },
  { text: "dı:", duration: 0.28, begin: 241.400, index: 839 },
  { text: " \"Se", duration: 0.28, begin: 242.400, index: 840 },
  { text: "nin", duration: 0.28, begin: 242.600, index: 841 },
  { text: "le", duration: 0.28, begin: 242.800, index: 842 },
  { text: " gu", duration: 0.28, begin: 243.000, index: 843 },
  { text: "rur", duration: 0.28, begin: 243.200, index: 844 },
  { text: " du", duration: 0.28, begin: 243.400, index: 845 },
  { text: "yu", duration: 0.28, begin: 243.600, index: 846 },
  { text: "yo", duration: 0.28, begin: 243.800, index: 847 },
  { text: "rum!\"", duration: 0.28, begin: 244.000, index: 848 }
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

  const handleAudioEnded = () => {
    setIsPlaying(false)
    setActiveIndex(-1)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
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
  <Link href="/dashboard/stories/stanford-universitesi" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
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
            src="/4-7.mp3"
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