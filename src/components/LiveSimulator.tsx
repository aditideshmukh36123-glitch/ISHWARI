import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  RotateCcw, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Smartphone,
  MapPin,
  Clock,
  Gauge,
  Sliders,
  DollarSign,
  Bell
} from 'lucide-react';
import { USER_PROFILES, getUserProfile, UserProfile } from '../data/userProfiles';
import { FraudScopeEngine, ScoreResult, TransactionInput } from '../services/riskEngine';

interface LiveSimulatorProps {
  onSendToAlerts?: (input: TransactionInput, result: ScoreResult) => void;
  onTriggerUserNotification?: (input: TransactionInput, result: ScoreResult, immediateDisplay?: boolean) => void;
  presetUserId?: string;
}

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({ 
  onSendToAlerts,
  onTriggerUserNotification,
  presetUserId
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(presetUserId || "U00372");
  const [amount, setAmount] = useState<number>(85000);
  const [hour, setHour] = useState<number>(2);
  const [location, setLocation] = useState<string>("Delhi");
  const [deviceId, setDeviceId] = useState<string>("unknown-device-882");
  const [txn10m, setTxn10m] = useState<number>(7);
  const [secSincePrev, setSecSincePrev] = useState<number>(45);

  const [activePreset, setActivePreset] = useState<string>("ato");
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  const currentProfile: UserProfile = getUserProfile(selectedUserId);

  // Recalculate score whenever inputs change
  useEffect(() => {
    const input: TransactionInput = {
      userId: selectedUserId,
      amount,
      hour,
      location,
      device_id: deviceId,
      txn_count_10min: txn10m,
      seconds_since_prev: secSincePrev
    };

    const res = FraudScopeEngine.score(input);
    setScoreResult(res);
  }, [selectedUserId, amount, hour, location, deviceId, txn10m, secSincePrev]);

  // Handle external preset request
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

  // Presets
  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    setSentSuccess(false);

    let presetInput: TransactionInput;

    switch (presetKey) {
      case 'ato': // Exact notebook scenario
        setSelectedUserId("U00372");
        setAmount(85000);
        setHour(2);
        setLocation("Delhi");
        setDeviceId("unknown-device-882");
        setTxn10m(7);
        setSecSincePrev(45);
        presetInput = {
          userId: "U00372",
          amount: 85000,
          hour: 2,
          location: "Delhi",
          device_id: "unknown-device-882",
          txn_count_10min: 7,
          seconds_since_prev: 45
        };
        break;

      case 'legit': // Typical daytime normal purchase
        setSelectedUserId("U00634");
        setAmount(650);
        setHour(14);
        setLocation("Bengaluru");
        setDeviceId("android-a");
        setTxn10m(1);
        setSecSincePrev(4800);
        presetInput = {
          userId: "U00634",
          amount: 650,
          hour: 14,
          location: "Bengaluru",
          device_id: "android-a",
          txn_count_10min: 1,
          seconds_since_prev: 4800
        };
        break;

      case 'velocity': // Card testing burst
        setSelectedUserId("U01035");
        setAmount(120);
        setHour(1);
        setLocation("Hyderabad");
        setDeviceId("unk-bot-12");
        setTxn10m(11);
        setSecSincePrev(15);
        presetInput = {
          userId: "U01035",
          amount: 120,
          hour: 1,
          location: "Hyderabad",
          device_id: "unk-bot-12",
          txn_count_10min: 11,
          seconds_since_prev: 15
        };
        break;

      case 'high_value': // Unusually high amount from known device
        setSelectedUserId("U00165");
        setAmount(98000);
        setHour(17);
        setLocation("Bengaluru");
        setDeviceId("web-chrome");
        setTxn10m(2);
        setSecSincePrev(1800);
        presetInput = {
          userId: "U00165",
          amount: 98000,
          hour: 17,
          location: "Bengaluru",
          device_id: "web-chrome",
          txn_count_10min: 2,
          seconds_since_prev: 1800
        };
        break;

      case 'teleport': // Location jump to London
        setSelectedUserId("U00282");
        setAmount(24000);
        setHour(4);
        setLocation("London (UK)");
        setDeviceId("unk-browser-99");
        setTxn10m(3);
        setSecSincePrev(120);
        presetInput = {
          userId: "U00282",
          amount: 24000,
          hour: 4,
          location: "London (UK)",
          device_id: "unk-browser-99",
          txn_count_10min: 3,
          seconds_since_prev: 120
        };
        break;
      default:
        return;
    }

    if (onTriggerUserNotification) {
      const res = FraudScopeEngine.score(presetInput);
      if (res.riskLevel !== 'LOW') {
        onTriggerUserNotification(presetInput, res, true);
      }
    }
  };

  const handleTriggerAlert = () => {
    if (scoreResult && onTriggerUserNotification) {
      onTriggerUserNotification({
        userId: selectedUserId,
        amount,
        hour,
        location,
        device_id: deviceId,
        txn_count_10min: txn10m,
        seconds_since_prev: secSincePrev
      }, scoreResult, true);
    }
  };

  const handleSendToReview = () => {
    if (scoreResult && onSendToAlerts) {
      onSendToAlerts({
        userId: selectedUserId,
        amount,
        hour,
        location,
        device_id: deviceId,
        txn_count_10min: txn10m,
        seconds_since_prev: secSincePrev
      }, scoreResult);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3000);
    }
  };

  const isNightHour = hour >= 1 && hour <= 5;
  const isDeviceKnown = currentProfile.known_devices.includes(deviceId);
  const isLocationKnown = currentProfile.known_locations.includes(location);

  return (
    <div className="space-y-6">
      {/* Top Banner with Presets */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Live Transaction Risk Scoring Simulator</h2>
            <span className="text-xs text-slate-500 font-mono">Hybrid ML + Behavioral Engine</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test arbitrary transaction parameters against customer historical baselines to observe real-time score derivation and signal points.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => applyPreset('ato')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activePreset === 'ato'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            ATO Burst (Notebook)
          </button>
          <button
            onClick={() => applyPreset('legit')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activePreset === 'legit'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Nominal Spend (Low)
          </button>
          <button
            onClick={() => applyPreset('velocity')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activePreset === 'velocity'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Card Testing (Burst)
          </button>
          <button
            onClick={() => applyPreset('high_value')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activePreset === 'high_value'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            High Outlier (₹98k)
          </button>
          <button
            onClick={() => applyPreset('teleport')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activePreset === 'teleport'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Foreign Jump
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Output & Explainability on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Baseline (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Customer Baseline Inspector */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Target Account Baseline
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {currentProfile.txn_count} history records
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-rose-400 font-mono shrink-0">
                {selectedUserId.slice(1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={selectedUserId}
                    onChange={(e) => {
                      setSelectedUserId(e.target.value);
                      setActivePreset("custom");
                    }}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-white focus:outline-none focus:border-rose-500"
                  >
                    {USER_PROFILES.map((p) => (
                      <option key={p.userId} value={p.userId}>
                        {p.userId} — {p.name} (avg ₹{Math.round(p.mean_amount).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-slate-400 mt-1 truncate">
                  {currentProfile.email} · {currentProfile.phone}
                </div>
              </div>
            </div>

            {/* Profile Statistics Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/50">
                <span className="text-slate-500 block text-[11px]">Mean Spend (μ)</span>
                <span className="font-mono text-sm font-semibold text-white">
                  ₹{currentProfile.mean_amount.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block font-mono">
                  ±₹{Math.round(currentProfile.std_amount).toLocaleString()} (σ)
                </span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/50">
                <span className="text-slate-500 block text-[11px]">Known Hubs</span>
                <span className="font-medium text-white truncate block">
                  {currentProfile.known_locations.slice(0, 3).join(', ')}
                </span>
                <span className="text-[10px] text-slate-500 block font-mono">
                  {currentProfile.known_devices.length} registered devices
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Parameters Form */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Transaction Parameters
                </span>
              </div>
              <button
                onClick={() => applyPreset(activePreset)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Amount Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-slate-300 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Transaction Amount (INR ₹)</span>
                </label>
                <span className="font-mono text-slate-400 text-[11px]">
                  {(amount / currentProfile.mean_amount).toFixed(1)}x user mean
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-sm">₹</span>
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  step="100"
                  value={amount}
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                    setActivePreset("custom");
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-sm font-mono font-semibold text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="flex gap-1.5 pt-1">
                {[500, 2500, 15000, 85000, 150000].map((quickAmt) => (
                  <button
                    key={quickAmt}
                    onClick={() => {
                      setAmount(quickAmt);
                      setActivePreset("custom");
                    }}
                    className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700/60"
                  >
                    ₹{quickAmt >= 1000 ? `${quickAmt / 1000}k` : quickAmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Hour of Day Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Hour of Day (24h Clock)</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {isNightHour && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                      NIGHT INACTIVE
                    </span>
                  )}
                  <span className="font-mono text-white font-semibold">
                    {String(hour).padStart(2, '0')}:00
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="23"
                value={hour}
                onChange={(e) => {
                  setHour(Number(e.target.value));
                  setActivePreset("custom");
                }}
                className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>00:00 (Night)</span>
                <span className="text-amber-400">02:00 (High Risk)</span>
                <span>12:00 (Noon)</span>
                <span>23:00</span>
              </div>
            </div>

            {/* Device ID Input with Known Device quick chips */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-slate-300 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Device Fingerprint</span>
                </label>
                <span className={`text-[11px] font-semibold ${isDeviceKnown ? 'text-emerald-400' : 'text-rose-400 font-mono'}`}>
                  {isDeviceKnown ? '✓ Known Device' : '⚠️ NEW UNTRUSTED DEVICE'}
                </span>
              </div>
              <input
                type="text"
                value={deviceId}
                onChange={(e) => {
                  setDeviceId(e.target.value);
                  setActivePreset("custom");
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                placeholder="e.g. android-a, unknown-device-882"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="text-[10px] text-slate-500 mr-1 self-center">Known:</span>
                {currentProfile.known_devices.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDeviceId(d);
                      setActivePreset("custom");
                    }}
                    className={`px-1.5 py-0.5 text-[10px] font-mono rounded border ${
                      deviceId === d
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setDeviceId(`unknown-${Math.floor(Math.random() * 9000 + 1000)}`);
                    setActivePreset("custom");
                  }}
                  className="px-1.5 py-0.5 text-[10px] font-mono rounded border border-rose-500/30 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
                >
                  + Unknown Random
                </button>
              </div>
            </div>

            {/* Location Input with Known Locations chips */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Geo-Location Hub</span>
                </label>
                <span className={`text-[11px] font-semibold ${isLocationKnown ? 'text-emerald-400' : 'text-amber-400 font-mono'}`}>
                  {isLocationKnown ? '✓ Known Location' : '⚠️ UNUSUAL GEO LOCATION'}
                </span>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setActivePreset("custom");
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                placeholder="City, e.g. Bengaluru, Delhi, Dubai"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="text-[10px] text-slate-500 mr-1 self-center">Known:</span>
                {currentProfile.known_locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setLocation(loc);
                      setActivePreset("custom");
                    }}
                    className={`px-1.5 py-0.5 text-[10px] rounded border ${
                      location === loc
                        ? 'bg-amber-950 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setLocation("London (UK)");
                    setActivePreset("custom");
                  }}
                  className="px-1.5 py-0.5 text-[10px] rounded border border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                >
                  Foreign (London)
                </button>
              </div>
            </div>

            {/* Velocity Controls (10-minute Count & Seconds Since Previous) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="text-slate-300">10m Velocity</label>
                  <span className="font-mono text-white font-semibold">{txn10m} txns</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={txn10m}
                  onChange={(e) => {
                    setTxn10m(Number(e.target.value));
                    setActivePreset("custom");
                  }}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="text-slate-300">Last Txn Gap</label>
                  <span className="font-mono text-white font-semibold">{secSincePrev}s</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="3600"
                  step="10"
                  value={secSincePrev}
                  onChange={(e) => {
                    setSecSincePrev(Number(e.target.value));
                    setActivePreset("custom");
                  }}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Score, Summary & Signal Decomposition (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {scoreResult && (
            <>
              {/* Primary Score Decision Banner */}
              <div className={`p-5 rounded-xl border transition-all ${
                scoreResult.riskLevel === 'HIGH'
                  ? 'bg-rose-950/40 border-rose-600/60 shadow-lg shadow-rose-950/50'
                  : scoreResult.riskLevel === 'MEDIUM'
                  ? 'bg-amber-950/30 border-amber-600/50'
                  : 'bg-emerald-950/30 border-emerald-600/50'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Score Dial / Indicator */}
                    <div className={`relative w-18 h-18 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${
                      scoreResult.riskLevel === 'HIGH'
                        ? 'border-rose-500 bg-rose-900/30 text-rose-200'
                        : scoreResult.riskLevel === 'MEDIUM'
                        ? 'border-amber-500 bg-amber-900/30 text-amber-200'
                        : 'border-emerald-500 bg-emerald-900/30 text-emerald-200'
                    }`}>
                      <span className="text-2xl font-black font-mono leading-none">
                        {scoreResult.riskScore}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5">/100</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-bold uppercase tracking-wider ${
                          scoreResult.riskLevel === 'HIGH'
                            ? 'text-rose-400'
                            : scoreResult.riskLevel === 'MEDIUM'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}>
                          {scoreResult.riskLevel} RISK VERDICT
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          · Model: {(scoreResult.modelProbability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium mt-1">
                        {scoreResult.actionLabel}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 flex flex-wrap items-center gap-2">
                    {scoreResult.riskLevel !== 'LOW' && onTriggerUserNotification && (
                      <button
                        onClick={handleTriggerAlert}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-all whitespace-nowrap"
                        title="Simulate immediate cardholder security alert"
                      >
                        <Bell className="w-3.5 h-3.5 text-rose-400" />
                        <span>Cardholder Alert</span>
                      </button>
                    )}

                    <button
                      onClick={handleSendToReview}
                      disabled={sentSuccess}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                        sentSuccess
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      {sentSuccess ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Routed to Triage</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Route to Queue</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Structured Text Summary */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-lg font-mono">
                  {scoreResult.summary}
                </div>
              </div>

              {/* Explainability Signal Breakdown Table */}
              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-rose-400" />
                    <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Signals & Risk Attribution Breakdown
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Total: +{scoreResult.reasons.reduce((a, b) => a + b.points, 0).toFixed(1)} pts
                  </span>
                </div>

                <div className="space-y-2">
                  {scoreResult.reasons.map((r, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {r.signal}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            r.severity === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : r.severity === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : r.severity === 'MEDIUM'
                              ? 'bg-yellow-500/10 text-yellow-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {r.severity}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {r.detail}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="font-mono font-bold text-sm text-rose-400">
                          +{r.points.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-mono">pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engineered Feature Matrix Inspector */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Engineered Feature Vectors (ML Vector Space)</span>
                  </span>
                  <span className="text-slate-500 font-mono">11 features</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800/60">
                    <span className="text-slate-500 block text-[10px] font-mono">amount_ratio</span>
                    <span className="font-mono text-white font-bold">{scoreResult.features.amount_ratio}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800/60">
                    <span className="text-slate-500 block text-[10px] font-mono">amount_zscore</span>
                    <span className="font-mono text-white font-bold">{scoreResult.features.amount_zscore}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800/60">
                    <span className="text-slate-500 block text-[10px] font-mono">log_amount</span>
                    <span className="font-mono text-white font-bold">{scoreResult.features.log_amount}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800/60">
                    <span className="text-slate-500 block text-[10px] font-mono">hour / is_night</span>
                    <span className="font-mono text-white font-bold">{scoreResult.features.hour} ({scoreResult.features.is_night})</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800/60">
                    <span className="text-slate-500 block text-[10px] font-mono">is_new_device</span>
                    <span className="font-mono text-white font-bold">{scoreResult.features.is_new_device}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800/60">
                    <span className="text-slate-500 block text-[10px] font-mono">is_new_location</span>
                    <span className="font-mono text-white font-bold">{scoreResult.features.is_new_location}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800/60">
                    <span className="text-slate-500 block text-[10px] font-mono">txn_count_10min</span>
                    <span className="font-mono text-white font-bold">{scoreResult.features.txn_count_10min}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800/60">
                    <span className="text-slate-500 block text-[10px] font-mono">seconds_since_prev</span>
                    <span className="font-mono text-white font-bold">{scoreResult.features.seconds_since_prev}s</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
