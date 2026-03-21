'use client';

import Image from 'next/image';
import styles from './lookbook.module.css';
import { motion } from 'framer-motion';

const LOOKS = [
  { 
    id: 1, 
    title: 'The Urban Sophisticate', 
    subtitle: 'Classic tailoring meets modern minimalism.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1600'
  },
  { 
    id: 2, 
    title: 'Weekend Escape', 
    subtitle: 'Relaxed silhouettes in premium natural fibers.',
    image: 'https://images.unsplash.com/photo-1512436030959-216c52a39d33?w=1600'
  },
  { 
    id: 3, 
    title: 'Evening Elegance', 
    subtitle: 'Deep tones and luxurious textures.',
    image: 'https://images.unsplash.com/photo-1594932224011-801047298c48?w=1600'
  }
];

export default function LookbookPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className={styles.hero}
        >
          <h1>SEASON LOOKBOOK</h1>
          <p>A visual journey through our latest curated collections.</p>
        </motion.div>
      </header>

      <div className={styles.gallery}>
        {LOOKS.map((look, i) => (
          <motion.section 
            key={look.id} 
            className={styles.lookSection}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.lookImageWrapper}>
              <Image src={look.image} fill alt={look.title} className={styles.lookImage} />
            </div>
            <div className={styles.lookContent}>
              <span className={styles.lookNum}>Look 0{look.id}</span>
              <h2 className={styles.lookTitle}>{look.title}</h2>
              <p className={styles.lookSubtitle}>{look.subtitle}</p>
              <button className={styles.lookBtn}>EXPLORE COLLECTION</button>
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
