import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { getImageUrl } from '../apiConfig';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  // Handle MongoDB and local file IDs
  const productId = product.id || product._id;
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg';
  const displayImage = mainImage.startsWith('/') && !mainImage.startsWith('/images/')
    ? getImageUrl(mainImage)
    : mainImage;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size';
    addToCart(product, 1, defaultSize);
  };

  return (
    <Link to={`/product/${productId}`} className="product-card animate-fade-in">
      <div className="product-card-badge">
        {product.isTrending && <span className="badge badge-trending">Trending</span>}
        {!product.inStock && <span className="badge badge-stock-out">Out of Stock</span>}
        {product.inStock && discount > 0 && <span className="badge badge-sale">{discount}% OFF</span>}
      </div>

      <div className="product-card-img-wrapper">
        <img 
          src={displayImage} 
          alt={product.name} 
          className="product-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x400/f6f3eb/2b2523?text=Swara+Cotton';
          }}
        />
      </div>

      <div className="product-card-info">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-title">{product.name}</h3>
        
        <p className="product-card-desc">{product.description}</p>
        
        <div className="product-card-price-row">
          <span className="product-card-price">₹{product.price}</span>
          {product.originalPrice && (
            <span className="product-card-original-price">₹{product.originalPrice}</span>
          )}
        </div>

        <button 
          className="btn btn-secondary btn-sm" 
          onClick={handleQuickAdd}
          disabled={!product.inStock}
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
        >
          {product.inStock ? 'Quick Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </Link>
  );
}
