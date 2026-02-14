import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    ShieldCheck,
    Users,
    Layers,
    Settings,
    LogOut,
    Menu,
    Wallet,
    LayoutDashboard,
    Lightbulb
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const AdminDashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // LogOut Function
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const adminLinks = [
        {
            to: "/admin/dashboard",
            icon: <LayoutDashboard className="size-5" />,
            label: "Admin Stats",
        },
        {
            to: "/admin/users",
            icon: <Users className="size-5" />,
            label: "Manage Users",
        },
        {
            to: "/admin/categories",
            icon: <Layers className="size-5" />,
            label: "Manage Categories",
        },
        {
            to: "/admin/tips",
            icon: <Lightbulb className="size-5" />,
            label: "Manage Tips",
        },
    ];

    return (
        <div className="drawer lg:drawer-open">
            <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col bg-base-200/50 min-h-screen">
                {/* Top Navbar */}
                <header className="navbar bg-base-100 border-b border-base-content/5 px-4 lg:px-6 h-16 shrink-0">
                    <div className="flex-1 lg:hidden">
                        <label
                            htmlFor="admin-drawer"
                            className="btn btn-ghost btn-square drawer-button"
                        >
                            <Menu className="size-6" />
                        </label>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-xl font-bold lg:ml-2">Admin Dashboard</h1>
                    </div>

                    <div className="flex gap-4">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <p className="text-sm font-bold">{user?.fullname}</p>
                            <p className="text-xs text-primary font-black uppercase tracking-tighter">
                                {user?.role}
                            </p>
                        </div>
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar border-2 border-primary/20 p-0.5"
                            >
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="User Avatar"
                                        src={
                                            user?.photo ||
                                            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                        }
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="mt-3 z-50 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-content/5"
                            >
                                <li>
                                    <Link to="/admin/profile">
                                        <Settings className="size-4" /> Profile Settings
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="text-error">
                                        <LogOut className="size-4" /> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </header>

                {/* Main Page Area */}
                <main className="p-4 lg:p-8 flex-1">
                    <Outlet />
                </main>
            </div>

            {/* Sidebar */}
            <aside className="drawer-side z-30">
                <label
                    htmlFor="admin-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>
                <div className="w-64 min-h-full bg-base-100 border-r border-base-content/5 flex flex-col">
                    {/* Logo Section */}
                    <div className="h-16 flex items-center px-6 border-b border-base-content/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <ShieldCheck className="size-5 text-primary-content" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-primary">
                                FinTrack Admin
                            </span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40 px-4 mb-4">Administration</div>
                        {adminLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === "/admin/dashboard"}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                                        : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
                                    }`
                                }
                            >
                                {link.icon}
                                <span className="font-medium">{link.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                </div>
            </aside>
        </div>
    );
};

export default AdminDashboardLayout;
