import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../lib/axios';
import { toast } from 'sonner';
import { MediaUploader } from '../components/MediaUploader';
import { motion, AnimatePresence } from 'motion/react';

export function PageEditor() {
  const { pageId } = useParams();
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionLayout, setNewSectionLayout] = useState('horizontal-swipe');
  const [expandedSection, setExpandedSection] = useState(null);

  const R2_PUBLIC_URL =
    import.meta.env.VITE_R2_PUBLIC_URL ||
    'https://pub-bef6fcc5176049b58e3567722f0627bd.r2.dev'

   const getMediaUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${R2_PUBLIC_URL}/${url}`
  }



  useEffect(() => {
    fetchPageData();
  }, [pageId]);

  const fetchPageData = async () => {
    try {
      const [pageRes, sectionsRes] = await Promise.all([
        axios.get(`/pages/${pageId}`),
        axios.get(`/sections/page/${pageId}`),
      ]);
      setPage(pageRes.data);
      setSections(sectionsRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const createSection = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/sections/page/${pageId}`, {
        title: newSectionTitle,
        layout: newSectionLayout,
      });
      toast.success('Section créée');
      setNewSectionTitle('');
      fetchPageData();
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const deleteSection = async (sectionId) => {
    if (!confirm('Supprimer cette section ?')) return;
    try {
      await axios.delete(`/sections/${sectionId}`);
      toast.success('Section supprimée');
      fetchPageData();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/admin" className="text-sm text-gray-600 hover:text-gray-900">
                ← Retour au dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                Éditer: {page?.title}
              </h1>
            </div>
            <Link
              to={`/page/${page?.slug}`}
              target="_blank"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Prévisualiser
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Section Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Ajouter une section
            </h2>
            <form onSubmit={createSection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre de la section
                </label>
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Ma section"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de layout
                </label>
                <select
                  value={newSectionLayout}
                  onChange={(e) => setNewSectionLayout(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="horizontal-swipe">Horizontal Swipe</option>
                  <option value="grid">Grille</option>
                  <option value="vertical-list">Liste Verticale</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Créer la section
              </button>
            </form>
          </div>

          {/* Sections List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Sections ({sections.length})
            </h2>

            {sections.length > 0 ? (
              <div className="space-y-4">
                {sections.map((section) => (
                  <div
                    key={section._id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg mb-1">
                            {section.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {section.layout} · {section.cards?.length || 0} carte(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedSection(
                              expandedSection === section._id ? null : section._id
                            )}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            {expandedSection === section._id ? 'Réduire' : 'Gérer les cartes'}
                          </button>
                          <button
                            onClick={() => deleteSection(section._id)}
                            className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>

                      {expandedSection === section._id && (
                        <SectionCardManager section={section} onUpdate={fetchPageData} getMediaUrl={getMediaUrl} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-600">
                  Aucune section. Créez-en une pour commencer.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}



function SectionCardManager({ section, onUpdate, getMediaUrl }) {




  const [newCard, setNewCard] = useState({
    title: '',
    description: '',
    action: 'participer',
    date: '',
    location: '',
    duration: '',
  });



  const [editingCardMedia, setEditingCardMedia] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [cardMedias, setCardMedias] = useState({});


  const createCard = async (e) => {
    e.preventDefault();
    try {


      await axios.post(`/cards/section/${section._id}`, newCard);
      toast.success('Carte créée avec succès');
      setNewCard({
        title: '',
        description: '',
        action: 'participer',
        date: '',
        location: '',
        duration: '',
      });

      setShowCreateForm(false);
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };



  const handleCardMediaUpload = (cardId, url, id) => {
    setCardMedias(prev => ({
      ...prev,
      [cardId]: [...(prev[cardId] || []), { url, id }]
    }));




  };



  const removeCardMedia = (cardId, mediaId) => {
    setCardMedias(prev => ({
      ...prev,
      [cardId]: (prev[cardId] || []).filter(m => m.id !== mediaId)
    }));
  };

  const saveCardMedias = async (cardId) => {
    const medias = cardMedias[cardId] || [];

    await axios.put(`/cards/${cardId}`, {
      mediaIds: medias.map(m => m.id)
    });

    toast.success('Carte mise à jour');
    setEditingCardMedia(null);
    onUpdate();
  };


  const deleteCard = async (cardId) => {
    if (!confirm('Supprimer cette carte ?')) return;
    try {
      await axios.delete(`/cards/${cardId}`);
      toast.success('Carte supprimée');
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };




  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">Cartes de la section</h4>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-3 py-1 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          {showCreateForm ? 'Annuler' : '+ Ajouter une carte'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={createCard} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mb-4 space-y-4 border-2 border-[#003b71]/10">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                value={newCard.title}
                onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003b71] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action
              </label>
              <select
                value={newCard.action}
                onChange={(e) => setNewCard({ ...newCard, action: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003b71] focus:border-transparent"
              >
                <option value="participer">Participer</option>
                <option value="sinscrire">S'inscrire</option>
                <option value="acheter">Acheter</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newCard.description}
              onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003b71] focus:border-transparent"
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={newCard.date}
                onChange={(e) => setNewCard({ ...newCard, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003b71] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lieu
              </label>
              <input
                type="text"
                value={newCard.location}
                onChange={(e) => setNewCard({ ...newCard, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003b71] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée
              </label>
              <input
                type="text"
                value={newCard.duration}
                onChange={(e) => setNewCard({ ...newCard, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003b71] focus:border-transparent"
                placeholder="2h"
              />
            </div>
          </div>



          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#003b71] to-[#e63946] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            Créer la carte
          </button>
        </form>
      )}

      {section.cards && section.cards.length > 0 ? (
        <div className="space-y-2">
          {section.cards.map((card) => {
            const firstMedia = card.media?.[0];

            return (
              <div
                key={card._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="flex items-center justify-between bg-gradient-to-r from-white to-gray-50 p-4 hover:border-[#003b71]/30 transition-all">
                  <div className="flex items-center gap-3 flex-1">

                    {/* Media indicator */}
                    {firstMedia && (
                      <div className="flex-shrink-0">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-[#003b71]/20">

                          {firstMedia.type === 'video' ? (
                            <video
                              src={getMediaUrl(firstMedia.url)}
                              className="w-full h-16 object-cover"
                            />
                          ) : (
                            <img
                              src={getMediaUrl(firstMedia.url)}
                              className="w-full h-16 object-cover"
                              alt=""
                            />
                          )}

                          {card.media?.length > 1 && (
                            <div className="absolute bottom-1 right-1 bg-[#003b71] text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                              +{card.media.length - 1}
                            </div>
                          )}
                        </div>
                      </div>
                    )}



                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{card.title}</p>
                        {card.media && card.media.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#003b71]/10 text-[#003b71] text-xs rounded-full font-medium">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            {card.media.length}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{card.description}</p>
                      {(card.date || card.location) && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          {card.date && (
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(card.date).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                          {card.location && (
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {card.location}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setEditingCardMedia(editingCardMedia === card._id ? null : card._id)}
                      className="px-3 py-2 text-sm text-[#003b71] bg-[#003b71]/10 rounded-lg hover:bg-[#003b71]/20 transition-colors font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Médias
                    </button>
                    <button
                      onClick={() => deleteCard(card._id)}
                      className="px-3 py-2 text-sm text-white bg-[#e63946] rounded-lg hover:bg-[#d62839] transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

                {/* Media Management Section */}
                <AnimatePresence>
                  {editingCardMedia === card._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-gray-900">Gérer les médias de cette carte</h5>

                        </div>

                        {/* Display existing + new medias */}
                        {((card.media && card.media.length > 0) || (cardMedias[card._id] && cardMedias[card._id].length > 0)) && (
                          <div className="grid grid-cols-4 gap-3">
                            {/* Existing medias */}
                            {card.media && card.media.map((media, index) => (
                              <div
                                key={`existing-${card._id}-${media._id || index}`}


                                className="relative group rounded-lg overflow-hidden border-2 border-gray-300"
                              >

                                {media.type === 'video' ? (
                                  <video src={getMediaUrl(media.url)}
                                    className="w-full h-24 object-cover" />
                                ) : (
                                  <img src={getMediaUrl(media.url)} className="w-full h-24 object-cover" />
                                )}


                                <div className="absolute top-2 left-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full font-medium">
                                  {index + 1}
                                </div>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded">
                                    Existant
                                  </span>
                                </div>
                              </div>
                            ))}

                            {/* New medias to add */}
                            {cardMedias[card._id] && cardMedias[card._id].map((media, index) => (
                              <motion.div
                                key={`new-${card._id}-${media.id || index}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative group rounded-lg overflow-hidden border-2 border-[#003b71]/30"
                              >
                                {media?.url && (
                                  media.url.includes('video') || media.url.endsWith('.mp4') ? (
                                    <video
                                      src={getMediaUrl(media.url)}

                                      className="w-full h-24 object-cover"
                                    />
                                  ) : (
                                    <img
                                      src={getMediaUrl(media.url)}
                                      className="w-full h-24 object-cover"
                                    />
                                  )
                                )}


                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => removeCardMedia(card._id, media.id)}
                                    className="bg-[#e63946] text-white p-2 rounded-full hover:bg-[#d62839] transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                                <div className="absolute top-2 left-2 bg-[#003b71] text-white text-xs px-2 py-1 rounded-full font-medium">
                                  {(card.media?.length || 0) + index + 1}
                                </div>
                              </motion.div>

                            ))}
                          </div>
                        )}

                        <MediaUploader
                          cardId={card._id}   // ✅ OBLIGATOIRE
                          onUploadComplete={(url, id) =>
                            handleCardMediaUpload(card._id, url, id)
                          }
                          label="Ajouter des médias"
                          maxSize={50}
                        />


                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            💡 Les nouveaux médias seront ajoutés à la fin
                          </p>

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          Aucune carte dans cette section
        </p>
      )}
    </div>
  );
}