// app/components/LayoutClientWrapper.tsx
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

  const hideLayout = ["/signin", "/signup", "/auth/signin", "/auth/signup","/dashboard", "/dashboard/mouth-and-breathing-exercises","/dashboard/diary","/dashboard/profile"
    ,"/dashboard/private-sessions","/dashboard/stories","/dashboard/support", "/dashboard/Read-Out-Loud"].includes(pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
