import StammeringTherapyAppArticle from './StammeringTherapyAppcontent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stammering Therapy App | Stammering Therapy',
  description: 'Discover how the Stammering Therapy App helps improve speech fluency through personalized therapy and advanced techniques.',
  keywords: ['stammering therapy app', 'speech therapy app', 'stuttering app', 'speech improvement'],
  alternates: {
    canonical: 'https://stammeringtherapy.com/articles/stammering-therapy-app',
    languages: {
      'en-GB': 'https://stammeringtherapy.com/articles/stammering-therapy-app',
    },
  },
  openGraph: {
    title: 'Stammering Therapy App | Stammering Therapy',
    description: 'Transform your speech with our Stammering Therapy App featuring real-time tracking, expert guidance, and advanced techniques.',
    images: [
      {
        url: '/Stammering-Therapy-logo.png',
        width: 1200,
        height: 630,
        alt: 'Stammering Therapy App',
      },
    ],
  }
};

export default function Page() {
  return <StammeringTherapyAppArticle />;
}
