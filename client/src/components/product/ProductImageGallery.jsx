import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, FreeMode, Navigation } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

const ProductImageGallery = ({ images = [] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square bg-surface-dark rounded-2xl flex items-center justify-center border border-border/40">
        <span className="text-muted">No images</span>
      </div>
    );
  }

  const openLightbox = (index) => {
    setLightbox(index);
  };

  const navigateLightbox = (direction) => {
    if (lightbox === null) return;
    const next = lightbox + direction;
    if (next >= 0 && next < images.length) {
      setLightbox(next);
    }
  };

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative group overflow-hidden rounded-2xl bg-surface aspect-square border border-border/30">
        <Swiper
          modules={[Thumbs, Navigation]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          navigation
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="h-full product-gallery-swiper"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={img.url}
                alt={`Product image ${i + 1}`}
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 group-hover:scale-[1.02]"
                onClick={() => openLightbox(i)}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Image counter */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {activeIndex + 1} / {images.length}
        </div>

        <button
          onClick={() => openLightbox(activeIndex)}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-sm"
          aria-label="Zoom image"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbsSwiper}
          slidesPerView={4}
          spaceBetween={10}
          freeMode
          watchSlidesProgress
          className="thumbnails-swiper"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <div className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                activeIndex === i
                  ? 'border-accent shadow-sm shadow-accent/10'
                  : 'border-transparent hover:border-accent/40'
              } [.swiper-slide-thumb-active_&]:border-accent [.swiper-slide-thumb-active_&]:shadow-sm [.swiper-slide-thumb-active_&]:shadow-accent/10`}>
                <img
                  src={img.url}
                  alt={`Thumb ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all z-10"
              aria-label="Close lightbox"
              onClick={() => setLightbox(null)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation arrows */}
            {lightbox > 0 && (
              <button
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all z-10"
                onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {lightbox < images.length - 1 && (
              <button
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all z-10"
                onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <motion.img
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              src={images[lightbox]?.url}
              alt="Zoomed product"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image counter in lightbox */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full">
              {lightbox + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductImageGallery;
