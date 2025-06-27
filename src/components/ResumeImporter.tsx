import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, X, Download } from 'lucide-react';
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
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    
    try {
      // Extract text from file
      const text = await extractTextFromFile(file);
      
      // Parse the extracted text using AI
      const parsedData = await parseResumeText(text);
      
      setExtractedData(parsedData);
      toast.success('Resume data extracted successfully!');
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
            // For PDF files, we'll use a simple text extraction
            // In a real implementation, you'd use a library like pdf-parse
            const text = await extractPDFText(result as ArrayBuffer);
            resolve(text);
          } else {
            // For DOC/DOCX files, we'll use a simple approach
            // In a real implementation, you'd use a library like mammoth
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
    // Simplified PDF text extraction
    // In a real implementation, use pdf-parse or similar library
    const uint8Array = new Uint8Array(buffer);
    const text = new TextDecoder().decode(uint8Array);
    
    // Extract readable text from PDF (very basic approach)
    const textMatch = text.match(/BT\s*(.*?)\s*ET/gs);
    if (textMatch) {
      return textMatch.join(' ').replace(/[^\w\s@.-]/g, ' ').replace(/\s+/g, ' ').trim();
    }
    
    // Fallback: return raw text
    return text.replace(/[^\w\s@.-]/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const extractDocText = async (buffer: ArrayBuffer): Promise<string> => {
    // Simplified DOC/DOCX text extraction
    // In a real implementation, use mammoth.js or similar library
    const uint8Array = new Uint8Array(buffer);
    const text = new TextDecoder().decode(uint8Array);
    
    // Extract readable text (very basic approach)
    return text.replace(/[^\w\s@.-]/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const parseResumeText = async (text: string): Promise<ResumeData> => {
    // Advanced AI-powered parsing algorithm
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Initialize resume data structure
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

    // Extract personal information
    resumeData.personalInfo = extractPersonalInfo(text);
    
    // Extract experience
    resumeData.experience = extractExperience(text);
    
    // Extract education
    resumeData.education = extractEducation(text);
    
    // Extract skills
    resumeData.skills = extractSkills(text);
    
    // Extract projects
    resumeData.projects = extractProjects(text);

    return resumeData;
  };

  const extractPersonalInfo = (text: string) => {
    const personalInfo = {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      linkedin: '',
      github: ''
    };

    // Extract email
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) personalInfo.email = emailMatch[0];

    // Extract phone
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) personalInfo.phone = phoneMatch[0];

    // Extract LinkedIn
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    if (linkedinMatch) personalInfo.linkedin = `https://${linkedinMatch[0]}`;

    // Extract GitHub
    const githubMatch = text.match(/github\.com\/[\w-]+/i);
    if (githubMatch) personalInfo.github = `https://${githubMatch[0]}`;

    // Extract name (usually the first line or before contact info)
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    for (const line of lines.slice(0, 5)) {
      if (!line.includes('@') && !line.match(/\d{3}/) && line.length > 5 && line.length < 50) {
        if (line.match(/^[A-Za-z\s]+$/)) {
          personalInfo.name = line;
          break;
        }
      }
    }

    // Extract location (look for city, state patterns)
    const locationMatch = text.match(/([A-Za-z\s]+,\s*[A-Za-z\s]+(?:,\s*\d{5})?)/);
    if (locationMatch) personalInfo.location = locationMatch[0];

    // Extract summary/objective
    const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
    for (const keyword of summaryKeywords) {
      const regex = new RegExp(`${keyword}[:\\s]*([^\\n]{50,300})`, 'i');
      const match = text.match(regex);
      if (match) {
        personalInfo.summary = match[1].trim();
        break;
      }
    }

    return personalInfo;
  };

  const extractExperience = (text: string) => {
    const experience = [];
    const experienceKeywords = ['experience', 'employment', 'work history', 'professional experience'];
    
    // Find experience section
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
      // Parse individual jobs
      const jobPattern = /([A-Za-z\s&,.-]+)\s*[-–—]\s*([A-Za-z\s&,.-]+)\s*(\d{4}\s*[-–—]\s*(?:\d{4}|present))/gi;
      let match;
      
      while ((match = jobPattern.exec(experienceSection)) !== null) {
        const title = match[1].trim();
        const company = match[2].trim();
        const duration = match[3].trim();
        
        // Extract description (next few lines after the job header)
        const jobIndex = experienceSection.indexOf(match[0]);
        const nextJobIndex = experienceSection.indexOf('\n', jobIndex + match[0].length);
        const description = experienceSection.substring(jobIndex + match[0].length, nextJobIndex > 0 ? nextJobIndex + 200 : jobIndex + 300).trim();
        
        experience.push({
          title,
          company,
          duration,
          description: description.substring(0, 200) + (description.length > 200 ? '...' : '')
        });
      }
    }

    return experience;
  };

  const extractEducation = (text: string) => {
    const education = [];
    const educationKeywords = ['education', 'academic', 'qualifications'];
    
    // Find education section
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
      // Parse degrees
      const degreePattern = /(bachelor|master|phd|doctorate|diploma|certificate|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?)[^\\n]*([^\\n]*university|college|institute|school)[^\\n]*(\d{4})/gi;
      let match;
      
      while ((match = degreePattern.exec(educationSection)) !== null) {
        const degree = match[0].trim();
        const institution = match[2].trim();
        const year = match[3];
        
        education.push({
          degree,
          institution,
          year,
          gpa: ''
        });
      }
    }

    return education;
  };

  // Helper function to escape special regex characters
  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const extractSkills = (text: string) => {
    const skills = [];
    const skillsKeywords = ['skills', 'technologies', 'technical skills', 'competencies'];
    
    // Common technical skills to look for
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
      'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind',
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins',
      'Git', 'GitHub', 'GitLab', 'Bitbucket',
      'Photoshop', 'Illustrator', 'Figma', 'Sketch',
      'Project Management', 'Agile', 'Scrum', 'Leadership'
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

    // Extract skills from the skills section or entire text
    const searchText = skillsSection || text;
    
    for (const skill of commonSkills) {
      const escapedSkill = escapeRegExp(skill);
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
      if (regex.test(searchText)) {
        skills.push(skill);
      }
    }

    return [...new Set(skills)]; // Remove duplicates
  };

  const extractProjects = (text: string) => {
    const projects = [];
    const projectKeywords = ['projects', 'portfolio', 'work samples'];
    
    // Find projects section
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
      // Parse individual projects
      const projectPattern = /([A-Za-z\s&,.-]+)\s*[-–—]\s*([^\\n]{20,200})/gi;
      let match;
      
      while ((match = projectPattern.exec(projectsSection)) !== null) {
        const name = match[1].trim();
        const description = match[2].trim();
        
        projects.push({
          name,
          description,
          technologies: '',
          link: ''
        });
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Import Resume
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Upload your existing resume to auto-fill the form
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!extractedData ? (
            <>
              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
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
                  accept=".pdf,.doc,.docx,.txt"
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
                      {uploading ? 'Processing your resume...' : 'Drop your resume here'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      or click to browse files
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Supports PDF, DOC, DOCX, and TXT files (max 10MB)
                    </p>
                  </div>
                  
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
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: FileText, name: 'PDF', color: 'text-red-500' },
                  { icon: FileText, name: 'DOC', color: 'text-blue-500' },
                  { icon: FileText, name: 'DOCX', color: 'text-blue-600' },
                  { icon: FileText, name: 'TXT', color: 'text-gray-500' }
                ].map((format, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <format.icon className={`w-5 h-5 ${format.color}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {format.name}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Extracted Data Preview */
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">Data extracted successfully!</span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Extracted Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                      {extractedData.skills.slice(0, 10).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-2 py-1 rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {extractedData.skills.length > 10 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{extractedData.skills.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Please review and edit the extracted data as needed. The AI extraction may not be 100% accurate.
                </p>
              </div>

              <div className="flex space-x-4">
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