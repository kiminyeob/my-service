import { Fragment, type ReactNode } from 'react';

/**
 * 문장 속 브랜드 이름 "틈틈"을 강조합니다 (굵게 + 형광펜 밑줄).
 * 부사 "틈틈이(겨를이 있을 때마다)"와 헷갈리지 않도록, 브랜드 이름 뒤에는 주격 조사 "이"를 쓰지 않습니다.
 *   틈틈은 / 틈틈의 / 틈틈을 / 틈틈과 / 틈틈에  (O)
 *   틈틈이 ~합니다                              (X)
 */
export function Brand({ children = '틈틈' }: { children?: ReactNode }) {
  return <b className="brand-word">{children}</b>;
}

/** 문자열 속 "틈틈"을 <Brand>로 감쌉니다. 바로 뒤에 "이"가 오는 부사 "틈틈이"는 건드리지 않습니다. */
export function withBrand(text: string): ReactNode {
  const parts = text.split(/(틈틈)(?!이)/);
  return parts.map((part, i) => (part === '틈틈' ? <Brand key={i} /> : <Fragment key={i}>{part}</Fragment>));
}
