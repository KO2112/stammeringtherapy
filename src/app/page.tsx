import type { Metadata } from "next/types"
import Script from "next/script"
import BannerSlider from "./components/bannerslider"
import TryTheAppNow from "./components/trytheappnow"
import StammeringTherapyTechniques from "./components/enhanced"
import AboutUs from "./components/AboutUs"


export const metadata: Metadata = {
  metadataBase: new URL("https://www.stammeringtherapy.com"),
  title: "Stammering Therapy App | Professional Speech Therapy Solutions",
  description: "Professional stammering therapy app providing evidence-based techniques, exercises, and support for people who stammer. Private speech therapy services available.",
  keywords: [
    "stammering therapy",
    "stuttering treatment",
    "speech therapy",
    "fluency techniques",
    "speech exercises",
    "private stammering therapy",
    "speech fluency app",
    "speech impediment help",
    "stammering support",
    "speech therapy techniques",
    "fluency shaping",
    "stammering app",
    "speech therapy app",
    "stuttering app"
  ],
  authors: [
    { name: "Stammering Therapy Team" }
  ],
  creator: "Stammering Therapy",
  publisher: "Stammering Therapy Ltd",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.stammeringtherapy.com",
    title: "Stammering Therapy App | Professional Speech Therapy Solutions",
    description: "Evidence-based stammering therapy techniques and private speech therapy services to help you speak with confidence.",
    siteName: "Stammering Therapy",
    images: [
      {
        url: "https://stammeringtherapy.netlify.app/_next/image?url=%2FStammering-Therapy-logo.png&w=1920&q=75",
        width: 1200,
        height: 630,
        alt: "Stammering Therapy App Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stammering Therapy App | Professional Speech Therapy Solutions",
    description: "Evidence-based stammering therapy techniques and private speech therapy services to help you speak with confidence.",
    creator: "@stammeringapp",
    images: ["https://stammeringtherapy.netlify.app/_next/image?url=%2FStammering-Therapy-logo.png&w=1920&q=75"],
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "Health & Wellness",
}

export default function Home() {
  return (
    <>
      <div className="bg-white">
        <main>
          <BannerSlider/>
          <TryTheAppNow />
          <StammeringTherapyTechniques/>
          <AboutUs/>
        </main>
      </div>
      
      
      <Script id="schema-stammering-therapy" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "name": "Stammering Therapy",
            "url": "https://www.stammeringtherapy.com",
            "logo": "https://www.stammeringtherapy.com/logo.png",
            "description": "Professional stammering therapy services and digital app providing evidence-based techniques for people who stammer.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "43 Gamble Avenue",
              "addressLocality": "Fleckney",
              "addressRegion": "Leicestershire",
              "postalCode": "",
              "addressCountry": "GB"
            },
            "telephone": "07419208820",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "17:30"
              }
            ],
            "sameAs": [
              "https://www.facebook.com/stammeringtherapy",
              "https://www.twitter.com/stammeringapp",
              "https://www.instagram.com/stammeringtherapy",
              "https://www.linkedin.com/company/stammering-therapy"
            ],
            "medicalSpecialty": "Speech-Language Pathology"
          }
        `}
      </Script>
      
      
      <Script id="schema-stammering-app" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Stammering Therapy App",
            "applicationCategory": "HealthApplication",
            "browserRequirements": "Requires JavaScript. Requires HTML5.",
            "operatingSystem": "All",
            "description": "A comprehensive stammering therapy web application providing evidence-based techniques, daily exercises, and progress tracking for people who stammer. Accessible on both mobile and desktop devices."
          }
        `}
      </Script>
      
      
      <Script id="schema-stammering-faqs" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What causes stammering?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Stammering is typically caused by a combination of genetic, neurological, and environmental factors. Research suggests that differences in brain structure and function related to speech processing play a significant role."
                }
              },
              {
                "@type": "Question",
                "name": "Can stammering be cured?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "While there is no definitive 'cure' for stammering, many people achieve significant improvement or even complete fluency through therapy techniques, consistent practice, and psychological support. Our app provides evidence-based methods to help manage stammering effectively."
                }
              },
              {
                "@type": "Question",
                "name": "How does the Stammering Therapy App work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our app provides daily exercises based on proven speech therapy techniques, progress tracking, real-time feedback, and community support. It includes breathing exercises, fluency shaping techniques, cognitive behavioral therapy approaches, and situation-specific practice scenarios."
                }
              },
              {
                "@type": "Question",
                "name": "Is private stammering therapy more effective than using an app?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Both approaches have benefits. Private therapy offers personalized guidance and feedback from a qualified speech therapist. Our app provides consistent daily practice, accessibility, and affordability. Many users achieve the best results by combining both approaches."
                }
              }
            ]
          }
        `}
      </Script>
    </>
  );
}