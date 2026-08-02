import React, { useState, useMemo, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShopContext, formatPrice } from '../context/ShopContext';

function Products() {
  const { products, loading, handleAddToCart, getInclusivePrice, cartItems, wishlistItems, handleToggleWishlist } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('search') || '';

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubFilters, setSelectedSubFilters] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(100000);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Dynamic filter extraction
  const allCategories = useMemo(() => Array.from(new Set((products || []).map(p => p.category).filter(Boolean))), [products]);
  const allBrands = useMemo(() => Array.from(new Set((products || []).map(p => p.brand || 'Generic').filter(Boolean))), [products]);
  
  const subFiltersMap = {
    'Arduino': ['Board', 'Shield', 'Starter Kit'],
    'Sensors': ['Temperature', 'Motion', 'Distance', 'Optical'],
    'Automation': ['PLC', 'Relay', 'Contactor'],
    'Power': ['Battery', 'Adapter', 'Module'],
    'IoT': ['WiFi', 'Bluetooth', 'LoRa']
  };

  const handleCategoryToggle = (cat) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleSubFilterToggle = (sub) => {
    setSelectedSubFilters(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const filteredProducts = useMemo(() => {
    let result = products || [];

    if (query && query.toLowerCase() !== 'all') {
      result = result.filter(p => 
        (p.name || '').toLowerCase().includes(query.toLowerCase()) || 
        (p.category || '').toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedSubFilters.length > 0) {
      result = result.filter(p => selectedSubFilters.some(sub => (p.name || '').toLowerCase().includes(sub.toLowerCase())));
    }

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand || 'Generic'));
    }

    if (inStockOnly) {
      result = result.filter(p => (p.stock !== undefined ? p.stock : 15) > 0);
    }

    result = result.filter(p => getInclusivePrice(p.price || 0) <= priceRange);

    return result;
  }, [products, query, selectedCategories, selectedSubFilters, selectedBrands, priceRange, inStockOnly, getInclusivePrice]);


  const renderProductCard = (product) => {
    if (!product) return null;
    const inclusivePrice = getInclusivePrice(product.price || 0);
    const inclusiveOriginal = getInclusivePrice(product.originalPrice || product.price || 0);
    const discountPercent = inclusiveOriginal > 0 ? Math.round(((inclusiveOriginal - inclusivePrice) / inclusiveOriginal) * 100) : 0;
    const isWishlisted = (wishlistItems || []).some(item => item._id === product._id);
    const stock = product.stock !== undefined ? product.stock : 15;
    const cartItem = (cartItems || []).find((item) => item._id === product._id);

    return (
      <div key={product._id} className="premium-product-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', transition: 'all 0.3s ease' }}>
        <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={(e) => { e.preventDefault(); handleToggleWishlist(product); }} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: '1.2rem', color: isWishlisted ? '#ef4444' : '#94a3b8', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#ef4444'} onMouseOut={e => e.currentTarget.style.color = isWishlisted ? '#ef4444' : '#94a3b8'}>
            {isWishlisted ? '❤️' : '♡'}
          </button>
        </div>
        {discountPercent > 0 && (
          <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, zIndex: 10 }}>
            {discountPercent}% OFF
          </div>
        )}
        <Link to={`/product/${product._id}`} style={{ display: 'block', height: '220px', background: '#f8fafc', padding: '24px', textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
          <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.4s ease' }} className="product-img-zoom" />
        </Link>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            <span>{product.category}</span>
          </div>
          <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.4, fontWeight: 700, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto', marginBottom: '20px' }}>
            <strong style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: 800 }}>{formatPrice(inclusivePrice)}</strong>
            {discountPercent > 0 && <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>{formatPrice(inclusiveOriginal)}</span>}
          </div>
          <button style={{ width: '100%', padding: '12px', fontSize: '0.95rem', background: stock === 0 ? '#f1f5f9' : (cartItem ? '#6366f1' : '#0f172a'), color: stock === 0 ? '#94a3b8' : '#fff', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: stock === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }} onClick={(e) => { e.preventDefault(); handleAddToCart(product); }} disabled={stock === 0} onMouseOver={e => !stock === 0 && (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseOut={e => !stock === 0 && (e.currentTarget.style.transform = 'translateY(0)')}>
            {stock === 0 ? 'Out of Stock' : (cartItem ? 'Added to Cart' : 'Add to Cart')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container products-layout-flex" style={{ padding: '40px 24px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .premium-product-card:hover { border-color: #cbd5e1; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
        .premium-product-card:hover .product-img-zoom { transform: scale(1.08); }
        .custom-checkbox { width: 18px; height: 18px; border-radius: 4px; border: 2px solid #cbd5e1; appearance: none; outline: none; cursor: pointer; position: relative; transition: all 0.2s; margin: 0; }
        .custom-checkbox:checked { background: #6366f1; border-color: #6366f1; }
        .custom-checkbox:checked::after { content: '✓'; position: absolute; color: white; font-size: 12px; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; }
        .sub-filter-list { margin-left: 28px; border-left: 2px solid #f1f5f9; padding-left: 12px; margin-top: 8px; margin-bottom: 16px; display: flex; flexDirection: column; gap: 10px; }
      `}} />

      {/* Sidebar Filters */}
      <aside className="products-sidebar-filter" style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Filters</h3>
          {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedSubFilters.length > 0 || priceRange < 100000) && (
            <button onClick={() => { setSelectedCategories([]); setSelectedBrands([]); setSelectedSubFilters([]); setPriceRange(100000); setInStockOnly(false); }} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>Clear All</button>
          )}
        </div>

        {/* Categories & Sub-filters */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 700, marginBottom: '16px' }}>Category & Sub-Type</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allCategories.map(cat => (
              <React.Fragment key={cat}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
                  <input type="checkbox" className="custom-checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryToggle(cat)} />
                  {cat}
                </label>
                
                {/* Render Sub-filters if category is selected and has mapping */}
                {selectedCategories.includes(cat) && subFiltersMap[cat] && (
                  <div className="sub-filter-list">
                    {subFiltersMap[cat].map(sub => (
                      <label key={sub} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                        <input type="checkbox" className="custom-checkbox" style={{ width: '14px', height: '14px', borderRadius: '3px' }} checked={selectedSubFilters.includes(sub)} onChange={() => handleSubFilterToggle(sub)} />
                        {sub}
                      </label>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 700, marginBottom: '16px' }}>Brands</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allBrands.map(brand => (
              <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
                <input type="checkbox" className="custom-checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandToggle(brand)} />
                {brand}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 700, margin: 0 }}>Max Price</h4>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#6366f1' }}>{formatPrice(priceRange)}</span>
          </div>
          <input type="range" min="100" max="100000" step="500" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} style={{ width: '100%', accentColor: '#6366f1' }} />
        </div>

        {/* Availability */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 700, marginBottom: '16px' }}>Availability</h4>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
            <input type="checkbox" className="custom-checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
            In Stock Only
          </label>
        </div>
      </aside>

      {/* Main Grid */}
      <main style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#f8fafc', padding: '16px 24px', borderRadius: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', margin: '0 0 4px', fontWeight: 800, color: '#0f172a' }}>
              {query && query !== 'all' ? `Search Results for "${query}"` : 'All Products'}
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Showing {filteredProducts.length} products</p>
          </div>
          <select style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Top Rated</option>
          </select>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {Array(8).fill().map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '16px', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <div className="shimmer" style={{ height: '220px', borderRadius: '12px', background: '#f1f5f9', marginBottom: '16px' }}></div>
                <div className="shimmer" style={{ height: '16px', width: '40%', borderRadius: '4px', background: '#f1f5f9', marginBottom: '12px' }}></div>
                <div className="shimmer" style={{ height: '24px', width: '80%', borderRadius: '4px', background: '#f1f5f9', marginBottom: '12px' }}></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', color: '#0f172a', margin: '0 0 12px', fontWeight: 800 }}>No products found</h3>
            <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>We couldn't find any products matching your current filters. Try adjusting your search criteria.</p>
            <button onClick={() => { setSelectedCategories([]); setSelectedBrands([]); setSelectedSubFilters([]); setPriceRange(10000); setInStockOnly(false); }} style={{ marginTop: '24px', background: '#6366f1', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Clear All Filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filteredProducts.map(product => renderProductCard(product))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Products;
