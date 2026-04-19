import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '@/lib/axios';
import { toast } from 'sonner';

export function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/settings');
      setSettings(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put('/settings', settings);
      toast.success('Paramètres sauvegardés');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const updateTheme = (field, value) => {
    setSettings({
      ...settings,
      theme: {
        ...settings.theme,
        [field]: value,
      },
    });
  };

  const updateLogos = (field, value) => {
    setSettings({
      ...settings,
      logos: {
        ...settings.logos,
        [field]: value,
      },
    });
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
                Paramètres & Thème
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={saveSettings} className="space-y-8">
          {/* Theme Studio */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Studio de Thème
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur Principale
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings?.theme?.primaryColor || '#000000'}
                    onChange={(e) => updateTheme('primaryColor', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings?.theme?.primaryColor || '#000000'}
                    onChange={(e) => updateTheme('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur Secondaire
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings?.theme?.secondaryColor || '#FFFFFF'}
                    onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings?.theme?.secondaryColor || '#FFFFFF'}
                    onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Police de caractères
                </label>
                <input
                  type="text"
                  value={settings?.theme?.fontFamily || "'Inter', sans-serif"}
                  onChange={(e) => updateTheme('fontFamily', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="'Inter', sans-serif"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vitesse d'animation (secondes)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={settings?.theme?.animationSpeed || 0.5}
                  onChange={(e) => updateTheme('animationSpeed', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Logos */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Logos
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Clair (URL)
                </label>
                <input
                  type="url"
                  value={settings?.logos?.logoLight || ''}
                  onChange={(e) => updateLogos('logoLight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://example.com/logo-light.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Sombre (URL)
                </label>
                <input
                  type="url"
                  value={settings?.logos?.logoDark || ''}
                  onChange={(e) => updateLogos('logoDark', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://example.com/logo-dark.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon (URL)
                </label>
                <input
                  type="url"
                  value={settings?.logos?.favicon || ''}
                  onChange={(e) => updateLogos('favicon', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                💡 Conseil: Utilisez le gestionnaire de médias pour uploader vos logos,
                puis copiez les URLs ici.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
