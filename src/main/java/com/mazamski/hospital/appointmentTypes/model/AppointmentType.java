package com.mazamski.hospital.appointmentTypes.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentType {
    Long id;
    String type;
    String specializationName;
}

