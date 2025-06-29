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
  { text: "S", duration: 0.28, begin: 0.500, index: 1, isTitle: true, isCenter: true },
  { text: "tan", duration: 0.28, begin: 0.750, index: 2, isTitle: true, isCenter: true },
  { text: "ford", duration: 0.28, begin: 1.000, index: 3, isTitle: true, isCenter: true },
  { text: " Ü", duration: 0.28, begin: 1.250, index: 4, isTitle: true, isCenter: true },
  { text: "ni", duration: 0.28, begin: 1.500, index: 5, isTitle: true, isCenter: true },
  { text: "ver", duration: 0.28, begin: 1.750, index: 6, isTitle: true, isCenter: true },
  { text: "si", duration: 0.28, begin: 2.000, index: 7, isTitle: true, isCenter: true },
  { text: "te", duration: 0.28, begin: 2.250, index: 8, isTitle: true, isCenter: true },
  { text: "si", duration: 0.28, begin: 2.500, index: 9, isTitle: true, isCenter: true },

  // Story content
  { text: " So", duration: 0.28, begin: 3.500, index: 10 },
  { text: "luk", duration: 0.28, begin: 3.750, index: 11 },
  { text: " ve", duration: 0.28, begin: 4.000, index: 12 },
  { text: " yıp", duration: 0.28, begin: 4.250, index: 13 },
  { text: "ran", duration: 0.28, begin: 4.500, index: 14 },
  { text: "mış", duration: 0.28, begin: 4.750, index: 15 },
  { text: " giy", duration: 0.28, begin: 5.000, index: 16 },
  { text: "si", duration: 0.28, begin: 5.200, index: 17 },
  { text: "ler", duration: 0.28, begin: 5.400, index: 18 },
  { text: " i", duration: 0.28, begin: 5.600, index: 19 },
  { text: "çin", duration: 0.28, begin: 5.800, index: 20 },
  { text: "de", duration: 0.28, begin: 6.000, index: 21 },
  { text: "ki", duration: 0.28, begin: 6.200, index: 22 },
  { text: " yaş", duration: 0.28, begin: 6.400, index: 23 },
  { text: "lı", duration: 0.28, begin: 6.600, index: 24 },
  { text: " çift,", duration: 0.28, begin: 6.800, index: 25 },
  { text: " Bos", duration: 0.40, begin: 7.750, index: 26 },
  { text: "ton", duration: 0.40, begin: 8.000, index: 27 },
  { text: " tren", duration: 0.40, begin: 8.250, index: 28 },
  { text: "in", duration: 0.40, begin: 8.500, index: 29 },
  { text: "den", duration: 0.40, begin: 9.000, index: 30 },
  { text: " i", duration: 0.40, begin: 9.250, index: 31 },
  { text: "nip,", duration: 0.40, begin: 9.500, index: 32 },
  { text: " u", duration: 0.28, begin: 10.500, index: 33 },
  { text: "tan", duration: 0.28, begin: 10.750, index: 34 },
  { text: "gaç", duration: 0.28, begin: 11.000, index: 35 },
  { text: " bir", duration: 0.28, begin: 11.250, index: 36 },
  { text: " ta", duration: 0.28, begin: 11.500, index: 37 },
  { text: "vır", duration: 0.28, begin: 11.750, index: 38 },
  { text: "la", duration: 0.28, begin: 12.000, index: 39 },
  { text: " rek", duration: 0.28, begin: 12.750, index: 40 },
  { text: "tö", duration: 0.28, begin: 13.000, index: 41 },
  { text: "rün", duration: 0.28, begin: 13.250, index: 42 },
  { text: " bü", duration: 0.28, begin: 13.500, index: 43 },
  { text: "ro", duration: 0.28, begin: 13.750, index: 44 },
  { text: "sun", duration: 0.28, begin: 14.000, index: 45 },
  { text: "dan", duration: 0.28, begin: 14.250, index: 46 },
  { text: " i", duration: 0.28, begin: 14.500, index: 47 },
  { text: "çe", duration: 0.28, begin: 14.750, index: 48 },
  { text: "ri", duration: 0.28, begin: 15.000, index: 49 },
  { text: " gi", duration: 0.28, begin: 15.250, index: 50 },
  { text: "rer", duration: 0.28, begin: 15.500, index: 51 },
  { text: " gir", duration: 0.28, begin: 15.750, index: 52 },
  { text: "mez,", duration: 0.28, begin: 16.000, index: 53 },
  { text: " sek", duration: 0.28, begin: 16.750, index: 54 },
  { text: "re", duration: 0.28, begin: 17.000, index: 55 },
  { text: "ter", duration: 0.28, begin: 17.250, index: 56 },
  { text: " ma", duration: 0.40, begin: 18.200, index: 57 },
  { text: "sa", duration: 0.40, begin: 18.300, index: 58 },
  { text: "sın", duration: 0.40, begin: 18.500, index: 59 },
  { text: "dan", duration: 0.40, begin: 18.700, index: 60 },
  { text: " fır", duration: 0.28, begin: 19.200, index: 61 },
  { text: "la", duration: 0.28, begin: 19.400, index: 62 },
  { text: "ya", duration: 0.28, begin: 19.600, index: 63 },
  { text: "rak", duration: 0.28, begin: 19.800, index: 64 },
  { text: " ön", duration: 0.28, begin: 20.000, index: 65 },
  { text: "le", duration: 0.28, begin: 20.200, index: 66 },
  { text: "ri", duration: 0.28, begin: 20.400, index: 67 },
  { text: "ni", duration: 0.28, begin: 20.600, index: 68 },
  { text: " kes", duration: 0.28, begin: 20.800, index: 69 },
  { text: "ti.", duration: 0.28, begin: 21.000, index: 70 },
  { text: " Öy", duration: 0.28, begin: 22.000, index: 71 },
  { text: "le", duration: 0.28, begin: 22.250, index: 72 },
  { text: " ya,", duration: 0.28, begin: 22.500, index: 73 },
  { text: " bun", duration: 0.28, begin: 23.250, index: 74 },
  { text: "lar", duration: 0.28, begin: 23.500, index: 75 },
  { text: " gi", duration: 0.28, begin: 23.750, index: 76 },
  { text: "bi", duration: 0.28, begin: 24.000, index: 77 },
  { text: " ne ", duration: 0.28, begin: 24.500, index: 78 },
  { text: " ol", duration: 0.28, begin: 24.700, index: 79 },
  { text: "duk", duration: 0.28, begin: 24.900, index: 80 },
  { text: "la", duration: 0.28, begin: 25.100, index: 81 },
  { text: "rı", duration: 0.28, begin: 25.300, index: 82 },
  { text: " be", duration: 0.28, begin: 25.500, index: 83 },
  { text: "lir", duration: 0.28, begin: 25.700, index: 84 },
  { text: "siz", duration: 0.28, begin: 25.900, index: 85 },
  { text: " taş", duration: 0.28, begin: 26.100, index: 86 },
  { text: "ra", duration: 0.28, begin: 26.300, index: 87 },
  { text: "lı", duration: 0.28, begin: 26.500, index: 88 },
  { text: "la", duration: 0.28, begin: 26.700, index: 89 },
  { text: "rın", duration: 0.28, begin: 26.900, index: 90 },
  { text: " Har", duration: 0.28, begin: 27.900, index: 91 },
  { text: "ward", duration: 0.28, begin: 28.100, index: 92 },
  { text: " gi", duration: 0.28, begin: 28.300, index: 93 },
  { text: "bi", duration: 0.28, begin: 28.500, index: 94 },
  { text: " bir", duration: 0.28, begin: 28.700, index: 95 },
  { text: " ü", duration: 0.28, begin: 29.300, index: 96 },
  { text: "ni", duration: 0.28, begin: 29.500, index: 97 },
  { text: "ver", duration: 0.28, begin: 29.700, index: 98 },
  { text: "si", duration: 0.28, begin: 29.900, index: 99 },
  { text: "te", duration: 0.28, begin: 30.100, index: 100 },
  { text: "de", duration: 0.28, begin: 30.300, index: 101 },
  { text: " ne", duration: 0.28, begin: 30.500, index: 102 },
  { text: " iş", duration: 0.28, begin: 30.700, index: 103 },
  { text: "le", duration: 0.28, begin: 30.900, index: 104 },
  { text: "ri", duration: 0.28, begin: 31.100, index: 105 },
  { text: " o", duration: 0.28, begin: 31.300, index: 106 },
  { text: "la", duration: 0.28, begin: 31.500, index: 107 },
  { text: "bi", duration: 0.28, begin: 31.700, index: 108 },
  { text: "lir", duration: 0.28, begin: 31.900, index: 109 },
  { text: "di?", duration: 0.28, begin: 32.100, index: 110 },
  { text: " A", duration: 0.28, begin: 33.200, index: 111 },
  { text: "dam", duration: 0.28, begin: 33.400, index: 112 },
  { text: " ya", duration: 0.28, begin: 33.600, index: 113 },
  { text: "vaş", duration: 0.28, begin: 33.800, index: 114 },
  { text: "ça", duration: 0.28, begin: 34.000, index: 115 },
  { text: " rek", duration: 0.28, begin: 34.200, index: 116 },
  { text: "tö", duration: 0.28, begin: 34.400, index: 117 },
  { text: "rü", duration: 0.28, begin: 34.600, index: 118 },
  { text: " gör", duration: 0.28, begin: 34.800, index: 119 },
  { text: "mek", duration: 0.28, begin: 35.000, index: 120 },
  { text: " is", duration: 0.28, begin: 35.200, index: 121 },
  { text: "te", duration: 0.28, begin: 35.400, index: 122 },
  { text: "dik", duration: 0.28, begin: 35.600, index: 123 },
  { text: "le", duration: 0.28, begin: 35.800, index: 124 },
  { text: "ri", duration: 0.28, begin: 36.000, index: 125 },
  { text: "ni", duration: 0.28, begin: 36.200, index: 126 },
  { text: " söy", duration: 0.40, begin: 36.500, index: 127 },
  { text: "le", duration: 0.40, begin: 36.700, index: 128 },
  { text: "di.", duration: 0.40, begin: 36.900, index: 129 },
  { text: " İş", duration: 0.28, begin: 38.500, index: 130 },
  { text: "te", duration: 0.28, begin: 38.700, index: 131 },
  { text: " bu", duration: 0.28, begin: 38.900, index: 132 },
  { text: " im", duration: 0.28, begin: 39.100, index: 133 },
  { text: "kan", duration: 0.28, begin: 39.300, index: 134 },
  { text: "sız", duration: 0.28, begin: 39.500, index: 135 },
  { text: "dı.", duration: 0.28, begin: 39.700, index: 136 },
  { text: " Rek", duration: 0.28, begin: 41.000, index: 137 },
  { text: "tö", duration: 0.28, begin: 41.200, index: 138 },
  { text: "rün", duration: 0.28, begin: 41.400, index: 139 },
  { text: " o", duration: 0.28, begin: 41.600, index: 140 },
  { text: "gün", duration: 0.28, begin: 41.800, index: 141 },
  { text: " on", duration: 0.28, begin: 42.200, index: 142 },
  { text: "la", duration: 0.28, begin: 42.400, index: 143 },
  { text: "ra", duration: 0.28, begin: 42.600, index: 144 },
  { text: " a", duration: 0.28, begin: 42.800, index: 145 },
  { text: "yı", duration: 0.28, begin: 43.000, index: 146 },
  { text: "ra", duration: 0.28, begin: 43.200, index: 147 },
  { text: "cak", duration: 0.28, begin: 43.400, index: 148 },
  { text: " sa", duration: 0.28, begin: 43.800, index: 149 },
  { text: "ni", duration: 0.28, begin: 44.000, index: 150 },
  { text: "ye", duration: 0.28, begin: 44.200, index: 151 },
  { text: "si", duration: 0.28, begin: 44.400, index: 152 },
  { text: " yok", duration: 0.28, begin: 44.600, index: 153 },
  { text: "tu.", duration: 0.28, begin: 44.800, index: 154 },
  { text: " Yaş", duration: 0.28, begin: 45.800, index: 155 },
  { text: "lı", duration: 0.28, begin: 46.000, index: 156 },
  { text: " ka", duration: 0.28, begin: 46.200, index: 157 },
  { text: "dın", duration: 0.28, begin: 46.400, index: 158 },
  { text: " çe", duration: 0.38, begin: 46.600, index: 159 },
  { text: "kin", duration: 0.38, begin: 46.800, index: 160 },
  { text: "gen", duration: 0.38, begin: 47.000, index: 161 },
  { text: " bir", duration: 0.48, begin: 47.200, index: 162 },
  { text: " ta", duration: 0.48, begin: 47.400, index: 163 },
  { text: "vır", duration: 0.48, begin: 47.600, index: 164 },
  { text: "la:", duration: 0.48, begin: 47.800, index: 165 },
  { text: " \"Bek", duration: 0.38, begin: 49.000, index: 166 },
  { text: "le", duration: 0.38, begin: 49.200, index: 167 },
  { text: "riz\"", duration: 0.38, begin: 49.400, index: 168 },
  { text: " di", duration: 0.28, begin: 50.200, index: 169 },
  { text: "ye", duration: 0.28, begin: 50.400, index: 170 },
  { text: " mı", duration: 0.28, begin: 50.600, index: 171 },
  { text: "rıl", duration: 0.28, begin: 50.800, index: 172 },
  { text: "dan", duration: 0.28, begin: 51.000, index: 173 },
  { text: "dı.", duration: 0.28, begin: 51.200, index: 174 },
  { text: " Na", duration: 0.28, begin: 52.200, index: 175 },
  { text: "sıl", duration: 0.28, begin: 52.400, index: 176 },
  { text: " ol", duration: 0.28, begin: 52.600, index: 177 },
  { text: "sa", duration: 0.28, begin: 52.800, index: 178 },
  { text: " bir", duration: 0.28, begin: 53.200, index: 179 },
  { text: " sü", duration: 0.28, begin: 53.600, index: 180 },
  { text: "re", duration: 0.28, begin: 53.800, index: 181 },
  { text: " son", duration: 0.28, begin: 54.000, index: 182 },
  { text: "ra", duration: 0.28, begin: 54.200, index: 183 },
  { text: " sı", duration: 0.28, begin: 54.600, index: 184 },
  { text: "kı", duration: 0.28, begin: 54.800, index: 185 },
  { text: "lıp", duration: 0.28, begin: 55.000, index: 186 },
  { text: " gi", duration: 0.28, begin: 55.200, index: 187 },
  { text: "de", duration: 0.28, begin: 55.400, index: 188 },
  { text: "cek", duration: 0.28, begin: 55.600, index: 189 },
  { text: "ler", duration: 0.28, begin: 55.800, index: 190 },
  { text: "di.", duration: 0.28, begin: 56.000, index: 191 },
  { text: " Sek", duration: 0.28, begin: 57.000, index: 192 },
  { text: "re", duration: 0.28, begin: 57.200, index: 193 },
  { text: "ter", duration: 0.28, begin: 57.400, index: 194 },
  { text: " se", duration: 0.28, begin: 57.800, index: 195 },
  { text: "si", duration: 0.28, begin: 58.000, index: 196 },
  { text: "ni", duration: 0.28, begin: 58.200, index: 197 },
  { text: " çı", duration: 0.28, begin: 58.400, index: 198 },
  { text: "kar", duration: 0.28, begin: 58.600, index: 199 },
  { text: "ma", duration: 0.28, begin: 58.800, index: 200 },
  { text: "dan", duration: 0.28, begin: 59.000, index: 201 },
  { text: " ma", duration: 0.28, begin: 59.400, index: 202 },
  { text: "sa", duration: 0.28, begin: 59.600, index: 203 },
  { text: "sı", duration: 0.28, begin: 59.800, index: 204 },
  { text: "na", duration: 0.28, begin: 60.000, index: 205 },
  { text: " dön", duration: 0.28, begin: 60.200, index: 206 },
  { text: "dü.", duration: 0.28, begin: 60.400, index: 207 },
  { text: " Sa", duration: 0.28, begin: 61.600, index: 208 },
  { text: "at", duration: 0.28, begin: 61.800, index: 209 },
  { text: "ler", duration: 0.28, begin: 62.000, index: 210 },
  { text: " geç", duration: 0.28, begin: 62.200, index: 211 },
  { text: "ti,", duration: 0.28, begin: 62.400, index: 212 },
  { text: " yaş", duration: 0.28, begin: 63.600, index: 213 },
  { text: "lı", duration: 0.28, begin: 63.800, index: 214 },
  { text: " çift", duration: 0.28, begin: 64.200, index: 215 },
  { text: " pes", duration: 0.28, begin: 64.400, index: 216 },
  { text: " et", duration: 0.28, begin: 65.000, index: 217 },
  { text: "me", duration: 0.28, begin: 65.200, index: 218 },
  { text: "di.", duration: 0.28, begin: 65.400, index: 219 },
  { text: " So", duration: 0.28, begin: 66.400, index: 220 },
  { text: "nun", duration: 0.28, begin: 66.600, index: 221 },
  { text: "da", duration: 0.28, begin: 66.800, index: 222 },
  { text: " sek", duration: 0.28, begin: 67.000, index: 223 },
  { text: "re", duration: 0.28, begin: 67.200, index: 224 },
  { text: "ter", duration: 0.28, begin: 67.400, index: 225 },
  { text: " da", duration: 0.28, begin: 67.600, index: 226 },
  { text: "ya", duration: 0.28, begin: 67.800, index: 227 },
  { text: "na", duration: 0.28, begin: 68.000, index: 228 },
  { text: "ma", duration: 0.28, begin: 68.200, index: 229 },
  { text: "ya", duration: 0.28, begin: 68.400, index: 230 },
  { text: "rak", duration: 0.28, begin: 68.600, index: 231 },
  { text: " ye", duration: 0.28, begin: 69.000, index: 232 },
  { text: "rin", duration: 0.28, begin: 69.200, index: 233 },
  { text: "den", duration: 0.28, begin: 69.400, index: 234 },
  { text: " kalk", duration: 0.28, begin: 69.800, index: 235 },
  { text: "tı.", duration: 0.28, begin: 70.000, index: 236 },
  { text: " \"Sa", duration: 0.28, begin: 71.200, index: 237 },
  { text: "de", duration: 0.28, begin: 71.400, index: 238 },
  { text: "ce", duration: 0.28, begin: 71.600, index: 239 },
  { text: " bir", duration: 0.28, begin: 71.800, index: 240 },
  { text: "kaç", duration: 0.28, begin: 72.000, index: 241 },
  { text: " da", duration: 0.28, begin: 72.400, index: 242 },
  { text: "ki", duration: 0.28, begin: 72.600, index: 243 },
  { text: "ka", duration: 0.28, begin: 72.800, index: 244 },
  { text: " gö", duration: 0.28, begin: 73.200, index: 245 },
  { text: "rüş", duration: 0.28, begin: 73.400, index: 246 },
  { text: "se", duration: 0.28, begin: 73.600, index: 247 },
  { text: "niz,", duration: 0.28, begin: 73.800, index: 248 },
  { text: " yok", duration: 0.28, begin: 74.600, index: 249 },
  { text: "sa", duration: 0.28, begin: 74.800, index: 250 },
  { text: " gi", duration: 0.28, begin: 75.000, index: 251 },
  { text: "de", duration: 0.28, begin: 75.200, index: 252 },
  { text: "cek", duration: 0.28, begin: 75.400, index: 253 },
  { text: "le", duration: 0.28, begin: 75.600, index: 254 },
  { text: "ri", duration: 0.28, begin: 75.800, index: 255 },
  { text: " yok\"", duration: 0.28, begin: 76.000, index: 256 },
  { text: " di", duration: 0.13, begin: 77.000, index: 257 },
  { text: "ye", duration: 0.13, begin: 77.200, index: 258 },
  { text: "rek", duration: 0.13, begin: 77.400, index: 259 },
  { text: " rek", duration: 0.28, begin: 77.600, index: 260 },
  { text: "tö", duration: 0.28, begin: 77.800, index: 261 },
  { text: "rü", duration: 0.28, begin: 78.000, index: 262 },
  { text: " ik", duration: 0.28, begin: 78.200, index: 263 },
  { text: "na", duration: 0.28, begin: 78.400, index: 264 },
  { text: " et", duration: 0.28, begin: 78.800, index: 265 },
  { text: "me", duration: 0.28, begin: 79.000, index: 266 },
  { text: "ye", duration: 0.28, begin: 79.200, index: 267 },
  { text: " ça", duration: 0.28, begin: 79.400, index: 268 },
  { text: "lış", duration: 0.28, begin: 79.600, index: 269 },
  { text: "tı.", duration: 0.28, begin: 79.800, index: 270 },
  { text: " An", duration: 0.28, begin: 81.100, index: 271 },
  { text: "la", duration: 0.28, begin: 81.300, index: 272 },
  { text: "şı", duration: 0.28, begin: 81.500, index: 273 },
  { text: "lan", duration: 0.28, begin: 81.700, index: 274 },
  { text: " ça", duration: 0.28, begin: 81.900, index: 275 },
  { text: "re", duration: 0.28, begin: 82.100, index: 276 },
  { text: " yok", duration: 0.28, begin: 82.500, index: 277 },
  { text: "tu.", duration: 0.28, begin: 82.700, index: 278 },
  { text: " Genç", duration: 0.28, begin: 83.800, index: 279 },
  { text: " rek", duration: 0.28, begin: 84.000, index: 280 },
  { text: "tör", duration: 0.28, begin: 84.200, index: 281 },
  { text: " is", duration: 0.28, begin: 84.900, index: 282 },
  { text: "tek", duration: 0.28, begin: 85.100, index: 283 },
  { text: "siz", duration: 0.28, begin: 85.300, index: 284 },
  { text: " bir", duration: 0.40, begin: 85.500, index: 285 },
  { text: " bi", duration: 0.40, begin: 85.700, index: 286 },
  { text: "çim", duration: 0.40, begin: 85.900, index: 287 },
  { text: "de", duration: 0.40, begin: 86.100, index: 288 },
  { text: " ka", duration: 0.28, begin: 86.700, index: 289 },
  { text: "pı", duration: 0.28, begin: 86.900, index: 290 },
  { text: "yı", duration: 0.28, begin: 87.100, index: 291 },
  { text: " aç", duration: 0.28, begin: 87.300, index: 292 },
  { text: "tı.", duration: 0.28, begin: 87.500, index: 293 },
  { text: " Sek", duration: 0.28, begin: 88.500, index: 294 },
  { text: "re", duration: 0.28, begin: 88.700, index: 295 },
  { text: "te", duration: 0.28, begin: 88.900, index: 296 },
  { text: "rin", duration: 0.28, begin: 89.100, index: 297 },
  { text: " an", duration: 0.28, begin: 89.700, index: 298 },
  { text: "lat", duration: 0.28, begin: 89.900, index: 299 },
  { text: "tı", duration: 0.28, begin: 90.100, index: 300 },
  { text: "ğı", duration: 0.28, begin: 90.300, index: 301 },
  { text: " tab", duration: 0.28, begin: 90.500, index: 302 },
  { text: "lo", duration: 0.28, begin: 90.700, index: 303 },
  { text: " i", duration: 0.28, begin: 91.000, index: 304 },
  { text: "çi", duration: 0.28, begin: 91.200, index: 305 },
  { text: "ni", duration: 0.28, begin: 91.400, index: 306 },
  { text: " bu", duration: 0.28, begin: 91.800, index: 307 },
  { text: "lan", duration: 0.28, begin: 92.000, index: 308 },
  { text: "dır", duration: 0.28, begin: 92.100, index: 309 },
  { text: "mış", duration: 0.28, begin: 92.300, index: 310 },
  { text: "tı.", duration: 0.28, begin: 92.500, index: 311 },
  { text: " Za", duration: 0.28, begin: 93.500, index: 312 },
  { text: "ten", duration: 0.28, begin: 93.700, index: 313 },
  { text: " taş", duration: 0.28, begin: 94.300, index: 314 },
  { text: "ra", duration: 0.28, begin: 94.500, index: 315 },
  { text: "lı", duration: 0.28, begin: 94.700, index: 316 },
  { text: "lar", duration: 0.28, begin: 94.900, index: 317 },
  { text: "dan,", duration: 0.28, begin: 95.100, index: 318 },
  { text: " ka", duration: 0.28, begin: 96.200, index: 319 },
  { text: "ba", duration: 0.28, begin: 96.400, index: 320 },
  { text: " sa", duration: 0.28, begin: 96.600, index: 321 },
  { text: "ba", duration: 0.28, begin: 96.800, index: 322 },
  { text: " köy", duration: 0.28, begin: 97.000, index: 323 },
  { text: "lü", duration: 0.28, begin: 97.200, index: 324 },
  { text: "ler", duration: 0.28, begin: 97.400, index: 325 },
  { text: "den", duration: 0.28, begin: 97.600, index: 326 },
  { text: " nef", duration: 0.28, begin: 98.000, index: 327 },
  { text: "ret", duration: 0.28, begin: 98.200, index: 328 },
  { text: " e", duration: 0.28, begin: 98.400, index: 329 },
  { text: "der", duration: 0.28, begin: 98.600, index: 330 },
  { text: "di.", duration: 0.28, begin: 98.800, index: 331 },
  { text: " O", duration: 0.28, begin: 100.200, index: 332 },
  { text: "nun", duration: 0.28, begin: 100.400, index: 333 },
  { text: " gi", duration: 0.28, begin: 100.600, index: 334 },
  { text: "bi", duration: 0.28, begin: 100.800, index: 335 },
  { text: " bir", duration: 0.28, begin: 101.000, index: 336 },
  { text: " a", duration: 0.28, begin: 101.200, index: 337 },
  { text: "da", duration: 0.28, begin: 101.400, index: 338 },
  { text: "mın", duration: 0.28, begin: 101.600, index: 339 },
  { text: " o", duration: 0.28, begin: 102.000, index: 340 },
  { text: "fi", duration: 0.28, begin: 102.200, index: 341 },
  { text: "si", duration: 0.28, begin: 102.400, index: 342 },
  { text: "ne", duration: 0.28, begin: 102.600, index: 343 },
  { text: " gel", duration: 0.28, begin: 102.800, index: 344 },
  { text: "me", duration: 0.28, begin: 103.000, index: 345 },
  { text: "ye", duration: 0.28, begin: 103.200, index: 346 },
  { text: " ce", duration: 0.28, begin: 103.400, index: 347 },
  { text: "sa", duration: 0.28, begin: 103.600, index: 348 },
  { text: "ret", duration: 0.28, begin: 103.800, index: 349 },
  { text: " et", duration: 0.28, begin: 104.000, index: 350 },
  { text: "mek!", duration: 0.28, begin: 104.200, index: 351 },
  { text: " O", duration: 0.28, begin: 105.200, index: 352 },
  { text: "la", duration: 0.28, begin: 105.500, index: 353 },
  { text: "cak", duration: 0.28, begin: 105.700, index: 354 },
  { text: " şey", duration: 0.28, begin: 105.900, index: 355 },
  { text: " miy", duration: 0.28, begin: 106.100, index: 356 },
  { text: "di", duration: 0.28, begin: 106.300, index: 357 },
  { text: " bu?", duration: 0.28, begin: 106.600, index: 358 },
  { text: " Su", duration: 0.28, begin: 107.800, index: 359 },
  { text: "ra", duration: 0.28, begin: 108.000, index: 360 },
  { text: "tı", duration: 0.28, begin: 108.200, index: 361 },
  { text: " a", duration: 0.28, begin: 108.400, index: 362 },
  { text: "sıl", duration: 0.28, begin: 108.600, index: 363 },
  { text: "mış", duration: 0.28, begin: 108.800, index: 364 },
  { text: " si", duration: 0.28, begin: 109.800, index: 365 },
  { text: "nir", duration: 0.28, begin: 110.000, index: 366 },
  { text: "le", duration: 0.28, begin: 110.200, index: 367 },
  { text: "ri", duration: 0.28, begin: 110.400, index: 368 },
  { text: " ge", duration: 0.28, begin: 110.600, index: 369 },
  { text: "ril", duration: 0.28, begin: 110.800, index: 370 },
  { text: "miş", duration: 0.28, begin: 111.000, index: 371 },
  { text: "ti.", duration: 0.28, begin: 111.200, index: 372 },
  { text: " Yaş", duration: 0.28, begin: 112.400, index: 373 },
  { text: "lı", duration: 0.28, begin: 112.600, index: 374 },
  { text: " ka", duration: 0.28, begin: 112.800, index: 375 },
  { text: "dın", duration: 0.28, begin: 113.000, index: 376 },
  { text: " he", duration: 0.28, begin: 113.600, index: 377 },
  { text: "men", duration: 0.28, begin: 113.800, index: 378 },
  { text: " sö", duration: 0.28, begin: 114.000, index: 379 },
  { text: "ze", duration: 0.28, begin: 114.200, index: 380 },
  { text: " baş", duration: 0.28, begin: 114.400, index: 381 },
  { text: "la", duration: 0.28, begin: 114.600, index: 382 },
  { text: "dı.", duration: 0.28, begin: 114.800, index: 383 },
  { text: " Har", duration: 0.28, begin: 116.000, index: 384 },
  { text: "ward'", duration: 0.28, begin: 116.200, index: 385 },
  { text: "da", duration: 0.28, begin: 116.400, index: 386 },
  { text: " o", duration: 0.28, begin: 116.600, index: 387 },
  { text: "ku", duration: 0.28, begin: 116.800, index: 388 },
  { text: "yan", duration: 0.28, begin: 117.000, index: 389 },
  { text: " o", duration: 0.28, begin: 117.200, index: 390 },
  { text: "ğul", duration: 0.28, begin: 117.400, index: 391 },
  { text: "la", duration: 0.28, begin: 117.600, index: 392 },
  { text: "rı", duration: 0.28, begin: 117.800, index: 393 },
  { text: "nı", duration: 0.28, begin: 118.000, index: 394 },
  { text: " bir", duration: 0.28, begin: 119.000, index: 395 },
  { text: " yıl", duration: 0.28, begin: 119.200, index: 396 },
  { text: " ön", duration: 0.28, begin: 119.400, index: 397 },
  { text: "ce", duration: 0.28, begin: 119.600, index: 398 },
  { text: " bir", duration: 0.28, begin: 119.800, index: 399 },
  { text: " ka", duration: 0.28, begin: 120.000, index: 400 },
  { text: "za", duration: 0.28, begin: 120.200, index: 401 },
  { text: "da", duration: 0.28, begin: 120.400, index: 402 },
  { text: " kay", duration: 0.38, begin: 121.000, index: 403 },
  { text: "bet", duration: 0.38, begin: 121.200, index: 404 },
  { text: "miş", duration: 0.38, begin: 121.400, index: 405 },
  { text: "ler", duration: 0.38, begin: 121.600, index: 406 },
  { text: "di.", duration: 0.38, begin: 121.800, index: 407 },
  { text: " O", duration: 0.28, begin: 123.400, index: 408 },
  { text: "ğul", duration: 0.28, begin: 123.600, index: 409 },
  { text: "la", duration: 0.28, begin: 123.800, index: 410 },
  { text: "rı", duration: 0.28, begin: 124.000, index: 411 },
  { text: " bu", duration: 0.28, begin: 124.200, index: 412 },
  { text: "ra", duration: 0.28, begin: 124.400, index: 413 },
  { text: "da", duration: 0.28, begin: 124.600, index: 414 },
  { text: " öy", duration: 0.28, begin: 124.800, index: 415 },
  { text: "le", duration: 0.28, begin: 125.000, index: 416 },
  { text: " mut", duration: 0.28, begin: 125.200, index: 417 },
  { text: "lu", duration: 0.28, begin: 125.400, index: 418 },
  { text: " ol", duration: 0.28, begin: 125.600, index: 419 },
  { text: "muş", duration: 0.28, begin: 125.800, index: 420 },
  { text: "tu", duration: 0.28, begin: 126.000, index: 421 },
  { text: " ki;", duration: 0.28, begin: 126.200, index: 422 },
  { text: " o", duration: 0.28, begin: 127.400, index: 423 },
  { text: "nun", duration: 0.28, begin: 127.600, index: 424 },
  { text: " a", duration: 0.28, begin: 127.800, index: 425 },
  { text: "nı", duration: 0.28, begin: 128.000, index: 426 },
  { text: "sı", duration: 0.28, begin: 128.200, index: 427 },
  { text: "na", duration: 0.28, begin: 128.400, index: 428 },
  { text: " o", duration: 0.28, begin: 128.600, index: 429 },
  { text: "kul", duration: 0.28, begin: 128.800, index: 430 },
  { text: " sı", duration: 0.28, begin: 129.000, index: 431 },
  { text: "nır", duration: 0.28, begin: 129.200, index: 432 },
  { text: "la", duration: 0.28, begin: 129.400, index: 433 },
  { text: "rı", duration: 0.28, begin: 129.600, index: 434 },
  { text: " i", duration: 0.28, begin: 129.800, index: 435 },
  { text: "çin", duration: 0.28, begin: 130.000, index: 436 },
  { text: "de", duration: 0.28, begin: 130.200, index: 437 },
  { text: " bir", duration: 0.28, begin: 130.400, index: 438 },
  { text: " ye", duration: 0.28, begin: 130.600, index: 439 },
  { text: "re,", duration: 0.28, begin: 130.800, index: 440 },
  { text: " bir", duration: 0.28, begin: 132.000, index: 441 },
  { text: " a", duration: 0.28, begin: 132.200, index: 442 },
  { text: "nıt", duration: 0.28, begin: 132.400, index: 443 },
  { text: " dik", duration: 0.28, begin: 132.800, index: 444 },
  { text: "mek", duration: 0.28, begin: 133.000, index: 445 },
  { text: " is", duration: 0.40, begin: 133.200, index: 446 },
  { text: "ti", duration: 0.40, begin: 133.400, index: 447 },
  { text: "yor", duration: 0.40, begin: 133.600, index: 448 },
  { text: "lar", duration: 0.40, begin: 133.800, index: 449 },
  { text: "dı.", duration: 0.40, begin: 134.000, index: 450 },
  { text: " Rek", duration: 0.28, begin: 135.600, index: 451 },
  { text: "tör,", duration: 0.28, begin: 135.800, index: 452 },
  { text: " bu", duration: 0.28, begin: 136.800, index: 453 },
  { text: " do", duration: 0.28, begin: 137.000, index: 454 },
  { text: "ku", duration: 0.28, begin: 137.200, index: 455 },
  { text: "nak", duration: 0.28, begin: 137.400, index: 456 },
  { text: "lı", duration: 0.28, begin: 137.600, index: 457 },
  { text: " öy", duration: 0.28, begin: 137.800, index: 458 },
  { text: "kü", duration: 0.28, begin: 138.000, index: 459 },
  { text: "den", duration: 0.28, begin: 138.200, index: 460 },
  { text: " duy", duration: 0.28, begin: 138.600, index: 461 },
  { text: "gu", duration: 0.28, begin: 138.800, index: 462 },
  { text: "lan", duration: 0.28, begin: 139.000, index: 463 },
  { text: "mak", duration: 0.28, begin: 139.400, index: 464 },
  { text: " ye", duration: 0.28, begin: 139.800, index: 465 },
  { text: "ri", duration: 0.28, begin: 140.000, index: 466 },
  { text: "ne", duration: 0.28, begin: 140.200, index: 467 },
  { text: " öf", duration: 0.28, begin: 140.400, index: 468 },
  { text: "ke", duration: 0.28, begin: 140.600, index: 469 },
  { text: "len", duration: 0.28, begin: 140.800, index: 470 },
  { text: "di.", duration: 0.28, begin: 141.000, index: 471 },
  { text: " \"Ma", duration: 0.28, begin: 142.200, index: 472 },
  { text: "dam,", duration: 0.28, begin: 142.400, index: 473 },
  { text: " biz", duration: 0.28, begin: 143.400, index: 474 },
  { text: " Har", duration: 0.28, begin: 143.800, index: 475 },
  { text: "ward'", duration: 0.28, begin: 144.000, index: 476 },
  { text: "da", duration: 0.28, begin: 144.200, index: 477 },
  { text: " o", duration: 0.28, begin: 144.400, index: 478 },
  { text: "ku", duration: 0.28, begin: 144.600, index: 479 },
  { text: "yan", duration: 0.28, begin: 144.800, index: 480 },
  { text: " ve", duration: 0.28, begin: 145.000, index: 481 },
  { text: " son", duration: 0.28, begin: 145.800, index: 482 },
  { text: "ra", duration: 0.28, begin: 146.000, index: 483 },
  { text: " ö", duration: 0.28, begin: 146.600, index: 484 },
  { text: "len", duration: 0.28, begin: 146.800, index: 485 },
  { text: " her", duration: 0.28, begin: 147.000, index: 486 },
  { text: "kes", duration: 0.28, begin: 147.200, index: 487 },
  { text: " i", duration: 0.28, begin: 147.600, index: 488 },
  { text: "çin", duration: 0.28, begin: 147.800, index: 489 },
  { text: " bir", duration: 0.28, begin: 148.600, index: 490 },
  { text: " a", duration: 0.28, begin: 148.800, index: 491 },
  { text: "nıt", duration: 0.28, begin: 149.000, index: 492 },
  { text: " di", duration: 0.28, begin: 149.600, index: 493 },
  { text: "ke", duration: 0.28, begin: 149.800, index: 494 },
  { text: "cek", duration: 0.28, begin: 150.000, index: 495 },
  { text: " ol", duration: 0.28, begin: 150.200, index: 496 },
  { text: "sak,", duration: 0.28, begin: 150.400, index: 497 },
  { text: " bu", duration: 0.28, begin: 151.200, index: 498 },
  { text: "ra", duration: 0.28, begin: 151.400, index: 499 },
  { text: "sı", duration: 0.28, begin: 151.600, index: 500 },
  { text: " me", duration: 0.28, begin: 151.800, index: 501 },
  { text: "zar", duration: 0.28, begin: 152.000, index: 502 },
  { text: "lı", duration: 0.28, begin: 152.200, index: 503 },
  { text: "ğa", duration: 0.28, begin: 152.400, index: 504 },
  { text: " dö", duration: 0.28, begin: 152.600, index: 505 },
  { text: "ner.\"", duration: 0.28, begin: 152.800, index: 506 },
  { text: " \"Ha", duration: 0.28, begin: 154.000, index: 507 },
  { text: "yır,", duration: 0.28, begin: 154.200, index: 508 },
  { text: " ha", duration: 0.28, begin: 154.800, index: 509 },
  { text: "yır\"", duration: 0.28, begin: 155.000, index: 510 },
  { text: " di", duration: 0.28, begin: 155.600, index: 511 },
  { text: "ye", duration: 0.28, begin: 155.800, index: 512 },
  { text: "rek", duration: 0.28, begin: 156.000, index: 513 },
  { text: " hay", duration: 0.28, begin: 156.400, index: 514 },
  { text: "kır", duration: 0.28, begin: 156.600, index: 515 },
  { text: "dı", duration: 0.28, begin: 156.800, index: 516 },
  { text: " yaş", duration: 0.28, begin: 157.200, index: 517 },
  { text: "lı", duration: 0.28, begin: 157.400, index: 518 },
  { text: " ka", duration: 0.28, begin: 157.600, index: 519 },
  { text: "dın.", duration: 0.28, begin: 157.800, index: 520 },
  { text: " \"A", duration: 0.28, begin: 158.600, index: 521 },
  { text: "nıt", duration: 0.28, begin: 158.800, index: 522 },
  { text: " de", duration: 0.28, begin: 159.000, index: 523 },
  { text: "ğil,", duration: 0.28, begin: 159.200, index: 524 },
  { text: " bel", duration: 0.28, begin: 160.000, index: 525 },
  { text: "ki", duration: 0.28, begin: 160.200, index: 526 },
  { text: " Har", duration: 0.28, begin: 160.400, index: 527 },
  { text: "ward'", duration: 0.28, begin: 160.600, index: 528 },
  { text: "a", duration: 0.28, begin: 160.800, index: 529 },
  { text: " bir", duration: 0.28, begin: 161.400, index: 530 },
  { text: " bi", duration: 0.28, begin: 161.600, index: 531 },
  { text: "na", duration: 0.28, begin: 161.800, index: 532 },
  { text: " yap", duration: 0.28, begin: 162.000, index: 533 },
  { text: "tı", duration: 0.28, begin: 162.200, index: 534 },
  { text: "ra", duration: 0.28, begin: 162.400, index: 535 },
  { text: "bi", duration: 0.28, begin: 162.600, index: 536 },
  { text: "li", duration: 0.28, begin: 162.800, index: 537 },
  { text: "riz.\"", duration: 0.28, begin: 163.000, index: 538 },
  { text: " Rek", duration: 0.28, begin: 164.400, index: 539 },
  { text: "tör,", duration: 0.28, begin: 164.600, index: 540 },
  { text: " yıp", duration: 0.28, begin: 165.400, index: 541 },
  { text: "ran", duration: 0.28, begin: 165.600, index: 542 },
  { text: "mış", duration: 0.28, begin: 165.800, index: 543 },
  { text: " giy", duration: 0.28, begin: 166.400, index: 544 },
  { text: "si", duration: 0.28, begin: 166.600, index: 545 },
  { text: "le", duration: 0.28, begin: 166.800, index: 546 },
  { text: "re", duration: 0.28, begin: 167.000, index: 547 },
  { text: " nef", duration: 0.28, begin: 167.800, index: 548 },
  { text: "ret", duration: 0.28, begin: 168.000, index: 549 },
  { text: " do", duration: 0.28, begin: 168.200, index: 550 },
  { text: "lu", duration: 0.28, begin: 168.400, index: 551 },
  { text: " bir", duration: 0.28, begin: 168.600, index: 552 },
  { text: " ba", duration: 0.28, begin: 168.800, index: 553 },
  { text: "kış", duration: 0.28, begin: 169.000, index: 554 },
  { text: " fır", duration: 0.28, begin: 169.600, index: 555 },
  { text: "la", duration: 0.28, begin: 169.800, index: 556 },
  { text: "ta", duration: 0.28, begin: 170.000, index: 557 },
  { text: "rak:", duration: 0.28, begin: 170.200, index: 558 },
  { text: " \"Bi", duration: 0.28, begin: 171.000, index: 559 },
  { text: "na", duration: 0.28, begin: 171.200, index: 560 },
  { text: " mı?", duration: 0.28, begin: 171.400, index: 561 },
  { text: " Siz", duration: 0.28, begin: 172.600, index: 562 },
  { text: " bir", duration: 0.28, begin: 172.800, index: 563 },
  { text: " bi", duration: 0.28, begin: 173.000, index: 564 },
  { text: "na", duration: 0.28, begin: 173.200, index: 565 },
  { text: "nın", duration: 0.28, begin: 173.400, index: 566 },
  { text: " ka", duration: 0.28, begin: 174.000, index: 567 },
  { text: "ça", duration: 0.28, begin: 174.200, index: 568 },
  { text: " mal", duration: 0.28, begin: 174.400, index: 569 },
  { text: " ol", duration: 0.28, begin: 174.600, index: 570 },
  { text: "du", duration: 0.28, begin: 174.800, index: 571 },
  { text: "ğu", duration: 0.28, begin: 175.000, index: 572 },
  { text: "nu", duration: 0.28, begin: 175.200, index: 573 },
  { text: " bi", duration: 0.28, begin: 175.400, index: 574 },
  { text: "li", duration: 0.28, begin: 175.600, index: 575 },
  { text: "yor", duration: 0.28, begin: 175.800, index: 576 },
  { text: " mu", duration: 0.28, begin: 176.000, index: 577 },
  { text: "su", duration: 0.28, begin: 176.200, index: 578 },
  { text: "nuz?", duration: 0.28, begin: 176.400, index: 579 },
  { text: " Sa", duration: 0.28, begin: 177.200, index: 580 },
  { text: "de", duration: 0.28, begin: 177.400, index: 581 },
  { text: "ce", duration: 0.28, begin: 177.600, index: 582 },
  { text: " son", duration: 0.28, begin: 178.000, index: 583 },
  { text: " yap", duration: 0.28, begin: 178.200, index: 584 },
  { text: "tı", duration: 0.28, begin: 178.400, index: 585 },
  { text: "ğı", duration: 0.28, begin: 178.600, index: 586 },
  { text: "mız", duration: 0.28, begin: 178.800, index: 587 },
  { text: " bö", duration: 0.28, begin: 179.000, index: 588 },
  { text: "lüm", duration: 0.28, begin: 179.200, index: 589 },
  { text: " se", duration: 0.28, begin: 180.200, index: 590 },
  { text: "kiz", duration: 0.28, begin: 180.400, index: 591 },
  { text: " mil", duration: 0.28, begin: 180.600, index: 592 },
  { text: "yon", duration: 0.28, begin: 180.800, index: 593 },
  { text: " do", duration: 0.28, begin: 181.400, index: 594 },
  { text: "lar", duration: 0.28, begin: 181.600, index: 595 },
  { text: "dan", duration: 0.28, begin: 181.800, index: 596 },
  { text: " faz", duration: 0.28, begin: 182.000, index: 597 },
  { text: "la", duration: 0.28, begin: 182.200, index: 598 },
  { text: "sı", duration: 0.28, begin: 182.400, index: 599 },
  { text: "na", duration: 0.28, begin: 182.600, index: 600 },
  { text: " çık", duration: 0.28, begin: 182.800, index: 601 },
  { text: "tı.\"", duration: 0.28, begin: 183.000, index: 602 },
  { text: " Tar", duration: 0.28, begin: 184.600, index: 603 },
  { text: "tış", duration: 0.28, begin: 184.800, index: 604 },
  { text: "ma", duration: 0.28, begin: 185.000, index: 605 },
  { text: "yı", duration: 0.28, begin: 185.200, index: 606 },
  { text: " nok", duration: 0.28, begin: 185.400, index: 607 },
  { text: "ta", duration: 0.28, begin: 185.600, index: 608 },
  { text: "la", duration: 0.28, begin: 185.800, index: 609 },
  { text: "dı", duration: 0.28, begin: 186.000, index: 610 },
  { text: "ğı", duration: 0.28, begin: 186.200, index: 611 },
  { text: "nı", duration: 0.28, begin: 186.400, index: 612 },
  { text: " dü", duration: 0.28, begin: 186.600, index: 613 },
  { text: "şü", duration: 0.28, begin: 186.800, index: 614 },
  { text: "yor", duration: 0.28, begin: 187.000, index: 615 },
  { text: "du.", duration: 0.28, begin: 187.200, index: 616 },
  { text: " Ar", duration: 0.28, begin: 188.400, index: 617 },
  { text: "tık", duration: 0.28, begin: 188.600, index: 618 },
  { text: " bu", duration: 0.28, begin: 188.800, index: 619 },
  { text: " ih", duration: 0.28, begin: 189.000, index: 620 },
  { text: "ti", duration: 0.28, begin: 189.200, index: 621 },
  { text: "yar", duration: 0.28, begin: 189.400, index: 622 },
  { text: " bu", duration: 0.28, begin: 189.600, index: 623 },
  { text: "nak", duration: 0.28, begin: 189.800, index: 624 },
  { text: "tan", duration: 0.28, begin: 190.000, index: 625 },
  { text: " kur", duration: 0.28, begin: 190.600, index: 626 },
  { text: "tu", duration: 0.28, begin: 190.800, index: 627 },
  { text: "la", duration: 0.28, begin: 191.000, index: 628 },
  { text: "bi", duration: 0.28, begin: 191.200, index: 629 },
  { text: "lir", duration: 0.28, begin: 191.400, index: 630 },
  { text: "di.", duration: 0.28, begin: 191.600, index: 631 },
  { text: " Yaş", duration: 0.28, begin: 192.800, index: 632 },
  { text: "lı", duration: 0.28, begin: 193.000, index: 633 },
  { text: " ka", duration: 0.28, begin: 193.200, index: 634 },
  { text: "dın", duration: 0.28, begin: 193.400, index: 635 },
  { text: " ses", duration: 0.28, begin: 193.600, index: 636 },
  { text: "siz", duration: 0.28, begin: 193.800, index: 637 },
  { text: "ce", duration: 0.28, begin: 194.000, index: 638 },
  { text: " ko", duration: 0.28, begin: 194.600, index: 639 },
  { text: "ca", duration: 0.28, begin: 194.800, index: 640 },
  { text: "sı", duration: 0.28, begin: 195.000, index: 641 },
  { text: "na", duration: 0.28, begin: 195.200, index: 642 },
  { text: " dön", duration: 0.28, begin: 195.400, index: 643 },
  { text: "dü:", duration: 0.28, begin: 195.600, index: 644 },
  { text: " \"Ü", duration: 0.28, begin: 196.600, index: 645 },
  { text: "ni", duration: 0.28, begin: 196.800, index: 646 },
  { text: "ver", duration: 0.28, begin: 197.000, index: 647 },
  { text: "si", duration: 0.28, begin: 197.200, index: 648 },
  { text: "te", duration: 0.28, begin: 197.400, index: 649 },
  { text: " in", duration: 0.28, begin: 197.600, index: 650 },
  { text: "şaa", duration: 0.28, begin: 197.800, index: 651 },
  { text: "tı", duration: 0.28, begin: 198.000, index: 652 },
  { text: "na", duration: 0.28, begin: 198.200, index: 653 },
  { text: " baş", duration: 0.28, begin: 198.600, index: 654 },
  { text: "la", duration: 0.28, begin: 198.800, index: 655 },
  { text: "mak", duration: 0.28, begin: 199.000, index: 656 },
  { text: " i", duration: 0.28, begin: 199.200, index: 657 },
  { text: "çin", duration: 0.28, begin: 199.400, index: 658 },
  { text: " ge", duration: 0.28, begin: 200.200, index: 659 },
  { text: "re", duration: 0.28, begin: 200.400, index: 660 },
  { text: "ken", duration: 0.28, begin: 200.600, index: 661 },
  { text: " pa", duration: 0.28, begin: 200.800, index: 662 },
  { text: "ra", duration: 0.28, begin: 201.000, index: 663 },
  { text: " bu", duration: 0.28, begin: 201.200, index: 664 },
  { text: " muy", duration: 0.28, begin: 201.400, index: 665 },
  { text: "muş?", duration: 0.28, begin: 201.600, index: 666 },
  { text: " Pe", duration: 0.28, begin: 203.000, index: 667 },
  { text: "ki,", duration: 0.28, begin: 203.200, index: 668 },
  { text: " ni", duration: 0.28, begin: 204.000, index: 669 },
  { text: "çin", duration: 0.28, begin: 204.200, index: 670 },
  { text: " biz", duration: 0.28, begin: 204.400, index: 671 },
  { text: " ken", duration: 0.28, begin: 204.800, index: 672 },
  { text: "di", duration: 0.28, begin: 205.000, index: 673 },
  { text: " ü", duration: 0.28, begin: 205.400, index: 674 },
  { text: "ni", duration: 0.28, begin: 205.600, index: 675 },
  { text: "ver", duration: 0.28, begin: 205.800, index: 676 },
  { text: "si", duration: 0.28, begin: 206.000, index: 677 },
  { text: "te", duration: 0.28, begin: 206.200, index: 678 },
  { text: "mi", duration: 0.28, begin: 206.400, index: 679 },
  { text: "zi", duration: 0.28, begin: 206.600, index: 680 },
  { text: " kur", duration: 0.28, begin: 206.800, index: 681 },
  { text: "mu", duration: 0.28, begin: 207.000, index: 682 },
  { text: "yo", duration: 0.28, begin: 207.200, index: 683 },
  { text: "ruz?\"", duration: 0.28, begin: 207.400, index: 684 },
  { text: " Rek", duration: 0.28, begin: 208.600, index: 685 },
  { text: "tö", duration: 0.28, begin: 208.800, index: 686 },
  { text: "rün", duration: 0.28, begin: 209.000, index: 687 },
  { text: " yü", duration: 0.28, begin: 209.400, index: 688 },
  { text: "zü", duration: 0.28, begin: 209.600, index: 689 },
  { text: " kar", duration: 0.28, begin: 209.800, index: 690 },
  { text: "ma", duration: 0.28, begin: 210.000, index: 691 },
  { text: " ka", duration: 0.28, begin: 210.200, index: 692 },
  { text: "rı", duration: 0.28, begin: 210.400, index: 693 },
  { text: "şık", duration: 0.28, begin: 210.600, index: 694 },
  { text: "tı.", duration: 0.28, begin: 210.800, index: 695 },
  { text: " Yaş", duration: 0.28, begin: 211.800, index: 696 },
  { text: "lı", duration: 0.28, begin: 212.000, index: 697 },
  { text: " a", duration: 0.28, begin: 212.200, index: 698 },
  { text: "dam", duration: 0.28, begin: 212.400, index: 699 },
  { text: " ba", duration: 0.28, begin: 213.000, index: 700 },
  { text: "şıy", duration: 0.28, begin: 213.200, index: 701 },
  { text: "la", duration: 0.28, begin: 213.400, index: 702 },
  { text: " o", duration: 0.28, begin: 213.600, index: 703 },
  { text: "nay", duration: 0.28, begin: 213.800, index: 704 },
  { text: "la", duration: 0.28, begin: 214.000, index: 705 },
  { text: "dı.", duration: 0.28, begin: 214.200, index: 706 },
  { text: " Bay", duration: 0.28, begin: 215.400, index: 707 },
  { text: " ve", duration: 0.28, begin: 215.600, index: 708 },
  { text: " Ba", duration: 0.28, begin: 215.800, index: 709 },
  { text: "yan", duration: 0.28, begin: 216.000, index: 710 },
  { text: " Le", duration: 0.28, begin: 216.400, index: 711 },
  { text: "land", duration: 0.28, begin: 216.600, index: 712 },
  { text: " Stan", duration: 0.28, begin: 217.000, index: 713 },
  { text: "ford", duration: 0.28, begin: 217.200, index: 714 },
  { text: " dı", duration: 0.28, begin: 218.000, index: 715 },
  { text: "şa", duration: 0.28, begin: 218.200, index: 716 },
  { text: "rı", duration: 0.28, begin: 218.400, index: 717 },
  { text: " çık", duration: 0.28, begin: 218.600, index: 718 },
  { text: "tı", duration: 0.28, begin: 218.800, index: 719 },
  { text: "lar.", duration: 0.28, begin: 219.000, index: 720 },
  { text: " Ve", duration: 0.28, begin: 220.000, index: 721 },
  { text: " Har", duration: 0.28, begin: 220.200, index: 722 },
  { text: "ward'", duration: 0.28, begin: 220.400, index: 723 },
  { text: "ın", duration: 0.28, begin: 220.600, index: 724 },
  { text: " u", duration: 0.10, begin: 221.200, index: 725 },
  { text: "mur", duration: 0.10, begin: 221.400, index: 726 },
  { text: "sa", duration: 0.10, begin: 221.600, index: 727 },
  { text: "ma", duration: 0.10, begin: 221.800, index: 728 },
  { text: "dı", duration: 0.10, begin: 222.000, index: 729 },
  { text: "ğı", duration: 0.10, begin: 222.200, index: 730 },
  { text: " o", duration: 0.10, begin: 222.400, index: 731 },
  { text: "ğul", duration: 0.10, begin: 222.600, index: 732 },
  { text: "la", duration: 0.10, begin: 222.800, index: 733 },
  { text: "rı", duration: 0.10, begin: 223.000, index: 734 },
  { text: " i", duration: 0.10, begin: 223.200, index: 735 },
  { text: "çin", duration: 0.10, begin: 223.400, index: 736 },
  { text: " o", duration: 0.28, begin: 223.800, index: 737 },
  { text: "nun", duration: 0.28, begin: 224.000, index: 738 },
  { text: " a", duration: 0.28, begin: 224.200, index: 739 },
  { text: "dı", duration: 0.28, begin: 224.400, index: 740 },
  { text: "nı", duration: 0.28, begin: 224.600, index: 741 },
  { text: " e", duration: 0.28, begin: 225.000, index: 742 },
  { text: "be", duration: 0.28, begin: 225.200, index: 743 },
  { text: "di", duration: 0.28, begin: 225.400, index: 744 },
  { text: "yen", duration: 0.28, begin: 225.600, index: 745 },
  { text: " ya", duration: 0.28, begin: 225.800, index: 746 },
  { text: "şa", duration: 0.28, begin: 226.000, index: 747 },
  { text: "ta", duration: 0.28, begin: 226.200, index: 748 },
  { text: "cak", duration: 0.28, begin: 226.400, index: 749 },
  { text: " ü", duration: 0.28, begin: 226.800, index: 750 },
  { text: "ni", duration: 0.28, begin: 227.000, index: 751 },
  { text: "ver", duration: 0.28, begin: 227.200, index: 752 },
  { text: "si", duration: 0.28, begin: 227.400, index: 753 },
  { text: "te", duration: 0.28, begin: 227.600, index: 754 },
  { text: "yi", duration: 0.28, begin: 227.800, index: 755 },
  { text: " kur", duration: 0.28, begin: 228.000, index: 756 },
  { text: "du", duration: 0.28, begin: 228.200, index: 757 },
  { text: "lar.", duration: 0.28, begin: 228.400, index: 758 },
  { text: " A", duration: 0.28, begin: 229.400, index: 759 },
  { text: "me", duration: 0.28, begin: 229.600, index: 760 },
  { text: "ri", duration: 0.28, begin: 229.800, index: 761 },
  { text: "ka'", duration: 0.28, begin: 230.000, index: 762 },
  { text: "nın", duration: 0.28, begin: 230.200, index: 763 },
  { text: " en", duration: 0.28, begin: 230.600, index: 764 },
  { text: " ö", duration: 0.28, begin: 230.800, index: 765 },
  { text: "nem", duration: 0.28, begin: 231.000, index: 766 },
  { text: "li", duration: 0.28, begin: 231.200, index: 767 },
  { text: " ü", duration: 0.28, begin: 231.400, index: 768 },
  { text: "ni", duration: 0.28, begin: 231.600, index: 769 },
  { text: "ver", duration: 0.28, begin: 231.800, index: 770 },
  { text: "si", duration: 0.28, begin: 232.000, index: 771 },
  { text: "te", duration: 0.28, begin: 232.200, index: 772 },
  { text: "le", duration: 0.28, begin: 232.400, index: 773 },
  { text: "rin", duration: 0.28, begin: 232.600, index: 774 },
  { text: "den", duration: 0.28, begin: 232.800, index: 775 },
  { text: " bi", duration: 0.28, begin: 233.000, index: 776 },
  { text: "ri", duration: 0.28, begin: 233.200, index: 777 },
  { text: "si", duration: 0.28, begin: 233.400, index: 778 },
  { text: " o", duration: 0.28, begin: 233.600, index: 779 },
  { text: "lan", duration: 0.28, begin: 233.800, index: 780 },
  { text: " S", duration: 0.28, begin: 235.000, index: 781 },
  { text: "tan", duration: 0.28, begin: 235.200, index: 782 },
  { text: "ford'", duration: 0.28, begin: 235.400, index: 783 },
  { text: "u...", duration: 0.28, begin: 235.600, index: 784 }
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
  <Link href="/dashboard/stories/bir-hayir-vardir" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/bagislamanin-yuceligi" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/4-6.mp3"
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