'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Search, Heart, Menu, X, LogOut, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

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
    <nav className={`${styles.navbar} ${(isScrolled || !isHomePage) ? styles.scrolled : styles.transparent}`}>
      <div className={styles.container}>
        {/* Left: Brand Logo */}
        <Link href="/" className={styles.logo}>
          <h1 className={styles.logoText}>SHOP EASE</h1>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        {!searchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.navLinks}
          >
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={styles.link}>
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}

        {/* Global Search Overlay (Desktop) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.form 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '40%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              onSubmit={handleSearch}
              className={styles.searchForm}
            >
              <input 
                autoFocus
                type="text" 
                placeholder="Search the archive..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <X size={18} />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Right: Icons & Actions */}
        <div className={styles.actions}>
          {!searchOpen && (
            <button 
              className={styles.iconBtn} 
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={20} />
            </button>
          )}
          
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

                  <Link href="/profile" className={styles.dropdownItem}>
                    <User size={16} /> My Profile
                  </Link>

                  <Link href="/orders" className={styles.dropdownItem}>
                    <ShoppingCart size={16} /> My Orders
                  </Link>
                  
                  <button onClick={() => signOut()} className={`${styles.dropdownItem} ${styles.logout}`}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth/signin" className={styles.loginBtn}>
                LOGIN
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
                <form onSubmit={handleSearch} className={styles.mobileSearch}>
                  <input 
                    type="text" 
                    placeholder="Search catalog..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
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
