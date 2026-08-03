import type { HomeItem } from '../types';
import { HomeSelector } from '../components/HomeSelector';
import { OverviewChart } from '../components/OverviewChart';
import { ExpiringSoon } from '../components/ExpiringSoon';

interface DashboardScreenProps {
  homes: HomeItem[];
  selectedHomeId: number | null;
  onSelectHome: (homeId: number) => void;
  userName: string;
}

export const DashboardScreen = ({ homes, selectedHomeId, onSelectHome, userName }: DashboardScreenProps) => {
  const selectedHome = homes.find((h) => h.id === selectedHomeId);
  const products = selectedHome?.products || [];

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = userName.split(' ')[0] || 'User';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Greeting */}
      <div style={{ marginBottom: '4px' }}>
        <h2 style={{ color: 'var(--st-text-primary, #F8FAFC)', fontSize: '1.25rem', fontWeight: 600, margin: '0 0 4px' }}>
          {getGreeting()}, {firstName} 👋
        </h2>
        <p style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '13px', margin: 0 }}>
          Here's your stock summary
        </p>
      </div>

      {/* Home Selector */}
      <HomeSelector homes={homes} selectedHomeId={selectedHomeId} onSelectHome={onSelectHome} />

      {/* Overview Chart */}
      {selectedHome ? (
        <>
          <OverviewChart products={products} />
          <ExpiringSoon products={products} />
        </>
      ) : (
        <div
          style={{
            background: 'var(--st-bg-card, #1E293B)',
            borderRadius: '12px',
            padding: '32px 16px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>🏠</span>
          <p style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '14px', margin: 0 }}>
            {homes.length === 0
              ? 'Add a home to start tracking your stock'
              : 'Select a home to view your dashboard'}
          </p>
        </div>
      )}
    </div>
  );
};
