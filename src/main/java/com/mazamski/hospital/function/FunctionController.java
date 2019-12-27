package com.mazamski.hospital.function;

import com.mazamski.hospital.function.model.Function;
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

    @DeleteMapping("/{functionId}")
    void deleteFunction(@PathVariable Long functionId) {
        functionMapper.deleteFunction(functionId);
    }

    private FunctionMapper functionMapper;
}