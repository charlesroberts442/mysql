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
const {table}      = require('table');

// ------- Global Variables ----------------

/**
 * [data description]
 * @type {Array}
 */
let data = [];

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

let Debug = false;

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

	} // End of handlePromptError()

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

	} // End of processAnswers()

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
			
			for(i=0; i < res.length; ++i)
			{
				

				let obj = new Item(res[i].item_id, 
					res[i].product_name,
					res[i].department_name,
					res[i].price,
					res[i].stock_quantity);

				storeInventory.addItem(obj);

				
			}

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
	let promptObject = 
	{
      type: 'list',
      name: 'choice',
      message: 'What do you want to do?',
      choices: [
        'View Products for Sale',
        'View Low Inventory',
        'Add to Inventory',
        'Add New Product'
      ]
	};

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
			console.log("Choice was " + answers.choice);
		}

		switch(answers.choice )
		{
			case "View Products for Sale":
				doViewProductsForSale();
				break;

			case "View Low Inventory":
				doViewLowInventory();
				break;

			case "Add to Inventory":
				doAddToInventoryPrompts();
				break;

			case "Add New Product":
				doAddNewProductPrompts();
				break;

			default:
				console.log("Nothing matched " + answers.choice);


		} // End of switch(answers.choice)

	}
         
	inquirer.prompt(promptObject).
	  then(processAnswers ).
	  catch(handlePromptError);

} // End of doCustomerOrder

function doViewProductsForSale()
{
	let itemCount = storeInventory.getItemCount();
	let i = 0;
	let temp = [];
	let row =
			[
				"Item ID",
				"Item Name",
				"Item Price",
				"Quantity in Stock"
			];
	temp.push(row);

	console.log("\nHere are the items for sale.\n");

	for(i=0; i<itemCount; ++i)
	{

		let obj = storeInventory.getItemAtIndex(i);

		row =
			[
				obj.getID(),
				obj.getName(),
				obj.getPrice(),
				obj.getStockQuantity()
			];

				temp.push(row);
	}

			data = temp;

			output = table(data);

			console.log(output);

			connection.end();

} // End of doViewProductsForSale()

function doViewLowInventory()
{
	let itemCount = storeInventory.getItemCount();
	let i = 0;
	let temp = [];
	let row =
			[
				"Item ID",
				"Item Name",
				"Item Price",
				"Quantity in Stock"
			];
	temp.push(row);

	console.log("\nHere are the low inventory items for sale.\n");

	for(i=0; i<itemCount; ++i)
	{

		let obj = storeInventory.getItemAtIndex(i);

		if(obj.getStockQuantity() < 5)

		{
			row =
				[
					obj.getID(),
					obj.getName(),
					obj.getPrice(),
					obj.getStockQuantity()
				];

				temp.push(row);
		}
	}

			data = temp;

			output = table(data);

			console.log(output);

			connection.end();

} // End of doViewLowInventory()

function doAddToInventoryPrompts()
{
	let i    = 0;
	let temp = [];

	console.log("\nHere are the items currently in inventory.\n");
	showInventory();

	let questionOne = 
	{
		name: "itemWanted",
    	message: "What is the ID of the item for which you want to add inventory?"
	};

	let questionTwo =
	{
		name: "quantity",
    	message: "How many of the items do you want to add to inventory?"
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
		doAddInventory(answers.itemWanted, answers.quantity);
	}
         
	inquirer.prompt(promptSet).
	  then(processAnswers ).
	  catch(handlePromptError);

} // End of doAddToInventory()

function doAddInventory(item_id, quantity)
{
	let itemOrdered = storeInventory.getItem(item_id);

	let itemID = itemOrdered.getID();

	let newInventoryAmount = parseInt(itemOrdered.getStockQuantity()) +
		parseInt(quantity);

	let queryString = "UPDATE products SET ? WHERE ?";
	let queryArray = [
			              {
			                stock_quantity: newInventoryAmount
			              },
			              {
			                item_id: itemID
			              }
			         ];
	let queryCallback = function(err, res)
	{
		if (err)
        {
      		console.log(err);
        }
      
        connection.end();

	}; // End of queryCallback()

	connection.query(queryString, queryArray, queryCallback);

} // End of doAddInventory()

function doAddNewProductPrompts()
{

	console.log("\nHere are the items currently in inventory.\n");
	showInventory();

	let questionOne =
	{
		name: "newProductName",
    	message: "What is the name of the new item?"
	};

	let questionTwo =
	{
		name: "newProductDepartment",
		message: "What is the new items department?"
	};

	let questionThree =
	{
		name: "newProductPrice",
		message: "What is the new item's price?"
	};

	let questionFour =
	{
		name: "newProductInventoryQuantity",
		message: "How much of the new item will be in inventory?"
	};

	let promptSet = [
	                	questionOne, 
	                	questionTwo,
	                	questionThree,
	                	questionFour,
	                ];

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
			console.log("I'm in processAnswers from add item to inventory.");
			console.log("Item ID is " + answers.newProductId);
			console.log("Item name is " + answers.newProductName);
			console.log("Item department is " + answers.newProductDepartment);
			console.log("Item price is " + answers.newProductPrice);
			console.log("quantity is "+ answers.newProductInventoryQuantity);
		}
		doAddNewProduct(answers.newProductName,
			      answers.newProductDepartment,
			      answers.newProductPrice,
			      answers.newProductInventoryQuantity);
		
	} // End of processAnswers()
         
	inquirer.prompt(promptSet).
	  then(processAnswers ).
	  catch(handlePromptError);

} // End of doAddNewProductPrompts

function doAddNewProduct(id, name, department, price, quantity)
{
	let queryString = "INSERT INTO products SET ?";
	let queryObject = {
						product_name: name,
  						department_name: department,
  						price: price,
 		 				stock_quantity: quantity
					  };

	let queryCallback = function(err, res)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			if(Debug === true)
			{
				console.log(res.affectedRows + " product inserted!\n");
			}

        }

	}; // End of queryCallback()
	
  var query = connection.query(queryString, queryObject, queryCallback);

  connection.end();
    
} // End of doAddNewProduct

function showInventory()
{
	let i         = 0;
	let temp      = [];
	let itemCount = storeInventory.getItemCount();
	let row =
			[
				"Item ID",
				"Item Name",
				"Item Price",
				"Quantity in Stock"
			];

	temp.push(row);

	for(i=0; i<itemCount; ++i)
	{

		let obj = storeInventory.getItemAtIndex(i);

		row =
			[
				obj.getID(),
				obj.getName(),
				obj.getPrice(),
				obj.getStockQuantity()
			];

				temp.push(row);
	}

			data = temp;

			output = table(data);

			console.log(output);

} // End of showInventory()


getPassword();