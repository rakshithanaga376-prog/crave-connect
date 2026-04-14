// Web Audio API sound effects — no external files needed
const audioCtx = () => new (window.AudioContext || (window as any).webkitAudioContext)();

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  try {
    const ctx = audioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export const sounds = {
  // 🔔 New order notification — ascending chime
  orderNotification: () => {
    playTone(523, 0.15, 'sine', 0.2);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.2), 150);
    setTimeout(() => playTone(784, 0.3, 'sine', 0.25), 300);
  },

  // ✅ Order placed success — happy ascending
  orderPlaced: () => {
    playTone(440, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(554, 0.1, 'sine', 0.15), 100);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.15), 200);
    setTimeout(() => playTone(880, 0.3, 'sine', 0.2), 300);
  },

  // 🛒 Add to cart — quick pop
  addToCart: () => {
    playTone(800, 0.08, 'sine', 0.12);
    setTimeout(() => playTone(1200, 0.1, 'sine', 0.1), 80);
  },

  // 🗑️ Remove from cart
  removeFromCart: () => {
    playTone(600, 0.1, 'triangle', 0.1);
    setTimeout(() => playTone(400, 0.15, 'triangle', 0.08), 100);
  },

  // 🚴 Delivery status update
  statusUpdate: () => {
    playTone(660, 0.12, 'square', 0.08);
    setTimeout(() => playTone(880, 0.15, 'square', 0.1), 120);
  },

  // 🎉 Delivery completed
  deliveryComplete: () => {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.2, 'sine', 0.15), i * 150);
    });
  },

  // 🔘 Button click — subtle
  click: () => {
    playTone(1000, 0.05, 'sine', 0.06);
  },

  // ⚠️ Error sound
  error: () => {
    playTone(300, 0.15, 'sawtooth', 0.08);
    setTimeout(() => playTone(250, 0.2, 'sawtooth', 0.06), 150);
  },
};
