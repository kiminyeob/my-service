import type { ReactNode } from 'react';
import { recommendedIssues, roles } from '../../data/content';
import { CheckCircleIcon, ChevronLeftIcon, LogoMark } from '../ui';
import frameUrl from '../../assets/phone-frame.png';

/*
 * 앱 화면 목업 — 장식용 그림이므로 실제 컨트롤이 아닌 div/span으로 그립니다.
 * 각 화면(*Screen)은 프레임 없이 내용만 그리므로, PhoneFrame 안에 하나만 넣거나
 * 여러 개를 겹쳐 넣고 전환할 수 있습니다.
 *
 * PhoneFrame 구조
 *   .phone              실사 프레임 비율(727:1456)을 따르는 상자. 너비만 정하면 높이가 따라옴
 *   ├ .phone__display   프레임의 화면 구멍 위치·크기·모서리에 맞춘 실제 화면 (HTML)
 *   │  ├ StatusBar      iOS 상태바 (다이내믹 아일랜드와 세로 중심을 맞춤)
 *   │  └ .phone__content  화면 내용. 전환되는 .phone__screen 들도 여기에 겹쳐 들어감
 *   └ img.phone__frame  src/assets/phone-frame.png (화면·바깥이 투명한 실사 프레임)
 */

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone" aria-hidden="true">
      <div className="phone__display">
        <StatusBar />
        <div className="phone__content">{children}</div>
      </div>
      <img className="phone__frame" src={frameUrl} alt="" draggable={false} />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="statusbar">
      <span className="statusbar__time">9:41</span>
      <span className="statusbar__island" />
      <span className="statusbar__icons">
        {/* 신호 */}
        <svg viewBox="0 0 18 12" className="statusbar__signal">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* 와이파이 */}
        <svg viewBox="0 0 16 12" className="statusbar__wifi">
          <path d="M8 11.6 10.4 9a3.4 3.4 0 0 0-4.8 0z" />
          <path d="M3.9 7.3a5.8 5.8 0 0 1 8.2 0l1.4-1.5a7.9 7.9 0 0 0-11 0z" />
          <path d="M1.4 4.6a9.4 9.4 0 0 1 13.2 0L16 3.1a11.4 11.4 0 0 0-16 0z" />
        </svg>
        {/* 배터리 */}
        <svg viewBox="0 0 27 13" className="statusbar__battery">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2" />
          <path d="M25 4.5v4a2 2 0 0 0 0-4z" fillOpacity="0.4" />
        </svg>
      </span>
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
          <span className="phone-issue__desc">지나가는 소식</span>
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
