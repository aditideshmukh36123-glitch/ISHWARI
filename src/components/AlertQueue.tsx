import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Search, 
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  MapPin,
  Clock
} from 'lucide-react';
import { AlertQueueItem } from '../data/mockLiveTransactions';

interface AlertQueueProps {
  alerts: AlertQueueItem[];
  onSelectAlert: (alert: AlertQueueItem) => void;
  onUpdateStatus: (alertId: string, newStatus: AlertQueueItem['status']) => void;
  onOpenInSimulator: (userId: string) => void;
}

export const AlertQueue: React.FC<AlertQueueProps> = ({
  alerts,
  onSelectAlert,
  onUpdateStatus,
  onOpenInSimulator
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Stats calculation
  const totalCount = alerts.length;
  const highRiskCount = alerts.filter(a => a.scoreResult.riskLevel === 'HIGH').length;
  const pendingCount = alerts.filter(a => a.status === 'PENDING_REVIEW').length;
  const confirmedCount = alerts.filter(a => a.status === 'CONFIRMED_FRAUD').length;

  const filteredAlerts = alerts.filter(a => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (filterRisk !== 'all' && a.scoreResult.riskLevel !== filterRisk) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = a.id.toLowerCase().includes(q) ||
                    a.userId.toLowerCase().includes(q) ||
                    a.userName.toLowerCase().includes(q) ||
                    a.location.toLowerCase().includes(q) ||
                    a.device_id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Pending Triage Queue</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Awaiting analyst action</div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-xs text-rose-400 font-medium">High Risk (Critical)</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {highRiskCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Score &ge; 75/100 (Held)</div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-xs text-amber-400 font-medium">Confirmed Fraud (Blocked)</div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
            {confirmedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Device blacklisted</div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-xs text-emerald-400 font-medium">Auto-Approved Nominal</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {alerts.filter(a => a.status === 'APPROVED').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Low risk threshold &lt; 40</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by User, Txn ID, City, Device..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-500 px-2">Risk:</span>
            {['all', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  filterRisk === risk
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {risk === 'all' ? 'All' : risk}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-500 px-2">Status:</span>
            {[
              { key: 'all', label: 'All' },
              { key: 'PENDING_REVIEW', label: 'Pending' },
              { key: 'CONFIRMED_FRAUD', label: 'Fraud' },
              { key: 'APPROVED', label: 'Approved' }
            ].map((st) => (
              <button
                key={st.key}
                onClick={() => setFilterStatus(st.key)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  filterStatus === st.key
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Transaction / Time</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-center">Score / Verdict</th>
                <th className="py-3 px-4">Key Risk Signals</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Triage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 text-sm">
                    No transactions matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => {
                  const isHigh = alert.scoreResult.riskLevel === 'HIGH';
                  const isMed = alert.scoreResult.riskLevel === 'MEDIUM';

                  return (
                    <tr
                      key={alert.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => onSelectAlert(alert)}
                    >
                      {/* ID & Time */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-semibold text-white group-hover:text-rose-400 transition-colors">
                          {alert.id}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {alert.timestamp} · {String(alert.hour).padStart(2, '0')}:00
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">
                          {alert.userName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {alert.userId}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="font-bold text-white text-sm">
                          ₹{alert.amount.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {(alert.amount / alert.scoreResult.userProfile.mean_amount).toFixed(1)}x avg
                        </div>
                      </td>

                      {/* Score Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span
                            className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                              isHigh
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : isMed
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            {alert.scoreResult.riskScore}/100
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {(alert.scoreResult.modelProbability * 100).toFixed(0)}% ML prob
                        </div>
                      </td>

                      {/* Key Flagged Signals */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-0.5">
                          {alert.scoreResult.reasons
                            .filter(r => r.signal !== "Model pattern similarity")
                            .slice(0, 2)
                            .map((r, i) => (
                              <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5 truncate">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                <span className="truncate">{r.signal}: {r.detail}</span>
                              </div>
                            ))}
                          {alert.scoreResult.reasons.filter(r => r.signal !== "Model pattern similarity").length > 2 && (
                            <div className="text-[10px] text-slate-500 font-mono">
                              +{alert.scoreResult.reasons.length - 3} more signals
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          alert.status === 'CONFIRMED_FRAUD'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : alert.status === 'PENDING_REVIEW'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : alert.status === 'APPROVED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {alert.status === 'CONFIRMED_FRAUD' && 'Confirmed Fraud'}
                          {alert.status === 'PENDING_REVIEW' && 'Under Review'}
                          {alert.status === 'APPROVED' && 'Approved'}
                          {alert.status === 'FALSE_POSITIVE' && 'False Positive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {alert.status === 'PENDING_REVIEW' && (
                            <>
                              <button
                                onClick={() => onUpdateStatus(alert.id, 'APPROVED')}
                                title="Approve Transaction"
                                className="p-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 rounded transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onUpdateStatus(alert.id, 'CONFIRMED_FRAUD')}
                                title="Confirm Fraud & Block"
                                className="p-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-400 rounded transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => onOpenInSimulator(alert.userId)}
                            title="Load in Simulator"
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
