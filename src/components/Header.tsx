import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Menu, X, Heart, Clock, Flame, Star } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isPathActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Flame, label: 'Recent', path: '/recent' },
    { icon: Star, label: 'Popular', path: '/popular' },
    { icon: Clock, label: 'Featured', path: '/featured' },
  ];

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">
              <span className="text-primary">SevenX</span>
              <span className="text-gray-900 dark:text-white">Hub</span>
            </h1>
          </Link>
          
          <div className="flex items-center space-x-4 flex-1 max-w-4xl mx-8">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 ${
                  isPathActive(item.path)
                    ? 'text-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/favorites"
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                isPathActive('/favorites')
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-primary hover:text-white'
              }`}
            >
              <Heart size={20} />
              <span>Favorites</span>
            </Link>
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </div>
        </div>
        
        {/* Mobile Header */}
        <div className="flex md:hidden justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Film size={24} className="text-primary" />
            <h1 className="text-xl font-bold">
              <span className="text-primary">SevenX</span>
              <span className="text-gray-900 dark:text-white">Hub</span>
            </h1>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Link
              to="/favorites"
              className={`p-2 rounded-full ${
                isPathActive('/favorites')
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              <Heart size={20} />
            </Link>
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2 space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 p-2 rounded-lg ${
                    isPathActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;