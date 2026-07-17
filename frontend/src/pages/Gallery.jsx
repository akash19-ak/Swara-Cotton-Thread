import React, { useContext } from 'react';
import { BrandContext } from '../context/BrandContext';
import { getImageUrl } from '../apiConfig';
import './Home.css';

export default function Gallery() {
  const { brand } = useContext(BrandContext);
  const galleryImages = Array.isArray(brand.gallery) ? brand.gallery : [];

  return (
    <div className="gallery-page section-padding">
      <div className="container">
        <div className="section-header">
          <h2 className="serif-title">Gallery</h2>
          <p>Browse the latest swara cotton inspirations, fabric details, and curated sari looks.</p>
        </div>

        {galleryImages.length === 0 ? (
          <div className="empty-catalog-state">
            <p>No gallery images have been added yet. Please add gallery pictures from the admin panel.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {galleryImages.map((img, index) => {
              const imgSrc = getImageUrl(img);
              return (
                <div className="gallery-card" key={index}>
                  <img src={imgSrc} alt={`Gallery ${index + 1}`} onError={(e) => { e.target.src = 'https://placehold.co/500x500/f6f3eb/2b2523?text=Gallery'; }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
