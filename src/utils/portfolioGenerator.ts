import { saveAs } from 'file-saver';

export interface PortfolioData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    linkedin?: string;
    github?: string;
  };
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link?: string;
    image?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
}

const portfolioTemplates = {
  modern: {
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    backgroundColor: '#F8FAFC',
    textColor: '#1E293B',
    cardBackground: '#FFFFFF',
    animations: 'fadeInUp, slideIn, bounce'
  },
  creative: {
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    backgroundColor: '#0F0F23',
    textColor: '#F1F5F9',
    cardBackground: '#1E1E3F',
    animations: 'morphing, colorShift, pulse'
  },
  developer: {
    primaryColor: '#10B981',
    secondaryColor: '#06B6D4',
    backgroundColor: '#111827',
    textColor: '#F9FAFB',
    cardBackground: '#1F2937',
    animations: 'typewriter, codeHighlight, matrix'
  }
};

export const generatePortfolioHTML = (data: PortfolioData, template: string = 'modern'): string => {
  const theme = portfolioTemplates[template as keyof typeof portfolioTemplates] || portfolioTemplates.modern;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name || 'Professional'} - Portfolio</title>
    <meta name="description" content="${data.personalInfo.name || 'Professional'} - ${data.personalInfo.summary || 'Professional Portfolio showcasing skills, projects, and experience'}">
    <meta name="keywords" content="${data.skills.join(', ')}, portfolio, ${data.personalInfo.name || 'professional'}, developer, professional">
    <meta name="author" content="${data.personalInfo.name || 'Professional'}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${data.personalInfo.name || 'Professional'} - Portfolio">
    <meta property="og:description" content="${data.personalInfo.summary || 'Professional Portfolio showcasing skills, projects, and experience'}">
};
