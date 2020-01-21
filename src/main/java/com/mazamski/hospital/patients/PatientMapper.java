package com.mazamski.hospital.patients;

import com.mazamski.hospital.appointments.model.Appointment;
import com.mazamski.hospital.doctors.model.Doctor;
import com.mazamski.hospital.patients.model.Patient;
import com.mazamski.hospital.patients.model.PatientAppointmentRequest;
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

    @Select("select wizyta_id, data_poczatku, data_konca, lekarz_id, pokoj_id, c.charakter, t.typ " +
            "from wizyta w join pacjent p on p.pacjent_id = w.pacjent_id " +
            "join charakter_wizyty c on w.charakter_wizyty_id = c.charakter_wizyty_id " +
            "left join typ_operacji t on w.typ_operacji_id = t.typ_operacji_id " +
            "where p.pacjent_id = #{patientId}")
    @Results({
            @Result(property = "id", column = "wizyta_id"),
            @Result(property = "startDate", column = "data_poczatku"),
            @Result(property = "endDate", column = "data_konca"),
            @Result(property = "doctorId", column = "lekarz_id"),
            @Result(property = "roomId", column = "pokoj_id"),
            @Result(property = "appointmentType", column = "charakter"),
            @Result(property = "operationType", column = "typ"),
    })
    List<PatientAppointmentRequest> getPatientAppointments(Long patientId);

    @Select("select distinct l.lekarz_id, l.pracownik_id, p.imie, p.nazwisko, o.nazwa as nazwa_oddzialu, s.nazwa as nazwa_specjalizacji " +
            "from lekarz l join oddzial o on l.oddzial_id = o.oddzial_id " +
            "join specjalizacja s on l.specjalizacja_id = s.specjalizacja_id " +
            "join pracownik p on l.pracownik_id = p.pracownik_id " +
            "join pokoj pok on pok.oddzial_id = o.oddzial_id " +
            "join wizyta w on w.lekarz_id = l.lekarz_id " +
            "join pacjent on pacjent.pacjent_id = w.pacjent_id " +
            "where pacjent.pacjent_id = #{patientId}")
    @Results({
            @Result(property = "id", column = "lekarz_id"),
            @Result(property = "employeeId", column = "pracownik_id"),
            @Result(property = "wardName", column = "nazwa_oddzialu"),
            @Result(property = "specializationName", column = "nazwa_specjalizacji"),
            @Result(property = "name", column = "imie"),
            @Result(property = "surname", column = "nazwisko"),
    })
    List<Doctor> getPatientDoctors(Long patientId);
}
