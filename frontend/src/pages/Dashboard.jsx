import React, { useMemo } from 'react';
import { Package, TrendingUp, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQueries } from '@tanstack/react-query';
import api from '../api';
import styles from './Dashboard.module.css';

const fetchMetrics = async () => (await api.get('sales-count/')).data;
const fetchTopItems = async () => (await api.get('top-items/')).data;

const Dashboard = () => {
  const [metricsQuery, topItemsQuery] = useQueries({
    queries: [
      { queryKey: ['metrics'], queryFn: fetchMetrics },
      { queryKey: ['topItems'], queryFn: fetchTopItems }
    ]
  });

  const isLoading = metricsQuery.isLoading || topItemsQuery.isLoading;

  const topItemsFormatted = useMemo(() => {
    if (!topItemsQuery.data) return [];
    return topItemsQuery.data.map(item => ({
      name: item.item__item_name.substring(0, 15) + (item.item__item_name.length > 15 ? '...' : ''),
      sales: item.total_sales
    }));
  }, [topItemsQuery.data]);

  if (isLoading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }
  
  const metrics = metricsQuery.data || { items_count: 0, sales_count: 0, purchases_count: 0 };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard Overview</h1>
        <p className={styles.subtitle}>Welcome back! Here's what's happening with your inventory today.</p>
      </div>

      <div className={styles.metricsGrid}>
        <div className={`glass-panel ${styles.metricCard}`}>
          <div className={`${styles.iconWrapper} ${styles.blueIcon}`}>
            <Package size={28} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricValue}>{metrics.items_count}</span>
            <span className={styles.metricLabel}>Total Items</span>
          </div>
        </div>
        
        <div className={`glass-panel ${styles.metricCard}`}>
          <div className={`${styles.iconWrapper} ${styles.greenIcon}`}>
            <TrendingUp size={28} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricValue}>{metrics.sales_count}</span>
            <span className={styles.metricLabel}>Total Sales</span>
          </div>
        </div>

        <div className={`glass-panel ${styles.metricCard}`}>
          <div className={`${styles.iconWrapper} ${styles.purpleIcon}`}>
            <ShoppingCart size={28} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricValue}>{metrics.purchases_count}</span>
            <span className={styles.metricLabel}>Total Purchases</span>
          </div>
        </div>
      </div>

      <div className={styles.chartsContainer}>
        <div className={`glass-panel ${styles.chartCard}`}>
          <h2 className={styles.chartTitle}>Top 10 Selling Items (By Value)</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={topItemsFormatted} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                tick={{fill: '#94a3b8', fontSize: 12}}
                angle={-45}
                textAnchor="end"
              />
              <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}}
              />
              <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
