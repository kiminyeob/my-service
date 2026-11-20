import { useEffect } from 'react';
import { gsap, MOTION_OK, prefersReducedMotion, ScrollTrigger, useGSAP } from './lib/gsap';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileCta from './components/layout/MobileCta';
import Hero from './components/sections/Hero';
import FeatureTabs from './components/sections/FeatureTabs';
import Numbers from './components/sections/Numbers';
import IssuesShowcase from './components/sections/IssuesShowcase';
import Steps from './components/sections/Steps';
import AiAccordion from './components/sections/AiAccordion';
import AskSection from './components/sections/AskSection';
import Transparency from './components/sections/Transparency';
import Testimonials from './components/sections/Testimonials';
import Story from './components/sections/Story';
import DownloadCta from './components/sections/DownloadCta';
import Faq from './components/sections/Faq';

export default function App() {
  // 공통: 뷰포트에 들어오면 opacity 0 → 1, y 30 → 0 으로 순차 등장
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.set('[data-reveal]', { opacity: 0, y: 30 });
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, overwrite: true }),
      });
    });
    return () => mm.revert();
  });

  useEffect(() => {
    // 글꼴이 로드되면 높이가 바뀌므로 스크롤 트리거 위치를 다시 계산
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // 페이지 안 링크(#...)는 부드럽게 스크롤 (고정 내비게이션 높이만큼 띄움)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute('href')!;
      const target = hash === '#top' ? 0 : document.querySelector(hash);
      if (target === null) return;
      e.preventDefault();
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 84, autoKill: true },
        duration: prefersReducedMotion() ? 0 : 0.9,
        ease: 'power3.inOut',
      });
      history.replaceState(null, '', hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <Header />
      <main className="page">
        <Hero />
        <FeatureTabs />
        <Numbers />
        <IssuesShowcase />
        <Steps />
        <AiAccordion />
        <AskSection />
        <Transparency />
        <Testimonials />
        <Story />
        <DownloadCta />
        <Faq />
        <Footer />
      </main>
      <MobileCta />
    </>
  );
}
