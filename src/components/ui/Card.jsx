"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './Card.module.css';

const Card = ({ children, className = '', hoverEffect = true, ...props }) => {
  const baseClasses = `${styles.card} ${className}`;

  if (!hoverEffect) {
    return (
      <div className={baseClasses} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      <div className={styles.content}>
        {children}
      </div>
      <div className={styles.shadow} />
    </motion.div>
  );
};

export default Card;
