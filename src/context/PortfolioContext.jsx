import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import defaultData from '../data/defaultPortfolio.json';

const PortfolioContext = createContext();

const API_BASE = 'http://localhost:3001';

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(defaultData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [serverOnline, setServerOnline] = useState(false);

  // Secret admin mode
  const [isAdmin, setIsAdmin] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('admin') === 'true';
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isInitialLoad = React.useRef(true);

  // Load data from server on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/portfolio`)
      .then(res => res.json())
      .then(serverData => {
        setData(serverData);
        setServerOnline(true);
        // Tandai bahwa initial load selesai setelah state ter-apply
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 100);
      })
      .catch(() => {
        console.warn('API server tidak aktif, menggunakan data default.');
        setServerOnline(false);
        isInitialLoad.current = false;
      });
  }, []);

  // Secret keyboard shortcut to toggle admin mode
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

  // Save data to server (with debounce)
  const saveToServer = useCallback(async (newData) => {
    if (!serverOnline) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/portfolio`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (res.ok) {
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Gagal menyimpan ke server:', err);
    } finally {
      setIsSaving(false);
    }
  }, [serverOnline]);

  // Auto-save when data changes by user (bukan saat initial load)
  useEffect(() => {
    if (isInitialLoad.current) return;

    const timer = setTimeout(() => {
      saveToServer(data);
    }, 500); // debounce 500ms
    return () => clearTimeout(timer);
  }, [data, saveToServer]);

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
    }
  };

  // Upload image file to server
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        return `${API_BASE}${result.url}`;
      } else {
        alert('Upload gagal: ' + (result.error || 'Unknown error'));
        return null;
      }
    } catch (err) {
      alert('Gagal upload ke server. Pastikan server berjalan (npm run server).');
      return null;
    }
  };

  // Delete uploaded image from server
  const deleteImage = async (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('/uploads/')) return;
    const filename = imageUrl.split('/uploads/').pop();
    try {
      await fetch(`${API_BASE}/api/upload/${filename}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Gagal menghapus file:', err);
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
      uploadImage,
      deleteImage,
      isAdmin,
      setIsAdmin,
      isDrawerOpen,
      setIsDrawerOpen,
      isSaving,
      lastSaved,
      serverOnline
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
