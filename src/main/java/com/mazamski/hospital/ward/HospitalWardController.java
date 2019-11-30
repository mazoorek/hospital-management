package com.mazamski.hospital.ward;

import com.mazamski.hospital.ward.model.HospitalWard;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/hospital-wards")
@AllArgsConstructor
public class HospitalWardController {

    @GetMapping()
    public List<HospitalWard> getHospitalWards() {
        return hospitalWardMapper.getHospitalWards();
    }

    private HospitalWardMapper hospitalWardMapper;
}
