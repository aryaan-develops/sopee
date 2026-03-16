'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import styles from './PaymentModal.module.css';

interface PaymentModalProps {
  total: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentModal({ total, onSuccess, onCancel }: PaymentModalProps) {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2500);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {step === 'details' && (
          <div className={styles.content}>
            <div className={styles.header}>
              <ShieldCheck className={styles.secIcon} />
              <h2>Secure Checkout</h2>
              <p>Total amount: <strong>${total.toLocaleString()}</strong></p>
            </div>

            <div className={styles.dummyForm}>
              <div className={styles.inputGroup}>
                <label>Card Number</label>
                <div className={styles.cardInput}>
                  <CreditCard size={18} />
                  <input type="text" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" disabled />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Expiry</label>
                  <input type="text" placeholder="MM/YY" defaultValue="12/28" disabled />
                </div>
                <div className={styles.inputGroup}>
                  <label>CVC</label>
                  <input type="text" placeholder="•••" defaultValue="123" disabled />
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <button className={styles.payBtn} onClick={handlePay}>
                Confirm & Pay ${total.toLocaleString()}
              </button>
              <button className={styles.cancelBtn} onClick={onCancel}>
                Cancel
              </button>
            </div>
            <p className={styles.hint}>This is a secure simulation. No real money will be charged.</p>
          </div>
        )}

        {step === 'processing' && (
          <div className={styles.processing}>
            <Loader2 className={styles.spinner} size={48} />
            <h3>Processing Payment</h3>
            <p>Verifying with your bank...</p>
          </div>
        )}

        {step === 'success' && (
          <div className={styles.success}>
            <CheckCircle2 className={styles.successIcon} size={64} />
            <h3>Transaction Approved!</h3>
            <p>Redirecting you to your order confirmation...</p>
          </div>
        )}
      </div>
    </div>
  );
}
