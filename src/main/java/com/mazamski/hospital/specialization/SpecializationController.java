package com.mazamski.hospital.specialization;

import com.mazamski.hospital.specialization.model.Specialization;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    private SpecializationMapper specializationMapper;
}
