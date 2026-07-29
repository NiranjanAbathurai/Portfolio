import { useState, useEffect } from 'react';
// NOTE: This assumes 'supabase' is exported from your authService or another client file.
// You may need to adjust the import path to your actual Supabase client instance.
import { supabase } from './supabase';

type CatalogItem = {
  id: number;
  name: string;
};

type CatalogCategory = {
  id: number;
  name: string;
  items: CatalogItem[];
};

type HomeItem = {
  id: number;
  name: string;
  expanded: boolean;
  filter: 'all' | 'unavailable';
  products: Array<{
    id: number;
    stockType: string;
    product: string;
    quantity: string;
    expiryDate: string;
    availability: string;
  }>;
};

type StockTrackerDashboardProps = {
  onLogout: () => void;
};

export const StockTrackerDashboard = ({ onLogout }: StockTrackerDashboardProps) => {
  const [homes, setHomes] = useState<HomeItem[]>([]);
  const [newHomeName, setNewHomeName] = useState('');
  const [showAddHome, setShowAddHome] = useState(false);
  const [editingHomeId, setEditingHomeId] = useState<number | null>(null);
  const [currentEditingHomeName, setCurrentEditingHomeName] = useState('');
  const [focusedHomeId, setFocusedHomeId] = useState<number | null>(null);
  const [catalog, setCatalog] = useState<CatalogCategory[]>([]);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  useEffect(() => {
    const getCatalog = async () => {
      setCatalogLoading(true);
      setCatalogError(null);
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, items(id, name)')
          .order('name');

        if (error) throw error;
        if (data) {
          setCatalog(data);
        }
      } catch (err: any) {
        console.error("Error fetching catalog:", err);
        setCatalogError("Failed to load stock catalog. Please try again later.");
      } finally {
        setCatalogLoading(false);
      }
    };
    getCatalog();
  }, []);

  const addHome = () => {
    const trimmed = newHomeName.trim();
    if (!trimmed) return;

    setHomes((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: trimmed,
        expanded: true,
        filter: 'all',
        products: [],
      },
    ]);
    setNewHomeName('');
    setFocusedHomeId(null);
    setEditingHomeId(null); // Clear editing state if adding a new home
    setShowAddHome(false);
  };

  const deleteHome = (id: number) => {
    if (window.confirm('Are you sure you want to delete this home and all its products?')) {
      setHomes((prev) => prev.filter((home) => home.id !== id));
      if (focusedHomeId === id) {
        setFocusedHomeId(null);
      }
      if (editingHomeId === id) {
        setEditingHomeId(null);
        setCurrentEditingHomeName('');
      }
    }
  };

  const updateHomeName = (id: number) => {
    const trimmed = currentEditingHomeName.trim();
    if (!trimmed) {
      alert('Home name cannot be empty.');
      return;
    }
    setHomes((prev) =>
      prev.map((home) => (home.id === id ? { ...home, name: trimmed } : home))
    );
    setEditingHomeId(null);
    setCurrentEditingHomeName('');
  };

  const toggleHome = (id: number) => {
    const homeToToggle = homes.find(h => h.id === id);
    // If we are collapsing the currently focused home, reset the focus state.
    if (homeToToggle?.expanded && focusedHomeId === id) {
      setFocusedHomeId(null);
    }
    setHomes((prev) => prev.map((home) => (home.id === id ? { ...home, expanded: !home.expanded } : home)));
  };

  const addProduct = (homeId: number) => {
    const home = homes.find(h => h.id === homeId);
    if (!home) return;
    setFocusedHomeId(homeId);

    const isInvalid = home.products.some(p => !p.stockType || !p.product.trim() || !p.availability);
    if (isInvalid) {
      alert('Please fill in all mandatory fields (Type of Stock, Product, and Availability) for existing products before adding a new one.');
      return;
    }


    setHomes((prev) => prev.map((home) => home.id === homeId ? {
      ...home,
      products: [
        ...home.products,
        {
          id: Date.now(),
          stockType: '',
          product: '',
          quantity: '',
          expiryDate: '',
          availability: '',
        },
      ],
    } : home));
  };

  const deleteProduct = (homeId: number, productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setHomes((prev) =>
        prev.map((home) =>
          home.id === homeId
            ? {
                ...home,
                products: home.products.filter((product) => product.id !== productId),
              }
            : home
        )
      );
    }
  };
  const updateProduct = (homeId: number, productId: number, field: keyof NonNullable<HomeItem['products']>[number], value: string) => {
    setHomes((prev) => prev.map((home) => home.id === homeId ? {
      ...home,
      products: home.products.map((product) => product.id === productId ? { ...product, [field]: value } : product),
    } : home));
  };

  const toggleProductFilter = (homeId: number) => {
    setHomes((prev) =>
      prev.map((home) =>
        home.id === homeId
          ? { ...home, filter: home.filter === 'all' ? 'unavailable' : 'all' }
          : home
      )
    );
  };

  return (
    <div style={{ width: '100%', color: '#fff', position: 'relative', fontSize: '14px' }}>
      <button
        type="button"
        onClick={onLogout}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '1.5rem',
          padding: '0 0.5rem'
        }}
        title="Log Out"
      >
        ⏻
      </button>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#1db954', textAlign: 'center', fontSize:'1.5rem' }}>Stock Tracker</h3>
        {catalogError && (
          <p style={{ color: '#ff4d4d', textAlign: 'center', marginTop: '0.5rem' }}>{catalogError}</p>
        )}
      </div>

      {!showAddHome && homes.length === 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => setShowAddHome(true)}
            style={{ width: '100%', maxWidth: '280px', background: '#1db954', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.75rem 1rem', cursor: 'pointer', fontWeight: 600 }}
          >
            + Add Home
          </button>
        </div>
      )}
 
      {homes.length === 0
       ? (
        <div style={{ border: '1px dashed #666', borderRadius: '8px', padding: '1rem', textAlign: 'center', color: '#aaa' }}>
          No homes added yet.
        </div>
       ) : (
        homes.map((home) => { // Start of home mapping
          const isFocused = focusedHomeId === home.id;
          const isAnotherFocused = focusedHomeId !== null && !isFocused;

          return (
          <div key={home.id} style={{ border: '1px solid #1db954', borderRadius: '8px', marginBottom: '0.75rem', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => toggleHome(home.id)}
              style={{
                width: '100%',
                background: isAnotherFocused ? '#000' : '#222',
                color: '#fff',
                border: 'none',
                padding: '0.9rem 1rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem' // Added gap for buttons
              }}
            >
              {/* Left side: Name or Input */}
              {editingHomeId === home.id ? (
                <input
                  value={currentEditingHomeName}
                  onChange={(e) => setCurrentEditingHomeName(e.target.value)}
                  style={{
                    background: '#fff',
                    color: '#111',
                    border: '1px solid #1db954',
                    borderRadius: '4px',
                    padding: '0.2rem 0.4rem',
                    boxSizing: 'border-box',
                    width: '150px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span style={{fontSize: '1.25rem', fontWeight: '600'}}>{home.name}</span>
              )}

              {/* Right side: Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {editingHomeId === home.id ? (
                  <>
                    <button type="button" onClick={(e) => { e.stopPropagation(); updateHomeName(home.id); }} style={{ background: '#1db954', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '14px' }} title="Save Home Name">
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
                    <button type="button" onClick={(e) => { e.stopPropagation(); deleteHome(home.id); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px' }} title="Delete Home">
                      🗑️
                    </button>
                  </>
                )}
                <span>{home.expanded ? '−' : '+'}</span>
              </div>
            </button>

            {home.expanded && (
              (() => {
                const filteredProducts = home.products.filter(p => home.filter === 'all' || (home.filter === 'unavailable' && p.availability === 'No'));
                // If filter is 'unavailable' and no products match, but there are products in total,
                // we should show the "No unavailable products found" message.
                const showNoUnavailableMessage = home.filter === 'unavailable' && filteredProducts.length === 0 && home.products.length > 0;

                // If filter is 'all' and no products at all, show "No products yet."
                const showNoProductsYetMessage = home.filter === 'all' && home.products.length === 0;

                const showEmptyMessage = showNoProductsYetMessage || showNoUnavailableMessage;
                
                return <div style={{
                  padding: '0.75rem 1.5rem',
                  background: isAnotherFocused ? '#000' : '#181818'
                }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem', gap: '0.5rem' }}>
                  <button type="button" onClick={() => toggleProductFilter(home.id)} style={{ background: '#f0ad4e', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 0.75rem', cursor: 'pointer' }}>
                    {home.filter === 'all' ? 'Show Unavailable' : 'Show All'}
                  </button>
                  <button type="button" onClick={() => addProduct(home.id)} style={{ background: '#1db954', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 0.75rem', cursor: 'pointer' }}>
                    + Add Product
                  </button>
                </div>

                {showEmptyMessage ? (
                  <div style={{ border: '1px dashed #555', borderRadius: '8px', padding: '0.75rem', textAlign: 'center', color: '#aaa' }}>
                    {showNoProductsYetMessage ? 'No products yet.' : 'No unavailable products found.'}
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                      <thead>
                        <tr style={{ background: '#222' }}>
                          <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '1px solid #444' }}>S.No</th>
                          <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '1px solid #444' }}>Type of Stock <span style={{ color: 'red' }}>*</span></th>
                          <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '1px solid #444' }}>Product <span style={{ color: 'red' }}>*</span></th>
                          <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '1px solid #444' }}>Availability <span style={{ color: 'red' }}>*</span></th>
                          <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '1px solid #444', width: '80px' }}>Quantity</th>
                          <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '1px solid #444', width: '120px' }}>Expire Date</th>
                          <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '1px solid #444' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product, index) => (
                          <tr key={product.id}>
                            <td style={{ padding: '0.6rem', borderBottom: '1px solid #333' }}>{index + 1}</td>
                            <td style={{ padding: '0.6rem', borderBottom: '1px solid #333' }}>
                              <select
                                value={product.stockType}
                                onChange={(e) => {
                                  updateProduct(home.id, product.id, 'stockType', e.target.value);
                                  updateProduct(home.id, product.id, 'product', ''); // Reset product when category changes
                                }}
                                style={{ width: '100%', padding: '0.2rem', borderRadius: '4px', background: '#fff', color: '#111', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                disabled={catalogLoading}
                              >
                                <option value="">{catalogLoading ? 'Loading...' : 'Select Type'}</option>
                                {catalog.map(cat => (
                                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                              </select>
                            </td>
                            <td style={{ padding: '0.6rem', borderBottom: '1px solid #333' }}>
                              <div style={{ position: 'relative' }}>
                                <input
                                  value={product.product}
                                  onChange={(e) => updateProduct(home.id, product.id, 'product', e.target.value)}
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
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', margin:'0' }}>
                                  <input type="radio" style={{marginTop:'4px'}} name={`availability-${product.id}`} value="Yes" checked={product.availability === 'Yes'} onChange={(e) => updateProduct(home.id, product.id, 'availability', e.target.value)}/>
                                  Yes
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem',  margin:'0' }}>
                                  <input type="radio"  style={{marginTop:'4px'}} name={`availability-${product.id}`} value="No" checked={product.availability === 'No'} onChange={(e) => {
                                    updateProduct(home.id, product.id, 'availability', e.target.value);
                                    // Also clear quantity and expiry date when set to No
                                    updateProduct(home.id, product.id, 'quantity', '');
                                    updateProduct(home.id, product.id, 'expiryDate', '');
                                  }} />
                                  No
                                </label>
                              </div>
                            </td>
                            <td style={{ padding: '0.6rem', borderBottom: '1px solid #333' }}>
                              <input type="number" value={product.quantity} onChange={(e) => updateProduct(home.id, product.id, 'quantity', e.target.value)} disabled={product.availability === 'No'} style={{ width: '100%', padding: '0.2rem', borderRadius: '4px', background: product.availability === 'No' ? '#eee' : '#fff', color: '#111', border: '1px solid #ccc', boxSizing: 'border-box', opacity: product.availability === 'No' ? 0.6 : 1 }} />
                            </td>
                            <td style={{ padding: '0.6rem', borderBottom: '1px solid #333' }}>
                              <input
                                type={product.expiryDate ? 'date' : 'text'}
                                placeholder="DD-MM-YYYY"
                                onFocus={(e) => (e.currentTarget.type = 'date')}
                                onBlur={(e) => {
                                  if (!e.currentTarget.value) {
                                    e.currentTarget.type = 'text';
                                  }
                                }}
                                value={product.expiryDate}
                                onChange={(e) => updateProduct(home.id, product.id, 'expiryDate', e.target.value)}
                                disabled={product.availability === 'No'}
                                style={{ width: '100%', padding: '0.2rem', borderRadius: '4px', background: product.availability === 'No' ? '#eee' : '#fff', color: '#111', border: '1px solid #ccc', boxSizing: 'border-box', opacity: product.availability === 'No' ? 0.6 : 1 }} />
                            </td>
                            {/* New Actions column */}
                            <td style={{ padding: '0.6rem', borderBottom: '1px solid #333', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => deleteProduct(home.id, product.id)}
                                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px' }}
                                title="Delete Product"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>;
              })()
            )}
          </div>
          );
        })
      )}

      {showAddHome && (
        <div style={{ border: '1px solid #1db954', borderRadius: '8px', padding: '0.75rem', marginTop: '1rem' }}>
          <input
            value={newHomeName}
            onChange={(e) => setNewHomeName(e.target.value)}
            placeholder="Enter home name"
            style={{
              width: '100%',
              padding: '0.3rem 0.3rem',
              borderRadius: '6px',
              marginBottom: '0.75rem',
              border: '1px solid #1db954',
              background: '#fff',
              color: '#111',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <button type="button" onClick={addHome} style={{ minWidth: '110px', background: '#1db954', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.6rem 1rem', cursor: 'pointer' }}>
              Save
            </button>
            <button type="button" onClick={() => setShowAddHome(false)} style={{ minWidth: '110px', background: '#444', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.6rem 1rem', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showAddHome && homes.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={() => setShowAddHome(true)}
            style={{ width: '100%', maxWidth: '280px', background: '#1db954', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.75rem 1rem', cursor: 'pointer', fontWeight: 600 }}
          >
            + Add Home
          </button>
        </div>
      )}
    </div>
  );
};
