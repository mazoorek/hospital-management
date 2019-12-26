package com.mazamski.hospital.operationTypes;

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
            "values(#{type}, select specjalizacja_id from specjalizacja " +
            "where nazwa = #{specializationName} )")
    void insertOperationType(OperationType operationType);

    @Delete("delete from typ_operacji " +
            "where charakter_wizyty_id = #{operationTypeId}")
    void deleteOperationType(Long operationTypeId);
}
