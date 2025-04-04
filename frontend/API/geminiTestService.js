import axios from 'axios';

const modelId = 'gemini-2.0-flash-exp';
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

export const fetchGeminiResponse = async (input) => {
  try {
    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: input,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    };

    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('API Response:', response.data);

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';
  } catch (error) {
    console.error('Error fetching response from Gemini API:', error);
    throw new Error('Error generating response from the AI.');
  }
};