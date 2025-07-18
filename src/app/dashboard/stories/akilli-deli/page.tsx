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

  // Story text segments with timing data - COMPLETE VERSION
  const textSegments: TextSegment[] = [
    {
      text: "A",
      duration: 0.28,
      begin: 0.5,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "kıl",
      duration: 0.28,
      begin: 0.75,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "lı",
      duration: 0.28,
      begin: 1.0,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " De",
      duration: 0.28,
      begin: 1.25,
      index: 4,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "li",
      duration: 0.28,
      begin: 1.5,
      index: 5,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Bir", duration: 0.28, begin: 2.25, index: 6 },
    { text: " za", duration: 0.28, begin: 2.5, index: 7 },
    { text: "man", duration: 0.28, begin: 2.75, index: 8 },
    { text: "lar,", duration: 0.28, begin: 3.0, index: 9 },
    { text: " her", duration: 0.28, begin: 3.75, index: 10 },
    { text: "ke", duration: 0.28, begin: 4.0, index: 11 },
    { text: "sin", duration: 0.28, begin: 4.25, index: 12 },
    { text: " de", duration: 0.28, begin: 4.5, index: 13 },
    { text: "li", duration: 0.28, begin: 4.7, index: 14 },
    { text: " gö", duration: 0.28, begin: 4.9, index: 15 },
    { text: "züy", duration: 0.28, begin: 5.1, index: 16 },
    { text: "le", duration: 0.28, begin: 5.3, index: 17 },
    { text: " bak", duration: 0.28, begin: 5.5, index: 18 },
    { text: "tı", duration: 0.28, begin: 5.7, index: 19 },
    { text: "ğı", duration: 0.28, begin: 5.9, index: 20 },
    { text: " bir", duration: 0.28, begin: 6.1, index: 21 },
    { text: " a", duration: 0.28, begin: 6.4, index: 22 },
    { text: "dam", duration: 0.28, begin: 6.6, index: 23 },
    { text: " var", duration: 0.28, begin: 7.0, index: 24 },
    { text: "dı", duration: 0.28, begin: 7.25, index: 25 },
    { text: " ve", duration: 0.28, begin: 7.5, index: 26 },
    { text: " di", duration: 0.28, begin: 8.5, index: 27 },
    { text: "le", duration: 0.28, begin: 8.7, index: 28 },
    { text: "ne", duration: 0.28, begin: 8.9, index: 29 },
    { text: "rek", duration: 0.28, begin: 9.1, index: 30 },
    { text: " ge", duration: 0.28, begin: 9.3, index: 31 },
    { text: "çi", duration: 0.28, begin: 9.5, index: 32 },
    { text: "nir", duration: 0.28, begin: 9.7, index: 33 },
    { text: "di.", duration: 0.28, begin: 9.9, index: 34 },
    { text: " Kim", duration: 0.28, begin: 10.9, index: 35 },
    { text: " ken", duration: 0.28, begin: 11.1, index: 36 },
    { text: "di", duration: 0.28, begin: 11.3, index: 37 },
    { text: "si", duration: 0.28, begin: 11.5, index: 38 },
    { text: "ne", duration: 0.28, begin: 11.7, index: 39 },
    { text: " bi", duration: 0.28, begin: 11.9, index: 40 },
    { text: "ri", duration: 0.28, begin: 12.1, index: 41 },
    { text: "si", duration: 0.28, begin: 12.3, index: 42 },
    { text: " bü", duration: 0.28, begin: 12.5, index: 43 },
    { text: "yük,", duration: 0.28, begin: 12.7, index: 44 },
    { text: " di", duration: 0.28, begin: 13.7, index: 45 },
    { text: "ğe", duration: 0.28, begin: 13.9, index: 46 },
    { text: "ri", duration: 0.28, begin: 14.1, index: 47 },
    { text: " kü", duration: 0.28, begin: 14.3, index: 48 },
    { text: "çük", duration: 0.28, begin: 14.5, index: 49 },
    { text: " i", duration: 0.28, begin: 14.7, index: 50 },
    { text: "ki", duration: 0.28, begin: 14.9, index: 51 },
    { text: " pa", duration: 0.28, begin: 15.1, index: 52 },
    { text: "ra", duration: 0.28, begin: 15.3, index: 53 },
    { text: " u", duration: 0.28, begin: 15.5, index: 54 },
    { text: "zat", duration: 0.28, begin: 15.7, index: 55 },
    { text: "sa,", duration: 0.28, begin: 15.9, index: 56 },
    { text: " he", duration: 0.28, begin: 16.9, index: 57 },
    { text: "men", duration: 0.28, begin: 17.1, index: 58 },
    { text: " kü", duration: 0.28, begin: 17.3, index: 59 },
    { text: "çük", duration: 0.28, begin: 17.5, index: 60 },
    { text: " pa", duration: 0.28, begin: 17.7, index: 61 },
    { text: "ra", duration: 0.28, begin: 17.9, index: 62 },
    { text: "yı", duration: 0.28, begin: 18.1, index: 63 },
    { text: " a", duration: 0.28, begin: 18.3, index: 64 },
    { text: "lır", duration: 0.28, begin: 18.5, index: 65 },
    { text: " ve", duration: 0.28, begin: 18.7, index: 66 },
    { text: " in", duration: 0.28, begin: 19.7, index: 67 },
    { text: "san", duration: 0.28, begin: 19.9, index: 68 },
    { text: "la", duration: 0.28, begin: 20.1, index: 69 },
    { text: "rın", duration: 0.28, begin: 20.3, index: 70 },
    { text: " gül", duration: 0.38, begin: 20.7, index: 71 },
    { text: "me", duration: 0.38, begin: 20.9, index: 72 },
    { text: "si", duration: 0.38, begin: 21.1, index: 73 },
    { text: "ne", duration: 0.38, begin: 21.3, index: 74 },
    { text: " ne", duration: 0.38, begin: 21.5, index: 75 },
    { text: "den", duration: 0.38, begin: 21.7, index: 76 },
    { text: " o", duration: 0.38, begin: 21.9, index: 77 },
    { text: "lur", duration: 0.38, begin: 22.1, index: 78 },
    { text: "du.", duration: 0.38, begin: 22.3, index: 79 },
    { text: ' "Sen', duration: 0.38, begin: 23.75, index: 80 },
    { text: " as", duration: 0.38, begin: 24.0, index: 81 },
    { text: "lın", duration: 0.38, begin: 24.25, index: 82 },
    { text: "da", duration: 0.38, begin: 24.5, index: 83 },
    { text: " hiç", duration: 0.38, begin: 24.75, index: 84 },
    { text: " de", duration: 0.38, begin: 25.0, index: 85 },
    { text: " de", duration: 0.38, begin: 25.25, index: 86 },
    { text: "li", duration: 0.38, begin: 25.5, index: 87 },
    { text: " bi", duration: 0.28, begin: 25.75, index: 88 },
    { text: "ri", duration: 0.28, begin: 26.0, index: 89 },
    { text: "ne", duration: 0.28, begin: 26.25, index: 90 },
    { text: " ben", duration: 0.28, begin: 26.5, index: 91 },
    { text: "ze", duration: 0.28, begin: 26.75, index: 92 },
    { text: "mi", duration: 0.28, begin: 27.0, index: 93 },
    { text: "yor", duration: 0.28, begin: 27.25, index: 94 },
    { text: "sun.", duration: 0.28, begin: 27.5, index: 95 },
    { text: " A", duration: 0.28, begin: 28.5, index: 96 },
    { text: "ma", duration: 0.28, begin: 28.7, index: 97 },
    { text: " ne", duration: 0.28, begin: 28.9, index: 98 },
    { text: "den", duration: 0.28, begin: 29.1, index: 99 },
    { text: " hep", duration: 0.28, begin: 29.3, index: 100 },
    { text: " kü", duration: 0.1, begin: 29.5, index: 101 },
    { text: "çük", duration: 0.1, begin: 29.7, index: 102 },
    { text: " pa", duration: 0.1, begin: 29.9, index: 103 },
    { text: "ra", duration: 0.1, begin: 30.1, index: 104 },
    { text: "yı", duration: 0.1, begin: 30.3, index: 105 },
    { text: " a", duration: 0.1, begin: 30.5, index: 106 },
    { text: "lıp", duration: 0.28, begin: 30.7, index: 107 },
    { text: "da", duration: 0.28, begin: 30.9, index: 108 },
    { text: " in", duration: 0.28, begin: 31.9, index: 109 },
    { text: "san", duration: 0.28, begin: 32.1, index: 110 },
    { text: "la", duration: 0.28, begin: 32.3, index: 111 },
    { text: "rı", duration: 0.28, begin: 32.5, index: 112 },
    { text: " ken", duration: 0.28, begin: 32.7, index: 113 },
    { text: "di", duration: 0.28, begin: 32.9, index: 114 },
    { text: "ne", duration: 0.28, begin: 33.1, index: 115 },
    { text: " gül", duration: 0.4, begin: 33.5, index: 116 },
    { text: "dü", duration: 0.4, begin: 33.7, index: 117 },
    { text: "rü", duration: 0.4, begin: 33.9, index: 118 },
    { text: "yor", duration: 0.4, begin: 34.1, index: 119 },
    { text: "sun?", duration: 0.4, begin: 34.3, index: 120 },
    { text: " Bü", duration: 0.28, begin: 35.5, index: 121 },
    { text: "yük", duration: 0.28, begin: 35.7, index: 122 },
    { text: " pa", duration: 0.28, begin: 35.9, index: 123 },
    { text: "ra", duration: 0.28, begin: 36.1, index: 124 },
    { text: "yı", duration: 0.28, begin: 36.3, index: 125 },
    { text: " a", duration: 0.28, begin: 36.5, index: 126 },
    { text: "lır", duration: 0.28, begin: 36.7, index: 127 },
    { text: "san,", duration: 0.28, begin: 36.9, index: 128 },
    { text: " hem", duration: 0.28, begin: 37.9, index: 129 },
    { text: " da", duration: 0.28, begin: 38.1, index: 130 },
    { text: "ha", duration: 0.28, begin: 38.3, index: 131 },
    { text: " çok", duration: 0.28, begin: 38.5, index: 132 },
    { text: " pa", duration: 0.28, begin: 38.9, index: 133 },
    { text: "ran", duration: 0.28, begin: 39.1, index: 134 },
    { text: " o", duration: 0.28, begin: 39.3, index: 135 },
    { text: "lur,", duration: 0.28, begin: 39.5, index: 136 },
    { text: " hem", duration: 0.38, begin: 40.5, index: 137 },
    { text: "de", duration: 0.38, begin: 40.7, index: 138 },
    { text: " in", duration: 0.38, begin: 41.3, index: 139 },
    { text: "san", duration: 0.38, begin: 41.5, index: 140 },
    { text: "lar", duration: 0.38, begin: 41.7, index: 141 },
    { text: " se", duration: 0.28, begin: 42.3, index: 142 },
    { text: "nin", duration: 0.28, begin: 42.5, index: 143 },
    { text: "le", duration: 0.28, begin: 42.7, index: 144 },
    { text: " a", duration: 0.28, begin: 42.9, index: 145 },
    { text: "lay", duration: 0.28, begin: 43.1, index: 146 },
    { text: " et", duration: 0.28, begin: 43.5, index: 147 },
    { text: "mez", duration: 0.28, begin: 43.7, index: 148 },
    { text: 'ler."', duration: 0.28, begin: 43.9, index: 149 },
    { text: " A", duration: 0.28, begin: 45.5, index: 150 },
    { text: "dam,", duration: 0.28, begin: 45.7, index: 151 },
    { text: " de", duration: 0.28, begin: 46.3, index: 152 },
    { text: "li", duration: 0.28, begin: 46.5, index: 153 },
    { text: "nin", duration: 0.28, begin: 46.7, index: 154 },
    { text: " ce", duration: 0.28, begin: 47.1, index: 155 },
    { text: "va", duration: 0.28, begin: 47.3, index: 156 },
    { text: "bı", duration: 0.28, begin: 47.5, index: 157 },
    { text: "nı", duration: 0.28, begin: 47.7, index: 158 },
    { text: " öm", duration: 0.28, begin: 48.5, index: 159 },
    { text: "rü", duration: 0.28, begin: 48.7, index: 160 },
    { text: " bo", duration: 0.28, begin: 48.9, index: 161 },
    { text: "yun", duration: 0.28, begin: 49.1, index: 162 },
    { text: "ca", duration: 0.28, begin: 49.3, index: 163 },
    { text: " u", duration: 0.38, begin: 49.7, index: 164 },
    { text: "nu", duration: 0.38, begin: 49.9, index: 165 },
    { text: "ta", duration: 0.38, begin: 50.1, index: 166 },
    { text: "ma", duration: 0.38, begin: 50.3, index: 167 },
    { text: "ya", duration: 0.38, begin: 50.5, index: 168 },
    { text: "cak", duration: 0.38, begin: 50.7, index: 169 },
    { text: "tı:", duration: 0.38, begin: 50.9, index: 170 },
    { text: " Hak", duration: 0.28, begin: 52.3, index: 171 },
    { text: "lı", duration: 0.28, begin: 52.5, index: 172 },
    { text: "sın.", duration: 0.28, begin: 52.7, index: 173 },
    { text: " A", duration: 0.28, begin: 53.5, index: 174 },
    { text: "ma", duration: 0.28, begin: 53.7, index: 175 },
    { text: " hep", duration: 0.28, begin: 54.1, index: 176 },
    { text: " bü", duration: 0.28, begin: 54.3, index: 177 },
    { text: "yük", duration: 0.28, begin: 54.5, index: 178 },
    { text: " pa", duration: 0.28, begin: 54.7, index: 179 },
    { text: "ra", duration: 0.28, begin: 54.9, index: 180 },
    { text: "yı", duration: 0.28, begin: 55.1, index: 181 },
    { text: " al", duration: 0.28, begin: 55.5, index: 182 },
    { text: "sam,", duration: 0.28, begin: 55.7, index: 183 },
    { text: " bu", duration: 0.28, begin: 56.9, index: 184 },
    { text: " de", duration: 0.28, begin: 57.1, index: 185 },
    { text: "fa", duration: 0.28, begin: 57.3, index: 186 },
    { text: " in", duration: 0.28, begin: 57.7, index: 187 },
    { text: "san", duration: 0.28, begin: 57.9, index: 188 },
    { text: "lar", duration: 0.28, begin: 58.1, index: 189 },
    { text: " ken", duration: 0.28, begin: 58.7, index: 190 },
    { text: "di", duration: 0.28, begin: 58.9, index: 191 },
    { text: "le", duration: 0.28, begin: 59.1, index: 192 },
    { text: "ri", duration: 0.28, begin: 59.3, index: 193 },
    { text: "nin", duration: 0.28, begin: 59.5, index: 194 },
    { text: " da", duration: 0.28, begin: 60.25, index: 195 },
    { text: "ha", duration: 0.28, begin: 60.5, index: 196 },
    { text: " ze", duration: 0.28, begin: 60.75, index: 197 },
    { text: "ki", duration: 0.28, begin: 61.0, index: 198 },
    { text: " ol", duration: 0.28, begin: 61.2, index: 199 },
    { text: "du", duration: 0.28, begin: 61.4, index: 200 },
    { text: "ğu", duration: 0.28, begin: 61.6, index: 201 },
    { text: "nu", duration: 0.28, begin: 61.8, index: 202 },
    { text: " ka", duration: 0.28, begin: 62.0, index: 203 },
    { text: "nıt", duration: 0.28, begin: 62.2, index: 204 },
    { text: "la", duration: 0.28, begin: 62.4, index: 205 },
    { text: "mak", duration: 0.28, begin: 62.6, index: 206 },
    { text: " i", duration: 0.28, begin: 62.8, index: 207 },
    { text: "çin", duration: 0.28, begin: 63.0, index: 208 },
    { text: " ba", duration: 0.28, begin: 63.9, index: 209 },
    { text: "na", duration: 0.28, begin: 64.1, index: 210 },
    { text: " sa", duration: 0.28, begin: 64.3, index: 211 },
    { text: "da", duration: 0.28, begin: 64.5, index: 212 },
    { text: "ka", duration: 0.28, begin: 64.7, index: 213 },
    { text: " ver", duration: 0.28, begin: 64.9, index: 214 },
    { text: "me", duration: 0.28, begin: 65.1, index: 215 },
    { text: "yi", duration: 0.28, begin: 65.3, index: 216 },
    { text: " bı", duration: 0.28, begin: 65.5, index: 217 },
    { text: "ra", duration: 0.28, begin: 65.7, index: 218 },
    { text: "ka", duration: 0.28, begin: 65.9, index: 219 },
    { text: "cak", duration: 0.28, begin: 66.1, index: 220 },
    { text: "lar.", duration: 0.28, begin: 66.3, index: 221 },
    { text: " Ben", duration: 0.38, begin: 67.5, index: 222 },
    { text: "de", duration: 0.38, begin: 67.7, index: 223 },
    { text: " sa", duration: 0.38, begin: 67.9, index: 224 },
    { text: "da", duration: 0.38, begin: 68.1, index: 225 },
    { text: "ka", duration: 0.38, begin: 68.3, index: 226 },
    { text: "dan", duration: 0.38, begin: 68.5, index: 227 },
    { text: " mah", duration: 0.38, begin: 68.9, index: 228 },
    { text: "rum", duration: 0.38, begin: 69.1, index: 229 },
    { text: " ka", duration: 0.38, begin: 69.3, index: 230 },
    { text: "la", duration: 0.38, begin: 69.5, index: 231 },
    { text: "ca", duration: 0.38, begin: 69.7, index: 232 },
    { text: "ğım.", duration: 0.38, begin: 69.9, index: 233 },
    { text: " Di", duration: 0.28, begin: 71.3, index: 234 },
    { text: "ye", duration: 0.28, begin: 71.5, index: 235 },
    { text: "ce", duration: 0.28, begin: 71.7, index: 236 },
    { text: "ğim,", duration: 0.28, begin: 71.9, index: 237 },
    { text: " e", duration: 0.4, begin: 72.75, index: 238 },
    { text: "ğer", duration: 0.4, begin: 73.0, index: 239 },
    { text: " yap", duration: 0.4, begin: 73.25, index: 240 },
    { text: "tı", duration: 0.4, begin: 73.5, index: 241 },
    { text: "ğın", duration: 0.4, begin: 73.75, index: 242 },
    { text: " a", duration: 0.4, begin: 74.0, index: 243 },
    { text: "kıl", duration: 0.4, begin: 74.25, index: 244 },
    { text: "lı", duration: 0.28, begin: 74.5, index: 245 },
    { text: "ca", duration: 0.28, begin: 74.75, index: 246 },
    { text: " bir", duration: 0.28, begin: 75.0, index: 247 },
    { text: " iş", duration: 0.28, begin: 75.25, index: 248 },
    { text: " i", duration: 0.28, begin: 75.75, index: 249 },
    { text: "se", duration: 0.28, begin: 76.0, index: 250 },
    { text: " de", duration: 0.28, begin: 77.0, index: 251 },
    { text: "li", duration: 0.28, begin: 77.25, index: 252 },
    { text: " gö", duration: 0.28, begin: 77.5, index: 253 },
    { text: "rün", duration: 0.28, begin: 77.75, index: 254 },
    { text: "mek", duration: 0.28, begin: 78.0, index: 255 },
    { text: "ten", duration: 0.28, begin: 78.25, index: 256 },
    { text: " kork", duration: 0.28, begin: 78.75, index: 257 },
    { text: "ma", duration: 0.28, begin: 79.0, index: 258 },
    { text: "ma", duration: 0.28, begin: 79.25, index: 259 },
    { text: "lı", duration: 0.28, begin: 79.5, index: 260 },
    { text: 'sın."', duration: 0.28, begin: 79.75, index: 261 },
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

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-5">
              <Link
                href="/dashboard/stories/elimden-gelen-cabayi-gosterecegim"
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
            src="/4-1.mp3"
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
