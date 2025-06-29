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
    ,"/dashboard/private-sessions","/dashboard/stories","/dashboard/support", "/dashboard/Read-Out-Loud","/dashboard/Admin","/dashboard/stories/kir-zincilerini","/dashboard/stories/bir-balikci-hikayesi",
    "/dashboard/stories/gurultu","/dashboard/stories/iyi-ornek-olmak","/dashboard/stories/ozgur-kuslar","/dashboard/stories/semsiye-tamircisi"
  ,"/dashboard/stories/kim-fark-eder","/dashboard/stories/zehir","/dashboard/stories/hemen-mi-olecegim","/dashboard/stories/sirkin-kapisindan-dondugum-gece",
"/dashboard/stories/bambu-agaci","/dashboard/stories/affetmenin-hafifligi","/dashboard/stories/garson-kiz","/dashboard/stories/kisilik","/dashboard/stories/kavak-agaci-ile-kabak",
"/dashboard/stories/on-yargi","/dashboard/stories/profesyonel-yardim","/dashboard/stories/hayallerinizden-vazgecmeyin","/dashboard/stories/zeka-ozurluler-sinifi",
"/dashboard/stories/akilli-deli","/dashboard/stories/elimden-gelen-cabayi-gosterecegim","/dashboard/stories/einstein-ve-soforu","/dashboard/stories/firtina-ciktiginda-uyuyabilirim",
"/dashboard/stories/bir-hayir-vardir","/dashboard/stories/stanford-universitesi","/dashboard/stories/bagislamanin-yuceligi"].includes(pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
