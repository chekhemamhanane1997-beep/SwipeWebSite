import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function SwipeGuide() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the guide before
    const hasSeenGuide = localStorage.getItem('hasSeenSwipeGuide');
    
    if (!hasSeenGuide) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenSwipeGuide', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Guide Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#003b71] to-[#002952] p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">
                  Comment naviguer ?
                </h2>
                <p className="text-white/80 text-sm">
                  Utilisez les gestes de swipe pour explorer le contenu
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Vertical Swipe */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#e63946] to-[#ff6b35] rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#003b71] mb-1">
                      Swipe Vertical
                    </h3>
                    <p className="text-sm text-gray-600">
                      Balayez vers le <strong>haut</strong> pour passer à la carte suivante, 
                      vers le <strong>bas</strong> pour revenir en arrière.
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Ou utilisez les flèches ↑ ↓ du clavier
                    </div>
                  </div>
                </div>

                {/* Horizontal Swipe */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#003b71] to-[#0055a5] rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#003b71] mb-1">
                      Swipe Horizontal
                    </h3>
                    <p className="text-sm text-gray-600">
                      Balayez vers la <strong>gauche</strong> pour voir le média suivant, 
                      vers la <strong>droite</strong> pour le précédent.
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Ou utilisez les flèches ← → du clavier
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-[#003b71]/5 rounded-xl p-4 border border-[#003b71]/10">
                  <h4 className="font-semibold text-[#003b71] mb-2 flex items-center gap-2">
                    <span>💡</span>
                    Astuces
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Utilisez les points sur le côté pour naviguer rapidement</li>
                    <li>• Les vidéos se lancent automatiquement</li>
                    <li>• Appuyez sur ESC pour quitter</li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 pt-0">
                <motion.button
                  onClick={handleClose}
                  className="w-full py-3 bg-gradient-to-r from-[#e63946] to-[#ff6b35] text-white font-semibold rounded-xl shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  J'ai compris !
                </motion.button>
                <p className="text-center text-xs text-gray-500 mt-3">
                  Ce message ne s'affichera qu'une seule fois
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
