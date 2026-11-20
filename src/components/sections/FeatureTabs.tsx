import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { features } from '../../data/content';
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap';
import { ButtonLink, Icon, SectionHead } from '../ui';
import { PhoneFrame } from '../phone/PhoneScreens';
import FeatureScreen from '../phone/FeatureScreens';

/** 알약 모양 탭 8개. 누르면 아래 큰 카드의 내용이 페이드·슬라이드로 바뀝니다. */
export default function FeatureTabs() {
  const [active, setActive] = useState(0);
  const prev = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const f = features[active];

  useGSAP(
    () => {
      if (prev.current === active) return;
      const dir = active > prev.current ? 1 : -1;
      prev.current = active;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-tab-anim]',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' },
        );
        gsap.fromTo('.feature-card__phone', { opacity: 0, x: 60 * dir }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' });
      });
      return () => mm.revert();
    },
    { dependencies: [active], scope: cardRef },
  );

  const select = (i: number) => {
    setActive(i);
    tabRefs.current[i]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  };

  // 메가메뉴에서 기능을 고르면 해당 탭을 엽니다
  useEffect(() => {
    const onSelect = (e: Event) => {
      const i = features.findIndex((ft) => ft.key === (e as CustomEvent<string>).detail);
      if (i >= 0) setActive(i);
    };
    window.addEventListener('select-feature', onSelect);
    return () => window.removeEventListener('select-feature', onSelect);
  }, []);

  // ←/→ 키로 탭 이동
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + features.length) % features.length;
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="features" className="panel panel--white">
      <div className="container stack-40">
        <SectionHead
          eyebrow="틈틈이 하는 일"
          title="선별부터 출처 확인까지 틈틈이 대신합니다"
          lead="바빠서 소식을 따라가기 어려운 직장인을 위해, 고르고 설명하고 근거를 붙이는 일을 대신합니다."
        />

        <div className="tabs" role="tablist" aria-label="기능" onKeyDown={onKeyDown} data-reveal>
          {features.map((ft, i) => (
            <button
              key={ft.key}
              ref={(el) => (tabRefs.current[i] = el)}
              type="button"
              role="tab"
              id={`tab-${ft.key}`}
              aria-selected={i === active}
              aria-controls="feature-panel"
              tabIndex={i === active ? 0 : -1}
              className={`tab${i === active ? ' is-active' : ''}`}
              onClick={() => select(i)}
            >
              <Icon name={ft.icon} size={16} />
              {ft.tab}
            </button>
          ))}
        </div>

        <div
          ref={cardRef}
          id="feature-panel"
          role="tabpanel"
          aria-labelledby={`tab-${f.key}`}
          className="feature-card"
          data-reveal
        >
          <div className="feature-card__copy">
            <span className="feature-card__icon" data-tab-anim>
              <Icon name={f.icon} size={26} />
            </span>
            <h3 className="feature-card__title" data-tab-anim>
              {f.title}
            </h3>
            <p className="feature-card__desc" data-tab-anim>
              {f.desc}
            </p>
            <ul className="checklist" data-tab-anim>
              {f.points.map((p) => (
                <li key={p}>
                  <span className="checklist__icon">
                    <Icon name="check" size={14} strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="button-row" data-tab-anim>
              <ButtonLink href="#download">앱 받기</ButtonLink>
              <ButtonLink href="#ai" variant="outline">
                작성 방식 보기
              </ButtonLink>
            </div>
          </div>
          <div className="feature-card__visual" aria-hidden="true">
            <div className="feature-card__phone">
              <PhoneFrame>
                <FeatureScreen feature={f.key} />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
