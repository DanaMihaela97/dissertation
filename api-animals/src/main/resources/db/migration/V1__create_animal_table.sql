CREATE TABLE animal (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        animal_name VARCHAR(255) NOT NULL,
                        birthdate DATE NOT NULL,
                        sex VARCHAR(10),
                        age INT,
                        weight VARCHAR(255),
                        type VARCHAR(255),
                        breed VARCHAR(255),
                        owner_email VARCHAR(255)
);

CREATE TABLE vaccines (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        age_weeks INT NOT NULL,
                        rapel_days INT NOT NULL,
                        revaccination_interval VARCHAR(255) NOT NULL,
                        animal_type VARCHAR(255) NOT NULL
);
CREATE TABLE animal_vaccines (
                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                 animal_id BIGINT NOT NULL,
                                 vaccine_id BIGINT NOT NULL,
                                 first_dose_date DATE,
                                 second_dose_date DATE,
                                 next_dose DATE,
                                 FOREIGN KEY (animal_id) REFERENCES animal(id) ON DELETE CASCADE,
                                 FOREIGN KEY (vaccine_id) REFERENCES vaccines(id) ON DELETE CASCADE
);

