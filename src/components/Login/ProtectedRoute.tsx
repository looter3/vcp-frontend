import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
    isAuthenticated: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated }) => {
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />; // render child routes
};

export default ProtectedRoute;
