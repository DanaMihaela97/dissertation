CREATE TABLE animal (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        animal_name VARCHAR(255) NOT NULL,
                        birthdate DATE NOT NULL,
                        sex VARCHAR(10),
                        age INT,
                        weight VARCHAR(255),
                        type VARCHAR(255),
                        breed VARCHAR(255),
                        anamnesis TEXT
);

CREATE TABLE vaccines (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          age_weeks INT NOT NULL,
                          rapel VARCHAR(255) NOT NULL,
                          animal_type VARCHAR(255) NOT NULL
);

CREATE TABLE animal_vaccines (
                                 animal_id BIGINT NOT NULL,
                                 vaccine_id BIGINT NOT NULL,
                                 PRIMARY KEY (animal_id, vaccine_id),
                                 FOREIGN KEY (animal_id) REFERENCES animal(id),
                                 FOREIGN KEY (vaccine_id) REFERENCES vaccines(id)
);
