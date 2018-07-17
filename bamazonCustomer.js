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
    showInventory();
});


function purchaseProduct() {
    inquirer
        .prompt([
            // Here we create a basic text prompt.
            {
                type: "list",
                message: "Which item would you like to purchase?",
                choices: product_arr,
                name: "product"
            },
            {
                type: "input",
                message: "How many units would you like to buy?",
                name: "qty"
            }
        ])
        .then(response => {
            // 
            checkInventory(response.product, parseInt(response.qty));
        });
}

// 
function prompt() {
    inquirer
        .prompt([
            // Here we create a basic text prompt.
            {
                type: "confirm",
                message: "\nWould you like to make another purchase?\n",
                name: "confirm",
                default: true
            }
        ])
        .then(response => {
            // 
            if (response.confirm) {
                showInventory();
            } else {
                connection.end();
            }
        });
}


function checkInventory(prod, qty) {
    // console.log(item, bid);
    connection.query(`SELECT * FROM products WHERE product_name="` + prod + `"`, function (err, res) {
        if (err) throw err;
        //
        var new_qty = parseInt(res[0].stock_quantity) - qty;

        if (new_qty < 0) {
            console.log("\nInsufficient Quantity!\n");
            purchaseProduct();
        } else {
            console.log("\nPurchase completed!");
            // console.log("total charged: $" + parseFloat(res[0].price) * qty, '\n');
            var price = parseFloat(res[0].price);

            makeTable(['Product', 'Price per Unit', 'Qty Purchased', 'Total'], [65, 17, 15, 15], [[prod, parseFloat(res[0].price).toFixed(2), qty, parseFloat(price * qty).toFixed(2)]]);
            adjustInventory(prod, new_qty);
        }
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


function showInventory() {
    var _arr = [];
    product_arr = [];
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // (product_name, department_name, price, stock_quantity)
        res.forEach(item => {
            _arr.push([item.item_id, item.product_name, item.department_name, parseFloat(item.price).toFixed(2), item.stock_quantity]);
            product_arr.push(item.product_name);
        });
        //
        makeTable(['ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'], [7, 65, 35, 17, 17], _arr);
        purchaseProduct();
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

    console.log(table.toString(),'\n');
}

