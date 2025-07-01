'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Cloud,
  Waves,
  Coffee,
  TreePine,
  Zap,
  Wind,
  Bird,
  Flame,
  Sun,
  Moon
} from 'lucide-react';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useTheme } from '@/hooks/useTheme';
import { GlobalControls } from '@/components/GlobalControls';
import { SoundPresets, type SoundPreset } from '@/components/SoundPresets';
import { HelpPanel } from '@/components/HelpPanel';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { DigitalWoodenFish } from '@/components/DigitalWoodenFish';
import { AnimatedScene } from '@/components/AnimatedScene';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface SoundItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  audioUrl: string;
}

const sounds: SoundItem[] = [
  // 新的雨声音频
  {
    id: 'rain-gentle',
    name: '温柔雨声',
    icon: <Cloud className="w-8 h-8" />,
    color: 'from-blue-100 to-blue-200 border-blue-300',
    description: '一场温柔的雨，带来内心的宁静',
    audioUrl: '/gentle-rain.wav'
  },
  {
    id: 'rain-chill',
    name: '悠闲雨声',
    icon: <Cloud className="w-8 h-8" />,
    color: 'from-slate-100 to-slate-200 border-slate-300',
    description: '放松的雨声，适合冥想和专注',
    audioUrl: '/chill-rain-patreon-sample-364447.mp3'
  },
  {
    id: 'rain-window',
    name: '窗边雨滴',
    icon: <Cloud className="w-8 h-8" />,
    color: 'from-gray-100 to-gray-200 border-gray-300',
    description: '雨滴敲打窗户的声音',
    audioUrl: '/rain-drops-on-window-green-noise-mix-231100.mp3'
  },
  {
    id: 'rain-soft',
    name: '轻柔雨声',
    icon: <Cloud className="w-8 h-8" />,
    color: 'from-indigo-100 to-indigo-200 border-indigo-300',
    description: '柔和的雨声，营造宁静氛围',
    audioUrl: '/lluvia-suave-314513.mp3'
  },
  {
    id: 'rain-surfaces',
    name: '多重雨声',
    icon: <Cloud className="w-8 h-8" />,
    color: 'from-teal-100 to-teal-200 border-teal-300',
    description: '雨滴落在不同表面的丰富音效',
    audioUrl: '/raining-on-multiple-surfaces-mix-231892.mp3'
  },
  {
    id: 'coffee-shop',
    name: '温馨咖啡厅',
    icon: <Coffee className="w-8 h-8" />,
    color: 'from-amber-100 to-amber-200 border-amber-300',
    description: '真实的咖啡厅环境音',
    audioUrl: '/coffee.mp3'
  },
  // 保留原有的程序生成音频
  {
    id: 'ocean',
    name: '海浪',
    icon: <Waves className="w-8 h-8" />,
    color: 'from-cyan-100 to-cyan-200 border-cyan-300',
    description: '海浪拍打海岸的自然节奏',
    audioUrl: '/sounds/ocean.mp3'
  },
  {
    id: 'forest',
    name: '森林',
    icon: <TreePine className="w-8 h-8" />,
    color: 'from-green-100 to-green-200 border-green-300',
    description: '森林中的鸟鸣和风声',
    audioUrl: '/sounds/forest.mp3'
  },
  {
    id: 'thunder',
    name: '雷声',
    icon: <Zap className="w-8 h-8" />,
    color: 'from-purple-100 to-purple-200 border-purple-300',
    description: '远处的雷声，营造戏剧氛围',
    audioUrl: '/sounds/thunder.mp3'
  },
  {
    id: 'wind',
    name: '风声',
    icon: <Wind className="w-8 h-8" />,
    color: 'from-gray-100 to-gray-200 border-gray-300',
    description: '轻柔的风声，带来平静',
    audioUrl: '/sounds/wind.mp3'
  },
  {
    id: 'birds',
    name: '鸟鸣',
    icon: <Bird className="w-8 h-8" />,
    color: 'from-yellow-100 to-yellow-200 border-yellow-300',
    description: '清晨的鸟儿歌声',
    audioUrl: '/sounds/birds.mp3'
  },
  {
    id: 'fire',
    name: '篝火',
    icon: <Flame className="w-8 h-8" />,
    color: 'from-red-100 to-red-200 border-red-300',
    description: '温暖篝火的噼啪声',
    audioUrl: '/sounds/fire.mp3'
  }
];

export default function Home() {
  const {
    toggleSound,
    adjustVolume,
    stopAllSounds,
    isPlaying,
    getVolume,
    getPlayingSounds,
    setMasterVolumeLevel,
    masterVolume,
    applyPreset,
    isPresetActive
  } = useAudioManager();

  const { toggleTheme, autoSwitchTheme, isDark } = useTheme();

  const playingSounds = getPlayingSounds();

  // 自动根据时间切换主题
  useEffect(() => {
    // 立即检查一次
    autoSwitchTheme();
    
    // 每分钟检查一次时间，自动切换主题
    const interval = setInterval(() => {
      autoSwitchTheme();
    }, 60000); // 60秒检查一次

    return () => clearInterval(interval);
  }, [autoSwitchTheme]);

  const handleApplyPreset = async (preset: SoundPreset) => {
    if (isPresetActive(preset)) {
      stopAllSounds();
    } else {
      await applyPreset(preset);
    }
  };

  const handleMasterVolumeUp = () => {
    const newVolume = Math.min(1, masterVolume + 0.1);
    setMasterVolumeLevel(newVolume);
  };

  const handleMasterVolumeDown = () => {
    const newVolume = Math.max(0, masterVolume - 0.1);
    setMasterVolumeLevel(newVolume);
  };

  const handleToggleSound = (soundId: string) => {
    const sound = sounds.find(s => s.id === soundId);
    if (sound) {
      toggleSound(soundId, sound.audioUrl);
    }
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onStopAll: stopAllSounds,
    onToggleSound: handleToggleSound,
    onMasterVolumeUp: handleMasterVolumeUp,
    onMasterVolumeDown: handleMasterVolumeDown
  });

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-blue-50/50 via-white to-green-50/30'
    }`}>
      {/* Help Panel */}
      <HelpPanel />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative"
        >
          {/* Theme Toggle Button */}
          <div className="absolute top-0 right-0">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-all duration-300 ${
                isDark
                  ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                  : 'bg-white/80 text-gray-600 hover:bg-white shadow-sm'
              }`}
              title={isDark ? '切换到白天模式' : '切换到夜间模式'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 shadow-sm ${
            isDark
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
              : 'bg-gradient-to-br from-blue-300 to-cyan-300'
          }`}>
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <h1 className={`text-2xl md:text-3xl font-semibold mb-2 ${
            isDark
              ? 'bg-gradient-to-r from-slate-200 to-slate-100 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent'
          }`}>
            泡泡白噪音
          </h1>
          <p className={`text-sm max-w-md mx-auto ${
            isDark ? 'text-slate-400' : 'text-gray-500'
          }`}>
            在这里找到内心的平静 · 创造属于你的宁静空间
          </p>
          
          {/* Time-based theme indicator */}
          <div className={`mt-3 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
            {isDark ? '🌙 夜间模式 (22:00-08:00)' : '☀️ 白天模式 (08:00-22:00)'}
          </div>
        </motion.div>

        {/* Main Layout: Left sidebar + Right scene */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Left Sidebar - Tools */}
          <div className="flex flex-col gap-3 w-full h-[380px]">
            <div className="h-[58%]">
              <PomodoroTimer />
            </div>
            <div className="h-[42%]">
              <DigitalWoodenFish />
            </div>
          </div>

          {/* Right Side - Animated Scene */}
          <div className="w-full h-[380px]">
            <AnimatedScene />
          </div>
        </div>

        {/* Sound Presets */}
        <SoundPresets
          onApplyPreset={handleApplyPreset}
          isPresetActive={isPresetActive}
        />

        {/* Sound Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {sounds.map((sound, index) => (
            <motion.div
              key={sound.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className={`relative overflow-hidden rounded-2xl border-2 p-6 shadow-lg card-hover backdrop-blur-sm transition-all duration-300 ${
                isDark
                  ? `bg-gradient-to-br ${sound.color.replace('from-', 'from-slate-700/50 dark:from-').replace('to-', 'to-slate-600/50 dark:to-').replace('border-', 'border-slate-500/30 dark:border-')} bg-slate-800/50`
                  : `bg-gradient-to-br ${sound.color}`
              }`}>
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                      {sound.icon}
                    </div>
                    <button
                      onClick={() => toggleSound(sound.id, sound.audioUrl)}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        isPlaying(sound.id)
                          ? 'bg-blue-500 text-white shadow-lg scale-110'
                          : isDark
                            ? 'bg-slate-700/80 text-slate-300 hover:bg-slate-600/80 hover:shadow-md'
                            : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      {isPlaying(sound.id) ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <h3 className={`text-xl font-semibold mb-2 ${
                    isDark ? 'text-slate-200' : 'text-gray-800'
                  }`}>
                    {sound.name}
                  </h3>
                  <p className={`text-sm mb-4 leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    {sound.description}
                  </p>

                  {/* Volume Control */}
                  {isPlaying(sound.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`flex items-center gap-3 mt-4 p-3 rounded-lg ${
                        isDark ? 'bg-slate-700/50' : 'bg-white/50'
                      }`}
                    >
                      <VolumeX className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={getVolume(sound.id)}
                        onChange={(e) => adjustVolume(sound.id, parseFloat(e.target.value))}
                        className="flex-1 h-2 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <Volume2 className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Controls */}
        <GlobalControls
          playingSounds={playingSounds}
          onStopAll={stopAllSounds}
          onMasterVolumeChange={setMasterVolumeLevel}
          masterVolume={masterVolume}
        />

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`text-center mt-20 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
        >
          <div className={`backdrop-blur-sm rounded-2xl p-8 mx-auto max-w-2xl ${
            isDark ? 'bg-slate-800/30' : 'bg-white/30'
          }`}>
            <p className="mb-6 text-lg">
              让声音带你远离喧嚣，找到内心的宁静 🌸
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <a href="#" className={`transition-colors ${
                isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
              }`}>关于我们</a>
              <a href="#" className={`transition-colors ${
                isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
              }`}>使用条款</a>
              <a href="#" className={`transition-colors ${
                isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
              }`}>隐私政策</a>
            </div>
            <div className={`mt-6 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
              © 2024 泡泡白噪音 · 专注与放松的一站式平台
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
