
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, User, LogOut, Settings, Calendar, Users, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/useSettings";
import { LucideIcon } from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon?: LucideIcon;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { settings, isLoading } = useSettings();

  // Get navigation settings with defaults
  const navSettings = settings?.navigation_settings || {
    show_promotions: true,
    show_loyalty: true,
    show_gift_cards: true,
    show_refer_friend: true
  };

  const baseNavigation: NavigationItem[] = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Book Online", href: "/book-online" },
    { name: "Contact", href: "/contact" },
  ];

  const conditionalNavigation: NavigationItem[] = [
    ...(navSettings.show_gift_cards ? [{ name: "Gift Cards", href: "/gift-card" }] : []),
    ...(navSettings.show_loyalty ? [{ name: "Loyalty", href: "/loyalty" }] : []),
    ...(navSettings.show_refer_friend ? [{ name: "Refer Friend", href: "/refer-friend" }] : []),
    ...(navSettings.show_promotions ? [{ name: "Promotions", href: "/promotions" }] : []),
  ];

  // Role-specific navigation
  const getRoleSpecificNavigation = (): NavigationItem[] => {
    if (profile?.role === 'admin') {
      return [
        { name: "Admin Dashboard", href: "/admin", icon: BarChart3 },
        { name: "Settings", href: "/admin-settings", icon: Settings },
        { name: "Appointments", href: "/admin/appointments", icon: Calendar },
        { name: "Manage Staff", href: "/admin/staff", icon: Users }
      ];
    } else if (profile?.role === 'technician') {
      return [
        { name: "My Schedule", href: "/technician/schedule", icon: Calendar },
        { name: "My Appointments", href: "/technician/appointments", icon: Calendar }
      ];
    } else if (profile?.role === 'user') {
      return [
        { name: "My Bookings", href: "/my-bookings", icon: Calendar }
      ];
    }
    return [];
  };

  const navigation: NavigationItem[] = user ? 
    [...baseNavigation, ...conditionalNavigation, ...getRoleSpecificNavigation()] :
    [...baseNavigation, ...conditionalNavigation];

  const isActive = (href: string) => location.pathname === href;

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  // Show loading state if settings are still loading
  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Beauty Plaza
              </div>
            </Link>
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Beauty Plaza
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-pink-600 flex items-center ${
                  isActive(item.href) ? "text-pink-600" : "text-gray-700"
                }`}
              >
                {item.icon && (
                  <item.icon className="w-4 h-4 mr-1" />
                )}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Call Now & Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
              onClick={() => window.open(`tel:${settings?.contact_phone || '+19039210271'}`, "_self")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="outline" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {profile?.full_name || profile?.name || 'Profile'}
                    {profile?.role && (
                      <span className="ml-2 text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                        {profile.role}
                      </span>
                    )}
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-pink-600 hover:bg-pink-700">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-lg font-medium transition-colors hover:text-pink-600 flex items-center ${
                      isActive(item.href) ? "text-pink-600" : "text-gray-700"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && (
                      <item.icon className="w-5 h-5 mr-2" />
                    )}
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    onClick={() => window.open(`tel:${settings?.contact_phone || '+19039210271'}`, "_self")}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  
                  {user ? (
                    <>
                      <Link to="/profile" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          <User className="w-4 h-4 mr-2" />
                          {profile?.full_name || profile?.name || 'Profile'}
                          {profile?.role && (
                            <span className="ml-2 text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                              {profile.role}
                            </span>
                          )}
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">Login</Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-pink-600 hover:bg-pink-700">Sign Up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
