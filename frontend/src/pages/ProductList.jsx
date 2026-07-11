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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [priceLimit, setPriceLimit] = useState(3000);
  const [sortOption, setSortOption] = useState('featured');

  // Sync category and sort state with search query params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const sortParam = searchParams.get('sort');

    if (categoryParam) {
      const categoryValues = categoryParam
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat && cat.toLowerCase() !== 'all');
      setSelectedCategories(categoryValues);
    } else {
      setSelectedCategories([]);
    }

    setSortOption(sortParam || 'featured');
  }, [searchParams]);

  useEffect(() => {
    const categoryOptions = Array.isArray(brand?.categories) && brand.categories.length > 0
      ? brand.categories
      : ['Cotton Sarees', 'Kurtis', 'Dress Materials'];
    setCategoriesList(categoryOptions);
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
    if (selectedCategories.length > 0) {
      const activeCategories = selectedCategories.map(cat => cat.toLowerCase());
      result = result.filter(p => activeCategories.includes(p.category.toLowerCase()));
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

    // Sort results
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === 'recently-added') {
      result.sort((a, b) => {
        const aDate = new Date(a.createdAt || a.created_at || 0).getTime();
        const bDate = new Date(b.createdAt || b.created_at || 0).getTime();
        return bDate - aDate;
      });
    }

    setFilteredProducts(result);
  }, [products, selectedCategories, searchTerm, maxPrice, sortOption]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','));
    } else {
      params.delete('category');
    }

    if (sortOption && sortOption !== 'featured') {
      params.set('sort', sortOption);
    } else {
      params.delete('sort');
    }

    setSearchParams(params);
  }, [selectedCategories, sortOption]);

  const handleCategoryClick = (category) => {
    if (category === 'All') {
      setSelectedCategories([]);
      return;
    }

    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      }
      return [...prev, category];
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setMaxPrice(priceLimit);
    setSelectedCategories([]);
    setSortOption('featured');
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('sort');
    setSearchParams(params);
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

        {/* Sort Options */}
        <div className="sort-control">
          <label htmlFor="sortSelect">Sort by</label>
          <select
            id="sortSelect"
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="recently-added">Recently Added</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="category-pills-row">
          {['All', ...categoriesList].map((cat, idx) => (
            <button
              key={idx}
              className={`category-pill ${selectedCategories.length === 0 && cat === 'All' ? 'active' : ''} ${selectedCategories.includes(cat) ? 'active' : ''}`}
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
        {(searchTerm || selectedCategories.length > 0 || maxPrice !== priceLimit || sortOption !== 'featured') && (
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
