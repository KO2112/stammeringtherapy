"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  Calendar,
  BookOpen,
  History,
  MessageSquare,
  Users,
  Brain,
  FileText,
  Layers,
} from "lucide-react"

export default function DefinitionsOfStutteringArticle() {
  return (
    <article className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Article header */}
        <div className="mb-8">
          <Link href="/articles" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">Definitions of Stuttering</h1>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">May 10, 2025</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>10 min read</span>
          </div>

          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Definitions of Stuttering"
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
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Understanding the Complexity of Stuttering</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Stuttering is a complex communication problem with multiple dimensions and causes (Ramig & Shames, 1998).
              Van Riper (1982) compared stuttering to a difficult puzzle with many missing pieces. Over the years,
              researchers have offered various definitions of stuttering, each reflecting different perspectives. Some
              focus on what happens during stuttering, while others emphasize its causes or its effects on listeners and
              speakers. Some definitions even attempt to combine these viewpoints for a more comprehensive understanding
              (Ramig & Shames, 1998).
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              One reason researchers have struggled to agree on a single definition of stuttering is their focus on
              different aspects of the behavior. Johnson (1958) illustrated this diversity with the story of six blind
              men describing an elephant. Each man described the animal differently because each touched a different
              part. Similarly, definitions of stuttering vary based on the aspect each researcher emphasizes (as cited
              in Silverman, 2004).
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <History className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Early Definitions of Stuttering</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              One of the earliest definitions came from Johnson and his colleagues in the 1940s and 1950s. They
              described stuttering as an unpleasant, anxious, hypertonic avoidance reaction. In other words, they
              believed stuttering was what a speaker did when they expected stuttering to occur, felt fearful, became
              tense, and tried to avoid the situation (as cited in Manning, 2010). However, this definition was limited
              because it ignored cases where stuttering occurred without noticeable fear or tension (Silverman, 2004).
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Speech-Based Definitions</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Some definitions have focused only on the audible aspects of stuttering. Van Riper defined it as a
              disruption in the normal flow and rhythm of speech. Andrews et al. (1983) went further, arguing that
              repetitions and prolongations were enough to define stuttering. However, normal speech can also include
              these features, making it difficult to distinguish between stuttering and normal disfluency (Silverman,
              2004).
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Van Riper (1982) later expanded his definition, suggesting that stuttering occurs when the flow of speech
              is interrupted by a disordered sound, syllable, or word or by the speakers reaction to this disruption.
              This definition included the listeners response, making it more comprehensive.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">The Listeners Perspective</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Perkins (1990) approached the problem differently, focusing on the stutterers experience rather than the
              listeners. He noted that the types of disfluency seen in stuttering also occur in normal speech. The key
              difference, he argued, is that the stutterer experiences a loss of control, making the problem
              involuntary.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Wingates Standard Definition</h2>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                Wingate (1964) offered a standard definition of stuttering, breaking it into three main parts:
              </p>
              <ol className="mt-4 space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    1
                  </div>
                  <span className="text-gray-700">
                    He described the basic features of stuttering: involuntary, audible, or silent repetitions and
                    prolongations of sounds, syllables, or words.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    2
                  </div>
                  <span className="text-gray-700">
                    He noted the possible presence of secondary behaviors, such as facial movements or tension.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    3
                  </div>
                  <span className="text-gray-700">
                    He mentioned the frequent emotional impact of stuttering, such as feelings of shame or anxiety.
                  </span>
                </li>
              </ol>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Psychological and Physiological Definitions</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Stuttering has also been defined in psychological and physiological terms. Murphy (1986) saw it as an
              emotional response to anxiety or feelings of inadequacy. Similarly, Brutten and Shomaker (1986) described
              it as a conditioned emotional reaction.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              From a physiological perspective, Rosenfield and Nudelman (1987) viewed stuttering as a disruption in the
              timing and sequencing of motor outputs due to neurophysiological issues. Kehoe (1998) highlighted the role
              of muscle control in speech, suggesting that improper muscle use can lead to stuttering.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">The DSM-IV Definition</h2>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <p className="text-gray-700">
                The American Psychiatric Association (DSM-IV) defines stuttering as a disorder involving repeated sound
                and syllable repetitions, prolongations, blocks, or other disruptions in the flow of speech. These
                disruptions significantly interfere with educational, occupational, or social communication.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">A Multifaceted Problem</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Defining stuttering is challenging because it involves various speech behaviors, emotions, beliefs,
              self-perception, and social interactions. These components vary between individuals and interact in
              complex ways. In recent years, stuttering has been increasingly viewed as a multidimensional problem that
              affects not just speech but also emotional and social aspects of a persons life.
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
              Speak to a Specialist
            </Link>
          </div>
        </div>


          
      </div>
    </article>
  )
}
