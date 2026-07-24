import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUp } from 'lucide-react';
import { IconGithub, IconLinkedin, IconTwitter } from './Icons';

export const Footer = () => {
  const { data } = usePortfolio();
  const { personal } = data;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      paddingTop: '40px',
      paddingBottom: '40px',
      backgroundColor: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)'
    }}>
      <div className="container-vercel" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {/* Copyright & Info */}
        <div>
          <p className="label-sm" style={{ color: 'var(--color-primary)', fontWeight: 600, marginBottom: '2px' }}>
            © {new Date().getFullYear()} {personal.name || 'Portfolio'}. All rights reserved.
          </p>
          <p className="label-sm" style={{ color: 'var(--color-secondary)', fontSize: '11px' }}>
            Dirancang dengan sistem presisi <span style={{ fontWeight: 600 }}>Vercel Minimal (Design.md)</span>
          </p>
        </div>

        {/* Social Links & Back to Top */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {personal.github && (
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary"
              style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
              title="GitHub"
            >
              <IconGithub size={16} />
            </a>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary"
              style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
              title="LinkedIn"
            >
              <IconLinkedin size={16} />
            </a>
          )}
          {personal.twitter && (
            <a
              href={personal.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary"
              style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
              title="Twitter"
            >
              <IconTwitter size={16} />
            </a>
          )}

          <button
            onClick={scrollToTop}
            className="button-secondary"
            style={{ height: '36px', padding: '0 12px', fontSize: '12px', borderRadius: 'var(--rounded-lg)' }}
            title="Kembali ke atas"
          >
            <span>Atas</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
