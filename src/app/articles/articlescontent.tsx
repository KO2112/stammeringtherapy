"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function ArticlesPage() {
  
  const articles = [
    {
      id: 1,
      title: "E-Kekemelik Uygulaması",
      excerpt:
        "Kekemelik terapi uygulamamızın nasıl çalıştığını ve nasıl yardımcı olabileceğini öğrenin.",
      date: "5 Mayıs 2025",
      readTime: "5 dk okuma",
      slug: "E-Kekemelik",
    },
    {
      id: 2,
      title: "Kekemelik nedir",
      excerpt:
        "Kekemelik nedir ve insanları nasıl etkiler?",
      date: "28 Nisan 2025",
      readTime: "4 dk okuma",
      slug: "Kekemelik-nedir",
    },
    {
      id: 3,
      title: "Kekemelik için ağız ve nefes egzersizleri",
      excerpt:
        "Ağız ve nefes egzersizleri kekeme kişilere nasıl yardımcı olur?",
      date: "15 Nisan 2025",
      readTime: "6 dk okuma",
      slug: "Nefes-ve-agiz-teknikleri",
    },
    {
      id: 4,
      title: "Kekemelik tanımları",
      excerpt: "Uzmanların kekemeliği çeşitli perspektiflerden nasıl tanımladığını keşfedin.",
      date: "3 Nisan 2025",
      readTime: "7 dk okuma",
      slug: "Kekemelik-tanimlari",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header area */}
        <div className="text-center mb-16">
          
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Makaleler</h1>
          
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg"
            >
              <div className="h-48 bg-blue-100 relative">
                <Image src="/StammeringTherapy.png" alt={article.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{article.date}</span>
                  <span className="mx-2">•</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group"
                >
                  Devamını oku
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}