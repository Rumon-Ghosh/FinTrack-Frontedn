import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            setIsLoading(false);
            console.log('Login with:', data);
        }, 2000);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-base-200">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-primary text-primary-content p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-white blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-md text-center">
                    <div className="inline-flex items-center justify-center p-3 mb-8 rounded-2xl bg-white/20 backdrop-blur-md">
                        <LayoutDashboard className="w-12 h-12" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">FinTrack</h1>
                    <p className="text-xl opacity-90 leading-relaxed">
                        The modern way to manage your personal finances. Track, analyze, and grow your wealth with ease.
                    </p>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-base-content mb-2">Welcome Back</h2>
                        <p className="text-base-content/60">Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Email Address</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className={`input input-bordered w-full pl-11 focus:border-primary transition-all duration-300 ${errors.email ? 'input-error' : ''}`}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                            </div>
                            {errors.email && <span className="text-error text-xs mt-1 ml-1">{errors.email.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Password</span>
                                <a href="#" className="label-text-alt link link-hover text-primary font-medium">Forgot?</a>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`input input-bordered w-full pl-11 pr-11 focus:border-primary transition-all duration-300 ${errors.password ? 'input-error' : ''}`}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Minimum 6 characters required" },
                                        validate: {
                                            hasUpper: (v) => /[A-Z]/.test(v) || "Must contain at least one uppercase letter",
                                            hasLower: (v) => /[a-z]/.test(v) || "Must contain at least one lowercase letter"
                                        }
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/40 hover:text-base-content transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <span className="text-error text-xs mt-1 ml-1">{errors.password.message}</span>}
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary w-full h-12 text-lg shadow-lg shadow-primary/20 ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-base-content/60">
                        Don't have an account?
                        <Link to="/register" className="link link-primary font-bold ml-2">Sign up for free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
