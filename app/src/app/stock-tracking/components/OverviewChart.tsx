import type { Product } from '../types';

interface OverviewChartProps {
  products: Product[];
}

export const OverviewChart = ({ products }: OverviewChartProps) => {
  const total = products.length;
  const available = products.filter(p => p.availability === 'Yes').length;
  const outOfStock = products.filter(p => p.availability === 'No').length;
  const unknown = total - available - outOfStock;

  const stats = [
    { label: 'Total', value: total, color: 'var(--st-text-primary, #F8FAFC)' },
    { label: 'In Stock', value: available, color: 'var(--st-accent-green, #22C55E)' },
    { label: 'Out', value: outOfStock, color: 'var(--st-accent-red, #EF4444)' },
    { label: 'Unchecked', value: unknown, color: '#f59e0b' },
  ];

  const maxVal = Math.max(total, 1);

  return (
    <div
      style={{
        background: 'var(--st-bg-card, #1E293B)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      <h3 style={{ color: 'var(--st-text-primary, #F8FAFC)', fontSize: '14px', fontWeight: 600, margin: '0 0 12px' }}>
        📊 Stock Overview
      </h3>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--st-text-secondary, #94A3B8)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          { label: 'In Stock', value: available, color: '#22C55E' },
          { label: 'Out of Stock', value: outOfStock, color: '#EF4444' },
          { label: 'Unchecked', value: unknown, color: '#f59e0b' },
        ].map((bar) => (
          <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--st-text-secondary, #94A3B8)', width: '70px', flexShrink: 0 }}>
              {bar.label}
            </span>
            <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'var(--st-bg-input, #334155)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(bar.value / maxVal) * 100}%`,
                  background: bar.color,
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--st-text-secondary, #94A3B8)', width: '20px', textAlign: 'right' }}>
              {bar.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
