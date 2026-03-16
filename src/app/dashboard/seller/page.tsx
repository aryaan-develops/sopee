'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Package, DollarSign, TrendingUp, Plus, Loader2, Trash2 } from 'lucide-react';
import AddProductModal from '@/components/AddProductModal';
import Image from 'next/image';
import styles from './seller.module.css';

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') redirect('/auth/signin');
    if (session?.user && (session.user as any).role === 'seller') {
      fetchProducts();
    }
  }, [session, status]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?sellerId=${(session?.user as any).id}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' }); // We'll need to create this route
      fetchProducts();
    } catch (err) {
      console.error('Delete failed');
    }
  };

  if (status === 'loading') return <div className={styles.loader}><Loader2 className={styles.spinner} /></div>;

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: '#3498db' },
    { label: 'Total Sales', value: '$0', icon: DollarSign, color: '#2ecc71' },
    { label: 'Store Status', value: 'Active', icon: TrendingUp, color: '#d4af37' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Seller Dashboard</h1>
          <p>Welcome back, {session?.user?.name}</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <Plus size={20} /> Add Product
        </button>
      </header>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statInfo}>
              <p>{stat.label}</p>
              <h3>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <section className={styles.recentActivity}>
        <div className={styles.sectionHeader}>
          <h2>My Products</h2>
        </div>

        {loading ? (
          <div className={styles.innerLoader}><Loader2 className={styles.spinner} /></div>
        ) : products.length > 0 ? (
          <div className={styles.productsTable}>
            {products.map((product: any) => (
              <div key={product._id} className={styles.productRow}>
                <div className={styles.rowInfo}>
                  <div className={styles.pImg}>
                    <Image src={product.images[0]} alt={product.name} fill />
                  </div>
                  <div>
                    <h4>{product.name}</h4>
                    <span>{product.category}</span>
                  </div>
                </div>
                <div className={styles.rowPrice}>${product.price}</div>
                <button onClick={() => deleteProduct(product._id)} className={styles.deleteBtn}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>You haven't added any products yet.</p>
            <button className={styles.smallAddBtn} onClick={() => setShowModal(true)}>
              Create your first product
            </button>
          </div>
        )}
      </section>

      {showModal && (
        <AddProductModal 
          onClose={() => setShowModal(false)} 
          onSuccess={fetchProducts} 
        />
      )}
    </div>
  );
}
