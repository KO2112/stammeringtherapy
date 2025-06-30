"use client"
import { useState, useEffect } from "react"
import { auth, db } from "../../../../firebase"
import { onAuthStateChanged, type User } from "firebase/auth"
import { collection, getDocs, doc, getDoc, query, orderBy, where, Timestamp } from "firebase/firestore"
import { Users, AlertCircle, BookOpen, Search, Trophy, Calendar, RefreshCw } from "lucide-react"

interface StoryVisit {
  id: string
  userId: string
  username: string
  storyName: string
  storyId: string
  visitedAt: Timestamp
}

interface UserStat {
  userId: string
  username: string
  visitCount: number
  stories: string[]
  lastVisited?: Timestamp
}

export default function OgrenciTakipPage() {
  const [userStats, setUserStats] = useState<UserStat[]>([])
  const [filteredStats, setFilteredStats] = useState<UserStat[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // Get user data from Firestore users collection
        const currentUserDoc = await getDoc(doc(db, "users", user.uid))
        if (currentUserDoc.exists() && currentUserDoc.data().role === "admin") {
          setIsAdmin(true)
          await fetchStoryVisits()
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const filtered = userStats.filter((stat) => stat.username.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredStats(filtered)
  }, [userStats, searchTerm])

  const refreshData = async () => {
    setRefreshing(true)
    await fetchStoryVisits()
    setRefreshing(false)
  }

  const fetchStoryVisits = async () => {
    try {
      // Get visits from last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const visitsRef = collection(db, "storyVisits")
      const q = query(
        visitsRef,
        where("visitedAt", ">=", Timestamp.fromDate(thirtyDaysAgo)),
        orderBy("visitedAt", "desc"),
      )

      const querySnapshot = await getDocs(q)
      const visits: StoryVisit[] = []

      querySnapshot.forEach((doc) => {
        visits.push({
          id: doc.id,
          ...doc.data(),
        } as StoryVisit)
      })

      console.log(`📊 Found ${visits.length} visits in last 30 days`)

      // Group visits by user
      const statsMap = new Map<string, UserStat>()

      visits.forEach((visit) => {
        const userId = visit.userId
        const existing = statsMap.get(userId)

        if (existing) {
          existing.visitCount++
          if (!existing.stories.includes(visit.storyName)) {
            existing.stories.push(visit.storyName)
          }
          if (!existing.lastVisited || visit.visitedAt.toDate() > existing.lastVisited.toDate()) {
            existing.lastVisited = visit.visitedAt
          }
        } else {
          statsMap.set(userId, {
            userId,
            username: visit.username,
            visitCount: 1,
            stories: [visit.storyName],
            lastVisited: visit.visitedAt,
          })
        }
      })

      // Convert to array and sort by visit count
      const statsArray = Array.from(statsMap.values()).sort((a, b) => b.visitCount - a.visitCount)

      console.log(`👥 Processed ${statsArray.length} users`)
      setUserStats(statsArray)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching story visits:", error)
      setLoading(false)
    }
  }

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-600">Admin privileges required.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-8 w-8 text-teal-600" />
                <h1 className="text-3xl font-bold text-slate-900">Öğrenci Takip</h1>
              </div>
              <p className="text-slate-600">Son 30 gündeki hikaye ziyaret istatistikleri</p>
            </div>
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
            >
              {refreshing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {refreshing ? "Yenileniyor..." : "Yenile"}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Aktif Öğrenci</p>
                <p className="text-2xl font-bold text-slate-900">{userStats.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-50 rounded-lg">
                <BookOpen className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Toplam Ziyaret</p>
                <p className="text-2xl font-bold text-slate-900">
                  {userStats.reduce((total, stat) => total + stat.visitCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Farklı Hikaye</p>
                <p className="text-2xl font-bold text-slate-900">
                  {new Set(userStats.flatMap((stat) => stat.stories)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Results */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-teal-600" />
                <h2 className="text-xl font-semibold text-slate-900">Ziyaret Sıralaması</h2>
                <span className="bg-teal-100 text-teal-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {filteredStats.length} öğrenci
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Öğrenci ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredStats.length > 0 ? (
              <div className="space-y-4">
                {filteredStats.map((stat, index) => (
                  <div
                    key={stat.userId}
                    className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-800"
                              : index === 1
                                ? "bg-gray-100 text-gray-800"
                                : index === 2
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                          <span className="text-white font-medium text-lg">
                            {stat.username.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900">@{stat.username}</h3>
                            {index < 3 && (
                              <Trophy
                                className={`h-4 w-4 ${
                                  index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-500" : "text-orange-500"
                                }`}
                              />
                            )}
                          </div>
                          <p className="text-sm text-slate-600">
                            {stat.visitCount} hikaye ziyareti • {stat.stories.length} farklı hikaye
                          </p>
                          {stat.lastVisited && (
                            <p className="text-xs text-slate-500 mt-1">Son ziyaret: {formatDate(stat.lastVisited)}</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                        +{stat.visitCount}
                      </div>
                    </div>

                    <div className="mt-4 ml-16">
                      <p className="text-sm font-medium text-slate-700 mb-2">Ziyaret Edilen Hikayeler:</p>
                      <div className="flex flex-wrap gap-2">
                        {stat.stories.map((story, storyIndex) => (
                          <span
                            key={storyIndex}
                            className="bg-white text-slate-700 px-2 py-1 rounded text-xs border border-slate-200"
                          >
                            {story}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Son 30 günde hikaye ziyaret eden öğrenci bulunamadı</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
