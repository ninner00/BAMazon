DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  product_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(45,2) NOT NULL,
  stock_quantity INT default 0,
  PRIMARY KEY (product_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sugar Skull Shaker", "Housewares", 12.99, 50),
("Nerf Darts", "Toys", 5.99, 1000),
("Dell Laptop", "Electronics", 499.99, 25),
("iphone 7", "Electronics", 399.99, 150),
("Place Mat", "Housewares", 2.99, 2000),
("Tri-fold Wallet", "Mens", 20.99, 100),
("Lucky Cat", "Housewares", 22.99, 10),
("Coloring Book", "School and Office", 1.00, 2550),
("Framed Art", "Housewares", 39.99, 40),
("Wind Up Pac-Man", "Toys", 2.99, 650);


SELECT * FROM bamazon.products;

UPDATE products SET stock_quantity = stock_quantity - 10

WHERE product_id = 4;