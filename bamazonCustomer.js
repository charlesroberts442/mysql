/***********************************************************************
 * Copyright (c) 2018 Charles W. Roberts
 * All Rights Reserved
 *
 * No portion of this code may be copied or modified without the
 * prior written permission of Charles Roberts.
 *
 ***********************************************************************/

// dependencies npm packages
let inquirer       = require("inquirer");
let mysql          = require("mysql");
let Item           = require("./Item.js");
let ItemCollection = require("./ItemCollection.js");
let Debug          = false;
const {table}      = require('table');

// ------- Global Variables ----------------

/**
 * [data description]
 * @type {Array}
 */
var data = [];

/**
 * [output description]
 * @type {String}
 */
let output = "";

/**
 * [connection description]
 * @type {Object}
 */
let connection = {};

/**
 * [meEntertainYou description]
 * @type {String}
 */
let meEntertainYou = "A bad pun.";

/**
 * [charlesPassword description]
 * @type {String}
 */
let charlesPassword = "Duh, it's a secret!";

/**
 * [storeInventory description]
 * @type {ItemCollection}
 */
let storeInventory = new ItemCollection();

/**
 * [getPassword description]
 * @return {[type]} [description]
 */
function getPassword()
{
	let questionOne = 
	{
		type: "password",
		name: "myPassword",
    	message: "What is Charles' password?"
	};

	let promptSet = [questionOne];

	/**
	 * handlePromptError is the error handling callback 
	 * routine for the inquirer prompt.
	 * @param  {Object} err The error to be handled.
	 */
	function handlePromptError(err)
	{
		console.log("There was a prompt error.");
		console.log(err);
	}

	/**
	 * processAnswers processes the answer to the inquirer
	 * prompt presentation of what Charles' password is
	 * @param  {Object} answers The user's answers.
	 */
	function processAnswers(answers)
	{
		charlesPassword = answers.myPassword;

		doDatabaseConnect();

		// Query the database do learn what products are available
		doStoreInventoryQuery();

		console.log("\n\n");
		
	}

	inquirer.prompt(promptSet).
	  then(processAnswers ).
	  catch(handlePromptError);

} // End of getPassword()

/**
 * [doDatabaseConnect description]
 * @return {[type]} [description]
 */
function doDatabaseConnect()
{
	// Database Connection Credentials
		let databaseCredentials =
		{
		  host: "localhost",
		  port: 3306,

		  // username
		  user: "charles",

		  // password
		  password: charlesPassword,
		  database: "bamazon"
		};
		
		// Create a database connection object
		connection = mysql.createConnection(databaseCredentials);

		// Connect to the database
		function handleConnectError(err)
		{
			if(err)
			{
				console.log(err);
			}
		}

		connection.connect(handleConnectError);
}

/**
 * [doStoreInventoryQuery description]
 * @return {[type]} [description]
 */
function doStoreInventoryQuery()
{

	function storeInventoryQueryCallback(err, res)
	{
		if(err)
		{
			console.log("There was an error.");
			console.log(err);
			return;
		}
		else
		{
			let i = 0;
			let temp = [];
			let tableHeader = 
			[
				"Item ID",
				"Item Name",
				"Item Price"
			];

			console.log("Here is the product inventory:\n")
			temp.push(tableHeader);
			for(i=0; i < res.length; ++i)
			{
				

				let obj = new Item(res[i].item_id, 
					res[i].product_name,
					res[i].department_name,
					res[i].price,
					res[i].stock_quantity,
					res[i].product_sales);

				storeInventory.addItem(obj);

				let row =
				[
					obj.getID(),
					obj.getName(),
					obj.getPrice()
				];

				temp.push(row);
			}

			data = temp;

			output = table(data);
	 
			console.log(output);

			// Prompt the user for items and quantities
			getCustomerOrder();
		}
	}

	let query = "SELECT * FROM products ";
	connection.query(query,storeInventoryQueryCallback);

} // End of doStoreInventoryQuery()

/**
 * [getCustomerOrder description]
 * @return {[type]} [description]
 */
function getCustomerOrder()
{
	let questionOne = 
	{
		name: "itemWanted",
    	message: "What is the ID of the item you want to purchase?"
	};

	let questionTwo =
	{
		name: "quantity",
    	message: "How many of the items do you want to purchase?"
	};

	let promptSet = [questionOne, questionTwo];

	/**
	 * handlePromptError is the error handling callback 
	 * routine for the inquirer prompt.
	 * @param  {Object} err The error to be handled.
	 */
	function handlePromptError(err)
	{
		console.log("There was a prompt error.");
		console.log(err);
	}

	/**
	 * processAnswers processes the answer to the inquirer
	 * prompt presentation of what Charles' password is
	 * @param  {Object} answers The user's answers.
	 */
	function processAnswers(answers)
	{
		if(Debug === true)
		{
			console.log("I'm in processAnswers from get item and quantity.");
			console.log("item is " + answers.itemWanted);
			console.log("quantity is "+ answers.quantity);
		}
		processCustomerRequest(answers.itemWanted, answers.quantity);
	}
         
	inquirer.prompt(promptSet).
	  then(processAnswers ).
	  catch(handlePromptError);

} // End of doCustomerOrder

/**
 * [processCustomerRequest description]
 * @param  {[type]} item_id  [description]
 * @param  {[type]} quantity [description]
 * @return {[type]}          [description]
 */
function processCustomerRequest(item_id, quantity)
{
	let itemOrdered = storeInventory.getItem(item_id);

	if(quantity > itemOrdered.getStockQuantity())
	{
		console.log("\n\nInsufficient quantity!");
		console.log("\n\n");
		connection.end();

	}
	else
	{
		processCustomerOrder(item_id, quantity);
	}

} // End of processCustomerRequest()

/**
 * [processCustomerOrder description]
 * @param  {[type]} item_id  [description]
 * @param  {[type]} quantity [description]
 * @return {[type]}          [description]
 */
function processCustomerOrder(item_id, quantity)
{
	// Initialize variables
	let itemOrdered        = storeInventory.getItem(item_id);
	let itemID             = itemOrdered.getID();
	let costOfOne          = parseFloat(itemOrdered.getPrice());
	let totalSales         = parseFloat(costOfOne) * parseFloat(quantity);
	let newInventoryAmount = parseInt(itemOrdered.getStockQuantity()) -
		                        parseInt(quantity);

	if(Debug === true)
	{
		console.log("In processCustomerOrder(); BEFORE the query:");
		storeInventory.logCollection();
	}

	// Prepare for the query
	let queryString = "UPDATE products SET ? WHERE ?";

	let queryArray = 
	[
      {
        stock_quantity: newInventoryAmount,
        product_sales: totalSales
      },
      {
        item_id: itemID
      }
    ]; // End of queryArray

    let queryCallback = function(err,res)
    {
    	if (err)
            {
            	console.log(err);
            }
            else
            {
            	if(Debug === true)
              	{
	              	console.log("It worked.");
	              	console.log("AFTER the query");
	              	storeInventory.logCollection();
              	}
            }

            console.log("\n\n");  
            connection.end();

    }; // End of queryCallback()


    // Do the query
    connection.query(queryString, queryArray, queryCallback);

} // End of processCustomerOrder()

getPassword();
