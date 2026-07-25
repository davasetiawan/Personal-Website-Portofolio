import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Sparkles, Move } from 'lucide-react';
import { Reveal } from '../hooks/useScrollReveal';

/* ============================================================
   INTERACTIVE LANYARD BADGE COMPONENT
   Supports: 3D Mouse Tilt, Mouse Drag, Dynamic Physics Swing
   ============================================================ */
const InteractiveLanyard = ({ personal }) => {
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ rotateX: 0, rotateY: 0 });
  const cardRef = useRef(null);

  // 3D tilt on mouse hover
  const handleMouseMove = (e) => {
    if (isDragging || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    setMouseTilt({
      rotateY: (mouseX / rect.width) * 20,
      rotateX: (-mouseY / rect.height) * 20,
    });
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setMouseTilt({ rotateX: 0, rotateY: 0 });
    }
  };

  // Drag handlers
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!isDragging || !cardRef.current) return;
      setDragPos((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragPos({ x: 0, y: 0 });
        setMouseTilt({ rotateX: 0, rotateY: 0 });
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const transformStyle = isDragging
    ? `translate3d(${dragPos.x}px, ${dragPos.y}px, 0px) rotate(${dragPos.x * 0.08}deg)`
    : `perspective(1000px) rotateX(${mouseTilt.rotateX}deg) rotateY(${mouseTilt.rotateY}deg)`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        userSelect: 'none',
        touchAction: 'none'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Lanyard Rope ribbon in sleek monochrome glass */}
      <div className="lanyard-strap-container">
        <svg width="120" height="70" viewBox="0 0 120 70" style={{ display: 'block' }}>
          <path
            d="M 60 0 C 60 0 40 20 30 40 L 46 40 C 46 40 55 22 60 22 C 65 22 74 40 74 40 L 90 40 C 90 40 80 20 60 0 Z"
            fill="url(#ribbonMonochrome)"
            opacity="0.8"
          />
          <path
            d="M 60 40 L 60 68"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="ribbonMonochrome" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#444444" />
              <stop offset="50%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#333333" />
            </linearGradient>
          </defs>
        </svg>

        {/* Silver Metal clip */}
        <div className="lanyard-clip" />
      </div>

      {/* ID Badge Card */}
      <div
        ref={cardRef}
        onMouseDown={handleMouseDown}
        style={{
          marginTop: '-1px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: isDragging ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.18)',
          background: 'rgba(20, 20, 20, 0.85)',
          backdropFilter: 'blur(24px)',
          boxShadow: isDragging
            ? '0 30px 80px rgba(0,0,0,0.9), 0 0 24px rgba(255,255,255,0.2)'
            : '0 24px 64px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.15) inset',
          width: '300px',
          transform: transformStyle,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
          cursor: isDragging ? 'grabbing' : 'grab',
          transformOrigin: 'top center'
        }}
      >
        {/* Sleek Monochrome Header Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '14px 20px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}>
            DEVELOPER PASS
          </span>
          <Sparkles size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
        </div>

        {/* Photo */}
        <div style={{
          width: '100%',
          aspectRatio: '3 / 3.5',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'rgba(0,0,0,0.6)'
        }}>
          <img
            src={personal.avatar || '/profile.png'}
            alt={personal.name || 'Profile'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              pointerEvents: 'none'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/profile.png';
            }}
          />
        </div>

        {/* Badge Info */}
        <div style={{
          padding: '16px 20px',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '2px'
          }}>
            {personal.name || 'Mohammad Dava Setiawan'}
          </p>
          <p style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.55)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.08em',
            marginBottom: '12px'
          }}>
            {personal.titleLine1} {personal.titleLine2}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge-pulse" style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                display: 'inline-block'
              }} />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>
                Available for work
              </span>
            </div>
            <span style={{
              fontSize: '9px',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}>
              <Move size={10} /> Drag to sway
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   MAIN HERO COMPONENT
   ============================================================ */
export const Hero = () => {
  const { data, isAdmin, setIsDrawerOpen } = usePortfolio();
  const { personal } = data;

  // Typing effect state
  const typingTexts = personal.typingTexts || [
    "Menciptakan website modern & responsif",
    "Mengubah ide menjadi pengalaman digital",
    "Spesialis React, Next.js & Tailwind"
  ];
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = typingTexts[textIndex];
    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentFullText.length) {
      speed = 2200;
      const timeout = setTimeout(() => setIsDeleting(true), speed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % typingTexts.length);
      speed = 400;
    }

    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, textIndex, typingTexts]);

  const currentDisplayString = typingTexts[textIndex]
    ? typingTexts[textIndex].substring(0, charIndex)
    : '';

  return (
    <section id="home" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 'max(24px, 7vw)',
      paddingRight: 'max(24px, 7vw)',
      position: 'relative',
      paddingTop: '100px',
      paddingBottom: '80px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1350px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '48px',
        alignItems: 'center',
        zIndex: 10
      }}>
        {/* LEFT COLUMN: Text Content */}
        <div>
          {/* Status Badge */}
          <Reveal delay={0}>
            <div style={{ marginBottom: '20px' }}>
              <span className="mono-tag" style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '11px' }}>
                <span className="badge-pulse" style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  display: 'inline-block'
                }} />
                {personal.statusBadge || '✦ Available for work'}
              </span>
            </div>
          </Reveal>

          {/* Display Title */}
          <Reveal delay={80}>
            <div style={{ marginBottom: '20px' }}>
              <h1 style={{
                fontSize: 'clamp(42px, 6.5vw, 68px)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#FFFFFF'
              }}>
                {personal.titleLine1 || 'Frontend'}
              </h1>
              <h1 style={{
                fontSize: 'clamp(42px, 6.5vw, 68px)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: 'rgba(255, 255, 255, 0.45)'
              }}>
                {personal.titleLine2 || 'Developer'}
              </h1>
            </div>
          </Reveal>

          {/* Typing Animated Subtitle */}
          <Reveal delay={160}>
            <div style={{ marginBottom: '16px', minHeight: '28px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '15px',
                color: 'var(--text-secondary)',
                letterSpacing: '0.05em'
              }}>
                <span>{currentDisplayString}</span>
                <span className="cursor-blink" style={{ marginLeft: '4px', fontWeight: 600 }}>_</span>
              </span>
            </div>
          </Reveal>

          {/* Bio Paragraph */}
          <Reveal delay={200}>
            <div style={{ marginBottom: '28px', maxWidth: '520px' }}>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: '1.9',
                letterSpacing: '0.01em'
              }}>
                {personal.bio}
              </p>
            </div>
          </Reveal>

          {/* Core Stack Pills */}
          {personal.coreStack && personal.coreStack.length > 0 && (
            <Reveal delay={240}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
                {personal.coreStack.map((tech, idx) => (
                  <span key={idx} className="mono-tag" style={{ fontSize: '11px', padding: '5px 12px' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </Reveal>
          )}

          {/* Subtext info indicators */}
          <Reveal delay={280}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
                {personal.exploreText || '↓ explore my work below'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
                {personal.opportunityText || '↗ open to full-time & freelance opportunities'}
              </span>
            </div>
          </Reveal>

          {/* Secret Admin Mode Edit Button */}
          {isAdmin && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="mono-tag"
              style={{
                cursor: 'pointer',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF'
              }}
            >
              ⚙ Edit Teks & Informasi →
            </button>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Lanyard Badge Photo */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '24px' }}>
          {/* Ambient Soft Monochrome Glow */}
          <div style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            filter: 'blur(80px)',
            zIndex: -1,
            pointerEvents: 'none'
          }} />

          {/* Interactive Lanyard Assembly */}
          <InteractiveLanyard personal={personal} />
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)'
      }}>
        <span>Scroll</span>
        <span>↓</span>
      </div>
    </section>
  );
};
