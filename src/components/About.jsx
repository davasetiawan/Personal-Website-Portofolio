import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Reveal } from '../hooks/useScrollReveal';
import { MapPin, Mail, Sparkles, Heart, Coffee } from 'lucide-react';

const DEFAULT_ABOUT = {
  sectionTitle: 'Tentang Saya',
  description: 'Hai! Saya Mohammad Dava Setiawan, seorang Frontend Developer yang passionate dalam menciptakan pengalaman digital yang indah, responsif, dan intuitif. Saya percaya bahwa desain yang baik bukan hanya soal estetika, tetapi juga tentang bagaimana pengguna merasakan dan berinteraksi dengan produk.',
  longBio: 'Dengan pengalaman di React.js, Next.js, TypeScript, dan Tailwind CSS, saya membangun antarmuka yang tidak hanya memukau secara visual tetapi juga berkinerja tinggi. Saya selalu bersemangat untuk belajar teknologi baru dan menghadirkan solusi kreatif untuk setiap tantangan.',
  location: 'Indonesia',

  interests: ['Web Development', 'UI/UX Design', 'Open Source', 'Problem Solving'],
};

export const About = () => {
  const { data } = usePortfolio();
  const { personal } = data;
  const about = data.about || DEFAULT_ABOUT;

  return (
    <section id="about" style={{
      width: '100%',
      maxWidth: '1350px',
      margin: '0 auto',
      padding: '96px 24px',
      color: '#FFFFFF'
    }}>
      {/* Section Title */}
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800,
            marginBottom: '12px',
            letterSpacing: '-0.02em'
          }}>
            {about.sectionTitle || 'Tentang Saya'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', fontSize: '15px' }}>
            Kenali lebih dekat siapa saya dan apa yang saya kerjakan.
          </p>
        </div>
      </Reveal>

      {/* Main Content: Photo + Bio */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '48px',
        alignItems: 'start',
        marginBottom: '64px'
      }}>
        {/* LEFT: Profile Photo */}
        <Reveal delay={80}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            {/* Photo Container */}
            <div className="glass-card" style={{
              padding: '8px',
              borderRadius: '28px',
              width: '100%',
              maxWidth: '340px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Subtle glass top accent border */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'rgba(255, 255, 255, 0.25)',
                borderRadius: '28px 28px 0 0'
              }} />

              <div style={{
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: '22px',
                overflow: 'hidden',
                backgroundColor: 'rgba(0,0,0,0.6)'
              }}>
                <img
                  src={personal.avatar || '/public/WhatsApp Image 2026-07-24 at 21.14.56.jpeg'}
                  alt={personal.name || 'Profile'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              {/* Name overlay */}
              <div style={{
                padding: '16px 12px 10px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                  {personal.name || 'Mohammad Dava Setiawan'}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.1em',
                  marginTop: '4px'
                }}>
                  {personal.titleLine1} {personal.titleLine2}
                </p>
              </div>
            </div>

            {/* Quick Info Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '340px' }}>
              {personal.email && (
                <div className="glass-card" style={{
                  padding: '12px 18px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Mail size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {personal.email}
                  </span>
                </div>
              )}
              {about.location && (
                <div className="glass-card" style={{
                  padding: '12px 18px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <MapPin size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {about.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* RIGHT: Bio Text + Interests */}
        <Reveal delay={160}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* About description */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '3px',
                  height: '24px',
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: '2px'
                }} />
                <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Halo, Saya Dava!</h3>
              </div>

              <p style={{
                fontSize: '15px',
                lineHeight: '1.9',
                color: 'var(--text-secondary)',
                marginBottom: '16px'
              }}>
                {about.description}
              </p>

              {about.longBio && (
                <p style={{
                  fontSize: '14px',
                  lineHeight: '1.9',
                  color: 'var(--text-muted)'
                }}>
                  {about.longBio}
                </p>
              )}
            </div>

            {/* Interests */}
            {about.interests && about.interests.length > 0 && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <Sparkles size={14} style={{ color: 'rgba(255,255,255,0.6)' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                    INTERESTS
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {about.interests.map((interest, idx) => (
                    <span key={idx} className="mono-tag" style={{ fontSize: '12px' }}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Fun facts */}
            <div className="glass-card" style={{
              padding: '20px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}>
              <Coffee size={18} style={{ color: 'rgba(255,255,255,0.7)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
                  Fun Fact
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                  Saya paling produktif saat ditemani kopi dan musik lo-fi. Clean code bukan hanya tentang fungsi—ini tentang keindahan!
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>


    </section>
  );
};
