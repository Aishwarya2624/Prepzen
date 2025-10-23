import type { Interview } from "@/types";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { TooltipButton } from "./tooltip-button";
import { Pencil, Play, Trash } from "lucide-react";
import { toast } from "sonner";
import { interviewService } from "@/lib/api-service"; 

interface InterviewPinProps {
  interview: Interview;
  onMockPage?: boolean;
  onDelete: (id: string) => void; 
}

export const InterviewPin = ({ interview, onMockPage, onDelete }: InterviewPinProps) => {
  const navigate = useNavigate();
  // const { user } = useAuth(); // This line was removed as 'user' is not used

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this interview?")) {
      return;
    }

    try {
      await interviewService.delete(interview.id);
      
      toast.success("Interview deleted", {
        description: "The interview has been successfully removed.",
      });

      onDelete(interview.id);

    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Deletion failed", {
        description: "Failed to delete the interview. Please try again.",
      });
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-4 shadow-sm transition-all duration-150 ease-in-out hover:shadow-md",
        onMockPage && "border-none shadow-none hover:shadow-none"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">{interview.position}</h3>
          <p className="text-sm text-muted-foreground">
            {interview.createdAt
              ? new Date(interview.createdAt).toLocaleDateString("en-US", {
                  year: 'numeric', month: 'long', day: 'numeric'
                })
              : "Date not available"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <TooltipButton
            onClick={() => navigate(`/generate/interview/${interview.id}`)}
            content="Take Interview"
            icon={<Play className="h-4 w-4" />}
          />
          <TooltipButton
            onClick={() => navigate(`/generate/edit/${interview.id}`)}
            content="Edit Interview"
            icon={<Pencil className="h-4 w-4" />}
          />
          <TooltipButton
            onClick={handleDelete}
            content="Delete Interview"
            icon={<Trash className="h-4 w-4" />}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {interview.questions && interview.questions.length > 0 ? (
          interview.questions.map((_, index) => (
            <div
              key={index}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium"
            >
              Question {index + 1}
            </div>
          ))
        ) : (
          <div className="w-full">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="text-xs text-muted-foreground">Generating questions...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};