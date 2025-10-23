import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '@/components/container';
import type { Feedback, ResumeData } from '../types';
import Summary from '@/components/summary';
import ATS from '@/components/ats';
import Details from '@/components/details';

const Resume = () => {
  const { id } = useParams<{ id: string }>();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResume = async () => {
      if (!id) return;

      try {
        // Load data from localStorage (demo implementation)
        // In production, fetch from your backend API
        const storedData = localStorage.getItem(`resume:${id}`);
        
        if (!storedData) {
          console.error('Resume data not found');
          setLoading(false);
          return;
        }

        const data = JSON.parse(storedData) as ResumeData;
        setResumeData(data);
      } catch (error) {
        console.error('Error loading resume data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resume analysis...</p>
        </div>
      </div>
    );
  }

  if (!resumeData || !resumeData.feedback) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Resume Not Found</h1>
          <p className="text-muted-foreground mb-6">The resume analysis you're looking for doesn't exist.</p>
          <Link 
            to="/upload" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Analyze New Resume
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <Container>
          <div className="flex items-center justify-between py-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Homepage</span>
            </Link>
            
            <div className="text-sm text-muted-foreground">
              Analysis for {resumeData.jobTitle} at {resumeData.companyName}
            </div>
          </div>
        </Container>
      </nav>

      {/* Main Content */}
      <Container>
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         {/* Resume Preview */}
             <div className="lg:col-span-1">
               <div className="bg-card rounded-lg shadow-md p-6 sticky top-8 border">
                 <h2 className="text-xl font-bold mb-4 text-foreground">Resume Preview</h2>
                 <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                   <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                     <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                   </div>
                   <p className="text-sm text-muted-foreground">
                     Resume uploaded successfully
                   </p>
                   <p className="text-xs text-muted-foreground mt-1">
                     {resumeData.resumePath.split('/').pop()}
                   </p>
                 </div>
               </div>
             </div>

            {/* Analysis Results */}
            <div className="lg:col-span-2 space-y-6">
                             <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Resume Review</h1>
                 <p className="text-muted-foreground">
                   Comprehensive analysis of your resume against the job requirements
                 </p>
               </div>

              <Summary feedback={resumeData.feedback} />
              <ATS score={resumeData.feedback.ATS.score} suggestions={resumeData.feedback.ATS.tips} />
              <Details feedback={resumeData.feedback} />

                             {/* Action Buttons */}
               <div className="bg-card rounded-lg shadow-md p-6 border">
                 <h3 className="text-lg font-semibold mb-4 text-foreground">Next Steps</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    to="/upload" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium text-center"
                  >
                    Analyze Another Resume
                  </Link>
                  <Link 
                    to="/generate" 
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium text-center"
                  >
                    Practice Interview
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Resume; 