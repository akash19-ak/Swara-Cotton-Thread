import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// Providers
import { BrandProvider, BrandContext } from './context/BrandContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Styles
import './App.css';

/* Floating Admin FAB — hidden when already on admin pages */
function AdminFAB() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  if (isAdminPage) return null;
  return (
    <Link to="/admin/dashboard" className="admin-fab" title="Admin Panel" aria-label="Admin Panel">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 15.54a5 5 0 0 1 0-7.07"/>
      </svg>
      <span>Admin</span>
    </Link>
  );
}

function SplashScreen({ logo }) {
  return (
    <div className="splash-screen" aria-hidden="true">
      <div className="splash-backdrop" />
      <div className="splash-card">
        <div className="splash-logo-wrapper">
          <img src={logo} alt="Swara Cotton Thread" className="splash-logo" />
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { brand } = useContext(BrandContext);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen logo={brand?.logo ?? '/images/sctlogo.png'} />}
      <div className="app-container">
        {/* Navbar */}
        <Navbar />

        {/* Slide-out Cart Drawer */}
        <CartDrawer />

        {/* Floating Admin Button (bottom-right corner) */}
        <AdminFAB />

        {/* Main Pages */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <BrandProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </BrandProvider>
  );
}

export default App;
