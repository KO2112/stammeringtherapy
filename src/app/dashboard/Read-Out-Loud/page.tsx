"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Type,
  Minus,
  Plus,
  Clock,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Share2,
  Volume2,
  Play,
  ArrowRight,
  X,
  Save,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react"
import { db } from "../../../../firebase"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  getDoc,
} from "firebase/firestore"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "../../../../firebase"

interface Story {
  id: string
  title: string
  content: string
  
  estimatedMinutes: number
  completed?: boolean
  bookmarked?: boolean
  image?: string
  createdAt?: any
}

interface AdminCheck {
  isAdmin: boolean
  loading: boolean
  error: string | null
}

export default function ReadOutLoudPage() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [adminCheck, setAdminCheck] = useState<AdminCheck>({
    isAdmin: false,
    loading: true,
    error: null,
  })
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null)
  const [fontSize, setFontSize] = useState(18)
  const [bookmarked, setBookmarked] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isPracticing, setIsPracticing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [highlightVowels, setHighlightVowels] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingStory, setEditingStory] = useState<Story | null>(null)
  const [newStoryTitle, setNewStoryTitle] = useState("")
  const [newStoryContent, setNewStoryContent] = useState("")
  const [newStoryMinutes, setNewStoryMinutes] = useState<number>(3)
  
  const [stories, setStories] = useState<Story[]>([])
  const [storiesLoading, setStoriesLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user)
        setAuthLoading(false)
        setAuthError(null)
      },
      (error) => {
        console.error("Auth error:", error)
        setAuthError(error.message)
        setAuthLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  // Check if user is admin
  useEffect(() => {
    const checkAdminRole = async () => {
      if (authLoading) return

      if (!user) {
        setAdminCheck({
          isAdmin: false,
          loading: false,
          error: "User not authenticated",
        })
        return
      }

      try {
        const currentUserDoc = await getDoc(doc(db, "users", user.uid))

        if (!currentUserDoc.exists()) {
          setAdminCheck({
            isAdmin: false,
            loading: false,
            error: "User profile not found",
          })
          return
        }

        const userData = currentUserDoc.data()
        setAdminCheck({
          isAdmin: userData.role === "admin",
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error("Error checking admin role:", error)
        setAdminCheck({
          isAdmin: false,
          loading: false,
          error: "Failed to check user role",
        })
      }
    }

    checkAdminRole()
  }, [user, authLoading])

  // Load stories from Firebase on component mount
  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    try {
      setStoriesLoading(true)
      const storiesRef = collection(db, "stories")
      const q = query(storiesRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      const storiesData: Story[] = []

      querySnapshot.forEach((doc) => {
        storiesData.push({
          id: doc.id,
          ...doc.data(),
        } as Story)
      })

      setStories(storiesData)
    } catch (error) {
      console.error("Error loading stories:", error)
    } finally {
      setStoriesLoading(false)
    }
  }

  const toggleVowelHighlighting = () => {
    setHighlightVowels(!highlightVowels)
  }

  const selectedStory = selectedStoryId ? stories.find((story) => story.id === selectedStoryId) : null

  const handleAddStory = async () => {
    if (!newStoryTitle.trim() || !newStoryContent.trim()) return

    setSaving(true)
    try {
      const storyData = {
        title: newStoryTitle.trim(),
        content: newStoryContent.trim(),
        
        estimatedMinutes: newStoryMinutes,
        createdAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "stories"), storyData)

      // Add to local state immediately
      const newStory: Story = {
        id: docRef.id,
        ...storyData,
        createdAt: new Date(),
      }

      setStories([newStory, ...stories])
      setNewStoryTitle("")
      setNewStoryContent("")
      setNewStoryMinutes(3)
      
      setShowAddModal(false)
    } catch (error) {
      console.error("Error adding story:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleEditStory = (story: Story) => {
    setEditingStory(story)
    setNewStoryTitle(story.title)
    setNewStoryContent(story.content)
    setNewStoryMinutes(story.estimatedMinutes)
    
    setShowAddModal(true)
  }

  const handleUpdateStory = async () => {
    if (!editingStory || !newStoryTitle.trim() || !newStoryContent.trim()) return

    setSaving(true)
    try {
      const storyRef = doc(db, "stories", editingStory.id)
      const updateData = {
        title: newStoryTitle.trim(),
        content: newStoryContent.trim(),
       
        estimatedMinutes: newStoryMinutes,
      }

      await updateDoc(storyRef, updateData)

      // Update local state
      setStories(stories.map((story) => (story.id === editingStory.id ? { ...story, ...updateData } : story)))

      setEditingStory(null)
      setNewStoryTitle("")
      setNewStoryContent("")
      setNewStoryMinutes(3)
      
      setShowAddModal(false)
    } catch (error) {
      console.error("Error updating story:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return

    try {
      await deleteDoc(doc(db, "stories", storyId))
      // Update local state
      setStories(stories.filter((story) => story.id !== storyId))
      if (selectedStoryId === storyId) {
        setSelectedStoryId(null)
      }
    } catch (error) {
      console.error("Error deleting story:", error)
    }
  }

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = newStoryContent.substring(0, start) + "\n\n" + newStoryContent.substring(end)
      setNewStoryContent(newContent)
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  // Reset reading state when changing stories
  const resetReading = () => {
    setCompleted(false)
    setBookmarked(false)
    setIsPracticing(false)
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }

  // Handle story selection
  const handleSelectStory = (storyId: string) => {
    setSelectedStoryId(storyId)
    resetReading()
  }

  // Start practice session
  const startPractice = () => {
    setIsPracticing(true)
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }

  // End practice session
  const endPractice = () => {
    setIsPracticing(false)
    setCompleted(true)
  }

  // Increase font size
  const increaseFontSize = () => {
    if (fontSize < 28) {
      setFontSize(fontSize + 2)
    }
  }

  // Decrease font size
  const decreaseFontSize = () => {
    if (fontSize > 14) {
      setFontSize(fontSize - 2)
    }
  }

  // Toggle bookmarked state
  const toggleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(!showControls)
  }

  

  // Function to render story content with highlighted first vowels
  const renderStoryContent = (content: string) => {
    return content.split("\n\n").map((paragraph, index) => (
      <p key={index} className="mb-6 leading-relaxed">
        {highlightVowels
          ? paragraph.split(" ").map((word, wordIndex) => {
              if (!word) return " "

              const vowelMatch = word.match(/[aeıioöuüAEIİOÖUÜ]/)
              if (!vowelMatch) {
                return <span key={wordIndex}>{word} </span>
              }

              const vowelIndex = vowelMatch.index as number
              const beforeVowel = word.substring(0, vowelIndex)
              const vowel = word[vowelIndex]
              const afterVowel = word.substring(vowelIndex + 1)

              return (
                <span key={wordIndex}>
                  {beforeVowel}
                  <span className="bg-yellow-200 dark:bg-yellow-700 text-black dark:text-white font-medium px-0.5 rounded">
                    {vowel}
                  </span>
                  {afterVowel}{" "}
                </span>
              )
            })
          : paragraph.split(" ").map((word, wordIndex) => <span key={wordIndex}>{word} </span>)}
      </p>
    ))
  }

  if (authLoading || adminCheck.loading || storiesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Authentication error: {authError}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Please log in to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 w-full">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-100 to-purple-100 dark:from-teal-900 dark:to-purple-900 items-center justify-center flex">
              <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-300" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
              Sesli Okuma
            </h1>
          </div>

          
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!selectedStory ? (
          /* Story Selection Grid */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hikaye seçin</h2>
              {adminCheck.isAdmin && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Hikaye Ekle
                </button>
              )}
            </div>

            {adminCheck.error && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> {adminCheck.error}
                </p>
              </div>
            )}

            {stories.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No stories yet</h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {adminCheck.isAdmin
                    ? "Click 'Add Story' to create your first story!"
                    : "Stories will appear here once they're added."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:-translate-y-1 relative group"
                  >
                    {adminCheck.isAdmin && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditStory(story)
                            }}
                            className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                            aria-label="Edit story"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteStory(story.id)
                            }}
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                            aria-label="Delete story"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div onClick={() => handleSelectStory(story.id)}>
                      <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
                        <img
                          src={story.image || "/Stammering-Therapy-logo.png"}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <div className="flex justify-between items-center">
                            
                            <span className="flex items-center text-white text-sm">
                              <Clock className="h-4 w-4 mr-1" />
                              {story.estimatedMinutes} dakika
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{story.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                          {story.content.split("\n")[0]}
                        </p>
                        <button className="flex items-center text-teal-600 dark:text-teal-400 font-medium hover:text-teal-700 dark:hover:text-teal-300">
                          Okumaya Başla <ArrowRight className="ml-1 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Reading View */
          <div className="space-y-6">
            {/* Back to selection button */}
            <button
              onClick={() => setSelectedStoryId(null)}
              className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5 mr-1 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Back to Stories</span>
            </button>

            {/* Story Container */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              {/* Story Header */}
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
                    {selectedStory.title}
                  </h2>
                  <div className="flex items-center space-x-3">
                    
                    <span className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedStory.estimatedMinutes} dakika
                    </span>
                  </div>
                </div>
              </div>

              {/* Reading Controls */}
              {showControls && (
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={decreaseFontSize}
                        className="p-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Decrease font size"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{fontSize}px</span>
                      <button
                        onClick={increaseFontSize}
                        className="p-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Increase font size"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                   

                    <button
                      onClick={toggleVowelHighlighting}
                      className={`flex items-center px-8 py-3 rounded-md text-sm font-medium ${
                        highlightVowels
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                      }`}
                      aria-label={highlightVowels ? "Turn off vowel highlighting" : "Turn on vowel highlighting"}
                    >
                      <span className="flex items-center justify-center">
                        <span className="inline-flex items-center justify-center mr-2.5 text-center font-bold text-xs">
                          <span className={`${highlightVowels ? "bg-purple-200 dark:bg-purple-800 px-1 rounded" : ""}`}>
                            A
                          </span>
                        </span>
                        <span className="leading-none">{highlightVowels ? "Sesli harfleri gizle" : "Sesli harfleri göster"}</span>
                      </span>
                    </button>

                    {!isPracticing && !completed ? (
                      <button
                        onClick={startPractice}
                        className="flex items-center px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors duration-200"
                      >
                        <Play className="h-4 w-4 mr-1.5" />
                        Start Reading Practice
                      </button>
                    ) : isPracticing ? (
                      <button
                        onClick={endPractice}
                        className="flex items-center px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors duration-200"
                      >
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        Finish Practice
                      </button>
                    ) : (
                      <div className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        Completed
                      </div>
                    )}

                    <button
                      className="p-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      aria-label="Share this story"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Story Content */}
              <div
                ref={contentRef}
                className={`p-6 md:p-8 lg:p-10 max-h-[70vh] overflow-y-auto ${isPracticing ? "bg-teal-50/50 dark:bg-teal-900/10" : ""}`}
                style={{ fontSize: `${fontSize}px` }}
              >
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {renderStoryContent(selectedStory.content)}
                </div>
              </div>
            </div>

            {/* Story Navigation */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => {
                  const currentIndex = stories.findIndex((s) => s.id === selectedStory.id)
                  if (currentIndex > 0) {
                    handleSelectStory(stories[currentIndex - 1].id)
                  }
                }}
                disabled={stories.findIndex((s) => s.id === selectedStory.id) === 0}
                className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronLeft className="h-5 w-5 mr-1 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Previous Story</span>
              </button>

              <button
                onClick={() => {
                  const currentIndex = stories.findIndex((s) => s.id === selectedStory.id)
                  if (currentIndex < stories.length - 1) {
                    handleSelectStory(stories[currentIndex + 1].id)
                  }
                }}
                disabled={stories.findIndex((s) => s.id === selectedStory.id) === stories.length - 1}
                className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <span className="text-gray-700 dark:text-gray-300">Next Story</span>
                <ChevronRight className="h-5 w-5 ml-1 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Reading Tips */}
            <div className="mt-8 bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 border border-teal-100 dark:border-teal-900/50">
              <h3 className="text-xl font-semibold text-teal-800 dark:text-teal-300 mb-4 flex items-center">
                <Volume2 className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                Reading Practice Tips
              </h3>
              <ul className="space-y-3 text-teal-800 dark:text-teal-300">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center mr-3">
                    <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span>Read at your own pace - there is no rush</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center mr-3">
                    <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span>Try reading aloud in front of a mirror to observe your speech patterns</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center mr-3">
                    <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span>Record yourself to track progress over time</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center mr-3">
                    <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span>Practice the breathing techniques from your exercises before starting</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Story Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingStory ? "Edit Story" : "Add New Story"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingStory(null)
                  setNewStoryTitle("")
                  setNewStoryContent("")
                  setNewStoryMinutes(3)
                  
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Story Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newStoryTitle}
                  onChange={(e) => setNewStoryTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter story title..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                

                <div>
                  <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estimated Reading Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="minutes"
                    min="1"
                    max="60"
                    value={newStoryMinutes}
                    onChange={(e) => setNewStoryMinutes(Number.parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="3"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Story Content
                </label>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Press Enter to create paragraph breaks. Use Shift+Enter for single line breaks.
                </div>
                <textarea
                  id="content"
                  value={newStoryContent}
                  onChange={(e) => setNewStoryContent(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Enter your story content here. Press Enter to create new paragraphs..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingStory(null)
                    setNewStoryTitle("")
                    setNewStoryContent("")
                    setNewStoryMinutes(3)
                    
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingStory ? handleUpdateStory : handleAddStory}
                  disabled={!newStoryTitle.trim() || !newStoryContent.trim() || saving}
                  className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white rounded-lg transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingStory ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingStory ? "Update Story" : "Save Story"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
