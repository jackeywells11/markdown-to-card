import React from 'react';
import { createNewFile, openFile, saveFile, exportAsImage, exportAsPDF } from '../utils/fileOperations';

// Toolbar.tsx
// 工具栏组件，提供新建、打开、保存、导出、主题切换、模板管理、设置等操作按钮
// Props:
//   onThemeToggle: 切换主题回调
//   isDarkMode: 当前是否为深色模式
//   onSettingsOpen: 打开设置回调
//   onTemplateManagerOpen: 打开模板管理回调
//   markdown: 当前Markdown内容
//   setMarkdown: 设置Markdown内容回调
// 主要逻辑：按钮事件处理、文件操作、导出操作

interface ToolbarProps {
  onThemeToggle: () => void;
  isDarkMode: boolean;
  onSettingsOpen: () => void;
  onTemplateManagerOpen: () => void;
  markdown: string;
  setMarkdown: (v: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onThemeToggle, isDarkMode, onSettingsOpen, onTemplateManagerOpen, markdown, setMarkdown }) => {
  const handleNewFile = () => {
    if (markdown && !window.confirm('当前文档未保存，是否继续？')) {
      return;
    }
    setMarkdown(createNewFile());
  };

  const handleOpenFile = async () => {
    try {
      const content = await openFile();
      setMarkdown(content);
    } catch (error) {
      console.error('打开文件失败:', error);
      alert('打开文件失败');
    }
  };

  const handleSaveFile = async () => {
    try {
      await saveFile(markdown);
    } catch (error) {
      console.error('保存文件失败:', error);
      alert('保存文件失败');
    }
  };

  const handleExportImage = async () => {
    try {
      const previewElement = document.querySelector('.prose');
      if (!previewElement) {
        throw new Error('找不到预览元素');
      }
      await exportAsImage(previewElement as HTMLElement);
    } catch (error) {
      console.error('导出图片失败:', error);
      alert('导出图片失败');
    }
  };

  const handleExportPDF = async () => {
    try {
      const previewElement = document.querySelector('.prose');
      if (!previewElement) {
        throw new Error('找不到预览元素');
      }
      await exportAsPDF(previewElement as HTMLElement);
    } catch (error) {
      console.error('导出PDF失败:', error);
      alert('导出PDF失败');
    }
  };

  return (
    <div className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <button onClick={handleNewFile} className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} title="新建">
            📄
          </button>
          <button onClick={handleOpenFile} className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} title="打开">
            📂
          </button>
          <button onClick={handleSaveFile} className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} title="保存">
            💾
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          <button onClick={handleExportImage} className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} title="导出图片">
            🖼️
          </button>
          <button onClick={handleExportPDF} className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} title="导出PDF">
            📑
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          <button onClick={onThemeToggle} className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} title="切换主题">
            {isDarkMode ? '🌙' : '☀️'}
          </button>
          <button onClick={onTemplateManagerOpen} className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} title="模板管理">
            📋
          </button>
          <button onClick={onSettingsOpen} className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} title="设置">
            ⚙️
          </button>
        </div>
        <div className="text-lg font-bold select-none">Markdown 卡片生成器</div>
        <div />
      </div>
    </div>
  );
};

export default Toolbar; 