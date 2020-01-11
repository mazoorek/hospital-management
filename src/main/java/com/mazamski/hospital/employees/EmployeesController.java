package com.mazamski.hospital.employees;

import com.mazamski.hospital.employees.model.Employee;
import com.mazamski.hospital.employees.model.LeaveOfAbsenceRequest;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
@AllArgsConstructor
@Transactional
public class EmployeesController {

    @GetMapping()
    List<Employee> getEmployees() {
        return employeesMapper.getEmployees();
    }

    @PutMapping()
    void updateEmployee(@RequestBody Employee employee) {
        employeesMapper.updateEmployee(employee);
    }

    @DeleteMapping("/{employeeId}")
    void deleteEmployee(@PathVariable Long employeeId) {
        employeesMapper.deleteEmployee(employeeId);
    }

    @GetMapping("/{employeeId}/leaves-of-absence")
    List<LeaveOfAbsenceRequest> getEmployeeLeavesOfAbsences(@PathVariable Long employeeId) {
        return employeesMapper.getEmployeeLeavesOfAbsences(employeeId);
    }

    private EmployeesMapper employeesMapper;
}
