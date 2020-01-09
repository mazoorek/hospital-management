package com.mazamski.hospital.function;

import com.mazamski.hospital.function.model.Function;
import com.mazamski.hospital.specialization.model.Specialization;
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
}
