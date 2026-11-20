import { LogoMark, Section } from '../ui';

export default function Story() {
  return (
    <Section id="story" tone="surface" innerClassName="story">
      <div className="story__mark" data-reveal>
        <span className="story__mark-inner" data-speed="0.82">
          <LogoMark size={88} label="틈틈 심벌" />
        </span>
      </div>
      <div className="story__copy">
        <span className="eyebrow" data-reveal>
          브랜드 이야기
        </span>
        <h2 className="display" data-reveal>
          틈틈이라는 이름
        </h2>
        <p className="story__text" data-reveal>
          “틈틈이”는 겨를이 있을 때마다라는 뜻입니다. 따로 시간을 내지 않아도 일과 사이의 짧은 틈에 AI의 흐름을 따라갈 수
          있기를 바라는 마음을 이름에 담았습니다.
        </p>
        <p className="story__text" data-reveal>
          로고의 두 면 사이에 난 틈은 그 짧은 시간을, 틈 사이의 빛은 그 시간에 얻는 이해를 뜻합니다.
        </p>
      </div>
    </Section>
  );
}
