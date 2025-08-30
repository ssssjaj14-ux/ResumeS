import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, FileText, Briefcase, TrendingUp } from 'lucide-react';
import { analyzeResumeWithGemini, getJobRecommendationsWithAI } from '../services/geminiService';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface AIAssistantProps {
  resumeData?: any;
  isLoggedIn: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ resumeData, isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm Panda AI 🐼, your career assistant. I can help you analyze your resume, find jobs, and provide career advice. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    {
      icon: FileText,
      label: "Analyze Resume",
      action: () => handleQuickAction("analyze-resume")
    },
    {
      icon: Briefcase,
      label: "Find Jobs",
      action: () => handleQuickAction("find-jobs")
    },
    {
      icon: TrendingUp,
      label: "Career Tips",
      action: () => handleQuickAction("career-tips")
    }
  ];

  const handleQuickAction = async (action: string) => {
    let message = '';
    switch (action) {
      case 'analyze-resume':
        message = 'Please analyze my resume and provide feedback';
        break;
      case 'find-jobs':
        message = 'Help me find jobs that match my skills';
        break;
      case 'career-tips':
        message = 'Give me some career advancement tips';
        break;
    }
    
    if (message) {
      await handleSendMessage(message);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      let response = '';

      // Handle different types of queries
      if (text.toLowerCase().includes('analyze') || text.toLowerCase().includes('resume')) {
        if (resumeData) {
          const analysis = await analyzeResumeWithGemini(resumeData);
          response = `🎯 **Resume Analysis Complete!**\n\n**ATS Score:** ${analysis.atsScore}/100\n\n**Strengths:**\n${analysis.strengths.map(s => `• ${s}`).join('\n')}\n\n**Areas for Improvement:**\n${analysis.weaknesses.map(w => `• ${w}`).join('\n')}\n\n**Recommendations:**\n${analysis.suggestions.map(s => `• ${s}`).join('\n')}`;
        } else {
          response = "I'd love to analyze your resume! Please create or upload a resume first using the Resume Builder section.";
        }
      } else if (text.toLowerCase().includes('job') || text.toLowerCase().includes('career')) {
        if (isLoggedIn && resumeData?.skills) {
          const jobs = await getJobRecommendationsWithAI(resumeData.skills);
          response = `💼 **Job Recommendations Based on Your Skills:**\n\n${jobs.slice(0, 5).map((job, i) => `${i + 1}. **${job.title}** at ${job.company}\n   📍 ${job.location} | 💰 ${job.salary}\n   🎯 Match: ${job.matchScore}%\n`).join('\n')}`;
        } else if (!isLoggedIn) {
          response = "To get personalized job recommendations, please log in to access the Career Portal!";
        } else {
          response = "I need your resume data to provide job recommendations. Please create a resume first!";
        }
      } else if (text.toLowerCase().includes('tip') || text.toLowerCase().includes('advice')) {
        response = `💡 **Career Success Tips:**\n\n• **Optimize your LinkedIn profile** - Use keywords from job descriptions\n• **Build a portfolio** - Showcase your best work and projects\n• **Network actively** - Connect with professionals in your field\n• **Keep learning** - Stay updated with industry trends\n• **Quantify achievements** - Use numbers to show your impact\n• **Practice interviewing** - Prepare for common questions\n• **Follow up** - Send thank-you notes after interviews`;
      } else {
        // General AI response
        response = await getAIResponse(text);
      }

      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1000);

    } catch (error) {
      console.error('AI Assistant error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm having trouble processing your request right now. Please try again or contact support if the issue persists.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const getAIResponse = async (query: string): Promise<string> => {
    // Simple rule-based responses for common queries
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      return "Hello! 👋 I'm Panda AI, your personal career assistant. I'm here to help you with resume analysis, job searching, and career advice. What would you like to work on today?";
    }
    
    if (lowerQuery.includes('help')) {
      return "I can help you with:\n\n🔍 **Resume Analysis** - Get ATS scores and improvement suggestions\n💼 **Job Matching** - Find opportunities that match your skills\n📈 **Career Advice** - Tips for professional growth\n📝 **Resume Building** - Guidance on creating effective resumes\n🎯 **Interview Prep** - Common questions and best practices\n\nWhat would you like to explore?";
    }
    
    if (lowerQuery.includes('salary') || lowerQuery.includes('pay')) {
      return "💰 **Salary Insights:**\n\nSalary ranges vary by role, experience, and location:\n• **Entry Level (0-2 years):** ₹3-8 LPA\n• **Mid Level (2-5 years):** ₹8-20 LPA\n• **Senior Level (5+ years):** ₹20-50 LPA\n• **Leadership Roles:** ₹50+ LPA\n\nFactors affecting salary:\n• Technical skills and certifications\n• Company size and industry\n• Location (metro vs non-metro)\n• Negotiation skills\n\nWould you like specific salary data for your field?";
    }
    
    return "That's an interesting question! I'm here to help with career-related topics like resume building, job searching, and professional development. Could you tell me more about what specific career help you're looking for?";
  };

  const formatMessage = (content: string) => {
    // Convert markdown-like formatting to JSX
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={index} className="font-bold text-blue-300 mb-1">{line.slice(2, -2)}</div>;
      }
      if (line.startsWith('• ')) {
        return <div key={index} className="ml-4 mb-1">• {line.slice(2)}</div>;
      }
      if (line.match(/^\d+\./)) {
        return <div key={index} className="mb-1">{line}</div>;
      }
      return line ? <div key={index} className="mb-1">{line}</div> : <div key={index} className="mb-2"></div>;
    });
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
      >
        <div className="relative">
          <div className="text-2xl">🐼</div>
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🐼</span>
                </div>
                <div>
                  <h3 className="font-bold">Panda AI</h3>
                  <p className="text-xs opacity-90">Your Career Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-xs hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <action.icon className="w-3 h-3" />
                    <span>{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <span className="text-sm">🐼</span>}
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md'
                    }`}>
                      <div className="text-sm whitespace-pre-line">
                        {typeof message.content === 'string' ? formatMessage(message.content) : message.content}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                      <span className="text-sm">🐼</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about your career..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <motion.button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  function formatMessage(content: string) {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={index} className="font-bold text-blue-600 dark:text-blue-400 mb-1">{line.slice(2, -2)}</div>;
      }
      if (line.startsWith('• ')) {
        return <div key={index} className="ml-4 mb-1">• {line.slice(2)}</div>;
      }
      if (line.match(/^\d+\./)) {
        return <div key={index} className="mb-1">{line}</div>;
      }
      return line ? <div key={index} className="mb-1">{line}</div> : <div key={index} className="mb-2"></div>;
    });
  }
};

export default AIAssistant;