"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users, Award, Globe, Calendar, MessageSquare, ArrowRight, CheckCircle } from "lucide-react"

const AboutPage = () => {
  interface VisibilityState {
    stats: boolean
    story: boolean
    approach: boolean
  }

  const [isVisible, setIsVisible] = useState<VisibilityState>({
    stats: false,
    story: false,
    approach: false,
  })

  useEffect(() => {
    const observerOptions = { threshold: 0.2 }
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

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Stammering-Therapy-logo.png"
            alt="Kekemelik Tedavi Ekibi"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-blue-800"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              <span className="text-blue-300">Armoni Kekemelik Tedavisi</span> Hakkında
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Kekemelik sorunu yaşayan bireylerin akıcı ve güvenli konuşma becerisi kazanmasına yardımcı olan küresel konuşma terapisi uzmanları ekibi.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/hizmetlerimiz"
                className="px-6 py-3 bg-white text-blue-800 rounded-full font-medium hover:bg-blue-50 transition-all duration-300 shadow-lg"
              >
                Hizmetlerimiz
              </Link>
              <Link
                href="/iletisim"
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-all duration-300"
              >
                İletişim
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* İstatistikler */}
      <section id="stats-section" className="relative z-10 -mt-12 mb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible.stats ? "visible" : "hidden"}
          >
            <motion.div
              variants={fadeIn}
              className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-blue-500 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="text-3xl font-bold text-blue-600 mb-1">23+</div>
              <p className="text-gray-700 text-sm">Yıl Deneyim</p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-blue-500 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="text-3xl font-bold text-blue-600 mb-1">10,000+</div>
              <p className="text-gray-700 text-sm">Yardım Edilen Müşteri</p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-blue-500 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="text-3xl font-bold text-blue-600 mb-1">3</div>
              <p className="text-gray-700 text-sm">Küresel Bölge</p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-blue-500 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="text-3xl font-bold text-blue-600 mb-1">%100</div>
              <p className="text-gray-700 text-sm">Kanıt Tabanlı</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Hikayemiz */}
      <section id="story-section" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible.story ? "visible" : "hidden"}
          >
            <motion.div variants={fadeIn} className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                  <Users size={20} />
                </span>
                Hikayemiz
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Tek bir hedefle bir araya gelen kekemelik tedavi uzmanları ekibiyiz: etkili kekemelik tedavisini 
                ihtiyacı olan herkese ulaştırmak.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Doğu Avrupa, Batı Avrupa ve Kuzey Amerikadan onlarca Odyoloji ve Konuşma Bozuklukları Uzmanı, 
                kekemelik terapisti ve konuşma terapistini bir araya getiren ortak çabamız.
              </p>
              <p className="text-gray-700 leading-relaxed">
                23 yıldan fazla birleşik deneyimimizle, dünya çapında 10.000 den fazla kişinin kekemelik 
                zorluklarını aşmasına ve konuşma güveni kazanmasına yardımcı olduk.
              </p>

              <Link
                href="/team"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group mt-4"
              >
                Ekibimizle tanışın
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <div className="h-80 rounded-2xl overflow-hidden shadow-xl">
                <Image src="/Stammering-Therapy-logo.png" alt="Kekemelik Tedavi Ekibi" fill className="object-cover" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Yaklaşımımız */}
      <section id="approach-section" className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeIn}
            initial="hidden"
            animate={isVisible.approach ? "visible" : "hidden"}
          >
            <h2 className="text-3xl font-bold text-gray-900">Yaklaşımımız</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto my-4 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kapsamlı destek sağlamak için teknolojiyi özel terapi teknikleriyle birleştiriyoruz.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible.approach ? "visible" : "hidden"}
          >
            <motion.div
              variants={fadeIn}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-32 bg-blue-600 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 text-white mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-bold text-white">E-Kekemelik Uygulaması</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Kanıt tabanlı egzersizler, kişiselleştirilmiş teknikler ve kendi kendine rehberli terapi 
                  için ilerleme takibi sağlayan yenilikçi dijital platformumuz.
                </p>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Günlük pratik egzersizleri</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">İlerleme takip panosu</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Kişiselleştirilmiş terapi planı</span>
                  </li>
                </ul>

                <Link
                  href="/signin"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Uygulamamız hakkında daha fazla bilgi
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-32 bg-blue-700 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 text-white mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-lg font-bold text-white">Özel Terapi</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Uzmanlarımız, özel kekemelik zorluklarınıza göre uyarlanmış kişiselleştirilmiş bire bir 
                  terapi seansları sunar. İhtiyaçlarınıza uygun hem yüz yüze hem de uzaktan seanslar sunuyoruz.
                </p>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Kişiselleştirilmiş terapi planları</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Yüz yüze ve uzaktan seçenekleri</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Uzman konuşma terapistleri</span>
                  </li>
                </ul>

                <Link
                  href="/hizmetlerimiz"
                  className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
                >
                  Terapi hizmetlerimizi görüntüleyin
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Yolculuğunuza Başlamaya Hazır mısınız?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Uygulama tabanlı yaklaşımımızı mı yoksa kişiselleştirilmiş terapi seanslarını mı tercih ederseniz edin, 
            ekibimiz her adımda sizi desteklemek için burada.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Uygulamayı Deneyin
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-700 transition-all duration-300"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Bize Ulaşın
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-blue-200 mr-2" />
              <span className="text-blue-100 text-sm">Sertifikalı Uzmanlar</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-blue-200 mr-2" />
              <span className="text-blue-100 text-sm">Küresel Destek</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-200 mr-2" />
              <span className="text-blue-100 text-sm">Esnek Zamanlama</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutPage