import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const MoviesPage = lazy(() => import('./pages/MoviesPage'));
const TVShowsPage = lazy(() => import('./pages/TVShowsPage'));
const WebSeriesPage = lazy(() => import('./pages/WebSeriesPage'));
const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const VideoPlayerPage = lazy(() => import('./pages/VideoPlayerPage'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size={40} />
  </div>
);

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// App layout with conditional navbar and footer
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isVideoPlayerPage = location.pathname === '/video-player';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] text-white">
      {/* Navigation - hidden on video player page */}
      {!isVideoPlayerPage && <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}

      {/* Main content */}
      {children}

      {/* Footer - hidden on video player page */}
      {!isVideoPlayerPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
          <Route path="/login" element={<AppLayout><LoginPage /></AppLayout>} />
          <Route path="/movies" element={<AppLayout><MoviesPage /></AppLayout>} />
          <Route path="/tv-shows" element={<AppLayout><TVShowsPage /></AppLayout>} />
          <Route path="/web-series" element={<AppLayout><WebSeriesPage /></AppLayout>} />
          <Route path="/movie/:id" element={<AppLayout><MovieDetailsPage /></AppLayout>} />
          <Route path="/video-player" element={<VideoPlayerPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/profile" 
            element={
              <AppLayout>
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              </AppLayout>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <AppLayout>
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              </AppLayout>
            } 
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;