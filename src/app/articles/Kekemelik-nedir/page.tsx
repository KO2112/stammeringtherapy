import WhatIsStammeringArticle from './whatisstammeringcontent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What is Stammering? | Stammering Therapy',
  description: 'Understand the causes, symptoms, and types of stammering with detailed insights from experts.',
  keywords: ['what is stammering', 'stammering symptoms', 'stammering types', 'speech therapy'],
  alternates: {
    canonical: 'https://stammeringtherapy.com/articles/what-is-stammering',
    languages: {
      'en-GB': 'https://stammeringtherapy.com/articles/what-is-stammering',
    },
  },
  openGraph: {
    title: 'What is Stammering? | Stammering Therapy',
    description: 'Learn about stammering, its causes, symptoms, and various types with expert insights.',
    images: [
      {
        url: '/Stammering-Therapy-logo.png',
        width: 1200,
        height: 630,
        alt: 'Stammering Therapy - What is Stammering',
      },
    ],
  }
};

export default function Page() {
  return <WhatIsStammeringArticle />;
}
