# 部署检查清单 ✅

在部署之前，请确保完成以下步骤：

## 🔧 基础准备

- [ ] 项目代码已提交到 Git 仓库
- [ ] 所有依赖已正确安装 (`npm install`)
- [ ] 本地构建测试通过
  - [ ] `npm run build:vercel` 成功
  - [ ] `npm run build:static` 成功

## 🚀 Vercel 部署

### 方法一：Dashboard 部署（推荐新手）
- [ ] 访问 [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] 连接 GitHub 仓库
- [ ] 确认构建设置：
  - [ ] 构建命令：`npm run build:vercel`
  - [ ] 输出目录：`.next`
- [ ] 点击部署

### 方法二：CLI 部署
- [ ] 安装 Vercel CLI：`npm install -g vercel`
- [ ] 登录账户：`vercel login`
- [ ] 运行部署：`npm run deploy:vercel`

## ☁️ Cloudflare Pages 部署

### 方法一：Dashboard 部署（推荐新手）
- [ ] 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [ ] 进入 Pages 部分
- [ ] 连接 GitHub 仓库
- [ ] 确认构建设置：
  - [ ] 构建命令：`npm run build:static`
  - [ ] 输出目录：`out`
  - [ ] Node.js 版本：`18`
- [ ] 点击部署

### 方法二：CLI 部署
- [ ] 安装 Wrangler CLI：`npm install -g wrangler`
- [ ] 登录账户：`wrangler login`
- [ ] 运行部署：`npm run deploy:cloudflare`

## 🔄 自动部署设置

如果要启用 GitHub Actions 自动部署：

### Vercel 自动部署
- [ ] 在 GitHub 仓库 Settings > Secrets 中添加：
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`

### Cloudflare Pages 自动部署
- [ ] 在 GitHub 仓库 Settings > Secrets 中添加：
  - [ ] `CLOUDFLARE_API_TOKEN`
  - [ ] `CLOUDFLARE_ACCOUNT_ID`

## 🧪 部署后测试

- [ ] 网站可以正常访问
- [ ] 音频文件可以正常播放
- [ ] 所有功能正常工作：
  - [ ] 白噪音播放/暂停
  - [ ] 音量调节
  - [ ] 预设组合
  - [ ] 番茄计时器
  - [ ] 电子木鱼
  - [ ] 主题切换
  - [ ] 键盘快捷键
- [ ] 移动端适配正常
- [ ] 页面加载速度正常

## 🔧 常见问题排查

### Vercel 部署问题
- [ ] 如果遇到 "Function Runtimes must have a valid version" 错误：
  - [ ] 检查 vercel.json 配置是否正确
  - [ ] 确保没有不必要的 functions 配置
  - [ ] 使用简化的 vercel.json 配置

### 音频文件无法播放
- [ ] 检查浏览器控制台是否有 CORS 错误
- [ ] 确认音频文件路径正确
- [ ] 检查文件是否正确上传

### 构建失败
- [ ] 检查 Node.js 版本（需要 18+）
- [ ] 确认所有依赖已安装
- [ ] 检查 ESLint 错误

### 静态导出问题
- [ ] 确保没有使用服务端 API
- [ ] 检查动态路由配置
- [ ] 验证图片优化设置

## 📊 性能优化检查

- [ ] 启用 CDN 缓存
- [ ] 配置适当的缓存头部
- [ ] 压缩静态资源
- [ ] 优化图片和音频文件

## 🌐 域名配置（可选）

- [ ] 在平台设置中添加自定义域名
- [ ] 配置 DNS 记录
- [ ] 启用 HTTPS
- [ ] 测试域名访问

---

完成所有检查项后，你的泡泡白噪音应用就可以成功部署了！🎉