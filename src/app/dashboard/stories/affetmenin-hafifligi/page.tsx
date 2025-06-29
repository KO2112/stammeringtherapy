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
 
  
  // Title
  { text: "Af", duration: 0.53, begin: 0.500, index: 1, isTitle: true, isCenter: true },
  { text: "fet", duration: 0.53, begin: 0.750, index: 2, isTitle: true, isCenter: true },
  { text: "me", duration: 0.53, begin: 1.000, index: 3, isTitle: true, isCenter: true },
  { text: "nin", duration: 0.53, begin: 1.250, index: 4, isTitle: true, isCenter: true },
  { text: " Ha", duration: 0.53, begin: 1.500, index: 5, isTitle: true, isCenter: true },
  { text: "fif", duration: 0.53, begin: 1.750, index: 6, isTitle: true, isCenter: true },
  { text: "li", duration: 0.53, begin: 2.000, index: 7, isTitle: true, isCenter: true },
  { text: "ği", duration: 0.53, begin: 2.250, index: 8, isTitle: true, isCenter: true },
  
  // Story content
  { text: " Bir", duration: 0.53, begin: 3.000, index: 9 },
  { text: " li", duration: 0.53, begin: 3.250, index: 10 },
  { text: "se", duration: 0.53, begin: 3.500, index: 11 },
  { text: " öğ", duration: 0.53, begin: 3.750, index: 12 },
  { text: "ret", duration: 0.53, begin: 4.000, index: 13 },
  { text: "me", duration: 0.53, begin: 4.250, index: 14 },
  { text: "ni", duration: 0.53, begin: 4.500, index: 15 },
  { text: " bir", duration: 0.53, begin: 5.500, index: 16 },
  { text: " gün", duration: 0.53, begin: 5.750, index: 17 },
  { text: " ders", duration: 0.53, begin: 6.000, index: 18 },
  { text: "te", duration: 0.53, begin: 6.250, index: 19 },
  { text: " öğ", duration: 0.53, begin: 6.500, index: 20 },
  { text: "ren", duration: 0.53, begin: 6.750, index: 21 },
  { text: "ci", duration: 0.53, begin: 7.000, index: 22 },
  { text: "le", duration: 0.53, begin: 7.250, index: 23 },
  { text: "ri", duration: 0.53, begin: 7.500, index: 24 },
  { text: "ne", duration: 0.53, begin: 7.750, index: 25 },
  { text: " bir", duration: 0.53, begin: 8.500, index: 26 },
  { text: " tek", duration: 0.53, begin: 8.750, index: 27 },
  { text: "lif", duration: 0.53, begin: 9.000, index: 28 },
  { text: "te", duration: 0.53, begin: 9.250, index: 29 },
  { text: " bu", duration: 0.53, begin: 9.750, index: 30 },
  { text: "lu", duration: 0.53, begin: 10.000, index: 31 },
  { text: "nur:", duration: 0.53, begin: 10.250, index: 32 },
  { text: " \"Bir", duration: 0.68, begin: 11.000, index: 33 },
  { text: " ha", duration: 0.68, begin: 11.250, index: 34 },
  { text: "yat", duration: 0.68, begin: 11.500, index: 35 },
  { text: " de", duration: 0.38, begin: 12.000, index: 36 },
  { text: "ne", duration: 0.38, begin: 12.250, index: 37 },
  { text: "yi", duration: 0.38, begin: 12.500, index: 38 },
  { text: "mi", duration: 0.38, begin: 12.750, index: 39 },
  { text: "ne", duration: 0.38, begin: 13.000, index: 40 },
  { text: " ka", duration: 0.48, begin: 13.150, index: 41 },
  { text: "tıl", duration: 0.48, begin: 13.350, index: 42 },
  { text: "mak", duration: 0.48, begin: 13.500, index: 43 },
  { text: " is", duration: 0.48, begin: 14.000, index: 44 },
  { text: "ter", duration: 0.48, begin: 14.250, index: 45 },
  { text: " mi", duration: 0.48, begin: 14.500, index: 46 },
  { text: "si", duration: 0.48, begin: 14.750, index: 47 },
  { text: "niz?\"", duration: 0.48, begin: 15.000, index: 48 },
  { text: " Öğ", duration: 0.68, begin: 15.750, index: 49 },
  { text: "ren", duration: 0.68, begin: 16.000, index: 50 },
  { text: "ci", duration: 0.68, begin: 16.250, index: 51 },
  { text: "ler", duration: 0.68, begin: 16.500, index: 52 },
  { text: " çok", duration: 0.68, begin: 16.750, index: 53 },
  { text: " sev", duration: 0.68, begin: 17.000, index: 54 },
  { text: "dik", duration: 0.68, begin: 17.250, index: 55 },
  { text: "le", duration: 0.68, begin: 17.500, index: 56 },
  { text: "ri", duration: 0.68, begin: 17.750, index: 57 },
  { text: " ho", duration: 0.68, begin: 18.250, index: 58 },
  { text: "ca", duration: 0.68, begin: 18.500, index: 59 },
  { text: "la", duration: 0.68, begin: 18.750, index: 60 },
  { text: "rı", duration: 0.68, begin: 19.000, index: 61 },
  { text: "nın", duration: 0.68, begin: 19.250, index: 62 },
  { text: " bu", duration: 0.68, begin: 20.000, index: 63 },
  { text: " tek", duration: 0.68, begin: 20.250, index: 64 },
  { text: "li", duration: 0.68, begin: 20.500, index: 65 },
  { text: "fi", duration: 0.68, begin: 20.750, index: 66 },
  { text: "ni", duration: 0.68, begin: 21.000, index: 67 },
  { text: " te", duration: 0.68, begin: 21.250, index: 68 },
  { text: "red", duration: 0.68, begin: 21.500, index: 69 },
  { text: "düt", duration: 0.68, begin: 21.750, index: 70 },
  { text: "süz", duration: 0.68, begin: 22.000, index: 71 },
  { text: " ka", duration: 0.68, begin: 22.250, index: 72 },
  { text: "bul", duration: 0.68, begin: 22.500, index: 73 },
  { text: " e", duration: 0.68, begin: 22.750, index: 74 },
  { text: "der", duration: 0.68, begin: 23.000, index: 75 },
  { text: "ler.", duration: 0.68, begin: 23.250, index: 76 },
  { text: " \"O", duration: 0.53, begin: 24.500, index: 77 },
  { text: " za", duration: 0.53, begin: 24.750, index: 78 },
  { text: "man\"", duration: 0.53, begin: 25.000, index: 79 },
  { text: " der", duration: 0.53, begin: 25.750, index: 80 },
  { text: " öğ", duration: 0.53, begin: 26.000, index: 81 },
  { text: "ret", duration: 0.53, begin: 26.250, index: 82 },
  { text: "men.", duration: 0.53, begin: 26.500, index: 83 },
  { text: " \"Bun", duration: 0.53, begin: 27.750, index: 84 },
  { text: "dan", duration: 0.53, begin: 28.000, index: 85 },
  { text: " son", duration: 0.53, begin: 28.250, index: 86 },
  { text: "ra", duration: 0.53, begin: 28.500, index: 87 },
  { text: " ne", duration: 0.53, begin: 29.750, index: 88 },
  { text: " der", duration: 0.53, begin: 30.000, index: 89 },
  { text: "sem", duration: 0.53, begin: 30.250, index: 90 },
  { text: " ya", duration: 0.53, begin: 30.500, index: 91 },
  { text: "pa", duration: 0.53, begin: 30.750, index: 92 },
  { text: "ca", duration: 0.53, begin: 31.000, index: 93 },
  { text: "nı", duration: 0.53, begin: 31.250, index: 94 },
  { text: "za", duration: 0.53, begin: 31.500, index: 95 },
  { text: "da", duration: 0.53, begin: 31.750, index: 96 },
  { text: " söz", duration: 0.53, begin: 32.250, index: 97 },
  { text: " ve", duration: 0.53, begin: 32.500, index: 98 },
  { text: "rin.\"", duration: 0.53, begin: 32.750, index: 99 },
  { text: " Öğ", duration: 0.53, begin: 33.750, index: 100 },
  { text: "ren", duration: 0.53, begin: 34.000, index: 101 },
  { text: "ci", duration: 0.53, begin: 34.250, index: 102 },
  { text: "ler", duration: 0.53, begin: 34.500, index: 103 },
  { text: " bu", duration: 0.53, begin: 35.250, index: 104 },
  { text: "nu", duration: 0.53, begin: 35.500, index: 105 },
  { text: "da", duration: 0.53, begin: 35.750, index: 106 },
  { text: " ya", duration: 0.53, begin: 36.000, index: 107 },
  { text: "par", duration: 0.53, begin: 36.250, index: 108 },
  { text: "lar.", duration: 0.53, begin: 36.500, index: 109 },
  { text: " \"Şim", duration: 0.53, begin: 37.750, index: 110 },
  { text: "di", duration: 0.53, begin: 38.000, index: 111 },
  { text: " ya", duration: 0.38, begin: 38.750, index: 112 },
  { text: "rın", duration: 0.38, begin: 39.250, index: 113 },
  { text: " ki", duration: 0.38, begin: 39.500, index: 114 },
  { text: " ö", duration: 0.38, begin: 39.750, index: 115 },
  { text: "de", duration: 0.38, begin: 40.000, index: 116 },
  { text: "vi", duration: 0.38, begin: 40.250, index: 117 },
  { text: "ni", duration: 0.38, begin: 40.500, index: 118 },
  { text: "ze", duration: 0.38, begin: 40.750, index: 119 },
  { text: " ha", duration: 0.38, begin: 41.000, index: 120 },
  { text: "zır", duration: 0.38, begin: 41.250, index: 121 },
  { text: " o", duration: 0.38, begin: 41.500, index: 122 },
  { text: "lun.", duration: 0.38, begin: 41.750, index: 123 },
  { text: " Ya", duration: 0.53, begin: 42.500, index: 124 },
  { text: "rın", duration: 0.53, begin: 42.750, index: 125 },
  { text: " he", duration: 0.53, begin: 43.500, index: 126 },
  { text: "pi", duration: 0.53, begin: 43.750, index: 127 },
  { text: "niz", duration: 0.53, begin: 44.000, index: 128 },
  { text: " bi", duration: 0.53, begin: 44.250, index: 129 },
  { text: "rer", duration: 0.53, begin: 44.500, index: 130 },
  { text: " plas", duration: 0.53, begin: 44.750, index: 131 },
  { text: "tik", duration: 0.53, begin: 45.000, index: 132 },
  { text: " tor", duration: 0.53, begin: 45.250, index: 133 },
  { text: "ba", duration: 0.53, begin: 45.500, index: 134 },
  { text: " ve", duration: 0.53, begin: 46.500, index: 135 },
  { text: " beş", duration: 0.48, begin: 47.250, index: 136 },
  { text: "er", duration: 0.48, begin: 47.500, index: 137 },
  { text: " ki", duration: 0.48, begin: 47.750, index: 138 },
  { text: "lo", duration: 0.48, begin: 48.000, index: 139 },
  { text: " pa", duration: 0.48, begin: 48.250, index: 140 },
  { text: "ta", duration: 0.48, begin: 48.500, index: 141 },
  { text: "tes", duration: 0.48, begin: 48.750, index: 142 },
  { text: " ge", duration: 0.48, begin: 49.000, index: 143 },
  { text: "ti", duration: 0.48, begin: 49.250, index: 144 },
  { text: "re", duration: 0.48, begin: 49.500, index: 145 },
  { text: "cek", duration: 0.48, begin: 49.750, index: 146 },
  { text: "si", duration: 0.48, begin: 50.000, index: 147 },
  { text: "niz!\"", duration: 0.48, begin: 50.250, index: 148 },
  { text: " Öğ", duration: 0.53, begin: 51.250, index: 149 },
  { text: "ren", duration: 0.53, begin: 51.500, index: 150 },
  { text: "ci", duration: 0.53, begin: 51.750, index: 151 },
  { text: "ler,", duration: 0.53, begin: 52.000, index: 152 },
  { text: " bu", duration: 0.53, begin: 53.000, index: 153 },
  { text: " iş", duration: 0.53, begin: 53.250, index: 154 },
  { text: "ten", duration: 0.53, begin: 53.500, index: 155 },
  { text: " pek", duration: 0.53, begin: 53.750, index: 156 },
  { text: " bir", duration: 0.53, begin: 54.000, index: 157 },
  { text: " şey", duration: 0.53, begin: 54.250, index: 158 },
  { text: " an", duration: 0.68, begin: 54.500, index: 159 },
  { text: "la", duration: 0.68, begin: 54.750, index: 160 },
  { text: "ma", duration: 0.68, begin: 55.000, index: 161 },
  { text: "mış", duration: 0.68, begin: 55.250, index: 162 },
  { text: "lar", duration: 0.68, begin: 55.500, index: 163 },
  { text: "dır.", duration: 0.68, begin: 55.750, index: 164 },
  { text: " A", duration: 0.53, begin: 57.250, index: 165 },
  { text: "ma", duration: 0.53, begin: 57.500, index: 166 },
  { text: " er", duration: 0.53, begin: 57.750, index: 167 },
  { text: "te", duration: 0.53, begin: 58.000, index: 168 },
  { text: "si", duration: 0.53, begin: 58.250, index: 169 },
  { text: " sa", duration: 0.53, begin: 58.500, index: 170 },
  { text: "bah", duration: 0.53, begin: 58.750, index: 171 },
  { text: " hep", duration: 0.53, begin: 59.250, index: 172 },
  { text: "si", duration: 0.53, begin: 59.500, index: 173 },
  { text: "nin", duration: 0.53, begin: 59.750, index: 174 },
  { text: " sı", duration: 0.53, begin: 60.250, index: 175 },
  { text: "ra", duration: 0.53, begin: 60.500, index: 176 },
  { text: "la", duration: 0.53, begin: 60.750, index: 177 },
  { text: "rı", duration: 0.53, begin: 61.000, index: 178 },
  { text: "nın", duration: 0.53, begin: 61.250, index: 179 },
  { text: " ü", duration: 0.53, begin: 61.500, index: 180 },
  { text: "ze", duration: 0.53, begin: 61.750, index: 181 },
  { text: "rin", duration: 0.53, begin: 62.000, index: 182 },
  { text: "de", duration: 0.53, begin: 62.250, index: 183 },
  { text: " pa", duration: 0.53, begin: 62.500, index: 184 },
  { text: "ta", duration: 0.53, begin: 62.750, index: 185 },
  { text: "tes", duration: 0.53, begin: 63.000, index: 186 },
  { text: "ler", duration: 0.53, begin: 63.250, index: 187 },
  { text: " ve", duration: 0.53, begin: 64.000, index: 188 },
  { text: " tor", duration: 0.53, begin: 64.500, index: 189 },
  { text: "ba", duration: 0.53, begin: 64.750, index: 190 },
  { text: "lar", duration: 0.53, begin: 65.000, index: 191 },
  { text: " ha", duration: 0.53, begin: 65.250, index: 192 },
  { text: "zır", duration: 0.53, begin: 65.500, index: 193 },
  { text: "dır.", duration: 0.53, begin: 65.750, index: 194 },
  { text: " Ken", duration: 0.53, begin: 66.750, index: 195 },
  { text: "di", duration: 0.53, begin: 67.000, index: 196 },
  { text: "si", duration: 0.53, begin: 67.250, index: 197 },
  { text: "ne", duration: 0.53, begin: 67.500, index: 198 },
  { text: " me", duration: 0.53, begin: 67.750, index: 199 },
  { text: "rak", duration: 0.53, begin: 68.000, index: 200 },
  { text: "lı", duration: 0.53, begin: 68.250, index: 201 },
  { text: " göz", duration: 0.53, begin: 68.500, index: 202 },
  { text: "ler", duration: 0.53, begin: 68.750, index: 203 },
  { text: "le", duration: 0.53, begin: 69.000, index: 204 },
  { text: " ba", duration: 0.53, begin: 69.250, index: 205 },
  { text: "kan", duration: 0.53, begin: 69.500, index: 206 },
  { text: " öğ", duration: 0.53, begin: 69.750, index: 207 },
  { text: "ren", duration: 0.53, begin: 70.000, index: 208 },
  { text: "ci", duration: 0.53, begin: 70.250, index: 209 },
  { text: "le", duration: 0.53, begin: 70.500, index: 210 },
  { text: "ri", duration: 0.53, begin: 70.750, index: 211 },
  { text: "ne", duration: 0.53, begin: 71.000, index: 212 },
  { text: " şöy", duration: 0.53, begin: 71.750, index: 213 },
  { text: "le", duration: 0.53, begin: 72.000, index: 214 },
  { text: " der", duration: 0.53, begin: 72.250, index: 215 },
  { text: " öğ", duration: 0.53, begin: 72.500, index: 216 },
  { text: "ret", duration: 0.53, begin: 72.750, index: 217 },
  { text: "men:", duration: 0.53, begin: 73.000, index: 218 },
  { text: " \"Şim", duration: 0.53, begin: 74.250, index: 219 },
  { text: "di,", duration: 0.53, begin: 74.500, index: 220 },
  { text: " bu", duration: 0.53, begin: 75.500, index: 221 },
  { text: "gü", duration: 0.53, begin: 75.750, index: 222 },
  { text: "ne", duration: 0.53, begin: 76.000, index: 223 },
  { text: " dek", duration: 0.53, begin: 76.250, index: 224 },
  { text: " af", duration: 0.53, begin: 76.500, index: 225 },
  { text: "fet", duration: 0.53, begin: 76.750, index: 226 },
  { text: "me", duration: 0.53, begin: 77.000, index: 227 },
  { text: "yi", duration: 0.53, begin: 77.250, index: 228 },
  { text: " red", duration: 0.53, begin: 77.500, index: 229 },
  { text: "det", duration: 0.53, begin: 77.750, index: 230 },
  { text: "ti", duration: 0.53, begin: 78.000, index: 231 },
  { text: "ği", duration: 0.53, begin: 78.250, index: 232 },
  { text: "niz", duration: 0.53, begin: 78.500, index: 233 },
  { text: " her", duration: 0.53, begin: 79.500, index: 234 },
  { text: " ki", duration: 0.53, begin: 79.750, index: 235 },
  { text: "şi", duration: 0.53, begin: 80.000, index: 236 },
  { text: " i", duration: 0.53, begin: 80.250, index: 237 },
  { text: "çin", duration: 0.53, begin: 80.500, index: 238 },
  { text: " bir", duration: 0.53, begin: 80.750, index: 239 },
  { text: " pa", duration: 0.53, begin: 81.000, index: 240 },
  { text: "ta", duration: 0.53, begin: 81.250, index: 241 },
  { text: "tes", duration: 0.53, begin: 81.500, index: 242 },
  { text: " a", duration: 0.53, begin: 81.750, index: 243 },
  { text: "lın,", duration: 0.53, begin: 82.000, index: 244 },
  { text: " o", duration: 0.53, begin: 83.000, index: 245 },
  { text: " ki", duration: 0.53, begin: 83.250, index: 246 },
  { text: "şi", duration: 0.53, begin: 83.500, index: 247 },
  { text: "nin", duration: 0.53, begin: 83.750, index: 248 },
  { text: " a", duration: 0.53, begin: 84.000, index: 249 },
  { text: "dı", duration: 0.53, begin: 84.250, index: 250 },
  { text: "nı", duration: 0.53, begin: 84.500, index: 251 },
  { text: " o", duration: 0.53, begin: 85.250, index: 252 },
  { text: " pa", duration: 0.53, begin: 85.500, index: 253 },
  { text: "ta", duration: 0.53, begin: 85.750, index: 254 },
  { text: "te", duration: 0.53, begin: 86.000, index: 255 },
  { text: "sin", duration: 0.53, begin: 86.250, index: 256 },
  { text: " ü", duration: 0.53, begin: 86.500, index: 257 },
  { text: "ze", duration: 0.53, begin: 86.750, index: 258 },
  { text: "ri", duration: 0.53, begin: 87.000, index: 259 },
  { text: "ne", duration: 0.53, begin: 87.250, index: 260 },
  { text: " ya", duration: 0.53, begin: 87.500, index: 261 },
  { text: "zıp", duration: 0.53, begin: 87.750, index: 262 },
  { text: " tor", duration: 0.53, begin: 88.500, index: 263 },
  { text: "ba", duration: 0.53, begin: 88.750, index: 264 },
  { text: "nın", duration: 0.53, begin: 89.000, index: 265 },
  { text: " i", duration: 0.53, begin: 89.250, index: 266 },
  { text: "çi", duration: 0.53, begin: 89.500, index: 267 },
  { text: "ne", duration: 0.53, begin: 89.750, index: 268 },
  { text: " ko", duration: 0.53, begin: 90.000, index: 269 },
  { text: "yun\"", duration: 0.53, begin: 90.250, index: 270 },
  { text: " Ba", duration: 0.53, begin: 91.000, index: 271 },
  { text: "zı", duration: 0.53, begin: 91.250, index: 272 },
  { text: " öğ", duration: 0.53, begin: 91.500, index: 273 },
  { text: "ren", duration: 0.53, begin: 91.750, index: 274 },
  { text: "ci", duration: 0.53, begin: 92.000, index: 275 },
  { text: "ler", duration: 0.53, begin: 92.250, index: 276 },
  { text: " tor", duration: 0.53, begin: 93.000, index: 277 },
  { text: "ba", duration: 0.53, begin: 93.250, index: 278 },
  { text: "la", duration: 0.53, begin: 93.500, index: 279 },
  { text: "rı", duration: 0.53, begin: 93.750, index: 280 },
  { text: "na", duration: 0.53, begin: 94.000, index: 281 },
  { text: " ü", duration: 0.53, begin: 94.250, index: 282 },
  { text: "çer-", duration: 0.53, begin: 94.500, index: 283 },
  { text: "be", duration: 0.53, begin: 94.750, index: 284 },
  { text: "şer", duration: 0.53, begin: 95.000, index: 285 },
  { text: " ta", duration: 0.53, begin: 95.250, index: 286 },
  { text: "ne", duration: 0.53, begin: 95.500, index: 287 },
  { text: " pa", duration: 0.53, begin: 95.750, index: 288 },
  { text: "ta", duration: 0.53, begin: 96.000, index: 289 },
  { text: "tes", duration: 0.53, begin: 96.250, index: 290 },
  { text: " ko", duration: 0.53, begin: 96.500, index: 291 },
  { text: "yar", duration: 0.53, begin: 96.750, index: 292 },
  { text: "ken,", duration: 0.53, begin: 97.000, index: 293 },
  { text: " ba", duration: 0.53, begin: 98.500, index: 294 },
  { text: "zı", duration: 0.53, begin: 98.750, index: 295 },
  { text: "la", duration: 0.53, begin: 99.000, index: 296 },
  { text: "rı", duration: 0.53, begin: 99.250, index: 297 },
  { text: "nın", duration: 0.53, begin: 99.500, index: 298 },
  { text: " tor", duration: 0.53, begin: 99.750, index: 299 },
  { text: "ba", duration: 0.53, begin: 100.000, index: 300 },
  { text: "sı", duration: 0.53, begin: 100.250, index: 301 },
  { text: " ne", duration: 0.53, begin: 101.000, index: 302 },
  { text: "re", duration: 0.53, begin: 101.250, index: 303 },
  { text: "dey", duration: 0.53, begin: 101.500, index: 304 },
  { text: "se", duration: 0.53, begin: 101.750, index: 305 },
  { text: " ağ", duration: 0.53, begin: 102.000, index: 306 },
  { text: "zı", duration: 0.53, begin: 102.250, index: 307 },
  { text: "na", duration: 0.53, begin: 102.500, index: 308 },
  { text: " ka", duration: 0.53, begin: 102.750, index: 309 },
  { text: "dar", duration: 0.53, begin: 103.000, index: 310 },
  { text: " dol", duration: 0.68, begin: 103.250, index: 311 },
  { text: "muş", duration: 0.68, begin: 103.500, index: 312 },
  { text: "tur.", duration: 0.68, begin: 103.750, index: 313 },
  { text: " Öğ", duration: 0.53, begin: 105.250, index: 314 },
  { text: "ret", duration: 0.53, begin: 105.500, index: 315 },
  { text: "men,", duration: 0.53, begin: 105.750, index: 316 },
  { text: " ken", duration: 0.53, begin: 106.750, index: 317 },
  { text: "di", duration: 0.53, begin: 107.000, index: 318 },
  { text: "si", duration: 0.53, begin: 107.250, index: 319 },
  { text: "ne", duration: 0.53, begin: 107.500, index: 320 },
  { text: " \"Pe", duration: 0.53, begin: 108.500, index: 321 },
  { text: "ki", duration: 0.53, begin: 108.750, index: 322 },
  { text: " şim", duration: 0.53, begin: 109.000, index: 323 },
  { text: "di", duration: 0.53, begin: 109.250, index: 324 },
  { text: " ne", duration: 0.53, begin: 109.500, index: 325 },
  { text: " o", duration: 0.53, begin: 109.750, index: 326 },
  { text: "la", duration: 0.53, begin: 110.000, index: 327 },
  { text: "cak?\"", duration: 0.53, begin: 110.250, index: 328 },
  { text: " der", duration: 0.53, begin: 111.000, index: 329 },
  { text: " gi", duration: 0.53, begin: 111.250, index: 330 },
  { text: "bi", duration: 0.53, begin: 111.500, index: 331 },
  { text: " ba", duration: 0.53, begin: 111.750, index: 332 },
  { text: "kan", duration: 0.53, begin: 112.000, index: 333 },
  { text: " öğ", duration: 0.53, begin: 112.250, index: 334 },
  { text: "ren", duration: 0.53, begin: 112.500, index: 335 },
  { text: "ci", duration: 0.53, begin: 112.750, index: 336 },
  { text: "le", duration: 0.53, begin: 113.000, index: 337 },
  { text: "ri", duration: 0.53, begin: 113.250, index: 338 },
  { text: "ne", duration: 0.53, begin: 113.500, index: 339 },
  { text: " i", duration: 0.53, begin: 114.500, index: 340 },
  { text: "kin", duration: 0.53, begin: 114.750, index: 341 },
  { text: "ci", duration: 0.53, begin: 115.000, index: 342 },
  { text: " a", duration: 0.53, begin: 115.250, index: 343 },
  { text: "çık", duration: 0.53, begin: 115.500, index: 344 },
  { text: "la", duration: 0.53, begin: 115.750, index: 345 },
  { text: "ma", duration: 0.53, begin: 116.000, index: 346 },
  { text: "sı", duration: 0.53, begin: 116.250, index: 347 },
  { text: "nı", duration: 0.53, begin: 116.500, index: 348 },
  { text: " ya", duration: 0.53, begin: 116.750, index: 349 },
  { text: "par:", duration: 0.53, begin: 117.000, index: 350 },
  { text: " \"Bir", duration: 0.53, begin: 118.000, index: 351 },
  { text: " haf", duration: 0.53, begin: 118.250, index: 352 },
  { text: "ta", duration: 0.53, begin: 118.500, index: 353 },
  { text: " bo", duration: 0.53, begin: 118.750, index: 354 },
  { text: "yun", duration: 0.53, begin: 119.000, index: 355 },
  { text: "ca", duration: 0.53, begin: 119.250, index: 356 },
  { text: " ne", duration: 0.53, begin: 120.000, index: 357 },
  { text: "re", duration: 0.53, begin: 120.250, index: 358 },
  { text: "ye", duration: 0.53, begin: 120.500, index: 359 },
  { text: " gi", duration: 0.53, begin: 120.750, index: 360 },
  { text: "der", duration: 0.53, begin: 121.000, index: 361 },
  { text: "se", duration: 0.53, begin: 121.250, index: 362 },
  { text: "niz", duration: 0.53, begin: 121.500, index: 363 },
  { text: " gi", duration: 0.53, begin: 121.750, index: 364 },
  { text: "din,", duration: 0.53, begin: 122.000, index: 365 },
  { text: " bu", duration: 0.53, begin: 123.000, index: 366 },
  { text: " tor", duration: 0.53, begin: 123.250, index: 367 },
  { text: "ba", duration: 0.53, begin: 123.500, index: 368 },
  { text: "la", duration: 0.53, begin: 123.750, index: 369 },
  { text: "rı", duration: 0.53, begin: 124.000, index: 370 },
  { text: " ya", duration: 0.53, begin: 124.250, index: 371 },
  { text: "nı", duration: 0.53, begin: 124.500, index: 372 },
  { text: "nız", duration: 0.53, begin: 124.750, index: 373 },
  { text: "da", duration: 0.53, begin: 125.000, index: 374 },
  { text: " ta", duration: 0.38, begin: 125.250, index: 375 },
  { text: "şı", duration: 0.38, begin: 125.500, index: 376 },
  { text: "ya", duration: 0.38, begin: 125.750, index: 377 },
  { text: "cak", duration: 0.38, begin: 126.000, index: 378 },
  { text: "sı", duration: 0.38, begin: 126.250, index: 379 },
  { text: "nız.", duration: 0.38, begin: 126.500, index: 380 },
  { text: " Yat", duration: 0.53, begin: 127.250, index: 381 },
  { text: "tı", duration: 0.53, begin: 127.500, index: 382 },
  { text: "ği", duration: 0.53, begin: 127.750, index: 383 },
  { text: "nız", duration: 0.53, begin: 128.000, index: 384 },
  { text: " ya", duration: 0.53, begin: 128.250, index: 385 },
  { text: "tak", duration: 0.53, begin: 128.500, index: 386 },
  { text: "ta,", duration: 0.53, begin: 128.750, index: 387 },
  { text: " bin", duration: 0.53, begin: 129.500, index: 388 },
  { text: "di", duration: 0.53, begin: 129.750, index: 389 },
  { text: "ği", duration: 0.53, begin: 130.000, index: 390 },
  { text: "niz", duration: 0.53, begin: 130.250, index: 391 },
  { text: " o", duration: 0.53, begin: 130.500, index: 392 },
  { text: "to", duration: 0.53, begin: 130.750, index: 393 },
  { text: "büs", duration: 0.53, begin: 131.000, index: 394 },
  { text: "te,", duration: 0.53, begin: 131.250, index: 395 },
  { text: " o", duration: 0.53, begin: 132.250, index: 396 },
  { text: "kul", duration: 0.53, begin: 132.500, index: 397 },
  { text: "day", duration: 0.53, begin: 132.750, index: 398 },
  { text: "ken", duration: 0.53, begin: 133.250, index: 399 },
  { text: " sı", duration: 0.53, begin: 134.250, index: 400 },
  { text: "ra", duration: 0.53, begin: 134.500, index: 401 },
  { text: "nı", duration: 0.53, begin: 134.750, index: 402 },
  { text: "zın", duration: 0.53, begin: 135.000, index: 403 },
  { text: " üs", duration: 0.53, begin: 135.250, index: 404 },
  { text: "tün", duration: 0.53, begin: 135.500, index: 405 },
  { text: "de.", duration: 0.53, begin: 135.750, index: 406 },
  { text: " Hep", duration: 0.53, begin: 136.500, index: 407 },
  { text: " ya", duration: 0.53, begin: 136.750, index: 408 },
  { text: "nı", duration: 0.53, begin: 137.000, index: 409 },
  { text: "nız", duration: 0.53, begin: 137.250, index: 410 },
  { text: "da", duration: 0.53, begin: 137.500, index: 411 },
  { text: " o", duration: 0.53, begin: 137.750, index: 412 },
  { text: "la", duration: 0.53, begin: 138.000, index: 413 },
  { text: "cak", duration: 0.53, begin: 138.250, index: 414 },
  { text: "lar.\"", duration: 0.53, begin: 138.500, index: 415 },
  { text: " A", duration: 0.53, begin: 139.500, index: 416 },
  { text: "ra", duration: 0.53, begin: 139.750, index: 417 },
  { text: "dan", duration: 0.53, begin: 140.000, index: 418 },
  { text: " bir", duration: 0.53, begin: 140.250, index: 419 },
  { text: " haf", duration: 0.53, begin: 140.500, index: 420 },
  { text: "ta", duration: 0.53, begin: 140.750, index: 421 },
  { text: " geç", duration: 0.68, begin: 141.000, index: 422 },
  { text: "miş", duration: 0.68, begin: 141.250, index: 423 },
  { text: "tir.", duration: 0.68, begin: 141.500, index: 424 },
  { text: " Ho", duration: 0.53, begin: 142.750, index: 425 },
  { text: "ca", duration: 0.53, begin: 143.000, index: 426 },
  { text: "la", duration: 0.53, begin: 143.250, index: 427 },
  { text: "rı", duration: 0.53, begin: 143.500, index: 428 },
  { text: " sı", duration: 0.53, begin: 143.750, index: 429 },
  { text: "nı", duration: 0.53, begin: 144.000, index: 430 },
  { text: "fa", duration: 0.53, begin: 144.250, index: 431 },
  { text: " gi", duration: 0.53, begin: 144.500, index: 432 },
  { text: "rer", duration: 0.53, begin: 144.750, index: 433 },
  { text: " gir", duration: 0.53, begin: 145.000, index: 434 },
  { text: "mez,", duration: 0.53, begin: 145.250, index: 435 },
  { text: " de", duration: 0.53, begin: 145.750, index: 436 },
  { text: "ni", duration: 0.53, begin: 146.000, index: 437 },
  { text: "le", duration: 0.53, begin: 146.250, index: 438 },
  { text: "ni", duration: 0.53, begin: 146.500, index: 439 },
  { text: " yap", duration: 0.53, begin: 146.750, index: 440 },
  { text: "mış", duration: 0.53, begin: 147.000, index: 441 },
  { text: " o", duration: 0.53, begin: 147.250, index: 442 },
  { text: "lan", duration: 0.53, begin: 147.500, index: 443 },
  { text: " öğ", duration: 0.53, begin: 147.750, index: 444 },
  { text: "ren", duration: 0.53, begin: 148.000, index: 445 },
  { text: "ci", duration: 0.53, begin: 148.250, index: 446 },
  { text: "ler", duration: 0.53, begin: 148.500, index: 447 },
  { text: " şi", duration: 0.53, begin: 148.750, index: 448 },
  { text: "ka", duration: 0.53, begin: 149.000, index: 449 },
  { text: "ye", duration: 0.53, begin: 149.250, index: 450 },
  { text: "te", duration: 0.53, begin: 149.500, index: 451 },
  { text: " baş", duration: 0.78, begin: 149.750, index: 452 },
  { text: "lar", duration: 0.78, begin: 150.000, index: 453 },
  { text: "lar:", duration: 0.78, begin: 150.250, index: 454 },
  { text: " \"Ho", duration: 0.53, begin: 151.500, index: 455 },
  { text: "cam,", duration: 0.53, begin: 151.750, index: 456 },
  { text: " bu", duration: 0.53, begin: 152.750, index: 457 },
  { text: " ka", duration: 0.53, begin: 153.000, index: 458 },
  { text: "dar", duration: 0.53, begin: 153.250, index: 459 },
  { text: " a", duration: 0.53, begin: 153.500, index: 460 },
  { text: "ğır", duration: 0.53, begin: 153.750, index: 461 },
  { text: " tor", duration: 0.53, begin: 154.000, index: 462 },
  { text: "ba", duration: 0.53, begin: 154.250, index: 463 },
  { text: "yı", duration: 0.53, begin: 154.500, index: 464 },
  { text: " her", duration: 0.53, begin: 154.750, index: 465 },
  { text: " ye", duration: 0.53, begin: 155.000, index: 466 },
  { text: "re", duration: 0.53, begin: 155.250, index: 467 },
  { text: " ta", duration: 0.53, begin: 155.500, index: 468 },
  { text: "şı", duration: 0.53, begin: 155.750, index: 469 },
  { text: "mak", duration: 0.53, begin: 156.000, index: 470 },
  { text: " çok", duration: 0.53, begin: 156.250, index: 471 },
  { text: " zor.\"", duration: 0.53, begin: 156.500, index: 472 },
  { text: " \"Ho", duration: 0.53, begin: 157.500, index: 473 },
  { text: "cam,", duration: 0.53, begin: 157.750, index: 474 },
  { text: " pa", duration: 0.53, begin: 158.750, index: 475 },
  { text: "ta", duration: 0.53, begin: 159.000, index: 476 },
  { text: "tes", duration: 0.53, begin: 159.250, index: 477 },
  { text: "ler", duration: 0.53, begin: 159.500, index: 478 },
  { text: " kok", duration: 0.53, begin: 159.750, index: 479 },
  { text: "ma", duration: 0.53, begin: 160.000, index: 480 },
  { text: "ya", duration: 0.53, begin: 160.250, index: 481 },
  { text: " baş", duration: 0.53, begin: 160.500, index: 482 },
  { text: "la", duration: 0.53, begin: 160.750, index: 483 },
  { text: "dı.", duration: 0.53, begin: 161.000, index: 484 },
  { text: " Val", duration: 0.53, begin: 162.250, index: 485 },
  { text: "la", duration: 0.53, begin: 162.500, index: 486 },
  { text: "hi,", duration: 0.53, begin: 162.750, index: 487 },
  { text: " in", duration: 0.53, begin: 163.500, index: 488 },
  { text: "san", duration: 0.53, begin: 163.750, index: 489 },
  { text: "lar", duration: 0.53, begin: 164.000, index: 490 },
  { text: " tu", duration: 0.53, begin: 164.250, index: 491 },
  { text: "haf", duration: 0.53, begin: 164.500, index: 492 },
  { text: " ba", duration: 0.53, begin: 164.750, index: 493 },
  { text: "kı", duration: 0.53, begin: 165.000, index: 494 },
  { text: "yor", duration: 0.53, begin: 165.250, index: 495 },
  { text: "lar.", duration: 0.53, begin: 165.500, index: 496 },
  { text: " Hem", duration: 0.53, begin: 166.750, index: 497 },
  { text: " sı", duration: 0.53, begin: 167.000, index: 498 },
  { text: "kıl", duration: 0.53, begin: 167.250, index: 499 },
  { text: "dık,", duration: 0.53, begin: 167.500, index: 500 },
  { text: " hem", duration: 0.53, begin: 168.250, index: 501 },
  { text: " yo", duration: 0.53, begin: 168.500, index: 502 },
  { text: "rul", duration: 0.53, begin: 168.750, index: 503 },
  { text: "duk?\"", duration: 0.53, begin: 169.000, index: 504 },
  { text: " Öğ", duration: 0.53, begin: 170.500, index: 505 },
  { text: "ret", duration: 0.53, begin: 170.750, index: 506 },
  { text: "men", duration: 0.53, begin: 171.000, index: 507 },
  { text: " gü", duration: 0.53, begin: 171.250, index: 508 },
  { text: "lüm", duration: 0.53, begin: 171.500, index: 509 },
  { text: "se", duration: 0.53, begin: 171.750, index: 510 },
  { text: "ye", duration: 0.53, begin: 172.000, index: 511 },
  { text: "rek", duration: 0.53, begin: 172.250, index: 512 },
  { text: " öğ", duration: 0.53, begin: 172.500, index: 513 },
  { text: "ren", duration: 0.53, begin: 172.750, index: 514 },
  { text: "ci", duration: 0.53, begin: 173.000, index: 515 },
  { text: "le", duration: 0.53, begin: 173.250, index: 516 },
  { text: "ri", duration: 0.53, begin: 173.500, index: 517 },
  { text: "ne", duration: 0.53, begin: 173.750, index: 518 },
  { text: " şu", duration: 0.53, begin: 174.750, index: 519 },
  { text: " der", duration: 0.53, begin: 175.000, index: 520 },
  { text: "si", duration: 0.53, begin: 175.250, index: 521 },
  { text: " ve", duration: 0.53, begin: 175.500, index: 522 },
  { text: "rir:", duration: 0.53, begin: 175.750, index: 523 },
  { text: " \"Gö", duration: 0.53, begin: 176.500, index: 524 },
  { text: "rü", duration: 0.53, begin: 176.750, index: 525 },
  { text: "yor", duration: 0.53, begin: 177.000, index: 526 },
  { text: "su", duration: 0.53, begin: 177.250, index: 527 },
  { text: "nuz", duration: 0.53, begin: 177.500, index: 528 },
  { text: " ki,", duration: 0.53, begin: 177.750, index: 529 },
  { text: " af", duration: 0.53, begin: 178.750, index: 530 },
  { text: "fet", duration: 0.53, begin: 179.000, index: 531 },
  { text: "me", duration: 0.53, begin: 179.250, index: 532 },
  { text: "ye", duration: 0.53, begin: 179.500, index: 533 },
  { text: "rek", duration: 0.53, begin: 179.750, index: 534 },
  { text: " a", duration: 0.53, begin: 180.750, index: 535 },
  { text: "sıl", duration: 0.53, begin: 181.000, index: 536 },
  { text: " ken", duration: 0.53, begin: 181.250, index: 537 },
  { text: "di", duration: 0.53, begin: 181.500, index: 538 },
  { text: "mi", duration: 0.53, begin: 181.750, index: 539 },
  { text: "zi", duration: 0.53, begin: 182.000, index: 540 },
  { text: " ce", duration: 0.53, begin: 182.250, index: 541 },
  { text: "za", duration: 0.53, begin: 182.500, index: 542 },
  { text: "lan", duration: 0.53, begin: 182.750, index: 543 },
  { text: "dı", duration: 0.53, begin: 183.000, index: 544 },
  { text: "rı", duration: 0.53, begin: 183.250, index: 545 },
  { text: "yo", duration: 0.53, begin: 183.500, index: 546 },
  { text: "ruz.", duration: 0.53, begin: 183.750, index: 547 },
  { text: " Ken", duration: 0.53, begin: 184.750, index: 548 },
  { text: "di", duration: 0.53, begin: 185.000, index: 549 },
  { text: "mi", duration: 0.53, begin: 185.250, index: 550 },
  { text: "zi", duration: 0.53, begin: 185.500, index: 551 },
  { text: " ru", duration: 0.53, begin: 186.500, index: 552 },
  { text: "hu", duration: 0.53, begin: 186.750, index: 553 },
  { text: "muz", duration: 0.53, begin: 187.000, index: 554 },
  { text: "da", duration: 0.53, begin: 187.250, index: 555 },
  { text: " a", duration: 0.53, begin: 187.500, index: 556 },
  { text: "ğır", duration: 0.53, begin: 187.750, index: 557 },
  { text: " yük", duration: 0.53, begin: 188.000, index: 558 },
  { text: "ler", duration: 0.53, begin: 188.250, index: 559 },
  { text: " ta", duration: 0.53, begin: 188.500, index: 560 },
  { text: "şı", duration: 0.53, begin: 188.750, index: 561 },
  { text: "ma", duration: 0.53, begin: 189.000, index: 562 },
  { text: "ya", duration: 0.53, begin: 189.250, index: 563 },
  { text: " mah", duration: 0.53, begin: 190.250, index: 564 },
  { text: "kum", duration: 0.53, begin: 190.500, index: 565 },
  { text: " e", duration: 0.53, begin: 190.750, index: 566 },
  { text: "di", duration: 0.53, begin: 191.000, index: 567 },
  { text: "yo", duration: 0.53, begin: 191.250, index: 568 },
  { text: "ruz.", duration: 0.53, begin: 191.500, index: 569 },
  { text: " Af", duration: 0.53, begin: 192.500, index: 570 },
  { text: "fet", duration: 0.53, begin: 192.750, index: 571 },
  { text: "me", duration: 0.53, begin: 193.000, index: 572 },
  { text: "yi", duration: 0.53, begin: 193.250, index: 573 },
  { text: " kar", duration: 0.53, begin: 194.250, index: 574 },
  { text: "şı", duration: 0.53, begin: 194.500, index: 575 },
  { text: "mız", duration: 0.53, begin: 194.750, index: 576 },
  { text: "da", duration: 0.53, begin: 195.000, index: 577 },
  { text: "ki", duration: 0.53, begin: 195.250, index: 578 },
  { text: " ki", duration: 0.53, begin: 195.500, index: 579 },
  { text: "şi", duration: 0.53, begin: 195.750, index: 580 },
  { text: "ye", duration: 0.53, begin: 196.000, index: 581 },
  { text: " bir", duration: 0.53, begin: 196.750, index: 582 },
  { text: " ih", duration: 0.53, begin: 197.000, index: 583 },
  { text: "san", duration: 0.53, begin: 197.250, index: 584 },
  { text: " o", duration: 0.53, begin: 197.500, index: 585 },
  { text: "la", duration: 0.53, begin: 197.750, index: 586 },
  { text: "rak", duration: 0.53, begin: 198.000, index: 587 },
  { text: " dü", duration: 0.53, begin: 198.250, index: 588 },
  { text: "şü", duration: 0.53, begin: 198.500, index: 589 },
  { text: "nü", duration: 0.53, begin: 198.750, index: 590 },
  { text: "yo", duration: 0.53, begin: 199.000, index: 591 },
  { text: "ruz,", duration: 0.53, begin: 199.250, index: 592 },
  { text: " hal", duration: 0.53, begin: 200.250, index: 593 },
  { text: "bu", duration: 0.53, begin: 200.500, index: 594 },
  { text: "ki", duration: 0.53, begin: 200.750, index: 595 },
  { text: " af", duration: 0.53, begin: 201.500, index: 596 },
  { text: "fet", duration: 0.53, begin: 201.750, index: 597 },
  { text: "mek", duration: 0.53, begin: 202.000, index: 598 },
  { text: " en", duration: 0.53, begin: 202.250, index: 599 },
  { text: " baş", duration: 0.53, begin: 202.500, index: 600 },
  { text: "ta", duration: 0.53, begin: 202.750, index: 601 },
  { text: " ken", duration: 0.53, begin: 203.000, index: 602 },
  { text: "di", duration: 0.53, begin: 203.250, index: 603 },
  { text: "mi", duration: 0.53, begin: 203.500, index: 604 },
  { text: "ze", duration: 0.53, begin: 203.750, index: 605 },
  { text: " yap", duration: 0.68, begin: 204.000, index: 606 },
  { text: "tı", duration: 0.68, begin: 204.250, index: 607 },
  { text: "ği", duration: 0.68, begin: 204.500, index: 608 },
  { text: "mız", duration: 0.68, begin: 204.750, index: 609 },
  { text: " bir", duration: 0.68, begin: 205.000, index: 610 },
  { text: " i", duration: 0.68, begin: 205.750, index: 611 },
  { text: "yi", duration: 0.68, begin: 206.000, index: 612 },
  { text: "lik", duration: 0.68, begin: 206.250, index: 613 },
  { text: "tir.\"", duration: 0.68, begin: 206.500, index: 614 },
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
  <Link href="/dashboard/stories/bambu-agaci" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/2-6.mp3"
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