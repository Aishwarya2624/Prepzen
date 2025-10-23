import { Outlet, Route, Routes } from "react-router-dom";
import { Container } from "@/components/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const InterviewPrepPage = () => (
  <Container className="py-8">
    <h1 className="text-3xl font-bold mb-6">Interview Preparation</h1>
    <p className="text-lg mb-8">
      Our comprehensive interview preparation services help you ace your next job interview.
    </p>
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mock Interviews</CardTitle>
          <CardDescription>Practice with AI-powered mock interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our AI-powered mock interviews simulate real interview scenarios, providing you with valuable feedback and insights to improve your performance.
          </p>
          <Link to="/generate" className="text-blue-600 hover:underline">Try Mock Interview →</Link>
        </CardContent>
      </Card>
    </div>
  </Container>
);

const CareerCoachingPage = () => (
  <Container className="py-8">
    <h1 className="text-3xl font-bold mb-6">Career Coaching</h1>
    <p className="text-lg mb-8">
      Get personalized career guidance and coaching to help you achieve your professional goals.
    </p>
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>This feature is under development</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            We're working hard to bring you personalized career coaching services. Check back soon!
          </p>
        </CardContent>
      </Card>
    </div>
  </Container>
);

const ResumeBuildingPage = () => (
  <Container className="py-8">
    <h1 className="text-3xl font-bold mb-6">Resume Building</h1>
    <p className="text-lg mb-8">
      Create a standout resume that gets you noticed by employers and ATS systems.
    </p>
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ATS Resume Checker</CardTitle>
          <CardDescription>Optimize your resume for Applicant Tracking Systems</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our ATS Resume Checker analyzes your resume against job descriptions to ensure it passes through Applicant Tracking Systems and reaches human recruiters.
          </p>
          <Link to="/upload" className="text-blue-600 hover:underline">Check Your Resume →</Link>
        </CardContent>
      </Card>
    </div>
  </Container>
);

const ServicesOverviewPage = () => (
  <Container className="py-8">
    <h1 className="text-3xl font-bold mb-6">Our Services</h1>
    <p className="text-lg mb-8">
      We offer a range of services to help you succeed in your job search and career development.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Interview Preparation</CardTitle>
          <CardDescription>Ace your next interview</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Practice with AI-powered mock interviews and get personalized feedback to improve your interview skills.
          </p>
          <Link to="/services/interview-prep" className="text-blue-600 hover:underline">Learn More →</Link>
        </CardContent>
      </Card>
      
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Career Coaching</CardTitle>
          <CardDescription>Get personalized career guidance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Work with our career coaches to develop a personalized career plan and achieve your professional goals.
          </p>
          <Link to="/services/career-coaching" className="text-blue-600 hover:underline">Learn More →</Link>
        </CardContent>
      </Card>
      
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Resume Building</CardTitle>
          <CardDescription>Create a standout resume</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Get expert help with creating a resume that passes ATS systems and impresses recruiters.
          </p>
          <Link to="/services/resume-building" className="text-blue-600 hover:underline">Learn More →</Link>
        </CardContent>
      </Card>
    </div>
  </Container>
);

const ServicesPage = () => {
  return (
    <Routes>
      <Route index element={<ServicesOverviewPage />} />
      <Route path="interview-prep" element={<InterviewPrepPage />} />
      <Route path="career-coaching" element={<CareerCoachingPage />} />
      <Route path="resume-building" element={<ResumeBuildingPage />} />
    </Routes>
  );
};

export default ServicesPage;