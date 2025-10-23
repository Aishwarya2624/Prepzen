import * as pdfjsLib from 'pdfjs-dist';
import { gemini } from './gemini-client'; // Import our new Gemini client

// This line tells pdf.js to use the worker file from your public folder.
// Ensure you have copied 'pdf.worker.min.mjs' to 'public/pdf.worker.min.js'
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

// We'll keep the class name to avoid breaking imports in other files,
// but the logic inside will now use Gemini.
export class AnthropicService {

  // This method is now powered by Gemini
  async analyzeResume(resumeContent: string, jobDescription: string, jobTitle: string): Promise<any> {
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

    const instructions = `
      Analyze the following resume against the provided job description for the position of "${jobTitle}".

      Job Description:
      ---
      ${jobDescription}
      ---

      Resume Content:
      ---
      ${resumeContent}
      ---

      Provide a comprehensive analysis in a strict JSON format. Do not include any text outside of the JSON object. The JSON object must have the following structure:
      {
        "overallScore": number (0-100),
        "ATS": {
          "score": number (0-100),
          "tips": [{"type": "good" | "warning", "tip": "specific actionable advice"}]
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

      Focus on: ATS compatibility (keywords, formatting), content relevance, professional tone, skills alignment, and readability. Provide specific, actionable feedback.
    `;

    try {
      const result = await model.generateContent(instructions);
      const response = await result.response;
      const jsonText = response.text().replace(/```json|```/g, "").trim();

      // Attempt to parse the cleaned JSON response
      return JSON.parse(jsonText);

    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to get analysis from AI. Please try again.');
    }
  }

  // Simplified and corrected PDF text extraction
  async extractTextFromPDF(pdfFile: File): Promise<string> {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map(item => ('str' in item ? item.str : ''))
          .join(' ');
        
        fullText += pageText + '\n';
      }
      
      // Clean up the extracted text
      return fullText.replace(/\s+/g, ' ').trim();
      
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF. Please ensure the file is not corrupted.');
    }
  }
}

// Export a singleton instance
export const anthropicService = new AnthropicService();