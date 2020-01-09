package com.mazamski.hospital.patients;

import com.mazamski.hospital.patients.model.Patient;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper()
public interface PatientMapper {

    @Select("select pacjent_id, pesel, imie, nazwisko " +
            "from pacjent")
    @Results({
            @Result(property = "id", column = "pacjent_id"),
            @Result(property = "pesel", column = "pesel"),
            @Result(property = "name", column = "imie"),
            @Result(property = "surname", column = "nazwisko"),
    })
    List<Patient> getPatients();

    @Insert("insert into pacjent(pesel, imie, nazwisko) " +
            "values(#{pesel}, #{name}, #{surname})")
    void insertPatient(Patient patient);

    @Update("update pacjent " +
            "set " +
            "pesel = #{pesel}, " +
            "imie = #{name}, " +
            "nazwisko = #{surname} " +
            "where pacjent_id = #{id}")
    void updatePatient(Patient patient);

    @Delete("delete from pacjent " +
            "where pacjent_id = #{patientId}")
    void deletePatient(Long patientId);
}
