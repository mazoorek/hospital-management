package com.mazamski.hospital.operationTypes;

import com.mazamski.hospital.operationTypes.model.OperationTypeAppointmentRequest;
import com.mazamski.hospital.operationTypes.model.OperationType;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper()
public interface OperationTypeMapper {

    @Select("select typ_operacji_id, typ, nazwa as nazwa_specjalizacji " +
            "from typ_operacji cw join specjalizacja s " +
            "on cw.specjalizacja_id = s.specjalizacja_id")
    @Results({
            @Result(property = "id", column = "typ_operacji_id"),
            @Result(property = "type", column = "typ"),
            @Result(property = "specializationName", column = "nazwa_specjalizacji"),
    })
    List<OperationType> getOperationTypes();

    @Insert("insert into typ_operacji(typ, specjalizacja_id) " +
            "values(#{type}, (select specjalizacja_id from specjalizacja " +
            "where nazwa = #{specializationName}))")
    void insertOperationType(OperationType operationType);

    @Update("update typ_operacji " +
            "set " +
            "typ = #{type}, " +
            "specjalizacja_id = (select specjalizacja_id from specjalizacja " +
            "where nazwa = #{specializationName})" +
            "where typ_operacji_id = #{id}")
    void updateOperationType(OperationType operationType);

    @Delete("delete from typ_operacji " +
            "where typ_operacji_id = #{operationTypeId}")
    void deleteOperationType(Long operationTypeId);

    @Select("select wizyta_id, data_poczatku, data_konca, p.pesel, lekarz_id, pokoj_id, c.charakter " +
            "from wizyta w join pacjent p on p.pacjent_id = w.pacjent_id " +
            "join charakter_wizyty c on w.charakter_wizyty_id = c.charakter_wizyty_id " +
            "left join typ_operacji t on w.typ_operacji_id = t.typ_operacji_id " +
            "where t.typ_operacji_id = #{operationTypeId}")
    @Results({
            @Result(property = "id", column = "wizyta_id"),
            @Result(property = "startDate", column = "data_poczatku"),
            @Result(property = "endDate", column = "data_konca"),
            @Result(property = "pesel", column = "pesel"),
            @Result(property = "doctorId", column = "lekarz_id"),
            @Result(property = "roomId", column = "pokoj_id"),
            @Result(property = "appointmentType", column = "charakter"),
    })
    List<OperationTypeAppointmentRequest> getOperationTypeAppointments(Long operationTypeId);
}
