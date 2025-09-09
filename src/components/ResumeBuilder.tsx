import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Eye, 
  Save, 
  Upload,
  Plus,
  Trash2,
  Brain,
  Sparkles,
  CheckCircle,
  AlertCircle,
  User,
  Briefcase,
  GraduationCap,
  Code as CodeIcon,
  FolderOpen
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { generateResumePDF, ResumeData } from '../utils/pdfGenerator';
import TemplateSelector from './TemplateSelector';
import ResumePreview from './ResumePreview';
import ResumeImporter from './ResumeImporter';
import { analyzeResumeWithGemini } from '../services/geminiService';
import toast from 'react-hot-toast';

// Helper function to generate dynamic class names
const getSectionIconClass = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
  };
  return colorMap[color] || 'from-gray-500 to-gray-600';
};

const ResumeBuilder: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern-1');
  const [showPreview, setShowPreview] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const { register, control, handleSubmit, watch, setValue, reset } = useForm<ResumeData>({
    defaultValues: {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        linkedin: '',
        github: ''
      },
      experience: [{ title: '', company: '', duration: '', description: '' }],
      education: [{ degree: '', institution: '', year: '', gpa: '' }],
      skills: [],
      projects: [{ name: '', description: '', technologies: '', link: '' }]
    }
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experience'
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education'
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: 'projects'
  });

  const watchedData = watch();

  useEffect(() => {
    // Load saved data
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        reset(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, [reset]);

  const onSubmit = (data: ResumeData) => {
    try {
      // Validate required fields
      if (!data.personalInfo.name || !data.personalInfo.email) {
        toast.error('Please fill in your name and email before generating resume.');
export default ResumeBuilder;
