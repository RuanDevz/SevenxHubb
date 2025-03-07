import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 shadow-inner pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Logo Section */}
          <div className="w-full md:w-4/12 mb-6  md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-xl font-bold">
                <span className="text-primary">SevenX</span>
                <span className="text-gray-900 dark:text-white">Hub</span>
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              SevenXHub is a platform dedicated to adult entertainment
            </p>
          </div>

          {/* Navigation Section */}
          <div className="w-full md:w-2/12 mb-6 md:mb-0">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Section */}
          <div className="w-full md:w-2/12 mb-6 md:mb-0">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Recent Uploads
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Popular
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Featured
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="w-full md:w-4/12">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Contact</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              DMCA@SevenXHub.com
            </p>
            <p className="text-gray-600 dark:text-gray-400 flex items-center">
              Made with <Heart size={16} className="mx-1 text-primary" /> in 2025
            </p>
            {/* Social Links */}
            <div className="mt-4 flex space-x-4">

            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SevenXHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
