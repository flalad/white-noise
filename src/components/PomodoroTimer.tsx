'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && (minutes > 0 || seconds > 0)) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0 && isActive) {
      // Timer finished
      setIsActive(false);
      if (mode === 'work') {
        setMode('break');
        setMinutes(5);
      } else {
        setMode('work');
        setMinutes(25);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
  };

  const switchMode = () => {
    setIsActive(false);
    if (mode === 'work') {
      setMode('break');
      setMinutes(5);
    } else {
      setMode('work');
      setMinutes(25);
    }
    setSeconds(0);
  };

  const progress = mode === 'work' 
    ? ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100
    : ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/30 hover:shadow-md transition-all duration-300 h-full flex flex-col"
    >
      <div className="flex items-center gap-1.5 mb-3">
        <div className="p-1 bg-red-50 rounded-md">
          <Timer className="w-3 h-3 text-red-500" />
        </div>
        <h3 className="text-sm font-medium text-gray-700">番茄计时</h3>
      </div>

      {/* Timer Display */}
      <div className="flex-1 flex flex-col justify-center items-center mb-3">
        <div className="relative w-20 h-20 mx-auto mb-2">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-100"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className={mode === 'work' ? 'text-red-400' : 'text-green-400'}
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-700">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div className={`text-xs ${mode === 'work' ? 'text-red-500' : 'text-green-500'}`}>
                {mode === 'work' ? '专注' : '休息'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-1.5 mb-2">
        <button
          onClick={toggleTimer}
          className={`p-1.5 rounded-lg transition-all duration-200 ${
            isActive
              ? 'bg-red-400 text-white shadow-sm'
              : 'bg-green-400 text-white shadow-sm hover:bg-green-500'
          }`}
        >
          {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-1.5 rounded-lg bg-gray-300 text-gray-600 shadow-sm hover:bg-gray-400 transition-all duration-200"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Mode Switch */}
      <div className="flex justify-center">
        <button
          onClick={switchMode}
          className={`px-2 py-1 rounded-lg text-xs transition-all duration-200 ${
            mode === 'work'
              ? 'bg-green-50 text-green-600 hover:bg-green-100'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          {mode === 'work' ? '休息' : '专注'}
        </button>
      </div>
    </motion.div>
  );
}