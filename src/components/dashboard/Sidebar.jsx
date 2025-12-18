import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  QrCodeIcon,
  MapIcon,
  BellIcon,
  DocumentChartBarIcon,
  ChartBarIcon,
  CogIcon,
  XMarkIcon,
  SparklesIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import logo from '../../assets/logo2.jpg'

const Sidebar = ({ activeTab, setActiveTab, onClose }) => {
  const { profile } = useAuth()

  const navigation = [
    { name: 'Overview', tab: 'overview', icon: HomeIcon, description: 'Dashboard overview' },
    { name: 'Workforce', tab: 'workforce', icon: UsersIcon, description: 'Manage staff' },
    { name: 'Tasks', tab: 'tasks', icon: ClipboardDocumentListIcon, description: 'Task management' },
    { name: 'Waste Segregation', tab: 'segregation', icon: CalendarDaysIcon, description: 'Schedule waste collection' },
    { name: 'Attendance', tab: 'attendance', icon: QrCodeIcon, description: 'QR code attendance' },
    { name: 'Location Analytics', tab: 'location', icon: MapIcon, description: 'GPS data & insights' },
    { name: 'Alert Management', tab: 'alerts', icon: BellIcon, description: 'Mobile response alerts' },
    { name: 'Reports', tab: 'reports', icon: DocumentChartBarIcon, description: 'Generate reports' },
    { name: 'Analytics', tab: 'analytics', icon: ChartBarIcon, description: 'Data analytics' },
    { name: 'Settings', tab: 'settings', icon: CogIcon, description: 'System settings' },
  ]

  return (
    <div className="flex flex-col h-full bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-lg overflow-hidden">
            <img 
              src={logo} 
              alt="SANGBO BERDE Logo" 
              className="h-8 w-8 object-contain rounded-full"
            />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-gray-900">SANGBO BERDE</h1>
            <p className="text-xs text-gray-500">Management Dashboard</p>
          </div>
        </div>
        
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item, index) => {
          const isActive = activeTab === item.tab
          return (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.tab)
                if (onClose) onClose()
              }}
              className={`group relative w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                isActive
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200'
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-gray-900 hover:shadow-md'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInLeft 0.6s ease-out forwards'
              }}
            >
              <div className={`flex items-center w-full ${
                isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'
              }`}>
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-400 group-hover:text-green-500'
                  }`}
                />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.name}</div>
                  <div className={`text-xs ${
                    isActive ? 'text-green-100' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <SparklesIcon className="h-4 w-4 text-white animate-pulse" />
                )}
              </div>
            </button>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center group hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <span className="text-sm font-bold text-white">
                {profile?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900 group-hover:text-green-700 transition-colors duration-200">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-500 capitalize group-hover:text-green-600 transition-colors duration-200">
              {profile?.role?.replace('_', ' ') || 'User'}
            </p>
          </div>
          <div className="ml-2">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
