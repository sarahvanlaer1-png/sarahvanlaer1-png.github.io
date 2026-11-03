import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
const GradientASCII = lazy(() => import('./GradientASCII'));
const colors = ['#f60000', '#f60000', '#ef4444', '#ef4444'];
export default function DeferredASCII() {
  const root = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    observer.observe(root.current.parentElement);
    return () => observer.disconnect();
  }, []);
  return <div ref={root} style={{ width:'100%', height:'100%' }}>
    {visible && <Suspense fallback={null}><GradientASCII colors={colors} shape="horizon" characters=" =+xX0S8#@" cellSize={18} density={0.38} glyphOpacity={0.33} softness={1} gradientOpacity={0.34} dpr={1}/></Suspense>}
  </div>;
}
