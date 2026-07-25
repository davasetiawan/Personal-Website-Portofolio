import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, Globe, Mail } from 'lucide-react';
import { ensureAbsoluteUrl } from '../utils/urlHelper';
import { Reveal } from '../hooks/useScrollReveal';

const IconLinkedIn = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IconGithubSVG = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const IconInstagram = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const getSocialIcon = (iconName, size = 22) => {
  const name = (iconName || '').toLowerCase();
  if (name === 'linkedin') return <IconLinkedIn size={size} />;
  if (name === 'github') return <IconGithubSVG size={size} />;
  if (name === 'instagram') return <IconInstagram size={size} />;
  if (name === 'email' || name === 'mail') return <Mail size={size} />;
  return <Globe size={size} />;
};

const getSocialGradient = (iconName) => {
  const name = (iconName || '').toLowerCase();
  if (name === 'linkedin') return 'linear-gradient(135deg, #0077B5, #00A0DC)';
  if (name === 'github') return 'linear-gradient(135deg, #333, #666)';
  if (name === 'instagram') return 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)';
  if (name === 'twitter' || name === 'x') return 'linear-gradient(135deg, #1DA1F2, #0d8fdb)';
  if (name === 'youtube') return 'linear-gradient(135deg, #FF0000, #cc0000)';
  if (name === 'tiktok') return 'linear-gradient(135deg, #000, #333)';
  if (name === 'email' || name === 'mail') return 'linear-gradient(135deg, #10B981, #059669)';
  return 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))';
};

// Tampilkan hanya sosmed yang diminta user (linkedin, github, instagram) + email personal
const PRIORITY_ICONS = ['linkedin', 'github', 'instagram', 'email', 'mail'];

export const ContactSection = () => {
  const { data } = usePortfolio();
  const { socials = [], personal = {} } = data;

  // Gabungkan link sosmed dari data + email dari personal jika belum ada
  const emailInSocials = socials.some(s => ['email', 'mail'].includes((s.icon || '').toLowerCase()));
  const allLinks = [
    ...socials,
    ...(personal.email && !emailInSocials ? [{
      name: 'Email',
      handle: personal.email,
      url: `mailto:${personal.email}`,
      icon: 'email',
    }] : []),
  ];

  return (
    <section id="contact" style={{ padding: '100px 0 80px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontFamily: 'monospace',
              marginBottom: '16px',
            }}>
              ✦ Let's Connect
            </span>
            <h2 style={{
              fontSize: 'clamp(32px, 6vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '16px',
            }}>
              Hubungi Saya
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.7,
              maxWidth: '480px',
              margin: '0 auto',
            }}>
              Terbuka untuk peluang baru, kolaborasi, maupun sekadar bertukar cerita. Jangan ragu untuk menghubungi saya!
            </p>
          </div>
        </Reveal>

        {/* Social Links Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {allLinks.map((soc, idx) => {
            const gradient = getSocialGradient(soc.icon);
            const rawHref = (soc.icon || '').toLowerCase() === 'email' || (soc.icon || '').toLowerCase() === 'mail'
              ? (soc.url.startsWith('mailto:') ? soc.url : `mailto:${soc.url}`)
              : soc.url;
            const href = ensureAbsoluteUrl(rawHref);

            return (
              <Reveal key={idx} delay={idx * 80}>
                <a
                  href={href}
                  target={href.startsWith('mailto:') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '20px 24px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    color: '#fff',
                    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                    e.currentTarget.style.transform = 'translateX(6px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {/* Icon Box */}
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  }}>
                    {getSocialIcon(soc.icon, 22)}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '3px' }}>
                      {soc.name}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.45)',
                      fontFamily: 'monospace',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {soc.handle || soc.url}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ExternalLink size={18} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0, transition: 'color 0.2s ease' }} />
                </a>
              </Reveal>
            );
          })}
        </div>

        {/* Footer */}
        <Reveal delay={400}>
          <div style={{ textAlign: 'center', marginTop: '72px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>
              © {new Date().getFullYear()} {personal.name || 'Dava Setiawan'} — All rights reserved.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
