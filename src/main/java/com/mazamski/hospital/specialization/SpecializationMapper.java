package com.mazamski.hospital.specialization;

import com.mazamski.hospital.specialization.model.Specialization;
import com.mazamski.hospital.ward.model.HospitalWard;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SpecializationMapper {
    @Select("select * from specjalizacja")
    @Results({
            @Result(property = "name", column = "nazwa"),
    })
    List<Specialization> getSpecializations();

    @Insert("insert into specjalizacja(nazwa) values(#{name})")
    void insertSpecialization(Specialization specialization);

    @Delete("delete from specjalizacja where name = #{name}")
    void deleteSpecialization(String name);
}
