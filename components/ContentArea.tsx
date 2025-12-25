
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { CONSTITUTION_DATA } from '../constants';
import { ArticleAnalysis, HistoricalDoc, ViewMode } from '../types';
import { analyzeArticleAI, generateSpeechAI } from '../services/geminiService';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle, Loader2, ArrowRight, ArrowLeft, Volume2, StopCircle, FileText, Mic, AlertTriangle, Scale, ExternalLink } from 'lucide-react';
import InlineChat from './InlineChat';
import { HISTORICAL_DOCS } from '../data/articles';
import { MOSSADEGH_ACTIONS, MOSSADEGH_LEGAL_ANALYSIS } from '../data/mossadegh';
import { COMPREHENSIVE_DATA } from '../data/comprehensive_analysis';
import { DEBATE_DATA } from '../data/debate';
import { TRIAL_DATA } from '../data/trial';
import ComprehensiveView from './ComprehensiveView';
import DebateView from './DebateView';
import TrialView from './TrialView';
import ExportToolbar from './ExportToolbar';

const ArticleAnalysisBox: React.FC<{ title: string; content: string }> = ({ title, content }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<ArticleAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (analysis) { setIsOpen(!isOpen); return; }
    setIsOpen(true); setLoading(true);
    const data = await analyzeArticleAI(title, content);
    setAnalysis(data); setLoading(false);
  };

  return (
    <div className="mt-8 pt-6 border-t border-dashed border-[var(--c-border)]">
      <button 
        onClick={handleAnalyze}
        className="flex items-center gap-2 text-sm font-bold text-[var(--c-accent)] hover:scale-[1.02] transition-all bg-[var(--c-analysis-bg)] px-5 py-3 rounded-2xl w-full justify-between group shadow-sm"
      >
        <div className="flex items-center gap-2"><Sparkles size={18} className="animate-pulse" /><span>تفسیر هوشمند حقوقی</span></div>
        {isOpen ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
      </button>

      {isOpen && (
        <div className="mt-6 space-y-4 animate-fade-in text-sm text-[var(--c-text-main)]">
          {loading ? (
             <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[var(--c-accent)] w-8 h-8"/></div>
          ) : analysis ? (
            <div className="bg-[var(--c-analysis-bg)] p-6 rounded-2xl text-[var(--c-analysis-text)] border border-[var(--c-border)] shadow-inner">
              <h4 className="font-bold mb-3 flex items-center gap-2 text-lg"><CheckCircle size={18}/> تفسیر به زبان ساده:</h4>
              <p className="opacity-90 leading-8 text-justify">{analysis.modernText}</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-[var(--c-border)]">
                 <div className="bg-white/50 p-3 rounded-xl">
                    <span className="font-bold block mb-2 text-[var(--c-accent)]">زمینه تاریخی:</span>
                    <p className="text-xs leading-6">{analysis.historicalContext}</p>
                 </div>
                 <div className="bg-white/50 p-3 rounded-xl">
                    <span className="font-bold block mb-2 text-[var(--c-accent)]">نظر حقوقی:</span>
                    <p className="text-xs leading-6">{analysis.legalTruth}</p>
                 </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

// Component for Historical Article View
const HistoricalDocView: React.FC<{ doc: HistoricalDoc }> = ({ doc }) => {
  return (
    <article id="export-area" className="max-w-4xl mx-auto p-8 rounded-3xl bg-[var(--c-content-bg)] border border-[var(--c-border)] shadow-xl backdrop-blur-md animate-fade-in">
      <header className="mb-8 border-b border-[var(--c-border)] pb-4">
        <h1 className="text-3xl font-black text-[var(--c-text-header)] mb-2">{doc.title}</h1>
        <div className="flex items-center gap-2 text-xs opacity-60">
           <FileText size={14}/>
           <span>{doc.author || 'منابع تاریخی'}</span>
        </div>
      </header>
      
      <div className="prose prose-lg text-[var(--c-text-main)] leading-loose text-justify whitespace-pre-line">
        {doc.content}
      </div>

      {doc.footnotes && (
        <div className="mt-12 pt-8 border-t border-[var(--c-border)] bg-[var(--c-sidebar-bg)] p-6 rounded-2xl">
          <h3 className="font-bold mb-4 text-[var(--c-accent)]">پانویس‌ها</h3>
          <ul className="space-y-2 text-xs opacity-80">
            {Object.entries(doc.footnotes).map(([key, val]) => (
              <li key={key} className="flex gap-2">
                <span className="font-bold shrink-0">{key}</span>
                <span>{val}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {doc.references && (
        <div className="mt-6 p-6 rounded-2xl border border-[var(--c-border)] opacity-70">
           <h3 className="font-bold mb-2 text-xs uppercase tracking-wider">منابع</h3>
           <ul className="list-disc list-inside space-y-1 text-xs">
             {doc.references.map((ref, idx) => (
               <li key={idx} className="hover:text-[var(--c-accent)] cursor-pointer transition-colors">{ref}</li>
             ))}
           </ul>
        </div>
      )}
      
      <ExportToolbar elementId="export-area" title={doc.title} />
    </article>
  );
};

// Component for Mossadegh Actions View
const MossadeghActionsView: React.FC = () => {
  return (
    <div id="export-area" className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-32">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-black text-[var(--c-text-header)] drop-shadow-sm mb-4">اقدامات دکتر مصدق</h1>
        <p className="text-[var(--c-text-main)] opacity-70">بررسی تاریخی اقدامات سیاسی و حقوقی در دوران نخست‌وزیری (۱۳۳۰-۱۳۳۲)</p>
      </header>

      <div className="grid gap-6">
        {MOSSADEGH_ACTIONS.map((action, index) => (
          <div key={action.id} className="bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-2xl p-6 shadow-lg backdrop-blur-md relative overflow-hidden group hover:scale-[1.01] transition-transform">
             <div className="absolute top-0 right-0 w-2 h-full bg-[var(--c-accent)]"></div>
             <div className="flex justify-between items-start mb-4 pr-4">
                <h3 className="text-xl font-bold text-[var(--c-text-header)]">{action.title}</h3>
                <span className="text-xs font-mono bg-[var(--c-sidebar-bg)] px-2 py-1 rounded opacity-60">{action.date}</span>
             </div>
             <p className="text-justify leading-7 text-[var(--c-text-main)] opacity-90 pr-4">{action.description}</p>
             <div className="mt-4 pr-4 pt-4 border-t border-[var(--c-border)] flex flex-wrap gap-4 justify-between items-center">
                <span className={`text-[10px] px-2 py-1 rounded-full border ${action.category === 'political' ? 'border-purple-400 text-purple-600' : action.category === 'legal' ? 'border-blue-400 text-blue-600' : 'border-red-400 text-red-600'}`}>
                  {action.category === 'political' ? 'سیاسی' : action.category === 'legal' ? 'حقوقی' : 'نظامی/امنیتی'}
                </span>
                
                {action.sources && (
                  <div className="flex gap-2">
                    {action.sources.map((src, i) => (
                      <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] opacity-60 hover:opacity-100 hover:text-[var(--c-accent)] transition-colors">
                        <ExternalLink size={10}/> {src.title}
                      </a>
                    ))}
                  </div>
                )}
             </div>
          </div>
        ))}
      </div>
      
      <div className="bg-[var(--c-content-bg)] p-6 rounded-2xl border border-[var(--c-border)] mt-8">
         <ExportToolbar elementId="export-area" title="اقدامات مصدق" />
      </div>
    </div>
  );
}

// Component for Legal Analysis View
const LegalAnalysisView: React.FC = () => {
  return (
    <div id="export-area" className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-32">
      <header className="text-center mb-10 bg-red-500/10 p-8 rounded-3xl border border-red-500/20 backdrop-blur-xl">
        <h1 className="text-4xl font-black text-red-700 dark:text-red-400 drop-shadow-sm mb-4 flex items-center justify-center gap-3">
          <Scale size={36}/>
          تحلیل حقوقی اقدامات
        </h1>
        <p className="text-[var(--c-text-main)] opacity-80 max-w-2xl mx-auto leading-7">
          بررسی تطبیقی اقدامات دولت دکتر مصدق با اصول قانون اساسی مشروطه (۱۲۸۵) و متمم آن. 
          این بخش به واکاوی تعارضات حقوقی می‌پردازد.
        </p>
      </header>

      <div className="space-y-8">
        {MOSSADEGH_LEGAL_ANALYSIS.map((item, index) => (
          <div key={item.id} className="relative bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            {/* Header/ID */}
            <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-bl-2xl text-sm font-bold shadow-md z-10">
              مورد {index + 1}
            </div>

            {/* Left Column: Action */}
            <div className="md:w-1/3 bg-[var(--c-sidebar-bg)] p-6 border-l border-[var(--c-border)] flex flex-col justify-center relative">
               <h3 className="font-bold text-lg text-[var(--c-text-header)] mb-3 pt-4">{item.actionTitle}</h3>
               <p className="text-sm opacity-80 leading-6 text-justify">{item.actionDescription}</p>
               <div className="mt-4 pt-4 border-t border-[var(--c-border)]">
                 <span className="text-xs font-bold text-red-500 block mb-1">توجیه دولت وقت:</span>
                 <p className="text-xs italic opacity-70">{item.defenseView}</p>
               </div>
            </div>

            {/* Right Column: Violation */}
            <div className="md:w-2/3 p-6 bg-[var(--c-content-bg)]">
               <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-400 font-bold border-b border-red-200 dark:border-red-900/30 pb-2 w-fit">
                 <AlertTriangle size={18} />
                 <span>موارد نقض قانون اساسی</span>
               </div>
               
               <div className="flex flex-wrap gap-2 mb-4">
                 {item.violatedArticles.map((art, i) => (
                   <span key={i} className="px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 text-xs rounded-lg font-mono border border-red-200 dark:border-red-800">
                     {art}
                   </span>
                 ))}
               </div>

               <p className="text-sm leading-7 text-justify text-[var(--c-text-main)] bg-[var(--c-main-bg)] p-4 rounded-xl border border-[var(--c-border)]">
                 {item.legalExplanation}
               </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--c-content-bg)] p-6 rounded-2xl border border-[var(--c-border)] mt-8">
         <ExportToolbar elementId="export-area" title="تحلیل حقوقی اقدامات مصدق" />
      </div>
    </div>
  );
};

interface ContentAreaProps {
  activeSectionId: string;
  onNavigate: (id: string, view: ViewMode) => void;
  view: ViewMode;
}

const ContentArea: React.FC<ContentAreaProps> = ({ activeSectionId, onNavigate, view }) => {
  const { settings } = useTheme();

  // Laws View Logic
  const currentIndex = CONSTITUTION_DATA.findIndex(s => s.id === activeSectionId);
  const section = CONSTITUTION_DATA[currentIndex];
  
  // Historical View Logic
  const historicalDoc = HISTORICAL_DOCS.find(d => d.id === activeSectionId);

  const fontSizeClass = { 'small': 'text-sm leading-7', 'medium': 'text-base leading-9', 'large': 'text-lg leading-10', 'xlarge': 'text-xl leading-[3.5rem]' }[settings.fontSize];

  // TTS Logic (Selection & Full)
  const [selection, setSelection] = useState<{text: string, x: number, y: number} | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Selection TTS
  useEffect(() => {
    const handleMouseUp = () => {
      const sel = window.getSelection();
      if (sel && sel.toString().trim().length > 1) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0) {
           setSelection({
             text: sel.toString(),
             x: rect.left + (rect.width / 2) + window.scrollX,
             y: rect.top + window.scrollY - 50 
           });
        }
      } else {
        setTimeout(() => {
           if (!window.getSelection()?.toString()) {
              setSelection(null);
           }
        }, 100);
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const playAudio = async (text: string) => {
    if (audioUrl && isPlaying) { audioRef.current?.pause(); setIsPlaying(false); return; }
    
    // If resuming or playing same content
    if (audioUrl && !isPlaying) { audioRef.current?.play(); setIsPlaying(true); return; }

    setAudioLoading(true);
    const base64 = await generateSpeechAI(text, settings.audio);
    setAudioLoading(false);

    if (base64) {
       if (audioUrl) URL.revokeObjectURL(audioUrl); // cleanup previous
       const blob = await (await fetch(`data:audio/mp3;base64,${base64}`)).blob();
       const url = URL.createObjectURL(blob);
       setAudioUrl(url);
       if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.playbackRate = settings.audio.speed;
          audioRef.current.play();
          setIsPlaying(true);
       }
    }
  };

  const handleReadSelection = () => {
    if (selection) playAudio(selection.text);
  };

  const handleReadPage = () => {
    let textToRead = "";
    if (view === 'laws' && section) textToRead = section.title + ". " + section.content;
    else if (view === 'historical' && historicalDoc) textToRead = historicalDoc.title + ". " + historicalDoc.content.substring(0, 1000); 
    else if (view === 'mossadegh') textToRead = "اقدامات دکتر مصدق. " + MOSSADEGH_ACTIONS.map(a => a.title + ". " + a.description).join(". ");
    else if (view === 'analysis') textToRead = "تحلیل حقوقی اقدامات مصدق. " + MOSSADEGH_LEGAL_ANALYSIS.map(l => "اقدام: " + l.actionTitle + ". تحلیل: " + l.legalExplanation).join(". ");
    else if (view === 'comprehensive') textToRead = "تحلیل جامع و بی‌طرفانه وقایع. " + COMPREHENSIVE_DATA.map(c => c.title + ". " + c.neutralVerdict).join(". ");
    else if (view === 'debate') textToRead = "مناظره تاریخی. " + DEBATE_DATA.map(d => d.question + " پاسخ: " + d.answer).join(". ");
    else if (view === 'trial') textToRead = "مشروح مذاکرات دادگاه مصدق. " + TRIAL_DATA.map(t => t.title + ". " + t.summary).join(". ");
    
    if (textToRead) playAudio(textToRead);
  };

  useEffect(() => {
     return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }
  }, [audioUrl]);

  return (
    <main className="flex-1 p-4 md:p-10 min-h-screen md:w-full relative transition-all duration-500">
      
      {/* Top Controls */}
      <div className="fixed top-20 md:top-6 left-6 z-40 flex gap-2">
         <button 
           onClick={handleReadPage}
           className="bg-[var(--c-accent)] text-[var(--c-accent-text)] p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 text-xs font-bold"
           title="خواندن کل صفحه"
         >
           {audioLoading ? <Loader2 size={18} className="animate-spin"/> : isPlaying && !selection ? <StopCircle size={18}/> : <Volume2 size={18}/>}
           <span className="hidden md:inline">{isPlaying && !selection ? 'توقف خواندن' : 'خواندن صفحه'}</span>
         </button>
      </div>

      {view === 'laws' && section && (
        <div className="max-w-5xl mx-auto pb-32">
          <article 
            id="export-area"
            key={section.id} 
            className="group relative p-8 md:p-12 rounded-[2.5rem] border transition-all duration-500 animate-fade-in bg-[var(--c-content-bg)] text-[var(--c-text-main)] border-[var(--c-border)] shadow-2xl backdrop-blur-xl"
            style={{ boxShadow: 'var(--c-shadow)' }}
          >
            {/* Decorative Background Element */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[var(--c-accent)] to-transparent opacity-50"></div>

            <header className="mb-10 flex flex-col md:flex-row md:items-center gap-6 border-b border-[var(--c-border)] pb-6">
              <span className="flex items-center justify-center w-16 h-16 rounded-2xl font-black text-2xl bg-gradient-to-br from-[var(--c-accent)] to-purple-600 text-white shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform">
                {currentIndex + 1}
              </span>
              <div>
                <span className="text-xs font-bold tracking-widest uppercase opacity-60 block mb-1">
                  {section.category === 'constitution' ? 'قانون اساسی' : section.category === 'supplement' ? 'متمم قانون اساسی' : 'مقدمه'}
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-[var(--c-text-header)] tracking-tight">{section.title}</h2>
              </div>
            </header>

            <div className={`whitespace-pre-line text-justify ${fontSizeClass} text-inherit opacity-90 font-medium`}>
              {section.content}
            </div>
            
            {section.category !== 'intro' && <ArticleAnalysisBox title={section.title} content={section.content} />}
            
            <ExportToolbar elementId="export-area" title={section.title} />
          </article>
          
          <div className="flex justify-between items-center mt-8 px-4">
            <button 
              disabled={currentIndex <= 0}
              onClick={() => onNavigate(CONSTITUTION_DATA[currentIndex - 1].id, 'laws')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--c-content-bg)] border border-[var(--c-border)] text-[var(--c-text-main)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--c-accent)] hover:text-[var(--c-accent-text)] transition-all shadow-sm hover:shadow-lg"
            >
              <ArrowRight size={20}/> <span className="hidden md:inline">اصل قبلی</span>
            </button>
             
            <button 
              disabled={currentIndex >= CONSTITUTION_DATA.length - 1}
              onClick={() => onNavigate(CONSTITUTION_DATA[currentIndex + 1].id, 'laws')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--c-content-bg)] border border-[var(--c-border)] text-[var(--c-text-main)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--c-accent)] hover:text-[var(--c-accent-text)] transition-all shadow-sm hover:shadow-lg"
            >
              <span className="hidden md:inline">اصل بعدی</span> <ArrowLeft size={20}/>
            </button>
          </div>

          <InlineChat contextTitle={section.title} />
        </div>
      )}

      {view === 'historical' && historicalDoc && (
        <div className="pb-32">
           <HistoricalDocView doc={historicalDoc} />
        </div>
      )}

      {view === 'mossadegh' && (
        <div className="pb-32">
           <MossadeghActionsView />
        </div>
      )}

      {view === 'analysis' && (
        <div className="pb-32">
           <LegalAnalysisView />
        </div>
      )}

      {view === 'comprehensive' && (
        <div className="pb-32">
           <ComprehensiveView />
        </div>
      )}

      {view === 'debate' && (
        <div className="pb-32">
           <DebateView />
        </div>
      )}

      {view === 'trial' && (
        <div className="pb-32">
           <TrialView />
        </div>
      )}

      {/* Floating TTS Popup */}
      {selection && (
        <div 
          className="absolute z-50 transform -translate-x-1/2"
          style={{ left: selection.x, top: selection.y }}
        >
          <div className="flex items-center gap-3 bg-[var(--c-sidebar-bg)] backdrop-blur-xl border border-[var(--c-border)] p-2 pr-4 rounded-full shadow-2xl animate-fade-in ring-1 ring-white/20">
             <button 
               onClick={handleReadSelection}
               className="flex items-center gap-2 text-xs font-bold text-[var(--c-accent)] hover:text-[var(--c-text-header)] transition-colors whitespace-nowrap"
             >
               {audioLoading ? <Loader2 size={16} className="animate-spin"/> : isPlaying && selection ? <StopCircle size={16}/> : <Volume2 size={16}/>}
               {isPlaying && selection ? 'توقف' : 'خواندن'}
             </button>
             <div className="w-px h-4 bg-[var(--c-border)]"></div>
             <button onClick={() => setSelection(null)} className="p-1 hover:bg-black/5 rounded-full"><ArrowLeft size={12} className="rotate-[-90deg]"/></button>
             <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
          </div>
          <div className="w-3 h-3 bg-[var(--c-sidebar-bg)] border-r border-b border-[var(--c-border)] transform rotate-45 absolute left-1/2 -bottom-1.5 -translate-x-1/2 backdrop-blur-xl"></div>
        </div>
      )}
    </main>
  );
};

export default ContentArea;
