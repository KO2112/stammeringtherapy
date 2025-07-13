import WhatIsStammeringArticle from "./whatisstammeringcontent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kekemelik Nedir? | Armoni Dil ve Konuşma Merkezi",
  description:
    "Kekemeliğin nedenleri, belirtileri ve türleri hakkında detaylı bilgi edinin.",
  keywords: [
    "kekemelik nedir",
    "kekemelik belirtileri",
    "kekemelik türleri",
    "konuşma terapisi",
    "armoni dil ve konuşma merkezi",
  ],
  alternates: {
    canonical: "https://e-kekemelik.com/makaleler/kekemelik-nedir",
    languages: {
      "tr-TR": "https://e-kekemelik.com/makaleler/kekemelik-nedir",
    },
  },
  openGraph: {
    title: "Kekemelik Nedir? | Armoni Dil ve Konuşma Merkezi",
    description:
      "Kekemeliğin nedenleri, belirtileri ve türleri hakkında detaylı bilgi edinin.",
    images: [
      {
        url: "/Stammering-Therapy-logo.png",
        width: 1200,
        height: 630,
        alt: "Kekemelik Nedir",
      },
    ],
  },
};

export default function Page() {
  return <WhatIsStammeringArticle />;
}
