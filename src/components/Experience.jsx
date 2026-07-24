import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

export const Experience = () => {
  const { data } = usePortfolio();
  const { experience = [] } = data;

  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" style={{
      paddingTop: '72px',
      paddingBottom: '72px',
      borderBottom: '1px solid var(--color-border)'
    }}>
      <div className="container-vercel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Briefcase size={18} style={{ color: 'var(--color-secondary)' }} />
          <span className="label-sm" style={{ color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Rekam Jejak Karir
          </span>
        </div>
        <h2 className="headline-lg" style={{ marginBottom: '40px' }}>
          Pengalaman Kerja
        </h2>

        {/* Timeline Container */}
        <div style={{
          position: 'relative',
          paddingLeft: '24px',
          borderLeft: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px'
        }}>
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} style={{ position: 'relative' }}>
              {/* Node Bullet on Timeline */}
              <div style={{
                position: 'absolute',
                left: '-29px',
                top: '4px',
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                outline: '4px solid var(--color-neutral)'
              }} />

              {/* Header Info */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '6px'
              }}>
                <h3 className="headline-xs">
                  {exp.role} <span style={{ color: 'var(--color-secondary)', fontWeight: 400 }}>di</span> {exp.company}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {exp.period && (
                    <span className="label-sm" style={{
                      color: 'var(--color-secondary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Calendar size={12} /> {exp.period}
                    </span>
                  )}
                  {exp.location && (
                    <span className="chip-vercel" style={{ fontSize: '11px', padding: '2px 8px' }}>
                      <MapPin size={10} /> {exp.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="body-md" style={{ marginBottom: '14px', maxWidth: '780px' }}>
                {exp.description}
              </p>

              {/* Tech Stack Chips */}
              {exp.technologies && exp.technologies.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {exp.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="chip-vercel" style={{ fontSize: '11px', padding: '2px 8px' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
