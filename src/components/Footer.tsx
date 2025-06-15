
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Beauty Plaza
            </div>
            <p className="text-gray-400 mb-4">
              Experience luxury beauty services in our modern, welcoming environment. 
              Your beauty transformation starts here.
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <Phone className="w-4 h-4" />
              <span>(903) 921-0271</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/services" className="block text-gray-400 hover:text-pink-400 transition-colors">
                Services
              </Link>
              <Link to="/book-online" className="block text-gray-400 hover:text-pink-400 transition-colors">
                Book Online
              </Link>
              <Link to="/gift-card" className="block text-gray-400 hover:text-pink-400 transition-colors">
                Gift Cards
              </Link>
              <Link to="/promotions" className="block text-gray-400 hover:text-pink-400 transition-colors">
                Promotions
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Visit Us</h3>
            <div className="text-gray-400 space-y-2">
              <p>2604 Jacqueline Dr</p>
              <p>Wilmington, DE - 19810</p>
              <p className="mt-4">
                <strong className="text-white">Hours:</strong><br />
                Mon-Sat: 9AM - 7PM<br />
                Sunday: 10AM - 5PM
              </p>
              <div className="mt-4">
                <a 
                  href="tel:+19039210271" 
                  className="inline-flex items-center text-pink-400 hover:text-pink-300 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  (903) 921-0271
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Beauty Plaza. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
