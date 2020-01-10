package com.mazamski.hospital.specialization;

import com.mazamski.hospital.specialization.model.Specialization;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SpecializationMapper {
    @Select("select specjalizacja_id, nazwa from specjalizacja")
    @Results({
            @Result(property = "name", column = "nazwa"),
            @Result(property = "id", column = "specjalizacja_id")
    })
    List<Specialization> getSpecializations();

    @Insert("insert into specjalizacja(nazwa) values(#{name})")
    void insertSpecialization(Specialization specialization);

    @Update("update specjalizacja " +
            "set nazwa = #{name} " +
            "where specjalizacja_id = #{id}")
    void updateSpecialization(Specialization specialization);

    @Delete("delete from specjalizacja where specjalizacja_id = #{specializationId}")
    void deleteSpecialization(Long specializationId);
}
