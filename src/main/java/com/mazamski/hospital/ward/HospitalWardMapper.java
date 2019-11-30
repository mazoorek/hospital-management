package com.mazamski.hospital.ward;

import com.mazamski.hospital.ward.model.HospitalWard;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface HospitalWardMapper {

    @Select("select * from oddzial")
    @Results({
            @Result(property = "name", column = "nazwa"),
    })
    List<HospitalWard> getHospitalWards();
}
