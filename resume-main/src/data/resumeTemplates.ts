export interface ResumeTemplate {
  id: string;
  name: string;
  category: 'modern';
  atsScore: number;
  preview: string;
  description: string;
  features: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  layout: 'single-column';
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: string;
  };
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: '2',
    name: 'Template 2',
    category: 'modern',
    atsScore: 90,
    preview: 'https://images.nanonets.com/tr:rt-0/uploadedfiles/rawocr/50c419b4-5bfc-45dd-a817-36ff1ca962f8-1.jpeg?ik-s=8aa06046bc016c7e81e6eb7f860b878e758a72a9&ik-t=1750977177',
    description: 'Auto-generated template from export (1).json',
    features: ['Auto-generated', 'Modern Layout'],
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      accent: '#3B82F6',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: 'medium'
    }
  },
  {
    id: '4',
    name: 'Template 4',
    category: 'modern',
    atsScore: 90,
    preview: 'https://images.nanonets.com/tr:rt-0/uploadedfiles/rawocr/91784507-0827-4cef-9eeb-f55d375f0d55-1.jpeg?ik-s=cd4a975cbe57d7eae8eea648197c6992620bbc23&ik-t=1750977221',
    description: 'Auto-generated template from export (2).json',
    features: ['Auto-generated', 'Modern Layout'],
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      accent: '#3B82F6',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: 'medium'
    }
  },
  {
    id: '6',
    name: 'Template 6',
    category: 'modern',
    atsScore: 90,
    preview: 'https://images.nanonets.com/tr:rt-0/uploadedfiles/rawocr/ab9d2fb2-5679-45f2-9fd3-5fed3ebccae3-1.jpeg?ik-s=8bae2c09ee0a595ba7665dd3bc58751c7e619c5b&ik-t=1750977251',
    description: 'Auto-generated template from export (3).json',
    features: ['Auto-generated', 'Modern Layout'],
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      accent: '#3B82F6',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: 'medium'
    }
  },
  {
    id: '8',
    name: 'Template 8',
    category: 'modern',
    atsScore: 90,
    preview: 'https://images.nanonets.com/tr:rt-0/uploadedfiles/rawocr/d211053c-105d-481b-b66c-3e256bfc241e-1.jpeg?ik-s=91b5b3d1c6badc01c59e4756890b4563a5b46b3e&ik-t=1750977274',
    description: 'Auto-generated template from export (4).json',
    features: ['Auto-generated', 'Modern Layout'],
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      accent: '#3B82F6',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: 'medium'
    }
  },
  {
    id: '10',
    name: 'Template 10',
    category: 'modern',
    atsScore: 90,
    preview: 'https://images.nanonets.com/tr:rt-0/uploadedfiles/rawocr/1673a1e0-ddde-4be1-b7c9-260cd57d6a26-1.jpeg?ik-s=d45fa03b77ea38d536ff55b1ad64d4f7abc602be&ik-t=1750977297',
    description: 'Auto-generated template from export (5).json',
    features: ['Auto-generated', 'Modern Layout'],
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      accent: '#3B82F6',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: 'medium'
    }
  },
  {
    id: '12',
    name: 'Template 12',
    category: 'modern',
    atsScore: 90,
    preview: 'https://images.nanonets.com/tr:rt-0/uploadedfiles/rawocr/19191488-d19b-4471-8701-65a55d44beec-1.jpeg?ik-s=cd27e099430758a75df6e7aee9bac383da373ac6&ik-t=1750977326',
    description: 'Auto-generated template from export (6).json',
    features: ['Auto-generated', 'Modern Layout'],
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      accent: '#3B82F6',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: 'medium'
    }
  }
];

export const getTemplatesByCategory = (category: string) => {
  return resumeTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return resumeTemplates.find(template => template.id === id);
};

export const getHighestATSTemplates = (limit: number = 10) => {
  return resumeTemplates
    .sort((a, b) => b.atsScore - a.atsScore)
    .slice(0, limit);
};