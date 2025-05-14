# 部署说明

## 环境要求

- Node.js >= 16.x
- npm >= 7.x 或 yarn >= 1.22.x

## 安装依赖

```bash
npm install
# 或
yarn
```

## 配置环境变量（AI分段功能）

在根目录新建 `.env` 文件，内容如下：

```
VITE_SILICON_FLOW_API_KEY=你的APIKEY
```

## 本地开发

```bash
npm run dev
# 或
yarn dev
```

## 生产环境构建

```bash
npm run build
# 或
yarn build
```

## 生产环境部署

- 构建后产物在 `dist/` 目录，可部署到任意静态服务器（如 nginx、Vercel、Netlify、GitHub Pages 等）。
- 推荐使用 Vercel/Netlify 一键部署。

## 常见问题

- **API KEY 泄露风险？** 前端项目请勿暴露敏感密钥，建议后端代理。
- **AI分段不可用？** 检查 API KEY、网络环境、服务可用性。 