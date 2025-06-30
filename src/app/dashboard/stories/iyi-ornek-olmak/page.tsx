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
  { text: "", duration: 0.154, begin: 0.300, index: 0 },
  
  // Title
  { text: "İ", duration: 0.53, begin: 0.300, index: 1, isTitle: true, isCenter: true },
  { text: "yi", duration: 0.53, begin: 0.500, index: 2, isTitle: true, isCenter: true },
  { text: " Ör", duration: 0.53, begin: 0.750, index: 3, isTitle: true, isCenter: true },
  { text: "nek", duration: 0.53, begin: 1.000, index: 4, isTitle: true, isCenter: true },
  { text: " Ol", duration: 0.53, begin: 1.250, index: 5, isTitle: true, isCenter: true },
  { text: "mak", duration: 0.53, begin: 1.500, index: 6, isTitle: true, isCenter: true },
  
  // Story content
  { text: " Ok", duration: 0.53, begin: 2.750, index: 7 },
  { text: "la", duration: 0.53, begin: 3.000, index: 8 },
  { text: "ho", duration: 0.53, begin: 3.250, index: 9 },
  { text: "ma'", duration: 0.53, begin: 3.500, index: 10 },
  { text: "da", duration: 0.53, begin: 3.750, index: 11 },
  { text: " gü", duration: 0.53, begin: 4.500, index: 12 },
  { text: "neş", duration: 0.53, begin: 4.750, index: 13 },
  { text: "li", duration: 0.53, begin: 5.000, index: 14 },
  { text: " bir", duration: 0.53, begin: 5.250, index: 15 },
  { text: " cu", duration: 0.78, begin: 5.500, index: 16 },
  { text: "mar", duration: 0.78, begin: 5.750, index: 17 },
  { text: "te", duration: 0.78, begin: 6.000, index: 18 },
  { text: "si", duration: 0.78, begin: 6.250, index: 19 },
  { text: " öğ", duration: 0.53, begin: 7.000, index: 20 },
  { text: "le", duration: 0.53, begin: 7.250, index: 21 },
  { text: "den", duration: 0.53, begin: 7.500, index: 22 },
  { text: " son", duration: 0.53, begin: 7.750, index: 23 },
  { text: "ra", duration: 0.53, begin: 8.000, index: 24 },
  { text: "sı,", duration: 0.53, begin: 8.250, index: 25 },
  { text: " ar", duration: 0.53, begin: 9.500, index: 26 },
  { text: "ka", duration: 0.53, begin: 9.750, index: 27 },
  { text: "da", duration: 0.53, begin: 10.000, index: 28 },
  { text: "şım", duration: 0.53, begin: 10.250, index: 29 },
  { text: " i", duration: 0.53, begin: 11.250, index: 30 },
  { text: "ki", duration: 0.53, begin: 11.500, index: 31 },
  { text: " kü", duration: 0.53, begin: 11.750, index: 32 },
  { text: "çük", duration: 0.53, begin: 12.000, index: 33 },
  { text: " oğ", duration: 0.53, begin: 12.250, index: 34 },
  { text: "lu", duration: 0.53, begin: 12.500, index: 35 },
  { text: "nu", duration: 0.53, begin: 12.750, index: 36 },
  { text: " mi", duration: 0.53, begin: 13.500, index: 37 },
  { text: "ni", duration: 0.53, begin: 13.750, index: 38 },
  { text: " golf", duration: 0.53, begin: 14.000, index: 39 },
  { text: " oy", duration: 0.53, begin: 14.250, index: 40 },
  { text: "na", duration: 0.53, begin: 14.500, index: 41 },
  { text: "ma", duration: 0.53, begin: 14.750, index: 42 },
  { text: "ya", duration: 0.53, begin: 15.000, index: 43 },
  { text: " gö", duration: 0.53, begin: 15.250, index: 44 },
  { text: "tür", duration: 0.53, begin: 15.500, index: 45 },
  { text: "müş.", duration: 0.53, begin: 15.750, index: 46 },
  { text: " Bi", duration: 0.63, begin: 17.250, index: 47 },
  { text: "let", duration: 0.63, begin: 17.500, index: 48 },
  { text: "çi", duration: 0.63, begin: 17.750, index: 49 },
  { text: "ye", duration: 0.63, begin: 18.000, index: 50 },
  { text: " yak", duration: 0.63, begin: 18.250, index: 51 },
  { text: "laş", duration: 0.63, begin: 18.500, index: 52 },
  { text: "mış", duration: 0.63, begin: 18.750, index: 53 },
  { text: " ve:", duration: 0.63, begin: 19.250, index: 54 },
  { text: " Bi", duration: 0.53, begin: 20.500, index: 55 },
  { text: "let", duration: 0.53, begin: 20.750, index: 56 },
  { text: "ler", duration: 0.53, begin: 21.000, index: 57 },
  { text: " kaç", duration: 0.53, begin: 21.250, index: 58 },
  { text: " do", duration: 0.53, begin: 21.500, index: 59 },
  { text: "lar?", duration: 0.53, begin: 21.750, index: 60 },
  { text: " di", duration: 0.53, begin: 22.750, index: 61 },
  { text: "ye", duration: 0.53, begin: 23.000, index: 62 },
  { text: " sor", duration: 0.53, begin: 23.250, index: 63 },
  { text: "muş.", duration: 0.53, begin: 23.500, index: 64 },
  { text: " Bi", duration: 0.53, begin: 25.000, index: 65 },
  { text: "let", duration: 0.53, begin: 25.250, index: 66 },
  { text: " sa", duration: 0.53, begin: 25.500, index: 67 },
  { text: "tan", duration: 0.53, begin: 25.750, index: 68 },
  { text: " a", duration: 0.53, begin: 26.000, index: 69 },
  { text: "dam:", duration: 0.53, begin: 26.250, index: 70 },
  { text: " Bü", duration: 0.53, begin: 27.250, index: 71 },
  { text: "yük", duration: 0.53, begin: 27.500, index: 72 },
  { text: "ler", duration: 0.53, begin: 27.750, index: 73 },
  { text: " üç", duration: 0.53, begin: 28.000, index: 74 },
  { text: " do", duration: 0.53, begin: 28.250, index: 75 },
  { text: "lar,", duration: 0.53, begin: 28.500, index: 76 },
  { text: " da", duration: 0.53, begin: 29.750, index: 77 },
  { text: "ha", duration: 0.53, begin: 30.000, index: 78 },
  { text: " doğ", duration: 0.53, begin: 30.250, index: 79 },
  { text: "ru", duration: 0.53, begin: 30.500, index: 80 },
  { text: "su", duration: 0.53, begin: 30.750, index: 81 },
  { text: " al", duration: 0.53, begin: 31.750, index: 82 },
  { text: "tı", duration: 0.53, begin: 32.000, index: 83 },
  { text: " ya", duration: 0.53, begin: 32.250, index: 84 },
  { text: "şın", duration: 0.53, begin: 32.500, index: 85 },
  { text: "dan", duration: 0.53, begin: 32.750, index: 86 },
  { text: " bü", duration: 0.28, begin: 33.500, index: 87 },
  { text: "yük", duration: 0.28, begin: 33.750, index: 88 },
  { text: " her", duration: 0.53, begin: 34.500, index: 89 },
  { text: "kes", duration: 0.53, begin: 34.750, index: 90 },
  { text: " üç", duration: 0.53, begin: 35.000, index: 91 },
  { text: " do", duration: 0.53, begin: 35.250, index: 92 },
  { text: "lar.", duration: 0.53, begin: 35.500, index: 93 },
  { text: " Al", duration: 0.53, begin: 37.000, index: 94 },
  { text: "tı", duration: 0.53, begin: 37.250, index: 95 },
  { text: " ve", duration: 0.53, begin: 37.500, index: 96 },
  { text: " al", duration: 0.53, begin: 38.250, index: 97 },
  { text: "tı", duration: 0.53, begin: 38.500, index: 98 },
  { text: " ya", duration: 0.53, begin: 38.750, index: 99 },
  { text: "şın", duration: 0.53, begin: 39.000, index: 100 },
  { text: " al", duration: 0.53, begin: 39.250, index: 101 },
  { text: "tın", duration: 0.53, begin: 39.500, index: 102 },
  { text: "da", duration: 0.53, begin: 39.750, index: 103 },
  { text: "ki", duration: 0.53, begin: 40.000, index: 104 },
  { text: "le", duration: 0.53, begin: 40.250, index: 105 },
  { text: "ri", duration: 0.53, begin: 40.500, index: 106 },
  { text: " be", duration: 0.53, begin: 41.500, index: 107 },
  { text: "da", duration: 0.53, begin: 41.750, index: 108 },
  { text: "va", duration: 0.53, begin: 42.000, index: 109 },
  { text: " a", duration: 0.53, begin: 42.250, index: 110 },
  { text: "lı", duration: 0.53, begin: 42.500, index: 111 },
  { text: "yo", duration: 0.53, begin: 42.750, index: 112 },
  { text: "ruz", duration: 0.53, begin: 43.000, index: 113 },
  { text: " de", duration: 0.53, begin: 43.750, index: 114 },
  { text: "miş.", duration: 0.53, begin: 44.000, index: 115 },
  { text: " Ço", duration: 0.53, begin: 45.250, index: 116 },
  { text: "cuk", duration: 0.53, begin: 45.500, index: 117 },
  { text: "la", duration: 0.53, begin: 45.750, index: 118 },
  { text: "rı", duration: 0.53, begin: 46.000, index: 119 },
  { text: "nız", duration: 0.53, begin: 46.250, index: 120 },
  { text: " kaç", duration: 0.53, begin: 46.500, index: 121 },
  { text: " ya", duration: 0.53, begin: 47.000, index: 122 },
  { text: "şın", duration: 0.53, begin: 47.250, index: 123 },
  { text: "da", duration: 0.53, begin: 47.500, index: 124 },
  { text: "lar?", duration: 0.53, begin: 47.750, index: 125 },
  { text: " di", duration: 0.28, begin: 49.000, index: 126 },
  { text: "ye", duration: 0.28, begin: 49.250, index: 127 },
  { text: " sor", duration: 0.53, begin: 49.500, index: 128 },
  { text: "muş.", duration: 0.53, begin: 49.750, index: 129 },
  { text: " A", duration: 0.53, begin: 51.000, index: 130 },
  { text: "vu", duration: 0.53, begin: 51.250, index: 131 },
  { text: "kat", duration: 0.53, begin: 51.500, index: 132 },
  { text: " üç,", duration: 0.53, begin: 51.750, index: 133 },
  { text: " dok", duration: 0.53, begin: 52.750, index: 134 },
  { text: "tor", duration: 0.53, begin: 53.000, index: 135 },
  { text: " ye", duration: 0.53, begin: 53.250, index: 136 },
  { text: "di", duration: 0.53, begin: 53.500, index: 137 },
  { text: " ya", duration: 0.53, begin: 53.750, index: 138 },
  { text: "şın", duration: 0.53, begin: 54.000, index: 139 },
  { text: "da.", duration: 0.53, begin: 54.250, index: 140 },
  { text: " Sa", duration: 0.53, begin: 55.500, index: 141 },
  { text: "nı", duration: 0.53, begin: 55.750, index: 142 },
  { text: "rım", duration: 0.53, begin: 56.000, index: 143 },
  { text: " si", duration: 0.53, begin: 56.250, index: 144 },
  { text: "ze", duration: 0.53, begin: 56.500, index: 145 },
  { text: " al", duration: 0.53, begin: 57.250, index: 146 },
  { text: "tı", duration: 0.53, begin: 57.500, index: 147 },
  { text: " do", duration: 0.53, begin: 57.750, index: 148 },
  { text: "lar", duration: 0.53, begin: 58.000, index: 149 },
  { text: " ve", duration: 0.53, begin: 58.250, index: 150 },
  { text: "re", duration: 0.53, begin: 58.500, index: 151 },
  { text: "ce", duration: 0.53, begin: 58.750, index: 152 },
  { text: "ğim.", duration: 0.53, begin: 59.000, index: 153 },
  { text: " Di", duration: 0.53, begin: 60.000, index: 154 },
  { text: "ye", duration: 0.53, begin: 60.250, index: 155 },
  { text: " ce", duration: 0.53, begin: 60.500, index: 156 },
  { text: "vap", duration: 0.53, begin: 60.750, index: 157 },
  { text: " ver", duration: 0.53, begin: 61.000, index: 158 },
  { text: "miş", duration: 0.53, begin: 61.250, index: 159 },
  { text: " ar", duration: 0.53, begin: 61.500, index: 160 },
  { text: "ka", duration: 0.53, begin: 61.750, index: 161 },
  { text: "da", duration: 0.53, begin: 62.000, index: 162 },
  { text: "şım.", duration: 0.53, begin: 62.250, index: 163 },
  { text: " Bi", duration: 0.53, begin: 63.750, index: 164 },
  { text: "let", duration: 0.53, begin: 64.000, index: 165 },
  { text: "çi:", duration: 0.53, begin: 64.250, index: 166 },
  { text: " Ba", duration: 0.53, begin: 65.250, index: 167 },
  { text: "yım", duration: 0.53, begin: 65.500, index: 168 },
  { text: " siz", duration: 0.53, begin: 66.500, index: 169 },
  { text: " pi", duration: 0.53, begin: 66.750, index: 170 },
  { text: "yan", duration: 0.53, begin: 67.000, index: 171 },
  { text: "go", duration: 0.53, begin: 67.250, index: 172 },
  { text: "dan", duration: 0.53, begin: 67.500, index: 173 },
  { text: " pa", duration: 0.53, begin: 68.500, index: 174 },
  { text: "ra", duration: 0.53, begin: 68.750, index: 175 },
  { text: " fi", duration: 0.53, begin: 68.900, index: 176 },
  { text: "lan", duration: 0.53, begin: 69.000, index: 177 },
  { text: " mı", duration: 0.53, begin: 69.250, index: 178 },
  { text: " ka", duration: 0.53, begin: 69.500, index: 179 },
  { text: "zan", duration: 0.53, begin: 69.750, index: 180 },
  { text: "dı", duration: 0.53, begin: 70.000, index: 181 },
  { text: "nız?", duration: 0.53, begin: 70.250, index: 182 },
  { text: " Üç", duration: 0.53, begin: 71.750, index: 183 },
  { text: " do", duration: 0.53, begin: 72.000, index: 184 },
  { text: "lar", duration: 0.53, begin: 72.250, index: 185 },
  { text: " ka", duration: 0.68, begin: 72.500, index: 186 },
  { text: "ra", duration: 0.68, begin: 72.750, index: 187 },
  { text: " ge", duration: 0.68, begin: 73.000, index: 188 },
  { text: "çe", duration: 0.68, begin: 73.250, index: 189 },
  { text: "bi", duration: 0.68, begin: 73.500, index: 190 },
  { text: "lir", duration: 0.68, begin: 73.750, index: 191 },
  { text: "di", duration: 0.68, begin: 74.000, index: 192 },
  { text: "niz.", duration: 0.68, begin: 74.250, index: 193 },
  { text: " Bü", duration: 0.53, begin: 75.750, index: 194 },
  { text: "yü", duration: 0.53, begin: 76.000, index: 195 },
  { text: "ğün", duration: 0.53, begin: 76.250, index: 196 },
  { text: " al", duration: 0.53, begin: 77.000, index: 197 },
  { text: "tı", duration: 0.53, begin: 77.250, index: 198 },
  { text: " ya", duration: 0.53, begin: 77.500, index: 199 },
  { text: "şın", duration: 0.53, begin: 77.750, index: 200 },
  { text: "da", duration: 0.53, begin: 78.000, index: 201 },
  { text: " ol", duration: 0.53, begin: 78.500, index: 202 },
  { text: "du", duration: 0.53, begin: 78.750, index: 203 },
  { text: "ğu", duration: 0.53, begin: 79.000, index: 204 },
  { text: "nu", duration: 0.53, begin: 79.250, index: 205 },
  { text: " söy", duration: 0.53, begin: 80.000, index: 206 },
  { text: "le", duration: 0.53, begin: 80.250, index: 207 },
  { text: "ye", duration: 0.53, begin: 80.500, index: 208 },
  { text: "bi", duration: 0.53, begin: 80.750, index: 209 },
  { text: "lir", duration: 0.53, begin: 81.000, index: 210 },
  { text: "di", duration: 0.53, begin: 81.250, index: 211 },
  { text: "niz.", duration: 0.53, begin: 81.500, index: 212 },
  { text: " Ben", duration: 0.53, begin: 83.000, index: 213 },
  { text: " ne", duration: 0.53, begin: 83.250, index: 214 },
  { text: "re", duration: 0.53, begin: 83.500, index: 215 },
  { text: "den", duration: 0.53, begin: 83.750, index: 216 },
  { text: " an", duration: 0.53, begin: 84.000, index: 217 },
  { text: "la", duration: 0.53, begin: 84.250, index: 218 },
  { text: " ya", duration: 0.53, begin: 84.500, index: 219 },
  { text: "cak", duration: 0.53, begin: 84.750, index: 220 },
  { text: "tım?", duration: 0.53, begin: 85.000, index: 221 },
  { text: " di", duration: 0.53, begin: 85.750, index: 222 },
  { text: "ye", duration: 0.53, begin: 86.000, index: 223 },
  { text: " yo", duration: 0.53, begin: 86.250, index: 224 },
  { text: "rum", duration: 0.53, begin: 86.500, index: 225 },
  { text: "da", duration: 0.53, begin: 86.750, index: 226 },
  { text: " bu", duration: 0.53, begin: 87.000, index: 227 },
  { text: "lun", duration: 0.53, begin: 87.250, index: 228 },
  { text: "muş.", duration: 0.53, begin: 87.500, index: 229 },
  { text: " Ar", duration: 0.53, begin: 89.000, index: 230 },
  { text: "ka", duration: 0.53, begin: 89.250, index: 231 },
  { text: "da", duration: 0.53, begin: 89.500, index: 232 },
  { text: "şım", duration: 0.53, begin: 89.750, index: 233 },
  { text: " i", duration: 0.53, begin: 90.000, index: 234 },
  { text: "se:", duration: 0.53, begin: 90.250, index: 235 },
  { text: " E", duration: 0.53, begin: 91.250, index: 236 },
  { text: "vet,", duration: 0.53, begin: 91.500, index: 237 },
  { text: " bu", duration: 0.53, begin: 92.750, index: 238 },
  { text: " doğ", duration: 0.53, begin: 93.000, index: 239 },
  { text: "ru", duration: 0.53, begin: 93.250, index: 240 },
  { text: " o", duration: 0.53, begin: 93.500, index: 241 },
  { text: "la", duration: 0.53, begin: 93.750, index: 242 },
  { text: "bi", duration: 0.53, begin: 94.000, index: 243 },
  { text: "lir,", duration: 0.53, begin: 94.250, index: 244 },
  { text: " a", duration: 0.53, begin: 95.000, index: 245 },
  { text: "ma", duration: 0.53, begin: 95.250, index: 246 },
  { text: " ço", duration: 0.53, begin: 95.500, index: 247 },
  { text: "cuk", duration: 0.53, begin: 95.750, index: 248 },
  { text: "lar", duration: 0.53, begin: 96.000, index: 249 },
  { text: " doğ", duration: 0.53, begin: 96.750, index: 250 },
  { text: "ru", duration: 0.53, begin: 97.000, index: 251 },
  { text: "nun", duration: 0.53, begin: 97.250, index: 252 },
  { text: " ne", duration: 0.53, begin: 98.000, index: 253 },
  { text: " ol", duration: 0.53, begin: 98.250, index: 254 },
  { text: "du", duration: 0.53, begin: 98.500, index: 255 },
  { text: "ğu", duration: 0.53, begin: 98.750, index: 256 },
  { text: "nu", duration: 0.53, begin: 99.000, index: 257 },
  { text: " bi", duration: 0.53, begin: 99.250, index: 258 },
  { text: "li", duration: 0.53, begin: 99.500, index: 259 },
  { text: "yor", duration: 0.53, begin: 99.750, index: 260 },
  { text: "lar", duration: 0.53, begin: 100.000, index: 261 },
  { text: " de", duration: 0.53, begin: 100.750, index: 262 },
  { text: "miş.", duration: 0.53, begin: 101.000, index: 263 },
  { text: " Em", duration: 0.53, begin: 102.500, index: 264 },
  { text: "er", duration: 0.53, begin: 102.750, index: 265 },
  { text: "son'", duration: 0.53, begin: 103.000, index: 266 },
  { text: "un", duration: 0.53, begin: 103.250, index: 267 },
  { text: " da", duration: 0.53, begin: 103.500, index: 268 },
  { text: " de", duration: 0.53, begin: 103.750, index: 269 },
  { text: "di", duration: 0.53, begin: 104.000, index: 270 },
  { text: "ği", duration: 0.53, begin: 104.250, index: 271 },
  { text: " gi", duration: 0.53, begin: 104.500, index: 272 },
  { text: "bi:", duration: 0.53, begin: 104.750, index: 273 },
  { text: " Kim", duration: 0.53, begin: 105.750, index: 274 },
  { text: " ol", duration: 0.53, begin: 106.000, index: 275 },
  { text: "du", duration: 0.53, begin: 106.250, index: 276 },
  { text: "ğun", duration: 0.53, begin: 106.500, index: 277 },
  { text: " söy", duration: 0.53, begin: 107.750, index: 278 },
  { text: "le", duration: 0.53, begin: 108.000, index: 279 },
  { text: "dik", duration: 0.53, begin: 108.250, index: 280 },
  { text: "le", duration: 0.53, begin: 108.500, index: 281 },
  { text: "ri", duration: 0.53, begin: 108.750, index: 282 },
  { text: "ni", duration: 0.53, begin: 109.000, index: 283 },
  { text: " o", duration: 0.53, begin: 109.750, index: 284 },
  { text: " ka", duration: 0.53, begin: 110.000, index: 285 },
  { text: "dar", duration: 0.53, begin: 110.250, index: 286 },
  { text: " göl", duration: 0.53, begin: 110.500, index: 287 },
  { text: "ge", duration: 0.53, begin: 110.750, index: 288 },
  { text: "li", duration: 0.53, begin: 111.000, index: 289 },
  { text: "yor", duration: 0.53, begin: 111.250, index: 290 },
  { text: " ki", duration: 0.53, begin: 112.250, index: 291 },
  { text: " ne", duration: 0.53, begin: 112.750, index: 292 },
  { text: " de", duration: 0.53, begin: 113.000, index: 293 },
  { text: "di", duration: 0.5, begin: 113.250, index: 294 },
  { text: "ği", duration: 0.53, begin: 113.500, index: 295 },
  { text: "ni", duration: 0.53, begin: 113.750, index: 296 },
  { text: " bir", duration: 0.53, begin: 114.750, index: 297 },
  { text: " tür", duration: 0.53, begin: 115.000, index: 298 },
  { text: "lü", duration: 0.53, begin: 115.250, index: 299 },
  { text: " du", duration: 0.53, begin: 115.500, index: 300 },
  { text: "ya", duration: 0.53, begin: 115.750, index: 301 },
  { text: "mı", duration: 0.53, begin: 116.000, index: 302 },
  { text: "yo", duration: 0.53, begin: 116.250, index: 303 },
  { text: "rum.", duration: 0.53, begin: 116.500, index: 304 },
  { text: " Risk", duration: 0.53, begin: 117.750, index: 305 },
  { text: "li", duration: 0.53, begin: 118.000, index: 306 },
  { text: " an", duration: 0.53, begin: 118.500, index: 307 },
  { text: "lar", duration: 0.53, begin: 118.750, index: 308 },
  { text: "da", duration: 0.53, begin: 119.000, index: 309 },
  { text: " ah", duration: 0.53, begin: 120.250, index: 310 },
  { text: "la", duration: 0.53, begin: 120.500, index: 311 },
  { text: "ki", duration: 0.53, begin: 120.750, index: 312 },
  { text: " de", duration: 0.53, begin: 121.000, index: 313 },
  { text: "ğer", duration: 0.53, begin: 121.250, index: 314 },
  { text: "ler", duration: 0.53, begin: 121.500, index: 315 },
  { text: " her", duration: 0.53, begin: 122.750, index: 316 },
  { text: "za", duration: 0.53, begin: 123.000, index: 317 },
  { text: "man", duration: 0.53, begin: 123.250, index: 318 },
  { text: "kin", duration: 0.53, begin: 123.500, index: 319 },
  { text: "den", duration: 0.53, begin: 123.750, index: 320 },
  { text: " da", duration: 0.48, begin: 124.750, index: 321 },
  { text: "ha", duration: 0.48, begin: 125.000, index: 322 },
  { text: " a", duration: 0.48, begin: 125.250, index: 323 },
  { text: "ğır", duration: 0.48, begin: 125.500, index: 324 },
  { text: " bas", duration: 0.48, begin: 126.000, index: 325 },
  { text: "tı", duration: 0.48, begin: 126.250, index: 326 },
  { text: "ğı", duration: 0.48, begin: 126.500, index: 327 },
  { text: " an", duration: 0.53, begin: 126.750, index: 328 },
  { text: " bir", duration: 0.53, begin: 128.000, index: 329 },
  { text: "lik", duration: 0.53, begin: 128.250, index: 330 },
  { text: "te", duration: 0.53, begin: 128.500, index: 331 },
  { text: " ya", duration: 0.53, begin: 128.750, index: 332 },
  { text: "şa", duration: 0.53, begin: 129.000, index: 333 },
  { text: "dı", duration: 0.53, begin: 129.250, index: 334 },
  { text: "ğı", duration: 0.53, begin: 129.500, index: 335 },
  { text: "nız", duration: 0.53, begin: 129.750, index: 336 },
  { text: " ve", duration: 0.53, begin: 130.250, index: 337 },
  { text: " ça", duration: 0.53, begin: 131.000, index: 338 },
  { text: "lış", duration: 0.53, begin: 131.250, index: 339 },
  { text: "tı", duration: 0.53, begin: 131.500, index: 340 },
  { text: "ğı", duration: 0.53, begin: 131.750, index: 341 },
  { text: "nız", duration: 0.53, begin: 132.000, index: 342 },
  { text: " in", duration: 0.53, begin: 132.250, index: 343 },
  { text: "san", duration: 0.53, begin: 132.500, index: 344 },
  { text: "la", duration: 0.53, begin: 132.750, index: 345 },
  { text: "ra", duration: 0.53, begin: 133.000, index: 346 },
  { text: " i", duration: 0.53, begin: 134.000, index: 347 },
  { text: "yi", duration: 0.53, begin: 134.250, index: 348 },
  { text: " ör", duration: 0.53, begin: 134.500, index: 349 },
  { text: "nek", duration: 0.53, begin: 134.750, index: 350 },
  { text: " ol", duration: 0.53, begin: 135.250, index: 351 },
  { text: "ma", duration: 0.53, begin: 135.500, index: 352 },
  { text: "nız", duration: 0.53, begin: 135.750, index: 353 },
  { text: " ge", duration: 0.53, begin: 136.000, index: 354 },
  { text: "rek", duration: 0.53, begin: 136.250, index: 355 },
  { text: "ti", duration: 0.53, begin: 136.500, index: 356 },
  { text: "ği", duration: 0.53, begin: 136.750, index: 357 },
  { text: "ni", duration: 0.53, begin: 137.000, index: 358 },
  { text: " u", duration: 0.53, begin: 138.000, index: 359 },
  { text: "nut", duration: 0.53, begin: 138.250, index: 360 },
  { text: "ma", duration: 0.53, begin: 138.500, index: 361 },
  { text: "yı", duration: 0.53, begin: 138.750, index: 362 },
  { text: "nız.", duration: 0.53, begin: 139.000, index: 363 },
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
  <Link href="/dashboard/stories/gurultu" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/ozgur-kuslar" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/1-4.mp3"
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