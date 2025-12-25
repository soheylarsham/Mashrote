
import React, { useState } from 'react';
import { TRIAL_DATA } from '../data/trial';
import { Gavel, ExternalLink, ChevronDown, ChevronUp, Mic, FileText, User } from 'lucide-react';
import ExportToolbar from './ExportToolbar';

const TrialView: React.FC = () => {
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({});

  const toggleSession = (id: string) => {
    setExpandedSessions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;

      let speakerClass = "text-[var(--c-text-main)]";
      let speakerName = "";
      let content = trimmed;

      if (trimmed.startsWith("رئیس:")) {
        speakerClass = "text-red-600 dark:text-red-400 font-bold";
        speakerName = "رئیس دادگاه";
        content = trimmed.replace("رئیس:", "").trim();
      } else if (trimmed.startsWith("محمد مصدق:")) {
        speakerClass = "text-[var(--c-accent)] font-bold";
        speakerName = "دکتر مصدق";
        content = trimmed.replace("محمد مصدق:", "").trim();
      } else if (trimmed.startsWith("دادستان:")) {
        speakerClass = "text-orange-600 dark:text-orange-400 font-bold";
        speakerName = "دادستان (آزموده)";
        content = trimmed.replace("دادستان:", "").trim();
      } else if (trimmed.startsWith("سرهنگ نادری:") || trimmed.startsWith("مهندس معظمی:") || trimmed.startsWith("سرتیپ ریاحی:")) {
        speakerClass = "text-purple-600 dark:text-purple-400 font-bold";
        speakerName = trimmed.split(':')[0];
        content = trimmed.replace(`${speakerName}:`, "").trim();
      }

      // Detect descriptive text in parenthesis or descriptions
      if (trimmed.startsWith("(") || trimmed.includes("در این موقع") || trimmed.includes("تشکیل مجدد")) {
         return <p key={idx} className="text-xs opacity-60 italic my-2 text-center bg-[var(--c-sidebar-bg)] p-1 rounded">{trimmed}</p>;
      }

      return (
        <div key={idx} className="mb-4">
          {speakerName && (
            <span className={`block text-xs mb-1 ${speakerClass}`}>
              {speakerName}
            </span>
          )}
          <p className={`text-sm leading-7 text-justify ${!speakerName ? 'opacity-80' : ''}`}>
            {content}
          </p>
        </div>
      );
    });
  };

  return (
    <div id="export-area" className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-32">
      <header className="text-center mb-10 bg-gradient-to-br from-[var(--c-content-bg)] to-[var(--c-sidebar-bg)] p-8 rounded-3xl border border-[var(--c-border)] shadow-lg backdrop-blur-xl">
        <h1 className="text-3xl md:text-4xl font-black text-[var(--c-text-header)] drop-shadow-sm mb-4 flex items-center justify-center gap-3">
          <Gavel size={36} className="text-[var(--c-accent)]"/>
          دادگاه دکتر مصدق
        </h1>
        <p className="text-[var(--c-text-main)] opacity-80 max-w-2xl mx-auto leading-7 text-sm">
          مشروح مذاکرات دادگاه نظامی پس از وقایع ۲۸ مرداد ۱۳۳۲. 
          این اسناد شامل دفاعیات حقوقی، بحث‌های سیاسی و جدال‌های لفظی میان متهمین و مقامات دادگاه است.
        </p>
      </header>

      <div className="space-y-6">
        {TRIAL_DATA.map((session) => (
          <div key={session.id} className="bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-2xl shadow-md overflow-hidden transition-all duration-300">
            
            <div 
              onClick={() => toggleSession(session.id)}
              className="p-5 flex items-center justify-between cursor-pointer bg-[var(--c-sidebar-bg)] hover:bg-[var(--c-main-bg)] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[var(--c-accent)]/10 text-[var(--c-accent)] p-3 rounded-xl">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 bg-[var(--c-accent)] text-[var(--c-accent-text)] rounded shadow-sm">{session.sessionNumber}</span>
                    <span className="text-[10px] opacity-60 font-mono">{session.date}</span>
                  </div>
                  <h3 className="font-bold text-[var(--c-text-header)]">{session.title}</h3>
                </div>
              </div>
              <div className="opacity-50">
                {expandedSessions[session.id] ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>

            {expandedSessions[session.id] && (
              <div className="p-6 border-t border-[var(--c-border)] bg-[var(--c-main-bg)]/50 animate-fade-in">
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-xl">
                  <h4 className="text-xs font-bold text-yellow-800 dark:text-yellow-500 mb-2 flex items-center gap-2"><Mic size={14}/> خلاصه مذاکرات</h4>
                  <p className="text-xs text-[var(--c-text-main)] opacity-90 leading-6">{session.summary}</p>
                </div>

                <div className="prose prose-sm max-w-none">
                  {formatText(session.content)}
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--c-border)] flex justify-between items-center">
                   <a 
                     href={session.sourceUrl} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-[10px] flex items-center gap-1 text-[var(--c-accent)] hover:underline opacity-80"
                   >
                     <ExternalLink size={12}/> مشاهده منبع اصلی (mashruteh.org)
                   </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-[var(--c-content-bg)] p-6 rounded-2xl border border-[var(--c-border)] mt-8">
         <ExportToolbar elementId="export-area" title="دادگاه دکتر مصدق" />
      </div>
    </div>
  );
};

export default TrialView;
