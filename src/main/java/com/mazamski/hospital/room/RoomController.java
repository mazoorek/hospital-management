package com.mazamski.hospital.room;

import com.mazamski.hospital.room.model.Room;
import com.mazamski.hospital.room.model.RoomAppointmentRequest;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@AllArgsConstructor
@Transactional
public class RoomController {

    @GetMapping()
    List<Room> getRooms() {
        return roomMapper.getRooms();
    }

    @PostMapping()
    void insertRoom(@RequestBody Room room) {
        roomMapper.insertRoom(room);
    }

    @PutMapping()
    void updateRoom(@RequestBody Room room) {
        roomMapper.updateRoom(room);
    }

    @DeleteMapping("/{roomId}")
    void deleteRoom(@PathVariable Long roomId) {
        roomMapper.deleteRoom(roomId);
    }

    @GetMapping("/{roomId}/appointments")
    List<RoomAppointmentRequest> getRoomAppointments(@PathVariable Long roomId) {
        return roomMapper.getRoomAppointments(roomId);
    }

    private RoomMapper roomMapper;
}
