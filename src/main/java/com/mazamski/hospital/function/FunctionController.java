package com.mazamski.hospital.function;

import com.mazamski.hospital.function.model.Function;
import com.mazamski.hospital.function.model.StaffMemberRequest;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/functions")
@AllArgsConstructor
@Transactional
public class FunctionController {

    @GetMapping()
    List<Function> getFunctions() {
        return functionMapper.getFunctions();
    }

    @PostMapping()
    void insertFunction(@RequestBody Function function) {
        functionMapper.insertFunction(function);
    }

    @PutMapping()
    void updateFunction(@RequestBody Function function) {
        functionMapper.updateFunction(function);
    }

    @DeleteMapping("/{functionId}")
    void deleteFunction(@PathVariable Long functionId) {
        functionMapper.deleteFunction(functionId);
    }

    @GetMapping("/{functionId}/staff")
    List<StaffMemberRequest> getFunctionStaff(@PathVariable Long functionId) {
        return functionMapper.getFunctionStaff(functionId);
    }

    private FunctionMapper functionMapper;
}
