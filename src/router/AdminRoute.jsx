import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <span className="loading loading-bars loading-lg text-primary"></span>
            </div>
        );
    }

    // Check if user exists AND has the role of 'admin'
    if (user && user.role === 'admin') {
        return children;
    }

    // If regular user, send back to dashboard
    if (user && user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    // If not logged in, send to login
    return <Navigate to="/" state={location.pathname} replace />;
};

export default AdminRoute;
