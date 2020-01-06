package com.mazamski.hospital.room;

import com.mazamski.hospital.room.model.Room;
import org.apache.ibatis.annotations.*;


import java.util.List;

@Mapper()
public interface RoomMapper {

    @Select("select pokoj_id, numer, nazwa as nazwa_oddzialu " +
            "from pokoj p join oddzial o " +
            "on p.oddzial_id = o.oddzial_id")
    @Results({
            @Result(property = "id", column = "pokoj_id"),
            @Result(property = "number", column = "numer"),
            @Result(property = "wardName", column = "nazwa_oddzialu"),
    })
    List<Room> getRooms();

    @Insert("insert into pokoj(numer,oddzial_id) " +
            "values(#{number},(select oddzial_id from oddzial " +
            "where nazwa = #{wardName}))")
    void insertRoom(Room room);

    @Update("update pokoj " +
            "set " +
            "numer = #{number}, " +
            "oddzial_id = (select oddzial_id from oddzial where nazwa = #{wardName}) " +
            "where pokoj_id = #{id}")
    void updateRoom(Room room);

    @Delete("delete from pokoj " +
            "where pokoj_id = #{roomId}")
    void deleteRoom(Long roomId);
}
