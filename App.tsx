import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import { Home } from '@/pages/Home';
import { PublicPage } from '@/pages/PublicPage';

import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Admin } from '@/pages/Admin';
import { PageEditor } from '@/pages/PageEditor';
import { Settings } from '@/pages/Settings';
import { SideSwipeMenu } from '@/pages/SideSwipeMenu';



export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" richColors />
        <SideSwipeMenu />
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/page/:slug" element={<PublicPage />} />


          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pages/:pageId"
            element={
              <ProtectedRoute>
                <PageEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}