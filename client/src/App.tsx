import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import NoteDashboard from './components/notes/NoteDashboard';
import AddNoteForm from './components/notes/AddNoteForm';
import EditNoteForm from './components/notes/EditNoteForm';

// Protected Route wrapper component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-ink">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          bottom: 40,
        }}
        toastOptions={{
          duration: 3000,
          className: 'rounded-xl shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)]',
          style: {
            background: '#E0E5EC',
            color: '#2D3748',
            padding: '16px',
            borderRadius: '16px',
            fontSize: '14px',
            border: 'none',
            minWidth: '300px',
          },
          success: {
            icon: '✓',
            className: 'rounded-xl shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)]',
            style: {
              background: '#E0E5EC',
              color: '#059669',
              fontWeight: '600',
            },
          },
          error: {
            icon: '✕',
            className: 'rounded-xl shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)]',
            style: {
              background: '#E0E5EC',
              color: '#DC2626',
              fontWeight: '600',
            },
            duration: 4000,
          },
          loading: {
            icon: (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                  fill="none"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ),
            className: 'rounded-xl shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)]',
            style: {
              background: '#E0E5EC',
              color: '#4B5563',
              fontWeight: '600',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <NoteDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/new"
          element={
            <ProtectedRoute>
              <AddNoteForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:noteId/edit"
          element={
            <ProtectedRoute>
              <EditNoteForm />
            </ProtectedRoute>
          }
        />

        {/* Redirect root to dashboard or login */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />

        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
