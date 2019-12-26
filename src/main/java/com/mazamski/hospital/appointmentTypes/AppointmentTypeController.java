package com.mazamski.hospital.appointmentTypes;

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
    void insertAppointmentType(@RequestBody AppointmentType function) {
        appointmentTypeMapper.insertAppointmentType(function);
    }

    @DeleteMapping("/{appointmentTypeId}")
    void deleteAppointmentType(@PathVariable Long appointmentTypeId) {
        appointmentTypeMapper.deleteAppointmentType(appointmentTypeId);
    }

    private AppointmentTypeMapper appointmentTypeMapper;
}
