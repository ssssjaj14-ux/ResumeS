// src/services/jobStorageService.ts
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
  url: string;
  logo: string;
  remote: boolean;
  skills: string[];
  application_link?: string;
  created_at: string;
  updated_at: string;
  source: "api" | "admin";
}

export interface JobFilters {
  location?: string;
  type?: string;
  experience?: string;
  remote?: boolean;
  skills?: string[];
}

// -----------------------------
// Constants
// -----------------------------
const STORAGE_KEY = "careerpanda_jobs";
const ADMIN_SESSION_KEY = "careerpanda_admin_session";
const ADMIN_PASSCODE = "723899";

// -----------------------------
// Job Storage Service (Singleton)
// -----------------------------
export class JobStorageService {
  private static instance: JobStorageService;
  private jobs: Job[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): JobStorageService {
    if (!JobStorageService.instance) {
      JobStorageService.instance = new JobStorageService();
    }
    return JobStorageService.instance;
  }

  // -----------------------------
  // Storage Management
  // -----------------------------
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.jobs = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading jobs from storage:", error);
      this.jobs = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.jobs));
    } catch (error) {
      console.error("Error saving jobs to storage:", error);
    }
  }

  // -----------------------------
  // Public Methods
  // -----------------------------
  public getAllJobs(): Job[] {
    return [...this.jobs];
  }

  public getFilteredJobs(query: string = "", filters: JobFilters = {}): Job[] {
    let filteredJobs = [...this.jobs];

    // Search
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredJobs = filteredJobs.filter((job) => {
        const searchableText = `${job.title} ${job.company} ${job.description} ${job.skills.join(" ")}`.toLowerCase();
        return searchableText.includes(searchTerm);
      });
    }

    // Location
    if (filters.location) {
      filteredJobs = filteredJobs.filter((job) =>
        job.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Type
    if (filters.type) {
      filteredJobs = filteredJobs.filter((job) => job.type === filters.type);
    }

    // Experience
    if (filters.experience) {
      filteredJobs = filteredJobs.filter((job) =>
        job.experience.toLowerCase().includes(filters.experience!.toLowerCase())
      );
    }

    // Remote
    if (filters.remote !== undefined) {
      filteredJobs = filteredJobs.filter((job) => job.remote === filters.remote);
    }

    // Skills
    if (filters.skills && filters.skills.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        filters.skills!.some((skill) =>
          job.skills.some((jobSkill) => jobSkill.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }

    return filteredJobs;
  }

  public getJobById(id: string): Job | null {
    return this.jobs.find((job) => job.id === id) || null;
  }

  // -----------------------------
  // API Sync
  // -----------------------------
  public syncJobsFromAPI(apiJobs: any[]): void {
    const normalizedJobs = this.normalizeAPIJobs(apiJobs);

    // Keep admin jobs, replace API jobs
    this.jobs = this.jobs.filter((job) => job.source === "admin");
    this.jobs.push(...normalizedJobs);

    this.saveToStorage();
  }

  // -----------------------------
  // Admin CRUD
  // -----------------------------
  public addJob(jobData: Omit<Job, "id" | "created_at" | "updated_at" | "source">): Job {
    const newJob: Job = {
      ...jobData,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source: "admin",
    };

    this.jobs.unshift(newJob);
    this.saveToStorage();
    return newJob;
  }

  public updateJob(id: string, updates: Partial<Job>): Job | null {
    const index = this.jobs.findIndex((job) => job.id === id);
    if (index === -1) return null;

    this.jobs[index] = {
      ...this.jobs[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    this.saveToStorage();
    return this.jobs[index];
  }

  public deleteJob(id: string): boolean {
    const initialLength = this.jobs.length;
    this.jobs = this.jobs.filter((job) => job.id !== id);

    if (this.jobs.length < initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public deleteJobs(ids: string[]): number {
    const initialLength = this.jobs.length;
    this.jobs = this.jobs.filter((job) => !ids.includes(job.id));

    const deletedCount = initialLength - this.jobs.length;
    if (deletedCount > 0) this.saveToStorage();

    return deletedCount;
  }

  public deleteAllJobs(): number {
    const deletedCount = this.jobs.length;
    this.jobs = [];
    this.saveToStorage();
    return deletedCount;
  }

  // -----------------------------
  // Statistics
  // -----------------------------
  public getJobStats() {
    const total = this.jobs.length;
    const apiJobs = this.jobs.filter((job) => job.source === "api").length;
    const adminJobs = this.jobs.filter((job) => job.source === "admin").length;
    const remoteJobs = this.jobs.filter((job) => job.remote).length;

    const companies = new Set(this.jobs.map((job) => job.company)).size;
    const locations = new Set(this.jobs.map((job) => job.location)).size;

    return { total, apiJobs, adminJobs, remoteJobs, companies, locations };
  }

  // -----------------------------
  // Admin Authentication
  // -----------------------------
  public static authenticateAdmin(passcode: string): boolean {
    if (passcode === ADMIN_PASSCODE) {
      localStorage.setItem(ADMIN_SESSION_KEY, "true");
      return true;
    }
    return false;
  }

  public static isAdminAuthenticated(): boolean {
    return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
  }

  public static logoutAdmin(): void {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }

  // -----------------------------
  // Helpers
  // -----------------------------
  private generateId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private normalizeAPIJobs(apiJobs: any[]): Job[] {
    return apiJobs.map((job: any, index: number) => ({
      id: job.id || `api_job_${Date.now()}_${index}`,
      title: job.title || "Job Position",
      company: job.company || "Company",
      location: job.location || "Location",
      type: job.job_type || job.type || "full-time",
      experience: job.experience || job.experience_level || "Not specified",
      salary: job.salary || job.salary_range || "Competitive",
      description: job.description || "No description available",
      requirements: job.requirements || job.skills || [],
      posted: job.created_at ? this.formatDate(job.created_at) : "Recently",
      url: job.application_link || job.url || "#",
      logo: job.logo || job.company_logo || "",
      remote: job.remote || job.is_remote || false,
      skills: job.skills || job.requirements || [],
      application_link: job.application_link,
      created_at: job.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source: "api",
    }));
  }

  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return `${Math.ceil(diffDays / 30)} months ago`;
    } catch {
      return "Recently";
    }
  }
}

// -----------------------------
// Export Singleton
// -----------------------------
export const jobStorage = JobStorageService.getInstance();
