import { useEffect, useRef, useState, type ComponentType } from 'react';
import { steps } from '../../data/content';
import { clamp01, easeOutCubic, useInView, useMediaQuery } from '../../hooks/motion';
import { navOffset, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { Section } from '../ui';
import WordReveal from '../motion/WordReveal';
import { BriefingHomeScreen, IssueSelectScreen, PhoneFrame, RoleSelectScreen } from '../phone/PhoneScreens';

const screens: ComponentType[] = [RoleSelectScreen, IssueSelectScreen, BriefingHomeScreen];
const TITLE = '세 단계로 시작합니다';

/**
 * 세 단계 안내
 * - 넓은 화면: 화면 고정 무대. 휴대폰이 아래에서 떠오른 뒤 고정되고, 스크롤에 따라 화면과 단계 강조가 바뀝니다.
 * - 휴대폰 화면: 옆으로 넘겨 보기. 카드가 화면에 들어오면 휴대폰이 떠오릅니다.
 * - 움직임 줄이기 설정: 정적인 3단 배치.
 */
export default function Steps() {
  const isPhone = useMediaQuery('(max-width: 720px)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  if (isPhone) return <StepsCarousel />;
  if (reduced) return <StepsStatic />;
  return <StepsPinned />;
}

/* ---------- 넓은 화면: 고정 무대 ---------- */

// 고정 구간을 3등분해 단계를 넘김. 섹션 스냅(ScrollAnimations)은 고정 시작점과 2·3단계 구간 가운데에 맞춤.
const stepAt = (p: number) => (p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2);

function StepsPinned() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [riseProgress, setRiseProgress] = useState(0);
  const rise = easeOutCubic(clamp01(riseProgress));
  const active = stepAt(progress);

  useGSAP(() => {
    // 1) 섹션이 화면에 들어오는 동안 휴대폰이 아래에서 떠오름 → 고정이 시작될 때는 이미 1단계 화면이 자리에 있음
    const riseSt = ScrollTrigger.create({
      trigger: stageRef.current,
      start: 'top bottom',
      end: () => `top top+=${navOffset()}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => setRiseProgress(self.progress),
    });
    // 2) 무대를 내비게이션 아래에 고정하고, 화면 높이의 2.2배를 스크롤하는 동안 단계를 넘김
    //    (ScrollSmoother 안에서는 CSS sticky가 동작하지 않아 ScrollTrigger pin을 씁니다)
    const pinSt = ScrollTrigger.create({
      id: 'steps-pin', // ScrollAnimations의 섹션 스냅이 단계 위치를 계산할 때 사용
      trigger: stageRef.current,
      start: () => `top top+=${navOffset()}`,
      end: () => `+=${window.innerHeight * 2.2}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => {
      riseSt.kill();
      pinSt.kill();
    };
  });

  const phoneStyle = {
    transform: `translateY(${(1 - rise) * 110}vh) scale(${0.88 + 0.12 * rise})`,
  };

  return (
    <section id="how" className="panel panel--white panel--overlap steps-pin">
      <div className="steps-pin__track">
        <div ref={stageRef} className="steps-pin__stage">
          <div className="container steps-pin__inner">
            <WordReveal text={TITLE} className="display" />
            <div className="steps-pin__body">
              <div className="steps-pin__phone" style={phoneStyle}>
                <PhoneFrame>
                  {screens.map((Screen, i) => (
                    <div
                      key={i}
                      className={`phone__screen ${i === active ? 'is-active' : i < active ? 'is-past' : 'is-next'}`}
                    >
                      <Screen />
                    </div>
                  ))}
                </PhoneFrame>
              </div>

              <div className="steps-pin__side">
              <ol className="steps-pin__list">
                {steps.map((step, i) => (
                  <li key={step.title} className={`pin-step${i === active ? ' is-active' : ''}`}>
                    <div className="pin-step__head">
                      <span className="pin-step__num">{i + 1}</span>
                      <h3 className="pin-step__title">{step.title}</h3>
                    </div>
                    <div className="pin-step__detail">
                      <p className="pin-step__body">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="steps-pin__meter" aria-hidden="true">
                <span style={{ transform: `scaleX(${clamp01(progress)})` }} />
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 휴대폰 화면: 옆으로 넘겨 보기 ---------- */

function CarouselStep({ index }: { index: number }) {
  const [ref, inView] = useInView<HTMLLIElement>(0.35);
  const Screen = screens[index];
  const step = steps[index];
  return (
    <li ref={ref} className={`step step--reveal${inView ? ' is-in' : ''}`}>
      <PhoneFrame>
        <Screen />
      </PhoneFrame>
      <span className="step__num">{index + 1}</span>
      <h3 className="h3 h3--sm">{step.title}</h3>
      <p className="body">{step.body}</p>
    </li>
  );
}

function StepsCarousel() {
  const listRef = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const onScroll = () => {
      const first = list.firstElementChild as HTMLElement | null;
      if (!first) return;
      const stride = first.offsetWidth + 16; // .steps gap
      setCurrent(Math.min(steps.length - 1, Math.round(list.scrollLeft / stride)));
    };
    list.addEventListener('scroll', onScroll, { passive: true });
    return () => list.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Section id="how" tone="white" className="panel--overlap" innerClassName="stack-40">
      <WordReveal text={TITLE} className="display" />
      <ol ref={listRef} className="steps">
        {steps.map((s, i) => (
          <CarouselStep key={s.title} index={i} />
        ))}
      </ol>
      <div className="steps__dots" aria-hidden="true">
        {steps.map((s, i) => (
          <span key={s.title} className={`steps__dot${i === current ? ' is-active' : ''}`} />
        ))}
      </div>
    </Section>
  );
}

/* ---------- 움직임 줄이기: 정적 배치 ---------- */

function StepsStatic() {
  return (
    <Section id="how" tone="white" className="panel--overlap" innerClassName="stack-40">
      <h2 className="display">{TITLE}</h2>
      <ol className="steps">
        {steps.map((step, i) => {
          const Screen = screens[i];
          return (
            <li key={step.title} className="step">
              <PhoneFrame>
                <Screen />
              </PhoneFrame>
              <span className="step__num">{i + 1}</span>
              <h3 className="h3 h3--sm">{step.title}</h3>
              <p className="body">{step.body}</p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
