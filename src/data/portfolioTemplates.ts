export interface PortfolioTemplate {
  id: string;
  name: string;
  category: 'modern' | 'creative' | 'developer' | 'business' | 'minimal';
  preview: string;
  description: string;
  features: string[];
  technologies: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export const portfolioTemplates: PortfolioTemplate[] = [
  {
    id: 'portfolio-1',
    name: 'Developer Pro',
    category: 'developer',
    preview: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Advanced portfolio for software developers with interactive elements',
    features: ['Code Syntax Highlighting', 'GitHub Integration', 'Live Project Demos', 'Tech Stack Visualization', 'Performance Metrics'],
    technologies: ['React', 'TypeScript', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
    colors: {
      primary: '#0F172A',
      secondary: '#1E293B',
      accent: '#3B82F6',
      background: '#020617',
      text: '#F8FAFC'
    }
  },
  {
    id: 'portfolio-2',
    name: 'Creative Studio',
    category: 'creative',
    preview: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Stunning visual portfolio for designers and artists',
    features: ['Masonry Gallery', 'Smooth Animations', 'Video Backgrounds', 'Interactive Hover Effects', 'Mobile Optimized'],
    technologies: ['Vue.js', 'GSAP', 'WebGL', 'CSS Grid', 'Progressive Web App'],
    colors: {
      primary: '#7C3AED',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#1F2937'
    }
  },
  {
    id: 'portfolio-3',
    name: 'Business Executive',
    category: 'business',
    preview: 'https://images.pexels.com/photos/590471/pexels-photo-590471.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Professional portfolio for executives and consultants',
    features: ['Executive Summary', 'Case Studies', 'Testimonials Carousel', 'Achievement Timeline', 'Contact Integration'],
    technologies: ['Next.js', 'Styled Components', 'Chart.js', 'EmailJS', 'SEO Optimized'],
    colors: {
      primary: '#1E40AF',
      secondary: '#059669',
      accent: '#DC2626',
      background: '#F8FAFC',
      text: '#1F2937'
    }
  },
  {
    id: 'portfolio-4',
    name: 'Minimal Elegance',
    category: 'minimal',
    preview: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Clean and elegant portfolio focusing on content',
    features: ['Typography Focus', 'Subtle Animations', 'Fast Loading', 'Accessibility Optimized', 'Print Friendly'],
    technologies: ['Svelte', 'Vanilla CSS', 'Intersection Observer', 'Service Worker', 'Lighthouse Optimized'],
    colors: {
      primary: '#000000',
      secondary: '#374151',
      accent: '#6B7280',
      background: '#FFFFFF',
      text: '#111827'
    }
  },
  {
    id: 'portfolio-5',
    name: 'Tech Innovator',
    category: 'modern',
    preview: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Cutting-edge portfolio with modern web technologies',
    features: ['3D Elements', 'Particle Systems', 'Dark/Light Mode', 'Voice Navigation', 'AI Chatbot'],
    technologies: ['React', 'Three.js', 'WebRTC', 'WebAssembly', 'Machine Learning'],
    colors: {
      primary: '#10B981',
      secondary: '#06B6D4',
      accent: '#8B5CF6',
      background: '#0F172A',
      text: '#F1F5F9'
    }
  }
];

export const getPortfolioTemplateById = (id: string) => {
  return portfolioTemplates.find(template => template.id === id);
};

export const getPortfolioTemplatesByCategory = (category: string) => {
  return portfolioTemplates.filter(template => template.category === category);
};