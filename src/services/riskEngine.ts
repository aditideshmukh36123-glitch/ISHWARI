import { UserProfile, getUserProfile } from '../data/userProfiles';

export interface TransactionInput {
  userId: string;
  amount: number;
  hour: number;
  location: string;
  device_id: string;
  txn_count_10min: number;
  txn_count_1h?: number;
  seconds_since_prev: number;
  is_new_device?: number;
  is_new_location?: number;
}

export interface RiskReason {
  points: number;
  signal: string;
  detail: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
}

export interface ScoreResult {
  riskScore: number; // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  modelProbability: number; // 0.0 to 1.0
  summary: string;
  action: 'APPROVE' | 'STEP_UP_2FA' | 'HOLD_FOR_REVIEW';
  actionLabel: string;
  reasons: RiskReason[];
  features: {
    log_amount: number;
    amount_ratio: number;
    amount_zscore: number;
    hour: number;
    is_night: number;
    seconds_since_prev: number;
    txn_count_10min: number;
    txn_count_1h: number;
    is_new_device: number;
    is_new_location: number;
    user_txn_index: number;
  };
  userProfile: UserProfile;
}

export class FraudScopeEngine {
  // Feature weights derived from permutation importance and standard scaler of the model
  private static readonly WEIGHTS = {
    hourNight: 1.85,
    newDevice: 1.65,
    amountRatio: 1.45,
    amountZscore: 0.95,
    velocity10m: 0.85,
    rapidRepeat: 0.65,
    newLocation: 0.55,
    thinHistory: 0.40,
    intercept: -3.85
  };

  /**
   * Score a transaction against the customer baseline and machine learning risk model
   */
  public static score(input: TransactionInput): ScoreResult {
    const profile = getUserProfile(input.userId);
    
    // Auto-compute flags if not explicitly overridden
    const isNewDevice = input.is_new_device !== undefined 
      ? input.is_new_device 
      : (profile.known_devices.includes(input.device_id) ? 0 : 1);

    const isNewLocation = input.is_new_location !== undefined 
      ? input.is_new_location 
      : (profile.known_locations.includes(input.location) ? 0 : 1);

    const hour = Math.max(0, Math.min(23, input.hour));
    const isNight = (hour >= 1 && hour <= 5) ? 1 : 0;
    const amount = Math.max(1, input.amount);
    const meanAmount = profile.mean_amount > 0 ? profile.mean_amount : 2500;
    const stdAmount = profile.std_amount > 0 ? profile.std_amount : meanAmount;

    const amountRatio = amount / meanAmount;
    const amountZscore = (amount - meanAmount) / stdAmount;
    const logAmount = Math.log1p(amount);
    const txn10m = Math.max(1, input.txn_count_10min);
    const txn1h = input.txn_count_1h !== undefined ? Math.max(txn10m, input.txn_count_1h) : Math.max(1, txn10m + 1);
    const secSincePrev = Math.max(1, input.seconds_since_prev);
    const userTxnIndex = profile.txn_count;

    // 1. Calculate Logistic Model Probability (Fraud Pattern Similarity)
    let logit = this.WEIGHTS.intercept;
    
    // Amount ratio effect
    if (amountRatio > 1.2) {
      logit += Math.min(4.5, Math.log2(amountRatio) * this.WEIGHTS.amountRatio);
    }
    // Z-score effect
    if (amountZscore > 1.5) {
      logit += Math.min(3.0, (amountZscore / 2.0) * this.WEIGHTS.amountZscore);
    }
    // Night hour effect
    if (isNight) {
      logit += this.WEIGHTS.hourNight;
    } else if (hour >= 23 || hour === 0) {
      logit += 0.8;
    }
    // New device
    if (isNewDevice === 1) {
      logit += this.WEIGHTS.newDevice;
    }
    // New location
    if (isNewLocation === 1) {
      logit += this.WEIGHTS.newLocation;
    }
    // Velocity past 10m
    if (txn10m >= 3) {
      logit += Math.min(3.5, (txn10m - 1) * 0.45 * this.WEIGHTS.velocity10m);
    }
    // Rapid repeat
    if (secSincePrev < 120) {
      logit += Math.min(2.0, (1 - secSincePrev / 120) * 1.5 * this.WEIGHTS.rapidRepeat);
    }
    // Thin history
    if (userTxnIndex < 8) {
      logit += (8 - userTxnIndex) * 0.15;
    }

    const modelProb = 1 / (1 + Math.exp(-logit));
    const modelProbPct = Math.round(modelProb * 1000) / 10;

    // 2. Compute Transparent Explanatory Points Breakdown
    const reasons: RiskReason[] = [];

    // Reason A: Model pattern similarity
    // In notebook, e.g. 95.0% probability maps to +57.0 points (points = prob * 60)
    const modelPoints = Math.round((modelProb * 60) * 10) / 10;
    reasons.push({
      points: modelPoints,
      signal: "Model pattern similarity",
      detail: `The model rates this transaction ${modelProbPct}% similar to known fraudulent behaviour.`,
      severity: modelProb >= 0.8 ? 'CRITICAL' : modelProb >= 0.5 ? 'HIGH' : 'MEDIUM'
    });

    // Reason B: Amount anomaly
    if (amountRatio >= 2.5) {
      const amtPoints = Math.round(Math.min(15, 4.0 + Math.log2(amountRatio) * 1.0) * 10) / 10;
      reasons.push({
        points: amtPoints,
        signal: "Unusually high amount",
        detail: `₹${amount.toLocaleString()} is about ${amountRatio.toFixed(1)}x this customer's usual transaction size (avg ₹${Math.round(meanAmount).toLocaleString()}).`,
        severity: amountRatio > 10 ? 'HIGH' : 'MEDIUM'
      });
    } else if (amountRatio <= 0.05 && amount > 10) {
      reasons.push({
        points: 1.5,
        signal: "Micro-transaction testing",
        detail: `Amount ₹${amount} is unusually low compared to customer baseline.`,
        severity: 'INFO'
      });
    }

    // Reason C: Velocity burst
    if (txn10m >= 3) {
      const velPoints = Math.round(Math.min(12, 3.0 + (txn10m - 2) * 0.92) * 10) / 10;
      reasons.push({
        points: velPoints,
        signal: "High transaction velocity",
        detail: `${txn10m} transactions from this account within 10 minutes.`,
        severity: txn10m >= 5 ? 'HIGH' : 'MEDIUM'
      });
    }

    // Reason D: New Device
    if (isNewDevice === 1) {
      reasons.push({
        points: 6.3,
        signal: "New device",
        detail: `The transaction came from a device ("${input.device_id}") never used by this customer before.`,
        severity: 'HIGH'
      });
    }

    // Reason E: Location Deviation
    if (isNewLocation === 1) {
      reasons.push({
        points: 6.3,
        signal: "Location deviation",
        detail: `Transaction originates from ${input.location}, outside the customer's usual locations (${profile.known_locations.slice(0, 3).join(', ')}).`,
        severity: 'MEDIUM'
      });
    }

    // Reason F: Unusual Hour / Night Window
    if (isNight === 1) {
      reasons.push({
        points: 5.1,
        signal: "Unusual transaction time",
        detail: `Executed at ${String(hour).padStart(2, '0')}:00, inside the customer's normal inactive window.`,
        severity: 'MEDIUM'
      });
    }

    // Reason G: Rapid Repeat
    if (secSincePrev < 90) {
      reasons.push({
        points: 3.2,
        signal: "Rapid repeat transaction",
        detail: `Only ${secSincePrev}s since the previous transaction.`,
        severity: 'LOW'
      });
    }

    // Reason H: Thin Customer History
    if (userTxnIndex < 10) {
      reasons.push({
        points: 2.5,
        signal: "Thin customer history",
        detail: `Very little past activity (${userTxnIndex} historical transactions), so behavioural baselines are weak.`,
        severity: 'LOW'
      });
    }

    // Total Score calculation (sum of all reason points)
    const rawTotal = reasons.reduce((acc, r) => acc + r.points, 0);
    const riskScore = Math.min(100, Math.max(1, Math.round(rawTotal)));

    // Categorization
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    let action: 'APPROVE' | 'STEP_UP_2FA' | 'HOLD_FOR_REVIEW';
    let actionLabel: string;

    if (riskScore >= 75) {
      riskLevel = 'HIGH';
      action = 'HOLD_FOR_REVIEW';
      actionLabel = 'Hold for additional verification and route to a fraud analyst.';
    } else if (riskScore >= 40) {
      riskLevel = 'MEDIUM';
      action = 'STEP_UP_2FA';
      actionLabel = 'Challenge user with biometric / step-up OTP authentication.';
    } else {
      riskLevel = 'LOW';
      action = 'APPROVE';
      actionLabel = 'Auto-approve transaction seamlessly.';
    }

    // Synthesize structured human summary matching notebook
    const flaggedSignals = reasons
      .filter(r => r.signal !== "Model pattern similarity")
      .map(r => r.signal.toLowerCase());
    
    let summary: string;
    if (flaggedSignals.length > 0) {
      summary = `Risk ${riskScore}/100 (${riskLevel}). Flagged because of ${flaggedSignals.join('; ')}. Recommended action: ${actionLabel}`;
    } else {
      summary = `Risk ${riskScore}/100 (${riskLevel}). Nominal transaction conforming to customer baseline. Recommended action: ${actionLabel}`;
    }

    return {
      riskScore,
      riskLevel,
      modelProbability: Math.round(modelProb * 10000) / 10000,
      summary,
      action,
      actionLabel,
      reasons,
      features: {
        log_amount: Number(logAmount.toFixed(4)),
        amount_ratio: Number(amountRatio.toFixed(4)),
        amount_zscore: Number(amountZscore.toFixed(4)),
        hour,
        is_night: isNight,
        seconds_since_prev: secSincePrev,
        txn_count_10min: txn10m,
        txn_count_1h: txn1h,
        is_new_device: isNewDevice,
        is_new_location: isNewLocation,
        user_txn_index: userTxnIndex
      },
      userProfile: profile
    };
  }
}
