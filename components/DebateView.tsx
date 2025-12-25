import React, { useState } from 'react';
import { DEBATE_DATA } from '../data/debate';
import { MessageSquare, ChevronDown, ChevronUp, AlertTriangle, Shield, Scale, BookOpen, Users, Gavel } from 'lucide-react';
import ExportToolbar from './ExportToolbar';

const DebateView: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<string>('all');

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'institutions': return <BookOpen size={16} />;
      case 'elections': return <Users size={16} />;
      case 'coup': return <AlertTriangle size={16} />;
      case 'shah': return <Shield size={16} />;
      case 'lists': return <Gavel size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'institutions': return 'نهادها و اختیارات';
      case 'elections': return 'انتخابات و مجلس';
      case 'coup': return 'کودتا یا قیام؟';
      case 'shah': return 'تقابل با شاه';
      case 'lists': return 'لیست‌های مستند';
      default: return 'سایر';
    }
  };

  const filteredData = filter === 'all' ? DEBATE_DATA : DEBATE_DATA.filter(d => d.category === filter);

  return (
    <div id="export-area" className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-32">
      <header className="text-center mb-8 bg-gradient-to-br from-indigo-900/10 to-transparent p-8 rounded-3xl border border-indigo-500/20 backdrop-blur-xl">
        <h1 className="text-3xl md:text-4xl font-black text-indigo-800 dark:text-indigo-300 drop-shadow-sm mb-4 flex items-center justify-center gap-3">
          <MessageSquare size={36}/>
          مناظره و واکاوی تاریخی
        </h1>
        <p className="text-[var(--c-text-main)] opacity-80 max-w-2xl mx-auto leading-7 text-sm">
          این بخش شامل پرسش و پاسخ‌های صریح و چالشی درباره وقایع دوران دکتر مصدق، کودتای ۲۸ مرداد و مسائل حقوقی مرتبط است. 
          محتوا بر اساس استدلال‌های دقیق تاریخی و بدون سانسور گردآوری شده است.
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${filter === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-[var(--c-content-bg)] border border-[var(--c-border)] hover:bg-[var(--c-sidebar-hover)]'}`}>همه</button>
        {['institutions', 'elections', 'shah', 'coup', 'lists'].map(cat => (
          <button 
            key={cat} 
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${filter === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-[var(--c-content-bg)] border border-[var(--c-border)] hover:bg-[var(--c-sidebar-hover)]'}`}
          >
            {getCategoryIcon(cat)} {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <button 
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-start gap-4 p-5 text-right hover:bg-[var(--c-sidebar-hover)] transition-colors"
            >
              <div className={`mt-1 p-2 rounded-lg shrink-0 ${openItems[item.id] ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                {getCategoryIcon(item.category)}
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold opacity-50 uppercase tracking-wider mb-1 block">{getCategoryLabel(item.category)}</span>
                <h3 className="font-bold text-[var(--c-text-header)] text-sm md:text-base leading-7">{item.question}</h3>
              </div>
              <div className="mt-1 opacity-50">
                {openItems[item.id] ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
              </div>
            </button>
            
            {openItems[item.id] && (
              <div className="p-6 pt-0 border-t border-[var(--c-border)] bg-[var(--c-main-bg)]/30 animate-fade-in">
                <div className="prose prose-sm max-w-none text-[var(--c-text-main)] leading-8 text-justify whitespace-pre-line mt-4">
                  <div className="flex gap-3 mb-2">
                    <Scale className="text-indigo-500 shrink-0" size={20}/>
                    <span className="font-bold text-indigo-600">پاسخ تحلیلی:</span>
                  </div>
                  {item.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-[var(--c-content-bg)] p-6 rounded-2xl border border-[var(--c-border)] mt-8">
         <ExportToolbar elementId="export-area" title="مناظره تاریخی مشروطه" />
      </div>
    </div>
  );
};

export default DebateView;