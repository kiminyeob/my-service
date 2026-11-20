import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother, SplitText, useGSAP);

/** 동작 줄이기를 켜지 않은 사용자에게만 적용할 애니메이션 조건 */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 고정 내비게이션 높이 + 페이지 여백 (고정 무대·앵커 이동의 기준선) */
export const navOffset = () => {
  const nav = document.querySelector<HTMLElement>('.nav');
  const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--page-gap')) || 12;
  return (nav?.offsetHeight ?? 72) + gap;
};

/** 코드로 일으킨 스크롤 시각 — 섹션 스냅이 그 직후에는 끼어들지 않도록 */
export const scrollState = { lastProgrammatic: 0 };

/**
 * 페이지 안 위치로 스크롤. ScrollSmoother가 켜져 있으면 그것으로, 아니면 window 스크롤로 이동합니다.
 * target: 요소(내비게이션 아래에 맞춤) 또는 스크롤 위치(px)
 */
export function scrollToTarget(target: Element | number) {
  scrollState.lastProgrammatic = performance.now();
  const smoother = ScrollSmoother.get();
  if (smoother) {
    if (typeof target === 'number') smoother.scrollTo(target, true);
    else smoother.scrollTo(target, true, `top ${navOffset()}px`);
    return;
  }
  gsap.to(window, {
    scrollTo: { y: target, offsetY: typeof target === 'number' ? 0 : navOffset(), autoKill: true },
    duration: prefersReducedMotion() ? 0 : 0.9,
    ease: 'power3.inOut',
  });
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, useGSAP };
