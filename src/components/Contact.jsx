import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, Copy, Check, Send, Clock, MessageSquare } from 'lucide-react';

export const Contact = () => {
  const { data } = usePortfolio();
  const { contact, personal } = data;

  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailToUse = (contact && contact.email) || personal.email || 'alex.pratama@example.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(emailToUse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 800);
  };

  return (
    <section id="contact" style={{
      paddingTop: '72px',
      paddingBottom: '80px',
      borderBottom: '1px solid var(--color-border)'
    }}>
      <div className="container-vercel">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left Column: Direct Info & Copy Email */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <MessageSquare size={18} style={{ color: 'var(--color-secondary)' }} />
              <span className="label-sm" style={{ color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Kontak & Kolaborasi
              </span>
            </div>
            <h2 className="headline-lg" style={{ marginBottom: '16px' }}>
              {(contact && contact.title) || 'Mari Berdiskusi'}
            </h2>
            <p className="body-lg" style={{ marginBottom: '28px' }}>
              {(contact && contact.description) || 'Apakah Anda memiliki ide proyek menarik atau ingin berkonsultasi? Silakan kirimkan pesan.'}
            </p>

            {/* Email Box Card */}
            <div className="card-vercel" style={{ padding: '20px', marginBottom: '24px' }}>
              <div className="label-sm" style={{ color: 'var(--color-secondary)', marginBottom: '8px' }}>
                Alamat Email Langsung
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <span className="headline-xs" style={{ fontSize: '18px', wordBreak: 'break-all' }}>
                  {emailToUse}
                </span>
                <button
                  onClick={handleCopy}
                  className="button-secondary"
                  style={{ height: '36px', padding: '0 14px', fontSize: '13px' }}
                >
                  {copied ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} />}
                  <span>{copied ? 'Tersalin!' : 'Salin Email'}</span>
                </button>
              </div>
            </div>

            {/* Response time chip */}
            {contact && contact.responseSpeed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={14} style={{ color: 'var(--color-secondary)' }} />
                <span className="body-sm" style={{ fontSize: '13px' }}>
                  {contact.responseSpeed}
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Form */}
          <div className="card-vercel" style={{ padding: '28px' }}>
            <h3 className="headline-xs" style={{ marginBottom: '20px' }}>
              Kirim Pesan Langsung
            </h3>

            {submitted ? (
              <div style={{
                padding: '20px',
                backgroundColor: 'var(--color-muted)',
                borderRadius: 'var(--rounded-sm)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}>
                  <Check size={20} />
                </div>
                <h4 className="headline-xs" style={{ fontSize: '18px', marginBottom: '4px' }}>
                  Pesan Terkirim!
                </h4>
                <p className="body-sm">
                  Terima kasih telah menghubungi. Saya akan membalas pesan Anda sesegera mungkin.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="label-sm" style={{ display: 'block', marginBottom: '6px', color: 'var(--color-primary)' }}>
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama Anda"
                    className="input-vercel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label-sm" style={{ display: 'block', marginBottom: '6px', color: 'var(--color-primary)' }}>
                    Email Anda
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@perusahaan.com"
                    className="input-vercel"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label-sm" style={{ display: 'block', marginBottom: '6px', color: 'var(--color-primary)' }}>
                    Pesan atau Pertanyaan
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Ceritakan detail proyek atau pertanyaan Anda..."
                    className="input-vercel"
                    style={{ resize: 'vertical' }}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button-primary"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  {isSubmitting ? (
                    <span>Mengirim...</span>
                  ) : (
                    <>
                      <span>Kirim Pesan</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
