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
    {
      text: "Bir",
      duration: 0.4,
      begin: 0.25,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Ha",
      duration: 0.4,
      begin: 0.5,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "yır",
      duration: 0.4,
      begin: 0.75,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Var",
      duration: 0.4,
      begin: 1.0,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "dır",
      duration: 0.4,
      begin: 1.25,
      index: 5,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Bir", duration: 0.28, begin: 2.5, index: 6 },
    { text: " za", duration: 0.28, begin: 2.7, index: 7 },
    { text: "man", duration: 0.28, begin: 2.9, index: 8 },
    { text: "lar", duration: 0.28, begin: 3.1, index: 9 },
    { text: " Af", duration: 0.28, begin: 3.5, index: 10 },
    { text: "ri", duration: 0.28, begin: 3.7, index: 11 },
    { text: "ka'", duration: 0.28, begin: 3.9, index: 12 },
    { text: "da", duration: 0.28, begin: 4.1, index: 13 },
    { text: " ki", duration: 0.28, begin: 4.3, index: 14 },
    { text: " bir", duration: 0.28, begin: 4.5, index: 15 },
    { text: " ül", duration: 0.28, begin: 4.7, index: 16 },
    { text: "ke", duration: 0.28, begin: 5.0, index: 17 },
    { text: "de", duration: 0.28, begin: 5.2, index: 18 },
    { text: " hü", duration: 0.28, begin: 6.1, index: 19 },
    { text: "küm", duration: 0.28, begin: 6.3, index: 20 },
    { text: " sü", duration: 0.28, begin: 6.5, index: 21 },
    { text: "ren", duration: 0.28, begin: 6.7, index: 22 },
    { text: " bir", duration: 0.28, begin: 7.1, index: 23 },
    { text: " kral", duration: 0.28, begin: 7.4, index: 24 },
    { text: " var", duration: 0.28, begin: 7.7, index: 25 },
    { text: "dı.", duration: 0.28, begin: 8.0, index: 26 },
    { text: " Kral,", duration: 0.28, begin: 9.0, index: 27 },
    { text: " da", duration: 0.28, begin: 10.2, index: 28 },
    { text: "ha", duration: 0.28, begin: 10.4, index: 29 },
    { text: " ço", duration: 0.38, begin: 10.6, index: 30 },
    { text: "cuk", duration: 0.38, begin: 10.8, index: 31 },
    { text: "lu", duration: 0.38, begin: 11.0, index: 32 },
    { text: "ğun", duration: 0.38, begin: 11.2, index: 33 },
    { text: "dan", duration: 0.38, begin: 11.4, index: 34 },
    { text: " i", duration: 0.38, begin: 11.6, index: 35 },
    { text: "ti", duration: 0.38, begin: 11.9, index: 36 },
    { text: "ba", duration: 0.38, begin: 12.1, index: 37 },
    { text: "ren", duration: 0.38, begin: 12.3, index: 38 },
    { text: " ar", duration: 0.28, begin: 13.3, index: 39 },
    { text: "ka", duration: 0.28, begin: 13.5, index: 40 },
    { text: "daş", duration: 0.28, begin: 13.7, index: 41 },
    { text: " ol", duration: 0.28, begin: 14.1, index: 42 },
    { text: "du", duration: 0.28, begin: 14.3, index: 43 },
    { text: "ğu,", duration: 0.28, begin: 14.5, index: 44 },
    { text: " bir", duration: 0.28, begin: 15.3, index: 45 },
    { text: "lik", duration: 0.28, begin: 15.5, index: 46 },
    { text: "te", duration: 0.28, begin: 15.7, index: 47 },
    { text: " bü", duration: 0.4, begin: 15.9, index: 48 },
    { text: "yü", duration: 0.4, begin: 16.1, index: 49 },
    { text: "dü", duration: 0.4, begin: 16.3, index: 50 },
    { text: "ğü", duration: 0.4, begin: 16.5, index: 51 },
    { text: " bir", duration: 0.4, begin: 16.7, index: 52 },
    { text: " dos", duration: 0.4, begin: 16.9, index: 53 },
    { text: "tu", duration: 0.4, begin: 17.1, index: 54 },
    { text: "nu", duration: 0.4, begin: 17.3, index: 55 },
    { text: " hiç", duration: 0.4, begin: 18.3, index: 56 },
    { text: " ya", duration: 0.4, begin: 18.6, index: 57 },
    { text: "nın", duration: 0.4, begin: 18.8, index: 58 },
    { text: "dan", duration: 0.4, begin: 19.0, index: 59 },
    { text: " a", duration: 0.35, begin: 19.3, index: 60 },
    { text: "yır", duration: 0.35, begin: 19.5, index: 61 },
    { text: "maz", duration: 0.35, begin: 19.7, index: 62 },
    { text: "dı.", duration: 0.35, begin: 19.9, index: 63 },
    { text: " Ne", duration: 0.28, begin: 21.0, index: 64 },
    { text: "re", duration: 0.28, begin: 21.2, index: 65 },
    { text: "ye", duration: 0.28, begin: 21.4, index: 66 },
    { text: " git", duration: 0.28, begin: 21.6, index: 67 },
    { text: "se", duration: 0.28, begin: 21.8, index: 68 },
    { text: " o", duration: 0.28, begin: 22.8, index: 69 },
    { text: "nu", duration: 0.28, begin: 23.0, index: 70 },
    { text: "da", duration: 0.28, begin: 23.2, index: 71 },
    { text: " be", duration: 0.18, begin: 23.4, index: 72 },
    { text: "ra", duration: 0.18, begin: 23.6, index: 73 },
    { text: "be", duration: 0.18, begin: 23.8, index: 74 },
    { text: "rin", duration: 0.18, begin: 24.0, index: 75 },
    { text: "de", duration: 0.18, begin: 24.2, index: 76 },
    { text: " gö", duration: 0.28, begin: 24.4, index: 77 },
    { text: "tü", duration: 0.28, begin: 24.6, index: 78 },
    { text: "rür", duration: 0.28, begin: 24.8, index: 79 },
    { text: "dü.", duration: 0.28, begin: 25.0, index: 80 },
    { text: " Kral", duration: 0.28, begin: 26.0, index: 81 },
    { text: "ın", duration: 0.28, begin: 26.2, index: 82 },
    { text: " bu", duration: 0.28, begin: 26.5, index: 83 },
    { text: " ar", duration: 0.28, begin: 26.7, index: 84 },
    { text: "ka", duration: 0.28, begin: 26.9, index: 85 },
    { text: "da", duration: 0.28, begin: 27.1, index: 86 },
    { text: "şı", duration: 0.28, begin: 27.3, index: 87 },
    { text: "nın", duration: 0.28, begin: 27.5, index: 88 },
    { text: " i", duration: 0.28, begin: 27.7, index: 89 },
    { text: "se", duration: 0.28, begin: 27.9, index: 90 },
    { text: " de", duration: 0.28, begin: 28.8, index: 91 },
    { text: "ği", duration: 0.28, begin: 29.0, index: 92 },
    { text: "şik", duration: 0.28, begin: 29.2, index: 93 },
    { text: " bir", duration: 0.28, begin: 29.4, index: 94 },
    { text: " hu", duration: 0.28, begin: 29.6, index: 95 },
    { text: "yu", duration: 0.28, begin: 29.8, index: 96 },
    { text: " var", duration: 0.28, begin: 30.0, index: 97 },
    { text: "dı.", duration: 0.28, begin: 30.2, index: 98 },
    { text: " İs", duration: 0.4, begin: 31.2, index: 99 },
    { text: "ter", duration: 0.4, begin: 31.4, index: 100 },
    { text: " ken", duration: 0.4, begin: 31.8, index: 101 },
    { text: "di", duration: 0.4, begin: 32.0, index: 102 },
    { text: " ba", duration: 0.4, begin: 32.4, index: 103 },
    { text: "şı", duration: 0.4, begin: 32.6, index: 104 },
    { text: "na", duration: 0.4, begin: 32.8, index: 105 },
    { text: " gel", duration: 0.4, begin: 33.0, index: 106 },
    { text: "sin", duration: 0.4, begin: 33.2, index: 107 },
    { text: " is", duration: 0.28, begin: 34.2, index: 108 },
    { text: "ter", duration: 0.28, begin: 34.4, index: 109 },
    { text: " baş", duration: 0.28, begin: 34.6, index: 110 },
    { text: "ka", duration: 0.28, begin: 34.8, index: 111 },
    { text: "sı", duration: 0.28, begin: 35.0, index: 112 },
    { text: "nın,", duration: 0.28, begin: 35.2, index: 113 },
    { text: " is", duration: 0.28, begin: 36.2, index: 114 },
    { text: "ter", duration: 0.28, begin: 36.4, index: 115 },
    { text: " i", duration: 0.28, begin: 36.6, index: 116 },
    { text: "yi", duration: 0.28, begin: 36.8, index: 117 },
    { text: " ol", duration: 0.28, begin: 37.0, index: 118 },
    { text: "sun", duration: 0.28, begin: 37.2, index: 119 },
    { text: " is", duration: 0.28, begin: 37.8, index: 120 },
    { text: "ter", duration: 0.28, begin: 38.0, index: 121 },
    { text: " kö", duration: 0.28, begin: 38.2, index: 122 },
    { text: "tü", duration: 0.28, begin: 38.4, index: 123 },
    { text: " her", duration: 0.28, begin: 39.6, index: 124 },
    { text: " o", duration: 0.28, begin: 39.8, index: 125 },
    { text: "lay", duration: 0.28, begin: 40.0, index: 126 },
    { text: " kar", duration: 0.4, begin: 40.4, index: 127 },
    { text: "şı", duration: 0.4, begin: 40.6, index: 128 },
    { text: "sın", duration: 0.4, begin: 40.8, index: 129 },
    { text: "da", duration: 0.4, begin: 41.0, index: 130 },
    { text: " hep", duration: 0.4, begin: 41.4, index: 131 },
    { text: " ay", duration: 0.4, begin: 41.8, index: 132 },
    { text: "nı", duration: 0.4, begin: 42.0, index: 133 },
    { text: " şe", duration: 0.4, begin: 42.15, index: 134 },
    { text: "yi", duration: 0.4, begin: 42.3, index: 135 },
    { text: " söy", duration: 0.5, begin: 42.5, index: 136 },
    { text: "ler", duration: 0.5, begin: 42.7, index: 137 },
    { text: "di:", duration: 0.5, begin: 42.9, index: 138 },
    { text: ' "Bun', duration: 0.4, begin: 44.2, index: 139 },
    { text: "da", duration: 0.4, begin: 44.4, index: 140 },
    { text: " da", duration: 0.4, begin: 44.6, index: 141 },
    { text: " bir", duration: 0.4, begin: 44.8, index: 142 },
    { text: " ha", duration: 0.4, begin: 45.0, index: 143 },
    { text: "yır", duration: 0.4, begin: 45.2, index: 144 },
    { text: ' var!"', duration: 0.4, begin: 45.4, index: 145 },
    { text: " Bir", duration: 0.28, begin: 47.0, index: 146 },
    { text: " gün", duration: 0.28, begin: 47.25, index: 147 },
    { text: " kral", duration: 0.28, begin: 47.5, index: 148 },
    { text: "la", duration: 0.28, begin: 47.75, index: 149 },
    { text: " ar", duration: 0.28, begin: 48.25, index: 150 },
    { text: "ka", duration: 0.28, begin: 48.5, index: 151 },
    { text: "da", duration: 0.28, begin: 48.75, index: 152 },
    { text: "şı", duration: 0.28, begin: 49.0, index: 153 },
    { text: " bir", duration: 0.28, begin: 49.25, index: 154 },
    { text: "lik", duration: 0.28, begin: 49.5, index: 155 },
    { text: "te", duration: 0.28, begin: 49.75, index: 156 },
    { text: " a", duration: 0.28, begin: 50.0, index: 157 },
    { text: "va", duration: 0.28, begin: 50.25, index: 158 },
    { text: " çı", duration: 0.28, begin: 50.5, index: 159 },
    { text: "kar", duration: 0.28, begin: 50.75, index: 160 },
    { text: "lar.", duration: 0.28, begin: 51.0, index: 161 },
    { text: " Kral", duration: 0.28, begin: 52.0, index: 162 },
    { text: "ın", duration: 0.28, begin: 52.25, index: 163 },
    { text: " ar", duration: 0.1, begin: 52.5, index: 164 },
    { text: "ka", duration: 0.1, begin: 52.75, index: 165 },
    { text: "da", duration: 0.1, begin: 53.0, index: 166 },
    { text: "şı", duration: 0.1, begin: 53.25, index: 167 },
    { text: " tü", duration: 0.1, begin: 53.5, index: 168 },
    { text: "fek", duration: 0.1, begin: 53.7, index: 169 },
    { text: "le", duration: 0.1, begin: 53.9, index: 170 },
    { text: "ri", duration: 0.1, begin: 54.1, index: 171 },
    { text: " dol", duration: 0.1, begin: 54.3, index: 172 },
    { text: "du", duration: 0.1, begin: 54.5, index: 173 },
    { text: "ru", duration: 0.1, begin: 54.7, index: 174 },
    { text: "yor,", duration: 0.1, begin: 54.9, index: 175 },
    { text: " kral", duration: 0.28, begin: 55.75, index: 176 },
    { text: "a", duration: 0.28, begin: 56.0, index: 177 },
    { text: " ve", duration: 0.28, begin: 56.25, index: 178 },
    { text: "ri", duration: 0.28, begin: 56.5, index: 179 },
    { text: "yor,", duration: 0.28, begin: 56.75, index: 180 },
    { text: " kral", duration: 0.28, begin: 57.5, index: 181 },
    { text: "da", duration: 0.28, begin: 57.75, index: 182 },
    { text: " a", duration: 0.28, begin: 58.0, index: 183 },
    { text: "teş", duration: 0.28, begin: 58.25, index: 184 },
    { text: " e", duration: 0.28, begin: 58.5, index: 185 },
    { text: "di", duration: 0.28, begin: 58.75, index: 186 },
    { text: "yor", duration: 0.28, begin: 59.0, index: 187 },
    { text: "du.", duration: 0.28, begin: 59.25, index: 188 },
    { text: " Ar", duration: 0.28, begin: 60.25, index: 189 },
    { text: "ka", duration: 0.28, begin: 60.5, index: 190 },
    { text: "da", duration: 0.28, begin: 60.75, index: 191 },
    { text: "şı", duration: 0.28, begin: 61.0, index: 192 },
    { text: " muh", duration: 0.28, begin: 61.2, index: 193 },
    { text: "te", duration: 0.28, begin: 61.4, index: 194 },
    { text: "me", duration: 0.28, begin: 61.6, index: 195 },
    { text: "len", duration: 0.28, begin: 61.8, index: 196 },
    { text: " tü", duration: 0.28, begin: 62.0, index: 197 },
    { text: "fek", duration: 0.28, begin: 62.2, index: 198 },
    { text: "ler", duration: 0.28, begin: 62.4, index: 199 },
    { text: "den", duration: 0.28, begin: 62.6, index: 200 },
    { text: " bi", duration: 0.28, begin: 62.9, index: 201 },
    { text: "ri", duration: 0.28, begin: 63.1, index: 202 },
    { text: "ni", duration: 0.28, begin: 63.3, index: 203 },
    { text: " dol", duration: 0.28, begin: 63.6, index: 204 },
    { text: "du", duration: 0.28, begin: 63.8, index: 205 },
    { text: "rur", duration: 0.28, begin: 64.1, index: 206 },
    { text: "ken", duration: 0.28, begin: 64.3, index: 207 },
    { text: " bir", duration: 0.28, begin: 65.25, index: 208 },
    { text: " yan", duration: 0.28, begin: 65.5, index: 209 },
    { text: "lış", duration: 0.28, begin: 65.75, index: 210 },
    { text: "lık", duration: 0.28, begin: 66.0, index: 211 },
    { text: " yap", duration: 0.28, begin: 66.5, index: 212 },
    { text: "tı", duration: 0.28, begin: 66.75, index: 213 },
    { text: " ve", duration: 0.28, begin: 67.0, index: 214 },
    { text: " kral", duration: 0.28, begin: 68.0, index: 215 },
    { text: " a", duration: 0.28, begin: 68.5, index: 216 },
    { text: "teş", duration: 0.28, begin: 68.75, index: 217 },
    { text: " e", duration: 0.28, begin: 69.0, index: 218 },
    { text: "der", duration: 0.28, begin: 69.25, index: 219 },
    { text: "ken", duration: 0.28, begin: 69.5, index: 220 },
    { text: " tü", duration: 0.28, begin: 70.0, index: 221 },
    { text: "fe", duration: 0.28, begin: 70.25, index: 222 },
    { text: "ği", duration: 0.28, begin: 70.5, index: 223 },
    { text: " ge", duration: 0.28, begin: 70.75, index: 224 },
    { text: "ri", duration: 0.28, begin: 71.0, index: 225 },
    { text: "ye", duration: 0.28, begin: 71.25, index: 226 },
    { text: " doğ", duration: 0.1, begin: 71.5, index: 227 },
    { text: "ru", duration: 0.1, begin: 71.75, index: 228 },
    { text: " pat", duration: 0.3, begin: 72.0, index: 229 },
    { text: "la", duration: 0.3, begin: 72.25, index: 230 },
    { text: "dı", duration: 0.3, begin: 72.5, index: 231 },
    { text: " ve", duration: 0.3, begin: 73.5, index: 232 },
    { text: " kral", duration: 0.1, begin: 73.75, index: 233 },
    { text: "ın", duration: 0.1, begin: 74.0, index: 234 },
    { text: " baş", duration: 0.1, begin: 74.25, index: 235 },
    { text: " par", duration: 0.1, begin: 74.5, index: 236 },
    { text: "ma", duration: 0.1, begin: 74.75, index: 237 },
    { text: "ğı", duration: 0.1, begin: 75.0, index: 238 },
    { text: " kop", duration: 0.28, begin: 75.25, index: 239 },
    { text: "tu.", duration: 0.28, begin: 75.5, index: 240 },
    { text: " Du", duration: 0.18, begin: 76.75, index: 241 },
    { text: "ru", duration: 0.18, begin: 77.0, index: 242 },
    { text: "mu", duration: 0.18, begin: 77.25, index: 243 },
    { text: " gö", duration: 0.18, begin: 77.5, index: 244 },
    { text: "ren", duration: 0.18, begin: 77.75, index: 245 },
    { text: " ar", duration: 0.18, begin: 78.0, index: 246 },
    { text: "ka", duration: 0.18, begin: 78.25, index: 247 },
    { text: "da", duration: 0.18, begin: 78.5, index: 248 },
    { text: "şı", duration: 0.18, begin: 78.75, index: 249 },
    { text: " her", duration: 0.28, begin: 79.25, index: 250 },
    { text: " za", duration: 0.28, begin: 79.5, index: 251 },
    { text: "man", duration: 0.28, begin: 79.75, index: 252 },
    { text: " ki", duration: 0.28, begin: 80.0, index: 253 },
    { text: " sö", duration: 0.28, begin: 80.25, index: 254 },
    { text: "zü", duration: 0.28, begin: 80.5, index: 255 },
    { text: "nü", duration: 0.28, begin: 80.75, index: 256 },
    { text: " söy", duration: 0.28, begin: 81.0, index: 257 },
    { text: "le", duration: 0.28, begin: 81.25, index: 258 },
    { text: "di:", duration: 0.28, begin: 81.5, index: 259 },
    { text: ' "Bun', duration: 0.28, begin: 82.5, index: 260 },
    { text: "da", duration: 0.28, begin: 82.7, index: 261 },
    { text: " da", duration: 0.28, begin: 82.9, index: 262 },
    { text: " bir", duration: 0.28, begin: 83.1, index: 263 },
    { text: " ha", duration: 0.28, begin: 83.3, index: 264 },
    { text: "yır", duration: 0.28, begin: 83.5, index: 265 },
    { text: ' var!"', duration: 0.28, begin: 83.7, index: 266 },
    { text: " Kral", duration: 0.28, begin: 85.0, index: 267 },
    { text: " a", duration: 0.28, begin: 85.5, index: 268 },
    { text: "cı", duration: 0.28, begin: 85.75, index: 269 },
    { text: " ve", duration: 0.28, begin: 86.0, index: 270 },
    { text: " öf", duration: 0.28, begin: 86.25, index: 271 },
    { text: "key", duration: 0.28, begin: 86.5, index: 272 },
    { text: "le", duration: 0.28, begin: 86.75, index: 273 },
    { text: " ba", duration: 0.28, begin: 87.0, index: 274 },
    { text: "ğır", duration: 0.28, begin: 87.25, index: 275 },
    { text: "dı:", duration: 0.28, begin: 87.5, index: 276 },
    { text: ' "Bun', duration: 0.28, begin: 88.25, index: 277 },
    { text: "da", duration: 0.28, begin: 88.5, index: 278 },
    { text: " ha", duration: 0.28, begin: 88.75, index: 279 },
    { text: "yır", duration: 0.28, begin: 89.0, index: 280 },
    { text: " fi", duration: 0.28, begin: 89.25, index: 281 },
    { text: "lan", duration: 0.28, begin: 89.5, index: 282 },
    { text: " yok!", duration: 0.28, begin: 89.75, index: 283 },
    { text: " Gör", duration: 0.28, begin: 90.75, index: 284 },
    { text: "mü", duration: 0.28, begin: 91.0, index: 285 },
    { text: "yor", duration: 0.28, begin: 91.25, index: 286 },
    { text: " mu", duration: 0.28, begin: 91.5, index: 287 },
    { text: "sun,", duration: 0.28, begin: 91.75, index: 288 },
    { text: " par", duration: 0.28, begin: 92.25, index: 289 },
    { text: "ma", duration: 0.28, begin: 92.5, index: 290 },
    { text: "ğım", duration: 0.28, begin: 92.75, index: 291 },
    { text: " kop", duration: 0.28, begin: 93.0, index: 292 },
    { text: 'tu!"', duration: 0.28, begin: 93.25, index: 293 },
    { text: " Ve", duration: 0.28, begin: 94.25, index: 294 },
    { text: " son", duration: 0.28, begin: 94.5, index: 295 },
    { text: "ra", duration: 0.28, begin: 94.75, index: 296 },
    { text: " kız", duration: 0.28, begin: 95.5, index: 297 },
    { text: "gın", duration: 0.28, begin: 95.75, index: 298 },
    { text: "lı", duration: 0.28, begin: 96.0, index: 299 },
    { text: "ğı", duration: 0.28, begin: 96.25, index: 300 },
    { text: " geç", duration: 0.28, begin: 96.5, index: 301 },
    { text: "me", duration: 0.28, begin: 96.75, index: 302 },
    { text: "di", duration: 0.28, begin: 97.0, index: 303 },
    { text: "ği", duration: 0.28, begin: 97.25, index: 304 },
    { text: " i", duration: 0.28, begin: 97.5, index: 305 },
    { text: "çin", duration: 0.28, begin: 97.75, index: 306 },
    { text: " ar", duration: 0.28, begin: 98.25, index: 307 },
    { text: "ka", duration: 0.28, begin: 98.5, index: 308 },
    { text: "da", duration: 0.28, begin: 98.75, index: 309 },
    { text: "şı", duration: 0.28, begin: 99.0, index: 310 },
    { text: "nı", duration: 0.28, begin: 99.25, index: 311 },
    { text: " zin", duration: 0.28, begin: 99.5, index: 312 },
    { text: "da", duration: 0.28, begin: 99.75, index: 313 },
    { text: "na", duration: 0.28, begin: 100.0, index: 314 },
    { text: " at", duration: 0.28, begin: 100.25, index: 315 },
    { text: "tır", duration: 0.28, begin: 100.5, index: 316 },
    { text: "dı.", duration: 0.28, begin: 100.75, index: 317 },
    { text: " Bir", duration: 0.28, begin: 102.0, index: 318 },
    { text: " yıl", duration: 0.28, begin: 102.25, index: 319 },
    { text: " ka", duration: 0.28, begin: 102.5, index: 320 },
    { text: "dar", duration: 0.28, begin: 102.75, index: 321 },
    { text: " son", duration: 0.28, begin: 103.0, index: 322 },
    { text: "ra,", duration: 0.28, begin: 103.25, index: 323 },
    { text: " kral", duration: 0.28, begin: 104.25, index: 324 },
    { text: " in", duration: 0.28, begin: 104.75, index: 325 },
    { text: "san", duration: 0.28, begin: 105.0, index: 326 },
    { text: " yi", duration: 0.28, begin: 105.25, index: 327 },
    { text: "yen", duration: 0.28, begin: 105.5, index: 328 },
    { text: " ka", duration: 0.28, begin: 105.75, index: 329 },
    { text: "bi", duration: 0.28, begin: 106.0, index: 330 },
    { text: "le", duration: 0.28, begin: 106.25, index: 331 },
    { text: "le", duration: 0.28, begin: 106.5, index: 332 },
    { text: "rin", duration: 0.28, begin: 106.75, index: 333 },
    { text: " ya", duration: 0.28, begin: 107.0, index: 334 },
    { text: "şa", duration: 0.28, begin: 107.25, index: 335 },
    { text: "dı", duration: 0.28, begin: 107.5, index: 336 },
    { text: "ğı", duration: 0.28, begin: 107.75, index: 337 },
    { text: " ve", duration: 0.28, begin: 108.0, index: 338 },
    { text: " as", duration: 0.28, begin: 108.75, index: 339 },
    { text: "lın", duration: 0.28, begin: 109.0, index: 340 },
    { text: "da", duration: 0.28, begin: 109.25, index: 341 },
    { text: " u", duration: 0.28, begin: 109.5, index: 342 },
    { text: "zak", duration: 0.28, begin: 109.75, index: 343 },
    { text: " dur", duration: 0.28, begin: 110.0, index: 344 },
    { text: "ma", duration: 0.28, begin: 110.25, index: 345 },
    { text: "sı", duration: 0.28, begin: 110.5, index: 346 },
    { text: " ge", duration: 0.28, begin: 110.75, index: 347 },
    { text: "re", duration: 0.28, begin: 111.0, index: 348 },
    { text: "ken", duration: 0.28, begin: 111.25, index: 349 },
    { text: " bir", duration: 0.28, begin: 111.5, index: 350 },
    { text: " böl", duration: 0.28, begin: 111.75, index: 351 },
    { text: "ge", duration: 0.28, begin: 112.0, index: 352 },
    { text: "de", duration: 0.28, begin: 112.25, index: 353 },
    { text: " bir", duration: 0.28, begin: 113.0, index: 354 },
    { text: "kaç", duration: 0.28, begin: 113.25, index: 355 },
    { text: " a", duration: 0.28, begin: 113.5, index: 356 },
    { text: "da", duration: 0.28, begin: 113.75, index: 357 },
    { text: "mıy", duration: 0.28, begin: 114.0, index: 358 },
    { text: "la", duration: 0.28, begin: 114.25, index: 359 },
    { text: " bir", duration: 0.28, begin: 114.5, index: 360 },
    { text: "lik", duration: 0.28, begin: 114.75, index: 361 },
    { text: "te", duration: 0.28, begin: 115.0, index: 362 },
    { text: " av", duration: 0.28, begin: 115.6, index: 363 },
    { text: "la", duration: 0.28, begin: 115.8, index: 364 },
    { text: "nı", duration: 0.28, begin: 116.0, index: 365 },
    { text: "yor", duration: 0.28, begin: 116.2, index: 366 },
    { text: "du.", duration: 0.28, begin: 116.4, index: 367 },
    { text: " Yam", duration: 0.28, begin: 117.5, index: 368 },
    { text: " yam", duration: 0.28, begin: 117.75, index: 369 },
    { text: "lar", duration: 0.28, begin: 118.0, index: 370 },
    { text: " on", duration: 0.28, begin: 118.5, index: 371 },
    { text: "la", duration: 0.28, begin: 118.75, index: 372 },
    { text: "rı", duration: 0.28, begin: 119.0, index: 373 },
    { text: " e", duration: 0.28, begin: 119.2, index: 374 },
    { text: "le", duration: 0.28, begin: 119.4, index: 375 },
    { text: " ge", duration: 0.28, begin: 119.6, index: 376 },
    { text: "çir", duration: 0.28, begin: 119.8, index: 377 },
    { text: "dil", duration: 0.28, begin: 120.0, index: 378 },
    { text: "ler", duration: 0.28, begin: 120.2, index: 379 },
    { text: " ve", duration: 0.28, begin: 120.4, index: 380 },
    { text: " köy", duration: 0.28, begin: 121.25, index: 381 },
    { text: "le", duration: 0.28, begin: 121.5, index: 382 },
    { text: "ri", duration: 0.28, begin: 121.75, index: 383 },
    { text: "ne", duration: 0.28, begin: 122.0, index: 384 },
    { text: " gö", duration: 0.28, begin: 122.25, index: 385 },
    { text: "tür", duration: 0.28, begin: 122.5, index: 386 },
    { text: "dü", duration: 0.28, begin: 122.75, index: 387 },
    { text: "ler.", duration: 0.28, begin: 123.0, index: 388 },
    { text: " El", duration: 0.28, begin: 124.0, index: 389 },
    { text: "le", duration: 0.28, begin: 124.25, index: 390 },
    { text: "ri", duration: 0.28, begin: 124.5, index: 391 },
    { text: "ni,", duration: 0.28, begin: 124.75, index: 392 },
    { text: " a", duration: 0.28, begin: 125.5, index: 393 },
    { text: "yak", duration: 0.28, begin: 125.7, index: 394 },
    { text: "la", duration: 0.28, begin: 125.9, index: 395 },
    { text: "rı", duration: 0.28, begin: 126.1, index: 396 },
    { text: "nı", duration: 0.28, begin: 126.3, index: 397 },
    { text: " bağ", duration: 0.28, begin: 126.5, index: 398 },
    { text: "la", duration: 0.28, begin: 126.7, index: 399 },
    { text: "dı", duration: 0.28, begin: 126.9, index: 400 },
    { text: "lar", duration: 0.28, begin: 127.0, index: 401 },
    { text: " ve", duration: 0.28, begin: 127.25, index: 402 },
    { text: " kö", duration: 0.28, begin: 128.0, index: 403 },
    { text: "yün", duration: 0.28, begin: 128.25, index: 404 },
    { text: " mey", duration: 0.28, begin: 128.5, index: 405 },
    { text: "da", duration: 0.28, begin: 128.75, index: 406 },
    { text: "nı", duration: 0.28, begin: 129.0, index: 407 },
    { text: "na", duration: 0.28, begin: 129.25, index: 408 },
    { text: " o", duration: 0.28, begin: 129.75, index: 409 },
    { text: "dun", duration: 0.28, begin: 130.0, index: 410 },
    { text: " yığ", duration: 0.28, begin: 130.25, index: 411 },
    { text: "dı", duration: 0.28, begin: 130.5, index: 412 },
    { text: "lar.", duration: 0.28, begin: 130.75, index: 413 },
    { text: " Son", duration: 0.28, begin: 131.75, index: 414 },
    { text: "ra", duration: 0.28, begin: 132.0, index: 415 },
    { text: "da", duration: 0.28, begin: 132.25, index: 416 },
    { text: " o", duration: 0.28, begin: 132.5, index: 417 },
    { text: "dun", duration: 0.28, begin: 132.75, index: 418 },
    { text: "la", duration: 0.28, begin: 133.0, index: 419 },
    { text: "rın", duration: 0.28, begin: 133.25, index: 420 },
    { text: " or", duration: 0.28, begin: 133.5, index: 421 },
    { text: "ta", duration: 0.28, begin: 133.75, index: 422 },
    { text: "sı", duration: 0.28, begin: 134.0, index: 423 },
    { text: "na", duration: 0.28, begin: 134.25, index: 424 },
    { text: " dik", duration: 0.28, begin: 134.5, index: 425 },
    { text: "tik", duration: 0.28, begin: 134.75, index: 426 },
    { text: "le", duration: 0.28, begin: 135.0, index: 427 },
    { text: "ri", duration: 0.28, begin: 135.25, index: 428 },
    { text: " di", duration: 0.28, begin: 135.5, index: 429 },
    { text: "rek", duration: 0.28, begin: 135.7, index: 430 },
    { text: "le", duration: 0.28, begin: 135.9, index: 431 },
    { text: "re", duration: 0.28, begin: 136.1, index: 432 },
    { text: " bağ", duration: 0.28, begin: 136.3, index: 433 },
    { text: "la", duration: 0.28, begin: 136.5, index: 434 },
    { text: "dı", duration: 0.28, begin: 136.7, index: 435 },
    { text: "lar.", duration: 0.28, begin: 136.9, index: 436 },
    { text: " Tam", duration: 0.28, begin: 138.25, index: 437 },
    { text: " o", duration: 0.28, begin: 138.5, index: 438 },
    { text: "dun", duration: 0.28, begin: 138.75, index: 439 },
    { text: "la", duration: 0.28, begin: 139.0, index: 440 },
    { text: "rı", duration: 0.28, begin: 139.25, index: 441 },
    { text: " tu", duration: 0.28, begin: 139.5, index: 442 },
    { text: "tuş", duration: 0.28, begin: 139.75, index: 443 },
    { text: "tur", duration: 0.28, begin: 140.0, index: 444 },
    { text: "ma", duration: 0.28, begin: 140.25, index: 445 },
    { text: "ya", duration: 0.28, begin: 140.5, index: 446 },
    { text: " ge", duration: 0.28, begin: 140.7, index: 447 },
    { text: "li", duration: 0.28, begin: 140.9, index: 448 },
    { text: "yor", duration: 0.28, begin: 141.1, index: 449 },
    { text: "lar", duration: 0.28, begin: 141.3, index: 450 },
    { text: "dı", duration: 0.28, begin: 141.5, index: 451 },
    { text: " ki,", duration: 0.28, begin: 141.7, index: 452 },
    { text: " kral", duration: 0.28, begin: 142.9, index: 453 },
    { text: "ın", duration: 0.28, begin: 143.1, index: 454 },
    { text: " baş", duration: 0.4, begin: 143.25, index: 455 },
    { text: " par", duration: 0.4, begin: 143.5, index: 456 },
    { text: "ma", duration: 0.4, begin: 143.75, index: 457 },
    { text: "ğı", duration: 0.4, begin: 144.0, index: 458 },
    { text: "nın", duration: 0.4, begin: 144.25, index: 459 },
    { text: " ol", duration: 0.28, begin: 144.5, index: 460 },
    { text: "ma", duration: 0.28, begin: 144.75, index: 461 },
    { text: "dı", duration: 0.28, begin: 145.0, index: 462 },
    { text: "ğı", duration: 0.28, begin: 145.25, index: 463 },
    { text: "nı", duration: 0.28, begin: 145.5, index: 464 },
    { text: " fark", duration: 0.28, begin: 145.75, index: 465 },
    { text: " et", duration: 0.28, begin: 146.0, index: 466 },
    { text: "ti", duration: 0.28, begin: 146.25, index: 467 },
    { text: "ler.", duration: 0.28, begin: 146.5, index: 468 },
    { text: " Bu", duration: 0.28, begin: 147.75, index: 469 },
    { text: " ka", duration: 0.28, begin: 148.0, index: 470 },
    { text: "bi", duration: 0.28, begin: 148.25, index: 471 },
    { text: "le,", duration: 0.28, begin: 148.5, index: 472 },
    { text: " ba", duration: 0.28, begin: 149.25, index: 473 },
    { text: "tıl", duration: 0.28, begin: 149.5, index: 474 },
    { text: " i", duration: 0.28, begin: 149.75, index: 475 },
    { text: "nanç", duration: 0.28, begin: 150.0, index: 476 },
    { text: "la", duration: 0.28, begin: 150.25, index: 477 },
    { text: "rı", duration: 0.28, begin: 150.5, index: 478 },
    { text: " ne", duration: 0.28, begin: 150.75, index: 479 },
    { text: "de", duration: 0.28, begin: 151.0, index: 480 },
    { text: "niy", duration: 0.28, begin: 151.25, index: 481 },
    { text: "le", duration: 0.28, begin: 151.5, index: 482 },
    { text: " u", duration: 0.28, begin: 152.25, index: 483 },
    { text: "zuv", duration: 0.28, begin: 152.5, index: 484 },
    { text: "la", duration: 0.28, begin: 152.75, index: 485 },
    { text: "rın", duration: 0.28, begin: 153.0, index: 486 },
    { text: "dan", duration: 0.28, begin: 153.25, index: 487 },
    { text: " bi", duration: 0.28, begin: 153.5, index: 488 },
    { text: "ri", duration: 0.28, begin: 153.75, index: 489 },
    { text: " ek", duration: 0.28, begin: 154.0, index: 490 },
    { text: "sik", duration: 0.28, begin: 154.25, index: 491 },
    { text: " o", duration: 0.28, begin: 154.5, index: 492 },
    { text: "lan", duration: 0.28, begin: 154.75, index: 493 },
    { text: " in", duration: 0.28, begin: 155.0, index: 494 },
    { text: "san", duration: 0.28, begin: 155.25, index: 495 },
    { text: "la", duration: 0.28, begin: 155.5, index: 496 },
    { text: "rı", duration: 0.28, begin: 155.75, index: 497 },
    { text: " ye", duration: 0.28, begin: 156.5, index: 498 },
    { text: "mi", duration: 0.28, begin: 156.75, index: 499 },
    { text: "yor", duration: 0.28, begin: 157.0, index: 500 },
    { text: "du.", duration: 0.28, begin: 157.25, index: 501 },
    { text: " Böy", duration: 0.28, begin: 158.75, index: 502 },
    { text: "le", duration: 0.28, begin: 159.0, index: 503 },
    { text: " bir", duration: 0.28, begin: 159.25, index: 504 },
    { text: " in", duration: 0.28, begin: 159.5, index: 505 },
    { text: "sa", duration: 0.28, begin: 159.75, index: 506 },
    { text: "nı", duration: 0.28, begin: 160.0, index: 507 },
    { text: " ye", duration: 0.28, begin: 160.25, index: 508 },
    { text: "dik", duration: 0.28, begin: 160.5, index: 509 },
    { text: "le", duration: 0.28, begin: 160.75, index: 510 },
    { text: "ri", duration: 0.28, begin: 161.0, index: 511 },
    { text: " tak", duration: 0.28, begin: 161.25, index: 512 },
    { text: "dir", duration: 0.28, begin: 161.5, index: 513 },
    { text: "de", duration: 0.28, begin: 161.75, index: 514 },
    { text: " baş", duration: 0.28, begin: 162.5, index: 515 },
    { text: "la", duration: 0.28, begin: 162.7, index: 516 },
    { text: "rı", duration: 0.28, begin: 162.9, index: 517 },
    { text: "na", duration: 0.28, begin: 163.1, index: 518 },
    { text: " kö", duration: 0.28, begin: 163.5, index: 519 },
    { text: "tü", duration: 0.28, begin: 163.7, index: 520 },
    { text: " şey", duration: 0.28, begin: 163.9, index: 521 },
    { text: "ler", duration: 0.28, begin: 164.1, index: 522 },
    { text: " ge", duration: 0.13, begin: 164.5, index: 523 },
    { text: "le", duration: 0.13, begin: 164.7, index: 524 },
    { text: "ce", duration: 0.13, begin: 164.9, index: 525 },
    { text: "ği", duration: 0.13, begin: 165.1, index: 526 },
    { text: "ne", duration: 0.13, begin: 165.3, index: 527 },
    { text: " i", duration: 0.28, begin: 165.5, index: 528 },
    { text: "na", duration: 0.28, begin: 165.7, index: 529 },
    { text: "nı", duration: 0.28, begin: 165.9, index: 530 },
    { text: "yor", duration: 0.28, begin: 166.1, index: 531 },
    { text: "lar", duration: 0.28, begin: 166.3, index: 532 },
    { text: "dı.", duration: 0.28, begin: 166.5, index: 533 },
    { text: " Bu", duration: 0.4, begin: 167.5, index: 534 },
    { text: " kor", duration: 0.4, begin: 167.7, index: 535 },
    { text: "kuy", duration: 0.4, begin: 167.9, index: 536 },
    { text: "la,", duration: 0.4, begin: 168.1, index: 537 },
    { text: " kral", duration: 0.28, begin: 169.3, index: 538 },
    { text: "ı", duration: 0.28, begin: 169.5, index: 539 },
    { text: " çöz", duration: 0.38, begin: 169.7, index: 540 },
    { text: "dü", duration: 0.38, begin: 169.9, index: 541 },
    { text: "ler", duration: 0.38, begin: 170.1, index: 542 },
    { text: " ve", duration: 0.38, begin: 170.3, index: 543 },
    { text: " sa", duration: 0.38, begin: 170.7, index: 544 },
    { text: "lı", duration: 0.38, begin: 170.9, index: 545 },
    { text: "ver", duration: 0.38, begin: 171.1, index: 546 },
    { text: "di", duration: 0.38, begin: 171.3, index: 547 },
    { text: "ler.", duration: 0.38, begin: 171.5, index: 548 },
    { text: " Di", duration: 0.28, begin: 172.7, index: 549 },
    { text: "ğer", duration: 0.28, begin: 172.9, index: 550 },
    { text: " a", duration: 0.28, begin: 173.1, index: 551 },
    { text: "dam", duration: 0.28, begin: 173.3, index: 552 },
    { text: "la", duration: 0.28, begin: 173.5, index: 553 },
    { text: "rı", duration: 0.28, begin: 173.7, index: 554 },
    { text: " i", duration: 0.28, begin: 173.9, index: 555 },
    { text: "se", duration: 0.28, begin: 174.1, index: 556 },
    { text: " pi", duration: 0.28, begin: 174.5, index: 557 },
    { text: "şi", duration: 0.28, begin: 174.7, index: 558 },
    { text: "rip", duration: 0.28, begin: 174.9, index: 559 },
    { text: " ye", duration: 0.28, begin: 175.1, index: 560 },
    { text: "di", duration: 0.28, begin: 175.3, index: 561 },
    { text: "ler.", duration: 0.28, begin: 175.5, index: 562 },
    { text: " Sa", duration: 0.28, begin: 176.7, index: 563 },
    { text: "ra", duration: 0.28, begin: 176.9, index: 564 },
    { text: "yı", duration: 0.28, begin: 177.1, index: 565 },
    { text: "na", duration: 0.28, begin: 177.3, index: 566 },
    { text: " dön", duration: 0.28, begin: 177.5, index: 567 },
    { text: "dü", duration: 0.28, begin: 177.7, index: 568 },
    { text: "ğün", duration: 0.28, begin: 177.9, index: 569 },
    { text: "de,", duration: 0.28, begin: 178.1, index: 570 },
    { text: " kur", duration: 0.28, begin: 179.1, index: 571 },
    { text: "tu", duration: 0.28, begin: 179.3, index: 572 },
    { text: "lu", duration: 0.28, begin: 179.5, index: 573 },
    { text: "şu", duration: 0.28, begin: 179.7, index: 574 },
    { text: "nun", duration: 0.28, begin: 179.9, index: 575 },
    { text: " ko", duration: 0.28, begin: 180.3, index: 576 },
    { text: "puk", duration: 0.28, begin: 180.5, index: 577 },
    { text: " par", duration: 0.28, begin: 180.7, index: 578 },
    { text: "ma", duration: 0.28, begin: 180.9, index: 579 },
    { text: "ğı", duration: 0.28, begin: 181.1, index: 580 },
    { text: " sa", duration: 0.28, begin: 181.5, index: 581 },
    { text: "ye", duration: 0.28, begin: 181.7, index: 582 },
    { text: "sin", duration: 0.28, begin: 181.9, index: 583 },
    { text: "de", duration: 0.28, begin: 182.1, index: 584 },
    { text: " ger", duration: 0.28, begin: 182.5, index: 585 },
    { text: "çek", duration: 0.28, begin: 182.7, index: 586 },
    { text: "leş", duration: 0.28, begin: 182.9, index: 587 },
    { text: "ti", duration: 0.28, begin: 183.1, index: 588 },
    { text: "ği", duration: 0.28, begin: 183.3, index: 589 },
    { text: "ni", duration: 0.28, begin: 183.5, index: 590 },
    { text: " an", duration: 0.28, begin: 183.9, index: 591 },
    { text: "la", duration: 0.28, begin: 184.1, index: 592 },
    { text: "yan", duration: 0.28, begin: 184.3, index: 593 },
    { text: " kral,", duration: 0.28, begin: 184.7, index: 594 },
    { text: " on", duration: 0.28, begin: 186.1, index: 595 },
    { text: "ca", duration: 0.28, begin: 186.3, index: 596 },
    { text: " yıl", duration: 0.28, begin: 186.5, index: 597 },
    { text: "lık", duration: 0.28, begin: 186.7, index: 598 },
    { text: " ar", duration: 0.28, begin: 187.1, index: 599 },
    { text: "ka", duration: 0.28, begin: 187.3, index: 600 },
    { text: "da", duration: 0.28, begin: 187.5, index: 601 },
    { text: "şı", duration: 0.28, begin: 187.7, index: 602 },
    { text: "na", duration: 0.28, begin: 187.9, index: 603 },
    { text: " re", duration: 0.28, begin: 188.3, index: 604 },
    { text: "va", duration: 0.28, begin: 188.5, index: 605 },
    { text: " gör", duration: 0.28, begin: 188.7, index: 606 },
    { text: "dü", duration: 0.28, begin: 188.9, index: 607 },
    { text: "ğü", duration: 0.28, begin: 189.1, index: 608 },
    { text: " mu", duration: 0.28, begin: 189.3, index: 609 },
    { text: "a", duration: 0.28, begin: 189.5, index: 610 },
    { text: "me", duration: 0.28, begin: 189.7, index: 611 },
    { text: "le", duration: 0.28, begin: 189.9, index: 612 },
    { text: "den", duration: 0.28, begin: 190.1, index: 613 },
    { text: " do", duration: 0.28, begin: 190.3, index: 614 },
    { text: "la", duration: 0.28, begin: 190.5, index: 615 },
    { text: "yı", duration: 0.28, begin: 190.7, index: 616 },
    { text: " piş", duration: 0.28, begin: 191.9, index: 617 },
    { text: "man", duration: 0.28, begin: 192.1, index: 618 },
    { text: " ol", duration: 0.28, begin: 192.3, index: 619 },
    { text: "du.", duration: 0.28, begin: 192.5, index: 620 },
    { text: " He", duration: 0.28, begin: 193.7, index: 621 },
    { text: "men", duration: 0.28, begin: 193.9, index: 622 },
    { text: " zin", duration: 0.28, begin: 194.1, index: 623 },
    { text: "da", duration: 0.28, begin: 194.3, index: 624 },
    { text: "na", duration: 0.28, begin: 194.5, index: 625 },
    { text: " koş", duration: 0.28, begin: 194.9, index: 626 },
    { text: "tu", duration: 0.28, begin: 195.1, index: 627 },
    { text: " ve", duration: 0.28, begin: 195.3, index: 628 },
    { text: " zin", duration: 0.28, begin: 196.5, index: 629 },
    { text: "dan", duration: 0.28, begin: 196.7, index: 630 },
    { text: "dan", duration: 0.28, begin: 196.9, index: 631 },
    { text: " çı", duration: 0.28, begin: 197.3, index: 632 },
    { text: "kar", duration: 0.28, begin: 197.5, index: 633 },
    { text: "dı", duration: 0.28, begin: 197.7, index: 634 },
    { text: "ğı", duration: 0.28, begin: 197.9, index: 635 },
    { text: " ar", duration: 0.28, begin: 198.3, index: 636 },
    { text: "ka", duration: 0.28, begin: 198.5, index: 637 },
    { text: "da", duration: 0.28, begin: 198.7, index: 638 },
    { text: "şı", duration: 0.28, begin: 198.9, index: 639 },
    { text: "na", duration: 0.28, begin: 199.1, index: 640 },
    { text: " ba", duration: 0.28, begin: 200.1, index: 641 },
    { text: "şın", duration: 0.28, begin: 200.3, index: 642 },
    { text: "dan", duration: 0.28, begin: 200.5, index: 643 },
    { text: " ge", duration: 0.28, begin: 200.7, index: 644 },
    { text: "çen", duration: 0.28, begin: 200.9, index: 645 },
    { text: "le", duration: 0.28, begin: 201.1, index: 646 },
    { text: "ri", duration: 0.28, begin: 201.3, index: 647 },
    { text: " bir", duration: 0.28, begin: 201.7, index: 648 },
    { text: " bir", duration: 0.28, begin: 201.9, index: 649 },
    { text: " an", duration: 0.28, begin: 202.1, index: 650 },
    { text: "lat", duration: 0.28, begin: 202.3, index: 651 },
    { text: "tı.", duration: 0.28, begin: 202.5, index: 652 },
    { text: ' "Hak', duration: 0.28, begin: 203.9, index: 653 },
    { text: "lıy", duration: 0.28, begin: 204.1, index: 654 },
    { text: "mış", duration: 0.28, begin: 204.3, index: 655 },
    { text: 'sın!"', duration: 0.28, begin: 204.5, index: 656 },
    { text: " de", duration: 0.28, begin: 205.3, index: 657 },
    { text: "di.", duration: 0.28, begin: 205.5, index: 658 },
    { text: ' "Par', duration: 0.28, begin: 206.5, index: 659 },
    { text: "ma", duration: 0.28, begin: 206.7, index: 660 },
    { text: "ğı", duration: 0.28, begin: 206.9, index: 661 },
    { text: "mın", duration: 0.28, begin: 207.1, index: 662 },
    { text: " kop", duration: 0.28, begin: 207.5, index: 663 },
    { text: "ma", duration: 0.28, begin: 207.7, index: 664 },
    { text: "sın", duration: 0.28, begin: 207.9, index: 665 },
    { text: "da", duration: 0.28, begin: 208.1, index: 666 },
    { text: " ger", duration: 0.4, begin: 208.5, index: 667 },
    { text: "çek", duration: 0.4, begin: 208.7, index: 668 },
    { text: "ten", duration: 0.4, begin: 208.9, index: 669 },
    { text: "de", duration: 0.4, begin: 209.1, index: 670 },
    { text: " bir", duration: 0.28, begin: 210.3, index: 671 },
    { text: " ha", duration: 0.28, begin: 210.5, index: 672 },
    { text: "yır", duration: 0.28, begin: 210.7, index: 673 },
    { text: " var", duration: 0.28, begin: 210.9, index: 674 },
    { text: "mış.", duration: 0.28, begin: 211.1, index: 675 },
    { text: " İş", duration: 0.4, begin: 212.3, index: 676 },
    { text: "te", duration: 0.4, begin: 212.5, index: 677 },
    { text: " bu", duration: 0.4, begin: 212.7, index: 678 },
    { text: " yüz", duration: 0.4, begin: 212.9, index: 679 },
    { text: "den,", duration: 0.4, begin: 213.1, index: 680 },
    { text: " se", duration: 0.28, begin: 214.1, index: 681 },
    { text: "ni", duration: 0.28, begin: 214.3, index: 682 },
    { text: " bu", duration: 0.28, begin: 214.7, index: 683 },
    { text: " ka", duration: 0.28, begin: 214.9, index: 684 },
    { text: "dar", duration: 0.28, begin: 215.1, index: 685 },
    { text: " u", duration: 0.28, begin: 215.5, index: 686 },
    { text: "zun", duration: 0.28, begin: 215.7, index: 687 },
    { text: " sü", duration: 0.28, begin: 215.9, index: 688 },
    { text: "re", duration: 0.28, begin: 216.1, index: 689 },
    { text: " zin", duration: 0.4, begin: 216.3, index: 690 },
    { text: "dan", duration: 0.4, begin: 216.5, index: 691 },
    { text: "da", duration: 0.4, begin: 216.7, index: 692 },
    { text: " tut", duration: 0.4, begin: 216.9, index: 693 },
    { text: "tu", duration: 0.4, begin: 217.1, index: 694 },
    { text: "ğum", duration: 0.4, begin: 217.3, index: 695 },
    { text: " i", duration: 0.4, begin: 217.5, index: 696 },
    { text: "çin", duration: 0.4, begin: 217.7, index: 697 },
    { text: " ö", duration: 0.28, begin: 218.9, index: 698 },
    { text: "zür", duration: 0.28, begin: 219.1, index: 699 },
    { text: " di", duration: 0.28, begin: 219.3, index: 700 },
    { text: "li", duration: 0.28, begin: 219.5, index: 701 },
    { text: "yo", duration: 0.28, begin: 219.7, index: 702 },
    { text: "rum.", duration: 0.28, begin: 219.9, index: 703 },
    { text: " Yap", duration: 0.4, begin: 220.7, index: 704 },
    { text: "tı", duration: 0.4, begin: 220.9, index: 705 },
    { text: "ğım", duration: 0.4, begin: 221.1, index: 706 },
    { text: " çok", duration: 0.28, begin: 221.5, index: 707 },
    { text: " hak", duration: 0.28, begin: 221.9, index: 708 },
    { text: "sız", duration: 0.28, begin: 222.1, index: 709 },
    { text: " ve", duration: 0.28, begin: 222.3, index: 710 },
    { text: " kö", duration: 0.28, begin: 223.3, index: 711 },
    { text: "tü", duration: 0.28, begin: 223.5, index: 712 },
    { text: " bir", duration: 0.28, begin: 223.7, index: 713 },
    { text: " şey", duration: 0.28, begin: 223.9, index: 714 },
    { text: 'di."', duration: 0.28, begin: 224.1, index: 715 },
    { text: ' "Ha', duration: 0.28, begin: 225.5, index: 716 },
    { text: 'yır"', duration: 0.28, begin: 225.7, index: 717 },
    { text: " di", duration: 0.28, begin: 226.3, index: 718 },
    { text: "ye", duration: 0.28, begin: 226.5, index: 719 },
    { text: " kar", duration: 0.28, begin: 226.7, index: 720 },
    { text: "şı", duration: 0.28, begin: 226.9, index: 721 },
    { text: "lık", duration: 0.28, begin: 227.1, index: 722 },
    { text: " ver", duration: 0.28, begin: 227.3, index: 723 },
    { text: "di", duration: 0.28, begin: 227.5, index: 724 },
    { text: " ar", duration: 0.28, begin: 227.9, index: 725 },
    { text: "ka", duration: 0.28, begin: 228.1, index: 726 },
    { text: "da", duration: 0.28, begin: 228.3, index: 727 },
    { text: "şı.", duration: 0.28, begin: 228.5, index: 728 },
    { text: ' "Bun', duration: 0.28, begin: 229.5, index: 729 },
    { text: "da", duration: 0.28, begin: 229.7, index: 730 },
    { text: " da", duration: 0.28, begin: 229.9, index: 731 },
    { text: " bir", duration: 0.28, begin: 230.1, index: 732 },
    { text: " ha", duration: 0.28, begin: 230.3, index: 733 },
    { text: "yır", duration: 0.28, begin: 230.5, index: 734 },
    { text: ' var."', duration: 0.28, begin: 230.7, index: 735 },
    { text: ' "Ne', duration: 0.28, begin: 231.7, index: 736 },
    { text: " di", duration: 0.28, begin: 231.9, index: 737 },
    { text: "yor", duration: 0.28, begin: 232.1, index: 738 },
    { text: "sun", duration: 0.28, begin: 232.3, index: 739 },
    { text: " Al", duration: 0.28, begin: 232.7, index: 740 },
    { text: "lah", duration: 0.28, begin: 232.9, index: 741 },
    { text: " aş", duration: 0.28, begin: 233.1, index: 742 },
    { text: "kı", duration: 0.28, begin: 233.3, index: 743 },
    { text: 'na?"', duration: 0.28, begin: 233.5, index: 744 },
    { text: " di", duration: 0.28, begin: 234.3, index: 745 },
    { text: "ye", duration: 0.28, begin: 234.5, index: 746 },
    { text: " hay", duration: 0.28, begin: 234.9, index: 747 },
    { text: "ret", duration: 0.28, begin: 235.1, index: 748 },
    { text: "le", duration: 0.28, begin: 235.2, index: 749 },
    { text: " ba", duration: 0.28, begin: 235.7, index: 750 },
    { text: "ğır", duration: 0.28, begin: 235.9, index: 751 },
    { text: "dı", duration: 0.28, begin: 236.1, index: 752 },
    { text: " kral.", duration: 0.28, begin: 236.5, index: 753 },
    { text: ' "Bir', duration: 0.28, begin: 237.5, index: 754 },
    { text: " ar", duration: 0.28, begin: 237.7, index: 755 },
    { text: "ka", duration: 0.28, begin: 237.9, index: 756 },
    { text: "da", duration: 0.28, begin: 238.1, index: 757 },
    { text: "şı", duration: 0.28, begin: 238.3, index: 758 },
    { text: "mı", duration: 0.28, begin: 238.5, index: 759 },
    { text: " bir", duration: 0.28, begin: 239.3, index: 760 },
    { text: " yıl", duration: 0.28, begin: 239.5, index: 761 },
    { text: " bo", duration: 0.28, begin: 239.9, index: 762 },
    { text: "yun", duration: 0.28, begin: 240.1, index: 763 },
    { text: "ca", duration: 0.28, begin: 240.3, index: 764 },
    { text: " zin", duration: 0.28, begin: 240.7, index: 765 },
    { text: "dan", duration: 0.28, begin: 240.9, index: 766 },
    { text: "da", duration: 0.28, begin: 241.1, index: 767 },
    { text: " tut", duration: 0.28, begin: 241.5, index: 768 },
    { text: "ma", duration: 0.28, begin: 241.7, index: 769 },
    { text: "mın", duration: 0.28, begin: 241.9, index: 770 },
    { text: " ne", duration: 0.28, begin: 242.7, index: 771 },
    { text: "re", duration: 0.28, begin: 242.9, index: 772 },
    { text: "sin", duration: 0.28, begin: 243.1, index: 773 },
    { text: "de", duration: 0.28, begin: 243.3, index: 774 },
    { text: " ha", duration: 0.28, begin: 243.5, index: 775 },
    { text: "yır", duration: 0.28, begin: 243.7, index: 776 },
    { text: " o", duration: 0.28, begin: 243.9, index: 777 },
    { text: "la", duration: 0.28, begin: 244.1, index: 778 },
    { text: "bi", duration: 0.28, begin: 244.3, index: 779 },
    { text: 'lir?"', duration: 0.28, begin: 244.5, index: 780 },
    { text: ' "Dü', duration: 0.28, begin: 245.7, index: 781 },
    { text: "şün", duration: 0.28, begin: 245.9, index: 782 },
    { text: "se", duration: 0.28, begin: 246.1, index: 783 },
    { text: "ne,", duration: 0.28, begin: 246.3, index: 784 },
    { text: " ben", duration: 0.28, begin: 247.1, index: 785 },
    { text: " zin", duration: 0.28, begin: 247.5, index: 786 },
    { text: "dan", duration: 0.28, begin: 247.7, index: 787 },
    { text: "da", duration: 0.28, begin: 247.9, index: 788 },
    { text: " ol", duration: 0.28, begin: 248.3, index: 789 },
    { text: "ma", duration: 0.28, begin: 248.5, index: 790 },
    { text: "say", duration: 0.28, begin: 248.7, index: 791 },
    { text: "dım,", duration: 0.28, begin: 248.9, index: 792 },
    { text: " se", duration: 0.28, begin: 249.7, index: 793 },
    { text: "nin", duration: 0.28, begin: 249.9, index: 794 },
    { text: "le", duration: 0.28, begin: 250.1, index: 795 },
    { text: " bir", duration: 0.28, begin: 250.5, index: 796 },
    { text: "lik", duration: 0.28, begin: 250.7, index: 797 },
    { text: "te", duration: 0.28, begin: 250.9, index: 798 },
    { text: " av", duration: 0.28, begin: 251.1, index: 799 },
    { text: "da", duration: 0.28, begin: 251.3, index: 800 },
    { text: " o", duration: 0.28, begin: 251.5, index: 801 },
    { text: "lur", duration: 0.28, begin: 251.7, index: 802 },
    { text: "dum,", duration: 0.28, begin: 251.9, index: 803 },
    { text: " de", duration: 0.28, begin: 252.7, index: 804 },
    { text: "ğil", duration: 0.28, begin: 252.9, index: 805 },
    { text: " mi?", duration: 0.28, begin: 253.1, index: 806 },
    { text: " Ve", duration: 0.28, begin: 253.7, index: 807 },
    { text: " son", duration: 0.28, begin: 253.9, index: 808 },
    { text: "ra", duration: 0.28, begin: 254.1, index: 809 },
    { text: "sı", duration: 0.28, begin: 254.3, index: 810 },
    { text: "nı", duration: 0.28, begin: 254.5, index: 811 },
    { text: " dü", duration: 0.28, begin: 254.9, index: 812 },
    { text: "şün", duration: 0.28, begin: 255.1, index: 813 },
    { text: "se", duration: 0.28, begin: 255.3, index: 814 },
    { text: 'ne?"', duration: 0.28, begin: 255.5, index: 815 },
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
                href="/dashboard/stories/firtina-ciktiginda-uyuyabilirim"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/stanford-universitesi"
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
            src="/4-5.mp3"
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
