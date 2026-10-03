import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { AlertQueueItem } from '../data/mockLiveTransactions';
import { formatHourToAmPm, getUserFriendlySignal } from '../types/notification';

interface TransactionInspectModalProps {
  alert: AlertQueueItem | null;
  onClose: () => void;
  onUpdateStatus: (alertId: string, status: AlertQueueItem['status']) => void;
  onOpenInSimulator: (userId: string) => void;
}

export const TransactionInspectModal: React.FC<TransactionInspectModalProps> = ({
  alert,
  onClose,
  onUpdateStatus,
  onOpenInSimulator
}) => {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!alert) return null;

  const { scoreResult } = alert;
  const isHigh = scoreResult.riskLevel === 'HIGH';
  const isMed = scoreResult.riskLevel === 'MEDIUM';

  const userProfile = scoreResult.userProfile;
  const isDeviceKnown = userProfile.known_devices.includes(alert.device_id);
  const isLocationKnown = userProfile.known_locations.includes(alert.location);
  const ratioMultiple = Math.round(alert.amount / (userProfile.mean_amount || 830));

  const deviceDisplay = alert.device_id.startsWith('unk-') || alert.device_id.startsWith('unknown-') 
    ? 'Unknown device' 
    : alert.device_id;

  const handleAnalystDecision = (status: AlertQueueItem['status']) => {
    onUpdateStatus(alert.id, status);
    setFeedbackMessage("Feedback recorded for future model improvement.");
    setTimeout(() => {
      setFeedbackMessage(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0c0f]/80 backdrop-blur-sm animate-in fade-in duration-100">
      <div 
        className="w-full max-w-2xl bg-[#12151b] border border-[#222731] rounded shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#1b1f27] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-[#f3f4f6]">
              {alert.id}
            </span>
            <span
              className={`font-mono text-[11px] font-semibold ${
                isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {scoreResult.riskScore}/100 {scoreResult.riskLevel}
            </span>
            <span className="text-[10px] font-mono text-[#8b92a0] uppercase px-1.5 py-0.5 rounded border border-[#1b1f27]">
              {alert.status.replace('_', ' ')}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#6b7280] hover:text-[#d1d5db] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-6 overflow-y-auto text-xs font-mono">
          {/* Main Transaction Header */}
          <div>
            <div className="text-3xl font-mono font-medium text-[#f3f4f6]">
              ₹{alert.amount.toLocaleString()}
            </div>
            <div className="text-[#ededf0] mt-1">
              {alert.userId} ({alert.userName}) · {alert.location} · {deviceDisplay}
            </div>
            <div className="text-[#8b92a0] text-[11px] mt-0.5">
              {formatHourToAmPm(alert.hour)} · {alert.txn_count_10min} txns in 10m · {alert.seconds_since_prev}s gap
            </div>
          </div>

          {/* WHY THIS WAS FLAGGED */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-[#8b92a0] block">
              Why this was flagged
            </span>
            <div className="space-y-1.5 bg-[#0f1116] p-3 rounded border border-[#1b1f27] text-xs font-sans text-[#d1d5db]">
              {scoreResult.reasons
                .filter(r => r.signal !== "Model pattern similarity")
                .map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[#6b7280]">•</span>
                    <span>{getUserFriendlySignal(r.signal)}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Customer Baseline Comparison */}
          <div className="p-3.5 bg-[#0f1116] rounded border border-[#1b1f27] space-y-2 text-[11px]">
            <span className="text-[#8b92a0] font-semibold uppercase text-[10px] tracking-wider block border-b border-[#1b1f27] pb-1.5">
              Customer Baseline
            </span>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[#6b7280] block text-[10px]">Typical transaction</span>
                <span className="text-[#e5e7eb]">₹{Math.round(userProfile.mean_amount).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[#6b7280] block text-[10px]">Current transaction</span>
                <span className="text-[#f3f4f6] font-semibold">₹{alert.amount.toLocaleString()}</span>
                {ratioMultiple > 1 && (
                  <span className="text-rose-400 block text-[10px]">
                    {ratioMultiple}× higher than usual
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1b1f27]">
              <div>
                <span className="text-[#6b7280] block text-[10px]">Normal transaction hours</span>
                <span className="text-[#e5e7eb]">10 AM – 8 PM</span>
              </div>
              <div>
                <span className="text-[#6b7280] block text-[10px]">Current transaction</span>
                <span className={alert.hour >= 1 && alert.hour <= 5 ? 'text-rose-400' : 'text-[#e5e7eb]'}>
                  {formatHourToAmPm(alert.hour)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1b1f27]">
              <div>
                <span className="text-[#6b7280] block text-[10px]">Known devices</span>
                <span className="text-[#d1d5db] truncate block">
                  {userProfile.known_devices.slice(0, 3).join(', ')}
                </span>
              </div>
              <div>
                <span className="text-[#6b7280] block text-[10px]">Current device</span>
                <span className={isDeviceKnown ? 'text-[#e5e7eb]' : 'text-rose-400'}>
                  {deviceDisplay} {!isDeviceKnown && '(First-seen device)'}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback message */}
          {feedbackMessage && (
            <div className="p-2.5 bg-[#0f1116] border border-[#1b1f27] rounded text-[#d1d5db] text-xs">
              {feedbackMessage}
            </div>
          )}
        </div>

        {/* Modal Footer & Analyst Actions */}
        <div className="px-5 py-3 border-t border-[#1b1f27] flex items-center justify-between bg-[#0e1014]">
          <button
            onClick={() => {
              onClose();
              onOpenInSimulator(alert.userId);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#8b92a0] hover:text-[#d1d5db] transition-colors cursor-pointer font-mono"
          >
            <span>Open in Monitor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAnalystDecision('APPROVED')}
              className="px-3 py-1.5 bg-[#171b22] hover:bg-[#1f242d] text-[#e5e7eb] rounded text-xs font-mono border border-[#232833] transition-colors cursor-pointer"
            >
              Approve
            </button>
            <button
              onClick={() => handleAnalystDecision('CONFIRMED_FRAUD')}
              className="px-3 py-1.5 bg-[#1c1417] hover:bg-[#27181d] text-rose-300 rounded text-xs font-mono border border-rose-900/40 transition-colors cursor-pointer"
            >
              Confirm Fraud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
