package com.mazamski.hospital.staff;

import com.mazamski.hospital.staff.model.StaffMember;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staff")
@AllArgsConstructor
@Transactional
public class StaffController {

    @GetMapping()
    List<StaffMember> getStaff() {
        return staffMapper.getStaff();
    }

    @PostMapping()
    void insertStaffMember(@RequestBody StaffMember function) {
        staffMapper.insertStaff(function);
    }

    @DeleteMapping("/{staffMemberId}")
    void deleteStaffMember(@PathVariable Long staffMemberId) {
        staffMapper.deleteStaffMember(staffMemberId);
    }

    private StaffMapper staffMapper;
}
