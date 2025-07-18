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
    {
      text: "Sir",
      duration: 0.68,
      begin: 0.5,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "kin",
      duration: 0.68,
      begin: 0.75,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Ka",
      duration: 0.68,
      begin: 1.0,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "pı",
      duration: 0.68,
      begin: 1.25,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "sın",
      duration: 0.68,
      begin: 1.5,
      index: 5,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "dan",
      duration: 0.68,
      begin: 1.75,
      index: 6,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Dön",
      duration: 0.68,
      begin: 2.25,
      index: 7,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "dü",
      duration: 0.68,
      begin: 2.5,
      index: 8,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ğüm",
      duration: 0.68,
      begin: 2.75,
      index: 9,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Ge",
      duration: 0.68,
      begin: 3.0,
      index: 10,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ce",
      duration: 0.68,
      begin: 3.25,
      index: 11,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Bir", duration: 0.68, begin: 4.75, index: 12 },
    { text: " in", duration: 0.68, begin: 5.0, index: 13 },
    { text: "sa", duration: 0.68, begin: 5.25, index: 14 },
    { text: "nın", duration: 0.68, begin: 5.5, index: 15 },
    { text: " ya", duration: 0.68, begin: 5.75, index: 16 },
    { text: "şa", duration: 0.68, begin: 6.0, index: 17 },
    { text: "mı", duration: 0.68, begin: 6.25, index: 18 },
    { text: "nın", duration: 0.68, begin: 6.5, index: 19 },
    { text: " en", duration: 0.68, begin: 7.5, index: 20 },
    { text: " ö", duration: 0.68, begin: 7.75, index: 21 },
    { text: "nem", duration: 0.68, begin: 8.0, index: 22 },
    { text: "li", duration: 0.68, begin: 8.25, index: 23 },
    { text: " kıs", duration: 0.68, begin: 8.5, index: 24 },
    { text: "mı,", duration: 0.68, begin: 8.75, index: 25 },
    { text: " i", duration: 0.68, begin: 9.75, index: 26 },
    { text: "yi", duration: 0.68, begin: 10.0, index: 27 },
    { text: "lik", duration: 0.68, begin: 10.25, index: 28 },
    { text: " ve", duration: 0.68, begin: 10.5, index: 29 },
    { text: " sev", duration: 0.68, begin: 10.75, index: 30 },
    { text: "gi", duration: 0.68, begin: 11.0, index: 31 },
    { text: " a", duration: 0.68, begin: 11.25, index: 32 },
    { text: "dı", duration: 0.68, begin: 11.5, index: 33 },
    { text: "na", duration: 0.68, begin: 11.75, index: 34 },
    { text: " yap", duration: 0.68, begin: 12.0, index: 35 },
    { text: "tı", duration: 0.68, begin: 12.25, index: 36 },
    { text: "ğı", duration: 0.68, begin: 12.5, index: 37 },
    { text: " kü", duration: 0.28, begin: 13.75, index: 38 },
    { text: "çük", duration: 0.28, begin: 14.0, index: 39 },
    { text: " ad", duration: 0.68, begin: 14.75, index: 40 },
    { text: "sız", duration: 0.68, begin: 15.0, index: 41 },
    { text: " ve", duration: 0.68, begin: 15.25, index: 42 },
    { text: " a", duration: 0.68, begin: 16.25, index: 43 },
    { text: "nım", duration: 0.68, begin: 16.5, index: 44 },
    { text: "san", duration: 0.68, begin: 16.75, index: 45 },
    { text: "ma", duration: 0.68, begin: 17.0, index: 46 },
    { text: "yan", duration: 0.68, begin: 17.25, index: 47 },
    { text: " ey", duration: 0.68, begin: 17.75, index: 48 },
    { text: "lem", duration: 0.68, begin: 18.0, index: 49 },
    { text: "ler", duration: 0.68, begin: 18.25, index: 50 },
    { text: "dir.", duration: 0.68, begin: 18.5, index: 51 },
    { text: " Er", duration: 0.38, begin: 20.25, index: 52 },
    { text: "gen", duration: 0.38, begin: 20.5, index: 53 },
    { text: "lik", duration: 0.38, begin: 20.75, index: 54 },
    { text: " dö", duration: 0.38, begin: 21.0, index: 55 },
    { text: "ne", duration: 0.38, begin: 21.25, index: 56 },
    { text: "min", duration: 0.38, begin: 21.5, index: 57 },
    { text: "dey", duration: 0.38, begin: 21.75, index: 58 },
    { text: "dim", duration: 0.38, begin: 22.0, index: 59 },
    { text: " ve", duration: 0.38, begin: 22.5, index: 60 },
    { text: " ba", duration: 0.38, begin: 23.25, index: 61 },
    { text: "bam", duration: 0.38, begin: 23.5, index: 62 },
    { text: "la", duration: 0.38, begin: 23.75, index: 63 },
    { text: " sirk", duration: 0.38, begin: 24.0, index: 64 },
    { text: " bi", duration: 0.38, begin: 24.25, index: 65 },
    { text: "le", duration: 0.38, begin: 24.5, index: 66 },
    { text: "ti", duration: 0.38, begin: 24.75, index: 67 },
    { text: " kuy", duration: 0.38, begin: 25.0, index: 68 },
    { text: "ru", duration: 0.38, begin: 25.25, index: 69 },
    { text: "ğun", duration: 0.48, begin: 25.5, index: 70 },
    { text: "da", duration: 0.48, begin: 25.75, index: 71 },
    { text: " bek", duration: 0.48, begin: 26.0, index: 72 },
    { text: "li", duration: 0.48, begin: 26.25, index: 73 },
    { text: "yor", duration: 0.48, begin: 26.5, index: 74 },
    { text: "duk.", duration: 0.48, begin: 26.75, index: 75 },
    { text: " So", duration: 0.48, begin: 28.25, index: 76 },
    { text: "nun", duration: 0.48, begin: 28.5, index: 77 },
    { text: "da,", duration: 0.48, begin: 28.75, index: 78 },
    { text: " gi", duration: 0.68, begin: 29.5, index: 79 },
    { text: "şey", duration: 0.68, begin: 29.75, index: 80 },
    { text: "le", duration: 0.68, begin: 30.0, index: 81 },
    { text: " a", duration: 0.68, begin: 30.25, index: 82 },
    { text: "ra", duration: 0.68, begin: 30.5, index: 83 },
    { text: "mız", duration: 0.68, begin: 30.75, index: 84 },
    { text: "da", duration: 0.68, begin: 31.0, index: 85 },
    { text: " bir", duration: 0.68, begin: 32.0, index: 86 },
    { text: " tek", duration: 0.68, begin: 32.5, index: 87 },
    { text: " a", duration: 0.68, begin: 32.75, index: 88 },
    { text: "ile", duration: 0.68, begin: 33.0, index: 89 },
    { text: " kal", duration: 0.68, begin: 33.25, index: 90 },
    { text: "mış", duration: 0.68, begin: 33.5, index: 91 },
    { text: "tı.", duration: 0.68, begin: 33.75, index: 92 },
    { text: " Bu", duration: 0.68, begin: 35.25, index: 93 },
    { text: " a", duration: 0.68, begin: 35.5, index: 94 },
    { text: "i", duration: 0.68, begin: 35.75, index: 95 },
    { text: "le", duration: 0.68, begin: 36.0, index: 96 },
    { text: " be", duration: 0.68, begin: 36.75, index: 97 },
    { text: "ni", duration: 0.68, begin: 37.0, index: 98 },
    { text: " çok", duration: 0.68, begin: 37.25, index: 99 },
    { text: " et", duration: 0.68, begin: 37.5, index: 100 },
    { text: "ki", duration: 0.68, begin: 38.0, index: 101 },
    { text: "le", duration: 0.68, begin: 38.25, index: 102 },
    { text: "di.", duration: 0.68, begin: 38.5, index: 103 },
    { text: " Tü", duration: 0.68, begin: 39.5, index: 104 },
    { text: "mü", duration: 0.68, begin: 40.0, index: 105 },
    { text: "de", duration: 0.68, begin: 40.5, index: 106 },
    { text: " on", duration: 0.68, begin: 40.75, index: 107 },
    { text: " i", duration: 0.68, begin: 41.0, index: 108 },
    { text: "ki", duration: 0.68, begin: 41.25, index: 109 },
    { text: " ya", duration: 0.68, begin: 41.5, index: 110 },
    { text: "şın", duration: 0.68, begin: 41.75, index: 111 },
    { text: " al", duration: 0.68, begin: 42.0, index: 112 },
    { text: "tın", duration: 0.68, begin: 42.25, index: 113 },
    { text: "da", duration: 0.68, begin: 42.5, index: 114 },
    { text: " se", duration: 0.48, begin: 43.75, index: 115 },
    { text: "kiz", duration: 0.48, begin: 44.0, index: 116 },
    { text: " ço", duration: 0.68, begin: 44.25, index: 117 },
    { text: "cuk", duration: 0.68, begin: 44.5, index: 118 },
    { text: "la", duration: 0.68, begin: 44.75, index: 119 },
    { text: "rı", duration: 0.68, begin: 45.0, index: 120 },
    { text: " var", duration: 0.68, begin: 45.25, index: 121 },
    { text: "dı.", duration: 0.68, begin: 45.5, index: 122 },
    { text: " Çok", duration: 0.68, begin: 46.75, index: 123 },
    { text: " var", duration: 0.68, begin: 47.0, index: 124 },
    { text: "lık", duration: 0.68, begin: 47.25, index: 125 },
    { text: "lı", duration: 0.68, begin: 47.5, index: 126 },
    { text: " ol", duration: 0.68, begin: 47.75, index: 127 },
    { text: "ma", duration: 0.68, begin: 48.0, index: 128 },
    { text: "dık", duration: 0.68, begin: 48.25, index: 129 },
    { text: "la", duration: 0.68, begin: 48.5, index: 130 },
    { text: "rı", duration: 0.68, begin: 48.75, index: 131 },
    { text: " her", duration: 0.68, begin: 49.75, index: 132 },
    { text: " hal", duration: 0.68, begin: 50.0, index: 133 },
    { text: "le", duration: 0.68, begin: 50.25, index: 134 },
    { text: "rin", duration: 0.68, begin: 50.5, index: 135 },
    { text: "den", duration: 0.68, begin: 50.75, index: 136 },
    { text: " bel", duration: 0.68, begin: 51.25, index: 137 },
    { text: "liy", duration: 0.68, begin: 51.5, index: 138 },
    { text: "di.", duration: 0.68, begin: 51.75, index: 139 },
    { text: " Ü", duration: 0.68, begin: 53.25, index: 140 },
    { text: "zer", duration: 0.68, begin: 53.5, index: 141 },
    { text: "le", duration: 0.68, begin: 53.75, index: 142 },
    { text: "rin", duration: 0.68, begin: 54.0, index: 143 },
    { text: "de", duration: 0.68, begin: 54.25, index: 144 },
    { text: "ki", duration: 0.68, begin: 54.5, index: 145 },
    { text: " giy", duration: 0.68, begin: 54.75, index: 146 },
    { text: "si", duration: 0.68, begin: 55.0, index: 147 },
    { text: "ler", duration: 0.68, begin: 55.25, index: 148 },
    { text: " pa", duration: 0.48, begin: 56.25, index: 149 },
    { text: "ha", duration: 0.48, begin: 56.5, index: 150 },
    { text: "lı", duration: 0.48, begin: 56.75, index: 151 },
    { text: " şey", duration: 0.48, begin: 57.0, index: 152 },
    { text: "ler", duration: 0.48, begin: 57.25, index: 153 },
    { text: " de", duration: 0.68, begin: 57.5, index: 154 },
    { text: "ğil", duration: 0.68, begin: 57.75, index: 155 },
    { text: "di", duration: 0.68, begin: 58.0, index: 156 },
    { text: " a", duration: 0.48, begin: 58.5, index: 157 },
    { text: "ma", duration: 0.48, begin: 58.75, index: 158 },
    { text: " ter", duration: 0.68, begin: 59.5, index: 159 },
    { text: " te", duration: 0.68, begin: 59.75, index: 160 },
    { text: "miz", duration: 0.68, begin: 60.0, index: 161 },
    { text: "di.", duration: 0.68, begin: 60.25, index: 162 },
    { text: " Ço", duration: 0.68, begin: 61.5, index: 163 },
    { text: "cuk", duration: 0.68, begin: 61.75, index: 164 },
    { text: "la", duration: 0.68, begin: 62.0, index: 165 },
    { text: "rın", duration: 0.68, begin: 62.25, index: 166 },
    { text: " tü", duration: 0.68, begin: 62.5, index: 167 },
    { text: "mü,", duration: 0.68, begin: 62.75, index: 168 },
    { text: " ba", duration: 0.48, begin: 63.75, index: 169 },
    { text: "ba", duration: 0.48, begin: 64.0, index: 170 },
    { text: "la", duration: 0.48, begin: 64.25, index: 171 },
    { text: "rı", duration: 0.48, begin: 64.5, index: 172 },
    { text: "nın", duration: 0.48, begin: 64.75, index: 173 },
    { text: " ar", duration: 0.68, begin: 65.0, index: 174 },
    { text: "ka", duration: 0.68, begin: 65.25, index: 175 },
    { text: "sın", duration: 0.68, begin: 65.5, index: 176 },
    { text: "da", duration: 0.68, begin: 65.75, index: 177 },
    { text: " i", duration: 0.48, begin: 66.75, index: 178 },
    { text: "ki", duration: 0.48, begin: 67.0, index: 179 },
    { text: "şer", duration: 0.48, begin: 67.25, index: 180 },
    { text: "li", duration: 0.48, begin: 67.5, index: 181 },
    { text: " sı", duration: 0.68, begin: 67.75, index: 182 },
    { text: "ra", duration: 0.68, begin: 68.0, index: 183 },
    { text: " ol", duration: 0.68, begin: 68.25, index: 184 },
    { text: "muş,", duration: 0.68, begin: 68.5, index: 185 },
    { text: " el", duration: 0.68, begin: 69.5, index: 186 },
    { text: " ele", duration: 0.68, begin: 69.75, index: 187 },
    { text: " ve", duration: 0.68, begin: 70.5, index: 188 },
    { text: " ter", duration: 0.58, begin: 71.25, index: 189 },
    { text: "bi", duration: 0.58, begin: 71.5, index: 190 },
    { text: "ye", duration: 0.58, begin: 71.75, index: 191 },
    { text: "li", duration: 0.58, begin: 72.0, index: 192 },
    { text: " ter", duration: 0.58, begin: 72.25, index: 193 },
    { text: "bi", duration: 0.58, begin: 72.5, index: 194 },
    { text: "ye", duration: 0.58, begin: 72.75, index: 195 },
    { text: "li,", duration: 0.58, begin: 73.0, index: 196 },
    { text: " sı", duration: 0.28, begin: 74.0, index: 197 },
    { text: "ra", duration: 0.28, begin: 74.25, index: 198 },
    { text: "nın", duration: 0.28, begin: 74.5, index: 199 },
    { text: " ken", duration: 0.38, begin: 74.75, index: 200 },
    { text: "di", duration: 0.38, begin: 75.0, index: 201 },
    { text: "le", duration: 0.38, begin: 75.25, index: 202 },
    { text: "ri", duration: 0.38, begin: 75.5, index: 203 },
    { text: "ne", duration: 0.38, begin: 75.75, index: 204 },
    { text: " gel", duration: 0.38, begin: 76.0, index: 205 },
    { text: "me", duration: 0.38, begin: 76.25, index: 206 },
    { text: "si", duration: 0.38, begin: 76.5, index: 207 },
    { text: "ni", duration: 0.38, begin: 76.75, index: 208 },
    { text: " bek", duration: 0.48, begin: 77.0, index: 209 },
    { text: "li", duration: 0.48, begin: 77.25, index: 210 },
    { text: "yor", duration: 0.48, begin: 77.5, index: 211 },
    { text: "lar", duration: 0.48, begin: 77.75, index: 212 },
    { text: "dı.", duration: 0.48, begin: 78.0, index: 213 },
    { text: " Sirk", duration: 0.68, begin: 79.25, index: 214 },
    { text: "te", duration: 0.68, begin: 79.5, index: 215 },
    { text: " gö", duration: 0.68, begin: 79.75, index: 216 },
    { text: "re", duration: 0.68, begin: 80.0, index: 217 },
    { text: "cek", duration: 0.68, begin: 80.25, index: 218 },
    { text: "le", duration: 0.68, begin: 80.5, index: 219 },
    { text: "ri,", duration: 0.68, begin: 80.75, index: 220 },
    { text: " pal", duration: 0.68, begin: 81.75, index: 221 },
    { text: "ya", duration: 0.68, begin: 82.0, index: 222 },
    { text: "ço", duration: 0.68, begin: 82.25, index: 223 },
    { text: "lar,", duration: 0.68, begin: 82.5, index: 224 },
    { text: " fil", duration: 0.68, begin: 83.5, index: 225 },
    { text: "ler", duration: 0.68, begin: 83.75, index: 226 },
    { text: " ve", duration: 0.68, begin: 84.25, index: 227 },
    { text: " de", duration: 0.68, begin: 85.0, index: 228 },
    { text: "ği", duration: 0.68, begin: 85.25, index: 229 },
    { text: "şik", duration: 0.68, begin: 85.5, index: 230 },
    { text: " şey", duration: 0.68, begin: 85.75, index: 231 },
    { text: "ler", duration: 0.68, begin: 86.0, index: 232 },
    { text: " hak", duration: 0.48, begin: 86.75, index: 233 },
    { text: "kın", duration: 0.48, begin: 87.0, index: 234 },
    { text: "da", duration: 0.48, begin: 87.25, index: 235 },
    { text: " ko", duration: 0.48, begin: 87.75, index: 236 },
    { text: "nu", duration: 0.48, begin: 88.0, index: 237 },
    { text: "şu", duration: 0.48, begin: 88.25, index: 238 },
    { text: "yor", duration: 0.48, begin: 88.5, index: 239 },
    { text: "lar", duration: 0.48, begin: 88.75, index: 240 },
    { text: "dı.", duration: 0.48, begin: 89.0, index: 241 },
    { text: " Da", duration: 0.68, begin: 90.25, index: 242 },
    { text: "ha", duration: 0.68, begin: 90.5, index: 243 },
    { text: " ön", duration: 0.68, begin: 90.75, index: 244 },
    { text: "ce", duration: 0.68, begin: 91.0, index: 245 },
    { text: " sir", duration: 0.68, begin: 92.0, index: 246 },
    { text: "ke", duration: 0.68, begin: 92.25, index: 247 },
    { text: " git", duration: 0.68, begin: 92.5, index: 248 },
    { text: "me", duration: 0.68, begin: 92.75, index: 249 },
    { text: "dik", duration: 0.68, begin: 93.0, index: 250 },
    { text: "le", duration: 0.68, begin: 93.25, index: 251 },
    { text: "ri,", duration: 0.68, begin: 93.5, index: 252 },
    { text: " ko", duration: 0.68, begin: 94.75, index: 253 },
    { text: "nuş", duration: 0.68, begin: 95.0, index: 254 },
    { text: "ma", duration: 0.68, begin: 95.25, index: 255 },
    { text: "la", duration: 0.68, begin: 95.5, index: 256 },
    { text: "rın", duration: 0.68, begin: 95.75, index: 257 },
    { text: "dan", duration: 0.68, begin: 96.0, index: 258 },
    { text: " bel", duration: 0.68, begin: 96.25, index: 259 },
    { text: "liy", duration: 0.68, begin: 96.5, index: 260 },
    { text: "di.", duration: 0.68, begin: 96.75, index: 261 },
    { text: " An", duration: 0.68, begin: 98.25, index: 262 },
    { text: "ney", duration: 0.68, begin: 98.5, index: 263 },
    { text: "le", duration: 0.68, begin: 98.75, index: 264 },
    { text: " ba", duration: 0.68, begin: 99.0, index: 265 },
    { text: "ba,", duration: 0.68, begin: 99.25, index: 266 },
    { text: " gu", duration: 0.68, begin: 100.25, index: 267 },
    { text: "rur", duration: 0.68, begin: 100.5, index: 268 },
    { text: "la", duration: 0.68, begin: 100.75, index: 269 },
    { text: " ço", duration: 0.68, begin: 101.0, index: 270 },
    { text: "cuk", duration: 0.68, begin: 101.25, index: 271 },
    { text: "la", duration: 0.68, begin: 101.5, index: 272 },
    { text: "rı", duration: 0.68, begin: 101.75, index: 273 },
    { text: "nın", duration: 0.68, begin: 102.0, index: 274 },
    { text: " ö", duration: 0.68, begin: 102.25, index: 275 },
    { text: "nün", duration: 0.68, begin: 102.5, index: 276 },
    { text: "de", duration: 0.68, begin: 102.75, index: 277 },
    { text: " du", duration: 0.68, begin: 103.0, index: 278 },
    { text: "ru", duration: 0.68, begin: 103.25, index: 279 },
    { text: "yor", duration: 0.68, begin: 103.5, index: 280 },
    { text: "lar", duration: 0.68, begin: 103.75, index: 281 },
    { text: "dı.", duration: 0.68, begin: 104.0, index: 282 },
    { text: " On", duration: 0.68, begin: 105.5, index: 283 },
    { text: "lar", duration: 0.68, begin: 105.75, index: 284 },
    { text: "da", duration: 0.68, begin: 106.0, index: 285 },
    { text: " el", duration: 0.68, begin: 107.0, index: 286 },
    { text: " e", duration: 0.68, begin: 107.25, index: 287 },
    { text: "le", duration: 0.68, begin: 107.5, index: 288 },
    { text: " tu", duration: 0.68, begin: 107.75, index: 289 },
    { text: "tuş", duration: 0.68, begin: 108.0, index: 290 },
    { text: "muş", duration: 0.68, begin: 108.25, index: 291 },
    { text: "lar", duration: 0.68, begin: 108.5, index: 292 },
    { text: "dı.", duration: 0.68, begin: 108.75, index: 293 },
    { text: " Gi", duration: 0.68, begin: 110.25, index: 294 },
    { text: "şe", duration: 0.68, begin: 110.5, index: 295 },
    { text: "de", duration: 0.68, begin: 110.75, index: 296 },
    { text: "ki", duration: 0.68, begin: 111.0, index: 297 },
    { text: " me", duration: 0.68, begin: 111.25, index: 298 },
    { text: "mur;", duration: 0.68, begin: 111.5, index: 299 },
    { text: " ba", duration: 0.48, begin: 112.5, index: 300 },
    { text: "ba", duration: 0.48, begin: 112.75, index: 301 },
    { text: "ya,", duration: 0.48, begin: 113.0, index: 302 },
    { text: " kaç", duration: 0.68, begin: 113.75, index: 303 },
    { text: " bi", duration: 0.68, begin: 114.0, index: 304 },
    { text: "let", duration: 0.68, begin: 114.25, index: 305 },
    { text: " is", duration: 0.68, begin: 114.5, index: 306 },
    { text: "te", duration: 0.68, begin: 114.75, index: 307 },
    { text: "dik", duration: 0.68, begin: 115.0, index: 308 },
    { text: "le", duration: 0.68, begin: 115.25, index: 309 },
    { text: "ri", duration: 0.68, begin: 115.5, index: 310 },
    { text: "ni", duration: 0.68, begin: 115.75, index: 311 },
    { text: " sor", duration: 0.68, begin: 116.0, index: 312 },
    { text: "du.", duration: 0.68, begin: 116.25, index: 313 },
    { text: " Ba", duration: 0.48, begin: 117.75, index: 314 },
    { text: "ba,", duration: 0.48, begin: 118.0, index: 315 },
    { text: " gu", duration: 0.68, begin: 118.75, index: 316 },
    { text: "rur", duration: 0.68, begin: 119.0, index: 317 },
    { text: "la:", duration: 0.68, begin: 119.25, index: 318 },
    { text: " İ", duration: 0.68, begin: 120.25, index: 319 },
    { text: "ki", duration: 0.68, begin: 120.5, index: 320 },
    { text: " ta", duration: 0.68, begin: 120.75, index: 321 },
    { text: "ne", duration: 0.68, begin: 121.0, index: 322 },
    { text: " e", duration: 0.68, begin: 121.25, index: 323 },
    { text: "şim", duration: 0.68, begin: 121.5, index: 324 },
    { text: "le", duration: 0.68, begin: 121.75, index: 325 },
    { text: " ken", duration: 0.68, begin: 122.25, index: 326 },
    { text: "dim,", duration: 0.68, begin: 122.5, index: 327 },
    { text: " se", duration: 0.68, begin: 123.75, index: 328 },
    { text: "kiz", duration: 0.68, begin: 124.0, index: 329 },
    { text: " ta", duration: 0.68, begin: 124.25, index: 330 },
    { text: "ne", duration: 0.68, begin: 124.5, index: 331 },
    { text: "de", duration: 0.68, begin: 124.75, index: 332 },
    { text: " ço", duration: 0.68, begin: 125.0, index: 333 },
    { text: "cuk", duration: 0.68, begin: 125.25, index: 334 },
    { text: "la", duration: 0.68, begin: 125.5, index: 335 },
    { text: "rım", duration: 0.68, begin: 125.75, index: 336 },
    { text: " i", duration: 0.68, begin: 126.0, index: 337 },
    { text: "çin", duration: 0.68, begin: 126.25, index: 338 },
    { text: " bi", duration: 0.68, begin: 126.75, index: 339 },
    { text: "let", duration: 0.68, begin: 127.0, index: 340 },
    { text: " is", duration: 0.68, begin: 127.25, index: 341 },
    { text: "ti", duration: 0.68, begin: 127.5, index: 342 },
    { text: "yo", duration: 0.68, begin: 127.75, index: 343 },
    { text: "rum", duration: 0.68, begin: 128.0, index: 344 },
    { text: " di", duration: 0.68, begin: 128.75, index: 345 },
    { text: "ye", duration: 0.68, begin: 129.0, index: 346 },
    { text: " ya", duration: 0.68, begin: 129.25, index: 347 },
    { text: "nıt", duration: 0.68, begin: 129.5, index: 348 },
    { text: "la", duration: 0.68, begin: 129.75, index: 349 },
    { text: "dı", duration: 0.68, begin: 130.0, index: 350 },
    { text: " o", duration: 0.68, begin: 130.25, index: 351 },
    { text: "nu", duration: 0.68, begin: 130.5, index: 352 },
    { text: " Gi", duration: 0.68, begin: 131.75, index: 353 },
    { text: "şe", duration: 0.68, begin: 132.0, index: 354 },
    { text: " me", duration: 0.68, begin: 132.25, index: 355 },
    { text: "mu", duration: 0.68, begin: 132.5, index: 356 },
    { text: "ru", duration: 0.68, begin: 132.75, index: 357 },
    { text: " bi", duration: 0.68, begin: 133.75, index: 358 },
    { text: "let", duration: 0.68, begin: 134.0, index: 359 },
    { text: "le", duration: 0.68, begin: 134.25, index: 360 },
    { text: "rin", duration: 0.68, begin: 134.5, index: 361 },
    { text: " be", duration: 0.68, begin: 134.75, index: 362 },
    { text: "de", duration: 0.68, begin: 135.0, index: 363 },
    { text: "li", duration: 0.68, begin: 135.25, index: 364 },
    { text: "ni", duration: 0.68, begin: 135.5, index: 365 },
    { text: " söy", duration: 0.68, begin: 135.75, index: 366 },
    { text: "le", duration: 0.68, begin: 136.0, index: 367 },
    { text: "di.", duration: 0.68, begin: 136.25, index: 368 },
    { text: " An", duration: 0.68, begin: 137.75, index: 369 },
    { text: "ne", duration: 0.68, begin: 138.0, index: 370 },
    { text: "nin", duration: 0.68, begin: 138.25, index: 371 },
    { text: " e", duration: 0.68, begin: 138.5, index: 372 },
    { text: "li,", duration: 0.68, begin: 138.75, index: 373 },
    { text: " ba", duration: 0.68, begin: 139.5, index: 374 },
    { text: "ba", duration: 0.68, begin: 139.75, index: 375 },
    { text: "nın", duration: 0.68, begin: 140.0, index: 376 },
    { text: " e", duration: 0.68, begin: 140.25, index: 377 },
    { text: "lin", duration: 0.68, begin: 140.5, index: 378 },
    { text: "den", duration: 0.68, begin: 140.75, index: 379 },
    { text: " ay", duration: 0.68, begin: 141.0, index: 380 },
    { text: "rıl", duration: 0.68, begin: 141.25, index: 381 },
    { text: "dı", duration: 0.68, begin: 141.5, index: 382 },
    { text: " ve", duration: 0.68, begin: 142.5, index: 383 },
    { text: " ba", duration: 0.38, begin: 143.25, index: 384 },
    { text: "şı", duration: 0.38, begin: 143.5, index: 385 },
    { text: " ö", duration: 0.48, begin: 143.75, index: 386 },
    { text: "ne", duration: 0.48, begin: 144.0, index: 387 },
    { text: " düş", duration: 0.48, begin: 144.25, index: 388 },
    { text: "tü.", duration: 0.48, begin: 144.5, index: 389 },
    { text: " Ba", duration: 0.68, begin: 145.5, index: 390 },
    { text: "ba", duration: 0.68, begin: 145.75, index: 391 },
    { text: "nın", duration: 0.68, begin: 146.0, index: 392 },
    { text: " du", duration: 0.68, begin: 146.25, index: 393 },
    { text: "dak", duration: 0.68, begin: 146.5, index: 394 },
    { text: "la", duration: 0.68, begin: 146.75, index: 395 },
    { text: "rı", duration: 0.68, begin: 147.0, index: 396 },
    { text: " tit", duration: 0.68, begin: 147.25, index: 397 },
    { text: "re", duration: 0.68, begin: 147.5, index: 398 },
    { text: "me", duration: 0.68, begin: 147.75, index: 399 },
    { text: "ye", duration: 0.68, begin: 148.0, index: 400 },
    { text: " baş", duration: 0.68, begin: 148.25, index: 401 },
    { text: "la", duration: 0.68, begin: 148.5, index: 402 },
    { text: "dı.", duration: 0.68, begin: 148.75, index: 403 },
    { text: " Ba", duration: 0.38, begin: 150.5, index: 404 },
    { text: "ba,", duration: 0.38, begin: 150.75, index: 405 },
    { text: " gi", duration: 0.68, begin: 151.5, index: 406 },
    { text: "şe", duration: 0.68, begin: 151.75, index: 407 },
    { text: "ye", duration: 0.68, begin: 152.0, index: 408 },
    { text: " bi", duration: 0.68, begin: 152.25, index: 409 },
    { text: "raz", duration: 0.68, begin: 152.5, index: 410 },
    { text: " da", duration: 0.68, begin: 152.75, index: 411 },
    { text: "ha", duration: 0.68, begin: 153.0, index: 412 },
    { text: " yak", duration: 0.68, begin: 153.25, index: 413 },
    { text: "laş", duration: 0.68, begin: 153.5, index: 414 },
    { text: "tı", duration: 0.68, begin: 153.75, index: 415 },
    { text: " ve:", duration: 0.68, begin: 154.5, index: 416 },
    { text: " Ne", duration: 0.68, begin: 155.25, index: 417 },
    { text: " ka", duration: 0.68, begin: 155.5, index: 418 },
    { text: "dar", duration: 0.68, begin: 155.75, index: 419 },
    { text: " de", duration: 0.68, begin: 156.0, index: 420 },
    { text: "di", duration: 0.68, begin: 156.25, index: 421 },
    { text: "niz?", duration: 0.68, begin: 156.5, index: 422 },
    { text: " di", duration: 0.68, begin: 157.5, index: 423 },
    { text: "ye", duration: 0.68, begin: 157.75, index: 424 },
    { text: " sor", duration: 0.68, begin: 158.0, index: 425 },
    { text: "du.", duration: 0.68, begin: 158.25, index: 426 },
    { text: " Gi", duration: 0.68, begin: 159.75, index: 427 },
    { text: "şe", duration: 0.68, begin: 160.0, index: 428 },
    { text: " me", duration: 0.68, begin: 160.25, index: 429 },
    { text: "mu", duration: 0.68, begin: 160.5, index: 430 },
    { text: "ru,", duration: 0.68, begin: 160.75, index: 431 },
    { text: " bi", duration: 0.38, begin: 161.75, index: 432 },
    { text: "let", duration: 0.38, begin: 162.0, index: 433 },
    { text: "le", duration: 0.38, begin: 162.25, index: 434 },
    { text: "rin", duration: 0.38, begin: 162.5, index: 435 },
    { text: " be", duration: 0.28, begin: 162.75, index: 436 },
    { text: "de", duration: 0.28, begin: 163.0, index: 437 },
    { text: "li", duration: 0.28, begin: 163.25, index: 438 },
    { text: "ni", duration: 0.28, begin: 163.5, index: 439 },
    { text: " yi", duration: 0.28, begin: 163.75, index: 440 },
    { text: "ne", duration: 0.28, begin: 164.0, index: 441 },
    { text: "le", duration: 0.28, begin: 164.25, index: 442 },
    { text: "di.", duration: 0.28, begin: 164.5, index: 443 },
    { text: " A", duration: 0.28, begin: 165.75, index: 444 },
    { text: "da", duration: 0.28, begin: 166.0, index: 445 },
    { text: "mın", duration: 0.28, begin: 166.25, index: 446 },
    { text: " o", duration: 0.28, begin: 167.0, index: 447 },
    { text: " ka", duration: 0.28, begin: 167.25, index: 448 },
    { text: "dar", duration: 0.28, begin: 167.5, index: 449 },
    { text: " pa", duration: 0.28, begin: 167.75, index: 450 },
    { text: "ra", duration: 0.28, begin: 168.0, index: 451 },
    { text: "sı", duration: 0.28, begin: 168.25, index: 452 },
    { text: " yok", duration: 0.48, begin: 168.5, index: 453 },
    { text: "tu.", duration: 0.48, begin: 168.75, index: 454 },
    { text: " Şim", duration: 0.38, begin: 170.0, index: 455 },
    { text: "di", duration: 0.38, begin: 170.25, index: 456 },
    { text: " na", duration: 0.38, begin: 170.5, index: 457 },
    { text: "sıl", duration: 0.38, begin: 170.75, index: 458 },
    { text: " dö", duration: 0.38, begin: 171.25, index: 459 },
    { text: "nüp,", duration: 0.38, begin: 171.5, index: 460 },
    { text: " ço", duration: 0.38, begin: 172.0, index: 461 },
    { text: "cuk", duration: 0.38, begin: 172.25, index: 462 },
    { text: "la", duration: 0.38, begin: 172.5, index: 463 },
    { text: "rı", duration: 0.38, begin: 172.75, index: 464 },
    { text: "na,", duration: 0.38, begin: 173.0, index: 465 },
    { text: " on", duration: 0.38, begin: 173.75, index: 466 },
    { text: "la", duration: 0.38, begin: 174.0, index: 467 },
    { text: "rı", duration: 0.38, begin: 174.25, index: 468 },
    { text: " sir", duration: 0.38, begin: 174.5, index: 469 },
    { text: "ke", duration: 0.38, begin: 174.75, index: 470 },
    { text: " gö", duration: 0.38, begin: 175.25, index: 471 },
    { text: "tü", duration: 0.38, begin: 175.5, index: 472 },
    { text: "re", duration: 0.38, begin: 175.75, index: 473 },
    { text: "me", duration: 0.38, begin: 176.0, index: 474 },
    { text: "ye", duration: 0.38, begin: 176.25, index: 475 },
    { text: "cek", duration: 0.38, begin: 176.5, index: 476 },
    { text: " ka", duration: 0.38, begin: 176.75, index: 477 },
    { text: "dar", duration: 0.38, begin: 177.0, index: 478 },
    { text: " pa", duration: 0.38, begin: 177.75, index: 479 },
    { text: "ra", duration: 0.38, begin: 178.0, index: 480 },
    { text: "sı", duration: 0.38, begin: 178.25, index: 481 },
    { text: " ol", duration: 0.38, begin: 178.5, index: 482 },
    { text: "ma", duration: 0.38, begin: 178.75, index: 483 },
    { text: "dı", duration: 0.38, begin: 179.0, index: 484 },
    { text: "ğı", duration: 0.38, begin: 179.25, index: 485 },
    { text: "nı", duration: 0.38, begin: 179.5, index: 486 },
    { text: " söy", duration: 0.38, begin: 179.75, index: 487 },
    { text: "le", duration: 0.38, begin: 180.0, index: 488 },
    { text: "ye", duration: 0.38, begin: 180.25, index: 489 },
    { text: "cek", duration: 0.38, begin: 180.5, index: 490 },
    { text: "ti?", duration: 0.38, begin: 180.75, index: 491 },
    { text: " Ba", duration: 0.38, begin: 182.25, index: 492 },
    { text: "bam,", duration: 0.38, begin: 182.5, index: 493 },
    { text: " on", duration: 0.38, begin: 183.25, index: 494 },
    { text: "la", duration: 0.38, begin: 183.5, index: 495 },
    { text: "rı", duration: 0.38, begin: 183.75, index: 496 },
    { text: " gö", duration: 0.38, begin: 183.75, index: 497 },
    { text: "rün", duration: 0.38, begin: 184.0, index: 498 },
    { text: "ce", duration: 0.38, begin: 184.25, index: 499 },
    { text: " e", duration: 0.28, begin: 185.5, index: 500 },
    { text: "li", duration: 0.28, begin: 185.75, index: 501 },
    { text: "ni", duration: 0.28, begin: 186.0, index: 502 },
    { text: " ce", duration: 0.28, begin: 186.25, index: 503 },
    { text: "bi", duration: 0.28, begin: 186.5, index: 504 },
    { text: "ne", duration: 0.28, begin: 186.75, index: 505 },
    { text: " sok", duration: 0.28, begin: 187.0, index: 506 },
    { text: "tu,", duration: 0.28, begin: 187.25, index: 507 },
    { text: " ce", duration: 0.28, begin: 188.25, index: 508 },
    { text: "bin", duration: 0.28, begin: 188.5, index: 509 },
    { text: "den", duration: 0.28, begin: 188.75, index: 510 },
    { text: " bir", duration: 0.28, begin: 189.5, index: 511 },
    { text: " Yir", duration: 0.28, begin: 190.0, index: 512 },
    { text: "mi", duration: 0.28, begin: 190.25, index: 513 },
    { text: " do", duration: 0.28, begin: 190.5, index: 514 },
    { text: "lar", duration: 0.28, begin: 190.75, index: 515 },
    { text: " çı", duration: 0.28, begin: 191.0, index: 516 },
    { text: "kar", duration: 0.28, begin: 191.25, index: 517 },
    { text: "dı", duration: 0.28, begin: 191.5, index: 518 },
    { text: " ve", duration: 0.28, begin: 191.75, index: 519 },
    { text: " ye", duration: 0.28, begin: 192.5, index: 520 },
    { text: "re", duration: 0.28, begin: 192.75, index: 521 },
    { text: " dü", duration: 0.28, begin: 193.0, index: 522 },
    { text: "şür", duration: 0.28, begin: 193.25, index: 523 },
    { text: "dü.", duration: 0.28, begin: 193.5, index: 524 },
    { text: " Son", duration: 0.28, begin: 194.75, index: 525 },
    { text: "ra", duration: 0.28, begin: 195.0, index: 526 },
    { text: " ye", duration: 0.28, begin: 195.25, index: 527 },
    { text: "re", duration: 0.28, begin: 195.5, index: 528 },
    { text: " e", duration: 0.28, begin: 195.75, index: 529 },
    { text: "ğil", duration: 0.28, begin: 196.0, index: 530 },
    { text: "di,", duration: 0.28, begin: 196.25, index: 531 },
    { text: " pa", duration: 0.28, begin: 197.25, index: 532 },
    { text: "ra", duration: 0.28, begin: 197.5, index: 533 },
    { text: "yı", duration: 0.28, begin: 197.75, index: 534 },
    { text: " yer", duration: 0.28, begin: 198.0, index: 535 },
    { text: "den", duration: 0.28, begin: 198.25, index: 536 },
    { text: " al", duration: 0.28, begin: 198.5, index: 537 },
    { text: "dı,", duration: 0.28, begin: 198.75, index: 538 },
    { text: " a", duration: 0.28, begin: 199.75, index: 539 },
    { text: "da", duration: 0.28, begin: 200.0, index: 540 },
    { text: "mın", duration: 0.28, begin: 200.25, index: 541 },
    { text: " o", duration: 0.28, begin: 200.75, index: 542 },
    { text: "mu", duration: 0.28, begin: 201.0, index: 543 },
    { text: "zu", duration: 0.28, begin: 201.25, index: 544 },
    { text: "na", duration: 0.28, begin: 201.5, index: 545 },
    { text: " do", duration: 0.28, begin: 201.75, index: 546 },
    { text: "kun", duration: 0.28, begin: 202.0, index: 547 },
    { text: "du", duration: 0.28, begin: 202.25, index: 548 },
    { text: " ve", duration: 0.28, begin: 202.75, index: 549 },
    { text: " o", duration: 0.28, begin: 203.5, index: 550 },
    { text: "na:", duration: 0.28, begin: 203.75, index: 551 },
    { text: " Af", duration: 0.28, begin: 204.75, index: 552 },
    { text: "fe", duration: 0.28, begin: 205.0, index: 553 },
    { text: "der", duration: 0.28, begin: 205.25, index: 554 },
    { text: "si", duration: 0.28, begin: 205.5, index: 555 },
    { text: "niz,", duration: 0.28, begin: 205.75, index: 556 },
    { text: " bu", duration: 0.28, begin: 206.75, index: 557 },
    { text: " pa", duration: 0.28, begin: 207.0, index: 558 },
    { text: "ra", duration: 0.28, begin: 207.25, index: 559 },
    { text: " ce", duration: 0.28, begin: 207.5, index: 560 },
    { text: "bi", duration: 0.28, begin: 207.75, index: 561 },
    { text: "niz", duration: 0.28, begin: 208.0, index: 562 },
    { text: "den", duration: 0.28, begin: 208.25, index: 563 },
    { text: " düş", duration: 0.28, begin: 208.5, index: 564 },
    { text: "tü", duration: 0.28, begin: 208.75, index: 565 },
    { text: " de", duration: 0.28, begin: 209.25, index: 566 },
    { text: "di.", duration: 0.28, begin: 209.5, index: 567 },
    { text: " A", duration: 0.28, begin: 210.75, index: 568 },
    { text: "dam", duration: 0.28, begin: 211.0, index: 569 },
    { text: " o", duration: 0.28, begin: 212.0, index: 570 },
    { text: "lan", duration: 0.28, begin: 212.25, index: 571 },
    { text: " bi", duration: 0.28, begin: 212.5, index: 572 },
    { text: "te", duration: 0.28, begin: 212.75, index: 573 },
    { text: "ni", duration: 0.28, begin: 213.0, index: 574 },
    { text: " an", duration: 0.28, begin: 213.25, index: 575 },
    { text: "la", duration: 0.28, begin: 213.5, index: 576 },
    { text: "mış", duration: 0.28, begin: 213.75, index: 577 },
    { text: "tı.", duration: 0.28, begin: 214.0, index: 578 },
    { text: " Di", duration: 0.28, begin: 215.0, index: 579 },
    { text: "len", duration: 0.28, begin: 215.25, index: 580 },
    { text: "mi", duration: 0.28, begin: 215.5, index: 581 },
    { text: "yor", duration: 0.28, begin: 215.75, index: 582 },
    { text: "du", duration: 0.28, begin: 216.0, index: 583 },
    { text: " a", duration: 0.28, begin: 216.25, index: 584 },
    { text: "ma", duration: 0.28, begin: 216.5, index: 585 },
    { text: " çok", duration: 0.28, begin: 217.25, index: 586 },
    { text: " ça", duration: 0.28, begin: 217.5, index: 587 },
    { text: "re", duration: 0.28, begin: 217.75, index: 588 },
    { text: "siz", duration: 0.28, begin: 218.0, index: 589 },
    { text: "di.", duration: 0.28, begin: 218.25, index: 590 },
    { text: " U", duration: 0.28, begin: 219.75, index: 591 },
    { text: "tanç", duration: 0.28, begin: 220.0, index: 592 },
    { text: " duy", duration: 0.28, begin: 220.25, index: 593 },
    { text: "du", duration: 0.28, begin: 220.5, index: 594 },
    { text: "ğu", duration: 0.28, begin: 220.75, index: 595 },
    { text: " ve", duration: 0.28, begin: 221.0, index: 596 },
    { text: " çok", duration: 0.28, begin: 221.75, index: 597 },
    { text: " ü", duration: 0.28, begin: 222.0, index: 598 },
    { text: "zül", duration: 0.28, begin: 222.25, index: 599 },
    { text: "dü", duration: 0.28, begin: 222.5, index: 600 },
    { text: "ğü", duration: 0.28, begin: 222.75, index: 601 },
    { text: " bu", duration: 0.28, begin: 223.0, index: 602 },
    { text: " du", duration: 0.28, begin: 223.25, index: 603 },
    { text: "rum", duration: 0.28, begin: 223.5, index: 604 },
    { text: " kar", duration: 0.28, begin: 223.75, index: 605 },
    { text: "şı", duration: 0.28, begin: 224.0, index: 606 },
    { text: "sın", duration: 0.28, begin: 224.25, index: 607 },
    { text: "da", duration: 0.28, begin: 224.5, index: 608 },
    { text: " ya", duration: 0.28, begin: 225.0, index: 609 },
    { text: "pı", duration: 0.28, begin: 225.25, index: 610 },
    { text: "lan", duration: 0.28, begin: 225.5, index: 611 },
    { text: " yar", duration: 0.28, begin: 226.0, index: 612 },
    { text: "dı", duration: 0.28, begin: 226.25, index: 613 },
    { text: "mı", duration: 0.28, begin: 226.5, index: 614 },
    { text: " min", duration: 0.28, begin: 227.5, index: 615 },
    { text: "net", duration: 0.28, begin: 227.75, index: 616 },
    { text: "le", duration: 0.28, begin: 228.0, index: 617 },
    { text: " kar", duration: 0.28, begin: 228.25, index: 618 },
    { text: "şı", duration: 0.28, begin: 228.5, index: 619 },
    { text: "la", duration: 0.28, begin: 228.75, index: 620 },
    { text: "mış", duration: 0.28, begin: 229.0, index: 621 },
    { text: "tı.", duration: 0.28, begin: 229.25, index: 622 },
    { text: " Ba", duration: 0.28, begin: 230.5, index: 623 },
    { text: "ba", duration: 0.28, begin: 230.75, index: 624 },
    { text: "mın", duration: 0.28, begin: 231.0, index: 625 },
    { text: " göz", duration: 0.28, begin: 231.25, index: 626 },
    { text: "le", duration: 0.28, begin: 231.5, index: 627 },
    { text: "ri", duration: 0.28, begin: 231.75, index: 628 },
    { text: "nin", duration: 0.28, begin: 232.0, index: 629 },
    { text: " i", duration: 0.28, begin: 232.5, index: 630 },
    { text: "çi", duration: 0.28, begin: 232.75, index: 631 },
    { text: "ne", duration: 0.28, begin: 233.0, index: 632 },
    { text: " bak", duration: 0.28, begin: 233.25, index: 633 },
    { text: "tı,", duration: 0.28, begin: 233.5, index: 634 },
    { text: " e", duration: 0.28, begin: 234.75, index: 635 },
    { text: "li", duration: 0.28, begin: 235.0, index: 636 },
    { text: " i", duration: 0.28, begin: 235.25, index: 637 },
    { text: "ki", duration: 0.28, begin: 235.75, index: 638 },
    { text: " e", duration: 0.28, begin: 236.0, index: 639 },
    { text: "li", duration: 0.28, begin: 236.25, index: 640 },
    { text: "nin", duration: 0.28, begin: 236.5, index: 641 },
    { text: " a", duration: 0.28, begin: 236.75, index: 642 },
    { text: "ra", duration: 0.28, begin: 237.0, index: 643 },
    { text: "sın", duration: 0.28, begin: 237.25, index: 644 },
    { text: "da,", duration: 0.28, begin: 237.5, index: 645 },
    { text: " yir", duration: 0.28, begin: 238.0, index: 646 },
    { text: "mi", duration: 0.28, begin: 238.25, index: 647 },
    { text: " do", duration: 0.28, begin: 238.5, index: 648 },
    { text: "la", duration: 0.28, begin: 238.75, index: 649 },
    { text: "rı", duration: 0.28, begin: 239.0, index: 650 },
    { text: " al", duration: 0.28, begin: 239.25, index: 651 },
    { text: "dı.", duration: 0.28, begin: 239.5, index: 652 },
    { text: " Du", duration: 0.28, begin: 240.75, index: 653 },
    { text: "dak", duration: 0.28, begin: 241.0, index: 654 },
    { text: "la", duration: 0.28, begin: 241.25, index: 655 },
    { text: "rı", duration: 0.28, begin: 241.5, index: 656 },
    { text: " tit", duration: 0.28, begin: 241.75, index: 657 },
    { text: "rer", duration: 0.28, begin: 242.0, index: 658 },
    { text: "ken,", duration: 0.28, begin: 242.25, index: 659 },
    { text: " ba", duration: 0.28, begin: 243.25, index: 660 },
    { text: "ba", duration: 0.28, begin: 243.5, index: 661 },
    { text: "ma:", duration: 0.28, begin: 243.75, index: 662 },
    { text: " Te", duration: 0.28, begin: 244.75, index: 663 },
    { text: "şek", duration: 0.28, begin: 245.0, index: 664 },
    { text: "kür", duration: 0.28, begin: 245.25, index: 665 },
    { text: " e", duration: 0.28, begin: 245.5, index: 666 },
    { text: "de", duration: 0.28, begin: 245.75, index: 667 },
    { text: "rim,", duration: 0.28, begin: 246.0, index: 668 },
    { text: " çok", duration: 0.28, begin: 247.0, index: 669 },
    { text: " te", duration: 0.28, begin: 247.25, index: 670 },
    { text: "şek", duration: 0.28, begin: 247.5, index: 671 },
    { text: "kür", duration: 0.28, begin: 247.75, index: 672 },
    { text: " e", duration: 0.28, begin: 248.0, index: 673 },
    { text: "de", duration: 0.28, begin: 248.25, index: 674 },
    { text: "rim", duration: 0.28, begin: 248.5, index: 675 },
    { text: " ba", duration: 0.28, begin: 248.75, index: 676 },
    { text: "yım.", duration: 0.28, begin: 249.0, index: 677 },
    { text: " Bu", duration: 0.28, begin: 250.0, index: 678 },
    { text: " yap", duration: 0.28, begin: 250.25, index: 679 },
    { text: "tı", duration: 0.28, begin: 250.5, index: 680 },
    { text: "ğı", duration: 0.28, begin: 250.75, index: 681 },
    { text: "nı", duration: 0.28, begin: 251.0, index: 682 },
    { text: "zın,", duration: 0.28, begin: 251.25, index: 683 },
    { text: " be", duration: 0.28, begin: 252.25, index: 684 },
    { text: "nim", duration: 0.28, begin: 252.5, index: 685 },
    { text: " ve", duration: 0.28, begin: 252.75, index: 686 },
    { text: " a", duration: 0.28, begin: 253.25, index: 687 },
    { text: "i", duration: 0.28, begin: 253.5, index: 688 },
    { text: "lem", duration: 0.28, begin: 253.75, index: 689 },
    { text: " i", duration: 0.28, begin: 254.0, index: 690 },
    { text: "çin", duration: 0.28, begin: 254.25, index: 691 },
    { text: " ö", duration: 0.28, begin: 254.5, index: 692 },
    { text: "ne", duration: 0.28, begin: 254.75, index: 693 },
    { text: "mi", duration: 0.28, begin: 255.0, index: 694 },
    { text: " çok", duration: 0.28, begin: 255.25, index: 695 },
    { text: " bü", duration: 0.28, begin: 255.5, index: 696 },
    { text: "yük", duration: 0.28, begin: 255.75, index: 697 },
    { text: " de", duration: 0.28, begin: 256.75, index: 698 },
    { text: "di.", duration: 0.28, begin: 257.0, index: 699 },
    { text: " Biz", duration: 0.28, begin: 258.25, index: 700 },
    { text: " ba", duration: 0.28, begin: 258.5, index: 701 },
    { text: "bam", duration: 0.28, begin: 258.75, index: 702 },
    { text: "la", duration: 0.28, begin: 259.0, index: 703 },
    { text: " a", duration: 0.28, begin: 259.25, index: 704 },
    { text: "ra", duration: 0.28, begin: 259.5, index: 705 },
    { text: "ba", duration: 0.28, begin: 259.75, index: 706 },
    { text: "mı", duration: 0.28, begin: 260.0, index: 707 },
    { text: "za", duration: 0.28, begin: 260.25, index: 708 },
    { text: " bin", duration: 0.28, begin: 260.5, index: 709 },
    { text: "dik", duration: 0.28, begin: 260.75, index: 710 },
    { text: " ve", duration: 0.28, begin: 261.25, index: 711 },
    { text: " e", duration: 0.28, begin: 261.75, index: 712 },
    { text: "vi", duration: 0.28, begin: 262.0, index: 713 },
    { text: "mi", duration: 0.28, begin: 262.25, index: 714 },
    { text: "ze", duration: 0.28, begin: 262.5, index: 715 },
    { text: " dön", duration: 0.28, begin: 262.75, index: 716 },
    { text: "dük.", duration: 0.28, begin: 263.0, index: 717 },
    { text: " O", duration: 0.28, begin: 264.0, index: 718 },
    { text: " ge", duration: 0.28, begin: 264.25, index: 719 },
    { text: "ce", duration: 0.28, begin: 264.5, index: 720 },
    { text: " sir", duration: 0.28, begin: 265.5, index: 721 },
    { text: "ke", duration: 0.28, begin: 265.75, index: 722 },
    { text: " gi", duration: 0.28, begin: 266.0, index: 723 },
    { text: "de", duration: 0.28, begin: 266.25, index: 724 },
    { text: "me", duration: 0.28, begin: 266.5, index: 725 },
    { text: "dik,", duration: 0.28, begin: 266.75, index: 726 },
    { text: " a", duration: 0.28, begin: 267.5, index: 727 },
    { text: "ma", duration: 0.28, begin: 267.75, index: 728 },
    { text: " bu", duration: 0.28, begin: 268.0, index: 729 },
    { text: "nun", duration: 0.28, begin: 268.25, index: 730 },
    { text: " hiç", duration: 0.28, begin: 268.5, index: 731 },
    { text: " ö", duration: 0.28, begin: 268.75, index: 732 },
    { text: "ne", duration: 0.28, begin: 269.0, index: 733 },
    { text: "mi", duration: 0.28, begin: 269.25, index: 734 },
    { text: " yok", duration: 0.28, begin: 269.5, index: 735 },
    { text: "tu.", duration: 0.28, begin: 269.75, index: 736 },
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
                href="/dashboard/stories/hemen-mi-olecegim"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/bambu-agaci"
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
            src="/2-4.mp3"
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
