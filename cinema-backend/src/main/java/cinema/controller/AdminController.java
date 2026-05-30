package cinema.controller;

import cinema.dto.CinemaHallDTO;
import cinema.dto.MovieDTO;
import cinema.dto.SessionDTO;
import cinema.entity.Booking;
import cinema.entity.CinemaHall;
import cinema.entity.Movie;
import cinema.entity.Session;
import cinema.service.BookingService;
import cinema.service.CinemaHallService;
import cinema.service.MovieService;
import cinema.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3001")
public class AdminController {

    private final CinemaHallService cinemaHallService;
    private final MovieService movieService;
    private final SessionService sessionService;
    private final BookingService bookingService;

    @PostMapping("/halls")
    public ResponseEntity<CinemaHall> addHall(@RequestBody CinemaHallDTO cinemaHallDTO) {
        return ResponseEntity.ok(cinemaHallService.createHallWithSeats(cinemaHallDTO));
    }

    @GetMapping("/halls")
    public ResponseEntity<List<CinemaHall>> getAllHalls() {
        return ResponseEntity.ok(cinemaHallService.getAllHalls());
    }

    @DeleteMapping("/halls/{id}")
    public ResponseEntity<String> deleteHall(@PathVariable Long id) {
        cinemaHallService.deleteHall(id);
        return ResponseEntity.ok("Зал успешно удален");
    }

    @PostMapping("/movies")
    public ResponseEntity<Movie> addMovie(@RequestBody MovieDTO movieDTO) {
        return ResponseEntity.ok(movieService.createMovie(movieDTO));
    }

    @GetMapping("/movies")
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @PutMapping("/movies/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody MovieDTO movieDTO) {
        return ResponseEntity.ok(movieService.updateMovie(id, movieDTO));
    }

    @DeleteMapping("/movies/{id}")
    public ResponseEntity<String> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok("Фильм успешно удален");
    }

    @PostMapping("/sessions")
    public ResponseEntity<Session> addSession(@RequestBody SessionDTO sessionDTO) {
        return ResponseEntity.ok(sessionService.createSession(sessionDTO));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<Session>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<String> deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return ResponseEntity.ok("Сеанс успешно удален");
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookingsForAdmin());
    }
}
