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
    { text: "", duration: 0.154, begin: 0.3, index: 0 },

    // Title
    {
      text: "Gü",
      duration: 0.53,
      begin: 0.3,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "rül",
      duration: 0.53,
      begin: 0.5,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "tü",
      duration: 0.53,
      begin: 0.7,
      index: 3,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: "Yaş", duration: 0.53, begin: 2.25, index: 4 },
    { text: "lı", duration: 0.53, begin: 2.5, index: 5 },
    { text: " bir", duration: 0.53, begin: 2.75, index: 6 },
    { text: " a", duration: 0.53, begin: 3.0, index: 7 },
    { text: "dam", duration: 0.53, begin: 3.25, index: 8 },
    { text: " e", duration: 0.53, begin: 4.25, index: 9 },
    { text: "mek", duration: 0.53, begin: 4.5, index: 10 },
    { text: "li", duration: 0.53, begin: 4.75, index: 11 },
    { text: "ye", duration: 0.53, begin: 5.0, index: 12 },
    { text: " ay", duration: 0.53, begin: 5.25, index: 13 },
    { text: "rı", duration: 0.53, begin: 5.5, index: 14 },
    { text: "lır.", duration: 0.53, begin: 5.75, index: 15 },
    { text: " Sa", duration: 0.53, begin: 7.0, index: 16 },
    { text: "kin", duration: 0.53, begin: 7.25, index: 17 },
    { text: " bir", duration: 0.53, begin: 8.0, index: 18 },
    { text: " ha", duration: 0.53, begin: 8.25, index: 19 },
    { text: "yat", duration: 0.53, begin: 8.5, index: 20 },
    { text: " sür", duration: 0.53, begin: 9.0, index: 21 },
    { text: "mek", duration: 0.53, begin: 9.25, index: 22 },
    { text: " i", duration: 0.28, begin: 9.75, index: 23 },
    { text: "çin", duration: 0.28, begin: 10.0, index: 24 },
    { text: " ken", duration: 0.53, begin: 11.0, index: 25 },
    { text: "di", duration: 0.53, begin: 11.25, index: 26 },
    { text: "ne", duration: 0.53, begin: 11.5, index: 27 },
    { text: " bir", duration: 0.53, begin: 12.5, index: 28 },
    { text: " li", duration: 0.53, begin: 12.75, index: 29 },
    { text: "se", duration: 0.53, begin: 13.0, index: 30 },
    { text: "nin", duration: 0.53, begin: 13.25, index: 31 },
    { text: " ya", duration: 0.53, begin: 13.5, index: 32 },
    { text: "nın", duration: 0.53, begin: 13.75, index: 33 },
    { text: "da", duration: 0.53, begin: 14.0, index: 34 },
    { text: " kü", duration: 0.53, begin: 15.25, index: 35 },
    { text: "çük", duration: 0.53, begin: 15.5, index: 36 },
    { text: " bir", duration: 0.53, begin: 16.0, index: 37 },
    { text: " ev", duration: 0.53, begin: 16.25, index: 38 },
    { text: " a", duration: 0.53, begin: 16.5, index: 39 },
    { text: "lır.", duration: 0.53, begin: 16.75, index: 40 },
    { text: " E", duration: 0.53, begin: 18.5, index: 41 },
    { text: "mek", duration: 0.53, begin: 18.75, index: 42 },
    { text: "li", duration: 0.53, begin: 19.0, index: 43 },
    { text: "li", duration: 0.53, begin: 19.25, index: 44 },
    { text: "ği", duration: 0.53, begin: 19.5, index: 45 },
    { text: "nin", duration: 0.53, begin: 19.75, index: 46 },
    { text: " ilk", duration: 0.53, begin: 20.75, index: 47 },
    { text: " bir", duration: 0.53, begin: 21.25, index: 48 },
    { text: "kaç", duration: 0.53, begin: 21.5, index: 49 },
    { text: " haf", duration: 0.53, begin: 21.75, index: 50 },
    { text: "ta", duration: 0.53, begin: 22.0, index: 51 },
    { text: "sı", duration: 0.53, begin: 22.5, index: 52 },
    { text: "nı", duration: 0.53, begin: 22.75, index: 53 },
    { text: " hu", duration: 0.53, begin: 23.75, index: 54 },
    { text: "zur", duration: 0.53, begin: 24.0, index: 55 },
    { text: " i", duration: 0.53, begin: 24.5, index: 56 },
    { text: "çin", duration: 0.53, begin: 24.75, index: 57 },
    { text: "de", duration: 0.53, begin: 25.0, index: 58 },
    { text: " ge", duration: 0.53, begin: 25.25, index: 59 },
    { text: "çi", duration: 0.53, begin: 25.5, index: 60 },
    { text: "rir;", duration: 0.53, begin: 25.75, index: 61 },
    { text: " a", duration: 0.53, begin: 26.75, index: 62 },
    { text: "ma", duration: 0.53, begin: 27.0, index: 63 },
    { text: " son", duration: 0.53, begin: 27.25, index: 64 },
    { text: "ra", duration: 0.53, begin: 27.75, index: 65 },
    { text: " ders", duration: 0.53, begin: 28.75, index: 66 },
    { text: "yı", duration: 0.53, begin: 29.0, index: 67 },
    { text: "lı", duration: 0.53, begin: 29.25, index: 68 },
    { text: " baş", duration: 0.53, begin: 29.5, index: 69 },
    { text: "lar.", duration: 0.53, begin: 30.0, index: 70 },
    { text: " O", duration: 0.53, begin: 31.5, index: 71 },
    { text: "kul", duration: 0.53, begin: 31.75, index: 72 },
    { text: "la", duration: 0.53, begin: 32.0, index: 73 },
    { text: "rın", duration: 0.53, begin: 32.25, index: 74 },
    { text: " a", duration: 0.53, begin: 32.75, index: 75 },
    { text: "çıl", duration: 0.53, begin: 33.0, index: 76 },
    { text: "dı", duration: 0.53, begin: 33.25, index: 77 },
    { text: "ğı", duration: 0.53, begin: 33.5, index: 78 },
    { text: " ilk", duration: 0.53, begin: 33.75, index: 79 },
    { text: " gün", duration: 0.53, begin: 34.0, index: 80 },
    { text: " ders", duration: 0.53, begin: 35.25, index: 81 },
    { text: "ten", duration: 0.53, begin: 35.5, index: 82 },
    { text: " çı", duration: 0.53, begin: 36.0, index: 83 },
    { text: "kan", duration: 0.53, begin: 36.25, index: 84 },
    { text: " öğ", duration: 0.53, begin: 36.75, index: 85 },
    { text: "ren", duration: 0.53, begin: 37.0, index: 86 },
    { text: "ci", duration: 0.53, begin: 37.25, index: 87 },
    { text: "ler,", duration: 0.53, begin: 37.5, index: 88 },
    { text: " yol", duration: 0.53, begin: 39.0, index: 89 },
    { text: "la", duration: 0.53, begin: 39.25, index: 90 },
    { text: "rı", duration: 0.53, begin: 39.5, index: 91 },
    { text: "nın", duration: 0.53, begin: 39.75, index: 92 },
    { text: " ü", duration: 0.53, begin: 40.25, index: 93 },
    { text: "ze", duration: 0.53, begin: 40.5, index: 94 },
    { text: "rin", duration: 0.53, begin: 40.75, index: 95 },
    { text: "de", duration: 0.53, begin: 41.0, index: 96 },
    { text: "ki", duration: 0.53, begin: 41.25, index: 97 },
    { text: " her", duration: 0.53, begin: 42.25, index: 98 },
    { text: " çöp", duration: 0.53, begin: 42.5, index: 99 },
    { text: " bi", duration: 0.53, begin: 42.75, index: 100 },
    { text: "do", duration: 0.53, begin: 43.0, index: 101 },
    { text: "nu'", duration: 0.53, begin: 43.25, index: 102 },
    { text: "nu", duration: 0.53, begin: 43.5, index: 103 },
    { text: " tek", duration: 0.53, begin: 44.0, index: 104 },
    { text: "me", duration: 0.53, begin: 44.25, index: 105 },
    { text: "ler", duration: 0.53, begin: 44.5, index: 106 },
    { text: "ler,", duration: 0.53, begin: 44.75, index: 107 },
    { text: " ba", duration: 0.53, begin: 46.25, index: 108 },
    { text: "ğı", duration: 0.53, begin: 46.5, index: 109 },
    { text: "rıp", duration: 0.53, begin: 46.75, index: 110 },
    { text: " ça", duration: 0.53, begin: 47.0, index: 111 },
    { text: "ğı", duration: 0.53, begin: 47.25, index: 112 },
    { text: "ra", duration: 0.53, begin: 47.5, index: 113 },
    { text: "rak", duration: 0.53, begin: 48.0, index: 114 },
    { text: " ge", duration: 0.53, begin: 48.75, index: 115 },
    { text: "çer", duration: 0.53, begin: 49.0, index: 116 },
    { text: " gi", duration: 0.53, begin: 49.5, index: 117 },
    { text: "der", duration: 0.53, begin: 49.75, index: 118 },
    { text: "ler.", duration: 0.53, begin: 50.0, index: 119 },
    { text: " Bu", duration: 0.78, begin: 51.5, index: 120 },
    { text: " çe", duration: 0.78, begin: 51.75, index: 121 },
    { text: "kil", duration: 0.78, begin: 52.0, index: 122 },
    { text: "mez", duration: 0.78, begin: 52.25, index: 123 },
    { text: " gü", duration: 0.78, begin: 52.75, index: 124 },
    { text: "rül", duration: 0.78, begin: 53.0, index: 125 },
    { text: "tü", duration: 0.78, begin: 53.25, index: 126 },
    { text: " gün", duration: 0.78, begin: 54.5, index: 127 },
    { text: "ler", duration: 0.78, begin: 54.75, index: 128 },
    { text: " sü", duration: 0.78, begin: 55.0, index: 129 },
    { text: "rer", duration: 0.78, begin: 55.25, index: 130 },
    { text: " ve", duration: 0.78, begin: 55.5, index: 131 },
    { text: " yaş", duration: 0.53, begin: 57.0, index: 132 },
    { text: "lı", duration: 0.53, begin: 57.25, index: 133 },
    { text: " a", duration: 0.53, begin: 57.75, index: 134 },
    { text: "dam", duration: 0.53, begin: 58.0, index: 135 },
    { text: " bu", duration: 0.53, begin: 59.0, index: 136 },
    { text: "na", duration: 0.53, begin: 59.25, index: 137 },
    { text: " bir", duration: 0.53, begin: 59.5, index: 138 },
    { text: " son", duration: 0.53, begin: 59.75, index: 139 },
    { text: " ver", duration: 0.53, begin: 60.25, index: 140 },
    { text: "me", duration: 0.53, begin: 60.5, index: 141 },
    { text: "ye", duration: 0.53, begin: 60.75, index: 142 },
    { text: " ka", duration: 0.53, begin: 61.5, index: 143 },
    { text: "rar", duration: 0.53, begin: 61.75, index: 144 },
    { text: " ve", duration: 0.53, begin: 62.0, index: 145 },
    { text: "rir.", duration: 0.53, begin: 62.25, index: 146 },
    { text: " Er", duration: 0.53, begin: 64.0, index: 147 },
    { text: "te", duration: 0.53, begin: 64.25, index: 148 },
    { text: "si", duration: 0.53, begin: 64.5, index: 149 },
    { text: " gün", duration: 0.53, begin: 64.75, index: 150 },
    { text: " ço", duration: 0.53, begin: 66.0, index: 151 },
    { text: "cuk", duration: 0.53, begin: 66.25, index: 152 },
    { text: "lar", duration: 0.53, begin: 66.5, index: 153 },
    { text: " gü", duration: 0.53, begin: 67.25, index: 154 },
    { text: "rül", duration: 0.53, begin: 67.5, index: 155 },
    { text: "tüy", duration: 0.53, begin: 67.75, index: 156 },
    { text: "le", duration: 0.53, begin: 68.0, index: 157 },
    { text: " e", duration: 0.28, begin: 69.5, index: 158 },
    { text: "vi", duration: 0.28, begin: 69.75, index: 159 },
    { text: "ne", duration: 0.28, begin: 70.0, index: 160 },
    { text: " doğ", duration: 0.28, begin: 70.25, index: 161 },
    { text: "ru", duration: 0.28, begin: 70.5, index: 162 },
    { text: " yak", duration: 0.53, begin: 70.75, index: 163 },
    { text: "la", duration: 0.53, begin: 71.0, index: 164 },
    { text: "şır", duration: 0.53, begin: 71.25, index: 165 },
    { text: "ken", duration: 0.53, begin: 71.5, index: 166 },
    { text: " ka", duration: 0.53, begin: 73.0, index: 167 },
    { text: "pı", duration: 0.53, begin: 73.25, index: 168 },
    { text: "nın", duration: 0.53, begin: 73.5, index: 169 },
    { text: " ö", duration: 0.53, begin: 73.75, index: 170 },
    { text: "nü", duration: 0.53, begin: 74.0, index: 171 },
    { text: "ne", duration: 0.53, begin: 74.25, index: 172 },
    { text: " çı", duration: 0.53, begin: 74.5, index: 173 },
    { text: "kar", duration: 0.53, begin: 74.75, index: 174 },
    { text: " on", duration: 0.53, begin: 76.0, index: 175 },
    { text: "la", duration: 0.53, begin: 76.25, index: 176 },
    { text: "rı", duration: 0.53, begin: 76.5, index: 177 },
    { text: " dur", duration: 0.53, begin: 76.75, index: 178 },
    { text: "du", duration: 0.53, begin: 77.0, index: 179 },
    { text: "rur", duration: 0.53, begin: 77.25, index: 180 },
    { text: " ve:", duration: 0.53, begin: 77.5, index: 181 },
    { text: " Çok", duration: 0.53, begin: 78.75, index: 182 },
    { text: " tat", duration: 0.53, begin: 79.0, index: 183 },
    { text: "lı", duration: 0.53, begin: 79.25, index: 184 },
    { text: " ço", duration: 0.53, begin: 80.0, index: 185 },
    { text: "cuk", duration: 0.53, begin: 80.25, index: 186 },
    { text: "lar", duration: 0.53, begin: 80.5, index: 187 },
    { text: "sı", duration: 0.53, begin: 80.75, index: 188 },
    { text: "nız,", duration: 0.53, begin: 81.0, index: 189 },
    { text: " çok", duration: 0.53, begin: 82.25, index: 190 },
    { text: " ta", duration: 0.53, begin: 82.5, index: 191 },
    { text: " eğ", duration: 0.53, begin: 82.75, index: 192 },
    { text: "le", duration: 0.78, begin: 83.0, index: 193 },
    { text: "ni", duration: 0.78, begin: 83.25, index: 194 },
    { text: "yor", duration: 0.78, begin: 83.5, index: 195 },
    { text: "su", duration: 0.78, begin: 83.75, index: 196 },
    { text: "nuz.", duration: 0.78, begin: 84.0, index: 197 },
    { text: " Bu", duration: 0.53, begin: 85.5, index: 198 },
    { text: " ne", duration: 0.53, begin: 85.75, index: 199 },
    { text: "şe", duration: 0.53, begin: 86.0, index: 200 },
    { text: "ni", duration: 0.53, begin: 86.25, index: 201 },
    { text: "zi", duration: 0.53, begin: 86.5, index: 202 },
    { text: " sür", duration: 0.53, begin: 87.5, index: 203 },
    { text: "dür", duration: 0.53, begin: 87.75, index: 204 },
    { text: "me", duration: 0.53, begin: 88.0, index: 205 },
    { text: "ni", duration: 0.53, begin: 88.25, index: 206 },
    { text: "zi", duration: 0.53, begin: 88.5, index: 207 },
    { text: " is", duration: 0.53, begin: 88.75, index: 208 },
    { text: "ti", duration: 0.53, begin: 89.0, index: 209 },
    { text: "yo", duration: 0.53, begin: 89.25, index: 210 },
    { text: "rum", duration: 0.53, begin: 89.5, index: 211 },
    { text: " siz", duration: 0.53, begin: 90.0, index: 212 },
    { text: "den.", duration: 0.53, begin: 90.25, index: 213 },
    { text: " Ben", duration: 0.53, begin: 91.75, index: 214 },
    { text: "de", duration: 0.53, begin: 92.0, index: 215 },
    { text: " siz", duration: 0.53, begin: 93.25, index: 216 },
    { text: "le", duration: 0.53, begin: 93.5, index: 217 },
    { text: "rin", duration: 0.53, begin: 93.75, index: 218 },
    { text: " ya", duration: 0.53, begin: 94.0, index: 219 },
    { text: "şın", duration: 0.53, begin: 94.25, index: 220 },
    { text: "day", duration: 0.53, begin: 94.5, index: 221 },
    { text: "ken", duration: 0.53, begin: 94.75, index: 222 },
    { text: " ay", duration: 0.53, begin: 96.25, index: 223 },
    { text: "nı", duration: 0.53, begin: 96.5, index: 224 },
    { text: " şe", duration: 0.53, begin: 96.75, index: 225 },
    { text: "kil", duration: 0.53, begin: 97.0, index: 226 },
    { text: "de", duration: 0.53, begin: 97.25, index: 227 },
    { text: " gü", duration: 0.68, begin: 97.5, index: 228 },
    { text: "rül", duration: 0.68, begin: 97.75, index: 229 },
    { text: "tü", duration: 0.68, begin: 98.0, index: 230 },
    { text: "ler", duration: 0.68, begin: 98.25, index: 231 },
    { text: " çı", duration: 0.68, begin: 99.0, index: 232 },
    { text: "kar", duration: 0.68, begin: 99.25, index: 233 },
    { text: "mak", duration: 0.68, begin: 99.5, index: 234 },
    { text: "tan", duration: 0.68, begin: 99.75, index: 235 },
    { text: " hoş", duration: 0.53, begin: 101.0, index: 236 },
    { text: "la", duration: 0.53, begin: 101.25, index: 237 },
    { text: "nır", duration: 0.53, begin: 101.5, index: 238 },
    { text: "dım.", duration: 0.53, begin: 101.75, index: 239 },
    { text: " Ba", duration: 0.53, begin: 103.25, index: 240 },
    { text: "na", duration: 0.53, begin: 103.5, index: 241 },
    { text: " genç", duration: 0.53, begin: 103.75, index: 242 },
    { text: "li", duration: 0.53, begin: 104.0, index: 243 },
    { text: "ği", duration: 0.53, begin: 104.25, index: 244 },
    { text: "mi", duration: 0.53, begin: 104.5, index: 245 },
    { text: " ha", duration: 0.53, begin: 104.75, index: 246 },
    { text: "tır", duration: 0.53, begin: 105.0, index: 247 },
    { text: "la", duration: 0.53, begin: 105.25, index: 248 },
    { text: "tı", duration: 0.53, begin: 105.5, index: 249 },
    { text: "yor", duration: 0.53, begin: 106.0, index: 250 },
    { text: "su", duration: 0.53, begin: 106.25, index: 251 },
    { text: "nuz.", duration: 0.53, begin: 106.5, index: 252 },
    { text: " E", duration: 0.53, begin: 108.0, index: 253 },
    { text: "ğer", duration: 0.53, begin: 108.25, index: 254 },
    { text: " her", duration: 0.53, begin: 109.25, index: 255 },
    { text: "gün", duration: 0.53, begin: 109.5, index: 256 },
    { text: " bu", duration: 0.53, begin: 110.25, index: 257 },
    { text: "ra", duration: 0.53, begin: 110.5, index: 258 },
    { text: "dan", duration: 0.53, begin: 110.75, index: 259 },
    { text: " ge", duration: 0.53, begin: 111.0, index: 260 },
    { text: "çer", duration: 0.53, begin: 111.25, index: 261 },
    { text: " ve", duration: 0.53, begin: 112.0, index: 262 },
    { text: " gü", duration: 0.53, begin: 113.0, index: 263 },
    { text: "rül", duration: 0.53, begin: 113.25, index: 264 },
    { text: "tü", duration: 0.53, begin: 113.5, index: 265 },
    { text: " ya", duration: 0.53, begin: 113.75, index: 266 },
    { text: "par", duration: 0.53, begin: 114.0, index: 267 },
    { text: "sa", duration: 0.53, begin: 114.25, index: 268 },
    { text: "nız", duration: 0.53, begin: 114.5, index: 269 },
    { text: " si", duration: 0.53, begin: 116.0, index: 270 },
    { text: "ze", duration: 0.53, begin: 116.25, index: 271 },
    { text: " her", duration: 0.53, begin: 116.75, index: 272 },
    { text: "gün", duration: 0.53, begin: 117.0, index: 273 },
    { text: " on", duration: 0.53, begin: 118.25, index: 274 },
    { text: " li", duration: 0.53, begin: 118.5, index: 275 },
    { text: "ra", duration: 0.53, begin: 118.75, index: 276 },
    { text: " ve", duration: 0.53, begin: 119.0, index: 277 },
    { text: "re", duration: 0.53, begin: 119.25, index: 278 },
    { text: "ce", duration: 0.53, begin: 119.5, index: 279 },
    { text: "ğim", duration: 0.53, begin: 119.75, index: 280 },
    { text: " der.", duration: 0.53, begin: 120.5, index: 281 },
    { text: " Bu", duration: 0.53, begin: 122.0, index: 282 },
    { text: " tek", duration: 0.53, begin: 122.25, index: 283 },
    { text: "lif", duration: 0.53, begin: 122.5, index: 284 },
    { text: " ço", duration: 0.53, begin: 123.5, index: 285 },
    { text: "cuk", duration: 0.53, begin: 123.75, index: 286 },
    { text: "la", duration: 0.53, begin: 124.0, index: 287 },
    { text: "rın", duration: 0.53, begin: 124.25, index: 288 },
    { text: " çok", duration: 0.53, begin: 125.0, index: 289 },
    { text: " ho", duration: 0.53, begin: 125.25, index: 290 },
    { text: "şu", duration: 0.53, begin: 125.5, index: 291 },
    { text: "na", duration: 0.53, begin: 125.75, index: 292 },
    { text: " gi", duration: 0.53, begin: 126.0, index: 293 },
    { text: "der", duration: 0.53, begin: 126.25, index: 294 },
    { text: " ve", duration: 0.53, begin: 127.25, index: 295 },
    { text: " gü", duration: 0.53, begin: 128.0, index: 296 },
    { text: "rül", duration: 0.53, begin: 128.25, index: 297 },
    { text: "tü", duration: 0.53, begin: 128.5, index: 298 },
    { text: "yü", duration: 0.53, begin: 128.75, index: 299 },
    { text: " sür", duration: 0.53, begin: 129.0, index: 300 },
    { text: "dü", duration: 0.53, begin: 129.25, index: 301 },
    { text: "rür", duration: 0.53, begin: 129.5, index: 302 },
    { text: "ler.", duration: 0.53, begin: 130.0, index: 303 },
    { text: " Bir", duration: 0.53, begin: 131.75, index: 304 },
    { text: " kaç", duration: 0.53, begin: 132.0, index: 305 },
    { text: " gün", duration: 0.53, begin: 132.25, index: 306 },
    { text: " son", duration: 0.53, begin: 133.0, index: 307 },
    { text: "ra", duration: 0.53, begin: 133.25, index: 308 },
    { text: " yaş", duration: 0.53, begin: 134.5, index: 309 },
    { text: "lı", duration: 0.53, begin: 134.75, index: 310 },
    { text: " a", duration: 0.53, begin: 135.0, index: 311 },
    { text: "dam", duration: 0.53, begin: 135.25, index: 312 },
    { text: " ço", duration: 0.53, begin: 136.5, index: 313 },
    { text: "cuk", duration: 0.53, begin: 136.75, index: 314 },
    { text: "la", duration: 0.53, begin: 137.0, index: 315 },
    { text: "rın", duration: 0.53, begin: 137.25, index: 316 },
    { text: " ö", duration: 0.53, begin: 137.5, index: 317 },
    { text: "nü", duration: 0.53, begin: 137.75, index: 318 },
    { text: "ne", duration: 0.53, begin: 138.0, index: 319 },
    { text: " çı", duration: 0.53, begin: 138.25, index: 320 },
    { text: "kar", duration: 0.53, begin: 138.5, index: 321 },
    { text: " ve", duration: 0.53, begin: 139.25, index: 322 },
    { text: " şöy", duration: 0.53, begin: 140.25, index: 323 },
    { text: "le", duration: 0.53, begin: 140.5, index: 324 },
    { text: " der:", duration: 0.53, begin: 140.75, index: 325 },
    { text: " Ço", duration: 0.53, begin: 142.25, index: 326 },
    { text: "cuk", duration: 0.53, begin: 142.5, index: 327 },
    { text: "lar", duration: 0.53, begin: 142.75, index: 328 },
    { text: " en", duration: 0.53, begin: 144.0, index: 329 },
    { text: "flas", duration: 0.53, begin: 144.25, index: 330 },
    { text: "yon", duration: 0.53, begin: 144.5, index: 331 },
    { text: " be", duration: 0.53, begin: 145.25, index: 332 },
    { text: "ni", duration: 0.53, begin: 145.5, index: 333 },
    { text: "de", duration: 0.53, begin: 145.75, index: 334 },
    { text: " et", duration: 0.53, begin: 146.0, index: 335 },
    { text: "ki", duration: 0.53, begin: 146.25, index: 336 },
    { text: "le", duration: 0.53, begin: 146.5, index: 337 },
    { text: "me", duration: 0.53, begin: 146.75, index: 338 },
    { text: "ye", duration: 0.53, begin: 147.0, index: 339 },
    { text: " baş", duration: 0.53, begin: 147.25, index: 340 },
    { text: "la", duration: 0.53, begin: 147.5, index: 341 },
    { text: "dı.", duration: 0.53, begin: 147.75, index: 342 },
    { text: " Bun", duration: 0.53, begin: 149.25, index: 343 },
    { text: "dan", duration: 0.53, begin: 149.5, index: 344 },
    { text: " böy", duration: 0.53, begin: 150.0, index: 345 },
    { text: "le", duration: 0.53, begin: 150.25, index: 346 },
    { text: " si", duration: 0.53, begin: 151.25, index: 347 },
    { text: "ze", duration: 0.53, begin: 151.5, index: 348 },
    { text: " gün", duration: 0.53, begin: 152.0, index: 349 },
    { text: "de", duration: 0.53, begin: 152.25, index: 350 },
    { text: " beş", duration: 0.53, begin: 153.25, index: 351 },
    { text: "li", duration: 0.53, begin: 153.5, index: 352 },
    { text: "ra", duration: 0.53, begin: 153.75, index: 353 },
    { text: " ve", duration: 0.53, begin: 154.25, index: 354 },
    { text: "re", duration: 0.53, begin: 154.5, index: 355 },
    { text: "bi", duration: 0.53, begin: 154.75, index: 356 },
    { text: "li", duration: 0.53, begin: 155.0, index: 357 },
    { text: "rim.", duration: 0.53, begin: 155.25, index: 358 },
    { text: " Ço", duration: 0.53, begin: 156.75, index: 359 },
    { text: "cuk", duration: 0.53, begin: 157.0, index: 360 },
    { text: "lar", duration: 0.53, begin: 157.25, index: 361 },
    { text: " pek", duration: 0.53, begin: 157.75, index: 362 },
    { text: " hoş", duration: 0.53, begin: 158.25, index: 363 },
    { text: "lan", duration: 0.53, begin: 158.5, index: 364 },
    { text: "maz", duration: 0.53, begin: 158.75, index: 365 },
    { text: "lar", duration: 0.53, begin: 159.0, index: 366 },
    { text: " a", duration: 0.53, begin: 160.5, index: 367 },
    { text: "ma", duration: 0.53, begin: 160.75, index: 368 },
    { text: " yi", duration: 0.53, begin: 161.0, index: 369 },
    { text: "ne", duration: 0.53, begin: 161.25, index: 370 },
    { text: " de", duration: 0.53, begin: 161.5, index: 371 },
    { text: "vam", duration: 0.53, begin: 161.75, index: 372 },
    { text: " e", duration: 0.53, begin: 162.0, index: 373 },
    { text: "der", duration: 0.53, begin: 162.25, index: 374 },
    { text: "ler", duration: 0.53, begin: 162.5, index: 375 },
    { text: " gü", duration: 0.53, begin: 163.25, index: 376 },
    { text: "rül", duration: 0.53, begin: 163.5, index: 377 },
    { text: "tü", duration: 0.53, begin: 163.75, index: 378 },
    { text: "ye.", duration: 0.53, begin: 164.0, index: 379 },
    { text: " A", duration: 0.53, begin: 165.25, index: 380 },
    { text: "ra", duration: 0.53, begin: 165.5, index: 381 },
    { text: "dan", duration: 0.53, begin: 165.75, index: 382 },
    { text: " bir", duration: 0.53, begin: 167.0, index: 383 },
    { text: " kaç", duration: 0.53, begin: 167.25, index: 384 },
    { text: " gün", duration: 0.53, begin: 167.5, index: 385 },
    { text: " da", duration: 0.53, begin: 168.0, index: 386 },
    { text: "ha", duration: 0.53, begin: 168.25, index: 387 },
    { text: " ge", duration: 0.53, begin: 168.5, index: 388 },
    { text: "çer", duration: 0.53, begin: 169.0, index: 389 },
    { text: " ve", duration: 0.78, begin: 169.25, index: 390 },
    { text: " yaş", duration: 0.53, begin: 170.5, index: 391 },
    { text: "lı", duration: 0.53, begin: 170.75, index: 392 },
    { text: " a", duration: 0.53, begin: 171.0, index: 393 },
    { text: "dam", duration: 0.53, begin: 171.25, index: 394 },
    { text: " yi", duration: 0.53, begin: 172.25, index: 395 },
    { text: "ne", duration: 0.53, begin: 172.5, index: 396 },
    { text: " kar", duration: 0.53, begin: 172.75, index: 397 },
    { text: "şı", duration: 0.53, begin: 173.0, index: 398 },
    { text: "lar", duration: 0.53, begin: 173.25, index: 399 },
    { text: " on", duration: 0.53, begin: 173.5, index: 400 },
    { text: "la", duration: 0.53, begin: 173.75, index: 401 },
    { text: "rı:", duration: 0.53, begin: 174.0, index: 402 },
    { text: " Ba", duration: 0.53, begin: 175.5, index: 403 },
    { text: "kın", duration: 0.53, begin: 175.75, index: 404 },
    { text: " der.", duration: 0.53, begin: 176.75, index: 405 },
    { text: " He", duration: 0.78, begin: 177.5, index: 406 },
    { text: "nüz", duration: 0.78, begin: 177.75, index: 407 },
    { text: " ma", duration: 0.78, begin: 178.0, index: 408 },
    { text: "aşı", duration: 0.78, begin: 178.25, index: 409 },
    { text: "mı", duration: 0.78, begin: 178.5, index: 410 },
    { text: " a", duration: 0.78, begin: 178.75, index: 411 },
    { text: "la", duration: 0.78, begin: 179.0, index: 412 },
    { text: "ma", duration: 0.78, begin: 179.25, index: 413 },
    { text: "dım.", duration: 0.78, begin: 179.5, index: 414 },
    { text: " Bu", duration: 0.53, begin: 181.0, index: 415 },
    { text: " yüz", duration: 0.53, begin: 181.25, index: 416 },
    { text: "den", duration: 0.53, begin: 181.5, index: 417 },
    { text: " si", duration: 0.53, begin: 182.5, index: 418 },
    { text: "ze", duration: 0.53, begin: 182.75, index: 419 },
    { text: " gün", duration: 0.53, begin: 183.5, index: 420 },
    { text: "de", duration: 0.53, begin: 183.75, index: 421 },
    { text: " an", duration: 0.53, begin: 184.0, index: 422 },
    { text: "cak", duration: 0.53, begin: 184.25, index: 423 },
    { text: " bir", duration: 0.53, begin: 185.5, index: 424 },
    { text: " li", duration: 0.53, begin: 185.75, index: 425 },
    { text: "ra", duration: 0.53, begin: 186.0, index: 426 },
    { text: " ve", duration: 0.53, begin: 186.25, index: 427 },
    { text: "re", duration: 0.53, begin: 186.5, index: 428 },
    { text: "bi", duration: 0.53, begin: 186.75, index: 429 },
    { text: "li", duration: 0.53, begin: 187.0, index: 430 },
    { text: "rim", duration: 0.53, begin: 187.25, index: 431 },
    { text: " ta", duration: 0.53, begin: 188.0, index: 432 },
    { text: "mam", duration: 0.53, begin: 188.25, index: 433 },
    { text: " mı?", duration: 0.53, begin: 188.5, index: 434 },
    { text: " Ço", duration: 0.53, begin: 190.0, index: 435 },
    { text: "cuk", duration: 0.53, begin: 190.25, index: 436 },
    { text: "lar:", duration: 0.53, begin: 190.5, index: 437 },
    { text: " İm", duration: 0.53, begin: 192.0, index: 438 },
    { text: "kan", duration: 0.53, begin: 192.25, index: 439 },
    { text: "sız", duration: 0.53, begin: 192.5, index: 440 },
    { text: " am", duration: 0.53, begin: 192.75, index: 441 },
    { text: "ca", duration: 0.53, begin: 193.0, index: 442 },
    { text: " der", duration: 0.48, begin: 194.25, index: 443 },
    { text: "ler.", duration: 0.48, begin: 194.5, index: 444 },
    { text: " Gün", duration: 0.53, begin: 195.5, index: 445 },
    { text: "de", duration: 0.53, begin: 195.75, index: 446 },
    { text: " bir", duration: 0.53, begin: 196.0, index: 447 },
    { text: " li", duration: 0.53, begin: 196.25, index: 448 },
    { text: "ra", duration: 0.53, begin: 196.5, index: 449 },
    { text: " i", duration: 0.53, begin: 196.75, index: 450 },
    { text: "çin", duration: 0.53, begin: 197.0, index: 451 },
    { text: " bu", duration: 0.53, begin: 198.0, index: 452 },
    { text: " i", duration: 0.53, begin: 198.25, index: 453 },
    { text: "şi", duration: 0.53, begin: 198.5, index: 454 },
    { text: " ya", duration: 0.53, begin: 198.75, index: 455 },
    { text: "pa", duration: 0.53, begin: 199.0, index: 456 },
    { text: "ca", duration: 0.53, begin: 199.25, index: 457 },
    { text: "ğı", duration: 0.53, begin: 199.5, index: 458 },
    { text: "mı", duration: 0.53, begin: 199.75, index: 459 },
    { text: "zı", duration: 0.53, begin: 200.0, index: 460 },
    { text: " sa", duration: 0.53, begin: 200.25, index: 461 },
    { text: "nı", duration: 0.53, begin: 200.5, index: 462 },
    { text: "yor", duration: 0.53, begin: 200.75, index: 463 },
    { text: "sa", duration: 0.53, begin: 201.0, index: 464 },
    { text: "nız", duration: 0.53, begin: 201.25, index: 465 },
    { text: " ya", duration: 0.53, begin: 202.25, index: 466 },
    { text: "nı", duration: 0.53, begin: 202.5, index: 467 },
    { text: "lı", duration: 0.53, begin: 202.75, index: 468 },
    { text: "yor", duration: 0.53, begin: 203.0, index: 469 },
    { text: "su", duration: 0.53, begin: 203.25, index: 470 },
    { text: "nuz.", duration: 0.53, begin: 203.5, index: 471 },
    { text: " Biz", duration: 0.53, begin: 204.75, index: 472 },
    { text: " i", duration: 0.53, begin: 205.0, index: 473 },
    { text: "şi", duration: 0.53, begin: 205.25, index: 474 },
    { text: " bı", duration: 0.53, begin: 205.5, index: 475 },
    { text: "ra", duration: 0.53, begin: 205.75, index: 476 },
    { text: "kı", duration: 0.53, begin: 206.0, index: 477 },
    { text: "yo", duration: 0.53, begin: 206.25, index: 478 },
    { text: "ruz.", duration: 0.53, begin: 206.5, index: 479 },
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
                href="/dashboard/stories/bir-balikci-hikayesi"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/iyi-ornek-olmak"
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
            src="/1-3.mp3"
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
