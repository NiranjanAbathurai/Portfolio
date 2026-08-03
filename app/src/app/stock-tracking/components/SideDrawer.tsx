import type { HomeItem } from '../types';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  homes: HomeItem[];
  selectedHomeId: number | null;
  onSelectHome: (homeId: number) => void;
}

export const SideDrawer = ({ isOpen, onClose, homes, selectedHomeId, onSelectHome }: SideDrawerProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9998,
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'min(280px, 80vw)',
          background: 'var(--st-bg-primary, #0F172A)',
          borderRight: '1px solid var(--st-border-color, #334155)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInLeft 0.25s ease-out',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 16px',
            borderBottom: '1px solid var(--st-border-color, #334155)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--st-accent-green, #22C55E)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#fff',
                fontSize: '14px',
              }}
            >
              ST
            </div>
            <span style={{ color: 'var(--st-text-primary, #F8FAFC)', fontWeight: 600, fontSize: '1rem' }}>
              Stock Tracker
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--st-text-secondary, #94A3B8)',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>

        {/* Homes List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          <p style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '0 16px', margin: '0 0 8px' }}>
            Your Homes
          </p>
          {homes.length === 0 ? (
            <p style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '13px', padding: '8px 16px' }}>
              No homes added yet.
            </p>
          ) : (
            homes.map((home) => (
              <button
                key={home.id}
                type="button"
                onClick={() => {
                  onSelectHome(home.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 16px',
                  background: selectedHomeId === home.id ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                  border: 'none',
                  borderLeft: selectedHomeId === home.id ? '3px solid var(--st-accent-green, #22C55E)' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease',
                }}
              >
                <span style={{ fontSize: '16px' }}>🏠</span>
                <span style={{
                  color: selectedHomeId === home.id ? 'var(--st-accent-green, #22C55E)' : 'var(--st-text-primary, #F8FAFC)',
                  fontSize: '14px',
                  fontWeight: selectedHomeId === home.id ? 600 : 400,
                }}>
                  {home.name}
                </span>
                <span style={{ marginLeft: 'auto', color: 'var(--st-text-secondary, #94A3B8)', fontSize: '12px' }}>
                  {home.products.length} items
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--st-border-color, #334155)' }}>
          <a
            href="https://my-stock-tracker-app.netlify.app/?install=true"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            📲 Download Full App
          </a>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};
