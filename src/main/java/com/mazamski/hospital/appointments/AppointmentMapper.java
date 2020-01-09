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

    @Insert("insert into wizyta(data_poczatku, data_konca, pacjent_id, lekarz_id, pokoj_id, charakter_wizyty_id, typ_operacji_id) " +
            "values(" +
            "#{startDate}, " +
            "#{endDate}, " +
            "(select pacjent_id from pacjent where pesel = #{pesel}), " +
            "#{doctorId}, " +
            "#{roomId}, " +
            "(select charakter_wizyty_id from charakter_wizyty where charakter = #{appointmentType}), " +
            "(select typ_operacji_id from typ_operacji where typ = coalesce(#{operationType}))" +
            ")")
    void insertAppointment(Appointment appointment);

    @Update("update wizyta " +
            "set " +
            "data_poczatku = #{startDate}, " +
            "data_konca = #{endDate}, " +
            "pacjent_id = (select pacjent_id from pacjent where pesel = #{pesel}), " +
            "lekarz_id = #{doctorId}, " +
            "pokoj_id = #{roomId}, " +
            "charakter_wizyty_id = (select charakter_wizyty_id from charakter_wizyty where charakter = #{appointmentType}), " +
            "typ_operacji_id = (select typ_operacji_id from typ_operacji where typ = #{operationType}) " +
            "where wizyta_id = #{id}")
    void updateAppointment(Appointment appointment);

    @Delete("delete from wizyta where wizyta_id = #{appointmentId}")
    void deleteAppointment(Long appointmentId);
}
