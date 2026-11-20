import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { issues } from '../../data/content';
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap';
import { ButtonLink, Icon } from '../ui';

/**
 * 사진 배경 다크 섹션 + 카드 슬라이더
 * - 배경은 스크롤에 맞춰 천천히 움직이는 패럴랙스(scrub)
 * - 사진은 아직 없으므로 어두운 그라디언트 자리표시로 그립니다 → 실제 사진으로 교체
 */
export default function IssuesShowcase() {
  const ref = useRef<HTMLElement>(null);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '.showcase__bg',
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const syncEdge = (s: SwiperType) => setEdge({ start: s.isBeginning, end: s.isEnd });

  return (
    <section id="issues" ref={ref} className="panel panel--navy showcase" data-nav="dark">
      <div className="showcase__bg" aria-hidden="true">
        <div className="showcase__photo" />
      </div>

      <div className="container showcase__inner">
        <div className="showcase__head">
          <div className="stack-14">
            <span className="eyebrow eyebrow--light" data-reveal>
              다루는 이슈
            </span>
            <h2 className="display display--xl" data-reveal>
              관심사에 맞춰 고르는 이슈 10가지
            </h2>
            <p className="lead lead--light" data-reveal>
              직무를 선택하면 관련 이슈를 추천하며, 원하는 이슈를 직접 더할 수 있습니다.
            </p>
          </div>
          <div data-reveal>
            <ButtonLink href="#download" variant="accent">
              앱 받기 <Icon name="arrowRight" size={18} />
            </ButtonLink>
          </div>
        </div>

        <div className="slider" data-reveal>
          <Swiper
            modules={[A11y]}
            slidesPerView={1.15}
            spaceBetween={16}
            speed={300}
            loop={false}
            watchSlidesProgress
            breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 24 } }}
            a11y={{ prevSlideMessage: '이전 이슈', nextSlideMessage: '다음 이슈' }}
            onSwiper={(s) => {
              setSwiper(s);
              syncEdge(s);
            }}
            onSlideChange={syncEdge}
            onResize={syncEdge}
            className="issue-swiper"
          >
            {issues.map((it, i) => (
              <SwiperSlide key={it.title}>
                <article className="issue-slide">
                  <span className="issue-slide__num">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="issue-slide__title">{it.title}</h3>
                  <p className="issue-slide__desc">{it.desc}</p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="slider__nav">
            <button type="button" className="round-button" aria-label="이전 이슈" disabled={edge.start} onClick={() => swiper?.slidePrev()}>
              <Icon name="arrowLeft" />
            </button>
            <button type="button" className="round-button" aria-label="다음 이슈" disabled={edge.end} onClick={() => swiper?.slideNext()}>
              <Icon name="arrowRight" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
