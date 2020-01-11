package com.mazamski.hospital.employees;

import com.mazamski.hospital.employees.model.Employee;
import com.mazamski.hospital.employees.model.LeaveOfAbsenceRequest;
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

    @Select("select urlop_id, p.imie, p.nazwisko, data_rozpoczecia, data_zakonczenia " +
            "from urlop u join pracownik p on u.pracownik_id = p.pracownik_id " +
            "where p.pracownik_id = #{employeeId}")
    @Results({
            @Result(property = "id", column = "urlop_id"),
            @Result(property = "name", column = "imie"),
            @Result(property = "surname", column = "nazwisko"),
            @Result(property = "startDate", column = "data_rozpoczecia"),
            @Result(property = "endDate", column = "data_zakonczenia"),
    })
    List<LeaveOfAbsenceRequest> getEmployeeLeavesOfAbsences(Long employeeId);
}
