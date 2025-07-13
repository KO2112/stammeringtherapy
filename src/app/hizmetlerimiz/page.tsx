import ServicesPage from "./servicescontent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hizmetlerimiz | E-Kekemelik - Armoni Dil ve Konuşma Merkezi",
  description:
    "Armoni Dil ve Konuşma Merkezi olarak sunduğumuz kapsamlı kekemelik terapisi hizmetlerini ve E-Kekemelik uygulamasını keşfedin. Bireysel egzersizler, profesyonel terapi seansları ve daha fazlası.",
  keywords: [
    "kekemelik terapisi",
    "konuşma terapisi hizmetleri",
    "e-kekemelik uygulaması",
    "kişisel konuşma terapisi",
    "terapi seansları",
    "kekemelik egzersizleri",
    "armoni dil ve konuşma merkezi",
  ],
  alternates: {
    canonical: "https://e-kekemelik.com/hizmetlerimiz",
    languages: {
      "tr-TR": "https://e-kekemelik.com/hizmetlerimiz",
    },
  },
  openGraph: {
    title: "Hizmetlerimiz | E-Kekemelik - Armoni Dil ve Konuşma Merkezi",
    description:
      "E-Kekemelik uygulamamız ve özel terapi seanslarımız ile akıcı ve kendine güvenen bir konuşmaya ulaşın.",
    images: [
      {
        url: "/Stammering-Therapy-logo.png",
        width: 1200,
        height: 630,
        alt: "E-Kekemelik Hizmetlerimiz",
      },
    ],
  },
};

export default function Page() {
  return <ServicesPage />;
}
