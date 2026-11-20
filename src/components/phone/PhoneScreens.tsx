import type { ReactNode } from 'react';
import { recommendedIssues, roles } from '../../data/content';
import { CheckCircleIcon, ChevronLeftIcon, LogoMark } from '../ui';

/*
 * 앱 화면 목업 — 장식용 그림이므로 실제 컨트롤이 아닌 div/span으로 그립니다.
 * 각 화면(*Screen)은 프레임 없이 내용만 그리므로, PhoneFrame 안에 하나만 넣거나
 * 여러 개를 겹쳐 넣고 전환할 수 있습니다.
 */

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone" aria-hidden="true">
      {children}
    </div>
  );
}

function OnboardingTop({ progress }: { progress: 1 | 2 }) {
  return (
    <div className="phone__top">
      <ChevronLeftIcon />
      <div className="phone__progress">
        <div className="phone__progress-bar is-on" />
        <div className={`phone__progress-bar${progress === 2 ? ' is-on' : ''}`} />
      </div>
    </div>
  );
}

function PhoneCta({ children }: { children: ReactNode }) {
  return (
    <div className="phone__footer">
      <div className="phone__cta">{children}</div>
    </div>
  );
}

export function RoleSelectScreen() {
  return (
    <>
      <OnboardingTop progress={1} />
      <div className="phone__body">
        <span className="phone__title">어떤 일의 관점에서 볼까요?</span>
        <span className="phone__sub">관심 있는 직무를 골라도 됩니다.</span>
        <div className="phone__chips">
          {roles.map((r, i) => (
            <span key={r} className={`phone-chip${i === 0 ? ' is-selected' : ''}`}>
              {r}
            </span>
          ))}
        </div>
      </div>
      <PhoneCta>다음</PhoneCta>
    </>
  );
}

export function IssueSelectScreen() {
  return (
    <>
      <OnboardingTop progress={2} />
      <div className="phone__body">
        <span className="phone__title">추천 이슈</span>
        <span className="phone__sub">인사 직무에 맞춰 골랐습니다.</span>
        {recommendedIssues.map((it) => (
          <div key={it.title} className="phone-issue">
            <div className="phone-issue__text">
              <span className="phone-issue__title">{it.title}</span>
              <span className="phone-issue__desc">{it.desc}</span>
            </div>
            <CheckCircleIcon />
          </div>
        ))}
        <div className="phone-add">+ 이슈 더하기</div>
      </div>
      <PhoneCta>시작하기</PhoneCta>
    </>
  );
}

export function BriefingHomeScreen() {
  return (
    <>
      <div className="phone__top phone__top--brand">
        <LogoMark size={18} />
        <span className="phone__brand">틈틈</span>
      </div>
      <div className="phone__body">
        <div className="phone-alert">
          <span className="phone-alert__sub">이번 주 브리핑</span>
          <span className="phone-alert__title">새 브리핑이 도착했습니다</span>
        </div>
        <div className="phone-brief">
          <div className="phone-brief__meta">
            <span className="badge badge--navy badge--xs">알아 둘 변화</span>
            <span className="phone-brief__cat">AI 규제와 정책</span>
          </div>
          <span className="phone-brief__title">AI 기본법 시행, 무엇을 점검해야 하는가</span>
          <div className="phone-brief__rel">
            <span className="phone-brief__rel-label">나와의 관련</span>
            <span className="phone-brief__rel-text">지원자의 순위를 매기는 도구를 쓴다면 점검 대상이 될 수 있습니다.</span>
          </div>
          <span className="phone-brief__src">아이뉴스24 · 전문가 기고</span>
        </div>
        <div className="phone-issue">
          <span className="phone-issue__title">AI와 일자리</span>
          <span className="phone-issue__desc">이번 주 변화 없음</span>
        </div>
      </div>
      <div className="phone__tabbar">
        <span className="is-active">홈</span>
        <span>이슈</span>
        <span>더보기</span>
      </div>
    </>
  );
}
