export interface Template {
  id: string;
  name: string;
  desc?: string;
  description?: string;
  content?: string;
  style?: {
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
    padding?: string;
    borderRadius?: string;
    boxShadow?: string;
  };
  preview?: string;
  previewImg?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  render?: (content: string, meta: CardMeta) => JSX.Element;
  className: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  templates: Template[];
}

export interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  setMarkdown: (markdown: string) => void;
  isDarkMode: boolean;
}

export interface TemplateFormData {
  name: string;
  content: string;
  description?: string;
  tags?: string[];
}

export interface CardMeta {
  title: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CardTemplate {
  id: string;
  name: string;
  render: (content: string, meta: CardMeta) => JSX.Element;
  content: string;
  createdAt: string;
  updatedAt: string;
} 