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
      text: "Bam",
      duration: 0.53,
      begin: 0.5,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "bu",
      duration: 0.53,
      begin: 0.75,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " A",
      duration: 0.53,
      begin: 1.0,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ğa",
      duration: 0.53,
      begin: 1.25,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "cı",
      duration: 0.53,
      begin: 1.5,
      index: 5,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Bam", duration: 0.53, begin: 2.5, index: 6 },
    { text: "bu", duration: 0.53, begin: 2.75, index: 7 },
    { text: " a", duration: 0.53, begin: 3.0, index: 8 },
    { text: "ğa", duration: 0.53, begin: 3.25, index: 9 },
    { text: "cı", duration: 0.53, begin: 3.5, index: 10 },
    { text: " sa", duration: 0.38, begin: 4.25, index: 11 },
    { text: "de", duration: 0.38, begin: 4.5, index: 12 },
    { text: "ce", duration: 0.38, begin: 4.75, index: 13 },
    { text: " Çin'", duration: 0.53, begin: 5.0, index: 14 },
    { text: "de", duration: 0.53, begin: 5.25, index: 15 },
    { text: " ye", duration: 0.38, begin: 5.5, index: 16 },
    { text: "ti", duration: 0.38, begin: 5.75, index: 17 },
    { text: "şi", duration: 0.38, begin: 6.0, index: 18 },
    { text: "yor.", duration: 0.38, begin: 6.25, index: 19 },
    { text: " Pe", duration: 0.38, begin: 7.25, index: 20 },
    { text: "ki,", duration: 0.38, begin: 7.5, index: 21 },
    { text: " Tür", duration: 0.53, begin: 8.0, index: 22 },
    { text: "ki", duration: 0.53, begin: 8.25, index: 23 },
    { text: "ye'", duration: 0.53, begin: 8.5, index: 24 },
    { text: "de", duration: 0.53, begin: 8.75, index: 25 },
    { text: " ye", duration: 0.48, begin: 9.0, index: 26 },
    { text: "ti", duration: 0.48, begin: 9.25, index: 27 },
    { text: "şe", duration: 0.48, begin: 9.5, index: 28 },
    { text: "mez", duration: 0.48, begin: 9.75, index: 29 },
    { text: " mi?", duration: 0.48, begin: 10.0, index: 30 },
    { text: " Bel", duration: 0.53, begin: 11.0, index: 31 },
    { text: "ki", duration: 0.53, begin: 11.25, index: 32 },
    { text: " ik", duration: 0.53, begin: 12.25, index: 33 },
    { text: "lim", duration: 0.53, begin: 12.5, index: 34 },
    { text: " ö", duration: 0.38, begin: 12.75, index: 35 },
    { text: "zel", duration: 0.38, begin: 13.0, index: 36 },
    { text: "lik", duration: 0.38, begin: 13.25, index: 37 },
    { text: "le", duration: 0.38, begin: 13.5, index: 38 },
    { text: "ri", duration: 0.38, begin: 13.75, index: 39 },
    { text: " o", duration: 0.53, begin: 14.0, index: 40 },
    { text: "la", duration: 0.53, begin: 14.25, index: 41 },
    { text: "rak", duration: 0.53, begin: 14.5, index: 42 },
    { text: " ba", duration: 0.38, begin: 15.25, index: 43 },
    { text: "zı", duration: 0.38, begin: 15.5, index: 44 },
    { text: " yö", duration: 0.28, begin: 15.75, index: 45 },
    { text: "re", duration: 0.28, begin: 16.0, index: 46 },
    { text: "le", duration: 0.28, begin: 16.25, index: 47 },
    { text: "ri", duration: 0.28, begin: 16.5, index: 48 },
    { text: "miz", duration: 0.28, begin: 16.75, index: 49 },
    { text: "de", duration: 0.28, begin: 16.85, index: 50 },
    { text: " ye", duration: 0.53, begin: 17.0, index: 51 },
    { text: "ti", duration: 0.53, begin: 17.25, index: 52 },
    { text: "şe", duration: 0.53, begin: 17.5, index: 53 },
    { text: "bi", duration: 0.53, begin: 17.75, index: 54 },
    { text: "lir.", duration: 0.53, begin: 18.0, index: 55 },
    { text: " Yal", duration: 0.53, begin: 18.75, index: 56 },
    { text: "nız", duration: 0.53, begin: 19.0, index: 57 },
    { text: " bir", duration: 0.53, begin: 19.25, index: 58 },
    { text: " şar", duration: 0.53, begin: 19.5, index: 59 },
    { text: "tı", duration: 0.53, begin: 19.75, index: 60 },
    { text: " ha", duration: 0.53, begin: 20.5, index: 61 },
    { text: "tır", duration: 0.53, begin: 20.75, index: 62 },
    { text: "lat", duration: 0.68, begin: 21.0, index: 63 },
    { text: "mak", duration: 0.68, begin: 21.25, index: 64 },
    { text: " la", duration: 0.68, begin: 21.5, index: 65 },
    { text: "zım", duration: 0.68, begin: 21.75, index: 66 },
    { text: " ki,", duration: 0.68, begin: 22.0, index: 67 },
    { text: " Çin", duration: 0.53, begin: 23.75, index: 68 },
    { text: " bam", duration: 0.53, begin: 24.0, index: 69 },
    { text: "bu", duration: 0.53, begin: 24.25, index: 70 },
    { text: " a", duration: 0.53, begin: 24.5, index: 71 },
    { text: "ğa", duration: 0.53, begin: 24.75, index: 72 },
    { text: "cı", duration: 0.53, begin: 25.0, index: 73 },
    { text: " sa", duration: 0.53, begin: 25.75, index: 74 },
    { text: "bır", duration: 0.53, begin: 26.0, index: 75 },
    { text: " ve", duration: 0.53, begin: 26.25, index: 76 },
    { text: " se", duration: 0.53, begin: 26.75, index: 77 },
    { text: "bat", duration: 0.53, begin: 27.0, index: 78 },
    { text: " ge", duration: 0.53, begin: 27.25, index: 79 },
    { text: "rek", duration: 0.53, begin: 27.5, index: 80 },
    { text: "ti", duration: 0.53, begin: 27.75, index: 81 },
    { text: "ren", duration: 0.53, begin: 28.0, index: 82 },
    { text: " bir", duration: 0.53, begin: 28.25, index: 83 },
    { text: " a", duration: 0.53, begin: 28.5, index: 84 },
    { text: "ğaç", duration: 0.53, begin: 28.75, index: 85 },
    { text: "tır.", duration: 0.53, begin: 29.0, index: 86 },
    { text: " O", duration: 0.53, begin: 30.75, index: 87 },
    { text: "nu", duration: 0.53, begin: 31.0, index: 88 },
    { text: " ye", duration: 0.53, begin: 31.25, index: 89 },
    { text: "tiş", duration: 0.53, begin: 31.5, index: 90 },
    { text: "ti", duration: 0.53, begin: 31.75, index: 91 },
    { text: "rir", duration: 0.53, begin: 32.0, index: 92 },
    { text: "ken", duration: 0.53, begin: 32.25, index: 93 },
    { text: " çok", duration: 0.53, begin: 33.25, index: 94 },
    { text: " a", duration: 0.53, begin: 33.5, index: 95 },
    { text: "ma", duration: 0.53, begin: 34.0, index: 96 },
    { text: " çok", duration: 0.68, begin: 34.25, index: 97 },
    { text: " sab", duration: 0.68, begin: 34.5, index: 98 },
    { text: "ret", duration: 0.68, begin: 34.75, index: 99 },
    { text: "mek", duration: 0.68, begin: 35.0, index: 100 },
    { text: " ge", duration: 0.53, begin: 35.75, index: 101 },
    { text: "re", duration: 0.53, begin: 36.0, index: 102 },
    { text: "kir.", duration: 0.53, begin: 36.25, index: 103 },
    { text: " Top", duration: 0.53, begin: 37.5, index: 104 },
    { text: "ra", duration: 0.53, begin: 37.75, index: 105 },
    { text: "ğa", duration: 0.53, begin: 38.0, index: 106 },
    { text: " buğ", duration: 0.53, begin: 38.25, index: 107 },
    { text: "day", duration: 0.53, begin: 38.5, index: 108 },
    { text: " ve", duration: 0.68, begin: 38.75, index: 109 },
    { text: "ya", duration: 0.68, begin: 39.0, index: 110 },
    { text: " no", duration: 0.68, begin: 40.25, index: 111 },
    { text: "hut,", duration: 0.68, begin: 40.5, index: 112 },
    { text: " fa", duration: 0.53, begin: 41.5, index: 113 },
    { text: "sul", duration: 0.53, begin: 41.75, index: 114 },
    { text: "ye", duration: 0.53, begin: 42.0, index: 115 },
    { text: " ek", duration: 0.68, begin: 42.25, index: 116 },
    { text: "ti", duration: 0.68, begin: 42.5, index: 117 },
    { text: "ği", duration: 0.68, begin: 42.75, index: 118 },
    { text: "niz", duration: 0.68, begin: 43.0, index: 119 },
    { text: "de", duration: 0.68, begin: 43.25, index: 120 },
    { text: " bun", duration: 0.53, begin: 44.5, index: 121 },
    { text: "la", duration: 0.53, begin: 44.75, index: 122 },
    { text: "rın", duration: 0.53, begin: 45.0, index: 123 },
    { text: " çim", duration: 0.68, begin: 45.25, index: 124 },
    { text: "len", duration: 0.68, begin: 45.5, index: 125 },
    { text: "me", duration: 0.68, begin: 45.75, index: 126 },
    { text: "si", duration: 0.68, begin: 46.0, index: 127 },
    { text: " çok", duration: 0.53, begin: 47.25, index: 128 },
    { text: " kı", duration: 0.53, begin: 47.5, index: 129 },
    { text: "sa", duration: 0.53, begin: 47.75, index: 130 },
    { text: " sü", duration: 0.53, begin: 48.0, index: 131 },
    { text: "rer.", duration: 0.53, begin: 48.25, index: 132 },
    { text: " On", duration: 0.53, begin: 49.75, index: 133 },
    { text: " Beş", duration: 0.53, begin: 50.0, index: 134 },
    { text: " gün,", duration: 0.53, begin: 50.25, index: 135 },
    { text: " bir", duration: 0.53, begin: 51.5, index: 136 },
    { text: " ay", duration: 0.53, begin: 51.75, index: 137 },
    { text: " ve", duration: 0.53, begin: 52.75, index: 138 },
    { text: "ya", duration: 0.53, begin: 53.0, index: 139 },
    { text: " en", duration: 0.53, begin: 53.75, index: 140 },
    { text: " geç", duration: 0.53, begin: 54.0, index: 141 },
    { text: " i", duration: 0.23, begin: 55.25, index: 142 },
    { text: "ki", duration: 0.23, begin: 55.5, index: 143 },
    { text: " ay", duration: 0.53, begin: 55.75, index: 144 },
    { text: "da", duration: 0.53, begin: 56.0, index: 145 },
    { text: " fi", duration: 0.53, begin: 56.25, index: 146 },
    { text: "liz", duration: 0.53, begin: 56.5, index: 147 },
    { text: "le", duration: 0.53, begin: 56.75, index: 148 },
    { text: "nip", duration: 0.53, begin: 57.0, index: 149 },
    { text: " bü", duration: 0.28, begin: 57.5, index: 150 },
    { text: "yü", duration: 0.28, begin: 57.75, index: 151 },
    { text: "me", duration: 0.28, begin: 58.0, index: 152 },
    { text: "ye", duration: 0.28, begin: 58.25, index: 153 },
    { text: " baş", duration: 0.28, begin: 58.5, index: 154 },
    { text: "lar.", duration: 0.28, begin: 58.75, index: 155 },
    { text: " E", duration: 0.53, begin: 59.5, index: 156 },
    { text: "mek", duration: 0.53, begin: 59.75, index: 157 },
    { text: " ve", duration: 0.48, begin: 60.25, index: 158 },
    { text: "ren", duration: 0.48, begin: 60.5, index: 159 },
    { text: "le", duration: 0.48, begin: 60.75, index: 160 },
    { text: "rin", duration: 0.48, begin: 61.0, index: 161 },
    { text: " he", duration: 0.53, begin: 61.75, index: 162 },
    { text: "men", duration: 0.53, begin: 62.0, index: 163 },
    { text: " yüz", duration: 0.53, begin: 62.25, index: 164 },
    { text: "le", duration: 0.53, begin: 62.5, index: 165 },
    { text: "ri", duration: 0.53, begin: 62.75, index: 166 },
    { text: "ni", duration: 0.53, begin: 63.0, index: 167 },
    { text: " gül", duration: 0.53, begin: 63.25, index: 168 },
    { text: "dü", duration: 0.53, begin: 63.5, index: 169 },
    { text: "rür", duration: 0.53, begin: 63.75, index: 170 },
    { text: "ler.", duration: 0.53, begin: 64.0, index: 171 },
    { text: " Şim", duration: 0.28, begin: 66.0, index: 172 },
    { text: "di", duration: 0.28, begin: 66.25, index: 173 },
    { text: "de", duration: 0.28, begin: 66.5, index: 174 },
    { text: " Çin", duration: 0.53, begin: 67.25, index: 175 },
    { text: " bam", duration: 0.53, begin: 67.5, index: 176 },
    { text: "bu", duration: 0.53, begin: 67.75, index: 177 },
    { text: " a", duration: 0.53, begin: 68.0, index: 178 },
    { text: "ğa", duration: 0.53, begin: 68.25, index: 179 },
    { text: "cı", duration: 0.53, begin: 68.5, index: 180 },
    { text: "na", duration: 0.53, begin: 68.75, index: 181 },
    { text: " ge", duration: 0.53, begin: 69.0, index: 182 },
    { text: "le", duration: 0.53, begin: 69.25, index: 183 },
    { text: "lim.", duration: 0.53, begin: 69.5, index: 184 },
    { text: " Bu", duration: 0.28, begin: 70.5, index: 185 },
    { text: "nun", duration: 0.28, begin: 70.75, index: 186 },
    { text: " to", duration: 0.38, begin: 71.25, index: 187 },
    { text: "hu", duration: 0.38, begin: 71.5, index: 188 },
    { text: "mu", duration: 0.38, begin: 71.75, index: 189 },
    { text: "nu", duration: 0.38, begin: 72.0, index: 190 },
    { text: " top", duration: 0.53, begin: 72.5, index: 191 },
    { text: "ra", duration: 0.53, begin: 72.75, index: 192 },
    { text: "ğa", duration: 0.53, begin: 73.0, index: 193 },
    { text: " di", duration: 0.53, begin: 73.25, index: 194 },
    { text: "ki", duration: 0.53, begin: 73.5, index: 195 },
    { text: "yor", duration: 0.53, begin: 73.75, index: 196 },
    { text: "lar.", duration: 0.53, begin: 74.0, index: 197 },
    { text: " Su", duration: 0.53, begin: 75.0, index: 198 },
    { text: "la", duration: 0.53, begin: 75.25, index: 199 },
    { text: "nı", duration: 0.53, begin: 75.5, index: 200 },
    { text: "yor,", duration: 0.53, begin: 75.75, index: 201 },
    { text: " güb", duration: 0.53, begin: 76.5, index: 202 },
    { text: "re", duration: 0.53, begin: 76.75, index: 203 },
    { text: "le", duration: 0.53, begin: 77.0, index: 204 },
    { text: "ni", duration: 0.53, begin: 77.25, index: 205 },
    { text: "yor.", duration: 0.53, begin: 77.5, index: 206 },
    { text: " Üç", duration: 0.53, begin: 78.5, index: 207 },
    { text: " ay", duration: 0.53, begin: 78.75, index: 208 },
    { text: " ge", duration: 0.53, begin: 79.0, index: 209 },
    { text: "çi", duration: 0.53, begin: 79.25, index: 210 },
    { text: "yor,", duration: 0.53, begin: 79.5, index: 211 },
    { text: " fi", duration: 0.53, begin: 80.5, index: 212 },
    { text: "liz", duration: 0.53, begin: 80.75, index: 213 },
    { text: "len", duration: 0.53, begin: 81.0, index: 214 },
    { text: "me", duration: 0.53, begin: 81.25, index: 215 },
    { text: " yok.", duration: 0.53, begin: 81.5, index: 216 },
    { text: " Yi", duration: 0.53, begin: 82.75, index: 217 },
    { text: "ne", duration: 0.53, begin: 83.0, index: 218 },
    { text: " su", duration: 0.53, begin: 83.25, index: 219 },
    { text: "la", duration: 0.53, begin: 83.5, index: 220 },
    { text: "nı", duration: 0.53, begin: 83.75, index: 221 },
    { text: "yor,", duration: 0.53, begin: 84.0, index: 222 },
    { text: " ba", duration: 0.53, begin: 84.75, index: 223 },
    { text: "kı", duration: 0.53, begin: 85.0, index: 224 },
    { text: "mı", duration: 0.53, begin: 85.25, index: 225 },
    { text: " ya", duration: 0.53, begin: 85.5, index: 226 },
    { text: "pı", duration: 0.53, begin: 85.75, index: 227 },
    { text: "lı", duration: 0.53, begin: 86.0, index: 228 },
    { text: "yor.", duration: 0.53, begin: 86.25, index: 229 },
    { text: " Al", duration: 0.53, begin: 87.25, index: 230 },
    { text: "tı", duration: 0.53, begin: 87.5, index: 231 },
    { text: " ay", duration: 0.53, begin: 87.75, index: 232 },
    { text: " ge", duration: 0.53, begin: 88.0, index: 233 },
    { text: "çi", duration: 0.53, begin: 88.25, index: 234 },
    { text: "yor,", duration: 0.53, begin: 88.5, index: 235 },
    { text: " ha", duration: 0.53, begin: 89.5, index: 236 },
    { text: "la", duration: 0.53, begin: 89.75, index: 237 },
    { text: " fi", duration: 0.53, begin: 90.0, index: 238 },
    { text: "liz", duration: 0.53, begin: 90.25, index: 239 },
    { text: "len", duration: 0.53, begin: 90.5, index: 240 },
    { text: "me", duration: 0.53, begin: 90.75, index: 241 },
    { text: " yok.", duration: 0.53, begin: 91.5, index: 242 },
    { text: " Yi", duration: 0.28, begin: 92.75, index: 243 },
    { text: "ne", duration: 0.28, begin: 93.0, index: 244 },
    { text: " su", duration: 0.53, begin: 93.25, index: 245 },
    { text: "la", duration: 0.53, begin: 93.5, index: 246 },
    { text: "nı", duration: 0.53, begin: 93.75, index: 247 },
    { text: "yor,", duration: 0.53, begin: 94.0, index: 248 },
    { text: " ba", duration: 0.53, begin: 94.5, index: 249 },
    { text: "kı", duration: 0.53, begin: 94.75, index: 250 },
    { text: "mı", duration: 0.53, begin: 95.0, index: 251 },
    { text: " ya", duration: 0.53, begin: 95.25, index: 252 },
    { text: "pı", duration: 0.53, begin: 95.5, index: 253 },
    { text: "lı", duration: 0.53, begin: 95.75, index: 254 },
    { text: "yor.", duration: 0.53, begin: 96.0, index: 255 },
    { text: " Fi", duration: 0.53, begin: 97.0, index: 256 },
    { text: "liz", duration: 0.53, begin: 97.25, index: 257 },
    { text: "len", duration: 0.53, begin: 97.5, index: 258 },
    { text: "me", duration: 0.53, begin: 97.75, index: 259 },
    { text: " yok.", duration: 0.53, begin: 98.25, index: 260 },
    { text: " Bir", duration: 0.53, begin: 99.5, index: 261 },
    { text: " se", duration: 0.53, begin: 99.75, index: 262 },
    { text: "ne", duration: 0.53, begin: 100.0, index: 263 },
    { text: " ge", duration: 0.53, begin: 100.25, index: 264 },
    { text: "çi", duration: 0.53, begin: 100.5, index: 265 },
    { text: "yor", duration: 0.53, begin: 100.75, index: 266 },
    { text: " yi", duration: 0.53, begin: 101.5, index: 267 },
    { text: "ne", duration: 0.53, begin: 101.75, index: 268 },
    { text: " yok.", duration: 0.53, begin: 102.0, index: 269 },
    { text: " Ço", duration: 0.53, begin: 103.25, index: 270 },
    { text: "ğu", duration: 0.53, begin: 103.5, index: 271 },
    { text: "muz", duration: 0.53, begin: 103.75, index: 272 },
    { text: " bir", duration: 0.53, begin: 104.5, index: 273 },
    { text: " se", duration: 0.53, begin: 104.75, index: 274 },
    { text: "ne", duration: 0.53, begin: 105.0, index: 275 },
    { text: " geç", duration: 0.53, begin: 105.25, index: 276 },
    { text: "ti", duration: 0.53, begin: 105.5, index: 277 },
    { text: "ği", duration: 0.53, begin: 105.75, index: 278 },
    { text: " hal", duration: 0.53, begin: 106.0, index: 279 },
    { text: "de", duration: 0.53, begin: 106.25, index: 280 },
    { text: " dik", duration: 0.53, begin: 107.5, index: 281 },
    { text: "ti", duration: 0.53, begin: 107.75, index: 282 },
    { text: "ği", duration: 0.53, begin: 108.0, index: 283 },
    { text: "miz", duration: 0.53, begin: 108.25, index: 284 },
    { text: " şey", duration: 0.53, begin: 108.5, index: 285 },
    { text: " fi", duration: 0.53, begin: 109.5, index: 286 },
    { text: "liz", duration: 0.53, begin: 109.75, index: 287 },
    { text: "len", duration: 0.53, begin: 110.0, index: 288 },
    { text: "mi", duration: 0.53, begin: 110.25, index: 289 },
    { text: "yor", duration: 0.53, begin: 110.5, index: 290 },
    { text: "sa", duration: 0.53, begin: 110.75, index: 291 },
    { text: " bı", duration: 0.53, begin: 111.0, index: 292 },
    { text: "ra", duration: 0.53, begin: 111.25, index: 293 },
    { text: "kı", duration: 0.53, begin: 111.5, index: 294 },
    { text: "rız", duration: 0.53, begin: 111.75, index: 295 },
    { text: " ve", duration: 0.53, begin: 112.0, index: 296 },
    { text: " ba", duration: 0.53, begin: 113.25, index: 297 },
    { text: "kı", duration: 0.53, begin: 113.5, index: 298 },
    { text: "mın", duration: 0.53, begin: 113.75, index: 299 },
    { text: "dan", duration: 0.53, begin: 114.0, index: 300 },
    { text: " vaz", duration: 0.53, begin: 114.25, index: 301 },
    { text: "ge", duration: 0.53, begin: 114.5, index: 302 },
    { text: "çe", duration: 0.53, begin: 114.75, index: 303 },
    { text: "riz.", duration: 0.53, begin: 115.0, index: 304 },
    { text: " De", duration: 0.53, begin: 116.25, index: 305 },
    { text: "mek", duration: 0.53, begin: 116.5, index: 306 },
    { text: " ki", duration: 0.53, begin: 116.75, index: 307 },
    { text: " bu", duration: 0.68, begin: 117.0, index: 308 },
    { text: " ye", duration: 0.68, begin: 117.25, index: 309 },
    { text: "tiş", duration: 0.68, begin: 117.5, index: 310 },
    { text: "me", duration: 0.68, begin: 117.75, index: 311 },
    { text: "ye", duration: 0.68, begin: 118.0, index: 312 },
    { text: "cek!", duration: 0.68, begin: 118.25, index: 313 },
    { text: " de", duration: 0.53, begin: 119.5, index: 314 },
    { text: "riz.", duration: 0.53, begin: 119.75, index: 315 },
    { text: " A", duration: 0.53, begin: 120.75, index: 316 },
    { text: "ma", duration: 0.53, begin: 121.0, index: 317 },
    { text: " Çin", duration: 0.53, begin: 121.25, index: 318 },
    { text: "li", duration: 0.53, begin: 121.5, index: 319 },
    { text: "ler", duration: 0.53, begin: 121.75, index: 320 },
    { text: " sa", duration: 0.53, begin: 122.5, index: 321 },
    { text: "bır", duration: 0.53, begin: 122.75, index: 322 },
    { text: "lı", duration: 0.53, begin: 123.0, index: 323 },
    { text: " in", duration: 0.53, begin: 123.25, index: 324 },
    { text: "san", duration: 0.53, begin: 123.5, index: 325 },
    { text: "lar.", duration: 0.53, begin: 123.75, index: 326 },
    { text: " Sa", duration: 0.53, begin: 125.0, index: 327 },
    { text: "bır", duration: 0.53, begin: 125.25, index: 328 },
    { text: "lı", duration: 0.53, begin: 125.5, index: 329 },
    { text: " ol", duration: 0.53, begin: 125.75, index: 330 },
    { text: "duk", duration: 0.53, begin: 126.0, index: 331 },
    { text: "la", duration: 0.53, begin: 126.25, index: 332 },
    { text: "rı,", duration: 0.53, begin: 126.5, index: 333 },
    { text: " çok", duration: 0.53, begin: 127.5, index: 334 },
    { text: " zah", duration: 0.53, begin: 127.75, index: 335 },
    { text: "met", duration: 0.53, begin: 128.0, index: 336 },
    { text: "li", duration: 0.53, begin: 128.25, index: 337 },
    { text: " iş", duration: 0.53, begin: 128.75, index: 338 },
    { text: " o", duration: 0.53, begin: 129.0, index: 339 },
    { text: "lan", duration: 0.53, begin: 129.25, index: 340 },
    { text: " i", duration: 0.53, begin: 130.25, index: 341 },
    { text: "pek", duration: 0.53, begin: 130.5, index: 342 },
    { text: " ü", duration: 0.53, begin: 130.75, index: 343 },
    { text: "re", duration: 0.53, begin: 131.0, index: 344 },
    { text: "ti", duration: 0.53, begin: 131.25, index: 345 },
    { text: "min", duration: 0.53, begin: 131.5, index: 346 },
    { text: "den", duration: 0.53, begin: 131.75, index: 347 },
    { text: " bel", duration: 0.53, begin: 132.0, index: 348 },
    { text: "li...", duration: 0.53, begin: 132.25, index: 349 },
    { text: " Çin", duration: 0.53, begin: 133.75, index: 350 },
    { text: " bam", duration: 0.53, begin: 134.0, index: 351 },
    { text: "bu", duration: 0.53, begin: 134.25, index: 352 },
    { text: " a", duration: 0.53, begin: 134.5, index: 353 },
    { text: "ğa", duration: 0.53, begin: 134.75, index: 354 },
    { text: "cı", duration: 0.53, begin: 135.0, index: 355 },
    { text: " bir", duration: 0.53, begin: 136.25, index: 356 },
    { text: " yıl,", duration: 0.53, begin: 136.5, index: 357 },
    { text: " i", duration: 0.53, begin: 137.5, index: 358 },
    { text: "ki", duration: 0.53, begin: 137.75, index: 359 },
    { text: " yıl,", duration: 0.53, begin: 138.0, index: 360 },
    { text: " üç", duration: 0.53, begin: 139.25, index: 361 },
    { text: " yıl,", duration: 0.53, begin: 139.5, index: 362 },
    { text: " dört", duration: 0.53, begin: 140.5, index: 363 },
    { text: " yıl", duration: 0.53, begin: 140.75, index: 364 },
    { text: " ve", duration: 0.53, begin: 141.0, index: 365 },
    { text: " ni", duration: 0.53, begin: 141.25, index: 366 },
    { text: "ha", duration: 0.53, begin: 141.5, index: 367 },
    { text: "yet", duration: 0.53, begin: 141.75, index: 368 },
    { text: " beş", duration: 0.53, begin: 142.5, index: 369 },
    { text: " yıl", duration: 0.53, begin: 142.75, index: 370 },
    { text: " bo", duration: 0.53, begin: 143.0, index: 371 },
    { text: "yun", duration: 0.53, begin: 143.25, index: 372 },
    { text: "ca", duration: 0.53, begin: 143.5, index: 373 },
    { text: " fi", duration: 0.53, begin: 144.25, index: 374 },
    { text: "liz", duration: 0.53, begin: 144.5, index: 375 },
    { text: "len", duration: 0.53, begin: 144.75, index: 376 },
    { text: "mi", duration: 0.53, begin: 145.0, index: 377 },
    { text: "yor.", duration: 0.53, begin: 145.25, index: 378 },
    { text: " A", duration: 0.53, begin: 146.25, index: 379 },
    { text: "ma", duration: 0.53, begin: 146.5, index: 380 },
    { text: " be", duration: 0.53, begin: 146.75, index: 381 },
    { text: "şin", duration: 0.53, begin: 147.0, index: 382 },
    { text: "ci", duration: 0.53, begin: 147.25, index: 383 },
    { text: " yı", duration: 0.53, begin: 147.5, index: 384 },
    { text: "lın", duration: 0.53, begin: 147.75, index: 385 },
    { text: " so", duration: 0.53, begin: 148.0, index: 386 },
    { text: "nun", duration: 0.53, begin: 148.25, index: 387 },
    { text: "da", duration: 0.53, begin: 148.5, index: 388 },
    { text: " to", duration: 0.53, begin: 149.25, index: 389 },
    { text: "hum", duration: 0.53, begin: 149.5, index: 390 },
    { text: " top", duration: 0.53, begin: 149.75, index: 391 },
    { text: "rak", duration: 0.53, begin: 150.0, index: 392 },
    { text: "tan", duration: 0.53, begin: 150.25, index: 393 },
    { text: " çı", duration: 0.53, begin: 150.5, index: 394 },
    { text: "kı", duration: 0.53, begin: 150.75, index: 395 },
    { text: "yor,", duration: 0.53, begin: 151.0, index: 396 },
    { text: " fi", duration: 0.53, begin: 152.25, index: 397 },
    { text: "liz", duration: 0.53, begin: 152.5, index: 398 },
    { text: "le", duration: 0.53, begin: 152.75, index: 399 },
    { text: "ni", duration: 0.53, begin: 153.0, index: 400 },
    { text: "yor.", duration: 0.53, begin: 153.25, index: 401 },
    { text: " Çin", duration: 0.53, begin: 154.5, index: 402 },
    { text: "li", duration: 0.53, begin: 154.75, index: 403 },
    { text: "ler", duration: 0.53, begin: 155.0, index: 404 },
    { text: " tam", duration: 0.53, begin: 155.75, index: 405 },
    { text: " beş", duration: 0.53, begin: 156.0, index: 406 },
    { text: " yıl", duration: 0.53, begin: 156.25, index: 407 },
    { text: " sab", duration: 0.53, begin: 156.75, index: 408 },
    { text: "re", duration: 0.53, begin: 157.0, index: 409 },
    { text: "di", duration: 0.53, begin: 157.25, index: 410 },
    { text: "yor", duration: 0.53, begin: 157.5, index: 411 },
    { text: "lar.", duration: 0.53, begin: 157.75, index: 412 },
    { text: " Pe", duration: 0.53, begin: 159.0, index: 413 },
    { text: "ki,", duration: 0.53, begin: 159.25, index: 414 },
    { text: " son", duration: 0.53, begin: 160.25, index: 415 },
    { text: "ra", duration: 0.53, begin: 160.5, index: 416 },
    { text: " ne", duration: 0.53, begin: 160.75, index: 417 },
    { text: " o", duration: 0.53, begin: 161.0, index: 418 },
    { text: "lu", duration: 0.53, begin: 161.25, index: 419 },
    { text: "yor", duration: 0.53, begin: 161.5, index: 420 },
    { text: " bi", duration: 0.53, begin: 161.75, index: 421 },
    { text: "li", duration: 0.53, begin: 162.0, index: 422 },
    { text: "yor", duration: 0.53, begin: 162.25, index: 423 },
    { text: " mu", duration: 0.53, begin: 162.5, index: 424 },
    { text: "su", duration: 0.53, begin: 162.75, index: 425 },
    { text: "nuz?", duration: 0.53, begin: 163.0, index: 426 },
    { text: " Al", duration: 0.53, begin: 163.75, index: 427 },
    { text: "tı", duration: 0.53, begin: 164.0, index: 428 },
    { text: " haf", duration: 0.53, begin: 164.25, index: 429 },
    { text: "ta", duration: 0.53, begin: 164.5, index: 430 },
    { text: "da", duration: 0.53, begin: 164.75, index: 431 },
    { text: " Yir", duration: 0.53, begin: 166.0, index: 432 },
    { text: "mi", duration: 0.53, begin: 166.25, index: 433 },
    { text: " ye", duration: 0.53, begin: 166.5, index: 434 },
    { text: "di", duration: 0.53, begin: 166.75, index: 435 },
    { text: " met", duration: 0.53, begin: 167.0, index: 436 },
    { text: "re", duration: 0.53, begin: 167.25, index: 437 },
    { text: " u", duration: 0.53, begin: 167.5, index: 438 },
    { text: "zu", duration: 0.53, begin: 167.75, index: 439 },
    { text: "yor.", duration: 0.53, begin: 168.0, index: 440 },
    { text: " E", duration: 0.53, begin: 169.25, index: 441 },
    { text: "vet,", duration: 0.53, begin: 169.5, index: 442 },
    { text: " yan", duration: 0.53, begin: 170.25, index: 443 },
    { text: "lış", duration: 0.53, begin: 170.5, index: 444 },
    { text: " o", duration: 0.53, begin: 170.75, index: 445 },
    { text: "ku", duration: 0.53, begin: 171.0, index: 446 },
    { text: "ma", duration: 0.53, begin: 171.25, index: 447 },
    { text: "dı", duration: 0.53, begin: 171.5, index: 448 },
    { text: "nız.", duration: 0.53, begin: 171.75, index: 449 },
    { text: " Yir", duration: 0.53, begin: 172.75, index: 450 },
    { text: "mi", duration: 0.53, begin: 173.0, index: 451 },
    { text: " ye", duration: 0.53, begin: 173.25, index: 452 },
    { text: "di", duration: 0.53, begin: 173.5, index: 453 },
    { text: " met", duration: 0.53, begin: 173.75, index: 454 },
    { text: "re", duration: 0.53, begin: 174.0, index: 455 },
    { text: " Şim", duration: 0.53, begin: 175.25, index: 456 },
    { text: "di", duration: 0.53, begin: 175.5, index: 457 },
    { text: " şöy", duration: 0.53, begin: 175.75, index: 458 },
    { text: "le", duration: 0.53, begin: 176.0, index: 459 },
    { text: " bir", duration: 0.53, begin: 176.25, index: 460 },
    { text: " dü", duration: 0.53, begin: 177.0, index: 461 },
    { text: "şü", duration: 0.53, begin: 177.25, index: 462 },
    { text: "ne", duration: 0.53, begin: 177.5, index: 463 },
    { text: "lim:", duration: 0.53, begin: 177.75, index: 464 },
    { text: " Bu", duration: 0.53, begin: 178.5, index: 465 },
    { text: " a", duration: 0.53, begin: 178.75, index: 466 },
    { text: "ğaç", duration: 0.53, begin: 179.0, index: 467 },
    { text: " al", duration: 0.28, begin: 180.0, index: 468 },
    { text: "tı", duration: 0.28, begin: 180.25, index: 469 },
    { text: " haf", duration: 0.48, begin: 180.5, index: 470 },
    { text: "ta", duration: 0.48, begin: 180.75, index: 471 },
    { text: "da", duration: 0.48, begin: 181.0, index: 472 },
    { text: " mı", duration: 0.53, begin: 181.25, index: 473 },
    { text: " bü", duration: 0.53, begin: 181.5, index: 474 },
    { text: "yü", duration: 0.53, begin: 181.75, index: 475 },
    { text: "dü?", duration: 0.53, begin: 182.0, index: 476 },
    { text: " Yok", duration: 0.53, begin: 182.75, index: 477 },
    { text: "sa", duration: 0.53, begin: 183.0, index: 478 },
    { text: " beş", duration: 0.53, begin: 184.0, index: 479 },
    { text: " yıl", duration: 0.53, begin: 184.25, index: 480 },
    { text: " ar", duration: 0.53, begin: 184.5, index: 481 },
    { text: "tı", duration: 0.53, begin: 184.75, index: 482 },
    { text: " al", duration: 0.53, begin: 186.0, index: 483 },
    { text: "tı", duration: 0.53, begin: 186.25, index: 484 },
    { text: " haf", duration: 0.53, begin: 186.5, index: 485 },
    { text: "ta", duration: 0.53, begin: 186.75, index: 486 },
    { text: "da", duration: 0.53, begin: 187.0, index: 487 },
    { text: " mı?", duration: 0.53, begin: 187.25, index: 488 },
    { text: " E", duration: 0.53, begin: 188.5, index: 489 },
    { text: "vet,", duration: 0.53, begin: 188.75, index: 490 },
    { text: " sa", duration: 0.53, begin: 189.75, index: 491 },
    { text: "bır", duration: 0.53, begin: 190.0, index: 492 },
    { text: " ve", duration: 0.53, begin: 190.25, index: 493 },
    { text: " se", duration: 0.53, begin: 190.5, index: 494 },
    { text: "bat", duration: 0.53, begin: 190.75, index: 495 },
    { text: " öy", duration: 0.53, begin: 191.5, index: 496 },
    { text: "le", duration: 0.53, begin: 191.75, index: 497 },
    { text: " bir", duration: 0.53, begin: 192.0, index: 498 },
    { text: " tıl", duration: 0.53, begin: 192.25, index: 499 },
    { text: "sım", duration: 0.53, begin: 192.5, index: 500 },
    { text: "dır", duration: 0.53, begin: 192.75, index: 501 },
    { text: " ki,", duration: 0.53, begin: 193.0, index: 502 },
    { text: " ken", duration: 0.53, begin: 194.25, index: 503 },
    { text: "di", duration: 0.53, begin: 194.5, index: 504 },
    { text: "ni", duration: 0.53, begin: 194.75, index: 505 },
    { text: " ye", duration: 0.53, begin: 195.0, index: 506 },
    { text: "nen", duration: 0.53, begin: 195.25, index: 507 },
    { text: " ka", duration: 0.53, begin: 195.5, index: 508 },
    { text: "za", duration: 0.53, begin: 195.75, index: 509 },
    { text: "nır,", duration: 0.53, begin: 196.0, index: 510 },
    { text: " ken", duration: 0.53, begin: 197.0, index: 511 },
    { text: "di", duration: 0.53, begin: 197.25, index: 512 },
    { text: "ne", duration: 0.53, begin: 197.5, index: 513 },
    { text: " ye", duration: 0.53, begin: 197.75, index: 514 },
    { text: "ni", duration: 0.53, begin: 198.0, index: 515 },
    { text: "len", duration: 0.53, begin: 198.25, index: 516 },
    { text: " kay", duration: 0.53, begin: 198.5, index: 517 },
    { text: "be", duration: 0.53, begin: 198.75, index: 518 },
    { text: "der.", duration: 0.53, begin: 199.0, index: 519 },
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
                href="/dashboard/stories/sirkin-kapisindan-dondugum-gece"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/affetmenin-hafifligi"
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
            src="/2-5.mp3"
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
