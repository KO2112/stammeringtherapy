import ServicesPage from './servicescontent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | Stammering Therapy',
  description:
    'Discover the comprehensive stammering solutions we offer, including the E-Stammering App for personalized exercises and therapy sessions with certified specialists.',
  keywords: [
    'stammering therapy',
    'speech therapy services',
    'stammering app',
    'personalized speech therapy',
    'therapy sessions',
    'stuttering exercises',
  ],
  alternates: {
    canonical: 'https://stammeringtherapy.com/services',
    languages: {
      'en-GB': 'https://stammeringtherapy.com/services',
    },
  },
  openGraph: {
    title: 'Our Services | Stammering Therapy',
    description:
      'Explore our E-Stammering App and private therapy sessions to help you achieve fluent, confident speech.',
    images: [
      {
        url: '/Stammering-Therapy-logo.png',
        width: 1200,
        height: 630,
        alt: 'Stammering Therapy Services',
      },
    ],
  },
};

export default function Page() {
  return <ServicesPage />;
}
