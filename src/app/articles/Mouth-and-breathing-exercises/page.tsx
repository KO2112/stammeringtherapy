"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  Calendar,
  Wind,
  TreesIcon as Lungs,
  List,
  Activity,
  Repeat,
  CheckCircle,
} from "lucide-react"

export default function MouthAndBreathingExercisesArticle() {
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
            Breathing and Mouth Exercises for Stammering
          </h1>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">May 10, 2025</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>5 min read</span>
          </div>

          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Breathing and Mouth Exercises"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Article content */}
        <div className="prose prose-lg max-w-none">
          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Wind className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Understanding the Importance of Breathing</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Breathing is a fundamental part of life, but many of us take it for granted. Proper breathing not only
              supports our bodys functions but also plays a critical role in managing stress, anxiety, and even speech
              fluency. For those who struggle with stammering, learning how to breathe correctly can be transformative.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Lungs className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">What is Diaphragmatic Breathing?</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Diaphragmatic breathing, also known as belly breathing, is a technique that uses the diaphragm muscle
              located below the lungs. Unlike shallow chest breathing, which only fills a small portion of the lungs,
              diaphragmatic breathing allows for full oxygen exchange. This type of breathing calms the nervous system,
              reduces stress, and supports better control of speech.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <List className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How to Practice Diaphragmatic Breathing</h2>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    1
                  </div>
                  <span className="text-gray-700">Sit or lie down comfortably.</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    2
                  </div>
                  <span className="text-gray-700">Place one hand on your chest and the other on your abdomen.</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    3
                  </div>
                  <span className="text-gray-700">
                    Breathe in slowly through your nose, ensuring your abdomen rises while your chest stays still.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    4
                  </div>
                  <span className="text-gray-700">Exhale slowly through your mouth, feeling your abdomen fall.</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    5
                  </div>
                  <span className="text-gray-700">Repeat this process for several minutes daily.</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">The Role of Mouth Exercises in Stammering</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Mouth exercises help strengthen the muscles involved in speech. Regular practice can improve muscle
              coordination, making it easier to pronounce words clearly and fluently. These exercises also increase
              awareness of mouth movements, which is crucial for those who stammer.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <List className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Effective Mouth Exercises</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Lip Trills</h3>
                <p className="text-gray-700 text-sm">
                  Press your lips together and blow air to create a vibrating sound. This helps relax the lips and
                  improves airflow control.
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Tongue Stretches</h3>
                <p className="text-gray-700 text-sm">
                  Stick your tongue out, move it up, down, and side to side. This enhances tongue flexibility.
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Vowel Repetitions</h3>
                <p className="text-gray-700 text-sm">
                  Slowly pronounce vowel sounds (A, E, I, O, U), focusing on clear articulation.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Repeat className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Combining Breathing and Mouth Exercises</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              For those who stammer, using both breathing and mouth exercises can lead to significant improvements. The
              combination helps maintain calmness while speaking, reduces tension, and improves overall speech control.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Why Consistency is Key</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Success with breathing and mouth exercises comes from consistency. Practicing these techniques daily, even
              for a few minutes, can gradually retrain your body and mind to speak more fluently. Setting a routine and
              tracking your progress can motivate you to continue.
            </p>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-gray-700 italic">
              Breathing and mouth exercises are simple but powerful tools for anyone struggling with stammering. When
              practiced regularly, they can help you regain control over your speech and boost your confidence.
            </p>
          </div>
        </div>

        {/* Article footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          

            <Link
              href="/signin"
              className="inline-flex items-center px-5 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow hover:shadow-lg"
            >
              Try Our App
            </Link>
          </div>
        </div>

        
        
      
    </article>
  )
}
