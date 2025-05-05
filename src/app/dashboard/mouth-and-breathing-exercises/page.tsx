"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Wind,
  MessageSquare,
  Play,
  Pause,
  ChevronRight,
  Info,
  Clock,
  CheckCircle,
  TreesIcon as Lungs,
  Smile,
  ArrowRight,
  Repeat,
} from "lucide-react"

// Define types for our exercises
interface BaseExercise {
  id: number
  title: string
  description: string
  duration: number
  steps: string[]
  benefits: string[]
}

// Instead of an empty interface, use a type alias with a discriminator
type BreathingExercise = BaseExercise & {
  type: "breathing"
}

interface MouthExercise extends BaseExercise {
  practice: string
  type: "mouth"
}

export default function MouthAndBreathingExercises() {
  const [activeTab, setActiveTab] = useState("breathing")
  const [activeExercise, setActiveExercise] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timer, setTimer] = useState(0)
  const [maxTime, setMaxTime] = useState(60)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const breathingExercises: BreathingExercise[] = [
    {
      id: 1,
      title: "Basic Breath Control",
      description:
        "Calmly inhale through your nose and fully inflate your stomach. Exhale slowly through your mouth until your lungs are completely empty.",
      duration: 60,
      steps: ["Inhale through nose (4s)", "Inflate stomach", "Exhale through mouth (6s)", "Empty lungs completely"],
      benefits: ["Reduces stress", "Improves focus", "Increases oxygen flow"],
      type: "breathing",
    },
    {
      id: 2,
      title: "Segmented Exhale",
      description:
        "Calmly inhale through your nose and fully inflate your stomach. Exhale slowly through your mouth in 5 separate breaths until your lungs are completely empty.",
      duration: 60,
      steps: [
        "Inhale through nose (4s)",
        "Inflate stomach",
        "Exhale in 5 segments",
        "Pause briefly between each exhale",
        "Empty lungs completely",
      ],
      benefits: ["Strengthens diaphragm", "Improves breath control", "Enhances vocal stability"],
      type: "breathing",
    },
    {
      id: 3,
      title: "Segmented Inhale",
      description:
        "Calmly inhale through your nose in 5 separate breaths and fully inflate your stomach. Exhale slowly through your mouth until your lungs are completely empty.",
      duration: 60,
      steps: [
        "Inhale in 5 segments",
        "Pause briefly between each inhale",
        "Inflate stomach fully",
        "Exhale through mouth (6s)",
        "Empty lungs completely",
      ],
      benefits: ["Increases lung capacity", "Improves breath control", "Reduces anxiety"],
      type: "breathing",
    },
    {
      id: 4,
      title: "Puffed Cheeks",
      description:
        "Calmly inhale through your nose and fully inflate your stomach. Exhale by puffing your cheeks as if you were blowing out candles on a cake.",
      duration: 45,
      steps: [
        "Inhale through nose (4s)",
        "Inflate stomach",
        "Puff cheeks fully",
        "Exhale in controlled bursts",
        "Empty lungs completely",
      ],
      benefits: ["Strengthens facial muscles", "Improves breath control", "Enhances articulation"],
      type: "breathing",
    },
    {
      id: 5,
      title: "Breath Retention",
      description:
        "Calmly inhale through your nose and fully inflate your stomach. Hold your breath for 6 seconds and then exhale slowly through your mouth until your lungs are completely empty.",
      duration: 75,
      steps: [
        "Inhale through nose (4s)",
        "Inflate stomach",
        "Hold breath (6s)",
        "Exhale through mouth (6s)",
        "Empty lungs completely",
      ],
      benefits: ["Increases CO2 tolerance", "Calms nervous system", "Improves focus and concentration"],
      type: "breathing",
    },
    {
      id: 6,
      title: "Hissing Breath",
      description:
        "Calmly inhale through your nose and fully inflate your stomach. Exhale making a 'Hissssssss' sound until your lungs are completely empty.",
      duration: 45,
      steps: [
        "Inhale through nose (4s)",
        "Inflate stomach",
        "Exhale with 'Hissssssss' sound",
        "Maintain consistent sound",
        "Empty lungs completely",
      ],
      benefits: ["Strengthens diaphragm", "Improves breath control", "Enhances vocal resonance"],
      type: "breathing",
    },
    {
      id: 7,
      title: "Rhythmic Hissing",
      description:
        "Calmly inhale through your nose and fully inflate your stomach. Exhale making a 'Hiss - Hiss - Hiss...' sound until your lungs are completely empty.",
      duration: 45,
      steps: [
        "Inhale through nose (4s)",
        "Inflate stomach",
        "Exhale with rhythmic 'Hiss - Hiss - Hiss'",
        "Maintain consistent rhythm",
        "Empty lungs completely",
      ],
      benefits: ["Improves breath control", "Enhances rhythm perception", "Strengthens vocal muscles"],
      type: "breathing",
    },
    {
      id: 8,
      title: "Vocal 'A' Breath",
      description:
        "Calmly inhale through your nose and fully inflate your stomach. Exhale making a clear 'AAAAAAAA' sound until your lungs are completely empty.",
      duration: 45,
      steps: [
        "Inhale through nose (4s)",
        "Inflate stomach",
        "Exhale with 'AAAAAAAA' sound",
        "Maintain consistent pitch",
        "Empty lungs completely",
      ],
      benefits: ["Strengthens vocal cords", "Improves breath control", "Enhances vocal projection"],
      type: "breathing",
    },
    {
      id: 9,
      title: "Vowel Sequence",
      description:
        "Calmly inhale through your nose and fully inflate your stomach. Exhale making the 'A - E - I - O - U' sounds until your lungs are completely empty.",
      duration: 60,
      steps: [
        "Inhale through nose (4s)",
        "Inflate stomach",
        "Exhale with 'A - E - I - O - U' sounds",
        "Pronounce each vowel clearly",
        "Empty lungs completely",
      ],
      benefits: ["Improves articulation", "Enhances vocal range", "Strengthens breath control"],
      type: "breathing",
    },
    {
      id: 10,
      title: "Dog Panting",
      description:
        "In this exercise, known as dog panting, stick your tongue out and take rapid breaths in and out using your diaphragm.",
      duration: 30,
      steps: [
        "Stick tongue out slightly",
        "Breathe rapidly in and out",
        "Use diaphragm for breathing",
        "Maintain consistent rhythm",
        "Continue for 30 seconds",
      ],
      benefits: ["Strengthens diaphragm", "Increases oxygen intake", "Energizes the body"],
      type: "breathing",
    },
  ]

  const mouthExercises: MouthExercise[] = [
    {
      id: 1,
      title: "Vowel Articulation",
      description: "Say the following letters using diaphragm breathing and opening your mouth in an exaggerated way:",
      practice: "U I",
      duration: 30,
      steps: [
        "Inhale deeply",
        "Pronounce 'U' with exaggerated mouth opening",
        "Inhale again",
        "Pronounce 'I' with exaggerated mouth opening",
        "Repeat sequence",
      ],
      benefits: ["Improves vowel clarity", "Strengthens facial muscles", "Enhances articulation"],
      type: "mouth",
    },
    {
      id: 2,
      title: "Syllable Repetition",
      description:
        "Read the following exercise using diaphragm breathing and opening your mouth in an exaggerated way:",
      practice: "Manamana Menemene Minimini Monomono Munumunu",
      duration: 45,
      steps: [
        "Inhale deeply",
        "Pronounce each syllable clearly",
        "Exaggerate mouth movements",
        "Maintain consistent rhythm",
        "Complete the full sequence",
      ],
      benefits: ["Improves diction", "Strengthens articulation muscles", "Enhances speech clarity"],
      type: "mouth",
    },
    {
      id: 3,
      title: "Sibilant Sounds",
      description:
        "Read the following exercise using diaphragm breathing and opening your mouth in an exaggerated way:",
      practice: "Sa Sha Za Se She Ze Si Shi Zi So Sho Zo Su Shu Zu",
      duration: 60,
      steps: [
        "Inhale deeply",
        "Pronounce each sound clearly",
        "Exaggerate mouth movements",
        "Focus on the 's', 'sh', and 'z' sounds",
        "Complete the full sequence",
      ],
      benefits: ["Improves sibilant sounds", "Enhances speech clarity", "Strengthens tongue control"],
      type: "mouth",
    },
    {
      id: 4,
      title: "Consonant Combinations",
      description:
        "Read the following exercise using diaphragm breathing and opening your mouth in an exaggerated way:",
      practice: "O Pi Kap Bu Pi Kap Shu Pi Kap",
      duration: 45,
      steps: [
        "Inhale deeply",
        "Pronounce each syllable clearly",
        "Exaggerate mouth movements",
        "Focus on the transitions between sounds",
        "Complete the full sequence",
      ],
      benefits: ["Improves consonant clarity", "Enhances speech rhythm", "Strengthens articulation"],
      type: "mouth",
    },
    {
      id: 5,
      title: "Compound Sounds",
      description:
        "Read the following exercise using diaphragm breathing and opening your mouth in an exaggerated way. Each line should be read in one breath:",
      practice:
        "ping-pong ping-pong ping-pong ping-pong\nding-dong ding-dong ding-dong ding-dong\nking-kong king-kong king-kong king-kong",
      duration: 60,
      steps: [
        "Inhale deeply",
        "Read each line in one breath",
        "Exaggerate mouth movements",
        "Maintain consistent rhythm",
        "Complete all three lines",
      ],
      benefits: ["Improves breath control", "Enhances speech rhythm", "Strengthens articulation muscles"],
      type: "mouth",
    },
    {
      id: 6,
      title: "Consonant-Vowel Pairs",
      description:
        "Read the following exercise using diaphragm breathing and opening your mouth in an exaggerated way:",
      practice: "pa-pe pi-po-ba-be-bi-bo-ma-me-mi-mo\nPap-pep-pip-pop-bab-beb-bib-bob-mam-mem-mim-mom",
      duration: 60,
      steps: [
        "Inhale deeply",
        "Pronounce each syllable clearly",
        "Exaggerate mouth movements",
        "Focus on the consonant-vowel transitions",
        "Complete both lines",
      ],
      benefits: ["Improves articulation", "Enhances speech clarity", "Strengthens facial muscles"],
      type: "mouth",
    },
    {
      id: 7,
      title: "Dental Consonants",
      description:
        "Read the following exercise using diaphragm breathing and opening your mouth in an exaggerated way:",
      practice: "Da-de-di-do-na-ne-ni-no-ta-te-ti-to\nDad-ded-did-dod-nan-nen-nin-non-tat-tet-tit-tot",
      duration: 60,
      steps: [
        "Inhale deeply",
        "Pronounce each syllable clearly",
        "Exaggerate mouth movements",
        "Focus on the 'd', 'n', and 't' sounds",
        "Complete both lines",
      ],
      benefits: ["Improves dental consonant clarity", "Enhances tongue placement", "Strengthens articulation"],
      type: "mouth",
    },
    {
      id: 8,
      title: "Velar Consonants",
      description:
        "Read the following exercise using diaphragm breathing and opening your mouth in an exaggerated way:",
      practice: "Kah-keh-kih-kih-koh-koh-kuh-kuh",
      duration: 45,
      steps: [
        "Inhale deeply",
        "Pronounce each syllable clearly",
        "Exaggerate mouth movements",
        "Focus on the 'k' sound at the back of the mouth",
        "Complete the full sequence",
      ],
      benefits: [
        "Improves velar consonant clarity",
        "Enhances back-of-mouth articulation",
        "Strengthens speech muscles",
      ],
      type: "mouth",
    },
    {
      id: 9,
      title: "Final Consonant Clusters",
      description:
        "Read the following exercise using diaphragm breathing and opening your mouth in an exaggerated way. Each line should be read in one breath:",
      practice:
        "ark-erk-irk-irk-ork-ork-urk-urk\nart-ert-irt-irt-ort-ort-urt-urt\nars-ers-irs-irs-ors-ors-urs-urs\narf-erf-irf-irf-orf-orf-urf-urf",
      duration: 75,
      steps: [
        "Inhale deeply",
        "Read each line in one breath",
        "Exaggerate mouth movements",
        "Focus on the final consonant clusters",
        "Complete all four lines",
      ],
      benefits: ["Improves consonant cluster clarity", "Enhances breath control", "Strengthens articulation muscles"],
      type: "mouth",
    },
    {
      id: 10,
      title: "Resistance Training",
      description:
        "Make a fist with your hand and place it under your chin. Try to read the alphabet with your mouth opened in an exaggerated way while your fist applies pressure to your chin and tries to prevent your mouth from opening.",
      practice: "A-B-C-D-E-F-G-H-I-J-K-L-M-N-O-P-Q-R-S-T-U-V-W-X-Y-Z",
      duration: 90,
      steps: [
        "Place fist under chin",
        "Apply gentle resistance",
        "Open mouth against resistance",
        "Pronounce each letter clearly",
        "Complete the full alphabet",
      ],
      benefits: ["Strengthens jaw muscles", "Improves articulation", "Enhances mouth control"],
      type: "mouth",
    },
  ]

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setIsPlaying(true)
    setTimer(0)

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev >= maxTime) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
          setIsPlaying(false)
          return maxTime
        }
        return prev + 1
      })
    }, 1000)
  }

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setIsPlaying(false)
  }

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setIsPlaying(false)
    setTimer(0)
  }

  const handleExerciseSelect = (id: number, duration: number) => {
    resetTimer()
    setActiveExercise(id)
    setMaxTime(duration)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const currentExercises = activeTab === "breathing" ? breathingExercises : mouthExercises
  const activeExerciseData = currentExercises.find((ex) => ex.id === activeExercise)

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Vocal Development Exercises</h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Improve your breathing control and mouth articulation with these specialized exercises
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-md flex">
            <button
              onClick={() => {
                setActiveTab("breathing")
                setActiveExercise(null)
                resetTimer()
              }}
              className={`flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "breathing" ? "bg-teal-500 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Wind className="h-4 w-4 mr-2" />
              Breathing Exercises
            </button>
            <button
              onClick={() => {
                setActiveTab("mouth")
                setActiveExercise(null)
                resetTimer()
              }}
              className={`flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "mouth" ? "bg-purple-500 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Mouth Development
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:items-start">
          {/* Exercise List */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200 lg:sticky lg:top-8">
            <div
              className={`px-6 py-4 border-b border-slate-200 flex items-center ${
                activeTab === "breathing" ? "bg-teal-50" : "bg-purple-50"
              }`}
            >
              <h2 className="text-lg font-semibold">
                {activeTab === "breathing" ? (
                  <span className="flex items-center text-teal-800">
                    <Lungs className="h-5 w-5 mr-2" />
                    Breathing Exercises
                  </span>
                ) : (
                  <span className="flex items-center text-purple-800">
                    <Smile className="h-5 w-5 mr-2" />
                    Mouth Development
                  </span>
                )}
              </h2>
            </div>

            <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
              {currentExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => handleExerciseSelect(exercise.id, exercise.duration)}
                  className={`w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors flex items-center ${
                    activeExercise === exercise.id ? (activeTab === "breathing" ? "bg-teal-50" : "bg-purple-50") : ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      activeTab === "breathing" ? "bg-teal-100 text-teal-700" : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {exercise.id}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{exercise.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">{exercise.description}</p>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 ${activeTab === "breathing" ? "text-teal-500" : "text-purple-500"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Details */}
          <div className="lg:col-span-2 lg:min-h-[600px] flex flex-col">
            <AnimatePresence mode="wait">
              {activeExercise ? (
                <motion.div
                  key={`exercise-${activeExercise}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200 flex-1"
                >
                  <div
                    className={`px-6 py-4 border-b border-slate-200 flex justify-between items-center ${
                      activeTab === "breathing" ? "bg-teal-50" : "bg-purple-50"
                    }`}
                  >
                    <h2
                      className={`text-lg font-semibold ${
                        activeTab === "breathing" ? "text-teal-800" : "text-purple-800"
                      }`}
                    >
                      Exercise {activeExerciseData?.id}: {activeExerciseData?.title}
                    </h2>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-slate-500" />
                      <span className="text-sm text-slate-500">{activeExerciseData?.duration}s</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                      <p className="text-slate-700">{activeExerciseData?.description}</p>
                    </div>

                    {activeTab === "mouth" && activeExerciseData && "practice" in activeExerciseData && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                          Practice Text
                        </h3>
                        <div
                          className={`p-4 rounded-lg bg-purple-50 border border-purple-100 text-center font-medium text-purple-800 whitespace-pre-line`}
                        >
                          {(activeExerciseData as MouthExercise).practice}
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Steps</h3>
                      <div className="space-y-2">
                        {activeExerciseData?.steps.map((step, index) => (
                          <div
                            key={index}
                            className="flex items-start p-3 rounded-lg bg-slate-50 border border-slate-200"
                          >
                            <div
                              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-medium ${
                                activeTab === "breathing"
                                  ? "bg-teal-100 text-teal-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <span className="text-slate-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Benefits</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {activeExerciseData?.benefits.map((benefit, index) => (
                          <div
                            key={index}
                            className="flex items-center p-2 rounded-lg bg-slate-50 border border-slate-200"
                          >
                            <CheckCircle
                              className={`h-4 w-4 mr-2 ${
                                activeTab === "breathing" ? "text-teal-500" : "text-purple-500"
                              }`}
                            />
                            <span className="text-sm text-slate-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timer */}
                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Exercise Timer</h3>
                        <div className="text-sm text-slate-500">
                          {formatTime(timer)} / {formatTime(maxTime)}
                        </div>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
                        <div
                          className={`h-2.5 rounded-full ${
                            activeTab === "breathing" ? "bg-teal-500" : "bg-purple-500"
                          }`}
                          style={{ width: `${(timer / maxTime) * 100}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-center space-x-4">
                        {!isPlaying ? (
                          <button
                            onClick={startTimer}
                            className={`px-6 py-2 rounded-lg flex items-center font-medium text-white ${
                              activeTab === "breathing"
                                ? "bg-teal-500 hover:bg-teal-600"
                                : "bg-purple-500 hover:bg-purple-600"
                            }`}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Exercise
                          </button>
                        ) : (
                          <button
                            onClick={pauseTimer}
                            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg flex items-center font-medium text-white"
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </button>
                        )}

                        <button
                          onClick={resetTimer}
                          className="px-6 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg flex items-center font-medium text-slate-700"
                        >
                          <Repeat className="h-4 w-4 mr-2" />
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="no-exercise"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200 flex flex-col items-center justify-center p-12 flex-1"
                >
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                      activeTab === "breathing" ? "bg-teal-100" : "bg-purple-100"
                    }`}
                  >
                    {activeTab === "breathing" ? (
                      <Wind className="h-10 w-10 text-teal-600" />
                    ) : (
                      <MessageSquare className="h-10 w-10 text-purple-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Select an Exercise</h3>
                  <p className="text-slate-600 text-center mb-6 max-w-md">
                    Choose an exercise from the list to view details and start practicing
                  </p>
                  <div
                    className={`flex items-center text-sm ${
                      activeTab === "breathing" ? "text-teal-600" : "text-purple-600"
                    }`}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    <span>
                      {activeTab === "breathing"
                        ? "Breathing exercises help improve vocal control and reduce tension"
                        : "Mouth exercises enhance articulation and speech clarity"}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center">
              <Info className="h-5 w-5 mr-2 text-slate-600" />
              Tips for Effective Practice
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <Wind className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Breathing Technique</h3>
                  <p className="text-slate-600">
                    Always breathe from your diaphragm, not your chest. Your stomach should expand when you inhale, not
                    your shoulders rising.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Consistent Practice</h3>
                  <p className="text-slate-600">
                    Practice these exercises for 10-15 minutes daily. Consistency is more important than duration for
                    developing proper technique.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                  <Smile className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Relaxed Posture</h3>
                  <p className="text-slate-600">
                    Keep your jaw, neck, and shoulders relaxed while performing these exercises. Tension will restrict
                    proper airflow and articulation.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <ArrowRight className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Progressive Difficulty</h3>
                  <p className="text-slate-600">
                    Start with simpler exercises and gradually increase difficulty. Master the basics before moving to
                    more complex patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
