// Procedural Web Audio API Synthesizer & BGM Audio Manager for Traditional Cake Cooking Game

class SoundManager {
  private ctx: AudioContext | null = null;
  private _muted: boolean = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmPlaying: boolean = false;
  private bgmVolume: number = 0.35;
  private gestureListenersAttached: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('tccg_audio_muted');
      if (savedMute === 'true') {
        this._muted = true;
      }
      this.initBGM();
      this.setupAutoPlayListeners();
    }
  }

  public get muted(): boolean {
    return this._muted;
  }

  public set muted(value: boolean) {
    this._muted = value;
    if (typeof window !== 'undefined') {
      localStorage.setItem('tccg_audio_muted', String(value));
    }
    if (value) {
      this.pauseBGM();
    } else {
      this.playBGM();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }
  }

  private initBGM() {
    if (typeof window === 'undefined') return;
    try {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const audioUrl = `${cleanBase}audio/serenomusic.mp3`;

      this.bgmAudio = new Audio(audioUrl);
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.bgmVolume;
      this.bgmAudio.preload = 'auto';

      this.bgmAudio.addEventListener('play', () => {
        this.bgmPlaying = true;
      });
      this.bgmAudio.addEventListener('pause', () => {
        this.bgmPlaying = false;
      });
      this.bgmAudio.addEventListener('ended', () => {
        this.bgmPlaying = false;
      });
    } catch (e) {
      console.warn('Gagal memuat BGM audio:', e);
    }
  }

  private setupAutoPlayListeners() {
    if (this.gestureListenersAttached || typeof window === 'undefined') return;
    this.gestureListenersAttached = true;

    const handleFirstGesture = () => {
      if (!this._muted) {
        this.playBGM();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      this.gestureListenersAttached = false;
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
  }

  public playBGM() {
    if (this._muted) return;
    if (!this.bgmAudio) {
      this.initBGM();
    }
    if (!this.bgmAudio) return;

    this.bgmAudio.volume = this.bgmVolume;
    const playPromise = this.bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.bgmPlaying = true;
        })
        .catch(() => {
          // Autoplay blocked by browser policy until user gesture
          this.bgmPlaying = false;
        });
    }
  }

  public pauseBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmPlaying = false;
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public toggleMute(): boolean {
    const next = !this._muted;
    this.muted = next;
    return next;
  }

  public setVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmVolume;
    }
  }

  public getVolume(): number {
    return this.bgmVolume;
  }

  public isBGMPlaying(): boolean {
    return this.bgmPlaying && !this._muted;
  }

  private getContext(): AudioContext | null {
    if (this._muted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playPop(pitch = 520) {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.45, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  public playStirTick() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280 + Math.random() * 110, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  public playSizzle() {
    const ctx = this.getContext();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * 0.14;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  public playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const startTime = ctx.currentTime + idx * 0.065;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.23);
    });
  }

  public playError() {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [311.13, 277.18]; // D#4 -> C#4
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const startTime = ctx.currentTime + idx * 0.12;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.14, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.19);
    });
  }

  public playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    const chord = [523.25, 659.25, 783.99, 987.77, 1046.5];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const startTime = ctx.currentTime + idx * 0.09;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.46);
    });
  }
}

export const soundFX = new SoundManager();
