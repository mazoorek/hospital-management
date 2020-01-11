export interface OperationType {
  id: number;
  type: string;
  specializationName: string;
}

export interface OperationTypeAppointmentRequest {
  id: number;
  startDate: string;
  endDate: string;
  roomId: string;
  pesel: string;
  doctorId: string;
  appointmentType: string;
}
