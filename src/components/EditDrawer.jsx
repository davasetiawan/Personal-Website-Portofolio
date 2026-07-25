import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  X, Save, RotateCcw, Download, Upload, Plus, Trash2, Code, User, UserCheck,
  Folder, Award, Share2, Cpu, Image as ImageIcon, MapPin, MessageSquare, Eye, EyeOff
} from 'lucide-react';

/* ============================================================
   SMALL HELPER: section header
   ============================================================ */
const SectionHeader = ({ title, count, onAdd, addLabel }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h3 style={{ fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
      {title}{count !== undefined ? ` (${count})` : ''}
    </h3>
    {onAdd && (
      <button onClick={onAdd} className="glass-pill-container"
        style={{ padding: '6px 14px', fontSize: '12px', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Plus size={13} /> {addLabel}
      </button>
    )}
  </div>
);

/* ============================================================
   MAIN EDIT DRAWER
   ============================================================ */
export const EditDrawer = () => {
  const {
    data, updateField, updateFullData, resetToDefaults,
    exportJSON, importJSON, uploadImage, deleteImage,
    isDrawerOpen, setIsDrawerOpen,
    isSaving, lastSaved, serverOnline
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState('personal');
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  if (!isDrawerOpen) return null;

  /* ---- Tab switch ---- */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'json') {
      setJsonText(JSON.stringify(data, null, 2));
      setJsonError('');
    }
  };

  /* ---- JSON save ---- */
  const handleJsonSave = () => {
    try {
      updateFullData(JSON.parse(jsonText));
      setJsonError('');
      alert('Konfigurasi JSON berhasil disimpan!');
    } catch (err) {
      setJsonError('Error Syntax JSON: ' + err.message);
    }
  };

  /* ---- Import JSON file ---- */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importJSON(ev.target.result);
      if (ok) setJsonText(ev.target.result);
    };
    reader.readAsText(file);
  };

  /* ---- Avatar upload (ke server) ---- */
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      // Hapus foto lama jika ada
      if (data.personal?.avatar) await deleteImage(data.personal.avatar);
      updateField(['personal', 'avatar'], url);
    }
  };

  /* ---- Delete avatar ---- */
  const handleDeleteAvatar = async () => {
    if (!window.confirm('Hapus foto profil?')) return;
    if (data.personal?.avatar) await deleteImage(data.personal.avatar);
    updateField(['personal', 'avatar'], '');
  };

  /* ---- About Me helpers ---- */
  const updateAboutField = (key, value) => {
    const aboutData = { ...data.about, [key]: value };
    updateField(['about'], aboutData);
  };

  const handleUpdateStat = (idx, key, value) => {
    const stats = [...(data.about?.stats || [])];
    stats[idx] = { ...stats[idx], [key]: value };
    updateAboutField('stats', stats);
  };

  const handleAddStat = () => {
    const stats = [...(data.about?.stats || [])];
    stats.push({ value: '0+', label: 'Stat Label' });
    updateAboutField('stats', stats);
  };

  const handleDeleteStat = (idx) => {
    const stats = [...(data.about?.stats || [])];
    stats.splice(idx, 1);
    updateAboutField('stats', stats);
  };

  /* ---- Project helpers ---- */
  const updateProject = (idx, key, value) => {
    const arr = [...data.projects];
    arr[idx] = { ...arr[idx], [key]: value };
    updateField(['projects'], arr);
  };

  const handleAddProject = () => {
    const newP = {
      id: 'proj-' + Date.now(),
      title: 'Proyek Baru',
      description: 'Deskripsi singkat proyek.',
      category: 'Web App',
      tags: ['React.js', 'Tailwind CSS'],
      image: '',
      demoUrl: '',
      githubUrl: ''
    };
    updateField(['projects'], [newP, ...(data.projects || [])]);
  };

  const handleDeleteProject = (idx) => {
    if (!window.confirm('Hapus proyek ini?')) return;
    const arr = [...data.projects];
    arr.splice(idx, 1);
    updateField(['projects'], arr);
  };

  const handleProjectImageUpload = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      // Hapus gambar lama jika ada
      const oldImage = data.projects[idx]?.image;
      if (oldImage) await deleteImage(oldImage);
      updateProject(idx, 'image', url);
    }
  };

  const handleDeleteProjectImage = async (idx) => {
    const oldImage = data.projects[idx]?.image;
    if (oldImage) await deleteImage(oldImage);
    updateProject(idx, 'image', '');
  };

  /* ---- Certificate helpers ---- */
  const updateCert = (idx, key, value) => {
    const arr = [...data.certificates];
    arr[idx] = { ...arr[idx], [key]: value };
    updateField(['certificates'], arr);
  };

  const handleAddCertificate = () => {
    const newC = {
      id: 'cert-' + Date.now(),
      title: 'Sertifikasi Baru',
      issuer: 'Penyelenggara',
      date: '2024',
      credentialId: '',
      link: '',
      image: ''
    };
    updateField(['certificates'], [newC, ...(data.certificates || [])]);
  };

  const handleDeleteCertificate = (idx) => {
    if (!window.confirm('Hapus sertifikat ini?')) return;
    const arr = [...data.certificates];
    arr.splice(idx, 1);
    updateField(['certificates'], arr);
  };

  const handleCertImageUpload = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      const oldImage = data.certificates[idx]?.image;
      if (oldImage) await deleteImage(oldImage);
      updateCert(idx, 'image', url);
    }
  };

  const handleDeleteCertImage = async (idx) => {
    const oldImage = data.certificates[idx]?.image;
    if (oldImage) await deleteImage(oldImage);
    updateCert(idx, 'image', '');
  };

  /* ---- Social helpers ---- */
  const updateSocial = (idx, key, value) => {
    const arr = [...data.socials];
    arr[idx] = { ...arr[idx], [key]: value };
    updateField(['socials'], arr);
  };

  const handleAddSocial = () => {
    updateField(['socials'], [...(data.socials || []), {
      name: 'Platform Baru', handle: '@username', url: 'https://example.com', icon: 'globe'
    }]);
  };

  const handleDeleteSocial = (idx) => {
    if (!window.confirm('Hapus link sosial media ini?')) return;
    const arr = [...data.socials];
    arr.splice(idx, 1);
    updateField(['socials'], arr);
  };

  /* ---- Tech Stack helpers ---- */
  const updateSkillName = (gIdx, sIdx, value) => {
    const groups = JSON.parse(JSON.stringify(data.techStack));
    groups[gIdx].skills[sIdx].name = value;
    updateField(['techStack'], groups);
  };

  const handleAddGroup = () => {
    const groups = [...(data.techStack || [])];
    groups.push({ category: 'Kategori Baru', skills: [] });
    updateField(['techStack'], groups);
  };

  const handleDeleteGroup = (gIdx) => {
    if (!window.confirm('Hapus kategori ini beserta semua skill di dalamnya?')) return;
    const groups = [...data.techStack];
    groups.splice(gIdx, 1);
    updateField(['techStack'], groups);
  };

  const handleAddSkill = (gIdx) => {
    const groups = JSON.parse(JSON.stringify(data.techStack));
    groups[gIdx].skills.push({ name: 'Skill Baru' });
    updateField(['techStack'], groups);
  };

  const handleDeleteSkill = (gIdx, sIdx) => {
    const groups = JSON.parse(JSON.stringify(data.techStack));
    groups[gIdx].skills.splice(sIdx, 1);
    updateField(['techStack'], groups);
  };

  const updateGroupName = (gIdx, value) => {
    const groups = JSON.parse(JSON.stringify(data.techStack));
    groups[gIdx].category = value;
    updateField(['techStack'], groups);
  };

  /* ---- Comment Moderation helpers ---- */
  const handleToggleHideComment = (idx) => {
    const arr = [...(data.comments || [])];
    arr[idx] = { ...arr[idx], hidden: !arr[idx].hidden };
    updateField(['comments'], arr);
  };

  const handleDeleteComment = (idx) => {
    if (!window.confirm('Hapus komentar ini secara permanen?')) return;
    const arr = [...(data.comments || [])];
    arr.splice(idx, 1);
    updateField(['comments'], arr);
  };

  const handleClearAllComments = () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus SEMUA komentar?')) return;
    updateField(['comments'], []);
  };

  /* ---- Drawer Tab Button ---- */
  const tabBtn = (id, icon, label) => (
    <button
      key={id}
      onClick={() => handleTabChange(id)}
      style={{
        padding: '12px 14px',
        border: 'none',
        background: activeTab === id ? '#0F0F0F' : 'transparent',
        borderBottom: activeTab === id ? '2px solid #FFFFFF' : '2px solid transparent',
        fontWeight: activeTab === id ? 600 : 400,
        fontSize: '12px',
        color: '#FFFFFF',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        whiteSpace: 'nowrap'
      }}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0F0F0F'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>Live Editor Portofolio</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ubah profil, tentang saya, proyek, sertifikat, skill & komentar</p>
          </div>
          <button onClick={() => setIsDrawerOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          backgroundColor: '#141414',
          overflowX: 'auto'
        }}>
          {tabBtn('personal', <User size={13} />, 'Profil')}
          {tabBtn('about', <UserCheck size={13} />, 'Tentang Saya')}
          {tabBtn('projects', <Folder size={13} />, `Proyek (${data.projects?.length || 0})`)}
          {tabBtn('certificates', <Award size={13} />, `Sertifikat (${data.certificates?.length || 0})`)}
          {tabBtn('techStack', <Cpu size={13} />, 'Tech Stack')}
          {tabBtn('comments', <MessageSquare size={13} />, `Komentar (${data.comments?.length || 0})`)}
          {tabBtn('socials', <Share2 size={13} />, 'Sosial')}
          {tabBtn('json', <Code size={13} />, 'JSON')}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* =============== TAB: PERSONAL =============== */}
          {activeTab === 'personal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SectionHeader title="Foto Profil & Data Diri" />

              {/* Avatar Upload */}
              <div style={{
                padding: '16px',
                borderRadius: '16px',
                border: '1px dashed rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <img
                  src={data.personal?.avatar || '/profile.png'}
                  alt="Avatar"
                  style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)' }}
                  onError={(e) => { e.target.src = '/profile.png'; }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: '#FFFFFF' }}>Foto Profil</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <label className="glass-pill-container" style={{
                      padding: '6px 14px', fontSize: '12px', color: '#FFF', cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: '6px'
                    }}>
                      <Upload size={13} /> Upload Foto
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} hidden />
                    </label>
                    {data.personal?.avatar && (
                      <button onClick={handleDeleteAvatar}
                        style={{
                          padding: '6px 12px', fontSize: '12px', color: '#EF4444', cursor: 'pointer',
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px'
                        }}>
                        <Trash2 size={12} /> Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {[
                ['Nama Lengkap', 'name', 'text'],
                ['Judul Baris 1 (misal: Frontend)', 'titleLine1', 'text'],
                ['Judul Baris 2 (misal: Developer)', 'titleLine2', 'text'],
                ['Status Badge', 'statusBadge', 'text'],
                ['Email', 'email', 'email'],
              ].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>{label}</label>
                  <input
                    type={type}
                    className="glass-input"
                    value={data.personal?.[key] || ''}
                    onChange={(e) => updateField(['personal', key], e.target.value)}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Bio / Deskripsi Hero</label>
                <textarea rows={3} className="glass-input" style={{ resize: 'none' }}
                  value={data.personal?.bio || ''}
                  onChange={(e) => updateField(['personal', 'bio'], e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Core Stack Badges (pisahkan koma)</label>
                <input type="text" className="glass-input"
                  value={data.personal?.coreStack?.join(', ') || ''}
                  onChange={(e) => updateField(['personal', 'coreStack'], e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>

              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <SectionHeader title="Sosial Media" count={data.socials?.length} onAdd={() => updateField(['socials'], [...(data.socials || []), { name: 'New Link', handle: '@handle', url: '', icon: 'globe' }])} addLabel="Tambah" />
                {data.socials?.map((soc, sIdx) => (
                  <div key={sIdx} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                      <input type="text" className="glass-input" placeholder="Nama (Github)" value={soc.name || ''} onChange={e => { const arr = [...data.socials]; arr[sIdx].name = e.target.value; updateField(['socials'], arr); }} style={{ flex: 1, fontSize: '11px' }} />
                      <input type="text" className="glass-input" placeholder="Handle (@user)" value={soc.handle || ''} onChange={e => { const arr = [...data.socials]; arr[sIdx].handle = e.target.value; updateField(['socials'], arr); }} style={{ flex: 1, fontSize: '11px' }} />
                      <button onClick={() => { const arr = [...data.socials]; arr.splice(sIdx, 1); updateField(['socials'], arr); }} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={14}/></button>
                    </div>
                    <input type="text" className="glass-input" placeholder="URL Link Profil..." value={soc.url || ''} onChange={e => { const arr = [...data.socials]; arr[sIdx].url = e.target.value; updateField(['socials'], arr); }} style={{ fontSize: '11px' }} />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#10B981', fontWeight: 600 }}>Web3Forms Access Key (Kontak Email)</label>
                <input type="text" className="glass-input" placeholder="Paste Access Key dari web3forms..." value={data.web3formsKey || ''} onChange={(e) => updateField(['web3formsKey'], e.target.value)} />
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>Jika ini diisi, form Hubungi Saya akan diam-diam mengirim pesan langsung ke email Anda tanpa membuka aplikasi WhatsApp klien.</p>
              </div>
            </div>
          )}

          {/* =============== TAB: TENTANG SAYA (ABOUT ME) =============== */}
          {activeTab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SectionHeader title="Kelola Seksi Tentang Saya" />

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Judul Seksi</label>
                <input type="text" className="glass-input"
                  value={data.about?.sectionTitle || 'Tentang Saya'}
                  onChange={(e) => updateAboutField('sectionTitle', e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Lokasi Domisili</label>
                <input type="text" className="glass-input" placeholder="e.g. Indonesia"
                  value={data.about?.location || ''}
                  onChange={(e) => updateAboutField('location', e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Paragraf Utama (Pengenalan)</label>
                <textarea rows={4} className="glass-input" style={{ resize: 'vertical' }}
                  value={data.about?.description || ''}
                  onChange={(e) => updateAboutField('description', e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Paragraf Lanjutan (Pengalaman & Keahlian)</label>
                <textarea rows={4} className="glass-input" style={{ resize: 'vertical' }}
                  value={data.about?.longBio || ''}
                  onChange={(e) => updateAboutField('longBio', e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Minat & Hobi / Interests (pisahkan koma)</label>
                <input type="text" className="glass-input" placeholder="Web Development, UI/UX Design, Open Source"
                  value={data.about?.interests?.join(', ') || ''}
                  onChange={(e) => updateAboutField('interests', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>

              {/* Stats Editor */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <SectionHeader title="Statistik Pengalaman" count={data.about?.stats?.length || 0}
                  onAdd={handleAddStat} addLabel="Tambah Stat" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                  {(data.about?.stats || []).map((stat, stIdx) => (
                    <div key={stIdx} style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr auto',
                      gap: '8px',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      padding: '10px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      <input type="text" className="glass-input" placeholder="Nilai (e.g. 10+)"
                        value={stat.value || ''}
                        onChange={(e) => handleUpdateStat(stIdx, 'value', e.target.value)}
                        style={{ fontSize: '12px' }}
                      />
                      <input type="text" className="glass-input" placeholder="Keterangan (e.g. Proyek Selesai)"
                        value={stat.label || ''}
                        onChange={(e) => handleUpdateStat(stIdx, 'label', e.target.value)}
                        style={{ fontSize: '12px' }}
                      />
                      <button onClick={() => handleDeleteStat(stIdx)}
                        style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =============== TAB: PROJECTS =============== */}
          {activeTab === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SectionHeader title="Daftar Proyek" count={data.projects?.length}
                onAdd={handleAddProject} addLabel="Tambah Proyek" />

              {data.projects?.map((proj, pIdx) => (
                <div key={proj.id || pIdx} style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  backgroundColor: '#141414',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Proyek #{pIdx + 1}: {proj.title}</span>
                    <button onClick={() => handleDeleteProject(pIdx)}
                      style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {[
                    ['Judul Proyek', 'title'], ['Kategori', 'category'],
                    ['Live Demo URL', 'demoUrl'], ['GitHub URL', 'githubUrl']
                  ].map(([lbl, key]) => (
                    <div key={key}>
                      <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--text-secondary)' }}>{lbl}</label>
                      <input type="text" className="glass-input" value={proj[key] || ''}
                        onChange={(e) => updateProject(pIdx, key, e.target.value)} />
                    </div>
                  ))}

                  <div>
                    <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--text-secondary)' }}>Deskripsi</label>
                    <textarea rows={2} className="glass-input" style={{ resize: 'none' }}
                      value={proj.description || ''}
                      onChange={(e) => updateProject(pIdx, 'description', e.target.value)} />
                  </div>

                  <div style={{ padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, marginBottom: '6px', display: 'block', color: '#FFFFFF' }}>
                      ⚡ Tech Tags / Framework (pisahkan koma)
                    </label>
                    <input type="text" className="glass-input" placeholder="React.js, Tailwind CSS, TypeScript"
                      value={proj.tags?.join(', ') || ''}
                      onChange={(e) => updateProject(pIdx, 'tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                      {proj.tags?.map((tag, ti) => (
                        <span key={ti} className="mono-tag" style={{ fontSize: '10px', padding: '2px 8px' }}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Project Image */}
                  <div style={{
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Gambar Proyek</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <label className="mono-tag" style={{ fontSize: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Upload size={10} /> Upload
                          <input type="file" accept="image/*" onChange={(e) => handleProjectImageUpload(e, pIdx)} hidden />
                        </label>
                        {proj.image && (
                          <button onClick={() => handleDeleteProjectImage(pIdx)}
                            className="mono-tag" style={{ fontSize: '10px', color: '#EF4444', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Trash2 size={10} /> Hapus
                          </button>
                        )}
                      </div>
                    </div>
                    {proj.image && (
                      <img src={proj.image} alt="preview"
                        style={{ width: '100%', maxHeight: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                        onError={(e) => { e.target.style.display='none'; }} />
                    )}
                    <input type="text" className="glass-input" placeholder="Atau masukkan URL gambar..."
                      value={proj.image || ''}
                      onChange={(e) => updateProject(pIdx, 'image', e.target.value)}
                      style={{ fontSize: '12px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =============== TAB: CERTIFICATES =============== */}
          {activeTab === 'certificates' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SectionHeader title="Daftar Sertifikat" count={data.certificates?.length}
                onAdd={handleAddCertificate} addLabel="Tambah Sertifikat" />

              {data.certificates?.map((cert, cIdx) => (
                <div key={cert.id || cIdx} style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  backgroundColor: '#141414',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Sertifikat #{cIdx + 1}</span>
                    <button onClick={() => handleDeleteCertificate(cIdx)}
                      style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Certificate Image */}
                  <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px dashed rgba(255,255,255,0.15)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {cert.image ? (
                        <img src={cert.image} alt="cert" style={{
                          width: '80px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)'
                        }} onError={(e) => { e.target.style.display='none'; }} />
                      ) : (
                        <div style={{
                          width: '80px', height: '56px', borderRadius: '8px',
                          background: 'rgba(255,255,255,0.05)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Award size={24} style={{ color: 'rgba(255,255,255,0.3)' }} />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>Foto Sertifikat</p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <label className="glass-pill-container" style={{
                            padding: '5px 12px', fontSize: '11px', color: '#FFF', cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: '5px'
                          }}>
                            <Upload size={11} /> Upload
                            <input type="file" accept="image/*" onChange={(e) => handleCertImageUpload(e, cIdx)} hidden />
                          </label>
                          {cert.image && (
                            <button onClick={() => handleDeleteCertImage(cIdx)}
                              style={{
                                padding: '5px 10px', fontSize: '11px', color: '#EF4444', cursor: 'pointer',
                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '3px'
                              }}>
                              <Trash2 size={11} /> Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {[
                    ['Judul Sertifikat', 'title'], ['Penerbit / Organisasi', 'issuer'],
                    ['Tahun', 'date'], ['Credential ID', 'credentialId'], ['Link Verifikasi', 'link']
                  ].map(([lbl, key]) => (
                    <div key={key}>
                      <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--text-secondary)' }}>{lbl}</label>
                      <input type="text" className="glass-input" value={cert[key] || ''}
                        onChange={(e) => updateCert(cIdx, key, e.target.value)} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* =============== TAB: TECH STACK =============== */}
          {activeTab === 'techStack' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SectionHeader title="Tech Stack" count={data.techStack?.length}
                onAdd={handleAddGroup} addLabel="Tambah Kategori" />

              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                💡 Logo otomatis ditampilkan berdasarkan nama skill (misal: React.js, Next.js, Figma, Docker, dll).
              </p>

              {(data.techStack || []).map((group, gIdx) => (
                <div key={gIdx} style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  backgroundColor: '#141414',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {/* Group header */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="text" className="glass-input" value={group.category || ''}
                      placeholder="Nama Kategori (e.g. Frontend, Tools)"
                      onChange={(e) => updateGroupName(gIdx, e.target.value)}
                      style={{ flex: 1, fontSize: '13px', fontWeight: 600 }}
                    />
                    <button onClick={() => handleDeleteGroup(gIdx)}
                      style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', flexShrink: 0 }}>
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Skills list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {group.skills.map((skill, sIdx) => (
                      <div key={sIdx} style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '8px',
                        alignItems: 'center'
                      }}>
                        <input type="text" className="glass-input" value={skill.name || ''}
                          placeholder="Nama skill (e.g. React.js)"
                          onChange={(e) => updateSkillName(gIdx, sIdx, e.target.value)}
                          style={{ fontSize: '12px' }}
                        />
                        <button onClick={() => handleDeleteSkill(gIdx, sIdx)}
                          style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => handleAddSkill(gIdx)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px dashed rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      width: '100%'
                    }}>
                    <Plus size={13} /> Tambah Skill
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* =============== TAB: KOMENTAR (COMMENT MODERATION) =============== */}
          {activeTab === 'comments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>Moderasi & Monitoring Komentar</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sembunyikan atau hapus komentar dari pengunjung.</p>
                </div>
                {data.comments?.length > 0 && (
                  <button onClick={handleClearAllComments}
                    style={{
                      padding: '6px 12px',
                      fontSize: '11px',
                      color: '#EF4444',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                    <Trash2 size={13} /> Hapus Semua
                  </button>
                )}
              </div>

              {(!data.comments || data.comments.length === 0) ? (
                <div style={{
                  padding: '32px',
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '16px',
                  border: '1px dashed rgba(255,255,255,0.1)'
                }}>
                  <MessageSquare size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Belum ada komentar yang masuk.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {data.comments.map((cmt, cIdx) => (
                    <div key={cmt.id || cIdx} style={{
                      padding: '14px',
                      borderRadius: '16px',
                      border: cmt.hidden ? '1px dashed rgba(239,68,68,0.4)' : '1px solid var(--border)',
                      backgroundColor: cmt.hidden ? 'rgba(239,68,68,0.05)' : '#141414',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{cmt.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>• {cmt.date}</span>
                          {cmt.hidden && (
                            <span style={{
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(239,68,68,0.2)',
                              color: '#EF4444'
                            }}>
                              Tersembunyi
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleToggleHideComment(cIdx)}
                            title={cmt.hidden ? "Tampilkan komentar ke publik" : "Sembunyikan komentar dari publik"}
                            style={{
                              padding: '4px 8px',
                              fontSize: '11px',
                              borderRadius: '6px',
                              border: '1px solid rgba(255,255,255,0.15)',
                              background: 'rgba(255,255,255,0.05)',
                              color: cmt.hidden ? '#10B981' : 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {cmt.hidden ? <Eye size={12} /> : <EyeOff size={12} />}
                            <span>{cmt.hidden ? 'Tampilkan' : 'Sembunyikan'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteComment(cIdx)}
                            style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                            title="Hapus komentar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {cmt.text}
                      </p>

                      {cmt.image && (
                        <img src={cmt.image} alt="User attachment" style={{ maxWidth: '120px', maxHeight: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =============== TAB: SOCIALS =============== */}
          {activeTab === 'socials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SectionHeader title="Link Sosial Media" count={data.socials?.length}
                onAdd={handleAddSocial} addLabel="Tambah Sosial" />

              {data.socials?.map((soc, sIdx) => (
                <div key={sIdx} style={{
                  padding: '14px', borderRadius: '16px', border: '1px solid var(--border)',
                  backgroundColor: '#141414', display: 'flex', flexDirection: 'column', gap: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{soc.name || `Link #${sIdx + 1}`}</span>
                    <button onClick={() => handleDeleteSocial(sIdx)}
                      style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[['Nama Platform', 'name'], ['Handle', 'handle']].map(([lbl, key]) => (
                      <div key={key}>
                        <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--text-secondary)' }}>{lbl}</label>
                        <input type="text" className="glass-input" value={soc[key] || ''}
                          onChange={(e) => updateSocial(sIdx, key, e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--text-secondary)' }}>URL Tautan</label>
                    <input type="text" className="glass-input" value={soc.url || ''}
                      onChange={(e) => updateSocial(sIdx, 'url', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =============== TAB: JSON =============== */}
          {activeTab === 'json' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>Ekspor & Impor JSON</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Download atau upload file JSON konfigurasi portofolio.</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  <button onClick={exportJSON} className="glass-pill-container"
                    style={{ padding: '8px 16px', fontSize: '13px', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Download size={15} /> Download JSON
                  </button>
                  <label className="glass-pill-container"
                    style={{ padding: '8px 16px', fontSize: '13px', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Upload size={15} /> Upload JSON
                    <input type="file" accept=".json" onChange={handleFileUpload} hidden />
                  </label>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Edit Langsung JSON</label>
                  <button onClick={handleJsonSave} className="glass-pill-container"
                    style={{ padding: '4px 10px', fontSize: '12px', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Save size={13} /> Simpan
                  </button>
                </div>
                {jsonError && (
                  <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.2)', color: '#EF4444', fontSize: '12px', borderRadius: '8px', marginBottom: '8px' }}>
                    {jsonError}
                  </div>
                )}
                <textarea rows={18} className="glass-input"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1.4' }}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          backgroundColor: '#0F0F0F',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {/* Server status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: serverOnline ? '#10B981' : '#EF4444',
              boxShadow: serverOnline ? '0 0 6px rgba(16,185,129,0.5)' : '0 0 6px rgba(239,68,68,0.5)'
            }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {serverOnline ? (
                isSaving ? 'Menyimpan...' : (lastSaved ? `Tersimpan ${lastSaved.toLocaleTimeString('id-ID')}` : 'Server terhubung')
              ) : (
                'Server offline — jalankan: npm run server'
              )}
            </span>
          </div>
          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={resetToDefaults}
              style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RotateCcw size={13} /> Reset ke Default
            </button>
            <button onClick={() => setIsDrawerOpen(false)} className="glass-pill-container"
              style={{ padding: '8px 18px', fontSize: '13px', color: '#FFFFFF', cursor: 'pointer' }}>
              Selesai Editing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
