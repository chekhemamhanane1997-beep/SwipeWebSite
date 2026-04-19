import { useRef } from 'react'

interface SwipeOverlayProps {
    onNextMedia?: () => void
    onPrevMedia?: () => void
    onNextCard?: () => void
    onPrevCard?: () => void
    hasMultipleMedia?: boolean
}

export function SwipeOverlay({
    onNextMedia,
    onPrevMedia,
    onNextCard,
    onPrevCard,
    hasMultipleMedia,
}: SwipeOverlayProps) {
    const startX = useRef<number | null>(null)
    const startY = useRef<number | null>(null)

    return (
        <div
            className="absolute inset-0 z-40"
            onPointerDown={e => {
                startX.current = e.clientX
                startY.current = e.clientY
            }}
            onPointerUp={e => {
                if (startX.current === null || startY.current === null) return

                const dx = e.clientX - startX.current
                const dy = e.clientY - startY.current
                const threshold = 60

                // ← →
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx < -threshold && hasMultipleMedia) onNextMedia?.()
                    if (dx > threshold && hasMultipleMedia) onPrevMedia?.()
                }

                // ↑ ↓
                else {
                    if (dy < -threshold) onNextCard?.()
                    if (dy > threshold) onPrevCard?.()
                }


                startX.current = null
                startY.current = null
            }}
        >
            {/* ← */}
            {hasMultipleMedia && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15 text-3xl pointer-events-none">
                    ←
                </div>
            )}

            {/* → */}
            {hasMultipleMedia && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/15 text-3xl pointer-events-none">
                    →
                </div>
            )}

            {/* ↓ (subtil جداً) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/15 text-xl pointer-events-none">
                ↓
            </div>
        </div>
    )
}
