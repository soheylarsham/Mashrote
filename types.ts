
export interface Section {
  id: string;
  title: string;
  content: string;
  category: 'intro' | 'constitution' | 'supplement' | 'amendment';
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: 'legal' | 'political' | 'military';
  date?: string;
  sources?: { title: string; url: string }[];
}

export interface LegalCheck {
  id: string;
  actionTitle: string;
  actionDescription: string;
  violatedArticles: string[]; // e.g., ["اصل ۴۶ متمم", "اصل ۵۰ متمم"]
  legalExplanation: string; // How it violated the law
  defenseView: string; // The justification used by Mossadegh
}

export interface ComprehensiveItem {
  id: string;
  title: string;
  description: string;
  date: string;
  actions: string[];
  constitutionalReference: string[]; // e.g. "اصل ۵ متمم"
  neutralVerdict: string; // The strict AI analysis
  legalityScore: number; // 0 to 100
  sources: string[];
}

export interface ChatLog {
  id: string;
  user: string;
  ai: string;
}

export interface DebateItem {
  id: string;
  title: string;
  question: string;
  answer: string;
  category: 'institutions' | 'elections' | 'coup' | 'shah' | 'lists';
}

export interface TrialSession {
  id: string;
  sessionNumber: string;
  date: string;
  title: string;
  summary: string;
  content: string;
  sourceUrl: string;
}

export type ViewMode = 'laws' | 'historical' | 'mossadegh' | 'analysis' | 'comprehensive' | 'debate' | 'trial';

export type ThemeMode = 'preset' | 'custom';
export type ThemePreset = 'modern' | 'royal' | 'cyberpunk' | 'nature' | 'paper' | 'sunset' | 'ocean' | 'nebula' | 'fire' | 'magic' | 'autumn' | 'aurora' | 'midnight';

export interface ThemeColors {
  mainBg: string;
  sidebarBg: string; // usually translucent with glassmorphism
  sidebarText: string;
  sidebarHover: string;
  contentBg: string; // card background
  textMain: string;
  textHeader: string;
  accent: string;       
  accentText: string;
  border: string;
  chatUserBg: string;
  chatBotBg: string;
  chatText: string;
  analysisBg: string;
  analysisText: string;
  shadow: string; // New for 3D effect
}

export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
export type FontFamily = 'vazir' | 'naskh' | 'custom';

export interface AudioSettings {
  gender: 'Male' | 'Female';
  tone: 'Normal' | 'News' | 'Happy' | 'Sad';
  speed: number;
  voiceName: string; 
}

export interface AppSettings {
  mode: ThemeMode;
  preset: ThemePreset;
  colors: ThemeColors;
  fontSize: FontSize;
  fontFamily: FontFamily;
  customFontData?: string; 
  customFontName?: string;
  showSplashScreen: boolean;
  audio: AudioSettings;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  audioUrl?: string;
  relatedQuestions?: string[];
  isLoading?: boolean;
}

export interface SavedChat {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
}

export type ExportFormat = 'png' | 'pdf' | 'md' | 'html' | 'docs' | 'csv' | 'js' | 'xml' | 'json';

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  category: 'start' | 'conflict' | 'rise' | 'fall' | 'revolution';
  sourceUrl?: string;
}

export interface ArticleAnalysis {
  modernText: string;
  example: string;
  historicalContext: string;
  proponentView: string;
  opponentView: string;
  prevailingView: string;
  legalTruth: string;
}

export interface HistoricalDoc {
  id: string;
  title: string;
  author?: string;
  content: string; // Raw text or Markdown
  footnotes?: Record<string, string>;
  references?: string[];
}
