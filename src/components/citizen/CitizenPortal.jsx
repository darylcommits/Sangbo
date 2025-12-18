import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { 
  CameraIcon, 
  MapPinIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  HeartIcon,
  LightBulbIcon,
  UserIcon,
  HomeIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import logo from '../../assets/logo2.jpg'

const CitizenPortal = () => {
  const { profile, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('report')
  const [reports, setReports] = useState([])
  const [showReportForm, setShowReportForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    fetchReports()
    setIsVisible(true)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('citizen_reports')
        .select('*')
        .eq('reporter_id', profile.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.log('Citizen reports table error:', error)
        console.log('Checking local storage for additional reports')
        // Check local storage for saved reports
        const localReports = JSON.parse(localStorage.getItem('citizen_reports') || '[]')
        
        if (localReports.length > 0) {
          console.log('Found local reports:', localReports.length)
          setReports(localReports)
        } else {
          // Fallback to demo reports
          const demoReports = [
            {
              id: 'demo-1',
              report_type: 'missed_collection',
              title: 'Missed Garbage Collection',
              description: 'Our garbage was not collected on the scheduled day. Please arrange for collection.',
              address: '123 Main Street, Barangay A',
              priority: 'high',
              status: 'pending',
              created_at: new Date().toISOString()
            },
            {
              id: 'demo-2',
              report_type: 'illegal_dumping',
              title: 'Illegal Dumping in Park',
              description: 'Someone has been dumping construction waste in the public park.',
              address: 'City Park, Barangay B',
              priority: 'urgent',
              status: 'assigned',
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
          setReports(demoReports)
        }
      } else {
        console.log('Successfully fetched reports from database:', data?.length || 0)
        // Combine database reports with local storage reports
        const localReports = JSON.parse(localStorage.getItem('citizen_reports') || '[]')
        const allReports = [...(data || []), ...localReports]
        setReports(allReports)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      // Fallback to demo reports
      const demoReports = [
        {
          id: 'demo-1',
          report_type: 'missed_collection',
          title: 'Missed Garbage Collection',
          description: 'Our garbage was not collected on the scheduled day. Please arrange for collection.',
          address: '123 Main Street, Barangay A',
          priority: 'high',
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ]
      setReports(demoReports)
    } finally {
      setLoading(false)
    }
  }

  const ReportForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center shadow-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Report an Issue</h3>
              <p className="text-sm text-gray-500">Help us improve our services</p>
            </div>
          </div>
          <button
            onClick={() => setShowReportForm(false)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmitReport} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Type</label>
            <select
              name="report_type"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
            >
              <option value="">Select issue type</option>
              <option value="missed_collection">Missed Collection</option>
              <option value="illegal_dumping">Illegal Dumping</option>
              <option value="overflow_bin">Overflow Bin</option>
              <option value="environmental_complaint">Environmental Complaint</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              placeholder="Brief description of the issue"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-gray-50 focus:bg-white resize-none"
              placeholder="Provide detailed information about the issue"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="address"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              placeholder="Street address or landmark"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
            <select name="priority" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-gray-50 focus:bg-white">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowReportForm(false)}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const handleSubmitReport = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    try {
      const { error } = await supabase
        .from('citizen_reports')
        .insert({
          reporter_id: profile.id,
          report_type: formData.get('report_type'),
          title: formData.get('title'),
          description: formData.get('description'),
          address: formData.get('address'),
          priority: formData.get('priority'),
          status: 'pending'
        })

      if (error) {
        console.log('Database not available, using local storage fallback')
        // Fallback to local storage
        const newReport = {
          id: `local-${Date.now()}`,
          report_type: formData.get('report_type'),
          title: formData.get('title'),
          description: formData.get('description'),
          address: formData.get('address'),
          priority: formData.get('priority'),
          status: 'pending',
          created_at: new Date().toISOString()
        }
        
        // Store in local storage
        const existingReports = JSON.parse(localStorage.getItem('citizen_reports') || '[]')
        existingReports.unshift(newReport)
        localStorage.setItem('citizen_reports', JSON.stringify(existingReports))
        
        // Update state
        setReports(prev => [newReport, ...prev])
        
        // Dispatch custom event to notify admin dashboard
        window.dispatchEvent(new CustomEvent('citizenReportSubmitted', { 
          detail: { report: newReport } 
        }))
        
        alert('Report submitted successfully! (Saved locally)')
        setShowReportForm(false)
        return
      }
      
      alert('Report submitted successfully!')
      setShowReportForm(false)
      fetchReports()
    } catch (error) {
      console.error('Error submitting report:', error)
      
      // Final fallback - local storage
      const newReport = {
        id: `local-${Date.now()}`,
        report_type: formData.get('report_type'),
        title: formData.get('title'),
        description: formData.get('description'),
        address: formData.get('address'),
        priority: formData.get('priority'),
        status: 'pending',
        created_at: new Date().toISOString()
      }
      
      // Store in local storage
      const existingReports = JSON.parse(localStorage.getItem('citizen_reports') || '[]')
      existingReports.unshift(newReport)
      localStorage.setItem('citizen_reports', JSON.stringify(existingReports))
      
      // Update state
      setReports(prev => [newReport, ...prev])
      
      // Dispatch custom event to notify admin dashboard
      window.dispatchEvent(new CustomEvent('citizenReportSubmitted', { 
        detail: { report: newReport } 
      }))
      
      alert('Report submitted successfully! (Saved locally)')
      setShowReportForm(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'assigned':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-orange-100 text-orange-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />
      case 'assigned':
        return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'in_progress':
        return <ClockIcon className="h-4 w-4" />
      case 'resolved':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'closed':
        return <CheckCircleIcon className="h-4 w-4" />
      default:
        return <ClockIcon className="h-4 w-4" />
    }
  }

  const ReportTab = () => (
    <div className={`space-y-6 transform transition-all duration-700 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Report Issues</h2>
          <p className="text-gray-600 mt-1">Help us maintain a clean environment</p>
        </div>
        <button
          onClick={() => setShowReportForm(true)}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2 group"
        >
          <PlusIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          <span>New Report</span>
        </button>
      </div>

      {/* Quick Report Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: 'Missed Collection',
            description: 'Report uncollected waste',
            icon: '🗑️',
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600'
          },
          {
            title: 'Illegal Dumping',
            description: 'Report illegal waste disposal',
            icon: '⚠️',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
          },
          {
            title: 'Overflow Bin',
            description: 'Report overflowing bins',
            icon: '📦',
            color: 'from-yellow-500 to-yellow-600',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600'
          }
        ].map((item, index) => (
          <div
            key={item.title}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 border border-gray-100 cursor-pointer"
            style={{
              animationDelay: `${index * 150}ms`,
              animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none'
            }}
            onClick={() => setShowReportForm(true)}
          >
            <div className="text-center">
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                <span className="text-2xl">{item.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* My Reports */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">My Reports</h3>
          <SparklesIcon className="h-5 w-5 text-green-500" />
        </div>
        <div className="space-y-4">
          {reports.map((report, index) => (
            <div
              key={report.id}
              className="group border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-green-300"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isVisible ? 'fadeInLeft 0.6s ease-out forwards' : 'none'
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{report.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                    {report.address && (
                      <span className="flex items-center">
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        {report.address}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                    {getStatusIcon(report.status)}
                    <span className="ml-1 capitalize">{report.status.replace('_', ' ')}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h4>
              <p className="text-gray-500 mb-4">Start by reporting an issue to help improve our services</p>
              <button
                onClick={() => setShowReportForm(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
              >
                Create First Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const CommunityTab = () => (
    <div className={`space-y-6 transform transition-all duration-700 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Community</h2>
        <p className="text-gray-600 mt-1">Connect with your community and learn about sustainability</p>
      </div>
      
      {/* Compost Products */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Compost Products</h3>
          <HeartIcon className="h-5 w-5 text-green-500" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Organic Fertilizer',
              description: 'High-quality compost for gardens',
              price: 'Free',
              status: 'Available',
              color: 'from-green-500 to-emerald-500',
              bgColor: 'bg-green-50'
            },
            {
              title: 'Soil Amendment',
              description: 'Improve soil structure and fertility',
              price: 'Free',
              status: 'Available',
              color: 'from-emerald-500 to-teal-500',
              bgColor: 'bg-emerald-50'
            }
          ].map((product, index) => (
            <div
              key={product.title}
              className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-green-100"
              style={{
                animationDelay: `${index * 150}ms`,
                animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{product.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {product.status}
                    </span>
                    <span className="text-xs font-bold text-green-700">{product.price}</span>
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${product.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-lg">🌱</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eco Tips */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Eco Tips</h3>
          <LightBulbIcon className="h-5 w-5 text-blue-500" />
        </div>
        <div className="space-y-4">
          {[
            {
              title: 'Proper Waste Segregation',
              description: 'Separate biodegradable from non-biodegradable waste to help our composting process.',
              icon: '♻️',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              title: 'Composting at Home',
              description: 'Start your own small compost bin with kitchen scraps and garden waste.',
              icon: '🏠',
              color: 'from-green-500 to-emerald-500'
            },
            {
              title: 'Reduce Food Waste',
              description: 'Plan meals and use leftovers creatively to minimize food waste.',
              icon: '🍽️',
              color: 'from-orange-500 to-red-500'
            }
          ].map((tip, index) => (
            <div
              key={tip.title}
              className="group bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-blue-100"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isVisible ? 'fadeInLeft 0.6s ease-out forwards' : 'none'
              }}
            >
              <div className="flex items-start space-x-4">
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${tip.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <span className="text-lg">{tip.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Stats */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Community Impact</h3>
          <ArrowTrendingUpIcon className="h-6 w-6" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">1,250</div>
            <div className="text-sm text-green-100">Reports Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm text-green-100">Waste Diverted</div>
          </div>
        </div>
      </div>
    </div>
  )

  const ProfileTab = () => (
    <div className={`space-y-6 transform transition-all duration-700 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">
              {profile?.full_name?.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{profile?.full_name}</h2>
            <p className="text-gray-600 mb-1">Community Member</p>
            <p className="text-sm text-gray-500 flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {profile?.barangay || 'Not specified'}
            </p>
          </div>
          <div className="text-right">
            <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-xs text-gray-500 mt-1">Active</p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Account Information</h3>
          <UserIcon className="h-5 w-5 text-gray-500" />
        </div>
        <div className="space-y-4">
          {[
            {
              label: 'Email',
              value: profile?.email,
              icon: '📧',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              label: 'Phone',
              value: profile?.phone || 'Not provided',
              icon: '📱',
              color: 'from-green-500 to-emerald-500'
            },
            {
              label: 'Barangay',
              value: profile?.barangay || 'Not specified',
              icon: '🏘️',
              color: 'from-purple-500 to-pink-500'
            }
          ].map((field, index) => (
            <div
              key={field.label}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isVisible ? 'fadeInLeft 0.6s ease-out forwards' : 'none'
              }}
            >
              <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${field.color} flex items-center justify-center shadow-lg`}>
                <span className="text-lg">{field.icon}</span>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-500">{field.label}</label>
                <p className="text-gray-900 font-medium">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Your Impact</h3>
          <SparklesIcon className="h-6 w-6" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{reports.length}</div>
            <div className="text-sm text-green-100">Reports Submitted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'resolved').length}
            </div>
            <div className="text-sm text-green-100">Issues Resolved</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setShowReportForm(true)}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl hover:shadow-md transition-all duration-200 border border-red-100 group"
          >
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
              <PlusIcon className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">New Report</p>
              <p className="text-sm text-gray-500">Report an issue</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('community')}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all duration-200 border border-green-100 group"
          >
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <HeartIcon className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Community</p>
              <p className="text-sm text-gray-500">View products & tips</p>
            </div>
          </button>
        </div>
      </div>

      {/* Sign Out Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Account Actions</h3>
        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl hover:shadow-md transition-all duration-200 border border-red-100 group"
          >
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Sign Out</p>
              <p className="text-sm text-gray-500">End your session</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'report':
        return <ReportTab />
      case 'community':
        return <CommunityTab />
      case 'profile':
        return <ProfileTab />
      default:
        return <ReportTab />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading your portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-lg overflow-hidden">
                <img
                  src={logo}
                  alt="SANGBO BERDE Logo"
                  className="h-8 w-8 object-contain rounded-full"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">SANGBO BERDE</h1>
                <p className="text-xs text-gray-500">Citizen Portal</p>
              </div>
            </div>
            
            {/* User Menu */}
            <div className="relative user-menu">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-white">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500">Citizen</p>
                </div>
                <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  showUserMenu ? 'rotate-180' : ''
                }`} />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 animate-fadeIn">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-white">
                          {profile?.full_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-gray-500">{profile?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>View Profile</span>
                    </button>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-4 pb-20">
        <div className={`
          transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }
        `}>
          {renderContent()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40">
        <div className="grid grid-cols-3">
          {[
            {
              tab: 'report',
              icon: ExclamationTriangleIcon,
              label: 'Report',
              color: 'from-red-500 to-orange-500',
              bgColor: 'bg-red-50',
              textColor: 'text-red-600'
            },
            {
              tab: 'community',
              icon: HeartIcon,
              label: 'Community',
              color: 'from-green-500 to-emerald-500',
              bgColor: 'bg-green-50',
              textColor: 'text-green-600',
              customIcon: '🌱'
            },
            {
              tab: 'profile',
              icon: UserIcon,
              label: 'Profile',
              color: 'from-blue-500 to-cyan-500',
              bgColor: 'bg-blue-50',
              textColor: 'text-blue-600'
            }
          ].map((item, index) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center py-3 transition-all duration-200 ${
                activeTab === item.tab
                  ? `${item.bgColor} ${item.textColor}`
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none'
              }}
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-1 transition-all duration-200 ${
                activeTab === item.tab
                  ? `bg-gradient-to-r ${item.color} shadow-lg`
                  : 'bg-gray-100'
              }`}>
                {item.customIcon ? (
                  <span className="text-sm">{item.customIcon}</span>
                ) : (
                  <item.icon className={`h-4 w-4 ${
                    activeTab === item.tab ? 'text-white' : 'text-gray-500'
                  }`} />
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {showReportForm && <ReportForm />}
    </div>
  )
}

export default CitizenPortal
