"use client";
import React, { useState } from 'react';
import { X, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import styles from './DonateModal.module.css';
import Button from './Button';

const PRESET_AMOUNTS = [
  { amount: 200,  label: '₹200',  impact: 'Buys textbooks for 1 child for a month' },
  { amount: 500,  label: '₹500',  impact: 'Funds skill training for 1 youth (1 week)' },
  { amount: 1000, label: '₹1,000', impact: 'Supports a medical camp for 20 villagers' },
  { amount: 2500, label: '₹2,500', impact: 'Sponsors a girl\'s education for 3 months' },
  { amount: 5000, label: '₹5,000', impact: 'Funds a village awareness drive fully' },
];

export default function DonateModal({ isOpen, onClose }) {
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [donationType, setDonationType] = useState('Monthly');
  const [status, setStatus] = useState('idle'); // idle, submitting, success

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.amount);
    setAmount(String(preset.amount));
  };

  const handleCustomAmount = (e) => {
    setSelectedPreset(null);
    setAmount(e.target.value);
  };

  const getImpactLabel = () => {
    const match = PRESET_AMOUNTS.find(p => p.amount === selectedPreset);
    return match ? match.impact : null;
  };

  const handleDonateSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');

    setTimeout(() => {
      const stored = localStorage.getItem('jprd_donations');
      const donationsList = stored ? JSON.parse(stored) : [];

      const newDonation = {
        id: Date.now(),
        name: donorName,
        email: donorEmail,
        amount: parseFloat(amount),
        type: donationType,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: donationType === 'Monthly' ? 'Active' : 'Completed'
      };

      localStorage.setItem('jprd_donations', JSON.stringify([newDonation, ...donationsList]));
      setStatus('success');
    }, 1500);
  };

  const handleClose = () => {
    setStatus('idle');
    setDonorName('');
    setDonorEmail('');
    setAmount('');
    setSelectedPreset(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className={styles.successWrapper}>
            <div className={styles.heartGlow}>
              <Heart size={48} className={styles.successIcon} />
            </div>
            <h2>Thank You for Your Support!</h2>
            <p>Your contribution of <strong>₹{parseFloat(amount).toLocaleString()} ({donationType})</strong> has been recorded. It will directly support our educational and community drives.</p>
            <Button variant="primary" size="md" onClick={handleClose}>
              Close Window
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                <Heart size={24} />
              </div>
              <h3>Empower Communities</h3>
              <p>Every rupee you give changes a life. Choose an impact below or enter your own amount.</p>
            </div>

            <form onSubmit={handleDonateSubmit} className={styles.donateForm}>
              {/* Preset amounts */}
              <div className={styles.presetGrid}>
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset.amount}
                    type="button"
                    className={`${styles.presetBtn} ${selectedPreset === preset.amount ? styles.presetActive : ''}`}
                    onClick={() => handlePresetSelect(preset)}
                  >
                    <span className={styles.presetLabel}>{preset.label}</span>
                  </button>
                ))}
              </div>

              {/* Impact message */}
              {getImpactLabel() && (
                <div className={styles.impactBadge}>
                  <CheckCircle2 size={16} className={styles.impactIcon} />
                  <span>{getImpactLabel()}</span>
                </div>
              )}

              {/* Divider */}
              <div className={styles.divider}><span>or enter custom amount</span></div>

              <div className={styles.formGroup}>
                <label>Amount (INR)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={handleCustomAmount}
                  required
                  placeholder="e.g. 3000"
                  min="10"
                  className={styles.modalInput}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                    placeholder="e.g. Ramesh Kumar"
                    className={styles.modalInput}
                  />
                </div>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>Support Type</label>
                  <select
                    value={donationType}
                    onChange={(e) => setDonationType(e.target.value)}
                    className={styles.modalSelect}
                  >
                    <option value="Monthly">Monthly Recurring</option>
                    <option value="One-time">One-time</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  required
                  placeholder="e.g. ramesh@email.com"
                  className={styles.modalInput}
                />
              </div>

              <div className={styles.trustBanner}>
                <ShieldCheck size={18} className={styles.trustIcon} />
                <span>100% Secure · Transparent Resource Tracking · 80G Tax Benefit</span>
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                className={styles.submitBtn}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Processing...' : `Complete Donation${amount ? ` — ₹${parseFloat(amount || 0).toLocaleString()}` : ''}`}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
