import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import axios from '@/lib/axios'

interface Page {
    _id: string
    title: string
    slug: string
}

export function SideSwipeMenu() {
    const [open, setOpen] = useState(false)
    const [pages, setPages] = useState<Page[]>([])

    /* =====================
       FETCH PAGES
    ====================== */
    useEffect(() => {
        axios.get('/public/pages')
            .then(res => setPages(res.data))
            .catch(() => setPages([]))
    }, [])

    return (
        <>
            {/* ===== SWIPE / CLICK TRIGGER (LIGNE GRISE) ===== */}
            <div
                onClick={() => setOpen(true)}
                className="
          fixed left-1 top-1/2 -translate-y-1/2
          w-1.5 h-24
          bg-white/40 rounded-full
          z-[100]
          cursor-pointer
        "
            />

            {/* ===== MENU ===== */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* BACKDROP */}
                        <motion.div
                            className="fixed inset-0 bg-black/30 z-[90]"
                            onClick={() => setOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* PANEL */}
                        <motion.div
                            className="
                fixed top-0 left-0 h-full w-30 sm:w-30 md:w-33
                backdrop-blur-xl
                bg-white/10
                border-r border-white/20
                z-[100]
                px-4 py-6
                flex flex-col gap-4
              "
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                        >
                            {/* TITLE */}
                            <h2 className="text-white font-semibold text-lg mb-2">
                                Navigation
                            </h2>

                            {/* ===== PAGES (FETCHED) ===== */}
                            <div className="flex flex-col gap-2">
                                {pages.map(page => (
                                    <Link
                                        key={page._id}
                                        to={`/page/${page.slug}`}
                                        onClick={() => setOpen(false)}
                                        className="
                      flex items-center gap-3
                      px-3 py-2 rounded-lg
                      text-white/80 hover:text-white
                      hover:bg-white/10
                      transition
                    "
                                    >
                                        📄
                                        <span className="text-sm">{page.title}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="h-px bg-white/20 my-2" />

                            {/* À PROPOS */}
                            <a
                                href="https://www.teccart.qc.ca/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setOpen(false)}
                                className="
    flex items-center gap-3
    px-3 py-2 rounded-lg
    text-white/80 hover:text-white
    hover:bg-white/10
  "
                            >
                                ℹ️ <span className="text-sm"> Teccart</span>
                            </a>


                            {/* ADMIN */}
                            <Link
                                to="/admin"
                                onClick={() => setOpen(false)}
                                className="
                  mt-auto
                  flex items-center justify-center gap-2
                  py-2 rounded-xl
                  bg-gradient-to-r from-[#e63946] to-[#ff6b35]
                  text-white font-semibold text-sm
                "
                            >
                                Admin
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
