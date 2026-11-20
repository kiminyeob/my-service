import { useState } from 'react';
import { faqs } from '../../data/content';
import { PlaceholderTag, Section } from '../ui';
import Collapse from '../ui/Collapse';

/** 누르면 높이가 부드럽게 펼쳐지고 + 아이콘이 회전하는 아코디언. 다시 누르면 접힙니다. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section id="faq" tone="surface" narrow innerClassName="stack-32">
      <h2 className="display" data-reveal>
        자주 묻는 질문
      </h2>
      <div className="faq">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className={`faq__item${isOpen ? ' is-open' : ''}`} data-reveal>
              <button
                type="button"
                className="faq__q"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{f.q}</span>
                <span className="faq__icon" aria-hidden="true">
                  <span />
                  <span />
                </span>
              </button>
              <Collapse open={isOpen} id={`faq-${i}`}>
                <div className="faq__a">
                  {f.placeholder && <PlaceholderTag />}
                  <p className="body">{f.a}</p>
                </div>
              </Collapse>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
