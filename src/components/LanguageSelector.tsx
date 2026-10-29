import React from 'react';
import { AppLanguage } from '../types';
import { Globe, Check } from 'lucide-react';

interface LanguageSelectorProps {
  currentLang: AppLanguage;
  onChangeLang: (lang: AppLanguage) => void;
  variant?: 'header' | 'settings' | 'onboarding';
}

export default function LanguageSelector({ currentLang, onChangeLang, variant = 'header' }: LanguageSelectorProps) {
  const options: { code: AppLanguage; label: string; sub: string; flag: string }[] = [
    { code: 'en', label: 'English', sub: 'English Language', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', sub: 'Hindi Language', flag: '🇮🇳' },
    { code: 'ml', label: 'മലയാളം', sub: 'Malayalam Language', flag: '🇮🇳' }
  ];

  if (variant === 'onboarding') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mx-auto">
        {options.map((opt) => {
          const isSelected = currentLang === opt.code;
          return (
            <button
              key={opt.code}
              id={`lang-opt-${opt.code}`}
              type="button"
              onClick={() => onChangeLang(opt.code)}
              className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between h-36 cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-lg'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-4xl">{opt.flag}</span>
                {isSelected && (
                  <span className="bg-blue-600 text-white rounded-full p-1 self-start">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{opt.label}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.sub}</p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'settings') {
    return (
      <div className="space-y-2">
        {options.map((opt) => {
          const isSelected = currentLang === opt.code;
          return (
            <div
              key={opt.code}
              id={`lang-settings-${opt.code}`}
              onClick={() => onChangeLang(opt.code)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/10'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{opt.flag}</span>
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-50">{opt.label}</div>
                  <div className="text-xs text-slate-500">{opt.sub}</div>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 dark:border-slate-700'
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" id="header-language-picker">
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
        <Globe className="h-4 w-4 text-slate-500" />
        <select
          value={currentLang}
          id="lang-select-dropdown"
          onChange={(e) => onChangeLang(e.target.value as AppLanguage)}
          className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
        >
          <option value="en" className="text-slate-900 dark:text-slate-50">🇬🇧 EN</option>
          <option value="hi" className="text-slate-900 dark:text-slate-50">🇮🇳 हिन्दी</option>
          <option value="ml" className="text-slate-900 dark:text-slate-50">🇮🇳 മലയാളം</option>
        </select>
      </div>
    </div>
  );
}
