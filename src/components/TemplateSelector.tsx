import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Eye, 
  Download,
  CheckCircle,
  Zap,
  Award,
  Sparkles
} from 'lucide-react';
import { resumeTemplates, ResumeTemplate } from '../data/resumeTemplates';
import toast from 'react-hot-toast';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onPreview: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onPreview
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'ats' | 'name' | 'category'>('ats');

  const categories = [
    { id: 'all', name: 'All Templates', count: resumeTemplates.length },
    { id: 'modern', name: 'Modern', count: resumeTemplates.filter(t => t.category === 'modern').length },
    { id: 'classic', name: 'Classic', count: resumeTemplates.filter(t => t.category === 'classic').length },
    { id: 'creative', name: 'Creative', count: resumeTemplates.filter(t => t.category === 'creative').length },
    { id: 'executive', name: 'Executive', count: resumeTemplates.filter(t => t.category === 'executive').length },
    { id: 'technical', name: 'Technical', count: resumeTemplates.filter(t => t.category === 'technical').length },
    { id: 'minimalist', name: 'Minimalist', count: resumeTemplates.filter(t => t.category === 'minimalist').length }
  ];

  const filteredTemplates = resumeTemplates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'ats':
          return b.atsScore - a.atsScore;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const getATSScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-100';
    if (score >= 90) return 'text-blue-600 bg-blue-100';
    if (score >= 85) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getATSScoreIcon = (score: number) => {
    if (score >= 95) return <Award className="w-4 h-4" />;
    if (score >= 90) return <Star className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Perfect Template
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Select from our collection of 30+ ATS-optimized resume templates. 
          Each template is designed to help you stand out while passing automated screening systems.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 items-center justify-between"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <label htmlFor="sortBy" className="sr-only">Sort templates</label>
            <select
              id="sortBy"
              aria-label="Sort templates"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'ats' | 'name' | 'category')}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="ats">Sort by ATS Score</option>
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 justify-center"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </motion.div>

      {/* Templates Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer ${
              selectedTemplate === template.id
                ? 'ring-4 ring-blue-500 shadow-2xl'
                : 'hover:shadow-xl'
            }`}
            onClick={() => {
              onTemplateSelect(template.id);
              toast.success(`${template.name} template selected!`);
            }}
          >
            {/* Template Preview */}
            <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
              <img
                src={template.preview || '/placeholder-image.png'}
                alt={template.name}
                onError={e => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreview(template.id);
                      }}
                      className="flex-1 bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 hover:bg-white/30 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTemplateSelect(template.id);
                        toast.success('Template selected! You can now download your resume.');
                      }}
                      className="flex-1 bg-blue-600/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 hover:bg-blue-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Use</span>
                    </motion.button>
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

              {/* ATS Score Badge */}
              <div className="absolute top-3 left-3">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${getATSScoreColor(template.atsScore)}`}>
                  {getATSScoreIcon(template.atsScore)}
                  <span>{template.atsScore}% ATS</span>
                </div>
              </div>

              {/* Category Badge */}
              <div className="absolute bottom-3 left-3">
                <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium capitalize backdrop-blur-sm">
                  {template.category}
                </span>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {template.name}
                </h3>
                {template.atsScore >= 95 && (
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-medium">Premium</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {template.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-1 mb-3">
                {template.features.slice(0, 2).map((feature, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md"
                  >
                    {feature}
                  </span>
                ))}
                {template.features.length > 2 && (
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">
                    +{template.features.length - 2} more
                  </span>
                )}
              </div>

              {/* Color Palette */}
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Colors:</span>
                <div className="flex space-x-1">
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: template.colors.primary }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: template.colors.secondary }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No templates found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your search or filter criteria
          </p>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">30+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Templates</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">95%+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg ATS Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">6</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">100%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Mobile Ready</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TemplateSelector;