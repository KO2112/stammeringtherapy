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
      text: "İ",
      duration: 0.53,
      begin: 0.3,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "yi",
      duration: 0.53,
      begin: 0.5,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Ör",
      duration: 0.53,
      begin: 0.75,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "nek",
      duration: 0.53,
      begin: 1.0,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Ol",
      duration: 0.53,
      begin: 1.25,
      index: 5,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "mak",
      duration: 0.53,
      begin: 1.5,
      index: 6,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Ok", duration: 0.53, begin: 2.75, index: 7 },
    { text: "la", duration: 0.53, begin: 3.0, index: 8 },
    { text: "ho", duration: 0.53, begin: 3.25, index: 9 },
    { text: "ma'", duration: 0.53, begin: 3.5, index: 10 },
    { text: "da", duration: 0.53, begin: 3.75, index: 11 },
    { text: " gü", duration: 0.53, begin: 4.5, index: 12 },
    { text: "neş", duration: 0.53, begin: 4.75, index: 13 },
    { text: "li", duration: 0.53, begin: 5.0, index: 14 },
    { text: " bir", duration: 0.53, begin: 5.25, index: 15 },
    { text: " cu", duration: 0.78, begin: 5.5, index: 16 },
    { text: "mar", duration: 0.78, begin: 5.75, index: 17 },
    { text: "te", duration: 0.78, begin: 6.0, index: 18 },
    { text: "si", duration: 0.78, begin: 6.25, index: 19 },
    { text: " öğ", duration: 0.53, begin: 7.0, index: 20 },
    { text: "le", duration: 0.53, begin: 7.25, index: 21 },
    { text: "den", duration: 0.53, begin: 7.5, index: 22 },
    { text: " son", duration: 0.53, begin: 7.75, index: 23 },
    { text: "ra", duration: 0.53, begin: 8.0, index: 24 },
    { text: "sı,", duration: 0.53, begin: 8.25, index: 25 },
    { text: " ar", duration: 0.53, begin: 9.5, index: 26 },
    { text: "ka", duration: 0.53, begin: 9.75, index: 27 },
    { text: "da", duration: 0.53, begin: 10.0, index: 28 },
    { text: "şım", duration: 0.53, begin: 10.25, index: 29 },
    { text: " i", duration: 0.53, begin: 11.25, index: 30 },
    { text: "ki", duration: 0.53, begin: 11.5, index: 31 },
    { text: " kü", duration: 0.53, begin: 11.75, index: 32 },
    { text: "çük", duration: 0.53, begin: 12.0, index: 33 },
    { text: " oğ", duration: 0.53, begin: 12.25, index: 34 },
    { text: "lu", duration: 0.53, begin: 12.5, index: 35 },
    { text: "nu", duration: 0.53, begin: 12.75, index: 36 },
    { text: " mi", duration: 0.53, begin: 13.5, index: 37 },
    { text: "ni", duration: 0.53, begin: 13.75, index: 38 },
    { text: " golf", duration: 0.53, begin: 14.0, index: 39 },
    { text: " oy", duration: 0.53, begin: 14.25, index: 40 },
    { text: "na", duration: 0.53, begin: 14.5, index: 41 },
    { text: "ma", duration: 0.53, begin: 14.75, index: 42 },
    { text: "ya", duration: 0.53, begin: 15.0, index: 43 },
    { text: " gö", duration: 0.53, begin: 15.25, index: 44 },
    { text: "tür", duration: 0.53, begin: 15.5, index: 45 },
    { text: "müş.", duration: 0.53, begin: 15.75, index: 46 },
    { text: " Bi", duration: 0.63, begin: 17.25, index: 47 },
    { text: "let", duration: 0.63, begin: 17.5, index: 48 },
    { text: "çi", duration: 0.63, begin: 17.75, index: 49 },
    { text: "ye", duration: 0.63, begin: 18.0, index: 50 },
    { text: " yak", duration: 0.63, begin: 18.25, index: 51 },
    { text: "laş", duration: 0.63, begin: 18.5, index: 52 },
    { text: "mış", duration: 0.63, begin: 18.75, index: 53 },
    { text: " ve:", duration: 0.63, begin: 19.25, index: 54 },
    { text: " Bi", duration: 0.53, begin: 20.5, index: 55 },
    { text: "let", duration: 0.53, begin: 20.75, index: 56 },
    { text: "ler", duration: 0.53, begin: 21.0, index: 57 },
    { text: " kaç", duration: 0.53, begin: 21.25, index: 58 },
    { text: " do", duration: 0.53, begin: 21.5, index: 59 },
    { text: "lar?", duration: 0.53, begin: 21.75, index: 60 },
    { text: " di", duration: 0.53, begin: 22.75, index: 61 },
    { text: "ye", duration: 0.53, begin: 23.0, index: 62 },
    { text: " sor", duration: 0.53, begin: 23.25, index: 63 },
    { text: "muş.", duration: 0.53, begin: 23.5, index: 64 },
    { text: " Bi", duration: 0.53, begin: 25.0, index: 65 },
    { text: "let", duration: 0.53, begin: 25.25, index: 66 },
    { text: " sa", duration: 0.53, begin: 25.5, index: 67 },
    { text: "tan", duration: 0.53, begin: 25.75, index: 68 },
    { text: " a", duration: 0.53, begin: 26.0, index: 69 },
    { text: "dam:", duration: 0.53, begin: 26.25, index: 70 },
    { text: " Bü", duration: 0.53, begin: 27.25, index: 71 },
    { text: "yük", duration: 0.53, begin: 27.5, index: 72 },
    { text: "ler", duration: 0.53, begin: 27.75, index: 73 },
    { text: " üç", duration: 0.53, begin: 28.0, index: 74 },
    { text: " do", duration: 0.53, begin: 28.25, index: 75 },
    { text: "lar,", duration: 0.53, begin: 28.5, index: 76 },
    { text: " da", duration: 0.53, begin: 29.75, index: 77 },
    { text: "ha", duration: 0.53, begin: 30.0, index: 78 },
    { text: " doğ", duration: 0.53, begin: 30.25, index: 79 },
    { text: "ru", duration: 0.53, begin: 30.5, index: 80 },
    { text: "su", duration: 0.53, begin: 30.75, index: 81 },
    { text: " al", duration: 0.53, begin: 31.75, index: 82 },
    { text: "tı", duration: 0.53, begin: 32.0, index: 83 },
    { text: " ya", duration: 0.53, begin: 32.25, index: 84 },
    { text: "şın", duration: 0.53, begin: 32.5, index: 85 },
    { text: "dan", duration: 0.53, begin: 32.75, index: 86 },
    { text: " bü", duration: 0.28, begin: 33.5, index: 87 },
    { text: "yük", duration: 0.28, begin: 33.75, index: 88 },
    { text: " her", duration: 0.53, begin: 34.5, index: 89 },
    { text: "kes", duration: 0.53, begin: 34.75, index: 90 },
    { text: " üç", duration: 0.53, begin: 35.0, index: 91 },
    { text: " do", duration: 0.53, begin: 35.25, index: 92 },
    { text: "lar.", duration: 0.53, begin: 35.5, index: 93 },
    { text: " Al", duration: 0.53, begin: 37.0, index: 94 },
    { text: "tı", duration: 0.53, begin: 37.25, index: 95 },
    { text: " ve", duration: 0.53, begin: 37.5, index: 96 },
    { text: " al", duration: 0.53, begin: 38.25, index: 97 },
    { text: "tı", duration: 0.53, begin: 38.5, index: 98 },
    { text: " ya", duration: 0.53, begin: 38.75, index: 99 },
    { text: "şın", duration: 0.53, begin: 39.0, index: 100 },
    { text: " al", duration: 0.53, begin: 39.25, index: 101 },
    { text: "tın", duration: 0.53, begin: 39.5, index: 102 },
    { text: "da", duration: 0.53, begin: 39.75, index: 103 },
    { text: "ki", duration: 0.53, begin: 40.0, index: 104 },
    { text: "le", duration: 0.53, begin: 40.25, index: 105 },
    { text: "ri", duration: 0.53, begin: 40.5, index: 106 },
    { text: " be", duration: 0.53, begin: 41.5, index: 107 },
    { text: "da", duration: 0.53, begin: 41.75, index: 108 },
    { text: "va", duration: 0.53, begin: 42.0, index: 109 },
    { text: " a", duration: 0.53, begin: 42.25, index: 110 },
    { text: "lı", duration: 0.53, begin: 42.5, index: 111 },
    { text: "yo", duration: 0.53, begin: 42.75, index: 112 },
    { text: "ruz", duration: 0.53, begin: 43.0, index: 113 },
    { text: " de", duration: 0.53, begin: 43.75, index: 114 },
    { text: "miş.", duration: 0.53, begin: 44.0, index: 115 },
    { text: " Ço", duration: 0.53, begin: 45.25, index: 116 },
    { text: "cuk", duration: 0.53, begin: 45.5, index: 117 },
    { text: "la", duration: 0.53, begin: 45.75, index: 118 },
    { text: "rı", duration: 0.53, begin: 46.0, index: 119 },
    { text: "nız", duration: 0.53, begin: 46.25, index: 120 },
    { text: " kaç", duration: 0.53, begin: 46.5, index: 121 },
    { text: " ya", duration: 0.53, begin: 47.0, index: 122 },
    { text: "şın", duration: 0.53, begin: 47.25, index: 123 },
    { text: "da", duration: 0.53, begin: 47.5, index: 124 },
    { text: "lar?", duration: 0.53, begin: 47.75, index: 125 },
    { text: " di", duration: 0.28, begin: 49.0, index: 126 },
    { text: "ye", duration: 0.28, begin: 49.25, index: 127 },
    { text: " sor", duration: 0.53, begin: 49.5, index: 128 },
    { text: "muş.", duration: 0.53, begin: 49.75, index: 129 },
    { text: " A", duration: 0.53, begin: 51.0, index: 130 },
    { text: "vu", duration: 0.53, begin: 51.25, index: 131 },
    { text: "kat", duration: 0.53, begin: 51.5, index: 132 },
    { text: " üç,", duration: 0.53, begin: 51.75, index: 133 },
    { text: " dok", duration: 0.53, begin: 52.75, index: 134 },
    { text: "tor", duration: 0.53, begin: 53.0, index: 135 },
    { text: " ye", duration: 0.53, begin: 53.25, index: 136 },
    { text: "di", duration: 0.53, begin: 53.5, index: 137 },
    { text: " ya", duration: 0.53, begin: 53.75, index: 138 },
    { text: "şın", duration: 0.53, begin: 54.0, index: 139 },
    { text: "da.", duration: 0.53, begin: 54.25, index: 140 },
    { text: " Sa", duration: 0.53, begin: 55.5, index: 141 },
    { text: "nı", duration: 0.53, begin: 55.75, index: 142 },
    { text: "rım", duration: 0.53, begin: 56.0, index: 143 },
    { text: " si", duration: 0.53, begin: 56.25, index: 144 },
    { text: "ze", duration: 0.53, begin: 56.5, index: 145 },
    { text: " al", duration: 0.53, begin: 57.25, index: 146 },
    { text: "tı", duration: 0.53, begin: 57.5, index: 147 },
    { text: " do", duration: 0.53, begin: 57.75, index: 148 },
    { text: "lar", duration: 0.53, begin: 58.0, index: 149 },
    { text: " ve", duration: 0.53, begin: 58.25, index: 150 },
    { text: "re", duration: 0.53, begin: 58.5, index: 151 },
    { text: "ce", duration: 0.53, begin: 58.75, index: 152 },
    { text: "ğim.", duration: 0.53, begin: 59.0, index: 153 },
    { text: " Di", duration: 0.53, begin: 60.0, index: 154 },
    { text: "ye", duration: 0.53, begin: 60.25, index: 155 },
    { text: " ce", duration: 0.53, begin: 60.5, index: 156 },
    { text: "vap", duration: 0.53, begin: 60.75, index: 157 },
    { text: " ver", duration: 0.53, begin: 61.0, index: 158 },
    { text: "miş", duration: 0.53, begin: 61.25, index: 159 },
    { text: " ar", duration: 0.53, begin: 61.5, index: 160 },
    { text: "ka", duration: 0.53, begin: 61.75, index: 161 },
    { text: "da", duration: 0.53, begin: 62.0, index: 162 },
    { text: "şım.", duration: 0.53, begin: 62.25, index: 163 },
    { text: " Bi", duration: 0.53, begin: 63.75, index: 164 },
    { text: "let", duration: 0.53, begin: 64.0, index: 165 },
    { text: "çi:", duration: 0.53, begin: 64.25, index: 166 },
    { text: " Ba", duration: 0.53, begin: 65.25, index: 167 },
    { text: "yım", duration: 0.53, begin: 65.5, index: 168 },
    { text: " siz", duration: 0.53, begin: 66.5, index: 169 },
    { text: " pi", duration: 0.53, begin: 66.75, index: 170 },
    { text: "yan", duration: 0.53, begin: 67.0, index: 171 },
    { text: "go", duration: 0.53, begin: 67.25, index: 172 },
    { text: "dan", duration: 0.53, begin: 67.5, index: 173 },
    { text: " pa", duration: 0.53, begin: 68.5, index: 174 },
    { text: "ra", duration: 0.53, begin: 68.75, index: 175 },
    { text: " fi", duration: 0.53, begin: 68.9, index: 176 },
    { text: "lan", duration: 0.53, begin: 69.0, index: 177 },
    { text: " mı", duration: 0.53, begin: 69.25, index: 178 },
    { text: " ka", duration: 0.53, begin: 69.5, index: 179 },
    { text: "zan", duration: 0.53, begin: 69.75, index: 180 },
    { text: "dı", duration: 0.53, begin: 70.0, index: 181 },
    { text: "nız?", duration: 0.53, begin: 70.25, index: 182 },
    { text: " Üç", duration: 0.53, begin: 71.75, index: 183 },
    { text: " do", duration: 0.53, begin: 72.0, index: 184 },
    { text: "lar", duration: 0.53, begin: 72.25, index: 185 },
    { text: " ka", duration: 0.68, begin: 72.5, index: 186 },
    { text: "ra", duration: 0.68, begin: 72.75, index: 187 },
    { text: " ge", duration: 0.68, begin: 73.0, index: 188 },
    { text: "çe", duration: 0.68, begin: 73.25, index: 189 },
    { text: "bi", duration: 0.68, begin: 73.5, index: 190 },
    { text: "lir", duration: 0.68, begin: 73.75, index: 191 },
    { text: "di", duration: 0.68, begin: 74.0, index: 192 },
    { text: "niz.", duration: 0.68, begin: 74.25, index: 193 },
    { text: " Bü", duration: 0.53, begin: 75.75, index: 194 },
    { text: "yü", duration: 0.53, begin: 76.0, index: 195 },
    { text: "ğün", duration: 0.53, begin: 76.25, index: 196 },
    { text: " al", duration: 0.53, begin: 77.0, index: 197 },
    { text: "tı", duration: 0.53, begin: 77.25, index: 198 },
    { text: " ya", duration: 0.53, begin: 77.5, index: 199 },
    { text: "şın", duration: 0.53, begin: 77.75, index: 200 },
    { text: "da", duration: 0.53, begin: 78.0, index: 201 },
    { text: " ol", duration: 0.53, begin: 78.5, index: 202 },
    { text: "du", duration: 0.53, begin: 78.75, index: 203 },
    { text: "ğu", duration: 0.53, begin: 79.0, index: 204 },
    { text: "nu", duration: 0.53, begin: 79.25, index: 205 },
    { text: " söy", duration: 0.53, begin: 80.0, index: 206 },
    { text: "le", duration: 0.53, begin: 80.25, index: 207 },
    { text: "ye", duration: 0.53, begin: 80.5, index: 208 },
    { text: "bi", duration: 0.53, begin: 80.75, index: 209 },
    { text: "lir", duration: 0.53, begin: 81.0, index: 210 },
    { text: "di", duration: 0.53, begin: 81.25, index: 211 },
    { text: "niz.", duration: 0.53, begin: 81.5, index: 212 },
    { text: " Ben", duration: 0.53, begin: 83.0, index: 213 },
    { text: " ne", duration: 0.53, begin: 83.25, index: 214 },
    { text: "re", duration: 0.53, begin: 83.5, index: 215 },
    { text: "den", duration: 0.53, begin: 83.75, index: 216 },
    { text: " an", duration: 0.53, begin: 84.0, index: 217 },
    { text: "la", duration: 0.53, begin: 84.25, index: 218 },
    { text: " ya", duration: 0.53, begin: 84.5, index: 219 },
    { text: "cak", duration: 0.53, begin: 84.75, index: 220 },
    { text: "tım?", duration: 0.53, begin: 85.0, index: 221 },
    { text: " di", duration: 0.53, begin: 85.75, index: 222 },
    { text: "ye", duration: 0.53, begin: 86.0, index: 223 },
    { text: " yo", duration: 0.53, begin: 86.25, index: 224 },
    { text: "rum", duration: 0.53, begin: 86.5, index: 225 },
    { text: "da", duration: 0.53, begin: 86.75, index: 226 },
    { text: " bu", duration: 0.53, begin: 87.0, index: 227 },
    { text: "lun", duration: 0.53, begin: 87.25, index: 228 },
    { text: "muş.", duration: 0.53, begin: 87.5, index: 229 },
    { text: " Ar", duration: 0.53, begin: 89.0, index: 230 },
    { text: "ka", duration: 0.53, begin: 89.25, index: 231 },
    { text: "da", duration: 0.53, begin: 89.5, index: 232 },
    { text: "şım", duration: 0.53, begin: 89.75, index: 233 },
    { text: " i", duration: 0.53, begin: 90.0, index: 234 },
    { text: "se:", duration: 0.53, begin: 90.25, index: 235 },
    { text: " E", duration: 0.53, begin: 91.25, index: 236 },
    { text: "vet,", duration: 0.53, begin: 91.5, index: 237 },
    { text: " bu", duration: 0.53, begin: 92.75, index: 238 },
    { text: " doğ", duration: 0.53, begin: 93.0, index: 239 },
    { text: "ru", duration: 0.53, begin: 93.25, index: 240 },
    { text: " o", duration: 0.53, begin: 93.5, index: 241 },
    { text: "la", duration: 0.53, begin: 93.75, index: 242 },
    { text: "bi", duration: 0.53, begin: 94.0, index: 243 },
    { text: "lir,", duration: 0.53, begin: 94.25, index: 244 },
    { text: " a", duration: 0.53, begin: 95.0, index: 245 },
    { text: "ma", duration: 0.53, begin: 95.25, index: 246 },
    { text: " ço", duration: 0.53, begin: 95.5, index: 247 },
    { text: "cuk", duration: 0.53, begin: 95.75, index: 248 },
    { text: "lar", duration: 0.53, begin: 96.0, index: 249 },
    { text: " doğ", duration: 0.53, begin: 96.75, index: 250 },
    { text: "ru", duration: 0.53, begin: 97.0, index: 251 },
    { text: "nun", duration: 0.53, begin: 97.25, index: 252 },
    { text: " ne", duration: 0.53, begin: 98.0, index: 253 },
    { text: " ol", duration: 0.53, begin: 98.25, index: 254 },
    { text: "du", duration: 0.53, begin: 98.5, index: 255 },
    { text: "ğu", duration: 0.53, begin: 98.75, index: 256 },
    { text: "nu", duration: 0.53, begin: 99.0, index: 257 },
    { text: " bi", duration: 0.53, begin: 99.25, index: 258 },
    { text: "li", duration: 0.53, begin: 99.5, index: 259 },
    { text: "yor", duration: 0.53, begin: 99.75, index: 260 },
    { text: "lar", duration: 0.53, begin: 100.0, index: 261 },
    { text: " de", duration: 0.53, begin: 100.75, index: 262 },
    { text: "miş.", duration: 0.53, begin: 101.0, index: 263 },
    { text: " Em", duration: 0.53, begin: 102.5, index: 264 },
    { text: "er", duration: 0.53, begin: 102.75, index: 265 },
    { text: "son'", duration: 0.53, begin: 103.0, index: 266 },
    { text: "un", duration: 0.53, begin: 103.25, index: 267 },
    { text: " da", duration: 0.53, begin: 103.5, index: 268 },
    { text: " de", duration: 0.53, begin: 103.75, index: 269 },
    { text: "di", duration: 0.53, begin: 104.0, index: 270 },
    { text: "ği", duration: 0.53, begin: 104.25, index: 271 },
    { text: " gi", duration: 0.53, begin: 104.5, index: 272 },
    { text: "bi:", duration: 0.53, begin: 104.75, index: 273 },
    { text: " Kim", duration: 0.53, begin: 105.75, index: 274 },
    { text: " ol", duration: 0.53, begin: 106.0, index: 275 },
    { text: "du", duration: 0.53, begin: 106.25, index: 276 },
    { text: "ğun", duration: 0.53, begin: 106.5, index: 277 },
    { text: " söy", duration: 0.53, begin: 107.75, index: 278 },
    { text: "le", duration: 0.53, begin: 108.0, index: 279 },
    { text: "dik", duration: 0.53, begin: 108.25, index: 280 },
    { text: "le", duration: 0.53, begin: 108.5, index: 281 },
    { text: "ri", duration: 0.53, begin: 108.75, index: 282 },
    { text: "ni", duration: 0.53, begin: 109.0, index: 283 },
    { text: " o", duration: 0.53, begin: 109.75, index: 284 },
    { text: " ka", duration: 0.53, begin: 110.0, index: 285 },
    { text: "dar", duration: 0.53, begin: 110.25, index: 286 },
    { text: " göl", duration: 0.53, begin: 110.5, index: 287 },
    { text: "ge", duration: 0.53, begin: 110.75, index: 288 },
    { text: "li", duration: 0.53, begin: 111.0, index: 289 },
    { text: "yor", duration: 0.53, begin: 111.25, index: 290 },
    { text: " ki", duration: 0.53, begin: 112.25, index: 291 },
    { text: " ne", duration: 0.53, begin: 112.75, index: 292 },
    { text: " de", duration: 0.53, begin: 113.0, index: 293 },
    { text: "di", duration: 0.5, begin: 113.25, index: 294 },
    { text: "ği", duration: 0.53, begin: 113.5, index: 295 },
    { text: "ni", duration: 0.53, begin: 113.75, index: 296 },
    { text: " bir", duration: 0.53, begin: 114.75, index: 297 },
    { text: " tür", duration: 0.53, begin: 115.0, index: 298 },
    { text: "lü", duration: 0.53, begin: 115.25, index: 299 },
    { text: " du", duration: 0.53, begin: 115.5, index: 300 },
    { text: "ya", duration: 0.53, begin: 115.75, index: 301 },
    { text: "mı", duration: 0.53, begin: 116.0, index: 302 },
    { text: "yo", duration: 0.53, begin: 116.25, index: 303 },
    { text: "rum.", duration: 0.53, begin: 116.5, index: 304 },
    { text: " Risk", duration: 0.53, begin: 117.75, index: 305 },
    { text: "li", duration: 0.53, begin: 118.0, index: 306 },
    { text: " an", duration: 0.53, begin: 118.5, index: 307 },
    { text: "lar", duration: 0.53, begin: 118.75, index: 308 },
    { text: "da", duration: 0.53, begin: 119.0, index: 309 },
    { text: " ah", duration: 0.53, begin: 120.25, index: 310 },
    { text: "la", duration: 0.53, begin: 120.5, index: 311 },
    { text: "ki", duration: 0.53, begin: 120.75, index: 312 },
    { text: " de", duration: 0.53, begin: 121.0, index: 313 },
    { text: "ğer", duration: 0.53, begin: 121.25, index: 314 },
    { text: "ler", duration: 0.53, begin: 121.5, index: 315 },
    { text: " her", duration: 0.53, begin: 122.75, index: 316 },
    { text: "za", duration: 0.53, begin: 123.0, index: 317 },
    { text: "man", duration: 0.53, begin: 123.25, index: 318 },
    { text: "kin", duration: 0.53, begin: 123.5, index: 319 },
    { text: "den", duration: 0.53, begin: 123.75, index: 320 },
    { text: " da", duration: 0.48, begin: 124.75, index: 321 },
    { text: "ha", duration: 0.48, begin: 125.0, index: 322 },
    { text: " a", duration: 0.48, begin: 125.25, index: 323 },
    { text: "ğır", duration: 0.48, begin: 125.5, index: 324 },
    { text: " bas", duration: 0.48, begin: 126.0, index: 325 },
    { text: "tı", duration: 0.48, begin: 126.25, index: 326 },
    { text: "ğı", duration: 0.48, begin: 126.5, index: 327 },
    { text: " an", duration: 0.53, begin: 126.75, index: 328 },
    { text: " bir", duration: 0.53, begin: 128.0, index: 329 },
    { text: "lik", duration: 0.53, begin: 128.25, index: 330 },
    { text: "te", duration: 0.53, begin: 128.5, index: 331 },
    { text: " ya", duration: 0.53, begin: 128.75, index: 332 },
    { text: "şa", duration: 0.53, begin: 129.0, index: 333 },
    { text: "dı", duration: 0.53, begin: 129.25, index: 334 },
    { text: "ğı", duration: 0.53, begin: 129.5, index: 335 },
    { text: "nız", duration: 0.53, begin: 129.75, index: 336 },
    { text: " ve", duration: 0.53, begin: 130.25, index: 337 },
    { text: " ça", duration: 0.53, begin: 131.0, index: 338 },
    { text: "lış", duration: 0.53, begin: 131.25, index: 339 },
    { text: "tı", duration: 0.53, begin: 131.5, index: 340 },
    { text: "ğı", duration: 0.53, begin: 131.75, index: 341 },
    { text: "nız", duration: 0.53, begin: 132.0, index: 342 },
    { text: " in", duration: 0.53, begin: 132.25, index: 343 },
    { text: "san", duration: 0.53, begin: 132.5, index: 344 },
    { text: "la", duration: 0.53, begin: 132.75, index: 345 },
    { text: "ra", duration: 0.53, begin: 133.0, index: 346 },
    { text: " i", duration: 0.53, begin: 134.0, index: 347 },
    { text: "yi", duration: 0.53, begin: 134.25, index: 348 },
    { text: " ör", duration: 0.53, begin: 134.5, index: 349 },
    { text: "nek", duration: 0.53, begin: 134.75, index: 350 },
    { text: " ol", duration: 0.53, begin: 135.25, index: 351 },
    { text: "ma", duration: 0.53, begin: 135.5, index: 352 },
    { text: "nız", duration: 0.53, begin: 135.75, index: 353 },
    { text: " ge", duration: 0.53, begin: 136.0, index: 354 },
    { text: "rek", duration: 0.53, begin: 136.25, index: 355 },
    { text: "ti", duration: 0.53, begin: 136.5, index: 356 },
    { text: "ği", duration: 0.53, begin: 136.75, index: 357 },
    { text: "ni", duration: 0.53, begin: 137.0, index: 358 },
    { text: " u", duration: 0.53, begin: 138.0, index: 359 },
    { text: "nut", duration: 0.53, begin: 138.25, index: 360 },
    { text: "ma", duration: 0.53, begin: 138.5, index: 361 },
    { text: "yı", duration: 0.53, begin: 138.75, index: 362 },
    { text: "nız.", duration: 0.53, begin: 139.0, index: 363 },
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
                href="/dashboard/stories/gurultu"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/ozgur-kuslar"
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
            src="/1-4.mp3"
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
