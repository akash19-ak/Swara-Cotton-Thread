import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { BrandContext } from '../context/BrandContext';
import './Cart.css';

export default function Cart() {
  const { 
    cartItems, 
    cartTotal, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useContext(CartContext);
  
  const { brand } = useContext(BrandContext);
  const navigate = useNavigate();

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let message = `Hello *${brand.name}*,\n\nI would like to order the following handwoven cotton items from your website:\n\n`;
    
    cartItems.forEach((item, index) => {
      const lineTotal = item.price * item.quantity;
      message += `*${index + 1}. ${item.name}*\n`;
      message += `   Size: _${item.selectedSize}_\n`;
      message += `   Price: ₹${item.price} each\n`;
      message += `   Quantity: ${item.quantity}  |  Subtotal: *₹${lineTotal}*\n\n`;
    });

    message += `-------------------------\n`;
    message += `*Grand Total: ₹${cartTotal}*\n\n`;
    message += `Customer Info: [Please enter your name & full address below]\n`;
    message += `Name:\n`;
    message += `Shipping Address:\n`;
    message += `Pincode:\n\n`;
    message += `Please confirm stock availability and share dispatch schedules. Thank you!`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${brand.whatsappNumber}?text=${encoded}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="cart-page container animate-fade-in">
      <div className="cart-header">
        <h1 className="serif-title">Shopping Bag</h1>
        <p>You have {cartItems.length} unique items in your list</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty-state">
          <div className="cart-empty-icon">🛍️</div>
          <h2>Your bag is feeling light!</h2>
          <p>Explore our comfort-crafted cotton collections and find your perfect summer look.</p>
          <Link to="/products" className="btn btn-primary">
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="cart-content-grid">
          
          {/* Cart items list */}
          <div className="cart-items-panel">
            <div className="cart-items-header">
              <span>Product Details</span>
              <span>Quantity</span>
              <span>Subtotal</span>
            </div>

            <div className="cart-items-body">
              {cartItems.map((item, idx) => {
                const mainImg = item.images && item.images.length > 0 ? item.images[0] : '/images/placeholder.jpg';
                const displayImg = mainImg.startsWith('/') && !mainImg.startsWith('/images/')
                  ? `http://localhost:5000${mainImg}` 
                  : mainImg;

                return (
                  <div className="cart-page-item" key={`${item.id}-${item.selectedSize}-${idx}`}>
                    <div className="cart-page-item-details">
                      <div className="cart-page-item-img">
                        <img 
                          src={displayImg} 
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/100x133/f6f3eb/2b2523?text=Dress';
                          }}
                        />
                      </div>
                      <div className="cart-page-item-info">
                        <span className="cart-item-category">{item.category}</span>
                        <h4>{item.name}</h4>
                        <p>Selected Size: <strong>{item.selectedSize}</strong></p>
                        <p className="unit-price">Unit Price: ₹{item.price}</p>
                        
                        <button 
                          className="cart-remove-link" 
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="cart-page-item-qty">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}>+</button>
                      </div>
                    </div>

                    <div className="cart-page-item-total">
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-panel-actions">
              <Link to="/products" className="btn btn-secondary btn-sm">
                &larr; Continue Shopping
              </Link>
              <button className="btn btn-secondary btn-sm text-danger" onClick={clearCart} style={{ borderColor: 'rgba(211, 47, 47, 0.2)' }}>
                Empty Shopping Bag
              </button>
            </div>
          </div>

          {/* Cart summary box */}
          <div className="cart-summary-panel">
            <h3 className="serif-title">Order Summary</h3>
            
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="summary-row">
                <span>Estimated Shipping</span>
                <span className="text-accent">FREE</span>
              </div>
              <div className="summary-row promo">
                <span>Discount Offers</span>
                <span>-</span>
              </div>
              
              <div className="summary-row grand-total">
                <span>Grand Total</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>

            <div className="checkout-notice">
              <p>
                💡 <strong>Direct Checkout on WhatsApp:</strong> We process orders via WhatsApp to verify size 
                and shipping addresses. Click below to initiate direct communication!
              </p>
            </div>

            <button className="btn btn-whatsapp checkout-btn" onClick={handleWhatsAppCheckout}>
              <svg 
                className="whatsapp-btn-icon" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                style={{ width: '20px', height: '20px', marginRight: '10px', verticalAlign: 'middle' }}
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.01 14.069.99 11.503.99 6.069.99 1.644 5.361 1.64 10.79c-.001 1.765.485 3.491 1.408 5.025l-1.082 3.95 4.09-1.061zm11.148-7.508c-.303-.151-1.793-.883-2.073-.984-.28-.102-.483-.151-.686.151-.204.304-.787 1.029-.965 1.233-.177.204-.355.226-.658.076-.303-.151-1.278-.47-2.435-1.502-.9-.802-1.507-1.793-1.684-2.097-.177-.302-.018-.467.133-.617.137-.136.303-.355.456-.53.151-.178.203-.304.303-.508.102-.203.051-.381-.025-.533-.076-.152-.686-1.653-.94-2.264-.249-.597-.501-.515-.686-.525-.177-.01-.381-.01-.583-.01-.203 0-.533.076-.812.381-.28.304-1.067 1.041-1.067 2.54 0 1.499 1.092 2.946 1.243 3.149.153.204 2.15 3.284 5.208 4.601.727.313 1.295.5 1.737.64.73.232 1.396.199 1.922.121.587-.087 1.793-.733 2.047-1.402.255-.668.255-1.242.177-1.359-.076-.118-.28-.204-.583-.354z" />
              </svg>
              Complete Purchase via WhatsApp
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
