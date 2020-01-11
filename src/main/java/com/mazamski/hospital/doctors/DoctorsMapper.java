package com.mazamski.hospital.doctors;

import com.mazamski.hospital.appointments.model.Appointment;
import com.mazamski.hospital.doctors.model.Doctor;
import com.mazamski.hospital.doctors.model.DoctorAppointmentRequest;
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

    @Insert("{call insert_doctor(#{name},#{surname},#{specializationName},#{wardName})}")
    void insertDoctor(Doctor doctor);

    @Update("{call update_doctor(#{employeeId},#{name},#{surname},#{specializationName},#{wardName})}")
    void updateDoctor(Doctor doctor);

    @Delete("delete pracownik " +
            "from pracownik join lekarz " +
            "on pracownik.pracownik_id = lekarz.pracownik_id " +
            "where lekarz.lekarz_id = #{doctorId}")
    void deleteDoctor(Long doctorId);

    @Select("select wizyta_id, data_poczatku, data_konca, p.pesel, pokoj_id, c.charakter, t.typ " +
            "from wizyta w join pacjent p on p.pacjent_id = w.pacjent_id " +
            "join charakter_wizyty c on w.charakter_wizyty_id = c.charakter_wizyty_id " +
            "left join typ_operacji t on w.typ_operacji_id = t.typ_operacji_id " +
            "where lekarz_id = #{doctorId}")
    @Results({
            @Result(property = "id", column = "wizyta_id"),
            @Result(property = "startDate", column = "data_poczatku"),
            @Result(property = "endDate", column = "data_konca"),
            @Result(property = "pesel", column = "pesel"),
            @Result(property = "roomId", column = "pokoj_id"),
            @Result(property = "appointmentType", column = "charakter"),
            @Result(property = "operationType", column = "typ"),
    })
    List<DoctorAppointmentRequest> getDoctorAppointments(Long doctorId);
}
