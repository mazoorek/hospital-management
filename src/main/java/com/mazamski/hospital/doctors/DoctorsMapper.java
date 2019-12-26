package com.mazamski.hospital.doctors;

import com.mazamski.hospital.doctors.model.Doctor;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper()
public interface DoctorsMapper {

    @Select("select lekarz_id, l.pracownik_id, p.imie, p.nazwisko, o.nazwa as nazwa_oddzialu, s.nazwa as nazwa_specjalizacji " +
            "from lekarz l join oddzial o on l.oddzial_id = o.oddzial_id " +
            "join specjalizacja s on l.specjalizacja_id = s.specjalizacja_id " +
            "join pracownik p on l.pracownik_id = p.pracownik_id")
    @Results({
            @Result(property = "id", column = "lekarz_id"),
            @Result(property = "employeeId", column = "pracownik_id"),
            @Result(property = "wardName", column = "nazwa_oddzialu"),
            @Result(property = "specializationName", column = "nazwa_specjalizacji"),
            @Result(property = "name", column = "imie"),
            @Result(property = "surname", column = "nazwisko"),
    })
    List<Doctor> getDoctors();

    @Insert("insert into lekarz(typ, oddzial_id, specjalizacja_id) " +
            "values(#{type}, select oddzial_id from oddzial where nazwa = #{wardName}, " +
            "select specjalizacja_id from specjalizacja where specjalizacja_id = #{surname})")
    void insertDoctor(Doctor doctor);

    @Delete("delete from lekarz " +
            "where lekarz_id = #{doctorId}")
    void deleteDoctor(Long doctorId);
}
