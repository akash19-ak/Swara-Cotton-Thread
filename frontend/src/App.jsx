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
import WhatsAppButton from './components/WhatsAppButton';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Styles
import './App.css';

/* Admin FAB removed — admin access is available only via footer */

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

        {/* Admin button removed from main screen; use footer button */}

        {/* Main Pages */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
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

        {/* Floating WhatsApp chat button */}
        <WhatsAppButton />

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
