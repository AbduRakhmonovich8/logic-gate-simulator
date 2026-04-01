import React, { useEffect, useRef, useState } from 'react';
import { NodeData, WireData } from '../utils/types';
import { DEFS } from '../utils/defs';

export function useSimulation(nodes: NodeData[], wires: WireData[]) {
  const [signals, setSignals] = useState<Record<string, number>>({});
  const signalsRef = useRef<Record<string, number>>({});
  const audioCtx = useRef<AudioContext | null>(null);
  const osc = useRef<OscillatorNode | null>(null);
  const gain = useRef<GainNode | null>(null);
  const beepOn = useRef(false);

  const micStream = useRef<MediaStream | null>(null);
  const micAnalyser = useRef<AnalyserNode | null>(null);
  const micDataArray = useRef<Uint8Array | null>(null);

  useEffect(() => {
    const hasMic = nodes.some(n => n.type === 'MIC');
    if (hasMic && !micStream.current) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        micStream.current = stream;
        if (!audioCtx.current) {
          audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtx.current;
        if (ctx.state === 'suspended') ctx.resume();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        micAnalyser.current = analyser;
        micDataArray.current = new Uint8Array(analyser.frequencyBinCount);
      }).catch(e => console.error("Mic error:", e));
    }
  }, [nodes]);

  useEffect(() => {
    let req: number;
    
    const triggerBeep = (on: boolean) => {
      if (on) {
        if (beepOn.current) return;
        beepOn.current = true;
        try {
          if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
          if (osc.current) { try { osc.current.stop(); } catch (e) {} }
          osc.current = audioCtx.current.createOscillator();
          gain.current = audioCtx.current.createGain();
          osc.current.connect(gain.current);
          gain.current.connect(audioCtx.current.destination);
          osc.current.frequency.value = 880;
          osc.current.type = 'sine';
          gain.current.gain.setValueAtTime(0.08, audioCtx.current.currentTime);
          osc.current.start();
        } catch (e) {}
      } else {
        if (!beepOn.current) return;
        beepOn.current = false;
        try {
          if (osc.current && audioCtx.current && gain.current) {
            gain.current.gain.setValueAtTime(0.08, audioCtx.current.currentTime);
            gain.current.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + 0.06);
            osc.current.stop(audioCtx.current.currentTime + 0.07);
            osc.current = null;
          }
        } catch (e) {}
      }
    };

    const tick = (time: number) => {
      let changed = false;
      const newSignals = { ...signalsRef.current };
      
      // Fan-in OR for inputs
      const fi = new Map<string, number>();
      wires.forEach(w => {
        const srcVal = newSignals[`${w.fn}-o-${w.fp}`] || 0;
        const k = `${w.tn}-i-${w.tp}`;
        fi.set(k, Math.max(fi.get(k) || 0, srcVal));
      });

      let anyAudioOn = false;

      let currentVol = 0;
      if (micAnalyser.current && micDataArray.current) {
        micAnalyser.current.getByteFrequencyData(micDataArray.current);
        let sum = 0;
        for(let i=0; i<micDataArray.current.length; i++) sum += micDataArray.current[i];
        currentVol = sum / micDataArray.current.length;
      }
      const ext = { micVolume: currentVol };

      nodes.forEach(n => {
        const d = DEFS[n.type];
        const inputs = Array(d.ni).fill(0);
        for (let i = 0; i < d.ni; i++) {
          inputs[i] = fi.get(`${n.id}-i-${i}`) || 0;
          const key = `${n.id}-i-${i}`;
          if (newSignals[key] !== inputs[i]) {
            newSignals[key] = inputs[i];
            changed = true;
          }
        }

        if (n.type === 'AUDIO' && inputs[0] === 1) {
          anyAudioOn = true;
        }

        if (d.no > 0) {
          const outVal = d.fn(inputs, n.data, time, ext);
          if (Array.isArray(outVal)) {
            for (let o = 0; o < d.no; o++) {
              const key = `${n.id}-o-${o}`;
              if (newSignals[key] !== outVal[o]) {
                newSignals[key] = outVal[o];
                changed = true;
              }
            }
          } else {
            const key = `${n.id}-o-0`;
            if (newSignals[key] !== outVal) {
              newSignals[key] = outVal;
              changed = true;
            }
          }
        }
      });

      triggerBeep(anyAudioOn);

      if (changed) {
        signalsRef.current = newSignals;
        setSignals(newSignals);
      }
      
      req = requestAnimationFrame(tick);
    };
    
    req = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(req);
  }, [nodes, wires]);

  return signals;
}
