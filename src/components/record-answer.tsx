import { useAuth } from "@/contexts/AuthContext";
import {
  CircleStop,
  Loader,
  Mic,
  Save,
  Video,
  VideoOff,
  WebcamIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import useSpeechToText, { type ResultType } from "react-hook-speech-to-text"; // Import ResultType
import { useParams } from "react-router-dom";
import WebCam from "react-webcam";
import { TooltipButton } from "./tooltip-button";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import { SaveModal } from "./save-modal";
import { userAnswerService } from '@/lib/user-answers-service';
import type { AIError, AIResponse } from '../types';
import { isAIError, handleAIError } from '@/utils/error-handlers';

export interface Question {
  question: string;
  answer: string;
}

export interface RecordAnswerProps {
  question: Question;
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void;
  onAnswerSaved: () => void;
}

export const RecordAnswer = ({
  question,
  isWebCam,
  setIsWebCam,
  onAnswerSaved
}: RecordAnswerProps) => {
  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [recordedAnswer, setRecordedAnswer] = useState<string>('');

  const { userId } = useAuth();
  const { id: interviewId } = useParams();

  useEffect(() => {
    // Use the imported ResultType to fix the error
    const combinedTranscript = results.map((res) => (res as ResultType).transcript).join(" ");
    setUserAnswer(combinedTranscript);
  }, [results]);

  /** Try to recover JSON from noisy AI output */
  function tryParseAiJson(raw: string): unknown {
    if (!raw) return null;

    // Remove fences and leading/trailing backticks
    let s = String(raw).replace(/```(?:json)?/gi, "").replace(/```/g, "");

    // Replace common problematic control characters (preserve newline for readability)
    s = s.replace(/\r/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ");

    // Extract first JSON object/array block
    const m = s.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (m) s = m[1];

    // Remove trailing commas before } or ]
    s = s.replace(/,(\s*[}\]])/g, "$1");

    // Attempt to convert single-quoted keys/strings to double quotes (best-effort)
    // Only run when it looks like single quotes are used for strings (avoid corrupting valid JSON)
    if (/\'[^']*\'\s*:/.test(s) || /:\s*'[^']*'/.test(s)) {
      // naive replace of single-quoted strings -> double-quoted (handles many cases)
      s = s.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, (_m, g1) => {
        // escape double quotes inside captured group
        return '"' + g1.replace(/"/g, '\\"') + '"';
      });
    }

    // Final trim
    s = s.trim();

    // Try parse
    try {
      return JSON.parse(s);
    } catch (err) {
      // Last attempt: remove leftover unescaped newlines inside strings by replacing them with spaces
      const cleaned = s.replace(/\\n|[\n]/g, "\\n");
      try {
        return JSON.parse(cleaned);
      } catch (err2) {
        // give up; return null
        console.error("Failed to parse AI JSON after sanitization", err, err2);
        return null;
      }
    }
  }

  const generateAiFeedback = async () => {
    if (userAnswer?.length < 10) {
      toast.error("Answer is too short", {
        description: "Please provide a more detailed answer.",
      });
      return;
    }

    setIsAiGenerating(true);
    const prompt = `Question: "${question.question}", User Answer: "${userAnswer}", Correct Answer: "${question.answer}". Please provide a rating from 1 to 10 and feedback for improvement. Return the result in a JSON format with "rating" (number) and "feedback" (string) fields.`;

    // Inside your generateAiFeedback function:

    try {
      const result = await chatSession.sendMessage(prompt);
      const responseText = result.response.text();

      // 1. Robustly find the JSON block in the AI's response.
      // This regex finds the first complete JSON object (starting with { and ending with }).
      const jsonMatch = responseText.match(/{[\s\S]*}/);

      if (!jsonMatch || !jsonMatch[0]) {
        console.error("No valid JSON object found in AI response:", responseText);
        toast.error("AI Feedback Error", { description: "The AI response was not in the expected format." });
        return;
      }

      const jsonText = jsonMatch[0];
      
      // 2. Now, parse the *extracted* JSON text.
      // This is much safer than parsing the entire, untrimmed response.
      const parsedResult: AIResponse = JSON.parse(jsonText);
      
      setAiResult(parsedResult);
      toast.success("Feedback generated!");

    } catch (error) {
      const errorMessage = isAIError(error) ? 
        error.message : 
        "Could not parse feedback";

      console.error("Error generating or parsing AI feedback:", error);
      toast.error("AI Feedback Failed", { description: errorMessage });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleRecording = () => {
    if (isRecording) {
      stopSpeechToText();
      // Wait for the final results to process before generating feedback
      setTimeout(() => generateAiFeedback(), 100);
    } else {
      setAiResult(null);
      setUserAnswer(""); // Clear previous answer
      startSpeechToText();
    }
  };

  const saveUserAnswer = async () => {
    try {
      if (!userId || !interviewId) {
        toast.error("Missing required data");
        return;
      }

      const answerData = {
        userId,
        interviewId,
        questionId: question.question, // Assuming question.question is the ID
        answer: userAnswer,
        // audioUrl: audioUrl // Uncomment if you have this
      };

      await userAnswerService.create(answerData);
      toast.success("Answer saved successfully!");
      onAnswerSaved();
    } catch (error) {
      console.error("Error saving user answer:", error);
      toast.error("Failed to save answer", {
        description: "Please try again or contact support if the problem persists."
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
const handleSubmit = async () => {
  setLoading(true);
  try {
    const results = await generateAIFeedback(recordedAnswer);
    // ...existing code...
  } catch (error) {
    console.error("AI Feedback Error:", error);
    handleAIError(error);
  } finally {
    setLoading(false);
  }
};

// Type guard for AIError
function isAIError(error: unknown): error is AIError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'code' in error
  );
}
  return (
    <div className="w-full flex flex-col items-center gap-8 mt-4">
      <SaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={saveUserAnswer}
        loading={loading}
      />
      <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-muted rounded-md">
        {isWebCam ? (
          <WebCam
            mirrored={true}
            onUserMedia={() => setIsWebCam(true)}
            onUserMediaError={() => setIsWebCam(false)}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
        )}
      </div>
      <div className="flex justify-center gap-3">
        <TooltipButton
          content={isWebCam ? "Turn Off Camera" : "Turn On Camera"}
          icon={isWebCam ? <VideoOff /> : <Video />}
          onClick={() => setIsWebCam(!isWebCam)}
        />
        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={isRecording ? <CircleStop /> : <Mic />}
          onClick={handleRecording}
        />
        <TooltipButton
          content="Save Answer"
          icon={isAiGenerating ? <Loader className="animate-spin" /> : <Save />}
          onClick={() => setOpen(true)}
          disabled={!aiResult || isAiGenerating}
        />
      </div>

      {(userAnswer || interimResult) && (
        <div className="w-full mt-4 p-4 border rounded-md bg-muted">
          <h2 className="text-lg font-semibold">Your Answer Transcript:</h2>
          <p className="text-sm mt-2 text-muted-foreground">{userAnswer} {interimResult}</p>
        </div>
      )}
    </div>
  );
};

