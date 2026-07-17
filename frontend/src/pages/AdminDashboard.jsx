import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandContext } from '../context/BrandContext';
import { getApiUrl, getImageUrl } from '../apiConfig';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { brand, refreshBrand } = useContext(BrandContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('swara_admin_token');

  // Page tabs state
  const [activeTab, setActiveTab] = useState('products');

  // Data states
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [categoryDraft, setCategoryDraft] = useState('');
  const [categoriesList, setCategoriesList] = useState(['Cotton Sarees', 'Kurtis', 'Dress Materials']);

  // Form states - Products CRUD
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    category: 'Cotton Sarees',
    images: [],
    inStock: true,
    isTrending: false,
    sizes: []
  });

  // Upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states - Brand settings
  const [brandForm, setBrandForm] = useState({
    name: '',
    tagline: '',
    description: '',
    logo: '',
    whatsappNumber: '',
    email: '',
    address: ''
  });

  // Form states - Banners
  const [bannersList, setBannersList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);

  // Load products and brand initial values
  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
    
    // Seed Brand Form
    setBrandForm({
      name: brand.name,
      tagline: brand.tagline,
      description: brand.description,
      logo: brand.logo,
      whatsappNumber: brand.whatsappNumber,
      email: brand.email,
      address: brand.address
    });

    // Seed Banners and Gallery Lists
    setBannersList(brand.banners || []);
    setGalleryList(Array.isArray(brand.gallery) ? brand.gallery : []);
    setCategoriesList(Array.isArray(brand.categories) && brand.categories.length > 0 ? brand.categories : ['Cotton Sarees', 'Kurtis', 'Dress Materials']);
  }, [brand, token, navigate]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch(getApiUrl('/api/products'));
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products in dashboard:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('swara_admin_token');
    localStorage.removeItem('swara_admin_username');
    navigate('/admin/login');
  };

  // Upload file helper
  const handleFileUpload = async (e, targetField, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingImage(true);

    try {
      const response = await fetch(getApiUrl('/api/upload'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        if (targetField === 'product') {
          setProductForm(prev => ({
            ...prev,
            images: [...prev.images, data.url]
          }));
        } else if (targetField === 'brandLogo') {
          setBrandForm(prev => ({
            ...prev,
            logo: data.url
          }));
        } else if (targetField === 'banner' && index !== null) {
          setBannersList(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], image: data.url };
            return updated;
          });
        } else if (targetField === 'gallery') {
          setGalleryList(prev => [...prev, data.url]);
        }
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image to server');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setGalleryList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveGallery = async () => {
    try {
      const response = await fetch(getApiUrl('/api/brand'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gallery: galleryList })
      });

      if (response.ok) {
        alert('Gallery images updated successfully!');
        refreshBrand();
      } else {
        const data = await response.json();
        alert(data.message || 'Error updating gallery');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving gallery images');
    }
  };

  // Add or edit product forms submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const url = editingProduct 
      ? getApiUrl(`/api/products/${editingProduct.id || editingProduct._id}`)
      : getApiUrl('/api/products');
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...productForm,
          price: Number(productForm.price),
          originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined
        })
      });

      if (response.ok) {
        setShowProductModal(false);
        setEditingProduct(null);
        resetProductForm();
        fetchProducts();
      } else {
        const data = await response.json();
        alert(data.message || 'Error saving product');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to save endpoint');
    }
  };

  const handleEditProductClick = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      description: prod.description || '',
      category: prod.category,
      images: prod.images || [],
      inStock: prod.inStock,
      isTrending: prod.isTrending,
      sizes: prod.sizes || []
    });
    setShowProductModal(true);
  };

  const handleDeleteProductClick = async (prodId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(getApiUrl(`/api/products/${prodId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchProducts();
      } else {
        const data = await response.json();
        alert(data.message || 'Error deleting product');
      }
    } catch (err) {
      console.error(err);
      alert('Connection error deleting product');
    }
  };

  // Toggle size pill in form
  const handleSizeToggle = (size) => {
    setProductForm(prev => {
      const sizes = [...prev.sizes];
      const index = sizes.indexOf(size);
      if (index > -1) {
        sizes.splice(index, 1);
      } else {
        sizes.push(size);
      }
      return { ...prev, sizes };
    });
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      originalPrice: '',
      description: '',
      category: categoriesList[0] || 'Cotton Sarees',
      images: [],
      inStock: true,
      isTrending: false,
      sizes: []
    });
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    resetProductForm();
    setShowProductModal(true);
  };

  const saveCategoriesToBackend = async (nextCategories) => {
    try {
      const response = await fetch(getApiUrl('/api/brand'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ categories: nextCategories })
      });

      if (response.ok) {
        setCategoriesList(nextCategories);
        refreshBrand();
        return true;
      }

      const data = await response.json();
      alert(data.message || 'Error updating categories');
      return false;
    } catch (err) {
      console.error(err);
      alert('Error connecting while saving categories');
      return false;
    }
  };

  const handleAddCategory = async () => {
    const trimmed = categoryDraft.trim();
    if (!trimmed) return;
    if (categoriesList.some(cat => cat.toLowerCase() === trimmed.toLowerCase())) {
      alert('This category already exists.');
      return;
    }

    const updatedCategories = [...categoriesList, trimmed];
    const saved = await saveCategoriesToBackend(updatedCategories);
    if (saved) {
      setCategoryDraft('');
      setProductForm(prev => ({ ...prev, category: trimmed }));
    }
  };

  const handleRemoveCategory = async (categoryToRemove) => {
    if (categoriesList.length <= 1) {
      alert('You need at least one category.');
      return;
    }

    const hasProducts = products.some(product => product.category === categoryToRemove);
    if (hasProducts) {
      alert('This category cannot be removed because products are currently assigned to it.');
      return;
    }

    const confirmed = window.confirm(`Remove category "${categoryToRemove}"?`);
    if (!confirmed) return;

    const updatedCategories = categoriesList.filter(cat => cat !== categoryToRemove);
    const saved = await saveCategoriesToBackend(updatedCategories);
    if (saved) {
      setProductForm(prev => ({
        ...prev,
        category: prev.category === categoryToRemove ? updatedCategories[0] || '' : prev.category
      }));
    }
  };

  const handleSaveCategories = async () => {
    await saveCategoriesToBackend(categoriesList);
  };

  // Save brand details updates
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(getApiUrl('/api/brand'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...brandForm, gallery: galleryList })
      });

      if (response.ok) {
        alert('Brand settings updated successfully!');
        refreshBrand();
      } else {
        const data = await response.json();
        alert(data.message || 'Error updating settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating brand data');
    }
  };

  // Add, Remove and Save banners
  const handleAddBannerField = () => {
    setBannersList(prev => [...prev, { image: '/images/banner1.jpg', title: 'New Slide', subtitle: 'Subtitle details' }]);
  };

  const handleRemoveBannerField = (index) => {
    setBannersList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleBannerTextChange = (index, field, value) => {
    setBannersList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveBanners = async () => {
    try {
      const response = await fetch(getApiUrl('/api/brand'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ banners: bannersList })
      });

      if (response.ok) {
        alert('Homepage banners updated successfully!');
        refreshBrand();
      } else {
        const data = await response.json();
        alert(data.message || 'Error updating banners');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving banner configs');
    }
  };

  const sizesList = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Unstitched'];

  return (
    <div className="admin-dashboard-page container animate-fade-in">
      
      {/* Dashboard Top Header */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="serif-title">Admin Management Board</h1>
          <p>Welcome back, manage your catalog inventory and brand presence details.</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
          Sign Out Portal
        </button>
      </div>

      {/* Tabs selectors row */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Product Inventory ({products.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'brand' ? 'active' : ''}`}
          onClick={() => setActiveTab('brand')}
        >
          🏛️ Brand Settings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'banners' ? 'active' : ''}`}
          onClick={() => setActiveTab('banners')}
        >
          🖼️ Homepage Banners
        </button>
        <button 
          className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          🎨 Gallery
        </button>
      </div>

      {/* Tab 1: Products Inventory Grid / List */}
      {activeTab === 'products' && (
        <div className="dashboard-tab-content">
          <div className="actions-bar">
            <h3>Active Catalog</h3>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
              + Add New Product
            </button>
          </div>

          <div className="brand-settings-form category-manager" style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label>Add a new category</label>
              <div className="category-manager-controls">
                <input
                  type="text"
                  value={categoryDraft}
                  onChange={(e) => setCategoryDraft(e.target.value)}
                  className="form-control"
                  placeholder="Example: Lehenga"
                />
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddCategory}>
                  Add Category
                </button>
              </div>
            </div>

            <div className="category-list">
              {categoriesList.map((cat) => {
                const hasProducts = products.some(product => product.category === cat);
                return (
                  <div key={cat} className={`category-pill ${hasProducts ? 'disabled' : ''}`}>
                    <span>{cat}</span>
                    <button
                      type="button"
                      className={`category-remove-button ${hasProducts ? 'disabled' : ''}`}
                      onClick={() => handleRemoveCategory(cat)}
                      title={hasProducts ? 'This category has products assigned and cannot be removed' : 'Remove category'}
                      disabled={hasProducts}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <button type="button" className="btn btn-accent" style={{ marginTop: '1rem' }} onClick={handleSaveCategories}>
              Save Categories
            </button>
          </div>

          {loadingProducts ? (
            <p style={{ textAlign: 'center', padding: '3rem' }}>Loading Inventory...</p>
          ) : products.length === 0 ? (
            <div className="empty-catalog-state">
              <p>Your product catalog is empty. Let's add some cotton dresses!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock status</th>
                    <th>Trending flag</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(prod => {
                    const prodId = prod.id || prod._id;
                    const img = prod.images && prod.images.length > 0 ? prod.images[0] : '/images/placeholder.jpg';
                    const displayImg = img.startsWith('/') && !img.startsWith('/images/')
                      ? getImageUrl(img)
                      : img;

                    return (
                      <tr key={prodId}>
                        <td>
                          <img 
                            src={displayImg} 
                            alt={prod.name} 
                            className="admin-table-thumb"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/40x50/f6f3eb/2b2523?text=Dress';
                            }}
                          />
                        </td>
                        <td>
                          <strong>{prod.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {prodId}</div>
                        </td>
                        <td>{prod.category}</td>
                        <td>
                          ₹{prod.price} 
                          {prod.originalPrice && <span style={{ textDecoration: 'line-through', fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.4rem' }}>₹{prod.originalPrice}</span>}
                        </td>
                        <td>
                          <span className={`badge ${prod.inStock ? 'badge-trending' : 'badge-stock-out'}`}>
                            {prod.inStock ? 'In Stock' : 'Out'}
                          </span>
                        </td>
                        <td>{prod.isTrending ? '🔥 Yes' : 'No'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleEditProductClick(prod)} style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                              Edit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProductClick(prodId)} style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Brand Information Form */}
      {activeTab === 'brand' && (
        <div className="dashboard-tab-content">
          <form onSubmit={handleBrandSubmit} className="brand-settings-form">
            <div className="form-grid-2">
              <div className="form-group">
                <label>Brand Store Name</label>
                <input 
                  type="text" 
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({...brandForm, name: e.target.value})}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tagline / Motto</label>
                <input 
                  type="text" 
                  value={brandForm.tagline}
                  onChange={(e) => setBrandForm({...brandForm, tagline: e.target.value})}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Brand Description / Story Overview</label>
              <textarea 
                value={brandForm.description}
                onChange={(e) => setBrandForm({...brandForm, description: e.target.value})}
                className="form-control"
                rows="4"
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>WhatsApp Contact Number (No leading + or 0, prefix country code. Example: 917769039915)</label>
                <input 
                  type="text" 
                  value={brandForm.whatsappNumber}
                  onChange={(e) => setBrandForm({...brandForm, whatsappNumber: e.target.value})}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Official Email Address</label>
                <input 
                  type="email" 
                  value={brandForm.email}
                  onChange={(e) => setBrandForm({...brandForm, email: e.target.value})}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Store Physical Address</label>
              <input 
                type="text" 
                value={brandForm.address}
                onChange={(e) => setBrandForm({...brandForm, address: e.target.value})}
                className="form-control"
              />
            </div>

            {/* Brand Logo Upload */}
            <div className="logo-upload-section">
              <div className="form-group">
                <label>Store Logo Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'brandLogo')}
                  className="form-control"
                />
                <p className="help-text">Select an image to upload as your official brand logo.</p>
              </div>
              <div className="logo-preview-box">
                {brandForm.logo && (
                  <img 
                    src={getImageUrl(brandForm.logo)}
                    alt="Brand Logo" 
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/100/f6f3eb/2b2523?text=Logo';
                    }}
                  />
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-accent" style={{ marginTop: '1.5rem' }}>
              Save Brand Changes
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Hero banners Configurator */}
      {activeTab === 'banners' && (
        <div className="dashboard-tab-content">
          <div className="actions-bar">
            <h3>Homepage Slide Shows Banners</h3>
            <button className="btn btn-secondary btn-sm" onClick={handleAddBannerField}>
              + Add Slide
            </button>
          </div>

          <div className="banners-edit-list">
            {bannersList.map((banner, index) => {
              const displayImg = banner.image.startsWith('/') && !banner.image.startsWith('/images/')
                ? getImageUrl(banner.image)
                : banner.image;

              return (
                <div className="banner-edit-card" key={index}>
                  <div className="banner-card-head">
                    <h4>Slide Banner #{index + 1}</h4>
                    <button className="remove-banner-btn" onClick={() => handleRemoveBannerField(index)}>
                      Remove Slide
                    </button>
                  </div>
                  
                  <div className="banner-card-body">
                    <div className="banner-fields-side">
                      <div className="form-group">
                        <label>Slide Title Header</label>
                        <input 
                          type="text" 
                          value={banner.title}
                          onChange={(e) => handleBannerTextChange(index, 'title', e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Slide Subtitle / Info</label>
                        <input 
                          type="text" 
                          value={banner.subtitle}
                          onChange={(e) => handleBannerTextChange(index, 'subtitle', e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Upload Slide Image</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'banner', index)}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="banner-preview-side">
                      <img 
                        src={displayImg} 
                        alt={`Slide ${index + 1}`} 
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/240x120/f6f3eb/2b2523?text=Slide';
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="btn btn-accent" onClick={handleSaveBanners} style={{ marginTop: '2rem' }} disabled={bannersList.length === 0}>
            Save Banners Arrangement
          </button>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="dashboard-tab-content gallery-panel">
          <div className="actions-bar gallery-actions">
            <div>
              <h3>Website Gallery Images</h3>
              <p className="help-text">Upload decorative gallery photos for the public gallery page.</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setGalleryList([])} disabled={galleryList.length === 0}>
              Clear Gallery
            </button>
          </div>

          <div className="gallery-upload-section">
            <div className="gallery-upload-card">
              <div className="form-group">
                <label>Upload Gallery Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'gallery')}
                  className="form-control"
                />
                <p className="help-text">Add photos to your brand gallery. Images will appear on the gallery page.</p>
              </div>
            </div>

            {galleryList.length > 0 ? (
              <div className="gallery-thumbs-grid">
                {galleryList.map((img, idx) => {
                  const displayImg = getImageUrl(img);
                  return (
                    <div className="gallery-thumb-card" key={idx}>
                      <img src={displayImg} alt={`Gallery ${idx + 1}`} />
                      <button type="button" className="remove-gallery-thumb" onClick={() => handleRemoveGalleryImage(idx)}>
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-catalog-state" style={{ marginTop: '1rem' }}>
                No gallery images added yet.
              </div>
            )}

            <button className="btn btn-accent" onClick={handleSaveGallery} style={{ marginTop: '1.75rem' }}>
              Save Gallery Images
            </button>
          </div>
        </div>
      )}

      {/* MODAL POPUP FOR ADDING / EDITING PRODUCTS */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content product-form-modal">
            <h2 className="serif-title" style={{ marginBottom: '1.5rem' }}>
              {editingProduct ? 'Edit Dress Product' : 'Add New Dress Item'}
            </h2>
            
            <form onSubmit={handleProductSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Dress Name</label>
                  <input 
                    type="text" 
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="form-control"
                  >
                    {categoriesList.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Offer Price (₹)</label>
                  <input 
                    type="number" 
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="form-control"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Original Price (₹ - Optional)</label>
                  <input 
                    type="number" 
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({...productForm, originalPrice: e.target.value})}
                    className="form-control"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description Details</label>
                <textarea 
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="form-control"
                  rows="3"
                />
              </div>

              {/* Sizes checklist */}
              <div className="form-group">
                <label>Available Sizing Choices</label>
                <div className="sizes-checklist">
                  {sizesList.map((sz, idx) => {
                    const isChecked = productForm.sizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={idx}
                        className={`size-checkbox-pill ${isChecked ? 'checked' : ''}`}
                        onClick={() => handleSizeToggle(sz)}
                      >
                        {isChecked && <span style={{ marginRight: '4px' }}>✓</span>}
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Checkboxes row */}
              <div className="checkboxes-form-row">
                <label className="checkbox-wrap">
                  <input 
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({...productForm, inStock: e.target.checked})}
                  />
                  <span>Product is in stock</span>
                </label>

                <label className="checkbox-wrap">
                  <input 
                    type="checkbox"
                    checked={productForm.isTrending}
                    onChange={(e) => setProductForm({...productForm, isTrending: e.target.checked})}
                  />
                  <span>Display in trending section</span>
                </label>
              </div>

              {/* Product Image uploads */}
              <div className="product-images-form-section">
                <div className="form-group">
                  <label>Upload Product Images (Max 5)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'product')}
                    className="form-control"
                    disabled={productForm.images.length >= 5}
                  />
                  <p className="help-text">Multiple photos can represent color variants or detail shoots.</p>
                </div>

                <div className="uploaded-images-previews">
                  {productForm.images.map((img, idx) => {
                    const disp = getImageUrl(img);
                    return (
                      <div className="img-form-thumb" key={idx}>
                        <img src={disp} alt="product thumbnail" />
                        <button 
                          type="button" 
                          className="remove-img-thumb"
                          onClick={() => setProductForm(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx)
                          }))}
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
                  {productForm.images.length === 0 && (
                    <div className="no-images-notice">
                      No images uploaded yet. Product will fall back to a placeholder.
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions-modal">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowProductModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-accent"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? 'Uploading Image...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
