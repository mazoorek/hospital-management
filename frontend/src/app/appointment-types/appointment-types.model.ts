export interface AppointmentType {
  id: number;
  type: string;
  specializationName: string;
}

export interface AppointmentRequest {
  id: number;
  startDate: string;
  endDate: string;
  roomId: string;
  pesel: string;
  doctorId: string;
  operationType?: string;
}
