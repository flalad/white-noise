// Audio generator for creating realistic white noise and nature sounds

export class AudioGenerator {
  private audioContext: AudioContext | null = null;
  private activeNodes: Map<string, {
    sources: AudioBufferSourceNode[];
    gainNode: GainNode;
    filters: BiquadFilterNode[];
    audioElement?: HTMLAudioElement;
  }> = new Map();
  private audioBuffers: Map<string, AudioBuffer> = new Map();

  // 音频文件映射
  private audioFiles: Record<string, string> = {
    // 雨声音频文件
    'rain-gentle': '/一场温柔的雨_耳聆网_[声音ID：22056].wav',
    'rain-chill': '/chill-rain-patreon-sample-364447.mp3',
    'rain-soft': '/lluvia-suave-314513.mp3',
    'rain-window': '/rain-drops-on-window-green-noise-mix-231100.mp3',
    'rain-surfaces': '/raining-on-multiple-surfaces-mix-231892.mp3',
    'rain-ambient1': '/637b512d6d3cf237.mp3',
    'rain-ambient2': '/63bfb65f91fc7348.mp3',
    'rain-ambient3': '/VCG231106751.mp3',
    // 咖啡厅音频
    'coffee-shop': '/coffee.mp3',
    // 保留原有的程序生成音频作为备选
    'rain': 'generated',
    'ocean': 'generated',
    'wind': 'generated',
    'fire': 'generated',
    'forest': 'generated',
    'coffee': 'generated',
    'thunder': 'generated',
    'birds': 'generated'
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) return null;
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    return this.audioContext;
  }

  private async loadAudioFile(url: string): Promise<AudioBuffer> {
    if (this.audioBuffers.has(url)) {
      return this.audioBuffers.get(url)!;
    }

    const context = await this.ensureAudioContext();
    if (!context) throw new Error('AudioContext not available');

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(url, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.error(`Failed to load audio file: ${url}`, error);
      throw error;
    }
  }

  async startSound(soundId: string, type: 'rain' | 'ocean' | 'wind' | 'fire' | 'forest' | 'coffee' | 'thunder' | 'birds' | string) {
    const context = await this.ensureAudioContext();
    if (!context) return;

    // Stop existing sound if playing
    this.stopSound(soundId);

    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.connect(context.destination);

    const sources: AudioBufferSourceNode[] = [];
    const filters: BiquadFilterNode[] = [];

    // 检查是否有对应的音频文件
    const audioFile = this.audioFiles[soundId] || this.audioFiles[type];
    
    if (audioFile && audioFile !== 'generated') {
      // 使用真实音频文件
      try {
        const audioBuffer = await this.loadAudioFile(audioFile);
        const source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(gainNode);
        source.start();
        sources.push(source);
      } catch (error) {
        console.error(`Failed to play audio file for ${soundId}, falling back to generated sound`, error);
        // 如果音频文件加载失败，回退到程序生成的音频
        this.createGeneratedSound(context, sources, filters, gainNode, type as any);
      }
    } else {
      // 使用程序生成的音频
      this.createGeneratedSound(context, sources, filters, gainNode, type as any);
    }

    // Store references
    this.activeNodes.set(soundId, {
      sources,
      gainNode,
      filters
    });
  }

  private createGeneratedSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode, type: 'rain' | 'ocean' | 'wind' | 'fire' | 'forest' | 'coffee' | 'thunder' | 'birds') {
    // Create realistic sounds based on type
    switch (type) {
      case 'rain':
        this.createRainSound(context, sources, filters, gainNode);
        break;

      case 'ocean':
        this.createOceanSound(context, sources, filters, gainNode);
        break;

      case 'wind':
        this.createWindSound(context, sources, filters, gainNode);
        break;

      case 'fire':
        this.createFireSound(context, sources, filters, gainNode);
        break;

      case 'forest':
        this.createForestSound(context, sources, filters, gainNode);
        break;

      case 'coffee':
        this.createCoffeeShopSound(context, sources, filters, gainNode);
        break;

      case 'thunder':
        this.createThunderSound(context, sources, filters, gainNode);
        break;

      case 'birds':
        this.createBirdSound(context, sources, filters, gainNode);
        break;
    }
  }

  stopSound(soundId: string) {
    const nodes = this.activeNodes.get(soundId);
    if (!nodes) return;

    // Stop all sources
    nodes.sources.forEach(source => {
      try {
        source.stop();
      } catch {
        // Source might already be stopped
      }
    });

    // Disconnect all nodes
    nodes.gainNode.disconnect();
    nodes.filters.forEach(filter => filter.disconnect());

    this.activeNodes.delete(soundId);
  }

  setVolume(soundId: string, volume: number) {
    const nodes = this.activeNodes.get(soundId);
    if (nodes && this.audioContext) {
      nodes.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }

  private createNoiseBuffer(context: AudioContext, type: 'white' | 'pink' | 'brown' = 'white'): AudioBuffer {
    const bufferSize = 2 * context.sampleRate;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'white') {
      // Gentle white noise
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.5; // Reduce amplitude
      }
    } else if (type === 'pink') {
      // Gentle pink noise - 1/f noise
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = (Math.random() * 2 - 1) * 0.7; // Reduce input amplitude
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.08; // Reduce output amplitude
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      // Gentle brown noise - 1/f² noise
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = (Math.random() * 2 - 1) * 0.6; // Reduce input amplitude
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 2.0; // Reduce output amplitude
      }
    }

    return buffer;
  }

  private createRainSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create gentle rain sound with pink noise
    const noiseBuffer = this.createNoiseBuffer(context, 'pink');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Gentle low-pass filter for soft rain
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, context.currentTime);
    filter.Q.setValueAtTime(0.3, context.currentTime);

    // Add a second filter for extra smoothness
    const filter2 = context.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(6000, context.currentTime);
    filter2.Q.setValueAtTime(0.2, context.currentTime);

    source.connect(filter);
    filter.connect(filter2);
    filter2.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter, filter2);
  }

  private createOceanSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create gentle ocean waves with brown noise
    const noiseBuffer = this.createNoiseBuffer(context, 'brown');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Very gentle low-pass filter for soft ocean sound
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, context.currentTime);
    filter.Q.setValueAtTime(0.3, context.currentTime);

    // Add very gentle wave oscillation
    const waveOsc = context.createOscillator();
    waveOsc.type = 'sine';
    waveOsc.frequency.setValueAtTime(0.05, context.currentTime); // Much slower waves

    const waveGain = context.createGain();
    waveGain.gain.setValueAtTime(0.1, context.currentTime); // Much quieter

    waveOsc.connect(waveGain);
    waveGain.connect(gainNode);
    waveOsc.start();

    source.connect(filter);
    filter.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter);
  }

  private createWindSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create very gentle wind with brown noise
    const noiseBuffer = this.createNoiseBuffer(context, 'brown');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Gentle low-pass filter for soft wind
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, context.currentTime);
    filter.Q.setValueAtTime(0.2, context.currentTime);

    // Add a second filter for extra smoothness
    const filter2 = context.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(3000, context.currentTime);
    filter2.Q.setValueAtTime(0.1, context.currentTime);

    source.connect(filter);
    filter.connect(filter2);
    filter2.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter, filter2);
  }

  private createFireSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create gentle crackling fire sound
    const noiseBuffer = this.createNoiseBuffer(context, 'brown');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Very gentle low-pass filter for warm fire sound
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, context.currentTime);
    filter.Q.setValueAtTime(0.2, context.currentTime);

    // Add warmth with another filter
    const filter2 = context.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(2500, context.currentTime);
    filter2.Q.setValueAtTime(0.1, context.currentTime);

    source.connect(filter);
    filter.connect(filter2);
    filter2.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter, filter2);
  }

  private createForestSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create ambient forest sound with multiple layers
    const noiseBuffer = this.createNoiseBuffer(context, 'pink');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Band-pass filter for forest ambience
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, context.currentTime);
    filter.Q.setValueAtTime(0.5, context.currentTime);

    source.connect(filter);
    filter.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter);
  }

  private createCoffeeShopSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create coffee shop ambience with brown noise
    const noiseBuffer = this.createNoiseBuffer(context, 'brown');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Low-pass filter for muffled conversation
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, context.currentTime);
    filter.Q.setValueAtTime(0.7, context.currentTime);

    source.connect(filter);
    filter.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter);
  }

  private createThunderSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create very gentle distant thunder
    const noiseBuffer = this.createNoiseBuffer(context, 'brown');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Gentle low-frequency filter for soft rumble
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, context.currentTime); // Higher frequency for less intensity
    filter.Q.setValueAtTime(0.3, context.currentTime); // Lower Q for gentleness

    // Add another filter to make it even softer
    const filter2 = context.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(600, context.currentTime);
    filter2.Q.setValueAtTime(0.2, context.currentTime);

    source.connect(filter);
    filter.connect(filter2);
    filter2.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter, filter2);
  }

  private createBirdSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create very gentle bird ambience
    const noiseBuffer = this.createNoiseBuffer(context, 'pink');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Gentle band-pass filter for soft bird sounds
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, context.currentTime); // Lower frequency
    filter.Q.setValueAtTime(0.2, context.currentTime); // Very gentle

    // Add a low-pass to remove harsh frequencies
    const filter2 = context.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(4000, context.currentTime);
    filter2.Q.setValueAtTime(0.1, context.currentTime);

    source.connect(filter);
    filter.connect(filter2);
    filter2.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter, filter2);
  }

  stopAll() {
    this.activeNodes.forEach((_, soundId) => {
      this.stopSound(soundId);
    });
  }
}

// Singleton instance
let audioGenerator: AudioGenerator | null = null;

export const getAudioGenerator = () => {
  if (!audioGenerator) {
    audioGenerator = new AudioGenerator();
  }
  return audioGenerator;
};
