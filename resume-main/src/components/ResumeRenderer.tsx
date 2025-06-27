import React from 'react';

interface ResumeRendererProps {
  data: any;
}

const sectionTitleStyle: React.CSSProperties = {
  color: '#2563EB',
  fontSize: 22,
  fontWeight: 700,
  marginTop: 32,
  marginBottom: 8,
  letterSpacing: 1,
};

const ResumeRenderer: React.FC<ResumeRendererProps> = ({ data }) => {
  if (!data) return <div>No data loaded.</div>;
  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', maxWidth: 800, margin: '40px auto', background: '#fff', padding: 40, borderRadius: 16, boxShadow: '0 4px 32px #0001' }}>
      {/* Header */}
      <div style={{ borderBottom: '3px solid #2563EB', paddingBottom: 16, marginBottom: 24 }}>
        <h1 style={{ color: '#2563EB', fontSize: 38, fontWeight: 800, margin: 0 }}>{data.personalInfo?.name || 'Your Name'}</h1>
        <div style={{ color: '#333', fontSize: 15, marginTop: 8 }}>
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo?.email && data.personalInfo?.phone && ' | '}
          {data.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
          {(data.personalInfo?.email || data.personalInfo?.phone) && data.personalInfo?.location && ' | '}
          {data.personalInfo?.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo?.summary && (
        <>
          <div style={sectionTitleStyle}>Professional Summary</div>
          <div style={{ color: '#222', fontSize: 16, marginBottom: 12 }}>{data.personalInfo.summary}</div>
        </>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <>
          <div style={sectionTitleStyle}>Work Experience</div>
          {data.experience.map((exp: any, i: number) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#2563EB' }}>{exp.title}</div>
              <div style={{ fontWeight: 500, color: '#444', fontSize: 15 }}>{exp.company} {exp.duration && <span style={{ color: '#888', fontWeight: 400 }}>| {exp.duration}</span>}</div>
              <div style={{ color: '#222', fontSize: 15 }}>{exp.description}</div>
            </div>
          ))}
        </>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <>
          <div style={sectionTitleStyle}>Education</div>
          {data.education.map((edu: any, i: number) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#2563EB' }}>{edu.degree}</div>
              <div style={{ fontWeight: 500, color: '#444', fontSize: 15 }}>{edu.institution} {edu.year && <span style={{ color: '#888', fontWeight: 400 }}>| {edu.year}</span>} {edu.gpa && <span style={{ color: '#888', fontWeight: 400 }}>| GPA: {edu.gpa}</span>}</div>
            </div>
          ))}
        </>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <>
          <div style={sectionTitleStyle}>Skills</div>
          <div style={{ color: '#222', fontSize: 15, marginBottom: 12 }}>{data.skills.join(' • ')}</div>
        </>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <>
          <div style={sectionTitleStyle}>Projects</div>
          {data.projects.map((proj: any, i: number) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#2563EB' }}>{proj.name}</div>
              <div style={{ color: '#222', fontSize: 15 }}>{proj.description}</div>
              {proj.technologies && <div style={{ color: '#888', fontSize: 14 }}>Tech: {proj.technologies}</div>}
              {proj.link && <div><a href={proj.link} style={{ color: '#2563EB', fontSize: 14 }}>{proj.link}</a></div>}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ResumeRenderer; 