import { useState } from 'react';
import { footerColumns } from '../../data/content';
import { Icon, LogoMark } from '../ui';

/** 여러 컬럼의 링크. 휴대폰 화면에서는 컬럼 제목을 누르면 펼쳐지는 아코디언이 됩니다. */
export default function Footer() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <footer className="panel panel--white footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#top" className="brand">
            <LogoMark size={28} />
            <span className="brand__name">틈틈</span>
          </a>
          <p className="footer__tagline">일과 사이의 짧은 틈에 AI의 흐름을 따라갈 수 있도록.</p>
        </div>

        <div className="footer__cols">
          {footerColumns.map((col, i) => {
            const isOpen = open === i;
            return (
              <div key={col.title} className={`footer__col${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="footer__col-toggle"
                  aria-expanded={isOpen}
                  aria-controls={`footer-col-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {col.title}
                  <Icon name="chevronDown" size={18} className="footer__col-icon" />
                </button>
                <div id={`footer-col-${i}`} className="footer__col-panel">
                  <ul className="footer__col-links">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <a href={l.href}>{l.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="container footer__bottom">
        <span>틈틈: AI 이슈 브리핑</span>
        <span>모든 브리핑은 AI가 작성하고 AI가 검토합니다.</span>
      </div>
    </footer>
  );
}
