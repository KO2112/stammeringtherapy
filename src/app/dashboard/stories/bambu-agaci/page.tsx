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
  { text: "Bam", duration: 0.53, begin: 0.500, index: 1, isTitle: true, isCenter: true },
  { text: "bu", duration: 0.53, begin: 0.750, index: 2, isTitle: true, isCenter: true },
  { text: " A", duration: 0.53, begin: 1.000, index: 3, isTitle: true, isCenter: true },
  { text: "ğa", duration: 0.53, begin: 1.250, index: 4, isTitle: true, isCenter: true },
  { text: "cı", duration: 0.53, begin: 1.500, index: 5, isTitle: true, isCenter: true },
  
  // Story content
  { text: " Bam", duration: 0.53, begin: 2.500, index: 6 },
  { text: "bu", duration: 0.53, begin: 2.750, index: 7 },
  { text: " a", duration: 0.53, begin: 3.000, index: 8 },
  { text: "ğa", duration: 0.53, begin: 3.250, index: 9 },
  { text: "cı", duration: 0.53, begin: 3.500, index: 10 },
  { text: " sa", duration: 0.38, begin: 4.250, index: 11 },
  { text: "de", duration: 0.38, begin: 4.500, index: 12 },
  { text: "ce", duration: 0.38, begin: 4.750, index: 13 },
  { text: " Çin'", duration: 0.53, begin: 5.000, index: 14 },
  { text: "de", duration: 0.53, begin: 5.250, index: 15 },
  { text: " ye", duration: 0.38, begin: 5.500, index: 16 },
  { text: "ti", duration: 0.38, begin: 5.750, index: 17 },
  { text: "şi", duration: 0.38, begin: 6.000, index: 18 },
  { text: "yor.", duration: 0.38, begin: 6.250, index: 19 },
  { text: " Pe", duration: 0.38, begin: 7.250, index: 20 },
  { text: "ki,", duration: 0.38, begin: 7.500, index: 21 },
  { text: " Tür", duration: 0.53, begin: 8.000, index: 22 },
  { text: "ki", duration: 0.53, begin: 8.250, index: 23 },
  { text: "ye'", duration: 0.53, begin: 8.500, index: 24 },
  { text: "de", duration: 0.53, begin: 8.750, index: 25 },
  { text: " ye", duration: 0.48, begin: 9.000, index: 26 },
  { text: "ti", duration: 0.48, begin: 9.250, index: 27 },
  { text: "şe", duration: 0.48, begin: 9.500, index: 28 },
  { text: "mez", duration: 0.48, begin: 9.750, index: 29 },
  { text: " mi?", duration: 0.48, begin: 10.000, index: 30 },
  { text: " Bel", duration: 0.53, begin: 11.000, index: 31 },
  { text: "ki", duration: 0.53, begin: 11.250, index: 32 },
  { text: " ik", duration: 0.53, begin: 12.250, index: 33 },
  { text: "lim", duration: 0.53, begin: 12.500, index: 34 },
  { text: " ö", duration: 0.38, begin: 12.750, index: 35 },
  { text: "zel", duration: 0.38, begin: 13.000, index: 36 },
  { text: "lik", duration: 0.38, begin: 13.250, index: 37 },
  { text: "le", duration: 0.38, begin: 13.500, index: 38 },
  { text: "ri", duration: 0.38, begin: 13.750, index: 39 },
  { text: " o", duration: 0.53, begin: 14.000, index: 40 },
  { text: "la", duration: 0.53, begin: 14.250, index: 41 },
  { text: "rak", duration: 0.53, begin: 14.500, index: 42 },
  { text: " ba", duration: 0.38, begin: 15.250, index: 43 },
  { text: "zı", duration: 0.38, begin: 15.500, index: 44 },
  { text: " yö", duration: 0.28, begin: 15.750, index: 45 },
  { text: "re", duration: 0.28, begin: 16.000, index: 46 },
  { text: "le", duration: 0.28, begin: 16.250, index: 47 },
  { text: "ri", duration: 0.28, begin: 16.500, index: 48 },
  { text: "miz", duration: 0.28, begin: 16.750, index: 49 },
  { text: "de", duration: 0.28, begin: 16.850, index: 50 },
  { text: " ye", duration: 0.53, begin: 17.000, index: 51 },
  { text: "ti", duration: 0.53, begin: 17.250, index: 52 },
  { text: "şe", duration: 0.53, begin: 17.500, index: 53 },
  { text: "bi", duration: 0.53, begin: 17.750, index: 54 },
  { text: "lir.", duration: 0.53, begin: 18.000, index: 55 },
  { text: " Yal", duration: 0.53, begin: 18.750, index: 56 },
  { text: "nız", duration: 0.53, begin: 19.000, index: 57 },
  { text: " bir", duration: 0.53, begin: 19.250, index: 58 },
  { text: " şar", duration: 0.53, begin: 19.500, index: 59 },
  { text: "tı", duration: 0.53, begin: 19.750, index: 60 },
  { text: " ha", duration: 0.53, begin: 20.500, index: 61 },
  { text: "tır", duration: 0.53, begin: 20.750, index: 62 },
  { text: "lat", duration: 0.68, begin: 21.000, index: 63 },
  { text: "mak", duration: 0.68, begin: 21.250, index: 64 },
  { text: " la", duration: 0.68, begin: 21.500, index: 65 },
  { text: "zım", duration: 0.68, begin: 21.750, index: 66 },
  { text: " ki,", duration: 0.68, begin: 22.000, index: 67 },
  { text: " Çin", duration: 0.53, begin: 23.750, index: 68 },
  { text: " bam", duration: 0.53, begin: 24.000, index: 69 },
  { text: "bu", duration: 0.53, begin: 24.250, index: 70 },
  { text: " a", duration: 0.53, begin: 24.500, index: 71 },
  { text: "ğa", duration: 0.53, begin: 24.750, index: 72 },
  { text: "cı", duration: 0.53, begin: 25.000, index: 73 },
  { text: " sa", duration: 0.53, begin: 25.750, index: 74 },
  { text: "bır", duration: 0.53, begin: 26.000, index: 75 },
  { text: " ve", duration: 0.53, begin: 26.250, index: 76 },
  { text: " se", duration: 0.53, begin: 26.750, index: 77 },
  { text: "bat", duration: 0.53, begin: 27.000, index: 78 },
  { text: " ge", duration: 0.53, begin: 27.250, index: 79 },
  { text: "rek", duration: 0.53, begin: 27.500, index: 80 },
  { text: "ti", duration: 0.53, begin: 27.750, index: 81 },
  { text: "ren", duration: 0.53, begin: 28.000, index: 82 },
  { text: " bir", duration: 0.53, begin: 28.250, index: 83 },
  { text: " a", duration: 0.53, begin: 28.500, index: 84 },
  { text: "ğaç", duration: 0.53, begin: 28.750, index: 85 },
  { text: "tır.", duration: 0.53, begin: 29.000, index: 86 },
  { text: " O", duration: 0.53, begin: 30.750, index: 87 },
  { text: "nu", duration: 0.53, begin: 31.000, index: 88 },
  { text: " ye", duration: 0.53, begin: 31.250, index: 89 },
  { text: "tiş", duration: 0.53, begin: 31.500, index: 90 },
  { text: "ti", duration: 0.53, begin: 31.750, index: 91 },
  { text: "rir", duration: 0.53, begin: 32.000, index: 92 },
  { text: "ken", duration: 0.53, begin: 32.250, index: 93 },
  { text: " çok", duration: 0.53, begin: 33.250, index: 94 },
  { text: " a", duration: 0.53, begin: 33.500, index: 95 },
  { text: "ma", duration: 0.53, begin: 34.000, index: 96 },
  { text: " çok", duration: 0.68, begin: 34.250, index: 97 },
  { text: " sab", duration: 0.68, begin: 34.500, index: 98 },
  { text: "ret", duration: 0.68, begin: 34.750, index: 99 },
  { text: "mek", duration: 0.68, begin: 35.000, index: 100 },
  { text: " ge", duration: 0.53, begin: 35.750, index: 101 },
  { text: "re", duration: 0.53, begin: 36.000, index: 102 },
  { text: "kir.", duration: 0.53, begin: 36.250, index: 103 },
  { text: " Top", duration: 0.53, begin: 37.500, index: 104 },
  { text: "ra", duration: 0.53, begin: 37.750, index: 105 },
  { text: "ğa", duration: 0.53, begin: 38.000, index: 106 },
  { text: " buğ", duration: 0.53, begin: 38.250, index: 107 },
  { text: "day", duration: 0.53, begin: 38.500, index: 108 },
  { text: " ve", duration: 0.68, begin: 38.750, index: 109 },
  { text: "ya", duration: 0.68, begin: 39.000, index: 110 },
  { text: " no", duration: 0.68, begin: 40.250, index: 111 },
  { text: "hut,", duration: 0.68, begin: 40.500, index: 112 },
  { text: " fa", duration: 0.53, begin: 41.500, index: 113 },
  { text: "sul", duration: 0.53, begin: 41.750, index: 114 },
  { text: "ye", duration: 0.53, begin: 42.000, index: 115 },
  { text: " ek", duration: 0.68, begin: 42.250, index: 116 },
  { text: "ti", duration: 0.68, begin: 42.500, index: 117 },
  { text: "ği", duration: 0.68, begin: 42.750, index: 118 },
  { text: "niz", duration: 0.68, begin: 43.000, index: 119 },
  { text: "de", duration: 0.68, begin: 43.250, index: 120 },
  { text: " bun", duration: 0.53, begin: 44.500, index: 121 },
  { text: "la", duration: 0.53, begin: 44.750, index: 122 },
  { text: "rın", duration: 0.53, begin: 45.000, index: 123 },
  { text: " çim", duration: 0.68, begin: 45.250, index: 124 },
  { text: "len", duration: 0.68, begin: 45.500, index: 125 },
  { text: "me", duration: 0.68, begin: 45.750, index: 126 },
  { text: "si", duration: 0.68, begin: 46.000, index: 127 },
  { text: " çok", duration: 0.53, begin: 47.250, index: 128 },
  { text: " kı", duration: 0.53, begin: 47.500, index: 129 },
  { text: "sa", duration: 0.53, begin: 47.750, index: 130 },
  { text: " sü", duration: 0.53, begin: 48.000, index: 131 },
  { text: "rer.", duration: 0.53, begin: 48.250, index: 132 },
  { text: " On", duration: 0.53, begin: 49.750, index: 133 },
  { text: " Beş", duration: 0.53, begin: 50.000, index: 134 },
  { text: " gün,", duration: 0.53, begin: 50.250, index: 135 },
  { text: " bir", duration: 0.53, begin: 51.500, index: 136 },
  { text: " ay", duration: 0.53, begin: 51.750, index: 137 },
  { text: " ve", duration: 0.53, begin: 52.750, index: 138 },
  { text: "ya", duration: 0.53, begin: 53.000, index: 139 },
  { text: " en", duration: 0.53, begin: 53.750, index: 140 },
  { text: " geç", duration: 0.53, begin: 54.000, index: 141 },
  { text: " i", duration: 0.23, begin: 55.250, index: 142 },
  { text: "ki", duration: 0.23, begin: 55.500, index: 143 },
  { text: " ay", duration: 0.53, begin: 55.750, index: 144 },
  { text: "da", duration: 0.53, begin: 56.000, index: 145 },
  { text: " fi", duration: 0.53, begin: 56.250, index: 146 },
  { text: "liz", duration: 0.53, begin: 56.500, index: 147 },
  { text: "le", duration: 0.53, begin: 56.750, index: 148 },
  { text: "nip", duration: 0.53, begin: 57.000, index: 149 },
  { text: " bü", duration: 0.28, begin: 57.500, index: 150 },
  { text: "yü", duration: 0.28, begin: 57.750, index: 151 },
  { text: "me", duration: 0.28, begin: 58.000, index: 152 },
  { text: "ye", duration: 0.28, begin: 58.250, index: 153 },
  { text: " baş", duration: 0.28, begin: 58.500, index: 154 },
  { text: "lar.", duration: 0.28, begin: 58.750, index: 155 },
  { text: " E", duration: 0.53, begin: 59.500, index: 156 },
  { text: "mek", duration: 0.53, begin: 59.750, index: 157 },
  { text: " ve", duration: 0.48, begin: 60.250, index: 158 },
  { text: "ren", duration: 0.48, begin: 60.500, index: 159 },
  { text: "le", duration: 0.48, begin: 60.750, index: 160 },
  { text: "rin", duration: 0.48, begin: 61.000, index: 161 },
  { text: " he", duration: 0.53, begin: 61.750, index: 162 },
  { text: "men", duration: 0.53, begin: 62.000, index: 163 },
  { text: " yüz", duration: 0.53, begin: 62.250, index: 164 },
  { text: "le", duration: 0.53, begin: 62.500, index: 165 },
  { text: "ri", duration: 0.53, begin: 62.750, index: 166 },
  { text: "ni", duration: 0.53, begin: 63.000, index: 167 },
  { text: " gül", duration: 0.53, begin: 63.250, index: 168 },
  { text: "dü", duration: 0.53, begin: 63.500, index: 169 },
  { text: "rür", duration: 0.53, begin: 63.750, index: 170 },
  { text: "ler.", duration: 0.53, begin: 64.000, index: 171 },
  { text: " Şim", duration: 0.28, begin: 66.000, index: 172 },
  { text: "di", duration: 0.28, begin: 66.250, index: 173 },
  { text: "de", duration: 0.28, begin: 66.500, index: 174 },
  { text: " Çin", duration: 0.53, begin: 67.250, index: 175 },
  { text: " bam", duration: 0.53, begin: 67.500, index: 176 },
  { text: "bu", duration: 0.53, begin: 67.750, index: 177 },
  { text: " a", duration: 0.53, begin: 68.000, index: 178 },
  { text: "ğa", duration: 0.53, begin: 68.250, index: 179 },
  { text: "cı", duration: 0.53, begin: 68.500, index: 180 },
  { text: "na", duration: 0.53, begin: 68.750, index: 181 },
  { text: " ge", duration: 0.53, begin: 69.000, index: 182 },
  { text: "le", duration: 0.53, begin: 69.250, index: 183 },
  { text: "lim.", duration: 0.53, begin: 69.500, index: 184 },
  { text: " Bu", duration: 0.28, begin: 70.500, index: 185 },
  { text: "nun", duration: 0.28, begin: 70.750, index: 186 },
  { text: " to", duration: 0.38, begin: 71.250, index: 187 },
  { text: "hu", duration: 0.38, begin: 71.500, index: 188 },
  { text: "mu", duration: 0.38, begin: 71.750, index: 189 },
  { text: "nu", duration: 0.38, begin: 72.000, index: 190 },
  { text: " top", duration: 0.53, begin: 72.500, index: 191 },
  { text: "ra", duration: 0.53, begin: 72.750, index: 192 },
  { text: "ğa", duration: 0.53, begin: 73.000, index: 193 },
  { text: " di", duration: 0.53, begin: 73.250, index: 194 },
  { text: "ki", duration: 0.53, begin: 73.500, index: 195 },
  { text: "yor", duration: 0.53, begin: 73.750, index: 196 },
  { text: "lar.", duration: 0.53, begin: 74.000, index: 197 },
  { text: " Su", duration: 0.53, begin: 75.000, index: 198 },
  { text: "la", duration: 0.53, begin: 75.250, index: 199 },
  { text: "nı", duration: 0.53, begin: 75.500, index: 200 },
  { text: "yor,", duration: 0.53, begin: 75.750, index: 201 },
  { text: " güb", duration: 0.53, begin: 76.500, index: 202 },
  { text: "re", duration: 0.53, begin: 76.750, index: 203 },
  { text: "le", duration: 0.53, begin: 77.000, index: 204 },
  { text: "ni", duration: 0.53, begin: 77.250, index: 205 },
  { text: "yor.", duration: 0.53, begin: 77.500, index: 206 },
  { text: " Üç", duration: 0.53, begin: 78.500, index: 207 },
  { text: " ay", duration: 0.53, begin: 78.750, index: 208 },
  { text: " ge", duration: 0.53, begin: 79.000, index: 209 },
  { text: "çi", duration: 0.53, begin: 79.250, index: 210 },
  { text: "yor,", duration: 0.53, begin: 79.500, index: 211 },
  { text: " fi", duration: 0.53, begin: 80.500, index: 212 },
  { text: "liz", duration: 0.53, begin: 80.750, index: 213 },
  { text: "len", duration: 0.53, begin: 81.000, index: 214 },
  { text: "me", duration: 0.53, begin: 81.250, index: 215 },
  { text: " yok.", duration: 0.53, begin: 81.500, index: 216 },
  { text: " Yi", duration: 0.53, begin: 82.750, index: 217 },
  { text: "ne", duration: 0.53, begin: 83.000, index: 218 },
  { text: " su", duration: 0.53, begin: 83.250, index: 219 },
  { text: "la", duration: 0.53, begin: 83.500, index: 220 },
  { text: "nı", duration: 0.53, begin: 83.750, index: 221 },
  { text: "yor,", duration: 0.53, begin: 84.000, index: 222 },
  { text: " ba", duration: 0.53, begin: 84.750, index: 223 },
  { text: "kı", duration: 0.53, begin: 85.000, index: 224 },
  { text: "mı", duration: 0.53, begin: 85.250, index: 225 },
  { text: " ya", duration: 0.53, begin: 85.500, index: 226 },
  { text: "pı", duration: 0.53, begin: 85.750, index: 227 },
  { text: "lı", duration: 0.53, begin: 86.000, index: 228 },
  { text: "yor.", duration: 0.53, begin: 86.250, index: 229 },
  { text: " Al", duration: 0.53, begin: 87.250, index: 230 },
  { text: "tı", duration: 0.53, begin: 87.500, index: 231 },
  { text: " ay", duration: 0.53, begin: 87.750, index: 232 },
  { text: " ge", duration: 0.53, begin: 88.000, index: 233 },
  { text: "çi", duration: 0.53, begin: 88.250, index: 234 },
  { text: "yor,", duration: 0.53, begin: 88.500, index: 235 },
  { text: " ha", duration: 0.53, begin: 89.500, index: 236 },
  { text: "la", duration: 0.53, begin: 89.750, index: 237 },
  { text: " fi", duration: 0.53, begin: 90.000, index: 238 },
  { text: "liz", duration: 0.53, begin: 90.250, index: 239 },
  { text: "len", duration: 0.53, begin: 90.500, index: 240 },
  { text: "me", duration: 0.53, begin: 90.750, index: 241 },
  { text: " yok.", duration: 0.53, begin: 91.500, index: 242 },
  { text: " Yi", duration: 0.28, begin: 92.750, index: 243 },
  { text: "ne", duration: 0.28, begin: 93.000, index: 244 },
  { text: " su", duration: 0.53, begin: 93.250, index: 245 },
  { text: "la", duration: 0.53, begin: 93.500, index: 246 },
  { text: "nı", duration: 0.53, begin: 93.750, index: 247 },
  { text: "yor,", duration: 0.53, begin: 94.000, index: 248 },
  { text: " ba", duration: 0.53, begin: 94.500, index: 249 },
  { text: "kı", duration: 0.53, begin: 94.750, index: 250 },
  { text: "mı", duration: 0.53, begin: 95.000, index: 251 },
  { text: " ya", duration: 0.53, begin: 95.250, index: 252 },
  { text: "pı", duration: 0.53, begin: 95.500, index: 253 },
  { text: "lı", duration: 0.53, begin: 95.750, index: 254 },
  { text: "yor.", duration: 0.53, begin: 96.000, index: 255 },
  { text: " Fi", duration: 0.53, begin: 97.000, index: 256 },
  { text: "liz", duration: 0.53, begin: 97.250, index: 257 },
  { text: "len", duration: 0.53, begin: 97.500, index: 258 },
  { text: "me", duration: 0.53, begin: 97.750, index: 259 },
  { text: " yok.", duration: 0.53, begin: 98.250, index: 260 },
  { text: " Bir", duration: 0.53, begin: 99.500, index: 261 },
  { text: " se", duration: 0.53, begin: 99.750, index: 262 },
  { text: "ne", duration: 0.53, begin: 100.000, index: 263 },
  { text: " ge", duration: 0.53, begin: 100.250, index: 264 },
  { text: "çi", duration: 0.53, begin: 100.500, index: 265 },
  { text: "yor", duration: 0.53, begin: 100.750, index: 266 },
  { text: " yi", duration: 0.53, begin: 101.500, index: 267 },
  { text: "ne", duration: 0.53, begin: 101.750, index: 268 },
  { text: " yok.", duration: 0.53, begin: 102.000, index: 269 },
  { text: " Ço", duration: 0.53, begin: 103.250, index: 270 },
  { text: "ğu", duration: 0.53, begin: 103.500, index: 271 },
  { text: "muz", duration: 0.53, begin: 103.750, index: 272 },
  { text: " bir", duration: 0.53, begin: 104.500, index: 273 },
  { text: " se", duration: 0.53, begin: 104.750, index: 274 },
  { text: "ne", duration: 0.53, begin: 105.000, index: 275 },
  { text: " geç", duration: 0.53, begin: 105.250, index: 276 },
  { text: "ti", duration: 0.53, begin: 105.500, index: 277 },
  { text: "ği", duration: 0.53, begin: 105.750, index: 278 },
  { text: " hal", duration: 0.53, begin: 106.000, index: 279 },
  { text: "de", duration: 0.53, begin: 106.250, index: 280 },
  { text: " dik", duration: 0.53, begin: 107.500, index: 281 },
  { text: "ti", duration: 0.53, begin: 107.750, index: 282 },
  { text: "ği", duration: 0.53, begin: 108.000, index: 283 },
  { text: "miz", duration: 0.53, begin: 108.250, index: 284 },
  { text: " şey", duration: 0.53, begin: 108.500, index: 285 },
  { text: " fi", duration: 0.53, begin: 109.500, index: 286 },
  { text: "liz", duration: 0.53, begin: 109.750, index: 287 },
  { text: "len", duration: 0.53, begin: 110.000, index: 288 },
  { text: "mi", duration: 0.53, begin: 110.250, index: 289 },
  { text: "yor", duration: 0.53, begin: 110.500, index: 290 },
  { text: "sa", duration: 0.53, begin: 110.750, index: 291 },
  { text: " bı", duration: 0.53, begin: 111.000, index: 292 },
  { text: "ra", duration: 0.53, begin: 111.250, index: 293 },
  { text: "kı", duration: 0.53, begin: 111.500, index: 294 },
  { text: "rız", duration: 0.53, begin: 111.750, index: 295 },
  { text: " ve", duration: 0.53, begin: 112.000, index: 296 },
  { text: " ba", duration: 0.53, begin: 113.250, index: 297 },
  { text: "kı", duration: 0.53, begin: 113.500, index: 298 },
  { text: "mın", duration: 0.53, begin: 113.750, index: 299 },
  { text: "dan", duration: 0.53, begin: 114.000, index: 300 },
  { text: " vaz", duration: 0.53, begin: 114.250, index: 301 },
  { text: "ge", duration: 0.53, begin: 114.500, index: 302 },
  { text: "çe", duration: 0.53, begin: 114.750, index: 303 },
  { text: "riz.", duration: 0.53, begin: 115.000, index: 304 },
  { text: " De", duration: 0.53, begin: 116.250, index: 305 },
  { text: "mek", duration: 0.53, begin: 116.500, index: 306 },
  { text: " ki", duration: 0.53, begin: 116.750, index: 307 },
  { text: " bu", duration: 0.68, begin: 117.000, index: 308 },
  { text: " ye", duration: 0.68, begin: 117.250, index: 309 },
  { text: "tiş", duration: 0.68, begin: 117.500, index: 310 },
  { text: "me", duration: 0.68, begin: 117.750, index: 311 },
  { text: "ye", duration: 0.68, begin: 118.000, index: 312 },
  { text: "cek!", duration: 0.68, begin: 118.250, index: 313 },
  { text: " de", duration: 0.53, begin: 119.500, index: 314 },
  { text: "riz.", duration: 0.53, begin: 119.750, index: 315 },
  { text: " A", duration: 0.53, begin: 120.750, index: 316 },
  { text: "ma", duration: 0.53, begin: 121.000, index: 317 },
  { text: " Çin", duration: 0.53, begin: 121.250, index: 318 },
  { text: "li", duration: 0.53, begin: 121.500, index: 319 },
  { text: "ler", duration: 0.53, begin: 121.750, index: 320 },
  { text: " sa", duration: 0.53, begin: 122.500, index: 321 },
  { text: "bır", duration: 0.53, begin: 122.750, index: 322 },
  { text: "lı", duration: 0.53, begin: 123.000, index: 323 },
  { text: " in", duration: 0.53, begin: 123.250, index: 324 },
  { text: "san", duration: 0.53, begin: 123.500, index: 325 },
  { text: "lar.", duration: 0.53, begin: 123.750, index: 326 },
  { text: " Sa", duration: 0.53, begin: 125.000, index: 327 },
  { text: "bır", duration: 0.53, begin: 125.250, index: 328 },
  { text: "lı", duration: 0.53, begin: 125.500, index: 329 },
  { text: " ol", duration: 0.53, begin: 125.750, index: 330 },
  { text: "duk", duration: 0.53, begin: 126.000, index: 331 },
  { text: "la", duration: 0.53, begin: 126.250, index: 332 },
  { text: "rı,", duration: 0.53, begin: 126.500, index: 333 },
  { text: " çok", duration: 0.53, begin: 127.500, index: 334 },
  { text: " zah", duration: 0.53, begin: 127.750, index: 335 },
  { text: "met", duration: 0.53, begin: 128.000, index: 336 },
  { text: "li", duration: 0.53, begin: 128.250, index: 337 },
  { text: " iş", duration: 0.53, begin: 128.750, index: 338 },
  { text: " o", duration: 0.53, begin: 129.000, index: 339 },
  { text: "lan", duration: 0.53, begin: 129.250, index: 340 },
  { text: " i", duration: 0.53, begin: 130.250, index: 341 },
  { text: "pek", duration: 0.53, begin: 130.500, index: 342 },
  { text: " ü", duration: 0.53, begin: 130.750, index: 343 },
  { text: "re", duration: 0.53, begin: 131.000, index: 344 },
  { text: "ti", duration: 0.53, begin: 131.250, index: 345 },
  { text: "min", duration: 0.53, begin: 131.500, index: 346 },
  { text: "den", duration: 0.53, begin: 131.750, index: 347 },
  { text: " bel", duration: 0.53, begin: 132.000, index: 348 },
  { text: "li...", duration: 0.53, begin: 132.250, index: 349 },
  { text: " Çin", duration: 0.53, begin: 133.750, index: 350 },
  { text: " bam", duration: 0.53, begin: 134.000, index: 351 },
  { text: "bu", duration: 0.53, begin: 134.250, index: 352 },
  { text: " a", duration: 0.53, begin: 134.500, index: 353 },
  { text: "ğa", duration: 0.53, begin: 134.750, index: 354 },
  { text: "cı", duration: 0.53, begin: 135.000, index: 355 },
  { text: " bir", duration: 0.53, begin: 136.250, index: 356 },
  { text: " yıl,", duration: 0.53, begin: 136.500, index: 357 },
  { text: " i", duration: 0.53, begin: 137.500, index: 358 },
  { text: "ki", duration: 0.53, begin: 137.750, index: 359 },
  { text: " yıl,", duration: 0.53, begin: 138.000, index: 360 },
  { text: " üç", duration: 0.53, begin: 139.250, index: 361 },
  { text: " yıl,", duration: 0.53, begin: 139.500, index: 362 },
  { text: " dört", duration: 0.53, begin: 140.500, index: 363 },
  { text: " yıl", duration: 0.53, begin: 140.750, index: 364 },
  { text: " ve", duration: 0.53, begin: 141.000, index: 365 },
  { text: " ni", duration: 0.53, begin: 141.250, index: 366 },
  { text: "ha", duration: 0.53, begin: 141.500, index: 367 },
  { text: "yet", duration: 0.53, begin: 141.750, index: 368 },
  { text: " beş", duration: 0.53, begin: 142.500, index: 369 },
  { text: " yıl", duration: 0.53, begin: 142.750, index: 370 },
  { text: " bo", duration: 0.53, begin: 143.000, index: 371 },
  { text: "yun", duration: 0.53, begin: 143.250, index: 372 },
  { text: "ca", duration: 0.53, begin: 143.500, index: 373 },
  { text: " fi", duration: 0.53, begin: 144.250, index: 374 },
  { text: "liz", duration: 0.53, begin: 144.500, index: 375 },
  { text: "len", duration: 0.53, begin: 144.750, index: 376 },
  { text: "mi", duration: 0.53, begin: 145.000, index: 377 },
  { text: "yor.", duration: 0.53, begin: 145.250, index: 378 },
  { text: " A", duration: 0.53, begin: 146.250, index: 379 },
  { text: "ma", duration: 0.53, begin: 146.500, index: 380 },
  { text: " be", duration: 0.53, begin: 146.750, index: 381 },
  { text: "şin", duration: 0.53, begin: 147.000, index: 382 },
  { text: "ci", duration: 0.53, begin: 147.250, index: 383 },
  { text: " yı", duration: 0.53, begin: 147.500, index: 384 },
  { text: "lın", duration: 0.53, begin: 147.750, index: 385 },
  { text: " so", duration: 0.53, begin: 148.000, index: 386 },
  { text: "nun", duration: 0.53, begin: 148.250, index: 387 },
  { text: "da", duration: 0.53, begin: 148.500, index: 388 },
  { text: " to", duration: 0.53, begin: 149.250, index: 389 },
  { text: "hum", duration: 0.53, begin: 149.500, index: 390 },
  { text: " top", duration: 0.53, begin: 149.750, index: 391 },
  { text: "rak", duration: 0.53, begin: 150.000, index: 392 },
  { text: "tan", duration: 0.53, begin: 150.250, index: 393 },
  { text: " çı", duration: 0.53, begin: 150.500, index: 394 },
  { text: "kı", duration: 0.53, begin: 150.750, index: 395 },
  { text: "yor,", duration: 0.53, begin: 151.000, index: 396 },
  { text: " fi", duration: 0.53, begin: 152.250, index: 397 },
  { text: "liz", duration: 0.53, begin: 152.500, index: 398 },
  { text: "le", duration: 0.53, begin: 152.750, index: 399 },
  { text: "ni", duration: 0.53, begin: 153.000, index: 400 },
  { text: "yor.", duration: 0.53, begin: 153.250, index: 401 },
  { text: " Çin", duration: 0.53, begin: 154.500, index: 402 },
  { text: "li", duration: 0.53, begin: 154.750, index: 403 },
  { text: "ler", duration: 0.53, begin: 155.000, index: 404 },
  { text: " tam", duration: 0.53, begin: 155.750, index: 405 },
  { text: " beş", duration: 0.53, begin: 156.000, index: 406 },
  { text: " yıl", duration: 0.53, begin: 156.250, index: 407 },
  { text: " sab", duration: 0.53, begin: 156.750, index: 408 },
  { text: "re", duration: 0.53, begin: 157.000, index: 409 },
  { text: "di", duration: 0.53, begin: 157.250, index: 410 },
  { text: "yor", duration: 0.53, begin: 157.500, index: 411 },
  { text: "lar.", duration: 0.53, begin: 157.750, index: 412 },
  { text: " Pe", duration: 0.53, begin: 159.000, index: 413 },
  { text: "ki,", duration: 0.53, begin: 159.250, index: 414 },
  { text: " son", duration: 0.53, begin: 160.250, index: 415 },
  { text: "ra", duration: 0.53, begin: 160.500, index: 416 },
  { text: " ne", duration: 0.53, begin: 160.750, index: 417 },
  { text: " o", duration: 0.53, begin: 161.000, index: 418 },
  { text: "lu", duration: 0.53, begin: 161.250, index: 419 },
  { text: "yor", duration: 0.53, begin: 161.500, index: 420 },
  { text: " bi", duration: 0.53, begin: 161.750, index: 421 },
  { text: "li", duration: 0.53, begin: 162.000, index: 422 },
  { text: "yor", duration: 0.53, begin: 162.250, index: 423 },
  { text: " mu", duration: 0.53, begin: 162.500, index: 424 },
  { text: "su", duration: 0.53, begin: 162.750, index: 425 },
  { text: "nuz?", duration: 0.53, begin: 163.000, index: 426 },
  { text: " Al", duration: 0.53, begin: 163.750, index: 427 },
  { text: "tı", duration: 0.53, begin: 164.000, index: 428 },
  { text: " haf", duration: 0.53, begin: 164.250, index: 429 },
  { text: "ta", duration: 0.53, begin: 164.500, index: 430 },
  { text: "da", duration: 0.53, begin: 164.750, index: 431 },
  { text: " Yir", duration: 0.53, begin: 166.000, index: 432 },
  { text: "mi", duration: 0.53, begin: 166.250, index: 433 },
  { text: " ye", duration: 0.53, begin: 166.500, index: 434 },
  { text: "di", duration: 0.53, begin: 166.750, index: 435 },
  { text: " met", duration: 0.53, begin: 167.000, index: 436 },
  { text: "re", duration: 0.53, begin: 167.250, index: 437 },
  { text: " u", duration: 0.53, begin: 167.500, index: 438 },
  { text: "zu", duration: 0.53, begin: 167.750, index: 439 },
  { text: "yor.", duration: 0.53, begin: 168.000, index: 440 },
  { text: " E", duration: 0.53, begin: 169.250, index: 441 },
  { text: "vet,", duration: 0.53, begin: 169.500, index: 442 },
  { text: " yan", duration: 0.53, begin: 170.250, index: 443 },
  { text: "lış", duration: 0.53, begin: 170.500, index: 444 },
  { text: " o", duration: 0.53, begin: 170.750, index: 445 },
  { text: "ku", duration: 0.53, begin: 171.000, index: 446 },
  { text: "ma", duration: 0.53, begin: 171.250, index: 447 },
  { text: "dı", duration: 0.53, begin: 171.500, index: 448 },
  { text: "nız.", duration: 0.53, begin: 171.750, index: 449 },
  { text: " Yir", duration: 0.53, begin: 172.750, index: 450 },
  { text: "mi", duration: 0.53, begin: 173.000, index: 451 },
  { text: " ye", duration: 0.53, begin: 173.250, index: 452 },
  { text: "di", duration: 0.53, begin: 173.500, index: 453 },
  { text: " met", duration: 0.53, begin: 173.750, index: 454 },
  { text: "re", duration: 0.53, begin: 174.000, index: 455 },
  { text: " Şim", duration: 0.53, begin: 175.250, index: 456 },
  { text: "di", duration: 0.53, begin: 175.500, index: 457 },
  { text: " şöy", duration: 0.53, begin: 175.750, index: 458 },
  { text: "le", duration: 0.53, begin: 176.000, index: 459 },
  { text: " bir", duration: 0.53, begin: 176.250, index: 460 },
  { text: " dü", duration: 0.53, begin: 177.000, index: 461 },
  { text: "şü", duration: 0.53, begin: 177.250, index: 462 },
  { text: "ne", duration: 0.53, begin: 177.500, index: 463 },
  { text: "lim:", duration: 0.53, begin: 177.750, index: 464 },
  { text: " Bu", duration: 0.53, begin: 178.500, index: 465 },
  { text: " a", duration: 0.53, begin: 178.750, index: 466 },
  { text: "ğaç", duration: 0.53, begin: 179.000, index: 467 },
  { text: " al", duration: 0.28, begin: 180.000, index: 468 },
  { text: "tı", duration: 0.28, begin: 180.250, index: 469 },
  { text: " haf", duration: 0.48, begin: 180.500, index: 470 },
  { text: "ta", duration: 0.48, begin: 180.750, index: 471 },
  { text: "da", duration: 0.48, begin: 181.000, index: 472 },
  { text: " mı", duration: 0.53, begin: 181.250, index: 473 },
  { text: " bü", duration: 0.53, begin: 181.500, index: 474 },
  { text: "yü", duration: 0.53, begin: 181.750, index: 475 },
  { text: "dü?", duration: 0.53, begin: 182.000, index: 476 },
  { text: " Yok", duration: 0.53, begin: 182.750, index: 477 },
  { text: "sa", duration: 0.53, begin: 183.000, index: 478 },
  { text: " beş", duration: 0.53, begin: 184.000, index: 479 },
  { text: " yıl", duration: 0.53, begin: 184.250, index: 480 },
  { text: " ar", duration: 0.53, begin: 184.500, index: 481 },
  { text: "tı", duration: 0.53, begin: 184.750, index: 482 },
  { text: " al", duration: 0.53, begin: 186.000, index: 483 },
  { text: "tı", duration: 0.53, begin: 186.250, index: 484 },
  { text: " haf", duration: 0.53, begin: 186.500, index: 485 },
  { text: "ta", duration: 0.53, begin: 186.750, index: 486 },
  { text: "da", duration: 0.53, begin: 187.000, index: 487 },
  { text: " mı?", duration: 0.53, begin: 187.250, index: 488 },
  { text: " E", duration: 0.53, begin: 188.500, index: 489 },
  { text: "vet,", duration: 0.53, begin: 188.750, index: 490 },
  { text: " sa", duration: 0.53, begin: 189.750, index: 491 },
  { text: "bır", duration: 0.53, begin: 190.000, index: 492 },
  { text: " ve", duration: 0.53, begin: 190.250, index: 493 },
  { text: " se", duration: 0.53, begin: 190.500, index: 494 },
  { text: "bat", duration: 0.53, begin: 190.750, index: 495 },
  { text: " öy", duration: 0.53, begin: 191.500, index: 496 },
  { text: "le", duration: 0.53, begin: 191.750, index: 497 },
  { text: " bir", duration: 0.53, begin: 192.000, index: 498 },
  { text: " tıl", duration: 0.53, begin: 192.250, index: 499 },
  { text: "sım", duration: 0.53, begin: 192.500, index: 500 },
  { text: "dır", duration: 0.53, begin: 192.750, index: 501 },
  { text: " ki,", duration: 0.53, begin: 193.000, index: 502 },
  { text: " ken", duration: 0.53, begin: 194.250, index: 503 },
  { text: "di", duration: 0.53, begin: 194.500, index: 504 },
  { text: "ni", duration: 0.53, begin: 194.750, index: 505 },
  { text: " ye", duration: 0.53, begin: 195.000, index: 506 },
  { text: "nen", duration: 0.53, begin: 195.250, index: 507 },
  { text: " ka", duration: 0.53, begin: 195.500, index: 508 },
  { text: "za", duration: 0.53, begin: 195.750, index: 509 },
  { text: "nır,", duration: 0.53, begin: 196.000, index: 510 },
  { text: " ken", duration: 0.53, begin: 197.000, index: 511 },
  { text: "di", duration: 0.53, begin: 197.250, index: 512 },
  { text: "ne", duration: 0.53, begin: 197.500, index: 513 },
  { text: " ye", duration: 0.53, begin: 197.750, index: 514 },
  { text: "ni", duration: 0.53, begin: 198.000, index: 515 },
  { text: "len", duration: 0.53, begin: 198.250, index: 516 },
  { text: " kay", duration: 0.53, begin: 198.500, index: 517 },
  { text: "be", duration: 0.53, begin: 198.750, index: 518 },
  { text: "der.", duration: 0.53, begin: 199.000, index: 519 },
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
  <Link href="/dashboard/stories/sirkin-kapisindan-dondugum-gece" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/affetmenin-hafifligi" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/2-5.mp3"
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