import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import UserDashboard from "../layouts/UserDashboard";
import Transactions from "../pages/dashboard/Transactions";
import Analytics from "../pages/dashboard/Analytics";
import SavingsGoals from "../pages/dashboard/SavingsGoals";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ManageUsers from "../pages/dashboard/ManageUsers";
import ManageCategories from "../pages/dashboard/ManageCategories";
import AdminRoute from "./AdminRoute";
import UserRoute from "./UserRoute";
import Profile from "../pages/dashboard/Profile";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import ErrorPage from "../pages/ErrorPage";
import ManageTips from "../pages/dashboard/ManageTips";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
        errorElement: <ErrorPage />
    },
    {
        path: "/register",
        element: <Register />,
        errorElement: <ErrorPage />
    },
    {
        path: "/dashboard",
        errorElement: <ErrorPage />,
        element: (
            <PrivateRoute>
                <UserRoute>
                    <UserDashboard />
                </UserRoute>
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "/dashboard/expenses",
                element: <Transactions />
            },
            {
                path: "/dashboard/analytics",
                element: <Analytics />
            },
            {
                path: "/dashboard/goals",
                element: <SavingsGoals />
            },
            {
                path: "/dashboard/profile",
                element: <Profile />
            }
        ]
    },
    {
        path: "/admin",
        errorElement: <ErrorPage />,
        element: (
            <PrivateRoute>
                <AdminRoute>
                    <AdminDashboardLayout />
                </AdminRoute>
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/admin/dashboard" replace />
            },
            {
                path: "dashboard",
                element: <AdminDashboard />
            },
            {
                path: "users",
                element: <ManageUsers />
            },
            {
                path: "categories",
                element: <ManageCategories />
            },
            {
                path: "tips",
                element: <ManageTips />
            },
            {
                path: "profile",
                element: <Profile />
            }
        ]
    }
]);
