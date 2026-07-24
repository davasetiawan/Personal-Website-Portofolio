import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUpRight, Award, X, ZoomIn, ExternalLink } from 'lucide-react';
import { IconGithub } from './Icons';
import { getSkillLogoUrl } from '../utils/getSkillLogo';
import { Reveal } from '../hooks/useScrollReveal';

/* ============================================
   CERTIFICATE IMAGE LIGHTBOX
   ============================================ */
const CertLightbox = ({ src, title, onClose }) => {
  if (!src) return null;
  return (
    <div className="cert-lightbox-overlay" onClick={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
        onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt={title}
          className="cert-lightbox-img"
        />
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '9999px',
            color: '#FFFFFF',
            padding: '8px 20px',
            cursor: 'pointer',
            fontSize: '13px',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <X size={14} /> Tutup
        </button>
      </div>
    </div>
  );
};

/* ============================================
   TECH LOGO with automatic icon
   ============================================ */
const TechLogo = ({ skillName }) => {
  const [errored, setErrored] = useState(false);

  // Reset error state whenever skillName changes
  React.useEffect(() => {
    setErrored(false);
  }, [skillName]);

  const logoUrl = getSkillLogoUrl(skillName);

  if (!logoUrl || errored) {
    // Fallback: monochrome glass circle
    return (
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 700,
        color: '#FFFFFF',
        flexShrink: 0
      }}>
        {skillName ? skillName.trim()[0]?.toUpperCase() : '?'}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={skillName}
      className="tech-logo-img"
      onError={() => setErrored(true)}
    />
  );
};

/* ============================================
   MAIN SHOWCASE COMPONENT
   ============================================ */
export const Showcase = () => {
  const { data } = usePortfolio();
  const { projects = [], certificates = [], techStack = [] } = data;

  const [activeTab, setActiveTab] = useState('projects');
  const [lightboxCert, setLightboxCert] = useState(null);

  return (
    <section id="portfolio" style={{
      width: '100%',
      maxWidth: '1350px',
      margin: '0 auto',
      padding: '96px 24px',
      color: '#FFFFFF'
    }}>
      {/* Section Title */}
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>
            Portfolio Showcase
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', fontSize: '15px' }}>
            Explore my journey through projects, certifications, and technical expertise.
          </p>
        </div>
      </Reveal>

      {/* Glass Pill Tab Container */}
      <Reveal delay={80}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
          <div className="glass-pill-container" style={{
            width: '100%',
            maxWidth: '620px',
            display: 'flex',
            gap: '8px'
          }}>
            {['projects', 'certificates', 'techStack'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`glass-tab-button ${activeTab === tab ? 'active' : ''}`}
              >
                {tab === 'projects' ? 'Projects' : tab === 'certificates' ? 'Certificates' : 'Tech Stack'}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* TAB 1: PROJECTS */}
      {activeTab === 'projects' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {projects.map((proj, idx) => (
            <Reveal key={proj.id} delay={idx * 80}>
              <div className="glass-card" style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
              }}>
                {/* Project Image Preview */}
                {proj.image && (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    flexShrink: 0
                  }}>
                    <img
                      src={proj.image}
                      alt={proj.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  {/* Category tag */}
                  <span className="mono-tag" style={{ fontSize: '11px', alignSelf: 'flex-start' }}>
                    {proj.category || 'Web App'}
                  </span>

                  {/* Title */}
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF' }}>
                    {proj.title}
                  </h3>

                  {/* Description */}
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', flex: 1 }}>
                    {proj.description || proj.tagline}
                  </p>

                  {/* Tech Tags with logos */}
                  {proj.tags && proj.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {proj.tags.map((tag, tIdx) => (
                        <span key={tIdx} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-secondary)'
                        }}>
                          <TechLogo key={tag} skillName={tag} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border)'
                  }}>
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-pill-container"
                        style={{
                          padding: '8px 16px',
                          fontSize: '13px',
                          color: '#FFFFFF',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: 500,
                          flex: 1,
                          justifyContent: 'center'
                        }}
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight size={15} />
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-pill-container"
                        style={{
                          width: '38px',
                          height: '38px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          textDecoration: 'none'
                        }}
                        title="Source Code"
                      >
                        <IconGithub size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* TAB 2: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {certificates.map((cert, cIdx) => (
              <Reveal key={cert.id} delay={cIdx * 80}>
                <div className="glass-card" style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  {/* Certificate Image Preview */}
                  {cert.image ? (
                    <div
                      style={{
                        width: '100%',
                        height: '200px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'zoom-in',
                        backgroundColor: 'rgba(0,0,0,0.4)'
                      }}
                      onClick={() => setLightboxCert(cert)}
                    >
                      <img
                        src={cert.image}
                        alt={cert.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                      {/* Zoom overlay hint */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s ease',
                        color: 'rgba(255,255,255,0)',
                      }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
                          e.currentTarget.style.color = 'rgba(255,255,255,1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0,0,0,0)';
                          e.currentTarget.style.color = 'rgba(255,255,255,0)';
                        }}
                      >
                        <ZoomIn size={32} />
                      </div>
                    </div>
                  ) : (
                    /* No image: placeholder icon */
                    <div style={{
                      width: '100%',
                      height: '120px',
                      background: 'rgba(255,255,255,0.03)',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Award size={48} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    </div>
                  )}

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Award size={18} style={{ color: 'rgba(255,255,255,0.7)' }} />
                      <span className="mono-tag" style={{ fontSize: '11px' }}>{cert.date}</span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>
                      {cert.title}
                    </h3>

                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {cert.issuer}
                    </p>

                    {cert.credentialId && (
                      <p className="mono-tag" style={{ fontSize: '10px', alignSelf: 'flex-start' }}>
                        ID: {cert.credentialId}
                      </p>
                    )}

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border)',
                      marginTop: 'auto'
                    }}>
                      {cert.image && (
                        <button
                          onClick={() => setLightboxCert(cert)}
                          className="glass-pill-container"
                          style={{
                            padding: '7px 14px',
                            fontSize: '12px',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            border: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            flex: 1,
                            justifyContent: 'center'
                          }}
                        >
                          <ZoomIn size={13} />
                          <span>Lihat Foto</span>
                        </button>
                      )}

                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-pill-container"
                          style={{
                            padding: '7px 14px',
                            fontSize: '12px',
                            color: '#FFFFFF',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            flex: 1
                          }}
                        >
                          <ExternalLink size={13} />
                          <span>Verifikasi</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Lightbox */}
          {lightboxCert && (
            <CertLightbox
              src={lightboxCert.image}
              title={lightboxCert.title}
              onClose={() => setLightboxCert(null)}
            />
          )}
        </>
      )}

      {/* TAB 3: TECH STACK (Removed level proficiency tags) */}
      {activeTab === 'techStack' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {techStack.map((group, gIdx) => (
            <Reveal key={gIdx} delay={gIdx * 100}>
              <div className="glass-card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px', color: '#FFFFFF' }}>
                  {group.category}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: '14px'
                }}>
                  {group.skills.map((skill, sIdx) => (
                    <div key={sIdx} style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s ease',
                      cursor: 'default'
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      }}
                    >
                      {/* Auto Tech Logo */}
                      <TechLogo skillName={skill.name} />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#FFFFFF',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {skill.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
};
