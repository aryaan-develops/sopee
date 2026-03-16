'use client';

import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import styles from './AddProductModal.module.css';

interface AddProductModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductModal({ onClose, onSuccess }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Menswear',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create product');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRandomImage = () => {
    const categoryImages: any = {
      Menswear: [
        'https://images.unsplash.com/photo-1594932224016-0460832448ca?w=800',
        'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800',
        'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800'
      ],
      Womenswear: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
        'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800'
      ],
      Streetwear: [
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
        'https://images.unsplash.com/photo-1552346154-21d328109a27?w=800'
      ],
      Accessories: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
        'https://images.unsplash.com/photo-1509100194014-d49809396daa?w=800'
      ]
    };

    const images = categoryImages[formData.category] || categoryImages.Menswear;
    const randomImg = images[Math.floor(Math.random() * images.length)];
    setFormData({ ...formData, image: randomImg });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>List New Product</h2>
          <button onClick={onClose} className={styles.closeBtn}><X /></button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Product Name</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Midnight Silk Suit"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Description</label>
            <textarea 
              required 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Tell buyers about your product..."
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Price ($)</label>
              <input 
                type="number" 
                required 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Menswear">Menswear</option>
                <option value="Womenswear">Womenswear</option>
                <option value="Streetwear">Streetwear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Product Image</label>
            <div className={styles.imageActions}>
              <div className={styles.uploadBtn}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  id="file-upload"
                  className={styles.fileInput}
                />
                <label htmlFor="file-upload">
                  <Upload size={18} /> Upload from Device
                </label>
              </div>
              <button 
                type="button" 
                className={styles.randomBtn}
                onClick={generateRandomImage}
              >
                <Loader2 size={18} /> Generate Random
              </button>
            </div>
            
            <div className={styles.imageInputPreview}>
              <input 
                type="text" 
                required 
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="Or paste an image URL here..."
              />
              {formData.image && (
                <div className={styles.previewThumb}>
                  <img src={formData.image} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? <Loader2 className={styles.spinner} /> : 'Publish Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
