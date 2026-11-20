import type { ReactNode } from 'react';

export { default as Icon } from './Icon';

/* ---------- Logo ---------- */

type LogoMarkProps = {
  size?: number;
  tone?: 'navy' | 'white';
  label?: string;
};

export function LogoMark({ size = 32, tone = 'navy', label }: LogoMarkProps) {
  const fill = tone === 'navy' ? 'var(--color-navy)' : '#FFFFFF';
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" {...a11y}>
      <rect x="8" y="8" width="34" height="80" rx="10" fill={fill} />
      <rect x="54" y="8" width="34" height="80" rx="10" fill={fill} />
      <rect x="45" y="26" width="6" height="44" rx="3" fill="var(--color-amber)" />
    </svg>
  );
}

/* ---------- Buttons (links) ---------- */

type ButtonLinkProps = {
  href: string;
  variant?: 'primary' | 'outline' | 'accent' | 'outline-light' | 'light';
  size?: 'md' | 'lg';
  children: ReactNode;
  className?: string;
};

/** 호버 시 배경색이 바뀌고 살짝 떠오르는 버튼 모양 링크 */
export function ButtonLink({ href, variant = 'primary', size = 'lg', children, className }: ButtonLinkProps) {
  return (
    <a href={href} className={['btn', `btn--${variant}`, `btn--${size}`, className].filter(Boolean).join(' ')}>
      {children}
    </a>
  );
}

/* ---------- Chips / badges ---------- */

export function Chip({ children, variant = 'soft' }: { children: ReactNode; variant?: 'soft' | 'dashed' }) {
  return <span className={`chip chip--${variant}`}>{children}</span>;
}

export function Badge({ children, variant = 'navy' }: { children: ReactNode; variant?: 'navy' | 'amber' | 'soft' }) {
  return <span className={`badge badge--${variant}`}>{children}</span>;
}

export function PlaceholderTag() {
  return <Badge variant="soft">가상 설정 · 공개 전 교체</Badge>;
}

/* ---------- Layout ---------- */

type SectionProps = {
  id?: string;
  tone?: 'white' | 'surface' | 'navy' | 'ink';
  narrow?: boolean;
  /** 이 섹션 위를 지날 때 내비게이션을 어두운 색으로 바꿉니다 */
  navDark?: boolean;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

/** 페이지 위에 쌓이는 둥근 섹션 카드 */
export function Section({ id, tone = 'white', narrow, navDark, className, innerClassName, children }: SectionProps) {
  return (
    <section
      id={id}
      className={['panel', `panel--${tone}`, className].filter(Boolean).join(' ')}
      data-nav={navDark ? 'dark' : undefined}
    >
      <div className={['container', narrow && 'container--narrow', innerClassName].filter(Boolean).join(' ')}>
        {children}
      </div>
    </section>
  );
}

type SectionHeadProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  align?: 'start' | 'center';
  className?: string;
};

export function SectionHead({ eyebrow, title, lead, align = 'start', className }: SectionHeadProps) {
  return (
    <div className={['section-head', align === 'center' && 'section-head--center', className].filter(Boolean).join(' ')}>
      {eyebrow && (
        <span className="eyebrow" data-reveal>
          {eyebrow}
        </span>
      )}
      <h2 className="display" data-reveal>
        {title}
      </h2>
      {lead && (
        <p className="lead" data-reveal>
          {lead}
        </p>
      )}
    </div>
  );
}

/* ---------- Small icons used inside phone mockups ---------- */

export function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15,5 8,12 15,19" />
    </svg>
  );
}

export function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="var(--color-amber)" />
      <polyline points="7,12.5 10.5,16 17,9" fill="none" stroke="var(--color-navy)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 4갈래 반짝이 장식 */
export function Sparkle({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 1.5c.6 5.2 3.3 7.9 10.5 10.5-7.2 2.6-9.9 5.3-10.5 10.5C11.4 17.3 8.7 14.6 1.5 12 8.7 9.4 11.4 6.7 12 1.5z" fill="currentColor" />
    </svg>
  );
}

export { Brand, withBrand } from './Brand';
