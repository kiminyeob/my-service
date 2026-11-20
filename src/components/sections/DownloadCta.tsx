import { maker } from '../../data/content';
import { Icon, PlaceholderTag, Section } from '../ui';

const stores = [
  { icon: 'apple' as const, os: 'iPhone', store: 'App Store에서 받기' },
  { icon: 'android' as const, os: 'Android', store: 'Google Play에서 받기' },
];

export default function DownloadCta() {
  return (
    <Section id="download" tone="white" innerClassName="cta">
      <figure className="cta__quote" data-reveal>
        <PlaceholderTag />
        <blockquote>“{maker.quote}”</blockquote>
        <figcaption>
          {maker.name} · {maker.role}
        </figcaption>
      </figure>

      <h2 className="display display--xl cta__title" data-reveal>
        첫 브리핑을 받아 보세요
      </h2>
      <p className="lead cta__lead" data-reveal>
        앱을 설치하고 직무를 선택하면 바로 시작할 수 있습니다.
      </p>

      <div className="store-cards">
        {stores.map((s) => (
          <a key={s.os} href="#download" className="store-card" data-reveal>
            <span className="store-card__icon">
              <Icon name={s.icon} size={28} />
            </span>
            <span className="store-card__os">{s.os}</span>
            <span className="store-card__store">{s.store}</span>
            <span className="store-card__arrow">
              <Icon name="arrowUpRight" size={22} />
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
}
