import React, { useState, useEffect, useRef } from 'react';
import { CONSTITUTION_DATA } from '../constants';
import { HISTORICAL_DOCS } from '../data/articles';
import { MOSSADEGH_ACTIONS, MOSSADEGH_LEGAL_ANALYSIS } from '../data/mossadegh';
import { COMPREHENSIVE_DATA } from '../data/comprehensive_analysis';
import { Section, HistoricalDoc, ActionItem, ViewMode } from '../types';
import { Search, X, ArrowRight, FileText, Scale, Gavel, Scale as BalanceScale, ShieldAlert } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'law' | 'doc' | 'action' | 'analysis' | 'comprehensive';
  sourceLabel: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string, view: ViewMode) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    
    const allResults: SearchResult[] = [];

    // Search Laws
    CONSTITUTION_DATA.forEach(item => {
      if (item.content.includes(query) || item.title.includes(query)) {
        allResults.push({
          id: item.id,
          title: item.title,
          content: item.content,
          type: 'law',
          sourceLabel: item.category === 'constitution' ? 'قانون اساسی' : item.category === 'supplement' ? 'متمم' : 'مقدمه'
        });
      }
    });

    // Search Historical Docs
    HISTORICAL_DOCS.forEach(doc => {
      if (doc.content.includes(query) || doc.title.includes(query)) {
        allResults.push({
          id: doc.id,
          title: doc.title,
          content: doc.content,
          type: 'doc',
          sourceLabel: 'سند تاریخی'
        });
      }
    });

    // Search Mossadegh Actions
    MOSSADEGH_ACTIONS.forEach(action => {
      if (action.description.includes(query) || action.title.includes(query)) {
        allResults.push({
          id: action.id,
          title: action.title,
          content: action.description,
          type: 'action',
          sourceLabel: 'اقدامات مصدق'
        });
      }
    });

    // Search Legal Analysis
    MOSSADEGH_LEGAL_ANALYSIS.forEach(analysis => {
      if (analysis.legalExplanation.includes(query) || analysis.actionTitle.includes(query) || analysis.violatedArticles.some(a => a.includes(query))) {
        allResults.push({
          id: analysis.id,
          title: "تحلیل حقوقی: " + analysis.actionTitle,
          content: analysis.legalExplanation,
          type: 'analysis',
          sourceLabel: 'تحلیل حقوقی'
        });
      }
    });

    // Search Comprehensive Analysis
    COMPREHENSIVE_DATA.forEach(item => {
      if (item.neutralVerdict.includes(query) || item.title.includes(query) || item.description.includes(query)) {
        allResults.push({
          id: item.id,
          title: "تحلیل جامع: " + item.title,
          content: item.neutralVerdict,
          type: 'comprehensive',
          sourceLabel: 'تحلیل بی‌طرفانه'
        });
      }
    });

    setResults(allResults);
  }, [query]);

  const getHighlightedText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? <span key={i} className="bg-yellow-300 text-black px-1 rounded">{part}</span> : part
        )}
      </span>
    );
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'law': return <Scale size={14}/>;
      case 'doc': return <FileText size={14}/>;
      case 'action': return <Gavel size={14}/>;
      case 'analysis': return <BalanceScale size={14}/>;
      case 'comprehensive': return <ShieldAlert size={14}/>;
      default: return <Scale size={14}/>;
    }
  };

  const getViewMode = (type: string): ViewMode => {
    switch(type) {
      case 'law': return 'laws';
      case 'doc': return 'historical';
      case 'action': return 'mossadegh';
      case 'analysis': return 'analysis';
      case 'comprehensive': return 'comprehensive';
      default: return 'laws';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 animate-fade-in font-vazir">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[var(--c-content-bg)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-[var(--c-border)] animate-slide-in-up">
        
        {/* Search Input */}
        <div className="flex items-center gap-4 p-6 border-b border-[var(--c-border)] bg-[var(--c-sidebar-bg)]">
          <Search size={24} className="text-[var(--c-accent)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در قوانین، اسناد و رویدادها..."
            className="flex-1 bg-transparent text-lg outline-none text-[var(--c-text-header)] placeholder-opacity-50"
          />
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--c-sidebar-hover)]"><X size={20}/></button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[var(--c-content-bg)]">
          {results.length === 0 && query && (
             <div className="text-center py-10 opacity-50">نتیجه‌ای یافت نشد.</div>
          )}
          {results.length === 0 && !query && (
             <div className="text-center py-10 opacity-50">برای جستجو تایپ کنید...</div>
          )}
          
          <div className="space-y-3">
            {results.map((item) => (
              <div 
                key={item.id}
                onClick={() => { onSelect(item.id, getViewMode(item.type)); onClose(); }}
                className="group p-4 rounded-2xl border border-[var(--c-border)] hover:border-[var(--c-accent)] bg-[var(--c-main-bg)] cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${item.type === 'comprehensive' ? 'bg-red-200 text-red-900' : item.type === 'analysis' ? 'bg-red-100 text-red-700' : 'bg-[var(--c-sidebar-hover)] text-[var(--c-accent)]'}`}>
                    {getIcon(item.type)} {item.sourceLabel}
                  </span>
                  <span className="text-xs opacity-50 flex items-center gap-1">
                     شناسه <span className="font-mono text-sm font-bold">{item.id.replace(/[^0-9]/g, '')}</span>
                  </span>
                </div>
                <h3 className="font-bold text-[var(--c-text-header)] mb-1">{item.title}</h3>
                <p className="text-sm opacity-80 line-clamp-2 leading-6">
                  {getHighlightedText(item.content, query)}
                </p>
                <div className="mt-2 flex justify-end">
                   <span className="text-xs text-[var(--c-accent)] group-hover:translate-x-[-5px] transition-transform flex items-center gap-1">مشاهده کامل <ArrowRight size={12} className="rotate-180"/></span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-3 text-center text-xs opacity-40 bg-[var(--c-sidebar-bg)] border-t border-[var(--c-border)]">
          {results.length} مورد یافت شد
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;