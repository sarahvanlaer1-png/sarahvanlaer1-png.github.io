import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function usePortfolioMotion() {
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    let alive = true;
    media.add({ mobile: '(max-width: 759px)', desktop: '(min-width: 760px)' }, (context) => {
      document.documentElement.classList.add('motion-enabled');
      const mobile = context.conditions.mobile;
      const reveals = [];
      const opening = gsap.timeline({ paused: true, defaults: { ease: 'power4.inOut', immediateRender: false } });
      {
        opening
          .set('.opening-shutter', { visibility: 'visible', scaleY: 1 })
          .fromTo('.opening-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' })
          .to('.opening-rule', { autoAlpha: 0, duration: 0.3 }, 0.7)
          .to('.opening-shutter', { scaleY: 0, duration: 1.55, stagger: 0.12 }, 0.65)
          .from('.hero-reels', { scale: 1.16, duration: 2.4 }, 0.7)
          .from('.hero-name > span', { yPercent: 125, scaleX: 0.62, scaleY: 1.28, rotation: 5, transformOrigin: 'left bottom', duration: 1.75, stagger: 0.16, ease: 'power4.out', clearProps: 'transform' }, 1.05)
          .from('.hero-positioning', { clipPath: 'inset(0 100% 0 0)', x: -35, duration: 1.4, clearProps: 'clipPath,transform' }, 1.5)
          .from('.hero-value h2', { clipPath: 'inset(100% 0 0 0)', y: 65, duration: 1.5, clearProps: 'clipPath,transform' }, 1.55)
          .from('.hero-value > p', { y: 35, autoAlpha: 0, duration: 1.15, stagger: 0.13, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }, 1.95)
          .from('.site-header', { y: -22, autoAlpha: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity,visibility' }, 1.5)
          .set('.opening-shutter', { visibility: 'hidden' });
        reveals.push({ elements: [document.querySelector('.hero')], timeline: opening });
      }

      const hero = document.querySelector('.hero');
      ScrollTrigger.create({
        trigger: hero,
        start: 'top top+=120',
        end: 'bottom top+=120',
        onEnter: () => opening.restart(),
        onEnterBack: () => opening.restart()
      });
      // At the exact top ScrollTrigger may already be active before callbacks run.
      if (hero.getBoundingClientRect().top >= -120 && hero.getBoundingClientRect().top < innerHeight) opening.play(0);

      document.querySelectorAll('.motion-title').forEach(title => {
        const heading = title.nextElementSibling;
        const timeline = gsap.timeline({ scrollTrigger: { trigger: title, start: 'top 82%', toggleActions: 'restart none restart none' } });
        const section = title.closest('section')?.id;
        const titleStyles = {
          about: { xPercent: -105, scaleX: 1.15, transformOrigin: 'left center' },
          projects: { yPercent: 110, rotation: 0, clipPath: 'inset(0 100% 0 0)' },
          strengths: { rotationX: -85, yPercent: 35, transformPerspective: 900, transformOrigin: 'center bottom' },
          contact: { scale: 1.65, yPercent: 25, autoAlpha: 0, transformOrigin: 'center center' }
        };
        timeline.from(title.querySelector('span'), {
          ...(titleStyles[section] || titleStyles.projects), duration: 1.8,
          ease: 'power4.out', clearProps: 'transform,clipPath,opacity,visibility'
        });
        if (heading?.matches('.section-heading, h2')) timeline.from(heading, {
          ...(section === 'about' ? { x: 65 } : section === 'contact' ? { scale: 0.88, y: 25 } : { y: 40 }),
          clipPath: section === 'about' ? 'inset(0 100% 0 0)' : 'inset(100% 0 0 0)',
          duration: 1.3, ease: 'power3.inOut', clearProps: 'transform,clipPath'
        }, 0.3);
        reveals.push({ elements: [title, heading].filter(Boolean), timeline });
      });

      const groups = [
        ['.about-card-layout', '.about-glow'], ['.about-stats', ':scope > .about-glow'],
        ['.social-grid', ':scope > .social-glow'], ['.strength-grid', ':scope > .strength-glow']
      ];
      groups.forEach(([parent, selector]) => {
        const group = document.querySelector(parent);
        if (!group) return;
        const elements = [...group.querySelectorAll(selector)];
        const timeline = gsap.timeline({ scrollTrigger: { trigger: group, start: 'top 82%', toggleActions: 'restart none restart none' } });
        const presets = {
          '.about-card-layout': { x: i => (i % 2 ? 1 : -1) * (mobile ? 35 : 100), scaleX: 0.88, transformOrigin: 'center center' },
          '.about-stats': { scaleY: 0.3, y: 20, transformOrigin: 'center bottom' },
          '.social-grid': { x: mobile ? 40 : 110, rotation: -4, transformOrigin: 'left bottom' },
          '.strength-grid': { rotationY: mobile ? -30 : -65, z: -100, transformPerspective: 1100, transformOrigin: 'left center' }
        };
        timeline.from(elements, { ...presets[parent], autoAlpha: 0, duration: 1.6,
          stagger: parent === '.strength-grid' ? 0.23 : 0.17, delay: 0.3, ease: 'power4.out',
          clearProps: 'transform,opacity,visibility' });
        reveals.push({ elements, timeline });
      });

      document.querySelectorAll('.project').forEach(project => {
        const visual = project.querySelector('.project-visual');
        const timeline = gsap.timeline({ scrollTrigger: { trigger: project, start: 'top 82%', toggleActions: 'restart none restart none' } });
        timeline.from(visual, { clipPath: 'inset(0 0 100% 0 round 18px)', y: 70, duration: 1.7,
          ease: 'power4.inOut', clearProps: 'clipPath,transform' })
          .from(project.querySelector('.project-info'), { y: 40, autoAlpha: 0, duration: 1.1,
            ease: 'power3.out', clearProps: 'transform,opacity,visibility' }, 0.65);
        reveals.push({ elements: [project], timeline });
        if (!mobile) gsap.fromTo(visual.querySelector('img'), { yPercent: -4, scale: 1.12 }, {
          yPercent: 4, scale: 1.12, ease: 'none', scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
        });
      });
      const reel = document.querySelector('.video-reel');
      if (reel) {
        const timeline = gsap.from(reel, { scaleX: 0.75, scaleY: 0.9, autoAlpha: 0, duration: 1.8, ease: 'power4.out',
          clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: reel, start: 'top 82%', toggleActions: 'restart none restart none' } });
        reveals.push({ elements: [reel], timeline });
      }
      let pendingSection = null;
      let navTimer;
      const replayDestination = () => {
        if (!pendingSection) return;
        const id = pendingSection;
        pendingSection = null;
        clearTimeout(navTimer);
        if (id === 'home') { opening.restart(); return; }
        reveals.forEach(({elements, timeline}) => {
          if (timeline === opening) return;
          if (elements.some(el => {
            const rect = el.getBoundingClientRect();
            return el.closest('section')?.id === id && rect.top < innerHeight && rect.bottom > 70;
          })) timeline.restart();
        });
      };
      const onNav = e => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        pendingSection = link.getAttribute('href').slice(1);
        clearTimeout(navTimer);
        navTimer = setTimeout(replayDestination, 1000);
      };
      document.addEventListener('click', onNav);
      document.addEventListener('scrollend', replayDestination);
      const revealFocus = e => reveals.forEach(({ elements, timeline }) => {
        if (elements.some(el => el.contains(e.target))) timeline.progress(1);
      });
      document.addEventListener('focusin', revealFocus);
      return () => { clearTimeout(navTimer); document.removeEventListener('click', onNav); document.removeEventListener('scrollend', replayDestination); document.removeEventListener('focusin', revealFocus); document.documentElement.classList.remove('motion-enabled'); };
    });
    document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    return () => { alive = false; media.revert(); };
  }, []);
}
