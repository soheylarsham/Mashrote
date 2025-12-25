import { Section, ThemeColors, ThemePreset } from './types';
import { sourceData } from './data/source';
import { MOSSADEGH_ACTIONS, MOSSADEGH_LEGAL_ANALYSIS } from './data/mossadegh';
import { COMPREHENSIVE_DATA } from './data/comprehensive_analysis';
import { HISTORICAL_DOCS } from './data/articles';

// Utility function to convert source data to Section[]
const transformData = (): Section[] => {
  const sections: Section[] = [];

  // Introduction
  sections.push({
    id: 'intro',
    title: sourceData.introduction.title,
    content: sourceData.introduction.content,
    category: 'intro'
  });

  // Constitution
  sourceData.constitution.forEach((item: any) => {
    sections.push({
      id: `const_${item.id}`,
      title: item.title,
      content: item.content,
      category: 'constitution'
    });
  });

  // Amendment
  sourceData.amendment.forEach((item: any) => {
    sections.push({
      id: `amend_${item.id}`,
      title: item.title,
      content: item.content,
      category: 'supplement'
    });
  });

  return sections;
};

export const CONSTITUTION_DATA: Section[] = transformData();

// Combine all data for AI Context
const mossadeghContext = MOSSADEGH_ACTIONS.map(a => `اقدام مصدق: ${a.title} - ${a.description}`).join('\n');
const legalContext = MOSSADEGH_LEGAL_ANALYSIS.map(l => `تحلیل حقوقی اقدام ${l.actionTitle}: اصول نقض شده: ${l.violatedArticles.join(', ')}. توضیح: ${l.legalExplanation}`).join('\n');
const comprehensiveContext = COMPREHENSIVE_DATA.map(c => `تحلیل جامع ${c.title}: حکم بی‌طرفانه: ${c.neutralVerdict} (نمره قانونی: ${c.legalityScore}/100)`).join('\n');
const docsContext = HISTORICAL_DOCS.map(d => `سند تاریخی: ${d.title}\n${d.content}`).join('\n');

export const FULL_TEXT_CONTEXT = [
  ...CONSTITUTION_DATA.map(s => `=== ${s.title} ===\n${s.content}`),
  "=== اقدامات مصدق و تحلیل حقوقی ===",
  mossadeghContext,
  legalContext,
  comprehensiveContext,
  "=== اسناد تاریخی ===",
  docsContext
].join('\n\n');

export const THEME_PRESETS: Record<ThemePreset, ThemeColors> = {
  modern: {
    mainBg: '#f0f2f5', 
    sidebarBg: 'rgba(255, 255, 255, 0.7)',
    sidebarText: '#1e293b',
    sidebarHover: 'rgba(0, 0, 0, 0.05)',
    contentBg: 'rgba(255, 255, 255, 0.8)',
    textMain: '#334155',
    textHeader: '#0f172a',
    accent: '#3b82f6',
    accentText: '#ffffff',
    border: '#cbd5e1',
    chatUserBg: '#3b82f6',
    chatBotBg: '#f1f5f9',
    chatText: '#1e293b',
    analysisBg: '#eff6ff',
    analysisText: '#1e3a8a',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  royal: {
    mainBg: '#2e0a24',
    sidebarBg: 'rgba(74, 14, 54, 0.6)',
    sidebarText: '#ffd700',
    sidebarHover: 'rgba(255, 215, 0, 0.1)',
    contentBg: 'rgba(46, 10, 36, 0.8)',
    textMain: '#fce7f3',
    textHeader: '#ffd700',
    accent: '#9d174d',
    accentText: '#ffffff',
    border: '#831843',
    chatUserBg: '#831843',
    chatBotBg: '#500724',
    chatText: '#fce7f3',
    analysisBg: 'rgba(131, 24, 67, 0.3)',
    analysisText: '#fbcfe8',
    shadow: '0 0 15px rgba(255, 215, 0, 0.1)',
  },
  cyberpunk: {
    mainBg: '#050505',
    sidebarBg: 'rgba(10, 10, 10, 0.8)',
    sidebarText: '#00ff00',
    sidebarHover: 'rgba(0, 255, 0, 0.1)',
    contentBg: 'rgba(20, 20, 20, 0.85)',
    textMain: '#e0e0e0',
    textHeader: '#00ff00',
    accent: '#d900d9',
    accentText: '#ffffff',
    border: '#333',
    chatUserBg: '#00ff00',
    chatBotBg: '#111',
    chatText: '#fff',
    analysisBg: 'rgba(0, 255, 0, 0.05)',
    analysisText: '#00ff00',
    shadow: '0 0 10px rgba(0, 255, 0, 0.3)',
  },
  nature: {
    mainBg: '#f0fdf4',
    sidebarBg: 'rgba(20, 83, 45, 0.8)',
    sidebarText: '#dcfce7',
    sidebarHover: 'rgba(255, 255, 255, 0.1)',
    contentBg: 'rgba(255, 255, 255, 0.9)',
    textMain: '#14532d',
    textHeader: '#052e16',
    accent: '#15803d',
    accentText: '#ffffff',
    border: '#86efac',
    chatUserBg: '#166534',
    chatBotBg: '#dcfce7',
    chatText: '#052e16',
    analysisBg: '#f0fdf4',
    analysisText: '#14532d',
    shadow: '0 4px 6px rgba(22, 101, 52, 0.1)',
  },
  paper: {
    mainBg: '#f5f5dc',
    sidebarBg: 'rgba(62, 39, 35, 0.8)',
    sidebarText: '#d7ccc8',
    sidebarHover: 'rgba(255, 255, 255, 0.1)',
    contentBg: 'rgba(253, 246, 227, 0.9)',
    textMain: '#3e2723',
    textHeader: '#261815',
    accent: '#8d6e63',
    accentText: '#ffffff',
    border: '#d7ccc8',
    chatUserBg: '#5d4037',
    chatBotBg: '#efebe9',
    chatText: '#3e2723',
    analysisBg: '#fff8e1',
    analysisText: '#4e342e',
    shadow: '3px 3px 5px rgba(62, 39, 35, 0.2)',
  },
  sunset: {
    mainBg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    sidebarBg: 'rgba(255, 255, 255, 0.3)', 
    sidebarText: '#863a55',
    sidebarHover: 'rgba(255, 255, 255, 0.4)',
    contentBg: 'rgba(255, 255, 255, 0.6)',
    textMain: '#5d2e0e',
    textHeader: '#d35400',
    accent: '#ff6b6b',
    accentText: '#ffffff',
    border: 'rgba(255, 255, 255, 0.5)',
    chatUserBg: '#ff6b6b',
    chatBotBg: 'rgba(255, 255, 255, 0.8)',
    chatText: '#5d2e0e',
    analysisBg: 'rgba(255, 248, 225, 0.6)',
    analysisText: '#e67e22',
    shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
  },
  ocean: {
    mainBg: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
    sidebarBg: 'rgba(255, 255, 255, 0.1)',
    sidebarText: '#e0f7fa',
    sidebarHover: 'rgba(255, 255, 255, 0.15)',
    contentBg: 'rgba(0, 0, 0, 0.4)',
    textMain: '#e0f7fa',
    textHeader: '#80deea',
    accent: '#00e5ff',
    accentText: '#000000',
    border: 'rgba(255, 255, 255, 0.2)',
    chatUserBg: '#00bcd4',
    chatBotBg: 'rgba(0, 96, 100, 0.6)',
    chatText: '#e0f7fa',
    analysisBg: 'rgba(0, 96, 100, 0.5)',
    analysisText: '#80deea',
    shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  },
  nebula: {
    mainBg: 'linear-gradient(to right, #24243e, #302b63, #0f0c29)',
    sidebarBg: 'rgba(255, 255, 255, 0.05)',
    sidebarText: '#e0c3fc',
    sidebarHover: 'rgba(255, 255, 255, 0.1)',
    contentBg: 'rgba(15, 12, 41, 0.7)',
    textMain: '#d1c4e9',
    textHeader: '#b39ddb',
    accent: '#7e57c2',
    accentText: '#ffffff',
    border: 'rgba(126, 87, 194, 0.3)',
    chatUserBg: '#673ab7',
    chatBotBg: 'rgba(49, 27, 146, 0.6)',
    chatText: '#ede7f6',
    analysisBg: 'rgba(74, 20, 140, 0.5)',
    analysisText: '#d1c4e9',
    shadow: '0 0 20px rgba(126, 87, 194, 0.2)',
  },
  fire: {
    mainBg: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
    sidebarBg: 'rgba(0, 0, 0, 0.3)',
    sidebarText: '#fff5f5',
    sidebarHover: 'rgba(255, 255, 255, 0.2)',
    contentBg: 'rgba(255, 255, 255, 0.9)',
    textMain: '#5a0000',
    textHeader: '#b30000',
    accent: '#ff9800',
    accentText: '#ffffff',
    border: '#ff5722',
    chatUserBg: '#ff5722',
    chatBotBg: '#ffebee',
    chatText: '#b71c1c',
    analysisBg: '#fff3e0',
    analysisText: '#e65100',
    shadow: '0 10px 20px rgba(255, 75, 43, 0.3)',
  },
  magic: {
    mainBg: 'linear-gradient(45deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
    sidebarBg: 'rgba(255, 255, 255, 0.2)',
    sidebarText: '#2a0a4e',
    sidebarHover: 'rgba(255, 255, 255, 0.3)',
    contentBg: 'rgba(255, 255, 255, 0.7)',
    textMain: '#2a0a4e',
    textHeader: '#6a1b9a',
    accent: '#aa00ff',
    accentText: '#ffffff',
    border: 'rgba(255, 255, 255, 0.5)',
    chatUserBg: '#7b1fa2',
    chatBotBg: 'rgba(255, 255, 255, 0.8)',
    chatText: '#4a148c',
    analysisBg: 'rgba(255, 253, 231, 0.6)',
    analysisText: '#f57f17',
    shadow: '0 8px 32px rgba(31, 38, 135, 0.2)',
  },
  autumn: {
    mainBg: 'linear-gradient(to top, #966138 0%, #e8b682 100%)',
    sidebarBg: 'rgba(62, 39, 35, 0.6)',
    sidebarText: '#efebe9',
    sidebarHover: 'rgba(255, 255, 255, 0.1)',
    contentBg: 'rgba(255, 253, 231, 0.8)',
    textMain: '#3e2723',
    textHeader: '#bf360c',
    accent: '#ff6f00',
    accentText: '#ffffff',
    border: '#8d6e63',
    chatUserBg: '#d84315',
    chatBotBg: '#fff8e1',
    chatText: '#3e2723',
    analysisBg: '#fff3e0',
    analysisText: '#e65100',
    shadow: '0 4px 15px rgba(62, 39, 35, 0.3)',
  },
  aurora: {
    mainBg: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
    sidebarBg: 'rgba(255,255,255,0.4)',
    sidebarText: '#0f172a',
    sidebarHover: 'rgba(255,255,255,0.5)',
    contentBg: 'rgba(255,255,255,0.65)',
    textMain: '#334155',
    textHeader: '#0e7490',
    accent: '#06b6d4',
    accentText: '#fff',
    border: 'rgba(255,255,255,0.6)',
    chatUserBg: '#06b6d4',
    chatBotBg: '#ecfeff',
    chatText: '#164e63',
    analysisBg: '#f0fdfa',
    analysisText: '#115e59',
    shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  },
  midnight: {
    mainBg: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
    sidebarBg: 'rgba(0,0,0,0.5)',
    sidebarText: '#93c5fd',
    sidebarHover: 'rgba(255,255,255,0.05)',
    contentBg: 'rgba(30, 41, 59, 0.7)',
    textMain: '#e2e8f0',
    textHeader: '#60a5fa',
    accent: '#3b82f6',
    accentText: '#fff',
    border: 'rgba(148, 163, 184, 0.2)',
    chatUserBg: '#2563eb',
    chatBotBg: 'rgba(30, 41, 59, 0.9)',
    chatText: '#f1f5f9',
    analysisBg: 'rgba(30, 58, 138, 0.3)',
    analysisText: '#93c5fd',
    shadow: '0 10px 30px rgba(0,0,0,0.5)',
  }
};