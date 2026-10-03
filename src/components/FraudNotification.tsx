import React from 'react';
import { X } from 'lucide-react';
import { UserFraudNotification } from '../types/notification';

interface SubtleFraudNotificationProps {
  notification: UserFraudNotification | null;
  onConfirmMe: (id: string) => void;
  onReportFraud: (id: string) => void;
  onDismiss: () => void;
}

export const SubtleFraudNotification: React.FC<SubtleFraudNotificationProps> = ({
  notification,
  onConfirmMe,
  onReportFraud,
  onDismiss
}) => {
  if (!notification || notification.userResponse !== 'PENDING') return null;

  const isHigh = notification.riskLevel === 'HIGH';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs w-full px-2 sm:px-0">
      {/* Dark surface with thin border, small and elegant */}
      <div className="bg-[#12151b] border border-[#222731] rounded p-4 shadow-2xl space-y-3 font-mono text-xs text-left">
        {/* Header */}
        <div className="flex items-center justify-between text-[11px] tracking-wider uppercase text-[#8b92a0] border-b border-[#1b1f27] pb-2">
          <span>{isHigh ? 'Suspicious transaction detected' : 'Security verification'}</span>
          <button
            onClick={onDismiss}
            className="text-[#6b7280] hover:text-[#9ca3af] transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Transaction Info */}
        <div className="space-y-1">
          <div className="text-xl font-medium text-[#f3f4f6]">
            ₹{notification.amount.toLocaleString()}
          </div>
          <div className="text-[#8b92a0] text-[11px]">
            {notification.userId} · {notification.location} · {notification.timeFormatted}
          </div>
          <div className="text-[11px] pt-0.5">
            Risk: <span className="text-[#ededf0]">{notification.riskScore}/100</span> —{' '}
            <span className={`font-semibold ${isHigh ? 'text-rose-400' : 'text-amber-400'}`}>
              {notification.riskLevel}
            </span>
          </div>
        </div>

        {/* Prompt */}
        <div className="text-[#d1d5db] text-xs font-sans py-0.5">
          "Was this transaction made by you?"
        </div>

        {/* Action Buttons: [ Yes, This Was Me ]  [ No, Report Fraud ] */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#1b1f27]">
          <button
            onClick={() => onConfirmMe(notification.id)}
            className="flex-1 py-1.5 px-2 bg-[#171b22] hover:bg-[#1f242d] text-[#e5e7eb] border border-[#232833] rounded text-[11px] font-sans transition-colors cursor-pointer text-center"
          >
            Yes, This Was Me
          </button>
          <button
            onClick={() => onReportFraud(notification.id)}
            className="flex-1 py-1.5 px-2 bg-[#1c1417] hover:bg-[#27181d] text-rose-300 border border-rose-900/40 rounded text-[11px] font-sans transition-colors cursor-pointer text-center"
          >
            No, Report Fraud
          </button>
        </div>
      </div>
    </div>
  );
};

interface NotificationCenterDropdownProps {
  notifications: UserFraudNotification[];
  isOpen: boolean;
  onClose: () => void;
  onSelectNotification: (notif: UserFraudNotification) => void;
  onMarkAllRead: () => void;
}

export const NotificationCenterDropdown: React.FC<NotificationCenterDropdownProps> = ({
  notifications,
  isOpen,
  onClose,
  onSelectNotification,
  onMarkAllRead
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-80 bg-[#12151b] border border-[#222731] rounded shadow-2xl z-50 overflow-hidden font-mono text-xs text-left"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 bg-[#0e1014] border-b border-[#1b1f27] flex items-center justify-between text-[11px]">
        <span className="text-[#8b92a0] uppercase tracking-wider">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </span>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-[#6b7280] hover:text-[#9ca3af] transition-colors cursor-pointer"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-[#171b22]">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-[#6b7280] text-xs">
            No notifications.
          </div>
        ) : (
          notifications.map((n) => {
            const isHigh = n.riskLevel === 'HIGH';
            const isMed = n.riskLevel === 'MEDIUM';

            return (
              <div
                key={n.id}
                onClick={() => {
                  onSelectNotification(n);
                  onClose();
                }}
                className={`p-3 hover:bg-[#161a21] cursor-pointer transition-colors space-y-1 ${
                  !n.read ? 'bg-[#151922]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold ${
                      isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {n.riskLevel}
                    </span>
                    <span className="font-medium text-[#ededf0]">
                      ₹{n.amount.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#6b7280]">
                    {n.timeFormatted}
                  </span>
                </div>

                <div className="text-[11px] text-[#8b92a0] font-sans truncate">
                  {n.userId} · {n.location}
                </div>

                {n.userResponse !== 'PENDING' && (
                  <div className="text-[10px] text-[#6b7280]">
                    Status: <span className={n.userResponse === 'REPORTED_FRAUD' ? 'text-rose-400' : 'text-emerald-400'}>
                      {n.userResponse === 'REPORTED_FRAUD' ? 'Reported Fraud' : 'Verified Legitimate'}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
