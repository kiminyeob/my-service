import { useEffect, useRef, useState } from 'react';
import { features, languages, navLinks } from '../../data/content';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { ButtonLink, Icon, LogoMark } from '../ui';
import Modal from '../ui/Modal';

/**
 * 상단 고정 내비게이션
 * - 어두운 섹션(data-nav="dark") 위를 지나면 색이 바뀜
 * - "기능"에 호버/클릭하면 메가메뉴
 * - 언어 선택 드롭다운, 로그인 모달
 * - 태블릿/휴대폰: 햄버거 메뉴 열고 닫기 애니메이션
 */
export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState('ko');
  const [loginOpen, setLoginOpen] = useState(false);

  /* 스크롤 위치에 따른 색 변경 */
  useGSAP(() => {
    const active = new Set<ScrollTrigger>();
    document.querySelectorAll<HTMLElement>('[data-nav="dark"]').forEach((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: 'top 40px',
        end: 'bottom 40px',
        onToggle: (self) => {
          if (self.isActive) active.add(self);
          else active.delete(self);
          setDark(active.size > 0);
        },
      }),
    );
    ScrollTrigger.create({
      start: 8,
      end: 'max',
      onToggle: (self) => setScrolled(self.isActive),
    });
  });

  /* 메가메뉴 열기/닫기 */
  useGSAP(
    () => {
      const mega = megaRef.current;
      if (!mega) return;
      const mm = gsap.matchMedia();
      mm.add(
        { motion: MOTION_OK, reduce: '(prefers-reduced-motion: reduce)' },
        (ctx) => {
          const motion = ctx.conditions?.motion;
          if (megaOpen) {
            gsap.to(mega, { autoAlpha: 1, y: 0, duration: motion ? 0.28 : 0, ease: 'power3.out' });
            gsap.fromTo(
              mega.querySelectorAll('.mega__card'),
              { opacity: 0, y: motion ? 12 : 0 },
              { opacity: 1, y: 0, duration: motion ? 0.35 : 0, stagger: 0.03, ease: 'power3.out' },
            );
          } else {
            gsap.to(mega, { autoAlpha: 0, y: motion ? -8 : 0, duration: motion ? 0.2 : 0 });
          }
        },
      );
      return () => mm.revert();
    },
    { dependencies: [megaOpen] },
  );

  /* 햄버거 메뉴 열기/닫기 */
  useGSAP(
    () => {
      const drawer = drawerRef.current;
      if (!drawer) return;
      const motion = window.matchMedia(MOTION_OK).matches;
      if (menuOpen) {
        gsap.to(drawer, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: motion ? 0.45 : 0, ease: 'power3.out' });
        gsap.fromTo(
          drawer.querySelectorAll('[data-drawer-item]'),
          { opacity: 0, y: motion ? 16 : 0 },
          { opacity: 1, y: 0, duration: motion ? 0.4 : 0, stagger: 0.04, delay: motion ? 0.1 : 0 },
        );
      } else {
        gsap.to(drawer, { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0% round 0px)', duration: motion ? 0.3 : 0, ease: 'power3.in' });
      }
      document.documentElement.classList.toggle('is-menu-open', menuOpen);
    },
    { dependencies: [menuOpen] },
  );

  /* Esc, 바깥 클릭으로 드롭다운 닫기 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMegaOpen(false);
      setLangOpen(false);
      setMenuOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, []);

  const hoverCapable = () => window.matchMedia('(hover: hover)').matches;
  const closeAll = () => {
    setMegaOpen(false);
    setMenuOpen(false);
  };

  const className = ['nav', dark && 'nav--dark', scrolled && 'is-scrolled', (megaOpen || menuOpen) && 'is-expanded']
    .filter(Boolean)
    .join(' ');

  return (
    <header ref={headerRef} className={className} onMouseLeave={() => hoverCapable() && setMegaOpen(false)}>
      <div className="nav__bar">
        <a href="#top" className="brand" onClick={closeAll}>
          <LogoMark size={30} tone={dark && !megaOpen && !menuOpen ? 'white' : 'navy'} />
          <span className="brand__name">틈틈</span>
        </a>

        <nav className="nav__links" aria-label="주요 메뉴">
          <button
            type="button"
            className={`nav__link nav__link--menu${megaOpen ? ' is-open' : ''}`}
            aria-expanded={megaOpen}
            aria-controls="mega-menu"
            onMouseEnter={() => hoverCapable() && setMegaOpen(true)}
            onClick={() => setMegaOpen((v) => !v)}
          >
            기능
            <Icon name="chevronDown" size={16} className="nav__chevron" />
          </button>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav__link" onMouseEnter={() => hoverCapable() && setMegaOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <div ref={langRef} className="lang">
            <button
              type="button"
              className="nav__link lang__button"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={`언어 선택, 현재 ${languages.find((l) => l.code === lang)?.label}`}
              onClick={() => setLangOpen((v) => !v)}
            >
              <Icon name="globe" size={18} />
              <span>{lang.toUpperCase()}</span>
              <Icon name="chevronDown" size={14} className="nav__chevron" />
            </button>
            <ul className={`lang__list${langOpen ? ' is-open' : ''}`} role="listbox" aria-label="언어">
              {languages.map((l) => (
                <li key={l.code} role="option" aria-selected={l.code === lang}>
                  <button
                    type="button"
                    onClick={() => {
                      setLang(l.code);
                      setLangOpen(false);
                    }}
                  >
                    {l.label}
                    {l.code === lang && <Icon name="check" size={16} />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button type="button" className="nav__link nav__login" onClick={() => setLoginOpen(true)}>
            로그인
          </button>
          <ButtonLink href="#download" variant="outline" size="md" className="nav__cta">
            앱 받기
          </ButtonLink>
          <button
            type="button"
            className={`hamburger${menuOpen ? ' is-open' : ''}`}
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* 메가메뉴 */}
      <div ref={megaRef} id="mega-menu" className="mega" aria-hidden={!megaOpen}>
        <div className="mega__grid">
          {features.map((f) => (
            <a
              key={f.key}
              href="#features"
              className="mega__card"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('select-feature', { detail: f.key }));
                closeAll();
              }}
              tabIndex={megaOpen ? 0 : -1}
            >
              <span className="mega__icon">
                <Icon name={f.icon} size={20} />
              </span>
              <span className="mega__text">
                <span className="mega__title">{f.tab}</span>
                <span className="mega__desc">{f.menuDesc}</span>
              </span>
            </a>
          ))}
        </div>
        <a href="#features" className="mega__all" onClick={closeAll} tabIndex={megaOpen ? 0 : -1}>
          기능 전체 보기 <Icon name="arrowRight" size={16} />
        </a>
      </div>

      {/* 태블릿/휴대폰 메뉴 */}
      <div ref={drawerRef} id="mobile-menu" className="drawer" aria-hidden={!menuOpen}>
        <span className="drawer__label" data-drawer-item>
          기능
        </span>
        <div className="drawer__features">
          {features.map((f) => (
            <a
              key={f.key}
              href="#features"
              className="drawer__feature"
              data-drawer-item
              onClick={() => {
                window.dispatchEvent(new CustomEvent('select-feature', { detail: f.key }));
                closeAll();
              }}
              tabIndex={menuOpen ? 0 : -1}
            >
              <Icon name={f.icon} size={18} />
              {f.tab}
            </a>
          ))}
        </div>
        <div className="drawer__links">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="drawer__link" data-drawer-item onClick={closeAll} tabIndex={menuOpen ? 0 : -1}>
              {link.label}
              <Icon name="arrowRight" size={18} />
            </a>
          ))}
        </div>
        <div className="drawer__actions" data-drawer-item>
          <button
            type="button"
            className="btn btn--outline btn--lg"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => {
              setMenuOpen(false);
              setLoginOpen(true);
            }}
          >
            로그인
          </button>
          <a href="#download" className="btn btn--primary btn--lg" onClick={closeAll} tabIndex={menuOpen ? 0 : -1}>
            앱 받기
          </a>
        </div>
      </div>

      <Modal open={loginOpen} onClose={() => setLoginOpen(false)} title="틈틈에 로그인">
        <form className="login" onSubmit={(e) => e.preventDefault()}>
          <p className="login__lead">가입할 때 쓴 이메일로 로그인 링크를 보내 드립니다.</p>
          <label className="field">
            <span className="field__label">이메일</span>
            <input className="field__input" type="email" name="email" autoComplete="email" placeholder="name@company.com" />
          </label>
          {/* 전송 동작은 기능 개발 단계에서 연결 */}
          <button type="submit" className="btn btn--primary btn--lg login__submit">
            로그인 링크 받기
          </button>
          <p className="login__note">
            아직 계정이 없다면 <a href="#download" onClick={() => setLoginOpen(false)}>앱을 받아</a> 직무를 선택하면 바로 시작할 수 있습니다.
          </p>
        </form>
      </Modal>
    </header>
  );
}
