'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Users, Package, ShoppingCart, DollarSign, 
  Trash2, ShieldCheck, Loader2, RefreshCcw 
} from 'lucide-react';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<{ products: any[], orders: any[], invoices: any[] }>({ 
    products: [], 
    orders: [], 
    invoices: [] 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [prodRes, orderRes, invRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/invoices')
      ]);
      
      const [products, orders, invoices] = await Promise.all([
        prodRes.json(),
        orderRes.json(),
        invRes.json()
      ]);

      setData({ products, orders, invoices });
    } catch (err) {
      console.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  if (loading) return <div className={styles.loader}><Loader2 className={styles.spinner} /></div>;

  const stats = [
    { label: 'Total Revenue', value: '$' + data.invoices.reduce((sum, i) => sum + i.amount, 0).toLocaleString(), icon: DollarSign, color: '#10b981' },
    { label: 'Active Products', value: data.products.length, icon: Package, color: '#3b82f6' },
    { label: 'Total Orders', value: data.orders.length, icon: ShoppingCart, color: '#8b5cf6' },
    { label: 'Platform Users', value: 3, icon: Users, color: '#f59e0b' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.badge}><ShieldCheck size={16} /> Admin Mode</div>
          <h1>Platform Overview</h1>
          <p>Full control over products, orders, and system settings</p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchAllData}>
          <RefreshCcw size={18} /> Sync Data
        </button>
      </header>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={26} />
            </div>
            <div className={styles.statInfo}>
              <p>{stat.label}</p>
              <h3>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.contentGrid}>
        <section className={styles.tableSection}>
          <h2>Manage Products</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Seller</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((p: any) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>${p.price}</td>
                    <td>{p.sellerId === '2' ? 'Premium Seller' : 'Unknown'}</td>
                    <td>
                      <button onClick={() => deleteProduct(p.id)} className={styles.deleteBtn}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.tableSection}>
          <h2>Recent Orders</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((o: any) => (
                  <tr key={o.id}>
                    <td className={styles.mono}>{o.id.substring(0, 8)}</td>
                    <td>{o.customerName || 'User Account'}</td>
                    <td>${o.totalAmount.toLocaleString()}</td>
                    <td><span className={`${styles.statusLabel} ${styles[o.status]}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
