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
  { text: "", duration: 0.154, begin: 0.300, index: 0 },
  
  // Title
  { text: "Gü", duration: 0.53, begin: 0.300, index: 1, isTitle: true, isCenter: true },
  { text: "rül", duration: 0.53, begin: 0.500, index: 2, isTitle: true, isCenter: true },
  { text: "tü", duration: 0.53, begin: 0.700, index: 3, isTitle: true, isCenter: true },
  
  // Story content
  { text: "Yaş", duration: 0.53, begin: 2.250, index: 4 },
  { text: "lı", duration: 0.53, begin: 2.500, index: 5 },
  { text: " bir", duration: 0.53, begin: 2.750, index: 6 },
  { text: " a", duration: 0.53, begin: 3.000, index: 7 },
  { text: "dam", duration: 0.53, begin: 3.250, index: 8 },
  { text: " e", duration: 0.53, begin: 4.250, index: 9 },
  { text: "mek", duration: 0.53, begin: 4.500, index: 10 },
  { text: "li", duration: 0.53, begin: 4.750, index: 11 },
  { text: "ye", duration: 0.53, begin: 5.000, index: 12 },
  { text: " ay", duration: 0.53, begin: 5.250, index: 13 },
  { text: "rı", duration: 0.53, begin: 5.500, index: 14 },
  { text: "lır.", duration: 0.53, begin: 5.750, index: 15 },
  { text: " Sa", duration: 0.53, begin: 7.000, index: 16 },
  { text: "kin", duration: 0.53, begin: 7.250, index: 17 },
  { text: " bir", duration: 0.53, begin: 8.000, index: 18 },
  { text: " ha", duration: 0.53, begin: 8.250, index: 19 },
  { text: "yat", duration: 0.53, begin: 8.500, index: 20 },
  { text: " sür", duration: 0.53, begin: 9.000, index: 21 },
  { text: "mek", duration: 0.53, begin: 9.250, index: 22 },
  { text: " i", duration: 0.28, begin: 9.750, index: 23 },
  { text: "çin", duration: 0.28, begin: 10.000, index: 24 },
  { text: " ken", duration: 0.53, begin: 11.000, index: 25 },
  { text: "di", duration: 0.53, begin: 11.250, index: 26 },
  { text: "ne", duration: 0.53, begin: 11.500, index: 27 },
  { text: " bir", duration: 0.53, begin: 12.500, index: 28 },
  { text: " li", duration: 0.53, begin: 12.750, index: 29 },
  { text: "se", duration: 0.53, begin: 13.000, index: 30 },
  { text: "nin", duration: 0.53, begin: 13.250, index: 31 },
  { text: " ya", duration: 0.53, begin: 13.500, index: 32 },
  { text: "nın", duration: 0.53, begin: 13.750, index: 33 },
  { text: "da", duration: 0.53, begin: 14.000, index: 34 },
  { text: " kü", duration: 0.53, begin: 15.250, index: 35 },
  { text: "çük", duration: 0.53, begin: 15.500, index: 36 },
  { text: " bir", duration: 0.53, begin: 16.000, index: 37 },
  { text: " ev", duration: 0.53, begin: 16.250, index: 38 },
  { text: " a", duration: 0.53, begin: 16.500, index: 39 },
  { text: "lır.", duration: 0.53, begin: 16.750, index: 40 },
  { text: " E", duration: 0.53, begin: 18.500, index: 41 },
  { text: "mek", duration: 0.53, begin: 18.750, index: 42 },
  { text: "li", duration: 0.53, begin: 19.000, index: 43 },
  { text: "li", duration: 0.53, begin: 19.250, index: 44 },
  { text: "ği", duration: 0.53, begin: 19.500, index: 45 },
  { text: "nin", duration: 0.53, begin: 19.750, index: 46 },
  { text: " ilk", duration: 0.53, begin: 20.750, index: 47 },
  { text: " bir", duration: 0.53, begin: 21.250, index: 48 },
  { text: "kaç", duration: 0.53, begin: 21.500, index: 49 },
  { text: " haf", duration: 0.53, begin: 21.750, index: 50 },
  { text: "ta", duration: 0.53, begin: 22.000, index: 51 },
  { text: "sı", duration: 0.53, begin: 22.500, index: 52 },
  { text: "nı", duration: 0.53, begin: 22.750, index: 53 },
  { text: " hu", duration: 0.53, begin: 23.750, index: 54 },
  { text: "zur", duration: 0.53, begin: 24.000, index: 55 },
  { text: " i", duration: 0.53, begin: 24.500, index: 56 },
  { text: "çin", duration: 0.53, begin: 24.750, index: 57 },
  { text: "de", duration: 0.53, begin: 25.000, index: 58 },
  { text: " ge", duration: 0.53, begin: 25.250, index: 59 },
  { text: "çi", duration: 0.53, begin: 25.500, index: 60 },
  { text: "rir;", duration: 0.53, begin: 25.750, index: 61 },
  { text: " a", duration: 0.53, begin: 26.750, index: 62 },
  { text: "ma", duration: 0.53, begin: 27.000, index: 63 },
  { text: " son", duration: 0.53, begin: 27.250, index: 64 },
  { text: "ra", duration: 0.53, begin: 27.750, index: 65 },
  { text: " ders", duration: 0.53, begin: 28.750, index: 66 },
  { text: "yı", duration: 0.53, begin: 29.000, index: 67 },
  { text: "lı", duration: 0.53, begin: 29.250, index: 68 },
  { text: " baş", duration: 0.53, begin: 29.500, index: 69 },
  { text: "lar.", duration: 0.53, begin: 30.000, index: 70 },
  { text: " O", duration: 0.53, begin: 31.500, index: 71 },
  { text: "kul", duration: 0.53, begin: 31.750, index: 72 },
  { text: "la", duration: 0.53, begin: 32.000, index: 73 },
  { text: "rın", duration: 0.53, begin: 32.250, index: 74 },
  { text: " a", duration: 0.53, begin: 32.750, index: 75 },
  { text: "çıl", duration: 0.53, begin: 33.000, index: 76 },
  { text: "dı", duration: 0.53, begin: 33.250, index: 77 },
  { text: "ğı", duration: 0.53, begin: 33.500, index: 78 },
  { text: " ilk", duration: 0.53, begin: 33.750, index: 79 },
  { text: " gün", duration: 0.53, begin: 34.000, index: 80 },
  { text: " ders", duration: 0.53, begin: 35.250, index: 81 },
  { text: "ten", duration: 0.53, begin: 35.500, index: 82 },
  { text: " çı", duration: 0.53, begin: 36.000, index: 83 },
  { text: "kan", duration: 0.53, begin: 36.250, index: 84 },
  { text: " öğ", duration: 0.53, begin: 36.750, index: 85 },
  { text: "ren", duration: 0.53, begin: 37.000, index: 86 },
  { text: "ci", duration: 0.53, begin: 37.250, index: 87 },
  { text: "ler,", duration: 0.53, begin: 37.500, index: 88 },
  { text: " yol", duration: 0.53, begin: 39.000, index: 89 },
  { text: "la", duration: 0.53, begin: 39.250, index: 90 },
  { text: "rı", duration: 0.53, begin: 39.500, index: 91 },
  { text: "nın", duration: 0.53, begin: 39.750, index: 92 },
  { text: " ü", duration: 0.53, begin: 40.250, index: 93 },
  { text: "ze", duration: 0.53, begin: 40.500, index: 94 },
  { text: "rin", duration: 0.53, begin: 40.750, index: 95 },
  { text: "de", duration: 0.53, begin: 41.000, index: 96 },
  { text: "ki", duration: 0.53, begin: 41.250, index: 97 },
  { text: " her", duration: 0.53, begin: 42.250, index: 98 },
  { text: " çöp", duration: 0.53, begin: 42.500, index: 99 },
  { text: " bi", duration: 0.53, begin: 42.750, index: 100 },
  { text: "do", duration: 0.53, begin: 43.000, index: 101 },
  { text: "nu'", duration: 0.53, begin: 43.250, index: 102 },
  { text: "nu", duration: 0.53, begin: 43.500, index: 103 },
  { text: " tek", duration: 0.53, begin: 44.000, index: 104 },
  { text: "me", duration: 0.53, begin: 44.250, index: 105 },
  { text: "ler", duration: 0.53, begin: 44.500, index: 106 },
  { text: "ler,", duration: 0.53, begin: 44.750, index: 107 },
  { text: " ba", duration: 0.53, begin: 46.250, index: 108 },
  { text: "ğı", duration: 0.53, begin: 46.500, index: 109 },
  { text: "rıp", duration: 0.53, begin: 46.750, index: 110 },
  { text: " ça", duration: 0.53, begin: 47.000, index: 111 },
  { text: "ğı", duration: 0.53, begin: 47.250, index: 112 },
  { text: "ra", duration: 0.53, begin: 47.500, index: 113 },
  { text: "rak", duration: 0.53, begin: 48.000, index: 114 },
  { text: " ge", duration: 0.53, begin: 48.750, index: 115 },
  { text: "çer", duration: 0.53, begin: 49.000, index: 116 },
  { text: " gi", duration: 0.53, begin: 49.500, index: 117 },
  { text: "der", duration: 0.53, begin: 49.750, index: 118 },
  { text: "ler.", duration: 0.53, begin: 50.000, index: 119 },
  { text: " Bu", duration: 0.78, begin: 51.500, index: 120 },
  { text: " çe", duration: 0.78, begin: 51.750, index: 121 },
  { text: "kil", duration: 0.78, begin: 52.000, index: 122 },
  { text: "mez", duration: 0.78, begin: 52.250, index: 123 },
  { text: " gü", duration: 0.78, begin: 52.750, index: 124 },
  { text: "rül", duration: 0.78, begin: 53.000, index: 125 },
  { text: "tü", duration: 0.78, begin: 53.250, index: 126 },
  { text: " gün", duration: 0.78, begin: 54.500, index: 127 },
  { text: "ler", duration: 0.78, begin: 54.750, index: 128 },
  { text: " sü", duration: 0.78, begin: 55.000, index: 129 },
  { text: "rer", duration: 0.78, begin: 55.250, index: 130 },
  { text: " ve", duration: 0.78, begin: 55.500, index: 131 },
  { text: " yaş", duration: 0.53, begin: 57.000, index: 132 },
  { text: "lı", duration: 0.53, begin: 57.250, index: 133 },
  { text: " a", duration: 0.53, begin: 57.750, index: 134 },
  { text: "dam", duration: 0.53, begin: 58.000, index: 135 },
  { text: " bu", duration: 0.53, begin: 59.000, index: 136 },
  { text: "na", duration: 0.53, begin: 59.250, index: 137 },
  { text: " bir", duration: 0.53, begin: 59.500, index: 138 },
  { text: " son", duration: 0.53, begin: 59.750, index: 139 },
  { text: " ver", duration: 0.53, begin: 60.250, index: 140 },
  { text: "me", duration: 0.53, begin: 60.500, index: 141 },
  { text: "ye", duration: 0.53, begin: 60.750, index: 142 },
  { text: " ka", duration: 0.53, begin: 61.500, index: 143 },
  { text: "rar", duration: 0.53, begin: 61.750, index: 144 },
  { text: " ve", duration: 0.53, begin: 62.000, index: 145 },
  { text: "rir.", duration: 0.53, begin: 62.250, index: 146 },
  { text: " Er", duration: 0.53, begin: 64.000, index: 147 },
  { text: "te", duration: 0.53, begin: 64.250, index: 148 },
  { text: "si", duration: 0.53, begin: 64.500, index: 149 },
  { text: " gün", duration: 0.53, begin: 64.750, index: 150 },
  { text: " ço", duration: 0.53, begin: 66.000, index: 151 },
  { text: "cuk", duration: 0.53, begin: 66.250, index: 152 },
  { text: "lar", duration: 0.53, begin: 66.500, index: 153 },
  { text: " gü", duration: 0.53, begin: 67.250, index: 154 },
  { text: "rül", duration: 0.53, begin: 67.500, index: 155 },
  { text: "tüy", duration: 0.53, begin: 67.750, index: 156 },
  { text: "le", duration: 0.53, begin: 68.000, index: 157 },
  { text: " e", duration: 0.28, begin: 69.500, index: 158 },
  { text: "vi", duration: 0.28, begin: 69.750, index: 159 },
  { text: "ne", duration: 0.28, begin: 70.000, index: 160 },
  { text: " doğ", duration: 0.28, begin: 70.250, index: 161 },
  { text: "ru", duration: 0.28, begin: 70.500, index: 162 },
  { text: " yak", duration: 0.53, begin: 70.750, index: 163 },
  { text: "la", duration: 0.53, begin: 71.000, index: 164 },
  { text: "şır", duration: 0.53, begin: 71.250, index: 165 },
  { text: "ken", duration: 0.53, begin: 71.500, index: 166 },
  { text: " ka", duration: 0.53, begin: 73.000, index: 167 },
  { text: "pı", duration: 0.53, begin: 73.250, index: 168 },
  { text: "nın", duration: 0.53, begin: 73.500, index: 169 },
  { text: " ö", duration: 0.53, begin: 73.750, index: 170 },
  { text: "nü", duration: 0.53, begin: 74.000, index: 171 },
  { text: "ne", duration: 0.53, begin: 74.250, index: 172 },
  { text: " çı", duration: 0.53, begin: 74.500, index: 173 },
  { text: "kar", duration: 0.53, begin: 74.750, index: 174 },
  { text: " on", duration: 0.53, begin: 76.000, index: 175 },
  { text: "la", duration: 0.53, begin: 76.250, index: 176 },
  { text: "rı", duration: 0.53, begin: 76.500, index: 177 },
  { text: " dur", duration: 0.53, begin: 76.750, index: 178 },
  { text: "du", duration: 0.53, begin: 77.000, index: 179 },
  { text: "rur", duration: 0.53, begin: 77.250, index: 180 },
  { text: " ve:", duration: 0.53, begin: 77.500, index: 181 },
  { text: " Çok", duration: 0.53, begin: 78.750, index: 182 },
  { text: " tat", duration: 0.53, begin: 79.000, index: 183 },
  { text: "lı", duration: 0.53, begin: 79.250, index: 184 },
  { text: " ço", duration: 0.53, begin: 80.000, index: 185 },
  { text: "cuk", duration: 0.53, begin: 80.250, index: 186 },
  { text: "lar", duration: 0.53, begin: 80.500, index: 187 },
  { text: "sı", duration: 0.53, begin: 80.750, index: 188 },
  { text: "nız,", duration: 0.53, begin: 81.000, index: 189 },
  { text: " çok", duration: 0.53, begin: 82.250, index: 190 },
  { text: " ta", duration: 0.53, begin: 82.500, index: 191 },
  { text: " eğ", duration: 0.53, begin: 82.750, index: 192 },
  { text: "le", duration: 0.78, begin: 83.000, index: 193 },
  { text: "ni", duration: 0.78, begin: 83.250, index: 194 },
  { text: "yor", duration: 0.78, begin: 83.500, index: 195 },
  { text: "su", duration: 0.78, begin: 83.750, index: 196 },
  { text: "nuz.", duration: 0.78, begin: 84.000, index: 197 },
  { text: " Bu", duration: 0.53, begin: 85.500, index: 198 },
  { text: " ne", duration: 0.53, begin: 85.750, index: 199 },
  { text: "şe", duration: 0.53, begin: 86.000, index: 200 },
  { text: "ni", duration: 0.53, begin: 86.250, index: 201 },
  { text: "zi", duration: 0.53, begin: 86.500, index: 202 },
  { text: " sür", duration: 0.53, begin: 87.500, index: 203 },
  { text: "dür", duration: 0.53, begin: 87.750, index: 204 },
  { text: "me", duration: 0.53, begin: 88.000, index: 205 },
  { text: "ni", duration: 0.53, begin: 88.250, index: 206 },
  { text: "zi", duration: 0.53, begin: 88.500, index: 207 },
  { text: " is", duration: 0.53, begin: 88.750, index: 208 },
  { text: "ti", duration: 0.53, begin: 89.000, index: 209 },
  { text: "yo", duration: 0.53, begin: 89.250, index: 210 },
  { text: "rum", duration: 0.53, begin: 89.500, index: 211 },
  { text: " siz", duration: 0.53, begin: 90.000, index: 212 },
  { text: "den.", duration: 0.53, begin: 90.250, index: 213 },
  { text: " Ben", duration: 0.53, begin: 91.750, index: 214 },
  { text: "de", duration: 0.53, begin: 92.000, index: 215 },
  { text: " siz", duration: 0.53, begin: 93.250, index: 216 },
  { text: "le", duration: 0.53, begin: 93.500, index: 217 },
  { text: "rin", duration: 0.53, begin: 93.750, index: 218 },
  { text: " ya", duration: 0.53, begin: 94.000, index: 219 },
  { text: "şın", duration: 0.53, begin: 94.250, index: 220 },
  { text: "day", duration: 0.53, begin: 94.500, index: 221 },
  { text: "ken", duration: 0.53, begin: 94.750, index: 222 },
  { text: " ay", duration: 0.53, begin: 96.250, index: 223 },
  { text: "nı", duration: 0.53, begin: 96.500, index: 224 },
  { text: " şe", duration: 0.53, begin: 96.750, index: 225 },
  { text: "kil", duration: 0.53, begin: 97.000, index: 226 },
  { text: "de", duration: 0.53, begin: 97.250, index: 227 },
  { text: " gü", duration: 0.68, begin: 97.500, index: 228 },
  { text: "rül", duration: 0.68, begin: 97.750, index: 229 },
  { text: "tü", duration: 0.68, begin: 98.000, index: 230 },
  { text: "ler", duration: 0.68, begin: 98.250, index: 231 },
  { text: " çı", duration: 0.68, begin: 99.000, index: 232 },
  { text: "kar", duration: 0.68, begin: 99.250, index: 233 },
  { text: "mak", duration: 0.68, begin: 99.500, index: 234 },
  { text: "tan", duration: 0.68, begin: 99.750, index: 235 },
  { text: " hoş", duration: 0.53, begin: 101.000, index: 236 },
  { text: "la", duration: 0.53, begin: 101.250, index: 237 },
  { text: "nır", duration: 0.53, begin: 101.500, index: 238 },
  { text: "dım.", duration: 0.53, begin: 101.750, index: 239 },
  { text: " Ba", duration: 0.53, begin: 103.250, index: 240 },
  { text: "na", duration: 0.53, begin: 103.500, index: 241 },
  { text: " genç", duration: 0.53, begin: 103.750, index: 242 },
  { text: "li", duration: 0.53, begin: 104.000, index: 243 },
  { text: "ği", duration: 0.53, begin: 104.250, index: 244 },
  { text: "mi", duration: 0.53, begin: 104.500, index: 245 },
  { text: " ha", duration: 0.53, begin: 104.750, index: 246 },
  { text: "tır", duration: 0.53, begin: 105.000, index: 247 },
  { text: "la", duration: 0.53, begin: 105.250, index: 248 },
  { text: "tı", duration: 0.53, begin: 105.500, index: 249 },
  { text: "yor", duration: 0.53, begin: 106.000, index: 250 },
  { text: "su", duration: 0.53, begin: 106.250, index: 251 },
  { text: "nuz.", duration: 0.53, begin: 106.500, index: 252 },
  { text: " E", duration: 0.53, begin: 108.000, index: 253 },
  { text: "ğer", duration: 0.53, begin: 108.250, index: 254 },
  { text: " her", duration: 0.53, begin: 109.250, index: 255 },
  { text: "gün", duration: 0.53, begin: 109.500, index: 256 },
  { text: " bu", duration: 0.53, begin: 110.250, index: 257 },
  { text: "ra", duration: 0.53, begin: 110.500, index: 258 },
  { text: "dan", duration: 0.53, begin: 110.750, index: 259 },
  { text: " ge", duration: 0.53, begin: 111.000, index: 260 },
  { text: "çer", duration: 0.53, begin: 111.250, index: 261 },
  { text: " ve", duration: 0.53, begin: 112.000, index: 262 },
  { text: " gü", duration: 0.53, begin: 113.000, index: 263 },
  { text: "rül", duration: 0.53, begin: 113.250, index: 264 },
  { text: "tü", duration: 0.53, begin: 113.500, index: 265 },
  { text: " ya", duration: 0.53, begin: 113.750, index: 266 },
  { text: "par", duration: 0.53, begin: 114.000, index: 267 },
  { text: "sa", duration: 0.53, begin: 114.250, index: 268 },
  { text: "nız", duration: 0.53, begin: 114.500, index: 269 },
  { text: " si", duration: 0.53, begin: 116.000, index: 270 },
  { text: "ze", duration: 0.53, begin: 116.250, index: 271 },
  { text: " her", duration: 0.53, begin: 116.750, index: 272 },
  { text: "gün", duration: 0.53, begin: 117.000, index: 273 },
  { text: " on", duration: 0.53, begin: 118.250, index: 274 },
  { text: " li", duration: 0.53, begin: 118.500, index: 275 },
  { text: "ra", duration: 0.53, begin: 118.750, index: 276 },
  { text: " ve", duration: 0.53, begin: 119.000, index: 277 },
  { text: "re", duration: 0.53, begin: 119.250, index: 278 },
  { text: "ce", duration: 0.53, begin: 119.500, index: 279 },
  { text: "ğim", duration: 0.53, begin: 119.750, index: 280 },
  { text: " der.", duration: 0.53, begin: 120.500, index: 281 },
  { text: " Bu", duration: 0.53, begin: 122.000, index: 282 },
  { text: " tek", duration: 0.53, begin: 122.250, index: 283 },
  { text: "lif", duration: 0.53, begin: 122.500, index: 284 },
  { text: " ço", duration: 0.53, begin: 123.500, index: 285 },
  { text: "cuk", duration: 0.53, begin: 123.750, index: 286 },
  { text: "la", duration: 0.53, begin: 124.000, index: 287 },
  { text: "rın", duration: 0.53, begin: 124.250, index: 288 },
  { text: " çok", duration: 0.53, begin: 125.000, index: 289 },
  { text: " ho", duration: 0.53, begin: 125.250, index: 290 },
  { text: "şu", duration: 0.53, begin: 125.500, index: 291 },
  { text: "na", duration: 0.53, begin: 125.750, index: 292 },
  { text: " gi", duration: 0.53, begin: 126.000, index: 293 },
  { text: "der", duration: 0.53, begin: 126.250, index: 294 },
  { text: " ve", duration: 0.53, begin: 127.250, index: 295 },
  { text: " gü", duration: 0.53, begin: 128.000, index: 296 },
  { text: "rül", duration: 0.53, begin: 128.250, index: 297 },
  { text: "tü", duration: 0.53, begin: 128.500, index: 298 },
  { text: "yü", duration: 0.53, begin: 128.750, index: 299 },
  { text: " sür", duration: 0.53, begin: 129.000, index: 300 },
  { text: "dü", duration: 0.53, begin: 129.250, index: 301 },
  { text: "rür", duration: 0.53, begin: 129.500, index: 302 },
  { text: "ler.", duration: 0.53, begin: 130.000, index: 303 },
  { text: " Bir", duration: 0.53, begin: 131.750, index: 304 },
  { text: " kaç", duration: 0.53, begin: 132.000, index: 305 },
  { text: " gün", duration: 0.53, begin: 132.250, index: 306 },
  { text: " son", duration: 0.53, begin: 133.000, index: 307 },
  { text: "ra", duration: 0.53, begin: 133.250, index: 308 },
  { text: " yaş", duration: 0.53, begin: 134.500, index: 309 },
  { text: "lı", duration: 0.53, begin: 134.750, index: 310 },
  { text: " a", duration: 0.53, begin: 135.000, index: 311 },
  { text: "dam", duration: 0.53, begin: 135.250, index: 312 },
  { text: " ço", duration: 0.53, begin: 136.500, index: 313 },
  { text: "cuk", duration: 0.53, begin: 136.750, index: 314 },
  { text: "la", duration: 0.53, begin: 137.000, index: 315 },
  { text: "rın", duration: 0.53, begin: 137.250, index: 316 },
  { text: " ö", duration: 0.53, begin: 137.500, index: 317 },
  { text: "nü", duration: 0.53, begin: 137.750, index: 318 },
  { text: "ne", duration: 0.53, begin: 138.000, index: 319 },
  { text: " çı", duration: 0.53, begin: 138.250, index: 320 },
  { text: "kar", duration: 0.53, begin: 138.500, index: 321 },
  { text: " ve", duration: 0.53, begin: 139.250, index: 322 },
  { text: " şöy", duration: 0.53, begin: 140.250, index: 323 },
  { text: "le", duration: 0.53, begin: 140.500, index: 324 },
  { text: " der:", duration: 0.53, begin: 140.750, index: 325 },
  { text: " Ço", duration: 0.53, begin: 142.250, index: 326 },
  { text: "cuk", duration: 0.53, begin: 142.500, index: 327 },
  { text: "lar", duration: 0.53, begin: 142.750, index: 328 },
  { text: " en", duration: 0.53, begin: 144.000, index: 329 },
  { text: "flas", duration: 0.53, begin: 144.250, index: 330 },
  { text: "yon", duration: 0.53, begin: 144.500, index: 331 },
  { text: " be", duration: 0.53, begin: 145.250, index: 332 },
  { text: "ni", duration: 0.53, begin: 145.500, index: 333 },
  { text: "de", duration: 0.53, begin: 145.750, index: 334 },
  { text: " et", duration: 0.53, begin: 146.000, index: 335 },
  { text: "ki", duration: 0.53, begin: 146.250, index: 336 },
  { text: "le", duration: 0.53, begin: 146.500, index: 337 },
  { text: "me", duration: 0.53, begin: 146.750, index: 338 },
  { text: "ye", duration: 0.53, begin: 147.000, index: 339 },
  { text: " baş", duration: 0.53, begin: 147.250, index: 340 },
  { text: "la", duration: 0.53, begin: 147.500, index: 341 },
  { text: "dı.", duration: 0.53, begin: 147.750, index: 342 },
  { text: " Bun", duration: 0.53, begin: 149.250, index: 343 },
  { text: "dan", duration: 0.53, begin: 149.500, index: 344 },
  { text: " böy", duration: 0.53, begin: 150.000, index: 345 },
  { text: "le", duration: 0.53, begin: 150.250, index: 346 },
  { text: " si", duration: 0.53, begin: 151.250, index: 347 },
  { text: "ze", duration: 0.53, begin: 151.500, index: 348 },
  { text: " gün", duration: 0.53, begin: 152.000, index: 349 },
  { text: "de", duration: 0.53, begin: 152.250, index: 350 },
  { text: " beş", duration: 0.53, begin: 153.250, index: 351 },
  { text: "li", duration: 0.53, begin: 153.500, index: 352 },
  { text: "ra", duration: 0.53, begin: 153.750, index: 353 },
  { text: " ve", duration: 0.53, begin: 154.250, index: 354 },
  { text: "re", duration: 0.53, begin: 154.500, index: 355 },
  { text: "bi", duration: 0.53, begin: 154.750, index: 356 },
  { text: "li", duration: 0.53, begin: 155.000, index: 357 },
  { text: "rim.", duration: 0.53, begin: 155.250, index: 358 },
  { text: " Ço", duration: 0.53, begin: 156.750, index: 359 },
  { text: "cuk", duration: 0.53, begin: 157.000, index: 360 },
  { text: "lar", duration: 0.53, begin: 157.250, index: 361 },
  { text: " pek", duration: 0.53, begin: 157.750, index: 362 },
  { text: " hoş", duration: 0.53, begin: 158.250, index: 363 },
  { text: "lan", duration: 0.53, begin: 158.500, index: 364 },
  { text: "maz", duration: 0.53, begin: 158.750, index: 365 },
  { text: "lar", duration: 0.53, begin: 159.000, index: 366 },
  { text: " a", duration: 0.53, begin: 160.500, index: 367 },
  { text: "ma", duration: 0.53, begin: 160.750, index: 368 },
  { text: " yi", duration: 0.53, begin: 161.000, index: 369 },
  { text: "ne", duration: 0.53, begin: 161.250, index: 370 },
  { text: " de", duration: 0.53, begin: 161.500, index: 371 },
  { text: "vam", duration: 0.53, begin: 161.750, index: 372 },
  { text: " e", duration: 0.53, begin: 162.000, index: 373 },
  { text: "der", duration: 0.53, begin: 162.250, index: 374 },
  { text: "ler", duration: 0.53, begin: 162.500, index: 375 },
  { text: " gü", duration: 0.53, begin: 163.250, index: 376 },
  { text: "rül", duration: 0.53, begin: 163.500, index: 377 },
  { text: "tü", duration: 0.53, begin: 163.750, index: 378 },
  { text: "ye.", duration: 0.53, begin: 164.000, index: 379 },
  { text: " A", duration: 0.53, begin: 165.250, index: 380 },
  { text: "ra", duration: 0.53, begin: 165.500, index: 381 },
  { text: "dan", duration: 0.53, begin: 165.750, index: 382 },
  { text: " bir", duration: 0.53, begin: 167.000, index: 383 },
  { text: " kaç", duration: 0.53, begin: 167.250, index: 384 },
  { text: " gün", duration: 0.53, begin: 167.500, index: 385 },
  { text: " da", duration: 0.53, begin: 168.000, index: 386 },
  { text: "ha", duration: 0.53, begin: 168.250, index: 387 },
  { text: " ge", duration: 0.53, begin: 168.500, index: 388 },
  { text: "çer", duration: 0.53, begin: 169.000, index: 389 },
  { text: " ve", duration: 0.78, begin: 169.250, index: 390 },
  { text: " yaş", duration: 0.53, begin: 170.500, index: 391 },
  { text: "lı", duration: 0.53, begin: 170.750, index: 392 },
  { text: " a", duration: 0.53, begin: 171.000, index: 393 },
  { text: "dam", duration: 0.53, begin: 171.250, index: 394 },
  { text: " yi", duration: 0.53, begin: 172.250, index: 395 },
  { text: "ne", duration: 0.53, begin: 172.500, index: 396 },
  { text: " kar", duration: 0.53, begin: 172.750, index: 397 },
  { text: "şı", duration: 0.53, begin: 173.000, index: 398 },
  { text: "lar", duration: 0.53, begin: 173.250, index: 399 },
  { text: " on", duration: 0.53, begin: 173.500, index: 400 },
  { text: "la", duration: 0.53, begin: 173.750, index: 401 },
  { text: "rı:", duration: 0.53, begin: 174.000, index: 402 },
  { text: " Ba", duration: 0.53, begin: 175.500, index: 403 },
  { text: "kın", duration: 0.53, begin: 175.750, index: 404 },
  { text: " der.", duration: 0.53, begin: 176.750, index: 405 },
  { text: " He", duration: 0.78, begin: 177.500, index: 406 },
  { text: "nüz", duration: 0.78, begin: 177.750, index: 407 },
  { text: " ma", duration: 0.78, begin: 178.000, index: 408 },
  { text: "aşı", duration: 0.78, begin: 178.250, index: 409 },
  { text: "mı", duration: 0.78, begin: 178.500, index: 410 },
  { text: " a", duration: 0.78, begin: 178.750, index: 411 },
  { text: "la", duration: 0.78, begin: 179.000, index: 412 },
  { text: "ma", duration: 0.78, begin: 179.250, index: 413 },
  { text: "dım.", duration: 0.78, begin: 179.500, index: 414 },
  { text: " Bu", duration: 0.53, begin: 181.000, index: 415 },
  { text: " yüz", duration: 0.53, begin: 181.250, index: 416 },
  { text: "den", duration: 0.53, begin: 181.500, index: 417 },
  { text: " si", duration: 0.53, begin: 182.500, index: 418 },
  { text: "ze", duration: 0.53, begin: 182.750, index: 419 },
  { text: " gün", duration: 0.53, begin: 183.500, index: 420 },
  { text: "de", duration: 0.53, begin: 183.750, index: 421 },
  { text: " an", duration: 0.53, begin: 184.000, index: 422 },
  { text: "cak", duration: 0.53, begin: 184.250, index: 423 },
  { text: " bir", duration: 0.53, begin: 185.500, index: 424 },
  { text: " li", duration: 0.53, begin: 185.750, index: 425 },
  { text: "ra", duration: 0.53, begin: 186.000, index: 426 },
  { text: " ve", duration: 0.53, begin: 186.250, index: 427 },
  { text: "re", duration: 0.53, begin: 186.500, index: 428 },
  { text: "bi", duration: 0.53, begin: 186.750, index: 429 },
  { text: "li", duration: 0.53, begin: 187.000, index: 430 },
  { text: "rim", duration: 0.53, begin: 187.250, index: 431 },
  { text: " ta", duration: 0.53, begin: 188.000, index: 432 },
  { text: "mam", duration: 0.53, begin: 188.250, index: 433 },
  { text: " mı?", duration: 0.53, begin: 188.500, index: 434 },
  { text: " Ço", duration: 0.53, begin: 190.000, index: 435 },
  { text: "cuk", duration: 0.53, begin: 190.250, index: 436 },
  { text: "lar:", duration: 0.53, begin: 190.500, index: 437 },
  { text: " İm", duration: 0.53, begin: 192.000, index: 438 },
  { text: "kan", duration: 0.53, begin: 192.250, index: 439 },
  { text: "sız", duration: 0.53, begin: 192.500, index: 440 },
  { text: " am", duration: 0.53, begin: 192.750, index: 441 },
  { text: "ca", duration: 0.53, begin: 193.000, index: 442 },
  { text: " der", duration: 0.48, begin: 194.250, index: 443 },
  { text: "ler.", duration: 0.48, begin: 194.500, index: 444 },
  { text: " Gün", duration: 0.53, begin: 195.500, index: 445 },
  { text: "de", duration: 0.53, begin: 195.750, index: 446 },
  { text: " bir", duration: 0.53, begin: 196.000, index: 447 },
  { text: " li", duration: 0.53, begin: 196.250, index: 448 },
  { text: "ra", duration: 0.53, begin: 196.500, index: 449 },
  { text: " i", duration: 0.53, begin: 196.750, index: 450 },
  { text: "çin", duration: 0.53, begin: 197.000, index: 451 },
  { text: " bu", duration: 0.53, begin: 198.000, index: 452 },
  { text: " i", duration: 0.53, begin: 198.250, index: 453 },
  { text: "şi", duration: 0.53, begin: 198.500, index: 454 },
  { text: " ya", duration: 0.53, begin: 198.750, index: 455 },
  { text: "pa", duration: 0.53, begin: 199.000, index: 456 },
  { text: "ca", duration: 0.53, begin: 199.250, index: 457 },
  { text: "ğı", duration: 0.53, begin: 199.500, index: 458 },
  { text: "mı", duration: 0.53, begin: 199.750, index: 459 },
  { text: "zı", duration: 0.53, begin: 200.000, index: 460 },
  { text: " sa", duration: 0.53, begin: 200.250, index: 461 },
  { text: "nı", duration: 0.53, begin: 200.500, index: 462 },
  { text: "yor", duration: 0.53, begin: 200.750, index: 463 },
  { text: "sa", duration: 0.53, begin: 201.000, index: 464 },
  { text: "nız", duration: 0.53, begin: 201.250, index: 465 },
  { text: " ya", duration: 0.53, begin: 202.250, index: 466 },
  { text: "nı", duration: 0.53, begin: 202.500, index: 467 },
  { text: "lı", duration: 0.53, begin: 202.750, index: 468 },
  { text: "yor", duration: 0.53, begin: 203.000, index: 469 },
  { text: "su", duration: 0.53, begin: 203.250, index: 470 },
  { text: "nuz.", duration: 0.53, begin: 203.500, index: 471 },
  { text: " Biz", duration: 0.53, begin: 204.750, index: 472 },
  { text: " i", duration: 0.53, begin: 205.000, index: 473 },
  { text: "şi", duration: 0.53, begin: 205.250, index: 474 },
  { text: " bı", duration: 0.53, begin: 205.500, index: 475 },
  { text: "ra", duration: 0.53, begin: 205.750, index: 476 },
  { text: "kı", duration: 0.53, begin: 206.000, index: 477 },
  { text: "yo", duration: 0.53, begin: 206.250, index: 478 },
  { text: "ruz.", duration: 0.53, begin: 206.500, index: 479 },
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
  <Link href="/dashboard/stories/bir-balikci-hikayesi" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/iyi-ornek-olmak" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/1-3.mp3"
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