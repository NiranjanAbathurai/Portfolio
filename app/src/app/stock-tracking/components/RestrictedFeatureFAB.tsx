import { useState } from 'react';
import { InfoDialog } from '../../shared/ui/ConfirmDialog';

export const RestrictedFeatureFAB = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {/* Mic FAB Button (restricted) */}
      <button
        type="button"
        onClick={() => setShowDialog(true)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          backgroundColor: 'var(--st-accent-green, #22C55E)',
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
          opacity: 0.8,
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
        title="Download the app for voice AI features"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
        {/* Lock badge */}
        <span style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#f59e0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          border: '2px solid var(--st-bg-primary, #0F172A)',
        }}>
          🔒
        </span>
      </button>

      {/* Download App Dialog */}
      <InfoDialog
        open={showDialog}
        title="AI Features Available in App"
        message="Download the Stock Tracker app to access AI-powered voice commands, bill scanning, and expiry notifications."
        buttonText="Close"
        onClose={() => setShowDialog(false)}
        linkUrl="https://my-stock-tracker-app.netlify.app/?install=true"
        linkText="📲 Download App"
      />
    </>
  );
};
