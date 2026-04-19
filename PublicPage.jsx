import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from '@/lib/axios'
import { TikTokViewer } from '../components/TikTokViewer'
import { LoadingScreen } from '../components/LoadingScreen'
import { ErrorScreen } from '../components/ErrorScreen'
import { toast } from 'sonner'

export const R2_PUBLIC_URL =
  import.meta.env.VITE_R2_PUBLIC_URL ||
  'https://pub-bef6fcc5176049b58e3567722f0627bd.r2.dev'

export const getMediaUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${R2_PUBLIC_URL}/${url}`
}


export function PublicPage() {
  const { slug } = useParams()

  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await axios.get(`/public/slug/${slug}`)
        setPage(res.data)
        setError(false)
      } catch (err) {
        console.error('PUBLIC PAGE ERROR:', err)
        setError(true)
        toast.error('Page non trouvée')
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchPage()
  }, [slug])

  if (loading) {
    return <LoadingScreen message="Chargement de la page..." />
  }

  if (error || !page) {
    return (
      <ErrorScreen
        title="Page non trouvée"
        message="La page que vous recherchez n'existe pas ou a été supprimée."
        actionText="Retour à l'accueil"
        actionLink="/"
      />
    )
  }

  const sections = page.sections || []
  const hasCards = sections.some(
    (section) => section.cards && section.cards.length > 0
  )

  if (!hasCards) {
    return (
      <ErrorScreen
        title={page.title}
        message="Aucun contenu disponible pour cette page."
        actionText="Retour à l'accueil"
        actionLink="/"
      />
    )
  }

  return (
    <TikTokViewer
      sections={sections}
      pageTitle={page.title}
      pageBackground={getMediaUrl(page.backgroundImage)}
    />
  )
}
