import { apiService } from '../utils/api';
import {
  ApiResponse,
  User,
  Appointment,
  AppointmentListResponse,
  Prescription,
  PrescriptionListResponse,
  AvailableSlotsResponse
} from '../types/api';

export class PatientService {
  // Search and view doctors
  async getVerifiedDoctors(params?: {
    specialization?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ doctors: User[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/patients/doctors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiService.get<ApiResponse<{ doctors: User[]; pagination: any }>>(endpoint);
    return response.data;
  }

  async getDoctorProfile(doctorId: string): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>(`/patients/doctors/${doctorId}`);
    return response.data;
  }

  async getDoctorAvailability(doctorId: string, date: string): Promise<AvailableSlotsResponse> {
    const response = await apiService.get<ApiResponse<AvailableSlotsResponse>>(
      `/patients/doctors/${doctorId}/availability/${date}`
    );
    return response.data;
  }

  // Appointments
  async bookAppointment(data: {
    doctorId: string;
    date: string;
    time: string;
    reason: string;
  }): Promise<Appointment> {
    const response = await apiService.post<ApiResponse<Appointment>>('/patients/appointments', data);
    return response.data;
  }

  async getAppointments(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<AppointmentListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/patients/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiService.get<ApiResponse<AppointmentListResponse>>(endpoint);
    return response.data;
  }

  async cancelAppointment(appointmentId: string, cancellationReason: string): Promise<Appointment> {
    const response = await apiService.patch<ApiResponse<Appointment>>(
      `/patients/appointments/${appointmentId}/cancel`,
      { cancellationReason }
    );
    return response.data;
  }

  // Prescriptions
  async getPrescriptions(): Promise<PrescriptionListResponse> {
    const response = await apiService.get<ApiResponse<PrescriptionListResponse>>('/patients/prescriptions');
    return response.data;
  }

  // Profile
  async getProfile(): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>('/patients/profile');
    return response.data;
  }
}

export const patientService = new PatientService();
