import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export interface CardMeta {
  title: string;
  content: string;
  image?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const extractMeta = (markdown: string): CardMeta => {
  const tokens = md.parse(markdown, {});
  const meta: CardMeta = {
    title: '',
    content: '',
  };

  // 提取标题（第一个 h1）
  const titleToken = tokens.find(token => token.type === 'heading_open' && token.tag === 'h1');
  if (titleToken) {
    const titleIndex = tokens.indexOf(titleToken);
    if (titleIndex >= 0 && tokens[titleIndex + 1]) {
      meta.title = tokens[titleIndex + 1].content;
    }
  }

  // 提取内容（除标题外的所有文本）
  meta.content = markdown
    .split('\n')
    .filter(line => !line.startsWith('# '))
    .join('\n')
    .trim();

  // 提取图片（第一个图片链接）
  const imageMatch = markdown.match(/!\[.*?\]\((.*?)\)/);
  if (imageMatch) {
    meta.image = imageMatch[1];
  }

  // 提取标签（从内容中匹配 #tag 格式）
  const tagMatches = markdown.match(/#[\w-]+/g);
  if (tagMatches) {
    meta.tags = tagMatches.map(tag => tag.slice(1));
  }

  return meta;
}; 