import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, Search, Star, FolderGit2, Github } from 'lucide-react';
import { Reveal } from '../hooks/useScrollReveal';

const btnPrimary = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  height: '38px',
  padding: '0 18px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#ffffff',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
  border: '1px solid rgba(255,255,255,0.25)',
  borderRadius: '12px',
  cursor: 'pointer',
  textDecoration: 'none',
  backdropFilter: 'blur(8px)',
  transition: 'all 0.2s ease',
  flex: 1,
};

const btnSecondary = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '38px',
  width: '38px',
  padding: '0',
  color: 'rgba(255,255,255,0.6)',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '12px',
  cursor: 'pointer',
  textDecoration: 'none',
  flexShrink: 0,
  transition: 'all 0.2s ease',
};

export const Projects = () => {
  const { data } = usePortfolio();
  const { projects = [] } = data;
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const cats = ['Semua'];
    projects.forEach(p => {
      if (p.category && !cats.includes(p.category)) cats.push(p.category);
    });
    return cats;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesCategory =
        selectedCategory === 'Semua' ? true :
        project.category === selectedCategory;

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        (project.title || '').toLowerCase().includes(searchLower) ||
        (project.description || '').toLowerCase().includes(searchLower) ||
        (project.tags || []).some(t => t.toLowerCase().includes(searchLower));

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="projects" style={{ padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <FolderGit2 size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace' }}>Karya & Portofolio</span>
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>Proyek Unggulan</h2>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
              <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Cari proyek atau stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  paddingLeft: '40px',
                  paddingRight: '14px',
                  fontSize: '13px',
                  color: '#fff',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        </Reveal>

        {/* Category Filter */}
        <Reveal delay={60}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '36px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  height: '34px',
                  padding: '0 16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: '10px',
                  border: selectedCategory === cat ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                  background: selectedCategory === cat ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: selectedCategory === cat ? '#fff' : 'rgba(255,255,255,0.45)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {cat === 'Featured' && <Star size={12} />}
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Project Cards */}
        {filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Tidak ada proyek yang ditemukan untuk "{searchQuery}".</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredProjects.map((project, idx) => (
              <Reveal key={project.id} delay={idx * 80}>
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'border-color 0.2s ease, transform 0.2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Project Image */}
                  {project.image && (
                    <div style={{ width: '100%', height: '180px', overflow: 'hidden', flexShrink: 0 }}>
                      <img
                        src={project.image}
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.parentElement.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
                    {/* Category + Featured */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
                        {project.category || 'Project'}
                      </span>
                      {project.featured && (
                        <span style={{ fontSize: '11px', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={11} fill="currentColor" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, flex: 1 }}>
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {project.tags.map((tag, i) => (
                          <span key={i} style={{
                            fontSize: '11px',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.55)',
                            fontFamily: 'monospace',
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 'auto' }}>
                      {project.demoUrl && project.demoUrl !== 'https://example.com' ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={btnPrimary}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
                        >
                          <ExternalLink size={14} />
                          <span>Live Demo</span>
                        </a>
                      ) : (
                        <span style={{ ...btnPrimary, opacity: 0.35, cursor: 'not-allowed', flex: 1 }}>
                          <ExternalLink size={14} />
                          <span>Belum Live</span>
                        </span>
                      )}

                      {project.githubUrl && project.githubUrl.includes('github.com') && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={btnSecondary}
                          title="Source Code di GitHub"
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                        >
                          <Github size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
