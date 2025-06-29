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
  { text: "Fır", duration: 0.28, begin: 0.550, index: 1, isTitle: true, isCenter: true },
  { text: "tı", duration: 0.28, begin: 0.750, index: 2, isTitle: true, isCenter: true },
  { text: "na", duration: 0.28, begin: 0.950, index: 3, isTitle: true, isCenter: true },
  { text: " Çık", duration: 0.28, begin: 1.150, index: 4, isTitle: true, isCenter: true },
  { text: "tı", duration: 0.28, begin: 1.350, index: 5, isTitle: true, isCenter: true },
  { text: "ğın", duration: 0.28, begin: 1.550, index: 6, isTitle: true, isCenter: true },
  { text: "da", duration: 0.28, begin: 1.750, index: 7, isTitle: true, isCenter: true },
  { text: " U", duration: 0.28, begin: 1.950, index: 8, isTitle: true, isCenter: true },
  { text: "yu", duration: 0.28, begin: 2.150, index: 9, isTitle: true, isCenter: true },
  { text: "ya", duration: 0.28, begin: 2.350, index: 10, isTitle: true, isCenter: true },
  { text: "bi", duration: 0.28, begin: 2.550, index: 11, isTitle: true, isCenter: true },
  { text: "li", duration: 0.28, begin: 2.750, index: 12, isTitle: true, isCenter: true },
  { text: "rim", duration: 0.28, begin: 2.950, index: 13, isTitle: true, isCenter: true },

  // Story content
  { text: " Yıl", duration: 0.28, begin: 3.950, index: 14 },
  { text: "lar", duration: 0.28, begin: 4.150, index: 15 },
  { text: " ön", duration: 0.28, begin: 4.350, index: 16 },
  { text: "ce", duration: 0.28, begin: 4.550, index: 17 },
  { text: " bir", duration: 0.28, begin: 4.750, index: 18 },
  { text: " çift", duration: 0.28, begin: 5.150, index: 19 },
  { text: "çi,", duration: 0.28, begin: 5.350, index: 20 },
  { text: " fır", duration: 0.28, begin: 6.150, index: 21 },
  { text: "tı", duration: 0.28, begin: 6.350, index: 22 },
  { text: "na", duration: 0.28, begin: 6.550, index: 23 },
  { text: "sı", duration: 0.28, begin: 6.750, index: 24 },
  { text: " bol", duration: 0.28, begin: 6.950, index: 25 },
  { text: " o", duration: 0.28, begin: 7.150, index: 26 },
  { text: "lan", duration: 0.28, begin: 7.350, index: 27 },
  { text: " bir", duration: 0.28, begin: 7.950, index: 28 },
  { text: " te", duration: 0.28, begin: 8.150, index: 29 },
  { text: "pe", duration: 0.28, begin: 8.350, index: 30 },
  { text: "de", duration: 0.28, begin: 8.550, index: 31 },
  { text: " bir", duration: 0.33, begin: 9.350, index: 32 },
  { text: " çift", duration: 0.33, begin: 9.750, index: 33 },
  { text: "lik", duration: 0.33, begin: 9.950, index: 34 },
  { text: " sa", duration: 0.33, begin: 10.350, index: 35 },
  { text: "tın", duration: 0.33, begin: 10.550, index: 36 },
  { text: " al", duration: 0.33, begin: 10.750, index: 37 },
  { text: "mış", duration: 0.33, begin: 10.950, index: 38 },
  { text: "tı.", duration: 0.33, begin: 11.150, index: 39 },
  { text: " Yer", duration: 0.28, begin: 12.500, index: 40 },
  { text: "leş", duration: 0.28, begin: 12.750, index: 41 },
  { text: "tik", duration: 0.28, begin: 13.000, index: 42 },
  { text: "ten", duration: 0.28, begin: 13.250, index: 43 },
  { text: " son", duration: 0.28, begin: 13.500, index: 44 },
  { text: "ra", duration: 0.28, begin: 13.750, index: 45 },
  { text: " ilk", duration: 0.28, begin: 14.750, index: 46 },
  { text: " i", duration: 0.28, begin: 15.000, index: 47 },
  { text: "şi", duration: 0.28, begin: 15.250, index: 48 },
  { text: " bir", duration: 0.28, begin: 15.500, index: 49 },
  { text: " yar", duration: 0.28, begin: 15.750, index: 50 },
  { text: "dım", duration: 0.28, begin: 16.000, index: 51 },
  { text: "cı", duration: 0.28, begin: 16.250, index: 52 },
  { text: " a", duration: 0.28, begin: 16.500, index: 53 },
  { text: "ra", duration: 0.28, begin: 16.750, index: 54 },
  { text: "mak", duration: 0.28, begin: 17.000, index: 55 },
  { text: " ol", duration: 0.28, begin: 17.250, index: 56 },
  { text: "du.", duration: 0.28, begin: 17.500, index: 57 },
  { text: " A", duration: 0.28, begin: 18.500, index: 58 },
  { text: "ma", duration: 0.28, begin: 18.750, index: 59 },
  { text: " ne", duration: 0.28, begin: 19.000, index: 60 },
  { text: " ya", duration: 0.28, begin: 19.250, index: 61 },
  { text: "kı", duration: 0.28, begin: 19.500, index: 62 },
  { text: "nın", duration: 0.28, begin: 19.750, index: 63 },
  { text: "da", duration: 0.28, begin: 20.000, index: 64 },
  { text: "ki", duration: 0.28, begin: 20.250, index: 65 },
  { text: " köy", duration: 0.28, begin: 20.500, index: 66 },
  { text: "ler", duration: 0.28, begin: 20.750, index: 67 },
  { text: "den", duration: 0.28, begin: 21.000, index: 68 },
  { text: " ne", duration: 0.28, begin: 21.500, index: 69 },
  { text: " de", duration: 0.28, begin: 21.750, index: 70 },
  { text: " u", duration: 0.28, begin: 22.000, index: 71 },
  { text: "zak", duration: 0.28, begin: 22.250, index: 72 },
  { text: "ta", duration: 0.28, begin: 22.500, index: 73 },
  { text: "ki", duration: 0.28, begin: 22.750, index: 74 },
  { text: "ler", duration: 0.28, begin: 23.000, index: 75 },
  { text: "den", duration: 0.28, begin: 23.250, index: 76 },
  { text: " kim", duration: 0.28, begin: 23.500, index: 77 },
  { text: "se", duration: 0.28, begin: 23.750, index: 78 },
  { text: " o", duration: 0.28, begin: 24.500, index: 79 },
  { text: "nun", duration: 0.28, begin: 24.750, index: 80 },
  { text: " çift", duration: 0.28, begin: 25.000, index: 81 },
  { text: "li", duration: 0.28, begin: 25.250, index: 82 },
  { text: "ğin", duration: 0.28, begin: 25.500, index: 83 },
  { text: "de", duration: 0.28, begin: 25.750, index: 84 },
  { text: " ça", duration: 0.28, begin: 26.000, index: 85 },
  { text: "lış", duration: 0.28, begin: 26.250, index: 86 },
  { text: "mak", duration: 0.28, begin: 26.500, index: 87 },
  { text: " is", duration: 0.28, begin: 27.000, index: 88 },
  { text: "te", duration: 0.28, begin: 27.250, index: 89 },
  { text: "mi", duration: 0.28, begin: 27.500, index: 90 },
  { text: "yor", duration: 0.28, begin: 27.750, index: 91 },
  { text: "du.", duration: 0.28, begin: 28.000, index: 92 },
  { text: " İş", duration: 0.28, begin: 29.250, index: 93 },
  { text: " baş", duration: 0.28, begin: 29.550, index: 94 },
  { text: "vu", duration: 0.28, begin: 29.750, index: 95 },
  { text: "ru", duration: 0.28, begin: 29.950, index: 96 },
  { text: "su", duration: 0.28, begin: 30.150, index: 97 },
  { text: "na", duration: 0.28, begin: 30.350, index: 98 },
  { text: " ge", duration: 0.28, begin: 30.550, index: 99 },
  { text: "len", duration: 0.28, begin: 30.750, index: 100 },
  { text: "le", duration: 0.28, begin: 31.000, index: 101 },
  { text: "rin", duration: 0.28, begin: 31.250, index: 102 },
  { text: " hep", duration: 0.28, begin: 31.500, index: 103 },
  { text: "si", duration: 0.28, begin: 31.750, index: 104 },
  { text: " çift", duration: 0.28, begin: 32.750, index: 105 },
  { text: "li", duration: 0.28, begin: 33.000, index: 106 },
  { text: "ğin", duration: 0.28, begin: 33.250, index: 107 },
  { text: " ye", duration: 0.28, begin: 33.500, index: 108 },
  { text: "ri", duration: 0.28, begin: 33.750, index: 109 },
  { text: "ni", duration: 0.28, begin: 34.000, index: 110 },
  { text: " gö", duration: 0.28, begin: 34.250, index: 111 },
  { text: "rün", duration: 0.28, begin: 34.500, index: 112 },
  { text: "ce", duration: 0.28, begin: 34.750, index: 113 },
  { text: " ça", duration: 0.28, begin: 35.250, index: 114 },
  { text: "lış", duration: 0.28, begin: 35.500, index: 115 },
  { text: "mak", duration: 0.28, begin: 35.750, index: 116 },
  { text: "tan", duration: 0.28, begin: 36.000, index: 117 },
  { text: " vaz", duration: 0.28, begin: 36.500, index: 118 },
  { text: "ge", duration: 0.28, begin: 36.750, index: 119 },
  { text: "çi", duration: 0.28, begin: 37.000, index: 120 },
  { text: "yor:", duration: 0.28, begin: 37.250, index: 121 },
  { text: " \"Bu", duration: 0.28, begin: 38.200, index: 122 },
  { text: "ra", duration: 0.28, begin: 38.400, index: 123 },
  { text: "sı", duration: 0.28, begin: 38.600, index: 124 },
  { text: " fır", duration: 0.28, begin: 38.800, index: 125 },
  { text: "tı", duration: 0.28, begin: 39.000, index: 126 },
  { text: "na", duration: 0.28, begin: 39.200, index: 127 },
  { text: "lı", duration: 0.28, begin: 39.400, index: 128 },
  { text: "dır", duration: 0.28, begin: 39.600, index: 129 },
  { text: " siz", duration: 0.28, begin: 40.400, index: 130 },
  { text: "de", duration: 0.28, begin: 40.600, index: 131 },
  { text: " vaz", duration: 0.28, begin: 41.000, index: 132 },
  { text: "geç", duration: 0.28, begin: 41.200, index: 133 },
  { text: "se", duration: 0.28, begin: 41.400, index: 134 },
  { text: "niz", duration: 0.28, begin: 41.600, index: 135 },
  { text: " i", duration: 0.28, begin: 42.000, index: 136 },
  { text: "yi", duration: 0.28, begin: 42.200, index: 137 },
  { text: " o", duration: 0.28, begin: 42.400, index: 138 },
  { text: "lur.\"", duration: 0.28, begin: 42.600, index: 139 },
  { text: " di", duration: 0.28, begin: 43.400, index: 140 },
  { text: "yor", duration: 0.28, begin: 43.600, index: 141 },
  { text: "lar", duration: 0.28, begin: 43.800, index: 142 },
  { text: "dı.", duration: 0.28, begin: 44.000, index: 143 },
  { text: " Ni", duration: 0.28, begin: 45.200, index: 144 },
  { text: "ha", duration: 0.28, begin: 45.400, index: 145 },
  { text: "yet", duration: 0.28, begin: 45.800, index: 146 },
  { text: " çe", duration: 0.28, begin: 46.000, index: 147 },
  { text: "lim", duration: 0.28, begin: 46.200, index: 148 },
  { text: "siz", duration: 0.28, begin: 46.400, index: 149 },
  { text: " or", duration: 0.28, begin: 47.400, index: 150 },
  { text: "ta", duration: 0.28, begin: 47.600, index: 151 },
  { text: " ya", duration: 0.28, begin: 47.800, index: 152 },
  { text: "şı", duration: 0.28, begin: 48.000, index: 153 },
  { text: " geç", duration: 0.28, begin: 48.250, index: 154 },
  { text: "kin", duration: 0.28, begin: 48.500, index: 155 },
  { text: "ce", duration: 0.28, begin: 48.750, index: 156 },
  { text: " bir", duration: 0.28, begin: 49.000, index: 157 },
  { text: " a", duration: 0.28, begin: 49.250, index: 158 },
  { text: "dam", duration: 0.28, begin: 49.500, index: 159 },
  { text: " i", duration: 0.28, begin: 49.750, index: 160 },
  { text: "şi", duration: 0.28, begin: 50.000, index: 161 },
  { text: " ka", duration: 0.28, begin: 50.250, index: 162 },
  { text: "bul", duration: 0.28, begin: 50.500, index: 163 },
  { text: " et", duration: 0.28, begin: 50.750, index: 164 },
  { text: "ti.", duration: 0.28, begin: 51.000, index: 165 },
  { text: " A", duration: 0.28, begin: 52.000, index: 166 },
  { text: "dam", duration: 0.28, begin: 52.250, index: 167 },
  { text: "ın", duration: 0.28, begin: 52.500, index: 168 },
  { text: " ha", duration: 0.28, begin: 52.750, index: 169 },
  { text: "li", duration: 0.28, begin: 53.000, index: 170 },
  { text: "ne", duration: 0.28, begin: 53.250, index: 171 },
  { text: " ba", duration: 0.28, begin: 53.500, index: 172 },
  { text: "kıp:", duration: 0.28, begin: 53.750, index: 173 },
  { text: " \"Çift", duration: 0.28, begin: 54.750, index: 174 },
  { text: "lik", duration: 0.28, begin: 55.000, index: 175 },
  { text: " iş", duration: 0.28, begin: 55.250, index: 176 },
  { text: "le", duration: 0.28, begin: 55.500, index: 177 },
  { text: "rin", duration: 0.28, begin: 55.750, index: 178 },
  { text: "den", duration: 0.28, begin: 56.000, index: 179 },
  { text: " an", duration: 0.28, begin: 56.250, index: 180 },
  { text: "lar", duration: 0.28, begin: 56.500, index: 181 },
  { text: " mı", duration: 0.28, begin: 56.750, index: 182 },
  { text: "sı", duration: 0.28, begin: 57.000, index: 183 },
  { text: "nız?\"", duration: 0.28, begin: 57.250, index: 184 },
  { text: " di", duration: 0.28, begin: 58.000, index: 185 },
  { text: "ye", duration: 0.28, begin: 58.250, index: 186 },
  { text: " sor", duration: 0.28, begin: 58.500, index: 187 },
  { text: "ma", duration: 0.28, begin: 58.750, index: 188 },
  { text: "dan", duration: 0.28, begin: 59.000, index: 189 },
  { text: " e", duration: 0.28, begin: 59.200, index: 190 },
  { text: "de", duration: 0.28, begin: 59.400, index: 191 },
  { text: "me", duration: 0.28, begin: 59.600, index: 192 },
  { text: "di", duration: 0.28, begin: 59.800, index: 193 },
  { text: " çift", duration: 0.28, begin: 60.000, index: 194 },
  { text: "lik", duration: 0.28, begin: 60.200, index: 195 },
  { text: " sa", duration: 0.28, begin: 60.400, index: 196 },
  { text: "hi", duration: 0.28, begin: 60.600, index: 197 },
  { text: "bi.", duration: 0.28, begin: 60.800, index: 198 },
  { text: " \"Sa", duration: 0.28, begin: 62.000, index: 199 },
  { text: "yı", duration: 0.28, begin: 62.200, index: 200 },
  { text: "lır\"", duration: 0.28, begin: 62.400, index: 201 },
  { text: " de", duration: 0.28, begin: 63.000, index: 202 },
  { text: "di", duration: 0.28, begin: 63.200, index: 203 },
  { text: " a", duration: 0.28, begin: 63.600, index: 204 },
  { text: "dam.", duration: 0.28, begin: 63.800, index: 205 },
  { text: " \"Fır", duration: 0.28, begin: 64.800, index: 206 },
  { text: "tı", duration: 0.28, begin: 65.000, index: 207 },
  { text: "na", duration: 0.28, begin: 65.200, index: 208 },
  { text: " çık", duration: 0.28, begin: 65.400, index: 209 },
  { text: "tı", duration: 0.28, begin: 65.600, index: 210 },
  { text: "ğın", duration: 0.28, begin: 65.800, index: 211 },
  { text: "da", duration: 0.28, begin: 66.000, index: 212 },
  { text: " u", duration: 0.28, begin: 66.800, index: 213 },
  { text: "yu", duration: 0.28, begin: 67.000, index: 214 },
  { text: "ya", duration: 0.28, begin: 67.200, index: 215 },
  { text: "bi", duration: 0.28, begin: 67.400, index: 216 },
  { text: "li", duration: 0.28, begin: 67.600, index: 217 },
  { text: "rim.\"", duration: 0.28, begin: 67.800, index: 218 },
  { text: " Bu", duration: 0.28, begin: 69.000, index: 219 },
  { text: " il", duration: 0.28, begin: 69.200, index: 220 },
  { text: "gi", duration: 0.28, begin: 69.400, index: 221 },
  { text: "siz", duration: 0.28, begin: 69.600, index: 222 },
  { text: " sö", duration: 0.28, begin: 69.800, index: 223 },
  { text: "zü", duration: 0.28, begin: 70.000, index: 224 },
  { text: " bi", duration: 0.28, begin: 70.400, index: 225 },
  { text: "raz", duration: 0.28, begin: 70.600, index: 226 },
  { text: " dü", duration: 0.28, begin: 70.800, index: 227 },
  { text: "şün", duration: 0.28, begin: 71.000, index: 228 },
  { text: "dü.", duration: 0.28, begin: 71.200, index: 229 },
  { text: " Son", duration: 0.28, begin: 72.000, index: 230 },
  { text: "ra", duration: 0.28, begin: 72.200, index: 231 },
  { text: " boş", duration: 0.28, begin: 72.400, index: 232 },
  { text: " ve", duration: 0.28, begin: 72.600, index: 233 },
  { text: "rip", duration: 0.28, begin: 72.800, index: 234 },
  { text: " a", duration: 0.28, begin: 73.200, index: 235 },
  { text: "da", duration: 0.28, begin: 73.400, index: 236 },
  { text: "mı", duration: 0.28, begin: 73.600, index: 237 },
  { text: " i", duration: 0.28, begin: 73.800, index: 238 },
  { text: "şe", duration: 0.28, begin: 74.000, index: 239 },
  { text: " al", duration: 0.28, begin: 74.200, index: 240 },
  { text: "dı.", duration: 0.28, begin: 74.400, index: 241 },
  { text: " Haf", duration: 0.28, begin: 75.400, index: 242 },
  { text: "ta", duration: 0.28, begin: 75.600, index: 243 },
  { text: "lar", duration: 0.28, begin: 75.800, index: 244 },
  { text: " geç", duration: 0.28, begin: 76.200, index: 245 },
  { text: "tik", duration: 0.28, begin: 76.400, index: 246 },
  { text: "çe", duration: 0.28, begin: 76.600, index: 247 },
  { text: " a", duration: 0.28, begin: 77.600, index: 248 },
  { text: "da", duration: 0.28, begin: 77.800, index: 249 },
  { text: "mın", duration: 0.28, begin: 78.000, index: 250 },
  { text: " çift", duration: 0.28, begin: 78.400, index: 251 },
  { text: "lik", duration: 0.28, begin: 78.600, index: 252 },
  { text: " iş", duration: 0.28, begin: 79.000, index: 253 },
  { text: "le", duration: 0.28, begin: 79.200, index: 254 },
  { text: "ri", duration: 0.28, begin: 79.400, index: 255 },
  { text: "ni", duration: 0.28, begin: 79.600, index: 256 },
  { text: " dü", duration: 0.28, begin: 79.800, index: 257 },
  { text: "zen", duration: 0.28, begin: 80.000, index: 258 },
  { text: "li", duration: 0.28, begin: 80.200, index: 259 },
  { text: " o", duration: 0.28, begin: 80.600, index: 260 },
  { text: "la", duration: 0.28, begin: 80.800, index: 261 },
  { text: "rak", duration: 0.28, begin: 81.000, index: 262 },
  { text: " yü", duration: 0.28, begin: 81.200, index: 263 },
  { text: "rüt", duration: 0.28, begin: 81.400, index: 264 },
  { text: "tü", duration: 0.28, begin: 81.600, index: 265 },
  { text: "ğü", duration: 0.28, begin: 81.800, index: 266 },
  { text: "nü", duration: 0.28, begin: 82.000, index: 267 },
  { text: "de", duration: 0.28, begin: 82.200, index: 268 },
  { text: " gö", duration: 0.28, begin: 82.400, index: 269 },
  { text: "rün", duration: 0.28, begin: 82.600, index: 270 },
  { text: "ce", duration: 0.28, begin: 82.800, index: 271 },
  { text: " i", duration: 0.28, begin: 83.400, index: 272 },
  { text: "çi", duration: 0.28, begin: 83.600, index: 273 },
  { text: " ra", duration: 0.28, begin: 83.800, index: 274 },
  { text: "hat", duration: 0.28, begin: 84.000, index: 275 },
  { text: "la", duration: 0.28, begin: 84.200, index: 276 },
  { text: "dı.", duration: 0.28, begin: 84.400, index: 277 },
  { text: " Ta", duration: 0.28, begin: 85.600, index: 278 },
  { text: " ki", duration: 0.28, begin: 85.800, index: 279 },
  { text: " o", duration: 0.28, begin: 86.000, index: 280 },
  { text: " fır", duration: 0.28, begin: 86.200, index: 281 },
  { text: "tı", duration: 0.28, begin: 86.400, index: 282 },
  { text: "na", duration: 0.28, begin: 86.600, index: 283 },
  { text: "ya", duration: 0.28, begin: 86.800, index: 284 },
  { text: " ka", duration: 0.28, begin: 87.000, index: 285 },
  { text: "dar.", duration: 0.28, begin: 87.200, index: 286 },
  { text: " Ge", duration: 0.28, begin: 88.400, index: 287 },
  { text: "ce", duration: 0.28, begin: 88.600, index: 288 },
  { text: " ya", duration: 0.28, begin: 88.800, index: 289 },
  { text: "rı", duration: 0.28, begin: 89.000, index: 290 },
  { text: "sı", duration: 0.28, begin: 89.200, index: 291 },
  { text: " fır", duration: 0.28, begin: 90.000, index: 292 },
  { text: "tı", duration: 0.28, begin: 90.200, index: 293 },
  { text: "na", duration: 0.28, begin: 90.400, index: 294 },
  { text: "nın", duration: 0.28, begin: 90.600, index: 295 },
  { text: " o", duration: 0.28, begin: 91.000, index: 296 },
  { text: " müt", duration: 0.28, begin: 91.200, index: 297 },
  { text: "hiş", duration: 0.28, begin: 91.400, index: 298 },
  { text: " u", duration: 0.28, begin: 91.600, index: 299 },
  { text: "ğul", duration: 0.28, begin: 91.800, index: 300 },
  { text: "tu", duration: 0.28, begin: 92.000, index: 301 },
  { text: "suy", duration: 0.28, begin: 92.200, index: 302 },
  { text: "la", duration: 0.28, begin: 92.400, index: 303 },
  { text: " u", duration: 0.28, begin: 92.800, index: 304 },
  { text: "yan", duration: 0.28, begin: 93.000, index: 305 },
  { text: "dı.", duration: 0.28, begin: 93.200, index: 306 },
  { text: " Öy", duration: 0.28, begin: 94.400, index: 307 },
  { text: "le", duration: 0.28, begin: 94.600, index: 308 },
  { text: " ki,", duration: 0.28, begin: 94.800, index: 309 },
  { text: " bi", duration: 0.28, begin: 95.600, index: 310 },
  { text: "na", duration: 0.28, begin: 95.800, index: 311 },
  { text: " ça", duration: 0.28, begin: 96.000, index: 312 },
  { text: "tır", duration: 0.28, begin: 96.200, index: 313 },
  { text: "dı", duration: 0.28, begin: 96.400, index: 314 },
  { text: "yor", duration: 0.28, begin: 96.600, index: 315 },
  { text: "du.", duration: 0.28, begin: 96.800, index: 316 },
  { text: " Ya", duration: 0.28, begin: 97.800, index: 317 },
  { text: "ta", duration: 0.28, begin: 98.000, index: 318 },
  { text: "ğın", duration: 0.28, begin: 98.200, index: 319 },
  { text: "dan", duration: 0.28, begin: 98.400, index: 320 },
  { text: " fır", duration: 0.28, begin: 98.800, index: 321 },
  { text: "la", duration: 0.28, begin: 99.000, index: 322 },
  { text: "dı,", duration: 0.28, begin: 99.200, index: 323 },
  { text: " a", duration: 0.28, begin: 100.200, index: 324 },
  { text: "da", duration: 0.28, begin: 100.400, index: 325 },
  { text: "mın", duration: 0.28, begin: 100.600, index: 326 },
  { text: " o", duration: 0.28, begin: 100.800, index: 327 },
  { text: "da", duration: 0.28, begin: 101.000, index: 328 },
  { text: "sı", duration: 0.28, begin: 101.200, index: 329 },
  { text: "na", duration: 0.28, begin: 101.400, index: 330 },
  { text: " koş", duration: 0.28, begin: 101.600, index: 331 },
  { text: "tu:", duration: 0.28, begin: 101.800, index: 332 },
  { text: " Kalk,", duration: 0.28, begin: 102.800, index: 333 },
  { text: " kalk!", duration: 0.28, begin: 103.500, index: 334 },
  { text: " Fır", duration: 0.28, begin: 104.400, index: 335 },
  { text: "tı", duration: 0.28, begin: 104.600, index: 336 },
  { text: "na", duration: 0.28, begin: 104.800, index: 337 },
  { text: " çık", duration: 0.28, begin: 105.200, index: 338 },
  { text: "tı.", duration: 0.28, begin: 105.400, index: 339 },
  { text: " Her", duration: 0.28, begin: 106.200, index: 340 },
  { text: " şe", duration: 0.28, begin: 106.400, index: 341 },
  { text: "yi", duration: 0.28, begin: 106.600, index: 342 },
  { text: " u", duration: 0.28, begin: 107.000, index: 343 },
  { text: "çur", duration: 0.28, begin: 107.200, index: 344 },
  { text: "ma", duration: 0.28, begin: 107.400, index: 345 },
  { text: "dan", duration: 0.28, begin: 107.600, index: 346 },
  { text: " ya", duration: 0.28, begin: 108.000, index: 347 },
  { text: "pa", duration: 0.28, begin: 108.200, index: 348 },
  { text: "bi", duration: 0.28, begin: 108.400, index: 349 },
  { text: "le", duration: 0.28, begin: 108.600, index: 350 },
  { text: "cek", duration: 0.28, begin: 108.800, index: 351 },
  { text: "le", duration: 0.28, begin: 109.000, index: 352 },
  { text: "ri", duration: 0.28, begin: 109.200, index: 353 },
  { text: "mi", duration: 0.28, begin: 109.400, index: 354 },
  { text: "zi", duration: 0.28, begin: 109.600, index: 355 },
  { text: " ya", duration: 0.28, begin: 109.800, index: 356 },
  { text: "pa", duration: 0.28, begin: 110.000, index: 357 },
  { text: "lım.\"", duration: 0.28, begin: 110.200, index: 358 },
  { text: " A", duration: 0.28, begin: 111.200, index: 359 },
  { text: "dam", duration: 0.28, begin: 111.400, index: 360 },
  { text: " ya", duration: 0.28, begin: 111.800, index: 361 },
  { text: "ta", duration: 0.28, begin: 112.000, index: 362 },
  { text: "ğın", duration: 0.28, begin: 112.200, index: 363 },
  { text: "dan", duration: 0.28, begin: 112.400, index: 364 },
  { text: " bi", duration: 0.28, begin: 112.600, index: 365 },
  { text: "le", duration: 0.28, begin: 112.800, index: 366 },
  { text: " doğ", duration: 0.28, begin: 113.200, index: 367 },
  { text: "rul", duration: 0.28, begin: 113.400, index: 368 },
  { text: "ma", duration: 0.28, begin: 113.600, index: 369 },
  { text: "dan", duration: 0.28, begin: 113.800, index: 370 },
  { text: " mı", duration: 0.28, begin: 114.200, index: 371 },
  { text: "rıl", duration: 0.28, begin: 114.400, index: 372 },
  { text: "dan", duration: 0.28, begin: 114.600, index: 373 },
  { text: "dı:", duration: 0.28, begin: 114.800, index: 374 },
  { text: " Boş", duration: 0.28, begin: 115.800, index: 375 },
  { text: " ve", duration: 0.28, begin: 116.000, index: 376 },
  { text: "rin", duration: 0.28, begin: 116.200, index: 377 },
  { text: " e", duration: 0.28, begin: 116.600, index: 378 },
  { text: "fen", duration: 0.28, begin: 116.800, index: 379 },
  { text: "dim,", duration: 0.28, begin: 117.000, index: 380 },
  { text: " gi", duration: 0.28, begin: 117.700, index: 381 },
  { text: "din", duration: 0.28, begin: 118.000, index: 382 },
  { text: " ya", duration: 0.28, begin: 118.200, index: 383 },
  { text: "tın.", duration: 0.28, begin: 118.400, index: 384 },
  { text: " İ", duration: 0.28, begin: 119.400, index: 385 },
  { text: "şe", duration: 0.28, begin: 119.600, index: 386 },
  { text: " gi", duration: 0.28, begin: 119.800, index: 387 },
  { text: "rer", duration: 0.28, begin: 120.000, index: 388 },
  { text: "ken", duration: 0.28, begin: 120.200, index: 389 },
  { text: " ben", duration: 0.28, begin: 120.600, index: 390 },
  { text: " si", duration: 0.28, begin: 120.800, index: 391 },
  { text: "ze", duration: 0.28, begin: 121.000, index: 392 },
  { text: " fır", duration: 0.28, begin: 121.800, index: 393 },
  { text: "tı", duration: 0.28, begin: 122.000, index: 394 },
  { text: "na", duration: 0.28, begin: 122.200, index: 395 },
  { text: " çık", duration: 0.28, begin: 122.600, index: 396 },
  { text: "tı", duration: 0.28, begin: 122.800, index: 397 },
  { text: "ğın", duration: 0.28, begin: 123.000, index: 398 },
  { text: "da", duration: 0.28, begin: 123.200, index: 399 },
  { text: " u", duration: 0.10, begin: 123.600, index: 400 },
  { text: "yu", duration: 0.10, begin: 123.800, index: 401 },
  { text: "ya", duration: 0.10, begin: 124.000, index: 402 },
  { text: "bi", duration: 0.10, begin: 124.200, index: 403 },
  { text: "li", duration: 0.10, begin: 124.400, index: 404 },
  { text: "rim", duration: 0.10, begin: 124.600, index: 405 },
  { text: " de", duration: 0.10, begin: 124.800, index: 406 },
  { text: "miş", duration: 0.10, begin: 125.000, index: 407 },
  { text: "tim", duration: 0.10, begin: 125.200, index: 408 },
  { text: " ya.\"", duration: 0.10, begin: 125.400, index: 409 },
  { text: " Çift", duration: 0.28, begin: 126.400, index: 410 },
  { text: "çi", duration: 0.28, begin: 126.600, index: 411 },
  { text: " a", duration: 0.28, begin: 127.600, index: 412 },
  { text: "da", duration: 0.28, begin: 127.800, index: 413 },
  { text: "mın", duration: 0.28, begin: 128.000, index: 414 },
  { text: " ra", duration: 0.28, begin: 128.200, index: 415 },
  { text: "hat", duration: 0.28, begin: 128.400, index: 416 },
  { text: "lı", duration: 0.28, begin: 128.600, index: 417 },
  { text: "ğı", duration: 0.28, begin: 128.800, index: 418 },
  { text: "na", duration: 0.28, begin: 129.000, index: 419 },
  { text: " çıl", duration: 0.28, begin: 129.400, index: 420 },
  { text: "dır", duration: 0.28, begin: 129.600, index: 421 },
  { text: "mış", duration: 0.28, begin: 129.800, index: 422 },
  { text: "tı.", duration: 0.28, begin: 130.000, index: 423 },
  { text: " Er", duration: 0.28, begin: 131.000, index: 424 },
  { text: "te", duration: 0.28, begin: 131.200, index: 425 },
  { text: "si", duration: 0.28, begin: 131.400, index: 426 },
  { text: " sa", duration: 0.28, begin: 131.800, index: 427 },
  { text: "bah", duration: 0.28, begin: 132.000, index: 428 },
  { text: " ilk", duration: 0.28, begin: 132.200, index: 429 },
  { text: " i", duration: 0.28, begin: 132.400, index: 430 },
  { text: "şi", duration: 0.28, begin: 132.600, index: 431 },
  { text: " o", duration: 0.28, begin: 133.600, index: 432 },
  { text: "nu", duration: 0.28, begin: 133.800, index: 433 },
  { text: " kov", duration: 0.28, begin: 134.000, index: 434 },
  { text: "mak", duration: 0.28, begin: 134.200, index: 435 },
  { text: " o", duration: 0.28, begin: 134.500, index: 436 },
  { text: "la", duration: 0.28, begin: 134.700, index: 437 },
  { text: "cak", duration: 0.28, begin: 134.900, index: 438 },
  { text: "tı", duration: 0.28, begin: 135.100, index: 439 },
  { text: " a", duration: 0.28, begin: 136.000, index: 440 },
  { text: "ma", duration: 0.28, begin: 136.200, index: 441 },
  { text: " şim", duration: 0.28, begin: 136.400, index: 442 },
  { text: "di", duration: 0.28, begin: 136.600, index: 443 },
  { text: " fır", duration: 0.28, begin: 136.900, index: 444 },
  { text: "tı", duration: 0.28, begin: 137.100, index: 445 },
  { text: "na", duration: 0.28, begin: 137.300, index: 446 },
  { text: "ya", duration: 0.28, begin: 137.500, index: 447 },
  { text: " bir", duration: 0.28, begin: 137.700, index: 448 },
  { text: " ça", duration: 0.28, begin: 137.900, index: 449 },
  { text: "re", duration: 0.28, begin: 138.100, index: 450 },
  { text: " bul", duration: 0.28, begin: 138.300, index: 451 },
  { text: "mak", duration: 0.28, begin: 138.500, index: 452 },
  { text: " ge", duration: 0.28, begin: 138.800, index: 453 },
  { text: "re", duration: 0.28, begin: 139.000, index: 454 },
  { text: "ki", duration: 0.28, begin: 139.200, index: 455 },
  { text: "yor", duration: 0.28, begin: 139.400, index: 456 },
  { text: "du.", duration: 0.28, begin: 139.600, index: 457 },
  { text: " Dı", duration: 0.28, begin: 140.800, index: 458 },
  { text: "şa", duration: 0.28, begin: 141.000, index: 459 },
  { text: "rı", duration: 0.28, begin: 141.200, index: 460 },
  { text: " çık", duration: 0.28, begin: 141.400, index: 461 },
  { text: "tı,", duration: 0.28, begin: 141.600, index: 462 },
  { text: " sa", duration: 0.28, begin: 142.400, index: 463 },
  { text: "man", duration: 0.28, begin: 142.600, index: 464 },
  { text: " bal", duration: 0.28, begin: 142.800, index: 465 },
  { text: "ya", duration: 0.28, begin: 143.000, index: 466 },
  { text: "la", duration: 0.28, begin: 143.200, index: 467 },
  { text: "rı", duration: 0.28, begin: 143.400, index: 468 },
  { text: "na", duration: 0.28, begin: 143.600, index: 469 },
  { text: " koş", duration: 0.28, begin: 144.000, index: 470 },
  { text: "tu.", duration: 0.28, begin: 144.200, index: 471 },
  { text: " Sa", duration: 0.28, begin: 145.200, index: 472 },
  { text: "man", duration: 0.28, begin: 145.400, index: 473 },
  { text: " bal", duration: 0.28, begin: 145.800, index: 474 },
  { text: "ya", duration: 0.28, begin: 146.000, index: 475 },
  { text: "la", duration: 0.28, begin: 146.200, index: 476 },
  { text: "rı", duration: 0.28, begin: 146.400, index: 477 },
  { text: " bir", duration: 0.28, begin: 146.800, index: 478 },
  { text: "leş", duration: 0.28, begin: 147.000, index: 479 },
  { text: "ti", duration: 0.28, begin: 147.200, index: 480 },
  { text: "ril", duration: 0.28, begin: 147.400, index: 481 },
  { text: "miş,", duration: 0.28, begin: 147.600, index: 482 },
  { text: " ü", duration: 0.28, begin: 148.600, index: 483 },
  { text: "ze", duration: 0.28, begin: 148.800, index: 484 },
  { text: "ri", duration: 0.28, begin: 149.000, index: 485 },
  { text: " mu", duration: 0.28, begin: 149.200, index: 486 },
  { text: "şam", duration: 0.28, begin: 149.500, index: 487 },
  { text: "ba", duration: 0.28, begin: 149.700, index: 488 },
  { text: " i", duration: 0.28, begin: 149.900, index: 489 },
  { text: "le", duration: 0.28, begin: 150.100, index: 490 },
  { text: " ör", duration: 0.28, begin: 150.400, index: 491 },
  { text: "tül", duration: 0.28, begin: 150.600, index: 492 },
  { text: "müş,", duration: 0.28, begin: 150.800, index: 493 },
  { text: " sı", duration: 0.28, begin: 151.600, index: 494 },
  { text: "kı", duration: 0.28, begin: 151.800, index: 495 },
  { text: "ca", duration: 0.28, begin: 152.000, index: 496 },
  { text: " bağ", duration: 0.28, begin: 152.300, index: 497 },
  { text: "lan", duration: 0.28, begin: 152.500, index: 498 },
  { text: "mış", duration: 0.28, begin: 152.800, index: 499 },
  { text: "tı.", duration: 0.28, begin: 153.000, index: 500 },
  { text: " A", duration: 0.28, begin: 154.200, index: 501 },
  { text: "hı", duration: 0.28, begin: 154.400, index: 502 },
  { text: "ra", duration: 0.28, begin: 154.600, index: 503 },
  { text: " koş", duration: 0.28, begin: 154.800, index: 504 },
  { text: "tu.", duration: 0.28, begin: 155.000, index: 505 },
  { text: " İ", duration: 0.28, begin: 156.000, index: 506 },
  { text: "nek", duration: 0.28, begin: 156.200, index: 507 },
  { text: "le", duration: 0.28, begin: 156.400, index: 508 },
  { text: "rin", duration: 0.28, begin: 156.600, index: 509 },
  { text: " ta", duration: 0.28, begin: 156.900, index: 510 },
  { text: "ma", duration: 0.28, begin: 157.200, index: 511 },
  { text: "mı", duration: 0.28, begin: 157.400, index: 512 },
  { text: " bah", duration: 0.28, begin: 158.200, index: 513 },
  { text: "çe", duration: 0.28, begin: 158.400, index: 514 },
  { text: "den", duration: 0.28, begin: 158.700, index: 515 },
  { text: " a", duration: 0.28, begin: 158.900, index: 516 },
  { text: "hı", duration: 0.28, begin: 159.100, index: 517 },
  { text: "ra", duration: 0.28, begin: 159.300, index: 518 },
  { text: " so", duration: 0.28, begin: 159.600, index: 519 },
  { text: "kul", duration: 0.28, begin: 159.900, index: 520 },
  { text: "muş,", duration: 0.28, begin: 160.100, index: 521 },
  { text: " a", duration: 0.28, begin: 161.100, index: 522 },
  { text: "hı", duration: 0.28, begin: 161.300, index: 523 },
  { text: "rın", duration: 0.28, begin: 161.500, index: 524 },
  { text: " ka", duration: 0.28, begin: 161.700, index: 525 },
  { text: "pı", duration: 0.28, begin: 161.900, index: 526 },
  { text: "sı", duration: 0.28, begin: 162.100, index: 527 },
  { text: " des", duration: 0.40, begin: 162.500, index: 528 },
  { text: "tek", duration: 0.40, begin: 162.700, index: 529 },
  { text: "len", duration: 0.40, begin: 162.900, index: 530 },
  { text: "miş", duration: 0.40, begin: 163.100, index: 531 },
  { text: "ti.", duration: 0.40, begin: 163.300, index: 532 },
  { text: " Tek", duration: 0.28, begin: 164.500, index: 533 },
  { text: "rar", duration: 0.28, begin: 164.700, index: 534 },
  { text: " e", duration: 0.28, begin: 165.200, index: 535 },
  { text: "vi", duration: 0.28, begin: 165.400, index: 536 },
  { text: "ne", duration: 0.28, begin: 165.600, index: 537 },
  { text: " yö", duration: 0.28, begin: 165.800, index: 538 },
  { text: "nel", duration: 0.28, begin: 166.000, index: 539 },
  { text: "di.", duration: 0.28, begin: 166.200, index: 540 },
  { text: " E", duration: 0.28, begin: 167.000, index: 541 },
  { text: "vin", duration: 0.28, begin: 167.200, index: 542 },
  { text: " ke", duration: 0.28, begin: 167.600, index: 543 },
  { text: "penk", duration: 0.28, begin: 167.800, index: 544 },
  { text: "le", duration: 0.28, begin: 168.000, index: 545 },
  { text: "ri", duration: 0.28, begin: 168.200, index: 546 },
  { text: "nin", duration: 0.28, begin: 168.400, index: 547 },
  { text: " ta", duration: 0.28, begin: 168.800, index: 548 },
  { text: "ma", duration: 0.28, begin: 169.000, index: 549 },
  { text: "mı", duration: 0.28, begin: 169.200, index: 550 },
  { text: " ka", duration: 0.28, begin: 169.500, index: 551 },
  { text: "pa", duration: 0.28, begin: 169.700, index: 552 },
  { text: "tıl", duration: 0.28, begin: 169.900, index: 553 },
  { text: "mış", duration: 0.28, begin: 170.200, index: 554 },
  { text: "tı.", duration: 0.28, begin: 170.400, index: 555 },
  { text: " Çift", duration: 0.28, begin: 171.600, index: 556 },
  { text: "çi", duration: 0.28, begin: 171.800, index: 557 },
  { text: " ra", duration: 0.28, begin: 172.800, index: 558 },
  { text: "hat", duration: 0.28, begin: 173.000, index: 559 },
  { text: "la", duration: 0.28, begin: 173.200, index: 560 },
  { text: "mış", duration: 0.28, begin: 173.400, index: 561 },
  { text: " bir", duration: 0.28, begin: 173.600, index: 562 },
  { text: " hal", duration: 0.28, begin: 173.900, index: 563 },
  { text: "de", duration: 0.28, begin: 174.100, index: 564 },
  { text: " o", duration: 0.28, begin: 174.400, index: 565 },
  { text: "da", duration: 0.28, begin: 174.600, index: 566 },
  { text: "sı", duration: 0.28, begin: 174.800, index: 567 },
  { text: "na", duration: 0.28, begin: 175.000, index: 568 },
  { text: " dön", duration: 0.28, begin: 175.200, index: 569 },
  { text: "dü", duration: 0.28, begin: 175.400, index: 570 },
  { text: " ya", duration: 0.28, begin: 176.000, index: 571 },
  { text: "ta", duration: 0.28, begin: 176.200, index: 572 },
  { text: "ğı", duration: 0.28, begin: 176.400, index: 573 },
  { text: "na", duration: 0.28, begin: 176.600, index: 574 },
  { text: " yat", duration: 0.28, begin: 176.800, index: 575 },
  { text: "tı.", duration: 0.28, begin: 177.000, index: 576 },
  { text: " Fır", duration: 0.28, begin: 178.000, index: 577 },
  { text: "tı", duration: 0.28, begin: 178.200, index: 578 },
  { text: "na", duration: 0.28, begin: 178.400, index: 579 },
  { text: " u", duration: 0.28, begin: 178.600, index: 580 },
  { text: "ğul", duration: 0.28, begin: 178.800, index: 581 },
  { text: "da", duration: 0.28, begin: 179.000, index: 582 },
  { text: "ma", duration: 0.28, begin: 179.200, index: 583 },
  { text: "ya", duration: 0.28, begin: 179.400, index: 584 },
  { text: " de", duration: 0.28, begin: 179.600, index: 585 },
  { text: "vam", duration: 0.28, begin: 179.800, index: 586 },
  { text: " e", duration: 0.28, begin: 180.100, index: 587 },
  { text: "di", duration: 0.28, begin: 180.300, index: 588 },
  { text: "yor", duration: 0.28, begin: 180.600, index: 589 },
  { text: "du.", duration: 0.28, begin: 180.800, index: 590 },
  { text: " Gü", duration: 0.28, begin: 182.100, index: 591 },
  { text: "lüm", duration: 0.28, begin: 182.300, index: 592 },
  { text: "se", duration: 0.28, begin: 182.500, index: 593 },
  { text: "di", duration: 0.28, begin: 182.700, index: 594 },
  { text: " ve", duration: 0.28, begin: 182.900, index: 595 },
  { text: " göz", duration: 0.28, begin: 183.100, index: 596 },
  { text: "le", duration: 0.28, begin: 183.300, index: 597 },
  { text: "ri", duration: 0.28, begin: 183.500, index: 598 },
  { text: "ni", duration: 0.28, begin: 183.700, index: 599 },
  { text: " ka", duration: 0.28, begin: 183.900, index: 600 },
  { text: "pa", duration: 0.28, begin: 184.100, index: 601 },
  { text: "tır", duration: 0.28, begin: 184.300, index: 602 },
  { text: "ken", duration: 0.28, begin: 184.500, index: 603 },
  { text: " mı", duration: 0.28, begin: 184.800, index: 604 },
  { text: "rıl", duration: 0.28, begin: 185.000, index: 605 },
  { text: "dan", duration: 0.28, begin: 185.200, index: 606 },
  { text: "dı:", duration: 0.28, begin: 185.400, index: 607 },
  { text: " \"Fır", duration: 0.28, begin: 186.400, index: 608 },
  { text: "tı", duration: 0.28, begin: 186.600, index: 609 },
  { text: "na", duration: 0.28, begin: 186.800, index: 610 },
  { text: " çık", duration: 0.28, begin: 187.100, index: 611 },
  { text: "tı", duration: 0.28, begin: 187.300, index: 612 },
  { text: "ğın", duration: 0.28, begin: 187.500, index: 613 },
  { text: "da", duration: 0.28, begin: 187.700, index: 614 },
  { text: " u", duration: 0.28, begin: 188.000, index: 615 },
  { text: "yu", duration: 0.28, begin: 188.200, index: 616 },
  { text: "ya", duration: 0.28, begin: 188.400, index: 617 },
  { text: "bi", duration: 0.28, begin: 188.600, index: 618 },
  { text: "li", duration: 0.28, begin: 188.800, index: 619 },
  { text: "rim.\"", duration: 0.28, begin: 189.000, index: 620 }
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
  <Link href="/dashboard/stories/einstein-ve-soforu" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/bir-hayir-vardir" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/4-4.mp3"
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