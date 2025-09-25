import { useEffect, useState } from 'react';
import styles from '../pages/css/Profile.module.css';
import { useAuth } from '../context/authContext.jsx';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setUsername(user.name);
      setEmail(user.email);
    }
  }, [user]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Profile</h1>
      <div className={styles.card}>
        <form className={styles.form}>
          <div className={styles.row}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} value={email} disabled />
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Username</label>
            <input className={styles.input} value={username} disabled />
          </div>
        </form>
      </div>
    </div>
  );
}
