import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowRightLeft,
  Settings,
  LogOut,
  PieChart,
  TrendingUp,
  Wallet,
  Menu,
  Users,
  Layers,
  ShieldCheck,
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const userLinks = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard className="size-5" />,
      label: "Overview",
    },
    {
      to: "/dashboard/expenses",
      icon: <ArrowRightLeft className="size-5" />,
      label: "Transactions",
    },
    {
      to: "/dashboard/analytics",
      icon: <PieChart className="size-5" />,
      label: "Insights",
    },
    {
      to: "/dashboard/goals",
      icon: <TrendingUp className="size-5" />,
      label: "Savings Goals",
    },
  ];

  const adminLinks = [
    {
      to: "/dashboard/admin",
      icon: <ShieldCheck className="size-5" />,
      label: "Admin Stats",
    },
    {
      to: "/dashboard/admin/users",
      icon: <Users className="size-5" />,
      label: "Manage Users",
    },
    {
      to: "/dashboard/admin/categories",
      icon: <Layers className="size-5" />,
      label: "Manage Categories",
    },
  ];

  const isAdmin = user?.role === "admin";

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col bg-base-200/50 min-h-screen">
        {/* Top Navbar */}
        <header className="navbar bg-base-100 border-b border-base-content/5 px-4 lg:px-6 h-16 shrink-0">
          <div className="flex-1 lg:hidden">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-ghost btn-square drawer-button"
            >
              <Menu className="size-6" />
            </label>
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-bold lg:ml-2">FinTrack Dashboard</h1>
          </div>

          <div className="flex gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <p className="text-sm font-bold">{user?.fullname}</p>
              <p className="text-xs opacity-60 uppercase tracking-tighter">
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
                className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-content/5"
              >
                <li>
                  <Link to="/dashboard/profile">
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
          htmlFor="dashboard-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="w-64 min-h-full bg-base-100 border-r border-base-content/5 flex flex-col">
          {/* Logo Section */}
          <div className="h-16 flex items-center px-6 border-b border-base-content/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Wallet className="size-5 text-primary-content" />
              </div>
              <span className="text-xl font-black tracking-tight text-primary">
                FinTrack
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="text-[10px] font-black uppercase tracking-widest opacity-40 px-4 mb-2">
              Main Menu
            </div>
            {userLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/dashboard"}
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

          {/* Footer Sidebar */}
          <div className="p-4 border-t border-base-content/5">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest text-center">
                Pro Member
              </p>
              <div className="h-2 w-full bg-base-200 rounded-full mt-2">
                <div className="h-full bg-primary rounded-full w-[80%]"></div>
              </div>
              <p className="text-[10px] mt-2 opacity-60 text-center">
                Your financial health is Excellent!
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default UserDashboard;
