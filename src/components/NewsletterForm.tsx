'use client';

import { useState } from 'react';
import styles from '../app/page.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Subscription failed');
      }

      setStatus('success');
      setMessage(data.message);
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <div className={styles.newsletterBox}>
      <h3>Stay Inspired</h3>
      <p>Subscribe to our newsletter for early access to new drops and styling tips.</p>
      
      <form onSubmit={handleSubmit} className={styles.subscribeForm}>
        <input 
          type="email" 
          placeholder="Your Email Address" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading' || status === 'success'}
        />
        <button type="submit" disabled={status === 'loading' || status === 'success'}>
          {status === 'loading' ? 'Joining...' : status === 'success' ? 'Joined!' : 'Subscribe'}
        </button>
      </form>

      <AnimatePresence>
        {message && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ 
              marginTop: '1.5rem', 
              fontSize: '0.9rem', 
              color: status === 'error' ? '#ff4d4d' : '#accent-beige' 
            }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
