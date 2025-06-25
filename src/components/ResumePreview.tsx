import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Eye, Smartphone, Tablet, Monitor } from 'lucide-react';
import { ResumeData } from '../utils/pdfGenerator';
import { getTemplateById } from '../data/resumeTemplates';

interface ResumePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  templateId: string;
  onDownload: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  isOpen,
  onClose,
  resumeData,
  templateId,
  onDownload
}) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const template = getTemplateById(templateId);

  if (!isOpen || !template) return null;

  const getPreviewClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-80 h-[600px]';
      case 'tablet':
        return 'w-96 h-[500px]';
      default:
        return 'w-full max-w-4xl h-[700px]';
    }
  };

  const generatePreviewHTML = () => {
    return `
      <div style="
        font-family: 'Inter', sans-serif;
        background: ${template.colors.background};
        color: ${template.colors.text};
        padding: 2rem;
        min-height: 100%;
        line-height: 1.6;
      ">
        <!-- Header -->
        <div style="
          border-bottom: 3px solid ${template.colors.primary};
          padding-bottom: 1.5rem;
          margin-bottom: 2rem;
        ">
          <h1 style="
            font-size: 2.5rem;
            font-weight: 800;
            color: ${template.colors.primary};
            margin: 0 0 0.5rem 0;
          ">${resumeData.personalInfo.name || 'Your Name'}</h1>
          
          <div style="
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            font-size: 0.9rem;
            color: ${template.colors.text};
            opacity: 0.8;
          ">
            ${resumeData.personalInfo.email ? `<span>📧 ${resumeData.personalInfo.email}</span>` : ''}
            ${resumeData.personalInfo.phone ? `<span>📱 ${resumeData.personalInfo.phone}</span>` : ''}
            ${resumeData.personalInfo.location ? `<span>📍 ${resumeData.personalInfo.location}</span>` : ''}
            ${resumeData.personalInfo.linkedin ? `<span>💼 LinkedIn</span>` : ''}
            ${resumeData.personalInfo.github ? `<span>🔗 GitHub</span>` : ''}
          </div>
        </div>

        <!-- Professional Summary -->
        ${resumeData.personalInfo.summary ? `
        <div style="margin-bottom: 2rem;">
          <h2 style="
            font-size: 1.5rem;
            font-weight: 700;
            color: ${template.colors.secondary};
            margin: 0 0 1rem 0;
            border-left: 4px solid ${template.colors.accent};
            padding-left: 1rem;
          ">Professional Summary</h2>
          <p style="margin: 0; line-height: 1.7;">${resumeData.personalInfo.summary}</p>
        </div>
        ` : ''}

        <!-- Experience -->
        ${resumeData.experience.length > 0 ? `
        <div style="margin-bottom: 2rem;">
          <h2 style="
            font-size: 1.5rem;
            font-weight: 700;
            color: ${template.colors.secondary};
            margin: 0 0 1rem 0;
            border-left: 4px solid ${template.colors.accent};
            padding-left: 1rem;
          ">Work Experience</h2>
          ${resumeData.experience.map(exp => `
            <div style="
              margin-bottom: 1.5rem;
              padding: 1.5rem;
              background: ${template.colors.background === '#FFFFFF' ? '#F8FAFC' : 'rgba(255,255,255,0.05)'};
              border-radius: 0.5rem;
              border-left: 3px solid ${template.colors.primary};
            ">
              <h3 style="
                font-size: 1.2rem;
                font-weight: 600;
                color: ${template.colors.primary};
                margin: 0 0 0.25rem 0;
              ">${exp.title}</h3>
              <div style="
                font-weight: 500;
                color: ${template.colors.secondary};
                margin-bottom: 0.5rem;
              ">${exp.company} | ${exp.duration}</div>
              <p style="margin: 0; line-height: 1.6;">${exp.description}</p>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Education -->
        ${resumeData.education.length > 0 ? `
        <div style="margin-bottom: 2rem;">
          <h2 style="
            font-size: 1.5rem;
            font-weight: 700;
            color: ${template.colors.secondary};
            margin: 0 0 1rem 0;
            border-left: 4px solid ${template.colors.accent};
            padding-left: 1rem;
          ">Education</h2>
          ${resumeData.education.map(edu => `
            <div style="
              margin-bottom: 1rem;
              padding: 1rem;
              background: ${template.colors.background === '#FFFFFF' ? '#F8FAFC' : 'rgba(255,255,255,0.05)'};
              border-radius: 0.5rem;
            ">
              <h3 style="
                font-size: 1.1rem;
                font-weight: 600;
                color: ${template.colors.primary};
                margin: 0 0 0.25rem 0;
              ">${edu.degree}</h3>
              <div style="
                color: ${template.colors.secondary};
                margin-bottom: 0.25rem;
              ">${edu.institution}</div>
              <div style="
                font-size: 0.9rem;
                opacity: 0.8;
              ">${edu.year}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Skills -->
        ${resumeData.skills.length > 0 ? `
        <div style="margin-bottom: 2rem;">
          <h2 style="
            font-size: 1.5rem;
            font-weight: 700;
            color: ${template.colors.secondary};
            margin: 0 0 1rem 0;
            border-left: 4px solid ${template.colors.accent};
            padding-left: 1rem;
          ">Skills</h2>
          <div style="
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          ">
            ${resumeData.skills.map(skill => `
              <span style="
                background: ${template.colors.primary};
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 1.5rem;
                font-size: 0.9rem;
                font-weight: 500;
              ">${skill}</span>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Projects -->
        ${resumeData.projects && resumeData.projects.length > 0 ? `
        <div style="margin-bottom: 2rem;">
          <h2 style="
            font-size: 1.5rem;
            font-weight: 700;
            color: ${template.colors.secondary};
            margin: 0 0 1rem 0;
            border-left: 4px solid ${template.colors.accent};
            padding-left: 1rem;
          ">Projects</h2>
          ${resumeData.projects.map(project => `
            <div style="
              margin-bottom: 1.5rem;
              padding: 1.5rem;
              background: ${template.colors.background === '#FFFFFF' ? '#F8FAFC' : 'rgba(255,255,255,0.05)'};
              border-radius: 0.5rem;
              border-left: 3px solid ${template.colors.accent};
            ">
              <h3 style="
                font-size: 1.2rem;
                font-weight: 600;
                color: ${template.colors.primary};
                margin: 0 0 0.5rem 0;
              ">${project.name}</h3>
              <p style="margin: 0 0 0.5rem 0; line-height: 1.6;">${project.description}</p>
              ${project.technologies ? `
                <div style="
                  font-size: 0.9rem;
                  color: ${template.colors.secondary};
                  font-weight: 500;
                  margin-bottom: 0.5rem;
                ">Technologies: ${project.technologies}</div>
              ` : ''}
              ${project.link ? `
                <a href="${project.link}" style="
                  color: ${template.colors.primary};
                  text-decoration: none;
                  font-weight: 500;
                ">🔗 View Project</a>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    `;
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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Resume Preview
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {template.name} Template • ATS Score: {template.atsScore}%
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Selector */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {[
                { mode: 'desktop' as const, icon: Monitor },
                { mode: 'tablet' as const, icon: Tablet },
                { mode: 'mobile' as const, icon: Smartphone }
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  aria-label={`Switch to ${mode} view`}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === mode
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            {/* Actions */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDownload}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </motion.button>

            <button
              aria-label="Close preview"
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="flex justify-center">
            <div className={`${getPreviewClasses()} bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300`}>
              <iframe
                srcDoc={generatePreviewHTML()}
                className="w-full h-full border-0"
                title="Resume Preview"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>Live Preview</span>
            </div>
            <div className="flex items-center space-x-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: template.colors.primary }}
              />
              <span>{template.category} Template</span>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Press ESC to close
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResumePreview;