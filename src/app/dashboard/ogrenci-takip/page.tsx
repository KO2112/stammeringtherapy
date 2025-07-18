"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../../../../firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  where,
  Timestamp,
  limit,
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";
import {
  Users,
  AlertCircle,
  BookOpen,
  Search,
  Trophy,
  RefreshCw,
} from "lucide-react";

interface StoryVisit {
  id: string;
  userId: string;
  username: string;
  storyName: string;
  storyId: string;
  visitedAt: Timestamp;
}

interface UserStat {
  userId: string;
  username: string;
  visitCount: number;
  stories: string[];
  lastVisited?: Timestamp;
}

// Enable Firestore local cache (optional, safe to call multiple times)
try {
  initializeFirestore(db.app, { localCache: persistentLocalCache() });
} catch {
  // Already initialized, ignore
}

export default function OgrenciTakipPage() {
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [filteredStats, setFilteredStats] = useState<UserStat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [page, setPage] = useState(0); // For pagination
  const USERS_PER_PAGE = 5;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const currentUserDoc = await getDoc(doc(db, "users", user.uid));
        if (currentUserDoc.exists() && currentUserDoc.data().role === "admin") {
          setIsAdmin(true);
          await fetchStoryVisits();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = userStats.filter((stat) =>
      stat.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStats(filtered);
    setPage(0); // Reset to first page on search
  }, [userStats, searchTerm]);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchStoryVisits();
    setRefreshing(false);
  };

  // Only fetch visits, not all users (reduce reads)
  const fetchStoryVisits = async () => {
    try {
      console.log("📊 Fetching story visits...");
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const visitsRef = collection(db, "storyVisits");
      const q = query(
        visitsRef,
        where("visitedAt", ">=", Timestamp.fromDate(thirtyDaysAgo)),
        orderBy("visitedAt", "desc"),
        limit(1000) // Limit to 1000 reads
      );
      const querySnapshot = await getDocs(q);
      const visits: StoryVisit[] = [];
      querySnapshot.forEach((doc) => {
        visits.push({
          id: doc.id,
          ...doc.data(),
        } as StoryVisit);
      });
      console.log(`📊 Found ${visits.length} visits in last 30 days`);
      // Group visits by userId (no need to check users collection)
      const statsMap = new Map<string, UserStat>();
      visits.forEach((visit) => {
        const userId = visit.userId;
        const existing = statsMap.get(userId);
        if (existing) {
          existing.visitCount++;
          if (!existing.stories.includes(visit.storyName)) {
            existing.stories.push(visit.storyName);
          }
          if (
            !existing.lastVisited ||
            visit.visitedAt.toDate() > existing.lastVisited.toDate()
          ) {
            existing.lastVisited = visit.visitedAt;
          }
        } else {
          statsMap.set(userId, {
            userId,
            username: visit.username || "(silinmiş)",
            visitCount: 1,
            stories: [visit.storyName],
            lastVisited: visit.visitedAt,
          });
        }
      });
      const statsArray = Array.from(statsMap.values()).sort(
        (a, b) => b.visitCount - a.visitCount
      );
      setUserStats(statsArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching story visits:", error);
      setLoading(false);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600">Admin privileges required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-teal-600" />
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Öğrenci Takip
                </h1>
              </div>
              <p className="text-sm md:text-base text-slate-600">
                Son 30 gündeki hikaye ziyaret istatistikleri (sadece aktif
                kullanıcılar)
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-3 py-2 md:px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 text-sm md:text-base"
            >
              {refreshing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {refreshing ? "Yenileniyor..." : "Yenile"}
              </span>
              <span className="sm:hidden">{refreshing ? "..." : "↻"}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-slate-600">
                  Aktif Öğrenci
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">
                  {userStats.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Results */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 md:p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 md:h-6 md:w-6 text-teal-600" />
                <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                  Ziyaret Sıralaması
                </h2>
                <span className="bg-teal-100 text-teal-800 text-xs md:text-sm font-medium px-2 py-1 md:px-2.5 md:py-0.5 rounded-full">
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
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-64 text-sm md:text-base"
                />
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            {filteredStats.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {filteredStats
                  .slice(page * USERS_PER_PAGE, (page + 1) * USERS_PER_PAGE)
                  .map((stat, index) => (
                    <div
                      key={stat.userId}
                      className="bg-slate-50 rounded-lg p-4 md:p-6 border border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div
                            className={`flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full text-xs md:text-sm font-bold ${
                              index === 0 && page === 0
                                ? "bg-yellow-100 text-yellow-800"
                                : index === 1 && page === 0
                                  ? "bg-gray-100 text-gray-800"
                                  : index === 2 && page === 0
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {page * USERS_PER_PAGE + index + 1}
                          </div>
                          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm md:text-lg">
                              {stat.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-slate-900 text-sm md:text-base">
                                @{stat.username}
                              </h3>
                              {index < 3 && page === 0 && (
                                <Trophy
                                  className={`h-3 w-3 md:h-4 md:w-4 ${
                                    index === 0
                                      ? "text-yellow-500"
                                      : index === 1
                                        ? "text-gray-500"
                                        : "text-orange-500"
                                  }`}
                                />
                              )}
                            </div>
                            {/* Removed hikaye ziyareti and farkli hikaye */}
                            {stat.lastVisited && (
                              <p className="text-xs text-slate-500 mt-1">
                                Son ziyaret: {formatDate(stat.lastVisited)}
                              </p>
                            )}
                          </div>
                        </div>
                        {/* Removed +{stat.visitCount} badge */}
                      </div>
                      <div className="mt-3 md:mt-4 ml-12 md:ml-16">
                        <p className="text-xs md:text-sm font-medium text-slate-700 mb-2">
                          Ziyaret Edilen Hikayeler:
                        </p>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {stat.stories
                            .slice(-3)
                            .reverse()
                            .map((story, storyIndex) => (
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
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-3 py-1 rounded bg-slate-200 text-slate-700 disabled:opacity-50"
                  >
                    Önceki
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={
                      (page + 1) * USERS_PER_PAGE >= filteredStats.length
                    }
                    className="px-3 py-1 rounded bg-teal-600 text-white disabled:opacity-50"
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 font-medium text-sm md:text-base">
                  Son 30 günde hikaye ziyaret eden aktif öğrenci bulunamadı
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
