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
    // Title
    {
      text: "Ha",
      duration: 0.28,
      begin: 0.6,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "yal",
      duration: 0.28,
      begin: 1.0,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "le",
      duration: 0.28,
      begin: 1.25,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "ri",
      duration: 0.28,
      begin: 1.5,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "niz",
      duration: 0.28,
      begin: 1.75,
      index: 5,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "den",
      duration: 0.28,
      begin: 2.0,
      index: 6,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Vaz",
      duration: 0.28,
      begin: 2.25,
      index: 7,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "geç",
      duration: 0.28,
      begin: 2.5,
      index: 8,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "me",
      duration: 0.28,
      begin: 2.75,
      index: 9,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "yin",
      duration: 0.28,
      begin: 3.0,
      index: 10,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Çif", duration: 0.28, begin: 4.25, index: 11 },
    { text: "lik", duration: 0.28, begin: 4.5, index: 12 },
    { text: "ten", duration: 0.28, begin: 4.75, index: 13 },
    { text: " çif", duration: 0.28, begin: 5.0, index: 14 },
    { text: "li", duration: 0.28, begin: 5.25, index: 15 },
    { text: "ğe,", duration: 0.28, begin: 5.5, index: 16 },
    { text: " ya", duration: 0.28, begin: 6.0, index: 17 },
    { text: "rış", duration: 0.28, begin: 6.25, index: 18 },
    { text: "tan", duration: 0.28, begin: 6.5, index: 19 },
    { text: " ya", duration: 0.28, begin: 6.75, index: 20 },
    { text: "rı", duration: 0.28, begin: 7.0, index: 21 },
    { text: "şa", duration: 0.28, begin: 7.25, index: 22 },
    { text: " ko", duration: 0.28, begin: 7.5, index: 23 },
    { text: "şa", duration: 0.28, begin: 7.75, index: 24 },
    { text: "rak", duration: 0.28, begin: 8.0, index: 25 },
    { text: " at", duration: 0.28, begin: 8.75, index: 26 },
    { text: "la", duration: 0.28, begin: 9.0, index: 27 },
    { text: "rı", duration: 0.28, begin: 9.25, index: 28 },
    { text: " ter", duration: 0.28, begin: 9.5, index: 29 },
    { text: "bi", duration: 0.28, begin: 9.75, index: 30 },
    { text: "ye", duration: 0.28, begin: 10.0, index: 31 },
    { text: " et", duration: 0.28, begin: 10.25, index: 32 },
    { text: "me", duration: 0.28, begin: 10.5, index: 33 },
    { text: "ye", duration: 0.28, begin: 10.75, index: 34 },
    { text: " ça", duration: 0.28, begin: 11.0, index: 35 },
    { text: "lı", duration: 0.28, begin: 11.25, index: 36 },
    { text: "şan", duration: 0.28, begin: 11.5, index: 37 },
    { text: " gez", duration: 0.28, begin: 12.25, index: 38 },
    { text: "gin", duration: 0.28, begin: 12.5, index: 39 },
    { text: " bir", duration: 0.28, begin: 12.75, index: 40 },
    { text: " at", duration: 0.28, begin: 13.25, index: 41 },
    { text: " ter", duration: 0.28, begin: 13.5, index: 42 },
    { text: "bi", duration: 0.28, begin: 13.75, index: 43 },
    { text: "ye", duration: 0.28, begin: 14.0, index: 44 },
    { text: "ci", duration: 0.28, begin: 14.25, index: 45 },
    { text: "si", duration: 0.28, begin: 14.5, index: 46 },
    { text: "nin", duration: 0.28, begin: 14.75, index: 47 },
    { text: " genç", duration: 0.28, begin: 15.0, index: 48 },
    { text: " bir", duration: 0.28, begin: 15.25, index: 49 },
    { text: " oğ", duration: 0.28, begin: 15.5, index: 50 },
    { text: "lu", duration: 0.28, begin: 15.75, index: 51 },
    { text: " var", duration: 0.28, begin: 16.0, index: 52 },
    { text: "dı.", duration: 0.28, begin: 16.25, index: 53 },
    { text: " Ba", duration: 0.28, begin: 17.5, index: 54 },
    { text: "ba", duration: 0.28, begin: 17.75, index: 55 },
    { text: "sı", duration: 0.28, begin: 18.0, index: 56 },
    { text: "nın", duration: 0.28, begin: 18.25, index: 57 },
    { text: " i", duration: 0.28, begin: 18.5, index: 58 },
    { text: "şi", duration: 0.28, begin: 18.75, index: 59 },
    { text: " ne", duration: 0.28, begin: 19.0, index: 60 },
    { text: "de", duration: 0.28, begin: 19.25, index: 61 },
    { text: "niy", duration: 0.28, begin: 19.5, index: 62 },
    { text: "le", duration: 0.28, begin: 19.75, index: 63 },
    { text: " ço", duration: 0.28, begin: 20.2, index: 64 },
    { text: "cu", duration: 0.28, begin: 20.4, index: 65 },
    { text: "ğun", duration: 0.28, begin: 20.6, index: 66 },
    { text: " e", duration: 0.28, begin: 20.8, index: 67 },
    { text: "ği", duration: 0.28, begin: 21.0, index: 68 },
    { text: "ti", duration: 0.28, begin: 21.2, index: 69 },
    { text: "mi", duration: 0.28, begin: 21.4, index: 70 },
    { text: " ke", duration: 0.28, begin: 21.6, index: 71 },
    { text: "sin", duration: 0.28, begin: 21.8, index: 72 },
    { text: "ti", duration: 0.28, begin: 22.0, index: 73 },
    { text: "le", duration: 0.28, begin: 22.2, index: 74 },
    { text: "re", duration: 0.28, begin: 22.4, index: 75 },
    { text: " uğ", duration: 0.28, begin: 22.6, index: 76 },
    { text: "ra", duration: 0.28, begin: 22.8, index: 77 },
    { text: "mış", duration: 0.28, begin: 23.0, index: 78 },
    { text: "tı.", duration: 0.28, begin: 23.2, index: 79 },
    { text: " Bir", duration: 0.28, begin: 24.5, index: 80 },
    { text: " gün", duration: 0.28, begin: 24.7, index: 81 },
    { text: " öğ", duration: 0.28, begin: 25.1, index: 82 },
    { text: "ret", duration: 0.28, begin: 25.3, index: 83 },
    { text: "me", duration: 0.28, begin: 25.5, index: 84 },
    { text: "ni,", duration: 0.28, begin: 25.7, index: 85 },
    { text: " öğ", duration: 0.28, begin: 27.0, index: 86 },
    { text: "ren", duration: 0.28, begin: 27.2, index: 87 },
    { text: "ci", duration: 0.28, begin: 27.4, index: 88 },
    { text: "le", duration: 0.28, begin: 27.6, index: 89 },
    { text: "rin", duration: 0.28, begin: 27.8, index: 90 },
    { text: "den", duration: 0.28, begin: 28.0, index: 91 },
    { text: " bü", duration: 0.28, begin: 29.0, index: 92 },
    { text: "yü", duration: 0.28, begin: 29.25, index: 93 },
    { text: "dük", duration: 0.28, begin: 29.5, index: 94 },
    { text: "le", duration: 0.28, begin: 29.75, index: 95 },
    { text: "ri", duration: 0.28, begin: 30.0, index: 96 },
    { text: " za", duration: 0.28, begin: 30.25, index: 97 },
    { text: "man", duration: 0.28, begin: 30.5, index: 98 },
    { text: " ne", duration: 0.28, begin: 30.75, index: 99 },
    { text: " ol", duration: 0.28, begin: 31.0, index: 100 },
    { text: "mak", duration: 0.28, begin: 31.25, index: 101 },
    { text: " ve", duration: 0.28, begin: 31.5, index: 102 },
    { text: " ne", duration: 0.28, begin: 32.25, index: 103 },
    { text: " yap", duration: 0.28, begin: 32.5, index: 104 },
    { text: "mak", duration: 0.28, begin: 32.75, index: 105 },
    { text: " is", duration: 0.28, begin: 33.25, index: 106 },
    { text: "te", duration: 0.28, begin: 33.5, index: 107 },
    { text: "dik", duration: 0.28, begin: 33.75, index: 108 },
    { text: "le", duration: 0.28, begin: 34.0, index: 109 },
    { text: "ri", duration: 0.28, begin: 34.25, index: 110 },
    { text: " ko", duration: 0.28, begin: 34.5, index: 111 },
    { text: "nu", duration: 0.28, begin: 34.75, index: 112 },
    { text: "sun", duration: 0.28, begin: 35.0, index: 113 },
    { text: "da", duration: 0.28, begin: 35.25, index: 114 },
    { text: " bir", duration: 0.38, begin: 35.75, index: 115 },
    { text: " kom", duration: 0.38, begin: 36.0, index: 116 },
    { text: "po", duration: 0.38, begin: 36.25, index: 117 },
    { text: "zis", duration: 0.38, begin: 36.5, index: 118 },
    { text: "yon", duration: 0.38, begin: 36.75, index: 119 },
    { text: " yaz", duration: 0.28, begin: 37.0, index: 120 },
    { text: "ma", duration: 0.28, begin: 37.25, index: 121 },
    { text: "la", duration: 0.28, begin: 37.5, index: 122 },
    { text: "rı", duration: 0.28, begin: 37.75, index: 123 },
    { text: "nı", duration: 0.28, begin: 38.0, index: 124 },
    { text: " is", duration: 0.28, begin: 38.25, index: 125 },
    { text: "te", duration: 0.28, begin: 38.5, index: 126 },
    { text: "di.", duration: 0.28, begin: 38.75, index: 127 },
    { text: " Ço", duration: 0.28, begin: 40.0, index: 128 },
    { text: "cuk", duration: 0.28, begin: 40.25, index: 129 },
    { text: " bü", duration: 0.28, begin: 40.75, index: 130 },
    { text: "tün", duration: 0.28, begin: 41.0, index: 131 },
    { text: " ge", duration: 0.28, begin: 41.25, index: 132 },
    { text: "ce", duration: 0.28, begin: 41.5, index: 133 },
    { text: " o", duration: 0.28, begin: 41.75, index: 134 },
    { text: "tu", duration: 0.28, begin: 42.0, index: 135 },
    { text: "rup", duration: 0.28, begin: 42.25, index: 136 },
    { text: " gü", duration: 0.28, begin: 42.5, index: 137 },
    { text: "nün", duration: 0.28, begin: 42.75, index: 138 },
    { text: " bi", duration: 0.28, begin: 43.0, index: 139 },
    { text: "rin", duration: 0.28, begin: 43.25, index: 140 },
    { text: "de", duration: 0.28, begin: 43.5, index: 141 },
    { text: " at", duration: 0.28, begin: 44.25, index: 142 },
    { text: " çift", duration: 0.28, begin: 44.5, index: 143 },
    { text: "li", duration: 0.28, begin: 44.75, index: 144 },
    { text: "ği", duration: 0.28, begin: 45.0, index: 145 },
    { text: "ne", duration: 0.28, begin: 45.25, index: 146 },
    { text: " sa", duration: 0.28, begin: 45.5, index: 147 },
    { text: "hip", duration: 0.28, begin: 45.75, index: 148 },
    { text: " ol", duration: 0.28, begin: 46.0, index: 149 },
    { text: "ma", duration: 0.28, begin: 46.25, index: 150 },
    { text: "yı", duration: 0.28, begin: 46.5, index: 151 },
    { text: " he", duration: 0.28, begin: 46.75, index: 152 },
    { text: "def", duration: 0.28, begin: 47.0, index: 153 },
    { text: "le", duration: 0.28, begin: 47.25, index: 154 },
    { text: "di", duration: 0.28, begin: 47.5, index: 155 },
    { text: "ği", duration: 0.28, begin: 47.75, index: 156 },
    { text: "ni", duration: 0.28, begin: 48.0, index: 157 },
    { text: " an", duration: 0.28, begin: 48.25, index: 158 },
    { text: "la", duration: 0.28, begin: 48.5, index: 159 },
    { text: "tan", duration: 0.28, begin: 48.75, index: 160 },
    { text: " ye", duration: 0.28, begin: 49.5, index: 161 },
    { text: "di", duration: 0.28, begin: 49.75, index: 162 },
    { text: " say", duration: 0.28, begin: 50.0, index: 163 },
    { text: "fa", duration: 0.28, begin: 50.25, index: 164 },
    { text: "lık", duration: 0.28, begin: 50.5, index: 165 },
    { text: " bir", duration: 0.28, begin: 50.75, index: 166 },
    { text: " kom", duration: 0.28, begin: 51.0, index: 167 },
    { text: "po", duration: 0.28, begin: 51.25, index: 168 },
    { text: "zis", duration: 0.28, begin: 51.5, index: 169 },
    { text: "yon", duration: 0.28, begin: 51.75, index: 170 },
    { text: " yaz", duration: 0.28, begin: 52.0, index: 171 },
    { text: "dı.", duration: 0.28, begin: 52.25, index: 172 },
    { text: " Ha", duration: 0.28, begin: 53.5, index: 173 },
    { text: "ya", duration: 0.28, begin: 53.75, index: 174 },
    { text: "li", duration: 0.28, begin: 54.0, index: 175 },
    { text: "ni", duration: 0.28, begin: 54.25, index: 176 },
    { text: " en", duration: 0.28, begin: 55.0, index: 177 },
    { text: " in", duration: 0.28, begin: 55.25, index: 178 },
    { text: "ce", duration: 0.28, begin: 55.5, index: 179 },
    { text: " ay", duration: 0.28, begin: 55.75, index: 180 },
    { text: "rın", duration: 0.28, begin: 56.0, index: 181 },
    { text: "tı", duration: 0.28, begin: 56.25, index: 182 },
    { text: "la", duration: 0.28, begin: 56.5, index: 183 },
    { text: "rıy", duration: 0.28, begin: 56.75, index: 184 },
    { text: "la", duration: 0.28, begin: 57.0, index: 185 },
    { text: " an", duration: 0.28, begin: 57.5, index: 186 },
    { text: "lat", duration: 0.28, begin: 57.75, index: 187 },
    { text: "tı.", duration: 0.28, begin: 58.0, index: 188 },
    { text: " Hat", duration: 0.28, begin: 59.25, index: 189 },
    { text: "ta", duration: 0.28, begin: 59.5, index: 190 },
    { text: " ha", duration: 0.28, begin: 59.75, index: 191 },
    { text: "ya", duration: 0.28, begin: 60.0, index: 192 },
    { text: "lin", duration: 0.28, begin: 60.25, index: 193 },
    { text: "de", duration: 0.28, begin: 60.5, index: 194 },
    { text: "ki", duration: 0.28, begin: 60.75, index: 195 },
    { text: " i", duration: 0.28, begin: 61.0, index: 196 },
    { text: "ki", duration: 0.28, begin: 61.25, index: 197 },
    { text: " yüz", duration: 0.28, begin: 61.5, index: 198 },
    { text: " dö", duration: 0.28, begin: 61.75, index: 199 },
    { text: "nüm", duration: 0.28, begin: 62.0, index: 200 },
    { text: "lük", duration: 0.28, begin: 62.25, index: 201 },
    { text: " çift", duration: 0.28, begin: 62.5, index: 202 },
    { text: "li", duration: 0.28, begin: 62.75, index: 203 },
    { text: "ğin", duration: 0.28, begin: 63.0, index: 204 },
    { text: " kro", duration: 0.28, begin: 63.25, index: 205 },
    { text: "ki", duration: 0.28, begin: 63.5, index: 206 },
    { text: "si", duration: 0.28, begin: 63.75, index: 207 },
    { text: "ni", duration: 0.28, begin: 64.0, index: 208 },
    { text: " de", duration: 0.28, begin: 64.25, index: 209 },
    { text: " çiz", duration: 0.28, begin: 64.5, index: 210 },
    { text: "di.", duration: 0.28, begin: 64.75, index: 211 },
    { text: " Bi", duration: 0.28, begin: 66.0, index: 212 },
    { text: "na", duration: 0.28, begin: 66.25, index: 213 },
    { text: "la", duration: 0.28, begin: 66.5, index: 214 },
    { text: "rın,", duration: 0.28, begin: 66.75, index: 215 },
    { text: " a", duration: 0.28, begin: 67.5, index: 216 },
    { text: "hır", duration: 0.28, begin: 67.75, index: 217 },
    { text: "la", duration: 0.28, begin: 68.0, index: 218 },
    { text: "rın", duration: 0.28, begin: 68.25, index: 219 },
    { text: " ve", duration: 0.28, begin: 68.5, index: 220 },
    { text: " ko", duration: 0.28, begin: 68.75, index: 221 },
    { text: "şu", duration: 0.28, begin: 69.0, index: 222 },
    { text: " yol", duration: 0.28, begin: 69.2, index: 223 },
    { text: "la", duration: 0.28, begin: 69.4, index: 224 },
    { text: "rı", duration: 0.28, begin: 69.6, index: 225 },
    { text: "nın", duration: 0.28, begin: 69.8, index: 226 },
    { text: " yer", duration: 0.28, begin: 70.0, index: 227 },
    { text: "le", duration: 0.28, begin: 70.2, index: 228 },
    { text: "ri", duration: 0.28, begin: 70.4, index: 229 },
    { text: "ni", duration: 0.28, begin: 70.6, index: 230 },
    { text: " gös", duration: 0.38, begin: 70.8, index: 231 },
    { text: "ter", duration: 0.38, begin: 71.1, index: 232 },
    { text: "di.", duration: 0.38, begin: 71.35, index: 233 },
    { text: " Kro", duration: 0.28, begin: 72.75, index: 234 },
    { text: "ki", duration: 0.28, begin: 73.0, index: 235 },
    { text: "ye,", duration: 0.28, begin: 73.25, index: 236 },
    { text: " i", duration: 0.28, begin: 74.0, index: 237 },
    { text: "ki", duration: 0.28, begin: 74.25, index: 238 },
    { text: " yüz", duration: 0.28, begin: 74.5, index: 239 },
    { text: " dö", duration: 0.28, begin: 74.75, index: 240 },
    { text: "nüm", duration: 0.28, begin: 75.0, index: 241 },
    { text: "lük", duration: 0.28, begin: 75.25, index: 242 },
    { text: " a", duration: 0.28, begin: 75.5, index: 243 },
    { text: "ra", duration: 0.28, begin: 75.75, index: 244 },
    { text: "zi", duration: 0.28, begin: 76.0, index: 245 },
    { text: "nin", duration: 0.28, begin: 76.25, index: 246 },
    { text: " ü", duration: 0.28, begin: 76.5, index: 247 },
    { text: "ze", duration: 0.28, begin: 76.75, index: 248 },
    { text: "ri", duration: 0.28, begin: 77.0, index: 249 },
    { text: "ne", duration: 0.28, begin: 77.25, index: 250 },
    { text: " o", duration: 0.28, begin: 77.5, index: 251 },
    { text: "tu", duration: 0.28, begin: 77.75, index: 252 },
    { text: "ra", duration: 0.28, begin: 78.0, index: 253 },
    { text: "cak", duration: 0.28, begin: 78.25, index: 254 },
    { text: " bin", duration: 0.28, begin: 78.75, index: 255 },
    { text: " met", duration: 0.28, begin: 79.0, index: 256 },
    { text: "re", duration: 0.28, begin: 79.25, index: 257 },
    { text: "ka", duration: 0.28, begin: 79.5, index: 258 },
    { text: "re", duration: 0.28, begin: 79.75, index: 259 },
    { text: "lik", duration: 0.28, begin: 80.0, index: 260 },
    { text: " e", duration: 0.28, begin: 80.25, index: 261 },
    { text: "vin", duration: 0.28, begin: 80.5, index: 262 },
    { text: " ay", duration: 0.28, begin: 80.75, index: 263 },
    { text: "rın", duration: 0.28, begin: 81.0, index: 264 },
    { text: "tı", duration: 0.28, begin: 81.25, index: 265 },
    { text: "lı", duration: 0.28, begin: 81.5, index: 266 },
    { text: " pla", duration: 0.28, begin: 81.75, index: 267 },
    { text: "nı", duration: 0.28, begin: 82.0, index: 268 },
    { text: "nı", duration: 0.28, begin: 82.25, index: 269 },
    { text: "da", duration: 0.28, begin: 82.5, index: 270 },
    { text: " ek", duration: 0.28, begin: 82.75, index: 271 },
    { text: "le", duration: 0.28, begin: 83.0, index: 272 },
    { text: "di.", duration: 0.28, begin: 83.25, index: 273 },
    { text: " Er", duration: 0.28, begin: 84.5, index: 274 },
    { text: "te", duration: 0.28, begin: 84.75, index: 275 },
    { text: "si", duration: 0.28, begin: 85.0, index: 276 },
    { text: " gün", duration: 0.28, begin: 85.25, index: 277 },
    { text: " ho", duration: 0.28, begin: 85.5, index: 278 },
    { text: "ca", duration: 0.28, begin: 85.75, index: 279 },
    { text: "sı", duration: 0.28, begin: 86.0, index: 280 },
    { text: "na", duration: 0.28, begin: 86.25, index: 281 },
    { text: " sun", duration: 0.28, begin: 86.5, index: 282 },
    { text: "du", duration: 0.28, begin: 86.75, index: 283 },
    { text: "ğu", duration: 0.28, begin: 87.0, index: 284 },
    { text: " ye", duration: 0.28, begin: 87.5, index: 285 },
    { text: "di", duration: 0.28, begin: 87.75, index: 286 },
    { text: " say", duration: 0.28, begin: 88.0, index: 287 },
    { text: "fa", duration: 0.28, begin: 88.25, index: 288 },
    { text: "lık", duration: 0.28, begin: 88.5, index: 289 },
    { text: " ö", duration: 0.28, begin: 88.75, index: 290 },
    { text: "dev,", duration: 0.28, begin: 89.0, index: 291 },
    { text: " tam", duration: 0.28, begin: 90.0, index: 292 },
    { text: " kal", duration: 0.28, begin: 90.25, index: 293 },
    { text: "bi", duration: 0.28, begin: 90.5, index: 294 },
    { text: "nin", duration: 0.28, begin: 90.75, index: 295 },
    { text: " se", duration: 0.28, begin: 91.0, index: 296 },
    { text: "siy", duration: 0.28, begin: 91.25, index: 297 },
    { text: "di.", duration: 0.28, begin: 91.5, index: 298 },
    { text: " İ", duration: 0.28, begin: 93.0, index: 299 },
    { text: "ki", duration: 0.28, begin: 93.25, index: 300 },
    { text: " gün", duration: 0.28, begin: 93.5, index: 301 },
    { text: " son", duration: 0.28, begin: 93.75, index: 302 },
    { text: "ra", duration: 0.28, begin: 94.0, index: 303 },
    { text: " ö", duration: 0.28, begin: 94.25, index: 304 },
    { text: "de", duration: 0.28, begin: 94.5, index: 305 },
    { text: "vi", duration: 0.28, begin: 94.75, index: 306 },
    { text: " ge", duration: 0.28, begin: 95.0, index: 307 },
    { text: "ri", duration: 0.28, begin: 95.25, index: 308 },
    { text: " al", duration: 0.28, begin: 95.5, index: 309 },
    { text: "dı.", duration: 0.28, begin: 95.75, index: 310 },
    { text: " Ka", duration: 0.28, begin: 96.5, index: 311 },
    { text: "ğı", duration: 0.28, begin: 96.75, index: 312 },
    { text: "dın", duration: 0.28, begin: 97.0, index: 313 },
    { text: " ü", duration: 0.28, begin: 97.2, index: 314 },
    { text: "ze", duration: 0.28, begin: 97.4, index: 315 },
    { text: "rin", duration: 0.28, begin: 97.6, index: 316 },
    { text: "de", duration: 0.28, begin: 97.8, index: 317 },
    { text: " kır", duration: 0.28, begin: 98.0, index: 318 },
    { text: "mı", duration: 0.28, begin: 98.2, index: 319 },
    { text: "zı", duration: 0.28, begin: 98.4, index: 320 },
    { text: " ka", duration: 0.28, begin: 98.6, index: 321 },
    { text: "lem", duration: 0.28, begin: 98.8, index: 322 },
    { text: "le", duration: 0.28, begin: 99.0, index: 323 },
    { text: " ya", duration: 0.28, begin: 99.25, index: 324 },
    { text: "zıl", duration: 0.28, begin: 99.5, index: 325 },
    { text: "mış", duration: 0.28, begin: 99.75, index: 326 },
    { text: " ko", duration: 0.28, begin: 100.75, index: 327 },
    { text: "ca", duration: 0.28, begin: 101.0, index: 328 },
    { text: "man", duration: 0.28, begin: 101.25, index: 329 },
    { text: " bir", duration: 0.28, begin: 101.5, index: 330 },
    { text: ' "sı', duration: 0.28, begin: 101.75, index: 331 },
    { text: 'fır"', duration: 0.28, begin: 102.0, index: 332 },
    { text: " ve", duration: 0.28, begin: 102.25, index: 333 },
    { text: ' "Ders', duration: 0.28, begin: 103.5, index: 334 },
    { text: "ten", duration: 0.28, begin: 103.75, index: 335 },
    { text: " son", duration: 0.28, begin: 104.0, index: 336 },
    { text: "ra", duration: 0.28, begin: 104.25, index: 337 },
    { text: " be", duration: 0.28, begin: 104.5, index: 338 },
    { text: "ni", duration: 0.28, begin: 104.75, index: 339 },
    { text: ' gör"', duration: 0.28, begin: 105.0, index: 340 },
    { text: " u", duration: 0.28, begin: 105.75, index: 341 },
    { text: "ya", duration: 0.28, begin: 106.0, index: 342 },
    { text: "rı", duration: 0.28, begin: 106.25, index: 343 },
    { text: "sı", duration: 0.28, begin: 106.5, index: 344 },
    { text: " var", duration: 0.28, begin: 106.75, index: 345 },
    { text: "dı.", duration: 0.28, begin: 107.0, index: 346 },
    { text: " Ço", duration: 0.28, begin: 108.0, index: 347 },
    { text: "cuk:", duration: 0.28, begin: 108.25, index: 348 },
    { text: ' "Ne', duration: 0.28, begin: 109.0, index: 349 },
    { text: "den", duration: 0.28, begin: 109.25, index: 350 },
    { text: " sı", duration: 0.28, begin: 109.5, index: 351 },
    { text: "fır", duration: 0.28, begin: 109.75, index: 352 },
    { text: " al", duration: 0.28, begin: 110.0, index: 353 },
    { text: 'dım?"', duration: 0.28, begin: 110.25, index: 354 },
    { text: " di", duration: 0.28, begin: 110.75, index: 355 },
    { text: "ye", duration: 0.28, begin: 111.0, index: 356 },
    { text: " öğ", duration: 0.28, begin: 111.25, index: 357 },
    { text: "ret", duration: 0.28, begin: 111.5, index: 358 },
    { text: "me", duration: 0.28, begin: 111.75, index: 359 },
    { text: "ni", duration: 0.28, begin: 112.0, index: 360 },
    { text: "ne", duration: 0.28, begin: 112.25, index: 361 },
    { text: " me", duration: 0.28, begin: 112.5, index: 362 },
    { text: "rak", duration: 0.28, begin: 112.75, index: 363 },
    { text: "la", duration: 0.28, begin: 113.0, index: 364 },
    { text: " sor", duration: 0.28, begin: 113.25, index: 365 },
    { text: "du.", duration: 0.28, begin: 113.5, index: 366 },
    { text: " Öğ", duration: 0.28, begin: 114.5, index: 367 },
    { text: "ret", duration: 0.28, begin: 114.75, index: 368 },
    { text: "me", duration: 0.28, begin: 115.0, index: 369 },
    { text: "ni:", duration: 0.28, begin: 115.25, index: 370 },
    { text: ' "Bu', duration: 0.28, begin: 116.25, index: 371 },
    { text: " se", duration: 0.28, begin: 116.5, index: 372 },
    { text: "nin", duration: 0.28, begin: 116.75, index: 373 },
    { text: " ya", duration: 0.28, begin: 117.0, index: 374 },
    { text: "şın", duration: 0.28, begin: 117.25, index: 375 },
    { text: "da", duration: 0.28, begin: 117.5, index: 376 },
    { text: " bir", duration: 0.28, begin: 117.75, index: 377 },
    { text: " ço", duration: 0.28, begin: 118.0, index: 378 },
    { text: "cuk", duration: 0.28, begin: 118.25, index: 379 },
    { text: " i", duration: 0.28, begin: 118.5, index: 380 },
    { text: "çin", duration: 0.28, begin: 118.75, index: 381 },
    { text: " ger", duration: 0.28, begin: 119.5, index: 382 },
    { text: "çek", duration: 0.28, begin: 119.75, index: 383 },
    { text: "ci", duration: 0.28, begin: 120.0, index: 384 },
    { text: " ol", duration: 0.28, begin: 120.25, index: 385 },
    { text: "ma", duration: 0.28, begin: 120.5, index: 386 },
    { text: "yan", duration: 0.28, begin: 120.75, index: 387 },
    { text: " bir", duration: 0.28, begin: 121.0, index: 388 },
    { text: " ha", duration: 0.28, begin: 121.25, index: 389 },
    { text: "yal.", duration: 0.28, begin: 121.5, index: 390 },
    { text: " Pa", duration: 0.28, begin: 122.75, index: 391 },
    { text: "ran", duration: 0.28, begin: 123.0, index: 392 },
    { text: " yok.", duration: 0.28, begin: 123.25, index: 393 },
    { text: " Gez", duration: 0.28, begin: 124.25, index: 394 },
    { text: "gin", duration: 0.28, begin: 124.5, index: 395 },
    { text: "ci", duration: 0.28, begin: 124.75, index: 396 },
    { text: " bir", duration: 0.28, begin: 125.0, index: 397 },
    { text: " a", duration: 0.28, begin: 125.25, index: 398 },
    { text: "i", duration: 0.28, begin: 125.5, index: 399 },
    { text: "le", duration: 0.28, begin: 125.75, index: 400 },
    { text: "den", duration: 0.28, begin: 126.0, index: 401 },
    { text: " ge", duration: 0.28, begin: 126.25, index: 402 },
    { text: "li", duration: 0.28, begin: 126.5, index: 403 },
    { text: "yor", duration: 0.28, begin: 126.75, index: 404 },
    { text: "sun.", duration: 0.28, begin: 127.0, index: 405 },
    { text: " Kay", duration: 0.28, begin: 128.0, index: 406 },
    { text: "na", duration: 0.28, begin: 128.25, index: 407 },
    { text: "ğı", duration: 0.28, begin: 128.5, index: 408 },
    { text: "nız", duration: 0.28, begin: 128.75, index: 409 },
    { text: " yok.", duration: 0.28, begin: 129.0, index: 410 },
    { text: " At", duration: 0.28, begin: 130.0, index: 411 },
    { text: " çift", duration: 0.28, begin: 130.25, index: 412 },
    { text: "li", duration: 0.28, begin: 130.5, index: 413 },
    { text: "ği", duration: 0.28, begin: 130.75, index: 414 },
    { text: " kur", duration: 0.28, begin: 131.0, index: 415 },
    { text: "mak", duration: 0.28, begin: 131.25, index: 416 },
    { text: " bü", duration: 0.28, begin: 131.75, index: 417 },
    { text: "yük", duration: 0.28, begin: 132.0, index: 418 },
    { text: " pa", duration: 0.28, begin: 132.25, index: 419 },
    { text: "ra", duration: 0.28, begin: 132.5, index: 420 },
    { text: " ge", duration: 0.28, begin: 132.75, index: 421 },
    { text: "rek", duration: 0.28, begin: 133.0, index: 422 },
    { text: "ti", duration: 0.28, begin: 133.25, index: 423 },
    { text: "rir.", duration: 0.28, begin: 133.5, index: 424 },
    { text: " Ön", duration: 0.28, begin: 134.5, index: 425 },
    { text: "ce", duration: 0.28, begin: 134.75, index: 426 },
    { text: " a", duration: 0.28, begin: 135.0, index: 427 },
    { text: "ra", duration: 0.28, begin: 135.25, index: 428 },
    { text: "zi", duration: 0.28, begin: 135.5, index: 429 },
    { text: "yi", duration: 0.28, begin: 135.75, index: 430 },
    { text: " sa", duration: 0.28, begin: 136.0, index: 431 },
    { text: "tın", duration: 0.28, begin: 136.25, index: 432 },
    { text: " al", duration: 0.28, begin: 136.5, index: 433 },
    { text: "man", duration: 0.28, begin: 136.75, index: 434 },
    { text: " la", duration: 0.28, begin: 137.0, index: 435 },
    { text: "zım.", duration: 0.28, begin: 137.25, index: 436 },
    { text: " Da", duration: 0.28, begin: 138.5, index: 437 },
    { text: "mız", duration: 0.28, begin: 138.75, index: 438 },
    { text: "lık", duration: 0.28, begin: 139.0, index: 439 },
    { text: " hay", duration: 0.28, begin: 139.5, index: 440 },
    { text: "van", duration: 0.28, begin: 139.75, index: 441 },
    { text: "lar", duration: 0.28, begin: 140.0, index: 442 },
    { text: "da", duration: 0.28, begin: 140.25, index: 443 },
    { text: " al", duration: 0.28, begin: 140.5, index: 444 },
    { text: "man", duration: 0.28, begin: 140.75, index: 445 },
    { text: " ge", duration: 0.28, begin: 141.0, index: 446 },
    { text: "re", duration: 0.28, begin: 141.25, index: 447 },
    { text: "ki", duration: 0.28, begin: 141.5, index: 448 },
    { text: "yor.", duration: 0.28, begin: 141.75, index: 449 },
    { text: " Bu", duration: 0.28, begin: 143.0, index: 450 },
    { text: "nu", duration: 0.28, begin: 143.25, index: 451 },
    { text: " ba", duration: 0.28, begin: 143.5, index: 452 },
    { text: "şar", duration: 0.28, begin: 143.75, index: 453 },
    { text: "man", duration: 0.28, begin: 144.0, index: 454 },
    { text: " im", duration: 0.28, begin: 144.25, index: 455 },
    { text: "kan", duration: 0.28, begin: 144.5, index: 456 },
    { text: "sız.", duration: 0.28, begin: 144.75, index: 457 },
    { text: " E", duration: 0.28, begin: 146.0, index: 458 },
    { text: "ğer", duration: 0.28, begin: 146.25, index: 459 },
    { text: " ö", duration: 0.28, begin: 146.5, index: 460 },
    { text: "de", duration: 0.28, begin: 146.75, index: 461 },
    { text: "vi", duration: 0.28, begin: 147.0, index: 462 },
    { text: "ni", duration: 0.28, begin: 147.25, index: 463 },
    { text: " ger", duration: 0.28, begin: 148.0, index: 464 },
    { text: "çek", duration: 0.28, begin: 148.25, index: 465 },
    { text: "çi", duration: 0.28, begin: 148.5, index: 466 },
    { text: " he", duration: 0.28, begin: 148.75, index: 467 },
    { text: "def", duration: 0.28, begin: 149.0, index: 468 },
    { text: "ler", duration: 0.28, begin: 149.25, index: 469 },
    { text: " be", duration: 0.38, begin: 149.5, index: 470 },
    { text: "lir", duration: 0.38, begin: 149.75, index: 471 },
    { text: "le", duration: 0.38, begin: 150.0, index: 472 },
    { text: "dik", duration: 0.38, begin: 150.25, index: 473 },
    { text: "ten", duration: 0.38, begin: 150.5, index: 474 },
    { text: " son", duration: 0.28, begin: 151.0, index: 475 },
    { text: "ra", duration: 0.28, begin: 151.25, index: 476 },
    { text: " ye", duration: 0.28, begin: 152.0, index: 477 },
    { text: "ni", duration: 0.28, begin: 152.25, index: 478 },
    { text: "den", duration: 0.28, begin: 152.5, index: 479 },
    { text: " ya", duration: 0.28, begin: 152.75, index: 480 },
    { text: "zar", duration: 0.28, begin: 153.0, index: 481 },
    { text: "san,", duration: 0.28, begin: 153.25, index: 482 },
    { text: " o", duration: 0.28, begin: 154.25, index: 483 },
    { text: " za", duration: 0.28, begin: 154.5, index: 484 },
    { text: "man", duration: 0.28, begin: 154.75, index: 485 },
    { text: " no", duration: 0.28, begin: 155.0, index: 486 },
    { text: "tu", duration: 0.28, begin: 155.25, index: 487 },
    { text: "nu", duration: 0.28, begin: 155.5, index: 488 },
    { text: " ye", duration: 0.28, begin: 155.75, index: 489 },
    { text: "ni", duration: 0.28, begin: 156.0, index: 490 },
    { text: "den", duration: 0.28, begin: 156.25, index: 491 },
    { text: " göz", duration: 0.28, begin: 156.5, index: 492 },
    { text: "den", duration: 0.28, begin: 156.75, index: 493 },
    { text: " ge", duration: 0.28, begin: 157.0, index: 494 },
    { text: "çi", duration: 0.28, begin: 157.25, index: 495 },
    { text: "ri", duration: 0.28, begin: 157.5, index: 496 },
    { text: 'rim"', duration: 0.28, begin: 157.75, index: 497 },
    { text: " de", duration: 0.28, begin: 158.5, index: 498 },
    { text: "di.", duration: 0.28, begin: 158.75, index: 499 },
    { text: " Ço", duration: 0.28, begin: 159.75, index: 500 },
    { text: "cuk", duration: 0.28, begin: 160.0, index: 501 },
    { text: " e", duration: 0.28, begin: 160.25, index: 502 },
    { text: "vi", duration: 0.28, begin: 160.5, index: 503 },
    { text: "ne", duration: 0.28, begin: 160.75, index: 504 },
    { text: " dön", duration: 0.28, begin: 161.0, index: 505 },
    { text: "dü", duration: 0.28, begin: 161.25, index: 506 },
    { text: " ve", duration: 0.28, begin: 161.5, index: 507 },
    { text: " u", duration: 0.28, begin: 162.0, index: 508 },
    { text: "zun", duration: 0.28, begin: 162.25, index: 509 },
    { text: " u", duration: 0.28, begin: 162.5, index: 510 },
    { text: "zun", duration: 0.28, begin: 162.75, index: 511 },
    { text: " dü", duration: 0.28, begin: 163.25, index: 512 },
    { text: "şün", duration: 0.28, begin: 163.5, index: 513 },
    { text: "dü.", duration: 0.28, begin: 163.75, index: 514 },
    { text: " Ba", duration: 0.28, begin: 165.0, index: 515 },
    { text: "ba", duration: 0.28, begin: 165.25, index: 516 },
    { text: "sı", duration: 0.28, begin: 165.5, index: 517 },
    { text: "na", duration: 0.28, begin: 165.75, index: 518 },
    { text: " da", duration: 0.28, begin: 166.0, index: 519 },
    { text: "nış", duration: 0.28, begin: 166.25, index: 520 },
    { text: "tı.", duration: 0.28, begin: 166.5, index: 521 },
    { text: " Ba", duration: 0.28, begin: 167.25, index: 522 },
    { text: "ba", duration: 0.28, begin: 167.5, index: 523 },
    { text: "sı", duration: 0.28, begin: 167.75, index: 524 },
    { text: " o", duration: 0.28, begin: 168.0, index: 525 },
    { text: "na;", duration: 0.28, begin: 168.25, index: 526 },
    { text: ' "Oğ', duration: 0.28, begin: 169.0, index: 527 },
    { text: "lum,", duration: 0.28, begin: 169.25, index: 528 },
    { text: " bu", duration: 0.28, begin: 170.0, index: 529 },
    { text: " ko", duration: 0.28, begin: 170.25, index: 530 },
    { text: "nu", duration: 0.28, begin: 170.5, index: 531 },
    { text: "da", duration: 0.28, begin: 170.75, index: 532 },
    { text: " ka", duration: 0.28, begin: 171.0, index: 533 },
    { text: "ra", duration: 0.28, begin: 171.25, index: 534 },
    { text: "rı", duration: 0.28, begin: 171.5, index: 535 },
    { text: "nı", duration: 0.28, begin: 171.75, index: 536 },
    { text: " ken", duration: 0.28, begin: 172.0, index: 537 },
    { text: "din", duration: 0.28, begin: 172.25, index: 538 },
    { text: " ver", duration: 0.28, begin: 172.5, index: 539 },
    { text: "me", duration: 0.28, begin: 172.75, index: 540 },
    { text: "li", duration: 0.28, begin: 173.0, index: 541 },
    { text: "sin.", duration: 0.28, begin: 173.25, index: 542 },
    { text: " Bu", duration: 0.28, begin: 174.0, index: 543 },
    { text: " se", duration: 0.38, begin: 174.25, index: 544 },
    { text: "nin", duration: 0.38, begin: 174.5, index: 545 },
    { text: " ha", duration: 0.38, begin: 174.75, index: 546 },
    { text: "ya", duration: 0.38, begin: 175.0, index: 547 },
    { text: "tın", duration: 0.38, begin: 175.25, index: 548 },
    { text: " i", duration: 0.38, begin: 175.75, index: 549 },
    { text: "çin", duration: 0.38, begin: 176.0, index: 550 },
    { text: " ol", duration: 0.38, begin: 176.75, index: 551 },
    { text: "duk", duration: 0.38, begin: 177.0, index: 552 },
    { text: "ça", duration: 0.38, begin: 177.25, index: 553 },
    { text: " ö", duration: 0.28, begin: 177.75, index: 554 },
    { text: "nem", duration: 0.28, begin: 178.0, index: 555 },
    { text: "li", duration: 0.28, begin: 178.25, index: 556 },
    { text: " bir", duration: 0.28, begin: 178.5, index: 557 },
    { text: " se", duration: 0.28, begin: 178.75, index: 558 },
    { text: "çim.", duration: 0.28, begin: 179.0, index: 559 },
    { text: " Ço", duration: 0.28, begin: 180.25, index: 560 },
    { text: "cuk", duration: 0.28, begin: 180.5, index: 561 },
    { text: " bir", duration: 0.28, begin: 181.0, index: 562 },
    { text: " haf", duration: 0.28, begin: 181.25, index: 563 },
    { text: "ta", duration: 0.28, begin: 181.5, index: 564 },
    { text: " ka", duration: 0.28, begin: 181.75, index: 565 },
    { text: "dar", duration: 0.28, begin: 182.0, index: 566 },
    { text: " dü", duration: 0.38, begin: 182.25, index: 567 },
    { text: "şün", duration: 0.38, begin: 182.5, index: 568 },
    { text: "dük", duration: 0.38, begin: 182.75, index: 569 },
    { text: "ten", duration: 0.38, begin: 183.0, index: 570 },
    { text: " son", duration: 0.38, begin: 183.25, index: 571 },
    { text: "ra", duration: 0.38, begin: 183.5, index: 572 },
    { text: " ö", duration: 0.28, begin: 184.5, index: 573 },
    { text: "de", duration: 0.28, begin: 184.75, index: 574 },
    { text: "vi", duration: 0.28, begin: 185.0, index: 575 },
    { text: "ni", duration: 0.28, begin: 185.25, index: 576 },
    { text: " hiç", duration: 0.28, begin: 185.5, index: 577 },
    { text: " bir", duration: 0.28, begin: 185.75, index: 578 },
    { text: " de", duration: 0.28, begin: 186.0, index: 579 },
    { text: "ği", duration: 0.28, begin: 186.25, index: 580 },
    { text: "şik", duration: 0.28, begin: 186.5, index: 581 },
    { text: "lik", duration: 0.28, begin: 186.75, index: 582 },
    { text: " yap", duration: 0.28, begin: 187.25, index: 583 },
    { text: "ma", duration: 0.28, begin: 187.5, index: 584 },
    { text: "dan", duration: 0.28, begin: 187.75, index: 585 },
    { text: " ge", duration: 0.28, begin: 188.0, index: 586 },
    { text: "ri", duration: 0.28, begin: 188.25, index: 587 },
    { text: " gö", duration: 0.28, begin: 188.5, index: 588 },
    { text: "tür", duration: 0.28, begin: 188.75, index: 589 },
    { text: "dü.", duration: 0.28, begin: 189.0, index: 590 },
    { text: ' "Siz', duration: 0.28, begin: 190.0, index: 591 },
    { text: " ver", duration: 0.28, begin: 190.25, index: 592 },
    { text: "di", duration: 0.28, begin: 190.5, index: 593 },
    { text: "ği", duration: 0.28, begin: 190.75, index: 594 },
    { text: "niz", duration: 0.28, begin: 191.0, index: 595 },
    { text: " no", duration: 0.28, begin: 191.25, index: 596 },
    { text: "tu", duration: 0.28, begin: 191.5, index: 597 },
    { text: " de", duration: 0.28, begin: 191.75, index: 598 },
    { text: "ğiş", duration: 0.28, begin: 192.0, index: 599 },
    { text: "tir", duration: 0.28, begin: 192.25, index: 600 },
    { text: "me", duration: 0.28, begin: 192.5, index: 601 },
    { text: "yin,", duration: 0.28, begin: 192.75, index: 602 },
    { text: " ben", duration: 0.28, begin: 193.5, index: 603 },
    { text: " de", duration: 0.28, begin: 193.75, index: 604 },
    { text: " ha", duration: 0.28, begin: 194.0, index: 605 },
    { text: "yal", duration: 0.28, begin: 194.25, index: 606 },
    { text: "le", duration: 0.28, begin: 194.5, index: 607 },
    { text: "ri", duration: 0.28, begin: 194.75, index: 608 },
    { text: 'mi"', duration: 0.28, begin: 195.0, index: 609 },
    { text: " de", duration: 0.28, begin: 195.25, index: 610 },
    { text: "di.", duration: 0.28, begin: 195.5, index: 611 },
    { text: " O", duration: 0.28, begin: 196.25, index: 612 },
    { text: " öğ", duration: 0.28, begin: 196.5, index: 613 },
    { text: "ren", duration: 0.28, begin: 196.75, index: 614 },
    { text: "ci,", duration: 0.28, begin: 197.0, index: 615 },
    { text: " bu", duration: 0.28, begin: 197.75, index: 616 },
    { text: "gün", duration: 0.28, begin: 198.0, index: 617 },
    { text: " i", duration: 0.28, begin: 198.5, index: 618 },
    { text: "ki", duration: 0.28, begin: 198.75, index: 619 },
    { text: " yüz", duration: 0.28, begin: 199.0, index: 620 },
    { text: " dö", duration: 0.28, begin: 199.25, index: 621 },
    { text: "nüm", duration: 0.28, begin: 199.5, index: 622 },
    { text: "lük", duration: 0.28, begin: 199.75, index: 623 },
    { text: " a", duration: 0.28, begin: 200.0, index: 624 },
    { text: "ra", duration: 0.28, begin: 200.25, index: 625 },
    { text: "zi", duration: 0.28, begin: 200.5, index: 626 },
    { text: " ü", duration: 0.28, begin: 200.75, index: 627 },
    { text: "ze", duration: 0.28, begin: 201.0, index: 628 },
    { text: "rin", duration: 0.28, begin: 201.25, index: 629 },
    { text: "de", duration: 0.28, begin: 201.5, index: 630 },
    { text: "ki", duration: 0.28, begin: 201.75, index: 631 },
    { text: " bin", duration: 0.28, begin: 202.5, index: 632 },
    { text: " met", duration: 0.28, begin: 202.75, index: 633 },
    { text: "re", duration: 0.28, begin: 203.0, index: 634 },
    { text: "ka", duration: 0.28, begin: 203.25, index: 635 },
    { text: "re", duration: 0.28, begin: 203.5, index: 636 },
    { text: "lik", duration: 0.28, begin: 203.75, index: 637 },
    { text: " çift", duration: 0.28, begin: 204.0, index: 638 },
    { text: "lik", duration: 0.28, begin: 204.25, index: 639 },
    { text: " e", duration: 0.28, begin: 204.5, index: 640 },
    { text: "vin", duration: 0.28, begin: 204.75, index: 641 },
    { text: "de", duration: 0.28, begin: 205.0, index: 642 },
    { text: " o", duration: 0.28, begin: 205.25, index: 643 },
    { text: "tu", duration: 0.28, begin: 205.5, index: 644 },
    { text: "ru", duration: 0.28, begin: 205.75, index: 645 },
    { text: "yor.", duration: 0.28, begin: 206.0, index: 646 },
    { text: " Yıl", duration: 0.28, begin: 207.25, index: 647 },
    { text: "lar", duration: 0.28, begin: 207.5, index: 648 },
    { text: " ön", duration: 0.28, begin: 207.75, index: 649 },
    { text: "ce", duration: 0.28, begin: 208.0, index: 650 },
    { text: " yaz", duration: 0.28, begin: 208.25, index: 651 },
    { text: "dı", duration: 0.28, begin: 208.5, index: 652 },
    { text: "ğı", duration: 0.28, begin: 208.75, index: 653 },
    { text: " ö", duration: 0.28, begin: 209.0, index: 654 },
    { text: "dev", duration: 0.28, begin: 209.25, index: 655 },
    { text: " şö", duration: 0.28, begin: 209.75, index: 656 },
    { text: "mi", duration: 0.28, begin: 210.0, index: 657 },
    { text: "ne", duration: 0.28, begin: 210.25, index: 658 },
    { text: "nin", duration: 0.28, begin: 210.5, index: 659 },
    { text: " ü", duration: 0.28, begin: 210.75, index: 660 },
    { text: "ze", duration: 0.28, begin: 211.0, index: 661 },
    { text: "rin", duration: 0.28, begin: 211.25, index: 662 },
    { text: "de", duration: 0.28, begin: 211.5, index: 663 },
    { text: " çer", duration: 0.28, begin: 211.75, index: 664 },
    { text: "çe", duration: 0.28, begin: 212.0, index: 665 },
    { text: "ve", duration: 0.28, begin: 212.25, index: 666 },
    { text: "len", duration: 0.28, begin: 212.5, index: 667 },
    { text: "miş", duration: 0.28, begin: 212.75, index: 668 },
    { text: " o", duration: 0.28, begin: 213.0, index: 669 },
    { text: "la", duration: 0.28, begin: 213.25, index: 670 },
    { text: "rak", duration: 0.28, begin: 213.5, index: 671 },
    { text: " a", duration: 0.28, begin: 213.75, index: 672 },
    { text: "sı", duration: 0.28, begin: 214.0, index: 673 },
    { text: "lı.", duration: 0.28, begin: 214.25, index: 674 },
    { text: " Hi", duration: 0.28, begin: 215.25, index: 675 },
    { text: "ka", duration: 0.28, begin: 215.5, index: 676 },
    { text: "ye", duration: 0.28, begin: 215.75, index: 677 },
    { text: "nin", duration: 0.28, begin: 216.0, index: 678 },
    { text: " en", duration: 0.28, begin: 216.25, index: 679 },
    { text: " can", duration: 0.28, begin: 216.5, index: 680 },
    { text: " a", duration: 0.28, begin: 216.75, index: 681 },
    { text: "lı", duration: 0.28, begin: 217.0, index: 682 },
    { text: "cı", duration: 0.28, begin: 217.25, index: 683 },
    { text: " ya", duration: 0.28, begin: 217.5, index: 684 },
    { text: "nı;", duration: 0.28, begin: 217.75, index: 685 },
    { text: " öğ", duration: 0.28, begin: 218.75, index: 686 },
    { text: "ret", duration: 0.28, begin: 219.0, index: 687 },
    { text: "men,", duration: 0.28, begin: 219.25, index: 688 },
    { text: " ge", duration: 0.28, begin: 220.0, index: 689 },
    { text: "çen", duration: 0.28, begin: 220.25, index: 690 },
    { text: " yaz", duration: 0.28, begin: 220.5, index: 691 },
    { text: " o", duration: 0.28, begin: 221.0, index: 692 },
    { text: "tuz", duration: 0.28, begin: 221.25, index: 693 },
    { text: " öğ", duration: 0.28, begin: 221.5, index: 694 },
    { text: "ren", duration: 0.28, begin: 221.75, index: 695 },
    { text: "ci", duration: 0.28, begin: 222.0, index: 696 },
    { text: "si", duration: 0.28, begin: 222.25, index: 697 },
    { text: "ni", duration: 0.28, begin: 222.5, index: 698 },
    { text: " bu", duration: 0.28, begin: 223.5, index: 699 },
    { text: " çift", duration: 0.28, begin: 223.75, index: 700 },
    { text: "li", duration: 0.28, begin: 224.0, index: 701 },
    { text: "ğe", duration: 0.28, begin: 224.25, index: 702 },
    { text: " kamp", duration: 0.28, begin: 224.5, index: 703 },
    { text: " kur", duration: 0.28, begin: 224.75, index: 704 },
    { text: "ma", duration: 0.28, begin: 225.0, index: 705 },
    { text: "ya", duration: 0.28, begin: 225.25, index: 706 },
    { text: " ge", duration: 0.28, begin: 225.5, index: 707 },
    { text: "tir", duration: 0.28, begin: 225.75, index: 708 },
    { text: "di.", duration: 0.28, begin: 226.0, index: 709 },
    { text: " Çift", duration: 0.28, begin: 227.0, index: 710 },
    { text: "lik", duration: 0.28, begin: 227.25, index: 711 },
    { text: "ten", duration: 0.28, begin: 227.5, index: 712 },
    { text: " ay", duration: 0.28, begin: 227.75, index: 713 },
    { text: "rı", duration: 0.28, begin: 228.0, index: 714 },
    { text: "lır", duration: 0.28, begin: 228.25, index: 715 },
    { text: "ken", duration: 0.28, begin: 228.5, index: 716 },
    { text: " es", duration: 0.28, begin: 229.0, index: 717 },
    { text: "ki", duration: 0.28, begin: 229.25, index: 718 },
    { text: " öğ", duration: 0.28, begin: 229.5, index: 719 },
    { text: "ren", duration: 0.28, begin: 229.75, index: 720 },
    { text: "ci", duration: 0.28, begin: 230.0, index: 721 },
    { text: "si", duration: 0.28, begin: 230.25, index: 722 },
    { text: "ne:", duration: 0.28, begin: 230.5, index: 723 },
    { text: ' "Bak,', duration: 0.28, begin: 231.5, index: 724 },
    { text: " sa", duration: 0.28, begin: 232.5, index: 725 },
    { text: "na", duration: 0.28, begin: 232.75, index: 726 },
    { text: " şim", duration: 0.28, begin: 233.0, index: 727 },
    { text: "di", duration: 0.28, begin: 233.25, index: 728 },
    { text: " söy", duration: 0.28, begin: 233.5, index: 729 },
    { text: "le", duration: 0.28, begin: 233.75, index: 730 },
    { text: "ye", duration: 0.28, begin: 234.0, index: 731 },
    { text: "bi", duration: 0.28, begin: 234.25, index: 732 },
    { text: "li", duration: 0.28, begin: 234.5, index: 733 },
    { text: "rim.", duration: 0.28, begin: 234.75, index: 734 },
    { text: " Ben", duration: 0.28, begin: 235.75, index: 735 },
    { text: " se", duration: 0.28, begin: 236.0, index: 736 },
    { text: "nin", duration: 0.28, begin: 236.25, index: 737 },
    { text: " öğ", duration: 0.28, begin: 236.5, index: 738 },
    { text: "ret", duration: 0.28, begin: 236.75, index: 739 },
    { text: "me", duration: 0.28, begin: 237.0, index: 740 },
    { text: "nin", duration: 0.28, begin: 237.25, index: 741 },
    { text: "ken,", duration: 0.28, begin: 237.5, index: 742 },
    { text: " ha", duration: 0.28, begin: 238.25, index: 743 },
    { text: "yal", duration: 0.28, begin: 238.5, index: 744 },
    { text: " hır", duration: 0.28, begin: 238.75, index: 745 },
    { text: "sı", duration: 0.28, begin: 239.0, index: 746 },
    { text: "zıy", duration: 0.28, begin: 239.25, index: 747 },
    { text: "dım.", duration: 0.28, begin: 239.5, index: 748 },
    { text: " O", duration: 0.28, begin: 240.5, index: 749 },
    { text: " yıl", duration: 0.28, begin: 240.75, index: 750 },
    { text: "lar", duration: 0.28, begin: 241.0, index: 751 },
    { text: "da", duration: 0.28, begin: 241.25, index: 752 },
    { text: " öğ", duration: 0.28, begin: 241.5, index: 753 },
    { text: "ren", duration: 0.28, begin: 241.75, index: 754 },
    { text: "ci", duration: 0.28, begin: 242.0, index: 755 },
    { text: "le", duration: 0.28, begin: 242.25, index: 756 },
    { text: "rim", duration: 0.28, begin: 242.5, index: 757 },
    { text: "den", duration: 0.28, begin: 242.75, index: 758 },
    { text: " pek", duration: 0.4, begin: 243.5, index: 759 },
    { text: " çok", duration: 0.4, begin: 243.75, index: 760 },
    { text: " ha", duration: 0.4, begin: 244.0, index: 761 },
    { text: "yal", duration: 0.4, begin: 244.25, index: 762 },
    { text: "ler", duration: 0.4, begin: 244.5, index: 763 },
    { text: " çal", duration: 0.4, begin: 244.75, index: 764 },
    { text: "dım.", duration: 0.4, begin: 245.0, index: 765 },
    { text: " Al", duration: 0.28, begin: 246.25, index: 766 },
    { text: "lah'", duration: 0.28, begin: 246.5, index: 767 },
    { text: "tan", duration: 0.28, begin: 246.75, index: 768 },
    { text: " ki,", duration: 0.28, begin: 247.0, index: 769 },
    { text: " sen,", duration: 0.28, begin: 247.75, index: 770 },
    { text: " ha", duration: 0.28, begin: 248.75, index: 771 },
    { text: "yal", duration: 0.28, begin: 249.0, index: 772 },
    { text: "le", duration: 0.28, begin: 249.25, index: 773 },
    { text: "rin", duration: 0.28, begin: 249.5, index: 774 },
    { text: "den", duration: 0.28, begin: 249.75, index: 775 },
    { text: " vaz", duration: 0.28, begin: 250.0, index: 776 },
    { text: "geç", duration: 0.28, begin: 250.25, index: 777 },
    { text: "me", duration: 0.28, begin: 250.5, index: 778 },
    { text: "ye", duration: 0.28, begin: 250.75, index: 779 },
    { text: "cek", duration: 0.28, begin: 251.0, index: 780 },
    { text: " ka", duration: 0.28, begin: 251.25, index: 781 },
    { text: "dar", duration: 0.28, begin: 251.5, index: 782 },
    { text: " i", duration: 0.38, begin: 251.75, index: 783 },
    { text: "nat", duration: 0.38, begin: 252.0, index: 784 },
    { text: "çıy", duration: 0.38, begin: 252.25, index: 785 },
    { text: "dın.", duration: 0.38, begin: 252.5, index: 786 },
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
                href="/dashboard/stories/profesyonel-yardim"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Önceki Hikaye</span>
                <span className="sm:hidden">Önceki</span>
              </Link>
              <Link
                href="/dashboard/stories/zeka-ozurluler-sinifi"
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
            src="/3-6.mp3"
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
