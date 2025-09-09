import { Job } from '../types/job';

export const validateJob = (job: Partial<Job>): string[] => {
  const errors: string[] = [];

  if (!job.title?.trim()) {
    errors.push('Job title is required');
  }

  if (!job.company?.trim()) {
    errors.push('Company name is required');
  }

  if (!job.description?.trim()) {
    errors.push('Job description is required');
  }

  if (job.applicationLink && !isValidUrl(job.applicationLink)) {
    errors.push('Application link must be a valid URL');
  }

  return errors;
};

export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const formatJobType = (type: string): string => {
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export const getJobTypeColor = (type: Job['jobType']): string => {
  switch (type) {
    case 'full-time':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'part-time':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'contract':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'internship':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    case 'remote':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const sortJobs = (jobs: Job[], sortBy: 'date' | 'title' | 'company' | 'type', order: 'asc' | 'desc' = 'desc'): Job[] => {
  return [...jobs].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'company':
        comparison = a.company.localeCompare(b.company);
        break;
      case 'type':
        comparison = a.jobType.localeCompare(b.jobType);
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });
};

export const getJobStats = (jobs: Job[]) => {
  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.isActive).length,
    inactive: jobs.filter(j => !j.isActive).length,
    byType: {} as Record<string, number>,
    byCompany: {} as Record<string, number>,
    recentJobs: jobs.filter(j => {
      const daysDiff = (Date.now() - new Date(j.postedDate).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length
  };

  // Count by job type
  jobs.forEach(job => {
    stats.byType[job.jobType] = (stats.byType[job.jobType] || 0) + 1;
  });

  // Count by company
  jobs.forEach(job => {
    stats.byCompany[job.company] = (stats.byCompany[job.company] || 0) + 1;
  });

  return stats;
};

export const searchJobs = (jobs: Job[], query: string): Job[] => {
  if (!query.trim()) return jobs;

  const searchTerm = query.toLowerCase();
  return jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm) ||
    job.company.toLowerCase().includes(searchTerm) ||
    job.description.toLowerCase().includes(searchTerm) ||
    job.location.toLowerCase().includes(searchTerm) ||
    (job.requirements && job.requirements.some(req => 
      req.toLowerCase().includes(searchTerm)
    ))
  );
};

export const filterJobs = (jobs: Job[], filters: {
  jobType?: string;
  location?: string;
  company?: string;
  isActive?: boolean;
}): Job[] => {
  return jobs.filter(job => {
    if (filters.jobType && job.jobType !== filters.jobType) return false;
    if (filters.isActive !== undefined && job.isActive !== filters.isActive) return false;
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.company && !job.company.toLowerCase().includes(filters.company.toLowerCase())) return false;
    return true;
  });
};