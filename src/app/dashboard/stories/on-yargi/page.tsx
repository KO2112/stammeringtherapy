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
      text: "Ön",
      duration: 0.28,
      begin: 0.729,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Yar",
      duration: 0.38,
      begin: 1.218,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "gı",
      duration: 0.38,
      begin: 1.5,
      index: 3,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Genç", duration: 0.28, begin: 2.5, index: 4 },
    { text: " a", duration: 0.28, begin: 2.75, index: 5 },
    { text: "dam", duration: 0.28, begin: 3.0, index: 6 },
    { text: " e", duration: 0.28, begin: 3.5, index: 7 },
    { text: "vi", duration: 0.28, begin: 3.75, index: 8 },
    { text: "nin", duration: 0.28, begin: 4.0, index: 9 },
    { text: " alt", duration: 0.28, begin: 4.25, index: 10 },
    { text: " ka", duration: 0.28, begin: 4.5, index: 11 },
    { text: "tın", duration: 0.28, begin: 4.75, index: 12 },
    { text: "da", duration: 0.28, begin: 5.0, index: 13 },
    { text: " ma", duration: 0.28, begin: 5.25, index: 14 },
    { text: "ran", duration: 0.28, begin: 5.5, index: 15 },
    { text: "goz", duration: 0.28, begin: 5.75, index: 16 },
    { text: "luk", duration: 0.28, begin: 6.0, index: 17 },
    { text: " ya", duration: 0.28, begin: 6.25, index: 18 },
    { text: "pı", duration: 0.28, begin: 6.5, index: 19 },
    { text: "yor", duration: 0.28, begin: 6.75, index: 20 },
    { text: "du.", duration: 0.28, begin: 7.0, index: 21 },
    { text: " Ka", duration: 0.28, begin: 8.0, index: 22 },
    { text: "pı", duration: 0.28, begin: 8.25, index: 23 },
    { text: " ve", duration: 0.28, begin: 8.5, index: 24 },
    { text: " pen", duration: 0.28, begin: 8.75, index: 25 },
    { text: "ce", duration: 0.28, begin: 9.0, index: 26 },
    { text: "re", duration: 0.28, begin: 9.25, index: 27 },
    { text: " ko", duration: 0.28, begin: 9.5, index: 28 },
    { text: "nu", duration: 0.28, begin: 9.75, index: 29 },
    { text: "sun", duration: 0.28, begin: 10.0, index: 30 },
    { text: "da", duration: 0.28, begin: 10.25, index: 31 },
    { text: " uz", duration: 0.28, begin: 10.5, index: 32 },
    { text: "man", duration: 0.28, begin: 10.75, index: 33 },
    { text: "dı.", duration: 0.28, begin: 11.0, index: 34 },
    { text: " Fa", duration: 0.28, begin: 12.0, index: 35 },
    { text: "kat", duration: 0.28, begin: 12.25, index: 36 },
    { text: " plas", duration: 0.28, begin: 12.5, index: 37 },
    { text: "tik", duration: 0.28, begin: 12.75, index: 38 },
    { text: " pen", duration: 0.28, begin: 13.25, index: 39 },
    { text: "ce", duration: 0.28, begin: 13.5, index: 40 },
    { text: "re", duration: 0.28, begin: 13.75, index: 41 },
    { text: "ler", duration: 0.28, begin: 14.0, index: 42 },
    { text: " yay", duration: 0.28, begin: 14.5, index: 43 },
    { text: "gın", duration: 0.28, begin: 14.75, index: 44 },
    { text: "la", duration: 0.28, begin: 15.0, index: 45 },
    { text: "şın", duration: 0.28, begin: 15.25, index: 46 },
    { text: "ca", duration: 0.28, begin: 15.5, index: 47 },
    { text: " ah", duration: 0.28, begin: 16.5, index: 48 },
    { text: "şap", duration: 0.28, begin: 16.75, index: 49 },
    { text: " o", duration: 0.28, begin: 17.0, index: 50 },
    { text: "lan", duration: 0.28, begin: 17.25, index: 51 },
    { text: "la", duration: 0.28, begin: 17.5, index: 52 },
    { text: "ra", duration: 0.28, begin: 17.75, index: 53 },
    { text: " rağ", duration: 0.28, begin: 18.0, index: 54 },
    { text: "bet", duration: 0.28, begin: 18.25, index: 55 },
    { text: " a", duration: 0.28, begin: 18.5, index: 56 },
    { text: "zal", duration: 0.28, begin: 18.75, index: 57 },
    { text: "dı.", duration: 0.28, begin: 19.0, index: 58 },
    { text: " Bu", duration: 0.28, begin: 20.25, index: 59 },
    { text: " yüz", duration: 0.28, begin: 20.5, index: 60 },
    { text: "den", duration: 0.28, begin: 20.75, index: 61 },
    { text: " iş", duration: 0.28, begin: 21.0, index: 62 },
    { text: "ler", duration: 0.28, begin: 21.25, index: 63 },
    { text: " i", duration: 0.28, begin: 21.5, index: 64 },
    { text: "yi", duration: 0.28, begin: 21.75, index: 65 },
    { text: " git", duration: 0.28, begin: 22.0, index: 66 },
    { text: "mi", duration: 0.28, begin: 22.25, index: 67 },
    { text: "yor", duration: 0.28, begin: 22.5, index: 68 },
    { text: "du.", duration: 0.28, begin: 22.75, index: 69 },
    { text: " Üs", duration: 0.28, begin: 24.0, index: 70 },
    { text: "te", duration: 0.28, begin: 24.25, index: 71 },
    { text: "lik", duration: 0.28, begin: 24.5, index: 72 },
    { text: "de", duration: 0.28, begin: 24.75, index: 73 },
    { text: " ço", duration: 0.28, begin: 25.0, index: 74 },
    { text: "cuk", duration: 0.28, begin: 25.25, index: 75 },
    { text: "la", duration: 0.28, begin: 25.5, index: 76 },
    { text: "rı", duration: 0.28, begin: 25.75, index: 77 },
    { text: " bü", duration: 0.28, begin: 26.0, index: 78 },
    { text: "yü", duration: 0.28, begin: 26.25, index: 79 },
    { text: "müş,", duration: 0.28, begin: 26.5, index: 80 },
    { text: " bi", duration: 0.28, begin: 27.25, index: 81 },
    { text: "ri", duration: 0.28, begin: 27.5, index: 82 },
    { text: " ha", duration: 0.28, begin: 27.75, index: 83 },
    { text: "riç", duration: 0.28, begin: 28.0, index: 84 },
    { text: " o", duration: 0.28, begin: 28.25, index: 85 },
    { text: "ku", duration: 0.28, begin: 28.5, index: 86 },
    { text: "la", duration: 0.28, begin: 28.75, index: 87 },
    { text: " baş", duration: 0.28, begin: 29.0, index: 88 },
    { text: "la", duration: 0.28, begin: 29.25, index: 89 },
    { text: "mış", duration: 0.28, begin: 29.5, index: 90 },
    { text: "tı.", duration: 0.28, begin: 29.75, index: 91 },
    { text: " Mas", duration: 0.28, begin: 31.25, index: 92 },
    { text: "raf", duration: 0.28, begin: 31.5, index: 93 },
    { text: "la", duration: 0.28, begin: 31.75, index: 94 },
    { text: "rı", duration: 0.28, begin: 32.0, index: 95 },
    { text: " ar", duration: 0.28, begin: 32.25, index: 96 },
    { text: "tın", duration: 0.28, begin: 32.5, index: 97 },
    { text: "ca", duration: 0.28, begin: 32.75, index: 98 },
    { text: " ya", duration: 0.28, begin: 33.5, index: 99 },
    { text: "nın", duration: 0.28, begin: 33.75, index: 100 },
    { text: "da", duration: 0.28, begin: 34.0, index: 101 },
    { text: "ki", duration: 0.28, begin: 34.25, index: 102 },
    { text: " kal", duration: 0.28, begin: 34.5, index: 103 },
    { text: "fa", duration: 0.28, begin: 34.75, index: 104 },
    { text: "sı", duration: 0.28, begin: 35.0, index: 105 },
    { text: "na", duration: 0.28, begin: 35.25, index: 106 },
    { text: " yol", duration: 0.28, begin: 35.5, index: 107 },
    { text: " ver", duration: 0.28, begin: 35.75, index: 108 },
    { text: "di.", duration: 0.28, begin: 36.0, index: 109 },
    { text: " İ", duration: 0.28, begin: 37.25, index: 110 },
    { text: "şe", duration: 0.28, begin: 37.5, index: 111 },
    { text: " bi", duration: 0.28, begin: 37.75, index: 112 },
    { text: "raz", duration: 0.28, begin: 38.0, index: 113 },
    { text: " da", duration: 0.28, begin: 38.25, index: 114 },
    { text: "ha", duration: 0.28, begin: 38.5, index: 115 },
    { text: " er", duration: 0.28, begin: 38.75, index: 116 },
    { text: "ken", duration: 0.28, begin: 39.0, index: 117 },
    { text: " ko", duration: 0.28, begin: 39.25, index: 118 },
    { text: "yu", duration: 0.28, begin: 39.5, index: 119 },
    { text: "lur", duration: 0.28, begin: 39.75, index: 120 },
    { text: " yar", duration: 0.28, begin: 40.5, index: 121 },
    { text: "dım", duration: 0.28, begin: 40.75, index: 122 },
    { text: "cı", duration: 0.28, begin: 41.0, index: 123 },
    { text: "ya", duration: 0.28, begin: 41.25, index: 124 },
    { text: " a", duration: 0.28, begin: 41.5, index: 125 },
    { text: "yır", duration: 0.28, begin: 41.75, index: 126 },
    { text: "dı", duration: 0.28, begin: 42.0, index: 127 },
    { text: "ğı", duration: 0.28, begin: 42.25, index: 128 },
    { text: " pa", duration: 0.28, begin: 42.5, index: 129 },
    { text: "ra", duration: 0.28, begin: 42.75, index: 130 },
    { text: "yı", duration: 0.28, begin: 43.0, index: 131 },
    { text: " ço", duration: 0.28, begin: 43.75, index: 132 },
    { text: "cuk", duration: 0.28, begin: 44.0, index: 133 },
    { text: "la", duration: 0.28, begin: 44.25, index: 134 },
    { text: "rın", duration: 0.28, begin: 44.5, index: 135 },
    { text: " harç", duration: 0.28, begin: 45.0, index: 136 },
    { text: "lı", duration: 0.28, begin: 45.25, index: 137 },
    { text: "ğı", duration: 0.28, begin: 45.5, index: 138 },
    { text: "na", duration: 0.28, begin: 45.75, index: 139 },
    { text: " ka", duration: 0.28, begin: 46.0, index: 140 },
    { text: "tar", duration: 0.28, begin: 46.25, index: 141 },
    { text: "dı.", duration: 0.28, begin: 46.5, index: 142 },
    { text: " A", duration: 0.28, begin: 47.5, index: 143 },
    { text: "dam", duration: 0.28, begin: 47.75, index: 144 },
    { text: " bir", duration: 0.28, begin: 48.25, index: 145 },
    { text: " gün", duration: 0.28, begin: 48.5, index: 146 },
    { text: " ça", duration: 0.28, begin: 48.75, index: 147 },
    { text: "lı", duration: 0.28, begin: 49.0, index: 148 },
    { text: "şır", duration: 0.28, begin: 49.25, index: 149 },
    { text: "ken", duration: 0.28, begin: 49.5, index: 150 },
    { text: " e", duration: 0.28, begin: 50.0, index: 151 },
    { text: "lek", duration: 0.28, begin: 50.25, index: 152 },
    { text: "trik", duration: 0.28, begin: 50.5, index: 153 },
    { text: " ke", duration: 0.28, begin: 50.75, index: 154 },
    { text: "sil", duration: 0.28, begin: 51.0, index: 155 },
    { text: "di.", duration: 0.28, begin: 51.25, index: 156 },
    { text: " Ve", duration: 0.28, begin: 52.25, index: 157 },
    { text: " u", duration: 0.28, begin: 52.5, index: 158 },
    { text: "zun", duration: 0.28, begin: 52.75, index: 159 },
    { text: " sü", duration: 0.28, begin: 53.0, index: 160 },
    { text: "re", duration: 0.28, begin: 53.25, index: 161 },
    { text: " bek", duration: 0.28, begin: 53.5, index: 162 },
    { text: "le", duration: 0.28, begin: 53.75, index: 163 },
    { text: "di", duration: 0.28, begin: 54.0, index: 164 },
    { text: "ği", duration: 0.28, begin: 54.25, index: 165 },
    { text: " hal", duration: 0.28, begin: 54.5, index: 166 },
    { text: "de", duration: 0.28, begin: 54.75, index: 167 },
    { text: " gel", duration: 0.28, begin: 55.0, index: 168 },
    { text: "me", duration: 0.28, begin: 55.25, index: 169 },
    { text: "di.", duration: 0.28, begin: 55.5, index: 170 },
    { text: " Ak", duration: 0.28, begin: 56.75, index: 171 },
    { text: "si", duration: 0.28, begin: 57.0, index: 172 },
    { text: " gi", duration: 0.28, begin: 57.25, index: 173 },
    { text: "bi", duration: 0.28, begin: 57.5, index: 174 },
    { text: " o", duration: 0.28, begin: 57.75, index: 175 },
    { text: " ak", duration: 0.28, begin: 58.0, index: 176 },
    { text: "şam", duration: 0.28, begin: 58.25, index: 177 },
    { text: " ü", duration: 0.28, begin: 58.5, index: 178 },
    { text: "ze", duration: 0.28, begin: 58.75, index: 179 },
    { text: "ri", duration: 0.28, begin: 59.0, index: 180 },
    { text: " tes", duration: 0.28, begin: 59.5, index: 181 },
    { text: "lim", duration: 0.28, begin: 59.75, index: 182 },
    { text: " et", duration: 0.28, begin: 60.0, index: 183 },
    { text: "me", duration: 0.28, begin: 60.25, index: 184 },
    { text: "si", duration: 0.28, begin: 60.5, index: 185 },
    { text: " ge", duration: 0.28, begin: 61.0, index: 186 },
    { text: "re", duration: 0.28, begin: 61.25, index: 187 },
    { text: "ken", duration: 0.28, begin: 61.5, index: 188 },
    { text: " bir", duration: 0.28, begin: 61.75, index: 189 },
    { text: " kaç", duration: 0.28, begin: 62.0, index: 190 },
    { text: " pen", duration: 0.28, begin: 62.25, index: 191 },
    { text: "ce", duration: 0.28, begin: 62.5, index: 192 },
    { text: "re", duration: 0.28, begin: 62.75, index: 193 },
    { text: " var", duration: 0.28, begin: 63.0, index: 194 },
    { text: "dı.", duration: 0.28, begin: 63.25, index: 195 },
    { text: " Boş", duration: 0.28, begin: 64.75, index: 196 },
    { text: " kal", duration: 0.28, begin: 65.0, index: 197 },
    { text: "ma", duration: 0.28, begin: 65.25, index: 198 },
    { text: "yı", duration: 0.28, begin: 65.5, index: 199 },
    { text: " sev", duration: 0.28, begin: 65.75, index: 200 },
    { text: "mez", duration: 0.28, begin: 66.0, index: 201 },
    { text: "di.", duration: 0.28, begin: 66.25, index: 202 },
    { text: " Plan", duration: 0.28, begin: 67.5, index: 203 },
    { text: "ya", duration: 0.28, begin: 67.75, index: 204 },
    { text: "yı", duration: 0.28, begin: 68.0, index: 205 },
    { text: " yağ", duration: 0.28, begin: 68.25, index: 206 },
    { text: "la", duration: 0.28, begin: 68.5, index: 207 },
    { text: "dı", duration: 0.28, begin: 68.75, index: 208 },
    { text: " ta", duration: 0.28, begin: 69.75, index: 209 },
    { text: "laş", duration: 0.28, begin: 70.0, index: 210 },
    { text: "la", duration: 0.28, begin: 70.25, index: 211 },
    { text: "rı", duration: 0.28, begin: 70.5, index: 212 },
    { text: " sü", duration: 0.28, begin: 70.75, index: 213 },
    { text: "pür", duration: 0.28, begin: 71.0, index: 214 },
    { text: "dü.", duration: 0.28, begin: 71.25, index: 215 },
    { text: " Bi", duration: 0.28, begin: 72.25, index: 216 },
    { text: "raz", duration: 0.28, begin: 72.5, index: 217 },
    { text: " din", duration: 0.28, begin: 72.75, index: 218 },
    { text: "len", duration: 0.28, begin: 73.0, index: 219 },
    { text: "mek", duration: 0.28, begin: 73.25, index: 220 },
    { text: " i", duration: 0.28, begin: 73.75, index: 221 },
    { text: "çin", duration: 0.28, begin: 74.0, index: 222 },
    { text: " e", duration: 0.28, begin: 74.75, index: 223 },
    { text: "ve", duration: 0.28, begin: 75.0, index: 224 },
    { text: " çı", duration: 0.28, begin: 75.25, index: 225 },
    { text: "kar", duration: 0.28, begin: 75.5, index: 226 },
    { text: "ken", duration: 0.28, begin: 75.75, index: 227 },
    { text: " si", duration: 0.28, begin: 76.25, index: 228 },
    { text: "gor", duration: 0.28, begin: 76.5, index: 229 },
    { text: "ta", duration: 0.28, begin: 76.75, index: 230 },
    { text: "ya", duration: 0.28, begin: 77.0, index: 231 },
    { text: " göz", duration: 0.28, begin: 77.25, index: 232 },
    { text: " at", duration: 0.28, begin: 77.5, index: 233 },
    { text: "tı.", duration: 0.28, begin: 77.75, index: 234 },
    { text: " E", duration: 0.28, begin: 79.0, index: 235 },
    { text: "ğer", duration: 0.28, begin: 79.25, index: 236 },
    { text: " ya", duration: 0.28, begin: 79.5, index: 237 },
    { text: "nıl", duration: 0.28, begin: 79.75, index: 238 },
    { text: "mı", duration: 0.28, begin: 80.0, index: 239 },
    { text: "yor", duration: 0.28, begin: 80.25, index: 240 },
    { text: "sa", duration: 0.28, begin: 80.5, index: 241 },
    { text: " bu", duration: 0.28, begin: 80.75, index: 242 },
    { text: " iş", duration: 0.28, begin: 81.0, index: 243 },
    { text: " nor", duration: 0.28, begin: 81.25, index: 244 },
    { text: "mal", duration: 0.28, begin: 81.75, index: 245 },
    { text: " de", duration: 0.28, begin: 82.0, index: 246 },
    { text: "ğil", duration: 0.28, begin: 82.25, index: 247 },
    { text: "di.", duration: 0.28, begin: 82.5, index: 248 },
    { text: " Bi", duration: 0.28, begin: 83.75, index: 249 },
    { text: "ri", duration: 0.28, begin: 84.0, index: 250 },
    { text: " ge", duration: 0.28, begin: 84.25, index: 251 },
    { text: "lip", duration: 0.28, begin: 84.5, index: 252 },
    { text: " si", duration: 0.28, begin: 85.0, index: 253 },
    { text: "gor", duration: 0.28, begin: 85.25, index: 254 },
    { text: "ta", duration: 0.28, begin: 85.5, index: 255 },
    { text: "yı", duration: 0.28, begin: 85.75, index: 256 },
    { text: " ka", duration: 0.28, begin: 86.25, index: 257 },
    { text: "pat", duration: 0.28, begin: 86.5, index: 258 },
    { text: "mış", duration: 0.28, begin: 86.75, index: 259 },
    { text: " ol", duration: 0.28, begin: 87.0, index: 260 },
    { text: "ma", duration: 0.28, begin: 87.25, index: 261 },
    { text: "lıy", duration: 0.28, begin: 87.5, index: 262 },
    { text: "dı.", duration: 0.28, begin: 87.75, index: 263 },
    { text: " Şal", duration: 0.28, begin: 88.75, index: 264 },
    { text: "te", duration: 0.28, begin: 89.0, index: 265 },
    { text: "ri", duration: 0.28, begin: 89.25, index: 266 },
    { text: " kal", duration: 0.28, begin: 89.5, index: 267 },
    { text: "dı", duration: 0.28, begin: 89.75, index: 268 },
    { text: "rın", duration: 0.28, begin: 90.0, index: 269 },
    { text: "ca", duration: 0.28, begin: 90.25, index: 270 },
    { text: " a", duration: 0.28, begin: 90.75, index: 271 },
    { text: "töl", duration: 0.28, begin: 91.0, index: 272 },
    { text: "ye", duration: 0.28, begin: 91.25, index: 273 },
    { text: " ay", duration: 0.28, begin: 91.75, index: 274 },
    { text: "dın", duration: 0.28, begin: 92.0, index: 275 },
    { text: "lan", duration: 0.28, begin: 92.25, index: 276 },
    { text: "dı.", duration: 0.28, begin: 92.5, index: 277 },
    { text: " Tah", duration: 0.28, begin: 93.75, index: 278 },
    { text: "min", duration: 0.28, begin: 94.0, index: 279 },
    { text: "le", duration: 0.28, begin: 94.25, index: 280 },
    { text: "ri", duration: 0.28, begin: 94.5, index: 281 },
    { text: " doğ", duration: 0.28, begin: 94.75, index: 282 },
    { text: "ru", duration: 0.28, begin: 95.0, index: 283 },
    { text: " çık", duration: 0.28, begin: 95.25, index: 284 },
    { text: "mış", duration: 0.28, begin: 95.5, index: 285 },
    { text: "tı", duration: 0.28, begin: 95.75, index: 286 },
    { text: " a", duration: 0.28, begin: 96.75, index: 287 },
    { text: "ma", duration: 0.28, begin: 97.0, index: 288 },
    { text: " bu", duration: 0.28, begin: 97.25, index: 289 },
    { text: " i", duration: 0.28, begin: 97.5, index: 290 },
    { text: "şe", duration: 0.28, begin: 97.75, index: 291 },
    { text: " bir", duration: 0.28, begin: 98.0, index: 292 },
    { text: " an", duration: 0.28, begin: 98.25, index: 293 },
    { text: "lam", duration: 0.28, begin: 98.5, index: 294 },
    { text: " ve", duration: 0.28, begin: 99.0, index: 295 },
    { text: "re", duration: 0.28, begin: 99.25, index: 296 },
    { text: "mi", duration: 0.28, begin: 99.5, index: 297 },
    { text: "yor", duration: 0.28, begin: 99.75, index: 298 },
    { text: "du.", duration: 0.28, begin: 100.0, index: 299 },
    { text: " Şa", duration: 0.28, begin: 101.25, index: 300 },
    { text: "ka", duration: 0.28, begin: 101.5, index: 301 },
    { text: " de", duration: 0.28, begin: 101.75, index: 302 },
    { text: "se", duration: 0.28, begin: 102.0, index: 303 },
    { text: " böy", duration: 0.28, begin: 102.75, index: 304 },
    { text: "le", duration: 0.28, begin: 103.0, index: 305 },
    { text: " bir", duration: 0.28, begin: 103.25, index: 306 },
    { text: " şa", duration: 0.28, begin: 103.5, index: 307 },
    { text: "ka", duration: 0.28, begin: 103.75, index: 308 },
    { text: " ya", duration: 0.28, begin: 104.25, index: 309 },
    { text: "pıl", duration: 0.28, begin: 104.5, index: 310 },
    { text: "maz", duration: 0.28, begin: 104.75, index: 311 },
    { text: "dı.", duration: 0.28, begin: 105.0, index: 312 },
    { text: " Ken", duration: 0.28, begin: 106.25, index: 313 },
    { text: "di", duration: 0.28, begin: 106.5, index: 314 },
    { text: "si", duration: 0.28, begin: 106.75, index: 315 },
    { text: "ni", duration: 0.28, begin: 107.0, index: 316 },
    { text: " kıs", duration: 0.28, begin: 107.25, index: 317 },
    { text: "ka", duration: 0.28, begin: 107.5, index: 318 },
    { text: "na", duration: 0.28, begin: 107.75, index: 319 },
    { text: "cak", duration: 0.28, begin: 108.0, index: 320 },
    { text: " bir", duration: 0.28, begin: 108.25, index: 321 },
    { text: " düş", duration: 0.28, begin: 108.5, index: 322 },
    { text: "ma", duration: 0.28, begin: 108.75, index: 323 },
    { text: "nı", duration: 0.28, begin: 109.0, index: 324 },
    { text: "da", duration: 0.28, begin: 109.25, index: 325 },
    { text: " yok", duration: 0.28, begin: 109.5, index: 326 },
    { text: "tu.", duration: 0.28, begin: 109.75, index: 327 },
    { text: " İ", duration: 0.28, begin: 111.25, index: 328 },
    { text: "şe", duration: 0.28, begin: 111.5, index: 329 },
    { text: " ko", duration: 0.28, begin: 111.75, index: 330 },
    { text: "yul", duration: 0.28, begin: 112.0, index: 331 },
    { text: "du", duration: 0.28, begin: 112.25, index: 332 },
    { text: "ğun", duration: 0.28, begin: 112.5, index: 333 },
    { text: "da", duration: 0.28, begin: 112.75, index: 334 },
    { text: " yi", duration: 0.28, begin: 113.5, index: 335 },
    { text: "ne", duration: 0.28, begin: 113.75, index: 336 },
    { text: " ay", duration: 0.28, begin: 114.0, index: 337 },
    { text: "nı", duration: 0.28, begin: 114.25, index: 338 },
    { text: " şey", duration: 0.28, begin: 114.5, index: 339 },
    { text: " ol", duration: 0.28, begin: 114.75, index: 340 },
    { text: "du.", duration: 0.28, begin: 115.0, index: 341 },
    { text: " A", duration: 0.28, begin: 115.75, index: 342 },
    { text: "ma", duration: 0.28, begin: 116.0, index: 343 },
    { text: " bu", duration: 0.28, begin: 116.25, index: 344 },
    { text: " se", duration: 0.28, begin: 116.5, index: 345 },
    { text: "fer", duration: 0.28, begin: 116.75, index: 346 },
    { text: " suç", duration: 0.28, begin: 117.0, index: 347 },
    { text: "lu", duration: 0.28, begin: 117.25, index: 348 },
    { text: "yu", duration: 0.28, begin: 117.5, index: 349 },
    { text: " gör", duration: 0.28, begin: 117.75, index: 350 },
    { text: "müş", duration: 0.28, begin: 118.0, index: 351 },
    { text: "tü.", duration: 0.28, begin: 118.25, index: 352 },
    { text: " Oğ", duration: 0.28, begin: 119.5, index: 353 },
    { text: "lu", duration: 0.28, begin: 119.75, index: 354 },
    { text: " ev", duration: 0.28, begin: 120.25, index: 355 },
    { text: "den", duration: 0.28, begin: 120.5, index: 356 },
    { text: " a", duration: 0.28, begin: 121.0, index: 357 },
    { text: "töl", duration: 0.28, begin: 121.25, index: 358 },
    { text: "ye", duration: 0.28, begin: 121.5, index: 359 },
    { text: "ye", duration: 0.28, begin: 121.75, index: 360 },
    { text: " bağ", duration: 0.28, begin: 122.0, index: 361 },
    { text: "la", duration: 0.28, begin: 122.25, index: 362 },
    { text: "nan", duration: 0.28, begin: 122.5, index: 363 },
    { text: " mer", duration: 0.28, begin: 122.75, index: 364 },
    { text: "di", duration: 0.28, begin: 123.0, index: 365 },
    { text: "ve", duration: 0.28, begin: 123.25, index: 366 },
    { text: "ni", duration: 0.28, begin: 123.5, index: 367 },
    { text: " ses", duration: 0.28, begin: 124.5, index: 368 },
    { text: "siz", duration: 0.28, begin: 124.75, index: 369 },
    { text: "ce", duration: 0.28, begin: 125.0, index: 370 },
    { text: " in", duration: 0.28, begin: 125.25, index: 371 },
    { text: "miş", duration: 0.28, begin: 125.5, index: 372 },
    { text: " ve", duration: 0.28, begin: 126.0, index: 373 },
    { text: " si", duration: 0.28, begin: 127.0, index: 374 },
    { text: "gor", duration: 0.28, begin: 127.25, index: 375 },
    { text: "ta", duration: 0.28, begin: 127.5, index: 376 },
    { text: "yı", duration: 0.28, begin: 127.75, index: 377 },
    { text: " ka", duration: 0.28, begin: 128.0, index: 378 },
    { text: "pat", duration: 0.28, begin: 128.25, index: 379 },
    { text: "tı", duration: 0.28, begin: 128.5, index: 380 },
    { text: "ğı", duration: 0.28, begin: 128.75, index: 381 },
    { text: " sı", duration: 0.28, begin: 129.0, index: 382 },
    { text: "ra", duration: 0.28, begin: 129.25, index: 383 },
    { text: "da", duration: 0.28, begin: 129.5, index: 384 },
    { text: " ba", duration: 0.28, begin: 130.25, index: 385 },
    { text: "ba", duration: 0.28, begin: 130.5, index: 386 },
    { text: "sı", duration: 0.28, begin: 130.75, index: 387 },
    { text: "nı", duration: 0.28, begin: 131.0, index: 388 },
    { text: " kar", duration: 0.28, begin: 131.25, index: 389 },
    { text: "şı", duration: 0.28, begin: 131.5, index: 390 },
    { text: "sın", duration: 0.28, begin: 131.75, index: 391 },
    { text: "da", duration: 0.28, begin: 132.0, index: 392 },
    { text: " bul", duration: 0.28, begin: 132.25, index: 393 },
    { text: "muş", duration: 0.28, begin: 132.5, index: 394 },
    { text: "tu.", duration: 0.28, begin: 132.75, index: 395 },
    { text: " A", duration: 0.28, begin: 134.25, index: 396 },
    { text: "dam", duration: 0.28, begin: 134.5, index: 397 },
    { text: " on", duration: 0.28, begin: 134.75, index: 398 },
    { text: " ya", duration: 0.28, begin: 135.0, index: 399 },
    { text: "şı", duration: 0.28, begin: 135.25, index: 400 },
    { text: "na", duration: 0.28, begin: 135.5, index: 401 },
    { text: " gel", duration: 0.28, begin: 135.75, index: 402 },
    { text: "miş", duration: 0.28, begin: 136.0, index: 403 },
    { text: " bir", duration: 0.28, begin: 136.25, index: 404 },
    { text: " ço", duration: 0.28, begin: 136.5, index: 405 },
    { text: "cu", duration: 0.28, begin: 136.75, index: 406 },
    { text: "ğun", duration: 0.28, begin: 137.0, index: 407 },
    { text: " böy", duration: 0.28, begin: 138.0, index: 408 },
    { text: "le", duration: 0.28, begin: 138.25, index: 409 },
    { text: " bir", duration: 0.28, begin: 138.5, index: 410 },
    { text: " hay", duration: 0.28, begin: 138.75, index: 411 },
    { text: "laz", duration: 0.28, begin: 139.0, index: 412 },
    { text: "lı", duration: 0.28, begin: 139.25, index: 413 },
    { text: "ğı", duration: 0.28, begin: 139.5, index: 414 },
    { text: "nı", duration: 0.28, begin: 139.75, index: 415 },
    { text: " af", duration: 0.28, begin: 140.25, index: 416 },
    { text: "fe", duration: 0.28, begin: 140.5, index: 417 },
    { text: "de", duration: 0.28, begin: 140.75, index: 418 },
    { text: "mez", duration: 0.28, begin: 141.0, index: 419 },
    { text: "di.", duration: 0.28, begin: 141.25, index: 420 },
    { text: " Bü", duration: 0.28, begin: 142.5, index: 421 },
    { text: "tün", duration: 0.28, begin: 142.75, index: 422 },
    { text: " gü", duration: 0.28, begin: 143.0, index: 423 },
    { text: "nü", duration: 0.28, begin: 143.25, index: 424 },
    { text: " o", duration: 0.28, begin: 143.5, index: 425 },
    { text: "nun", duration: 0.28, begin: 143.75, index: 426 },
    { text: " yü", duration: 0.28, begin: 144.25, index: 427 },
    { text: "zün", duration: 0.28, begin: 144.5, index: 428 },
    { text: "den", duration: 0.28, begin: 144.75, index: 429 },
    { text: " mahv", duration: 0.28, begin: 145.0, index: 430 },
    { text: " ol", duration: 0.28, begin: 145.25, index: 431 },
    { text: "muş", duration: 0.28, begin: 145.5, index: 432 },
    { text: "tu.", duration: 0.28, begin: 145.75, index: 433 },
    { text: " Bir", duration: 0.28, begin: 147.25, index: 434 },
    { text: " ke", duration: 0.28, begin: 147.5, index: 435 },
    { text: "re", duration: 0.28, begin: 147.75, index: 436 },
    { text: " yap", duration: 0.28, begin: 148.0, index: 437 },
    { text: "mış", duration: 0.28, begin: 148.25, index: 438 },
    { text: " ol", duration: 0.28, begin: 148.5, index: 439 },
    { text: "sa", duration: 0.28, begin: 148.75, index: 440 },
    { text: " ses", duration: 0.28, begin: 149.25, index: 441 },
    { text: " çı", duration: 0.28, begin: 149.5, index: 442 },
    { text: "kart", duration: 0.28, begin: 149.75, index: 443 },
    { text: "maz", duration: 0.28, begin: 150.0, index: 444 },
    { text: "dı.", duration: 0.28, begin: 150.25, index: 445 },
    { text: " A", duration: 0.28, begin: 151.5, index: 446 },
    { text: "ma", duration: 0.28, begin: 151.75, index: 447 },
    { text: " tek", duration: 0.28, begin: 152.0, index: 448 },
    { text: "rar", duration: 0.28, begin: 152.25, index: 449 },
    { text: "la", duration: 0.28, begin: 152.5, index: 450 },
    { text: "ma", duration: 0.28, begin: 152.75, index: 451 },
    { text: "sı", duration: 0.28, begin: 153.0, index: 452 },
    { text: " han", duration: 0.28, begin: 154.0, index: 453 },
    { text: "gi", duration: 0.28, begin: 154.25, index: 454 },
    { text: " yön", duration: 0.28, begin: 154.5, index: 455 },
    { text: "den", duration: 0.28, begin: 154.75, index: 456 },
    { text: " ba", duration: 0.28, begin: 155.25, index: 457 },
    { text: "kı", duration: 0.28, begin: 155.5, index: 458 },
    { text: "lır", duration: 0.28, begin: 155.75, index: 459 },
    { text: "sa", duration: 0.28, begin: 156.0, index: 460 },
    { text: " ba", duration: 0.28, begin: 156.25, index: 461 },
    { text: "kıl", duration: 0.28, begin: 156.5, index: 462 },
    { text: "sın", duration: 0.28, begin: 156.75, index: 463 },
    { text: " bü", duration: 0.28, begin: 157.5, index: 464 },
    { text: "yük", duration: 0.28, begin: 157.75, index: 465 },
    { text: " ha", duration: 0.28, begin: 158.0, index: 466 },
    { text: "tay", duration: 0.28, begin: 158.25, index: 467 },
    { text: "dı.", duration: 0.28, begin: 158.5, index: 468 },
    { text: " Saç", duration: 0.28, begin: 159.75, index: 469 },
    { text: "la", duration: 0.28, begin: 160.0, index: 470 },
    { text: "rın", duration: 0.28, begin: 160.25, index: 471 },
    { text: "dan", duration: 0.28, begin: 160.5, index: 472 },
    { text: " ya", duration: 0.28, begin: 160.75, index: 473 },
    { text: "ka", duration: 0.28, begin: 161.0, index: 474 },
    { text: "la", duration: 0.28, begin: 161.25, index: 475 },
    { text: "yıp", duration: 0.28, begin: 161.5, index: 476 },
    { text: " sı", duration: 0.28, begin: 162.25, index: 477 },
    { text: "kı", duration: 0.28, begin: 162.5, index: 478 },
    { text: " bir", duration: 0.28, begin: 162.75, index: 479 },
    { text: " to", duration: 0.28, begin: 163.25, index: 480 },
    { text: "kat", duration: 0.28, begin: 163.5, index: 481 },
    { text: " at", duration: 0.28, begin: 163.75, index: 482 },
    { text: "tı.", duration: 0.28, begin: 164.0, index: 483 },
    { text: " Her", duration: 0.28, begin: 165.25, index: 484 },
    { text: " şey", duration: 0.28, begin: 165.5, index: 485 },
    { text: " o", duration: 0.28, begin: 166.0, index: 486 },
    { text: "nun", duration: 0.28, begin: 166.25, index: 487 },
    { text: " i", duration: 0.28, begin: 166.5, index: 488 },
    { text: "yi", duration: 0.28, begin: 166.75, index: 489 },
    { text: "li", duration: 0.28, begin: 167.0, index: 490 },
    { text: "ği", duration: 0.28, begin: 167.25, index: 491 },
    { text: " i", duration: 0.28, begin: 167.5, index: 492 },
    { text: "çin", duration: 0.28, begin: 167.75, index: 493 },
    { text: " di.", duration: 0.28, begin: 168.0, index: 494 },
    { text: " Bel", duration: 0.28, begin: 169.0, index: 495 },
    { text: "ki", duration: 0.28, begin: 169.25, index: 496 },
    { text: " vur", duration: 0.28, begin: 169.5, index: 497 },
    { text: "du", duration: 0.28, begin: 169.75, index: 498 },
    { text: "ğu", duration: 0.28, begin: 170.0, index: 499 },
    { text: " to", duration: 0.28, begin: 170.25, index: 500 },
    { text: "kat", duration: 0.28, begin: 170.5, index: 501 },
    { text: " ser", duration: 0.28, begin: 171.5, index: 502 },
    { text: "seri", duration: 0.28, begin: 171.75, index: 503 },
    { text: " ol", duration: 0.28, begin: 172.0, index: 504 },
    { text: "ma", duration: 0.28, begin: 172.25, index: 505 },
    { text: "sı", duration: 0.28, begin: 172.5, index: 506 },
    { text: "nı", duration: 0.28, begin: 172.75, index: 507 },
    { text: " en", duration: 0.28, begin: 173.25, index: 508 },
    { text: "gel", duration: 0.28, begin: 173.5, index: 509 },
    { text: "ler", duration: 0.28, begin: 173.75, index: 510 },
    { text: "di.", duration: 0.28, begin: 174.0, index: 511 },
    { text: " A", duration: 0.28, begin: 175.75, index: 512 },
    { text: "dam", duration: 0.28, begin: 176.0, index: 513 },
    { text: " oğ", duration: 0.28, begin: 176.25, index: 514 },
    { text: "lu", duration: 0.28, begin: 176.5, index: 515 },
    { text: "nun", duration: 0.28, begin: 176.75, index: 516 },
    { text: " göz", duration: 0.28, begin: 177.0, index: 517 },
    { text: " yaş", duration: 0.38, begin: 177.25, index: 518 },
    { text: "la", duration: 0.38, begin: 177.5, index: 519 },
    { text: "rı", duration: 0.38, begin: 177.75, index: 520 },
    { text: "nı", duration: 0.38, begin: 178.0, index: 521 },
    { text: " gör", duration: 0.38, begin: 178.25, index: 522 },
    { text: "mez", duration: 0.38, begin: 178.5, index: 523 },
    { text: "den", duration: 0.38, begin: 178.75, index: 524 },
    { text: " gel", duration: 0.38, begin: 179.0, index: 525 },
    { text: "di", duration: 0.38, begin: 179.25, index: 526 },
    { text: " ve", duration: 0.38, begin: 180.0, index: 527 },
    { text: " e", duration: 0.28, begin: 180.75, index: 528 },
    { text: "ve", duration: 0.28, begin: 181.0, index: 529 },
    { text: " çık", duration: 0.28, begin: 181.5, index: 530 },
    { text: "tık", duration: 0.28, begin: 181.75, index: 531 },
    { text: "tan", duration: 0.28, begin: 182.0, index: 532 },
    { text: " son", duration: 0.28, begin: 182.5, index: 533 },
    { text: "ra", duration: 0.28, begin: 182.75, index: 534 },
    { text: " e", duration: 0.28, begin: 183.75, index: 535 },
    { text: "şi", duration: 0.28, begin: 184.0, index: 536 },
    { text: " ne", duration: 0.28, begin: 184.25, index: 537 },
    { text: " dert", duration: 0.28, begin: 184.5, index: 538 },
    { text: " ya", duration: 0.28, begin: 184.75, index: 539 },
    { text: "na", duration: 0.28, begin: 185.0, index: 540 },
    { text: "rak:", duration: 0.28, begin: 185.25, index: 541 },
    { text: ' "Bu', duration: 0.28, begin: 186.5, index: 542 },
    { text: " ço", duration: 0.28, begin: 186.75, index: 543 },
    { text: "cu", duration: 0.28, begin: 187.0, index: 544 },
    { text: "ğun", duration: 0.28, begin: 187.25, index: 545 },
    { text: " o", duration: 0.28, begin: 187.5, index: 546 },
    { text: "kul", duration: 0.28, begin: 187.75, index: 547 },
    { text: "da", duration: 0.28, begin: 188.0, index: 548 },
    { text: " kim", duration: 0.28, begin: 188.25, index: 549 },
    { text: "ler", duration: 0.28, begin: 188.5, index: 550 },
    { text: "le", duration: 0.28, begin: 188.75, index: 551 },
    { text: " dü", duration: 0.28, begin: 189.25, index: 552 },
    { text: "şüp", duration: 0.28, begin: 189.5, index: 553 },
    { text: " kalk", duration: 0.28, begin: 190.0, index: 554 },
    { text: "tı", duration: 0.28, begin: 190.25, index: 555 },
    { text: "ğı", duration: 0.28, begin: 190.5, index: 556 },
    { text: "nı", duration: 0.28, begin: 190.75, index: 557 },
    { text: " bil", duration: 0.28, begin: 191.5, index: 558 },
    { text: "me", duration: 0.28, begin: 191.75, index: 559 },
    { text: "miz", duration: 0.28, begin: 192.0, index: 560 },
    { text: " la", duration: 0.28, begin: 192.25, index: 561 },
    { text: 'zım!"', duration: 0.28, begin: 192.5, index: 562 },
    { text: " de", duration: 0.28, begin: 193.0, index: 563 },
    { text: "di.", duration: 0.28, begin: 193.25, index: 564 },
    { text: ' "E', duration: 0.28, begin: 194.25, index: 565 },
    { text: "ğer", duration: 0.28, begin: 194.5, index: 566 },
    { text: " ser", duration: 0.28, begin: 194.75, index: 567 },
    { text: "best", duration: 0.28, begin: 195.0, index: 568 },
    { text: " bı", duration: 0.28, begin: 195.5, index: 569 },
    { text: "ra", duration: 0.28, begin: 195.75, index: 570 },
    { text: "kır", duration: 0.28, begin: 196.0, index: 571 },
    { text: "sak", duration: 0.28, begin: 196.25, index: 572 },
    { text: " ba", duration: 0.28, begin: 197.25, index: 573 },
    { text: "şı", duration: 0.28, begin: 197.5, index: 574 },
    { text: "mı", duration: 0.28, begin: 197.75, index: 575 },
    { text: "za", duration: 0.28, begin: 198.0, index: 576 },
    { text: " bü", duration: 0.28, begin: 198.25, index: 577 },
    { text: "yük", duration: 0.28, begin: 198.5, index: 578 },
    { text: " dert", duration: 0.28, begin: 198.75, index: 579 },
    { text: "ler", duration: 0.28, begin: 199.0, index: 580 },
    { text: " a", duration: 0.28, begin: 199.5, index: 581 },
    { text: "ça", duration: 0.28, begin: 199.75, index: 582 },
    { text: 'cak!"', duration: 0.28, begin: 200.0, index: 583 },
    { text: " A", duration: 0.28, begin: 201.25, index: 584 },
    { text: "dam", duration: 0.28, begin: 201.5, index: 585 },
    { text: " bir", duration: 0.28, begin: 201.75, index: 586 },
    { text: " sü", duration: 0.28, begin: 202.0, index: 587 },
    { text: "re", duration: 0.28, begin: 202.25, index: 588 },
    { text: " dü", duration: 0.28, begin: 202.75, index: 589 },
    { text: "şün", duration: 0.28, begin: 203.0, index: 590 },
    { text: "dü.", duration: 0.28, begin: 203.25, index: 591 },
    { text: " So", duration: 0.28, begin: 204.25, index: 592 },
    { text: "nun", duration: 0.28, begin: 204.5, index: 593 },
    { text: "da", duration: 0.28, begin: 204.75, index: 594 },
    { text: " da", duration: 0.28, begin: 205.0, index: 595 },
    { text: " en", duration: 0.28, begin: 205.25, index: 596 },
    { text: " ko", duration: 0.28, begin: 205.5, index: 597 },
    { text: "lay", duration: 0.28, begin: 205.75, index: 598 },
    { text: " yo", duration: 0.28, begin: 206.0, index: 599 },
    { text: "lu", duration: 0.28, begin: 206.25, index: 600 },
    { text: " bul", duration: 0.28, begin: 206.5, index: 601 },
    { text: "du.", duration: 0.28, begin: 206.75, index: 602 },
    { text: " Oğ", duration: 0.28, begin: 208.0, index: 603 },
    { text: "lu", duration: 0.28, begin: 208.25, index: 604 },
    { text: "nun", duration: 0.28, begin: 208.5, index: 605 },
    { text: " hiç", duration: 0.28, begin: 209.25, index: 606 },
    { text: " ak", duration: 0.28, begin: 209.5, index: 607 },
    { text: "sat", duration: 0.28, begin: 209.75, index: 608 },
    { text: "ma", duration: 0.28, begin: 210.0, index: 609 },
    { text: "dan", duration: 0.28, begin: 210.25, index: 610 },
    { text: " tut", duration: 0.28, begin: 210.75, index: 611 },
    { text: "tu", duration: 0.28, begin: 211.0, index: 612 },
    { text: "ğu", duration: 0.28, begin: 211.25, index: 613 },
    { text: " gün", duration: 0.28, begin: 211.75, index: 614 },
    { text: "lü", duration: 0.28, begin: 212.0, index: 615 },
    { text: "ğün", duration: 0.28, begin: 212.25, index: 616 },
    { text: "de", duration: 0.28, begin: 212.5, index: 617 },
    { text: " ar", duration: 0.28, begin: 213.25, index: 618 },
    { text: "ka", duration: 0.28, begin: 213.5, index: 619 },
    { text: "daş", duration: 0.28, begin: 213.75, index: 620 },
    { text: "la", duration: 0.28, begin: 214.0, index: 621 },
    { text: "rı", duration: 0.28, begin: 214.25, index: 622 },
    { text: "na", duration: 0.28, begin: 214.5, index: 623 },
    { text: " a", duration: 0.28, begin: 214.75, index: 624 },
    { text: "it", duration: 0.28, begin: 215.0, index: 625 },
    { text: " ip", duration: 0.28, begin: 215.5, index: 626 },
    { text: "u", duration: 0.28, begin: 215.75, index: 627 },
    { text: "cu", duration: 0.28, begin: 216.0, index: 628 },
    { text: " ol", duration: 0.28, begin: 216.25, index: 629 },
    { text: "ma", duration: 0.28, begin: 216.5, index: 630 },
    { text: "lıy", duration: 0.28, begin: 216.75, index: 631 },
    { text: "dı.", duration: 0.28, begin: 217.0, index: 632 },
    { text: " E", duration: 0.28, begin: 218.25, index: 633 },
    { text: "şi", duration: 0.28, begin: 218.5, index: 634 },
    { text: " is", duration: 0.28, begin: 218.75, index: 635 },
    { text: "te", duration: 0.28, begin: 219.0, index: 636 },
    { text: "me", duration: 0.28, begin: 219.25, index: 637 },
    { text: "se", duration: 0.28, begin: 219.5, index: 638 },
    { text: "de", duration: 0.28, begin: 219.75, index: 639 },
    { text: " o", duration: 0.28, begin: 220.25, index: 640 },
    { text: "na", duration: 0.28, begin: 220.5, index: 641 },
    { text: " ku", duration: 0.28, begin: 220.75, index: 642 },
    { text: "lak", duration: 0.28, begin: 221.0, index: 643 },
    { text: " as", duration: 0.28, begin: 221.25, index: 644 },
    { text: "ma", duration: 0.28, begin: 221.5, index: 645 },
    { text: "dı", duration: 0.28, begin: 221.75, index: 646 },
    { text: " ve", duration: 0.28, begin: 222.0, index: 647 },
    { text: " ço", duration: 0.28, begin: 223.0, index: 648 },
    { text: "cu", duration: 0.28, begin: 223.25, index: 649 },
    { text: "ğun", duration: 0.28, begin: 223.5, index: 650 },
    { text: " gün", duration: 0.28, begin: 223.75, index: 651 },
    { text: "lü", duration: 0.28, begin: 224.0, index: 652 },
    { text: "ğü", duration: 0.28, begin: 224.25, index: 653 },
    { text: "nü", duration: 0.28, begin: 224.5, index: 654 },
    { text: " o", duration: 0.28, begin: 224.75, index: 655 },
    { text: "ku", duration: 0.28, begin: 225.0, index: 656 },
    { text: "ma", duration: 0.28, begin: 225.25, index: 657 },
    { text: "ya", duration: 0.28, begin: 225.5, index: 658 },
    { text: " baş", duration: 0.28, begin: 225.75, index: 659 },
    { text: "la", duration: 0.28, begin: 226.0, index: 660 },
    { text: "dı.", duration: 0.28, begin: 226.25, index: 661 },
    { text: " Oğ", duration: 0.28, begin: 227.25, index: 662 },
    { text: "lu", duration: 0.38, begin: 227.5, index: 663 },
    { text: " en", duration: 0.38, begin: 228.25, index: 664 },
    { text: " son", duration: 0.38, begin: 228.5, index: 665 },
    { text: " say", duration: 0.38, begin: 228.75, index: 666 },
    { text: "fa", duration: 0.38, begin: 229.0, index: 667 },
    { text: "da", duration: 0.38, begin: 229.25, index: 668 },
    { text: " şöy", duration: 0.38, begin: 229.5, index: 669 },
    { text: "le", duration: 0.38, begin: 229.75, index: 670 },
    { text: " di", duration: 0.38, begin: 230.0, index: 671 },
    { text: "yor", duration: 0.38, begin: 230.25, index: 672 },
    { text: "du:", duration: 0.38, begin: 230.5, index: 673 },
    { text: ' "Bu', duration: 0.28, begin: 231.75, index: 674 },
    { text: " ge", duration: 0.28, begin: 232.0, index: 675 },
    { text: "ce", duration: 0.28, begin: 232.25, index: 676 },
    { text: " kö", duration: 0.28, begin: 232.5, index: 677 },
    { text: "tü", duration: 0.28, begin: 232.75, index: 678 },
    { text: " bir", duration: 0.28, begin: 233.0, index: 679 },
    { text: " rü", duration: 0.28, begin: 233.25, index: 680 },
    { text: "ya", duration: 0.28, begin: 233.5, index: 681 },
    { text: " gör", duration: 0.28, begin: 233.808, index: 682 },
    { text: "düm!", duration: 0.28, begin: 234.0, index: 683 },
    { text: " A", duration: 0.28, begin: 235.25, index: 684 },
    { text: "töl", duration: 0.28, begin: 235.5, index: 685 },
    { text: "ye", duration: 0.28, begin: 235.75, index: 686 },
    { text: "de", duration: 0.28, begin: 236.0, index: 687 },
    { text: " ça", duration: 0.28, begin: 236.25, index: 688 },
    { text: "lı", duration: 0.28, begin: 236.5, index: 689 },
    { text: "şır", duration: 0.28, begin: 236.75, index: 690 },
    { text: "ken", duration: 0.28, begin: 237.0, index: 691 },
    { text: " ba", duration: 0.28, begin: 238.0, index: 692 },
    { text: "ba", duration: 0.28, begin: 238.25, index: 693 },
    { text: "mı", duration: 0.28, begin: 238.5, index: 694 },
    { text: " e", duration: 0.28, begin: 238.75, index: 695 },
    { text: "lek", duration: 0.28, begin: 239.0, index: 696 },
    { text: "trik", duration: 0.28, begin: 239.25, index: 697 },
    { text: " çar", duration: 0.28, begin: 239.75, index: 698 },
    { text: "pı", duration: 0.28, begin: 240.0, index: 699 },
    { text: "yor", duration: 0.28, begin: 240.25, index: 700 },
    { text: "du.", duration: 0.28, begin: 240.5, index: 701 },
    { text: " Al", duration: 0.28, begin: 241.5, index: 702 },
    { text: "lah'", duration: 0.28, begin: 241.75, index: 703 },
    { text: "ım", duration: 0.28, begin: 242.0, index: 704 },
    { text: " o", duration: 0.28, begin: 242.5, index: 705 },
    { text: "nu", duration: 0.28, begin: 242.75, index: 706 },
    { text: " ko", duration: 0.28, begin: 243.0, index: 707 },
    { text: "ru!", duration: 0.28, begin: 243.25, index: 708 },
    { text: " Ben", duration: 0.28, begin: 244.25, index: 709 },
    { text: " e", duration: 0.28, begin: 244.5, index: 710 },
    { text: "lim", duration: 0.28, begin: 244.75, index: 711 },
    { text: "den", duration: 0.28, begin: 245.0, index: 712 },
    { text: " ge", duration: 0.28, begin: 245.25, index: 713 },
    { text: "le", duration: 0.28, begin: 245.5, index: 714 },
    { text: "ni", duration: 0.28, begin: 245.75, index: 715 },
    { text: " ya", duration: 0.28, begin: 246.0, index: 716 },
    { text: "pa", duration: 0.28, begin: 246.25, index: 717 },
    { text: "ca", duration: 0.28, begin: 246.5, index: 718 },
    { text: 'ğım!"', duration: 0.28, begin: 246.75, index: 719 },
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
                href="/dashboard/stories/kavak-agaci-ile-kabak"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/profesyonel-yardim"
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
            src="/3-4.mp3"
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
