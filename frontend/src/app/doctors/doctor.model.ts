export interface Doctor {
  id: number;
  name: string;
  surname: string;
  employeeId: number;
  specializationName: string;
  wardName: string;
}

export interface DoctorAppointmentRequest {
  id: number;
  startDate: string;
  endDate: string;
  roomId: string;
  pesel: string;
  appointmentType: string;
  operationType?: string;
}

