import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs 
} from 'firebase/firestore';

/**
 * Universal Database Service with Cloud Firestore support and localStorage fallback.
 */

// Helper to get local data
function getLocal(key, defaultData = []) {
  if (typeof window === 'undefined') return defaultData;
  try {
    const s = localStorage.getItem(`jprd_${key}`);
    return s ? JSON.parse(s) : defaultData;
  } catch (e) {
    return defaultData;
  }
}

// Helper to save local data
function saveLocal(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`jprd_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

export const dbService = {
  isCloudConnected: () => isFirebaseConfigured && db !== null,

  /**
   * Realtime collection listener with automatic fallback.
   * Calls callback(data) whenever data changes.
   * Returns an unsubscribe function.
   */
  subscribe(collectionName, defaultData, callback) {
    if (typeof window === 'undefined') {
      callback(defaultData);
      return () => {};
    }

    // 1. Cloud Firestore Realtime listener
    if (this.isCloudConnected()) {
      try {
        const colRef = collection(db, collectionName);
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
            saveLocal(collectionName, items); // sync locally as backup
            callback(items);
          } else {
            // Collection is empty: clear local storage cache and notify listeners with empty list
            saveLocal(collectionName, []);
            callback([]);
          }
        }, (err) => {
          console.warn(`Firestore listener error on ${collectionName}, using local fallback:`, err);
          callback(getLocal(collectionName, defaultData));
        });

        return unsubscribe;
      } catch (err) {
        console.warn(`Firestore setup failed on ${collectionName}:`, err);
      }
    }

    // 2. Fallback: localStorage
    const local = getLocal(collectionName, defaultData);
    if (!localStorage.getItem(`jprd_${collectionName}`)) {
      saveLocal(collectionName, defaultData);
    }
    callback(local);

    // Listen to local storage events across tabs if any
    const handleStorageChange = (e) => {
      if (e.key === `jprd_${collectionName}`) {
        callback(getLocal(collectionName, defaultData));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  },

  /**
   * Add or update an item
   */
  async saveItem(collectionName, item) {
    const id = item.id ? String(item.id) : String(Date.now());
    const dataWithId = { ...item, id };

    // Update locally immediately
    const current = getLocal(collectionName, []);
    const existingIndex = current.findIndex(i => String(i.id) === id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = dataWithId;
    } else {
      updated = [dataWithId, ...current];
    }
    saveLocal(collectionName, updated);

    // Sync with Cloud Firestore
    if (this.isCloudConnected()) {
      try {
        const docRef = doc(db, collectionName, id);
        await setDoc(docRef, dataWithId, { merge: true });
      } catch (err) {
        console.error(`Error saving item to Firestore in ${collectionName}:`, err);
      }
    }

    return updated;
  },

  /**
   * Delete an item
   */
  async deleteItem(collectionName, id) {
    const stringId = String(id);
    // Update locally immediately
    const current = getLocal(collectionName, []);
    const updated = current.filter(i => String(i.id) !== stringId);
    saveLocal(collectionName, updated);

    // Sync with Cloud Firestore
    if (this.isCloudConnected()) {
      try {
        const docRef = doc(db, collectionName, stringId);
        await deleteDoc(docRef);
      } catch (err) {
        console.error(`Error deleting item from Firestore in ${collectionName}:`, err);
      }
    }

    return updated;
  },

  /**
   * Clear an entire collection (both locally and on Firestore)
   */
  async clearCollection(collectionName) {
    saveLocal(collectionName, []);
    if (this.isCloudConnected()) {
      try {
        const colRef = collection(db, collectionName);
        const snapshot = await getDocs(colRef);
        const deletePromises = snapshot.docs.map(docSnap => deleteDoc(doc(db, collectionName, docSnap.id)));
        await Promise.all(deletePromises);
        console.log(`Cleared all cloud entries in ${collectionName}`);
      } catch (err) {
        console.error(`Error clearing collection ${collectionName}:`, err);
      }
    }
  },

  /**
   * Wipe all dummy audit logs and sample donations
   */
  async clearAllTestData() {
    await this.clearCollection('donations');
    await this.clearCollection('audit_logs');
    await this.clearCollection('expenses');
    await this.clearCollection('employees');
    await this.clearCollection('volunteers');
    await this.clearCollection('students');
  },

  /**
   * Log an administrative or financial action into the audit trail
   */
  async logActivity(action, category, details, userRole = 'superadmin') {
    const roleMap = {
      'superadmin': 'Super Administrator',
      'finance': 'Finance Manager',
      'staff': 'Field Coordinator'
    };

    const now = new Date();
    const logItem = {
      id: String(Date.now()),
      action, // e.g. 'CREATE', 'DELETE', 'PAYROLL', 'EXPORT'
      category, // e.g. 'Donations', 'Finance', 'Volunteers', 'Events', 'System'
      details,
      role: roleMap[userRole] || userRole,
      userRole,
      timestamp: now.toISOString(),
      dateStr: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      timeStr: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    return await this.saveItem('audit_logs', logItem);
  },

  /**
   * Batch seed data into Firestore on first connect
   */
  async seedInitialData(collectionName, dataArray) {
    if (!this.isCloudConnected() || !Array.isArray(dataArray)) return;
    try {
      for (const item of dataArray) {
        const id = item.id ? String(item.id) : String(Date.now());
        await setDoc(doc(db, collectionName, id), { ...item, id }, { merge: true });
      }
      console.log(`Successfully seeded ${dataArray.length} items to ${collectionName} in Firestore`);
    } catch (e) {
      console.error(`Failed to seed initial data for ${collectionName}:`, e);
    }
  }
};
