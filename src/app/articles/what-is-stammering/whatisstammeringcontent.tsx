"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  Calendar,
  HelpCircle,
  Activity,
  List,
  Layers,
  GitBranch,
} from "lucide-react"

export default function WhatIsStammeringArticle() {
  return (
    <article className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Article header */}
        <div className="mb-8">
          <Link href="/articles" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">What is Stammering?</h1>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">May 10, 2025</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>8 min read</span>
          </div>

          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="What is Stammering"
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
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Understanding Fluency Before Stammering</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Many researchers have emphasized the importance of defining fluency before explaining stammering.
              According to Starkweather (1987), fluency means ease in speech and language performance. Fluent speakers
              are so skilled at speaking that they do it effortlessly. Sounds, words, and sentences flow smoothly
              without noticeable pauses. Fluency always relies on a high level of language proficiency, and fluent
              speech has a natural rhythm. When this rhythm is disrupted, the speech becomes disfluent.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">What is Disfluency?</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Disfluency is defined as interruptions in the continuity of speech production (Starkweather, 1987).
              According to Silverman (2004), disfluent speech can include adding sounds between syllables (like um or
              uh), repeating the first syllable or word, making pronunciation errors, or correcting mistakes. If the
              listener does not recognize these as signs of a fluency disorder, they may not even notice them.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Defining Stammering</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Traditionally, stammering is defined as a disorder where the rhythm or fluency of speech is disrupted by
              interruptions and blocks (Bloodstein and Ratner, 2008). According to the American Psychiatric Association
              (DSM-IV-TR, 2000), the main characteristic of stammering is a disruption in the fluency and timing of
              speech that is not appropriate for the persons age.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <List className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Symptoms of Stammering</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">Stammering can present in several ways:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Sound and syllable repetitions</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Prolonged sounds</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Adding sounds, syllables, or words</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Partially saying words (pausing mid-word)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Audible or silent blocks (frozen speech)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Substituting words to avoid difficult ones</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Using excessive physical tension while speaking</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Repeating single-syllable words (like I-I-I saw him)</span>
              </li>
            </ul>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Stages of Stammering Development</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">Stammering can progress through several stages:</p>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">Preschool Stage</h3>
                <p className="text-gray-700">
                  Speech disruptions are irregular, often triggered by excitement or pressure to communicate.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">School-Age Stage</h3>
                <p className="text-gray-700">
                  Stammering becomes more chronic, and the child may recognize themselves as a stammerer.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">Late Childhood to Early Adolescence</h3>
                <p className="text-gray-700">
                  Stammering varies, and the person may start avoiding difficult words or situations.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">Late Adolescence to Adulthood</h3>
                <p className="text-gray-700">
                  Fear of certain words, situations, or sounds may develop, leading to avoidance.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <GitBranch className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Types of Stammering</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">Cooper (1993) identified three subtypes of stammering:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">Developmental Stammering</h3>
                <p className="text-gray-700 text-sm">Seen in young children, often resolves without therapy.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">Treatable Stammering</h3>
                <p className="text-gray-700 text-sm">More persistent but can be managed with therapy.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">Chronic Stammering</h3>
                <p className="text-gray-700 text-sm">Long-term stammering that may require lifelong management.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-gray-700 italic">
              Stammering is not just a speech issue but can also impact self-esteem, communication skills, and social
              interactions. Early intervention can significantly improve outcomes, making it essential to understand and
              address stammering effectively.
            </p>
          </div>
        </div>

        {/* Article footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            

            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow hover:shadow-lg"
            >
              Get Help
            </Link>
          </div>
        </div>

       
      </div>
    </article>
  )
}
