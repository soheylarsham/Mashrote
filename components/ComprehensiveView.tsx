import React from 'react';
import { COMPREHENSIVE_DATA, STATIC_CHAT_LOGS } from '../data/comprehensive_analysis';
import { ShieldAlert, Book, Gavel, Scale, AlertTriangle, User, Bot, CheckCircle, XCircle } from 'lucide-react';
import ExportToolbar from './ExportToolbar';

const LegalityGauge: React.FC<{ score: number }> = ({ score }) => {
  let color = 'bg-red-500';
  let label = 'غیرقانونی';
  if (score > 30) { color = 'bg-orange-500'; label = 'مشکوک/خاکستری'; }
  if (score > 70) { color = 'bg-green-500'; label = 'قانونی'; }

  return (
    <div className="flex items-center gap-3 mt-4">
      <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded ${color} text-white whitespace-nowrap`}>
        {score}% {label}
      </span>
    </div>
  );
};

const ComprehensiveView: React.FC = () => {
  return (
    <div id="export-area" className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-32">
      <header className="text-center mb-10 bg-gradient-to-br from-red-900/10 to-transparent p-8 rounded-3xl border border-red-500/20 backdrop-blur-xl">
        <h1 className="text-4xl font-black text-red-800 dark:text-red-400 drop-shadow-sm mb-4 flex items-center justify-center gap-3">
          <ShieldAlert size={40}/>
          تحلیل بی‌طرفانه و جامع
        </h1>
        <p className="text-[var(--c-text-main)] opacity-80 max-w-3xl mx-auto leading-8 text-justify">
          این بخش به دور از تعصبات سیاسی و تنها بر اساس <strong>متن صریح قانون اساسی مشروطه (۱۲۸۵) و متمم آن (۱۲۸۶)</strong>، اقدامات دوران نخست‌وزیری دکتر مصدق را می‌سنجد. 
          مبنای قضاوت در اینجا "نیت خیر" یا "شرایط اضطراری" نیست، بلکه انطباق فنی و حقوقی اعمال با اصول مکتوب قانون است.
        </p>
      </header>

      {/* Analysis Cards */}
      <div className="space-y-10">
        {COMPREHENSIVE_DATA.map((item, index) => (
          <div key={item.id} className="relative bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-[2rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all group">
            {/* Header */}
            <div className="bg-[var(--c-sidebar-bg)] p-6 border-b border-[var(--c-border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                 <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-800 font-bold text-sm border border-red-200">{index + 1}</span>
                    <h2 className="text-xl font-bold text-[var(--c-text-header)]">{item.title}</h2>
                 </div>
                 <div className="flex items-center gap-2 mt-2 opacity-60 text-xs">
                    <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">{item.date}</span>
                 </div>
               </div>
               <div className="hidden md:block">
                  <Gavel className="opacity-20 text-[var(--c-text-header)]" size={40} />
               </div>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-8">
               {/* Left: Facts & Constitution */}
               <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-sm text-[var(--c-accent)] mb-2 flex items-center gap-2"><Book size={16}/> شرح اقدام</h3>
                    <p className="text-sm leading-7 text-justify opacity-90">{item.description}</p>
                    <ul className="mt-2 space-y-1">
                      {item.actions.map((act, i) => (
                        <li key={i} className="text-xs flex items-start gap-2 opacity-80 before:content-['•'] before:text-red-500">
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50">
                     <h3 className="font-bold text-xs text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2"><Scale size={14}/> اصول مرتبط قانون اساسی</h3>
                     <ul className="space-y-2">
                       {item.constitutionalReference.map((ref, i) => (
                         <li key={i} className="text-xs leading-5 text-amber-900 dark:text-amber-100/80 text-justify italic">
                           "{ref}"
                         </li>
                       ))}
                     </ul>
                  </div>
               </div>

               {/* Right: Verdict */}
               <div className="flex flex-col justify-between bg-gradient-to-br from-[var(--c-main-bg)] to-[var(--c-sidebar-bg)] p-5 rounded-2xl border border-[var(--c-border)]">
                  <div>
                    <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertTriangle size={18} />
                      حکم بی‌طرفانه (ناظر حقوقی)
                    </h3>
                    <p className="text-sm leading-7 text-justify font-medium">
                      {item.neutralVerdict}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-[var(--c-border)]">
                    <span className="text-xs font-bold opacity-70 block mb-1">انطباق با قانون اساسی</span>
                    <LegalityGauge score={item.legalityScore} />
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Logs Section */}
      <div className="mt-20 pt-10 border-t-2 border-dashed border-[var(--c-border)]">
        <h2 className="text-2xl font-black text-center mb-8 text-[var(--c-text-header)] flex items-center justify-center gap-2">
          <Bot size={28} className="text-blue-500"/>
          آرشیو گفتگوهای هوشمند
        </h2>
        
        <div className="space-y-6">
          {STATIC_CHAT_LOGS.map((chat) => (
            <div key={chat.id} className="bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-2xl p-6 shadow-sm">
               <div className="flex gap-4 mb-4">
                 <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><User size={20}/></div>
                 <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl rounded-tr-none text-sm leading-7 text-justify w-full">
                   <span className="block font-bold text-xs text-blue-600 mb-1">سوال کاربر</span>
                   {chat.user}
                 </div>
               </div>
               
               <div className="flex gap-4 flex-row-reverse">
                 <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0"><Bot size={20}/></div>
                 <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl rounded-tl-none text-sm leading-7 text-justify w-full border border-green-100 dark:border-green-800">
                   <span className="block font-bold text-xs text-green-600 mb-1">پاسخ هوشمند</span>
                   {chat.ai}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--c-content-bg)] p-6 rounded-2xl border border-[var(--c-border)] mt-8">
         <ExportToolbar elementId="export-area" title="تحلیل جامع مشروطه" />
      </div>
    </div>
  );
};

export default ComprehensiveView;