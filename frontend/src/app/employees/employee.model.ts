export interface Employee {
  id: number;
  name: string;
  surname: string;
  type: string;
}

export interface LeaveOfAbsenceRequest {
  id: number;
  name: string;
  surname: string;
  startDate: string;
  endDate: string;
}
