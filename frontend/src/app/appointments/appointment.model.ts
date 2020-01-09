export interface Appointment {
  id: number;
  startDate: string;
  endDate: string;
  roomId: string;
  pesel: string;
  doctorId: string;
  appointmentType: string;
  operationType?: string;
}
