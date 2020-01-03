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

    @PutMapping()
    void updateHospitalWard(@RequestBody HospitalWard hospitalWard) {
        hospitalWardMapper.updateHospitalWard(hospitalWard);
    }

    @DeleteMapping("/{id}")
    void deleteHospitalWard(@PathVariable Long id) {
        hospitalWardMapper.deleteHospitalWard(id);
    }

    private HospitalWardMapper hospitalWardMapper;
}
