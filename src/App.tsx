/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { Overview } from './components/Overview';
import { LiveMonitor } from './components/LiveMonitor';
import { AlertsList } from './components/AlertsList';
import { ModelView } from './components/ModelView';
import { TransactionInspectModal } from './components/TransactionInspectModal';
import { SubtleFraudNotification } from './components/FraudNotification';
import { INITIAL_ALERTS, AlertQueueItem } from './data/mockLiveTransactions';
import { USER_PROFILES, getUserProfile } from './data/userProfiles';
import { FraudScopeEngine, ScoreResult, TransactionInput } from './services/riskEngine';
import { UserFraudNotification, formatHourToAmPm } from './types/notification';

// Preloaded demo scenario (₹85,000, 02:00 AM, Delhi, unknown-device-882)
const initialDemoScore = FraudScopeEngine.score({
  userId: "U00372",
  amount: 85000,
  hour: 2,
  location: "Delhi",
  device_id: "unknown-device-882",
  txn_count_10min: 7,
  seconds_since_prev: 45
});

const INITIAL_NOTIFICATIONS: UserFraudNotification[] = [
  {
    id: "NOTIF-ATO-85K",
    transactionId: "TXN-90218",
    userId: "U00372",
    userName: "Aarav Sharma",
    amount: 85000,
    hour: 2,
    timeFormatted: "02:00 AM",
    location: "Delhi",
    device: "unknown-device-882",
    riskScore: initialDemoScore.riskScore,
    riskLevel: initialDemoScore.riskLevel,
    modelProbability: initialDemoScore.modelProbability,
    message: "This transaction differs significantly from the customer's normal behavior.",
    reasons: initialDemoScore.reasons,
    read: false,
    timestamp: "2 mins ago",
    userResponse: 'PENDING'
  },
  {
    id: "NOTIF-DUBAI-185K",
    transactionId: "TXN-90216",
    userId: "U00566",
    userName: "Vikram Malhotra",
    amount: 185000,
    hour: 3,
    timeFormatted: "03:00 AM",
    location: "Dubai",
    device: "unk-9941",
    riskScore: 98,
    riskLevel: 'HIGH',
    modelProbability: 0.965,
    message: "Foreign location jump with newly spoofed device.",
    reasons: [
      { points: 58.0, signal: "Model pattern similarity", detail: "96.5% pattern match", severity: "CRITICAL" },
      { points: 14.5, signal: "Unusually high amount", detail: "31.2x usual spend", severity: "HIGH" },
      { points: 6.3, signal: "Location deviation", detail: "Dubai", severity: "HIGH" },
      { points: 6.3, signal: "New device", detail: "unk-9941", severity: "HIGH" }
    ],
    read: true,
    timestamp: "12 mins ago",
    userResponse: 'PENDING'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [alerts, setAlerts] = useState<AlertQueueItem[]>(INITIAL_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<AlertQueueItem | null>(null);
  const [presetUserId, setPresetUserId] = useState<string | undefined>(undefined);

  // User fraud notifications
  const [notifications, setNotifications] = useState<UserFraudNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeNotification, setActiveNotification] = useState<UserFraudNotification | null>(INITIAL_NOTIFICATIONS[0]);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger notification from LiveMonitor
  const handleTriggerUserNotification = (input: TransactionInput, result: ScoreResult) => {
    if (result.riskLevel === 'LOW') return;

    const user = getUserProfile(input.userId);
    const timeFormatted = formatHourToAmPm(input.hour);
    const txnId = `TXN-${Math.floor(Math.random() * 89999 + 10000)}`;
    const notifId = `NOTIF-${Date.now()}`;

    const newNotif: UserFraudNotification = {
      id: notifId,
      transactionId: txnId,
      userId: input.userId,
      userName: user.name,
      amount: input.amount,
      hour: input.hour,
      timeFormatted,
      location: input.location,
      device: input.device_id,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      modelProbability: result.modelProbability,
      message: "This transaction differs significantly from the customer's normal behavior.",
      reasons: result.reasons,
      read: false,
      timestamp: "Just now",
      userResponse: 'PENDING'
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActiveNotification(newNotif);

    // Keep alert queue updated
    const newAlert: AlertQueueItem = {
      id: txnId,
      timestamp: "Just now",
      userId: input.userId,
      userName: user.name,
      amount: input.amount,
      location: input.location,
      device_id: input.device_id,
      hour: input.hour,
      txn_count_10min: input.txn_count_10min,
      seconds_since_prev: input.seconds_since_prev,
      status: result.riskLevel === 'HIGH' ? 'PENDING_REVIEW' : 'APPROVED',
      scoreResult: result
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  // User response: "Yes, This Was Me"
  const handleConfirmMe = (notifId: string) => {
    let affectedTxnId: string | undefined;

    setNotifications(prev => prev.map(n => {
      if (n.id === notifId) {
        affectedTxnId = n.transactionId;
        return { ...n, userResponse: 'CONFIRMED_LEGITIMATE', read: true };
      }
      return n;
    }));

    if (affectedTxnId) {
      setAlerts(prev => prev.map(a => 
        a.id === affectedTxnId ? { ...a, status: 'APPROVED' } : a
      ));
    }

    if (activeNotification?.id === notifId) {
      setActiveNotification(null);
    }

    setToastMessage("Transaction confirmed as authorized.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // User response: "No, Report Fraud"
  const handleReportFraud = (notifId: string) => {
    let targetNotif: UserFraudNotification | undefined = notifications.find(n => n.id === notifId) || activeNotification || undefined;

    setNotifications(prev => prev.map(n => {
      if (n.id === notifId) {
        targetNotif = n;
        return { ...n, userResponse: 'REPORTED_FRAUD', read: true };
      }
      return n;
    }));

    if (targetNotif) {
      const txnId = targetNotif.transactionId;
      setAlerts(prev => {
        const exists = prev.some(a => a.id === txnId);
        if (exists) {
          return prev.map(a => a.id === txnId ? { ...a, status: 'CONFIRMED_FRAUD' } : a);
        } else {
          const res = FraudScopeEngine.score({
            userId: targetNotif!.userId,
            amount: targetNotif!.amount,
            hour: targetNotif!.hour,
            location: targetNotif!.location,
            device_id: targetNotif!.device,
            txn_count_10min: 7,
            seconds_since_prev: 45
          });
          const newAlert: AlertQueueItem = {
            id: txnId,
            timestamp: "Just now",
            userId: targetNotif!.userId,
            userName: targetNotif!.userName,
            amount: targetNotif!.amount,
            location: targetNotif!.location,
            device_id: targetNotif!.device,
            hour: targetNotif!.hour,
            txn_count_10min: 7,
            seconds_since_prev: 45,
            status: 'CONFIRMED_FRAUD',
            scoreResult: res
          };
          return [newAlert, ...prev];
        }
      });
    }

    if (activeNotification?.id === notifId) {
      setActiveNotification(null);
    }

    // Required confirmation message: "Fraud reported. Your transaction has been sent for review."
    setToastMessage("Fraud reported. Your transaction has been sent for review.");
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Actions from LiveMonitor
  const handleConfirmFraud = (txn: TransactionInput, result: ScoreResult) => {
    const txnId = `TXN-${Math.floor(Math.random() * 89999 + 10000)}`;
    const user = getUserProfile(txn.userId);

    const newAlert: AlertQueueItem = {
      id: txnId,
      timestamp: "Just now",
      userId: txn.userId,
      userName: user.name,
      amount: txn.amount,
      location: txn.location,
      device_id: txn.device_id,
      hour: txn.hour,
      txn_count_10min: txn.txn_count_10min,
      seconds_since_prev: txn.seconds_since_prev,
      status: 'CONFIRMED_FRAUD',
      scoreResult: result
    };

    setAlerts(prev => [newAlert, ...prev]);
    setActiveNotification(null);
    setToastMessage("Transaction confirmed as fraud.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = (txn: TransactionInput, result: ScoreResult) => {
    const txnId = `TXN-${Math.floor(Math.random() * 89999 + 10000)}`;
    const user = getUserProfile(txn.userId);

    const newAlert: AlertQueueItem = {
      id: txnId,
      timestamp: "Just now",
      userId: txn.userId,
      userName: user.name,
      amount: txn.amount,
      location: txn.location,
      device_id: txn.device_id,
      hour: txn.hour,
      txn_count_10min: txn.txn_count_10min,
      seconds_since_prev: txn.seconds_since_prev,
      status: 'APPROVED',
      scoreResult: result
    };

    setAlerts(prev => [newAlert, ...prev]);
    setActiveNotification(null);
    setToastMessage("Transaction approved.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateStatus = (alertId: string, newStatus: AlertQueueItem['status']) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
    setToastMessage("Feedback recorded for future model improvement.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectNotification = (notif: UserFraudNotification) => {
    setPresetUserId(notif.userId);
    setActiveTab('monitor');
    setActiveNotification(null);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const unresolvedHighRiskCount = alerts.filter(a => a.scoreResult.riskLevel === 'HIGH' && a.status === 'PENDING_REVIEW').length;

  return (
    <div 
      className="min-h-screen bg-[#0e1013] text-[#ededf0] font-sans flex flex-col antialiased selection:bg-zinc-800 selection:text-zinc-200"
      onClick={() => setIsNotificationCenterOpen(false)}
    >
      {/* Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadNotificationsCount={unreadCount}
        isNotificationOpen={isNotificationCenterOpen}
        onToggleNotification={() => setIsNotificationCenterOpen(prev => !prev)}
        onCloseNotification={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onSelectNotification={handleSelectNotification}
        onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
      />

      {/* Main Viewport */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <Overview
            alerts={alerts}
            unresolvedHighRiskCount={unresolvedHighRiskCount}
            onOpenMonitor={() => setActiveTab('monitor')}
            onSelectAlert={(a) => setSelectedAlert(a)}
          />
        )}

        {activeTab === 'monitor' && (
          <LiveMonitor
            onConfirmFraud={handleConfirmFraud}
            onApprove={handleApprove}
            presetUserId={presetUserId}
            onTriggerNotification={handleTriggerUserNotification}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsList
            alerts={alerts}
            onSelectAlert={(a) => setSelectedAlert(a)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeTab === 'model' && (
          <ModelView />
        )}
      </main>

      {/* Detailed Transaction Inspector Modal */}
      <TransactionInspectModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onUpdateStatus={handleUpdateStatus}
        onOpenInSimulator={(uid) => {
          setPresetUserId(uid);
          setActiveTab('monitor');
        }}
      />

      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-[#12151b] border border-[#222731] rounded px-3.5 py-2 text-xs font-mono text-[#d1d5db] shadow-xl animate-in fade-in duration-100">
          {toastMessage}
        </div>
      )}

      {/* Subtle Fraud Notification (Small, bottom-right, non-intrusive) */}
      <SubtleFraudNotification
        notification={activeNotification}
        onConfirmMe={handleConfirmMe}
        onReportFraud={handleReportFraud}
        onDismiss={() => setActiveNotification(null)}
      />
    </div>
  );
}
