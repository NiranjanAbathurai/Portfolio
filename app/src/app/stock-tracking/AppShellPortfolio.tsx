import { useState, useEffect } from 'react';
import type { Tab, HomeItem, Product, CatalogCategory } from './types';
import { supabase } from './supabase-database';
import * as api from './homeApi';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SideDrawer } from './components/SideDrawer';
import { RestrictedFeatureFAB } from './components/RestrictedFeatureFAB';
import { DashboardScreen } from './screens/DashboardScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { InfoDialog } from '../shared/ui/ConfirmDialog';

interface AppShellPortfolioProps {
  onLogout: () => void;
}

export const AppShellPortfolio = ({ onLogout }: AppShellPortfolioProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedHomeId, setSelectedHomeId] = useState<number | null>(null);
  const [homes, setHomes] = useState<HomeItem[]>([]);
  const [catalog, setCatalog] = useState<CatalogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.['full_name'] || user.email?.split('@')[0] || 'User';
        setUserName(name);
        setUserEmail(user.email || '');
      }
    };
    fetchUser();
  }, []);

  // Fetch homes and catalog
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Load homes
        const homesFromApi = await api.getHomesWithProducts();
        const formattedHomes: HomeItem[] = homesFromApi.map((home: any) => ({
          ...home,
          expanded: false,
          filters: { availability: 'all', stockType: 'all' },
          products: (home.products || []).map((p: any) => {
            const expiryDate = p.expiry_date ? new Date(p.expiry_date) : null;
            const isExpired = expiryDate && expiryDate < today;
            const wasAvailable = p.availability === 'Yes';
            const isNowExpiredAndUnavailable = isExpired && wasAvailable;
            const availability = isNowExpiredAndUnavailable ? 'No' : p.availability;

            return {
              id: p.id,
              stockType: p.stock_type || '',
              product: p.product || '',
              quantity: availability === 'No' && !isNowExpiredAndUnavailable ? '' : (p.quantity || ''),
              expiryDate: availability === 'No' && !isNowExpiredAndUnavailable ? '' : (p.expiry_date || ''),
              availability: availability as Product['availability'],
              isExpired: !!isNowExpiredAndUnavailable,
            };
          }),
        }));
        setHomes(formattedHomes);

        // Auto-select first home
        if (formattedHomes.length > 0) {
          setSelectedHomeId(formattedHomes[0].id);
        }

        // Load catalog
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, items(id, name)')
          .order('name');
        if (!error && data) {
          setCatalog(data);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // ============================================================
  // CRUD Operations
  // ============================================================

  const handleAddProduct = async (homeId: number) => {
    try {
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
        products: [...h.products, {
          id: newProductFromApi.id,
          stockType: newProductFromApi.stock_type || '',
          product: newProductFromApi.product || '',
          quantity: newProductFromApi.quantity || '',
          expiryDate: newProductFromApi.expiry_date || '',
          availability: newProductFromApi.availability || '',
        } as Product],
      } : h));
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    }
  };

  const handleUpdateProduct = async (homeId: number, productId: number, fields: Partial<Product>) => {
    // Optimistic update
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
      console.error('Error updating product:', error);
      alert('Failed to save changes.');
    }
  };

  const handleDeleteProduct = async (homeId: number, productId: number) => {
    try {
      await api.removeProduct(productId);
      setHomes((prev) =>
        prev.map((home) =>
          home.id === homeId
            ? { ...home, products: home.products.filter((p) => p.id !== productId) }
            : home
        )
      );
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    }
  };

  const handleAddHome = async (name: string) => {
    try {
      const newHomeFromApi = await api.addHome(name);
      const newHome: HomeItem = {
        ...newHomeFromApi,
        expanded: false,
        filters: { availability: 'all', stockType: 'all' },
        products: [],
      };
      setHomes((prev) => [...prev, newHome]);
      setSelectedHomeId(newHome.id);
    } catch (error) {
      console.error('Error adding home:', error);
      alert('Failed to add home.');
    }
  };

  const handleDeleteHome = async (homeId: number) => {
    try {
      await api.removeHome(homeId);
      setHomes((prev) => prev.filter((h) => h.id !== homeId));
      if (selectedHomeId === homeId) {
        const remaining = homes.filter((h) => h.id !== homeId);
        setSelectedHomeId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (error) {
      console.error('Error deleting home:', error);
      alert('Failed to delete home.');
    }
  };

  // ============================================================
  // Render
  // ============================================================

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '60vh',
        gap: '12px',
      }}>
        <style>{`
          @keyframes stSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--st-bg-input, #334155)',
          borderTopColor: 'var(--st-accent-green, #22C55E)',
          borderRadius: '50%',
          animation: 'stSpin 0.8s linear infinite',
        }} />
        <p style={{ color: 'var(--st-text-secondary, #94A3B8)', fontSize: '0.85rem' }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '70vh' }}>
      {/* CSS Variables */}
      <style>{`
        .st-shell {
          --st-bg-primary: #0F172A;
          --st-bg-card: #1E293B;
          --st-bg-input: #334155;
          --st-nav-bg: #0F172A;
          --st-border-color: #334155;
          --st-text-primary: #F8FAFC;
          --st-text-secondary: #94A3B8;
          --st-accent-green: #22C55E;
          --st-accent-red: #EF4444;
        }
      `}</style>

      <div className="st-shell" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--st-bg-primary, #0F172A)', borderRadius: '12px', overflow: 'hidden' }}>
        {/* Header */}
        <Header
          activeTab={activeTab}
          onHamburgerClick={() => setDrawerOpen(true)}
          onNotificationClick={() => setShowNotificationDialog(true)}
        />

        {/* Side Drawer */}
        <SideDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          homes={homes}
          selectedHomeId={selectedHomeId}
          onSelectHome={setSelectedHomeId}
        />

        {/* Main Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: '80px' }}>
          {activeTab === 'dashboard' && (
            <DashboardScreen
              homes={homes}
              selectedHomeId={selectedHomeId}
              onSelectHome={setSelectedHomeId}
              userName={userName}
            />
          )}
          {activeTab === 'inventory' && (
            <InventoryScreen
              homes={homes}
              selectedHomeId={selectedHomeId}
              catalog={catalog}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onAddProduct={handleAddProduct}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileScreen
              userName={userName}
              userEmail={userEmail}
              homes={homes}
              onLogout={onLogout}
              onAddHome={handleAddHome}
              onDeleteHome={handleDeleteHome}
            />
          )}
        </main>

        {/* Voice FAB (restricted) */}
        <RestrictedFeatureFAB />

        {/* Bottom Nav */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Notification Bell Dialog */}
      <InfoDialog
        open={showNotificationDialog}
        title="Push Notifications - App Only"
        message="Download the Stock Tracker app to receive push notifications when your products are about to expire."
        buttonText="Close"
        onClose={() => setShowNotificationDialog(false)}
        linkUrl="https://my-stock-tracker-app.netlify.app/?install=true"
        linkText="📲 Download App"
      />
    </div>
  );
};
