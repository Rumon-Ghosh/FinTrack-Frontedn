import { createContext, useEffect, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();

    // Register User
    const createUser = async (fullname, photo, email, password) => {
        setLoading(true);
        const userData = { fullname, photo, email, password, role: 'user' };
        try {
            const res = await axiosPublic.post('/users', userData);
            if (res.data.insertedId) {
                // Automatically log in after registration
                return login(email, password);
            }
            throw new Error(res.data.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    // Login User
    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await axiosPublic.post('/login', { email, password });
            if (res.data.success) {
                setUser(res.data.user);
                // JWT is handled via cookies withCredentials: true
                return res.data;
            }
            throw new Error(res.data.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    // Logout
    const logout = async () => {
        setLoading(true);
        try {
            await axiosPublic.post('/logout');
            setUser(null);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    // Observe user state (Session persistence)
    const fetchUserStatus = async () => {
        setLoading(true);
        try {
            const res = await axiosPublic.get('/me');
            if (res.data.success) {
                setUser(res.data.user);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserStatus();
    }, [axiosPublic]);

    const authInfo = {
        user,
        loading,
        createUser,
        login,
        logout,
        fetchUserStatus
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
