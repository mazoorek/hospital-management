package com.mazamski.hospital.ward;

import com.mazamski.hospital.ward.model.HospitalWard;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface HospitalWardMapper {

    @Select("select oddzial_id, nazwa from oddzial")
    @Results({
            @Result(property = "name", column = "nazwa"),
            @Result(property = "id", column = "oddzial_id")
    })
    List<HospitalWard> getHospitalWards();

    @Insert("insert into oddzial(nazwa) values(#{name})")
    void insertHospitalWard(HospitalWard hospitalWard);

    @Delete("delete from oddzial where oddzial_id = #{wardId}")
    void deleteHospitalWard(Long wardId);
}
