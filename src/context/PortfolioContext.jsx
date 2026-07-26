import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import defaultData from '../data/defaultPortfolio.json';

const PortfolioContext = createContext();

const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : '';

const cleanUrl = (url) => {
  if (typeof url === 'string' && url.includes('localhost:3001/uploads/')) {
    return url.replace(/^https?:\/\/localhost:3001/, '');
  }
  return url;
};

const sanitizePortfolioData = (inputData) => {
  if (!inputData) return inputData;
  const copy = JSON.parse(JSON.stringify(inputData));
  if (copy.personal?.avatar) copy.personal.avatar = cleanUrl(copy.personal.avatar);
  if (Array.isArray(copy.projects)) {
    copy.projects = copy.projects.map(p => ({
      ...p,
      image: cleanUrl(p.image)
    }));
  }
  if (Array.isArray(copy.certificates)) {
    copy.certificates = copy.certificates.map(c => ({
      ...c,
      image: cleanUrl(c.image)
    }));
  }
  return copy;
};

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(() => sanitizePortfolioData(defaultData));
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

  // Clean stale localStorage entries containing hardcoded localhost URLs
  useEffect(() => {
    try {
      const cached = localStorage.getItem('vercel_portfolio_custom_data_v3');
      if (cached && cached.includes('http://localhost:3001')) {
        localStorage.removeItem('vercel_portfolio_custom_data_v3');
      }
    } catch (e) {}
  }, []);

  // Load data from server on mount
  useEffect(() => {
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

    if (!isLocalhost) {
      // Di Vercel / production: tidak ada API server, langsung pakai data dari bundled JSON
      setServerOnline(false);
      isInitialLoad.current = false;
      return;
    }

    // Di localhost: ambil data dari Express API server
    fetch(`${API_BASE}/api/portfolio`)
      .then(res => res.json())
      .then(serverData => {
        // Hapus localStorage lama agar tidak menimpa data fresh dari server/file JSON
        try { localStorage.removeItem('vercel_portfolio_custom_data_v3'); } catch (e) {}
        setData(sanitizePortfolioData(serverData));
        setServerOnline(true);
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

  // Save data to server (or localStorage fallback on Vercel)
  const saveToServer = useCallback(async (newData) => {
    setIsSaving(true);
    try {
      if (serverOnline) {
        const res = await fetch(`${API_BASE}/api/portfolio`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newData)
        });
        if (res.ok) setLastSaved(new Date());
      }
      // Selalu simpan ke localStorage sebagai fallback di browser
      localStorage.setItem('vercel_portfolio_custom_data_v3', JSON.stringify(newData));
      setLastSaved(new Date());
    } catch (err) {
      console.error('Gagal menyimpan data:', err);
    } finally {
      setIsSaving(false);
    }
  }, [serverOnline]);

  // Auto-save when data changes by user (di localhost saja atau saat admin mengedit)

  // Auto-save when data changes by user
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
      localStorage.removeItem('vercel_portfolio_custom_data_v3');
    }
  };

  // Upload image file to server (with Base64 fallback for Vercel)
  const uploadImage = async (file) => {
    if (!file) return null;

    // Jika API server terhubung, coba upload ke backend
    if (serverOnline) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            return result.url;
          }
        }
      } catch (err) {
        console.warn('Backend upload failed, falling back to base64 reader:', err);
      }
    }

    // Fallback Vercel / Offline: Konversi gambar menjadi Data URL (Base64)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Delete uploaded image from server
  const deleteImage = async (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('/uploads/')) return;
    const filename = imageUrl.split('/uploads/').pop();
    try {
      if (serverOnline) {
        await fetch(`${API_BASE}/api/upload/${filename}`, { method: 'DELETE' });
      }
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
