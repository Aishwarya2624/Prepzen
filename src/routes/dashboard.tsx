import { Headings } from "@/components/headings";
import { InterviewPin } from "@/components/pin";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Interview } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { interviewService } from "@/lib/api-service"; 

export const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true); 
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchInterviews = async () => {
      try {
        const response = await interviewService.getAll();
        setInterviews(response.data || []);
      } catch (error) {
        console.error("Error fetching interviews:", error);
        toast.error("Failed to load interviews", {
          description: "Could not fetch your data. Please try refreshing the page.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [userId]); 

  // This function will be passed to the InterviewPin component
  const handleDeleteInterview = (idToDelete: string) => {
    // Filter out the deleted interview from the state to update the UI instantly
    setInterviews((prevInterviews) =>
      prevInterviews.filter((interview) => interview.id !== idToDelete)
    );
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Headings
          title="Dashboard"
          description="Create and start your AI Mock interview"
        />
        <Link to={"/generate/create"}>
          <Button size={"sm"}>
            <Plus /> Add New
          </Button>
        </Link>
      </div>

      <Separator className="my-8" />
      
      <div className="md:grid md:grid-cols-3 gap-3 py-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 md:h-32 rounded-md" />
          ))
        ) : interviews.length > 0 ? (
          interviews.map((interview) => (
            // Pass the handleDeleteInterview function as the onDelete prop
            <InterviewPin 
              key={interview.id} 
              interview={interview} 
              onDelete={handleDeleteInterview} 
            />
          ))
        ) : (
          <div className="md:col-span-3 w-full flex flex-grow items-center justify-center h-96 flex-col">
            <img
              src="/assets/svg/not-found.svg"
              className="w-44 h-44 object-contain"
              alt="No data found"
            />
            <h2 className="text-lg font-semibold text-muted-foreground">
              No Interviews Found
            </h2>
            <p className="w-full md:w-96 text-center text-sm text-muted-foreground mt-4">
              You haven't created any mock interviews yet. Click the button below to get started!
            </p>
            <Link to={"/generate/create"} className="mt-4">
              <Button size={"sm"}>
                <Plus className="min-w-5 min-h-5 mr-1" />
                Add New Interview
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};