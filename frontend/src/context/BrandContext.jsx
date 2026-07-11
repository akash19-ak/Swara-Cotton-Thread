import React, { createContext, useState, useEffect } from 'react';

export const BrandContext = createContext();

export const BrandProvider = ({ children }) => {
  const initialBrand = {
    name: "Swara Cotton Thread",
    tagline: "Threads of Heritage, Comfort of Cotton",
    description: "Welcome to Swara Cotton Thread, where we curate the finest handcrafted cotton sarees, kurtis, and dress materials. Each piece is selected for its superior quality thread, ethnic prints, and comfortable fit, celebrating traditional Indian craftsmanship in modern silhouettes.",
    logo: "/images/sctlogo.png",
    categories: ["Cotton Sarees", "Kurtis", "Dress Materials"],
    banners: [
      { image: "/images/banner1.jpg", title: "Summer Handloom Edit", subtitle: "Experience pure comfort in our handcrafted cotton sarees" },
      { image: "/images/banner2.jpg", title: "Ethnic Kurtis Collection", subtitle: "Trendy block prints for your everyday look" }
    ],
    gallery: [],
    whatsappNumber: "919021667151",
    email: "nageshrivnayak@gmail.com",
    address: "Swara Cotton Thread, 12, Handloom Market, Ring Road, Surat, Gujarat - 395002"
  };
  const [brand, setBrand] = useState(initialBrand);
  const [loading, setLoading] = useState(true);

  const fetchBrand = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/brand');
      if (response.ok) {
        const data = await response.json();
        setBrand(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching brand settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, []);

  return (
    <BrandContext.Provider value={{ brand, setBrand, loading, refreshBrand: fetchBrand }}>
      {children}
    </BrandContext.Provider>
  );
};
