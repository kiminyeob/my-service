import { ButtonLink } from '../ui';

/** 휴대폰 화면에서만 보이는, 화면 아래에 고정된 "앱 받기" 버튼 */
export default function MobileCta() {
  return (
    <div className="mobile-cta">
      <ButtonLink href="#download" className="mobile-cta__button">
        앱 받기
      </ButtonLink>
    </div>
  );
}
