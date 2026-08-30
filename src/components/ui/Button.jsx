"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  href, 
  className = '', 
  ...props 
}) => {
  const baseClasses = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;
  
  const content = (
    <>
      <span className={styles.text}>{children}</span>
      <div className={styles.glow} />
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={baseClasses}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98, y: 0 }}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={baseClasses}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98, y: 0 }}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default Button;
