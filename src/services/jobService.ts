export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: string;
  salary?: string;
  description: string;
  requirements: string[];
  posted: string;
  url: string;
  logo?: string;
  remote: boolean;
  skills: string[];
}

// Mock job data - In production, this would fetch from real job APIs
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Bangalore, India',
    type: 'full-time',
    experience: '3-5 years',
    salary: '₹25-40 LPA',
    description: 'Join our team to build scalable systems that serve billions of users worldwide.',
    requirements: ['JavaScript', 'React', 'Node.js', 'System Design', 'Computer Science Degree'],
    posted: '2 days ago',
    url: 'https://careers.google.com',
    logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: false,
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS']
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Microsoft',
    location: 'Hyderabad, India',
    type: 'full-time',
    experience: '2-4 years',
    salary: '₹20-35 LPA',
    description: 'Build amazing user experiences for Microsoft products used by millions.',
    requirements: ['React', 'TypeScript', 'CSS', 'HTML', 'Git'],
    posted: '1 day ago',
    url: 'https://careers.microsoft.com',
    logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: true,
    skills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'Azure']
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'Amazon',
    location: 'Mumbai, India',
    type: 'full-time',
    experience: '1-3 years',
    salary: '₹18-30 LPA',
    description: 'Use machine learning to solve complex business problems at scale.',
    requirements: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'AWS'],
    posted: '3 days ago',
    url: 'https://amazon.jobs',
    logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: false,
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'AWS']
  },
  {
    id: '4',
    title: 'Product Manager',
    company: 'Flipkart',
    location: 'Bangalore, India',
    type: 'full-time',
    experience: '3-6 years',
    salary: '₹30-50 LPA',
    description: 'Lead product strategy and execution for India\'s largest e-commerce platform.',
    requirements: ['Product Strategy', 'Analytics', 'User Research', 'Agile', 'MBA preferred'],
    posted: '1 week ago',
    url: 'https://flipkart.com/careers',
    logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: false,
    skills: ['Product Management', 'Analytics', 'Strategy', 'Leadership', 'Data Analysis']
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'Zomato',
    location: 'Gurgaon, India',
    type: 'full-time',
    experience: '2-5 years',
    salary: '₹15-28 LPA',
    description: 'Build and maintain infrastructure that powers food delivery for millions.',
    requirements: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
    posted: '4 days ago',
    url: 'https://zomato.com/careers',
    logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: true,
    skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Python']
  }
];

// Generate more mock jobs to reach 200+
const generateMoreJobs = (): Job[] => {
  const companies = ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Accenture', 'IBM', 'Oracle', 'SAP', 'Adobe'];
  const locations = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];
  const jobTitles = [
    'Software Engineer', 'Full Stack Developer', 'Backend Developer', 'Frontend Developer',
    'Data Analyst', 'Business Analyst', 'QA Engineer', 'UI/UX Designer', 'Product Manager',
    'Project Manager', 'Scrum Master', 'Technical Lead', 'Architect', 'Consultant'
  ];
  
  const additionalJobs: Job[] = [];
  
  for (let i = 6; i <= 200; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const experience = ['0-2 years', '2-4 years', '3-5 years', '5-8 years'][Math.floor(Math.random() * 4)];
    const salary = ['₹8-15 LPA', '₹15-25 LPA', '₹25-40 LPA', '₹40-60 LPA'][Math.floor(Math.random() * 4)];
    const remote = Math.random() > 0.5;
    const type = ['full-time', 'part-time', 'contract', 'internship'][Math.floor(Math.random() * 4)] as Job['type'];
    
    additionalJobs.push({
      id: i.toString(),
      title,
      company,
      location: `${location}, India`,
      type,
      experience,
      salary,
      description: `Join ${company} as a ${title} and work on exciting projects that impact millions of users.`,
      requirements: ['Programming', 'Problem Solving', 'Team Work', 'Communication'],
      posted: `${Math.floor(Math.random() * 14) + 1} days ago`,
      url: `https://${company.toLowerCase()}.com/careers`,
      logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100',
      remote,
      skills: ['JavaScript', 'Python', 'Java', 'React', 'Node.js'].slice(0, Math.floor(Math.random() * 3) + 2)
    });
  }
  
  return additionalJobs;
};

const allJobs = [...mockJobs, ...generateMoreJobs()];

export const searchJobs = async (query: string, filters: {
  location?: string;
  type?: string;
  experience?: string;
  remote?: boolean;
  skills?: string[];
}): Promise<Job[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredJobs = allJobs;
  
  if (query) {
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
    );
  }
  
  if (filters.location) {
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  
  if (filters.type) {
    filteredJobs = filteredJobs.filter(job => job.type === filters.type);
  }
  
  if (filters.remote !== undefined) {
    filteredJobs = filteredJobs.filter(job => job.remote === filters.remote);
  }
  
  if (filters.skills && filters.skills.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      filters.skills!.some(skill => 
        job.skills.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    );
  }
  
  return filteredJobs;
};

export const getRecommendedJobs = async (userSkills: string[], experience: string): Promise<Job[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const recommendedJobs = allJobs
    .filter(job => {
      const skillMatch = job.skills.some(skill => 
        userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
      return skillMatch;
    })
    .sort((a, b) => {
      const aMatches = a.skills.filter(skill => 
        userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      ).length;
      const bMatches = b.skills.filter(skill => 
        userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      ).length;
      return bMatches - aMatches;
    })
    .slice(0, 20);
  
  return recommendedJobs;
};

export const getJobById = async (id: string): Promise<Job | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return allJobs.find(job => job.id === id) || null;
};

export async function fetchJobsFromRapidAPI({ jobTitle, location, locationType = 'ANY', yearsOfExperience = 'ALL' }: {
  jobTitle: string;
  location: string;
  locationType?: string;
  yearsOfExperience?: string;
}) {
  const url = `https://jsearch.p.rapidapi.com/estimated-salary?job_title=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(location)}&location_type=${locationType}&years_of_experience=${yearsOfExperience}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        'x-rapidapi-key': '4001d586c0mshe5c6df98716c02cp18ebd8jsncec0cef5ba34',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch jobs');
    return await response.json();
  } catch (error) {
    console.error('RapidAPI job fetch error:', error);
    return null;
  }
}

export async function fetchJobsFromRapidAPIPost({
  search_term,
  location,
  results_wanted = 5,
  site_name = ["indeed", "linkedin", "zip_recruiter", "glassdoor"],
  distance = 50,
  job_type = "fulltime",
  is_remote = false,
  linkedin_fetch_description = false,
  hours_old = 72
}: {
  search_term: string;
  location: string;
  results_wanted?: number;
  site_name?: string[];
  distance?: number;
  job_type?: string;
  is_remote?: boolean;
  linkedin_fetch_description?: boolean;
  hours_old?: number;
}) {
  const url = 'https://jobs-search-api.p.rapidapi.com/getjobs';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'jobs-search-api.p.rapidapi.com',
        'x-rapidapi-key': '4001d586c0mshe5c6df98716c02cp18ebd8jsncec0cef5ba34',
      },
      body: JSON.stringify({
        search_term,
        location,
        results_wanted,
        site_name,
        distance,
        job_type,
        is_remote,
        linkedin_fetch_description,
        hours_old
      })
    });
    if (!response.ok) throw new Error('Failed to fetch jobs (POST)');
    return await response.json();
  } catch (error) {
    console.error('RapidAPI POST job fetch error:', error);
    return null;
  }
}

/**
 * Smart job-fetching algorithm: prioritizes trending job titles, recent user searches, and hot locations.
 * Tracks trends, fetches jobs for them first, and falls back to defaults. Returns up to 1000 unique jobs.
 */
const trendingJobTitles: string[] = [
  'ai', 'ml', 'data scientist', 'cloud engineer', 'devops', 'frontend', 'backend', 'fullstack', 'cybersecurity', 'blockchain', 'product manager', 'designer', 'qa', 'mobile developer', 'react', 'nodejs', 'python', 'java', 'typescript', 'golang', 'aws', 'azure', 'marketing', 'sales', 'support'
];
const trendingLocations: string[] = [
  'bangalore', 'mumbai', 'delhi', 'new york', 'san francisco', 'london', 'berlin', 'sydney', 'toronto', 'singapore'
];
let recentUserSearches: { title: string; location: string }[] = [];

export function recordUserJobSearch(title: string, location: string) {
  recentUserSearches.unshift({ title, location });
  if (recentUserSearches.length > 50) recentUserSearches = recentUserSearches.slice(0, 50);
}

export async function fetchSmartJobsFromInternet() {
  // Prioritize recent user searches, then trending, then fallback
  const jobTitleQueue = [
    ...recentUserSearches.map(s => s.title),
    ...trendingJobTitles
  ];
  const locationQueue = [
    ...recentUserSearches.map(s => s.location),
    ...trendingLocations
  ];
  const seen = new Set();
  let jobs: any[] = [];

  for (const title of jobTitleQueue) {
    for (const location of locationQueue) {
      if (jobs.length >= 1000) break;
      const res = await fetchJobsFromRapidAPIPost({
        search_term: title,
        location,
        results_wanted: 20,
        site_name: ["indeed", "linkedin", "zip_recruiter", "glassdoor"],
        distance: 50,
        job_type: "fulltime",
        is_remote: false,
        linkedin_fetch_description: false,
        hours_old: 24 // Prefer freshest jobs
      });
      if (res && Array.isArray(res.jobs)) {
        for (const job of res.jobs) {
          const uniqueKey = job.job_id || job.url || job.title + job.company + job.location;
          if (!seen.has(uniqueKey)) {
            seen.add(uniqueKey);
            jobs.push(job);
            if (jobs.length >= 1000) break;
          }
        }
      }
    }
    if (jobs.length >= 1000) break;
  }
  return jobs;
}