var mysql = require("mysql");
var inquirer = require('inquirer');
var Table = require('cli-table');

var product_arr = [];
var dept_arr = [];


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
            var sales = (res[0].product_sales === null) ? 0 : parseFloat(res[0].product_sales);
            var total = parseFloat(price * qty);
            var new_total = parseFloat(sales + total).toFixed(2);

            // console.log("product_sales:", sales, "total:", price, "*", qty, (price*qty), total);
            // console.log(sales, "+", total, (sales+total), new_total);

            makeTable(['Product', 'Price per Unit', 'Qty Purchased', 'Total'], [65, 17, 15, 15], [[prod, parseFloat(price).toFixed(2), qty, parseFloat(total).toFixed(2)]]);
            adjustInventory(prod, new_qty, new_total);
        }
    });
}

function adjustInventory(prod, qty, total) {
    // console.log("Updating " + item + " bid...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: qty,
                product_sales: total
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
            _arr.push([item.item_id, item.product_name, item.department_name, parseFloat(item.price).toFixed(2), item.stock_quantity, parseFloat(item.product_sales).toFixed(2)]);
            product_arr.push(item.product_name);
        });
        //
        makeTable(['ID', 'Product Name', 'Department Name', 'Price', 'Stock Qty', 'Sales'], [7, 65, 35, 13, 13, 17], _arr);
        // checkDepts(res);
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

    console.log(table.toString(), '\n');
}

//
//
//
function checkDepts(res){
    res.forEach(item =>{
        if(dept_arr.indexOf(item.department_name) === -1) {
            dept_arr.push(item.department_name);
            createDept(item.department_name);
        }
    });
}

// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function createDept(dept) {
    // console.log("Inserting a new item...\n");
    var query = connection.query(
        "INSERT INTO departments SET ?",
        {
            department_name: dept,
            over_head_costs: Math.floor(Math.random()* 50000)+1000
        },
        function (err, res) {
            if(err) throw console.log(err);
            console.log(res);
        }
    );

    // logs the actual query being run
    // console.log(query.sql);
}
