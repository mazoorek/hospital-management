package com.mazamski.hospital.doctors.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {
    Long id;
    Long employeeId;
    String name;
    String surname;
    String specializationName;
    String wardName;
}

