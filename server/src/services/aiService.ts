import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define the Gemini API endpoint and configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const MAX_RETRIES = 2;
const TIMEOUT = 30000; // 30 seconds

export const summarizeText = async (text: string): Promise<string> => {
  // Validate and get API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Gemini API key is not configured in environment variables');
    throw new Error('GEMINI_API_KEY is not configured');
  }

  // Validate input text
  if (!text || text.trim().length === 0) {
    throw new Error('Input text is empty');
  }

  let retryCount = 0;
  
  while (retryCount <= MAX_RETRIES) {
    try {
      console.log(`Attempt ${retryCount + 1} to summarize text with Gemini API...`);
      console.log('Text length:', text.length, 'characters');
      
      // Make the API request
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${apiKey}`,
        {
          contents: [{
            parts: [{
              text: `Please provide a concise summary of the following text, focusing on the key points and main ideas. Keep the summary clear and informative:\n\n${text}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: TIMEOUT
        }
      );

      // Log successful response for debugging
      console.log('Gemini API Response Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));

      // Validate response format
      if (!response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Gemini API');
      }

      const summary = response.data.candidates[0].content.parts[0].text.trim();
      console.log('Successfully generated summary. Length:', summary.length, 'characters');
      
      return summary;

    } catch (error: any) {
      console.error('Gemini API Error:', {
        attempt: retryCount + 1,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Invalid Gemini API key. Please check your API key configuration.');
      }
      
      if (error.response?.status === 429) {
        if (retryCount < MAX_RETRIES) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`Rate limit hit. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retryCount++;
          continue;
        }
        throw new Error('Gemini API rate limit exceeded. Please try again later.');
      }

      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - Gemini API is not responding. Please try again.');
      }

      if (retryCount < MAX_RETRIES) {
        retryCount++;
        continue;
      }

    

      // If all retries failed, throw the final error
      throw new Error(
        error.response?.data?.error?.message || 
        error.message || 
        'Failed to summarize text. Please try again later.'
      );
    }
  }
  

  throw new Error('Maximum retry attempts reached. Please try again later.');
}; 