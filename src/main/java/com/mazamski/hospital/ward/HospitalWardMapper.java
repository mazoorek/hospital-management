package com.mazamski.hospital.ward;

import com.mazamski.hospital.ward.model.HospitalWard;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface HospitalWardMapper {

    @Select("select nazwa from oddzial")
    @Results({
            @Result(property = "name", column = "nazwa"),
    })
    List<HospitalWard> getHospitalWards();

    @Insert("insert into oddzial(nazwa) values(#{name})")
    void insertHospitalWard(HospitalWard hospitalWard);

    @Delete("delete from oddzial where name = #{name}")
    void deleteHospitalWard(String name);
}
