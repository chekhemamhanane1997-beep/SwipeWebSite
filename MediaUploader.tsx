import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import axios from '@/lib/axios'

const R2_PUBLIC_URL = 'https://pub-bef6fcc5176049b58e3567722f0627bd.r2.dev'

export function getMediaUrl(url?: string) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${R2_PUBLIC_URL}/${url}`
}

interface MediaUploaderProps {
  cardId: string
  onUploadComplete?: (url: string, id: string) => void
  accept?: string
  label?: string
  maxSize?: number
}

export function MediaUploader({
  cardId,
  onUploadComplete,
  accept = 'image/*,video/*',
  label = 'Ajouter des médias',
  maxSize = 50,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [preview, setPreview] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSize) {
      toast.error(`Max ${maxSize}MB`)
      return
    }

    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)
    setUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await axios.post(
        `/cards/${cardId}/media`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            if (e.total) {
              setProgress(Math.round((e.loaded * 100) / e.total))
            }
          },
        }
      )

      toast.success('Média ajouté')

      // backend renvoie { _id, url }
      onUploadComplete?.(res.data.url, res.data._id)

      setPreview(null)
      setProgress(0)
    } catch (err) {
      toast.error('Erreur upload')
      console.error(err)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleSelect}
        className="hidden"
        id={`upload-${cardId}`}
      />

      <label htmlFor={`upload-${cardId}`} className="block cursor-pointer">
        <motion.div
          className="border-2 border-dashed rounded-xl p-8 text-center"
          whileHover={{ scale: 1.02 }}
        >
          {preview ? (
            preview.includes('video')
              ? (
                <video
                  src={preview}
                  className="h-40 mx-auto"
                  controls
                />
              ) : (
                <img
                  src={preview}
                  className="h-40 mx-auto"
                  alt="preview"
                />
              )
          ) : (
            <>
              <p className="font-semibold">{label}</p>
              <p className="text-sm text-gray-500">cliquez ou glissez</p>
            </>
          )}

          <AnimatePresence>
            {uploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm"
              >
                {progress} %
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </label>
    </div>
  )
}
