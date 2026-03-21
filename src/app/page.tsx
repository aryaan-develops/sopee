'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Star, ChevronRight, Play } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';
import { motion } from 'framer-motion';
import AnimatedSlideshow from '@/components/AnimatedSlideshow';

const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Midnight Velvet Suit',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1594932224011-801047298c48?w=800',
    category: 'Menswear'
  },
  {
    id: '2',
    name: 'Emerald Silk Gown',
    price: 850,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800',
    category: 'Womenswear'
  },
  {
    id: '3',
    name: 'Urban Tech Hoodie',
    price: 180,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
    category: 'Streetwear'
  }
];

export default function Home() {
  return (
    <div className={styles.wrapper}>
      {/* Dynamic Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroTop}>
             <motion.h1 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1 }}
             >
               DIVE INTO A WORLD OF <span className={styles.accentText}>ENDLESS</span> FASHION POSSIBILITIES
             </motion.h1>
             <p className={styles.heroDesc}>
               Elevate your appearance with our bespoke collections. 
               Experience unique designs from world-class creators.
             </p>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <AnimatedSlideshow />
            </div>

            <div className={styles.heroCenter}>
              <div className={styles.heroActions}>
                <Link href="/products" className={styles.shopNowBtn}>
                  SHOP NOW <span>→</span>
                </Link>
                <Link href="/products" className={styles.exploreBtn}>
                  EXPLORE MORE PRODUCTS
                </Link>
              </div>
              <div className={styles.imageBlockHalf}>
                <Image src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800" fill alt="Fashion" className={styles.roundedImg} />
                <div className={styles.tagFloating}>Aesthetic Collection</div>
              </div>
            </div>

            <div className={styles.heroRight}>
               <div className={styles.imageBlock}>
                 <Image src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800" fill alt="Fashion" className={styles.roundedImg} />
                 <div className={styles.tagDark}>Mens Formal Set $450</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Horizontal - Image Ref Style */}
      <section className={styles.featured}>
        <div className={styles.container}>
           <div className={styles.sectionTitleCenter}>
              <h2>FEATURED COLLECTION</h2>
           </div>

           <div className={styles.carouselContainer}>
              <div className={styles.carouselTrack}>
                {FEATURED_PRODUCTS.map((p, i) => (
                  <motion.div 
                    key={p.id}
                    className={styles.carouselItem}
                    initial={{ rotate: -5 * i, x: -20 * i }}
                    whileHover={{ rotate: 0, x: 0, scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Image src={p.image} fill alt={p.name} className={styles.roundedImg} />
                    <div className={styles.itemMeta}>
                      <span>{p.category}</span>
                      <h4>{p.name}</h4>
                      <p>${p.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* Mint Accent Section */}
      <section className={styles.mintSection}>
        <div className={styles.container}>
          <div className={styles.mintBox}>
             <div className={styles.mintHeader}>
                <h2>ELEVATE YOUR WARDROBE <br /> WITH OUR FASHION FINDS</h2>
                <p>Curate your style with pieces from around the world.</p>
             </div>
             <div className={styles.mintVideo}>
               <Image src="https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=1600" fill alt="Collection" className={styles.roundedImg} />
               <div className={styles.playIcon}><Play fill="white" /></div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer Info / Login Guide */}
      <section className={styles.loginGuide}>
        <div className={styles.container}>
           <p className={styles.guideSubtitle}>FASHION AT YOUR FINGERTIPS</p>
           <div className={styles.guideGrid}>
             <div className={styles.guideCard}>
                <h3>1200+</h3>
                <span>Unique Styles</span>
             </div>
             <div className={styles.guideCard}>
                <h3>50k+</h3>
                <span>Premium Quality</span>
             </div>
             <div className={styles.guideCard}>
                <h3>5k+</h3>
                <span>Custom Brands</span>
             </div>
           </div>
        </div>
      </section>

      {/* Development Credentials */}
      <div className={styles.credentials}>
        <div className={styles.container}>
          <div className={styles.credBox}>
            <h4>Mock Credentials</h4>
            <div className={styles.credList}>
              <span>USER: user@gmail.com | user123</span>
              <span>SELLER: seller@gmail.com | seller123</span>
              <span>ADMIN: admin@gmail.com | admin123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
