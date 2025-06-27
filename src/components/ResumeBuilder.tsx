import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Eye, 
  Save, 
  Plus, 
  Trash2, 
  Upload,
  Sparkles,
  Brain,
  Zap,
  Award,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Star,
  Globe,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { generateResumePDF, ResumeData } from '../utils/pdfGenerator';
import { resumeTemplates, getTemplateById } from '../data/resumeTemplates';
import ResumePreview from './ResumePreview';
import ResumeImporter from './ResumeImporter';
import TemplateSelector from './TemplateSelector';
import toast, { Toaster } from 'react-hot-toast';

const ResumeBuilder: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern-1');
  const [showPreview, setShowPreview] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [aiScore, setAiScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

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
      experience: [],
      education: [],
      skills: [],
      projects: []
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

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('resumeData', JSON.stringify(watchedData));
    }, 1000);

    return () => clearTimeout(timer);
  }, [watchedData]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        reset(parsedData);
        toast.success('Previous work restored!');
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, [reset]);

  // AI Analysis
  useEffect(() => {
    if (watchedData.personalInfo.name || watchedData.skills.length > 0) {
      analyzeResumeWithAI();
    }
  }, [watchedData]);

  const analyzeResumeWithAI = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let score = 0;
    
    // Scoring algorithm
    if (watchedData.personalInfo.name) score += 10;
    if (watchedData.personalInfo.email) score += 10;
    if (watchedData.personalInfo.phone) score += 5;
    if (watchedData.personalInfo.summary && watchedData.personalInfo.summary.length > 50) score += 15;
    if (watchedData.experience.length > 0) score += 20;
    if (watchedData.education.length > 0) score += 15;
    if (watchedData.skills.length >= 5) score += 15;
    if (watchedData.skills.length >= 10) score += 10;
    if (watchedData.projects && watchedData.projects.length > 0) score += 10;
    
    setAiScore(Math.min(score, 100));
    setIsAnalyzing(false);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
    toast.success(`Template "${getTemplateById(templateId)?.name}" selected!`);
  };

  const handlePreview = (templateId?: string) => {
    if (templateId) {
      setSelectedTemplate(templateId);
    }
    setShowPreview(true);
  };

  const handleDownload = () => {
    try {
      generateResumePDF(watchedData, selectedTemplate);
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      toast.error('Error generating PDF. Please try again.');
      console.error('PDF generation error:', error);
    }
  };

  const handleImportData = (importedData: ResumeData) => {
    reset(importedData);
    toast.success('Resume data imported successfully!');
  };

  const addSkill = (skill: string) => {
    if (skill && !watchedData.skills.includes(skill)) {
      setValue('skills', [...watchedData.skills, skill]);
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = watchedData.skills.filter((_, i) => i !== index);
    setValue('skills', newSkills);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Award className="w-5 h-5" />;
    if (score >= 70) return <Target className="w-5 h-5" />;
    return <TrendingUp className="w-5 h-5" />;
  };

  const filteredTemplates = resumeTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'All Templates', count: resumeTemplates.length },
    { id: 'modern', name: 'Modern', count: resumeTemplates.filter(t => t.category === 'modern').length },
    { id: 'classic', name: 'Classic', count: resumeTemplates.filter(t => t.category === 'classic').length },
    { id: 'creative', name: 'Creative', count: resumeTemplates.filter(t => t.category === 'creative').length },
    { id: 'technical', name: 'Technical', count: resumeTemplates.filter(t => t.category === 'technical').length },
    { id: 'executive', name: 'Executive', count: resumeTemplates.filter(t => t.category === 'executive').length },
    { id: 'minimalist', name: 'Minimalist', count: resumeTemplates.filter(t => t.category === 'minimalist').length }
  ];

  return (
    <section id="resume" className="py-12 sm:py-20 bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 px-4 py-2 rounded-full text-sm font-medium text-blue-800 dark:text-blue-200 border border-blue-200/50 dark:border-blue-700/50 mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Resume Builder</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Build Your Dream Resume with
            <span className="gradient-text"> AI Intelligence</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create ATS-friendly resumes with 30+ professional templates, AI-powered optimization, 
            and real-time feedback to land your dream job.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12"
        >
          {[
            { icon: FileText, label: 'ATS Templates', value: '30+', color: 'blue' },
            { icon: Users, label: 'Success Rate', value: '95%', color: 'green' },
            { icon: Brain, label: 'AI Powered', value: '100%', color: 'purple' },
            { icon: TrendingUp, label: 'Job Matches', value: '200+', color: 'orange' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg text-center border border-gray-100 dark:border-gray-700"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Quick Actions
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowImporter(true)}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg text-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import Resume</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTemplateSelector(true)}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg text-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Choose Template</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePreview()}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-3 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 transition-all shadow-lg text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Template Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
                  Choose Template
                </h3>
                
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.slice(0, 6).map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedTemplate === template.id 
                        ? 'ring-4 ring-blue-500 shadow-2xl' 
                        : 'shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 relative">
                      <img
                        src={template.preview}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreview(template.id);
                              }}
                              className="flex-1 bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 hover:bg-white/30 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Preview</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Selected Indicator */}
                      {selectedTemplate === template.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <CheckCircle className="w-5 h-5 text-white" />
                        </motion.div>
                      )}

                      {/* ATS Score */}
                      <div className="absolute top-3 left-3">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${
                          template.atsScore >= 95 ? 'bg-green-100 text-green-800' :
                          template.atsScore >= 90 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          <Star className="w-3 h-3" />
                          <span>{template.atsScore}% ATS</span>
                        </div>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        {template.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View All {resumeTemplates.length} Templates →
                </button>
              </div>
            </motion.div>

            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('personalInfo.name', { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register('personalInfo.email', { required: true })}
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    {...register('personalInfo.phone')}
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    {...register('personalInfo.location')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="New York, NY"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    {...register('personalInfo.linkedin')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub Profile
                  </label>
                  <input
                    {...register('personalInfo.github')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://github.com/johndoe"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Professional Summary
                </label>
                <textarea
                  {...register('personalInfo.summary')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Write a compelling summary that highlights your key achievements and career goals..."
                />
              </div>
            </motion.div>

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6">
                Skills & Technologies
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {watchedData.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(index)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a skill (e.g., JavaScript, React, Python)"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        addSkill(target.value);
                        target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                      addSkill(input.value);
                      input.value = '';
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
                
                {/* Suggested Skills */}
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Suggested skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker', 'Git'].map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Experience Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Work Experience
                </h3>
                <button
                  onClick={() => appendExperience({ title: '', company: '', duration: '', description: '' })}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>
              
              <div className="space-y-6">
                {experienceFields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-6 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Experience #{index + 1}
                      </h4>
                      <button
                        onClick={() => removeExperience(index)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Job Title
                        </label>
                        <input
                          {...register(`experience.${index}.title` as const)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Software Engineer"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company
                        </label>
                        <input
                          {...register(`experience.${index}.company` as const)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Tech Company Inc."
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Duration
                        </label>
                        <input
                          {...register(`experience.${index}.duration` as const)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Jan 2020 - Present"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        {...register(`experience.${index}.description` as const)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Describe your key responsibilities and achievements..."
                      />
                    </div>
                  </motion.div>
                ))}
                
                {experienceFields.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No work experience added yet. Click "Add Experience" to get started.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Education Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Education
                </h3>
                <button
                  onClick={() => appendEducation({ degree: '', institution: '', year: '', gpa: '' })}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Education</span>
                </button>
              </div>
              
              <div className="space-y-6">
                {educationFields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-6 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Education #{index + 1}
                      </h4>
                      <button
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Degree
                        </label>
                        <input
                          {...register(`education.${index}.degree` as const)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Bachelor of Science in Computer Science"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Institution
                        </label>
                        <input
                          {...register(`education.${index}.institution` as const)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="University of Technology"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Year
                        </label>
                        <input
                          {...register(`education.${index}.year` as const)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="2020-2024"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          GPA (Optional)
                        </label>
                        <input
                          {...register(`education.${index}.gpa` as const)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="3.8/4.0"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {educationFields.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No education added yet. Click "Add Education" to get started.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Projects Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Projects
                </h3>
                <button
                  onClick={() => appendProject({ name: '', description: '', technologies: '', link: '' })}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>
              
              <div className="space-y-6">
                {projectFields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-6 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Project #{index + 1}
                      </h4>
                      <button
                        onClick={() => removeProject(index)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Project Name
                        </label>
                        <input
                          {...register(`projects.${index}.name` as const)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="E-commerce Website"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Technologies
                        </label>
                        <input
                          {...register(`projects.${index}.technologies` as const)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Project Link (Optional)
                        </label>
                        <input
                          {...register(`projects.${index}.link` as const)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        {...register(`projects.${index}.description` as const)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Describe your project, its features, and your role..."
                      />
                    </div>
                  </motion.div>
                ))}
                
                {projectFields.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No projects added yet. Click "Add Project" to showcase your work.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Score */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 sticky top-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Resume Score
                </h3>
                {isAnalyzing && (
                  <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                )}
              </div>
              
              <div className="text-center mb-6">
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-lg font-bold ${getScoreColor(aiScore)}`}>
                  {getScoreIcon(aiScore)}
                  <span>{aiScore}/100</span>
                </div>
                
                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${aiScore}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${aiScore}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Personal Info</span>
                  <span className={`font-medium ${watchedData.personalInfo.name && watchedData.personalInfo.email ? 'text-green-600' : 'text-red-600'}`}>
                    {watchedData.personalInfo.name && watchedData.personalInfo.email ? '✓' : '✗'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Professional Summary</span>
                  <span className={`font-medium ${watchedData.personalInfo.summary && watchedData.personalInfo.summary.length > 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {watchedData.personalInfo.summary && watchedData.personalInfo.summary.length > 50 ? '✓' : '✗'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Work Experience</span>
                  <span className={`font-medium ${watchedData.experience.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {watchedData.experience.length > 0 ? '✓' : '✗'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Education</span>
                  <span className={`font-medium ${watchedData.education.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {watchedData.education.length > 0 ? '✓' : '✗'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Skills (5+)</span>
                  <span className={`font-medium ${watchedData.skills.length >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                    {watchedData.skills.length >= 5 ? '✓' : '✗'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">AI Tip:</span>
                </div>
                <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                  {aiScore < 50 ? 'Add more sections to improve your score!' :
                   aiScore < 80 ? 'Great progress! Add more details to reach 80+' :
                   'Excellent! Your resume is ATS-optimized.'}
                </p>
              </div>
            </motion.div>

            {/* Current Template */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Current Template
              </h3>
              
              {(() => {
                const template = getTemplateById(selectedTemplate);
                return template ? (
                  <div className="space-y-4">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden">
                      <img
                        src={template.preview}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {template.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${
                          template.atsScore >= 95 ? 'bg-green-100 text-green-800' :
                          template.atsScore >= 90 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          <Star className="w-3 h-3" />
                          <span>{template.atsScore}% ATS</span>
                        </div>
                        
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {template.category}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowTemplateSelector(true)}
                      className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                    >
                      Change Template
                    </button>
                  </div>
                ) : null;
              })()}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => handlePreview()}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Resume</span>
                </button>
                
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                
                <button
                  onClick={() => {
                    localStorage.setItem('resumeData', JSON.stringify(watchedData));
                    toast.success('Resume saved successfully!');
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Progress</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPreview && (
          <ResumePreview
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            resumeData={watchedData}
            templateId={selectedTemplate}
            onDownload={handleDownload}
          />
        )}
        
        {showImporter && (
          <ResumeImporter
            onDataImported={handleImportData}
            onClose={() => setShowImporter(false)}
          />
        )}
        
        {showTemplateSelector && (
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            onPreview={handlePreview}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ResumeBuilder;