import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  TruckIcon, 
  SparklesIcon, 
  ArrowPathIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('about')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])
  const benefits = [
    {
      icon: ArrowPathIcon,
      title: "Waste Diversion",
      description: "Reduce landfill dependency through efficient composting processes",
      stats: "85% diversion rate"
    },
    {
      icon: SparklesIcon,
      title: "Quality Compost",
      description: "Produce high-quality compost for agricultural and landscaping use",
      stats: "320kg monthly output"
    },
    {
      icon: TruckIcon,
      title: "Efficient Collection",
      description: "Optimize routes and reduce carbon footprint through smart logistics",
      stats: "40% fuel savings"
    },
    {
      icon: ChartBarIcon,
      title: "Data Analytics",
      description: "Track performance metrics and sustainability impact in real-time",
      stats: "98% accuracy rate"
    }
  ]

  const processSteps = [
    {
      step: "1",
      title: "Collection",
      description: "Smart route planning and GPS-tracked collection from designated areas"
    },
    {
      step: "2", 
      title: "Segregation",
      description: "Automated sorting of biodegradable and non-biodegradable waste"
    },
    {
      step: "3",
      title: "Processing",
      description: "Controlled composting with temperature and humidity monitoring"
    },
    {
      step: "4",
      title: "Distribution",
      description: "Quality-tested compost distribution to farmers and landscapers"
    }
  ]

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            About SANGBO BERDE
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive HR-driven mobile response platform designed to streamline 
            city-scale composting operations and promote sustainable waste management.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="text-center group hover:scale-105 transition-all duration-300"
              style={{
                animationDelay: `${index * 200}ms`,
                animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none'
              }}
            >
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors duration-300 animate-float">
                <benefit.icon className="h-8 w-8 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-gray-600 mb-2 group-hover:text-gray-700 transition-colors duration-300">
                {benefit.description}
              </p>
              <div className="text-sm font-medium text-green-600 group-hover:text-green-700 transition-colors duration-300">
                {benefit.stats}
              </div>
            </div>
          ))}
        </div>

        {/* Process Steps */}
        <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Our Composting Process
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div 
                key={index} 
                className="text-center group hover:scale-105 transition-all duration-300"
                style={{
                  animationDelay: `${index * 300}ms`,
                  animation: isVisible ? 'fadeInUp 0.8s ease-out forwards' : 'none'
                }}
              >
                <div className="mx-auto h-12 w-12 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-bold mb-4 group-hover:bg-green-700 transition-colors duration-300 animate-glow">
                  {step.step}
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">
                  {step.title}
                </h4>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-16 text-center">
          <div 
            className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-12 text-white shadow-2xl animate-glow"
            style={{
              animation: isVisible ? 'fadeInUp 1s ease-out forwards' : 'none'
            }}
          >
            <div className="text-xl max-w-4xl mx-auto leading-relaxed space-y-6">
              <div>
                 <h3 className="text-3xl font-bold mb-6">Vision</h3>
                <p>To be the leading provider of sustainable waste management practices solutions in the region of 2035.</p>
              </div>
              
              <div> <h3 className="text-3xl font-bold mb-6">Mission</h3>
                <p>To drive sustainable waste solutions smart workforce management, community engagement, and HR-powered mobile service that fosters cleaner cities and inclusive growth.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
