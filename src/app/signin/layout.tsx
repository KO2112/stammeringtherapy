import React from 'react';
import { Metadata } from "next";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FluentVoice | Stammering Therapy",
  description: "Sign in to your stammering therapy account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${geist.className} min-h-screen bg-gray-50`}>
      {children}
    </div>
  );
}