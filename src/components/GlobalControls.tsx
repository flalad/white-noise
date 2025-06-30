'use client';

import { motion } from 'framer-motion';
import { StopCircle, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface GlobalControlsProps {
  playingSounds: string[];
  onStopAll: () => void;
  onMasterVolumeChange: (volume: number) => void;
  masterVolume: number;
}

export const GlobalControls = ({
  playingSounds,
  onStopAll,
  onMasterVolumeChange,
  masterVolume
}: GlobalControlsProps) => {
  const { isDark } = useTheme();
  
  if (playingSounds.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 backdrop-blur-md rounded-2xl p-4 shadow-xl border transition-all duration-300 ${
        isDark
          ? 'bg-slate-800/90 text-slate-200 border-slate-600/50'
          : 'bg-white/90 text-gray-800 border-gray-200'
      }`}
    >
      <div className="flex flex-col gap-4 min-w-[200px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              {playingSounds.length} 个声音播放中
            </span>
          </div>
          <button
            onClick={onStopAll}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'bg-red-900/50 hover:bg-red-800/50 text-red-400'
                : 'bg-red-100 hover:bg-red-200 text-red-600'
            }`}
            title="停止所有声音"
          >
            <StopCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Master Volume Control */}
        <div className="flex items-center gap-3">
          <VolumeX className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={masterVolume}
              onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <Volume2 className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
        </div>

        {/* Playing Sounds List */}
        <div className="space-y-1">
          <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>正在播放:</div>
          <div className="flex flex-wrap gap-1">
            {playingSounds.map((soundId) => (
              <span
                key={soundId}
                className={`px-2 py-1 rounded-md text-xs ${
                  isDark
                    ? 'bg-blue-900/50 text-blue-300'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {getSoundDisplayName(soundId)}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <button
            onClick={onStopAll}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
              isDark
                ? 'bg-red-900/50 hover:bg-red-800/50 text-red-400'
                : 'bg-red-100 hover:bg-red-200 text-red-700'
            }`}
          >
            <StopCircle className="w-4 h-4" />
            停止全部
          </button>
          <button
            onClick={() => onMasterVolumeChange(0.5)}
            className={`flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
              isDark
                ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="重置音量"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

function getSoundDisplayName(soundId: string): string {
  const displayNames: Record<string, string> = {
    'rain': '雨声',
    'ocean': '海浪',
    'coffee': '咖啡厅',
    'forest': '森林',
    'thunder': '雷声',
    'wind': '风声',
    'birds': '鸟鸣',
    'fire': '篝火'
  };
  return displayNames[soundId] || soundId;
}
