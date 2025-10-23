import { useEffect } from "react"; // Corrected: useState removed
import { useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { toast } from "sonner";
import { interviewService } from "@/lib/api-service";
import { useAuth } from "@/contexts/AuthContext";

export const MockLoadPage = () => {
  const { id: interviewId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  useEffect(() => {
    if (authLoading) {
      return;
    }

    const fetchInterviewAndRedirect = async () => {
      if (!user) {
        toast.error("Authentication Error", {
          description: "You must be logged in to start an interview."
        });
        navigate("/sign-in");
        return;
      }
      
      if (!interviewId) {
        toast.error("Error", { description: "Interview ID is missing." });
        navigate("/dashboard");
        return;
      }

      try {
        const response = await interviewService.getById(interviewId);
        const interviewData = response.data;

        if (!interviewData) {
          toast.error("Interview not found", {
             description: "We couldn't find the interview you're looking for."
          });
          navigate("/dashboard");
          return;
        }

        navigate(`/generate/interview/${interviewData.id}/start`);

      } catch (error) {
        console.error("Error fetching interview:", error);
        toast.error("Failed to load interview", {
          description: "There was a problem fetching the interview data.",
        });
        navigate("/dashboard");
      }
    };

    fetchInterviewAndRedirect();
  }, [interviewId, user, authLoading, navigate]);

  return <LoaderPage />;
};