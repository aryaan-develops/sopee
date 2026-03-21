'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, LogOut, ChevronDown, Search, ShieldCheck, ShoppingCart, Menu, X } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {/* Left: Nav Links */}
          <div className={styles.navLinks}>
            {['New In', 'Products', 'Designers', 'Contact'].map((item) => (
              <Link key={item} href={item === 'Products' ? '/products' : '/'} className={styles.link}>
                {item}
                <motion.div className={styles.underline} layoutId="navUnderline" />
              </Link>
            ))}
          </div>

          {/* Center: Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoContainer}>
               <motion.div 
                 className={styles.logoSymbol}
                 animate={{ rotate: isScrolled ? 360 : 0 }}
                 transition={{ duration: 1, ease: "easeInOut" }}
               >
                 <div className={styles.logoDot} />
               </motion.div>
               <h1 className={styles.logoText}>ShopEase</h1>
            </div>
          </Link>

          {/* Right: Search & Actions */}
          <div className={styles.actions}>
            <div className={styles.searchContainer}>
              <Search size={18} className={styles.searchIcon} />
              <input type="text" placeholder="Explore..." className={styles.searchInput} />
            </div>

            <Link href="/cart" className={styles.cartBtn}>
              <ShoppingBag size={20} className={styles.icon} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={styles.badge}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {session ? (
              <div className={styles.userProfile}>
                <div className={styles.avatar}>
                  {session.user?.name?.charAt(0) || <User size={18} />}
                </div>
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
              <Link href="/auth/signin" className={styles.authBtn}>Login</Link>
            )}

            <button className={styles.menuBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
         {mobileMenuOpen && (
           <motion.div 
             className={styles.mobileOverlay}
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
           >
              <div className={styles.mobileLinks}>
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link href="/products" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>Account</Link>
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </nav>
  );
}
