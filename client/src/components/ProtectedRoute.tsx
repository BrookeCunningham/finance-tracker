// navigate means you can redirect
import { Navigate } from 'react-router-dom';
// need to use authcontext hook
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  // basically implementing auth
  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;