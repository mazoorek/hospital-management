package com.mazamski.hospital.specialization;

import com.mazamski.hospital.specialization.model.AppointmentTypeRequest;
import com.mazamski.hospital.specialization.model.DoctorRequest;
import com.mazamski.hospital.specialization.model.OperationTypeRequest;
import com.mazamski.hospital.specialization.model.Specialization;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/specializations")
@AllArgsConstructor
@Transactional
public class SpecializationController {

    @GetMapping()
    public List<Specialization> getSpecializations() {
        return specializationMapper.getSpecializations();
    }

    @PostMapping()
    void insertSpecialization(@RequestBody Specialization specialization) {
        specializationMapper.insertSpecialization(specialization);
    }

    @PutMapping()
    void updateSpecialization(@RequestBody Specialization specialization) {
        specializationMapper.updateSpecialization(specialization);
    }

    @DeleteMapping("/{specializationId}")
    void deleteSpecialization(@PathVariable Long specializationId) {
        specializationMapper.deleteSpecialization(specializationId);
    }

    @GetMapping("/{specializationId}/doctors")
    public List<DoctorRequest> getSpecializationDoctors(@PathVariable Long specializationId) {
        return specializationMapper.getSpecializationDoctors(specializationId);
    }

    @GetMapping("/{specializationId}/appointment-types")
    public List<AppointmentTypeRequest> getSpecializationAppointmentTypes(@PathVariable Long specializationId) {
        return specializationMapper.getSpecializationAppointmentsTypes(specializationId);
    }

    @GetMapping("/{specializationId}/operation-types")
    public List<OperationTypeRequest> getSpecializationOperationTypes(@PathVariable Long specializationId) {
        return specializationMapper.getSpecializationOperationTypes(specializationId);
    }

    private SpecializationMapper specializationMapper;

}
