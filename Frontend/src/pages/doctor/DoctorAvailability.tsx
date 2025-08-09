import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { mockDoctors } from '../../data/mockData';
import toast from 'react-hot-toast';

interface TimeSlot {
  start: string;
  end: string;
}

interface WeeklyAvailability {
  [key: string]: TimeSlot[];
}

const DoctorAvailability: React.FC = () => {
  const { user } = useAuth();
  const doctorData = mockDoctors.find(doc => doc.id === user?.id);
  
  const [availability, setAvailability] = useState<WeeklyAvailability>(
    doctorData?.availability || {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    }
  );
  
  const [loading, setLoading] = useState(false);

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

  const addTimeSlot = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: [...prev[day], { start: '09:00', end: '17:00' }]
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const validateTimeSlots = () => {
    for (const [day, slots] of Object.entries(availability)) {
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
            toast.error(`Overlapping time slots detected on ${day}`);
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateTimeSlots()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Availability updated successfully!');
    } catch (error) {
      toast.error('Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  const copyFromPreviousDay = (currentDay: string) => {
    const dayIndex = daysOfWeek.findIndex(d => d.key === currentDay);
    if (dayIndex > 0) {
      const previousDay = daysOfWeek[dayIndex - 1].key;
      setAvailability(prev => ({
        ...prev,
        [currentDay]: [...prev[previousDay]]
      }));
    }
  };

  const clearDay = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: []
    }));
  };

  const setCommonHours = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }]
    }));
  };

  const getTotalHours = () => {
    let total = 0;
    Object.values(availability).forEach(slots => {
      slots.forEach(slot => {
        const start = new Date(`2000-01-01 ${slot.start}`);
        const end = new Date(`2000-01-01 ${slot.end}`);
        total += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      });
    });
    return total;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Manage Availability
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set your weekly schedule for patient appointments
          </p>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Weekly Schedule Summary
                </h3>
                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Total Hours: {getTotalHours().toFixed(1)} hrs/week</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      Active Days: {Object.values(availability).filter(slots => slots.length > 0).length}/7
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <Button onClick={handleSave} loading={loading} size="lg">
                  <Save className="w-4 h-4 mr-2" />
                  Save Availability
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Availability Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {daysOfWeek.map((day, dayIndex) => (
            <motion.div
              key={day.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + dayIndex * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {day.label}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {availability[day.key].length === 0 ? (
                      <span className="text-sm text-gray-500 dark:text-gray-400">Not available</span>
                    ) : (
                      <span className="text-sm text-green-600 dark:text-green-400">
                        {availability[day.key].length} slot{availability[day.key].length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="space-y-3 mb-4">
                  {availability[day.key].map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <select
                        value={slot.start}
                        onChange={(e) => updateTimeSlot(day.key, slotIndex, 'start', e.target.value)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white text-sm"
                      >
                        {timeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      
                      <span className="text-gray-500 dark:text-gray-400">to</span>
                      
                      <select
                        value={slot.end}
                        onChange={(e) => updateTimeSlot(day.key, slotIndex, 'end', e.target.value)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white text-sm"
                      >
                        {timeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeSlot(day.key, slotIndex)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(day.key)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Slot
                  </Button>
                  
                  {dayIndex > 0 && availability[daysOfWeek[dayIndex - 1].key].length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyFromPreviousDay(day.key)}
                    >
                      Copy from {daysOfWeek[dayIndex - 1].label}
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCommonHours(day.key)}
                  >
                    Set Common Hours
                  </Button>
                  
                  {availability[day.key].length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearDay(day.key)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Clear Day
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <Card className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Availability Tips
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Set realistic time slots that allow for proper patient consultation</li>
                  <li>• Consider buffer time between appointments for notes and preparation</li>
                  <li>• Update your availability regularly to reflect any schedule changes</li>
                  <li>• Patients can only book appointments during your available time slots</li>
                  <li>• Use "Common Hours" for typical 9-12 AM and 2-5 PM schedule</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorAvailability;