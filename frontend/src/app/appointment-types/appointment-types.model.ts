export interface AppointmentType {
  id: number;
  type: string;
  specializationName: string;
}

export interface AppointmentTypeAppointmentRequest {
  id: number;
  startDate: string;
  endDate: string;
  roomId: string;
  pesel: string;
  doctorId: string;
  operationType?: string;
}
