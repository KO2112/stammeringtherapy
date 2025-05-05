"use client"

import type React from "react"

import { useState, useRef } from "react"
import { sendSupportEmail } from "../../../../lib/resend"
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  User,
  Phone,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Video,
  Headphones,
  CreditCard,
  Settings,
  RefreshCw,
} from "lucide-react"

const supportCategories = [
  { id: "technical", label: "Technical Issue", icon: <Settings className="h-5 w-5" /> },
  { id: "account", label: "Account Help", icon: <User className="h-5 w-5" /> },
  { id: "feature", label: "Feature Request", icon: <FileText className="h-5 w-5" /> },
  { id: "feedback", label: "General Feedback", icon: <MessageSquare className="h-5 w-5" /> },
  { id: "other", label: "Other", icon: <CreditCard className="h-5 w-5" /> }
]

const faqItems = [
  {
    question: "How quickly will I receive a response?",
    answer:
      "We aim to respond to all support inquiries within 24 hours during business days (Monday-Friday). For urgent matters, we prioritize responses and may get back to you sooner.",
  },
  {
    question: "Can I schedule a call with support?",
    answer:
      "Yes, you can request a call in your message and we will arrange a time that works for you. Please include your preferred time slots and timezone to help us schedule efficiently.",
  },
  {
    question: "What information should I include in my support request?",
    answer:
      "Please include as much detail as possible about your issue, including any error messages, steps to reproduce, and what you have already tried. Screenshots or screen recordings can also be very helpful for our team to understand your issue better.",
  },
  {
    question: "Do you offer support in languages other than English?",
    answer:
      "Currently, our primary support language is English. However, we do have team members who speak several other languages and can assist when available. Please mention your preferred language in your request.",
  },
  
]

const resourceLinks = [
  {
    title: "User Guide",
    description: "Complete documentation for using the platform",
    icon: <BookOpen className="h-5 w-5" />,
    url: "#",
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step visual guides for common tasks",
    icon: <Video className="h-5 w-5" />,
    url: "/dashboard/stories",
  },
  {
    title: "Audio Exercises",
    description: "Listen to our recommended practice materials",
    icon: <Headphones className="h-5 w-5" />,
    url: "/dashboard/stories",
  },
  
  
]

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "technical",
    message: "",
    priority: "normal",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate form
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        throw new Error("Please fill out all required fields")
      }

      // Email regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      // Send email using Resend
      await sendSupportEmail({
        name: formData.name,
        email: formData.email,
        category: formData.category,
        message: `
Priority: ${formData.priority}
Phone: ${formData.phone || "Not provided"}

${formData.message}`,
      })

      // Show success message
      setSuccess(true)

      // Scroll to top of form to show success message
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" })
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        category: "technical",
        message: "",
        priority: "normal",
        phone: "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Support Options */}
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-2" id="contact-form">
            <div
              ref={formRef}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="bg-gradient-to-r from-teal-600 to-purple-600 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center">
                  <Send className="h-6 w-6 mr-3" />
                  Contact Support
                </h2>
                <p className="mt-2 text-teal-50">
                  Fill out the form below and our team will get back to you as soon as possible.
                </p>
              </div>

              <div className="p-8">
                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-start animate-in fade-in-0 duration-300">
                    <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-6 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-start animate-in fade-in-0 zoom-in-95 duration-300">
                    <CheckCircle className="h-6 w-6 mr-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Message sent successfully!</h3>
                      <p className="mb-4">
                        Thank you for reaching out. We have received your message and will get back to you as soon as
                        possible.
                      </p>
                      <p className="text-sm">Reference: #{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Phone Number (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                          placeholder="+44 7********"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Include if you would prefer a call back
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="priority"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Priority Level
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      >
                        <option value="low">Low - General Question</option>
                        <option value="normal">Normal - Need Help</option>
                        <option value="high">High - Urgent Issue</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      How can we help you?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {supportCategories.map((category) => (
                        <label
                          key={category.id}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                            formData.category === category.id
                              ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-700"
                              : "border-gray-200 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800"
                          }`}
                        >
                          <input
                            type="radio"
                            name="category"
                            value={category.id}
                            checked={formData.category === category.id}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div
                            className={`mb-2 ${formData.category === category.id ? "text-teal-600 dark:text-teal-400" : "text-gray-500 dark:text-gray-400"}`}
                          >
                            {category.icon}
                          </div>
                          <span
                            className={`text-sm font-medium text-center ${formData.category === category.id ? "text-teal-700 dark:text-teal-300" : "text-gray-700 dark:text-gray-300"}`}
                          >
                            {category.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder="Please describe your issue or question in detail..."
                      required
                    ></textarea>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Please provide as much detail as possible so we can help you more effectively.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Support Info Sidebar */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                Support Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Monday - Friday</span>
                  <span className="font-medium text-gray-900 dark:text-white">9:00 AM - 5:00 PM EST</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Saturday</span>
                  <span className="font-medium text-gray-900 dark:text-white">10:00 AM - 2:00 PM EST</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Sunday</span>
                  <span className="font-medium text-gray-900 dark:text-white">Closed</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Average Response Time:</span> Within 24 hours
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                Check System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></div>
                  <span className="text-gray-700 dark:text-gray-300">All systems operational</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleString()}</p>
                
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Helpful Resources</h3>
              <div className="space-y-4">
                {resourceLinks.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 mr-3">
                      {resource.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{resource.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{resource.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mb-16 scroll-mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about our services, billing, and support process.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    expandedFaq === index ? "max-h-96 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-teal-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-4">Email Us</h3>
              <p className="mb-2 text-teal-100">For general inquiries:</p>
              <a
                href="mailto:info@stammeringtherapy.com"
                className="text-white hover:text-teal-200 transition-colors font-medium"
              >
                info@stammeringtherapy.com
              </a>
              <p className="mt-4 mb-2 text-teal-100">For technical support:</p>
              <a
                href="mailto:support@stammeringtherapy.com"
                className="text-white hover:text-teal-200 transition-colors font-medium"
              >
                info@stammeringtherapy.com
              </a>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Call Us</h3>
              <p className="mb-2 text-teal-100">Support line:</p>
              <a className="text-white hover:text-teal-200 transition-colors font-medium">
                +44 7419208820
              </a>
              <p className="mt-4 mb-2 text-teal-100">Hours of operation:</p>
              <p className="text-white">Monday - Friday, 9 AM - 5 PM EST</p>
            </div>

            <div className="text-center md:text-right">
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <p className="mb-4 text-teal-100">Stay updated with our latest news and tips</p>
              <div className="flex justify-center md:justify-end space-x-4">
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
