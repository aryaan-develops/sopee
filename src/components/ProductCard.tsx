'use client';

import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

import Link from 'next/link';

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className={styles.card}>
      <Link href={`/products/${id}`} className={styles.cardLink}>
        <div className={styles.imageContainer}>
          <Image 
            src={image} 
            alt={name} 
            fill 
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <button 
            className={styles.wishlistBtn}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Future Wishlist logic
            }}
          >
            <Heart size={18} />
          </button>
        </div>
        <div className={styles.content}>
          <span className={styles.category}>{category}</span>
          <h3 className={styles.name}>{name}</h3>
          <div className={styles.footer}>
            <span className={styles.price}>${price.toLocaleString()}</span>
            <button 
              className={styles.addBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart({ id, name, price, image, category });
              }}
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
