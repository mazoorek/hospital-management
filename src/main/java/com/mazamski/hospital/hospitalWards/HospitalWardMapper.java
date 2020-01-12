package com.mazamski.hospital.hospitalWards;

import com.mazamski.hospital.appointments.model.Appointment;
import com.mazamski.hospital.hospitalWards.model.HospitalWardDoctorRequest;
import com.mazamski.hospital.hospitalWards.model.HospitalWard;
import com.mazamski.hospital.hospitalWards.model.HospitalWardRoomRequest;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface HospitalWardMapper {

    @Select("select oddzial_id, nazwa from oddzial")
    @Results({
            @Result(property = "name", column = "nazwa"),
            @Result(property = "id", column = "oddzial_id")
    })
    List<HospitalWard> getHospitalWards();

    @Insert("insert into oddzial(nazwa) values(#{name})")
    void insertHospitalWard(HospitalWard hospitalWard);

    @Update("update oddzial " +
            "set nazwa = #{name} " +
            "where oddzial_id = #{id}")
    void updateHospitalWard(HospitalWard hospitalWard);

    @Delete("delete from oddzial where oddzial_id = #{wardId}")
    void deleteHospitalWard(Long wardId);

    @Select("select wizyta_id, data_poczatku, data_konca, p.pesel, lekarz_id, w.pokoj_id, c.charakter, t.typ " +
            "from wizyta w join pacjent p on p.pacjent_id = w.pacjent_id " +
            "join charakter_wizyty c on w.charakter_wizyty_id = c.charakter_wizyty_id " +
            "left join typ_operacji t on w.typ_operacji_id = t.typ_operacji_id " +
            "join pokoj pok on w.pokoj_id = pok.pokoj_id " +
            "join oddzial o on pok.oddzial_id = o.oddzial_id " +
            "where o.oddzial_id = #{wardId}")
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
    List<Appointment> getWardAppointments(Long wardId);

    @Select("select pokoj_id, numer " +
            "from pokoj p join oddzial o " +
            "on p.oddzial_id = o.oddzial_id " +
            "where o.oddzial_id = #{wardId}")
    @Results({
            @Result(property = "id", column = "pokoj_id"),
            @Result(property = "number", column = "numer"),
    })
    List<HospitalWardRoomRequest> getWardRooms(Long wardId);

    @Select("select lekarz_id, l.pracownik_id, p.imie, p.nazwisko, s.nazwa as nazwa_specjalizacji " +
            "from lekarz l join oddzial o on l.oddzial_id = o.oddzial_id " +
            "join specjalizacja s on l.specjalizacja_id = s.specjalizacja_id " +
            "join pracownik p on l.pracownik_id = p.pracownik_id " +
            "where o.oddzial_id = #{wardId}")
    @Results({
            @Result(property = "id", column = "lekarz_id"),
            @Result(property = "employeeId", column = "pracownik_id"),
            @Result(property = "specializationName", column = "nazwa_specjalizacji"),
            @Result(property = "name", column = "imie"),
            @Result(property = "surname", column = "nazwisko"),
    })
    List<HospitalWardDoctorRequest> getWardDoctors(Long wardId);
}
