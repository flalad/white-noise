'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RotateCcw, Play, Pause } from 'lucide-react';

export function DigitalWoodenFish() {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMerit, setShowMerit] = useState(false);
  const [isAutoTapping, setIsAutoTapping] = useState(false);
  const [autoTapInterval, setAutoTapInterval] = useState<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isAutoTapping) {
      const interval = setInterval(() => {
        handleTap();
      }, 1000);
      setAutoTapInterval(interval);
    } else if (autoTapInterval) {
      clearInterval(autoTapInterval);
      setAutoTapInterval(null);
    }

    return () => {
      if (autoTapInterval) {
        clearInterval(autoTapInterval);
      }
    };
  }, [isAutoTapping]);

  const merits = [
    '功德+1', '心静如水', '福慧双修', '善念增长',
    '业障消除', '智慧开启', '慈悲心起', '清净自在'
  ];

  const handleTap = () => {
    setCount(prev => prev + 1);
    setIsAnimating(true);
    setShowMerit(true);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);

    setTimeout(() => {
      setShowMerit(false);
    }, 1500);
  };

  const resetCount = () => {
    setCount(0);
  };

  const toggleAutoTap = () => {
    setIsAutoTapping(!isAutoTapping);
  };

  const currentMerit = merits[count % merits.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/30 hover:shadow-md transition-all duration-300 h-full flex flex-col"
    >
      <div className="flex items-center gap-1.5 mb-3">
        <div className="p-1 bg-amber-50 rounded-md">
          <Heart className="w-3 h-3 text-amber-500" />
        </div>
        <h3 className="text-sm font-medium text-gray-700">电子木鱼</h3>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <button
              onClick={handleTap}
              className="w-16 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-amber-200 relative overflow-hidden group flex items-center justify-center"
            >
              <img 
                src="/wooden-fish.svg" 
                alt="木鱼" 
                className="w-8 h-8 opacity-80"
              />
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={isAnimating ? { scale: 1.5, opacity: 0 } : { scale: 0, opacity: 1 }}
                className="absolute inset-0 border border-amber-300 rounded-lg"
              />
            </button>
            <AnimatePresence>
              {showMerit && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.8 }}
                  animate={{ opacity: 1, y: -20, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.8 }}
                  className="absolute -top-5 left-1/2 transform -translate-x-1/2 pointer-events-none"
                >
                  <div className="bg-gradient-to-r from-amber-300 to-orange-300 text-white px-1.5 py-0.5 rounded-md text-xs font-medium shadow-sm flex items-center gap-0.5">
                    <Sparkles className="w-2 h-2" />
                    {currentMerit}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          {/* 顺序与番茄计时器一致：自动在左，重置在右，圆形按钮 */}
          <button
            onClick={toggleAutoTap}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              isAutoTapping
                ? 'bg-green-400 text-white shadow-sm'
                : 'bg-gray-300 text-gray-600 shadow-sm hover:bg-gray-400'
            }`}
            title="自动敲击"
          >
            {isAutoTapping ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            onClick={resetCount}
            className="p-1.5 rounded-lg bg-gray-300 text-gray-600 shadow-sm hover:bg-gray-400 transition-all duration-200"
            title="重置"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
        {/* 进度条 */}
        <div className="w-full mt-2">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((count % 100) / 100 * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-center text-xs text-gray-500 mt-1">{count}</div>
        </div>
      </div>
    </motion.div>
  );
}