package com.mazamski.hospital.operationTypes;

import com.mazamski.hospital.operationTypes.model.OperationType;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/operation-types")
@AllArgsConstructor
@Transactional
public class OperationTypeController {

    @GetMapping()
    List<OperationType> getAppointmentTypes() {
        return operationTypeMapper.getOperationTypes();
    }

    @PostMapping()
    void insertAppointmentType(@RequestBody OperationType function) {
        operationTypeMapper.insertOperationType(function);
    }

    @DeleteMapping("/{operationTypeId}")
    void deleteAppointmentType(@PathVariable Long operationTypeId) {
        operationTypeMapper.deleteOperationType(operationTypeId);
    }

    private OperationTypeMapper operationTypeMapper;
}
