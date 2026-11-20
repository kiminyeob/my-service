import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { testimonials } from '../../data/content';
import { Icon, PlaceholderTag, SectionHead } from '../ui';
import Modal from '../ui/Modal';

/**
 * 후기 영상 슬라이더 (loop, 가운데 카드 강조). 카드를 누르면 영상 모달이 열립니다.
 * 실제 후기가 아직 없으므로 모든 카드는 자리표시입니다.
 */
export default function Testimonials() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [video, setVideo] = useState<number | null>(null);

  return (
    <section className="panel panel--white testi">
      <div className="container stack-40">
        <div className="testi__head">
          <SectionHead eyebrow="사용 후기" title="먼저 써 본 사람들의 이야기" />
          <div data-reveal>
            <PlaceholderTag />
          </div>
        </div>
      </div>

      <div className="testi__slider" data-reveal>
        <Swiper
          modules={[A11y]}
          loop
          centeredSlides
          slidesPerView={1.25}
          spaceBetween={16}
          speed={450}
          breakpoints={{ 720: { slidesPerView: 2.2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 24 } }}
          a11y={{ prevSlideMessage: '이전 후기', nextSlideMessage: '다음 후기' }}
          onSwiper={setSwiper}
          className="testi-swiper"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <button type="button" className="testi-card" onClick={() => setVideo(i)} aria-label={`${t.name} 후기 영상 보기`}>
                <span className="testi-card__thumb">
                  <span className="testi-card__play">
                    <Icon name="play" size={22} />
                  </span>
                  <span className="testi-card__thumb-note">영상 썸네일 자리</span>
                </span>
                <span className="testi-card__meta">
                  <span className="testi-card__name">{t.name}</span>
                  <span className="testi-card__job">{t.meta}</span>
                </span>
                <span className="testi-card__months">틈틈과 함께한 지 {t.months}개월</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="slider__nav slider__nav--center">
          <button type="button" className="round-button round-button--light" aria-label="이전 후기" onClick={() => swiper?.slidePrev()}>
            <Icon name="arrowLeft" />
          </button>
          <button type="button" className="round-button round-button--light" aria-label="다음 후기" onClick={() => swiper?.slideNext()}>
            <Icon name="arrowRight" />
          </button>
        </div>
      </div>

      <Modal open={video !== null} onClose={() => setVideo(null)} title="사용 후기 영상" size="lg" tone="dark">
        <div className="video-frame">
          <Icon name="play" size={40} />
          <span>후기 영상 자리 · 실제 영상으로 교체</span>
        </div>
      </Modal>
    </section>
  );
}
