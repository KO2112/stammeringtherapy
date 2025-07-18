"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  ArrowLeft,
  SkipForward,
  SkipBack,
  ChevronLeft,
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
    // Title
    {
      text: "Pro",
      duration: 0.28,
      begin: 0.7,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "fes",
      duration: 0.38,
      begin: 1.0,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "yo",
      duration: 0.38,
      begin: 1.25,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "nel",
      duration: 0.28,
      begin: 1.5,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Yar",
      duration: 0.38,
      begin: 1.85,
      index: 5,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "dım",
      duration: 0.38,
      begin: 2.15,
      index: 6,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Genç", duration: 0.28, begin: 3.25, index: 7 },
    { text: " ka", duration: 0.28, begin: 3.5, index: 8 },
    { text: "dın", duration: 0.28, begin: 3.75, index: 9 },
    { text: " iş", duration: 0.28, begin: 4.25, index: 10 },
    { text: "ye", duration: 0.28, begin: 4.5, index: 11 },
    { text: "rin", duration: 0.28, begin: 4.75, index: 12 },
    { text: "de", duration: 0.28, begin: 5.0, index: 13 },
    { text: " kö", duration: 0.28, begin: 5.25, index: 14 },
    { text: "tü", duration: 0.28, begin: 5.5, index: 15 },
    { text: " bir", duration: 0.28, begin: 5.75, index: 16 },
    { text: " ha", duration: 0.28, begin: 6.0, index: 17 },
    { text: "ber", duration: 0.28, begin: 6.25, index: 18 },
    { text: " a", duration: 0.28, begin: 6.5, index: 19 },
    { text: "lır.", duration: 0.28, begin: 6.75, index: 20 },
    { text: " Kü", duration: 0.28, begin: 7.5, index: 21 },
    { text: "çük", duration: 0.28, begin: 7.75, index: 22 },
    { text: " kı", duration: 0.28, begin: 8.0, index: 23 },
    { text: "zı", duration: 0.28, begin: 8.25, index: 24 },
    { text: "nın", duration: 0.28, begin: 8.5, index: 25 },
    { text: " ba", duration: 0.28, begin: 8.75, index: 26 },
    { text: "kı", duration: 0.28, begin: 9.0, index: 27 },
    { text: "cı", duration: 0.28, begin: 9.25, index: 28 },
    { text: "sı", duration: 0.28, begin: 9.5, index: 29 },
    { text: " te", duration: 0.28, begin: 10.25, index: 30 },
    { text: "le", duration: 0.28, begin: 10.5, index: 31 },
    { text: "fon", duration: 0.28, begin: 10.75, index: 32 },
    { text: "da", duration: 0.28, begin: 11.0, index: 33 },
    { text: " ço", duration: 0.28, begin: 11.25, index: 34 },
    { text: "cu", duration: 0.28, begin: 11.5, index: 35 },
    { text: "ğun", duration: 0.28, begin: 11.75, index: 36 },
    { text: " çok", duration: 0.28, begin: 12.0, index: 37 },
    { text: " a", duration: 0.28, begin: 12.25, index: 38 },
    { text: "teş", duration: 0.28, begin: 12.5, index: 39 },
    { text: "len", duration: 0.28, begin: 12.75, index: 40 },
    { text: "di", duration: 0.28, begin: 13.0, index: 41 },
    { text: "ği", duration: 0.28, begin: 13.25, index: 42 },
    { text: "ni", duration: 0.28, begin: 13.5, index: 43 },
    { text: " mut", duration: 0.28, begin: 14.0, index: 44 },
    { text: "la", duration: 0.28, begin: 14.25, index: 45 },
    { text: "ka", duration: 0.28, begin: 14.5, index: 46 },
    { text: " e", duration: 0.28, begin: 15.0, index: 47 },
    { text: "ve", duration: 0.28, begin: 15.25, index: 48 },
    { text: " gel", duration: 0.28, begin: 15.75, index: 49 },
    { text: "me", duration: 0.28, begin: 16.0, index: 50 },
    { text: "si", duration: 0.28, begin: 16.25, index: 51 },
    { text: " ge", duration: 0.28, begin: 16.5, index: 52 },
    { text: "rek", duration: 0.28, begin: 16.7, index: 53 },
    { text: "ti", duration: 0.28, begin: 16.9, index: 54 },
    { text: "ği", duration: 0.28, begin: 17.2, index: 55 },
    { text: "ni", duration: 0.28, begin: 17.5, index: 56 },
    { text: " bil", duration: 0.28, begin: 17.7, index: 57 },
    { text: "di", duration: 0.28, begin: 17.9, index: 58 },
    { text: "rir.", duration: 0.28, begin: 18.25, index: 59 },
    { text: " He", duration: 0.28, begin: 19.0, index: 60 },
    { text: "men", duration: 0.28, begin: 19.25, index: 61 },
    { text: " i", duration: 0.28, begin: 19.5, index: 62 },
    { text: "şin", duration: 0.28, begin: 19.75, index: 63 },
    { text: "den", duration: 0.28, begin: 20.0, index: 64 },
    { text: " i", duration: 0.28, begin: 20.25, index: 65 },
    { text: "zin", duration: 0.28, begin: 20.5, index: 66 },
    { text: " a", duration: 0.28, begin: 20.75, index: 67 },
    { text: "lır", duration: 0.28, begin: 21.0, index: 68 },
    { text: " ve", duration: 0.28, begin: 21.25, index: 69 },
    { text: " a", duration: 0.28, begin: 21.75, index: 70 },
    { text: "teş", duration: 0.28, begin: 22.0, index: 71 },
    { text: " dü", duration: 0.28, begin: 22.25, index: 72 },
    { text: "şü", duration: 0.28, begin: 22.5, index: 73 },
    { text: "rü", duration: 0.28, begin: 22.75, index: 74 },
    { text: "cü", duration: 0.28, begin: 23.0, index: 75 },
    { text: " bir", duration: 0.28, begin: 23.25, index: 76 },
    { text: " i", duration: 0.28, begin: 23.5, index: 77 },
    { text: "laç", duration: 0.28, begin: 23.75, index: 78 },
    { text: " i", duration: 0.28, begin: 24.0, index: 79 },
    { text: "çin", duration: 0.28, begin: 24.25, index: 80 },
    { text: " en", duration: 0.28, begin: 24.75, index: 81 },
    { text: " ya", duration: 0.28, begin: 25.0, index: 82 },
    { text: "kın", duration: 0.28, begin: 25.25, index: 83 },
    { text: " ec", duration: 0.28, begin: 25.5, index: 84 },
    { text: "za", duration: 0.28, begin: 25.75, index: 85 },
    { text: "ne", duration: 0.28, begin: 26.0, index: 86 },
    { text: "ye", duration: 0.28, begin: 26.25, index: 87 },
    { text: " ko", duration: 0.28, begin: 26.5, index: 88 },
    { text: "şar.", duration: 0.28, begin: 26.75, index: 89 },
    { text: " A", duration: 0.28, begin: 28.0, index: 90 },
    { text: "ra", duration: 0.28, begin: 28.25, index: 91 },
    { text: "ba", duration: 0.28, begin: 28.5, index: 92 },
    { text: "sı", duration: 0.28, begin: 28.75, index: 93 },
    { text: "nın", duration: 0.28, begin: 29.0, index: 94 },
    { text: " ya", duration: 0.28, begin: 29.25, index: 95 },
    { text: "nı", duration: 0.28, begin: 29.5, index: 96 },
    { text: "na", duration: 0.28, begin: 29.75, index: 97 },
    { text: " gel", duration: 0.28, begin: 30.0, index: 98 },
    { text: "di", duration: 0.28, begin: 30.25, index: 99 },
    { text: "ğin", duration: 0.28, begin: 30.5, index: 100 },
    { text: "de", duration: 0.28, begin: 30.75, index: 101 },
    { text: " a", duration: 0.28, begin: 31.25, index: 102 },
    { text: "ra", duration: 0.28, begin: 31.5, index: 103 },
    { text: "ba", duration: 0.28, begin: 31.75, index: 104 },
    { text: "yı", duration: 0.28, begin: 32.0, index: 105 },
    { text: " a", duration: 0.28, begin: 32.25, index: 106 },
    { text: "nah", duration: 0.28, begin: 32.5, index: 107 },
    { text: "ta", duration: 0.28, begin: 32.75, index: 108 },
    { text: "rı", duration: 0.28, begin: 33.0, index: 109 },
    { text: " i", duration: 0.28, begin: 33.5, index: 110 },
    { text: "çin", duration: 0.28, begin: 33.75, index: 111 },
    { text: "dey", duration: 0.28, begin: 34.0, index: 112 },
    { text: "ken", duration: 0.28, begin: 34.25, index: 113 },
    { text: " ki", duration: 0.28, begin: 34.5, index: 114 },
    { text: "lit", duration: 0.28, begin: 34.75, index: 115 },
    { text: "le", duration: 0.28, begin: 35.0, index: 116 },
    { text: "di", duration: 0.28, begin: 35.25, index: 117 },
    { text: "ği", duration: 0.28, begin: 35.5, index: 118 },
    { text: "nin", duration: 0.28, begin: 35.75, index: 119 },
    { text: " far", duration: 0.28, begin: 36.0, index: 120 },
    { text: "kı", duration: 0.28, begin: 36.25, index: 121 },
    { text: "na", duration: 0.28, begin: 36.5, index: 122 },
    { text: " va", duration: 0.28, begin: 36.75, index: 123 },
    { text: "rır.", duration: 0.28, begin: 37.0, index: 124 },
    { text: " E", duration: 0.28, begin: 37.5, index: 125 },
    { text: "ve", duration: 0.28, begin: 37.75, index: 126 },
    { text: " he", duration: 0.28, begin: 38.0, index: 127 },
    { text: "men", duration: 0.28, begin: 38.25, index: 128 },
    { text: " ye", duration: 0.28, begin: 38.5, index: 129 },
    { text: "tiş", duration: 0.28, begin: 38.75, index: 130 },
    { text: "me", duration: 0.28, begin: 39.0, index: 131 },
    { text: "si", duration: 0.28, begin: 39.25, index: 132 },
    { text: " ge", duration: 0.28, begin: 39.5, index: 133 },
    { text: "rek", duration: 0.28, begin: 39.75, index: 134 },
    { text: "mek", duration: 0.28, begin: 40.0, index: 135 },
    { text: "te", duration: 0.28, begin: 40.25, index: 136 },
    { text: "dir", duration: 0.28, begin: 40.5, index: 137 },
    { text: " a", duration: 0.28, begin: 41.0, index: 138 },
    { text: "ma", duration: 0.28, begin: 41.25, index: 139 },
    { text: " na", duration: 0.28, begin: 41.75, index: 140 },
    { text: "sıl?", duration: 0.28, begin: 41.808, index: 141 },
    { text: " E", duration: 0.28, begin: 43.5, index: 142 },
    { text: "vi", duration: 0.28, begin: 43.75, index: 143 },
    { text: "ni", duration: 0.28, begin: 44.0, index: 144 },
    { text: " a", duration: 0.28, begin: 44.25, index: 145 },
    { text: "rar,", duration: 0.28, begin: 44.5, index: 146 },
    { text: " an", duration: 0.28, begin: 45.0, index: 147 },
    { text: "cak", duration: 0.28, begin: 45.25, index: 148 },
    { text: " ço", duration: 0.28, begin: 45.5, index: 149 },
    { text: "cuk", duration: 0.28, begin: 45.75, index: 150 },
    { text: " ba", duration: 0.28, begin: 46.25, index: 151 },
    { text: "kı", duration: 0.28, begin: 46.5, index: 152 },
    { text: "cı", duration: 0.28, begin: 46.75, index: 153 },
    { text: "sı", duration: 0.28, begin: 47.0, index: 154 },
    { text: "nın", duration: 0.28, begin: 47.25, index: 155 },
    { text: " ver", duration: 0.28, begin: 47.5, index: 156 },
    { text: "di", duration: 0.28, begin: 47.75, index: 157 },
    { text: "ği", duration: 0.28, begin: 48.0, index: 158 },
    { text: " ha", duration: 0.28, begin: 48.25, index: 159 },
    { text: "ber", duration: 0.28, begin: 48.5, index: 160 },
    { text: " da", duration: 0.28, begin: 49.25, index: 161 },
    { text: "ha", duration: 0.28, begin: 49.5, index: 162 },
    { text: " kö", duration: 0.28, begin: 49.75, index: 163 },
    { text: "tü", duration: 0.28, begin: 50.0, index: 164 },
    { text: "dür.", duration: 0.28, begin: 50.25, index: 165 },
    { text: " Kı", duration: 0.28, begin: 50.75, index: 166 },
    { text: "zın", duration: 0.28, begin: 51.0, index: 167 },
    { text: " a", duration: 0.28, begin: 51.25, index: 168 },
    { text: "te", duration: 0.28, begin: 51.5, index: 169 },
    { text: "şi", duration: 0.28, begin: 51.75, index: 170 },
    { text: " bi", duration: 0.28, begin: 52.0, index: 171 },
    { text: "raz", duration: 0.28, begin: 52.25, index: 172 },
    { text: " da", duration: 0.28, begin: 52.5, index: 173 },
    { text: "ha", duration: 0.28, begin: 52.75, index: 174 },
    { text: " yük", duration: 0.28, begin: 53.0, index: 175 },
    { text: "sel", duration: 0.28, begin: 53.25, index: 176 },
    { text: "miş", duration: 0.28, begin: 53.5, index: 177 },
    { text: "tir.", duration: 0.28, begin: 53.75, index: 178 },
    { text: " Bu", duration: 0.28, begin: 54.75, index: 179 },
    { text: " a", duration: 0.28, begin: 55.0, index: 180 },
    { text: "ra", duration: 0.28, begin: 55.25, index: 181 },
    { text: "da", duration: 0.28, begin: 55.5, index: 182 },
    { text: " ka", duration: 0.28, begin: 55.75, index: 183 },
    { text: "dın", duration: 0.28, begin: 56.0, index: 184 },
    { text: " i", duration: 0.28, begin: 56.75, index: 185 },
    { text: "çin", duration: 0.28, begin: 57.0, index: 186 },
    { text: "de", duration: 0.28, begin: 57.25, index: 187 },
    { text: " bu", duration: 0.28, begin: 57.5, index: 188 },
    { text: "lun", duration: 0.28, begin: 57.75, index: 189 },
    { text: "du", duration: 0.28, begin: 58.0, index: 190 },
    { text: "ğu", duration: 0.28, begin: 58.25, index: 191 },
    { text: " du", duration: 0.28, begin: 58.5, index: 192 },
    { text: "ru", duration: 0.28, begin: 58.75, index: 193 },
    { text: "mu", duration: 0.28, begin: 59.0, index: 194 },
    { text: " ba", duration: 0.28, begin: 59.2, index: 195 },
    { text: "kı", duration: 0.28, begin: 59.4, index: 196 },
    { text: "cı", duration: 0.28, begin: 59.6, index: 197 },
    { text: "ya", duration: 0.28, begin: 59.8, index: 198 },
    { text: " an", duration: 0.28, begin: 60.0, index: 199 },
    { text: "la", duration: 0.28, begin: 60.2, index: 200 },
    { text: "tır.", duration: 0.28, begin: 60.4, index: 201 },
    { text: " Ba", duration: 0.28, begin: 61.25, index: 202 },
    { text: "kı", duration: 0.28, begin: 61.5, index: 203 },
    { text: "cı", duration: 0.28, begin: 61.75, index: 204 },
    { text: " a", duration: 0.28, begin: 62.25, index: 205 },
    { text: "ra", duration: 0.28, begin: 62.5, index: 206 },
    { text: "ba", duration: 0.28, begin: 62.75, index: 207 },
    { text: "nın", duration: 0.28, begin: 63.0, index: 208 },
    { text: " ki", duration: 0.28, begin: 63.2, index: 209 },
    { text: "li", duration: 0.28, begin: 63.4, index: 210 },
    { text: "di", duration: 0.28, begin: 63.6, index: 211 },
    { text: "ni", duration: 0.28, begin: 63.8, index: 212 },
    { text: " a", duration: 0.28, begin: 64.2, index: 213 },
    { text: "ça", duration: 0.28, begin: 64.4, index: 214 },
    { text: "bi", duration: 0.28, begin: 64.6, index: 215 },
    { text: "le", duration: 0.28, begin: 64.8, index: 216 },
    { text: "cek", duration: 0.28, begin: 65.0, index: 217 },
    { text: " bir", duration: 0.28, begin: 65.2, index: 218 },
    { text: " ser", duration: 0.28, begin: 65.6, index: 219 },
    { text: "vis", duration: 0.28, begin: 65.8, index: 220 },
    { text: " bul", duration: 0.28, begin: 66.0, index: 221 },
    { text: " ma", duration: 0.28, begin: 66.2, index: 222 },
    { text: "sı", duration: 0.28, begin: 66.4, index: 223 },
    { text: "nı", duration: 0.28, begin: 66.6, index: 224 },
    { text: " ya", duration: 0.28, begin: 67.8, index: 225 },
    { text: "da", duration: 0.28, begin: 68.0, index: 226 },
    { text: " ça", duration: 0.28, begin: 68.2, index: 227 },
    { text: "kı,", duration: 0.28, begin: 68.4, index: 228 },
    { text: " bı", duration: 0.28, begin: 69.6, index: 229 },
    { text: "çak", duration: 0.28, begin: 69.8, index: 230 },
    { text: " gi", duration: 0.28, begin: 70.0, index: 231 },
    { text: "bi", duration: 0.28, begin: 70.2, index: 232 },
    { text: " bir", duration: 0.28, begin: 70.4, index: 233 },
    { text: "şey", duration: 0.28, begin: 70.6, index: 234 },
    { text: "le", duration: 0.28, begin: 70.8, index: 235 },
    { text: " ken", duration: 0.28, begin: 71.6, index: 236 },
    { text: "di", duration: 0.28, begin: 71.8, index: 237 },
    { text: "si", duration: 0.28, begin: 72.0, index: 238 },
    { text: "nin", duration: 0.28, begin: 72.2, index: 239 },
    { text: " aç", duration: 0.28, begin: 72.6, index: 240 },
    { text: "ma", duration: 0.28, begin: 72.8, index: 241 },
    { text: "yı", duration: 0.28, begin: 73.0, index: 242 },
    { text: " de", duration: 0.28, begin: 73.2, index: 243 },
    { text: "ne", duration: 0.28, begin: 73.4, index: 244 },
    { text: "me", duration: 0.28, begin: 73.6, index: 245 },
    { text: "si", duration: 0.28, begin: 73.8, index: 246 },
    { text: "ni", duration: 0.28, begin: 74.0, index: 247 },
    { text: " söy", duration: 0.28, begin: 74.4, index: 248 },
    { text: "ler.", duration: 0.28, begin: 74.6, index: 249 },
    { text: " Ya", duration: 0.28, begin: 76.0, index: 250 },
    { text: "kın", duration: 0.28, begin: 76.25, index: 251 },
    { text: "da", duration: 0.28, begin: 76.5, index: 252 },
    { text: " bu", duration: 0.28, begin: 76.75, index: 253 },
    { text: "lu", duration: 0.28, begin: 77.0, index: 254 },
    { text: "nan", duration: 0.28, begin: 77.25, index: 255 },
    { text: " bir", duration: 0.28, begin: 77.5, index: 256 },
    { text: " mar", duration: 0.28, begin: 77.75, index: 257 },
    { text: "ket", duration: 0.28, begin: 78.0, index: 258 },
    { text: "ten", duration: 0.28, begin: 78.25, index: 259 },
    { text: " kü", duration: 0.28, begin: 79.25, index: 260 },
    { text: "çük", duration: 0.28, begin: 79.5, index: 261 },
    { text: " bir", duration: 0.28, begin: 79.75, index: 262 },
    { text: " ça", duration: 0.28, begin: 80.0, index: 263 },
    { text: "kı", duration: 0.28, begin: 80.25, index: 264 },
    { text: " a", duration: 0.28, begin: 80.5, index: 265 },
    { text: "lır", duration: 0.28, begin: 80.75, index: 266 },
    { text: " ve", duration: 0.28, begin: 81.0, index: 267 },
    { text: " a", duration: 0.28, begin: 81.75, index: 268 },
    { text: "ra", duration: 0.28, begin: 82.0, index: 269 },
    { text: "ba", duration: 0.28, begin: 82.25, index: 270 },
    { text: "nın", duration: 0.28, begin: 82.5, index: 271 },
    { text: " ya", duration: 0.28, begin: 82.75, index: 272 },
    { text: "nı", duration: 0.28, begin: 83.0, index: 273 },
    { text: "na", duration: 0.28, begin: 83.25, index: 274 },
    { text: " gi", duration: 0.28, begin: 83.5, index: 275 },
    { text: "der.", duration: 0.28, begin: 83.75, index: 276 },
    { text: " A", duration: 0.28, begin: 85.0, index: 277 },
    { text: "ma", duration: 0.28, begin: 85.25, index: 278 },
    { text: " bu", duration: 0.28, begin: 86.0, index: 279 },
    { text: "nun", duration: 0.28, begin: 86.25, index: 280 },
    { text: " na", duration: 0.28, begin: 86.5, index: 281 },
    { text: "sıl", duration: 0.28, begin: 86.75, index: 282 },
    { text: " kul", duration: 0.28, begin: 87.0, index: 283 },
    { text: "la", duration: 0.28, begin: 87.2, index: 284 },
    { text: "nı", duration: 0.28, begin: 87.4, index: 285 },
    { text: "la", duration: 0.28, begin: 87.6, index: 286 },
    { text: "ca", duration: 0.28, begin: 87.8, index: 287 },
    { text: "ğı", duration: 0.28, begin: 88.0, index: 288 },
    { text: "nı", duration: 0.28, begin: 88.2, index: 289 },
    { text: " bi", duration: 0.28, begin: 88.4, index: 290 },
    { text: "le", duration: 0.28, begin: 88.6, index: 291 },
    { text: "mez.", duration: 0.28, begin: 88.8, index: 292 },
    { text: " A", duration: 0.28, begin: 89.75, index: 293 },
    { text: "ra", duration: 0.28, begin: 90.0, index: 294 },
    { text: "ba", duration: 0.28, begin: 90.25, index: 295 },
    { text: "nın", duration: 0.28, begin: 90.5, index: 296 },
    { text: " ka", duration: 0.28, begin: 90.7, index: 297 },
    { text: "pı", duration: 0.28, begin: 90.9, index: 298 },
    { text: "la", duration: 0.28, begin: 91.1, index: 299 },
    { text: "rı", duration: 0.28, begin: 91.3, index: 300 },
    { text: "nı", duration: 0.28, begin: 91.5, index: 301 },
    { text: " zor", duration: 0.28, begin: 91.8, index: 302 },
    { text: "lar,", duration: 0.28, begin: 92.0, index: 303 },
    { text: " sal", duration: 0.28, begin: 92.8, index: 304 },
    { text: "lar", duration: 0.28, begin: 93.0, index: 305 },
    { text: " a", duration: 0.28, begin: 94.0, index: 306 },
    { text: "ma", duration: 0.28, begin: 94.25, index: 307 },
    { text: " hiç", duration: 0.28, begin: 94.5, index: 308 },
    { text: " bir", duration: 0.28, begin: 94.75, index: 309 },
    { text: " so", duration: 0.28, begin: 95.0, index: 310 },
    { text: "nuç", duration: 0.28, begin: 95.25, index: 311 },
    { text: " yok", duration: 0.28, begin: 95.5, index: 312 },
    { text: "tur.", duration: 0.28, begin: 95.75, index: 313 },
    { text: " Ba", duration: 0.28, begin: 97.2, index: 314 },
    { text: "şı", duration: 0.28, begin: 97.4, index: 315 },
    { text: "nı", duration: 0.28, begin: 97.6, index: 316 },
    { text: " gök", duration: 0.28, begin: 97.8, index: 317 },
    { text: "yü", duration: 0.28, begin: 98.0, index: 318 },
    { text: "zü", duration: 0.28, begin: 98.2, index: 319 },
    { text: "ne", duration: 0.28, begin: 98.4, index: 320 },
    { text: " doğ", duration: 0.28, begin: 98.6, index: 321 },
    { text: "ru", duration: 0.28, begin: 98.8, index: 322 },
    { text: " çe", duration: 0.28, begin: 99.0, index: 323 },
    { text: "vi", duration: 0.28, begin: 99.2, index: 324 },
    { text: "rir:", duration: 0.28, begin: 99.4, index: 325 },
    { text: ' "Tan', duration: 0.28, begin: 100.75, index: 326 },
    { text: "rım,", duration: 0.28, begin: 101.0, index: 327 },
    { text: " lüt", duration: 0.28, begin: 102.0, index: 328 },
    { text: "fen", duration: 0.28, begin: 102.25, index: 329 },
    { text: " kü", duration: 0.28, begin: 102.5, index: 330 },
    { text: "çük", duration: 0.28, begin: 102.75, index: 331 },
    { text: " kı", duration: 0.28, begin: 103.0, index: 332 },
    { text: "zı", duration: 0.28, begin: 103.25, index: 333 },
    { text: "ma", duration: 0.28, begin: 103.5, index: 334 },
    { text: " u", duration: 0.28, begin: 103.75, index: 335 },
    { text: "laş", duration: 0.28, begin: 104.0, index: 336 },
    { text: "mam", duration: 0.28, begin: 104.25, index: 337 },
    { text: " i", duration: 0.28, begin: 104.5, index: 338 },
    { text: "çin", duration: 0.28, begin: 104.75, index: 339 },
    { text: " ba", duration: 0.28, begin: 105.25, index: 340 },
    { text: "na", duration: 0.28, begin: 105.5, index: 341 },
    { text: " yar", duration: 0.28, begin: 105.75, index: 342 },
    { text: "dım", duration: 0.28, begin: 106.0, index: 343 },
    { text: ' et"', duration: 0.28, begin: 106.25, index: 344 },
    { text: " Bu", duration: 0.28, begin: 107.5, index: 345 },
    { text: " a", duration: 0.28, begin: 107.75, index: 346 },
    { text: "ra", duration: 0.28, begin: 108.0, index: 347 },
    { text: "da", duration: 0.28, begin: 108.25, index: 348 },
    { text: " ça", duration: 0.28, begin: 109.0, index: 349 },
    { text: "kıy", duration: 0.28, begin: 109.25, index: 350 },
    { text: "la", duration: 0.28, begin: 109.5, index: 351 },
    { text: " ka", duration: 0.28, begin: 109.75, index: 352 },
    { text: "pı", duration: 0.28, begin: 110.0, index: 353 },
    { text: "yı", duration: 0.28, begin: 110.25, index: 354 },
    { text: " kur", duration: 0.28, begin: 110.4, index: 355 },
    { text: "ca", duration: 0.28, begin: 110.6, index: 356 },
    { text: "la", duration: 0.28, begin: 110.8, index: 357 },
    { text: "ma", duration: 0.28, begin: 111.0, index: 358 },
    { text: "ya", duration: 0.28, begin: 111.2, index: 359 },
    { text: " de", duration: 0.28, begin: 111.4, index: 360 },
    { text: "vam", duration: 0.28, begin: 111.6, index: 361 },
    { text: " e", duration: 0.28, begin: 111.8, index: 362 },
    { text: "der.", duration: 0.28, begin: 112.0, index: 363 },
    { text: " O", duration: 0.28, begin: 113.2, index: 364 },
    { text: " sı", duration: 0.28, begin: 113.4, index: 365 },
    { text: "ra", duration: 0.28, begin: 113.6, index: 366 },
    { text: "da", duration: 0.28, begin: 113.8, index: 367 },
    { text: " yol", duration: 0.28, begin: 114.6, index: 368 },
    { text: "dan", duration: 0.28, begin: 114.8, index: 369 },
    { text: " geç", duration: 0.28, begin: 115.0, index: 370 },
    { text: "mek", duration: 0.28, begin: 115.25, index: 371 },
    { text: "te", duration: 0.28, begin: 115.5, index: 372 },
    { text: " o", duration: 0.28, begin: 115.75, index: 373 },
    { text: "lan", duration: 0.28, begin: 116.0, index: 374 },
    { text: " sa", duration: 0.28, begin: 117.0, index: 375 },
    { text: "kal", duration: 0.28, begin: 117.25, index: 376 },
    { text: "la", duration: 0.28, begin: 117.5, index: 377 },
    { text: "rı", duration: 0.28, begin: 117.75, index: 378 },
    { text: " u", duration: 0.28, begin: 118.0, index: 379 },
    { text: "za", duration: 0.28, begin: 118.25, index: 380 },
    { text: "mış,", duration: 0.28, begin: 118.5, index: 381 },
    { text: " üs", duration: 0.28, begin: 119.5, index: 382 },
    { text: "tü", duration: 0.28, begin: 119.75, index: 383 },
    { text: " ba", duration: 0.28, begin: 120.0, index: 384 },
    { text: "şı", duration: 0.28, begin: 120.25, index: 385 },
    { text: " ba", duration: 0.28, begin: 120.5, index: 386 },
    { text: "kım", duration: 0.28, begin: 120.75, index: 387 },
    { text: "sız", duration: 0.28, begin: 121.0, index: 388 },
    { text: " bir", duration: 0.28, begin: 121.2, index: 389 },
    { text: " a", duration: 0.28, begin: 121.4, index: 390 },
    { text: "dam", duration: 0.28, begin: 121.6, index: 391 },
    { text: " du", duration: 0.28, begin: 121.8, index: 392 },
    { text: "rup", duration: 0.28, begin: 122.0, index: 393 },
    { text: " ka", duration: 0.28, begin: 122.75, index: 394 },
    { text: "dı", duration: 0.28, begin: 123.0, index: 395 },
    { text: "nı", duration: 0.28, begin: 123.25, index: 396 },
    { text: " iz", duration: 0.28, begin: 123.5, index: 397 },
    { text: "ler", duration: 0.28, begin: 123.75, index: 398 },
    { text: " ve:", duration: 0.28, begin: 124.25, index: 399 },
    { text: ' "Ha', duration: 0.28, begin: 125.25, index: 400 },
    { text: "nım", duration: 0.28, begin: 125.5, index: 401 },
    { text: " e", duration: 0.28, begin: 125.75, index: 402 },
    { text: "fen", duration: 0.28, begin: 126.0, index: 403 },
    { text: "di,", duration: 0.28, begin: 126.25, index: 404 },
    { text: " is", duration: 0.28, begin: 127.0, index: 405 },
    { text: "ter", duration: 0.28, begin: 127.25, index: 406 },
    { text: "se", duration: 0.28, begin: 127.5, index: 407 },
    { text: "niz", duration: 0.28, begin: 127.75, index: 408 },
    { text: " yar", duration: 0.28, begin: 128.25, index: 409 },
    { text: "dım", duration: 0.28, begin: 128.5, index: 410 },
    { text: "cı", duration: 0.28, begin: 128.75, index: 411 },
    { text: " o", duration: 0.28, begin: 129.0, index: 412 },
    { text: "la", duration: 0.28, begin: 129.25, index: 413 },
    { text: "bi", duration: 0.28, begin: 129.5, index: 414 },
    { text: "li", duration: 0.28, begin: 129.75, index: 415 },
    { text: 'rim"', duration: 0.28, begin: 130.0, index: 416 },
    { text: " der.", duration: 0.28, begin: 130.25, index: 417 },
    { text: " Ka", duration: 0.28, begin: 131.5, index: 418 },
    { text: "dın:", duration: 0.28, begin: 131.75, index: 419 },
    { text: ' "Tan', duration: 0.28, begin: 132.5, index: 420 },
    { text: "rım", duration: 0.28, begin: 132.75, index: 421 },
    { text: " gön", duration: 0.28, begin: 133.5, index: 422 },
    { text: "der", duration: 0.28, begin: 133.75, index: 423 },
    { text: "di", duration: 0.28, begin: 134.0, index: 424 },
    { text: "ğin", duration: 0.28, begin: 134.25, index: 425 },
    { text: " yar", duration: 0.28, begin: 134.5, index: 426 },
    { text: "dım", duration: 0.28, begin: 134.75, index: 427 },
    { text: " bu", duration: 0.28, begin: 135.0, index: 428 },
    { text: ' mu?"', duration: 0.28, begin: 135.25, index: 429 },
    { text: " di", duration: 0.28, begin: 135.75, index: 430 },
    { text: "ye", duration: 0.28, begin: 136.0, index: 431 },
    { text: " dü", duration: 0.28, begin: 136.25, index: 432 },
    { text: "şü", duration: 0.28, begin: 136.5, index: 433 },
    { text: "nür.", duration: 0.28, begin: 136.75, index: 434 },
    { text: " Kı", duration: 0.28, begin: 137.75, index: 435 },
    { text: "lık", duration: 0.28, begin: 138.0, index: 436 },
    { text: "sız", duration: 0.28, begin: 138.25, index: 437 },
    { text: " a", duration: 0.28, begin: 138.5, index: 438 },
    { text: "dam", duration: 0.28, begin: 138.75, index: 439 },
    { text: " bir", duration: 0.28, begin: 139.5, index: 440 },
    { text: " kaç", duration: 0.28, begin: 139.75, index: 441 },
    { text: " da", duration: 0.28, begin: 140.0, index: 442 },
    { text: "ki", duration: 0.28, begin: 140.25, index: 443 },
    { text: "ka", duration: 0.28, begin: 140.5, index: 444 },
    { text: " i", duration: 0.28, begin: 140.75, index: 445 },
    { text: "çin", duration: 0.28, begin: 141.0, index: 446 },
    { text: "de", duration: 0.28, begin: 141.25, index: 447 },
    { text: " a", duration: 0.28, begin: 141.75, index: 448 },
    { text: "ra", duration: 0.28, begin: 142.0, index: 449 },
    { text: "ba", duration: 0.28, begin: 142.25, index: 450 },
    { text: "nın", duration: 0.28, begin: 142.5, index: 451 },
    { text: " ki", duration: 0.28, begin: 142.75, index: 452 },
    { text: "li", duration: 0.28, begin: 143.0, index: 453 },
    { text: "di", duration: 0.28, begin: 143.25, index: 454 },
    { text: "ni", duration: 0.28, begin: 143.5, index: 455 },
    { text: " aç", duration: 0.28, begin: 143.75, index: 456 },
    { text: "ma", duration: 0.28, begin: 144.0, index: 457 },
    { text: "yı", duration: 0.28, begin: 144.25, index: 458 },
    { text: " ba", duration: 0.28, begin: 144.5, index: 459 },
    { text: "şa", duration: 0.28, begin: 144.75, index: 460 },
    { text: "rır.", duration: 0.28, begin: 145.0, index: 461 },
    { text: " Ka", duration: 0.28, begin: 146.0, index: 462 },
    { text: "dın", duration: 0.28, begin: 146.25, index: 463 },
    { text: " şaş", duration: 0.28, begin: 146.75, index: 464 },
    { text: "kın", duration: 0.28, begin: 147.0, index: 465 },
    { text: "lık", duration: 0.28, begin: 147.25, index: 466 },
    { text: "la", duration: 0.28, begin: 147.5, index: 467 },
    { text: " a", duration: 0.28, begin: 148.25, index: 468 },
    { text: "da", duration: 0.28, begin: 148.5, index: 469 },
    { text: "ma", duration: 0.28, begin: 148.75, index: 470 },
    { text: " te", duration: 0.28, begin: 149.0, index: 471 },
    { text: "şek", duration: 0.28, begin: 149.25, index: 472 },
    { text: "kür", duration: 0.28, begin: 149.5, index: 473 },
    { text: " e", duration: 0.28, begin: 149.75, index: 474 },
    { text: "der,", duration: 0.28, begin: 150.0, index: 475 },
    { text: " kı", duration: 0.28, begin: 151.0, index: 476 },
    { text: "zı", duration: 0.28, begin: 151.25, index: 477 },
    { text: "nın", duration: 0.28, begin: 151.5, index: 478 },
    { text: " du", duration: 0.28, begin: 151.75, index: 479 },
    { text: "ru", duration: 0.28, begin: 152.0, index: 480 },
    { text: "mu", duration: 0.28, begin: 152.2, index: 481 },
    { text: "nu", duration: 0.28, begin: 152.4, index: 482 },
    { text: " an", duration: 0.28, begin: 152.6, index: 483 },
    { text: "la", duration: 0.28, begin: 152.8, index: 484 },
    { text: "tır.", duration: 0.28, begin: 153.0, index: 485 },
    { text: " He", duration: 0.28, begin: 154.0, index: 486 },
    { text: "men", duration: 0.28, begin: 154.25, index: 487 },
    { text: " ye", duration: 0.28, begin: 154.5, index: 488 },
    { text: "ti", duration: 0.28, begin: 154.7, index: 489 },
    { text: "şe", duration: 0.28, begin: 154.9, index: 490 },
    { text: "bi", duration: 0.28, begin: 155.1, index: 491 },
    { text: "le", duration: 0.28, begin: 155.3, index: 492 },
    { text: "ce", duration: 0.28, begin: 155.5, index: 493 },
    { text: "ği", duration: 0.28, begin: 155.7, index: 494 },
    { text: " i", duration: 0.28, begin: 155.9, index: 495 },
    { text: "çin", duration: 0.28, begin: 156.1, index: 496 },
    { text: " min", duration: 0.28, begin: 157.0, index: 497 },
    { text: "net", duration: 0.28, begin: 157.25, index: 498 },
    { text: "tar", duration: 0.28, begin: 157.5, index: 499 },
    { text: " ol", duration: 0.28, begin: 157.75, index: 500 },
    { text: "du", duration: 0.28, begin: 158.0, index: 501 },
    { text: "ğu", duration: 0.28, begin: 158.25, index: 502 },
    { text: "nu", duration: 0.28, begin: 158.5, index: 503 },
    { text: " be", duration: 0.28, begin: 158.75, index: 504 },
    { text: "lir", duration: 0.28, begin: 159.0, index: 505 },
    { text: "tir", duration: 0.28, begin: 159.25, index: 506 },
    { text: " ve", duration: 0.28, begin: 159.5, index: 507 },
    { text: " bir", duration: 0.28, begin: 160.5, index: 508 },
    { text: " mik", duration: 0.28, begin: 160.75, index: 509 },
    { text: "tar", duration: 0.28, begin: 161.0, index: 510 },
    { text: " pa", duration: 0.28, begin: 161.25, index: 511 },
    { text: "ra", duration: 0.28, begin: 161.5, index: 512 },
    { text: " u", duration: 0.28, begin: 161.75, index: 513 },
    { text: "za", duration: 0.28, begin: 162.0, index: 514 },
    { text: "tıp:", duration: 0.28, begin: 162.25, index: 515 },
    { text: ' "Çok', duration: 0.28, begin: 163.25, index: 516 },
    { text: " i", duration: 0.28, begin: 163.5, index: 517 },
    { text: "yi", duration: 0.28, begin: 163.75, index: 518 },
    { text: " bir", duration: 0.28, begin: 164.0, index: 519 },
    { text: " in", duration: 0.28, begin: 164.25, index: 520 },
    { text: "san", duration: 0.28, begin: 164.5, index: 521 },
    { text: "sı", duration: 0.28, begin: 164.75, index: 522 },
    { text: 'nız"', duration: 0.28, begin: 165.0, index: 523 },
    { text: " di", duration: 0.28, begin: 165.5, index: 524 },
    { text: "ye", duration: 0.28, begin: 165.75, index: 525 },
    { text: " te", duration: 0.28, begin: 166.0, index: 526 },
    { text: "şek", duration: 0.28, begin: 166.25, index: 527 },
    { text: "kür", duration: 0.28, begin: 166.5, index: 528 },
    { text: " e", duration: 0.28, begin: 166.75, index: 529 },
    { text: "der.", duration: 0.28, begin: 167.0, index: 530 },
    { text: " A", duration: 0.28, begin: 167.75, index: 531 },
    { text: "dam:", duration: 0.28, begin: 168.0, index: 532 },
    { text: ' "Ha', duration: 0.28, begin: 169.0, index: 533 },
    { text: "yır,", duration: 0.28, begin: 169.25, index: 534 },
    { text: " ha", duration: 0.28, begin: 170.2, index: 535 },
    { text: "nım", duration: 0.28, begin: 170.4, index: 536 },
    { text: " e", duration: 0.28, begin: 170.6, index: 537 },
    { text: "fen", duration: 0.28, begin: 170.8, index: 538 },
    { text: "di", duration: 0.28, begin: 171.0, index: 539 },
    { text: " ma", duration: 0.28, begin: 171.2, index: 540 },
    { text: "le", duration: 0.28, begin: 171.4, index: 541 },
    { text: "sef", duration: 0.28, begin: 171.6, index: 542 },
    { text: " i", duration: 0.28, begin: 172.0, index: 543 },
    { text: "yi", duration: 0.28, begin: 172.25, index: 544 },
    { text: " bir", duration: 0.28, begin: 172.5, index: 545 },
    { text: " in", duration: 0.28, begin: 172.75, index: 546 },
    { text: "san", duration: 0.28, begin: 173.0, index: 547 },
    { text: " de", duration: 0.28, begin: 173.25, index: 548 },
    { text: "ği", duration: 0.28, begin: 173.5, index: 549 },
    { text: "lim.", duration: 0.28, begin: 173.75, index: 550 },
    { text: " A", duration: 0.28, begin: 174.75, index: 551 },
    { text: "ra", duration: 0.28, begin: 175.0, index: 552 },
    { text: "ba", duration: 0.28, begin: 175.25, index: 553 },
    { text: " hır", duration: 0.28, begin: 175.5, index: 554 },
    { text: "sız", duration: 0.28, begin: 175.75, index: 555 },
    { text: "lı", duration: 0.28, begin: 176.0, index: 556 },
    { text: "ğın", duration: 0.28, begin: 176.25, index: 557 },
    { text: "dan", duration: 0.28, begin: 176.5, index: 558 },
    { text: " ha", duration: 0.28, begin: 177.25, index: 559 },
    { text: "pis", duration: 0.28, begin: 177.5, index: 560 },
    { text: " ha", duration: 0.28, begin: 177.75, index: 561 },
    { text: "ne", duration: 0.28, begin: 178.0, index: 562 },
    { text: "den", duration: 0.28, begin: 178.25, index: 563 },
    { text: " ye", duration: 0.28, begin: 178.5, index: 564 },
    { text: "ni", duration: 0.28, begin: 178.75, index: 565 },
    { text: " çık", duration: 0.28, begin: 179.0, index: 566 },
    { text: 'tım."', duration: 0.28, begin: 179.25, index: 567 },
    { text: " Ka", duration: 0.28, begin: 180.5, index: 568 },
    { text: "dın", duration: 0.28, begin: 180.75, index: 569 },
    { text: " bir", duration: 0.28, begin: 181.25, index: 570 },
    { text: " sü", duration: 0.28, begin: 181.5, index: 571 },
    { text: "re", duration: 0.28, begin: 181.75, index: 572 },
    { text: " ses", duration: 0.28, begin: 182.25, index: 573 },
    { text: "siz", duration: 0.28, begin: 182.5, index: 574 },
    { text: " ka", duration: 0.28, begin: 182.75, index: 575 },
    { text: "lır.", duration: 0.28, begin: 183.0, index: 576 },
    { text: " A", duration: 0.28, begin: 184.0, index: 577 },
    { text: "dam", duration: 0.28, begin: 184.25, index: 578 },
    { text: " u", duration: 0.28, begin: 184.5, index: 579 },
    { text: "zak", duration: 0.28, begin: 184.75, index: 580 },
    { text: "laş", duration: 0.28, begin: 185.0, index: 581 },
    { text: "tık", duration: 0.28, begin: 185.25, index: 582 },
    { text: "tan", duration: 0.28, begin: 185.5, index: 583 },
    { text: " son", duration: 0.28, begin: 185.75, index: 584 },
    { text: "ra", duration: 0.28, begin: 186.0, index: 585 },
    { text: " tek", duration: 0.28, begin: 187.0, index: 586 },
    { text: "rar", duration: 0.28, begin: 187.25, index: 587 },
    { text: " yü", duration: 0.28, begin: 187.5, index: 588 },
    { text: "zü", duration: 0.28, begin: 187.75, index: 589 },
    { text: "nü", duration: 0.28, begin: 188.0, index: 590 },
    { text: " gök", duration: 0.28, begin: 188.25, index: 591 },
    { text: "yü", duration: 0.28, begin: 188.5, index: 592 },
    { text: "zü", duration: 0.28, begin: 188.75, index: 593 },
    { text: "ne", duration: 0.28, begin: 189.0, index: 594 },
    { text: " çe", duration: 0.28, begin: 189.25, index: 595 },
    { text: "vi", duration: 0.28, begin: 189.5, index: 596 },
    { text: "rir,", duration: 0.28, begin: 189.75, index: 597 },
    { text: " ken", duration: 0.28, begin: 190.5, index: 598 },
    { text: "di", duration: 0.28, begin: 190.75, index: 599 },
    { text: "ni", duration: 0.28, begin: 191.0, index: 600 },
    { text: " tu", duration: 0.28, begin: 191.25, index: 601 },
    { text: "ta", duration: 0.28, begin: 191.5, index: 602 },
    { text: "maz,", duration: 0.28, begin: 191.75, index: 603 },
    { text: " ağ", duration: 0.28, begin: 192.5, index: 604 },
    { text: "la", duration: 0.28, begin: 192.75, index: 605 },
    { text: "ya", duration: 0.28, begin: 193.0, index: 606 },
    { text: "rak:", duration: 0.28, begin: 193.25, index: 607 },
    { text: ' "Tan', duration: 0.28, begin: 194.25, index: 608 },
    { text: "rım,", duration: 0.28, begin: 194.5, index: 609 },
    { text: " bir", duration: 0.28, begin: 195.25, index: 610 },
    { text: " pro", duration: 0.28, begin: 195.5, index: 611 },
    { text: "fes", duration: 0.28, begin: 195.75, index: 612 },
    { text: "yo", duration: 0.28, begin: 196.0, index: 613 },
    { text: "nel", duration: 0.28, begin: 196.25, index: 614 },
    { text: " gön", duration: 0.28, begin: 196.75, index: 615 },
    { text: "der", duration: 0.28, begin: 197.0, index: 616 },
    { text: "di", duration: 0.28, begin: 197.25, index: 617 },
    { text: "ğin", duration: 0.28, begin: 197.5, index: 618 },
    { text: " i", duration: 0.28, begin: 197.75, index: 619 },
    { text: "çin", duration: 0.28, begin: 198.0, index: 620 },
    { text: " çok", duration: 0.28, begin: 198.75, index: 621 },
    { text: " te", duration: 0.28, begin: 199.0, index: 622 },
    { text: "şek", duration: 0.28, begin: 199.25, index: 623 },
    { text: "kür", duration: 0.28, begin: 199.5, index: 624 },
    { text: " e", duration: 0.28, begin: 199.75, index: 625 },
    { text: "de", duration: 0.28, begin: 200.0, index: 626 },
    { text: 'rim"', duration: 0.28, begin: 200.25, index: 627 },
    { text: " der.", duration: 0.28, begin: 200.75, index: 628 },
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
                href="/dashboard/stories/on-yargi"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/hayallerinizden-vazgecmeyin"
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
            src="/3-5.mp3"
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
