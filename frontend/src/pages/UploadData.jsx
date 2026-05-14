import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import api from '../api';
import styles from './UploadData.module.css';

const UploadData = () => {
  const [salesFile, setSalesFile] = useState(null);
  const [purchasesFile, setPurchasesFile] = useState(null);
  
  const [salesStatus, setSalesStatus] = useState({ loading: false, message: '', type: '' });
  const [purchasesStatus, setPurchasesStatus] = useState({ loading: false, message: '', type: '' });

  const salesInputRef = useRef(null);
  const purchasesInputRef = useRef(null);

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'sales') setSalesFile(file);
      else setPurchasesFile(file);
    }
  };

  const handleUpload = async (type) => {
    const file = type === 'sales' ? salesFile : purchasesFile;
    const setStatus = type === 'sales' ? setSalesStatus : setPurchasesStatus;
    const endpoint = type === 'sales' ? 'upload-page/' : 'upload-purchases/';

    if (!file) return;

    setStatus({ loading: true, message: '', type: '' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setStatus({ 
        loading: false, 
        message: `${response.data.message} (${response.data.saved_rows} rows saved)`, 
        type: 'success' 
      });
      
      // Reset file
      if (type === 'sales') setSalesFile(null);
      else setPurchasesFile(null);
      
    } catch (error) {
      setStatus({ 
        loading: false, 
        message: error.response?.data?.error || 'An error occurred during upload', 
        type: 'error' 
      });
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Data Upload</h1>
        <p className={styles.subtitle}>Upload your sales and purchases records (CSV or Excel).</p>
      </div>

      <div className={styles.formsGrid}>
        {/* Sales Upload Card */}
        <div className={`glass-panel ${styles.uploadCard}`}>
          <h2 className={`${styles.cardTitle} ${styles.blueText}`}>
            <FileText size={24} /> Upload Sales Data
          </h2>
          
          <div 
            className={`${styles.dropzone} ${salesFile ? styles.active : ''}`}
            onClick={() => salesInputRef.current.click()}
          >
            <Upload size={40} className={styles.uploadIcon} />
            <p>Click to browse or drag and drop your file here</p>
            <p className={styles.subtitle}>Supports .csv, .xlsx, .xls</p>
            {salesFile && <span className={styles.selectedFile}>{salesFile.name}</span>}
          </div>
          
          <input 
            type="file" 
            ref={salesInputRef}
            onChange={(e) => handleFileSelect(e, 'sales')}
            accept=".csv, .xlsx, .xls"
            className={styles.fileInput}
          />

          <button 
            className={styles.submitBtn} 
            onClick={() => handleUpload('sales')}
            disabled={!salesFile || salesStatus.loading}
          >
            {salesStatus.loading ? <Loader className="animate-spin" size={20} /> : 'Upload Sales File'}
          </button>

          {salesStatus.message && (
            <div className={`${styles.statusMessage} ${salesStatus.type === 'success' ? styles.statusSuccess : styles.statusError}`}>
              {salesStatus.type === 'success' ? <CheckCircle size={16} className="inline mr-2" /> : <AlertCircle size={16} className="inline mr-2" />}
              {salesStatus.message}
            </div>
          )}
        </div>

        {/* Purchases Upload Card */}
        <div className={`glass-panel ${styles.uploadCard}`}>
          <h2 className={`${styles.cardTitle} ${styles.greenText}`}>
            <FileText size={24} /> Upload Purchases Data
          </h2>
          
          <div 
            className={`${styles.dropzone} ${purchasesFile ? styles.active : ''}`}
            onClick={() => purchasesInputRef.current.click()}
          >
            <Upload size={40} className={styles.uploadIcon} />
            <p>Click to browse or drag and drop your file here</p>
            <p className={styles.subtitle}>Supports .xlsx, .xls</p>
            {purchasesFile && <span className={styles.selectedFile}>{purchasesFile.name}</span>}
          </div>
          
          <input 
            type="file" 
            ref={purchasesInputRef}
            onChange={(e) => handleFileSelect(e, 'purchases')}
            accept=".xlsx, .xls"
            className={styles.fileInput}
          />

          <button 
            className={styles.submitBtn} 
            onClick={() => handleUpload('purchases')}
            disabled={!purchasesFile || purchasesStatus.loading}
            style={purchasesFile ? { background: 'var(--success-color)' } : {}}
          >
            {purchasesStatus.loading ? <Loader className="animate-spin" size={20} /> : 'Upload Purchases File'}
          </button>

          {purchasesStatus.message && (
            <div className={`${styles.statusMessage} ${purchasesStatus.type === 'success' ? styles.statusSuccess : styles.statusError}`}>
              {purchasesStatus.type === 'success' ? <CheckCircle size={16} className="inline mr-2" /> : <AlertCircle size={16} className="inline mr-2" />}
              {purchasesStatus.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadData;
