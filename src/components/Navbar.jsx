import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Settings, Sparkles, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'Tentang Saya' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar = () => {
  const { data, isAdmin, setIsDrawerOpen } = usePortfolio();
  const { personal } = data;

  const [activeSection, setActiveSection] = useState('home');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navRef = useRef(null);
  const linkRefs = useRef({});

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        threshold: [0.2, 0.5],
        rootMargin: '-60px 0px -30% 0px',
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Update gliding indicator position on desktop
  const updateIndicator = () => {
    const activeEl = linkRefs.current[activeSection];
    const navEl = navRef.current;
    if (!activeEl || !navEl) return;

    const navRect = navEl.getBoundingClientRect();
    const linkRect = activeEl.getBoundingClientRect();

    setIndicatorStyle({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
    });
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeSection]);

  const handleNavClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 max(16px, 3vw)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Name */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#FFFFFF'
          }}
        >
          <Sparkles size={16} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
          <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
            {personal.name || 'Mohammad Dava Setiawan'}
          </span>
        </a>

        {/* Desktop Nav Links with Gliding Indicator */}
        <nav
          ref={navRef}
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            position: 'relative',
            padding: '4px',
            borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.04)'
          }}
        >
          {/* Gliding pill indicator */}
          <div
            className="nav-indicator"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          />

          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              ref={(el) => { linkRefs.current[link.id] = el; }}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}
              style={{
                position: 'relative',
                zIndex: 1,
                fontSize: '13px',
                fontWeight: activeSection === link.id ? 600 : 400,
                color: activeSection === link.id ? '#FFFFFF' : 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '7px 16px',
                borderRadius: '9999px',
                transition: 'color 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {link.label}
            </a>
          ))}

          {/* Admin Edit Button */}
          {isAdmin && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              style={{
                position: 'relative',
                zIndex: 1,
                marginLeft: '6px',
                padding: '7px 14px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.1)',
                fontSize: '12px',
                cursor: 'pointer',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Settings size={13} />
              <span>Edit</span>
            </button>
          )}
        </nav>

        {/* Mobile Buttons: Edit + Hamburger Toggle */}
        <div className="mobile-actions" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
          {isAdmin && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              style={{
                padding: '6px 12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.1)',
                fontSize: '11px',
                cursor: 'pointer',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Settings size={12} />
              <span>Edit</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '8px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.15)',
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="mobile-menu-panel" style={{
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '16px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}
              style={{
                padding: '12px 18px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: activeSection === link.id ? 600 : 400,
                color: activeSection === link.id ? '#FFFFFF' : 'var(--text-secondary)',
                backgroundColor: activeSection === link.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: activeSection === link.id ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{link.label}</span>
              {activeSection === link.id && (
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF'
                }} />
              )}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
