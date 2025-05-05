"use client"

import { useState, useRef, useEffect } from "react"
import {
  Play,
  Pause,
  Clock,
  BookOpen,
  Volume2,
  BarChart2,
  Award,
  CheckCircle,
  Download,
  Bookmark,
  BookmarkCheck,
} from "lucide-react"

interface Story {
  id: string
  title: string
  description: string
  audioSrc: string
  imageUrl: string
  level: 1 | 2 | 3
  durationMinutes: number
  completed?: boolean
  bookmarked?: boolean
}

export default function StoriesPage() {
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1)
  const [playingStoryId, setPlayingStoryId] = useState<string | null>(null)
  const [progress, setProgress] = useState<{ [key: string]: number }>({})
  const [bookmarkedStories, setBookmarkedStories] = useState<string[]>([])
  const [completedStories, setCompletedStories] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<"all" | "bookmarked" | "completed">("all")
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({})

  // Sample stories data - replace with actual data from your API/database
  const stories: Story[] = [
    // Level 1
    {
      id: "l1-1",
      title: "The Morning Routine",
      description: "A simple story about morning habits that practices basic breathing techniques.",
      audioSrc: "/stories/level1/morning-routine.mp3",
      imageUrl: "/placeholder.svg?height=300&width=400&text=Morning+Routine",
      level: 1,
      durationMinutes: 3,
    },
    {
      id: "l1-2",
      title: "A Walk in the Park",
      description: "Gentle pacing exercises through a story set in nature.",
      audioSrc: "/stories/level1/walk-in-park.mp3",
      imageUrl: "/placeholder.svg?height=300&width=400&text=Walk+in+Park",
      level: 1,
      durationMinutes: 4,
    },
    {
      id: "l1-3",
      title: "Meeting New Friends",
      description: "Practice introductions and short sentences in social settings.",
      audioSrc: "/stories/level1/meeting-friends.mp3",
      imageUrl: "/placeholder.svg?height=300&width=400&text=Meeting+Friends",
      level: 1,
      durationMinutes: 3,
    },
    // Level 2
    {
      id: "l2-1",
      title: "The Important Interview",
      description: "Navigate challenging professional conversations with confidence.",
      audioSrc: "/stories/level2/important-interview.mp3",
      imageUrl: "/placeholder.svg?height=300&width=400&text=Important+Interview",
      level: 2,
      durationMinutes: 5,
    },
    {
      id: "l2-2",
      title: "Ordering at a Restaurant",
      description: "Practice handling time pressure in common social scenarios.",
      audioSrc: "/stories/level2/restaurant-ordering.mp3",
      imageUrl: "/placeholder.svg?height=300&width=400&text=Restaurant",
      level: 2,
      durationMinutes: 4,
    },
    {
      id: "l2-3",
      title: "The Phone Call",
      description: "Master techniques for clarity and confidence during phone conversations.",
      audioSrc: "/stories/level2/phone-call.mp3",
      imageUrl: "/placeholder.svg?height=300&width=400&text=Phone+Call",
      level: 2,
      durationMinutes: 5,
    },
    // Level 3
    {
      id: "l3-1",
      title: "Public Speaking",
      description: "Advanced techniques for delivering speeches and presentations.",
      audioSrc: "/stories/level3/public-speaking.mp3",
      imageUrl: "/placeholder.svg?height=300&width=400&text=Public+Speaking",
      level: 3,
      durationMinutes: 6,
    },
    {
      id: "l3-2",
      title: "Job Interview",
      description: "Complex conversation scenarios with techniques to manage stress.",
      audioSrc: "/stories/level3/job-interview.mp3",
      imageUrl: "/placeholder.svg?height=300&width=400&text=Job+Interview",
      level: 3,
      durationMinutes: 7,
    },
    {
      id: "l3-3",
      title: "Networking Event",
      description: "Practice fluent conversation in fast-paced social environments.",
      audioSrc: "/stories/level3/networking-event.mp3",
      imageUrl: "/placeholder.svg?height=300&width=400&text=Networking",
      level: 3,
      durationMinutes: 6,
    },
  ]

  // Load saved bookmarks and completed stories from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedStories")
    const savedCompleted = localStorage.getItem("completedStories")

    if (savedBookmarks) {
      setBookmarkedStories(JSON.parse(savedBookmarks))
    }

    if (savedCompleted) {
      setCompletedStories(JSON.parse(savedCompleted))
    }
  }, [])

  // Save bookmarks and completed stories to localStorage when they change
  useEffect(() => {
    localStorage.setItem("bookmarkedStories", JSON.stringify(bookmarkedStories))
  }, [bookmarkedStories])

  useEffect(() => {
    localStorage.setItem("completedStories", JSON.stringify(completedStories))
  }, [completedStories])

  const handlePlayPause = (storyId: string) => {
    if (playingStoryId === storyId) {
      // Pause currently playing story
      audioRefs.current[storyId]?.pause()
      setPlayingStoryId(null)
    } else {
      // Pause any currently playing audio
      if (playingStoryId && audioRefs.current[playingStoryId]) {
        audioRefs.current[playingStoryId]?.pause()
      }

      // Play the new story
      audioRefs.current[storyId]?.play()
      setPlayingStoryId(storyId)
    }
  }

  const handleTimeUpdate = (storyId: string) => {
    const audio = audioRefs.current[storyId]
    if (audio) {
      const progressPercent = (audio.currentTime / audio.duration) * 100
      setProgress((prev) => ({
        ...prev,
        [storyId]: progressPercent,
      }))

      // Mark as completed when reaching 90% of the audio
      if (progressPercent > 90 && !completedStories.includes(storyId)) {
        setCompletedStories((prev) => [...prev, storyId])
      }
    }
  }

  const handleAudioEnded = (storyId: string) => {
    setPlayingStoryId(null)
    setProgress((prev) => ({
      ...prev,
      [storyId]: 0,
    }))

    // Mark as completed
    if (!completedStories.includes(storyId)) {
      setCompletedStories((prev) => [...prev, storyId])
    }
  }

  const toggleBookmark = (storyId: string) => {
    if (bookmarkedStories.includes(storyId)) {
      setBookmarkedStories((prev) => prev.filter((id) => id !== storyId))
    } else {
      setBookmarkedStories((prev) => [...prev, storyId])
    }
  }

  useEffect(() => {
    // Clean up audio elements when component unmounts
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause()
          audio.removeEventListener("timeupdate", () => {})
          audio.removeEventListener("ended", () => {})
        }
      })
    }
  }, [])

  // Filter stories based on level and active filter
  const filteredStories = stories
    .filter((story) => story.level === activeLevel)
    .filter((story) => {
      if (activeFilter === "all") return true
      if (activeFilter === "bookmarked") return bookmarkedStories.includes(story.id)
      if (activeFilter === "completed") return completedStories.includes(story.id)
      return true
    })

  // Calculate progress stats
  const totalStoriesCount = stories.filter((story) => story.level === activeLevel).length
  const completedStoriesCount = stories.filter(
    (story) => story.level === activeLevel && completedStories.includes(story.id),
  ).length
  const progressPercentage = totalStoriesCount > 0 ? Math.round((completedStoriesCount / totalStoriesCount) * 100) : 0

  return (
    <div className="w-full max-w-full h-full">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-10 rounded-2xl shadow-lg mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Practice Stories</h1>
            <p className="mt-2 text-teal-50 max-w-2xl">
              Listen to these stories and practice speaking along with them to improve your fluency. Each level offers
              progressively challenging scenarios.
            </p>
          </div>
          <div className="mt-6 md:mt-0 bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center">
            <div className="mr-4">
              <div className="text-xs text-teal-100 uppercase tracking-wide font-medium mb-1">Your Progress</div>
              <div className="text-2xl font-bold">{progressPercentage}%</div>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercentage}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Tabs */}
      <div className="flex flex-wrap mb-8 border-b border-slate-200">
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level as 1 | 2 | 3)}
            className={`px-6 py-3 text-lg font-medium border-b-2 transition-colors ${
              activeLevel === level
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center">
              
              <span>Level {level}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === "all" ? "bg-teal-100 text-teal-800" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All Stories
        </button>
        <button
          onClick={() => setActiveFilter("bookmarked")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
            activeFilter === "bookmarked"
              ? "bg-amber-100 text-amber-800"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Bookmark className="h-4 w-4 mr-1.5" />
          Bookmarked
        </button>
        <button
          onClick={() => setActiveFilter("completed")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
            activeFilter === "completed"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <CheckCircle className="h-4 w-4 mr-1.5" />
          Completed
        </button>
      </div>

      {/* Stories Grid */}
      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-slate-100"
            >
              {/* Story Image */}
              <div className="relative h-48 w-full bg-slate-100">
                <img
                  src={story.imageUrl || "/placeholder.svg"}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Bookmark button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleBookmark(story.id)
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                  {bookmarkedStories.includes(story.id) ? (
                    <BookmarkCheck className="h-5 w-5 text-amber-500" fill="#f59e0b" />
                  ) : (
                    <Bookmark className="h-5 w-5 text-slate-600" />
                  )}
                </button>

                <div className="absolute bottom-0 left-0 p-4 flex items-center gap-2">
                  <span className="bg-teal-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center">
                    <Award className="h-3.5 w-3.5 mr-1" />
                    Level {story.level}
                  </span>
                  <span className="bg-slate-800/80 text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {story.durationMinutes} min
                  </span>
                  {completedStories.includes(story.id) && (
                    <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Completed
                    </span>
                  )}
                </div>
              </div>

              {/* Story Content */}
              <div className="p-5 flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{story.title}</h3>
                <p className="text-slate-600 mb-4 text-sm">{story.description}</p>

                {/* Audio Player */}
                <div className="mt-auto">
                  <audio
                    ref={(el) => {
                      audioRefs.current[story.id] = el
                    }}
                    src={story.audioSrc}
                    onTimeUpdate={() => handleTimeUpdate(story.id)}
                    onEnded={() => handleAudioEnded(story.id)}
                    preload="metadata"
                  />

                  <div className="flex items-center">
                    <button
                      onClick={() => handlePlayPause(story.id)}
                      className={`flex items-center justify-center h-12 w-12 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                        playingStoryId === story.id
                          ? "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500"
                          : "bg-teal-600 hover:bg-teal-700 focus:ring-teal-500"
                      }`}
                      aria-label={playingStoryId === story.id ? "Pause" : "Play"}
                    >
                      {playingStoryId === story.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>

                    <div className="ml-4 flex-grow">
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            playingStoryId === story.id ? "bg-amber-500" : "bg-teal-600"
                          }`}
                          style={{ width: `${progress[story.id] || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-slate-500">
                        <span>
                          {playingStoryId === story.id ? (
                            <span className="flex items-center text-amber-600">
                              <Volume2 className="h-3 w-3 mr-1" />
                              Playing...
                            </span>
                          ) : (
                            "Click to play"
                          )}
                        </span>
                        <span>{story.durationMinutes}:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center text-xs text-slate-500">
                  <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                  <span>Practice story</span>
                </div>
                <button className="text-teal-600 hover:text-teal-700 flex items-center text-sm font-medium">
                  <Download className="h-4 w-4 mr-1" />
                  <span className="sr-only md:not-sr-only">Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No stories found</h3>
          <p className="text-slate-600 mb-6">
            {activeFilter === "bookmarked"
              ? "You haven't bookmarked any stories at this level yet."
              : activeFilter === "completed"
                ? "You haven't completed any stories at this level yet."
                : "There are no stories available at this level."}
          </p>
          <button
            onClick={() => setActiveFilter("all")}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            View all stories
          </button>
        </div>
      )}

      {/* Practice Tips */}
      <div className="mt-12 bg-teal-50 p-6 rounded-xl border border-teal-100">
        <h3 className="text-xl font-semibold text-teal-800 mb-4 flex items-center">
          <Volume2 className="h-5 w-5 mr-2 text-teal-600" />
          Practice Tips
        </h3>
        <ul className="space-y-3 text-teal-800">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-3">
              <CheckCircle className="h-4 w-4 text-teal-600" />
            </div>
            <span>Listen to the entire story first, then practice speaking along with it</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-3">
              <CheckCircle className="h-4 w-4 text-teal-600" />
            </div>
            <span>Focus on your breathing techniques while reading aloud</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-3">
              <CheckCircle className="h-4 w-4 text-teal-600" />
            </div>
            <span>Record yourself for comparison and to track your progress</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-3">
              <CheckCircle className="h-4 w-4 text-teal-600" />
            </div>
            <span>Practice each story multiple times until you feel comfortable with the pacing</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
