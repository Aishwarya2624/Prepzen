import type { Interview, UserAnswer } from "@/types";

// In-memory storage for development
let interviewStore: Interview[] = [];
let userAnswerStore: UserAnswer[] = []; // Store for answers

export const interviewService = {
  getAll: async () => {
    return { data: interviewStore };
  },

  // This was missing and is needed by feedback.tsx
  getById: async (id: string) => {
    const interview = interviewStore.find(i => i.id === id);
    return { data: interview || null };
  },

  create: async (payload: Omit<Interview, "id">) => {
    const newInterview = {
      ...payload,
      id: `interview-${Date.now()}`, // Simple ID generation
    };
    interviewStore.push(newInterview);
    return { data: newInterview };
  },

  update: async (id: string, payload: Partial<Interview>) => {
    interviewStore = interviewStore.map(interview =>
      interview.id === id ? { ...interview, ...payload } : interview
    );
    return { data: interviewStore.find(i => i.id === id) };
  },

  delete: async (id: string) => {
    interviewStore = interviewStore.filter(interview => interview.id !== id);
    return { success: true };
  }
};
// Use localStorage for persistence
const STORAGE_KEY = 'user-answers';
const isUserAnswer = (data: unknown): data is UserAnswer => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'questionId' in data &&
    'userId' in data &&
    'answer' in data &&
    'createdAt' in data &&
    'updatedAt' in data
  );
};

const getStoredAnswers = (): UserAnswer[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    return parsed.filter(isUserAnswer);
  } catch {
    return [];
  }
};
// --- ADD THIS NEW SERVICE ---

export const userAnswerService = {
  create: async (payload: Omit<UserAnswer, "id">) => {
    const newUserAnswer = {
      ...payload,
      id: `answer-${Date.now()}`,
    };
    userAnswerStore.push(newUserAnswer);
    return { data: newUserAnswer };
  },

  getByInterviewId: async (interviewId: string) => {
    const answers = userAnswerStore.filter(
      (answer) => answer.interviewId === interviewId
    );
    return { data: answers };
  },
};