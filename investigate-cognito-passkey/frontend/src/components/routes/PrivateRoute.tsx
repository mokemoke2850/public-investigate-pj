import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
