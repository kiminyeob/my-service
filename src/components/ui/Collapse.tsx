import { useRef, type ReactNode } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '../../lib/gsap';

type Props = {
  open: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
};

/** 높이가 부드럽게 펼쳐지고 접히는 영역 (아코디언 본문) */
export default function Collapse({ open, id, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (first.current) {
        first.current = false;
        gsap.set(el, { height: open ? 'auto' : 0, opacity: open ? 1 : 0 });
        return;
      }
      const duration = prefersReducedMotion() ? 0 : 0.45;
      gsap.to(el, {
        height: open ? 'auto' : 0,
        opacity: open ? 1 : 0,
        duration,
        ease: 'power3.inOut',
        overwrite: true,
      });
    },
    { dependencies: [open] },
  );

  return (
    <div ref={ref} id={id} className={['collapse', className].filter(Boolean).join(' ')} aria-hidden={!open}>
      {children}
    </div>
  );
}
