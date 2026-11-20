import { Icon, Section } from '../ui';

// 스토어 주소가 생기면 각 항목에 href를 넣고 카드를 링크(<a>)로 바꿉니다.
const stores = [
  { icon: 'apple' as const, os: 'iPhone', store: 'App Store' },
  { icon: 'android' as const, os: 'Android', store: 'Google Play' },
];

export default function DownloadCta() {
  return (
    <Section id="download" tone="white" innerClassName="cta">
      {/* 만든 사람 인용은 실제 이름·문구가 정해지면 다시 넣습니다 (content.ts의 maker) */}
      <h2 className="display display--xl cta__title" data-reveal>
        첫 브리핑을 받아 보세요
      </h2>
      <p className="lead cta__lead" data-reveal>
        앱을 설치하고 직무를 선택하면 바로 시작할 수 있습니다.
      </p>

      <div className="store-cards">
        {stores.map((s) => (
          <div key={s.os} className="store-card" data-reveal>
            <span className="store-card__icon">
              <Icon name={s.icon} size={28} />
            </span>
            <span className="store-card__os">{s.os}</span>
            <span className="store-card__store">{s.store} · 출시 준비 중</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
