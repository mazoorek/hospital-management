export interface Patient {
  id: number;
  pesel: string,
  name: string,
  surname: string
}

export interface PatientAppointmentRequest {
  id: number;
  startDate: string;
  endDate: string;
  roomId: string;
  doctorId: string;
  appointmentType: string;
  operationType?: string;
}
