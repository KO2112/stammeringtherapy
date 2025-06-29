"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, ArrowLeft, SkipForward, SkipBack,ChevronLeft, ChevronRight} from "lucide-react"
import Link from "next/link"

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
 
  const audioRef = useRef<HTMLAudioElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Story text segments with timing data - COMPLETE VERSION
  const textSegments: TextSegment[] = [
 { text: "Sir", duration: 0.68, begin: 0.500, index: 1, isTitle: true, isCenter: true },
  { text: "kin", duration: 0.68, begin: 0.750, index: 2, isTitle: true, isCenter: true },
  { text: " Ka", duration: 0.68, begin: 1.000, index: 3, isTitle: true, isCenter: true },
  { text: "pı", duration: 0.68, begin: 1.250, index: 4, isTitle: true, isCenter: true },
  { text: "sın", duration: 0.68, begin: 1.500, index: 5, isTitle: true, isCenter: true },
  { text: "dan", duration: 0.68, begin: 1.750, index: 6, isTitle: true, isCenter: true },
  { text: " Dön", duration: 0.68, begin: 2.250, index: 7, isTitle: true, isCenter: true },
  { text: "dü", duration: 0.68, begin: 2.500, index: 8, isTitle: true, isCenter: true },
  { text: "ğüm", duration: 0.68, begin: 2.750, index: 9, isTitle: true, isCenter: true },
  { text: " Ge", duration: 0.68, begin: 3.000, index: 10, isTitle: true, isCenter: true },
  { text: "ce", duration: 0.68, begin: 3.250, index: 11, isTitle: true, isCenter: true },
  
  // Story content
  { text: " Bir", duration: 0.68, begin: 4.750, index: 12 },
  { text: " in", duration: 0.68, begin: 5.000, index: 13 },
  { text: "sa", duration: 0.68, begin: 5.250, index: 14 },
  { text: "nın", duration: 0.68, begin: 5.500, index: 15 },
  { text: " ya", duration: 0.68, begin: 5.750, index: 16 },
  { text: "şa", duration: 0.68, begin: 6.000, index: 17 },
  { text: "mı", duration: 0.68, begin: 6.250, index: 18 },
  { text: "nın", duration: 0.68, begin: 6.500, index: 19 },
  { text: " en", duration: 0.68, begin: 7.500, index: 20 },
  { text: " ö", duration: 0.68, begin: 7.750, index: 21 },
  { text: "nem", duration: 0.68, begin: 8.000, index: 22 },
  { text: "li", duration: 0.68, begin: 8.250, index: 23 },
  { text: " kıs", duration: 0.68, begin: 8.500, index: 24 },
  { text: "mı,", duration: 0.68, begin: 8.750, index: 25 },
  { text: " i", duration: 0.68, begin: 9.750, index: 26 },
  { text: "yi", duration: 0.68, begin: 10.000, index: 27 },
  { text: "lik", duration: 0.68, begin: 10.250, index: 28 },
  { text: " ve", duration: 0.68, begin: 10.500, index: 29 },
  { text: " sev", duration: 0.68, begin: 10.750, index: 30 },
  { text: "gi", duration: 0.68, begin: 11.000, index: 31 },
  { text: " a", duration: 0.68, begin: 11.250, index: 32 },
  { text: "dı", duration: 0.68, begin: 11.500, index: 33 },
  { text: "na", duration: 0.68, begin: 11.750, index: 34 },
  { text: " yap", duration: 0.68, begin: 12.000, index: 35 },
  { text: "tı", duration: 0.68, begin: 12.250, index: 36 },
  { text: "ğı", duration: 0.68, begin: 12.500, index: 37 },
  { text: " kü", duration: 0.28, begin: 13.750, index: 38 },
  { text: "çük", duration: 0.28, begin: 14.000, index: 39 },
  { text: " ad", duration: 0.68, begin: 14.750, index: 40 },
  { text: "sız", duration: 0.68, begin: 15.000, index: 41 },
  { text: " ve", duration: 0.68, begin: 15.250, index: 42 },
  { text: " a", duration: 0.68, begin: 16.250, index: 43 },
  { text: "nım", duration: 0.68, begin: 16.500, index: 44 },
  { text: "san", duration: 0.68, begin: 16.750, index: 45 },
  { text: "ma", duration: 0.68, begin: 17.000, index: 46 },
  { text: "yan", duration: 0.68, begin: 17.250, index: 47 },
  { text: " ey", duration: 0.68, begin: 17.750, index: 48 },
  { text: "lem", duration: 0.68, begin: 18.000, index: 49 },
  { text: "ler", duration: 0.68, begin: 18.250, index: 50 },
  { text: "dir.", duration: 0.68, begin: 18.500, index: 51 },
  { text: " Er", duration: 0.38, begin: 20.250, index: 52 },
  { text: "gen", duration: 0.38, begin: 20.500, index: 53 },
  { text: "lik", duration: 0.38, begin: 20.750, index: 54 },
  { text: " dö", duration: 0.38, begin: 21.000, index: 55 },
  { text: "ne", duration: 0.38, begin: 21.250, index: 56 },
  { text: "min", duration: 0.38, begin: 21.500, index: 57 },
  { text: "dey", duration: 0.38, begin: 21.750, index: 58 },
  { text: "dim", duration: 0.38, begin: 22.000, index: 59 },
  { text: " ve", duration: 0.38, begin: 22.500, index: 60 },
  { text: " ba", duration: 0.38, begin: 23.250, index: 61 },
  { text: "bam", duration: 0.38, begin: 23.500, index: 62 },
  { text: "la", duration: 0.38, begin: 23.750, index: 63 },
  { text: " sirk", duration: 0.38, begin: 24.000, index: 64 },
  { text: " bi", duration: 0.38, begin: 24.250, index: 65 },
  { text: "le", duration: 0.38, begin: 24.500, index: 66 },
  { text: "ti", duration: 0.38, begin: 24.750, index: 67 },
  { text: " kuy", duration: 0.38, begin: 25.000, index: 68 },
  { text: "ru", duration: 0.38, begin: 25.250, index: 69 },
  { text: "ğun", duration: 0.48, begin: 25.500, index: 70 },
  { text: "da", duration: 0.48, begin: 25.750, index: 71 },
  { text: " bek", duration: 0.48, begin: 26.000, index: 72 },
  { text: "li", duration: 0.48, begin: 26.250, index: 73 },
  { text: "yor", duration: 0.48, begin: 26.500, index: 74 },
  { text: "duk.", duration: 0.48, begin: 26.750, index: 75 },
  { text: " So", duration: 0.48, begin: 28.250, index: 76 },
  { text: "nun", duration: 0.48, begin: 28.500, index: 77 },
  { text: "da,", duration: 0.48, begin: 28.750, index: 78 },
  { text: " gi", duration: 0.68, begin: 29.500, index: 79 },
  { text: "şey", duration: 0.68, begin: 29.750, index: 80 },
  { text: "le", duration: 0.68, begin: 30.000, index: 81 },
  { text: " a", duration: 0.68, begin: 30.250, index: 82 },
  { text: "ra", duration: 0.68, begin: 30.500, index: 83 },
  { text: "mız", duration: 0.68, begin: 30.750, index: 84 },
  { text: "da", duration: 0.68, begin: 31.000, index: 85 },
  { text: " bir", duration: 0.68, begin: 32.000, index: 86 },
  { text: " tek", duration: 0.68, begin: 32.500, index: 87 },
  { text: " a", duration: 0.68, begin: 32.750, index: 88 },
  { text: "ile", duration: 0.68, begin: 33.000, index: 89 },
  { text: " kal", duration: 0.68, begin: 33.250, index: 90 },
  { text: "mış", duration: 0.68, begin: 33.500, index: 91 },
  { text: "tı.", duration: 0.68, begin: 33.750, index: 92 },
  { text: " Bu", duration: 0.68, begin: 35.250, index: 93 },
  { text: " a", duration: 0.68, begin: 35.500, index: 94 },
  { text: "i", duration: 0.68, begin: 35.750, index: 95 },
  { text: "le", duration: 0.68, begin: 36.000, index: 96 },
  { text: " be", duration: 0.68, begin: 36.750, index: 97 },
  { text: "ni", duration: 0.68, begin: 37.000, index: 98 },
  { text: " çok", duration: 0.68, begin: 37.250, index: 99 },
  { text: " et", duration: 0.68, begin: 37.500, index: 100 },
  { text: "ki", duration: 0.68, begin: 38.000, index: 101 },
  { text: "le", duration: 0.68, begin: 38.250, index: 102 },
  { text: "di.", duration: 0.68, begin: 38.500, index: 103 },
  { text: " Tü", duration: 0.68, begin: 39.500, index: 104 },
  { text: "mü", duration: 0.68, begin: 40.000, index: 105 },
  { text: "de", duration: 0.68, begin: 40.500, index: 106 },
  { text: " on", duration: 0.68, begin: 40.750, index: 107 },
  { text: " i", duration: 0.68, begin: 41.000, index: 108 },
  { text: "ki", duration: 0.68, begin: 41.250, index: 109 },
  { text: " ya", duration: 0.68, begin: 41.500, index: 110 },
  { text: "şın", duration: 0.68, begin: 41.750, index: 111 },
  { text: " al", duration: 0.68, begin: 42.000, index: 112 },
  { text: "tın", duration: 0.68, begin: 42.250, index: 113 },
  { text: "da", duration: 0.68, begin: 42.500, index: 114 },
  { text: " se", duration: 0.48, begin: 43.750, index: 115 },
  { text: "kiz", duration: 0.48, begin: 44.000, index: 116 },
  { text: " ço", duration: 0.68, begin: 44.250, index: 117 },
  { text: "cuk", duration: 0.68, begin: 44.500, index: 118 },
  { text: "la", duration: 0.68, begin: 44.750, index: 119 },
  { text: "rı", duration: 0.68, begin: 45.000, index: 120 },
  { text: " var", duration: 0.68, begin: 45.250, index: 121 },
  { text: "dı.", duration: 0.68, begin: 45.500, index: 122 },
  { text: " Çok", duration: 0.68, begin: 46.750, index: 123 },
  { text: " var", duration: 0.68, begin: 47.000, index: 124 },
  { text: "lık", duration: 0.68, begin: 47.250, index: 125 },
  { text: "lı", duration: 0.68, begin: 47.500, index: 126 },
  { text: " ol", duration: 0.68, begin: 47.750, index: 127 },
  { text: "ma", duration: 0.68, begin: 48.000, index: 128 },
  { text: "dık", duration: 0.68, begin: 48.250, index: 129 },
  { text: "la", duration: 0.68, begin: 48.500, index: 130 },
  { text: "rı", duration: 0.68, begin: 48.750, index: 131 },
  { text: " her", duration: 0.68, begin: 49.750, index: 132 },
  { text: " hal", duration: 0.68, begin: 50.000, index: 133 },
  { text: "le", duration: 0.68, begin: 50.250, index: 134 },
  { text: "rin", duration: 0.68, begin: 50.500, index: 135 },
  { text: "den", duration: 0.68, begin: 50.750, index: 136 },
  { text: " bel", duration: 0.68, begin: 51.250, index: 137 },
  { text: "liy", duration: 0.68, begin: 51.500, index: 138 },
  { text: "di.", duration: 0.68, begin: 51.750, index: 139 },
  { text: " Ü", duration: 0.68, begin: 53.250, index: 140 },
  { text: "zer", duration: 0.68, begin: 53.500, index: 141 },
  { text: "le", duration: 0.68, begin: 53.750, index: 142 },
  { text: "rin", duration: 0.68, begin: 54.000, index: 143 },
  { text: "de", duration: 0.68, begin: 54.250, index: 144 },
  { text: "ki", duration: 0.68, begin: 54.500, index: 145 },
  { text: " giy", duration: 0.68, begin: 54.750, index: 146 },
  { text: "si", duration: 0.68, begin: 55.000, index: 147 },
  { text: "ler", duration: 0.68, begin: 55.250, index: 148 },
  { text: " pa", duration: 0.48, begin: 56.250, index: 149 },
  { text: "ha", duration: 0.48, begin: 56.500, index: 150 },
  { text: "lı", duration: 0.48, begin: 56.750, index: 151 },
  { text: " şey", duration: 0.48, begin: 57.000, index: 152 },
  { text: "ler", duration: 0.48, begin: 57.250, index: 153 },
  { text: " de", duration: 0.68, begin: 57.500, index: 154 },
  { text: "ğil", duration: 0.68, begin: 57.750, index: 155 },
  { text: "di", duration: 0.68, begin: 58.000, index: 156 },
  { text: " a", duration: 0.48, begin: 58.500, index: 157 },
  { text: "ma", duration: 0.48, begin: 58.750, index: 158 },
  { text: " ter", duration: 0.68, begin: 59.500, index: 159 },
  { text: " te", duration: 0.68, begin: 59.750, index: 160 },
  { text: "miz", duration: 0.68, begin: 60.000, index: 161 },
  { text: "di.", duration: 0.68, begin: 60.250, index: 162 },
  { text: " Ço", duration: 0.68, begin: 61.500, index: 163 },
  { text: "cuk", duration: 0.68, begin: 61.750, index: 164 },
  { text: "la", duration: 0.68, begin: 62.000, index: 165 },
  { text: "rın", duration: 0.68, begin: 62.250, index: 166 },
  { text: " tü", duration: 0.68, begin: 62.500, index: 167 },
  { text: "mü,", duration: 0.68, begin: 62.750, index: 168 },
  { text: " ba", duration: 0.48, begin: 63.750, index: 169 },
  { text: "ba", duration: 0.48, begin: 64.000, index: 170 },
  { text: "la", duration: 0.48, begin: 64.250, index: 171 },
  { text: "rı", duration: 0.48, begin: 64.500, index: 172 },
  { text: "nın", duration: 0.48, begin: 64.750, index: 173 },
  { text: " ar", duration: 0.68, begin: 65.000, index: 174 },
  { text: "ka", duration: 0.68, begin: 65.250, index: 175 },
  { text: "sın", duration: 0.68, begin: 65.500, index: 176 },
  { text: "da", duration: 0.68, begin: 65.750, index: 177 },
  { text: " i", duration: 0.48, begin: 66.750, index: 178 },
  { text: "ki", duration: 0.48, begin: 67.000, index: 179 },
  { text: "şer", duration: 0.48, begin: 67.250, index: 180 },
  { text: "li", duration: 0.48, begin: 67.500, index: 181 },
  { text: " sı", duration: 0.68, begin: 67.750, index: 182 },
  { text: "ra", duration: 0.68, begin: 68.000, index: 183 },
  { text: " ol", duration: 0.68, begin: 68.250, index: 184 },
  { text: "muş,", duration: 0.68, begin: 68.500, index: 185 },
  { text: " el", duration: 0.68, begin: 69.500, index: 186 },
  { text: " ele", duration: 0.68, begin: 69.750, index: 187 },
  { text: " ve", duration: 0.68, begin: 70.500, index: 188 },
  { text: " ter", duration: 0.58, begin: 71.250, index: 189 },
  { text: "bi", duration: 0.58, begin: 71.500, index: 190 },
  { text: "ye", duration: 0.58, begin: 71.750, index: 191 },
  { text: "li", duration: 0.58, begin: 72.000, index: 192 },
  { text: " ter", duration: 0.58, begin: 72.250, index: 193 },
  { text: "bi", duration: 0.58, begin: 72.500, index: 194 },
  { text: "ye", duration: 0.58, begin: 72.750, index: 195 },
  { text: "li,", duration: 0.58, begin: 73.000, index: 196 },
  { text: " sı", duration: 0.28, begin: 74.000, index: 197 },
  { text: "ra", duration: 0.28, begin: 74.250, index: 198 },
  { text: "nın", duration: 0.28, begin: 74.500, index: 199 },
  { text: " ken", duration: 0.38, begin: 74.750, index: 200 },
  { text: "di", duration: 0.38, begin: 75.000, index: 201 },
  { text: "le", duration: 0.38, begin: 75.250, index: 202 },
  { text: "ri", duration: 0.38, begin: 75.500, index: 203 },
  { text: "ne", duration: 0.38, begin: 75.750, index: 204 },
  { text: " gel", duration: 0.38, begin: 76.000, index: 205 },
  { text: "me", duration: 0.38, begin: 76.250, index: 206 },
  { text: "si", duration: 0.38, begin: 76.500, index: 207 },
  { text: "ni", duration: 0.38, begin: 76.750, index: 208 },
  { text: " bek", duration: 0.48, begin: 77.000, index: 209 },
  { text: "li", duration: 0.48, begin: 77.250, index: 210 },
  { text: "yor", duration: 0.48, begin: 77.500, index: 211 },
  { text: "lar", duration: 0.48, begin: 77.750, index: 212 },
  { text: "dı.", duration: 0.48, begin: 78.000, index: 213 },
  { text: " Sirk", duration: 0.68, begin: 79.250, index: 214 },
  { text: "te", duration: 0.68, begin: 79.500, index: 215 },
  { text: " gö", duration: 0.68, begin: 79.750, index: 216 },
  { text: "re", duration: 0.68, begin: 80.000, index: 217 },
  { text: "cek", duration: 0.68, begin: 80.250, index: 218 },
  { text: "le", duration: 0.68, begin: 80.500, index: 219 },
  { text: "ri,", duration: 0.68, begin: 80.750, index: 220 },
  { text: " pal", duration: 0.68, begin: 81.750, index: 221 },
  { text: "ya", duration: 0.68, begin: 82.000, index: 222 },
  { text: "ço", duration: 0.68, begin: 82.250, index: 223 },
  { text: "lar,", duration: 0.68, begin: 82.500, index: 224 },
  { text: " fil", duration: 0.68, begin: 83.500, index: 225 },
  { text: "ler", duration: 0.68, begin: 83.750, index: 226 },
  { text: " ve", duration: 0.68, begin: 84.250, index: 227 },
  { text: " de", duration: 0.68, begin: 85.000, index: 228 },
  { text: "ği", duration: 0.68, begin: 85.250, index: 229 },
  { text: "şik", duration: 0.68, begin: 85.500, index: 230 },
  { text: " şey", duration: 0.68, begin: 85.750, index: 231 },
  { text: "ler", duration: 0.68, begin: 86.000, index: 232 },
  { text: " hak", duration: 0.48, begin: 86.750, index: 233 },
  { text: "kın", duration: 0.48, begin: 87.000, index: 234 },
  { text: "da", duration: 0.48, begin: 87.250, index: 235 },
  { text: " ko", duration: 0.48, begin: 87.750, index: 236 },
  { text: "nu", duration: 0.48, begin: 88.000, index: 237 },
  { text: "şu", duration: 0.48, begin: 88.250, index: 238 },
  { text: "yor", duration: 0.48, begin: 88.500, index: 239 },
  { text: "lar", duration: 0.48, begin: 88.750, index: 240 },
  { text: "dı.", duration: 0.48, begin: 89.000, index: 241 },
  { text: " Da", duration: 0.68, begin: 90.250, index: 242 },
  { text: "ha", duration: 0.68, begin: 90.500, index: 243 },
  { text: " ön", duration: 0.68, begin: 90.750, index: 244 },
  { text: "ce", duration: 0.68, begin: 91.000, index: 245 },
  { text: " sir", duration: 0.68, begin: 92.000, index: 246 },
  { text: "ke", duration: 0.68, begin: 92.250, index: 247 },
  { text: " git", duration: 0.68, begin: 92.500, index: 248 },
  { text: "me", duration: 0.68, begin: 92.750, index: 249 },
  { text: "dik", duration: 0.68, begin: 93.000, index: 250 },
  { text: "le", duration: 0.68, begin: 93.250, index: 251 },
  { text: "ri,", duration: 0.68, begin: 93.500, index: 252 },
  { text: " ko", duration: 0.68, begin: 94.750, index: 253 },
  { text: "nuş", duration: 0.68, begin: 95.000, index: 254 },
  { text: "ma", duration: 0.68, begin: 95.250, index: 255 },
  { text: "la", duration: 0.68, begin: 95.500, index: 256 },
  { text: "rın", duration: 0.68, begin: 95.750, index: 257 },
  { text: "dan", duration: 0.68, begin: 96.000, index: 258 },
  { text: " bel", duration: 0.68, begin: 96.250, index: 259 },
  { text: "liy", duration: 0.68, begin: 96.500, index: 260 },
  { text: "di.", duration: 0.68, begin: 96.750, index: 261 },
  { text: " An", duration: 0.68, begin: 98.250, index: 262 },
  { text: "ney", duration: 0.68, begin: 98.500, index: 263 },
  { text: "le", duration: 0.68, begin: 98.750, index: 264 },
  { text: " ba", duration: 0.68, begin: 99.000, index: 265 },
  { text: "ba,", duration: 0.68, begin: 99.250, index: 266 },
  { text: " gu", duration: 0.68, begin: 100.250, index: 267 },
  { text: "rur", duration: 0.68, begin: 100.500, index: 268 },
  { text: "la", duration: 0.68, begin: 100.750, index: 269 },
  { text: " ço", duration: 0.68, begin: 101.000, index: 270 },
  { text: "cuk", duration: 0.68, begin: 101.250, index: 271 },
  { text: "la", duration: 0.68, begin: 101.500, index: 272 },
  { text: "rı", duration: 0.68, begin: 101.750, index: 273 },
  { text: "nın", duration: 0.68, begin: 102.000, index: 274 },
  { text: " ö", duration: 0.68, begin: 102.250, index: 275 },
  { text: "nün", duration: 0.68, begin: 102.500, index: 276 },
  { text: "de", duration: 0.68, begin: 102.750, index: 277 },
  { text: " du", duration: 0.68, begin: 103.000, index: 278 },
  { text: "ru", duration: 0.68, begin: 103.250, index: 279 },
  { text: "yor", duration: 0.68, begin: 103.500, index: 280 },
  { text: "lar", duration: 0.68, begin: 103.750, index: 281 },
  { text: "dı.", duration: 0.68, begin: 104.000, index: 282 },
  { text: " On", duration: 0.68, begin: 105.500, index: 283 },
  { text: "lar", duration: 0.68, begin: 105.750, index: 284 },
  { text: "da", duration: 0.68, begin: 106.000, index: 285 },
  { text: " el", duration: 0.68, begin: 107.000, index: 286 },
  { text: " e", duration: 0.68, begin: 107.250, index: 287 },
  { text: "le", duration: 0.68, begin: 107.500, index: 288 },
  { text: " tu", duration: 0.68, begin: 107.750, index: 289 },
  { text: "tuş", duration: 0.68, begin: 108.000, index: 290 },
  { text: "muş", duration: 0.68, begin: 108.250, index: 291 },
  { text: "lar", duration: 0.68, begin: 108.500, index: 292 },
  { text: "dı.", duration: 0.68, begin: 108.750, index: 293 },
  { text: " Gi", duration: 0.68, begin: 110.250, index: 294 },
  { text: "şe", duration: 0.68, begin: 110.500, index: 295 },
  { text: "de", duration: 0.68, begin: 110.750, index: 296 },
  { text: "ki", duration: 0.68, begin: 111.000, index: 297 },
  { text: " me", duration: 0.68, begin: 111.250, index: 298 },
  { text: "mur;", duration: 0.68, begin: 111.500, index: 299 },
  { text: " ba", duration: 0.48, begin: 112.500, index: 300 },
  { text: "ba", duration: 0.48, begin: 112.750, index: 301 },
  { text: "ya,", duration: 0.48, begin: 113.000, index: 302 },
  { text: " kaç", duration: 0.68, begin: 113.750, index: 303 },
  { text: " bi", duration: 0.68, begin: 114.000, index: 304 },
  { text: "let", duration: 0.68, begin: 114.250, index: 305 },
  { text: " is", duration: 0.68, begin: 114.500, index: 306 },
  { text: "te", duration: 0.68, begin: 114.750, index: 307 },
  { text: "dik", duration: 0.68, begin: 115.000, index: 308 },
  { text: "le", duration: 0.68, begin: 115.250, index: 309 },
  { text: "ri", duration: 0.68, begin: 115.500, index: 310 },
  { text: "ni", duration: 0.68, begin: 115.750, index: 311 },
  { text: " sor", duration: 0.68, begin: 116.000, index: 312 },
  { text: "du.", duration: 0.68, begin: 116.250, index: 313 },
  { text: " Ba", duration: 0.48, begin: 117.750, index: 314 },
  { text: "ba,", duration: 0.48, begin: 118.000, index: 315 },
  { text: " gu", duration: 0.68, begin: 118.750, index: 316 },
  { text: "rur", duration: 0.68, begin: 119.000, index: 317 },
  { text: "la:", duration: 0.68, begin: 119.250, index: 318 },
  { text: " İ", duration: 0.68, begin: 120.250, index: 319 },
  { text: "ki", duration: 0.68, begin: 120.500, index: 320 },
  { text: " ta", duration: 0.68, begin: 120.750, index: 321 },
  { text: "ne", duration: 0.68, begin: 121.000, index: 322 },
  { text: " e", duration: 0.68, begin: 121.250, index: 323 },
  { text: "şim", duration: 0.68, begin: 121.500, index: 324 },
  { text: "le", duration: 0.68, begin: 121.750, index: 325 },
  { text: " ken", duration: 0.68, begin: 122.250, index: 326 },
  { text: "dim,", duration: 0.68, begin: 122.500, index: 327 },
  { text: " se", duration: 0.68, begin: 123.750, index: 328 },
  { text: "kiz", duration: 0.68, begin: 124.000, index: 329 },
  { text: " ta", duration: 0.68, begin: 124.250, index: 330 },
  { text: "ne", duration: 0.68, begin: 124.500, index: 331 },
  { text: "de", duration: 0.68, begin: 124.750, index: 332 },
  { text: " ço", duration: 0.68, begin: 125.000, index: 333 },
  { text: "cuk", duration: 0.68, begin: 125.250, index: 334 },
  { text: "la", duration: 0.68, begin: 125.500, index: 335 },
  { text: "rım", duration: 0.68, begin: 125.750, index: 336 },
  { text: " i", duration: 0.68, begin: 126.000, index: 337 },
  { text: "çin", duration: 0.68, begin: 126.250, index: 338 },
  { text: " bi", duration: 0.68, begin: 126.750, index: 339 },
  { text: "let", duration: 0.68, begin: 127.000, index: 340 },
  { text: " is", duration: 0.68, begin: 127.250, index: 341 },
  { text: "ti", duration: 0.68, begin: 127.500, index: 342 },
  { text: "yo", duration: 0.68, begin: 127.750, index: 343 },
  { text: "rum", duration: 0.68, begin: 128.000, index: 344 },
  { text: " di", duration: 0.68, begin: 128.750, index: 345 },
  { text: "ye", duration: 0.68, begin: 129.000, index: 346 },
  { text: " ya", duration: 0.68, begin: 129.250, index: 347 },
  { text: "nıt", duration: 0.68, begin: 129.500, index: 348 },
  { text: "la", duration: 0.68, begin: 129.750, index: 349 },
  { text: "dı", duration: 0.68, begin: 130.000, index: 350 },
  { text: " o", duration: 0.68, begin: 130.250, index: 351 },
  { text: "nu", duration: 0.68, begin: 130.500, index: 352 },
  { text: " Gi", duration: 0.68, begin: 131.750, index: 353 },
  { text: "şe", duration: 0.68, begin: 132.000, index: 354 },
  { text: " me", duration: 0.68, begin: 132.250, index: 355 },
  { text: "mu", duration: 0.68, begin: 132.500, index: 356 },
  { text: "ru", duration: 0.68, begin: 132.750, index: 357 },
  { text: " bi", duration: 0.68, begin: 133.750, index: 358 },
  { text: "let", duration: 0.68, begin: 134.000, index: 359 },
  { text: "le", duration: 0.68, begin: 134.250, index: 360 },
  { text: "rin", duration: 0.68, begin: 134.500, index: 361 },
  { text: " be", duration: 0.68, begin: 134.750, index: 362 },
  { text: "de", duration: 0.68, begin: 135.000, index: 363 },
  { text: "li", duration: 0.68, begin: 135.250, index: 364 },
  { text: "ni", duration: 0.68, begin: 135.500, index: 365 },
  { text: " söy", duration: 0.68, begin: 135.750, index: 366 },
  { text: "le", duration: 0.68, begin: 136.000, index: 367 },
  { text: "di.", duration: 0.68, begin: 136.250, index: 368 },
  { text: " An", duration: 0.68, begin: 137.750, index: 369 },
  { text: "ne", duration: 0.68, begin: 138.000, index: 370 },
  { text: "nin", duration: 0.68, begin: 138.250, index: 371 },
  { text: " e", duration: 0.68, begin: 138.500, index: 372 },
  { text: "li,", duration: 0.68, begin: 138.750, index: 373 },
  { text: " ba", duration: 0.68, begin: 139.500, index: 374 },
  { text: "ba", duration: 0.68, begin: 139.750, index: 375 },
  { text: "nın", duration: 0.68, begin: 140.000, index: 376 },
  { text: " e", duration: 0.68, begin: 140.250, index: 377 },
  { text: "lin", duration: 0.68, begin: 140.500, index: 378 },
  { text: "den", duration: 0.68, begin: 140.750, index: 379 },
  { text: " ay", duration: 0.68, begin: 141.000, index: 380 },
  { text: "rıl", duration: 0.68, begin: 141.250, index: 381 },
  { text: "dı", duration: 0.68, begin: 141.500, index: 382 },
  { text: " ve", duration: 0.68, begin: 142.500, index: 383 },
  { text: " ba", duration: 0.38, begin: 143.250, index: 384 },
  { text: "şı", duration: 0.38, begin: 143.500, index: 385 },
  { text: " ö", duration: 0.48, begin: 143.750, index: 386 },
  { text: "ne", duration: 0.48, begin: 144.000, index: 387 },
  { text: " düş", duration: 0.48, begin: 144.250, index: 388 },
  { text: "tü.", duration: 0.48, begin: 144.500, index: 389 },
  { text: " Ba", duration: 0.68, begin: 145.500, index: 390 },
  { text: "ba", duration: 0.68, begin: 145.750, index: 391 },
  { text: "nın", duration: 0.68, begin: 146.000, index: 392 },
  { text: " du", duration: 0.68, begin: 146.250, index: 393 },
  { text: "dak", duration: 0.68, begin: 146.500, index: 394 },
  { text: "la", duration: 0.68, begin: 146.750, index: 395 },
  { text: "rı", duration: 0.68, begin: 147.000, index: 396 },
  { text: " tit", duration: 0.68, begin: 147.250, index: 397 },
  { text: "re", duration: 0.68, begin: 147.500, index: 398 },
  { text: "me", duration: 0.68, begin: 147.750, index: 399 },
  { text: "ye", duration: 0.68, begin: 148.000, index: 400 },
  { text: " baş", duration: 0.68, begin: 148.250, index: 401 },
  { text: "la", duration: 0.68, begin: 148.500, index: 402 },
  { text: "dı.", duration: 0.68, begin: 148.750, index: 403 },
  { text: " Ba", duration: 0.38, begin: 150.500, index: 404 },
  { text: "ba,", duration: 0.38, begin: 150.750, index: 405 },
  { text: " gi", duration: 0.68, begin: 151.500, index: 406 },
  { text: "şe", duration: 0.68, begin: 151.750, index: 407 },
  { text: "ye", duration: 0.68, begin: 152.000, index: 408 },
  { text: " bi", duration: 0.68, begin: 152.250, index: 409 },
  { text: "raz", duration: 0.68, begin: 152.500, index: 410 },
  { text: " da", duration: 0.68, begin: 152.750, index: 411 },
  { text: "ha", duration: 0.68, begin: 153.000, index: 412 },
  { text: " yak", duration: 0.68, begin: 153.250, index: 413 },
  { text: "laş", duration: 0.68, begin: 153.500, index: 414 },
  { text: "tı", duration: 0.68, begin: 153.750, index: 415 },
  { text: " ve:", duration: 0.68, begin: 154.500, index: 416 },
  { text: " Ne", duration: 0.68, begin: 155.250, index: 417 },
  { text: " ka", duration: 0.68, begin: 155.500, index: 418 },
  { text: "dar", duration: 0.68, begin: 155.750, index: 419 },
  { text: " de", duration: 0.68, begin: 156.000, index: 420 },
  { text: "di", duration: 0.68, begin: 156.250, index: 421 },
  { text: "niz?", duration: 0.68, begin: 156.500, index: 422 },
  { text: " di", duration: 0.68, begin: 157.500, index: 423 },
  { text: "ye", duration: 0.68, begin: 157.750, index: 424 },
  { text: " sor", duration: 0.68, begin: 158.000, index: 425 },
  { text: "du.", duration: 0.68, begin: 158.250, index: 426 },
  { text: " Gi", duration: 0.68, begin: 159.750, index: 427 },
  { text: "şe", duration: 0.68, begin: 160.000, index: 428 },
  { text: " me", duration: 0.68, begin: 160.250, index: 429 },
  { text: "mu", duration: 0.68, begin: 160.500, index: 430 },
  { text: "ru,", duration: 0.68, begin: 160.750, index: 431 },
  { text: " bi", duration: 0.38, begin: 161.750, index: 432 },
  { text: "let", duration: 0.38, begin: 162.000, index: 433 },
  { text: "le", duration: 0.38, begin: 162.250, index: 434 },
  { text: "rin", duration: 0.38, begin: 162.500, index: 435 },
  { text: " be", duration: 0.28, begin: 162.750, index: 436 },
  { text: "de", duration: 0.28, begin: 163.000, index: 437 },
  { text: "li", duration: 0.28, begin: 163.250, index: 438 },
  { text: "ni", duration: 0.28, begin: 163.500, index: 439 },
  { text: " yi", duration: 0.28, begin: 163.750, index: 440 },
  { text: "ne", duration: 0.28, begin: 164.000, index: 441 },
  { text: "le", duration: 0.28, begin: 164.250, index: 442 },
  { text: "di.", duration: 0.28, begin: 164.500, index: 443 },
  { text: " A", duration: 0.28, begin: 165.750, index: 444 },
  { text: "da", duration: 0.28, begin: 166.000, index: 445 },
  { text: "mın", duration: 0.28, begin: 166.250, index: 446 },
  { text: " o", duration: 0.28, begin: 167.000, index: 447 },
  { text: " ka", duration: 0.28, begin: 167.250, index: 448 },
  { text: "dar", duration: 0.28, begin: 167.500, index: 449 },
  { text: " pa", duration: 0.28, begin: 167.750, index: 450 },
  { text: "ra", duration: 0.28, begin: 168.000, index: 451 },
  { text: "sı", duration: 0.28, begin: 168.250, index: 452 },
  { text: " yok", duration: 0.48, begin: 168.500, index: 453 },
  { text: "tu.", duration: 0.48, begin: 168.750, index: 454 },
  { text: " Şim", duration: 0.38, begin: 170.000, index: 455 },
  { text: "di", duration: 0.38, begin: 170.250, index: 456 },
  { text: " na", duration: 0.38, begin: 170.500, index: 457 },
  { text: "sıl", duration: 0.38, begin: 170.750, index: 458 },
  { text: " dö", duration: 0.38, begin: 171.250, index: 459 },
  { text: "nüp,", duration: 0.38, begin: 171.500, index: 460 },
  { text: " ço", duration: 0.38, begin: 172.000, index: 461 },
  { text: "cuk", duration: 0.38, begin: 172.250, index: 462 },
  { text: "la", duration: 0.38, begin: 172.500, index: 463 },
  { text: "rı", duration: 0.38, begin: 172.750, index: 464 },
  { text: "na,", duration: 0.38, begin: 173.000, index: 465 },
  { text: " on", duration: 0.38, begin: 173.750, index: 466 },
  { text: "la", duration: 0.38, begin: 174.000, index: 467 },
  { text: "rı", duration: 0.38, begin: 174.250, index: 468 },
  { text: " sir", duration: 0.38, begin: 174.500, index: 469 },
  { text: "ke", duration: 0.38, begin: 174.750, index: 470 },
  { text: " gö", duration: 0.38, begin: 175.250, index: 471 },
  { text: "tü", duration: 0.38, begin: 175.500, index: 472 },
  { text: "re", duration: 0.38, begin: 175.750, index: 473 },
  { text: "me", duration: 0.38, begin: 176.000, index: 474 },
  { text: "ye", duration: 0.38, begin: 176.250, index: 475 },
  { text: "cek", duration: 0.38, begin: 176.500, index: 476 },
  { text: " ka", duration: 0.38, begin: 176.750, index: 477 },
  { text: "dar", duration: 0.38, begin: 177.000, index: 478 },
  { text: " pa", duration: 0.38, begin: 177.750, index: 479 },
  { text: "ra", duration: 0.38, begin: 178.000, index: 480 },
  { text: "sı", duration: 0.38, begin: 178.250, index: 481 },
  { text: " ol", duration: 0.38, begin: 178.500, index: 482 },
  { text: "ma", duration: 0.38, begin: 178.750, index: 483 },
  { text: "dı", duration: 0.38, begin: 179.000, index: 484 },
  { text: "ğı", duration: 0.38, begin: 179.250, index: 485 },
  { text: "nı", duration: 0.38, begin: 179.500, index: 486 },
  { text: " söy", duration: 0.38, begin: 179.750, index: 487 },
  { text: "le", duration: 0.38, begin: 180.000, index: 488 },
  { text: "ye", duration: 0.38, begin: 180.250, index: 489 },
  { text: "cek", duration: 0.38, begin: 180.500, index: 490 },
  { text: "ti?", duration: 0.38, begin: 180.750, index: 491 },
  { text: " Ba", duration: 0.38, begin: 182.250, index: 492 },
  { text: "bam,", duration: 0.38, begin: 182.500, index: 493 },
  { text: " on", duration: 0.38, begin: 183.250, index: 494 },
  { text: "la", duration: 0.38, begin: 183.500, index: 495 },
  { text: "rı", duration: 0.38, begin: 183.750, index: 496 },
  { text: " gö", duration: 0.38, begin: 183.750, index: 497 },
  { text: "rün", duration: 0.38, begin: 184.000, index: 498 },
  { text: "ce", duration: 0.38, begin: 184.250, index: 499 },
  { text: " e", duration: 0.28, begin: 185.500, index: 500 },
  { text: "li", duration: 0.28, begin: 185.750, index: 501 },
  { text: "ni", duration: 0.28, begin: 186.000, index: 502 },
  { text: " ce", duration: 0.28, begin: 186.250, index: 503 },
  { text: "bi", duration: 0.28, begin: 186.500, index: 504 },
  { text: "ne", duration: 0.28, begin: 186.750, index: 505 },
  { text: " sok", duration: 0.28, begin: 187.000, index: 506 },
  { text: "tu,", duration: 0.28, begin: 187.250, index: 507 },
  { text: " ce", duration: 0.28, begin: 188.250, index: 508 },
  { text: "bin", duration: 0.28, begin: 188.500, index: 509 },
  { text: "den", duration: 0.28, begin: 188.750, index: 510 },
  { text: " bir", duration: 0.28, begin: 189.500, index: 511 },
  { text: " Yir", duration: 0.28, begin: 190.000, index: 512 },
  { text: "mi", duration: 0.28, begin: 190.250, index: 513 },
  { text: " do", duration: 0.28, begin: 190.500, index: 514 },
  { text: "lar", duration: 0.28, begin: 190.750, index: 515 },
  { text: " çı", duration: 0.28, begin: 191.000, index: 516 },
  { text: "kar", duration: 0.28, begin: 191.250, index: 517 },
  { text: "dı", duration: 0.28, begin: 191.500, index: 518 },
  { text: " ve", duration: 0.28, begin: 191.750, index: 519 },
  { text: " ye", duration: 0.28, begin: 192.500, index: 520 },
  { text: "re", duration: 0.28, begin: 192.750, index: 521 },
  { text: " dü", duration: 0.28, begin: 193.000, index: 522 },
  { text: "şür", duration: 0.28, begin: 193.250, index: 523 },
  { text: "dü.", duration: 0.28, begin: 193.500, index: 524 },
  { text: " Son", duration: 0.28, begin: 194.750, index: 525 },
  { text: "ra", duration: 0.28, begin: 195.000, index: 526 },
  { text: " ye", duration: 0.28, begin: 195.250, index: 527 },
  { text: "re", duration: 0.28, begin: 195.500, index: 528 },
  { text: " e", duration: 0.28, begin: 195.750, index: 529 },
  { text: "ğil", duration: 0.28, begin: 196.000, index: 530 },
  { text: "di,", duration: 0.28, begin: 196.250, index: 531 },
  { text: " pa", duration: 0.28, begin: 197.250, index: 532 },
  { text: "ra", duration: 0.28, begin: 197.500, index: 533 },
  { text: "yı", duration: 0.28, begin: 197.750, index: 534 },
  { text: " yer", duration: 0.28, begin: 198.000, index: 535 },
  { text: "den", duration: 0.28, begin: 198.250, index: 536 },
  { text: " al", duration: 0.28, begin: 198.500, index: 537 },
  { text: "dı,", duration: 0.28, begin: 198.750, index: 538 },
  { text: " a", duration: 0.28, begin: 199.750, index: 539 },
  { text: "da", duration: 0.28, begin: 200.000, index: 540 },
  { text: "mın", duration: 0.28, begin: 200.250, index: 541 },
  { text: " o", duration: 0.28, begin: 200.750, index: 542 },
  { text: "mu", duration: 0.28, begin: 201.000, index: 543 },
  { text: "zu", duration: 0.28, begin: 201.250, index: 544 },
  { text: "na", duration: 0.28, begin: 201.500, index: 545 },
  { text: " do", duration: 0.28, begin: 201.750, index: 546 },
  { text: "kun", duration: 0.28, begin: 202.000, index: 547 },
  { text: "du", duration: 0.28, begin: 202.250, index: 548 },
  { text: " ve", duration: 0.28, begin: 202.750, index: 549 },
  { text: " o", duration: 0.28, begin: 203.500, index: 550 },
  { text: "na:", duration: 0.28, begin: 203.750, index: 551 },
  { text: " Af", duration: 0.28, begin: 204.750, index: 552 },
  { text: "fe", duration: 0.28, begin: 205.000, index: 553 },
  { text: "der", duration: 0.28, begin: 205.250, index: 554 },
  { text: "si", duration: 0.28, begin: 205.500, index: 555 },
  { text: "niz,", duration: 0.28, begin: 205.750, index: 556 },
  { text: " bu", duration: 0.28, begin: 206.750, index: 557 },
  { text: " pa", duration: 0.28, begin: 207.000, index: 558 },
  { text: "ra", duration: 0.28, begin: 207.250, index: 559 },
  { text: " ce", duration: 0.28, begin: 207.500, index: 560 },
  { text: "bi", duration: 0.28, begin: 207.750, index: 561 },
  { text: "niz", duration: 0.28, begin: 208.000, index: 562 },
  { text: "den", duration: 0.28, begin: 208.250, index: 563 },
  { text: " düş", duration: 0.28, begin: 208.500, index: 564 },
  { text: "tü", duration: 0.28, begin: 208.750, index: 565 },
  { text: " de", duration: 0.28, begin: 209.250, index: 566 },
  { text: "di.", duration: 0.28, begin: 209.500, index: 567 },
  { text: " A", duration: 0.28, begin: 210.750, index: 568 },
  { text: "dam", duration: 0.28, begin: 211.000, index: 569 },
  { text: " o", duration: 0.28, begin: 212.000, index: 570 },
  { text: "lan", duration: 0.28, begin: 212.250, index: 571 },
  { text: " bi", duration: 0.28, begin: 212.500, index: 572 },
  { text: "te", duration: 0.28, begin: 212.750, index: 573 },
  { text: "ni", duration: 0.28, begin: 213.000, index: 574 },
  { text: " an", duration: 0.28, begin: 213.250, index: 575 },
  { text: "la", duration: 0.28, begin: 213.500, index: 576 },
  { text: "mış", duration: 0.28, begin: 213.750, index: 577 },
  { text: "tı.", duration: 0.28, begin: 214.000, index: 578 },
  { text: " Di", duration: 0.28, begin: 215.000, index: 579 },
  { text: "len", duration: 0.28, begin: 215.250, index: 580 },
  { text: "mi", duration: 0.28, begin: 215.500, index: 581 },
  { text: "yor", duration: 0.28, begin: 215.750, index: 582 },
  { text: "du", duration: 0.28, begin: 216.000, index: 583 },
  { text: " a", duration: 0.28, begin: 216.250, index: 584 },
  { text: "ma", duration: 0.28, begin: 216.500, index: 585 },
  { text: " çok", duration: 0.28, begin: 217.250, index: 586 },
  { text: " ça", duration: 0.28, begin: 217.500, index: 587 },
  { text: "re", duration: 0.28, begin: 217.750, index: 588 },
  { text: "siz", duration: 0.28, begin: 218.000, index: 589 },
  { text: "di.", duration: 0.28, begin: 218.250, index: 590 },
  { text: " U", duration: 0.28, begin: 219.750, index: 591 },
  { text: "tanç", duration: 0.28, begin: 220.000, index: 592 },
  { text: " duy", duration: 0.28, begin: 220.250, index: 593 },
  { text: "du", duration: 0.28, begin: 220.500, index: 594 },
  { text: "ğu", duration: 0.28, begin: 220.750, index: 595 },
  { text: " ve", duration: 0.28, begin: 221.000, index: 596 },
  { text: " çok", duration: 0.28, begin: 221.750, index: 597 },
  { text: " ü", duration: 0.28, begin: 222.000, index: 598 },
  { text: "zül", duration: 0.28, begin: 222.250, index: 599 },
  { text: "dü", duration: 0.28, begin: 222.500, index: 600 },
  { text: "ğü", duration: 0.28, begin: 222.750, index: 601 },
  { text: " bu", duration: 0.28, begin: 223.000, index: 602 },
  { text: " du", duration: 0.28, begin: 223.250, index: 603 },
  { text: "rum", duration: 0.28, begin: 223.500, index: 604 },
  { text: " kar", duration: 0.28, begin: 223.750, index: 605 },
  { text: "şı", duration: 0.28, begin: 224.000, index: 606 },
  { text: "sın", duration: 0.28, begin: 224.250, index: 607 },
  { text: "da", duration: 0.28, begin: 224.500, index: 608 },
  { text: " ya", duration: 0.28, begin: 225.000, index: 609 },
  { text: "pı", duration: 0.28, begin: 225.250, index: 610 },
  { text: "lan", duration: 0.28, begin: 225.500, index: 611 },
  { text: " yar", duration: 0.28, begin: 226.000, index: 612 },
  { text: "dı", duration: 0.28, begin: 226.250, index: 613 },
  { text: "mı", duration: 0.28, begin: 226.500, index: 614 },
  { text: " min", duration: 0.28, begin: 227.500, index: 615 },
  { text: "net", duration: 0.28, begin: 227.750, index: 616 },
  { text: "le", duration: 0.28, begin: 228.000, index: 617 },
  { text: " kar", duration: 0.28, begin: 228.250, index: 618 },
  { text: "şı", duration: 0.28, begin: 228.500, index: 619 },
  { text: "la", duration: 0.28, begin: 228.750, index: 620 },
  { text: "mış", duration: 0.28, begin: 229.000, index: 621 },
  { text: "tı.", duration: 0.28, begin: 229.250, index: 622 },
  { text: " Ba", duration: 0.28, begin: 230.500, index: 623 },
  { text: "ba", duration: 0.28, begin: 230.750, index: 624 },
  { text: "mın", duration: 0.28, begin: 231.000, index: 625 },
  { text: " göz", duration: 0.28, begin: 231.250, index: 626 },
  { text: "le", duration: 0.28, begin: 231.500, index: 627 },
  { text: "ri", duration: 0.28, begin: 231.750, index: 628 },
  { text: "nin", duration: 0.28, begin: 232.000, index: 629 },
  { text: " i", duration: 0.28, begin: 232.500, index: 630 },
  { text: "çi", duration: 0.28, begin: 232.750, index: 631 },
  { text: "ne", duration: 0.28, begin: 233.000, index: 632 },
  { text: " bak", duration: 0.28, begin: 233.250, index: 633 },
  { text: "tı,", duration: 0.28, begin: 233.500, index: 634 },
  { text: " e", duration: 0.28, begin: 234.750, index: 635 },
  { text: "li", duration: 0.28, begin: 235.000, index: 636 },
  { text: " i", duration: 0.28, begin: 235.250, index: 637 },
  { text: "ki", duration: 0.28, begin: 235.750, index: 638 },
  { text: " e", duration: 0.28, begin: 236.000, index: 639 },
  { text: "li", duration: 0.28, begin: 236.250, index: 640 },
  { text: "nin", duration: 0.28, begin: 236.500, index: 641 },
  { text: " a", duration: 0.28, begin: 236.750, index: 642 },
  { text: "ra", duration: 0.28, begin: 237.000, index: 643 },
  { text: "sın", duration: 0.28, begin: 237.250, index: 644 },
  { text: "da,", duration: 0.28, begin: 237.500, index: 645 },
  { text: " yir", duration: 0.28, begin: 238.000, index: 646 },
  { text: "mi", duration: 0.28, begin: 238.250, index: 647 },
  { text: " do", duration: 0.28, begin: 238.500, index: 648 },
  { text: "la", duration: 0.28, begin: 238.750, index: 649 },
  { text: "rı", duration: 0.28, begin: 239.000, index: 650 },
  { text: " al", duration: 0.28, begin: 239.250, index: 651 },
  { text: "dı.", duration: 0.28, begin: 239.500, index: 652 },
  { text: " Du", duration: 0.28, begin: 240.750, index: 653 },
  { text: "dak", duration: 0.28, begin: 241.000, index: 654 },
  { text: "la", duration: 0.28, begin: 241.250, index: 655 },
  { text: "rı", duration: 0.28, begin: 241.500, index: 656 },
  { text: " tit", duration: 0.28, begin: 241.750, index: 657 },
  { text: "rer", duration: 0.28, begin: 242.000, index: 658 },
  { text: "ken,", duration: 0.28, begin: 242.250, index: 659 },
  { text: " ba", duration: 0.28, begin: 243.250, index: 660 },
  { text: "ba", duration: 0.28, begin: 243.500, index: 661 },
  { text: "ma:", duration: 0.28, begin: 243.750, index: 662 },
  { text: " Te", duration: 0.28, begin: 244.750, index: 663 },
  { text: "şek", duration: 0.28, begin: 245.000, index: 664 },
  { text: "kür", duration: 0.28, begin: 245.250, index: 665 },
  { text: " e", duration: 0.28, begin: 245.500, index: 666 },
  { text: "de", duration: 0.28, begin: 245.750, index: 667 },
  { text: "rim,", duration: 0.28, begin: 246.000, index: 668 },
  { text: " çok", duration: 0.28, begin: 247.000, index: 669 },
  { text: " te", duration: 0.28, begin: 247.250, index: 670 },
  { text: "şek", duration: 0.28, begin: 247.500, index: 671 },
  { text: "kür", duration: 0.28, begin: 247.750, index: 672 },
  { text: " e", duration: 0.28, begin: 248.000, index: 673 },
  { text: "de", duration: 0.28, begin: 248.250, index: 674 },
  { text: "rim", duration: 0.28, begin: 248.500, index: 675 },
  { text: " ba", duration: 0.28, begin: 248.750, index: 676 },
  { text: "yım.", duration: 0.28, begin: 249.000, index: 677 },
  { text: " Bu", duration: 0.28, begin: 250.000, index: 678 },
  { text: " yap", duration: 0.28, begin: 250.250, index: 679 },
  { text: "tı", duration: 0.28, begin: 250.500, index: 680 },
  { text: "ğı", duration: 0.28, begin: 250.750, index: 681 },
  { text: "nı", duration: 0.28, begin: 251.000, index: 682 },
  { text: "zın,", duration: 0.28, begin: 251.250, index: 683 },
  { text: " be", duration: 0.28, begin: 252.250, index: 684 },
  { text: "nim", duration: 0.28, begin: 252.500, index: 685 },
  { text: " ve", duration: 0.28, begin: 252.750, index: 686 },
  { text: " a", duration: 0.28, begin: 253.250, index: 687 },
  { text: "i", duration: 0.28, begin: 253.500, index: 688 },
  { text: "lem", duration: 0.28, begin: 253.750, index: 689 },
  { text: " i", duration: 0.28, begin: 254.000, index: 690 },
  { text: "çin", duration: 0.28, begin: 254.250, index: 691 },
  { text: " ö", duration: 0.28, begin: 254.500, index: 692 },
  { text: "ne", duration: 0.28, begin: 254.750, index: 693 },
  { text: "mi", duration: 0.28, begin: 255.000, index: 694 },
  { text: " çok", duration: 0.28, begin: 255.250, index: 695 },
  { text: " bü", duration: 0.28, begin: 255.500, index: 696 },
  { text: "yük", duration: 0.28, begin: 255.750, index: 697 },
  { text: " de", duration: 0.28, begin: 256.750, index: 698 },
  { text: "di.", duration: 0.28, begin: 257.000, index: 699 },
  { text: " Biz", duration: 0.28, begin: 258.250, index: 700 },
  { text: " ba", duration: 0.28, begin: 258.500, index: 701 },
  { text: "bam", duration: 0.28, begin: 258.750, index: 702 },
  { text: "la", duration: 0.28, begin: 259.000, index: 703 },
  { text: " a", duration: 0.28, begin: 259.250, index: 704 },
  { text: "ra", duration: 0.28, begin: 259.500, index: 705 },
  { text: "ba", duration: 0.28, begin: 259.750, index: 706 },
  { text: "mı", duration: 0.28, begin: 260.000, index: 707 },
  { text: "za", duration: 0.28, begin: 260.250, index: 708 },
  { text: " bin", duration: 0.28, begin: 260.500, index: 709 },
  { text: "dik", duration: 0.28, begin: 260.750, index: 710 },
  { text: " ve", duration: 0.28, begin: 261.250, index: 711 },
  { text: " e", duration: 0.28, begin: 261.750, index: 712 },
  { text: "vi", duration: 0.28, begin: 262.000, index: 713 },
  { text: "mi", duration: 0.28, begin: 262.250, index: 714 },
  { text: "ze", duration: 0.28, begin: 262.500, index: 715 },
  { text: " dön", duration: 0.28, begin: 262.750, index: 716 },
  { text: "dük.", duration: 0.28, begin: 263.000, index: 717 },
  { text: " O", duration: 0.28, begin: 264.000, index: 718 },
  { text: " ge", duration: 0.28, begin: 264.250, index: 719 },
  { text: "ce", duration: 0.28, begin: 264.500, index: 720 },
  { text: " sir", duration: 0.28, begin: 265.500, index: 721 },
  { text: "ke", duration: 0.28, begin: 265.750, index: 722 },
  { text: " gi", duration: 0.28, begin: 266.000, index: 723 },
  { text: "de", duration: 0.28, begin: 266.250, index: 724 },
  { text: "me", duration: 0.28, begin: 266.500, index: 725 },
  { text: "dik,", duration: 0.28, begin: 266.750, index: 726 },
  { text: " a", duration: 0.28, begin: 267.500, index: 727 },
  { text: "ma", duration: 0.28, begin: 267.750, index: 728 },
  { text: " bu", duration: 0.28, begin: 268.000, index: 729 },
  { text: "nun", duration: 0.28, begin: 268.250, index: 730 },
  { text: " hiç", duration: 0.28, begin: 268.500, index: 731 },
  { text: " ö", duration: 0.28, begin: 268.750, index: 732 },
  { text: "ne", duration: 0.28, begin: 269.000, index: 733 },
  { text: "mi", duration: 0.28, begin: 269.250, index: 734 },
  { text: " yok", duration: 0.28, begin: 269.500, index: 735 },
  { text: "tu.", duration: 0.28, begin: 269.750, index: 736 },
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
  <Link href="/dashboard/stories/hemen-mi-olecegim" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/bambu-agaci" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/2-4.mp3"
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