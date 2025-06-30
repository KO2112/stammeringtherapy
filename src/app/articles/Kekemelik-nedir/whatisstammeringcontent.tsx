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

export default function KekemelikNedirMakalesi() {
  return (
    <article className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Makale başlığı */}
        <div className="mb-8">
          <Link href="/articles" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Makalelere Geri Dön
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">Kekemelik Nedir?</h1>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">10 Mayıs 2025</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>8 dakika okuma</span>
          </div>

          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Kekemelik Nedir"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Makale içeriği */}
        <div className="prose prose-lg max-w-none">
          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Kekemeliği Anlamadan Önce Akıcılığı Anlamak</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Birçok araştırmacı, kekemeliği açıklamadan önce akıcılığı tanımlamanın önemini vurgulamıştır.
              Starkweathera (1987) göre akıcılık, konuşma ve dil performansında kolaylık anlamına gelir. Akıcı konuşanlar
              konuşmada o kadar beceriklidirler ki bunu zahmetsizce yaparlar. Sesler, kelimeler ve cümleler fark edilir
              duraklamalar olmadan düzgün bir şekilde akar. Akıcılık her zaman yüksek düzeyde bir dil yeterliliğine dayanır
              ve akıcı konuşmanın doğal bir ritmi vardır. Bu ritim bozulduğunda, konuşma akıcısız hale gelir.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Akıcısızlık Nedir?</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Akıcısızlık, konuşma üretiminin sürekliliğindeki kesintiler olarak tanımlanır (Starkweather, 1987).
              Silvermana (2004) göre akıcısız konuşma, heceler arasına ses eklemeyi (um veya uh gibi), ilk hece veya
              kelimeyi tekrarlamayı, telaffuz hatalarını veya hataları düzeltmeyi içerebilir. Dinleyici bunları bir
              akıcılık bozukluğunun belirtileri olarak fark etmezse, onları hiç fark etmeyebilir bile.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Kekemeliği Tanımlamak</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Geleneksel olarak kekemelik, konuşmanın ritmi veya akıcılığının kesintiler ve bloklar tarafından bozulduğu
              bir bozukluk olarak tanımlanır (Bloodstein ve Ratner, 2008). Amerikan Psikiyatri Derneğine göre
              (DSM-IV-TR, 2000), kekemeliğin ana özelliği konuşmanın akıcılığı ve zamanlamasında kişinin yaşına uygun
              olmayan bir bozulmadır.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <List className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Kekemelik Belirtileri</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">Kekemelik çeşitli şekillerde kendini gösterebilir:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Ses ve hece tekrarları</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Uzatılmış sesler</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Ses, hece veya kelime ekleme</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Kelimeleri kısmen söyleme (kelime ortasında durma)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Duyulur veya sessiz bloklar (donmuş konuşma)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Zor kelimeleri kaçınmak için kelime değiştirme</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Konuşurken aşırı fiziksel gerginlik kullanma</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Tek heceli kelimeleri tekrarlama (Ben-ben-ben onu gördüm gibi)</span>
              </li>
            </ul>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Kekemelik Gelişim Aşamaları</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">Kekemelik birkaç aşamada ilerleyebilir:</p>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">Okul Öncesi Aşama</h3>
                <p className="text-gray-700">
                  Konuşma bozuklukları düzensizdir, genellikle heyecan veya iletişim kurma baskısı ile tetiklenir.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">Okul Çağı Aşaması</h3>
                <p className="text-gray-700">
                  Kekemelik daha kronik hale gelir ve çocuk kendini kekeme olarak tanıyabilir.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">Geç Çocukluk - Erken Ergenlik</h3>
                <p className="text-gray-700">
                  Kekemelik değişkenlik gösterir ve kişi zor kelimeler veya durumlardan kaçınmaya başlayabilir.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">Geç Ergenlik - Yetişkinlik</h3>
                <p className="text-gray-700">
                  Belirli kelimeler, durumlar veya seslerden korkma gelişebilir, bu da kaçınmaya yol açar.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <GitBranch className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Kekemelik Türleri</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">Cooper (1993) üç kekemelik alt türü tanımlamıştır:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">Gelişimsel Kekemelik</h3>
                <p className="text-gray-700 text-sm">Küçük çocuklarda görülür, genellikle terapi olmadan düzelir.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">Tedavi Edilebilir Kekemelik</h3>
                <p className="text-gray-700 text-sm">Daha kalıcıdır ancak terapi ile yönetilebilir.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">Kronik Kekemelik</h3>
                <p className="text-gray-700 text-sm">Yaşam boyu yönetim gerektirebilen uzun süreli kekemelik.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-gray-700 italic">
              Kekemelik sadece bir konuşma sorunu değil, aynı zamanda öz saygı, iletişim becerileri ve sosyal etkileşimleri
              de etkileyebilir. Erken müdahale sonuçları önemli ölçüde iyileştirebilir, bu nedenle kekemeliği anlamak ve
              etkili bir şekilde ele almak çok önemlidir.
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}