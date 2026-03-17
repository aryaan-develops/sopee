import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Star, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Midnight Velvet Suit',
    price: 1200,
    image: '/products/suit.png',
    category: 'Menswear'
  },
  {
    id: '2',
    name: 'Emerald Silk Gown',
    price: 850,
    image: '/products/dress.png',
    category: 'Womenswear'
  },
  {
    id: '3',
    name: 'Urban Tech Hoodie',
    price: 180,
    image: '/products/hoodie.png',
    category: 'Streetwear'
  }
];

export default function Home() {
  return (
    <div className={styles.wrapper}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>New Collection 2026</div>
            <h1 className="animate-fade-in gradient-text">
              Defining the Future <br /> of Premium Style
            </h1>
            <p className={styles.heroSubtitle}>
              Experience the pinnacle of luxury commerce. Handcrafted quality, 
              curated by experts, delivered with excellence.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/products" className={styles.primaryBtn}>
                Explore Collection <ArrowRight size={18} />
              </Link>
              <Link href="/auth/register?role=seller" className={styles.secondaryBtn}>
                Launch Your Brand
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span>50k+</span>
                <p>Happy Customers</p>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.stat}>
                <span>2k+</span>
                <p>Premium Brands</p>
              </div>
            </div>
          </div>
          <div className={styles.heroImageContainer}>
            <div className={styles.heroMainImage}>
              <Image 
                src="/hero.png" 
                alt="Premium Fashion Showcase" 
                fill 
                priority 
                className={styles.mainImg}
              />
              <div className={styles.imageOverlay}></div>
              {/* Decorative circles */}
              <div className={styles.circle1}></div>
              <div className={styles.circle2}></div>
              <div className={styles.floatingTag + ' ' + styles.tagTop}>
                <Star size={14} fill="var(--accent)" color="var(--accent)" />
                Best Rated 2026
              </div>
              <div className={styles.floatingTag + ' ' + styles.tagBottom}>
                <ShoppingBag size={14} color="var(--accent)" />
                Authentic Only
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.featured}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionSubtitle}>Curated Looks</span>
              <h2 className={styles.sectionTitle}>Featured Collections</h2>
            </div>
            <Link href="/products" className={styles.viewAll}>
              View All <ChevronRight size={18} />
            </Link>
          </div>
          <div className={styles.productGrid}>
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className={styles.trust}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}><Zap /></div>
              <h3>Express Shipping</h3>
              <p>Next-day delivery available for premium members.</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}><ShieldCheck /></div>
              <h3>Buyer Protection</h3>
              <p>100% money-back guarantee on all authentic goods.</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}><Star /></div>
              <h3>Expert Curation</h3>
              <p>Every item is verified by our style specialists.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Start Your Journey?</h2>
            <p>Join the elite marketplace today and experience the difference.</p>
            <div className={styles.ctaButtons}>
              <Link href="/auth/register" className={styles.ctaPrimary}>Join Now</Link>
              <Link href="/about" className={styles.ctaSecondary}>Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
