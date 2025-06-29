"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, ArrowLeft, SkipForward, SkipBack,ChevronLeft, ChevronRight} from "lucide-react"
import Link from "next/link"

interface TextSegment {
  text: string
  duration: number
  begin: number
  index: number
  isTitle?: boolean
  isCenter?: boolean
}

export default function KirZincirleriniPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [audioDuration, setAudioDuration] = useState(0)
 
  const audioRef = useRef<HTMLAudioElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Story text segments with timing data - COMPLETE VERSION
  const textSegments: TextSegment[] = [
  { text: "", duration: 0.154, begin: 0.500, index: 0 },
  
  // Title
  { text: "Kim", duration: 0.53, begin: 0.500, index: 1, isTitle: true, isCenter: true },
  { text: " Fark", duration: 0.53, begin: 0.750, index: 2, isTitle: true, isCenter: true },
  { text: " E", duration: 0.53, begin: 1.000, index: 3, isTitle: true, isCenter: true },
  { text: "der?", duration: 0.53, begin: 1.250, index: 4, isTitle: true, isCenter: true },
  
  // Story content
  { text: " Bir", duration: 0.53, begin: 2.500, index: 5 },
  { text: " za", duration: 0.53, begin: 2.750, index: 6 },
  { text: "man", duration: 0.53, begin: 3.000, index: 7 },
  { text: "lar,", duration: 0.53, begin: 3.250, index: 8 },
  { text: " kom", duration: 0.53, begin: 4.250, index: 9 },
  { text: "şu", duration: 0.53, begin: 4.500, index: 10 },
  { text: " i", duration: 0.53, begin: 4.750, index: 11 },
  { text: "ki", duration: 0.53, begin: 5.000, index: 12 },
  { text: " ül", duration: 0.53, begin: 5.250, index: 13 },
  { text: "ke", duration: 0.53, begin: 5.500, index: 14 },
  { text: " a", duration: 0.53, begin: 6.500, index: 15 },
  { text: "man", duration: 0.53, begin: 6.750, index: 16 },
  { text: "sız", duration: 0.53, begin: 7.000, index: 17 },
  { text: " bir", duration: 0.53, begin: 7.500, index: 18 },
  { text: " re", duration: 0.53, begin: 7.750, index: 19 },
  { text: "ka", duration: 0.53, begin: 8.000, index: 20 },
  { text: "be", duration: 0.53, begin: 8.250, index: 21 },
  { text: "te", duration: 0.53, begin: 8.500, index: 22 },
  { text: " tu", duration: 0.23, begin: 9.250, index: 23 },
  { text: "tuş", duration: 0.48, begin: 9.500, index: 24 },
  { text: "muş", duration: 0.48, begin: 9.750, index: 25 },
  { text: "lar.", duration: 0.48, begin: 10.000, index: 26 },
  { text: " Ül", duration: 0.53, begin: 11.250, index: 27 },
  { text: "ke", duration: 0.53, begin: 11.500, index: 28 },
  { text: "ler", duration: 0.53, begin: 11.750, index: 29 },
  { text: "den", duration: 0.53, begin: 12.000, index: 30 },
  { text: " bi", duration: 0.23, begin: 12.750, index: 31 },
  { text: "ri", duration: 0.23, begin: 13.000, index: 32 },
  { text: "nin", duration: 0.23, begin: 13.250, index: 33 },
  { text: " hal", duration: 0.53, begin: 13.500, index: 34 },
  { text: "kı,", duration: 0.53, begin: 13.750, index: 35 },
  { text: " kar", duration: 0.53, begin: 14.750, index: 36 },
  { text: "şı", duration: 0.53, begin: 15.000, index: 37 },
  { text: " ta", duration: 0.53, begin: 15.250, index: 38 },
  { text: "ra", duration: 0.53, begin: 15.500, index: 39 },
  { text: "fa", duration: 0.53, begin: 15.750, index: 40 },
  { text: " ken", duration: 0.53, begin: 16.750, index: 41 },
  { text: "di", duration: 0.53, begin: 17.000, index: 42 },
  { text: " ül", duration: 0.53, begin: 17.250, index: 43 },
  { text: "ke", duration: 0.53, begin: 17.500, index: 44 },
  { text: "le", duration: 0.53, begin: 17.750, index: 45 },
  { text: "ri", duration: 0.53, begin: 18.000, index: 46 },
  { text: "nin", duration: 0.53, begin: 18.250, index: 47 },
  { text: " zen", duration: 0.53, begin: 18.750, index: 48 },
  { text: "gin", duration: 0.53, begin: 19.000, index: 49 },
  { text: "li", duration: 0.53, begin: 19.250, index: 50 },
  { text: "ği", duration: 0.53, begin: 19.500, index: 51 },
  { text: "ni", duration: 0.53, begin: 19.750, index: 52 },
  { text: " ke", duration: 0.53, begin: 20.750, index: 53 },
  { text: "sin", duration: 0.53, begin: 21.000, index: 54 },
  { text: " bir", duration: 0.68, begin: 21.250, index: 55 },
  { text: "şe", duration: 0.68, begin: 21.750, index: 56 },
  { text: "kil", duration: 0.68, begin: 22.000, index: 57 },
  { text: "de", duration: 0.68, begin: 22.250, index: 58 },
  { text: " gös", duration: 0.68, begin: 22.750, index: 59 },
  { text: "ter", duration: 0.68, begin: 23.000, index: 60 },
  { text: "mek", duration: 0.68, begin: 23.250, index: 61 },
  { text: " is", duration: 0.68, begin: 23.750, index: 62 },
  { text: "ti", duration: 0.68, begin: 24.000, index: 63 },
  { text: "yor", duration: 0.68, begin: 24.250, index: 64 },
  { text: "muş.", duration: 0.68, begin: 24.500, index: 65 },
  { text: " Ko", duration: 0.53, begin: 26.000, index: 66 },
  { text: "lay,", duration: 0.53, begin: 26.250, index: 67 },
  { text: " a", duration: 0.28, begin: 27.250, index: 68 },
  { text: "ma", duration: 0.28, begin: 27.500, index: 69 },
  { text: " et", duration: 0.53, begin: 27.750, index: 70 },
  { text: "ki", duration: 0.53, begin: 28.000, index: 71 },
  { text: "le", duration: 0.53, begin: 28.250, index: 72 },
  { text: "yi", duration: 0.53, begin: 28.500, index: 73 },
  { text: "ci", duration: 0.53, begin: 28.750, index: 74 },
  { text: " bir", duration: 0.53, begin: 29.000, index: 75 },
  { text: "şey", duration: 0.53, begin: 29.250, index: 76 },
  { text: " ya", duration: 0.53, begin: 29.750, index: 77 },
  { text: "pıl", duration: 0.53, begin: 30.000, index: 78 },
  { text: "ma", duration: 0.53, begin: 30.250, index: 79 },
  { text: "lıy", duration: 0.53, begin: 30.500, index: 80 },
  { text: "mış.", duration: 0.53, begin: 30.750, index: 81 },
  { text: " Bu", duration: 0.53, begin: 32.000, index: 82 },
  { text: "nun", duration: 0.53, begin: 32.250, index: 83 },
  { text: " i", duration: 0.53, begin: 32.500, index: 84 },
  { text: "çin", duration: 0.53, begin: 32.750, index: 85 },
  { text: " şeh", duration: 0.53, begin: 33.750, index: 86 },
  { text: "rin", duration: 0.53, begin: 34.000, index: 87 },
  { text: " or", duration: 0.53, begin: 34.500, index: 88 },
  { text: "ta", duration: 0.53, begin: 34.750, index: 89 },
  { text: "sı", duration: 0.53, begin: 35.000, index: 90 },
  { text: "na", duration: 0.53, begin: 35.250, index: 91 },
  { text: " bü", duration: 0.53, begin: 36.250, index: 92 },
  { text: "yük", duration: 0.53, begin: 36.500, index: 93 },
  { text: " bir", duration: 0.53, begin: 37.000, index: 94 },
  { text: " süt", duration: 0.53, begin: 37.250, index: 95 },
  { text: " ha", duration: 0.53, begin: 37.500, index: 96 },
  { text: "vu", duration: 0.53, begin: 37.750, index: 97 },
  { text: "zu", duration: 0.53, begin: 38.000, index: 98 },
  { text: " ya", duration: 0.53, begin: 38.500, index: 99 },
  { text: "pıl", duration: 0.53, begin: 38.750, index: 100 },
  { text: "ma", duration: 0.53, begin: 39.000, index: 101 },
  { text: "sı", duration: 0.53, begin: 39.250, index: 102 },
  { text: "na", duration: 0.53, begin: 39.500, index: 103 },
  { text: " ka", duration: 0.53, begin: 40.500, index: 104 },
  { text: "rar", duration: 0.53, begin: 40.750, index: 105 },
  { text: " ve", duration: 0.53, begin: 41.000, index: 106 },
  { text: "ril", duration: 0.53, begin: 41.250, index: 107 },
  { text: "miş.", duration: 0.53, begin: 41.500, index: 108 },
  { text: " Ge", duration: 0.53, begin: 43.000, index: 109 },
  { text: "ce", duration: 0.53, begin: 43.250, index: 110 },
  { text: " her", duration: 0.53, begin: 43.500, index: 111 },
  { text: "kes", duration: 0.53, begin: 43.750, index: 112 },
  { text: " bir", duration: 0.53, begin: 45.000, index: 113 },
  { text: " ko", duration: 0.53, begin: 45.250, index: 114 },
  { text: "va", duration: 0.53, begin: 45.500, index: 115 },
  { text: " süt", duration: 0.53, begin: 46.250, index: 116 },
  { text: " ge", duration: 0.53, begin: 46.500, index: 117 },
  { text: "ti", duration: 0.53, begin: 46.750, index: 118 },
  { text: "re", duration: 0.53, begin: 47.000, index: 119 },
  { text: "cek", duration: 0.53, begin: 47.250, index: 120 },
  { text: " ve", duration: 0.53, begin: 47.750, index: 121 },
  { text: " bu", duration: 0.53, begin: 48.750, index: 122 },
  { text: " ha", duration: 0.53, begin: 49.000, index: 123 },
  { text: "vu", duration: 0.53, begin: 49.250, index: 124 },
  { text: "za", duration: 0.53, begin: 49.500, index: 125 },
  { text: " dö", duration: 0.53, begin: 50.000, index: 126 },
  { text: "ke", duration: 0.53, begin: 50.250, index: 127 },
  { text: "cek", duration: 0.53, begin: 50.500, index: 128 },
  { text: "miş.", duration: 0.53, begin: 50.750, index: 129 },
  { text: " Her", duration: 0.53, begin: 52.000, index: 130 },
  { text: "ke", duration: 0.53, begin: 52.250, index: 131 },
  { text: "se", duration: 0.53, begin: 52.500, index: 132 },
  { text: " bu", duration: 0.53, begin: 53.750, index: 133 },
  { text: " fi", duration: 0.53, begin: 54.000, index: 134 },
  { text: "kir", duration: 0.53, begin: 54.250, index: 135 },
  { text: " ca", duration: 0.53, begin: 54.500, index: 136 },
  { text: "zip", duration: 0.53, begin: 54.750, index: 137 },
  { text: " gel", duration: 0.53, begin: 55.500, index: 138 },
  { text: "miş.", duration: 0.53, begin: 55.750, index: 139 },
  { text: " Her", duration: 0.53, begin: 57.000, index: 140 },
  { text: "kes,", duration: 0.53, begin: 57.250, index: 141 },
  { text: " ka", duration: 0.53, begin: 58.500, index: 142 },
  { text: "rar", duration: 0.53, begin: 58.750, index: 143 },
  { text: "laş", duration: 0.53, begin: 59.000, index: 144 },
  { text: "tı", duration: 0.53, begin: 59.250, index: 145 },
  { text: "rı", duration: 0.53, begin: 59.500, index: 146 },
  { text: "lan", duration: 0.53, begin: 59.750, index: 147 },
  { text: " ge", duration: 0.53, begin: 60.500, index: 148 },
  { text: "ce", duration: 0.53, begin: 60.750, index: 149 },
  { text: " gö", duration: 0.53, begin: 61.750, index: 150 },
  { text: "tür", duration: 0.53, begin: 62.000, index: 151 },
  { text: "dü", duration: 0.53, begin: 62.250, index: 152 },
  { text: "ğü", duration: 0.53, begin: 62.500, index: 153 },
  { text: "nü", duration: 0.53, begin: 62.750, index: 154 },
  { text: " ha", duration: 0.53, begin: 63.000, index: 155 },
  { text: "vu", duration: 0.53, begin: 63.250, index: 156 },
  { text: "za", duration: 0.53, begin: 63.500, index: 157 },
  { text: " bo", duration: 0.53, begin: 63.750, index: 158 },
  { text: "şalt", duration: 0.53, begin: 64.000, index: 159 },
  { text: "mış.", duration: 0.53, begin: 64.250, index: 160 },
  { text: " Ne", duration: 0.53, begin: 65.750, index: 161 },
  { text: " var", duration: 0.53, begin: 66.000, index: 162 },
  { text: " ki,", duration: 0.53, begin: 66.250, index: 163 },
  { text: " sa", duration: 0.53, begin: 67.250, index: 164 },
  { text: "bah", duration: 0.53, begin: 67.500, index: 165 },
  { text: " ol", duration: 0.53, begin: 67.750, index: 166 },
  { text: "du", duration: 0.53, begin: 68.000, index: 167 },
  { text: "ğun", duration: 0.53, begin: 68.250, index: 168 },
  { text: "da,", duration: 0.53, begin: 68.500, index: 169 },
  { text: " or", duration: 0.53, begin: 69.750, index: 170 },
  { text: "ta", duration: 0.53, begin: 70.000, index: 171 },
  { text: "da", duration: 0.53, begin: 70.250, index: 172 },
  { text: " i", duration: 0.53, begin: 70.500, index: 173 },
  { text: "çi", duration: 0.53, begin: 70.750, index: 174 },
  { text: " süt", duration: 0.53, begin: 71.250, index: 175 },
  { text: " i", duration: 0.53, begin: 71.500, index: 176 },
  { text: "le", duration: 0.53, begin: 71.750, index: 177 },
  { text: " de", duration: 0.53, begin: 72.250, index: 178 },
  { text: "ğil,", duration: 0.53, begin: 72.500, index: 179 },
  { text: " dup", duration: 0.53, begin: 73.500, index: 180 },
  { text: "du", duration: 0.53, begin: 73.750, index: 181 },
  { text: "ru", duration: 0.53, begin: 74.000, index: 182 },
  { text: " su", duration: 0.53, begin: 74.250, index: 183 },
  { text: " i", duration: 0.53, begin: 74.500, index: 184 },
  { text: "le", duration: 0.53, begin: 74.750, index: 185 },
  { text: " dol", duration: 0.53, begin: 75.000, index: 186 },
  { text: "muş", duration: 0.53, begin: 75.250, index: 187 },
  { text: " bir", duration: 0.53, begin: 76.500, index: 188 },
  { text: " ha", duration: 0.53, begin: 76.750, index: 189 },
  { text: "vuz", duration: 0.53, begin: 77.000, index: 190 },
  { text: " var", duration: 0.53, begin: 77.750, index: 191 },
  { text: "mış.", duration: 0.53, begin: 78.000, index: 192 },
  { text: " Çün", duration: 0.53, begin: 79.500, index: 193 },
  { text: "kü", duration: 0.53, begin: 79.750, index: 194 },
  { text: " her", duration: 0.53, begin: 80.250, index: 195 },
  { text: "kes,", duration: 0.53, begin: 80.500, index: 196 },
  { text: " ay", duration: 0.53, begin: 81.500, index: 197 },
  { text: "nı", duration: 0.53, begin: 81.750, index: 198 },
  { text: " şe", duration: 0.53, begin: 82.000, index: 199 },
  { text: "kil", duration: 0.53, begin: 82.250, index: 200 },
  { text: "de", duration: 0.53, begin: 82.500, index: 201 },
  { text: " dü", duration: 0.53, begin: 83.000, index: 202 },
  { text: "şün", duration: 0.53, begin: 83.250, index: 203 },
  { text: "müş:", duration: 0.53, begin: 83.500, index: 204 },
  { text: " Bu", duration: 0.53, begin: 85.000, index: 205 },
  { text: " ka", duration: 0.53, begin: 85.250, index: 206 },
  { text: "dar", duration: 0.53, begin: 85.500, index: 207 },
  { text: " in", duration: 0.53, begin: 85.750, index: 208 },
  { text: "san", duration: 0.53, begin: 86.000, index: 209 },
  { text: " i", duration: 0.53, begin: 86.750, index: 210 },
  { text: "çin", duration: 0.53, begin: 87.000, index: 211 },
  { text: "de", duration: 0.53, begin: 87.250, index: 212 },
  { text: " yal", duration: 0.53, begin: 88.500, index: 213 },
  { text: "nız", duration: 0.53, begin: 88.750, index: 214 },
  { text: " ben,", duration: 0.53, begin: 89.250, index: 215 },
  { text: " süt", duration: 0.53, begin: 90.250, index: 216 },
  { text: " ye", duration: 0.53, begin: 90.500, index: 217 },
  { text: "ri", duration: 0.53, begin: 90.750, index: 218 },
  { text: "ne", duration: 0.53, begin: 91.000, index: 219 },
  { text: " bir", duration: 0.53, begin: 92.000, index: 220 },
  { text: " ko", duration: 0.53, begin: 92.250, index: 221 },
  { text: "va", duration: 0.53, begin: 92.500, index: 222 },
  { text: " su", duration: 0.53, begin: 92.750, index: 223 },
  { text: " dök", duration: 0.53, begin: 93.000, index: 224 },
  { text: "sem", duration: 0.53, begin: 93.250, index: 225 },
  { text: " ne", duration: 0.53, begin: 94.750, index: 226 },
  { text: " fark", duration: 0.53, begin: 95.000, index: 227 },
  { text: " e", duration: 0.53, begin: 95.250, index: 228 },
  { text: "der", duration: 0.53, begin: 95.500, index: 229 },
  { text: " ki?", duration: 0.53, begin: 95.750, index: 230 },
  { text: " Kim", duration: 0.53, begin: 97.000, index: 231 },
  { text: " fark", duration: 0.53, begin: 97.250, index: 232 },
  { text: " e", duration: 0.53, begin: 97.500, index: 233 },
  { text: "der", duration: 0.53, begin: 97.750, index: 234 },
  { text: " ki.", duration: 0.53, begin: 98.000, index: 235 },
  { text: " Oy", duration: 0.53, begin: 99.750, index: 236 },
  { text: "sa", duration: 0.53, begin: 100.000, index: 237 },
  { text: " ha", duration: 0.53, begin: 101.000, index: 238 },
  { text: "ya", duration: 0.53, begin: 101.250, index: 239 },
  { text: "tın", duration: 0.53, begin: 101.500, index: 240 },
  { text: " i", duration: 0.53, begin: 102.000, index: 241 },
  { text: "çin", duration: 0.53, begin: 102.250, index: 242 },
  { text: "de,", duration: 0.53, begin: 102.500, index: 243 },
  { text: " fark", duration: 0.53, begin: 103.750, index: 244 },
  { text: " et", duration: 0.53, begin: 104.000, index: 245 },
  { text: "mez", duration: 0.53, begin: 104.250, index: 246 },
  { text: " ve", duration: 0.53, begin: 105.000, index: 247 },
  { text: "ya", duration: 0.53, begin: 105.250, index: 248 },
  { text: " fark", duration: 0.53, begin: 106.250, index: 249 },
  { text: " e", duration: 0.53, begin: 106.500, index: 250 },
  { text: "dil", duration: 0.53, begin: 106.750, index: 251 },
  { text: "mez", duration: 0.53, begin: 107.000, index: 252 },
  { text: " de", duration: 0.28, begin: 107.750, index: 253 },
  { text: "ni", duration: 0.28, begin: 108.000, index: 254 },
  { text: "len", duration: 0.28, begin: 108.250, index: 255 },
  { text: " hiç", duration: 0.53, begin: 109.000, index: 256 },
  { text: " bir", duration: 0.53, begin: 109.250, index: 257 },
  { text: " şey", duration: 0.53, begin: 109.500, index: 258 },
  { text: " yok", duration: 0.53, begin: 110.250, index: 259 },
  { text: "tur.", duration: 0.53, begin: 110.500, index: 260 },
];
  

 useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Handle audio metadata loaded to get duration
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration)
    }
  }

  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    } else {
      audioRef.current.play()
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const time = audioRef.current.currentTime
          setCurrentTime(time)
          const activeSegment = textSegments.find(
            (segment) => time >= segment.begin && time < segment.begin + segment.duration,
          )
          if (activeSegment) {
            setActiveIndex(activeSegment.index)
          }
        }
      }, 50)
    }
    setIsPlaying(!isPlaying)
  }
  
  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current?.duration || 0)
    }
  }

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const progressWidth = rect.width
    const clickPercentage = clickX / progressWidth
    const newTime = clickPercentage * (audioRef.current.duration || 0)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
    setActiveIndex(-1)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const renderTextSegments = () => {
    const titleSegments = textSegments.filter((segment) => segment.isTitle)
    const bodySegments = textSegments.filter((segment) => !segment.isTitle && segment.text.trim())

    return (
      <div className="space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
            {titleSegments.map((segment) => (
              <span
                key={segment.index}
                className={`transition-all duration-300 ${
                  activeIndex === segment.index
                    ? "text-black font-extrabold underline decoration-2 decoration-black opacity-100"
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
                className={`transition-all duration-300 ${
                  activeIndex === segment.index
                    ? "text-black font-bold underline decoration-2 decoration-black opacity-100"
                    : segment.index < activeIndex
                      ? "text-black opacity-100"
                      : "text-slate-700 opacity-40"
                }`}
              >
                {segment.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/stories/zehir" className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Hikayelere Dön</span>
              <span className="sm:hidden">Geri</span>
            </Link>

            {/* Navigation Buttons */}
<div className="flex items-center space-x-5">
  
  <Link href="/dashboard/stories/zehir" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
              <h2 className="text-lg font-semibold text-slate-900 whitespace-nowrap">Sesli Okuma</h2>
              <div className="text-sm text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded">
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
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
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

        {/* Story Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">{renderTextSegments()}</div>
      </div>
    </div>
  )
}