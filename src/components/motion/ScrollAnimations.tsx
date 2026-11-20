import { gsap, MOTION_OK, ScrollTrigger, SplitText, useGSAP } from '../../lib/gsap';

/**
 * 사이트 전체 스크롤 애니메이션 (렌더링 없음, App의 맨 뒤에 둠)
 *
 * 1. 큰 제목(.display[data-reveal]) — 줄 단위로 마스크 안에서 밀려 올라오며 등장 (SplitText)
 *    그라디언트 글자가 들어 있는 제목은 줄로 쪼개면 그라디언트가 끊기므로 2번 방식으로 처리
 * 2. 나머지 [data-reveal] — opacity 0 → 1, y 30 → 0 으로 순차 등장
 * 3. 섹션 카드(.panel) — 들어올 때 살짝 작은 상태에서 제 크기로 커짐 (scrub)
 * 4. 상단 진행 막대 — 페이지를 얼마나 읽었는지 표시
 *
 * 각 섹션 고유의 애니메이션(히어로 등장, 숫자 카운트업, 고정 무대, 패럴랙스 등)은 해당 컴포넌트에 있습니다.
 * data-speed / data-lag 패럴랙스는 ScrollSmoother(effects: true)가 처리합니다.
 */
export default function ScrollAnimations() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      /* 1. 줄 단위 제목 */
      const lineHeads = gsap.utils
        .toArray<HTMLElement>('.display[data-reveal]')
        .filter((el) => !el.querySelector('.gradient-text'));
      const splits = lineHeads.map((el) =>
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true, // 글꼴 로드·화면 폭 변경 시 다시 나눔
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1,
              ease: 'power4.out',
              stagger: 0.09,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }),
        }),
      );

      /* 2. 순차 등장 */
      const fades = gsap.utils.toArray<HTMLElement>('[data-reveal]').filter((el) => !lineHeads.includes(el));
      gsap.set(fades, { opacity: 0, y: 30 });
      ScrollTrigger.batch(fades, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, overwrite: true }),
      });

      /* 3. 섹션 카드가 커지며 들어옴 (히어로, 겹쳐 올라오는 카드, 고정 무대, 푸터 제외) */
      gsap.utils
        .toArray<HTMLElement>('.panel:not(.hero):not(.panel--overlap):not(.steps-pin):not(.footer)')
        .forEach((panel) => {
          gsap.fromTo(
            panel,
            { scale: 0.94, transformOrigin: '50% 0%' },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top 45%', scrub: true },
            },
          );
        });

      /* 4. 읽은 정도 막대 */
      gsap.fromTo(
        '.nav__progress > span',
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } },
      );

      return () => splits.forEach((s) => s.revert());
    });

    // 글꼴이 로드되면 높이가 바뀌므로 위치를 다시 계산
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  });

  return null;
}
