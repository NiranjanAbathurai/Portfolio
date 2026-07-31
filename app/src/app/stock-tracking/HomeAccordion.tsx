import { useRef, useState } from 'react';
import type { HomeItem, CatalogCategory } from './types';

type HomeAccordionProps = {
  home: HomeItem;
  catalog: CatalogCategory[];
  catalogLoading: boolean;
  isParsingBill: boolean;
  isAnotherHomeFocused: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateName: (id: number, name: string) => void;
  onAddProduct: (homeId: number) => void;
  onDeleteProduct: (homeId: number, productId: number) => void;
  onUpdateProduct: (homeId: number, productId: number, fields: Partial<HomeItem['products'][number]>) => void;
  onUpdateFilters: (homeId: number, filters: Partial<HomeItem['filters']>) => void;
  onBillUpload: (homeId: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  onSetFocusedHome: (homeId: number | null) => void;
};

export const HomeAccordion = (props: HomeAccordionProps) => {
  const {
    home,
    catalog,
    catalogLoading,
    isParsingBill,
    isAnotherHomeFocused,
    onToggle,
    onDelete,
    onUpdateName,
    onAddProduct,
    onDeleteProduct,
    onUpdateProduct,
    onUpdateFilters,
    onBillUpload,
    onSetFocusedHome,
  } = props;

  const [editingHomeId, setEditingHomeId] = useState<number | null>(null);
  const [currentEditingHomeName, setCurrentEditingHomeName] = useState('');
  const [activeStockTypeDropdown, setActiveStockTypeDropdown] = useState<number | null>(null);
  const [pendingUpdateIds, setPendingUpdateIds] = useState<number[]>([]);
  const [showBillMenu, setShowBillMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const isMobile = typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleUpdateHomeName = (id: number) => {
    onUpdateName(id, currentEditingHomeName);
    setEditingHomeId(null);
    setCurrentEditingHomeName('');
  };

  const handleBillButtonClick = () => {
    onSetFocusedHome(home.id);
    if (isMobile) {
      setShowBillMenu(prev => !prev);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleCameraSelect = () => {
    setShowBillMenu(false);
    cameraInputRef.current?.click();
  };

  const handleGallerySelect = () => {
    setShowBillMenu(false);
    fileInputRef.current?.click();
  };

  const handleConfirmUpdate = (productId: number) => {
    setPendingUpdateIds(prev => prev.filter(id => id !== productId));
  };

  const filteredProducts = home.products.filter(p => {
    const availabilityMatch = home.filters.availability === 'all' ||
                              (home.filters.availability === 'unavailable' && p.availability === 'No') ||
                              (home.filters.availability === 'unavailable' && pendingUpdateIds.includes(p.id));
    const stockTypeMatch = home.filters.stockType === 'all' || p.stockType === home.filters.stockType;
    return availabilityMatch && stockTypeMatch;
  });

  const hasActiveFilters = home.filters.availability !== 'all' || home.filters.stockType !== 'all';
  const showNoProductsYetMessage = !hasActiveFilters && home.products.length === 0;
  const showNoMatchingProductsMessage = hasActiveFilters && filteredProducts.length === 0 && home.products.length > 0;
  const showEmptyMessage = showNoProductsYetMessage || showNoMatchingProductsMessage;

  return (
    <div style={{ border: '1px solid #1db954', borderRadius: '0', marginBottom: '0.75rem' }} role="region" aria-labelledby={`home-header-${home.id}`}>
      <style>{`
        .bill-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 998;
        }
        .bill-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 50%;
          transform: translateX(-50%);
          background: #2a2a2a;
          border: 1px solid #555;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          z-index: 999;
          overflow: hidden;
          min-width: 100px;
        }
        .bill-menu-item {
          padding: 0.5rem 0.75rem;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 12px;
          white-space: nowrap;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .bill-menu-item:hover {
          background: #3a3a3a;
        }
        .bill-menu-item + .bill-menu-item {
          border-top: 1px solid #444;
        }
        @media (max-width: 780px) {
          .stock-filter-bar {
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 0.35rem !important;
          }
          .stock-filter-bar select,
          .stock-filter-bar button {
            font-size: 11px !important;
            padding: 0.3rem 0.5rem !important;
            min-width: unset !important;
            border-radius: 4px !important;
          }
          .stock-filter-bar select {
            flex: 1 1 100% !important;
            max-width: 100% !important;
            padding: 0.35rem 0.5rem !important;
          }
          .stock-filter-bar button {
            flex: 1 1 calc(33.33% - 0.35rem) !important;
            text-align: center !important;
            justify-content: center !important;
            white-space: nowrap !important;
          }
          .stock-filter-bar button svg {
            width: 12px !important;
            height: 12px !important;
          }
          .stock-expanded-content {
            padding: 0.5rem 0.75rem !important;
          }
          .desktop-table { display: none !important; }
          .mobile-table { display: block !important; }
        }
        @media (min-width: 781px) {
          .desktop-table { display: block !important; }
          .mobile-table { display: none !important; }
        }
        .mobile-field-label {
          color: rgba(255,255,255,0.5);
          font-size: 0.65rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 0.15rem;
        }
        .mobile-field-input {
          background: #1a1a1a;
          color: #fff;
          border: 1px solid #555;
          border-radius: 4px;
          padding: 0.4rem 0.5rem;
          font-size: 0.85rem;
          width: 100%;
          box-sizing: border-box;
          min-width: 0;
        }
        .mobile-table {
          overflow: hidden;
        }
        .mobile-table * {
          min-width: 0;
        }
      `}</style>
      {/* Hidden file input for gallery uploads */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={(e) => onBillUpload(home.id, e)}
      />
      {/* Hidden file input for camera capture */}
      <input
        type="file"
        ref={cameraInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        capture="environment"
        onChange={(e) => onBillUpload(home.id, e)}
      />
      <div
        onClick={() => onToggle(home.id)}
        style={{
          width: '100%',
          background: isAnotherHomeFocused ? '#000' : '#222',
          color: '#fff',
          border: 'none',
          padding: '0.9rem 1rem',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        {editingHomeId === home.id ? (
          <input
            value={currentEditingHomeName}
            onChange={(e) => setCurrentEditingHomeName(e.target.value)}
            style={{
              background: '#fff', color: '#111', border: '1px solid #1db954',
              borderRadius: '4px', padding: '0.2rem 0.4rem', boxSizing: 'border-box', width: '150px'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span id={`home-header-${home.id}`} style={{ fontSize: '1.25rem', fontWeight: '600', flexGrow: 1 }}>{home.name}</span>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {editingHomeId === home.id ? (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); handleUpdateHomeName(home.id); }} style={{ background: '#1db954', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '14px' }} title="Save Home Name">
                Save
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); setEditingHomeId(null); setCurrentEditingHomeName(''); }} style={{ background: '#444', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '14px' }} title="Cancel Edit">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingHomeId(home.id);
                  setCurrentEditingHomeName(home.name);
                }}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px' }}
                title="Edit Home Name"
              >
                ✏️
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(home.id); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px' }} title="Delete Home">
                🗑️
              </button>
            </>
          )}
          <span>{home.expanded ? '−' : '+'}</span>
        </div>
      </div>

      {home.expanded && (
        <div className="stock-expanded-content" style={{
          padding: '0.75rem 1.5rem',
          background: isAnotherHomeFocused ? '#000' : '#181818'
        }}>
          <div className="stock-filter-bar" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem', gap: '0.5rem', alignItems: 'center' }}>
            <select
              value={home.filters.stockType}
              onChange={(e) => onUpdateFilters(home.id, { stockType: e.target.value })}
              style={{ background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '6px', padding: '0.5rem 0.75rem', cursor: 'pointer' }}
              disabled={catalogLoading}
            >
              <option value="all">All Stock Types</option>
              {catalog.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <button type="button" onClick={() => onUpdateFilters(home.id, { availability: home.filters.availability === 'all' ? 'unavailable' : 'all' })} style={{ background: '#f0ad4e', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 0.75rem', cursor: 'pointer' }}>
              {home.filters.availability === 'all' ? 'Show Unavailable' : 'Show All'}
            </button>
            <div style={{ position: 'relative' }}>
              <button type="button" onClick={handleBillButtonClick} disabled={isParsingBill} style={{ background: '#5bc0de', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isParsingBill ? 0.6 : 1, width: '100%', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 14.5 0zM11 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 11 3m-3 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 3m-3 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 5 3m-2 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m10-4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5m0 2a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5m0 2a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5m-5-6a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5"/>
                </svg>
                {isParsingBill ? 'Parsing...' : 'Add from Bill'}
              </button>
              {showBillMenu && (
                <>
                  <div className="bill-menu-overlay" onClick={() => setShowBillMenu(false)} />
                  <div className="bill-menu">
                    <button type="button" className="bill-menu-item" onClick={handleCameraSelect}>
                      📷 Camera
                    </button>
                    <button type="button" className="bill-menu-item" onClick={handleGallerySelect}>
                      🖼️ Gallery
                    </button>
                  </div>
                </>
              )}
            </div>
            <button type="button" onClick={() => onAddProduct(home.id)} style={{ background: '#1db954', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 0.75rem', cursor: 'pointer' }}>
              + Add Product
            </button>
          </div>

          <div className="desktop-table" style={{ overflowX: activeStockTypeDropdown !== null ? 'visible' : 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
              <thead>
                <tr style={{ background: '#222' }}>
                  <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '1px solid #444' }}>S.No</th>
                  <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '1px solid #444' }}>Type of Stock <span style={{ color: 'red' }}>*</span></th>
                  <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '1px solid #444' }}>Product <span style={{ color: 'red' }}>*</span></th>
                  <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '1px solid #444' }}>Availability <span style={{ color: 'red' }}>*</span></th>
                  <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '1px solid #444', width: '80px' }}>Quantity</th>
                  <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '1px solid #444', width: '120px' }}>Expire Date</th>
                  <th style={{ padding: '0.6rem', textAlign: 'center', borderBottom: '1px solid #444' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {showEmptyMessage ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '1rem', textAlign: 'center', color: '#aaa', borderBottom: '1px solid #333' }}>
                      {showNoProductsYetMessage ? 'No products yet.' : 'No products match the current filters.'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, index) => (
                    <tr 
                      key={product.id} 
                      style={{ 
                        backgroundColor: product.isExpired ? 'rgba(255, 77, 77, 0.2)' : 'transparent',
                        // Apply red color to text for expired items for better visibility
                        color: product.isExpired ? '#ff9999' : '#fff'
                      }}
                    >
                      <td style={{ padding: '0.6rem', borderBottom: '1px solid #333' }}>{index + 1}</td>
                      <td style={{ padding: '0.6rem', borderBottom: '1px solid #333' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            value={product.stockType}
                            onChange={(e) => {
                              onUpdateProduct(home.id, product.id, { stockType: e.target.value });
                              if (activeStockTypeDropdown !== product.id) {
                                setActiveStockTypeDropdown(product.id);
                              }
                            }}
                            onFocus={() => setActiveStockTypeDropdown(product.id)}
                            onBlur={() => {
                              setTimeout(() => {
                                const isValid = catalog.some(c => c.name.toLowerCase() === product.stockType.toLowerCase());
                                if (!isValid && product.stockType !== '') {
                                  onUpdateProduct(home.id, product.id, { stockType: '', product: '' });
                                }
                                setActiveStockTypeDropdown(null);
                              }, 150);
                            }}
                            placeholder={catalogLoading ? 'Loading...' : 'Search type...'}
                            style={{ width: '100%', padding: '0.2rem', borderRadius: '4px', background: '#fff', color: '#111', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            disabled={catalogLoading}
                            autoComplete="off"
                          />
                          {activeStockTypeDropdown === product.id && (
                            <div style={{
                              position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff',
                              border: '1px solid #ccc', borderRadius: '4px', marginTop: '2px',
                              maxHeight: '150px', overflowY: 'auto', zIndex: 999, color: '#111'
                            }}>
                              {(() => {
                                const filteredCatalog = catalog.filter(cat =>
                                  product.stockType ? cat.name.toLowerCase().includes(product.stockType.toLowerCase()) : true
                                );

                                if (filteredCatalog.length === 0) {
                                  return <div style={{ padding: '0.5rem', color: '#888' }}>No matches found</div>;
                                }

                                return filteredCatalog.map(cat => (
                                  <div
                                    key={cat.id}
                                    onMouseDown={() => {
                                      onUpdateProduct(home.id, product.id, { stockType: cat.name, product: '' });
                                    }}
                                    style={{ padding: '0.5rem', cursor: 'pointer' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                  >{cat.name}</div>
                                ));
                              })()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '0.6rem', borderBottom: '1px solid #333' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            value={product.product}
                            onChange={(e) => onUpdateProduct(home.id, product.id, { product: e.target.value })}
                            style={{ width: '100%', padding: '0.2rem', borderRadius: '4px', background: '#fff', color: '#111', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            list={`product-list-${product.id}`}
                            disabled={!product.stockType}
                          />
                          <datalist id={`product-list-${product.id}`}>
                            {catalog.find(cat => cat.name === product.stockType)?.items.map(item => (
                              <option key={item.id} value={item.name} />
                            ))}
                          </datalist>
                        </div>
                      </td>
                      <td style={{ padding: '0.6rem', borderBottom: '1px solid #333' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', margin: '0' }}>
                            <input type="radio" style={{ marginTop: '4px' }} name={`availability-${product.id}`} value="Yes" checked={product.availability === 'Yes'} onChange={(e) => {
                              if (product.availability === 'No') {
                                setPendingUpdateIds(prev => [...prev, product.id]);
                              }
                              onUpdateProduct(home.id, product.id, { availability: e.target.value as 'Yes', isExpired: false });
                            }} />
                            Yes
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', margin: '0' }}>
                            <input type="radio" style={{ marginTop: '4px' }} name={`availability-${product.id}`} value="No" checked={product.availability === 'No'} onChange={(e) => {
                              setPendingUpdateIds(prev => prev.filter(id => id !== product.id));
                              onUpdateProduct(home.id, product.id, {
                                availability: 'No',
                                quantity: '',
                                expiryDate: '',
                                isExpired: false
                              });
                            }} />
                            No
                          </label>
                        </div>
                      </td>
                      <td style={{ padding: '0.6rem', borderBottom: '1px solid #333' }}>
                        <input type="text" value={product.quantity} onChange={(e) => onUpdateProduct(home.id, product.id, { quantity: e.target.value })} disabled={product.availability === 'No'} style={{ width: '100%', padding: '0.2rem', borderRadius: '4px', background: product.availability === 'No' ? '#555' : '#fff', color: product.availability === 'No' ? '#ccc' : '#111', border: '1px solid #ccc', boxSizing: 'border-box', opacity: product.availability === 'No' ? 0.6 : 1 }} />
                      </td>
                      <td style={{ padding: '0.6rem', borderBottom: '1px solid #333' }}>
                        <input
                          type="date"
                          placeholder="DD-MM-YYYY"
                          onFocus={(e) => (e.currentTarget.type = 'date')}
                          onBlur={(e) => {
                            if (!e.currentTarget.value) {
                              e.currentTarget.type = 'text';
                            }
                          }}
                          value={product.expiryDate}
                          onChange={(e) => {
                            const selectedDateValue = e.target.value;
                            if (selectedDateValue) {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0); // Set to the beginning of today
                              const selectedDate = new Date(selectedDateValue + 'T00:00:00'); // Treat as local time

                              if (selectedDate <= today) {
                                alert('Expiry date must be in the future.');
                                return; // Do not update if the date is not valid
                              }
                            }
                            onUpdateProduct(home.id, product.id, { expiryDate: selectedDateValue });
                          }}
                          disabled={product.availability === 'No'}
                          style={{ width: '100%', padding: '0.2rem', borderRadius: '4px', background: product.availability === 'No' ? '#555' : '#fff', color: product.availability === 'No' ? '#ccc' : '#111', border: '1px solid #ccc', boxSizing: 'border-box', opacity: product.availability === 'No' ? 0.6 : 1 }} />
                      </td>
                      <td style={{ padding: '0.6rem', borderBottom: '1px solid #333', textAlign: 'center' }}>
                        {pendingUpdateIds.includes(product.id) && (
                          <button
                            type="button"
                            onClick={() => handleConfirmUpdate(product.id)}
                            style={{ background: 'none', border: 'none', color: '#1db954', cursor: 'pointer', fontSize: '16px', marginRight: '0.5rem' }}
                            title="Confirm and move to available"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDeleteProduct(home.id, product.id)}
                          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px' }}
                          title="Delete Product"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Table View */}
          <div className="mobile-table">
            {showEmptyMessage ? (
              <p style={{ padding: '1rem', textAlign: 'center', color: '#aaa' }}>
                {showNoProductsYetMessage ? 'No products yet.' : 'No products match the current filters.'}
              </p>
            ) : (
              <>
                {/* Header: Product | Availability | Action */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 40px', gap: '0.5rem', padding: '0.5rem 0.5rem', borderBottom: '2px solid rgba(255,255,255,0.3)' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>Product</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem', textAlign: 'center' }}>Availability</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem', textAlign: 'center' }}>Action</span>
                </div>
                {filteredProducts.map((product, index) => (
                  <div key={product.id} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 40px', gap: '0.5rem', padding: '0.6rem 0.5rem', borderBottom: index < filteredProducts.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none', background: product.isExpired ? 'rgba(255, 77, 77, 0.1)' : 'transparent', alignItems: 'start' }}>
                    {/* Product Column — stacked fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {/* Type of Stock */}
                      <input
                        value={product.stockType}
                        onChange={(e) => onUpdateProduct(home.id, product.id, { stockType: e.target.value })}
                        placeholder={catalogLoading ? 'Loading...' : 'Type of Stock...'}
                        className="mobile-field-input"
                        list={`mobile-type-list-${product.id}`}
                        disabled={catalogLoading}
                        autoComplete="off"
                      />
                      <datalist id={`mobile-type-list-${product.id}`}>
                        {catalog.map(cat => (
                          <option key={cat.id} value={cat.name} />
                        ))}
                      </datalist>

                      {/* Product Name */}
                      <input
                        value={product.product}
                        onChange={(e) => onUpdateProduct(home.id, product.id, { product: e.target.value })}
                        placeholder="Product..."
                        className="mobile-field-input"
                        list={`mobile-product-list-${product.id}`}
                        disabled={!product.stockType}
                      />
                      <datalist id={`mobile-product-list-${product.id}`}>
                        {catalog.find(cat => cat.name === product.stockType)?.items.map(item => (
                          <option key={item.id} value={item.name} />
                        ))}
                      </datalist>

                      {/* Qty + Expiry on same row */}
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <input
                          type="text"
                          value={product.quantity}
                          onChange={(e) => onUpdateProduct(home.id, product.id, { quantity: e.target.value })}
                          placeholder="Qty"
                          className="mobile-field-input"
                          style={{ width: '55px', flex: '0 0 55px' }}
                          disabled={product.availability === 'No'}
                        />
                        <input
                          type="date"
                          value={product.expiryDate}
                          onChange={(e) => onUpdateProduct(home.id, product.id, { expiryDate: e.target.value })}
                          className="mobile-field-input"
                          style={{ flex: 1 }}
                          disabled={product.availability === 'No'}
                        />
                      </div>

                      {product.isExpired && (
                        <p style={{ color: '#e53935', fontSize: '0.7rem', fontWeight: 600, margin: 0 }}>⚠️ Expired</p>
                      )}
                    </div>

                    {/* Availability Column — Yes/No radio */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', paddingTop: '0.3rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={`mobile-avail-${product.id}`}
                          checked={product.availability === 'Yes'}
                          onChange={() => onUpdateProduct(home.id, product.id, { availability: 'Yes' as const })}
                          style={{ accentColor: '#1db954', width: '14px', height: '14px' }}
                        />
                        Yes
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={`mobile-avail-${product.id}`}
                          checked={product.availability === 'No'}
                          onChange={() => onUpdateProduct(home.id, product.id, { availability: 'No' as const, quantity: '', expiryDate: '' })}
                          style={{ accentColor: '#1db954', width: '14px', height: '14px' }}
                        />
                        No
                      </label>
                    </div>

                    {/* Action Column — Delete */}
                    <div style={{ paddingTop: '0.3rem', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => onDeleteProduct(home.id, product.id)}
                        style={{ background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: '1.2rem', padding: '0.2rem' }}
                        title="Delete product"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};