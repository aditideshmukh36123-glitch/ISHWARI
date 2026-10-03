import { RiskReason, ScoreResult } from '../services/riskEngine';

export type UserNotificationResponse = 'PENDING' | 'CONFIRMED_LEGITIMATE' | 'REPORTED_FRAUD';

export interface UserFraudNotification {
  id: string;
  transactionId: string;
  userId: string;
  userName: string;
  amount: number;
  hour: number;
  timeFormatted: string; // e.g. "02:00 AM"
  location: string;
  device: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  modelProbability: number;
  message: string;
  reasons: RiskReason[];
  read: boolean;
  timestamp: string;
  userResponse: UserNotificationResponse;
}

export function formatHourToAmPm(hour: number): string {
  const normalized = Math.max(0, Math.min(23, hour));
  const period = normalized >= 12 ? 'PM' : 'AM';
  const displayHour = normalized % 12 === 0 ? 12 : normalized % 12;
  return `${String(displayHour).padStart(2, '0')}:00 ${period}`;
}

export function getUserFriendlySignal(signal: string): string {
  switch (signal) {
    case 'Unusually high amount':
      return 'Transaction amount is unusually high';
    case 'New device':
      return 'New device detected';
    case 'Unusual transaction time':
      return 'Transaction occurred during unusual hours';
    case 'High transaction velocity':
      return 'High transaction velocity';
    case 'Location deviation':
      return 'Transaction occurred in an unverified location';
    case 'Rapid repeat transaction':
      return 'Rapid successive transactions';
    case 'Thin customer history':
      return 'Limited account baseline history';
    default:
      return signal;
  }
}
