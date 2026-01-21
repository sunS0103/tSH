import { NextPage } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import DynamicAssessmentPageClient, { AssessmentConfig } from './DynamicAssessmentPageClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Function to load config from data folder
async function loadAssessmentConfig(slug: string): Promise<AssessmentConfig | null> {
  try {
    const dataPath = path.join(process.cwd(), 'app', 'assessments', 'data', `${slug}.json`);
    
    // Check if file exists
    if (!fs.existsSync(dataPath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const config = JSON.parse(fileContent) as AssessmentConfig;
    
    return config;
  } catch (error) {
    console.error(`Error loading assessment config for slug "${slug}":`, error);
    return null;
  }
}

const Page: NextPage<PageProps> = async ({ params }) => {
  const { slug } = await params;
  
  // Load config from data folder based on slug
  const config = await loadAssessmentConfig(slug);
  
  // If config not found, show 404
  if (!config) {
    notFound();
  }
  
  // Render the client component with the loaded config
  return <DynamicAssessmentPageClient config={config} />;
};

export default Page;

// Generate static params for all JSON files in data folder
export async function generateStaticParams() {
  try {
    const dataPath = path.join(process.cwd(), 'app', 'assessments', 'data');
    
    if (!fs.existsSync(dataPath)) {
      return [];
    }
    
    const files = fs.readdirSync(dataPath).filter(file => file.endsWith('.json'));
    
    return files.map(file => ({
      slug: file.replace('.json', '')
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
