"use client";
import React from 'react';
import styles from './Footer.module.css';
import { Globe, Users, Share2, MessageSquare, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          <div className={styles.brandCol}>
            <a href="/" className={styles.logo}>
              <img src="/logo.png" alt="JPRD Foundation Logo" className={styles.logoImage} />
              <span className={styles.logoText}>FOUNDATION</span>
            </a>
            <p className={styles.tagline}>
              Joy • Progress • Respect • Development
            </p>
            <p className={styles.mission}>
              मानव सेवा ही धर्म (Service to humanity is religion)
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialIcon} aria-label="Website"><Globe size={20} /></a>
              <a href="#" className={styles.socialIcon} aria-label="Community"><Users size={20} /></a>
              <a href="#" className={styles.socialIcon} aria-label="Share"><Share2 size={20} /></a>
              <a href="#" className={styles.socialIcon} aria-label="Contact"><MessageSquare size={20} /></a>
            </div>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <nav className={styles.nav}>
              <a href="#about" className={styles.link}>About Us</a>
              <a href="#programs" className={styles.link}>Programs</a>
              <a href="#projects" className={styles.link}>Projects</a>
              <a href="#events" className={styles.link}>Events</a>
              <a href="#gallery" className={styles.link}>Gallery</a>
            </nav>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Get Involved</h4>
            <nav className={styles.nav}>
              <a href="#volunteer" className={styles.link}>Volunteer</a>
              <a href="#csr" className={styles.link}>CSR Partnerships</a>
              <a href="#donate" className={styles.link}>Donate</a>
              <a href="#careers" className={styles.link}>Careers</a>
            </nav>
          </div>

          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>Contact Us</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <MapPin size={18} className={styles.contactIcon} />
                <span>Panchayat Bhawan, Raopura, Bhaisakharag, Naibazar, Mau, Uttar Pradesh - 275303</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={18} className={styles.contactIcon} />
                <span>+91 8485960821</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={18} className={styles.contactIcon} />
                <span>jprdfoundation@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        <div className={styles.bottomBar}>
          <p>&copy; {new Date().getFullYear()} JPRD Foundation. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <a href="/admin">Admin Login</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
