import Image from "next/image";
import Link from "next/link";
import BannerSlider from "./components/bannerslider";
import TryTheAppNow from "./components/trytheappnow";
import StammeringTherapyTechniques from "./components/enhanced";
import AboutUs from "./components/AboutUs";
export default function Home() {
  return (
    <div className="bg-white">
      

       <main>
       <BannerSlider/>
       <TryTheAppNow />
       <StammeringTherapyTechniques/>
       <AboutUs/>
      </main>
      

      
    </div>
  );
}