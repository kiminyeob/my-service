import { useEffect } from 'react';
import { scrollToTarget } from './lib/gsap';
import { SmoothContent, SmoothScroller } from './components/layout/SmoothScroll';
import ScrollAnimations from './components/motion/ScrollAnimations';
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
  useEffect(() => {
    // 페이지 안 링크(#...)는 부드럽게 스크롤 (고정 내비게이션 아래에 맞춤)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute('href')!;
      const target = hash === '#top' ? 0 : document.querySelector(hash);
      if (target === null) return;
      e.preventDefault();
      scrollToTarget(target);
      history.replaceState(null, '', hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      {/* ScrollSmoother를 가장 먼저 만들기 위해 맨 앞에 둡니다 */}
      <SmoothScroller />
      {/* position: fixed 요소는 부드러운 스크롤 영역 바깥에 둡니다 */}
      <Header />
      <SmoothContent>
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
      </SmoothContent>
      <MobileCta />
      {/* 공통 스크롤 애니메이션은 모든 섹션이 준비된 뒤에 만듭니다 */}
      <ScrollAnimations />
    </>
  );
}
