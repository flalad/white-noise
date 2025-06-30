'use client';

import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  // 检查当前时间是否应该使用夜间主题
  const shouldUseDarkTheme = () => {
    const now = new Date();
    const hour = now.getHours();
    // 22:00 - 08:00 使用夜间主题
    return hour >= 22 || hour < 8;
  };

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // 如果没有保存的主题，根据时间自动设置
      const autoTheme = shouldUseDarkTheme() ? 'dark' : 'light';
      setTheme(autoTheme);
    }
  }, []);

  // 应用主题到 document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 手动切换主题
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // 根据时间自动切换主题
  const autoSwitchTheme = () => {
    const autoTheme = shouldUseDarkTheme() ? 'dark' : 'light';
    setTheme(autoTheme);
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    autoSwitchTheme,
    isDark: theme === 'dark'
  };
}