'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import { Loader2, SlidersHorizontal } from 'lucide-react';
import styles from '../products/products.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/types';

export default function FootwearPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Newest');
  const catName = "Footwear";

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?category=${catName}`);
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
  }, [sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
            <span className={styles.badge}>Curated Collection</span>
            <h1>{catName}</h1>
            <p>Elevate your wardrobe with our selection of {catName.toLowerCase()}.</p>
          </div>
        </motion.div>
      </header>

      <div className={styles.mainLayout}>
        <aside className={styles.sidebar}>
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

        <section className={styles.productArea}>
          <div className={styles.toolBar}>
            <div className={styles.toolActions}>
              <span className={styles.count}>{products.length} Products found</span>
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
                className={styles.grid}
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
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className={styles.noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3>Collection Coming Soon</h3>
                <p>We are currently updating our curated {catName.toLowerCase()} selection.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}

