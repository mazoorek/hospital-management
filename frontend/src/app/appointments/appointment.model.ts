export interface Appointment {
  id: string;
  startDate: string;
  endDate: string;
  roomId: string;
  pesel: string;
  doctorId: string;
  appointmentType: string;
  operationType?: string;
}
