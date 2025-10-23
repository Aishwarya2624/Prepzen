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

const saveAnswers = (answers: UserAnswer[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
};

export const userAnswerService = {
  create: async (answer: CreateUserAnswerDto) => {
    const newAnswer: UserAnswer = {
      ...answer,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const answers = getStoredAnswers();
    answers.push(newAnswer);
    saveAnswers(answers);
    return { data: newAnswer };
  },

  getByInterviewId: async (interviewId: string) => {
    const answers = getStoredAnswers();
    return { 
      data: answers.filter(answer => answer.interviewId === interviewId) 
    };
  }
};

export interface UserAnswer {
  interviewId: string;
  id: string;
  questionId: string;
  userId: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserAnswerDto = Omit<UserAnswer, 'id' | 'createdAt' | 'updatedAt'>;