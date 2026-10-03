import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Sliders, 
  RotateCcw, 
  Target, 
  AlertCircle, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { 
  TRAINED_METRICS, 
  generateThresholdMetrics, 
  PR_CURVE_DATA 
} from '../data/modelMetrics';

export const ModelDiagnostics: React.FC = () => {
  const [threshold, setThreshold] = useState<number>(TRAINED_METRICS.threshold);
  const currentMetrics = generateThresholdMetrics(threshold);

  // Financial model parameters for business impact analysis
  const avgFraudLoss = 28000; // INR
  const manualReviewCost = 180; // INR per false positive review

  const preventedFraudAmount = currentMetrics.tp * avgFraudLoss;
  const missedFraudLoss = currentMetrics.fn * avgFraudLoss;
  const reviewOperationalCost = currentMetrics.fp * manualReviewCost;
  const netSavings = preventedFraudAmount - reviewOperationalCost;

  return (
    <div className="space-y-6">
      {/* Top Benchmark Strip */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Model Evaluation & Operating Threshold Calibration</h2>
            <span className="text-xs text-rose-400 font-mono font-bold">PR-AUC: {TRAINED_METRICS.pr_auc} · ROC-AUC: {TRAINED_METRICS.roc_auc}</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluated on chronologically split test set of {TRAINED_METRICS.n_test.toLocaleString()} transactions (Fraud incidence: {(TRAINED_METRICS.fraud_rate_test * 100).toFixed(2)}%).
          </p>
        </div>

        <button
          onClick={() => setThreshold(TRAINED_METRICS.threshold)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Optimal ({TRAINED_METRICS.threshold})</span>
        </button>
      </div>

      {/* Threshold Slider and Dynamic Metrics Grid */}
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-400" />
              <span>Decision Threshold Tuner</span>
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Adjusting the threshold balances fraud catch rate (Recall) against investigation team workload (Precision).
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400">Current Threshold:</span>
            <span className="font-mono text-base font-bold text-rose-400 px-2.5 py-0.5 rounded bg-slate-950 border border-rose-500/30">
              {threshold.toFixed(4)}
            </span>
          </div>
        </div>

        <input
          type="range"
          min="0.05"
          max="0.98"
          step="0.005"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex justify-between text-[11px] font-mono text-slate-500">
          <span>0.05 (High Recall / Aggressive)</span>
          <span className="text-rose-400 font-semibold">0.906 (Optimal F1 Operating Point)</span>
          <span>0.98 (High Precision / Conservative)</span>
        </div>

        {/* Live Metrics Tiles at current threshold */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Precision</span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              {(currentMetrics.precision * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
              {currentMetrics.tp} / {currentMetrics.tp + currentMetrics.fp} flagged
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Recall (Detection Rate)</span>
            <span className="text-xl font-bold font-mono text-indigo-400">
              {(currentMetrics.tpr * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
              {currentMetrics.tp} / 285 fraud cases
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">F1-Score</span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {currentMetrics.f1.toFixed(3)}
            </span>
            <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
              Harmonic mean
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">False Positive Rate</span>
            <span className="text-xl font-bold font-mono text-slate-200">
              {(currentMetrics.fpr * 100).toFixed(2)}%
            </span>
            <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
              {currentMetrics.fp} legit txns flagged
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Net Fraud Loss Prevented</span>
            <span className="text-xl font-bold font-mono text-cyan-400">
              ₹{(preventedFraudAmount / 100000).toFixed(1)}L
            </span>
            <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
              Net savings: ₹{Math.round(netSavings / 1000)}k
            </span>
          </div>
        </div>
      </div>

      {/* Curves and Confusion Matrix Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Precision-Recall Curve (4 Cols) */}
        <div className="lg:col-span-4 p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Precision-Recall Curve (PR-AUC: {TRAINED_METRICS.pr_auc})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">AP = 0.475</span>
          </div>
          
          <div className="relative aspect-square w-full bg-slate-950 rounded-lg p-4 border border-slate-800">
            {/* SVG PR Curve */}
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              {/* Grid lines */}
              <line x1="0" y1="20" x2="100" y2="20" stroke="#334155" strokeDasharray="2" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeDasharray="2" strokeWidth="0.5" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="#334155" strokeDasharray="2" strokeWidth="0.5" />
              <line x1="20" y1="0" x2="20" y2="100" stroke="#334155" strokeDasharray="2" strokeWidth="0.5" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="#334155" strokeDasharray="2" strokeWidth="0.5" />
              <line x1="80" y1="0" x2="80" y2="100" stroke="#334155" strokeDasharray="2" strokeWidth="0.5" />

              {/* Baseline Fraud Rate Line (~2.7%) */}
              <line x1="0" y1="97.3" x2="100" y2="97.3" stroke="#64748b" strokeDasharray="3" strokeWidth="0.8" />

              {/* PR Curve Path */}
              <path
                d="M 5,2 M 8,12 Q 20,25 35,38 T 43.16,43.58 T 60,75 T 80,88 T 99,97"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Shaded Area under PR */}
              <path
                d="M 8,12 Q 20,25 35,38 T 43.16,43.58 T 60,75 T 80,88 T 99,97 L 100,100 L 0,100 Z"
                fill="rgba(244, 63, 94, 0.1)"
              />

              {/* Current operating point marker */}
              <circle
                cx={Math.min(95, Math.max(5, currentMetrics.tpr * 100))}
                cy={Math.min(95, Math.max(5, 100 - currentMetrics.precision * 100))}
                r="4.5"
                fill="#38bdf8"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2">
              <span>Recall: 0%</span>
              <span className="text-cyan-400">Marker: {(currentMetrics.tpr * 100).toFixed(1)}%</span>
              <span>100%</span>
            </div>
            <div className="text-[10px] text-slate-500 text-center mt-1">
              Dashed line represents random baseline (2.7% prevalence)
            </div>
          </div>
        </div>

        {/* ROC Curve (4 Cols) */}
        <div className="lg:col-span-4 p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              ROC Curve (ROC-AUC: {TRAINED_METRICS.roc_auc})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">AUC = 0.940</span>
          </div>

          <div className="relative aspect-square w-full bg-slate-950 rounded-lg p-4 border border-slate-800">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              {/* Grid lines */}
              <line x1="0" y1="20" x2="100" y2="20" stroke="#334155" strokeDasharray="2" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeDasharray="2" strokeWidth="0.5" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="#334155" strokeDasharray="2" strokeWidth="0.5" />

              {/* Diagonal No-Skill Reference */}
              <line x1="0" y1="100" x2="100" y2="0" stroke="#64748b" strokeDasharray="3" strokeWidth="0.8" />

              {/* ROC Curve (High discriminatory power AUC=0.94) */}
              <path
                d="M 0,100 Q 1,45 8,25 T 25,12 T 50,6 T 100,0"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Shaded Area under ROC */}
              <path
                d="M 0,100 Q 1,45 8,25 T 25,12 T 50,6 T 100,0 L 100,100 Z"
                fill="rgba(99, 102, 241, 0.12)"
              />

              {/* Current operating point marker */}
              <circle
                cx={Math.min(95, Math.max(1, currentMetrics.fpr * 100))}
                cy={Math.min(95, Math.max(1, 100 - currentMetrics.tpr * 100))}
                r="4.5"
                fill="#38bdf8"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2">
              <span>FPR: 0%</span>
              <span className="text-cyan-400">Marker: {(currentMetrics.fpr * 100).toFixed(2)}%</span>
              <span>100%</span>
            </div>
            <div className="text-[10px] text-slate-500 text-center mt-1">
              Dashed diagonal represents random chance (AUC = 0.50)
            </div>
          </div>
        </div>

        {/* 2x2 Confusion Matrix (4 Cols) */}
        <div className="lg:col-span-4 p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Confusion Matrix (N = {TRAINED_METRICS.n_test})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              @ Threshold {threshold.toFixed(3)}
            </span>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <div className="grid grid-cols-2 gap-2">
              {/* True Negatives */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg">
                <span className="text-[10px] text-emerald-400 block font-semibold uppercase">True Negatives</span>
                <span className="text-xl font-bold font-mono text-white block mt-1">
                  {currentMetrics.tn.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">Legitimate approved</span>
              </div>

              {/* False Positives */}
              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg">
                <span className="text-[10px] text-amber-400 block font-semibold uppercase">False Positives</span>
                <span className="text-xl font-bold font-mono text-amber-200 block mt-1">
                  {currentMetrics.fp.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">Legitimate flagged (Cost)</span>
              </div>

              {/* False Negatives */}
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg">
                <span className="text-[10px] text-rose-400 block font-semibold uppercase">False Negatives</span>
                <span className="text-xl font-bold font-mono text-rose-200 block mt-1">
                  {currentMetrics.fn.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">Missed fraud (Loss)</span>
              </div>

              {/* True Positives */}
              <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-lg">
                <span className="text-[10px] text-cyan-400 block font-semibold uppercase">True Positives</span>
                <span className="text-xl font-bold font-mono text-cyan-200 block mt-1">
                  {currentMetrics.tp.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">Fraud intercepted</span>
              </div>
            </div>

            {/* Financial trade-off summary */}
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Fraud Intercepted:</span>
                <span className="font-mono text-emerald-400 font-semibold">+₹{preventedFraudAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Missed Fraud Losses:</span>
                <span className="font-mono text-rose-400 font-semibold">-₹{missedFraudLoss.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Review Operational Cost:</span>
                <span className="font-mono text-amber-400 font-semibold">-₹{reviewOperationalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Feature Importance Section */}
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-rose-400" />
              <span>Model Permutation Feature Importance</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Ranked drop in PR-AUC when each feature column is randomly shuffled. Features with larger drops are more critical.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">11 Features</span>
        </div>

        <div className="space-y-2.5 pt-1">
          {Object.entries(TRAINED_METRICS.feature_importance)
            .sort(([, a], [, b]) => b - a)
            .map(([feature, score]) => {
              const maxScore = 0.2821;
              const widthPct = Math.max(2, Math.min(100, (Math.abs(score) / maxScore) * 100));
              const isNegative = score < 0;

              return (
                <div key={feature} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-semibold text-slate-300">{feature}</span>
                    <span className={isNegative ? 'text-slate-500' : 'text-rose-400 font-bold'}>
                      {score > 0 ? `+${score.toFixed(5)}` : score.toFixed(5)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isNegative
                          ? 'bg-slate-700'
                          : widthPct > 50
                          ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
