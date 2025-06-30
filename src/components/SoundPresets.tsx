'use client';

import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface SoundPreset {
  id: string;
  name: string;
  description: string;
  sounds: Array<{
    id: string;
    volume: number;
  }>;
  gradient: string;
}

const presets: SoundPreset[] = [
  {
    id: 'gentle-rain',
    name: '温柔雨声',
    description: '一场温柔的雨，带来内心的宁静',
    sounds: [
      { id: 'rain-gentle', volume: 0.8 }
    ],
    gradient: 'from-blue-100 to-gray-100 border-blue-300'
  },
  {
    id: 'cozy-cafe',
    name: '温馨咖啡厅',
    description: '真实的咖啡厅环境音',
    sounds: [
      { id: 'coffee-shop', volume: 0.7 }
    ],
    gradient: 'from-amber-100 to-orange-100 border-amber-300'
  },
  {
    id: 'rainy-cafe',
    name: '雨天咖啡厅',
    description: '温暖的咖啡厅配上窗外的雨声',
    sounds: [
      { id: 'rain-window', volume: 0.6 },
      { id: 'coffee-shop', volume: 0.5 }
    ],
    gradient: 'from-amber-100 to-blue-100 border-amber-300'
  },
  {
    id: 'chill-rain',
    name: '悠闲雨声',
    description: '放松的雨声，适合冥想和专注',
    sounds: [
      { id: 'rain-chill', volume: 0.8 }
    ],
    gradient: 'from-slate-100 to-blue-100 border-slate-300'
  },
  {
    id: 'window-rain',
    name: '窗边雨滴',
    description: '雨滴敲打窗户的声音',
    sounds: [
      { id: 'rain-window', volume: 0.8 }
    ],
    gradient: 'from-gray-100 to-blue-100 border-gray-300'
  },
  {
    id: 'soft-rain',
    name: '轻柔雨声',
    description: '柔和的雨声，营造宁静氛围',
    sounds: [
      { id: 'rain-soft', volume: 0.8 }
    ],
    gradient: 'from-indigo-100 to-blue-100 border-indigo-300'
  },
  {
    id: 'rain-surfaces',
    name: '多重雨声',
    description: '雨滴落在不同表面的丰富音效',
    sounds: [
      { id: 'rain-surfaces', volume: 0.8 }
    ],
    gradient: 'from-teal-100 to-blue-100 border-teal-300'
  },
  {
    id: 'forest-storm',
    name: '森林雷雨',
    description: '森林中的雷雨天气',
    sounds: [
      { id: 'forest', volume: 0.5 },
      { id: 'thunder', volume: 0.3 },
      { id: 'rain-ambient1', volume: 0.7 }
    ],
    gradient: 'from-green-100 to-purple-100 border-green-300'
  },
  {
    id: 'ocean-breeze',
    name: '海边微风',
    description: '海浪声配上轻柔的风声',
    sounds: [
      { id: 'ocean', volume: 0.8 },
      { id: 'wind', volume: 0.4 }
    ],
    gradient: 'from-cyan-100 to-blue-100 border-cyan-300'
  },
  {
    id: 'campfire-night',
    name: '篝火夜晚',
    description: '篝火旁的宁静夜晚',
    sounds: [
      { id: 'fire', volume: 0.7 },
      { id: 'wind', volume: 0.3 },
      { id: 'forest', volume: 0.2 }
    ],
    gradient: 'from-orange-100 to-red-100 border-orange-300'
  },
  {
    id: 'morning-birds',
    name: '晨间鸟鸣',
    description: '清晨的鸟儿歌声和森林声音',
    sounds: [
      { id: 'birds', volume: 0.8 },
      { id: 'forest', volume: 0.5 },
      { id: 'wind', volume: 0.2 }
    ],
    gradient: 'from-yellow-100 to-green-100 border-yellow-300'
  },
  {
    id: 'ambient-rain-mix',
    name: '环境雨声混合',
    description: '多种雨声的完美融合',
    sounds: [
      { id: 'rain-ambient2', volume: 0.6 },
      { id: 'rain-ambient3', volume: 0.4 }
    ],
    gradient: 'from-purple-100 to-blue-100 border-purple-300'
  },
  {
    id: 'cafe-gentle-rain',
    name: '咖啡厅温柔雨',
    description: '温馨咖啡厅配上温柔的雨声',
    sounds: [
      { id: 'coffee-shop', volume: 0.6 },
      { id: 'rain-gentle', volume: 0.5 }
    ],
    gradient: 'from-amber-100 to-slate-100 border-amber-300'
  },
  {
    id: 'cafe-soft-rain',
    name: '咖啡厅轻柔雨',
    description: '咖啡厅与轻柔雨声的完美结合',
    sounds: [
      { id: 'coffee-shop', volume: 0.7 },
      { id: 'rain-soft', volume: 0.4 }
    ],
    gradient: 'from-orange-100 to-indigo-100 border-orange-300'
  },
  {
    id: 'cafe-chill-rain',
    name: '咖啡厅悠闲雨',
    description: '在咖啡厅享受悠闲的雨天时光',
    sounds: [
      { id: 'coffee-shop', volume: 0.5 },
      { id: 'rain-chill', volume: 0.6 }
    ],
    gradient: 'from-yellow-100 to-slate-100 border-yellow-300'
  }
];

interface SoundPresetsProps {
  onApplyPreset: (preset: SoundPreset) => void;
  isPresetActive: (preset: SoundPreset) => boolean;
}

export const SoundPresets = ({ onApplyPreset, isPresetActive }: SoundPresetsProps) => {
  const { isDark } = useTheme();
  
  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
          精选组合
        </h2>
        <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
          一键开启完美的声音组合
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {presets.map((preset, index) => (
          <motion.div
            key={preset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className={`relative overflow-hidden rounded-xl border-2 p-4 shadow-lg card-hover backdrop-blur-sm transition-all duration-300 ${
              isDark
                ? `bg-gradient-to-br ${preset.gradient.replace('from-', 'from-slate-700/50 dark:from-').replace('to-', 'to-slate-600/50 dark:to-').replace('border-', 'border-slate-500/30 dark:border-')} bg-slate-800/50`
                : `bg-gradient-to-br ${preset.gradient}`
            }`}>
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                    {preset.name}
                  </h3>
                  <button
                    onClick={() => onApplyPreset(preset)}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isPresetActive(preset)
                        ? 'bg-blue-500 text-white shadow-lg scale-110'
                        : isDark
                          ? 'bg-slate-700/80 text-slate-300 hover:bg-slate-600/80 hover:shadow-md'
                          : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    {isPresetActive(preset) ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className={`text-sm mb-3 leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  {preset.description}
                </p>

                {/* Sound indicators */}
                <div className="flex flex-wrap gap-1">
                  {preset.sounds.map((sound) => (
                    <span
                      key={sound.id}
                      className={`px-2 py-1 rounded-md text-xs ${
                        isDark
                          ? 'bg-slate-700/60 text-slate-300'
                          : 'bg-white/60 text-gray-700'
                      }`}
                    >
                      {getSoundDisplayName(sound.id)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
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
    'fire': '篝火',
    // 新的雨声音频
    'rain-gentle': '温柔雨声',
    'rain-chill': '悠闲雨声',
    'rain-soft': '轻柔雨声',
    'rain-window': '窗边雨滴',
    'rain-surfaces': '多重雨声',
    'rain-ambient1': '环境雨声1',
    'rain-ambient2': '环境雨声2',
    'rain-ambient3': '环境雨声3',
    // 咖啡厅音频
    'coffee-shop': '咖啡厅'
  };
  return displayNames[soundId] || soundId;
}

export type { SoundPreset };
