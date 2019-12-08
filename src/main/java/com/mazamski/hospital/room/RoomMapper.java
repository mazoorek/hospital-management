package com.mazamski.hospital.room;

import com.mazamski.hospital.room.model.Room;
import org.apache.ibatis.annotations.*;


import java.util.List;

@Mapper()
public interface RoomMapper {

    @Select("select id, numer, nazwa from pokoj")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "number", column = "numer"),
            @Result(property = "name", column = "nazwa"),
    })
    List<Room> getRooms();

    @Insert("insert into pokoj(numer,nazwa) values(#{number},#{name}")
    void insertRoom(Room room);

    @Delete("delete from pokoj where id = #{id}")
    void deleteRoom(Long id);
}
