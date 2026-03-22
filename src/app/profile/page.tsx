'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  X,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './profile.module.css';

interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredDelivery: 'Standard',
  });

  const [addressForm, setAddressForm] = useState<Address>({
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      isDefault: false
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      setUser(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        preferredDelivery: data.preferredDelivery || 'Standard',
      });
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, addresses: user.addresses }),
      });
      const updatedUser = await res.json();
      setUser(updatedUser);
      // Optional: Update next-auth session if name changed
      await update({ name: formData.name });
      setSaving(false);
    } catch (err) {
      console.error('Update failed:', err);
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      let newAddresses = [...(user.addresses || [])];
      
      if (addressForm.isDefault) {
          // Reset other defaults
          newAddresses = newAddresses.map(a => ({ ...a, isDefault: false }));
      }

      if (editingAddress) {
        newAddresses = newAddresses.map(a => a._id === editingAddress._id ? addressForm : a);
      } else {
        newAddresses.push({ ...addressForm });
      }

      // If it's the first address, make it default
      if (newAddresses.length === 1) {
          newAddresses[0].isDefault = true;
      }

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, addresses: newAddresses }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update address');
      }

      setUser(data);
      setShowAddressModal(false);
      setEditingAddress(null);
      setAddressForm({
          street: '', city: '', state: '', country: '', zipCode: '', isDefault: false
      });
      setSaving(false);
    } catch (err: any) {
      console.error('Address save failed:', err);
      alert(err.message || 'Failed to save address. Please try again.');
      setSaving(false);
    }
  };

  const handleRemoveAddress = async (id: string) => {
    try {
      const newAddresses = user.addresses.filter((a: any) => a._id !== id);
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, addresses: newAddresses }),
      });
      const updatedUser = await res.json();
      setUser(updatedUser);
    } catch (err) {
      console.error('Remove address failed:', err);
    }
  };

  const handleSetDefault = async (id: string) => {
      try {
          const newAddresses = user.addresses.map((a: any) => ({
              ...a,
              isDefault: a._id === id
          }));
          const res = await fetch('/api/user/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...formData, addresses: newAddresses }),
          });
          const updatedUser = await res.json();
          setUser(updatedUser);
      } catch (err) {
          console.error('Set default failed:', err);
      }
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loadingWrap}>
          <Loader2 className={styles.spinner} size={48} />
          <p>Unlocking your console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <span>Your Account</span>
             <h1>Member Profile</h1>
          </motion.div>
        </header>

        <div className={styles.layout}>
          {/* Left: General Info */}
          <aside>
            <section className={styles.profileCard}>
              <div className={styles.roleBadge}>{user.role}</div>
              <h2>Account Details</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className={styles.formGroup}>
                  <label><User size={14} /> Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label><Mail size={14} /> Email Address</label>
                  <input type="email" value={user.email} disabled />
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                    Email cannot be changed for security.
                  </p>
                </div>
                <div className={styles.formGroup}>
                  <label><Smartphone size={14} /> Phone</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Preferred Delivery Method</label>
                  <select 
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      background: 'white',
                      border: '1px solid var(--border-light)',
                      borderRadius: '2px',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                    value={formData.preferredDelivery}
                    onChange={(e) => setFormData({...formData, preferredDelivery: e.target.value})}
                  >
                    <option value="Standard">Standard (3-5 Days)</option>
                    <option value="Express">Express (1-2 Days)</option>
                    <option value="Next-Day">Next-Day Delivery</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className={styles.saveBtn}
                  disabled={saving}
                >
                  {saving ? <Loader2 className={styles.spinner} size={18} /> : 'Save Changes'}
                </button>
              </form>
            </section>
          </aside>

          {/* Right: Addresses */}
          <main>
            <section className={styles.addressSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                 <h2 style={{ border: 'none', margin: 0, padding: 0 }}>Delivery Archive</h2>
                 <button 
                  className={styles.addAddressBtn}
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressForm({ street: '', city: '', state: '', country: '', zipCode: '', isDefault: false });
                    setShowAddressModal(true);
                  }}
                 >
                   <Plus size={18} /> Add New Address
                 </button>
              </div>

              <div className={styles.addressGrid}>
                {user.addresses?.length > 0 ? (
                  user.addresses.map((addr: any) => (
                    <div 
                      key={addr._id} 
                      className={`${styles.addressCard} ${addr.isDefault ? styles.isDefault : ''}`}
                    >
                      {addr.isDefault && <span className={styles.defaultBadge}>Default</span>}
                      <p>
                        <strong>Residential Address</strong>
                        {addr.street}<br />
                        {addr.city}, {addr.state} {addr.zipCode}<br />
                        {addr.country}
                      </p>
                      
                      <div className={styles.cardActions}>
                        <button onClick={() => {
                            setEditingAddress(addr);
                            setAddressForm(addr);
                            setShowAddressModal(true);
                        }}>
                          <Edit3 size={14} /> Edit
                        </button>
                        {!addr.isDefault && (
                          <button onClick={() => handleSetDefault(addr._id)}>
                            <CheckCircle2 size={14} /> Set Default
                          </button>
                        )}
                        <button 
                          className={styles.removeBtn}
                          onClick={() => handleRemoveAddress(addr._id)}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-light)', borderRadius: '4px' }}>
                    <MapPin size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>No delivery destinations saved yet.</p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Address Modal Overlay */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button className={styles.closeBtn} onClick={() => setShowAddressModal(false)}>
                <X size={24} />
              </button>
              
              <div className={styles.modalTitle}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem' }}>
                  {editingAddress ? 'Update Destination' : 'New Destination'}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Enter delivery location details</p>
              </div>

              <form onSubmit={handleAddressSubmit}>
                <div className={styles.formGroup}>
                  <label>Street Address</label>
                  <input 
                    required
                    type="text" 
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                  />
                </div>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>City</label>
                    <input 
                      required
                      type="text" 
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>State / Province</label>
                    <input 
                      required
                      type="text" 
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                    />
                  </div>
                </div>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>Zip / Postal Code</label>
                    <input 
                      required
                      type="text" 
                      value={addressForm.zipCode}
                      onChange={(e) => setAddressForm({...addressForm, zipCode: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Country</label>
                    <input 
                      required
                      type="text" 
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                   <input 
                    id="isDefault"
                    type="checkbox" 
                    style={{ width: 'auto' }}
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                   />
                   <label htmlFor="isDefault" style={{ marginBottom: 0, cursor: 'pointer' }}>Set as default delivery address</label>
                </div>

                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? <Loader2 className={styles.spinner} size={18} /> : (editingAddress ? 'Update Archive' : 'Save To Archive')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
