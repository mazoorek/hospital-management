package com.mazamski.hospital.employees.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveOfAbsenceRequest {
    Long id;
    String name;
    String surname;
    Date startDate;
    Date endDate;
}

