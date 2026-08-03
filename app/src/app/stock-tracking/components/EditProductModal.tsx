import { useState } from 'react';
import type { Product, CatalogCategory } from '../types';

interface EditProductModalProps {
  product: Product;
  catalog: CatalogCategory[];
  onSave: (productId: number, fields: Partial<Product>) => void;
  onClose: () => void;
}

export const EditProductModal = ({ product, catalog, onSave, onClose }: EditProductModalProps) => {
  const [stockType, setStockType] = useState(product.stockType);
  const [productName, setProductName] = useState(product.product);
  const [quantity, setQuantity] = useState(product.quantity);
  const [expiryDate, setExpiryDate] = useState(product.expiryDate);
  const [availability, setAvailability] = useState(product.availability);

  const handleSave = () => {
    onSave(product.id, {
      stockType,
      product: productName,
      quantity,
      expiryDate,
      availability,
    });
    onClose();
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid var(--st-border-color, #334155)',
    background: 'var(--st-bg-input, #334155)',
    color: 'var(--st-text-primary, #F8FAFC)',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    color: 'var(--st-text-secondary, #94A3B8)',
    fontSize: '12px',
    fontWeight: 500 as const,
    marginBottom: '4px',
    display: 'block' as const,
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20000,
        padding: '1rem',
        backdropFilter: 'blur(2px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--st-bg-primary, #0F172A)',
          border: '1px solid var(--st-border-color, #334155)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '380px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ color: 'var(--st-text-primary, #F8FAFC)', margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 600 }}>
          Edit Product
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={stockType}
              onChange={(e) => setStockType(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">Select category</option>
              {catalog.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Product Name */}
          <div>
            <label style={labelStyle}>Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Rice, Milk"
              style={inputStyle}
            />
          </div>

          {/* Quantity */}
          <div>
            <label style={labelStyle}>Quantity</label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 2 kg, 1 pack"
              style={inputStyle}
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label style={labelStyle}>Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Availability */}
          <div>
            <label style={labelStyle}>Availability</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['Yes', 'No'] as const).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAvailability(val)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: availability === val ? 'none' : '1px solid var(--st-border-color, #334155)',
                    background: availability === val
                      ? (val === 'Yes' ? 'var(--st-accent-green, #22C55E)' : 'var(--st-accent-red, #EF4444)')
                      : 'transparent',
                    color: availability === val ? '#fff' : 'var(--st-text-secondary, #94A3B8)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {val === 'Yes' ? '✓ In Stock' : '✗ Out'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid var(--st-border-color, #334155)',
              background: 'transparent',
              color: 'var(--st-text-secondary, #94A3B8)',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--st-accent-green, #22C55E)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
