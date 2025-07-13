"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Menu,
  X,
  Mic,
  BookOpen,
  Users,
  MessageSquare,
  Home,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Navigation items with icons - Translated to Turkish
  const navItems = [
    { name: "Ana Sayfa", path: "/", icon: <Home className="w-5 h-5" /> },
    {
      name: "Hizmetler",
      path: "/hizmetlerimiz",
      icon: <Mic className="w-5 h-5" />,
    },
    {
      name: "Makaleler",
      path: "/makaleler",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      name: "Hakkımızda",
      path: "/hakkimizda",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "İletişim",
      path: "/iletisim",
      icon: <MessageSquare className="w-5 h-5" />,
    },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        isMenuOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".menu-button")
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Check if a link is active
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-2 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
            : isHomePage
              ? "py-4 bg-blue-900/90 backdrop-blur-sm"
              : "py-4 bg-blue-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo with Text */}
            <div className="flex-shrink-0 z-10">
              <Link href="/" className="block">
                <div className="flex items-center space-x-3">
                  {/* Logo Image */}
                  <div className="relative h-12 w-12 sm:h-16 sm:w-16">
                    <Image
                      src="/Stammering-Therapy-logo.png"
                      alt="Kekemelik Terapisi Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>

                  {/* Logo Text */}
                  <div
                    className={`text-left leading-tight ${
                      isScrolled ? "text-blue-900" : "text-white"
                    }`}
                  >
                    <div className="text-base sm:text-lg font-bold">
                      Armoni Eğitim Merkezi
                    </div>
                    <div
                      className={`text-sm sm:text-base font-semibold ${
                        isScrolled ? "text-blue-600" : "text-blue-200"
                      }`}
                    >
                      E-Kekemelik
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              <nav
                className={`flex items-center rounded-full px-8 py-2 ${
                  isScrolled
                    ? "bg-blue-50/80 backdrop-blur-sm"
                    : "bg-blue-800/70 backdrop-blur-sm"
                }`}
              >
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative flex items-center px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive(item.path)
                        ? isScrolled
                          ? "bg-white text-blue-700 shadow-md transform scale-105"
                          : "bg-blue-700 text-white shadow-md transform scale-105"
                        : isScrolled
                          ? "text-blue-700 hover:bg-white/60 hover:shadow-sm"
                          : "text-white hover:bg-blue-700/50"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Enhanced App Button */}
              <Link
                href="/signin"
                className={`relative overflow-hidden rounded-full px-6 py-3 font-medium transition-all duration-300 group ml-4 ${
                  isScrolled
                    ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:shadow-xl transform hover:scale-105"
                    : "bg-white text-blue-700 hover:bg-blue-50 transform hover:scale-105"
                }`}
              >
                {/* Animated background effect */}
                <span
                  className={`absolute inset-0 w-full h-full ${
                    isScrolled
                      ? "bg-gradient-to-r from-blue-500 to-blue-700"
                      : "bg-blue-100"
                  } transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100`}
                ></span>

                {/* Button content */}
                <span className="flex items-center justify-between relative z-10">
                  <span className="mr-2 font-semibold">E-Kekemelik</span>
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full ${
                      isScrolled
                        ? "bg-white/30 group-hover:bg-white/50"
                        : "bg-blue-200 group-hover:bg-blue-300"
                    } transition-all duration-300 transform group-hover:translate-x-1`}
                  >
                    <ChevronRight
                      className={`w-4 h-4 ${isScrolled ? "text-white" : "text-blue-700"}`}
                    />
                  </span>
                </span>

                {/* Shine effect */}
                <span className="absolute top-0 left-0 w-20 h-full bg-white opacity-0 transform rotate-30 translate-x-[-100%] group-hover:translate-x-[200%] group-hover:opacity-20 transition-all duration-1000"></span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden z-10">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`menu-button p-2 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-blue-100 text-blue-700"
                    : "bg-white/20 text-white"
                } ${isMenuOpen ? "transform rotate-180" : ""}`}
                aria-expanded={isMenuOpen}
                aria-label="Menüyü aç/kapat"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`mobile-menu lg:hidden fixed inset-x-0 top-full transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div
            className={`mx-4 mt-2 rounded-2xl shadow-2xl overflow-hidden ${
              isScrolled ? "bg-white" : "bg-blue-900"
            }`}
          >
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? isScrolled
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-blue-700 text-white shadow-md"
                      : isScrolled
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : "bg-blue-800/60 text-white hover:bg-blue-800"
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`p-2 rounded-lg mr-3 ${
                        isActive(item.path)
                          ? "bg-white/20"
                          : isScrolled
                            ? "bg-blue-100"
                            : "bg-white/20"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 opacity-50" />
                </Link>
              ))}

              {/* Enhanced Mobile App Button */}
              <div className="pt-4">
                <Link
                  href="/signin"
                  className="relative overflow-hidden flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg group active:shadow-xl"
                >
                  {/* Animated background */}
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-active:opacity-100 transition-opacity duration-300"></span>

                  {/* Button content */}
                  <span className="font-medium relative z-10">E-Kekemelik</span>
                  <span className="relative z-10 bg-white/20 p-2 rounded-lg transform transition-transform duration-300 group-active:scale-95 group-active:bg-white/30">
                    <ChevronRight className="h-5 w-5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
