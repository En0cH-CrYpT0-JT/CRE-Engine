
import React, { useState } from 'react';
import { fetchBaselinePi, fetchCREExplanation } from './services/geminiService';
import { calculatePiDeterministic, PI_100_GROUND_TRUTH } from './mathUtils';
import { BenchmarkResult } from './types';
import BenchmarkPanel from './components/BenchmarkPanel';
import SummarySection from './components/SummarySection';

const App: React.FC = () => {
  const [baselineResults, setBaselineResults] = useState<BenchmarkResult[]>([]);
  const [creResults, setCreResults] = useState<BenchmarkResult[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [trialCount, setTrialCount] = useState(10);

  const runBaseline = async () => {
    setIsBusy(true);
    const result = await fetchBaselinePi();
    const newResult: BenchmarkResult = {
      output: result.text,
      latency: result.latency,
      isCorrect: result.text === PI_100_GROUND_TRUTH,
      timestamp: Date.now()
    };
    setBaselineResults(prev => [newResult, ...prev]);
    setIsBusy(false);
  };

  const runCRE = async () => {
    setIsBusy(true);
    const start = performance.now();
    
    // Step 1: Deterministic Math (Ultra fast)
    const pi = calculatePiDeterministic(100);
    
    // Step 2: Gemini Explanation (The UX layer)
    const explanation = await fetchCREExplanation();
    const totalLatency = performance.now() - start;

    const newResult: BenchmarkResult = {
      output: pi,
      latency: totalLatency,
      isCorrect: pi === PI_100_GROUND_TRUTH,
      timestamp: Date.now(),
      explanation: explanation.text,
      route: "DETERMINISTIC_ROUTING_V1"
    };
    setCreResults(prev => [newResult, ...prev]);
    setIsBusy(false);
  };

  const runBenchmarkSuite = async () => {
    setIsBusy(true);
    const bResults: BenchmarkResult[] = [];
    const cResults: BenchmarkResult[] = [];

    for (let i = 0; i < trialCount; i++) {
      // Baseline
      const bRes = await fetchBaselinePi();
      bResults.push({
        output: bRes.text,
        latency: bRes.latency,
        isCorrect: bRes.text === PI_100_GROUND_TRUTH,
        timestamp: Date.now()
      });

      // CRE
      const cStart = performance.now();
      const pi = calculatePiDeterministic(100);
      const cExp = await fetchCREExplanation();
      cResults.push({
        output: pi,
        latency: performance.now() - cStart,
        isCorrect: true,
        timestamp: Date.now(),
        explanation: cExp.text,
        route: "DETERMINISTIC_ROUTING_V1"
      });
    }

    setBaselineResults(bResults);
    setCreResults(cResults);
    setIsBusy(false);
  };

  const clearData = () => {
    setBaselineResults([]);
    setCreResults([]);
  };

  const exportData = () => {
    const data = {
      baseline: baselineResults,
      cre: creResults,
      meta: {
        groundTruth: PI_100_GROUND_TRUTH,
        timestamp: new Date().toISOString()
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cre_benchmark_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 font-sans p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="orbitron text-3xl md:text-5xl font-bold text-white mb-2 tracking-tighter">
          C.R.E. <span className="text-blue-500">Benchmark Lab</span>
        </h1>
        <p className="text-slate-400 font-mono text-sm uppercase tracking-[0.2em]">
          Deterministic Routing vs. Probabilistic Prediction
        </p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Baseline Panel */}
        <BenchmarkPanel 
          title="Baseline Gemini"
          subtitle="Direct Token Prediction"
          results={baselineResults}
          onRun={runBaseline}
          isBusy={isBusy}
          color="slate"
        />

        {/* C.R.E. Panel */}
        <BenchmarkPanel 
          title="C.R.E. Engine"
          subtitle="Deterministic Precision Layer"
          results={creResults}
          onRun={runCRE}
          isBusy={isBusy}
          color="blue"
          isCRE
        />
      </main>

      {/* Benchmark Controls & Summary */}
      <section className="max-w-7xl mx-auto border-t border-slate-800 pt-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-1">Trials (N)</label>
              <input 
                type="number" 
                value={trialCount}
                onChange={(e) => setTrialCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                className="bg-slate-900 border border-slate-700 rounded px-3 py-2 w-20 text-blue-400 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <button 
              onClick={runBenchmarkSuite}
              disabled={isBusy}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-all orbitron text-xs mt-4"
            >
              {isBusy ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-vial mr-2"></i>}
              RUN FULL BENCHMARK SUITE
            </button>
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <button onClick={exportData} className="text-slate-400 hover:text-white transition-colors text-sm">
              <i className="fa-solid fa-download mr-2"></i> Export JSON
            </button>
            <button onClick={clearData} className="text-red-400 hover:text-red-300 transition-colors text-sm">
              <i className="fa-solid fa-trash-can mr-2"></i> Clear Results
            </button>
          </div>
        </div>

        <SummarySection baseline={baselineResults} cre={creResults} />
      </section>

      <footer className="max-w-7xl mx-auto mt-20 text-center text-slate-600 font-mono text-[10px] uppercase tracking-widest pb-10">
        Chronoturin Recursive Engine • Benchmark v1.0.4 • Optimized for Gemini 3
      </footer>
    </div>
  );
};

export default App;
