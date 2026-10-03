import React, { useState } from 'react';
import { AlertQueueItem } from '../data/mockLiveTransactions';

interface AlertsListProps {
  alerts: AlertQueueItem[];
  onSelectAlert: (alert: AlertQueueItem) => void;
  onUpdateStatus?: (alertId: string, status: AlertQueueItem['status']) => void;
}

export const AlertsList: React.FC<AlertsListProps> = ({
  alerts,
  onSelectAlert,
  onUpdateStatus
}) => {
  const [filter, setFilter] = useState<'All' | 'Flagged' | 'Confirmed'>('All');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'Confirmed') {
      return a.status === 'CONFIRMED_FRAUD';
    }
    if (filter === 'Flagged') {
      return (
        a.status === 'PENDING_REVIEW' ||
        a.scoreResult.riskLevel === 'HIGH' ||
        a.scoreResult.riskLevel === 'MEDIUM'
      );
    }
    return true;
  });

  const handleAction = (e: React.MouseEvent, alertId: string, status: AlertQueueItem['status']) => {
    e.stopPropagation();
    if (onUpdateStatus) {
      onUpdateStatus(alertId, status);
      setFeedbackToast("Feedback recorded for future model improvement.");
      setTimeout(() => setFeedbackToast(null), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-8 space-y-8">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1b1f27] pb-6">
        <div>
          <h2 className="text-[11px] font-mono tracking-widest text-[#8b92a0] uppercase">
            Alerts
          </h2>
          <p className="text-sm text-[#9ca3af] font-sans mt-0.5">
            Flagged transactions for investigation
          </p>
        </div>

        {/* Filter simply by: All, Flagged, Confirmed */}
        <div className="flex items-center gap-5 text-xs font-mono">
          {(['All', 'Flagged', 'Confirmed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`transition-colors py-1 cursor-pointer ${
                filter === f ? 'text-[#f3f4f6] font-medium' : 'text-[#6b7280] hover:text-[#9ca3af]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackToast && (
        <div className="text-xs font-mono text-[#8b92a0]">
          {feedbackToast}
        </div>
      )}

      {/* Clean Table / List */}
      <div className="border-t border-b border-[#1b1f27] font-mono text-xs">
        {/* Table Header: Risk Amount User Location Time Status */}
        <div className="py-2.5 px-3 flex items-center justify-between text-[11px] uppercase tracking-wider text-[#6b7280] border-b border-[#1b1f27]">
          <div className="flex items-center gap-6 min-w-0">
            <span className="w-16 shrink-0">Risk</span>
            <span className="w-24 shrink-0">Amount</span>
            <span className="w-16 shrink-0">User</span>
            <span className="w-28 shrink-0 hidden sm:inline">Location</span>
            <span className="w-16 shrink-0">Time</span>
          </div>
          <span className="w-28 text-right">Status</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#171b22]">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-[#6b7280]">
              No transactions matching the {filter.toLowerCase()} filter.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isHigh = alert.scoreResult.riskLevel === 'HIGH';
              const isMed = alert.scoreResult.riskLevel === 'MEDIUM';

              const statusDisplay = alert.status === 'CONFIRMED_FRAUD'
                ? 'Confirmed'
                : alert.status === 'APPROVED'
                ? 'Approved'
                : 'Pending';

              return (
                <div
                  key={alert.id}
                  onClick={() => onSelectAlert(alert)}
                  className="py-3 px-3 flex items-center justify-between gap-4 hover:bg-[#12151b] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-6 min-w-0">
                    {/* Risk Tag (Only text is colored) */}
                    <span
                      className={`font-semibold w-16 shrink-0 text-[11px] ${
                        isHigh
                          ? 'text-rose-400'
                          : isMed
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {alert.scoreResult.riskLevel}
                    </span>

                    {/* Amount */}
                    <span className="font-medium text-[#ededf0] w-24 shrink-0">
                      ₹{alert.amount.toLocaleString()}
                    </span>

                    {/* User ID */}
                    <span className="text-[#8b92a0] w-16 shrink-0">
                      {alert.userId}
                    </span>

                    {/* Location */}
                    <span className="text-[#6b7280] w-28 shrink-0 hidden sm:inline truncate">
                      {alert.location}
                    </span>

                    {/* Time */}
                    <span className="text-[#8b92a0] w-16 shrink-0 text-[11px]">
                      {String(alert.hour).padStart(2, '0')}:00
                    </span>
                  </div>

                  {/* Status / Quick Action */}
                  <div className="flex items-center justify-end gap-3 w-28 shrink-0 text-right">
                    <span
                      className={`text-[11px] ${
                        alert.status === 'CONFIRMED_FRAUD'
                          ? 'text-rose-400'
                          : alert.status === 'APPROVED'
                          ? 'text-emerald-400/80'
                          : 'text-[#d1d5db]'
                      }`}
                    >
                      {statusDisplay}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
