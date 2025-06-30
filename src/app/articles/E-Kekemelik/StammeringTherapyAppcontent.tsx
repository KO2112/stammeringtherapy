"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, Bookmark, MessageSquare, Mic, Users, Gauge } from "lucide-react"

export default function StammeringTherapyAppArticle() {
  return (
    <article className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Article header */}
        <div className="mb-8">
          <Link href="/articles" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Makalelere Geri Dön
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Kekemelik-Terapi-Uygulaması: Konuşmayı Dönüştürüyor, Özgüveni Artırıyor
          </h1>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">10 Mayıs 2025</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>6 dakika okuma</span>
          </div>

          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Kekemelik Terapi Uygulaması"
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
              Kekemelik Terapi Uygulamamızın Nasıl Çalıştığını Anlamak
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Kekemelik zorlu bir iletişim bozukluğu olabilir, ancak doğru araçlar ve rehberlik ile etkili bir şekilde 
              yönetilebilir. Kekemelik-Terapi-Uygulamamız, kullanıcılara doğrudan mobil cihazlarından kişiselleştirilmiş 
              terapi sağlamak için tasarlanmıştır. İşte nasıl çalıştığı.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Mic className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Daha İyi Kontrol için Ağız ve Nefes Egzersizleri</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Uygulamamız, konuşma kontrolünü artırmak için tasarlanmış çeşitli ağız ve nefes egzersizleri sunar. 
              Bu egzersizler kullanıcıların ağız kaslarını güçlendirmelerine ve nefes alma tekniklerini geliştirmelerine 
              yardımcı olarak konuşmalarını daha akıcı ve kendinden emin hale getirir.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Bookmark className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Gerçek Zamanlı Hikaye Takibi ve Okuma</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Uygulamamızın öne çıkan özelliklerinden biri hikayeleri gerçek zamanlı olarak takip etme ve okuma yeteneğidir. 
              Kullanıcılar hikayeler seçebilir ve bunları sesli olarak okuma pratiği yapabilir, uygulama ise gelişmelerine 
              yardımcı olmak için geri bildirim sağlar. Bu özellik sadece okuma akıcılığını artırmakla kalmaz, aynı zamanda 
              özgüven de kazandırır.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Uzman Terapistlerle Özel Seanslar</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Kekemelik-Terapi-Uygulamamız aynı zamanda son derece deneyimli terapistlerle özel seanslara erişim sağlar. 
              Bu terapistler kişiselleştirilmiş rehberlik sunarak kullanıcıların benzersiz zorluklarını belirlemelerine 
              ve bunları aşmak için etkili stratejiler geliştirmelerine yardımcı olur.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Gauge className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">İleri Teknikler: Konuşma Hızı Kontrolü ve Daha Fazlası</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Uygulama, Konuşma Hızı Kontrolü, Diyafram Nefesi, Ağız Motor Kontrolü ve Akıcılık Şekillendirme gibi 
              ileri teknikleri öğreterek temel egzersizlerin ötesine geçer. Bu yöntemler kekemeliğin çeşitli yönlerini 
              ele alacak şekilde tasarlanmış olup kapsamlı bir terapi deneyimi sunar.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Uygulamamız Neden Kekemelik için Mükemmel Bir Çözüm</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Kekemelik-Terapi-Uygulamamız sadece başka bir konuşma uygulaması değildir. Uzmanlar tarafından tasarlanmış, 
              gerçek zamanlı geri bildirim, kişiselleştirilmiş seanslar ve ileri teknikler sunan eksiksiz bir terapi 
              çözümüdür. İster yeni başlayan olun ister daha da gelişmek isteyen biri olun, uygulamamız akıcı, kendinden 
              emin konuşma elde etmek için ihtiyacınız olan her şeye sahiptir.
            </p>
          </div>
        </div>

        

        
      </div>
    </article>
  )
}