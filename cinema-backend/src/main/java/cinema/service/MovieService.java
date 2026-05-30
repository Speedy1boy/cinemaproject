package cinema.service;

import cinema.dto.MovieDTO;
import cinema.entity.Movie;
import cinema.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;

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
        movieRepository.deleteById(id);
    }

    @Transactional
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
}