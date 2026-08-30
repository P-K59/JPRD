import React from 'react';
import styles from './ProgramDetail.module.css';
import Button from '@/components/ui/Button';

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export default function ProgramDetail({ params }) {
  // Use params.id to fetch data eventually. For now, placeholder structure.
  
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.container}>
          <div className={styles.badge}>Program Overview</div>
          <h1 className={styles.title}>Education & Digital Literacy</h1>
          <p className={styles.subtitle}>Supporting access to education, digital skills and learning opportunities.</p>
        </div>
      </section>

      {/* Content Sections */}
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            
            {/* Main Content */}
            <div className={styles.mainCol}>
              <div className={styles.contentBlock}>
                <h2>Why It Matters</h2>
                <p>[Placeholder: Detailed explanation of why this program is essential for the community.]</p>
              </div>

              <div className={styles.contentBlock}>
                <h2>Our Approach</h2>
                <p>[Placeholder: Detailed strategy on how JPRD addresses this issue.]</p>
              </div>

              <div className={styles.contentBlock}>
                <h2>Key Activities</h2>
                <ul className={styles.list}>
                  <li>[Placeholder: Activity 1]</li>
                  <li>[Placeholder: Activity 2]</li>
                  <li>[Placeholder: Activity 3]</li>
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className={styles.sideCol}>
              <div className={styles.card}>
                <h3>Who We Serve</h3>
                <p>[Placeholder: Beneficiary details]</p>
              </div>
              
              <div className={styles.card}>
                <h3>Impact Focus</h3>
                <p>Making a tangible difference in communities through dedicated initiatives.</p>
              </div>
              
              <div className={styles.cardDark}>
                <h3>Partner With Us</h3>
                <p>Join hands to scale this program's impact.</p>
                <Button variant="primary" style={{ width: '100%', marginTop: '1rem' }}>Contact Us</Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
