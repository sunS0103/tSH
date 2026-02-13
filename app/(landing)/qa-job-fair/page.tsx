import { Metadata } from 'next';
import QAJobFairClient from './QAJobFairClient';
import config from './config.json';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'QA Virtual Job Fair - Multiple Openings',
  description: 'Join the QA Job Fair. Multiple QA positions open across top companies in India, Dubai, and USA. Take skill-based assessments and get shortlisted by top engineering teams instantly.',
  openGraph: {
    title: 'QA Virtual Job Fair - Multiple Openings',
    description: 'Join the QA Job Fair. Multiple QA positions open across top companies in India, Dubai, and USA. Take skill-based assessments and get shortlisted by top engineering teams instantly.',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/qa-job-fair`,
    siteName: 'SmartTechHire',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QA Virtual Job Fair',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QA Virtual Job Fair - Multiple Openings',
    description: 'Join the QA Job Fair. Multiple QA positions open across top companies in India, Dubai, and USA. Take skill-based assessments and get shortlisted by top engineering teams instantly.',
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
    'job fair 2026',
  ],
};

export default function Page() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: config.event.name,
    description: 'Virtual job fair featuring multiple QA positions across top companies. Skill-based assessments and direct connections with hiring teams.',
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
      name: 'SmartTechHire',
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
