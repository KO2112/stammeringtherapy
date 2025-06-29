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
  { text: "", duration: 0.154, begin: 0.775, index: 0 },
  
  // Title
  { text: "Öz", duration: 0.53, begin: 0.729, index: 1, isTitle: true, isCenter: true },
  { text: "gür", duration: 0.38, begin: 1.218, index: 2, isTitle: true, isCenter: true },
  { text: " Kuş", duration: 0.53, begin: 1.378, index: 3, isTitle: true, isCenter: true },
  { text: "lar", duration: 0.98, begin: 1.578, index: 4, isTitle: true, isCenter: true },
  
  // Story content
  { text: " Kü", duration: 0.53, begin: 2.750, index: 5 },
  { text: "çük", duration: 0.53, begin: 3.000, index: 6 },
  { text: " kı", duration: 0.53, begin: 3.250, index: 7 },
  { text: "zın", duration: 0.53, begin: 3.500, index: 8 },
  { text: " ba", duration: 0.53, begin: 3.750, index: 9 },
  { text: "ba", duration: 0.53, begin: 4.000, index: 10 },
  { text: "sı", duration: 0.53, begin: 4.250, index: 11 },
  { text: " öz", duration: 0.53, begin: 5.500, index: 12 },
  { text: "gür", duration: 0.53, begin: 5.750, index: 13 },
  { text: "lük", duration: 0.53, begin: 6.000, index: 14 },
  { text: "le", duration: 0.53, begin: 6.250, index: 15 },
  { text: "rin", duration: 0.53, begin: 6.500, index: 16 },
  { text: " kı", duration: 0.53, begin: 7.500, index: 17 },
  { text: "sıt", duration: 0.53, begin: 7.750, index: 18 },
  { text: "lı", duration: 0.53, begin: 8.000, index: 19 },
  { text: " ol", duration: 0.53, begin: 8.250, index: 20 },
  { text: "du", duration: 0.53, begin: 8.500, index: 21 },
  { text: "ğu", duration: 0.53, begin: 8.750, index: 22 },
  { text: " bir", duration: 0.83, begin: 9.000, index: 23 },
  { text: " ül", duration: 0.83, begin: 9.250, index: 24 },
  { text: "ke", duration: 0.83, begin: 9.350, index: 25 },
  { text: "de,", duration: 0.83, begin: 9.500, index: 26 },
  { text: " en", duration: 0.53, begin: 11.250, index: 27 },
  { text: " a", duration: 0.53, begin: 11.500, index: 28 },
  { text: "ğır", duration: 0.53, begin: 11.750, index: 29 },
  { text: " si", duration: 0.53, begin: 12.000, index: 30 },
  { text: "ya", duration: 0.53, begin: 12.250, index: 31 },
  { text: "si", duration: 0.53, begin: 12.750, index: 32 },
  { text: " ce", duration: 0.53, begin: 13.000, index: 33 },
  { text: "za", duration: 0.53, begin: 13.250, index: 34 },
  { text: "la", duration: 0.53, begin: 13.500, index: 35 },
  { text: "rın", duration: 0.53, begin: 13.750, index: 36 },
  { text: " ve", duration: 0.53, begin: 14.750, index: 37 },
  { text: "ril", duration: 0.53, begin: 15.000, index: 38 },
  { text: "di", duration: 0.53, begin: 15.250, index: 39 },
  { text: "ği", duration: 0.53, begin: 15.500, index: 40 },
  { text: " bir", duration: 0.78, begin: 15.750, index: 41 },
  { text: " ha", duration: 0.78, begin: 16.000, index: 42 },
  { text: "pis", duration: 0.78, begin: 16.350, index: 43 },
  { text: "ha", duration: 0.78, begin: 16.550, index: 44 },
  { text: "ne", duration: 0.78, begin: 16.750, index: 45 },
  { text: "de", duration: 0.78, begin: 16.950, index: 46 },
  { text: " mah", duration: 0.53, begin: 18.250, index: 47 },
  { text: "kum", duration: 0.53, begin: 18.500, index: 48 },
  { text: "du.", duration: 0.53, begin: 18.750, index: 49 },
  { text: " Her", duration: 0.53, begin: 20.250, index: 50 },
  { text: " haf", duration: 0.53, begin: 20.500, index: 51 },
  { text: "ta", duration: 0.53, begin: 20.750, index: 52 },
  { text: " so", duration: 0.53, begin: 21.000, index: 53 },
  { text: "nu", duration: 0.53, begin: 21.250, index: 54 },
  { text: " an", duration: 0.53, begin: 22.000, index: 55 },
  { text: "ne", duration: 0.53, begin: 22.250, index: 56 },
  { text: "siy", duration: 0.53, begin: 22.500, index: 57 },
  { text: "le", duration: 0.53, begin: 22.750, index: 58 },
  { text: " bir", duration: 0.53, begin: 23.250, index: 59 },
  { text: "lik", duration: 0.53, begin: 23.500, index: 60 },
  { text: "te", duration: 0.53, begin: 23.750, index: 61 },
  { text: " ba", duration: 0.53, begin: 25.000, index: 62 },
  { text: "ba", duration: 0.53, begin: 25.250, index: 63 },
  { text: "sı", duration: 0.53, begin: 25.500, index: 64 },
  { text: "nı", duration: 0.53, begin: 25.750, index: 65 },
  { text: " zi", duration: 0.53, begin: 26.250, index: 66 },
  { text: "ya", duration: 0.53, begin: 26.500, index: 67 },
  { text: "ret", duration: 0.53, begin: 26.750, index: 68 },
  { text: " i", duration: 0.53, begin: 27.000, index: 69 },
  { text: "çin", duration: 0.53, begin: 27.250, index: 70 },
  { text: " ha", duration: 0.53, begin: 28.000, index: 71 },
  { text: "pis", duration: 0.53, begin: 28.250, index: 72 },
  { text: "ha", duration: 0.53, begin: 28.500, index: 73 },
  { text: "ne", duration: 0.53, begin: 28.750, index: 74 },
  { text: "ye", duration: 0.53, begin: 29.000, index: 75 },
  { text: " gi", duration: 0.53, begin: 29.250, index: 76 },
  { text: "der", duration: 0.53, begin: 29.500, index: 77 },
  { text: "di.", duration: 0.53, begin: 29.750, index: 78 },
  { text: " Bir", duration: 0.53, begin: 31.250, index: 79 },
  { text: " zi", duration: 0.53, begin: 31.500, index: 80 },
  { text: "ya", duration: 0.53, begin: 31.750, index: 81 },
  { text: "re", duration: 0.53, begin: 32.000, index: 82 },
  { text: "tin", duration: 0.53, begin: 32.250, index: 83 },
  { text: "de", duration: 0.53, begin: 32.500, index: 84 },
  { text: " ba", duration: 0.53, begin: 33.750, index: 85 },
  { text: "ba", duration: 0.53, begin: 34.000, index: 86 },
  { text: "sı", duration: 0.53, begin: 34.250, index: 87 },
  { text: "na", duration: 0.53, begin: 34.500, index: 88 },
  { text: " ver", duration: 0.53, begin: 35.000, index: 89 },
  { text: "mek", duration: 0.53, begin: 35.250, index: 90 },
  { text: " i", duration: 0.53, begin: 35.500, index: 91 },
  { text: "çin", duration: 0.53, begin: 35.750, index: 92 },
  { text: " ö", duration: 0.53, begin: 36.750, index: 93 },
  { text: "ze", duration: 0.53, begin: 37.000, index: 94 },
  { text: "ne", duration: 0.53, begin: 37.250, index: 95 },
  { text: "rek", duration: 0.53, begin: 37.500, index: 96 },
  { text: " bir", duration: 0.53, begin: 38.000, index: 97 },
  { text: " re", duration: 0.53, begin: 38.250, index: 98 },
  { text: "sim", duration: 0.53, begin: 38.500, index: 99 },
  { text: " yap", duration: 0.53, begin: 38.750, index: 100 },
  { text: "tı", duration: 0.53, begin: 39.000, index: 101 },
  { text: " ve", duration: 0.53, begin: 40.250, index: 102 },
  { text: " ya", duration: 0.53, begin: 41.250, index: 103 },
  { text: "nın", duration: 0.53, begin: 41.500, index: 104 },
  { text: "da", duration: 0.53, begin: 41.750, index: 105 },
  { text: " gö", duration: 0.53, begin: 42.100, index: 106 },
  { text: "tür", duration: 0.53, begin: 42.350, index: 107 },
  { text: "dü.", duration: 0.53, begin: 42.500, index: 108 },
  { text: " Fa", duration: 0.53, begin: 44.250, index: 109 },
  { text: "kat", duration: 0.53, begin: 44.500, index: 110 },
  { text: " kont", duration: 0.53, begin: 45.500, index: 111 },
  { text: "rol", duration: 0.53, begin: 46.000, index: 112 },
  { text: " es", duration: 0.53, begin: 46.250, index: 113 },
  { text: "na", duration: 0.53, begin: 46.500, index: 114 },
  { text: "sın", duration: 0.53, begin: 46.750, index: 115 },
  { text: "da", duration: 0.53, begin: 47.000, index: 116 },
  { text: " yap", duration: 0.53, begin: 48.250, index: 117 },
  { text: "tı", duration: 0.53, begin: 48.500, index: 118 },
  { text: "ğı", duration: 0.53, begin: 48.750, index: 119 },
  { text: " re", duration: 0.53, begin: 49.250, index: 120 },
  { text: "sim", duration: 0.53, begin: 49.500, index: 121 },
  { text: " ha", duration: 0.53, begin: 50.250, index: 122 },
  { text: "pis", duration: 0.53, begin: 50.500, index: 123 },
  { text: "ha", duration: 0.53, begin: 50.750, index: 124 },
  { text: "ne", duration: 0.53, begin: 51.000, index: 125 },
  { text: " ku", duration: 0.53, begin: 51.250, index: 126 },
  { text: "ral", duration: 0.53, begin: 51.500, index: 127 },
  { text: "la", duration: 0.53, begin: 51.750, index: 128 },
  { text: "rı", duration: 0.53, begin: 52.000, index: 129 },
  { text: "na", duration: 0.53, begin: 52.250, index: 130 },
  { text: " gö", duration: 0.53, begin: 52.500, index: 131 },
  { text: "re", duration: 0.53, begin: 52.750, index: 132 },
  { text: " uy", duration: 0.53, begin: 53.750, index: 133 },
  { text: "gun", duration: 0.53, begin: 54.000, index: 134 },
  { text: " bu", duration: 0.53, begin: 54.500, index: 135 },
  { text: "lun", duration: 0.53, begin: 54.750, index: 136 },
  { text: "ma", duration: 0.53, begin: 54.950, index: 137 },
  { text: "dı.", duration: 0.53, begin: 55.000, index: 138 },
  { text: " Çün", duration: 0.53, begin: 56.750, index: 139 },
  { text: "kü", duration: 0.53, begin: 57.000, index: 140 },
  { text: " re", duration: 0.53, begin: 58.000, index: 141 },
  { text: "sim", duration: 0.53, begin: 58.250, index: 142 },
  { text: "de", duration: 0.53, begin: 58.500, index: 143 },
  { text: " çiz", duration: 0.53, begin: 58.750, index: 144 },
  { text: "di", duration: 0.53, begin: 59.000, index: 145 },
  { text: "ği", duration: 0.53, begin: 59.250, index: 146 },
  { text: " kuş", duration: 0.53, begin: 60.000, index: 147 },
  { text: "la", duration: 0.53, begin: 60.250, index: 148 },
  { text: "rın", duration: 0.53, begin: 60.500, index: 149 },
  { text: " öz", duration: 0.53, begin: 61.250, index: 150 },
  { text: "gür", duration: 0.53, begin: 61.500, index: 151 },
  { text: "lü", duration: 0.53, begin: 61.750, index: 152 },
  { text: "ğü", duration: 0.53, begin: 62.000, index: 153 },
  { text: " tem", duration: 0.53, begin: 62.500, index: 154 },
  { text: "sil", duration: 0.53, begin: 62.750, index: 155 },
  { text: " et", duration: 0.53, begin: 63.000, index: 156 },
  { text: "ti", duration: 0.53, begin: 63.250, index: 157 },
  { text: "ği", duration: 0.53, begin: 63.500, index: 158 },
  { text: "ni", duration: 0.53, begin: 63.750, index: 159 },
  { text: " dü", duration: 0.53, begin: 65.000, index: 160 },
  { text: "şü", duration: 0.53, begin: 65.250, index: 161 },
  { text: "nü", duration: 0.53, begin: 65.500, index: 162 },
  { text: "yor", duration: 0.53, begin: 65.750, index: 163 },
  { text: "lar", duration: 0.53, begin: 66.000, index: 164 },
  { text: "dı.", duration: 0.53, begin: 66.250, index: 165 },
  { text: " Ha", duration: 0.53, begin: 67.500, index: 166 },
  { text: "pis", duration: 0.53, begin: 67.750, index: 167 },
  { text: "ha", duration: 0.53, begin: 68.000, index: 168 },
  { text: "ne", duration: 0.53, begin: 68.250, index: 169 },
  { text: "de", duration: 0.53, begin: 68.500, index: 170 },
  { text: " öz", duration: 0.53, begin: 69.750, index: 171 },
  { text: "gür", duration: 0.53, begin: 70.000, index: 172 },
  { text: "lük", duration: 0.53, begin: 70.250, index: 173 },
  { text: " gi", duration: 0.53, begin: 70.500, index: 174 },
  { text: "bi", duration: 0.53, begin: 70.750, index: 175 },
  { text: " dü", duration: 0.53, begin: 71.000, index: 176 },
  { text: "şün", duration: 0.53, begin: 71.250, index: 177 },
  { text: "ce", duration: 0.53, begin: 71.500, index: 178 },
  { text: "le", duration: 0.53, begin: 71.750, index: 179 },
  { text: "re", duration: 0.53, begin: 72.000, index: 180 },
  { text: " yer", duration: 0.53, begin: 73.250, index: 181 },
  { text: " yok", duration: 0.53, begin: 73.500, index: 182 },
  { text: "tu.", duration: 0.53, begin: 73.750, index: 183 },
  { text: " Bu", duration: 0.53, begin: 75.000, index: 184 },
  { text: "nun", duration: 0.53, begin: 75.250, index: 185 },
  { text: " ü", duration: 0.53, begin: 75.500, index: 186 },
  { text: "ze", duration: 0.53, begin: 75.750, index: 187 },
  { text: "ri", duration: 0.53, begin: 76.000, index: 188 },
  { text: "ne", duration: 0.53, begin: 76.250, index: 189 },
  { text: " kü", duration: 0.53, begin: 77.250, index: 190 },
  { text: "çük", duration: 0.53, begin: 77.500, index: 191 },
  { text: " kı", duration: 0.53, begin: 77.750, index: 192 },
  { text: "zın", duration: 0.53, begin: 78.000, index: 193 },
  { text: " res", duration: 0.53, begin: 78.250, index: 194 },
  { text: "mi", duration: 0.53, begin: 78.500, index: 195 },
  { text: "ni", duration: 0.53, begin: 78.750, index: 196 },
  { text: " o", duration: 0.53, begin: 80.000, index: 197 },
  { text: "ra", duration: 0.53, begin: 80.250, index: 198 },
  { text: "cık", duration: 0.53, begin: 80.500, index: 199 },
  { text: "ta", duration: 0.53, begin: 80.750, index: 200 },
  { text: " yırt", duration: 0.53, begin: 81.250, index: 201 },
  { text: "mış", duration: 0.53, begin: 81.500, index: 202 },
  { text: "lar", duration: 0.53, begin: 81.750, index: 203 },
  { text: "dı.", duration: 0.53, begin: 82.000, index: 204 },
  { text: " Çok", duration: 0.53, begin: 84.000, index: 205 },
  { text: " üz", duration: 0.53, begin: 84.250, index: 206 },
  { text: "gün", duration: 0.53, begin: 84.500, index: 207 },
  { text: " bir", duration: 0.53, begin: 84.750, index: 208 },
  { text: " şe", duration: 0.53, begin: 85.000, index: 209 },
  { text: "kil", duration: 0.53, begin: 85.250, index: 210 },
  { text: "de", duration: 0.53, begin: 85.500, index: 211 },
  { text: " gö", duration: 0.53, begin: 87.000, index: 212 },
  { text: "rüş", duration: 0.53, begin: 87.250, index: 213 },
  { text: "me", duration: 0.53, begin: 87.500, index: 214 },
  { text: "de", duration: 0.53, begin: 87.750, index: 215 },
  { text: " ba", duration: 0.53, begin: 88.500, index: 216 },
  { text: "ba", duration: 0.53, begin: 88.750, index: 217 },
  { text: "sı", duration: 0.53, begin: 89.000, index: 218 },
  { text: "na", duration: 0.53, begin: 89.250, index: 219 },
  { text: " re", duration: 0.53, begin: 89.750, index: 220 },
  { text: "sim", duration: 0.53, begin: 90.000, index: 221 },
  { text: " yap", duration: 0.53, begin: 90.250, index: 222 },
  { text: "tı", duration: 0.53, begin: 90.500, index: 223 },
  { text: "ğı", duration: 0.53, begin: 90.750, index: 224 },
  { text: "nı", duration: 0.53, begin: 91.000, index: 225 },
  { text: " a", duration: 0.53, begin: 92.000, index: 226 },
  { text: "ma", duration: 0.53, begin: 92.250, index: 227 },
  { text: " i", duration: 0.53, begin: 93.000, index: 228 },
  { text: "zin", duration: 0.53, begin: 93.250, index: 229 },
  { text: " ver", duration: 0.53, begin: 93.500, index: 230 },
  { text: "me", duration: 0.53, begin: 93.750, index: 231 },
  { text: "dik", duration: 0.53, begin: 94.000, index: 232 },
  { text: "le", duration: 0.53, begin: 94.250, index: 233 },
  { text: "ri", duration: 0.53, begin: 94.500, index: 234 },
  { text: "ni", duration: 0.53, begin: 94.750, index: 235 },
  { text: " söy", duration: 0.53, begin: 95.000, index: 236 },
  { text: "le", duration: 0.53, begin: 95.250, index: 237 },
  { text: "di.", duration: 0.53, begin: 95.500, index: 238 },
  { text: " Ba", duration: 0.53, begin: 97.000, index: 239 },
  { text: "ba", duration: 0.53, begin: 97.250, index: 240 },
  { text: "sı", duration: 0.53, begin: 97.500, index: 241 },
  { text: "da:", duration: 0.53, begin: 97.750, index: 242 },
  { text: " Ü", duration: 0.53, begin: 99.000, index: 243 },
  { text: "zül", duration: 0.53, begin: 99.250, index: 244 },
  { text: "me", duration: 0.53, begin: 99.500, index: 245 },
  { text: " kı", duration: 0.53, begin: 99.750, index: 246 },
  { text: "zım,", duration: 0.53, begin: 100.000, index: 247 },
  { text: " baş", duration: 0.53, begin: 101.000, index: 248 },
  { text: "ka", duration: 0.53, begin: 101.250, index: 249 },
  { text: " bir", duration: 0.53, begin: 101.500, index: 250 },
  { text: " re", duration: 0.53, begin: 102.000, index: 251 },
  { text: "sim", duration: 0.53, begin: 102.250, index: 252 },
  { text: " ya", duration: 0.53, begin: 102.500, index: 253 },
  { text: "par", duration: 0.53, begin: 102.750, index: 254 },
  { text: "sın.", duration: 0.53, begin: 103.000, index: 255 },
  { text: " Bu", duration: 0.53, begin: 104.500, index: 256 },
  { text: "se", duration: 0.53, begin: 104.750, index: 257 },
  { text: "fer", duration: 0.53, begin: 105.000, index: 258 },
  { text: " res", duration: 0.53, begin: 106.250, index: 259 },
  { text: "min", duration: 0.53, begin: 106.500, index: 260 },
  { text: "de", duration: 0.53, begin: 106.750, index: 261 },
  { text: " çiz", duration: 0.53, begin: 107.000, index: 262 },
  { text: "dik", duration: 0.53, begin: 107.250, index: 263 },
  { text: "le", duration: 0.53, begin: 107.500, index: 264 },
  { text: "ri", duration: 0.53, begin: 107.750, index: 265 },
  { text: "ne", duration: 0.53, begin: 108.000, index: 266 },
  { text: " dik", duration: 0.53, begin: 109.250, index: 267 },
  { text: "kat", duration: 0.53, begin: 109.500, index: 268 },
  { text: " e", duration: 0.53, begin: 109.750, index: 269 },
  { text: "der", duration: 0.53, begin: 110.000, index: 270 },
  { text: "sin,", duration: 0.53, begin: 110.250, index: 271 },
  { text: " o", duration: 0.53, begin: 111.000, index: 272 },
  { text: "lur", duration: 0.53, begin: 111.250, index: 273 },
  { text: " mu?", duration: 0.53, begin: 111.500, index: 274 },
  { text: " de", duration: 0.53, begin: 112.500, index: 275 },
  { text: "di.", duration: 0.53, begin: 112.750, index: 276 },
  { text: " Kü", duration: 0.53, begin: 114.000, index: 277 },
  { text: "çük", duration: 0.53, begin: 114.250, index: 278 },
  { text: " kız", duration: 0.53, begin: 115.000, index: 279 },
  { text: " bir", duration: 0.53, begin: 115.750, index: 280 },
  { text: " son", duration: 0.53, begin: 116.000, index: 281 },
  { text: "ra", duration: 0.53, begin: 116.250, index: 282 },
  { text: "ki", duration: 0.53, begin: 116.500, index: 283 },
  { text: " zi", duration: 0.53, begin: 117.000, index: 284 },
  { text: "ya", duration: 0.53, begin: 117.250, index: 285 },
  { text: "re", duration: 0.53, begin: 117.500, index: 286 },
  { text: "tin", duration: 0.53, begin: 117.750, index: 287 },
  { text: "de", duration: 0.53, begin: 118.000, index: 288 },
  { text: " ba", duration: 0.53, begin: 119.000, index: 289 },
  { text: "ba", duration: 0.53, begin: 119.250, index: 290 },
  { text: "sı", duration: 0.53, begin: 119.500, index: 291 },
  { text: "na", duration: 0.53, begin: 119.750, index: 292 },
  { text: " ye", duration: 0.53, begin: 120.000, index: 293 },
  { text: "ni", duration: 0.53, begin: 120.250, index: 294 },
  { text: " bir", duration: 0.53, begin: 120.500, index: 295 },
  { text: " re", duration: 0.53, begin: 120.750, index: 296 },
  { text: "sim", duration: 0.53, begin: 121.000, index: 297 },
  { text: " ya", duration: 0.53, begin: 121.250, index: 298 },
  { text: "pıp", duration: 0.53, begin: 121.500, index: 299 },
  { text: " gö", duration: 0.53, begin: 122.250, index: 300 },
  { text: "tür", duration: 0.53, begin: 122.500, index: 301 },
  { text: "dü.", duration: 0.53, begin: 122.750, index: 302 },
  { text: " Bu", duration: 0.53, begin: 124.000, index: 303 },
  { text: " se", duration: 0.53, begin: 124.250, index: 304 },
  { text: "fer", duration: 0.53, begin: 124.500, index: 305 },
  { text: " re", duration: 0.53, begin: 125.500, index: 306 },
  { text: "sim", duration: 0.53, begin: 125.750, index: 307 },
  { text: "de", duration: 0.53, begin: 126.000, index: 308 },
  { text: " kuş", duration: 0.53, begin: 126.250, index: 309 },
  { text: "lar", duration: 0.53, begin: 126.500, index: 310 },
  { text: " yok", duration: 0.53, begin: 126.750, index: 311 },
  { text: "tu.", duration: 0.53, begin: 127.000, index: 312 },
  { text: " Bir", duration: 0.53, begin: 128.500, index: 313 },
  { text: " a", duration: 0.53, begin: 128.750, index: 314 },
  { text: "ğaç", duration: 0.53, begin: 129.000, index: 315 },
  { text: " ve", duration: 0.53, begin: 130.000, index: 316 },
  { text: " ü", duration: 0.53, begin: 130.500, index: 317 },
  { text: "ze", duration: 0.53, begin: 130.750, index: 318 },
  { text: "ri", duration: 0.53, begin: 131.000, index: 319 },
  { text: "ne", duration: 0.53, begin: 131.250, index: 320 },
  { text: " si", duration: 0.53, begin: 132.250, index: 321 },
  { text: "yah", duration: 0.53, begin: 132.500, index: 322 },
  { text: " mi", duration: 0.53, begin: 132.750, index: 323 },
  { text: "nik", duration: 0.53, begin: 133.000, index: 324 },
  { text: " be", duration: 0.53, begin: 133.250, index: 325 },
  { text: "nek", duration: 0.53, begin: 133.500, index: 326 },
  { text: "ler", duration: 0.53, begin: 133.750, index: 327 },
  { text: " çiz", duration: 0.53, begin: 134.500, index: 328 },
  { text: "miş", duration: 0.53, begin: 134.750, index: 329 },
  { text: "ti.", duration: 0.53, begin: 135.000, index: 330 },
  { text: " Bu", duration: 0.53, begin: 136.500, index: 331 },
  { text: " se", duration: 0.53, begin: 136.750, index: 332 },
  { text: "fer", duration: 0.53, begin: 137.000, index: 333 },
  { text: " i", duration: 0.53, begin: 137.250, index: 334 },
  { text: "zin", duration: 0.53, begin: 137.500, index: 335 },
  { text: " ver", duration: 0.53, begin: 138.000, index: 336 },
  { text: "miş", duration: 0.53, begin: 138.250, index: 337 },
  { text: "ler", duration: 0.53, begin: 138.500, index: 338 },
  { text: "di.", duration: 0.53, begin: 138.750, index: 339 },
  { text: " Ba", duration: 0.53, begin: 140.250, index: 340 },
  { text: "ba", duration: 0.53, begin: 140.500, index: 341 },
  { text: "sı", duration: 0.53, begin: 140.750, index: 342 },
  { text: " res", duration: 0.53, begin: 142.000, index: 343 },
  { text: "me", duration: 0.53, begin: 142.250, index: 344 },
  { text: " ke", duration: 0.53, begin: 142.500, index: 345 },
  { text: "yif", duration: 0.53, begin: 142.750, index: 346 },
  { text: "le", duration: 0.53, begin: 143.000, index: 347 },
  { text: " bak", duration: 0.53, begin: 143.250, index: 348 },
  { text: "tı", duration: 0.53, begin: 143.500, index: 349 },
  { text: " ve", duration: 0.53, begin: 143.750, index: 350 },
  { text: " sor", duration: 0.53, begin: 145.000, index: 351 },
  { text: "du:", duration: 0.53, begin: 145.250, index: 352 },
  { text: " Hmmm!", duration: 0.78, begin: 146.750, index: 353 },
  { text: " Ne", duration: 0.78, begin: 147.500, index: 354 },
  { text: " gü", duration: 0.78, begin: 147.750, index: 355 },
  { text: "zel", duration: 0.78, begin: 148.000, index: 356 },
  { text: " bir", duration: 0.78, begin: 148.250, index: 357 },
  { text: " a", duration: 0.78, begin: 148.500, index: 358 },
  { text: "ğaç", duration: 0.78, begin: 148.750, index: 359 },
  { text: " çiz", duration: 0.78, begin: 149.500, index: 360 },
  { text: "miş", duration: 0.78, begin: 149.750, index: 361 },
  { text: "sin!", duration: 0.78, begin: 150.000, index: 362 },
  { text: " A", duration: 0.53, begin: 151.500, index: 363 },
  { text: "ğa", duration: 0.53, begin: 151.750, index: 364 },
  { text: "cın", duration: 0.53, begin: 152.000, index: 365 },
  { text: " ü", duration: 0.53, begin: 152.250, index: 366 },
  { text: "ze", duration: 0.53, begin: 152.500, index: 367 },
  { text: "rin", duration: 0.53, begin: 152.750, index: 368 },
  { text: "de", duration: 0.53, begin: 153.000, index: 369 },
  { text: "ki", duration: 0.53, begin: 153.250, index: 370 },
  { text: " be", duration: 0.53, begin: 153.500, index: 371 },
  { text: "nek", duration: 0.53, begin: 153.750, index: 372 },
  { text: "ler", duration: 0.53, begin: 154.000, index: 373 },
  { text: " ne?", duration: 0.53, begin: 154.250, index: 374 },
  { text: " El", duration: 0.53, begin: 155.750, index: 375 },
  { text: "ma", duration: 0.53, begin: 156.000, index: 376 },
  { text: "mı", duration: 0.53, begin: 156.250, index: 377 },
  { text: " bun", duration: 0.53, begin: 156.500, index: 378 },
  { text: "lar?", duration: 0.53, begin: 156.750, index: 379 },
  { text: " Kü", duration: 0.53, begin: 158.000, index: 380 },
  { text: "çük", duration: 0.53, begin: 158.250, index: 381 },
  { text: " kız", duration: 0.53, begin: 158.500, index: 382 },
  { text: " ba", duration: 0.53, begin: 159.750, index: 383 },
  { text: "ba", duration: 0.53, begin: 160.000, index: 384 },
  { text: "sı", duration: 0.53, begin: 160.250, index: 385 },
  { text: "na", duration: 0.53, begin: 160.500, index: 386 },
  { text: " e", duration: 0.53, begin: 160.750, index: 387 },
  { text: "ği", duration: 0.53, begin: 161.000, index: 388 },
  { text: "le", duration: 0.53, begin: 161.250, index: 389 },
  { text: "rek,", duration: 0.53, begin: 161.500, index: 390 },
  { text: " ses", duration: 0.53, begin: 162.500, index: 391 },
  { text: "siz", duration: 0.53, begin: 162.750, index: 392 },
  { text: "ce:", duration: 0.53, begin: 163.000, index: 393 },
  { text: " Hşşşşt", duration: 0.53, begin: 164.250, index: 394 },
  { text: " O", duration: 0.53, begin: 165.250, index: 395 },
  { text: " be", duration: 0.53, begin: 165.500, index: 396 },
  { text: "nek", duration: 0.53, begin: 165.750, index: 397 },
  { text: "ler", duration: 0.53, begin: 166.000, index: 398 },
  { text: " el", duration: 0.53, begin: 167.250, index: 399 },
  { text: "ma", duration: 0.53, begin: 167.500, index: 400 },
  { text: " de", duration: 0.53, begin: 167.750, index: 401 },
  { text: "ğil,", duration: 0.53, begin: 168.000, index: 402 },
  { text: " a", duration: 0.53, begin: 168.750, index: 403 },
  { text: "ğa", duration: 0.53, begin: 169.000, index: 404 },
  { text: "cın", duration: 0.53, begin: 169.250, index: 405 },
  { text: " i", duration: 0.53, begin: 169.500, index: 406 },
  { text: "çin", duration: 0.53, begin: 169.750, index: 407 },
  { text: "de", duration: 0.53, begin: 170.000, index: 408 },
  { text: " sak", duration: 0.53, begin: 170.250, index: 409 },
  { text: "la", duration: 0.53, begin: 170.500, index: 410 },
  { text: "nan", duration: 0.53, begin: 170.750, index: 411 },
  { text: " kuş", duration: 0.53, begin: 172.000, index: 412 },
  { text: "la", duration: 0.53, begin: 172.250, index: 413 },
  { text: "rın", duration: 0.53, begin: 172.500, index: 414 },
  { text: " göz", duration: 0.53, begin: 172.750, index: 415 },
  { text: "le", duration: 0.53, begin: 173.000, index: 416 },
  { text: "ri!", duration: 0.53, begin: 173.250, index: 417 },
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
  <Link href="/dashboard/stories/iyi-ornek-olmak" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/semsiye-tamircisi" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/1-5.mp3"
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