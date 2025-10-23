// Supabase uses ISO strings for dates instead of Firebase Timestamps

// Resume types
export interface Suggestion {
  type: "good" | "warning";
  tip: string;
}

export interface CategoryScore {
  score: number;
  feedback: string[];
}

export interface Feedback {
  overallScore: number;
  ATS: {
    score: number;
    tips: Suggestion[];
  };
  toneAndStyle: CategoryScore;
  content: CategoryScore;
  structure: CategoryScore;
  skills: CategoryScore;
}

export interface ResumeData {
  id: string;
  resumePath: string;
  imagePath: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  feedback: Feedback;
}

export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface Interview {
  id: string;
  position: string;
  description: string;
  experience: number;
  userId: string;
  techStack: string;
  questions: { question: string; answer: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface UserAnswer {
  id: string;
  questionId: string;
  userId: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResultType {
  response: Response;
  text?: string;
  status: number;
}

export interface AIResponse {
  text: string;
  feedback: string;
  score?: number;
}

export interface AIError {
  code: string;
  message: string;
  details?: string;
  timestamp?: string;
  requestId?: string;
}



export interface Question {
  id: string;
  question: string;
  answer?: string;
}

export interface RecordAnswerProps {
  question: Question;
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void;
}

 export interface Interview {
  id: string;
  userId: string;
  position: string;
  description: string;
  experience: number;
  techStack: string;
  questions: Array<{ question: string; answer: string; }>;
  createdAt: string;  // Already exists
  updatedAt: string;  // Add this line
}

export interface AIError {
  code: string;
  message: string;
  details?: string;
  timestamp?: string;
  requestId?: string;
}

export interface AIResponse {
  text: string;
  feedback?: string;
  score?: number;
}

export interface UserAnswer {
  id: string;
  interviewId: string;
  questionId: string;
  userId: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

// Centralized application types used across the app

export type CreateInterviewDto = Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>;

export interface UserAnswer {
  id: string;
  userId: string;
  interviewId: string;
  questionId: string;
  answer: string;
  audioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
export type CreateUserAnswerDto = Omit<UserAnswer, 'id' | 'createdAt' | 'updatedAt'>;

export interface ResultType {
  response: Response;
  text?: string;
  status: number;
}

export interface AIResponse {
  text: string;
  score?: number;
  feedback?: string;
  suggestions?: string[];
}

export interface AIError {
  code: string;
  message: string;
  details?: string;
}