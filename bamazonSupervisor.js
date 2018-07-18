
var mysql = require("mysql");
var inquirer = require('inquirer');
var Table = require('cli-table');

var dept_arr = [];
var firstTime = true;

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
    // 
    updateDeptArr();
});


function menuOptions() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Choose:",
                choices: ['View Product Sales by Department', 'Create New Department'],
                name: "choice"
            }
        ])
        .then(response => {
            switch (response.choice) {
                case 'View Product Sales by Department':
                    viewSalesByDept();
                    break;
                case 'Create New Department':
                    deptPrompt();
                    break;
            }
        });
}

//
function deptPrompt() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter department name:",
                name: "dept"
            },
            {
                type: "input",
                message: "Enter Overhead Costs:",
                name: "overhead"
            }
        ])
        .then(response => {
            createDept(response.dept, response.overhead);
        });
}

// 
function prompt() {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "\nWould you like to make another selection?\n",
                name: "confirm",
                default: true
            }
        ])
        .then(response => {
            if (response.confirm) {
                menuOptions();
            } else {
                connection.end();
            }
        });
}


function updateDeptArr() {
    dept_arr = [];
    connection.query("SELECT department_name FROM departments", function (err, res) {
        if (err) throw err;
        // 
        res.forEach(item => {
            dept_arr.push(item.department_name);
        });
        if (firstTime) {
            firstTime = false;
            menuOptions();
        } else {
            prompt();
        }
    });
}

//
function viewSalesByDept() {
    connection.query(`SELECT departments.department_id,departments.department_name,departments.over_head_costs,sum(products.product_sales) AS sales FROM departments
    JOIN products ON departments.department_name=products.department_name
    GROUP BY departments.department_id`, (err, res) => {
            if (err) throw console.log(err);
            var _arr = [];
            res.forEach(dept => {
                _arr.push([dept.department_id, dept.department_name, parseFloat(dept.over_head_costs).toFixed(2), parseFloat(dept.sales).toFixed(2), parseFloat(dept.sales - dept.over_head_costs).toFixed(2)]);
            });
            //
            makeTable(['ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit'], [7, 35, 17, 17, 17], _arr);
            prompt();
        })
}

// Supervisor adds new department
function createDept(dept, overhead) {
    if (dept_arr.indexOf(dept) > -1) {
        console.log("\nYou have already created this department.\n");
        prompt();
        return;
    }
    var query = connection.query(
        "INSERT INTO departments SET ?",
        {
            department_name: dept,
            over_head_costs: overhead
        },
        function (err, res) {
            if (err) throw console.log(err);
            // console.log(res);
            updateDeptArr();
        }
    );

    // logs the actual query being run
    // console.log(query.sql);
}

function makeTable(h_arr, w_arr, _arr) {
    var table = new Table({
        head: h_arr,
        colWidths: w_arr
    });

    _arr.forEach(item => {
        table.push(item);
    });

    console.log(table.toString(), '\n');
}