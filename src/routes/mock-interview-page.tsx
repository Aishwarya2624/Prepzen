import { useAuth } from "@/contexts/AuthContext";
import { interviewService } from "@/lib/api-service";
import { QuestionSection } from "@/components/question-section";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { toast } from "sonner";
import type { Interview } from "@/types";

export const MockInterviewPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { id: interviewId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<Interview | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const fetchInterview = async () => {
      if (!interviewId || !user) {
        toast.error("Error", { description: "Missing user or interview ID." });
        navigate("/dashboard");
        return;
      }

      setLoading(true);
      try {
        const response = await interviewService.getById(interviewId);
        const data = response.data;
        
        if (!data) {
          toast.error("Interview not found");
          navigate("/dashboard");
          return;
        }
        
        setInterview(data);
        
      } catch (error) {
        console.error("Error fetching interview:", error);
        toast.error("Failed to fetch interview");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId, user, authLoading, navigate]);

  if (loading || authLoading) {
    return <LoaderPage />;
  }

  if (!interview) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Interview Not Available</h2>
        <p className="text-muted-foreground">The interview data could not be loaded.</p>
      </div>
    );
  }

  if (!interview.questions || interview.questions.length === 0) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Questions Not Ready</h2>
        <p className="text-muted-foreground">The interview questions have not been generated for this session.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{interview.position} Interview</h1>
        <p className="text-muted-foreground">Answer the questions below to complete your mock interview.</p>
      </div>
      {/* Corrected: Removed the unnecessary interviewId prop */}
      <QuestionSection questions={interview.questions} />
    </div>
  );
};