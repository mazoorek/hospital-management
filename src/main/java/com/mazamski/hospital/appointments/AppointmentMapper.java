package com.mazamski.hospital.appointments;

import com.mazamski.hospital.appointments.model.Appointment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AppointmentMapper {
    @Select("select wizyta_id, data_poczatku, data_konca, p.pesel, lekarz_id, pokoj_id, c.charakter, t.typ " +
            "from wizyta w join pacjent p on p.pacjent_id = w.pacjent_id " +
            "join charakter_wizyty c on w.charakter_wizyty_id = c.charakter_wizyty_id " +
            "left join typ_operacji t on w.typ_operacji_id = t.typ_operacji_id")
    @Results({
            @Result(property = "id", column = "wizyta_id"),
            @Result(property = "startDate", column = "data_poczatku"),
            @Result(property = "endDate", column = "data_konca"),
            @Result(property = "pesel", column = "pesel"),
            @Result(property = "doctorId", column = "lekarz_id"),
            @Result(property = "roomId", column = "pokoj_id"),
            @Result(property = "appointmentType", column = "charakter"),
            @Result(property = "operationType", column = "typ"),
    })
    List<Appointment> getAppointments();

    @Insert("insert into specjalizacja(nazwa) values(#{name})")
    void insertAppointment(Appointment appointment);

    @Delete("delete from specjalizacja where specjalizacja_id = #{appointmentId}")
    void deleteAppointment(Long appointmentId);
}
