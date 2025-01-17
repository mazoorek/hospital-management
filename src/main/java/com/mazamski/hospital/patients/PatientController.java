package com.mazamski.hospital.patients;

import com.mazamski.hospital.doctors.model.Doctor;
import com.mazamski.hospital.patients.model.Patient;
import com.mazamski.hospital.patients.model.PatientAppointmentRequest;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
@AllArgsConstructor
@Transactional
public class PatientController {

    @GetMapping()
    List<Patient> getPatients() {
        return patientMapper.getPatients();
    }

    @PostMapping()
    void insertPatient(@RequestBody Patient patient) {
        patientMapper.insertPatient(patient);
    }

    @PutMapping()
    void updatePatient(@RequestBody Patient patient) {
        patientMapper.updatePatient(patient);
    }

    @DeleteMapping("/{patientId}")
    void deletePatient(@PathVariable Long patientId) {
        patientMapper.deletePatient(patientId);
    }

    @GetMapping("/{patientId}/appointments")
    List<PatientAppointmentRequest> getPatientAppointments(@PathVariable Long patientId) {
        return patientMapper.getPatientAppointments(patientId);
    }

    @GetMapping("/{patientId}/doctors")
    List<Doctor> getPatientDoctors(@PathVariable Long patientId) {
        return patientMapper.getPatientDoctors(patientId);
    }

    private PatientMapper patientMapper;
}
