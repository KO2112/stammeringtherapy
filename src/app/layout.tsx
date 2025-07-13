// app/layout.tsx
import "./globals.css";
import { Geist } from "next/font/google";
import type { Metadata } from "next";
import LayoutClientWrapper from "@/app/components/LayoutClientWrapper";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Kekemelik | Armoni Dil ve Konuşma Merkezi",
  description:
    "Armoni Dil ve Konuşma Merkezi tarafından sunulan, bilimsel temelli kekemelik terapisi uygulaması ve profesyonel konuşma terapisi hizmetleri.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={geist.className}>
        <LayoutClientWrapper>{children}</LayoutClientWrapper>
      </body>
    </html>
  );
}
