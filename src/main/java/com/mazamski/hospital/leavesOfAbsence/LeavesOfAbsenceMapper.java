package com.mazamski.hospital.leavesOfAbsence;

import com.mazamski.hospital.leavesOfAbsence.model.LeaveOfAbsence;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper()
public interface LeavesOfAbsenceMapper {

    @Select("select urlop_id, u.pracownik_id, p.imie, p.nazwisko, data_rozpoczecia, data_zakonczenia " +
            "from urlop u join pracownik p on u.pracownik_id = p.pracownik_id")
    @Results({
            @Result(property = "id", column = "urlop_id"),
            @Result(property = "employeeId", column = "pracownik_id"),
            @Result(property = "name", column = "imie"),
            @Result(property = "surname", column = "nazwisko"),
            @Result(property = "startDate", column = "data_rozpoczecia"),
            @Result(property = "endDate", column = "data_zakonczenia"),
    })
    List<LeaveOfAbsence> getLeavesOfAbsences();

    @Insert("insert into urlop(pracownik_id, data_rozpoczecia, data_zakonczenia) " +
            "values(#{employeeId}, #{startDate}, #{endDate})")
    void insertLeaveOfAbsence(LeaveOfAbsence leaveOfAbsence);

    @Update("update urlop " +
            "set " +
            "pracownik_id = #{employeeId}, " +
            "data_rozpoczecia = #{startDate}, " +
            "data_zakonczenia = #{endDate} " +
            "where urlop_id = #{id}")
    void updateLeaveOfAbsence(LeaveOfAbsence leaveOfAbsence);

    @Delete("delete from urlop " +
            "where urlop_id = #{leaveOfAbsenceId}")
    void deleteLeaveOfAbsence(Long leaveOfAbsenceId);
}
