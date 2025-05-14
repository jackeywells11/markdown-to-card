import React, { useState, useEffect } from 'react';
import { uploadImage } from '../utils/fileOperations';

// Editor.tsx
// Markdown 编辑器组件，支持快捷插入、字数统计、快捷键提示等
// Props:
//   value: 当前Markdown内容
//   onChange: 内容变更回调
//   isDarkMode: 是否为深色模式
// 主要逻辑：插入Markdown片段、图片上传、快捷键处理、字数统计

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, isDarkMode }) => {
  const [wordCount, setWordCount] = useState({ chars: 0, words: 0, lines: 0 });
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const chars = value.length;
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    const lines = value.split('\n').length;
    setWordCount({ chars, words, lines });
  }, [value]);

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    
    onChange(newText);
    
    // 重新设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      );
    }, 0);
  };

  const handleImageUpload = async () => {
    try {
      const imageUrl = await uploadImage();
      insertMarkdown('![图片](' + imageUrl + ')');
    } catch (error) {
      console.error('上传图片失败:', error);
      alert('上传图片失败');
    }
  };

  const toolbarItems = [
    { icon: 'B', title: '加粗', action: () => insertMarkdown('**', '**'), shortcut: 'Ctrl+B' },
    { icon: 'I', title: '斜体', action: () => insertMarkdown('*', '*'), shortcut: 'Ctrl+I' },
    { icon: 'H', title: '标题', action: () => insertMarkdown('## '), shortcut: 'Ctrl+H' },
    { icon: '📝', title: '引用', action: () => insertMarkdown('> '), shortcut: 'Ctrl+Q' },
    { icon: '📋', title: '代码', action: () => insertMarkdown('```\n', '\n```'), shortcut: 'Ctrl+K' },
    { icon: '🔗', title: '链接', action: () => insertMarkdown('[', '](url)'), shortcut: 'Ctrl+L' },
    { icon: '🖼️', title: '图片', action: handleImageUpload, shortcut: 'Ctrl+P' },
    { icon: '📋', title: '列表', action: () => insertMarkdown('- '), shortcut: 'Ctrl+U' },
    { icon: '1️⃣', title: '有序列表', action: () => insertMarkdown('1. '), shortcut: 'Ctrl+O' },
    { icon: '✓', title: '任务列表', action: () => insertMarkdown('- [ ] '), shortcut: 'Ctrl+T' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          insertMarkdown('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertMarkdown('*', '*');
          break;
        case 'h':
          e.preventDefault();
          insertMarkdown('## ');
          break;
        case 'q':
          e.preventDefault();
          insertMarkdown('> ');
          break;
        case 'k':
          e.preventDefault();
          insertMarkdown('```\n', '\n```');
          break;
        case 'l':
          e.preventDefault();
          insertMarkdown('[', '](url)');
          break;
        case 'p':
          e.preventDefault();
          handleImageUpload();
          break;
        case 'u':
          e.preventDefault();
          insertMarkdown('- ');
          break;
        case 'o':
          e.preventDefault();
          insertMarkdown('1. ');
          break;
        case 't':
          e.preventDefault();
          insertMarkdown('- [ ] ');
          break;
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center justify-between p-2 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center space-x-2">
          {toolbarItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              onMouseEnter={() => setShowShortcuts(true)}
              onMouseLeave={() => setShowShortcuts(false)}
              className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              title={`${item.title} (${item.shortcut})`}
            >
              {item.icon}
            </button>
          ))}
        </div>
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          字数: {wordCount.chars} | 词数: {wordCount.words} | 行数: {wordCount.lines}
        </div>
      </div>
      <textarea
        className={`flex-1 w-full p-4 outline-none resize-none bg-transparent text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="请输入 Markdown 内容..."
        spellCheck={false}
      />
      {showShortcuts && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <h3 className="font-bold mb-2">快捷键</h3>
          <div className="space-y-1">
            {toolbarItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{item.title}</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{item.shortcut}</kbd>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor; 