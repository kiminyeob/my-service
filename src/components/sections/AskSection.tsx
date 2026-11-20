import { useRef } from 'react';
import { differences, questions } from '../../data/content';
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap';
import { Brand } from '../ui';

/**
 * 다크 섹션: "묻지 않아도 먼저 알려 줍니다"
 * - 오로라 글로우, 가운데 빛나는 구체 (CSS 애니메이션)
 * - 예시 질문 말풍선이 기울어진 채 스크롤에 맞춰 하나씩 떠오름
 * - 커서를 따라 구체·글로우·말풍선이 살짝 반응
 */
export default function AskSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const section = ref.current;
      if (!section || !contextSafe) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('.bubble', {
          opacity: 0,
          y: 60,
          scale: 0.85,
          stagger: 0.25,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.bubbles', start: 'top 85%', end: 'bottom 55%', scrub: 1 },
        });

        const orbX = gsap.quickTo('.orb', 'x', { duration: 0.8, ease: 'power3.out' });
        const orbY = gsap.quickTo('.orb', 'y', { duration: 0.8, ease: 'power3.out' });
        const glowX = gsap.quickTo('.aurora', 'x', { duration: 1.6, ease: 'power3.out' });
        const glowY = gsap.quickTo('.aurora', 'y', { duration: 1.6, ease: 'power3.out' });
        const bubX = gsap.quickTo('.bubbles', 'x', { duration: 1, ease: 'power3.out' });

        const onMove = contextSafe((e: PointerEvent) => {
          const r = section.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          orbX(nx * 40);
          orbY(ny * 30);
          glowX(nx * 120);
          glowY(ny * 80);
          bubX(nx * -18);
        });
        const onLeave = contextSafe(() => {
          orbX(0);
          orbY(0);
          glowX(0);
          glowY(0);
          bubX(0);
        });
        section.addEventListener('pointermove', onMove);
        section.addEventListener('pointerleave', onLeave);
        return () => {
          section.removeEventListener('pointermove', onMove);
          section.removeEventListener('pointerleave', onLeave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="panel panel--ink ask" data-nav="dark">
      <div className="aurora" aria-hidden="true">
        <span className="aurora__blob aurora__blob--1" />
        <span className="aurora__blob aurora__blob--2" />
        <span className="aurora__blob aurora__blob--3" />
      </div>

      <div className="container ask__inner">
        <div className="orb" aria-hidden="true">
          <span className="orb__core" />
          <span className="orb__ring" />
        </div>
        <div className="section-head section-head--center">
          <span className="eyebrow eyebrow--light" data-reveal>
            AI 챗봇과 무엇이 다른가
          </span>
          <h2 className="display display--xl" data-reveal>
            무엇을 물어야 할지 몰라도 괜찮습니다
          </h2>
          <p className="lead lead--light" data-reveal>
            AI 챗봇은 질문을 해야 답을 줍니다. <Brand />은 무엇을 물어야 할지 모르는 단계에서도 필요한 소식을 먼저
            전합니다.
          </p>
        </div>

        <ul className="bubbles" aria-label="틈틈은 이런 질문에 먼저 답합니다">
          {questions.map((q, i) => (
            <li key={q} className={`bubble bubble--${i + 1}`}>
              {q}
            </li>
          ))}
        </ul>

        <div className="ask__points">
          {differences.map((d) => (
            <div key={d.title} className="glass-card" data-reveal>
              <h3 className="glass-card__title">{d.title}</h3>
              <p className="glass-card__body">{d.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
