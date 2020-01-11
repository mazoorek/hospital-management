package com.mazamski.hospital.appointmentTypes;

import com.mazamski.hospital.appointmentTypes.model.AppointmentTypeAppointmentRequest;
import com.mazamski.hospital.appointmentTypes.model.AppointmentType;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointment-types")
@AllArgsConstructor
@Transactional
public class AppointmentTypeController {

    @GetMapping()
    List<AppointmentType> getAppointmentTypes() {
        return appointmentTypeMapper.getAppointmentTypes();
    }

    @PostMapping()
    void insertAppointmentType(@RequestBody AppointmentType appointmentType) {
        appointmentTypeMapper.insertAppointmentType(appointmentType);
    }

    @PutMapping()
    void updateAppointmentType(@RequestBody AppointmentType appointmentType) {
        appointmentTypeMapper.updateAppointmentType(appointmentType);
    }

    @DeleteMapping("/{appointmentTypeId}")
    void deleteAppointmentType(@PathVariable Long appointmentTypeId) {
        appointmentTypeMapper.deleteAppointmentType(appointmentTypeId);
    }

    @GetMapping("/{appointmentTypeId}/appointments")
    List<AppointmentTypeAppointmentRequest> getAppointmentTypeAppointments(@PathVariable Long appointmentTypeId) {
        return appointmentTypeMapper.getAppointmentTypeAppointments(appointmentTypeId);
    }

    private AppointmentTypeMapper appointmentTypeMapper;
}
