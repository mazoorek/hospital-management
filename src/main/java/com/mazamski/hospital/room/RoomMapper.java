package com.mazamski.hospital.room;

import com.mazamski.hospital.room.model.Room;
import org.apache.ibatis.annotations.*;


import java.util.List;

@Mapper()
public interface RoomMapper {

    @Select("select id, numer, nazwa_oddzialu from pokoj")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "number", column = "numer"),
            @Result(property = "wardName", column = "nazwa_oddzialu"),
    })
    List<Room> getRooms();

    @Insert("insert into pokoj(numer,nazwa_oddzialu) values(#{number},#{wardName}")
    void insertRoom(Room room);

    @Delete("delete from pokoj where id = #{id}")
    void deleteRoom(Long id);
}
