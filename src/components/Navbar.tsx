'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Search, Heart, Menu, X, LogOut, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'Clothing', href: '/clothing' },
    { name: 'Footwear', href: '/footwear' },
    { name: 'Accessories', href: '/accessories' },
    { name: 'Lookbook', href: '/lookbook' },
    { name: 'Sale', href: '/sale' },
  ];

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : styles.transparent}`}>
      <div className={styles.container}>
        {/* Left: Brand Logo */}
        <Link href="/" className={styles.logo}>
          <h1 className={styles.logoText}>SHOP EASE</h1>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className={styles.link}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Icons & Actions */}
        <div className={styles.actions}>
          <button className={styles.iconBtn} aria-label="Search">
            <Search size={20} />
          </button>
          
          <Link href="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
            <Heart size={20} />
          </Link>

          <div className={styles.userSection}>
            {session ? (
              <div className={styles.userProfile}>
                <User size={20} className={styles.icon} />
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropName}>{session.user?.name}</p>
                    <span className={styles.dropRole}>{session.user?.role}</span>
                  </div>
                  <hr className={styles.divider} />
                  
                  {session.user?.role === 'admin' && (
                    <Link href="/dashboard/admin" className={styles.dropdownItem}>
                      <ShieldCheck size={16} /> Admin Panel
                    </Link>
                  )}
                  
                  {session.user?.role === 'seller' && (
                    <Link href="/dashboard/seller" className={styles.dropdownItem}>
                      <ShoppingBag size={16} /> Seller Panel
                    </Link>
                  )}

                  <Link href="/orders" className={styles.dropdownItem}>
                    <ShoppingCart size={16} /> My Orders
                  </Link>
                  
                  <button onClick={() => signOut()} className={`${styles.dropdownItem} ${styles.logout}`}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth/signin" className={styles.iconBtn} aria-label="Login">
                <User size={20} />
              </Link>
            )}
          </div>

          <Link href="/cart" className={styles.cartBtn}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className={styles.menuBtn} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className={styles.mobileOverlay}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.mobileContent}>
              <div className={styles.mobileHeader}>
                 <h2 className={styles.logoText}>SHOP EASE</h2>
                 <button onClick={() => setMobileMenuOpen(false)}><X size={28} /></button>
              </div>
              <div className={styles.mobileLinks}>
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={styles.mobileLink}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
