import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Github, 
  ExternalLink, 
  Code, 
  Palette, 
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  Download,
  Eye,
  CheckCircle
} from 'lucide-react';
import { downloadPortfolio, generateGitHubPages, PortfolioData } from '../utils/portfolioGenerator';
import toast, { Toaster } from 'react-hot-toast';
import { searchJobs, Job } from '../services/jobService';
import jsPDF from 'jspdf';

const GEMINI_API_KEY = 'AIzaSyBS9GMNth3NocYCEABb3maGb0xWD1aemjQ';

const Portfolio: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      linkedin: '',
      github: ''
    },
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'Express.js'],
    projects: [
      {
        name: 'Smart Resume Builder',
        description: 'AI-powered resume and portfolio builder for students with ATS-friendly templates.',
        technologies: 'React, TypeScript, Tailwind CSS, jsPDF',
        link: 'https://github.com/skshakeel/resume-builder'
      },
      {
        name: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with payment integration and admin dashboard.',
        technologies: 'MERN Stack, Stripe, JWT Authentication',
        link: 'https://github.com/skshakeel/ecommerce'
      }
    ],
    experience: [
      {
        title: 'Full Stack Developer',
        company: 'Tech Solutions Inc.',
        duration: '2023 - Present',
        description: 'Developing scalable web applications using modern technologies and best practices.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Technology',
        institution: 'Indian Institute of Technology',
        year: '2020-2024',
        gpa: '8.5'
      }
    ]
  });
  const [modal, setModal] = useState<null | 'domain' | 'github' | 'seo' | 'customize'>(null);
  const [AIReport, setAIReport] = useState<string>('');
  const [showAIReport, setShowAIReport] = useState<boolean>(false);

  const templates = [
    {
      id: 0,
      name: "Modern Minimal",
      description: "Clean and professional design with focus on content",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
      color: "from-blue-500 to-cyan-500",
      features: ["Responsive Design", "Dark Mode", "Fast Loading", "SEO Optimized"]
    },
    {
      id: 1,
      name: "Creative Portfolio",
      description: "Bold and creative design for designers and artists",
      image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400",
      color: "from-purple-500 to-pink-500",
      features: ["Animated Sections", "Gallery View", "Creative Layouts", "Interactive Elements"]
    },
    {
      id: 2,
      name: "Developer Focus",
      description: "Technical portfolio perfect for developers and engineers",
      image: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400",
      color: "from-emerald-500 to-teal-500",
      features: ["Code Snippets", "Project Showcase", "Tech Stack Display", "GitHub Integration"]
    }
  ];

  const portfolioFeatures = [
    {
      icon: Globe,
      title: "Custom Domain",
      description: "Get your own professional domain like yourname.dev",
      onClick: () => setModal('domain')
    },
    {
      icon: Github,
      title: "GitHub Pages",
      description: "Automatically deployed and hosted on GitHub Pages for free",
      onClick: () => setModal('github')
