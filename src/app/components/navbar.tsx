"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Handle scroll event to detect when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine navbar background style based on page and scroll position
  const navbarBackground = isHomePage && !isScrolled
    ? 'bg-transparent' 
    : 'bg-blue-900 shadow-lg';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBackground}`}>
      {/* Invisible H1 for SEO */}
      <h1 className="sr-only">Stammering Therapy App</h1>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          {/* Logo - Larger size */}
          <div>
            <Link href="/">
              <Image 
                src="/StammeringTherapy.png" 
                alt="Stammering Therapy Logo" 
                width={250} 
                height={60} 
                className="h-20 w-auto" 
                priority
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-white hover:text-blue-300 px-3 py-2 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/services" className="text-white hover:text-blue-300 px-3 py-2 relative group">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/articles" className="text-white hover:text-blue-300 px-3 py-2 relative group">
              Articles
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/about" className="text-white hover:text-blue-300 px-3 py-2 relative group">
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/contact" className="text-white hover:text-blue-300 px-3 py-2 relative group">
              Contact Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="signin" 
              className="text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 
                        px-6 py-3 rounded-lg font-medium transition-all duration-300 
                        transform hover:scale-105 hover:shadow-xl shadow-md
                        border border-blue-400 flex items-center space-x-2"
            >
              <span>E-Stammering App</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-300 focus:outline-none transition-transform duration-200 hover:scale-110"
            >
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {!isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-900 bg-opacity-90 backdrop-blur-sm">
          <div className="px-2 py-4 space-y-2">
            <Link href="/" className="block text-white hover:bg-blue-800 hover:text-blue-200 px-4 py-3 rounded-lg transition-all duration-200">
              Home
            </Link>
            <Link href="/services" className="block text-white hover:bg-blue-800 hover:text-blue-200 px-4 py-3 rounded-lg transition-all duration-200">
              Services
            </Link>
            <Link href="/articles" className="block text-white hover:bg-blue-800 hover:text-blue-200 px-4 py-3 rounded-lg transition-all duration-200">
              Articles
            </Link>
            <Link href="/about" className="block text-white hover:bg-blue-800 hover:text-blue-200 px-4 py-3 rounded-lg transition-all duration-200">
              About Us
            </Link>
            <Link href="/contact" className="block text-white hover:bg-blue-800 hover:text-blue-200 px-4 py-3 rounded-lg transition-all duration-200">
              Contact Us
            </Link>
            <Link 
              href="/e-stammering" 
              className="block text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 px-4 py-3 mt-3 rounded-lg font-medium transition-all duration-200 shadow-md flex items-center space-x-2"
            >
              <span>E-Stammering App</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;