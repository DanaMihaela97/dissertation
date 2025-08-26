CREATE TABLE review (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        email VARCHAR(255),
                        rating INT,
                        feedback VARCHAR(2000),
                        created_at TIMESTAMP,
                        name VARCHAR(255)
);
