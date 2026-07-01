import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
  }
  
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('user_session');
    return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
  };

  export default ProtectedRoute;