import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Editor from './components/Editor'
import Preview from './components/Preview'
import Toolbar from './components/Toolbar'
import Settings from './components/Settings'
import TemplateManager from './components/TemplateManager'
import ExportDialog from './components/ExportDialog'
import ThemeSelector from './components/ThemeSelector'
import ThemeApplier from './components/ThemeApplier'
import { Template } from './types/template'
import { SettingsData, defaultSettings } from './types/settings'
import { ThemeConfig, themes } from './styles/themes'
import { cardTemplates } from './templates/cardTemplates'
import { autoFormatToMarkdown } from './utils/markdown'
import { exportAsImage, exportAsPDF } from './utils/fileOperations'
import './styles/theme.css'
import './styles/cardTemplates.css'

// App.tsx
// 主应用入口，负责全局状态管理、主题切换、模板选择、导出、设置等功能
// 包含编辑器、预览、工具栏、设置、模板管理等主要界面
// 主要状态：Markdown内容、主题、模板、设置、导出弹窗等
// 主要逻辑：本地存储、自动保存、主题切换、文件操作、导出图片/PDF
// 详细注释见各函数和useEffect实现

const App: React.FC = () => {
  const [input, setInput] = useState(() => {
    const saved = localStorage.getItem('markdown')
    return saved || cardTemplates[0].content || ''
  })
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(cardTemplates[0])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [settings, setSettings] = useState<SettingsData>(() => {
    const saved = localStorage.getItem('settings')
    return saved ? JSON.parse(saved) : defaultSettings
  })
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(themes[0])
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null);

  // 使用 useMemo 缓存 Markdown 解析结果
  const autoMarkdown = useMemo(() => {
    return autoFormatToMarkdown(input);
  }, [input]);

  // 保存设置到 localStorage
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))
  }, [settings])

  // 保存 Markdown 内容到 localStorage
  useEffect(() => {
    if (settings.autoSave) {
      const timer = setInterval(() => {
        localStorage.setItem('markdown', autoMarkdown)
      }, settings.autoSaveInterval)
      return () => clearInterval(timer)
    }
  }, [autoMarkdown, settings.autoSave, settings.autoSaveInterval])

  // 保存深色模式状态到 localStorage
  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  const handleExportImage = async (options?: any) => {
    try {
      const previewElement = document.querySelector('.markdown-preview');
      if (!previewElement) {
        throw new Error('未找到预览内容');
      }

      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = previewElement.clientWidth + 'px';
      container.style.backgroundColor = options?.backgroundColor || '#ffffff';
      container.style.padding = '20px';
      container.appendChild(previewElement.cloneNode(true));
      document.body.appendChild(container);

      await exportAsImage(container, options);
      document.body.removeChild(container);
    } catch (error) {
      console.error('导出图片失败:', error);
      alert('导出图片失败');
    }
  };

  const handleExportPDF = async (options?: any) => {
    try {
      const previewElement = document.querySelector('.markdown-preview');
      if (!previewElement) {
        throw new Error('未找到预览内容');
      }

      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = previewElement.clientWidth + 'px';
      container.appendChild(previewElement.cloneNode(true));
      document.body.appendChild(container);

      await exportAsPDF(container, options);
      document.body.removeChild(container);
    } catch (error) {
      console.error('导出 PDF 失败:', error);
      alert('导出 PDF 失败');
    }
  };

  // 使用 useCallback 优化事件处理函数
  const handleThemeChange = useCallback((theme: ThemeConfig) => {
    setCurrentTheme(theme);
    setSettings(prev => ({ ...prev, theme: theme as any }));
  }, []);

  const handleExport = useCallback(async (type: 'image' | 'pdf') => {
    try {
      if (type === 'image') {
        await handleExportImage();
      } else {
        await handleExportPDF();
      }
    } catch (error) {
      console.error(`Export ${type} failed:`, error);
      // TODO: 添加错误提示
    }
  }, []);

  const themeObject = themes.find(t => t.id === currentTheme.id) || themes[0];

  return (
    <ThemeApplier theme={themeObject}>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <div className="flex flex-col h-screen">
          {/* 工具栏 */}
          <Toolbar
            onThemeToggle={() => setIsDarkMode(!isDarkMode)}
            isDarkMode={isDarkMode}
            onSettingsOpen={() => setIsSettingsOpen(true)}
            onTemplateManagerOpen={() => setIsTemplateManagerOpen(true)}
            markdown={input}
            setMarkdown={setInput}
          />

          {/* 三栏布局：编辑器 | 模板选择 | 预览 */}
          <div className="flex flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* 编辑器 */}
            <div className="w-2/5 border-r border-gray-200 dark:border-gray-700 flex flex-col">
              <Editor
                value={input}
                onChange={setInput}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* 模板选择区 */}
            <div className="w-1/5 flex flex-col items-center py-6 px-2 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
              <div className="font-bold text-gray-700 dark:text-gray-200 mb-4 text-lg">模板选择</div>
              <div className="flex flex-col gap-4 w-full items-center">
                {cardTemplates.map((tpl: Template) => (
                  <div
                    key={tpl.id}
                    className={`w-full rounded-lg shadow-md p-4 cursor-pointer transition border-2 bg-gray-50 dark:bg-gray-700 hover:border-blue-400 ${
                      tpl.id === selectedTemplate.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
                    }`}
                    onClick={() => {
                      setSelectedTemplate(tpl);
                    }}
                  >
                    <div className="font-semibold text-base text-gray-800 dark:text-gray-100 mb-1">{tpl.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">{tpl.desc || tpl.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 预览 */}
            <div className="w-2/5 overflow-auto flex flex-col">
              <div ref={previewRef} className="flex-1">
                <Preview
                  markdown={autoMarkdown}
                  isDarkMode={isDarkMode}
                  selectedTemplate={selectedTemplate}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 设置对话框 */}
        <Settings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          isDarkMode={isDarkMode}
          settings={settings}
          onSettingsChange={setSettings}
        />

        {/* 模板管理器 */}
        <TemplateManager
          isOpen={isTemplateManagerOpen}
          onClose={() => setIsTemplateManagerOpen(false)}
          setMarkdown={setInput}
          isDarkMode={isDarkMode}
        />

        {/* 导出对话框 */}
        <ExportDialog
          isOpen={isExportDialogOpen}
          onClose={() => setIsExportDialogOpen(false)}
          previewRef={previewRef}
          onExport={handleExport}
          isDarkMode={isDarkMode}
        />

        {/* 主题选择器 */}
        <ThemeSelector
          currentTheme={themeObject}
          onThemeChange={handleThemeChange}
          isDarkMode={isDarkMode}
        />
      </div>
    </ThemeApplier>
  )
}

export default App 