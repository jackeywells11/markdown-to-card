import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

// markdown.ts
// Markdown 工具函数，支持自动格式化和解析渲染
// autoFormatToMarkdown: 对输入文本进行基础Markdown格式化
// parseMarkdown: 使用markdown-it渲染Markdown为HTML

export const autoFormatToMarkdown = (input: string): string => {
  // 基本的 Markdown 格式化
  let formatted = input
    .replace(/^#\s+(.+)$/gm, '# $1') // 标题格式化
    .replace(/^\*\s+(.+)$/gm, '* $1') // 列表格式化
    .replace(/^>\s+(.+)$/gm, '> $1')  // 引用格式化
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '```$1\n$2```'); // 代码块格式化

  return formatted;
};

export const parseMarkdown = (markdown: string): string => {
  return md.render(markdown);
}; 