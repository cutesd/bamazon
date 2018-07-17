DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

-- The products table should have each of the following columns:
-- item_id (unique id for each product)
-- product_name (Name of product)
-- department_name
-- price (cost to customer)
-- stock_quantity (how much of the product is available in stores)

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("LilyAna Naturals Retinol Cream Moisturizer","Beauty & Personal Care",14.20, 56);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dash Rapid Egg Cooker","Home & Kitchen",14.85, 293);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dell i5770-7449SLV-PUS Inspiron 17 5770 Laptop","Electronics",806, 94);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Philips Sonicare Diamond Clean Electric Toothbrush","Beauty & Personal Care",99.95, 70);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Anova Culinary A2.2-120V-US Sous Vide Immersion Circulator","Home & Kitchen",109, 105);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("adidas Women's Cf Advantage Cl Sneaker","Clothing, Shoes & Jewelry",29.95, 86);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Colore Gel Pens Set of 100 Drawing Art Markers","Painting, Drawing & Art Supplies",13.99, 35);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("ULTRAIDEAS Women's Comfort Coral Fleece Memory Foam Slippers","Clothing, Shoes & Jewelry",16.95, 90);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wilson Evolution Indoor Game Basketball","Sports & Outdoors",48.95, 130);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ray-Ban RB2132 New Wayfarer Sunglasses","Clothing, Shoes & Jewelry",121.00, 40);

-- ALTER TABLE items
-- ADD highest_bidder VARCHAR(255) NULL;

-- ALTER TABLE items
-- ADD created_by VARCHAR(255) NULL;


SELECT * FROM products;

