import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search,
  Filter,
  Download,
  Upload,
  CheckSquare,
  Square,
  LogOut,
  BarChart3,
  Database,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Job } from '../types/job';
import { JobStorageService } from '../services/jobStorageService';
import toast from 'react-hot-toast';

interface AdminPortalProps {
  onLogout: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | 'all' | null>(null);

  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    company: '',
    description: '',
    location: '',
    jobType: 'full-time',
    applicationLink: '',
    salary: '',
    requirements: [],
    isActive: true
  });

  useEffect(() => {
    loadJobs();
    loadStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchTerm, filterType]);

  const loadJobs = () => {
    const allJobs = JobStorageService.getAllJobs();
    setJobs(allJobs);
  };

  const loadStats = () => {
    const statistics = JobStorageService.getStorageStats();
    setStats(statistics);
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.location.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search)
      );
    }

    if (filterType) {
      if (filterType === 'active') {
        filtered = filtered.filter(job => job.isActive);
      } else if (filterType === 'inactive') {
        filtered = filtered.filter(job => !job.isActive);
      } else {
        filtered = filtered.filter(job => job.jobType === filterType);
      }
    }

    setFilteredJobs(filtered);
  };

  const handleAddJob = () => {
    if (!formData.title || !formData.company || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newJob = JobStorageService.addJob({
      title: formData.title!,
      company: formData.company!,
      description: formData.description!,
      location: formData.location || '',
      jobType: formData.jobType as Job['jobType'],
      applicationLink: formData.applicationLink || '#',
      salary: formData.salary,
      requirements: formData.requirements || [],
      postedDate: new Date().toISOString(),
      isActive: formData.isActive ?? true
    });

    setJobs(prev => [...prev, newJob]);
    resetForm();
    setShowAddForm(false);
    loadStats();
    toast.success('Job added successfully!');
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      description: job.description,
      location: job.location,
      jobType: job.jobType,
      applicationLink: job.applicationLink,
      salary: job.salary,
      requirements: job.requirements || [],
      isActive: job.isActive
    });
  };

  const handleUpdateJob = () => {
    if (!editingJob || !formData.title || !formData.company || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedJob = JobStorageService.updateJob(editingJob.id, {
      title: formData.title!,
      company: formData.company!,
      description: formData.description!,
      location: formData.location || '',
      jobType: formData.jobType as Job['jobType'],
      applicationLink: formData.applicationLink || '#',
      salary: formData.salary,
      requirements: formData.requirements || [],
      isActive: formData.isActive ?? true
    });

    if (updatedJob) {
      setJobs(prev => prev.map(job => job.id === editingJob.id ? updatedJob : job));
      setEditingJob(null);
      resetForm();
      loadStats();
      toast.success('Job updated successfully!');
    }
  };

  const handleDeleteJob = (id: string) => {
    const success = JobStorageService.deleteJob(id);
    if (success) {
      setJobs(prev => prev.filter(job => job.id !== id));
      setSelectedJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      loadStats();
      toast.success('Job deleted successfully!');
    }
    setShowDeleteConfirm(null);
  };

  const handleDeleteSelected = () => {
    const deletedCount = JobStorageService.deleteJobs(Array.from(selectedJobs));
    setJobs(prev => prev.filter(job => !selectedJobs.has(job.id)));
    setSelectedJobs(new Set());
    loadStats();
    toast.success(`${deletedCount} jobs deleted successfully!`);
    setShowDeleteConfirm(null);
  };

  const handleDeleteAll = () => {
    const deletedCount = JobStorageService.deleteAllJobs();
    setJobs([]);
    setSelectedJobs(new Set());
    loadStats();
    toast.success(`All ${deletedCount} jobs deleted successfully!`);
    setShowDeleteConfirm(null);
  };

  const handleSelectAll = () => {
    if (selectedJobs.size === filteredJobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(filteredJobs.map(job => job.id)));
    }
  };

  const handleToggleJobStatus = (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (job) {
      const updatedJob = JobStorageService.updateJob(id, { isActive: !job.isActive });
      if (updatedJob) {
        setJobs(prev => prev.map(j => j.id === id ? updatedJob : j));
        loadStats();
        toast.success(`Job ${updatedJob.isActive ? 'activated' : 'deactivated'}`);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      description: '',
      location: '',
      jobType: 'full-time',
      applicationLink: '',
      salary: '',
      requirements: [],
      isActive: true
    });
  };

  const handleSyncAPI = async () => {
    toast.loading('Syncing with API...');
    const success = await JobStorageService.syncWithAPI();
    toast.dismiss();
    
    if (success) {
      loadJobs();
      loadStats();
      toast.success('Successfully synced with API!');
    } else {
      toast.error('API sync failed. System continues with local storage.');
    }
  };

  const exportJobs = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jobs_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Jobs exported successfully!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Job Management Portal
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage all job listings and career opportunities
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSyncAPI}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sync API</span>
              </button>
              
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalJobs}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Total Jobs</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeJobs}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Active Jobs</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                  <Square className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inactiveJobs}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Inactive Jobs</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(stats.storageSize / 1024)}KB
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Storage Used</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {stats.lastSync ? formatDate(stats.lastSync.toISOString()) : 'Never'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Last API Sync</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Jobs</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Job</span>
              </button>

              <button
                onClick={exportJobs}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedJobs.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedJobs.size} job{selectedJobs.size !== 1 ? 's' : ''} selected
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm('selected')}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Selected</span>
                  </button>
                  <button
                    onClick={() => setSelectedJobs(new Set())}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Jobs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Job Listings ({filteredJobs.length})
              </h2>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {selectedJobs.size === filteredJobs.length ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                  <span>Select All</span>
                </button>
                
                {jobs.length > 0 && (
                  <button
                    onClick={() => setShowDeleteConfirm('all')}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete All</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Job Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Company & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Posted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredJobs.map((job) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          const newSelected = new Set(selectedJobs);
                          if (newSelected.has(job.id)) {
                            newSelected.delete(job.id);
                          } else {
                            newSelected.add(job.id);
                          }
                          setSelectedJobs(newSelected);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {selectedJobs.has(job.id) ? (
                          <CheckSquare className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {job.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {job.description.substring(0, 100)}...
                        </div>
                        {job.salary && (
                          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                            {job.salary}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {job.company}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {job.location}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          job.jobType === 'full-time' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          job.jobType === 'part-time' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          job.jobType === 'contract' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                          job.jobType === 'internship' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                          'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
                        }`}>
                          {job.jobType.replace('-', ' ')}
                        </span>
                        <div>
                          <button
                            onClick={() => handleToggleJobStatus(job.id)}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              job.isActive 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}
                          >
                            {job.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(job.postedDate)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditJob(job)}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(job.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || filterType ? 'Try adjusting your search criteria' : 'Start by adding your first job'}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add/Edit Job Modal */}
      <AnimatePresence>
        {(showAddForm || editingJob) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddForm(false);
              setEditingJob(null);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingJob ? 'Edit Job' : 'Add New Job'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingJob(null);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      value={formData.company || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Google India"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Bangalore, Karnataka"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Type
                    </label>
                    <select
                      value={formData.jobType || 'full-time'}
                      onChange={(e) => setFormData(prev => ({ ...prev, jobType: e.target.value as Job['jobType'] }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Salary
                    </label>
                    <input
                      type="text"
                      value={formData.salary || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., ₹15-25 LPA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Application Link
                    </label>
                    <input
                      type="url"
                      value={formData.applicationLink || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, applicationLink: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="https://company.com/careers"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Requirements (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.requirements?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      requirements: e.target.value.split(',').map(req => req.trim()).filter(req => req.length > 0)
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., React, TypeScript, 3+ years experience"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Job is active and visible to candidates
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingJob(null);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingJob ? handleUpdateJob : handleAddJob}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    <span>{editingJob ? 'Update Job' : 'Add Job'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Confirm Deletion
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {showDeleteConfirm === 'all' 
                  ? 'Are you sure you want to delete ALL jobs? This action cannot be undone.'
                  : showDeleteConfirm === 'selected'
                  ? `Are you sure you want to delete ${selectedJobs.size} selected job${selectedJobs.size !== 1 ? 's' : ''}?`
                  : 'Are you sure you want to delete this job? This action cannot be undone.'
                }
              </p>
              
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showDeleteConfirm === 'all') {
                      handleDeleteAll();
                    } else if (showDeleteConfirm === 'selected') {
                      handleDeleteSelected();
                    } else {
                      handleDeleteJob(showDeleteConfirm);
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPortal;