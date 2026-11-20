import { useRef, useState } from 'react';
import { aiItems, catchupItems, example, roleLens, type AiKey } from '../../data/content';
import { gsap, MOTION_OK, prefersReducedMotion, useGSAP } from '../../lib/gsap';
import { Badge, Brand, Icon, LogoMark, SectionHead } from '../ui';
import Collapse from '../ui/Collapse';
import PickRow from '../briefing/PickRow';

/**
 * AI 작성 방식 소개
 * - 그라디언트 헤드라인
 * - 오른쪽 아코디언을 열면 왼쪽 비주얼이 그 기능의 미니 화면으로 바뀝니다
 * - 섹션 진입 시 떠 있는 카드가 스크롤에 맞춰 움직임 (start "top center", scrub 1)
 */
export default function AiAccordion() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number>(0);
  const active: AiKey | null = open >= 0 ? aiItems[open].key : null;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '.ai-visual__stage',
          { y: 50, rotate: -1.5 },
          {
            y: -30,
            rotate: 0,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top center', end: 'bottom center', scrub: 1 },
          },
        );
        gsap.fromTo(
          '.ai-visual__photo',
          { scale: 1.12 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'center center', scrub: 1 } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  // 미니 화면이 바뀔 때 등장 애니메이션
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo('.ai-ui', { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
      });
      return () => mm.revert();
    },
    { dependencies: [active], scope: ref },
  );

  return (
    <section id="ai" ref={ref} className="panel panel--white ai">
      <div className="container stack-40">
        <SectionHead
          eyebrow="브리핑이 만들어지는 방식"
          title={<span className="gradient-text">AI가 고르고, 설명하고, 근거를 붙입니다</span>}
          lead={
            <>
              <Brand />의 모든 브리핑은 근거를 함께 제공하고, 작성 과정을 공개합니다.
            </>
          }
        />

        <div className="ai__grid">
          <div className="ai-visual" data-reveal>
            <div className="ai-visual__photo" aria-hidden="true">
              <span className="showcase__photo-note">사진 자리</span>
            </div>
            <div className="ai-visual__stage">
              <div className="ai-ui" key={active ?? 'none'}>
                {active === 'lens' && <LensUI />}
                {active === 'sources' && <SourcesUI />}
                {active === 'fact' && <FactUI />}
                {active === 'catchup' && <CatchupUI />}
                {active === 'review' && <ReviewUI />}
                {active === null && <DefaultUI />}
              </div>
            </div>
          </div>

          <ul className="accordion" data-reveal>
            {aiItems.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.key} className={`accordion__item${isOpen ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="accordion__trigger"
                    aria-expanded={isOpen}
                    aria-controls={`ai-panel-${item.key}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="accordion__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="accordion__title">{item.title}</span>
                    <span className="pm" aria-hidden="true">
                      <span />
                      <span />
                    </span>
                  </button>
                  <Collapse open={isOpen} id={`ai-panel-${item.key}`}>
                    <p className="accordion__body">{item.body}</p>
                  </Collapse>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- 왼쪽 미니 화면들 ---------- */

function UiHead({ label }: { label: string }) {
  return (
    <div className="ai-ui__head">
      <LogoMark size={16} />
      <span>{label}</span>
    </div>
  );
}

function DefaultUI() {
  return (
    <>
      <UiHead label="이번 주 브리핑" />
      <Badge>알아 둘 변화</Badge>
      <span className="ai-ui__title">{example.title}</span>
      <span className="ai-ui__text">{example.what}</span>
    </>
  );
}

function LensUI() {
  const [role, setRole] = useState(0);
  const lens = roleLens[role];
  return (
    <>
      <UiHead label="나와의 관련" />
      <div className="mini-chips" role="group" aria-label="직무 바꿔 보기">
        {roleLens.map((r, i) => (
          <button key={r.role} type="button" className={`mini-chip${i === role ? ' is-selected' : ''}`} aria-pressed={i === role} onClick={() => setRole(i)}>
            {r.role}
          </button>
        ))}
      </div>
      <span className="ai-ui__title">{example.title}</span>
      <div className="ai-ui__rel" key={lens.role}>
        <span className="ai-ui__rel-label">나와의 관련 · {lens.role}의 관점</span>
        <span className="ai-ui__text">{lens.text}</span>
      </div>
      <span className="ai-ui__src">출처: {lens.source}</span>
    </>
  );
}

function SourcesUI() {
  return (
    <>
      <UiHead label="출처" />
      <span className="ai-ui__title">{example.title}</span>
      <ul className="src-list">
        {[
          ['공식 발표', '정부 보도자료'],
          ['언론 보도', '주요 언론 보도'],
          ['전문가 의견', '아이뉴스24 전문가 기고'],
        ].map(([type, name]) => (
          <li key={type} className="src-list__row">
            <span className="src-list__type">{type}</span>
            <span className="src-list__name">{name}</span>
            <Icon name="arrowUpRight" size={16} />
          </li>
        ))}
      </ul>
    </>
  );
}

function FactUI() {
  return (
    <>
      <UiHead label="사실과 해석" />
      {[
        ['사실', 'fact', '2026년 1월 22일 AI 기본법이 시행됐습니다.'],
        ['해석', 'view', '채용 AI 도구도 점검 대상이 될 수 있다는 것이 전문가의 해석입니다.'],
        ['확인 중', 'rumor', 'SNS에서 화제가 된 이야기는 따로 모아, 이후 사실 여부를 알려 드립니다.'],
      ].map(([label, kind, text]) => (
        <div key={label} className="fact-row fact-row--lg">
          <span className={`fact-tag fact-tag--${kind}`}>{label}</span>
          <span className="ai-ui__text">{text}</span>
        </div>
      ))}
    </>
  );
}

/** 놓친 기간 정리: 진행 카운트 → 이슈별 항목이 하나씩 쌓임 → 확인 버튼 */
function CatchupUI() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(prefersReducedMotion() ? catchupItems.length : 0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ delay: 0.3 });
      tl.set('.seq__item', { opacity: 0, y: 16, scale: 0.96 }).set('.seq__done', { opacity: 0, y: 10 });
      catchupItems.forEach((_, i) => {
        tl.call(() => setCount(i + 1))
          .to('.seq__bar > span', { width: `${((i + 1) / catchupItems.length) * 100}%`, duration: 0.5, ease: 'power2.out' })
          .to(`.seq__item:nth-child(${i + 1})`, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.6)' }, '<0.2')
          .to({}, { duration: 0.35 });
      });
      tl.to('.seq__done', { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
    },
    { scope: ref },
  );

  const done = count >= catchupItems.length;
  return (
    <div ref={ref} className="seq">
      <UiHead label="놓친 기간 정리" />
      <div className="seq__status">
        <Icon name="history" size={18} />
        <span>{done ? '3주 치 정리를 마쳤습니다' : `놓친 3주 정리 중 ${Math.max(count, 1)}/${catchupItems.length}`}</span>
      </div>
      <div className="seq__bar">
        <span style={prefersReducedMotion() ? { width: '100%' } : undefined} />
      </div>
      <div className="seq__list">
        {catchupItems.map((it) => (
          <div key={it.issue} className="seq__item">
            <span className="seq__issue">{it.issue}</span>
            <PickRow title={it.note} kind={it.kind} size="sm" />
          </div>
        ))}
      </div>
      <span className="seq__done">핵심 변화부터 보기</span>
    </div>
  );
}

function ReviewUI() {
  return (
    <>
      <UiHead label="작성 과정" />
      <span className="ai-ui__title">{example.title}</span>
      <div className="review-badge">
        <Icon name="check" size={16} strokeWidth={3} />
        AI가 작성하고 AI가 검토했습니다
      </div>
      <div className="review-row">
        <span className="ai-ui__rel-label">수정 기록 · 예시</span>
        <span className="ai-ui__text">[날짜] 출처 표기 수정</span>
      </div>
      <span className="review-report">
        <Icon name="flag" size={16} /> 오류 알리기
      </span>
    </>
  );
}
