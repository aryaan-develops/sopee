'use client';

import Image from 'next/image';
import { ShoppingBag, Heart, Star, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
  rating?: number;
}

export default function ProductCard({ id, name, price, image, category, badge, rating = 4.5 }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={styles.imageContainer}>
        <Link href={`/products/${id}`} className={styles.imageLink}>
          {badge && <span className={styles.badge}>{badge}</span>}
          <Image 
            src={image} 
            alt={name} 
            fill 
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </Link>
        
        <button 
          className={styles.wishlistBtn} 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          aria-label="Add to wishlist"
        >
          <Heart size={18} />
        </button>
        
        <button 
          className={styles.quickAdd}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart({ id, name, price, image, category });
          }}
        >
          <ShoppingBag size={18} /> Quick Add
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.mainInfo}>
           <h3 className={styles.name}>{name}</h3>
           <span className={styles.category}>{category}</span>
        </div>
        <div className={styles.footerInfo}>
          <p className={styles.price}>${price.toLocaleString()}</p>
          <div className={styles.rating}>
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                fill={i < Math.floor(rating) ? "currentColor" : "none"} 
                className={i < Math.floor(rating) ? styles.starFilled : styles.starEmpty}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
