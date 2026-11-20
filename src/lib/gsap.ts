import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

/** 동작 줄이기를 켜지 않은 사용자에게만 적용할 애니메이션 조건 */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, useGSAP };
