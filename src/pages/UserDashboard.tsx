import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../hooks/useLocation';
import { 
  LogOut, 
  MapPin, 
  Clock, 
  Calendar,
  Play,
  Square,
  User,
  Navigation
} from 'lucide-react';
import { toast } from 'react-toastify';
import database from '../utils/localDatabase';
import type { AttendanceRecord } from '../utils/localDatabase';
import { 
  formatDateTime, 
  formatWorkingHours, 
  getCurrentDateTime, 
  calculateWorkingHours,
  formatLocationCoordinates
} from '../utils/timeUtils';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { location, error: locationError, isLoading: locationLoading, getCurrentLocation } = useLocation();
  const [isWorking, setIsWorking] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState<AttendanceRecord | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      loadAttendanceData();
    }
  }, [user]);

  const loadAttendanceData = () => {
    if (!user) return;

    // Check for active attendance record
    const activeRecord = database.getActiveAttendanceRecord(user.id);
    setCurrentAttendance(activeRecord);
    setIsWorking(!!activeRecord);

    // Load attendance history
    const history = database.getAttendanceRecords(user.id);
    setAttendanceHistory(history);
  };

  const handleClockIn = async () => {
    if (!user) return;

    setIsProcessing(true);
    
    try {
      const currentLocation = await getCurrentLocation();
      
      if (!currentLocation) {
        toast.error('Location access is required for clocking in');
        setIsProcessing(false);
        return;
      }

      const loginTime = getCurrentDateTime();
      const record = database.createAttendanceRecord(
        user.id,
        loginTime,
        currentLocation.latitude,
        currentLocation.longitude
      );

      setCurrentAttendance(record);
      setIsWorking(true);
      loadAttendanceData();
      
      toast.success('Clocked in successfully!');
    } catch (error) {
      console.error('Clock in error:', error);
      toast.error('Failed to clock in');
    }
    
    setIsProcessing(false);
  };

  const handleClockOut = async () => {
    if (!user || !currentAttendance) return;

    setIsProcessing(true);
    
    try {
      const currentLocation = await getCurrentLocation();
      
      if (!currentLocation) {
        toast.error('Location access is required for clocking out');
        setIsProcessing(false);
        return;
      }

      const logoutTime = getCurrentDateTime();
      const totalHours = calculateWorkingHours(currentAttendance.login_time, logoutTime);
      
      database.updateAttendanceLogout(
        currentAttendance.id,
        logoutTime,
        currentLocation.latitude,
        currentLocation.longitude,
        totalHours
      );

      setCurrentAttendance(null);
      setIsWorking(false);
      loadAttendanceData();
      
      toast.success(`Clocked out successfully! Total hours: ${formatWorkingHours(totalHours)}`);
    } catch (error) {
      console.error('Clock out error:', error);
      toast.error('Failed to clock out');
    }
    
    setIsProcessing(false);
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Kinster Attendance</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                {user?.name}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Clock In/Out Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Attendance Control</h2>
              
              {/* Current Status */}
              <div className="mb-6">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isWorking 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    isWorking ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  {isWorking ? 'Currently Working' : 'Not Working'}
                </div>
              </div>

              {/* Current Attendance Info */}
              {currentAttendance && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Current Session</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Clocked in: {formatDateTime(currentAttendance.login_time)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location: {formatLocationCoordinates(
                        currentAttendance.login_location_lat,
                        currentAttendance.login_location_lng
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Location Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Location Status</span>
                  <Navigation className="w-4 h-4 text-gray-400" />
                </div>
                
                {locationLoading && (
                  <div className="text-sm text-blue-600">Getting location...</div>
                )}
                
                {locationError && (
                  <div className="text-sm text-red-600">
                    Location error: {locationError.message}
                  </div>
                )}
                
                {location && !locationLoading && (
                  <div className="text-sm text-green-600">
                    Location available: {formatLocationCoordinates(location.latitude, location.longitude)}
                  </div>
                )}
              </div>

              {/* Clock In/Out Buttons */}
              <div className="space-y-3">
                {!isWorking ? (
                  <button
                    onClick={handleClockIn}
                    disabled={isProcessing || locationLoading || !!locationError}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Clock In
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleClockOut}
                    disabled={isProcessing || locationLoading || !!locationError}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Square className="w-5 h-5 mr-2" />
                        Clock Out
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Attendance History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Attendance History</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clock In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clock Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No attendance records found
                        </td>
                      </tr>
                    ) : (
                      attendanceHistory.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {formatDateTime(record.login_time).split(' ')[0]}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDateTime(record.login_time).split(' ')[1]}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.logout_time 
                              ? formatDateTime(record.logout_time).split(' ')[1]
                              : '-'
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.total_hours 
                              ? formatWorkingHours(record.total_hours)
                              : '-'
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.logout_time
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {record.logout_time ? 'Completed' : 'In Progress'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
