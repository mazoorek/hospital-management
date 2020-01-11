package com.mazamski.hospital.hospitalWards;

import com.mazamski.hospital.appointments.model.Appointment;
import com.mazamski.hospital.hospitalWards.model.HospitalWardDoctorRequest;
import com.mazamski.hospital.hospitalWards.model.HospitalWard;
import com.mazamski.hospital.hospitalWards.model.HospitalWardRoomRequest;
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

    @GetMapping("/{id}/appointments")
    public List<Appointment> getWardAppointments(@PathVariable Long id) {
        return hospitalWardMapper.getWardAppointments(id);
    }

    @GetMapping("/{id}/rooms")
    public List<HospitalWardRoomRequest> getWardRooms(@PathVariable Long id) {
        return hospitalWardMapper.getWardRooms(id);
    }

    @GetMapping("/{id}/doctors")
    public List<HospitalWardDoctorRequest> getWardDoctors(@PathVariable Long id) {
        return hospitalWardMapper.getWardDoctors(id);
    }

    private HospitalWardMapper hospitalWardMapper;
}
