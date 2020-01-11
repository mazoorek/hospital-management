package com.mazamski.hospital.function.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffMemberRequest {
    Long id;
    String name;
    String surname;
    Long employeeId;
}
