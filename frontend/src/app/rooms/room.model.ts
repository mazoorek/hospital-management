export interface Room {
  id: number;
  number: number;
  wardName: string;
}

export interface RoomAppointmentRequest {
  id: number;
  startDate: string;
  endDate: string;
  pesel: string;
  doctorId: string;
  appointmentType: string;
  operationType?: string;
}
