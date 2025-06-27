import { saveAs } from 'file-saver';

export interface PortfolioData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    linkedin?: string;
    github?: string;
  };
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link?: string;
    image?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
}

export const generatePortfolioHTML = (data: PortfolioData, template: string = 'modern'): string => {
  const templateStyles = {
    modern: {
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      backgroundColor: '#F8FAFC',
      textColor: '#1E293B',
      cardBackground: '#FFFFFF'
    },
    creative: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#EC4899',
      backgroundColor: '#0F0F23',
      textColor: '#F1F5F9',
      cardBackground: '#1E1E3F'
    },
    developer: {
      primaryColor: '#10B981',
      secondaryColor: '#06B6D4',
      backgroundColor: '#111827',
      textColor: '#F9FAFB',
      cardBackground: '#1F2937'
    }
  };

  const theme = templateStyles[template as keyof typeof templateStyles] || templateStyles.modern;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: ${theme.backgroundColor};
            color: ${theme.textColor};
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .hero {
            background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});
            padding: 100px 0;
            text-align: center;
            color: white;
        }
        
        .hero h1 {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 1rem;
            animation: fadeInUp 1s ease-out;
        }
        
        .hero p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto 2rem;
            animation: fadeInUp 1s ease-out 0.2s both;
        }
        
        .contact-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
            animation: fadeInUp 1s ease-out 0.4s both;
        }
        
        .contact-links a {
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50px;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .contact-links a:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .section {
            padding: 80px 0;
        }
        
        .section h2 {
            font-size: 2.5rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 3rem;
            background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        
        .skill-tag {
            background: ${theme.cardBackground};
            padding: 1.5rem;
            border-radius: 16px;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .skill-tag:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .project-card {
            background: ${theme.cardBackground};
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border: 1px solid rgba(255,255,255,0.1);
            overflow: hidden;
            position: relative;
        }
        
        .project-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});
        }
        
        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        
        .project-card h3 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: ${theme.primaryColor};
        }
        
        .project-card p {
            margin-bottom: 1.5rem;
            opacity: 0.8;
            line-height: 1.6;
        }
        
        .tech-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }
        
        .tech-tag {
            background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});
            color: white;
            padding: 0.4rem 1rem;
            border-radius: 25px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        
        .project-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: ${theme.primaryColor};
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            padding: 0.5rem 1rem;
            border: 2px solid ${theme.primaryColor};
            border-radius: 25px;
        }
        
        .project-link:hover {
            background: ${theme.primaryColor};
            color: white;
            transform: translateX(5px);
        }
        
        .experience-timeline {
            position: relative;
            margin-top: 2rem;
        }
        
        .experience-item {
            background: ${theme.cardBackground};
            padding: 2.5rem;
            border-radius: 20px;
            margin-bottom: 2rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-left: 5px solid ${theme.primaryColor};
            transition: all 0.3s ease;
        }
        
        .experience-item:hover {
            transform: translateX(10px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }
        
        .experience-item h3 {
            font-size: 1.4rem;
            font-weight: 700;
            color: ${theme.primaryColor};
            margin-bottom: 0.5rem;
        }
        
        .experience-item .company {
            font-weight: 600;
            font-size: 1.1rem;
            opacity: 0.8;
            margin-bottom: 0.5rem;
        }
        
        .experience-item .duration {
            font-size: 0.9rem;
            opacity: 0.7;
            margin-bottom: 1rem;
            padding: 0.25rem 0.75rem;
            background: ${theme.primaryColor}20;
            border-radius: 15px;
            display: inline-block;
        }
        
        .education-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .education-card {
            background: ${theme.cardBackground};
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border-top: 4px solid ${theme.secondaryColor};
        }
        
        .education-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .education-card h3 {
            font-size: 1.3rem;
            font-weight: 700;
            color: ${theme.secondaryColor};
            margin-bottom: 0.5rem;
        }
        
        .footer {
            background: ${theme.cardBackground};
            padding: 4rem 0;
            text-align: center;
            margin-top: 4rem;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        .footer p {
            opacity: 0.7;
            margin-bottom: 1rem;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .footer-links a {
            color: ${theme.primaryColor};
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.3s ease;
        }
        
        .footer-links a:hover {
            opacity: 0.7;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .hero p {
                font-size: 1rem;
            }
            
            .contact-links {
                flex-direction: column;
                align-items: center;
                gap: 1rem;
            }
            
            .projects-grid {
                grid-template-columns: 1fr;
            }
            
            .education-grid {
                grid-template-columns: 1fr;
            }
            
            .section {
                padding: 60px 0;
            }
            
            .section h2 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1>${data.personalInfo.name}</h1>
            <p>${data.personalInfo.summary}</p>
            <div class="contact-links">
                <a href="mailto:${data.personalInfo.email}">
                    <i class="fas fa-envelope"></i>
                    Email
                </a>
                <a href="tel:${data.personalInfo.phone}">
                    <i class="fas fa-phone"></i>
                    Call
                </a>
                ${data.personalInfo.linkedin ? `
                <a href="${data.personalInfo.linkedin}" target="_blank">
                    <i class="fab fa-linkedin"></i>
                    LinkedIn
                </a>
                ` : ''}
                ${data.personalInfo.github ? `
                <a href="${data.personalInfo.github}" target="_blank">
                    <i class="fab fa-github"></i>
                    GitHub
                </a>
                ` : ''}
                <a href="#" onclick="window.print()">
                    <i class="fas fa-download"></i>
                    Download
                </a>
            </div>
        </div>
    </section>

    ${data.skills.length > 0 ? `
    <section class="section">
        <div class="container">
            <h2>Skills & Expertise</h2>
            <div class="skills-grid">
                ${data.skills.map(skill => `
                    <div class="skill-tag">${skill}</div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${data.projects.length > 0 ? `
    <section class="section">
        <div class="container">
            <h2>Featured Projects</h2>
            <div class="projects-grid">
                ${data.projects.map(project => `
                    <div class="project-card">
                        <h3>${project.name}</h3>
                        <p>${project.description}</p>
                        ${project.technologies ? `
                        <div class="tech-tags">
                            ${project.technologies.split(',').map(tech => `
                                <span class="tech-tag">${tech.trim()}</span>
                            `).join('')}
                        </div>
                        ` : ''}
                        ${project.link ? `
                        <a href="${project.link}" target="_blank" class="project-link">
                            <i class="fas fa-external-link-alt"></i>
                            View Project
                        </a>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${data.experience.length > 0 ? `
    <section class="section">
        <div class="container">
            <h2>Work Experience</h2>
            <div class="experience-timeline">
                ${data.experience.map(exp => `
                    <div class="experience-item">
                        <h3>${exp.title}</h3>
                        <div class="company">${exp.company}</div>
                        <div class="duration">${exp.duration}</div>
                        <p>${exp.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${data.education.length > 0 ? `
    <section class="section">
        <div class="container">
            <h2>Education</h2>
            <div class="education-grid">
                ${data.education.map(edu => `
                    <div class="education-card">
                        <h3>${edu.degree}</h3>
                        <div class="company">${edu.institution}</div>
                        <div class="duration">${edu.year}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${data.personalInfo.name}. All rights reserved.</p>
            <p>Built with ResumeFlow - AI-Powered Resume & Portfolio Builder</p>
            <div class="footer-links">
                <a href="mailto:${data.personalInfo.email}">Contact</a>
                <a href="${data.personalInfo.linkedin || '#'}" target="_blank">LinkedIn</a>
                ${data.personalInfo.github ? `<a href="${data.personalInfo.github}" target="_blank">GitHub</a>` : ''}
            </div>
        </div>
    </footer>

    <script>
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Add scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.skill-tag, .project-card, .experience-item, .education-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    </script>
</body>
</html>`;
};

export const downloadPortfolio = (data: PortfolioData, template: string = 'modern'): void => {
  const htmlContent = generatePortfolioHTML(data, template);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const fileName = `${data.personalInfo.name.replace(/\s+/g, '_')}_Portfolio.html` || 'Portfolio.html';
  saveAs(blob, fileName);
};

export const generateGitHubPages = (data: PortfolioData, template: string = 'modern'): string => {
  const htmlContent = generatePortfolioHTML(data, template);
  
  // Instructions for GitHub Pages deployment
  const instructions = `
# GitHub Pages Deployment Instructions

1. Create a new repository on GitHub named: ${data.personalInfo.name.toLowerCase().replace(/\s+/g, '-')}-portfolio
2. Clone the repository to your local machine
3. Create an 'index.html' file with the generated content
4. Commit and push the changes
5. Go to repository Settings > Pages
6. Select 'Deploy from a branch' and choose 'main' branch
7. Your portfolio will be live at: https://yourusername.github.io/${data.personalInfo.name.toLowerCase().replace(/\s+/g, '-')}-portfolio

Generated HTML content is ready to use!
`;

  // Create a zip-like structure information
  console.log('Portfolio generated successfully!');
  console.log(instructions);
  
  return htmlContent;
};