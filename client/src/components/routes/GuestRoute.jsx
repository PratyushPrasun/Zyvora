import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import Loader from '@/components/ui/Loader';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) return <Loader size="lg" />;

  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
};

export default GuestRoute;
