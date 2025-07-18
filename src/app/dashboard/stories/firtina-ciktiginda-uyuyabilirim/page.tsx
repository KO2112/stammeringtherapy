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
      text: "Fır",
      duration: 0.28,
      begin: 0.55,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "tı",
      duration: 0.28,
      begin: 0.75,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "na",
      duration: 0.28,
      begin: 0.95,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Çık",
      duration: 0.28,
      begin: 1.15,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "tı",
      duration: 0.28,
      begin: 1.35,
      index: 5,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ğın",
      duration: 0.28,
      begin: 1.55,
      index: 6,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "da",
      duration: 0.28,
      begin: 1.75,
      index: 7,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " U",
      duration: 0.28,
      begin: 1.95,
      index: 8,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "yu",
      duration: 0.28,
      begin: 2.15,
      index: 9,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ya",
      duration: 0.28,
      begin: 2.35,
      index: 10,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "bi",
      duration: 0.28,
      begin: 2.55,
      index: 11,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "li",
      duration: 0.28,
      begin: 2.75,
      index: 12,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "rim",
      duration: 0.28,
      begin: 2.95,
      index: 13,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Yıl", duration: 0.28, begin: 3.95, index: 14 },
    { text: "lar", duration: 0.28, begin: 4.15, index: 15 },
    { text: " ön", duration: 0.28, begin: 4.35, index: 16 },
    { text: "ce", duration: 0.28, begin: 4.55, index: 17 },
    { text: " bir", duration: 0.28, begin: 4.75, index: 18 },
    { text: " çift", duration: 0.28, begin: 5.15, index: 19 },
    { text: "çi,", duration: 0.28, begin: 5.35, index: 20 },
    { text: " fır", duration: 0.28, begin: 6.15, index: 21 },
    { text: "tı", duration: 0.28, begin: 6.35, index: 22 },
    { text: "na", duration: 0.28, begin: 6.55, index: 23 },
    { text: "sı", duration: 0.28, begin: 6.75, index: 24 },
    { text: " bol", duration: 0.28, begin: 6.95, index: 25 },
    { text: " o", duration: 0.28, begin: 7.15, index: 26 },
    { text: "lan", duration: 0.28, begin: 7.35, index: 27 },
    { text: " bir", duration: 0.28, begin: 7.95, index: 28 },
    { text: " te", duration: 0.28, begin: 8.15, index: 29 },
    { text: "pe", duration: 0.28, begin: 8.35, index: 30 },
    { text: "de", duration: 0.28, begin: 8.55, index: 31 },
    { text: " bir", duration: 0.33, begin: 9.35, index: 32 },
    { text: " çift", duration: 0.33, begin: 9.75, index: 33 },
    { text: "lik", duration: 0.33, begin: 9.95, index: 34 },
    { text: " sa", duration: 0.33, begin: 10.35, index: 35 },
    { text: "tın", duration: 0.33, begin: 10.55, index: 36 },
    { text: " al", duration: 0.33, begin: 10.75, index: 37 },
    { text: "mış", duration: 0.33, begin: 10.95, index: 38 },
    { text: "tı.", duration: 0.33, begin: 11.15, index: 39 },
    { text: " Yer", duration: 0.28, begin: 12.5, index: 40 },
    { text: "leş", duration: 0.28, begin: 12.75, index: 41 },
    { text: "tik", duration: 0.28, begin: 13.0, index: 42 },
    { text: "ten", duration: 0.28, begin: 13.25, index: 43 },
    { text: " son", duration: 0.28, begin: 13.5, index: 44 },
    { text: "ra", duration: 0.28, begin: 13.75, index: 45 },
    { text: " ilk", duration: 0.28, begin: 14.75, index: 46 },
    { text: " i", duration: 0.28, begin: 15.0, index: 47 },
    { text: "şi", duration: 0.28, begin: 15.25, index: 48 },
    { text: " bir", duration: 0.28, begin: 15.5, index: 49 },
    { text: " yar", duration: 0.28, begin: 15.75, index: 50 },
    { text: "dım", duration: 0.28, begin: 16.0, index: 51 },
    { text: "cı", duration: 0.28, begin: 16.25, index: 52 },
    { text: " a", duration: 0.28, begin: 16.5, index: 53 },
    { text: "ra", duration: 0.28, begin: 16.75, index: 54 },
    { text: "mak", duration: 0.28, begin: 17.0, index: 55 },
    { text: " ol", duration: 0.28, begin: 17.25, index: 56 },
    { text: "du.", duration: 0.28, begin: 17.5, index: 57 },
    { text: " A", duration: 0.28, begin: 18.5, index: 58 },
    { text: "ma", duration: 0.28, begin: 18.75, index: 59 },
    { text: " ne", duration: 0.28, begin: 19.0, index: 60 },
    { text: " ya", duration: 0.28, begin: 19.25, index: 61 },
    { text: "kı", duration: 0.28, begin: 19.5, index: 62 },
    { text: "nın", duration: 0.28, begin: 19.75, index: 63 },
    { text: "da", duration: 0.28, begin: 20.0, index: 64 },
    { text: "ki", duration: 0.28, begin: 20.25, index: 65 },
    { text: " köy", duration: 0.28, begin: 20.5, index: 66 },
    { text: "ler", duration: 0.28, begin: 20.75, index: 67 },
    { text: "den", duration: 0.28, begin: 21.0, index: 68 },
    { text: " ne", duration: 0.28, begin: 21.5, index: 69 },
    { text: " de", duration: 0.28, begin: 21.75, index: 70 },
    { text: " u", duration: 0.28, begin: 22.0, index: 71 },
    { text: "zak", duration: 0.28, begin: 22.25, index: 72 },
    { text: "ta", duration: 0.28, begin: 22.5, index: 73 },
    { text: "ki", duration: 0.28, begin: 22.75, index: 74 },
    { text: "ler", duration: 0.28, begin: 23.0, index: 75 },
    { text: "den", duration: 0.28, begin: 23.25, index: 76 },
    { text: " kim", duration: 0.28, begin: 23.5, index: 77 },
    { text: "se", duration: 0.28, begin: 23.75, index: 78 },
    { text: " o", duration: 0.28, begin: 24.5, index: 79 },
    { text: "nun", duration: 0.28, begin: 24.75, index: 80 },
    { text: " çift", duration: 0.28, begin: 25.0, index: 81 },
    { text: "li", duration: 0.28, begin: 25.25, index: 82 },
    { text: "ğin", duration: 0.28, begin: 25.5, index: 83 },
    { text: "de", duration: 0.28, begin: 25.75, index: 84 },
    { text: " ça", duration: 0.28, begin: 26.0, index: 85 },
    { text: "lış", duration: 0.28, begin: 26.25, index: 86 },
    { text: "mak", duration: 0.28, begin: 26.5, index: 87 },
    { text: " is", duration: 0.28, begin: 27.0, index: 88 },
    { text: "te", duration: 0.28, begin: 27.25, index: 89 },
    { text: "mi", duration: 0.28, begin: 27.5, index: 90 },
    { text: "yor", duration: 0.28, begin: 27.75, index: 91 },
    { text: "du.", duration: 0.28, begin: 28.0, index: 92 },
    { text: " İş", duration: 0.28, begin: 29.25, index: 93 },
    { text: " baş", duration: 0.28, begin: 29.55, index: 94 },
    { text: "vu", duration: 0.28, begin: 29.75, index: 95 },
    { text: "ru", duration: 0.28, begin: 29.95, index: 96 },
    { text: "su", duration: 0.28, begin: 30.15, index: 97 },
    { text: "na", duration: 0.28, begin: 30.35, index: 98 },
    { text: " ge", duration: 0.28, begin: 30.55, index: 99 },
    { text: "len", duration: 0.28, begin: 30.75, index: 100 },
    { text: "le", duration: 0.28, begin: 31.0, index: 101 },
    { text: "rin", duration: 0.28, begin: 31.25, index: 102 },
    { text: " hep", duration: 0.28, begin: 31.5, index: 103 },
    { text: "si", duration: 0.28, begin: 31.75, index: 104 },
    { text: " çift", duration: 0.28, begin: 32.75, index: 105 },
    { text: "li", duration: 0.28, begin: 33.0, index: 106 },
    { text: "ğin", duration: 0.28, begin: 33.25, index: 107 },
    { text: " ye", duration: 0.28, begin: 33.5, index: 108 },
    { text: "ri", duration: 0.28, begin: 33.75, index: 109 },
    { text: "ni", duration: 0.28, begin: 34.0, index: 110 },
    { text: " gö", duration: 0.28, begin: 34.25, index: 111 },
    { text: "rün", duration: 0.28, begin: 34.5, index: 112 },
    { text: "ce", duration: 0.28, begin: 34.75, index: 113 },
    { text: " ça", duration: 0.28, begin: 35.25, index: 114 },
    { text: "lış", duration: 0.28, begin: 35.5, index: 115 },
    { text: "mak", duration: 0.28, begin: 35.75, index: 116 },
    { text: "tan", duration: 0.28, begin: 36.0, index: 117 },
    { text: " vaz", duration: 0.28, begin: 36.5, index: 118 },
    { text: "ge", duration: 0.28, begin: 36.75, index: 119 },
    { text: "çi", duration: 0.28, begin: 37.0, index: 120 },
    { text: "yor:", duration: 0.28, begin: 37.25, index: 121 },
    { text: ' "Bu', duration: 0.28, begin: 38.2, index: 122 },
    { text: "ra", duration: 0.28, begin: 38.4, index: 123 },
    { text: "sı", duration: 0.28, begin: 38.6, index: 124 },
    { text: " fır", duration: 0.28, begin: 38.8, index: 125 },
    { text: "tı", duration: 0.28, begin: 39.0, index: 126 },
    { text: "na", duration: 0.28, begin: 39.2, index: 127 },
    { text: "lı", duration: 0.28, begin: 39.4, index: 128 },
    { text: "dır", duration: 0.28, begin: 39.6, index: 129 },
    { text: " siz", duration: 0.28, begin: 40.4, index: 130 },
    { text: "de", duration: 0.28, begin: 40.6, index: 131 },
    { text: " vaz", duration: 0.28, begin: 41.0, index: 132 },
    { text: "geç", duration: 0.28, begin: 41.2, index: 133 },
    { text: "se", duration: 0.28, begin: 41.4, index: 134 },
    { text: "niz", duration: 0.28, begin: 41.6, index: 135 },
    { text: " i", duration: 0.28, begin: 42.0, index: 136 },
    { text: "yi", duration: 0.28, begin: 42.2, index: 137 },
    { text: " o", duration: 0.28, begin: 42.4, index: 138 },
    { text: 'lur."', duration: 0.28, begin: 42.6, index: 139 },
    { text: " di", duration: 0.28, begin: 43.4, index: 140 },
    { text: "yor", duration: 0.28, begin: 43.6, index: 141 },
    { text: "lar", duration: 0.28, begin: 43.8, index: 142 },
    { text: "dı.", duration: 0.28, begin: 44.0, index: 143 },
    { text: " Ni", duration: 0.28, begin: 45.2, index: 144 },
    { text: "ha", duration: 0.28, begin: 45.4, index: 145 },
    { text: "yet", duration: 0.28, begin: 45.8, index: 146 },
    { text: " çe", duration: 0.28, begin: 46.0, index: 147 },
    { text: "lim", duration: 0.28, begin: 46.2, index: 148 },
    { text: "siz", duration: 0.28, begin: 46.4, index: 149 },
    { text: " or", duration: 0.28, begin: 47.4, index: 150 },
    { text: "ta", duration: 0.28, begin: 47.6, index: 151 },
    { text: " ya", duration: 0.28, begin: 47.8, index: 152 },
    { text: "şı", duration: 0.28, begin: 48.0, index: 153 },
    { text: " geç", duration: 0.28, begin: 48.25, index: 154 },
    { text: "kin", duration: 0.28, begin: 48.5, index: 155 },
    { text: "ce", duration: 0.28, begin: 48.75, index: 156 },
    { text: " bir", duration: 0.28, begin: 49.0, index: 157 },
    { text: " a", duration: 0.28, begin: 49.25, index: 158 },
    { text: "dam", duration: 0.28, begin: 49.5, index: 159 },
    { text: " i", duration: 0.28, begin: 49.75, index: 160 },
    { text: "şi", duration: 0.28, begin: 50.0, index: 161 },
    { text: " ka", duration: 0.28, begin: 50.25, index: 162 },
    { text: "bul", duration: 0.28, begin: 50.5, index: 163 },
    { text: " et", duration: 0.28, begin: 50.75, index: 164 },
    { text: "ti.", duration: 0.28, begin: 51.0, index: 165 },
    { text: " A", duration: 0.28, begin: 52.0, index: 166 },
    { text: "dam", duration: 0.28, begin: 52.25, index: 167 },
    { text: "ın", duration: 0.28, begin: 52.5, index: 168 },
    { text: " ha", duration: 0.28, begin: 52.75, index: 169 },
    { text: "li", duration: 0.28, begin: 53.0, index: 170 },
    { text: "ne", duration: 0.28, begin: 53.25, index: 171 },
    { text: " ba", duration: 0.28, begin: 53.5, index: 172 },
    { text: "kıp:", duration: 0.28, begin: 53.75, index: 173 },
    { text: ' "Çift', duration: 0.28, begin: 54.75, index: 174 },
    { text: "lik", duration: 0.28, begin: 55.0, index: 175 },
    { text: " iş", duration: 0.28, begin: 55.25, index: 176 },
    { text: "le", duration: 0.28, begin: 55.5, index: 177 },
    { text: "rin", duration: 0.28, begin: 55.75, index: 178 },
    { text: "den", duration: 0.28, begin: 56.0, index: 179 },
    { text: " an", duration: 0.28, begin: 56.25, index: 180 },
    { text: "lar", duration: 0.28, begin: 56.5, index: 181 },
    { text: " mı", duration: 0.28, begin: 56.75, index: 182 },
    { text: "sı", duration: 0.28, begin: 57.0, index: 183 },
    { text: 'nız?"', duration: 0.28, begin: 57.25, index: 184 },
    { text: " di", duration: 0.28, begin: 58.0, index: 185 },
    { text: "ye", duration: 0.28, begin: 58.25, index: 186 },
    { text: " sor", duration: 0.28, begin: 58.5, index: 187 },
    { text: "ma", duration: 0.28, begin: 58.75, index: 188 },
    { text: "dan", duration: 0.28, begin: 59.0, index: 189 },
    { text: " e", duration: 0.28, begin: 59.2, index: 190 },
    { text: "de", duration: 0.28, begin: 59.4, index: 191 },
    { text: "me", duration: 0.28, begin: 59.6, index: 192 },
    { text: "di", duration: 0.28, begin: 59.8, index: 193 },
    { text: " çift", duration: 0.28, begin: 60.0, index: 194 },
    { text: "lik", duration: 0.28, begin: 60.2, index: 195 },
    { text: " sa", duration: 0.28, begin: 60.4, index: 196 },
    { text: "hi", duration: 0.28, begin: 60.6, index: 197 },
    { text: "bi.", duration: 0.28, begin: 60.8, index: 198 },
    { text: ' "Sa', duration: 0.28, begin: 62.0, index: 199 },
    { text: "yı", duration: 0.28, begin: 62.2, index: 200 },
    { text: 'lır"', duration: 0.28, begin: 62.4, index: 201 },
    { text: " de", duration: 0.28, begin: 63.0, index: 202 },
    { text: "di", duration: 0.28, begin: 63.2, index: 203 },
    { text: " a", duration: 0.28, begin: 63.6, index: 204 },
    { text: "dam.", duration: 0.28, begin: 63.8, index: 205 },
    { text: ' "Fır', duration: 0.28, begin: 64.8, index: 206 },
    { text: "tı", duration: 0.28, begin: 65.0, index: 207 },
    { text: "na", duration: 0.28, begin: 65.2, index: 208 },
    { text: " çık", duration: 0.28, begin: 65.4, index: 209 },
    { text: "tı", duration: 0.28, begin: 65.6, index: 210 },
    { text: "ğın", duration: 0.28, begin: 65.8, index: 211 },
    { text: "da", duration: 0.28, begin: 66.0, index: 212 },
    { text: " u", duration: 0.28, begin: 66.8, index: 213 },
    { text: "yu", duration: 0.28, begin: 67.0, index: 214 },
    { text: "ya", duration: 0.28, begin: 67.2, index: 215 },
    { text: "bi", duration: 0.28, begin: 67.4, index: 216 },
    { text: "li", duration: 0.28, begin: 67.6, index: 217 },
    { text: 'rim."', duration: 0.28, begin: 67.8, index: 218 },
    { text: " Bu", duration: 0.28, begin: 69.0, index: 219 },
    { text: " il", duration: 0.28, begin: 69.2, index: 220 },
    { text: "gi", duration: 0.28, begin: 69.4, index: 221 },
    { text: "siz", duration: 0.28, begin: 69.6, index: 222 },
    { text: " sö", duration: 0.28, begin: 69.8, index: 223 },
    { text: "zü", duration: 0.28, begin: 70.0, index: 224 },
    { text: " bi", duration: 0.28, begin: 70.4, index: 225 },
    { text: "raz", duration: 0.28, begin: 70.6, index: 226 },
    { text: " dü", duration: 0.28, begin: 70.8, index: 227 },
    { text: "şün", duration: 0.28, begin: 71.0, index: 228 },
    { text: "dü.", duration: 0.28, begin: 71.2, index: 229 },
    { text: " Son", duration: 0.28, begin: 72.0, index: 230 },
    { text: "ra", duration: 0.28, begin: 72.2, index: 231 },
    { text: " boş", duration: 0.28, begin: 72.4, index: 232 },
    { text: " ve", duration: 0.28, begin: 72.6, index: 233 },
    { text: "rip", duration: 0.28, begin: 72.8, index: 234 },
    { text: " a", duration: 0.28, begin: 73.2, index: 235 },
    { text: "da", duration: 0.28, begin: 73.4, index: 236 },
    { text: "mı", duration: 0.28, begin: 73.6, index: 237 },
    { text: " i", duration: 0.28, begin: 73.8, index: 238 },
    { text: "şe", duration: 0.28, begin: 74.0, index: 239 },
    { text: " al", duration: 0.28, begin: 74.2, index: 240 },
    { text: "dı.", duration: 0.28, begin: 74.4, index: 241 },
    { text: " Haf", duration: 0.28, begin: 75.4, index: 242 },
    { text: "ta", duration: 0.28, begin: 75.6, index: 243 },
    { text: "lar", duration: 0.28, begin: 75.8, index: 244 },
    { text: " geç", duration: 0.28, begin: 76.2, index: 245 },
    { text: "tik", duration: 0.28, begin: 76.4, index: 246 },
    { text: "çe", duration: 0.28, begin: 76.6, index: 247 },
    { text: " a", duration: 0.28, begin: 77.6, index: 248 },
    { text: "da", duration: 0.28, begin: 77.8, index: 249 },
    { text: "mın", duration: 0.28, begin: 78.0, index: 250 },
    { text: " çift", duration: 0.28, begin: 78.4, index: 251 },
    { text: "lik", duration: 0.28, begin: 78.6, index: 252 },
    { text: " iş", duration: 0.28, begin: 79.0, index: 253 },
    { text: "le", duration: 0.28, begin: 79.2, index: 254 },
    { text: "ri", duration: 0.28, begin: 79.4, index: 255 },
    { text: "ni", duration: 0.28, begin: 79.6, index: 256 },
    { text: " dü", duration: 0.28, begin: 79.8, index: 257 },
    { text: "zen", duration: 0.28, begin: 80.0, index: 258 },
    { text: "li", duration: 0.28, begin: 80.2, index: 259 },
    { text: " o", duration: 0.28, begin: 80.6, index: 260 },
    { text: "la", duration: 0.28, begin: 80.8, index: 261 },
    { text: "rak", duration: 0.28, begin: 81.0, index: 262 },
    { text: " yü", duration: 0.28, begin: 81.2, index: 263 },
    { text: "rüt", duration: 0.28, begin: 81.4, index: 264 },
    { text: "tü", duration: 0.28, begin: 81.6, index: 265 },
    { text: "ğü", duration: 0.28, begin: 81.8, index: 266 },
    { text: "nü", duration: 0.28, begin: 82.0, index: 267 },
    { text: "de", duration: 0.28, begin: 82.2, index: 268 },
    { text: " gö", duration: 0.28, begin: 82.4, index: 269 },
    { text: "rün", duration: 0.28, begin: 82.6, index: 270 },
    { text: "ce", duration: 0.28, begin: 82.8, index: 271 },
    { text: " i", duration: 0.28, begin: 83.4, index: 272 },
    { text: "çi", duration: 0.28, begin: 83.6, index: 273 },
    { text: " ra", duration: 0.28, begin: 83.8, index: 274 },
    { text: "hat", duration: 0.28, begin: 84.0, index: 275 },
    { text: "la", duration: 0.28, begin: 84.2, index: 276 },
    { text: "dı.", duration: 0.28, begin: 84.4, index: 277 },
    { text: " Ta", duration: 0.28, begin: 85.6, index: 278 },
    { text: " ki", duration: 0.28, begin: 85.8, index: 279 },
    { text: " o", duration: 0.28, begin: 86.0, index: 280 },
    { text: " fır", duration: 0.28, begin: 86.2, index: 281 },
    { text: "tı", duration: 0.28, begin: 86.4, index: 282 },
    { text: "na", duration: 0.28, begin: 86.6, index: 283 },
    { text: "ya", duration: 0.28, begin: 86.8, index: 284 },
    { text: " ka", duration: 0.28, begin: 87.0, index: 285 },
    { text: "dar.", duration: 0.28, begin: 87.2, index: 286 },
    { text: " Ge", duration: 0.28, begin: 88.4, index: 287 },
    { text: "ce", duration: 0.28, begin: 88.6, index: 288 },
    { text: " ya", duration: 0.28, begin: 88.8, index: 289 },
    { text: "rı", duration: 0.28, begin: 89.0, index: 290 },
    { text: "sı", duration: 0.28, begin: 89.2, index: 291 },
    { text: " fır", duration: 0.28, begin: 90.0, index: 292 },
    { text: "tı", duration: 0.28, begin: 90.2, index: 293 },
    { text: "na", duration: 0.28, begin: 90.4, index: 294 },
    { text: "nın", duration: 0.28, begin: 90.6, index: 295 },
    { text: " o", duration: 0.28, begin: 91.0, index: 296 },
    { text: " müt", duration: 0.28, begin: 91.2, index: 297 },
    { text: "hiş", duration: 0.28, begin: 91.4, index: 298 },
    { text: " u", duration: 0.28, begin: 91.6, index: 299 },
    { text: "ğul", duration: 0.28, begin: 91.8, index: 300 },
    { text: "tu", duration: 0.28, begin: 92.0, index: 301 },
    { text: "suy", duration: 0.28, begin: 92.2, index: 302 },
    { text: "la", duration: 0.28, begin: 92.4, index: 303 },
    { text: " u", duration: 0.28, begin: 92.8, index: 304 },
    { text: "yan", duration: 0.28, begin: 93.0, index: 305 },
    { text: "dı.", duration: 0.28, begin: 93.2, index: 306 },
    { text: " Öy", duration: 0.28, begin: 94.4, index: 307 },
    { text: "le", duration: 0.28, begin: 94.6, index: 308 },
    { text: " ki,", duration: 0.28, begin: 94.8, index: 309 },
    { text: " bi", duration: 0.28, begin: 95.6, index: 310 },
    { text: "na", duration: 0.28, begin: 95.8, index: 311 },
    { text: " ça", duration: 0.28, begin: 96.0, index: 312 },
    { text: "tır", duration: 0.28, begin: 96.2, index: 313 },
    { text: "dı", duration: 0.28, begin: 96.4, index: 314 },
    { text: "yor", duration: 0.28, begin: 96.6, index: 315 },
    { text: "du.", duration: 0.28, begin: 96.8, index: 316 },
    { text: " Ya", duration: 0.28, begin: 97.8, index: 317 },
    { text: "ta", duration: 0.28, begin: 98.0, index: 318 },
    { text: "ğın", duration: 0.28, begin: 98.2, index: 319 },
    { text: "dan", duration: 0.28, begin: 98.4, index: 320 },
    { text: " fır", duration: 0.28, begin: 98.8, index: 321 },
    { text: "la", duration: 0.28, begin: 99.0, index: 322 },
    { text: "dı,", duration: 0.28, begin: 99.2, index: 323 },
    { text: " a", duration: 0.28, begin: 100.2, index: 324 },
    { text: "da", duration: 0.28, begin: 100.4, index: 325 },
    { text: "mın", duration: 0.28, begin: 100.6, index: 326 },
    { text: " o", duration: 0.28, begin: 100.8, index: 327 },
    { text: "da", duration: 0.28, begin: 101.0, index: 328 },
    { text: "sı", duration: 0.28, begin: 101.2, index: 329 },
    { text: "na", duration: 0.28, begin: 101.4, index: 330 },
    { text: " koş", duration: 0.28, begin: 101.6, index: 331 },
    { text: "tu:", duration: 0.28, begin: 101.8, index: 332 },
    { text: " Kalk,", duration: 0.28, begin: 102.8, index: 333 },
    { text: " kalk!", duration: 0.28, begin: 103.5, index: 334 },
    { text: " Fır", duration: 0.28, begin: 104.4, index: 335 },
    { text: "tı", duration: 0.28, begin: 104.6, index: 336 },
    { text: "na", duration: 0.28, begin: 104.8, index: 337 },
    { text: " çık", duration: 0.28, begin: 105.2, index: 338 },
    { text: "tı.", duration: 0.28, begin: 105.4, index: 339 },
    { text: " Her", duration: 0.28, begin: 106.2, index: 340 },
    { text: " şe", duration: 0.28, begin: 106.4, index: 341 },
    { text: "yi", duration: 0.28, begin: 106.6, index: 342 },
    { text: " u", duration: 0.28, begin: 107.0, index: 343 },
    { text: "çur", duration: 0.28, begin: 107.2, index: 344 },
    { text: "ma", duration: 0.28, begin: 107.4, index: 345 },
    { text: "dan", duration: 0.28, begin: 107.6, index: 346 },
    { text: " ya", duration: 0.28, begin: 108.0, index: 347 },
    { text: "pa", duration: 0.28, begin: 108.2, index: 348 },
    { text: "bi", duration: 0.28, begin: 108.4, index: 349 },
    { text: "le", duration: 0.28, begin: 108.6, index: 350 },
    { text: "cek", duration: 0.28, begin: 108.8, index: 351 },
    { text: "le", duration: 0.28, begin: 109.0, index: 352 },
    { text: "ri", duration: 0.28, begin: 109.2, index: 353 },
    { text: "mi", duration: 0.28, begin: 109.4, index: 354 },
    { text: "zi", duration: 0.28, begin: 109.6, index: 355 },
    { text: " ya", duration: 0.28, begin: 109.8, index: 356 },
    { text: "pa", duration: 0.28, begin: 110.0, index: 357 },
    { text: 'lım."', duration: 0.28, begin: 110.2, index: 358 },
    { text: " A", duration: 0.28, begin: 111.2, index: 359 },
    { text: "dam", duration: 0.28, begin: 111.4, index: 360 },
    { text: " ya", duration: 0.28, begin: 111.8, index: 361 },
    { text: "ta", duration: 0.28, begin: 112.0, index: 362 },
    { text: "ğın", duration: 0.28, begin: 112.2, index: 363 },
    { text: "dan", duration: 0.28, begin: 112.4, index: 364 },
    { text: " bi", duration: 0.28, begin: 112.6, index: 365 },
    { text: "le", duration: 0.28, begin: 112.8, index: 366 },
    { text: " doğ", duration: 0.28, begin: 113.2, index: 367 },
    { text: "rul", duration: 0.28, begin: 113.4, index: 368 },
    { text: "ma", duration: 0.28, begin: 113.6, index: 369 },
    { text: "dan", duration: 0.28, begin: 113.8, index: 370 },
    { text: " mı", duration: 0.28, begin: 114.2, index: 371 },
    { text: "rıl", duration: 0.28, begin: 114.4, index: 372 },
    { text: "dan", duration: 0.28, begin: 114.6, index: 373 },
    { text: "dı:", duration: 0.28, begin: 114.8, index: 374 },
    { text: " Boş", duration: 0.28, begin: 115.8, index: 375 },
    { text: " ve", duration: 0.28, begin: 116.0, index: 376 },
    { text: "rin", duration: 0.28, begin: 116.2, index: 377 },
    { text: " e", duration: 0.28, begin: 116.6, index: 378 },
    { text: "fen", duration: 0.28, begin: 116.8, index: 379 },
    { text: "dim,", duration: 0.28, begin: 117.0, index: 380 },
    { text: " gi", duration: 0.28, begin: 117.7, index: 381 },
    { text: "din", duration: 0.28, begin: 118.0, index: 382 },
    { text: " ya", duration: 0.28, begin: 118.2, index: 383 },
    { text: "tın.", duration: 0.28, begin: 118.4, index: 384 },
    { text: " İ", duration: 0.28, begin: 119.4, index: 385 },
    { text: "şe", duration: 0.28, begin: 119.6, index: 386 },
    { text: " gi", duration: 0.28, begin: 119.8, index: 387 },
    { text: "rer", duration: 0.28, begin: 120.0, index: 388 },
    { text: "ken", duration: 0.28, begin: 120.2, index: 389 },
    { text: " ben", duration: 0.28, begin: 120.6, index: 390 },
    { text: " si", duration: 0.28, begin: 120.8, index: 391 },
    { text: "ze", duration: 0.28, begin: 121.0, index: 392 },
    { text: " fır", duration: 0.28, begin: 121.8, index: 393 },
    { text: "tı", duration: 0.28, begin: 122.0, index: 394 },
    { text: "na", duration: 0.28, begin: 122.2, index: 395 },
    { text: " çık", duration: 0.28, begin: 122.6, index: 396 },
    { text: "tı", duration: 0.28, begin: 122.8, index: 397 },
    { text: "ğın", duration: 0.28, begin: 123.0, index: 398 },
    { text: "da", duration: 0.28, begin: 123.2, index: 399 },
    { text: " u", duration: 0.1, begin: 123.6, index: 400 },
    { text: "yu", duration: 0.1, begin: 123.8, index: 401 },
    { text: "ya", duration: 0.1, begin: 124.0, index: 402 },
    { text: "bi", duration: 0.1, begin: 124.2, index: 403 },
    { text: "li", duration: 0.1, begin: 124.4, index: 404 },
    { text: "rim", duration: 0.1, begin: 124.6, index: 405 },
    { text: " de", duration: 0.1, begin: 124.8, index: 406 },
    { text: "miş", duration: 0.1, begin: 125.0, index: 407 },
    { text: "tim", duration: 0.1, begin: 125.2, index: 408 },
    { text: ' ya."', duration: 0.1, begin: 125.4, index: 409 },
    { text: " Çift", duration: 0.28, begin: 126.4, index: 410 },
    { text: "çi", duration: 0.28, begin: 126.6, index: 411 },
    { text: " a", duration: 0.28, begin: 127.6, index: 412 },
    { text: "da", duration: 0.28, begin: 127.8, index: 413 },
    { text: "mın", duration: 0.28, begin: 128.0, index: 414 },
    { text: " ra", duration: 0.28, begin: 128.2, index: 415 },
    { text: "hat", duration: 0.28, begin: 128.4, index: 416 },
    { text: "lı", duration: 0.28, begin: 128.6, index: 417 },
    { text: "ğı", duration: 0.28, begin: 128.8, index: 418 },
    { text: "na", duration: 0.28, begin: 129.0, index: 419 },
    { text: " çıl", duration: 0.28, begin: 129.4, index: 420 },
    { text: "dır", duration: 0.28, begin: 129.6, index: 421 },
    { text: "mış", duration: 0.28, begin: 129.8, index: 422 },
    { text: "tı.", duration: 0.28, begin: 130.0, index: 423 },
    { text: " Er", duration: 0.28, begin: 131.0, index: 424 },
    { text: "te", duration: 0.28, begin: 131.2, index: 425 },
    { text: "si", duration: 0.28, begin: 131.4, index: 426 },
    { text: " sa", duration: 0.28, begin: 131.8, index: 427 },
    { text: "bah", duration: 0.28, begin: 132.0, index: 428 },
    { text: " ilk", duration: 0.28, begin: 132.2, index: 429 },
    { text: " i", duration: 0.28, begin: 132.4, index: 430 },
    { text: "şi", duration: 0.28, begin: 132.6, index: 431 },
    { text: " o", duration: 0.28, begin: 133.6, index: 432 },
    { text: "nu", duration: 0.28, begin: 133.8, index: 433 },
    { text: " kov", duration: 0.28, begin: 134.0, index: 434 },
    { text: "mak", duration: 0.28, begin: 134.2, index: 435 },
    { text: " o", duration: 0.28, begin: 134.5, index: 436 },
    { text: "la", duration: 0.28, begin: 134.7, index: 437 },
    { text: "cak", duration: 0.28, begin: 134.9, index: 438 },
    { text: "tı", duration: 0.28, begin: 135.1, index: 439 },
    { text: " a", duration: 0.28, begin: 136.0, index: 440 },
    { text: "ma", duration: 0.28, begin: 136.2, index: 441 },
    { text: " şim", duration: 0.28, begin: 136.4, index: 442 },
    { text: "di", duration: 0.28, begin: 136.6, index: 443 },
    { text: " fır", duration: 0.28, begin: 136.9, index: 444 },
    { text: "tı", duration: 0.28, begin: 137.1, index: 445 },
    { text: "na", duration: 0.28, begin: 137.3, index: 446 },
    { text: "ya", duration: 0.28, begin: 137.5, index: 447 },
    { text: " bir", duration: 0.28, begin: 137.7, index: 448 },
    { text: " ça", duration: 0.28, begin: 137.9, index: 449 },
    { text: "re", duration: 0.28, begin: 138.1, index: 450 },
    { text: " bul", duration: 0.28, begin: 138.3, index: 451 },
    { text: "mak", duration: 0.28, begin: 138.5, index: 452 },
    { text: " ge", duration: 0.28, begin: 138.8, index: 453 },
    { text: "re", duration: 0.28, begin: 139.0, index: 454 },
    { text: "ki", duration: 0.28, begin: 139.2, index: 455 },
    { text: "yor", duration: 0.28, begin: 139.4, index: 456 },
    { text: "du.", duration: 0.28, begin: 139.6, index: 457 },
    { text: " Dı", duration: 0.28, begin: 140.8, index: 458 },
    { text: "şa", duration: 0.28, begin: 141.0, index: 459 },
    { text: "rı", duration: 0.28, begin: 141.2, index: 460 },
    { text: " çık", duration: 0.28, begin: 141.4, index: 461 },
    { text: "tı,", duration: 0.28, begin: 141.6, index: 462 },
    { text: " sa", duration: 0.28, begin: 142.4, index: 463 },
    { text: "man", duration: 0.28, begin: 142.6, index: 464 },
    { text: " bal", duration: 0.28, begin: 142.8, index: 465 },
    { text: "ya", duration: 0.28, begin: 143.0, index: 466 },
    { text: "la", duration: 0.28, begin: 143.2, index: 467 },
    { text: "rı", duration: 0.28, begin: 143.4, index: 468 },
    { text: "na", duration: 0.28, begin: 143.6, index: 469 },
    { text: " koş", duration: 0.28, begin: 144.0, index: 470 },
    { text: "tu.", duration: 0.28, begin: 144.2, index: 471 },
    { text: " Sa", duration: 0.28, begin: 145.2, index: 472 },
    { text: "man", duration: 0.28, begin: 145.4, index: 473 },
    { text: " bal", duration: 0.28, begin: 145.8, index: 474 },
    { text: "ya", duration: 0.28, begin: 146.0, index: 475 },
    { text: "la", duration: 0.28, begin: 146.2, index: 476 },
    { text: "rı", duration: 0.28, begin: 146.4, index: 477 },
    { text: " bir", duration: 0.28, begin: 146.8, index: 478 },
    { text: "leş", duration: 0.28, begin: 147.0, index: 479 },
    { text: "ti", duration: 0.28, begin: 147.2, index: 480 },
    { text: "ril", duration: 0.28, begin: 147.4, index: 481 },
    { text: "miş,", duration: 0.28, begin: 147.6, index: 482 },
    { text: " ü", duration: 0.28, begin: 148.6, index: 483 },
    { text: "ze", duration: 0.28, begin: 148.8, index: 484 },
    { text: "ri", duration: 0.28, begin: 149.0, index: 485 },
    { text: " mu", duration: 0.28, begin: 149.2, index: 486 },
    { text: "şam", duration: 0.28, begin: 149.5, index: 487 },
    { text: "ba", duration: 0.28, begin: 149.7, index: 488 },
    { text: " i", duration: 0.28, begin: 149.9, index: 489 },
    { text: "le", duration: 0.28, begin: 150.1, index: 490 },
    { text: " ör", duration: 0.28, begin: 150.4, index: 491 },
    { text: "tül", duration: 0.28, begin: 150.6, index: 492 },
    { text: "müş,", duration: 0.28, begin: 150.8, index: 493 },
    { text: " sı", duration: 0.28, begin: 151.6, index: 494 },
    { text: "kı", duration: 0.28, begin: 151.8, index: 495 },
    { text: "ca", duration: 0.28, begin: 152.0, index: 496 },
    { text: " bağ", duration: 0.28, begin: 152.3, index: 497 },
    { text: "lan", duration: 0.28, begin: 152.5, index: 498 },
    { text: "mış", duration: 0.28, begin: 152.8, index: 499 },
    { text: "tı.", duration: 0.28, begin: 153.0, index: 500 },
    { text: " A", duration: 0.28, begin: 154.2, index: 501 },
    { text: "hı", duration: 0.28, begin: 154.4, index: 502 },
    { text: "ra", duration: 0.28, begin: 154.6, index: 503 },
    { text: " koş", duration: 0.28, begin: 154.8, index: 504 },
    { text: "tu.", duration: 0.28, begin: 155.0, index: 505 },
    { text: " İ", duration: 0.28, begin: 156.0, index: 506 },
    { text: "nek", duration: 0.28, begin: 156.2, index: 507 },
    { text: "le", duration: 0.28, begin: 156.4, index: 508 },
    { text: "rin", duration: 0.28, begin: 156.6, index: 509 },
    { text: " ta", duration: 0.28, begin: 156.9, index: 510 },
    { text: "ma", duration: 0.28, begin: 157.2, index: 511 },
    { text: "mı", duration: 0.28, begin: 157.4, index: 512 },
    { text: " bah", duration: 0.28, begin: 158.2, index: 513 },
    { text: "çe", duration: 0.28, begin: 158.4, index: 514 },
    { text: "den", duration: 0.28, begin: 158.7, index: 515 },
    { text: " a", duration: 0.28, begin: 158.9, index: 516 },
    { text: "hı", duration: 0.28, begin: 159.1, index: 517 },
    { text: "ra", duration: 0.28, begin: 159.3, index: 518 },
    { text: " so", duration: 0.28, begin: 159.6, index: 519 },
    { text: "kul", duration: 0.28, begin: 159.9, index: 520 },
    { text: "muş,", duration: 0.28, begin: 160.1, index: 521 },
    { text: " a", duration: 0.28, begin: 161.1, index: 522 },
    { text: "hı", duration: 0.28, begin: 161.3, index: 523 },
    { text: "rın", duration: 0.28, begin: 161.5, index: 524 },
    { text: " ka", duration: 0.28, begin: 161.7, index: 525 },
    { text: "pı", duration: 0.28, begin: 161.9, index: 526 },
    { text: "sı", duration: 0.28, begin: 162.1, index: 527 },
    { text: " des", duration: 0.4, begin: 162.5, index: 528 },
    { text: "tek", duration: 0.4, begin: 162.7, index: 529 },
    { text: "len", duration: 0.4, begin: 162.9, index: 530 },
    { text: "miş", duration: 0.4, begin: 163.1, index: 531 },
    { text: "ti.", duration: 0.4, begin: 163.3, index: 532 },
    { text: " Tek", duration: 0.28, begin: 164.5, index: 533 },
    { text: "rar", duration: 0.28, begin: 164.7, index: 534 },
    { text: " e", duration: 0.28, begin: 165.2, index: 535 },
    { text: "vi", duration: 0.28, begin: 165.4, index: 536 },
    { text: "ne", duration: 0.28, begin: 165.6, index: 537 },
    { text: " yö", duration: 0.28, begin: 165.8, index: 538 },
    { text: "nel", duration: 0.28, begin: 166.0, index: 539 },
    { text: "di.", duration: 0.28, begin: 166.2, index: 540 },
    { text: " E", duration: 0.28, begin: 167.0, index: 541 },
    { text: "vin", duration: 0.28, begin: 167.2, index: 542 },
    { text: " ke", duration: 0.28, begin: 167.6, index: 543 },
    { text: "penk", duration: 0.28, begin: 167.8, index: 544 },
    { text: "le", duration: 0.28, begin: 168.0, index: 545 },
    { text: "ri", duration: 0.28, begin: 168.2, index: 546 },
    { text: "nin", duration: 0.28, begin: 168.4, index: 547 },
    { text: " ta", duration: 0.28, begin: 168.8, index: 548 },
    { text: "ma", duration: 0.28, begin: 169.0, index: 549 },
    { text: "mı", duration: 0.28, begin: 169.2, index: 550 },
    { text: " ka", duration: 0.28, begin: 169.5, index: 551 },
    { text: "pa", duration: 0.28, begin: 169.7, index: 552 },
    { text: "tıl", duration: 0.28, begin: 169.9, index: 553 },
    { text: "mış", duration: 0.28, begin: 170.2, index: 554 },
    { text: "tı.", duration: 0.28, begin: 170.4, index: 555 },
    { text: " Çift", duration: 0.28, begin: 171.6, index: 556 },
    { text: "çi", duration: 0.28, begin: 171.8, index: 557 },
    { text: " ra", duration: 0.28, begin: 172.8, index: 558 },
    { text: "hat", duration: 0.28, begin: 173.0, index: 559 },
    { text: "la", duration: 0.28, begin: 173.2, index: 560 },
    { text: "mış", duration: 0.28, begin: 173.4, index: 561 },
    { text: " bir", duration: 0.28, begin: 173.6, index: 562 },
    { text: " hal", duration: 0.28, begin: 173.9, index: 563 },
    { text: "de", duration: 0.28, begin: 174.1, index: 564 },
    { text: " o", duration: 0.28, begin: 174.4, index: 565 },
    { text: "da", duration: 0.28, begin: 174.6, index: 566 },
    { text: "sı", duration: 0.28, begin: 174.8, index: 567 },
    { text: "na", duration: 0.28, begin: 175.0, index: 568 },
    { text: " dön", duration: 0.28, begin: 175.2, index: 569 },
    { text: "dü", duration: 0.28, begin: 175.4, index: 570 },
    { text: " ya", duration: 0.28, begin: 176.0, index: 571 },
    { text: "ta", duration: 0.28, begin: 176.2, index: 572 },
    { text: "ğı", duration: 0.28, begin: 176.4, index: 573 },
    { text: "na", duration: 0.28, begin: 176.6, index: 574 },
    { text: " yat", duration: 0.28, begin: 176.8, index: 575 },
    { text: "tı.", duration: 0.28, begin: 177.0, index: 576 },
    { text: " Fır", duration: 0.28, begin: 178.0, index: 577 },
    { text: "tı", duration: 0.28, begin: 178.2, index: 578 },
    { text: "na", duration: 0.28, begin: 178.4, index: 579 },
    { text: " u", duration: 0.28, begin: 178.6, index: 580 },
    { text: "ğul", duration: 0.28, begin: 178.8, index: 581 },
    { text: "da", duration: 0.28, begin: 179.0, index: 582 },
    { text: "ma", duration: 0.28, begin: 179.2, index: 583 },
    { text: "ya", duration: 0.28, begin: 179.4, index: 584 },
    { text: " de", duration: 0.28, begin: 179.6, index: 585 },
    { text: "vam", duration: 0.28, begin: 179.8, index: 586 },
    { text: " e", duration: 0.28, begin: 180.1, index: 587 },
    { text: "di", duration: 0.28, begin: 180.3, index: 588 },
    { text: "yor", duration: 0.28, begin: 180.6, index: 589 },
    { text: "du.", duration: 0.28, begin: 180.8, index: 590 },
    { text: " Gü", duration: 0.28, begin: 182.1, index: 591 },
    { text: "lüm", duration: 0.28, begin: 182.3, index: 592 },
    { text: "se", duration: 0.28, begin: 182.5, index: 593 },
    { text: "di", duration: 0.28, begin: 182.7, index: 594 },
    { text: " ve", duration: 0.28, begin: 182.9, index: 595 },
    { text: " göz", duration: 0.28, begin: 183.1, index: 596 },
    { text: "le", duration: 0.28, begin: 183.3, index: 597 },
    { text: "ri", duration: 0.28, begin: 183.5, index: 598 },
    { text: "ni", duration: 0.28, begin: 183.7, index: 599 },
    { text: " ka", duration: 0.28, begin: 183.9, index: 600 },
    { text: "pa", duration: 0.28, begin: 184.1, index: 601 },
    { text: "tır", duration: 0.28, begin: 184.3, index: 602 },
    { text: "ken", duration: 0.28, begin: 184.5, index: 603 },
    { text: " mı", duration: 0.28, begin: 184.8, index: 604 },
    { text: "rıl", duration: 0.28, begin: 185.0, index: 605 },
    { text: "dan", duration: 0.28, begin: 185.2, index: 606 },
    { text: "dı:", duration: 0.28, begin: 185.4, index: 607 },
    { text: ' "Fır', duration: 0.28, begin: 186.4, index: 608 },
    { text: "tı", duration: 0.28, begin: 186.6, index: 609 },
    { text: "na", duration: 0.28, begin: 186.8, index: 610 },
    { text: " çık", duration: 0.28, begin: 187.1, index: 611 },
    { text: "tı", duration: 0.28, begin: 187.3, index: 612 },
    { text: "ğın", duration: 0.28, begin: 187.5, index: 613 },
    { text: "da", duration: 0.28, begin: 187.7, index: 614 },
    { text: " u", duration: 0.28, begin: 188.0, index: 615 },
    { text: "yu", duration: 0.28, begin: 188.2, index: 616 },
    { text: "ya", duration: 0.28, begin: 188.4, index: 617 },
    { text: "bi", duration: 0.28, begin: 188.6, index: 618 },
    { text: "li", duration: 0.28, begin: 188.8, index: 619 },
    { text: 'rim."', duration: 0.28, begin: 189.0, index: 620 },
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
                href="/dashboard/stories/einstein-ve-soforu"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/bir-hayir-vardir"
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
            src="/4-4.mp3"
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
