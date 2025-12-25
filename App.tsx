
import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CONSTITUTION_DATA } from './constants';
import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';
import SplashScreen from './components/SplashScreen';
import ContentArea from './components/ContentArea';
import SearchOverlay from './components/SearchOverlay';
import AIChat from './components/AIChat'; 
import { Menu, Search, ChevronRight, History, BookOpen, FileText, Gavel, Scale, MessageSquare } from 'lucide-react';
import { HISTORICAL_DOCS } from './data/articles';
import { ViewMode } from './types';

const MainLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState(CONSTITUTION_DATA[0]?.id || '');
  const [currentView, setCurrentView] = useState<ViewMode>('laws');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const { settings } = useTheme();

  const handleNavigate = (id: string, view: ViewMode) => {
    setCurrentView(view);
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSidebarOpen(false);
  };

  const shouldShowSplash = settings.showSplashScreen && showSplash;

  return (
    <>
      {shouldShowSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} onSelect={handleNavigate} />
      
      <div className={`min-h-screen flex flex-col relative overflow-x-hidden ${shouldShowSplash ? 'hidden' : 'flex'}`}>
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[var(--c-sidebar-bg)] backdrop-blur-md sticky top-0 z-20 shadow-sm border-b border-[var(--c-border)]">
          <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-l from-[var(--c-accent)] to-[var(--c-text-header)]">مشروطه‌خواه</h1>
          <div className="flex gap-2">
             <button onClick={() => setSearchOpen(true)} className="p-2"><Search size={20}/></button>
             <button onClick={() => setSidebarOpen(true)} className="p-2"><Menu size={20}/></button>
          </div>
        </div>

        {/* Toggle Sidebar Desktop */}
        <button 
          onClick={() => setSidebarHidden(!sidebarHidden)} 
          className="hidden md:flex fixed top-6 right-6 z-40 p-3 bg-[var(--c-content-bg)] text-[var(--c-text-main)] rounded-full shadow-xl border border-[var(--c-border)] hover:scale-110 transition-transform backdrop-blur-xl"
        >
          {sidebarHidden ? <Menu size={20}/> : <ChevronRight size={20}/>}
        </button>

        {/* Sidebar */}
        <div className={`fixed inset-y-0 right-0 z-30 transition-transform duration-500 ${sidebarHidden ? 'translate-x-full' : 'translate-x-0'}`}>
          <Sidebar 
            activeSection={activeSection} 
            onSelect={handleNavigate} 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onOpenSearch={() => setSearchOpen(true)}
            currentView={currentView}
          />
        </div>

        {/* Top Tab Bar (Desktop) */}
        <div className={`hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-30 bg-[var(--c-sidebar-bg)] backdrop-blur-xl border border-[var(--c-border)] rounded-full p-1 shadow-lg transition-all duration-500 ${sidebarHidden ? 'w-[850px]' : 'w-[800px]'}`}>
           <button 
             onClick={() => { setCurrentView('laws'); setActiveSection(CONSTITUTION_DATA[0].id); }}
             className={`flex-1 py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${currentView === 'laws' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)] shadow-md' : 'hover:bg-[var(--c-sidebar-hover)]'}`}
           >
             <BookOpen size={16}/> قوانین
           </button>
           <button 
             onClick={() => { setCurrentView('historical'); setActiveSection(HISTORICAL_DOCS[0].id); }}
             className={`flex-1 py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${currentView === 'historical' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)] shadow-md' : 'hover:bg-[var(--c-sidebar-hover)]'}`}
           >
             <FileText size={16}/> اسناد
           </button>
           <button 
             onClick={() => { setCurrentView('mossadegh'); setActiveSection('m1'); }}
             className={`flex-1 py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${currentView === 'mossadegh' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)] shadow-md' : 'hover:bg-[var(--c-sidebar-hover)]'}`}
           >
             <Gavel size={16}/> اقدامات مصدق
           </button>
           <button 
             onClick={() => { setCurrentView('trial'); setActiveSection('t1'); }}
             className={`flex-1 py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${currentView === 'trial' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)] shadow-md' : 'hover:bg-[var(--c-sidebar-hover)]'}`}
           >
             <Scale size={16}/> دادگاه
           </button>
           <button 
             onClick={() => { setCurrentView('analysis'); setActiveSection('l1'); }}
             className={`flex-1 py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${currentView === 'analysis' ? 'bg-red-500 text-white shadow-md' : 'hover:bg-[var(--c-sidebar-hover)] text-red-500'}`}
           >
             <Scale size={16}/> تحلیل حقوقی
           </button>
           <button 
             onClick={() => { setCurrentView('debate'); setActiveSection('d1'); }}
             className={`flex-1 py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${currentView === 'debate' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-[var(--c-sidebar-hover)] text-indigo-500'}`}
           >
             <MessageSquare size={16}/> مناظره تاریخی
           </button>
        </div>
        
        {/* Mobile Tab Bar */}
        <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-[var(--c-sidebar-bg)] backdrop-blur-xl border-t border-[var(--c-border)] flex justify-around p-2 pb-safe">
           <button onClick={() => setCurrentView('laws')} className={`flex flex-col items-center p-2 text-[10px] ${currentView === 'laws' ? 'text-[var(--c-accent)]' : 'opacity-60'}`}>
             <BookOpen size={20} className="mb-1"/> قوانین
           </button>
           <button onClick={() => setCurrentView('mossadegh')} className={`flex flex-col items-center p-2 text-[10px] ${currentView === 'mossadegh' ? 'text-[var(--c-accent)]' : 'opacity-60'}`}>
             <Gavel size={20} className="mb-1"/> مصدق
           </button>
           <button onClick={() => setCurrentView('trial')} className={`flex flex-col items-center p-2 text-[10px] ${currentView === 'trial' ? 'text-[var(--c-accent)]' : 'opacity-60'}`}>
             <Scale size={20} className="mb-1"/> دادگاه
           </button>
           <button onClick={() => setCurrentView('analysis')} className={`flex flex-col items-center p-2 text-[10px] ${currentView === 'analysis' ? 'text-red-500' : 'opacity-60 text-red-400'}`}>
             <Scale size={20} className="mb-1"/> تحلیل
           </button>
        </div>

        <div className={`${!sidebarHidden ? 'md:mr-80' : ''} transition-all duration-500 flex justify-center pt-20 md:pt-0`}>
           <ContentArea 
             activeSectionId={activeSection} 
             onNavigate={handleNavigate}
             view={currentView}
           />
        </div>

        <AIChat />
        <SettingsPanel />
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
  );
};

export default App;
