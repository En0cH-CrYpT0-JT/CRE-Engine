
import React from 'react';
import { BenchmarkResult } from '../types';

interface SummarySectionProps {
  baseline: BenchmarkResult[];
  cre: BenchmarkResult[];
}

const SummarySection: React.FC<SummarySectionProps> = ({ baseline, cre }) => {
  const calcStats = (data: BenchmarkResult[]) => {
    if (data.length === 0) return { passRate: 0, avgLatency: 0 };
    const passed = data.filter(d => d.isCorrect).length;
    const avgLat = data.reduce((acc, curr) => acc + curr.latency, 0) / data.length;
    return {
      passRate: (passed / data.length) * 100,
      avgLatency: avgLat
    };
  };

  const bStats = calcStats(baseline);
  const cStats = calcStats(cre);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 flex flex-col items-center">
        <h3 className="orbitron text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest text-center">Correctness Pass Rate</h3>
        <div className="flex gap-10">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 flex items-center justify-center">
               <svg className="w-full h-full -rotate-90">
                 <circle cx="40" cy="40" r="36" fill="none" stroke="#1e293b" strokeWidth="4" />
                 <circle cx="40" cy="40" r="36" fill="none" stroke="#64748b" strokeWidth="4" strokeDasharray={226} strokeDashoffset={226 - (226 * bStats.passRate / 100)} />
               </svg>
               <span className="absolute text-xs font-bold text-white">{bStats.passRate.toFixed(0)}%</span>
            </div>
            <span className="text-[8px] text-slate-500 mt-2 uppercase font-bold">Baseline</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 flex items-center justify-center">
               <svg className="w-full h-full -rotate-90">
                 <circle cx="40" cy="40" r="36" fill="none" stroke="#1e293b" strokeWidth="4" />
                 <circle cx="40" cy="40" r="36" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray={226} strokeDashoffset={226 - (226 * cStats.passRate / 100)} />
               </svg>
               <span className="absolute text-xs font-bold text-blue-400">{cStats.passRate.toFixed(0)}%</span>
            </div>
            <span className="text-[8px] text-blue-500 mt-2 uppercase font-bold">C.R.E. Engine</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 flex flex-col justify-center">
        <h3 className="orbitron text-xs font-bold text-slate-500 mb-6 uppercase tracking-widest text-center">Average Latency Delta</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-500">BASELINE</span>
              <span className="text-slate-400">{bStats.avgLatency.toFixed(0)}ms</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-slate-600" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-blue-500">C.R.E.</span>
              <span className="text-blue-400">{cStats.avgLatency.toFixed(0)}ms</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500" style={{ width: `${(cStats.avgLatency / Math.max(bStats.avgLatency, 1)) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
        <h3 className="orbitron text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest text-center">Efficiency Summary</h3>
        <div className="text-center">
          <p className="text-[8px] text-slate-600 uppercase font-bold mb-1">Reliability Improvement</p>
          <p className="text-3xl font-black text-emerald-500">+{Math.max(0, cStats.passRate - bStats.passRate).toFixed(0)}%</p>
          <div className="mt-4 p-3 bg-black/40 rounded border border-slate-800">
             <p className="text-[9px] leading-relaxed text-slate-400 italic">
               "Routing deterministic tasks through specialized code layers eliminates hallucination entropy found in probabilistic model turns."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
