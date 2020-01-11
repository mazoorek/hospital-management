package com.mazamski.hospital.function;

import com.mazamski.hospital.function.model.Function;
import com.mazamski.hospital.function.model.StaffMemberRequest;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper()
public interface FunctionMapper {

    @Select("select funkcja_id, nazwa " +
            "from funkcja")
    @Results({
            @Result(property = "id", column = "funkcja_id"),
            @Result(property = "name", column = "nazwa"),
    })
    List<Function> getFunctions();

    @Insert("insert into funkcja(nazwa) " +
            "values(#{name})")
    void insertFunction(Function function);

    @Update("update funkcja " +
            "set nazwa = #{name} " +
            "where funkcja_id = #{id}")
    void updateFunction(Function function);

    @Delete("delete from funkcja " +
            "where funkcja_id = #{functionId}")
    void deleteFunction(Long functionId);

    @Select("select personel_id, pe.pracownik_id, pr.imie, pr.nazwisko " +
            "from personel pe join funkcja f on pe.funkcja_id = f.funkcja_id " +
            "join pracownik pr on pe.pracownik_id = pr.pracownik_id " +
            "where f.funkcja_id = #{functionId}")
    @Results({
            @Result(property = "id", column = "personel_id"),
            @Result(property = "employeeId", column = "pracownik_id"),
            @Result(property = "name", column = "imie"),
            @Result(property = "surname", column = "nazwisko"),
    })
    List<StaffMemberRequest> getFunctionStaff(Long functionId);
}
