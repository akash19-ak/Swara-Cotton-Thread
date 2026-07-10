import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { BrandContext } from '../context/BrandContext';
import './ProductList.css';

export default function ProductList() {
  const { brand } = useContext(BrandContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categoriesList, setCategoriesList] = useState(['All']);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [priceLimit, setPriceLimit] = useState(3000);

  // Sync category state with search query param
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  useEffect(() => {
    const categoryOptions = Array.isArray(brand?.categories) && brand.categories.length > 0
      ? brand.categories
      : ['Cotton Sarees', 'Kurtis', 'Dress Materials'];
    setCategoriesList(['All', ...categoryOptions]);
  }, [brand]);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          
          // Find the max price to set dynamic limit
          if (data.length > 0) {
            const prices = data.map(p => p.price);
            const highest = Math.max(...prices);
            setPriceLimit(highest);
            setMaxPrice(highest);
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter application
  useEffect(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search term filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(term) || 
             (p.description && p.description.toLowerCase().includes(term))
      );
    }

    // Price Filter
    result = result.filter(p => p.price <= maxPrice);

    setFilteredProducts(result);
  }, [products, selectedCategory, searchTerm, maxPrice]);

  const handleCategoryClick = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setMaxPrice(priceLimit);
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  return (
    <div className="product-list-page container">
      <div className="shop-header animate-fade-in">
        <h1 className="serif-title">Our Collections</h1>
        <p>Browse through our premium range of comfort-crafted traditional weaves</p>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="shop-controls-container">
        
        {/* Text Search */}
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search dresses, prints..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>&times;</button>
          )}
        </div>

        {/* Category Pills */}
        <div className="category-pills-row">
          {categoriesList.map((cat, idx) => (
            <button
              key={idx}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price Slider */}
        <div className="price-slider-wrap">
          <div className="price-slider-labels">
            <span>Price: Up to ₹{maxPrice}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={priceLimit}
            step="50"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="price-range-slider"
          />
        </div>

        {/* Reset button */}
        {(searchTerm || selectedCategory !== 'All' || maxPrice !== priceLimit) && (
          <button className="btn btn-secondary btn-sm reset-btn" onClick={resetFilters}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Product Display Board */}
      {loading ? (
        <div className="shop-loading">
          <div className="spinner"></div>
          <p>Weaving styles...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-results-state animate-fade-in">
          <h3>No Dresses Match Your Selection</h3>
          <p>Try adjustments to your search terms, price limits, or category filters.</p>
          <button className="btn btn-primary" onClick={resetFilters}>
            Show All Collections
          </button>
        </div>
      ) : (
        <div className="grid-4 animate-fade-in">
          {filteredProducts.map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
