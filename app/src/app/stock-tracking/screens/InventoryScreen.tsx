import { useState, useMemo } from 'react';
import type { HomeItem, Product, CatalogCategory, AvailabilityStatus } from '../types';
import { SearchBar } from '../components/SearchBar';
import { CategoryTabs } from '../components/CategoryTabs';
import { ProductCard } from '../components/ProductCard';
import { EditProductModal } from '../components/EditProductModal';
import { InfoDialog } from '../../shared/ui/ConfirmDialog';

interface InventoryScreenProps {
  homes: HomeItem[];
  selectedHomeId: number | null;
  catalog: CatalogCategory[];
  onUpdateProduct: (homeId: number, productId: number, fields: Partial<Product>) => void;
  onDeleteProduct: (homeId: number, productId: number) => void;
  onAddProduct: (homeId: number) => void;
}

export const InventoryScreen = ({
  homes,
  selectedHomeId,
  catalog,
  onUpdateProduct,
  onDeleteProduct,
  onAddProduct,
}: InventoryScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showBillScanDialog, setShowBillScanDialog] = useState(false);

  const selectedHome = homes.find((h) => h.id === selectedHomeId);
  const products = selectedHome?.products || [];

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.stockType && p.stockType.trim()) {
        cats.add(p.stockType.trim());
      }
    });
    return Array.from(cats).sort();
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = searchQuery === '' ||
        p.product.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' ||
        p.stockType.trim() === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  const handleStatusChange = (productId: number, status: AvailabilityStatus) => {
    if (!selectedHomeId) return;
    const availability = status === 'available' ? 'Yes' : 'No';
    onUpdateProduct(selectedHomeId, productId, { availability, availability_status: status });
  };

  const handleEditSave = (productId: number, fields: Partial<Product>) => {
    if (!selectedHomeId) return;
    onUpdateProduct(selectedHomeId, productId, fields);
  };

  const handleDelete = (productId: number) => {
    if (!selectedHomeId) return;
    if (window.confirm('Delete this product?')) {
      onDeleteProduct(selectedHomeId, productId);
    }
  };

  if (!selectedHome) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 16px' }}>
        <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>📦</span>
        <p style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '14px' }}>
          Select a home from the drawer to view inventory
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {/* Header with home name and actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h2 style={{ color: 'var(--st-text-primary, #F8FAFC)', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
          🏠 {selectedHome.name}
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Bill Scan Button (restricted) */}
          <button
            type="button"
            onClick={() => setShowBillScanDialog(true)}
            style={{
              background: 'var(--st-bg-card, #1E293B)',
              border: '1px solid var(--st-border-color, #334155)',
              borderRadius: '8px',
              padding: '6px 10px',
              color: 'var(--st-text-secondary, #94A3B8)',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              position: 'relative',
            }}
            title="Scan bill (App only)"
          >
            📷 Scan
            <span style={{ fontSize: '8px', position: 'absolute', top: '-4px', right: '-4px' }}>🔒</span>
          </button>

          {/* Add Product Button */}
          <button
            type="button"
            onClick={() => onAddProduct(selectedHome.id)}
            style={{
              background: 'var(--st-accent-green, #22C55E)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            + Add
          </button>
        </div>
      </div>

      {/* Search */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Category Tabs */}
      {categories.length > 0 && (
        <CategoryTabs categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      )}

      {/* Product Count */}
      <p style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '12px', margin: '0 0 8px' }}>
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <div style={{
          background: 'var(--st-bg-card, #1E293B)',
          borderRadius: '12px',
          padding: '32px 16px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📭</span>
          <p style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '13px', margin: 0 }}>
            {searchQuery ? 'No products match your search' : 'No products yet. Add your first item!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onStatusChange={handleStatusChange}
              onEdit={setEditingProduct}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          catalog={catalog}
          onSave={handleEditSave}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {/* Bill Scan Restricted Dialog */}
      <InfoDialog
        open={showBillScanDialog}
        title="Bill Scanning - App Only"
        message="Download the Stock Tracker app to scan bills with AI and automatically add products to your inventory."
        buttonText="Close"
        onClose={() => setShowBillScanDialog(false)}
        linkUrl="https://my-stock-tracker-app.netlify.app/?install=true"
        linkText="📲 Download App"
      />
    </div>
  );
};
