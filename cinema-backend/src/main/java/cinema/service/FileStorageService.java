package cinema.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileStorageService {

    // Папка на сервере, где будут храниться обложки
    private final String uploadDir = "uploads/";

    public String saveFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Файл не может быть пустым");
        }

        try {
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Генерируем уникальное имя файла, чтобы избежать перезаписи
            String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            String filePath = System.getProperty("user.dir") + File.separator + uploadDir + uniqueFileName;

            // Сохраняем файл на диск сервера
            file.transferTo(new File(filePath));

            return "/api/movies/uploads/" + uniqueFileName;

        } catch (IOException e) {
            throw new RuntimeException("Не удалось сохранить файл на сервере: " + e.getMessage());
        }
    }
}