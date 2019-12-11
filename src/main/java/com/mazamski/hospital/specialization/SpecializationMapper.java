package com.mazamski.hospital.specialization;

import com.mazamski.hospital.specialization.model.Specialization;
import com.mazamski.hospital.ward.model.HospitalWard;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SpecializationMapper {
    @Select("select specjalizacja_id, name from specjalizacja")
    @Results({
            @Result(property = "name", column = "nazwa"),
            @Result(property = "id", column = "specjalizacja_id")
    })
    List<Specialization> getSpecializations();

    @Insert("insert into specjalizacja(nazwa) values(#{name})")
    void insertSpecialization(Specialization specialization);

    @Delete("delete from specjalizacja where specjalizacja_id = #{specializationId}")
    void deleteSpecialization(Long specializationId);
}
