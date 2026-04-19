import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';
import { toast } from 'sonner';

export function Admin() {
  const { user, logout } = useAuth();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await axios.get('/pages');
      setPages(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des pages');
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await axios.post('/pages', {
        title: newPageTitle,
        slug: newPageSlug,
      });
      toast.success('Page créée avec succès');
      setNewPageTitle('');
      setNewPageSlug('');
      fetchPages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setIsCreating(false);
    }
  };

  const deletePage = async (pageId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) return;

    try {
      await axios.delete(`/pages/${pageId}`);
      toast.success('Page supprimée');
      fetchPages();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CMS Admin</h1>
              <p className="text-sm text-gray-600">Bienvenue, {user?.id}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Voir le site
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create New Page */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Créer une nouvelle page
            </h2>
            <form onSubmit={createPage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre de la page
                </label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Ma nouvelle page"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="ma-nouvelle-page"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isCreating ? 'Création...' : 'Créer'}
              </button>
            </form>
          </div>

          {/* Pages List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Pages existantes ({pages.length})
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : pages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pages.map((page) => (
                  <div
                    key={page._id}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {page.title}
                        </h3>
                        <p className="text-sm text-gray-500">/{page.slug}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/pages/${page._id}`}
                        className="flex-1 py-2 px-4 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Modifier
                      </Link>
                      <Link
                        to={`/page/${page.slug}`}
                        target="_blank"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        👁️
                      </Link>
                      <button
                        onClick={() => deletePage(page._id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-600">Aucune page créée pour le moment</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">

          <Link
            to="/admin/settings"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-center"
          >
            <div className="text-4xl mb-2">⚙️</div>
            <h3 className="font-bold text-gray-900">Paramètres & Thème</h3>
          </Link>
          <a
            href="/"
            target="_blank"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-center"
          >
            <div className="text-4xl mb-2">🌐</div>
            <h3 className="font-bold text-gray-900">Voir le site public</h3>
          </a>
        </div>
      </main>
    </div>
  );
}
