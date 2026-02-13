import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Camera, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        // setIsLoading(true);
        const {fullname, photo, email, password} = data;
        console.log(fullname, photo, email, password);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-base-200">
            {/* Left Side - Decorative Section */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-primary text-primary-content p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-white blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-md text-center">
                    <div className="inline-flex items-center justify-center p-3 mb-8 rounded-2xl bg-white/20 backdrop-blur-md">
                        <LayoutDashboard className="w-12 h-12" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">Join FinTrack</h1>
                    <p className="text-xl opacity-90 leading-relaxed">
                        Start your journey to financial freedom today. Create an account and take control of your future.
                    </p>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <Link to="/" className="inline-flex items-center text-primary hover:gap-2 transition-all gap-1 font-medium mb-6">
                            <ArrowLeft className="w-4 h-4" />
                            Back to login
                        </Link>
                        <h2 className="text-3xl font-bold text-base-content mb-2">Create an account</h2>
                        <p className="text-base-content/60">Fill in your details to get started</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Full Name */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">Full Name</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className={`input input-bordered w-full pl-11 focus:border-primary transition-all duration-300 ${errors.fullname ? 'input-error' : ''}`}
                                    {...register("fullname", { required: "Full Name is required" })}
                                />
                            </div>
                            {errors.fullname && <span className="text-error text-xs mt-1 ml-1">{errors.fullname.message}</span>}
                        </div>

                        {/* Photo URL */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">Photo URL</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                                    <Camera className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="https://example.com/photo.jpg"
                                    className={`input input-bordered w-full pl-11 focus:border-primary transition-all duration-300 ${errors.photo ? 'input-error' : ''}`}
                                    {...register("photo", { required: "Photo URL is required" })}
                                />
                            </div>
                            {errors.photo && <span className="text-error text-xs mt-1 ml-1">{errors.photo.message}</span>}
                        </div>

                        {/* Email */}
                        <div className="form-control w-full">
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

                        {/* Password */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">Password</span>
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
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z]+$/,
                                            message: "Password must contain at least one uppercase and one lowercase letter"
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
                            className={`btn btn-primary w-full h-12 text-lg shadow-lg shadow-primary/20 mt-4 ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-base-content/60">
                        Already have an account?
                        <Link to="/" className="link link-primary font-bold ml-2">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
