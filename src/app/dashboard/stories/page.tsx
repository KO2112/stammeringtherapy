"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock, BookOpen, BarChart2, CheckCircle, Bookmark, BookmarkCheck, ChevronRight } from "lucide-react"

interface Story {
  id: string
  title: string
  description: string
  level: 1 | 2 | 3 | 4
  readingTimeMinutes: number
  completed?: boolean
  bookmarked?: boolean
}

export default function HikayelerPage() {
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3 | 4>(1)
  const [bookmarkedStories, setBookmarkedStories] = useState<string[]>([])
  const [completedStories, setCompletedStories] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<"all" | "bookmarked" | "completed">("all")

  // Turkish stories data
  const stories: Story[] = [
    // 1. Seviye
    {
      id: "kir-zincilerini",
      title: "Kır Zincilerini",
      description: "Özgürlük ve cesaret hakkında ilham verici bir hikaye. Kendi sınırlarınızı aşmanın gücünü keşfedin.",
      level: 1,
      readingTimeMinutes: 5,
    },
    {
      id: "bir-balikci-hikayesi",
      title: "Bir Balıkçı Hikayesi",
      description: "Sabır ve azmin gücünü anlatan hikaye. Hayatta başarının gerçek anlamını öğrenin.",
      level: 1,
      readingTimeMinutes: 4,
    },
    {
      id: "gurultu",
      title: "Gürültü",
      description: "İç ses ve dış dünya arasındaki dengeyi keşfeden hikaye. Sessizliğin değerini anlayın.",
      level: 1,
      readingTimeMinutes: 3,
    },
    {
      id: "iyi-ornek-olmak",
      title: "İyi Örnek Olmak",
      description: "Rol model olmanın önemini vurgulayan hikaye. Başkalarına ilham vermenin gücü.",
      level: 1,
      readingTimeMinutes: 4,
    },
    {
      id: "ozgur-kuslar",
      title: "Özgür Kuşlar",
      description: "Özgürlük ve doğallık üzerine düşündüren hikaye. Gerçek özgürlüğün ne olduğunu keşfedin.",
      level: 1,
      readingTimeMinutes: 5,
    },
    {
      id: "semsiye-tamircisi",
      title: "Şemsiye Tamircisi",
      description: "Yardımlaşma ve iyilik yapmanın değerini anlatan hikaye. Küçük jestlerin büyük etkisi.",
      level: 1,
      readingTimeMinutes: 6,
    },

    // 2. Seviye
    {
      id: "kim-fark-eder",
      title: "Kim Fark Eder",
      description: "Öz değer ve kendini kabul etme üzerine hikaye. Her bireyin değerli olduğunu hatırlatan hikaye.",
      level: 2,
      readingTimeMinutes: 6,
    },
    {
      id: "zehir",
      title: "Zehir",
      description: "Olumsuz düşüncelerin etkisini anlatan hikaye. Zihinsel sağlığın önemini vurgular.",
      level: 2,
      readingTimeMinutes: 5,
    },
    {
      id: "hemen-mi-olecegim",
      title: "Hemen Mi Öleceğim",
      description: "Kaygı ve korku yönetimi hakkında hikaye. Endişelerin üstesinden gelme yolları.",
      level: 2,
      readingTimeMinutes: 4,
    },
    {
      id: "sirkin-kapisindan-dondugum-gece",
      title: "Sirkin Kapısından Döndüğüm Gece",
      description: "Cesareti bulma ve fırsatları değerlendirme hikayesi. Hayattaki ikinci şanslar.",
      level: 2,
      readingTimeMinutes: 7,
    },
    {
      id: "bambu-agaci",
      title: "Bambu Ağacı",
      description: "Sabır, büyüme ve gelişim sürecini anlatan hikaye. Zamanın iyileştirici gücü.",
      level: 2,
      readingTimeMinutes: 5,
    },
    {
      id: "affetmenin-hafifligi",
      title: "Affetmenin Hafifliği",
      description: "Bağışlama ve iç huzur bulma hikayesi. Affetmenin ruhsal faydaları.",
      level: 2,
      readingTimeMinutes: 6,
    },

    // 3. Seviye
    {
      id: "garson-kiz",
      title: "Garson Kız",
      description: "Empati ve anlayış geliştirme hikayesi. İnsanları yargılamadan anlamanın önemi.",
      level: 3,
      readingTimeMinutes: 8,
    },
    {
      id: "kisilik",
      title: "Kişilik",
      description: "Kimlik ve öz farkındalık üzerine derin hikaye. Gerçek benliğinizi keşfetme yolculuğu.",
      level: 3,
      readingTimeMinutes: 7,
    },
    {
      id: "kavak-agaci-ile-kabak",
      title: "Kavak Ağacı ile Kabak",
      description: "Karşılaştırma ve öz değer hakkında hikaye. Her bireyin kendine özgü değeri.",
      level: 3,
      readingTimeMinutes: 6,
    },
    {
      id: "on-yargi",
      title: "Ön Yargı",
      description: "Önyargıları aşma ve açık fikirlilik hikayesi. Farklılıkları kucaklama.",
      level: 3,
      readingTimeMinutes: 7,
    },
    {
      id: "profesyonel-yardim",
      title: "Profesyonel Yardım",
      description: "Yardım alma ve destek bulma hikayesi. Güçlü olmak için yardım istemenin önemi.",
      level: 3,
      readingTimeMinutes: 8,
    },
    {
      id: "hayallerinizden-vazgecmeyin",
      title: "Hayallerinizden Vazgeçmeyin",
      description: "Hedeflere ulaşma ve azim gösterme hikayesi. Hayallerin gerçekleşme gücü.",
      level: 3,
      readingTimeMinutes: 9,
    },
    {
      id: "zeka-ozurluler-sinifi",
      title: "Zeka Özürlüler Sınıfı",
      description: "Farklılıkları kabul etme ve anlayış geliştirme hikayesi. Herkesin değerli olduğu gerçeği.",
      level: 3,
      readingTimeMinutes: 8,
    },

    // 4. Seviye
    {
      id: "akilli-deli",
      title: "Akıllı Deli",
      description: "Zeka ve bilgelik arasındaki farkı anlatan hikaye. Gerçek zekanın ne olduğunu keşfedin.",
      level: 4,
      readingTimeMinutes: 10,
    },
    {
      id: "elimden-gelen-cabayi-gosterecegim",
      title: "Elimden Gelen Çabayı Göstereceğim",
      description: "Azim ve kararlılık üzerine güçlü hikaye. Başarının sırrı olan sebat.",
      level: 4,
      readingTimeMinutes: 9,
    },
    {
      id: "einstein-ve-soforu",
      title: "Einstein ve Şoförü",
      description: "Bilgi ve deneyim arasındaki dengeyi anlatan hikaye. Farklı zeka türlerinin değeri.",
      level: 4,
      readingTimeMinutes: 8,
    },
    {
      id: "firtina-ciktiginda-uyuyabilirim",
      title: "Fırtına Çıktığında Uyuyabilirim",
      description: "İç huzur ve güven bulma hikayesi. Zorluklara karşı sakin kalmanın sırrı.",
      level: 4,
      readingTimeMinutes: 7,
    },
    {
      id: "bir-hayir-vardir",
      title: "Bir Hayır Vardır",
      description: "Olumlu bakış açısı geliştirme hikayesi. Her zorluğun içindeki fırsatı görme.",
      level: 4,
      readingTimeMinutes: 8,
    },
    {
      id: "stanford-universitesi",
      title: "Stanford Üniversitesi",
      description: "Başarı ve sebat üzerine ilham verici hikaye. Hayallerin peşinden gitmenin gücü.",
      level: 4,
      readingTimeMinutes: 9,
    },
    {
      id: "bagislamanin-yuceligi",
      title: "Bağışlamanın Yüceliği",
      description: "Affetme ve ruhsal gelişim üzerine derin hikaye. Bağışlamanın transformatif gücü.",
      level: 4,
      readingTimeMinutes: 10,
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

  const toggleBookmark = (storyId: string) => {
    if (bookmarkedStories.includes(storyId)) {
      setBookmarkedStories((prev) => prev.filter((id) => id !== storyId))
    } else {
      setBookmarkedStories((prev) => [...prev, storyId])
    }
  }

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

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return "from-emerald-500 to-teal-500"
      case 2:
        return "from-blue-500 to-indigo-500"
      case 3:
        return "from-purple-500 to-pink-500"
      case 4:
        return "from-amber-500 to-orange-500"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  const getLevelBadgeColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-emerald-100 text-emerald-800"
      case 2:
        return "bg-blue-100 text-blue-800"
      case 3:
        return "bg-purple-100 text-purple-800"
      case 4:
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="w-full max-w-full h-full">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-10 rounded-2xl shadow-lg mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Terapi Hikayeleri</h1>
            <p className="mt-2 text-teal-50 max-w-2xl">
              Kekemelik terapisi sürecinizde size rehberlik edecek, ilham verecek ve motivasyon sağlayacak hikayeler.
              Her seviye kendi içinde özenle seçilmiş hikayeler içerir.
            </p>
          </div>
          <div className="mt-6 md:mt-0 bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center">
            <div className="mr-4">
              <div className="text-xs text-teal-100 uppercase tracking-wide font-medium mb-1">İlerlemeniz</div>
              <div className="text-2xl font-bold">%{progressPercentage}</div>
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
        {[1, 2, 3, 4].map((level) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level as 1 | 2 | 3 | 4)}
            className={`px-6 py-3 text-lg font-medium border-b-2 transition-colors ${
              activeLevel === level
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center">
              <span>{level}. Seviye</span>
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
          Tüm Hikayeler
        </button>
        
        
      </div>

      {/* Stories List */}
      {filteredStories.length > 0 ? (
        <div className="space-y-4">
          {filteredStories.map((story, index) => (
            <Link key={story.id} href={`stories/${story.id}`} className="block group">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelBadgeColor(story.level)}`}
                        >
                          {story.level}. Seviye
                        </span>
                        <div className="flex items-center text-slate-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {story.readingTimeMinutes} dk okuma
                        </div>
                        {completedStories.includes(story.id) && (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Tamamlandı
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                        {story.title}
                      </h3>

                      <p className="text-slate-600 text-sm leading-relaxed mb-4">{story.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-slate-500 text-sm">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>Hikaye #{index + 1}</span>
                        </div>
                        <div className="flex items-center text-teal-600 text-sm font-medium group-hover:text-teal-700 transition-colors">
                          <span>Hikayeyi Oku</span>
                          <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col items-end gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleBookmark(story.id)
                        }}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                      >
                        {bookmarkedStories.includes(story.id) ? (
                          <BookmarkCheck className="h-5 w-5 text-amber-500" fill="#f59e0b" />
                        ) : (
                          <Bookmark className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>

                      <div className={`w-1 h-16 rounded-full bg-gradient-to-b ${getLevelColor(story.level)}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Hikaye bulunamadı</h3>
          <p className="text-slate-600 mb-6">
            {activeFilter === "bookmarked"
              ? "Bu seviyede henüz favori hikayeniz yok."
              : activeFilter === "completed"
                ? "Bu seviyede henüz tamamladığınız hikaye yok."
                : "Bu seviyede mevcut hikaye bulunmuyor."}
          </p>
          <button
            onClick={() => setActiveFilter("all")}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Tüm hikayeleri görüntüle
          </button>
        </div>
      )}

      {/* Reading Tips */}
      <div className="mt-12 bg-teal-50 p-6 rounded-xl border border-teal-100">
        <h3 className="text-xl font-semibold text-teal-800 mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-teal-600" />
          Okuma İpuçları
        </h3>
        <ul className="space-y-3 text-teal-800">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-3">
              <CheckCircle className="h-4 w-4 text-teal-600" />
            </div>
            <span>Hikayeyi önce sessizce okuyun, sonra yüksek sesle tekrarlayın</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-3">
              <CheckCircle className="h-4 w-4 text-teal-600" />
            </div>
            <span>Yüksek sesle okurken nefes tekniklerinize odaklanın</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-3">
              <CheckCircle className="h-4 w-4 text-teal-600" />
            </div>
            <span>Zorlandığınız kelimeleri işaretleyin ve tekrar edin</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-3">
              <CheckCircle className="h-4 w-4 text-teal-600" />
            </div>
            <span>Her hikayeyi rahat okuyabilene kadar birkaç kez tekrarlayın</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
