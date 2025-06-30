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
  { text: "Ön", duration: 0.28, begin: 0.729, index: 1, isTitle: true, isCenter: true },
  { text: " Yar", duration: 0.38, begin: 1.218, index: 2, isTitle: true, isCenter: true },
  { text: "gı", duration: 0.38, begin: 1.500, index: 3, isTitle: true, isCenter: true },
  
  // Story content
  { text: " Genç", duration: 0.28, begin: 2.500, index: 4 },
  { text: " a", duration: 0.28, begin: 2.750, index: 5 },
  { text: "dam", duration: 0.28, begin: 3.000, index: 6 },
  { text: " e", duration: 0.28, begin: 3.500, index: 7 },
  { text: "vi", duration: 0.28, begin: 3.750, index: 8 },
  { text: "nin", duration: 0.28, begin: 4.000, index: 9 },
  { text: " alt", duration: 0.28, begin: 4.250, index: 10 },
  { text: " ka", duration: 0.28, begin: 4.500, index: 11 },
  { text: "tın", duration: 0.28, begin: 4.750, index: 12 },
  { text: "da", duration: 0.28, begin: 5.000, index: 13 },
  { text: " ma", duration: 0.28, begin: 5.250, index: 14 },
  { text: "ran", duration: 0.28, begin: 5.500, index: 15 },
  { text: "goz", duration: 0.28, begin: 5.750, index: 16 },
  { text: "luk", duration: 0.28, begin: 6.000, index: 17 },
  { text: " ya", duration: 0.28, begin: 6.250, index: 18 },
  { text: "pı", duration: 0.28, begin: 6.500, index: 19 },
  { text: "yor", duration: 0.28, begin: 6.750, index: 20 },
  { text: "du.", duration: 0.28, begin: 7.000, index: 21 },
  { text: " Ka", duration: 0.28, begin: 8.000, index: 22 },
  { text: "pı", duration: 0.28, begin: 8.250, index: 23 },
  { text: " ve", duration: 0.28, begin: 8.500, index: 24 },
  { text: " pen", duration: 0.28, begin: 8.750, index: 25 },
  { text: "ce", duration: 0.28, begin: 9.000, index: 26 },
  { text: "re", duration: 0.28, begin: 9.250, index: 27 },
  { text: " ko", duration: 0.28, begin: 9.500, index: 28 },
  { text: "nu", duration: 0.28, begin: 9.750, index: 29 },
  { text: "sun", duration: 0.28, begin: 10.000, index: 30 },
  { text: "da", duration: 0.28, begin: 10.250, index: 31 },
  { text: " uz", duration: 0.28, begin: 10.500, index: 32 },
  { text: "man", duration: 0.28, begin: 10.750, index: 33 },
  { text: "dı.", duration: 0.28, begin: 11.000, index: 34 },
  { text: " Fa", duration: 0.28, begin: 12.000, index: 35 },
  { text: "kat", duration: 0.28, begin: 12.250, index: 36 },
  { text: " plas", duration: 0.28, begin: 12.500, index: 37 },
  { text: "tik", duration: 0.28, begin: 12.750, index: 38 },
  { text: " pen", duration: 0.28, begin: 13.250, index: 39 },
  { text: "ce", duration: 0.28, begin: 13.500, index: 40 },
  { text: "re", duration: 0.28, begin: 13.750, index: 41 },
  { text: "ler", duration: 0.28, begin: 14.000, index: 42 },
  { text: " yay", duration: 0.28, begin: 14.500, index: 43 },
  { text: "gın", duration: 0.28, begin: 14.750, index: 44 },
  { text: "la", duration: 0.28, begin: 15.000, index: 45 },
  { text: "şın", duration: 0.28, begin: 15.250, index: 46 },
  { text: "ca", duration: 0.28, begin: 15.500, index: 47 },
  { text: " ah", duration: 0.28, begin: 16.500, index: 48 },
  { text: "şap", duration: 0.28, begin: 16.750, index: 49 },
  { text: " o", duration: 0.28, begin: 17.000, index: 50 },
  { text: "lan", duration: 0.28, begin: 17.250, index: 51 },
  { text: "la", duration: 0.28, begin: 17.500, index: 52 },
  { text: "ra", duration: 0.28, begin: 17.750, index: 53 },
  { text: " rağ", duration: 0.28, begin: 18.000, index: 54 },
  { text: "bet", duration: 0.28, begin: 18.250, index: 55 },
  { text: " a", duration: 0.28, begin: 18.500, index: 56 },
  { text: "zal", duration: 0.28, begin: 18.750, index: 57 },
  { text: "dı.", duration: 0.28, begin: 19.000, index: 58 },
  { text: " Bu", duration: 0.28, begin: 20.250, index: 59 },
  { text: " yüz", duration: 0.28, begin: 20.500, index: 60 },
  { text: "den", duration: 0.28, begin: 20.750, index: 61 },
  { text: " iş", duration: 0.28, begin: 21.000, index: 62 },
  { text: "ler", duration: 0.28, begin: 21.250, index: 63 },
  { text: " i", duration: 0.28, begin: 21.500, index: 64 },
  { text: "yi", duration: 0.28, begin: 21.750, index: 65 },
  { text: " git", duration: 0.28, begin: 22.000, index: 66 },
  { text: "mi", duration: 0.28, begin: 22.250, index: 67 },
  { text: "yor", duration: 0.28, begin: 22.500, index: 68 },
  { text: "du.", duration: 0.28, begin: 22.750, index: 69 },
  { text: " Üs", duration: 0.28, begin: 24.000, index: 70 },
  { text: "te", duration: 0.28, begin: 24.250, index: 71 },
  { text: "lik", duration: 0.28, begin: 24.500, index: 72 },
  { text: "de", duration: 0.28, begin: 24.750, index: 73 },
  { text: " ço", duration: 0.28, begin: 25.000, index: 74 },
  { text: "cuk", duration: 0.28, begin: 25.250, index: 75 },
  { text: "la", duration: 0.28, begin: 25.500, index: 76 },
  { text: "rı", duration: 0.28, begin: 25.750, index: 77 },
  { text: " bü", duration: 0.28, begin: 26.000, index: 78 },
  { text: "yü", duration: 0.28, begin: 26.250, index: 79 },
  { text: "müş,", duration: 0.28, begin: 26.500, index: 80 },
  { text: " bi", duration: 0.28, begin: 27.250, index: 81 },
  { text: "ri", duration: 0.28, begin: 27.500, index: 82 },
  { text: " ha", duration: 0.28, begin: 27.750, index: 83 },
  { text: "riç", duration: 0.28, begin: 28.000, index: 84 },
  { text: " o", duration: 0.28, begin: 28.250, index: 85 },
  { text: "ku", duration: 0.28, begin: 28.500, index: 86 },
  { text: "la", duration: 0.28, begin: 28.750, index: 87 },
  { text: " baş", duration: 0.28, begin: 29.000, index: 88 },
  { text: "la", duration: 0.28, begin: 29.250, index: 89 },
  { text: "mış", duration: 0.28, begin: 29.500, index: 90 },
  { text: "tı.", duration: 0.28, begin: 29.750, index: 91 },
  { text: " Mas", duration: 0.28, begin: 31.250, index: 92 },
  { text: "raf", duration: 0.28, begin: 31.500, index: 93 },
  { text: "la", duration: 0.28, begin: 31.750, index: 94 },
  { text: "rı", duration: 0.28, begin: 32.000, index: 95 },
  { text: " ar", duration: 0.28, begin: 32.250, index: 96 },
  { text: "tın", duration: 0.28, begin: 32.500, index: 97 },
  { text: "ca", duration: 0.28, begin: 32.750, index: 98 },
  { text: " ya", duration: 0.28, begin: 33.500, index: 99 },
  { text: "nın", duration: 0.28, begin: 33.750, index: 100 },
  { text: "da", duration: 0.28, begin: 34.000, index: 101 },
  { text: "ki", duration: 0.28, begin: 34.250, index: 102 },
  { text: " kal", duration: 0.28, begin: 34.500, index: 103 },
  { text: "fa", duration: 0.28, begin: 34.750, index: 104 },
  { text: "sı", duration: 0.28, begin: 35.000, index: 105 },
  { text: "na", duration: 0.28, begin: 35.250, index: 106 },
  { text: " yol", duration: 0.28, begin: 35.500, index: 107 },
  { text: " ver", duration: 0.28, begin: 35.750, index: 108 },
  { text: "di.", duration: 0.28, begin: 36.000, index: 109 },
  { text: " İ", duration: 0.28, begin: 37.250, index: 110 },
  { text: "şe", duration: 0.28, begin: 37.500, index: 111 },
  { text: " bi", duration: 0.28, begin: 37.750, index: 112 },
  { text: "raz", duration: 0.28, begin: 38.000, index: 113 },
  { text: " da", duration: 0.28, begin: 38.250, index: 114 },
  { text: "ha", duration: 0.28, begin: 38.500, index: 115 },
  { text: " er", duration: 0.28, begin: 38.750, index: 116 },
  { text: "ken", duration: 0.28, begin: 39.000, index: 117 },
  { text: " ko", duration: 0.28, begin: 39.250, index: 118 },
  { text: "yu", duration: 0.28, begin: 39.500, index: 119 },
  { text: "lur", duration: 0.28, begin: 39.750, index: 120 },
  { text: " yar", duration: 0.28, begin: 40.500, index: 121 },
  { text: "dım", duration: 0.28, begin: 40.750, index: 122 },
  { text: "cı", duration: 0.28, begin: 41.000, index: 123 },
  { text: "ya", duration: 0.28, begin: 41.250, index: 124 },
  { text: " a", duration: 0.28, begin: 41.500, index: 125 },
  { text: "yır", duration: 0.28, begin: 41.750, index: 126 },
  { text: "dı", duration: 0.28, begin: 42.000, index: 127 },
  { text: "ğı", duration: 0.28, begin: 42.250, index: 128 },
  { text: " pa", duration: 0.28, begin: 42.500, index: 129 },
  { text: "ra", duration: 0.28, begin: 42.750, index: 130 },
  { text: "yı", duration: 0.28, begin: 43.000, index: 131 },
  { text: " ço", duration: 0.28, begin: 43.750, index: 132 },
  { text: "cuk", duration: 0.28, begin: 44.000, index: 133 },
  { text: "la", duration: 0.28, begin: 44.250, index: 134 },
  { text: "rın", duration: 0.28, begin: 44.500, index: 135 },
  { text: " harç", duration: 0.28, begin: 45.000, index: 136 },
  { text: "lı", duration: 0.28, begin: 45.250, index: 137 },
  { text: "ğı", duration: 0.28, begin: 45.500, index: 138 },
  { text: "na", duration: 0.28, begin: 45.750, index: 139 },
  { text: " ka", duration: 0.28, begin: 46.000, index: 140 },
  { text: "tar", duration: 0.28, begin: 46.250, index: 141 },
  { text: "dı.", duration: 0.28, begin: 46.500, index: 142 },
  { text: " A", duration: 0.28, begin: 47.500, index: 143 },
  { text: "dam", duration: 0.28, begin: 47.750, index: 144 },
  { text: " bir", duration: 0.28, begin: 48.250, index: 145 },
  { text: " gün", duration: 0.28, begin: 48.500, index: 146 },
  { text: " ça", duration: 0.28, begin: 48.750, index: 147 },
  { text: "lı", duration: 0.28, begin: 49.000, index: 148 },
  { text: "şır", duration: 0.28, begin: 49.250, index: 149 },
  { text: "ken", duration: 0.28, begin: 49.500, index: 150 },
  { text: " e", duration: 0.28, begin: 50.000, index: 151 },
  { text: "lek", duration: 0.28, begin: 50.250, index: 152 },
  { text: "trik", duration: 0.28, begin: 50.500, index: 153 },
  { text: " ke", duration: 0.28, begin: 50.750, index: 154 },
  { text: "sil", duration: 0.28, begin: 51.000, index: 155 },
  { text: "di.", duration: 0.28, begin: 51.250, index: 156 },
  { text: " Ve", duration: 0.28, begin: 52.250, index: 157 },
  { text: " u", duration: 0.28, begin: 52.500, index: 158 },
  { text: "zun", duration: 0.28, begin: 52.750, index: 159 },
  { text: " sü", duration: 0.28, begin: 53.000, index: 160 },
  { text: "re", duration: 0.28, begin: 53.250, index: 161 },
  { text: " bek", duration: 0.28, begin: 53.500, index: 162 },
  { text: "le", duration: 0.28, begin: 53.750, index: 163 },
  { text: "di", duration: 0.28, begin: 54.000, index: 164 },
  { text: "ği", duration: 0.28, begin: 54.250, index: 165 },
  { text: " hal", duration: 0.28, begin: 54.500, index: 166 },
  { text: "de", duration: 0.28, begin: 54.750, index: 167 },
  { text: " gel", duration: 0.28, begin: 55.000, index: 168 },
  { text: "me", duration: 0.28, begin: 55.250, index: 169 },
  { text: "di.", duration: 0.28, begin: 55.500, index: 170 },
  { text: " Ak", duration: 0.28, begin: 56.750, index: 171 },
  { text: "si", duration: 0.28, begin: 57.000, index: 172 },
  { text: " gi", duration: 0.28, begin: 57.250, index: 173 },
  { text: "bi", duration: 0.28, begin: 57.500, index: 174 },
  { text: " o", duration: 0.28, begin: 57.750, index: 175 },
  { text: " ak", duration: 0.28, begin: 58.000, index: 176 },
  { text: "şam", duration: 0.28, begin: 58.250, index: 177 },
  { text: " ü", duration: 0.28, begin: 58.500, index: 178 },
  { text: "ze", duration: 0.28, begin: 58.750, index: 179 },
  { text: "ri", duration: 0.28, begin: 59.000, index: 180 },
  { text: " tes", duration: 0.28, begin: 59.500, index: 181 },
  { text: "lim", duration: 0.28, begin: 59.750, index: 182 },
  { text: " et", duration: 0.28, begin: 60.000, index: 183 },
  { text: "me", duration: 0.28, begin: 60.250, index: 184 },
  { text: "si", duration: 0.28, begin: 60.500, index: 185 },
  { text: " ge", duration: 0.28, begin: 61.000, index: 186 },
  { text: "re", duration: 0.28, begin: 61.250, index: 187 },
  { text: "ken", duration: 0.28, begin: 61.500, index: 188 },
  { text: " bir", duration: 0.28, begin: 61.750, index: 189 },
  { text: " kaç", duration: 0.28, begin: 62.000, index: 190 },
  { text: " pen", duration: 0.28, begin: 62.250, index: 191 },
  { text: "ce", duration: 0.28, begin: 62.500, index: 192 },
  { text: "re", duration: 0.28, begin: 62.750, index: 193 },
  { text: " var", duration: 0.28, begin: 63.000, index: 194 },
  { text: "dı.", duration: 0.28, begin: 63.250, index: 195 },
  { text: " Boş", duration: 0.28, begin: 64.750, index: 196 },
  { text: " kal", duration: 0.28, begin: 65.000, index: 197 },
  { text: "ma", duration: 0.28, begin: 65.250, index: 198 },
  { text: "yı", duration: 0.28, begin: 65.500, index: 199 },
  { text: " sev", duration: 0.28, begin: 65.750, index: 200 },
  { text: "mez", duration: 0.28, begin: 66.000, index: 201 },
  { text: "di.", duration: 0.28, begin: 66.250, index: 202 },
  { text: " Plan", duration: 0.28, begin: 67.500, index: 203 },
  { text: "ya", duration: 0.28, begin: 67.750, index: 204 },
  { text: "yı", duration: 0.28, begin: 68.000, index: 205 },
  { text: " yağ", duration: 0.28, begin: 68.250, index: 206 },
  { text: "la", duration: 0.28, begin: 68.500, index: 207 },
  { text: "dı", duration: 0.28, begin: 68.750, index: 208 },
  { text: " ta", duration: 0.28, begin: 69.750, index: 209 },
  { text: "laş", duration: 0.28, begin: 70.000, index: 210 },
  { text: "la", duration: 0.28, begin: 70.250, index: 211 },
  { text: "rı", duration: 0.28, begin: 70.500, index: 212 },
  { text: " sü", duration: 0.28, begin: 70.750, index: 213 },
  { text: "pür", duration: 0.28, begin: 71.000, index: 214 },
  { text: "dü.", duration: 0.28, begin: 71.250, index: 215 },
  { text: " Bi", duration: 0.28, begin: 72.250, index: 216 },
  { text: "raz", duration: 0.28, begin: 72.500, index: 217 },
  { text: " din", duration: 0.28, begin: 72.750, index: 218 },
  { text: "len", duration: 0.28, begin: 73.000, index: 219 },
  { text: "mek", duration: 0.28, begin: 73.250, index: 220 },
  { text: " i", duration: 0.28, begin: 73.750, index: 221 },
  { text: "çin", duration: 0.28, begin: 74.000, index: 222 },
  { text: " e", duration: 0.28, begin: 74.750, index: 223 },
  { text: "ve", duration: 0.28, begin: 75.000, index: 224 },
  { text: " çı", duration: 0.28, begin: 75.250, index: 225 },
  { text: "kar", duration: 0.28, begin: 75.500, index: 226 },
  { text: "ken", duration: 0.28, begin: 75.750, index: 227 },
  { text: " si", duration: 0.28, begin: 76.250, index: 228 },
  { text: "gor", duration: 0.28, begin: 76.500, index: 229 },
  { text: "ta", duration: 0.28, begin: 76.750, index: 230 },
  { text: "ya", duration: 0.28, begin: 77.000, index: 231 },
  { text: " göz", duration: 0.28, begin: 77.250, index: 232 },
  { text: " at", duration: 0.28, begin: 77.500, index: 233 },
  { text: "tı.", duration: 0.28, begin: 77.750, index: 234 },
  { text: " E", duration: 0.28, begin: 79.000, index: 235 },
  { text: "ğer", duration: 0.28, begin: 79.250, index: 236 },
  { text: " ya", duration: 0.28, begin: 79.500, index: 237 },
  { text: "nıl", duration: 0.28, begin: 79.750, index: 238 },
  { text: "mı", duration: 0.28, begin: 80.000, index: 239 },
  { text: "yor", duration: 0.28, begin: 80.250, index: 240 },
  { text: "sa", duration: 0.28, begin: 80.500, index: 241 },
  { text: " bu", duration: 0.28, begin: 80.750, index: 242 },
  { text: " iş", duration: 0.28, begin: 81.000, index: 243 },
  { text: " nor", duration: 0.28, begin: 81.250, index: 244 },
  { text: "mal", duration: 0.28, begin: 81.750, index: 245 },
  { text: " de", duration: 0.28, begin: 82.000, index: 246 },
  { text: "ğil", duration: 0.28, begin: 82.250, index: 247 },
  { text: "di.", duration: 0.28, begin: 82.500, index: 248 },
  { text: " Bi", duration: 0.28, begin: 83.750, index: 249 },
  { text: "ri", duration: 0.28, begin: 84.000, index: 250 },
  { text: " ge", duration: 0.28, begin: 84.250, index: 251 },
  { text: "lip", duration: 0.28, begin: 84.500, index: 252 },
  { text: " si", duration: 0.28, begin: 85.000, index: 253 },
  { text: "gor", duration: 0.28, begin: 85.250, index: 254 },
  { text: "ta", duration: 0.28, begin: 85.500, index: 255 },
  { text: "yı", duration: 0.28, begin: 85.750, index: 256 },
  { text: " ka", duration: 0.28, begin: 86.250, index: 257 },
  { text: "pat", duration: 0.28, begin: 86.500, index: 258 },
  { text: "mış", duration: 0.28, begin: 86.750, index: 259 },
  { text: " ol", duration: 0.28, begin: 87.000, index: 260 },
  { text: "ma", duration: 0.28, begin: 87.250, index: 261 },
  { text: "lıy", duration: 0.28, begin: 87.500, index: 262 },
  { text: "dı.", duration: 0.28, begin: 87.750, index: 263 },
  { text: " Şal", duration: 0.28, begin: 88.750, index: 264 },
  { text: "te", duration: 0.28, begin: 89.000, index: 265 },
  { text: "ri", duration: 0.28, begin: 89.250, index: 266 },
  { text: " kal", duration: 0.28, begin: 89.500, index: 267 },
  { text: "dı", duration: 0.28, begin: 89.750, index: 268 },
  { text: "rın", duration: 0.28, begin: 90.000, index: 269 },
  { text: "ca", duration: 0.28, begin: 90.250, index: 270 },
  { text: " a", duration: 0.28, begin: 90.750, index: 271 },
  { text: "töl", duration: 0.28, begin: 91.000, index: 272 },
  { text: "ye", duration: 0.28, begin: 91.250, index: 273 },
  { text: " ay", duration: 0.28, begin: 91.750, index: 274 },
  { text: "dın", duration: 0.28, begin: 92.000, index: 275 },
  { text: "lan", duration: 0.28, begin: 92.250, index: 276 },
  { text: "dı.", duration: 0.28, begin: 92.500, index: 277 },
  { text: " Tah", duration: 0.28, begin: 93.750, index: 278 },
  { text: "min", duration: 0.28, begin: 94.000, index: 279 },
  { text: "le", duration: 0.28, begin: 94.250, index: 280 },
  { text: "ri", duration: 0.28, begin: 94.500, index: 281 },
  { text: " doğ", duration: 0.28, begin: 94.750, index: 282 },
  { text: "ru", duration: 0.28, begin: 95.000, index: 283 },
  { text: " çık", duration: 0.28, begin: 95.250, index: 284 },
  { text: "mış", duration: 0.28, begin: 95.500, index: 285 },
  { text: "tı", duration: 0.28, begin: 95.750, index: 286 },
  { text: " a", duration: 0.28, begin: 96.750, index: 287 },
  { text: "ma", duration: 0.28, begin: 97.000, index: 288 },
  { text: " bu", duration: 0.28, begin: 97.250, index: 289 },
  { text: " i", duration: 0.28, begin: 97.500, index: 290 },
  { text: "şe", duration: 0.28, begin: 97.750, index: 291 },
  { text: " bir", duration: 0.28, begin: 98.000, index: 292 },
  { text: " an", duration: 0.28, begin: 98.250, index: 293 },
  { text: "lam", duration: 0.28, begin: 98.500, index: 294 },
  { text: " ve", duration: 0.28, begin: 99.000, index: 295 },
  { text: "re", duration: 0.28, begin: 99.250, index: 296 },
  { text: "mi", duration: 0.28, begin: 99.500, index: 297 },
  { text: "yor", duration: 0.28, begin: 99.750, index: 298 },
  { text: "du.", duration: 0.28, begin: 100.000, index: 299 },
  { text: " Şa", duration: 0.28, begin: 101.250, index: 300 },
  { text: "ka", duration: 0.28, begin: 101.500, index: 301 },
  { text: " de", duration: 0.28, begin: 101.750, index: 302 },
  { text: "se", duration: 0.28, begin: 102.000, index: 303 },
  { text: " böy", duration: 0.28, begin: 102.750, index: 304 },
  { text: "le", duration: 0.28, begin: 103.000, index: 305 },
  { text: " bir", duration: 0.28, begin: 103.250, index: 306 },
  { text: " şa", duration: 0.28, begin: 103.500, index: 307 },
  { text: "ka", duration: 0.28, begin: 103.750, index: 308 },
  { text: " ya", duration: 0.28, begin: 104.250, index: 309 },
  { text: "pıl", duration: 0.28, begin: 104.500, index: 310 },
  { text: "maz", duration: 0.28, begin: 104.750, index: 311 },
  { text: "dı.", duration: 0.28, begin: 105.000, index: 312 },
  { text: " Ken", duration: 0.28, begin: 106.250, index: 313 },
  { text: "di", duration: 0.28, begin: 106.500, index: 314 },
  { text: "si", duration: 0.28, begin: 106.750, index: 315 },
  { text: "ni", duration: 0.28, begin: 107.000, index: 316 },
  { text: " kıs", duration: 0.28, begin: 107.250, index: 317 },
  { text: "ka", duration: 0.28, begin: 107.500, index: 318 },
  { text: "na", duration: 0.28, begin: 107.750, index: 319 },
  { text: "cak", duration: 0.28, begin: 108.000, index: 320 },
  { text: " bir", duration: 0.28, begin: 108.250, index: 321 },
  { text: " düş", duration: 0.28, begin: 108.500, index: 322 },
  { text: "ma", duration: 0.28, begin: 108.750, index: 323 },
  { text: "nı", duration: 0.28, begin: 109.000, index: 324 },
  { text: "da", duration: 0.28, begin: 109.250, index: 325 },
  { text: " yok", duration: 0.28, begin: 109.500, index: 326 },
  { text: "tu.", duration: 0.28, begin: 109.750, index: 327 },
  { text: " İ", duration: 0.28, begin: 111.250, index: 328 },
  { text: "şe", duration: 0.28, begin: 111.500, index: 329 },
  { text: " ko", duration: 0.28, begin: 111.750, index: 330 },
  { text: "yul", duration: 0.28, begin: 112.000, index: 331 },
  { text: "du", duration: 0.28, begin: 112.250, index: 332 },
  { text: "ğun", duration: 0.28, begin: 112.500, index: 333 },
  { text: "da", duration: 0.28, begin: 112.750, index: 334 },
  { text: " yi", duration: 0.28, begin: 113.500, index: 335 },
  { text: "ne", duration: 0.28, begin: 113.750, index: 336 },
  { text: " ay", duration: 0.28, begin: 114.000, index: 337 },
  { text: "nı", duration: 0.28, begin: 114.250, index: 338 },
  { text: " şey", duration: 0.28, begin: 114.500, index: 339 },
  { text: " ol", duration: 0.28, begin: 114.750, index: 340 },
  { text: "du.", duration: 0.28, begin: 115.000, index: 341 },
  { text: " A", duration: 0.28, begin: 115.750, index: 342 },
  { text: "ma", duration: 0.28, begin: 116.000, index: 343 },
  { text: " bu", duration: 0.28, begin: 116.250, index: 344 },
  { text: " se", duration: 0.28, begin: 116.500, index: 345 },
  { text: "fer", duration: 0.28, begin: 116.750, index: 346 },
  { text: " suç", duration: 0.28, begin: 117.000, index: 347 },
  { text: "lu", duration: 0.28, begin: 117.250, index: 348 },
  { text: "yu", duration: 0.28, begin: 117.500, index: 349 },
  { text: " gör", duration: 0.28, begin: 117.750, index: 350 },
  { text: "müş", duration: 0.28, begin: 118.000, index: 351 },
  { text: "tü.", duration: 0.28, begin: 118.250, index: 352 },
  { text: " Oğ", duration: 0.28, begin: 119.500, index: 353 },
  { text: "lu", duration: 0.28, begin: 119.750, index: 354 },
  { text: " ev", duration: 0.28, begin: 120.250, index: 355 },
  { text: "den", duration: 0.28, begin: 120.500, index: 356 },
  { text: " a", duration: 0.28, begin: 121.000, index: 357 },
  { text: "töl", duration: 0.28, begin: 121.250, index: 358 },
  { text: "ye", duration: 0.28, begin: 121.500, index: 359 },
  { text: "ye", duration: 0.28, begin: 121.750, index: 360 },
  { text: " bağ", duration: 0.28, begin: 122.000, index: 361 },
  { text: "la", duration: 0.28, begin: 122.250, index: 362 },
  { text: "nan", duration: 0.28, begin: 122.500, index: 363 },
  { text: " mer", duration: 0.28, begin: 122.750, index: 364 },
  { text: "di", duration: 0.28, begin: 123.000, index: 365 },
  { text: "ve", duration: 0.28, begin: 123.250, index: 366 },
  { text: "ni", duration: 0.28, begin: 123.500, index: 367 },
  { text: " ses", duration: 0.28, begin: 124.500, index: 368 },
  { text: "siz", duration: 0.28, begin: 124.750, index: 369 },
  { text: "ce", duration: 0.28, begin: 125.000, index: 370 },
  { text: " in", duration: 0.28, begin: 125.250, index: 371 },
  { text: "miş", duration: 0.28, begin: 125.500, index: 372 },
  { text: " ve", duration: 0.28, begin: 126.000, index: 373 },
  { text: " si", duration: 0.28, begin: 127.000, index: 374 },
  { text: "gor", duration: 0.28, begin: 127.250, index: 375 },
  { text: "ta", duration: 0.28, begin: 127.500, index: 376 },
  { text: "yı", duration: 0.28, begin: 127.750, index: 377 },
  { text: " ka", duration: 0.28, begin: 128.000, index: 378 },
  { text: "pat", duration: 0.28, begin: 128.250, index: 379 },
  { text: "tı", duration: 0.28, begin: 128.500, index: 380 },
  { text: "ğı", duration: 0.28, begin: 128.750, index: 381 },
  { text: " sı", duration: 0.28, begin: 129.000, index: 382 },
  { text: "ra", duration: 0.28, begin: 129.250, index: 383 },
  { text: "da", duration: 0.28, begin: 129.500, index: 384 },
  { text: " ba", duration: 0.28, begin: 130.250, index: 385 },
  { text: "ba", duration: 0.28, begin: 130.500, index: 386 },
  { text: "sı", duration: 0.28, begin: 130.750, index: 387 },
  { text: "nı", duration: 0.28, begin: 131.000, index: 388 },
  { text: " kar", duration: 0.28, begin: 131.250, index: 389 },
  { text: "şı", duration: 0.28, begin: 131.500, index: 390 },
  { text: "sın", duration: 0.28, begin: 131.750, index: 391 },
  { text: "da", duration: 0.28, begin: 132.000, index: 392 },
  { text: " bul", duration: 0.28, begin: 132.250, index: 393 },
  { text: "muş", duration: 0.28, begin: 132.500, index: 394 },
  { text: "tu.", duration: 0.28, begin: 132.750, index: 395 },
  { text: " A", duration: 0.28, begin: 134.250, index: 396 },
  { text: "dam", duration: 0.28, begin: 134.500, index: 397 },
  { text: " on", duration: 0.28, begin: 134.750, index: 398 },
  { text: " ya", duration: 0.28, begin: 135.000, index: 399 },
  { text: "şı", duration: 0.28, begin: 135.250, index: 400 },
  { text: "na", duration: 0.28, begin: 135.500, index: 401 },
  { text: " gel", duration: 0.28, begin: 135.750, index: 402 },
  { text: "miş", duration: 0.28, begin: 136.000, index: 403 },
  { text: " bir", duration: 0.28, begin: 136.250, index: 404 },
  { text: " ço", duration: 0.28, begin: 136.500, index: 405 },
  { text: "cu", duration: 0.28, begin: 136.750, index: 406 },
  { text: "ğun", duration: 0.28, begin: 137.000, index: 407 },
  { text: " böy", duration: 0.28, begin: 138.000, index: 408 },
  { text: "le", duration: 0.28, begin: 138.250, index: 409 },
  { text: " bir", duration: 0.28, begin: 138.500, index: 410 },
  { text: " hay", duration: 0.28, begin: 138.750, index: 411 },
  { text: "laz", duration: 0.28, begin: 139.000, index: 412 },
  { text: "lı", duration: 0.28, begin: 139.250, index: 413 },
  { text: "ğı", duration: 0.28, begin: 139.500, index: 414 },
  { text: "nı", duration: 0.28, begin: 139.750, index: 415 },
  { text: " af", duration: 0.28, begin: 140.250, index: 416 },
  { text: "fe", duration: 0.28, begin: 140.500, index: 417 },
  { text: "de", duration: 0.28, begin: 140.750, index: 418 },
  { text: "mez", duration: 0.28, begin: 141.000, index: 419 },
  { text: "di.", duration: 0.28, begin: 141.250, index: 420 },
  { text: " Bü", duration: 0.28, begin: 142.500, index: 421 },
  { text: "tün", duration: 0.28, begin: 142.750, index: 422 },
  { text: " gü", duration: 0.28, begin: 143.000, index: 423 },
  { text: "nü", duration: 0.28, begin: 143.250, index: 424 },
  { text: " o", duration: 0.28, begin: 143.500, index: 425 },
  { text: "nun", duration: 0.28, begin: 143.750, index: 426 },
  { text: " yü", duration: 0.28, begin: 144.250, index: 427 },
  { text: "zün", duration: 0.28, begin: 144.500, index: 428 },
  { text: "den", duration: 0.28, begin: 144.750, index: 429 },
  { text: " mahv", duration: 0.28, begin: 145.000, index: 430 },
  { text: " ol", duration: 0.28, begin: 145.250, index: 431 },
  { text: "muş", duration: 0.28, begin: 145.500, index: 432 },
  { text: "tu.", duration: 0.28, begin: 145.750, index: 433 },
  { text: " Bir", duration: 0.28, begin: 147.250, index: 434 },
  { text: " ke", duration: 0.28, begin: 147.500, index: 435 },
  { text: "re", duration: 0.28, begin: 147.750, index: 436 },
  { text: " yap", duration: 0.28, begin: 148.000, index: 437 },
  { text: "mış", duration: 0.28, begin: 148.250, index: 438 },
  { text: " ol", duration: 0.28, begin: 148.500, index: 439 },
  { text: "sa", duration: 0.28, begin: 148.750, index: 440 },
  { text: " ses", duration: 0.28, begin: 149.250, index: 441 },
  { text: " çı", duration: 0.28, begin: 149.500, index: 442 },
  { text: "kart", duration: 0.28, begin: 149.750, index: 443 },
  { text: "maz", duration: 0.28, begin: 150.000, index: 444 },
  { text: "dı.", duration: 0.28, begin: 150.250, index: 445 },
  { text: " A", duration: 0.28, begin: 151.500, index: 446 },
  { text: "ma", duration: 0.28, begin: 151.750, index: 447 },
  { text: " tek", duration: 0.28, begin: 152.000, index: 448 },
  { text: "rar", duration: 0.28, begin: 152.250, index: 449 },
  { text: "la", duration: 0.28, begin: 152.500, index: 450 },
  { text: "ma", duration: 0.28, begin: 152.750, index: 451 },
  { text: "sı", duration: 0.28, begin: 153.000, index: 452 },
  { text: " han", duration: 0.28, begin: 154.000, index: 453 },
  { text: "gi", duration: 0.28, begin: 154.250, index: 454 },
  { text: " yön", duration: 0.28, begin: 154.500, index: 455 },
  { text: "den", duration: 0.28, begin: 154.750, index: 456 },
  { text: " ba", duration: 0.28, begin: 155.250, index: 457 },
  { text: "kı", duration: 0.28, begin: 155.500, index: 458 },
  { text: "lır", duration: 0.28, begin: 155.750, index: 459 },
  { text: "sa", duration: 0.28, begin: 156.000, index: 460 },
  { text: " ba", duration: 0.28, begin: 156.250, index: 461 },
  { text: "kıl", duration: 0.28, begin: 156.500, index: 462 },
  { text: "sın", duration: 0.28, begin: 156.750, index: 463 },
  { text: " bü", duration: 0.28, begin: 157.500, index: 464 },
  { text: "yük", duration: 0.28, begin: 157.750, index: 465 },
  { text: " ha", duration: 0.28, begin: 158.000, index: 466 },
  { text: "tay", duration: 0.28, begin: 158.250, index: 467 },
  { text: "dı.", duration: 0.28, begin: 158.500, index: 468 },
  { text: " Saç", duration: 0.28, begin: 159.750, index: 469 },
  { text: "la", duration: 0.28, begin: 160.000, index: 470 },
  { text: "rın", duration: 0.28, begin: 160.250, index: 471 },
  { text: "dan", duration: 0.28, begin: 160.500, index: 472 },
  { text: " ya", duration: 0.28, begin: 160.750, index: 473 },
  { text: "ka", duration: 0.28, begin: 161.000, index: 474 },
  { text: "la", duration: 0.28, begin: 161.250, index: 475 },
  { text: "yıp", duration: 0.28, begin: 161.500, index: 476 },
  { text: " sı", duration: 0.28, begin: 162.250, index: 477 },
  { text: "kı", duration: 0.28, begin: 162.500, index: 478 },
  { text: " bir", duration: 0.28, begin: 162.750, index: 479 },
  { text: " to", duration: 0.28, begin: 163.250, index: 480 },
  { text: "kat", duration: 0.28, begin: 163.500, index: 481 },
  { text: " at", duration: 0.28, begin: 163.750, index: 482 },
  { text: "tı.", duration: 0.28, begin: 164.000, index: 483 },
  { text: " Her", duration: 0.28, begin: 165.250, index: 484 },
  { text: " şey", duration: 0.28, begin: 165.500, index: 485 },
  { text: " o", duration: 0.28, begin: 166.000, index: 486 },
  { text: "nun", duration: 0.28, begin: 166.250, index: 487 },
  { text: " i", duration: 0.28, begin: 166.500, index: 488 },
  { text: "yi", duration: 0.28, begin: 166.750, index: 489 },
  { text: "li", duration: 0.28, begin: 167.000, index: 490 },
  { text: "ği", duration: 0.28, begin: 167.250, index: 491 },
  { text: " i", duration: 0.28, begin: 167.500, index: 492 },
  { text: "çin", duration: 0.28, begin: 167.750, index: 493 },
  { text: " di.", duration: 0.28, begin: 168.000, index: 494 },
  { text: " Bel", duration: 0.28, begin: 169.000, index: 495 },
  { text: "ki", duration: 0.28, begin: 169.250, index: 496 },
  { text: " vur", duration: 0.28, begin: 169.500, index: 497 },
  { text: "du", duration: 0.28, begin: 169.750, index: 498 },
  { text: "ğu", duration: 0.28, begin: 170.000, index: 499 },
  { text: " to", duration: 0.28, begin: 170.250, index: 500 },
  { text: "kat", duration: 0.28, begin: 170.500, index: 501 },
  { text: " ser", duration: 0.28, begin: 171.500, index: 502 },
  { text: "seri", duration: 0.28, begin: 171.750, index: 503 },
  { text: " ol", duration: 0.28, begin: 172.000, index: 504 },
  { text: "ma", duration: 0.28, begin: 172.250, index: 505 },
  { text: "sı", duration: 0.28, begin: 172.500, index: 506 },
  { text: "nı", duration: 0.28, begin: 172.750, index: 507 },
  { text: " en", duration: 0.28, begin: 173.250, index: 508 },
  { text: "gel", duration: 0.28, begin: 173.500, index: 509 },
  { text: "ler", duration: 0.28, begin: 173.750, index: 510 },
  { text: "di.", duration: 0.28, begin: 174.000, index: 511 },
  { text: " A", duration: 0.28, begin: 175.750, index: 512 },
  { text: "dam", duration: 0.28, begin: 176.000, index: 513 },
  { text: " oğ", duration: 0.28, begin: 176.250, index: 514 },
  { text: "lu", duration: 0.28, begin: 176.500, index: 515 },
  { text: "nun", duration: 0.28, begin: 176.750, index: 516 },
  { text: " göz", duration: 0.28, begin: 177.000, index: 517 },
  { text: " yaş", duration: 0.38, begin: 177.250, index: 518 },
  { text: "la", duration: 0.38, begin: 177.500, index: 519 },
  { text: "rı", duration: 0.38, begin: 177.750, index: 520 },
  { text: "nı", duration: 0.38, begin: 178.000, index: 521 },
  { text: " gör", duration: 0.38, begin: 178.250, index: 522 },
  { text: "mez", duration: 0.38, begin: 178.500, index: 523 },
  { text: "den", duration: 0.38, begin: 178.750, index: 524 },
  { text: " gel", duration: 0.38, begin: 179.000, index: 525 },
  { text: "di", duration: 0.38, begin: 179.250, index: 526 },
  { text: " ve", duration: 0.38, begin: 180.000, index: 527 },
  { text: " e", duration: 0.28, begin: 180.750, index: 528 },
  { text: "ve", duration: 0.28, begin: 181.000, index: 529 },
  { text: " çık", duration: 0.28, begin: 181.500, index: 530 },
  { text: "tık", duration: 0.28, begin: 181.750, index: 531 },
  { text: "tan", duration: 0.28, begin: 182.000, index: 532 },
  { text: " son", duration: 0.28, begin: 182.500, index: 533 },
  { text: "ra", duration: 0.28, begin: 182.750, index: 534 },
  { text: " e", duration: 0.28, begin: 183.750, index: 535 },
  { text: "şi", duration: 0.28, begin: 184.000, index: 536 },
  { text: " ne", duration: 0.28, begin: 184.250, index: 537 },
  { text: " dert", duration: 0.28, begin: 184.500, index: 538 },
  { text: " ya", duration: 0.28, begin: 184.750, index: 539 },
  { text: "na", duration: 0.28, begin: 185.000, index: 540 },
  { text: "rak:", duration: 0.28, begin: 185.250, index: 541 },
  { text: " \"Bu", duration: 0.28, begin: 186.500, index: 542 },
  { text: " ço", duration: 0.28, begin: 186.750, index: 543 },
  { text: "cu", duration: 0.28, begin: 187.000, index: 544 },
  { text: "ğun", duration: 0.28, begin: 187.250, index: 545 },
  { text: " o", duration: 0.28, begin: 187.500, index: 546 },
  { text: "kul", duration: 0.28, begin: 187.750, index: 547 },
  { text: "da", duration: 0.28, begin: 188.000, index: 548 },
  { text: " kim", duration: 0.28, begin: 188.250, index: 549 },
  { text: "ler", duration: 0.28, begin: 188.500, index: 550 },
  { text: "le", duration: 0.28, begin: 188.750, index: 551 },
  { text: " dü", duration: 0.28, begin: 189.250, index: 552 },
  { text: "şüp", duration: 0.28, begin: 189.500, index: 553 },
  { text: " kalk", duration: 0.28, begin: 190.000, index: 554 },
  { text: "tı", duration: 0.28, begin: 190.250, index: 555 },
  { text: "ğı", duration: 0.28, begin: 190.500, index: 556 },
  { text: "nı", duration: 0.28, begin: 190.750, index: 557 },
  { text: " bil", duration: 0.28, begin: 191.500, index: 558 },
  { text: "me", duration: 0.28, begin: 191.750, index: 559 },
  { text: "miz", duration: 0.28, begin: 192.000, index: 560 },
  { text: " la", duration: 0.28, begin: 192.250, index: 561 },
  { text: "zım!\"", duration: 0.28, begin: 192.500, index: 562 },
  { text: " de", duration: 0.28, begin: 193.000, index: 563 },
  { text: "di.", duration: 0.28, begin: 193.250, index: 564 },
  { text: " \"E", duration: 0.28, begin: 194.250, index: 565 },
  { text: "ğer", duration: 0.28, begin: 194.500, index: 566 },
  { text: " ser", duration: 0.28, begin: 194.750, index: 567 },
  { text: "best", duration: 0.28, begin: 195.000, index: 568 },
  { text: " bı", duration: 0.28, begin: 195.500, index: 569 },
  { text: "ra", duration: 0.28, begin: 195.750, index: 570 },
  { text: "kır", duration: 0.28, begin: 196.000, index: 571 },
  { text: "sak", duration: 0.28, begin: 196.250, index: 572 },
  { text: " ba", duration: 0.28, begin: 197.250, index: 573 },
  { text: "şı", duration: 0.28, begin: 197.500, index: 574 },
  { text: "mı", duration: 0.28, begin: 197.750, index: 575 },
  { text: "za", duration: 0.28, begin: 198.000, index: 576 },
  { text: " bü", duration: 0.28, begin: 198.250, index: 577 },
  { text: "yük", duration: 0.28, begin: 198.500, index: 578 },
  { text: " dert", duration: 0.28, begin: 198.750, index: 579 },
  { text: "ler", duration: 0.28, begin: 199.000, index: 580 },
  { text: " a", duration: 0.28, begin: 199.500, index: 581 },
  { text: "ça", duration: 0.28, begin: 199.750, index: 582 },
  { text: "cak!\"", duration: 0.28, begin: 200.000, index: 583 },
  { text: " A", duration: 0.28, begin: 201.250, index: 584 },
  { text: "dam", duration: 0.28, begin: 201.500, index: 585 },
  { text: " bir", duration: 0.28, begin: 201.750, index: 586 },
  { text: " sü", duration: 0.28, begin: 202.000, index: 587 },
  { text: "re", duration: 0.28, begin: 202.250, index: 588 },
  { text: " dü", duration: 0.28, begin: 202.750, index: 589 },
  { text: "şün", duration: 0.28, begin: 203.000, index: 590 },
  { text: "dü.", duration: 0.28, begin: 203.250, index: 591 },
  { text: " So", duration: 0.28, begin: 204.250, index: 592 },
  { text: "nun", duration: 0.28, begin: 204.500, index: 593 },
  { text: "da", duration: 0.28, begin: 204.750, index: 594 },
  { text: " da", duration: 0.28, begin: 205.000, index: 595 },
  { text: " en", duration: 0.28, begin: 205.250, index: 596 },
  { text: " ko", duration: 0.28, begin: 205.500, index: 597 },
  { text: "lay", duration: 0.28, begin: 205.750, index: 598 },
  { text: " yo", duration: 0.28, begin: 206.000, index: 599 },
  { text: "lu", duration: 0.28, begin: 206.250, index: 600 },
  { text: " bul", duration: 0.28, begin: 206.500, index: 601 },
  { text: "du.", duration: 0.28, begin: 206.750, index: 602 },
  { text: " Oğ", duration: 0.28, begin: 208.000, index: 603 },
  { text: "lu", duration: 0.28, begin: 208.250, index: 604 },
  { text: "nun", duration: 0.28, begin: 208.500, index: 605 },
  { text: " hiç", duration: 0.28, begin: 209.250, index: 606 },
  { text: " ak", duration: 0.28, begin: 209.500, index: 607 },
  { text: "sat", duration: 0.28, begin: 209.750, index: 608 },
  { text: "ma", duration: 0.28, begin: 210.000, index: 609 },
  { text: "dan", duration: 0.28, begin: 210.250, index: 610 },
  { text: " tut", duration: 0.28, begin: 210.750, index: 611 },
  { text: "tu", duration: 0.28, begin: 211.000, index: 612 },
  { text: "ğu", duration: 0.28, begin: 211.250, index: 613 },
  { text: " gün", duration: 0.28, begin: 211.750, index: 614 },
  { text: "lü", duration: 0.28, begin: 212.000, index: 615 },
  { text: "ğün", duration: 0.28, begin: 212.250, index: 616 },
  { text: "de", duration: 0.28, begin: 212.500, index: 617 },
  { text: " ar", duration: 0.28, begin: 213.250, index: 618 },
  { text: "ka", duration: 0.28, begin: 213.500, index: 619 },
  { text: "daş", duration: 0.28, begin: 213.750, index: 620 },
  { text: "la", duration: 0.28, begin: 214.000, index: 621 },
  { text: "rı", duration: 0.28, begin: 214.250, index: 622 },
  { text: "na", duration: 0.28, begin: 214.500, index: 623 },
  { text: " a", duration: 0.28, begin: 214.750, index: 624 },
  { text: "it", duration: 0.28, begin: 215.000, index: 625 },
  { text: " ip", duration: 0.28, begin: 215.500, index: 626 },
  { text: "u", duration: 0.28, begin: 215.750, index: 627 },
  { text: "cu", duration: 0.28, begin: 216.000, index: 628 },
  { text: " ol", duration: 0.28, begin: 216.250, index: 629 },
  { text: "ma", duration: 0.28, begin: 216.500, index: 630 },
  { text: "lıy", duration: 0.28, begin: 216.750, index: 631 },
  { text: "dı.", duration: 0.28, begin: 217.000, index: 632 },
  { text: " E", duration: 0.28, begin: 218.250, index: 633 },
  { text: "şi", duration: 0.28, begin: 218.500, index: 634 },
  { text: " is", duration: 0.28, begin: 218.750, index: 635 },
  { text: "te", duration: 0.28, begin: 219.000, index: 636 },
  { text: "me", duration: 0.28, begin: 219.250, index: 637 },
  { text: "se", duration: 0.28, begin: 219.500, index: 638 },
  { text: "de", duration: 0.28, begin: 219.750, index: 639 },
  { text: " o", duration: 0.28, begin: 220.250, index: 640 },
  { text: "na", duration: 0.28, begin: 220.500, index: 641 },
  { text: " ku", duration: 0.28, begin: 220.750, index: 642 },
  { text: "lak", duration: 0.28, begin: 221.000, index: 643 },
  { text: " as", duration: 0.28, begin: 221.250, index: 644 },
  { text: "ma", duration: 0.28, begin: 221.500, index: 645 },
  { text: "dı", duration: 0.28, begin: 221.750, index: 646 },
  { text: " ve", duration: 0.28, begin: 222.000, index: 647 },
  { text: " ço", duration: 0.28, begin: 223.000, index: 648 },
  { text: "cu", duration: 0.28, begin: 223.250, index: 649 },
  { text: "ğun", duration: 0.28, begin: 223.500, index: 650 },
  { text: " gün", duration: 0.28, begin: 223.750, index: 651 },
  { text: "lü", duration: 0.28, begin: 224.000, index: 652 },
  { text: "ğü", duration: 0.28, begin: 224.250, index: 653 },
  { text: "nü", duration: 0.28, begin: 224.500, index: 654 },
  { text: " o", duration: 0.28, begin: 224.750, index: 655 },
  { text: "ku", duration: 0.28, begin: 225.000, index: 656 },
  { text: "ma", duration: 0.28, begin: 225.250, index: 657 },
  { text: "ya", duration: 0.28, begin: 225.500, index: 658 },
  { text: " baş", duration: 0.28, begin: 225.750, index: 659 },
  { text: "la", duration: 0.28, begin: 226.000, index: 660 },
  { text: "dı.", duration: 0.28, begin: 226.250, index: 661 },
  { text: " Oğ", duration: 0.28, begin: 227.250, index: 662 },
  { text: "lu", duration: 0.38, begin: 227.500, index: 663 },
  { text: " en", duration: 0.38, begin: 228.250, index: 664 },
  { text: " son", duration: 0.38, begin: 228.500, index: 665 },
  { text: " say", duration: 0.38, begin: 228.750, index: 666 },
  { text: "fa", duration: 0.38, begin: 229.000, index: 667 },
  { text: "da", duration: 0.38, begin: 229.250, index: 668 },
  { text: " şöy", duration: 0.38, begin: 229.500, index: 669 },
  { text: "le", duration: 0.38, begin: 229.750, index: 670 },
  { text: " di", duration: 0.38, begin: 230.000, index: 671 },
  { text: "yor", duration: 0.38, begin: 230.250, index: 672 },
  { text: "du:", duration: 0.38, begin: 230.500, index: 673 },
  { text: " \"Bu", duration: 0.28, begin: 231.750, index: 674 },
  { text: " ge", duration: 0.28, begin: 232.000, index: 675 },
  { text: "ce", duration: 0.28, begin: 232.250, index: 676 },
  { text: " kö", duration: 0.28, begin: 232.500, index: 677 },
  { text: "tü", duration: 0.28, begin: 232.750, index: 678 },
  { text: " bir", duration: 0.28, begin: 233.000, index: 679 },
  { text: " rü", duration: 0.28, begin: 233.250, index: 680 },
  { text: "ya", duration: 0.28, begin: 233.500, index: 681 },
  { text: " gör", duration: 0.28, begin: 233.808, index: 682 },
  { text: "düm!", duration: 0.28, begin: 234.000, index: 683 },
  { text: " A", duration: 0.28, begin: 235.250, index: 684 },
  { text: "töl", duration: 0.28, begin: 235.500, index: 685 },
  { text: "ye", duration: 0.28, begin: 235.750, index: 686 },
  { text: "de", duration: 0.28, begin: 236.000, index: 687 },
  { text: " ça", duration: 0.28, begin: 236.250, index: 688 },
  { text: "lı", duration: 0.28, begin: 236.500, index: 689 },
  { text: "şır", duration: 0.28, begin: 236.750, index: 690 },
  { text: "ken", duration: 0.28, begin: 237.000, index: 691 },
  { text: " ba", duration: 0.28, begin: 238.000, index: 692 },
  { text: "ba", duration: 0.28, begin: 238.250, index: 693 },
  { text: "mı", duration: 0.28, begin: 238.500, index: 694 },
  { text: " e", duration: 0.28, begin: 238.750, index: 695 },
  { text: "lek", duration: 0.28, begin: 239.000, index: 696 },
  { text: "trik", duration: 0.28, begin: 239.250, index: 697 },
  { text: " çar", duration: 0.28, begin: 239.750, index: 698 },
  { text: "pı", duration: 0.28, begin: 240.000, index: 699 },
  { text: "yor", duration: 0.28, begin: 240.250, index: 700 },
  { text: "du.", duration: 0.28, begin: 240.500, index: 701 },
  { text: " Al", duration: 0.28, begin: 241.500, index: 702 },
  { text: "lah'", duration: 0.28, begin: 241.750, index: 703 },
  { text: "ım", duration: 0.28, begin: 242.000, index: 704 },
  { text: " o", duration: 0.28, begin: 242.500, index: 705 },
  { text: "nu", duration: 0.28, begin: 242.750, index: 706 },
  { text: " ko", duration: 0.28, begin: 243.000, index: 707 },
  { text: "ru!", duration: 0.28, begin: 243.250, index: 708 },
  { text: " Ben", duration: 0.28, begin: 244.250, index: 709 },
  { text: " e", duration: 0.28, begin: 244.500, index: 710 },
  { text: "lim", duration: 0.28, begin: 244.750, index: 711 },
  { text: "den", duration: 0.28, begin: 245.000, index: 712 },
  { text: " ge", duration: 0.28, begin: 245.250, index: 713 },
  { text: "le", duration: 0.28, begin: 245.500, index: 714 },
  { text: "ni", duration: 0.28, begin: 245.750, index: 715 },
  { text: " ya", duration: 0.28, begin: 246.000, index: 716 },
  { text: "pa", duration: 0.28, begin: 246.250, index: 717 },
  { text: "ca", duration: 0.28, begin: 246.500, index: 718 },
  { text: "ğım!\"", duration: 0.28, begin: 246.750, index: 719 },
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
  <Link href="/dashboard/stories/kavak-agaci-ile-kabak" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/profesyonel-yardim" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/3-4.mp3"
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