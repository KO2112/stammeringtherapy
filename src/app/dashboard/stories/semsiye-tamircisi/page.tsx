"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, ArrowLeft, SkipForward, SkipBack,ChevronLeft,} from "lucide-react"
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
  { text: "Şem", duration: 0.28, begin: 0.729, index: 1, isTitle: true, isCenter: true },
  { text: "si", duration: 0.38, begin: 1.218, index: 2, isTitle: true, isCenter: true },
  { text: "ye", duration: 0.38, begin: 1.378, index: 3, isTitle: true, isCenter: true },
  { text: " Ta", duration: 0.58, begin: 1.508, index: 4, isTitle: true, isCenter: true },
  { text: "mir", duration: 0.48, begin: 1.908, index: 5, isTitle: true, isCenter: true },
  { text: "ci", duration: 0.48, begin: 2.108, index: 6, isTitle: true, isCenter: true },
  { text: "si", duration: 0.98, begin: 2.308, index: 7, isTitle: true, isCenter: true },
  
  // Story content
  { text: " Gez", duration: 0.28, begin: 4.008, index: 8 },
  { text: "gin", duration: 0.48, begin: 4.308, index: 9 },
  { text: "ci", duration: 0.48, begin: 4.368, index: 10 },
  { text: " bir", duration: 0.48, begin: 4.708, index: 11 },
  { text: " şem", duration: 0.48, begin: 4.908, index: 12 },
  { text: "si", duration: 0.68, begin: 5.108, index: 13 },
  { text: "ye", duration: 0.68, begin: 5.408, index: 14 },
  { text: " ta", duration: 0.78, begin: 5.608, index: 15 },
  { text: "mir", duration: 0.78, begin: 5.908, index: 16 },
  { text: "ci", duration: 0.78, begin: 6.308, index: 17 },
  { text: "si", duration: 0.98, begin: 6.608, index: 18 },
  { text: " yol", duration: 0.48, begin: 7.808, index: 19 },
  { text: " ke", duration: 0.48, begin: 8.058, index: 20 },
  { text: "na", duration: 0.48, begin: 8.208, index: 21 },
  { text: "rın", duration: 0.48, begin: 8.408, index: 22 },
  { text: "da", duration: 0.78, begin: 8.608, index: 23 },
  { text: " o", duration: 0.98, begin: 8.858, index: 24 },
  { text: "tur", duration: 0.98, begin: 9.108, index: 25 },
  { text: "muş", duration: 0.90, begin: 9.308, index: 26 },
  { text: " i", duration: 0.70, begin: 10.608, index: 27 },
  { text: "şi", duration: 0.98, begin: 10.658, index: 28 },
  { text: "ni", duration: 0.98, begin: 10.708, index: 29 },
  { text: " ya", duration: 0.98, begin: 10.808, index: 30 },
  { text: "pı", duration: 0.98, begin: 11.008, index: 31 },
  { text: "yor", duration: 0.98, begin: 11.408, index: 32 },
  { text: "du.", duration: 0.98, begin: 11.808, index: 33 },
  { text: " Ta", duration: 0.98, begin: 13.308, index: 34 },
  { text: "mir", duration: 0.98, begin: 13.508, index: 35 },
  { text: "ci", duration: 0.98, begin: 13.808, index: 36 },
  { text: " i", duration: 0.98, begin: 14.908, index: 37 },
  { text: "şi", duration: 0.98, begin: 15.058, index: 38 },
  { text: "nin", duration: 0.98, begin: 15.308, index: 39 },
  { text: " ge", duration: 0.98, begin: 15.608, index: 40 },
  { text: "rek", duration: 0.98, begin: 15.908, index: 41 },
  { text: "le", duration: 0.98, begin: 16.108, index: 42 },
  { text: "ri", duration: 0.98, begin: 16.308, index: 43 },
  { text: "ni", duration: 0.98, begin: 16.508, index: 44 },
  { text: " ye", duration: 0.98, begin: 17.508, index: 45 },
  { text: "ri", duration: 0.98, begin: 17.708, index: 46 },
  { text: "ne", duration: 0.98, begin: 17.908, index: 47 },
  { text: " ge", duration: 0.98, begin: 18.108, index: 48 },
  { text: "ti", duration: 0.98, begin: 18.308, index: 49 },
  { text: "ri", duration: 0.98, begin: 18.608, index: 50 },
  { text: "yor,", duration: 0.98, begin: 18.908, index: 51 },
  { text: " ta", duration: 0.98, begin: 20.108, index: 52 },
  { text: "mir", duration: 0.98, begin: 20.308, index: 53 },
  { text: " e", duration: 0.98, begin: 20.608, index: 54 },
  { text: "di", duration: 0.98, begin: 20.808, index: 55 },
  { text: "le", duration: 0.98, begin: 21.008, index: 56 },
  { text: "cek", duration: 0.98, begin: 21.308, index: 57 },
  { text: " kı", duration: 0.98, begin: 21.608, index: 58 },
  { text: "sım", duration: 0.98, begin: 21.908, index: 59 },
  { text: "la", duration: 0.98, begin: 22.108, index: 60 },
  { text: "rı", duration: 0.98, begin: 22.308, index: 61 },
  { text: " dik", duration: 0.98, begin: 23.908, index: 62 },
  { text: "kat", duration: 0.98, begin: 24.108, index: 63 },
  { text: "le", duration: 0.98, begin: 24.308, index: 64 },
  { text: " öl", duration: 0.98, begin: 24.608, index: 65 },
  { text: "çü", duration: 0.98, begin: 24.808, index: 66 },
  { text: "yor,", duration: 0.98, begin: 25.008, index: 67 },
  { text: " ya", duration: 0.98, begin: 26.408, index: 68 },
  { text: "ma", duration: 0.98, begin: 26.608, index: 69 },
  { text: " ko", duration: 0.98, begin: 26.908, index: 70 },
  { text: "yu", duration: 0.98, begin: 27.208, index: 71 },
  { text: "yor,", duration: 0.98, begin: 27.508, index: 72 },
  { text: " tel", duration: 0.88, begin: 28.908, index: 73 },
  { text: "le", duration: 0.88, begin: 29.108, index: 74 },
  { text: "ri", duration: 0.88, begin: 29.308, index: 75 },
  { text: " te", duration: 0.78, begin: 29.708, index: 76 },
  { text: "ker", duration: 0.98, begin: 29.908, index: 77 },
  { text: " te", duration: 0.98, begin: 30.108, index: 78 },
  { text: "ker", duration: 0.98, begin: 30.308, index: 79 },
  { text: " de", duration: 0.98, begin: 30.508, index: 80 },
  { text: "ne", duration: 0.98, begin: 30.808, index: 81 },
  { text: "ye", duration: 0.98, begin: 31.008, index: 82 },
  { text: "rek", duration: 0.98, begin: 31.208, index: 83 },
  { text: " güç", duration: 0.78, begin: 32.808, index: 84 },
  { text: "len", duration: 0.78, begin: 32.998, index: 85 },
  { text: "di", duration: 0.78, begin: 33.108, index: 86 },
  { text: "ri", duration: 0.78, begin: 33.408, index: 87 },
  { text: "yor", duration: 0.78, begin: 33.808, index: 88 },
  { text: "du.", duration: 0.78, begin: 33.908, index: 89 },
  { text: " U", duration: 0.98, begin: 35.208, index: 90 },
  { text: "zak", duration: 0.98, begin: 35.408, index: 91 },
  { text: "tan", duration: 0.98, begin: 35.608, index: 92 },
  { text: " ken", duration: 0.98, begin: 37.408, index: 93 },
  { text: "di", duration: 0.98, begin: 37.558, index: 94 },
  { text: "si", duration: 0.98, begin: 37.788, index: 95 },
  { text: "ni", duration: 0.98, begin: 37.998, index: 96 },
  { text: " ta", duration: 0.98, begin: 38.208, index: 97 },
  { text: "kip", duration: 0.98, begin: 38.408, index: 98 },
  { text: " e", duration: 0.98, begin: 38.808, index: 99 },
  { text: "den", duration: 0.98, begin: 39.108, index: 100 },
  { text: " gen", duration: 0.98, begin: 39.608, index: 101 },
  { text: "cin", duration: 0.98, begin: 39.908, index: 102 },
  { text: " far", duration: 0.78, begin: 41.608, index: 103 },
  { text: "kın", duration: 0.78, begin: 41.808, index: 104 },
  { text: "da", duration: 0.78, begin: 41.999, index: 105 },
  { text: " bi", duration: 0.98, begin: 42.208, index: 106 },
  { text: "le", duration: 0.98, begin: 42.408, index: 107 },
  { text: " de", duration: 0.98, begin: 42.608, index: 108 },
  { text: "ğil", duration: 0.98, begin: 42.808, index: 109 },
  { text: "di.", duration: 0.98, begin: 43.008, index: 110 },
  { text: " Bir", duration: 0.98, begin: 44.908, index: 111 },
  { text: " sü", duration: 0.98, begin: 45.108, index: 112 },
  { text: "re", duration: 0.98, begin: 45.308, index: 113 },
  { text: " son", duration: 0.98, begin: 45.608, index: 114 },
  { text: "ra", duration: 0.98, begin: 45.908, index: 115 },
  { text: " genç", duration: 0.98, begin: 47.408, index: 116 },
  { text: " ya", duration: 0.98, begin: 47.708, index: 117 },
  { text: "nı", duration: 0.98, begin: 48.198, index: 118 },
  { text: "na", duration: 0.98, begin: 48.308, index: 119 },
  { text: " yak", duration: 0.98, begin: 48.608, index: 120 },
  { text: "laş", duration: 0.98, begin: 48.908, index: 121 },
  { text: "tı", duration: 0.98, begin: 49.308, index: 122 },
  { text: " ve", duration: 0.98, begin: 50.308, index: 123 },
  { text: " hay", duration: 0.98, begin: 50.908, index: 124 },
  { text: "ran", duration: 0.98, begin: 51.208, index: 125 },
  { text: "lık", duration: 0.98, begin: 51.508, index: 126 },
  { text: " do", duration: 0.98, begin: 51.908, index: 127 },
  { text: "lu", duration: 0.98, begin: 52.208, index: 128 },
  { text: " i", duration: 0.98, begin: 52.508, index: 129 },
  { text: "fa", duration: 0.98, begin: 52.708, index: 130 },
  { text: "dey", duration: 0.98, begin: 52.908, index: 131 },
  { text: "le:", duration: 0.98, begin: 53.308, index: 132 },
  { text: " İ", duration: 0.98, begin: 54.708, index: 133 },
  { text: "şi", duration: 0.98, begin: 54.908, index: 134 },
  { text: "ni", duration: 0.98, begin: 55.108, index: 135 },
  { text: "zi", duration: 0.98, begin: 55.308, index: 136 },
  { text: " çok", duration: 0.98, begin: 55.508, index: 137 },
  { text: " i", duration: 0.98, begin: 55.808, index: 138 },
  { text: "yi", duration: 0.98, begin: 56.108, index: 139 },
  { text: " ya", duration: 0.98, begin: 56.708, index: 140 },
  { text: "pı", duration: 0.98, begin: 57.008, index: 141 },
  { text: "yor", duration: 0.98, begin: 57.208, index: 142 },
  { text: "su", duration: 0.98, begin: 57.608, index: 143 },
  { text: "nuz", duration: 0.98, begin: 57.908, index: 144 },
  { text: " de", duration: 0.48, begin: 59.008, index: 145 },
  { text: "di.", duration: 0.48, begin: 59.108, index: 146 },
  { text: " Şem", duration: 0.78, begin: 60.508, index: 147 },
  { text: "si", duration: 0.98, begin: 60.708, index: 148 },
  { text: "ye", duration: 0.98, begin: 60.908, index: 149 },
  { text: " ta", duration: 0.98, begin: 61.108, index: 150 },
  { text: "mir", duration: 0.98, begin: 61.408, index: 151 },
  { text: "ci", duration: 0.98, begin: 61.808, index: 152 },
  { text: "si", duration: 0.98, begin: 62.008, index: 153 },
  { text: " e", duration: 0.78, begin: 63.508, index: 154 },
  { text: "lin", duration: 0.78, begin: 63.708, index: 155 },
  { text: "de", duration: 0.78, begin: 63.908, index: 156 },
  { text: "ki", duration: 0.78, begin: 64.108, index: 157 },
  { text: " i", duration: 0.78, begin: 64.608, index: 158 },
  { text: "şi", duration: 0.78, begin: 64.908, index: 159 },
  { text: " bı", duration: 0.83, begin: 65.208, index: 160 },
  { text: "rak", duration: 0.83, begin: 65.508, index: 161 },
  { text: "ma", duration: 0.83, begin: 65.808, index: 162 },
  { text: "dan", duration: 0.83, begin: 66.108, index: 163 },
  { text: " ce", duration: 0.83, begin: 66.808, index: 164 },
  { text: "vap", duration: 0.78, begin: 67.108, index: 165 },
  { text: "la", duration: 0.98, begin: 67.308, index: 166 },
  { text: "dı:", duration: 0.98, begin: 67.508, index: 167 },
  { text: " E", duration: 0.98, begin: 68.808, index: 168 },
  { text: "vet,", duration: 0.98, begin: 69.108, index: 169 },
  { text: " ben", duration: 0.98, begin: 70.508, index: 170 },
  { text: " her", duration: 0.98, begin: 70.808, index: 171 },
  { text: " za", duration: 0.98, begin: 70.990, index: 172 },
  { text: "man", duration: 0.98, begin: 71.108, index: 173 },
  { text: " i", duration: 0.98, begin: 72.508, index: 174 },
  { text: "şi", duration: 0.98, begin: 72.708, index: 175 },
  { text: "mi", duration: 0.98, begin: 72.808, index: 176 },
  { text: " i", duration: 0.98, begin: 73.108, index: 177 },
  { text: "yi", duration: 0.98, begin: 73.308, index: 178 },
  { text: " yap", duration: 0.98, begin: 73.508, index: 179 },
  { text: "mak", duration: 0.98, begin: 73.808, index: 180 },
  { text: " i", duration: 0.98, begin: 74.308, index: 181 },
  { text: "çin", duration: 0.98, begin: 74.608, index: 182 },
  { text: " uğ", duration: 0.98, begin: 76.008, index: 183 },
  { text: "ra", duration: 0.98, begin: 76.208, index: 184 },
  { text: "şı", duration: 0.98, begin: 76.508, index: 185 },
  { text: "rım.", duration: 0.98, begin: 76.808, index: 186 },
  { text: " Müş", duration: 0.98, begin: 78.208, index: 187 },
  { text: "te", duration: 0.98, begin: 78.508, index: 188 },
  { text: "ri", duration: 0.98, begin: 78.808, index: 189 },
  { text: "le", duration: 0.98, begin: 78.990, index: 190 },
  { text: "rin", duration: 0.98, begin: 79.108, index: 191 },
  { text: " yap", duration: 0.98, begin: 80.250, index: 192 },
  { text: "tı", duration: 0.98, begin: 80.500, index: 193 },
  { text: "ğın", duration: 0.98, begin: 81.208, index: 194 },
  { text: " i", duration: 0.98, begin: 81.508, index: 195 },
  { text: "şin", duration: 0.98, begin: 81.708, index: 196 },
  { text: " i", duration: 0.98, begin: 82.909, index: 197 },
  { text: "yi", duration: 0.98, begin: 83.250, index: 198 },
  { text: " ya", duration: 0.98, begin: 83.500, index: 199 },
  { text: "da", duration: 0.98, begin: 83.750, index: 200 },
  { text: " kö", duration: 0.98, begin: 83.950, index: 201 },
  { text: "tü", duration: 0.98, begin: 84.250, index: 202 },
  { text: " ol", duration: 0.98, begin: 84.500, index: 203 },
  { text: "du", duration: 0.98, begin: 84.750, index: 204 },
  { text: "ğu", duration: 0.98, begin: 84.950, index: 205 },
  { text: "nu", duration: 0.98, begin: 85.250, index: 206 },
  { text: " an", duration: 0.98, begin: 86.200, index: 207 },
  { text: "cak", duration: 0.98, begin: 86.400, index: 208 },
  { text: " sen", duration: 0.98, begin: 87.550, index: 209 },
  { text: " git", duration: 0.98, begin: 87.750, index: 210 },
  { text: "tik", duration: 0.98, begin: 87.950, index: 211 },
  { text: "ten", duration: 0.98, begin: 88.808, index: 212 },
  { text: " son", duration: 0.98, begin: 89.150, index: 213 },
  { text: "ra", duration: 0.98, begin: 89.350, index: 214 },
  { text: " an", duration: 0.98, begin: 89.550, index: 215 },
  { text: "la", duration: 0.98, begin: 89.850, index: 216 },
  { text: "ya", duration: 0.98, begin: 90.150, index: 217 },
  { text: "bi", duration: 0.98, begin: 90.300, index: 218 },
  { text: "le", duration: 0.98, begin: 90.600, index: 219 },
  { text: "cek", duration: 0.98, begin: 90.808, index: 220 },
  { text: "ler", duration: 0.98, begin: 91.208, index: 221 },
  { text: " di", duration: 0.98, begin: 92.500, index: 222 },
  { text: "ye", duration: 0.98, begin: 92.800, index: 223 },
  { text: " de", duration: 0.98, begin: 93.150, index: 224 },
  { text: "vam", duration: 0.98, begin: 93.300, index: 225 },
  { text: " et", duration: 0.98, begin: 93.600, index: 226 },
  { text: "ti", duration: 0.98, begin: 93.850, index: 227 },
  { text: " de", duration: 0.98, begin: 94.150, index: 228 },
  { text: "li", duration: 0.98, begin: 94.300, index: 229 },
  { text: "kan", duration: 0.98, begin: 94.600, index: 230 },
  { text: "lı.", duration: 0.98, begin: 94.850, index: 231 },
  { text: " Şem", duration: 0.98, begin: 96.500, index: 232 },
  { text: "si", duration: 0.98, begin: 96.750, index: 233 },
  { text: "ye", duration: 0.98, begin: 97.100, index: 234 },
  { text: " Ta", duration: 0.98, begin: 97.350, index: 235 },
  { text: "mir", duration: 0.98, begin: 97.600, index: 236 },
  { text: "ci", duration: 0.98, begin: 97.850, index: 237 },
  { text: "si:", duration: 0.98, begin: 98.100, index: 238 },
  { text: " E", duration: 0.98, begin: 99.200, index: 239 },
  { text: "vet", duration: 0.98, begin: 99.450, index: 240 },
  { text: " hak", duration: 0.98, begin: 99.700, index: 241 },
  { text: "lı", duration: 0.98, begin: 99.950, index: 242 },
  { text: "sın.", duration: 0.98, begin: 100.200, index: 243 },
  { text: " Genç:", duration: 0.98, begin: 102.250, index: 244 },
  { text: " Bu", duration: 0.98, begin: 103.250, index: 245 },
  { text: " ta", duration: 0.98, begin: 103.500, index: 246 },
  { text: "ra", duration: 0.98, begin: 103.750, index: 247 },
  { text: "fa", duration: 0.98, begin: 104.000, index: 248 },
  { text: " tek", duration: 0.98, begin: 104.250, index: 249 },
  { text: "rar", duration: 0.98, begin: 104.500, index: 250 },
  { text: " ge", duration: 0.98, begin: 104.750, index: 251 },
  { text: "le", duration: 0.98, begin: 105.000, index: 252 },
  { text: "cek", duration: 0.98, begin: 105.250, index: 253 },
  { text: " mi", duration: 0.98, begin: 105.500, index: 254 },
  { text: "si", duration: 0.98, begin: 105.750, index: 255 },
  { text: "niz?", duration: 0.98, begin: 106.000, index: 256 },
  { text: " Şem", duration: 0.98, begin: 107.500, index: 257 },
  { text: "si", duration: 0.98, begin: 107.750, index: 258 },
  { text: "ye", duration: 0.98, begin: 108.000, index: 259 },
  { text: " Ta", duration: 0.98, begin: 108.250, index: 260 },
  { text: "mir", duration: 0.98, begin: 108.500, index: 261 },
  { text: "ci", duration: 0.98, begin: 108.750, index: 262 },
  { text: "si:", duration: 0.98, begin: 109.000, index: 263 },
  { text: " Ha", duration: 0.78, begin: 110.500, index: 264 },
  { text: "yır.", duration: 0.98, begin: 110.750, index: 265 },
  { text: " Genç:", duration: 0.98, begin: 112.500, index: 266 },
  { text: " O", duration: 0.98, begin: 113.250, index: 267 },
  { text: " hal", duration: 0.98, begin: 113.350, index: 268 },
  { text: "de", duration: 0.98, begin: 113.750, index: 269 },
  { text: " bir", duration: 0.98, begin: 114.850, index: 270 },
  { text: " şem", duration: 0.98, begin: 115.000, index: 271 },
  { text: "si", duration: 0.98, begin: 115.250, index: 272 },
  { text: "ye", duration: 0.98, begin: 115.500, index: 273 },
  { text: " i", duration: 0.98, begin: 115.850, index: 274 },
  { text: "çin", duration: 0.98, begin: 116.000, index: 275 },
  { text: " ne", duration: 0.78, begin: 117.450, index: 276 },
  { text: "den", duration: 0.78, begin: 117.650, index: 277 },
  { text: " bu", duration: 0.78, begin: 117.950, index: 278 },
  { text: " ka", duration: 0.78, begin: 118.000, index: 279 },
  { text: "dar", duration: 0.78, begin: 118.250, index: 280 },
  { text: " uğ", duration: 0.98, begin: 118.500, index: 281 },
  { text: "ra", duration: 0.98, begin: 118.750, index: 282 },
  { text: "şı", duration: 0.98, begin: 119.000, index: 283 },
  { text: "yor", duration: 0.98, begin: 119.250, index: 284 },
  { text: "su", duration: 0.98, begin: 119.500, index: 285 },
  { text: "nuz?", duration: 0.98, begin: 119.750, index: 286 },
  { text: " Hal", duration: 0.78, begin: 121.850, index: 287 },
  { text: " bu", duration: 0.78, begin: 122.000, index: 288 },
  { text: " ki", duration: 0.78, begin: 123.000, index: 289 },
  { text: " i", duration: 0.78, begin: 123.250, index: 290 },
  { text: "şi", duration: 0.78, begin: 123.500, index: 291 },
  { text: "ni", duration: 0.78, begin: 123.750, index: 292 },
  { text: "zi", duration: 0.78, begin: 124.000, index: 293 },
  { text: " ça", duration: 0.78, begin: 124.450, index: 294 },
  { text: "bu", duration: 0.78, begin: 124.550, index: 295 },
  { text: "cak", duration: 0.78, begin: 124.750, index: 296 },
  { text: " hal", duration: 0.78, begin: 125.000, index: 297 },
  { text: "le", duration: 0.78, begin: 125.250, index: 298 },
  { text: "dip", duration: 0.78, begin: 125.500, index: 299 },
  { text: " i", duration: 0.78, begin: 126.550, index: 300 },
  { text: "le", duration: 0.78, begin: 126.750, index: 301 },
  { text: "ri", duration: 0.78, begin: 127.000, index: 302 },
  { text: " de", duration: 0.78, begin: 127.250, index: 303 },
  { text: " ye", duration: 0.48, begin: 128.350, index: 304 },
  { text: "ni", duration: 0.53, begin: 128.550, index: 305 },
  { text: " müş", duration: 0.53, begin: 129.000, index: 306 },
  { text: "te", duration: 0.53, begin: 129.250, index: 307 },
  { text: "ri", duration: 0.53, begin: 129.500, index: 308 },
  { text: "ler", duration: 0.53, begin: 129.750, index: 309 },
  { text: " bu", duration: 0.53, begin: 130.000, index: 310 },
  { text: "la", duration: 0.53, begin: 130.250, index: 311 },
  { text: "bi", duration: 0.53, begin: 130.500, index: 312 },
  { text: "lir", duration: 0.53, begin: 130.750, index: 313 },
  { text: "si", duration: 0.53, begin: 131.000, index: 314 },
  { text: "niz.", duration: 0.53, begin: 131.250, index: 315 },
  { text: " Çok", duration: 0.98, begin: 132.500, index: 316 },
  { text: " faz", duration: 0.98, begin: 132.750, index: 317 },
  { text: "la", duration: 0.98, begin: 133.000, index: 318 },
  { text: " ko", duration: 0.53, begin: 134.750, index: 319 },
  { text: "nuş", duration: 0.53, begin: 135.000, index: 320 },
  { text: "ma", duration: 0.53, begin: 135.250, index: 321 },
  { text: "yı", duration: 0.53, begin: 135.500, index: 322 },
  { text: " sev", duration: 0.53, begin: 135.750, index: 323 },
  { text: "me", duration: 0.53, begin: 136.000, index: 324 },
  { text: "yen", duration: 0.53, begin: 136.250, index: 325 },
  { text: " şem", duration: 0.53, begin: 137.500, index: 326 },
  { text: "si", duration: 0.53, begin: 137.750, index: 327 },
  { text: "ye", duration: 0.53, begin: 138.000, index: 328 },
  { text: " ta", duration: 0.53, begin: 138.250, index: 329 },
  { text: "mir", duration: 0.53, begin: 138.500, index: 330 },
  { text: "ci", duration: 0.53, begin: 138.750, index: 331 },
  { text: "si", duration: 0.53, begin: 139.000, index: 332 },
  { text: " gen", duration: 0.53, begin: 140.250, index: 333 },
  { text: "ce", duration: 0.53, begin: 140.500, index: 334 },
  { text: " ders", duration: 0.53, begin: 140.750, index: 335 },
  { text: " ni", duration: 0.53, begin: 141.000, index: 336 },
  { text: "te", duration: 0.53, begin: 141.250, index: 337 },
  { text: "li", duration: 0.53, begin: 141.500, index: 338 },
  { text: "ğin", duration: 0.53, begin: 141.750, index: 339 },
  { text: "de", duration: 0.53, begin: 142.000, index: 340 },
  { text: " şu", duration: 0.53, begin: 143.250, index: 341 },
  { text: " ce", duration: 0.53, begin: 143.500, index: 342 },
  { text: "va", duration: 0.53, begin: 143.750, index: 343 },
  { text: "bı", duration: 0.53, begin: 144.000, index: 344 },
  { text: " ver", duration: 0.53, begin: 144.250, index: 345 },
  { text: "di:", duration: 0.53, begin: 144.500, index: 346 },
  { text: " E", duration: 0.53, begin: 146.500, index: 347 },
  { text: "ğer", duration: 0.53, begin: 146.750, index: 348 },
  { text: " ben", duration: 0.53, begin: 147.000, index: 349 },
  { text: " i", duration: 0.53, begin: 148.250, index: 350 },
  { text: "şi", duration: 0.53, begin: 148.500, index: 351 },
  { text: "mi", duration: 0.53, begin: 148.750, index: 352 },
  { text: " i", duration: 0.53, begin: 149.000, index: 353 },
  { text: "yi", duration: 0.53, begin: 149.250, index: 354 },
  { text: " ya", duration: 0.53, begin: 149.500, index: 355 },
  { text: "par", duration: 0.53, begin: 149.750, index: 356 },
  { text: "sam,", duration: 0.53, begin: 150.000, index: 357 },
  { text: " ben", duration: 0.53, begin: 151.000, index: 358 },
  { text: "den", duration: 0.53, begin: 151.250, index: 359 },
  { text: " son", duration: 0.53, begin: 152.250, index: 360 },
  { text: "ra", duration: 0.53, begin: 152.500, index: 361 },
  { text: " bu", duration: 0.53, begin: 153.250, index: 362 },
  { text: "ra", duration: 0.53, begin: 153.500, index: 363 },
  { text: "dan", duration: 0.53, begin: 153.750, index: 364 },
  { text: " ge", duration: 0.53, begin: 154.500, index: 365 },
  { text: "çe", duration: 0.53, begin: 154.750, index: 366 },
  { text: "cek", duration: 0.53, begin: 155.000, index: 367 },
  { text: " ta", duration: 0.53, begin: 155.500, index: 368 },
  { text: "mir", duration: 0.53, begin: 155.750, index: 369 },
  { text: "ci", duration: 0.53, begin: 156.000, index: 370 },
  { text: "nin", duration: 0.53, begin: 156.250, index: 371 },
  { text: " i", duration: 0.53, begin: 157.250, index: 372 },
  { text: "şi", duration: 0.53, begin: 157.500, index: 373 },
  { text: " ko", duration: 0.53, begin: 157.750, index: 374 },
  { text: "lay", duration: 0.53, begin: 158.000, index: 375 },
  { text: "la", duration: 0.53, begin: 158.250, index: 376 },
  { text: "şa", duration: 0.53, begin: 158.500, index: 377 },
  { text: "cak.", duration: 0.53, begin: 158.750, index: 378 },
  { text: " Fa", duration: 0.53, begin: 160.250, index: 379 },
  { text: "kat", duration: 0.53, begin: 160.500, index: 380 },
  { text: " kö", duration: 0.53, begin: 161.500, index: 381 },
  { text: "tü", duration: 0.53, begin: 161.750, index: 382 },
  { text: " mal", duration: 0.53, begin: 162.250, index: 383 },
  { text: "ze", duration: 0.53, begin: 162.500, index: 384 },
  { text: "me", duration: 0.53, begin: 162.750, index: 385 },
  { text: " kul", duration: 0.53, begin: 163.000, index: 386 },
  { text: "la", duration: 0.53, begin: 163.250, index: 387 },
  { text: "nır", duration: 0.53, begin: 163.500, index: 388 },
  { text: " ve", duration: 0.53, begin: 163.750, index: 389 },
  { text: " baş", duration: 0.53, begin: 165.500, index: 390 },
  { text: "tan", duration: 0.53, begin: 165.750, index: 391 },
  { text: " sav", duration: 0.53, begin: 166.000, index: 392 },
  { text: "ma", duration: 0.53, begin: 166.250, index: 393 },
  { text: " bir", duration: 0.53, begin: 167.250, index: 394 },
  { text: " iş", duration: 0.53, begin: 167.500, index: 395 },
  { text: " çı", duration: 0.53, begin: 167.750, index: 396 },
  { text: "ka", duration: 0.53, begin: 168.000, index: 397 },
  { text: "rır", duration: 0.53, begin: 168.250, index: 398 },
  { text: "sam,", duration: 0.53, begin: 168.500, index: 399 },
  { text: " halk", duration: 0.53, begin: 170.000, index: 400 },
  { text: " bu", duration: 0.53, begin: 170.250, index: 401 },
  { text: "nu", duration: 0.53, begin: 170.500, index: 402 },
  { text: " er", duration: 0.53, begin: 171.750, index: 403 },
  { text: " ya", duration: 0.53, begin: 172.000, index: 404 },
  { text: "da", duration: 0.53, begin: 172.250, index: 405 },
  { text: " geç", duration: 0.53, begin: 172.500, index: 406 },
  { text: " an", duration: 0.53, begin: 172.750, index: 407 },
  { text: "la", duration: 0.53, begin: 173.000, index: 408 },
  { text: "ya", duration: 0.53, begin: 173.250, index: 409 },
  { text: "cak", duration: 0.53, begin: 173.500, index: 410 },
  { text: " ve", duration: 0.53, begin: 175.000, index: 411 },
  { text: " da", duration: 0.53, begin: 175.250, index: 412 },
  { text: "ha", duration: 0.53, begin: 175.500, index: 413 },
  { text: " son", duration: 0.53, begin: 175.750, index: 414 },
  { text: "ra", duration: 0.53, begin: 176.000, index: 415 },
  { text: " bu", duration: 0.53, begin: 177.250, index: 416 },
  { text: "ra", duration: 0.53, begin: 177.500, index: 417 },
  { text: "dan", duration: 0.53, begin: 177.750, index: 418 },
  { text: " ge", duration: 0.53, begin: 178.000, index: 419 },
  { text: "çe", duration: 0.53, begin: 178.250, index: 420 },
  { text: "cek", duration: 0.53, begin: 178.500, index: 421 },
  { text: " o", duration: 0.53, begin: 178.750, index: 422 },
  { text: "lan", duration: 0.53, begin: 179.000, index: 423 },
  { text: " ta", duration: 0.53, begin: 180.500, index: 424 },
  { text: "mir", duration: 0.53, begin: 180.750, index: 425 },
  { text: "ci", duration: 0.53, begin: 181.000, index: 426 },
  { text: "ye", duration: 0.53, begin: 181.250, index: 427 },
  { text: " iş", duration: 0.98, begin: 181.500, index: 428 },
  { text: " ver", duration: 0.98, begin: 181.750, index: 429 },
  { text: "me", duration: 0.98, begin: 182.000, index: 430 },
  { text: "ye", duration: 0.98, begin: 182.250, index: 431 },
  { text: "cek", duration: 0.98, begin: 182.500, index: 432 },
  { text: "tir.", duration: 0.98, begin: 182.750, index: 433 },
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
  <Link href="/dashboard/stories/ozgur-kuslar" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/1-6.mp3"
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