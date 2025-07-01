# 大文件备份说明

这个目录包含了超过 Cloudflare Pages 25MB 限制的音频文件。

## 📁 备份文件

- `一场温柔的雨_耳聆网_[声音ID：22056].wav` (48.88 MB)

## 🔧 处理建议

### 方法一：音频压缩
1. 使用在线音频压缩工具：
   - [Audio Compressor](https://www.audiocompressor.com/)
   - [Online Audio Converter](https://online-audio-converter.com/)
   - [Convertio](https://convertio.co/wav-mp3/)

2. 推荐设置：
   - 格式：MP3
   - 比特率：128 kbps 或 192 kbps
   - 采样率：44.1 kHz
   - 目标大小：< 20 MB

### 方法二：使用外部 CDN
1. 上传到云存储服务：
   - AWS S3
   - Google Cloud Storage
   - 阿里云 OSS
   - 七牛云

2. 更新代码中的音频 URL 为外部链接

### 方法三：分段处理
1. 将长音频分割成多个较短的片段
2. 实现循环播放逻辑

## 🔄 恢复文件

处理完成后，将优化后的文件放回 `public/` 目录，并更新 `src/app/page.tsx` 中对应的 `audioUrl`。

## ⚠️ 注意事项

- Cloudflare Pages 单文件限制：25 MB
- Vercel 没有单文件大小限制，但有总项目大小限制
- 建议保持音频文件在 10 MB 以下以获得更好的加载性能