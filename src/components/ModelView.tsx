import React, { useState } from 'react';
import { 
  TRAINED_METRICS, 
  generateThresholdMetrics 
} from '../data/modelMetrics';
import { RotateCcw } from 'lucide-react';

export const ModelView: React.FC = () => {
  const [threshold, setThreshold] = useState<number>(TRAINED_METRICS.threshold);

  const metrics = generateThresholdMetrics(threshold);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#1b1f27] pb-6">
        <div>
          <h2 className="text-[11px] font-mono tracking-widest text-[#8b92a0] uppercase">
            Model Performance
          </h2>
          <p className="text-sm text-[#9ca3af] font-sans mt-0.5">
            Offline evaluation on {TRAINED_METRICS.n_test.toLocaleString()} chronologically held-out test events (2.73% fraud)
          </p>
        </div>

        <button
          onClick={() => setThreshold(TRAINED_METRICS.threshold)}
          className="inline-flex items-center gap-1.5 text-xs text-[#8b92a0] hover:text-[#d1d5db] transition-colors cursor-pointer self-start sm:self-auto font-mono"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ({TRAINED_METRICS.threshold})</span>
        </button>
      </div>

      {/* Essential Model Information Quietly (Simple numbers and clean spacing) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-8 py-2 font-mono text-left">
        <div>
          <div className="text-2xl sm:text-3xl font-mono font-normal tracking-tight text-[#f3f4f6]">
            {threshold.toFixed(3)}
          </div>
          <div className="text-xs text-[#8b92a0] mt-1 font-mono uppercase tracking-wider">
            Threshold
          </div>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-mono font-normal tracking-tight text-[#f3f4f6]">
            {(metrics.precision * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-[#8b92a0] mt-1 font-mono uppercase tracking-wider">
            Precision
          </div>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-mono font-normal tracking-tight text-[#f3f4f6]">
            {(metrics.tpr * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-[#8b92a0] mt-1 font-mono uppercase tracking-wider">
            Recall
          </div>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-mono font-normal tracking-tight text-[#f3f4f6]">
            {TRAINED_METRICS.roc_auc.toFixed(3)}
          </div>
          <div className="text-xs text-[#8b92a0] mt-1 font-mono uppercase tracking-wider">
            ROC-AUC
          </div>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-mono font-normal tracking-tight text-[#f3f4f6]">
            {TRAINED_METRICS.pr_auc.toFixed(3)}
          </div>
          <div className="text-xs text-[#8b92a0] mt-1 font-mono uppercase tracking-wider">
            PR-AUC
          </div>
        </div>
      </div>

      {/* Threshold Calibration Slider */}
      <div className="pt-4 border-t border-[#1b1f27] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#8b92a0]">
            Threshold Calibration: <span className="text-[#f3f4f6] font-medium">{threshold.toFixed(4)}</span>
          </span>
          <span className="text-[11px] text-[#6b7280]">
            Optimal F1 point: {TRAINED_METRICS.threshold}
          </span>
        </div>

        <input
          type="range"
          min="0.05"
          max="0.98"
          step="0.005"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full accent-zinc-400 h-1 bg-[#1a1f27] rounded appearance-none cursor-pointer"
        />

        <div className="flex justify-between text-[10px] font-mono text-[#6b7280]">
          <span>0.05 (High Recall)</span>
          <span>0.906 (Optimal F1)</span>
          <span>0.98 (High Precision)</span>
        </div>
      </div>

      {/* Minimal Diagnostic Views: Confusion Matrix & PR Curve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#1b1f27]">
        {/* Confusion Matrix (Clean table with thin lines) */}
        <div className="space-y-3 font-mono text-xs">
          <span className="text-[11px] uppercase tracking-wider text-[#8b92a0] block">
            Confusion Matrix (N = {TRAINED_METRICS.n_test.toLocaleString()})
          </span>

          <div className="border border-[#1b1f27] rounded overflow-hidden text-xs">
            <div className="grid grid-cols-3 p-2.5 bg-[#12151b] border-b border-[#1b1f27] text-[#6b7280] text-[11px]">
              <div></div>
              <div className="text-right">Pred Legit</div>
              <div className="text-right">Pred Fraud</div>
            </div>
            <div className="grid grid-cols-3 p-3 border-b border-[#171b22] items-center">
              <div className="text-[#8b92a0]">Actual Legit</div>
              <div className="text-right text-[#ededf0]">{metrics.tn.toLocaleString()} (TN)</div>
              <div className="text-right text-[#6b7280]">{metrics.fp.toLocaleString()} (FP)</div>
            </div>
            <div className="grid grid-cols-3 p-3 items-center">
              <div className="text-[#8b92a0]">Actual Fraud</div>
              <div className="text-right text-[#6b7280]">{metrics.fn.toLocaleString()} (FN)</div>
              <div className="text-right text-[#ededf0]">{metrics.tp.toLocaleString()} (TP)</div>
            </div>
          </div>
        </div>

        {/* Precision-Recall Curve Minimal */}
        <div className="space-y-3 font-mono text-xs">
          <span className="text-[11px] uppercase tracking-wider text-[#8b92a0] block">
            Precision-Recall Curve (PR-AUC 0.475)
          </span>

          <div className="border border-[#1b1f27] rounded p-4 bg-[#101318]">
            <div className="h-32 w-full">
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                <line x1="0" y1="25" x2="100" y2="25" stroke="#1f242d" strokeWidth="0.5" strokeDasharray="2" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#1f242d" strokeWidth="0.5" strokeDasharray="2" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#1f242d" strokeWidth="0.5" strokeDasharray="2" />
                {/* Random baseline 2.7% */}
                <line x1="0" y1="97.3" x2="100" y2="97.3" stroke="#2c3340" strokeWidth="0.8" strokeDasharray="3" />
                {/* PR Curve line */}
                <path
                  d="M 5,2 Q 20,25 35,38 T 43.16,43.58 T 60,75 T 80,88 T 99,97"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                />
                {/* Current operating point marker */}
                <circle
                  cx={Math.min(95, Math.max(5, metrics.tpr * 100))}
                  cy={Math.min(95, Math.max(5, 100 - metrics.precision * 100))}
                  r="3.5"
                  fill="#f43f5e"
                />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-[#6b7280] mt-2">
              <span>Recall: 0%</span>
              <span className="text-[#8b92a0]">Current: {(metrics.tpr * 100).toFixed(1)}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
