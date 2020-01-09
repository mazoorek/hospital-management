package com.mazamski.hospital.employees;

import com.mazamski.hospital.employees.model.Employee;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper()
public interface EmployeesMapper {

    @Select("select pracownik_id, typ, imie, nazwisko " +
            "from pracownik")
    @Results({
            @Result(property = "id", column = "pracownik_id"),
            @Result(property = "type", column = "typ"),
            @Result(property = "name", column = "imie"),
            @Result(property = "surname", column = "nazwisko"),
    })
    List<Employee> getEmployees();

    @Update("update pracownik " +
            "set " +
            "imie = #{name}, " +
            "nazwisko = #{surname} " +
            "where pracownik_id = #{id}")
    void updateEmployee(Employee employee);

    @Delete("delete from pracownik " +
            "where pracownik_id = #{employeeId}")
    void deleteEmployee(Long employeeId);
}
