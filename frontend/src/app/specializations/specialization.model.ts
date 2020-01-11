export interface Specialization {
  id: number;
  name: string;
}

export interface DoctorRequest {
  id: number;
  name: string;
  surname: string;
  employeeId: number;
  wardName: string;
}

export interface AppointmentTypeRequest {
  id: number;
  type: string;
}

export interface OperationTypeRequest {
  id: number;
  type: string;
}

