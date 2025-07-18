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
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "../../../../../firebase";
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
    { text: "", duration: 0.154, begin: 0.5, index: 0 },

    // Title
    {
      text: "Kim",
      duration: 0.53,
      begin: 0.5,
      index: 1,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " Fark",
      duration: 0.53,
      begin: 0.75,
      index: 2,
      isTitle: true,
      isCenter: true,
    },
    {
      text: " E",
      duration: 0.53,
      begin: 1.0,
      index: 3,
      isTitle: true,
      isCenter: true,
    },
    {
      text: "der?",
      duration: 0.53,
      begin: 1.25,
      index: 4,
      isTitle: true,
      isCenter: true,
    },

    // Story content
    { text: " Bir", duration: 0.53, begin: 2.5, index: 5 },
    { text: " za", duration: 0.53, begin: 2.75, index: 6 },
    { text: "man", duration: 0.53, begin: 3.0, index: 7 },
    { text: "lar,", duration: 0.53, begin: 3.25, index: 8 },
    { text: " kom", duration: 0.53, begin: 4.25, index: 9 },
    { text: "şu", duration: 0.53, begin: 4.5, index: 10 },
    { text: " i", duration: 0.53, begin: 4.75, index: 11 },
    { text: "ki", duration: 0.53, begin: 5.0, index: 12 },
    { text: " ül", duration: 0.53, begin: 5.25, index: 13 },
    { text: "ke", duration: 0.53, begin: 5.5, index: 14 },
    { text: " a", duration: 0.53, begin: 6.5, index: 15 },
    { text: "man", duration: 0.53, begin: 6.75, index: 16 },
    { text: "sız", duration: 0.53, begin: 7.0, index: 17 },
    { text: " bir", duration: 0.53, begin: 7.5, index: 18 },
    { text: " re", duration: 0.53, begin: 7.75, index: 19 },
    { text: "ka", duration: 0.53, begin: 8.0, index: 20 },
    { text: "be", duration: 0.53, begin: 8.25, index: 21 },
    { text: "te", duration: 0.53, begin: 8.5, index: 22 },
    { text: " tu", duration: 0.23, begin: 9.25, index: 23 },
    { text: "tuş", duration: 0.48, begin: 9.5, index: 24 },
    { text: "muş", duration: 0.48, begin: 9.75, index: 25 },
    { text: "lar.", duration: 0.48, begin: 10.0, index: 26 },
    { text: " Ül", duration: 0.53, begin: 11.25, index: 27 },
    { text: "ke", duration: 0.53, begin: 11.5, index: 28 },
    { text: "ler", duration: 0.53, begin: 11.75, index: 29 },
    { text: "den", duration: 0.53, begin: 12.0, index: 30 },
    { text: " bi", duration: 0.23, begin: 12.75, index: 31 },
    { text: "ri", duration: 0.23, begin: 13.0, index: 32 },
    { text: "nin", duration: 0.23, begin: 13.25, index: 33 },
    { text: " hal", duration: 0.53, begin: 13.5, index: 34 },
    { text: "kı,", duration: 0.53, begin: 13.75, index: 35 },
    { text: " kar", duration: 0.53, begin: 14.75, index: 36 },
    { text: "şı", duration: 0.53, begin: 15.0, index: 37 },
    { text: " ta", duration: 0.53, begin: 15.25, index: 38 },
    { text: "ra", duration: 0.53, begin: 15.5, index: 39 },
    { text: "fa", duration: 0.53, begin: 15.75, index: 40 },
    { text: " ken", duration: 0.53, begin: 16.75, index: 41 },
    { text: "di", duration: 0.53, begin: 17.0, index: 42 },
    { text: " ül", duration: 0.53, begin: 17.25, index: 43 },
    { text: "ke", duration: 0.53, begin: 17.5, index: 44 },
    { text: "le", duration: 0.53, begin: 17.75, index: 45 },
    { text: "ri", duration: 0.53, begin: 18.0, index: 46 },
    { text: "nin", duration: 0.53, begin: 18.25, index: 47 },
    { text: " zen", duration: 0.53, begin: 18.75, index: 48 },
    { text: "gin", duration: 0.53, begin: 19.0, index: 49 },
    { text: "li", duration: 0.53, begin: 19.25, index: 50 },
    { text: "ği", duration: 0.53, begin: 19.5, index: 51 },
    { text: "ni", duration: 0.53, begin: 19.75, index: 52 },
    { text: " ke", duration: 0.53, begin: 20.75, index: 53 },
    { text: "sin", duration: 0.53, begin: 21.0, index: 54 },
    { text: " bir", duration: 0.68, begin: 21.25, index: 55 },
    { text: "şe", duration: 0.68, begin: 21.75, index: 56 },
    { text: "kil", duration: 0.68, begin: 22.0, index: 57 },
    { text: "de", duration: 0.68, begin: 22.25, index: 58 },
    { text: " gös", duration: 0.68, begin: 22.75, index: 59 },
    { text: "ter", duration: 0.68, begin: 23.0, index: 60 },
    { text: "mek", duration: 0.68, begin: 23.25, index: 61 },
    { text: " is", duration: 0.68, begin: 23.75, index: 62 },
    { text: "ti", duration: 0.68, begin: 24.0, index: 63 },
    { text: "yor", duration: 0.68, begin: 24.25, index: 64 },
    { text: "muş.", duration: 0.68, begin: 24.5, index: 65 },
    { text: " Ko", duration: 0.53, begin: 26.0, index: 66 },
    { text: "lay,", duration: 0.53, begin: 26.25, index: 67 },
    { text: " a", duration: 0.28, begin: 27.25, index: 68 },
    { text: "ma", duration: 0.28, begin: 27.5, index: 69 },
    { text: " et", duration: 0.53, begin: 27.75, index: 70 },
    { text: "ki", duration: 0.53, begin: 28.0, index: 71 },
    { text: "le", duration: 0.53, begin: 28.25, index: 72 },
    { text: "yi", duration: 0.53, begin: 28.5, index: 73 },
    { text: "ci", duration: 0.53, begin: 28.75, index: 74 },
    { text: " bir", duration: 0.53, begin: 29.0, index: 75 },
    { text: "şey", duration: 0.53, begin: 29.25, index: 76 },
    { text: " ya", duration: 0.53, begin: 29.75, index: 77 },
    { text: "pıl", duration: 0.53, begin: 30.0, index: 78 },
    { text: "ma", duration: 0.53, begin: 30.25, index: 79 },
    { text: "lıy", duration: 0.53, begin: 30.5, index: 80 },
    { text: "mış.", duration: 0.53, begin: 30.75, index: 81 },
    { text: " Bu", duration: 0.53, begin: 32.0, index: 82 },
    { text: "nun", duration: 0.53, begin: 32.25, index: 83 },
    { text: " i", duration: 0.53, begin: 32.5, index: 84 },
    { text: "çin", duration: 0.53, begin: 32.75, index: 85 },
    { text: " şeh", duration: 0.53, begin: 33.75, index: 86 },
    { text: "rin", duration: 0.53, begin: 34.0, index: 87 },
    { text: " or", duration: 0.53, begin: 34.5, index: 88 },
    { text: "ta", duration: 0.53, begin: 34.75, index: 89 },
    { text: "sı", duration: 0.53, begin: 35.0, index: 90 },
    { text: "na", duration: 0.53, begin: 35.25, index: 91 },
    { text: " bü", duration: 0.53, begin: 36.25, index: 92 },
    { text: "yük", duration: 0.53, begin: 36.5, index: 93 },
    { text: " bir", duration: 0.53, begin: 37.0, index: 94 },
    { text: " süt", duration: 0.53, begin: 37.25, index: 95 },
    { text: " ha", duration: 0.53, begin: 37.5, index: 96 },
    { text: "vu", duration: 0.53, begin: 37.75, index: 97 },
    { text: "zu", duration: 0.53, begin: 38.0, index: 98 },
    { text: " ya", duration: 0.53, begin: 38.5, index: 99 },
    { text: "pıl", duration: 0.53, begin: 38.75, index: 100 },
    { text: "ma", duration: 0.53, begin: 39.0, index: 101 },
    { text: "sı", duration: 0.53, begin: 39.25, index: 102 },
    { text: "na", duration: 0.53, begin: 39.5, index: 103 },
    { text: " ka", duration: 0.53, begin: 40.5, index: 104 },
    { text: "rar", duration: 0.53, begin: 40.75, index: 105 },
    { text: " ve", duration: 0.53, begin: 41.0, index: 106 },
    { text: "ril", duration: 0.53, begin: 41.25, index: 107 },
    { text: "miş.", duration: 0.53, begin: 41.5, index: 108 },
    { text: " Ge", duration: 0.53, begin: 43.0, index: 109 },
    { text: "ce", duration: 0.53, begin: 43.25, index: 110 },
    { text: " her", duration: 0.53, begin: 43.5, index: 111 },
    { text: "kes", duration: 0.53, begin: 43.75, index: 112 },
    { text: " bir", duration: 0.53, begin: 45.0, index: 113 },
    { text: " ko", duration: 0.53, begin: 45.25, index: 114 },
    { text: "va", duration: 0.53, begin: 45.5, index: 115 },
    { text: " süt", duration: 0.53, begin: 46.25, index: 116 },
    { text: " ge", duration: 0.53, begin: 46.5, index: 117 },
    { text: "ti", duration: 0.53, begin: 46.75, index: 118 },
    { text: "re", duration: 0.53, begin: 47.0, index: 119 },
    { text: "cek", duration: 0.53, begin: 47.25, index: 120 },
    { text: " ve", duration: 0.53, begin: 47.75, index: 121 },
    { text: " bu", duration: 0.53, begin: 48.75, index: 122 },
    { text: " ha", duration: 0.53, begin: 49.0, index: 123 },
    { text: "vu", duration: 0.53, begin: 49.25, index: 124 },
    { text: "za", duration: 0.53, begin: 49.5, index: 125 },
    { text: " dö", duration: 0.53, begin: 50.0, index: 126 },
    { text: "ke", duration: 0.53, begin: 50.25, index: 127 },
    { text: "cek", duration: 0.53, begin: 50.5, index: 128 },
    { text: "miş.", duration: 0.53, begin: 50.75, index: 129 },
    { text: " Her", duration: 0.53, begin: 52.0, index: 130 },
    { text: "ke", duration: 0.53, begin: 52.25, index: 131 },
    { text: "se", duration: 0.53, begin: 52.5, index: 132 },
    { text: " bu", duration: 0.53, begin: 53.75, index: 133 },
    { text: " fi", duration: 0.53, begin: 54.0, index: 134 },
    { text: "kir", duration: 0.53, begin: 54.25, index: 135 },
    { text: " ca", duration: 0.53, begin: 54.5, index: 136 },
    { text: "zip", duration: 0.53, begin: 54.75, index: 137 },
    { text: " gel", duration: 0.53, begin: 55.5, index: 138 },
    { text: "miş.", duration: 0.53, begin: 55.75, index: 139 },
    { text: " Her", duration: 0.53, begin: 57.0, index: 140 },
    { text: "kes,", duration: 0.53, begin: 57.25, index: 141 },
    { text: " ka", duration: 0.53, begin: 58.5, index: 142 },
    { text: "rar", duration: 0.53, begin: 58.75, index: 143 },
    { text: "laş", duration: 0.53, begin: 59.0, index: 144 },
    { text: "tı", duration: 0.53, begin: 59.25, index: 145 },
    { text: "rı", duration: 0.53, begin: 59.5, index: 146 },
    { text: "lan", duration: 0.53, begin: 59.75, index: 147 },
    { text: " ge", duration: 0.53, begin: 60.5, index: 148 },
    { text: "ce", duration: 0.53, begin: 60.75, index: 149 },
    { text: " gö", duration: 0.53, begin: 61.75, index: 150 },
    { text: "tür", duration: 0.53, begin: 62.0, index: 151 },
    { text: "dü", duration: 0.53, begin: 62.25, index: 152 },
    { text: "ğü", duration: 0.53, begin: 62.5, index: 153 },
    { text: "nü", duration: 0.53, begin: 62.75, index: 154 },
    { text: " ha", duration: 0.53, begin: 63.0, index: 155 },
    { text: "vu", duration: 0.53, begin: 63.25, index: 156 },
    { text: "za", duration: 0.53, begin: 63.5, index: 157 },
    { text: " bo", duration: 0.53, begin: 63.75, index: 158 },
    { text: "şalt", duration: 0.53, begin: 64.0, index: 159 },
    { text: "mış.", duration: 0.53, begin: 64.25, index: 160 },
    { text: " Ne", duration: 0.53, begin: 65.75, index: 161 },
    { text: " var", duration: 0.53, begin: 66.0, index: 162 },
    { text: " ki,", duration: 0.53, begin: 66.25, index: 163 },
    { text: " sa", duration: 0.53, begin: 67.25, index: 164 },
    { text: "bah", duration: 0.53, begin: 67.5, index: 165 },
    { text: " ol", duration: 0.53, begin: 67.75, index: 166 },
    { text: "du", duration: 0.53, begin: 68.0, index: 167 },
    { text: "ğun", duration: 0.53, begin: 68.25, index: 168 },
    { text: "da,", duration: 0.53, begin: 68.5, index: 169 },
    { text: " or", duration: 0.53, begin: 69.75, index: 170 },
    { text: "ta", duration: 0.53, begin: 70.0, index: 171 },
    { text: "da", duration: 0.53, begin: 70.25, index: 172 },
    { text: " i", duration: 0.53, begin: 70.5, index: 173 },
    { text: "çi", duration: 0.53, begin: 70.75, index: 174 },
    { text: " süt", duration: 0.53, begin: 71.25, index: 175 },
    { text: " i", duration: 0.53, begin: 71.5, index: 176 },
    { text: "le", duration: 0.53, begin: 71.75, index: 177 },
    { text: " de", duration: 0.53, begin: 72.25, index: 178 },
    { text: "ğil,", duration: 0.53, begin: 72.5, index: 179 },
    { text: " dup", duration: 0.53, begin: 73.5, index: 180 },
    { text: "du", duration: 0.53, begin: 73.75, index: 181 },
    { text: "ru", duration: 0.53, begin: 74.0, index: 182 },
    { text: " su", duration: 0.53, begin: 74.25, index: 183 },
    { text: " i", duration: 0.53, begin: 74.5, index: 184 },
    { text: "le", duration: 0.53, begin: 74.75, index: 185 },
    { text: " dol", duration: 0.53, begin: 75.0, index: 186 },
    { text: "muş", duration: 0.53, begin: 75.25, index: 187 },
    { text: " bir", duration: 0.53, begin: 76.5, index: 188 },
    { text: " ha", duration: 0.53, begin: 76.75, index: 189 },
    { text: "vuz", duration: 0.53, begin: 77.0, index: 190 },
    { text: " var", duration: 0.53, begin: 77.75, index: 191 },
    { text: "mış.", duration: 0.53, begin: 78.0, index: 192 },
    { text: " Çün", duration: 0.53, begin: 79.5, index: 193 },
    { text: "kü", duration: 0.53, begin: 79.75, index: 194 },
    { text: " her", duration: 0.53, begin: 80.25, index: 195 },
    { text: "kes,", duration: 0.53, begin: 80.5, index: 196 },
    { text: " ay", duration: 0.53, begin: 81.5, index: 197 },
    { text: "nı", duration: 0.53, begin: 81.75, index: 198 },
    { text: " şe", duration: 0.53, begin: 82.0, index: 199 },
    { text: "kil", duration: 0.53, begin: 82.25, index: 200 },
    { text: "de", duration: 0.53, begin: 82.5, index: 201 },
    { text: " dü", duration: 0.53, begin: 83.0, index: 202 },
    { text: "şün", duration: 0.53, begin: 83.25, index: 203 },
    { text: "müş:", duration: 0.53, begin: 83.5, index: 204 },
    { text: " Bu", duration: 0.53, begin: 85.0, index: 205 },
    { text: " ka", duration: 0.53, begin: 85.25, index: 206 },
    { text: "dar", duration: 0.53, begin: 85.5, index: 207 },
    { text: " in", duration: 0.53, begin: 85.75, index: 208 },
    { text: "san", duration: 0.53, begin: 86.0, index: 209 },
    { text: " i", duration: 0.53, begin: 86.75, index: 210 },
    { text: "çin", duration: 0.53, begin: 87.0, index: 211 },
    { text: "de", duration: 0.53, begin: 87.25, index: 212 },
    { text: " yal", duration: 0.53, begin: 88.5, index: 213 },
    { text: "nız", duration: 0.53, begin: 88.75, index: 214 },
    { text: " ben,", duration: 0.53, begin: 89.25, index: 215 },
    { text: " süt", duration: 0.53, begin: 90.25, index: 216 },
    { text: " ye", duration: 0.53, begin: 90.5, index: 217 },
    { text: "ri", duration: 0.53, begin: 90.75, index: 218 },
    { text: "ne", duration: 0.53, begin: 91.0, index: 219 },
    { text: " bir", duration: 0.53, begin: 92.0, index: 220 },
    { text: " ko", duration: 0.53, begin: 92.25, index: 221 },
    { text: "va", duration: 0.53, begin: 92.5, index: 222 },
    { text: " su", duration: 0.53, begin: 92.75, index: 223 },
    { text: " dök", duration: 0.53, begin: 93.0, index: 224 },
    { text: "sem", duration: 0.53, begin: 93.25, index: 225 },
    { text: " ne", duration: 0.53, begin: 94.75, index: 226 },
    { text: " fark", duration: 0.53, begin: 95.0, index: 227 },
    { text: " e", duration: 0.53, begin: 95.25, index: 228 },
    { text: "der", duration: 0.53, begin: 95.5, index: 229 },
    { text: " ki?", duration: 0.53, begin: 95.75, index: 230 },
    { text: " Kim", duration: 0.53, begin: 97.0, index: 231 },
    { text: " fark", duration: 0.53, begin: 97.25, index: 232 },
    { text: " e", duration: 0.53, begin: 97.5, index: 233 },
    { text: "der", duration: 0.53, begin: 97.75, index: 234 },
    { text: " ki.", duration: 0.53, begin: 98.0, index: 235 },
    { text: " Oy", duration: 0.53, begin: 99.75, index: 236 },
    { text: "sa", duration: 0.53, begin: 100.0, index: 237 },
    { text: " ha", duration: 0.53, begin: 101.0, index: 238 },
    { text: "ya", duration: 0.53, begin: 101.25, index: 239 },
    { text: "tın", duration: 0.53, begin: 101.5, index: 240 },
    { text: " i", duration: 0.53, begin: 102.0, index: 241 },
    { text: "çin", duration: 0.53, begin: 102.25, index: 242 },
    { text: "de,", duration: 0.53, begin: 102.5, index: 243 },
    { text: " fark", duration: 0.53, begin: 103.75, index: 244 },
    { text: " et", duration: 0.53, begin: 104.0, index: 245 },
    { text: "mez", duration: 0.53, begin: 104.25, index: 246 },
    { text: " ve", duration: 0.53, begin: 105.0, index: 247 },
    { text: "ya", duration: 0.53, begin: 105.25, index: 248 },
    { text: " fark", duration: 0.53, begin: 106.25, index: 249 },
    { text: " e", duration: 0.53, begin: 106.5, index: 250 },
    { text: "dil", duration: 0.53, begin: 106.75, index: 251 },
    { text: "mez", duration: 0.53, begin: 107.0, index: 252 },
    { text: " de", duration: 0.28, begin: 107.75, index: 253 },
    { text: "ni", duration: 0.28, begin: 108.0, index: 254 },
    { text: "len", duration: 0.28, begin: 108.25, index: 255 },
    { text: " hiç", duration: 0.53, begin: 109.0, index: 256 },
    { text: " bir", duration: 0.53, begin: 109.25, index: 257 },
    { text: " şey", duration: 0.53, begin: 109.5, index: 258 },
    { text: " yok", duration: 0.53, begin: 110.25, index: 259 },
    { text: "tur.", duration: 0.53, begin: 110.5, index: 260 },
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
  // Track story visit
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

          await addDoc(collection(db, "storyVisits"), {
            userId: user.uid,
            username: username,
            storyName: "Kim Fark Eder", // Change this for each story
            storyId: "kim-fark-eder", // Change this for each story
            visitedAt: serverTimestamp(),
          });

          console.log("✅ Visit tracked!");
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
                href="/dashboard/stories/zehir"
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
            src="/2-1.mp3"
            onEnded={handleAudioEnded}
            onLoadedMetadata={handleLoadedMetadata}
          />
        </div>

        {/* Story Content - plain, no box */}
        {renderTextSegments()}
      </div>
    </div>
  );
}
