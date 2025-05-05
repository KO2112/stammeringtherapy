"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, CheckCircle, X, Star, Award, MessageSquare, BadgeCheck, CalendarDays } from "lucide-react"

interface Specialist {
  id: string
  name: string
  imageSrc: string
  experience: string
  specialties: string[]
  bio: string
  available: boolean
  nextAvailable?: string
  price: string
  rating?: number
}

export default function PrivateSessions() {
  const [selectedSpecialist, setSelectedSpecialist] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContact: "email",
    message: "",
  })
  const router = useRouter()

  const specialists: Specialist[] = [
    {
      id: "lissandra-kaya",
      name: "Lissandra Kaya",
      imageSrc: "/lissandra.jpg",
      experience: "25+ years of experience",
      specialties: ["Stuttering", "Voice Disorders", "Apraxia of Speech", "Cluttering"],
      bio: "Lissandra is a renowned specialist in speech disorders with over 25 years of clinical experience. She specializes in treating adults and children with severe stuttering and has developed several innovative therapeutic techniques.",
      available: true,
      price: "$85 / 45 minutes",
      rating: 4.9,
    },
    {
      id: "leena-tunca",
      name: "Leena Tunca",
      imageSrc: "/leena.jpg",
      experience: "14 years of experience",
      specialties: ["Fluency Disorders", "Articulation Therapy", "Speech Sound Disorders"],
      bio: "Leena has worked with all age groups from children to adults, focusing on fluency disorders and articulation therapy. Her approach combines traditional techniques with modern technology.",
      available: false,
      nextAvailable: "May 15, 2025",
      price: "$75 / 45 minutes",
      rating: 4.7,
    },
    {
      id: "zoe-celik",
      name: "Zoe Celik",
      imageSrc: "/zoe.jpg",
      experience: "9 years of experience",
      specialties: ["Early Intervention", "Speech Delay", "Phonological Disorders"],
      bio: "Zoe specializes in early intervention strategies for children with speech delays and phonological disorders. She is known for her engaging and playful approach to therapy.",
      available: false,
      nextAvailable: "May 18, 2025",
      price: "$70 / 45 minutes",
      rating: 4.8,
    },
  ]

  const handleSpecialistSelect = (specialistId: string) => {
    setSelectedSpecialist(specialistId)
    // Scroll to booking form
    setTimeout(() => {
      document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBookSession = () => {
    // In a real app, this would save the booking to your database
    alert(`Session request submitted with ${specialists.find((s) => s.id === selectedSpecialist)?.name}`)
    // Reset form and selection
    setFormData({
      name: "",
      email: "",
      phone: "",
      preferredContact: "email",
      message: "",
    })
    setSelectedSpecialist(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl tracking-tight">
            Private Speech Therapy <span className="text-teal-600">Sessions</span>
          </h1>
          
          <div className="mt-8 flex justify-center gap-4">
            <div className="flex items-center text-slate-700">
              <CheckCircle className="h-5 w-5 text-teal-500 mr-2" />
              <span>Personalized approach</span>
            </div>
            <div className="flex items-center text-slate-700">
              <CheckCircle className="h-5 w-5 text-teal-500 mr-2" />
              <span>Expert specialists</span>
            </div>
            <div className="flex items-center text-slate-700">
              <CheckCircle className="h-5 w-5 text-teal-500 mr-2" />
              <span>Flexible scheduling</span>
            </div>
          </div>
        </div>

        {/* Specialists Section */}
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Our Speech Therapy Specialists</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialists.map((specialist) => (
            <div
              key={specialist.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 border ${
                selectedSpecialist === specialist.id
                  ? "border-teal-500 ring-2 ring-teal-500/20"
                  : "border-transparent hover:border-slate-200"
              } ${!specialist.available ? "opacity-85" : ""}`}
            >
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                <div className="absolute top-4 right-4 z-20">
                  {specialist.available ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-1.5"></span>
                      Available Now
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Calendar className="h-3 w-3 mr-1" />
                      Available {specialist.nextAvailable}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 z-20 flex items-center">
                  {specialist.rating && (
                    <div className="flex items-center bg-white/90 px-2 py-1 rounded-md">
                      <Star className="h-3.5 w-3.5 text-amber-500 mr-1" fill="#f59e0b" />
                      <span className="text-xs font-medium text-slate-900">{specialist.rating}</span>
                    </div>
                  )}
                </div>
                <div className="h-full w-full">
                  <img
                    src={specialist.imageSrc || "/placeholder.svg"}
                    alt={specialist.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=400&width=600&text=Image+Not+Found"
                    }}
                  />
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-slate-900">{specialist.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    <Award className="h-3.5 w-3.5 mr-1 text-slate-600" />
                    {specialist.experience}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {specialist.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-teal-50 text-teal-700"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <p className="text-slate-600 mt-3 text-sm line-clamp-3">{specialist.bio}</p>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-slate-500 mr-1.5" />
                      <p className="text-lg font-semibold text-slate-900">{specialist.price}</p>
                    </div>

                    {specialist.available ? (
                      <button
                        onClick={() => handleSpecialistSelect(specialist.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedSpecialist === specialist.id
                            ? "bg-teal-600 text-white"
                            : "bg-teal-500 text-white hover:bg-teal-600"
                        }`}
                      >
                        {selectedSpecialist === specialist.id ? "Selected" : "Select"}
                      </button>
                    ) : (
                      <button
                        className="px-4 py-2 rounded-lg font-medium bg-slate-100 text-slate-500 cursor-not-allowed"
                        disabled
                      >
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Form */}
        {selectedSpecialist && (
          <div id="booking-form" className="mt-16 scroll-mt-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto border border-slate-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center">
                  <div className="bg-teal-100 p-2 rounded-full mr-4">
                    <CalendarDays className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Book Your Session</h2>
                    <p className="text-slate-500">With {specialists.find((s) => s.id === selectedSpecialist)?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSpecialist(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Close booking form"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 text-slate-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-slate-600 text-sm">
                    Fill out the form below to request a session. We'll contact you to confirm availability and finalize
                    your appointment.
                  </p>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full border border-slate-200 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full border border-slate-200 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full border border-slate-200 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="preferredContact" className="block text-sm font-medium text-slate-700 mb-1">
                      Preferred Contact Method
                    </label>
                    <select
                      id="preferredContact"
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleInputChange}
                      className="block w-full border border-slate-200 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      required
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="either">Either</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                    Additional Information
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="block w-full border border-slate-200 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    placeholder="Tell us about your needs or any specific concerns..."
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSpecialist(null)}
                    className="py-2.5 px-5 border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleBookSession}
                    className="py-2.5 px-5 rounded-lg shadow-sm text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors flex items-center justify-center"
                  >
                    <BadgeCheck className="h-4 w-4 mr-1.5" />
                    Request Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Why Choose Us Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Why Choose Our Private Sessions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <BadgeCheck className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Expert Specialists</h3>
              <p className="text-slate-600">
                Our specialists are highly qualified with years of experience in treating various speech disorders.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Personalized Approach</h3>
              <p className="text-slate-600">
                We tailor our therapy sessions to your specific needs, ensuring the most effective treatment for your
                condition.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Flexible Scheduling</h3>
              <p className="text-slate-600">
                We offer flexible appointment times to accommodate your busy schedule and ensure consistent therapy.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">How long are the therapy sessions?</h3>
              <p className="text-slate-600">
                Our standard sessions are 45 minutes long, which we've found to be the optimal duration for effective
                therapy without causing fatigue.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Do you offer online sessions?</h3>
              <p className="text-slate-600">
                Yes, we offer both in-person and online therapy sessions. Online sessions are conducted through a secure
                video platform.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">How many sessions will I need?</h3>
              <p className="text-slate-600">
                The number of sessions varies depending on your specific condition and goals. After an initial
                assessment, your specialist will recommend a treatment plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
