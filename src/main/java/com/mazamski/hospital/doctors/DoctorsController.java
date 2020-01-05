package com.mazamski.hospital.doctors;

import com.mazamski.hospital.doctors.model.Doctor;
import com.mazamski.hospital.employees.EmployeesMapper;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@AllArgsConstructor
@Transactional
public class DoctorsController {

    @GetMapping()
    List<Doctor> getDoctors() {
        return doctorsMapper.getDoctors();
    }

    @PostMapping()
    void insertDoctor(@RequestBody Doctor doctor) {
        doctorsMapper.insertDoctor(doctor);
    }

    @PutMapping()
    void updateDoctor(@RequestBody Doctor doctor) {
        doctorsMapper.updateDoctor(doctor);
    }

    @DeleteMapping("/{doctorId}")
    void deleteDoctor(@PathVariable Long doctorId) {
        doctorsMapper.deleteDoctor(doctorId);
    }

    private DoctorsMapper doctorsMapper;
}
