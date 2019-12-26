package com.mazamski.hospital.operationTypes.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperationType {
    Long id;
    String type;
    String specializationName;
}

