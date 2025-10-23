export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const convertPdfToImage = async (file: File): Promise<{ file: File | null }> => {
  try {
    // For now, we'll return the original file
    // In a real implementation, you'd use a PDF to image conversion library
    // like pdf2pic, jsPDF, or a server-side conversion
    return { file };
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    return { file: null };
  }
};

export const prepareInstructions = ({ jobTitle, jobDescription }: { jobTitle: string; jobDescription: string }) => {
  return `
    Analyze this resume against the job description for the position of ${jobTitle}.
    
    Job Description: ${jobDescription}
    
    Please provide a comprehensive analysis in the following JSON format:
    {
      "overallScore": number (0-100),
      "ATS": {
        "score": number (0-100),
        "tips": [
          {
            "type": "good" | "warning",
            "tip": "specific actionable advice"
          }
        ]
      },
      "toneAndStyle": {
        "score": number (0-100),
        "feedback": ["specific feedback points"]
      },
      "content": {
        "score": number (0-100),
        "feedback": ["specific feedback points"]
      },
      "structure": {
        "score": number (0-100),
        "feedback": ["specific feedback points"]
      },
      "skills": {
        "score": number (0-100),
        "feedback": ["specific feedback points"]
      }
    }
    
    Focus on:
    1. ATS compatibility (keywords, formatting, structure)
    2. Content relevance to the job description
    3. Professional tone and style
    4. Skills alignment with job requirements
    5. Overall structure and readability
    
    Provide specific, actionable feedback that can help improve the resume.
  `;
}; 