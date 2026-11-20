import { gsap, MOTION_OK, navOffset, ScrollSmoother, scrollState, ScrollTrigger, SplitText, useGSAP } from '../../lib/gsap';

/**
 * 사이트 전체 스크롤 애니메이션 (렌더링 없음, App의 맨 뒤에 둠)
 *
 * 1. 큰 제목(.display[data-reveal]) — 줄 단위로 마스크 안에서 밀려 올라오며 등장 (SplitText)
 *    그라디언트 글자가 들어 있는 제목은 줄로 쪼개면 그라디언트가 끊기므로 2번 방식으로 처리
 * 2. 나머지 [data-reveal] — opacity 0 → 1, y 30 → 0 으로 순차 등장
 * 3. 섹션 카드 — 들어올 때 살짝 작은 상태에서 제 크기로 커짐 (scrub)
 * 4. 섹션 스냅 — 자석처럼: 스크롤을 멈춘 곳이 섹션 시작점 가까이(화면 높이의 22% 이내)면 그 시작점으로
 *    부드럽게 끌어당김. 그 밖(긴 섹션 중간 등)에서는 그대로 둠. 세 단계 고정 무대 안에서는 단계마다 맞춤.
 * 5. 상단 진행 막대 — 페이지를 얼마나 읽었는지 표시
 *
 * 각 섹션 고유의 애니메이션(히어로 등장, 숫자 카운트업, 세 단계 고정 무대, 패럴랙스 등)은 해당 컴포넌트에 있습니다.
 * data-speed / data-lag 패럴랙스는 ScrollSmoother(effects: true)가 처리합니다.
 */

const SNAP_RANGE = 0.22; // 화면 높이 대비, 이 거리 안에서 멈추면 스냅 (클수록 세게 붙음)
const STEP_SNAPS = [0.5, 0.84]; // 세 단계 고정 무대 안: 2단계·3단계 구간의 가운데 (1단계는 고정 시작점 = 섹션 시작점)

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

      /* 3. 섹션 카드가 들어올 때 살짝 작은 상태에서 제 크기로 (히어로, 겹쳐 올라오는 카드, 세 단계, 푸터 제외) */
      const panels = gsap.utils.toArray<HTMLElement>('.page > .panel');
      gsap.utils
        .toArray<HTMLElement>('.page > .panel:not(.hero):not(.panel--overlap):not(.steps-pin):not(.footer)')
        .forEach((panel) => {
          gsap.fromTo(
            panel,
            { scale: 0.94, transformOrigin: '50% 0%' },
            { scale: 1, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top 45%', scrub: true } },
          );
        });

      /* 4. 섹션 스냅 (자석처럼 살짝) */
      const sectionStarts = panels.map((panel) =>
        ScrollTrigger.create({ trigger: panel, start: () => `top top+=${navOffset()}`, invalidateOnRefresh: true }),
      );
      const snapPoints = () => {
        const points = [0, ...sectionStarts.map((st) => st.start)];
        const steps = ScrollTrigger.getById('steps-pin');
        if (steps) STEP_SNAPS.forEach((f) => points.push(steps.start + (steps.end - steps.start) * f));
        return points;
      };
      // ScrollTrigger의 snap 옵션은 ScrollSmoother와 함께 쓰면 스크롤이 0으로 튀는 경우가 있어,
      // 스크롤이 멈출 때(scrollEnd) 직접 가장 가까운 지점을 찾아 smoother로 옮깁니다.
      let snapping = false;
      // 키보드로 초점을 옮겨 생긴 스크롤은 스냅하지 않음 (초점 받은 요소가 화면 밖으로 밀려나지 않도록)
      let lastFocusAt = 0;
      const onFocusIn = () => {
        lastFocusAt = performance.now();
      };
      document.addEventListener('focusin', onFocusIn);
      const onScrollEnd = () => {
        if (snapping) {
          snapping = false; // 우리가 일으킨 스크롤이 끝난 것
          return;
        }
        if (performance.now() - lastFocusAt < 1500) return;
        // 메뉴 링크·단계 버튼으로 이동한 직후에는 그 위치를 존중
        if (performance.now() - scrollState.lastProgrammatic < 1500) return;
        const smoother = ScrollSmoother.get();
        if (!smoother || smoother.paused()) return;
        // smoother.scrollTop()은 화면이 따라오는 중인 위치라 목표보다 뒤처져 있음 → 실제 목표 위치(window.scrollY)를 씀
        const y = window.scrollY;
        let best: number | null = null;
        let dist = window.innerHeight * SNAP_RANGE;
        for (const p of snapPoints()) {
          const d = Math.abs(p - y);
          if (d < dist) {
            dist = d;
            best = p;
          }
        }
        if (best === null || dist < 2) return;
        snapping = true;
        smoother.scrollTo(Math.max(0, best), true);
      };
      ScrollTrigger.addEventListener('scrollEnd', onScrollEnd);

      /* 5. 읽은 정도 막대 */
      gsap.fromTo(
        '.nav__progress > span',
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } },
      );

      return () => {
        ScrollTrigger.removeEventListener('scrollEnd', onScrollEnd);
        document.removeEventListener('focusin', onFocusIn);
        splits.forEach((s) => s.revert());
      };
    });

    // 글꼴이 로드되면 높이가 바뀌므로 위치를 다시 계산
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  });

  return null;
}
