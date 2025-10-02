import { useEffect, useState } from 'react';
import styles from '../pages/css/Profile.module.css';
import { useAuth } from '../context/authContext.jsx';
import api from '../api/client.js';

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [prefix, setPrefix] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [zipcode, setZipcode] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function saveFetchedUser(userData) {
    if (!userData) return;
    setEmail(userData.email || '');
    setFirstName(userData.firstName || '');
    setLastName(userData.lastName || '');
    setPrefix(userData.prefix || '');
    setJobTitle(userData.jobTitle || '');
    setPhoneNumber(userData.phoneNumber || '');
    const addr = userData.address || {};
    setLine1(addr.line1 || '');
    setLine2(addr.line2 || '');
    setCity(addr.city || '');
    setCountry(addr.country || '');
    setZipcode(addr.zipcode || '');
  }

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/api/profile/');
        const fetched = data?.user || data;
        if (!active) return;
        saveFetchedUser(fetched);
      } catch (e) {
        console.error(e);
        applyToState(user);
        setError('Failed to load profile.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        prefix: prefix || undefined,
        jobTitle: jobTitle || undefined,
        phoneNumber: phoneNumber || undefined,
        address: {
          line1: line1 || undefined,
          line2: line2 || undefined,
          city: city || undefined,
          country: country || undefined,
          zipcode: zipcode || undefined,
        },
      };

      const { data } = await api.patch('/api/profile/', payload);
      const updated = data?.user || data || payload;
      updateUser(updated);
      setSuccess('Profile updated successfully.');
    } catch (e) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Profile</h1>
      <div className={styles.card}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        <form className={styles.form} onSubmit={onSubmit}>
          {loading && <div>Loading…</div>}
          <div className={styles.row}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} value={email} disabled />
          </div>

          <div className={styles.row}>
            <label className={styles.label}>First Name</label>
            <input className={styles.input} value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={loading} />
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Last Name</label>
            <input className={styles.input} value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} />
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Prefix</label>
            <input className={styles.input} value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="Mr, Ms, Dr, etc." disabled={loading} />
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Job Title</label>
            <input className={styles.input} value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} disabled={loading} />
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Phone Number</label>
            <input className={styles.input} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={loading} />
          </div>

          <hr />
          <div className={styles.label}>Address</div>
          <div className={styles.row}>
            <label className={styles.label}>Address Line 1</label>
            <input className={styles.input} value={line1} onChange={(e) => setLine1(e.target.value)} disabled={loading} />
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Address Line 2</label>
            <input className={styles.input} value={line2} onChange={(e) => setLine2(e.target.value)} disabled={loading} />
          </div>
          <div className={styles.row}>
            <label className={styles.label}>City</label>
            <input className={styles.input} value={city} onChange={(e) => setCity(e.target.value)} disabled={loading} />
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Country</label>
            <input className={styles.input} value={country} onChange={(e) => setCountry(e.target.value)} disabled={loading} />
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Zip Code</label>
            <input className={styles.input} value={zipcode} onChange={(e) => setZipcode(e.target.value)} disabled={loading} />
          </div>

          <div>
            <button className={styles.btn} disabled={saving || loading}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
