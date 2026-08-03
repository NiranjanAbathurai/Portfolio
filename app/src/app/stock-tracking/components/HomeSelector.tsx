import type { HomeItem } from '../types';

interface HomeSelectorProps {
  homes: HomeItem[];
  selectedHomeId: number | null;
  onSelectHome: (homeId: number) => void;
}

export const HomeSelector = ({ homes, selectedHomeId, onSelectHome }: HomeSelectorProps) => {
  if (homes.length === 0) return null;

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '12px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>
        Active Home
      </label>
      <select
        value={selectedHomeId ?? ''}
        onChange={(e) => onSelectHome(Number(e.target.value))}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid var(--st-border-color, #334155)',
          background: 'var(--st-bg-input, #334155)',
          color: 'var(--st-text-primary, #F8FAFC)',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
      >
        {homes.map((home) => (
          <option key={home.id} value={home.id}>
            🏠 {home.name} ({home.products.length} items)
          </option>
        ))}
      </select>
    </div>
  );
};
