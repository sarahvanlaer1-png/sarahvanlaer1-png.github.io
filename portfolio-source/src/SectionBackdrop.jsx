import React, { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';

const MicroSlats = lazy(() => import('./MicroSlats'));
const PatternWaves = lazy(() => import('./PatternWaves'));
const MagnetLines = lazy(() => import('./MagnetLines'));

class BackgroundBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function SectionBackdrop({ kind }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '150px' });
    observer.observe(ref.current.parentElement);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`section-backdrop backdrop-${kind}`} aria-hidden="true">
    {visible && <BackgroundBoundary><Suspense fallback={null}>
      {kind === 'waves' && <PatternWaves preset="silk" color="#ff0000" backgroundColor="#000000" fade="bottom" interactive cursorSize={50} cursorStrength={0.6} spacing={6} light={-4} shine={0.7} contrast={1.6} speed={0.5} direction={0} fadeSize={0.1} />}
      {kind === 'magnet' && <MagnetLines lineColor="#a33a3f" accentColor="#ff4545" spacing={30} lineWidth={2} lineHeight={18} mode="orbit" shape="line" radius={300} fade={0.65} edgeFade={0.35} inertia={0.6} bounce={0.1} idle maxDevicePixelRatio={1.5} />}
      {kind === 'slats' && <MicroSlats preset="swell" color="#e92828" glintColor="#370909" backgroundColor="#000000" slatWidth={12} slatHeight={28} gap={4} roundness={0.75} interactive cursorStrength={1} cursorSize={40} swirl={0} trail={1.4} lean={0} intro scale={0.8} glint={0.4} speed={0.4} />}
    </Suspense></BackgroundBoundary>}
  </div>;
}
