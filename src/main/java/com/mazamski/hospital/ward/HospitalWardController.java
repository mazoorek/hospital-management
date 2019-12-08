package com.mazamski.hospital.ward;

import com.mazamski.hospital.ward.model.HospitalWard;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hospital-wards")
@AllArgsConstructor
@Transactional
public class HospitalWardController {

    @GetMapping()
    public List<HospitalWard> getHospitalWards() {
        return hospitalWardMapper.getHospitalWards();
    }

    @PostMapping()
    void insertHospitalWard(@RequestBody HospitalWard hospitalWard) {
        hospitalWardMapper.insertHospitalWard(hospitalWard);
    }

    @PostMapping("/{hospitalWardName}")
    void deleteHospitalWard(@PathVariable String hospitalWardName) {
        hospitalWardMapper.deleteHospitalWard(hospitalWardName);
    }

    private HospitalWardMapper hospitalWardMapper;
}
