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