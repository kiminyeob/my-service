import { useRef } from 'react';
import { stats } from '../../data/content';
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap';
import { SectionHead } from '../ui';

/** 큰 숫자 강조. 화면에 들어오면 0부터 세어 올라갑니다. */
export default function Numbers() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
          const target = Number(el.dataset.count);
          const counter = { v: 0 };
          el.textContent = '0';
          gsap.to(counter, {
            v: target,
            duration: target > 10 ? 1.8 : 0.9,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(counter.v));
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="panel panel--surface">
      <div className="container stack-40">
        <SectionHead title="AI 변화에 대한 불안은 크지만, 무엇을 봐야 하는지 알려 주는 곳은 드뭅니다" />
        <div className="numbers">
          {stats.map((s) => (
            <div key={s.body} className="number" data-reveal>
              <span className="number__value">
                <span data-count={s.value}>{s.value}</span>
                <span className="number__suffix">{s.suffix}</span>
              </span>
              <p className="number__body">{s.body}</p>
              <span className="number__source">{s.source}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
