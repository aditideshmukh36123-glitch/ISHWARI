import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Smartphone, 
  MapPin, 
  ArrowUpRight, 
  History, 
  CreditCard,
  CheckCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { USER_PROFILES, UserProfile } from '../data/userProfiles';

interface UserProfilesExplorerProps {
  onSelectUserToSimulate: (userId: string) => void;
}

export const UserProfilesExplorer: React.FC<UserProfilesExplorerProps> = ({
  onSelectUserToSimulate
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProfile, setSelectedProfile] = useState<UserProfile>(USER_PROFILES[0]);
  const [filterTier, setFilterTier] = useState<string>('all');

  const filteredProfiles = USER_PROFILES.filter((p) => {
    if (filterTier === 'high_val' && p.mean_amount < 5000) return false;
    if (filterTier === 'frequent' && p.txn_count < 65) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = p.userId.toLowerCase().includes(q) ||
                    p.name.toLowerCase().includes(q) ||
                    p.email.toLowerCase().includes(q) ||
                    p.known_locations.some(l => l.toLowerCase().includes(q)) ||
                    p.known_devices.some(d => d.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Customer Behavioral Baselines & Entity Profiler</h2>
            <span className="text-xs text-slate-500 font-mono">{USER_PROFILES.length} Verified Accounts</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Behavioral baselines capture personalized spending distribution (μ, σ), registered hardware devices, and typical geographic locations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilterTier('all')}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              filterTier === 'all'
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Accounts
          </button>
          <button
            onClick={() => setFilterTier('high_val')}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              filterTier === 'high_val'
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            High Value (μ &gt; ₹5,000)
          </button>
          <button
            onClick={() => setFilterTier('frequent')}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              filterTier === 'frequent'
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Frequent (&gt; 65 txns)
          </button>
        </div>
      </div>

      {/* Main Grid: List on Left (5 Cols), Detail Inspector on Right (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Account Directory (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user ID, device, city..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Accounts List */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40 divide-y divide-slate-800/60 max-h-[620px] overflow-y-auto">
            {filteredProfiles.map((p) => {
              const isSelected = selectedProfile.userId === p.userId;
              return (
                <div
                  key={p.userId}
                  onClick={() => setSelectedProfile(p)}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-800/80 border-l-4 border-l-rose-500'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-rose-400 font-mono shrink-0">
                      {p.userId.slice(1)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-white truncate">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({p.userId})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {p.known_locations.slice(0, 2).join(', ')} · {p.known_devices.length} devices
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-slate-200">
                      ₹{Math.round(p.mean_amount).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {p.txn_count} txns
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Behavioral Baseline Profile (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-indigo-500/20 border border-rose-500/30 flex items-center justify-center font-bold font-mono text-lg text-rose-400">
                  {selectedProfile.userId}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {selectedProfile.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      VERIFIED ACCOUNT
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono">
                    {selectedProfile.email} · {selectedProfile.phone}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectUserToSimulate(selectedProfile.userId)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                <span>Test in Simulator</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Baseline Spend Distribution Card */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Historical Spending Baseline & Bounds (Gaussian μ, σ)
              </span>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Typical Mean (μ)</span>
                  <span className="text-base font-bold font-mono text-white mt-1 block">
                    ₹{selectedProfile.mean_amount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500">Normal transaction size</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Std Deviation (σ)</span>
                  <span className="text-base font-bold font-mono text-slate-200 mt-1 block">
                    ₹{Math.round(selectedProfile.std_amount).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500">Variance measure</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">3σ Anomaly Trigger</span>
                  <span className="text-base font-bold font-mono text-rose-400 mt-1 block">
                    ₹{Math.round(selectedProfile.mean_amount + 3 * selectedProfile.std_amount).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500">Upper risk boundary</span>
                </div>
              </div>
            </div>

            {/* Known Trusted Devices */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Registered Trusted Devices</span>
                </span>
                <span className="text-slate-500 font-mono">{selectedProfile.known_devices.length} verified</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedProfile.known_devices.map((device) => {
                  const isSuspicious = device.startsWith("unk-");
                  return (
                    <div
                      key={device}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                        isSuspicious
                          ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-200'
                      }`}
                    >
                      <Smartphone className="w-3 h-3 text-slate-400" />
                      <span>{device}</span>
                      {isSuspicious && (
                        <span className="text-[9px] uppercase px-1 py-0.2 bg-amber-500/20 rounded text-amber-400 font-bold">
                          Legacy Unk
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Known Locations */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Approved Transaction Hubs & Cities</span>
                </span>
                <span className="text-slate-500 font-mono">{selectedProfile.known_locations.length} cities</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedProfile.known_locations.map((loc) => (
                  <div
                    key={loc}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-200 text-xs flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{loc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity History & Metadata */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs text-slate-400 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Account Onboarding Date:</span>
                <span className="text-white">{selectedProfile.accountCreated}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Historical Completed Transactions:</span>
                <span className="text-white font-bold">{selectedProfile.txn_count}</span>
              </div>
              <div className="flex justify-between">
                <span>Baseline Model Reliability Score:</span>
                <span className="text-emerald-400 font-bold">98.4% (Strong Historical Prior)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
