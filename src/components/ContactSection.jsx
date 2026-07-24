import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { User, Mail, MessageSquare, Send, ArrowUpRight, Upload, Check, Eye, EyeOff, Trash2, AlertCircle, Loader, Bell } from 'lucide-react';
import { Reveal } from '../hooks/useScrollReveal';

export const ContactSection = () => {
  const { data, updateField, isAdmin } = usePortfolio();
  const { socials = [], comments = [], personal } = data;

  // Form states
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');

  // Comment states
  const [commentForm, setCommentForm] = useState({ name: '', text: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setContactLoading(true);
    setContactError('');

    const targetEmail = personal?.email || 'davasetiawan893@gmail.com';

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          _subject: `[Portofolio] Pesan Baru dari ${contactForm.name}`,
          _template: 'table'
        }),
      });

      const result = await response.json();

      if (response.ok || result.success === "true" || result.success === true) {
        setContactSuccess(true);
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => setContactSuccess(false), 6000);
      } else {
        setContactError('Gagal mengirim pesan. Pastikan email Anda valid.');
      }
    } catch (err) {
      setContactError('Koneksi bermasalah. Periksa koneksi internet Anda dan coba lagi.');
    } finally {
      setContactLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setCommentForm(prev => ({ ...prev, image: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.text) return;

    const newComment = {
      id: 'comment-' + Date.now(),
      name: commentForm.name,
      text: commentForm.text,
      date: new Date().toISOString().split('T')[0],
      image: commentForm.image,
      hidden: false
    };

    updateField(['comments'], [newComment, ...(comments || [])]);
    setCommentForm({ name: '', text: '', image: null });
    setImagePreview(null);
  };

  const handleToggleHideComment = (commentId) => {
    const updated = comments.map(c => c.id === commentId ? { ...c, hidden: !c.hidden } : c);
    updateField(['comments'], updated);
  };

  const handleDeleteComment = (commentId) => {
    if (!window.confirm('Hapus komentar ini?')) return;
    const updated = comments.filter(c => c.id !== commentId);
    updateField(['comments'], updated);
  };

  // Admin sees all comments (including hidden), visitors see only visible comments
  const displayComments = isAdmin ? comments : comments.filter(c => !c.hidden);

  return (
    <section id="contact" style={{
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '96px 24px 120px',
      color: '#FFFFFF'
    }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, marginBottom: '12px' }}>
          Contact Me
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '15px' }}>
          Have something in mind? Send a message and let's connect.
        </p>
      </div>

      {/* Grid Layout: Left Column (Form & Socials), Right Column (Comments) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* LEFT COLUMN: Contact Form & Social Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Contact Form Card */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
              Hubungi Saya
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Feel free to reach out if you want to collaborate, discuss ideas, or simply say hello.
            </p>

            {/* Admin: Web3Forms Key Config Banner */}
            {isAdmin && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(251, 191, 36, 0.08)',
                border: '1px solid rgba(251, 191, 36, 0.25)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                <Bell size={14} style={{ color: '#FBBF24', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#FBBF24', fontWeight: 600 }}>Notifikasi Email</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', flex: 1, minWidth: '120px' }}>
                  {data.web3formsKey ? '✅ Access Key sudah diset' : '⚠️ Belum dikonfigurasi'}
                </span>
                <input
                  type="text"
                  placeholder="Paste Web3Forms Access Key..."
                  className="glass-input"
                  style={{ fontSize: '11px', padding: '6px 10px', flex: 2, minWidth: '180px' }}
                  value={data.web3formsKey || ''}
                  onChange={(e) => updateField(['web3formsKey'], e.target.value)}
                />
              </div>
            )}

            {/* Error Alert */}
            {contactError && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <AlertCircle size={16} style={{ color: '#EF4444', flexShrink: 0, marginTop: '1px' }} />
                <span style={{ fontSize: '13px', color: '#EF4444' }}>{contactError}</span>
              </div>
            )}

            {contactSuccess ? (
              <div style={{
                padding: '24px 20px',
                borderRadius: '16px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'rgba(16,185,129,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px'
                }}>
                  <Check size={24} style={{ color: '#10B981' }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>Pesan Terkirim! 🎉</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Terima kasih telah menghubungi. Akan segera dibalas.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    className="glass-input"
                    style={{ paddingLeft: '48px' }}
                    value={contactForm.name}
                    onChange={(e) => { setContactError(''); setContactForm({ ...contactForm, name: e.target.value }); }}
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    className="glass-input"
                    style={{ paddingLeft: '48px' }}
                    value={contactForm.email}
                    onChange={(e) => { setContactError(''); setContactForm({ ...contactForm, email: e.target.value }); }}
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  <MessageSquare size={18} style={{ position: 'absolute', left: '16px', top: '20px', color: 'var(--text-muted)' }} />
                  <textarea
                    rows={4}
                    required
                    placeholder="Your Message"
                    className="glass-input"
                    style={{ paddingLeft: '48px', resize: 'none' }}
                    value={contactForm.message}
                    onChange={(e) => { setContactError(''); setContactForm({ ...contactForm, message: e.target.value }); }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="glass-pill-container"
                  style={{
                    padding: '14px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: contactLoading ? 'var(--text-muted)' : '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: contactLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: contactLoading ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {contactLoading ? (
                    <>
                      <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Social Links Sub-section */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Connect With Me
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {socials.map((soc, idx) => (
                  <a
                    key={idx}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '16px',
                      textDecoration: 'none',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{soc.name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{soc.handle}</span>
                    </div>
                    <ArrowUpRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Comments System */}
        <div className="glass-card" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
                Comments ({displayComments.length})
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Leave your thoughts here
              </p>
            </div>
            {isAdmin && (
              <span className="mono-tag" style={{ fontSize: '10px', color: '#10B981', borderColor: 'rgba(16,185,129,0.3)' }}>
                ✦ Moderation Active
              </span>
            )}
          </div>

          {/* New Comment Input Form */}
          <form onSubmit={handlePostComment} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <input
              type="text"
              required
              placeholder="Your Name"
              className="glass-input"
              value={commentForm.name}
              onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
            />

            <textarea
              rows={3}
              required
              placeholder="Your Comment"
              className="glass-input"
              style={{ resize: 'none' }}
              value={commentForm.text}
              onChange={(e) => setCommentForm({ ...commentForm, text: e.target.value })}
            />

            {/* Upload Image Optional */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label
                className="glass-input"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '10px 14px',
                  width: 'auto',
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}
              >
                <Upload size={14} />
                <span>{imagePreview ? 'Gambar Terpilih' : 'Upload Image'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
              </label>

              {imagePreview && (
                <img src={imagePreview} alt="Preview" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
              )}
            </div>

            <button
              type="submit"
              className="glass-pill-container"
              style={{
                padding: '12px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#FFFFFF',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              Post Comment
            </button>
          </form>

          {/* Scrollable Comments List */}
          <div className="custom-scroll" style={{
            flex: 1,
            maxHeight: '380px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingRight: '4px'
          }}>
            {displayComments.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
                Belum ada komentar. Jadilah yang pertama memberi umpan balik!
              </p>
            ) : (
              displayComments.map((cmt) => (
                <div key={cmt.id} style={{
                  padding: '14px 16px',
                  borderRadius: '16px',
                  backgroundColor: cmt.hidden ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 0, 0, 0.3)',
                  border: cmt.hidden ? '1px dashed rgba(239, 68, 68, 0.4)' : '1px solid var(--border)',
                  opacity: cmt.hidden ? 0.75 : 1
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{cmt.name}</span>
                      {cmt.hidden && (
                        <span style={{ fontSize: '10px', color: '#EF4444', background: 'rgba(239,68,68,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                          Tersembunyi
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{cmt.date}</span>
                      {/* Admin Quick Action Controls */}
                      {isAdmin && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            onClick={() => handleToggleHideComment(cmt.id)}
                            title={cmt.hidden ? "Tampilkan komentar ke publik" : "Sembunyikan komentar dari publik"}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: cmt.hidden ? '#10B981' : 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '2px'
                            }}
                          >
                            {cmt.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            onClick={() => handleDeleteComment(cmt.id)}
                            title="Hapus komentar"
                            style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {cmt.text}
                  </p>
                  {cmt.image && (
                    <img src={cmt.image} alt="User upload" style={{ marginTop: '10px', maxWidth: '100%', maxHeight: '160px', borderRadius: '8px', objectFit: 'cover' }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Copyright */}
      <div style={{ marginTop: '80px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} {personal.name || 'Mohammad Dava Setiawan'} — All rights reserved.
      </div>
    </section>
  );
};
