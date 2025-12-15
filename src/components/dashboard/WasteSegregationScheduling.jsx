import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import {
  CalendarDaysIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const WasteSegregationScheduling = () => {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchSchedules()
    checkUpcomingSchedules()
  }, [])

  // Check for upcoming schedules every minute
  useEffect(() => {
    const interval = setInterval(checkUpcomingSchedules, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [schedules])

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('waste_segregation_schedules')
        .select('*')
        .order('schedule_date', { ascending: true })

      if (error) {
        console.log('Database error, using demo data:', error)
        // Demo data for development
        const demoSchedules = [
          {
            id: 'demo-1',
            waste_type: 'plastics',
            schedule_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            frequency: 'weekly',
            status: 'scheduled',
            priority: 'high',
            barangay: 'Barangay A',
            notes: 'Weekly plastic collection from households'
          },
          {
            id: 'demo-2',
            waste_type: 'biodegradable',
            schedule_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            frequency: 'daily',
            status: 'in_progress',
            priority: 'medium',
            barangay: 'Barangay B',
            notes: 'Daily biodegradable waste collection'
          }
        ]
        setSchedules(demoSchedules)
      } else {
        setSchedules(data || [])
      }
    } catch (error) {
      console.error('Error fetching schedules:', error)
      setSchedules([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getWasteTypeColor = (wasteType) => {
    switch (wasteType) {
      case 'plastics':
        return 'bg-blue-100 text-blue-800'
      case 'metals':
        return 'bg-gray-100 text-gray-800'
      case 'paper':
        return 'bg-yellow-100 text-yellow-800'
      case 'glass':
        return 'bg-cyan-100 text-cyan-800'
      case 'electronics':
        return 'bg-purple-100 text-purple-800'
      case 'biodegradable':
        return 'bg-green-100 text-green-800'
      case 'non_biodegradable':
        return 'bg-red-100 text-red-800'
      case 'recyclable':
        return 'bg-emerald-100 text-emerald-800'
      case 'hazardous':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleScheduleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const scheduleData = {
      waste_type: formData.get('waste_type'),
      schedule_date: formData.get('schedule_date'),
      frequency: formData.get('frequency'),
      priority: formData.get('priority'),
      barangay: formData.get('barangay'),
      notes: formData.get('notes'),
      created_by: user.id
    }

    try {
      if (editingSchedule) {
        // Update existing schedule
        const { error } = await supabase
          .from('waste_segregation_schedules')
          .update(scheduleData)
          .eq('id', editingSchedule.id)

        if (error) throw error

        setSchedules(prev => prev.map(s =>
          s.id === editingSchedule.id
            ? { ...s, ...scheduleData, updated_at: new Date().toISOString() }
            : s
        ))
        alert('Schedule updated successfully!')
      } else {
        // Create new schedule
        const { data, error } = await supabase
          .from('waste_segregation_schedules')
          .insert(scheduleData)
          .select()
          .single()

        if (error) throw error

        setSchedules(prev => [data, ...prev])
        alert('Schedule created successfully!')
      }

      setShowScheduleForm(false)
      setEditingSchedule(null)
    } catch (error) {
      console.error('Error saving schedule:', error)
      alert('Failed to save schedule. Please try again.')
    }
  }

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule)
    setShowScheduleForm(true)
  }

  const handleDeleteSchedule = async (scheduleId) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return

    try {
      const { error } = await supabase
        .from('waste_segregation_schedules')
        .delete()
        .eq('id', scheduleId)

      if (error) throw error

      setSchedules(prev => prev.filter(s => s.id !== scheduleId))
      alert('Schedule deleted successfully!')
    } catch (error) {
      console.error('Error deleting schedule:', error)
      alert('Failed to delete schedule. Please try again.')
    }
  }

  const handleUpdateStatus = async (scheduleId, newStatus) => {
    try {
      const { error } = await supabase
        .from('waste_segregation_schedules')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', scheduleId)

      if (error) throw error

      setSchedules(prev => prev.map(s =>
        s.id === scheduleId
          ? { ...s, status: newStatus, updated_at: new Date().toISOString() }
          : s
      ))

      // Create notification for status change
      await createNotification(scheduleId, `Schedule status changed to ${newStatus.replace('_', ' ')}`)

      alert(`Schedule ${newStatus.replace('_', ' ')} successfully!`)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  const handleViewSchedule = (schedule) => {
    // For now, just show an alert with schedule details
    alert(`Schedule Details:\n\nWaste Type: ${schedule.waste_type}\nDate: ${new Date(schedule.schedule_date).toLocaleString()}\nArea: ${schedule.barangay}\nStatus: ${schedule.status}\nNotes: ${schedule.notes}`)
  }

  const handleCreateTask = async (schedule) => {
    try {
      const taskData = {
        title: `${schedule.waste_type.charAt(0).toUpperCase() + schedule.waste_type.slice(1)} Collection - ${schedule.barangay}`,
        description: `Collect ${schedule.waste_type} waste from ${schedule.barangay}. ${schedule.notes}`,
        assigned_to: null, // Will be assigned by admin
        assigned_by: user.id,
        status: 'pending',
        priority: schedule.priority,
        due_date: schedule.schedule_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single()

      if (error) {
        // Fallback to local storage if database fails
        const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
        const newTask = {
          ...taskData,
          id: `local-${Date.now()}`,
          assigned_to_profile: { full_name: 'Unassigned', role: 'collector' },
          assigned_by_profile: { full_name: user?.email || 'Admin', role: 'admin' }
        }
        localTasks.unshift(newTask)
        localStorage.setItem('tasks', JSON.stringify(localTasks))

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('taskUpdated', { detail: { task: newTask } }))

        alert('Task created successfully! (Saved locally)')
        return
      }

      alert('Task created successfully!')
    } catch (error) {
      console.error('Error creating task:', error)
      alert('Failed to create task. Please try again.')
    }
  }

  const checkUpcomingSchedules = async () => {
    if (!schedules.length) return

    const now = new Date()
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 hours from now

    const upcomingSchedules = schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.schedule_date)
      return scheduleDate > now &&
             scheduleDate <= twoHoursFromNow &&
             schedule.status === 'scheduled'
    })

    for (const schedule of upcomingSchedules) {
      // Check if we've already sent a notification for this schedule
      const notificationKey = `schedule_reminder_${schedule.id}`
      const lastNotification = localStorage.getItem(notificationKey)

      if (!lastNotification || (Date.now() - parseInt(lastNotification)) > 60 * 60 * 1000) { // 1 hour ago
        await createNotification(
          schedule.id,
          `Upcoming ${schedule.waste_type} collection in ${schedule.barangay} scheduled for ${new Date(schedule.schedule_date).toLocaleString()}`
        )

        // Mark as notified
        localStorage.setItem(notificationKey, Date.now().toString())
      }
    }
  }

  const createNotification = async (scheduleId, message) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Schedule Reminder',
          message: message,
          type: 'reminder',
          related_id: scheduleId
        })

      if (error) {
        console.log('Database notification failed, using local notification')
        // Fallback to browser notification if possible
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Waste Collection Reminder', { body: message })
        }
      }
    } catch (error) {
      console.error('Error creating notification:', error)
      // Fallback to browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Waste Collection Reminder', { body: message })
      }
    }
  }

  const filteredSchedules = schedules.filter(schedule => {
    const statusMatch = filter === 'all' || schedule.status === filter
    return statusMatch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Waste Segregation Scheduling</h2>
          <p className="text-gray-600">Schedule separate collection of different waste types</p>
        </div>
        <button
          onClick={() => setShowScheduleForm(true)}
          className="bg-white hover:bg-gray-100 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 border border-gray-300"
        >
          <PlusIcon className="h-4 w-4" />
          <span className="text-black">Create Schedule</span>
        </button> 
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-blue-500">
              <CalendarDaysIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Schedules</p>
              <p className="text-2xl font-semibold text-gray-900">{schedules.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-yellow-500">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Scheduled</p>
              <p className="text-2xl font-semibold text-gray-900">
                {schedules.filter(s => s.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-blue-500">
              <ExclamationTriangleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {schedules.filter(s => s.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-green-500">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {schedules.filter(s => s.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedules List */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Waste Collection Schedules</h3>
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => (
            <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getWasteTypeColor(schedule.waste_type)}`}>
                      {schedule.waste_type.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(schedule.status)}`}>
                      {schedule.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {schedule.waste_type.charAt(0).toUpperCase() + schedule.waste_type.slice(1)} Collection
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{schedule.notes}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-500">
                      Scheduled: {new Date(schedule.schedule_date).toLocaleDateString()} at {new Date(schedule.schedule_date).toLocaleTimeString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      Frequency: {schedule.frequency.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      Area: {schedule.barangay}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => handleViewSchedule(schedule)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium hover:underline flex items-center space-x-1 px-2 py-1 rounded"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleEditSchedule(schedule)}
                  className="text-orange-600 hover:text-orange-900 text-sm font-medium hover:underline flex items-center space-x-1 px-2 py-1 rounded"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                {schedule.status === 'scheduled' && (
                  <button
                    onClick={() => handleUpdateStatus(schedule.id, 'in_progress')}
                    className="text-green-600 hover:text-green-900 text-sm font-medium hover:underline flex items-center space-x-1 px-2 py-1 rounded"
                  >
                    <ClockIcon className="h-4 w-4" />
                    <span>Start</span>
                  </button>
                )}
                {schedule.status === 'in_progress' && (
                  <button
                    onClick={() => handleUpdateStatus(schedule.id, 'completed')}
                    className="text-green-600 hover:text-green-900 text-sm font-medium hover:underline flex items-center space-x-1 px-2 py-1 rounded"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Complete</span>
                  </button>
                )}
                <button
                  onClick={() => handleCreateTask(schedule)}
                  className="text-purple-600 hover:text-purple-900 text-sm font-medium hover:underline flex items-center space-x-1 px-2 py-1 rounded"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Create Task</span>
                </button>
                <button
                  onClick={() => handleDeleteSchedule(schedule.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium hover:underline flex items-center space-x-1 px-2 py-1 rounded"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}

          {filteredSchedules.length === 0 && (
            <div className="text-center py-8">
              <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No schedules found</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}
              </h3>
              <button
                onClick={() => {
                  setShowScheduleForm(false)
                  setEditingSchedule(null)
                }}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Waste Type</label>
                <select
                  name="waste_type"
                  required
                  defaultValue={editingSchedule?.waste_type || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select waste type</option>
                  <option value="plastics">Plastics</option>
                  <option value="metals">Metals</option>
                  <option value="paper">Paper</option>
                  <option value="glass">Glass</option>
                  <option value="electronics">Electronics</option>
                  <option value="biodegradable">Biodegradable</option>
                  <option value="non_biodegradable">Non-Biodegradable</option>
                  <option value="recyclable">Recyclable</option>
                  <option value="hazardous">Hazardous</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  name="schedule_date"
                  required
                  defaultValue={editingSchedule?.schedule_date ?
                    new Date(editingSchedule.schedule_date).toISOString().slice(0, 16) : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  name="frequency"
                  required
                  defaultValue={editingSchedule?.frequency || 'one_time'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="one_time">One Time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  name="priority"
                  required
                  defaultValue={editingSchedule?.priority || 'medium'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Barangay/Area</label>
                <input
                  type="text"
                  name="barangay"
                  required
                  defaultValue={editingSchedule?.barangay || ''}
                  placeholder="Enter barangay or area name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingSchedule?.notes || ''}
                  placeholder="Additional notes or instructions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleForm(false)
                    setEditingSchedule(null)
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default WasteSegregationScheduling
