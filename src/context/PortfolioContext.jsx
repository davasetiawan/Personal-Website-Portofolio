import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultData from '../data/defaultPortfolio.json';

const PortfolioContext = createContext();

const STORAGE_KEY = 'vercel_portfolio_custom_data_v2';

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved portfolio data:', e);
    }
    return defaultData;
  });

  // Secret admin mode detector: Enabled only if URL has ?admin=true or secret shortcut Ctrl+Shift+E
  const [isAdmin, setIsAdmin] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('admin') === 'true';
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Secret keyboard shortcut to toggle admin mode for owner
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        setIsAdmin(prev => {
          const nextState = !prev;
          alert(nextState ? 'Mode Admin/Editor diaktifkan!' : 'Mode Admin/Editor dinonaktifkan (Pengunjung hanya lihat).');
          return nextState;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving portfolio data:', e);
    }
  }, [data]);

  const updateField = (pathArray, value) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      let current = next;
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      current[pathArray[pathArray.length - 1]] = value;
      return next;
    });
  };

  const updateFullData = (newData) => {
    setData(newData);
  };

  const resetToDefaults = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan semua data ke setelan awal default?')) {
      setData(defaultData);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "portfolio-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importJSON = (jsonContent) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed && parsed.personal && parsed.projects) {
        setData(parsed);
        alert('Data portofolio berhasil di-import!');
        return true;
      } else {
        alert('Format JSON tidak valid.');
        return false;
      }
    } catch (e) {
      alert('Gagal membaca file JSON: ' + e.message);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider value={{
      data,
      updateField,
      updateFullData,
      resetToDefaults,
      exportJSON,
      importJSON,
      isAdmin,
      setIsAdmin,
      isDrawerOpen,
      setIsDrawerOpen
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
