import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navigation from './Navigation'
import AboutSection from './AboutSection'
import logo from '../../assets/logo.jpg'
import { 
  ChartBarIcon, 
  TruckIcon, 
  SparklesIcon, 
  ArrowPathIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    setIsVisible(true)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      title: "Workforce Management",
      description: "Digital scheduling, attendance tracking, and task assignment for all staff roles",
      icon: UserGroupIcon,
      details: [
        "GPS-based attendance tracking",
        "QR code check-in/check-out",
        "Real-time task assignments",
        "Performance analytics"
      ]
    },
    {
      title: "Mobile Response Alerts",
      description: "Real-time notifications for staff regarding routes, facility load, and environmental complaints",
      icon: ClockIcon,
      details: [
        "Instant route updates",
        "Facility load monitoring",
        "Environmental alerts",
        "Emergency notifications"
      ]
    },
    {
      title: "Community Reporting",
      description: "Citizen portal for reporting missed collections or improper waste disposal with photo and location",
      icon: MapPinIcon,
      details: [
        "Photo documentation",
        "GPS location tracking",
        "Status updates",
        "Community engagement"
      ]
    },
    {
      title: "Data Dashboard",
      description: "For HR officers and facility managers to monitor staff performance, collection efficiency, and compost output",
      icon: ChartBarIcon,
      details: [
        "Real-time analytics",
        "Performance metrics",
        "Efficiency reports",
        "Trend analysis"
      ]
    }
  ]

  const stats = [
    { name: 'Waste Diverted', value: '85%', description: 'From landfills' },
    { name: 'CO₂ Reduced', value: '2.5 tons', description: 'Monthly average' },
    { name: 'Compost Produced', value: '320 kg', description: 'High-quality compost' },
    { name: 'Community Reports', value: '98%', description: 'Resolution rate' }
  ]

  const roles = [
    {
      title: 'Admin/LGU HR Officers',
      description: 'Full system access, analytics, and management tools',
      features: ['System analytics', 'Staff management', 'Performance reports', 'Configuration settings']
    },
    {
      title: 'Supervisors/Facility Managers',
      description: 'Workforce management and operational oversight',
      features: ['Team scheduling', 'Task assignment', 'Progress monitoring', 'Quality control']
    },
    {
      title: 'Garbage Collectors/Compost Facility Staff',
      description: 'Mobile interface for field operations',
      features: ['Route navigation', 'Task completion', 'GPS tracking', 'Photo documentation']
    },
    {
      title: 'Citizens',
      description: 'Community reporting and engagement portal',
      features: ['Issue reporting', 'Status tracking', 'Community updates', 'Environmental awareness']
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20 pt-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
          <div 
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          ></div>
          <div 
            className="absolute top-40 left-1/2 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div 
              className={`transform transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Waste into
                <span className="text-green-600 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {' '}Wealth
                </span>
              </h1>
            </div>
            
            <div 
              className={`transform transition-all duration-1000 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              an innovative, technology-enhanced waste management service that combines structured workforce management featuring digital attendance tracking, scheduling, task assignments, and accountability monitoring with real-time mobile alerts for route updates and urgent community issues.
              </p>
            </div>
            
            <div 
              className={`transform transition-all duration-1000 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/auth"
                  className="group bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-700 flex items-center justify-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Your Journey
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => {
                    const featuresSection = document.getElementById('features');
                    if (featuresSection) {
                      featuresSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="group border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-50 flex items-center justify-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Explore Features
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-emerald-50/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group hover:scale-105 transition-all duration-300"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                }}
              >
                <div className="relative">
                  <div className="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-300 rounded-full animate-ping"></div>
                </div>
                <div className="text-sm text-gray-600 mt-2">{stat.description}</div>
                <div className="text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                  {stat.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Waste Management Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage a city-scale composting facility efficiently and sustainably.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-full text-left p-6 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                    activeFeature === index
                      ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isVisible ? 'fadeInLeft 0.6s ease-out forwards' : 'none'
                  }}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      activeFeature === index ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <feature.icon className={`h-6 w-6 transition-all duration-300 ${
                        activeFeature === index ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 transform transition-all duration-500 hover:shadow-xl">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-100 rounded-lg mr-4 animate-pulse">
                  {(() => {
                    const IconComponent = features[activeFeature].icon;
                    return <IconComponent className="h-8 w-8 text-green-600" />;
                  })()}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{features[activeFeature].title}</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">{features[activeFeature].description}</p>
              <ul className="space-y-3">
                {features[activeFeature].details.map((detail, index) => (
                  <li 
                    key={index} 
                    className="flex items-center group hover:translate-x-2 transition-all duration-300"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: isVisible ? 'fadeInRight 0.6s ease-out forwards' : 'none'
                    }}
                  >
                    <div className="p-1 bg-green-100 rounded-full mr-3 group-hover:bg-green-200 transition-colors duration-300">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* User Roles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Designed for Every User
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Role-based access ensures everyone gets the tools they need to contribute effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roles.map((role, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ShieldCheckIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">{role.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <ul className="space-y-2">
                  {role.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Impact */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Building a Sustainable Future
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-green-100">
              Every action in SANGBO BERDE contributes to environmental sustainability and community well-being.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <ArrowPathIcon className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Waste Diversion</h3>
                <p className="text-green-100">Reduce landfill dependency through efficient composting</p>
              </div>
              <div className="text-center">
                <SparklesIcon className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Quality Compost</h3>
                <p className="text-green-100">Produce high-quality compost for agricultural use</p>
              </div>
              <div className="text-center">
                <TruckIcon className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Efficient Collection</h3>
                <p className="text-green-100">Optimize routes and reduce carbon footprint</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your City's Waste Management?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the sustainable revolution. Start your SANGBO BERDE journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700"
            >
              Get Started Now
            </Link>
            <button 
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="border border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-50 transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your city's waste management? Contact us to learn more about 
              implementing SANGBO BERDE in your community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">info@sangboberde.com</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">
+63 993-819-0512</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">Plaza Maetro Commercial Complex, Vigan City, Ilocos Sur</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <img 
                    src={logo} 
                    alt="SANGBO BERDE Logo" 
                    className="h-6 w-6 object-contain rounded-full"
                  />
                </div>
                <span className="ml-2 text-xl font-bold">SANGBO BERDE</span>
              </div>
              <p className="text-gray-400">
                Transforming waste into wealth through sustainable composting solutions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => {
                      const featuresSection = document.getElementById('features');
                      if (featuresSection) {
                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-white transition-colors duration-300"
                  >
                    Workforce Management
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const featuresSection = document.getElementById('features');
                      if (featuresSection) {
                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-white transition-colors duration-300"
                  >
                    Mobile Response
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const featuresSection = document.getElementById('features');
                      if (featuresSection) {
                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-white transition-colors duration-300"
                  >
                    Community Reporting
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const featuresSection = document.getElementById('features');
                      if (featuresSection) {
                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-white transition-colors duration-300"
                  >
                    Data Analytics
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Users</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/auth" className="hover:text-white transition-colors duration-300">
                    Admin Officers
                  </Link>
                </li>
                <li>
                  <Link to="/auth" className="hover:text-white transition-colors duration-300">
                    Supervisors
                  </Link>
                </li>
                <li>
                  <Link to="/auth" className="hover:text-white transition-colors duration-300">
                    Field Staff
                  </Link>
                </li>
                <li>
                  <Link to="/auth" className="hover:text-white transition-colors duration-300">
                    Citizens
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => {
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-white transition-colors duration-300"
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-white transition-colors duration-300"
                  >
                    Training
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-white transition-colors duration-300"
                  >
                    Technical Support
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-white transition-colors duration-300"
                  >
                    Community
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SANGBO BERDE. All rights reserved. Building a sustainable future together.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
