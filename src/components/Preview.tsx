import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Template } from '../types/template';
import ExportDialog from './ExportDialog';

// Preview.tsx
// Markdown 预览组件，支持模板渲染、代码高亮、导出卡片等
// Props:
//   markdown: 当前Markdown内容
//   isDarkMode: 是否为深色模式
//   selectedTemplate: 当前选中的卡片模板
// 主要逻辑：根据模板渲染Markdown，支持导出弹窗，代码高亮，图片样式优化

interface PreviewProps {
  markdown: string;
  isDarkMode: boolean;
  selectedTemplate: Template;
}

const Preview: React.FC<PreviewProps> = ({ markdown, isDarkMode, selectedTemplate }) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const renderTemplate = () => {
    if (selectedTemplate && selectedTemplate.render) {
      return selectedTemplate.render(markdown, { title: '', createdAt: new Date().toISOString() });
    }
    return (
      <div className="default-template">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4">{children}</p>,
            h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            code: ({ className, children }) => {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <div className="my-6">
                  <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-lg shadow-lg"
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                    }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={`px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono ${className || ''}`}>
                  {children}
                </code>
              );
            },
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-lg my-4"
              />
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsExportDialogOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          导出卡片
        </button>
      </div>
      <div 
        ref={previewRef}
        className={`markdown-preview p-8 overflow-auto prose max-w-none ${
          isDarkMode 
            ? 'prose-invert bg-gray-900 text-white prose-headings:text-white prose-strong:text-white prose-code:text-white' 
            : 'bg-white text-gray-900'
        }`}
      >
        {renderTemplate()}
      </div>
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        previewRef={previewRef}
      />
    </div>
  );
};

export default Preview; 