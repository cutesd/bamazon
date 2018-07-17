var mysql = require("mysql");
var inquirer = require('inquirer');
var Table = require('cli-table');

var product_arr = [];

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "88888888",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
    menuOptions();
});

function menuOptions() {
    inquirer
        .prompt([
            // Here we create a basic text prompt.
            {
                type: "list",
                message: "Which item would you like to purchase?",
                choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
                name: "choice"
            }
        ])
        .then(response => {
            // 
            switch (response.choice) {
                case 'View Products for Sale':
                    showInventory();
                    break;
                case 'View Low Inventory':
                    viewLowInventory();
                    break;
                case 'Add to Inventory':
                    updateProductArr();
                    break;
                case 'Add New Product':
                    addNewProduct();
                    break;
            }
        });
}

//
function addToInventory() {
    inquirer
        .prompt([
            // Here we create a basic text prompt.
            {
                type: "list",
                message: "Which item would you like to adjust?",
                choices: product_arr,
                name: "product"
            },
            {
                type: "input",
                message: "How many would you like to add?",
                name: "qty"
            }
        ])
        .then(response => {
            checkInventory(response.product, parseInt(response.qty));
        });
}

//prod, dept, price, qty
function addNewProduct() {
    inquirer
        .prompt([
            // Here we create a basic text prompt.
            {
                type: "input",
                message: "Enter product name:",
                name: "product"
            },
            {
                type: "input",
                message: "Enter department name:",
                name: "dept"
            },
            {
                type: "input",
                message: "Enter price:",
                name: "price"
            },
            {
                type: "input",
                message: "Enter quantity:",
                name: "qty"
            }
        ])
        .then(response => {
            createProduct(response.product, response.dept, parseFloat(response.price), parseInt(response.qty));
        });
}

function updateProductArr() {
    product_arr = [];
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        res.forEach(item => {
            product_arr.push(item.product_name);
        });
        addToInventory();
    });
}

// 
function prompt() {
    inquirer
        .prompt([
            // Here we create a basic text prompt.
            {
                type: "confirm",
                message: "\nWould you like to make another selection?\n",
                name: "confirm",
                default: true
            }
        ])
        .then(response => {
            // 
            if (response.confirm) {
                menuOptions();
            } else {
                connection.end();
            }
        });
}

// Create a new Node application called bamazonManager.js. Running this application will:

// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product

// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function viewLowInventory() {
    var _arr = [];
    connection.query(`SELECT * FROM products WHERE stock_quantity < 5`, function (err, res) {
        if (err) throw err;
        //
        res.forEach(item => {
            _arr.push([item.item_id, item.product_name, item.department_name, parseFloat(item.price).toFixed(2), item.stock_quantity]);
        });
        //
        makeTable(['ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'], [7, 65, 35, 17, 17], _arr);
        prompt();
    });

}

// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.

function checkInventory(prod, qty) {
    // console.log(item, bid);
    connection.query(`SELECT stock_quantity FROM products WHERE product_name="` + prod + `"`, function (err, res) {
        if (err) throw err;
        //
        var new_qty = parseInt(res[0].stock_quantity) + qty;
        adjustInventory(prod, new_qty);
    });
}

function adjustInventory(prod, qty) {
    // console.log("Updating " + item + " bid...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: qty
            },
            {
                product_name: prod
            }
        ],
        function (err, res) {
            // console.log(res.affectedRows + " items updated!\n");
            prompt();
        }
    );

    // logs the actual query being run
    // console.log(query.sql);
}


// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function createProduct(prod, dept, price, qty) {
    // console.log("Inserting a new item...\n");
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
            product_name: prod,
            department_name: dept,
            price: price,
            stock_quantity: qty
        },
        function (err, res) {
            prompt();
        }
    );

    // logs the actual query being run
    // console.log(query.sql);
}


// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.

function showInventory() {
    var _arr = [];
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // (product_name, department_name, price, stock_quantity)
        res.forEach(item => {
            _arr.push([item.item_id, item.product_name, item.department_name, parseFloat(item.price).toFixed(2), item.stock_quantity]);
        });
        //
        makeTable(['ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'], [7, 65, 35, 17, 17], _arr);
        prompt();
    });
}


function makeTable(h_arr, w_arr, _arr) {
    // instantiate
    var table = new Table({
        head: h_arr,
        colWidths: w_arr
    });

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    _arr.forEach(item => {
        table.push(item);
    });

    console.log(table.toString(), '\n');
}