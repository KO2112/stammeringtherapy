"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, ArrowLeft, SkipForward, SkipBack, Edit, Save, X } from "lucide-react"
import Link from "next/link"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../../../../../firebase"
import { useParams } from "next/navigation"
import {auth} from "../../../../../../firebase"
import { onAuthStateChanged } from "firebase/auth"

interface NewStory {
  id: string
  title: string
  description: string
  content: string
  audioUrl?: string
  readingTimeMinutes: number
  createdAt: any
}

export default function YeniHikayePage() {
  const params = useParams()
  const [story, setStory] = useState<NewStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState("")
  const [editedTitle, setEditedTitle] = useState("")
  const [saving, setSaving] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchStory = async () => {
      if (!params.id) return

      try {
        const storyDoc = await getDoc(doc(db, "new_stories", params.id as string))
        if (storyDoc.exists()) {
          setStory({
            id: storyDoc.id,
            ...storyDoc.data(),
          } as NewStory)
        }
      } catch (error) {
        console.error("Error fetching story:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStory()
  }, [params.id])

  useEffect(() => {
    if (story) {
      setEditedContent(story.content)
      setEditedTitle(story.title)
    }
  }, [story])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setCurrentUser({ uid: user.uid, ...userDoc.data() })
        }
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

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
          setCurrentTime(audioRef.current.currentTime)
        }
      }, 100)
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleSaveContent = async () => {
    if (!story || !currentUser || currentUser.role !== "admin") return

    setSaving(true)
    try {
      await updateDoc(doc(db, "new_stories", story.id), {
        content: editedContent,
        title: editedTitle,
      })
      setStory({ ...story, content: editedContent, title: editedTitle })
      setIsEditing(false)
      alert("İçerik başarıyla güncellendi!")
    } catch (error) {
      console.error("Error updating content:", error)
      alert("İçerik güncellenemedi")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Hikaye Bulunamadı</h2>
          <Link href="/dashboard/stories" className="text-teal-600 hover:text-teal-700">
            Hikayelere Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/stories"
              className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Hikayelere Dön</span>
              <span className="sm:hidden">Geri</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-slate-500">
                <Volume2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Yeni Hikaye</span>
              </div>

              {/* Edit Controls */}
              {currentUser?.role === "admin" && (
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      <Edit className="h-4 w-4" />
                      Düzenle
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveContent}
                        disabled={saving}
                        className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 transition-colors text-sm"
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></div>
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Kaydet
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setEditedContent(story.content)
                          setEditedTitle(story.title)
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <X className="h-4 w-4" />
                        İptal
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Audio Controls */}
        {story.audioUrl && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
                <h2 className="text-lg font-semibold text-slate-900 whitespace-nowrap">Sesli Okuma</h2>
                <div className="text-sm text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded">
                  {formatTime(currentTime)} / {formatTime(audioDuration)}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={handleSkipBackward}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200 hover:scale-105"
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
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </button>
                <button
                  onClick={handleSkipForward}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200 hover:scale-105"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 lg:max-w-xs">
                <div
                  className="w-full bg-slate-200 rounded-full h-2 cursor-pointer hover:h-3 transition-all duration-200 relative group"
                  onClick={handleProgressClick}
                >
                  <div
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-200 relative"
                    style={{
                      width: `${audioDuration ? (currentTime / audioDuration) * 100 : 0}%`,
                    }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </div>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={story.audioUrl}
              onEnded={handleAudioEnded}
              onLoadedMetadata={handleLoadedMetadata}
            />
          </div>
        )}

        {/* Story Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="space-y-8">
            {/* Title */}
            <div className="text-center">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 w-full text-center border-2 border-dashed border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500"
                  placeholder="Hikaye başlığı"
                />
              ) : (
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{story.title}</h1>
              )}
              <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-6">
                <span>{story.readingTimeMinutes} dk okuma</span>
              </div>
            </div>

            {/* Story Text */}
            <div className="prose prose-lg max-w-none">
              {isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-96 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-base leading-relaxed resize-none"
                  placeholder="Hikaye metnini buraya yazın..."
                />
              ) : (
                <div className="text-lg md:text-xl leading-relaxed text-black whitespace-pre-wrap">{story.content}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
