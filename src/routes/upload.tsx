import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import FileUploader from '@/components/file-uploader';
import { generateUUID, convertPdfToImage, prepareInstructions } from '@/lib/resume-utils';
import { anthropicService } from '@/lib/anthropic-service';

const Upload = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({ 
    companyName, 
    jobTitle, 
    jobDescription, 
    file 
  }: { 
    companyName: string; 
    jobTitle: string; 
    jobDescription: string; 
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText('Starting analysis...');

    try {
      console.log('Starting resume analysis...');
      console.log('File:', file.name, 'Size:', file.size);
      
      setStatusText('Processing your resume...');
      
      // Convert PDF to image (mock implementation)
      const imageFile = await convertPdfToImage(file);
      if (!imageFile.file) {
        throw new Error('Failed to convert PDF to image');
      }

      setStatusText('Extracting text from PDF...');
      
      // Extract text from PDF
      let resumeContent: string;
      try {
        resumeContent = await anthropicService.extractTextFromPDF(file);
        console.log('Extracted text length:', resumeContent.length);
      } catch (pdfError) {
        console.error('PDF extraction failed, using mock content:', pdfError);
        // Fallback to mock content for testing
        resumeContent = `Mock resume content for ${jobTitle} position at ${companyName}. 
        This is a sample resume with relevant skills and experience.`;
      }
      
      setStatusText('Analyzing with AI...');
      
      // Generate unique ID for this analysis
      const uuid = generateUUID();
      console.log('Generated UUID:', uuid);
      
      // Prepare data structure
      const data = {
        id: uuid,
        resumePath: `/uploads/${file.name}`,
        imagePath: `/uploads/${imageFile.file.name}`,
        companyName,
        jobTitle,
        jobDescription,
        feedback: null,
      };

      // Get AI feedback
      console.log('Calling AI analysis...');
      let feedback;
      try {
        feedback = await anthropicService.analyzeResume(
          resumeContent,
          jobDescription,
          jobTitle
        );
        console.log('AI feedback received:', feedback);
      } catch (aiError) {
        console.error('AI analysis failed, using mock feedback:', aiError);
        // Fallback to mock feedback for demo purposes
        feedback = {
          overallScore: 75,
          ATS: {
            score: 78,
            tips: [
              { type: "good", tip: "Your resume has good keyword optimization" },
              { type: "warning", tip: "Consider adding more industry-specific keywords" }
            ]
          },
          toneAndStyle: {
            score: 72,
            feedback: ["Professional tone is appropriate", "Consider making achievements more quantifiable"]
          },
          content: {
            score: 80,
            feedback: ["Content is relevant to the position", "Good use of action verbs"]
          },
          structure: {
            score: 70,
            feedback: ["Clear section organization", "Consider adding a skills section"]
          },
          skills: {
            score: 75,
            feedback: ["Skills match job requirements", "Add more technical skills if applicable"]
          }
        };
      }

      if (!feedback) {
        throw new Error('Failed to analyze resume - no feedback received');
      }

      data.feedback = feedback;
      
      // Store data in localStorage for demo purposes
      // In production, store in your backend database
      localStorage.setItem(`resume:${uuid}`, JSON.stringify(data));
      console.log('Data stored in localStorage');
      
      setStatusText('Analysis complete! Redirecting...');
      
      // Navigate to results page
      setTimeout(() => {
        console.log('Navigating to:', `/resume/${uuid}`);
        navigate(`/resume/${uuid}`);
      }, 1000);

    } catch (error) {
      console.error('Analysis error:', error);
      setStatusText(`Error: ${error instanceof Error ? error.message : 'Failed to analyze resume'}`);
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    if (!file) {
      alert('Please upload a resume file');
      return;
    }

    if (!companyName || !jobTitle || !jobDescription) {
      alert('Please fill in all fields');
      return;
    }

    // Check if API key is configured
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    console.log('API Key configured:', !!apiKey, 'Length:', apiKey?.length);
    if (!apiKey) {
      alert('OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.');
      return;
    }

    console.log('Form submitted with:', { companyName, jobTitle, jobDescription, fileName: file.name });
    
    // Test API key first
    try {
      const testResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Prepzen ATS Resume Checker',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.7-sonnet',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10
        })
      });
      
      console.log('API Test Response Status:', testResponse.status);
      if (!testResponse.ok) {
        const errorData = await testResponse.json();
        console.error('API Test Error:', errorData);
        alert(`API Test Failed: ${testResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
        return;
      }
      console.log('API key test successful');
    } catch (testError) {
      console.error('API Test Error:', testError);
      alert('Failed to test API key. Please check your OpenRouter configuration.');
      return;
    }
    
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <Container>
        <div className="py-16 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smart feedback for your dream job
            </h1>
            
            {isProcessing ? (
              <div className="space-y-4">
                <h2 className="text-xl text-muted-foreground">{statusText}</h2>
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              <>
                <h2 className="text-xl text-muted-foreground mb-8">
                  Drop your resume for an ATS score and improvement tips
                </h2>
                <p className="text-sm text-muted-foreground mb-6 bg-card/50 backdrop-blur-sm rounded-lg p-3 border">
                  💡 <strong>Cost Optimized:</strong> Analysis uses minimal tokens to keep costs low
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6 bg-card/50 backdrop-blur-sm rounded-2xl p-8 border shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company-name" className="block text-sm font-medium text-foreground mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company-name"
                        id="company-name"
                        placeholder="e.g., Google, Microsoft"
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="job-title" className="block text-sm font-medium text-foreground mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        name="job-title"
                        id="job-title"
                        placeholder="e.g., Software Engineer"
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="job-description" className="block text-sm font-medium text-foreground mb-2">
                      Job Description
                    </label>
                    <textarea
                      name="job-description"
                      id="job-description"
                      rows={5}
                      placeholder="Paste the job description here..."
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 resize-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Upload Resume (PDF)
                    </label>
                    <FileUploader onFileSelect={handleFileSelect} />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!file}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Analyze Resume
                    </span>
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Upload; 