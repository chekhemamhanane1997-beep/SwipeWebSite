import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '@/lib/axios';
import { motion } from 'motion/react';

export function Home() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get('/public/pages');
        setPages(response.data);
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#003b71]">
        <motion.div
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003b71] via-[#002952] to-[#001f3f] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-[#e63946] opacity-10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-[#ff6b35] opacity-10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-6"
            >
              {/* LOGO TECCART GRAND ET CENTRÉ */}
              <svg
                viewBox="0 0 220 64"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full max-w-2xl h-24 md:h-28 lg:h-32"
              >
                {/* Icône */}
                <path
                  d="M10 12
         C10 5 16 0 24 0
         H36
         C44 0 50 5 50 12
         V52
         H24
         C16 52 10 47 10 40
         Z"
                  fill="#0B5CFF"
                />

                {/* Texte */}
                <text
                  x="62"
                  y="44"
                  fontSize="40"
                  fontWeight="700"
                  fill="white"
                  fontFamily="Inter, system-ui, sans-serif"
                  letterSpacing="-1"
                >
                  teccart
                </text>
              </svg>
            </motion.div>


            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#e63946] to-[#ff6b35] rounded-full mb-8" />
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Découvrez nos contenus interactifs en mode plein écran
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-gray-400 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Swipe vertical pour naviguer • Swipe horizontal pour les médias
          </motion.p>
        </div>

        {/* Pages Grid */}
        {pages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {pages.map((page, index) => (
              <motion.div
                key={page._id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/page/${page.slug}`}
                  className="block group relative"
                >
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-[40px] p-8 border border-white/20 shadow-2xl overflow-hidden transition-all duration-300 group-hover:border-[#e63946]/50">

                    {/* inner frame */}
                    <div className="pointer-events-none absolute inset-[1px] rounded-[14px] border border-white/10" />


                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e63946]/0 to-[#ff6b35]/0 group-hover:from-[#e63946]/10 group-hover:to-[#ff6b35]/10 transition-all duration-300" />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-[3px] h-12 bg-gradient-to-b from-[#e63946] to-[#ff6b35] rounded-full shadow-[0_0_12px_rgba(255,107,53,0.6)]" />
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                          {page.title}
                        </h2>
                      </div>

                      {page.description && (
                        <p className="text-gray-300 mb-6 line-clamp-2">
                          {page.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">

                        <motion.div

                          className="flex items-center gap-2 text-[#ff6b35]"
                          whileHover={{ x: 6 }}
                          transition={{ type: "spring", stiffness: 300 }}


                        >
                          <span className="text-sm font-semibold">Explorer</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10">
              <p className="text-xl text-gray-300">Aucune page disponible pour le moment.</p>
            </div>
          </motion.div>
        )}

        {/* Admin CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">


          </div>
        </motion.div>
      </div>
    </div>
  );
}