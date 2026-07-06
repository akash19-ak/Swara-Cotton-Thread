import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { BrandContext } from '../context/BrandContext';
import ProductCard from '../components/ProductCard';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { brand } = useContext(BrandContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Selection states
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Fetch product and related products
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        setActiveImageIndex(0);

        // Pre-select first size
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        } else {
          setSelectedSize('Free Size');
        }

        // Fetch related products of same category
        const relResponse = await fetch('http://localhost:5000/api/products');
        if (relResponse.ok) {
          const relData = await relResponse.json();
          // Find products in same category, excluding current product
          const currentId = data.id || data._id;
          const filtered = relData
            .filter(p => p.category === data.category && (p.id || p._id) !== currentId)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container details-loading">
        <div className="spinner"></div>
        <p>Polishing threads...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container details-error">
        <h3>Product Not Found</h3>
        <p>The dress you are looking for might have been sold out or archived.</p>
        <Link to="/products" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    addToCart(product, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    // Immediate direct WhatsApp checkout for this item
    const displayTotal = product.price * quantity;
    let message = `Hello *${brand.name}*,\n\nI would like to instantly order this dress:\n\n`;
    message += `*Product Name:* ${product.name}\n`;
    message += `*Category:* ${product.category}\n`;
    message += `*Selected Size:* ${selectedSize}\n`;
    message += `*Price:* ₹${product.price} each\n`;
    message += `*Quantity:* ${quantity}\n`;
    message += `*Total Value:* *₹${displayTotal}*\n\n`;
    message += `Is this available for shipping? Please confirm payment instructions. Thank you!`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${brand.whatsappNumber}?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
  };

  // Resolve image paths
  const getFullImgPath = (img) => {
    if (!img) return 'https://placehold.co/400x533/f6f3eb/2b2523?text=Swara+Cotton';
    return img.startsWith('/') && !img.startsWith('/images/')
      ? `http://localhost:5000${img}`
      : img;
  };

  const images = product.images && product.images.length > 0 ? product.images : [null];

  return (
    <div className="product-details-page container animate-fade-in">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> &gt; <Link to="/products">Shop</Link> &gt; <Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link> &gt; <span>{product.name}</span>
      </div>

      <div className="details-layout">
        
        {/* Product Images Gallery */}
        <div className="details-gallery">
          {images.length > 1 && (
            <div className="thumbnail-list">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  className={`thumbnail-btn ${idx === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={getFullImgPath(img)} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          <div className="main-image-container">
            <img 
              src={getFullImgPath(images[activeImageIndex])} 
              alt={product.name}
              className="main-display-image"
              onError={(e) => {
                e.target.src = 'https://placehold.co/400x533/f6f3eb/2b2523?text=No+Image';
              }}
            />
            {discount > 0 && <span className="gallery-discount-tag">-{discount}% OFF</span>}
          </div>
        </div>

        {/* Product Details info sheet */}
        <div className="details-info-sheet">
          <span className="details-category">{product.category}</span>
          <h1 className="serif-title details-title">{product.name}</h1>

          <div className="details-price-row">
            <span className="details-price">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="details-original-price">₹{product.originalPrice}</span>
                <span className="details-saved">Save ₹{product.originalPrice - product.price}</span>
              </>
            )}
          </div>

          <p className="details-description">{product.description}</p>

          {/* Size Select pills */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="details-size-selector">
              <span className="selection-label">Select Size:</span>
              <div className="size-pills">
                {product.sizes.map((sz, idx) => (
                  <button
                    key={idx}
                    className={`size-pill ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="details-quantity-selector">
            <span className="selection-label">Quantity:</span>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} disabled={quantity <= 1}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="details-actions">
            <button 
              className="btn btn-accent btn-add-cart" 
              onClick={handleAdd}
              disabled={!product.inStock}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            <button 
              className="btn btn-whatsapp btn-buy-now" 
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              Direct Buy on WhatsApp
            </button>
          </div>

          {/* Shipping / Trust info */}
          <div className="details-trust-points">
            <div className="trust-point">
              <span className="trust-icon">📦</span>
              <div>
                <strong>Safe Delivery</strong>
                <p>Express dispatch after payment verification on WhatsApp.</p>
              </div>
            </div>
            <div className="trust-point">
              <span className="trust-icon">🧶</span>
              <div>
                <strong>Traditional Fabrics</strong>
                <p>Guaranteed 100% comfort cotton and genuine block dyes.</p>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="details-specs">
            <h4 className="serif-title">Dress Specifications</h4>
            <table className="specs-table">
              <tbody>
                <tr>
                  <td>Category</td>
                  <td>{product.category}</td>
                </tr>
                <tr>
                  <td>Material</td>
                  <td>100% Handloom Cotton</td>
                </tr>
                <tr>
                  <td>Sizes Available</td>
                  <td>{product.sizes ? product.sizes.join(', ') : 'Free Size'}</td>
                </tr>
                <tr>
                  <td>Wash Care</td>
                  <td>Gentle handwash separately in cold water</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="section-header">
            <h2 className="serif-title">You May Also Like</h2>
            <p>Handpicked ethnic items in the same collection</p>
          </div>
          <div className="grid-4">
            {relatedProducts.map(relProduct => (
              <ProductCard key={relProduct.id || relProduct._id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
