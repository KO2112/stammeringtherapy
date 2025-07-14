"use client"

import { Mail, Phone, Clock } from "lucide-react"

export default function IletisimContent() {
  return (
    <main className="pt-24">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-16 right-16 w-24 h-24 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white/20 rounded-lg rotate-45 animate-spin-slow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              İletişim
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              E-Kekemelik ve Armoni Dil ve Konuşma Merkezi ile ilgili sorularınız, önerileriniz veya iş birliği
              talepleriniz için bize ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Bizimle İletişime Geçin</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Size en iyi hizmeti sunabilmek için buradayız. Aşağıdaki iletişim bilgilerinden bize ulaşabilirsiniz.
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3x1 mx-auto">
            {/* Email Card */}
            <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-slate-100 hover:border-blue-200 hover:-translate-y-2">
              <div className="text-center">
                <div className="inline-flex h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-6">
                  <Mail className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">E-posta Adresi</h3>
                <p className="text-slate-500 mb-4">7/24 size hizmet vermek için</p>
                <a
                  href="mailto:info@armonikekemeliktedavisi.com"
                  className="inline-block text-lg text-blue-700 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
                >
                  info@armonikekemeliktedavisi.com
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-slate-100 hover:border-blue-200 hover:-translate-y-2">
              <div className="text-center">
                <div className="inline-flex h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-6">
                  <Phone className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Telefon Numarası</h3>
                <p className="text-slate-500 mb-4">Hızlı destek için arayın</p>
                <a
                  href="tel:+902324215145"
                  className="inline-block text-lg text-blue-700 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
                >
                  0 (232) 421 51 45
                </a>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-white rounded-2xl shadow-lg px-8 py-4 border border-slate-100">
              <Clock className="h-6 w-6 text-blue-600" />
              <div>
                <span className="text-slate-600 font-medium">Çalışma Saatleri: </span>
                <span className="text-slate-900 font-semibold">Pazartesi - Cuma, 09:00 - 18:00</span>
              </div>
            </div>
          </div>

          
          
        </div>
      </section>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </main>
  )
}
