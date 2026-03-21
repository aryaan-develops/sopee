'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './cart.module.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cart,
          totalAmount: cartTotal
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Checkout failed');

      // Success!
      clearCart();
      router.push('/orders');
      router.refresh();

    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'Checkout unavailable');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyContent}>
          <ShoppingBag size={80} className={styles.emptyIcon} />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link href="/products" className={styles.shopBtn}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Shopping Cart</h1>
      
      <div className={styles.layout}>
        <div className={styles.itemsList}>
          {cart.map((item: any) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.imageWrapper}>
                <Link href={`/products/${item.id}`} className={styles.imageLink}>
                  <Image src={item.image} alt={item.name} fill className={styles.image} />
                </Link>
              </div>
              
              <div className={styles.details}>
                <div>
                  <span className={styles.itemCategory}>{item.category}</span>
                  <Link href={`/products/${item.id}`}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                  </Link>
                </div>
                <div className={styles.itemFooter}>
                  <div className={styles.quantityControls}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.qtyBtn}
                    >
                      <Minus size={16} />
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.qtyBtn}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className={styles.removeBtn}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className={styles.priceSection}>
                <p className={styles.itemPrice}>${(item.price * item.quantity).toLocaleString()}</p>
                <p className={styles.unitPrice}>${item.price.toLocaleString()} each</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summaryCard}>
          <h3>Order Summary</h3>
          <div className={styles.summaryItem}>
            <span>Subtotal ({cartCount} items)</span>
            <span>${cartTotal.toLocaleString()}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Shipping</span>
            <span className={styles.free}>FREE</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Tax</span>
            <span>Calculated at checkout</span>
          </div>
          <hr className={styles.divider} />
          <div className={styles.totalPrice}>
            <span>Total</span>
            <span>${cartTotal.toLocaleString()}</span>
          </div>
          <button 
            className={styles.checkoutBtn}
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? <Loader2 className={styles.spinner} /> : <>Proceed to Checkout <ArrowRight size={20} /></>}
          </button>
          <p className={styles.safeChoice}>
            Secured by SSL Encryption
          </p>
        </div>
      </div>
    </div>
  );
}
