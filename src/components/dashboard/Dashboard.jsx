import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import Sidebar from './Sidebar'
import Header from './Header'
import Overview from './Overview'
import WorkforceManagement from './WorkforceManagement'
import TaskManagement from './TaskManagement'
import AttendanceManagement from './AttendanceManagement'
import LocationAnalytics from './LocationAnalytics'
import AlertManagement from './AlertManagement'
import Reports from './Reports'
import Analytics from './Analytics'
import Settings from './Settings'
import WasteSegregationScheduling from './WasteSegregationScheduling'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    fetchNotifications()
    setIsVisible(true)
  }, [])

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />
      case 'workforce':
        return <WorkforceManagement />
      case 'tasks':
        return <TaskManagement />
      case 'segregation':
        return <WasteSegregationScheduling />
      case 'attendance':
        return <AttendanceManagement />
      case 'location':
        return <LocationAnalytics />
      case 'alerts':
        return <AlertManagement />
      case 'reports':
        return <Reports />
      case 'analytics':
        return <Analytics />
      case 'settings':
        return <Settings />
      default:
        return <Overview />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
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

      <div className="relative flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">SANGBO BERDE</h1>
            <div className="w-8"></div>
          </div>

          {/* Desktop Header */}
          <Header 
            notifications={notifications} 
            onNotificationClick={fetchNotifications}
            onMenuClick={() => setSidebarOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1 p-4 lg:p-6">
            <div className={`
              transform transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }
            `}>
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
