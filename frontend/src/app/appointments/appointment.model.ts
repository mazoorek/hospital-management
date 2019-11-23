export interface Appointment {
  startDate: string;
  endDate: string;
  room: number;
  patientId: number;
  doctorId: number;
  character: string;
  operationType?: string;
}
