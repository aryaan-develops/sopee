'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AnimatedSlideshow.module.css';

const images = [
  '/images/slideshow/slideshow1.png',
  '/images/slideshow/slideshow2.png',
  '/images/slideshow/slideshow3.png'
];

export default function AnimatedSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.slideshowContainer}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={styles.slide}
        >
          <Image
            src={images[index]}
            alt={`Slideshow image ${index + 1}`}
            fill
            className={styles.image}
            priority
          />
          <div className={styles.overlay}></div>
          <div className={styles.content}>
            <motion.span 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={styles.exclusive}
            >
              EXCLUSIVE
            </motion.span>
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              SEASON FINALE
            </motion.h3>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className={styles.dots}>
        {images.map((_, i) => (
          <div 
            key={i} 
            className={`${styles.dot} ${index === i ? styles.activeDot : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
