import { useRef } from 'react';
import { picked, sourceTypes } from '../../data/content';
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap';
import { ButtonLink, Icon, Sparkle } from '../ui';
import { BriefingHomeScreen, PhoneFrame } from '../phone/PhoneScreens';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // 페이지 로드 시 순차 페이드업 + 떠 있는 카드·반짝이 반복 움직임
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('[data-hero]', { opacity: 0, y: 30, duration: 0.8, stagger: 0.08 })
          .from('.hero__phone', { opacity: 0, y: 80, scale: 0.94, duration: 1 }, 0.15)
          .from('.hero__float', { opacity: 0, scale: 0.85, y: 24, duration: 0.7, stagger: 0.12 }, 0.55)
          .from('.hero__sparkle', { opacity: 0, scale: 0, rotate: -90, duration: 0.6, stagger: 0.08 }, 0.7)
          .from('.marquee', { opacity: 0, y: 20, duration: 0.6 }, 0.8);

        gsap.to('.hero__float--a', { y: -10, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.3 });
        gsap.to('.hero__float--b', { y: 10, duration: 3.1, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 });
        gsap.utils.toArray<HTMLElement>('.hero__sparkle').forEach((el, i) => {
          gsap.to(el, { scale: 0.55, opacity: 0.4, rotate: 45, duration: 1.4 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.4 + i * 0.2 });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="top" ref={ref} className="panel panel--surface hero">
      <div className="container hero__grid">
        <div className="hero__copy">
          <span className="eyebrow" data-hero>
            틈틈: AI 이슈 브리핑
          </span>
          <h1 className="hero__title" data-hero>
            쏟아지는 AI 소식 가운데 <em>내 업무에 필요한 것만</em> 골라 전합니다
          </h1>
          <p className="hero__lead" data-hero>
            한 주 동안 나온 AI 소식 중 내 업무와 관련된 것을 선별해 매주 브리핑으로 전합니다. 소식마다 내 업무에 어떤 의미인지
            설명하고, 근거가 된 원문을 함께 제공합니다.
          </p>
          <div className="button-row" data-hero>
            <ButtonLink href="#download">
              무료로 시작하기 <Icon name="arrowRight" size={18} />
            </ButtonLink>
            <ButtonLink href="#features" variant="outline">
              기능 둘러보기
            </ButtonLink>
          </div>
          <span className="hero__note" data-hero>
            읽는 데는 10분 정도면 충분합니다.
          </span>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__glow" />
          <div className="hero__phone">
            <PhoneFrame>
              <BriefingHomeScreen />
            </PhoneFrame>
          </div>

          {/* 떠 있는 앱 UI 조각: 이번 주 읽을 소식 */}
          <div className="hero__float hero__float--a ui-card">
            <span className="ui-card__label">이번 주 읽을 소식</span>
            <ul className="todo">
              {picked.map((p, i) => (
                <li key={p.title} className={`todo__item${i === 0 ? ' is-done' : ''}`}>
                  <span className="todo__box">{i === 0 && <Icon name="check" size={12} strokeWidth={3} />}</span>
                  <span className="todo__text">{p.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 떠 있는 앱 UI 조각: 관심 이슈별 이번 주 상태 */}
          <div className="hero__float hero__float--b ui-card">
            <span className="ui-card__label">관심 이슈</span>
            <div className="issue-meter">
              <div className="issue-meter__row">
                <span>AI 규제와 정책</span>
                <span className="badge badge--amber">알아 둘 변화</span>
              </div>
              <div className="issue-meter__bar">
                <span style={{ width: '82%' }} />
              </div>
              <div className="issue-meter__row">
                <span>업무용 AI 도구</span>
                <span className="badge badge--amber">알아 둘 변화</span>
              </div>
              <div className="issue-meter__bar">
                <span style={{ width: '58%' }} />
              </div>
              <div className="issue-meter__row">
                <span>AI와 일자리</span>
                <span className="issue-meter__quiet">변화 없음</span>
              </div>
              <div className="issue-meter__bar">
                <span style={{ width: '14%' }} />
              </div>
            </div>
          </div>

          <Sparkle size={26} className="hero__sparkle hero__sparkle--1" />
          <Sparkle size={16} className="hero__sparkle hero__sparkle--2" />
          <Sparkle size={20} className="hero__sparkle hero__sparkle--3" />
          <Sparkle size={12} className="hero__sparkle hero__sparkle--4" />
        </div>
      </div>

      {/* 근거로 삼는 자료: 한 줄로 이어지는 띠 */}
      <div className="marquee" aria-label="근거로 삼는 자료">
        <div className="marquee__track">
          {[0, 1].map((copy) =>
            sourceTypes.map((s) => (
              <span key={`${copy}-${s}`} className="marquee__item" aria-hidden={copy === 1}>
                <Sparkle size={12} />
                {s}
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
