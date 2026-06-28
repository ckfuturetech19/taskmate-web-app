import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface GeminiResponse {
  response: string;
  error?: string;
}

export const AIService = {
  /**
   * Sends a prompt to the Gemini AI backend
   */
  async generateResponse(prompt: string, model: string = 'gemini-flash-lite-latest'): Promise<GeminiResponse> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/ai/gemini`, 
        { prompt, model },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('AIService Error:', error);
      return { 
        response: '', 
        error: error.response?.data?.error || 'Failed to connect to AI service' 
      };
    }
  },

  /**
   * Specific helper to summarize note content
   */
  async summarizeNote(content: string): Promise<string> {
    const prompt = `Please provide a concise, structured summary of the following note content. 
    Use "###" for section headers and "*" for bullet points.
    
    Content:
    ${content}`;
    const result = await this.generateResponse(prompt);
    return result.response;
  },

  /**
   * Specific helper to extract action items from notes
   */
  async extractActionItems(content: string): Promise<string> {
    const now = new Date();
    const prompt = `Current Date/Time: ${now.toLocaleString()}
    Analyze the following note content and extract all specific, actionable tasks, to-do items, or follow-ups.
    
    Instructions:
    1. Organize them logically.
    2. Use "###" for section headers (e.g., ### Pending Tasks, ### Completed).
    3. Use "*" for each task item.
    4. Make the task descriptions concise and professional.
    
    Note Content:
    ${content}`;
    
    const result = await this.generateResponse(prompt);
    return result.response;
  },

  /**
   * Enhances task details based on the title
   */
  async enhanceTask(title: string, options: string[]): Promise<any> {
    const now = new Date();
    const prompt = `Current Date/Time: ${now.toLocaleString()}
    Based on this task title: "${title}", please enhance it by providing suggestions for: ${options.join(', ')}. 
    Return ONLY a raw JSON object (no markdown, no backticks) with these EXACT keys: 
    - "title": (refined title)
    - "description": (detailed description)
    - "subtasks": (array of strings, max 5)
    - "priority": (one of: "low", "medium", "high")
    - "category": (one of: "Work", "Personal", "Shopping", "Health", "Finance", "Urgent")
    - "dueDate": (ISO date string for a reasonable deadline in the FUTURE)
    - "reminder": (ISO date string for a reminder notification, slightly before the due date)
    
    Make the suggestions professional, actionable, and highly relevant to the title. Ensure all dates are in the FUTURE relative to ${now.toLocaleString()}.`;
    
    const result = await this.generateResponse(prompt);
    try {
      // Robust JSON extraction
      const text = result.response.trim();
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = text.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonStr);
      }
      return null;
    } catch (e) {
      console.error("Failed to parse AI task enhancement:", e);
      return null;
    }
  },

  /**
   * Saves an AI insight to the database
   */
  async saveInsight(noteId: string, content: string, type: string): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/ai/insights`, 
        { noteId, content, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const rawData = response.data;
      if (rawData && typeof rawData === 'object' && 'insight' in rawData) {
        return rawData.insight;
      }
      return rawData;
    } catch (error) {
      console.error('Error saving insight:', error);
      return null;
    }
  },

  /**
   * Fetches all AI insights for a note
   */
  async getInsights(noteId: string): Promise<any[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/ai/insights/${noteId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const rawData = response.data;
      if (rawData && typeof rawData === 'object' && 'insights' in rawData) {
        return rawData.insights;
      }
      return Array.isArray(rawData) ? rawData : [];
    } catch (error) {
      console.error('Error fetching insights:', error);
      return [];
    }
  },

  /**
   * Deletes an AI insight
   */
  async deleteInsight(id: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/ai/insights/${id}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return true;
    } catch (error) {
      console.error('Error deleting insight:', error);
      return false;
    }
  }
};
