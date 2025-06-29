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
  { text: "Ha", duration: 0.28, begin: 0.600, index: 1, isTitle: true, isCenter: true },
  { text: "yal", duration: 0.28, begin: 1.000, index: 2, isTitle: true, isCenter: true },
  { text: "le", duration: 0.28, begin: 1.250, index: 3, isTitle: true, isCenter: true },
  { text: "ri", duration: 0.28, begin: 1.500, index: 4, isTitle: true, isCenter: true },
  { text: "niz", duration: 0.28, begin: 1.750, index: 5, isTitle: true, isCenter: true },
  { text: "den", duration: 0.28, begin: 2.000, index: 6, isTitle: true, isCenter: true },
  { text: " Vaz", duration: 0.28, begin: 2.250, index: 7, isTitle: true, isCenter: true },
  { text: "geç", duration: 0.28, begin: 2.500, index: 8, isTitle: true, isCenter: true },
  { text: "me", duration: 0.28, begin: 2.750, index: 9, isTitle: true, isCenter: true },
  { text: "yin", duration: 0.28, begin: 3.000, index: 10, isTitle: true, isCenter: true },

  // Story content
  { text: " Çif", duration: 0.28, begin: 4.250, index: 11 },
  { text: "lik", duration: 0.28, begin: 4.500, index: 12 },
  { text: "ten", duration: 0.28, begin: 4.750, index: 13 },
  { text: " çif", duration: 0.28, begin: 5.000, index: 14 },
  { text: "li", duration: 0.28, begin: 5.250, index: 15 },
  { text: "ğe,", duration: 0.28, begin: 5.500, index: 16 },
  { text: " ya", duration: 0.28, begin: 6.000, index: 17 },
  { text: "rış", duration: 0.28, begin: 6.250, index: 18 },
  { text: "tan", duration: 0.28, begin: 6.500, index: 19 },
  { text: " ya", duration: 0.28, begin: 6.750, index: 20 },
  { text: "rı", duration: 0.28, begin: 7.000, index: 21 },
  { text: "şa", duration: 0.28, begin: 7.250, index: 22 },
  { text: " ko", duration: 0.28, begin: 7.500, index: 23 },
  { text: "şa", duration: 0.28, begin: 7.750, index: 24 },
  { text: "rak", duration: 0.28, begin: 8.000, index: 25 },
  { text: " at", duration: 0.28, begin: 8.750, index: 26 },
  { text: "la", duration: 0.28, begin: 9.000, index: 27 },
  { text: "rı", duration: 0.28, begin: 9.250, index: 28 },
  { text: " ter", duration: 0.28, begin: 9.500, index: 29 },
  { text: "bi", duration: 0.28, begin: 9.750, index: 30 },
  { text: "ye", duration: 0.28, begin: 10.000, index: 31 },
  { text: " et", duration: 0.28, begin: 10.250, index: 32 },
  { text: "me", duration: 0.28, begin: 10.500, index: 33 },
  { text: "ye", duration: 0.28, begin: 10.750, index: 34 },
  { text: " ça", duration: 0.28, begin: 11.000, index: 35 },
  { text: "lı", duration: 0.28, begin: 11.250, index: 36 },
  { text: "şan", duration: 0.28, begin: 11.500, index: 37 },
  { text: " gez", duration: 0.28, begin: 12.250, index: 38 },
  { text: "gin", duration: 0.28, begin: 12.500, index: 39 },
  { text: " bir", duration: 0.28, begin: 12.750, index: 40 },
  { text: " at", duration: 0.28, begin: 13.250, index: 41 },
  { text: " ter", duration: 0.28, begin: 13.500, index: 42 },
  { text: "bi", duration: 0.28, begin: 13.750, index: 43 },
  { text: "ye", duration: 0.28, begin: 14.000, index: 44 },
  { text: "ci", duration: 0.28, begin: 14.250, index: 45 },
  { text: "si", duration: 0.28, begin: 14.500, index: 46 },
  { text: "nin", duration: 0.28, begin: 14.750, index: 47 },
  { text: " genç", duration: 0.28, begin: 15.000, index: 48 },
  { text: " bir", duration: 0.28, begin: 15.250, index: 49 },
  { text: " oğ", duration: 0.28, begin: 15.500, index: 50 },
  { text: "lu", duration: 0.28, begin: 15.750, index: 51 },
  { text: " var", duration: 0.28, begin: 16.000, index: 52 },
  { text: "dı.", duration: 0.28, begin: 16.250, index: 53 },
  { text: " Ba", duration: 0.28, begin: 17.500, index: 54 },
  { text: "ba", duration: 0.28, begin: 17.750, index: 55 },
  { text: "sı", duration: 0.28, begin: 18.000, index: 56 },
  { text: "nın", duration: 0.28, begin: 18.250, index: 57 },
  { text: " i", duration: 0.28, begin: 18.500, index: 58 },
  { text: "şi", duration: 0.28, begin: 18.750, index: 59 },
  { text: " ne", duration: 0.28, begin: 19.000, index: 60 },
  { text: "de", duration: 0.28, begin: 19.250, index: 61 },
  { text: "niy", duration: 0.28, begin: 19.500, index: 62 },
  { text: "le", duration: 0.28, begin: 19.750, index: 63 },
  { text: " ço", duration: 0.28, begin: 20.200, index: 64 },
  { text: "cu", duration: 0.28, begin: 20.400, index: 65 },
  { text: "ğun", duration: 0.28, begin: 20.600, index: 66 },
  { text: " e", duration: 0.28, begin: 20.800, index: 67 },
  { text: "ği", duration: 0.28, begin: 21.000, index: 68 },
  { text: "ti", duration: 0.28, begin: 21.200, index: 69 },
  { text: "mi", duration: 0.28, begin: 21.400, index: 70 },
  { text: " ke", duration: 0.28, begin: 21.600, index: 71 },
  { text: "sin", duration: 0.28, begin: 21.800, index: 72 },
  { text: "ti", duration: 0.28, begin: 22.000, index: 73 },
  { text: "le", duration: 0.28, begin: 22.200, index: 74 },
  { text: "re", duration: 0.28, begin: 22.400, index: 75 },
  { text: " uğ", duration: 0.28, begin: 22.600, index: 76 },
  { text: "ra", duration: 0.28, begin: 22.800, index: 77 },
  { text: "mış", duration: 0.28, begin: 23.000, index: 78 },
  { text: "tı.", duration: 0.28, begin: 23.200, index: 79 },
  { text: " Bir", duration: 0.28, begin: 24.500, index: 80 },
  { text: " gün", duration: 0.28, begin: 24.700, index: 81 },
  { text: " öğ", duration: 0.28, begin: 25.100, index: 82 },
  { text: "ret", duration: 0.28, begin: 25.300, index: 83 },
  { text: "me", duration: 0.28, begin: 25.500, index: 84 },
  { text: "ni,", duration: 0.28, begin: 25.700, index: 85 },
  { text: " öğ", duration: 0.28, begin: 27.000, index: 86 },
  { text: "ren", duration: 0.28, begin: 27.200, index: 87 },
  { text: "ci", duration: 0.28, begin: 27.400, index: 88 },
  { text: "le", duration: 0.28, begin: 27.600, index: 89 },
  { text: "rin", duration: 0.28, begin: 27.800, index: 90 },
  { text: "den", duration: 0.28, begin: 28.000, index: 91 },
  { text: " bü", duration: 0.28, begin: 29.000, index: 92 },
  { text: "yü", duration: 0.28, begin: 29.250, index: 93 },
  { text: "dük", duration: 0.28, begin: 29.500, index: 94 },
  { text: "le", duration: 0.28, begin: 29.750, index: 95 },
  { text: "ri", duration: 0.28, begin: 30.000, index: 96 },
  { text: " za", duration: 0.28, begin: 30.250, index: 97 },
  { text: "man", duration: 0.28, begin: 30.500, index: 98 },
  { text: " ne", duration: 0.28, begin: 30.750, index: 99 },
  { text: " ol", duration: 0.28, begin: 31.000, index: 100 },
  { text: "mak", duration: 0.28, begin: 31.250, index: 101 },
  { text: " ve", duration: 0.28, begin: 31.500, index: 102 },
  { text: " ne", duration: 0.28, begin: 32.250, index: 103 },
  { text: " yap", duration: 0.28, begin: 32.500, index: 104 },
  { text: "mak", duration: 0.28, begin: 32.750, index: 105 },
  { text: " is", duration: 0.28, begin: 33.250, index: 106 },
  { text: "te", duration: 0.28, begin: 33.500, index: 107 },
  { text: "dik", duration: 0.28, begin: 33.750, index: 108 },
  { text: "le", duration: 0.28, begin: 34.000, index: 109 },
  { text: "ri", duration: 0.28, begin: 34.250, index: 110 },
  { text: " ko", duration: 0.28, begin: 34.500, index: 111 },
  { text: "nu", duration: 0.28, begin: 34.750, index: 112 },
  { text: "sun", duration: 0.28, begin: 35.000, index: 113 },
  { text: "da", duration: 0.28, begin: 35.250, index: 114 },
  { text: " bir", duration: 0.38, begin: 35.750, index: 115 },
  { text: " kom", duration: 0.38, begin: 36.000, index: 116 },
  { text: "po", duration: 0.38, begin: 36.250, index: 117 },
  { text: "zis", duration: 0.38, begin: 36.500, index: 118 },
  { text: "yon", duration: 0.38, begin: 36.750, index: 119 },
  { text: " yaz", duration: 0.28, begin: 37.000, index: 120 },
  { text: "ma", duration: 0.28, begin: 37.250, index: 121 },
  { text: "la", duration: 0.28, begin: 37.500, index: 122 },
  { text: "rı", duration: 0.28, begin: 37.750, index: 123 },
  { text: "nı", duration: 0.28, begin: 38.000, index: 124 },
  { text: " is", duration: 0.28, begin: 38.250, index: 125 },
  { text: "te", duration: 0.28, begin: 38.500, index: 126 },
  { text: "di.", duration: 0.28, begin: 38.750, index: 127 },
  { text: " Ço", duration: 0.28, begin: 40.000, index: 128 },
  { text: "cuk", duration: 0.28, begin: 40.250, index: 129 },
  { text: " bü", duration: 0.28, begin: 40.750, index: 130 },
  { text: "tün", duration: 0.28, begin: 41.000, index: 131 },
  { text: " ge", duration: 0.28, begin: 41.250, index: 132 },
  { text: "ce", duration: 0.28, begin: 41.500, index: 133 },
  { text: " o", duration: 0.28, begin: 41.750, index: 134 },
  { text: "tu", duration: 0.28, begin: 42.000, index: 135 },
  { text: "rup", duration: 0.28, begin: 42.250, index: 136 },
  { text: " gü", duration: 0.28, begin: 42.500, index: 137 },
  { text: "nün", duration: 0.28, begin: 42.750, index: 138 },
  { text: " bi", duration: 0.28, begin: 43.000, index: 139 },
  { text: "rin", duration: 0.28, begin: 43.250, index: 140 },
  { text: "de", duration: 0.28, begin: 43.500, index: 141 },
  { text: " at", duration: 0.28, begin: 44.250, index: 142 },
  { text: " çift", duration: 0.28, begin: 44.500, index: 143 },
  { text: "li", duration: 0.28, begin: 44.750, index: 144 },
  { text: "ği", duration: 0.28, begin: 45.000, index: 145 },
  { text: "ne", duration: 0.28, begin: 45.250, index: 146 },
  { text: " sa", duration: 0.28, begin: 45.500, index: 147 },
  { text: "hip", duration: 0.28, begin: 45.750, index: 148 },
  { text: " ol", duration: 0.28, begin: 46.000, index: 149 },
  { text: "ma", duration: 0.28, begin: 46.250, index: 150 },
  { text: "yı", duration: 0.28, begin: 46.500, index: 151 },
  { text: " he", duration: 0.28, begin: 46.750, index: 152 },
  { text: "def", duration: 0.28, begin: 47.000, index: 153 },
  { text: "le", duration: 0.28, begin: 47.250, index: 154 },
  { text: "di", duration: 0.28, begin: 47.500, index: 155 },
  { text: "ği", duration: 0.28, begin: 47.750, index: 156 },
  { text: "ni", duration: 0.28, begin: 48.000, index: 157 },
  { text: " an", duration: 0.28, begin: 48.250, index: 158 },
  { text: "la", duration: 0.28, begin: 48.500, index: 159 },
  { text: "tan", duration: 0.28, begin: 48.750, index: 160 },
  { text: " ye", duration: 0.28, begin: 49.500, index: 161 },
  { text: "di", duration: 0.28, begin: 49.750, index: 162 },
  { text: " say", duration: 0.28, begin: 50.000, index: 163 },
  { text: "fa", duration: 0.28, begin: 50.250, index: 164 },
  { text: "lık", duration: 0.28, begin: 50.500, index: 165 },
  { text: " bir", duration: 0.28, begin: 50.750, index: 166 },
  { text: " kom", duration: 0.28, begin: 51.000, index: 167 },
  { text: "po", duration: 0.28, begin: 51.250, index: 168 },
  { text: "zis", duration: 0.28, begin: 51.500, index: 169 },
  { text: "yon", duration: 0.28, begin: 51.750, index: 170 },
  { text: " yaz", duration: 0.28, begin: 52.000, index: 171 },
  { text: "dı.", duration: 0.28, begin: 52.250, index: 172 },
  { text: " Ha", duration: 0.28, begin: 53.500, index: 173 },
  { text: "ya", duration: 0.28, begin: 53.750, index: 174 },
  { text: "li", duration: 0.28, begin: 54.000, index: 175 },
  { text: "ni", duration: 0.28, begin: 54.250, index: 176 },
  { text: " en", duration: 0.28, begin: 55.000, index: 177 },
  { text: " in", duration: 0.28, begin: 55.250, index: 178 },
  { text: "ce", duration: 0.28, begin: 55.500, index: 179 },
  { text: " ay", duration: 0.28, begin: 55.750, index: 180 },
  { text: "rın", duration: 0.28, begin: 56.000, index: 181 },
  { text: "tı", duration: 0.28, begin: 56.250, index: 182 },
  { text: "la", duration: 0.28, begin: 56.500, index: 183 },
  { text: "rıy", duration: 0.28, begin: 56.750, index: 184 },
  { text: "la", duration: 0.28, begin: 57.000, index: 185 },
  { text: " an", duration: 0.28, begin: 57.500, index: 186 },
  { text: "lat", duration: 0.28, begin: 57.750, index: 187 },
  { text: "tı.", duration: 0.28, begin: 58.000, index: 188 },
  { text: " Hat", duration: 0.28, begin: 59.250, index: 189 },
  { text: "ta", duration: 0.28, begin: 59.500, index: 190 },
  { text: " ha", duration: 0.28, begin: 59.750, index: 191 },
  { text: "ya", duration: 0.28, begin: 60.000, index: 192 },
  { text: "lin", duration: 0.28, begin: 60.250, index: 193 },
  { text: "de", duration: 0.28, begin: 60.500, index: 194 },
  { text: "ki", duration: 0.28, begin: 60.750, index: 195 },
  { text: " i", duration: 0.28, begin: 61.000, index: 196 },
  { text: "ki", duration: 0.28, begin: 61.250, index: 197 },
  { text: " yüz", duration: 0.28, begin: 61.500, index: 198 },
  { text: " dö", duration: 0.28, begin: 61.750, index: 199 },
  { text: "nüm", duration: 0.28, begin: 62.000, index: 200 },
  { text: "lük", duration: 0.28, begin: 62.250, index: 201 },
  { text: " çift", duration: 0.28, begin: 62.500, index: 202 },
  { text: "li", duration: 0.28, begin: 62.750, index: 203 },
  { text: "ğin", duration: 0.28, begin: 63.000, index: 204 },
  { text: " kro", duration: 0.28, begin: 63.250, index: 205 },
  { text: "ki", duration: 0.28, begin: 63.500, index: 206 },
  { text: "si", duration: 0.28, begin: 63.750, index: 207 },
  { text: "ni", duration: 0.28, begin: 64.000, index: 208 },
  { text: " de", duration: 0.28, begin: 64.250, index: 209 },
  { text: " çiz", duration: 0.28, begin: 64.500, index: 210 },
  { text: "di.", duration: 0.28, begin: 64.750, index: 211 },
  { text: " Bi", duration: 0.28, begin: 66.000, index: 212 },
  { text: "na", duration: 0.28, begin: 66.250, index: 213 },
  { text: "la", duration: 0.28, begin: 66.500, index: 214 },
  { text: "rın,", duration: 0.28, begin: 66.750, index: 215 },
  { text: " a", duration: 0.28, begin: 67.500, index: 216 },
  { text: "hır", duration: 0.28, begin: 67.750, index: 217 },
  { text: "la", duration: 0.28, begin: 68.000, index: 218 },
  { text: "rın", duration: 0.28, begin: 68.250, index: 219 },
  { text: " ve", duration: 0.28, begin: 68.500, index: 220 },
  { text: " ko", duration: 0.28, begin: 68.750, index: 221 },
  { text: "şu", duration: 0.28, begin: 69.000, index: 222 },
  { text: " yol", duration: 0.28, begin: 69.200, index: 223 },
  { text: "la", duration: 0.28, begin: 69.400, index: 224 },
  { text: "rı", duration: 0.28, begin: 69.600, index: 225 },
  { text: "nın", duration: 0.28, begin: 69.800, index: 226 },
  { text: " yer", duration: 0.28, begin: 70.000, index: 227 },
  { text: "le", duration: 0.28, begin: 70.200, index: 228 },
  { text: "ri", duration: 0.28, begin: 70.400, index: 229 },
  { text: "ni", duration: 0.28, begin: 70.600, index: 230 },
  { text: " gös", duration: 0.38, begin: 70.800, index: 231 },
  { text: "ter", duration: 0.38, begin: 71.100, index: 232 },
  { text: "di.", duration: 0.38, begin: 71.350, index: 233 },
  { text: " Kro", duration: 0.28, begin: 72.750, index: 234 },
  { text: "ki", duration: 0.28, begin: 73.000, index: 235 },
  { text: "ye,", duration: 0.28, begin: 73.250, index: 236 },
  { text: " i", duration: 0.28, begin: 74.000, index: 237 },
  { text: "ki", duration: 0.28, begin: 74.250, index: 238 },
  { text: " yüz", duration: 0.28, begin: 74.500, index: 239 },
  { text: " dö", duration: 0.28, begin: 74.750, index: 240 },
  { text: "nüm", duration: 0.28, begin: 75.000, index: 241 },
  { text: "lük", duration: 0.28, begin: 75.250, index: 242 },
  { text: " a", duration: 0.28, begin: 75.500, index: 243 },
  { text: "ra", duration: 0.28, begin: 75.750, index: 244 },
  { text: "zi", duration: 0.28, begin: 76.000, index: 245 },
  { text: "nin", duration: 0.28, begin: 76.250, index: 246 },
  { text: " ü", duration: 0.28, begin: 76.500, index: 247 },
  { text: "ze", duration: 0.28, begin: 76.750, index: 248 },
  { text: "ri", duration: 0.28, begin: 77.000, index: 249 },
  { text: "ne", duration: 0.28, begin: 77.250, index: 250 },
  { text: " o", duration: 0.28, begin: 77.500, index: 251 },
  { text: "tu", duration: 0.28, begin: 77.750, index: 252 },
  { text: "ra", duration: 0.28, begin: 78.000, index: 253 },
  { text: "cak", duration: 0.28, begin: 78.250, index: 254 },
  { text: " bin", duration: 0.28, begin: 78.750, index: 255 },
  { text: " met", duration: 0.28, begin: 79.000, index: 256 },
  { text: "re", duration: 0.28, begin: 79.250, index: 257 },
  { text: "ka", duration: 0.28, begin: 79.500, index: 258 },
  { text: "re", duration: 0.28, begin: 79.750, index: 259 },
  { text: "lik", duration: 0.28, begin: 80.000, index: 260 },
  { text: " e", duration: 0.28, begin: 80.250, index: 261 },
  { text: "vin", duration: 0.28, begin: 80.500, index: 262 },
  { text: " ay", duration: 0.28, begin: 80.750, index: 263 },
  { text: "rın", duration: 0.28, begin: 81.000, index: 264 },
  { text: "tı", duration: 0.28, begin: 81.250, index: 265 },
  { text: "lı", duration: 0.28, begin: 81.500, index: 266 },
  { text: " pla", duration: 0.28, begin: 81.750, index: 267 },
  { text: "nı", duration: 0.28, begin: 82.000, index: 268 },
  { text: "nı", duration: 0.28, begin: 82.250, index: 269 },
  { text: "da", duration: 0.28, begin: 82.500, index: 270 },
  { text: " ek", duration: 0.28, begin: 82.750, index: 271 },
  { text: "le", duration: 0.28, begin: 83.000, index: 272 },
  { text: "di.", duration: 0.28, begin: 83.250, index: 273 },
  { text: " Er", duration: 0.28, begin: 84.500, index: 274 },
  { text: "te", duration: 0.28, begin: 84.750, index: 275 },
  { text: "si", duration: 0.28, begin: 85.000, index: 276 },
  { text: " gün", duration: 0.28, begin: 85.250, index: 277 },
  { text: " ho", duration: 0.28, begin: 85.500, index: 278 },
  { text: "ca", duration: 0.28, begin: 85.750, index: 279 },
  { text: "sı", duration: 0.28, begin: 86.000, index: 280 },
  { text: "na", duration: 0.28, begin: 86.250, index: 281 },
  { text: " sun", duration: 0.28, begin: 86.500, index: 282 },
  { text: "du", duration: 0.28, begin: 86.750, index: 283 },
  { text: "ğu", duration: 0.28, begin: 87.000, index: 284 },
  { text: " ye", duration: 0.28, begin: 87.500, index: 285 },
  { text: "di", duration: 0.28, begin: 87.750, index: 286 },
  { text: " say", duration: 0.28, begin: 88.000, index: 287 },
  { text: "fa", duration: 0.28, begin: 88.250, index: 288 },
  { text: "lık", duration: 0.28, begin: 88.500, index: 289 },
  { text: " ö", duration: 0.28, begin: 88.750, index: 290 },
  { text: "dev,", duration: 0.28, begin: 89.000, index: 291 },
  { text: " tam", duration: 0.28, begin: 90.000, index: 292 },
  { text: " kal", duration: 0.28, begin: 90.250, index: 293 },
  { text: "bi", duration: 0.28, begin: 90.500, index: 294 },
  { text: "nin", duration: 0.28, begin: 90.750, index: 295 },
  { text: " se", duration: 0.28, begin: 91.000, index: 296 },
  { text: "siy", duration: 0.28, begin: 91.250, index: 297 },
  { text: "di.", duration: 0.28, begin: 91.500, index: 298 },
  { text: " İ", duration: 0.28, begin: 93.000, index: 299 },
  { text: "ki", duration: 0.28, begin: 93.250, index: 300 },
  { text: " gün", duration: 0.28, begin: 93.500, index: 301 },
  { text: " son", duration: 0.28, begin: 93.750, index: 302 },
  { text: "ra", duration: 0.28, begin: 94.000, index: 303 },
  { text: " ö", duration: 0.28, begin: 94.250, index: 304 },
  { text: "de", duration: 0.28, begin: 94.500, index: 305 },
  { text: "vi", duration: 0.28, begin: 94.750, index: 306 },
  { text: " ge", duration: 0.28, begin: 95.000, index: 307 },
  { text: "ri", duration: 0.28, begin: 95.250, index: 308 },
  { text: " al", duration: 0.28, begin: 95.500, index: 309 },
  { text: "dı.", duration: 0.28, begin: 95.750, index: 310 },
  { text: " Ka", duration: 0.28, begin: 96.500, index: 311 },
  { text: "ğı", duration: 0.28, begin: 96.750, index: 312 },
  { text: "dın", duration: 0.28, begin: 97.000, index: 313 },
  { text: " ü", duration: 0.28, begin: 97.200, index: 314 },
  { text: "ze", duration: 0.28, begin: 97.400, index: 315 },
  { text: "rin", duration: 0.28, begin: 97.600, index: 316 },
  { text: "de", duration: 0.28, begin: 97.800, index: 317 },
  { text: " kır", duration: 0.28, begin: 98.000, index: 318 },
  { text: "mı", duration: 0.28, begin: 98.200, index: 319 },
  { text: "zı", duration: 0.28, begin: 98.400, index: 320 },
  { text: " ka", duration: 0.28, begin: 98.600, index: 321 },
  { text: "lem", duration: 0.28, begin: 98.800, index: 322 },
  { text: "le", duration: 0.28, begin: 99.000, index: 323 },
  { text: " ya", duration: 0.28, begin: 99.250, index: 324 },
  { text: "zıl", duration: 0.28, begin: 99.500, index: 325 },
  { text: "mış", duration: 0.28, begin: 99.750, index: 326 },
  { text: " ko", duration: 0.28, begin: 100.750, index: 327 },
  { text: "ca", duration: 0.28, begin: 101.000, index: 328 },
  { text: "man", duration: 0.28, begin: 101.250, index: 329 },
  { text: " bir", duration: 0.28, begin: 101.500, index: 330 },
  { text: " \"sı", duration: 0.28, begin: 101.750, index: 331 },
  { text: "fır\"", duration: 0.28, begin: 102.000, index: 332 },
  { text: " ve", duration: 0.28, begin: 102.250, index: 333 },
  { text: " \"Ders", duration: 0.28, begin: 103.500, index: 334 },
  { text: "ten", duration: 0.28, begin: 103.750, index: 335 },
  { text: " son", duration: 0.28, begin: 104.000, index: 336 },
  { text: "ra", duration: 0.28, begin: 104.250, index: 337 },
  { text: " be", duration: 0.28, begin: 104.500, index: 338 },
  { text: "ni", duration: 0.28, begin: 104.750, index: 339 },
  { text: " gör\"", duration: 0.28, begin: 105.000, index: 340 },
  { text: " u", duration: 0.28, begin: 105.750, index: 341 },
  { text: "ya", duration: 0.28, begin: 106.000, index: 342 },
  { text: "rı", duration: 0.28, begin: 106.250, index: 343 },
  { text: "sı", duration: 0.28, begin: 106.500, index: 344 },
  { text: " var", duration: 0.28, begin: 106.750, index: 345 },
  { text: "dı.", duration: 0.28, begin: 107.000, index: 346 },
  { text: " Ço", duration: 0.28, begin: 108.000, index: 347 },
  { text: "cuk:", duration: 0.28, begin: 108.250, index: 348 },
  { text: " \"Ne", duration: 0.28, begin: 109.000, index: 349 },
  { text: "den", duration: 0.28, begin: 109.250, index: 350 },
  { text: " sı", duration: 0.28, begin: 109.500, index: 351 },
  { text: "fır", duration: 0.28, begin: 109.750, index: 352 },
  { text: " al", duration: 0.28, begin: 110.000, index: 353 },
  { text: "dım?\"", duration: 0.28, begin: 110.250, index: 354 },
  { text: " di", duration: 0.28, begin: 110.750, index: 355 },
  { text: "ye", duration: 0.28, begin: 111.000, index: 356 },
  { text: " öğ", duration: 0.28, begin: 111.250, index: 357 },
  { text: "ret", duration: 0.28, begin: 111.500, index: 358 },
  { text: "me", duration: 0.28, begin: 111.750, index: 359 },
  { text: "ni", duration: 0.28, begin: 112.000, index: 360 },
  { text: "ne", duration: 0.28, begin: 112.250, index: 361 },
  { text: " me", duration: 0.28, begin: 112.500, index: 362 },
  { text: "rak", duration: 0.28, begin: 112.750, index: 363 },
  { text: "la", duration: 0.28, begin: 113.000, index: 364 },
  { text: " sor", duration: 0.28, begin: 113.250, index: 365 },
  { text: "du.", duration: 0.28, begin: 113.500, index: 366 },
  { text: " Öğ", duration: 0.28, begin: 114.500, index: 367 },
  { text: "ret", duration: 0.28, begin: 114.750, index: 368 },
  { text: "me", duration: 0.28, begin: 115.000, index: 369 },
  { text: "ni:", duration: 0.28, begin: 115.250, index: 370 },
  { text: " \"Bu", duration: 0.28, begin: 116.250, index: 371 },
  { text: " se", duration: 0.28, begin: 116.500, index: 372 },
  { text: "nin", duration: 0.28, begin: 116.750, index: 373 },
  { text: " ya", duration: 0.28, begin: 117.000, index: 374 },
  { text: "şın", duration: 0.28, begin: 117.250, index: 375 },
  { text: "da", duration: 0.28, begin: 117.500, index: 376 },
  { text: " bir", duration: 0.28, begin: 117.750, index: 377 },
  { text: " ço", duration: 0.28, begin: 118.000, index: 378 },
  { text: "cuk", duration: 0.28, begin: 118.250, index: 379 },
  { text: " i", duration: 0.28, begin: 118.500, index: 380 },
  { text: "çin", duration: 0.28, begin: 118.750, index: 381 },
  { text: " ger", duration: 0.28, begin: 119.500, index: 382 },
  { text: "çek", duration: 0.28, begin: 119.750, index: 383 },
  { text: "ci", duration: 0.28, begin: 120.000, index: 384 },
  { text: " ol", duration: 0.28, begin: 120.250, index: 385 },
  { text: "ma", duration: 0.28, begin: 120.500, index: 386 },
  { text: "yan", duration: 0.28, begin: 120.750, index: 387 },
  { text: " bir", duration: 0.28, begin: 121.000, index: 388 },
  { text: " ha", duration: 0.28, begin: 121.250, index: 389 },
  { text: "yal.", duration: 0.28, begin: 121.500, index: 390 },
  { text: " Pa", duration: 0.28, begin: 122.750, index: 391 },
  { text: "ran", duration: 0.28, begin: 123.000, index: 392 },
  { text: " yok.", duration: 0.28, begin: 123.250, index: 393 },
  { text: " Gez", duration: 0.28, begin: 124.250, index: 394 },
  { text: "gin", duration: 0.28, begin: 124.500, index: 395 },
  { text: "ci", duration: 0.28, begin: 124.750, index: 396 },
  { text: " bir", duration: 0.28, begin: 125.000, index: 397 },
  { text: " a", duration: 0.28, begin: 125.250, index: 398 },
  { text: "i", duration: 0.28, begin: 125.500, index: 399 },
  { text: "le", duration: 0.28, begin: 125.750, index: 400 },
  { text: "den", duration: 0.28, begin: 126.000, index: 401 },
  { text: " ge", duration: 0.28, begin: 126.250, index: 402 },
  { text: "li", duration: 0.28, begin: 126.500, index: 403 },
  { text: "yor", duration: 0.28, begin: 126.750, index: 404 },
  { text: "sun.", duration: 0.28, begin: 127.000, index: 405 },
  { text: " Kay", duration: 0.28, begin: 128.000, index: 406 },
  { text: "na", duration: 0.28, begin: 128.250, index: 407 },
  { text: "ğı", duration: 0.28, begin: 128.500, index: 408 },
  { text: "nız", duration: 0.28, begin: 128.750, index: 409 },
  { text: " yok.", duration: 0.28, begin: 129.000, index: 410 },
  { text: " At", duration: 0.28, begin: 130.000, index: 411 },
  { text: " çift", duration: 0.28, begin: 130.250, index: 412 },
  { text: "li", duration: 0.28, begin: 130.500, index: 413 },
  { text: "ği", duration: 0.28, begin: 130.750, index: 414 },
  { text: " kur", duration: 0.28, begin: 131.000, index: 415 },
  { text: "mak", duration: 0.28, begin: 131.250, index: 416 },
  { text: " bü", duration: 0.28, begin: 131.750, index: 417 },
  { text: "yük", duration: 0.28, begin: 132.000, index: 418 },
  { text: " pa", duration: 0.28, begin: 132.250, index: 419 },
  { text: "ra", duration: 0.28, begin: 132.500, index: 420 },
  { text: " ge", duration: 0.28, begin: 132.750, index: 421 },
  { text: "rek", duration: 0.28, begin: 133.000, index: 422 },
  { text: "ti", duration: 0.28, begin: 133.250, index: 423 },
  { text: "rir.", duration: 0.28, begin: 133.500, index: 424 },
  { text: " Ön", duration: 0.28, begin: 134.500, index: 425 },
  { text: "ce", duration: 0.28, begin: 134.750, index: 426 },
  { text: " a", duration: 0.28, begin: 135.000, index: 427 },
  { text: "ra", duration: 0.28, begin: 135.250, index: 428 },
  { text: "zi", duration: 0.28, begin: 135.500, index: 429 },
  { text: "yi", duration: 0.28, begin: 135.750, index: 430 },
  { text: " sa", duration: 0.28, begin: 136.000, index: 431 },
  { text: "tın", duration: 0.28, begin: 136.250, index: 432 },
  { text: " al", duration: 0.28, begin: 136.500, index: 433 },
  { text: "man", duration: 0.28, begin: 136.750, index: 434 },
  { text: " la", duration: 0.28, begin: 137.000, index: 435 },
  { text: "zım.", duration: 0.28, begin: 137.250, index: 436 },
  { text: " Da", duration: 0.28, begin: 138.500, index: 437 },
  { text: "mız", duration: 0.28, begin: 138.750, index: 438 },
  { text: "lık", duration: 0.28, begin: 139.000, index: 439 },
  { text: " hay", duration: 0.28, begin: 139.500, index: 440 },
  { text: "van", duration: 0.28, begin: 139.750, index: 441 },
  { text: "lar", duration: 0.28, begin: 140.000, index: 442 },
  { text: "da", duration: 0.28, begin: 140.250, index: 443 },
  { text: " al", duration: 0.28, begin: 140.500, index: 444 },
  { text: "man", duration: 0.28, begin: 140.750, index: 445 },
  { text: " ge", duration: 0.28, begin: 141.000, index: 446 },
  { text: "re", duration: 0.28, begin: 141.250, index: 447 },
  { text: "ki", duration: 0.28, begin: 141.500, index: 448 },
  { text: "yor.", duration: 0.28, begin: 141.750, index: 449 },
  { text: " Bu", duration: 0.28, begin: 143.000, index: 450 },
  { text: "nu", duration: 0.28, begin: 143.250, index: 451 },
  { text: " ba", duration: 0.28, begin: 143.500, index: 452 },
  { text: "şar", duration: 0.28, begin: 143.750, index: 453 },
  { text: "man", duration: 0.28, begin: 144.000, index: 454 },
  { text: " im", duration: 0.28, begin: 144.250, index: 455 },
  { text: "kan", duration: 0.28, begin: 144.500, index: 456 },
  { text: "sız.", duration: 0.28, begin: 144.750, index: 457 },
  { text: " E", duration: 0.28, begin: 146.000, index: 458 },
  { text: "ğer", duration: 0.28, begin: 146.250, index: 459 },
  { text: " ö", duration: 0.28, begin: 146.500, index: 460 },
  { text: "de", duration: 0.28, begin: 146.750, index: 461 },
  { text: "vi", duration: 0.28, begin: 147.000, index: 462 },
  { text: "ni", duration: 0.28, begin: 147.250, index: 463 },
  { text: " ger", duration: 0.28, begin: 148.000, index: 464 },
  { text: "çek", duration: 0.28, begin: 148.250, index: 465 },
  { text: "çi", duration: 0.28, begin: 148.500, index: 466 },
  { text: " he", duration: 0.28, begin: 148.750, index: 467 },
  { text: "def", duration: 0.28, begin: 149.000, index: 468 },
  { text: "ler", duration: 0.28, begin: 149.250, index: 469 },
  { text: " be", duration: 0.38, begin: 149.500, index: 470 },
  { text: "lir", duration: 0.38, begin: 149.750, index: 471 },
  { text: "le", duration: 0.38, begin: 150.000, index: 472 },
  { text: "dik", duration: 0.38, begin: 150.250, index: 473 },
  { text: "ten", duration: 0.38, begin: 150.500, index: 474 },
  { text: " son", duration: 0.28, begin: 151.000, index: 475 },
  { text: "ra", duration: 0.28, begin: 151.250, index: 476 },
  { text: " ye", duration: 0.28, begin: 152.000, index: 477 },
  { text: "ni", duration: 0.28, begin: 152.250, index: 478 },
  { text: "den", duration: 0.28, begin: 152.500, index: 479 },
  { text: " ya", duration: 0.28, begin: 152.750, index: 480 },
  { text: "zar", duration: 0.28, begin: 153.000, index: 481 },
  { text: "san,", duration: 0.28, begin: 153.250, index: 482 },
  { text: " o", duration: 0.28, begin: 154.250, index: 483 },
  { text: " za", duration: 0.28, begin: 154.500, index: 484 },
  { text: "man", duration: 0.28, begin: 154.750, index: 485 },
  { text: " no", duration: 0.28, begin: 155.000, index: 486 },
  { text: "tu", duration: 0.28, begin: 155.250, index: 487 },
  { text: "nu", duration: 0.28, begin: 155.500, index: 488 },
  { text: " ye", duration: 0.28, begin: 155.750, index: 489 },
  { text: "ni", duration: 0.28, begin: 156.000, index: 490 },
  { text: "den", duration: 0.28, begin: 156.250, index: 491 },
  { text: " göz", duration: 0.28, begin: 156.500, index: 492 },
  { text: "den", duration: 0.28, begin: 156.750, index: 493 },
  { text: " ge", duration: 0.28, begin: 157.000, index: 494 },
  { text: "çi", duration: 0.28, begin: 157.250, index: 495 },
  { text: "ri", duration: 0.28, begin: 157.500, index: 496 },
  { text: "rim\"", duration: 0.28, begin: 157.750, index: 497 },
  { text: " de", duration: 0.28, begin: 158.500, index: 498 },
  { text: "di.", duration: 0.28, begin: 158.750, index: 499 },
  { text: " Ço", duration: 0.28, begin: 159.750, index: 500 },
  { text: "cuk", duration: 0.28, begin: 160.000, index: 501 },
  { text: " e", duration: 0.28, begin: 160.250, index: 502 },
  { text: "vi", duration: 0.28, begin: 160.500, index: 503 },
  { text: "ne", duration: 0.28, begin: 160.750, index: 504 },
  { text: " dön", duration: 0.28, begin: 161.000, index: 505 },
  { text: "dü", duration: 0.28, begin: 161.250, index: 506 },
  { text: " ve", duration: 0.28, begin: 161.500, index: 507 },
  { text: " u", duration: 0.28, begin: 162.000, index: 508 },
  { text: "zun", duration: 0.28, begin: 162.250, index: 509 },
  { text: " u", duration: 0.28, begin: 162.500, index: 510 },
  { text: "zun", duration: 0.28, begin: 162.750, index: 511 },
  { text: " dü", duration: 0.28, begin: 163.250, index: 512 },
  { text: "şün", duration: 0.28, begin: 163.500, index: 513 },
  { text: "dü.", duration: 0.28, begin: 163.750, index: 514 },
  { text: " Ba", duration: 0.28, begin: 165.000, index: 515 },
  { text: "ba", duration: 0.28, begin: 165.250, index: 516 },
  { text: "sı", duration: 0.28, begin: 165.500, index: 517 },
  { text: "na", duration: 0.28, begin: 165.750, index: 518 },
  { text: " da", duration: 0.28, begin: 166.000, index: 519 },
  { text: "nış", duration: 0.28, begin: 166.250, index: 520 },
  { text: "tı.", duration: 0.28, begin: 166.500, index: 521 },
  { text: " Ba", duration: 0.28, begin: 167.250, index: 522 },
  { text: "ba", duration: 0.28, begin: 167.500, index: 523 },
  { text: "sı", duration: 0.28, begin: 167.750, index: 524 },
  { text: " o", duration: 0.28, begin: 168.000, index: 525 },
  { text: "na;", duration: 0.28, begin: 168.250, index: 526 },
  { text: " \"Oğ", duration: 0.28, begin: 169.000, index: 527 },
  { text: "lum,", duration: 0.28, begin: 169.250, index: 528 },
  { text: " bu", duration: 0.28, begin: 170.000, index: 529 },
  { text: " ko", duration: 0.28, begin: 170.250, index: 530 },
  { text: "nu", duration: 0.28, begin: 170.500, index: 531 },
  { text: "da", duration: 0.28, begin: 170.750, index: 532 },
  { text: " ka", duration: 0.28, begin: 171.000, index: 533 },
  { text: "ra", duration: 0.28, begin: 171.250, index: 534 },
  { text: "rı", duration: 0.28, begin: 171.500, index: 535 },
  { text: "nı", duration: 0.28, begin: 171.750, index: 536 },
  { text: " ken", duration: 0.28, begin: 172.000, index: 537 },
  { text: "din", duration: 0.28, begin: 172.250, index: 538 },
  { text: " ver", duration: 0.28, begin: 172.500, index: 539 },
  { text: "me", duration: 0.28, begin: 172.750, index: 540 },
  { text: "li", duration: 0.28, begin: 173.000, index: 541 },
  { text: "sin.", duration: 0.28, begin: 173.250, index: 542 },
  { text: " Bu", duration: 0.28, begin: 174.000, index: 543 },
  { text: " se", duration: 0.38, begin: 174.250, index: 544 },
  { text: "nin", duration: 0.38, begin: 174.500, index: 545 },
  { text: " ha", duration: 0.38, begin: 174.750, index: 546 },
  { text: "ya", duration: 0.38, begin: 175.000, index: 547 },
  { text: "tın", duration: 0.38, begin: 175.250, index: 548 },
  { text: " i", duration: 0.38, begin: 175.750, index: 549 },
  { text: "çin", duration: 0.38, begin: 176.000, index: 550 },
  { text: " ol", duration: 0.38, begin: 176.750, index: 551 },
  { text: "duk", duration: 0.38, begin: 177.000, index: 552 },
  { text: "ça", duration: 0.38, begin: 177.250, index: 553 },
  { text: " ö", duration: 0.28, begin: 177.750, index: 554 },
  { text: "nem", duration: 0.28, begin: 178.000, index: 555 },
  { text: "li", duration: 0.28, begin: 178.250, index: 556 },
  { text: " bir", duration: 0.28, begin: 178.500, index: 557 },
  { text: " se", duration: 0.28, begin: 178.750, index: 558 },
  { text: "çim.", duration: 0.28, begin: 179.000, index: 559 },
  { text: " Ço", duration: 0.28, begin: 180.250, index: 560 },
  { text: "cuk", duration: 0.28, begin: 180.500, index: 561 },
  { text: " bir", duration: 0.28, begin: 181.000, index: 562 },
  { text: " haf", duration: 0.28, begin: 181.250, index: 563 },
  { text: "ta", duration: 0.28, begin: 181.500, index: 564 },
  { text: " ka", duration: 0.28, begin: 181.750, index: 565 },
  { text: "dar", duration: 0.28, begin: 182.000, index: 566 },
  { text: " dü", duration: 0.38, begin: 182.250, index: 567 },
  { text: "şün", duration: 0.38, begin: 182.500, index: 568 },
  { text: "dük", duration: 0.38, begin: 182.750, index: 569 },
  { text: "ten", duration: 0.38, begin: 183.000, index: 570 },
  { text: " son", duration: 0.38, begin: 183.250, index: 571 },
  { text: "ra", duration: 0.38, begin: 183.500, index: 572 },
  { text: " ö", duration: 0.28, begin: 184.500, index: 573 },
  { text: "de", duration: 0.28, begin: 184.750, index: 574 },
  { text: "vi", duration: 0.28, begin: 185.000, index: 575 },
  { text: "ni", duration: 0.28, begin: 185.250, index: 576 },
  { text: " hiç", duration: 0.28, begin: 185.500, index: 577 },
  { text: " bir", duration: 0.28, begin: 185.750, index: 578 },
  { text: " de", duration: 0.28, begin: 186.000, index: 579 },
  { text: "ği", duration: 0.28, begin: 186.250, index: 580 },
  { text: "şik", duration: 0.28, begin: 186.500, index: 581 },
  { text: "lik", duration: 0.28, begin: 186.750, index: 582 },
  { text: " yap", duration: 0.28, begin: 187.250, index: 583 },
  { text: "ma", duration: 0.28, begin: 187.500, index: 584 },
  { text: "dan", duration: 0.28, begin: 187.750, index: 585 },
  { text: " ge", duration: 0.28, begin: 188.000, index: 586 },
  { text: "ri", duration: 0.28, begin: 188.250, index: 587 },
  { text: " gö", duration: 0.28, begin: 188.500, index: 588 },
  { text: "tür", duration: 0.28, begin: 188.750, index: 589 },
  { text: "dü.", duration: 0.28, begin: 189.000, index: 590 },
  { text: " \"Siz", duration: 0.28, begin: 190.000, index: 591 },
  { text: " ver", duration: 0.28, begin: 190.250, index: 592 },
  { text: "di", duration: 0.28, begin: 190.500, index: 593 },
  { text: "ği", duration: 0.28, begin: 190.750, index: 594 },
  { text: "niz", duration: 0.28, begin: 191.000, index: 595 },
  { text: " no", duration: 0.28, begin: 191.250, index: 596 },
  { text: "tu", duration: 0.28, begin: 191.500, index: 597 },
  { text: " de", duration: 0.28, begin: 191.750, index: 598 },
  { text: "ğiş", duration: 0.28, begin: 192.000, index: 599 },
  { text: "tir", duration: 0.28, begin: 192.250, index: 600 },
  { text: "me", duration: 0.28, begin: 192.500, index: 601 },
  { text: "yin,", duration: 0.28, begin: 192.750, index: 602 },
  { text: " ben", duration: 0.28, begin: 193.500, index: 603 },
  { text: " de", duration: 0.28, begin: 193.750, index: 604 },
  { text: " ha", duration: 0.28, begin: 194.000, index: 605 },
  { text: "yal", duration: 0.28, begin: 194.250, index: 606 },
  { text: "le", duration: 0.28, begin: 194.500, index: 607 },
  { text: "ri", duration: 0.28, begin: 194.750, index: 608 },
  { text: "mi\"", duration: 0.28, begin: 195.000, index: 609 },
  { text: " de", duration: 0.28, begin: 195.250, index: 610 },
  { text: "di.", duration: 0.28, begin: 195.500, index: 611 },
  { text: " O", duration: 0.28, begin: 196.250, index: 612 },
  { text: " öğ", duration: 0.28, begin: 196.500, index: 613 },
  { text: "ren", duration: 0.28, begin: 196.750, index: 614 },
  { text: "ci,", duration: 0.28, begin: 197.000, index: 615 },
  { text: " bu", duration: 0.28, begin: 197.750, index: 616 },
  { text: "gün", duration: 0.28, begin: 198.000, index: 617 },
  { text: " i", duration: 0.28, begin: 198.500, index: 618 },
  { text: "ki", duration: 0.28, begin: 198.750, index: 619 },
  { text: " yüz", duration: 0.28, begin: 199.000, index: 620 },
  { text: " dö", duration: 0.28, begin: 199.250, index: 621 },
  { text: "nüm", duration: 0.28, begin: 199.500, index: 622 },
  { text: "lük", duration: 0.28, begin: 199.750, index: 623 },
  { text: " a", duration: 0.28, begin: 200.000, index: 624 },
  { text: "ra", duration: 0.28, begin: 200.250, index: 625 },
  { text: "zi", duration: 0.28, begin: 200.500, index: 626 },
  { text: " ü", duration: 0.28, begin: 200.750, index: 627 },
  { text: "ze", duration: 0.28, begin: 201.000, index: 628 },
  { text: "rin", duration: 0.28, begin: 201.250, index: 629 },
  { text: "de", duration: 0.28, begin: 201.500, index: 630 },
  { text: "ki", duration: 0.28, begin: 201.750, index: 631 },
  { text: " bin", duration: 0.28, begin: 202.500, index: 632 },
  { text: " met", duration: 0.28, begin: 202.750, index: 633 },
  { text: "re", duration: 0.28, begin: 203.000, index: 634 },
  { text: "ka", duration: 0.28, begin: 203.250, index: 635 },
  { text: "re", duration: 0.28, begin: 203.500, index: 636 },
  { text: "lik", duration: 0.28, begin: 203.750, index: 637 },
  { text: " çift", duration: 0.28, begin: 204.000, index: 638 },
  { text: "lik", duration: 0.28, begin: 204.250, index: 639 },
  { text: " e", duration: 0.28, begin: 204.500, index: 640 },
  { text: "vin", duration: 0.28, begin: 204.750, index: 641 },
  { text: "de", duration: 0.28, begin: 205.000, index: 642 },
  { text: " o", duration: 0.28, begin: 205.250, index: 643 },
  { text: "tu", duration: 0.28, begin: 205.500, index: 644 },
  { text: "ru", duration: 0.28, begin: 205.750, index: 645 },
  { text: "yor.", duration: 0.28, begin: 206.000, index: 646 },
  { text: " Yıl", duration: 0.28, begin: 207.250, index: 647 },
  { text: "lar", duration: 0.28, begin: 207.500, index: 648 },
  { text: " ön", duration: 0.28, begin: 207.750, index: 649 },
  { text: "ce", duration: 0.28, begin: 208.000, index: 650 },
  { text: " yaz", duration: 0.28, begin: 208.250, index: 651 },
  { text: "dı", duration: 0.28, begin: 208.500, index: 652 },
  { text: "ğı", duration: 0.28, begin: 208.750, index: 653 },
  { text: " ö", duration: 0.28, begin: 209.000, index: 654 },
  { text: "dev", duration: 0.28, begin: 209.250, index: 655 },
  { text: " şö", duration: 0.28, begin: 209.750, index: 656 },
  { text: "mi", duration: 0.28, begin: 210.000, index: 657 },
  { text: "ne", duration: 0.28, begin: 210.250, index: 658 },
  { text: "nin", duration: 0.28, begin: 210.500, index: 659 },
  { text: " ü", duration: 0.28, begin: 210.750, index: 660 },
  { text: "ze", duration: 0.28, begin: 211.000, index: 661 },
  { text: "rin", duration: 0.28, begin: 211.250, index: 662 },
  { text: "de", duration: 0.28, begin: 211.500, index: 663 },
  { text: " çer", duration: 0.28, begin: 211.750, index: 664 },
  { text: "çe", duration: 0.28, begin: 212.000, index: 665 },
  { text: "ve", duration: 0.28, begin: 212.250, index: 666 },
  { text: "len", duration: 0.28, begin: 212.500, index: 667 },
  { text: "miş", duration: 0.28, begin: 212.750, index: 668 },
  { text: " o", duration: 0.28, begin: 213.000, index: 669 },
  { text: "la", duration: 0.28, begin: 213.250, index: 670 },
  { text: "rak", duration: 0.28, begin: 213.500, index: 671 },
  { text: " a", duration: 0.28, begin: 213.750, index: 672 },
  { text: "sı", duration: 0.28, begin: 214.000, index: 673 },
  { text: "lı.", duration: 0.28, begin: 214.250, index: 674 },
  { text: " Hi", duration: 0.28, begin: 215.250, index: 675 },
  { text: "ka", duration: 0.28, begin: 215.500, index: 676 },
  { text: "ye", duration: 0.28, begin: 215.750, index: 677 },
  { text: "nin", duration: 0.28, begin: 216.000, index: 678 },
  { text: " en", duration: 0.28, begin: 216.250, index: 679 },
  { text: " can", duration: 0.28, begin: 216.500, index: 680 },
  { text: " a", duration: 0.28, begin: 216.750, index: 681 },
  { text: "lı", duration: 0.28, begin: 217.000, index: 682 },
  { text: "cı", duration: 0.28, begin: 217.250, index: 683 },
  { text: " ya", duration: 0.28, begin: 217.500, index: 684 },
  { text: "nı;", duration: 0.28, begin: 217.750, index: 685 },
  { text: " öğ", duration: 0.28, begin: 218.750, index: 686 },
  { text: "ret", duration: 0.28, begin: 219.000, index: 687 },
  { text: "men,", duration: 0.28, begin: 219.250, index: 688 },
  { text: " ge", duration: 0.28, begin: 220.000, index: 689 },
  { text: "çen", duration: 0.28, begin: 220.250, index: 690 },
  { text: " yaz", duration: 0.28, begin: 220.500, index: 691 },
  { text: " o", duration: 0.28, begin: 221.000, index: 692 },
  { text: "tuz", duration: 0.28, begin: 221.250, index: 693 },
  { text: " öğ", duration: 0.28, begin: 221.500, index: 694 },
  { text: "ren", duration: 0.28, begin: 221.750, index: 695 },
  { text: "ci", duration: 0.28, begin: 222.000, index: 696 },
  { text: "si", duration: 0.28, begin: 222.250, index: 697 },
  { text: "ni", duration: 0.28, begin: 222.500, index: 698 },
  { text: " bu", duration: 0.28, begin: 223.500, index: 699 },
  { text: " çift", duration: 0.28, begin: 223.750, index: 700 },
  { text: "li", duration: 0.28, begin: 224.000, index: 701 },
  { text: "ğe", duration: 0.28, begin: 224.250, index: 702 },
  { text: " kamp", duration: 0.28, begin: 224.500, index: 703 },
  { text: " kur", duration: 0.28, begin: 224.750, index: 704 },
  { text: "ma", duration: 0.28, begin: 225.000, index: 705 },
  { text: "ya", duration: 0.28, begin: 225.250, index: 706 },
  { text: " ge", duration: 0.28, begin: 225.500, index: 707 },
  { text: "tir", duration: 0.28, begin: 225.750, index: 708 },
  { text: "di.", duration: 0.28, begin: 226.000, index: 709 },
  { text: " Çift", duration: 0.28, begin: 227.000, index: 710 },
  { text: "lik", duration: 0.28, begin: 227.250, index: 711 },
  { text: "ten", duration: 0.28, begin: 227.500, index: 712 },
  { text: " ay", duration: 0.28, begin: 227.750, index: 713 },
  { text: "rı", duration: 0.28, begin: 228.000, index: 714 },
  { text: "lır", duration: 0.28, begin: 228.250, index: 715 },
  { text: "ken", duration: 0.28, begin: 228.500, index: 716 },
  { text: " es", duration: 0.28, begin: 229.000, index: 717 },
  { text: "ki", duration: 0.28, begin: 229.250, index: 718 },
  { text: " öğ", duration: 0.28, begin: 229.500, index: 719 },
  { text: "ren", duration: 0.28, begin: 229.750, index: 720 },
  { text: "ci", duration: 0.28, begin: 230.000, index: 721 },
  { text: "si", duration: 0.28, begin: 230.250, index: 722 },
  { text: "ne:", duration: 0.28, begin: 230.500, index: 723 },
  { text: " \"Bak,", duration: 0.28, begin: 231.500, index: 724 },
  { text: " sa", duration: 0.28, begin: 232.500, index: 725 },
  { text: "na", duration: 0.28, begin: 232.750, index: 726 },
  { text: " şim", duration: 0.28, begin: 233.000, index: 727 },
  { text: "di", duration: 0.28, begin: 233.250, index: 728 },
  { text: " söy", duration: 0.28, begin: 233.500, index: 729 },
  { text: "le", duration: 0.28, begin: 233.750, index: 730 },
  { text: "ye", duration: 0.28, begin: 234.000, index: 731 },
  { text: "bi", duration: 0.28, begin: 234.250, index: 732 },
  { text: "li", duration: 0.28, begin: 234.500, index: 733 },
  { text: "rim.", duration: 0.28, begin: 234.750, index: 734 },
  { text: " Ben", duration: 0.28, begin: 235.750, index: 735 },
  { text: " se", duration: 0.28, begin: 236.000, index: 736 },
  { text: "nin", duration: 0.28, begin: 236.250, index: 737 },
  { text: " öğ", duration: 0.28, begin: 236.500, index: 738 },
  { text: "ret", duration: 0.28, begin: 236.750, index: 739 },
  { text: "me", duration: 0.28, begin: 237.000, index: 740 },
  { text: "nin", duration: 0.28, begin: 237.250, index: 741 },
  { text: "ken,", duration: 0.28, begin: 237.500, index: 742 },
  { text: " ha", duration: 0.28, begin: 238.250, index: 743 },
  { text: "yal", duration: 0.28, begin: 238.500, index: 744 },
  { text: " hır", duration: 0.28, begin: 238.750, index: 745 },
  { text: "sı", duration: 0.28, begin: 239.000, index: 746 },
  { text: "zıy", duration: 0.28, begin: 239.250, index: 747 },
  { text: "dım.", duration: 0.28, begin: 239.500, index: 748 },
  { text: " O", duration: 0.28, begin: 240.500, index: 749 },
  { text: " yıl", duration: 0.28, begin: 240.750, index: 750 },
  { text: "lar", duration: 0.28, begin: 241.000, index: 751 },
  { text: "da", duration: 0.28, begin: 241.250, index: 752 },
  { text: " öğ", duration: 0.28, begin: 241.500, index: 753 },
  { text: "ren", duration: 0.28, begin: 241.750, index: 754 },
  { text: "ci", duration: 0.28, begin: 242.000, index: 755 },
  { text: "le", duration: 0.28, begin: 242.250, index: 756 },
  { text: "rim", duration: 0.28, begin: 242.500, index: 757 },
  { text: "den", duration: 0.28, begin: 242.750, index: 758 },
  { text: " pek", duration: 0.40, begin: 243.500, index: 759 },
  { text: " çok", duration: 0.40, begin: 243.750, index: 760 },
  { text: " ha", duration: 0.40, begin: 244.000, index: 761 },
  { text: "yal", duration: 0.40, begin: 244.250, index: 762 },
  { text: "ler", duration: 0.40, begin: 244.500, index: 763 },
  { text: " çal", duration: 0.40, begin: 244.750, index: 764 },
  { text: "dım.", duration: 0.40, begin: 245.000, index: 765 },
  { text: " Al", duration: 0.28, begin: 246.250, index: 766 },
  { text: "lah'", duration: 0.28, begin: 246.500, index: 767 },
  { text: "tan", duration: 0.28, begin: 246.750, index: 768 },
  { text: " ki,", duration: 0.28, begin: 247.000, index: 769 },
  { text: " sen,", duration: 0.28, begin: 247.750, index: 770 },
  { text: " ha", duration: 0.28, begin: 248.750, index: 771 },
  { text: "yal", duration: 0.28, begin: 249.000, index: 772 },
  { text: "le", duration: 0.28, begin: 249.250, index: 773 },
  { text: "rin", duration: 0.28, begin: 249.500, index: 774 },
  { text: "den", duration: 0.28, begin: 249.750, index: 775 },
  { text: " vaz", duration: 0.28, begin: 250.000, index: 776 },
  { text: "geç", duration: 0.28, begin: 250.250, index: 777 },
  { text: "me", duration: 0.28, begin: 250.500, index: 778 },
  { text: "ye", duration: 0.28, begin: 250.750, index: 779 },
  { text: "cek", duration: 0.28, begin: 251.000, index: 780 },
  { text: " ka", duration: 0.28, begin: 251.250, index: 781 },
  { text: "dar", duration: 0.28, begin: 251.500, index: 782 },
  { text: " i", duration: 0.38, begin: 251.750, index: 783 },
  { text: "nat", duration: 0.38, begin: 252.000, index: 784 },
  { text: "çıy", duration: 0.38, begin: 252.250, index: 785 },
  { text: "dın.", duration: 0.38, begin: 252.500, index: 786 }
  
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
  <Link href="/dashboard/stories/profesyonel-yardim" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/zeka-ozurluler-sinifi" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/3-6.mp3"
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