"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, MessageSquare, Mic, Users, Gauge } from "lucide-react"

export default function StammeringTherapyAppArticle() {
  return (
    <article className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Article header */}
        <div className="mb-8">
          <Link href="/articles" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Stammering-Therapy-App: Transforming Speech, Boosting Confidence
          </h1>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">May 10, 2025</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>6 min read</span>
          </div>

          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Stammering Therapy App"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Article content */}
        <div className="prose prose-lg max-w-none">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Understanding How Our Stammering Therapy App Works
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Stammering can be a challenging communication disorder, but with the right tools and guidance, it can be
              effectively managed. Our Stammering-Therapy-App is designed to provide users with personalized therapy,
              right from their mobile devices. Here how it works.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Mic className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Mouth and Breathing Exercises for Better Control</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Our app offers a range of mouth and breathing exercises designed to enhance speech control. These
              exercises help users strengthen their oral muscles and improve their breathing techniques, making their
              speech more fluent and confident.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Bookmark className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Real-Time Story Tracking and Reading</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              One of the standout features of our app is the ability to track and read stories in real-time. Users can
              select stories and practice reading them aloud, with the app providing feedback to help them improve. This
              feature not only enhances reading fluency but also builds confidence.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Private Sessions with Expert Therapists</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Our Stammering-Therapy-App also provides access to private sessions with highly experienced therapists.
              These therapists offer personalized guidance, helping users identify their unique challenges and develop
              effective strategies to overcome them.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Gauge className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Advanced Techniques: Speech Rate Control and More</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              The app goes beyond basic exercises by teaching advanced techniques such as Speech Rate Control,
              Diaphragmatic Breathing, Oral Motor Control, and Fluency Shaping. These methods are designed to address
              various aspects of stammering, offering a comprehensive therapy experience.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Why Our App is the Perfect Solution for Stammering</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Our Stammering-Therapy-App is not just another speech app. It is a complete therapy solution designed by
              experts, offering real-time feedback, personalized sessions, and advanced techniques. Whether you are a
              beginner or someone looking to improve further, our app has everything you need to achieve fluent,
              confident speech.
            </p>
          </div>
        </div>

        {/* Article footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button className="flex items-center text-gray-500 hover:text-blue-600">
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </button>
              <button className="flex items-center text-gray-500 hover:text-blue-600">
                <Bookmark className="h-5 w-5 mr-2" />
                Save
              </button>
            </div>

            <Link
              href="/e-stammering"
              className="inline-flex items-center px-5 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow hover:shadow-lg"
            >
              Try the App
            </Link>
          </div>
        </div>

        
      </div>
    </article>
  )
}
