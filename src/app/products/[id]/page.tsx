'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, ShieldCheck, Truck, RefreshCw, Star, ArrowLeft, Loader2, Heart } from 'lucide-react';
import Link from 'next/link';
import styles from './product-details.module.css';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch product details');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader2 className={styles.spinner} size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Product not found</h2>
        <Link href="/products" className={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Link href="/products" className={styles.breadcrumb}>
          <ArrowLeft size={16} /> Back to Collection
        </Link>

        <div className={styles.layout}>
          {/* Left: Images */}
          <div className={styles.imageGallery}>
            <div className={styles.mainImageWrapper}>
              <Image 
                src={product.images[selectedImage]} 
                alt={product.name} 
                fill 
                className={styles.mainImg}
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className={styles.thumbs}>
                {product.images.map((img: string, idx: number) => (
                  <div 
                    key={idx} 
                    className={`${styles.thumb} ${selectedImage === idx ? styles.activeThumb : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <Image src={img} alt={`${product.name} thumb ${idx}`} fill />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className={styles.info}>
            <div className={styles.header}>
              <span className={styles.category}>{product.category}</span>
              <h1 className={styles.title}>{product.name}</h1>
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="var(--accent)" color="var(--accent)" />)}
                </div>
                <span>(4.9 • 24 reviews)</span>
              </div>
            </div>

            <p className={styles.price}>${product.price.toLocaleString()}</p>
            
            <div className={styles.description}>
              <h3>Elevate Your Aesthetic</h3>
              <p>{product.description}</p>
            </div>

            <div className={styles.actions}>
              <button className={styles.addBtn} onClick={handleAddToCart}>
                <ShoppingCart size={20} /> Add to Collection
              </button>
              <button className={styles.wishBtn}>
                <Heart size={20} />
              </button>
            </div>

            <div className={styles.trustGroup}>
              <div className={styles.trustItem}>
                <ShieldCheck size={20} />
                <div>
                  <h4>Authenticity Guaranteed</h4>
                  <p>Every item is verified by our style specialists.</p>
                </div>
              </div>
              <div className={styles.trustItem}>
                <Truck size={20} />
                <div>
                  <h4>Express Global Shipping</h4>
                  <p>Delivered within 3-5 business days.</p>
                </div>
              </div>
              <div className={styles.trustItem}>
                <RefreshCw size={20} />
                <div>
                  <h4>Complimentary Returns</h4>
                  <p>14-day hassle-free return window.</p>
                </div>
              </div>
            </div>

            <div className={styles.sellerInfo}>
              <p>Sold and shipped by <strong>{product.seller?.name || 'Shopease Premium'}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
