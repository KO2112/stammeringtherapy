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
    { text: "", duration: 0.154, begin: 0.5, index: 0 },

    // Title
    {
      text: "He",
      duration: 0.53,
      begin: 0.5,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "men",
      duration: 0.53,
      begin: 0.75,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " mi",
      duration: 0.53,
      begin: 1.0,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Ö",
      duration: 0.53,
      begin: 1.25,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "le",
      duration: 0.53,
      begin: 1.5,
      index: 5,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ce",
      duration: 0.53,
      begin: 1.75,
      index: 6,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ğim?",
      duration: 0.53,
      begin: 2.0,
      index: 7,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Yıl", duration: 0.53, begin: 3.0, index: 8 },
    { text: "lar", duration: 0.53, begin: 3.25, index: 9 },
    { text: " ön", duration: 0.53, begin: 3.5, index: 10 },
    { text: "ce", duration: 0.53, begin: 3.75, index: 11 },
    { text: " Stan", duration: 0.53, begin: 4.75, index: 12 },
    { text: "ford", duration: 0.53, begin: 5.0, index: 13 },
    { text: " Has", duration: 0.53, begin: 5.25, index: 14 },
    { text: "ta", duration: 0.53, begin: 5.5, index: 15 },
    { text: "ne", duration: 0.53, begin: 5.75, index: 16 },
    { text: "sin", duration: 0.53, begin: 6.0, index: 17 },
    { text: "'de", duration: 0.53, begin: 6.25, index: 18 },
    { text: " gö", duration: 0.53, begin: 7.25, index: 19 },
    { text: "nül", duration: 0.53, begin: 7.5, index: 20 },
    { text: "lü", duration: 0.53, begin: 7.75, index: 21 },
    { text: " o", duration: 0.53, begin: 8.0, index: 22 },
    { text: "la", duration: 0.53, begin: 8.25, index: 23 },
    { text: "rak", duration: 0.53, begin: 8.5, index: 24 },
    { text: " ça", duration: 0.53, begin: 8.75, index: 25 },
    { text: "lış", duration: 0.53, begin: 9.0, index: 26 },
    { text: "tı", duration: 0.53, begin: 9.25, index: 27 },
    { text: "ğım", duration: 0.53, begin: 9.5, index: 28 },
    { text: " za", duration: 0.53, begin: 9.75, index: 29 },
    { text: "man,", duration: 0.53, begin: 10.0, index: 30 },
    { text: " çok", duration: 0.53, begin: 11.25, index: 31 },
    { text: " cid", duration: 0.53, begin: 11.5, index: 32 },
    { text: "di", duration: 0.53, begin: 11.75, index: 33 },
    { text: " ve", duration: 0.53, begin: 12.0, index: 34 },
    { text: " az", duration: 0.53, begin: 12.25, index: 35 },
    { text: " rast", duration: 0.53, begin: 12.75, index: 36 },
    { text: "la", duration: 0.53, begin: 13.0, index: 37 },
    { text: "nan", duration: 0.53, begin: 13.25, index: 38 },
    { text: " bir", duration: 0.53, begin: 13.5, index: 39 },
    { text: " has", duration: 0.53, begin: 14.75, index: 40 },
    { text: "ta", duration: 0.53, begin: 15.0, index: 41 },
    { text: "lı", duration: 0.53, begin: 15.25, index: 42 },
    { text: "ğa", duration: 0.53, begin: 15.5, index: 43 },
    { text: " ya", duration: 0.53, begin: 15.75, index: 44 },
    { text: "ka", duration: 0.53, begin: 16.0, index: 45 },
    { text: "lan", duration: 0.53, begin: 16.25, index: 46 },
    { text: "mış", duration: 0.53, begin: 16.5, index: 47 },
    { text: " Li", duration: 0.53, begin: 17.25, index: 48 },
    { text: "za", duration: 0.53, begin: 17.5, index: 49 },
    { text: " a", duration: 0.53, begin: 17.75, index: 50 },
    { text: "dın", duration: 0.53, begin: 18.0, index: 51 },
    { text: "da", duration: 0.53, begin: 18.25, index: 52 },
    { text: " bir", duration: 0.53, begin: 18.75, index: 53 },
    { text: " kız", duration: 0.53, begin: 19.0, index: 54 },
    { text: " ta", duration: 0.53, begin: 19.25, index: 55 },
    { text: "nı", duration: 0.53, begin: 19.5, index: 56 },
    { text: "dım.", duration: 0.53, begin: 19.75, index: 57 },
    { text: " İ", duration: 0.48, begin: 21.0, index: 58 },
    { text: "yi", duration: 0.48, begin: 21.25, index: 59 },
    { text: "leş", duration: 0.48, begin: 21.5, index: 60 },
    { text: "me", duration: 0.48, begin: 21.75, index: 61 },
    { text: "si", duration: 0.48, begin: 22.0, index: 62 },
    { text: " i", duration: 0.53, begin: 22.25, index: 63 },
    { text: "çin", duration: 0.53, begin: 22.5, index: 64 },
    { text: " bir", duration: 0.53, begin: 23.25, index: 65 },
    { text: " tek", duration: 0.68, begin: 23.5, index: 66 },
    { text: " yol", duration: 0.68, begin: 23.75, index: 67 },
    { text: " var", duration: 0.68, begin: 24.0, index: 68 },
    { text: "dı.", duration: 0.68, begin: 24.25, index: 69 },
    { text: " Beş", duration: 0.53, begin: 25.75, index: 70 },
    { text: " ya", duration: 0.53, begin: 26.0, index: 71 },
    { text: "şın", duration: 0.53, begin: 26.25, index: 72 },
    { text: "da", duration: 0.53, begin: 26.5, index: 73 },
    { text: "ki", duration: 0.53, begin: 26.75, index: 74 },
    { text: " er", duration: 0.53, begin: 27.0, index: 75 },
    { text: "kek", duration: 0.53, begin: 27.25, index: 76 },
    { text: " kar", duration: 0.68, begin: 27.75, index: 77 },
    { text: "de", duration: 0.68, begin: 28.0, index: 78 },
    { text: "şin", duration: 0.68, begin: 28.25, index: 79 },
    { text: "den", duration: 0.68, begin: 28.5, index: 80 },
    { text: " kan", duration: 0.53, begin: 29.75, index: 81 },
    { text: " nak", duration: 0.53, begin: 30.0, index: 82 },
    { text: "li", duration: 0.53, begin: 30.25, index: 83 },
    { text: " ya", duration: 0.53, begin: 30.5, index: 84 },
    { text: "pıl", duration: 0.53, begin: 30.75, index: 85 },
    { text: "ma", duration: 0.53, begin: 31.0, index: 86 },
    { text: "sı", duration: 0.53, begin: 31.25, index: 87 },
    { text: " ge", duration: 0.53, begin: 31.75, index: 88 },
    { text: "re", duration: 0.53, begin: 32.0, index: 89 },
    { text: "ki", duration: 0.53, begin: 32.25, index: 90 },
    { text: "yor", duration: 0.53, begin: 32.5, index: 91 },
    { text: "du.", duration: 0.53, begin: 32.75, index: 92 },
    { text: " Er", duration: 0.53, begin: 34.25, index: 93 },
    { text: "kek", duration: 0.53, begin: 34.5, index: 94 },
    { text: " kar", duration: 0.53, begin: 34.75, index: 95 },
    { text: "de", duration: 0.53, begin: 35.0, index: 96 },
    { text: "şi", duration: 0.53, begin: 35.25, index: 97 },
    { text: " ay", duration: 0.53, begin: 36.5, index: 98 },
    { text: "nı", duration: 0.53, begin: 36.75, index: 99 },
    { text: " has", duration: 0.53, begin: 37.0, index: 100 },
    { text: "ta", duration: 0.53, begin: 37.25, index: 101 },
    { text: "lı", duration: 0.53, begin: 37.5, index: 102 },
    { text: "ğın", duration: 0.53, begin: 37.75, index: 103 },
    { text: " üs", duration: 0.53, begin: 38.0, index: 104 },
    { text: "te", duration: 0.53, begin: 38.25, index: 105 },
    { text: "sin", duration: 0.53, begin: 38.5, index: 106 },
    { text: "den", duration: 0.53, begin: 38.75, index: 107 },
    { text: " gel", duration: 0.53, begin: 39.25, index: 108 },
    { text: "miş", duration: 0.53, begin: 39.5, index: 109 },
    { text: "ti", duration: 0.53, begin: 39.75, index: 110 },
    { text: " ve", duration: 0.53, begin: 41.25, index: 111 },
    { text: " vü", duration: 0.53, begin: 41.5, index: 112 },
    { text: "cu", duration: 0.53, begin: 41.75, index: 113 },
    { text: "dun", duration: 0.53, begin: 42.0, index: 114 },
    { text: "da", duration: 0.53, begin: 42.25, index: 115 },
    { text: " has", duration: 0.53, begin: 42.5, index: 116 },
    { text: "ta", duration: 0.53, begin: 42.75, index: 117 },
    { text: "lı", duration: 0.53, begin: 43.0, index: 118 },
    { text: "ğı", duration: 0.53, begin: 43.25, index: 119 },
    { text: " ye", duration: 0.53, begin: 43.5, index: 120 },
    { text: "ne", duration: 0.53, begin: 43.75, index: 121 },
    { text: "bi", duration: 0.53, begin: 44.0, index: 122 },
    { text: "le", duration: 0.53, begin: 44.25, index: 123 },
    { text: "cek", duration: 0.53, begin: 44.5, index: 124 },
    { text: " an", duration: 0.53, begin: 45.5, index: 125 },
    { text: "ti", duration: 0.53, begin: 45.75, index: 126 },
    { text: "kor", duration: 0.53, begin: 46.0, index: 127 },
    { text: "lar", duration: 0.53, begin: 46.25, index: 128 },
    { text: " o", duration: 0.68, begin: 46.5, index: 129 },
    { text: "luş", duration: 0.68, begin: 46.75, index: 130 },
    { text: "muş", duration: 0.68, begin: 47.0, index: 131 },
    { text: "tu.", duration: 0.68, begin: 47.25, index: 132 },
    { text: " Dok", duration: 0.53, begin: 48.75, index: 133 },
    { text: "tor", duration: 0.53, begin: 49.0, index: 134 },
    { text: " bu", duration: 0.53, begin: 50.25, index: 135 },
    { text: " du", duration: 0.53, begin: 50.5, index: 136 },
    { text: "ru", duration: 0.53, begin: 50.75, index: 137 },
    { text: "mu", duration: 0.53, begin: 51.0, index: 138 },
    { text: " Li", duration: 0.53, begin: 51.25, index: 139 },
    { text: "za'", duration: 0.53, begin: 51.5, index: 140 },
    { text: "nın", duration: 0.53, begin: 51.75, index: 141 },
    { text: " er", duration: 0.28, begin: 52.75, index: 142 },
    { text: "kek", duration: 0.28, begin: 53.0, index: 143 },
    { text: " kar", duration: 0.53, begin: 53.25, index: 144 },
    { text: "de", duration: 0.53, begin: 53.5, index: 145 },
    { text: "şi", duration: 0.53, begin: 53.75, index: 146 },
    { text: "ne", duration: 0.53, begin: 54.0, index: 147 },
    { text: " a", duration: 0.53, begin: 54.25, index: 148 },
    { text: "çık", duration: 0.53, begin: 54.5, index: 149 },
    { text: "la", duration: 0.53, begin: 54.75, index: 150 },
    { text: "dı", duration: 0.53, begin: 55.0, index: 151 },
    { text: " ve", duration: 0.53, begin: 56.0, index: 152 },
    { text: " o", duration: 0.53, begin: 56.25, index: 153 },
    { text: "na", duration: 0.53, begin: 56.5, index: 154 },
    { text: " ab", duration: 0.53, begin: 57.5, index: 155 },
    { text: "la", duration: 0.53, begin: 57.75, index: 156 },
    { text: "sı", duration: 0.53, begin: 58.0, index: 157 },
    { text: "na", duration: 0.53, begin: 58.25, index: 158 },
    { text: " kan", duration: 0.53, begin: 58.5, index: 159 },
    { text: " ver", duration: 0.53, begin: 58.75, index: 160 },
    { text: "me", duration: 0.53, begin: 59.0, index: 161 },
    { text: "yi", duration: 0.53, begin: 59.25, index: 162 },
    { text: " is", duration: 0.53, begin: 59.5, index: 163 },
    { text: "te", duration: 0.53, begin: 59.75, index: 164 },
    { text: "yip", duration: 0.53, begin: 60.0, index: 165 },
    { text: " is", duration: 0.53, begin: 61.0, index: 166 },
    { text: "te", duration: 0.53, begin: 61.25, index: 167 },
    { text: "me", duration: 0.53, begin: 61.5, index: 168 },
    { text: "di", duration: 0.53, begin: 61.75, index: 169 },
    { text: "ği", duration: 0.53, begin: 62.0, index: 170 },
    { text: "ni", duration: 0.53, begin: 62.25, index: 171 },
    { text: " sor", duration: 0.53, begin: 62.5, index: 172 },
    { text: "du.", duration: 0.53, begin: 62.75, index: 173 },
    { text: " Kü", duration: 0.53, begin: 64.0, index: 174 },
    { text: "çük", duration: 0.53, begin: 64.25, index: 175 },
    { text: " ço", duration: 0.53, begin: 64.5, index: 176 },
    { text: "cuk", duration: 0.53, begin: 64.75, index: 177 },
    { text: " bir", duration: 0.53, begin: 66.0, index: 178 },
    { text: " an", duration: 0.53, begin: 66.25, index: 179 },
    { text: " te", duration: 0.53, begin: 66.75, index: 180 },
    { text: "red", duration: 0.53, begin: 67.0, index: 181 },
    { text: "düt", duration: 0.53, begin: 67.25, index: 182 },
    { text: " et", duration: 0.53, begin: 67.5, index: 183 },
    { text: "ti", duration: 0.53, begin: 67.75, index: 184 },
    { text: " ve", duration: 0.53, begin: 68.0, index: 185 },
    { text: " de", duration: 0.53, begin: 69.25, index: 186 },
    { text: "rin", duration: 0.53, begin: 69.5, index: 187 },
    { text: " bir", duration: 0.68, begin: 69.75, index: 188 },
    { text: " ne", duration: 0.68, begin: 70.0, index: 189 },
    { text: "fes", duration: 0.68, begin: 70.25, index: 190 },
    { text: " al", duration: 0.68, begin: 70.75, index: 191 },
    { text: "dık", duration: 0.68, begin: 71.0, index: 192 },
    { text: "tan", duration: 0.68, begin: 71.25, index: 193 },
    { text: " son", duration: 0.68, begin: 71.5, index: 194 },
    { text: "ra;", duration: 0.68, begin: 71.75, index: 195 },
    { text: " E", duration: 0.53, begin: 73.25, index: 196 },
    { text: "vet,", duration: 0.53, begin: 73.5, index: 197 },
    { text: " e", duration: 0.53, begin: 74.75, index: 198 },
    { text: "ğer", duration: 0.53, begin: 75.0, index: 199 },
    { text: " Li", duration: 0.53, begin: 75.25, index: 200 },
    { text: "za", duration: 0.53, begin: 75.5, index: 201 },
    { text: " kur", duration: 0.53, begin: 75.75, index: 202 },
    { text: "tu", duration: 0.53, begin: 76.0, index: 203 },
    { text: "la", duration: 0.53, begin: 76.25, index: 204 },
    { text: "cak", duration: 0.53, begin: 76.5, index: 205 },
    { text: "sa", duration: 0.53, begin: 76.75, index: 206 },
    { text: " ve", duration: 0.53, begin: 77.0, index: 207 },
    { text: "ri", duration: 0.53, begin: 77.25, index: 208 },
    { text: "rim", duration: 0.53, begin: 77.5, index: 209 },
    { text: " de", duration: 0.28, begin: 78.5, index: 210 },
    { text: "di.", duration: 0.28, begin: 78.75, index: 211 },
    { text: " Kan", duration: 0.53, begin: 79.75, index: 212 },
    { text: " nak", duration: 0.53, begin: 80.0, index: 213 },
    { text: "li", duration: 0.53, begin: 80.25, index: 214 },
    { text: " ya", duration: 0.53, begin: 80.5, index: 215 },
    { text: "pı", duration: 0.53, begin: 80.75, index: 216 },
    { text: "lır", duration: 0.53, begin: 81.0, index: 217 },
    { text: "ken,", duration: 0.53, begin: 81.25, index: 218 },
    { text: " kü", duration: 0.53, begin: 82.25, index: 219 },
    { text: "çük", duration: 0.53, begin: 82.5, index: 220 },
    { text: " ço", duration: 0.53, begin: 82.75, index: 221 },
    { text: "cuk", duration: 0.53, begin: 83.0, index: 222 },
    { text: " ab", duration: 0.53, begin: 84.0, index: 223 },
    { text: "la", duration: 0.53, begin: 84.25, index: 224 },
    { text: "sı", duration: 0.53, begin: 84.5, index: 225 },
    { text: "nın", duration: 0.53, begin: 84.75, index: 226 },
    { text: " ya", duration: 0.53, begin: 85.0, index: 227 },
    { text: "nın", duration: 0.53, begin: 85.25, index: 228 },
    { text: "da", duration: 0.53, begin: 85.5, index: 229 },
    { text: "ki", duration: 0.53, begin: 85.75, index: 230 },
    { text: " ya", duration: 0.53, begin: 86.0, index: 231 },
    { text: "tak", duration: 0.53, begin: 86.25, index: 232 },
    { text: "ta", duration: 0.53, begin: 86.5, index: 233 },
    { text: " ya", duration: 0.53, begin: 86.85, index: 234 },
    { text: "tı", duration: 0.53, begin: 87.1, index: 235 },
    { text: "yor", duration: 0.53, begin: 87.35, index: 236 },
    { text: " ve", duration: 0.53, begin: 87.7, index: 237 },
    { text: " ab", duration: 0.53, begin: 88.75, index: 238 },
    { text: "la", duration: 0.53, begin: 89.0, index: 239 },
    { text: "sı", duration: 0.53, begin: 89.25, index: 240 },
    { text: "nın", duration: 0.53, begin: 89.5, index: 241 },
    { text: " ya", duration: 0.53, begin: 89.75, index: 242 },
    { text: "nak", duration: 0.53, begin: 90.0, index: 243 },
    { text: "la", duration: 0.53, begin: 90.25, index: 244 },
    { text: "rı", duration: 0.53, begin: 90.5, index: 245 },
    { text: "na", duration: 0.53, begin: 90.75, index: 246 },
    { text: " renk", duration: 0.53, begin: 91.0, index: 247 },
    { text: " gel", duration: 0.68, begin: 91.25, index: 248 },
    { text: "dik", duration: 0.68, begin: 91.5, index: 249 },
    { text: "çe", duration: 0.68, begin: 91.75, index: 250 },
    { text: " bi", duration: 0.53, begin: 93.0, index: 251 },
    { text: "zim", duration: 0.53, begin: 93.25, index: 252 },
    { text: "le", duration: 0.53, begin: 93.5, index: 253 },
    { text: " bir", duration: 0.53, begin: 93.75, index: 254 },
    { text: "lik", duration: 0.53, begin: 94.0, index: 255 },
    { text: "te", duration: 0.53, begin: 94.25, index: 256 },
    { text: " gü", duration: 0.78, begin: 94.5, index: 257 },
    { text: "lüm", duration: 0.78, begin: 94.75, index: 258 },
    { text: "sü", duration: 0.78, begin: 95.0, index: 259 },
    { text: "yor", duration: 0.78, begin: 95.25, index: 260 },
    { text: "du.", duration: 0.78, begin: 95.5, index: 261 },
    { text: " Son", duration: 0.53, begin: 97.25, index: 262 },
    { text: "ra", duration: 0.53, begin: 97.5, index: 263 },
    { text: " yü", duration: 0.53, begin: 97.75, index: 264 },
    { text: "zü", duration: 0.53, begin: 98.0, index: 265 },
    { text: " sa", duration: 0.53, begin: 98.25, index: 266 },
    { text: "rar", duration: 0.53, begin: 98.5, index: 267 },
    { text: "dı", duration: 0.53, begin: 98.75, index: 268 },
    { text: " ve", duration: 0.53, begin: 99.0, index: 269 },
    { text: " yü", duration: 0.53, begin: 100.0, index: 270 },
    { text: "zün", duration: 0.53, begin: 100.25, index: 271 },
    { text: "de", duration: 0.53, begin: 100.5, index: 272 },
    { text: "ki", duration: 0.53, begin: 100.75, index: 273 },
    { text: " gü", duration: 0.53, begin: 101.0, index: 274 },
    { text: "lüm", duration: 0.53, begin: 101.25, index: 275 },
    { text: "se", duration: 0.53, begin: 101.5, index: 276 },
    { text: "me", duration: 0.53, begin: 101.75, index: 277 },
    { text: " kay", duration: 0.53, begin: 102.25, index: 278 },
    { text: "bol", duration: 0.53, begin: 102.5, index: 279 },
    { text: "du.", duration: 0.53, begin: 102.75, index: 280 },
    { text: " Ba", duration: 0.48, begin: 104.5, index: 281 },
    { text: "şı", duration: 0.48, begin: 104.75, index: 282 },
    { text: "nı", duration: 0.48, begin: 105.0, index: 283 },
    { text: " kal", duration: 0.48, begin: 105.25, index: 284 },
    { text: "dı", duration: 0.48, begin: 105.5, index: 285 },
    { text: "rıp", duration: 0.48, begin: 105.75, index: 286 },
    { text: " dok", duration: 0.53, begin: 106.0, index: 287 },
    { text: "to", duration: 0.53, begin: 106.25, index: 288 },
    { text: "ra", duration: 0.53, begin: 106.5, index: 289 },
    { text: " bak", duration: 0.78, begin: 106.75, index: 290 },
    { text: "tık", duration: 0.78, begin: 107.0, index: 291 },
    { text: "tan", duration: 0.78, begin: 107.25, index: 292 },
    { text: " son", duration: 0.53, begin: 108.25, index: 293 },
    { text: "ra", duration: 0.53, begin: 108.5, index: 294 },
    { text: " tit", duration: 0.78, begin: 109.25, index: 295 },
    { text: "re", duration: 0.78, begin: 109.5, index: 296 },
    { text: "yen", duration: 0.78, begin: 109.75, index: 297 },
    { text: " bir", duration: 0.78, begin: 110.0, index: 298 },
    { text: " ses", duration: 0.78, begin: 110.25, index: 299 },
    { text: "le;", duration: 0.78, begin: 110.5, index: 300 },
    { text: " He", duration: 0.78, begin: 112.0, index: 301 },
    { text: "men", duration: 0.78, begin: 112.25, index: 302 },
    { text: " mi", duration: 0.78, begin: 112.5, index: 303 },
    { text: " ö", duration: 0.78, begin: 112.75, index: 304 },
    { text: "le", duration: 0.78, begin: 113.0, index: 305 },
    { text: "ce", duration: 0.78, begin: 113.25, index: 306 },
    { text: "ğim?", duration: 0.78, begin: 113.5, index: 307 },
    { text: " di", duration: 0.28, begin: 114.5, index: 308 },
    { text: "ye", duration: 0.28, begin: 114.75, index: 309 },
    { text: " sor", duration: 0.28, begin: 115.0, index: 310 },
    { text: "du.", duration: 0.28, begin: 115.25, index: 311 },
    { text: " An", duration: 0.28, begin: 116.5, index: 312 },
    { text: "la", duration: 0.28, begin: 116.75, index: 313 },
    { text: "dık", duration: 0.28, begin: 117.0, index: 314 },
    { text: " ki,", duration: 0.28, begin: 117.25, index: 315 },
    { text: " ya", duration: 0.53, begin: 118.0, index: 316 },
    { text: "şı", duration: 0.53, begin: 118.25, index: 317 },
    { text: " çok", duration: 0.53, begin: 118.5, index: 318 },
    { text: " kü", duration: 0.53, begin: 118.75, index: 319 },
    { text: "çük", duration: 0.53, begin: 119.0, index: 320 },
    { text: " ol", duration: 0.53, begin: 119.25, index: 321 },
    { text: "du", duration: 0.53, begin: 119.5, index: 322 },
    { text: "ğu", duration: 0.53, begin: 119.75, index: 323 },
    { text: " i", duration: 0.53, begin: 120.0, index: 324 },
    { text: "çin,", duration: 0.53, begin: 120.25, index: 325 },
    { text: " dok", duration: 0.53, begin: 121.25, index: 326 },
    { text: "to", duration: 0.53, begin: 121.5, index: 327 },
    { text: "run", duration: 0.53, begin: 121.75, index: 328 },
    { text: " söz", duration: 0.53, begin: 122.0, index: 329 },
    { text: "le", duration: 0.53, begin: 122.25, index: 330 },
    { text: "ri", duration: 0.53, begin: 122.5, index: 331 },
    { text: "ni", duration: 0.53, begin: 122.75, index: 332 },
    { text: " yan", duration: 0.53, begin: 123.0, index: 333 },
    { text: "lış", duration: 0.53, begin: 123.25, index: 334 },
    { text: " an", duration: 0.53, begin: 123.5, index: 335 },
    { text: "la", duration: 0.53, begin: 123.75, index: 336 },
    { text: "mış", duration: 0.53, begin: 124.0, index: 337 },
    { text: " ve", duration: 0.53, begin: 125.0, index: 338 },
    { text: " ka", duration: 0.53, begin: 125.75, index: 339 },
    { text: "nı", duration: 0.53, begin: 126.0, index: 340 },
    { text: "nın", duration: 0.53, begin: 126.25, index: 341 },
    { text: " tü", duration: 0.53, begin: 126.5, index: 342 },
    { text: "mü", duration: 0.53, begin: 126.75, index: 343 },
    { text: "nü", duration: 0.53, begin: 127.0, index: 344 },
    { text: " ab", duration: 0.53, begin: 128.0, index: 345 },
    { text: "la", duration: 0.53, begin: 128.25, index: 346 },
    { text: "sı", duration: 0.53, begin: 128.5, index: 347 },
    { text: "na", duration: 0.53, begin: 128.75, index: 348 },
    { text: " ver", duration: 0.53, begin: 129.0, index: 349 },
    { text: "me", duration: 0.53, begin: 129.25, index: 350 },
    { text: "si", duration: 0.53, begin: 129.5, index: 351 },
    { text: " ge", duration: 0.43, begin: 129.75, index: 352 },
    { text: "rek", duration: 0.43, begin: 130.0, index: 353 },
    { text: "ti", duration: 0.43, begin: 130.25, index: 354 },
    { text: "ği", duration: 0.43, begin: 130.5, index: 355 },
    { text: "ni", duration: 0.43, begin: 130.75, index: 356 },
    { text: " dü", duration: 0.53, begin: 131.0, index: 357 },
    { text: "şü", duration: 0.53, begin: 131.25, index: 358 },
    { text: "nüp", duration: 0.53, begin: 131.5, index: 359 },
    { text: " ö", duration: 0.53, begin: 132.0, index: 360 },
    { text: "le", duration: 0.53, begin: 132.25, index: 361 },
    { text: "ce", duration: 0.53, begin: 132.5, index: 362 },
    { text: "ği", duration: 0.53, begin: 132.75, index: 363 },
    { text: "ni", duration: 0.53, begin: 133.0, index: 364 },
    { text: " san", duration: 0.53, begin: 133.25, index: 365 },
    { text: "ma", duration: 0.53, begin: 133.5, index: 366 },
    { text: "sı", duration: 0.53, begin: 133.75, index: 367 },
    { text: "na", duration: 0.53, begin: 134.0, index: 368 },
    { text: " rağ", duration: 0.68, begin: 134.25, index: 369 },
    { text: "men", duration: 0.68, begin: 134.5, index: 370 },
    { text: " tek", duration: 0.68, begin: 135.5, index: 371 },
    { text: "li", duration: 0.68, begin: 135.75, index: 372 },
    { text: "fi", duration: 0.68, begin: 136.0, index: 373 },
    { text: " ka", duration: 0.68, begin: 136.5, index: 374 },
    { text: "bul", duration: 0.68, begin: 136.75, index: 375 },
    { text: " et", duration: 0.68, begin: 137.0, index: 376 },
    { text: "miş", duration: 0.68, begin: 137.25, index: 377 },
    { text: "ti.", duration: 0.68, begin: 137.5, index: 378 },
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
                href="/dashboard/stories/zehir"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/sirkin-kapisindan-dondugum-gece"
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
            src="/2-3.mp3"
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
