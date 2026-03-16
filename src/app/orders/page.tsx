'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Package, Truck, CheckCircle, Clock, ExternalLink, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './orders.module.css';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className={styles.loader}>
        <Loader2 className={styles.spinner} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className={styles.errorContainer}>
        <h2>Please sign in to view your orders.</h2>
        <Link href="/auth/signin" className={styles.signInBtn}>Sign In</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="gradient-text">My Order History</h1>
        <p>Track and manage your recent purchases</p>
      </header>

      {orders.length > 0 ? (
        <div className={styles.ordersList}>
          {orders.map((order: any) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderMeta}>
                  <div className={styles.metaItem}>
                    <label>Order ID</label>
                    <span>#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <label>Date Placed</label>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <label>Total Amount</label>
                    <span className={styles.orderTotal}>${order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                <div className={`${styles.statusBadge} ${styles[order.status]}`}>
                  {order.status === 'delivered' ? <CheckCircle size={14} /> : 
                   order.status === 'shipped' ? <Truck size={14} /> : <Clock size={14} />}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              <div className={styles.orderItems}>
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className={styles.itemRow}>
                    <div className={styles.itemImage}>
                      <Image src={item.image} alt={item.name} fill />
                    </div>
                    <div className={styles.itemInfo}>
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity} × ${item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.orderFooter}>
                <button className={styles.trackBtn}>
                  <Truck size={16} /> Track Order
                </button>
                <button className={styles.invoiceBtn}>
                  View Invoice <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyOrders}>
          <Package size={64} className={styles.emptyIcon} />
          <h3>No orders found</h3>
          <p>Start shopping to see your orders here.</p>
          <Link href="/products" className={styles.shopBtn}>Explore Products</Link>
        </div>
      )}
    </div>
  );
}
