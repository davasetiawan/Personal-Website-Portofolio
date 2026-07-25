import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUpRight, Award, X, ZoomIn, ExternalLink } from 'lucide-react';
import { getSkillLogoUrl } from '../utils/getSkillLogo';
import { Reveal } from '../hooks/useScrollReveal';

/* ============================================
   GITHUB SVG ICON
   ============================================ */
const IconGithub = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

/* ============================================
   CERTIFICATE IMAGE LIGHTBOX
   ============================================ */
const CertLightbox = ({ src, title, onClose }) => {
  if (!src) return null;
  return (
    <div className="cert-lightbox-overlay" onClick={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
        onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={title} className="cert-lightbox-img" />
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
  React.useEffect(() => { setErrored(false); }, [skillName]);
  const logoUrl = getSkillLogoUrl(skillName);

  if (!logoUrl || errored) {
    return (
      <div style={{
        width: '28px', height: '28px', borderRadius: '6px',
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: 700, color: '#FFFFFF', flexShrink: 0
      }}>
        {skillName ? skillName.trim()[0]?.toUpperCase() : '?'}
      </div>
    );
  }

  return (
    <img src={logoUrl} alt={skillName} className="tech-logo-img" onError={() => setErrored(true)} />
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

  const tabStyle = (tab) => ({
    flex: 1,
    padding: '10px 0',
    borderRadius: '12px',
    border: activeTab === tab ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
    background: activeTab === tab ? 'rgba(255,255,255,0.1)' : 'transparent',
    color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.4)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    fontFamily: 'inherit',
  });

  const btnDemo = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    flex: 1,
    padding: '10px 0',
    fontSize: '13px',
    fontWeight: 600,
    color: '#ffffff',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const btnGit = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '42px',
    height: '42px',
    flexShrink: 0,
    color: 'rgba(255,255,255,0.6)',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  };

  return (
    <section id="portfolio" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '96px 24px', color: '#FFFFFF' }}>

      {/* Section Title */}
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>
            Portfolio Showcase
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '560px', margin: '0 auto', fontSize: '15px' }}>
            Jelajahi proyek, sertifikasi, dan keahlian teknis saya.
          </p>
        </div>
      </Reveal>

      {/* Tab Switcher */}
      <Reveal delay={80}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'flex', gap: '6px', padding: '6px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '18px', width: '100%', maxWidth: '580px'
          }}>
            {[
              { key: 'projects', label: `Proyek (${projects.length})` },
              { key: 'certificates', label: `Sertifikat (${certificates.length})` },
              { key: 'techStack', label: 'Tech Stack' },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)} style={tabStyle(key)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ====== TAB 1: PROJECTS ====== */}
      {activeTab === 'projects' && (
        projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
            Belum ada proyek yang ditambahkan.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {projects.map((proj, idx) => (
              <Reveal key={proj.id || idx} delay={idx * 80}>
                <div style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%',
                    transition: 'border-color 0.25s ease, transform 0.25s ease',
                  }}
                >
                  {/* Project Image */}
                  {proj.image && (
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', flexShrink: 0, backgroundColor: 'rgba(0,0,0,0.3)' }}>
                      <img
                        src={proj.image} alt={proj.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
                        onError={e => { e.target.parentElement.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    {/* Category */}
                    <span style={{
                      display: 'inline-block', alignSelf: 'flex-start',
                      fontSize: '11px', fontWeight: 600, fontFamily: 'monospace',
                      color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '20px', padding: '3px 10px',
                    }}>
                      {proj.category || 'Web App'}
                    </span>

                    {/* Title */}
                    <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                      {proj.title}
                    </h3>

                    {/* Description */}
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, flex: 1 }}>
                      {proj.description || proj.tagline}
                    </p>

                    {/* Tech Tags */}
                    {proj.tags && proj.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {proj.tags.map((tag, tIdx) => (
                          <span key={tIdx} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            padding: '3px 10px', borderRadius: '20px',
                            border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
                            fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)',
                          }}>
                            <TechLogo skillName={tag} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 'auto' }}>
                      {/* Live Demo Button */}
                      {proj.demoUrl && proj.demoUrl !== 'https://example.com' ? (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={btnDemo}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                        >
                          <ArrowUpRight size={15} />
                          <span>Live Demo</span>
                        </a>
                      ) : (
                        <span style={{ ...btnDemo, opacity: 0.3, cursor: 'not-allowed' }}>
                          <ArrowUpRight size={15} />
                          <span>Belum Live</span>
                        </span>
                      )}

                      {/* GitHub Button */}
                      {proj.githubUrl && proj.githubUrl.includes('github.com') && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={btnGit}
                          title="Source Code di GitHub"
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                        >
                          <IconGithub size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )
      )}

      {/* ====== TAB 2: CERTIFICATES ====== */}
      {activeTab === 'certificates' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {certificates.map((cert, cIdx) => (
              <Reveal key={cert.id} delay={cIdx * 80}>
                <div style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%',
                }}>
                  {cert.image ? (
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative', cursor: 'zoom-in', backgroundColor: 'rgba(0,0,0,0.4)' }}
                      onClick={() => setLightboxCert(cert)}>
                      <img src={cert.image} alt={cert.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
                      />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0)', transition: 'all 0.2s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0)'; }}>
                        <ZoomIn size={32} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '120px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={48} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    </div>
                  )}

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Award size={18} style={{ color: 'rgba(255,255,255,0.7)' }} />
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '2px 10px' }}>{cert.date}</span>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{cert.title}</h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{cert.issuer}</p>
                    {cert.credentialId && (
                      <p style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '3px 10px', alignSelf: 'flex-start' }}>
                        ID: {cert.credentialId}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 'auto' }}>
                      {cert.image && (
                        <button onClick={() => setLightboxCert(cert)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flex: 1, padding: '8px 0', fontSize: '12px', color: '#fff', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', cursor: 'pointer' }}>
                          <ZoomIn size={13} /> Lihat Foto
                        </button>
                      )}
                      {cert.link && (
                        <a href={cert.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flex: 1, padding: '8px 0', fontSize: '12px', color: '#fff', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', textDecoration: 'none' }}>
                          <ExternalLink size={13} /> Verifikasi
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          {lightboxCert && <CertLightbox src={lightboxCert.image} title={lightboxCert.title} onClose={() => setLightboxCert(null)} />}
        </>
      )}

      {/* ====== TAB 3: TECH STACK ====== */}
      {activeTab === 'techStack' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {techStack.map((group, gIdx) => (
            <Reveal key={gIdx} delay={gIdx * 100}>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '28px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px', color: '#fff' }}>{group.category}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                  {group.skills.map((skill, sIdx) => (
                    <div key={sIdx} style={{
                      padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    >
                      <TechLogo skillName={skill.name} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</span>
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
