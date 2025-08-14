import { apiService } from '../utils/api';
import {
  ApiResponse,
  DashboardData,
  AppointmentListResponse,
  Appointment,
  Availability,
  PrescriptionListResponse,
  Prescription,
  AvailableSlotsResponse,
  User
} from '../types/api';

export class DoctorService {
  // Dashboard
  async getDashboardStats(): Promise<DashboardData> {
    const response = await apiService.get<ApiResponse<DashboardData>>('/doctors/dashboard/stats');
    return response.data;
  }

  // Appointments
  async getAppointments(params?: {
    status?: string;
    date?: string;
    page?: number;
    limit?: number;
    search?: string;
    timeFilter?: string;
  }): Promise<AppointmentListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/doctors/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiService.get<ApiResponse<AppointmentListResponse>>(endpoint);
    return response.data;
  }

  async getAppointmentDetails(appointmentId: string): Promise<{ appointment: Appointment; prescription?: Prescription }> {
    const response = await apiService.get<ApiResponse<{ appointment: Appointment; prescription?: Prescription }>>(
      `/doctors/appointments/${appointmentId}`
    );
    return response.data;
  }

  async updateAppointmentStatus(
    appointmentId: string,
    data: {
      status: string;
      notes?: string;
      prescription?: string;
      diagnosis?: string;
      symptoms?: string;
      followUpDate?: string;
    }
  ): Promise<Appointment> {
    const response = await apiService.patch<ApiResponse<Appointment>>(
      `/doctors/appointments/${appointmentId}/status`,
      data
    );
    return response.data;
  }

  async cancelAppointment(appointmentId: string, cancellationReason: string): Promise<Appointment> {
    const response = await apiService.patch<ApiResponse<Appointment>>(
      `/doctors/appointments/${appointmentId}/cancel`,
      { cancellationReason }
    );
    return response.data;
  }

  // Availability
  async getAvailability(): Promise<Availability> {
    const response = await apiService.get<ApiResponse<Availability>>('/doctors/availability');
    return response.data;
  }

  async updateAvailability(data: Partial<Availability>): Promise<Availability> {
    const response = await apiService.put<ApiResponse<Availability>>('/doctors/availability', data);
    return response.data;
  }

  async getAvailableSlots(date: string): Promise<AvailableSlotsResponse> {
    const response = await apiService.get<ApiResponse<AvailableSlotsResponse>>(
      `/doctors/availability/slots/${date}`
    );
    return response.data;
  }

  // Prescriptions
  async createPrescription(data: {
    appointmentId: string;
    diagnosis: string;
    symptoms: string;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
    }>;
    notes: string;
    followUpDate?: string;
    followUpRequired: boolean;
    labTests: Array<{
      name: string;
      description: string;
      instructions: string;
    }>;
    lifestyleRecommendations: string[];
    allergies: string[];
    contraindications: string[];
  }): Promise<Prescription> {
    const response = await apiService.post<ApiResponse<Prescription>>('/doctors/prescriptions', data);
    return response.data;
  }

  async getPrescriptions(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PrescriptionListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/doctors/prescriptions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiService.get<ApiResponse<PrescriptionListResponse>>(endpoint);
    return response.data;
  }

  async updatePrescription(
    prescriptionId: string,
    data: Partial<Prescription>
  ): Promise<Prescription> {
    const response = await apiService.put<ApiResponse<Prescription>>(
      `/doctors/prescriptions/${prescriptionId}`,
      data
    );
    return response.data;
  }

  // Profile
  async getProfile(): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>('/doctors/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiService.put<ApiResponse<User>>('/doctors/profile', data);
    return response.data;
  }
}

export const doctorService = new DoctorService();
