import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { BrandContext } from '../context/BrandContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const { 
    cartItems, 
    cartTotal, 
    isDrawerOpen, 
    setIsDrawerOpen, 
    updateQuantity, 
    removeFromCart 
  } = useContext(CartContext);

  const { brand } = useContext(BrandContext);
  const navigate = useNavigate();
  const drawerRef = useRef();

  // Close drawer on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isDrawerOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDrawerOpen, setIsDrawerOpen]);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  // Construct WhatsApp checkout message
  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let message = `Hello *${brand.name}*,\n\nI would like to place an order for the following cotton dresses:\n\n`;
    
    cartItems.forEach((item, index) => {
      const displayPrice = item.price * item.quantity;
      message += `*${index + 1}. ${item.name}*\n`;
      message += `   Size: _${item.selectedSize}_\n`;
      message += `   Qty: ${item.quantity} x ₹${item.price} = *₹${displayPrice}*\n\n`;
    });

    message += `-------------------------\n`;
    message += `*Total Order Value: ₹${cartTotal}*\n\n`;
    message += `Please confirm availability and sharing details for payment and shipping. Thank you!`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${brand.whatsappNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleViewCart = () => {
    setIsDrawerOpen(false);
    navigate('/cart');
  };

  return (
    <div className={`cart-drawer-overlay ${isDrawerOpen ? 'open' : ''}`}>
      <div className={`cart-drawer ${isDrawerOpen ? 'open' : ''}`} ref={drawerRef}>
        
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <h3 className="serif-title">Shopping Cart</h3>
          <button className="close-btn" onClick={() => setIsDrawerOpen(false)} aria-label="Close cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="close-icon"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Drawer Items Content */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-bag-icon"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <p>Your shopping bag is empty.</p>
              <button 
                className="btn btn-primary" 
                style={{ marginTop: '1.5rem' }}
                onClick={() => { setIsDrawerOpen(false); navigate('/products'); }}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item, index) => {
                const itemImg = item.images && item.images.length > 0 ? item.images[0] : '/images/placeholder.jpg';
                const displayImg = itemImg.startsWith('/') && !itemImg.startsWith('/images/')
                  ? `http://localhost:5000${itemImg}` 
                  : itemImg;
                  
                return (
                  <div className="cart-drawer-item" key={`${item.id}-${item.selectedSize}-${index}`}>
                    <div className="cart-item-image">
                      <img 
                        src={displayImg} 
                        alt={item.name} 
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/100x120/f6f3eb/2b2523?text=Dress';
                        }}
                      />
                    </div>
                    <div className="cart-item-details">
                      <span className="cart-item-category">{item.category}</span>
                      <h4 className="cart-item-name">{item.name}</h4>
                      <p className="cart-item-size">Size: {item.selectedSize}</p>
                      
                      <div className="cart-item-actions">
                        <div className="quantity-selector">
                          <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}>+</button>
                        </div>
                        
                        <span className="cart-item-price">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                    <button 
                      className="item-delete-btn" 
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      aria-label="Remove item"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="trash-icon"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer Summary */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal-row">
              <span>Subtotal:</span>
              <span className="subtotal-price">₹{cartTotal}</span>
            </div>
            <p className="cart-tax-notice">Shipping and taxes calculated at checkout.</p>
            
            <div className="cart-drawer-buttons">
              <button className="btn btn-secondary" onClick={handleViewCart}>
                View Details Cart
              </button>
              
              <button className="btn btn-whatsapp" onClick={handleWhatsAppCheckout}>
                <svg 
                  className="whatsapp-btn-icon" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }}
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.01 14.069.99 11.503.99 6.069.99 1.644 5.361 1.64 10.79c-.001 1.765.485 3.491 1.408 5.025l-1.082 3.95 4.09-1.061zm11.148-7.508c-.303-.151-1.793-.883-2.073-.984-.28-.102-.483-.151-.686.151-.204.304-.787 1.029-.965 1.233-.177.204-.355.226-.658.076-.303-.151-1.278-.47-2.435-1.502-.9-.802-1.507-1.793-1.684-2.097-.177-.302-.018-.467.133-.617.137-.136.303-.355.456-.53.151-.178.203-.304.303-.508.102-.203.051-.381-.025-.533-.076-.152-.686-1.653-.94-2.264-.249-.597-.501-.515-.686-.525-.177-.01-.381-.01-.583-.01-.203 0-.533.076-.812.381-.28.304-1.067 1.041-1.067 2.54 0 1.499 1.092 2.946 1.243 3.149.153.204 2.15 3.284 5.208 4.601.727.313 1.295.5 1.737.64.73.232 1.396.199 1.922.121.587-.087 1.793-.733 2.047-1.402.255-.668.255-1.242.177-1.359-.076-.118-.28-.204-.583-.354z" />
                </svg>
                Buy via WhatsApp
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
