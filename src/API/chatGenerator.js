import axios from 'axios';

const apiKey = process.env.EXPO_PUBLIC_CHAT_GEMINI_API_KEY; // Store API key securely

export const generateContent = async (text) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Access the correct part of the response
    const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (generatedText) {
      return { success: true, generatedText };
    } else {
      return { success: false, message: "No content generated, please try again." };
    }
  } catch (error) {
    console.error('Error generating content:', error);
    return { success: false, message: 'Error generating content, please try again.' };
  }
};
