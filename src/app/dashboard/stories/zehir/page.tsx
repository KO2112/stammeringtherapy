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
    { text: "", duration: 0.154, begin: 0.7, index: 0 },

    // Title
    {
      text: "Ze",
      duration: 0.28,
      begin: 0.7,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "hir",
      duration: 0.38,
      begin: 1.218,
      index: 2,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " U", duration: 0.28, begin: 2.0, index: 3 },
    { text: "zun", duration: 0.53, begin: 2.25, index: 4 },
    { text: " yıl", duration: 0.53, begin: 2.5, index: 5 },
    { text: "lar", duration: 0.53, begin: 2.75, index: 6 },
    { text: " ön", duration: 0.53, begin: 3.0, index: 7 },
    { text: "ce", duration: 0.53, begin: 3.25, index: 8 },
    { text: " Çin'", duration: 0.53, begin: 4.25, index: 9 },
    { text: "de", duration: 0.53, begin: 4.5, index: 10 },
    { text: " Li", duration: 0.38, begin: 5.5, index: 11 },
    { text: "li", duration: 0.38, begin: 5.75, index: 12 },
    { text: " ad", duration: 0.53, begin: 6.0, index: 13 },
    { text: "lı", duration: 0.53, begin: 6.25, index: 14 },
    { text: " bir", duration: 0.53, begin: 6.5, index: 15 },
    { text: " kız", duration: 0.53, begin: 6.75, index: 16 },
    { text: " ev", duration: 0.53, begin: 7.0, index: 17 },
    { text: "le", duration: 0.53, begin: 7.25, index: 18 },
    { text: "nir,", duration: 0.53, begin: 7.5, index: 19 },
    { text: " ay", duration: 0.53, begin: 8.75, index: 20 },
    { text: "nı", duration: 0.53, begin: 9.0, index: 21 },
    { text: " ev", duration: 0.53, begin: 9.25, index: 22 },
    { text: "de", duration: 0.53, begin: 9.5, index: 23 },
    { text: " ko", duration: 0.53, begin: 10.5, index: 24 },
    { text: "ca", duration: 0.53, begin: 10.75, index: 25 },
    { text: "sı", duration: 0.53, begin: 11.0, index: 26 },
    { text: " ve", duration: 0.53, begin: 11.25, index: 27 },
    { text: " kay", duration: 0.53, begin: 11.5, index: 28 },
    { text: "na", duration: 0.53, begin: 11.75, index: 29 },
    { text: "na", duration: 0.53, begin: 12.0, index: 30 },
    { text: "sıy", duration: 0.53, begin: 12.25, index: 31 },
    { text: "la", duration: 0.53, begin: 12.5, index: 32 },
    { text: " bir", duration: 0.68, begin: 12.75, index: 33 },
    { text: "lik", duration: 0.68, begin: 13.0, index: 34 },
    { text: "te", duration: 0.68, begin: 13.25, index: 35 },
    { text: " ya", duration: 0.53, begin: 14.5, index: 36 },
    { text: "şa", duration: 0.53, begin: 14.75, index: 37 },
    { text: "ma", duration: 0.53, begin: 15.0, index: 38 },
    { text: "ya", duration: 0.53, begin: 15.25, index: 39 },
    { text: " baş", duration: 0.53, begin: 15.5, index: 40 },
    { text: "lar.", duration: 0.53, begin: 15.75, index: 41 },
    { text: " La", duration: 0.53, begin: 17.0, index: 42 },
    { text: "kin", duration: 0.53, begin: 17.25, index: 43 },
    { text: " kı", duration: 0.53, begin: 18.25, index: 44 },
    { text: "sa", duration: 0.53, begin: 18.5, index: 45 },
    { text: " sü", duration: 0.53, begin: 18.75, index: 46 },
    { text: "re", duration: 0.53, begin: 19.0, index: 47 },
    { text: " son", duration: 0.53, begin: 19.25, index: 48 },
    { text: "ra", duration: 0.53, begin: 19.5, index: 49 },
    { text: " ka", duration: 0.53, begin: 20.5, index: 50 },
    { text: "yın", duration: 0.53, begin: 20.75, index: 51 },
    { text: "va", duration: 0.53, begin: 21.0, index: 52 },
    { text: "li", duration: 0.53, begin: 21.25, index: 53 },
    { text: "de", duration: 0.53, begin: 21.5, index: 54 },
    { text: "siy", duration: 0.53, begin: 21.75, index: 55 },
    { text: "le", duration: 0.53, begin: 22.0, index: 56 },
    { text: " ge", duration: 0.53, begin: 22.25, index: 57 },
    { text: "çin", duration: 0.53, begin: 22.5, index: 58 },
    { text: "me", duration: 0.53, begin: 22.75, index: 59 },
    { text: "nin", duration: 0.53, begin: 23.0, index: 60 },
    { text: " çok", duration: 0.53, begin: 24.25, index: 61 },
    { text: " zor", duration: 0.53, begin: 24.5, index: 62 },
    { text: " ol", duration: 0.53, begin: 24.75, index: 63 },
    { text: "du", duration: 0.53, begin: 25.0, index: 64 },
    { text: "ğu", duration: 0.53, begin: 25.25, index: 65 },
    { text: "nu", duration: 0.53, begin: 25.5, index: 66 },
    { text: " an", duration: 0.53, begin: 25.75, index: 67 },
    { text: "lar.", duration: 0.53, begin: 26.0, index: 68 },
    { text: " İ", duration: 0.53, begin: 27.5, index: 69 },
    { text: "ki", duration: 0.53, begin: 27.75, index: 70 },
    { text: "si", duration: 0.53, begin: 28.0, index: 71 },
    { text: "nin", duration: 0.53, begin: 28.25, index: 72 },
    { text: " ki", duration: 0.53, begin: 28.5, index: 73 },
    { text: "şi", duration: 0.53, begin: 28.75, index: 74 },
    { text: "li", duration: 0.53, begin: 29.0, index: 75 },
    { text: "ği", duration: 0.53, begin: 29.25, index: 76 },
    { text: " ta", duration: 0.38, begin: 30.0, index: 77 },
    { text: "ma", duration: 0.38, begin: 30.25, index: 78 },
    { text: "men", duration: 0.38, begin: 30.5, index: 79 },
    { text: " fark", duration: 0.53, begin: 30.75, index: 80 },
    { text: "lı", duration: 0.53, begin: 31.0, index: 81 },
    { text: "dır,", duration: 0.53, begin: 31.25, index: 82 },
    { text: " bu", duration: 0.53, begin: 32.5, index: 83 },
    { text: " da", duration: 0.53, begin: 32.75, index: 84 },
    { text: " on", duration: 0.53, begin: 33.75, index: 85 },
    { text: "la", duration: 0.53, begin: 34.0, index: 86 },
    { text: "rın", duration: 0.53, begin: 34.25, index: 87 },
    { text: " sık", duration: 0.53, begin: 34.5, index: 88 },
    { text: " sık", duration: 0.53, begin: 34.75, index: 89 },
    { text: " kav", duration: 0.53, begin: 35.25, index: 90 },
    { text: "ga", duration: 0.53, begin: 35.5, index: 91 },
    { text: " e", duration: 0.53, begin: 35.75, index: 92 },
    { text: "dip", duration: 0.53, begin: 36.0, index: 93 },
    { text: " tar", duration: 0.53, begin: 37.25, index: 94 },
    { text: "tış", duration: 0.53, begin: 37.5, index: 95 },
    { text: "ma", duration: 0.53, begin: 37.75, index: 96 },
    { text: "la", duration: 0.53, begin: 38.0, index: 97 },
    { text: "rı", duration: 0.53, begin: 38.25, index: 98 },
    { text: "na", duration: 0.53, begin: 38.5, index: 99 },
    { text: " yol", duration: 0.53, begin: 38.75, index: 100 },
    { text: " a", duration: 0.53, begin: 39.0, index: 101 },
    { text: "çar.", duration: 0.53, begin: 39.25, index: 102 },
    { text: " Bu", duration: 0.53, begin: 40.25, index: 103 },
    { text: " Çin", duration: 0.53, begin: 41.25, index: 104 },
    { text: " ge", duration: 0.53, begin: 41.5, index: 105 },
    { text: "le", duration: 0.53, begin: 41.75, index: 106 },
    { text: "nek", duration: 0.53, begin: 42.0, index: 107 },
    { text: "le", duration: 0.53, begin: 42.25, index: 108 },
    { text: "ri", duration: 0.53, begin: 42.5, index: 109 },
    { text: "ne", duration: 0.53, begin: 42.75, index: 110 },
    { text: " gö", duration: 0.53, begin: 43.0, index: 111 },
    { text: "re", duration: 0.53, begin: 43.25, index: 112 },
    { text: " hoş", duration: 0.53, begin: 44.25, index: 113 },
    { text: " bir", duration: 0.53, begin: 44.5, index: 114 },
    { text: " dav", duration: 0.53, begin: 44.75, index: 115 },
    { text: "ra", duration: 0.53, begin: 45.0, index: 116 },
    { text: "nış", duration: 0.53, begin: 45.25, index: 117 },
    { text: " de", duration: 0.53, begin: 45.5, index: 118 },
    { text: "ğil", duration: 0.53, begin: 45.75, index: 119 },
    { text: "dir", duration: 0.53, begin: 46.0, index: 120 },
    { text: " ve", duration: 0.53, begin: 46.75, index: 121 },
    { text: " çev", duration: 0.53, begin: 47.5, index: 122 },
    { text: "re", duration: 0.53, begin: 47.75, index: 123 },
    { text: "nin", duration: 0.53, begin: 48.0, index: 124 },
    { text: " tep", duration: 0.68, begin: 48.25, index: 125 },
    { text: "ki", duration: 0.68, begin: 48.5, index: 126 },
    { text: "si", duration: 0.68, begin: 48.75, index: 127 },
    { text: "ne", duration: 0.68, begin: 49.0, index: 128 },
    { text: " yol", duration: 0.53, begin: 49.25, index: 129 },
    { text: " a", duration: 0.53, begin: 49.5, index: 130 },
    { text: "çar.", duration: 0.53, begin: 50.0, index: 131 },
    { text: " Bir", duration: 0.53, begin: 51.5, index: 132 },
    { text: " kaç", duration: 0.53, begin: 51.75, index: 133 },
    { text: " ay", duration: 0.53, begin: 52.0, index: 134 },
    { text: " son", duration: 0.53, begin: 52.25, index: 135 },
    { text: "ra", duration: 0.53, begin: 52.5, index: 136 },
    { text: " ev,", duration: 0.53, begin: 53.25, index: 137 },
    { text: " bit", duration: 0.53, begin: 54.25, index: 138 },
    { text: "mez", duration: 0.53, begin: 54.5, index: 139 },
    { text: " tü", duration: 0.53, begin: 54.75, index: 140 },
    { text: "ken", duration: 0.53, begin: 55.0, index: 141 },
    { text: "mez", duration: 0.53, begin: 55.25, index: 142 },
    { text: " ge", duration: 0.53, begin: 56.0, index: 143 },
    { text: "lin", duration: 0.53, begin: 56.25, index: 144 },
    { text: " kay", duration: 0.53, begin: 56.5, index: 145 },
    { text: "na", duration: 0.53, begin: 56.75, index: 146 },
    { text: "na", duration: 0.53, begin: 57.0, index: 147 },
    { text: " kav", duration: 0.53, begin: 57.25, index: 148 },
    { text: "ga", duration: 0.53, begin: 57.5, index: 149 },
    { text: "la", duration: 0.53, begin: 57.75, index: 150 },
    { text: "rın", duration: 0.53, begin: 58.0, index: 151 },
    { text: "dan", duration: 0.53, begin: 58.25, index: 152 },
    { text: " ken", duration: 0.53, begin: 59.5, index: 153 },
    { text: "di", duration: 0.53, begin: 59.75, index: 154 },
    { text: "si", duration: 0.53, begin: 60.0, index: 155 },
    { text: "nin", duration: 0.53, begin: 60.25, index: 156 },
    { text: " ve", duration: 0.53, begin: 61.0, index: 157 },
    { text: " an", duration: 0.53, begin: 61.5, index: 158 },
    { text: "ne", duration: 0.53, begin: 61.75, index: 159 },
    { text: "siy", duration: 0.53, begin: 62.0, index: 160 },
    { text: "le", duration: 0.53, begin: 62.25, index: 161 },
    { text: " ka", duration: 0.53, begin: 62.5, index: 162 },
    { text: "rı", duration: 0.53, begin: 62.75, index: 163 },
    { text: "sı", duration: 0.53, begin: 63.0, index: 164 },
    { text: " a", duration: 0.53, begin: 63.25, index: 165 },
    { text: "ra", duration: 0.53, begin: 63.5, index: 166 },
    { text: "sın", duration: 0.53, begin: 63.75, index: 167 },
    { text: "da", duration: 0.53, begin: 64.0, index: 168 },
    { text: " ka", duration: 0.53, begin: 64.25, index: 169 },
    { text: "lan", duration: 0.53, begin: 64.5, index: 170 },
    { text: " e", duration: 0.53, begin: 65.5, index: 171 },
    { text: "şi", duration: 0.53, begin: 65.75, index: 172 },
    { text: " i", duration: 0.53, begin: 66.0, index: 173 },
    { text: "çin", duration: 0.53, begin: 66.25, index: 174 },
    { text: " ce", duration: 0.53, begin: 67.0, index: 175 },
    { text: "hen", duration: 0.53, begin: 67.25, index: 176 },
    { text: "nem", duration: 0.53, begin: 67.5, index: 177 },
    { text: " ha", duration: 0.53, begin: 68.0, index: 178 },
    { text: "li", duration: 0.53, begin: 68.25, index: 179 },
    { text: "ne", duration: 0.53, begin: 68.5, index: 180 },
    { text: " gel", duration: 0.68, begin: 68.75, index: 181 },
    { text: "miş", duration: 0.68, begin: 69.0, index: 182 },
    { text: "tir.", duration: 0.68, begin: 69.25, index: 183 },
    { text: " Ar", duration: 0.53, begin: 71.25, index: 184 },
    { text: "tık", duration: 0.53, begin: 71.5, index: 185 },
    { text: " her", duration: 0.53, begin: 71.75, index: 186 },
    { text: "şe", duration: 0.53, begin: 72.0, index: 187 },
    { text: "yi", duration: 0.53, begin: 72.25, index: 188 },
    { text: " yap", duration: 0.53, begin: 72.5, index: 189 },
    { text: "mak", duration: 0.53, begin: 72.75, index: 190 },
    { text: " ge", duration: 0.53, begin: 73.25, index: 191 },
    { text: "rek", duration: 0.53, begin: 73.5, index: 192 },
    { text: "ti", duration: 0.53, begin: 73.75, index: 193 },
    { text: "ği", duration: 0.53, begin: 74.0, index: 194 },
    { text: "ne", duration: 0.53, begin: 74.25, index: 195 },
    { text: " i", duration: 0.53, begin: 74.5, index: 196 },
    { text: "na", duration: 0.53, begin: 74.75, index: 197 },
    { text: "nan", duration: 0.53, begin: 75.0, index: 198 },
    { text: " genç", duration: 0.53, begin: 75.5, index: 199 },
    { text: " kız", duration: 0.53, begin: 75.75, index: 200 },
    { text: " doğ", duration: 0.53, begin: 77.25, index: 201 },
    { text: "ru", duration: 0.53, begin: 77.5, index: 202 },
    { text: "ca", duration: 0.53, begin: 77.75, index: 203 },
    { text: " ba", duration: 0.28, begin: 78.75, index: 204 },
    { text: "ba", duration: 0.28, begin: 79.0, index: 205 },
    { text: "sı", duration: 0.28, begin: 79.25, index: 206 },
    { text: "nın", duration: 0.28, begin: 79.5, index: 207 },
    { text: " es", duration: 0.53, begin: 79.75, index: 208 },
    { text: "ki", duration: 0.53, begin: 80.0, index: 209 },
    { text: " ar", duration: 0.53, begin: 80.25, index: 210 },
    { text: "ka", duration: 0.53, begin: 80.5, index: 211 },
    { text: "da", duration: 0.53, begin: 80.75, index: 212 },
    { text: "şı", duration: 0.53, begin: 81.0, index: 213 },
    { text: " o", duration: 0.53, begin: 81.75, index: 214 },
    { text: "lan", duration: 0.53, begin: 82.0, index: 215 },
    { text: " ak", duration: 0.68, begin: 82.75, index: 216 },
    { text: "ta", duration: 0.68, begin: 83.0, index: 217 },
    { text: "ra", duration: 0.68, begin: 83.25, index: 218 },
    { text: " ko", duration: 0.68, begin: 83.5, index: 219 },
    { text: "şar", duration: 0.68, begin: 83.75, index: 220 },
    { text: " ve", duration: 0.53, begin: 84.25, index: 221 },
    { text: " der", duration: 0.53, begin: 85.5, index: 222 },
    { text: "di", duration: 0.53, begin: 85.75, index: 223 },
    { text: "ni", duration: 0.53, begin: 86.0, index: 224 },
    { text: " an", duration: 0.53, begin: 86.25, index: 225 },
    { text: "la", duration: 0.53, begin: 86.5, index: 226 },
    { text: "tır.", duration: 0.53, begin: 86.75, index: 227 },
    { text: " Yaş", duration: 0.53, begin: 88.25, index: 228 },
    { text: "lı", duration: 0.53, begin: 88.5, index: 229 },
    { text: " a", duration: 0.53, begin: 88.75, index: 230 },
    { text: "dam", duration: 0.53, begin: 89.0, index: 231 },
    { text: " o", duration: 0.53, begin: 90.0, index: 232 },
    { text: "na", duration: 0.53, begin: 90.25, index: 233 },
    { text: " bit", duration: 0.53, begin: 90.5, index: 234 },
    { text: "ki", duration: 0.53, begin: 90.75, index: 235 },
    { text: "ler", duration: 0.53, begin: 91.0, index: 236 },
    { text: "den", duration: 0.53, begin: 91.25, index: 237 },
    { text: " yap", duration: 0.68, begin: 91.5, index: 238 },
    { text: "tı", duration: 0.68, begin: 91.75, index: 239 },
    { text: "ğı", duration: 0.68, begin: 92.0, index: 240 },
    { text: " ze", duration: 0.53, begin: 92.5, index: 241 },
    { text: "hi", duration: 0.53, begin: 92.75, index: 242 },
    { text: "ri", duration: 0.53, begin: 93.0, index: 243 },
    { text: " ha", duration: 0.53, begin: 93.25, index: 244 },
    { text: "zır", duration: 0.53, begin: 93.5, index: 245 },
    { text: "lar", duration: 0.53, begin: 93.75, index: 246 },
    { text: " ve", duration: 0.53, begin: 94.5, index: 247 },
    { text: " bu", duration: 0.53, begin: 95.5, index: 248 },
    { text: "nu", duration: 0.53, begin: 95.75, index: 249 },
    { text: " üç", duration: 0.53, begin: 96.0, index: 250 },
    { text: " ay", duration: 0.53, begin: 96.25, index: 251 },
    { text: " bo", duration: 0.53, begin: 97.0, index: 252 },
    { text: "yun", duration: 0.53, begin: 97.25, index: 253 },
    { text: "ca", duration: 0.53, begin: 97.5, index: 254 },
    { text: " her", duration: 0.53, begin: 98.5, index: 255 },
    { text: " gün", duration: 0.53, begin: 98.75, index: 256 },
    { text: " a", duration: 0.53, begin: 99.75, index: 257 },
    { text: "zar", duration: 0.53, begin: 100.0, index: 258 },
    { text: " a", duration: 0.53, begin: 100.25, index: 259 },
    { text: "zar", duration: 0.53, begin: 100.5, index: 260 },
    { text: " kay", duration: 0.53, begin: 101.25, index: 261 },
    { text: "na", duration: 0.53, begin: 101.5, index: 262 },
    { text: "na", duration: 0.53, begin: 101.75, index: 263 },
    { text: "sı", duration: 0.53, begin: 102.0, index: 264 },
    { text: " i", duration: 0.53, begin: 102.25, index: 265 },
    { text: "çin", duration: 0.53, begin: 102.5, index: 266 },
    { text: " yap", duration: 0.53, begin: 103.5, index: 267 },
    { text: "tı", duration: 0.53, begin: 103.75, index: 268 },
    { text: "ğı", duration: 0.53, begin: 104.0, index: 269 },
    { text: " ye", duration: 0.53, begin: 104.25, index: 270 },
    { text: "mek", duration: 0.53, begin: 104.5, index: 271 },
    { text: "le", duration: 0.53, begin: 104.75, index: 272 },
    { text: "re", duration: 0.53, begin: 105.0, index: 273 },
    { text: " koy", duration: 0.53, begin: 105.25, index: 274 },
    { text: "ma", duration: 0.53, begin: 105.5, index: 275 },
    { text: "sı", duration: 0.53, begin: 105.75, index: 276 },
    { text: "nı", duration: 0.53, begin: 106.0, index: 277 },
    { text: " söy", duration: 0.53, begin: 106.25, index: 278 },
    { text: "ler.", duration: 0.53, begin: 106.5, index: 279 },
    { text: " Ze", duration: 0.53, begin: 108.25, index: 280 },
    { text: "hir", duration: 0.53, begin: 108.5, index: 281 },
    { text: " az", duration: 0.53, begin: 109.25, index: 282 },
    { text: " az", duration: 0.53, begin: 109.5, index: 283 },
    { text: " ve", duration: 0.53, begin: 110.25, index: 284 },
    { text: "ri", duration: 0.53, begin: 110.5, index: 285 },
    { text: "le", duration: 0.53, begin: 110.75, index: 286 },
    { text: "cek,", duration: 0.53, begin: 111.0, index: 287 },
    { text: " böy", duration: 0.53, begin: 112.0, index: 288 },
    { text: "le", duration: 0.53, begin: 112.25, index: 289 },
    { text: "ce", duration: 0.53, begin: 112.5, index: 290 },
    { text: " o", duration: 0.53, begin: 112.75, index: 291 },
    { text: "nu", duration: 0.53, begin: 113.0, index: 292 },
    { text: " ge", duration: 0.53, begin: 113.75, index: 293 },
    { text: "li", duration: 0.53, begin: 114.0, index: 294 },
    { text: "ni", duration: 0.53, begin: 114.25, index: 295 },
    { text: "nin", duration: 0.53, begin: 114.5, index: 296 },
    { text: " öl", duration: 0.53, begin: 114.75, index: 297 },
    { text: "dür", duration: 0.53, begin: 115.0, index: 298 },
    { text: "dü", duration: 0.53, begin: 115.25, index: 299 },
    { text: "ğü", duration: 0.53, begin: 115.5, index: 300 },
    { text: " bel", duration: 0.53, begin: 116.25, index: 301 },
    { text: "li", duration: 0.53, begin: 116.5, index: 302 },
    { text: " ol", duration: 0.53, begin: 116.75, index: 303 },
    { text: "ma", duration: 0.53, begin: 117.0, index: 304 },
    { text: "ya", duration: 0.53, begin: 117.25, index: 305 },
    { text: "cak", duration: 0.53, begin: 117.5, index: 306 },
    { text: "tır.", duration: 0.53, begin: 117.75, index: 307 },
    { text: " Yaş", duration: 0.53, begin: 119.5, index: 308 },
    { text: "lı", duration: 0.53, begin: 119.75, index: 309 },
    { text: " a", duration: 0.53, begin: 120.0, index: 310 },
    { text: "dam", duration: 0.53, begin: 120.25, index: 311 },
    { text: " genç", duration: 0.53, begin: 121.0, index: 312 },
    { text: " kı", duration: 0.53, begin: 121.25, index: 313 },
    { text: "za", duration: 0.53, begin: 121.5, index: 314 },
    { text: " kim", duration: 0.53, begin: 122.75, index: 315 },
    { text: "se", duration: 0.53, begin: 123.0, index: 316 },
    { text: "nin", duration: 0.53, begin: 123.25, index: 317 },
    { text: " ve", duration: 0.53, begin: 123.5, index: 318 },
    { text: " e", duration: 0.53, begin: 124.25, index: 319 },
    { text: "şi", duration: 0.53, begin: 124.5, index: 320 },
    { text: "nin", duration: 0.53, begin: 124.75, index: 321 },
    { text: " şüp", duration: 0.53, begin: 125.5, index: 322 },
    { text: "he", duration: 0.53, begin: 125.75, index: 323 },
    { text: "len", duration: 0.53, begin: 126.0, index: 324 },
    { text: "me", duration: 0.53, begin: 126.25, index: 325 },
    { text: "me", duration: 0.53, begin: 126.5, index: 326 },
    { text: "si", duration: 0.53, begin: 126.75, index: 327 },
    { text: " i", duration: 0.53, begin: 127.25, index: 328 },
    { text: "çin", duration: 0.53, begin: 127.5, index: 329 },
    { text: " kay", duration: 0.53, begin: 128.5, index: 330 },
    { text: "na", duration: 0.53, begin: 128.75, index: 331 },
    { text: "na", duration: 0.53, begin: 129.0, index: 332 },
    { text: "sı", duration: 0.53, begin: 129.25, index: 333 },
    { text: "na", duration: 0.53, begin: 129.5, index: 334 },
    { text: " çok", duration: 0.53, begin: 129.75, index: 335 },
    { text: " i", duration: 0.53, begin: 130.0, index: 336 },
    { text: "yi", duration: 0.53, begin: 130.25, index: 337 },
    { text: " dav", duration: 0.53, begin: 130.5, index: 338 },
    { text: "ran", duration: 0.53, begin: 130.75, index: 339 },
    { text: "ma", duration: 0.53, begin: 131.0, index: 340 },
    { text: "sı", duration: 0.53, begin: 131.25, index: 341 },
    { text: "nı,", duration: 0.53, begin: 131.5, index: 342 },
    { text: " o", duration: 0.53, begin: 133.0, index: 343 },
    { text: "na", duration: 0.53, begin: 133.25, index: 344 },
    { text: " en", duration: 0.53, begin: 133.5, index: 345 },
    { text: " gü", duration: 0.53, begin: 133.75, index: 346 },
    { text: "zel", duration: 0.53, begin: 134.0, index: 347 },
    { text: " ye", duration: 0.68, begin: 134.25, index: 348 },
    { text: "mek", duration: 0.68, begin: 134.5, index: 349 },
    { text: "le", duration: 0.68, begin: 134.75, index: 350 },
    { text: "ri", duration: 0.68, begin: 135.0, index: 351 },
    { text: " yap", duration: 0.68, begin: 135.25, index: 352 },
    { text: "ma", duration: 0.68, begin: 135.5, index: 353 },
    { text: "sı", duration: 0.68, begin: 135.75, index: 354 },
    { text: "nı,", duration: 0.68, begin: 136.0, index: 355 },
    { text: " her", duration: 0.68, begin: 137.5, index: 356 },
    { text: " za", duration: 0.68, begin: 137.75, index: 357 },
    { text: "man", duration: 0.68, begin: 138.0, index: 358 },
    { text: "kin", duration: 0.68, begin: 138.25, index: 359 },
    { text: "den", duration: 0.68, begin: 138.5, index: 360 },
    { text: " da", duration: 0.53, begin: 139.5, index: 361 },
    { text: "ha", duration: 0.53, begin: 139.75, index: 362 },
    { text: " bü", duration: 0.53, begin: 140.25, index: 363 },
    { text: "yük", duration: 0.53, begin: 140.5, index: 364 },
    { text: " bir", duration: 0.53, begin: 140.75, index: 365 },
    { text: " il", duration: 0.53, begin: 141.0, index: 366 },
    { text: "gi", duration: 0.53, begin: 141.25, index: 367 },
    { text: " gös", duration: 0.68, begin: 141.5, index: 368 },
    { text: "ter", duration: 0.68, begin: 141.75, index: 369 },
    { text: "me", duration: 0.68, begin: 142.0, index: 370 },
    { text: "si", duration: 0.68, begin: 142.25, index: 371 },
    { text: "ni", duration: 0.68, begin: 142.5, index: 372 },
    { text: " söy", duration: 0.68, begin: 143.25, index: 373 },
    { text: "ler.", duration: 0.68, begin: 143.5, index: 374 },
    { text: " Se", duration: 0.28, begin: 145.5, index: 375 },
    { text: "vinç", duration: 0.28, begin: 145.75, index: 376 },
    { text: " i", duration: 0.38, begin: 146.25, index: 377 },
    { text: "çin", duration: 0.38, begin: 146.5, index: 378 },
    { text: "de", duration: 0.38, begin: 146.75, index: 379 },
    { text: " e", duration: 0.53, begin: 147.0, index: 380 },
    { text: "ve", duration: 0.53, begin: 147.25, index: 381 },
    { text: " dö", duration: 0.53, begin: 147.5, index: 382 },
    { text: "nen", duration: 0.53, begin: 147.75, index: 383 },
    { text: " Li", duration: 0.53, begin: 148.25, index: 384 },
    { text: "li", duration: 0.53, begin: 148.5, index: 385 },
    { text: " yaş", duration: 0.53, begin: 149.25, index: 386 },
    { text: "lı", duration: 0.53, begin: 149.5, index: 387 },
    { text: " a", duration: 0.53, begin: 149.75, index: 388 },
    { text: "da", duration: 0.53, begin: 150.0, index: 389 },
    { text: "mın", duration: 0.53, begin: 150.25, index: 390 },
    { text: " de", duration: 0.53, begin: 150.5, index: 391 },
    { text: "dik", duration: 0.53, begin: 150.75, index: 392 },
    { text: "le", duration: 0.53, begin: 151.0, index: 393 },
    { text: "ri", duration: 0.53, begin: 151.25, index: 394 },
    { text: "ni", duration: 0.53, begin: 151.5, index: 395 },
    { text: " ay", duration: 0.53, begin: 152.5, index: 396 },
    { text: "nen", duration: 0.53, begin: 152.75, index: 397 },
    { text: " uy", duration: 0.53, begin: 153.0, index: 398 },
    { text: "gu", duration: 0.53, begin: 153.25, index: 399 },
    { text: "lar.", duration: 0.53, begin: 153.5, index: 400 },
    { text: " Her", duration: 0.53, begin: 155.0, index: 401 },
    { text: " gün", duration: 0.53, begin: 155.25, index: 402 },
    { text: " en", duration: 0.53, begin: 156.25, index: 403 },
    { text: " gü", duration: 0.53, begin: 156.5, index: 404 },
    { text: "zel", duration: 0.53, begin: 156.75, index: 405 },
    { text: " ye", duration: 0.53, begin: 157.0, index: 406 },
    { text: "mek", duration: 0.53, begin: 157.25, index: 407 },
    { text: "le", duration: 0.53, begin: 157.5, index: 408 },
    { text: "ri", duration: 0.53, begin: 157.75, index: 409 },
    { text: " ya", duration: 0.53, begin: 158.0, index: 410 },
    { text: "par", duration: 0.53, begin: 158.25, index: 411 },
    { text: " ve", duration: 0.53, begin: 159.0, index: 412 },
    { text: " kay", duration: 0.53, begin: 159.75, index: 413 },
    { text: "na", duration: 0.53, begin: 160.0, index: 414 },
    { text: "na", duration: 0.53, begin: 160.25, index: 415 },
    { text: "sı", duration: 0.53, begin: 160.5, index: 416 },
    { text: "nın", duration: 0.53, begin: 160.75, index: 417 },
    { text: " ta", duration: 0.68, begin: 161.25, index: 418 },
    { text: "ba", duration: 0.68, begin: 161.5, index: 419 },
    { text: "ğı", duration: 0.68, begin: 161.75, index: 420 },
    { text: "na", duration: 0.68, begin: 162.0, index: 421 },
    { text: " a", duration: 0.68, begin: 162.5, index: 422 },
    { text: "zar", duration: 0.68, begin: 162.75, index: 423 },
    { text: " a", duration: 0.68, begin: 163.0, index: 424 },
    { text: "zar", duration: 0.68, begin: 163.25, index: 425 },
    { text: " ze", duration: 0.68, begin: 163.75, index: 426 },
    { text: "hi", duration: 0.68, begin: 164.0, index: 427 },
    { text: "ri", duration: 0.68, begin: 164.25, index: 428 },
    { text: " dam", duration: 0.68, begin: 164.5, index: 429 },
    { text: "la", duration: 0.68, begin: 164.75, index: 430 },
    { text: "tır.", duration: 0.68, begin: 165.0, index: 431 },
    { text: " Kim", duration: 0.53, begin: 167.0, index: 432 },
    { text: "se", duration: 0.53, begin: 167.25, index: 433 },
    { text: "ler", duration: 0.53, begin: 167.5, index: 434 },
    { text: " şüp", duration: 0.53, begin: 167.75, index: 435 },
    { text: "he", duration: 0.53, begin: 168.0, index: 436 },
    { text: "len", duration: 0.53, begin: 168.25, index: 437 },
    { text: "me", duration: 0.53, begin: 168.5, index: 438 },
    { text: "sin", duration: 0.53, begin: 168.75, index: 439 },
    { text: " di", duration: 0.53, begin: 169.0, index: 440 },
    { text: "ye", duration: 0.53, begin: 169.25, index: 441 },
    { text: " de", duration: 0.53, begin: 169.5, index: 442 },
    { text: " o", duration: 0.53, begin: 170.5, index: 443 },
    { text: "na", duration: 0.53, begin: 170.75, index: 444 },
    { text: " çok", duration: 0.53, begin: 171.0, index: 445 },
    { text: " i", duration: 0.53, begin: 171.25, index: 446 },
    { text: "yi", duration: 0.53, begin: 171.5, index: 447 },
    { text: " dav", duration: 0.53, begin: 171.75, index: 448 },
    { text: "ra", duration: 0.53, begin: 172.0, index: 449 },
    { text: "nır.", duration: 0.53, begin: 172.25, index: 450 },
    { text: " Bir", duration: 0.53, begin: 173.75, index: 451 },
    { text: " sü", duration: 0.53, begin: 174.0, index: 452 },
    { text: "re", duration: 0.53, begin: 174.25, index: 453 },
    { text: " son", duration: 0.53, begin: 174.5, index: 454 },
    { text: "ra", duration: 0.53, begin: 174.75, index: 455 },
    { text: " ka", duration: 0.53, begin: 175.75, index: 456 },
    { text: "yın", duration: 0.53, begin: 176.0, index: 457 },
    { text: "va", duration: 0.53, begin: 176.25, index: 458 },
    { text: "li", duration: 0.53, begin: 176.5, index: 459 },
    { text: "de", duration: 0.53, begin: 176.75, index: 460 },
    { text: "si", duration: 0.53, begin: 177.0, index: 461 },
    { text: " de", duration: 0.53, begin: 177.75, index: 462 },
    { text: " çok", duration: 0.53, begin: 178.25, index: 463 },
    { text: " de", duration: 0.53, begin: 178.75, index: 464 },
    { text: "ğiş", duration: 0.53, begin: 179.0, index: 465 },
    { text: "miş", duration: 0.53, begin: 179.25, index: 466 },
    { text: "tir", duration: 0.53, begin: 179.5, index: 467 },
    { text: " ve", duration: 0.53, begin: 180.25, index: 468 },
    { text: " ge", duration: 0.53, begin: 181.0, index: 469 },
    { text: "li", duration: 0.53, begin: 181.25, index: 470 },
    { text: "ni", duration: 0.53, begin: 181.5, index: 471 },
    { text: "ne", duration: 0.53, begin: 181.75, index: 472 },
    { text: " ken", duration: 0.53, begin: 182.0, index: 473 },
    { text: "di", duration: 0.53, begin: 182.25, index: 474 },
    { text: " kı", duration: 0.53, begin: 182.5, index: 475 },
    { text: "zı", duration: 0.53, begin: 182.75, index: 476 },
    { text: " gi", duration: 0.53, begin: 183.0, index: 477 },
    { text: "bi", duration: 0.53, begin: 183.25, index: 478 },
    { text: " dav", duration: 0.53, begin: 183.5, index: 479 },
    { text: "ran", duration: 0.53, begin: 183.75, index: 480 },
    { text: "ma", duration: 0.53, begin: 184.0, index: 481 },
    { text: "ya", duration: 0.53, begin: 184.25, index: 482 },
    { text: " baş", duration: 0.53, begin: 185.0, index: 483 },
    { text: "lar.", duration: 0.53, begin: 185.25, index: 484 },
    { text: " Ev", duration: 0.53, begin: 186.25, index: 485 },
    { text: "de", duration: 0.53, begin: 186.5, index: 486 },
    { text: " ar", duration: 0.53, begin: 186.75, index: 487 },
    { text: "tık", duration: 0.53, begin: 187.0, index: 488 },
    { text: " ba", duration: 0.53, begin: 188.0, index: 489 },
    { text: "rış", duration: 0.53, begin: 188.25, index: 490 },
    { text: " rüz", duration: 0.53, begin: 188.5, index: 491 },
    { text: "gar", duration: 0.53, begin: 188.75, index: 492 },
    { text: "la", duration: 0.53, begin: 189.0, index: 493 },
    { text: "rı", duration: 0.53, begin: 189.25, index: 494 },
    { text: " e", duration: 0.53, begin: 189.75, index: 495 },
    { text: "si", duration: 0.53, begin: 190.0, index: 496 },
    { text: "yor", duration: 0.53, begin: 190.25, index: 497 },
    { text: "dur.", duration: 0.53, begin: 190.5, index: 498 },
    { text: " Genç", duration: 0.53, begin: 192.5, index: 499 },
    { text: " kız", duration: 0.53, begin: 192.75, index: 500 },
    { text: " ken", duration: 0.53, begin: 193.5, index: 501 },
    { text: "di", duration: 0.53, begin: 193.75, index: 502 },
    { text: "si", duration: 0.53, begin: 194.0, index: 503 },
    { text: "ni", duration: 0.53, begin: 194.25, index: 504 },
    { text: " a", duration: 0.38, begin: 194.75, index: 505 },
    { text: "ğır", duration: 0.53, begin: 195.0, index: 506 },
    { text: " bir", duration: 0.68, begin: 195.25, index: 507 },
    { text: "yük", duration: 0.68, begin: 195.5, index: 508 },
    { text: " al", duration: 0.78, begin: 195.75, index: 509 },
    { text: "tın", duration: 0.78, begin: 196.0, index: 510 },
    { text: "da", duration: 0.78, begin: 196.25, index: 511 },
    { text: " his", duration: 0.68, begin: 196.75, index: 512 },
    { text: "se", duration: 0.68, begin: 197.0, index: 513 },
    { text: "der.", duration: 0.68, begin: 197.25, index: 514 },
    { text: " Yap", duration: 0.53, begin: 199.0, index: 515 },
    { text: "tık", duration: 0.53, begin: 199.25, index: 516 },
    { text: "la", duration: 0.53, begin: 199.5, index: 517 },
    { text: "rın", duration: 0.53, begin: 199.75, index: 518 },
    { text: "dan", duration: 0.53, begin: 200.0, index: 519 },
    { text: " piş", duration: 0.53, begin: 200.75, index: 520 },
    { text: "man", duration: 0.53, begin: 201.0, index: 521 },
    { text: " va", duration: 0.53, begin: 201.25, index: 522 },
    { text: "zi", duration: 0.53, begin: 201.5, index: 523 },
    { text: "yet", duration: 0.53, begin: 201.75, index: 524 },
    { text: "te", duration: 0.53, begin: 202.0, index: 525 },
    { text: " ak", duration: 0.53, begin: 203.0, index: 526 },
    { text: "ta", duration: 0.53, begin: 203.25, index: 527 },
    { text: "rın", duration: 0.53, begin: 203.5, index: 528 },
    { text: " yo", duration: 0.53, begin: 203.75, index: 529 },
    { text: "lu", duration: 0.53, begin: 204.0, index: 530 },
    { text: "nu", duration: 0.53, begin: 204.25, index: 531 },
    { text: " tu", duration: 0.53, begin: 204.5, index: 532 },
    { text: "tar", duration: 0.53, begin: 204.75, index: 533 },
    { text: " ve", duration: 0.53, begin: 205.25, index: 534 },
    { text: " yaş", duration: 0.53, begin: 206.25, index: 535 },
    { text: "lı", duration: 0.53, begin: 206.5, index: 536 },
    { text: " a", duration: 0.53, begin: 206.75, index: 537 },
    { text: "da", duration: 0.53, begin: 207.0, index: 538 },
    { text: "ma,", duration: 0.53, begin: 207.25, index: 539 },
    { text: " şim", duration: 0.53, begin: 208.75, index: 540 },
    { text: "di", duration: 0.53, begin: 209.0, index: 541 },
    { text: "ye", duration: 0.53, begin: 209.25, index: 542 },
    { text: " ka", duration: 0.53, begin: 209.5, index: 543 },
    { text: "dar", duration: 0.53, begin: 209.75, index: 544 },
    { text: " kay", duration: 0.28, begin: 210.75, index: 545 },
    { text: "na", duration: 0.28, begin: 211.0, index: 546 },
    { text: "na", duration: 0.28, begin: 211.25, index: 547 },
    { text: "sı", duration: 0.28, begin: 211.5, index: 548 },
    { text: "na", duration: 0.28, begin: 211.75, index: 549 },
    { text: " ver", duration: 0.53, begin: 212.0, index: 550 },
    { text: "di", duration: 0.53, begin: 212.25, index: 551 },
    { text: "ği", duration: 0.53, begin: 212.5, index: 552 },
    { text: " ze", duration: 0.53, begin: 212.75, index: 553 },
    { text: "hir", duration: 0.53, begin: 213.0, index: 554 },
    { text: "le", duration: 0.53, begin: 213.25, index: 555 },
    { text: "ri", duration: 0.53, begin: 213.5, index: 556 },
    { text: " o", duration: 0.28, begin: 214.5, index: 557 },
    { text: "nun", duration: 0.28, begin: 214.75, index: 558 },
    { text: " ka", duration: 0.53, begin: 215.0, index: 559 },
    { text: "nın", duration: 0.53, begin: 215.25, index: 560 },
    { text: "dan", duration: 0.53, begin: 215.5, index: 561 },
    { text: " te", duration: 0.53, begin: 215.75, index: 562 },
    { text: "miz", duration: 0.53, begin: 216.0, index: 563 },
    { text: "le", duration: 0.53, begin: 216.25, index: 564 },
    { text: "ye", duration: 0.53, begin: 216.5, index: 565 },
    { text: "cek", duration: 0.53, begin: 216.751, index: 566 },
    { text: " bir", duration: 0.53, begin: 217.0, index: 567 },
    { text: " ik", duration: 0.53, begin: 218.0, index: 568 },
    { text: "sir", duration: 0.53, begin: 218.25, index: 569 },
    { text: " i", duration: 0.53, begin: 218.5, index: 570 },
    { text: "çin", duration: 0.53, begin: 218.75, index: 571 },
    { text: " yal", duration: 0.53, begin: 219.5, index: 572 },
    { text: "va", duration: 0.53, begin: 219.75, index: 573 },
    { text: "rır.", duration: 0.53, begin: 220.0, index: 574 },
    { text: " Ka", duration: 0.53, begin: 221.5, index: 575 },
    { text: "yın", duration: 0.53, begin: 221.75, index: 576 },
    { text: "va", duration: 0.53, begin: 222.0, index: 577 },
    { text: "li", duration: 0.53, begin: 222.25, index: 578 },
    { text: "de", duration: 0.53, begin: 222.5, index: 579 },
    { text: "si", duration: 0.53, begin: 222.75, index: 580 },
    { text: "nin", duration: 0.53, begin: 223.0, index: 581 },
    { text: " ar", duration: 0.53, begin: 223.75, index: 582 },
    { text: "tık", duration: 0.53, begin: 224.0, index: 583 },
    { text: " öl", duration: 0.38, begin: 224.75, index: 584 },
    { text: "me", duration: 0.38, begin: 225.0, index: 585 },
    { text: "si", duration: 0.38, begin: 225.25, index: 586 },
    { text: "ni", duration: 0.38, begin: 225.5, index: 587 },
    { text: " is", duration: 0.53, begin: 225.75, index: 588 },
    { text: "te", duration: 0.53, begin: 226.0, index: 589 },
    { text: "me", duration: 0.53, begin: 226.25, index: 590 },
    { text: "mek", duration: 0.53, begin: 226.5, index: 591 },
    { text: "te", duration: 0.53, begin: 226.75, index: 592 },
    { text: "dir.", duration: 0.53, begin: 227.0, index: 593 },
    { text: " Yaş", duration: 0.53, begin: 228.25, index: 594 },
    { text: "lı", duration: 0.53, begin: 228.5, index: 595 },
    { text: " a", duration: 0.53, begin: 228.75, index: 596 },
    { text: "dam", duration: 0.53, begin: 229.0, index: 597 },
    { text: " kar", duration: 0.68, begin: 229.25, index: 598 },
    { text: "şı", duration: 0.68, begin: 229.5, index: 599 },
    { text: "sın", duration: 0.68, begin: 229.75, index: 600 },
    { text: "da", duration: 0.68, begin: 230.0, index: 601 },
    { text: " göz", duration: 0.53, begin: 231.5, index: 602 },
    { text: "yaş", duration: 0.53, begin: 231.75, index: 603 },
    { text: "la", duration: 0.53, begin: 232.0, index: 604 },
    { text: "rı", duration: 0.53, begin: 232.25, index: 605 },
    { text: "nı", duration: 0.53, begin: 232.5, index: 606 },
    { text: " tu", duration: 0.53, begin: 232.75, index: 607 },
    { text: "ta", duration: 0.53, begin: 233.0, index: 608 },
    { text: "ma", duration: 0.53, begin: 233.25, index: 609 },
    { text: "dan", duration: 0.53, begin: 233.5, index: 610 },
    { text: " ko", duration: 0.38, begin: 234.0, index: 611 },
    { text: "nu", duration: 0.38, begin: 234.25, index: 612 },
    { text: "şup", duration: 0.38, begin: 234.5, index: 613 },
    { text: " du", duration: 0.38, begin: 234.75, index: 614 },
    { text: "ran", duration: 0.28, begin: 235.0, index: 615 },
    { text: " Li", duration: 0.28, begin: 235.5, index: 616 },
    { text: "li'", duration: 0.28, begin: 235.75, index: 617 },
    { text: "ye", duration: 0.28, begin: 236.0, index: 618 },
    { text: " ba", duration: 0.23, begin: 236.75, index: 619 },
    { text: "kar", duration: 0.23, begin: 237.0, index: 620 },
    { text: " ve", duration: 0.53, begin: 237.25, index: 621 },
    { text: " kah", duration: 0.53, begin: 238.0, index: 622 },
    { text: "ka", duration: 0.53, begin: 238.25, index: 623 },
    { text: "ha", duration: 0.53, begin: 238.5, index: 624 },
    { text: "lar", duration: 0.53, begin: 238.75, index: 625 },
    { text: "la", duration: 0.53, begin: 239.0, index: 626 },
    { text: " gül", duration: 0.53, begin: 239.5, index: 627 },
    { text: "me", duration: 0.53, begin: 239.75, index: 628 },
    { text: "ye", duration: 0.53, begin: 240.0, index: 629 },
    { text: " baş", duration: 0.53, begin: 240.25, index: 630 },
    { text: "lar.", duration: 0.53, begin: 240.5, index: 631 },
    { text: " Ar", duration: 0.53, begin: 242.0, index: 632 },
    { text: "dın", duration: 0.53, begin: 242.25, index: 633 },
    { text: "dan:", duration: 0.53, begin: 242.5, index: 634 },
    { text: " Sev", duration: 0.53, begin: 243.5, index: 635 },
    { text: "gi", duration: 0.53, begin: 243.75, index: 636 },
    { text: "li", duration: 0.53, begin: 244.0, index: 637 },
    { text: " Li", duration: 0.53, begin: 244.25, index: 638 },
    { text: "li!", duration: 0.53, begin: 244.5, index: 639 },
    { text: " Sa", duration: 0.53, begin: 245.75, index: 640 },
    { text: "na", duration: 0.53, begin: 246.0, index: 641 },
    { text: " ver", duration: 0.53, begin: 246.25, index: 642 },
    { text: "dik", duration: 0.53, begin: 246.5, index: 643 },
    { text: "le", duration: 0.53, begin: 246.75, index: 644 },
    { text: "rim", duration: 0.53, begin: 247.0, index: 645 },
    { text: " sa", duration: 0.53, begin: 248.0, index: 646 },
    { text: "de", duration: 0.53, begin: 248.25, index: 647 },
    { text: "ce", duration: 0.53, begin: 248.5, index: 648 },
    { text: " vi", duration: 0.68, begin: 248.75, index: 649 },
    { text: "ta", duration: 0.68, begin: 249.0, index: 650 },
    { text: "min", duration: 0.68, begin: 249.25, index: 651 },
    { text: "ler", duration: 0.68, begin: 249.5, index: 652 },
    { text: "den", duration: 0.68, begin: 249.75, index: 653 },
    { text: " o", duration: 0.68, begin: 250.0, index: 654 },
    { text: "lu", duration: 0.68, begin: 250.25, index: 655 },
    { text: "şan", duration: 0.68, begin: 250.5, index: 656 },
    { text: " bir", duration: 0.68, begin: 251.0, index: 657 },
    { text: " ka", duration: 0.68, begin: 251.5, index: 658 },
    { text: "rı", duration: 0.68, begin: 251.75, index: 659 },
    { text: "şım", duration: 0.68, begin: 252.0, index: 660 },
    { text: "dı.", duration: 0.68, begin: 252.25, index: 661 },
    { text: " Ol", duration: 0.53, begin: 253.75, index: 662 },
    { text: "sa", duration: 0.53, begin: 254.0, index: 663 },
    { text: " ol", duration: 0.53, begin: 254.25, index: 664 },
    { text: "sa", duration: 0.53, begin: 254.5, index: 665 },
    { text: " ka", duration: 0.38, begin: 255.75, index: 666 },
    { text: "yın", duration: 0.38, begin: 256.0, index: 667 },
    { text: "va", duration: 0.38, begin: 256.25, index: 668 },
    { text: "li", duration: 0.38, begin: 256.5, index: 669 },
    { text: "de", duration: 0.38, begin: 256.75, index: 670 },
    { text: "ni", duration: 0.38, begin: 257.0, index: 671 },
    { text: " da", duration: 0.53, begin: 257.75, index: 672 },
    { text: "ha", duration: 0.53, begin: 258.0, index: 673 },
    { text: " da", duration: 0.53, begin: 258.25, index: 674 },
    { text: " güç", duration: 0.53, begin: 258.5, index: 675 },
    { text: "len", duration: 0.53, begin: 258.75, index: 676 },
    { text: "dir", duration: 0.53, begin: 259.0, index: 677 },
    { text: "din,", duration: 0.53, begin: 259.25, index: 678 },
    { text: " hep", duration: 0.68, begin: 260.5, index: 679 },
    { text: "si", duration: 0.68, begin: 260.75, index: 680 },
    { text: " bun", duration: 0.68, begin: 261.0, index: 681 },
    { text: "dan", duration: 0.68, begin: 261.25, index: 682 },
    { text: " i", duration: 0.68, begin: 261.5, index: 683 },
    { text: "ba", duration: 0.68, begin: 261.75, index: 684 },
    { text: "ret.", duration: 0.68, begin: 262.0, index: 685 },
    { text: " Ger", duration: 0.53, begin: 263.5, index: 686 },
    { text: "çek", duration: 0.53, begin: 263.75, index: 687 },
    { text: " ze", duration: 0.53, begin: 264.0, index: 688 },
    { text: "hir", duration: 0.53, begin: 264.25, index: 689 },
    { text: " i", duration: 0.53, begin: 264.5, index: 690 },
    { text: "se", duration: 0.53, begin: 264.75, index: 691 },
    { text: " se", duration: 0.53, begin: 266.0, index: 692 },
    { text: "nin", duration: 0.68, begin: 266.25, index: 693 },
    { text: " bey", duration: 0.68, begin: 266.5, index: 694 },
    { text: "nin", duration: 0.68, begin: 266.75, index: 695 },
    { text: "de", duration: 0.68, begin: 267.0, index: 696 },
    { text: " o", duration: 0.68, begin: 267.25, index: 697 },
    { text: "lan", duration: 0.68, begin: 267.5, index: 698 },
    { text: "dı.", duration: 0.68, begin: 267.75, index: 699 },
    { text: " Sen", duration: 0.53, begin: 269.25, index: 700 },
    { text: " o", duration: 0.53, begin: 269.5, index: 701 },
    { text: "na", duration: 0.53, begin: 269.75, index: 702 },
    { text: " i", duration: 0.53, begin: 270.0, index: 703 },
    { text: "yi", duration: 0.53, begin: 270.25, index: 704 },
    { text: " dav", duration: 0.68, begin: 270.5, index: 705 },
    { text: "ran", duration: 0.68, begin: 270.75, index: 706 },
    { text: "dık", duration: 0.68, begin: 271.0, index: 707 },
    { text: "ça", duration: 0.68, begin: 271.25, index: 708 },
    { text: " o", duration: 0.68, begin: 272.75, index: 709 },
    { text: "da", duration: 0.68, begin: 273.0, index: 710 },
    { text: " sev", duration: 0.68, begin: 273.75, index: 711 },
    { text: "gi", duration: 0.68, begin: 274.0, index: 712 },
    { text: "ye", duration: 0.68, begin: 274.25, index: 713 },
    { text: " yö", duration: 0.68, begin: 274.5, index: 714 },
    { text: "nel", duration: 0.68, begin: 274.75, index: 715 },
    { text: "di.", duration: 0.68, begin: 275.0, index: 716 },
    { text: " Böy", duration: 0.53, begin: 276.5, index: 717 },
    { text: "le", duration: 0.53, begin: 276.75, index: 718 },
    { text: "ce", duration: 0.53, begin: 277.0, index: 719 },
    { text: " siz", duration: 0.53, begin: 277.25, index: 720 },
    { text: " ger", duration: 0.53, begin: 278.5, index: 721 },
    { text: "çek", duration: 0.53, begin: 278.75, index: 722 },
    { text: " an", duration: 0.68, begin: 279.0, index: 723 },
    { text: "ne", duration: 0.68, begin: 279.25, index: 724 },
    { text: " kız", duration: 0.68, begin: 279.5, index: 725 },
    { text: " ol", duration: 0.68, begin: 280.0, index: 726 },
    { text: "du", duration: 0.68, begin: 280.25, index: 727 },
    { text: "nuz!", duration: 0.68, begin: 280.5, index: 728 },
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
                href="/dashboard/stories/kim-fark-eder"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/hemen-mi-olecegim"
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
            src="/2-2.mp3"
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
