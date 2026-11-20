import type { FeatureKey } from '../../data/content';
import { example, picked, roleLens, roles } from '../../data/content';
import { Icon, LogoMark } from '../ui';
import PickRow from '../briefing/PickRow';

/* 기능 탭 오른쪽 휴대폰 안에 들어가는 미니 화면들 (장식용) */

function AppTop({ title }: { title: string }) {
  return (
    <div className="phone__top phone__top--brand">
      <LogoMark size={18} />
      <span className="phone__brand">{title}</span>
    </div>
  );
}

function Curate() {
  return (
    <>
      <AppTop title="이번 주 브리핑" />
      <div className="phone__body">
        <span className="phone__sub">이번 주 소식 12건 중 3건을 골랐습니다.</span>
        {picked.map((p) => (
          <PickRow key={p.title} title={p.title} kind={p.kind} size="sm" />
        ))}
      </div>
    </>
  );
}

function Role() {
  return (
    <>
      <AppTop title="나와의 관련" />
      <div className="phone__body">
        <div className="phone__chips phone__chips--row">
          {roles.map((r, i) => (
            <span key={r} className={`phone-chip${i === 0 ? ' is-selected' : ''}`}>
              {r}
            </span>
          ))}
        </div>
        <div className="phone-brief">
          <span className="phone-brief__title">{example.title}</span>
          <div className="phone-brief__rel">
            <span className="phone-brief__rel-label">나와의 관련 · 인사의 관점</span>
            <span className="phone-brief__rel-text">{roleLens[0].text}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function Source() {
  return (
    <>
      <AppTop title="출처" />
      <div className="phone__body">
        <span className="phone-brief__title">{example.title}</span>
        {[
          ['공식 발표', '정부 보도자료'],
          ['언론 보도', '주요 언론 보도'],
          ['전문가 의견', '아이뉴스24 전문가 기고'],
        ].map(([type, name]) => (
          <div key={type} className="phone-issue">
            <div className="phone-issue__text">
              <span className="phone-issue__desc">{type}</span>
              <span className="phone-issue__title">{name}</span>
            </div>
            <Icon name="arrowUpRight" size={18} />
          </div>
        ))}
      </div>
    </>
  );
}

function Catchup() {
  return (
    <>
      <AppTop title="놓친 기간 정리" />
      <div className="phone__body">
        <div className="phone-alert">
          <span className="phone-alert__sub">3주 동안 읽지 않았습니다</span>
          <span className="phone-alert__title">그사이 핵심 변화 2건</span>
        </div>
        <div className="timeline">
          {['3주 전', '2주 전', '이번 주'].map((w, i) => (
            <div key={w} className="timeline__row">
              <span className={`timeline__dot${i === 2 ? ' is-now' : ''}`} />
              <div className="timeline__text">
                <span className="phone-issue__desc">{w}</span>
                <span className="phone-issue__title">{['AI 기본법 시행', '업무용 AI 도구의 변화', '이번 주 변화'][i]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Terms() {
  return (
    <>
      <AppTop title="브리핑" />
      <div className="phone__body">
        <span className="phone-brief__title">{example.title}</span>
        <p className="phone-para">
          사람의 권리에 큰 영향을 주는 판단에 쓰이는 AI는 <mark className="term">고영향 AI</mark>가 될 수 있습니다.
        </p>
        <div className="term-pop">
          <span className="phone-brief__rel-label">고영향 AI</span>
          <span className="phone-brief__rel-text">채용이나 대출 심사처럼 사람의 권리에 큰 영향을 주는 판단에 쓰이는 AI</span>
        </div>
      </div>
    </>
  );
}

function Fact() {
  return (
    <>
      <AppTop title="브리핑" />
      <div className="phone__body">
        {[
          ['사실', 'fact', '2026년 1월 22일 AI 기본법이 시행됐습니다.'],
          ['해석', 'view', '채용 AI 도구도 점검 대상이 될 수 있다는 것이 전문가의 해석입니다.'],
          ['확인 중', 'rumor', 'SNS에서 화제가 된 이야기는 따로 모아, 이후 사실 여부를 알려 드립니다.'],
        ].map(([label, kind, text]) => (
          <div key={label} className="fact-row">
            <span className={`fact-tag fact-tag--${kind}`}>{label}</span>
            <span className="phone-brief__rel-text">{text}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Schedule() {
  return (
    <>
      <AppTop title="알림 설정" />
      <div className="phone__body">
        <span className="phone__title">언제 받아 볼까요?</span>
        <div className="phone__chips phone__chips--days">
          {['월', '화', '수', '목', '금', '토', '일'].map((d) => (
            <span key={d} className={`phone-chip phone-chip--day${d === '월' ? ' is-selected' : ''}`}>
              {d}
            </span>
          ))}
        </div>
        <div className="phone-issue">
          <span className="phone-issue__title">받는 시간</span>
          <span className="phone-issue__desc">[시간 선택]</span>
        </div>
        <div className="phone-issue">
          <span className="phone-issue__title">큰 변화는 주중에도 알림</span>
          <span className="toggle is-on" />
        </div>
      </div>
    </>
  );
}

function Report() {
  return (
    <>
      <AppTop title="브리핑" />
      <div className="phone__body">
        <span className="phone-brief__title">{example.title}</span>
        <span className="phone-brief__src">AI가 작성하고 AI가 검토했습니다</span>
        <div className="phone-add">
          <Icon name="flag" size={14} /> 오류 알리기
        </div>
        <div className="phone-issue">
          <div className="phone-issue__text">
            <span className="phone-issue__desc">수정 기록 · 예시</span>
            <span className="phone-issue__title">[날짜] 출처 표기 수정</span>
          </div>
        </div>
      </div>
    </>
  );
}

const map: Record<FeatureKey, () => JSX.Element> = {
  curate: Curate,
  role: Role,
  source: Source,
  catchup: Catchup,
  terms: Terms,
  fact: Fact,
  schedule: Schedule,
  report: Report,
};

export default function FeatureScreen({ feature }: { feature: FeatureKey }) {
  const Screen = map[feature];
  return <Screen />;
}
