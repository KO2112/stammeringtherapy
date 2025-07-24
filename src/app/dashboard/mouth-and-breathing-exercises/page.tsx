"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  PlayCircle,
} from "lucide-react";

// Define types for our exercises
interface BaseExercise {
  id: number;
  title: string;
  description: string;
  duration: number;
  steps: string[];
  benefits: string[];
}

// Instead of an empty interface, use a type alias with a discriminator
type BreathingExercise = BaseExercise & {
  type: "breathing";
};

interface MouthExercise extends BaseExercise {
  practice: string;
  type: "mouth";
}

export default function TurkishVocalExercises() {
  const [activeTab, setActiveTab] = useState("breathing");
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [maxTime, setMaxTime] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const breathingExercises: BreathingExercise[] = [
    {
      id: 1,
      title: "Temel Nefes Kontrolü",
      description:
        "Burnumuzdan sakince nefesi alıyoruz ve karnımızı iyice şişiriyoruz. Nefesi ağzımızdan yavaşça, ciğerlerimizde hava kalmayana kadar veriyoruz.",
      duration: 60,
      steps: [
        "Burnunuzdan nefes alın (4s)",
        "Karnınızı şişirin",
        "Ağzınızdan nefes verin (6s)",
        "Ciğerlerinizi tamamen boşaltın",
      ],
      benefits: [
        "Stresi azaltır",
        "Odaklanmayı artırır",
        "Oksijen akışını artırır",
      ],
      type: "breathing",
    },
    {
      id: 2,
      title: "Bölümlü Nefes Verme",
      description:
        "Burnumuzdan sakince nefesi alıyoruz ve karnımızı iyice şişiriyoruz. Nefesi ağzımızdan yavaşça, ciğerlerimizde hava kalmayana kadar 5 seferde veriyoruz.",
      duration: 60,
      steps: [
        "Burnunuzdan nefes alın (4s)",
        "Karnınızı şişirin",
        "5 bölümde nefes verin",
        "Her verme arasında kısa durun",
        "Ciğerlerinizi tamamen boşaltın",
      ],
      benefits: [
        "Diyaframı güçlendirir",
        "Nefes kontrolünü geliştirir",
        "Vokal stabilitesini artırır",
      ],
      type: "breathing",
    },
    {
      id: 3,
      title: "Bölümlü Nefes Alma",
      description:
        "Burnumuzdan sakince nefesi 5 seferde alıyoruz ve karnımızı iyice şişiriyoruz. Nefesi ağzımızdan yavaşça ciğerlerimizde hava kalmayana kadar veriyoruz.",
      duration: 60,
      steps: [
        "5 bölümde nefes alın",
        "Her alma arasında kısa durun",
        "Karnınızı tamamen şişirin",
        "Ağzınızdan nefes verin (6s)",
        "Ciğerlerinizi tamamen boşaltın",
      ],
      benefits: [
        "Akciğer kapasitesini artırır",
        "Nefes kontrolünü geliştirir",
        "Kaygıyı azaltır",
      ],
      type: "breathing",
    },
    {
      id: 4,
      title: "Şişik Yanaklar",
      description:
        "Burnumuzdan sakince nefesi alıyoruz ve karnımızı iyice şişiriyoruz. Nefesi sanki pastanın üstündeki mumları söndürürmüş gibi yanaklarımızı şişirip üfleyerek veriyoruz.",
      duration: 45,
      steps: [
        "Burnunuzdan nefes alın (4s)",
        "Karnınızı şişirin",
        "Yanaklarınızı tamamen şişirin",
        "Kontrollü patlamalar halinde nefes verin",
        "Ciğerlerinizi tamamen boşaltın",
      ],
      benefits: [
        "Yüz kaslarını güçlendirir",
        "Nefes kontrolünü geliştirir",
        "Artikülasyonu artırır",
      ],
      type: "breathing",
    },
    {
      id: 5,
      title: "Nefes Tutma",
      description:
        "Burnumuzdan sakince nefesi alıyoruz ve karnımızı iyice şişiriyoruz. Nefesi 6 saniye tutuyoruz ve ağzımızdan yavaşça, ciğerlerimizde hava kalmayana kadar veriyoruz.",
      duration: 75,
      steps: [
        "Burnunuzdan nefes alın (4s)",
        "Karnınızı şişirin",
        "Nefesi tutun (6s)",
        "Ağzınızdan nefes verin (6s)",
        "Ciğerlerinizi tamamen boşaltın",
      ],
      benefits: [
        "CO2 toleransını artırır",
        "Sinir sistemini sakinleştirir",
        "Odaklanma ve konsantrasyonu geliştirir",
      ],
      type: "breathing",
    },
    {
      id: 6,
      title: "Tıslama Nefesi",
      description:
        "Burnumuzdan sakince nefesi alıyoruz ve karnımızı iyice şişiriyoruz. Nefesi verirken 'Tıssssssssss' sesi çıkaracak şekilde ciğerlerimizde hava kalmayana kadar veriyoruz.",
      duration: 45,
      steps: [
        "Burnunuzdan nefes alın (4s)",
        "Karnınızı şişirin",
        "'Tıssssssssss' sesi ile nefes verin",
        "Tutarlı ses çıkarın",
        "Ciğerlerinizi tamamen boşaltın",
      ],
      benefits: [
        "Diyaframı güçlendirir",
        "Nefes kontrolünü geliştirir",
        "Vokal rezonansı artırır",
      ],
      type: "breathing",
    },
    {
      id: 7,
      title: "Ritmik Tıslama",
      description:
        "Burnumuzdan sakince nefesi alıyoruz ve karnımızı iyice şişiriyoruz. Nefesi verirken 'Tısss – Tısss – Tısss …' sesi çıkaracak şekilde ciğerlerimizde hava kalmayana kadar veriyoruz.",
      duration: 45,
      steps: [
        "Burnunuzdan nefes alın (4s)",
        "Karnınızı şişirin",
        "Ritmik 'Tısss – Tısss – Tısss' sesi ile nefes verin",
        "Tutarlı ritim koruyun",
        "Ciğerlerinizi tamamen boşaltın",
      ],
      benefits: [
        "Nefes kontrolünü geliştirir",
        "Ritim algısını artırır",
        "Vokal kasları güçlendirir",
      ],
      type: "breathing",
    },
    {
      id: 8,
      title: "Vokal 'A' Nefesi",
      description:
        "Burnumuzdan sakince nefesi alıyoruz ve karnımızı iyice şişiriyoruz. Nefesi net bir 'AAAAAAAA' sesi çıkararak ciğerlerimizde hava kalmayana kadar veriyoruz.",
      duration: 45,
      steps: [
        "Burnunuzdan nefes alın (4s)",
        "Karnınızı şişirin",
        "'AAAAAAAA' sesi ile nefes verin",
        "Tutarlı ton koruyun",
        "Ciğerlerinizi tamamen boşaltın",
      ],
      benefits: [
        "Ses tellerini güçlendirir",
        "Nefes kontrolünü geliştirir",
        "Vokal projeksiyonu artırır",
      ],
      type: "breathing",
    },
    {
      id: 9,
      title: "Sesli Harf Dizisi",
      description:
        "Burnumuzdan sakince nefesi alıyoruz ve karnımızı iyice şişiriyoruz. Nefesi 'A – E – İ – O – U' seslerini çıkararak ciğerlerimizde hava kalmayana kadar veriyoruz.",
      duration: 60,
      steps: [
        "Burnunuzdan nefes alın (4s)",
        "Karnınızı şişirin",
        "'A – E – İ – O – U' sesleri ile nefes verin",
        "Her sesli harfi net telaffuz edin",
        "Ciğerlerinizi tamamen boşaltın",
      ],
      benefits: [
        "Artikülasyonu geliştirir",
        "Vokal aralığını artırır",
        "Nefes kontrolünü güçlendirir",
      ],
      type: "breathing",
    },
    {
      id: 10,
      title: "Köpek Soluması",
      description:
        "Köpek soluması olarak adlandırdığımız bu egzersizde dilimizi dışarı çıkarıyoruz ve diyaframımıza seri şekilde nefesler alıp veriyoruz.",
      duration: 30,
      steps: [
        "Dilinizi hafifçe dışarı çıkarın",
        "Hızlı bir şekilde nefes alıp verin",
        "Diyaframınızı kullanın",
        "Tutarlı ritim koruyun",
        "30 saniye devam edin",
      ],
      benefits: [
        "Diyaframı güçlendirir",
        "Oksijen alımını artırır",
        "Vücudu enerjiler",
      ],
      type: "breathing",
    },
  ];

  const mouthExercises: MouthExercise[] = [
    {
      id: 1,
      title: "Sesli Harf Artikülasyonu",
      description:
        "Diyafram nefesi kullanarak ve ağzınızı abartılı bir şekilde açarak aşağıdaki harfleri söyleyiniz:",
      practice: "U İ",
      duration: 30,
      steps: [
        "Derin nefes alın",
        "'U' harfini abartılı ağız açışı ile telaffuz edin",
        "Tekrar nefes alın",
        "'İ' harfini abartılı ağız açışı ile telaffuz edin",
        "Diziyi tekrarlayın",
      ],
      benefits: [
        "Sesli harf netliğini geliştirir",
        "Yüz kaslarını güçlendirir",
        "Artikülasyonu artırır",
      ],
      type: "mouth",
    },
    {
      id: 2,
      title: "Hece Tekrarı",
      description:
        "Diyafram nefesi kullanarak ve ağzınızı abartılı bir şekilde açarak aşağıdaki egzersizi okuyunuz:",
      practice: "Manamana Menemene Minimini Monomono Munumunu",
      duration: 45,
      steps: [
        "Derin nefes alın",
        "Her heceyi net telaffuz edin",
        "Ağız hareketlerini abartın",
        "Tutarlı ritim koruyun",
        "Tam diziyi tamamlayın",
      ],
      benefits: [
        "Diksiyonu geliştirir",
        "Artikülasyon kaslarını güçlendirir",
        "Konuşma netliğini artırır",
      ],
      type: "mouth",
    },
    {
      id: 3,
      title: "Sibilant Sesler",
      description:
        "Diyafram nefesi kullanarak ve ağzınızı abartılı bir şekilde açarak aşağıdaki egzersizi okuyunuz:",
      practice: "Sa Şa Za Se Şe Ze Si Şi Zi So Şo Zo Su Şu Zu",
      duration: 60,
      steps: [
        "Derin nefes alın",
        "Her sesi net telaffuz edin",
        "Ağız hareketlerini abartın",
        "'s', 'ş', ve 'z' seslerine odaklanın",
        "Tam diziyi tamamlayın",
      ],
      benefits: [
        "Sibilant sesleri geliştirir",
        "Konuşma netliğini artırır",
        "Dil kontrolünü güçlendirir",
      ],
      type: "mouth",
    },
    {
      id: 4,
      title: "Ünsüz Kombinasyonları",
      description:
        "Diyafram nefesi kullanarak ve ağzınızı abartılı bir şekilde açarak aşağıdaki egzersizi okuyunuz:",
      practice: "O Pi Kap Bu Pi Kap Şu Pi Kap",
      duration: 45,
      steps: [
        "Derin nefes alın",
        "Her heceyi net telaffuz edin",
        "Ağız hareketlerini abartın",
        "Sesler arası geçişlere odaklanın",
        "Tam diziyi tamamlayın",
      ],
      benefits: [
        "Ünsüz netliğini geliştirir",
        "Konuşma ritmini artırır",
        "Artikülasyonu güçlendirir",
      ],
      type: "mouth",
    },
    {
      id: 5,
      title: "Bileşik Sesler",
      description:
        "Diyafram nefesi kullanarak ve ağzınızı abartılı bir şekilde açarak aşağıdaki egzersizi okuyunuz. Her satır bir nefeste okunmalıdır:",
      practice:
        "ping-pong ping-pong ping-pong ping-pong\nding-dong ding-dong ding-dong ding-dong\nking-kong king-kong king-kong king-kong",
      duration: 60,
      steps: [
        "Derin nefes alın",
        "Her satırı tek nefeste okuyun",
        "Ağız hareketlerini abartın",
        "Tutarlı ritim koruyun",
        "Üç satırı da tamamlayın",
      ],
      benefits: [
        "Nefes kontrolünü geliştirir",
        "Konuşma ritmini artırır",
        "Artikülasyon kaslarını güçlendirir",
      ],
      type: "mouth",
    },
    {
      id: 6,
      title: "Ünsüz-Sesli Harf Çiftleri",
      description:
        "Diyafram nefesi kullanarak ve ağzınızı abartılı bir şekilde açarak aşağıdaki egzersizi okuyunuz:",
      practice:
        "pa-pe pi-po-ba-be-bi-bo-ma-me-mi-mo\nPap-pep-pip-pop-bab-beb-bib-bob-mam-mem-mim-mom",
      duration: 60,
      steps: [
        "Derin nefes alın",
        "Her heceyi net telaffuz edin",
        "Ağız hareketlerini abartın",
        "Ünsüz-sesli harf geçişlerine odaklanın",
        "Her iki satırı da tamamlayın",
      ],
      benefits: [
        "Artikülasyonu geliştirir",
        "Konuşma netliğini artırır",
        "Yüz kaslarını güçlendirir",
      ],
      type: "mouth",
    },
    {
      id: 7,
      title: "Diş Ünsüzleri",
      description:
        "Diyafram nefesi kullanarak ve ağzınızı abartılı bir şekilde açarak aşağıdaki egzersizi okuyunuz:",
      practice:
        "Da-de-di-do-na-ne-ni-no-ta-te-ti-to\nDad-ded-did-dod-nan-nen-nin-non-tat-tet-tit-tot",
      duration: 60,
      steps: [
        "Derin nefes alın",
        "Her heceyi net telaffuz edin",
        "Ağız hareketlerini abartın",
        "'d', 'n', ve 't' seslerine odaklanın",
        "Her iki satırı da tamamlayın",
      ],
      benefits: [
        "Diş ünsüzü netliğini geliştirir",
        "Dil yerleşimini artırır",
        "Artikülasyonu güçlendirir",
      ],
      type: "mouth",
    },
    {
      id: 8,
      title: "Velar Ünsüzler",
      description:
        "Diyafram nefesi kullanarak ve ağzınızı abartılı bir şekilde açarak aşağıdaki egzersizi okuyunuz:",
      practice: "Kah-keh-kıh-kih-koh-köh-kuh-küh",
      duration: 45,
      steps: [
        "Derin nefes alın",
        "Her heceyi net telaffuz edin",
        "Ağız hareketlerini abartın",
        "Ağzın arkasındaki 'k' sesine odaklanın",
        "Tam diziyi tamamlayın",
      ],
      benefits: [
        "Velar ünsüz netliğini geliştirir",
        "Ağız arkası artikülasyonunu artırır",
        "Konuşma kaslarını güçlendirir",
      ],
      type: "mouth",
    },
    {
      id: 9,
      title: "Son Ünsüz Kümeleri",
      description:
        "Diyafram nefesi kullanarak ve ağzınızı abartılı bir şekilde açarak aşağıdaki egzersizi okuyunuz. Her satır bir nefeste okunmalıdır:",
      practice:
        "ark-erk-ırk-irk-ork-örk-urk-ürk\nart-ert-ırt-irt-ort-ört-urt-ürt\nars-ers-ırs-irs-ors-örs-urs-ürs\narf-erf-ırf-irf-orf-örf-urf-ürf",
      duration: 75,
      steps: [
        "Derin nefes alın",
        "Her satırı tek nefeste okuyun",
        "Ağız hareketlerini abartın",
        "Son ünsüz kümelerine odaklanın",
        "Dört satırı da tamamlayın",
      ],
      benefits: [
        "Ünsüz küme netliğini geliştirir",
        "Nefes kontrolünü artırır",
        "Artikülasyon kaslarını güçlendirir",
      ],
      type: "mouth",
    },
    {
      id: 10,
      title: "Direnç Antrenmanı",
      description:
        "Elinizi yumruk yapın ve çenenizin altına yerleştirin. Ağzını çok abartılı bir şekilde açarak alfabeyi okumaya çalışırken yumruğunuz çenenize baskı uygulasın ve ağzınızı açtırmamaya çalıştırsın.",
      practice: "A-B-C-Ç-D-E-F-G-H-I-İ-J-K-L-M-N-O-Ö-P-R-S-Ş-T-U-Ü-V-Y-Z",
      duration: 90,
      steps: [
        "Yumruğunuzu çenenizin altına yerleştirin",
        "Hafif direnç uygulayın",
        "Dirence karşı ağzınızı açın",
        "Her harfi net telaffuz edin",
        "Tüm alfabeyi tamamlayın",
      ],
      benefits: [
        "Çene kaslarını güçlendirir",
        "Artikülasyonu geliştirir",
        "Ağız kontrolünü artırır",
      ],
      type: "mouth",
    },
  ];

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(true);
    // setTimer(0); // Remove this line to resume from current timer value
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev >= maxTime) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setIsPlaying(false);
          return maxTime;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(false);
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(false);
    setTimer(0);
  };

  const handleExerciseSelect = (id: number, duration: number) => {
    resetTimer();
    setActiveExercise(id);
    setMaxTime(duration);
  };

  // Add handler for next exercise
  const handleNextExercise = () => {
    if (activeExercise !== null) {
      const currentIdx = currentExercises.findIndex(
        (ex) => ex.id === activeExercise
      );
      const nextIdx = currentIdx + 1;
      if (nextIdx < currentExercises.length) {
        handleExerciseSelect(
          currentExercises[nextIdx].id,
          currentExercises[nextIdx].duration
        );
      } else {
        // Optionally wrap to first exercise, or do nothing
        // handleExerciseSelect(currentExercises[0].id, currentExercises[0].duration);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const currentExercises =
    activeTab === "breathing" ? breathingExercises : mouthExercises;
  const activeExerciseData = currentExercises.find(
    (ex) => ex.id === activeExercise
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Vokal Gelişim Egzersizleri
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-md flex">
            <button
              onClick={() => {
                setActiveTab("breathing");
                setActiveExercise(null);
                resetTimer();
              }}
              className={`flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "breathing"
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Wind className="h-4 w-4 mr-2" />
              Nefes Egzersizleri
            </button>
            <button
              onClick={() => {
                setActiveTab("mouth");
                setActiveExercise(null);
                resetTimer();
              }}
              className={`flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "mouth"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Ağız Gelişim Uygulamaları
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
                    Nefes Egzersizleri
                  </span>
                ) : (
                  <span className="flex items-center text-purple-800">
                    <Smile className="h-5 w-5 mr-2" />
                    Ağız Gelişim Uygulamaları
                  </span>
                )}
              </h2>
            </div>

            <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
              {currentExercises.map((exercise, idx) => (
                <button
                  key={exercise.id}
                  onClick={() =>
                    handleExerciseSelect(exercise.id, exercise.duration)
                  }
                  className={`w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors flex items-center ${
                    activeExercise === exercise.id
                      ? activeTab === "breathing"
                        ? "bg-teal-50"
                        : "bg-purple-50"
                      : ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      activeTab === "breathing"
                        ? "bg-teal-100 text-teal-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">
                      Egzersiz {idx + 1}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                      {exercise.description}
                    </p>
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
                        activeTab === "breathing"
                          ? "text-teal-800"
                          : "text-purple-800"
                      }`}
                    >
                      Egzersiz{" "}
                      {currentExercises.findIndex(
                        (ex) => ex.id === activeExerciseData?.id
                      ) + 1}
                    </h2>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-slate-500" />
                      <span className="text-sm text-slate-500">
                        {activeExerciseData?.duration}s
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                        Açıklama
                      </h3>
                      <p className="text-slate-700">
                        {activeExerciseData?.description}
                      </p>
                    </div>

                    {activeTab === "mouth" &&
                      activeExerciseData &&
                      "practice" in activeExerciseData && (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                            Uygulama Metni
                          </h3>
                          <div
                            className={`p-4 rounded-lg bg-purple-50 border border-purple-100 text-center font-medium text-purple-800 whitespace-pre-line`}
                          >
                            {(activeExerciseData as MouthExercise).practice}
                          </div>
                        </div>
                      )}

                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                        Adımlar
                      </h3>
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
                      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                        Faydalar
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {activeExerciseData?.benefits.map((benefit, index) => (
                          <div
                            key={index}
                            className="flex items-center p-2 rounded-lg bg-slate-50 border border-slate-200"
                          >
                            <CheckCircle
                              className={`h-4 w-4 mr-2 ${
                                activeTab === "breathing"
                                  ? "text-teal-500"
                                  : "text-purple-500"
                              }`}
                            />
                            <span className="text-sm text-slate-700">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timer */}
                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                          Egzersiz Zamanlayıcısı
                        </h3>
                        <div className="text-sm text-slate-500">
                          {formatTime(timer)} / {formatTime(maxTime)}
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
                        <div
                          className={`h-2.5 rounded-full ${
                            activeTab === "breathing"
                              ? "bg-teal-500"
                              : "bg-purple-500"
                          }`}
                          style={{ width: `${(timer / maxTime) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex flex-col xs:flex-row sm:flex-row md:flex-row lg:flex-row justify-center items-stretch gap-3 sm:gap-4 md:gap-4 lg:gap-4 w-full">
                        {!isPlaying ? (
                          <button
                            onClick={startTimer}
                            className={`w-full sm:w-auto px-6 py-2 rounded-lg flex items-center justify-center font-medium text-white ${
                              activeTab === "breathing"
                                ? "bg-teal-500 hover:bg-teal-600"
                                : "bg-purple-500 hover:bg-purple-600"
                            }`}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Egzersizi Başlat
                          </button>
                        ) : (
                          <button
                            onClick={pauseTimer}
                            className="w-full sm:w-auto px-6 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg flex items-center justify-center font-medium text-white"
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Duraklat
                          </button>
                        )}
                        <button
                          onClick={resetTimer}
                          className="w-full sm:w-auto px-6 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg flex items-center justify-center font-medium text-slate-700"
                        >
                          <Repeat className="h-4 w-4 mr-2" />
                          Sıfırla
                        </button>
                        <button
                          onClick={handleNextExercise}
                          className={`w-full sm:w-auto px-6 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg flex items-center justify-center font-medium text-slate-700 ${activeExercise !== null && currentExercises.findIndex((ex) => ex.id === activeExercise) === currentExercises.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={
                            activeExercise === null ||
                            currentExercises.findIndex(
                              (ex) => ex.id === activeExercise
                            ) ===
                              currentExercises.length - 1
                          }
                        >
                          <ChevronRight className="h-4 w-4 mr-2" />
                          Sonraki Egzersiz
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
                      activeTab === "breathing"
                        ? "bg-teal-100"
                        : "bg-purple-100"
                    }`}
                  >
                    {activeTab === "breathing" ? (
                      <Wind className="h-10 w-10 text-teal-600" />
                    ) : (
                      <MessageSquare className="h-10 w-10 text-purple-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    Bir Egzersiz Seçin
                  </h3>
                  <p className="text-slate-600 text-center mb-6 max-w-md">
                    Detayları görüntülemek ve pratik yapmaya başlamak için
                    listeden bir egzersiz seçin
                  </p>
                  <div
                    className={`flex items-center text-sm ${
                      activeTab === "breathing"
                        ? "text-teal-600"
                        : "text-purple-600"
                    }`}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    <span>
                      {activeTab === "breathing"
                        ? "Nefes egzersizleri vokal kontrolü geliştirmeye ve gerginliği azaltmaya yardımcı olur"
                        : "Ağız egzersizleri artikülasyonu ve konuşma netliğini artırır"}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Video Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-teal-50 to-purple-50">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center">
              <PlayCircle className="h-5 w-5 mr-2 text-slate-600" />
              Eğitim Videoları
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Egzersizleri doğru şekilde yapmayı öğrenmek için bu videoları
              izleyin
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                  <video controls className="w-full h-full object-cover">
                    <source
                      src="https://sistem.e-kekemelik.com/uye/ses/armoni-nefes2.mp4#t=0.5"
                      type="video/mp4"
                    />
                    Tarayıcınız video oynatmayı desteklemiyor.
                  </video>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-slate-700">
                    Nefes Egzersizleri Rehberi
                  </h3>
                  <p className="text-sm text-slate-500">
                    Doğru nefes tekniklerini öğrenin ve diyafram nefesini nasıl
                    kullanacağınızı keşfedin
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                  <video controls className="w-full h-full object-cover">
                    <source
                      src="https://sistem.e-kekemelik.com/uye/ses/armoni-agiz-proje2.mp4#t=0.5"
                      type="video/mp4"
                    />
                    Tarayıcınız video oynatmayı desteklemiyor.
                  </video>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-slate-700">
                    Ağız Gelişim Teknikleri
                  </h3>
                  <p className="text-sm text-slate-500">
                    Artikülasyon egzersizlerini nasıl yapacağınızı ve ağız
                    kaslarınızı nasıl güçlendireceğinizi öğrenin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center">
              <Info className="h-5 w-5 mr-2 text-slate-600" />
              Etkili Pratik İçin İpuçları
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <Wind className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">
                    Nefes Tekniği
                  </h3>
                  <p className="text-slate-600">
                    Her zaman diyaframınızdan nefes alın, göğsünüzden değil.
                    Nefes aldığınızda karnınız şişmeli, omuzlarınız
                    yükselmemeli.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">
                    Düzenli Pratik
                  </h3>
                  <p className="text-slate-600">
                    Bu egzersizleri günde 10-15 dakika pratik edin. Doğru
                    tekniği geliştirmek için süreklilik süreden daha önemlidir.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                  <Smile className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">
                    Rahat Duruş
                  </h3>
                  <p className="text-slate-600">
                    Bu egzersizleri yaparken çenenizi, boynunuzu ve omuzlarınızı
                    rahat tutun. Gerginlik doğru hava akışını ve artikülasyonu
                    kısıtlar.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <ArrowRight className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">
                    Aşamalı Zorluk
                  </h3>
                  <p className="text-slate-600">
                    Basit egzersizlerle başlayın ve zorluğu kademeli olarak
                    artırın. Daha karmaşık kalıplara geçmeden önce temelleri
                    öğrenin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
