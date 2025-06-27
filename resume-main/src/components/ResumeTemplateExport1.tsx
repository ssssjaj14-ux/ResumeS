import React from 'react';

interface ResumeTemplateExport1Props {
  preview?: boolean;
}

const ResumeTemplateExport1: React.FC<ResumeTemplateExport1Props> = ({ preview }) => {
  const name = 'John DOE';
  const title = 'Software Developer';
  const email = 'johndoe@email.com';
  const phone = '0123456789';
  const location = 'New York, USA';
  const summary = "Hi my name is John Doe. I'm just about the most boring type of person you could possibly imagine like collecting leaves from the tree in my backyard and documenting each time I eat a peanut that is non-uniform. I am not a robot. Please hire me.";
  const experience = [
    { title: 'Developer @ CompanyA', period: 'Jan 2016 - Present', description: 'Programming and watching cute cat videos' },
    { title: 'Frontend Developer @ CompanyB', period: 'Jan 2015 - Dec 2015', description: 'Collecting leaves from the tree in my backyard' },
    { title: 'Trainee @ CompanyC', period: 'Mar 2014 - Dec 2014', description: 'Making coffee and baking cookies' },
  ];
  const education = [
    { degree: 'MSc Computer Science', school: 'NYU', period: '2012 - 2014' },
    { degree: 'BSc Computer Science', school: 'NYU', period: '2008 - 2012' },
  ];
  const skills = ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Angular', 'TypeScript'];

  return (
    <div
      className={`resume-template1 ${preview ? 'preview' : ''}`}
      style={{
        fontFamily: 'Inter, Arial, sans-serif',
        maxWidth: preview ? 300 : 900,
        minHeight: preview ? 425 : 1100,
        background: '#fff',
        borderRadius: 12,
        boxShadow: preview ? '0 2px 8px #eee' : '0 4px 24px #ddd',
        border: preview ? '1px solid #eee' : 'none',
        padding: preview ? 18 : 48,
        fontSize: preview ? 11 : 18,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: preview ? 10 : 24,
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: preview ? 10 : 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
          <h1 style={{ color: '#2563EB', fontSize: preview ? 22 : 38, fontWeight: 800, margin: 0, wordBreak: 'break-word' }}>{name}</h1>
          <div style={{ color: '#222', fontSize: preview ? 12 : 20, fontWeight: 500 }}>{title}</div>
          <div style={{ color: '#555', fontSize: preview ? 10 : 15, marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span>{email}</span>
            <span>|</span>
            <span>{phone}</span>
            <span>|</span>
            <span>{location}</span>
          </div>
        </div>
        <div style={{ borderBottom: '3px solid #2563EB', marginTop: preview ? 8 : 16, width: '100%' }} />
      </header>

      {/* Main Content */}
      <main style={{ display: 'flex', flexDirection: preview ? 'column' : 'row', gap: preview ? 10 : 32, flex: 1 }}>
        {/* Left: Summary, Experience */}
        <section style={{ flex: 2, minWidth: 0 }}>
          <div style={{ marginBottom: preview ? 8 : 18 }}>
            <h2 style={{ color: '#2563EB', fontSize: preview ? 14 : 22, fontWeight: 700, margin: 0, marginBottom: 4 }}>About Me</h2>
            <div style={{ color: '#222', fontSize: preview ? 10 : 16, lineHeight: 1.5, wordBreak: 'break-word' }}>{summary}</div>
          </div>
          <div style={{ marginBottom: preview ? 8 : 18 }}>
            <h2 style={{ color: '#2563EB', fontSize: preview ? 14 : 22, fontWeight: 700, margin: 0, marginBottom: 4 }}>Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: preview ? 6 : 12 }}>
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: preview ? 11 : 17, color: '#222', wordBreak: 'break-word' }}>{exp.title}</div>
                  <div style={{ color: '#888', fontSize: preview ? 9 : 14 }}>{exp.period}</div>
                  <div style={{ color: '#444', fontSize: preview ? 10 : 15, wordBreak: 'break-word' }}>{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Right: Skills, Education */}
        <aside style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: preview ? 8 : 18 }}>
          <div>
            <h2 style={{ color: '#2563EB', fontSize: preview ? 14 : 22, fontWeight: 700, margin: 0, marginBottom: 4 }}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: preview ? 4 : 8 }}>
              {skills.map(skill => (
                <span key={skill} style={{ background: '#e0e7ff', color: '#2563EB', borderRadius: 8, padding: preview ? '2px 6px' : '6px 14px', fontSize: preview ? 9 : 15, fontWeight: 600, marginBottom: 4 }}>{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <h2 style={{ color: '#2563EB', fontSize: preview ? 14 : 22, fontWeight: 700, margin: 0, marginBottom: 4 }}>Education</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: preview ? 6 : 12 }}>
              {education.map((edu, i) => (
                <div key={i}>
                  <div style={{ fontWeight: 700, fontSize: preview ? 11 : 16, color: '#222', wordBreak: 'break-word' }}>{edu.degree}</div>
                  <div style={{ color: '#888', fontSize: preview ? 9 : 14 }}>{edu.school} | {edu.period}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ResumeTemplateExport1; 