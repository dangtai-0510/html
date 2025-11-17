create database khm;
use khm;

-- drop database khm;
-- quantity : số lượng
CREATE TABLE customer (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  city VARCHAR(100)
);
INSERT INTO customer (name, city) VALUES
('Nguyen Van A', 'Hanoi'),
('Tran Thi B', 'Hanoi'),
('Le Van C', 'Danang'),
('Pham Thi D', 'Saigon'),
('Hoang Van E', 'Saigon');


CREATE TABLE product (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(100),
  price double
);
INSERT INTO product (product_name, price) VALUES
('Bút bi', 5.00),
('Sổ tay', 15.00),
('Bàn phím cơ', 950.00),
('Chuột máy tính', 320.00),
('USB 32GB', 120.00);


CREATE TABLE orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  order_date DATE,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);
INSERT INTO orders (customer_id, order_date) VALUES
(1, '2025-01-10'),
(1, '2025-01-20'),
(2, '2025-01-11'),
(2, '2025-02-02'),
(3, '2025-01-25'),
(4, '2025-01-15'),
(5, '2025-02-10');

-- quantity : số lượng
CREATE TABLE order_detail (
  detail_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  product_id INT,
  quantity INT,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- quantity : số lượng
INSERT INTO order_detail (order_id, product_id, quantity) VALUES
(1, 1, 3),
(1, 2, 1),
(2, 3, 1),
(2, 1, 5),
(3, 4, 1),
(3, 5, 2),
(4, 2, 3),
(5, 1, 10),
(6, 3, 2),
(6, 4, 1),
(7, 5, 4),
(7, 2, 1);

-- câu 1
select c.name, c.city, sum(od.quantity * p.price) as tongtiencuakhach

from customer c
join orders o on c.customer_id = o.customer_id
join order_detail od on o.order_id = od.order_id
join product p on p.product_id = od.product_id
group by c.customer_id
order by tongtiencuakhach desc;

-- câu 2
select p.product_name, avg(od.quantity) as trungbinhsoluong
from product p
join order_detail od on p.product_id = od.product_id
group by  p.product_id
-- câu 3
SELECT name
FROM customer
WHERE customer_id = (
    SELECT customer_id
    FROM (
        SELECT c.customer_id,
               SUM(od.quantity * p.price) AS total_spent
        FROM customer c
        JOIN orders o ON c.customer_id = o.customer_id
        JOIN order_detail od ON o.order_id = od.order_id
        JOIN product p ON p.product_id = od.product_id
        GROUP BY c.customer_id
        ORDER BY total_spent DESC
        LIMIT 1
    ) AS t
);

-- câu 3 cách 2
SELECT c.name, c.city
FROM customer c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_detail od ON o.order_id = od.order_id
JOIN product p ON p.product_id = od.product_id
GROUP BY c.customer_id, c.name, c.city
HAVING SUM(od.quantity * p.price) = (
    SELECT MAX(tongsotienchitieu)
    FROM (
        SELECT SUM(od2.quantity * p2.price) AS tongsotienchitieu
        FROM customer c2
        JOIN orders o2 ON c2.customer_id = o2.customer_id
        JOIN order_detail od2 ON o2.order_id = od2.order_id
        JOIN product p2 ON p2.product_id = od2.product_id
        GROUP BY c2.customer_id
    ) AS t
);




-- câu 4
create view view_order_summary as
select c.name, o.order_date, sum(od.quantity * p.price) tongsoluong
from customer c
join orders o on c.customer_id = o.customer_id
join order_detail od on o.order_id = od.order_id
join product p on p.product_id = od.product_id 
group by o.order_id

-- câu 5
create index index_customerid on orders(customer_id);
-- câu 6
delimiter $$
create procedure sp_total_spending(in customer_name varchar(100))
begin
  select c.name, sum(od.quantity * p.price) as tong_sl
  from customer c
  join orders o on c.customer_id = o.customer_id
  join order_detail od on o.order_id = od.order_id
  join product p on p.product_id = od.product_id
  WHERE c.name = customer_name
  group by c.customer_id;
end $$
delimiter ;
CALL sp_total_spending('Nguyen Van A');
SELECT c.name, o.order_id
FROM customer c
RIGHT JOIN orders o ON c.customer_id = o.customer_id;







