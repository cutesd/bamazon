# BAMAZON

## Overview
Bamazon is a node based CLI app that shows off CRUD MySQL manipulation of a database.  It starts with a database of 10 products and then allows the user to interact and modify the data as a customer and a manager.

[Click HERE to view walkthrough video](https://drive.google.com/file/d/1N0MEfwRjpjb3NhA4ndGdQubkADJIN6_k/view)


## Demonstrates
* NodeJS
* MySQL
* CRUD
* NPM
* Git


## Customer
* Created a MySQL Database called bamazon.
* Database is populated with around 10 different products. 
* Application first displays all of the items available for sale. 
* User is then prompted with two messages.
  * The first asks which product they would like to buy from customized list
  * second message asks how many units of the product they would like to buy.
* Once the customer has placed the order, your application checks if store has enough of the product to meet the customer's request.
  * If not, the app logs 'Insufficient quantity!', and then prevents the order from going through.
  * If store has enough of the product, app fulfills the customer's order.
* Once the update goes through, show the customer the total cost of their purchase.


## Manager
* App lists a set of menu options:
  * View Products for Sale
  * View Low Inventory
  * Add to Inventory
  * Add New Product
* If a manager selects View Products for Sale, app lists every available item: the item IDs, names, prices, and quantities.
* If a manager selects View Low Inventory, then it lists all items with an inventory count lower than five.
* If a manager selects Add to Inventory, app displays a prompt that will let the manager "add more" of any item currently in the store.
* If a manager selects Add New Product, it allows the manager to add a completely new product to the store.


## Supervisor
* Product Sales are tracked for customers
* App lists set of menu options:
  * View Product Sales by Department
  * Create New Department
* When a supervisor selects View Product Sales by Department, the app displays a summarized table of Department ID, Name, Overhead, Sales, and Total Profit
* Creating new Department does not cause it to be viewable in the Product Sales option, a product must be added to the department as a manager before it is seen under the Product Sales


## Author
Kimberly Cooper


