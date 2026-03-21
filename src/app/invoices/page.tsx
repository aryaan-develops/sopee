'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FileText, Download, CheckCircle, Clock, Loader2 } from 'lucide-react';
import styles from './invoices.module.css';

export default function InvoicesPage() {
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchInvoices();
    }
  }, [session]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/invoices');
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loader}><Loader2 className={styles.spinner} /></div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Billing & Invoices</h1>
        <p>Manage your billing history and download invoices</p>
      </header>

      <div className={styles.invoiceGrid}>
        {invoices.length > 0 ? (
          invoices.map((inv: any) => (
            <div key={inv.id} className={styles.invoiceCard}>
              <div className={styles.cardHeader}>
                <div className={styles.idBox}>
                  <FileText size={20} />
                  <span>{inv.id}</span>
                </div>
                <div className={`${styles.status} ${styles[inv.status]}`}>
                  {inv.status === 'paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {inv.status.toUpperCase()}
                </div>
              </div>
              
              <div className={styles.cardBody}>
                <div className={styles.info}>
                  <label>Date</label>
                  <span>{new Date(inv.date).toLocaleDateString()}</span>
                </div>
                <div className={styles.info}>
                  <label>Amount</label>
                  <span className={styles.amount}>${inv.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className={styles.itemList}>
                {inv.items?.map((item: any, idx: number) => (
                  <div key={idx} className={styles.smallItem}>
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <button className={styles.downloadBtn} onClick={() => alert('Downloading invoice...')}>
                <Download size={16} /> Download PDF
              </button>
            </div>
          ))
        ) : (
          <div className={styles.empty}>No invoices found yet.</div>
        )}
      </div>
    </div>
  );
}
