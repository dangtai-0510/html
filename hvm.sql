create database hvm;
use hvm;
drop table Province;
create table Province(
id int primary key auto_increment,
name varchar(100) not null);
INSERT INTO Province (name) VALUES
('Hà Nội'),
('Hồ Chí Minh'),
('Đà Nẵng'),
('Cần Thơ'),
('Bình Dương');


create table  Classes(
id int primary key auto_increment,
name varchar(100) not null,
language varchar(50) not null,
description varchar(100));
INSERT INTO Classes (name, language, description) VALUES
('Lớp A1', 'English', 'Lớp tiếng Anh cơ bản'),
('Lớp A2', 'Japanese', 'Lớp tiếng Nhật giao tiếp'),
('Lớp B1', 'Korean', 'Lớp tiếng Hàn sơ cấp'),
('Lớp C1', 'Chinese', 'Lớp tiếng Trung nâng cao'),
('Lớp D1', 'English', 'Lớp luyện thi TOEIC');


-- Bảng Students (id, fullname, province_id, phone (unique), class_id)
drop table Students;
create table Students(
id int primary key auto_increment,
fullname varchar(100) not null,
province_id int,
phone varchar(50) unique,
class_id int,
foreign key(province_id) references Province(id),
foreign key(class_id) references Classes(id));
INSERT INTO Students (fullname, province_id, phone, class_id) VALUES
('Nguyễn Văn Nam', 1, '0901111111', 1),
('Trần Thị Hoa', 2, '0902222222', 2),
('Lê Quốc Nam', 3, '0903333333', 3),
('Nguyễn Thị Hằng', 1, '0904444444', 4),
('Phạm Anh Dũng', 4, '0905555555', 5),
('Vũ Minh Nam', 2, '0906666666', 1),
('Nguyễn Văn An', 3, '0907777777', 2),
('Đỗ Thị Lan', 5, '0908888888', 3),
('Nguyễn Quốc Tuấn', 1, '0909999999', 4),
('Trần Minh Hiếu', 2, '0910000000', 5);



-- Bảng Course (id, name, description)

create table Course(
id int primary key auto_increment,
name varchar(100) not null,
description text);
INSERT INTO Course (name, description) VALUES
('Ngữ pháp tiếng Anh', 'Ôn tập ngữ pháp cơ bản'),
('Giao tiếp tiếng Anh', 'Học kỹ năng giao tiếp'),
('Ngữ pháp tiếng Nhật', 'Cấu trúc câu tiếng Nhật'),
('Giao tiếp tiếng Hàn', 'Luyện hội thoại tiếng Hàn'),
('Đọc hiểu tiếng Trung', 'Kỹ năng đọc hiểu nâng cao');


-- Bảng Point(id, course_id, student_id, point)

create table Point(
id int primary key auto_increment,
course_id int,
student_id int,
point float,
foreign key(course_id) references Course(id),
foreign key(student_id) references Students(id));

INSERT INTO Point (course_id, student_id, point) VALUES
(1, 1, 8.5),
(1, 2, 7.0),
(1, 3, 9.0),
(2, 1, 8.0),
(2, 4, 6.5),
(3, 2, 7.5),
(3, 3, 8.0),
(3, 5, 9.5),
(4, 6, 7.0),
(4, 7, 8.0),
(4, 8, 6.0),
(5, 9, 9.0),
(5, 10, 8.5),
(2, 5, 7.5),
(1, 6, 8.0);

-- a
select * from Students where fullname like '%Nam%';
-- b
select * from Students where fullname like 'Nguyễn%';
-- c
select s.fullname, c.name AS class_name
from Students as s
join Classes as c on s.class_id = c.id;

-- d, Đưa ra danh sách HS, tên lớp, tên tỉnh
select s.fullname, c.name, p.name AS Tinhthanh
from Students as s
join Classes as c on s.class_id = c.id
join Province as p on s.province_id = p.id;

-- e
SELECT c.name AS class_name, COUNT(s.id) AS so_luong_hs
FROM Classes c
LEFT JOIN Students s ON s.class_id = c.id
GROUP BY c.id, c.name;
 -- f
SELECT p.name AS province_name, COUNT(s.id) AS so_luong_hs
FROM Province p
LEFT JOIN Students s ON s.province_id = p.id
GROUP BY p.id, p.name;