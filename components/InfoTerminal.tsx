
import React from 'react';
import { TuringState } from '../types';

interface InfoTerminalProps {
  state: TuringState | null;
}

const InfoTerminal: React.FC<InfoTerminalProps> = ({ state }) => {
  return (
    <div className="bg-black/80 border border-slate-800 p-2 md:p-4 rounded-lg font-mono text-[9px] md:text-xs overflow-hidden">
      <div className="flex items-center justify-between mb-1 md:mb-2 text-blue-400 orbitron border-b border-slate-800 pb-1">
        <span>TELEMETRY_LOG</span>
        <span className="animate-pulse flex items-center gap-1">● <span className="hidden xs:inline">{state?.turing_sphere.status || 'INIT'}</span></span>
      </div>
      <div className="space-y-1">
        <p className="flex justify-between"><span className="text-slate-500">>> FLUX:</span> <span className={
          state?.telemetry_log.chroton_flux === 'High' ? 'text-blue-400' : 'text-purple-400'
        }>{state?.telemetry_log.chroton_flux || 'N/A'}</span></p>
        <p className="flex justify-between"><span className="text-slate-500">>> DEPTH:</span> <span className="text-emerald-400 font-bold">{state?.telemetry_log.recursive_depth || 'R=0'}</span></p>
        <p className="flex justify-between"><span className="text-slate-500">>> ENTROPY:</span> <span className="text-amber-400">{state?.telemetry_log.entropy_delta || 'ΔS=0'}</span></p>
        
        <div className="mt-2 pt-2 border-t border-slate-800/50">
          <p className="text-slate-400 italic leading-tight text-[8px] md:text-[10px]">
            "{state?.telemetry_log.bounding_physics_quote || 'Resolving...'}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoTerminal;
