'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import styles from './success.module.css';

import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (sessionId) {
      clearCart();
      setLoading(false);
    } else {
      router.push('/');
    }
  }, [sessionId, clearCart, router]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Loader2 className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <CheckCircle size={80} className={styles.icon} />
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your order has been placed successfully and is being processed.</p>
        <div className={styles.btnGroup}>
          <Link href="/orders" className={styles.primaryBtn}>
            View My Orders
          </Link>
          <Link href="/products" className={styles.secondaryBtn}>
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className={styles.container}><Loader2 className={styles.spinner} /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
