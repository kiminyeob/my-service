import { transparency } from '../../data/content';
import { Section, SectionHead } from '../ui';

export default function Transparency() {
  return (
    <Section id="trust" tone="surface" innerClassName="stack-40">
      <SectionHead
        align="center"
        eyebrow="믿을 수 있는 이유"
        title="AI가 쓴 글이라는 사실을 숨기지 않습니다"
        lead="근거를 직접 확인할 수 있는 브리핑. 작성 과정과 수정 기록을 모두 공개합니다."
      />
      <div className="numbered">
        {transparency.map((t, i) => (
          <article key={t.title} className="numbered__card" data-reveal>
            <span className="numbered__num">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="numbered__title">{t.title}</h3>
            <p className="body">{t.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
