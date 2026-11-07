/**
 * Web Audio API synthesizer for reminder chime notifications
 */
export function playNotificationChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Pleasant double-chime (C5 -> G5)
    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    playTone(523.25, now, 0.4);       // C5
    playTone(659.25, now + 0.15, 0.4); // E5
    playTone(783.99, now + 0.3, 0.6);  // G5
  } catch (e) {
    console.warn('Audio playback error:', e);
  }
}
