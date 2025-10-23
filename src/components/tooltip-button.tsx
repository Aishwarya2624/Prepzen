import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

type ButtonVariant =
  | "ghost"
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | null
  | undefined;

interface TooltipButtonProps {
  content: string;
  icon: React.ReactNode;
  onClick: () => void;
  buttonVariant?: ButtonVariant;
  buttonClassName?: string;
  delay?: number;
  disabled?: boolean; // Corrected from 'disbaled' to 'disabled'
  loading?: boolean;
}

export const TooltipButton = ({
  content,
  icon,
  onClick,
  buttonVariant = "ghost",
  buttonClassName = "",
  delay = 0,
  disabled = false, // Corrected from 'disbaled' to 'disabled'
  loading = false,
}: TooltipButtonProps) => {
  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger
          className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
          asChild // Add asChild to pass props to the Button
        >
          <Button
            size={"icon"}
            disabled={disabled} // Corrected from 'disbaled'
            variant={buttonVariant}
            className={buttonClassName}
            onClick={onClick}
          >
            {loading ? (
              <Loader className="min-w-4 min-h-4 animate-spin" />
            ) : (
              icon
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{loading ? "Loading..." : content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};