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
    { text: "", duration: 0.154, begin: 0.775, index: 0 },

    // Title
    {
      text: "Öz",
      duration: 0.53,
      begin: 0.729,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "gür",
      duration: 0.38,
      begin: 1.218,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Kuş",
      duration: 0.53,
      begin: 1.378,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "lar",
      duration: 0.98,
      begin: 1.578,
      index: 4,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Kü", duration: 0.53, begin: 2.75, index: 5 },
    { text: "çük", duration: 0.53, begin: 3.0, index: 6 },
    { text: " kı", duration: 0.53, begin: 3.25, index: 7 },
    { text: "zın", duration: 0.53, begin: 3.5, index: 8 },
    { text: " ba", duration: 0.53, begin: 3.75, index: 9 },
    { text: "ba", duration: 0.53, begin: 4.0, index: 10 },
    { text: "sı", duration: 0.53, begin: 4.25, index: 11 },
    { text: " öz", duration: 0.53, begin: 5.5, index: 12 },
    { text: "gür", duration: 0.53, begin: 5.75, index: 13 },
    { text: "lük", duration: 0.53, begin: 6.0, index: 14 },
    { text: "le", duration: 0.53, begin: 6.25, index: 15 },
    { text: "rin", duration: 0.53, begin: 6.5, index: 16 },
    { text: " kı", duration: 0.53, begin: 7.5, index: 17 },
    { text: "sıt", duration: 0.53, begin: 7.75, index: 18 },
    { text: "lı", duration: 0.53, begin: 8.0, index: 19 },
    { text: " ol", duration: 0.53, begin: 8.25, index: 20 },
    { text: "du", duration: 0.53, begin: 8.5, index: 21 },
    { text: "ğu", duration: 0.53, begin: 8.75, index: 22 },
    { text: " bir", duration: 0.83, begin: 9.0, index: 23 },
    { text: " ül", duration: 0.83, begin: 9.25, index: 24 },
    { text: "ke", duration: 0.83, begin: 9.35, index: 25 },
    { text: "de,", duration: 0.83, begin: 9.5, index: 26 },
    { text: " en", duration: 0.53, begin: 11.25, index: 27 },
    { text: " a", duration: 0.53, begin: 11.5, index: 28 },
    { text: "ğır", duration: 0.53, begin: 11.75, index: 29 },
    { text: " si", duration: 0.53, begin: 12.0, index: 30 },
    { text: "ya", duration: 0.53, begin: 12.25, index: 31 },
    { text: "si", duration: 0.53, begin: 12.75, index: 32 },
    { text: " ce", duration: 0.53, begin: 13.0, index: 33 },
    { text: "za", duration: 0.53, begin: 13.25, index: 34 },
    { text: "la", duration: 0.53, begin: 13.5, index: 35 },
    { text: "rın", duration: 0.53, begin: 13.75, index: 36 },
    { text: " ve", duration: 0.53, begin: 14.75, index: 37 },
    { text: "ril", duration: 0.53, begin: 15.0, index: 38 },
    { text: "di", duration: 0.53, begin: 15.25, index: 39 },
    { text: "ği", duration: 0.53, begin: 15.5, index: 40 },
    { text: " bir", duration: 0.78, begin: 15.75, index: 41 },
    { text: " ha", duration: 0.78, begin: 16.0, index: 42 },
    { text: "pis", duration: 0.78, begin: 16.35, index: 43 },
    { text: "ha", duration: 0.78, begin: 16.55, index: 44 },
    { text: "ne", duration: 0.78, begin: 16.75, index: 45 },
    { text: "de", duration: 0.78, begin: 16.95, index: 46 },
    { text: " mah", duration: 0.53, begin: 18.25, index: 47 },
    { text: "kum", duration: 0.53, begin: 18.5, index: 48 },
    { text: "du.", duration: 0.53, begin: 18.75, index: 49 },
    { text: " Her", duration: 0.53, begin: 20.25, index: 50 },
    { text: " haf", duration: 0.53, begin: 20.5, index: 51 },
    { text: "ta", duration: 0.53, begin: 20.75, index: 52 },
    { text: " so", duration: 0.53, begin: 21.0, index: 53 },
    { text: "nu", duration: 0.53, begin: 21.25, index: 54 },
    { text: " an", duration: 0.53, begin: 22.0, index: 55 },
    { text: "ne", duration: 0.53, begin: 22.25, index: 56 },
    { text: "siy", duration: 0.53, begin: 22.5, index: 57 },
    { text: "le", duration: 0.53, begin: 22.75, index: 58 },
    { text: " bir", duration: 0.53, begin: 23.25, index: 59 },
    { text: "lik", duration: 0.53, begin: 23.5, index: 60 },
    { text: "te", duration: 0.53, begin: 23.75, index: 61 },
    { text: " ba", duration: 0.53, begin: 25.0, index: 62 },
    { text: "ba", duration: 0.53, begin: 25.25, index: 63 },
    { text: "sı", duration: 0.53, begin: 25.5, index: 64 },
    { text: "nı", duration: 0.53, begin: 25.75, index: 65 },
    { text: " zi", duration: 0.53, begin: 26.25, index: 66 },
    { text: "ya", duration: 0.53, begin: 26.5, index: 67 },
    { text: "ret", duration: 0.53, begin: 26.75, index: 68 },
    { text: " i", duration: 0.53, begin: 27.0, index: 69 },
    { text: "çin", duration: 0.53, begin: 27.25, index: 70 },
    { text: " ha", duration: 0.53, begin: 28.0, index: 71 },
    { text: "pis", duration: 0.53, begin: 28.25, index: 72 },
    { text: "ha", duration: 0.53, begin: 28.5, index: 73 },
    { text: "ne", duration: 0.53, begin: 28.75, index: 74 },
    { text: "ye", duration: 0.53, begin: 29.0, index: 75 },
    { text: " gi", duration: 0.53, begin: 29.25, index: 76 },
    { text: "der", duration: 0.53, begin: 29.5, index: 77 },
    { text: "di.", duration: 0.53, begin: 29.75, index: 78 },
    { text: " Bir", duration: 0.53, begin: 31.25, index: 79 },
    { text: " zi", duration: 0.53, begin: 31.5, index: 80 },
    { text: "ya", duration: 0.53, begin: 31.75, index: 81 },
    { text: "re", duration: 0.53, begin: 32.0, index: 82 },
    { text: "tin", duration: 0.53, begin: 32.25, index: 83 },
    { text: "de", duration: 0.53, begin: 32.5, index: 84 },
    { text: " ba", duration: 0.53, begin: 33.75, index: 85 },
    { text: "ba", duration: 0.53, begin: 34.0, index: 86 },
    { text: "sı", duration: 0.53, begin: 34.25, index: 87 },
    { text: "na", duration: 0.53, begin: 34.5, index: 88 },
    { text: " ver", duration: 0.53, begin: 35.0, index: 89 },
    { text: "mek", duration: 0.53, begin: 35.25, index: 90 },
    { text: " i", duration: 0.53, begin: 35.5, index: 91 },
    { text: "çin", duration: 0.53, begin: 35.75, index: 92 },
    { text: " ö", duration: 0.53, begin: 36.75, index: 93 },
    { text: "ze", duration: 0.53, begin: 37.0, index: 94 },
    { text: "ne", duration: 0.53, begin: 37.25, index: 95 },
    { text: "rek", duration: 0.53, begin: 37.5, index: 96 },
    { text: " bir", duration: 0.53, begin: 38.0, index: 97 },
    { text: " re", duration: 0.53, begin: 38.25, index: 98 },
    { text: "sim", duration: 0.53, begin: 38.5, index: 99 },
    { text: " yap", duration: 0.53, begin: 38.75, index: 100 },
    { text: "tı", duration: 0.53, begin: 39.0, index: 101 },
    { text: " ve", duration: 0.53, begin: 40.25, index: 102 },
    { text: " ya", duration: 0.53, begin: 41.25, index: 103 },
    { text: "nın", duration: 0.53, begin: 41.5, index: 104 },
    { text: "da", duration: 0.53, begin: 41.75, index: 105 },
    { text: " gö", duration: 0.53, begin: 42.1, index: 106 },
    { text: "tür", duration: 0.53, begin: 42.35, index: 107 },
    { text: "dü.", duration: 0.53, begin: 42.5, index: 108 },
    { text: " Fa", duration: 0.53, begin: 44.25, index: 109 },
    { text: "kat", duration: 0.53, begin: 44.5, index: 110 },
    { text: " kont", duration: 0.53, begin: 45.5, index: 111 },
    { text: "rol", duration: 0.53, begin: 46.0, index: 112 },
    { text: " es", duration: 0.53, begin: 46.25, index: 113 },
    { text: "na", duration: 0.53, begin: 46.5, index: 114 },
    { text: "sın", duration: 0.53, begin: 46.75, index: 115 },
    { text: "da", duration: 0.53, begin: 47.0, index: 116 },
    { text: " yap", duration: 0.53, begin: 48.25, index: 117 },
    { text: "tı", duration: 0.53, begin: 48.5, index: 118 },
    { text: "ğı", duration: 0.53, begin: 48.75, index: 119 },
    { text: " re", duration: 0.53, begin: 49.25, index: 120 },
    { text: "sim", duration: 0.53, begin: 49.5, index: 121 },
    { text: " ha", duration: 0.53, begin: 50.25, index: 122 },
    { text: "pis", duration: 0.53, begin: 50.5, index: 123 },
    { text: "ha", duration: 0.53, begin: 50.75, index: 124 },
    { text: "ne", duration: 0.53, begin: 51.0, index: 125 },
    { text: " ku", duration: 0.53, begin: 51.25, index: 126 },
    { text: "ral", duration: 0.53, begin: 51.5, index: 127 },
    { text: "la", duration: 0.53, begin: 51.75, index: 128 },
    { text: "rı", duration: 0.53, begin: 52.0, index: 129 },
    { text: "na", duration: 0.53, begin: 52.25, index: 130 },
    { text: " gö", duration: 0.53, begin: 52.5, index: 131 },
    { text: "re", duration: 0.53, begin: 52.75, index: 132 },
    { text: " uy", duration: 0.53, begin: 53.75, index: 133 },
    { text: "gun", duration: 0.53, begin: 54.0, index: 134 },
    { text: " bu", duration: 0.53, begin: 54.5, index: 135 },
    { text: "lun", duration: 0.53, begin: 54.75, index: 136 },
    { text: "ma", duration: 0.53, begin: 54.95, index: 137 },
    { text: "dı.", duration: 0.53, begin: 55.0, index: 138 },
    { text: " Çün", duration: 0.53, begin: 56.75, index: 139 },
    { text: "kü", duration: 0.53, begin: 57.0, index: 140 },
    { text: " re", duration: 0.53, begin: 58.0, index: 141 },
    { text: "sim", duration: 0.53, begin: 58.25, index: 142 },
    { text: "de", duration: 0.53, begin: 58.5, index: 143 },
    { text: " çiz", duration: 0.53, begin: 58.75, index: 144 },
    { text: "di", duration: 0.53, begin: 59.0, index: 145 },
    { text: "ği", duration: 0.53, begin: 59.25, index: 146 },
    { text: " kuş", duration: 0.53, begin: 60.0, index: 147 },
    { text: "la", duration: 0.53, begin: 60.25, index: 148 },
    { text: "rın", duration: 0.53, begin: 60.5, index: 149 },
    { text: " öz", duration: 0.53, begin: 61.25, index: 150 },
    { text: "gür", duration: 0.53, begin: 61.5, index: 151 },
    { text: "lü", duration: 0.53, begin: 61.75, index: 152 },
    { text: "ğü", duration: 0.53, begin: 62.0, index: 153 },
    { text: " tem", duration: 0.53, begin: 62.5, index: 154 },
    { text: "sil", duration: 0.53, begin: 62.75, index: 155 },
    { text: " et", duration: 0.53, begin: 63.0, index: 156 },
    { text: "ti", duration: 0.53, begin: 63.25, index: 157 },
    { text: "ği", duration: 0.53, begin: 63.5, index: 158 },
    { text: "ni", duration: 0.53, begin: 63.75, index: 159 },
    { text: " dü", duration: 0.53, begin: 65.0, index: 160 },
    { text: "şü", duration: 0.53, begin: 65.25, index: 161 },
    { text: "nü", duration: 0.53, begin: 65.5, index: 162 },
    { text: "yor", duration: 0.53, begin: 65.75, index: 163 },
    { text: "lar", duration: 0.53, begin: 66.0, index: 164 },
    { text: "dı.", duration: 0.53, begin: 66.25, index: 165 },
    { text: " Ha", duration: 0.53, begin: 67.5, index: 166 },
    { text: "pis", duration: 0.53, begin: 67.75, index: 167 },
    { text: "ha", duration: 0.53, begin: 68.0, index: 168 },
    { text: "ne", duration: 0.53, begin: 68.25, index: 169 },
    { text: "de", duration: 0.53, begin: 68.5, index: 170 },
    { text: " öz", duration: 0.53, begin: 69.75, index: 171 },
    { text: "gür", duration: 0.53, begin: 70.0, index: 172 },
    { text: "lük", duration: 0.53, begin: 70.25, index: 173 },
    { text: " gi", duration: 0.53, begin: 70.5, index: 174 },
    { text: "bi", duration: 0.53, begin: 70.75, index: 175 },
    { text: " dü", duration: 0.53, begin: 71.0, index: 176 },
    { text: "şün", duration: 0.53, begin: 71.25, index: 177 },
    { text: "ce", duration: 0.53, begin: 71.5, index: 178 },
    { text: "le", duration: 0.53, begin: 71.75, index: 179 },
    { text: "re", duration: 0.53, begin: 72.0, index: 180 },
    { text: " yer", duration: 0.53, begin: 73.25, index: 181 },
    { text: " yok", duration: 0.53, begin: 73.5, index: 182 },
    { text: "tu.", duration: 0.53, begin: 73.75, index: 183 },
    { text: " Bu", duration: 0.53, begin: 75.0, index: 184 },
    { text: "nun", duration: 0.53, begin: 75.25, index: 185 },
    { text: " ü", duration: 0.53, begin: 75.5, index: 186 },
    { text: "ze", duration: 0.53, begin: 75.75, index: 187 },
    { text: "ri", duration: 0.53, begin: 76.0, index: 188 },
    { text: "ne", duration: 0.53, begin: 76.25, index: 189 },
    { text: " kü", duration: 0.53, begin: 77.25, index: 190 },
    { text: "çük", duration: 0.53, begin: 77.5, index: 191 },
    { text: " kı", duration: 0.53, begin: 77.75, index: 192 },
    { text: "zın", duration: 0.53, begin: 78.0, index: 193 },
    { text: " res", duration: 0.53, begin: 78.25, index: 194 },
    { text: "mi", duration: 0.53, begin: 78.5, index: 195 },
    { text: "ni", duration: 0.53, begin: 78.75, index: 196 },
    { text: " o", duration: 0.53, begin: 80.0, index: 197 },
    { text: "ra", duration: 0.53, begin: 80.25, index: 198 },
    { text: "cık", duration: 0.53, begin: 80.5, index: 199 },
    { text: "ta", duration: 0.53, begin: 80.75, index: 200 },
    { text: " yırt", duration: 0.53, begin: 81.25, index: 201 },
    { text: "mış", duration: 0.53, begin: 81.5, index: 202 },
    { text: "lar", duration: 0.53, begin: 81.75, index: 203 },
    { text: "dı.", duration: 0.53, begin: 82.0, index: 204 },
    { text: " Çok", duration: 0.53, begin: 84.0, index: 205 },
    { text: " üz", duration: 0.53, begin: 84.25, index: 206 },
    { text: "gün", duration: 0.53, begin: 84.5, index: 207 },
    { text: " bir", duration: 0.53, begin: 84.75, index: 208 },
    { text: " şe", duration: 0.53, begin: 85.0, index: 209 },
    { text: "kil", duration: 0.53, begin: 85.25, index: 210 },
    { text: "de", duration: 0.53, begin: 85.5, index: 211 },
    { text: " gö", duration: 0.53, begin: 87.0, index: 212 },
    { text: "rüş", duration: 0.53, begin: 87.25, index: 213 },
    { text: "me", duration: 0.53, begin: 87.5, index: 214 },
    { text: "de", duration: 0.53, begin: 87.75, index: 215 },
    { text: " ba", duration: 0.53, begin: 88.5, index: 216 },
    { text: "ba", duration: 0.53, begin: 88.75, index: 217 },
    { text: "sı", duration: 0.53, begin: 89.0, index: 218 },
    { text: "na", duration: 0.53, begin: 89.25, index: 219 },
    { text: " re", duration: 0.53, begin: 89.75, index: 220 },
    { text: "sim", duration: 0.53, begin: 90.0, index: 221 },
    { text: " yap", duration: 0.53, begin: 90.25, index: 222 },
    { text: "tı", duration: 0.53, begin: 90.5, index: 223 },
    { text: "ğı", duration: 0.53, begin: 90.75, index: 224 },
    { text: "nı", duration: 0.53, begin: 91.0, index: 225 },
    { text: " a", duration: 0.53, begin: 92.0, index: 226 },
    { text: "ma", duration: 0.53, begin: 92.25, index: 227 },
    { text: " i", duration: 0.53, begin: 93.0, index: 228 },
    { text: "zin", duration: 0.53, begin: 93.25, index: 229 },
    { text: " ver", duration: 0.53, begin: 93.5, index: 230 },
    { text: "me", duration: 0.53, begin: 93.75, index: 231 },
    { text: "dik", duration: 0.53, begin: 94.0, index: 232 },
    { text: "le", duration: 0.53, begin: 94.25, index: 233 },
    { text: "ri", duration: 0.53, begin: 94.5, index: 234 },
    { text: "ni", duration: 0.53, begin: 94.75, index: 235 },
    { text: " söy", duration: 0.53, begin: 95.0, index: 236 },
    { text: "le", duration: 0.53, begin: 95.25, index: 237 },
    { text: "di.", duration: 0.53, begin: 95.5, index: 238 },
    { text: " Ba", duration: 0.53, begin: 97.0, index: 239 },
    { text: "ba", duration: 0.53, begin: 97.25, index: 240 },
    { text: "sı", duration: 0.53, begin: 97.5, index: 241 },
    { text: "da:", duration: 0.53, begin: 97.75, index: 242 },
    { text: " Ü", duration: 0.53, begin: 99.0, index: 243 },
    { text: "zül", duration: 0.53, begin: 99.25, index: 244 },
    { text: "me", duration: 0.53, begin: 99.5, index: 245 },
    { text: " kı", duration: 0.53, begin: 99.75, index: 246 },
    { text: "zım,", duration: 0.53, begin: 100.0, index: 247 },
    { text: " baş", duration: 0.53, begin: 101.0, index: 248 },
    { text: "ka", duration: 0.53, begin: 101.25, index: 249 },
    { text: " bir", duration: 0.53, begin: 101.5, index: 250 },
    { text: " re", duration: 0.53, begin: 102.0, index: 251 },
    { text: "sim", duration: 0.53, begin: 102.25, index: 252 },
    { text: " ya", duration: 0.53, begin: 102.5, index: 253 },
    { text: "par", duration: 0.53, begin: 102.75, index: 254 },
    { text: "sın.", duration: 0.53, begin: 103.0, index: 255 },
    { text: " Bu", duration: 0.53, begin: 104.5, index: 256 },
    { text: "se", duration: 0.53, begin: 104.75, index: 257 },
    { text: "fer", duration: 0.53, begin: 105.0, index: 258 },
    { text: " res", duration: 0.53, begin: 106.25, index: 259 },
    { text: "min", duration: 0.53, begin: 106.5, index: 260 },
    { text: "de", duration: 0.53, begin: 106.75, index: 261 },
    { text: " çiz", duration: 0.53, begin: 107.0, index: 262 },
    { text: "dik", duration: 0.53, begin: 107.25, index: 263 },
    { text: "le", duration: 0.53, begin: 107.5, index: 264 },
    { text: "ri", duration: 0.53, begin: 107.75, index: 265 },
    { text: "ne", duration: 0.53, begin: 108.0, index: 266 },
    { text: " dik", duration: 0.53, begin: 109.25, index: 267 },
    { text: "kat", duration: 0.53, begin: 109.5, index: 268 },
    { text: " e", duration: 0.53, begin: 109.75, index: 269 },
    { text: "der", duration: 0.53, begin: 110.0, index: 270 },
    { text: "sin,", duration: 0.53, begin: 110.25, index: 271 },
    { text: " o", duration: 0.53, begin: 111.0, index: 272 },
    { text: "lur", duration: 0.53, begin: 111.25, index: 273 },
    { text: " mu?", duration: 0.53, begin: 111.5, index: 274 },
    { text: " de", duration: 0.53, begin: 112.5, index: 275 },
    { text: "di.", duration: 0.53, begin: 112.75, index: 276 },
    { text: " Kü", duration: 0.53, begin: 114.0, index: 277 },
    { text: "çük", duration: 0.53, begin: 114.25, index: 278 },
    { text: " kız", duration: 0.53, begin: 115.0, index: 279 },
    { text: " bir", duration: 0.53, begin: 115.75, index: 280 },
    { text: " son", duration: 0.53, begin: 116.0, index: 281 },
    { text: "ra", duration: 0.53, begin: 116.25, index: 282 },
    { text: "ki", duration: 0.53, begin: 116.5, index: 283 },
    { text: " zi", duration: 0.53, begin: 117.0, index: 284 },
    { text: "ya", duration: 0.53, begin: 117.25, index: 285 },
    { text: "re", duration: 0.53, begin: 117.5, index: 286 },
    { text: "tin", duration: 0.53, begin: 117.75, index: 287 },
    { text: "de", duration: 0.53, begin: 118.0, index: 288 },
    { text: " ba", duration: 0.53, begin: 119.0, index: 289 },
    { text: "ba", duration: 0.53, begin: 119.25, index: 290 },
    { text: "sı", duration: 0.53, begin: 119.5, index: 291 },
    { text: "na", duration: 0.53, begin: 119.75, index: 292 },
    { text: " ye", duration: 0.53, begin: 120.0, index: 293 },
    { text: "ni", duration: 0.53, begin: 120.25, index: 294 },
    { text: " bir", duration: 0.53, begin: 120.5, index: 295 },
    { text: " re", duration: 0.53, begin: 120.75, index: 296 },
    { text: "sim", duration: 0.53, begin: 121.0, index: 297 },
    { text: " ya", duration: 0.53, begin: 121.25, index: 298 },
    { text: "pıp", duration: 0.53, begin: 121.5, index: 299 },
    { text: " gö", duration: 0.53, begin: 122.25, index: 300 },
    { text: "tür", duration: 0.53, begin: 122.5, index: 301 },
    { text: "dü.", duration: 0.53, begin: 122.75, index: 302 },
    { text: " Bu", duration: 0.53, begin: 124.0, index: 303 },
    { text: " se", duration: 0.53, begin: 124.25, index: 304 },
    { text: "fer", duration: 0.53, begin: 124.5, index: 305 },
    { text: " re", duration: 0.53, begin: 125.5, index: 306 },
    { text: "sim", duration: 0.53, begin: 125.75, index: 307 },
    { text: "de", duration: 0.53, begin: 126.0, index: 308 },
    { text: " kuş", duration: 0.53, begin: 126.25, index: 309 },
    { text: "lar", duration: 0.53, begin: 126.5, index: 310 },
    { text: " yok", duration: 0.53, begin: 126.75, index: 311 },
    { text: "tu.", duration: 0.53, begin: 127.0, index: 312 },
    { text: " Bir", duration: 0.53, begin: 128.5, index: 313 },
    { text: " a", duration: 0.53, begin: 128.75, index: 314 },
    { text: "ğaç", duration: 0.53, begin: 129.0, index: 315 },
    { text: " ve", duration: 0.53, begin: 130.0, index: 316 },
    { text: " ü", duration: 0.53, begin: 130.5, index: 317 },
    { text: "ze", duration: 0.53, begin: 130.75, index: 318 },
    { text: "ri", duration: 0.53, begin: 131.0, index: 319 },
    { text: "ne", duration: 0.53, begin: 131.25, index: 320 },
    { text: " si", duration: 0.53, begin: 132.25, index: 321 },
    { text: "yah", duration: 0.53, begin: 132.5, index: 322 },
    { text: " mi", duration: 0.53, begin: 132.75, index: 323 },
    { text: "nik", duration: 0.53, begin: 133.0, index: 324 },
    { text: " be", duration: 0.53, begin: 133.25, index: 325 },
    { text: "nek", duration: 0.53, begin: 133.5, index: 326 },
    { text: "ler", duration: 0.53, begin: 133.75, index: 327 },
    { text: " çiz", duration: 0.53, begin: 134.5, index: 328 },
    { text: "miş", duration: 0.53, begin: 134.75, index: 329 },
    { text: "ti.", duration: 0.53, begin: 135.0, index: 330 },
    { text: " Bu", duration: 0.53, begin: 136.5, index: 331 },
    { text: " se", duration: 0.53, begin: 136.75, index: 332 },
    { text: "fer", duration: 0.53, begin: 137.0, index: 333 },
    { text: " i", duration: 0.53, begin: 137.25, index: 334 },
    { text: "zin", duration: 0.53, begin: 137.5, index: 335 },
    { text: " ver", duration: 0.53, begin: 138.0, index: 336 },
    { text: "miş", duration: 0.53, begin: 138.25, index: 337 },
    { text: "ler", duration: 0.53, begin: 138.5, index: 338 },
    { text: "di.", duration: 0.53, begin: 138.75, index: 339 },
    { text: " Ba", duration: 0.53, begin: 140.25, index: 340 },
    { text: "ba", duration: 0.53, begin: 140.5, index: 341 },
    { text: "sı", duration: 0.53, begin: 140.75, index: 342 },
    { text: " res", duration: 0.53, begin: 142.0, index: 343 },
    { text: "me", duration: 0.53, begin: 142.25, index: 344 },
    { text: " ke", duration: 0.53, begin: 142.5, index: 345 },
    { text: "yif", duration: 0.53, begin: 142.75, index: 346 },
    { text: "le", duration: 0.53, begin: 143.0, index: 347 },
    { text: " bak", duration: 0.53, begin: 143.25, index: 348 },
    { text: "tı", duration: 0.53, begin: 143.5, index: 349 },
    { text: " ve", duration: 0.53, begin: 143.75, index: 350 },
    { text: " sor", duration: 0.53, begin: 145.0, index: 351 },
    { text: "du:", duration: 0.53, begin: 145.25, index: 352 },
    { text: " Hmmm!", duration: 0.78, begin: 146.75, index: 353 },
    { text: " Ne", duration: 0.78, begin: 147.5, index: 354 },
    { text: " gü", duration: 0.78, begin: 147.75, index: 355 },
    { text: "zel", duration: 0.78, begin: 148.0, index: 356 },
    { text: " bir", duration: 0.78, begin: 148.25, index: 357 },
    { text: " a", duration: 0.78, begin: 148.5, index: 358 },
    { text: "ğaç", duration: 0.78, begin: 148.75, index: 359 },
    { text: " çiz", duration: 0.78, begin: 149.5, index: 360 },
    { text: "miş", duration: 0.78, begin: 149.75, index: 361 },
    { text: "sin!", duration: 0.78, begin: 150.0, index: 362 },
    { text: " A", duration: 0.53, begin: 151.5, index: 363 },
    { text: "ğa", duration: 0.53, begin: 151.75, index: 364 },
    { text: "cın", duration: 0.53, begin: 152.0, index: 365 },
    { text: " ü", duration: 0.53, begin: 152.25, index: 366 },
    { text: "ze", duration: 0.53, begin: 152.5, index: 367 },
    { text: "rin", duration: 0.53, begin: 152.75, index: 368 },
    { text: "de", duration: 0.53, begin: 153.0, index: 369 },
    { text: "ki", duration: 0.53, begin: 153.25, index: 370 },
    { text: " be", duration: 0.53, begin: 153.5, index: 371 },
    { text: "nek", duration: 0.53, begin: 153.75, index: 372 },
    { text: "ler", duration: 0.53, begin: 154.0, index: 373 },
    { text: " ne?", duration: 0.53, begin: 154.25, index: 374 },
    { text: " El", duration: 0.53, begin: 155.75, index: 375 },
    { text: "ma", duration: 0.53, begin: 156.0, index: 376 },
    { text: "mı", duration: 0.53, begin: 156.25, index: 377 },
    { text: " bun", duration: 0.53, begin: 156.5, index: 378 },
    { text: "lar?", duration: 0.53, begin: 156.75, index: 379 },
    { text: " Kü", duration: 0.53, begin: 158.0, index: 380 },
    { text: "çük", duration: 0.53, begin: 158.25, index: 381 },
    { text: " kız", duration: 0.53, begin: 158.5, index: 382 },
    { text: " ba", duration: 0.53, begin: 159.75, index: 383 },
    { text: "ba", duration: 0.53, begin: 160.0, index: 384 },
    { text: "sı", duration: 0.53, begin: 160.25, index: 385 },
    { text: "na", duration: 0.53, begin: 160.5, index: 386 },
    { text: " e", duration: 0.53, begin: 160.75, index: 387 },
    { text: "ği", duration: 0.53, begin: 161.0, index: 388 },
    { text: "le", duration: 0.53, begin: 161.25, index: 389 },
    { text: "rek,", duration: 0.53, begin: 161.5, index: 390 },
    { text: " ses", duration: 0.53, begin: 162.5, index: 391 },
    { text: "siz", duration: 0.53, begin: 162.75, index: 392 },
    { text: "ce:", duration: 0.53, begin: 163.0, index: 393 },
    { text: " Hşşşşt", duration: 0.53, begin: 164.25, index: 394 },
    { text: " O", duration: 0.53, begin: 165.25, index: 395 },
    { text: " be", duration: 0.53, begin: 165.5, index: 396 },
    { text: "nek", duration: 0.53, begin: 165.75, index: 397 },
    { text: "ler", duration: 0.53, begin: 166.0, index: 398 },
    { text: " el", duration: 0.53, begin: 167.25, index: 399 },
    { text: "ma", duration: 0.53, begin: 167.5, index: 400 },
    { text: " de", duration: 0.53, begin: 167.75, index: 401 },
    { text: "ğil,", duration: 0.53, begin: 168.0, index: 402 },
    { text: " a", duration: 0.53, begin: 168.75, index: 403 },
    { text: "ğa", duration: 0.53, begin: 169.0, index: 404 },
    { text: "cın", duration: 0.53, begin: 169.25, index: 405 },
    { text: " i", duration: 0.53, begin: 169.5, index: 406 },
    { text: "çin", duration: 0.53, begin: 169.75, index: 407 },
    { text: "de", duration: 0.53, begin: 170.0, index: 408 },
    { text: " sak", duration: 0.53, begin: 170.25, index: 409 },
    { text: "la", duration: 0.53, begin: 170.5, index: 410 },
    { text: "nan", duration: 0.53, begin: 170.75, index: 411 },
    { text: " kuş", duration: 0.53, begin: 172.0, index: 412 },
    { text: "la", duration: 0.53, begin: 172.25, index: 413 },
    { text: "rın", duration: 0.53, begin: 172.5, index: 414 },
    { text: " göz", duration: 0.53, begin: 172.75, index: 415 },
    { text: "le", duration: 0.53, begin: 173.0, index: 416 },
    { text: "ri!", duration: 0.53, begin: 173.25, index: 417 },
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
                      : "text-slate-900 opacity-40"
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
                href="/dashboard/stories/iyi-ornek-olmak"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/semsiye-tamircisi"
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
            src="/1-5.mp3"
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
