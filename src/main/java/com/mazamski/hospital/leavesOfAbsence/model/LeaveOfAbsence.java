package com.mazamski.hospital.leavesOfAbsence.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveOfAbsence {
    Long id;
    String name;
    String surname;
    Long employeeId;
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "UTC") // ciekawostka
    Date startDate;
    Date endDate;
}

