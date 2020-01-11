package com.mazamski.hospital.doctors.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorAppointmentRequest {
    Long id;
    Date startDate;
    Date endDate;
    Long roomId;
    String pesel;
    String appointmentType;
    String operationType;
}
