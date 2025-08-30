import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
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
  Code,
  FolderOpen
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { generateResumePDF, ResumeData } from '../utils/pdfGenerator';
import { resumeTemplates } from '../data/resumeTemplates';
import TemplateSelector from './TemplateSelector';
import ResumePreview from './ResumePreview';
import ResumeImporter from './ResumeImporter';
import { analyzeResumeWithGemini } from '../services/geminiService';
import toast from 'react-hot-toast';

const ResumeBuilder: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern-1');
  const [showPreview, setShowPreview] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
      generateResumePDF(data, selectedTemplate);
      localStorage.setItem('resumeData', JSON.stringify(data));
      toast.success('Resume generated successfully!');
    } catch (error) {
      toast.error('Error generating resume. Please try again.');
      console.error('Resume generation error:', error);
    }
  };

  const handleSave = () => {
    localStorage.setItem('resumeData', JSON.stringify(watchedData));
    toast.success('Resume data saved!');
  };

  const handleImportData = (importedData: ResumeData) => {
    reset(importedData);
    localStorage.setItem('resumeData', JSON.stringify(importedData));
    toast.success('Resume data imported successfully!');
  };

  const handleAIAnalysis = async () => {
    if (!watchedData.personalInfo.name) {
      toast.error('Please fill in your personal information first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeResumeWithGemini(watchedData);
      setAiAnalysis(analysis);
      toast.success('AI analysis complete!');
    } catch (error) {
      toast.error('AI analysis failed. Please try again.');
      console.error('AI analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User, color: 'blue' },
    { id: 'experience', label: 'Experience', icon: Briefcase, color: 'green' },
    { id: 'education', label: 'Education', icon: GraduationCap, color: 'purple' },
    { id: 'skills', label: 'Skills', icon: Code, color: 'orange' },
    { id: 'projects', label: 'Projects', icon: FolderOpen, color: 'pink' }
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            {...register('personalInfo.name', { required: true })}
            className="input-base"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            {...register('personalInfo.email', { required: true })}
            type="email"
            className="input-base"
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            {...register('personalInfo.phone')}
            className="input-base"
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <input
            {...register('personalInfo.location')}
            className="input-base"
            placeholder="City, State, Country"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            LinkedIn Profile
          </label>
          <input
            {...register('personalInfo.linkedin')}
            className="input-base"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            GitHub Profile
          </label>
          <input
            {...register('personalInfo.github')}
            className="input-base"
            placeholder="https://github.com/yourusername"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Professional Summary *
        </label>
        <textarea
          {...register('personalInfo.summary', { required: true })}
          rows={4}
          className="input-base resize-none"
          placeholder="Write a compelling summary of your professional background, skills, and career objectives..."
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      {experienceFields.map((field, index) => (
        <motion.div
          key={field.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-base p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Experience {index + 1}
            </h4>
            {experienceFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              {...register(`experience.${index}.title` as const)}
              className="input-base"
              placeholder="Job Title"
            />
            <input
              {...register(`experience.${index}.company` as const)}
              className="input-base"
              placeholder="Company Name"
            />
            <input
              {...register(`experience.${index}.duration` as const)}
              className="input-base"
              placeholder="Duration (e.g., Jan 2020 - Present)"
            />
          </div>
          
          <textarea
            {...register(`experience.${index}.description` as const)}
            rows={3}
            className="input-base resize-none"
            placeholder="Describe your responsibilities and achievements..."
          />
        </motion.div>
      ))}
      
      <motion.button
        type="button"
        onClick={() => appendExperience({ title: '', company: '', duration: '', description: '' })}
        className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5" />
        <span>Add Experience</span>
      </motion.button>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {educationFields.map((field, index) => (
        <motion.div
          key={field.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-base p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Education {index + 1}
            </h4>
            {educationFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register(`education.${index}.degree` as const)}
              className="input-base"
              placeholder="Degree (e.g., Bachelor of Technology)"
            />
            <input
              {...register(`education.${index}.institution` as const)}
              className="input-base"
              placeholder="Institution Name"
            />
            <input
              {...register(`education.${index}.year` as const)}
              className="input-base"
              placeholder="Year (e.g., 2020-2024)"
            />
            <input
              {...register(`education.${index}.gpa` as const)}
              className="input-base"
              placeholder="GPA/Percentage (optional)"
            />
          </div>
        </motion.div>
      ))}
      
      <motion.button
        type="button"
        onClick={() => appendEducation({ degree: '', institution: '', year: '', gpa: '' })}
        className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-gray-500 dark:text-gray-400 hover:border-purple-500 hover:text-purple-500 transition-colors flex items-center justify-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5" />
        <span>Add Education</span>
      </motion.button>
    </div>
  );

  const renderSkills = () => {
    const [newSkill, setNewSkill] = useState('');
    const currentSkills = watchedData.skills || [];

    const addSkill = () => {
      if (newSkill.trim() && !currentSkills.includes(newSkill.trim())) {
        setValue('skills', [...currentSkills, newSkill.trim()]);
        setNewSkill('');
      }
    };

    const removeSkill = (skillToRemove: string) => {
      setValue('skills', currentSkills.filter(skill => skill !== skillToRemove));
    };

    return (
      <div className="space-y-6">
        <div className="flex space-x-2">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            className="input-base flex-1"
            placeholder="Add a skill (e.g., JavaScript, React, Python)"
          />
          <motion.button
            type="button"
            onClick={addSkill}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-3">
          {currentSkills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 group"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="opacity-0 group-hover:opacity-100 hover:bg-white/20 rounded-full p-1 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>

        {currentSkills.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No skills added yet. Add your technical and soft skills above.</p>
          </div>
        )}
      </div>
    );
  };

  const renderProjects = () => (
    <div className="space-y-6">
      {projectFields.map((field, index) => (
        <motion.div
          key={field.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-base p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Project {index + 1}
            </h4>
            {projectFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <input
              {...register(`projects.${index}.name` as const)}
              className="input-base"
              placeholder="Project Name"
            />
            <textarea
              {...register(`projects.${index}.description` as const)}
              rows={3}
              className="input-base resize-none"
              placeholder="Describe your project, its purpose, and your role..."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register(`projects.${index}.technologies` as const)}
                className="input-base"
                placeholder="Technologies used (e.g., React, Node.js, MongoDB)"
              />
              <input
                {...register(`projects.${index}.link` as const)}
                className="input-base"
                placeholder="Project URL or GitHub link (optional)"
              />
            </div>
          </div>
        </motion.div>
      ))}
      
      <motion.button
        type="button"
        onClick={() => appendProject({ name: '', description: '', technologies: '', link: '' })}
        className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-gray-500 dark:text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-colors flex items-center justify-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5" />
        <span>Add Project</span>
      </motion.button>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalInfo();
      case 'experience':
        return renderExperience();
      case 'education':
        return renderEducation();
      case 'skills':
        return renderSkills();
      case 'projects':
        return renderProjects();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <section id="resume" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 px-4 py-2 rounded-full text-sm font-medium text-blue-800 dark:text-blue-200 border border-blue-200/50 dark:border-blue-700/50 mb-6"
          >
            <span className="text-lg">🐼</span>
            <span>AI Resume Builder</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Build Your Perfect
            <span className="gradient-text"> Resume</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create an ATS-friendly resume with our step-by-step builder. Choose from 30+ 
            professional templates and download as PDF when ready.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="card-base p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Resume Sections
              </h3>
              
              <div className="space-y-2">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                      activeSection === section.id
                        ? `bg-${section.color}-100 dark:bg-${section.color}-900/50 text-${section.color}-700 dark:text-${section.color}-300`
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 space-y-3">
                <motion.button
                  type="button"
                  onClick={() => setShowImporter(true)}
                  className="w-full flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload className="w-5 h-5" />
                  <span>Import Resume</span>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing}
                  className="w-full flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      <span>AI Analysis</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleSave}
                  className="w-full flex items-center space-x-2 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-5 h-5" />
                  <span>Save Progress</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Template Selector */}
              <div className="card-base p-6">
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={setSelectedTemplate}
                />
              </div>

              {/* AI Analysis Results */}
              {aiAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-base p-6 border-l-4 border-purple-500"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <Brain className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      AI Analysis Results
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="text-2xl font-bold text-green-600">
                          {aiAnalysis.atsScore}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          ATS Score
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
                        <ul className="text-sm space-y-1">
                          {aiAnalysis.strengths.map((strength: string, index: number) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">Areas to Improve</h4>
                        <ul className="text-sm space-y-1">
                          {aiAnalysis.weaknesses.map((weakness: string, index: number) => (
                            <li key={index} className="flex items-center space-x-2">
                              <AlertCircle className="w-4 h-4 text-red-500" />
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2">Suggestions</h4>
                        <ul className="text-sm space-y-1">
                          {aiAnalysis.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="flex items-center space-x-2">
                              <Sparkles className="w-4 h-4 text-blue-500" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Form Content */}
              <div className="card-base p-6">
                <div className="flex items-center space-x-2 mb-6">
                  {sections.find(s => s.id === activeSection)?.icon && (
                    <div className={`w-8 h-8 bg-gradient-to-r from-${sections.find(s => s.id === activeSection)?.color}-500 to-${sections.find(s => s.id === activeSection)?.color}-600 rounded-lg flex items-center justify-center`}>
                      {React.createElement(sections.find(s => s.id === activeSection)!.icon, { className: "w-5 h-5 text-white" })}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {sections.find(s => s.id === activeSection)?.label}
                  </h3>
                </div>
                
                {renderActiveSection()}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-5 h-5" />
                  <span>Preview Resume</span>
                </motion.button>

                <motion.button
                  type="submit"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Modals */}
        <ResumePreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          resumeData={watchedData}
          templateId={selectedTemplate}
          onDownload={() => handleSubmit(onSubmit)()}
        />

        <AnimatePresence>
          {showImporter && (
            <ResumeImporter
              onDataImported={handleImportData}
              onClose={() => setShowImporter(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ResumeBuilder;