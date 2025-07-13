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

export default function AgizVeNefesEgzersizleriMakalesi() {
  return (
    <article className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Makale başlığı */}
        <div className="mb-8">
          <Link href="/articles" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Makalelere Geri Dön
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Kekemelik İçin Nefes ve Ağız Egzersizleri
          </h1>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">10 Mayıs 2025</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>5 dakika okuma</span>
          </div>

          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Nefes ve Ağız Egzersizleri"
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
                <Wind className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Nefes Almanın Önemini Anlamak</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Nefes almak yaşamın temel bir parçasıdır, ancak çoğumuz bunu hafife alırız. Doğru nefes almak sadece
              vücudumuzun fonksiyonlarını desteklemekle kalmaz, aynı zamanda stresi, kaygıyı ve hatta konuşma akıcılığını
              yönetmede de kritik bir rol oynar. Kekemelik ile mücadele edenler için doğru nefes almayı öğrenmek
              dönüştürücü olabilir.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Lungs className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Diyafram Nefesi Nedir?</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Karın nefesi olarak da bilinen diyafram nefesi, akciğerlerin altında bulunan diyafram kasını kullanan bir
              tekniktir. Akciğerlerin sadece küçük bir kısmını dolduran yüzeysel göğüs nefesinin aksine, diyafram nefesi
              tam bir oksijen değişimine olanak tanır. Bu tür nefes alma sinir sistemini sakinleştirir, stresi azaltır
              ve konuşmanın daha iyi kontrol edilmesini destekler.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <List className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Diyafram Nefesi Nasıl Uygulanır</h2>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    1
                  </div>
                  <span className="text-gray-700">Rahat bir şekilde oturun veya uzanın.</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    2
                  </div>
                  <span className="text-gray-700">Bir elinizi göğsünüze, diğerini karnınıza koyun.</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    3
                  </div>
                  <span className="text-gray-700">
                    Burun yoluyla yavaşça nefes alın, karnınızın yükseldiğinden ve göğsünüzün sabit kaldığından emin olun.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    4
                  </div>
                  <span className="text-gray-700">Ağız yoluyla yavaşça nefes verin, karnınızın alçaldığını hissedin.</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    5
                  </div>
                  <span className="text-gray-700">Bu süreci günlük birkaç dakika boyunca tekrarlayın.</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Ağız Egzersizlerinin Kekemelikteki Rolü</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Ağız egzersizleri konuşmada yer alan kasları güçlendirmeye yardımcı olur. Düzenli uygulama kas
              koordinasyonunu geliştirir, kelimeleri net ve akıcı bir şekilde telaffuz etmeyi kolaylaştırır. Bu
              egzersizler ayrıca kekemeler için çok önemli olan ağız hareketleri farkındalığını da artırır.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <List className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Etkili Ağız Egzersizleri</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Dudak Titrişi</h3>
                <p className="text-gray-700 text-sm">
                  Dudaklarınızı birbirine bastırın ve titreşim sesi çıkarmak için hava üfleyin. Bu dudakları
                  gevşetmeye ve hava akışı kontrolünü geliştirmeye yardımcı olur.
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Dil Germe Egzersizleri</h3>
                <p className="text-gray-700 text-sm">
                  Dilinizi dışarı çıkarın, yukarı, aşağı ve yan yanlara hareket ettirin. Bu dil esnekliğini artırır.
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Sesli Harf Tekrarları</h3>
                <p className="text-gray-700 text-sm">
                  Sesli harfleri (A, E, I, O, U) yavaşça telaffuz edin, net bir artikülasyona odaklanın.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Repeat className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Nefes ve Ağız Egzersizlerini Birleştirmek</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Kekemeler için hem nefes hem de ağız egzersizlerini kullanmak önemli gelişmelere yol açabilir. Bu
              kombinasyon konuşurken sakinliği korumaya yardımcı olur, gerilimi azaltır ve genel konuşma kontrolünü
              geliştirir.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Tutarlılık Neden Anahtar</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Nefes ve ağız egzersizlerinde başarı tutarlılıktan gelir. Bu teknikleri her gün, sadece birkaç dakika
              bile olsa uygulamak, vücudunuzu ve zihninizi daha akıcı konuşmak için yavaş yavaş yeniden eğitebilir.
              Bir rutin oluşturmak ve ilerlemenizi takip etmek devam etmeniz için motivasyon sağlayabilir.
            </p>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-gray-700 italic">
              Nefes ve ağız egzersizleri kekemelik ile mücadele eden herkes için basit ama güçlü araçlardır. Düzenli
              olarak uygulandığında, konuşmanız üzerinde kontrol kazanmanıza ve özgüveninizi artırmanıza yardımcı
              olabilirler.
            </p>
          </div>
        </div>

        {/* Makale alt bilgisi */}
        
        </div>

        
        
      
    </article>
  )
}