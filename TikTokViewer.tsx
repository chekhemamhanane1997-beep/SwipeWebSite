import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'motion/react';
import { CardMediaSwiper } from './CardMediaSwiper';
import { SwipeGuide } from './SwipeGuide';
import { ShareButton } from './ShareButton';
import { SwipeOverlay } from './SwipeOverlay';

interface Media {
  _id: string;
  url: string;
  type: 'image' | 'video';
  altText?: string;
}

interface Card {
  _id: string;
  title: string;
  description?: string;
  media: Media[];
  date?: string;
  location?: string;
  duration?: string;
  action?: string;
}

interface Section {
  _id: string;
  title: string;
  cards: Card[];
}

interface TikTokViewerProps {
  sections: Section[];
  pageTitle: string;
  pageBackground?: string;
}

export function TikTokViewer({ sections, pageTitle, pageBackground }: TikTokViewerProps) {
  // State for section and card navigation
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get current section and card
  const currentSection = sections[currentSectionIndex];
  const currentCard = currentSection?.cards[currentCardIndex];

  // Calculate total progress
  const getTotalCardsBefore = (sectionIndex: number) => {
    return sections.slice(0, sectionIndex).reduce((sum, section) => sum + section.cards.length, 0);
  };

  const totalCards = sections.reduce((sum, section) => sum + section.cards.length, 0);
  const currentGlobalIndex = getTotalCardsBefore(currentSectionIndex) + currentCardIndex;

  // Navigate to next card or section
  const goToNext = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setDirection(1);

    // Check if we're at the last card of current section
    if (currentCardIndex < currentSection.cards.length - 1) {
      // Move to next card in same section
      setCurrentCardIndex(prev => prev + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      // Move to first card of next section
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentCardIndex(0);
    }

    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Navigate to previous card or section
  const goToPrevious = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setDirection(-1);

    // Check if we're at the first card of current section
    if (currentCardIndex > 0) {
      // Move to previous card in same section
      setCurrentCardIndex(prev => prev - 1);
    } else if (currentSectionIndex > 0) {
      // Move to last card of previous section
      setCurrentSectionIndex(prev => prev - 1);
      setCurrentCardIndex(sections[currentSectionIndex - 1].cards.length - 1);
    }

    setTimeout(() => setIsTransitioning(false), 500);
  };








  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;

      if (e.key === 'ArrowUp' && currentGlobalIndex > 0) {
        goToPrevious();
      } else if (e.key === 'ArrowDown' && currentGlobalIndex < totalCards - 1) {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSectionIndex, currentCardIndex, isTransitioning, currentGlobalIndex, totalCards]);



  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden"
      style={{
        backgroundImage: pageBackground ? `url(${pageBackground})` : 'linear-gradient(135deg, #003b71 0%, #002952 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Swipe Guide (shows on first visit) */}
      <SwipeGuide />

      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Main content */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={`${currentSectionIndex}-${currentCardIndex}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}





          className="absolute inset-0 flex items-center justify-center"
        >
          {currentCard && <CardMediaSwiper card={currentCard} />}


          <SwipeOverlay
            hasMultipleMedia={currentCard.media.length > 1}
            onNextMedia={() => document.dispatchEvent(new Event('NEXT_MEDIA'))}
            onPrevMedia={() => document.dispatchEvent(new Event('PREV_MEDIA'))}
            onNextCard={goToNext}
            onPrevCard={goToPrevious}
          />





        </motion.div>
      </AnimatePresence>

      {/* Top bar with page title */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-white text-xl font-bold">{pageTitle}</h1>
            {currentSection && (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-white/70 text-sm">{currentSection.title}</p>
                <span className="text-white/50 text-xs">
                  • Section {currentSectionIndex + 1}/{sections.length}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Share button */}
            <ShareButton title={`${pageTitle} - Swipe Platform`} />

            {/* Close button */}
            <a
              href="/"
              className="text-white/90 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
          <span className="text-white text-sm font-medium">
            {currentGlobalIndex + 1} / {totalCards}
          </span>
        </div>

        {/* Section indicator */}
        <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
          <span className="text-white/70 text-xs">
            {currentSection?.title} ({currentCardIndex + 1}/{currentSection?.cards.length})
          </span>
        </div>


      </div>

      {/* Side progress dots - organized by sections */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {sections.map((section, sectionIdx) => (
          <div key={section._id} className="flex flex-col gap-1">
            {section.cards.map((card, cardIdx) => {
              const globalIdx = getTotalCardsBefore(sectionIdx) + cardIdx;
              const isCurrentSection = sectionIdx === currentSectionIndex;
              const isCurrentCard = isCurrentSection && cardIdx === currentCardIndex;

              return (
                <button
                  key={card._id}
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setDirection(globalIdx > currentGlobalIndex ? 1 : -1);
                      setCurrentSectionIndex(sectionIdx);
                      setCurrentCardIndex(cardIdx);
                      setTimeout(() => setIsTransitioning(false), 500);
                    }
                  }}
                  className={`rounded-full transition-all duration-300 ${isCurrentCard
                    ? 'bg-white w-2 h-8'
                    : isCurrentSection
                      ? 'bg-white/60 w-2 h-3 hover:bg-white/80'
                      : 'bg-white/30 w-2 h-2 hover:bg-white/50'
                    }`}
                  aria-label={`Go to ${section.title} - Card ${cardIdx + 1}`}
                />
              );
            })}
            {/* Section separator */}
            {sectionIdx < sections.length - 1 && (
              <div className="h-3" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}