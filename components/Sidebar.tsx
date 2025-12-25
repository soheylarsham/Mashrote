
import React, { useState, useMemo } from 'react';
import { CONSTITUTION_DATA } from '../constants';
import { ScrollText, BookOpen, Scale, FileClock, Search, ChevronDown, ChevronRight, X, Feather, Gavel, Scale as BalanceScale, ShieldAlert, MessageSquare, FileText } from 'lucide-react';
import { Section, ViewMode } from '../types';

interface SidebarProps {
  activeSection: string;
  onSelect: (id: string, view: ViewMode) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  currentView: ViewMode;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSelect, isOpen, onClose, onOpenSearch, currentView }) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'constitution': true,
    'supplement': true,
    'intro': true
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'intro': return <Feather size={16} />;
      case 'constitution': return <Scale size={16} />;
      case 'supplement': return <BookOpen size={16} />;
      default: return <ScrollText size={16} />;
    }
  };

  const groupedData = useMemo(() => {
    const groups: Record<string, Section[]> = {
      'intro': [],
      'constitution': [],
      'supplement': []
    };
    CONSTITUTION_DATA.forEach(item => {
      if (groups[item.category]) groups[item.category].push(item);
    });
    return groups;
  }, []);

  const groupTitles: Record<string, string> = {
    'intro': 'مقدمه',
    'constitution': 'قانون اساسی (اصلی)',
    'supplement': 'متمم قانون اساسی'
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden animate-fade-in" onClick={onClose} />}
      <aside 
        className={`fixed top-0 right-0 h-full w-80 bg-[var(--c-sidebar-bg)] text-[var(--c-sidebar-text)] border-l border-[var(--c-border)] transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) z-30 ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} shadow-2xl backdrop-blur-xl flex flex-col`}
        style={{ boxShadow: 'var(--c-shadow)' }}
      >
        {/* Header */}
        <div className="p-6 pb-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-l from-[var(--c-accent)] to-[var(--c-text-header)] drop-shadow-sm">
              مشروطه‌خواه
            </h1>
            <button onClick={onClose} className="md:hidden p-1 rounded-full hover:bg-[var(--c-sidebar-hover)]"><X size={20}/></button>
          </div>
          
          <div 
            onClick={onOpenSearch}
            className="group flex items-center gap-3 bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-2xl py-3 px-4 text-sm cursor-pointer shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
          >
             <Search size={18} className="opacity-50 group-hover:text-[var(--c-accent)] transition-colors" />
             <span className="opacity-60">جستجو در اصول...</span>
             <span className="mr-auto text-[10px] opacity-40 border border-[var(--c-border)] px-1.5 rounded">Ctrl+K</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 pt-2 space-y-6">
          
          {/* Special Sections */}
          <div className="space-y-2">
             <button
                onClick={() => { onSelect('m1', 'mossadegh'); if (window.innerWidth < 768) onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-3 text-right rounded-xl transition-all duration-300 group ${currentView === 'mossadegh' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)] font-bold shadow-lg' : 'hover:bg-[var(--c-sidebar-hover)] hover:pl-4 opacity-80'}`}
              >
                <Gavel size={18} />
                <span className="truncate text-sm">اقدامات دکتر مصدق</span>
              </button>

              <button
                onClick={() => { onSelect('t1', 'trial'); if (window.innerWidth < 768) onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-3 text-right rounded-xl transition-all duration-300 group ${currentView === 'trial' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)] font-bold shadow-lg' : 'hover:bg-[var(--c-sidebar-hover)] hover:pl-4 opacity-80'}`}
              >
                <FileText size={18} />
                <span className="truncate text-sm">دادگاه مصدق (اسناد)</span>
              </button>

              <button
                onClick={() => { onSelect('l1', 'analysis'); if (window.innerWidth < 768) onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-3 text-right rounded-xl transition-all duration-300 group hover:bg-[var(--c-sidebar-hover)] hover:pl-4 opacity-80 ${currentView === 'analysis' ? 'bg-[var(--c-sidebar-hover)] border border-[var(--c-border)] shadow-inner' : ''}`}
              >
                <BalanceScale size={18} />
                <span className="truncate text-sm">تحلیل حقوقی (مقدماتی)</span>
              </button>

              <button
                onClick={() => { onSelect('d1', 'debate'); if (window.innerWidth < 768) onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-3 text-right rounded-xl transition-all duration-300 group bg-gradient-to-l from-indigo-600/10 to-transparent hover:from-indigo-600/20 text-indigo-700 dark:text-indigo-400 ${currentView === 'debate' ? 'ring-1 ring-indigo-500 font-bold shadow-lg' : 'hover:pl-4 opacity-90'}`}
              >
                <MessageSquare size={18} className="text-indigo-600" />
                <span className="truncate text-sm font-bold">مناظره تاریخی (پرسش و پاسخ)</span>
              </button>

              <button
                onClick={() => { onSelect('c1', 'comprehensive'); if (window.innerWidth < 768) onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-3 text-right rounded-xl transition-all duration-300 group bg-gradient-to-l from-red-600/10 to-transparent hover:from-red-600/20 text-red-700 dark:text-red-400 ${currentView === 'comprehensive' ? 'ring-1 ring-red-500 font-bold shadow-lg' : 'hover:pl-4 opacity-90'}`}
              >
                <ShieldAlert size={18} className="text-red-600" />
                <span className="truncate text-sm font-bold">تحلیل بی‌طرفانه (جامع)</span>
              </button>
          </div>

          <div className="border-t border-[var(--c-border)] my-2 opacity-50"></div>

          {/* Main Laws Sections */}
          <div className="space-y-4">
            {Object.keys(groupedData).map(key => (
              <div key={key} className="space-y-2">
                <button 
                  onClick={() => toggleGroup(key)}
                  className="flex items-center w-full gap-2 text-xs font-bold opacity-60 hover:opacity-100 uppercase tracking-wider px-2"
                >
                  {expandedGroups[key] ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
                  {groupTitles[key]}
                </button>
                
                {expandedGroups[key] && (
                  <div className="space-y-1 animate-slide-in-up origin-top">
                    {groupedData[key].map((section) => (
                      <button
                        key={section.id}
                        onClick={() => { onSelect(section.id, 'laws'); if (window.innerWidth < 768) onClose(); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-right rounded-xl transition-all duration-300 group ${activeSection === section.id && currentView === 'laws' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)] font-bold shadow-lg scale-[1.02]' : 'hover:bg-[var(--c-sidebar-hover)] hover:pl-4 opacity-80'}`}
                      >
                        <span className={`shrink-0 transition-transform group-hover:scale-110 ${activeSection === section.id ? 'opacity-100' : 'opacity-70'}`}>{getIcon(section.category)}</span>
                        <span className="truncate text-sm">{section.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </nav>

        {/* Footer Info */}
        <div className="p-4 text-center text-[10px] opacity-40 border-t border-[var(--c-border)]">
          قانون اساسی مشروطه (۱۲۸۵)
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
