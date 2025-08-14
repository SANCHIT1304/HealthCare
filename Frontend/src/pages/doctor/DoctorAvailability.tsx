import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Save,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { doctorService } from '../../services/doctorService';
import { Availability, TimeSlot, WeeklySchedule } from '../../types/api';
import toast from 'react-hot-toast';

const DoctorAvailability: React.FC = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return [
      { value: `${hour}:00`, label: `${hour}:00` },
      { value: `${hour}:30`, label: `${hour}:30` }
    ];
  }).flat();

  // Fetch availability
  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getAvailability();
      setAvailability(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError(err instanceof Error ? err.message : 'Failed to load availability');
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const addTimeSlot = (day: keyof WeeklySchedule) => {
    if (!availability) return;
    
    setAvailability(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeklySchedule: {
          ...prev.weeklySchedule,
          [day]: [...prev.weeklySchedule[day], { start: '09:00', end: '17:00' }]
        }
      };
    });
  };

  const removeTimeSlot = (day: keyof WeeklySchedule, index: number) => {
    if (!availability) return;
    
    setAvailability(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeklySchedule: {
          ...prev.weeklySchedule,
          [day]: prev.weeklySchedule[day].filter((_, i) => i !== index)
        }
      };
    });
  };

  const updateTimeSlot = (day: keyof WeeklySchedule, index: number, field: 'start' | 'end', value: string) => {
    if (!availability) return;
    
    setAvailability(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeklySchedule: {
          ...prev.weeklySchedule,
          [day]: prev.weeklySchedule[day].map((slot, i) => 
            i === index ? { ...slot, [field]: value } : slot
          )
        }
      };
    });
  };

  const validateTimeSlots = () => {
    if (!availability) return false;
    
    for (const [day, slots] of Object.entries(availability.weeklySchedule)) {
      for (const slot of slots) {
        if (slot.start >= slot.end) {
          toast.error(`Invalid time slot on ${day}: Start time must be before end time`);
          return false;
        }
      }
      
      // Check for overlapping slots
      for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
          const slot1 = slots[i];
          const slot2 = slots[j];
          if (
            (slot1.start < slot2.end && slot1.end > slot2.start) ||
            (slot2.start < slot1.end && slot2.end > slot1.start)
          ) {
            toast.error(`Overlapping time slots on ${day}`);
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!availability) return;
    
    if (!validateTimeSlots()) {
      return;
    }

    try {
      setSaving(true);
      await doctorService.updateAvailability(availability);
      toast.success('Availability updated successfully');
    } catch (err) {
      console.error('Error updating availability:', err);
      toast.error('Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  const copyFromPreviousDay = (currentDay: keyof WeeklySchedule) => {
    if (!availability) return;
    
    const dayIndex = daysOfWeek.findIndex(day => day.key === currentDay);
    if (dayIndex === 0) return; // Can't copy from previous day if it's Monday
    
    const previousDay = daysOfWeek[dayIndex - 1].key as keyof WeeklySchedule;
    const previousSlots = availability.weeklySchedule[previousDay];
    
    setAvailability(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeklySchedule: {
          ...prev.weeklySchedule,
          [currentDay]: [...previousSlots]
        }
      };
    });
    
    toast.success(`Copied schedule from ${daysOfWeek[dayIndex - 1].label}`);
  };

  const clearDay = (day: keyof WeeklySchedule) => {
    if (!availability) return;
    
    setAvailability(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeklySchedule: {
          ...prev.weeklySchedule,
          [day]: []
        }
      };
    });
  };

  const setCommonHours = (day: keyof WeeklySchedule) => {
    if (!availability) return;
    
    setAvailability(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeklySchedule: {
          ...prev.weeklySchedule,
          [day]: [{ start: '09:00', end: '17:00' }]
        }
      };
    });
  };

  const getTotalHours = () => {
    if (!availability) return 0;
    
    let total = 0;
    for (const slots of Object.values(availability.weeklySchedule)) {
      for (const slot of slots) {
        const start = new Date(`2000-01-01 ${slot.start}`);
        const end = new Date(`2000-01-01 ${slot.end}`);
        total += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }
    }
    return total;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Availability
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => fetchAvailability()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!availability) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Set Availability
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your weekly schedule and appointment time slots
          </p>
        </div>

        {/* Settings */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            General Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Appointment Duration (minutes)
              </label>
              <input
                type="number"
                value={availability.appointmentDuration || 30}
                onChange={(e) => setAvailability(prev => prev ? {
                  ...prev,
                  appointmentDuration: parseInt(e.target.value) || 30
                } : null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="15"
                max="120"
                step="15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buffer Time (minutes)
              </label>
              <input
                type="number"
                value={availability.bufferTime || 0}
                onChange={(e) => setAvailability(prev => prev ? {
                  ...prev,
                  bufferTime: parseInt(e.target.value) || 0
                } : null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="60"
                step="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Appointments per Day
              </label>
              <input
                type="number"
                value={availability.maxAppointmentsPerDay || 20}
                onChange={(e) => setAvailability(prev => prev ? {
                  ...prev,
                  maxAppointmentsPerDay: parseInt(e.target.value) || 20
                } : null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="50"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={availability.isActive}
                onChange={(e) => setAvailability(prev => prev ? {
                  ...prev,
                  isActive: e.target.checked
                } : null)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Active (Accepting appointments)
              </span>
            </label>
          </div>
        </Card>

        {/* Weekly Schedule */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Weekly Schedule
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Hours: {getTotalHours().toFixed(1)}h
              </span>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center"
              >
                {saving ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? 'Saving...' : 'Save Schedule'}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {daysOfWeek.map((day) => (
              <motion.div
                key={day.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {day.label}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyFromPreviousDay(day.key as keyof WeeklySchedule)}
                    >
                      Copy Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCommonHours(day.key as keyof WeeklySchedule)}
                    >
                      Set 9-5
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => clearDay(day.key as keyof WeeklySchedule)}
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => addTimeSlot(day.key as keyof WeeklySchedule)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Slot
                    </Button>
                  </div>
                </div>

                {availability.weeklySchedule[day.key as keyof WeeklySchedule].length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Clock className="w-8 h-8 mx-auto mb-2" />
                    <p>No time slots set for {day.label}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availability.weeklySchedule[day.key as keyof WeeklySchedule].map((slot, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <select
                            value={slot.start}
                            onChange={(e) => updateTimeSlot(day.key as keyof WeeklySchedule, index, 'start', e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {timeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <span className="text-gray-500 dark:text-gray-400">to</span>
                          <select
                            value={slot.end}
                            onChange={(e) => updateTimeSlot(day.key as keyof WeeklySchedule, index, 'end', e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {timeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTimeSlot(day.key as keyof WeeklySchedule, index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorAvailability;