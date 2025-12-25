import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Settings, Palette, Type, Music, Upload, Check, Volume2 } from 'lucide-react';
import { ThemeColors, ThemePreset } from '../types';

const SettingsPanel: React.FC = () => {
  const { settings, updateSettings, updateColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'colors' | 'audio'>('visual');

  const presets: { id: ThemePreset; label: string; bg: string }[] = [
    { id: 'modern', label: 'مدرن', bg: '#f0f2f5' },
    { id: 'aurora', label: 'شفق قطبی', bg: 'linear-gradient(120deg, #84fab0, #8fd3f4)' },
    { id: 'midnight', label: 'نیمه‌شب', bg: 'linear-gradient(to bottom, #0f2027, #2c5364)' },
    { id: 'royal', label: 'سلطنتی', bg: '#2e0a24' },
    { id: 'cyberpunk', label: 'سایبر', bg: '#000' },
    { id: 'nature', label: 'طبیعت', bg: '#f0fdf4' },
    { id: 'paper', label: 'کاغذی', bg: '#f5f5dc' },
    { id: 'sunset', label: 'غروب', bg: 'linear-gradient(135deg, #ff9a9e, #fecfef)' },
    { id: 'ocean', label: 'اقیانوس', bg: 'linear-gradient(to top, #30cfd0, #330867)' },
    { id: 'nebula', label: 'سحابی', bg: 'linear-gradient(to right, #24243e, #302b63)' },
    { id: 'fire', label: 'آتشین', bg: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
    { id: 'magic', label: 'جادویی', bg: 'linear-gradient(45deg, #4158D0, #C850C0)' },
    { id: 'autumn', label: 'پاییز', bg: 'linear-gradient(to top, #966138, #e8b682)' },
  ];

  const colorFields: { key: keyof ThemeColors; label: string }[] = [
    { key: 'mainBg', label: 'پس‌زمینه کل' },
    { key: 'sidebarBg', label: 'پس‌زمینه منو' },
    { key: 'sidebarText', label: 'متن منو' },
    { key: 'contentBg', label: 'کارت محتوا' },
    { key: 'textMain', label: 'متن اصلی' },
    { key: 'accent', label: 'رنگ تأکیدی' },
    { key: 'chatUserBg', label: 'حباب کاربر' },
    { key: 'chatBotBg', label: 'حباب بات' },
  ];

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        updateSettings({ 
          customFontData: result, 
          customFontName: file.name,
          fontFamily: 'custom'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 font-vazir">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[var(--c-accent)] text-[var(--c-accent-text)] p-3 rounded-full shadow-lg transition-transform hover:scale-110 glass-panel"
        title="تنظیمات"
      >
        <Settings size={24} className={isOpen ? 'animate-spin' : ''} />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 left-0 w-80 md:w-96 bg-[var(--c-contentBg)] text-[var(--c-text-main)] p-0 rounded-3xl shadow-2xl border border-[var(--c-border)] animate-slide-in-up origin-bottom-left max-h-[85vh] overflow-hidden flex flex-col backdrop-blur-xl" style={{ boxShadow: 'var(--c-shadow)' }}>
          
          {/* Header Tabs */}
          <div className="flex bg-[var(--c-sidebar-bg)] text-[var(--c-sidebar-text)] p-1">
            <button onClick={() => setActiveTab('visual')} className={`flex-1 py-2 text-xs flex flex-col items-center gap-1 ${activeTab==='visual' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)] rounded shadow-sm' : 'opacity-70'}`}><Palette size={16}/> ظاهر</button>
            <button onClick={() => setActiveTab('colors')} className={`flex-1 py-2 text-xs flex flex-col items-center gap-1 ${activeTab==='colors' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)] rounded shadow-sm' : 'opacity-70'}`}><Type size={16}/> رنگ‌ها</button>
            <button onClick={() => setActiveTab('audio')} className={`flex-1 py-2 text-xs flex flex-col items-center gap-1 ${activeTab==='audio' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)] rounded shadow-sm' : 'opacity-70'}`}><Music size={16}/> صدا</button>
          </div>

          <div className="p-5 overflow-y-auto custom-scrollbar flex-1 bg-[var(--c-content-bg)]">
            
            {/* --- VISUAL TAB --- */}
            {activeTab === 'visual' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-sm mb-3">استایل‌های آماده (۳بعدی)</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {presets.map(p => (
                      <button
                        key={p.id}
                        onClick={() => updateSettings({ preset: p.id })}
                        className={`relative p-2 rounded-xl border flex flex-col items-center gap-2 transition-all hover:scale-105 overflow-hidden group ${settings.preset === p.id && settings.mode === 'preset' ? 'ring-2 ring-[var(--c-accent)] scale-105' : 'border-[var(--c-border)]'}`}
                      >
                        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity" style={{ background: p.bg }}></div>
                        <div className="w-8 h-8 rounded-full shadow-lg z-10" style={{ background: p.bg }}></div>
                        <span className="text-[10px] z-10 font-bold">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-3">قلم (فونت)</h4>
                  <div className="flex flex-col gap-2">
                     <div className="flex gap-2">
                        <button onClick={() => updateSettings({ fontFamily: 'vazir' })} className={`flex-1 py-2 text-xs border border-[var(--c-border)] rounded-lg hover:bg-[var(--c-sidebar-hover)] ${settings.fontFamily === 'vazir' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)]' : ''}`}>وزیر</button>
                        <button onClick={() => updateSettings({ fontFamily: 'naskh' })} className={`flex-1 py-2 text-xs border border-[var(--c-border)] rounded-lg hover:bg-[var(--c-sidebar-hover)] font-naskh ${settings.fontFamily === 'naskh' ? 'bg-[var(--c-accent)] text-[var(--c-accent-text)]' : ''}`}>نسخ</button>
                     </div>
                     <label className="flex items-center gap-2 p-2 border border-dashed border-[var(--c-border)] rounded-lg cursor-pointer hover:bg-[var(--c-sidebar-hover)] transition-colors">
                        <Upload size={16}/>
                        <span className="text-xs truncate">{settings.customFontName || 'آپلود فونت دلخواه (TTF)'}</span>
                        <input type="file" accept=".ttf,.woff,.woff2" className="hidden" onChange={handleFontUpload} />
                     </label>
                  </div>
                </div>

                <div>
                   <h4 className="font-bold text-sm mb-3">سایز متن</h4>
                   <input 
                      type="range" min="0" max="3" step="1" 
                      value={['small', 'medium', 'large', 'xlarge'].indexOf(settings.fontSize)}
                      onChange={(e) => updateSettings({ fontSize: ['small', 'medium', 'large', 'xlarge'][parseInt(e.target.value)] as any })}
                      className="w-full accent-[var(--c-accent)] h-2 rounded-lg appearance-none cursor-pointer"
                   />
                </div>
              </div>
            )}

            {/* --- COLORS TAB --- */}
            {activeTab === 'colors' && (
              <div className="space-y-4">
                <div className="bg-yellow-100/20 text-yellow-600 p-2 rounded text-[10px] mb-2 border border-yellow-200">
                  تغییر رنگ‌ها حالت "شخصی" را فعال می‌کند.
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {colorFields.map(field => (
                    <div key={field.key} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--c-sidebar-hover)]">
                       <span className="text-xs font-medium">{field.label}</span>
                       <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm border border-[var(--c-border)]">
                         <input 
                           type="color" 
                           value={settings.colors[field.key]}
                           onChange={(e) => updateColor(field.key, e.target.value)}
                           className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
                         />
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- AUDIO TAB --- */}
            {activeTab === 'audio' && (
              <div className="space-y-6">
                <div>
                   <h4 className="font-bold text-sm mb-3">تنظیمات گوینده هوشمند</h4>
                   <div className="bg-[var(--c-sidebar-bg)] p-4 rounded-xl border border-[var(--c-border)]">
                     <div className="grid grid-cols-2 gap-3 mb-4">
                       <div>
                         <label className="text-[10px] block mb-1 opacity-70">جنسیت</label>
                         <select 
                           value={settings.audio.gender} 
                           onChange={(e) => updateSettings({ audio: { ...settings.audio, gender: e.target.value as any } })}
                           className="w-full text-xs p-2 rounded-lg border border-[var(--c-border)] bg-[var(--c-main-bg)]"
                         >
                           <option value="Female">زن (Kore)</option>
                           <option value="Male">مرد (Puck)</option>
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] block mb-1 opacity-70">لحن</label>
                         <select 
                           value={settings.audio.tone} 
                           onChange={(e) => updateSettings({ audio: { ...settings.audio, tone: e.target.value as any } })}
                           className="w-full text-xs p-2 rounded-lg border border-[var(--c-border)] bg-[var(--c-main-bg)]"
                         >
                           <option value="Normal">عادی</option>
                           <option value="News">خبری</option>
                           <option value="Happy">شاد</option>
                           <option value="Sad">غمگین</option>
                         </select>
                       </div>
                     </div>
                     
                     <div>
                       <label className="text-[10px] block mb-1 opacity-70">سرعت خواندن ({settings.audio.speed}x)</label>
                       <input 
                         type="range" min="0.5" max="2" step="0.25"
                         value={settings.audio.speed}
                         onChange={(e) => updateSettings({ audio: { ...settings.audio, speed: parseFloat(e.target.value) } })}
                         className="w-full accent-[var(--c-accent)]"
                       />
                     </div>
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;