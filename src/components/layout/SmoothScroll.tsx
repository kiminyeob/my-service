import type { ReactNode } from 'react';
import { gsap, MOTION_OK, ScrollSmoother, useGSAP } from '../../lib/gsap';

/**
 * ScrollSmoother로 페이지 스크롤을 부드럽게 만듭니다.
 *
 * - <SmoothContent> 안(#smooth-wrapper > #smooth-content)의 내용이 부드럽게 따라옵니다.
 *   position: fixed 요소(내비게이션, 하단 "앱 받기", 메뉴)는 이 바깥에 두어야 합니다.
 *   이 안에서는 position: sticky 가 동작하지 않으므로 고정 무대는 ScrollTrigger pin 으로 만듭니다.
 * - effects: true → 요소에 data-speed / data-lag 를 주면 패럴랙스가 걸립니다.
 * - 동작 줄이기 설정에서는 만들지 않고 기본 스크롤을 씁니다.
 *
 * ScrollSmoother는 다른 ScrollTrigger보다 먼저 만들어져야 합니다. React는 자식 → 부모 순,
 * 형제는 앞 → 뒤 순으로 레이아웃 효과를 실행하므로 <SmoothScroller />를 App의 맨 앞 형제로 둡니다.
 * (DOM은 효과 실행 전에 모두 붙어 있으므로 #smooth-wrapper 를 찾을 수 있습니다.)
 */
export function SmoothScroller() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 0.55, // 휠을 멈춘 뒤 따라오는 시간(초). 크면 버튼이 손 밑에서 밀려나므로 짧게
        smoothTouch: 0.1,
        effects: true,
      });
      return () => smoother.kill();
    });
    return () => mm.revert();
  });
  return null;
}

export function SmoothContent({ children }: { children: ReactNode }) {
  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
