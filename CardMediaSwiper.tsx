import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface Media {
  _id: string
  url: string
  type: 'image' | 'video'
  altText?: string
}

interface Card {
  _id: string
  title: string
  description?: string
  media: Media[]
  date?: string
  location?: string
  duration?: string
  action?: string
}

interface CardMediaSwiperProps {
  card: Card

}

/* =======================
   R2 CONFIG
======================= */
const R2_PUBLIC_URL =
  import.meta.env.VITE_R2_PUBLIC_URL ||
  'https://pub-bef6fcc5176049b58e3567722f0627bd.r2.dev'

const getMediaUrl = (url?: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${R2_PUBLIC_URL}/${url}`
}

export function CardMediaSwiper({ card }: CardMediaSwiperProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const medias = card.media || []
  const hasMultiple = medias.length > 1
  const current = medias[index]





  useEffect(() => {
    setIndex(0)
    setDirection(0)
  }, [card._id])



  useEffect(() => {
    const next = () => {
      if (!hasMultiple) return
      if (index < medias.length - 1) {
        setDirection(1)
        setIndex(i => i + 1)
      }
    }

    const prev = () => {
      if (index > 0) {
        setDirection(-1)
        setIndex(i => i - 1)
      }
    }

    document.addEventListener('NEXT_MEDIA', next)
    document.addEventListener('PREV_MEDIA', prev)

    return () => {
      document.removeEventListener('NEXT_MEDIA', next)
      document.removeEventListener('PREV_MEDIA', prev)
    }
  }, [index, medias.length, hasMultiple])


  return (
    <div className="relative w-full h-full overflow-hidden bg-black">

      {/* MEDIA */}
      <AnimatePresence initial={false} custom={direction}>
        {current && (
          <motion.div

            key={current._id}
            custom={direction}
            initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 pointer-events-none"



          >
            {current.type === 'video' ? (
              <video
                src={getMediaUrl(current.url)}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                controls
              />
            ) : (
              <img
                src={getMediaUrl(current.url)}
                alt={current.altText || card.title}
                className="w-full h-full object-cover"

              />
            )}
          </motion.div>
        )}
      </AnimatePresence>



      {/* DOTS */}
      {hasMultiple && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {medias.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-6 bg-white/40'
                }`}
            />
          ))}
        </div>
      )}

      {/* INFO OVERLAY */}
      <div
        className="
    absolute bottom-0 left-0 right-0 z-10
    bg-gradient-to-t from-black/90 via-black/70 to-transparent
    p-6 pb-10 text-white
    flex flex-col gap-2
  "
      >
        {/* TITLE */}
        <h2 className="text-xl font-bold leading-tight">
          {card.title}
        </h2>

        {/* DESCRIPTION */}
        {card.description && (
          <p className="text-white/90 text-sm leading-snug">
            {card.description}
          </p>
        )}

        {/* META */}
        <div className="flex flex-wrap gap-4 text-xs text-white/70 mt-1">
          {card.date && (
            <span>📅 {new Date(card.date).toLocaleDateString('fr-FR')}</span>
          )}
          {card.location && <span>📍 {card.location}</span>}
          {card.duration && <span>⏱️ {card.duration}</span>}
        </div>

        {/* BUTTON */}
        {card.action && (
          <button
            className="
        mt-3 w-fit px-6 py-2 rounded-full
        bg-gradient-to-r from-[#e63946] to-[#ff6b35]
        font-semibold text-sm
      "
          >
            {card.action}
          </button>
        )}

        {/* FOOTER COUNTER */}
        <div className="mt-2 text-[11px] text-white/50 self-end">
          {medias.length > 1 && `${index + 1}/${medias.length}`} &nbsp;•&nbsp;
          Section 1 (1/1)
        </div>
      </div>

    </div>
  )
}
