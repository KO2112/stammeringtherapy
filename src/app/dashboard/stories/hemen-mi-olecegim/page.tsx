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
  { text: "", duration: 0.154, begin: 0.500, index: 0 },
  
  // Title
  { text: "He", duration: 0.53, begin: 0.500, index: 1, isTitle: true, isCenter: true },
  { text: "men", duration: 0.53, begin: 0.750, index: 2, isTitle: true, isCenter: true },
  { text: " mi", duration: 0.53, begin: 1.000, index: 3, isTitle: true, isCenter: true },
  { text: " Ö", duration: 0.53, begin: 1.250, index: 4, isTitle: true, isCenter: true },
  { text: "le", duration: 0.53, begin: 1.500, index: 5, isTitle: true, isCenter: true },
  { text: "ce", duration: 0.53, begin: 1.750, index: 6, isTitle: true, isCenter: true },
  { text: "ğim?", duration: 0.53, begin: 2.000, index: 7, isTitle: true, isCenter: true },
  
  // Story content
  { text: " Yıl", duration: 0.53, begin: 3.000, index: 8 },
  { text: "lar", duration: 0.53, begin: 3.250, index: 9 },
  { text: " ön", duration: 0.53, begin: 3.500, index: 10 },
  { text: "ce", duration: 0.53, begin: 3.750, index: 11 },
  { text: " Stan", duration: 0.53, begin: 4.750, index: 12 },
  { text: "ford", duration: 0.53, begin: 5.000, index: 13 },
  { text: " Has", duration: 0.53, begin: 5.250, index: 14 },
  { text: "ta", duration: 0.53, begin: 5.500, index: 15 },
  { text: "ne", duration: 0.53, begin: 5.750, index: 16 },
  { text: "sin", duration: 0.53, begin: 6.000, index: 17 },
  { text: "'de", duration: 0.53, begin: 6.250, index: 18 },
  { text: " gö", duration: 0.53, begin: 7.250, index: 19 },
  { text: "nül", duration: 0.53, begin: 7.500, index: 20 },
  { text: "lü", duration: 0.53, begin: 7.750, index: 21 },
  { text: " o", duration: 0.53, begin: 8.000, index: 22 },
  { text: "la", duration: 0.53, begin: 8.250, index: 23 },
  { text: "rak", duration: 0.53, begin: 8.500, index: 24 },
  { text: " ça", duration: 0.53, begin: 8.750, index: 25 },
  { text: "lış", duration: 0.53, begin: 9.000, index: 26 },
  { text: "tı", duration: 0.53, begin: 9.250, index: 27 },
  { text: "ğım", duration: 0.53, begin: 9.500, index: 28 },
  { text: " za", duration: 0.53, begin: 9.750, index: 29 },
  { text: "man,", duration: 0.53, begin: 10.000, index: 30 },
  { text: " çok", duration: 0.53, begin: 11.250, index: 31 },
  { text: " cid", duration: 0.53, begin: 11.500, index: 32 },
  { text: "di", duration: 0.53, begin: 11.750, index: 33 },
  { text: " ve", duration: 0.53, begin: 12.000, index: 34 },
  { text: " az", duration: 0.53, begin: 12.250, index: 35 },
  { text: " rast", duration: 0.53, begin: 12.750, index: 36 },
  { text: "la", duration: 0.53, begin: 13.000, index: 37 },
  { text: "nan", duration: 0.53, begin: 13.250, index: 38 },
  { text: " bir", duration: 0.53, begin: 13.500, index: 39 },
  { text: " has", duration: 0.53, begin: 14.750, index: 40 },
  { text: "ta", duration: 0.53, begin: 15.000, index: 41 },
  { text: "lı", duration: 0.53, begin: 15.250, index: 42 },
  { text: "ğa", duration: 0.53, begin: 15.500, index: 43 },
  { text: " ya", duration: 0.53, begin: 15.750, index: 44 },
  { text: "ka", duration: 0.53, begin: 16.000, index: 45 },
  { text: "lan", duration: 0.53, begin: 16.250, index: 46 },
  { text: "mış", duration: 0.53, begin: 16.500, index: 47 },
  { text: " Li", duration: 0.53, begin: 17.250, index: 48 },
  { text: "za", duration: 0.53, begin: 17.500, index: 49 },
  { text: " a", duration: 0.53, begin: 17.750, index: 50 },
  { text: "dın", duration: 0.53, begin: 18.000, index: 51 },
  { text: "da", duration: 0.53, begin: 18.250, index: 52 },
  { text: " bir", duration: 0.53, begin: 18.750, index: 53 },
  { text: " kız", duration: 0.53, begin: 19.000, index: 54 },
  { text: " ta", duration: 0.53, begin: 19.250, index: 55 },
  { text: "nı", duration: 0.53, begin: 19.500, index: 56 },
  { text: "dım.", duration: 0.53, begin: 19.750, index: 57 },
  { text: " İ", duration: 0.48, begin: 21.000, index: 58 },
  { text: "yi", duration: 0.48, begin: 21.250, index: 59 },
  { text: "leş", duration: 0.48, begin: 21.500, index: 60 },
  { text: "me", duration: 0.48, begin: 21.750, index: 61 },
  { text: "si", duration: 0.48, begin: 22.000, index: 62 },
  { text: " i", duration: 0.53, begin: 22.250, index: 63 },
  { text: "çin", duration: 0.53, begin: 22.500, index: 64 },
  { text: " bir", duration: 0.53, begin: 23.250, index: 65 },
  { text: " tek", duration: 0.68, begin: 23.500, index: 66 },
  { text: " yol", duration: 0.68, begin: 23.750, index: 67 },
  { text: " var", duration: 0.68, begin: 24.000, index: 68 },
  { text: "dı.", duration: 0.68, begin: 24.250, index: 69 },
  { text: " Beş", duration: 0.53, begin: 25.750, index: 70 },
  { text: " ya", duration: 0.53, begin: 26.000, index: 71 },
  { text: "şın", duration: 0.53, begin: 26.250, index: 72 },
  { text: "da", duration: 0.53, begin: 26.500, index: 73 },
  { text: "ki", duration: 0.53, begin: 26.750, index: 74 },
  { text: " er", duration: 0.53, begin: 27.000, index: 75 },
  { text: "kek", duration: 0.53, begin: 27.250, index: 76 },
  { text: " kar", duration: 0.68, begin: 27.750, index: 77 },
  { text: "de", duration: 0.68, begin: 28.000, index: 78 },
  { text: "şin", duration: 0.68, begin: 28.250, index: 79 },
  { text: "den", duration: 0.68, begin: 28.500, index: 80 },
  { text: " kan", duration: 0.53, begin: 29.750, index: 81 },
  { text: " nak", duration: 0.53, begin: 30.000, index: 82 },
  { text: "li", duration: 0.53, begin: 30.250, index: 83 },
  { text: " ya", duration: 0.53, begin: 30.500, index: 84 },
  { text: "pıl", duration: 0.53, begin: 30.750, index: 85 },
  { text: "ma", duration: 0.53, begin: 31.000, index: 86 },
  { text: "sı", duration: 0.53, begin: 31.250, index: 87 },
  { text: " ge", duration: 0.53, begin: 31.750, index: 88 },
  { text: "re", duration: 0.53, begin: 32.000, index: 89 },
  { text: "ki", duration: 0.53, begin: 32.250, index: 90 },
  { text: "yor", duration: 0.53, begin: 32.500, index: 91 },
  { text: "du.", duration: 0.53, begin: 32.750, index: 92 },
  { text: " Er", duration: 0.53, begin: 34.250, index: 93 },
  { text: "kek", duration: 0.53, begin: 34.500, index: 94 },
  { text: " kar", duration: 0.53, begin: 34.750, index: 95 },
  { text: "de", duration: 0.53, begin: 35.000, index: 96 },
  { text: "şi", duration: 0.53, begin: 35.250, index: 97 },
  { text: " ay", duration: 0.53, begin: 36.500, index: 98 },
  { text: "nı", duration: 0.53, begin: 36.750, index: 99 },
  { text: " has", duration: 0.53, begin: 37.000, index: 100 },
  { text: "ta", duration: 0.53, begin: 37.250, index: 101 },
  { text: "lı", duration: 0.53, begin: 37.500, index: 102 },
  { text: "ğın", duration: 0.53, begin: 37.750, index: 103 },
  { text: " üs", duration: 0.53, begin: 38.000, index: 104 },
  { text: "te", duration: 0.53, begin: 38.250, index: 105 },
  { text: "sin", duration: 0.53, begin: 38.500, index: 106 },
  { text: "den", duration: 0.53, begin: 38.750, index: 107 },
  { text: " gel", duration: 0.53, begin: 39.250, index: 108 },
  { text: "miş", duration: 0.53, begin: 39.500, index: 109 },
  { text: "ti", duration: 0.53, begin: 39.750, index: 110 },
  { text: " ve", duration: 0.53, begin: 41.250, index: 111 },
  { text: " vü", duration: 0.53, begin: 41.500, index: 112 },
  { text: "cu", duration: 0.53, begin: 41.750, index: 113 },
  { text: "dun", duration: 0.53, begin: 42.000, index: 114 },
  { text: "da", duration: 0.53, begin: 42.250, index: 115 },
  { text: " has", duration: 0.53, begin: 42.500, index: 116 },
  { text: "ta", duration: 0.53, begin: 42.750, index: 117 },
  { text: "lı", duration: 0.53, begin: 43.000, index: 118 },
  { text: "ğı", duration: 0.53, begin: 43.250, index: 119 },
  { text: " ye", duration: 0.53, begin: 43.500, index: 120 },
  { text: "ne", duration: 0.53, begin: 43.750, index: 121 },
  { text: "bi", duration: 0.53, begin: 44.000, index: 122 },
  { text: "le", duration: 0.53, begin: 44.250, index: 123 },
  { text: "cek", duration: 0.53, begin: 44.500, index: 124 },
  { text: " an", duration: 0.53, begin: 45.500, index: 125 },
  { text: "ti", duration: 0.53, begin: 45.750, index: 126 },
  { text: "kor", duration: 0.53, begin: 46.000, index: 127 },
  { text: "lar", duration: 0.53, begin: 46.250, index: 128 },
  { text: " o", duration: 0.68, begin: 46.500, index: 129 },
  { text: "luş", duration: 0.68, begin: 46.750, index: 130 },
  { text: "muş", duration: 0.68, begin: 47.000, index: 131 },
  { text: "tu.", duration: 0.68, begin: 47.250, index: 132 },
  { text: " Dok", duration: 0.53, begin: 48.750, index: 133 },
  { text: "tor", duration: 0.53, begin: 49.000, index: 134 },
  { text: " bu", duration: 0.53, begin: 50.250, index: 135 },
  { text: " du", duration: 0.53, begin: 50.500, index: 136 },
  { text: "ru", duration: 0.53, begin: 50.750, index: 137 },
  { text: "mu", duration: 0.53, begin: 51.000, index: 138 },
  { text: " Li", duration: 0.53, begin: 51.250, index: 139 },
  { text: "za'", duration: 0.53, begin: 51.500, index: 140 },
  { text: "nın", duration: 0.53, begin: 51.750, index: 141 },
  { text: " er", duration: 0.28, begin: 52.750, index: 142 },
  { text: "kek", duration: 0.28, begin: 53.000, index: 143 },
  { text: " kar", duration: 0.53, begin: 53.250, index: 144 },
  { text: "de", duration: 0.53, begin: 53.500, index: 145 },
  { text: "şi", duration: 0.53, begin: 53.750, index: 146 },
  { text: "ne", duration: 0.53, begin: 54.000, index: 147 },
  { text: " a", duration: 0.53, begin: 54.250, index: 148 },
  { text: "çık", duration: 0.53, begin: 54.500, index: 149 },
  { text: "la", duration: 0.53, begin: 54.750, index: 150 },
  { text: "dı", duration: 0.53, begin: 55.000, index: 151 },
  { text: " ve", duration: 0.53, begin: 56.000, index: 152 },
  { text: " o", duration: 0.53, begin: 56.250, index: 153 },
  { text: "na", duration: 0.53, begin: 56.500, index: 154 },
  { text: " ab", duration: 0.53, begin: 57.500, index: 155 },
  { text: "la", duration: 0.53, begin: 57.750, index: 156 },
  { text: "sı", duration: 0.53, begin: 58.000, index: 157 },
  { text: "na", duration: 0.53, begin: 58.250, index: 158 },
  { text: " kan", duration: 0.53, begin: 58.500, index: 159 },
  { text: " ver", duration: 0.53, begin: 58.750, index: 160 },
  { text: "me", duration: 0.53, begin: 59.000, index: 161 },
  { text: "yi", duration: 0.53, begin: 59.250, index: 162 },
  { text: " is", duration: 0.53, begin: 59.500, index: 163 },
  { text: "te", duration: 0.53, begin: 59.750, index: 164 },
  { text: "yip", duration: 0.53, begin: 60.000, index: 165 },
  { text: " is", duration: 0.53, begin: 61.000, index: 166 },
  { text: "te", duration: 0.53, begin: 61.250, index: 167 },
  { text: "me", duration: 0.53, begin: 61.500, index: 168 },
  { text: "di", duration: 0.53, begin: 61.750, index: 169 },
  { text: "ği", duration: 0.53, begin: 62.000, index: 170 },
  { text: "ni", duration: 0.53, begin: 62.250, index: 171 },
  { text: " sor", duration: 0.53, begin: 62.500, index: 172 },
  { text: "du.", duration: 0.53, begin: 62.750, index: 173 },
  { text: " Kü", duration: 0.53, begin: 64.000, index: 174 },
  { text: "çük", duration: 0.53, begin: 64.250, index: 175 },
  { text: " ço", duration: 0.53, begin: 64.500, index: 176 },
  { text: "cuk", duration: 0.53, begin: 64.750, index: 177 },
  { text: " bir", duration: 0.53, begin: 66.000, index: 178 },
  { text: " an", duration: 0.53, begin: 66.250, index: 179 },
  { text: " te", duration: 0.53, begin: 66.750, index: 180 },
  { text: "red", duration: 0.53, begin: 67.000, index: 181 },
  { text: "düt", duration: 0.53, begin: 67.250, index: 182 },
  { text: " et", duration: 0.53, begin: 67.500, index: 183 },
  { text: "ti", duration: 0.53, begin: 67.750, index: 184 },
  { text: " ve", duration: 0.53, begin: 68.000, index: 185 },
  { text: " de", duration: 0.53, begin: 69.250, index: 186 },
  { text: "rin", duration: 0.53, begin: 69.500, index: 187 },
  { text: " bir", duration: 0.68, begin: 69.750, index: 188 },
  { text: " ne", duration: 0.68, begin: 70.000, index: 189 },
  { text: "fes", duration: 0.68, begin: 70.250, index: 190 },
  { text: " al", duration: 0.68, begin: 70.750, index: 191 },
  { text: "dık", duration: 0.68, begin: 71.000, index: 192 },
  { text: "tan", duration: 0.68, begin: 71.250, index: 193 },
  { text: " son", duration: 0.68, begin: 71.500, index: 194 },
  { text: "ra;", duration: 0.68, begin: 71.750, index: 195 },
  { text: " E", duration: 0.53, begin: 73.250, index: 196 },
  { text: "vet,", duration: 0.53, begin: 73.500, index: 197 },
  { text: " e", duration: 0.53, begin: 74.750, index: 198 },
  { text: "ğer", duration: 0.53, begin: 75.000, index: 199 },
  { text: " Li", duration: 0.53, begin: 75.250, index: 200 },
  { text: "za", duration: 0.53, begin: 75.500, index: 201 },
  { text: " kur", duration: 0.53, begin: 75.750, index: 202 },
  { text: "tu", duration: 0.53, begin: 76.000, index: 203 },
  { text: "la", duration: 0.53, begin: 76.250, index: 204 },
  { text: "cak", duration: 0.53, begin: 76.500, index: 205 },
  { text: "sa", duration: 0.53, begin: 76.750, index: 206 },
  { text: " ve", duration: 0.53, begin: 77.000, index: 207 },
  { text: "ri", duration: 0.53, begin: 77.250, index: 208 },
  { text: "rim", duration: 0.53, begin: 77.500, index: 209 },
  { text: " de", duration: 0.28, begin: 78.500, index: 210 },
  { text: "di.", duration: 0.28, begin: 78.750, index: 211 },
  { text: " Kan", duration: 0.53, begin: 79.750, index: 212 },
  { text: " nak", duration: 0.53, begin: 80.000, index: 213 },
  { text: "li", duration: 0.53, begin: 80.250, index: 214 },
  { text: " ya", duration: 0.53, begin: 80.500, index: 215 },
  { text: "pı", duration: 0.53, begin: 80.750, index: 216 },
  { text: "lır", duration: 0.53, begin: 81.000, index: 217 },
  { text: "ken,", duration: 0.53, begin: 81.250, index: 218 },
  { text: " kü", duration: 0.53, begin: 82.250, index: 219 },
  { text: "çük", duration: 0.53, begin: 82.500, index: 220 },
  { text: " ço", duration: 0.53, begin: 82.750, index: 221 },
  { text: "cuk", duration: 0.53, begin: 83.000, index: 222 },
  { text: " ab", duration: 0.53, begin: 84.000, index: 223 },
  { text: "la", duration: 0.53, begin: 84.250, index: 224 },
  { text: "sı", duration: 0.53, begin: 84.500, index: 225 },
  { text: "nın", duration: 0.53, begin: 84.750, index: 226 },
  { text: " ya", duration: 0.53, begin: 85.000, index: 227 },
  { text: "nın", duration: 0.53, begin: 85.250, index: 228 },
  { text: "da", duration: 0.53, begin: 85.500, index: 229 },
  { text: "ki", duration: 0.53, begin: 85.750, index: 230 },
  { text: " ya", duration: 0.53, begin: 86.000, index: 231 },
  { text: "tak", duration: 0.53, begin: 86.250, index: 232 },
  { text: "ta", duration: 0.53, begin: 86.500, index: 233 },
  { text: " ya", duration: 0.53, begin: 86.850, index: 234 },
  { text: "tı", duration: 0.53, begin: 87.100, index: 235 },
  { text: "yor", duration: 0.53, begin: 87.350, index: 236 },
  { text: " ve", duration: 0.53, begin: 87.700, index: 237 },
  { text: " ab", duration: 0.53, begin: 88.750, index: 238 },
  { text: "la", duration: 0.53, begin: 89.000, index: 239 },
  { text: "sı", duration: 0.53, begin: 89.250, index: 240 },
  { text: "nın", duration: 0.53, begin: 89.500, index: 241 },
  { text: " ya", duration: 0.53, begin: 89.750, index: 242 },
  { text: "nak", duration: 0.53, begin: 90.000, index: 243 },
  { text: "la", duration: 0.53, begin: 90.250, index: 244 },
  { text: "rı", duration: 0.53, begin: 90.500, index: 245 },
  { text: "na", duration: 0.53, begin: 90.750, index: 246 },
  { text: " renk", duration: 0.53, begin: 91.000, index: 247 },
  { text: " gel", duration: 0.68, begin: 91.250, index: 248 },
  { text: "dik", duration: 0.68, begin: 91.500, index: 249 },
  { text: "çe", duration: 0.68, begin: 91.750, index: 250 },
  { text: " bi", duration: 0.53, begin: 93.000, index: 251 },
  { text: "zim", duration: 0.53, begin: 93.250, index: 252 },
  { text: "le", duration: 0.53, begin: 93.500, index: 253 },
  { text: " bir", duration: 0.53, begin: 93.750, index: 254 },
  { text: "lik", duration: 0.53, begin: 94.000, index: 255 },
  { text: "te", duration: 0.53, begin: 94.250, index: 256 },
  { text: " gü", duration: 0.78, begin: 94.500, index: 257 },
  { text: "lüm", duration: 0.78, begin: 94.750, index: 258 },
  { text: "sü", duration: 0.78, begin: 95.000, index: 259 },
  { text: "yor", duration: 0.78, begin: 95.250, index: 260 },
  { text: "du.", duration: 0.78, begin: 95.500, index: 261 },
  { text: " Son", duration: 0.53, begin: 97.250, index: 262 },
  { text: "ra", duration: 0.53, begin: 97.500, index: 263 },
  { text: " yü", duration: 0.53, begin: 97.750, index: 264 },
  { text: "zü", duration: 0.53, begin: 98.000, index: 265 },
  { text: " sa", duration: 0.53, begin: 98.250, index: 266 },
  { text: "rar", duration: 0.53, begin: 98.500, index: 267 },
  { text: "dı", duration: 0.53, begin: 98.750, index: 268 },
  { text: " ve", duration: 0.53, begin: 99.000, index: 269 },
  { text: " yü", duration: 0.53, begin: 100.000, index: 270 },
  { text: "zün", duration: 0.53, begin: 100.250, index: 271 },
  { text: "de", duration: 0.53, begin: 100.500, index: 272 },
  { text: "ki", duration: 0.53, begin: 100.750, index: 273 },
  { text: " gü", duration: 0.53, begin: 101.000, index: 274 },
  { text: "lüm", duration: 0.53, begin: 101.250, index: 275 },
  { text: "se", duration: 0.53, begin: 101.500, index: 276 },
  { text: "me", duration: 0.53, begin: 101.750, index: 277 },
  { text: " kay", duration: 0.53, begin: 102.250, index: 278 },
  { text: "bol", duration: 0.53, begin: 102.500, index: 279 },
  { text: "du.", duration: 0.53, begin: 102.750, index: 280 },
  { text: " Ba", duration: 0.48, begin: 104.500, index: 281 },
  { text: "şı", duration: 0.48, begin: 104.750, index: 282 },
  { text: "nı", duration: 0.48, begin: 105.000, index: 283 },
  { text: " kal", duration: 0.48, begin: 105.250, index: 284 },
  { text: "dı", duration: 0.48, begin: 105.500, index: 285 },
  { text: "rıp", duration: 0.48, begin: 105.750, index: 286 },
  { text: " dok", duration: 0.53, begin: 106.000, index: 287 },
  { text: "to", duration: 0.53, begin: 106.250, index: 288 },
  { text: "ra", duration: 0.53, begin: 106.500, index: 289 },
  { text: " bak", duration: 0.78, begin: 106.750, index: 290 },
  { text: "tık", duration: 0.78, begin: 107.000, index: 291 },
  { text: "tan", duration: 0.78, begin: 107.250, index: 292 },
  { text: " son", duration: 0.53, begin: 108.250, index: 293 },
  { text: "ra", duration: 0.53, begin: 108.500, index: 294 },
  { text: " tit", duration: 0.78, begin: 109.250, index: 295 },
  { text: "re", duration: 0.78, begin: 109.500, index: 296 },
  { text: "yen", duration: 0.78, begin: 109.750, index: 297 },
  { text: " bir", duration: 0.78, begin: 110.000, index: 298 },
  { text: " ses", duration: 0.78, begin: 110.250, index: 299 },
  { text: "le;", duration: 0.78, begin: 110.500, index: 300 },
  { text: " He", duration: 0.78, begin: 112.000, index: 301 },
  { text: "men", duration: 0.78, begin: 112.250, index: 302 },
  { text: " mi", duration: 0.78, begin: 112.500, index: 303 },
  { text: " ö", duration: 0.78, begin: 112.750, index: 304 },
  { text: "le", duration: 0.78, begin: 113.000, index: 305 },
  { text: "ce", duration: 0.78, begin: 113.250, index: 306 },
  { text: "ğim?", duration: 0.78, begin: 113.500, index: 307 },
  { text: " di", duration: 0.28, begin: 114.500, index: 308 },
  { text: "ye", duration: 0.28, begin: 114.750, index: 309 },
  { text: " sor", duration: 0.28, begin: 115.000, index: 310 },
  { text: "du.", duration: 0.28, begin: 115.250, index: 311 },
  { text: " An", duration: 0.28, begin: 116.500, index: 312 },
  { text: "la", duration: 0.28, begin: 116.750, index: 313 },
  { text: "dık", duration: 0.28, begin: 117.000, index: 314 },
  { text: " ki,", duration: 0.28, begin: 117.250, index: 315 },
  { text: " ya", duration: 0.53, begin: 118.000, index: 316 },
  { text: "şı", duration: 0.53, begin: 118.250, index: 317 },
  { text: " çok", duration: 0.53, begin: 118.500, index: 318 },
  { text: " kü", duration: 0.53, begin: 118.750, index: 319 },
  { text: "çük", duration: 0.53, begin: 119.000, index: 320 },
  { text: " ol", duration: 0.53, begin: 119.250, index: 321 },
  { text: "du", duration: 0.53, begin: 119.500, index: 322 },
  { text: "ğu", duration: 0.53, begin: 119.750, index: 323 },
  { text: " i", duration: 0.53, begin: 120.000, index: 324 },
  { text: "çin,", duration: 0.53, begin: 120.250, index: 325 },
  { text: " dok", duration: 0.53, begin: 121.250, index: 326 },
  { text: "to", duration: 0.53, begin: 121.500, index: 327 },
  { text: "run", duration: 0.53, begin: 121.750, index: 328 },
  { text: " söz", duration: 0.53, begin: 122.000, index: 329 },
  { text: "le", duration: 0.53, begin: 122.250, index: 330 },
  { text: "ri", duration: 0.53, begin: 122.500, index: 331 },
  { text: "ni", duration: 0.53, begin: 122.750, index: 332 },
  { text: " yan", duration: 0.53, begin: 123.000, index: 333 },
  { text: "lış", duration: 0.53, begin: 123.250, index: 334 },
  { text: " an", duration: 0.53, begin: 123.500, index: 335 },
  { text: "la", duration: 0.53, begin: 123.750, index: 336 },
  { text: "mış", duration: 0.53, begin: 124.000, index: 337 },
  { text: " ve", duration: 0.53, begin: 125.000, index: 338 },
  { text: " ka", duration: 0.53, begin: 125.750, index: 339 },
  { text: "nı", duration: 0.53, begin: 126.000, index: 340 },
  { text: "nın", duration: 0.53, begin: 126.250, index: 341 },
  { text: " tü", duration: 0.53, begin: 126.500, index: 342 },
  { text: "mü", duration: 0.53, begin: 126.750, index: 343 },
  { text: "nü", duration: 0.53, begin: 127.000, index: 344 },
  { text: " ab", duration: 0.53, begin: 128.000, index: 345 },
  { text: "la", duration: 0.53, begin: 128.250, index: 346 },
  { text: "sı", duration: 0.53, begin: 128.500, index: 347 },
  { text: "na", duration: 0.53, begin: 128.750, index: 348 },
  { text: " ver", duration: 0.53, begin: 129.000, index: 349 },
  { text: "me", duration: 0.53, begin: 129.250, index: 350 },
  { text: "si", duration: 0.53, begin: 129.500, index: 351 },
  { text: " ge", duration: 0.43, begin: 129.750, index: 352 },
  { text: "rek", duration: 0.43, begin: 130.000, index: 353 },
  { text: "ti", duration: 0.43, begin: 130.250, index: 354 },
  { text: "ği", duration: 0.43, begin: 130.500, index: 355 },
  { text: "ni", duration: 0.43, begin: 130.750, index: 356 },
  { text: " dü", duration: 0.53, begin: 131.000, index: 357 },
  { text: "şü", duration: 0.53, begin: 131.250, index: 358 },
  { text: "nüp", duration: 0.53, begin: 131.500, index: 359 },
  { text: " ö", duration: 0.53, begin: 132.000, index: 360 },
  { text: "le", duration: 0.53, begin: 132.250, index: 361 },
  { text: "ce", duration: 0.53, begin: 132.500, index: 362 },
  { text: "ği", duration: 0.53, begin: 132.750, index: 363 },
  { text: "ni", duration: 0.53, begin: 133.000, index: 364 },
  { text: " san", duration: 0.53, begin: 133.250, index: 365 },
  { text: "ma", duration: 0.53, begin: 133.500, index: 366 },
  { text: "sı", duration: 0.53, begin: 133.750, index: 367 },
  { text: "na", duration: 0.53, begin: 134.000, index: 368 },
  { text: " rağ", duration: 0.68, begin: 134.250, index: 369 },
  { text: "men", duration: 0.68, begin: 134.500, index: 370 },
  { text: " tek", duration: 0.68, begin: 135.500, index: 371 },
  { text: "li", duration: 0.68, begin: 135.750, index: 372 },
  { text: "fi", duration: 0.68, begin: 136.000, index: 373 },
  { text: " ka", duration: 0.68, begin: 136.500, index: 374 },
  { text: "bul", duration: 0.68, begin: 136.750, index: 375 },
  { text: " et", duration: 0.68, begin: 137.000, index: 376 },
  { text: "miş", duration: 0.68, begin: 137.250, index: 377 },
  { text: "ti.", duration: 0.68, begin: 137.500, index: 378 },
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
  <Link href="/dashboard/stories/zehir" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/sirkin-kapisindan-dondugum-gece" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/2-3.mp3"
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