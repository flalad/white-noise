import type { NextConfig } from "next";

const isStatic = process.env.BUILD_MODE === 'static';

const nextConfig: NextConfig = {
  // 根据环境变量决定是否使用静态导出
  ...(isStatic && {
    output: 'export',
    trailingSlash: true,
  }),
  
  images: {
    unoptimized: true
  },
  
  // 只在非静态模式下添加 headers
  ...(!isStatic && {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Cross-Origin-Embedder-Policy',
              value: 'unsafe-none',
            },
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'same-origin-allow-popups',
            },
          ],
        },
      ];
    },
  }),
};

export default nextConfig;
