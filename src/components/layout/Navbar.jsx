"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Languages } from 'lucide-react';
import styles from './Navbar.module.css';
import Button from '../ui/Button';
import DonateModal from '../ui/DonateModal';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LanguageContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, t, toggleLang } = useLang();

  return (
    <>
      <motion.header
        className={styles.navbar}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.container}>
          {/* Logo */}
          <a href="/" className={styles.logo}>
            <img src="/logo.png" alt="JPRD Foundation Logo" className={styles.logoImage} />
            <span className={styles.logoText}>FOUNDATION</span>
          </a>

          {/* Desktop nav */}
          <nav className={styles.navLinks}>
            <a href="#about"    className={styles.link}>{t('nav_about')}</a>
            <a href="#programs" className={styles.link}>{t('nav_programs')}</a>
            <a href="#projects" className={styles.link}>{t('nav_projects')}</a>
            <a href="#team"     className={styles.link}>{t('nav_team')}</a>
            <a href="#csr"      className={styles.link}>{t('nav_csr')}</a>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Language toggle */}
            <button
              className={styles.iconToggle}
              onClick={toggleLang}
              title={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
              aria-label="Toggle language"
            >
              <Languages size={18} />
              <span className={styles.langLabel}>{lang === 'en' ? 'हिं' : 'EN'}</span>
            </button>

            {/* Dark mode toggle */}
            <button
              className={styles.iconToggle}
              onClick={toggleTheme}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'light' ? (
                  <motion.span key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{   rotate:  90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: 'flex' }}
                  >
                    <Moon size={18} />
                  </motion.span>
                ) : (
                  <motion.span key="sun"
                    initial={{ rotate: 90,  opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{   rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: 'flex' }}
                  >
                    <Sun size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <Button variant="outline" size="sm" href="#volunteer">{t('nav_volunteer')}</Button>
            <Button variant="primary" size="sm" onClick={() => setIsDonateOpen(true)}>{t('nav_donate')}</Button>
          </div>

          {/* Mobile hamburger */}
          <button className={styles.mobileMenuBtn} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} color="var(--color-white)" /> : <Menu size={28} color="var(--color-white)" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <nav className={styles.mobileNavLinks}>
                <a href="#about"    onClick={() => setIsMobileMenuOpen(false)}>{t('nav_about')}</a>
                <a href="#programs" onClick={() => setIsMobileMenuOpen(false)}>{t('nav_programs')}</a>
                <a href="#projects" onClick={() => setIsMobileMenuOpen(false)}>{t('nav_projects')}</a>
                <a href="#team"     onClick={() => setIsMobileMenuOpen(false)}>{t('nav_team')}</a>
                <a href="#csr"      onClick={() => setIsMobileMenuOpen(false)}>{t('nav_csr')}</a>
              </nav>
              <div className={styles.mobileActions}>
                {/* Mobile language + theme toggles */}
                <div className={styles.mobileToggles}>
                  <button className={styles.iconToggle} onClick={toggleLang}>
                    <Languages size={18} />
                    <span className={styles.langLabel}>{lang === 'en' ? 'हिं' : 'EN'}</span>
                  </button>
                  <button className={styles.iconToggle} onClick={toggleTheme}>
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  </button>
                </div>
                <Button variant="outline" size="sm" href="#volunteer" onClick={() => setIsMobileMenuOpen(false)}>{t('nav_volunteer')}</Button>
                <Button variant="primary" size="sm" onClick={() => { setIsMobileMenuOpen(false); setIsDonateOpen(true); }}>{t('nav_donate')}</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
    </>
  );
};

export default Navbar;
