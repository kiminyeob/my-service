import type { PickKind } from '../../data/content';

type Props = {
  title: string;
  kind: PickKind;
  size?: 'md' | 'sm';
};

/** 선별된 소식 한 줄 (남색 바 + "알아 둘 변화"/"지나가는 소식" 표시) */
export default function PickRow({ title, kind, size = 'md' }: Props) {
  return (
    <div className={`pick-row pick-row--${size}`}>
      <span className="pick-row__title">{title}</span>
      {kind === 'change' ? (
        <span className="badge badge--amber">알아 둘 변화</span>
      ) : (
        <span className="pick-row__passing">지나가는 소식</span>
      )}
    </div>
  );
}
