import MouthAndBreathingExercisesArticle from "./Mouthandbreathingexercisescontent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nefes ve Ağız Teknikleri | Armoni Dil ve Konuşma Merkezi",
  description:
    "Kekemelikte konuşma akıcılığını artırmak için etkili nefes ve ağız egzersizlerini öğrenin.",
  keywords: [
    "kekemelik için nefes egzersizleri",
    "ağız egzersizleri",
    "konuşma terapisi teknikleri",
    "armoni dil ve konuşma merkezi",
  ],
  alternates: {
    canonical: "https://e-kekemelik.com/makaleler/nefes-ve-agiz-teknikleri",
    languages: {
      "tr-TR": "https://e-kekemelik.com/makaleler/nefes-ve-agiz-teknikleri",
    },
  },
  openGraph: {
    title: "Nefes ve Ağız Teknikleri | Armoni Dil ve Konuşma Merkezi",
    description:
      "Kekemelikte konuşma akıcılığını artırmak için etkili nefes ve ağız egzersizlerini öğrenin.",
    images: [
      {
        url: "/Stammering-Therapy-logo.png",
        width: 1200,
        height: 630,
        alt: "Nefes ve Ağız Teknikleri",
      },
    ],
  },
};

export default function Page() {
  return <MouthAndBreathingExercisesArticle />;
}
