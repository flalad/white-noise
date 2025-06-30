import { useState, useCallback, useEffect } from 'react';
import { getAudioGenerator } from '@/utils/audioGenerator';

interface AudioState {
  isPlaying: boolean;
  volume: number;
}

type SoundType = 'rain' | 'ocean' | 'wind' | 'fire' | 'forest' | 'coffee' | 'thunder' | 'birds' |
                 'rain-gentle' | 'rain-chill' | 'rain-soft' | 'rain-window' | 'rain-surfaces' |
                 'rain-ambient1' | 'rain-ambient2' | 'rain-ambient3' | 'coffee-shop';

export const useAudioManager = () => {
  const [audioStates, setAudioStates] = useState<Record<string, AudioState>>({});
  const [masterVolume, setMasterVolume] = useState(0.6); // Lower default master volume
  const audioGenerator = getAudioGenerator();

  const getSoundType = useCallback((soundId: string): SoundType => {
    // Map sound IDs to sound types
    const soundTypeMap: Record<string, SoundType> = {
      'rain': 'rain',
      'ocean': 'ocean',
      'coffee': 'coffee',
      'forest': 'forest',
      'thunder': 'thunder',
      'wind': 'wind',
      'birds': 'birds',
      'fire': 'fire',
      // 新的雨声音频
      'rain-gentle': 'rain-gentle',
      'rain-chill': 'rain-chill',
      'rain-soft': 'rain-soft',
      'rain-window': 'rain-window',
      'rain-surfaces': 'rain-surfaces',
      'rain-ambient1': 'rain-ambient1',
      'rain-ambient2': 'rain-ambient2',
      'rain-ambient3': 'rain-ambient3',
      // 咖啡厅音频
      'coffee-shop': 'coffee-shop'
    };
    return soundTypeMap[soundId] || 'rain';
  }, []);

  // Basic functions first
  const getPlayingSounds = useCallback(() => {
    return Object.entries(audioStates)
      .filter(([, state]) => state.isPlaying)
      .map(([soundId]) => soundId);
  }, [audioStates]);

  const isPlaying = useCallback((soundId: string) => {
    return audioStates[soundId]?.isPlaying || false;
  }, [audioStates]);

  const getVolume = useCallback((soundId: string) => {
    return audioStates[soundId]?.volume || 0.3;
  }, [audioStates]);

  const stopAllSounds = useCallback(() => {
    audioGenerator.stopAll();

    setAudioStates(prev => {
      const newStates = { ...prev };
      Object.keys(newStates).forEach(soundId => {
        newStates[soundId] = {
          ...newStates[soundId],
          isPlaying: false
        };
      });
      return newStates;
    });
  }, [audioGenerator]);

  const toggleSound = useCallback(async (soundId: string, _audioUrl: string) => {
    const currentState = audioStates[soundId];
    const isCurrentlyPlaying = currentState?.isPlaying || false;

    if (isCurrentlyPlaying) {
      // Stop the sound
      audioGenerator.stopSound(soundId);

      setAudioStates(prev => ({
        ...prev,
        [soundId]: {
          ...prev[soundId],
          isPlaying: false
        }
      }));
    } else {
      // Start the sound
      try {
        const soundType = getSoundType(soundId);
        await audioGenerator.startSound(soundId, soundType);

        // Set initial volume (lower default)
        const volume = currentState?.volume || 0.3;
        audioGenerator.setVolume(soundId, volume * masterVolume);

        setAudioStates(prev => ({
          ...prev,
          [soundId]: {
            isPlaying: true,
            volume
          }
        }));
      } catch (error) {
        console.error(`Error playing ${soundId}:`, error);
      }
    }
  }, [audioStates, audioGenerator, getSoundType, masterVolume]);

  const adjustVolume = useCallback((soundId: string, volume: number) => {
    const finalVolume = volume * masterVolume;
    audioGenerator.setVolume(soundId, finalVolume);

    setAudioStates(prev => ({
      ...prev,
      [soundId]: {
        ...prev[soundId],
        volume
      }
    }));
  }, [audioGenerator, masterVolume]);

  const setMasterVolumeLevel = useCallback((volume: number) => {
    setMasterVolume(volume);

    // Update all currently playing sounds with new master volume
    Object.entries(audioStates).forEach(([soundId, state]) => {
      if (state.isPlaying) {
        const finalVolume = state.volume * volume;
        audioGenerator.setVolume(soundId, finalVolume);
      }
    });
  }, [audioGenerator, audioStates]);

  const applyPreset = useCallback(async (preset: { sounds: Array<{ id: string; volume: number }> }) => {
    // Stop all current sounds first
    stopAllSounds();

    // Wait a bit for sounds to stop
    await new Promise(resolve => setTimeout(resolve, 100));

    // Start each sound in the preset
    for (const sound of preset.sounds) {
      const soundType = getSoundType(sound.id);
      try {
        await audioGenerator.startSound(sound.id, soundType);
        const finalVolume = sound.volume * masterVolume;
        audioGenerator.setVolume(sound.id, finalVolume);

        setAudioStates(prev => ({
          ...prev,
          [sound.id]: {
            isPlaying: true,
            volume: sound.volume
          }
        }));
      } catch (error) {
        console.error(`Error starting preset sound ${sound.id}:`, error);
      }
    }
  }, [audioGenerator, masterVolume, getSoundType, stopAllSounds]);

  const isPresetActive = useCallback((preset: { sounds: Array<{ id: string; volume: number }> }) => {
    const playingSounds = getPlayingSounds();
    const presetSoundIds = preset.sounds.map(s => s.id);

    // Check if all preset sounds are playing and no extra sounds
    return presetSoundIds.length === playingSounds.length &&
           presetSoundIds.every(id => playingSounds.includes(id));
  }, [getPlayingSounds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioGenerator.stopAll();
    };
  }, [audioGenerator]);

  return {
    toggleSound,
    adjustVolume,
    stopAllSounds,
    getPlayingSounds,
    isPlaying,
    getVolume,
    setMasterVolumeLevel,
    masterVolume,
    applyPreset,
    isPresetActive,
    audioStates
  };
};
