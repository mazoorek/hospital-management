package com.mazamski.hospital.patients.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientAppointmentRequest {
    Long id;
    Date startDate;
    Date endDate;
    Long roomId;
    Long doctorId;
    String appointmentType;
    String operationType;
}
