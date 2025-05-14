import React from 'react';
import { SettingsData } from '../types/settings';
import { Theme } from '../styles/themes';

// Settings.tsx
// 设置弹窗组件，支持字体、主题、自动保存等参数配置
// Props:
//   isOpen: 是否显示弹窗
//   onClose: 关闭弹窗回调
//   isDarkMode: 是否为深色模式
//   settings: 当前设置数据
//   onSettingsChange: 设置变更回调
// 主要逻辑：表单输入、设置变更、自动保存间隔控制

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  settings: SettingsData;
  onSettingsChange: (settings: SettingsData) => void;
}

const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  settings,
  onSettingsChange,
}) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof SettingsData, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 w-96 ${isDarkMode ? 'dark' : ''}`}>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">设置</h2>
        
        <div className="space-y-4">
          {/* 字体大小 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              字体大小
            </label>
            <input
              type="number"
              value={settings.fontSize}
              onChange={(e) => handleChange('fontSize', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* 行高 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              行高
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => handleChange('lineHeight', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* 字体 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              字体
            </label>
            <select
              value={settings.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="system-ui, -apple-system, sans-serif">系统默认</option>
              <option value="'Microsoft YaHei', sans-serif">微软雅黑</option>
              <option value="'PingFang SC', sans-serif">苹方</option>
              <option value="'Noto Sans SC', sans-serif">思源黑体</option>
            </select>
          </div>

          {/* 主题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              主题
            </label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value as Theme)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="system">系统默认</option>
              <option value="light">浅色模式</option>
              <option value="dark">深色模式</option>
            </select>
          </div>

          {/* 预览主题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              预览主题
            </label>
            <select
              value={settings.previewTheme}
              onChange={(e) => handleChange('previewTheme', e.target.value as Theme)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="system">系统默认</option>
              <option value="light">浅色模式</option>
              <option value="dark">深色模式</option>
            </select>
          </div>

          {/* 自动保存 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleChange('autoSave', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              自动保存
            </label>
          </div>

          {/* 自动保存间隔 */}
          {settings.autoSave && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                自动保存间隔 (毫秒)
              </label>
              <input
                type="number"
                value={settings.autoSaveInterval}
                onChange={(e) => handleChange('autoSaveInterval', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 