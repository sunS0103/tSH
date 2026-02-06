import { Metadata } from 'next';
import QAJobFairClient from './QAJobFairClient';
import config from './config.json';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'QA Virtual Job Fair - 27 Openings',
  description: 'Join the February QA Job Fair. 27 QA positions open across 15 companies in India, Dubai, and USA. Take skill-based assessments and get shortlisted by top engineering teams instantly.',
  openGraph: {
    title: 'QA Virtual Job Fair - 27 Openings',
    description: 'Join the February QA Job Fair. 27 QA positions open across 15 companies in India, Dubai, and USA. Take skill-based assessments and get shortlisted by top engineering teams instantly.',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/qa-job-fair`,
    siteName: 'TechSmartHire',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QA Virtual Job Fair - February 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QA Virtual Job Fair - 27 Openings',
    description: 'Join the February QA Job Fair. 27 QA positions open across 15 companies in India, Dubai, and USA. Take skill-based assessments and get shortlisted by top engineering teams instantly.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/qa-job-fair`,
  },
  keywords: [
    'QA job fair',
    'virtual job fair',
    'QA hiring',
    'SDET jobs',
    'automation testing jobs',
    'QA engineer jobs',
    'software testing careers',
    'skill-based hiring',
    'tech job fair',
    'February 2026 job fair',
  ],
};

export default function Page() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: config.event.name,
    description: 'Virtual job fair featuring 27 QA positions across 15 companies. Skill-based assessments and direct connections with hiring teams.',
    startDate: config.event.startDate,
    endDate: config.event.endDate,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'VirtualLocation',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/qa-job-fair`,
    },
    organizer: {
      '@type': 'Organization',
      name: 'TechSmartHire',
      url: process.env.NEXT_PUBLIC_APP_URL,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/qa-job-fair`,
    },
  };

  return (
    <>
      <Script
        id="job-fair-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <QAJobFairClient />
    </>
  );
}
