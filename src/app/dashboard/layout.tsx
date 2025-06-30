"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth, db } from "../../../firebase"
import { useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { Home, Wind, BookOpen, User, LogOut, Menu, X, ChevronRight, Speech, ShieldIcon as ShieldUser, Newspaper, MessagesSquare,
  ChartColumnIncreasing
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

interface UserData {
  firstName?: string
  lastName?: string
  email?: string
  photoURL?: string
  location?: string
  role?: string
}

export default function DashboardLayout({ children }: LayoutProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      try {
        const userDocRef = doc(db, "users", userId)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          return userDoc.data() as UserData
        }
        return null
      } catch (error) {
        console.error("Error fetching user data:", error)
        return null
      }
    }

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // First set basic user data from auth
        const basicUserData = {
          email: user.email || "",
          photoURL: user.photoURL || "",
        }

        setUserData(basicUserData)

        // Then fetch additional user data from Firestore
        const firestoreData = await fetchUserData(user.uid)
        if (firestoreData) {
          setUserData({
            ...basicUserData,
            ...firestoreData,
          })
        }
      } else {
        // If not logged in, redirect to sign in page
        router.push("/signin")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/signin")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const getDisplayName = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`
    } else if (userData?.firstName) {
      return userData.firstName
    } else if (userData?.email) {
      return userData.email.split("@")[0]
    }
    return "User"
  }

  const getInitials = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase()
    } else if (userData?.firstName) {
      return userData.firstName.charAt(0).toUpperCase()
    } else if (userData?.email) {
      return userData.email.charAt(0).toUpperCase()
    }
    return "?"
  }

  const navigationItems = [
    {
      name: "Anasayfa",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Hikayeler",
      href: "/dashboard/stories",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Nefes & Ağız Çalışmaları",
      href: "/dashboard/mouth-and-breathing-exercises",
      icon: <Wind className="h-5 w-5" />,
    },
    {
      name: "Kendin Oku",
      href: "/dashboard/Read-Out-Loud",
      icon: <Speech className="h-5 w-5" />,
    },
    {
      name: "Armoni Haberler",
      href: "/dashboard/armoni-haberler",
      icon: <Newspaper className="h-5 w-5" />,
    },
    {
      name: "Sohbet",
      href: "/dashboard/sohbet",
      icon: <MessagesSquare className="h-5 w-5" />,
    },
    
  ]

  const secondaryNavItems = [
    {
      name: "Profil",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
    
    ...(userData?.role === "admin" ? [{
      name: "Admin",
      href: "/dashboard/Admin",
      icon: <ShieldUser className="h-5 w-5" />,
    }] : []),
    ...(userData?.role === "admin" ? [{
      name: "Öğrenci Takip",
      href: "/dashboard/ogrenci-takip",
      icon: <ChartColumnIncreasing className="h-5 w-5" />,
    }] : []),
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - Fixed position and height */}
      <aside
        className={`${
          isSidebarCollapsed ? "w-20" : "w-72"
        } bg-white shadow-lg fixed h-screen flex flex-col z-30 transition-all duration-300 ease-in-out transform ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo section */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10">
              <img src="/Stammering-Therapy-logo.png" alt="FluentVoice Logo" className="h-10 w-auto" />
            </div>
            {!isSidebarCollapsed && (
              <span className="ml-0 text-xl font-bold text-teal-900 whitespace-nowrap">E-Kekemelik</span>
            )}
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-slate-400 hover:text-slate-600 hidden lg:block"
            >
              <ChevronRight
                className={`h-5 w-5 transition-transform duration-300 ${isSidebarCollapsed ? "rotate-180" : ""}`}
              />
            </button>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="text-slate-400 hover:text-slate-600 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Links - Make scrollable if needed */}
        <nav className="mt-6 flex-grow px-4 overflow-y-auto">
          <div className="space-y-1.5">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-xl transition-colors ${
                  isActive(item.href)
                    ? "bg-teal-50 text-teal-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-teal-600"
                } ${isSidebarCollapsed ? "justify-center" : ""}`}
              >
                <span className={`${isActive(item.href) ? "text-teal-600" : "text-slate-400"}`}>{item.icon}</span>
                {!isSidebarCollapsed && <span className="ml-3">{item.name}</span>}
                {!isSidebarCollapsed && isActive(item.href) && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-teal-500"></span>
                )}
              </Link>
            ))}
          </div>

          <div className="mt-10 mb-4">
            {!isSidebarCollapsed && (
              <p className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Account</p>
            )}
            <div className="mt-3 space-y-1.5">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-xl transition-colors ${
                    isActive(item.href)
                      ? "bg-teal-50 text-teal-700 font-medium"
                      : "text-slate-600 hover:bg-slate-50 hover:text-teal-600"
                  } ${isSidebarCollapsed ? "justify-center" : ""}`}
                >
                  <span className={`${isActive(item.href) ? "text-teal-600" : "text-slate-400"}`}>{item.icon}</span>
                  {!isSidebarCollapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Profile section - Fixed at bottom */}
        <div className={`p-4 border-t border-slate-200 mt-auto ${isSidebarCollapsed ? "flex justify-center" : ""}`}>
          {isSidebarCollapsed ? (
            <div className="relative cursor-pointer">
              {userData?.photoURL ? (
                <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img
                    src={userData.photoURL || "/placeholder.svg"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-medium text-sm">{getInitials()}</span>
                </div>
              )}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  {userData?.photoURL ? (
                    <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <img
                        src={userData.photoURL || "/placeholder.svg"}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
                      <span className="text-white font-medium text-base">{getInitials()}</span>
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{getDisplayName()}</p>
                  <p className="text-xs text-slate-500 truncate">{userData?.location || "Active now"}</p>
                </div>
                
              </div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-xl text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Mobile header with menu button */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-10 flex items-center justify-between px-4 lg:hidden">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-3">
          <img src="/Stammering-Therapy-logo.png" alt="FluentVoice Logo" className="h-8 w-auto" />
          <span className="text-lg font-bold text-teal-900">E-Kekemelik</span>
        </div>
        <div className="relative">
          {userData?.photoURL ? (
            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src={userData.photoURL || "/placeholder.svg"} alt="Profile" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-medium text-sm">{getInitials()}</span>
            </div>
          )}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
        </div>
      </div>

      {/* Main content area - Add left margin to account for fixed sidebar */}
<div
  className={`flex-1 flex flex-col ${
    isSidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
  } transition-all duration-300 ease-in-out pt-16 lg:pt-0`}
>
  {/* Page content */}
  <main className={`flex-1 overflow-y-auto ${pathname === "/dashboard" ? "p-0" : "py-0 px-4 sm:px-6 lg:px-1"}`}>
    {pathname === "/dashboard" && (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
              Armoni Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Okuma becerilerinizi geliştirmek için tüm araçlara buradan erişebilirsiniz
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Hikayeler */}
            <a href="/dashboard/stories" className="group block">
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-3 transition-colors duration-300">
                    Hikayeler
                  </h3>
                  <p className="text-gray-600 group-hover:text-blue-100 transition-colors duration-300 leading-relaxed">
                    İlgi çekici hikayelerle okuma becerilerinizi geliştirin ve kelime dağarcığınızı genişletin
                  </p>
                  <div className="mt-6 flex items-center text-blue-600 group-hover:text-white transition-colors duration-300">
                    <span className="font-semibold">Keşfet</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>

            {/* Nefes ve Ağız Çalışmaları */}
            <a href="/dashboard/mouth-and-breathing-exercises" className="group block">
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-3 transition-colors duration-300">
                    Nefes ve Ağız Çalışmaları
                  </h3>
                  <p className="text-gray-600 group-hover:text-emerald-100 transition-colors duration-300 leading-relaxed">
                    Doğru nefes ve ağız egzersizleriyle konuşmanızı geliştirin.
                  </p>
                  <div className="mt-6 flex items-center text-emerald-600 group-hover:text-white transition-colors duration-300">
                    <span className="font-semibold">Başla</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>

            {/* Kendin Oku */}
            <a href="/dashboard/Read-Out-Loud" className="group block">
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 6h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-3 transition-colors duration-300">
                    Kendin Oku
                  </h3>
                  <p className="text-gray-600 group-hover:text-purple-100 transition-colors duration-300 leading-relaxed">
                    Sesli okuma pratiği yaparak telaffuz ve akıcılığınızı geliştirin, özgüveninizi artırın
                  </p>
                  <div className="mt-6 flex items-center text-purple-600 group-hover:text-white transition-colors duration-300">
                    <span className="font-semibold">Oku</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>

            {/* Armoni Haberler */}
            <a href="/dashboard/armoni-haberler" className="group block">
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H16" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-3 transition-colors duration-300">
                    Armoni Haberler
                  </h3>
                  <p className="text-gray-600 group-hover:text-orange-100 transition-colors duration-300 leading-relaxed">
                    Güncel haberler, duyurular ve topluluk gelişmeleri hakkında bilgi alın
                  </p>
                  <div className="mt-6 flex items-center text-orange-600 group-hover:text-white transition-colors duration-300">
                    <span className="font-semibold">Gör</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>

            {/* Sohbet */}
            <a href="/dashboard/sohbet" className="group block sm:col-span-2 lg:col-span-1">
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-3 transition-colors duration-300">
                    Sohbet
                  </h3>
                  <p className="text-gray-600 group-hover:text-teal-100 transition-colors duration-300 leading-relaxed">
                    Toplulukla iletişim kurun, deneyimlerinizi paylaşın ve birlikte öğrenin
                  </p>
                  <div className="mt-6 flex items-center text-teal-600 group-hover:text-white transition-colors duration-300">
                    <span className="font-semibold">Katıl</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    )}
    {children}
  </main>
</div>
    </div>
  )
}