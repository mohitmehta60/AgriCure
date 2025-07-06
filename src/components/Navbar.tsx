import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="AgriCure Logo" className="h-8 w-8" />
            <span className="text-2xl font-bold text-grass-800">AgriCure</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-grass-600 transition-colors font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-grass-600 transition-colors font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-700 hover:text-grass-600 transition-colors font-medium"
            >
              How It Works
            </button>
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-grass-600 hover:bg-grass-700">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-4 pt-4">
              {/* Navigation Links */}
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left text-gray-700 hover:text-grass-600 transition-colors font-medium py-2 px-2 rounded-md hover:bg-grass-50"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-left text-gray-700 hover:text-grass-600 transition-colors font-medium py-2 px-2 rounded-md hover:bg-grass-50"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-gray-700 hover:text-grass-600 transition-colors font-medium py-2 px-2 rounded-md hover:bg-grass-50"
              >
                How It Works
              </button>
              
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <Button 
                  asChild 
                  variant="outline" 
                  className="justify-start w-full border-grass-300 text-grass-700 hover:bg-grass-50 hover:text-grass-800 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/login">
                    <span className="text-base font-medium">Login</span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="justify-start w-full bg-grass-600 hover:bg-grass-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/signup">
                    <span className="text-base font-medium">Get Started</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;