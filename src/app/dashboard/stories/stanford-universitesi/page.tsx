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
      text: "S",
      duration: 0.28,
      begin: 0.5,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "tan",
      duration: 0.28,
      begin: 0.75,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ford",
      duration: 0.28,
      begin: 1.0,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Ü",
      duration: 0.28,
      begin: 1.25,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ni",
      duration: 0.28,
      begin: 1.5,
      index: 5,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ver",
      duration: 0.28,
      begin: 1.75,
      index: 6,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "si",
      duration: 0.28,
      begin: 2.0,
      index: 7,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "te",
      duration: 0.28,
      begin: 2.25,
      index: 8,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "si",
      duration: 0.28,
      begin: 2.5,
      index: 9,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " So", duration: 0.28, begin: 3.5, index: 10 },
    { text: "luk", duration: 0.28, begin: 3.75, index: 11 },
    { text: " ve", duration: 0.28, begin: 4.0, index: 12 },
    { text: " yıp", duration: 0.28, begin: 4.25, index: 13 },
    { text: "ran", duration: 0.28, begin: 4.5, index: 14 },
    { text: "mış", duration: 0.28, begin: 4.75, index: 15 },
    { text: " giy", duration: 0.28, begin: 5.0, index: 16 },
    { text: "si", duration: 0.28, begin: 5.2, index: 17 },
    { text: "ler", duration: 0.28, begin: 5.4, index: 18 },
    { text: " i", duration: 0.28, begin: 5.6, index: 19 },
    { text: "çin", duration: 0.28, begin: 5.8, index: 20 },
    { text: "de", duration: 0.28, begin: 6.0, index: 21 },
    { text: "ki", duration: 0.28, begin: 6.2, index: 22 },
    { text: " yaş", duration: 0.28, begin: 6.4, index: 23 },
    { text: "lı", duration: 0.28, begin: 6.6, index: 24 },
    { text: " çift,", duration: 0.28, begin: 6.8, index: 25 },
    { text: " Bos", duration: 0.4, begin: 7.75, index: 26 },
    { text: "ton", duration: 0.4, begin: 8.0, index: 27 },
    { text: " tren", duration: 0.4, begin: 8.25, index: 28 },
    { text: "in", duration: 0.4, begin: 8.5, index: 29 },
    { text: "den", duration: 0.4, begin: 9.0, index: 30 },
    { text: " i", duration: 0.4, begin: 9.25, index: 31 },
    { text: "nip,", duration: 0.4, begin: 9.5, index: 32 },
    { text: " u", duration: 0.28, begin: 10.5, index: 33 },
    { text: "tan", duration: 0.28, begin: 10.75, index: 34 },
    { text: "gaç", duration: 0.28, begin: 11.0, index: 35 },
    { text: " bir", duration: 0.28, begin: 11.25, index: 36 },
    { text: " ta", duration: 0.28, begin: 11.5, index: 37 },
    { text: "vır", duration: 0.28, begin: 11.75, index: 38 },
    { text: "la", duration: 0.28, begin: 12.0, index: 39 },
    { text: " rek", duration: 0.28, begin: 12.75, index: 40 },
    { text: "tö", duration: 0.28, begin: 13.0, index: 41 },
    { text: "rün", duration: 0.28, begin: 13.25, index: 42 },
    { text: " bü", duration: 0.28, begin: 13.5, index: 43 },
    { text: "ro", duration: 0.28, begin: 13.75, index: 44 },
    { text: "sun", duration: 0.28, begin: 14.0, index: 45 },
    { text: "dan", duration: 0.28, begin: 14.25, index: 46 },
    { text: " i", duration: 0.28, begin: 14.5, index: 47 },
    { text: "çe", duration: 0.28, begin: 14.75, index: 48 },
    { text: "ri", duration: 0.28, begin: 15.0, index: 49 },
    { text: " gi", duration: 0.28, begin: 15.25, index: 50 },
    { text: "rer", duration: 0.28, begin: 15.5, index: 51 },
    { text: " gir", duration: 0.28, begin: 15.75, index: 52 },
    { text: "mez,", duration: 0.28, begin: 16.0, index: 53 },
    { text: " sek", duration: 0.28, begin: 16.75, index: 54 },
    { text: "re", duration: 0.28, begin: 17.0, index: 55 },
    { text: "ter", duration: 0.28, begin: 17.25, index: 56 },
    { text: " ma", duration: 0.4, begin: 18.2, index: 57 },
    { text: "sa", duration: 0.4, begin: 18.3, index: 58 },
    { text: "sın", duration: 0.4, begin: 18.5, index: 59 },
    { text: "dan", duration: 0.4, begin: 18.7, index: 60 },
    { text: " fır", duration: 0.28, begin: 19.2, index: 61 },
    { text: "la", duration: 0.28, begin: 19.4, index: 62 },
    { text: "ya", duration: 0.28, begin: 19.6, index: 63 },
    { text: "rak", duration: 0.28, begin: 19.8, index: 64 },
    { text: " ön", duration: 0.28, begin: 20.0, index: 65 },
    { text: "le", duration: 0.28, begin: 20.2, index: 66 },
    { text: "ri", duration: 0.28, begin: 20.4, index: 67 },
    { text: "ni", duration: 0.28, begin: 20.6, index: 68 },
    { text: " kes", duration: 0.28, begin: 20.8, index: 69 },
    { text: "ti.", duration: 0.28, begin: 21.0, index: 70 },
    { text: " Öy", duration: 0.28, begin: 22.0, index: 71 },
    { text: "le", duration: 0.28, begin: 22.25, index: 72 },
    { text: " ya,", duration: 0.28, begin: 22.5, index: 73 },
    { text: " bun", duration: 0.28, begin: 23.25, index: 74 },
    { text: "lar", duration: 0.28, begin: 23.5, index: 75 },
    { text: " gi", duration: 0.28, begin: 23.75, index: 76 },
    { text: "bi", duration: 0.28, begin: 24.0, index: 77 },
    { text: " ne ", duration: 0.28, begin: 24.5, index: 78 },
    { text: " ol", duration: 0.28, begin: 24.7, index: 79 },
    { text: "duk", duration: 0.28, begin: 24.9, index: 80 },
    { text: "la", duration: 0.28, begin: 25.1, index: 81 },
    { text: "rı", duration: 0.28, begin: 25.3, index: 82 },
    { text: " be", duration: 0.28, begin: 25.5, index: 83 },
    { text: "lir", duration: 0.28, begin: 25.7, index: 84 },
    { text: "siz", duration: 0.28, begin: 25.9, index: 85 },
    { text: " taş", duration: 0.28, begin: 26.1, index: 86 },
    { text: "ra", duration: 0.28, begin: 26.3, index: 87 },
    { text: "lı", duration: 0.28, begin: 26.5, index: 88 },
    { text: "la", duration: 0.28, begin: 26.7, index: 89 },
    { text: "rın", duration: 0.28, begin: 26.9, index: 90 },
    { text: " Har", duration: 0.28, begin: 27.9, index: 91 },
    { text: "ward", duration: 0.28, begin: 28.1, index: 92 },
    { text: " gi", duration: 0.28, begin: 28.3, index: 93 },
    { text: "bi", duration: 0.28, begin: 28.5, index: 94 },
    { text: " bir", duration: 0.28, begin: 28.7, index: 95 },
    { text: " ü", duration: 0.28, begin: 29.3, index: 96 },
    { text: "ni", duration: 0.28, begin: 29.5, index: 97 },
    { text: "ver", duration: 0.28, begin: 29.7, index: 98 },
    { text: "si", duration: 0.28, begin: 29.9, index: 99 },
    { text: "te", duration: 0.28, begin: 30.1, index: 100 },
    { text: "de", duration: 0.28, begin: 30.3, index: 101 },
    { text: " ne", duration: 0.28, begin: 30.5, index: 102 },
    { text: " iş", duration: 0.28, begin: 30.7, index: 103 },
    { text: "le", duration: 0.28, begin: 30.9, index: 104 },
    { text: "ri", duration: 0.28, begin: 31.1, index: 105 },
    { text: " o", duration: 0.28, begin: 31.3, index: 106 },
    { text: "la", duration: 0.28, begin: 31.5, index: 107 },
    { text: "bi", duration: 0.28, begin: 31.7, index: 108 },
    { text: "lir", duration: 0.28, begin: 31.9, index: 109 },
    { text: "di?", duration: 0.28, begin: 32.1, index: 110 },
    { text: " A", duration: 0.28, begin: 33.2, index: 111 },
    { text: "dam", duration: 0.28, begin: 33.4, index: 112 },
    { text: " ya", duration: 0.28, begin: 33.6, index: 113 },
    { text: "vaş", duration: 0.28, begin: 33.8, index: 114 },
    { text: "ça", duration: 0.28, begin: 34.0, index: 115 },
    { text: " rek", duration: 0.28, begin: 34.2, index: 116 },
    { text: "tö", duration: 0.28, begin: 34.4, index: 117 },
    { text: "rü", duration: 0.28, begin: 34.6, index: 118 },
    { text: " gör", duration: 0.28, begin: 34.8, index: 119 },
    { text: "mek", duration: 0.28, begin: 35.0, index: 120 },
    { text: " is", duration: 0.28, begin: 35.2, index: 121 },
    { text: "te", duration: 0.28, begin: 35.4, index: 122 },
    { text: "dik", duration: 0.28, begin: 35.6, index: 123 },
    { text: "le", duration: 0.28, begin: 35.8, index: 124 },
    { text: "ri", duration: 0.28, begin: 36.0, index: 125 },
    { text: "ni", duration: 0.28, begin: 36.2, index: 126 },
    { text: " söy", duration: 0.4, begin: 36.5, index: 127 },
    { text: "le", duration: 0.4, begin: 36.7, index: 128 },
    { text: "di.", duration: 0.4, begin: 36.9, index: 129 },
    { text: " İş", duration: 0.28, begin: 38.5, index: 130 },
    { text: "te", duration: 0.28, begin: 38.7, index: 131 },
    { text: " bu", duration: 0.28, begin: 38.9, index: 132 },
    { text: " im", duration: 0.28, begin: 39.1, index: 133 },
    { text: "kan", duration: 0.28, begin: 39.3, index: 134 },
    { text: "sız", duration: 0.28, begin: 39.5, index: 135 },
    { text: "dı.", duration: 0.28, begin: 39.7, index: 136 },
    { text: " Rek", duration: 0.28, begin: 41.0, index: 137 },
    { text: "tö", duration: 0.28, begin: 41.2, index: 138 },
    { text: "rün", duration: 0.28, begin: 41.4, index: 139 },
    { text: " o", duration: 0.28, begin: 41.6, index: 140 },
    { text: "gün", duration: 0.28, begin: 41.8, index: 141 },
    { text: " on", duration: 0.28, begin: 42.2, index: 142 },
    { text: "la", duration: 0.28, begin: 42.4, index: 143 },
    { text: "ra", duration: 0.28, begin: 42.6, index: 144 },
    { text: " a", duration: 0.28, begin: 42.8, index: 145 },
    { text: "yı", duration: 0.28, begin: 43.0, index: 146 },
    { text: "ra", duration: 0.28, begin: 43.2, index: 147 },
    { text: "cak", duration: 0.28, begin: 43.4, index: 148 },
    { text: " sa", duration: 0.28, begin: 43.8, index: 149 },
    { text: "ni", duration: 0.28, begin: 44.0, index: 150 },
    { text: "ye", duration: 0.28, begin: 44.2, index: 151 },
    { text: "si", duration: 0.28, begin: 44.4, index: 152 },
    { text: " yok", duration: 0.28, begin: 44.6, index: 153 },
    { text: "tu.", duration: 0.28, begin: 44.8, index: 154 },
    { text: " Yaş", duration: 0.28, begin: 45.8, index: 155 },
    { text: "lı", duration: 0.28, begin: 46.0, index: 156 },
    { text: " ka", duration: 0.28, begin: 46.2, index: 157 },
    { text: "dın", duration: 0.28, begin: 46.4, index: 158 },
    { text: " çe", duration: 0.38, begin: 46.6, index: 159 },
    { text: "kin", duration: 0.38, begin: 46.8, index: 160 },
    { text: "gen", duration: 0.38, begin: 47.0, index: 161 },
    { text: " bir", duration: 0.48, begin: 47.2, index: 162 },
    { text: " ta", duration: 0.48, begin: 47.4, index: 163 },
    { text: "vır", duration: 0.48, begin: 47.6, index: 164 },
    { text: "la:", duration: 0.48, begin: 47.8, index: 165 },
    { text: ' "Bek', duration: 0.38, begin: 49.0, index: 166 },
    { text: "le", duration: 0.38, begin: 49.2, index: 167 },
    { text: 'riz"', duration: 0.38, begin: 49.4, index: 168 },
    { text: " di", duration: 0.28, begin: 50.2, index: 169 },
    { text: "ye", duration: 0.28, begin: 50.4, index: 170 },
    { text: " mı", duration: 0.28, begin: 50.6, index: 171 },
    { text: "rıl", duration: 0.28, begin: 50.8, index: 172 },
    { text: "dan", duration: 0.28, begin: 51.0, index: 173 },
    { text: "dı.", duration: 0.28, begin: 51.2, index: 174 },
    { text: " Na", duration: 0.28, begin: 52.2, index: 175 },
    { text: "sıl", duration: 0.28, begin: 52.4, index: 176 },
    { text: " ol", duration: 0.28, begin: 52.6, index: 177 },
    { text: "sa", duration: 0.28, begin: 52.8, index: 178 },
    { text: " bir", duration: 0.28, begin: 53.2, index: 179 },
    { text: " sü", duration: 0.28, begin: 53.6, index: 180 },
    { text: "re", duration: 0.28, begin: 53.8, index: 181 },
    { text: " son", duration: 0.28, begin: 54.0, index: 182 },
    { text: "ra", duration: 0.28, begin: 54.2, index: 183 },
    { text: " sı", duration: 0.28, begin: 54.6, index: 184 },
    { text: "kı", duration: 0.28, begin: 54.8, index: 185 },
    { text: "lıp", duration: 0.28, begin: 55.0, index: 186 },
    { text: " gi", duration: 0.28, begin: 55.2, index: 187 },
    { text: "de", duration: 0.28, begin: 55.4, index: 188 },
    { text: "cek", duration: 0.28, begin: 55.6, index: 189 },
    { text: "ler", duration: 0.28, begin: 55.8, index: 190 },
    { text: "di.", duration: 0.28, begin: 56.0, index: 191 },
    { text: " Sek", duration: 0.28, begin: 57.0, index: 192 },
    { text: "re", duration: 0.28, begin: 57.2, index: 193 },
    { text: "ter", duration: 0.28, begin: 57.4, index: 194 },
    { text: " se", duration: 0.28, begin: 57.8, index: 195 },
    { text: "si", duration: 0.28, begin: 58.0, index: 196 },
    { text: "ni", duration: 0.28, begin: 58.2, index: 197 },
    { text: " çı", duration: 0.28, begin: 58.4, index: 198 },
    { text: "kar", duration: 0.28, begin: 58.6, index: 199 },
    { text: "ma", duration: 0.28, begin: 58.8, index: 200 },
    { text: "dan", duration: 0.28, begin: 59.0, index: 201 },
    { text: " ma", duration: 0.28, begin: 59.4, index: 202 },
    { text: "sa", duration: 0.28, begin: 59.6, index: 203 },
    { text: "sı", duration: 0.28, begin: 59.8, index: 204 },
    { text: "na", duration: 0.28, begin: 60.0, index: 205 },
    { text: " dön", duration: 0.28, begin: 60.2, index: 206 },
    { text: "dü.", duration: 0.28, begin: 60.4, index: 207 },
    { text: " Sa", duration: 0.28, begin: 61.6, index: 208 },
    { text: "at", duration: 0.28, begin: 61.8, index: 209 },
    { text: "ler", duration: 0.28, begin: 62.0, index: 210 },
    { text: " geç", duration: 0.28, begin: 62.2, index: 211 },
    { text: "ti,", duration: 0.28, begin: 62.4, index: 212 },
    { text: " yaş", duration: 0.28, begin: 63.6, index: 213 },
    { text: "lı", duration: 0.28, begin: 63.8, index: 214 },
    { text: " çift", duration: 0.28, begin: 64.2, index: 215 },
    { text: " pes", duration: 0.28, begin: 64.4, index: 216 },
    { text: " et", duration: 0.28, begin: 65.0, index: 217 },
    { text: "me", duration: 0.28, begin: 65.2, index: 218 },
    { text: "di.", duration: 0.28, begin: 65.4, index: 219 },
    { text: " So", duration: 0.28, begin: 66.4, index: 220 },
    { text: "nun", duration: 0.28, begin: 66.6, index: 221 },
    { text: "da", duration: 0.28, begin: 66.8, index: 222 },
    { text: " sek", duration: 0.28, begin: 67.0, index: 223 },
    { text: "re", duration: 0.28, begin: 67.2, index: 224 },
    { text: "ter", duration: 0.28, begin: 67.4, index: 225 },
    { text: " da", duration: 0.28, begin: 67.6, index: 226 },
    { text: "ya", duration: 0.28, begin: 67.8, index: 227 },
    { text: "na", duration: 0.28, begin: 68.0, index: 228 },
    { text: "ma", duration: 0.28, begin: 68.2, index: 229 },
    { text: "ya", duration: 0.28, begin: 68.4, index: 230 },
    { text: "rak", duration: 0.28, begin: 68.6, index: 231 },
    { text: " ye", duration: 0.28, begin: 69.0, index: 232 },
    { text: "rin", duration: 0.28, begin: 69.2, index: 233 },
    { text: "den", duration: 0.28, begin: 69.4, index: 234 },
    { text: " kalk", duration: 0.28, begin: 69.8, index: 235 },
    { text: "tı.", duration: 0.28, begin: 70.0, index: 236 },
    { text: ' "Sa', duration: 0.28, begin: 71.2, index: 237 },
    { text: "de", duration: 0.28, begin: 71.4, index: 238 },
    { text: "ce", duration: 0.28, begin: 71.6, index: 239 },
    { text: " bir", duration: 0.28, begin: 71.8, index: 240 },
    { text: "kaç", duration: 0.28, begin: 72.0, index: 241 },
    { text: " da", duration: 0.28, begin: 72.4, index: 242 },
    { text: "ki", duration: 0.28, begin: 72.6, index: 243 },
    { text: "ka", duration: 0.28, begin: 72.8, index: 244 },
    { text: " gö", duration: 0.28, begin: 73.2, index: 245 },
    { text: "rüş", duration: 0.28, begin: 73.4, index: 246 },
    { text: "se", duration: 0.28, begin: 73.6, index: 247 },
    { text: "niz,", duration: 0.28, begin: 73.8, index: 248 },
    { text: " yok", duration: 0.28, begin: 74.6, index: 249 },
    { text: "sa", duration: 0.28, begin: 74.8, index: 250 },
    { text: " gi", duration: 0.28, begin: 75.0, index: 251 },
    { text: "de", duration: 0.28, begin: 75.2, index: 252 },
    { text: "cek", duration: 0.28, begin: 75.4, index: 253 },
    { text: "le", duration: 0.28, begin: 75.6, index: 254 },
    { text: "ri", duration: 0.28, begin: 75.8, index: 255 },
    { text: ' yok"', duration: 0.28, begin: 76.0, index: 256 },
    { text: " di", duration: 0.13, begin: 77.0, index: 257 },
    { text: "ye", duration: 0.13, begin: 77.2, index: 258 },
    { text: "rek", duration: 0.13, begin: 77.4, index: 259 },
    { text: " rek", duration: 0.28, begin: 77.6, index: 260 },
    { text: "tö", duration: 0.28, begin: 77.8, index: 261 },
    { text: "rü", duration: 0.28, begin: 78.0, index: 262 },
    { text: " ik", duration: 0.28, begin: 78.2, index: 263 },
    { text: "na", duration: 0.28, begin: 78.4, index: 264 },
    { text: " et", duration: 0.28, begin: 78.8, index: 265 },
    { text: "me", duration: 0.28, begin: 79.0, index: 266 },
    { text: "ye", duration: 0.28, begin: 79.2, index: 267 },
    { text: " ça", duration: 0.28, begin: 79.4, index: 268 },
    { text: "lış", duration: 0.28, begin: 79.6, index: 269 },
    { text: "tı.", duration: 0.28, begin: 79.8, index: 270 },
    { text: " An", duration: 0.28, begin: 81.1, index: 271 },
    { text: "la", duration: 0.28, begin: 81.3, index: 272 },
    { text: "şı", duration: 0.28, begin: 81.5, index: 273 },
    { text: "lan", duration: 0.28, begin: 81.7, index: 274 },
    { text: " ça", duration: 0.28, begin: 81.9, index: 275 },
    { text: "re", duration: 0.28, begin: 82.1, index: 276 },
    { text: " yok", duration: 0.28, begin: 82.5, index: 277 },
    { text: "tu.", duration: 0.28, begin: 82.7, index: 278 },
    { text: " Genç", duration: 0.28, begin: 83.8, index: 279 },
    { text: " rek", duration: 0.28, begin: 84.0, index: 280 },
    { text: "tör", duration: 0.28, begin: 84.2, index: 281 },
    { text: " is", duration: 0.28, begin: 84.9, index: 282 },
    { text: "tek", duration: 0.28, begin: 85.1, index: 283 },
    { text: "siz", duration: 0.28, begin: 85.3, index: 284 },
    { text: " bir", duration: 0.4, begin: 85.5, index: 285 },
    { text: " bi", duration: 0.4, begin: 85.7, index: 286 },
    { text: "çim", duration: 0.4, begin: 85.9, index: 287 },
    { text: "de", duration: 0.4, begin: 86.1, index: 288 },
    { text: " ka", duration: 0.28, begin: 86.7, index: 289 },
    { text: "pı", duration: 0.28, begin: 86.9, index: 290 },
    { text: "yı", duration: 0.28, begin: 87.1, index: 291 },
    { text: " aç", duration: 0.28, begin: 87.3, index: 292 },
    { text: "tı.", duration: 0.28, begin: 87.5, index: 293 },
    { text: " Sek", duration: 0.28, begin: 88.5, index: 294 },
    { text: "re", duration: 0.28, begin: 88.7, index: 295 },
    { text: "te", duration: 0.28, begin: 88.9, index: 296 },
    { text: "rin", duration: 0.28, begin: 89.1, index: 297 },
    { text: " an", duration: 0.28, begin: 89.7, index: 298 },
    { text: "lat", duration: 0.28, begin: 89.9, index: 299 },
    { text: "tı", duration: 0.28, begin: 90.1, index: 300 },
    { text: "ğı", duration: 0.28, begin: 90.3, index: 301 },
    { text: " tab", duration: 0.28, begin: 90.5, index: 302 },
    { text: "lo", duration: 0.28, begin: 90.7, index: 303 },
    { text: " i", duration: 0.28, begin: 91.0, index: 304 },
    { text: "çi", duration: 0.28, begin: 91.2, index: 305 },
    { text: "ni", duration: 0.28, begin: 91.4, index: 306 },
    { text: " bu", duration: 0.28, begin: 91.8, index: 307 },
    { text: "lan", duration: 0.28, begin: 92.0, index: 308 },
    { text: "dır", duration: 0.28, begin: 92.1, index: 309 },
    { text: "mış", duration: 0.28, begin: 92.3, index: 310 },
    { text: "tı.", duration: 0.28, begin: 92.5, index: 311 },
    { text: " Za", duration: 0.28, begin: 93.5, index: 312 },
    { text: "ten", duration: 0.28, begin: 93.7, index: 313 },
    { text: " taş", duration: 0.28, begin: 94.3, index: 314 },
    { text: "ra", duration: 0.28, begin: 94.5, index: 315 },
    { text: "lı", duration: 0.28, begin: 94.7, index: 316 },
    { text: "lar", duration: 0.28, begin: 94.9, index: 317 },
    { text: "dan,", duration: 0.28, begin: 95.1, index: 318 },
    { text: " ka", duration: 0.28, begin: 96.2, index: 319 },
    { text: "ba", duration: 0.28, begin: 96.4, index: 320 },
    { text: " sa", duration: 0.28, begin: 96.6, index: 321 },
    { text: "ba", duration: 0.28, begin: 96.8, index: 322 },
    { text: " köy", duration: 0.28, begin: 97.0, index: 323 },
    { text: "lü", duration: 0.28, begin: 97.2, index: 324 },
    { text: "ler", duration: 0.28, begin: 97.4, index: 325 },
    { text: "den", duration: 0.28, begin: 97.6, index: 326 },
    { text: " nef", duration: 0.28, begin: 98.0, index: 327 },
    { text: "ret", duration: 0.28, begin: 98.2, index: 328 },
    { text: " e", duration: 0.28, begin: 98.4, index: 329 },
    { text: "der", duration: 0.28, begin: 98.6, index: 330 },
    { text: "di.", duration: 0.28, begin: 98.8, index: 331 },
    { text: " O", duration: 0.28, begin: 100.2, index: 332 },
    { text: "nun", duration: 0.28, begin: 100.4, index: 333 },
    { text: " gi", duration: 0.28, begin: 100.6, index: 334 },
    { text: "bi", duration: 0.28, begin: 100.8, index: 335 },
    { text: " bir", duration: 0.28, begin: 101.0, index: 336 },
    { text: " a", duration: 0.28, begin: 101.2, index: 337 },
    { text: "da", duration: 0.28, begin: 101.4, index: 338 },
    { text: "mın", duration: 0.28, begin: 101.6, index: 339 },
    { text: " o", duration: 0.28, begin: 102.0, index: 340 },
    { text: "fi", duration: 0.28, begin: 102.2, index: 341 },
    { text: "si", duration: 0.28, begin: 102.4, index: 342 },
    { text: "ne", duration: 0.28, begin: 102.6, index: 343 },
    { text: " gel", duration: 0.28, begin: 102.8, index: 344 },
    { text: "me", duration: 0.28, begin: 103.0, index: 345 },
    { text: "ye", duration: 0.28, begin: 103.2, index: 346 },
    { text: " ce", duration: 0.28, begin: 103.4, index: 347 },
    { text: "sa", duration: 0.28, begin: 103.6, index: 348 },
    { text: "ret", duration: 0.28, begin: 103.8, index: 349 },
    { text: " et", duration: 0.28, begin: 104.0, index: 350 },
    { text: "mek!", duration: 0.28, begin: 104.2, index: 351 },
    { text: " O", duration: 0.28, begin: 105.2, index: 352 },
    { text: "la", duration: 0.28, begin: 105.5, index: 353 },
    { text: "cak", duration: 0.28, begin: 105.7, index: 354 },
    { text: " şey", duration: 0.28, begin: 105.9, index: 355 },
    { text: " miy", duration: 0.28, begin: 106.1, index: 356 },
    { text: "di", duration: 0.28, begin: 106.3, index: 357 },
    { text: " bu?", duration: 0.28, begin: 106.6, index: 358 },
    { text: " Su", duration: 0.28, begin: 107.8, index: 359 },
    { text: "ra", duration: 0.28, begin: 108.0, index: 360 },
    { text: "tı", duration: 0.28, begin: 108.2, index: 361 },
    { text: " a", duration: 0.28, begin: 108.4, index: 362 },
    { text: "sıl", duration: 0.28, begin: 108.6, index: 363 },
    { text: "mış", duration: 0.28, begin: 108.8, index: 364 },
    { text: " si", duration: 0.28, begin: 109.8, index: 365 },
    { text: "nir", duration: 0.28, begin: 110.0, index: 366 },
    { text: "le", duration: 0.28, begin: 110.2, index: 367 },
    { text: "ri", duration: 0.28, begin: 110.4, index: 368 },
    { text: " ge", duration: 0.28, begin: 110.6, index: 369 },
    { text: "ril", duration: 0.28, begin: 110.8, index: 370 },
    { text: "miş", duration: 0.28, begin: 111.0, index: 371 },
    { text: "ti.", duration: 0.28, begin: 111.2, index: 372 },
    { text: " Yaş", duration: 0.28, begin: 112.4, index: 373 },
    { text: "lı", duration: 0.28, begin: 112.6, index: 374 },
    { text: " ka", duration: 0.28, begin: 112.8, index: 375 },
    { text: "dın", duration: 0.28, begin: 113.0, index: 376 },
    { text: " he", duration: 0.28, begin: 113.6, index: 377 },
    { text: "men", duration: 0.28, begin: 113.8, index: 378 },
    { text: " sö", duration: 0.28, begin: 114.0, index: 379 },
    { text: "ze", duration: 0.28, begin: 114.2, index: 380 },
    { text: " baş", duration: 0.28, begin: 114.4, index: 381 },
    { text: "la", duration: 0.28, begin: 114.6, index: 382 },
    { text: "dı.", duration: 0.28, begin: 114.8, index: 383 },
    { text: " Har", duration: 0.28, begin: 116.0, index: 384 },
    { text: "ward'", duration: 0.28, begin: 116.2, index: 385 },
    { text: "da", duration: 0.28, begin: 116.4, index: 386 },
    { text: " o", duration: 0.28, begin: 116.6, index: 387 },
    { text: "ku", duration: 0.28, begin: 116.8, index: 388 },
    { text: "yan", duration: 0.28, begin: 117.0, index: 389 },
    { text: " o", duration: 0.28, begin: 117.2, index: 390 },
    { text: "ğul", duration: 0.28, begin: 117.4, index: 391 },
    { text: "la", duration: 0.28, begin: 117.6, index: 392 },
    { text: "rı", duration: 0.28, begin: 117.8, index: 393 },
    { text: "nı", duration: 0.28, begin: 118.0, index: 394 },
    { text: " bir", duration: 0.28, begin: 119.0, index: 395 },
    { text: " yıl", duration: 0.28, begin: 119.2, index: 396 },
    { text: " ön", duration: 0.28, begin: 119.4, index: 397 },
    { text: "ce", duration: 0.28, begin: 119.6, index: 398 },
    { text: " bir", duration: 0.28, begin: 119.8, index: 399 },
    { text: " ka", duration: 0.28, begin: 120.0, index: 400 },
    { text: "za", duration: 0.28, begin: 120.2, index: 401 },
    { text: "da", duration: 0.28, begin: 120.4, index: 402 },
    { text: " kay", duration: 0.38, begin: 121.0, index: 403 },
    { text: "bet", duration: 0.38, begin: 121.2, index: 404 },
    { text: "miş", duration: 0.38, begin: 121.4, index: 405 },
    { text: "ler", duration: 0.38, begin: 121.6, index: 406 },
    { text: "di.", duration: 0.38, begin: 121.8, index: 407 },
    { text: " O", duration: 0.28, begin: 123.4, index: 408 },
    { text: "ğul", duration: 0.28, begin: 123.6, index: 409 },
    { text: "la", duration: 0.28, begin: 123.8, index: 410 },
    { text: "rı", duration: 0.28, begin: 124.0, index: 411 },
    { text: " bu", duration: 0.28, begin: 124.2, index: 412 },
    { text: "ra", duration: 0.28, begin: 124.4, index: 413 },
    { text: "da", duration: 0.28, begin: 124.6, index: 414 },
    { text: " öy", duration: 0.28, begin: 124.8, index: 415 },
    { text: "le", duration: 0.28, begin: 125.0, index: 416 },
    { text: " mut", duration: 0.28, begin: 125.2, index: 417 },
    { text: "lu", duration: 0.28, begin: 125.4, index: 418 },
    { text: " ol", duration: 0.28, begin: 125.6, index: 419 },
    { text: "muş", duration: 0.28, begin: 125.8, index: 420 },
    { text: "tu", duration: 0.28, begin: 126.0, index: 421 },
    { text: " ki;", duration: 0.28, begin: 126.2, index: 422 },
    { text: " o", duration: 0.28, begin: 127.4, index: 423 },
    { text: "nun", duration: 0.28, begin: 127.6, index: 424 },
    { text: " a", duration: 0.28, begin: 127.8, index: 425 },
    { text: "nı", duration: 0.28, begin: 128.0, index: 426 },
    { text: "sı", duration: 0.28, begin: 128.2, index: 427 },
    { text: "na", duration: 0.28, begin: 128.4, index: 428 },
    { text: " o", duration: 0.28, begin: 128.6, index: 429 },
    { text: "kul", duration: 0.28, begin: 128.8, index: 430 },
    { text: " sı", duration: 0.28, begin: 129.0, index: 431 },
    { text: "nır", duration: 0.28, begin: 129.2, index: 432 },
    { text: "la", duration: 0.28, begin: 129.4, index: 433 },
    { text: "rı", duration: 0.28, begin: 129.6, index: 434 },
    { text: " i", duration: 0.28, begin: 129.8, index: 435 },
    { text: "çin", duration: 0.28, begin: 130.0, index: 436 },
    { text: "de", duration: 0.28, begin: 130.2, index: 437 },
    { text: " bir", duration: 0.28, begin: 130.4, index: 438 },
    { text: " ye", duration: 0.28, begin: 130.6, index: 439 },
    { text: "re,", duration: 0.28, begin: 130.8, index: 440 },
    { text: " bir", duration: 0.28, begin: 132.0, index: 441 },
    { text: " a", duration: 0.28, begin: 132.2, index: 442 },
    { text: "nıt", duration: 0.28, begin: 132.4, index: 443 },
    { text: " dik", duration: 0.28, begin: 132.8, index: 444 },
    { text: "mek", duration: 0.28, begin: 133.0, index: 445 },
    { text: " is", duration: 0.4, begin: 133.2, index: 446 },
    { text: "ti", duration: 0.4, begin: 133.4, index: 447 },
    { text: "yor", duration: 0.4, begin: 133.6, index: 448 },
    { text: "lar", duration: 0.4, begin: 133.8, index: 449 },
    { text: "dı.", duration: 0.4, begin: 134.0, index: 450 },
    { text: " Rek", duration: 0.28, begin: 135.6, index: 451 },
    { text: "tör,", duration: 0.28, begin: 135.8, index: 452 },
    { text: " bu", duration: 0.28, begin: 136.8, index: 453 },
    { text: " do", duration: 0.28, begin: 137.0, index: 454 },
    { text: "ku", duration: 0.28, begin: 137.2, index: 455 },
    { text: "nak", duration: 0.28, begin: 137.4, index: 456 },
    { text: "lı", duration: 0.28, begin: 137.6, index: 457 },
    { text: " öy", duration: 0.28, begin: 137.8, index: 458 },
    { text: "kü", duration: 0.28, begin: 138.0, index: 459 },
    { text: "den", duration: 0.28, begin: 138.2, index: 460 },
    { text: " duy", duration: 0.28, begin: 138.6, index: 461 },
    { text: "gu", duration: 0.28, begin: 138.8, index: 462 },
    { text: "lan", duration: 0.28, begin: 139.0, index: 463 },
    { text: "mak", duration: 0.28, begin: 139.4, index: 464 },
    { text: " ye", duration: 0.28, begin: 139.8, index: 465 },
    { text: "ri", duration: 0.28, begin: 140.0, index: 466 },
    { text: "ne", duration: 0.28, begin: 140.2, index: 467 },
    { text: " öf", duration: 0.28, begin: 140.4, index: 468 },
    { text: "ke", duration: 0.28, begin: 140.6, index: 469 },
    { text: "len", duration: 0.28, begin: 140.8, index: 470 },
    { text: "di.", duration: 0.28, begin: 141.0, index: 471 },
    { text: ' "Ma', duration: 0.28, begin: 142.2, index: 472 },
    { text: "dam,", duration: 0.28, begin: 142.4, index: 473 },
    { text: " biz", duration: 0.28, begin: 143.4, index: 474 },
    { text: " Har", duration: 0.28, begin: 143.8, index: 475 },
    { text: "ward'", duration: 0.28, begin: 144.0, index: 476 },
    { text: "da", duration: 0.28, begin: 144.2, index: 477 },
    { text: " o", duration: 0.28, begin: 144.4, index: 478 },
    { text: "ku", duration: 0.28, begin: 144.6, index: 479 },
    { text: "yan", duration: 0.28, begin: 144.8, index: 480 },
    { text: " ve", duration: 0.28, begin: 145.0, index: 481 },
    { text: " son", duration: 0.28, begin: 145.8, index: 482 },
    { text: "ra", duration: 0.28, begin: 146.0, index: 483 },
    { text: " ö", duration: 0.28, begin: 146.6, index: 484 },
    { text: "len", duration: 0.28, begin: 146.8, index: 485 },
    { text: " her", duration: 0.28, begin: 147.0, index: 486 },
    { text: "kes", duration: 0.28, begin: 147.2, index: 487 },
    { text: " i", duration: 0.28, begin: 147.6, index: 488 },
    { text: "çin", duration: 0.28, begin: 147.8, index: 489 },
    { text: " bir", duration: 0.28, begin: 148.6, index: 490 },
    { text: " a", duration: 0.28, begin: 148.8, index: 491 },
    { text: "nıt", duration: 0.28, begin: 149.0, index: 492 },
    { text: " di", duration: 0.28, begin: 149.6, index: 493 },
    { text: "ke", duration: 0.28, begin: 149.8, index: 494 },
    { text: "cek", duration: 0.28, begin: 150.0, index: 495 },
    { text: " ol", duration: 0.28, begin: 150.2, index: 496 },
    { text: "sak,", duration: 0.28, begin: 150.4, index: 497 },
    { text: " bu", duration: 0.28, begin: 151.2, index: 498 },
    { text: "ra", duration: 0.28, begin: 151.4, index: 499 },
    { text: "sı", duration: 0.28, begin: 151.6, index: 500 },
    { text: " me", duration: 0.28, begin: 151.8, index: 501 },
    { text: "zar", duration: 0.28, begin: 152.0, index: 502 },
    { text: "lı", duration: 0.28, begin: 152.2, index: 503 },
    { text: "ğa", duration: 0.28, begin: 152.4, index: 504 },
    { text: " dö", duration: 0.28, begin: 152.6, index: 505 },
    { text: 'ner."', duration: 0.28, begin: 152.8, index: 506 },
    { text: ' "Ha', duration: 0.28, begin: 154.0, index: 507 },
    { text: "yır,", duration: 0.28, begin: 154.2, index: 508 },
    { text: " ha", duration: 0.28, begin: 154.8, index: 509 },
    { text: 'yır"', duration: 0.28, begin: 155.0, index: 510 },
    { text: " di", duration: 0.28, begin: 155.6, index: 511 },
    { text: "ye", duration: 0.28, begin: 155.8, index: 512 },
    { text: "rek", duration: 0.28, begin: 156.0, index: 513 },
    { text: " hay", duration: 0.28, begin: 156.4, index: 514 },
    { text: "kır", duration: 0.28, begin: 156.6, index: 515 },
    { text: "dı", duration: 0.28, begin: 156.8, index: 516 },
    { text: " yaş", duration: 0.28, begin: 157.2, index: 517 },
    { text: "lı", duration: 0.28, begin: 157.4, index: 518 },
    { text: " ka", duration: 0.28, begin: 157.6, index: 519 },
    { text: "dın.", duration: 0.28, begin: 157.8, index: 520 },
    { text: ' "A', duration: 0.28, begin: 158.6, index: 521 },
    { text: "nıt", duration: 0.28, begin: 158.8, index: 522 },
    { text: " de", duration: 0.28, begin: 159.0, index: 523 },
    { text: "ğil,", duration: 0.28, begin: 159.2, index: 524 },
    { text: " bel", duration: 0.28, begin: 160.0, index: 525 },
    { text: "ki", duration: 0.28, begin: 160.2, index: 526 },
    { text: " Har", duration: 0.28, begin: 160.4, index: 527 },
    { text: "ward'", duration: 0.28, begin: 160.6, index: 528 },
    { text: "a", duration: 0.28, begin: 160.8, index: 529 },
    { text: " bir", duration: 0.28, begin: 161.4, index: 530 },
    { text: " bi", duration: 0.28, begin: 161.6, index: 531 },
    { text: "na", duration: 0.28, begin: 161.8, index: 532 },
    { text: " yap", duration: 0.28, begin: 162.0, index: 533 },
    { text: "tı", duration: 0.28, begin: 162.2, index: 534 },
    { text: "ra", duration: 0.28, begin: 162.4, index: 535 },
    { text: "bi", duration: 0.28, begin: 162.6, index: 536 },
    { text: "li", duration: 0.28, begin: 162.8, index: 537 },
    { text: 'riz."', duration: 0.28, begin: 163.0, index: 538 },
    { text: " Rek", duration: 0.28, begin: 164.4, index: 539 },
    { text: "tör,", duration: 0.28, begin: 164.6, index: 540 },
    { text: " yıp", duration: 0.28, begin: 165.4, index: 541 },
    { text: "ran", duration: 0.28, begin: 165.6, index: 542 },
    { text: "mış", duration: 0.28, begin: 165.8, index: 543 },
    { text: " giy", duration: 0.28, begin: 166.4, index: 544 },
    { text: "si", duration: 0.28, begin: 166.6, index: 545 },
    { text: "le", duration: 0.28, begin: 166.8, index: 546 },
    { text: "re", duration: 0.28, begin: 167.0, index: 547 },
    { text: " nef", duration: 0.28, begin: 167.8, index: 548 },
    { text: "ret", duration: 0.28, begin: 168.0, index: 549 },
    { text: " do", duration: 0.28, begin: 168.2, index: 550 },
    { text: "lu", duration: 0.28, begin: 168.4, index: 551 },
    { text: " bir", duration: 0.28, begin: 168.6, index: 552 },
    { text: " ba", duration: 0.28, begin: 168.8, index: 553 },
    { text: "kış", duration: 0.28, begin: 169.0, index: 554 },
    { text: " fır", duration: 0.28, begin: 169.6, index: 555 },
    { text: "la", duration: 0.28, begin: 169.8, index: 556 },
    { text: "ta", duration: 0.28, begin: 170.0, index: 557 },
    { text: "rak:", duration: 0.28, begin: 170.2, index: 558 },
    { text: ' "Bi', duration: 0.28, begin: 171.0, index: 559 },
    { text: "na", duration: 0.28, begin: 171.2, index: 560 },
    { text: " mı?", duration: 0.28, begin: 171.4, index: 561 },
    { text: " Siz", duration: 0.28, begin: 172.6, index: 562 },
    { text: " bir", duration: 0.28, begin: 172.8, index: 563 },
    { text: " bi", duration: 0.28, begin: 173.0, index: 564 },
    { text: "na", duration: 0.28, begin: 173.2, index: 565 },
    { text: "nın", duration: 0.28, begin: 173.4, index: 566 },
    { text: " ka", duration: 0.28, begin: 174.0, index: 567 },
    { text: "ça", duration: 0.28, begin: 174.2, index: 568 },
    { text: " mal", duration: 0.28, begin: 174.4, index: 569 },
    { text: " ol", duration: 0.28, begin: 174.6, index: 570 },
    { text: "du", duration: 0.28, begin: 174.8, index: 571 },
    { text: "ğu", duration: 0.28, begin: 175.0, index: 572 },
    { text: "nu", duration: 0.28, begin: 175.2, index: 573 },
    { text: " bi", duration: 0.28, begin: 175.4, index: 574 },
    { text: "li", duration: 0.28, begin: 175.6, index: 575 },
    { text: "yor", duration: 0.28, begin: 175.8, index: 576 },
    { text: " mu", duration: 0.28, begin: 176.0, index: 577 },
    { text: "su", duration: 0.28, begin: 176.2, index: 578 },
    { text: "nuz?", duration: 0.28, begin: 176.4, index: 579 },
    { text: " Sa", duration: 0.28, begin: 177.2, index: 580 },
    { text: "de", duration: 0.28, begin: 177.4, index: 581 },
    { text: "ce", duration: 0.28, begin: 177.6, index: 582 },
    { text: " son", duration: 0.28, begin: 178.0, index: 583 },
    { text: " yap", duration: 0.28, begin: 178.2, index: 584 },
    { text: "tı", duration: 0.28, begin: 178.4, index: 585 },
    { text: "ğı", duration: 0.28, begin: 178.6, index: 586 },
    { text: "mız", duration: 0.28, begin: 178.8, index: 587 },
    { text: " bö", duration: 0.28, begin: 179.0, index: 588 },
    { text: "lüm", duration: 0.28, begin: 179.2, index: 589 },
    { text: " se", duration: 0.28, begin: 180.2, index: 590 },
    { text: "kiz", duration: 0.28, begin: 180.4, index: 591 },
    { text: " mil", duration: 0.28, begin: 180.6, index: 592 },
    { text: "yon", duration: 0.28, begin: 180.8, index: 593 },
    { text: " do", duration: 0.28, begin: 181.4, index: 594 },
    { text: "lar", duration: 0.28, begin: 181.6, index: 595 },
    { text: "dan", duration: 0.28, begin: 181.8, index: 596 },
    { text: " faz", duration: 0.28, begin: 182.0, index: 597 },
    { text: "la", duration: 0.28, begin: 182.2, index: 598 },
    { text: "sı", duration: 0.28, begin: 182.4, index: 599 },
    { text: "na", duration: 0.28, begin: 182.6, index: 600 },
    { text: " çık", duration: 0.28, begin: 182.8, index: 601 },
    { text: 'tı."', duration: 0.28, begin: 183.0, index: 602 },
    { text: " Tar", duration: 0.28, begin: 184.6, index: 603 },
    { text: "tış", duration: 0.28, begin: 184.8, index: 604 },
    { text: "ma", duration: 0.28, begin: 185.0, index: 605 },
    { text: "yı", duration: 0.28, begin: 185.2, index: 606 },
    { text: " nok", duration: 0.28, begin: 185.4, index: 607 },
    { text: "ta", duration: 0.28, begin: 185.6, index: 608 },
    { text: "la", duration: 0.28, begin: 185.8, index: 609 },
    { text: "dı", duration: 0.28, begin: 186.0, index: 610 },
    { text: "ğı", duration: 0.28, begin: 186.2, index: 611 },
    { text: "nı", duration: 0.28, begin: 186.4, index: 612 },
    { text: " dü", duration: 0.28, begin: 186.6, index: 613 },
    { text: "şü", duration: 0.28, begin: 186.8, index: 614 },
    { text: "yor", duration: 0.28, begin: 187.0, index: 615 },
    { text: "du.", duration: 0.28, begin: 187.2, index: 616 },
    { text: " Ar", duration: 0.28, begin: 188.4, index: 617 },
    { text: "tık", duration: 0.28, begin: 188.6, index: 618 },
    { text: " bu", duration: 0.28, begin: 188.8, index: 619 },
    { text: " ih", duration: 0.28, begin: 189.0, index: 620 },
    { text: "ti", duration: 0.28, begin: 189.2, index: 621 },
    { text: "yar", duration: 0.28, begin: 189.4, index: 622 },
    { text: " bu", duration: 0.28, begin: 189.6, index: 623 },
    { text: "nak", duration: 0.28, begin: 189.8, index: 624 },
    { text: "tan", duration: 0.28, begin: 190.0, index: 625 },
    { text: " kur", duration: 0.28, begin: 190.6, index: 626 },
    { text: "tu", duration: 0.28, begin: 190.8, index: 627 },
    { text: "la", duration: 0.28, begin: 191.0, index: 628 },
    { text: "bi", duration: 0.28, begin: 191.2, index: 629 },
    { text: "lir", duration: 0.28, begin: 191.4, index: 630 },
    { text: "di.", duration: 0.28, begin: 191.6, index: 631 },
    { text: " Yaş", duration: 0.28, begin: 192.8, index: 632 },
    { text: "lı", duration: 0.28, begin: 193.0, index: 633 },
    { text: " ka", duration: 0.28, begin: 193.2, index: 634 },
    { text: "dın", duration: 0.28, begin: 193.4, index: 635 },
    { text: " ses", duration: 0.28, begin: 193.6, index: 636 },
    { text: "siz", duration: 0.28, begin: 193.8, index: 637 },
    { text: "ce", duration: 0.28, begin: 194.0, index: 638 },
    { text: " ko", duration: 0.28, begin: 194.6, index: 639 },
    { text: "ca", duration: 0.28, begin: 194.8, index: 640 },
    { text: "sı", duration: 0.28, begin: 195.0, index: 641 },
    { text: "na", duration: 0.28, begin: 195.2, index: 642 },
    { text: " dön", duration: 0.28, begin: 195.4, index: 643 },
    { text: "dü:", duration: 0.28, begin: 195.6, index: 644 },
    { text: ' "Ü', duration: 0.28, begin: 196.6, index: 645 },
    { text: "ni", duration: 0.28, begin: 196.8, index: 646 },
    { text: "ver", duration: 0.28, begin: 197.0, index: 647 },
    { text: "si", duration: 0.28, begin: 197.2, index: 648 },
    { text: "te", duration: 0.28, begin: 197.4, index: 649 },
    { text: " in", duration: 0.28, begin: 197.6, index: 650 },
    { text: "şaa", duration: 0.28, begin: 197.8, index: 651 },
    { text: "tı", duration: 0.28, begin: 198.0, index: 652 },
    { text: "na", duration: 0.28, begin: 198.2, index: 653 },
    { text: " baş", duration: 0.28, begin: 198.6, index: 654 },
    { text: "la", duration: 0.28, begin: 198.8, index: 655 },
    { text: "mak", duration: 0.28, begin: 199.0, index: 656 },
    { text: " i", duration: 0.28, begin: 199.2, index: 657 },
    { text: "çin", duration: 0.28, begin: 199.4, index: 658 },
    { text: " ge", duration: 0.28, begin: 200.2, index: 659 },
    { text: "re", duration: 0.28, begin: 200.4, index: 660 },
    { text: "ken", duration: 0.28, begin: 200.6, index: 661 },
    { text: " pa", duration: 0.28, begin: 200.8, index: 662 },
    { text: "ra", duration: 0.28, begin: 201.0, index: 663 },
    { text: " bu", duration: 0.28, begin: 201.2, index: 664 },
    { text: " muy", duration: 0.28, begin: 201.4, index: 665 },
    { text: "muş?", duration: 0.28, begin: 201.6, index: 666 },
    { text: " Pe", duration: 0.28, begin: 203.0, index: 667 },
    { text: "ki,", duration: 0.28, begin: 203.2, index: 668 },
    { text: " ni", duration: 0.28, begin: 204.0, index: 669 },
    { text: "çin", duration: 0.28, begin: 204.2, index: 670 },
    { text: " biz", duration: 0.28, begin: 204.4, index: 671 },
    { text: " ken", duration: 0.28, begin: 204.8, index: 672 },
    { text: "di", duration: 0.28, begin: 205.0, index: 673 },
    { text: " ü", duration: 0.28, begin: 205.4, index: 674 },
    { text: "ni", duration: 0.28, begin: 205.6, index: 675 },
    { text: "ver", duration: 0.28, begin: 205.8, index: 676 },
    { text: "si", duration: 0.28, begin: 206.0, index: 677 },
    { text: "te", duration: 0.28, begin: 206.2, index: 678 },
    { text: "mi", duration: 0.28, begin: 206.4, index: 679 },
    { text: "zi", duration: 0.28, begin: 206.6, index: 680 },
    { text: " kur", duration: 0.28, begin: 206.8, index: 681 },
    { text: "mu", duration: 0.28, begin: 207.0, index: 682 },
    { text: "yo", duration: 0.28, begin: 207.2, index: 683 },
    { text: 'ruz?"', duration: 0.28, begin: 207.4, index: 684 },
    { text: " Rek", duration: 0.28, begin: 208.6, index: 685 },
    { text: "tö", duration: 0.28, begin: 208.8, index: 686 },
    { text: "rün", duration: 0.28, begin: 209.0, index: 687 },
    { text: " yü", duration: 0.28, begin: 209.4, index: 688 },
    { text: "zü", duration: 0.28, begin: 209.6, index: 689 },
    { text: " kar", duration: 0.28, begin: 209.8, index: 690 },
    { text: "ma", duration: 0.28, begin: 210.0, index: 691 },
    { text: " ka", duration: 0.28, begin: 210.2, index: 692 },
    { text: "rı", duration: 0.28, begin: 210.4, index: 693 },
    { text: "şık", duration: 0.28, begin: 210.6, index: 694 },
    { text: "tı.", duration: 0.28, begin: 210.8, index: 695 },
    { text: " Yaş", duration: 0.28, begin: 211.8, index: 696 },
    { text: "lı", duration: 0.28, begin: 212.0, index: 697 },
    { text: " a", duration: 0.28, begin: 212.2, index: 698 },
    { text: "dam", duration: 0.28, begin: 212.4, index: 699 },
    { text: " ba", duration: 0.28, begin: 213.0, index: 700 },
    { text: "şıy", duration: 0.28, begin: 213.2, index: 701 },
    { text: "la", duration: 0.28, begin: 213.4, index: 702 },
    { text: " o", duration: 0.28, begin: 213.6, index: 703 },
    { text: "nay", duration: 0.28, begin: 213.8, index: 704 },
    { text: "la", duration: 0.28, begin: 214.0, index: 705 },
    { text: "dı.", duration: 0.28, begin: 214.2, index: 706 },
    { text: " Bay", duration: 0.28, begin: 215.4, index: 707 },
    { text: " ve", duration: 0.28, begin: 215.6, index: 708 },
    { text: " Ba", duration: 0.28, begin: 215.8, index: 709 },
    { text: "yan", duration: 0.28, begin: 216.0, index: 710 },
    { text: " Le", duration: 0.28, begin: 216.4, index: 711 },
    { text: "land", duration: 0.28, begin: 216.6, index: 712 },
    { text: " Stan", duration: 0.28, begin: 217.0, index: 713 },
    { text: "ford", duration: 0.28, begin: 217.2, index: 714 },
    { text: " dı", duration: 0.28, begin: 218.0, index: 715 },
    { text: "şa", duration: 0.28, begin: 218.2, index: 716 },
    { text: "rı", duration: 0.28, begin: 218.4, index: 717 },
    { text: " çık", duration: 0.28, begin: 218.6, index: 718 },
    { text: "tı", duration: 0.28, begin: 218.8, index: 719 },
    { text: "lar.", duration: 0.28, begin: 219.0, index: 720 },
    { text: " Ve", duration: 0.28, begin: 220.0, index: 721 },
    { text: " Har", duration: 0.28, begin: 220.2, index: 722 },
    { text: "ward'", duration: 0.28, begin: 220.4, index: 723 },
    { text: "ın", duration: 0.28, begin: 220.6, index: 724 },
    { text: " u", duration: 0.1, begin: 221.2, index: 725 },
    { text: "mur", duration: 0.1, begin: 221.4, index: 726 },
    { text: "sa", duration: 0.1, begin: 221.6, index: 727 },
    { text: "ma", duration: 0.1, begin: 221.8, index: 728 },
    { text: "dı", duration: 0.1, begin: 222.0, index: 729 },
    { text: "ğı", duration: 0.1, begin: 222.2, index: 730 },
    { text: " o", duration: 0.1, begin: 222.4, index: 731 },
    { text: "ğul", duration: 0.1, begin: 222.6, index: 732 },
    { text: "la", duration: 0.1, begin: 222.8, index: 733 },
    { text: "rı", duration: 0.1, begin: 223.0, index: 734 },
    { text: " i", duration: 0.1, begin: 223.2, index: 735 },
    { text: "çin", duration: 0.1, begin: 223.4, index: 736 },
    { text: " o", duration: 0.28, begin: 223.8, index: 737 },
    { text: "nun", duration: 0.28, begin: 224.0, index: 738 },
    { text: " a", duration: 0.28, begin: 224.2, index: 739 },
    { text: "dı", duration: 0.28, begin: 224.4, index: 740 },
    { text: "nı", duration: 0.28, begin: 224.6, index: 741 },
    { text: " e", duration: 0.28, begin: 225.0, index: 742 },
    { text: "be", duration: 0.28, begin: 225.2, index: 743 },
    { text: "di", duration: 0.28, begin: 225.4, index: 744 },
    { text: "yen", duration: 0.28, begin: 225.6, index: 745 },
    { text: " ya", duration: 0.28, begin: 225.8, index: 746 },
    { text: "şa", duration: 0.28, begin: 226.0, index: 747 },
    { text: "ta", duration: 0.28, begin: 226.2, index: 748 },
    { text: "cak", duration: 0.28, begin: 226.4, index: 749 },
    { text: " ü", duration: 0.28, begin: 226.8, index: 750 },
    { text: "ni", duration: 0.28, begin: 227.0, index: 751 },
    { text: "ver", duration: 0.28, begin: 227.2, index: 752 },
    { text: "si", duration: 0.28, begin: 227.4, index: 753 },
    { text: "te", duration: 0.28, begin: 227.6, index: 754 },
    { text: "yi", duration: 0.28, begin: 227.8, index: 755 },
    { text: " kur", duration: 0.28, begin: 228.0, index: 756 },
    { text: "du", duration: 0.28, begin: 228.2, index: 757 },
    { text: "lar.", duration: 0.28, begin: 228.4, index: 758 },
    { text: " A", duration: 0.28, begin: 229.4, index: 759 },
    { text: "me", duration: 0.28, begin: 229.6, index: 760 },
    { text: "ri", duration: 0.28, begin: 229.8, index: 761 },
    { text: "ka'", duration: 0.28, begin: 230.0, index: 762 },
    { text: "nın", duration: 0.28, begin: 230.2, index: 763 },
    { text: " en", duration: 0.28, begin: 230.6, index: 764 },
    { text: " ö", duration: 0.28, begin: 230.8, index: 765 },
    { text: "nem", duration: 0.28, begin: 231.0, index: 766 },
    { text: "li", duration: 0.28, begin: 231.2, index: 767 },
    { text: " ü", duration: 0.28, begin: 231.4, index: 768 },
    { text: "ni", duration: 0.28, begin: 231.6, index: 769 },
    { text: "ver", duration: 0.28, begin: 231.8, index: 770 },
    { text: "si", duration: 0.28, begin: 232.0, index: 771 },
    { text: "te", duration: 0.28, begin: 232.2, index: 772 },
    { text: "le", duration: 0.28, begin: 232.4, index: 773 },
    { text: "rin", duration: 0.28, begin: 232.6, index: 774 },
    { text: "den", duration: 0.28, begin: 232.8, index: 775 },
    { text: " bi", duration: 0.28, begin: 233.0, index: 776 },
    { text: "ri", duration: 0.28, begin: 233.2, index: 777 },
    { text: "si", duration: 0.28, begin: 233.4, index: 778 },
    { text: " o", duration: 0.28, begin: 233.6, index: 779 },
    { text: "lan", duration: 0.28, begin: 233.8, index: 780 },
    { text: " S", duration: 0.28, begin: 235.0, index: 781 },
    { text: "tan", duration: 0.28, begin: 235.2, index: 782 },
    { text: "ford'", duration: 0.28, begin: 235.4, index: 783 },
    { text: "u...", duration: 0.28, begin: 235.6, index: 784 },
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
                href="/dashboard/stories/bir-hayir-vardir"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/bagislamanin-yuceligi"
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
            src="/4-6.mp3"
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
