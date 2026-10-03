import React, { useState } from 'react';
import { 
  Database, 
  Clock, 
  DollarSign, 
  Layers, 
  HelpCircle,
  TrendingDown,
  Info,
  AlertCircle
} from 'lucide-react';

export const EdaLab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'imbalance' | 'amount' | 'diurnal' | 'features'>('imbalance');

  // Hour-of-day data from Notebook 01
  const HOURLY_DATA = [
    { hour: 0, legitPct: 2.1, fraudPct: 8.5 },
    { hour: 1, legitPct: 1.2, fraudPct: 14.8 },
    { hour: 2, legitPct: 0.9, fraudPct: 18.2 },
    { hour: 3, legitPct: 0.8, fraudPct: 16.5 },
    { hour: 4, legitPct: 1.1, fraudPct: 11.2 },
    { hour: 5, legitPct: 1.8, fraudPct: 6.4 },
    { hour: 6, legitPct: 2.9, fraudPct: 2.8 },
    { hour: 7, legitPct: 4.1, fraudPct: 2.1 },
    { hour: 8, legitPct: 5.8, fraudPct: 1.9 },
    { hour: 9, legitPct: 6.4, fraudPct: 1.6 },
    { hour: 10, legitPct: 7.2, fraudPct: 1.8 },
    { hour: 11, legitPct: 7.6, fraudPct: 1.5 },
    { hour: 12, legitPct: 7.1, fraudPct: 1.7 },
    { hour: 13, legitPct: 6.8, fraudPct: 1.4 },
    { hour: 14, legitPct: 7.5, fraudPct: 1.6 },
    { hour: 15, legitPct: 7.3, fraudPct: 1.5 },
    { hour: 16, legitPct: 6.9, fraudPct: 1.8 },
    { hour: 17, legitPct: 6.4, fraudPct: 1.3 },
    { hour: 18, legitPct: 5.7, fraudPct: 1.2 },
    { hour: 19, legitPct: 5.1, fraudPct: 1.0 },
    { hour: 20, legitPct: 4.3, fraudPct: 1.1 },
    { hour: 21, legitPct: 3.5, fraudPct: 1.4 },
    { hour: 22, legitPct: 2.8, fraudPct: 2.0 },
    { hour: 23, legitPct: 2.4, fraudPct: 4.1 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Exploratory Data Analysis (EDA) & Behavioral Signals</h2>
            <span className="text-xs text-rose-400 font-mono font-bold">52,274 Canonical Events</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Key takeaways from Notebook 01: class imbalance dynamics, relative ratio separation, and night-hour concentration.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('imbalance')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'imbalance'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Class Imbalance
          </button>
          <button
            onClick={() => setActiveSubTab('amount')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'amount'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Amount Dynamics
          </button>
          <button
            onClick={() => setActiveSubTab('diurnal')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'diurnal'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Diurnal Hour Shift
          </button>
          <button
            onClick={() => setActiveSubTab('features')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'features'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Feature Separation
          </button>
        </div>
      </div>

      {/* 1. Class Imbalance Tab */}
      {activeSubTab === 'imbalance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Class Distribution (Severe Imbalance: 2.73% Fraud Prevalence)
            </h3>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-emerald-400 font-semibold">Legitimate Activity (Class 0)</span>
                  <span className="text-white font-bold">50,714 txns (97.01%)</span>
                </div>
                <div className="h-6 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-500 rounded-lg" style={{ width: '97.01%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-rose-400 font-semibold">Fraudulent Activity (Class 1)</span>
                  <span className="text-rose-300 font-bold">1,560 txns (2.99%)</span>
                </div>
                <div className="h-6 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                  <div className="h-full bg-rose-500 rounded-lg" style={{ width: '2.99%' }} />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Why Accuracy Is Useless in Fraud Detection</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                A naive "dummy classifier" that predicts 100% of all transactions as legitimate will achieve an astounding 
                <strong className="text-white"> 97.01% accuracy</strong> while catching exactly <strong className="text-rose-400">zero fraud</strong> and losing millions.
              </p>
              <p className="text-slate-400 leading-relaxed text-xs">
                Hence, we optimize strictly for <strong className="text-white">Precision-Recall AUC (PR-AUC = 0.4747)</strong>, F1-Score (0.4891), and Recall at high threshold rather than raw accuracy.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Chronological Split Protocol (Data Leakage Prevention)
            </h3>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-3">
              <div className="flex justify-between font-mono pb-2 border-b border-slate-800">
                <span className="text-slate-400">Train Set (First 80% chronologically):</span>
                <span className="text-white font-bold">41,819 rows (3.054% fraud)</span>
              </div>
              <div className="flex justify-between font-mono pb-2 border-b border-slate-800">
                <span className="text-slate-400">Test Set (Next 20% in future time):</span>
                <span className="text-cyan-400 font-bold">10,455 rows (2.726% fraud)</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Class Imbalance Weight (pos_weight):</span>
                <span className="text-amber-400 font-bold">31.7x positive weighting</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Random K-fold splitting would leak future customer behavioral profiles into past predictions. 
              The chronological split ensures our model is tested solely on subsequent unseen transactions, mirroring live production deployment.
            </p>
          </div>
        </div>
      )}

      {/* 2. Amount Dynamics Tab */}
      {activeSubTab === 'amount' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Raw Amount vs. Relative Ratio (The Power of Profiling)
            </h3>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Fraud Mean Relative Ratio:</span>
                  <span className="font-mono text-rose-400 font-bold">4.25x customer usual spend</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Legitimate Mean Relative Ratio:</span>
                  <span className="font-mono text-emerald-400 font-bold">1.00x customer usual spend</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              A flat threshold like "flag transactions over ₹20,000" causes massive false alarms for high-net-worth accounts while missing ₹5,000 account takeovers on student accounts. 
              The relative feature <code className="text-rose-300 font-mono">amount_ratio = amount / user_mean</code> is over 4x more predictive than raw amount.
            </p>
          </div>

          <div className="lg:col-span-6 p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Log Transformation: log1p(amount)
            </h3>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
              <span className="font-mono text-slate-300 block">
                f(x) = ln(1 + amount)
              </span>
              <p className="text-slate-400 leading-relaxed">
                Transaction values span multiple orders of magnitude (from ₹10 to ₹10,00,000). The natural log transformation dampens extreme positive skewness, preventing high-ticket transactions from destabilizing gradient descent.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Diurnal Hour Shift Tab */}
      {activeSubTab === 'diurnal' && (
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Transaction Volume by Hour: Legitimate vs Fraud Proportion (%)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Notice the dramatic fraud spike between 01:00 AM and 04:00 AM while legitimate volume drops to near zero.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                <span className="text-slate-300">Fraudulent %</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span className="text-slate-300">Legitimate %</span>
              </div>
            </div>
          </div>

          {/* Hourly Bar Chart Visualization */}
          <div className="h-64 w-full bg-slate-950 rounded-lg p-4 border border-slate-800 flex items-end gap-1.5 sm:gap-2">
            {HOURLY_DATA.map((d) => (
              <div key={d.hour} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-12 bg-slate-900 border border-slate-700 text-white text-[10px] p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-lg">
                  <div className="font-bold">{String(d.hour).padStart(2, '0')}:00</div>
                  <div className="text-rose-400">Fraud: {d.fraudPct}%</div>
                  <div className="text-emerald-400">Legit: {d.legitPct}%</div>
                </div>

                <div className="w-full flex items-end justify-center gap-0.5 h-full">
                  {/* Legit bar */}
                  <div
                    className="w-1/2 bg-emerald-500/70 hover:bg-emerald-400 rounded-t transition-all"
                    style={{ height: `${(d.legitPct / 20) * 100}%` }}
                  />
                  {/* Fraud bar */}
                  <div
                    className="w-1/2 bg-rose-500 hover:bg-rose-400 rounded-t transition-all"
                    style={{ height: `${(d.fraudPct / 20) * 100}%` }}
                  />
                </div>

                <span className="text-[9px] font-mono text-slate-500">
                  {d.hour % 3 === 0 ? `${d.hour}h` : ''}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
            <strong>Key Behavioral Insight:</strong> Fraudsters execute account takeover transactions late at night to exploit delayed victim awareness (SMS/push alerts missed while sleeping), giving them time to liquidate funds before card freezing.
          </div>
        </div>
      )}

      {/* 4. Feature Separation Tab */}
      {activeSubTab === 'features' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase">amount_ratio</h4>
            <div className="flex items-center justify-between text-xs font-mono pt-2">
              <span className="text-slate-400">Legitimate:</span>
              <span className="text-emerald-400 font-bold">1.00x</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Fraud:</span>
              <span className="text-rose-400 font-bold">4.25x</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-2">
              Relative to customer past history, fraudulent transactions average 425% larger than usual.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase">txn_count_10min</h4>
            <div className="flex items-center justify-between text-xs font-mono pt-2">
              <span className="text-slate-400">Legitimate:</span>
              <span className="text-emerald-400 font-bold">1.02 txns</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Fraud:</span>
              <span className="text-rose-400 font-bold">3.85 txns</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-2">
              Card testing bots and rapid drained wallets generate concentrated bursts of attempts in under 10 minutes.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase">is_new_device</h4>
            <div className="flex items-center justify-between text-xs font-mono pt-2">
              <span className="text-slate-400">Legitimate:</span>
              <span className="text-emerald-400 font-bold">12.4%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Fraud:</span>
              <span className="text-rose-400 font-bold">78.6%</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-2">
              Nearly 80% of confirmed fraudulent charges originate from an unverified or newly spoofed device.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
