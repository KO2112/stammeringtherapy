"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
      excerpt: "Kekemelik nedir ve insanları nasıl etkiler?",
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
      excerpt:
        "Uzmanların kekemeliği çeşitli perspektiflerden nasıl tanımladığını keşfedin.",
      date: "3 Nisan 2025",
      readTime: "7 dk okuma",
      slug: "Kekemelik-tanimlari",
    },
  ];

  return (
    <section className="pt-24">
      {/* Hero Section */}
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
              Makaleler
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Kekemelik, terapi yöntemleri ve güncel yaklaşımlar hakkında
              bilgilendirici makaleler.
            </p>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 mt-16">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg"
            >
              <div className="h-48 bg-blue-100 relative">
                <Image
                  src="/Stammering-Therapy-logo.png"
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{article.date}</span>
                  <span className="mx-2">•</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <Link
                  href={`/makaleler/${article.slug}`}
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
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
}
