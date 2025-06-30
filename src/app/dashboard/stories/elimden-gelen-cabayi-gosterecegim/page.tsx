"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, ArrowLeft, SkipForward, SkipBack, ChevronRight,ChevronLeft} from "lucide-react"
import Link from "next/link"
import { auth, db } from "../../../../../firebase"
import { onAuthStateChanged, type User } from "firebase/auth"
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore"
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
 const [user, setUser] = useState<User | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Story text segments with timing data - COMPLETE VERSION
  const textSegments: TextSegment[] = [
  // Title
  { text: "E", duration: 0.28, begin: 0.500, index: 1, isTitle: true, isCenter: true },
  { text: "lim", duration: 0.28, begin: 0.750, index: 2, isTitle: true, isCenter: true },
  { text: "den", duration: 0.28, begin: 1.000, index: 3, isTitle: true, isCenter: true },
  { text: " Ge", duration: 0.28, begin: 1.250, index: 4, isTitle: true, isCenter: true },
  { text: "len", duration: 0.28, begin: 1.500, index: 5, isTitle: true, isCenter: true },
  { text: " Ça", duration: 0.28, begin: 1.750, index: 6, isTitle: true, isCenter: true },
  { text: "ba", duration: 0.28, begin: 2.000, index: 7, isTitle: true, isCenter: true },
  { text: "yı", duration: 0.28, begin: 2.250, index: 8, isTitle: true, isCenter: true },
  { text: " Gös", duration: 0.28, begin: 2.500, index: 9, isTitle: true, isCenter: true },
  { text: "te", duration: 0.28, begin: 2.700, index: 10, isTitle: true, isCenter: true },
  { text: "re", duration: 0.28, begin: 2.900, index: 11, isTitle: true, isCenter: true },
  { text: "ce", duration: 0.28, begin: 3.100, index: 12, isTitle: true, isCenter: true },
  { text: "ğim", duration: 0.28, begin: 3.300, index: 13, isTitle: true, isCenter: true },

  // Story content
  { text: " Bir", duration: 0.28, begin: 4.300, index: 14 },
  { text: " baş", duration: 0.28, begin: 4.500, index: 15 },
  { text: "kan", duration: 0.28, begin: 4.700, index: 16 },
  { text: " a", duration: 0.28, begin: 4.900, index: 17 },
  { text: "da", duration: 0.28, begin: 5.100, index: 18 },
  { text: "yı,", duration: 0.28, begin: 5.300, index: 19 },
  { text: " ye", duration: 0.28, begin: 6.300, index: 20 },
  { text: "rel", duration: 0.28, begin: 6.500, index: 21 },
  { text: " bir", duration: 0.28, begin: 6.700, index: 22 },
  { text: " fu", duration: 0.28, begin: 6.900, index: 23 },
  { text: "ar", duration: 0.28, begin: 7.100, index: 24 },
  { text: "da", duration: 0.28, begin: 7.300, index: 25 },
  { text: " şar", duration: 0.28, begin: 7.700, index: 26 },
  { text: "kı", duration: 0.28, begin: 7.900, index: 27 },
  { text: " söy", duration: 0.28, begin: 8.300, index: 28 },
  { text: "le", duration: 0.28, begin: 8.500, index: 29 },
  { text: "yen", duration: 0.28, begin: 8.700, index: 30 },
  { text: " on", duration: 0.28, begin: 9.700, index: 31 },
  { text: " i", duration: 0.28, begin: 9.900, index: 32 },
  { text: "ki", duration: 0.28, begin: 10.100, index: 33 },
  { text: " ya", duration: 0.28, begin: 10.300, index: 34 },
  { text: "şın", duration: 0.28, begin: 10.500, index: 35 },
  { text: "da", duration: 0.28, begin: 10.700, index: 36 },
  { text: " bir", duration: 0.28, begin: 11.100, index: 37 },
  { text: " kız", duration: 0.28, begin: 11.300, index: 38 },
  { text: "la", duration: 0.28, begin: 11.500, index: 39 },
  { text: " kar", duration: 0.40, begin: 11.900, index: 40 },
  { text: "şı", duration: 0.40, begin: 12.100, index: 41 },
  { text: "laş", duration: 0.40, begin: 12.300, index: 42 },
  { text: "tı", duration: 0.38, begin: 12.500, index: 43 },
  { text: " ve", duration: 0.38, begin: 12.700, index: 44 },
  { text: " ye", duration: 0.38, begin: 13.700, index: 45 },
  { text: "te", duration: 0.38, begin: 13.900, index: 46 },
  { text: "ne", duration: 0.38, begin: 14.100, index: 47 },
  { text: "ği", duration: 0.38, begin: 14.300, index: 48 },
  { text: "ne", duration: 0.38, begin: 14.500, index: 49 },
  { text: " hay", duration: 0.38, begin: 14.700, index: 50 },
  { text: "ran", duration: 0.38, begin: 14.900, index: 51 },
  { text: " o", duration: 0.38, begin: 15.300, index: 52 },
  { text: "la", duration: 0.38, begin: 15.500, index: 53 },
  { text: "rak", duration: 0.38, begin: 15.700, index: 54 },
  { text: " o", duration: 0.28, begin: 16.500, index: 55 },
  { text: " a", duration: 0.28, begin: 16.900, index: 56 },
  { text: "yın", duration: 0.28, begin: 17.100, index: 57 },
  { text: " i", duration: 0.28, begin: 17.300, index: 58 },
  { text: "ler", duration: 0.28, begin: 17.500, index: 59 },
  { text: "le", duration: 0.28, begin: 17.700, index: 60 },
  { text: "yen", duration: 0.28, begin: 17.900, index: 61 },
  { text: " gün", duration: 0.38, begin: 18.300, index: 62 },
  { text: "le", duration: 0.38, begin: 18.500, index: 63 },
  { text: "rin", duration: 0.38, begin: 18.700, index: 64 },
  { text: "de", duration: 0.38, begin: 18.900, index: 65 },
  { text: " ger", duration: 0.50, begin: 19.900, index: 66 },
  { text: "çek", duration: 0.50, begin: 20.100, index: 67 },
  { text: "le", duration: 0.50, begin: 20.300, index: 68 },
  { text: "şe", duration: 0.50, begin: 20.500, index: 69 },
  { text: "cek", duration: 0.50, begin: 20.700, index: 70 },
  { text: " o", duration: 0.30, begin: 21.100, index: 71 },
  { text: "lan", duration: 0.28, begin: 21.300, index: 72 },
  { text: " u", duration: 0.28, begin: 22.000, index: 73 },
  { text: "lu", duration: 0.28, begin: 22.250, index: 74 },
  { text: "sal", duration: 0.28, begin: 22.500, index: 75 },
  { text: " si", duration: 0.28, begin: 22.750, index: 76 },
  { text: "ya", duration: 0.28, begin: 23.000, index: 77 },
  { text: "set", duration: 0.28, begin: 23.250, index: 78 },
  { text: " top", duration: 0.28, begin: 23.750, index: 79 },
  { text: "lan", duration: 0.28, begin: 24.000, index: 80 },
  { text: "tı", duration: 0.28, begin: 24.250, index: 81 },
  { text: "sın", duration: 0.28, begin: 24.500, index: 82 },
  { text: "da", duration: 0.28, begin: 24.750, index: 83 },
  { text: " da", duration: 0.28, begin: 25.000, index: 84 },
  { text: " şar", duration: 0.28, begin: 25.750, index: 85 },
  { text: "kı", duration: 0.28, begin: 26.000, index: 86 },
  { text: " söy", duration: 0.28, begin: 26.250, index: 87 },
  { text: "le", duration: 0.28, begin: 26.500, index: 88 },
  { text: "me", duration: 0.28, begin: 26.750, index: 89 },
  { text: "si", duration: 0.28, begin: 27.000, index: 90 },
  { text: "ni", duration: 0.28, begin: 27.250, index: 91 },
  { text: " is", duration: 0.28, begin: 27.500, index: 92 },
  { text: "te", duration: 0.28, begin: 27.750, index: 93 },
  { text: "di.", duration: 0.28, begin: 28.000, index: 94 },
  { text: " Fa", duration: 0.28, begin: 29.000, index: 95 },
  { text: "kat", duration: 0.28, begin: 29.250, index: 96 },
  { text: " o", duration: 0.28, begin: 29.750, index: 97 },
  { text: "ra", duration: 0.28, begin: 30.000, index: 98 },
  { text: "da", duration: 0.28, begin: 30.250, index: 99 },
  { text: " il", duration: 0.28, begin: 30.500, index: 100 },
  { text: "ginç", duration: 0.28, begin: 30.750, index: 101 },
  { text: " bir", duration: 0.28, begin: 31.000, index: 102 },
  { text: " o", duration: 0.28, begin: 31.250, index: 103 },
  { text: "lay", duration: 0.28, begin: 31.500, index: 104 },
  { text: " ol", duration: 0.28, begin: 31.750, index: 105 },
  { text: "du", duration: 0.28, begin: 32.000, index: 106 },
  { text: " ve", duration: 0.28, begin: 32.500, index: 107 },
  { text: " şar", duration: 0.28, begin: 33.250, index: 108 },
  { text: "kı", duration: 0.28, begin: 33.500, index: 109 },
  { text: "cı", duration: 0.28, begin: 33.750, index: 110 },
  { text: " kı", duration: 0.28, begin: 34.000, index: 111 },
  { text: "za", duration: 0.28, begin: 34.250, index: 112 },
  { text: " şöy", duration: 0.28, begin: 34.500, index: 113 },
  { text: "le", duration: 0.28, begin: 34.750, index: 114 },
  { text: " bir", duration: 0.28, begin: 35.000, index: 115 },
  { text: " so", duration: 0.28, begin: 35.250, index: 116 },
  { text: "ru", duration: 0.28, begin: 35.500, index: 117 },
  { text: " sor", duration: 0.28, begin: 35.750, index: 118 },
  { text: "du:", duration: 0.28, begin: 36.000, index: 119 },
  { text: " \"Ya", duration: 0.28, begin: 37.000, index: 120 },
  { text: " şa", duration: 0.28, begin: 37.250, index: 121 },
  { text: "şı", duration: 0.28, begin: 37.500, index: 122 },
  { text: "rır", duration: 0.28, begin: 37.750, index: 123 },
  { text: " ve", duration: 0.28, begin: 38.000, index: 124 },
  { text: " mil", duration: 0.28, begin: 38.500, index: 125 },
  { text: "yon", duration: 0.28, begin: 38.750, index: 126 },
  { text: "lar", duration: 0.28, begin: 39.000, index: 127 },
  { text: "ca", duration: 0.28, begin: 39.250, index: 128 },
  { text: " iz", duration: 0.28, begin: 39.500, index: 129 },
  { text: "le", duration: 0.28, begin: 39.750, index: 130 },
  { text: "yi", duration: 0.28, begin: 40.000, index: 131 },
  { text: "ci", duration: 0.28, begin: 40.250, index: 132 },
  { text: "nin", duration: 0.28, begin: 40.500, index: 133 },
  { text: " gö", duration: 0.28, begin: 40.750, index: 134 },
  { text: "zü", duration: 0.28, begin: 41.000, index: 135 },
  { text: " ö", duration: 0.28, begin: 41.250, index: 136 },
  { text: "nün", duration: 0.28, begin: 41.500, index: 137 },
  { text: "de", duration: 0.28, begin: 41.750, index: 138 },
  { text: " bir", duration: 0.28, begin: 42.500, index: 139 },
  { text: " ha", duration: 0.28, begin: 42.750, index: 140 },
  { text: "ta", duration: 0.28, begin: 43.000, index: 141 },
  { text: " ya", duration: 0.28, begin: 43.500, index: 142 },
  { text: "par", duration: 0.28, begin: 43.750, index: 143 },
  { text: "san", duration: 0.28, begin: 44.000, index: 144 },
  { text: " ken", duration: 0.28, begin: 44.750, index: 145 },
  { text: "di", duration: 0.28, begin: 45.000, index: 146 },
  { text: "ni", duration: 0.28, begin: 45.250, index: 147 },
  { text: " na", duration: 0.28, begin: 45.500, index: 148 },
  { text: "sıl", duration: 0.28, begin: 45.750, index: 149 },
  { text: " his", duration: 0.28, begin: 46.000, index: 150 },
  { text: "se", duration: 0.28, begin: 46.250, index: 151 },
  { text: "de", duration: 0.28, begin: 46.500, index: 152 },
  { text: "cek", duration: 0.28, begin: 46.750, index: 153 },
  { text: "sin?\"", duration: 0.28, begin: 47.000, index: 154 },
  { text: " Bu", duration: 0.28, begin: 48.250, index: 155 },
  { text: " so", duration: 0.28, begin: 48.500, index: 156 },
  { text: "ru", duration: 0.28, begin: 48.750, index: 157 },
  { text: " i", duration: 0.28, begin: 49.000, index: 158 },
  { text: "le", duration: 0.28, begin: 49.250, index: 159 },
  { text: " ço", duration: 0.28, begin: 49.750, index: 160 },
  { text: "cu", duration: 0.28, begin: 50.000, index: 161 },
  { text: "ğun", duration: 0.28, begin: 50.250, index: 162 },
  { text: " zih", duration: 0.28, begin: 50.500, index: 163 },
  { text: "ni", duration: 0.28, begin: 50.750, index: 164 },
  { text: "ne", duration: 0.28, begin: 51.000, index: 165 },
  { text: " kor", duration: 0.28, begin: 51.500, index: 166 },
  { text: "kunç", duration: 0.28, begin: 51.750, index: 167 },
  { text: " bir", duration: 0.28, begin: 52.000, index: 168 },
  { text: " dü", duration: 0.28, begin: 52.250, index: 169 },
  { text: "şün", duration: 0.28, begin: 52.500, index: 170 },
  { text: "ce", duration: 0.28, begin: 52.750, index: 171 },
  { text: " yer", duration: 0.28, begin: 53.250, index: 172 },
  { text: "leş", duration: 0.28, begin: 53.500, index: 173 },
  { text: "ti", duration: 0.28, begin: 53.750, index: 174 },
  { text: "ril", duration: 0.28, begin: 54.000, index: 175 },
  { text: "miş", duration: 0.28, begin: 54.250, index: 176 },
  { text: "ti.", duration: 0.28, begin: 54.500, index: 177 },
  { text: " Fa", duration: 0.28, begin: 55.750, index: 178 },
  { text: "kat", duration: 0.28, begin: 56.000, index: 179 },
  { text: " on", duration: 0.28, begin: 56.750, index: 180 },
  { text: " i", duration: 0.28, begin: 57.000, index: 181 },
  { text: "ki", duration: 0.28, begin: 57.250, index: 182 },
  { text: " ya", duration: 0.28, begin: 57.500, index: 183 },
  { text: "şın", duration: 0.28, begin: 57.750, index: 184 },
  { text: "da", duration: 0.28, begin: 58.000, index: 185 },
  { text: " o", duration: 0.28, begin: 58.250, index: 186 },
  { text: "lan", duration: 0.28, begin: 58.500, index: 187 },
  { text: " kız", duration: 0.28, begin: 58.750, index: 188 },
  { text: " hiç", duration: 0.28, begin: 59.500, index: 189 },
  { text: " bek", duration: 0.28, begin: 60.000, index: 190 },
  { text: "len", duration: 0.28, begin: 60.250, index: 191 },
  { text: "me", duration: 0.28, begin: 60.500, index: 192 },
  { text: "dik", duration: 0.28, begin: 60.750, index: 193 },
  { text: " bir", duration: 0.28, begin: 61.000, index: 194 },
  { text: " öz", duration: 0.28, begin: 61.500, index: 195 },
  { text: "gü", duration: 0.28, begin: 61.750, index: 196 },
  { text: "ven", duration: 0.28, begin: 62.000, index: 197 },
  { text: "le", duration: 0.28, begin: 62.250, index: 198 },
  { text: " şöy", duration: 0.28, begin: 63.000, index: 199 },
  { text: "le", duration: 0.28, begin: 63.250, index: 200 },
  { text: " de", duration: 0.28, begin: 63.500, index: 201 },
  { text: "di:", duration: 0.28, begin: 63.750, index: 202 },
  { text: " \"Ha", duration: 0.28, begin: 64.750, index: 203 },
  { text: "ta", duration: 0.28, begin: 64.950, index: 204 },
  { text: " ya", duration: 0.28, begin: 65.150, index: 205 },
  { text: "pa", duration: 0.28, begin: 65.350, index: 206 },
  { text: "ca", duration: 0.28, begin: 65.550, index: 207 },
  { text: "ğı", duration: 0.28, begin: 65.750, index: 208 },
  { text: "mı", duration: 0.28, begin: 65.950, index: 209 },
  { text: " san", duration: 0.28, begin: 66.350, index: 210 },
  { text: "mı", duration: 0.28, begin: 66.550, index: 211 },
  { text: "yo", duration: 0.28, begin: 66.750, index: 212 },
  { text: "rum,", duration: 0.28, begin: 66.950, index: 213 },
  { text: " a", duration: 0.28, begin: 67.500, index: 214 },
  { text: "ma", duration: 0.28, begin: 67.750, index: 215 },
  { text: " ya", duration: 0.28, begin: 68.250, index: 216 },
  { text: "par", duration: 0.28, begin: 68.500, index: 217 },
  { text: "sam", duration: 0.28, begin: 68.750, index: 218 },
  { text: "da", duration: 0.28, begin: 69.000, index: 219 },
  { text: " e", duration: 0.28, begin: 69.750, index: 220 },
  { text: "lim", duration: 0.28, begin: 70.000, index: 221 },
  { text: "den", duration: 0.28, begin: 70.250, index: 222 },
  { text: " ge", duration: 0.28, begin: 70.750, index: 223 },
  { text: "len", duration: 0.28, begin: 71.000, index: 224 },
  { text: " ça", duration: 0.28, begin: 71.250, index: 225 },
  { text: "ba", duration: 0.28, begin: 71.500, index: 226 },
  { text: "yı", duration: 0.28, begin: 71.750, index: 227 },
  { text: " gös", duration: 0.28, begin: 72.000, index: 228 },
  { text: "ter", duration: 0.28, begin: 72.250, index: 229 },
  { text: "miş", duration: 0.28, begin: 72.500, index: 230 },
  { text: " ol", duration: 0.28, begin: 72.750, index: 231 },
  { text: "du", duration: 0.28, begin: 73.000, index: 232 },
  { text: "ğu", duration: 0.28, begin: 73.250, index: 233 },
  { text: "mu", duration: 0.28, begin: 73.500, index: 234 },
  { text: " bi", duration: 0.10, begin: 73.750, index: 235 },
  { text: "le", duration: 0.10, begin: 74.000, index: 236 },
  { text: "ce", duration: 0.10, begin: 74.250, index: 237 },
  { text: "ğim.\"", duration: 0.10, begin: 74.500, index: 238 }
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
// First useEffect: Listen for auth changes
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser)
  })
  return () => unsubscribe()
}, [])

// Second useEffect: Track visit when user is available
useEffect(() => {
  const trackVisit = async () => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (!userDoc.exists()) return

        const userData = userDoc.data()
        const username = userData.username || userData.firstName || "Unknown"

        // Get story ID from current URL (last part)
        const currentPath = window.location.pathname
        const storyId = currentPath.split('/').pop() || 'unknown'
        
        // Convert kebab-case to Title Case for display
        const storyName = storyId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

        await addDoc(collection(db, "storyVisits"), {
          userId: user.uid,
          username: username,
          storyName: storyName,
          storyId: storyId,
          visitedAt: serverTimestamp(),
        })
        
        console.log(`✅ Visit tracked: ${storyName}`)
      } catch (error) {
        console.error("❌ Error:", error)
      }
    }
  }
  trackVisit()
}, [user])
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
            <Link href="/dashboard/stories" className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Hikayelere Dön</span>
              <span className="sm:hidden">Geri</span>
            </Link>

            {/* Navigation Buttons */}
<div className="flex items-center space-x-5">
  <Link href="/dashboard/stories/akilli-deli" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span className="hidden sm:inline">Önceki Hikaye</span>
    <span className="sm:hidden">Önceki</span>
  </Link>
  <Link href="/dashboard/stories/einstein-ve-soforu" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
            src="/4-2.mp3"
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