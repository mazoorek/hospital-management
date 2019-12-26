package com.mazamski.hospital.leavesOfAbsence;

import com.mazamski.hospital.leavesOfAbsence.model.LeaveOfAbsence;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaves-of-absence")
@AllArgsConstructor
@Transactional
public class LeavesOfAbsenceController {

    @GetMapping()
    List<LeaveOfAbsence> getLeavesOfAbsence() {
        return leavesOfAbsenceMapper.getLeavesOfAbsence();
    }

    @PostMapping()
    void insertLeaveOfAbsence(@RequestBody LeaveOfAbsence function) {
        leavesOfAbsenceMapper.insertLeaveOfAbsence(function);
    }

    @DeleteMapping("/{leaveOfAbsenceId}")
    void deleteLeaveOfAbsence(@PathVariable Long leaveOfAbsenceId) {
        leavesOfAbsenceMapper.deleteLeaveOfAbsence(leaveOfAbsenceId);
    }

    private LeavesOfAbsenceMapper leavesOfAbsenceMapper;
}
