import React, { useState, useEffect, useRef } from 'react';
import { askConstitutionAI, generateSpeechAI } from '../services/geminiService';
import { saveChatSession, getSavedChats, deleteChatSession } from '../services/storageService';
import { ChatMessage, SavedChat, ExportFormat } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Send, Bot, User, Download, Trash2, MessageSquare, History, Mic, MicOff, Volume2, Play, Pause, X } from 'lucide-react';

interface InlineChatProps {
  contextTitle: string;
}

// Simple Audio Player Component
const AudioPlayer: React.FC<{ base64Audio: string; speed: number }> = ({ base64Audio, speed }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (base64Audio) {
      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mp3' }); // Gemini TTS usually returns MP3/PCM
      const url = URL.createObjectURL(blob);
      
      const audio = new Audio(url);
      audio.playbackRate = speed;
      audio.onended = () => setIsPlaying(false);
      audioRef.current = audio;

      return () => {
        URL.revokeObjectURL(url);
        audio.pause();
      };
    }
  }, [base64Audio, speed]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else {
        audioRef.current.playbackRate = speed; // ensure speed is updated
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const downloadAudio = () => {
     if (audioRef.current) {
        const a = document.createElement('a');
        a.href = audioRef.current.src;
        a.download = `tts-${Date.now()}.mp3`;
        a.click();
     }
  };

  return (
    <div className="flex items-center gap-2 mt-2 bg-black/5 dark:bg-white/10 p-1.5 rounded-full w-fit">
      <button onClick={togglePlay} className="p-1 rounded-full bg-[var(--c-accent)] text-[var(--c-accent-text)]">
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <div className="h-1 w-16 bg-current opacity-20 rounded"></div>
      <button onClick={downloadAudio} className="opacity-50 hover:opacity-100"><Download size={14}/></button>
    </div>
  );
};

const InlineChat: React.FC<InlineChatProps> = ({ contextTitle }) => {
  const { settings } = useTheme();
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Web Speech API for Input
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'fa-IR';
      recognition.continuous = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + ' ' + transcript);
      };
      recognition.start();
    } else {
      alert("مرورگر شما از ورودی صوتی پشتیبانی نمی‌کند.");
    }
  };

  useEffect(() => {
    setSavedChats(getSavedChats());
    startNewChat();
  }, []);

  const startNewChat = () => {
    const initialMsg: ChatMessage = { 
      id: 'init', 
      role: 'model', 
      text: `سلام. درباره "${contextTitle}" یا سایر اصول سوالی دارید؟` 
    };
    setMessages([initialMsg]);
    setCurrentChatId(Date.now().toString());
  };

  const handleSend = async (textToSend: string = input) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: textToSend };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // 1. Get Text Answer & Suggestions
      const response = await askConstitutionAI(newMessages, userMsg.text);
      
      const answer = typeof response.text === 'string' ? response.text : JSON.stringify(response.text);
      let suggestions: string[] = [];
      if (Array.isArray(response.suggestions)) {
        suggestions = response.suggestions.map(s => typeof s === 'string' ? s : String(s));
      }

      // 2. Generate Audio (TTS)
      const audioBase64 = await generateSpeechAI(answer, settings.audio);

      const botMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: answer,
        relatedQuestions: suggestions,
        audioUrl: audioBase64 || undefined
      };

      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);

      if (currentChatId) {
        const chatToSave: SavedChat = {
          id: currentChatId,
          title: userMsg.text.substring(0, 30) + '...',
          date: new Date().toLocaleDateString('fa-IR'),
          messages: finalMessages
        };
        saveChatSession(chatToSave);
        setSavedChats(getSavedChats());
      }
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadChat = (chat: SavedChat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setActiveTab('chat');
  };

  const deleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteChatSession(id);
    setSavedChats(getSavedChats());
    if (currentChatId === id) startNewChat();
  };

  return (
    <div className="bg-[var(--c-content-bg)] rounded-3xl shadow-xl border border-[var(--c-border)] overflow-hidden mt-12 mb-8 mx-4 md:mx-0">
      {/* Tabs */}
      <div className="flex bg-[var(--c-sidebar-bg)] p-1">
        <button onClick={() => setActiveTab('chat')} className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)] shadow-md font-bold' : 'text-[var(--c-sidebar-text)] opacity-70'}`}>
          <MessageSquare size={18} /> گفتگو
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-xl transition-all ${activeTab === 'history' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)] shadow-md font-bold' : 'text-[var(--c-sidebar-text)] opacity-70'}`}>
          <History size={18} /> تاریخچه
        </button>
      </div>

      <div className="p-6 min-h-[400px] flex flex-col">
        {activeTab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto space-y-6 mb-4 max-h-[500px] scroll-smooth pr-2 custom-scrollbar" ref={chatContainerRef}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)]' : 'bg-[var(--c-sidebar-bg)] text-[var(--c-sidebar-text)]'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`flex flex-col gap-2 max-w-[85%]`}>
                    <div className={`p-4 rounded-2xl leading-7 text-sm shadow-sm ${msg.role === 'user' ? 'bg-[var(--c-chat-user)] text-[var(--c-accent-text)]' : 'bg-[var(--c-chat-bot)] text-[var(--c-chat-text)] border border-[var(--c-border)]'}`}>
                      {/* SAFE RENDER */}
                      {typeof msg.text === 'string' ? msg.text : 'خطا در نمایش پیام'}
                      {msg.role === 'model' && msg.audioUrl && (
                        <AudioPlayer base64Audio={msg.audioUrl} speed={settings.audio.speed} />
                      )}
                    </div>
                    {/* Suggestions */}
                    {msg.relatedQuestions && Array.isArray(msg.relatedQuestions) && msg.relatedQuestions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                         {msg.relatedQuestions.map((q, idx) => {
                           const safeQ = typeof q === 'string' ? q : String(q);
                           if (safeQ === '[object Object]') return null;
                           return (
                           <button 
                             key={idx} 
                             onClick={() => handleSend(safeQ)}
                             className="text-xs px-3 py-1 rounded-full border border-[var(--c-accent)] text-[var(--c-accent)] hover:bg-[var(--c-accent)] hover:text-[var(--c-accent-text)] transition-colors"
                           >
                             {safeQ}
                           </button>
                         )})}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && <div className="text-center text-gray-400 text-sm animate-pulse">در حال نوشتن و تولید صدا...</div>}
            </div>

            {/* Input Area */}
            <div className="flex gap-2 mb-2 items-end">
              <div className="flex-1 relative">
                 <textarea
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                   placeholder="سوال خود را بپرسید (متن یا صوت)..."
                   className="w-full p-3 pl-10 rounded-xl border border-[var(--c-border)] bg-[var(--c-main-bg)] text-[var(--c-text-main)] focus:ring-2 focus:ring-[var(--c-accent)] resize-none"
                   rows={1}
                 />
                 <button onClick={startListening} className={`absolute left-2 top-2 p-1 rounded-full ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-[var(--c-accent)]'}`}>
                    {isListening ? <MicOff size={18}/> : <Mic size={18}/>}
                 </button>
              </div>
              <button onClick={() => handleSend()} disabled={loading} className="bg-[var(--c-accent)] text-[var(--c-accent-text)] p-3 rounded-xl disabled:opacity-50">
                <Send size={20} />
              </button>
            </div>
            <div className="text-[10px] opacity-50 text-center">تنظیمات صدا (گوینده/سرعت) در پنل تنظیمات قابل تغییر است.</div>
          </>
        )}

        {/* History Tab - Same as before but styled with vars */}
        {activeTab === 'history' && (
          <div className="space-y-3">
             {savedChats.map((chat) => (
                <div key={chat.id} onClick={() => loadChat(chat)} className="flex items-center justify-between p-4 rounded-xl border border-[var(--c-border)] bg-[var(--c-main-bg)] hover:brightness-95 cursor-pointer">
                  <span className="text-sm font-bold text-[var(--c-text-main)] truncate">{chat.title}</span>
                  <button onClick={(e) => deleteChat(e, chat.id)} className="text-red-400"><Trash2 size={16}/></button>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InlineChat;