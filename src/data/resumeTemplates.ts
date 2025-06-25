export interface ResumeTemplate {
  id: string;
  name: string;
  category: 'modern' | 'classic' | 'creative' | 'executive' | 'technical' | 'minimalist';
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
}

export const resumeTemplates: ResumeTemplate[] = [
  // Modern Templates
  {
    id: 'modern-1',
    name: 'Executive Pro',
    category: 'modern',
    atsScore: 98,
    preview: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Clean, professional design perfect for executives and senior roles',
    features: ['ATS Optimized', 'Clean Layout', 'Professional Typography', 'Skills Section'],
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      accent: '#3B82F6',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'modern-2',
    name: 'Tech Innovator',
    category: 'technical',
    atsScore: 96,
    preview: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Perfect for software developers and tech professionals',
    features: ['Code-Friendly', 'Project Showcase', 'Technical Skills', 'GitHub Integration'],
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10B981',
      text: '#111827',
      background: '#F9FAFB'
    }
  },
  {
    id: 'modern-3',
    name: 'Creative Edge',
    category: 'creative',
    atsScore: 94,
    preview: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Bold design for creative professionals and designers',
    features: ['Visual Appeal', 'Portfolio Section', 'Creative Layout', 'Color Accents'],
    colors: {
      primary: '#7C3AED',
      secondary: '#6D28D9',
      accent: '#8B5CF6',
      text: '#374151',
      background: '#FFFFFF'
    }
  },
  {
    id: 'modern-4',
    name: 'Business Elite',
    category: 'executive',
    atsScore: 97,
    preview: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Sophisticated template for business leaders',
    features: ['Executive Summary', 'Achievement Focus', 'Leadership Skills', 'Premium Look'],
    colors: {
      primary: '#DC2626',
      secondary: '#B91C1C',
      accent: '#EF4444',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'modern-5',
    name: 'Minimal Pro',
    category: 'minimalist',
    atsScore: 99,
    preview: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Ultra-clean design with maximum ATS compatibility',
    features: ['Highest ATS Score', 'Clean Typography', 'Structured Layout', 'Easy Scanning'],
    colors: {
      primary: '#374151',
      secondary: '#1F2937',
      accent: '#6B7280',
      text: '#111827',
      background: '#FFFFFF'
    }
  },
  // Classic Templates
  {
    id: 'classic-1',
    name: 'Traditional',
    category: 'classic',
    atsScore: 95,
    preview: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Time-tested format preferred by traditional industries',
    features: ['Conservative Design', 'Standard Layout', 'Professional Fonts', 'Industry Standard'],
    colors: {
      primary: '#1F2937',
      secondary: '#374151',
      accent: '#4B5563',
      text: '#111827',
      background: '#FFFFFF'
    }
  },
  {
    id: 'classic-2',
    name: 'Corporate Standard',
    category: 'classic',
    atsScore: 93,
    preview: 'https://images.pexels.com/photos/1181407/pexels-photo-1181407.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Perfect for corporate environments and formal applications',
    features: ['Corporate Style', 'Formal Layout', 'Conservative Colors', 'Professional Appeal'],
    colors: {
      primary: '#1E40AF',
      secondary: '#1D4ED8',
      accent: '#3B82F6',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  // Add 23 more templates...
  {
    id: 'creative-1',
    name: 'Artistic Flair',
    category: 'creative',
    atsScore: 91,
    preview: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Eye-catching design for creative industries',
    features: ['Unique Layout', 'Color Gradients', 'Creative Sections', 'Visual Impact'],
    colors: {
      primary: '#EC4899',
      secondary: '#DB2777',
      accent: '#F472B6',
      text: '#374151',
      background: '#FEFEFE'
    }
  },
  {
    id: 'technical-1',
    name: 'Developer Focus',
    category: 'technical',
    atsScore: 96,
    preview: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Optimized for software engineers and developers',
    features: ['Code Snippets', 'Tech Stack Display', 'Project Links', 'GitHub Stats'],
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10B981',
      text: '#111827',
      background: '#F9FAFB'
    }
  },
  {
    id: 'executive-1',
    name: 'Leadership',
    category: 'executive',
    atsScore: 97,
    preview: 'https://images.pexels.com/photos/590471/pexels-photo-590471.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Designed for C-level executives and senior management',
    features: ['Executive Summary', 'Board Experience', 'Strategic Achievements', 'Leadership Focus'],
    colors: {
      primary: '#7C2D12',
      secondary: '#92400E',
      accent: '#D97706',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  // Continue with more templates to reach 30+
  {
    id: 'modern-6',
    name: 'Startup Founder',
    category: 'modern',
    atsScore: 95,
    preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Dynamic template for entrepreneurs and startup founders',
    features: ['Innovation Focus', 'Venture Highlights', 'Growth Metrics', 'Vision Statement'],
    colors: {
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#FBBF24',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'modern-7',
    name: 'Data Scientist',
    category: 'technical',
    atsScore: 96,
    preview: 'https://images.pexels.com/photos/590045/pexels-photo-590045.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Specialized for data science and analytics roles',
    features: ['Data Visualization', 'Research Papers', 'Statistical Skills', 'ML Projects'],
    colors: {
      primary: '#0891B2',
      secondary: '#0E7490',
      accent: '#06B6D4',
      text: '#111827',
      background: '#F8FAFC'
    }
  },
  {
    id: 'creative-2',
    name: 'Designer Portfolio',
    category: 'creative',
    atsScore: 92,
    preview: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Showcase your design work with visual elements',
    features: ['Portfolio Grid', 'Design Tools', 'Creative Process', 'Visual Hierarchy'],
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#A78BFA',
      text: '#374151',
      background: '#FFFFFF'
    }
  },
  {
    id: 'minimalist-2',
    name: 'Clean Slate',
    category: 'minimalist',
    atsScore: 98,
    preview: 'https://images.pexels.com/photos/590024/pexels-photo-590024.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Ultra-minimal design focusing on content',
    features: ['Maximum Readability', 'Clean Lines', 'Perfect Spacing', 'Content Focus'],
    colors: {
      primary: '#000000',
      secondary: '#374151',
      accent: '#6B7280',
      text: '#111827',
      background: '#FFFFFF'
    }
  },
  {
    id: 'modern-8',
    name: 'Marketing Pro',
    category: 'modern',
    atsScore: 94,
    preview: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Perfect for marketing and sales professionals',
    features: ['Campaign Highlights', 'ROI Metrics', 'Brand Experience', 'Growth Numbers'],
    colors: {
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: '#F87171',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'technical-2',
    name: 'DevOps Engineer',
    category: 'technical',
    atsScore: 97,
    preview: 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Specialized for DevOps and infrastructure roles',
    features: ['Infrastructure Skills', 'Cloud Platforms', 'Automation Tools', 'System Architecture'],
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#34D399',
      text: '#111827',
      background: '#F0FDF4'
    }
  },
  {
    id: 'executive-2',
    name: 'Board Member',
    category: 'executive',
    atsScore: 98,
    preview: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Distinguished template for board positions',
    features: ['Board Experience', 'Governance Skills', 'Strategic Vision', 'Industry Expertise'],
    colors: {
      primary: '#1E40AF',
      secondary: '#1D4ED8',
      accent: '#60A5FA',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'creative-3',
    name: 'Content Creator',
    category: 'creative',
    atsScore: 90,
    preview: 'https://images.pexels.com/photos/1181678/pexels-photo-1181678.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Dynamic template for content creators and influencers',
    features: ['Social Media Stats', 'Content Portfolio', 'Engagement Metrics', 'Brand Partnerships'],
    colors: {
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#FCD34D',
      text: '#1F2937',
      background: '#FFFBEB'
    }
  },
  {
    id: 'modern-9',
    name: 'Product Manager',
    category: 'modern',
    atsScore: 95,
    preview: 'https://images.pexels.com/photos/1181679/pexels-photo-1181679.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Tailored for product management roles',
    features: ['Product Launches', 'User Metrics', 'Roadmap Experience', 'Cross-functional Leadership'],
    colors: {
      primary: '#7C3AED',
      secondary: '#6D28D9',
      accent: '#C084FC',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'technical-3',
    name: 'AI/ML Engineer',
    category: 'technical',
    atsScore: 96,
    preview: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Specialized for AI and machine learning roles',
    features: ['ML Models', 'Research Papers', 'Algorithm Expertise', 'Data Science Skills'],
    colors: {
      primary: '#0891B2',
      secondary: '#0E7490',
      accent: '#22D3EE',
      text: '#111827',
      background: '#F0F9FF'
    }
  },
  {
    id: 'minimalist-3',
    name: 'Academic',
    category: 'minimalist',
    atsScore: 97,
    preview: 'https://images.pexels.com/photos/590038/pexels-photo-590038.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Perfect for academic and research positions',
    features: ['Publications List', 'Research Focus', 'Academic Achievements', 'Conference Presentations'],
    colors: {
      primary: '#374151',
      secondary: '#1F2937',
      accent: '#9CA3AF',
      text: '#111827',
      background: '#FFFFFF'
    }
  },
  {
    id: 'modern-10',
    name: 'Sales Executive',
    category: 'modern',
    atsScore: 94,
    preview: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Results-driven template for sales professionals',
    features: ['Sales Metrics', 'Revenue Growth', 'Client Relationships', 'Target Achievement'],
    colors: {
      primary: '#DC2626',
      secondary: '#B91C1C',
      accent: '#FCA5A5',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'creative-4',
    name: 'UX Designer',
    category: 'creative',
    atsScore: 93,
    preview: 'https://images.pexels.com/photos/590042/pexels-photo-590042.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'User-centered design template for UX professionals',
    features: ['Design Process', 'User Research', 'Prototyping Tools', 'Usability Testing'],
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#DDD6FE',
      text: '#374151',
      background: '#FEFEFE'
    }
  },
  {
    id: 'executive-3',
    name: 'Consultant',
    category: 'executive',
    atsScore: 96,
    preview: 'https://images.pexels.com/photos/590044/pexels-photo-590044.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Professional template for consultants and advisors',
    features: ['Client Success Stories', 'Industry Expertise', 'Problem Solving', 'Strategic Thinking'],
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#A7F3D0',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'technical-4',
    name: 'Cybersecurity',
    category: 'technical',
    atsScore: 97,
    preview: 'https://images.pexels.com/photos/5380646/pexels-photo-5380646.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Secure template for cybersecurity professionals',
    features: ['Security Certifications', 'Threat Analysis', 'Risk Assessment', 'Compliance Experience'],
    colors: {
      primary: '#DC2626',
      secondary: '#B91C1C',
      accent: '#FEE2E2',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'modern-11',
    name: 'HR Professional',
    category: 'modern',
    atsScore: 94,
    preview: 'https://images.pexels.com/photos/590048/pexels-photo-590048.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'People-focused template for HR professionals',
    features: ['Employee Relations', 'Talent Acquisition', 'Policy Development', 'Culture Building'],
    colors: {
      primary: '#EC4899',
      secondary: '#DB2777',
      accent: '#FBCFE8',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'creative-5',
    name: 'Photographer',
    category: 'creative',
    atsScore: 89,
    preview: 'https://images.pexels.com/photos/590050/pexels-photo-590050.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Visual template showcasing photography work',
    features: ['Portfolio Gallery', 'Equipment List', 'Client Testimonials', 'Exhibition History'],
    colors: {
      primary: '#000000',
      secondary: '#374151',
      accent: '#F3F4F6',
      text: '#111827',
      background: '#FFFFFF'
    }
  },
  {
    id: 'minimalist-4',
    name: 'Finance Professional',
    category: 'minimalist',
    atsScore: 98,
    preview: 'https://images.pexels.com/photos/4386375/pexels-photo-4386375.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Conservative template for finance roles',
    features: ['Financial Analysis', 'Investment Experience', 'Risk Management', 'Regulatory Knowledge'],
    colors: {
      primary: '#1E40AF',
      secondary: '#1D4ED8',
      accent: '#DBEAFE',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'modern-12',
    name: 'Healthcare Professional',
    category: 'modern',
    atsScore: 95,
    preview: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Caring template for healthcare professionals',
    features: ['Medical Certifications', 'Patient Care', 'Clinical Experience', 'Healthcare Technology'],
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#D1FAE5',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'technical-5',
    name: 'Mobile Developer',
    category: 'technical',
    atsScore: 96,
    preview: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Mobile-first template for app developers',
    features: ['App Portfolio', 'Platform Expertise', 'User Ratings', 'Download Statistics'],
    colors: {
      primary: '#7C3AED',
      secondary: '#6D28D9',
      accent: '#EDE9FE',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'executive-4',
    name: 'Non-Profit Leader',
    category: 'executive',
    atsScore: 95,
    preview: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Mission-driven template for non-profit leaders',
    features: ['Impact Metrics', 'Fundraising Success', 'Community Engagement', 'Social Mission'],
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#A7F3D0',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'creative-6',
    name: 'Video Producer',
    category: 'creative',
    atsScore: 91,
    preview: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Dynamic template for video and film professionals',
    features: ['Video Portfolio', 'Production Credits', 'Equipment Expertise', 'Client Projects'],
    colors: {
      primary: '#DC2626',
      secondary: '#B91C1C',
      accent: '#FEE2E2',
      text: '#1F2937',
      background: '#000000'
    }
  },
  {
    id: 'modern-13',
    name: 'Operations Manager',
    category: 'modern',
    atsScore: 95,
    preview: 'https://images.pexels.com/photos/590062/pexels-photo-590062.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Efficient template for operations professionals',
    features: ['Process Optimization', 'Cost Reduction', 'Team Leadership', 'Quality Improvement'],
    colors: {
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#FEF3C7',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'minimalist-5',
    name: 'Legal Professional',
    category: 'minimalist',
    atsScore: 97,
    preview: 'https://images.pexels.com/photos/4427610/pexels-photo-4427610.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Professional template for legal careers',
    features: ['Bar Admissions', 'Case Experience', 'Legal Specializations', 'Court Appearances'],
    colors: {
      primary: '#1F2937',
      secondary: '#374151',
      accent: '#F3F4F6',
      text: '#111827',
      background: '#FFFFFF'
    }
  },
  {
    id: 'technical-6',
    name: 'Cloud Architect',
    category: 'technical',
    atsScore: 97,
    preview: 'https://images.pexels.com/photos/590066/pexels-photo-590066.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Scalable template for cloud professionals',
    features: ['Cloud Platforms', 'Architecture Design', 'Migration Projects', 'Cost Optimization'],
    colors: {
      primary: '#0891B2',
      secondary: '#0E7490',
      accent: '#CFFAFE',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'modern-14',
    name: 'Project Manager',
    category: 'modern',
    atsScore: 96,
    preview: 'https://images.pexels.com/photos/590068/pexels-photo-590068.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Organized template for project management roles',
    features: ['Project Success Rate', 'Team Leadership', 'Budget Management', 'Stakeholder Relations'],
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#F3E8FF',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },
  {
    id: 'creative-7',
    name: 'Brand Manager',
    category: 'creative',
    atsScore: 93,
    preview: 'https://images.pexels.com/photos/590070/pexels-photo-590070.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Brand-focused template for marketing professionals',
    features: ['Brand Strategy', 'Campaign Results', 'Market Research', 'Creative Direction'],
    colors: {
      primary: '#EC4899',
      secondary: '#DB2777',
      accent: '#FCE7F3',
      text: '#1F2937',
      background: '#FFFFFF'
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