'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { data: session } = useSession();
  const { cartCount } = useCart();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={`${styles.logo} gradient-text`}>
          Shopease<span className={styles.dot}>.</span>
        </Link>

        <div className={styles.links}>
          <Link href="/products" className={styles.link}>Shop</Link>
          {session?.user && (session.user as any).role === 'seller' && (
            <Link href="/dashboard/seller" className={styles.link}>
              <LayoutDashboard size={18} /> Seller Panel
            </Link>
          )}
        </div>

        <div className={styles.actions}>
          {session ? (
            <>
              <Link href="/cart" className={styles.cartIcon}>
                <ShoppingCart size={20} />
                <span className={styles.badge}>{cartCount}</span>
              </Link>
              <div className={styles.userProfile}>
                <User size={20} />
                <div className={styles.dropdown}>
                  <p className={styles.userName}>{session.user?.name}</p>
                  <p className={styles.userRole}>{(session.user as any).role}</p>
                  <hr className={styles.divider} />
                  <Link href="/orders" className={styles.dropdownItem}>
                    <Package size={16} /> My Orders
                  </Link>
                  <button onClick={() => signOut()} className={styles.dropdownItem}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link href="/auth/signin" className={styles.loginBtn}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
