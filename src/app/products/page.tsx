'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Loader2, Search, Filter, SlidersHorizontal, ChevronRight, LayoutGrid, List } from 'lucide-react';
import styles from './products.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('Newest');

  useEffect(() => {
    fetchProducts();
  }, [category, search, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?category=${category}&search=${search}`);
      let data = await res.json();
      
      // Basic mock sorting
      if (sortBy === 'Price: Low to High') {
        data.sort((a: any, b: any) => a.price - b.price);
      } else if (sortBy === 'Price: High to Low') {
        data.sort((a: any, b: any) => b.price - a.price);
      }

      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Menswear', 'Womenswear', 'Streetwear', 'Accessories'];
  const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Rated'];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.heroBanner}
        >
          <div className={styles.overlay}>
            <span className={styles.badge}>New Collection 2026</span>
            <h1>The Elite Collection</h1>
            <p>Define your aesthetic with curated pieces from world-class designers.</p>
          </div>
        </motion.div>
      </header>

      <div className={styles.mainLayout}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <div className={styles.sectionTitle}>
              <Filter size={20} /> Categories
            </div>
            <div className={styles.categoryList}>
              {categories.map((cat) => (
                <button 
                  key={cat}
                  className={`${styles.categoryItem} ${category === cat ? styles.active : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                  <ChevronRight size={14} className={styles.icon} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <div className={styles.sectionTitle}>
              <SlidersHorizontal size={20} /> Sorting
            </div>
            <div className={styles.sortList}>
              {sortOptions.map((opt) => (
                <label key={opt} className={styles.sortItem}>
                  <input 
                    type="radio" 
                    name="sort" 
                    checked={sortBy === opt}
                    onChange={() => setSortBy(opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Area */}
        <section className={styles.productArea}>
          <div className={styles.toolBar}>
            <div className={styles.searchBar}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Find your style..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className={styles.toolActions}>
              <span className={styles.count}>{products.length} Products found</span>
              <div className={styles.modeToggle}>
                <button 
                  className={viewMode === 'grid' ? styles.active : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid size={20} />
                </button>
                <button 
                  className={viewMode === 'list' ? styles.active : ''}
                  onClick={() => setViewMode('list')}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.div 
                className={styles.loader}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className={styles.spinner} />
                <span>Fetching items...</span>
              </motion.div>
            ) : products.length > 0 ? (
              <motion.div 
                layout
                className={`${styles.grid} ${styles[viewMode]}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {products.map((product: any) => (
                  <ProductCard 
                    key={product.id || product._id} 
                    id={product.id || product._id}
                    name={product.name}
                    price={product.price}
                    image={product.image || product.images[0]}
                    category={product.category}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className={styles.noResults}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3>No styles match your search</h3>
                <p>Try refreshing the collection or adjustment filters.</p>
                <button onClick={() => { setSearch(''); setCategory('All'); }} className={styles.resetBtn}>
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
