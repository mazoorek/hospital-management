package com.mazamski.hospital.patients.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    Long id;
    String type;
    String name;
    String surname;
    String pesel;
}

