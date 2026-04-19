import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
}

export function ErrorScreen({ 
  title = "Une erreur s'est produite",
  message = "Désolé, quelque chose s'est mal passé.",
  actionText = "Retour à l'accueil",
  actionLink = "/",
  onAction
}: ErrorScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003b71] via-[#002952] to-[#001f3f] p-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Error icon */}
        <motion.div
          className="mx-auto mb-8 w-24 h-24 relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 10,
            delay: 0.2 
          }}
        >
          {/* Background circle */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#e63946]/20 to-[#ff6b35]/20 rounded-full backdrop-blur-sm" />
          
          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-[#e63946]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h1>
          
          <p className="text-lg text-gray-300 mb-8">
            {message}
          </p>

          {/* Action button */}
          {onAction ? (
            <motion.button
              onClick={onAction}
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#e63946] to-[#ff6b35] text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-[#e63946]/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {actionText}
            </motion.button>
          ) : (
            <Link to={actionLink}>
              <motion.button
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#e63946] to-[#ff6b35] text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-[#e63946]/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {actionText}
              </motion.button>
            </Link>
          )}
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#e63946] opacity-5 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#ff6b35] opacity-5 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
