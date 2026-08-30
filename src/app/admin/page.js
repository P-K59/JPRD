"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';
import Button from '../../components/ui/Button';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();


  const handleLogin = (e) => {
    e.preventDefault();
    
    // RBAC Mock Database
    const users = {
      'admin': { pass: 'jprd2026', role: 'superadmin' },
      'finance': { pass: 'finance123', role: 'finance' },
      'staff': { pass: 'staff123', role: 'staff' },
    };

    const user = users[username.toLowerCase()];

    if (user && user.pass === password) {
      localStorage.setItem('adminSession', 'true');
      localStorage.setItem('adminRole', user.role);
      router.push('/admin/dashboard');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBg}>
        <div className={styles.glow1} />
        <div className={styles.glow2} />
      </div>

      <div className={`${styles.loginCard}`}>
        <div className={styles.logoWrapper}>
          <img src="/logo.png" alt="JPRD Logo" className={styles.loginLogo} />
          <h2>JPRD Admin Portal</h2>
          <p>Sign in to manage portal records and content</p>
        </div>

        <form onSubmit={handleLogin} className={styles.loginForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="Enter admin username"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Enter password"
              className={styles.input}
            />
          </div>

          <Button variant="primary" size="lg" type="submit" className={styles.submitBtn}>
            Authorize Login
          </Button>
        </form>
      </div>
    </div>
  );
}
