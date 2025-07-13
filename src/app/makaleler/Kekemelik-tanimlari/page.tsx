import DefinitionsOfStutteringArticle from "./DefinitionsofStutteringcontent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kekemelik Tanımları | Armoni Dil ve Konuşma Merkezi",
  description:
    "Kekemeliğin tarihsel ve güncel tanımlarını, konuşma, psikolojik ve fizyolojik açılardan inceleyin.",
  keywords: [
    "kekemelik tanımları",
    "kekemelik",
    "konuşma bozuklukları",
    "kekemelik tarihi",
    "psikolojik etkiler",
    "armoni dil ve konuşma merkezi",
  ],
  alternates: {
    canonical: "https://e-kekemelik.com/makaleler/kekemelik-tanimlari",
    languages: {
      "tr-TR": "https://e-kekemelik.com/makaleler/kekemelik-tanimlari",
    },
  },
  openGraph: {
    title: "Kekemelik Tanımları | Armoni Dil ve Konuşma Merkezi",
    description:
      "Kekemeliğin tarihsel ve güncel tanımlarını, konuşma, psikolojik ve fizyolojik açılardan inceleyin.",
    images: [
      {
        url: "/stuttering-definitions.jpg",
        width: 1200,
        height: 630,
        alt: "Kekemelik Tanımları",
      },
    ],
  },
};

export default function Page() {
  return <DefinitionsOfStutteringArticle />;
}
