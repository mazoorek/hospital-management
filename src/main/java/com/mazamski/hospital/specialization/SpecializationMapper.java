package com.mazamski.hospital.specialization;

import com.mazamski.hospital.specialization.model.Specialization;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SpecializationMapper {
    @Select("select * from specjalizacja")
    @Results({
            @Result(property = "name", column = "nazwa"),
    })
    List<Specialization> getSpecializations();
}
