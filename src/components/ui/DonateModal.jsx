"use client";
import React, { useState, useEffect } from 'react';
import { X, Heart, ShieldCheck, CheckCircle2, QrCode, Sparkles, Smartphone, Check, Loader2 } from 'lucide-react';
import styles from './DonateModal.module.css';
import Button from './Button';
import { dbService } from '../../lib/dbService';

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
  const [amount, setAmount] = useState('500');
  const [selectedPreset, setSelectedPreset] = useState(500);
  const [donationType, setDonationType] = useState('Monthly');
  const [status, setStatus] = useState('idle'); // idle, payment_qr, success
  const [timeLeft, setTimeLeft] = useState(60);
  const [pendingDonation, setPendingDonation] = useState(null);

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

  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const mon = `${today.toLocaleString('en-GB', { month: 'short' })} ${today.getFullYear()}`;

    const newDonation = {
      id: Date.now(),
      name: donorName,
      email: donorEmail,
      amount: parseFloat(amount),
      type: donationType,
      date: dateStr,
      month: mon,
      status: donationType === 'Monthly' ? 'Active' : 'Completed'
    };

    setPendingDonation(newDonation);
    setStatus('payment_qr');
    setTimeLeft(60);
  };

  // 60-second (1 minute) countdown
  useEffect(() => {
    let timer;
    if (status === 'payment_qr' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (status === 'payment_qr' && timeLeft === 0) {
      // Auto transition to Thank You window when timer runs out
      if (pendingDonation) {
        dbService.saveItem('donations', pendingDonation);
        dbService.logActivity('CREATE', 'Donations', `Contribution intent of ₹${pendingDonation.amount.toLocaleString()} received via UPI QR from ${pendingDonation.name}`, 'donor');
      }
      setStatus('success');
    }
    return () => clearInterval(timer);
  }, [status, timeLeft, pendingDonation]);

  const handleConfirmPaidNow = async () => {
    if (pendingDonation) {
      await dbService.saveItem('donations', pendingDonation);
      await dbService.logActivity('CREATE', 'Donations', `Contribution intent of ₹${pendingDonation.amount.toLocaleString()} received via UPI QR from ${pendingDonation.name}`, 'donor');
    }
    setStatus('success');
  };

  const handleClose = () => {
    setStatus('idle');
    setDonorName('');
    setDonorEmail('');
    setAmount('500');
    setSelectedPreset(500);
    setTimeLeft(60);
    setPendingDonation(null);
    onClose();
  };

  if (!isOpen) return null;

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {status === 'payment_qr' ? (
          <div className={styles.qrModalContent}>
            <div className={styles.qrHeader}>
              <span className={styles.securePill}>
                <ShieldCheck size={14} /> Official UPI Payment
              </span>
              <h3>Scan & Pay with Any UPI App</h3>
              <p className={styles.qrSub}>
                Pledge amount: <strong style={{ color: '#1F5B35', fontSize: '1.15rem' }}>₹{parseFloat(amount || 0).toLocaleString()}</strong> ({donationType})
              </p>
            </div>

            <div className={styles.qrBoxWrapper}>
              <div className={styles.qrImageFrame}>
                <img 
                  src="/qr-payment.jpg" 
                  alt="JPRD Foundation UPI Payment QR Code" 
                  className={styles.qrImage}
                />
                <div className={styles.scanLaser} />
              </div>

              <div className={styles.appBadges}>
                <span className={styles.appName}>Google Pay</span>
                <span className={styles.appName}>PhonePe</span>
                <span className={styles.appName}>Paytm</span>
                <span className={styles.appName}>BHIM UPI</span>
              </div>
            </div>

            <div className={styles.timerCard}>
              <div className={styles.timerProgress}>
                <div 
                  className={styles.timerBar} 
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                />
              </div>
              <div className={styles.timerText}>
                <Loader2 size={15} className={styles.spinIcon} />
                <span>Please complete payment in UPI app (Window closes in <strong>{formatTime(timeLeft)}</strong>)</span>
              </div>
            </div>

            <div className={styles.qrActions}>
              <button 
                type="button" 
                className={styles.confirmPaidBtn}
                onClick={handleConfirmPaidNow}
              >
                <Check size={17} /> Continue
              </button>
              <button 
                type="button" 
                className={styles.backBtn}
                onClick={() => setStatus('idle')}
              >
                ← Change Amount / Edit Details
              </button>
            </div>
          </div>
        ) : status === 'success' ? (
          <div className={styles.successWrapper}>
            <div className={styles.heartGlow}>
              <Heart size={48} className={styles.successIcon} />
            </div>
            <div className={styles.receiptBadge}>
              <Sparkles size={14} /> Thank You for Your Generous Support
            </div>
            <h2>Thank You for Your Support!</h2>
            <p>
              Dear <strong>{donorName || 'Generous Supporter'}</strong>, thank you for standing with JPRD Foundation. Your pledge of <strong style={{color:'#1F5B35'}}>₹{parseFloat(amount || 0).toLocaleString()} ({donationType})</strong> directly helps us empower rural communities with education and healthcare.
            </p>
            <div className={styles.successSummaryBox}>
              <div><span>Donor Name:</span> <strong>{donorName || 'Supporter'}</strong></div>
              <div><span>Amount:</span> <strong>₹{parseFloat(amount || 0).toLocaleString()}</strong></div>
              <div><span>Frequency:</span> <strong>{donationType}</strong></div>
              <div><span>Tax Benefit:</span> <strong>Eligible under 80G</strong></div>
            </div>
            <Button variant="primary" size="md" onClick={handleClose} style={{ minWidth: 180 }}>
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
