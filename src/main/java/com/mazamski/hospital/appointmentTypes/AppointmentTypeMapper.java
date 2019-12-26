package com.mazamski.hospital.appointmentTypes;

import com.mazamski.hospital.appointmentTypes.model.AppointmentType;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper()
public interface AppointmentTypeMapper {

    @Select("select charakter_wizyty_id, charakter, nazwa as nazwa_specjalizacji " +
            "from charakter_wizyty cw join specjalizacja s on cw.specjalizacja_id = s.specjalizacja_id")
    @Results({
            @Result(property = "id", column = "charakter_wizyty_id"),
            @Result(property = "type", column = "charakter"),
            @Result(property = "specializationName", column = "nazwa_specjalizacji"),
    })
    List<AppointmentType> getAppointmentTypes();

    @Insert("insert into charakter_wizyty(charakter, specjalizacja_id) " +
            "values(#{type}, select specjalizacja_id from specjalizacja " +
            "where nazwa = #{specializationName} )")
    void insertAppointmentType(AppointmentType appointmentType);

    @Delete("delete from charakter_wizyty " +
            "where charakter_wizyty_id = #{appointmentTypeId}")
    void deleteAppointmentType(Long appointmentTypeId);
}
