package com.mazamski.hospital.hospitalWards.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorRequest {
    Long id;
    Long employeeId;
    String name;
    String surname;
    String specializationName;
}


