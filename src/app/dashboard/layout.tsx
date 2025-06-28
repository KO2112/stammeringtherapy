"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth, db } from "../../../firebase"
import { useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { Home, Wind, BookOpen, Calendar, PenLine, User, LogOut, Menu, X, ChevronRight, HelpCircle, Bell, Speech, ShieldIcon as ShieldUser } from 'lucide-react'

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
      name: "Nefes & Ağız Çalışmaları",
      href: "/dashboard/mouth-and-breathing-exercises",
      icon: <Wind className="h-5 w-5" />,
    },
    {
      name: "Hikayeler",
      href: "/dashboard/stories",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Private Sessions",
      href: "/dashboard/private-sessions",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Günlük",
      href: "/dashboard/diary",
      icon: <PenLine className="h-5 w-5" />,
    },
    {
      name: "Kendin Oku",
      href: "/dashboard/Read-Out-Loud",
      icon: <Speech className="h-5 w-5" />,
    },
    
  ]

  const secondaryNavItems = [
    {
      name: "Profil",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Help & Support",
      href: "/dashboard/support",
      icon: <HelpCircle className="h-5 w-5" />,
    },
    ...(userData?.role === "admin" ? [{
      name: "Admin",
      href: "/dashboard/Admin",
      icon: <ShieldUser className="h-5 w-5" />,
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
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
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
          <span className="text-lg font-bold text-teal-900">E-Kekemelikk</span>
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
          {children}
        </main>
      </div>
    </div>
  )
}