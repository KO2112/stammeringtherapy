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
      text: "Ze",
      duration: 0.28,
      begin: 0.5,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ka",
      duration: 0.28,
      begin: 0.75,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Ö",
      duration: 0.28,
      begin: 1.0,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "zür",
      duration: 0.28,
      begin: 1.25,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "lü",
      duration: 0.28,
      begin: 1.5,
      index: 5,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ler",
      duration: 0.28,
      begin: 1.75,
      index: 6,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Sı",
      duration: 0.28,
      begin: 2.0,
      index: 7,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "nı",
      duration: 0.28,
      begin: 2.25,
      index: 8,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "fı",
      duration: 0.28,
      begin: 2.5,
      index: 9,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Be", duration: 0.28, begin: 3.5, index: 10 },
    { text: "şin", duration: 0.28, begin: 3.75, index: 11 },
    { text: "ci", duration: 0.28, begin: 4.0, index: 12 },
    { text: " sı", duration: 0.28, begin: 4.25, index: 13 },
    { text: "nıf", duration: 0.28, begin: 4.5, index: 14 },
    { text: "tay", duration: 0.28, begin: 4.75, index: 15 },
    { text: "ken,", duration: 0.28, begin: 5.0, index: 16 },
    { text: " bir", duration: 0.28, begin: 5.5, index: 17 },
    { text: " gün", duration: 0.28, begin: 5.75, index: 18 },
    { text: " ar", duration: 0.28, begin: 6.0, index: 19 },
    { text: "ka", duration: 0.28, begin: 6.25, index: 20 },
    { text: "da", duration: 0.28, begin: 6.5, index: 21 },
    { text: "şı", duration: 0.28, begin: 6.75, index: 22 },
    { text: "mı", duration: 0.28, begin: 7.0, index: 23 },
    { text: " gör", duration: 0.28, begin: 7.25, index: 24 },
    { text: "mek", duration: 0.28, begin: 7.5, index: 25 },
    { text: " i", duration: 0.28, begin: 7.75, index: 26 },
    { text: "çin", duration: 0.28, begin: 8.0, index: 27 },
    { text: " o", duration: 0.28, begin: 8.5, index: 28 },
    { text: "nun", duration: 0.28, begin: 8.75, index: 29 },
    { text: " sı", duration: 0.28, begin: 9.0, index: 30 },
    { text: "nı", duration: 0.28, begin: 9.2, index: 31 },
    { text: "fı", duration: 0.28, begin: 9.4, index: 32 },
    { text: "na", duration: 0.28, begin: 9.6, index: 33 },
    { text: " git", duration: 0.28, begin: 9.8, index: 34 },
    { text: "tim", duration: 0.28, begin: 10.0, index: 35 },
    { text: " ve", duration: 0.28, begin: 10.2, index: 36 },
    { text: " sı", duration: 0.28, begin: 11.0, index: 37 },
    { text: "ra", duration: 0.28, begin: 11.2, index: 38 },
    { text: "lar", duration: 0.28, begin: 11.4, index: 39 },
    { text: "dan", duration: 0.28, begin: 11.8, index: 40 },
    { text: " bi", duration: 0.28, begin: 12.0, index: 41 },
    { text: "ri", duration: 0.28, begin: 12.2, index: 42 },
    { text: "ne", duration: 0.28, begin: 12.4, index: 43 },
    { text: " o", duration: 0.28, begin: 12.6, index: 44 },
    { text: "tur", duration: 0.28, begin: 12.8, index: 45 },
    { text: "dum.", duration: 0.28, begin: 13.0, index: 46 },
    { text: " Az", duration: 0.38, begin: 14.2, index: 47 },
    { text: " son", duration: 0.38, begin: 14.4, index: 48 },
    { text: "ra", duration: 0.38, begin: 14.6, index: 49 },
    { text: " o", duration: 0.38, begin: 15.6, index: 50 },
    { text: " der", duration: 0.38, begin: 15.8, index: 51 },
    { text: "sin", duration: 0.38, begin: 16.0, index: 52 },
    { text: " öğ", duration: 0.38, begin: 16.6, index: 53 },
    { text: "ret", duration: 0.38, begin: 16.8, index: 54 },
    { text: "me", duration: 0.38, begin: 17.0, index: 55 },
    { text: "ni", duration: 0.38, begin: 17.2, index: 56 },
    { text: " Bay", duration: 0.4, begin: 18.0, index: 57 },
    { text: " Wash", duration: 0.4, begin: 18.2, index: 58 },
    { text: "ing", duration: 0.4, begin: 18.4, index: 59 },
    { text: "ton", duration: 0.4, begin: 18.6, index: 60 },
    { text: " sı", duration: 0.28, begin: 19.25, index: 61 },
    { text: "nıf", duration: 0.28, begin: 19.5, index: 62 },
    { text: "tan", duration: 0.28, begin: 19.75, index: 63 },
    { text: " i", duration: 0.28, begin: 20.0, index: 64 },
    { text: "çe", duration: 0.28, begin: 20.25, index: 65 },
    { text: "ri", duration: 0.28, begin: 20.5, index: 66 },
    { text: " gir", duration: 0.28, begin: 20.75, index: 67 },
    { text: "di", duration: 0.28, begin: 21.0, index: 68 },
    { text: " ve", duration: 0.28, begin: 21.25, index: 69 },
    { text: " bi", duration: 0.28, begin: 22.0, index: 70 },
    { text: "raz", duration: 0.28, begin: 22.25, index: 71 },
    { text: " son", duration: 0.28, begin: 22.5, index: 72 },
    { text: "ra", duration: 0.28, begin: 22.75, index: 73 },
    { text: " da,", duration: 0.28, begin: 23.0, index: 74 },
    { text: " ben", duration: 0.28, begin: 24.0, index: 75 },
    { text: "den", duration: 0.28, begin: 24.25, index: 76 },
    { text: " tah", duration: 0.28, begin: 24.5, index: 77 },
    { text: "ta", duration: 0.28, begin: 24.75, index: 78 },
    { text: "ya", duration: 0.28, begin: 25.0, index: 79 },
    { text: " çı", duration: 0.28, begin: 25.25, index: 80 },
    { text: "kıp", duration: 0.28, begin: 25.5, index: 81 },
    { text: " bir", duration: 0.28, begin: 26.0, index: 82 },
    { text: "şey", duration: 0.28, begin: 26.25, index: 83 },
    { text: "ler", duration: 0.28, begin: 26.5, index: 84 },
    { text: " yaz", duration: 0.28, begin: 26.75, index: 85 },
    { text: "ma", duration: 0.28, begin: 27.0, index: 86 },
    { text: "mı", duration: 0.28, begin: 27.25, index: 87 },
    { text: " is", duration: 0.28, begin: 27.5, index: 88 },
    { text: "te", duration: 0.28, begin: 27.75, index: 89 },
    { text: "di.", duration: 0.28, begin: 28.0, index: 90 },
    { text: " Ken", duration: 0.28, begin: 29.0, index: 91 },
    { text: "di", duration: 0.28, begin: 29.25, index: 92 },
    { text: "si", duration: 0.28, begin: 29.5, index: 93 },
    { text: "ne", duration: 0.28, begin: 29.75, index: 94 },
    { text: " bu", duration: 0.28, begin: 30.5, index: 95 },
    { text: "nu", duration: 0.28, begin: 30.75, index: 96 },
    { text: " ya", duration: 0.28, begin: 31.0, index: 97 },
    { text: "pa", duration: 0.28, begin: 31.2, index: 98 },
    { text: "ma", duration: 0.28, begin: 31.4, index: 99 },
    { text: "ya", duration: 0.28, begin: 31.6, index: 100 },
    { text: "ca", duration: 0.28, begin: 31.8, index: 101 },
    { text: "ğı", duration: 0.28, begin: 32.0, index: 102 },
    { text: "mı", duration: 0.28, begin: 32.2, index: 103 },
    { text: " söy", duration: 0.28, begin: 32.4, index: 104 },
    { text: "le", duration: 0.28, begin: 32.6, index: 105 },
    { text: "dim.", duration: 0.28, begin: 32.8, index: 106 },
    { text: ' "Ni', duration: 0.28, begin: 33.5, index: 107 },
    { text: 'ye"', duration: 0.28, begin: 33.75, index: 108 },
    { text: " di", duration: 0.28, begin: 34.5, index: 109 },
    { text: "ye", duration: 0.28, begin: 34.75, index: 110 },
    { text: " sor", duration: 0.28, begin: 35.0, index: 111 },
    { text: "du.", duration: 0.28, begin: 35.25, index: 112 },
    { text: " Bu", duration: 0.28, begin: 36.25, index: 113 },
    { text: " sı", duration: 0.28, begin: 36.5, index: 114 },
    { text: "nı", duration: 0.28, begin: 36.75, index: 115 },
    { text: "fın", duration: 0.28, begin: 37.0, index: 116 },
    { text: " öğ", duration: 0.28, begin: 37.25, index: 117 },
    { text: "ren", duration: 0.28, begin: 37.5, index: 118 },
    { text: "ci", duration: 0.28, begin: 37.75, index: 119 },
    { text: "si", duration: 0.28, begin: 38.0, index: 120 },
    { text: " ol", duration: 0.28, begin: 38.25, index: 121 },
    { text: "ma", duration: 0.28, begin: 38.5, index: 122 },
    { text: "dı", duration: 0.28, begin: 38.75, index: 123 },
    { text: "ğı", duration: 0.28, begin: 39.0, index: 124 },
    { text: "mı", duration: 0.28, begin: 39.25, index: 125 },
    { text: " söy", duration: 0.28, begin: 39.5, index: 126 },
    { text: "le", duration: 0.28, begin: 39.75, index: 127 },
    { text: "dim.", duration: 0.28, begin: 40.0, index: 128 },
    { text: ' "Fark', duration: 0.28, begin: 41.0, index: 129 },
    { text: " et", duration: 0.28, begin: 41.25, index: 130 },
    { text: "mez,", duration: 0.28, begin: 41.5, index: 131 },
    { text: " tah", duration: 0.28, begin: 42.25, index: 132 },
    { text: "ta", duration: 0.28, begin: 42.5, index: 133 },
    { text: "ya", duration: 0.28, begin: 42.75, index: 134 },
    { text: ' gel."', duration: 0.28, begin: 43.0, index: 135 },
    { text: " de", duration: 0.28, begin: 43.75, index: 136 },
    { text: "di.", duration: 0.28, begin: 44.0, index: 137 },
    { text: " Yi", duration: 0.28, begin: 45.0, index: 138 },
    { text: "ne,", duration: 0.28, begin: 45.25, index: 139 },
    { text: " ya", duration: 0.28, begin: 46.0, index: 140 },
    { text: "pa", duration: 0.28, begin: 46.25, index: 141 },
    { text: "ma", duration: 0.28, begin: 46.5, index: 142 },
    { text: "ya", duration: 0.28, begin: 46.7, index: 143 },
    { text: "ca", duration: 0.28, begin: 46.9, index: 144 },
    { text: "ğı", duration: 0.28, begin: 47.1, index: 145 },
    { text: "mı", duration: 0.28, begin: 47.3, index: 146 },
    { text: " söy", duration: 0.28, begin: 47.5, index: 147 },
    { text: "le", duration: 0.28, begin: 47.7, index: 148 },
    { text: "dim.", duration: 0.28, begin: 47.9, index: 149 },
    { text: " Tek", duration: 0.28, begin: 48.9, index: 150 },
    { text: "rar:", duration: 0.28, begin: 49.2, index: 151 },
    { text: ' "Ni', duration: 0.28, begin: 50.25, index: 152 },
    { text: "çin", duration: 0.28, begin: 50.5, index: 153 },
    { text: " ya", duration: 0.28, begin: 50.75, index: 154 },
    { text: "pa", duration: 0.28, begin: 51.0, index: 155 },
    { text: "maz", duration: 0.28, begin: 51.25, index: 156 },
    { text: 'sın?"', duration: 0.28, begin: 51.5, index: 157 },
    { text: " di", duration: 0.28, begin: 52.0, index: 158 },
    { text: "ye", duration: 0.28, begin: 52.25, index: 159 },
    { text: " sor", duration: 0.28, begin: 52.5, index: 160 },
    { text: "du.", duration: 0.28, begin: 52.75, index: 161 },
    { text: " Bir", duration: 0.28, begin: 54.0, index: 162 },
    { text: " sü", duration: 0.28, begin: 54.25, index: 163 },
    { text: "re", duration: 0.28, begin: 54.5, index: 164 },
    { text: " ses", duration: 0.28, begin: 54.75, index: 165 },
    { text: "siz", duration: 0.28, begin: 55.0, index: 166 },
    { text: "ce", duration: 0.28, begin: 55.25, index: 167 },
    { text: " dur", duration: 0.38, begin: 55.5, index: 168 },
    { text: "duk", duration: 0.38, begin: 55.75, index: 169 },
    { text: "tan", duration: 0.38, begin: 56.0, index: 170 },
    { text: " son", duration: 0.38, begin: 56.25, index: 171 },
    { text: "ra:", duration: 0.38, begin: 56.5, index: 172 },
    { text: ' "E', duration: 0.28, begin: 57.75, index: 173 },
    { text: "fen", duration: 0.28, begin: 58.0, index: 174 },
    { text: "dim;", duration: 0.28, begin: 58.25, index: 175 },
    { text: " ben", duration: 0.28, begin: 59.0, index: 176 },
    { text: " ze", duration: 0.28, begin: 59.25, index: 177 },
    { text: "ka", duration: 0.28, begin: 59.5, index: 178 },
    { text: " ö", duration: 0.28, begin: 60.0, index: 179 },
    { text: "zür", duration: 0.28, begin: 60.25, index: 180 },
    { text: "lü", duration: 0.28, begin: 60.5, index: 181 },
    { text: "ler", duration: 0.28, begin: 60.75, index: 182 },
    { text: " sı", duration: 0.28, begin: 61.0, index: 183 },
    { text: "nı", duration: 0.28, begin: 61.2, index: 184 },
    { text: "fı", duration: 0.28, begin: 61.4, index: 185 },
    { text: "nın", duration: 0.28, begin: 61.6, index: 186 },
    { text: " öğ", duration: 0.28, begin: 61.8, index: 187 },
    { text: "ren", duration: 0.28, begin: 62.0, index: 188 },
    { text: "ci", duration: 0.28, begin: 62.2, index: 189 },
    { text: "si", duration: 0.28, begin: 62.4, index: 190 },
    { text: 'yim."', duration: 0.28, begin: 62.6, index: 191 },
    { text: " de", duration: 0.28, begin: 63.4, index: 192 },
    { text: "dim.", duration: 0.28, begin: 63.6, index: 193 },
    { text: " Bu", duration: 0.28, begin: 64.8, index: 194 },
    { text: " ce", duration: 0.28, begin: 65.0, index: 195 },
    { text: "va", duration: 0.28, begin: 65.2, index: 196 },
    { text: "bım", duration: 0.28, begin: 65.4, index: 197 },
    { text: " ü", duration: 0.28, begin: 65.6, index: 198 },
    { text: "ze", duration: 0.28, begin: 65.8, index: 199 },
    { text: "ri", duration: 0.28, begin: 66.0, index: 200 },
    { text: "ne", duration: 0.28, begin: 66.2, index: 201 },
    { text: " Bay", duration: 0.28, begin: 67.0, index: 202 },
    { text: " Was", duration: 0.28, begin: 67.2, index: 203 },
    { text: "hing", duration: 0.28, begin: 67.4, index: 204 },
    { text: "ton", duration: 0.28, begin: 67.6, index: 205 },
    { text: " kür", duration: 0.28, begin: 68.5, index: 206 },
    { text: "sü", duration: 0.28, begin: 68.75, index: 207 },
    { text: "sün", duration: 0.28, begin: 69.0, index: 208 },
    { text: "den", duration: 0.28, begin: 69.25, index: 209 },
    { text: " kal", duration: 0.28, begin: 69.5, index: 210 },
    { text: "kıp", duration: 0.28, begin: 69.75, index: 211 },
    { text: " ya", duration: 0.28, begin: 70.25, index: 212 },
    { text: "nı", duration: 0.28, begin: 70.5, index: 213 },
    { text: "ma", duration: 0.28, begin: 70.75, index: 214 },
    { text: " gel", duration: 0.28, begin: 71.0, index: 215 },
    { text: "di", duration: 0.28, begin: 71.25, index: 216 },
    { text: " ve:", duration: 0.28, begin: 71.5, index: 217 },
    { text: ' "Bir', duration: 0.28, begin: 72.5, index: 218 },
    { text: " da", duration: 0.28, begin: 72.75, index: 219 },
    { text: "ha", duration: 0.28, begin: 73.0, index: 220 },
    { text: " böy", duration: 0.28, begin: 73.25, index: 221 },
    { text: "le", duration: 0.28, begin: 73.5, index: 222 },
    { text: " söy", duration: 0.28, begin: 73.75, index: 223 },
    { text: "le", duration: 0.28, begin: 74.0, index: 224 },
    { text: "me.", duration: 0.28, begin: 74.25, index: 225 },
    { text: " Ba", duration: 0.28, begin: 75.0, index: 226 },
    { text: "zı", duration: 0.28, begin: 75.25, index: 227 },
    { text: " ki", duration: 0.28, begin: 75.5, index: 228 },
    { text: "şi", duration: 0.28, begin: 75.75, index: 229 },
    { text: "le", duration: 0.28, begin: 76.0, index: 230 },
    { text: "rin", duration: 0.28, begin: 76.25, index: 231 },
    { text: " fi", duration: 0.28, begin: 76.5, index: 232 },
    { text: "kir", duration: 0.28, begin: 76.75, index: 233 },
    { text: "le", duration: 0.28, begin: 77.0, index: 234 },
    { text: "ri", duration: 0.28, begin: 77.25, index: 235 },
    { text: " se", duration: 0.28, begin: 77.75, index: 236 },
    { text: "nin", duration: 0.28, begin: 78.0, index: 237 },
    { text: " ger", duration: 0.28, begin: 78.2, index: 238 },
    { text: "çe", duration: 0.28, begin: 78.4, index: 239 },
    { text: "ğin", duration: 0.28, begin: 78.6, index: 240 },
    { text: " o", duration: 0.28, begin: 78.8, index: 241 },
    { text: "la", duration: 0.28, begin: 79.1, index: 242 },
    { text: 'maz"', duration: 0.28, begin: 79.3, index: 243 },
    { text: " de", duration: 0.28, begin: 80.2, index: 244 },
    { text: "di.", duration: 0.28, begin: 80.4, index: 245 },
    { text: " Bay", duration: 0.28, begin: 81.5, index: 246 },
    { text: " Wash", duration: 0.28, begin: 81.75, index: 247 },
    { text: "ing", duration: 0.28, begin: 82.0, index: 248 },
    { text: "ton'", duration: 0.28, begin: 82.25, index: 249 },
    { text: "la", duration: 0.28, begin: 82.5, index: 250 },
    { text: " ko", duration: 0.28, begin: 82.75, index: 251 },
    { text: "nu", duration: 0.28, begin: 83.0, index: 252 },
    { text: "şur", duration: 0.28, begin: 83.25, index: 253 },
    { text: "ken,", duration: 0.28, begin: 83.5, index: 254 },
    { text: " ze", duration: 0.28, begin: 84.25, index: 255 },
    { text: "ka", duration: 0.28, begin: 84.5, index: 256 },
    { text: " ö", duration: 0.2, begin: 84.7, index: 257 },
    { text: "zür", duration: 0.2, begin: 84.9, index: 258 },
    { text: "lü", duration: 0.2, begin: 85.1, index: 259 },
    { text: "le", duration: 0.2, begin: 85.3, index: 260 },
    { text: "rin", duration: 0.2, begin: 85.5, index: 261 },
    { text: " sı", duration: 0.2, begin: 86.0, index: 262 },
    { text: "nı", duration: 0.2, begin: 86.2, index: 263 },
    { text: "fın", duration: 0.2, begin: 86.4, index: 264 },
    { text: "da", duration: 0.2, begin: 86.6, index: 265 },
    { text: " o", duration: 0.2, begin: 86.8, index: 266 },
    { text: "ku", duration: 0.2, begin: 87.0, index: 267 },
    { text: "du", duration: 0.2, begin: 87.2, index: 268 },
    { text: "ğu", duration: 0.2, begin: 87.4, index: 269 },
    { text: "mu", duration: 0.2, begin: 87.6, index: 270 },
    { text: " öğ", duration: 0.2, begin: 87.8, index: 271 },
    { text: "re", duration: 0.2, begin: 88.0, index: 272 },
    { text: "nen", duration: 0.2, begin: 88.2, index: 273 },
    { text: " öğ", duration: 0.2, begin: 88.4, index: 274 },
    { text: "ren", duration: 0.2, begin: 88.6, index: 275 },
    { text: "ci", duration: 0.2, begin: 88.8, index: 276 },
    { text: "ler", duration: 0.2, begin: 89.0, index: 277 },
    { text: " ba", duration: 0.28, begin: 89.8, index: 278 },
    { text: "na", duration: 0.28, begin: 90.0, index: 279 },
    { text: " gül", duration: 0.28, begin: 90.25, index: 280 },
    { text: "me", duration: 0.28, begin: 90.5, index: 281 },
    { text: "ye", duration: 0.28, begin: 90.75, index: 282 },
    { text: " baş", duration: 0.28, begin: 91.0, index: 283 },
    { text: "la", duration: 0.28, begin: 91.25, index: 284 },
    { text: "dık", duration: 0.28, begin: 91.5, index: 285 },
    { text: "la", duration: 0.28, begin: 91.75, index: 286 },
    { text: "rı", duration: 0.28, begin: 92.0, index: 287 },
    { text: " i", duration: 0.28, begin: 92.25, index: 288 },
    { text: "çin", duration: 0.28, begin: 92.5, index: 289 },
    { text: " çok", duration: 0.28, begin: 93.25, index: 290 },
    { text: " u", duration: 0.28, begin: 93.5, index: 291 },
    { text: "tan", duration: 0.28, begin: 93.75, index: 292 },
    { text: "mış", duration: 0.28, begin: 94.0, index: 293 },
    { text: " a", duration: 0.28, begin: 94.25, index: 294 },
    { text: "ma", duration: 0.28, begin: 94.5, index: 295 },
    { text: " ö", duration: 0.28, begin: 95.25, index: 296 },
    { text: "te", duration: 0.28, begin: 95.5, index: 297 },
    { text: " yan", duration: 0.28, begin: 95.75, index: 298 },
    { text: "dan,", duration: 0.28, begin: 96.0, index: 299 },
    { text: " ken", duration: 0.28, begin: 96.75, index: 300 },
    { text: "di", duration: 0.28, begin: 97.0, index: 301 },
    { text: "mi", duration: 0.28, begin: 97.25, index: 302 },
    { text: " i", duration: 0.28, begin: 97.5, index: 303 },
    { text: "yi", duration: 0.28, begin: 97.75, index: 304 },
    { text: " his", duration: 0.28, begin: 98.0, index: 305 },
    { text: "set", duration: 0.28, begin: 98.25, index: 306 },
    { text: "miş", duration: 0.28, begin: 98.5, index: 307 },
    { text: "tim.", duration: 0.28, begin: 98.75, index: 308 },
    { text: " Çün", duration: 0.28, begin: 100.0, index: 309 },
    { text: "kü", duration: 0.28, begin: 100.25, index: 310 },
    { text: " Bay", duration: 0.28, begin: 100.5, index: 311 },
    { text: " Wash", duration: 0.28, begin: 100.75, index: 312 },
    { text: "ing", duration: 0.28, begin: 101.0, index: 313 },
    { text: "ton", duration: 0.28, begin: 101.25, index: 314 },
    { text: " be", duration: 0.28, begin: 102.0, index: 315 },
    { text: "nim", duration: 0.28, begin: 102.25, index: 316 },
    { text: " o", duration: 0.28, begin: 102.5, index: 317 },
    { text: " gü", duration: 0.28, begin: 102.75, index: 318 },
    { text: "ne", duration: 0.28, begin: 103.0, index: 319 },
    { text: " ka", duration: 0.28, begin: 103.25, index: 320 },
    { text: "dar", duration: 0.28, begin: 103.5, index: 321 },
    { text: " baş", duration: 0.28, begin: 103.75, index: 322 },
    { text: "ka", duration: 0.28, begin: 104.0, index: 323 },
    { text: "la", duration: 0.28, begin: 104.25, index: 324 },
    { text: "rı", duration: 0.28, begin: 104.5, index: 325 },
    { text: "nın", duration: 0.28, begin: 104.75, index: 326 },
    { text: " hak", duration: 0.28, begin: 105.0, index: 327 },
    { text: "kım", duration: 0.28, begin: 105.25, index: 328 },
    { text: "da", duration: 0.28, begin: 105.5, index: 329 },
    { text: "ki", duration: 0.28, begin: 105.75, index: 330 },
    { text: " dü", duration: 0.2, begin: 106.0, index: 331 },
    { text: "şün", duration: 0.2, begin: 106.25, index: 332 },
    { text: "ce", duration: 0.2, begin: 106.5, index: 333 },
    { text: "le", duration: 0.2, begin: 106.75, index: 334 },
    { text: "ri", duration: 0.2, begin: 107.0, index: 335 },
    { text: "nin", duration: 0.2, begin: 107.25, index: 336 },
    { text: " kıs", duration: 0.28, begin: 107.8, index: 337 },
    { text: "ka", duration: 0.28, begin: 108.0, index: 338 },
    { text: "cın", duration: 0.28, begin: 108.2, index: 339 },
    { text: "da", duration: 0.28, begin: 108.4, index: 340 },
    { text: " ya", duration: 0.28, begin: 108.6, index: 341 },
    { text: "şa", duration: 0.28, begin: 108.8, index: 342 },
    { text: "dı", duration: 0.28, begin: 109.0, index: 343 },
    { text: "ğı", duration: 0.28, begin: 109.2, index: 344 },
    { text: "mı", duration: 0.28, begin: 109.4, index: 345 },
    { text: " an", duration: 0.28, begin: 109.6, index: 346 },
    { text: "la", duration: 0.28, begin: 109.8, index: 347 },
    { text: "ma", duration: 0.28, begin: 110.0, index: 348 },
    { text: "mı", duration: 0.28, begin: 110.2, index: 349 },
    { text: " sağ", duration: 0.28, begin: 110.6, index: 350 },
    { text: "la", duration: 0.28, begin: 110.8, index: 351 },
    { text: "mış", duration: 0.28, begin: 111.0, index: 352 },
    { text: "tı.", duration: 0.28, begin: 111.2, index: 353 },
    { text: " Bun", duration: 0.28, begin: 112.5, index: 354 },
    { text: "dan", duration: 0.28, begin: 112.75, index: 355 },
    { text: " son", duration: 0.28, begin: 113.0, index: 356 },
    { text: "ra,", duration: 0.28, begin: 113.25, index: 357 },
    { text: " Bay", duration: 0.28, begin: 114.25, index: 358 },
    { text: " Wash", duration: 0.28, begin: 114.5, index: 359 },
    { text: "ing", duration: 0.28, begin: 114.75, index: 360 },
    { text: "ton", duration: 0.28, begin: 115.0, index: 361 },
    { text: " be", duration: 0.28, begin: 115.75, index: 362 },
    { text: "ni", duration: 0.28, begin: 116.0, index: 363 },
    { text: " mo", duration: 0.18, begin: 116.25, index: 364 },
    { text: "ti", duration: 0.18, begin: 116.5, index: 365 },
    { text: "ve", duration: 0.18, begin: 116.75, index: 366 },
    { text: " e", duration: 0.18, begin: 117.0, index: 367 },
    { text: "den", duration: 0.18, begin: 117.25, index: 368 },
    { text: " ki", duration: 0.18, begin: 117.5, index: 369 },
    { text: "şi", duration: 0.18, begin: 117.75, index: 370 },
    { text: " ol", duration: 0.18, begin: 118.0, index: 371 },
    { text: "du.", duration: 0.18, begin: 118.25, index: 372 },
    { text: " O", duration: 0.28, begin: 119.0, index: 373 },
    { text: "nun", duration: 0.28, begin: 119.25, index: 374 },
    { text: "la", duration: 0.28, begin: 119.5, index: 375 },
    { text: " ta", duration: 0.28, begin: 119.75, index: 376 },
    { text: "nış", duration: 0.28, begin: 120.0, index: 377 },
    { text: "tı", duration: 0.28, begin: 120.25, index: 378 },
    { text: "ğım", duration: 0.28, begin: 120.5, index: 379 },
    { text: " se", duration: 0.28, begin: 120.7, index: 380 },
    { text: "ne", duration: 0.28, begin: 120.9, index: 381 },
    { text: "den", duration: 0.28, begin: 121.2, index: 382 },
    { text: " bir", duration: 0.28, begin: 121.4, index: 383 },
    { text: " ön", duration: 0.28, begin: 121.6, index: 384 },
    { text: "ce", duration: 0.28, begin: 121.8, index: 385 },
    { text: "ki", duration: 0.28, begin: 122.0, index: 386 },
    { text: " se", duration: 0.28, begin: 122.2, index: 387 },
    { text: "ne", duration: 0.28, begin: 122.4, index: 388 },
    { text: " sı", duration: 0.38, begin: 123.25, index: 389 },
    { text: "nıf", duration: 0.38, begin: 123.5, index: 390 },
    { text: "ta", duration: 0.38, begin: 123.75, index: 391 },
    { text: " kal", duration: 0.38, begin: 124.0, index: 392 },
    { text: "mış", duration: 0.38, begin: 124.25, index: 393 },
    { text: " ve", duration: 0.38, begin: 124.5, index: 394 },
    { text: " tek", duration: 0.28, begin: 125.75, index: 395 },
    { text: "rar", duration: 0.28, begin: 126.0, index: 396 },
    { text: " dör", duration: 0.28, begin: 126.25, index: 397 },
    { text: "dün", duration: 0.28, begin: 126.5, index: 398 },
    { text: "cü", duration: 0.28, begin: 126.75, index: 399 },
    { text: " sı", duration: 0.28, begin: 127.0, index: 400 },
    { text: "nı", duration: 0.28, begin: 127.25, index: 401 },
    { text: "fa", duration: 0.28, begin: 127.5, index: 402 },
    { text: " gön", duration: 0.28, begin: 127.75, index: 403 },
    { text: "de", duration: 0.28, begin: 128.0, index: 404 },
    { text: "ril", duration: 0.28, begin: 128.25, index: 405 },
    { text: "miş", duration: 0.28, begin: 128.5, index: 406 },
    { text: "tim.", duration: 0.28, begin: 128.75, index: 407 },
    { text: " Fa", duration: 0.28, begin: 130.0, index: 408 },
    { text: "kat", duration: 0.28, begin: 130.25, index: 409 },
    { text: " o", duration: 0.28, begin: 131.0, index: 410 },
    { text: "nun", duration: 0.28, begin: 131.25, index: 411 },
    { text: " söz", duration: 0.28, begin: 131.5, index: 412 },
    { text: "le", duration: 0.28, begin: 131.75, index: 413 },
    { text: "ri", duration: 0.28, begin: 132.0, index: 414 },
    { text: " ha", duration: 0.28, begin: 132.25, index: 415 },
    { text: "ya", duration: 0.28, begin: 132.5, index: 416 },
    { text: "tım", duration: 0.28, begin: 132.75, index: 417 },
    { text: "da", duration: 0.28, begin: 133.0, index: 418 },
    { text: " i", duration: 0.28, begin: 133.75, index: 419 },
    { text: "na", duration: 0.28, begin: 134.0, index: 420 },
    { text: "nıl", duration: 0.28, begin: 134.25, index: 421 },
    { text: "maz", duration: 0.28, begin: 134.5, index: 422 },
    { text: " de", duration: 0.28, begin: 134.75, index: 423 },
    { text: "ği", duration: 0.28, begin: 135.0, index: 424 },
    { text: "şik", duration: 0.28, begin: 135.25, index: 425 },
    { text: "lik", duration: 0.28, begin: 135.5, index: 426 },
    { text: "ler", duration: 0.28, begin: 135.75, index: 427 },
    { text: " yap", duration: 0.28, begin: 136.0, index: 428 },
    { text: "tı.", duration: 0.28, begin: 136.25, index: 429 },
    { text: " O", duration: 0.28, begin: 137.75, index: 430 },
    { text: "kul", duration: 0.28, begin: 138.0, index: 431 },
    { text: "da", duration: 0.28, begin: 138.25, index: 432 },
    { text: " ders", duration: 0.28, begin: 138.5, index: 433 },
    { text: "le", duration: 0.28, begin: 138.75, index: 434 },
    { text: "rim", duration: 0.28, begin: 139.0, index: 435 },
    { text: " i", duration: 0.28, begin: 139.25, index: 436 },
    { text: "yi", duration: 0.28, begin: 139.5, index: 437 },
    { text: " ol", duration: 0.28, begin: 139.75, index: 438 },
    { text: "ma", duration: 0.28, begin: 140.0, index: 439 },
    { text: "ya", duration: 0.28, begin: 140.25, index: 440 },
    { text: " baş", duration: 0.28, begin: 140.5, index: 441 },
    { text: "la", duration: 0.28, begin: 140.75, index: 442 },
    { text: "mış", duration: 0.28, begin: 141.0, index: 443 },
    { text: "tı.", duration: 0.28, begin: 141.25, index: 444 },
    { text: " Öğ", duration: 0.28, begin: 142.5, index: 445 },
    { text: "re", duration: 0.28, begin: 142.75, index: 446 },
    { text: "nim", duration: 0.28, begin: 143.0, index: 447 },
    { text: " ha", duration: 0.28, begin: 143.25, index: 448 },
    { text: "ya", duration: 0.28, begin: 143.5, index: 449 },
    { text: "tım", duration: 0.28, begin: 143.75, index: 450 },
    { text: "da", duration: 0.28, begin: 144.0, index: 451 },
    { text: " ilk", duration: 0.28, begin: 144.75, index: 452 },
    { text: " de", duration: 0.28, begin: 145.0, index: 453 },
    { text: "fa", duration: 0.28, begin: 145.25, index: 454 },
    { text: " şe", duration: 0.28, begin: 145.5, index: 455 },
    { text: "ref", duration: 0.28, begin: 145.75, index: 456 },
    { text: " ü", duration: 0.28, begin: 146.0, index: 457 },
    { text: "ye", duration: 0.28, begin: 146.25, index: 458 },
    { text: "li", duration: 0.28, begin: 146.5, index: 459 },
    { text: "ği", duration: 0.28, begin: 146.75, index: 460 },
    { text: " ka", duration: 0.28, begin: 147.0, index: 461 },
    { text: "zan", duration: 0.28, begin: 147.25, index: 462 },
    { text: "dım.", duration: 0.28, begin: 147.5, index: 463 },
    { text: " Bu", duration: 0.28, begin: 148.5, index: 464 },
    { text: " be", duration: 0.28, begin: 148.75, index: 465 },
    { text: "nim", duration: 0.28, begin: 149.0, index: 466 },
    { text: " i", duration: 0.28, begin: 149.25, index: 467 },
    { text: "çin", duration: 0.28, begin: 149.5, index: 468 },
    { text: " i", duration: 0.28, begin: 149.75, index: 469 },
    { text: "na", duration: 0.28, begin: 150.0, index: 470 },
    { text: "nıl", duration: 0.28, begin: 150.25, index: 471 },
    { text: "maz", duration: 0.28, begin: 150.5, index: 472 },
    { text: " bir", duration: 0.28, begin: 150.75, index: 473 },
    { text: " şey", duration: 0.28, begin: 151.0, index: 474 },
    { text: "di.", duration: 0.28, begin: 151.25, index: 475 },
    { text: " Bay", duration: 0.28, begin: 152.5, index: 476 },
    { text: " Wash", duration: 0.28, begin: 152.75, index: 477 },
    { text: "ing", duration: 0.28, begin: 153.0, index: 478 },
    { text: "ton", duration: 0.28, begin: 153.25, index: 479 },
    { text: " ge", duration: 0.28, begin: 154.0, index: 480 },
    { text: "ri", duration: 0.28, begin: 154.25, index: 481 },
    { text: "le", duration: 0.28, begin: 154.5, index: 482 },
    { text: "miş", duration: 0.28, begin: 154.75, index: 483 },
    { text: " ze", duration: 0.28, begin: 155.0, index: 484 },
    { text: "ka", duration: 0.28, begin: 155.25, index: 485 },
    { text: " du", duration: 0.13, begin: 155.5, index: 486 },
    { text: "ru", duration: 0.13, begin: 155.75, index: 487 },
    { text: "mu", duration: 0.13, begin: 156.0, index: 488 },
    { text: "ma", duration: 0.13, begin: 156.25, index: 489 },
    { text: " rağ", duration: 0.13, begin: 156.5, index: 490 },
    { text: "men", duration: 0.13, begin: 156.75, index: 491 },
    { text: " ba", duration: 0.28, begin: 157.25, index: 492 },
    { text: "na", duration: 0.28, begin: 157.5, index: 493 },
    { text: " bü", duration: 0.28, begin: 157.75, index: 494 },
    { text: "yük", duration: 0.28, begin: 158.0, index: 495 },
    { text: " bir", duration: 0.28, begin: 158.25, index: 496 },
    { text: " viz", duration: 0.28, begin: 158.5, index: 497 },
    { text: "yon", duration: 0.28, begin: 158.75, index: 498 },
    { text: " ka", duration: 0.28, begin: 159.0, index: 499 },
    { text: "zan", duration: 0.28, begin: 159.25, index: 500 },
    { text: "dır", duration: 0.28, begin: 159.5, index: 501 },
    { text: "mış", duration: 0.28, begin: 159.75, index: 502 },
    { text: "tı.", duration: 0.28, begin: 160.0, index: 503 },
    { text: " Yıl", duration: 0.28, begin: 161.5, index: 504 },
    { text: "lar", duration: 0.28, begin: 161.75, index: 505 },
    { text: " son", duration: 0.28, begin: 162.0, index: 506 },
    { text: "ra,", duration: 0.28, begin: 162.25, index: 507 },
    { text: " po", duration: 0.28, begin: 163.2, index: 508 },
    { text: "pü", duration: 0.28, begin: 163.4, index: 509 },
    { text: "ler", duration: 0.28, begin: 163.6, index: 510 },
    { text: " de", duration: 0.28, begin: 163.8, index: 511 },
    { text: "re", duration: 0.28, begin: 164.0, index: 512 },
    { text: "ce", duration: 0.28, begin: 164.2, index: 513 },
    { text: "de", duration: 0.28, begin: 164.4, index: 514 },
    { text: " ün", duration: 0.28, begin: 164.6, index: 515 },
    { text: " ka", duration: 0.28, begin: 164.8, index: 516 },
    { text: "za", duration: 0.28, begin: 165.0, index: 517 },
    { text: "nan", duration: 0.28, begin: 165.2, index: 518 },
    { text: " bir", duration: 0.28, begin: 165.6, index: 519 },
    { text: " di", duration: 0.28, begin: 165.8, index: 520 },
    { text: "zi", duration: 0.28, begin: 166.0, index: 521 },
    { text: " ki", duration: 0.28, begin: 166.2, index: 522 },
    { text: "ta", duration: 0.28, begin: 166.4, index: 523 },
    { text: "bım", duration: 0.28, begin: 166.6, index: 524 },
    { text: " ol", duration: 0.28, begin: 166.8, index: 525 },
    { text: "du.", duration: 0.28, begin: 167.0, index: 526 },
    { text: " Yaz", duration: 0.28, begin: 168.4, index: 527 },
    { text: "dı", duration: 0.28, begin: 168.6, index: 528 },
    { text: "ğım", duration: 0.28, begin: 168.8, index: 529 },
    { text: " ba", duration: 0.28, begin: 169.0, index: 530 },
    { text: "zı", duration: 0.28, begin: 169.2, index: 531 },
    { text: " e", duration: 0.28, begin: 169.6, index: 532 },
    { text: "ser", duration: 0.28, begin: 169.8, index: 533 },
    { text: "ler", duration: 0.28, begin: 170.0, index: 534 },
    { text: " film", duration: 0.28, begin: 171.0, index: 535 },
    { text: " ha", duration: 0.28, begin: 171.2, index: 536 },
    { text: "li", duration: 0.28, begin: 171.4, index: 537 },
    { text: "ne", duration: 0.28, begin: 171.6, index: 538 },
    { text: " ge", duration: 0.28, begin: 171.8, index: 539 },
    { text: "ti", duration: 0.28, begin: 172.0, index: 540 },
    { text: "ril", duration: 0.28, begin: 172.2, index: 541 },
    { text: "di.", duration: 0.28, begin: 172.4, index: 542 },
    { text: " Bir", duration: 0.28, begin: 173.8, index: 543 },
    { text: " e", duration: 0.28, begin: 174.0, index: 544 },
    { text: "ği", duration: 0.28, begin: 174.2, index: 545 },
    { text: "tim", duration: 0.28, begin: 174.4, index: 546 },
    { text: " ka", duration: 0.28, begin: 174.6, index: 547 },
    { text: "na", duration: 0.28, begin: 174.8, index: 548 },
    { text: "lın", duration: 0.28, begin: 175.0, index: 549 },
    { text: "da,", duration: 0.28, begin: 175.2, index: 550 },
    { text: ' "Hak', duration: 0.28, begin: 176.2, index: 551 },
    { text: " Et", duration: 0.28, begin: 176.4, index: 552 },
    { text: "ti", duration: 0.28, begin: 176.6, index: 553 },
    { text: 'niz"', duration: 0.28, begin: 176.8, index: 554 },
    { text: " di", duration: 0.28, begin: 177.8, index: 555 },
    { text: "ye", duration: 0.28, begin: 178.0, index: 556 },
    { text: " bir", duration: 0.28, begin: 178.4, index: 557 },
    { text: " prog", duration: 0.28, begin: 178.6, index: 558 },
    { text: "ram", duration: 0.28, begin: 178.8, index: 559 },
    { text: " yap", duration: 0.28, begin: 179.0, index: 560 },
    { text: "ma", duration: 0.28, begin: 179.2, index: 561 },
    { text: "ya", duration: 0.28, begin: 179.4, index: 562 },
    { text: " baş", duration: 0.38, begin: 179.6, index: 563 },
    { text: "la", duration: 0.38, begin: 179.8, index: 564 },
    { text: "dım.", duration: 0.38, begin: 180.0, index: 565 },
    { text: " Bir", duration: 0.28, begin: 181.4, index: 566 },
    { text: " gün", duration: 0.28, begin: 181.6, index: 567 },
    { text: " prog", duration: 0.28, begin: 182.2, index: 568 },
    { text: "ram", duration: 0.28, begin: 182.4, index: 569 },
    { text: " a", duration: 0.28, begin: 182.6, index: 570 },
    { text: "ra", duration: 0.28, begin: 182.8, index: 571 },
    { text: "sın", duration: 0.28, begin: 183.0, index: 572 },
    { text: "da", duration: 0.28, begin: 183.2, index: 573 },
    { text: " bir", duration: 0.28, begin: 183.6, index: 574 },
    { text: " te", duration: 0.28, begin: 184.0, index: 575 },
    { text: "le", duration: 0.28, begin: 184.25, index: 576 },
    { text: "fon", duration: 0.28, begin: 184.5, index: 577 },
    { text: " gel", duration: 0.28, begin: 184.75, index: 578 },
    { text: "di:", duration: 0.28, begin: 185.0, index: 579 },
    { text: ' "Bay', duration: 0.28, begin: 186.5, index: 580 },
    { text: " Brown", duration: 0.28, begin: 186.75, index: 581 },
    { text: " i", duration: 0.28, begin: 187.0, index: 582 },
    { text: "le", duration: 0.28, begin: 187.25, index: 583 },
    { text: " gö", duration: 0.28, begin: 187.5, index: 584 },
    { text: "rü", duration: 0.28, begin: 187.75, index: 585 },
    { text: "şe", duration: 0.28, begin: 188.0, index: 586 },
    { text: "bi", duration: 0.28, begin: 188.25, index: 587 },
    { text: "lir", duration: 0.28, begin: 188.5, index: 588 },
    { text: " mi", duration: 0.28, begin: 188.75, index: 589 },
    { text: 'yim?"', duration: 0.28, begin: 189.0, index: 590 },
    { text: " Te", duration: 0.28, begin: 189.9, index: 591 },
    { text: "le", duration: 0.28, begin: 190.1, index: 592 },
    { text: "fon", duration: 0.28, begin: 190.3, index: 593 },
    { text: "da", duration: 0.28, begin: 190.5, index: 594 },
    { text: "ki", duration: 0.28, begin: 190.7, index: 595 },
    { text: " se", duration: 0.28, begin: 190.9, index: 596 },
    { text: "si", duration: 0.28, begin: 191.1, index: 597 },
    { text: " ta", duration: 0.28, begin: 191.3, index: 598 },
    { text: "nı", duration: 0.28, begin: 191.5, index: 599 },
    { text: "mış", duration: 0.28, begin: 191.7, index: 600 },
    { text: "tım.", duration: 0.28, begin: 191.9, index: 601 },
    { text: ' "Buy', duration: 0.28, begin: 193.0, index: 602 },
    { text: "run", duration: 0.28, begin: 193.25, index: 603 },
    { text: " Bay", duration: 0.28, begin: 193.5, index: 604 },
    { text: " Was", duration: 0.28, begin: 193.75, index: 605 },
    { text: "hing", duration: 0.28, begin: 194.0, index: 606 },
    { text: 'ton!"', duration: 0.28, begin: 194.25, index: 607 },
    { text: ' "Ba', duration: 0.28, begin: 195.25, index: 608 },
    { text: "şar", duration: 0.28, begin: 195.5, index: 609 },
    { text: "dın,", duration: 0.28, begin: 195.75, index: 610 },
    { text: " de", duration: 0.28, begin: 196.5, index: 611 },
    { text: "ğil", duration: 0.28, begin: 196.75, index: 612 },
    { text: ' mi?"', duration: 0.28, begin: 197.0, index: 613 },
    { text: ' "E', duration: 0.28, begin: 197.75, index: 614 },
    { text: "vet", duration: 0.28, begin: 198.0, index: 615 },
    { text: " e", duration: 0.28, begin: 198.25, index: 616 },
    { text: "fen", duration: 0.28, begin: 198.5, index: 617 },
    { text: "dim,", duration: 0.28, begin: 198.75, index: 618 },
    { text: " ba", duration: 0.28, begin: 199.5, index: 619 },
    { text: "şar", duration: 0.28, begin: 199.75, index: 620 },
    { text: 'dım..."', duration: 0.28, begin: 200.0, index: 621 },
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
                href="/dashboard/stories/hayallerinizden-vazgecmeyin"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
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
            src="/3-7.mp3"
            onEnded={handleAudioEnded}
            onLoadedMetadata={handleLoadedMetadata}
          />
        </div>

        {/* Story Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {renderTextSegments()}
        </div>
      </div>
    </div>
  );
}
