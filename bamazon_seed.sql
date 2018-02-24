DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255) NULL,
  department_name VARCHAR(255) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
  );
  
  INSERT INTO products (product_name, department_name, price, stock_quantity)
  VALUES ("fibnosticator", "nosticator stuff", 1.42, 17);
  
  INSERT INTO products (product_name, department_name, price, stock_quantity)
  VALUES ("foonosticator", "nosticator stuff", 2.42, 17);
  
  INSERT INTO products (product_name, department_name, price, stock_quantity)
  VALUES ("barnosticator", "nosticator stuff", 3.42, 17);

  INSERT INTO products (product_name, department_name, price, stock_quantity)
  VALUES ("foobarnosticator", "nosticator stuff", 4.42, 17);
  
  INSERT INTO products (product_name, department_name, price, stock_quantity)
  VALUES ("snafunosticator", "nosticator stuff", 5.42, 17);
  
  INSERT INTO products (product_name, department_name, price, stock_quantity)
  VALUES ("fibantinosticator", "antinosticator stuff", 6.42, 17);
  
  INSERT INTO products (product_name, department_name, price, stock_quantity)
  VALUES ("foonantiosticator", "antinosticator stuff", 7.42, 17);
  
  INSERT INTO products (product_name, department_name, price, stock_quantity)
  VALUES ("barantinosticator", "antinosticator stuff", 8.42, 17);

  INSERT INTO products (product_name, department_name, price, stock_quantity)
  VALUES ("foobarantinosticator", "antinosticator stuff", 9.42, 17);
  
  INSERT INTO products (product_name, department_name, price, stock_quantity)
  VALUES ("snafuantinosticator", "antinosticator stuff", 10.42, 17);