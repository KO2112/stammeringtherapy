"use client"

import { useState, useRef } from "react"
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Type,
  Minus,
  Plus,
  Clock,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Share2,
  Volume2,
  Play,
  ArrowRight,
} from "lucide-react"

interface Story {
  id: string
  title: string
  content: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedMinutes: number
  completed?: boolean
  bookmarked?: boolean
  image?: string
}

export default function ReadOutLoudPage() {
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null)
  const [fontSize, setFontSize] = useState(18)
  const [bookmarked, setBookmarked] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isPracticing, setIsPracticing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [highlightVowels, setHighlightVowels] = useState(true)


  const toggleVowelHighlighting = () => {
  setHighlightVowels(!highlightVowels)
     }
  // Function to highlight the first vowel in each word
  const highlightFirstVowel = (text: string) => {
    <div className="hidden">
         {highlightFirstVowel("This is some sample text.")}
       </div>
    // Split the text into words
    return text.split(/\b/).map((word, index) => {
      if (word.trim() === "") return word

      // Find the first vowel in the word
      const vowelMatch = word.match(/[aeiouAEIOU]/)
      if (!vowelMatch) return word

      const vowelIndex = vowelMatch.index as number
      const beforeVowel = word.substring(0, vowelIndex)
      const vowel = word[vowelIndex]
      const afterVowel = word.substring(vowelIndex + 1)

      return (
        <span key={index}>
          {beforeVowel}
          <span className="bg-yellow-200 dark:bg-yellow-700 text-black dark:text-white font-medium px-0.5 rounded">
            {vowel}
          </span>
          {afterVowel}
        </span>
      )
    })
  }

  // Sample stories - in a real app, these would come from a database
  const stories: Story[] = [
    {
      id: "story-1",
      title: "The Unexpected Journey",
      content: `Jamie never meant to leave the city that weekend.

He liked routines. He liked silence.
He did not like surprises, crowds, or having to talk to new people. Especially not when he stammered. Especially not when their faces twisted with impatience or confusion.

But that Friday, everything snapped.
His boss had yelled at him for something stupid.
He missed the bus.
His dinner burned.
And then his upstairs neighbor started playing drums.

Loud, messy drums.

Jamie threw a few clothes into a backpack, got in his car, and started driving. No map. No destination. Just away.

By sunset, he was on a long highway lined with pine trees. The stress began to fade. The stammer did not matter when there was no one to talk to.

He found a little roadside motel near a town he would never heard of. It had a faded sign and a cat sitting on the front desk.

"Room for one?" he asked, quietly.

The woman at the desk smiled. "Of course, hon. You here for the festival?"

Jamie blinked. "F-festival?"

She laughed. "Tomorrow. Big music festival downtown. Half the town shows up."

He thought about checking out the next morning. Just keep driving. But instead, he stayed. Partly because the room had warm lighting and soft sheets. Mostly because, for once, no one seemed to care how he spoke.

The next day, the town was alive. People filled the streets — laughing, eating, dancing. Jamie wandered through the crowd like a ghost. He did not know how to jump in. Did not know how to say hello.

Then he saw the record stall.

Rows of old vinyl. Soul. Jazz. Indie rock. His favorite things in one place. He picked up a dusty Miles Davis album and smiled to himself.

"Great choice," said a voice beside him.

Jamie turned. A guy around his age stood there, hands in his hoodie pockets. Big curly hair, wide grin. "You into this stuff?"

Jamies throat locked up.

He nodded, unsure what to say.

The guy waited, patient. Not judging. Just... waiting.

"I… I l-like the horns," Jamie managed to say. "Th-the way they cut th-through everything."

The guy lit up. "Yeah! Like they are punching through the noise, right?"

Jamie laughed. Just a little. It surprised even him.

They talked for twenty minutes. About music. About road trips. About nothing important and everything at once.

He stammered. He paused. He repeated himself.

But none of it mattered.

That night, Jamie sat on the hood of his car, watching the stars. The town buzzed behind him.

He had not fixed anything in his life.
He would still struggle to speak.
But today, he had not been quiet.

And that felt like a beginning.`,
      difficulty: "intermediate",
      estimatedMinutes: 5,
      image: "/Stammering-Therapy-logo.png",
    },
    {
      id: "story-2",
      title: "The Interview",
      content: `Sarah checked her reflection one last time. 

Professional suit. Neat hair. Confident smile.
But inside, her heart was racing.

This job interview meant everything. It was perfect for her skills. The company was amazing. The salary would change her life.

There was just one problem.

Her stammer.

It always got worse when she was nervous. And right now, she was terrified.

"You have prepared for this," she whispered to herself. "You know what to say."

The receptionist called her name. Sarah took a deep breath and walked into the interview room.

Three people sat at a long table. They smiled politely as she entered.

"Good morning, Sarah," said the woman in the middle. "I am Elena, the department head. These are my colleagues, Marcus and Priya."

"G-good morning," Sarah replied, shaking their hands. "Th-thank you for having me today."

She saw the flicker in Elenas eyes. That moment of recognition. Of noticing.

Sarah sat down, hands clasped tightly in her lap.

"So," Elena began, "tell us about your experience in digital marketing."

This was the question Sarah had practiced most. She knew exactly what to say. But as she opened her mouth, the words jammed.

"I... I have w-worked in d-d-digital marketing for s-six years," she began. The stammer was worse than usual. Each blocked word felt like an eternity.

Marcus glanced at his watch.

Sarah felt her face grow hot. She tried to speed up, which only made the stammer worse.

Then Priya leaned forward. "Take your time," she said gently. "We are interested in your thoughts, not how quickly you can share them."

Something in her voice was so genuine that Sarah felt her shoulders relax slightly.

She took another breath. Slowed down. Used the techniques her speech therapist had taught her.

"For the p-past three years, I have led campaigns that increased client engagement by forty percent," she continued. The words came a little easier now.

As the interview progressed, Sarah found her rhythm. Yes, she stammered. Yes, there were awkward pauses. But she also shared smart ideas. Asked thoughtful questions. Demonstrated her expertise.

When it was over, Elena walked her to the door.

"Thank you for coming in today," she said. Then, more quietly: "My brother has a stammer too. He is one of the smartest people I know."

Sarah smiled. "It is just one p-part of who I am."

A week later, Sarah got the call.

She got the job.

Not because they pitied her. Not despite her stammer.
But because she was the best person for the position.

As she hung up the phone, Sarah realized something important: her voice might shake, but her value never did.`,
      difficulty: "intermediate",
      estimatedMinutes: 4,
      image: "/Stammering-Therapy-logo.png",
    },
    {
      id: "story-3",
      title: "The Presentation",
      content: `Michael stood backstage, clutching his notecards.

In exactly seven minutes, he would walk out and give a presentation to over two hundred people. His colleagues. His boss. Industry experts.

His mouth was dry. His palms were sweaty.

"You do not have to do this," whispered a voice in his head. "Tell them you are sick. Walk away."

It would be so easy. No one would blame him. After all, public speaking was hard for anyone. For someone with a stammer, it seemed impossible.

But Michael had worked too hard to back out now.

For six weeks, he had practiced this presentation. In front of his mirror. With his speech therapist. For his patient girlfriend who listened to every version.

He knew the material inside out. He believed in the research his team had done. He deserved to be the one presenting it.

"Two minutes," said the event coordinator, giving him a thumbs up.

Michael nodded. He closed his eyes and did the breathing exercise his therapist had taught him. In through the nose for four counts. Hold for seven. Out through the mouth for eight.

Then he heard his name announced. Applause rippled through the room.

It was time.

Michael walked onto the stage. The lights were bright. The audience was a blur.

"G-good morning," he began. His voice shook slightly. "I am M-Michael Chen, and I am here to talk about our f-findings on sustainable urban planning."

He saw a few people shift in their seats. Someone whispered to their neighbor.

For a moment, panic threatened to overwhelm him. But then he remembered what his therapist always said: "Focus on the message, not the messenger."

He took another breath and continued.

As he moved through his presentation, something unexpected happened. The audience began to lean forward. They were listening—really listening—to what he was saying, not how he was saying it.

When he showed the data visualizations his team had created, there were murmurs of appreciation. When he explained their innovative approach, people nodded with interest.

Yes, he stammered. Yes, some words took longer to come out than others. But his passion for the subject shone through every sentence.

By the end, Michael felt a strange sense of calm. He had done it. Not perfectly, but authentically.

"I will now t-take any questions you might have," he said.

Hands shot up across the room.

Later, as people came up to discuss his presentation, no one mentioned his stammer. Instead, they wanted to talk about his ideas, his research, his vision.

As he packed up his materials, his boss approached.

"That was excellent, Michael," she said. "The client was impressed. They want you to lead the follow-up meeting next month."

Michael smiled. "I would be h-happy to."

Walking out of the conference center, he realized something important: his stammer had not disappeared today. It never would. But it also had not stopped him from being heard.

And that was its own kind of victory.`,
      difficulty: "advanced",
      estimatedMinutes: 5,
      image: "/Stammering-Therapy-logo.png",
    },
  ]

  const selectedStory = selectedStoryId ? stories.find((story) => story.id === selectedStoryId) : null

  // Reset reading state when changing stories
  const resetReading = () => {
    setCompleted(false)
    setBookmarked(false)
    setIsPracticing(false)
    // Scroll to top of content
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }

  // Handle story selection
  const handleSelectStory = (storyId: string) => {
    setSelectedStoryId(storyId)
    resetReading()
  }

  // Start practice session
  const startPractice = () => {
    setIsPracticing(true)
    // Scroll to top of content
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }

  // End practice session
  const endPractice = () => {
    setIsPracticing(false)
    setCompleted(true)
  }

  // Increase font size
  const increaseFontSize = () => {
    if (fontSize < 28) {
      setFontSize(fontSize + 2)
    }
  }

  // Decrease font size
  const decreaseFontSize = () => {
    if (fontSize > 14) {
      setFontSize(fontSize - 2)
    }
  }

  // Toggle bookmarked state
  const toggleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(!showControls)
  }

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
      case "intermediate":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "advanced":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Function to render story content with highlighted first vowels
  const renderStoryContent = (content: string) => {
  return content.split("\n\n").map((paragraph, index) => (
    <p key={index} className="mb-6 leading-relaxed">
      {highlightVowels 
        ? paragraph.split(" ").map((word, wordIndex) => {
            // Skip empty words
            if (!word) return " "

            // Find the first vowel in the word
            const vowelMatch = word.match(/[aeiouAEIOU]/)

            if (!vowelMatch) {
              return <span key={wordIndex}>{word} </span>
            }

            const vowelIndex = vowelMatch.index as number
            const beforeVowel = word.substring(0, vowelIndex)
            const vowel = word[vowelIndex]
            const afterVowel = word.substring(vowelIndex + 1)

            return (
              <span key={wordIndex}>
                {beforeVowel}
                <span className="bg-yellow-200 dark:bg-yellow-700 text-black dark:text-white font-medium px-0.5 rounded">
                  {vowel}
                </span>
                {afterVowel}{" "}
              </span>
            )
          })
        : paragraph.split(" ").map((word, wordIndex) => (
            <span key={wordIndex}>{word} </span>
          ))
      }
    </p>
  ))
}

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 w-full">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-100 to-purple-100 dark:from-teal-900 dark:to-purple-900 items-center justify-center flex">
              <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-300" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
              Read Out Loud
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleControls}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle controls"
            >
              <Type className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!selectedStory ? (
          /* Story Selection Grid */
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select a Story to Read</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => handleSelectStory(story.id)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
                    <img
                      src={story.image || "/placeholder.svg?height=200&width=300&text=Story"}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="flex justify-between items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(story.difficulty)}`}
                        >
                          {story.difficulty.charAt(0).toUpperCase() + story.difficulty.slice(1)}
                        </span>
                        <span className="flex items-center text-white text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {story.estimatedMinutes} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{story.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{story.content.split("\n")[0]}</p>
                    <button className="flex items-center text-teal-600 dark:text-teal-400 font-medium hover:text-teal-700 dark:hover:text-teal-300">
                      Start Reading <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          
          /* Reading View */
          <div className="space-y-6">
            {/* Back to selection button */}
            <button
              onClick={() => setSelectedStoryId(null)}
              className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5 mr-1 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Back to Stories</span>
            </button>

            {/* Story Container */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              {/* Story Header */}
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
                    {selectedStory.title}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedStory.difficulty)}`}
                    >
                      {selectedStory.difficulty.charAt(0).toUpperCase() + selectedStory.difficulty.slice(1)}
                    </span>
                    <span className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedStory.estimatedMinutes} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Reading Controls */}
              {showControls && (
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={decreaseFontSize}
                        className="p-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Decrease font size"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{fontSize}px</span>
                      <button
                        onClick={increaseFontSize}
                        className="p-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Increase font size"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={toggleBookmark}
                      className={`p-1.5 rounded-md ${
                        bookmarked
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                      }`}
                      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this story"}
                    >
                      {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    </button>

                       <button
                          onClick={toggleVowelHighlighting}
                             className={`p-1.5 rounded-md ${
                             highlightVowels
                             ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                             : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                              }`}
                             aria-label={highlightVowels ? "Turn off vowel highlighting" : "Turn on vowel highlighting"}
                               >
                             <Type className="h-4 w-4" />
                          </button>
                    {!isPracticing && !completed ? (
                      <button
                        onClick={startPractice}
                        className="flex items-center px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors duration-200"
                      >
                        <Play className="h-4 w-4 mr-1.5" />
                        Start Reading Practice
                      </button>
                    ) : isPracticing ? (
                      <button
                        onClick={endPractice}
                        className="flex items-center px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors duration-200"
                      >
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        Finish Practice
                      </button>
                    ) : (
                      <div className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        Completed
                      </div>
                    )}

                    <button
                      className="p-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      aria-label="Share this story"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Story Content */}
              <div
                ref={contentRef}
                className={`p-6 md:p-8 lg:p-10 max-h-[70vh] overflow-y-auto ${isPracticing ? "bg-teal-50/50 dark:bg-teal-900/10" : ""}`}
                style={{ fontSize: `${fontSize}px` }}
              >
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {renderStoryContent(selectedStory.content)}
                </div>
              </div>
            </div>

            {/* Story Navigation */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => {
                  const currentIndex = stories.findIndex((s) => s.id === selectedStory.id)
                  if (currentIndex > 0) {
                    handleSelectStory(stories[currentIndex - 1].id)
                  }
                }}
                disabled={stories.findIndex((s) => s.id === selectedStory.id) === 0}
                className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronLeft className="h-5 w-5 mr-1 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Previous Story</span>
              </button>

              <button
                onClick={() => {
                  const currentIndex = stories.findIndex((s) => s.id === selectedStory.id)
                  if (currentIndex < stories.length - 1) {
                    handleSelectStory(stories[currentIndex + 1].id)
                  }
                }}
                disabled={stories.findIndex((s) => s.id === selectedStory.id) === stories.length - 1}
                className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <span className="text-gray-700 dark:text-gray-300">Next Story</span>
                <ChevronRight className="h-5 w-5 ml-1 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Reading Tips */}
            <div className="mt-8 bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 border border-teal-100 dark:border-teal-900/50">
              <h3 className="text-xl font-semibold text-teal-800 dark:text-teal-300 mb-4 flex items-center">
                <Volume2 className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                Reading Practice Tips
              </h3>
              <ul className="space-y-3 text-teal-800 dark:text-teal-300">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center mr-3">
                    <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span>Read at your own pace - there is no rush</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center mr-3">
                    <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span>Try reading aloud in front of a mirror to observe your speech patterns</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center mr-3">
                    <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span>Record yourself to track progress over time</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center mr-3">
                    <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span>Practice the breathing techniques from your exercises before starting</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
