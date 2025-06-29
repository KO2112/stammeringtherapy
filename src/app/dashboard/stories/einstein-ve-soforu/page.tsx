"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, ArrowLeft, SkipForward, SkipBack, ChevronRight,ChevronLeft} from "lucide-react"
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
  // Title
  { text: "Eins", duration: 0.38, begin: 0.500, index: 1, isTitle: true, isCenter: true },
  { text: "tein", duration: 0.38, begin: 1.000, index: 2, isTitle: true, isCenter: true },
  { text: " ve", duration: 0.38, begin: 1.250, index: 3, isTitle: true, isCenter: true },
  { text: " Şo", duration: 0.38, begin: 1.500, index: 4, isTitle: true, isCenter: true },
  { text: "fö", duration: 0.28, begin: 1.750, index: 5, isTitle: true, isCenter: true },
  { text: "rü", duration: 0.28, begin: 2.000, index: 6, isTitle: true, isCenter: true },

  // Story content
  { text: " Eins", duration: 0.28, begin: 3.000, index: 7 },
  { text: "tein", duration: 0.28, begin: 3.250, index: 8 },
  { text: " kon", duration: 0.28, begin: 3.750, index: 9 },
  { text: "fe", duration: 0.28, begin: 4.000, index: 10 },
  { text: "rans", duration: 0.28, begin: 4.250, index: 11 },
  { text: "la", duration: 0.28, begin: 4.500, index: 12 },
  { text: "rı", duration: 0.28, begin: 4.750, index: 13 },
  { text: "na", duration: 0.28, begin: 5.000, index: 14 },
  { text: " hep", duration: 0.18, begin: 5.250, index: 15 },
  { text: " ö", duration: 0.18, begin: 5.500, index: 16 },
  { text: "zel", duration: 0.18, begin: 5.750, index: 17 },
  { text: " şo", duration: 0.18, begin: 6.000, index: 18 },
  { text: "fö", duration: 0.18, begin: 6.250, index: 19 },
  { text: "rü", duration: 0.18, begin: 6.500, index: 20 },
  { text: " i", duration: 0.28, begin: 6.700, index: 21 },
  { text: "le", duration: 0.28, begin: 6.900, index: 22 },
  { text: " gi", duration: 0.28, begin: 7.100, index: 23 },
  { text: "der", duration: 0.28, begin: 7.300, index: 24 },
  { text: "di.", duration: 0.28, begin: 7.500, index: 25 },
  { text: " Yi", duration: 0.28, begin: 8.500, index: 26 },
  { text: "ne", duration: 0.28, begin: 8.750, index: 27 },
  { text: " bir", duration: 0.28, begin: 9.000, index: 28 },
  { text: " kon", duration: 0.28, begin: 9.250, index: 29 },
  { text: "fe", duration: 0.28, begin: 9.500, index: 30 },
  { text: "ran", duration: 0.28, begin: 9.750, index: 31 },
  { text: "sa", duration: 0.28, begin: 10.000, index: 32 },
  { text: " git", duration: 0.28, begin: 10.250, index: 33 },
  { text: "mek", duration: 0.28, begin: 10.500, index: 34 },
  { text: " ü", duration: 0.28, begin: 10.750, index: 35 },
  { text: "ze", duration: 0.28, begin: 11.000, index: 36 },
  { text: "re", duration: 0.28, begin: 11.250, index: 37 },
  { text: " yo", duration: 0.28, begin: 11.750, index: 38 },
  { text: "la", duration: 0.28, begin: 12.000, index: 39 },
  { text: " çık", duration: 0.28, begin: 12.250, index: 40 },
  { text: "tık", duration: 0.28, begin: 12.500, index: 41 },
  { text: "la", duration: 0.28, begin: 12.750, index: 42 },
  { text: "rı", duration: 0.28, begin: 13.000, index: 43 },
  { text: " bir", duration: 0.28, begin: 13.250, index: 44 },
  { text: " gün,", duration: 0.28, begin: 13.500, index: 45 },
  { text: " şo", duration: 0.28, begin: 14.250, index: 46 },
  { text: "fö", duration: 0.28, begin: 14.500, index: 47 },
  { text: "rü", duration: 0.28, begin: 14.750, index: 48 },
  { text: " Eins", duration: 0.28, begin: 15.000, index: 49 },
  { text: "tein", duration: 0.28, begin: 15.250, index: 50 },
  { text: "'a;", duration: 0.28, begin: 15.500, index: 51 },
  { text: " \"E", duration: 0.28, begin: 16.500, index: 52 },
  { text: "fen", duration: 0.28, begin: 16.750, index: 53 },
  { text: "dim,", duration: 0.28, begin: 17.000, index: 54 },
  { text: " u", duration: 0.28, begin: 17.750, index: 55 },
  { text: "zun", duration: 0.28, begin: 18.000, index: 56 },
  { text: " za", duration: 0.28, begin: 18.500, index: 57 },
  { text: "man", duration: 0.28, begin: 18.750, index: 58 },
  { text: "dır", duration: 0.28, begin: 19.000, index: 59 },
  { text: " siz", duration: 0.28, begin: 19.500, index: 60 },
  { text: " ko", duration: 0.28, begin: 19.750, index: 61 },
  { text: "nuş", duration: 0.28, begin: 20.000, index: 62 },
  { text: "ma", duration: 0.28, begin: 20.250, index: 63 },
  { text: "nı", duration: 0.28, begin: 20.500, index: 64 },
  { text: "zı", duration: 0.28, begin: 20.750, index: 65 },
  { text: " ya", duration: 0.28, begin: 21.000, index: 66 },
  { text: "par", duration: 0.28, begin: 21.250, index: 67 },
  { text: "ken", duration: 0.28, begin: 21.500, index: 68 },
  { text: " ben", duration: 0.10, begin: 22.250, index: 69 },
  { text: "de", duration: 0.10, begin: 22.500, index: 70 },
  { text: " ar", duration: 0.10, begin: 22.750, index: 71 },
  { text: "ka", duration: 0.10, begin: 22.950, index: 72 },
  { text: " sı", duration: 0.10, begin: 23.150, index: 73 },
  { text: "ra", duration: 0.10, begin: 23.350, index: 74 },
  { text: "lar", duration: 0.10, begin: 23.550, index: 75 },
  { text: "da", duration: 0.10, begin: 23.750, index: 76 },
  { text: " o", duration: 0.10, begin: 23.950, index: 77 },
  { text: "tu", duration: 0.10, begin: 24.150, index: 78 },
  { text: "rup", duration: 0.10, begin: 24.350, index: 79 },
  { text: " si", duration: 0.10, begin: 24.750, index: 80 },
  { text: "zi", duration: 0.10, begin: 24.950, index: 81 },
  { text: " din", duration: 0.10, begin: 25.150, index: 82 },
  { text: "li", duration: 0.10, begin: 25.350, index: 83 },
  { text: "yo", duration: 0.10, begin: 25.550, index: 84 },
  { text: "rum", duration: 0.10, begin: 25.750, index: 85 },
  { text: " ve", duration: 0.28, begin: 26.550, index: 86 },
  { text: " ar", duration: 0.28, begin: 26.750, index: 87 },
  { text: "tık", duration: 0.28, begin: 26.950, index: 88 },
  { text: " ne", duration: 0.28, begin: 27.350, index: 89 },
  { text: "re", duration: 0.28, begin: 27.550, index: 90 },
  { text: "dey", duration: 0.28, begin: 27.750, index: 91 },
  { text: "se", duration: 0.28, begin: 27.950, index: 92 },
  { text: " söy", duration: 0.28, begin: 28.350, index: 93 },
  { text: "le", duration: 0.28, begin: 28.550, index: 94 },
  { text: "ye", duration: 0.28, begin: 28.750, index: 95 },
  { text: "ce", duration: 0.28, begin: 28.950, index: 96 },
  { text: "ği", duration: 0.28, begin: 29.150, index: 97 },
  { text: "niz", duration: 0.28, begin: 29.350, index: 98 },
  { text: " her", duration: 0.28, begin: 29.750, index: 99 },
  { text: "şe", duration: 0.28, begin: 29.950, index: 100 },
  { text: "yi,", duration: 0.28, begin: 30.150, index: 101 },
  { text: " ke", duration: 0.28, begin: 30.950, index: 102 },
  { text: "li", duration: 0.28, begin: 31.150, index: 103 },
  { text: "me", duration: 0.28, begin: 31.350, index: 104 },
  { text: "si", duration: 0.28, begin: 31.550, index: 105 },
  { text: " ke", duration: 0.28, begin: 31.750, index: 106 },
  { text: "li", duration: 0.28, begin: 31.950, index: 107 },
  { text: "me", duration: 0.28, begin: 32.150, index: 108 },
  { text: "si", duration: 0.28, begin: 32.350, index: 109 },
  { text: "ne", duration: 0.28, begin: 32.550, index: 110 },
  { text: " bi", duration: 0.28, begin: 32.950, index: 111 },
  { text: "li", duration: 0.28, begin: 33.150, index: 112 },
  { text: "yo", duration: 0.28, begin: 33.350, index: 113 },
  { text: "rum.\"", duration: 0.28, begin: 33.550, index: 114 },
  { text: " de", duration: 0.28, begin: 34.150, index: 115 },
  { text: "di.", duration: 0.28, begin: 34.350, index: 116 },
  { text: " Eins", duration: 0.28, begin: 35.350, index: 117 },
  { text: "tein", duration: 0.28, begin: 35.550, index: 118 },
  { text: " gü", duration: 0.28, begin: 36.150, index: 119 },
  { text: "lüm", duration: 0.28, begin: 36.350, index: 120 },
  { text: "se", duration: 0.28, begin: 36.550, index: 121 },
  { text: "ye", duration: 0.28, begin: 36.750, index: 122 },
  { text: "rek", duration: 0.28, begin: 36.950, index: 123 },
  { text: " o", duration: 0.28, begin: 37.350, index: 124 },
  { text: "na", duration: 0.28, begin: 37.550, index: 125 },
  { text: " bir", duration: 0.28, begin: 37.750, index: 126 },
  { text: " ö", duration: 0.28, begin: 38.350, index: 127 },
  { text: "ne", duration: 0.28, begin: 38.550, index: 128 },
  { text: "ri", duration: 0.28, begin: 38.750, index: 129 },
  { text: "de", duration: 0.28, begin: 38.950, index: 130 },
  { text: " bu", duration: 0.28, begin: 39.150, index: 131 },
  { text: "lun", duration: 0.28, begin: 39.350, index: 132 },
  { text: "du:", duration: 0.28, begin: 39.550, index: 133 },
  { text: " \"Pe", duration: 0.28, begin: 40.550, index: 134 },
  { text: "ki,", duration: 0.28, begin: 40.750, index: 135 },
  { text: " şim", duration: 0.28, begin: 41.550, index: 136 },
  { text: "di", duration: 0.28, begin: 41.750, index: 137 },
  { text: " gi", duration: 0.28, begin: 41.950, index: 138 },
  { text: "de", duration: 0.28, begin: 42.150, index: 139 },
  { text: "ce", duration: 0.28, begin: 42.350, index: 140 },
  { text: "ği", duration: 0.28, begin: 42.550, index: 141 },
  { text: "miz", duration: 0.28, begin: 42.750, index: 142 },
  { text: " yer", duration: 0.28, begin: 43.150, index: 143 },
  { text: "de", duration: 0.28, begin: 43.350, index: 144 },
  { text: " be", duration: 0.28, begin: 43.750, index: 145 },
  { text: "ni", duration: 0.28, begin: 43.950, index: 146 },
  { text: " hiç", duration: 0.28, begin: 44.150, index: 147 },
  { text: " ta", duration: 0.28, begin: 44.350, index: 148 },
  { text: "nı", duration: 0.28, begin: 44.550, index: 149 },
  { text: "mı", duration: 0.28, begin: 44.750, index: 150 },
  { text: "yor", duration: 0.28, begin: 44.950, index: 151 },
  { text: "lar.\"", duration: 0.28, begin: 45.150, index: 152 },
  { text: " de", duration: 0.28, begin: 45.950, index: 153 },
  { text: "di.", duration: 0.28, begin: 46.150, index: 154 },
  { text: " \"O", duration: 0.28, begin: 46.950, index: 155 },
  { text: " hal", duration: 0.28, begin: 47.150, index: 156 },
  { text: "de,", duration: 0.28, begin: 47.350, index: 157 },
  { text: " bu", duration: 0.28, begin: 48.150, index: 158 },
  { text: "gün", duration: 0.28, begin: 48.350, index: 159 },
  { text: " pal", duration: 0.28, begin: 48.950, index: 160 },
  { text: "to", duration: 0.28, begin: 49.150, index: 161 },
  { text: " ve", duration: 0.28, begin: 49.350, index: 162 },
  { text: " şap", duration: 0.28, begin: 49.750, index: 163 },
  { text: "ka", duration: 0.28, begin: 49.950, index: 164 },
  { text: "la", duration: 0.28, begin: 50.150, index: 165 },
  { text: "rı", duration: 0.28, begin: 50.350, index: 166 },
  { text: "mı", duration: 0.28, begin: 50.550, index: 167 },
  { text: "zı", duration: 0.28, begin: 50.750, index: 168 },
  { text: " de", duration: 0.28, begin: 51.150, index: 169 },
  { text: "ğiş", duration: 0.28, begin: 51.350, index: 170 },
  { text: "ti", duration: 0.28, begin: 51.550, index: 171 },
  { text: "re", duration: 0.28, begin: 51.750, index: 172 },
  { text: "lim.", duration: 0.28, begin: 51.950, index: 173 },
  { text: " Be", duration: 0.28, begin: 52.750, index: 174 },
  { text: "nim", duration: 0.28, begin: 52.950, index: 175 },
  { text: " ye", duration: 0.28, begin: 53.150, index: 176 },
  { text: "ri", duration: 0.28, begin: 53.350, index: 177 },
  { text: "me", duration: 0.28, begin: 53.550, index: 178 },
  { text: " ko", duration: 0.28, begin: 53.750, index: 179 },
  { text: "nuş", duration: 0.28, begin: 53.950, index: 180 },
  { text: "ma", duration: 0.28, begin: 54.150, index: 181 },
  { text: "yı", duration: 0.28, begin: 54.350, index: 182 },
  { text: " sen", duration: 0.28, begin: 54.750, index: 183 },
  { text: " yap.", duration: 0.28, begin: 54.950, index: 184 },
  { text: " Ben", duration: 0.28, begin: 56.150, index: 185 },
  { text: "de", duration: 0.28, begin: 56.350, index: 186 },
  { text: " ar", duration: 0.28, begin: 56.550, index: 187 },
  { text: "ka", duration: 0.28, begin: 56.750, index: 188 },
  { text: " sı", duration: 0.28, begin: 56.950, index: 189 },
  { text: "ra", duration: 0.28, begin: 57.150, index: 190 },
  { text: "lar", duration: 0.28, begin: 57.350, index: 191 },
  { text: "da", duration: 0.28, begin: 57.550, index: 192 },
  { text: " se", duration: 0.28, begin: 57.950, index: 193 },
  { text: "ni", duration: 0.28, begin: 58.150, index: 194 },
  { text: " din", duration: 0.28, begin: 58.350, index: 195 },
  { text: "le", duration: 0.28, begin: 58.550, index: 196 },
  { text: "rim.\"", duration: 0.28, begin: 58.750, index: 197 },
  { text: " Şo", duration: 0.28, begin: 59.950, index: 198 },
  { text: "för", duration: 0.28, begin: 60.150, index: 199 },
  { text: " ger", duration: 0.28, begin: 61.150, index: 200 },
  { text: "çek", duration: 0.28, begin: 61.350, index: 201 },
  { text: "ten", duration: 0.28, begin: 61.550, index: 202 },
  { text: " çok", duration: 0.28, begin: 62.150, index: 203 },
  { text: " ba", duration: 0.28, begin: 62.350, index: 204 },
  { text: "şa", duration: 0.28, begin: 62.550, index: 205 },
  { text: "rı", duration: 0.28, begin: 62.750, index: 206 },
  { text: "lı", duration: 0.28, begin: 62.950, index: 207 },
  { text: " bir", duration: 0.28, begin: 63.350, index: 208 },
  { text: " ko", duration: 0.28, begin: 63.550, index: 209 },
  { text: "nuş", duration: 0.28, begin: 63.750, index: 210 },
  { text: "ma", duration: 0.28, begin: 63.950, index: 211 },
  { text: " yap", duration: 0.28, begin: 64.150, index: 212 },
  { text: "tı", duration: 0.28, begin: 64.350, index: 213 },
  { text: " ve", duration: 0.28, begin: 65.550, index: 214 },
  { text: " so", duration: 0.28, begin: 65.750, index: 215 },
  { text: "ru", duration: 0.28, begin: 65.950, index: 216 },
  { text: "lan", duration: 0.28, begin: 66.150, index: 217 },
  { text: " tüm", duration: 0.28, begin: 66.550, index: 218 },
  { text: " so", duration: 0.28, begin: 66.750, index: 219 },
  { text: "ru", duration: 0.28, begin: 66.950, index: 220 },
  { text: "la", duration: 0.28, begin: 67.150, index: 221 },
  { text: "rı", duration: 0.28, begin: 67.350, index: 222 },
  { text: " doğ", duration: 0.28, begin: 67.750, index: 223 },
  { text: "ru", duration: 0.28, begin: 67.950, index: 224 },
  { text: " ya", duration: 0.28, begin: 68.150, index: 225 },
  { text: "nıt", duration: 0.28, begin: 68.350, index: 226 },
  { text: "la", duration: 0.28, begin: 68.550, index: 227 },
  { text: "dı.", duration: 0.28, begin: 68.750, index: 228 },
  { text: " Tam", duration: 0.28, begin: 69.950, index: 229 },
  { text: " ye", duration: 0.28, begin: 70.150, index: 230 },
  { text: "ri", duration: 0.28, begin: 70.350, index: 231 },
  { text: "ne", duration: 0.28, begin: 70.550, index: 232 },
  { text: " o", duration: 0.28, begin: 70.750, index: 233 },
  { text: "tu", duration: 0.28, begin: 70.950, index: 234 },
  { text: "ra", duration: 0.28, begin: 71.150, index: 235 },
  { text: "ca", duration: 0.28, begin: 71.350, index: 236 },
  { text: "ğı", duration: 0.28, begin: 71.550, index: 237 },
  { text: " sı", duration: 0.28, begin: 71.750, index: 238 },
  { text: "ra", duration: 0.28, begin: 71.950, index: 239 },
  { text: "da", duration: 0.28, begin: 72.150, index: 240 },
  { text: " bir", duration: 0.28, begin: 73.150, index: 241 },
  { text: " ki", duration: 0.28, begin: 73.350, index: 242 },
  { text: "şi", duration: 0.28, begin: 73.550, index: 243 },
  { text: " o", duration: 0.28, begin: 74.350, index: 244 },
  { text: " gü", duration: 0.28, begin: 74.550, index: 245 },
  { text: "ne", duration: 0.28, begin: 74.750, index: 246 },
  { text: " ka", duration: 0.28, begin: 74.950, index: 247 },
  { text: "dar", duration: 0.28, begin: 75.150, index: 248 },
  { text: " kon", duration: 0.28, begin: 75.750, index: 249 },
  { text: "fe", duration: 0.28, begin: 75.950, index: 250 },
  { text: "rans", duration: 0.28, begin: 76.150, index: 251 },
  { text: "ta", duration: 0.28, begin: 76.350, index: 252 },
  { text: " so", duration: 0.28, begin: 76.750, index: 253 },
  { text: "rul", duration: 0.28, begin: 76.950, index: 254 },
  { text: "ma", duration: 0.28, begin: 77.150, index: 255 },
  { text: "mış", duration: 0.28, begin: 77.350, index: 256 },
  { text: " bir", duration: 0.28, begin: 77.950, index: 257 },
  { text: " so", duration: 0.28, begin: 78.150, index: 258 },
  { text: "ru", duration: 0.28, begin: 78.350, index: 259 },
  { text: " sor", duration: 0.28, begin: 78.550, index: 260 },
  { text: "du.", duration: 0.28, begin: 78.750, index: 261 },
  { text: " Şo", duration: 0.28, begin: 79.950, index: 262 },
  { text: "för", duration: 0.28, begin: 80.150, index: 263 },
  { text: " hiç", duration: 0.28, begin: 81.150, index: 264 },
  { text: " du", duration: 0.28, begin: 81.350, index: 265 },
  { text: "rak", duration: 0.28, begin: 81.550, index: 266 },
  { text: "sa", duration: 0.28, begin: 81.750, index: 267 },
  { text: "ma", duration: 0.28, begin: 81.950, index: 268 },
  { text: "dan", duration: 0.28, begin: 82.150, index: 269 },
  { text: " so", duration: 0.28, begin: 82.550, index: 270 },
  { text: "ru", duration: 0.28, begin: 82.750, index: 271 },
  { text: "yu", duration: 0.28, begin: 82.950, index: 272 },
  { text: " so", duration: 0.28, begin: 83.150, index: 273 },
  { text: "ran", duration: 0.28, begin: 83.350, index: 274 },
  { text: " ki", duration: 0.28, begin: 83.750, index: 275 },
  { text: "şi", duration: 0.28, begin: 83.950, index: 276 },
  { text: "ye", duration: 0.28, begin: 84.150, index: 277 },
  { text: " dön", duration: 0.28, begin: 84.350, index: 278 },
  { text: "dü", duration: 0.28, begin: 84.550, index: 279 },
  { text: " ve:", duration: 0.28, begin: 84.950, index: 280 },
  { text: " \"Böy", duration: 0.28, begin: 86.150, index: 281 },
  { text: "le", duration: 0.28, begin: 86.350, index: 282 },
  { text: "si", duration: 0.28, begin: 86.550, index: 283 },
  { text: "ne", duration: 0.28, begin: 86.750, index: 284 },
  { text: " ba", duration: 0.28, begin: 87.150, index: 285 },
  { text: "sit", duration: 0.28, begin: 87.350, index: 286 },
  { text: " bir", duration: 0.28, begin: 87.550, index: 287 },
  { text: " so", duration: 0.28, begin: 87.950, index: 288 },
  { text: "ru", duration: 0.28, begin: 88.150, index: 289 },
  { text: " sor", duration: 0.40, begin: 88.350, index: 290 },
  { text: "ma", duration: 0.40, begin: 88.550, index: 291 },
  { text: "nız", duration: 0.40, begin: 88.750, index: 292 },
  { text: " ger", duration: 0.28, begin: 89.950, index: 293 },
  { text: "çek", duration: 0.28, begin: 90.150, index: 294 },
  { text: "ten", duration: 0.28, begin: 90.350, index: 295 },
  { text: " çok", duration: 0.28, begin: 90.750, index: 296 },
  { text: " ga", duration: 0.28, begin: 90.950, index: 297 },
  { text: "rip.\"", duration: 0.28, begin: 91.150, index: 298 },
  { text: " de", duration: 0.28, begin: 91.950, index: 299 },
  { text: "di.", duration: 0.28, begin: 92.150, index: 300 },
  { text: " Son", duration: 0.40, begin: 93.150, index: 301 },
  { text: "ra", duration: 0.40, begin: 93.350, index: 302 },
  { text: "da", duration: 0.40, begin: 93.550, index: 303 },
  { text: " Eins", duration: 0.28, begin: 93.950, index: 304 },
  { text: "tein", duration: 0.28, begin: 94.150, index: 305 },
  { text: "'i", duration: 0.28, begin: 94.550, index: 306 },
  { text: " i", duration: 0.28, begin: 94.950, index: 307 },
  { text: "şa", duration: 0.28, begin: 95.150, index: 308 },
  { text: "ret", duration: 0.28, begin: 95.350, index: 309 },
  { text: " e", duration: 0.28, begin: 95.550, index: 310 },
  { text: "de", duration: 0.28, begin: 95.750, index: 311 },
  { text: "rek", duration: 0.28, begin: 95.950, index: 312 },
  { text: " şöy", duration: 0.28, begin: 96.350, index: 313 },
  { text: "le", duration: 0.28, begin: 96.550, index: 314 },
  { text: " de", duration: 0.28, begin: 96.750, index: 315 },
  { text: "vam", duration: 0.28, begin: 96.950, index: 316 },
  { text: " et", duration: 0.28, begin: 97.350, index: 317 },
  { text: "ti:", duration: 0.28, begin: 97.550, index: 318 },
  { text: " \"Şim", duration: 0.28, begin: 98.550, index: 319 },
  { text: "di", duration: 0.28, begin: 98.750, index: 320 },
  { text: " si", duration: 0.28, begin: 99.150, index: 321 },
  { text: "ze", duration: 0.28, begin: 99.350, index: 322 },
  { text: " ar", duration: 0.28, begin: 100.350, index: 323 },
  { text: "ka", duration: 0.28, begin: 100.550, index: 324 },
  { text: " sı", duration: 0.28, begin: 100.750, index: 325 },
  { text: "ra", duration: 0.28, begin: 100.950, index: 326 },
  { text: "da", duration: 0.28, begin: 101.150, index: 327 },
  { text: " o", duration: 0.28, begin: 101.350, index: 328 },
  { text: "tu", duration: 0.28, begin: 101.550, index: 329 },
  { text: "ran", duration: 0.28, begin: 101.750, index: 330 },
  { text: " şo", duration: 0.28, begin: 102.150, index: 331 },
  { text: "fö", duration: 0.28, begin: 102.350, index: 332 },
  { text: "rü", duration: 0.28, begin: 102.550, index: 333 },
  { text: "mü", duration: 0.28, begin: 102.750, index: 334 },
  { text: " ça", duration: 0.28, begin: 102.950, index: 335 },
  { text: "ğı", duration: 0.28, begin: 103.150, index: 336 },
  { text: "ra", duration: 0.28, begin: 103.350, index: 337 },
  { text: "ca", duration: 0.28, begin: 103.550, index: 338 },
  { text: "ğım", duration: 0.28, begin: 103.750, index: 339 },
  { text: " ve", duration: 0.28, begin: 104.150, index: 340 },
  { text: " sor", duration: 0.28, begin: 104.950, index: 341 },
  { text: "du", duration: 0.28, begin: 105.150, index: 342 },
  { text: "ğu", duration: 0.28, begin: 105.350, index: 343 },
  { text: "nuz", duration: 0.28, begin: 105.550, index: 344 },
  { text: " so", duration: 0.28, begin: 105.950, index: 345 },
  { text: "ru", duration: 0.28, begin: 106.150, index: 346 },
  { text: "yu", duration: 0.28, begin: 106.350, index: 347 },
  { text: " gö", duration: 0.28, begin: 106.550, index: 348 },
  { text: "re", duration: 0.28, begin: 106.750, index: 349 },
  { text: "cek", duration: 0.28, begin: 106.950, index: 350 },
  { text: "si", duration: 0.28, begin: 107.150, index: 351 },
  { text: "niz", duration: 0.28, begin: 107.350, index: 352 },
  { text: " o", duration: 0.28, begin: 108.150, index: 353 },
  { text: " bi", duration: 0.28, begin: 108.350, index: 354 },
  { text: "le", duration: 0.28, begin: 108.550, index: 355 },
  { text: " ya", duration: 0.28, begin: 108.750, index: 356 },
  { text: "nıt", duration: 0.28, begin: 108.950, index: 357 },
  { text: "la", duration: 0.28, begin: 109.150, index: 358 },
  { text: "ya", duration: 0.28, begin: 109.350, index: 359 },
  { text: "cak.\"", duration: 0.28, begin: 109.550, index: 360 }
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
  <Link href="/dashboard/stories/elimden-gelen-cabayi-gosterecegim" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/firtina-ciktiginda-uyuyabilirim" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/4-3.mp3"
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