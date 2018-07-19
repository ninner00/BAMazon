var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  readProducts();
});

// function which prompts the user for what action they should take



function readProducts() {
  console.log("\nWelcome to BAMazon! Here is a list of all the items we have. Please select the product id to buy it.\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    for(var i = 0; i < res.length; i++)
        // Log all results of the SELECT statement
      { console.log(
        "Product id: " +
        res[i].product_id +
        " || Product Name: " +
        res[i].product_name +
        " || Department: " +
        res[i].department_name +
        " || Price: " +
        res[i].price +
        " || Stock Quantity: " +
        res[i].stock_quantity
        );
        console.log('--------------------------------------------------------------------------------------------------')
      }
     // console.log(table.toString());
    // console.log(res);
    // connection.end();
    runSearch();
  });
}


// function which prompts the user for what action they should take
function runSearch() {
  inquirer.prompt({
      name: "action",
      type: "list",
      message: "How are you using BAMazon?",
      choices: [
        "As a customer",
        // "As a supervisor",
        // "As a manager"
      ]
    })

    .then(function(answer) {
      switch (answer.action) {
      case "As a customer":
      buyBAMazon();
        // readProducts();
        break;

      // case "As a supervisor":
      //   superviseBAMazon();
      //   break;

      // case "As a manager":
      //   manageBAMazon();
      //   break;
      }
    });
}

// 5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

// // 6. The app should then prompt users with two messages.

// //    * The first should ask them the ID of the product they would like to buy.

// //    * The second message should ask how many units of the product they would like to buy.

function buyBAMazon() {
  // prompt for info about the item being put up for auction
  inquirer.prompt([
      {
        name: "item",
        type: "input",
        message: "What is the id of the item you would like to buy?",

        // THIS IS NOT WORKING AND I AM NOT SURE WHY ---
        // validate: function(value) {
        //   if (isNaN(value) === false) {
        //     return true;
        //   }
        //   return false;
        // }
      },

      {
        name: "units",
        type: "input",
        message: "How many would you like to buy?",

        // THIS IS NOT WORKING AND I AM NOT SURE WHY ---
        // validate: function(value) {
        //   if (isNaN(value) === false) {
        //     return true;
        //   }
        //   return false;
        // }
      }
    ])

  .then (function(answer) {
    // Item they are buying
    var whatBuying = answer.item;
    // makes it a number
    // var howMany = parseInt(answer.units);
    var howMany = answer.units;
    // price of the item * the quantity 
    // var total = (whatBuying * howMany);

    // Query db to make sure the item ID exists and is in stock
    // var queryStr = "SELECT * FROM products WHERE ?";

    var queryStr =  "SELECT * FROM products WHERE ?";
    
    connection.query (queryStr, {product_id: whatBuying}, function(err, data) {
      // connection.query (queryStr, {product_name: whatBuying}, function(err, data) {

      if (err) throw err;

      // wrong id entered
      if (data.length === 0) {
        console.log("Please select a correct item id");
        readProducts()
      }

      else {
        var itemsData = data[0];
        // if (howMany <= data[0].stock_quantity) {

        if (howMany <= itemsData.stock_quantity) {
          console.log("Your order is in stock!!");
          // Update the system
          var newQueryStr =  "UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?";

          connection.query (newQueryStr, [howMany, whatBuying], function(err, data) {
            // connection.query (queryStr, {product_name: whatBuying}, function(err, data) {

            //after purchase, updates quantity in Products
            //UPDATE products SET stock_quantity = stock_quantity - 10 WHERE product_id = 4;


              // "UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?",
              // [
               
              //   answer.units,
              //   answer.item
              // ],
            if (err) throw err;
              // console.log("Your purchase was created successfully! You total is $" + total + "for " + whatBuying);
              console.log("Your purchase was created successfully! You total is $" + parseFloat(itemsData.price) * howMany);
             
              // connection.end();
              askAgain();
          });
        }

        else {
          console.log("\n We are sorry but that amount of the item you want is not in stock, please update your order.\n");
          readProducts();
        }
      };
    });
  });
}

//asks if they would like to purchase another item
function askAgain(){
  inquirer.prompt([{
    type: "confirm",
    name: "reply",
    message: "Would you like to purchase another item?"
  }])

  .then(function(answer){
    if (answer.reply){
      buyBAMazon();
    } 

    else{
      console.log("Thanks for your order!");
    }
  });
}





