import jsPDF from 'jspdf';
import { getTemplateById } from '../data/resumeTemplates';

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    linkedin?: string;
    github?: string;
  };
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
  skills: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies: string;
    link?: string;
  }>;
}

export const generateResumePDF = (data: ResumeData, templateId: string = 'modern-1'): void => {
  const template = getTemplateById(templateId);
  const pdf = new jsPDF('p', 'pt', 'a4'); // Use points for better precision
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin + 20;

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 37, g: 99, b: 235 }; // Default blue
  };

  // Helper function to add text with proper word wrapping and spacing
  const addWrappedText = (
    text: string, 
    x: number, 
    y: number, 
    maxWidth: number, 
    fontSize: number = 11,
    lineHeight: number = 1.4
  ): number => {
    if (!text || text.trim() === '') return y;
    
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text.trim(), maxWidth);
    const lineSpacing = fontSize * lineHeight;
    
    lines.forEach((line: string, index: number) => {
      pdf.text(line, x, y + (index * lineSpacing));
    });
    
    return y + (lines.length * lineSpacing) + (fontSize * 0.5); // Add extra spacing after text block
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number): number => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      return margin + 20;
    }
    return yPosition;
  };

  // Helper function to add section header
  const addSectionHeader = (title: string, color: any): number => {
    yPosition = checkPageBreak(60);
    
    // Add some space before section
    yPosition += 20;
    
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title.toUpperCase(), margin, yPosition); 
};
