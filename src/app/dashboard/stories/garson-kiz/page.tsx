"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  ArrowLeft,
  SkipForward,
  SkipBack,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { auth, db } from "../../../../../firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
interface TextSegment {
  text: string;
  duration: number;
  begin: number;
  index: number;
  isTitle?: boolean;
  isCenter?: boolean;
}

export default function KirZincirleriniPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [audioDuration, setAudioDuration] = useState(0);

  const [user, setUser] = useState<User | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Story text segments with timing data - COMPLETE VERSION
  const textSegments: TextSegment[] = [
    // Initial speaking indicator

    // Title
    {
      text: "Gar",
      duration: 0.53,
      begin: 0.5,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "son",
      duration: 0.53,
      begin: 0.75,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Kız",
      duration: 0.53,
      begin: 1.0,
      index: 3,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Bir", duration: 0.48, begin: 2.25, index: 4 },
    { text: " pas", duration: 0.48, begin: 2.5, index: 5 },
    { text: "ta", duration: 0.48, begin: 2.75, index: 6 },
    { text: "nın", duration: 0.53, begin: 3.0, index: 7 },
    { text: " üç", duration: 0.48, begin: 3.5, index: 8 },
    { text: " o", duration: 0.48, begin: 3.75, index: 9 },
    { text: "tuz", duration: 0.48, begin: 4.0, index: 10 },
    { text: " pa", duration: 0.48, begin: 4.25, index: 11 },
    { text: "ra", duration: 0.48, begin: 4.5, index: 12 },
    { text: "ya", duration: 0.48, begin: 4.75, index: 13 },
    { text: " sa", duration: 0.53, begin: 5.0, index: 14 },
    { text: "tıl", duration: 0.53, begin: 5.25, index: 15 },
    { text: "dı", duration: 0.53, begin: 5.5, index: 16 },
    { text: "ğı", duration: 0.53, begin: 5.75, index: 17 },
    { text: " gün", duration: 0.53, begin: 6.25, index: 18 },
    { text: "ler", duration: 0.53, begin: 6.5, index: 19 },
    { text: "de", duration: 0.53, begin: 6.75, index: 20 },
    { text: " On", duration: 0.53, begin: 7.75, index: 21 },
    { text: " ya", duration: 0.53, begin: 8.0, index: 22 },
    { text: "şın", duration: 0.53, begin: 8.25, index: 23 },
    { text: "da", duration: 0.53, begin: 8.5, index: 24 },
    { text: " bir", duration: 0.53, begin: 8.75, index: 25 },
    { text: " ço", duration: 0.53, begin: 9.0, index: 26 },
    { text: "cuk", duration: 0.53, begin: 9.25, index: 27 },
    { text: " pas", duration: 0.53, begin: 9.75, index: 28 },
    { text: "ta", duration: 0.53, begin: 10.0, index: 29 },
    { text: "ne", duration: 0.53, begin: 10.25, index: 30 },
    { text: "ye", duration: 0.53, begin: 10.5, index: 31 },
    { text: " gir", duration: 0.53, begin: 10.75, index: 32 },
    { text: "di.", duration: 0.53, begin: 11.0, index: 33 },
    { text: " Gar", duration: 0.53, begin: 12.0, index: 34 },
    { text: "son", duration: 0.53, begin: 12.25, index: 35 },
    { text: " kız", duration: 0.53, begin: 12.75, index: 36 },
    { text: " he", duration: 0.28, begin: 13.5, index: 37 },
    { text: "men", duration: 0.28, begin: 13.75, index: 38 },
    { text: " koş", duration: 0.53, begin: 14.0, index: 39 },
    { text: "tu.", duration: 0.53, begin: 14.25, index: 40 },
    { text: " Ço", duration: 0.53, begin: 15.25, index: 41 },
    { text: "cuk", duration: 0.53, begin: 15.5, index: 42 },
    { text: " sor", duration: 0.53, begin: 15.75, index: 43 },
    { text: "du:", duration: 0.53, begin: 16.0, index: 44 },
    { text: ' "Çi', duration: 0.53, begin: 17.25, index: 45 },
    { text: "ko", duration: 0.53, begin: 17.5, index: 46 },
    { text: "la", duration: 0.53, begin: 17.75, index: 47 },
    { text: "ta", duration: 0.53, begin: 18.0, index: 48 },
    { text: "lı", duration: 0.53, begin: 18.25, index: 49 },
    { text: " pas", duration: 0.53, begin: 18.5, index: 50 },
    { text: "ta", duration: 0.53, begin: 18.75, index: 51 },
    { text: " kaç", duration: 0.53, begin: 19.0, index: 52 },
    { text: " pa", duration: 0.53, begin: 19.25, index: 53 },
    { text: 'ra?"', duration: 0.53, begin: 19.5, index: 54 },
    { text: " Gar", duration: 0.53, begin: 20.75, index: 55 },
    { text: "son", duration: 0.53, begin: 21.0, index: 56 },
    { text: " kız,", duration: 0.53, begin: 21.25, index: 57 },
    { text: ' "El', duration: 0.53, begin: 22.25, index: 58 },
    { text: "li", duration: 0.53, begin: 22.5, index: 59 },
    { text: ' cent"', duration: 0.53, begin: 22.75, index: 60 },
    { text: " di", duration: 0.53, begin: 23.5, index: 61 },
    { text: "ye", duration: 0.53, begin: 23.75, index: 62 },
    { text: " ya", duration: 0.53, begin: 24.0, index: 63 },
    { text: "nıt", duration: 0.53, begin: 24.25, index: 64 },
    { text: "la", duration: 0.53, begin: 24.5, index: 65 },
    { text: "dı.", duration: 0.53, begin: 24.75, index: 66 },
    { text: " Ço", duration: 0.53, begin: 25.75, index: 67 },
    { text: "cuk", duration: 0.53, begin: 26.0, index: 68 },
    { text: " ce", duration: 0.53, begin: 26.25, index: 69 },
    { text: "bin", duration: 0.53, begin: 26.5, index: 70 },
    { text: "den", duration: 0.53, begin: 26.75, index: 71 },
    { text: " çı", duration: 0.53, begin: 27.25, index: 72 },
    { text: "kar", duration: 0.53, begin: 27.5, index: 73 },
    { text: "dı", duration: 0.53, begin: 27.75, index: 74 },
    { text: "ğı", duration: 0.53, begin: 28.0, index: 75 },
    { text: " bo", duration: 0.53, begin: 28.25, index: 76 },
    { text: "zuk", duration: 0.53, begin: 28.5, index: 77 },
    { text: "la", duration: 0.53, begin: 28.75, index: 78 },
    { text: "rı", duration: 0.53, begin: 29.0, index: 79 },
    { text: " say", duration: 0.53, begin: 29.25, index: 80 },
    { text: "dı.", duration: 0.53, begin: 29.5, index: 81 },
    { text: " Bir", duration: 0.53, begin: 30.5, index: 82 },
    { text: " da", duration: 0.53, begin: 30.75, index: 83 },
    { text: "ha", duration: 0.53, begin: 31.0, index: 84 },
    { text: " sor", duration: 0.53, begin: 31.25, index: 85 },
    { text: "du:", duration: 0.53, begin: 31.5, index: 86 },
    { text: ' "Pe', duration: 0.53, begin: 32.75, index: 87 },
    { text: "ki,", duration: 0.53, begin: 33.0, index: 88 },
    { text: " don", duration: 0.53, begin: 33.75, index: 89 },
    { text: "dur", duration: 0.53, begin: 34.0, index: 90 },
    { text: "ma", duration: 0.53, begin: 34.25, index: 91 },
    { text: " ne", duration: 0.53, begin: 34.5, index: 92 },
    { text: " ka", duration: 0.53, begin: 34.75, index: 93 },
    { text: 'dar?"', duration: 0.53, begin: 35.0, index: 94 },
    { text: ' "O', duration: 0.53, begin: 36.25, index: 95 },
    { text: "tuz", duration: 0.53, begin: 36.5, index: 96 },
    { text: " beş", duration: 0.53, begin: 36.75, index: 97 },
    { text: ' cent"', duration: 0.53, begin: 37.0, index: 98 },
    { text: " de", duration: 0.28, begin: 38.0, index: 99 },
    { text: "di", duration: 0.28, begin: 38.25, index: 100 },
    { text: " gar", duration: 0.48, begin: 38.5, index: 101 },
    { text: "son", duration: 0.48, begin: 38.75, index: 102 },
    { text: " kız", duration: 0.48, begin: 39.0, index: 103 },
    { text: " sa", duration: 0.48, begin: 39.5, index: 104 },
    { text: "bır", duration: 0.48, begin: 39.75, index: 105 },
    { text: "sız", duration: 0.48, begin: 40.0, index: 106 },
    { text: "lık", duration: 0.48, begin: 40.25, index: 107 },
    { text: "la.", duration: 0.48, begin: 40.5, index: 108 },
    { text: " Dük", duration: 0.53, begin: 41.75, index: 109 },
    { text: "kan", duration: 0.53, begin: 42.0, index: 110 },
    { text: "da", duration: 0.53, begin: 42.25, index: 111 },
    { text: " yı", duration: 0.53, begin: 42.5, index: 112 },
    { text: "ğın", duration: 0.53, begin: 42.75, index: 113 },
    { text: "la", duration: 0.53, begin: 43.0, index: 114 },
    { text: " müş", duration: 0.53, begin: 43.25, index: 115 },
    { text: "te", duration: 0.53, begin: 43.5, index: 116 },
    { text: "ri", duration: 0.53, begin: 43.75, index: 117 },
    { text: " var", duration: 0.53, begin: 44.0, index: 118 },
    { text: "dı", duration: 0.53, begin: 44.25, index: 119 },
    { text: " ve", duration: 0.53, begin: 44.5, index: 120 },
    { text: " kız", duration: 0.53, begin: 45.75, index: 121 },
    { text: " hep", duration: 0.53, begin: 46.25, index: 122 },
    { text: "si", duration: 0.53, begin: 46.5, index: 123 },
    { text: "ne", duration: 0.53, begin: 46.75, index: 124 },
    { text: " tek", duration: 0.53, begin: 47.0, index: 125 },
    { text: " ba", duration: 0.53, begin: 47.25, index: 126 },
    { text: "şı", duration: 0.53, begin: 47.5, index: 127 },
    { text: "na", duration: 0.53, begin: 47.75, index: 128 },
    { text: " ko", duration: 0.53, begin: 48.0, index: 129 },
    { text: "şuş", duration: 0.53, begin: 48.25, index: 130 },
    { text: "tu", duration: 0.53, begin: 48.5, index: 131 },
    { text: "ru", duration: 0.53, begin: 48.75, index: 132 },
    { text: "yor", duration: 0.53, begin: 49.0, index: 133 },
    { text: "du.", duration: 0.53, begin: 49.25, index: 134 },
    { text: " Bu", duration: 0.53, begin: 50.75, index: 135 },
    { text: " ço", duration: 0.53, begin: 51.0, index: 136 },
    { text: "cuk", duration: 0.53, begin: 51.25, index: 137 },
    { text: "la", duration: 0.53, begin: 51.5, index: 138 },
    { text: " da", duration: 0.28, begin: 52.5, index: 139 },
    { text: "ha", duration: 0.28, begin: 52.75, index: 140 },
    { text: " ne", duration: 0.28, begin: 53.0, index: 141 },
    { text: " ka", duration: 0.28, begin: 53.25, index: 142 },
    { text: "dar", duration: 0.38, begin: 53.5, index: 143 },
    { text: " va", duration: 0.38, begin: 53.75, index: 144 },
    { text: "kit", duration: 0.38, begin: 54.0, index: 145 },
    { text: " ge", duration: 0.38, begin: 54.25, index: 146 },
    { text: "çi", duration: 0.38, begin: 54.5, index: 147 },
    { text: "re", duration: 0.38, begin: 54.75, index: 148 },
    { text: "bi", duration: 0.38, begin: 55.0, index: 149 },
    { text: "lir", duration: 0.38, begin: 55.25, index: 150 },
    { text: "di", duration: 0.38, begin: 55.5, index: 151 },
    { text: " ki...", duration: 0.38, begin: 55.75, index: 152 },
    { text: " Ço", duration: 0.53, begin: 56.75, index: 153 },
    { text: "cuk", duration: 0.53, begin: 57.0, index: 154 },
    { text: " pa", duration: 0.53, begin: 57.75, index: 155 },
    { text: "ra", duration: 0.53, begin: 58.0, index: 156 },
    { text: "sı", duration: 0.53, begin: 58.25, index: 157 },
    { text: "nı", duration: 0.53, begin: 58.5, index: 158 },
    { text: " bir", duration: 0.53, begin: 58.75, index: 159 },
    { text: " da", duration: 0.53, begin: 59.0, index: 160 },
    { text: "ha", duration: 0.53, begin: 59.25, index: 161 },
    { text: " say", duration: 0.53, begin: 59.5, index: 162 },
    { text: "dı", duration: 0.53, begin: 59.75, index: 163 },
    { text: " ve:", duration: 0.53, begin: 60.0, index: 164 },
    { text: ' "Bir', duration: 0.53, begin: 61.25, index: 165 },
    { text: " don", duration: 0.53, begin: 61.5, index: 166 },
    { text: "dur", duration: 0.53, begin: 61.75, index: 167 },
    { text: "ma", duration: 0.53, begin: 62.0, index: 168 },
    { text: " a", duration: 0.53, begin: 62.25, index: 169 },
    { text: "la", duration: 0.53, begin: 62.5, index: 170 },
    { text: "bi", duration: 0.53, begin: 62.75, index: 171 },
    { text: "lir", duration: 0.53, begin: 63.0, index: 172 },
    { text: " mi", duration: 0.53, begin: 63.25, index: 173 },
    { text: "yim,", duration: 0.53, begin: 63.5, index: 174 },
    { text: " lüt", duration: 0.28, begin: 64.5, index: 175 },
    { text: 'fen"', duration: 0.28, begin: 64.75, index: 176 },
    { text: " de", duration: 0.53, begin: 65.25, index: 177 },
    { text: "di.", duration: 0.53, begin: 65.5, index: 178 },
    { text: " Kız", duration: 0.53, begin: 67.0, index: 179 },
    { text: " don", duration: 0.53, begin: 67.75, index: 180 },
    { text: "dur", duration: 0.53, begin: 68.0, index: 181 },
    { text: "ma", duration: 0.53, begin: 68.25, index: 182 },
    { text: "yı", duration: 0.53, begin: 68.5, index: 183 },
    { text: " ge", duration: 0.53, begin: 68.75, index: 184 },
    { text: "tir", duration: 0.53, begin: 69.0, index: 185 },
    { text: "di.", duration: 0.53, begin: 69.25, index: 186 },
    { text: " Fi", duration: 0.53, begin: 70.25, index: 187 },
    { text: "şi", duration: 0.53, begin: 70.5, index: 188 },
    { text: " ta", duration: 0.53, begin: 70.75, index: 189 },
    { text: "ba", duration: 0.53, begin: 71.0, index: 190 },
    { text: "ğın", duration: 0.53, begin: 71.25, index: 191 },
    { text: " ke", duration: 0.53, begin: 71.5, index: 192 },
    { text: "na", duration: 0.53, begin: 71.75, index: 193 },
    { text: "rı", duration: 0.53, begin: 72.0, index: 194 },
    { text: "na", duration: 0.53, begin: 72.25, index: 195 },
    { text: " koy", duration: 0.53, begin: 72.5, index: 196 },
    { text: "du", duration: 0.53, begin: 72.75, index: 197 },
    { text: " ve", duration: 0.53, begin: 73.0, index: 198 },
    { text: " ö", duration: 0.53, begin: 73.75, index: 199 },
    { text: "te", duration: 0.53, begin: 74.0, index: 200 },
    { text: "ki", duration: 0.53, begin: 74.25, index: 201 },
    { text: " ma", duration: 0.53, begin: 74.5, index: 202 },
    { text: "sa", duration: 0.53, begin: 74.75, index: 203 },
    { text: "ya", duration: 0.53, begin: 75.0, index: 204 },
    { text: " koş", duration: 0.53, begin: 75.25, index: 205 },
    { text: "tu.", duration: 0.53, begin: 75.5, index: 206 },
    { text: " Ço", duration: 0.53, begin: 76.5, index: 207 },
    { text: "cuk", duration: 0.53, begin: 76.75, index: 208 },
    { text: " don", duration: 0.53, begin: 77.75, index: 209 },
    { text: "dur", duration: 0.53, begin: 78.0, index: 210 },
    { text: "ma", duration: 0.53, begin: 78.25, index: 211 },
    { text: "sı", duration: 0.53, begin: 78.5, index: 212 },
    { text: "nı", duration: 0.53, begin: 78.75, index: 213 },
    { text: " bi", duration: 0.53, begin: 79.0, index: 214 },
    { text: "tir", duration: 0.53, begin: 79.25, index: 215 },
    { text: "di.", duration: 0.53, begin: 79.5, index: 216 },
    { text: " Fi", duration: 0.53, begin: 80.25, index: 217 },
    { text: "şi", duration: 0.53, begin: 80.5, index: 218 },
    { text: " ka", duration: 0.53, begin: 80.75, index: 219 },
    { text: "sa", duration: 0.53, begin: 81.0, index: 220 },
    { text: "ya", duration: 0.53, begin: 81.25, index: 221 },
    { text: " ö", duration: 0.53, begin: 81.5, index: 222 },
    { text: "de", duration: 0.53, begin: 81.75, index: 223 },
    { text: "di.", duration: 0.53, begin: 82.0, index: 224 },
    { text: " Gar", duration: 0.53, begin: 83.5, index: 225 },
    { text: "son", duration: 0.53, begin: 83.75, index: 226 },
    { text: " kız", duration: 0.53, begin: 84.0, index: 227 },
    { text: " ma", duration: 0.53, begin: 84.75, index: 228 },
    { text: "sa", duration: 0.53, begin: 85.0, index: 229 },
    { text: "yı", duration: 0.53, begin: 85.25, index: 230 },
    { text: " te", duration: 0.53, begin: 85.5, index: 231 },
    { text: "miz", duration: 0.53, begin: 85.75, index: 232 },
    { text: "le", duration: 0.53, begin: 86.0, index: 233 },
    { text: "mek", duration: 0.53, begin: 86.25, index: 234 },
    { text: " ü", duration: 0.53, begin: 86.5, index: 235 },
    { text: "ze", duration: 0.53, begin: 86.75, index: 236 },
    { text: "re", duration: 0.53, begin: 87.0, index: 237 },
    { text: " gel", duration: 0.53, begin: 87.25, index: 238 },
    { text: "di", duration: 0.53, begin: 87.5, index: 239 },
    { text: "ğin", duration: 0.53, begin: 87.75, index: 240 },
    { text: "de,", duration: 0.53, begin: 88.0, index: 241 },
    { text: " göz", duration: 0.53, begin: 89.0, index: 242 },
    { text: "le", duration: 0.53, begin: 89.25, index: 243 },
    { text: "ri", duration: 0.53, begin: 89.5, index: 244 },
    { text: " dol", duration: 0.53, begin: 89.75, index: 245 },
    { text: "du.", duration: 0.53, begin: 90.0, index: 246 },
    { text: " Boş", duration: 0.53, begin: 91.0, index: 247 },
    { text: " don", duration: 0.53, begin: 91.25, index: 248 },
    { text: "dur", duration: 0.53, begin: 91.5, index: 249 },
    { text: "ma", duration: 0.53, begin: 91.75, index: 250 },
    { text: " ta", duration: 0.53, begin: 92.0, index: 251 },
    { text: "ba", duration: 0.53, begin: 92.25, index: 252 },
    { text: "ğı", duration: 0.53, begin: 92.5, index: 253 },
    { text: "nın", duration: 0.53, begin: 92.75, index: 254 },
    { text: " ya", duration: 0.53, begin: 93.0, index: 255 },
    { text: "nın", duration: 0.53, begin: 93.25, index: 256 },
    { text: "da", duration: 0.53, begin: 93.5, index: 257 },
    { text: " ço", duration: 0.53, begin: 94.75, index: 258 },
    { text: "cu", duration: 0.53, begin: 95.0, index: 259 },
    { text: "ğun", duration: 0.53, begin: 95.25, index: 260 },
    { text: " bı", duration: 0.53, begin: 95.5, index: 261 },
    { text: "rak", duration: 0.53, begin: 95.75, index: 262 },
    { text: "tı", duration: 0.53, begin: 96.0, index: 263 },
    { text: "ğı", duration: 0.53, begin: 96.25, index: 264 },
    { text: " On", duration: 0.53, begin: 97.0, index: 265 },
    { text: " beş", duration: 0.53, begin: 97.25, index: 266 },
    { text: " cent", duration: 0.53, begin: 97.5, index: 267 },
    { text: " bah", duration: 0.53, begin: 98.0, index: 268 },
    { text: "şiş", duration: 0.53, begin: 98.25, index: 269 },
    { text: " du", duration: 0.53, begin: 98.5, index: 270 },
    { text: "ru", duration: 0.53, begin: 98.75, index: 271 },
    { text: "yor", duration: 0.53, begin: 99.0, index: 272 },
    { text: "du.", duration: 0.53, begin: 99.25, index: 273 },
  ];

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle audio metadata loaded to get duration
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      audioRef.current.play();
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const time = audioRef.current.currentTime;
          setCurrentTime(time);
          const activeSegment = textSegments.find(
            (segment) =>
              time >= segment.begin && time < segment.begin + segment.duration
          );
          if (activeSegment) {
            setActiveIndex(activeSegment.index);
          }
        }
      }, 50);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        audioRef.current?.duration || 0
      );
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const clickPercentage = clickX / progressWidth;
    const newTime = clickPercentage * (audioRef.current.duration || 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setActiveIndex(-1);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  // First useEffect: Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Second useEffect: Track visit when user is available
  useEffect(() => {
    const trackVisit = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (!userDoc.exists()) return;

          const userData = userDoc.data();
          const username = userData.username || userData.firstName || "Unknown";

          // Get story ID from current URL (last part)
          const currentPath = window.location.pathname;
          const storyId = currentPath.split("/").pop() || "unknown";

          // Convert kebab-case to Title Case for display
          const storyName = storyId
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

          await addDoc(collection(db, "storyVisits"), {
            userId: user.uid,
            username: username,
            storyName: storyName,
            storyId: storyId,
            visitedAt: serverTimestamp(),
          });

          console.log(`✅ Visit tracked: ${storyName}`);
        } catch (error) {
          console.error("❌ Error:", error);
        }
      }
    };
    trackVisit();
  }, [user]);
  const renderTextSegments = () => {
    const titleSegments = textSegments.filter((segment) => segment.isTitle);
    const bodySegments = textSegments.filter(
      (segment) => !segment.isTitle && segment.text.trim()
    );

    return (
      <div className="space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
            {titleSegments.map((segment) => (
              <span
                key={segment.index}
                className={`transition-all duration-300 font-extrabold ${
                  activeIndex === segment.index
                    ? "text-black underline decoration-2 decoration-black opacity-100"
                    : segment.index < activeIndex
                      ? "text-black opacity-100"
                      : "text-slate-900 opacity-70"
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
                className={`transition-all duration-300 font-bold ${
                  activeIndex === segment.index
                    ? "text-black underline decoration-2 decoration-black opacity-100"
                    : segment.index < activeIndex
                      ? "text-black opacity-100"
                      : "text-slate-700 opacity-70"
                }`}
              >
                {segment.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/stories"
              className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Hikayelere Dön</span>
              <span className="sm:hidden">Geri</span>
            </Link>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-5">
              <Link
                href="/dashboard/stories/kisilik"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
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
              <h2 className="text-lg font-semibold text-slate-900 whitespace-nowrap">
                Sesli Okuma
              </h2>
              <div
                className="text-sm text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded"
                style={{
                  minWidth: "110px",
                  textAlign: "center",
                  display: "inline-block",
                }}
              >
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
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
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
            src="/3-1.mp3"
            onEnded={handleAudioEnded}
            onLoadedMetadata={handleLoadedMetadata}
          />
        </div>

        {/* Story Content */}
        {renderTextSegments()}
      </div>
    </div>
  );
}
