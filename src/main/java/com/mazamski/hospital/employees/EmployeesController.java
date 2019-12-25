package com.mazamski.hospital.employees;

import com.mazamski.hospital.employees.model.Employee;
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

    @PostMapping()
    void insertEmployee(@RequestBody Employee function) {
        employeesMapper.insertEmployee(function);
    }

    @DeleteMapping("/{employeeId}")
    void deleteEmployee(@PathVariable Long employeeId) {
        employeesMapper.deleteEmployee(employeeId);
    }

    private EmployeesMapper employeesMapper;
}
