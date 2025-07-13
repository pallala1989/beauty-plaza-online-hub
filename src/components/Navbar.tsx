
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Beauty Plaza
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
            >
              Services
            </Link>
            <Link 
              to="/book-online" 
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
            >
              Book Online
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
            >
              Contact
            </Link>
            
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.name || 'Account'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-bookings" className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 pb-4">
            <div className="pt-4 space-y-2">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/services" 
                className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/book-online" 
                className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Book Online
              </Link>
              <Link 
                to="/contact" 
                className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              
              {user ? (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <Link 
                      to="/profile" 
                      className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/my-bookings" 
                      className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      My Bookings
                    </Link>
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
