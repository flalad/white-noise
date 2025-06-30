'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Keyboard } from 'lucide-react';

export const HelpPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'ESC', description: '停止所有声音' },
    { key: 'SPACE', description: '切换雨声' },
    { key: '↑', description: '增加主音量' },
    { key: '↓', description: '减少主音量' },
    { key: '1', description: '切换雨声' },
    { key: '2', description: '切换海浪' },
    { key: '3', description: '切换咖啡厅' },
    { key: '4', description: '切换森林' },
    { key: '5', description: '切换雷声' },
    { key: '6', description: '切换风声' },
    { key: '7', description: '切换鸟鸣' },
    { key: '8', description: '切换篝火' },
  ];

  return (
    <>
      {/* Help Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-full text-gray-700 hover:bg-white shadow-lg border border-gray-200 transition-colors z-40"
        title="帮助和快捷键"
      >
        <HelpCircle className="w-5 h-5" />
      </motion.button>

      {/* Help Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Keyboard className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">键盘快捷键</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Shortcuts List */}
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <motion.div
                    key={shortcut.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700">{shortcut.description}</span>
                    <kbd className="px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded font-mono border">
                      {shortcut.key}
                    </kbd>
                  </motion.div>
                ))}
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-blue-700 font-semibold mb-2">使用提示</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 可以同时播放多个声音来创造独特的氛围</li>
                  <li>• 使用音量滑块调节每个声音的强度</li>
                  <li>• 尝试不同的预设组合找到最适合的声音</li>
                  <li>• 在专注工作或放松时使用白噪音效果最佳</li>
                </ul>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg"
              >
                知道了
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
