'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import styles from './page.module.css';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { name: 'Casual Wear', image: 'https://images.unsplash.com/photo-1516257984877-a03aae3acbc8?w=800' },
  { name: 'Formal Wear', image: 'https://images.unsplash.com/photo-1594932224011-801047298c48?w=800' },
  { name: 'Street Style', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800' },
  { name: 'Outerwear', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=800' }
];

const TRENDING_PRODUCTS = [
  { id: '1', name: 'Beige Bomber Jacket', price: 149, image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800', badge: 'Trending' },
  { id: '2', name: 'Smart Casual Blazer', price: 199, image: 'https://images.unsplash.com/photo-1507679799987-c7377ec486b0?w=800', badge: 'New' },
  { id: '3', name: 'Knitted Polo Shirt', price: 79, image: 'https://images.unsplash.com/photo-1583912267550-d44d7a125e7e?w=800', badge: 'Sale' },
  { id: '4', name: 'Textured Wool Coat', price: 229, image: 'https://images.unsplash.com/photo-1544022613-e87ce7526623?w=800', badge: 'Limited' }
];

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroImageWrapper}>
          <Image 
            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1600" 
            fill 
            alt="Main Collection" 
            className={styles.heroImage}
            priority
          />
          <div className={styles.heroOverlay}></div>
        </div>
        
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className={styles.heroTitle}>Define Your Style</h1>
            <p className={styles.heroSubtitle}>Modern Menswear for Every Occasion</p>
            <div className={styles.heroActions}>
              <Link href="/products" className="btn-primary">Shop Now</Link>
              <Link href="/products" className="btn-outline">New Arrivals</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Essentials Section */}
      <section className={styles.essentials}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Curated Sets</span>
            <h2 className={styles.sectionTitle}>ESSENTIALS</h2>
          </div>
          
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat, i) => (
              <motion.div 
                key={cat.name} 
                className={styles.categoryCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={styles.catImageWrapper}>
                  <Image src={cat.image} fill alt={cat.name} className={styles.catImage} />
                </div>
                <div className={styles.catName}>{cat.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Autumn Promotion Section */}
      <section className={styles.promo}>
        <div className={styles.container}>
          <div className={styles.promoBox}>
            <div className={styles.promoImageWrapper}>
              <Image src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600" fill alt="Autumn Collection" className={styles.promoImg} />
            </div>
            <div className={styles.promoContent}>
              <h2 className={styles.promoTitle}>Autumn Collection — <br /> Up to 30% OFF</h2>
              <Link href="/sale" className={styles.promoBtn}>SHOP COLLECTION</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className={styles.trending}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>TRENDING NOW</h2>
          </div>

          <div className={styles.productGrid}>
            {TRENDING_PRODUCTS.map((prod, i) => (
              <motion.div 
                key={prod.id} 
                className={styles.productCard}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={styles.prodImageWrapper}>
                  {prod.badge && <span className={styles.badge}>{prod.badge}</span>}
                  <Image src={prod.image} fill alt={prod.name} className={styles.prodImage} />
                  <button className={styles.wishlistBtn}><Heart size={18} /></button>
                  <button className={styles.quickAdd}><ShoppingBag size={18} /></button>
                </div>
                <div className={styles.prodMeta}>
                  <h4 className={styles.prodName}>{prod.name}</h4>
                  <div className={styles.prodDetails}>
                    <p className={styles.prodPrice}>${prod.price}</p>
                    <div className={styles.rating}>
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="none" stroke="currentColor" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletter}>
        <div className={styles.container}>
          <div className={styles.newsletterBox}>
            <h3>Stay Inspired</h3>
            <p>Subscribe to our newsletter for early access to new drops and styling tips.</p>
            <div className={styles.subscribeForm}>
              <input type="email" placeholder="Your Email Address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Credentials */}
      <div className={styles.credentials}>
        <div className={styles.container}>
          <div className={styles.credText}>
             © 2026 SHOP EASE. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </main>
  );
}
