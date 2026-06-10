import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { galleryItems } from '../data/mockData';
import type { GalleryItem } from '../data/types';

interface GalleryProps {
  isUrdu: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ isUrdu }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const filters = [
    { key: 'all', labelEn: 'All', labelUr: 'سب' },
    { key: 'events', labelEn: 'Events', labelUr: 'تقریبات' },
    { key: 'programs', labelEn: 'Programs', labelUr: 'پروگرامز' },
    { key: 'community', labelEn: 'Community', labelUr: 'کمیونٹی' },
    { key: 'media', labelEn: 'Media', labelUr: 'میڈیا' },
  ];

  const filtered = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(g => g.category === activeFilter);

  // Close lightbox on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Scroll lock when lightbox is open
  React.useEffect(() => {
    document.body.style.overflow = selectedImage ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedImage]);

  return (
    <>
      <Helmet>
        <title>{isUrdu ? 'گیلری | IOCA' : 'Gallery | IOCA'}</title>
        <meta name="description" content="Browse photos from IOCA's events, programs, and community outreach across Pakistan." />
      </Helmet>

      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-16">
          {/* Header */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={`text-4xl md:text-6xl font-extrabold text-brand-navy mb-4 ${isUrdu ? 'font-urduHeading' : ''}`}>
              {isUrdu ? 'گیلری' : 'Gallery'}
            </h1>
            <p className="text-brand-navy/60 text-base md:text-lg max-w-2xl">
              {isUrdu
                ? 'ہمارے پروگراموں، تقریبات اور کمیونٹی سرگرمیوں کی تصاویر۔'
                : 'Photos from our programs, events, and community activities across Pakistan.'}
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === f.key
                    ? 'bg-brand-teal text-brand-white shadow-md'
                    : 'bg-brand-white text-brand-navy/70 hover:bg-brand-teal/10 border border-brand-navy/10'
                }`}
              >
                {isUrdu ? f.labelUr : f.labelEn}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((item, idx) => (
              <motion.button
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow aspect-square cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-gold"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <img
                  src={item.image}
                  alt={isUrdu ? item.captionUr : item.captionEn}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end p-3">
                  <p className="text-white text-xs md:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                    {isUrdu ? item.captionUr : item.captionEn}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-brand-navy/40">
              <p className="text-lg">{isUrdu ? 'کوئی تصویر نہیں ملی۔' : 'No images found.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10"
              onClick={() => setSelectedImage(null)}
              aria-label={isUrdu ? 'بند کریں' : 'Close'}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              src={selectedImage.image}
              alt={isUrdu ? selectedImage.captionUr : selectedImage.captionEn}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
            <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center text-sm md:text-base max-w-lg">
              {isUrdu ? selectedImage.captionUr : selectedImage.captionEn}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
