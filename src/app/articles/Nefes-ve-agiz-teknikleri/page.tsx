import MouthAndBreathingExercisesArticle from './Mouthandbreathingexercisescontent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Breathing and Mouth Exercises for Stammering | Stammering Therapy',
  description: 'Learn effective breathing and mouth exercises to improve speech fluency and manage stammering.',
  keywords: ['breathing exercises for stammering', 'mouth exercises for speech', 'speech therapy techniques'],
  alternates: {
    canonical: 'https://stammeringtherapy.com/articles/breathing-and-mouth-exercises',
    languages: {
      'en-GB': 'https://stammeringtherapy.com/articles/breathing-and-mouth-exercises',
    },
  },
  openGraph: {
    title: 'Breathing and Mouth Exercises for Stammering | Stammering Therapy',
    description: 'Discover powerful breathing and mouth exercises designed to help those who stammer speak more fluently.',
    images: [
      {
        url: '/Stammering-Therapy-logo.png',
        width: 1200,
        height: 630,
        alt: 'Stammering Therapy Logo',
      },
    ],
  }
};

export default function Page() {
  return <MouthAndBreathingExercisesArticle />;
}
