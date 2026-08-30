import React from 'react';
import styles from './ProjectDetail.module.css';
import Button from '@/components/ui/Button';

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export default function ProjectDetail({ params }) {
  // Use params.id to fetch data eventually. For now, placeholder structure.
  
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.container}>
          <div className={styles.meta}>
            <span className={styles.badge}>Education</span>
            <span className={styles.status}>ONGOING</span>
          </div>
          <h1 className={styles.title}>Village Education Initiative</h1>
          <p className={styles.location}>📍 Rural Districts</p>
        </div>
      </section>

      {/* Content Sections */}
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            
            {/* Main Content */}
            <div className={styles.mainCol}>
              <div className={styles.contentBlock}>
                <h2>The Challenge</h2>
                <p>[Placeholder: Explain the community problem.]</p>
              </div>

              <div className={styles.contentBlock}>
                <h2>Our Approach</h2>
                <p>[Placeholder: Explain what JPRD is doing.]</p>
              </div>

              <div className={styles.contentBlock}>
                <h2>Project Timeline</h2>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}><strong>Planning:</strong> [Details]</div>
                  <div className={styles.timelineItem}><strong>Implementation:</strong> [Details]</div>
                  <div className={styles.timelineItem}><strong>Monitoring:</strong> [Details]</div>
                  <div className={styles.timelineItem}><strong>Outcome:</strong> [Details]</div>
                </div>
              </div>

              <div className={styles.contentBlock}>
                <h2>Gallery</h2>
                <div className={styles.galleryPlaceholder}>
                  [Images will go here]
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className={styles.sideCol}>
              <div className={styles.cardDark}>
                <h3>Support This Work</h3>
                <p>Help us continue making an impact in rural districts.</p>
                <Button variant="primary" style={{ width: '100%', marginTop: '1rem' }}>Donate Now</Button>
              </div>
              
              <div className={styles.card}>
                <h3>Who We Serve</h3>
                <p>[Placeholder: Beneficiary category]</p>
              </div>
              
              <div className={styles.card}>
                <h3>Partners</h3>
                <p>[Placeholder: Verified Partners]</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
