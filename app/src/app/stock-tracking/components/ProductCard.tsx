import type { Product, AvailabilityStatus } from '../types';

interface ProductCardProps {
  product: Product;
  onStatusChange: (productId: number, status: AvailabilityStatus) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export const ProductCard = ({ product, onStatusChange, onEdit, onDelete }: ProductCardProps) => {
  const status: AvailabilityStatus = product.availability_status ||
    (product.availability === 'Yes' ? 'available' : product.availability === 'No' ? 'out_of_stock' : 'available');

  const getStatusBadge = () => {
    switch (status) {
      case 'available':
        return { text: 'In Stock', bg: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', border: 'rgba(34, 197, 94, 0.3)' };
      case 'low':
        return { text: 'Low', bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' };
      case 'out_of_stock':
        return { text: 'Out', bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' };
    }
  };

  const badge = getStatusBadge();

  const isExpiringSoon = (): boolean => {
    if (!product.expiryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(product.expiryDate);
    const diff = expiry.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 7;
  };

  return (
    <div
      style={{
        background: 'var(--st-bg-card, #1E293B)',
        borderRadius: '10px',
        padding: '12px 14px',
        border: `1px solid ${isExpiringSoon() ? 'rgba(245, 158, 11, 0.3)' : 'var(--st-border-color, #334155)'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Status indicator dot */}
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: badge.color,
          flexShrink: 0,
        }}
      />

      {/* Product Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ color: 'var(--st-text-primary, #F8FAFC)', fontSize: '14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.product || 'Unnamed'}
          </span>
          {isExpiringSoon() && (
            <span style={{ fontSize: '11px' }}>⏰</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {product.stockType && (
            <span style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '11px' }}>
              {product.stockType}
            </span>
          )}
          {product.quantity && (
            <span style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '11px' }}>
              • Qty: {product.quantity}
            </span>
          )}
          {product.expiryDate && (
            <span style={{ color: isExpiringSoon() ? '#f59e0b' : 'var(--st-text-secondary, #94A3B8)', fontSize: '11px' }}>
              • Exp: {new Date(product.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <span
        style={{
          padding: '3px 8px',
          borderRadius: '10px',
          background: badge.bg,
          color: badge.color,
          fontSize: '10px',
          fontWeight: 600,
          border: `1px solid ${badge.border}`,
          whiteSpace: 'nowrap',
          cursor: 'pointer',
        }}
        onClick={() => {
          // Cycle through statuses
          const next: AvailabilityStatus = status === 'available' ? 'out_of_stock' : 'available';
          onStatusChange(product.id, next);
        }}
        title="Click to toggle status"
      >
        {badge.text}
      </span>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => onEdit(product)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--st-text-secondary, #94A3B8)',
            fontSize: '14px',
          }}
          title="Edit"
        >
          ✏️
        </button>
        <button
          type="button"
          onClick={() => onDelete(product.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--st-text-secondary, #94A3B8)',
            fontSize: '14px',
          }}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
