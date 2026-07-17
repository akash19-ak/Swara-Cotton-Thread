import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrandContext } from '../context/BrandContext';
import ProductCard from '../components/ProductCard';
import { getApiUrl, getImageUrl } from '../apiConfig';
import './Home.css';

export default function Home() {
  const { brand } = useContext(BrandContext);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch trending products
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(getApiUrl('/api/products'));
        if (response.ok) {
          const data = await response.json();
          const trending = data.filter(p => p.isTrending).slice(0, 4);
          setTrendingProducts(trending);
        }
      } catch (err) {
        console.error('Error fetching trending products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchTrending();
  }, []);

  // Auto-play hero slider
  useEffect(() => {
    if (!brand.banners || brand.banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % brand.banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [brand.banners]);

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? brand.banners.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % brand.banners.length);
  };

  const categories = [
    { name: 'Cotton Sarees', image: '/images/saree1.jpg', desc: 'Handwoven with exquisite borders', emoji: '🥻' },
    { name: 'Kurtis', image: '/images/kurti1.jpg', desc: 'Perfect everyday ethnic wear', emoji: '👗' },
    { name: 'Dress Materials', image: '/images/material1.jpg', desc: 'Customize your own block-print outfits', emoji: '🎨' }
  ];

  const stats = [
    { number: '2000+', label: 'Happy Customers' },
    { number: '150+', label: 'Unique Designs' },
    { number: '100%', label: 'Pure Cotton' },
    { number: '15+', label: 'Years Heritage' },
  ];

  const offerTexts = [
    '✦ Free Shipping on Orders Above ₹999',
    '✦ New Collection: Mulmul Florals Are Here',
    '✦ Handcrafted by Indian Artisans',
    '✦ COD Available Pan India',
  ];

  return (
    <div className="home-page">

      {/* Hero Banner Section */}
      {brand.banners && brand.banners.length > 0 && (
        <section className="hero-slider">
          {brand.banners.map((banner, index) => {
            const bannerImg = getImageUrl(banner.image);

            return (
              <div
                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                key={index}
              >
                {/* Full image — no cropping */}
                <img
                  src={bannerImg}
                  alt={banner.title}
                  className="hero-slide-img"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                {/* Dark overlay for text readability */}
                <div className="hero-slide-overlay" />
                <div className="hero-content container">
                  <span className="hero-subtitle">{brand.tagline}</span>
                  <h1 className="serif-title">{banner.title}</h1>
                  <p>{banner.subtitle}</p>
                  <Link to="/products" className="btn btn-primary">
                    ✦ &nbsp;Explore Collection
                  </Link>
                </div>
              </div>
            );
          })}

          {brand.banners.length > 1 && (
            <>
              <button className="slider-arrow left" onClick={handlePrevSlide} aria-label="Previous slide">&#10229;</button>
              <button className="slider-arrow right" onClick={handleNextSlide} aria-label="Next slide">&#10230;</button>

              <div className="slider-dots">
                {brand.banners.map((_, index) => (
                  <button
                    key={index}
                    className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Stats / Trust Section */}
      <section className="stats-section">
        <div className="container stats-grid">
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-number serif-title">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Ethos / Features */}
      <section className="section-padding ethos-section">
        <div className="container ethos-grid">
          <div className="ethos-card">
            <div className="ethos-icon">🌾</div>
            <h3 className="serif-title">100% Pure Cotton</h3>
            <p>Breathable, eco-friendly, and perfect for hot climates. We use only natural cotton fibers sourced from trusted weavers.</p>
          </div>
          <div className="ethos-card">
            <div className="ethos-icon">🎨</div>
            <h3 className="serif-title">Handcrafted Prints</h3>
            <p>Traditional hand-block prints, Indigo prints, and heritage Kalamkari designs — each piece tells a story.</p>
          </div>
          <div className="ethos-card">
            <div className="ethos-icon">🤝</div>
            <h3 className="serif-title">Artisan Support</h3>
            <p>Sourced directly from traditional handloom weavers across India's iconic heritage centers.</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-padding bg-secondary-section">
        <div className="container">
          <div className="section-header">
            <h2 className="serif-title">Shop By Category</h2>
            <p>Explore our premium collections of sarees, kurtis, and unstitched sets</p>
          </div>

          <div className="categories-grid">
            {categories.map((cat, index) => (
              <Link to={`/products?category=${encodeURIComponent(cat.name)}`} className="category-card" key={index}>
                <div className="category-image-wrap">
                  <img src={cat.image} alt={cat.name} onError={(e) => {
                    e.target.src = 'https://placehold.co/400x500/f6f3eb/2b2523?text=' + cat.name;
                  }} />
                  <div className="category-overlay">
                    <span className="btn btn-secondary">Explore {cat.emoji}</span>
                  </div>
                </div>
                <div className="category-info">
                  <h3 className="serif-title">{cat.name}</h3>
                  <p>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending / Featured Products */}
      <section className="section-padding container trending-section">
        <div className="section-header">
          <h2 className="serif-title">Trending Styles</h2>
          <p>Handpicked favorites loved by our customers</p>
        </div>

        {loadingProducts ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="shimmer" style={{ height: '320px', borderRadius: '12px 12px 0 0' }} />
                <div style={{ padding: '1.2rem', background: '#fff', borderRadius: '0 0 12px 12px' }}>
                  <div className="shimmer" style={{ height: '14px', marginBottom: '0.6rem', width: '70%' }} />
                  <div className="shimmer" style={{ height: '12px', width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : trendingProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>New arrivals coming soon!</p>
          </div>
        ) : (
          <div className="grid-4">
            {trendingProducts.map(product => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <Link to="/products" className="btn btn-accent">
            View All Products &rarr;
          </Link>
        </div>
      </section>

      {/* Location / Visit Us Section */}
      <section className="section-padding location-section">
        <div className="container location-grid">
          <div className="location-map-card">
            <iframe
              title="Swara Cotton Thread Location"
              src="https://www.google.com/maps?q=18.5475,73.9258&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="location-details-card">
            <span className="story-subtitle">Visit Our Store</span>
            <h2 className="serif-title">Find Swara Cotton Thread on the map</h2>
            <p>{brand.address || 'Your store address will appear here.'}</p>
            {/* <p className="location-coordinates">18°32'51.0"N 73°55'32.9"E</p> */}
            <a
              href="https://www.google.com/maps?q=18.5475,73.9258"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Open Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="section-padding brand-story-section">
        <div className="container story-container">
          <div className="story-image">
            <img src="/images/banner1.jpg" alt="Weaving Heritage" onError={(e) => {
              e.target.src = 'https://placehold.co/600x400/f6f3eb/2b2523?text=Heritage';
            }} />
          </div>
          <div className="story-content">
            <span className="story-subtitle">The Swara Ethos</span>
            <h2 className="serif-title">Threads that weave comfort &amp; tradition</h2>
            <p>
              At Swara Cotton Thread, we believe that fashion should be as comfortable as it is elegant.
              Our design journey began with a mission to revive handloom pure cotton prints,
              connecting boutique enthusiasts directly with India's rich artisanal heritage.
            </p>
            <p>
              Each weave is selected for its high thread count and breathability, colored in natural organic dyes,
              and detailed with legacy hand-block patterns. When you wear Swara, you carry a piece of art,
              crafted patiently by hand.
            </p>
            <Link to="/products" className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
              Discover Our Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
