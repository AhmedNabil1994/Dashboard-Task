import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import styles from './ProfitReport.module.css';

const fetchProfitReport = async (page) => (await api.get(`profit-report/?page=${page}`)).data;

const ProfitReport = () => {
  const [page, setPage] = React.useState(1);
  const { data: response, isLoading, isFetching, isError } = useQuery({
    queryKey: ['profitReport', page],
    queryFn: () => fetchProfitReport(page)
  });

  const report = response?.results || [];
  const totalPages = response?.total_pages || 1;

  if (isLoading) {
    return <div className={styles.loading}>Loading report...</div>;
  }
  
  if (isError) {
    return <div className={styles.loading}>Error loading profit report.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profit Report</h1>
        <p className={styles.subtitle}>View profitability analysis by item.</p>
      </div>

      <div className={`glass-panel ${styles.tableContainer}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Total Sales</th>
              <th>Total Purchases</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {report.map((item, idx) => (
              <tr key={idx}>
                <td>{item.item_code}</td>
                <td>{item.item_name}</td>
                <td>${item.total_sales.toFixed(2)}</td>
                <td>${item.total_purchases.toFixed(2)}</td>
                <td className={item.profit >= 0 ? styles.positiveProfit : styles.negativeProfit}>
                  ${item.profit.toFixed(2)}
                </td>
              </tr>
            ))}
            {report.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>No data available</td>
              </tr>
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className={styles.pagination} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', paddingBottom: '20px' }}>
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
              className={styles.pageBtn}
              style={{ padding: '8px 16px', background: 'var(--card-bg-hover)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: (page === 1 || isFetching) ? 'not-allowed' : 'pointer', opacity: (page === 1 || isFetching) ? 0.5 : 1 }}
            >
              Previous
            </button>
            <span className={styles.pageInfo} style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isFetching}
              className={styles.pageBtn}
              style={{ padding: '8px 16px', background: 'var(--card-bg-hover)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: (page === totalPages || isFetching) ? 'not-allowed' : 'pointer', opacity: (page === totalPages || isFetching) ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitReport;
