import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const UserRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    // Check if user exists AND is NOT an admin
    if (user && user.role !== 'admin') {
        return children;
    }

    // If admin, send to admin dashboard
    if (user && user.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // If not logged in, send to login
    return <Navigate to="/" state={location.pathname} replace />;
};

export default UserRoute;
