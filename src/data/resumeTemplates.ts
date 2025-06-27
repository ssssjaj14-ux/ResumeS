export interface ResumeTemplate {
  id: string;
  name: string;
  category: 'modern' | 'classic' | 'creative' | 'executive' | 'technical' | 'minimalist' | 'artistic' | 'corporate' | 'startup' | 'academic';
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
  layout: 'single-column' | 'two-column' | 'three-column' | 'sidebar' | 'header-focus' | 'timeline' | 'grid' | 'asymmetric';
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: string;
  };
}

export const resumeTemplates: ResumeTemplate[] = [
  // Modern Templates with Unique Designs
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
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: 'medium'
    }
  },
  {
    id: 'pixelport-1',
    name: 'PixelPort Creative',
    category: 'creative',
    atsScore: 92,
    preview: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Pixel-perfect design with modern aesthetics for digital creators',
    features: ['Pixel Grid Layout', 'Digital Portfolio', 'Interactive Elements', 'Modern Typography'],
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#45B7D1',
      text: '#2C3E50',
      background: '#F8F9FA'
    },
    layout: 'grid',
    typography: {
      headingFont: 'Poppins',
      bodyFont: 'Open Sans',
      fontSize: 'medium'
    }
  },
  {
    id: 'neowave-1',
    name: 'NeoWave Futuristic',
    category: 'modern',
    atsScore: 95,
    preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Futuristic wave-inspired design for forward-thinking professionals',
    features: ['Wave Patterns', 'Gradient Backgrounds', 'Modern Icons', 'Fluid Layout'],
    colors: {
      primary: '#667EEA',
      secondary: '#764BA2',
      accent: '#F093FB',
      text: '#2D3748',
      background: '#FFFFFF'
    },
    layout: 'sidebar',
    typography: {
      headingFont: 'Montserrat',
      bodyFont: 'Source Sans Pro',
      fontSize: 'medium'
    }
  },
  {
    id: 'aurastack-1',
    name: 'AuraStack Dynamic',
    category: 'modern',
    atsScore: 94,
    preview: 'https://images.pexels.com/photos/590045/pexels-photo-590045.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Layered design with glowing aura effects for tech professionals',
    features: ['Layered Sections', 'Glow Effects', 'Tech Stack Display', 'Modern Cards'],
    colors: {
      primary: '#00D4FF',
      secondary: '#5B73FF',
      accent: '#9F7AEA',
      text: '#1A202C',
      background: '#F7FAFC'
    },
    layout: 'three-column',
    typography: {
      headingFont: 'Roboto',
      bodyFont: 'Lato',
      fontSize: 'medium'
    }
  },
  {
    id: 'glintlab-1',
    name: 'GlintLab Research',
    category: 'technical',
    atsScore: 97,
    preview: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Laboratory-inspired design with metallic accents for researchers',
    features: ['Lab Theme', 'Metallic Accents', 'Research Focus', 'Publication List'],
    colors: {
      primary: '#718096',
      secondary: '#4A5568',
      accent: '#ED8936',
      text: '#2D3748',
      background: '#FFFFFF'
    },
    layout: 'two-column',
    typography: {
      headingFont: 'IBM Plex Sans',
      bodyFont: 'IBM Plex Sans',
      fontSize: 'medium'
    }
  },
  {
    id: 'craftfolio-1',
    name: 'Craftfolio Artisan',
    category: 'artistic',
    atsScore: 90,
    preview: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Handcrafted aesthetic for artists and creative professionals',
    features: ['Handcrafted Look', 'Artistic Elements', 'Portfolio Gallery', 'Creative Typography'],
    colors: {
      primary: '#D69E2E',
      secondary: '#B7791F',
      accent: '#F6E05E',
      text: '#2D3748',
      background: '#FFFAF0'
    },
    layout: 'asymmetric',
    typography: {
      headingFont: 'Crimson Text',
      bodyFont: 'Libre Baskerville',
      fontSize: 'medium'
    }
  },
  {
    id: 'skytrail-1',
    name: 'SkyTrail Explorer',
    category: 'modern',
    atsScore: 93,
    preview: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Sky-inspired design with cloud patterns for aviation and travel industry',
    features: ['Sky Theme', 'Cloud Patterns', 'Travel Icons', 'Horizon Layout'],
    colors: {
      primary: '#3182CE',
      secondary: '#2C5282',
      accent: '#63B3ED',
      text: '#2D3748',
      background: '#EBF8FF'
    },
    layout: 'header-focus',
    typography: {
      headingFont: 'Nunito',
      bodyFont: 'Nunito Sans',
      fontSize: 'medium'
    }
  },
  {
    id: 'vantaport-1',
    name: 'VantaPort Dynamic',
    category: 'modern',
    atsScore: 95,
    preview: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Dynamic animated background effects for modern professionals',
    features: ['Animated Backgrounds', 'Dynamic Effects', 'Modern Layout', 'Interactive Elements'],
    colors: {
      primary: '#805AD5',
      secondary: '#6B46C1',
      accent: '#9F7AEA',
      text: '#1A202C',
      background: '#F7FAFC'
    },
    layout: 'sidebar',
    typography: {
      headingFont: 'Space Grotesk',
      bodyFont: 'Inter',
      fontSize: 'medium'
    }
  },
  {
    id: 'codexgrid-1',
    name: 'CodexGrid Developer',
    category: 'technical',
    atsScore: 98,
    preview: 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Grid-based layout perfect for developers and engineers',
    features: ['Grid Layout', 'Code Snippets', 'Tech Stack', 'Project Grid'],
    colors: {
      primary: '#1A202C',
      secondary: '#2D3748',
      accent: '#4FD1C7',
      text: '#E2E8F0',
      background: '#171923'
    },
    layout: 'grid',
    typography: {
      headingFont: 'Fira Code',
      bodyFont: 'Source Code Pro',
      fontSize: 'medium'
    }
  },
  {
    id: 'devloom-1',
    name: 'DevLoom Weaver',
    category: 'technical',
    atsScore: 96,
    preview: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Woven pattern design for full-stack developers',
    features: ['Woven Patterns', 'Full-Stack Focus', 'Technology Weave', 'Modern Cards'],
    colors: {
      primary: '#38B2AC',
      secondary: '#319795',
      accent: '#4FD1C7',
      text: '#2D3748',
      background: '#F0FFF4'
    },
    layout: 'two-column',
    typography: {
      headingFont: 'Ubuntu',
      bodyFont: 'Ubuntu',
      fontSize: 'medium'
    }
  },
  {
    id: 'coderipple-1',
    name: 'CodeRipple Innovation',
    category: 'technical',
    atsScore: 94,
    preview: 'https://images.pexels.com/photos/1181679/pexels-photo-1181679.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Ripple effect design for innovative developers',
    features: ['Ripple Effects', 'Code Animations', 'Dynamic Layout', 'Tech Showcase'],
    colors: {
      primary: '#667EEA',
      secondary: '#764BA2',
      accent: '#A78BFA',
      text: '#1A202C',
      background: '#FFFFFF'
    },
    layout: 'timeline',
    typography: {
      headingFont: 'JetBrains Mono',
      bodyFont: 'Inter',
      fontSize: 'medium'
    }
  },
  // Classic Templates
  {
    id: 'classic-1',
    name: 'Traditional Elite',
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
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Times New Roman',
      bodyFont: 'Times New Roman',
      fontSize: 'medium'
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
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      fontSize: 'medium'
    }
  },
  // Executive Templates
  {
    id: 'executive-1',
    name: 'Leadership Excellence',
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
    },
    layout: 'header-focus',
    typography: {
      headingFont: 'Merriweather',
      bodyFont: 'Source Sans Pro',
      fontSize: 'large'
    }
  },
  {
    id: 'executive-2',
    name: 'Board Member Elite',
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
    },
    layout: 'two-column',
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Lora',
      fontSize: 'large'
    }
  },
  // Minimalist Templates
  {
    id: 'minimalist-1',
    name: 'Clean Slate Pro',
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
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Helvetica',
      bodyFont: 'Helvetica',
      fontSize: 'medium'
    }
  },
  {
    id: 'minimalist-2',
    name: 'Pure Focus Elite',
    category: 'minimalist',
    atsScore: 99,
    preview: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Highest ATS compatibility with pure minimalism',
    features: ['Highest ATS Score', 'Pure Typography', 'Zero Distractions', 'Perfect Structure'],
    colors: {
      primary: '#374151',
      secondary: '#1F2937',
      accent: '#6B7280',
      text: '#111827',
      background: '#FFFFFF'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      fontSize: 'medium'
    }
  },
  // Creative Templates
  {
    id: 'creative-1',
    name: 'Creative Genius',
    category: 'creative',
    atsScore: 88,
    preview: 'https://images.pexels.com/photos/590050/pexels-photo-590050.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Artistic template for creative professionals',
    features: ['Artistic Layout', 'Creative Typography', 'Portfolio Integration', 'Visual Elements'],
    colors: {
      primary: '#EC4899',
      secondary: '#DB2777',
      accent: '#FBCFE8',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'asymmetric',
    typography: {
      headingFont: 'Dancing Script',
      bodyFont: 'Lato',
      fontSize: 'medium'
    }
  },
  {
    id: 'creative-2',
    name: 'Visual Artist Pro',
    category: 'creative',
    atsScore: 87,
    preview: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Visual-focused template for artists and designers',
    features: ['Visual Portfolio', 'Artistic Elements', 'Creative Sections', 'Gallery Layout'],
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#DDD6FE',
      text: '#374151',
      background: '#FEFEFE'
    },
    layout: 'grid',
    typography: {
      headingFont: 'Abril Fatface',
      bodyFont: 'Source Sans Pro',
      fontSize: 'medium'
    }
  },
  // Startup Templates
  {
    id: 'startup-1',
    name: 'Startup Founder',
    category: 'startup',
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
    },
    layout: 'asymmetric',
    typography: {
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontSize: 'medium'
    }
  },
  {
    id: 'startup-2',
    name: 'Disruptor Elite',
    category: 'startup',
    atsScore: 93,
    preview: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Bold design for industry disruptors and innovators',
    features: ['Disruptive Design', 'Innovation Metrics', 'Bold Typography', 'Future Focus'],
    colors: {
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: '#F87171',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'grid',
    typography: {
      headingFont: 'Space Grotesk',
      bodyFont: 'Inter',
      fontSize: 'medium'
    }
  },
  // Academic Templates
  {
    id: 'academic-1',
    name: 'Research Scholar',
    category: 'academic',
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
    },
    layout: 'two-column',
    typography: {
      headingFont: 'Crimson Text',
      bodyFont: 'Crimson Text',
      fontSize: 'medium'
    }
  },
  {
    id: 'academic-2',
    name: 'Professor Elite',
    category: 'academic',
    atsScore: 96,
    preview: 'https://images.pexels.com/photos/4386375/pexels-photo-4386375.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Distinguished template for academic professionals',
    features: ['Teaching Experience', 'Research Publications', 'Academic Honors', 'Grant History'],
    colors: {
      primary: '#1E40AF',
      secondary: '#1D4ED8',
      accent: '#DBEAFE',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Libre Baskerville',
      bodyFont: 'Libre Baskerville',
      fontSize: 'medium'
    }
  },
  // Corporate Templates
  {
    id: 'corporate-1',
    name: 'Fortune 500 Elite',
    category: 'corporate',
    atsScore: 96,
    preview: 'https://images.pexels.com/photos/590044/pexels-photo-590044.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Premium template for Fortune 500 companies',
    features: ['Corporate Branding', 'Executive Summary', 'Performance Metrics', 'Leadership Skills'],
    colors: {
      primary: '#1F2937',
      secondary: '#374151',
      accent: '#6B7280',
      text: '#111827',
      background: '#FFFFFF'
    },
    layout: 'header-focus',
    typography: {
      headingFont: 'Roboto',
      bodyFont: 'Roboto',
      fontSize: 'medium'
    }
  },
  {
    id: 'corporate-2',
    name: 'Global Enterprise',
    category: 'corporate',
    atsScore: 95,
    preview: 'https://images.pexels.com/photos/590048/pexels-photo-590048.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'International corporate template with global appeal',
    features: ['Global Experience', 'Multi-cultural Skills', 'International Projects', 'Language Skills'],
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#A7F3D0',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'two-column',
    typography: {
      headingFont: 'Open Sans',
      bodyFont: 'Open Sans',
      fontSize: 'medium'
    }
  },
  // Additional Modern Templates with Unique Styles
  {
    id: 'modern-quantum',
    name: 'Quantum Pro',
    category: 'modern',
    atsScore: 92,
    preview: 'https://images.pexels.com/photos/590068/pexels-photo-590068.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Quantum-inspired design for cutting-edge professionals',
    features: ['Quantum Effects', 'Particle Animations', 'Scientific Layout', 'Research Focus'],
    colors: {
      primary: '#6366F1',
      secondary: '#4F46E5',
      accent: '#C7D2FE',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'timeline',
    typography: {
      headingFont: 'Orbitron',
      bodyFont: 'Roboto',
      fontSize: 'medium'
    }
  },
  {
    id: 'modern-holographic',
    name: 'Holographic Elite',
    category: 'modern',
    atsScore: 91,
    preview: 'https://images.pexels.com/photos/590070/pexels-photo-590070.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Holographic effects for futuristic professionals',
    features: ['Holographic Design', 'Iridescent Colors', 'Future Tech', '3D Elements'],
    colors: {
      primary: '#EC4899',
      secondary: '#DB2777',
      accent: '#FCE7F3',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'asymmetric',
    typography: {
      headingFont: 'Exo 2',
      bodyFont: 'Inter',
      fontSize: 'medium'
    }
  },
  {
    id: 'modern-digital-native',
    name: 'Digital Native Pro',
    category: 'modern',
    atsScore: 94,
    preview: 'https://images.pexels.com/photos/590062/pexels-photo-590062.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Born-digital template for modern professionals',
    features: ['Digital Focus', 'Social Media Integration', 'Online Portfolio', 'Tech Savvy'],
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#F3E8FF',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'sidebar',
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: 'medium'
    }
  },
  {
    id: 'modern-future-ready',
    name: 'Future Ready Elite',
    category: 'modern',
    atsScore: 93,
    preview: 'https://images.pexels.com/photos/590066/pexels-photo-590066.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Future-focused design for next-gen professionals',
    features: ['Future Design', 'AI Integration', 'Automation Focus', 'Innovation Metrics'],
    colors: {
      primary: '#0891B2',
      secondary: '#0E7490',
      accent: '#CFFAFE',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'three-column',
    typography: {
      headingFont: 'Space Grotesk',
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

export const getTemplatesByAtsScore = (minScore: number = 90) => {
  return resumeTemplates.filter(template => template.atsScore >= minScore);
};

export const searchTemplates = (query: string) => {
  const searchTerm = query.toLowerCase();
  return resumeTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm) ||
    template.description.toLowerCase().includes(searchTerm) ||
    template.category.toLowerCase().includes(searchTerm) ||
    template.features.some(feature => feature.toLowerCase().includes(searchTerm))
  );
};