package cinema.service;

import cinema.dto.SeatStatusDTO;
import cinema.dto.SessionDTO;
import cinema.entity.CinemaHall;
import cinema.entity.Movie;
import cinema.entity.Seat;
import cinema.entity.Session;
import cinema.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final MovieRepository movieRepository;
    private final CinemaHallRepository cinemaHallRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;

    public List<Session> getSessionsByMovie(Long movieId) {
        return sessionRepository.findByMovieId(movieId);
    }

    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    @Transactional
    public Session createSession(SessionDTO dto) {
        Movie movie = movieRepository.findById(dto.getMovieId())
                .orElseThrow(() -> new RuntimeException("Фильм не найден"));
        CinemaHall hall = cinemaHallRepository.findById(dto.getHallId())
                .orElseThrow(() -> new RuntimeException("Зал не найден"));

        Session session = new Session();
        session.setMovie(movie);
        session.setCinemaHall(hall);
        session.setStartTime(dto.getStartTime());
        session.setPrice(dto.getPrice());
        return sessionRepository.save(session);
    }

    @Transactional
    public void deleteSession(Long id) {
        if (!sessionRepository.existsById(id)) {
            throw new RuntimeException("Сеанс не найден");
        }

        bookingRepository.deleteBySessionId(id);

        sessionRepository.deleteById(id);
    }

    public List<SeatStatusDTO> getSeatsStatusForSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Сеанс не найден"));

        Long hallId = session.getCinemaHall().getId();
        List<Seat> allSeats = seatRepository.findByCinemaHallId(hallId);
        List<Long> reservedSeatIds = bookingRepository.findReservedSeatIdsBySessionId(sessionId);

        return allSeats.stream()
                .map(seat -> new SeatStatusDTO(
                        seat.getId(),
                        seat.getRowNumber(),
                        seat.getSeatNumber(),
                        !reservedSeatIds.contains(seat.getId())
                ))
                .collect(Collectors.toList());
    }
}