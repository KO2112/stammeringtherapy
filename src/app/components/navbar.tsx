"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronRight, Menu, X, Mic, BookOpen, Users, MessageSquare, Home } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const [isHovered, setIsHovered] = useState(false)

  // Navigation items with icons
  const navItems = [
    { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Services", path: "/services", icon: <Mic className="w-5 h-5" /> },
    { name: "Articles", path: "/articles", icon: <BookOpen className="w-5 h-5" /> },
    { name: "About Us", path: "/about", icon: <Users className="w-5 h-5" /> },
    { name: "Contact Us", path: "/contact", icon: <MessageSquare className="w-5 h-5" /> },
  ]

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Check if a link is active
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-white shadow-lg"
          : isHomePage
            ? "py-4 bg-blue-900/90 backdrop-blur-sm"
            : "py-4 bg-blue-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <div className="relative h-18 w-56">
                <Image
                  src="/StammeringTherapy.png"
                  alt="Stammering Therapy Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <div
              className={`flex items-center rounded-full px-11 py-1 ${isScrolled ? "bg-blue-50" : "bg-blue-800/70"}`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? isScrolled
                        ? "bg-white text-blue-700 shadow-sm"
                        : "bg-blue-700 text-white"
                      : isScrolled
                        ? "text-blue-700 hover:bg-white/80"
                        : "text-white hover:bg-blue-700/50"
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Enhanced App Button */}
            <Link
              href="/signin"
              className={`relative overflow-hidden rounded-full px-6 py-3 font-medium transition-all duration-300 group ${
                isScrolled
                  ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:shadow-xl"
                  : "bg-white text-blue-700 hover:bg-blue-50"
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Animated background effect */}
              <span
                className={`absolute inset-0 w-full h-full ${
                  isScrolled ? "bg-gradient-to-r from-blue-500 to-blue-700" : "bg-blue-100"
                } transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100`}
              ></span>

              {/* Pulse effect */}
              <span
                className={`absolute inset-0 rounded-full ${
                  isScrolled ? "bg-blue-400" : "bg-blue-200"
                } opacity-0 group-hover:animate-pulse`}
              ></span>

              {/* Button content */}
              <span className="flex items-center justify-between relative z-10">
                <span className="mr-2 font-semibold">Stammering Therapy App</span>
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    isScrolled ? "bg-white/30 group-hover:bg-white/50" : "bg-blue-200 group-hover:bg-blue-300"
                  } transition-all duration-300 transform group-hover:translate-x-1`}
                >
                  <ChevronRight className={`w-4 h-4 ${isScrolled ? "text-white" : "text-blue-700"}`} />
                </span>
              </span>

              {/* Shine effect */}
              <span
                className={`absolute top-0 left-0 w-20 h-full bg-white opacity-0 transform rotate-30 translate-x-[-100%] group-hover:translate-x-[200%] group-hover:opacity-20 transition-all duration-1000`}
              ></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-full transition-colors duration-300 ${
                isScrolled ? "bg-blue-100 text-blue-700" : "bg-white/20 text-white"
              }`}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className={`px-4 py-5 space-y-3 ${isScrolled ? "bg-white" : "bg-blue-900"}`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  isActive(item.path)
                    ? isScrolled
                      ? "bg-blue-600 text-white"
                      : "bg-blue-700 text-white"
                    : isScrolled
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "bg-blue-800/60 text-white hover:bg-blue-800"
                }`}
              >
                <div className="flex items-center">
                  <span className={`p-2 rounded-lg mr-3 ${isScrolled ? "bg-blue-100" : "bg-white/20"}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </Link>
            ))}

            {/* Enhanced Mobile App Button */}
            <div className="pt-2">
              <Link
                href="/signin"
                className="relative overflow-hidden flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg group"
              >
                {/* Animated background */}
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-active:opacity-100 transition-opacity duration-300"></span>

                {/* Button content */}
                <span className="font-medium relative z-10">Stammering Therapy App</span>
                <span className="relative z-10 bg-white/20 p-2 rounded-lg transform transition-transform duration-300 group-active:scale-95 group-active:bg-white/30">
                  <ChevronRight className="h-5 w-5" />
                </span>

                {/* Ripple effect */}
                <span className="absolute inset-0 scale-0 rounded-xl bg-white/10 group-active:animate-ripple"></span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
