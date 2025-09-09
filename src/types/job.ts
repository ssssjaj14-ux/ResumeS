export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  applicationLink: string;
  salary?: string;
  requirements?: string[];
  postedDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  jobType?: string;
  company?: string;
}