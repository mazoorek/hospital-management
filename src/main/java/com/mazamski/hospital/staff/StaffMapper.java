package com.mazamski.hospital.staff;

import com.mazamski.hospital.staff.model.StaffMember;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper()
public interface StaffMapper {

    @Select("select personel_id, pe.pracownik_id, pr.imie, pr.nazwisko, f.nazwa as nazwa_funkcji " +
            "from personel pe join funkcja f on pe.funkcja_id = f.funkcja_id " +
            "join pracownik pr on pe.pracownik_id = pr.pracownik_id")
    @Results({
            @Result(property = "id", column = "personel_id"),
            @Result(property = "employeeId", column = "pracownik_id"),
            @Result(property = "functionName", column = "nazwa_funkcji"),
            @Result(property = "name", column = "imie"),
            @Result(property = "surname", column = "nazwisko"),
    })
    List<StaffMember> getStaff();

    @Insert("insert into personel(pracownik_id, specjalizacja_id) " +
            "values(employeeId, " +
            "select specjalizacja_id from specjalizacja where specjalizacja_id = #{surname})")
    void insertStaff(StaffMember staffMember);

    @Delete("delete pracownik " +
            "from pracownik join personel " +
            "on pracownik.pracownik_id = personel.pracownik_id " +
            "where personel.personel_id = #{staffMemberId}")
    void deleteStaffMember(Long staffMemberId);
}
