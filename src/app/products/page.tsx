'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import { Loader2, Search, Filter, SlidersHorizontal, ChevronRight, LayoutGrid, List } from 'lucide-react';
import styles from './products.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('Newest');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?category=${category}&search=${search}`);
      const data = await res.json();
      
      const filteredData = [...data];
      if (sortBy === 'Price: Low to High') {
        filteredData.sort((a: Product, b: Product) => a.price - b.price);
      } else if (sortBy === 'Price: High to Low') {
        filteredData.sort((a: Product, b: Product) => b.price - a.price);
      }

      setProducts(filteredData);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [category, search, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = ['All', 'Menswear', 'Clothing', 'Footwear', 'Accessories'];
  const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Rated'];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.heroBanner}
        >
          <div className={styles.overlay}>
            <span className={styles.badge}>Complete Catalog</span>
            <h1>The Elite Collection</h1>
            <p>Define your aesthetic with curated pieces from our workshops.</p>
          </div>
        </motion.div>
      </header>

      <div className={styles.mainLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <div className={styles.sectionTitle}>
              <Filter size={16} /> Categories
            </div>
            <div className={styles.categoryList}>
              {categories.map((cat) => (
                <button 
                  key={cat}
                  className={`${styles.categoryItem} ${category === cat ? styles.active : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <div className={styles.sectionTitle}>
              <SlidersHorizontal size={16} /> Sorting
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
                <span>Refining selection...</span>
              </motion.div>
            ) : products.length > 0 ? (
              <motion.div 
                layout
                className={`${styles.grid} ${styles[viewMode]}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {products.map((product) => (
                  <ProductCard 
                    key={product.id || product._id} 
                    id={product.id || (product._id as string)}
                    name={product.name}
                    price={product.price}
                    image={product.image || product.images?.[0] || ''}
                    category={product.category}
                    badge={product.price > 1000 ? 'Luxury' : ''}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className={styles.noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3>Refine your search</h3>
                <p>We couldn&apos;t find any styles matching those criteria.</p>
                <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn-primary" style={{ marginTop: '2rem' }}>
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
