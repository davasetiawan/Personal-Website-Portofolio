import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { BackgroundEffect } from './components/BackgroundEffect';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Showcase } from './components/Showcase';
import { ContactSection } from './components/ContactSection';
import { EditDrawer } from './components/EditDrawer';

export function App() {
  return (
    <PortfolioProvider>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <BackgroundEffect />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Showcase />
          <ContactSection />
        </main>
        <EditDrawer />
      </div>
    </PortfolioProvider>
  );
}

export default App;
