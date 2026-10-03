import React from 'react';
import { UserFraudNotification } from '../types/notification';
import { NotificationCenterDropdown } from './FraudNotification';

export type ActiveTab = 'overview' | 'monitor' | 'alerts' | 'model';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unreadNotificationsCount?: number;
  isNotificationOpen?: boolean;
  onToggleNotification?: () => void;
  onCloseNotification?: () => void;
  notifications?: UserFraudNotification[];
  onSelectNotification?: (notif: UserFraudNotification) => void;
  onMarkAllRead?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unreadNotificationsCount = 0,
  isNotificationOpen = false,
  onToggleNotification,
  onCloseNotification,
  notifications = [],
  onSelectNotification,
  onMarkAllRead
}) => {
  return (
    <header className="border-b border-[#1b1f27] bg-[#101318] sticky top-0 z-40 select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
        {/* Brand & Clean Nav */}
        <div className="flex items-center gap-8 sm:gap-14">
          <button
            onClick={() => setActiveTab('overview')}
            className="text-xs font-semibold tracking-widest text-[#f3f4f6] hover:text-white uppercase transition-colors cursor-pointer"
          >
            FRAUDSCOPE
          </button>

          <nav className="flex items-center gap-6 sm:gap-8 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === 'overview' ? 'text-[#f3f4f6] font-medium' : 'text-[#8b92a0] hover:text-[#d1d5db]'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab('monitor')}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === 'monitor' ? 'text-[#f3f4f6] font-medium' : 'text-[#8b92a0] hover:text-[#d1d5db]'
              }`}
            >
              Monitor
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === 'alerts' ? 'text-[#f3f4f6] font-medium' : 'text-[#8b92a0] hover:text-[#d1d5db]'
              }`}
            >
              Alerts
            </button>

            <button
              onClick={() => setActiveTab('model')}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === 'model' ? 'text-[#f3f4f6] font-medium' : 'text-[#8b92a0] hover:text-[#d1d5db]'
              }`}
            >
              Model
            </button>
          </nav>
        </div>

        {/* Minimal Notifications Button */}
        <div className="relative">
          <button
            onClick={onToggleNotification}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#8b92a0] hover:text-[#e5e7eb] transition-colors py-1 cursor-pointer"
            aria-label="Notifications"
          >
            <span 
              className={`w-1.5 h-1.5 rounded-full inline-block ${
                unreadNotificationsCount > 0 ? 'bg-rose-500' : 'bg-[#4b5563]'
              }`} 
            />
            <span className="hidden sm:inline">Notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="text-[10px] text-[#9ca3af] font-mono">({unreadNotificationsCount})</span>
            )}
          </button>

          {isNotificationOpen && (
            <NotificationCenterDropdown
              notifications={notifications}
              isOpen={isNotificationOpen}
              onClose={onCloseNotification || (() => {})}
              onSelectNotification={(n) => {
                if (onSelectNotification) onSelectNotification(n);
                if (onCloseNotification) onCloseNotification();
              }}
              onMarkAllRead={onMarkAllRead || (() => {})}
            />
          )}
        </div>
      </div>
    </header>
  );
};
