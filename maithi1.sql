
CREATE DATABASE book_author_db;
USE book_author_db;


CREATE TABLE author (
    author_id INT PRIMARY KEY AUTO_INCREMENT,
    author_name VARCHAR(100),
    nationality VARCHAR(100)
);


CREATE TABLE book (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150),
    publish_year INT,
    price DECIMAL(10,2),
    author_id INT,
    FOREIGN KEY (author_id) REFERENCES author(author_id)
);


INSERT INTO author (author_name, nationality) VALUES
('Nguyen Nhat Anh', 'Vietnam'),
('Haruki Murakami', 'Japan'),
('J. K. Rowling', 'United Kingdom'),
('Dan Brown', 'United States'),
('Paulo Coelho', 'Brazil');


INSERT INTO book (title, publish_year, price, author_id) VALUES
('Mat Biec', 1990, 85000, 1),
('Toi thay hoa vang tren co xanh', 1995, 90000, 1),
('Co gai den tu hom qua', 1989, 78000, 1),

('Kafka on the Shore', 2002, 150000, 2),
('Norwegian Wood', 1987, 130000, 2),

('Harry Potter and the Sorcerer Stone', 1997, 200000, 3),
('Harry Potter and the Chamber of Secrets', 1998, 210000, 3),

('The Da Vinci Code', 2003, 170000, 4),

('The Alchemist', 1988, 160000, 5),
('Brida', 1990, 140000, 5);
-- câu 1
SELECT b.title, b.publish_year, b.price, a.author_name
FROM book b
JOIN author a ON b.author_id = a.author_id;
-- câu 2
SELECT a.author_name, COUNT(b.book_id) AS total_books
FROM author a
LEFT JOIN book b ON a.author_id = b.author_id
GROUP BY a.author_id, a.author_name;
-- câu 3
SELECT author_name
FROM author
WHERE author_id = (
    SELECT author_id
    FROM book
    GROUP BY author_id
    ORDER BY COUNT(*) DESC
    LIMIT 1
);
-- câu 4
CREATE VIEW view_book_summary AS
SELECT 
    b.title,
    b.publish_year,
    b.price,
    a.author_name,
    a.nationality
FROM book b
JOIN author a ON b.author_id = a.author_id;
-- câu 5
CREATE INDEX idx_author_id ON book(author_id);
-- câu 6
DELIMITER $$

CREATE PROCEDURE sp_total_books(IN authorName VARCHAR(100))
BEGIN
    SELECT COUNT(b.book_id) AS total_books
    FROM author a
    JOIN book b ON a.author_id = b.author_id
    WHERE a.author_name = authorName;
END $$

DELIMITER ;

