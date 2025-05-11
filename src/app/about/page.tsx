import AboutUsContent from './aboutuscontent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Stammering Therapy',
  description: 'Meet the dedicated team at Stammering Therapy, specializing in helping people who stammer achieve fluent, confident speech.',
  keywords: ['stammering therapy', 'speech therapy', 'stuttering help', 'about us', 'speech specialists'],
  alternates: {
    canonical: 'https://stammeringtherapy.com/about',
    languages: {
      'en-GB': 'https://stammeringtherapy.com/about',
    },
  },
  openGraph: {
    title: 'About Us | Stammering Therapy',
    description: 'Learn more about our expert team and how we help individuals overcome stammering challenges.',
    images: [
      {
        url: '/Stammering-Therapy-logo.png',
        width: 1200,
        height: 630,
        alt: 'Stammering Therapy Team',
      },
    ],
  },
};

export default function Page() {
  return <AboutUsContent />;
}
