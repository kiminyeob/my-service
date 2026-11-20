import { Fragment } from 'react';
import { useInView } from '../../hooks/motion';

type Props = {
  text: string;
  className?: string;
};

/** 제목을 단어 단위로 세워 돌리며 차례로 보여 줍니다 (rotateY 90° → 0°). */
export default function WordReveal({ text, className }: Props) {
  const [ref, inView] = useInView<HTMLHeadingElement>(0.4);
  const words = text.split(' ');
  return (
    <h2 ref={ref} className={['word-reveal', inView && 'is-in', className].filter(Boolean).join(' ')} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="word-reveal__word" aria-hidden="true" style={{ transitionDelay: `${i * 80}ms` }}>
            {word}
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </h2>
  );
}
