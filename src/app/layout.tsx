// app/layout.tsx
import "./globals.css";
import { Geist } from "next/font/google";
import type { Metadata } from "next";
import LayoutClientWrapper from "@/app/components/LayoutClientWrapper";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stammering Therapy | Expert Speech Therapy Services",
  description: "Professional stammering therapy services providing expert speech therapy for fluency control and communication skills improvement.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <LayoutClientWrapper>{children}</LayoutClientWrapper>
      </body>
    </html>
  );
}
