package com.mazamski.hospital.appointmentTypes;

import com.mazamski.hospital.appointmentTypes.model.AppointmentTypeAppointmentRequest;
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
            "values(#{type}, (select specjalizacja_id from specjalizacja " +
            "where nazwa = #{specializationName}))")
    void insertAppointmentType(AppointmentType appointmentType);

    @Update("update charakter_wizyty " +
            "set " +
            "charakter = #{type}, " +
            "specjalizacja_id = (select specjalizacja_id from specjalizacja " +
            "where nazwa = #{specializationName})" +
            "where charakter_wizyty_id = #{id}")
    void updateAppointmentType(AppointmentType appointmentType);

    @Delete("delete from charakter_wizyty " +
            "where charakter_wizyty_id = #{appointmentTypeId}")
    void deleteAppointmentType(Long appointmentTypeId);

    @Select("select wizyta_id, data_poczatku, data_konca, p.pesel, lekarz_id, pokoj_id, t.typ " +
            "from wizyta w join pacjent p on p.pacjent_id = w.pacjent_id " +
            "join charakter_wizyty c on w.charakter_wizyty_id = c.charakter_wizyty_id " +
            "left join typ_operacji t on w.typ_operacji_id = t.typ_operacji_id " +
            "where c.charakter_wizyty_id = #{appointmentTypeId}")
    @Results({
            @Result(property = "id", column = "wizyta_id"),
            @Result(property = "startDate", column = "data_poczatku"),
            @Result(property = "endDate", column = "data_konca"),
            @Result(property = "pesel", column = "pesel"),
            @Result(property = "doctorId", column = "lekarz_id"),
            @Result(property = "roomId", column = "pokoj_id"),
            @Result(property = "operationType", column = "typ"),
    })
    List<AppointmentTypeAppointmentRequest> getAppointmentTypeAppointments(Long appointmentTypeId);
}
