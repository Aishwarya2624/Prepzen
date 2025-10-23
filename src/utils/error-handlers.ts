import type { AIError } from '../types';
import { toast } from 'sonner';

export const isAIError = (error: unknown): error is AIError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as AIError).code === 'string' &&
    typeof (error as AIError).message === 'string'
  );
};

export const handleAIError = (error: unknown): void => {
  const message = isAIError(error) 
    ? error.message 
    : 'An unexpected error occurred';
    
  console.error('[AI Error]:', {
    error,
    timestamp: new Date().toISOString(),
  });
    
  toast.error('AI Processing Failed', {
    description: message
  });
};

export const createContextualErrorHandler = (context: string) => {
  return (error: unknown): void => {
    const message = isAIError(error)
      ? error.message
      : `Error during ${context}`;

    console.error(`[${context} Error]:`, {
      error,
      timestamp: new Date().toISOString(),
    });

    toast.error(`${context} Failed`, {
      description: message
    });
  };
};

// Usage example:
const handleTranscriptionError = createContextualErrorHandler('Speech Transcription');
const handleFeedbackError = createContextualErrorHandler('AI Feedback');