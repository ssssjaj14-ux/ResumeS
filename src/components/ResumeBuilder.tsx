import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award,
  Plus,
  Download, 
  Eye, 
  Sparkles,
  Save, 
  Trash2, 
  ExternalLink,
  Github,
  Linkedin,
  FileText,
  Palette,
  X,
  Upload,
  Search
} from 'lucide-react';
import { generateResumePDF, ResumeData } from '../utils/pdfGenerator';
import { downloadPortfolio, generateGitHubPages, PortfolioData } from '../utils/portfolioGenerator';
import TemplateSelector from './TemplateSelector';
import ResumePreview from './ResumePreview';
import ResumeImporter from './ResumeImporter';
import { getTemplateById } from '../data/resumeTemplates';
import toast, { Toaster } from 'react-hot-toast';
import ResumeRenderer from './ResumeRenderer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ResumeTemplateExport1 from './ResumeTemplateExport1';
import { analyzeResumeWithAI, getJobRecommendations, getCareerInsights } from '../services/aiService';
import { searchJobs } from '../services/jobService';
import TemplateRenderer from './TemplateRenderer';

const GEMINI_API_KEY = 'AIzaSyBS9GMNth3NocYCEABb3maGb0xWD1aemjQ';

const templateComponents: Record<string, React.FC<any>> = {
  export1: ResumeTemplateExport1,
};

const ResumeBuilder: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('modern-1');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [showAIReport, setShowAIReport] = useState(false);
  const [aiReport, setAIReport] = useState<string>('');
  const [resumeData, setResumeData] = useState<ResumeData>({
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
  });
  const [userUploadedStyle, setUserUploadedStyle] = useState<string>('modern-1');
  const [showRenderer, setShowRenderer] = useState(false);

  const steps = [
    { 
      id: 0, 
      title: 'Choose Template', 
      icon: Palette,
      description: 'Select from 30+ ATS-optimized templates'
    },
    { 
      id: 1, 
      title: 'Personal Info', 
      icon: User,
      description: 'Basic information about you'
    },
    { 
      id: 2, 
      title: 'Experience', 
      icon: Briefcase,
      description: 'Your work history and achievements'
    },
    { 
      id: 3, 
      title: 'Education', 
      icon: GraduationCap,
      description: 'Your academic background'
    },
    { 
      id: 4, 
      title: 'Skills', 
      icon: Award,
      description: 'Your technical and soft skills'
    },
    { 
      id: 5, 
      title: 'Projects', 
      icon: ExternalLink,
      description: 'Your notable projects and work'
    }
  ];

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        duration: '',
        description: ''
      }]
    }));
    toast.success('Experience section added!');
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
    toast.success('Experience removed!');
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        year: '',
        gpa: ''
      }]
    }));
    toast.success('Education section added!');
  };

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
    toast.success('Education removed!');
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), {
        name: '',
        description: '',
        technologies: '',
        link: ''
      }]
    }));
    toast.success('Project section added!');
  };

  const removeProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects?.filter((_, i) => i !== index) || []
    }));
    toast.success('Project removed!');
  };

  const addSkill = (skill: string) => {
    if (skill && !resumeData.skills.includes(skill)) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      toast.success(`Added skill: ${skill}`);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
    toast.success('Skill removed!');
  };

  const handleDownloadPDF = async () => {
    try {
      // Create a hidden container
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '900px';
      container.style.background = '#fff';
      document.body.appendChild(container);
      
      // Render the template using TemplateRenderer
      import('react-dom').then(ReactDOM => {
        ReactDOM.render(
          <TemplateRenderer 
            templateId={selectedTemplate} 
            resumeData={resumeData} 
            preview={false} 
          />, 
          container
        );
        
        setTimeout(async () => {
          const canvas = await html2canvas(container, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          
          // Calculate PDF size in points (1 px = 0.75 pt)
          const pdfWidth = canvas.width * 0.75;
          const pdfHeight = canvas.height * 0.75;
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [pdfWidth, pdfHeight] });
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${resumeData.personalInfo.name.replace(/\s+/g, '_') || 'Resume'}_${selectedTemplate}.pdf`);
          
          ReactDOM.unmountComponentAtNode(container);
          document.body.removeChild(container);
          toast.success('Resume PDF downloaded successfully!');
        }, 500);
      });
    } catch (error) {
      toast.error('Error generating PDF. Please try again.');
      console.error('PDF generation error:', error);
    }
  };

  const handlePreviewResume = () => {
    setShowPreview(true);
  };

  const handleGeneratePortfolio = () => {
    try {
      const portfolioData: PortfolioData = {
        personalInfo: resumeData.personalInfo,
        skills: resumeData.skills,
        projects: resumeData.projects || [],
        experience: resumeData.experience,
        education: resumeData.education
      };
      
      downloadPortfolio(portfolioData, 'modern');
      toast.success('Portfolio HTML downloaded! Upload to GitHub Pages.');
    } catch (error) {
      toast.error('Error generating portfolio. Please try again.');
      console.error('Portfolio generation error:', error);
    }
  };

  const handleSaveData = () => {
    try {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
      toast.success('Resume data saved locally!');
    } catch (error) {
      toast.error('Error saving data. Please try again.');
    }
  };

  const handleLoadData = () => {
    try {
      const savedData = localStorage.getItem('resumeData');
      if (savedData) {
        setResumeData(JSON.parse(savedData));
        toast.success('Resume data loaded successfully!');
      } else {
        toast.error('No saved data found.');
      }
    } catch (error) {
      toast.error('Error loading data. Please try again.');
    }
  };

  const handleImportData = (importedData: ResumeData) => {
    setResumeData(importedData);
    toast.success('Resume data imported successfully!');
  };

  const handleAIFeedback = async () => {
    toast.loading('Analyzing your resume with advanced AI...', { duration: 5000 });
    
    try {
      // Get job market data
      const jobMarket = await searchJobs('', { skills: resumeData.skills });
      
      // Get advanced AI analysis
      const aiAnalysis = await analyzeResumeWithAI(resumeData, jobMarket);
      
      // Get job recommendations
      const jobRecommendations = await getJobRecommendations(resumeData);
      
      // Get career insights
      const careerInsights = await getCareerInsights(resumeData);
      
      // Format the comprehensive report
      let report = "# 🤖 Advanced AI Resume Analysis\n\n";
      
      report += `## 📊 ATS Optimization Score: ${aiAnalysis.atsScore}/100\n`;
      report += `## ⭐ Overall Rating: ${aiAnalysis.overallRating}/10\n\n`;
      
      report += "## ✅ Strengths\n";
      aiAnalysis.strengths.forEach(strength => report += `- ${strength}\n`);
      report += "\n";
      
      report += "## ⚠️ Areas for Improvement\n";
      aiAnalysis.weaknesses.forEach(weakness => report += `- ${weakness}\n`);
      report += "\n";
      
      report += "## 💡 Actionable Suggestions\n";
      aiAnalysis.suggestions.forEach(suggestion => report += `- ${suggestion}\n`);
      report += "\n";
      
      report += "## 🎯 Job Matches\n";
      aiAnalysis.jobMatches.forEach(job => report += `- ${job}\n`);
      report += "\n";
      
      report += "## 🔧 Skill Gaps\n";
      aiAnalysis.skillGaps.forEach(skill => report += `- ${skill}\n`);
      report += "\n";
      
      report += "## 📈 Industry Trends\n";
      aiAnalysis.industryTrends.forEach(trend => report += `- ${trend}\n`);
      report += "\n";
      
      report += `## 💰 Salary Insights\n${aiAnalysis.salaryInsights}\n\n`;
      
      report += "## 🔍 Recommended Keywords\n";
      aiAnalysis.keywords.forEach(keyword => report += `- ${keyword}\n`);
      report += "\n";
      
      report += "## 📝 Detailed Section Feedback\n";
      report += `**Summary:** ${aiAnalysis.detailedFeedback.summary}\n`;
      report += `**Experience:** ${aiAnalysis.detailedFeedback.experience}\n`;
      report += `**Skills:** ${aiAnalysis.detailedFeedback.skills}\n`;
      report += `**Projects:** ${aiAnalysis.detailedFeedback.projects}\n`;
      report += `**Education:** ${aiAnalysis.detailedFeedback.education}\n\n`;
      
      report += "## 🚀 Top Job Recommendations\n";
      jobRecommendations.slice(0, 5).forEach(job => {
        report += `### ${job.jobTitle} at ${job.company}\n`;
        report += `- Match Score: ${job.matchScore}%\n`;
        report += `- Reason: ${job.reason}\n`;
        report += `- Salary: ${job.salary}\n`;
        report += `- Requirements: ${job.requirements.join(', ')}\n\n`;
      });
      
      report += "## 📊 Career Insights\n";
      report += `**Market Trends:** ${careerInsights.marketTrends.join(', ')}\n`;
      report += `**Salary Insights:** ${careerInsights.salaryInsights}\n`;
      report += `**Skill Gaps:** ${careerInsights.skillGaps.join(', ')}\n`;
      report += `**Keywords:** ${careerInsights.keywords.join(', ')}\n`;
      
      toast.dismiss();
      setAIReport(report);
      setShowAIReport(true);
    } catch (error) {
      toast.dismiss();
      toast.error('AI analysis failed. Using local analysis.');
      
      // Fallback to local analysis
      const portfolioData: PortfolioData = {
        personalInfo: resumeData.personalInfo,
        skills: resumeData.skills,
        projects: resumeData.projects || [],
        experience: resumeData.experience,
        education: resumeData.education
      };
      const localAnalysis = generateLocalAIAnalysis(resumeData, portfolioData);
      setAIReport(localAnalysis);
      setShowAIReport(true);
    }
  };

  const generateLocalAIAnalysis = (resume: ResumeData, portfolio: PortfolioData): string => {
    let analysis = "# 🤖 AI-Powered Resume Analysis\n\n";
    // ATS Score Calculation
    let atsScore = 70;
    if (resume.personalInfo.name) atsScore += 5;
    if (resume.personalInfo.email) atsScore += 5;
    if (resume.personalInfo.phone) atsScore += 5;
    if (resume.personalInfo.summary && resume.personalInfo.summary.length > 50) atsScore += 10;
    if (resume.skills.length >= 5) atsScore += 10;
    if (resume.experience.length >= 2) atsScore += 5;
    analysis += `## 📊 ATS Optimization Score: ${atsScore}/100\n\n`;
    // Strengths
    analysis += "## ✅ Strengths\n";
    const strengths = [];
    if (resume.skills.length > 5) strengths.push("Diverse skill set showcasing versatility");
    if (resume.experience.length > 2) strengths.push("Strong professional experience");
    if (resume.projects && resume.projects.length > 0) strengths.push("Practical project experience");
    if (resume.personalInfo.linkedin) strengths.push("Professional online presence");
    if (resume.personalInfo.github) strengths.push("Technical portfolio visibility");
    if (resume.personalInfo.summary && resume.personalInfo.summary.match(/lead|manage|build|create|design|develop/i)) strengths.push("Leadership and initiative evident in summary");
    if (resume.skills.some(skill => /AI|ML|Data|Cloud|React|Node|Python|JavaScript/i.test(skill))) strengths.push("In-demand technical skills present");
    strengths.forEach(strength => analysis += `- ${strength}\n`);
    analysis += "\n";
    // Improvements
    analysis += "## ⚠️ Areas for Improvement\n";
    const improvements = [];
    if (!resume.personalInfo.summary || resume.personalInfo.summary.length < 50) improvements.push("Add a compelling professional summary (50+ words)");
    if (resume.skills.length < 5) improvements.push("Expand your skills section");
    if (resume.experience.length === 0) improvements.push("Add work experience or internships");
    if (!resume.projects || resume.projects.length === 0) improvements.push("Include relevant projects to showcase your abilities");
    if (!resume.personalInfo.linkedin) improvements.push("Add your LinkedIn profile for credibility");
    if (!resume.personalInfo.github && resume.skills.some(skill => /code|developer|engineer|programming/i.test(skill))) improvements.push("Add your GitHub for technical roles");
    if (resume.education.length === 0) improvements.push("Add your education details");
    improvements.forEach(improvement => analysis += `- ${improvement}\n`);
    analysis += "\n";
    // Creative Suggestions
    analysis += "## ✨ Creative Suggestions\n";
    if (resume.projects && resume.projects.length > 0) {
      analysis += "- Highlight your most impressive project at the top.\n";
      analysis += "- Add project links or demo videos for more impact.\n";
    }
    if (resume.skills.includes('AI') || resume.skills.includes('Machine Learning')) {
      analysis += "- Mention AI/ML certifications or competitions if any.\n";
    }
    if (resume.personalInfo.summary && resume.personalInfo.summary.length > 100) {
      analysis += "- Consider breaking your summary into bullet points for clarity.\n";
    }
    analysis += "- Use action verbs (e.g., Led, Built, Designed, Engineered) in your experience.\n";
    analysis += "- Quantify achievements (e.g., 'Increased sales by 20%').\n";
    analysis += "\n";
    // Job Match
    analysis += "## 🔍 Job Match Suggestions\n";
    if (resume.skills.includes('React') && resume.skills.includes('Node.js')) {
      analysis += "- Great fit for Full Stack Developer roles.\n";
    }
    if (resume.skills.includes('Python') && resume.skills.includes('Data')) {
      analysis += "- Consider Data Scientist or ML Engineer positions.\n";
    }
    if (resume.skills.includes('Marketing')) {
      analysis += "- Explore marketing, content, or brand roles.\n";
    }
    analysis += "- Use job boards like LinkedIn, Indeed, and AngelList to find matching roles.\n";
    analysis += "\n";
    // Section-by-section feedback
    analysis += "## 📝 Section Feedback\n";
    analysis += `- Experience: ${resume.experience.length > 0 ? 'Good' : 'Add at least one experience.'}\n`;
    analysis += `- Education: ${resume.education.length > 0 ? 'Present' : 'Missing'}\n`;
    analysis += `- Skills: ${resume.skills.length > 0 ? 'Listed' : 'Missing'}\n`;
    analysis += `- Projects: ${resume.projects && resume.projects.length > 0 ? 'Included' : 'Missing'}\n`;
    return analysis;
  };

  const selectedTemplateData = getTemplateById(selectedTemplate);

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Import Resume Card */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50 flex flex-col justify-between"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
              </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Import Existing Resume</h3>
                    <p className="text-gray-600 dark:text-gray-300">Upload your current resume to auto-fill all fields</p>
              </div>
              </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowImporter(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center space-x-2 text-base sm:text-lg"
                >
                  <Upload className="w-5 h-5" />
                  <span>Import Resume</span>
                </motion.button>
              </motion.div>
              {/* Change Template Card */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50 flex flex-col justify-between"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTemplateSelector(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center space-x-2 text-base sm:text-lg"
                >
                  <FileText className="w-5 h-5" />
                  <span>Change Template</span>
                </motion.button>
            </motion.div>
                  </div>
                  
            {/* Current Template Display */}
            {selectedTemplateData && (
              <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="w-24 h-28 sm:w-16 sm:h-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={selectedTemplateData.preview} 
                      alt={selectedTemplateData.name}
                      className="w-full h-full object-contain"
                    />
                          </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedTemplateData.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {selectedTemplateData.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Award className="w-3 h-3" />
                        <span>{selectedTemplateData.atsScore}% ATS</span>
                        </div>
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium capitalize">
                        {selectedTemplateData.category}
                      </span>
                      </div>
                        </div>
                      </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTemplateSelector(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Palette className="w-5 h-5" />
                  <span>Change Template</span>
                </motion.button>
                    </div>
            )}

            {/* Template Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedTemplateData?.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4" />
                    </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                </div>
                ))}
              </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePreviewResume}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Resume</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTemplateSelector(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                <FileText className="w-4 h-4" />
                <span>Browse All Templates</span>
              </motion.button>
              </div>
            </motion.div>
        );

      case 1:
        return (
            <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  value={resumeData.personalInfo.name}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, name: e.target.value }
                  }))}
                  />
                </div>
                
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, email: e.target.value }
                  }))}
                  />
                </div>
                
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                  </label>
                  <input
                    type="tel"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+91 98765 43210"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, phone: e.target.value }
                  }))}
                  />
                </div>
                
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </label>
                  <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Mumbai, India"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, location: e.target.value }
                  }))}
                  />
                </div>
                
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Linkedin className="w-4 h-4 inline mr-2" />
                    LinkedIn Profile
                  </label>
                  <input
                  type="url"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={resumeData.personalInfo.linkedin}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                  }))}
                  />
                </div>
                
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Github className="w-4 h-4 inline mr-2" />
                    GitHub Profile
                  </label>
                  <input
                  type="url"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://github.com/yourusername"
                  value={resumeData.personalInfo.github}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, github: e.target.value }
                  }))}
                  />
                </div>
              </div>
              
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Professional Summary *
                </label>
                <textarea
                  rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Write a brief summary about yourself and your career goals..."
                value={resumeData.personalInfo.summary}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, summary: e.target.value }
                }))}
                />
              </div>
            </motion.div>
        );

      case 2:
        return (
            <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {resumeData.experience.map((exp, index) => (
              <motion.div
                      key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 relative"
              >
                      <button
                  onClick={() => removeExperience(index)}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                  <Trash2 className="w-4 h-4" />
                      </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Job Title *"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={exp.title}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[index].title = e.target.value;
                      setResumeData(prev => ({ ...prev, experience: newExp }));
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Company Name *"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[index].company = e.target.value;
                      setResumeData(prev => ({ ...prev, experience: newExp }));
                    }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Duration (e.g., Jan 2023 - Present) *"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-4"
                  value={exp.duration}
                  onChange={(e) => {
                    const newExp = [...resumeData.experience];
                    newExp[index].duration = e.target.value;
                    setResumeData(prev => ({ ...prev, experience: newExp }));
                  }}
                />
                <textarea
                  rows={3}
                  placeholder="Job description and achievements..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  value={exp.description}
                  onChange={(e) => {
                    const newExp = [...resumeData.experience];
                    newExp[index].description = e.target.value;
                    setResumeData(prev => ({ ...prev, experience: newExp }));
                  }}
                />
              </motion.div>
            ))}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addExperience}
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Experience</span>
            </motion.button>
            </motion.div>
        );

      case 3:
        return (
            <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {resumeData.education.map((edu, index) => (
                  <motion.div
                key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 relative"
                  >
                      <button
                  onClick={() => removeEducation(index)}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                    type="text"
                    placeholder="Degree/Course *"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[index].degree = e.target.value;
                      setResumeData(prev => ({ ...prev, education: newEdu }));
                    }}
                  />
                        <input
                    type="text"
                    placeholder="Institution Name *"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={edu.institution}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[index].institution = e.target.value;
                      setResumeData(prev => ({ ...prev, education: newEdu }));
                    }}
                        />
                      </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                    type="text"
                    placeholder="Year (e.g., 2020-2024) *"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={edu.year}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[index].year = e.target.value;
                      setResumeData(prev => ({ ...prev, education: newEdu }));
                    }}
                  />
                  <input
                    type="text"
                    placeholder="GPA/Percentage (optional)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={edu.gpa || ''}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[index].gpa = e.target.value;
                      setResumeData(prev => ({ ...prev, education: newEdu }));
                    }}
                      />
                    </div>
                  </motion.div>
                ))}
                
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addEducation}
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Education</span>
            </motion.button>
            </motion.div>
        );

      case 4:
        return (
            <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Add Skills
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter a skill and press Enter"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const skill = (e.target as HTMLInputElement).value.trim();
                      if (skill) {
                        addSkill(skill);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                    const skill = input?.value.trim();
                    if (skill) {
                      addSkill(skill);
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </div>
              </div>
              
            {resumeData.skills.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Skills ({resumeData.skills.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 ml-1"
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                    </div>
                      </div>
            )}

            {/* Quick Add Skills */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quick Add Popular Skills
                        </label>
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'HTML/CSS', 'Git', 'SQL', 'MongoDB', 'TypeScript'].map((skill) => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    disabled={resumeData.skills.includes(skill)}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {skill}
                  </button>
                ))}
                  </div>
              </div>
            </motion.div>
        );

      case 5:
        return (
            <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {(resumeData.projects || []).map((project, index) => (
                  <motion.div
                key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 relative"
                  >
                      <button
                        onClick={() => removeProject(index)}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                    type="text"
                    placeholder="Project Name *"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={project.name}
                    onChange={(e) => {
                      const newProjects = [...(resumeData.projects || [])];
                      newProjects[index].name = e.target.value;
                      setResumeData(prev => ({ ...prev, projects: newProjects }));
                    }}
                  />
                        <input
                    type="url"
                    placeholder="Project Link (optional)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={project.link}
                    onChange={(e) => {
                      const newProjects = [...(resumeData.projects || [])];
                      newProjects[index].link = e.target.value;
                      setResumeData(prev => ({ ...prev, projects: newProjects }));
                    }}
                        />
                      </div>
                        <input
                  type="text"
                  placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-4"
                  value={project.technologies}
                  onChange={(e) => {
                    const newProjects = [...(resumeData.projects || [])];
                    newProjects[index].technologies = e.target.value;
                    setResumeData(prev => ({ ...prev, projects: newProjects }));
                  }}
                />
                      <textarea
                        rows={3}
                  placeholder="Project description and key features..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  value={project.description}
                  onChange={(e) => {
                    const newProjects = [...(resumeData.projects || [])];
                    newProjects[index].description = e.target.value;
                    setResumeData(prev => ({ ...prev, projects: newProjects }));
                  }}
                />
                  </motion.div>
                ))}
                
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addProject}
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Project</span>
            </motion.button>
            </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <section id="resume" className="py-20 bg-gray-50 dark:bg-gray-800">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Browse Templates Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            <Palette className="w-5 h-5" />
            <span>Browse Templates</span>
          </button>
        </div>
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
            <Sparkles className="w-4 h-4" />
            <span>Resume Builder</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Build Your Perfect
            <span className="gradient-text"> Resume</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create an ATS-friendly resume with our step-by-step builder. 
            Choose from 30+ professional templates and download as PDF when ready.
          </p>
            </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steps Sidebar */}
            <motion.div
            initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 space-y-4">
              {steps.map((step, index) => (
                <motion.button
                  key={step.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                    activeStep === step.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activeStep === step.id 
                        ? 'bg-white/20' 
                        : 'bg-gray-100 dark:bg-gray-600'
                    }`}>
                      <step.icon className={`w-5 h-5 ${
                        activeStep === step.id 
                          ? 'text-white' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <div className="font-semibold">{step.title}</div>
                      <div className={`text-sm ${
                        activeStep === step.id 
                          ? 'text-white/80' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.description}
                        </div>
                      </div>
                    </div>
                </motion.button>
              ))}

              {/* Quick Actions */}
              <div className="mt-8 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveData}
                  className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Progress</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLoadData}
                  className="w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Load Saved</span>
                </motion.button>
                  </div>
            </div>
            </motion.div>

          {/* Main Content */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {steps[activeStep].title}
              </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {steps[activeStep].description}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className="px-6 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </motion.button>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  {activeStep === steps.length - 1 ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePreviewResume}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                      >
                        <Eye className="w-5 h-5" />
                        <span>Preview</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownloadPDF}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                      >
                        <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGeneratePortfolio}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>Portfolio</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAIFeedback}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>AI Feedback</span>
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                      Next
                    </motion.button>
                  )}
              </div>
          </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Template Selector Modal */}
      <AnimatePresence>
        {showTemplateSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTemplateSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Choose Template
                </h2>
                <button
                  onClick={() => setShowTemplateSelector(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={(templateId: string) => {
                    setSelectedTemplate(templateId.endsWith('.json') ? 'user-uploaded' : templateId);
                    setShowTemplateSelector(false);
                  }}
                  onPreview={(templateId: string) => {
                    setSelectedTemplate(templateId.endsWith('.json') ? 'user-uploaded' : templateId);
                    setShowTemplateSelector(false);
                    setShowPreview(true);
                  }}
                  onTemplateDataLoaded={(templateData: ResumeData) => {
                    setResumeData(templateData);
                    setShowTemplateSelector(false);
                    setActiveStep(1);
                    if ((templateData as any)._style) setUserUploadedStyle((templateData as any)._style);
                    toast.success('Template loaded and ready to edit!');
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume Preview Modal */}
          <ResumePreview
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
        resumeData={resumeData}
        templateId={selectedTemplate === 'user-uploaded' ? userUploadedStyle : selectedTemplate}
        onDownload={handleDownloadPDF}
      />

      {/* Resume Importer Modal */}
      <AnimatePresence>
        {showImporter && (
          <ResumeImporter
            onDataImported={handleImportData}
            onClose={() => setShowImporter(false)}
          />
        )}
      </AnimatePresence>

      {/* AI Feedback Modal */}
      {showAIReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-4xl w-full relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setShowAIReport(false)}
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              🤖 AI Career Analysis & Feedback
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 text-base leading-relaxed">
                {aiReport}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Resume Renderer Modal */}
      {showRenderer && (
        <div style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', overflow: 'auto' }} onClick={() => setShowRenderer(false)}>
          <div style={{ margin: '40px auto', maxWidth: 900, background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #0002', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button style={{ position: 'absolute', top: 16, right: 16, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowRenderer(false)}>&times;</button>
            <ResumeRenderer data={resumeData} />
          </div>
        </div>
      )}
    </section>
  );
};

export default ResumeBuilder;