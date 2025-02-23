import React, { useState, useEffect } from 'react';
import { makeAuthenticatedRequest } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';
import styles from './Dashboard.module.css';
import ThemeSelector from './ThemeSelector';
import AuthTest from './AuthTest';

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [menuItem, setMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  // Apply theme colors to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    document.documentElement.style.setProperty('--background-color', theme.background);
    document.documentElement.style.setProperty('--text-color', theme.text);
  }, [theme]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.clear(); // Clear all stored data
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await makeAuthenticatedRequest(
        'http://localhost:8080/api/menu/items',
        {
          method: 'POST',
          body: JSON.stringify(menuItem)
        }
      );

      if (response.ok) {
        // Handle success
        alert('Menu item added successfully!');
      } else {
        // Handle error
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to add menu item:', error);
    }
  };

  return (
    <div className={styles.dashboard} style={{ backgroundColor: theme.background }}>
      <div className={styles.dashboardHeader}>
        <h1 style={{ color: theme.text }}>Restaurant Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
      <ThemeSelector />
      <AuthTest />
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Item name"
          value={menuItem.name}
          onChange={(e) => setMenuItem({...menuItem, name: e.target.value})}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Description"
          value={menuItem.description}
          onChange={(e) => setMenuItem({...menuItem, description: e.target.value})}
        />
        <input
          className={styles.input}
          type="number"
          placeholder="Price"
          value={menuItem.price}
          onChange={(e) => setMenuItem({...menuItem, price: e.target.value})}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Category"
          value={menuItem.category}
          onChange={(e) => setMenuItem({...menuItem, category: e.target.value})}
        />
        <button type="submit" className={styles.button}>
          Add Menu Item
        </button>
      </form>
    </div>
  );
};

export default Dashboard;