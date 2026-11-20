import { useEffect, useId, useRef, type ReactNode } from 'react';
import { gsap, prefersReducedMotion, ScrollSmoother } from '../../lib/gsap';
import Icon from './Icon';

type Props = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  size?: 'sm' | 'lg';
  tone?: 'light' | 'dark';
  children: ReactNode;
};

/** <dialog> 기반 모달. Esc·바깥 클릭으로 닫히고, 열고 닫을 때 페이드·떠오름 애니메이션이 있습니다. */
export default function Modal({ open, onClose, title, size = 'sm', tone = 'light', children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const panel = dialog.querySelector('.modal__panel');
    const d = prefersReducedMotion() ? 0 : 1;

    // 열려 있는 동안 뒤 페이지 스크롤을 멈춤 (부드러운 스크롤이 켜져 있으면 그것을 멈춤)
    const lockScroll = (lock: boolean) => {
      const smoother = ScrollSmoother.get();
      if (smoother) smoother.paused(lock);
      else document.documentElement.classList.toggle('is-modal-open', lock);
    };

    if (open && !dialog.open) {
      dialog.showModal();
      lockScroll(true);
      gsap.fromTo(dialog, { opacity: 0 }, { opacity: 1, duration: 0.2 * d });
      gsap.fromTo(panel, { y: 28, scale: 0.97 }, { y: 0, scale: 1, duration: 0.35 * d, ease: 'power3.out' });
    } else if (!open && dialog.open) {
      gsap.to(panel, { y: 16, scale: 0.98, duration: 0.18 * d, ease: 'power2.in' });
      gsap.to(dialog, {
        opacity: 0,
        duration: 0.18 * d,
        onComplete: () => {
          dialog.close();
          lockScroll(false);
        },
      });
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`modal modal--${size} modal--${tone}`}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal__panel">
        <div className="modal__head">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          <button type="button" className="icon-button" aria-label="닫기" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
