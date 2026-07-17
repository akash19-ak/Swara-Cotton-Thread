import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { BrandContext } from '../context/BrandContext';
import './Navbar.css';

export default function Navbar() {
  const { cartCount, setIsDrawerOpen } = useContext(CartContext);
  const { brand } = useContext(BrandContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Determine logo source:
  // - if logo points to frontend public `/images/...` use it as-is
  // - if logo points to backend uploads like `/uploads/...` prefix backend origin
  const logoSrc = brand.logo && brand.logo.startsWith('/')
    ? getImageUrl(brand.logo)
    : brand.logo;

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo-link" onClick={() => setMobileMenuOpen(false)}>
          <div className="navbar-brand-wrap">
            {brand.logo ? (
              <img src={logoSrc} alt={brand.name} className="navbar-logo" />
            ) : null}

            <div className="navbar-brand-text">
              <span className="navbar-brand-name serif-title">{brand.name}</span>
              <span className="navbar-brand-tag">{brand.tagline}</span>
            </div>
          </div>
        </Link>

        {/* Mobile menu trigger */}
        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation links */}
        <ul className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/products" 
              className={isActive('/products') ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop Collection
            </Link>
          </li>
          <li>
            <Link 
              to="/gallery" 
              className={isActive('/gallery') ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={isActive('/contact') ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Shopping Cart button */}
        <div className="navbar-actions">
          <button 
            className="navbar-cart-trigger" 
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open cart"
          >
            <svg 
              className="cart-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}
