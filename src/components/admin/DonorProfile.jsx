"use client";
import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Calendar, TrendingUp, FileText } from 'lucide-react';
import styles from './DonorProfile.module.css';

export default function DonorProfile({ donor, onClose }) {
  const [allDonations, setAllDonations] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('jprd_donations');
    if (stored) {
      const all = JSON.parse(stored);
      // Show all donations from same email
      setAllDonations(all.filter(d => d.email === donor.email));
    }
  }, [donor.email]);

  const totalGiven = allDonations.reduce((a, d) => a + d.amount, 0);
  const firstDonation = allDonations[allDonations.length - 1];
  const initials = donor.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>

        {/* Header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <h2>{donor.name}</h2>
            <div className={styles.metaRow}>
              <span><Mail size={14} /> {donor.email}</span>
              <span className={`${styles.typeBadge} ${donor.type === 'Monthly' ? styles.badgeGreen : styles.badgeBlue}`}>
                {donor.type} Donor
              </span>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpi}>
            <TrendingUp size={18} className={styles.kpiIcon} />
            <span className={styles.kpiVal}>₹{totalGiven.toLocaleString()}</span>
            <span className={styles.kpiLabel}>Total Donated</span>
          </div>
          <div className={styles.kpi}>
            <FileText size={18} className={styles.kpiIcon} />
            <span className={styles.kpiVal}>{allDonations.length}</span>
            <span className={styles.kpiLabel}>Transactions</span>
          </div>
          <div className={styles.kpi}>
            <Calendar size={18} className={styles.kpiIcon} />
            <span className={styles.kpiVal}>{firstDonation?.date || '—'}</span>
            <span className={styles.kpiLabel}>First Donation</span>
          </div>
        </div>

        {/* Donation History */}
        <div className={styles.historySection}>
          <h4>Donation History</h4>
          <table className={styles.table}>
            <thead>
              <tr><th>Date</th><th>Amount</th><th>Type</th><th>Status</th></tr>
            </thead>
            <tbody>
              {allDonations.map(d => (
                <tr key={d.id}>
                  <td>{d.date}</td>
                  <td className={styles.amt}>₹{d.amount.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.badge} ${d.type === 'Monthly' ? styles.badgeGreen : styles.badgeBlue}`}>
                      {d.type}
                    </span>
                  </td>
                  <td>{d.status}</td>
                </tr>
              ))}
              {allDonations.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem', color: '#999' }}>No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div className={styles.notesSection}>
          <h4>Admin Notes</h4>
          <textarea
            className={styles.notesInput}
            placeholder="Add notes about this donor (e.g. preferred programs, contact preference)..."
            rows={3}
          />
          <button className={styles.saveNotesBtn}>Save Notes</button>
        </div>
      </div>
    </div>
  );
}
