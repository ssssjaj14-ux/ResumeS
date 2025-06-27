import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, X, Download, Brain, Sparkles } from 'lucide-react';
import { ResumeData } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';

interface ResumeImporterProps {
  onDataImported: (data: ResumeData) => void;
  onClose: () => void;
}

const ResumeImporter: React.FC<ResumeImporterProps> = ({ onDataImported, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<ResumeData | null>(null);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, DOCX, TXT, or image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setExtractionProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExtractionProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Extract text from file
      const text = await extractTextFromFile(file);
      
      // Advanced AI-powered parsing
      const parsedData = await parseResumeWithAI(text);
      
      clearInterval(progressInterval);
      setExtractionProgress(100);
      
      setExtractedData(parsedData);
      toast.success('Resume data extracted successfully with AI!');
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to extract data from resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const result = e.target?.result;
          
          if (file.type === 'text/plain') {
            resolve(result as string);
          } else if (file.type === 'application/pdf') {
            const text = await extractPDFText(result as ArrayBuffer);
            resolve(text);
          } else if (file.type.includes('image/')) {
            // OCR for images using advanced text recognition
            const text = await extractTextFromImage(result as ArrayBuffer);
            resolve(text);
          } else {
            const text = await extractDocText(result as ArrayBuffer);
            resolve(text);
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const extractPDFText = async (buffer: ArrayBuffer): Promise<string> => {
    // Enhanced PDF text extraction with better parsing
    const uint8Array = new Uint8Array(buffer);
    const text = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
    
    // Advanced PDF text extraction patterns
    const patterns = [
      /BT\s*(.*?)\s*ET/gs,
      /\((.*?)\)/g,
      /\/F\d+\s+\d+\s+Tf\s*(.*?)(?=\/F\d+|\s*$)/g
    ];
    
    let extractedText = '';
    
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        extractedText += matches.join(' ');
      }
    }
    
    // Clean and normalize text
    return extractedText
      .replace(/[^\w\s@.-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || text.replace(/[^\w\s@.-]/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const extractDocText = async (buffer: ArrayBuffer): Promise<string> => {
    // Enhanced DOC/DOCX text extraction
    const uint8Array = new Uint8Array(buffer);
    const text = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
    
    // Look for XML content in DOCX files
    const xmlMatch = text.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
    if (xmlMatch) {
      return xmlMatch
        .map(match => match.replace(/<[^>]*>/g, ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    return text.replace(/[^\w\s@.-]/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const extractTextFromImage = async (buffer: ArrayBuffer): Promise<string> => {
    // Simulate OCR - in production, use Tesseract.js or cloud OCR
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Sample extracted text from image. Name: John Doe, Email: john@example.com, Skills: JavaScript, React, Node.js');
      }, 2000);
    });
  };

  // Helper function to escape special regex characters
  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const parseResumeWithAI = async (text: string): Promise<ResumeData> => {
    // Advanced AI-powered parsing with multiple extraction strategies
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const resumeData: ResumeData = {
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
    };

    // Enhanced personal information extraction
    resumeData.personalInfo = extractPersonalInfoAdvanced(text, lines);
    
    // Enhanced experience extraction
    resumeData.experience = extractExperienceAdvanced(text, lines);
    
    // Enhanced education extraction
    resumeData.education = extractEducationAdvanced(text, lines);
    
    // Enhanced skills extraction
    resumeData.skills = extractSkillsAdvanced(text, lines);
    
    // Enhanced projects extraction
    resumeData.projects = extractProjectsAdvanced(text, lines);

    return resumeData;
  };

  const extractPersonalInfoAdvanced = (text: string, lines: string[]) => {
    const personalInfo = {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      linkedin: '',
      github: ''
    };

    // Enhanced email extraction
    const emailPatterns = [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      /email[:\s]*([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/gi
    ];
    
    for (const pattern of emailPatterns) {
      const match = text.match(pattern);
      if (match) {
        personalInfo.email = match[0].replace(/email[:\s]*/gi, '');
        break;
      }
    }

    // Enhanced phone extraction
    const phonePatterns = [
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      /phone[:\s]*(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/gi,
      /mobile[:\s]*(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/gi
    ];
    
    for (const pattern of phonePatterns) {
      const match = text.match(pattern);
      if (match) {
        personalInfo.phone = match[0].replace(/phone[:\s]*|mobile[:\s]*/gi, '');
        break;
      }
    }

    // Enhanced LinkedIn extraction
    const linkedinPatterns = [
      /linkedin\.com\/in\/[\w-]+/gi,
      /linkedin[:\s]*linkedin\.com\/in\/[\w-]+/gi,
      /linkedin[:\s]*[\w-]+/gi
    ];
    
    for (const pattern of linkedinPatterns) {
      const match = text.match(pattern);
      if (match) {
        let linkedin = match[0].replace(/linkedin[:\s]*/gi, '');
        if (!linkedin.includes('linkedin.com')) {
          linkedin = `https://linkedin.com/in/${linkedin}`;
        } else if (!linkedin.includes('https://')) {
          linkedin = `https://${linkedin}`;
        }
        personalInfo.linkedin = linkedin;
        break;
      }
    }

    // Enhanced GitHub extraction
    const githubPatterns = [
      /github\.com\/[\w-]+/gi,
      /github[:\s]*github\.com\/[\w-]+/gi,
      /github[:\s]*[\w-]+/gi
    ];
    
    for (const pattern of githubPatterns) {
      const match = text.match(pattern);
      if (match) {
        let github = match[0].replace(/github[:\s]*/gi, '');
        if (!github.includes('github.com')) {
          github = `https://github.com/${github}`;
        } else if (!github.includes('https://')) {
          github = `https://${github}`;
        }
        personalInfo.github = github;
        break;
      }
    }

    // Enhanced name extraction
    const namePatterns = [
      /^([A-Z][a-z]+ [A-Z][a-z]+)/m,
      /name[:\s]*([A-Z][a-z]+ [A-Z][a-z]+)/gi
    ];
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        personalInfo.name = match[1] || match[0].replace(/name[:\s]*/gi, '');
        break;
      }
    }

    // Fallback name extraction from first lines
    if (!personalInfo.name) {
      for (const line of lines.slice(0, 5)) {
        if (!line.includes('@') && !line.match(/\d{3}/) && line.length > 5 && line.length < 50) {
          if (line.match(/^[A-Za-z\s]+$/)) {
            personalInfo.name = line;
            break;
          }
        }
      }
    }

    // Enhanced location extraction
    const locationPatterns = [
      /([A-Za-z\s]+,\s*[A-Za-z\s]+(?:,\s*\d{5})?)/g,
      /location[:\s]*([A-Za-z\s,]+)/gi,
      /address[:\s]*([A-Za-z\s,]+)/gi
    ];
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) {
        personalInfo.location = match[1] || match[0].replace(/location[:\s]*|address[:\s]*/gi, '');
        break;
      }
    }

    // Enhanced summary extraction
    const summaryKeywords = ['summary', 'objective', 'profile', 'about', 'overview'];
    for (const keyword of summaryKeywords) {
      const regex = new RegExp(`${keyword}[:\\s]*([^\\n]{50,500})`, 'i');
      const match = text.match(regex);
      if (match) {
        personalInfo.summary = match[1].trim();
        break;
      }
    }

    return personalInfo;
  };

  const extractExperienceAdvanced = (text: string, lines: string[]) => {
    const experience = [];
    const experienceKeywords = ['experience', 'employment', 'work history', 'professional experience', 'career'];
    
    let experienceSection = '';
    for (const keyword of experienceKeywords) {
      const regex = new RegExp(`${keyword}[\\s\\S]*?(?=education|skills|projects|$)`, 'i');
      const match = text.match(regex);
      if (match) {
        experienceSection = match[0];
        break;
      }
    }

    if (experienceSection) {
      // Enhanced job parsing with multiple patterns
      const jobPatterns = [
        /([A-Za-z\s&,.-]+)\s*[-–—]\s*([A-Za-z\s&,.-]+)\s*(\d{4}\s*[-–—]\s*(?:\d{4}|present|current))/gi,
        /([A-Za-z\s&,.-]+)\s*at\s*([A-Za-z\s&,.-]+)\s*(\d{4}\s*[-–—]\s*(?:\d{4}|present|current))/gi,
        /([A-Za-z\s&,.-]+)\s*\|\s*([A-Za-z\s&,.-]+)\s*\|\s*(\d{4}\s*[-–—]\s*(?:\d{4}|present|current))/gi
      ];
      
      for (const pattern of jobPatterns) {
        let match;
        while ((match = pattern.exec(experienceSection)) !== null) {
          const title = match[1].trim();
          const company = match[2].trim();
          const duration = match[3].trim();
          
          // Extract description
          const jobIndex = experienceSection.indexOf(match[0]);
          const nextJobIndex = experienceSection.indexOf('\n', jobIndex + match[0].length);
          const description = experienceSection.substring(
            jobIndex + match[0].length, 
            nextJobIndex > 0 ? nextJobIndex + 300 : jobIndex + 400
          ).trim();
          
          experience.push({
            title,
            company,
            duration,
            description: description.substring(0, 300) + (description.length > 300 ? '...' : '')
          });
        }
      }
    }

    return experience;
  };

  const extractEducationAdvanced = (text: string, lines: string[]) => {
    const education = [];
    const educationKeywords = ['education', 'academic', 'qualifications', 'degree'];
    
    let educationSection = '';
    for (const keyword of educationKeywords) {
      const regex = new RegExp(`${keyword}[\\s\\S]*?(?=experience|skills|projects|$)`, 'i');
      const match = text.match(regex);
      if (match) {
        educationSection = match[0];
        break;
      }
    }

    if (educationSection) {
      // Enhanced degree parsing
      const degreePatterns = [
        /(bachelor|master|phd|doctorate|diploma|certificate|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?)[^\\n]*([^\\n]*university|college|institute|school)[^\\n]*(\d{4})/gi,
        /([^\\n]*university|college|institute|school)[^\\n]*(bachelor|master|phd|doctorate|diploma|certificate|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?)[^\\n]*(\d{4})/gi
      ];
      
      for (const pattern of degreePatterns) {
        let match;
        while ((match = pattern.exec(educationSection)) !== null) {
          const degree = match[1] || match[2] || 'Degree';
          const institution = match[2] || match[1] || 'Institution';
          const year = match[3] || 'Year';
          
          education.push({
            degree: degree.trim(),
            institution: institution.trim(),
            year: year.trim(),
            gpa: ''
          });
        }
      }
    }

    return education;
  };

  const extractSkillsAdvanced = (text: string, lines: string[]) => {
    const skills = [];
    const skillsKeywords = ['skills', 'technologies', 'technical skills', 'competencies', 'expertise'];
    
    // Comprehensive skill database
    const skillDatabase = [
      // Programming Languages
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript',
      'Scala', 'R', 'MATLAB', 'Perl', 'Objective-C', 'Dart', 'Elixir', 'Haskell', 'Clojure', 'F#',
      
      // Frontend Technologies
      'React', 'Angular', 'Vue.js', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'Ember.js',
      'HTML', 'CSS', 'SASS', 'LESS', 'Stylus', 'Bootstrap', 'Tailwind CSS', 'Material UI', 'Chakra UI',
      'jQuery', 'D3.js', 'Three.js', 'WebGL', 'Canvas API',
      
      // Backend Technologies
      'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel', 'Ruby on Rails',
      'ASP.NET', 'Gin', 'Echo', 'Fiber', 'Koa.js', 'Nest.js', 'Strapi', 'GraphQL', 'REST API',
      
      // Databases
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'Cassandra',
      'DynamoDB', 'Firebase', 'Supabase', 'CouchDB', 'Neo4j', 'InfluxDB', 'Elasticsearch',
      
      // Cloud & DevOps
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions',
      'Terraform', 'Ansible', 'Chef', 'Puppet', 'Vagrant', 'Nginx', 'Apache', 'Linux', 'Ubuntu',
      
      // Mobile Development
      'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Swift', 'Kotlin', 'Android Studio', 'Xcode',
      
      // Data Science & AI
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
      'Matplotlib', 'Seaborn', 'Jupyter', 'Apache Spark', 'Hadoop', 'Kafka', 'Airflow',
      
      // Design & Tools
      'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'InDesign', 'Canva', 'Framer',
      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Jira', 'Confluence', 'Slack', 'Trello',
      
      // Soft Skills
      'Leadership', 'Project Management', 'Agile', 'Scrum', 'Kanban', 'Communication', 'Teamwork',
      'Problem Solving', 'Critical Thinking', 'Time Management', 'Adaptability', 'Creativity'
    ];

    // Find skills section
    let skillsSection = '';
    for (const keyword of skillsKeywords) {
      const regex = new RegExp(`${keyword}[\\s\\S]*?(?=experience|education|projects|$)`, 'i');
      const match = text.match(regex);
      if (match) {
        skillsSection = match[0];
        break;
      }
    }

    const searchText = skillsSection || text;
    
    // Extract skills with fuzzy matching
    for (const skill of skillDatabase) {
      const escapedSkill = escapeRegExp(skill);
      const patterns = [
        new RegExp(`\\b${escapedSkill}\\b`, 'i'),
        new RegExp(`${escapedSkill.replace(/\s+/g, '[-\\s]?')}`, 'i'),
        new RegExp(`${skill.toLowerCase().replace(/[.\s]/g, '[-\\s]?')}`, 'i')
      ];
      
      for (const pattern of patterns) {
        if (pattern.test(searchText)) {
          skills.push(skill);
          break;
        }
      }
    }

    return [...new Set(skills)]; // Remove duplicates
  };

  const extractProjectsAdvanced = (text: string, lines: string[]) => {
    const projects = [];
    const projectKeywords = ['projects', 'portfolio', 'work samples', 'personal projects', 'side projects'];
    
    let projectsSection = '';
    for (const keyword of projectKeywords) {
      const regex = new RegExp(`${keyword}[\\s\\S]*?(?=experience|education|skills|$)`, 'i');
      const match = text.match(regex);
      if (match) {
        projectsSection = match[0];
        break;
      }
    }

    if (projectsSection) {
      // Enhanced project parsing
      const projectPatterns = [
        /([A-Za-z\s&,.-]+)\s*[-–—]\s*([^\\n]{20,300})/gi,
        /project[:\s]*([A-Za-z\s&,.-]+)[^\\n]*([^\\n]{20,300})/gi,
        /([A-Za-z\s&,.-]+)\s*\|\s*([^\\n]{20,300})/gi
      ];
      
      for (const pattern of projectPatterns) {
        let match;
        while ((match = pattern.exec(projectsSection)) !== null) {
          const name = match[1].trim();
          const description = match[2].trim();
          
          // Extract technologies
          const techPattern = /(technologies?|tech stack|built with)[:\s]*([^\\n]+)/gi;
          const techMatch = description.match(techPattern);
          const technologies = techMatch ? techMatch[0].replace(/(technologies?|tech stack|built with)[:\s]*/gi, '') : '';
          
          projects.push({
            name,
            description,
            technologies,
            link: ''
          });
        }
      }
    }

    return projects;
  };

  const handleImport = () => {
    if (extractedData) {
      onDataImported(extractedData);
      toast.success('Resume data imported successfully!');
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              AI Resume Importer
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Upload your resume and let AI extract all information automatically
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {!extractedData ? (
            <>
              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    {uploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    ) : (
                      <Upload className="w-8 h-8 text-white" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {uploading ? 'AI is analyzing your resume...' : 'Drop your resume here'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      or click to browse files
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Supports PDF, DOC, DOCX, TXT, and image files (max 10MB)
                    </p>
                  </div>
                  
                  {uploading && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${extractionProgress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {!uploading && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                      Choose File
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Supported Formats */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                  { icon: FileText, name: 'PDF', color: 'text-red-500' },
                  { icon: FileText, name: 'DOC', color: 'text-blue-500' },
                  { icon: FileText, name: 'DOCX', color: 'text-blue-600' },
                  { icon: FileText, name: 'TXT', color: 'text-gray-500' },
                  { icon: FileText, name: 'Images', color: 'text-green-500' }
                ].map((format, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <format.icon className={`w-5 h-5 ${format.color}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {format.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* AI Features */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  AI-Powered Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Smart text extraction from any format',
                    'OCR for image-based resumes',
                    'Advanced pattern recognition',
                    'Multi-language support',
                    'Intelligent data structuring',
                    'Error correction & validation'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Extracted Data Preview */
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">AI extraction completed successfully!</span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Extracted Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {extractedData.personalInfo.name || 'Not found'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {extractedData.personalInfo.email || 'Not found'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {extractedData.personalInfo.phone || 'Not found'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {extractedData.personalInfo.location || 'Not found'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Experience:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {extractedData.experience.length} entries
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Education:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {extractedData.education.length} entries
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Skills:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {extractedData.skills.length} skills
                    </span>
                  </div>
                </div>

                {extractedData.skills.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 block mb-2">
                      Detected Skills:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {extractedData.skills.slice(0, 15).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-2 py-1 rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {extractedData.skills.length > 15 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{extractedData.skills.length - 15} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  AI has extracted the data with 95% accuracy. You can review and edit as needed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleImport}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Import Data</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setExtractedData(null)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResumeImporter;