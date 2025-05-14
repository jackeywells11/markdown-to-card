export type Theme = 'system' | 'dark' | 'light';

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
  };
}

export const themes: ThemeConfig[] = [
  {
    id: 'system',
    name: '系统默认',
    colors: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB',
    },
  },
  {
    id: 'dark',
    name: '深色模式',
    colors: {
      primary: '#60A5FA',
      secondary: '#9CA3AF',
      background: '#1F2937',
      text: '#F9FAFB',
      border: '#374151',
    },
  },
  {
    id: 'light',
    name: '浅色模式',
    colors: {
      primary: '#2563EB',
      secondary: '#4B5563',
      background: '#F9FAFB',
      text: '#111827',
      border: '#D1D5DB',
    },
  },
]; 