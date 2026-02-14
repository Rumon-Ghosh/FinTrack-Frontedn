import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { Home, AlertCircle, RefreshCcw } from 'lucide-react';

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-secondary/10 blur-3xl animate-pulse delay-700"></div>

            <div className="max-w-md w-full text-center relative z-10">
                <div className="mb-8 relative inline-block">
                    <div className="bg-error/10 p-6 rounded-full animate-bounce">
                        <AlertCircle className="size-20 text-error" />
                    </div>
                </div>

                <h1 className="text-7xl font-black text-base-content mb-4 tracking-tighter">404</h1>
                <h2 className="text-2xl font-bold text-base-content/80 mb-6">Oops! Unexpected Error</h2>

                <div className="bg-base-100 border border-base-content/5 p-4 rounded-2xl mb-8 shadow-sm">
                    <p className="text-base-content/60 font-medium">
                        {error?.statusText || error?.message || "The page you are looking for might have been moved or doesn't exist anymore."}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="btn btn-primary h-14 px-8 rounded-2xl shadow-lg shadow-primary/20 gap-2 text-lg"
                    >
                        <Home className="size-5" />
                        Go Back Home
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-outline h-14 px-8 rounded-2xl gap-2 text-lg hover:bg-base-100"
                    >
                        <RefreshCcw className="size-5" />
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
