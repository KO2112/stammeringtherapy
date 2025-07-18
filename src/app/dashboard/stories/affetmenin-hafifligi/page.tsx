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
      text: "Af",
      duration: 0.53,
      begin: 0.5,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "fet",
      duration: 0.53,
      begin: 0.75,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "me",
      duration: 0.53,
      begin: 1.0,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "nin",
      duration: 0.53,
      begin: 1.25,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Ha",
      duration: 0.53,
      begin: 1.5,
      index: 5,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "fif",
      duration: 0.53,
      begin: 1.75,
      index: 6,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "li",
      duration: 0.53,
      begin: 2.0,
      index: 7,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ği",
      duration: 0.53,
      begin: 2.25,
      index: 8,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Bir", duration: 0.53, begin: 3.0, index: 9 },
    { text: " li", duration: 0.53, begin: 3.25, index: 10 },
    { text: "se", duration: 0.53, begin: 3.5, index: 11 },
    { text: " öğ", duration: 0.53, begin: 3.75, index: 12 },
    { text: "ret", duration: 0.53, begin: 4.0, index: 13 },
    { text: "me", duration: 0.53, begin: 4.25, index: 14 },
    { text: "ni", duration: 0.53, begin: 4.5, index: 15 },
    { text: " bir", duration: 0.53, begin: 5.5, index: 16 },
    { text: " gün", duration: 0.53, begin: 5.75, index: 17 },
    { text: " ders", duration: 0.53, begin: 6.0, index: 18 },
    { text: "te", duration: 0.53, begin: 6.25, index: 19 },
    { text: " öğ", duration: 0.53, begin: 6.5, index: 20 },
    { text: "ren", duration: 0.53, begin: 6.75, index: 21 },
    { text: "ci", duration: 0.53, begin: 7.0, index: 22 },
    { text: "le", duration: 0.53, begin: 7.25, index: 23 },
    { text: "ri", duration: 0.53, begin: 7.5, index: 24 },
    { text: "ne", duration: 0.53, begin: 7.75, index: 25 },
    { text: " bir", duration: 0.53, begin: 8.5, index: 26 },
    { text: " tek", duration: 0.53, begin: 8.75, index: 27 },
    { text: "lif", duration: 0.53, begin: 9.0, index: 28 },
    { text: "te", duration: 0.53, begin: 9.25, index: 29 },
    { text: " bu", duration: 0.53, begin: 9.75, index: 30 },
    { text: "lu", duration: 0.53, begin: 10.0, index: 31 },
    { text: "nur:", duration: 0.53, begin: 10.25, index: 32 },
    { text: ' "Bir', duration: 0.68, begin: 11.0, index: 33 },
    { text: " ha", duration: 0.68, begin: 11.25, index: 34 },
    { text: "yat", duration: 0.68, begin: 11.5, index: 35 },
    { text: " de", duration: 0.38, begin: 12.0, index: 36 },
    { text: "ne", duration: 0.38, begin: 12.25, index: 37 },
    { text: "yi", duration: 0.38, begin: 12.5, index: 38 },
    { text: "mi", duration: 0.38, begin: 12.75, index: 39 },
    { text: "ne", duration: 0.38, begin: 13.0, index: 40 },
    { text: " ka", duration: 0.48, begin: 13.15, index: 41 },
    { text: "tıl", duration: 0.48, begin: 13.35, index: 42 },
    { text: "mak", duration: 0.48, begin: 13.5, index: 43 },
    { text: " is", duration: 0.48, begin: 14.0, index: 44 },
    { text: "ter", duration: 0.48, begin: 14.25, index: 45 },
    { text: " mi", duration: 0.48, begin: 14.5, index: 46 },
    { text: "si", duration: 0.48, begin: 14.75, index: 47 },
    { text: 'niz?"', duration: 0.48, begin: 15.0, index: 48 },
    { text: " Öğ", duration: 0.68, begin: 15.75, index: 49 },
    { text: "ren", duration: 0.68, begin: 16.0, index: 50 },
    { text: "ci", duration: 0.68, begin: 16.25, index: 51 },
    { text: "ler", duration: 0.68, begin: 16.5, index: 52 },
    { text: " çok", duration: 0.68, begin: 16.75, index: 53 },
    { text: " sev", duration: 0.68, begin: 17.0, index: 54 },
    { text: "dik", duration: 0.68, begin: 17.25, index: 55 },
    { text: "le", duration: 0.68, begin: 17.5, index: 56 },
    { text: "ri", duration: 0.68, begin: 17.75, index: 57 },
    { text: " ho", duration: 0.68, begin: 18.25, index: 58 },
    { text: "ca", duration: 0.68, begin: 18.5, index: 59 },
    { text: "la", duration: 0.68, begin: 18.75, index: 60 },
    { text: "rı", duration: 0.68, begin: 19.0, index: 61 },
    { text: "nın", duration: 0.68, begin: 19.25, index: 62 },
    { text: " bu", duration: 0.68, begin: 20.0, index: 63 },
    { text: " tek", duration: 0.68, begin: 20.25, index: 64 },
    { text: "li", duration: 0.68, begin: 20.5, index: 65 },
    { text: "fi", duration: 0.68, begin: 20.75, index: 66 },
    { text: "ni", duration: 0.68, begin: 21.0, index: 67 },
    { text: " te", duration: 0.68, begin: 21.25, index: 68 },
    { text: "red", duration: 0.68, begin: 21.5, index: 69 },
    { text: "düt", duration: 0.68, begin: 21.75, index: 70 },
    { text: "süz", duration: 0.68, begin: 22.0, index: 71 },
    { text: " ka", duration: 0.68, begin: 22.25, index: 72 },
    { text: "bul", duration: 0.68, begin: 22.5, index: 73 },
    { text: " e", duration: 0.68, begin: 22.75, index: 74 },
    { text: "der", duration: 0.68, begin: 23.0, index: 75 },
    { text: "ler.", duration: 0.68, begin: 23.25, index: 76 },
    { text: ' "O', duration: 0.53, begin: 24.5, index: 77 },
    { text: " za", duration: 0.53, begin: 24.75, index: 78 },
    { text: 'man"', duration: 0.53, begin: 25.0, index: 79 },
    { text: " der", duration: 0.53, begin: 25.75, index: 80 },
    { text: " öğ", duration: 0.53, begin: 26.0, index: 81 },
    { text: "ret", duration: 0.53, begin: 26.25, index: 82 },
    { text: "men.", duration: 0.53, begin: 26.5, index: 83 },
    { text: ' "Bun', duration: 0.53, begin: 27.75, index: 84 },
    { text: "dan", duration: 0.53, begin: 28.0, index: 85 },
    { text: " son", duration: 0.53, begin: 28.25, index: 86 },
    { text: "ra", duration: 0.53, begin: 28.5, index: 87 },
    { text: " ne", duration: 0.53, begin: 29.75, index: 88 },
    { text: " der", duration: 0.53, begin: 30.0, index: 89 },
    { text: "sem", duration: 0.53, begin: 30.25, index: 90 },
    { text: " ya", duration: 0.53, begin: 30.5, index: 91 },
    { text: "pa", duration: 0.53, begin: 30.75, index: 92 },
    { text: "ca", duration: 0.53, begin: 31.0, index: 93 },
    { text: "nı", duration: 0.53, begin: 31.25, index: 94 },
    { text: "za", duration: 0.53, begin: 31.5, index: 95 },
    { text: "da", duration: 0.53, begin: 31.75, index: 96 },
    { text: " söz", duration: 0.53, begin: 32.25, index: 97 },
    { text: " ve", duration: 0.53, begin: 32.5, index: 98 },
    { text: 'rin."', duration: 0.53, begin: 32.75, index: 99 },
    { text: " Öğ", duration: 0.53, begin: 33.75, index: 100 },
    { text: "ren", duration: 0.53, begin: 34.0, index: 101 },
    { text: "ci", duration: 0.53, begin: 34.25, index: 102 },
    { text: "ler", duration: 0.53, begin: 34.5, index: 103 },
    { text: " bu", duration: 0.53, begin: 35.25, index: 104 },
    { text: "nu", duration: 0.53, begin: 35.5, index: 105 },
    { text: "da", duration: 0.53, begin: 35.75, index: 106 },
    { text: " ya", duration: 0.53, begin: 36.0, index: 107 },
    { text: "par", duration: 0.53, begin: 36.25, index: 108 },
    { text: "lar.", duration: 0.53, begin: 36.5, index: 109 },
    { text: ' "Şim', duration: 0.53, begin: 37.75, index: 110 },
    { text: "di", duration: 0.53, begin: 38.0, index: 111 },
    { text: " ya", duration: 0.38, begin: 38.75, index: 112 },
    { text: "rın", duration: 0.38, begin: 39.25, index: 113 },
    { text: " ki", duration: 0.38, begin: 39.5, index: 114 },
    { text: " ö", duration: 0.38, begin: 39.75, index: 115 },
    { text: "de", duration: 0.38, begin: 40.0, index: 116 },
    { text: "vi", duration: 0.38, begin: 40.25, index: 117 },
    { text: "ni", duration: 0.38, begin: 40.5, index: 118 },
    { text: "ze", duration: 0.38, begin: 40.75, index: 119 },
    { text: " ha", duration: 0.38, begin: 41.0, index: 120 },
    { text: "zır", duration: 0.38, begin: 41.25, index: 121 },
    { text: " o", duration: 0.38, begin: 41.5, index: 122 },
    { text: "lun.", duration: 0.38, begin: 41.75, index: 123 },
    { text: " Ya", duration: 0.53, begin: 42.5, index: 124 },
    { text: "rın", duration: 0.53, begin: 42.75, index: 125 },
    { text: " he", duration: 0.53, begin: 43.5, index: 126 },
    { text: "pi", duration: 0.53, begin: 43.75, index: 127 },
    { text: "niz", duration: 0.53, begin: 44.0, index: 128 },
    { text: " bi", duration: 0.53, begin: 44.25, index: 129 },
    { text: "rer", duration: 0.53, begin: 44.5, index: 130 },
    { text: " plas", duration: 0.53, begin: 44.75, index: 131 },
    { text: "tik", duration: 0.53, begin: 45.0, index: 132 },
    { text: " tor", duration: 0.53, begin: 45.25, index: 133 },
    { text: "ba", duration: 0.53, begin: 45.5, index: 134 },
    { text: " ve", duration: 0.53, begin: 46.5, index: 135 },
    { text: " beş", duration: 0.48, begin: 47.25, index: 136 },
    { text: "er", duration: 0.48, begin: 47.5, index: 137 },
    { text: " ki", duration: 0.48, begin: 47.75, index: 138 },
    { text: "lo", duration: 0.48, begin: 48.0, index: 139 },
    { text: " pa", duration: 0.48, begin: 48.25, index: 140 },
    { text: "ta", duration: 0.48, begin: 48.5, index: 141 },
    { text: "tes", duration: 0.48, begin: 48.75, index: 142 },
    { text: " ge", duration: 0.48, begin: 49.0, index: 143 },
    { text: "ti", duration: 0.48, begin: 49.25, index: 144 },
    { text: "re", duration: 0.48, begin: 49.5, index: 145 },
    { text: "cek", duration: 0.48, begin: 49.75, index: 146 },
    { text: "si", duration: 0.48, begin: 50.0, index: 147 },
    { text: 'niz!"', duration: 0.48, begin: 50.25, index: 148 },
    { text: " Öğ", duration: 0.53, begin: 51.25, index: 149 },
    { text: "ren", duration: 0.53, begin: 51.5, index: 150 },
    { text: "ci", duration: 0.53, begin: 51.75, index: 151 },
    { text: "ler,", duration: 0.53, begin: 52.0, index: 152 },
    { text: " bu", duration: 0.53, begin: 53.0, index: 153 },
    { text: " iş", duration: 0.53, begin: 53.25, index: 154 },
    { text: "ten", duration: 0.53, begin: 53.5, index: 155 },
    { text: " pek", duration: 0.53, begin: 53.75, index: 156 },
    { text: " bir", duration: 0.53, begin: 54.0, index: 157 },
    { text: " şey", duration: 0.53, begin: 54.25, index: 158 },
    { text: " an", duration: 0.68, begin: 54.5, index: 159 },
    { text: "la", duration: 0.68, begin: 54.75, index: 160 },
    { text: "ma", duration: 0.68, begin: 55.0, index: 161 },
    { text: "mış", duration: 0.68, begin: 55.25, index: 162 },
    { text: "lar", duration: 0.68, begin: 55.5, index: 163 },
    { text: "dır.", duration: 0.68, begin: 55.75, index: 164 },
    { text: " A", duration: 0.53, begin: 57.25, index: 165 },
    { text: "ma", duration: 0.53, begin: 57.5, index: 166 },
    { text: " er", duration: 0.53, begin: 57.75, index: 167 },
    { text: "te", duration: 0.53, begin: 58.0, index: 168 },
    { text: "si", duration: 0.53, begin: 58.25, index: 169 },
    { text: " sa", duration: 0.53, begin: 58.5, index: 170 },
    { text: "bah", duration: 0.53, begin: 58.75, index: 171 },
    { text: " hep", duration: 0.53, begin: 59.25, index: 172 },
    { text: "si", duration: 0.53, begin: 59.5, index: 173 },
    { text: "nin", duration: 0.53, begin: 59.75, index: 174 },
    { text: " sı", duration: 0.53, begin: 60.25, index: 175 },
    { text: "ra", duration: 0.53, begin: 60.5, index: 176 },
    { text: "la", duration: 0.53, begin: 60.75, index: 177 },
    { text: "rı", duration: 0.53, begin: 61.0, index: 178 },
    { text: "nın", duration: 0.53, begin: 61.25, index: 179 },
    { text: " ü", duration: 0.53, begin: 61.5, index: 180 },
    { text: "ze", duration: 0.53, begin: 61.75, index: 181 },
    { text: "rin", duration: 0.53, begin: 62.0, index: 182 },
    { text: "de", duration: 0.53, begin: 62.25, index: 183 },
    { text: " pa", duration: 0.53, begin: 62.5, index: 184 },
    { text: "ta", duration: 0.53, begin: 62.75, index: 185 },
    { text: "tes", duration: 0.53, begin: 63.0, index: 186 },
    { text: "ler", duration: 0.53, begin: 63.25, index: 187 },
    { text: " ve", duration: 0.53, begin: 64.0, index: 188 },
    { text: " tor", duration: 0.53, begin: 64.5, index: 189 },
    { text: "ba", duration: 0.53, begin: 64.75, index: 190 },
    { text: "lar", duration: 0.53, begin: 65.0, index: 191 },
    { text: " ha", duration: 0.53, begin: 65.25, index: 192 },
    { text: "zır", duration: 0.53, begin: 65.5, index: 193 },
    { text: "dır.", duration: 0.53, begin: 65.75, index: 194 },
    { text: " Ken", duration: 0.53, begin: 66.75, index: 195 },
    { text: "di", duration: 0.53, begin: 67.0, index: 196 },
    { text: "si", duration: 0.53, begin: 67.25, index: 197 },
    { text: "ne", duration: 0.53, begin: 67.5, index: 198 },
    { text: " me", duration: 0.53, begin: 67.75, index: 199 },
    { text: "rak", duration: 0.53, begin: 68.0, index: 200 },
    { text: "lı", duration: 0.53, begin: 68.25, index: 201 },
    { text: " göz", duration: 0.53, begin: 68.5, index: 202 },
    { text: "ler", duration: 0.53, begin: 68.75, index: 203 },
    { text: "le", duration: 0.53, begin: 69.0, index: 204 },
    { text: " ba", duration: 0.53, begin: 69.25, index: 205 },
    { text: "kan", duration: 0.53, begin: 69.5, index: 206 },
    { text: " öğ", duration: 0.53, begin: 69.75, index: 207 },
    { text: "ren", duration: 0.53, begin: 70.0, index: 208 },
    { text: "ci", duration: 0.53, begin: 70.25, index: 209 },
    { text: "le", duration: 0.53, begin: 70.5, index: 210 },
    { text: "ri", duration: 0.53, begin: 70.75, index: 211 },
    { text: "ne", duration: 0.53, begin: 71.0, index: 212 },
    { text: " şöy", duration: 0.53, begin: 71.75, index: 213 },
    { text: "le", duration: 0.53, begin: 72.0, index: 214 },
    { text: " der", duration: 0.53, begin: 72.25, index: 215 },
    { text: " öğ", duration: 0.53, begin: 72.5, index: 216 },
    { text: "ret", duration: 0.53, begin: 72.75, index: 217 },
    { text: "men:", duration: 0.53, begin: 73.0, index: 218 },
    { text: ' "Şim', duration: 0.53, begin: 74.25, index: 219 },
    { text: "di,", duration: 0.53, begin: 74.5, index: 220 },
    { text: " bu", duration: 0.53, begin: 75.5, index: 221 },
    { text: "gü", duration: 0.53, begin: 75.75, index: 222 },
    { text: "ne", duration: 0.53, begin: 76.0, index: 223 },
    { text: " dek", duration: 0.53, begin: 76.25, index: 224 },
    { text: " af", duration: 0.53, begin: 76.5, index: 225 },
    { text: "fet", duration: 0.53, begin: 76.75, index: 226 },
    { text: "me", duration: 0.53, begin: 77.0, index: 227 },
    { text: "yi", duration: 0.53, begin: 77.25, index: 228 },
    { text: " red", duration: 0.53, begin: 77.5, index: 229 },
    { text: "det", duration: 0.53, begin: 77.75, index: 230 },
    { text: "ti", duration: 0.53, begin: 78.0, index: 231 },
    { text: "ği", duration: 0.53, begin: 78.25, index: 232 },
    { text: "niz", duration: 0.53, begin: 78.5, index: 233 },
    { text: " her", duration: 0.53, begin: 79.5, index: 234 },
    { text: " ki", duration: 0.53, begin: 79.75, index: 235 },
    { text: "şi", duration: 0.53, begin: 80.0, index: 236 },
    { text: " i", duration: 0.53, begin: 80.25, index: 237 },
    { text: "çin", duration: 0.53, begin: 80.5, index: 238 },
    { text: " bir", duration: 0.53, begin: 80.75, index: 239 },
    { text: " pa", duration: 0.53, begin: 81.0, index: 240 },
    { text: "ta", duration: 0.53, begin: 81.25, index: 241 },
    { text: "tes", duration: 0.53, begin: 81.5, index: 242 },
    { text: " a", duration: 0.53, begin: 81.75, index: 243 },
    { text: "lın,", duration: 0.53, begin: 82.0, index: 244 },
    { text: " o", duration: 0.53, begin: 83.0, index: 245 },
    { text: " ki", duration: 0.53, begin: 83.25, index: 246 },
    { text: "şi", duration: 0.53, begin: 83.5, index: 247 },
    { text: "nin", duration: 0.53, begin: 83.75, index: 248 },
    { text: " a", duration: 0.53, begin: 84.0, index: 249 },
    { text: "dı", duration: 0.53, begin: 84.25, index: 250 },
    { text: "nı", duration: 0.53, begin: 84.5, index: 251 },
    { text: " o", duration: 0.53, begin: 85.25, index: 252 },
    { text: " pa", duration: 0.53, begin: 85.5, index: 253 },
    { text: "ta", duration: 0.53, begin: 85.75, index: 254 },
    { text: "te", duration: 0.53, begin: 86.0, index: 255 },
    { text: "sin", duration: 0.53, begin: 86.25, index: 256 },
    { text: " ü", duration: 0.53, begin: 86.5, index: 257 },
    { text: "ze", duration: 0.53, begin: 86.75, index: 258 },
    { text: "ri", duration: 0.53, begin: 87.0, index: 259 },
    { text: "ne", duration: 0.53, begin: 87.25, index: 260 },
    { text: " ya", duration: 0.53, begin: 87.5, index: 261 },
    { text: "zıp", duration: 0.53, begin: 87.75, index: 262 },
    { text: " tor", duration: 0.53, begin: 88.5, index: 263 },
    { text: "ba", duration: 0.53, begin: 88.75, index: 264 },
    { text: "nın", duration: 0.53, begin: 89.0, index: 265 },
    { text: " i", duration: 0.53, begin: 89.25, index: 266 },
    { text: "çi", duration: 0.53, begin: 89.5, index: 267 },
    { text: "ne", duration: 0.53, begin: 89.75, index: 268 },
    { text: " ko", duration: 0.53, begin: 90.0, index: 269 },
    { text: 'yun"', duration: 0.53, begin: 90.25, index: 270 },
    { text: " Ba", duration: 0.53, begin: 91.0, index: 271 },
    { text: "zı", duration: 0.53, begin: 91.25, index: 272 },
    { text: " öğ", duration: 0.53, begin: 91.5, index: 273 },
    { text: "ren", duration: 0.53, begin: 91.75, index: 274 },
    { text: "ci", duration: 0.53, begin: 92.0, index: 275 },
    { text: "ler", duration: 0.53, begin: 92.25, index: 276 },
    { text: " tor", duration: 0.53, begin: 93.0, index: 277 },
    { text: "ba", duration: 0.53, begin: 93.25, index: 278 },
    { text: "la", duration: 0.53, begin: 93.5, index: 279 },
    { text: "rı", duration: 0.53, begin: 93.75, index: 280 },
    { text: "na", duration: 0.53, begin: 94.0, index: 281 },
    { text: " ü", duration: 0.53, begin: 94.25, index: 282 },
    { text: "çer-", duration: 0.53, begin: 94.5, index: 283 },
    { text: "be", duration: 0.53, begin: 94.75, index: 284 },
    { text: "şer", duration: 0.53, begin: 95.0, index: 285 },
    { text: " ta", duration: 0.53, begin: 95.25, index: 286 },
    { text: "ne", duration: 0.53, begin: 95.5, index: 287 },
    { text: " pa", duration: 0.53, begin: 95.75, index: 288 },
    { text: "ta", duration: 0.53, begin: 96.0, index: 289 },
    { text: "tes", duration: 0.53, begin: 96.25, index: 290 },
    { text: " ko", duration: 0.53, begin: 96.5, index: 291 },
    { text: "yar", duration: 0.53, begin: 96.75, index: 292 },
    { text: "ken,", duration: 0.53, begin: 97.0, index: 293 },
    { text: " ba", duration: 0.53, begin: 98.5, index: 294 },
    { text: "zı", duration: 0.53, begin: 98.75, index: 295 },
    { text: "la", duration: 0.53, begin: 99.0, index: 296 },
    { text: "rı", duration: 0.53, begin: 99.25, index: 297 },
    { text: "nın", duration: 0.53, begin: 99.5, index: 298 },
    { text: " tor", duration: 0.53, begin: 99.75, index: 299 },
    { text: "ba", duration: 0.53, begin: 100.0, index: 300 },
    { text: "sı", duration: 0.53, begin: 100.25, index: 301 },
    { text: " ne", duration: 0.53, begin: 101.0, index: 302 },
    { text: "re", duration: 0.53, begin: 101.25, index: 303 },
    { text: "dey", duration: 0.53, begin: 101.5, index: 304 },
    { text: "se", duration: 0.53, begin: 101.75, index: 305 },
    { text: " ağ", duration: 0.53, begin: 102.0, index: 306 },
    { text: "zı", duration: 0.53, begin: 102.25, index: 307 },
    { text: "na", duration: 0.53, begin: 102.5, index: 308 },
    { text: " ka", duration: 0.53, begin: 102.75, index: 309 },
    { text: "dar", duration: 0.53, begin: 103.0, index: 310 },
    { text: " dol", duration: 0.68, begin: 103.25, index: 311 },
    { text: "muş", duration: 0.68, begin: 103.5, index: 312 },
    { text: "tur.", duration: 0.68, begin: 103.75, index: 313 },
    { text: " Öğ", duration: 0.53, begin: 105.25, index: 314 },
    { text: "ret", duration: 0.53, begin: 105.5, index: 315 },
    { text: "men,", duration: 0.53, begin: 105.75, index: 316 },
    { text: " ken", duration: 0.53, begin: 106.75, index: 317 },
    { text: "di", duration: 0.53, begin: 107.0, index: 318 },
    { text: "si", duration: 0.53, begin: 107.25, index: 319 },
    { text: "ne", duration: 0.53, begin: 107.5, index: 320 },
    { text: ' "Pe', duration: 0.53, begin: 108.5, index: 321 },
    { text: "ki", duration: 0.53, begin: 108.75, index: 322 },
    { text: " şim", duration: 0.53, begin: 109.0, index: 323 },
    { text: "di", duration: 0.53, begin: 109.25, index: 324 },
    { text: " ne", duration: 0.53, begin: 109.5, index: 325 },
    { text: " o", duration: 0.53, begin: 109.75, index: 326 },
    { text: "la", duration: 0.53, begin: 110.0, index: 327 },
    { text: 'cak?"', duration: 0.53, begin: 110.25, index: 328 },
    { text: " der", duration: 0.53, begin: 111.0, index: 329 },
    { text: " gi", duration: 0.53, begin: 111.25, index: 330 },
    { text: "bi", duration: 0.53, begin: 111.5, index: 331 },
    { text: " ba", duration: 0.53, begin: 111.75, index: 332 },
    { text: "kan", duration: 0.53, begin: 112.0, index: 333 },
    { text: " öğ", duration: 0.53, begin: 112.25, index: 334 },
    { text: "ren", duration: 0.53, begin: 112.5, index: 335 },
    { text: "ci", duration: 0.53, begin: 112.75, index: 336 },
    { text: "le", duration: 0.53, begin: 113.0, index: 337 },
    { text: "ri", duration: 0.53, begin: 113.25, index: 338 },
    { text: "ne", duration: 0.53, begin: 113.5, index: 339 },
    { text: " i", duration: 0.53, begin: 114.5, index: 340 },
    { text: "kin", duration: 0.53, begin: 114.75, index: 341 },
    { text: "ci", duration: 0.53, begin: 115.0, index: 342 },
    { text: " a", duration: 0.53, begin: 115.25, index: 343 },
    { text: "çık", duration: 0.53, begin: 115.5, index: 344 },
    { text: "la", duration: 0.53, begin: 115.75, index: 345 },
    { text: "ma", duration: 0.53, begin: 116.0, index: 346 },
    { text: "sı", duration: 0.53, begin: 116.25, index: 347 },
    { text: "nı", duration: 0.53, begin: 116.5, index: 348 },
    { text: " ya", duration: 0.53, begin: 116.75, index: 349 },
    { text: "par:", duration: 0.53, begin: 117.0, index: 350 },
    { text: ' "Bir', duration: 0.53, begin: 118.0, index: 351 },
    { text: " haf", duration: 0.53, begin: 118.25, index: 352 },
    { text: "ta", duration: 0.53, begin: 118.5, index: 353 },
    { text: " bo", duration: 0.53, begin: 118.75, index: 354 },
    { text: "yun", duration: 0.53, begin: 119.0, index: 355 },
    { text: "ca", duration: 0.53, begin: 119.25, index: 356 },
    { text: " ne", duration: 0.53, begin: 120.0, index: 357 },
    { text: "re", duration: 0.53, begin: 120.25, index: 358 },
    { text: "ye", duration: 0.53, begin: 120.5, index: 359 },
    { text: " gi", duration: 0.53, begin: 120.75, index: 360 },
    { text: "der", duration: 0.53, begin: 121.0, index: 361 },
    { text: "se", duration: 0.53, begin: 121.25, index: 362 },
    { text: "niz", duration: 0.53, begin: 121.5, index: 363 },
    { text: " gi", duration: 0.53, begin: 121.75, index: 364 },
    { text: "din,", duration: 0.53, begin: 122.0, index: 365 },
    { text: " bu", duration: 0.53, begin: 123.0, index: 366 },
    { text: " tor", duration: 0.53, begin: 123.25, index: 367 },
    { text: "ba", duration: 0.53, begin: 123.5, index: 368 },
    { text: "la", duration: 0.53, begin: 123.75, index: 369 },
    { text: "rı", duration: 0.53, begin: 124.0, index: 370 },
    { text: " ya", duration: 0.53, begin: 124.25, index: 371 },
    { text: "nı", duration: 0.53, begin: 124.5, index: 372 },
    { text: "nız", duration: 0.53, begin: 124.75, index: 373 },
    { text: "da", duration: 0.53, begin: 125.0, index: 374 },
    { text: " ta", duration: 0.38, begin: 125.25, index: 375 },
    { text: "şı", duration: 0.38, begin: 125.5, index: 376 },
    { text: "ya", duration: 0.38, begin: 125.75, index: 377 },
    { text: "cak", duration: 0.38, begin: 126.0, index: 378 },
    { text: "sı", duration: 0.38, begin: 126.25, index: 379 },
    { text: "nız.", duration: 0.38, begin: 126.5, index: 380 },
    { text: " Yat", duration: 0.53, begin: 127.25, index: 381 },
    { text: "tı", duration: 0.53, begin: 127.5, index: 382 },
    { text: "ği", duration: 0.53, begin: 127.75, index: 383 },
    { text: "nız", duration: 0.53, begin: 128.0, index: 384 },
    { text: " ya", duration: 0.53, begin: 128.25, index: 385 },
    { text: "tak", duration: 0.53, begin: 128.5, index: 386 },
    { text: "ta,", duration: 0.53, begin: 128.75, index: 387 },
    { text: " bin", duration: 0.53, begin: 129.5, index: 388 },
    { text: "di", duration: 0.53, begin: 129.75, index: 389 },
    { text: "ği", duration: 0.53, begin: 130.0, index: 390 },
    { text: "niz", duration: 0.53, begin: 130.25, index: 391 },
    { text: " o", duration: 0.53, begin: 130.5, index: 392 },
    { text: "to", duration: 0.53, begin: 130.75, index: 393 },
    { text: "büs", duration: 0.53, begin: 131.0, index: 394 },
    { text: "te,", duration: 0.53, begin: 131.25, index: 395 },
    { text: " o", duration: 0.53, begin: 132.25, index: 396 },
    { text: "kul", duration: 0.53, begin: 132.5, index: 397 },
    { text: "day", duration: 0.53, begin: 132.75, index: 398 },
    { text: "ken", duration: 0.53, begin: 133.25, index: 399 },
    { text: " sı", duration: 0.53, begin: 134.25, index: 400 },
    { text: "ra", duration: 0.53, begin: 134.5, index: 401 },
    { text: "nı", duration: 0.53, begin: 134.75, index: 402 },
    { text: "zın", duration: 0.53, begin: 135.0, index: 403 },
    { text: " üs", duration: 0.53, begin: 135.25, index: 404 },
    { text: "tün", duration: 0.53, begin: 135.5, index: 405 },
    { text: "de.", duration: 0.53, begin: 135.75, index: 406 },
    { text: " Hep", duration: 0.53, begin: 136.5, index: 407 },
    { text: " ya", duration: 0.53, begin: 136.75, index: 408 },
    { text: "nı", duration: 0.53, begin: 137.0, index: 409 },
    { text: "nız", duration: 0.53, begin: 137.25, index: 410 },
    { text: "da", duration: 0.53, begin: 137.5, index: 411 },
    { text: " o", duration: 0.53, begin: 137.75, index: 412 },
    { text: "la", duration: 0.53, begin: 138.0, index: 413 },
    { text: "cak", duration: 0.53, begin: 138.25, index: 414 },
    { text: 'lar."', duration: 0.53, begin: 138.5, index: 415 },
    { text: " A", duration: 0.53, begin: 139.5, index: 416 },
    { text: "ra", duration: 0.53, begin: 139.75, index: 417 },
    { text: "dan", duration: 0.53, begin: 140.0, index: 418 },
    { text: " bir", duration: 0.53, begin: 140.25, index: 419 },
    { text: " haf", duration: 0.53, begin: 140.5, index: 420 },
    { text: "ta", duration: 0.53, begin: 140.75, index: 421 },
    { text: " geç", duration: 0.68, begin: 141.0, index: 422 },
    { text: "miş", duration: 0.68, begin: 141.25, index: 423 },
    { text: "tir.", duration: 0.68, begin: 141.5, index: 424 },
    { text: " Ho", duration: 0.53, begin: 142.75, index: 425 },
    { text: "ca", duration: 0.53, begin: 143.0, index: 426 },
    { text: "la", duration: 0.53, begin: 143.25, index: 427 },
    { text: "rı", duration: 0.53, begin: 143.5, index: 428 },
    { text: " sı", duration: 0.53, begin: 143.75, index: 429 },
    { text: "nı", duration: 0.53, begin: 144.0, index: 430 },
    { text: "fa", duration: 0.53, begin: 144.25, index: 431 },
    { text: " gi", duration: 0.53, begin: 144.5, index: 432 },
    { text: "rer", duration: 0.53, begin: 144.75, index: 433 },
    { text: " gir", duration: 0.53, begin: 145.0, index: 434 },
    { text: "mez,", duration: 0.53, begin: 145.25, index: 435 },
    { text: " de", duration: 0.53, begin: 145.75, index: 436 },
    { text: "ni", duration: 0.53, begin: 146.0, index: 437 },
    { text: "le", duration: 0.53, begin: 146.25, index: 438 },
    { text: "ni", duration: 0.53, begin: 146.5, index: 439 },
    { text: " yap", duration: 0.53, begin: 146.75, index: 440 },
    { text: "mış", duration: 0.53, begin: 147.0, index: 441 },
    { text: " o", duration: 0.53, begin: 147.25, index: 442 },
    { text: "lan", duration: 0.53, begin: 147.5, index: 443 },
    { text: " öğ", duration: 0.53, begin: 147.75, index: 444 },
    { text: "ren", duration: 0.53, begin: 148.0, index: 445 },
    { text: "ci", duration: 0.53, begin: 148.25, index: 446 },
    { text: "ler", duration: 0.53, begin: 148.5, index: 447 },
    { text: " şi", duration: 0.53, begin: 148.75, index: 448 },
    { text: "ka", duration: 0.53, begin: 149.0, index: 449 },
    { text: "ye", duration: 0.53, begin: 149.25, index: 450 },
    { text: "te", duration: 0.53, begin: 149.5, index: 451 },
    { text: " baş", duration: 0.78, begin: 149.75, index: 452 },
    { text: "lar", duration: 0.78, begin: 150.0, index: 453 },
    { text: "lar:", duration: 0.78, begin: 150.25, index: 454 },
    { text: ' "Ho', duration: 0.53, begin: 151.5, index: 455 },
    { text: "cam,", duration: 0.53, begin: 151.75, index: 456 },
    { text: " bu", duration: 0.53, begin: 152.75, index: 457 },
    { text: " ka", duration: 0.53, begin: 153.0, index: 458 },
    { text: "dar", duration: 0.53, begin: 153.25, index: 459 },
    { text: " a", duration: 0.53, begin: 153.5, index: 460 },
    { text: "ğır", duration: 0.53, begin: 153.75, index: 461 },
    { text: " tor", duration: 0.53, begin: 154.0, index: 462 },
    { text: "ba", duration: 0.53, begin: 154.25, index: 463 },
    { text: "yı", duration: 0.53, begin: 154.5, index: 464 },
    { text: " her", duration: 0.53, begin: 154.75, index: 465 },
    { text: " ye", duration: 0.53, begin: 155.0, index: 466 },
    { text: "re", duration: 0.53, begin: 155.25, index: 467 },
    { text: " ta", duration: 0.53, begin: 155.5, index: 468 },
    { text: "şı", duration: 0.53, begin: 155.75, index: 469 },
    { text: "mak", duration: 0.53, begin: 156.0, index: 470 },
    { text: " çok", duration: 0.53, begin: 156.25, index: 471 },
    { text: ' zor."', duration: 0.53, begin: 156.5, index: 472 },
    { text: ' "Ho', duration: 0.53, begin: 157.5, index: 473 },
    { text: "cam,", duration: 0.53, begin: 157.75, index: 474 },
    { text: " pa", duration: 0.53, begin: 158.75, index: 475 },
    { text: "ta", duration: 0.53, begin: 159.0, index: 476 },
    { text: "tes", duration: 0.53, begin: 159.25, index: 477 },
    { text: "ler", duration: 0.53, begin: 159.5, index: 478 },
    { text: " kok", duration: 0.53, begin: 159.75, index: 479 },
    { text: "ma", duration: 0.53, begin: 160.0, index: 480 },
    { text: "ya", duration: 0.53, begin: 160.25, index: 481 },
    { text: " baş", duration: 0.53, begin: 160.5, index: 482 },
    { text: "la", duration: 0.53, begin: 160.75, index: 483 },
    { text: "dı.", duration: 0.53, begin: 161.0, index: 484 },
    { text: " Val", duration: 0.53, begin: 162.25, index: 485 },
    { text: "la", duration: 0.53, begin: 162.5, index: 486 },
    { text: "hi,", duration: 0.53, begin: 162.75, index: 487 },
    { text: " in", duration: 0.53, begin: 163.5, index: 488 },
    { text: "san", duration: 0.53, begin: 163.75, index: 489 },
    { text: "lar", duration: 0.53, begin: 164.0, index: 490 },
    { text: " tu", duration: 0.53, begin: 164.25, index: 491 },
    { text: "haf", duration: 0.53, begin: 164.5, index: 492 },
    { text: " ba", duration: 0.53, begin: 164.75, index: 493 },
    { text: "kı", duration: 0.53, begin: 165.0, index: 494 },
    { text: "yor", duration: 0.53, begin: 165.25, index: 495 },
    { text: "lar.", duration: 0.53, begin: 165.5, index: 496 },
    { text: " Hem", duration: 0.53, begin: 166.75, index: 497 },
    { text: " sı", duration: 0.53, begin: 167.0, index: 498 },
    { text: "kıl", duration: 0.53, begin: 167.25, index: 499 },
    { text: "dık,", duration: 0.53, begin: 167.5, index: 500 },
    { text: " hem", duration: 0.53, begin: 168.25, index: 501 },
    { text: " yo", duration: 0.53, begin: 168.5, index: 502 },
    { text: "rul", duration: 0.53, begin: 168.75, index: 503 },
    { text: 'duk?"', duration: 0.53, begin: 169.0, index: 504 },
    { text: " Öğ", duration: 0.53, begin: 170.5, index: 505 },
    { text: "ret", duration: 0.53, begin: 170.75, index: 506 },
    { text: "men", duration: 0.53, begin: 171.0, index: 507 },
    { text: " gü", duration: 0.53, begin: 171.25, index: 508 },
    { text: "lüm", duration: 0.53, begin: 171.5, index: 509 },
    { text: "se", duration: 0.53, begin: 171.75, index: 510 },
    { text: "ye", duration: 0.53, begin: 172.0, index: 511 },
    { text: "rek", duration: 0.53, begin: 172.25, index: 512 },
    { text: " öğ", duration: 0.53, begin: 172.5, index: 513 },
    { text: "ren", duration: 0.53, begin: 172.75, index: 514 },
    { text: "ci", duration: 0.53, begin: 173.0, index: 515 },
    { text: "le", duration: 0.53, begin: 173.25, index: 516 },
    { text: "ri", duration: 0.53, begin: 173.5, index: 517 },
    { text: "ne", duration: 0.53, begin: 173.75, index: 518 },
    { text: " şu", duration: 0.53, begin: 174.75, index: 519 },
    { text: " der", duration: 0.53, begin: 175.0, index: 520 },
    { text: "si", duration: 0.53, begin: 175.25, index: 521 },
    { text: " ve", duration: 0.53, begin: 175.5, index: 522 },
    { text: "rir:", duration: 0.53, begin: 175.75, index: 523 },
    { text: ' "Gö', duration: 0.53, begin: 176.5, index: 524 },
    { text: "rü", duration: 0.53, begin: 176.75, index: 525 },
    { text: "yor", duration: 0.53, begin: 177.0, index: 526 },
    { text: "su", duration: 0.53, begin: 177.25, index: 527 },
    { text: "nuz", duration: 0.53, begin: 177.5, index: 528 },
    { text: " ki,", duration: 0.53, begin: 177.75, index: 529 },
    { text: " af", duration: 0.53, begin: 178.75, index: 530 },
    { text: "fet", duration: 0.53, begin: 179.0, index: 531 },
    { text: "me", duration: 0.53, begin: 179.25, index: 532 },
    { text: "ye", duration: 0.53, begin: 179.5, index: 533 },
    { text: "rek", duration: 0.53, begin: 179.75, index: 534 },
    { text: " a", duration: 0.53, begin: 180.75, index: 535 },
    { text: "sıl", duration: 0.53, begin: 181.0, index: 536 },
    { text: " ken", duration: 0.53, begin: 181.25, index: 537 },
    { text: "di", duration: 0.53, begin: 181.5, index: 538 },
    { text: "mi", duration: 0.53, begin: 181.75, index: 539 },
    { text: "zi", duration: 0.53, begin: 182.0, index: 540 },
    { text: " ce", duration: 0.53, begin: 182.25, index: 541 },
    { text: "za", duration: 0.53, begin: 182.5, index: 542 },
    { text: "lan", duration: 0.53, begin: 182.75, index: 543 },
    { text: "dı", duration: 0.53, begin: 183.0, index: 544 },
    { text: "rı", duration: 0.53, begin: 183.25, index: 545 },
    { text: "yo", duration: 0.53, begin: 183.5, index: 546 },
    { text: "ruz.", duration: 0.53, begin: 183.75, index: 547 },
    { text: " Ken", duration: 0.53, begin: 184.75, index: 548 },
    { text: "di", duration: 0.53, begin: 185.0, index: 549 },
    { text: "mi", duration: 0.53, begin: 185.25, index: 550 },
    { text: "zi", duration: 0.53, begin: 185.5, index: 551 },
    { text: " ru", duration: 0.53, begin: 186.5, index: 552 },
    { text: "hu", duration: 0.53, begin: 186.75, index: 553 },
    { text: "muz", duration: 0.53, begin: 187.0, index: 554 },
    { text: "da", duration: 0.53, begin: 187.25, index: 555 },
    { text: " a", duration: 0.53, begin: 187.5, index: 556 },
    { text: "ğır", duration: 0.53, begin: 187.75, index: 557 },
    { text: " yük", duration: 0.53, begin: 188.0, index: 558 },
    { text: "ler", duration: 0.53, begin: 188.25, index: 559 },
    { text: " ta", duration: 0.53, begin: 188.5, index: 560 },
    { text: "şı", duration: 0.53, begin: 188.75, index: 561 },
    { text: "ma", duration: 0.53, begin: 189.0, index: 562 },
    { text: "ya", duration: 0.53, begin: 189.25, index: 563 },
    { text: " mah", duration: 0.53, begin: 190.25, index: 564 },
    { text: "kum", duration: 0.53, begin: 190.5, index: 565 },
    { text: " e", duration: 0.53, begin: 190.75, index: 566 },
    { text: "di", duration: 0.53, begin: 191.0, index: 567 },
    { text: "yo", duration: 0.53, begin: 191.25, index: 568 },
    { text: "ruz.", duration: 0.53, begin: 191.5, index: 569 },
    { text: " Af", duration: 0.53, begin: 192.5, index: 570 },
    { text: "fet", duration: 0.53, begin: 192.75, index: 571 },
    { text: "me", duration: 0.53, begin: 193.0, index: 572 },
    { text: "yi", duration: 0.53, begin: 193.25, index: 573 },
    { text: " kar", duration: 0.53, begin: 194.25, index: 574 },
    { text: "şı", duration: 0.53, begin: 194.5, index: 575 },
    { text: "mız", duration: 0.53, begin: 194.75, index: 576 },
    { text: "da", duration: 0.53, begin: 195.0, index: 577 },
    { text: "ki", duration: 0.53, begin: 195.25, index: 578 },
    { text: " ki", duration: 0.53, begin: 195.5, index: 579 },
    { text: "şi", duration: 0.53, begin: 195.75, index: 580 },
    { text: "ye", duration: 0.53, begin: 196.0, index: 581 },
    { text: " bir", duration: 0.53, begin: 196.75, index: 582 },
    { text: " ih", duration: 0.53, begin: 197.0, index: 583 },
    { text: "san", duration: 0.53, begin: 197.25, index: 584 },
    { text: " o", duration: 0.53, begin: 197.5, index: 585 },
    { text: "la", duration: 0.53, begin: 197.75, index: 586 },
    { text: "rak", duration: 0.53, begin: 198.0, index: 587 },
    { text: " dü", duration: 0.53, begin: 198.25, index: 588 },
    { text: "şü", duration: 0.53, begin: 198.5, index: 589 },
    { text: "nü", duration: 0.53, begin: 198.75, index: 590 },
    { text: "yo", duration: 0.53, begin: 199.0, index: 591 },
    { text: "ruz,", duration: 0.53, begin: 199.25, index: 592 },
    { text: " hal", duration: 0.53, begin: 200.25, index: 593 },
    { text: "bu", duration: 0.53, begin: 200.5, index: 594 },
    { text: "ki", duration: 0.53, begin: 200.75, index: 595 },
    { text: " af", duration: 0.53, begin: 201.5, index: 596 },
    { text: "fet", duration: 0.53, begin: 201.75, index: 597 },
    { text: "mek", duration: 0.53, begin: 202.0, index: 598 },
    { text: " en", duration: 0.53, begin: 202.25, index: 599 },
    { text: " baş", duration: 0.53, begin: 202.5, index: 600 },
    { text: "ta", duration: 0.53, begin: 202.75, index: 601 },
    { text: " ken", duration: 0.53, begin: 203.0, index: 602 },
    { text: "di", duration: 0.53, begin: 203.25, index: 603 },
    { text: "mi", duration: 0.53, begin: 203.5, index: 604 },
    { text: "ze", duration: 0.53, begin: 203.75, index: 605 },
    { text: " yap", duration: 0.68, begin: 204.0, index: 606 },
    { text: "tı", duration: 0.68, begin: 204.25, index: 607 },
    { text: "ği", duration: 0.68, begin: 204.5, index: 608 },
    { text: "mız", duration: 0.68, begin: 204.75, index: 609 },
    { text: " bir", duration: 0.68, begin: 205.0, index: 610 },
    { text: " i", duration: 0.68, begin: 205.75, index: 611 },
    { text: "yi", duration: 0.68, begin: 206.0, index: 612 },
    { text: "lik", duration: 0.68, begin: 206.25, index: 613 },
    { text: 'tir."', duration: 0.68, begin: 206.5, index: 614 },
  ];

  // All your existing useEffect hooks and functions remain the same
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const trackVisit = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (!userDoc.exists()) return;
          const userData = userDoc.data();
          const username = userData.username || userData.firstName || "Unknown";
          const currentPath = window.location.pathname;
          const storyId = currentPath.split("/").pop() || "unknown";
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

  const renderTextSegments = () => {
    const titleSegments = textSegments.filter((segment) => segment.isTitle);
    const bodySegments = textSegments.filter(
      (segment) => !segment.isTitle && segment.text.trim()
    );

    return (
      <div className="space-y-8 w-full max-w-full">
        {/* Title */}
        <div className="text-center w-full">
          <h1
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight w-full max-w-full break-words"
            style={{
              wordSpacing: "0",
              letterSpacing: "0",
              overflow: "hidden",
              wordWrap: "break-word",
              overflowWrap: "anywhere",
              hyphens: "auto",
            }}
          >
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
                  display: "inline",
                  fontSize: "inherit",
                  lineHeight: "inherit",
                  wordSpacing: "0",
                  letterSpacing: "0",
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
        <div className="prose prose-lg max-w-none w-full">
          <div
            className="text-lg md:text-xl leading-relaxed text-slate-700 w-full max-w-full"
            style={{
              wordSpacing: "0",
              letterSpacing: "0",
              lineHeight: "1.7",
              overflow: "hidden",
              wordWrap: "break-word",
              overflowWrap: "anywhere",
            }}
          >
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
                  display: "inline",
                  whiteSpace: "pre-wrap",
                  fontSize: "inherit",
                  lineHeight: "inherit",
                  fontFamily: "inherit",
                  wordSpacing: "0",
                  letterSpacing: "0",
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

            <div className="flex items-center space-x-5">
              <Link
                href="/dashboard/stories/bambu-agaci"
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
        {/* Audio Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 mb-6 backdrop-blur-sm bg-white/95">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
              </div>
            </div>
          </div>
          <audio
            ref={audioRef}
            src="/2-6.mp3"
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
