"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Users, Award, Globe, Calendar, MessageSquare, ArrowRight, CheckCircle } from "lucide-react"

interface VisibilityState {
  stats: boolean
  story: boolean
  approach: boolean
  global: boolean
}

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState<VisibilityState>({
    stats: false,
    story: false,
    approach: false,
    global: false,
  })

  const [activeRegion, setActiveRegion] = useState("all")

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
    }

    const observers: IntersectionObserver[] = []

    const createObserver = (id: string, stateName: keyof VisibilityState) => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [stateName]: true }))
            observer.unobserve(entry.target)
          }
        })
      }, observerOptions)

      observer.observe(element)
      observers.push(observer)
    }

    createObserver("stats-section", "stats")
    createObserver("story-section", "story")
    createObserver("approach-section", "approach")
    createObserver("global-section", "global")

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  const regions = [
    { id: "all", name: "All Regions" },
    { id: "eastern", name: "Eastern Europe" },
    { id: "western", name: "Western Europe" },
    { id: "north", name: "North America" },
  ]

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <main className="overflow-hidden">
      {/* Hero Section - Full-width with parallax effect */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Stammering-Therapy-logo.png"
            alt="Stammering Therapy Team"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-blue-800"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              About <span className="text-blue-300">Stammering Therapy</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              A global team of speech therapy specialists dedicated to helping people who stammer achieve fluent,
              confident speech.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/services"
                className="px-8 py-3 bg-white text-blue-800 rounded-full font-medium hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Our Services
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-all duration-300"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Quick Stats - Floating cards that overlap with hero */}
      <section id="stats-section" className="relative z-10 -mt-16 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible.stats ? "visible" : "hidden"}
          >
            <motion.div
              variants={fadeIn}
              className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-500 text-center transform hover:scale-105 transition-transform duration-300"
            >
              <div className="text-4xl font-bold text-blue-600 mb-1">23+</div>
              <p className="text-gray-700 font-medium">Years Experience</p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-500 text-center transform hover:scale-105 transition-transform duration-300"
            >
              <div className="text-4xl font-bold text-blue-600 mb-1">10,000+</div>
              <p className="text-gray-700 font-medium">Clients Helped</p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-500 text-center transform hover:scale-105 transition-transform duration-300"
            >
              <div className="text-4xl font-bold text-blue-600 mb-1">3</div>
              <p className="text-gray-700 font-medium">Global Regions</p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-500 text-center transform hover:scale-105 transition-transform duration-300"
            >
              <div className="text-4xl font-bold text-blue-600 mb-1">100%</div>
              <p className="text-gray-700 font-medium">Evidence-Based</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Story - With decorative elements */}
      <section id="story-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible.story ? "visible" : "hidden"}
          >
            <motion.div variants={fadeIn} className="space-y-6 relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-blue-300 rounded-full"></div>
              <h2 className="text-4xl font-bold text-gray-900 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                  <Users size={24} />
                </span>
                Our Story
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We are a dedicated team of stammering therapy specialists that came together with one goal in mind: to
                make effective stammering therapy accessible to everyone who needs it.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our collaborative effort brings together dozens of Audiology and Speech Disorders Specialists,
                stammering therapists, and speech therapists from Eastern Europe, Western Europe, and North America.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                With over 23 years of combined experience in the field, we have helped more than 10,000 people worldwide
                overcome stammering challenges and gain speech confidence.
              </p>

              <div className="pt-4">
                <Link
                  href="/team"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group"
                >
                  Meet our team
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <div className="absolute -inset-4 bg-blue-100 rounded-3xl transform rotate-3"></div>
              <div className="absolute -inset-4 bg-blue-50 rounded-3xl transform -rotate-3"></div>
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image src="/Stammering-Therapy-logo.png" alt="Stammering Therapy Team" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-4 rounded-xl shadow-lg">
                <p className="font-bold">Founded in 2000</p>
                <p className="text-sm text-blue-100">Helping people find their voice</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Approach - With improved cards */}
      <section id="approach-section" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            animate={isVisible.approach ? "visible" : "hidden"}
          >
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              METHODOLOGY
            </span>
            <h2 className="text-4xl font-bold text-gray-900">Our Approach</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto my-6 rounded-full"></div>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We combine technology with specialized therapy techniques to provide comprehensive support.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible.approach ? "visible" : "hidden"}
          >
            <motion.div
              variants={fadeIn}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="h-48 bg-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h3 className="text-2xl font-bold text-white">E-Stammering App</h3>
                </div>
              </div>

              <div className="p-8">
                <p className="text-gray-700 leading-relaxed">
                  Our innovative digital platform provides evidence-based exercises, personalized techniques, and
                  progress tracking for self-guided therapy. The app makes daily practice convenient and effective.
                </p>

                <ul className="mt-6 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Daily practice exercises</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Progress tracking dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Personalized therapy plan</span>
                  </li>
                </ul>

                <Link
                  href="/signin"
                  className="inline-flex items-center mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Learn more about our app
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="h-48 bg-blue-700 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h3 className="text-2xl font-bold text-white">Private Therapy</h3>
                </div>
              </div>

              <div className="p-8">
                <p className="text-gray-700 leading-relaxed">
                  Our specialists provide personalized one-on-one therapy sessions tailored to your specific stammering
                  challenges. We offer both in-person and remote sessions to accommodate your needs.
                </p>

                <ul className="mt-6 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Personalized therapy plans</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>In-person and remote options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Expert speech therapists</span>
                  </li>
                </ul>

                <Link
                  href="/services"
                  className="inline-flex items-center mt-8 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  View our therapy services
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Global Presence - With map visualization */}
      <section id="global-section" className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeIn}
            initial="hidden"
            animate={isVisible.global ? "visible" : "hidden"}
          >
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              WORLDWIDE
            </span>
            <h2 className="text-4xl font-bold text-gray-900">Our Global Presence</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto my-6 rounded-full"></div>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our specialists come from diverse backgrounds across three regions, bringing together the best practices
              from around the world.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-10"
            variants={fadeIn}
            initial="hidden"
            animate={isVisible.global ? "visible" : "hidden"}
          >
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setActiveRegion(region.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeRegion === region.id
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-blue-600 hover:bg-blue-100 shadow"
                }`}
              >
                {region.name}
              </button>
            ))}
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-2xl shadow-xl relative overflow-hidden"
            variants={fadeIn}
            initial="hidden"
            animate={isVisible.global ? "visible" : "hidden"}
          >
            {/* World map background - stylized */}
            <div className="absolute inset-0 opacity-5">
              <svg viewBox="0 0 1024 512" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M512 0C304 0 96 112 0 288h1024C928 112 720 0 512 0zM0 288h1024v32H0v-32zm0 64h1024v32H0v-32zm0 64h1024v32H0v-32z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div
                  className={`flex flex-col rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${activeRegion === "all" || activeRegion === "eastern" ? "opacity-100 transform scale-100" : "opacity-50 transform scale-95"}`}
                >
                  <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-700 p-6 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-10 w-10 text-white mx-auto mb-2" />
                      <h3 className="text-xl font-bold text-white">Eastern Europe</h3>
                    </div>
                  </div>
                  <div className="bg-white p-6">
                    <p className="text-gray-700 mb-4">
                      Our specialists from Poland, Czech Republic, and Ukraine bring innovative approaches to stammering
                      therapy.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Poland</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Czech Republic</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Ukraine</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex flex-col rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${activeRegion === "all" || activeRegion === "western" ? "opacity-100 transform scale-100" : "opacity-50 transform scale-95"}`}
                >
                  <div className="h-40 bg-gradient-to-br from-blue-600 to-blue-800 p-6 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-10 w-10 text-white mx-auto mb-2" />
                      <h3 className="text-xl font-bold text-white">Western Europe</h3>
                    </div>
                  </div>
                  <div className="bg-white p-6">
                    <p className="text-gray-700 mb-4">
                      Experts from the UK, Germany, and France contribute established methodologies and research.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">United Kingdom</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Germany</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">France</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex flex-col rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${activeRegion === "all" || activeRegion === "north" ? "opacity-100 transform scale-100" : "opacity-50 transform scale-95"}`}
                >
                  <div className="h-40 bg-gradient-to-br from-blue-700 to-blue-900 p-6 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-10 w-10 text-white mx-auto mb-2" />
                      <h3 className="text-xl font-bold text-white">North America</h3>
                    </div>
                  </div>
                  <div className="bg-white p-6">
                    <p className="text-gray-700 mb-4">
                      Our team from the US and Canada brings cutting-edge therapy techniques and technology integration.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">United States</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Canada</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      

      {/* CTA Section - Enhanced with visual elements */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="0.5"></path>
            <path d="M0,0 L100,100 M100,0 L0,100" stroke="white" strokeWidth="0.5"></path>
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Whether you prefer our app-based approach or personalized therapy sessions, our team is here to support you
            every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl bg-white text-blue-700 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Try the App
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl border-2 border-white text-white hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:-translate-y-1"
            >
              <MessageSquare className="w-6 h-6 mr-2" />
              Contact Us
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="flex items-center">
              <Award className="h-6 w-6 text-blue-200 mr-2" />
              <span className="text-blue-100">Certified Specialists</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-6 w-6 text-blue-200 mr-2" />
              <span className="text-blue-100">Global Support</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-blue-200 mr-2" />
              <span className="text-blue-100">Flexible Scheduling</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutPage
