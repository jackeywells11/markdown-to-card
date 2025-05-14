import React from 'react';
import { ThemeConfig, themes } from '../styles/themes';

// ThemeSelector.tsx
// 主题选择器组件，支持切换不同主题
// Props:
//   currentTheme: 当前主题对象
//   onThemeChange: 主题切换回调
//   isDarkMode: 是否为深色模式
// 主要逻辑：遍历主题列表，渲染主题按钮，支持高亮当前主题

interface ThemeSelectorProps {
  currentTheme: ThemeConfig;
  onThemeChange: (theme: ThemeConfig) => void;
  isDarkMode: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange, isDarkMode }) => {
  return (
    <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        选择主题
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => onThemeChange(theme)}
            className={`p-4 rounded-lg border transition-all ${
              currentTheme.name === theme.name
                ? 'ring-2 ring-primary'
                : 'hover:border-primary'
            } ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {theme.name}
              </span>
            </div>
            <div className="mt-2 space-y-1">
              <div
                className="h-2 rounded"
                style={{ backgroundColor: theme.colors.background }}
              />
              <div
                className="h-2 rounded"
                style={{ backgroundColor: theme.colors.text }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector; 