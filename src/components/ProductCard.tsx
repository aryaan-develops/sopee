'use client';

import Image from 'next/image';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
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
}

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={styles.imageContainer}>
        <Image 
          src={image} 
          alt={name} 
          fill 
          className={styles.image}
          sizes="(max-width: 768px) 100vw, 300px"
        />
        <div className={styles.overlay}>
          <motion.div 
            className={styles.overlayActions}
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
          >
            <Link href={`/products/${id}`} className={styles.actionBtn} title="Quick View">
              <Eye size={20} />
            </Link>
            <button 
              className={styles.actionBtn} 
              title="Add to Wishlist"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <Heart size={20} />
            </button>
          </motion.div>
        </div>
        <div className={styles.badge}>{category}</div>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.price}>${price.toLocaleString()}</p>
        </div>
        <button 
          className={styles.addBtn}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart({ id, name, price, image, category });
          }}
        >
          <ShoppingCart size={18} /> Add
        </button>
      </div>
    </motion.div>
  );
}
