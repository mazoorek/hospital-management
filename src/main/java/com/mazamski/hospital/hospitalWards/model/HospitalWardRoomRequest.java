package com.mazamski.hospital.hospitalWards.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HospitalWardRoomRequest {
    Long id;
    Integer number;
}
