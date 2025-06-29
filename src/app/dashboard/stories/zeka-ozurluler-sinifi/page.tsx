"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, ArrowLeft, SkipForward, SkipBack,ChevronLeft} from "lucide-react"
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
  { text: "Ze", duration: 0.28, begin: 0.500, index: 1, isTitle: true, isCenter: true },
  { text: "ka", duration: 0.28, begin: 0.750, index: 2, isTitle: true, isCenter: true },
  { text: " Ö", duration: 0.28, begin: 1.000, index: 3, isTitle: true, isCenter: true },
  { text: "zür", duration: 0.28, begin: 1.250, index: 4, isTitle: true, isCenter: true },
  { text: "lü", duration: 0.28, begin: 1.500, index: 5, isTitle: true, isCenter: true },
  { text: "ler", duration: 0.28, begin: 1.750, index: 6, isTitle: true, isCenter: true },
  { text: " Sı", duration: 0.28, begin: 2.000, index: 7, isTitle: true, isCenter: true },
  { text: "nı", duration: 0.28, begin: 2.250, index: 8, isTitle: true, isCenter: true },
  { text: "fı", duration: 0.28, begin: 2.500, index: 9, isTitle: true, isCenter: true },

  // Story content
  { text: " Be", duration: 0.28, begin: 3.500, index: 10 },
  { text: "şin", duration: 0.28, begin: 3.750, index: 11 },
  { text: "ci", duration: 0.28, begin: 4.000, index: 12 },
  { text: " sı", duration: 0.28, begin: 4.250, index: 13 },
  { text: "nıf", duration: 0.28, begin: 4.500, index: 14 },
  { text: "tay", duration: 0.28, begin: 4.750, index: 15 },
  { text: "ken,", duration: 0.28, begin: 5.000, index: 16 },
  { text: " bir", duration: 0.28, begin: 5.500, index: 17 },
  { text: " gün", duration: 0.28, begin: 5.750, index: 18 },
  { text: " ar", duration: 0.28, begin: 6.000, index: 19 },
  { text: "ka", duration: 0.28, begin: 6.250, index: 20 },
  { text: "da", duration: 0.28, begin: 6.500, index: 21 },
  { text: "şı", duration: 0.28, begin: 6.750, index: 22 },
  { text: "mı", duration: 0.28, begin: 7.000, index: 23 },
  { text: " gör", duration: 0.28, begin: 7.250, index: 24 },
  { text: "mek", duration: 0.28, begin: 7.500, index: 25 },
  { text: " i", duration: 0.28, begin: 7.750, index: 26 },
  { text: "çin", duration: 0.28, begin: 8.000, index: 27 },
  { text: " o", duration: 0.28, begin: 8.500, index: 28 },
  { text: "nun", duration: 0.28, begin: 8.750, index: 29 },
  { text: " sı", duration: 0.28, begin: 9.000, index: 30 },
  { text: "nı", duration: 0.28, begin: 9.200, index: 31 },
  { text: "fı", duration: 0.28, begin: 9.400, index: 32 },
  { text: "na", duration: 0.28, begin: 9.600, index: 33 },
  { text: " git", duration: 0.28, begin: 9.800, index: 34 },
  { text: "tim", duration: 0.28, begin: 10.000, index: 35 },
  { text: " ve", duration: 0.28, begin: 10.200, index: 36 },
  { text: " sı", duration: 0.28, begin: 11.000, index: 37 },
  { text: "ra", duration: 0.28, begin: 11.200, index: 38 },
  { text: "lar", duration: 0.28, begin: 11.400, index: 39 },
  { text: "dan", duration: 0.28, begin: 11.800, index: 40 },
  { text: " bi", duration: 0.28, begin: 12.000, index: 41 },
  { text: "ri", duration: 0.28, begin: 12.200, index: 42 },
  { text: "ne", duration: 0.28, begin: 12.400, index: 43 },
  { text: " o", duration: 0.28, begin: 12.600, index: 44 },
  { text: "tur", duration: 0.28, begin: 12.800, index: 45 },
  { text: "dum.", duration: 0.28, begin: 13.000, index: 46 },
  { text: " Az", duration: 0.38, begin: 14.200, index: 47 },
  { text: " son", duration: 0.38, begin: 14.400, index: 48 },
  { text: "ra", duration: 0.38, begin: 14.600, index: 49 },
  { text: " o", duration: 0.38, begin: 15.600, index: 50 },
  { text: " der", duration: 0.38, begin: 15.800, index: 51 },
  { text: "sin", duration: 0.38, begin: 16.000, index: 52 },
  { text: " öğ", duration: 0.38, begin: 16.600, index: 53 },
  { text: "ret", duration: 0.38, begin: 16.800, index: 54 },
  { text: "me", duration: 0.38, begin: 17.000, index: 55 },
  { text: "ni", duration: 0.38, begin: 17.200, index: 56 },
  { text: " Bay", duration: 0.40, begin: 18.000, index: 57 },
  { text: " Wash", duration: 0.40, begin: 18.200, index: 58 },
  { text: "ing", duration: 0.40, begin: 18.400, index: 59 },
  { text: "ton", duration: 0.40, begin: 18.600, index: 60 },
  { text: " sı", duration: 0.28, begin: 19.250, index: 61 },
  { text: "nıf", duration: 0.28, begin: 19.500, index: 62 },
  { text: "tan", duration: 0.28, begin: 19.750, index: 63 },
  { text: " i", duration: 0.28, begin: 20.000, index: 64 },
  { text: "çe", duration: 0.28, begin: 20.250, index: 65 },
  { text: "ri", duration: 0.28, begin: 20.500, index: 66 },
  { text: " gir", duration: 0.28, begin: 20.750, index: 67 },
  { text: "di", duration: 0.28, begin: 21.000, index: 68 },
  { text: " ve", duration: 0.28, begin: 21.250, index: 69 },
  { text: " bi", duration: 0.28, begin: 22.000, index: 70 },
  { text: "raz", duration: 0.28, begin: 22.250, index: 71 },
  { text: " son", duration: 0.28, begin: 22.500, index: 72 },
  { text: "ra", duration: 0.28, begin: 22.750, index: 73 },
  { text: " da,", duration: 0.28, begin: 23.000, index: 74 },
  { text: " ben", duration: 0.28, begin: 24.000, index: 75 },
  { text: "den", duration: 0.28, begin: 24.250, index: 76 },
  { text: " tah", duration: 0.28, begin: 24.500, index: 77 },
  { text: "ta", duration: 0.28, begin: 24.750, index: 78 },
  { text: "ya", duration: 0.28, begin: 25.000, index: 79 },
  { text: " çı", duration: 0.28, begin: 25.250, index: 80 },
  { text: "kıp", duration: 0.28, begin: 25.500, index: 81 },
  { text: " bir", duration: 0.28, begin: 26.000, index: 82 },
  { text: "şey", duration: 0.28, begin: 26.250, index: 83 },
  { text: "ler", duration: 0.28, begin: 26.500, index: 84 },
  { text: " yaz", duration: 0.28, begin: 26.750, index: 85 },
  { text: "ma", duration: 0.28, begin: 27.000, index: 86 },
  { text: "mı", duration: 0.28, begin: 27.250, index: 87 },
  { text: " is", duration: 0.28, begin: 27.500, index: 88 },
  { text: "te", duration: 0.28, begin: 27.750, index: 89 },
  { text: "di.", duration: 0.28, begin: 28.000, index: 90 },
  { text: " Ken", duration: 0.28, begin: 29.000, index: 91 },
  { text: "di", duration: 0.28, begin: 29.250, index: 92 },
  { text: "si", duration: 0.28, begin: 29.500, index: 93 },
  { text: "ne", duration: 0.28, begin: 29.750, index: 94 },
  { text: " bu", duration: 0.28, begin: 30.500, index: 95 },
  { text: "nu", duration: 0.28, begin: 30.750, index: 96 },
  { text: " ya", duration: 0.28, begin: 31.000, index: 97 },
  { text: "pa", duration: 0.28, begin: 31.200, index: 98 },
  { text: "ma", duration: 0.28, begin: 31.400, index: 99 },
  { text: "ya", duration: 0.28, begin: 31.600, index: 100 },
  { text: "ca", duration: 0.28, begin: 31.800, index: 101 },
  { text: "ğı", duration: 0.28, begin: 32.000, index: 102 },
  { text: "mı", duration: 0.28, begin: 32.200, index: 103 },
  { text: " söy", duration: 0.28, begin: 32.400, index: 104 },
  { text: "le", duration: 0.28, begin: 32.600, index: 105 },
  { text: "dim.", duration: 0.28, begin: 32.800, index: 106 },
  { text: " \"Ni", duration: 0.28, begin: 33.500, index: 107 },
  { text: "ye\"", duration: 0.28, begin: 33.750, index: 108 },
  { text: " di", duration: 0.28, begin: 34.500, index: 109 },
  { text: "ye", duration: 0.28, begin: 34.750, index: 110 },
  { text: " sor", duration: 0.28, begin: 35.000, index: 111 },
  { text: "du.", duration: 0.28, begin: 35.250, index: 112 },
  { text: " Bu", duration: 0.28, begin: 36.250, index: 113 },
  { text: " sı", duration: 0.28, begin: 36.500, index: 114 },
  { text: "nı", duration: 0.28, begin: 36.750, index: 115 },
  { text: "fın", duration: 0.28, begin: 37.000, index: 116 },
  { text: " öğ", duration: 0.28, begin: 37.250, index: 117 },
  { text: "ren", duration: 0.28, begin: 37.500, index: 118 },
  { text: "ci", duration: 0.28, begin: 37.750, index: 119 },
  { text: "si", duration: 0.28, begin: 38.000, index: 120 },
  { text: " ol", duration: 0.28, begin: 38.250, index: 121 },
  { text: "ma", duration: 0.28, begin: 38.500, index: 122 },
  { text: "dı", duration: 0.28, begin: 38.750, index: 123 },
  { text: "ğı", duration: 0.28, begin: 39.000, index: 124 },
  { text: "mı", duration: 0.28, begin: 39.250, index: 125 },
  { text: " söy", duration: 0.28, begin: 39.500, index: 126 },
  { text: "le", duration: 0.28, begin: 39.750, index: 127 },
  { text: "dim.", duration: 0.28, begin: 40.000, index: 128 },
  { text: " \"Fark", duration: 0.28, begin: 41.000, index: 129 },
  { text: " et", duration: 0.28, begin: 41.250, index: 130 },
  { text: "mez,", duration: 0.28, begin: 41.500, index: 131 },
  { text: " tah", duration: 0.28, begin: 42.250, index: 132 },
  { text: "ta", duration: 0.28, begin: 42.500, index: 133 },
  { text: "ya", duration: 0.28, begin: 42.750, index: 134 },
  { text: " gel.\"", duration: 0.28, begin: 43.000, index: 135 },
  { text: " de", duration: 0.28, begin: 43.750, index: 136 },
  { text: "di.", duration: 0.28, begin: 44.000, index: 137 },
  { text: " Yi", duration: 0.28, begin: 45.000, index: 138 },
  { text: "ne,", duration: 0.28, begin: 45.250, index: 139 },
  { text: " ya", duration: 0.28, begin: 46.000, index: 140 },
  { text: "pa", duration: 0.28, begin: 46.250, index: 141 },
  { text: "ma", duration: 0.28, begin: 46.500, index: 142 },
  { text: "ya", duration: 0.28, begin: 46.700, index: 143 },
  { text: "ca", duration: 0.28, begin: 46.900, index: 144 },
  { text: "ğı", duration: 0.28, begin: 47.100, index: 145 },
  { text: "mı", duration: 0.28, begin: 47.300, index: 146 },
  { text: " söy", duration: 0.28, begin: 47.500, index: 147 },
  { text: "le", duration: 0.28, begin: 47.700, index: 148 },
  { text: "dim.", duration: 0.28, begin: 47.900, index: 149 },
  { text: " Tek", duration: 0.28, begin: 48.900, index: 150 },
  { text: "rar:", duration: 0.28, begin: 49.200, index: 151 },
  { text: " \"Ni", duration: 0.28, begin: 50.250, index: 152 },
  { text: "çin", duration: 0.28, begin: 50.500, index: 153 },
  { text: " ya", duration: 0.28, begin: 50.750, index: 154 },
  { text: "pa", duration: 0.28, begin: 51.000, index: 155 },
  { text: "maz", duration: 0.28, begin: 51.250, index: 156 },
  { text: "sın?\"", duration: 0.28, begin: 51.500, index: 157 },
  { text: " di", duration: 0.28, begin: 52.000, index: 158 },
  { text: "ye", duration: 0.28, begin: 52.250, index: 159 },
  { text: " sor", duration: 0.28, begin: 52.500, index: 160 },
  { text: "du.", duration: 0.28, begin: 52.750, index: 161 },
  { text: " Bir", duration: 0.28, begin: 54.000, index: 162 },
  { text: " sü", duration: 0.28, begin: 54.250, index: 163 },
  { text: "re", duration: 0.28, begin: 54.500, index: 164 },
  { text: " ses", duration: 0.28, begin: 54.750, index: 165 },
  { text: "siz", duration: 0.28, begin: 55.000, index: 166 },
  { text: "ce", duration: 0.28, begin: 55.250, index: 167 },
  { text: " dur", duration: 0.38, begin: 55.500, index: 168 },
  { text: "duk", duration: 0.38, begin: 55.750, index: 169 },
  { text: "tan", duration: 0.38, begin: 56.000, index: 170 },
  { text: " son", duration: 0.38, begin: 56.250, index: 171 },
  { text: "ra:", duration: 0.38, begin: 56.500, index: 172 },
  { text: " \"E", duration: 0.28, begin: 57.750, index: 173 },
  { text: "fen", duration: 0.28, begin: 58.000, index: 174 },
  { text: "dim;", duration: 0.28, begin: 58.250, index: 175 },
  { text: " ben", duration: 0.28, begin: 59.000, index: 176 },
  { text: " ze", duration: 0.28, begin: 59.250, index: 177 },
  { text: "ka", duration: 0.28, begin: 59.500, index: 178 },
  { text: " ö", duration: 0.28, begin: 60.000, index: 179 },
  { text: "zür", duration: 0.28, begin: 60.250, index: 180 },
  { text: "lü", duration: 0.28, begin: 60.500, index: 181 },
  { text: "ler", duration: 0.28, begin: 60.750, index: 182 },
  { text: " sı", duration: 0.28, begin: 61.000, index: 183 },
  { text: "nı", duration: 0.28, begin: 61.200, index: 184 },
  { text: "fı", duration: 0.28, begin: 61.400, index: 185 },
  { text: "nın", duration: 0.28, begin: 61.600, index: 186 },
  { text: " öğ", duration: 0.28, begin: 61.800, index: 187 },
  { text: "ren", duration: 0.28, begin: 62.000, index: 188 },
  { text: "ci", duration: 0.28, begin: 62.200, index: 189 },
  { text: "si", duration: 0.28, begin: 62.400, index: 190 },
  { text: "yim.\"", duration: 0.28, begin: 62.600, index: 191 },
  { text: " de", duration: 0.28, begin: 63.400, index: 192 },
  { text: "dim.", duration: 0.28, begin: 63.600, index: 193 },
  { text: " Bu", duration: 0.28, begin: 64.800, index: 194 },
  { text: " ce", duration: 0.28, begin: 65.000, index: 195 },
  { text: "va", duration: 0.28, begin: 65.200, index: 196 },
  { text: "bım", duration: 0.28, begin: 65.400, index: 197 },
  { text: " ü", duration: 0.28, begin: 65.600, index: 198 },
  { text: "ze", duration: 0.28, begin: 65.800, index: 199 },
  { text: "ri", duration: 0.28, begin: 66.000, index: 200 },
  { text: "ne", duration: 0.28, begin: 66.200, index: 201 },
  { text: " Bay", duration: 0.28, begin: 67.000, index: 202 },
  { text: " Was", duration: 0.28, begin: 67.200, index: 203 },
  { text: "hing", duration: 0.28, begin: 67.400, index: 204 },
  { text: "ton", duration: 0.28, begin: 67.600, index: 205 },
  { text: " kür", duration: 0.28, begin: 68.500, index: 206 },
  { text: "sü", duration: 0.28, begin: 68.750, index: 207 },
  { text: "sün", duration: 0.28, begin: 69.000, index: 208 },
  { text: "den", duration: 0.28, begin: 69.250, index: 209 },
  { text: " kal", duration: 0.28, begin: 69.500, index: 210 },
  { text: "kıp", duration: 0.28, begin: 69.750, index: 211 },
  { text: " ya", duration: 0.28, begin: 70.250, index: 212 },
  { text: "nı", duration: 0.28, begin: 70.500, index: 213 },
  { text: "ma", duration: 0.28, begin: 70.750, index: 214 },
  { text: " gel", duration: 0.28, begin: 71.000, index: 215 },
  { text: "di", duration: 0.28, begin: 71.250, index: 216 },
  { text: " ve:", duration: 0.28, begin: 71.500, index: 217 },
  { text: " \"Bir", duration: 0.28, begin: 72.500, index: 218 },
  { text: " da", duration: 0.28, begin: 72.750, index: 219 },
  { text: "ha", duration: 0.28, begin: 73.000, index: 220 },
  { text: " böy", duration: 0.28, begin: 73.250, index: 221 },
  { text: "le", duration: 0.28, begin: 73.500, index: 222 },
  { text: " söy", duration: 0.28, begin: 73.750, index: 223 },
  { text: "le", duration: 0.28, begin: 74.000, index: 224 },
  { text: "me.", duration: 0.28, begin: 74.250, index: 225 },
  { text: " Ba", duration: 0.28, begin: 75.000, index: 226 },
  { text: "zı", duration: 0.28, begin: 75.250, index: 227 },
  { text: " ki", duration: 0.28, begin: 75.500, index: 228 },
  { text: "şi", duration: 0.28, begin: 75.750, index: 229 },
  { text: "le", duration: 0.28, begin: 76.000, index: 230 },
  { text: "rin", duration: 0.28, begin: 76.250, index: 231 },
  { text: " fi", duration: 0.28, begin: 76.500, index: 232 },
  { text: "kir", duration: 0.28, begin: 76.750, index: 233 },
  { text: "le", duration: 0.28, begin: 77.000, index: 234 },
  { text: "ri", duration: 0.28, begin: 77.250, index: 235 },
  { text: " se", duration: 0.28, begin: 77.750, index: 236 },
  { text: "nin", duration: 0.28, begin: 78.000, index: 237 },
  { text: " ger", duration: 0.28, begin: 78.200, index: 238 },
  { text: "çe", duration: 0.28, begin: 78.400, index: 239 },
  { text: "ğin", duration: 0.28, begin: 78.600, index: 240 },
  { text: " o", duration: 0.28, begin: 78.800, index: 241 },
  { text: "la", duration: 0.28, begin: 79.100, index: 242 },
  { text: "maz\"", duration: 0.28, begin: 79.300, index: 243 },
  { text: " de", duration: 0.28, begin: 80.200, index: 244 },
  { text: "di.", duration: 0.28, begin: 80.400, index: 245 },
  { text: " Bay", duration: 0.28, begin: 81.500, index: 246 },
  { text: " Wash", duration: 0.28, begin: 81.750, index: 247 },
  { text: "ing", duration: 0.28, begin: 82.000, index: 248 },
  { text: "ton'", duration: 0.28, begin: 82.250, index: 249 },
  { text: "la", duration: 0.28, begin: 82.500, index: 250 },
  { text: " ko", duration: 0.28, begin: 82.750, index: 251 },
  { text: "nu", duration: 0.28, begin: 83.000, index: 252 },
  { text: "şur", duration: 0.28, begin: 83.250, index: 253 },
  { text: "ken,", duration: 0.28, begin: 83.500, index: 254 },
  { text: " ze", duration: 0.28, begin: 84.250, index: 255 },
  { text: "ka", duration: 0.28, begin: 84.500, index: 256 },
  { text: " ö", duration: 0.20, begin: 84.700, index: 257 },
  { text: "zür", duration: 0.20, begin: 84.900, index: 258 },
  { text: "lü", duration: 0.20, begin: 85.100, index: 259 },
  { text: "le", duration: 0.20, begin: 85.300, index: 260 },
  { text: "rin", duration: 0.20, begin: 85.500, index: 261 },
  { text: " sı", duration: 0.20, begin: 86.000, index: 262 },
  { text: "nı", duration: 0.20, begin: 86.200, index: 263 },
  { text: "fın", duration: 0.20, begin: 86.400, index: 264 },
  { text: "da", duration: 0.20, begin: 86.600, index: 265 },
  { text: " o", duration: 0.20, begin: 86.800, index: 266 },
  { text: "ku", duration: 0.20, begin: 87.000, index: 267 },
  { text: "du", duration: 0.20, begin: 87.200, index: 268 },
  { text: "ğu", duration: 0.20, begin: 87.400, index: 269 },
  { text: "mu", duration: 0.20, begin: 87.600, index: 270 },
  { text: " öğ", duration: 0.20, begin: 87.800, index: 271 },
  { text: "re", duration: 0.20, begin: 88.000, index: 272 },
  { text: "nen", duration: 0.20, begin: 88.200, index: 273 },
  { text: " öğ", duration: 0.20, begin: 88.400, index: 274 },
  { text: "ren", duration: 0.20, begin: 88.600, index: 275 },
  { text: "ci", duration: 0.20, begin: 88.800, index: 276 },
  { text: "ler", duration: 0.20, begin: 89.000, index: 277 },
  { text: " ba", duration: 0.28, begin: 89.800, index: 278 },
  { text: "na", duration: 0.28, begin: 90.000, index: 279 },
  { text: " gül", duration: 0.28, begin: 90.250, index: 280 },
  { text: "me", duration: 0.28, begin: 90.500, index: 281 },
  { text: "ye", duration: 0.28, begin: 90.750, index: 282 },
  { text: " baş", duration: 0.28, begin: 91.000, index: 283 },
  { text: "la", duration: 0.28, begin: 91.250, index: 284 },
  { text: "dık", duration: 0.28, begin: 91.500, index: 285 },
  { text: "la", duration: 0.28, begin: 91.750, index: 286 },
  { text: "rı", duration: 0.28, begin: 92.000, index: 287 },
  { text: " i", duration: 0.28, begin: 92.250, index: 288 },
  { text: "çin", duration: 0.28, begin: 92.500, index: 289 },
  { text: " çok", duration: 0.28, begin: 93.250, index: 290 },
  { text: " u", duration: 0.28, begin: 93.500, index: 291 },
  { text: "tan", duration: 0.28, begin: 93.750, index: 292 },
  { text: "mış", duration: 0.28, begin: 94.000, index: 293 },
  { text: " a", duration: 0.28, begin: 94.250, index: 294 },
  { text: "ma", duration: 0.28, begin: 94.500, index: 295 },
  { text: " ö", duration: 0.28, begin: 95.250, index: 296 },
  { text: "te", duration: 0.28, begin: 95.500, index: 297 },
  { text: " yan", duration: 0.28, begin: 95.750, index: 298 },
  { text: "dan,", duration: 0.28, begin: 96.000, index: 299 },
  { text: " ken", duration: 0.28, begin: 96.750, index: 300 },
  { text: "di", duration: 0.28, begin: 97.000, index: 301 },
  { text: "mi", duration: 0.28, begin: 97.250, index: 302 },
  { text: " i", duration: 0.28, begin: 97.500, index: 303 },
  { text: "yi", duration: 0.28, begin: 97.750, index: 304 },
  { text: " his", duration: 0.28, begin: 98.000, index: 305 },
  { text: "set", duration: 0.28, begin: 98.250, index: 306 },
  { text: "miş", duration: 0.28, begin: 98.500, index: 307 },
  { text: "tim.", duration: 0.28, begin: 98.750, index: 308 },
  { text: " Çün", duration: 0.28, begin: 100.000, index: 309 },
  { text: "kü", duration: 0.28, begin: 100.250, index: 310 },
  { text: " Bay", duration: 0.28, begin: 100.500, index: 311 },
  { text: " Wash", duration: 0.28, begin: 100.750, index: 312 },
  { text: "ing", duration: 0.28, begin: 101.000, index: 313 },
  { text: "ton", duration: 0.28, begin: 101.250, index: 314 },
  { text: " be", duration: 0.28, begin: 102.000, index: 315 },
  { text: "nim", duration: 0.28, begin: 102.250, index: 316 },
  { text: " o", duration: 0.28, begin: 102.500, index: 317 },
  { text: " gü", duration: 0.28, begin: 102.750, index: 318 },
  { text: "ne", duration: 0.28, begin: 103.000, index: 319 },
  { text: " ka", duration: 0.28, begin: 103.250, index: 320 },
  { text: "dar", duration: 0.28, begin: 103.500, index: 321 },
  { text: " baş", duration: 0.28, begin: 103.750, index: 322 },
  { text: "ka", duration: 0.28, begin: 104.000, index: 323 },
  { text: "la", duration: 0.28, begin: 104.250, index: 324 },
  { text: "rı", duration: 0.28, begin: 104.500, index: 325 },
  { text: "nın", duration: 0.28, begin: 104.750, index: 326 },
  { text: " hak", duration: 0.28, begin: 105.000, index: 327 },
  { text: "kım", duration: 0.28, begin: 105.250, index: 328 },
  { text: "da", duration: 0.28, begin: 105.500, index: 329 },
  { text: "ki", duration: 0.28, begin: 105.750, index: 330 },
  { text: " dü", duration: 0.20, begin: 106.000, index: 331 },
  { text: "şün", duration: 0.20, begin: 106.250, index: 332 },
  { text: "ce", duration: 0.20, begin: 106.500, index: 333 },
  { text: "le", duration: 0.20, begin: 106.750, index: 334 },
  { text: "ri", duration: 0.20, begin: 107.000, index: 335 },
  { text: "nin", duration: 0.20, begin: 107.250, index: 336 },
  { text: " kıs", duration: 0.28, begin: 107.800, index: 337 },
  { text: "ka", duration: 0.28, begin: 108.000, index: 338 },
  { text: "cın", duration: 0.28, begin: 108.200, index: 339 },
  { text: "da", duration: 0.28, begin: 108.400, index: 340 },
  { text: " ya", duration: 0.28, begin: 108.600, index: 341 },
  { text: "şa", duration: 0.28, begin: 108.800, index: 342 },
  { text: "dı", duration: 0.28, begin: 109.000, index: 343 },
  { text: "ğı", duration: 0.28, begin: 109.200, index: 344 },
  { text: "mı", duration: 0.28, begin: 109.400, index: 345 },
  { text: " an", duration: 0.28, begin: 109.600, index: 346 },
  { text: "la", duration: 0.28, begin: 109.800, index: 347 },
  { text: "ma", duration: 0.28, begin: 110.000, index: 348 },
  { text: "mı", duration: 0.28, begin: 110.200, index: 349 },
  { text: " sağ", duration: 0.28, begin: 110.600, index: 350 },
  { text: "la", duration: 0.28, begin: 110.800, index: 351 },
  { text: "mış", duration: 0.28, begin: 111.000, index: 352 },
  { text: "tı.", duration: 0.28, begin: 111.200, index: 353 },
  { text: " Bun", duration: 0.28, begin: 112.500, index: 354 },
  { text: "dan", duration: 0.28, begin: 112.750, index: 355 },
  { text: " son", duration: 0.28, begin: 113.000, index: 356 },
  { text: "ra,", duration: 0.28, begin: 113.250, index: 357 },
  { text: " Bay", duration: 0.28, begin: 114.250, index: 358 },
  { text: " Wash", duration: 0.28, begin: 114.500, index: 359 },
  { text: "ing", duration: 0.28, begin: 114.750, index: 360 },
  { text: "ton", duration: 0.28, begin: 115.000, index: 361 },
  { text: " be", duration: 0.28, begin: 115.750, index: 362 },
  { text: "ni", duration: 0.28, begin: 116.000, index: 363 },
  { text: " mo", duration: 0.18, begin: 116.250, index: 364 },
  { text: "ti", duration: 0.18, begin: 116.500, index: 365 },
  { text: "ve", duration: 0.18, begin: 116.750, index: 366 },
  { text: " e", duration: 0.18, begin: 117.000, index: 367 },
  { text: "den", duration: 0.18, begin: 117.250, index: 368 },
  { text: " ki", duration: 0.18, begin: 117.500, index: 369 },
  { text: "şi", duration: 0.18, begin: 117.750, index: 370 },
  { text: " ol", duration: 0.18, begin: 118.000, index: 371 },
  { text: "du.", duration: 0.18, begin: 118.250, index: 372 },
  { text: " O", duration: 0.28, begin: 119.000, index: 373 },
  { text: "nun", duration: 0.28, begin: 119.250, index: 374 },
  { text: "la", duration: 0.28, begin: 119.500, index: 375 },
  { text: " ta", duration: 0.28, begin: 119.750, index: 376 },
  { text: "nış", duration: 0.28, begin: 120.000, index: 377 },
  { text: "tı", duration: 0.28, begin: 120.250, index: 378 },
  { text: "ğım", duration: 0.28, begin: 120.500, index: 379 },
  { text: " se", duration: 0.28, begin: 120.700, index: 380 },
  { text: "ne", duration: 0.28, begin: 120.900, index: 381 },
  { text: "den", duration: 0.28, begin: 121.200, index: 382 },
  { text: " bir", duration: 0.28, begin: 121.400, index: 383 },
  { text: " ön", duration: 0.28, begin: 121.600, index: 384 },
  { text: "ce", duration: 0.28, begin: 121.800, index: 385 },
  { text: "ki", duration: 0.28, begin: 122.000, index: 386 },
  { text: " se", duration: 0.28, begin: 122.200, index: 387 },
  { text: "ne", duration: 0.28, begin: 122.400, index: 388 },
  { text: " sı", duration: 0.38, begin: 123.250, index: 389 },
  { text: "nıf", duration: 0.38, begin: 123.500, index: 390 },
  { text: "ta", duration: 0.38, begin: 123.750, index: 391 },
  { text: " kal", duration: 0.38, begin: 124.000, index: 392 },
  { text: "mış", duration: 0.38, begin: 124.250, index: 393 },
  { text: " ve", duration: 0.38, begin: 124.500, index: 394 },
  { text: " tek", duration: 0.28, begin: 125.750, index: 395 },
  { text: "rar", duration: 0.28, begin: 126.000, index: 396 },
  { text: " dör", duration: 0.28, begin: 126.250, index: 397 },
  { text: "dün", duration: 0.28, begin: 126.500, index: 398 },
  { text: "cü", duration: 0.28, begin: 126.750, index: 399 },
  { text: " sı", duration: 0.28, begin: 127.000, index: 400 },
  { text: "nı", duration: 0.28, begin: 127.250, index: 401 },
  { text: "fa", duration: 0.28, begin: 127.500, index: 402 },
  { text: " gön", duration: 0.28, begin: 127.750, index: 403 },
  { text: "de", duration: 0.28, begin: 128.000, index: 404 },
  { text: "ril", duration: 0.28, begin: 128.250, index: 405 },
  { text: "miş", duration: 0.28, begin: 128.500, index: 406 },
  { text: "tim.", duration: 0.28, begin: 128.750, index: 407 },
  { text: " Fa", duration: 0.28, begin: 130.000, index: 408 },
  { text: "kat", duration: 0.28, begin: 130.250, index: 409 },
  { text: " o", duration: 0.28, begin: 131.000, index: 410 },
  { text: "nun", duration: 0.28, begin: 131.250, index: 411 },
  { text: " söz", duration: 0.28, begin: 131.500, index: 412 },
  { text: "le", duration: 0.28, begin: 131.750, index: 413 },
  { text: "ri", duration: 0.28, begin: 132.000, index: 414 },
  { text: " ha", duration: 0.28, begin: 132.250, index: 415 },
  { text: "ya", duration: 0.28, begin: 132.500, index: 416 },
  { text: "tım", duration: 0.28, begin: 132.750, index: 417 },
  { text: "da", duration: 0.28, begin: 133.000, index: 418 },
  { text: " i", duration: 0.28, begin: 133.750, index: 419 },
  { text: "na", duration: 0.28, begin: 134.000, index: 420 },
  { text: "nıl", duration: 0.28, begin: 134.250, index: 421 },
  { text: "maz", duration: 0.28, begin: 134.500, index: 422 },
  { text: " de", duration: 0.28, begin: 134.750, index: 423 },
  { text: "ği", duration: 0.28, begin: 135.000, index: 424 },
  { text: "şik", duration: 0.28, begin: 135.250, index: 425 },
  { text: "lik", duration: 0.28, begin: 135.500, index: 426 },
  { text: "ler", duration: 0.28, begin: 135.750, index: 427 },
  { text: " yap", duration: 0.28, begin: 136.000, index: 428 },
  { text: "tı.", duration: 0.28, begin: 136.250, index: 429 },
  { text: " O", duration: 0.28, begin: 137.750, index: 430 },
  { text: "kul", duration: 0.28, begin: 138.000, index: 431 },
  { text: "da", duration: 0.28, begin: 138.250, index: 432 },
  { text: " ders", duration: 0.28, begin: 138.500, index: 433 },
  { text: "le", duration: 0.28, begin: 138.750, index: 434 },
  { text: "rim", duration: 0.28, begin: 139.000, index: 435 },
  { text: " i", duration: 0.28, begin: 139.250, index: 436 },
  { text: "yi", duration: 0.28, begin: 139.500, index: 437 },
  { text: " ol", duration: 0.28, begin: 139.750, index: 438 },
  { text: "ma", duration: 0.28, begin: 140.000, index: 439 },
  { text: "ya", duration: 0.28, begin: 140.250, index: 440 },
  { text: " baş", duration: 0.28, begin: 140.500, index: 441 },
  { text: "la", duration: 0.28, begin: 140.750, index: 442 },
  { text: "mış", duration: 0.28, begin: 141.000, index: 443 },
  { text: "tı.", duration: 0.28, begin: 141.250, index: 444 },
  { text: " Öğ", duration: 0.28, begin: 142.500, index: 445 },
  { text: "re", duration: 0.28, begin: 142.750, index: 446 },
  { text: "nim", duration: 0.28, begin: 143.000, index: 447 },
  { text: " ha", duration: 0.28, begin: 143.250, index: 448 },
  { text: "ya", duration: 0.28, begin: 143.500, index: 449 },
  { text: "tım", duration: 0.28, begin: 143.750, index: 450 },
  { text: "da", duration: 0.28, begin: 144.000, index: 451 },
  { text: " ilk", duration: 0.28, begin: 144.750, index: 452 },
  { text: " de", duration: 0.28, begin: 145.000, index: 453 },
  { text: "fa", duration: 0.28, begin: 145.250, index: 454 },
  { text: " şe", duration: 0.28, begin: 145.500, index: 455 },
  { text: "ref", duration: 0.28, begin: 145.750, index: 456 },
  { text: " ü", duration: 0.28, begin: 146.000, index: 457 },
  { text: "ye", duration: 0.28, begin: 146.250, index: 458 },
  { text: "li", duration: 0.28, begin: 146.500, index: 459 },
  { text: "ği", duration: 0.28, begin: 146.750, index: 460 },
  { text: " ka", duration: 0.28, begin: 147.000, index: 461 },
  { text: "zan", duration: 0.28, begin: 147.250, index: 462 },
  { text: "dım.", duration: 0.28, begin: 147.500, index: 463 },
  { text: " Bu", duration: 0.28, begin: 148.500, index: 464 },
  { text: " be", duration: 0.28, begin: 148.750, index: 465 },
  { text: "nim", duration: 0.28, begin: 149.000, index: 466 },
  { text: " i", duration: 0.28, begin: 149.250, index: 467 },
  { text: "çin", duration: 0.28, begin: 149.500, index: 468 },
  { text: " i", duration: 0.28, begin: 149.750, index: 469 },
  { text: "na", duration: 0.28, begin: 150.000, index: 470 },
  { text: "nıl", duration: 0.28, begin: 150.250, index: 471 },
  { text: "maz", duration: 0.28, begin: 150.500, index: 472 },
  { text: " bir", duration: 0.28, begin: 150.750, index: 473 },
  { text: " şey", duration: 0.28, begin: 151.000, index: 474 },
  { text: "di.", duration: 0.28, begin: 151.250, index: 475 },
  { text: " Bay", duration: 0.28, begin: 152.500, index: 476 },
  { text: " Wash", duration: 0.28, begin: 152.750, index: 477 },
  { text: "ing", duration: 0.28, begin: 153.000, index: 478 },
  { text: "ton", duration: 0.28, begin: 153.250, index: 479 },
  { text: " ge", duration: 0.28, begin: 154.000, index: 480 },
  { text: "ri", duration: 0.28, begin: 154.250, index: 481 },
  { text: "le", duration: 0.28, begin: 154.500, index: 482 },
  { text: "miş", duration: 0.28, begin: 154.750, index: 483 },
  { text: " ze", duration: 0.28, begin: 155.000, index: 484 },
  { text: "ka", duration: 0.28, begin: 155.250, index: 485 },
  { text: " du", duration: 0.13, begin: 155.500, index: 486 },
  { text: "ru", duration: 0.13, begin: 155.750, index: 487 },
  { text: "mu", duration: 0.13, begin: 156.000, index: 488 },
  { text: "ma", duration: 0.13, begin: 156.250, index: 489 },
  { text: " rağ", duration: 0.13, begin: 156.500, index: 490 },
  { text: "men", duration: 0.13, begin: 156.750, index: 491 },
  { text: " ba", duration: 0.28, begin: 157.250, index: 492 },
  { text: "na", duration: 0.28, begin: 157.500, index: 493 },
  { text: " bü", duration: 0.28, begin: 157.750, index: 494 },
  { text: "yük", duration: 0.28, begin: 158.000, index: 495 },
  { text: " bir", duration: 0.28, begin: 158.250, index: 496 },
  { text: " viz", duration: 0.28, begin: 158.500, index: 497 },
  { text: "yon", duration: 0.28, begin: 158.750, index: 498 },
  { text: " ka", duration: 0.28, begin: 159.000, index: 499 },
  { text: "zan", duration: 0.28, begin: 159.250, index: 500 },
  { text: "dır", duration: 0.28, begin: 159.500, index: 501 },
  { text: "mış", duration: 0.28, begin: 159.750, index: 502 },
  { text: "tı.", duration: 0.28, begin: 160.000, index: 503 },
  { text: " Yıl", duration: 0.28, begin: 161.500, index: 504 },
  { text: "lar", duration: 0.28, begin: 161.750, index: 505 },
  { text: " son", duration: 0.28, begin: 162.000, index: 506 },
  { text: "ra,", duration: 0.28, begin: 162.250, index: 507 },
  { text: " po", duration: 0.28, begin: 163.200, index: 508 },
  { text: "pü", duration: 0.28, begin: 163.400, index: 509 },
  { text: "ler", duration: 0.28, begin: 163.600, index: 510 },
  { text: " de", duration: 0.28, begin: 163.800, index: 511 },
  { text: "re", duration: 0.28, begin: 164.000, index: 512 },
  { text: "ce", duration: 0.28, begin: 164.200, index: 513 },
  { text: "de", duration: 0.28, begin: 164.400, index: 514 },
  { text: " ün", duration: 0.28, begin: 164.600, index: 515 },
  { text: " ka", duration: 0.28, begin: 164.800, index: 516 },
  { text: "za", duration: 0.28, begin: 165.000, index: 517 },
  { text: "nan", duration: 0.28, begin: 165.200, index: 518 },
  { text: " bir", duration: 0.28, begin: 165.600, index: 519 },
  { text: " di", duration: 0.28, begin: 165.800, index: 520 },
  { text: "zi", duration: 0.28, begin: 166.000, index: 521 },
  { text: " ki", duration: 0.28, begin: 166.200, index: 522 },
  { text: "ta", duration: 0.28, begin: 166.400, index: 523 },
  { text: "bım", duration: 0.28, begin: 166.600, index: 524 },
  { text: " ol", duration: 0.28, begin: 166.800, index: 525 },
  { text: "du.", duration: 0.28, begin: 167.000, index: 526 },
  { text: " Yaz", duration: 0.28, begin: 168.400, index: 527 },
  { text: "dı", duration: 0.28, begin: 168.600, index: 528 },
  { text: "ğım", duration: 0.28, begin: 168.800, index: 529 },
  { text: " ba", duration: 0.28, begin: 169.000, index: 530 },
  { text: "zı", duration: 0.28, begin: 169.200, index: 531 },
  { text: " e", duration: 0.28, begin: 169.600, index: 532 },
  { text: "ser", duration: 0.28, begin: 169.800, index: 533 },
  { text: "ler", duration: 0.28, begin: 170.000, index: 534 },
  { text: " film", duration: 0.28, begin: 171.000, index: 535 },
  { text: " ha", duration: 0.28, begin: 171.200, index: 536 },
  { text: "li", duration: 0.28, begin: 171.400, index: 537 },
  { text: "ne", duration: 0.28, begin: 171.600, index: 538 },
  { text: " ge", duration: 0.28, begin: 171.800, index: 539 },
  { text: "ti", duration: 0.28, begin: 172.000, index: 540 },
  { text: "ril", duration: 0.28, begin: 172.200, index: 541 },
  { text: "di.", duration: 0.28, begin: 172.400, index: 542 },
  { text: " Bir", duration: 0.28, begin: 173.800, index: 543 },
  { text: " e", duration: 0.28, begin: 174.000, index: 544 },
  { text: "ği", duration: 0.28, begin: 174.200, index: 545 },
  { text: "tim", duration: 0.28, begin: 174.400, index: 546 },
  { text: " ka", duration: 0.28, begin: 174.600, index: 547 },
  { text: "na", duration: 0.28, begin: 174.800, index: 548 },
  { text: "lın", duration: 0.28, begin: 175.000, index: 549 },
  { text: "da,", duration: 0.28, begin: 175.200, index: 550 },
  { text: " \"Hak", duration: 0.28, begin: 176.200, index: 551 },
  { text: " Et", duration: 0.28, begin: 176.400, index: 552 },
  { text: "ti", duration: 0.28, begin: 176.600, index: 553 },
  { text: "niz\"", duration: 0.28, begin: 176.800, index: 554 },
  { text: " di", duration: 0.28, begin: 177.800, index: 555 },
  { text: "ye", duration: 0.28, begin: 178.000, index: 556 },
  { text: " bir", duration: 0.28, begin: 178.400, index: 557 },
  { text: " prog", duration: 0.28, begin: 178.600, index: 558 },
  { text: "ram", duration: 0.28, begin: 178.800, index: 559 },
  { text: " yap", duration: 0.28, begin: 179.000, index: 560 },
  { text: "ma", duration: 0.28, begin: 179.200, index: 561 },
  { text: "ya", duration: 0.28, begin: 179.400, index: 562 },
  { text: " baş", duration: 0.38, begin: 179.600, index: 563 },
  { text: "la", duration: 0.38, begin: 179.800, index: 564 },
  { text: "dım.", duration: 0.38, begin: 180.000, index: 565 },
  { text: " Bir", duration: 0.28, begin: 181.400, index: 566 },
  { text: " gün", duration: 0.28, begin: 181.600, index: 567 },
  { text: " prog", duration: 0.28, begin: 182.200, index: 568 },
  { text: "ram", duration: 0.28, begin: 182.400, index: 569 },
  { text: " a", duration: 0.28, begin: 182.600, index: 570 },
  { text: "ra", duration: 0.28, begin: 182.800, index: 571 },
  { text: "sın", duration: 0.28, begin: 183.000, index: 572 },
  { text: "da", duration: 0.28, begin: 183.200, index: 573 },
  { text: " bir", duration: 0.28, begin: 183.600, index: 574 },
  { text: " te", duration: 0.28, begin: 184.000, index: 575 },
  { text: "le", duration: 0.28, begin: 184.250, index: 576 },
  { text: "fon", duration: 0.28, begin: 184.500, index: 577 },
  { text: " gel", duration: 0.28, begin: 184.750, index: 578 },
  { text: "di:", duration: 0.28, begin: 185.000, index: 579 },
  { text: " \"Bay", duration: 0.28, begin: 186.500, index: 580 },
  { text: " Brown", duration: 0.28, begin: 186.750, index: 581 },
  { text: " i", duration: 0.28, begin: 187.000, index: 582 },
  { text: "le", duration: 0.28, begin: 187.250, index: 583 },
  { text: " gö", duration: 0.28, begin: 187.500, index: 584 },
  { text: "rü", duration: 0.28, begin: 187.750, index: 585 },
  { text: "şe", duration: 0.28, begin: 188.000, index: 586 },
  { text: "bi", duration: 0.28, begin: 188.250, index: 587 },
  { text: "lir", duration: 0.28, begin: 188.500, index: 588 },
  { text: " mi", duration: 0.28, begin: 188.750, index: 589 },
  { text: "yim?\"", duration: 0.28, begin: 189.000, index: 590 },
  { text: " Te", duration: 0.28, begin: 189.900, index: 591 },
  { text: "le", duration: 0.28, begin: 190.100, index: 592 },
  { text: "fon", duration: 0.28, begin: 190.300, index: 593 },
  { text: "da", duration: 0.28, begin: 190.500, index: 594 },
  { text: "ki", duration: 0.28, begin: 190.700, index: 595 },
  { text: " se", duration: 0.28, begin: 190.900, index: 596 },
  { text: "si", duration: 0.28, begin: 191.100, index: 597 },
  { text: " ta", duration: 0.28, begin: 191.300, index: 598 },
  { text: "nı", duration: 0.28, begin: 191.500, index: 599 },
  { text: "mış", duration: 0.28, begin: 191.700, index: 600 },
  { text: "tım.", duration: 0.28, begin: 191.900, index: 601 },
  { text: " \"Buy", duration: 0.28, begin: 193.000, index: 602 },
  { text: "run", duration: 0.28, begin: 193.250, index: 603 },
  { text: " Bay", duration: 0.28, begin: 193.500, index: 604 },
  { text: " Was", duration: 0.28, begin: 193.750, index: 605 },
  { text: "hing", duration: 0.28, begin: 194.000, index: 606 },
  { text: "ton!\"", duration: 0.28, begin: 194.250, index: 607 },
  { text: " \"Ba", duration: 0.28, begin: 195.250, index: 608 },
  { text: "şar", duration: 0.28, begin: 195.500, index: 609 },
  { text: "dın,", duration: 0.28, begin: 195.750, index: 610 },
  { text: " de", duration: 0.28, begin: 196.500, index: 611 },
  { text: "ğil", duration: 0.28, begin: 196.750, index: 612 },
  { text: " mi?\"", duration: 0.28, begin: 197.000, index: 613 },
  { text: " \"E", duration: 0.28, begin: 197.750, index: 614 },
  { text: "vet", duration: 0.28, begin: 198.000, index: 615 },
  { text: " e", duration: 0.28, begin: 198.250, index: 616 },
  { text: "fen", duration: 0.28, begin: 198.500, index: 617 },
  { text: "dim,", duration: 0.28, begin: 198.750, index: 618 },
  { text: " ba", duration: 0.28, begin: 199.500, index: 619 },
  { text: "şar", duration: 0.28, begin: 199.750, index: 620 },
  { text: "dım...\"", duration: 0.28, begin: 200.000, index: 621 }
  
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
  <Link href="/dashboard/stories/hayallerinizden-vazgecmeyin" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/3-7.mp3"
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