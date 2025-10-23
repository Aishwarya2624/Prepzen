import { interviewService } from "@/lib/api-service"; // Updated import
import { FormMockInterview } from "@/components/form-mock-interview";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { Interview } from "@/types"; // Import the Interview type

export const CreateEditPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { id: interviewId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Default to true to show loader initially
  const [interview, setInterview] = useState<Interview | null>(null);

  useEffect(() => {
    // If there's no ID, it's a "create" page, so we don't need to fetch anything.
    if (!interviewId) {
      setLoading(false);
      return;
    }
    
    // Wait for auth to resolve
    if (authLoading) {
      return;
    }

    const fetchInterview = async () => {
      setLoading(true);
      try {
        const response = await interviewService.getById(interviewId);
        const data = response.data;

        if (!data) {
          toast.error("Interview not found");
          navigate("/dashboard");
          return;
        }

        // Security check: Make sure the logged-in user owns this interview
        // Note: Your backend should also enforce this rule!
        if (data.userId !== user?.id) {
          toast.error("Unauthorized", { description: "You don't have permission to edit this." });
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

  // Show a loader while we determine if we're fetching or creating
  if (loading || authLoading) {
    return <LoaderPage />;
  }

  // Render the form. If `interview` is null, the form will be in "create" mode.
  // If `interview` has data, the form will be in "edit" mode.
  return (
    <div className="container py-8">
      <FormMockInterview interview={interview} />
    </div>
  );
};