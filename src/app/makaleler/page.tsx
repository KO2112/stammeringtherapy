import ArticlesContent from './articlescontent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles | Stammering Therapy',
  description: 'Explore a wide range of articles on stammering therapy, stuttering definitions, and effective exercises.',
  keywords: ['stammering therapy', 'stuttering help', 'speech therapy', 'stuttering exercises'],
  alternates: {
    canonical: 'https://stammeringtherapy.com/articles',
    languages: {
      'en-GB': 'https://stammeringtherapy.com/articles',
    },
  },
  openGraph: {
    title: 'Articles on Stammering Therapy',
    description: 'Explore a wide range of articles on stammering therapy, stuttering definitions, and effective exercises.',
    images: [
      {
        url: '/Stammering-Therapy-logo.png',
        width: 1200,
        height: 630,
        alt: 'Stammering Therapy Articles',
      },
    ],
  }
};

export default function Page() {
  return <ArticlesContent />;
}
