type BedKind = 'crt' | 'projection';

class SoundEngine {
	ctx: AudioContext | null = null;
	master: GainNode | null = null;
	enabled = false;
	ready = false;
	private bedKind: BedKind | null = null;
	private bedNodes: ReturnType<typeof this.makeCrtBed> | ReturnType<typeof this.makeProjectionBed> | null = null;
	private noiseBuffer: AudioBuffer | null = null;
	private brownNoiseBuffer: AudioBuffer | null = null;
	private lastPlayed: Record<string, number> = {};

	init() {
		if (this.ready) return;
		const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
		if (!Ctx) return;
		this.ctx = new Ctx();
		this.master = this.ctx.createGain();
		this.master.gain.value = 1;
		this.master.connect(this.ctx.destination);
		this.ready = true;
	}

	async resume() {
		if (this.ctx && this.ctx.state === 'suspended') {
			try {
				await this.ctx.resume();
			} catch {
				/* ignore */
			}
		}
	}

	private getNoise() {
		if (!this.noiseBuffer && this.ctx) {
			const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
			const data = buf.getChannelData(0);
			for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
			this.noiseBuffer = buf;
		}
		return this.noiseBuffer!;
	}

	private getBrownNoise() {
		if (!this.brownNoiseBuffer && this.ctx) {
			const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
			const data = buf.getChannelData(0);
			let last = 0;
			for (let i = 0; i < data.length; i++) {
				const w = Math.random() * 2 - 1;
				last = (last + 0.02 * w) / 1.02;
				data[i] = last * 3.5;
			}
			this.brownNoiseBuffer = buf;
		}
		return this.brownNoiseBuffer!;
	}

	private throttle(key: string, ms: number): boolean {
		const now = performance.now();
		if (now - (this.lastPlayed[key] ?? 0) < ms) return false;
		this.lastPlayed[key] = now;
		return true;
	}

	private makeCrtBed() {
		if (!this.ctx || !this.master) throw new Error('not initialized');
		const ctx = this.ctx;
		const hum = ctx.createOscillator();
		hum.type = 'sawtooth';
		hum.frequency.value = 60;
		const humLpf = ctx.createBiquadFilter();
		humLpf.type = 'lowpass';
		humLpf.frequency.value = 400;
		const humGain = ctx.createGain();
		humGain.gain.value = 0;
		hum.connect(humLpf).connect(humGain).connect(this.master);
		hum.start();
		humGain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 1.2);

		const noise = ctx.createBufferSource();
		noise.buffer = this.getNoise();
		noise.loop = true;
		const hpf = ctx.createBiquadFilter();
		hpf.type = 'highpass';
		hpf.frequency.value = 7000;
		const noiseGain = ctx.createGain();
		noiseGain.gain.value = 0;
		noise.connect(hpf).connect(noiseGain).connect(this.master);
		noise.start();
		noiseGain.gain.linearRampToValueAtTime(0.012, ctx.currentTime + 1.2);
		return { kind: 'crt' as const, hum, humGain, noise, noiseGain };
	}

	private makeProjectionBed() {
		if (!this.ctx || !this.master) throw new Error('not initialized');
		const ctx = this.ctx;
		const fan = ctx.createBufferSource();
		fan.buffer = this.getBrownNoise();
		fan.loop = true;
		const fanLpf = ctx.createBiquadFilter();
		fanLpf.type = 'lowpass';
		fanLpf.frequency.value = 600;
		const fanGain = ctx.createGain();
		fanGain.gain.value = 0;
		fan.connect(fanLpf).connect(fanGain).connect(this.master);
		fan.start();
		fanGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.5);

		const motor = ctx.createOscillator();
		motor.type = 'sine';
		motor.frequency.value = 120;
		const motorGain = ctx.createGain();
		motorGain.gain.value = 0;
		motor.connect(motorGain).connect(this.master);
		motor.start();
		motorGain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1.5);
		return { kind: 'projection' as const, fan, fanGain, motor, motorGain };
	}

	private stopBed() {
		if (!this.bedNodes || !this.ctx) return;
		const ctx = this.ctx;
		const t = ctx.currentTime;
		if (this.bedNodes.kind === 'crt') {
			const { hum, humGain, noise, noiseGain } = this.bedNodes;
			[humGain, noiseGain].forEach((g) => {
				g.gain.cancelScheduledValues(t);
				g.gain.setValueAtTime(g.gain.value, t);
				g.gain.linearRampToValueAtTime(0, t + 0.4);
			});
			setTimeout(() => {
				try {
					hum.stop();
					noise.stop();
				} catch {
					/* ignore */
				}
			}, 500);
		} else {
			const { fan, fanGain, motor, motorGain } = this.bedNodes;
			[fanGain, motorGain].forEach((g) => {
				g.gain.cancelScheduledValues(t);
				g.gain.setValueAtTime(g.gain.value, t);
				g.gain.linearRampToValueAtTime(0, t + 0.4);
			});
			setTimeout(() => {
				try {
					fan.stop();
					motor.stop();
				} catch {
					/* ignore */
				}
			}, 500);
		}
		this.bedNodes = null;
		this.bedKind = null;
	}

	whine() {
		if (!this.enabled || !this.ready || !this.ctx || !this.master) return;
		const ctx = this.ctx;
		const osc = ctx.createOscillator();
		osc.type = 'sine';
		osc.frequency.setValueAtTime(0, ctx.currentTime);
		osc.frequency.linearRampToValueAtTime(15734, ctx.currentTime + 0.4);
		const gain = ctx.createGain();
		gain.gain.setValueAtTime(0, ctx.currentTime);
		gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.2);
		gain.gain.linearRampToValueAtTime(0.008, ctx.currentTime + 0.9);
		gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.6);
		osc.connect(gain).connect(this.master);
		osc.start();
		osc.stop(ctx.currentTime + 1.7);
	}

	click() {
		if (!this.enabled || !this.ready || !this.ctx || !this.master) return;
		if (!this.throttle('click', 50)) return;
		const ctx = this.ctx;
		const len = Math.floor(ctx.sampleRate * 0.04);
		const buf = ctx.createBuffer(1, len, ctx.sampleRate);
		const data = buf.getChannelData(0);
		for (let i = 0; i < len; i++) {
			data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.004));
		}
		const src = ctx.createBufferSource();
		src.buffer = buf;
		const filt = ctx.createBiquadFilter();
		filt.type = 'bandpass';
		filt.frequency.value = 2800;
		filt.Q.value = 2.4;
		const gain = ctx.createGain();
		gain.gain.value = 0.18;
		src.connect(filt).connect(gain).connect(this.master);
		src.start();
	}

	tk() {
		if (!this.enabled || !this.ready || !this.ctx || !this.master) return;
		if (!this.throttle('tk', 50)) return;
		const ctx = this.ctx;
		const len = Math.floor(ctx.sampleRate * 0.018);
		const buf = ctx.createBuffer(1, len, ctx.sampleRate);
		const data = buf.getChannelData(0);
		for (let i = 0; i < len; i++) {
			data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.0018));
		}
		const src = ctx.createBufferSource();
		src.buffer = buf;
		const filt = ctx.createBiquadFilter();
		filt.type = 'bandpass';
		filt.frequency.value = 4500;
		filt.Q.value = 1.8;
		const gain = ctx.createGain();
		gain.gain.value = 0.04;
		src.connect(filt).connect(gain).connect(this.master);
		src.start();
	}

	kachunk() {
		if (!this.enabled || !this.ready || !this.ctx || !this.master) return;
		if (!this.throttle('kachunk', 200)) return;
		const ctx = this.ctx;
		const burst = (delay: number, freq: number, gainV: number, dur: number) => {
			const len = Math.floor(ctx.sampleRate * dur);
			const buf = ctx.createBuffer(1, len, ctx.sampleRate);
			const data = buf.getChannelData(0);
			for (let i = 0; i < len; i++) {
				data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * dur * 0.4));
			}
			const src = ctx.createBufferSource();
			src.buffer = buf;
			const filt = ctx.createBiquadFilter();
			filt.type = 'bandpass';
			filt.frequency.value = freq;
			filt.Q.value = 2;
			const gain = ctx.createGain();
			gain.gain.value = gainV;
			src.connect(filt).connect(gain).connect(this.master!);
			src.start(ctx.currentTime + delay);
		};
		burst(0, 1200, 0.22, 0.06);
		burst(0.25, 800, 0.18, 0.09);
	}

	focusZip() {
		if (!this.enabled || !this.ready || !this.ctx || !this.master) return;
		if (!this.throttle('focus', 100)) return;
		const ctx = this.ctx;
		const len = Math.floor(ctx.sampleRate * 0.3);
		const buf = ctx.createBuffer(1, len, ctx.sampleRate);
		const data = buf.getChannelData(0);
		for (let i = 0; i < len; i++) {
			data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
		}
		const src = ctx.createBufferSource();
		src.buffer = buf;
		const filt = ctx.createBiquadFilter();
		filt.type = 'bandpass';
		filt.frequency.setValueAtTime(800, ctx.currentTime);
		filt.frequency.linearRampToValueAtTime(2400, ctx.currentTime + 0.25);
		filt.Q.value = 4;
		const gain = ctx.createGain();
		gain.gain.value = 0.06;
		src.connect(filt).connect(gain).connect(this.master);
		src.start();
	}

	bootBeep() {
		if (!this.enabled || !this.ready || !this.ctx || !this.master) return;
		const ctx = this.ctx;
		const t0 = ctx.currentTime;
		const osc = ctx.createOscillator();
		osc.type = 'square';
		osc.frequency.setValueAtTime(180, t0);
		osc.frequency.exponentialRampToValueAtTime(820, t0 + 0.18);
		const lpf = ctx.createBiquadFilter();
		lpf.type = 'lowpass';
		lpf.frequency.value = 2400;
		const gain = ctx.createGain();
		gain.gain.setValueAtTime(0, t0);
		gain.gain.linearRampToValueAtTime(0.06, t0 + 0.02);
		gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);
		osc.connect(lpf).connect(gain).connect(this.master);
		osc.start(t0);
		osc.stop(t0 + 0.34);
	}

	bootTick() {
		if (!this.enabled || !this.ready || !this.ctx || !this.master) return;
		if (!this.throttle('bootTick', 24)) return;
		const ctx = this.ctx;
		const t0 = ctx.currentTime;
		const osc = ctx.createOscillator();
		osc.type = 'square';
		osc.frequency.value = 1900;
		const gain = ctx.createGain();
		gain.gain.setValueAtTime(0.03, t0);
		gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.045);
		osc.connect(gain).connect(this.master);
		osc.start(t0);
		osc.stop(t0 + 0.05);
	}

	bootReady() {
		if (!this.enabled || !this.ready || !this.ctx || !this.master) return;
		const ctx = this.ctx;
		const t0 = ctx.currentTime;
		const tone = (freq: number, start: number, dur: number, vol: number) => {
			const osc = ctx.createOscillator();
			osc.type = 'triangle';
			osc.frequency.value = freq;
			const g = ctx.createGain();
			g.gain.setValueAtTime(0, t0 + start);
			g.gain.linearRampToValueAtTime(vol, t0 + start + 0.015);
			g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + dur);
			osc.connect(g).connect(this.master!);
			osc.start(t0 + start);
			osc.stop(t0 + start + dur + 0.02);
		};
		tone(523, 0, 0.18, 0.05);
		tone(784, 0.12, 0.26, 0.05);
	}

	setBed(kind: BedKind) {
		if (!this.enabled || !this.ready) return;
		if (this.bedKind === kind) return;
		this.stopBed();
		this.bedNodes = kind === 'crt' ? this.makeCrtBed() : this.makeProjectionBed();
		this.bedKind = kind;
	}

	async enable() {
		this.init();
		await this.resume();
		this.enabled = true;
		this.whine();
		this.setBed('crt');
	}

	disable() {
		this.enabled = false;
		this.stopBed();
	}
}

export const sound = new SoundEngine();
