import React, { useEffect, useRef } from 'react';

export const BackgroundEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create subtle particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -10, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Glow Blur Spheres */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          filter: 'blur(90px)',
          opacity: 0.12
        }} />
        <div style={{
          position: 'absolute',
          top: '40px',
          right: '40px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          backgroundColor: '#A1A1AA',
          filter: 'blur(100px)',
          opacity: 0.1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          backgroundColor: '#71717A',
          filter: 'blur(110px)',
          opacity: 0.12
        }} />
        <div style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          filter: 'blur(100px)',
          opacity: 0.08
        }} />
      </div>

      {/* Grid Lines Overlay */}
      <div className="bg-grid-pattern" style={{ position: 'absolute', inset: 0 }} />

      {/* Interactive Particles Canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />
    </div>
  );
};
