package com.mazamski.hospital.specialization;

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

    @PostMapping("/{specjalizationId}")
    void deleteSpecialization(@PathVariable Long specjalizationId) {
        specializationMapper.deleteSpecialization(specjalizationId);
    }

    private SpecializationMapper specializationMapper;

}
