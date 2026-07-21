import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, FreeMode, Navigation } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

const ProductImageGallery = ({ images = [] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  if (!images.length) {
    return (
      <div className="aspect-square bg-surface-dark rounded-2xl flex items-center justify-center">
        <span className="text-muted">No images</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative group overflow-hidden rounded-2xl bg-surface aspect-square">
        <Swiper
          modules={[Thumbs, Navigation]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          navigation
          className="h-full product-gallery-swiper"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={img.url}
                alt={`Product image ${i + 1}`}
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 group-hover:scale-[1.02]"
                onClick={() => setLightbox(img.url)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          onClick={() => setLightbox(images[0]?.url)}
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
              <div className="aspect-square rounded-xl overflow-hidden border-2 border-transparent cursor-pointer hover:border-accent/40 transition-all duration-200 [.swiper-slide-thumb-active_&]:border-accent [.swiper-slide-thumb-active_&]:shadow-sm [.swiper-slide-thumb-active_&]:shadow-accent/10">
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
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              src={lightbox}
              alt="Zoomed product"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductImageGallery;
