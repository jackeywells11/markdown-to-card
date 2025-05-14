import React from 'react';
import { ThemeConfig } from '../styles/themes';

// ThemeApplier.tsx
// 主题变量应用组件，将主题色彩变量注入全局CSS
// Props:
//   theme: 主题配置对象
//   children: 子组件
// 主要逻辑：将主题色彩映射为CSS变量，包裹所有内容

interface ThemeApplierProps {
  theme: ThemeConfig;
  children: React.ReactNode;
}

const ThemeApplier: React.FC<ThemeApplierProps> = ({ theme, children }) => {
  const style = {
    '--theme-background': theme.colors.background,
    '--theme-text': theme.colors.text,
    '--theme-primary': theme.colors.primary,
    '--theme-secondary': theme.colors.secondary,
    '--theme-border': theme.colors.border,
  } as React.CSSProperties;

  return (
    <div className="theme-applier" style={style}>
      {children}
    </div>
  );
};

export default ThemeApplier; 