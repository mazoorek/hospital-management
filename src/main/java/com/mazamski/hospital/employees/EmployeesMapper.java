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

    @Insert("insert into pracownik(typ, imie, nazwisko) " +
            "values(#{type}, #{name}, #{surname})")
    void insertEmployee(Employee employee);

    @Delete("delete from pracownik " +
            "where pracownik_id = #{employeeId}")
    void deleteEmployee(Long employeeId);
}
