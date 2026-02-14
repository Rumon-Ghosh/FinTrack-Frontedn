import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

const useAxiosSecure = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        axiosSecure.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const status = error.response ? error.response.status : null;

                if (status === 401 || status === 403) {
                    await logout();
                    navigate('/');
                }
                return Promise.reject(error);
            }
        );
    }, [logout, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;
