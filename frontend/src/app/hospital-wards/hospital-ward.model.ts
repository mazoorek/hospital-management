export interface HospitalWard {
  id: number;
  name: string;
}

export interface HospitalWardRoomRequest {
  id: number;
  number: number;
}

export interface HospitalWardDoctorRequest {
  id: number;
  name: string;
  surname: string;
  employeeId: number;
  specializationName: string;
}
