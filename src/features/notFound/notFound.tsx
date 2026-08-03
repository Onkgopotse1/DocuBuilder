import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12 dark:bg-gray-900">
      <div className="text-center">
        {/* 404 Badge / Heading */}
        <p className="text-base font-semibold text-blue-600 dark:text-blue-500">404</p>
        
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Page not found
        </h1>
        
        <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
          Sorry, we couldn’t find the page you’re looking for.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-center gap-x-4">
          <Link
            to="/"
            className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            Go back home
          </Link>
          
        </div>
      </div>
    </main>
  );
};

export default NotFound;