package cinema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SeatStatusDTO {
    private Long id;          // Идентификатор в БД (например, 141416)
    private Integer rowNumber;  // Номер ряда
    private Integer seatNumber; // Номер места в ряду
    private boolean isAvailable; // Свободно ли место для бронирования?
}
