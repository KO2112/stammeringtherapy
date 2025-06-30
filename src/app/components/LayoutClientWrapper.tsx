"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayout = [
    "/signin",
    "/signup",
    "/auth/signin",
    "/auth/signup",
  ];

  const shouldHideLayout =
    hideLayout.includes(pathname) || pathname.startsWith("/dashboard");

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
}
