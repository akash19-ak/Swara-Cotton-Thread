import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BrandContext } from '../context/BrandContext';
import './Footer.css';

export default function Footer() {
  const { brand } = useContext(BrandContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top container">
        <div className="footer-brand-info">
          <h3 className="serif-title footer-title">{brand.name}</h3>
          <p className="footer-desc">{brand.description}</p>
          <div className="footer-socials">
            <a href={`https://wa.me/${brand.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="social-icon whatsapp" aria-label="Chat on WhatsApp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4 className="serif-title footer-section-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            {/* <li><Link to="/admin/dashboard">Admin Dashboard</Link></li> */}
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="serif-title footer-section-title">Categories</h4>
          <ul className="footer-links">
            <li><Link to="/products?category=Cotton%20Sarees">Cotton Sarees</Link></li>
            <li><Link to="/products?category=Kurtis">Kurtis</Link></li>
            <li><Link to="/products?category=Dress%20Materials">Dress Materials</Link></li>
          </ul>
        </div>

        <div className="footer-contact-info">
          <h4 className="serif-title footer-section-title">Contact Us</h4>
          <ul className="footer-contact-list">
            <li>
              <span className="contact-label">WhatsApp:</span>
              <a href={`https://wa.me/${brand.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                +{brand.whatsappNumber}
              </a>
            </li>
            <li>
              <span className="contact-label">Email:</span>
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </li>
            <li className="contact-address">
              <span className="contact-label">Address:</span>
              <p>{brand.address}</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="copyright-text">
            &copy; {currentYear} <strong>{brand.name}</strong>. All rights reserved.
          </p>
          <p className="footer-credits">
            Crafted with traditional heritage & premium quality threads.
          </p>
        </div>
      </div>
    </footer>
  );
}
