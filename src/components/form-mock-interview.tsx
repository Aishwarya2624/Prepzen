import React, { useEffect, useState } from "react";
import type { JSX } from "react/jsx-runtime";
// --- Real Imports ---
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Assuming this is the correct path
import { interviewService } from "@/lib/api-service"; // Assuming this is the correct path
import { useParams } from "react-router-dom";
// --- CHANGE 1 START ---
// --- IMPORTANT: API Key Configuration ---
// Do NOT hard-code secrets in source. Load from environment variables.
// Supported env names (choose the one appropriate for your build): REACT_APP_OPENROUTER_API_KEY, OPENROUTER_API_KEY, VITE_OPENROUTER_API_KEY
// --- THIS IS THE NEW, CORRECT LINE ---
const openRouterApiKey: string = import.meta.env.VITE_OPENROUTER_API_KEY || "";

// --- Types ---
interface Interview {
  id?: string;
  position: string;
  description: string;
  experience: number;
  techStack: string;
  questions?: { question: string; answer: string }[];
}

type ToastOptions = { description?: string };

// --- Mock/Placeholder UI Components & Icons ---
// (These are fine to keep as they are just UI placeholders)
const Loader: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const Trash2: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const toast = {
  info: (title: string, options?: ToastOptions) =>
    console.log(`[INFO] ${title}: ${options?.description || ""}`),
  success: (title: string, options?: ToastOptions) =>
    console.log(`[SUCCESS] ${title}: ${options?.description || ""}`),
  error: (title: string, options?: ToastOptions) =>
    console.error(`[ERROR] ${title}: ${options?.description || ""}`),
};

const CustomBreadCrumb: React.FC<{
  breadCrumbPage: string;
  breadCrumpItems: { label: string; link: string }[];
}> = ({ breadCrumbPage, breadCrumpItems }) => (
  <nav aria-label="breadcrumb" className="text-sm text-gray-500">
    <ol className="list-none p-0 inline-flex">
      {breadCrumpItems.map((item, index) => (
        <li key={index} className="flex items-center">
          <a href={item.link} className="hover:underline">
            {item.label}
          </a>
          <span className="mx-2">/</span>
        </li>
      ))}
      <li className="text-gray-700 font-medium" aria-current="page">
        {breadCrumbPage}
      </li>
    </ol>
  </nav>
);

const Headings: React.FC<{ title: string; isSubHeading?: boolean }> = ({
  title,
  isSubHeading,
}) =>
  isSubHeading ? (
    <h2 className="text-2xl font-bold tracking-tight text-gray-800">
      {title}
    </h2>
  ) : (
    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
      {title}
    </h1>
  );

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "destructive" | "default";
  }
> = ({ children, variant = "default", className = "", ...rest }) => (
  <button
    {...rest}
    className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${
      variant === "destructive"
        ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
        : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500"
    } ${className}`}
  >
    {children}
  </button>
);

const Separator: React.FC = () => (
  <hr className="my-4 border-t border-gray-200" />
);

const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = (props) => (
  <input
    {...props}
    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
);

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = (
  props
) => <label {...props} className="text-sm font-medium leading-none text-gray-700" />;

const Textarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = (props) => (
  <textarea
    {...props}
    className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
);

// --- MOCK SERVICES DELETED ---
// const useAuth = ... (DELETED)
// const interviewService = ... (DELETED)
// Fix the truncated ending of the App component
export default function App(): JSX.Element {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<Interview | null>(null);

  useEffect(() => {
  if (id) {
    interviewService.getAll().then(({ data }) => {
      const interview = data.find(i => i.id === id);
      if (interview) {
        setInitialData({
          ...interview,
          userId: interview.userId || 'default',
          questions: interview.questions || [],
          createdAt: interview.createdAt || new Date().toISOString(),
          updatedAt: interview.updatedAt || new Date().toISOString()
        });
      }
    }).catch(error => {
      console.error("Error loading interview:", error);
      toast.error("Failed to load interview");
    });
  }
}, [id]);
  return <FormMockInterview interview={initialData} />;
}

// --- Main Form Component ---
// --- ADDED 'export' KEYWORD HERE ---
export const FormMockInterview: React.FC<{ interview?: Interview | null }> = ({
  interview: initialData,
}) => {
  const [position, setPosition] = useState<string>(initialData?.position || "");
  const [description, setDescription] = useState<string>(
    initialData?.description || ""
  );
  const [experience, setExperience] = useState<number>(
    initialData?.experience ?? 0
  );
  const [techStack, setTechStack] = useState<string>(
    initialData?.techStack || ""
  );

  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // --- USE THE REAL HOOK ---
  const { userId } = useAuth(); // --- USE THE REAL HOOK ---

  useEffect(() => {
    if (initialData) {
      setPosition(initialData.position);
      setDescription(initialData.description);
      setExperience(initialData.experience);
      setTechStack(initialData.techStack);
    } else {
      setPosition("");
      setDescription("");
      setExperience(0);
      setTechStack("");
    }
  }, [initialData]);

  const title = initialData ? `Edit: ${initialData.position}` : "Create a New Mock Interview";
  const breadCrumbPage = initialData ? "Edit" : "Create";
  const actions = initialData ? "Save Changes" : "Create Interview";
  const toastMessage = initialData
    ? { title: "Interview Updated!", description: "Your changes have been saved." }
    : { title: "Interview Created!", description: "Your new mock interview is ready." };

  const generateAiResponse = async (data: {
    position: string;
    description: string;
    experience: number;
    techStack: string;
  }): Promise<{ question: string; answer: string }[]> => {
    
    // --- CHANGE 2 START ---
    if (!openRouterApiKey) {
    // --- CHANGE 2 END ---
      toast.error("API Key Missing", {
        description: "Please add your OpenRouter API key to the code.",
      });
      throw new Error("API key is missing.");
    }
    setLoading(true);
    toast.info("Generating Questions...", {
      description: "The AI is crafting your interview. Please wait.",
    });

    const prompt = `
      Based on the following job details, generate an array of 5 unique, technical interview questions with ideal answers.
      - Job Position: ${data.position}
      - Job Description: ${data.description}
      - Years of Experience Required: ${data.experience}
      - Tech Stacks: ${data.techStack}
      Return ONLY a valid JSON array in the following format: [{"question": "...", "answer": "..."}]
    `;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": typeof window !== "undefined" ? window.location.href : "",
          "X-Title": "Mock Interview Generator",
        },
        body: JSON.stringify({
          model: "tngtech/deepseek-r1t2-chimera:free",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        // attempt to parse error body safely
        let errorData: any = null;
        try {
          errorData = await response.json();
        } catch {
          errorData = null;
        }
        throw new Error(
          `API Error: ${response.status} - ${
            errorData?.error?.message || errorData?.message || "Unknown error"
          }`
        );
      }

      const result = await response.json().catch(() => null);
      // Try multiple common shapes to locate the text payload
      const rawContent =
        result?.choices?.[0]?.message?.content ??
        result?.choices?.[0]?.text ??
        result?.choices?.[0]?.message ??
        (typeof result === "string" ? result : null);

      if (!rawContent) {
        throw new Error("No content returned from AI");
      }

      const textContent = String(rawContent).replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(textContent);
      if (!Array.isArray(parsed)) {
        throw new Error("Parsed AI response is not an array");
      }
      return parsed;
    } catch (error) {
      console.error("Error generating or parsing AI response:", error);
      toast.error("AI Generation Failed", {
        description: "Could not generate questions. Check the format and try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Replace the handleSubmit function with this corrected version:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    if (!userId) {
      toast.error("Authentication Error", { description: "You must be logged in." });
      return;
    }

    const formData = { position, description, experience, techStack };
    
    try {
      const questions = await generateAiResponse(formData);
      // Create the payload matching CreateInterviewDto type
      const payload = {
          ...formData,
          questions,
          userId: userId, // Use the userId from the useAuth hook
          createdAt: new Date(),
          updatedAt: new Date()
        };
      if (initialData?.id) {
        await interviewService.update(initialData.id, payload);
      } else {
        await interviewService.create(payload);
      }

      toast.success(toastMessage.title, { description: toastMessage.description });
      navigate("/dashboard");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Submission Failed", { 
        description: "Failed to save the interview. Please try again." 
      });
    }
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to permanently delete this interview?")) {
      setLoading(true);
      try {
        await interviewService.delete(initialData.id);
        toast.success("Interview Deleted");
        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to delete interview", error);
        toast.error("Deletion Failed", { description: "Could not delete interview." });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full flex-col space-y-4 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <CustomBreadCrumb breadCrumbPage={breadCrumbPage} breadCrumpItems={[{ label: "Dashboard", link: "#" }]} />
      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} isSubHeading />
        {initialData && (
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            <Trash2 className="min-w-4 min-h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <form
        onSubmit={handleSubmit}
        className="w-full p-8 rounded-lg flex-col flex items-start justify-start gap-6 border bg-white shadow-sm"
      >
        <div className="w-full space-y-2">
          <Label htmlFor="position">Job Role / Position</Label>
          <Input id="position" disabled={loading} placeholder="e.g., Full Stack Developer" value={position} onChange={(e) => setPosition(e.target.value)} required />
        </div>
        <div className="w-full space-y-2">
          <Label htmlFor="description">Job Description</Label>
          <Textarea id="description" disabled={loading} placeholder="e.g., Describe the job role and responsibilities" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="w-full space-y-2">
        _ <Label htmlFor="experience">Years of Experience</Label>
          <Input id="experience" type="number" disabled={loading} placeholder="e.g., 5" value={experience} onChange={(e) => setExperience(Number(e.target.value) || 0)} required />
        </div>
        <div className="w-full space-y-2">
          <Label htmlFor="techStack">Tech Stacks</Label>
section -         <Input id="techStack" disabled={loading} placeholder="e.g., React, Node.js, TypeScript" value={techStack} onChange={(e) => setTechStack(e.target.value)} required />
        </div>
        <div className="w-full flex items-center justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : actions}
          </Button>
        </div>
      </form>
    </div>
  );
};

