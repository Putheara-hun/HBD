/* ==========================================================================
   AMBIENT AUDIO & SOUND EFFECT ENGINE (ZERO-GESTURE WEB AUDIO + DUAL FALLBACK)
   ========================================================================== */

class AmbientAudioController {
  constructor() {
    this.audioElement = new Audio('assets/audio/background.mp3');
    this.audioElement.loop = true;
    this.audioElement.volume = 0.85;

    this.isPlaying = false;
    this.shouldBePlaying = false;
    this.audioCtx = null;
    this.fireworkBuffer = null;
    this.backgroundBuffer = null;
    this.bgSourceNode = null;
    this.bgGainNode = null;
    this.masterGainNode = null;

    this.btn = document.getElementById('music-toggle');

    this.initAudioContext();
    this.decodePreloadedAudio();
    this.bindEvents();
    this.setupGlobalUnlock();
  }

  initAudioContext() {
    if (this.audioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.masterGainNode = this.audioCtx.createGain();
        this.masterGainNode.gain.setValueAtTime(0.9, this.audioCtx.currentTime);
        this.masterGainNode.connect(this.audioCtx.destination);

        this.bgGainNode = this.audioCtx.createGain();
        this.bgGainNode.gain.setValueAtTime(0.85, this.audioCtx.currentTime);
        this.bgGainNode.connect(this.masterGainNode);
      }
    } catch (e) {
      console.warn('Web Audio API not supported or restricted:', e);
    }
  }

  base64ToArrayBuffer(base64) {
    try {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (e) {
      console.error('Base64 decode error:', e);
      return null;
    }
  }

  async decodePreloadedAudio() {
    this.initAudioContext();
    if (!this.audioCtx) return;

    // 1. Decode firework sound buffer
    if (window.AUDIO_FIREWORK_B64) {
      try {
        const buffer = this.base64ToArrayBuffer(window.AUDIO_FIREWORK_B64);
        if (buffer) {
          this.fireworkBuffer = await this.audioCtx.decodeAudioData(buffer);
        }
      } catch (e) {
        console.warn('Could not decode firework buffer:', e);
      }
    }

    // 2. Decode background soundtrack buffer
    if (window.AUDIO_BACKGROUND_B64) {
      try {
        const buffer = this.base64ToArrayBuffer(window.AUDIO_BACKGROUND_B64);
        if (buffer) {
          this.backgroundBuffer = await this.audioCtx.decodeAudioData(buffer);
          if (this.shouldBePlaying && !this.bgSourceNode) {
            this.startBackgroundBuffer();
          }
        }
      } catch (e) {
        console.warn('Could not decode background buffer:', e);
      }
    }
  }

  setupGlobalUnlock() {
    // When the user enters or clicks anywhere on the page, guarantee audio is fully active
    const unlocker = () => {
      this.initAudioContext();
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      if (this.shouldBePlaying) {
        if (!this.bgSourceNode && this.backgroundBuffer) {
          this.startBackgroundBuffer();
        } else if (this.audioElement && this.audioElement.paused && !this.bgSourceNode) {
          this.audioElement.play().catch(() => {});
        }
      }
    };

    const passiveEvents = [
      'pointerdown', 'mousedown', 'touchstart', 'touchend', 
      'click', 'keydown', 'wheel', 'scroll'
    ];

    passiveEvents.forEach(evt => {
      window.addEventListener(evt, unlocker, { passive: true });
    });
  }

  bindEvents() {
    if (this.btn) {
      this.btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }
  }

  startBackgroundBuffer() {
    if (!this.audioCtx || !this.backgroundBuffer) return;
    try {
      if (this.bgSourceNode) {
        try { this.bgSourceNode.stop(); } catch(e) {}
        this.bgSourceNode.disconnect();
      }
      this.bgSourceNode = this.audioCtx.createBufferSource();
      this.bgSourceNode.buffer = this.backgroundBuffer;
      this.bgSourceNode.loop = true;
      this.bgSourceNode.connect(this.bgGainNode);
      this.bgSourceNode.start(0);
      this.isPlaying = true;
      if (this.btn) this.btn.classList.add('music-playing');
    } catch (e) {
      console.warn('startBackgroundBuffer failed:', e);
    }
  }

  play() {
    this.shouldBePlaying = true;
    this.initAudioContext();

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    let playedViaWebAudio = false;

    // Method A: Play decoded high-quality Web Audio buffer (No CORS, no gesture barrier)
    if (this.audioCtx && this.backgroundBuffer) {
      this.startBackgroundBuffer();
      playedViaWebAudio = true;
    }

    // Method B: Dual HTML5 Audio element fallback / companion
    try {
      this.audioElement.currentTime = 0;
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (!playedViaWebAudio && !this.backgroundBuffer) {
            this.playSynthChords();
          }
        });
      }
    } catch (e) {
      if (!playedViaWebAudio && !this.backgroundBuffer) {
        this.playSynthChords();
      }
    }

    this.isPlaying = true;
    if (this.btn) {
      this.btn.classList.add('music-playing');
    }
  }

  pause() {
    this.shouldBePlaying = false;
    this.isPlaying = false;

    // Stop Web Audio buffer
    if (this.bgSourceNode) {
      try {
        this.bgSourceNode.stop();
        this.bgSourceNode.disconnect();
      } catch (e) {}
      this.bgSourceNode = null;
    }

    // Pause HTML5 audio
    try {
      this.audioElement.pause();
    } catch (e) {}

    // Stop procedural synth
    this.stopSynth();

    if (this.btn) {
      this.btn.classList.remove('music-playing');
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /* Sound Effects for Interactive Joy & Power */
  playFirework() {
    this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    let playedViaBuffer = false;

    // Method 1: Play decoded firework buffer (instant, zero hand gesture needed)
    if (this.audioCtx && this.fireworkBuffer) {
      try {
        const fireworkSource = this.audioCtx.createBufferSource();
        fireworkSource.buffer = this.fireworkBuffer;
        
        const gainNode = this.audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.95, this.audioCtx.currentTime);

        fireworkSource.connect(gainNode);
        gainNode.connect(this.masterGainNode || this.audioCtx.destination);
        fireworkSource.start(0);
        playedViaBuffer = true;
      } catch (e) {
        console.warn('Firework buffer playback failed:', e);
      }
    }

    // Method 2: HTML5 Audio fallback
    try {
      const audioEl = new Audio('assets/audio/firework.mp3');
      audioEl.volume = 0.95;
      const p = audioEl.play();
      if (p !== undefined) {
        p.catch(() => {
          if (!playedViaBuffer) {
            this.synthesizeFirework();
          }
        });
      }
    } catch (e) {
      if (!playedViaBuffer) {
        this.synthesizeFirework();
      }
    }

    // If buffer wasn't ready yet, run procedural synth as immediate safety net
    if (!playedViaBuffer && !this.fireworkBuffer) {
      this.synthesizeFirework();
    }
  }

  synthesizeFirework() {
    this.initAudioContext();
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => {});

    const now = this.audioCtx.currentTime;

    // Launch Whistle
    const oscWhoosh = this.audioCtx.createOscillator();
    const gainWhoosh = this.audioCtx.createGain();
    oscWhoosh.type = 'sine';
    oscWhoosh.frequency.setValueAtTime(450, now);
    oscWhoosh.frequency.exponentialRampToValueAtTime(1650, now + 0.38);
    gainWhoosh.gain.setValueAtTime(0.001, now);
    gainWhoosh.gain.linearRampToValueAtTime(0.25, now + 0.32);
    gainWhoosh.gain.linearRampToValueAtTime(0.001, now + 0.4);
    oscWhoosh.connect(gainWhoosh);
    gainWhoosh.connect(this.masterGainNode || this.audioCtx.destination);
    oscWhoosh.start(now);
    oscWhoosh.stop(now + 0.41);

    // Explosion Boom (Deep Bass Punch)
    const oscBoom = this.audioCtx.createOscillator();
    const gainBoom = this.audioCtx.createGain();
    oscBoom.type = 'triangle';
    oscBoom.frequency.setValueAtTime(150, now + 0.38);
    oscBoom.frequency.exponentialRampToValueAtTime(36, now + 1.8);
    gainBoom.gain.setValueAtTime(0.001, now);
    gainBoom.gain.setValueAtTime(0.5, now + 0.39);
    gainBoom.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
    oscBoom.connect(gainBoom);
    gainBoom.connect(this.masterGainNode || this.audioCtx.destination);
    oscBoom.start(now + 0.38);
    oscBoom.stop(now + 2.5);
  }

  playCountdownTick(count) {
    this.initAudioContext();
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => {});

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    const freq = count === 1 ? 880 : (count === 2 ? 660 : 520);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGainNode || this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  playTriumphantEntry() {
    this.initAudioContext();
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => {});

    const notes = [
      { f: 261.63, t: 0.00, d: 0.35 }, // C4
      { f: 329.63, t: 0.12, d: 0.35 }, // E4
      { f: 392.00, t: 0.24, d: 0.40 }, // G4
      { f: 523.25, t: 0.36, d: 0.80 }, // C5
      { f: 659.25, t: 0.48, d: 0.90 }, // E5
      { f: 783.99, t: 0.60, d: 1.20 }  // G5
    ];

    const now = this.audioCtx.currentTime;
    notes.forEach(note => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.001, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.09, now + note.t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(this.masterGainNode || this.audioCtx.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + note.d + 0.1);
    });
  }

  playConfettiPop() {
    this.initAudioContext();
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => {});

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.22);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGainNode || this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  playFunnyBoing() {
    this.initAudioContext();
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => {});

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.32);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(this.masterGainNode || this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.33);
  }

  playDiceRoll() {
    this.initAudioContext();
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => {});

    const now = this.audioCtx.currentTime;
    [0, 0.07, 0.15].forEach((t, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + i * 180, now + t);

      gain.gain.setValueAtTime(0.08, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGainNode || this.audioCtx.destination);

      osc.start(now + t);
      osc.stop(now + t + 0.07);
    });
  }

  playSynthChords() {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    const progressions = [
      [155.56, 196.00, 233.08, 293.66, 349.23], // Ebmaj9
      [130.81, 155.56, 196.00, 233.08, 293.66], // Cm9
      [103.83, 155.56, 207.65, 261.63, 311.13], // Abmaj7
      [116.54, 174.61, 233.08, 293.66, 349.23]  // Bbadd9
    ];

    let chordIdx = 0;

    const playNextChord = () => {
      if (!this.isPlaying) return;
      const freqs = progressions[chordIdx];
      chordIdx = (chordIdx + 1) % progressions.length;

      const now = this.audioCtx.currentTime;
      const chordDuration = 5.5;

      freqs.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.035, now + idx * 0.15 + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGainNode || this.audioCtx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + chordDuration + 0.5);
      });
    };

    playNextChord();
    this.synthInterval = setInterval(playNextChord, 5200);
  }

  stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }
}

// Global Ambient Audio Instance
window.ambientAudio = null;
window.addEventListener('DOMContentLoaded', () => {
  window.ambientAudio = new AmbientAudioController();
});
