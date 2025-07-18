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
      text: "Ba",
      duration: 0.28,
      begin: 0.5,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ğış",
      duration: 0.28,
      begin: 0.7,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "la",
      duration: 0.28,
      begin: 0.9,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ma",
      duration: 0.28,
      begin: 1.1,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "nın",
      duration: 0.28,
      begin: 1.3,
      index: 5,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Yü",
      duration: 0.28,
      begin: 1.5,
      index: 6,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ce",
      duration: 0.28,
      begin: 1.7,
      index: 7,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "li",
      duration: 0.28,
      begin: 1.9,
      index: 8,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ği",
      duration: 0.28,
      begin: 2.1,
      index: 9,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Yal", duration: 0.4, begin: 3.0, index: 10 },
    { text: "nız", duration: 0.4, begin: 3.2, index: 11 },
    { text: "ca", duration: 0.4, begin: 3.4, index: 12 },
    { text: " bir", duration: 0.28, begin: 4.0, index: 13 },
    { text: "kaç", duration: 0.28, begin: 4.2, index: 14 },
    { text: " kez", duration: 0.28, begin: 4.4, index: 15 },
    { text: " ko", duration: 0.28, begin: 4.8, index: 16 },
    { text: "nuş", duration: 0.28, begin: 5.0, index: 17 },
    { text: "tu", duration: 0.28, begin: 5.2, index: 18 },
    { text: "ğu", duration: 0.28, begin: 5.4, index: 19 },
    { text: "nuz", duration: 0.28, begin: 5.6, index: 20 },
    { text: " bi", duration: 0.28, begin: 5.8, index: 21 },
    { text: "ri", duration: 0.28, begin: 6.0, index: 22 },
    { text: "si", duration: 0.28, begin: 6.2, index: 23 },
    { text: "nin", duration: 0.28, begin: 6.4, index: 24 },
    { text: " a", duration: 0.28, begin: 7.2, index: 25 },
    { text: "dı", duration: 0.28, begin: 7.4, index: 26 },
    { text: "nı", duration: 0.28, begin: 7.6, index: 27 },
    { text: " kırk", duration: 0.28, begin: 7.8, index: 28 },
    { text: " üç", duration: 0.28, begin: 8.0, index: 29 },
    { text: " yıl", duration: 0.28, begin: 8.2, index: 30 },
    { text: " son", duration: 0.28, begin: 8.4, index: 31 },
    { text: "ra", duration: 0.28, begin: 8.6, index: 32 },
    { text: " a", duration: 0.28, begin: 9.2, index: 33 },
    { text: "nım", duration: 0.28, begin: 9.4, index: 34 },
    { text: "sa", duration: 0.28, begin: 9.6, index: 35 },
    { text: "ma", duration: 0.28, begin: 9.8, index: 36 },
    { text: "nız", duration: 0.28, begin: 10.0, index: 37 },
    { text: " hiç", duration: 0.28, begin: 10.8, index: 38 },
    { text: " de", duration: 0.28, begin: 11.0, index: 39 },
    { text: " ko", duration: 0.28, begin: 11.2, index: 40 },
    { text: "lay", duration: 0.28, begin: 11.4, index: 41 },
    { text: " de", duration: 0.28, begin: 11.6, index: 42 },
    { text: "ğil", duration: 0.28, begin: 11.8, index: 43 },
    { text: "dir.", duration: 0.28, begin: 12.0, index: 44 },
    { text: " On", duration: 0.28, begin: 13.0, index: 45 },
    { text: " i", duration: 0.28, begin: 13.2, index: 46 },
    { text: "ki", duration: 0.28, begin: 13.4, index: 47 },
    { text: " yaş", duration: 0.28, begin: 14.0, index: 48 },
    { text: "la", duration: 0.28, begin: 14.2, index: 49 },
    { text: "rın", duration: 0.28, begin: 14.4, index: 50 },
    { text: "da", duration: 0.28, begin: 14.6, index: 51 },
    { text: " bir", duration: 0.28, begin: 14.8, index: 52 },
    { text: " ço", duration: 0.28, begin: 15.2, index: 53 },
    { text: "cuk", duration: 0.28, begin: 15.4, index: 54 },
    { text: "ken", duration: 0.28, begin: 15.6, index: 55 },
    { text: " o", duration: 0.28, begin: 16.4, index: 56 },
    { text: "kul", duration: 0.28, begin: 16.6, index: 57 },
    { text: " harç", duration: 0.28, begin: 16.8, index: 58 },
    { text: "lı", duration: 0.28, begin: 17.0, index: 59 },
    { text: "ğı", duration: 0.28, begin: 17.2, index: 60 },
    { text: "mı", duration: 0.28, begin: 17.4, index: 61 },
    { text: " çı", duration: 0.28, begin: 17.8, index: 62 },
    { text: "kar", duration: 0.28, begin: 18.0, index: 63 },
    { text: "mak", duration: 0.28, begin: 18.2, index: 64 },
    { text: " i", duration: 0.28, begin: 18.4, index: 65 },
    { text: "çin", duration: 0.28, begin: 18.6, index: 66 },
    { text: " ev", duration: 0.28, begin: 19.4, index: 67 },
    { text: "le", duration: 0.28, begin: 19.6, index: 68 },
    { text: "re", duration: 0.28, begin: 19.8, index: 69 },
    { text: " ga", duration: 0.28, begin: 20.0, index: 70 },
    { text: "ze", duration: 0.28, begin: 20.2, index: 71 },
    { text: "te", duration: 0.28, begin: 20.4, index: 72 },
    { text: " da", duration: 0.28, begin: 20.6, index: 73 },
    { text: "ğı", duration: 0.28, begin: 20.8, index: 74 },
    { text: "tı", duration: 0.28, begin: 21.0, index: 75 },
    { text: "yor", duration: 0.28, begin: 21.2, index: 76 },
    { text: "dum", duration: 0.28, begin: 21.4, index: 77 },
    { text: " ve", duration: 0.28, begin: 21.8, index: 78 },
    { text: " a", duration: 0.28, begin: 22.4, index: 79 },
    { text: "dı", duration: 0.28, begin: 22.6, index: 80 },
    { text: "nı", duration: 0.28, begin: 22.8, index: 81 },
    { text: " şim", duration: 0.28, begin: 23.0, index: 82 },
    { text: "di", duration: 0.28, begin: 23.2, index: 83 },
    { text: " a", duration: 0.28, begin: 23.6, index: 84 },
    { text: "nım", duration: 0.28, begin: 23.8, index: 85 },
    { text: "sa", duration: 0.28, begin: 24.0, index: 86 },
    { text: "ya", duration: 0.28, begin: 24.2, index: 87 },
    { text: "ma", duration: 0.28, begin: 24.4, index: 88 },
    { text: "dı", duration: 0.28, begin: 24.6, index: 89 },
    { text: "ğım", duration: 0.28, begin: 24.8, index: 90 },
    { text: " o", duration: 0.28, begin: 25.2, index: 91 },
    { text: " yaş", duration: 0.28, begin: 25.4, index: 92 },
    { text: "lı", duration: 0.28, begin: 25.6, index: 93 },
    { text: " ba", duration: 0.28, begin: 25.8, index: 94 },
    { text: "yan", duration: 0.28, begin: 26.0, index: 95 },
    { text: "da", duration: 0.28, begin: 26.2, index: 96 },
    { text: " be", duration: 0.28, begin: 27.0, index: 97 },
    { text: "nim", duration: 0.28, begin: 27.2, index: 98 },
    { text: " müş", duration: 0.4, begin: 27.4, index: 99 },
    { text: "te", duration: 0.4, begin: 27.6, index: 100 },
    { text: "rim", duration: 0.4, begin: 27.8, index: 101 },
    { text: "di.", duration: 0.28, begin: 28.0, index: 102 },
    { text: " Ba", duration: 0.28, begin: 29.2, index: 103 },
    { text: "na", duration: 0.28, begin: 29.4, index: 104 },
    { text: ' "ba', duration: 0.28, begin: 30.4, index: 105 },
    { text: "ğış", duration: 0.28, begin: 30.6, index: 106 },
    { text: "la", duration: 0.28, begin: 30.8, index: 107 },
    { text: 'ma"', duration: 0.28, begin: 31.0, index: 108 },
    { text: " ko", duration: 0.28, begin: 31.8, index: 109 },
    { text: "nu", duration: 0.28, begin: 32.0, index: 110 },
    { text: "sun", duration: 0.28, begin: 32.2, index: 111 },
    { text: "da", duration: 0.28, begin: 32.4, index: 112 },
    { text: " öy", duration: 0.28, begin: 32.6, index: 113 },
    { text: "le", duration: 0.28, begin: 32.8, index: 114 },
    { text: " gü", duration: 0.28, begin: 33.0, index: 115 },
    { text: "zel", duration: 0.28, begin: 33.2, index: 116 },
    { text: " ve", duration: 0.28, begin: 33.4, index: 117 },
    { text: " u", duration: 0.28, begin: 33.8, index: 118 },
    { text: "nu", duration: 0.28, begin: 34.0, index: 119 },
    { text: "tul", duration: 0.28, begin: 34.2, index: 120 },
    { text: "maz", duration: 0.28, begin: 34.4, index: 121 },
    { text: " bir", duration: 0.28, begin: 34.8, index: 122 },
    { text: " ders", duration: 0.28, begin: 35.0, index: 123 },
    { text: " ver", duration: 0.28, begin: 35.4, index: 124 },
    { text: "di", duration: 0.28, begin: 35.6, index: 125 },
    { text: " ki,", duration: 0.28, begin: 35.8, index: 126 },
    { text: " u", duration: 0.28, begin: 36.8, index: 127 },
    { text: "ma", duration: 0.28, begin: 37.0, index: 128 },
    { text: "rım", duration: 0.28, begin: 37.2, index: 129 },
    { text: " bir", duration: 0.28, begin: 37.4, index: 130 },
    { text: " gün", duration: 0.28, begin: 37.6, index: 131 },
    { text: " ben", duration: 0.28, begin: 38.2, index: 132 },
    { text: " de", duration: 0.28, begin: 38.4, index: 133 },
    { text: " bi", duration: 0.28, begin: 39.2, index: 134 },
    { text: "ri", duration: 0.28, begin: 39.4, index: 135 },
    { text: "si", duration: 0.28, begin: 39.6, index: 136 },
    { text: "ne", duration: 0.28, begin: 39.8, index: 137 },
    { text: " ay", duration: 0.28, begin: 40.2, index: 138 },
    { text: "nı", duration: 0.28, begin: 40.4, index: 139 },
    { text: " duy", duration: 0.28, begin: 40.6, index: 140 },
    { text: "gu", duration: 0.28, begin: 40.8, index: 141 },
    { text: "la", duration: 0.28, begin: 41.0, index: 142 },
    { text: "rı,", duration: 0.28, begin: 41.2, index: 143 },
    { text: " ay", duration: 0.28, begin: 42.0, index: 144 },
    { text: "nı", duration: 0.28, begin: 42.2, index: 145 },
    { text: " gü", duration: 0.28, begin: 42.4, index: 146 },
    { text: "zel", duration: 0.28, begin: 42.6, index: 147 },
    { text: "lik", duration: 0.28, begin: 42.8, index: 148 },
    { text: "te", duration: 0.28, begin: 43.0, index: 149 },
    { text: " ve", duration: 0.28, begin: 43.2, index: 150 },
    { text: "re", duration: 0.28, begin: 43.4, index: 151 },
    { text: "bi", duration: 0.28, begin: 43.6, index: 152 },
    { text: "li", duration: 0.28, begin: 43.8, index: 153 },
    { text: "rim.", duration: 0.28, begin: 44.0, index: 154 },
    { text: " Sı", duration: 0.28, begin: 45.0, index: 155 },
    { text: "kın", duration: 0.28, begin: 45.2, index: 156 },
    { text: "tı", duration: 0.28, begin: 45.4, index: 157 },
    { text: "dan", duration: 0.28, begin: 45.6, index: 158 },
    { text: " pat", duration: 0.28, begin: 46.0, index: 159 },
    { text: "la", duration: 0.28, begin: 46.2, index: 160 },
    { text: "mak", duration: 0.28, begin: 46.4, index: 161 },
    { text: " ü", duration: 0.28, begin: 46.6, index: 162 },
    { text: "ze", duration: 0.28, begin: 46.8, index: 163 },
    { text: "re", duration: 0.28, begin: 47.0, index: 164 },
    { text: " ol", duration: 0.28, begin: 47.2, index: 165 },
    { text: "du", duration: 0.28, begin: 47.4, index: 166 },
    { text: "ğu", duration: 0.28, begin: 47.6, index: 167 },
    { text: "muz", duration: 0.28, begin: 47.8, index: 168 },
    { text: " bir", duration: 0.28, begin: 48.0, index: 169 },
    { text: " cu", duration: 0.28, begin: 48.6, index: 170 },
    { text: "mar", duration: 0.28, begin: 48.8, index: 171 },
    { text: "te", duration: 0.28, begin: 49.0, index: 172 },
    { text: "si", duration: 0.28, begin: 49.2, index: 173 },
    { text: " gü", duration: 0.28, begin: 49.4, index: 174 },
    { text: "nüy", duration: 0.28, begin: 49.6, index: 175 },
    { text: "dü.", duration: 0.28, begin: 49.8, index: 176 },
    { text: " Ar", duration: 0.28, begin: 50.8, index: 177 },
    { text: "ka", duration: 0.28, begin: 51.0, index: 178 },
    { text: "da", duration: 0.28, begin: 51.2, index: 179 },
    { text: "şım", duration: 0.28, begin: 51.4, index: 180 },
    { text: "la", duration: 0.28, begin: 51.6, index: 181 },
    { text: " bir", duration: 0.28, begin: 51.8, index: 182 },
    { text: "lik", duration: 0.28, begin: 52.0, index: 183 },
    { text: "te", duration: 0.28, begin: 52.2, index: 184 },
    { text: " yaş", duration: 0.28, begin: 53.2, index: 185 },
    { text: "lı", duration: 0.28, begin: 53.4, index: 186 },
    { text: " ba", duration: 0.28, begin: 53.6, index: 187 },
    { text: "ya", duration: 0.28, begin: 53.8, index: 188 },
    { text: "nın", duration: 0.28, begin: 54.0, index: 189 },
    { text: " ar", duration: 0.28, begin: 54.4, index: 190 },
    { text: "ka", duration: 0.28, begin: 54.6, index: 191 },
    { text: " bah", duration: 0.28, begin: 54.8, index: 192 },
    { text: "çe", duration: 0.28, begin: 55.0, index: 193 },
    { text: "sin", duration: 0.28, begin: 55.2, index: 194 },
    { text: "de", duration: 0.28, begin: 55.4, index: 195 },
    { text: " bir", duration: 0.28, begin: 56.0, index: 196 },
    { text: " kö", duration: 0.28, begin: 56.2, index: 197 },
    { text: "şe", duration: 0.28, begin: 56.4, index: 198 },
    { text: "ye", duration: 0.28, begin: 56.6, index: 199 },
    { text: " giz", duration: 0.28, begin: 56.8, index: 200 },
    { text: "le", duration: 0.28, begin: 57.0, index: 201 },
    { text: "ne", duration: 0.28, begin: 57.2, index: 202 },
    { text: "rek,", duration: 0.28, begin: 57.4, index: 203 },
    { text: " yer", duration: 0.28, begin: 58.4, index: 204 },
    { text: "den", duration: 0.28, begin: 58.6, index: 205 },
    { text: " al", duration: 0.28, begin: 58.8, index: 206 },
    { text: "dı", duration: 0.28, begin: 59.0, index: 207 },
    { text: "ğı", duration: 0.28, begin: 59.2, index: 208 },
    { text: "mız", duration: 0.28, begin: 59.4, index: 209 },
    { text: " taş", duration: 0.28, begin: 59.6, index: 210 },
    { text: "la", duration: 0.28, begin: 59.8, index: 211 },
    { text: "rı", duration: 0.28, begin: 60.0, index: 212 },
    { text: " e", duration: 0.28, begin: 61.0, index: 213 },
    { text: "vin", duration: 0.28, begin: 61.2, index: 214 },
    { text: " ça", duration: 0.28, begin: 61.4, index: 215 },
    { text: "tı", duration: 0.28, begin: 61.6, index: 216 },
    { text: "sı", duration: 0.28, begin: 61.8, index: 217 },
    { text: "na", duration: 0.28, begin: 62.0, index: 218 },
    { text: " a", duration: 0.28, begin: 62.4, index: 219 },
    { text: "tı", duration: 0.28, begin: 62.6, index: 220 },
    { text: "yor", duration: 0.28, begin: 62.8, index: 221 },
    { text: "duk.", duration: 0.28, begin: 63.0, index: 222 },
    { text: " At", duration: 0.28, begin: 64.0, index: 223 },
    { text: "tı", duration: 0.28, begin: 64.2, index: 224 },
    { text: "ğı", duration: 0.28, begin: 64.4, index: 225 },
    { text: "mız", duration: 0.28, begin: 64.6, index: 226 },
    { text: " taş", duration: 0.28, begin: 65.0, index: 227 },
    { text: "la", duration: 0.28, begin: 65.2, index: 228 },
    { text: "rın", duration: 0.28, begin: 65.4, index: 229 },
    { text: " ça", duration: 0.28, begin: 66.2, index: 230 },
    { text: "tı", duration: 0.28, begin: 66.4, index: 231 },
    { text: "nın", duration: 0.28, begin: 66.6, index: 232 },
    { text: " ü", duration: 0.28, begin: 66.8, index: 233 },
    { text: "ze", duration: 0.28, begin: 67.0, index: 234 },
    { text: "rin", duration: 0.28, begin: 67.2, index: 235 },
    { text: "den", duration: 0.28, begin: 67.4, index: 236 },
    { text: " yu", duration: 0.28, begin: 67.8, index: 237 },
    { text: "var", duration: 0.28, begin: 68.0, index: 238 },
    { text: "la", duration: 0.28, begin: 68.2, index: 239 },
    { text: "na", duration: 0.28, begin: 68.4, index: 240 },
    { text: "rak,", duration: 0.28, begin: 68.6, index: 241 },
    { text: " kö", duration: 0.28, begin: 69.4, index: 242 },
    { text: "şe", duration: 0.28, begin: 69.6, index: 243 },
    { text: "ler", duration: 0.28, begin: 69.8, index: 244 },
    { text: "den", duration: 0.28, begin: 70.0, index: 245 },
    { text: " a", duration: 0.28, begin: 70.6, index: 246 },
    { text: "şa", duration: 0.28, begin: 70.8, index: 247 },
    { text: "ğı", duration: 0.28, begin: 71.0, index: 248 },
    { text: "ya", duration: 0.28, begin: 71.2, index: 249 },
    { text: " düş", duration: 0.28, begin: 71.4, index: 250 },
    { text: "me", duration: 0.28, begin: 71.6, index: 251 },
    { text: "si", duration: 0.28, begin: 71.8, index: 252 },
    { text: "ni", duration: 0.28, begin: 72.0, index: 253 },
    { text: " kuy", duration: 0.28, begin: 72.6, index: 254 },
    { text: "ruk", duration: 0.28, begin: 72.8, index: 255 },
    { text: "lu", duration: 0.28, begin: 73.0, index: 256 },
    { text: " yıl", duration: 0.28, begin: 73.4, index: 257 },
    { text: "dız", duration: 0.28, begin: 73.6, index: 258 },
    { text: "la", duration: 0.28, begin: 73.8, index: 259 },
    { text: "rın", duration: 0.28, begin: 74.0, index: 260 },
    { text: " sü", duration: 0.28, begin: 74.8, index: 261 },
    { text: "zü", duration: 0.28, begin: 75.0, index: 262 },
    { text: "le", duration: 0.28, begin: 75.2, index: 263 },
    { text: "rek", duration: 0.28, begin: 75.4, index: 264 },
    { text: " gök", duration: 0.28, begin: 76.0, index: 265 },
    { text: "yü", duration: 0.28, begin: 76.2, index: 266 },
    { text: "zün", duration: 0.28, begin: 76.4, index: 267 },
    { text: "den", duration: 0.28, begin: 76.6, index: 268 },
    { text: " a", duration: 0.28, begin: 77.0, index: 269 },
    { text: "şa", duration: 0.28, begin: 77.2, index: 270 },
    { text: "ğı", duration: 0.28, begin: 77.4, index: 271 },
    { text: "ya", duration: 0.28, begin: 77.6, index: 272 },
    { text: " doğ", duration: 0.28, begin: 77.8, index: 273 },
    { text: "ru", duration: 0.28, begin: 78.0, index: 274 },
    { text: " düş", duration: 0.28, begin: 78.2, index: 275 },
    { text: "me", duration: 0.28, begin: 78.4, index: 276 },
    { text: "si", duration: 0.28, begin: 78.6, index: 277 },
    { text: "ne", duration: 0.28, begin: 78.8, index: 278 },
    { text: " ben", duration: 0.28, begin: 79.0, index: 279 },
    { text: "ze", duration: 0.28, begin: 79.2, index: 280 },
    { text: "te", duration: 0.28, begin: 79.4, index: 281 },
    { text: "rek", duration: 0.28, begin: 79.6, index: 282 },
    { text: " eğ", duration: 0.28, begin: 80.6, index: 283 },
    { text: "le", duration: 0.28, begin: 80.8, index: 284 },
    { text: "ni", duration: 0.28, begin: 81.0, index: 285 },
    { text: "yor", duration: 0.28, begin: 81.2, index: 286 },
    { text: "duk.", duration: 0.28, begin: 81.4, index: 287 },
    { text: " Ken", duration: 0.28, begin: 82.6, index: 288 },
    { text: "di", duration: 0.28, begin: 82.8, index: 289 },
    { text: "me", duration: 0.28, begin: 83.0, index: 290 },
    { text: " yer", duration: 0.28, begin: 83.2, index: 291 },
    { text: "den", duration: 0.28, begin: 83.4, index: 292 },
    { text: " çok", duration: 0.28, begin: 84.4, index: 293 },
    { text: " düz", duration: 0.28, begin: 84.8, index: 294 },
    { text: "gün", duration: 0.28, begin: 85.0, index: 295 },
    { text: " bir", duration: 0.28, begin: 85.4, index: 296 },
    { text: " taş", duration: 0.28, begin: 85.6, index: 297 },
    { text: " bul", duration: 0.28, begin: 86.2, index: 298 },
    { text: "muş", duration: 0.28, begin: 86.4, index: 299 },
    { text: "tum.", duration: 0.28, begin: 86.6, index: 300 },
    { text: " E", duration: 0.28, begin: 87.4, index: 301 },
    { text: "li", duration: 0.28, begin: 87.6, index: 302 },
    { text: "me", duration: 0.28, begin: 87.8, index: 303 },
    { text: " a", duration: 0.28, begin: 88.0, index: 304 },
    { text: "lıp", duration: 0.28, begin: 88.2, index: 305 },
    { text: " tüm", duration: 0.28, begin: 88.6, index: 306 },
    { text: " gü", duration: 0.4, begin: 89.0, index: 307 },
    { text: "cüm", duration: 0.4, begin: 89.2, index: 308 },
    { text: "le", duration: 0.4, begin: 89.4, index: 309 },
    { text: " fır", duration: 0.4, begin: 89.6, index: 310 },
    { text: "lat", duration: 0.4, begin: 89.8, index: 311 },
    { text: "tım.", duration: 0.4, begin: 90.0, index: 312 },
    { text: " A", duration: 0.28, begin: 91.2, index: 313 },
    { text: "ma", duration: 0.28, begin: 91.4, index: 314 },
    { text: " taş", duration: 0.28, begin: 91.6, index: 315 },
    { text: " bu", duration: 0.28, begin: 92.0, index: 316 },
    { text: " kez", duration: 0.28, begin: 92.2, index: 317 },
    { text: " ça", duration: 0.28, begin: 93.0, index: 318 },
    { text: "tı", duration: 0.28, begin: 93.2, index: 319 },
    { text: "ya", duration: 0.28, begin: 93.4, index: 320 },
    { text: " de", duration: 0.28, begin: 93.6, index: 321 },
    { text: "ğil", duration: 0.28, begin: 93.8, index: 322 },
    { text: " dış", duration: 0.28, begin: 94.4, index: 323 },
    { text: " ka", duration: 0.28, begin: 94.6, index: 324 },
    { text: "pı", duration: 0.28, begin: 94.8, index: 325 },
    { text: "nın", duration: 0.28, begin: 95.0, index: 326 },
    { text: " pen", duration: 0.28, begin: 95.6, index: 327 },
    { text: "ce", duration: 0.28, begin: 95.8, index: 328 },
    { text: "re", duration: 0.28, begin: 96.0, index: 329 },
    { text: "si", duration: 0.28, begin: 96.2, index: 330 },
    { text: "ne", duration: 0.28, begin: 96.4, index: 331 },
    { text: " gel", duration: 0.28, begin: 96.8, index: 332 },
    { text: "miş", duration: 0.28, begin: 97.0, index: 333 },
    { text: "ti.", duration: 0.28, begin: 97.2, index: 334 },
    { text: " Kı", duration: 0.28, begin: 98.2, index: 335 },
    { text: "rı", duration: 0.28, begin: 98.4, index: 336 },
    { text: "lan", duration: 0.28, begin: 98.6, index: 337 },
    { text: " cam", duration: 0.28, begin: 99.0, index: 338 },
    { text: " se", duration: 0.28, begin: 99.2, index: 339 },
    { text: "si", duration: 0.28, begin: 99.4, index: 340 },
    { text: "ni", duration: 0.28, begin: 99.6, index: 341 },
    { text: " du", duration: 0.28, begin: 99.8, index: 342 },
    { text: "yun", duration: 0.28, begin: 100.0, index: 343 },
    { text: "ca,", duration: 0.28, begin: 100.2, index: 344 },
    { text: " giz", duration: 0.28, begin: 101.0, index: 345 },
    { text: "len", duration: 0.28, begin: 101.2, index: 346 },
    { text: "di", duration: 0.28, begin: 101.4, index: 347 },
    { text: "ği", duration: 0.28, begin: 101.6, index: 348 },
    { text: "miz", duration: 0.28, begin: 101.8, index: 349 },
    { text: " yer", duration: 0.28, begin: 102.2, index: 350 },
    { text: "den", duration: 0.28, begin: 102.4, index: 351 },
    { text: " fır", duration: 0.4, begin: 102.6, index: 352 },
    { text: "la", duration: 0.4, begin: 102.8, index: 353 },
    { text: "yıp", duration: 0.4, begin: 103.0, index: 354 },
    { text: " ar", duration: 0.28, begin: 104.0, index: 355 },
    { text: "dı", duration: 0.28, begin: 104.2, index: 356 },
    { text: "mı", duration: 0.28, begin: 104.4, index: 357 },
    { text: "za", duration: 0.28, begin: 104.6, index: 358 },
    { text: " bak", duration: 0.28, begin: 105.0, index: 359 },
    { text: "ma", duration: 0.28, begin: 105.2, index: 360 },
    { text: "dan", duration: 0.28, begin: 105.4, index: 361 },
    { text: " so", duration: 0.28, begin: 105.8, index: 362 },
    { text: "luk", duration: 0.28, begin: 106.0, index: 363 },
    { text: " so", duration: 0.28, begin: 106.2, index: 364 },
    { text: "lu", duration: 0.28, begin: 106.4, index: 365 },
    { text: "ğa", duration: 0.28, begin: 106.6, index: 366 },
    { text: " kaç", duration: 0.28, begin: 107.0, index: 367 },
    { text: "mış", duration: 0.28, begin: 107.2, index: 368 },
    { text: "tık", duration: 0.28, begin: 107.4, index: 369 },
    { text: " o", duration: 0.28, begin: 107.6, index: 370 },
    { text: "ra", duration: 0.28, begin: 107.8, index: 371 },
    { text: "dan.", duration: 0.28, begin: 108.0, index: 372 },
    { text: " Yaş", duration: 0.28, begin: 109.4, index: 373 },
    { text: "lı", duration: 0.28, begin: 109.6, index: 374 },
    { text: " ba", duration: 0.28, begin: 109.8, index: 375 },
    { text: "ya", duration: 0.28, begin: 110.0, index: 376 },
    { text: "nın", duration: 0.28, begin: 110.2, index: 377 },
    { text: " bi", duration: 0.28, begin: 110.8, index: 378 },
    { text: "zi", duration: 0.28, begin: 111.0, index: 379 },
    { text: " gör", duration: 0.28, begin: 111.2, index: 380 },
    { text: "müş", duration: 0.28, begin: 111.4, index: 381 },
    { text: " ol", duration: 0.28, begin: 112.0, index: 382 },
    { text: "ma", duration: 0.28, begin: 112.2, index: 383 },
    { text: "sı", duration: 0.28, begin: 112.4, index: 384 },
    { text: " o", duration: 0.28, begin: 112.8, index: 385 },
    { text: "la", duration: 0.28, begin: 113.0, index: 386 },
    { text: "nak", duration: 0.28, begin: 113.2, index: 387 },
    { text: "sız", duration: 0.28, begin: 113.4, index: 388 },
    { text: "dı.", duration: 0.28, begin: 113.6, index: 389 },
    { text: " Tüm", duration: 0.28, begin: 114.8, index: 390 },
    { text: " ge", duration: 0.28, begin: 115.0, index: 391 },
    { text: "ce", duration: 0.28, begin: 115.2, index: 392 },
    { text: " yaş", duration: 0.28, begin: 116.0, index: 393 },
    { text: "lı", duration: 0.28, begin: 116.2, index: 394 },
    { text: " ba", duration: 0.28, begin: 116.4, index: 395 },
    { text: "ya", duration: 0.28, begin: 116.6, index: 396 },
    { text: "nın", duration: 0.28, begin: 116.8, index: 397 },
    { text: " be", duration: 0.28, begin: 117.0, index: 398 },
    { text: "ni", duration: 0.28, begin: 117.2, index: 399 },
    { text: " ya", duration: 0.1, begin: 117.4, index: 400 },
    { text: "ka", duration: 0.1, begin: 117.6, index: 401 },
    { text: "la", duration: 0.1, begin: 117.8, index: 402 },
    { text: "ya", duration: 0.1, begin: 118.0, index: 403 },
    { text: "bi", duration: 0.1, begin: 118.2, index: 404 },
    { text: "le", duration: 0.1, begin: 118.4, index: 405 },
    { text: "ce", duration: 0.1, begin: 118.6, index: 406 },
    { text: "ği", duration: 0.1, begin: 118.8, index: 407 },
    { text: "ni", duration: 0.1, begin: 119.0, index: 408 },
    { text: " dü", duration: 0.1, begin: 119.2, index: 409 },
    { text: "şü", duration: 0.1, begin: 119.4, index: 410 },
    { text: "ne", duration: 0.1, begin: 119.6, index: 411 },
    { text: "rek,", duration: 0.1, begin: 119.8, index: 412 },
    { text: " kor", duration: 0.28, begin: 120.4, index: 413 },
    { text: "ku", duration: 0.28, begin: 120.6, index: 414 },
    { text: "dan", duration: 0.28, begin: 120.8, index: 415 },
    { text: " u", duration: 0.28, begin: 121.0, index: 416 },
    { text: "yu", duration: 0.28, begin: 121.2, index: 417 },
    { text: "ya", duration: 0.28, begin: 121.4, index: 418 },
    { text: "ma", duration: 0.28, begin: 121.6, index: 419 },
    { text: "dım.", duration: 0.28, begin: 121.8, index: 420 },
    { text: " Er", duration: 0.28, begin: 123.0, index: 421 },
    { text: "te", duration: 0.28, begin: 123.2, index: 422 },
    { text: "si", duration: 0.28, begin: 123.4, index: 423 },
    { text: " gün", duration: 0.28, begin: 123.6, index: 424 },
    { text: " ga", duration: 0.28, begin: 124.4, index: 425 },
    { text: "ze", duration: 0.28, begin: 124.6, index: 426 },
    { text: "te", duration: 0.28, begin: 124.8, index: 427 },
    { text: "si", duration: 0.28, begin: 125.0, index: 428 },
    { text: "ni", duration: 0.28, begin: 125.2, index: 429 },
    { text: " ver", duration: 0.28, begin: 125.4, index: 430 },
    { text: "mek", duration: 0.28, begin: 125.6, index: 431 },
    { text: " ü", duration: 0.28, begin: 125.8, index: 432 },
    { text: "ze", duration: 0.28, begin: 126.0, index: 433 },
    { text: "re", duration: 0.28, begin: 126.2, index: 434 },
    { text: " ka", duration: 0.28, begin: 126.6, index: 435 },
    { text: "pı", duration: 0.28, begin: 126.8, index: 436 },
    { text: "sı", duration: 0.28, begin: 127.0, index: 437 },
    { text: "nı", duration: 0.28, begin: 127.2, index: 438 },
    { text: " çal", duration: 0.28, begin: 127.6, index: 439 },
    { text: "dı", duration: 0.28, begin: 127.8, index: 440 },
    { text: "ğım", duration: 0.28, begin: 128.0, index: 441 },
    { text: " za", duration: 0.28, begin: 128.2, index: 442 },
    { text: "man", duration: 0.28, begin: 128.4, index: 443 },
    { text: " her", duration: 0.28, begin: 129.4, index: 444 },
    { text: " za", duration: 0.28, begin: 129.6, index: 445 },
    { text: "man", duration: 0.28, begin: 129.8, index: 446 },
    { text: " ki", duration: 0.28, begin: 130.0, index: 447 },
    { text: " gi", duration: 0.28, begin: 130.2, index: 448 },
    { text: "bi", duration: 0.28, begin: 130.4, index: 449 },
    { text: " iç", duration: 0.28, begin: 130.6, index: 450 },
    { text: "ten", duration: 0.28, begin: 130.8, index: 451 },
    { text: "lik", duration: 0.28, begin: 131.0, index: 452 },
    { text: "le", duration: 0.28, begin: 131.2, index: 453 },
    { text: " gü", duration: 0.28, begin: 131.6, index: 454 },
    { text: "lüm", duration: 0.28, begin: 131.8, index: 455 },
    { text: "se", duration: 0.28, begin: 132.0, index: 456 },
    { text: "ye", duration: 0.28, begin: 132.2, index: 457 },
    { text: "rek", duration: 0.28, begin: 132.4, index: 458 },
    { text: " ha", duration: 0.28, begin: 133.4, index: 459 },
    { text: "tı", duration: 0.28, begin: 133.6, index: 460 },
    { text: "rı", duration: 0.28, begin: 133.8, index: 461 },
    { text: "mı", duration: 0.28, begin: 134.0, index: 462 },
    { text: " sor", duration: 0.28, begin: 134.2, index: 463 },
    { text: "du.", duration: 0.28, begin: 134.4, index: 464 },
    { text: " A", duration: 0.28, begin: 135.2, index: 465 },
    { text: "ma", duration: 0.28, begin: 135.4, index: 466 },
    { text: " ben", duration: 0.28, begin: 135.6, index: 467 },
    { text: " suç", duration: 0.28, begin: 136.0, index: 468 },
    { text: "lu", duration: 0.28, begin: 136.2, index: 469 },
    { text: "luk", duration: 0.28, begin: 136.4, index: 470 },
    { text: " duy", duration: 0.28, begin: 136.8, index: 471 },
    { text: "gu", duration: 0.28, begin: 137.0, index: 472 },
    { text: "suy", duration: 0.28, begin: 137.2, index: 473 },
    { text: "la", duration: 0.28, begin: 137.4, index: 474 },
    { text: " yü", duration: 0.28, begin: 137.6, index: 475 },
    { text: "zü", duration: 0.28, begin: 137.8, index: 476 },
    { text: "ne", duration: 0.28, begin: 138.0, index: 477 },
    { text: " ba", duration: 0.28, begin: 138.2, index: 478 },
    { text: "ka", duration: 0.28, begin: 138.4, index: 479 },
    { text: "mı", duration: 0.28, begin: 138.6, index: 480 },
    { text: "yor", duration: 0.28, begin: 138.8, index: 481 },
    { text: "dum.", duration: 0.28, begin: 139.0, index: 482 },
    { text: " So", duration: 0.28, begin: 140.2, index: 483 },
    { text: "nun", duration: 0.28, begin: 140.4, index: 484 },
    { text: "da", duration: 0.28, begin: 140.6, index: 485 },
    { text: " ga", duration: 0.28, begin: 141.2, index: 486 },
    { text: "ze", duration: 0.28, begin: 141.4, index: 487 },
    { text: "te", duration: 0.28, begin: 141.6, index: 488 },
    { text: " da", duration: 0.28, begin: 141.8, index: 489 },
    { text: "ğı", duration: 0.28, begin: 142.0, index: 490 },
    { text: "tı", duration: 0.28, begin: 142.2, index: 491 },
    { text: "mın", duration: 0.28, begin: 142.4, index: 492 },
    { text: "dan", duration: 0.28, begin: 142.6, index: 493 },
    { text: " ka", duration: 0.28, begin: 142.8, index: 494 },
    { text: "zan", duration: 0.28, begin: 143.0, index: 495 },
    { text: "dı", duration: 0.28, begin: 143.2, index: 496 },
    { text: "ğım", duration: 0.28, begin: 143.4, index: 497 },
    { text: " pa", duration: 0.28, begin: 143.6, index: 498 },
    { text: "ra", duration: 0.28, begin: 143.8, index: 499 },
    { text: "yı", duration: 0.28, begin: 144.0, index: 500 },
    { text: " bi", duration: 0.28, begin: 144.2, index: 501 },
    { text: "rik", duration: 0.28, begin: 144.4, index: 502 },
    { text: "tir", duration: 0.28, begin: 144.6, index: 503 },
    { text: "me", duration: 0.28, begin: 144.8, index: 504 },
    { text: "ye", duration: 0.28, begin: 145.0, index: 505 },
    { text: " ka", duration: 0.28, begin: 145.6, index: 506 },
    { text: "rar", duration: 0.28, begin: 145.8, index: 507 },
    { text: " ver", duration: 0.28, begin: 146.0, index: 508 },
    { text: "dim.", duration: 0.28, begin: 146.2, index: 509 },
    { text: " Üç", duration: 0.28, begin: 147.2, index: 510 },
    { text: " haf", duration: 0.28, begin: 147.4, index: 511 },
    { text: "ta", duration: 0.28, begin: 147.6, index: 512 },
    { text: " son", duration: 0.28, begin: 148.0, index: 513 },
    { text: "ra", duration: 0.28, begin: 148.2, index: 514 },
    { text: " tam", duration: 0.28, begin: 149.2, index: 515 },
    { text: " ye", duration: 0.28, begin: 149.4, index: 516 },
    { text: "di", duration: 0.28, begin: 149.6, index: 517 },
    { text: " do", duration: 0.28, begin: 149.8, index: 518 },
    { text: "la", duration: 0.28, begin: 150.0, index: 519 },
    { text: "rım", duration: 0.28, begin: 150.2, index: 520 },
    { text: " ol", duration: 0.28, begin: 150.6, index: 521 },
    { text: "muş", duration: 0.28, begin: 150.8, index: 522 },
    { text: "tu.", duration: 0.28, begin: 151.0, index: 523 },
    { text: " Bir", duration: 0.28, begin: 152.2, index: 524 },
    { text: " ka", duration: 0.28, begin: 152.4, index: 525 },
    { text: "ğı", duration: 0.28, begin: 152.6, index: 526 },
    { text: "da;", duration: 0.28, begin: 152.8, index: 527 },
    { text: ' "Ca', duration: 0.28, begin: 153.8, index: 528 },
    { text: "mı", duration: 0.28, begin: 154.0, index: 529 },
    { text: "nı", duration: 0.28, begin: 154.2, index: 530 },
    { text: "zı", duration: 0.28, begin: 154.4, index: 531 },
    { text: " is", duration: 0.28, begin: 154.6, index: 532 },
    { text: "te", duration: 0.28, begin: 154.8, index: 533 },
    { text: "me", duration: 0.28, begin: 155.0, index: 534 },
    { text: "den", duration: 0.28, begin: 155.2, index: 535 },
    { text: " kır", duration: 0.28, begin: 155.4, index: 536 },
    { text: "dı", duration: 0.28, begin: 155.6, index: 537 },
    { text: "ğım", duration: 0.28, begin: 155.8, index: 538 },
    { text: " i", duration: 0.28, begin: 156.0, index: 539 },
    { text: "çin", duration: 0.28, begin: 156.2, index: 540 },
    { text: " üz", duration: 0.28, begin: 156.6, index: 541 },
    { text: "gü", duration: 0.28, begin: 156.8, index: 542 },
    { text: "nüm,", duration: 0.28, begin: 157.0, index: 543 },
    { text: " u", duration: 0.28, begin: 158.0, index: 544 },
    { text: "ma", duration: 0.28, begin: 158.2, index: 545 },
    { text: "rım", duration: 0.28, begin: 158.4, index: 546 },
    { text: " koy", duration: 0.28, begin: 159.0, index: 547 },
    { text: "du", duration: 0.28, begin: 159.2, index: 548 },
    { text: "ğum", duration: 0.28, begin: 159.4, index: 549 },
    { text: " pa", duration: 0.28, begin: 159.6, index: 550 },
    { text: "ra", duration: 0.28, begin: 159.8, index: 551 },
    { text: " o", duration: 0.28, begin: 160.0, index: 552 },
    { text: "na", duration: 0.28, begin: 160.2, index: 553 },
    { text: "rı", duration: 0.28, begin: 160.4, index: 554 },
    { text: "mı", duration: 0.28, begin: 160.6, index: 555 },
    { text: " i", duration: 0.28, begin: 160.8, index: 556 },
    { text: "çin", duration: 0.28, begin: 161.0, index: 557 },
    { text: " ye", duration: 0.28, begin: 161.2, index: 558 },
    { text: "ter", duration: 0.28, begin: 161.4, index: 559 },
    { text: "li", duration: 0.28, begin: 161.6, index: 560 },
    { text: 'dir"', duration: 0.28, begin: 161.8, index: 561 },
    { text: " ya", duration: 0.28, begin: 162.6, index: 562 },
    { text: "za", duration: 0.28, begin: 162.8, index: 563 },
    { text: "rak", duration: 0.28, begin: 163.0, index: 564 },
    { text: " pa", duration: 0.28, begin: 163.2, index: 565 },
    { text: "ray", duration: 0.28, begin: 163.4, index: 566 },
    { text: "la", duration: 0.28, begin: 163.6, index: 567 },
    { text: " bir", duration: 0.28, begin: 163.8, index: 568 },
    { text: "lik", duration: 0.28, begin: 164.0, index: 569 },
    { text: "te", duration: 0.28, begin: 164.2, index: 570 },
    { text: " zar", duration: 0.28, begin: 164.6, index: 571 },
    { text: "fın", duration: 0.28, begin: 164.8, index: 572 },
    { text: " i", duration: 0.28, begin: 165.2, index: 573 },
    { text: "çi", duration: 0.28, begin: 165.4, index: 574 },
    { text: "ne", duration: 0.28, begin: 165.6, index: 575 },
    { text: " koy", duration: 0.28, begin: 165.8, index: 576 },
    { text: "dum.", duration: 0.28, begin: 166.0, index: 577 },
    { text: " Ge", duration: 0.28, begin: 167.6, index: 578 },
    { text: "ce", duration: 0.28, begin: 167.8, index: 579 },
    { text: " ha", duration: 0.28, begin: 168.6, index: 580 },
    { text: "va", duration: 0.28, begin: 168.8, index: 581 },
    { text: "nın", duration: 0.28, begin: 169.0, index: 582 },
    { text: " ka", duration: 0.28, begin: 169.2, index: 583 },
    { text: "rar", duration: 0.28, begin: 169.4, index: 584 },
    { text: "ma", duration: 0.28, begin: 169.6, index: 585 },
    { text: "sı", duration: 0.28, begin: 169.8, index: 586 },
    { text: "nı", duration: 0.28, begin: 170.0, index: 587 },
    { text: " bek", duration: 0.28, begin: 170.2, index: 588 },
    { text: "le", duration: 0.28, begin: 170.4, index: 589 },
    { text: "ye", duration: 0.28, begin: 170.6, index: 590 },
    { text: "rek,", duration: 0.28, begin: 170.8, index: 591 },
    { text: " zar", duration: 0.28, begin: 171.6, index: 592 },
    { text: "fı", duration: 0.28, begin: 171.8, index: 593 },
    { text: " u", duration: 0.28, begin: 172.0, index: 594 },
    { text: "sul", duration: 0.28, begin: 172.2, index: 595 },
    { text: "ca", duration: 0.28, begin: 172.4, index: 596 },
    { text: " yaş", duration: 0.28, begin: 172.8, index: 597 },
    { text: "lı", duration: 0.28, begin: 173.0, index: 598 },
    { text: " ba", duration: 0.28, begin: 173.2, index: 599 },
    { text: "ya", duration: 0.28, begin: 173.4, index: 600 },
    { text: "nın", duration: 0.28, begin: 173.6, index: 601 },
    { text: " pos", duration: 0.28, begin: 174.0, index: 602 },
    { text: "ta", duration: 0.28, begin: 174.2, index: 603 },
    { text: " ku", duration: 0.28, begin: 174.4, index: 604 },
    { text: "tu", duration: 0.28, begin: 174.6, index: 605 },
    { text: "su", duration: 0.28, begin: 174.8, index: 606 },
    { text: "na", duration: 0.28, begin: 175.0, index: 607 },
    { text: " at", duration: 0.28, begin: 175.2, index: 608 },
    { text: "tım.", duration: 0.28, begin: 175.4, index: 609 },
    { text: " Ru", duration: 0.28, begin: 176.6, index: 610 },
    { text: "hum", duration: 0.28, begin: 176.8, index: 611 },
    { text: " bir", duration: 0.28, begin: 177.0, index: 612 },
    { text: " an", duration: 0.28, begin: 177.4, index: 613 },
    { text: "da", duration: 0.28, begin: 177.6, index: 614 },
    { text: " öz", duration: 0.28, begin: 177.8, index: 615 },
    { text: "gür", duration: 0.28, begin: 178.0, index: 616 },
    { text: "lü", duration: 0.28, begin: 178.2, index: 617 },
    { text: "ğe", duration: 0.28, begin: 178.4, index: 618 },
    { text: " ka", duration: 0.28, begin: 178.8, index: 619 },
    { text: "vuş", duration: 0.28, begin: 179.0, index: 620 },
    { text: "muş", duration: 0.28, begin: 179.2, index: 621 },
    { text: "tu", duration: 0.28, begin: 179.4, index: 622 },
    { text: " san", duration: 0.28, begin: 179.6, index: 623 },
    { text: "ki.", duration: 0.28, begin: 179.8, index: 624 },
    { text: " Ar", duration: 0.28, begin: 181.2, index: 625 },
    { text: "tık", duration: 0.28, begin: 181.4, index: 626 },
    { text: " es", duration: 0.28, begin: 181.6, index: 627 },
    { text: "ki", duration: 0.28, begin: 181.8, index: 628 },
    { text: "si", duration: 0.28, begin: 182.0, index: 629 },
    { text: " gi", duration: 0.28, begin: 182.2, index: 630 },
    { text: "bi", duration: 0.28, begin: 182.4, index: 631 },
    { text: " yaş", duration: 0.28, begin: 183.2, index: 632 },
    { text: "lı", duration: 0.28, begin: 183.4, index: 633 },
    { text: " ba", duration: 0.28, begin: 183.6, index: 634 },
    { text: "ya", duration: 0.28, begin: 183.8, index: 635 },
    { text: "nın", duration: 0.28, begin: 184.0, index: 636 },
    { text: " göz", duration: 0.28, begin: 184.4, index: 637 },
    { text: "le", duration: 0.28, begin: 184.6, index: 638 },
    { text: "ri", duration: 0.28, begin: 184.8, index: 639 },
    { text: "nin", duration: 0.28, begin: 185.0, index: 640 },
    { text: " i", duration: 0.13, begin: 185.2, index: 641 },
    { text: "çi", duration: 0.13, begin: 185.4, index: 642 },
    { text: "ne", duration: 0.13, begin: 185.6, index: 643 },
    { text: " ba", duration: 0.13, begin: 185.8, index: 644 },
    { text: "ka", duration: 0.13, begin: 186.0, index: 645 },
    { text: "bi", duration: 0.13, begin: 186.2, index: 646 },
    { text: "le", duration: 0.13, begin: 186.5, index: 647 },
    { text: "ce", duration: 0.13, begin: 186.6, index: 648 },
    { text: "ği", duration: 0.13, begin: 186.7, index: 649 },
    { text: "mi", duration: 0.13, begin: 186.8, index: 650 },
    { text: " dü", duration: 0.28, begin: 187.0, index: 651 },
    { text: "şü", duration: 0.28, begin: 187.2, index: 652 },
    { text: "ne", duration: 0.28, begin: 187.4, index: 653 },
    { text: "rek", duration: 0.28, begin: 187.6, index: 654 },
    { text: " mut", duration: 0.28, begin: 188.6, index: 655 },
    { text: "lu", duration: 0.28, begin: 188.8, index: 656 },
    { text: "luk", duration: 0.28, begin: 189.0, index: 657 },
    { text: " du", duration: 0.28, begin: 189.2, index: 658 },
    { text: "yu", duration: 0.28, begin: 189.4, index: 659 },
    { text: "yor", duration: 0.28, begin: 189.6, index: 660 },
    { text: "dum.", duration: 0.28, begin: 189.8, index: 661 },
    { text: " Er", duration: 0.28, begin: 191.0, index: 662 },
    { text: "te", duration: 0.28, begin: 191.2, index: 663 },
    { text: "si", duration: 0.28, begin: 191.4, index: 664 },
    { text: " gün", duration: 0.28, begin: 191.6, index: 665 },
    { text: " ka", duration: 0.28, begin: 192.0, index: 666 },
    { text: "pı", duration: 0.28, begin: 192.2, index: 667 },
    { text: "sı", duration: 0.28, begin: 192.4, index: 668 },
    { text: "nı", duration: 0.28, begin: 192.6, index: 669 },
    { text: " ça", duration: 0.28, begin: 192.8, index: 670 },
    { text: "lıp", duration: 0.28, begin: 193.0, index: 671 },
    { text: " ga", duration: 0.28, begin: 193.6, index: 672 },
    { text: "ze", duration: 0.28, begin: 193.8, index: 673 },
    { text: "te", duration: 0.28, begin: 194.0, index: 674 },
    { text: "si", duration: 0.28, begin: 194.2, index: 675 },
    { text: "ni", duration: 0.28, begin: 194.4, index: 676 },
    { text: " u", duration: 0.28, begin: 194.6, index: 677 },
    { text: "zat", duration: 0.28, begin: 194.8, index: 678 },
    { text: "tı", duration: 0.28, begin: 195.0, index: 679 },
    { text: "ğım", duration: 0.28, begin: 195.2, index: 680 },
    { text: " za", duration: 0.28, begin: 195.4, index: 681 },
    { text: "man", duration: 0.28, begin: 195.6, index: 682 },
    { text: " her", duration: 0.28, begin: 196.4, index: 683 },
    { text: " za", duration: 0.28, begin: 196.6, index: 684 },
    { text: "man", duration: 0.28, begin: 196.8, index: 685 },
    { text: " ki", duration: 0.28, begin: 197.0, index: 686 },
    { text: " gi", duration: 0.28, begin: 197.2, index: 687 },
    { text: "bi", duration: 0.28, begin: 197.4, index: 688 },
    { text: " iç", duration: 0.28, begin: 197.8, index: 689 },
    { text: "ten", duration: 0.28, begin: 198.0, index: 690 },
    { text: "lik", duration: 0.28, begin: 198.2, index: 691 },
    { text: "le", duration: 0.28, begin: 198.4, index: 692 },
    { text: " gü", duration: 0.28, begin: 198.6, index: 693 },
    { text: "lüm", duration: 0.28, begin: 198.8, index: 694 },
    { text: "se", duration: 0.28, begin: 199.0, index: 695 },
    { text: "di", duration: 0.28, begin: 199.2, index: 696 },
    { text: " göz", duration: 0.28, begin: 199.4, index: 697 },
    { text: "le", duration: 0.28, begin: 199.6, index: 698 },
    { text: "ri", duration: 0.28, begin: 199.8, index: 699 },
    { text: "me.", duration: 0.28, begin: 200.0, index: 700 },
    { text: " Bu", duration: 0.28, begin: 201.2, index: 701 },
    { text: " kez", duration: 0.28, begin: 201.4, index: 702 },
    { text: " ben", duration: 0.28, begin: 201.6, index: 703 },
    { text: "de", duration: 0.28, begin: 201.8, index: 704 },
    { text: " kar", duration: 0.28, begin: 202.0, index: 705 },
    { text: "şı", duration: 0.28, begin: 202.2, index: 706 },
    { text: "lık", duration: 0.28, begin: 202.4, index: 707 },
    { text: " ve", duration: 0.28, begin: 202.8, index: 708 },
    { text: "re", duration: 0.28, begin: 203.0, index: 709 },
    { text: "rek,", duration: 0.28, begin: 203.2, index: 710 },
    { text: " göz", duration: 0.28, begin: 204.0, index: 711 },
    { text: "le", duration: 0.28, begin: 204.2, index: 712 },
    { text: "ri", duration: 0.28, begin: 204.4, index: 713 },
    { text: "nin", duration: 0.28, begin: 204.6, index: 714 },
    { text: " i", duration: 0.28, begin: 204.8, index: 715 },
    { text: "çi", duration: 0.28, begin: 205.0, index: 716 },
    { text: "ne", duration: 0.28, begin: 205.2, index: 717 },
    { text: " bak", duration: 0.28, begin: 205.4, index: 718 },
    { text: "tım.", duration: 0.28, begin: 205.6, index: 719 },
    { text: " Tam", duration: 0.28, begin: 206.8, index: 720 },
    { text: " ar", duration: 0.28, begin: 207.0, index: 721 },
    { text: "ka", duration: 0.28, begin: 207.2, index: 722 },
    { text: "mı", duration: 0.28, begin: 207.4, index: 723 },
    { text: " dö", duration: 0.28, begin: 207.6, index: 724 },
    { text: "nüp", duration: 0.28, begin: 207.8, index: 725 },
    { text: " gi", duration: 0.28, begin: 208.0, index: 726 },
    { text: "de", duration: 0.28, begin: 208.2, index: 727 },
    { text: "ce", duration: 0.28, begin: 208.4, index: 728 },
    { text: "ğim", duration: 0.28, begin: 208.6, index: 729 },
    { text: " an", duration: 0.28, begin: 208.8, index: 730 },
    { text: "da;", duration: 0.28, begin: 209.0, index: 731 },
    { text: ' "Ah,', duration: 0.28, begin: 210.2, index: 732 },
    { text: " bir", duration: 0.28, begin: 210.8, index: 733 },
    { text: " da", duration: 0.28, begin: 211.0, index: 734 },
    { text: "ki", duration: 0.28, begin: 211.2, index: 735 },
    { text: "ka,", duration: 0.28, begin: 211.4, index: 736 },
    { text: " ne", duration: 0.28, begin: 212.4, index: 737 },
    { text: "re", duration: 0.28, begin: 212.6, index: 738 },
    { text: "dey", duration: 0.28, begin: 212.8, index: 739 },
    { text: "se", duration: 0.28, begin: 213.0, index: 740 },
    { text: " u", duration: 0.28, begin: 213.2, index: 741 },
    { text: "nu", duration: 0.28, begin: 213.4, index: 742 },
    { text: "tu", duration: 0.28, begin: 213.6, index: 743 },
    { text: "yor", duration: 0.28, begin: 213.8, index: 744 },
    { text: "dum,", duration: 0.28, begin: 214.0, index: 745 },
    { text: " al", duration: 0.28, begin: 214.8, index: 746 },
    { text: " ba", duration: 0.28, begin: 215.0, index: 747 },
    { text: "ka", duration: 0.28, begin: 215.2, index: 748 },
    { text: "lım", duration: 0.28, begin: 215.4, index: 749 },
    { text: " bu", duration: 0.28, begin: 216.2, index: 750 },
    { text: " ku", duration: 0.28, begin: 216.4, index: 751 },
    { text: "ra", duration: 0.28, begin: 216.6, index: 752 },
    { text: "bi", duration: 0.28, begin: 216.8, index: 753 },
    { text: "ye", duration: 0.28, begin: 217.0, index: 754 },
    { text: "ler", duration: 0.28, begin: 217.2, index: 755 },
    { text: " se", duration: 0.28, begin: 217.6, index: 756 },
    { text: "nin", duration: 0.28, begin: 217.8, index: 757 },
    { text: " i", duration: 0.28, begin: 218.0, index: 758 },
    { text: 'çin"', duration: 0.28, begin: 218.2, index: 759 },
    { text: " di", duration: 0.28, begin: 218.8, index: 760 },
    { text: "ye", duration: 0.28, begin: 219.0, index: 761 },
    { text: "rek", duration: 0.28, begin: 219.2, index: 762 },
    { text: " e", duration: 0.28, begin: 219.6, index: 763 },
    { text: "lin", duration: 0.28, begin: 219.8, index: 764 },
    { text: "de", duration: 0.28, begin: 220.0, index: 765 },
    { text: "ki", duration: 0.28, begin: 220.2, index: 766 },
    { text: " pa", duration: 0.28, begin: 220.4, index: 767 },
    { text: "ke", duration: 0.28, begin: 220.6, index: 768 },
    { text: "ti", duration: 0.28, begin: 220.8, index: 769 },
    { text: " u", duration: 0.28, begin: 221.0, index: 770 },
    { text: "zat", duration: 0.28, begin: 221.2, index: 771 },
    { text: "tı.", duration: 0.28, begin: 221.4, index: 772 },
    { text: " Ev", duration: 0.28, begin: 222.6, index: 773 },
    { text: "den", duration: 0.28, begin: 222.8, index: 774 },
    { text: " u", duration: 0.28, begin: 223.2, index: 775 },
    { text: "zak", duration: 0.28, begin: 223.4, index: 776 },
    { text: "la", duration: 0.28, begin: 223.6, index: 777 },
    { text: "şır", duration: 0.28, begin: 223.8, index: 778 },
    { text: "ken", duration: 0.28, begin: 224.0, index: 779 },
    { text: " ne", duration: 0.28, begin: 224.8, index: 780 },
    { text: "şe", duration: 0.28, begin: 225.0, index: 781 },
    { text: " i", duration: 0.28, begin: 225.2, index: 782 },
    { text: "çin", duration: 0.28, begin: 225.4, index: 783 },
    { text: "de", duration: 0.28, begin: 225.6, index: 784 },
    { text: " ku", duration: 0.28, begin: 225.8, index: 785 },
    { text: "ra", duration: 0.28, begin: 226.0, index: 786 },
    { text: "bi", duration: 0.28, begin: 226.2, index: 787 },
    { text: "ye", duration: 0.28, begin: 226.4, index: 788 },
    { text: "le", duration: 0.28, begin: 226.6, index: 789 },
    { text: "ri", duration: 0.28, begin: 226.8, index: 790 },
    { text: " ye", duration: 0.28, begin: 227.0, index: 791 },
    { text: "me", duration: 0.28, begin: 227.2, index: 792 },
    { text: "ye", duration: 0.28, begin: 227.4, index: 793 },
    { text: " baş", duration: 0.28, begin: 227.6, index: 794 },
    { text: "la", duration: 0.28, begin: 227.8, index: 795 },
    { text: "dım.", duration: 0.28, begin: 228.0, index: 796 },
    { text: " Bir", duration: 0.28, begin: 229.0, index: 797 },
    { text: " kaç", duration: 0.28, begin: 229.2, index: 798 },
    { text: " ku", duration: 0.28, begin: 229.4, index: 799 },
    { text: "ra", duration: 0.28, begin: 229.6, index: 800 },
    { text: "bi", duration: 0.28, begin: 229.8, index: 801 },
    { text: "ye", duration: 0.28, begin: 230.0, index: 802 },
    { text: " ye", duration: 0.28, begin: 230.4, index: 803 },
    { text: "dik", duration: 0.28, begin: 230.6, index: 804 },
    { text: "ten", duration: 0.28, begin: 230.8, index: 805 },
    { text: " son", duration: 0.28, begin: 231.2, index: 806 },
    { text: "ra", duration: 0.28, begin: 231.4, index: 807 },
    { text: " pa", duration: 0.28, begin: 232.2, index: 808 },
    { text: "ket", duration: 0.28, begin: 232.4, index: 809 },
    { text: "te", duration: 0.28, begin: 232.6, index: 810 },
    { text: " bir", duration: 0.28, begin: 233.0, index: 811 },
    { text: " zarf", duration: 0.28, begin: 233.2, index: 812 },
    { text: " ol", duration: 0.28, begin: 233.4, index: 813 },
    { text: "du", duration: 0.28, begin: 233.6, index: 814 },
    { text: "ğu", duration: 0.28, begin: 233.8, index: 815 },
    { text: "nu", duration: 0.28, begin: 234.0, index: 816 },
    { text: " gör", duration: 0.28, begin: 234.2, index: 817 },
    { text: "düm.", duration: 0.28, begin: 234.4, index: 818 },
    { text: " Zar", duration: 0.28, begin: 235.8, index: 819 },
    { text: "fı", duration: 0.28, begin: 236.0, index: 820 },
    { text: " aç", duration: 0.28, begin: 236.2, index: 821 },
    { text: "tı", duration: 0.28, begin: 236.4, index: 822 },
    { text: "ğım", duration: 0.28, begin: 236.6, index: 823 },
    { text: " za", duration: 0.28, begin: 237.0, index: 824 },
    { text: "man", duration: 0.28, begin: 237.2, index: 825 },
    { text: " i", duration: 0.28, begin: 237.8, index: 826 },
    { text: "çin", duration: 0.28, begin: 238.0, index: 827 },
    { text: "de", duration: 0.28, begin: 238.2, index: 828 },
    { text: " ye", duration: 0.28, begin: 238.4, index: 829 },
    { text: "di", duration: 0.28, begin: 238.6, index: 830 },
    { text: " do", duration: 0.28, begin: 238.8, index: 831 },
    { text: "lar", duration: 0.28, begin: 239.0, index: 832 },
    { text: " ve", duration: 0.28, begin: 239.4, index: 833 },
    { text: " kı", duration: 0.28, begin: 240.2, index: 834 },
    { text: "sa", duration: 0.28, begin: 240.4, index: 835 },
    { text: " bir", duration: 0.28, begin: 240.6, index: 836 },
    { text: " not", duration: 0.28, begin: 240.8, index: 837 },
    { text: " var", duration: 0.28, begin: 241.2, index: 838 },
    { text: "dı:", duration: 0.28, begin: 241.4, index: 839 },
    { text: ' "Se', duration: 0.28, begin: 242.4, index: 840 },
    { text: "nin", duration: 0.28, begin: 242.6, index: 841 },
    { text: "le", duration: 0.28, begin: 242.8, index: 842 },
    { text: " gu", duration: 0.28, begin: 243.0, index: 843 },
    { text: "rur", duration: 0.28, begin: 243.2, index: 844 },
    { text: " du", duration: 0.28, begin: 243.4, index: 845 },
    { text: "yu", duration: 0.28, begin: 243.6, index: 846 },
    { text: "yo", duration: 0.28, begin: 243.8, index: 847 },
    { text: 'rum!"', duration: 0.28, begin: 244.0, index: 848 },
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
                style={{
                  textDecoration:
                    activeIndex === segment.index ? undefined : "none",
                }}
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
                style={{
                  textDecoration:
                    activeIndex === segment.index ? undefined : "none",
                }}
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
                href="/dashboard/stories/stanford-universitesi"
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
            src="/4-7.mp3"
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
