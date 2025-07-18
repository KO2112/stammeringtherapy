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
      text: "Eins",
      duration: 0.38,
      begin: 0.5,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "tein",
      duration: 0.38,
      begin: 1.0,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " ve",
      duration: 0.38,
      begin: 1.25,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Şo",
      duration: 0.38,
      begin: 1.5,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "fö",
      duration: 0.28,
      begin: 1.75,
      index: 5,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "rü",
      duration: 0.28,
      begin: 2.0,
      index: 6,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Eins", duration: 0.28, begin: 3.0, index: 7 },
    { text: "tein", duration: 0.28, begin: 3.25, index: 8 },
    { text: " kon", duration: 0.28, begin: 3.75, index: 9 },
    { text: "fe", duration: 0.28, begin: 4.0, index: 10 },
    { text: "rans", duration: 0.28, begin: 4.25, index: 11 },
    { text: "la", duration: 0.28, begin: 4.5, index: 12 },
    { text: "rı", duration: 0.28, begin: 4.75, index: 13 },
    { text: "na", duration: 0.28, begin: 5.0, index: 14 },
    { text: " hep", duration: 0.18, begin: 5.25, index: 15 },
    { text: " ö", duration: 0.18, begin: 5.5, index: 16 },
    { text: "zel", duration: 0.18, begin: 5.75, index: 17 },
    { text: " şo", duration: 0.18, begin: 6.0, index: 18 },
    { text: "fö", duration: 0.18, begin: 6.25, index: 19 },
    { text: "rü", duration: 0.18, begin: 6.5, index: 20 },
    { text: " i", duration: 0.28, begin: 6.7, index: 21 },
    { text: "le", duration: 0.28, begin: 6.9, index: 22 },
    { text: " gi", duration: 0.28, begin: 7.1, index: 23 },
    { text: "der", duration: 0.28, begin: 7.3, index: 24 },
    { text: "di.", duration: 0.28, begin: 7.5, index: 25 },
    { text: " Yi", duration: 0.28, begin: 8.5, index: 26 },
    { text: "ne", duration: 0.28, begin: 8.75, index: 27 },
    { text: " bir", duration: 0.28, begin: 9.0, index: 28 },
    { text: " kon", duration: 0.28, begin: 9.25, index: 29 },
    { text: "fe", duration: 0.28, begin: 9.5, index: 30 },
    { text: "ran", duration: 0.28, begin: 9.75, index: 31 },
    { text: "sa", duration: 0.28, begin: 10.0, index: 32 },
    { text: " git", duration: 0.28, begin: 10.25, index: 33 },
    { text: "mek", duration: 0.28, begin: 10.5, index: 34 },
    { text: " ü", duration: 0.28, begin: 10.75, index: 35 },
    { text: "ze", duration: 0.28, begin: 11.0, index: 36 },
    { text: "re", duration: 0.28, begin: 11.25, index: 37 },
    { text: " yo", duration: 0.28, begin: 11.75, index: 38 },
    { text: "la", duration: 0.28, begin: 12.0, index: 39 },
    { text: " çık", duration: 0.28, begin: 12.25, index: 40 },
    { text: "tık", duration: 0.28, begin: 12.5, index: 41 },
    { text: "la", duration: 0.28, begin: 12.75, index: 42 },
    { text: "rı", duration: 0.28, begin: 13.0, index: 43 },
    { text: " bir", duration: 0.28, begin: 13.25, index: 44 },
    { text: " gün,", duration: 0.28, begin: 13.5, index: 45 },
    { text: " şo", duration: 0.28, begin: 14.25, index: 46 },
    { text: "fö", duration: 0.28, begin: 14.5, index: 47 },
    { text: "rü", duration: 0.28, begin: 14.75, index: 48 },
    { text: " Eins", duration: 0.28, begin: 15.0, index: 49 },
    { text: "tein", duration: 0.28, begin: 15.25, index: 50 },
    { text: "'a;", duration: 0.28, begin: 15.5, index: 51 },
    { text: ' "E', duration: 0.28, begin: 16.5, index: 52 },
    { text: "fen", duration: 0.28, begin: 16.75, index: 53 },
    { text: "dim,", duration: 0.28, begin: 17.0, index: 54 },
    { text: " u", duration: 0.28, begin: 17.75, index: 55 },
    { text: "zun", duration: 0.28, begin: 18.0, index: 56 },
    { text: " za", duration: 0.28, begin: 18.5, index: 57 },
    { text: "man", duration: 0.28, begin: 18.75, index: 58 },
    { text: "dır", duration: 0.28, begin: 19.0, index: 59 },
    { text: " siz", duration: 0.28, begin: 19.5, index: 60 },
    { text: " ko", duration: 0.28, begin: 19.75, index: 61 },
    { text: "nuş", duration: 0.28, begin: 20.0, index: 62 },
    { text: "ma", duration: 0.28, begin: 20.25, index: 63 },
    { text: "nı", duration: 0.28, begin: 20.5, index: 64 },
    { text: "zı", duration: 0.28, begin: 20.75, index: 65 },
    { text: " ya", duration: 0.28, begin: 21.0, index: 66 },
    { text: "par", duration: 0.28, begin: 21.25, index: 67 },
    { text: "ken", duration: 0.28, begin: 21.5, index: 68 },
    { text: " ben", duration: 0.1, begin: 22.25, index: 69 },
    { text: "de", duration: 0.1, begin: 22.5, index: 70 },
    { text: " ar", duration: 0.1, begin: 22.75, index: 71 },
    { text: "ka", duration: 0.1, begin: 22.95, index: 72 },
    { text: " sı", duration: 0.1, begin: 23.15, index: 73 },
    { text: "ra", duration: 0.1, begin: 23.35, index: 74 },
    { text: "lar", duration: 0.1, begin: 23.55, index: 75 },
    { text: "da", duration: 0.1, begin: 23.75, index: 76 },
    { text: " o", duration: 0.1, begin: 23.95, index: 77 },
    { text: "tu", duration: 0.1, begin: 24.15, index: 78 },
    { text: "rup", duration: 0.1, begin: 24.35, index: 79 },
    { text: " si", duration: 0.1, begin: 24.75, index: 80 },
    { text: "zi", duration: 0.1, begin: 24.95, index: 81 },
    { text: " din", duration: 0.1, begin: 25.15, index: 82 },
    { text: "li", duration: 0.1, begin: 25.35, index: 83 },
    { text: "yo", duration: 0.1, begin: 25.55, index: 84 },
    { text: "rum", duration: 0.1, begin: 25.75, index: 85 },
    { text: " ve", duration: 0.28, begin: 26.55, index: 86 },
    { text: " ar", duration: 0.28, begin: 26.75, index: 87 },
    { text: "tık", duration: 0.28, begin: 26.95, index: 88 },
    { text: " ne", duration: 0.28, begin: 27.35, index: 89 },
    { text: "re", duration: 0.28, begin: 27.55, index: 90 },
    { text: "dey", duration: 0.28, begin: 27.75, index: 91 },
    { text: "se", duration: 0.28, begin: 27.95, index: 92 },
    { text: " söy", duration: 0.28, begin: 28.35, index: 93 },
    { text: "le", duration: 0.28, begin: 28.55, index: 94 },
    { text: "ye", duration: 0.28, begin: 28.75, index: 95 },
    { text: "ce", duration: 0.28, begin: 28.95, index: 96 },
    { text: "ği", duration: 0.28, begin: 29.15, index: 97 },
    { text: "niz", duration: 0.28, begin: 29.35, index: 98 },
    { text: " her", duration: 0.28, begin: 29.75, index: 99 },
    { text: "şe", duration: 0.28, begin: 29.95, index: 100 },
    { text: "yi,", duration: 0.28, begin: 30.15, index: 101 },
    { text: " ke", duration: 0.28, begin: 30.95, index: 102 },
    { text: "li", duration: 0.28, begin: 31.15, index: 103 },
    { text: "me", duration: 0.28, begin: 31.35, index: 104 },
    { text: "si", duration: 0.28, begin: 31.55, index: 105 },
    { text: " ke", duration: 0.28, begin: 31.75, index: 106 },
    { text: "li", duration: 0.28, begin: 31.95, index: 107 },
    { text: "me", duration: 0.28, begin: 32.15, index: 108 },
    { text: "si", duration: 0.28, begin: 32.35, index: 109 },
    { text: "ne", duration: 0.28, begin: 32.55, index: 110 },
    { text: " bi", duration: 0.28, begin: 32.95, index: 111 },
    { text: "li", duration: 0.28, begin: 33.15, index: 112 },
    { text: "yo", duration: 0.28, begin: 33.35, index: 113 },
    { text: 'rum."', duration: 0.28, begin: 33.55, index: 114 },
    { text: " de", duration: 0.28, begin: 34.15, index: 115 },
    { text: "di.", duration: 0.28, begin: 34.35, index: 116 },
    { text: " Eins", duration: 0.28, begin: 35.35, index: 117 },
    { text: "tein", duration: 0.28, begin: 35.55, index: 118 },
    { text: " gü", duration: 0.28, begin: 36.15, index: 119 },
    { text: "lüm", duration: 0.28, begin: 36.35, index: 120 },
    { text: "se", duration: 0.28, begin: 36.55, index: 121 },
    { text: "ye", duration: 0.28, begin: 36.75, index: 122 },
    { text: "rek", duration: 0.28, begin: 36.95, index: 123 },
    { text: " o", duration: 0.28, begin: 37.35, index: 124 },
    { text: "na", duration: 0.28, begin: 37.55, index: 125 },
    { text: " bir", duration: 0.28, begin: 37.75, index: 126 },
    { text: " ö", duration: 0.28, begin: 38.35, index: 127 },
    { text: "ne", duration: 0.28, begin: 38.55, index: 128 },
    { text: "ri", duration: 0.28, begin: 38.75, index: 129 },
    { text: "de", duration: 0.28, begin: 38.95, index: 130 },
    { text: " bu", duration: 0.28, begin: 39.15, index: 131 },
    { text: "lun", duration: 0.28, begin: 39.35, index: 132 },
    { text: "du:", duration: 0.28, begin: 39.55, index: 133 },
    { text: ' "Pe', duration: 0.28, begin: 40.55, index: 134 },
    { text: "ki,", duration: 0.28, begin: 40.75, index: 135 },
    { text: " şim", duration: 0.28, begin: 41.55, index: 136 },
    { text: "di", duration: 0.28, begin: 41.75, index: 137 },
    { text: " gi", duration: 0.28, begin: 41.95, index: 138 },
    { text: "de", duration: 0.28, begin: 42.15, index: 139 },
    { text: "ce", duration: 0.28, begin: 42.35, index: 140 },
    { text: "ği", duration: 0.28, begin: 42.55, index: 141 },
    { text: "miz", duration: 0.28, begin: 42.75, index: 142 },
    { text: " yer", duration: 0.28, begin: 43.15, index: 143 },
    { text: "de", duration: 0.28, begin: 43.35, index: 144 },
    { text: " be", duration: 0.28, begin: 43.75, index: 145 },
    { text: "ni", duration: 0.28, begin: 43.95, index: 146 },
    { text: " hiç", duration: 0.28, begin: 44.15, index: 147 },
    { text: " ta", duration: 0.28, begin: 44.35, index: 148 },
    { text: "nı", duration: 0.28, begin: 44.55, index: 149 },
    { text: "mı", duration: 0.28, begin: 44.75, index: 150 },
    { text: "yor", duration: 0.28, begin: 44.95, index: 151 },
    { text: 'lar."', duration: 0.28, begin: 45.15, index: 152 },
    { text: " de", duration: 0.28, begin: 45.95, index: 153 },
    { text: "di.", duration: 0.28, begin: 46.15, index: 154 },
    { text: ' "O', duration: 0.28, begin: 46.95, index: 155 },
    { text: " hal", duration: 0.28, begin: 47.15, index: 156 },
    { text: "de,", duration: 0.28, begin: 47.35, index: 157 },
    { text: " bu", duration: 0.28, begin: 48.15, index: 158 },
    { text: "gün", duration: 0.28, begin: 48.35, index: 159 },
    { text: " pal", duration: 0.28, begin: 48.95, index: 160 },
    { text: "to", duration: 0.28, begin: 49.15, index: 161 },
    { text: " ve", duration: 0.28, begin: 49.35, index: 162 },
    { text: " şap", duration: 0.28, begin: 49.75, index: 163 },
    { text: "ka", duration: 0.28, begin: 49.95, index: 164 },
    { text: "la", duration: 0.28, begin: 50.15, index: 165 },
    { text: "rı", duration: 0.28, begin: 50.35, index: 166 },
    { text: "mı", duration: 0.28, begin: 50.55, index: 167 },
    { text: "zı", duration: 0.28, begin: 50.75, index: 168 },
    { text: " de", duration: 0.28, begin: 51.15, index: 169 },
    { text: "ğiş", duration: 0.28, begin: 51.35, index: 170 },
    { text: "ti", duration: 0.28, begin: 51.55, index: 171 },
    { text: "re", duration: 0.28, begin: 51.75, index: 172 },
    { text: "lim.", duration: 0.28, begin: 51.95, index: 173 },
    { text: " Be", duration: 0.28, begin: 52.75, index: 174 },
    { text: "nim", duration: 0.28, begin: 52.95, index: 175 },
    { text: " ye", duration: 0.28, begin: 53.15, index: 176 },
    { text: "ri", duration: 0.28, begin: 53.35, index: 177 },
    { text: "me", duration: 0.28, begin: 53.55, index: 178 },
    { text: " ko", duration: 0.28, begin: 53.75, index: 179 },
    { text: "nuş", duration: 0.28, begin: 53.95, index: 180 },
    { text: "ma", duration: 0.28, begin: 54.15, index: 181 },
    { text: "yı", duration: 0.28, begin: 54.35, index: 182 },
    { text: " sen", duration: 0.28, begin: 54.75, index: 183 },
    { text: " yap.", duration: 0.28, begin: 54.95, index: 184 },
    { text: " Ben", duration: 0.28, begin: 56.15, index: 185 },
    { text: "de", duration: 0.28, begin: 56.35, index: 186 },
    { text: " ar", duration: 0.28, begin: 56.55, index: 187 },
    { text: "ka", duration: 0.28, begin: 56.75, index: 188 },
    { text: " sı", duration: 0.28, begin: 56.95, index: 189 },
    { text: "ra", duration: 0.28, begin: 57.15, index: 190 },
    { text: "lar", duration: 0.28, begin: 57.35, index: 191 },
    { text: "da", duration: 0.28, begin: 57.55, index: 192 },
    { text: " se", duration: 0.28, begin: 57.95, index: 193 },
    { text: "ni", duration: 0.28, begin: 58.15, index: 194 },
    { text: " din", duration: 0.28, begin: 58.35, index: 195 },
    { text: "le", duration: 0.28, begin: 58.55, index: 196 },
    { text: 'rim."', duration: 0.28, begin: 58.75, index: 197 },
    { text: " Şo", duration: 0.28, begin: 59.95, index: 198 },
    { text: "för", duration: 0.28, begin: 60.15, index: 199 },
    { text: " ger", duration: 0.28, begin: 61.15, index: 200 },
    { text: "çek", duration: 0.28, begin: 61.35, index: 201 },
    { text: "ten", duration: 0.28, begin: 61.55, index: 202 },
    { text: " çok", duration: 0.28, begin: 62.15, index: 203 },
    { text: " ba", duration: 0.28, begin: 62.35, index: 204 },
    { text: "şa", duration: 0.28, begin: 62.55, index: 205 },
    { text: "rı", duration: 0.28, begin: 62.75, index: 206 },
    { text: "lı", duration: 0.28, begin: 62.95, index: 207 },
    { text: " bir", duration: 0.28, begin: 63.35, index: 208 },
    { text: " ko", duration: 0.28, begin: 63.55, index: 209 },
    { text: "nuş", duration: 0.28, begin: 63.75, index: 210 },
    { text: "ma", duration: 0.28, begin: 63.95, index: 211 },
    { text: " yap", duration: 0.28, begin: 64.15, index: 212 },
    { text: "tı", duration: 0.28, begin: 64.35, index: 213 },
    { text: " ve", duration: 0.28, begin: 65.55, index: 214 },
    { text: " so", duration: 0.28, begin: 65.75, index: 215 },
    { text: "ru", duration: 0.28, begin: 65.95, index: 216 },
    { text: "lan", duration: 0.28, begin: 66.15, index: 217 },
    { text: " tüm", duration: 0.28, begin: 66.55, index: 218 },
    { text: " so", duration: 0.28, begin: 66.75, index: 219 },
    { text: "ru", duration: 0.28, begin: 66.95, index: 220 },
    { text: "la", duration: 0.28, begin: 67.15, index: 221 },
    { text: "rı", duration: 0.28, begin: 67.35, index: 222 },
    { text: " doğ", duration: 0.28, begin: 67.75, index: 223 },
    { text: "ru", duration: 0.28, begin: 67.95, index: 224 },
    { text: " ya", duration: 0.28, begin: 68.15, index: 225 },
    { text: "nıt", duration: 0.28, begin: 68.35, index: 226 },
    { text: "la", duration: 0.28, begin: 68.55, index: 227 },
    { text: "dı.", duration: 0.28, begin: 68.75, index: 228 },
    { text: " Tam", duration: 0.28, begin: 69.95, index: 229 },
    { text: " ye", duration: 0.28, begin: 70.15, index: 230 },
    { text: "ri", duration: 0.28, begin: 70.35, index: 231 },
    { text: "ne", duration: 0.28, begin: 70.55, index: 232 },
    { text: " o", duration: 0.28, begin: 70.75, index: 233 },
    { text: "tu", duration: 0.28, begin: 70.95, index: 234 },
    { text: "ra", duration: 0.28, begin: 71.15, index: 235 },
    { text: "ca", duration: 0.28, begin: 71.35, index: 236 },
    { text: "ğı", duration: 0.28, begin: 71.55, index: 237 },
    { text: " sı", duration: 0.28, begin: 71.75, index: 238 },
    { text: "ra", duration: 0.28, begin: 71.95, index: 239 },
    { text: "da", duration: 0.28, begin: 72.15, index: 240 },
    { text: " bir", duration: 0.28, begin: 73.15, index: 241 },
    { text: " ki", duration: 0.28, begin: 73.35, index: 242 },
    { text: "şi", duration: 0.28, begin: 73.55, index: 243 },
    { text: " o", duration: 0.28, begin: 74.35, index: 244 },
    { text: " gü", duration: 0.28, begin: 74.55, index: 245 },
    { text: "ne", duration: 0.28, begin: 74.75, index: 246 },
    { text: " ka", duration: 0.28, begin: 74.95, index: 247 },
    { text: "dar", duration: 0.28, begin: 75.15, index: 248 },
    { text: " kon", duration: 0.28, begin: 75.75, index: 249 },
    { text: "fe", duration: 0.28, begin: 75.95, index: 250 },
    { text: "rans", duration: 0.28, begin: 76.15, index: 251 },
    { text: "ta", duration: 0.28, begin: 76.35, index: 252 },
    { text: " so", duration: 0.28, begin: 76.75, index: 253 },
    { text: "rul", duration: 0.28, begin: 76.95, index: 254 },
    { text: "ma", duration: 0.28, begin: 77.15, index: 255 },
    { text: "mış", duration: 0.28, begin: 77.35, index: 256 },
    { text: " bir", duration: 0.28, begin: 77.95, index: 257 },
    { text: " so", duration: 0.28, begin: 78.15, index: 258 },
    { text: "ru", duration: 0.28, begin: 78.35, index: 259 },
    { text: " sor", duration: 0.28, begin: 78.55, index: 260 },
    { text: "du.", duration: 0.28, begin: 78.75, index: 261 },
    { text: " Şo", duration: 0.28, begin: 79.95, index: 262 },
    { text: "för", duration: 0.28, begin: 80.15, index: 263 },
    { text: " hiç", duration: 0.28, begin: 81.15, index: 264 },
    { text: " du", duration: 0.28, begin: 81.35, index: 265 },
    { text: "rak", duration: 0.28, begin: 81.55, index: 266 },
    { text: "sa", duration: 0.28, begin: 81.75, index: 267 },
    { text: "ma", duration: 0.28, begin: 81.95, index: 268 },
    { text: "dan", duration: 0.28, begin: 82.15, index: 269 },
    { text: " so", duration: 0.28, begin: 82.55, index: 270 },
    { text: "ru", duration: 0.28, begin: 82.75, index: 271 },
    { text: "yu", duration: 0.28, begin: 82.95, index: 272 },
    { text: " so", duration: 0.28, begin: 83.15, index: 273 },
    { text: "ran", duration: 0.28, begin: 83.35, index: 274 },
    { text: " ki", duration: 0.28, begin: 83.75, index: 275 },
    { text: "şi", duration: 0.28, begin: 83.95, index: 276 },
    { text: "ye", duration: 0.28, begin: 84.15, index: 277 },
    { text: " dön", duration: 0.28, begin: 84.35, index: 278 },
    { text: "dü", duration: 0.28, begin: 84.55, index: 279 },
    { text: " ve:", duration: 0.28, begin: 84.95, index: 280 },
    { text: ' "Böy', duration: 0.28, begin: 86.15, index: 281 },
    { text: "le", duration: 0.28, begin: 86.35, index: 282 },
    { text: "si", duration: 0.28, begin: 86.55, index: 283 },
    { text: "ne", duration: 0.28, begin: 86.75, index: 284 },
    { text: " ba", duration: 0.28, begin: 87.15, index: 285 },
    { text: "sit", duration: 0.28, begin: 87.35, index: 286 },
    { text: " bir", duration: 0.28, begin: 87.55, index: 287 },
    { text: " so", duration: 0.28, begin: 87.95, index: 288 },
    { text: "ru", duration: 0.28, begin: 88.15, index: 289 },
    { text: " sor", duration: 0.4, begin: 88.35, index: 290 },
    { text: "ma", duration: 0.4, begin: 88.55, index: 291 },
    { text: "nız", duration: 0.4, begin: 88.75, index: 292 },
    { text: " ger", duration: 0.28, begin: 89.95, index: 293 },
    { text: "çek", duration: 0.28, begin: 90.15, index: 294 },
    { text: "ten", duration: 0.28, begin: 90.35, index: 295 },
    { text: " çok", duration: 0.28, begin: 90.75, index: 296 },
    { text: " ga", duration: 0.28, begin: 90.95, index: 297 },
    { text: 'rip."', duration: 0.28, begin: 91.15, index: 298 },
    { text: " de", duration: 0.28, begin: 91.95, index: 299 },
    { text: "di.", duration: 0.28, begin: 92.15, index: 300 },
    { text: " Son", duration: 0.4, begin: 93.15, index: 301 },
    { text: "ra", duration: 0.4, begin: 93.35, index: 302 },
    { text: "da", duration: 0.4, begin: 93.55, index: 303 },
    { text: " Eins", duration: 0.28, begin: 93.95, index: 304 },
    { text: "tein", duration: 0.28, begin: 94.15, index: 305 },
    { text: "'i", duration: 0.28, begin: 94.55, index: 306 },
    { text: " i", duration: 0.28, begin: 94.95, index: 307 },
    { text: "şa", duration: 0.28, begin: 95.15, index: 308 },
    { text: "ret", duration: 0.28, begin: 95.35, index: 309 },
    { text: " e", duration: 0.28, begin: 95.55, index: 310 },
    { text: "de", duration: 0.28, begin: 95.75, index: 311 },
    { text: "rek", duration: 0.28, begin: 95.95, index: 312 },
    { text: " şöy", duration: 0.28, begin: 96.35, index: 313 },
    { text: "le", duration: 0.28, begin: 96.55, index: 314 },
    { text: " de", duration: 0.28, begin: 96.75, index: 315 },
    { text: "vam", duration: 0.28, begin: 96.95, index: 316 },
    { text: " et", duration: 0.28, begin: 97.35, index: 317 },
    { text: "ti:", duration: 0.28, begin: 97.55, index: 318 },
    { text: ' "Şim', duration: 0.28, begin: 98.55, index: 319 },
    { text: "di", duration: 0.28, begin: 98.75, index: 320 },
    { text: " si", duration: 0.28, begin: 99.15, index: 321 },
    { text: "ze", duration: 0.28, begin: 99.35, index: 322 },
    { text: " ar", duration: 0.28, begin: 100.35, index: 323 },
    { text: "ka", duration: 0.28, begin: 100.55, index: 324 },
    { text: " sı", duration: 0.28, begin: 100.75, index: 325 },
    { text: "ra", duration: 0.28, begin: 100.95, index: 326 },
    { text: "da", duration: 0.28, begin: 101.15, index: 327 },
    { text: " o", duration: 0.28, begin: 101.35, index: 328 },
    { text: "tu", duration: 0.28, begin: 101.55, index: 329 },
    { text: "ran", duration: 0.28, begin: 101.75, index: 330 },
    { text: " şo", duration: 0.28, begin: 102.15, index: 331 },
    { text: "fö", duration: 0.28, begin: 102.35, index: 332 },
    { text: "rü", duration: 0.28, begin: 102.55, index: 333 },
    { text: "mü", duration: 0.28, begin: 102.75, index: 334 },
    { text: " ça", duration: 0.28, begin: 102.95, index: 335 },
    { text: "ğı", duration: 0.28, begin: 103.15, index: 336 },
    { text: "ra", duration: 0.28, begin: 103.35, index: 337 },
    { text: "ca", duration: 0.28, begin: 103.55, index: 338 },
    { text: "ğım", duration: 0.28, begin: 103.75, index: 339 },
    { text: " ve", duration: 0.28, begin: 104.15, index: 340 },
    { text: " sor", duration: 0.28, begin: 104.95, index: 341 },
    { text: "du", duration: 0.28, begin: 105.15, index: 342 },
    { text: "ğu", duration: 0.28, begin: 105.35, index: 343 },
    { text: "nuz", duration: 0.28, begin: 105.55, index: 344 },
    { text: " so", duration: 0.28, begin: 105.95, index: 345 },
    { text: "ru", duration: 0.28, begin: 106.15, index: 346 },
    { text: "yu", duration: 0.28, begin: 106.35, index: 347 },
    { text: " gö", duration: 0.28, begin: 106.55, index: 348 },
    { text: "re", duration: 0.28, begin: 106.75, index: 349 },
    { text: "cek", duration: 0.28, begin: 106.95, index: 350 },
    { text: "si", duration: 0.28, begin: 107.15, index: 351 },
    { text: "niz", duration: 0.28, begin: 107.35, index: 352 },
    { text: " o", duration: 0.28, begin: 108.15, index: 353 },
    { text: " bi", duration: 0.28, begin: 108.35, index: 354 },
    { text: "le", duration: 0.28, begin: 108.55, index: 355 },
    { text: " ya", duration: 0.28, begin: 108.75, index: 356 },
    { text: "nıt", duration: 0.28, begin: 108.95, index: 357 },
    { text: "la", duration: 0.28, begin: 109.15, index: 358 },
    { text: "ya", duration: 0.28, begin: 109.35, index: 359 },
    { text: 'cak."', duration: 0.28, begin: 109.55, index: 360 },
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
                href="/dashboard/stories/elimden-gelen-cabayi-gosterecegim"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/firtina-ciktiginda-uyuyabilirim"
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
            src="/4-3.mp3"
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
