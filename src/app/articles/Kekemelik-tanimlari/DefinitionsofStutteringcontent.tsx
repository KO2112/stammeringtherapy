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
          <a href="/articles" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Makalelere Geri Dön
          </a>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">Kekemelik Tanımları</h1>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">10 Mayıs 2025</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>10 dakika okuma</span>
          </div>

          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <div className="text-blue-600 text-6xl font-bold opacity-20">
              Kekemelik
            </div>
          </div>
        </div>

        {/* Article content */}
        <div className="prose prose-lg max-w-none">
          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Kekemeliğin Karmaşıklığını Anlamak</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Kekemelik, çoklu boyutları ve nedenleri olan karmaşık bir iletişim problemidir (Ramig & Shames, 1998).
              Van Riper (1982) kekemeliği birçok eksik parçası olan zor bir bulmacaya benzetti. Yıllar boyunca,
              araştırmacılar kekemeliğin çeşitli tanımlarını sunmuşlardır ve her biri farklı perspektifleri yansıtmaktadır. 
              Bazıları kekemelik sırasında ne olduğuna odaklanırken, diğerleri nedenlerini veya dinleyiciler ve 
              konuşmacılar üzerindeki etkilerini vurgular. Bazı tanımlar daha kapsamlı bir anlayış için bu bakış açılarını 
              birleştirmeye bile çalışır (Ramig & Shames, 1998).
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Araştırmacıların kekemeliğin tek bir tanımı üzerinde anlaşmakta zorlanmalarının bir nedeni, davranışın 
              farklı yönlerine odaklanmalarıdır. Johnson (1958) bu çeşitliliği bir fili tarif eden altı kör adamın 
              hikayesiyle açıkladı. Her adam hayvanı farklı şekilde tarif etti çünkü her biri farklı bir parçasına 
              dokundu. Benzer şekilde, kekemelik tanımları her araştırmacının vurguladığı yöne göre değişir 
              (Silverman, 2004 te belirtildiği gibi).
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <History className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Kekemeliğin Erken Tanımları</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              En erken tanımlardan biri 1940 larda ve 1950 lerde Johnson ve meslektaşlarından geldi. Kekemeliği 
              hoş olmayan, endişeli, hipertonik bir kaçınma tepkisi olarak tanımladılar. Başka bir deyişle, 
              kekemeliğin konuşmacının kekemelik beklediği, korku hissettiği, gerginleştiği ve durumdan kaçınmaya 
              çalıştığı zamanlarda yaptığı şey olduğuna inanıyorlardı (Manning, 2010 da belirtildiği gibi). 
              Ancak bu tanım sınırlıydı çünkü belirgin korku veya gerilim olmadan ortaya çıkan kekemelik 
              vakalarını göz ardı ediyordu (Silverman, 2004).
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Konuşma Temelli Tanımlar</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Bazı tanımlar sadece kekemeliğin işitilebilir yönlerine odaklanmıştır. Van Riper kekemeliği 
              konuşmanın normal akışı ve ritmindeki bir bozulma olarak tanımladı. Andrews ve arkadaşları (1983) 
              daha da ileri giderek, tekrarlar ve uzatmaların kekemeliği tanımlamak için yeterli olduğunu savundu. 
              Ancak normal konuşma da bu özellikleri içerebilir, bu da kekemelik ile normal akıcısızlık arasında 
              ayrım yapmayı zorlaştırır (Silverman, 2004).
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Van Riper (1982) daha sonra tanımını genişleterek, kekemeliğin konuşma akışının bozuk bir ses, 
              hece veya kelime tarafından veya konuşmacının bu bozulmaya tepkisi tarafından kesintiye uğradığı 
              zaman meydana geldiğini öne sürdü. Bu tanım dinleyicinin tepkisini de içeriyordu, bu da onu 
              daha kapsamlı hale getiriyordu.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Dinleyicinin Perspektifi</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Perkins (1990) probleme farklı şekilde yaklaştı, dinleyiciden ziyade kekemeyen kişinin deneyimine 
              odaklandı. Kekemelikte görülen akıcısızlık türlerinin normal konuşmada da ortaya çıktığını belirtti. 
              Anahtar farkın, kekemeyen kişinin kontrol kaybı yaşaması olduğunu savundu, bu da problemi 
              istemsiz hale getiriyordu.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Wingatein Standart Tanımı</h2>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                Wingate (1964) kekemeliğin standart bir tanımını sundu ve bunu üç ana bölüme ayırdı:
              </p>
              <ol className="mt-4 space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    1
                  </div>
                  <span className="text-gray-700">
                    Kekemeliğin temel özelliklerini tanımladı: seslerin, hecelerin veya kelimelerin 
                    istemsiz, işitilebilir veya sessiz tekrarları ve uzatmaları.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    2
                  </div>
                  <span className="text-gray-700">
                    Yüz hareketleri veya gerilim gibi ikincil davranışların olası varlığını belirtti.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    3
                  </div>
                  <span className="text-gray-700">
                    Utanç veya endişe duyguları gibi kekemeliğin sık görülen duygusal etkisini bahsetti.
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
              <h2 className="text-2xl font-bold text-gray-900">Psikolojik ve Fizyolojik Tanımlar</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Kekemelik aynı zamanda psikolojik ve fizyolojik terimlerle de tanımlanmıştır. Murphy (1986) 
              kekemeliği endişe veya yetersizlik duygularına karşı duygusal bir tepki olarak gördü. 
              Benzer şekilde, Brutten ve Shomaker (1986) kekemeliği koşullanmış duygusal bir tepki 
              olarak tanımladı.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Fizyolojik perspektiften, Rosenfield ve Nudelman (1987) kekemeliği nörofizyolojik 
              sorunlar nedeniyle motor çıktıların zamanlaması ve sıralamasındaki bir bozulma 
              olarak gördü. Kehoe (1998) konuşmada kas kontrolünün rolünü vurguladı ve 
              uygunsuz kas kullanımının kekemeliğe yol açabileceğini öne sürdü.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">DSM-IV Tanımı</h2>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <p className="text-gray-700">
                Amerikan Psikiyatri Birliği (DSM-IV) kekemeliği, tekrarlanan ses ve hece tekrarları, 
                uzatmalar, bloklar veya konuşma akışındaki diğer bozulmalar içeren bir bozukluk 
                olarak tanımlar. Bu bozulmalar eğitimsel, mesleki veya sosyal iletişimi önemli 
                ölçüde engeller.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Çok Yönlü Bir Problem</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Kekemeliği tanımlamak zordur çünkü çeşitli konuşma davranışları, duygular, inançlar, 
              öz algı ve sosyal etkileşimleri içerir. Bu bileşenler bireyler arasında değişir ve 
              karmaşık şekillerde etkileşir. Son yıllarda kekemelik, sadece konuşmayı değil, 
              aynı zamanda bir kişinin yaşamının duygusal ve sosyal yönlerini de etkileyen 
              çok boyutlu bir problem olarak giderek daha fazla görülmektedir.
            </p>
          </div>
        </div>

        


          
      </div>
    </article>
  )
}