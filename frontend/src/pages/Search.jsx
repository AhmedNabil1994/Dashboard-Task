import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, Loader } from 'lucide-react';
import api from '../api';
import styles from './Search.module.css';

const fetchSearch = async (query, page) => (await api.get(`search/?q=${encodeURIComponent(query)}&page=${page}`)).data;

const Search = () => {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: response, isFetching, isError } = useQuery({
    queryKey: ['search', activeQuery, page],
    queryFn: () => fetchSearch(activeQuery, page),
    enabled: !!activeQuery.trim(),
  });

  const results = response?.results;
  const totalPages = response?.total_pages || 1;

  const handleSearch = useCallback((e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setActiveQuery(query);
    setPage(1);
  }, [query]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Search Items</h1>
        <p className={styles.subtitle}>Find items by name in the inventory database.</p>
      </div>

      <form className={`glass-panel ${styles.searchBox}`} onSubmit={handleSearch}>
        <div className={styles.searchInputWrapper}>
          <SearchIcon className={styles.searchIcon} size={20} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by item name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          className={styles.searchBtn}
          disabled={isFetching || !query.trim()}
        >
          {isFetching ? <Loader className="animate-spin" size={20} /> : 'Search'}
        </button>
      </form>

      {isError && <div className={styles.error}>Failed to search items</div>}

      {!!activeQuery && !isFetching && !isError && results && (
        <div className={`glass-panel ${styles.tableContainer}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Barcode</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.item_code}</td>
                  <td>{item.item_name}</td>
                  <td>{item.barcode || 'N/A'}</td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '24px' }}>No items found matching "{query}"</td>
                </tr>
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className={styles.pageBtn}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isFetching}
                className={styles.pageBtn}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
