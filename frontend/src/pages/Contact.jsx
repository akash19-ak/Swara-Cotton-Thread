import React, { useContext } from 'react';
import { BrandContext } from '../context/BrandContext';
import './Home.css';

export default function Contact() {
  const { brand } = useContext(BrandContext);
  return (
    <div className="contact-page section-padding">
      <div className="container">
        <div className="section-header">
          <h2 className="serif-title">Contact Us</h2>
          <p>Have a question? Reach out for custom orders, fabric requests, or WhatsApp support.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <h3>Reach Us</h3>
            <p><strong>Phone / WhatsApp:</strong> <a href={`https://wa.me/${brand.whatsappNumber}`} target="_blank" rel="noreferrer">{brand.whatsappNumber}</a></p>
            <p><strong>Email:</strong> <a href={`mailto:${brand.email}`}>{brand.email}</a></p>
            <p><strong>Address:</strong><br />{brand.address}</p>
          </div>
          <div className="contact-card contact-card-secondary">
            <h3>Visit our store</h3>
            <p>Send your design ideas via WhatsApp and we can share handloom recommendations or fabric bundles.</p>
            <p>We are happy to help with bulk order styling and match your saree or kurti preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
