import { useState, useEffect } from 'react';
// NOTE: This assumes 'supabase' is exported from your authService or another client file.
// You may need to adjust the import path to your actual Supabase client instance.
import { supabase } from './supabase-database';
import * as api from './homeApi';
import { HomeAccordion } from './HomeAccordion';
import { InfoDialog } from '../shared/ui/ConfirmDialog';
import type { HomeItem, CatalogCategory } from './types';

type StockTrackerDashboardProps = {
  onLogout: () => void;
};

export const StockTrackerDashboard = ({ onLogout }: StockTrackerDashboardProps) => {
  const [homes, setHomes] = useState<HomeItem[]>([]);
  const [showMicFeatureDialog, setShowMicFeatureDialog] = useState(false);
  const [newHomeName, setNewHomeName] = useState('');
  const [showAddHome, setShowAddHome] = useState(false);
  const [focusedHomeId, setFocusedHomeId] = useState<number | null>(null);
  const [catalog, setCatalog] = useState<CatalogCategory[]>([]);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [isParsingBill, setIsParsingBill] = useState<number | null>(null); // Store homeId being processed
  const [isDataLoading, setIsDataLoading] = useState(true);

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

    const loadInitialData = async () => {
      setIsDataLoading(true);
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to beginning of the day for accurate comparison

        const homesFromApi = await api.getHomesWithProducts();
        const formattedHomes = homesFromApi.map((home:any) => ({
          ...home,
          expanded: false,
          filters: { availability: 'all', stockType: 'all' },
          // Map snake_case from DB to camelCase for component state
          products: (home.products || []).map((p: any) => {
            const expiryDate = p.expiry_date ? new Date(p.expiry_date) : null;
            const isExpired = expiryDate && expiryDate < today;
            const wasAvailable = p.availability === 'Yes';
            const isNowExpiredAndUnavailable = isExpired && wasAvailable;
            const availability = isNowExpiredAndUnavailable ? 'No' : p.availability;

            return {
              id: p.id,
              stockType: p.stock_type,
              product: p.product,
              quantity: availability === 'No' && !isNowExpiredAndUnavailable ? '' : p.quantity,
              expiryDate: availability === 'No' && !isNowExpiredAndUnavailable ? '' : p.expiry_date,
              availability: availability as HomeItem['products'][number]['availability'],
              isExpired: isNowExpiredAndUnavailable, // Flag it only if we auto-changed it
            };
          }),
        }));
        setHomes(formattedHomes);
      } catch (err: any) {
        console.error("Error fetching homes:", err);
        setCatalogError("Failed to load your homes. Please try again later.");
      } finally {
        setIsDataLoading(false);
      }
    };
    getCatalog();
    loadInitialData();
  }, []);

  const addHome = async () => {
    const trimmed = newHomeName.trim();
    if (!trimmed) return;

    try {
      const newHomeFromApi = await api.addHome(trimmed);
      const newHome = {
        ...newHomeFromApi,
        expanded: true,
        filters: { availability: 'all', stockType: 'all' },
        products: [],
      };
      setHomes((prev) => [...prev, newHome]);
      setNewHomeName('');
      setFocusedHomeId(null);
      setShowAddHome(false);
    } catch (error) {
      console.error("Error adding home:", error);
      alert("Failed to add home.");
    }
  };

  const deleteHome = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this home and all its products?')) {
      try {
        await api.removeHome(id);

        setHomes((prev) => prev.filter((home) => home.id !== id));
        if (focusedHomeId === id) {
          setFocusedHomeId(null);
        }
      } catch (error) {
        console.error("Error deleting home:", error);
        alert("Failed to delete home.");
      }
    }
  };

  const updateHomeName = async (id: number, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      alert('Home name cannot be empty.');
      return;
    }
    try {
      await api.updateHomeName(id, trimmed);
      setHomes((prev) => prev.map((home) => (home.id === id ? { ...home, name: trimmed } : home)));
    } catch (error) {
      console.error("Error updating home name:", error);
      alert("Failed to update home name.");
    }
  };

  const toggleHome = (id: number) => {
    const homeToToggle = homes.find(h => h.id === id);
    // If we are collapsing the currently focused home, reset the focus state.
    if (homeToToggle?.expanded && focusedHomeId === id) {
      setFocusedHomeId(null);
    }
    setHomes((prev) => prev.map((home) => (home.id === id ? { ...home, expanded: !home.expanded } : home)));
  };

  const addProduct = async (homeId: number) => {
    const home = homes.find(h => h.id === homeId);
    if (!home) return;
    setFocusedHomeId(homeId);

    const isInvalid = home.products.some(p => !p.stockType || !p.product.trim() || !p.availability.trim());
    if (isInvalid) {
      alert('Please fill in all mandatory fields (Type of Stock, Product, and Availability) for existing products before adding a new one.');
      return;
    }

    try {
      // The component state uses camelCase, which homeApi.js now expects
      const newProductData = {
        stockType: '',
        product: '',
        quantity: '',
        expiryDate: '',
        availability: '',
      };
      const newProductFromApi = await api.addProduct(homeId, newProductData);

      setHomes((prev) => prev.map((h) => h.id === homeId ? {
        ...h,
        // Map the returned snake_case object to camelCase for the UI state
        products: [...h.products, {
          id: newProductFromApi.id,
          stockType: newProductFromApi.stock_type,
          product: newProductFromApi.product,
          quantity: newProductFromApi.quantity,
          expiryDate: newProductFromApi.expiry_date,
          availability: newProductFromApi.availability,
        } as HomeItem['products'][number]],
      } : h));
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  const deleteProduct = async (homeId: number, productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.removeProduct(productId);
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
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  const updateProduct = async (homeId: number, productId: number, fields: Partial<HomeItem['products'][number]>) => {
    // Optimistic UI update for responsiveness
    setHomes((prev) =>
      prev.map((home) =>
        home.id === homeId
          ? { ...home, products: home.products.map((p) => (p.id === productId ? { ...p, ...fields } : p)) }
          : home
      )
    );

    try {
      await api.updateProduct(productId, fields);
    } catch (error) {
      console.error(`Error updating product:`, error);
      alert(`Failed to save changes. Please refresh and try again.`);
    }
  };

  const updateHomeFilters = (homeId: number, filters: Partial<HomeItem['filters']>) => {
    setHomes((prev) =>
      prev.map((home) =>
        home.id === homeId ? { ...home, filters: { ...home.filters, ...filters } } : home
      )
    );
  };

  const handleBillUpload = async (homeId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsingBill(homeId);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result as string;
      const base64Data = base64Image.split(',')[1];

      try {
        // This should point to your Netlify function endpoint
        const response = await fetch('/api/stock-tracker/parse-bill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data }),
        });

        if (!response.ok) {
          // Read the body as text first, as it can only be read once.
          const errorText = await response.text();
          let errorMessage = `Error: ${response.status} ${response.statusText}`;

          try {
            // Try to parse the text as JSON.
            const errorData = JSON.parse(errorText);
            // If successful, use the structured error message.
            errorMessage = errorData.error || errorText;
          } catch (e) {
            // If parsing fails, the response was not JSON. Use the raw text.
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const parsedItems: Array<{ product: string; quantity: string; stockType: string; }> = await response.json();

        if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
          alert('The AI could not find any items in the bill. Please try a clearer image or add items manually.');
          return;
        }

        // Match parsed items against catalog for accurate stockType/product names
        const matchedItems = parsedItems.map(item => {
          let matchedStockType = '';
          let matchedProduct = item.product || '';
          const productLower = (item.product || '').toLowerCase();
          let foundInCatalog = false;

          for (const cat of catalog) {
            const matchedItem = cat.items.find((catItem: any) =>
              catItem.name.toLowerCase() === productLower ||
              catItem.name.toLowerCase().includes(productLower) ||
              productLower.includes(catItem.name.toLowerCase())
            );
            if (matchedItem) {
              matchedStockType = cat.name;
              matchedProduct = matchedItem.name;
              foundInCatalog = true;
              break;
            }
          }

          if (!foundInCatalog && item.stockType) {
            const stockTypeLower = item.stockType.toLowerCase();
            const matchedCat = catalog.find(cat =>
              cat.name.toLowerCase() === stockTypeLower ||
              cat.name.toLowerCase().includes(stockTypeLower) ||
              stockTypeLower.includes(cat.name.toLowerCase())
            );
            matchedStockType = matchedCat ? matchedCat.name : 'Others';
          } else if (!foundInCatalog) {
            matchedStockType = 'Others';
          }

          return {
            product: matchedProduct,
            quantity: String(item.quantity || '1'),
            stockType: matchedStockType,
            expiryDate: '',
            availability: 'Yes',
          };
        });

        // Persist each matched item to the database
        const addedProducts = await Promise.all(
          matchedItems.map(item => api.addProduct(homeId, item))
        );

        // Map the snake_case properties from the API response to camelCase for the UI state
        const newProductsForState = addedProducts.map((p:any) => ({
          id: p.id,
          stockType: p.stock_type,
          product: p.product,
          quantity: p.quantity,
          expiryDate: p.expiry_date,
          availability: p.availability,
        }));

        setHomes(prev => prev.map(home => 
          home.id === homeId ? { ...home, products: [...home.products, ...(newProductsForState as HomeItem['products'])] } : home
        ));

      } catch (err: any) {
        console.error('Error parsing bill:', err);
        alert(`An error occurred: ${err.message}`);
      } finally {
        setIsParsingBill(null);
        if (event.target) {
          event.target.value = '';
        }
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Failed to read the image file.');
      setIsParsingBill(null);
    };
  };

  if (isDataLoading) {
    return <div style={{ color: 'white', textAlign: 'center', paddingTop: '2rem' }}>Loading your stock data...</div>;
  }

  return (
    <div style={{ width: '100%', color: '#fff', position: 'relative', fontSize: '14px' }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      {isParsingBill !== null && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ border: '4px solid rgba(255, 255, 255, 0.2)', borderTop: '4px solid #1db954', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>Parsing your bill, please wait...</p>
        </div>
      )}

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
        homes.map((home) => (
          <HomeAccordion
            key={home.id}
            home={home}
            catalog={catalog}
            catalogLoading={catalogLoading}
            isParsingBill={isParsingBill === home.id}
            isAnotherHomeFocused={focusedHomeId !== null && focusedHomeId !== home.id}
            onToggle={toggleHome}
            onDelete={deleteHome}
            onUpdateName={updateHomeName}
            onAddProduct={addProduct}
            onDeleteProduct={deleteProduct}
            onUpdateProduct={updateProduct}
            onUpdateFilters={updateHomeFilters}
            onBillUpload={handleBillUpload}
            onSetFocusedHome={setFocusedHomeId}
          />
        ))
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

      
      {/* Voice Assistant Mic FAB (disabled - prompts to download app) */}
      <button
        type="button"
        onClick={() => setShowMicFeatureDialog(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          backgroundColor: '#1db954',
          boxShadow: '0 4px 12px rgba(29, 185, 84, 0.4)',
          opacity: 0.7,
        }}
        title="Download the app for voice AI features"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>

      {/* Download PWA App Link */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
        <a
          href="https://my-stock-tracker-app.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
          }}
        >
          📲 Download App (PWA)
        </a>
      </div>

      {/* Mic Feature Info Dialog */}
      <InfoDialog
        open={showMicFeatureDialog}
        title="AI Features Available in App"
        message="Download the Stock Tracker app to access AI-powered voice commands, bill scanning, and expiry notifications."
        buttonText="Close"
        onClose={() => setShowMicFeatureDialog(false)}
        linkUrl="https://stock-tracker-pwa-nj.netlify.app"
        linkText="📲 Download App"
      />
    </div>
  );
};
