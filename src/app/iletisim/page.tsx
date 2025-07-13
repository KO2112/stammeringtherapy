import IletisimContent from "./iletisimcontent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | E-Kekemelik - Armoni Dil ve Konuşma Merkezi",
  description:
    "Armoni Dil ve Konuşma Merkezi ile iletişime geçin. E-Kekemelik uygulaması ve hizmetlerimiz hakkında bilgi alın, sorularınızı iletin.",
  keywords: [
    "iletişim",
    "kekemelik terapisi",
    "konuşma terapisi",
    "e-kekemelik",
    "armoni dil ve konuşma merkezi",
    "telefon",
    "e-posta",
  ],
  alternates: {
    canonical: "https://e-kekemelik.com/iletisim",
    languages: {
      "tr-TR": "https://e-kekemelik.com/iletisim",
    },
  },
  openGraph: {
    title: "İletişim | E-Kekemelik - Armoni Dil ve Konuşma Merkezi",
    description:
      "Bize ulaşın: E-Kekemelik uygulaması ve hizmetlerimiz hakkında bilgi alın, sorularınızı iletin.",
    images: [
      {
        url: "/Stammering-Therapy-logo.png",
        width: 1200,
        height: 630,
        alt: "E-Kekemelik İletişim",
      },
    ],
  },
};

export default function Page() {
  return <IletisimContent />;
}
