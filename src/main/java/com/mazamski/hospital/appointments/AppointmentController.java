package com.mazamski.hospital.appointments;

import com.mazamski.hospital.appointments.model.Appointment;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@AllArgsConstructor
@Transactional
public class AppointmentController {

    @GetMapping()
    public List<Appointment> getAppointments() {
        return appointmentMapper.getAppointments();
    }

    @PostMapping()
    void insertAppointment(@RequestBody Appointment appointment) {
        appointmentMapper.insertAppointment(appointment);
    }

    @PostMapping("/{appointmentId}")
    void deleteAppointment(@PathVariable Long appointmentId) {
        appointmentMapper.deleteAppointment(appointmentId);
    }

    private AppointmentMapper appointmentMapper;

}
