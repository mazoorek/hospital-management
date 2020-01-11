package com.mazamski.hospital.specialization;

import com.mazamski.hospital.specialization.model.DoctorRequest;
import com.mazamski.hospital.specialization.model.AppointmentTypeRequest;
import com.mazamski.hospital.specialization.model.OperationTypeRequest;
import com.mazamski.hospital.specialization.model.Specialization;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SpecializationMapper {
    @Select("select specjalizacja_id, nazwa from specjalizacja")
    @Results({
            @Result(property = "name", column = "nazwa"),
            @Result(property = "id", column = "specjalizacja_id")
    })
    List<Specialization> getSpecializations();

    @Insert("insert into specjalizacja(nazwa) values(#{name})")
    void insertSpecialization(Specialization specialization);

    @Update("update specjalizacja " +
            "set nazwa = #{name} " +
            "where specjalizacja_id = #{id}")
    void updateSpecialization(Specialization specialization);

    @Delete("delete from specjalizacja where specjalizacja_id = #{specializationId}")
    void deleteSpecialization(Long specializationId);

    @Select("select lekarz_id, l.pracownik_id, p.imie, p.nazwisko, o.nazwa as nazwa_oddzialu " +
            "from lekarz l join oddzial o on l.oddzial_id = o.oddzial_id " +
            "join specjalizacja s on l.specjalizacja_id = s.specjalizacja_id " +
            "join pracownik p on l.pracownik_id = p.pracownik_id " +
            "where s.specjalizacja_id = #{id}")
    @Results({
            @Result(property = "id", column = "lekarz_id"),
            @Result(property = "employeeId", column = "pracownik_id"),
            @Result(property = "wardName", column = "nazwa_oddzialu"),
            @Result(property = "name", column = "imie"),
            @Result(property = "surname", column = "nazwisko"),
    })
    List<DoctorRequest> getSpecializationDoctors(Long specializationId);


    @Select("select charakter_wizyty_id, charakter " +
            "from charakter_wizyty cw join specjalizacja s on cw.specjalizacja_id = s.specjalizacja_id " +
            "where s.specjalizacja_id = #{id}")
    @Results({
            @Result(property = "id", column = "charakter_wizyty_id"),
            @Result(property = "type", column = "charakter"),
    })
    List<AppointmentTypeRequest> getSpecializationAppointmentsTypes(Long specializationId);

    @Select("select typ_operacji_id, typ " +
            "from typ_operacji cw join specjalizacja s " +
            "on cw.specjalizacja_id = s.specjalizacja_id " +
            "where s.specjalizacja_id = #{id}")
    @Results({
            @Result(property = "id", column = "typ_operacji_id"),
            @Result(property = "type", column = "typ"),
    })
    List<OperationTypeRequest> getSpecializationOperationTypes(Long specializationId);
}
