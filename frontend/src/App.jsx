import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu, TrendingUp } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import styles from './App.module.css';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const UploadData = React.lazy(() => import('./pages/UploadData'));
const ProfitReport = React.lazy(() => import('./pages/ProfitReport'));
const Deadstock = React.lazy(() => import('./pages/Deadstock'));
const Search = React.lazy(() => import('./pages/Search'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={styles.app}>
        <Sidebar isOpen={isMobileMenuOpen} closeMenu={() => setIsMobileMenuOpen(false)} />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
          <header className={styles.mobileHeader}>
            <div className={styles.mobileLogo}>
              <TrendingUp size={24} />
              Inventory
            </div>
            <button className={styles.mobileMenuBtn} onClick={toggleMobileMenu}>
              <Menu size={28} />
            </button>
          </header>

            <main className={styles.mainContent}>
            <div className={styles.pageContainer}>
              <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Page...</div>}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/upload" element={<UploadData />} />
                  <Route path="/profit" element={<ProfitReport />} />
                  <Route path="/deadstock" element={<Deadstock />} />
                  <Route path="/search" element={<Search />} />
                </Routes>
              </Suspense>
            </div>
          </main>
        </div>
      </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
