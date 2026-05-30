package cinema.service;

import cinema.dto.MovieDTO;
import cinema.entity.Movie;
import cinema.entity.Session;
import cinema.repository.MovieRepository;
import cinema.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MovieService {

    private final MovieRepository movieRepository;
    private final SessionRepository sessionRepository;
    private final SessionService sessionService;
    private final FileStorageService fileStorageService;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Фильм не найден"));
    }

    public Movie createMovie(MovieDTO dto) {
        Movie movie = new Movie();
        movie.setTitle(dto.getTitle());
        movie.setDescription(dto.getDescription());
        movie.setGenre(dto.getGenre());
        movie.setDuration(dto.getDuration());
        movie.setAgeRating(dto.getAgeRating());
        return movieRepository.save(movie);
    }

    public void deleteMovie(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new RuntimeException("Фильм не найден");
        }

        List<Session> movieSessions = sessionRepository.findByMovieId(id);

        for (Session session : movieSessions) {
            sessionService.deleteSession(session.getId());
        }

        movieRepository.deleteById(id);
    }

    public Movie updateMovie(Long id, MovieDTO dto) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Фильм не найден"));

        movie.setTitle(dto.getTitle());
        movie.setDescription(dto.getDescription());
        movie.setGenre(dto.getGenre());
        movie.setDuration(dto.getDuration());
        movie.setAgeRating(dto.getAgeRating());

        return movieRepository.save(movie);
    }

    public Movie uploadMovieCover(Long movieId, MultipartFile file) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Фильм не найден"));

        String coverUrl = fileStorageService.saveFile(file);

        movie.setCoverUrl(coverUrl);

        return movieRepository.save(movie);
    }
}