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
    { text: "", duration: 0.154, begin: 0.5, index: 0 },

    { text: "", duration: 0.15, begin: 0.575, index: 0 },
  
  // Title
  { text: "Bir", duration: 0.48, begin: 0.529, index: 1, isTitle: true, isCenter: true },
  { text: " Ba", duration: 0.48, begin: 0.818, index: 2, isTitle: true, isCenter: true },
  { text: "lık", duration: 0.48, begin: 1.108, index: 3, isTitle: true, isCenter: true },
  { text: "çı", duration: 0.48, begin: 1.308, index: 4, isTitle: true, isCenter: true },
  { text: " Hi", duration: 0.28, begin: 1.908, index: 5, isTitle: true, isCenter: true },
  { text: "ka", duration: 0.28, begin: 2.108, index: 6, isTitle: true, isCenter: true },
  { text: "ye", duration: 0.28, begin: 2.208, index: 7, isTitle: true, isCenter: true },
  { text: "si", duration: 0.28, begin: 2.608, index: 8, isTitle: true, isCenter: true },
  
  // Story content
  { text: "A", duration: 0.78, begin: 3.708, index: 9 },
  { text: "me", duration: 0.78, begin: 3.958, index: 10 },
  { text: "ri", duration: 0.78, begin: 4.208, index: 11 },
  { text: "ka", duration: 0.78, begin: 4.408, index: 12 },
  { text: "lı", duration: 0.78, begin: 4.608, index: 13 },
  { text: " bir", duration: 0.78, begin: 4.908, index: 14 },
  { text: " zen", duration: 0.78, begin: 5.308, index: 15 },
  { text: "gin", duration: 0.78, begin: 5.508, index: 16 },
  { text: " iş", duration: 0.68, begin: 6.908, index: 17 },
  { text: " se", duration: 0.78, begin: 6.998, index: 18 },
  { text: "ya", duration: 0.78, begin: 7.308, index: 19 },
  { text: "ha", duration: 0.78, begin: 7.508, index: 20 },
  { text: "ti", duration: 0.78, begin: 7.708, index: 21 },
  { text: " sı", duration: 0.78, begin: 8.008, index: 22 },
  { text: "ra", duration: 0.78, begin: 8.308, index: 23 },
  { text: "sın", duration: 0.78, begin: 8.508, index: 24 },
  { text: "da", duration: 0.78, begin: 8.708, index: 25 },
  { text: " Mek", duration: 0.78, begin: 9.808, index: 26 },
  { text: "si", duration: 0.78, begin: 10.008, index: 27 },
  { text: "ka", duration: 0.78, begin: 10.308, index: 28 },
  { text: "nın", duration: 0.78, begin: 10.508, index: 29 },
  { text: " kü", duration: 0.48, begin: 11.658, index: 30 },
  { text: "çük", duration: 0.78, begin: 11.738, index: 31 },
  { text: " bir", duration: 0.78, begin: 11.988, index: 32 },
  { text: " kı", duration: 0.58, begin: 12.508, index: 33 },
  { text: "yı", duration: 0.78, begin: 12.708, index: 34 },
  { text: " ka", duration: 0.78, begin: 12.988, index: 35 },
  { text: "sa", duration: 0.78, begin: 13.308, index: 36 },
  { text: "ba", duration: 0.78, begin: 13.508, index: 37 },
  { text: "sı", duration: 0.78, begin: 13.708, index: 38 },
  { text: "na", duration: 0.78, begin: 13.908, index: 39 },
  { text: " uğ", duration: 0.78, begin: 14.208, index: 40 },
  { text: "ra", duration: 0.78, begin: 14.408, index: 41 },
  { text: "mış.", duration: 0.78, begin: 14.708, index: 42 },
  { text: " Li", duration: 0.78, begin: 15.908, index: 43 },
  { text: "man", duration: 0.78, begin: 16.308, index: 44 },
  { text: "da", duration: 0.78, begin: 16.508, index: 45 },
  { text: " gez", duration: 0.78, begin: 16.908, index: 46 },
  { text: "er", duration: 0.78, begin: 17.308, index: 47 },
  { text: "ken,", duration: 0.78, begin: 17.508, index: 48 },
  { text: " bak", duration: 0.78, begin: 18.688, index: 49 },
  { text: "mış", duration: 0.78, begin: 18.808, index: 50 },
  { text: " ağ", duration: 0.58, begin: 20.208, index: 51 },
  { text: "zı", duration: 0.58, begin: 20.308, index: 52 },
  { text: "na", duration: 0.58, begin: 20.608, index: 53 },
  { text: " ka", duration: 0.48, begin: 21.108, index: 54 },
  { text: "dar", duration: 0.58, begin: 21.188, index: 55 },
  { text: " ba", duration: 0.68, begin: 21.308, index: 56 },
  { text: "lık", duration: 0.58, begin: 21.508, index: 57 },
  { text: " do", duration: 0.48, begin: 22.308, index: 58 },
  { text: "lu", duration: 0.58, begin: 22.318, index: 59 },
  { text: " bir", duration: 0.78, begin: 22.508, index: 60 },
  { text: " tek", duration: 0.78, begin: 22.908, index: 61 },
  { text: "ne", duration: 0.78, begin: 23.108, index: 62 },
  { text: " ve", duration: 0.78, begin: 23.308, index: 63 },
  { text: " i", duration: 0.48, begin: 25.308, index: 64 },
  { text: "çin", duration: 0.48, begin: 25.398, index: 65 },
  { text: "de", duration: 0.48, begin: 25.508, index: 66 },
  { text: " ke", duration: 0.78, begin: 26.108, index: 67 },
  { text: "yif", duration: 0.78, begin: 26.208, index: 68 },
  { text: "li", duration: 0.78, begin: 26.508, index: 69 },
  { text: " bir", duration: 0.78, begin: 26.808, index: 70 },
  { text: " ba", duration: 0.98, begin: 26.908, index: 71 },
  { text: "lık", duration: 0.98, begin: 27.108, index: 72 },
  { text: "çı.", duration: 0.98, begin: 27.208, index: 73 },
  { text: " Mer", duration: 0.48, begin: 29.508, index: 74 },
  { text: "ha", duration: 0.68, begin: 29.700, index: 75 },
  { text: "ba", duration: 0.78, begin: 29.808, index: 76 },
  { text: " ba", duration: 0.98, begin: 29.908, index: 77 },
  { text: "lık", duration: 0.98, begin: 30.108, index: 78 },
  { text: "çı", duration: 0.98, begin: 30.208, index: 79 },
  { text: " di", duration: 0.48, begin: 31.978, index: 80 },
  { text: "ye", duration: 0.58, begin: 31.989, index: 81 },
  { text: " ses", duration: 0.58, begin: 32.508, index: 82 },
  { text: "len", duration: 0.58, begin: 32.708, index: 83 },
  { text: "miş.", duration: 0.58, begin: 32.908, index: 84 },
  { text: " Bu", duration: 0.98, begin: 34.308, index: 85 },
  { text: " ba", duration: 0.98, begin: 34.508, index: 86 },
  { text: "lık", duration: 0.98, begin: 34.708, index: 87 },
  { text: "la", duration: 0.98, begin: 34.908, index: 88 },
  { text: "rı", duration: 0.98, begin: 35.108, index: 89 },
  { text: " ne", duration: 0.48, begin: 36.808, index: 90 },
  { text: "ka", duration: 0.48, begin: 37.008, index: 91 },
  { text: "dar", duration: 0.48, begin: 37.208, index: 92 },
  { text: " sü", duration: 0.68, begin: 37.308, index: 93 },
  { text: "re", duration: 0.68, begin: 37.408, index: 94 },
  { text: "de", duration: 0.68, begin: 37.708, index: 95 },
  { text: " tut", duration: 0.98, begin: 37.908, index: 96 },
  { text: "tun?", duration: 0.98, begin: 38.108, index: 97 },
  { text: " Bir", duration: 0.48, begin: 40.008, index: 98 },
  { text: " i", duration: 0.78, begin: 40.098, index: 99 },
  { text: "ki", duration: 0.78, begin: 40.150, index: 100 },
  { text: " sa", duration: 0.78, begin: 40.308, index: 101 },
  { text: "at", duration: 0.78, begin: 40.508, index: 102 },
  { text: "i", duration: 0.78, begin: 40.708, index: 103 },
  { text: "mi", duration: 0.78, begin: 40.908, index: 104 },
  { text: " al", duration: 0.48, begin: 41.908, index: 105 },
  { text: "dı", duration: 0.68, begin: 41.918, index: 106 },
  { text: " de", duration: 0.38, begin: 43.208, index: 107 },
  { text: "miş", duration: 0.58, begin: 43.210, index: 108 },
  { text: " ba", duration: 0.98, begin: 43.350, index: 109 },
  { text: "lık", duration: 0.98, begin: 43.508, index: 110 },
  { text: "çı.", duration: 0.98, begin: 43.708, index: 111 },
  { text: " İş", duration: 0.98, begin: 45.108, index: 112 },
  { text: "tah", duration: 0.98, begin: 45.250, index: 113 },
  { text: "lan", duration: 0.98, begin: 45.588, index: 114 },
  { text: "mış", duration: 0.98, begin: 45.808, index: 115 },
  { text: " bi", duration: 0.68, begin: 46.605, index: 116 },
  { text: "zim", duration: 0.68, begin: 46.808, index: 117 },
  { text: " iş", duration: 0.98, begin: 47.208, index: 118 },
  { text: " a", duration: 0.68, begin: 47.808, index: 119 },
  { text: "da", duration: 0.98, begin: 47.858, index: 120 },
  { text: "mı;", duration: 0.98, begin: 48.208, index: 121 },
  { text: " E,", duration: 0.98, begin: 50.208, index: 122 },
  { text: " ni", duration: 0.98, begin: 50.408, index: 123 },
  { text: "ye", duration: 0.98, begin: 50.608, index: 124 },
  { text: " bi", duration: 0.98, begin: 50.850, index: 125 },
  { text: "raz", duration: 0.98, begin: 51.000, index: 126 },
  { text: " da", duration: 0.98, begin: 51.308, index: 127 },
  { text: "ha", duration: 0.98, begin: 51.508, index: 128 },
  { text: " ka", duration: 0.98, begin: 52.000, index: 129 },
  { text: "lıp", duration: 0.98, begin: 52.308, index: 130 },
  { text: "da", duration: 0.98, begin: 52.508, index: 131 },
  { text: " da", duration: 0.68, begin: 53.999, index: 132 },
  { text: "ha", duration: 0.68, begin: 54.150, index: 133 },
  { text: " faz", duration: 0.98, begin: 54.208, index: 134 },
  { text: "la", duration: 0.98, begin: 54.358, index: 135 },
  { text: " ba", duration: 0.98, begin: 54.780, index: 136 },
  { text: "lık", duration: 0.98, begin: 54.908, index: 137 },
  { text: " tut", duration: 0.98, begin: 55.408, index: 138 },
  { text: "ma", duration: 0.98, begin: 55.608, index: 139 },
  { text: "dın?", duration: 0.98, begin: 55.808, index: 140 },
  { text: " di", duration: 0.98, begin: 57.300, index: 141 },
  { text: "ye", duration: 0.98, begin: 57.380, index: 142 },
  { text: " sor", duration: 0.98, begin: 57.608, index: 143 },
  { text: "muş.", duration: 0.98, begin: 57.908, index: 144 },
  { text: " Bu", duration: 0.78, begin: 59.750, index: 145 },
  { text: " ka", duration: 0.98, begin: 59.850, index: 146 },
  { text: "da", duration: 0.98, begin: 59.990, index: 147 },
  { text: "rı", duration: 0.98, begin: 60.250, index: 148 },
  { text: " bi", duration: 0.78, begin: 60.550, index: 149 },
  { text: "ze", duration: 0.78, begin: 60.850, index: 150 },
  { text: " ye", duration: 0.78, begin: 61.350, index: 151 },
  { text: "ti", duration: 0.78, begin: 61.500, index: 152 },
  { text: "yor", duration: 0.78, begin: 61.680, index: 153 },
  { text: " da", duration: 0.98, begin: 61.850, index: 154 },
  { text: " on", duration: 0.48, begin: 62.950, index: 155 },
  { text: "dan", duration: 0.68, begin: 63.000, index: 156 },
  { text: " di", duration: 0.68, begin: 64.000, index: 157 },
  { text: "ye", duration: 0.68, begin: 64.450, index: 158 },
  { text: " o", duration: 0.68, begin: 64.850, index: 159 },
  { text: "muz", duration: 0.68, begin: 64.950, index: 160 },
  { text: " silk", duration: 0.68, begin: 65.100, index: 161 },
  { text: "miş", duration: 0.68, begin: 65.250, index: 162 },
  { text: " ba", duration: 0.48, begin: 66.350, index: 163 },
  { text: "lık", duration: 0.48, begin: 66.450, index: 164 },
  { text: "çı.", duration: 0.48, begin: 66.550, index: 165 },
  { text: " Şaş", duration: 0.98, begin: 68.000, index: 166 },
  { text: "mış", duration: 0.98, begin: 68.400, index: 167 },
  { text: " ba", duration: 0.98, begin: 68.508, index: 168 },
  { text: "lık", duration: 0.98, begin: 68.850, index: 169 },
  { text: "çı", duration: 0.98, begin: 68.999, index: 170 },
  { text: "nın", duration: 0.98, begin: 69.218, index: 171 },
  { text: " bu", duration: 0.48, begin: 70.450, index: 172 },
  { text: " ka", duration: 0.83, begin: 70.550, index: 173 },
  { text: "na", duration: 0.83, begin: 70.708, index: 174 },
  { text: "at", duration: 0.83, begin: 70.908, index: 175 },
  { text: "kar", duration: 0.83, begin: 71.108, index: 176 },
  { text: "lı", duration: 0.83, begin: 71.308, index: 177 },
  { text: "ğı", duration: 0.83, begin: 71.508, index: 178 },
  { text: "na", duration: 0.83, begin: 71.708, index: 179 },
  { text: " iş", duration: 0.28, begin: 73.108, index: 180 },
  { text: " a", duration: 0.48, begin: 73.208, index: 181 },
  { text: "da", duration: 0.48, begin: 73.550, index: 182 },
  { text: "mı;", duration: 0.68, begin: 73.850, index: 183 },
  { text: " Ka", duration: 0.78, begin: 74.508, index: 184 },
  { text: "lan", duration: 0.78, begin: 74.708, index: 185 },
  { text: " za", duration: 0.78, begin: 75.208, index: 186 },
  { text: "ma", duration: 0.78, begin: 75.508, index: 187 },
  { text: "nı", duration: 0.78, begin: 75.708, index: 188 },
  { text: "nı", duration: 0.78, begin: 75.908, index: 189 },
  { text: " na", duration: 0.98, begin: 76.208, index: 190 },
  { text: "sıl", duration: 0.98, begin: 76.408, index: 191 },
  { text: " ge", duration: 0.98, begin: 76.908, index: 192 },
  { text: "çi", duration: 0.98, begin: 77.208, index: 193 },
  { text: "yor", duration: 0.98, begin: 77.508, index: 194 },
  { text: "sun", duration: 0.98, begin: 77.708, index: 195 },
  { text: " pe", duration: 0.98, begin: 77.999, index: 196 },
  { text: "ki", duration: 0.98, begin: 78.750, index: 197 },
  { text: " di", duration: 0.48, begin: 79.950, index: 198 },
  { text: "ye", duration: 0.98, begin: 79.999, index: 199 },
  { text: " üs", duration: 0.98, begin: 80.250, index: 200 },
  { text: "te", duration: 0.98, begin: 80.480, index: 201 },
  { text: "le", duration: 0.98, begin: 80.608, index: 202 },
  { text: "miş.", duration: 0.98, begin: 80.808, index: 203 },
  { text: " Ba", duration: 0.78, begin: 82.608, index: 204 },
  { text: "lık", duration: 0.78, begin: 82.908, index: 205 },
  { text: "çı,", duration: 0.78, begin: 83.108, index: 206 },
  { text: " ö", duration: 0.78, begin: 84.308, index: 207 },
  { text: "zet", duration: 0.78, begin: 84.508, index: 208 },
  { text: "le", duration: 0.78, begin: 84.708, index: 209 },
  { text: "miş", duration: 0.78, begin: 84.908, index: 210 },
  { text: " bir", duration: 0.78, begin: 85.308, index: 211 },
  { text: " gü", duration: 0.78, begin: 85.508, index: 212 },
  { text: "nü", duration: 0.78, begin: 85.708, index: 213 },
  { text: "nü:", duration: 0.78, begin: 85.908, index: 214 },
  { text: " Sa", duration: 0.78, begin: 87.308, index: 215 },
  { text: "bah", duration: 0.78, begin: 87.508, index: 216 },
  { text: "la", duration: 0.78, begin: 87.708, index: 217 },
  { text: "rı", duration: 0.78, begin: 87.908, index: 218 },
  { text: " a", duration: 0.78, begin: 88.308, index: 219 },
  { text: "çı", duration: 0.78, begin: 88.508, index: 220 },
  { text: "lır,", duration: 0.78, begin: 88.708, index: 221 },
  { text: " bi", duration: 0.48, begin: 90.508, index: 222 },
  { text: "raz", duration: 0.48, begin: 90.708, index: 223 },
  { text: " ba", duration: 0.48, begin: 90.908, index: 224 },
  { text: "lık", duration: 0.48, begin: 91.308, index: 225 },
  { text: " tu", duration: 0.68, begin: 91.508, index: 226 },
  { text: "ta", duration: 0.68, begin: 91.708, index: 227 },
  { text: "rım.", duration: 0.68, begin: 91.908, index: 228 },
  { text: " Son", duration: 0.48, begin: 93.508, index: 229 },
  { text: "ra", duration: 0.48, begin: 93.608, index: 230 },
  { text: " ço", duration: 0.78, begin: 93.708, index: 231 },
  { text: "cuk", duration: 0.78, begin: 94.108, index: 232 },
  { text: "la", duration: 0.78, begin: 94.308, index: 233 },
  { text: "rım", duration: 0.78, begin: 94.508, index: 234 },
  { text: "la", duration: 0.78, begin: 94.908, index: 235 },
  { text: " oy", duration: 0.68, begin: 95.108, index: 236 },
  { text: "na", duration: 0.68, begin: 95.308, index: 237 },
  { text: "rım.", duration: 0.68, begin: 95.508, index: 238 },
  { text: " Öğ", duration: 0.78, begin: 96.908, index: 239 },
  { text: "le", duration: 0.78, begin: 97.108, index: 240 },
  { text: "yin", duration: 0.78, begin: 97.308, index: 241 },
  { text: " ka", duration: 0.78, begin: 98.408, index: 242 },
  { text: "rım", duration: 0.78, begin: 98.508, index: 243 },
  { text: "la", duration: 0.78, begin: 98.708, index: 244 },
  { text: " bi", duration: 0.98, begin: 98.908, index: 245 },
  { text: "raz", duration: 0.98, begin: 99.108, index: 246 },
  { text: " si", duration: 0.98, begin: 99.508, index: 247 },
  { text: "es", duration: 0.98, begin: 99.708, index: 248 },
  { text: "ta", duration: 0.98, begin: 99.908, index: 249 },
  { text: " ya", duration: 0.98, begin: 99.999, index: 250 },
  { text: "pa", duration: 0.98, begin: 100.108, index: 251 },
  { text: "rım.", duration: 0.98, begin: 100.308, index: 252 },
  { text: " Ak", duration: 0.78, begin: 102.508, index: 253 },
  { text: "şam", duration: 0.78, begin: 102.708, index: 254 },
  { text: "la", duration: 0.78, begin: 102.908, index: 255 },
  { text: "rı", duration: 0.78, begin: 103.108, index: 256 },
  { text: " a", duration: 0.78, begin: 104.308, index: 257 },
  { text: "mi", duration: 0.78, begin: 104.508, index: 258 },
  { text: "go", duration: 0.78, begin: 104.708, index: 259 },
  { text: "lar", duration: 0.78, begin: 104.908, index: 260 },
  { text: "la", duration: 0.78, begin: 105.108, index: 261 },
  { text: " be", duration: 0.98, begin: 105.308, index: 262 },
  { text: "ra", duration: 0.98, begin: 105.508, index: 263 },
  { text: "ber", duration: 0.98, begin: 105.708, index: 264 },
  { text: " gi", duration: 0.78, begin: 107.508, index: 265 },
  { text: "tar", duration: 0.78, begin: 107.708, index: 266 },
  { text: " ça", duration: 0.68, begin: 107.908, index: 267 },
  { text: "lıp", duration: 0.68, begin: 108.108, index: 268 },
  { text: " şa", duration: 0.78, begin: 109.208, index: 269 },
  { text: "rap", duration: 0.78, begin: 109.408, index: 270 },
  { text: " i", duration: 0.78, begin: 109.510, index: 271 },
  { text: "çer,", duration: 0.78, begin: 109.530, index: 272 },
  { text: " geç", duration: 0.78, begin: 111.508, index: 273 },
  { text: " vak", duration: 0.78, begin: 111.990, index: 274 },
  { text: "te", duration: 0.78, begin: 112.108, index: 275 },
  { text: " ka", duration: 0.78, begin: 112.408, index: 276 },
  { text: "dar", duration: 0.78, begin: 112.608, index: 277 },
  { text: " eğ", duration: 0.78, begin: 113.208, index: 278 },
  { text: "le", duration: 0.78, begin: 113.508, index: 279 },
  { text: "ni", duration: 0.78, begin: 113.808, index: 280 },
  { text: "riz.", duration: 0.78, begin: 114.108, index: 281 },
  { text: " Ol", duration: 0.78, begin: 115.408, index: 282 },
  { text: "duk", duration: 0.78, begin: 115.608, index: 283 },
  { text: "ça", duration: 0.78, begin: 115.808, index: 284 },
  { text: " meş", duration: 0.60, begin: 117.200, index: 285 },
  { text: "gul", duration: 0.78, begin: 117.295, index: 286 },
  { text: " sa", duration: 0.78, begin: 117.808, index: 287 },
  { text: "yı", duration: 0.78, begin: 118.208, index: 288 },
  { text: "lı", duration: 0.78, begin: 118.608, index: 289 },
  { text: "rım", duration: 0.78, begin: 118.808, index: 290 },
  { text: " sen", duration: 0.78, begin: 119.108, index: 291 },
  { text: "yor.", duration: 0.78, begin: 119.108, index: 292 },
  { text: " A", duration: 0.78, begin: 120.308, index: 293 },
  { text: "me", duration: 0.78, begin: 120.508, index: 294 },
  { text: "ri", duration: 0.78, begin: 120.808, index: 295 },
  { text: "ka", duration: 0.78, begin: 120.908, index: 296 },
  { text: "lı:", duration: 0.78, begin: 121.208, index: 297 },
  { text: " Bak", duration: 0.78, begin: 123.308, index: 298 },
  { text: "de", duration: 0.78, begin: 123.608, index: 299 },
  { text: "miş.", duration: 0.78, begin: 123.808, index: 300 },
  { text: " Ben", duration: 0.58, begin: 125.590, index: 301 },
  { text: " sa", duration: 0.68, begin: 125.600, index: 302 },
  { text: "na", duration: 0.78, begin: 125.680, index: 303 },
  { text: " yar", duration: 0.78, begin: 126.808, index: 304 },
  { text: "dım", duration: 0.78, begin: 126.908, index: 305 },
  { text: "cı", duration: 0.78, begin: 126.968, index: 306 },
  { text: " o", duration: 0.88, begin: 127.308, index: 307 },
  { text: "la", duration: 0.88, begin: 127.408, index: 308 },
  { text: "bi", duration: 0.88, begin: 127.508, index: 309 },
  { text: "li", duration: 0.88, begin: 127.578, index: 310 },
  { text: "rim.", duration: 0.88, begin: 127.808, index: 311 },
  { text: " Bu", duration: 0.78, begin: 130.050, index: 312 },
  { text: " i", duration: 0.78, begin: 130.120, index: 313 },
  { text: "şe", duration: 0.78, begin: 130.208, index: 314 },
  { text: " da", duration: 0.78, begin: 131.398, index: 315 },
  { text: "ha", duration: 0.78, begin: 131.410, index: 316 },
  { text: " çok", duration: 0.78, begin: 131.808, index: 317 },
  { text: " za", duration: 0.98, begin: 132.208, index: 318 },
  { text: "man", duration: 0.98, begin: 132.808, index: 319 },
  { text: " a", duration: 0.98, begin: 133.108, index: 320 },
  { text: "yır", duration: 0.98, begin: 133.208, index: 321 },
  { text: "ma", duration: 0.98, begin: 133.308, index: 322 },
  { text: "lı", duration: 0.98, begin: 133.408, index: 323 },
  { text: "sın.", duration: 0.98, begin: 133.508, index: 324 },
  { text: " Da", duration: 0.78, begin: 135.328, index: 325 },
  { text: "ha", duration: 0.78, begin: 135.608, index: 326 },
  { text: " bü", duration: 0.78, begin: 135.808, index: 327 },
  { text: "yük", duration: 0.78, begin: 135.950, index: 328 },
  { text: " bir", duration: 0.78, begin: 136.808, index: 329 },
  { text: " tek", duration: 0.78, begin: 136.958, index: 330 },
  { text: "ne", duration: 0.78, begin: 137.108, index: 331 },
  { text: " bu", duration: 0.78, begin: 137.508, index: 332 },
  { text: "lup", duration: 0.78, begin: 137.708, index: 333 },
  { text: " da", duration: 0.78, begin: 138.950, index: 334 },
  { text: "ha", duration: 0.78, begin: 139.120, index: 335 },
  { text: " çok", duration: 0.78, begin: 139.308, index: 336 },
  { text: " ba", duration: 0.58, begin: 140.408, index: 337 },
  { text: "lık", duration: 0.78, begin: 140.510, index: 338 },
  { text: " tut", duration: 0.78, begin: 140.808, index: 339 },
  { text: "ma", duration: 0.78, begin: 140.980, index: 340 },
  { text: "lı", duration: 0.78, begin: 141.108, index: 341 },
  { text: "sın.", duration: 0.78, begin: 141.208, index: 342 },
  { text: " O", duration: 0.78, begin: 142.550, index: 343 },
  { text: "ra", duration: 0.78, begin: 142.808, index: 344 },
  { text: "dan", duration: 0.78, begin: 143.108, index: 345 },
  { text: " el", duration: 0.78, begin: 144.308, index: 346 },
  { text: "de", duration: 0.78, begin: 144.508, index: 347 },
  { text: " e", duration: 0.78, begin: 144.808, index: 348 },
  { text: "de", duration: 0.78, begin: 144.908, index: 349 },
  { text: "ce", duration: 0.78, begin: 145.108, index: 350 },
  { text: "ğin", duration: 0.78, begin: 145.208, index: 351 },
  { text: " ge", duration: 0.98, begin: 145.308, index: 352 },
  { text: "lir", duration: 0.98, begin: 145.508, index: 353 },
  { text: "le", duration: 0.98, begin: 145.708, index: 354 },
  { text: " da", duration: 0.78, begin: 147.508, index: 355 },
  { text: "ha", duration: 0.78, begin: 147.990, index: 356 },
  { text: " bü", duration: 0.78, begin: 148.108, index: 357 },
  { text: "yük", duration: 0.78, begin: 148.358, index: 358 },
  { text: " tek", duration: 0.78, begin: 148.808, index: 359 },
  { text: "ne", duration: 0.78, begin: 149.108, index: 360 },
  { text: "ler", duration: 0.78, begin: 149.408, index: 361 },
  { text: " a", duration: 0.78, begin: 149.708, index: 362 },
  { text: "lır", duration: 0.78, begin: 149.908, index: 363 },
  { text: "sın.", duration: 0.78, begin: 150.108, index: 364 },
  { text: " Kı", duration: 0.78, begin: 150.990, index: 365 },
  { text: "sa", duration: 0.78, begin: 152.108, index: 366 },
  { text: " sü", duration: 0.78, begin: 152.308, index: 367 },
  { text: "re", duration: 0.78, begin: 152.508, index: 368 },
  { text: "de", duration: 0.90, begin: 152.708, index: 369 },
  { text: " bir", duration: 0.78, begin: 153.708, index: 370 },
  { text: " ba", duration: 0.78, begin: 153.908, index: 371 },
  { text: "lık", duration: 0.78, begin: 154.108, index: 372 },
  { text: "çı", duration: 0.78, begin: 154.308, index: 373 },
  { text: " fi", duration: 0.83, begin: 154.508, index: 374 },
  { text: "lo", duration: 0.83, begin: 154.708, index: 375 },
  { text: "su", duration: 0.83, begin: 154.908, index: 376 },
  { text: "na", duration: 0.83, begin: 155.108, index: 377 },
  { text: " sa", duration: 0.48, begin: 157.108, index: 378 },
  { text: "hip", duration: 0.78, begin: 157.110, index: 379 },
  { text: " o", duration: 0.83, begin: 157.208, index: 380 },
  { text: "lur", duration: 0.83, begin: 157.308, index: 381 },
  { text: "sun.", duration: 0.83, begin: 157.508, index: 382 },
  { text: " Böy", duration: 0.78, begin: 159.408, index: 383 },
  { text: "le", duration: 0.78, begin: 159.608, index: 384 },
  { text: "ce,", duration: 0.78, begin: 159.908, index: 385 },
  { text: " ya", duration: 0.78, begin: 161.108, index: 386 },
  { text: "ka", duration: 0.78, begin: 161.308, index: 387 },
  { text: "la", duration: 0.78, begin: 161.408, index: 388 },
  { text: "dı", duration: 0.78, begin: 161.608, index: 389 },
  { text: "ğın", duration: 0.78, begin: 161.808, index: 390 },
  { text: " ba", duration: 0.48, begin: 162.808, index: 391 },
  { text: "lı", duration: 0.78, begin: 162.900, index: 392 },
  { text: "ğı", duration: 0.78, begin: 163.108, index: 393 },
  { text: " a", duration: 0.78, begin: 163.908, index: 394 },
  { text: "ra", duration: 0.78, begin: 164.108, index: 395 },
  { text: "cı", duration: 0.78, begin: 164.308, index: 396 },
  { text: "la", duration: 0.78, begin: 164.508, index: 397 },
  { text: "ra", duration: 0.78, begin: 164.708, index: 398 },
  { text: " de", duration: 0.78, begin: 164.950, index: 399 },
  { text: "ğil,", duration: 0.78, begin: 165.120, index: 400 },
  { text: " doğ", duration: 0.78, begin: 166.608, index: 401 },
  { text: "ru", duration: 0.78, begin: 166.808, index: 402 },
  { text: "dan", duration: 0.78, begin: 166.990, index: 403 },
  { text: " iş", duration: 0.78, begin: 168.308, index: 404 },
  { text: "let", duration: 0.78, begin: 168.508, index: 405 },
  { text: "me", duration: 0.78, begin: 168.708, index: 406 },
  { text: " te", duration: 0.78, begin: 169.208, index: 407 },
  { text: "sis", duration: 0.78, begin: 169.508, index: 408 },
  { text: "le", duration: 0.78, begin: 169.908, index: 409 },
  { text: "ri", duration: 0.78, begin: 170.208, index: 410 },
  { text: "ne", duration: 0.78, begin: 170.508, index: 411 },
  { text: " sa", duration: 0.78, begin: 170.908, index: 412 },
  { text: "tar", duration: 0.78, begin: 171.208, index: 413 },
  { text: "sın.", duration: 0.78, begin: 171.408, index: 414 },
  { text: " Hat", duration: 0.78, begin: 172.908, index: 415 },
  { text: "ta", duration: 0.78, begin: 173.108, index: 416 },
  { text: " za", duration: 0.78, begin: 174.450, index: 417 },
  { text: "man", duration: 0.78, begin: 174.608, index: 418 },
  { text: "la", duration: 0.78, begin: 174.808, index: 419 },
  { text: " ken", duration: 0.78, begin: 176.208, index: 420 },
  { text: "di", duration: 0.78, begin: 176.508, index: 421 },
  { text: " ba", duration: 0.78, begin: 176.808, index: 422 },
  { text: "lık", duration: 0.78, begin: 177.208, index: 423 },
  { text: " fab", duration: 0.58, begin: 177.808, index: 424 },
  { text: "ri", duration: 0.58, begin: 177.990, index: 425 },
  { text: "ka", duration: 0.58, begin: 178.308, index: 426 },
  { text: "nı", duration: 0.58, begin: 178.408, index: 427 },
  { text: " bi", duration: 0.78, begin: 178.708, index: 428 },
  { text: "le", duration: 0.78, begin: 178.808, index: 429 },
  { text: " ku", duration: 0.78, begin: 179.708, index: 430 },
  { text: "ra", duration: 0.78, begin: 179.909, index: 431 },
  { text: "bi", duration: 0.78, begin: 180.101, index: 432 },
  { text: "lir", duration: 0.78, begin: 180.308, index: 433 },
  { text: "sin.", duration: 0.78, begin: 180.508, index: 434 },
  { text: " Kı", duration: 0.78, begin: 181.908, index: 435 },
  { text: "sa", duration: 0.78, begin: 182.208, index: 436 },
  { text: " za", duration: 0.78, begin: 182.408, index: 437 },
  { text: "man", duration: 0.78, begin: 182.608, index: 438 },
  { text: "da", duration: 0.78, begin: 182.808, index: 439 },
  { text: " ba", duration: 0.78, begin: 184.208, index: 440 },
  { text: "lık", duration: 0.78, begin: 184.508, index: 441 },
  { text: "çı", duration: 0.78, begin: 184.708, index: 442 },
  { text: "lık", duration: 0.78, begin: 184.909, index: 443 },
  { text: " sek", duration: 0.78, begin: 185.508, index: 444 },
  { text: "tö", duration: 0.78, begin: 185.808, index: 445 },
  { text: "rün", duration: 0.78, begin: 185.990, index: 446 },
  { text: "de", duration: 0.78, begin: 186.208, index: 447 },
  { text: " bir", duration: 0.58, begin: 188.208, index: 448 },
  { text: " nu", duration: 0.78, begin: 188.258, index: 449 },
  { text: "ma", duration: 0.78, begin: 188.408, index: 450 },
  { text: "ra", duration: 0.78, begin: 188.508, index: 451 },
  { text: " o", duration: 0.78, begin: 188.880, index: 452 },
  { text: "lur", duration: 0.78, begin: 189.108, index: 453 },
  { text: "sun.", duration: 0.78, begin: 189.308, index: 454 },
  { text: " Ba", duration: 0.78, begin: 190.608, index: 455 },
  { text: "lık", duration: 0.78, begin: 190.990, index: 456 },
  { text: "çı", duration: 0.78, begin: 191.108, index: 457 },
  { text: " me", duration: 0.78, begin: 191.308, index: 458 },
  { text: "rak", duration: 0.78, begin: 191.508, index: 459 },
  { text: "la:", duration: 0.78, begin: 191.808, index: 460 },
  { text: " Bun", duration: 0.78, begin: 193.508, index: 461 },
  { text: "la", duration: 0.78, begin: 193.808, index: 462 },
  { text: "rı", duration: 0.78, begin: 193.990, index: 463 },
  { text: " yap", duration: 0.78, begin: 194.508, index: 464 },
  { text: "mak", duration: 0.78, begin: 194.808, index: 465 },
  { text: " kaç", duration: 0.78, begin: 195.608, index: 466 },
  { text: " se", duration: 0.78, begin: 195.808, index: 467 },
  { text: "ne", duration: 0.78, begin: 195.990, index: 468 },
  { text: " a", duration: 0.78, begin: 196.308, index: 469 },
  { text: "lır", duration: 0.78, begin: 196.508, index: 470 },
  { text: " sen", duration: 0.98, begin: 196.808, index: 471 },
  { text: " yor", duration: 0.78, begin: 197.108, index: 472 },
  { text: " di", duration: 0.78, begin: 198.408, index: 473 },
  { text: " ye", duration: 0.78, begin: 198.508, index: 474 },
  { text: " sor", duration: 0.78, begin: 198.808, index: 475 },
  { text: " muş.", duration: 0.78, begin: 198.990, index: 476 },
  { text: " A", duration: 0.78, begin: 200.808, index: 477 },
  { text: "dam:", duration: 0.78, begin: 201.108, index: 478 },
  { text: " 15-", duration: 0.78, begin: 202.508, index: 479 },
  { text: "20", duration: 0.78, begin: 202.808, index: 480 },
  { text: " yıl", duration: 0.78, begin: 203.808, index: 481 },
  { text: "da", duration: 0.78, begin: 203.990, index: 482 },
  { text: " hal", duration: 0.78, begin: 204.208, index: 483 },
  { text: "le", duration: 0.78, begin: 204.508, index: 484 },
  { text: "der", duration: 0.78, begin: 204.808, index: 485 },
  { text: "sin", duration: 0.78, begin: 204.990, index: 486 },
  { text: " de", duration: 0.78, begin: 206.108, index: 487 },
  { text: "miş.", duration: 0.78, begin: 206.308, index: 488 },
  { text: " A", duration: 0.78, begin: 207.990, index: 489 },
  { text: "ma", duration: 0.78, begin: 208.108, index: 490 },
  { text: " son", duration: 0.78, begin: 208.308, index: 491 },
  { text: "ra", duration: 0.78, begin: 208.508, index: 492 },
  { text: "sı", duration: 0.78, begin: 208.808, index: 493 },
  { text: " da", duration: 0.78, begin: 209.208, index: 494 },
  { text: "ha", duration: 0.78, begin: 209.508, index: 495 },
  { text: " par", duration: 0.78, begin: 209.808, index: 496 },
  { text: "lak;", duration: 0.78, begin: 209.990, index: 497 },
  { text: " Za", duration: 0.78, begin: 211.508, index: 498 },
  { text: "ma", duration: 0.78, begin: 211.808, index: 499 },
  { text: "nı", duration: 0.78, begin: 212.108, index: 500 },
  { text: " ge", duration: 0.78, begin: 212.208, index: 501 },
  { text: "lin", duration: 0.78, begin: 212.508, index: 502 },
  { text: "ce", duration: 0.78, begin: 212.808, index: 503 },
  { text: " şir", duration: 0.78, begin: 214.208, index: 504 },
  { text: "ke", duration: 0.78, begin: 214.508, index: 505 },
  { text: "ti", duration: 0.78, begin: 214.808, index: 506 },
  { text: "ni", duration: 0.78, begin: 215.208, index: 507 },
  { text: " hal", duration: 0.58, begin: 215.708, index: 508 },
  { text: "ka", duration: 0.78, begin: 215.850, index: 509 },
  { text: " a", duration: 0.78, begin: 216.150, index: 510 },
  { text: "çar", duration: 0.78, begin: 216.350, index: 511 },
  { text: "sın,", duration: 0.78, begin: 216.450, index: 512 },
  { text: " his", duration: 0.78, begin: 217.990, index: 513 },
  { text: "se", duration: 0.78, begin: 218.150, index: 514 },
  { text: " le", duration: 0.78, begin: 218.250, index: 515 },
  { text: "ri", duration: 0.78, begin: 218.500, index: 516 },
  { text: "ni", duration: 0.78, begin: 218.750, index: 517 },
  { text: " i", duration: 0.78, begin: 219.850, index: 518 },
  { text: "yi", duration: 0.78, begin: 219.990, index: 519 },
  { text: " pa", duration: 0.78, begin: 220.250, index: 520 },
  { text: "ra", duration: 0.78, begin: 220.750, index: 521 },
  { text: "ya", duration: 0.78, begin: 220.990, index: 522 },
  { text: " sa", duration: 0.78, begin: 221.250, index: 523 },
  { text: "tar", duration: 0.78, begin: 221.500, index: 524 },
  { text: "sın,", duration: 0.78, begin: 221.750, index: 525 },
  { text: " kı", duration: 0.78, begin: 223.250, index: 526 },
  { text: "sa", duration: 0.78, begin: 223.500, index: 527 },
  { text: " za", duration: 0.78, begin: 223.750, index: 528 },
  { text: "man", duration: 0.78, begin: 223.990, index: 529 },
  { text: "da", duration: 0.78, begin: 224.250, index: 530 },
  { text: " zen", duration: 0.58, begin: 226.000, index: 531 },
  { text: "gin", duration: 0.78, begin: 226.250, index: 532 },
  { text: " o", duration: 0.78, begin: 226.500, index: 533 },
  { text: "lup", duration: 0.78, begin: 226.750, index: 534 },
  { text: " mil", duration: 0.78, begin: 227.850, index: 535 },
  { text: "yon", duration: 0.78, begin: 228.200, index: 536 },
  { text: "lar", duration: 0.78, begin: 228.750, index: 537 },
  { text: " ka", duration: 0.78, begin: 228.990, index: 538 },
  { text: "za", duration: 0.78, begin: 229.250, index: 539 },
  { text: "nır", duration: 0.78, begin: 229.500, index: 540 },
  { text: "sın.", duration: 0.78, begin: 229.750, index: 541 },
  { text: " Mil", duration: 0.78, begin: 231.250, index: 542 },
  { text: "yon", duration: 0.78, begin: 231.500, index: 543 },
  { text: "lar", duration: 0.78, begin: 231.750, index: 544 },
  { text: " ha,", duration: 0.78, begin: 231.990, index: 545 },
  { text: " di", duration: 0.58, begin: 233.450, index: 546 },
  { text: "ye", duration: 0.78, begin: 233.500, index: 547 },
  { text: " tek", duration: 0.78, begin: 233.990, index: 548 },
  { text: "rar", duration: 0.78, begin: 234.200, index: 549 },
  { text: "la", duration: 0.78, begin: 234.500, index: 550 },
  { text: "mış", duration: 0.78, begin: 234.750, index: 551 },
  { text: " ba", duration: 0.78, begin: 235.250, index: 552 },
  { text: "lık", duration: 0.78, begin: 235.500, index: 553 },
  { text: "çı.", duration: 0.78, begin: 235.750, index: 554 },
  { text: " Eeee....", duration: 0.98, begin: 236.500, index: 555 },
  { text: " son", duration: 0.78, begin: 237.990, index: 556 },
  { text: "ra?", duration: 0.78, begin: 238.250, index: 557 },
  { text: " Son", duration: 0.78, begin: 239.750, index: 558 },
  { text: "ra", duration: 0.83, begin: 239.990, index: 559 },
  { text: " e", duration: 0.83, begin: 240.250, index: 560 },
  { text: "mek", duration: 0.83, begin: 240.500, index: 561 },
  { text: "li", duration: 0.83, begin: 240.750, index: 562 },
  { text: " o", duration: 0.83, begin: 240.990, index: 563 },
  { text: "lur", duration: 0.83, begin: 241.250, index: 564 },
  { text: "sun.", duration: 0.78, begin: 241.500, index: 565 },
  { text: " Kü", duration: 0.78, begin: 243.250, index: 566 },
  { text: "çük", duration: 0.78, begin: 243.500, index: 567 },
  { text: " bir", duration: 0.83, begin: 243.750, index: 568 },
  { text: " ba", duration: 0.78, begin: 244.250, index: 569 },
  { text: "lık", duration: 0.78, begin: 244.350, index: 570 },
  { text: "çı", duration: 0.78, begin: 244.500, index: 571 },
  { text: " ka", duration: 0.83, begin: 244.850, index: 572 },
  { text: "sa", duration: 0.78, begin: 245.250, index: 573 },
  { text: "ba", duration: 0.78, begin: 245.500, index: 574 },
  { text: "sı", duration: 0.78, begin: 245.800, index: 575 },
  { text: "na", duration: 0.78, begin: 246.000, index: 576 },
  { text: " yer", duration: 0.83, begin: 246.250, index: 577 },
  { text: "le", duration: 0.83, begin: 246.500, index: 578 },
  { text: "şir", duration: 0.83, begin: 246.750, index: 579 },
  { text: "sin.", duration: 0.83, begin: 246.850, index: 580 },
  { text: " İs", duration: 0.53, begin: 249.500, index: 581 },
  { text: "ter", duration: 0.78, begin: 249.550, index: 582 },
  { text: "sen", duration: 0.78, begin: 249.700, index: 583 },
  { text: " zevk", duration: 0.78, begin: 251.100, index: 584 },
  { text: " i", duration: 0.78, begin: 251.350, index: 585 },
  { text: "çin", duration: 0.78, begin: 251.900, index: 586 },
  { text: " ba", duration: 0.78, begin: 252.350, index: 587 },
  { text: "lık", duration: 0.78, begin: 252.550, index: 588 },
  { text: " tu", duration: 0.78, begin: 252.800, index: 589 },
  { text: "tar", duration: 0.78, begin: 252.900, index: 590 },
  { text: "sın.", duration: 0.78, begin: 253.150, index: 591 },
  { text: " Ço", duration: 0.53, begin: 255.150, index: 592 },
  { text: "cuk", duration: 0.78, begin: 255.250, index: 593 },
  { text: "la", duration: 0.78, begin: 255.550, index: 594 },
  { text: "rın", duration: 0.78, begin: 255.808, index: 595 },
  { text: "la", duration: 0.78, begin: 256.150, index: 596 },
  { text: " oy", duration: 0.78, begin: 256.350, index: 597 },
  { text: "nar,", duration: 0.78, begin: 256.550, index: 598 },
  { text: " ka", duration: 0.53, begin: 258.350, index: 599 },
  { text: "rın", duration: 0.78, begin: 258.450, index: 600 },
  { text: "la", duration: 0.78, begin: 258.800, index: 601 },
  { text: " key", duration: 0.68, begin: 259.850, index: 602 },
  { text: "fin", duration: 0.78, begin: 259.990, index: 603 },
  { text: "ce", duration: 0.78, begin: 260.150, index: 604 },
  { text: " si", duration: 0.98, begin: 260.350, index: 605 },
  { text: "es", duration: 0.98, begin: 260.550, index: 606 },
  { text: "ta", duration: 0.98, begin: 260.850, index: 607 },
  { text: " ya", duration: 0.98, begin: 260.990, index: 608 },
  { text: "par", duration: 0.98, begin: 261.150, index: 609 },
  { text: "sın.", duration: 0.98, begin: 261.350, index: 610 },
  { text: " Ak", duration: 0.78, begin: 263.800, index: 611 },
  { text: "şam", duration: 0.83, begin: 264.100, index: 612 },
  { text: "la", duration: 0.83, begin: 264.350, index: 613 },
  { text: "rı", duration: 0.83, begin: 264.550, index: 614 },
  { text: "da", duration: 0.83, begin: 264.850, index: 615 },
  { text: " ar", duration: 0.78, begin: 266.800, index: 616 },
  { text: "ka", duration: 0.78, begin: 266.900, index: 617 },
  { text: "daş", duration: 0.78, begin: 267.250, index: 618 },
  { text: "la", duration: 0.78, begin: 267.550, index: 619 },
  { text: "rın", duration: 0.78, begin: 267.850, index: 620 },
  { text: "la", duration: 0.78, begin: 267.990, index: 621 },
  { text: " şa", duration: 0.53, begin: 269.350, index: 622 },
  { text: "rap", duration: 0.78, begin: 269.450, index: 623 },
  { text: " i", duration: 0.78, begin: 269.650, index: 624 },
  { text: "çip", duration: 0.78, begin: 269.850, index: 625 },
  { text: " ge", duration: 0.53, begin: 271.250, index: 626 },
  { text: "ce", duration: 0.78, begin: 271.300, index: 627 },
  { text: " ya", duration: 0.78, begin: 271.750, index: 628 },
  { text: "rı", duration: 0.78, begin: 271.950, index: 629 },
  { text: "sı", duration: 0.78, begin: 272.150, index: 630 },
  { text: "na", duration: 0.78, begin: 272.350, index: 631 },
  { text: " ka", duration: 0.78, begin: 272.750, index: 632 },
  { text: "dar", duration: 0.78, begin: 272.950, index: 633 },
  { text: " gi", duration: 0.78, begin: 273.350, index: 634 },
  { text: "tar", duration: 0.78, begin: 273.550, index: 635 },
  { text: " ça", duration: 0.78, begin: 273.750, index: 636 },
  { text: "lar", duration: 0.78, begin: 273.990, index: 637 },
  { text: "sın.", duration: 0.78, begin: 274.200, index: 638 },
]
  

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
  <Link href="/dashboard/stories/kir-zincilerini" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/your-next-story-link" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/1-2.mp3"
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