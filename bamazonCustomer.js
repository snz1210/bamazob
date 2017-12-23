var mysql = require("mysql");
var inquirer = require("inquirer");

// connection to the server
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_DB"
});

// error function
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    queryAllData();
});

var chosenId;
var chosenUnits;
var chosenQuantity;
var chosenPrice;

// function that displays all item data
function queryAllData() {
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].dept_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
    });
}

// function to prompt user to choose an id for the item
function start() {
    inquirer
        .prompt([{
                name: "id",
                type: "input",
                message: "What is the ID of the product you would like to buy?"
            },
            {
                name: "units",
                type: "input",
                message: "How many units of the product would you like to buy?"
            },
        ])

        .then(function(answer) {
                // get the information of the chosen item
                chosenId = answer.id;
                chosenUnits = answer.units;
                // var index = chosenId - 1;
                console.log(answer);
                console.log(chosenUnits);

                // console.log(index);

                connection.query("SELECT * FROM products WHERE id=" + chosenId, function(err, res) {
                  console.log(res);

                  chosenQuantity = res[0].stock_quantity;
                  // console.log(chosenQuantity);

                  chosenPrice = res[0].price;
                  // console.log(chosenPrice);

                        // how to say chosen id's stock quantity?
                        if (res[0].stock_quantity > answer.units) {
                            console.log("We've got it in stock!");
                            checkout();
                        } else {
                            console.log("Insufficient quantity, try again!");
                            start();
                        }
                    
                });

        });
}

start();

function checkout () {
  var newQuantity = chosenQuantity - chosenUnits;
  console.log(newQuantity);
    connection.query("UPDATE products SET stock_quantity = " + newQuantity + " WHERE id=" + chosenId, function(err, res) {
    });

  var cost = chosenPrice * chosenUnits;
  console.log("Your total cost is $" + cost + " !");

}


            // how to update sql to reflect new quantity in stock after customer's order

            // how to show customer total cost of purchase