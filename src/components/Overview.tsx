import React from 'react';
import { AlertQueueItem } from '../data/mockLiveTransactions';

interface OverviewProps {
  alerts: AlertQueueItem[];
  unresolvedHighRiskCount: number;
  onOpenMonitor: () => void;
  onSelectAlert: (alert: AlertQueueItem) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  alerts,
  unresolvedHighRiskCount,
  onOpenMonitor,
  onSelectAlert
}) => {
  // Canonical dataset activity stats: 1,248 Transactions, 37 Flagged, 12 Confirmed
  const totalCount = 1248;
  const flaggedCount = 37 + alerts.filter(a => a.scoreResult.riskLevel === 'HIGH' || a.scoreResult.riskLevel === 'MEDIUM').length - 5;
  const confirmedCount = 12 + alerts.filter(a => a.status === 'CONFIRMED_FRAUD').length - 1;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-8 space-y-12">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#1b1f27] pb-6">
        <div className="space-y-1">
          <div className="text-[11px] font-mono tracking-widest text-[#8b92a0] uppercase">
            Fraud Monitoring
          </div>
          <p className="text-sm text-[#9ca3af] font-sans">
            Real-time transaction risk analysis
          </p>

          {/* Account Protection Status Indicator */}
          <div className="pt-2 flex items-center gap-2 text-xs font-mono">
            {unresolvedHighRiskCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-amber-400/90">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Action required · {unresolvedHighRiskCount} suspicious transaction{unresolvedHighRiskCount > 1 ? 's' : ''}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[#6b7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                <span>Account protected</span>
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onOpenMonitor}
          className="px-4 py-2 bg-[#14171d] hover:bg-[#1a1f26] text-[#e5e7eb] border border-[#222731] rounded text-xs font-mono transition-colors cursor-pointer self-start sm:self-auto"
        >
          Open Live Monitor →
        </button>
      </div>

      {/* Simple Horizontal Summary (Typography & Spacing, No Colorful Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 py-2 text-left">
        <div>
          <div className="text-3xl font-mono font-normal tracking-tight text-[#f3f4f6]">
            {totalCount.toLocaleString()}
          </div>
          <div className="text-xs text-[#8b92a0] mt-1 uppercase tracking-wider font-mono">
            Transactions
          </div>
        </div>

        <div>
          <div className="text-3xl font-mono font-normal tracking-tight text-[#f3f4f6]">
            {flaggedCount.toLocaleString()}
          </div>
          <div className="text-xs text-[#8b92a0] mt-1 uppercase tracking-wider font-mono">
            Flagged
          </div>
        </div>

        <div>
          <div className="text-3xl font-mono font-normal tracking-tight text-[#f3f4f6]">
            {confirmedCount.toLocaleString()}
          </div>
          <div className="text-xs text-[#8b92a0] mt-1 uppercase tracking-wider font-mono">
            Confirmed
          </div>
        </div>
      </div>

      {/* Recent Activity List (Clean List with Thin Separators) */}
      <div className="space-y-4 pt-4 border-t border-[#1b1f27]">
        <div className="flex items-center justify-between text-xs text-[#8b92a0]">
          <span className="font-mono text-[11px] tracking-wider uppercase text-[#8b92a0]">
            Recent Activity
          </span>
          <span className="font-mono text-[11px]">Latest events</span>
        </div>

        <div className="divide-y divide-[#171b22] border-t border-b border-[#1b1f27] font-mono text-xs">
          {alerts.slice(0, 7).map((item) => {
            const isHigh = item.scoreResult.riskLevel === 'HIGH';
            const isMed = item.scoreResult.riskLevel === 'MEDIUM';

            // Action label: Review for pending high/medium, Legitimate for approved/low, Confirmed for confirmed fraud
            const actionLabel = item.status === 'CONFIRMED_FRAUD' 
              ? 'Confirmed' 
              : (isHigh || isMed) && item.status === 'PENDING_REVIEW'
              ? 'Review'
              : 'Legitimate';

            return (
              <div
                key={item.id}
                onClick={() => onSelectAlert(item)}
                className="py-3.5 px-2 flex items-center justify-between gap-4 hover:bg-[#12151b] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-6 min-w-0">
                  {/* Risk - Only text has muted color */}
                  <span
                    className={`text-[11px] font-semibold w-16 shrink-0 ${
                      isHigh
                        ? 'text-rose-400'
                        : isMed
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {item.scoreResult.riskLevel}
                  </span>

                  <span className="font-medium text-[#ededf0] w-24 shrink-0">
                    ₹{item.amount.toLocaleString()}
                  </span>

                  <span className="text-[#8b92a0] truncate hidden sm:inline">
                    {item.userId} · {item.location}
                  </span>
                </div>

                <div className="flex items-center gap-6 shrink-0 text-[#8b92a0] text-[11px]">
                  <span>{String(item.hour).padStart(2, '0')}:00</span>
                  <span className={`w-20 text-right ${
                    actionLabel === 'Review' ? 'text-zinc-200 underline underline-offset-4 decoration-[#374151]' : 'text-[#6b7280]'
                  }`}>
                    {actionLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
