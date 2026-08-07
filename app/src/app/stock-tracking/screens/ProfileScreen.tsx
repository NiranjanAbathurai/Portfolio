import { useState } from 'react';
import type { HomeItem } from '../types';
import { InfoDialog } from '../../shared/ui/ConfirmDialog';

interface ProfileScreenProps {
  userName: string;
  userEmail: string;
  homes: HomeItem[];
  onLogout: () => void;
  onAddHome: (name: string) => void;
  onDeleteHome: (homeId: number) => void;
}

export const ProfileScreen = ({ userName, userEmail, homes, onLogout, onAddHome, onDeleteHome }: ProfileScreenProps) => {
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showAddHome, setShowAddHome] = useState(false);
  const [newHomeName, setNewHomeName] = useState('');

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const handleAddHome = () => {
    const trimmed = newHomeName.trim();
    if (!trimmed) return;
    onAddHome(trimmed);
    setNewHomeName('');
    setShowAddHome(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Avatar + User Info */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '20px 0',
      }}>
        {/* Avatar */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.2)',
          border: '3px solid var(--st-accent-green, #22C55E)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--st-accent-green, #22C55E)',
        }}>
          {initials}
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--st-text-primary, #F8FAFC)', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 4px' }}>
            {userName}
          </h2>
          <p style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '13px', margin: 0 }}>
            {userEmail}
          </p>
        </div>
      </div>

      {/* My Homes Section */}
      <div style={{
        background: 'var(--st-bg-card, #1E293B)',
        borderRadius: '12px',
        padding: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ color: 'var(--st-text-primary, #F8FAFC)', fontSize: '14px', fontWeight: 600, margin: 0 }}>
            🏠 My Homes
          </h3>
          <button
            type="button"
            onClick={() => setShowAddHome(true)}
            style={{
              background: 'var(--st-accent-green, #22C55E)',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 10px',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Add
          </button>
        </div>

        {homes.length === 0 ? (
          <p style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '13px', margin: 0 }}>
            No homes added yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {homes.map((home) => (
              <div
                key={home.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: 'var(--st-bg-input, #334155)',
                  borderRadius: '8px',
                }}
              >
                <span style={{ color: 'var(--st-text-primary, #F8FAFC)', fontSize: '13px' }}>
                  🏠 {home.name}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '11px' }}>
                    {home.products.length} items
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${home.name}" and all its products?`)) {
                        onDeleteHome(home.id);
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--st-accent-red, #EF4444)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '2px',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Home Form */}
        {showAddHome && (
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newHomeName}
              onChange={(e) => setNewHomeName(e.target.value)}
              placeholder="Home name"
              onKeyDown={(e) => e.key === 'Enter' && handleAddHome()}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid var(--st-border-color, #334155)',
                background: 'var(--st-bg-input, #334155)',
                color: 'var(--st-text-primary, #F8FAFC)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={handleAddHome}
              style={{
                background: 'var(--st-accent-green, #22C55E)',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => { setShowAddHome(false); setNewHomeName(''); }}
              style={{
                background: 'var(--st-bg-input, #334155)',
                border: '1px solid var(--st-border-color, #334155)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: 'var(--st-text-secondary, #94A3B8)',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Notifications (restricted) */}
      <div style={{
        background: 'var(--st-bg-card, #1E293B)',
        borderRadius: '12px',
        padding: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ color: 'var(--st-text-primary, #F8FAFC)', fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>
              🔔 Push Notifications
            </h3>
            <p style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '12px', margin: 0 }}>
              Get alerts when products expire
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNotificationDialog(true)}
            style={{
              width: '44px',
              height: '24px',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--st-bg-input, #334155)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s ease',
            }}
          >
            <span style={{
              position: 'absolute',
              top: '3px',
              left: '3px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: 'var(--st-text-secondary, #94A3B8)',
              transition: 'transform 0.2s ease',
            }} />
          </button>
        </div>
        <p style={{ color: '#f59e0b', fontSize: '11px', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
          🔒 Available in the downloaded app only
        </p>
      </div>

      {/* Download App CTA */}
      <a
        href="https://stock-tracker-app-ai.netlify.app/?install=true"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          borderRadius: '12px',
          padding: '14px',
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
        }}
      >
        📲 Download Full App (PWA)
      </a>

      {/* Logout */}
      <button
        type="button"
        onClick={onLogout}
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '12px',
          color: 'var(--st-accent-red, #EF4444)',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        ⏻ Log Out
      </button>

      {/* Notification Restricted Dialog */}
      <InfoDialog
        open={showNotificationDialog}
        title="Push Notifications - App Only"
        message="Download the Stock Tracker app to receive push notifications when your products are about to expire."
        buttonText="Close"
        onClose={() => setShowNotificationDialog(false)}
        linkUrl="https://stock-tracker-app-ai.netlify.app/?install=true"
        linkText="📲 Download App"
      />
    </div>
  );
};
