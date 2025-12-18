import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import logo from '../../assets/logo2.jpg'

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100' 
        : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <Link to="/" className="flex items-center group">
                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center group-hover:shadow-xl transition-all duration-300 shadow-lg overflow-hidden">
                      <img 
                        src={logo} 
                        alt="SANGBO BERDE Logo" 
                        className="h-10 w-10 object-contain rounded-full group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="ml-3">
                      <h1 className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                        SANGBO BERDE
                      </h1>
                      <p className="text-sm text-gray-600 group-hover:text-green-600 transition-colors duration-300">
                       City-Scale Waste Collection
                      </p>
                    </div>
                  </Link>
                </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-green-50"
            >
              Home
            </button>
            <button 
              onClick={() => {
                const featuresSection = document.getElementById('features');
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-green-50"
            >
              Features
            </button>
            <button 
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-green-50"
            >
              About
            </button>
            <button 
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-green-50"
            >
              Contact
            </button>
            <div className="flex space-x-4 ml-4">
              <Link
                to="/auth"
                className="text-gray-600 hover:text-green-600 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-green-50"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                className="bg-green-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-green-600 p-2 rounded-md hover:bg-green-50 transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-green-100">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 w-full text-left"
              >
                Home
              </button>
              <button
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                  setMobileMenuOpen(false);
                }}
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 w-full text-left"
              >
                Features
              </button>
              <button
                onClick={() => {
                  const aboutSection = document.getElementById('about');
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                  }
                  setMobileMenuOpen(false);
                }}
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 w-full text-left"
              >
                About
              </button>
              <button
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                  setMobileMenuOpen(false);
                }}
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 w-full text-left"
              >
                Contact
              </button>
              <div className="pt-4 pb-3 border-t border-green-100">
                      <div className="flex items-center px-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                            <img 
                              src={logo} 
                              alt="SANGBO BERDE Logo" 
                              className="h-6 w-6 object-contain rounded-full"
                            />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-base font-medium text-gray-800">SANGBO BERDE</div>
                          <div className="text-sm font-medium text-gray-500">City-Scale Composting</div>
                        </div>
                      </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/auth"
                    className="text-gray-600 hover:text-green-600 hover:bg-green-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth"
                    className="bg-green-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-700 transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
