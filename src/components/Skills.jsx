import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Cpu } from 'lucide-react';

export const Skills = () => {
  const { data } = usePortfolio();
  const { skills } = data;

  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" style={{
      paddingTop: '72px',
      paddingBottom: '72px',
      borderBottom: '1px solid var(--color-border)'
    }}>
      <div className="container-vercel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Cpu size={18} style={{ color: 'var(--color-secondary)' }} />
          <span className="label-sm" style={{ color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Teknologi & Stack
          </span>
        </div>
        <h2 className="headline-lg" style={{ marginBottom: '40px' }}>
          Keahlian Teknikal
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {skills.map((group, idx) => (
            <div key={idx} className="card-vercel" style={{ padding: '24px' }}>
              <h3 className="headline-xs" style={{ marginBottom: '16px' }}>
                {group.category}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {group.items.map((skill, sIdx) => (
                  <div key={sIdx} className="chip-vercel" style={{ fontSize: '13px', padding: '6px 14px' }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-secondary)',
                      opacity: 0.5
                    }} />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
