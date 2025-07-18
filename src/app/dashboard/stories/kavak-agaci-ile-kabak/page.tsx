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
    // Initial speaking indicator

    // Title
    {
      text: "Ka",
      duration: 0.38,
      begin: 0.75,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "vak",
      duration: 0.38,
      begin: 0.9,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " A",
      duration: 0.38,
      begin: 1.1,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ğa",
      duration: 0.38,
      begin: 1.25,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "cı",
      duration: 0.38,
      begin: 1.55,
      index: 5,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " i",
      duration: 0.38,
      begin: 1.75,
      index: 6,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "le",
      duration: 0.38,
      begin: 2.0,
      index: 7,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Ka",
      duration: 0.38,
      begin: 2.25,
      index: 8,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "bak",
      duration: 0.38,
      begin: 2.5,
      index: 9,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " U", duration: 0.53, begin: 3.0, index: 10 },
    { text: "lu", duration: 0.53, begin: 3.25, index: 11 },
    { text: " bir", duration: 0.53, begin: 3.5, index: 12 },
    { text: " ka", duration: 0.53, begin: 3.75, index: 13 },
    { text: "vak", duration: 0.53, begin: 4.0, index: 14 },
    { text: " a", duration: 0.53, begin: 4.25, index: 15 },
    { text: "ğa", duration: 0.53, begin: 4.5, index: 16 },
    { text: "cı", duration: 0.53, begin: 4.75, index: 17 },
    { text: "nın", duration: 0.53, begin: 5.0, index: 18 },
    { text: " ya", duration: 0.53, begin: 5.25, index: 19 },
    { text: "nın", duration: 0.53, begin: 5.5, index: 20 },
    { text: "da", duration: 0.53, begin: 5.75, index: 21 },
    { text: " bir", duration: 0.53, begin: 6.75, index: 22 },
    { text: " ka", duration: 0.53, begin: 7.0, index: 23 },
    { text: "bak", duration: 0.53, begin: 7.25, index: 24 },
    { text: " fi", duration: 0.53, begin: 7.5, index: 25 },
    { text: "li", duration: 0.53, begin: 7.75, index: 26 },
    { text: "zi", duration: 0.53, begin: 8.0, index: 27 },
    { text: " boy", duration: 0.53, begin: 8.25, index: 28 },
    { text: " gös", duration: 0.53, begin: 8.5, index: 29 },
    { text: "ter", duration: 0.53, begin: 8.75, index: 30 },
    { text: "miş.", duration: 0.53, begin: 9.0, index: 31 },
    { text: " Ba", duration: 0.53, begin: 10.25, index: 32 },
    { text: "har", duration: 0.53, begin: 10.5, index: 33 },
    { text: " i", duration: 0.53, begin: 10.75, index: 34 },
    { text: "ler", duration: 0.53, begin: 11.0, index: 35 },
    { text: "le", duration: 0.53, begin: 11.25, index: 36 },
    { text: "dik", duration: 0.53, begin: 11.5, index: 37 },
    { text: "çe,", duration: 0.53, begin: 11.75, index: 38 },
    { text: " bit", duration: 0.53, begin: 12.75, index: 39 },
    { text: "ki", duration: 0.53, begin: 13.0, index: 40 },
    { text: " ka", duration: 0.53, begin: 13.25, index: 41 },
    { text: "vak", duration: 0.53, begin: 13.5, index: 42 },
    { text: " a", duration: 0.53, begin: 13.75, index: 43 },
    { text: "ğa", duration: 0.53, begin: 14.0, index: 44 },
    { text: "cı", duration: 0.53, begin: 14.25, index: 45 },
    { text: "na", duration: 0.53, begin: 14.5, index: 46 },
    { text: " sa", duration: 0.53, begin: 14.75, index: 47 },
    { text: "rı", duration: 0.53, begin: 15.0, index: 48 },
    { text: "la", duration: 0.53, begin: 15.25, index: 49 },
    { text: "rak", duration: 0.53, begin: 15.5, index: 50 },
    { text: " yük", duration: 0.53, begin: 15.75, index: 51 },
    { text: "sel", duration: 0.53, begin: 16.0, index: 52 },
    { text: "me", duration: 0.53, begin: 16.25, index: 53 },
    { text: "ye", duration: 0.53, begin: 16.5, index: 54 },
    { text: " baş", duration: 0.53, begin: 16.75, index: 55 },
    { text: "la", duration: 0.53, begin: 17.0, index: 56 },
    { text: "mış.", duration: 0.53, begin: 17.25, index: 57 },
    { text: " Yağ", duration: 0.53, begin: 18.75, index: 58 },
    { text: "mur", duration: 0.53, begin: 19.0, index: 59 },
    { text: "la", duration: 0.53, begin: 19.25, index: 60 },
    { text: "rın", duration: 0.53, begin: 19.5, index: 61 },
    { text: " ve", duration: 0.53, begin: 19.75, index: 62 },
    { text: " gü", duration: 0.53, begin: 20.0, index: 63 },
    { text: "ne", duration: 0.53, begin: 20.25, index: 64 },
    { text: "şin", duration: 0.53, begin: 20.5, index: 65 },
    { text: " et", duration: 0.53, begin: 20.75, index: 66 },
    { text: "ki", duration: 0.53, begin: 21.0, index: 67 },
    { text: "siy", duration: 0.53, begin: 21.25, index: 68 },
    { text: "le", duration: 0.53, begin: 21.5, index: 69 },
    { text: " müt", duration: 0.53, begin: 22.5, index: 70 },
    { text: "hiş", duration: 0.53, begin: 22.75, index: 71 },
    { text: " bir", duration: 0.53, begin: 23.0, index: 72 },
    { text: " hız", duration: 0.53, begin: 23.25, index: 73 },
    { text: "la", duration: 0.53, begin: 23.5, index: 74 },
    { text: " bü", duration: 0.53, begin: 24.0, index: 75 },
    { text: "yü", duration: 0.53, begin: 24.25, index: 76 },
    { text: "müş", duration: 0.53, begin: 24.5, index: 77 },
    { text: " ve", duration: 0.53, begin: 24.75, index: 78 },
    { text: " ne", duration: 0.53, begin: 25.75, index: 79 },
    { text: "re", duration: 0.53, begin: 26.0, index: 80 },
    { text: "dey", duration: 0.53, begin: 26.25, index: 81 },
    { text: "se", duration: 0.53, begin: 26.5, index: 82 },
    { text: " ka", duration: 0.53, begin: 26.75, index: 83 },
    { text: "vak", duration: 0.53, begin: 27.0, index: 84 },
    { text: " a", duration: 0.53, begin: 27.25, index: 85 },
    { text: "ğa", duration: 0.53, begin: 27.5, index: 86 },
    { text: "cı", duration: 0.53, begin: 27.75, index: 87 },
    { text: " i", duration: 0.53, begin: 28.0, index: 88 },
    { text: "le", duration: 0.53, begin: 28.25, index: 89 },
    { text: " ay", duration: 0.53, begin: 28.5, index: 90 },
    { text: "nı", duration: 0.53, begin: 28.75, index: 91 },
    { text: " bo", duration: 0.53, begin: 29.0, index: 92 },
    { text: "ya", duration: 0.53, begin: 29.25, index: 93 },
    { text: " gel", duration: 0.53, begin: 29.5, index: 94 },
    { text: "miş.", duration: 0.53, begin: 29.75, index: 95 },
    { text: " Bir", duration: 0.53, begin: 31.25, index: 96 },
    { text: " gün", duration: 0.53, begin: 31.5, index: 97 },
    { text: " da", duration: 0.53, begin: 31.75, index: 98 },
    { text: "ya", duration: 0.53, begin: 32.0, index: 99 },
    { text: "na", duration: 0.53, begin: 32.25, index: 100 },
    { text: "ma", duration: 0.53, begin: 32.5, index: 101 },
    { text: "yıp", duration: 0.53, begin: 32.75, index: 102 },
    { text: " sor", duration: 0.53, begin: 33.0, index: 103 },
    { text: "muş", duration: 0.53, begin: 33.25, index: 104 },
    { text: " ka", duration: 0.53, begin: 33.5, index: 105 },
    { text: "va", duration: 0.53, begin: 33.75, index: 106 },
    { text: "ğa:", duration: 0.53, begin: 34.0, index: 107 },
    { text: ' "Sen', duration: 0.53, begin: 35.5, index: 108 },
    { text: " kaç", duration: 0.53, begin: 35.75, index: 109 },
    { text: " ay", duration: 0.53, begin: 36.0, index: 110 },
    { text: "da", duration: 0.53, begin: 36.25, index: 111 },
    { text: " bu", duration: 0.53, begin: 36.75, index: 112 },
    { text: " ha", duration: 0.53, begin: 37.0, index: 113 },
    { text: "le", duration: 0.53, begin: 37.25, index: 114 },
    { text: " gel", duration: 0.53, begin: 37.5, index: 115 },
    { text: "din,", duration: 0.53, begin: 37.75, index: 116 },
    { text: " a", duration: 0.53, begin: 38.75, index: 117 },
    { text: 'ğaç?"', duration: 0.53, begin: 39.0, index: 118 },
    { text: ' "On', duration: 0.53, begin: 40.5, index: 119 },
    { text: " yıl", duration: 0.53, begin: 40.75, index: 120 },
    { text: 'da,"', duration: 0.38, begin: 41.0, index: 121 },
    { text: " de", duration: 0.38, begin: 41.75, index: 122 },
    { text: "miş", duration: 0.38, begin: 42.0, index: 123 },
    { text: " ka", duration: 0.38, begin: 42.25, index: 124 },
    { text: "vak.", duration: 0.38, begin: 42.5, index: 125 },
    { text: ' "On', duration: 0.53, begin: 43.25, index: 126 },
    { text: " yıl", duration: 0.53, begin: 43.5, index: 127 },
    { text: "da", duration: 0.53, begin: 43.75, index: 128 },
    { text: ' mı?"', duration: 0.53, begin: 44.0, index: 129 },
    { text: " Di", duration: 0.53, begin: 45.0, index: 130 },
    { text: "ye", duration: 0.53, begin: 45.25, index: 131 },
    { text: " gül", duration: 0.53, begin: 45.5, index: 132 },
    { text: "müş", duration: 0.53, begin: 45.75, index: 133 },
    { text: " ve", duration: 0.53, begin: 46.75, index: 134 },
    { text: " çi", duration: 0.53, begin: 47.0, index: 135 },
    { text: "cek", duration: 0.53, begin: 47.25, index: 136 },
    { text: "le", duration: 0.53, begin: 47.5, index: 137 },
    { text: "ri", duration: 0.53, begin: 47.75, index: 138 },
    { text: "ni", duration: 0.53, begin: 48.0, index: 139 },
    { text: " sal", duration: 0.53, begin: 48.25, index: 140 },
    { text: "la", duration: 0.53, begin: 48.5, index: 141 },
    { text: "mış", duration: 0.53, begin: 48.75, index: 142 },
    { text: " ka", duration: 0.53, begin: 49.0, index: 143 },
    { text: "bak.", duration: 0.53, begin: 49.25, index: 144 },
    { text: " Ben", duration: 0.53, begin: 50.5, index: 145 },
    { text: " ne", duration: 0.53, begin: 50.75, index: 146 },
    { text: "re", duration: 0.53, begin: 51.0, index: 147 },
    { text: "dey", duration: 0.53, begin: 51.25, index: 148 },
    { text: "se", duration: 0.53, begin: 51.5, index: 149 },
    { text: " i", duration: 0.53, begin: 52.5, index: 150 },
    { text: "ki", duration: 0.53, begin: 52.75, index: 151 },
    { text: " ay", duration: 0.53, begin: 53.0, index: 152 },
    { text: "da", duration: 0.53, begin: 53.25, index: 153 },
    { text: " se", duration: 0.53, begin: 53.5, index: 154 },
    { text: "nin", duration: 0.53, begin: 53.75, index: 155 },
    { text: "le", duration: 0.53, begin: 54.0, index: 156 },
    { text: " ay", duration: 0.53, begin: 54.5, index: 157 },
    { text: "nı", duration: 0.53, begin: 54.75, index: 158 },
    { text: " bo", duration: 0.53, begin: 55.0, index: 159 },
    { text: "ya", duration: 0.53, begin: 55.25, index: 160 },
    { text: " gel", duration: 0.53, begin: 55.75, index: 161 },
    { text: 'dim."', duration: 0.53, begin: 56.0, index: 162 },
    { text: ' "Doğ', duration: 0.38, begin: 57.25, index: 163 },
    { text: 'ru"', duration: 0.38, begin: 57.5, index: 164 },
    { text: " de", duration: 0.38, begin: 58.25, index: 165 },
    { text: "miş", duration: 0.38, begin: 58.5, index: 166 },
    { text: " ka", duration: 0.38, begin: 58.75, index: 167 },
    { text: "vak.", duration: 0.38, begin: 59.0, index: 168 },
    { text: " Gün", duration: 0.53, begin: 60.0, index: 169 },
    { text: "ler", duration: 0.53, begin: 60.25, index: 170 },
    { text: " gün", duration: 0.53, begin: 60.5, index: 171 },
    { text: "le", duration: 0.53, begin: 60.75, index: 172 },
    { text: "ri", duration: 0.53, begin: 61.0, index: 173 },
    { text: " ko", duration: 0.53, begin: 61.25, index: 174 },
    { text: "va", duration: 0.53, begin: 61.5, index: 175 },
    { text: "la", duration: 0.53, begin: 61.75, index: 176 },
    { text: "mış", duration: 0.53, begin: 62.0, index: 177 },
    { text: " ve", duration: 0.53, begin: 62.25, index: 178 },
    { text: " son", duration: 0.53, begin: 63.25, index: 179 },
    { text: "ba", duration: 0.53, begin: 63.5, index: 180 },
    { text: "ha", duration: 0.53, begin: 63.75, index: 181 },
    { text: "rın", duration: 0.53, begin: 64.0, index: 182 },
    { text: " ilk", duration: 0.53, begin: 64.75, index: 183 },
    { text: " rüz", duration: 0.53, begin: 65.0, index: 184 },
    { text: "gar", duration: 0.53, begin: 65.25, index: 185 },
    { text: "la", duration: 0.53, begin: 65.5, index: 186 },
    { text: "rı", duration: 0.53, begin: 65.75, index: 187 },
    { text: " baş", duration: 0.53, begin: 66.0, index: 188 },
    { text: "la", duration: 0.53, begin: 66.25, index: 189 },
    { text: "dı", duration: 0.53, begin: 66.5, index: 190 },
    { text: "ğın", duration: 0.53, begin: 66.75, index: 191 },
    { text: "da", duration: 0.53, begin: 67.0, index: 192 },
    { text: " ka", duration: 0.53, begin: 68.0, index: 193 },
    { text: "bak", duration: 0.53, begin: 68.25, index: 194 },
    { text: " ü", duration: 0.53, begin: 68.5, index: 195 },
    { text: "şü", duration: 0.53, begin: 68.75, index: 196 },
    { text: "me", duration: 0.53, begin: 69.0, index: 197 },
    { text: "ye,", duration: 0.53, begin: 69.25, index: 198 },
    { text: " son", duration: 0.53, begin: 70.25, index: 199 },
    { text: "ra", duration: 0.53, begin: 70.5, index: 200 },
    { text: " yap", duration: 0.53, begin: 70.75, index: 201 },
    { text: "rak", duration: 0.53, begin: 71.0, index: 202 },
    { text: "la", duration: 0.53, begin: 71.25, index: 203 },
    { text: "rı", duration: 0.53, begin: 71.5, index: 204 },
    { text: "nı", duration: 0.53, begin: 71.75, index: 205 },
    { text: " dü", duration: 0.53, begin: 72.0, index: 206 },
    { text: "şür", duration: 0.53, begin: 72.25, index: 207 },
    { text: "me", duration: 0.53, begin: 72.5, index: 208 },
    { text: "ye,", duration: 0.53, begin: 72.75, index: 209 },
    { text: " so", duration: 0.53, begin: 74.25, index: 210 },
    { text: "ğuk", duration: 0.53, begin: 74.5, index: 211 },
    { text: "lar", duration: 0.53, begin: 74.75, index: 212 },
    { text: " art", duration: 0.68, begin: 75.0, index: 213 },
    { text: "tık", duration: 0.68, begin: 75.25, index: 214 },
    { text: "ça", duration: 0.68, begin: 75.5, index: 215 },
    { text: "da", duration: 0.68, begin: 75.75, index: 216 },
    { text: " a", duration: 0.28, begin: 77.25, index: 217 },
    { text: "şa", duration: 0.28, begin: 77.5, index: 218 },
    { text: "ğı", duration: 0.28, begin: 77.75, index: 219 },
    { text: "ya", duration: 0.28, begin: 78.0, index: 220 },
    { text: " doğ", duration: 0.28, begin: 78.25, index: 221 },
    { text: "ru", duration: 0.28, begin: 78.5, index: 222 },
    { text: " in", duration: 0.53, begin: 78.75, index: 223 },
    { text: "me", duration: 0.53, begin: 79.0, index: 224 },
    { text: "ye", duration: 0.53, begin: 79.25, index: 225 },
    { text: " baş", duration: 0.53, begin: 79.5, index: 226 },
    { text: "la", duration: 0.53, begin: 79.75, index: 227 },
    { text: "mış.", duration: 0.53, begin: 80.0, index: 228 },
    { text: " Sor", duration: 0.53, begin: 81.25, index: 229 },
    { text: "muş", duration: 0.53, begin: 81.5, index: 230 },
    { text: " en", duration: 0.53, begin: 81.75, index: 231 },
    { text: "di", duration: 0.53, begin: 82.0, index: 232 },
    { text: "şey", duration: 0.53, begin: 82.25, index: 233 },
    { text: "le", duration: 0.53, begin: 82.5, index: 234 },
    { text: " ka", duration: 0.53, begin: 82.75, index: 235 },
    { text: "va", duration: 0.53, begin: 83.0, index: 236 },
    { text: "ğa:", duration: 0.53, begin: 83.25, index: 237 },
    { text: ' "Ne', duration: 0.53, begin: 84.25, index: 238 },
    { text: "ler", duration: 0.53, begin: 84.5, index: 239 },
    { text: " o", duration: 0.53, begin: 84.75, index: 240 },
    { text: "lu", duration: 0.53, begin: 85.0, index: 241 },
    { text: "yor", duration: 0.53, begin: 85.25, index: 242 },
    { text: " ba", duration: 0.53, begin: 85.5, index: 243 },
    { text: "na", duration: 0.53, begin: 85.75, index: 244 },
    { text: " a", duration: 0.28, begin: 86.5, index: 245 },
    { text: 'ğaç?"', duration: 0.28, begin: 86.75, index: 246 },
    { text: ' "Ö', duration: 0.53, begin: 87.25, index: 247 },
    { text: "lü", duration: 0.53, begin: 87.5, index: 248 },
    { text: "yor", duration: 0.53, begin: 87.75, index: 249 },
    { text: 'sun,"', duration: 0.53, begin: 88.0, index: 250 },
    { text: " de", duration: 0.53, begin: 88.75, index: 251 },
    { text: "miş", duration: 0.53, begin: 89.0, index: 252 },
    { text: " ka", duration: 0.53, begin: 89.25, index: 253 },
    { text: "vak.", duration: 0.53, begin: 89.5, index: 254 },
    { text: ' "Ni', duration: 0.53, begin: 90.75, index: 255 },
    { text: 'çin?"', duration: 0.53, begin: 91.0, index: 256 },
    { text: ' "Be', duration: 0.53, begin: 92.25, index: 257 },
    { text: "nim", duration: 0.53, begin: 92.5, index: 258 },
    { text: " on", duration: 0.53, begin: 92.75, index: 259 },
    { text: " yıl", duration: 0.53, begin: 93.0, index: 260 },
    { text: "da", duration: 0.53, begin: 93.25, index: 261 },
    { text: " gel", duration: 0.53, begin: 93.75, index: 262 },
    { text: "di", duration: 0.53, begin: 94.0, index: 263 },
    { text: "ğim", duration: 0.53, begin: 94.25, index: 264 },
    { text: " ye", duration: 0.53, begin: 94.5, index: 265 },
    { text: "re,", duration: 0.53, begin: 94.75, index: 266 },
    { text: " i", duration: 0.53, begin: 95.75, index: 267 },
    { text: "ki", duration: 0.53, begin: 96.0, index: 268 },
    { text: " ay", duration: 0.53, begin: 96.25, index: 269 },
    { text: "da", duration: 0.53, begin: 96.5, index: 270 },
    { text: " gel", duration: 0.53, begin: 97.0, index: 271 },
    { text: "me", duration: 0.53, begin: 97.25, index: 272 },
    { text: "ye", duration: 0.53, begin: 97.5, index: 273 },
    { text: " ça", duration: 0.53, begin: 97.75, index: 274 },
    { text: "lış", duration: 0.53, begin: 98.0, index: 275 },
    { text: "tı", duration: 0.53, begin: 98.25, index: 276 },
    { text: "ğın", duration: 0.53, begin: 98.5, index: 277 },
    { text: " i", duration: 0.53, begin: 98.75, index: 278 },
    { text: 'çin."', duration: 0.53, begin: 99.0, index: 279 },
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
                href="/dashboard/stories/kisilik"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/on-yargi"
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
            src="/3-3.mp3"
            onEnded={handleAudioEnded}
            onLoadedMetadata={handleLoadedMetadata}
          />
        </div>

        {/* Story Content */}
        {/* Story Content - plain, no box */}
        {renderTextSegments()}
      </div>
    </div>
  );
}
