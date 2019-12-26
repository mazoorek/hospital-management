package com.mazamski.hospital.staff.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffMember {
    Long id;
    String name;
    String surname;
    Long employeeId;
    String functionName;
}

