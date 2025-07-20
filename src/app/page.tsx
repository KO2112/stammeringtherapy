import type { Metadata } from "next/types";
import Script from "next/script";
import BannerSlider from "./components/bannerslider";
import TryTheAppNow from "./components/trytheappnow";
import StammeringTherapyTechniques from "./components/enhanced";
import AboutUs from "./components/AboutUs";

export const metadata: Metadata = {
  metadataBase: new URL("https://e-kekemelik.com"),
  title: "E-Kekemelik | Armoni Dil ve Konuşma Merkezi",
  description:
    "Armoni Dil ve Konuşma Merkezi, bilimsel temelli kekemelik terapi merkezi. Kanıta dayalı teknikler, egzersizler ve profesyonel destek ile kekemelik tedavisinde yanınızdayız.",
  keywords: [
    "kekemelik terapisi",
    "kekemelik tedavisi",
    "konuşma terapisi",
    "akıcılık teknikleri",
    "konuşma egzersizleri",
    "özel kekemelik terapisi",
    "konuşma uygulaması",
    "kekemelik desteği",
    "terapi teknikleri",
    "akıcılık geliştirme",
    "kekemelik uygulaması",
    "konuşma bozukluğu",
    "dil ve konuşma merkezi",
  ],
  authors: [{ name: "Armoni Dil ve Konuşma Merkezi" }],
  creator: "Armoni Dil ve Konuşma Merkezi",
  publisher: "Armoni Dil ve Konuşma Merkezi",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://e-kekemelik.com",
    title: "E-Kekemelik | Armoni Dil ve Konuşma Merkezi",
    description:
      "Bilimsel temelli kekemelik terapisi teknikleri ve profesyonel konuşma terapisi hizmetleri ile akıcı konuşmaya ulaşın.",
    siteName: "E-Kekemelik",
    images: [
      {
        url: "https://e-kekemelik.com/Stammering-Therapy-logo.png",
        width: 1200,
        height: 630,
        alt: "E-Kekemelik Uygulaması Arayüzü",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Kekemelik | Armoni Dil ve Konuşma Merkezi",
    description:
      "Bilimsel temelli kekemelik terapisi teknikleri ve profesyonel konuşma terapisi hizmetleri ile akıcı konuşmaya ulaşın.",
    creator: "@armonikekemelik",
    images: ["https://e-kekemelik.com/Stammering-Therapy-logo.png"],
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "Sağlık & Danışmanlık",
};

export default function Home() {
  return (
    <>
      <div className="bg-white">
        <main>
          <BannerSlider />
          <TryTheAppNow />
          <StammeringTherapyTechniques />
          <AboutUs />
        </main>
      </div>

      <Script id="schema-stammering-therapy" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "name": "Armoni Dil ve Konuşma Merkezi",
            "url": "https://e-kekemelik.com",
            "logo": "https://e-kekemelik.com/Stammering-Therapy-logo.png",
            "description": "Armoni Dil ve Konuşma Merkezi tarafından sunulan, bilimsel temelli kekemelik terapisi ve dijital uygulama. Kanıta dayalı teknikler ve profesyonel destek.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "",
              "addressLocality": "İzmir",
              "addressRegion": "",
              "postalCode": "",
              "addressCountry": "TR"
            },
            "telephone": "0 (232) 421 51 45",
            "email": "info@armonikekemeliktedavisi.com",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"],
                "opens": "09:00",
                "closes": "17:30"
              }
            ],
            "sameAs": [
              "https://www.facebook.com/armonikekemeliktedavisi",
              "https://twitter.com/armonikekemelik",
              "https://www.instagram.com/armoni_dilkonusma/",
              "https://www.youtube.com/channel/UCXb3uyDjRtTipQs8Dtf7GSw"
            ],
            "medicalSpecialty": "Dil ve Konuşma Terapisi"
          }
        `}
      </Script>

      <Script id="schema-stammering-app" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "E-Kekemelik Uygulaması",
            "applicationCategory": "Sağlık Uygulaması",
            "browserRequirements": "JavaScript ve HTML5 gerektirir.",
            "operatingSystem": "Tümü",
            "description": "Kekemelik için kapsamlı bir web uygulaması: bilimsel teknikler, günlük egzersizler ve ilerleme takibi. Hem mobil hem masaüstü için erişilebilir."
          }
        `}
      </Script>

      <Script id="schema-stammering-faqs" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Kekemeliğin nedenleri nelerdir?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Kekemelik genetik, nörolojik ve çevresel faktörlerin birleşimiyle ortaya çıkar. Araştırmalar, konuşma ile ilgili beyin yapısı ve işlevlerindeki farklılıkların önemli rol oynadığını göstermektedir."
                }
              },
              {
                "@type": "Question",
                "name": "Kekemelik tamamen geçer mi?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Kekemelik için kesin bir 'tedavi' olmasa da, birçok kişi terapi teknikleri, düzenli pratik ve psikolojik destek ile önemli ilerleme kaydedebilir. Uygulamamız, kekemeliği yönetmek için bilimsel yöntemler sunar."
                }
              },
              {
                "@type": "Question",
                "name": "E-Kekemelik uygulaması nasıl çalışır?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Uygulamamız, kanıta dayalı konuşma terapisi tekniklerine dayalı günlük egzersizler, ilerleme takibi, anlık geri bildirim ve topluluk desteği sunar. Nefes egzersizleri, akıcılık teknikleri, bilişsel davranışçı terapi yaklaşımları ve çeşitli pratik senaryolar içerir."
                }
              },
              {
                "@type": "Question",
                "name": "Özel kekemelik terapisi mi, uygulama mı daha etkili?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Her iki yaklaşımın da avantajları vardır. Özel terapi, uzman bir terapistten kişiselleştirilmiş rehberlik ve geri bildirim sağlar. Uygulamamız ise düzenli pratik, erişilebilirlik ve uygun maliyet sunar. En iyi sonuçlar genellikle her iki yöntemin birlikte kullanılmasıyla elde edilir."
                }
              }
            ]
          }
        `}
      </Script>
    </>
  );
}
