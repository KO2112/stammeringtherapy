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

  const textSegments: TextSegment[] = [
    { text: "", duration: 0.154, begin: 0.5, index: 0 },

    // Title
    {
      text: "Kır",
      duration: 0.53,
      begin: 0.5,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Zin",
      duration: 0.53,
      begin: 0.75,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "cir",
      duration: 0.53,
      begin: 1.0,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "le",
      duration: 0.53,
      begin: 1.25,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ri",
      duration: 0.53,
      begin: 1.5,
      index: 5,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ni",
      duration: 0.53,
      begin: 1.75,
      index: 6,
      isTitle: true,
      isCenter: true,
    },

    // First paragraph
    { text: "Bey", duration: 0.53, begin: 3.25, index: 7 },
    { text: "ni", duration: 0.53, begin: 3.5, index: 8 },
    { text: "miz", duration: 0.53, begin: 3.75, index: 9 },
    { text: " tek", duration: 0.53, begin: 4.0, index: 10 },
    { text: "rar", duration: 0.53, begin: 4.25, index: 11 },
    { text: "lar", duration: 0.53, begin: 4.5, index: 12 },
    { text: "la", duration: 0.53, begin: 4.75, index: 13 },
    { text: " öğ", duration: 0.53, begin: 5.5, index: 14 },
    { text: "re", duration: 0.53, begin: 5.75, index: 15 },
    { text: "nir", duration: 0.53, begin: 6.0, index: 16 },
    { text: " ve", duration: 0.53, begin: 6.5, index: 17 },
    { text: " a", duration: 0.53, begin: 7.25, index: 18 },
    { text: "lış", duration: 0.53, begin: 7.5, index: 19 },
    { text: "kan", duration: 0.53, begin: 7.75, index: 20 },
    { text: "lık", duration: 0.53, begin: 8.0, index: 21 },
    { text: "la", duration: 0.53, begin: 8.25, index: 22 },
    { text: "rı", duration: 0.53, begin: 8.5, index: 23 },
    { text: "na", duration: 0.53, begin: 8.75, index: 24 },
    { text: " çe", duration: 0.53, begin: 9.75, index: 25 },
    { text: "lik", duration: 0.53, begin: 10.0, index: 26 },
    { text: " ha", duration: 0.53, begin: 10.25, index: 27 },
    { text: "lat", duration: 0.53, begin: 10.5, index: 28 },
    { text: "lar", duration: 0.53, begin: 10.75, index: 29 },
    { text: "la", duration: 0.53, begin: 11.0, index: 30 },
    { text: " bağ", duration: 0.53, begin: 11.5, index: 31 },
    { text: "la", duration: 0.53, begin: 11.75, index: 32 },
    { text: "nır.", duration: 0.53, begin: 12.0, index: 33 },
    { text: " O", duration: 0.53, begin: 13.5, index: 34 },
    { text: "lum", duration: 0.53, begin: 13.75, index: 35 },
    { text: "suz", duration: 0.53, begin: 14.0, index: 36 },
    { text: " tec", duration: 0.53, begin: 14.25, index: 37 },
    { text: "rü", duration: 0.53, begin: 14.5, index: 38 },
    { text: "be", duration: 0.53, begin: 14.75, index: 39 },
    { text: "le", duration: 0.53, begin: 15.0, index: 40 },
    { text: "rin ", duration: 0.53, begin: 15.25, index: 41 },
    { text: "tek", duration: 0.53, begin: 15.75, index: 42 },
    { text: "ra", duration: 0.53, begin: 16.0, index: 43 },
    { text: "rı", duration: 0.53, begin: 16.25, index: 44 },
    { text: " bir", duration: 0.53, begin: 17.25, index: 45 },
    { text: " sü", duration: 0.53, begin: 17.5, index: 46 },
    { text: "re", duration: 0.53, begin: 17.75, index: 47 },
    { text: " son", duration: 0.53, begin: 18.25, index: 48 },
    { text: "ra", duration: 0.53, begin: 18.5, index: 49 },
    { text: " ça", duration: 0.53, begin: 19.75, index: 50 },
    { text: "re", duration: 0.53, begin: 20.0, index: 51 },
    { text: "siz", duration: 0.53, begin: 20.25, index: 52 },
    { text: "li", duration: 0.53, begin: 20.5, index: 53 },
    { text: "ği", duration: 0.53, begin: 20.75, index: 54 },
    { text: " öğ", duration: 0.53, begin: 21.25, index: 55 },
    { text: "ren", duration: 0.53, begin: 21.5, index: 56 },
    { text: "me", duration: 0.53, begin: 21.75, index: 57 },
    { text: "miz", duration: 0.53, begin: 22.0, index: 58 },
    { text: " an", duration: 0.53, begin: 22.25, index: 59 },
    { text: "la", duration: 0.53, begin: 22.5, index: 60 },
    { text: "mı", duration: 0.53, begin: 22.75, index: 61 },
    { text: "na", duration: 0.53, begin: 23.0, index: 62 },
    { text: " ge", duration: 0.53, begin: 23.25, index: 63 },
    { text: "lir.", duration: 0.53, begin: 23.5, index: 64 },
    { text: " Ko", duration: 0.53, begin: 25.25, index: 65 },
    { text: "şul", duration: 0.53, begin: 25.5, index: 66 },
    { text: "la", duration: 0.53, begin: 25.75, index: 67 },
    { text: "rın", duration: 0.53, begin: 26.0, index: 68 },
    { text: " de", duration: 0.53, begin: 26.25, index: 69 },
    { text: "ğiş", duration: 0.53, begin: 26.5, index: 70 },
    { text: "me", duration: 0.53, begin: 26.75, index: 71 },
    { text: "si", duration: 0.53, begin: 27.0, index: 72 },
    { text: "ne", duration: 0.53, begin: 27.25, index: 73 },
    { text: " rağ", duration: 0.53, begin: 27.75, index: 74 },
    { text: "men", duration: 0.53, begin: 28.0, index: 75 },
    { text: " ne", duration: 0.53, begin: 29.25, index: 76 },
    { text: " ya", duration: 0.53, begin: 29.5, index: 77 },
    { text: "par", duration: 0.53, begin: 29.75, index: 78 },
    { text: "sak", duration: 0.53, begin: 30.0, index: 79 },
    { text: " ya", duration: 0.53, begin: 30.25, index: 80 },
    { text: "pa", duration: 0.53, begin: 30.5, index: 81 },
    { text: "lım", duration: 0.53, begin: 30.75, index: 82 },
    { text: " so", duration: 0.53, begin: 31.75, index: 83 },
    { text: "nu", duration: 0.53, begin: 32.0, index: 84 },
    { text: "cun", duration: 0.53, begin: 32.25, index: 85 },
    { text: " de", duration: 0.53, begin: 32.5, index: 86 },
    { text: "ğiş", duration: 0.53, begin: 32.75, index: 87 },
    { text: "me", duration: 0.53, begin: 33.0, index: 88 },
    { text: "ye", duration: 0.53, begin: 33.25, index: 89 },
    { text: "ce", duration: 0.53, begin: 33.5, index: 90 },
    { text: "ği", duration: 0.53, begin: 33.75, index: 91 },
    { text: "ne", duration: 0.53, begin: 34.0, index: 92 },
    { text: " i", duration: 0.53, begin: 34.25, index: 93 },
    { text: "na", duration: 0.53, begin: 34.5, index: 94 },
    { text: "nı", duration: 0.53, begin: 34.75, index: 95 },
    { text: "rız.", duration: 0.53, begin: 35.0, index: 96 },
    { text: " El", duration: 0.53, begin: 36.5, index: 97 },
    { text: "li", duration: 0.53, begin: 36.75, index: 98 },
    { text: " san", duration: 0.53, begin: 37.0, index: 99 },
    { text: "ti", duration: 0.53, begin: 37.25, index: 100 },
    { text: "met", duration: 0.53, begin: 37.5, index: 101 },
    { text: "re", duration: 0.53, begin: 37.75, index: 102 },
    { text: " sıç", duration: 0.53, begin: 38.25, index: 103 },
    { text: "ra", duration: 0.53, begin: 38.5, index: 104 },
    { text: "yan", duration: 0.53, begin: 38.75, index: 105 },
    { text: " pi", duration: 0.53, begin: 39.25, index: 106 },
    { text: "re", duration: 0.53, begin: 39.5, index: 107 },
    { text: "le", duration: 0.53, begin: 39.75, index: 108 },
    { text: "ri,", duration: 0.53, begin: 40.0, index: 109 },
    { text: " gün", duration: 0.53, begin: 41.25, index: 110 },
    { text: "ler", duration: 0.53, begin: 41.5, index: 111 },
    { text: "ce", duration: 0.53, begin: 41.75, index: 112 },
    { text: " üs", duration: 0.53, begin: 43.0, index: 113 },
    { text: "tü", duration: 0.53, begin: 43.25, index: 114 },
    { text: " ka", duration: 0.53, begin: 43.5, index: 115 },
    { text: "pa", duration: 0.53, begin: 43.75, index: 116 },
    { text: "lı", duration: 0.53, begin: 44.0, index: 117 },
    { text: " yir", duration: 0.53, begin: 45.25, index: 118 },
    { text: "mi", duration: 0.53, begin: 45.5, index: 119 },
    { text: " do", duration: 0.53, begin: 45.75, index: 120 },
    { text: "kuz", duration: 0.53, begin: 46.0, index: 121 },
    { text: " san", duration: 0.53, begin: 46.25, index: 122 },
    { text: "ti", duration: 0.53, begin: 46.5, index: 123 },
    { text: "met", duration: 0.53, begin: 46.75, index: 124 },
    { text: "re", duration: 0.53, begin: 47.0, index: 125 },
    { text: " yük", duration: 0.53, begin: 47.5, index: 126 },
    { text: "sek", duration: 0.53, begin: 47.75, index: 127 },
    { text: "li", duration: 0.53, begin: 48.0, index: 128 },
    { text: "ğin", duration: 0.53, begin: 48.25, index: 129 },
    { text: "de", duration: 0.53, begin: 48.5, index: 130 },
    { text: " bir", duration: 0.53, begin: 49.75, index: 131 },
    { text: " ka", duration: 0.53, begin: 50.0, index: 132 },
    { text: "va", duration: 0.53, begin: 50.25, index: 133 },
    { text: "noz", duration: 0.53, begin: 50.5, index: 134 },
    { text: "da", duration: 0.53, begin: 50.75, index: 135 },
    { text: " tut", duration: 0.53, begin: 51.25, index: 136 },
    { text: "muş", duration: 0.53, begin: 51.5, index: 137 },
    { text: "lar.", duration: 0.53, begin: 51.75, index: 138 },
    { text: " Da", duration: 0.53, begin: 53.25, index: 139 },
    { text: "ha", duration: 0.53, begin: 53.5, index: 140 },
    { text: " son", duration: 0.53, begin: 53.75, index: 141 },
    { text: "ra", duration: 0.53, begin: 54.0, index: 142 },
    { text: " ka", duration: 0.53, begin: 55.0, index: 143 },
    { text: "pa", duration: 0.53, begin: 55.25, index: 144 },
    { text: "ğı", duration: 0.53, begin: 55.5, index: 145 },
    { text: " aç", duration: 0.68, begin: 56.0, index: 146 },
    { text: "mış", duration: 0.68, begin: 56.25, index: 147 },
    { text: "lar", duration: 0.68, begin: 56.5, index: 148 },
    { text: " ve", duration: 0.68, begin: 57.0, index: 149 },
    { text: " pi", duration: 0.53, begin: 58.0, index: 150 },
    { text: "re", duration: 0.53, begin: 58.25, index: 151 },
    { text: "le", duration: 0.53, begin: 58.5, index: 152 },
    { text: "rin", duration: 0.53, begin: 58.75, index: 153 },
    { text: " en", duration: 0.53, begin: 60.0, index: 154 },
    { text: "faz", duration: 0.53, begin: 60.25, index: 155 },
    { text: "la", duration: 0.53, begin: 60.5, index: 156 },
    { text: " yir", duration: 0.53, begin: 61.5, index: 157 },
    { text: "mi", duration: 0.53, begin: 61.75, index: 158 },
    { text: " do", duration: 0.53, begin: 62.0, index: 159 },
    { text: "kuz", duration: 0.53, begin: 62.25, index: 160 },
    { text: " san", duration: 0.53, begin: 62.75, index: 161 },
    { text: "ti", duration: 0.53, begin: 63.0, index: 162 },
    { text: "met", duration: 0.53, begin: 63.25, index: 163 },
    { text: "re", duration: 0.53, begin: 63.5, index: 164 },
    { text: " sıç", duration: 0.53, begin: 64.0, index: 165 },
    { text: "ra", duration: 0.53, begin: 64.25, index: 166 },
    { text: "ya", duration: 0.53, begin: 64.5, index: 167 },
    { text: "bil", duration: 0.53, begin: 64.75, index: 168 },
    { text: "dik", duration: 0.53, begin: 65.0, index: 169 },
    { text: "le", duration: 0.53, begin: 65.25, index: 170 },
    { text: "ri", duration: 0.53, begin: 65.5, index: 171 },
    { text: "ni", duration: 0.53, begin: 65.75, index: 172 },
    { text: " gör", duration: 0.53, begin: 67.0, index: 173 },
    { text: "müş", duration: 0.53, begin: 67.25, index: 174 },
    { text: "ler.", duration: 0.53, begin: 67.5, index: 175 },
    { text: " Ka", duration: 0.53, begin: 69.0, index: 176 },
    { text: "pa", duration: 0.53, begin: 69.25, index: 177 },
    { text: "lı", duration: 0.53, begin: 69.5, index: 178 },
    { text: " ka", duration: 0.53, begin: 69.75, index: 179 },
    { text: "pak", duration: 0.53, begin: 70.0, index: 180 },
    { text: " on", duration: 0.53, begin: 70.25, index: 181 },
    { text: "la", duration: 0.53, begin: 70.5, index: 182 },
    { text: "ra", duration: 0.53, begin: 70.75, index: 183 },
    { text: " en", duration: 0.53, begin: 72.25, index: 184 },
    { text: "faz", duration: 0.53, begin: 72.5, index: 185 },
    { text: "la", duration: 0.53, begin: 72.75, index: 186 },
    { text: " yir", duration: 0.68, begin: 73.75, index: 187 },
    { text: "mi", duration: 0.68, begin: 74.0, index: 188 },
    { text: " do", duration: 0.68, begin: 74.25, index: 189 },
    { text: "kuz", duration: 0.68, begin: 74.5, index: 190 },
    { text: " san", duration: 0.53, begin: 75.25, index: 191 },
    { text: "ti", duration: 0.53, begin: 75.5, index: 192 },
    { text: "met", duration: 0.53, begin: 75.75, index: 193 },
    { text: "re", duration: 0.53, begin: 76.0, index: 194 },
    { text: " sıç", duration: 0.53, begin: 76.25, index: 195 },
    { text: "ra", duration: 0.53, begin: 76.5, index: 196 },
    { text: "ya", duration: 0.53, begin: 76.75, index: 197 },
    { text: "bi", duration: 0.53, begin: 77.0, index: 198 },
    { text: "le", duration: 0.53, begin: 77.25, index: 199 },
    { text: "cek", duration: 0.53, begin: 77.5, index: 200 },
    { text: "le", duration: 0.53, begin: 77.75, index: 201 },
    { text: "ri", duration: 0.53, begin: 78.0, index: 202 },
    { text: "ni", duration: 0.53, begin: 78.25, index: 203 },
    { text: " öğ", duration: 0.53, begin: 79.0, index: 204 },
    { text: "ret", duration: 0.53, begin: 79.25, index: 205 },
    { text: "miş.", duration: 0.53, begin: 79.5, index: 206 },
    { text: " Sirk", duration: 0.68, begin: 81.5, index: 207 },
    { text: "ler", duration: 0.68, begin: 81.75, index: 208 },
    { text: " de", duration: 0.68, begin: 82.0, index: 209 },
    { text: " yav", duration: 0.68, begin: 82.25, index: 210 },
    { text: "ru", duration: 0.68, begin: 82.5, index: 211 },
    { text: " fil", duration: 0.68, begin: 82.75, index: 212 },
    { text: "le", duration: 0.68, begin: 83.0, index: 213 },
    { text: "ri", duration: 0.68, begin: 83.25, index: 214 },
    { text: " a", duration: 0.38, begin: 84.75, index: 215 },
    { text: "yak", duration: 0.38, begin: 85.0, index: 216 },
    { text: "la", duration: 0.38, begin: 85.25, index: 217 },
    { text: "rın", duration: 0.38, begin: 85.5, index: 218 },
    { text: "dan", duration: 0.38, begin: 85.75, index: 219 },
    { text: " bağ", duration: 0.53, begin: 86.25, index: 220 },
    { text: "lar", duration: 0.53, begin: 86.5, index: 221 },
    { text: "lar.", duration: 0.53, begin: 86.75, index: 222 },
    { text: " Fil", duration: 0.53, begin: 88.5, index: 223 },
    { text: "u", duration: 0.53, begin: 89.25, index: 224 },
    { text: "zun", duration: 0.53, begin: 89.5, index: 225 },
    { text: " sü", duration: 0.53, begin: 89.75, index: 226 },
    { text: "re", duration: 0.53, begin: 90.0, index: 227 },
    { text: " a", duration: 0.28, begin: 91.25, index: 228 },
    { text: "yak", duration: 0.28, begin: 91.5, index: 229 },
    { text: "la", duration: 0.28, begin: 91.75, index: 230 },
    { text: "rın", duration: 0.28, begin: 92.0, index: 231 },
    { text: "da", duration: 0.28, begin: 92.25, index: 232 },
    { text: "ki", duration: 0.28, begin: 92.5, index: 233 },
    { text: " zin", duration: 0.53, begin: 92.75, index: 234 },
    { text: "cir", duration: 0.53, begin: 93.0, index: 235 },
    { text: "den", duration: 0.53, begin: 93.25, index: 236 },
    { text: " kur", duration: 0.28, begin: 94.5, index: 237 },
    { text: "tul", duration: 0.28, begin: 94.75, index: 238 },
    { text: "ma", duration: 0.28, begin: 95.0, index: 239 },
    { text: "ya", duration: 0.28, begin: 95.25, index: 240 },
    { text: " ça", duration: 0.28, begin: 95.5, index: 241 },
    { text: "lı", duration: 0.28, begin: 95.75, index: 242 },
    { text: "şır", duration: 0.28, begin: 96.0, index: 243 },
    { text: " a", duration: 0.28, begin: 96.75, index: 244 },
    { text: "ma", duration: 0.28, begin: 97.0, index: 245 },
    { text: " ba", duration: 0.28, begin: 97.25, index: 246 },
    { text: "şa", duration: 0.28, begin: 97.5, index: 247 },
    { text: "ra", duration: 0.28, begin: 97.75, index: 248 },
    { text: "maz.", duration: 0.28, begin: 98.0, index: 249 },
    { text: " Yıl", duration: 0.28, begin: 99.25, index: 250 },
    { text: "lar", duration: 0.28, begin: 99.5, index: 251 },
    { text: " ge", duration: 0.28, begin: 100.0, index: 252 },
    { text: "çip", duration: 0.28, begin: 100.25, index: 253 },
    { text: " dört", duration: 0.28, begin: 101.25, index: 254 },
    { text: " ton", duration: 0.28, begin: 101.75, index: 255 },
    { text: "luk", duration: 0.28, begin: 102.0, index: 256 },
    { text: " bir", duration: 0.28, begin: 102.5, index: 257 },
    { text: " dev", duration: 0.28, begin: 102.75, index: 258 },
    { text: " ha", duration: 0.28, begin: 103.25, index: 259 },
    { text: "li", duration: 0.28, begin: 103.5, index: 260 },
    { text: "ne", duration: 0.28, begin: 103.75, index: 261 },
    { text: " gel", duration: 0.28, begin: 104.25, index: 262 },
    { text: "di", duration: 0.28, begin: 104.5, index: 263 },
    { text: "ğin", duration: 0.28, begin: 104.75, index: 264 },
    { text: "de", duration: 0.28, begin: 105.0, index: 265 },
    { text: " ya", duration: 0.28, begin: 106.0, index: 266 },
    { text: "pa", duration: 0.28, begin: 106.25, index: 267 },
    { text: "ca", duration: 0.28, begin: 106.5, index: 268 },
    { text: "ğı", duration: 0.28, begin: 106.75, index: 269 },
    { text: " kü", duration: 0.38, begin: 107.0, index: 270 },
    { text: "çük", duration: 0.38, begin: 107.25, index: 271 },
    { text: " bir", duration: 0.38, begin: 107.5, index: 272 },
    { text: " ham", duration: 0.53, begin: 107.75, index: 273 },
    { text: "le", duration: 0.53, begin: 108.0, index: 274 },
    { text: "i", duration: 0.53, begin: 108.25, index: 275 },
    { text: "le", duration: 0.53, begin: 108.5, index: 276 },
    { text: " par", duration: 0.53, begin: 109.75, index: 277 },
    { text: "ça", duration: 0.53, begin: 110.0, index: 278 },
    { text: "la", duration: 0.53, begin: 110.25, index: 279 },
    { text: "ya", duration: 0.53, begin: 110.5, index: 280 },
    { text: "ca", duration: 0.53, begin: 110.75, index: 281 },
    { text: "ğı", duration: 0.53, begin: 111.0, index: 282 },
    { text: " zin", duration: 0.53, begin: 111.5, index: 283 },
    { text: "ci", duration: 0.53, begin: 111.75, index: 284 },
    { text: "rin", duration: 0.53, begin: 112.0, index: 285 },
    { text: "den", duration: 0.53, begin: 112.25, index: 286 },
    { text: " kur", duration: 0.53, begin: 113.25, index: 287 },
    { text: "tul", duration: 0.53, begin: 113.5, index: 288 },
    { text: "ma", duration: 0.53, begin: 113.75, index: 289 },
    { text: "yı", duration: 0.53, begin: 114.0, index: 290 },
    { text: " de", duration: 0.53, begin: 114.5, index: 291 },
    { text: "ne", duration: 0.53, begin: 114.75, index: 292 },
    { text: "mez", duration: 0.53, begin: 115.0, index: 293 },
    { text: " bi", duration: 0.53, begin: 115.25, index: 294 },
    { text: "le.", duration: 0.53, begin: 115.5, index: 295 },
    { text: " Geç", duration: 0.53, begin: 117.0, index: 296 },
    { text: "miş", duration: 0.53, begin: 117.25, index: 297 },
    { text: " o", duration: 0.53, begin: 118.0, index: 298 },
    { text: "lum", duration: 0.53, begin: 118.25, index: 299 },
    { text: "suz", duration: 0.53, begin: 118.5, index: 300 },
    { text: " de", duration: 0.53, begin: 119.0, index: 301 },
    { text: "ne", duration: 0.53, begin: 119.25, index: 302 },
    { text: "yim", duration: 0.53, begin: 119.5, index: 303 },
    { text: "le", duration: 0.53, begin: 119.75, index: 304 },
    { text: "ri", duration: 0.53, begin: 120.0, index: 305 },
    { text: " o", duration: 0.53, begin: 121.0, index: 306 },
    { text: "na", duration: 0.53, begin: 121.25, index: 307 },
    { text: " bu", duration: 0.53, begin: 121.5, index: 308 },
    { text: "nu", duration: 0.53, begin: 121.75, index: 309 },
    { text: " ya", duration: 0.38, begin: 122.0, index: 310 },
    { text: "pa", duration: 0.38, begin: 122.25, index: 311 },
    { text: "ma", duration: 0.38, begin: 122.5, index: 312 },
    { text: "ya", duration: 0.38, begin: 122.75, index: 313 },
    { text: "ca", duration: 0.38, begin: 123.0, index: 314 },
    { text: "ğı", duration: 0.38, begin: 123.25, index: 315 },
    { text: "nı", duration: 0.38, begin: 123.5, index: 316 },
    { text: " söy", duration: 0.53, begin: 123.75, index: 317 },
    { text: "le", duration: 0.53, begin: 124.0, index: 318 },
    { text: "mek", duration: 0.53, begin: 124.25, index: 319 },
    { text: "te", duration: 0.53, begin: 124.5, index: 320 },
    { text: "dir.", duration: 0.53, begin: 124.75, index: 321 },
    { text: " Ko", duration: 0.53, begin: 126.25, index: 322 },
    { text: "nuş", duration: 0.53, begin: 126.5, index: 323 },
    { text: "ma", duration: 0.53, begin: 126.75, index: 324 },
    { text: " a", duration: 0.38, begin: 127.0, index: 325 },
    { text: "kı", duration: 0.38, begin: 127.25, index: 326 },
    { text: "cı", duration: 0.38, begin: 127.5, index: 327 },
    { text: "lı", duration: 0.38, begin: 127.75, index: 328 },
    { text: "ğı", duration: 0.38, begin: 128.0, index: 329 },
    { text: " prob", duration: 0.53, begin: 128.25, index: 330 },
    { text: "le", duration: 0.53, begin: 128.5, index: 331 },
    { text: "mi", duration: 0.53, begin: 128.75, index: 332 },
    { text: " ya", duration: 0.53, begin: 129.0, index: 333 },
    { text: "şa", duration: 0.53, begin: 129.25, index: 334 },
    { text: "yan", duration: 0.53, begin: 129.5, index: 335 },
    { text: " biz", duration: 0.53, begin: 130.75, index: 336 },
    { text: "ler", duration: 0.53, begin: 131.0, index: 337 },
    { text: " de", duration: 0.53, begin: 131.25, index: 338 },
    { text: " ay", duration: 0.53, begin: 132.25, index: 339 },
    { text: "nı", duration: 0.53, begin: 132.5, index: 340 },
    { text: " du", duration: 0.53, begin: 132.75, index: 341 },
    { text: "rum", duration: 0.53, begin: 133.0, index: 342 },
    { text: "da", duration: 0.53, begin: 133.25, index: 343 },
    { text: " de", duration: 0.53, begin: 133.5, index: 344 },
    { text: "ğil", duration: 0.53, begin: 133.75, index: 345 },
    { text: " mi", duration: 0.53, begin: 134.0, index: 346 },
    { text: "yiz?", duration: 0.53, begin: 134.25, index: 347 },
    { text: " Yıl", duration: 0.53, begin: 136.0, index: 348 },
    { text: "lar", duration: 0.53, begin: 136.25, index: 349 },
    { text: "ca", duration: 0.53, begin: 136.5, index: 350 },
    { text: " a", duration: 0.38, begin: 137.5, index: 351 },
    { text: "kı", duration: 0.38, begin: 137.75, index: 352 },
    { text: "cı", duration: 0.38, begin: 138.0, index: 353 },
    { text: " ko", duration: 0.38, begin: 138.25, index: 354 },
    { text: "nu", duration: 0.38, begin: 138.5, index: 355 },
    { text: "şa", duration: 0.38, begin: 138.75, index: 356 },
    { text: "ma", duration: 0.38, begin: 139.0, index: 357 },
    { text: "ma", duration: 0.38, begin: 139.25, index: 358 },
    { text: "yı", duration: 0.38, begin: 139.5, index: 359 },
    { text: " öğ", duration: 0.38, begin: 140.0, index: 360 },
    { text: "ren", duration: 0.38, begin: 140.25, index: 361 },
    { text: "dik", duration: 0.38, begin: 140.5, index: 362 },
    { text: " ve", duration: 0.38, begin: 141.5, index: 363 },
    { text: " as", duration: 0.53, begin: 141.75, index: 364 },
    { text: "la", duration: 0.53, begin: 142.0, index: 365 },
    { text: " a", duration: 0.3, begin: 143.0, index: 366 },
    { text: "kı", duration: 0.3, begin: 143.25, index: 367 },
    { text: "cı", duration: 0.3, begin: 143.5, index: 368 },
    { text: " ko", duration: 0.3, begin: 143.75, index: 369 },
    { text: "nu", duration: 0.3, begin: 144.0, index: 370 },
    { text: "şa", duration: 0.3, begin: 144.25, index: 371 },
    { text: "ma", duration: 0.3, begin: 144.5, index: 372 },
    { text: "ya", duration: 0.3, begin: 144.75, index: 373 },
    { text: "ca", duration: 0.3, begin: 145.0, index: 374 },
    { text: "ğı", duration: 0.3, begin: 145.25, index: 375 },
    { text: "mı", duration: 0.3, begin: 145.5, index: 376 },
    { text: "zı", duration: 0.3, begin: 145.75, index: 377 },
    { text: " ka", duration: 0.53, begin: 146.25, index: 378 },
    { text: "bul", duration: 0.53, begin: 146.5, index: 379 },
    { text: " et", duration: 0.53, begin: 146.75, index: 380 },
    { text: "tik.", duration: 0.53, begin: 147.0, index: 381 },
    { text: " A", duration: 0.53, begin: 148.5, index: 382 },
    { text: "ma", duration: 0.53, begin: 148.75, index: 383 },
    { text: " ar", duration: 0.48, begin: 149.75, index: 384 },
    { text: "tık", duration: 0.48, begin: 150.0, index: 385 },
    { text: " şart", duration: 0.48, begin: 150.25, index: 386 },
    { text: "lar", duration: 0.53, begin: 150.5, index: 387 },
    { text: " de", duration: 0.53, begin: 150.75, index: 388 },
    { text: "ğiş", duration: 0.53, begin: 151.0, index: 389 },
    { text: "ti.", duration: 0.53, begin: 151.25, index: 390 },
    { text: " Al", duration: 0.53, begin: 152.75, index: 391 },
    { text: "mış", duration: 0.53, begin: 153.0, index: 392 },
    { text: " ol", duration: 0.53, begin: 153.25, index: 393 },
    { text: "du", duration: 0.53, begin: 153.5, index: 394 },
    { text: "ğu", duration: 0.53, begin: 153.75, index: 395 },
    { text: "muz", duration: 0.53, begin: 154.0, index: 396 },
    { text: " e", duration: 0.53, begin: 155.25, index: 397 },
    { text: "ği", duration: 0.53, begin: 155.5, index: 398 },
    { text: "tim", duration: 0.53, begin: 155.75, index: 399 },
    { text: "ler", duration: 0.53, begin: 156.0, index: 400 },
    { text: " son", duration: 0.53, begin: 156.25, index: 401 },
    { text: "ras", duration: 0.53, begin: 156.5, index: 402 },
    { text: "ın", duration: 0.53, begin: 156.75, index: 403 },
    { text: "da", duration: 0.53, begin: 157.0, index: 404 },
    { text: " ar", duration: 0.53, begin: 158.5, index: 405 },
    { text: "tık", duration: 0.53, begin: 158.75, index: 406 },
    { text: " biz", duration: 0.53, begin: 159.0, index: 407 },
    { text: "ler", duration: 0.53, begin: 159.25, index: 408 },
    { text: " de", duration: 0.53, begin: 159.5, index: 409 },
    { text: " dev", duration: 0.53, begin: 161.0, index: 410 },
    { text: " bir", duration: 0.53, begin: 161.25, index: 411 },
    { text: " fil", duration: 0.53, begin: 161.5, index: 412 },
    { text: " ka", duration: 0.3, begin: 162.25, index: 413 },
    { text: "dar", duration: 0.3, begin: 162.5, index: 414 },
    { text: " güç", duration: 0.53, begin: 162.75, index: 415 },
    { text: "lü", duration: 0.53, begin: 163.0, index: 416 },
    { text: " ol", duration: 0.53, begin: 163.25, index: 417 },
    { text: "duk.", duration: 0.53, begin: 163.5, index: 418 },
    { text: " Tek", duration: 0.53, begin: 165.0, index: 419 },
    { text: " yap", duration: 0.53, begin: 165.25, index: 420 },
    { text: "ma", duration: 0.53, begin: 165.5, index: 421 },
    { text: "mız", duration: 0.53, begin: 165.75, index: 422 },
    { text: " ge", duration: 0.53, begin: 166.0, index: 423 },
    { text: "re", duration: 0.53, begin: 166.25, index: 424 },
    { text: "ken,", duration: 0.53, begin: 166.5, index: 425 },
    { text: " ce", duration: 0.53, begin: 167.5, index: 426 },
    { text: "sa", duration: 0.53, begin: 167.75, index: 427 },
    { text: "re", duration: 0.53, begin: 168.0, index: 428 },
    { text: "ti", duration: 0.53, begin: 168.25, index: 429 },
    { text: "mi", duration: 0.53, begin: 168.5, index: 430 },
    { text: "zi", duration: 0.53, begin: 168.75, index: 431 },
    { text: " to", duration: 0.53, begin: 169.0, index: 432 },
    { text: "par", duration: 0.53, begin: 169.25, index: 433 },
    { text: "la", duration: 0.53, begin: 169.5, index: 434 },
    { text: "yıp", duration: 0.53, begin: 169.75, index: 435 },
    { text: " ge", duration: 0.53, begin: 170.75, index: 436 },
    { text: "re", duration: 0.53, begin: 171.0, index: 437 },
    { text: "ken", duration: 0.53, begin: 171.25, index: 438 },
    { text: " ham", duration: 0.53, begin: 171.75, index: 439 },
    { text: "le", duration: 0.53, begin: 172.0, index: 440 },
    { text: "le", duration: 0.53, begin: 172.25, index: 441 },
    { text: "ri", duration: 0.53, begin: 172.5, index: 442 },
    { text: " yap", duration: 0.35, begin: 173.0, index: 443 },
    { text: "mak.", duration: 0.35, begin: 173.25, index: 444 },
    { text: " Hay", duration: 0.38, begin: 174.5, index: 445 },
    { text: "di", duration: 0.38, begin: 174.75, index: 446 },
    { text: " ham", duration: 0.48, begin: 175.5, index: 447 },
    { text: "le", duration: 0.48, begin: 175.75, index: 448 },
    { text: "ni", duration: 0.48, begin: 176.0, index: 449 },
    { text: " yap", duration: 0.48, begin: 176.25, index: 450 },
    { text: " ve", duration: 0.53, begin: 176.5, index: 451 },
    { text: " kır", duration: 0.53, begin: 177.5, index: 452 },
    { text: " zin", duration: 0.53, begin: 177.75, index: 453 },
    { text: "cir", duration: 0.53, begin: 178.0, index: 454 },
    { text: "le", duration: 0.53, begin: 178.25, index: 455 },
    { text: "ri", duration: 0.53, begin: 178.5, index: 456 },
    { text: "ni…", duration: 0.53, begin: 178.75, index: 457 },
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
                href="/dashboard/stories/bir-balikci-hikayesi"
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
            src="/1-1.mp3"
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
