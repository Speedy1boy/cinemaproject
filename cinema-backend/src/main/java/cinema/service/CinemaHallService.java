package cinema.service;

import cinema.dto.CinemaHallDTO;
import cinema.entity.CinemaHall;
import cinema.entity.Seat;
import cinema.repository.CinemaHallRepository;
import cinema.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CinemaHallService {

    private final CinemaHallRepository cinemaHallRepository;
    private final SeatRepository seatRepository;

    @Transactional
    public CinemaHall createHallWithSeats(CinemaHallDTO dto) {
        CinemaHall hall = new CinemaHall();
        hall.setName(dto.getName());
        hall.setTotalSeats(dto.getRows() * dto.getSeatsPerRow());
        CinemaHall savedHall = cinemaHallRepository.save(hall);

        for (int r = 1; r <= dto.getRows(); r++) {
            for (int s = 1; s <= dto.getSeatsPerRow(); s++) {
                Seat seat = new Seat();
                seat.setCinemaHall(savedHall);
                seat.setRowNumber(r);
                seat.setSeatNumber(s);
                seatRepository.save(seat);
            }
        }

        return savedHall;
    }

    public List<CinemaHall> getAllHalls() {
        return cinemaHallRepository.findAll();
    }

    @Transactional
    public void deleteHall(Long id) {
        cinemaHallRepository.deleteById(id);
    }
}
