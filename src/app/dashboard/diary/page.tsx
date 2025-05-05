"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { auth, db } from "../../../../firebase"
import { onAuthStateChanged } from "firebase/auth"
import type { User } from "firebase/auth"
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import {
  Calendar,
  PenLine,
  Smile,
  Frown,
  Zap,
  Flame,
  Leaf,
  X,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
} from "lucide-react"

interface DiaryEntry {
  id: string
  title: string
  content: string
  mood: string
  createdAt: Timestamp
}

export default function DiaryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [mood, setMood] = useState("happy")
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = "200px"
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`
    }
  }, [content])

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(user ? true : false)
    })

    return () => unsubscribe()
  }, [])

  // Check user's preferred theme
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("diary-theme") as "light" | "dark" | null
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

      setTheme(savedTheme || (prefersDark ? "dark" : "light"))
    }
  }, [])

  // Apply theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("diary-theme", theme)
    }
  }, [theme])

  // Handle clicks outside calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Show notification
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  // Get date bounds for the selected date
  const getDateBounds = (date: Date) => {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return { startOfDay, endOfDay }
  }

  // Get formatted date for display
  const getFormattedDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Navigate to previous day
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate)
    prevDay.setDate(prevDay.getDate() - 1)
    setSelectedDate(prevDay)
  }

  // Navigate to next day
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)
    setSelectedDate(nextDay)
  }

  // Navigate to today
  const goToToday = () => {
    setSelectedDate(new Date())
  }

  // Fetch diary entries for the selected date
  useEffect(() => {
    if (!user) return

    const fetchEntries = async () => {
      try {
        setLoading(true)
        const { startOfDay, endOfDay } = getDateBounds(selectedDate)

        const entriesQuery = query(
          collection(db, "users", user.uid, "diaryEntries"),
          where("createdAt", ">=", startOfDay),
          where("createdAt", "<=", endOfDay),
          orderBy("createdAt", "desc"),
        )

        const querySnapshot = await getDocs(entriesQuery)
        const entriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as DiaryEntry[]

        setEntries(entriesData)
      } catch (error) {
        console.error("Error fetching entries:", error)
        showNotification("Failed to load diary entries", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [user, selectedDate])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      showNotification("Please sign in to create diary entries", "error")
      return
    }

    if (!title.trim() || !content.trim()) {
      showNotification("Please provide both title and content", "error")
      return
    }

    try {
      if (editingId) {
        // Update existing entry
        await updateDoc(doc(db, "users", user.uid, "diaryEntries", editingId), {
          title,
          content,
          mood,
          updatedAt: serverTimestamp(),
        })

        showNotification("Diary entry updated", "success")
        setEditingId(null)
      } else {
        // Add new entry
        await addDoc(collection(db, "users", user.uid, "diaryEntries"), {
          title,
          content,
          mood,
          createdAt: serverTimestamp(),
        })

        showNotification("New diary entry added", "success")
      }

      // Reset form
      setTitle("")
      setContent("")
      setMood("happy")
      setIsFormVisible(false)

      // Refresh entries
      const { startOfDay, endOfDay } = getDateBounds(selectedDate)

      const entriesQuery = query(
        collection(db, "users", user.uid, "diaryEntries"),
        where("createdAt", ">=", startOfDay),
        where("createdAt", "<=", endOfDay),
        orderBy("createdAt", "desc"),
      )

      const querySnapshot = await getDocs(entriesQuery)
      const entriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DiaryEntry[]

      setEntries(entriesData)
    } catch (error) {
      console.error("Error adding/updating entry:", error)
      showNotification("Failed to save diary entry", "error")
    }
  }

  // Handle edit entry
  const handleEdit = (entry: DiaryEntry) => {
    setTitle(entry.title)
    setContent(entry.content)
    setMood(entry.mood)
    setEditingId(entry.id)
    setIsFormVisible(true)

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Handle delete entry
  const handleDelete = async (id: string) => {
    if (!user) return

    if (!window.confirm("Are you sure you want to delete this entry?")) {
      return
    }

    try {
      await deleteDoc(doc(db, "users", user.uid, "diaryEntries", id))

      setEntries(entries.filter((entry) => entry.id !== id))

      showNotification("Diary entry deleted", "success")

      if (editingId === id) {
        setEditingId(null)
        setTitle("")
        setContent("")
        setMood("happy")
        setIsFormVisible(false)
      }
    } catch (error) {
      console.error("Error deleting entry:", error)
      showNotification("Failed to delete diary entry", "error")
    }
  }

  // Get mood icon
  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "happy":
        return <Smile className="w-5 h-5" />
      case "sad":
        return <Frown className="w-5 h-5" />
      case "excited":
        return <Zap className="w-5 h-5" />
      case "angry":
        return <Flame className="w-5 h-5" />
      case "calm":
        return <Leaf className="w-5 h-5" />
      default:
        return <Smile className="w-5 h-5" />
    }
  }

  // Get mood color
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "happy":
        return "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-200"
      case "sad":
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200"
      case "excited":
        return "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950 dark:border-purple-900 dark:text-purple-200"
      case "angry":
        return "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-200"
      case "calm":
        return "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-200"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200"
    }
  }

  // Get mood button color
  const getMoodButtonColor = (moodValue: string) => {
    const isSelected = mood === moodValue

    switch (moodValue) {
      case "happy":
        return isSelected
          ? "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900 dark:border-amber-700 dark:text-amber-100"
          : "bg-white hover:bg-amber-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
      case "sad":
        return isSelected
          ? "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100"
          : "bg-white hover:bg-blue-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
      case "excited":
        return isSelected
          ? "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-100"
          : "bg-white hover:bg-purple-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
      case "angry":
        return isSelected
          ? "bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-900 dark:border-rose-700 dark:text-rose-100"
          : "bg-white hover:bg-rose-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
      case "calm":
        return isSelected
          ? "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900 dark:border-emerald-700 dark:text-emerald-100"
          : "bg-white hover:bg-emerald-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
      default:
        return isSelected
          ? "bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
    }
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const daysInMonth = lastDayOfMonth.getDate()
    const firstDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday, etc.

    

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      days.push(date)
    }

    return days
  }

  // Format month and year for calendar
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  // Navigate to previous month in calendar
  const goToPreviousMonth = () => {
    const prevMonth = new Date(selectedDate)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setSelectedDate(prevMonth)
  }

  // Navigate to next month in calendar
  const goToNextMonth = () => {
    const nextMonth = new Date(selectedDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setSelectedDate(nextMonth)
  }

  // Check if a date is the selected date
  const isSelectedDate = (date: Date | null) => {
    if (!date) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  // Check if a date is today
  const isTodayDate = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Select a date from the calendar
  const selectDate = (date: Date) => {
    setSelectedDate(date)
    setIsCalendarOpen(false)
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-200"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon className="w-5 h-5 text-gray-800" /> : <Sun className="w-5 h-5 text-white" />}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-white/20 dark:border-gray-700/50 transition-colors duration-300">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-100 to-purple-100 dark:from-teal-900 dark:to-purple-900 rounded-full flex items-center justify-center shadow-inner transition-colors duration-300">
            <PenLine className="h-10 w-10 text-teal-600 dark:text-teal-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
            Welcome to Your Journal
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300">
            Your personal space for reflection, growth, and mindfulness. Sign in to begin your journaling journey.
          </p>
          <div className="flex justify-center">
            <button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
              Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-xl shadow-lg z-50 flex items-center backdrop-blur-sm ${
            notification.type === "success"
              ? "bg-emerald-50/90 border border-emerald-200 text-emerald-800 dark:bg-emerald-900/90 dark:border-emerald-800 dark:text-emerald-100"
              : "bg-rose-50/90 border border-rose-200 text-rose-800 dark:bg-rose-900/90 dark:border-rose-800 dark:text-rose-100"
          } max-w-md transition-all duration-300 animate-in slide-in-from-right-5`}
        >
          <div className="mr-3 flex-shrink-0">
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-500 dark:text-rose-300" />
            )}
          </div>
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}

      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex h-10 w-10 rounded-full bg-gradient-to-br from-teal-100 to-purple-100 dark:from-teal-900 dark:to-purple-900 items-center justify-center">
              <PenLine className="h-5 w-5 text-teal-600 dark:text-teal-300" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
              My Journal
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{getFormattedDate(selectedDate)}</span>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon className="w-5 h-5 text-gray-800" /> : <Sun className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Date Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={goToPreviousDay}
              className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors duration-200"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <CalendarIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-medium text-gray-800 dark:text-white">
                  {isToday(selectedDate) ? "Today" : getFormattedDate(selectedDate)}
                </span>
              </button>

              {isCalendarOpen && (
                <div
                  ref={calendarRef}
                  className="absolute mt-2 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20 w-72"
                >
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={goToPreviousMonth}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <h3 className="font-medium text-gray-800 dark:text-white">{formatMonthYear(selectedDate)}</h3>
                    <button
                      onClick={goToNextMonth}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays().map((date, index) => (
                      <div key={index} className="aspect-square">
                        {date ? (
                          <button
                            onClick={() => selectDate(date)}
                            className={`w-full h-full flex items-center justify-center text-sm rounded-full transition-colors duration-200 ${
                              isSelectedDate(date)
                                ? "bg-teal-500 text-white"
                                : isTodayDate(date)
                                  ? "bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        ) : (
                          <div className="w-full h-full"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={goToToday}
                      className="w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-800 dark:text-white transition-colors duration-200"
                    >
                      Today
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={goToNextDay}
              className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors duration-200"
              aria-label="Next day"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Add new entry button */}
        {!isFormVisible && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsFormVisible(true)}
              className="flex items-center bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Journal Entry
            </button>
          </div>
        )}

        {/* Form */}
        {isFormVisible && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-10 border border-gray-100 dark:border-gray-700 transition-colors duration-300 animate-in fade-in-0 zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                {editingId ? "Edit Journal Entry" : "New Journal Entry"}
              </h2>
              <button
                onClick={() => {
                  setIsFormVisible(false)
                  if (editingId) {
                    setEditingId(null)
                    setTitle("")
                    setContent("")
                    setMood("happy")
                  }
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                aria-label="Close form"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
                  placeholder="What's on your mind today?"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300"
                >
                  Your Thoughts
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300 min-h-[200px] resize-y"
                  placeholder="Write freely about your day, thoughts, feelings, or anything you'd like to remember..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
                  How are you feeling?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { value: "happy", label: "Happy", icon: <Smile className="w-4 h-4" /> },
                    { value: "sad", label: "Sad", icon: <Frown className="w-4 h-4" /> },
                    { value: "excited", label: "Excited", icon: <Zap className="w-4 h-4" /> },
                    { value: "angry", label: "Angry", icon: <Flame className="w-4 h-4" /> },
                    { value: "calm", label: "Calm", icon: <Leaf className="w-4 h-4" /> },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center justify-center px-4 py-3 rounded-xl cursor-pointer border-2 transition-all duration-200 ${getMoodButtonColor(option.value)}`}
                    >
                      <input
                        type="radio"
                        name="mood"
                        value={option.value}
                        checked={mood === option.value}
                        onChange={() => setMood(option.value)}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
                        {option.icon}
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormVisible(false)
                    if (editingId) {
                      setEditingId(null)
                      setTitle("")
                      setContent("")
                      setMood("happy")
                    }
                  }}
                  className="px-5 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white rounded-xl shadow transition-all duration-300 hover:shadow-md"
                >
                  {editingId ? "Update Entry" : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Entries Section */}
        <div className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
              {isToday(selectedDate) ? "Today's Journal" : `Journal for ${getFormattedDate(selectedDate)}`}
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center transition-colors duration-300">
              <span className="hidden sm:inline mr-2">Sort by:</span>
              <button className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <span>Newest</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="relative">
                <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200 dark:border-gray-700"></div>
                <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-teal-500 border-t-transparent"></div>
              </div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-100 to-purple-100 dark:from-teal-900 dark:to-purple-900 rounded-full flex items-center justify-center transition-colors duration-300">
                <PenLine className="h-10 w-10 text-teal-600 dark:text-teal-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 transition-colors duration-300">
                {isToday(selectedDate) ? "Your journal awaits" : "No entries for this day"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto transition-colors duration-300">
                {isToday(selectedDate)
                  ? "Capture your thoughts, feelings, and experiences. Start your journaling practice today."
                  : "Select a different date or create a new entry for this day."}
              </p>
              <button
                onClick={() => setIsFormVisible(true)}
                className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                {isToday(selectedDate) ? "Write Your First Entry" : "Create Entry for This Day"}
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`rounded-xl p-6 border-l-4 shadow-md transition-all duration-300 hover:shadow-lg ${getMoodColor(entry.mood)}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold line-clamp-2">{entry.title}</h3>
                    <div className="flex-shrink-0 ml-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 shadow-sm">
                        {getMoodIcon(entry.mood)}
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none mb-4 dark:prose-invert">
                    <p className="line-clamp-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap transition-colors duration-300">
                      {entry.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <span className="text-xs">
                      {entry.createdAt?.toDate ? formatDate(entry.createdAt.toDate()) : "Just now"}
                    </span>

                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="p-2 rounded-md hover:bg-white hover:bg-opacity-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        aria-label="Edit entry"
                        title="Edit entry"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 rounded-md hover:bg-white hover:bg-opacity-50 dark:hover:bg-gray-700 transition-colors duration-200 text-rose-500 dark:text-rose-400"
                        aria-label="Delete entry"
                        title="Delete entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
