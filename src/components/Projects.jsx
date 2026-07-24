import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, Search, Star, FolderGit2 } from 'lucide-react';
import { IconGithub } from './Icons';

export const Projects = () => {
  const { data } = usePortfolio();
  const { projects = [] } = data;
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ['Semua', 'Featured'];
    projects.forEach(p => {
      if (p.category && !cats.includes(p.category)) {
        cats.push(p.category);
      }
    });
    return cats;
  }, [projects]);

  // Filter projects based on category & search query
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesCategory =
        selectedCategory === 'Semua' ? true :
        selectedCategory === 'Featured' ? project.featured :
        project.category === selectedCategory;

      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.tags && project.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="projects" style={{
      paddingTop: '72px',
      paddingBottom: '72px',
      borderBottom: '1px solid var(--color-border)'
    }}>
      <div className="container-vercel">
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FolderGit2 size={18} style={{ color: 'var(--color-secondary)' }} />
              <span className="label-sm" style={{ color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Karya & Portofolio
              </span>
            </div>
            <h2 className="headline-lg">Proyek Unggulan</h2>
          </div>

          {/* Search bar */}
          <div style={{ width: '100%', maxWidth: '280px', position: 'relative' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-secondary)'
            }} />
            <input
              type="text"
              placeholder="Cari proyek atau stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-vercel"
              style={{ paddingLeft: '36px', height: '38px', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Category Pill Filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '32px'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'button-primary' : 'button-secondary'}
              style={{
                height: '34px',
                padding: '0 14px',
                fontSize: '13px',
                borderRadius: 'var(--rounded-lg)'
              }}
            >
              {cat === 'Featured' && <Star size={13} style={{ marginRight: '2px' }} />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="card-vercel" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <p className="body-md" style={{ color: 'var(--color-secondary)' }}>
              Tidak ada proyek yang sesuai dengan kriteria pencarian "{searchQuery}".
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {filteredProjects.map(project => (
              <div key={project.id} className="card-vercel" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
              }}>
                <div>
                  {/* Category & Featured tag */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="label-sm" style={{ color: 'var(--color-secondary)' }}>
                      {project.category || 'Software'}
                    </span>
                    {project.featured && (
                      <span className="chip-vercel" style={{ fontSize: '11px', padding: '2px 8px' }}>
                        <Star size={10} fill="currentColor" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="headline-sm" style={{ marginBottom: '8px' }}>
                    {project.title}
                  </h3>
                  <p className="body-sm" style={{ marginBottom: '16px', color: 'var(--color-secondary)' }}>
                    {project.tagline || project.description}
                  </p>

                  {/* Detailed description if provided */}
                  {project.description && project.description !== project.tagline && (
                    <p className="body-sm" style={{ fontSize: '13px', marginBottom: '16px', opacity: 0.85 }}>
                      {project.description}
                    </p>
                  )}
                </div>

                <div>
                  {/* Tech Stack Chips */}
                  {project.tags && project.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="chip-vercel" style={{ fontSize: '11px', padding: '3px 8px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Links */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--color-border)'
                  }}>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button-primary"
                        style={{ height: '34px', padding: '0 12px', fontSize: '12px', flex: 1 }}
                      >
                        <span>Live Demo</span>
                        <ExternalLink size={13} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button-secondary"
                        style={{ height: '34px', padding: '0 12px', fontSize: '12px' }}
                        title="Source Code"
                      >
                        <IconGithub size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
