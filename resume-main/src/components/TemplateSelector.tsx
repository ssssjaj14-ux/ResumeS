import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ResumeTemplateExport1 from './ResumeTemplateExport1';
import ResumeTemplateExport2 from './ResumeTemplateExport2';
import ResumeTemplateExport3 from './ResumeTemplateExport3';
import ResumeTemplateExport4 from './ResumeTemplateExport4';
import ResumeTemplateExport5 from './ResumeTemplateExport5';
import ResumeTemplateExport6 from './ResumeTemplateExport6';
import ResumeTemplateExport7 from './ResumeTemplateExport7';
import html2canvas from 'html2canvas';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onPreview: (templateId: string) => void;
  onTemplateDataLoaded: (templateData: any) => void;
}

const templates = [
  {
    id: 'export1',
    name: 'Creative Resume',
    description: 'A visually rich, creative resume template.',
    component: ResumeTemplateExport1
  },
  {
    id: 'export2',
    name: 'Modern Sidebar',
    description: 'Modern layout with a left sidebar for contact and skills.',
    component: ResumeTemplateExport2
  },
  {
    id: 'export3',
    name: 'Teal Two-Column',
    description: 'Teal/gray two-column layout for a clean, professional look.',
    component: ResumeTemplateExport3
  },
  {
    id: 'export4',
    name: 'Bold Orange',
    description: 'Bold header with orange gradient and sidebar for skills.',
    component: ResumeTemplateExport4
  },
  {
    id: 'export5',
    name: 'Minimalist White',
    description: 'Minimalist, all-white layout with top bar and two columns.',
    component: ResumeTemplateExport5
  },
  {
    id: 'export6',
    name: 'Dark Timeline',
    description: 'Dark theme with vertical timeline for experience.',
    component: ResumeTemplateExport6
  },
  {
    id: 'export7',
    name: 'Purple Split',
    description: 'Split layout with purple color bar and clean main area.',
    component: ResumeTemplateExport7
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onTemplateSelect, onPreview, onTemplateDataLoaded }) => {
  const [previews, setPreviews] = useState<{ [id: string]: string }>({});
  const previewRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});

  // Generate preview images for visible templates on mount
  useEffect(() => {
    templates.slice(0, 4).forEach(template => {
      const node = previewRefs.current[template.id];
      if (node && !previews[template.id]) {
        html2canvas(node, { backgroundColor: '#fff', scale: 1.5 }).then(canvas => {
          setPreviews(prev => ({ ...prev, [template.id]: canvas.toDataURL('image/png') }));
        });
      }
    });
  }, []);

  // Generate preview on hover for others
  const handleMouseEnter = (templateId: string) => {
    if (!previews[templateId]) {
      const node = previewRefs.current[templateId];
      if (node) {
        html2canvas(node, { backgroundColor: '#fff', scale: 1.5 }).then(canvas => {
          setPreviews(prev => ({ ...prev, [templateId]: canvas.toDataURL('image/png') }));
        });
      }
    }
  };

  const SelectedComponent = selectedTemplate
    ? templates.find(t => t.id === selectedTemplate)?.component
    : null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Resume Template
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Select a template below. Each is fully coded in React, HTML, and CSS.
        </p>
      </motion.div>
      {/* Off-screen renders for previews */}
      <div style={{ position: 'absolute', left: -9999, top: 0, height: 0, width: 0, overflow: 'hidden' }}>
        {templates.map(template => (
          <div
            key={template.id}
            ref={el => (previewRefs.current[template.id] = el)}
            style={{ width: 300, height: 425 }}
          >
            <template.component preview={true} />
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {templates.map((template, idx) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer ${
              selectedTemplate === template.id ? 'ring-4 ring-blue-500 shadow-2xl' : 'hover:shadow-xl'
            }`}
            onClick={() => onTemplateSelect(template.id)}
            onDoubleClick={() => onPreview(template.id)}
            onMouseEnter={() => handleMouseEnter(template.id)}
          >
            <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              {previews[template.id] ? (
                <img
                  src={previews[template.id]}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Loading...</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{template.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">{template.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      {SelectedComponent && (
        <div className="mt-8">
          <SelectedComponent />
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
