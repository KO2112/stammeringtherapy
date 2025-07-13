import StammeringTherapyAppArticle from "./StammeringTherapyAppcontent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Kekemelik Uygulaması | Armoni Dil ve Konuşma Merkezi",
  description:
    "E-Kekemelik uygulaması ile kişiye özel egzersizler ve gelişmiş tekniklerle konuşma akıcılığınızı artırın.",
  keywords: [
    "e-kekemelik uygulaması",
    "konuşma terapisi",
    "kekemelik egzersizleri",
    "akıcılık geliştirme",
    "armoni dil ve konuşma merkezi",
  ],
  alternates: {
    canonical: "https://e-kekemelik.com/makaleler/e-kekemelik",
    languages: {
      "tr-TR": "https://e-kekemelik.com/makaleler/e-kekemelik",
    },
  },
  openGraph: {
    title: "E-Kekemelik Uygulaması | Armoni Dil ve Konuşma Merkezi",
    description:
      "E-Kekemelik uygulaması ile kişiye özel egzersizler ve gelişmiş tekniklerle konuşma akıcılığınızı artırın.",
    images: [
      {
        url: "/Stammering-Therapy-logo.png",
        width: 1200,
        height: 630,
        alt: "E-Kekemelik Uygulaması",
      },
    ],
  },
};

export default function Page() {
  return <StammeringTherapyAppArticle />;
}
