import type { Product } from '../types';

interface ExpiringSoonProps {
  products: Product[];
}

export const ExpiringSoon = ({ products }: ExpiringSoonProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const expiringProducts = products
    .filter((p) => {
      if (!p.expiryDate || p.availability === 'No') return false;
      const expiry = new Date(p.expiryDate);
      return expiry >= today && expiry <= sevenDaysFromNow;
    })
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

  const expiredProducts = products.filter((p) => {
    if (!p.expiryDate) return false;
    const expiry = new Date(p.expiryDate);
    return expiry < today;
  });

  if (expiringProducts.length === 0 && expiredProducts.length === 0) {
    return (
      <div
        style={{
          background: 'var(--st-bg-card, #1E293B)',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>✅</span>
        <p style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '13px', margin: 0 }}>
          No items expiring soon. You're all good!
        </p>
      </div>
    );
  }

  const getDaysUntilExpiry = (dateStr: string): number => {
    const expiry = new Date(dateStr);
    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div
      style={{
        background: 'var(--st-bg-card, #1E293B)',
        borderRadius: '12px',
        padding: '16px',
      }}
    >
      <h3 style={{ color: 'var(--st-text-primary, #F8FAFC)', fontSize: '14px', fontWeight: 600, margin: '0 0 12px' }}>
        ⏰ Expiring Soon
      </h3>

      {/* Expired items */}
      {expiredProducts.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <p style={{ color: 'var(--st-accent-red, #EF4444)', fontSize: '11px', fontWeight: 600, margin: '0 0 6px', textTransform: 'uppercase' }}>
            Already Expired ({expiredProducts.length})
          </p>
          {expiredProducts.slice(0, 3).map((p) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '6px',
                marginBottom: '4px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              <span style={{ color: 'var(--st-text-primary, #F8FAFC)', fontSize: '13px' }}>{p.product}</span>
              <span style={{ color: 'var(--st-accent-red, #EF4444)', fontSize: '11px', fontWeight: 500 }}>
                Expired {formatDate(p.expiryDate)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Expiring soon items */}
      {expiringProducts.length > 0 && (
        <div>
          <p style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 600, margin: '0 0 6px', textTransform: 'uppercase' }}>
            Expiring in 7 days ({expiringProducts.length})
          </p>
          {expiringProducts.slice(0, 5).map((p) => {
            const days = getDaysUntilExpiry(p.expiryDate);
            return (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: 'rgba(245, 158, 11, 0.08)',
                  borderRadius: '6px',
                  marginBottom: '4px',
                  border: '1px solid rgba(245, 158, 11, 0.15)',
                }}
              >
                <span style={{ color: 'var(--st-text-primary, #F8FAFC)', fontSize: '13px' }}>{p.product}</span>
                <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 500 }}>
                  {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days} days`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
