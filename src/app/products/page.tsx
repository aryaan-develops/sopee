'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Loader2, Search } from 'lucide-react';
import styles from './products.module.css';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?category=${category}&search=${search}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Menswear', 'Womenswear', 'Streetwear', 'Accessories'];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="gradient-text">Premium Collection</h1>
        <p>Curated excellence for the modern individual.</p>
        
        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.filters}>
            {categories.map((cat) => (
              <button 
                key={cat}
                className={`${styles.filterBtn} ${category === cat ? styles.active : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {loading ? (
        <div className={styles.loader}><Loader2 className={styles.spinner} /></div>
      ) : products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product: any) => (
            <ProductCard 
              key={product._id} 
              id={product._id}
              name={product.name}
              price={product.price}
              image={product.images[0]}
              category={product.category}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
