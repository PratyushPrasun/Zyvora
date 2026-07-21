import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import Loader from '@/components/ui/Loader';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuthContext();

  if (loading) return <Loader size="lg" />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
