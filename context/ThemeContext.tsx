import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppSettings, ThemeColors } from '../types';
import { THEME_PRESETS } from '../constants';

interface ThemeContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateColor: (key: keyof ThemeColors, value: string) => void;
}

const defaultSettings: AppSettings = {
  mode: 'preset',
  preset: 'modern',
  colors: THEME_PRESETS.modern,
  fontSize: 'medium',
  fontFamily: 'vazir',
  showSplashScreen: true,
  audio: {
    gender: 'Female',
    tone: 'Normal',
    speed: 1,
    voiceName: 'Kore'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('app_settings_v3');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('app_settings_v3', JSON.stringify(settings));
    
    // Apply Colors as CSS Variables
    const root = document.documentElement;
    const colors = settings.mode === 'preset' ? THEME_PRESETS[settings.preset] : settings.colors;

    root.style.setProperty('--c-main-bg', colors.mainBg);
    root.style.setProperty('--c-sidebar-bg', colors.sidebarBg);
    root.style.setProperty('--c-sidebar-text', colors.sidebarText);
    root.style.setProperty('--c-sidebar-hover', colors.sidebarHover);
    root.style.setProperty('--c-content-bg', colors.contentBg);
    root.style.setProperty('--c-text-main', colors.textMain);
    root.style.setProperty('--c-text-header', colors.textHeader);
    root.style.setProperty('--c-accent', colors.accent);
    root.style.setProperty('--c-accent-text', colors.accentText);
    root.style.setProperty('--c-border', colors.border);
    root.style.setProperty('--c-chat-user', colors.chatUserBg);
    root.style.setProperty('--c-chat-bot', colors.chatBotBg);
    root.style.setProperty('--c-chat-text', colors.chatText);
    root.style.setProperty('--c-analysis-bg', colors.analysisBg);
    root.style.setProperty('--c-analysis-text', colors.analysisText);
    root.style.setProperty('--c-shadow', colors.shadow);

  }, [settings]);

  // Inject Custom Font if available
  useEffect(() => {
    if (settings.fontFamily === 'custom' && settings.customFontData) {
      const styleId = 'custom-font-style';
      let styleTag = document.getElementById(styleId);
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = `
        @font-face {
          font-family: 'CustomUploadedFont';
          src: url('${settings.customFontData}');
        }
      `;
    }
  }, [settings.fontFamily, settings.customFontData]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      // If switching preset, update colors too
      if (newSettings.preset && newSettings.preset !== prev.preset) {
        return {
          ...prev,
          ...newSettings,
          colors: THEME_PRESETS[newSettings.preset as any],
          mode: 'preset'
        };
      }
      return { ...prev, ...newSettings };
    });
  };

  const updateColor = (key: keyof ThemeColors, value: string) => {
    setSettings(prev => ({
      ...prev,
      mode: 'custom',
      colors: {
        ...prev.colors,
        [key]: value
      }
    }));
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, updateColor }}>
      <div 
        className={`min-h-screen transition-all duration-500 ease-in-out font-sans bg-fixed bg-cover`}
        style={{
          background: 'var(--c-main-bg)',
          color: 'var(--c-text-main)',
          fontFamily: settings.fontFamily === 'vazir' ? 'Vazirmatn' : settings.fontFamily === 'naskh' ? 'Noto Naskh Arabic' : 'CustomUploadedFont, sans-serif'
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};