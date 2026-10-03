import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { USER_PROFILES, getUserProfile, UserProfile } from '../data/userProfiles';
import { FraudScopeEngine, ScoreResult, TransactionInput } from '../services/riskEngine';
import { formatHourToAmPm, getUserFriendlySignal } from '../types/notification';

interface LiveMonitorProps {
  onConfirmFraud: (txn: TransactionInput, result: ScoreResult) => void;
  onApprove: (txn: TransactionInput, result: ScoreResult) => void;
  presetUserId?: string;
  onTriggerNotification?: (input: TransactionInput, result: ScoreResult) => void;
}

export const LiveMonitor: React.FC<LiveMonitorProps> = ({
  onConfirmFraud,
  onApprove,
  presetUserId,
  onTriggerNotification
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(presetUserId || "U00372");
  const [amount, setAmount] = useState<number>(85000);
  const [hour, setHour] = useState<number>(2);
  const [location, setLocation] = useState<string>("Delhi");
  const [deviceId, setDeviceId] = useState<string>("unknown-device-882");
  const [txn10m, setTxn10m] = useState<number>(7);
  const [secSincePrev, setSecSincePrev] = useState<number>(45);

  const [activePreset, setActivePreset] = useState<string>("ato");
  const [showBaseline, setShowBaseline] = useState<boolean>(false);
  const [showParameters, setShowParameters] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const currentProfile: UserProfile = getUserProfile(selectedUserId);

  // Score calculation
  const currentInput: TransactionInput = {
    userId: selectedUserId,
    amount,
    hour,
    location,
    device_id: deviceId,
    txn_count_10min: txn10m,
    seconds_since_prev: secSincePrev
  };

  const scoreResult: ScoreResult = FraudScopeEngine.score(currentInput);

  useEffect(() => {
    if (presetUserId) {
      setSelectedUserId(presetUserId);
      const prof = getUserProfile(presetUserId);
      setAmount(Math.round(prof.mean_amount * 1.2));
      setHour(14);
      setLocation(prof.known_locations[0] || "Bengaluru");
      setDeviceId(prof.known_devices[0] || "android-a");
      setTxn10m(1);
      setSecSincePrev(3600);
      setActivePreset("custom");
    }
  }, [presetUserId]);

  const applyPreset = (key: string) => {
    setActivePreset(key);
    setActionFeedback(null);

    let input: TransactionInput;
    switch (key) {
      case 'ato':
        setSelectedUserId("U00372");
        setAmount(85000);
        setHour(2);
        setLocation("Delhi");
        setDeviceId("unknown-device-882");
        setTxn10m(7);
        setSecSincePrev(45);
        input = { userId: "U00372", amount: 85000, hour: 2, location: "Delhi", device_id: "unknown-device-882", txn_count_10min: 7, seconds_since_prev: 45 };
        break;
      case 'velocity':
        setSelectedUserId("U01035");
        setAmount(120);
        setHour(1);
        setLocation("Hyderabad");
        setDeviceId("unk-bot-12");
        setTxn10m(11);
        setSecSincePrev(15);
        input = { userId: "U01035", amount: 120, hour: 1, location: "Hyderabad", device_id: "unk-bot-12", txn_count_10min: 11, seconds_since_prev: 15 };
        break;
      case 'outlier':
        setSelectedUserId("U00165");
        setAmount(98000);
        setHour(17);
        setLocation("Bengaluru");
        setDeviceId("web-chrome");
        setTxn10m(2);
        setSecSincePrev(1800);
        input = { userId: "U00165", amount: 98000, hour: 17, location: "Bengaluru", device_id: "web-chrome", txn_count_10min: 2, seconds_since_prev: 1800 };
        break;
      case 'legit':
        setSelectedUserId("U00634");
        setAmount(650);
        setHour(14);
        setLocation("Bengaluru");
        setDeviceId("android-a");
        setTxn10m(1);
        setSecSincePrev(4800);
        input = { userId: "U00634", amount: 650, hour: 14, location: "Bengaluru", device_id: "android-a", txn_count_10min: 1, seconds_since_prev: 4800 };
        break;
      default:
        return;
    }

    if (onTriggerNotification) {
      const res = FraudScopeEngine.score(input);
      if (res.riskLevel !== 'LOW') {
        onTriggerNotification(input, res);
      }
    }
  };

  const handleConfirmFraudClick = () => {
    onConfirmFraud(currentInput, scoreResult);
    setActionFeedback("Fraud confirmed. Alert updated.");
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleApproveClick = () => {
    onApprove(currentInput, scoreResult);
    setActionFeedback("Transaction approved.");
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const isHigh = scoreResult.riskLevel === 'HIGH';
  const isMed = scoreResult.riskLevel === 'MEDIUM';

  const flaggedReasons = scoreResult.reasons
    .filter(r => r.signal !== "Model pattern similarity")
    .map(r => getUserFriendlySignal(r.signal));

  const deviceDisplay = deviceId.startsWith('unk-') || deviceId.startsWith('unknown-') 
    ? 'Unknown device' 
    : deviceId;

  const isDeviceKnown = currentProfile.known_devices.includes(deviceId);
  const isLocationKnown = currentProfile.known_locations.includes(location);
  const ratioMultiple = Math.round(amount / (currentProfile.mean_amount || 830));

  return (
    <div className="max-w-xl mx-auto py-12 px-4 sm:px-6 space-y-10">
      {/* Preset Switcher (Minimal quiet links) */}
      <div className="flex items-center justify-between text-xs font-mono border-b border-[#1b1f27] pb-3 text-[#6b7280]">
        <span className="uppercase text-[11px] tracking-wider text-[#8b92a0]">
          Live Monitor
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => applyPreset('ato')}
            className={`transition-colors cursor-pointer ${activePreset === 'ato' ? 'text-[#f3f4f6] font-medium' : 'text-[#6b7280] hover:text-[#9ca3af]'}`}
          >
            ATO 85k
          </button>
          <button
            onClick={() => applyPreset('velocity')}
            className={`transition-colors cursor-pointer ${activePreset === 'velocity' ? 'text-[#f3f4f6] font-medium' : 'text-[#6b7280] hover:text-[#9ca3af]'}`}
          >
            Velocity
          </button>
          <button
            onClick={() => applyPreset('outlier')}
            className={`transition-colors cursor-pointer ${activePreset === 'outlier' ? 'text-[#f3f4f6] font-medium' : 'text-[#6b7280] hover:text-[#9ca3af]'}`}
          >
            Outlier
          </button>
          <button
            onClick={() => applyPreset('legit')}
            className={`transition-colors cursor-pointer ${activePreset === 'legit' ? 'text-[#f3f4f6] font-medium' : 'text-[#6b7280] hover:text-[#9ca3af]'}`}
          >
            Normal
          </button>
        </div>
      </div>

      {/* Centerpiece Visual Focus */}
      <div className="space-y-6 text-left">
        {/* Large Amount */}
        <div className="text-5xl sm:text-6xl font-mono font-medium tracking-tight text-[#f3f4f6]">
          ₹{amount.toLocaleString()}
        </div>

        {/* Metadata Lines */}
        <div className="space-y-1 font-mono text-xs">
          <div className="text-[#ededf0] font-medium">
            {selectedUserId} · {location} · {deviceDisplay}
          </div>
          <div className="text-[#8b92a0]">
            {formatHourToAmPm(hour)} · {txn10m} transactions / 10 min
          </div>
        </div>

        {/* Risk Score & Label (Only risk text uses muted color) */}
        <div className="pt-2 space-y-2">
          <div className="flex items-baseline gap-3 font-mono">
            <span className="text-xl text-[#ededf0] font-medium">
              {scoreResult.riskScore} <span className="text-xs text-[#6b7280]">/ 100</span>
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {scoreResult.riskLevel}
            </span>
          </div>

          {/* Thin horizontal risk bar */}
          <div className="h-0.5 w-full bg-[#1b1f27] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
              style={{ width: `${scoreResult.riskScore}%` }}
            />
          </div>
        </div>

        {/* WHY THIS WAS FLAGGED (Restrained Section, Dynamic) */}
        {flaggedReasons.length > 0 && (
          <div className="pt-6 border-t border-[#1b1f27] space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#8b92a0]">
              Why this was flagged
            </div>
            <div className="space-y-2 text-xs text-[#d1d5db] font-sans">
              {flaggedReasons.map((reason, idx) => (
                <div key={idx} className="flex items-baseline gap-2.5">
                  <span className="w-1 h-1 rounded-full bg-[#6b7280] shrink-0 self-center" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleConfirmFraudClick}
            className="px-5 py-2.5 bg-[#1c1417] hover:bg-[#25181c] text-rose-300 border border-rose-900/40 rounded text-xs font-mono transition-colors cursor-pointer"
          >
            Confirm Fraud
          </button>
          <button
            onClick={handleApproveClick}
            className="px-5 py-2.5 bg-[#14171d] hover:bg-[#1a1f26] text-zinc-300 border border-[#222731] rounded text-xs font-mono transition-colors cursor-pointer"
          >
            Approve
          </button>

          {/* Customer Baseline Toggle */}
          <button
            onClick={() => setShowBaseline(prev => !prev)}
            className="sm:ml-auto inline-flex items-center justify-center gap-1.5 text-xs text-[#8b92a0] hover:text-[#d1d5db] py-2 transition-colors cursor-pointer font-mono"
          >
            <span>{showBaseline ? 'Hide Customer Baseline' : 'View Customer Baseline'}</span>
            {showBaseline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Action Feedback */}
        {actionFeedback && (
          <div className="text-xs font-mono text-[#8b92a0] pt-1">
            {actionFeedback}
          </div>
        )}

        {/* Collapsible Customer Baseline Comparison (Quiet panel, thin lines) */}
        {showBaseline && (
          <div className="pt-6 border-t border-[#1b1f27] space-y-6 text-xs text-[#9ca3af] font-mono animate-in fade-in duration-100">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8b92a0] block">
                Customer Baseline vs Current Event
              </span>
              <div className="divide-y divide-[#171b22] border-t border-b border-[#1b1f27] py-1 text-[11px]">
                <div className="py-2 flex justify-between">
                  <span className="text-[#6b7280]">Customer profile:</span>
                  <span className="text-[#e5e7eb]">{currentProfile.name} ({currentProfile.userId})</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#6b7280]">Typical amount:</span>
                  <span className="text-[#e5e7eb]">₹{Math.round(currentProfile.mean_amount).toLocaleString()}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#6b7280]">Current amount:</span>
                  <span className="text-[#f3f4f6] font-medium">₹{amount.toLocaleString()}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#6b7280]">Amount deviation:</span>
                  <span className={ratioMultiple > 2 ? 'text-rose-400 font-medium' : 'text-[#e5e7eb]'}>
                    {ratioMultiple}× {ratioMultiple > 2 ? 'higher than usual' : 'within normal variance'}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#6b7280]">Normal transaction hours:</span>
                  <span className="text-[#d1d5db]">10 AM – 8 PM</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#6b7280]">Current time:</span>
                  <span className={hour >= 1 && hour <= 5 ? 'text-rose-400' : 'text-[#e5e7eb]'}>
                    {formatHourToAmPm(hour)}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#6b7280]">Known device:</span>
                  <span className={isDeviceKnown ? 'text-[#e5e7eb]' : 'text-rose-400'}>
                    {isDeviceKnown ? 'Yes (Recognized)' : 'No (First-seen / unknown)'}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#6b7280]">Known location:</span>
                  <span className={isLocationKnown ? 'text-[#e5e7eb]' : 'text-rose-400'}>
                    {isLocationKnown ? 'Yes' : 'No (New location)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quiet Link to adjust parameters */}
            <div>
              <button
                onClick={() => setShowParameters(prev => !prev)}
                className="inline-flex items-center gap-1.5 text-[11px] text-[#6b7280] hover:text-[#9ca3af] transition-colors cursor-pointer"
              >
                <span>{showParameters ? 'Hide Simulation Parameters' : 'Adjust Simulation Parameters'}</span>
                {showParameters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showParameters && (
                <div className="pt-4 space-y-4 border-t border-[#1b1f27] mt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Customer</label>
                      <select
                        value={selectedUserId}
                        onChange={(e) => {
                          setSelectedUserId(e.target.value);
                          const prof = getUserProfile(e.target.value);
                          setAmount(Math.round(prof.mean_amount * 1.5));
                        }}
                        className="w-full bg-[#12151b] border border-[#222731] rounded px-2 py-1 text-xs text-[#e5e7eb] focus:outline-none focus:border-zinc-500"
                      >
                        {USER_PROFILES.slice(0, 10).map(u => (
                          <option key={u.userId} value={u.userId}>{u.userId} — {u.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Amount (₹)</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-[#12151b] border border-[#222731] rounded px-2 py-1 text-xs text-[#e5e7eb] focus:outline-none focus:border-zinc-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Hour of Day (0–23)</label>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={hour}
                        onChange={(e) => setHour(Number(e.target.value))}
                        className="w-full bg-[#12151b] border border-[#222731] rounded px-2 py-1 text-xs text-[#e5e7eb] focus:outline-none focus:border-zinc-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Transactions in 10 min</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={txn10m}
                        onChange={(e) => setTxn10m(Number(e.target.value))}
                        className="w-full bg-[#12151b] border border-[#222731] rounded px-2 py-1 text-xs text-[#e5e7eb] focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
