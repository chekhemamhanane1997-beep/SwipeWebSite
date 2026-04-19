import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import axios from '@/lib/axios';
import { toast } from 'sonner';

interface BackgroundUploaderProps {
  currentBackground?: string;
  onUploadComplete?: (backgroundUrl: string) => void;
  pageId?: string;
}


export const R2_PUBLIC_URL =
  import.meta.env.VITE_R2_PUBLIC_URL ||
  'https://pub-bef6fcc5176049b58e3567722f0627bd.r2.dev'

export const getMediaUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${R2_PUBLIC_URL}/${url}`;
};


export function BackgroundUploader({
  currentBackground,
  onUploadComplete,
  pageId
}: BackgroundUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentBackground || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Validate file size (max 10MB for backgrounds)
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 10) {
      toast.error('L\'image est trop volumineuse. Taille maximale: 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    const formData = new FormData();
    formData.append('media', file);

    try {
      setUploading(true);

      const response = await axios.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { url } = response.data;

      // If we have a pageId, update the page background
      if (pageId) {
        await axios.patch(`/pages/${pageId}`, {
          backgroundImage: url,
        });
      }

      toast.success('Image de fond téléchargée avec succès');

      if (onUploadComplete) {
        onUploadComplete(url);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Erreur lors du téléchargement');
      setPreview(currentBackground || null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveBackground = async () => {
    if (!pageId) return;

    try {
      await axios.patch(`/pages/${pageId}`, {
        backgroundImage: null,
      });

      setPreview(null);
      toast.success('Image de fond supprimée');

      if (onUploadComplete) {
        onUploadComplete('');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-[#003b71] mb-2">
        Image de fond de la page
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="background-upload"
      />

      <div className="relative">
        {preview ? (
          <motion.div
            className="relative group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative h-48 rounded-xl overflow-hidden border-2 border-[#003b71]/20">
              <img
                src={preview.startsWith('data:') ? preview : getMediaUrl(preview)}
                alt="Page background"
                className="w-full h-full object-cover"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <label
                  htmlFor="background-upload"
                  className="px-4 py-2 bg-white text-[#003b71] rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  Changer
                </label>
                <button
                  onClick={handleRemoveBackground}
                  className="px-4 py-2 bg-[#e63946] text-white rounded-lg hover:bg-[#d4183d] transition-colors"
                >
                  Supprimer
                </button>
              </div>

              {uploading && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <label
            htmlFor="background-upload"
            className="block cursor-pointer"
          >
            <motion.div
              className="h-48 border-2 border-dashed border-[#003b71]/30 rounded-xl hover:border-[#e63946]/50 transition-all bg-gradient-to-br from-[#003b71]/5 to-[#002952]/5 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="mx-auto w-12 h-12 mb-3">
                  <svg
                    className="w-full h-full text-[#003b71]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-[#003b71]">Ajouter une image de fond</p>
                <p className="text-sm text-gray-500 mt-1">Cliquez pour sélectionner</p>
              </div>
            </motion.div>
          </label>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Recommandé: Image haute résolution (1920x1080 ou plus) • Max 10MB
      </p>
    </div>
  );
}
