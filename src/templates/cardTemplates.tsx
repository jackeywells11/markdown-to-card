import React from 'react';
import { Template } from '../types/template';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const now = new Date();

const defaultContent = `# Markdown 知识卡片

> Markdown 知识卡片是一个强大的工具，可以将你的 Markdown 文档转换为精美的知识卡片。 🌟

![](https://picsum.photos/600/300)

## 主要特点：

1. 将 Markdown 转化为**知识卡片**
2. 多种主题风格任你选择
3. 长文自动拆分，或者根据 markdown \`---\` 横线拆分
4. 可以复制图片到\`剪贴板\`，或者下载为\`PNG\`、\`SVG\`图片
5. 所见即所得
6. 完全免费

## 使用方法：

1. 在左侧编辑区输入 Markdown 内容
2. 在右侧选择喜欢的模板风格
3. 点击导出按钮，选择导出格式
4. 分享你的知识卡片！

## 支持的格式：

- 标题（H1-H6）
- 列表（有序、无序）
- 引用
- 代码块
- 图片
- 表格
- 链接
- 强调（粗体、斜体）

快来试试吧！ ✨`;

export const cardTemplates: Template[] = [
  {
    id: 'business',
    name: '商务风格',
    description: '专业的商务风格设计',
    className: 'template-business',
    content: defaultContent,
    createdAt: now,
    updatedAt: now,
    render: (content: string, meta: any) => (
      <div className="template-business">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
            h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-gray-900">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-gray-800">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold mb-3 text-gray-700">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-gray-700">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-700">{children}</ol>,
            li: ({ children }) => <li className="mb-2">{children}</li>,
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
                <code className={`px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 text-sm font-mono ${className || ''}`}>
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
          {content}
        </ReactMarkdown>
      </div>
    ),
  },
  {
    id: 'academic',
    name: '学术风格',
    description: '严谨的学术论文风格',
    className: 'template-academic',
    content: defaultContent,
    createdAt: now,
    updatedAt: now,
    render: (content: string, meta: any) => (
      <div className="template-academic">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4 text-gray-800 leading-relaxed">{children}</p>,
            h1: ({ children }) => <h1 className="text-3xl font-serif font-bold mb-6 text-gray-900">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-serif font-bold mb-4 text-gray-800">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-serif font-bold mb-3 text-gray-700">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-gray-800">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-800">{children}</ol>,
            li: ({ children }) => <li className="mb-2">{children}</li>,
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
                <code className={`px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 text-sm font-mono ${className || ''}`}>
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
          {content}
        </ReactMarkdown>
      </div>
    ),
  },
  {
    id: 'creative',
    name: '创意风格',
    description: '富有创意的现代设计',
    className: 'template-creative',
    content: defaultContent,
    createdAt: now,
    updatedAt: now,
    render: (content: string, meta: any) => (
      <div className="template-creative">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
            h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-purple-700">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold mb-3 text-pink-700">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-gray-700">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-700">{children}</ol>,
            li: ({ children }) => <li className="mb-2">{children}</li>,
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
                <code className={`px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-sm font-mono ${className || ''}`}>
                  {children}
                </code>
              );
            },
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-lg my-4 transform hover:scale-105 transition-transform duration-300"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    ),
  },
  {
    id: 'minimal',
    name: '极简风格',
    description: '简约而不简单的设计',
    className: 'template-minimal',
    content: defaultContent,
    createdAt: now,
    updatedAt: now,
    render: (content: string, meta: any) => (
      <div className="template-minimal">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4 text-gray-600">{children}</p>,
            h1: ({ children }) => <h1 className="text-3xl font-light mb-6 text-gray-900">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-light mb-4 text-gray-800">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-light mb-3 text-gray-700">{children}</h3>,
            ul: ({ children }) => <ul className="list-none pl-0 mb-4 text-gray-600">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-600">{children}</ol>,
            li: ({ children }) => <li className="mb-2">{children}</li>,
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
                <code className={`px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 text-sm font-mono ${className || ''}`}>
                  {children}
                </code>
              );
            },
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg my-4"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    ),
  },
  {
    id: 'tech',
    name: '科技风格',
    description: '充满科技感的深色主题',
    className: 'template-tech',
    content: defaultContent,
    createdAt: now,
    updatedAt: now,
    render: (content: string, meta: any) => (
      <div className="template-tech">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4 text-gray-300">{children}</p>,
            h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-blue-400">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-blue-300">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold mb-3 text-blue-200">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-gray-300">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-300">{children}</ol>,
            li: ({ children }) => <li className="mb-2">{children}</li>,
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
                <code className={`px-1.5 py-0.5 rounded bg-blue-900 text-blue-300 text-sm font-mono ${className || ''}`}>
                  {children}
                </code>
              );
            },
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-lg my-4 border border-blue-500"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    ),
  },
  {
    id: 'nature',
    name: '自然风格',
    description: '清新自然的绿色主题',
    className: 'template-nature',
    content: defaultContent,
    createdAt: now,
    updatedAt: now,
    render: (content: string, meta: any) => (
      <div className="template-nature">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
            h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-green-800">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-green-700">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold mb-3 text-green-600">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-gray-700">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-700">{children}</ol>,
            li: ({ children }) => <li className="mb-2">{children}</li>,
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
                <code className={`px-1.5 py-0.5 rounded bg-green-100 text-green-800 text-sm font-mono ${className || ''}`}>
                  {children}
                </code>
              );
            },
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-lg my-4 border border-green-200"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    ),
  },
  {
    id: 'artistic',
    name: '艺术风格',
    description: '富有艺术感的渐变设计',
    className: 'template-artistic',
    content: defaultContent,
    createdAt: now,
    updatedAt: now,
    render: (content: string, meta: any) => (
      <div className="template-artistic">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
            h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-pink-600">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold mb-3 text-purple-600">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-gray-700">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-700">{children}</ol>,
            li: ({ children }) => <li className="mb-2">{children}</li>,
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
                <code className={`px-1.5 py-0.5 rounded bg-pink-100 text-pink-800 text-sm font-mono ${className || ''}`}>
                  {children}
                </code>
              );
            },
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-lg my-4 border border-pink-200"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    ),
  },
  {
    id: 'vintage',
    name: '复古风格',
    description: '怀旧的复古风格设计',
    className: 'template-vintage',
    content: defaultContent,
    createdAt: now,
    updatedAt: now,
    render: (content: string, meta: any) => (
      <div className="template-vintage">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4 text-gray-700 font-serif">{children}</p>,
            h1: ({ children }) => <h1 className="text-3xl font-serif font-bold mb-6 text-amber-900">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-serif font-bold mb-4 text-amber-800">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-serif font-bold mb-3 text-amber-700">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-gray-700">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-700">{children}</ol>,
            li: ({ children }) => <li className="mb-2">{children}</li>,
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
                <code className={`px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-sm font-mono ${className || ''}`}>
                  {children}
                </code>
              );
            },
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-lg my-4 border border-amber-200"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    ),
  },
  {
    id: 'neon',
    name: '霓虹风格',
    description: '炫酷的霓虹灯效果',
    className: 'template-neon',
    content: defaultContent,
    createdAt: now,
    updatedAt: now,
    render: (content: string, meta: any) => (
      <div className="template-neon">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4 text-gray-300">{children}</p>,
            h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-pink-400 neon-text">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-blue-400 neon-text">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold mb-3 text-purple-400 neon-text">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-gray-300">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-300">{children}</ol>,
            li: ({ children }) => <li className="mb-2">{children}</li>,
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
                <code className={`px-1.5 py-0.5 rounded bg-pink-900 text-pink-300 text-sm font-mono ${className || ''}`}>
                  {children}
                </code>
              );
            },
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-lg my-4 border border-pink-500"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    ),
  },
  {
    id: 'watercolor',
    name: '水彩风格',
    description: '柔和的水彩画风格',
    className: 'template-watercolor',
    content: defaultContent,
    createdAt: now,
    updatedAt: now,
    render: (content: string, meta: any) => (
      <div className="template-watercolor">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
            h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-blue-800">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-blue-700">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold mb-3 text-blue-600">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-gray-700">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-700">{children}</ol>,
            li: ({ children }) => <li className="mb-2">{children}</li>,
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
                <code className={`px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-sm font-mono ${className || ''}`}>
                  {children}
                </code>
              );
            },
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-lg my-4 border border-blue-200"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    ),
  },
  {
    id: 'japan-fresh',
    name: '日系清新',
    description: '淡粉蓝渐变，日系樱花点缀',
    className: 'template-japan-fresh',
    content: defaultContent,
    createdAt: now,
    updatedAt: now,
    render: (content: string, meta: any) => (
      <div className="template-japan-fresh">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    ),
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    description: '高对比炫彩未来感',
    className: 'template-cyberpunk',
    content: defaultContent,
    createdAt: now,
    updatedAt: now,
    render: (content: string, meta: any) => (
      <div className="template-cyberpunk">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    ),
  },
  {
    id: 'handwriting-paper',
    name: '纸张手写',
    description: '米黄纸张背景，手写体',
    className: 'template-handwriting-paper',
    content: defaultContent,
    createdAt: now,
    updatedAt: now,
    render: (content: string, meta: any) => (
      <div className="template-handwriting-paper">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    ),
  },
]; 