
export interface BenchmarkResult {
  output: string;
  latency: number;
  isCorrect: boolean;
  timestamp: number;
  explanation?: string;
  route?: string;
}

export interface SummaryStats {
  passRate: number;
  avgLatency: number;
  totalTrials: number;
}

// TuringState interface defines the telemetry data structure for C.R.E. visualization components
export interface TuringState {
  timestamp: number;
  turing_sphere: {
    status: string;
    visual_color: string;
  };
  telemetry_log: {
    chroton_flux: string;
    recursive_depth: string;
    entropy_delta: string;
    bounding_physics_quote: string;
  };
  computational_efficiency: {
    standard_llm_tokens: number;
    chronoturin_engine_tokens: number;
    latency_reduction_ms: string;
    information_gain_pct: string;
  };
}
