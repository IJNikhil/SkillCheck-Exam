import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Lazy load pages for performance
const StudentPortal = React.lazy(() => import('./pages/StudentPortal'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const Login = React.lazy(() => import('./components/Login'));
const ExamPage = React.lazy(() => import('./pages/ExamPage'));
const TestSelection = React.lazy(() => import('./components/TestSelection'));

// Loading Fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Student Routes */}
          <Route path="/" element={<StudentPortal />}>
            <Route path="login" element={<Login />} />
            <Route path="select-test" element={<TestSelection />} />
            <Route path="exam" element={<ExamPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
