package com.mazamski.hospital.operationTypes.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperationTypeAppointmentRequest {
    Long id;
    Date startDate;
    Date endDate;
    Long roomId;
    Long doctorId;
    String pesel;
    String appointmentType;
}
