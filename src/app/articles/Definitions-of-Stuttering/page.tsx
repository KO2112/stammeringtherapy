import DefinitionsOfStutteringArticle from './DefinitionsofStutteringcontent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Definitions of Stuttering | Stammering Therapy',
  description: 'Explore various definitions of stuttering from historical perspectives to modern-day understanding. Learn about speech, psychological, and physiological definitions.',
  keywords: ['definitions of stuttering', 'stammering', 'speech disorders', 'stuttering history', 'psychological effects of stuttering'],
  alternates: {
    canonical: 'https://stammeringtherapy.com/articles/definitions-of-stuttering',
    languages: {
      'en-GB': 'https://stammeringtherapy.com/articles/definitions-of-stuttering',
    },
  },
  openGraph: {
    title: 'Definitions of Stuttering | Stammering Therapy',
    description: 'Understand the various definitions of stuttering from multiple perspectives, including speech-based, psychological, and physiological views.',
    images: [
      {
        url: '/stuttering-definitions.jpg',
        width: 1200,
        height: 630,
        alt: 'Understanding Definitions of Stuttering',
      },
    ],
  }
};

export default function Page() {
  return <DefinitionsOfStutteringArticle />;
}
