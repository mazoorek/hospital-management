package com.mazamski.hospital.operationTypes;

import com.mazamski.hospital.operationTypes.model.OperationTypeAppointmentRequest;
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
    List<OperationType> getOperationTypes() {
        return operationTypeMapper.getOperationTypes();
    }

    @PostMapping()
    void insertOperationType(@RequestBody OperationType operationType) {
        operationTypeMapper.insertOperationType(operationType);
    }

    @PutMapping()
    void updateOperationType(@RequestBody OperationType operationType) {
        operationTypeMapper.updateOperationType(operationType);
    }

    @DeleteMapping("/{operationTypeId}")
    void deleteOperationType(@PathVariable Long operationTypeId) {
        operationTypeMapper.deleteOperationType(operationTypeId);
    }

    @GetMapping("/{operationTypeId}/appointments")
    List<OperationTypeAppointmentRequest> getOperationTypeAppointments(@PathVariable Long operationTypeId) {
        return operationTypeMapper.getOperationTypeAppointments(operationTypeId);
    }

    private OperationTypeMapper operationTypeMapper;
}
