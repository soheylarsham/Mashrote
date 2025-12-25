import React, { useState, useRef, useEffect } from 'react';
import { askConstitutionAI } from '../services/geminiService';
import { ChatMessage, ExportFormat } from '../types';
import { TIMELINE_DATA } from '../data/timeline';
import { MessageCircle, X, Send, Loader2, Bot, User, Download, FileJson, FileText, Image as ImageIcon, Printer, History, MessageSquare, ExternalLink } from 'lucide-react';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'timeline'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'سلام! من هوش مصنوعی مشروطه‌خواه هستم. می‌توانم قوانین را تفسیر کنم و درباره تاریخ مشروطه توضیح دهم.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') scrollToBottom();
  }, [messages, isOpen, activeTab]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await askConstitutionAI(messages, userMsg.text);
      
      // Safety check: ensure response text is string
      const text = typeof response.text === 'string' ? response.text : JSON.stringify(response.text);
      
      // Safety check: ensure suggestions is array of strings
      let suggestions: string[] = [];
      if (Array.isArray(response.suggestions)) {
        suggestions = response.suggestions.map(s => typeof s === 'string' ? s : String(s));
      }

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: text,
        relatedQuestions: suggestions
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: "متاسفانه خطایی رخ داد."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: ExportFormat) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `constitution-chat-${timestamp}`;

    if (activeTab === 'timeline') {
       alert("خروجی فقط برای بخش گفتگو فعال است.");
       return;
    }

    const content = messages.map(m => `${m.role === 'user' ? 'کاربر' : 'هوش مصنوعی'}:\n${typeof m.text === 'string' ? m.text : ''}\n`).join('\n---\n');

    switch (format) {
      case 'pdf':
        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
          printWindow.document.write(`
            <html dir="rtl">
              <head><title>${filename}</title><style>body{font-family:tahoma; padding: 20px;} .msg{margin-bottom:20px; border-bottom:1px solid #ccc; padding-bottom:10px;} .user{color:blue;} .model{color:green;}</style></head>
              <body>
                <h1>تاریخچه گفتگو - قانون مشروطه</h1>
                ${messages.map(m => `<div class="msg"><strong class="${m.role}">${m.role === 'user' ? 'کاربر' : 'هوش مصنوعی'}:</strong><br/>${typeof m.text === 'string' ? m.text.replace(/\n/g, '<br>') : '[Object]'}</div>`).join('')}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
        break;
      case 'md':
        downloadFile(content, `${filename}.md`, 'text/markdown');
        break;
      case 'html':
        const html = `<html dir="rtl"><head><meta charset="utf-8"><style>body{font-family:sans-serif; padding:20px; line-height:1.6; background:#f9f9f9;} .card{background:white; padding:15px; margin-bottom:10px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1);}</style></head><body><h1>گفتگوی مشروطه</h1>${messages.map(m => `<div class="card"><strong>${m.role === 'user' ? 'شما' : 'هوش مصنوعی'}:</strong><p>${typeof m.text === 'string' ? m.text.replace(/\n/g, '<br/>') : '[Object]'}</p></div>`).join('')}</body></html>`;
        downloadFile(html, `${filename}.html`, 'text/html');
        break;
      case 'docs':
        const docContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body dir="rtl"><h1>تاریخچه گفتگو</h1>${messages.map(m => `<p><strong>${m.role === 'user' ? 'کاربر' : 'هوش مصنوعی'}:</strong><br/>${typeof m.text === 'string' ? m.text : ''}</p>`).join('')}</body></html>`;
        downloadFile(docContent, `${filename}.doc`, 'application/msword');
        break;
      case 'js': 
         const js = `const chat = ${JSON.stringify(messages, null, 2)};`;
         downloadFile(js, `${filename}.js`, 'text/javascript');
         break;
      case 'png':
        alert("برای ذخیره تصویر، لطفاً از دکمه Print Screen یا قابلیت اسکرین‌شات مرورگر استفاده کنید، یا گزینه PDF را انتخاب کنید.");
        break;
    }
    setShowExportMenu(false);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-40 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-4 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle size={28} />
      </button>

      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm md:w-[500px] h-[650px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 animate-slide-in-up font-vazir">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 shadow-md">
            <div className="flex justify-between items-center mb-3">
               <div className="flex items-center gap-2">
                 <Bot size={20} className="text-indigo-200" />
                 <h3 className="font-bold">دستیار هوشمند</h3>
               </div>
               <div className="flex gap-2">
                 <button onClick={() => setShowExportMenu(!showExportMenu)} className="p-1 hover:bg-white/20 rounded-full relative" title="خروجی">
                    <Download size={18} />
                    {showExportMenu && (
                     <div className="absolute left-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl text-gray-800 dark:text-gray-200 z-50 text-xs py-1">
                       <div onClick={() => handleExport('pdf')} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-2"><Printer size={14}/> PDF / Print</div>
                       <div onClick={() => handleExport('html')} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-2"><FileText size={14}/> HTML</div>
                       <div onClick={() => handleExport('docs')} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-2"><FileText size={14}/> Word</div>
                     </div>
                    )}
                 </button>
                 <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full"><X size={18} /></button>
               </div>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-black/20 rounded-lg p-1">
              <button 
                onClick={() => setActiveTab('chat')} 
                className={`flex-1 py-1.5 text-xs rounded-md flex items-center justify-center gap-2 transition-all ${activeTab === 'chat' ? 'bg-white text-indigo-900 shadow font-bold' : 'text-indigo-100 hover:bg-white/10'}`}
              >
                <MessageSquare size={14}/> گفتگو
              </button>
              <button 
                onClick={() => setActiveTab('timeline')} 
                className={`flex-1 py-1.5 text-xs rounded-md flex items-center justify-center gap-2 transition-all ${activeTab === 'timeline' ? 'bg-white text-indigo-900 shadow font-bold' : 'text-indigo-100 hover:bg-white/10'}`}
              >
                <History size={14}/> گاه‌شمار تاریخی
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {activeTab === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-slate-800 scroll-smooth">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-500 text-white'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className="flex flex-col gap-1 max-w-[85%] group">
                      <div className={`p-3 rounded-2xl text-sm leading-7 shadow-sm relative ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-slate-600'}`}>
                        {/* SAFE RENDER: Check if text is string to prevent Error #31 */}
                        {typeof msg.text === 'string' ? msg.text : 'خطا در نمایش پیام'}
                        <button 
                          onClick={() => copyToClipboard(typeof msg.text === 'string' ? msg.text : '')}
                          className={`absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/10 ${msg.role === 'user' ? 'text-white' : 'text-gray-500'}`}
                          title="کپی"
                        >
                          <FileText size={12} />
                        </button>
                      </div>
                      {/* Render suggestions safely */}
                      {msg.relatedQuestions && Array.isArray(msg.relatedQuestions) && msg.relatedQuestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {msg.relatedQuestions.map((q, idx) => {
                             // Guard against object rendering
                             const safeQ = typeof q === 'string' ? q : String(q);
                             if (safeQ === '[object Object]') return null;
                             return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setInput(safeQ);
                                }}
                                className="text-[10px] px-2 py-1 rounded-full border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                              >
                                {safeQ}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                   <div className="flex gap-3 items-center animate-pulse">
                     <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white"><Bot size={16}/></div>
                     <div className="bg-white dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm"><Loader2 size={16} className="animate-spin text-teal-500" /></div>
                   </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                    placeholder="سوال شما..."
                    className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 resize-none max-h-24 dark:text-white"
                    rows={1}
                  />
                  <button onClick={handleSend} disabled={loading || !input.trim()} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Timeline Content */}
          {activeTab === 'timeline' && (
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-slate-800">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {TIMELINE_DATA.map((event, index) => (
                  <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-300 group-[.is-active]:bg-indigo-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <History size={16} />
                    </div>
                    
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">{event.title}</span>
                        <time className="font-mono italic text-indigo-500 text-xs">{event.year}</time>
                      </div>
                      <p className="text-slate-500 dark:text-slate-300 text-xs leading-5 text-justify">{event.description}</p>
                      {event.sourceUrl && (
                        <div className="mt-2 text-[10px] text-right">
                           <span className="inline-flex items-center gap-1 text-blue-500 opacity-70 cursor-not-allowed">
                             <ExternalLink size={10}/> سند معتبر
                           </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center text-xs text-gray-400 mt-8 mb-4">پایان رویدادهای کلیدی تا انقلاب ۵۷</div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AIChat;