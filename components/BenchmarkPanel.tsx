
import React from 'react';
import { BenchmarkResult } from '../types';

interface BenchmarkPanelProps {
  title: string;
  subtitle: string;
  results: BenchmarkResult[];
  onRun: () => void;
  isBusy: boolean;
  color: 'slate' | 'blue';
  isCRE?: boolean;
}

const BenchmarkPanel: React.FC<BenchmarkPanelProps> = ({ 
  title, subtitle, results, onRun, isBusy, color, isCRE 
}) => {
  const latest = results[0];
  const colorClass = color === 'slate' ? 'text-slate-400' : 'text-blue-500';
  const borderClass = color === 'slate' ? 'border-slate-800' : 'border-blue-900/30';
  const bgClass = color === 'slate' ? 'bg-slate-900/40' : 'bg-blue-900/5';

  return (
    <div className={`flex flex-col rounded-xl border ${borderClass} ${bgClass} overflow-hidden shadow-2xl`}>
      <div className="p-6 border-b border-slate-800 bg-slate-900/60">
        <div className="flex justify-between items-start">
          <div>
            <h2 className={`orbitron text-xl font-bold ${colorClass}`}>{title}</h2>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{subtitle}</p>
          </div>
          <button 
            onClick={onRun}
            disabled={isBusy}
            className={`px-4 py-2 rounded-md font-bold text-xs orbitron transition-all ${
              color === 'slate' 
                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            RUN TEST
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6">
        {/* Latest Result Card */}
        <div className="bg-black/60 rounded-lg p-5 border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Latest Run Payload</span>
            {latest && (
              <span className={`px-3 py-1 rounded text-[10px] font-black orbitron ${latest.isCorrect ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-red-950 text-red-400 border border-red-900'}`}>
                {latest.isCorrect ? 'PASS' : 'FAIL'}
              </span>
            )}
          </div>
          
          <div className="font-mono text-xs break-all text-slate-400 bg-slate-950 p-4 rounded border border-slate-900 h-32 overflow-y-auto mb-4 custom-scrollbar">
            {latest ? latest.output : 'Awaiting trial initialization...'}
          </div>

          <div className="grid grid-cols-2 gap-4 text-[10px] font-mono">
            <div className="bg-slate-900/50 p-2 rounded">
              <span className="text-slate-600 block">LATENCY</span>
              <span className="text-white">{latest ? `${latest.latency.toFixed(0)}ms` : '---'}</span>
            </div>
            <div className="bg-slate-900/50 p-2 rounded">
              <span className="text-slate-600 block">PRECISION</span>
              <span className="text-white">100 DECIMALS</span>
            </div>
          </div>
          
          {isCRE && latest?.explanation && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <span className="text-[10px] text-blue-500 font-bold uppercase block mb-1">C.R.E. Explanation Module</span>
              <p className="text-xs italic text-slate-400 leading-relaxed">"{latest.explanation}"</p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded text-[9px] border border-blue-800/50">ROUTED_MATH</span>
                <span className="px-2 py-0.5 bg-purple-900/30 text-purple-400 rounded text-[9px] border border-purple-800/50">DETERMINISTIC_BYPASS</span>
              </div>
            </div>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 flex flex-col gap-2">
          <span className="text-[10px] text-slate-600 font-bold uppercase mb-1">Trial History (Last 5)</span>
          <div className="space-y-1">
            {results.slice(0, 5).map((res, i) => (
              <div key={i} className="flex items-center justify-between text-[10px] font-mono bg-slate-900/30 px-3 py-2 rounded border border-slate-800/50">
                <span className="text-slate-500">{new Date(res.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                <span className="text-slate-400">{res.latency.toFixed(0)}ms</span>
                <span className={res.isCorrect ? 'text-emerald-500' : 'text-red-500'}>{res.isCorrect ? 'VALIDATED' : 'CORRUPT'}</span>
              </div>
            ))}
            {results.length === 0 && <p className="text-center text-slate-700 py-4 text-[10px] uppercase font-bold tracking-widest italic">No history available</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkPanel;
