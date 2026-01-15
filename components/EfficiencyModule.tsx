
import React from 'react';
import { TuringState } from '../types';

interface EfficiencyModuleProps {
  state: TuringState | null;
}

const EfficiencyModule: React.FC<EfficiencyModuleProps> = ({ state }) => {
  if (!state) return (
    <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-lg flex items-center justify-center font-mono text-[10px] text-slate-600 italic">
      Awaiting causal resolution...
    </div>
  );

  const { computational_efficiency } = state;
  const { standard_llm_tokens, chronoturin_engine_tokens, latency_reduction_ms, information_gain_pct } = computational_efficiency;

  const ratio = standard_llm_tokens > 0 ? (chronoturin_engine_tokens / standard_llm_tokens) * 100 : 0;

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg font-mono">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[10px] uppercase tracking-widest text-blue-400 orbitron font-bold">Computational Efficiency</h3>
        <span className="text-[9px] text-emerald-500 font-bold bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/50">GAIN: {information_gain_pct}</span>
      </div>
      
      <div className="space-y-3">
        {/* Standard LLM Comparison */}
        <div className="space-y-1">
          <div className="flex justify-between text-[8px]">
            <span className="text-slate-500 font-bold">STANDARD LINEAR AI</span>
            <span className="text-slate-400">{standard_llm_tokens} TOKENS / LOW DENSITY</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-slate-600 w-full opacity-30"></div>
          </div>
        </div>

        {/* Chronoturin Comparison */}
        <div className="space-y-1">
          <div className="flex justify-between text-[8px]">
            <span className="text-blue-400 font-bold">C.R.E. ENGINE</span>
            <span className="text-blue-300 font-bold">{chronoturin_engine_tokens} CHROTONS / HIGH DENSITY</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.8)]" 
              style={{ width: `${ratio}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-black/40 p-2 rounded border border-slate-800/50 flex flex-col items-center">
            <p className="text-[7px] text-slate-500 uppercase tracking-tighter">Latency Delta</p>
            <p className="text-base font-bold text-emerald-400">{latency_reduction_ms}</p>
          </div>
          <div className="bg-black/40 p-2 rounded border border-slate-800/50 flex flex-col items-center">
            <p className="text-[7px] text-slate-500 uppercase tracking-tighter">Information Gain</p>
            <p className="text-base font-bold text-blue-400">{information_gain_pct}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyModule;
