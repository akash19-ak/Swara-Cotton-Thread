import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('swara_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('swara_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, size = 'Free Size') => {
    setCartItems(prevItems => {
      // Handles MongoDB products where standard id is _id
      const prodId = product.id || product._id;
      const existingIndex = prevItems.findIndex(
        item => item.id === prodId && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      }

      return [...prevItems, {
        id: prodId,
        name: product.name,
        price: product.price,
        images: product.images,
        category: product.category,
        selectedSize: size,
        quantity: quantity
      }];
    });
    setIsDrawerOpen(true);
  };

  const removeFromCart = (id, size) => {
    setCartItems(prevItems => prevItems.filter(
      item => !(item.id === id && item.selectedSize === size)
    ));
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCartItems(prevItems => prevItems.map(
      item => (item.id === id && item.selectedSize === size)
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isDrawerOpen,
      setIsDrawerOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
