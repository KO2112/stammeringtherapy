import ContactContent from './contactcontent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Stammering Therapy',
  description: 'Get in touch with our expert team at Stammering Therapy for personalized support and information.',
  keywords: ['contact us', 'stammering therapy', 'stuttering help', 'speech therapy', 'get in touch'],
  alternates: {
    canonical: 'https://stammeringtherapy.com/contact',
    languages: {
      'en-GB': 'https://stammeringtherapy.com/contact',
    },
  },
  openGraph: {
    title: 'Contact Us | Stammering Therapy',
    description: 'Reach out to Stammering Therapy for expert advice and support in overcoming stuttering.',
    images: [
      {
        url: '/Stammering-Therapy-logo.png',
        width: 1200,
        height: 630,
        alt: 'Contact Stammering Therapy',
      },
    ],
  },
};

export default function Page() {
  return <ContactContent />;
}
