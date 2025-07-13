import AboutUsContent from "./aboutuscontent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda | Armoni Dil ve Konuşma Merkezi",
  description:
    "Armoni Dil ve Konuşma Merkezi ekibiyle tanışın. Kekemelik ve konuşma bozuklukları alanında uzman kadromuz ile akıcı ve kendine güvenen bir konuşma için yanınızdayız.",
  keywords: [
    "kekemelik terapisi",
    "konuşma terapisi",
    "hakkımızda",
    "uzman ekip",
    "armoni dil ve konuşma merkezi",
  ],
  alternates: {
    canonical: "https://e-kekemelik.com/hakkimizda",
    languages: {
      "tr-TR": "https://e-kekemelik.com/hakkimizda",
    },
  },
  openGraph: {
    title: "Hakkımızda | Armoni Dil ve Konuşma Merkezi",
    description:
      "Uzman ekibimiz ve kekemelik alanındaki profesyonel hizmetlerimiz hakkında daha fazla bilgi edinin.",
    images: [
      {
        url: "/Stammering-Therapy-logo.png",
        width: 1200,
        height: 630,
        alt: "Armoni Dil ve Konuşma Merkezi Ekibi",
      },
    ],
  },
};

export default function Page() {
  return <AboutUsContent />;
}
