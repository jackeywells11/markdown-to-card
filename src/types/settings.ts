import { Theme } from '../styles/themes';

export interface SettingsData {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  theme: Theme;
  previewTheme: Theme;
  autoSave: boolean;
  autoSaveInterval: number;
  shortcuts: {
    保存: string;
    新建: string;
    查找: string;
    替换: string;
  };
}

export const defaultSettings: SettingsData = {
  fontSize: 16,
  lineHeight: 1.5,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  theme: 'system',
  previewTheme: 'system',
  autoSave: true,
  autoSaveInterval: 5000,
  shortcuts: {
    保存: 'Ctrl+S',
    新建: 'Ctrl+N',
    查找: 'Ctrl+F',
    替换: 'Ctrl+H',
  },
}; 