import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, UploadCloud, TrendingUp, AlertTriangle, Search } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, closeMenu }) => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/upload', label: 'Upload Data', icon: <UploadCloud size={20} /> },
    { path: '/profit', label: 'Profit Report', icon: <TrendingUp size={20} /> },
    { path: '/deadstock', label: 'Deadstock', icon: <AlertTriangle size={20} /> },
    { path: '/search', label: 'Search Items', icon: <Search size={20} /> },
  ];

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <TrendingUp size={28} />
            Inventory
          </div>
          <button className={styles.closeBtn} onClick={closeMenu}>
            <X size={24} />
          </button>
        </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
            onClick={closeMenu}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;
