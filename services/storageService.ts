import { ArticleAnalysis, SavedChat } from '../types';

const ANALYSIS_CACHE_KEY = 'constitution_analysis_cache';
const CHAT_HISTORY_KEY = 'constitution_chat_history';

// --- Analysis Caching ---

export const getCachedAnalysis = (articleTitle: string): ArticleAnalysis | null => {
  try {
    const cache = JSON.parse(localStorage.getItem(ANALYSIS_CACHE_KEY) || '{}');
    return cache[articleTitle] || null;
  } catch (e) {
    console.error("Failed to read analysis cache", e);
    return null;
  }
};

export const saveAnalysisToCache = (articleTitle: string, data: ArticleAnalysis) => {
  try {
    const cache = JSON.parse(localStorage.getItem(ANALYSIS_CACHE_KEY) || '{}');
    cache[articleTitle] = data;
    localStorage.setItem(ANALYSIS_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error("Failed to save analysis cache", e);
  }
};

// --- Chat History ---

export const getSavedChats = (): SavedChat[] => {
  try {
    return JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

export const saveChatSession = (chat: SavedChat) => {
  try {
    const chats = getSavedChats();
    // Check if exists
    const existingIndex = chats.findIndex(c => c.id === chat.id);
    if (existingIndex >= 0) {
      chats[existingIndex] = chat;
    } else {
      chats.unshift(chat);
    }
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chats));
  } catch (e) {
    console.error("Failed to save chat", e);
  }
};

export const deleteChatSession = (id: string) => {
  try {
    const chats = getSavedChats().filter(c => c.id !== id);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chats));
  } catch (e) {
    console.error("Failed to delete chat", e);
  }
};
