import { GoogleGenAI, Modality } from "@google/genai";
import { FULL_TEXT_CONTEXT } from '../constants';
import { ChatMessage, ArticleAnalysis, AudioSettings } from '../types';
import { getCachedAnalysis, saveAnalysisToCache } from './storageService';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateSpeechAI = async (text: string, settings: AudioSettings): Promise<string | null> => {
  if (!apiKey) return null;

  try {
    let voiceName = 'Kore'; 
    if (settings.gender === 'Male') voiceName = 'Puck';

    let promptText = text;
    if (settings.tone === 'Sad') promptText = `(Say this in a sad, melancholic tone): ${text}`;
    if (settings.tone === 'Happy') promptText = `(Say this in a happy, cheerful tone): ${text}`;
    if (settings.tone === 'News') promptText = `(Say this in a formal news anchor tone): ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

export const getSuggestedQuestions = async (lastAnswer: string): Promise<string[]> => {
  if (!apiKey) return [];
  try {
    const prompt = `Based on this answer about the Iranian Constitution: "${lastAnswer.substring(0, 500)}...", suggest 3 short, relevant follow-up questions in Persian. Return ONLY the questions as a JSON array of strings (e.g. ["Question 1", "Question 2"]).`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: 'application/json' 
      }
    });
    
    const parsed = JSON.parse(response.text || '[]');
    
    // VALIDATION: Ensure we only return strings to prevent React Error #31
    if (Array.isArray(parsed)) {
      return parsed.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          // Handle cases where AI returns [{question: "..."}]
          return Object.values(item).join(' '); 
        }
        return String(item);
      });
    }
    return [];
  } catch (e) {
    console.error("Suggestion Error:", e);
    return [];
  }
};

export const askConstitutionAI = async (
  history: ChatMessage[],
  userQuestion: string
): Promise<{ text: string; suggestions: string[] }> => {
  if (!apiKey) {
    return { text: "خطا: کلید API یافت نشد.", suggestions: [] };
  }

  try {
    // Limit history to last 10 messages to prevent payload too large errors (500)
    const recentHistory = history.slice(-10);
    
    const context = recentHistory.map(h => {
        // Safe check to ensure h.text is a string
        const msgText = typeof h.text === 'string' ? h.text : JSON.stringify(h.text);
        return `${h.role === 'user' ? 'User' : 'Model'}: ${msgText}`;
    }).join('\n');

    const systemInstruction = `
      شما دستیار حقوقی قانون مشروطه (۱۲۸۵) هستید.
      منابع: ${FULL_TEXT_CONTEXT}
      پاسخ کوتاه، دقیق و به زبان فارسی امروزی باشد.
      تاریخچه گفتگو: ${context}
      سوال کاربر: ${userQuestion}
    `;

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
    });
    
    const response = await chat.sendMessage({ message: systemInstruction });
    const text = response.text || "پاسخی دریافت نشد.";
    
    // Get suggestions
    const suggestions = await getSuggestedQuestions(text);

    return { text, suggestions };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "متاسفانه خطایی در ارتباط با سرویس هوشمند رخ داد. لطفاً اتصال اینترنت خود را بررسی کنید.", suggestions: [] };
  }
};

export const analyzeArticleAI = async (articleTitle: string, articleContent: string): Promise<ArticleAnalysis> => {
  const cached = getCachedAnalysis(articleTitle);
  if (cached) return cached;
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    تحلیل حقوقی اصل "${articleTitle}": "${articleContent}".
    خروجی JSON:
    {
      "modernText": "فارسی ساده",
      "example": "مثال کاربردی",
      "historicalContext": "چرایی تصویب",
      "proponentView": "نظر موافقان",
      "opponentView": "نظر مخالفان",
      "prevailingView": "نظر نهایی",
      "legalTruth": "تفسیر حقوقی"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    const data = JSON.parse(response.text || '{}') as ArticleAnalysis;
    saveAnalysisToCache(articleTitle, data);
    return data;
  } catch (error) {
    return {
      modernText: "خطا در دریافت تحلیل.",
      example: "-",
      historicalContext: "...",
      proponentView: "-",
      opponentView: "-",
      prevailingView: "-",
      legalTruth: "-"
    };
  }
};