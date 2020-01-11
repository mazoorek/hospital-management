package com.mazamski.hospital.room;

import com.mazamski.hospital.appointments.model.Appointment;
import com.mazamski.hospital.room.model.Room;
import com.mazamski.hospital.room.model.RoomAppointmentRequest;
import org.apache.ibatis.annotations.*;


import java.util.List;

@Mapper()
public interface RoomMapper {

    @Select("select pokoj_id, numer, nazwa as nazwa_oddzialu " +
            "from pokoj p join oddzial o " +
            "on p.oddzial_id = o.oddzial_id")
    @Results({
            @Result(property = "id", column = "pokoj_id"),
            @Result(property = "number", column = "numer"),
            @Result(property = "wardName", column = "nazwa_oddzialu"),
    })
    List<Room> getRooms();

    @Insert("insert into pokoj(numer,oddzial_id) " +
            "values(#{number},(select oddzial_id from oddzial " +
            "where nazwa = #{wardName}))")
    void insertRoom(Room room);

    @Update("update pokoj " +
            "set " +
            "numer = #{number}, " +
            "oddzial_id = (select oddzial_id from oddzial where nazwa = #{wardName}) " +
            "where pokoj_id = #{id}")
    void updateRoom(Room room);

    @Delete("delete from pokoj " +
            "where pokoj_id = #{roomId}")
    void deleteRoom(Long roomId);

    @Select("select wizyta_id, data_poczatku, data_konca, p.pesel, lekarz_id, c.charakter, t.typ " +
            "from wizyta w join pacjent p on p.pacjent_id = w.pacjent_id " +
            "join charakter_wizyty c on w.charakter_wizyty_id = c.charakter_wizyty_id " +
            "left join typ_operacji t on w.typ_operacji_id = t.typ_operacji_id " +
            "where pokoj_id = #{roomId}")
    @Results({
            @Result(property = "id", column = "wizyta_id"),
            @Result(property = "startDate", column = "data_poczatku"),
            @Result(property = "endDate", column = "data_konca"),
            @Result(property = "pesel", column = "pesel"),
            @Result(property = "doctorId", column = "lekarz_id"),
            @Result(property = "appointmentType", column = "charakter"),
            @Result(property = "operationType", column = "typ"),
    })
    List<RoomAppointmentRequest> getRoomAppointments(Long roomId);
}
