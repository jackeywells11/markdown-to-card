# Markdown 卡片生成器

一个支持多模板、AI智能分段、导出图片/PDF 的 Markdown 卡片生成器。

## 功能特性

- Markdown 实时编辑与预览
- 多种精美卡片模板
- 支持自定义模板管理
- 一键导出图片/PDF
- AI 智能分段（需配置 API KEY）
- 主题切换（浅色/深色/系统）
- 字体、行高、自动保存等个性化设置

## 技术栈

- React 18
- TypeScript
- TailwindCSS
- html2canvas, jsPDF
- 其他：react-markdown, remark-gfm 等

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd markdown-card
```

### 2. 安装依赖

```bash
npm install
# 或
yarn
```

### 3. 配置环境变量（可选，AI分段功能）

在根目录新建 `.env` 文件，添加：

```
VITE_SILICON_FLOW_API_KEY=你的APIKEY
```

### 4. 启动开发环境

```bash
npm run dev
# 或
yarn dev
```

### 5. 打包构建

```bash
npm run build
# 或
yarn build
```

### 6. 预览生产环境

```bash
npm run preview
# 或
yarn preview
```

## 目录结构

- `src/components/` 主要功能组件
- `src/utils/` 工具函数
- `src/services/` AI服务相关
- `src/styles/` 样式与主题
- `src/templates/` 卡片模板
- `public/` 静态资源

## 特色亮点

- 支持多种卡片模板，风格多样
- AI 智能分段，提升内容排版效率
- 一键导出图片/PDF，适合分享与打印
- 主题、字体、自动保存等丰富设置

## 常见问题

- **AI分段不可用？** 请检查 `.env` 文件中的 API KEY 是否正确。
- **导出图片/导出PDF失败？** 请确保浏览器允许下载，或尝试更换浏览器。

## 贡献指南

欢迎提交 Issue 或 PR，完善模板、功能与文档！ 