/***********************************************************************
 * Copyright (c) 2018 Charles W. Roberts
 * All Rights Reserved
 *
 * No portion of this code may be copied or modified without the
 * prior written permission of Charles Roberts.
 *
 ***********************************************************************/

// dependencies npm packages
let inquirer             = require("inquirer");
let mysql                = require("mysql");
let Item                 = require("./Item.js");
let ItemCollection       = require("./ItemCollection.js");
let Department           = require("./Department.js");
let DepartmentCollection = require("./DepartmentCollection.js");
const {table}            = require('table');

let Debug = false;

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
		doMenuPrompts();
		
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

} // End of doDatabaseConnect()

function doMenuPrompts()
{
	let promptObject = 
	{
      type: 'list',
      name: 'choice',
      message: 'What do you want to do?',
      choices: [
        'View Product Sales by Department',
        'Create New Department'
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
		switch(answers.choice )
		{
			case "View Product Sales by Department":
				doViewProductSales();
				break;

			case "Create New Department":
				console.log("\n");
				doCreateNewDepartmentMenu();
				break;

			default:
				console.log("Nothing matched " + answers.choice);


		} // End of switch(answers.choice)

	}
         
	inquirer.prompt(promptObject).
	  then(processAnswers ).
	  catch(handlePromptError);

} // End of doMenuPrompts()


function doCreateNewDepartmentMenu()
{
	let questionOne =
	{
		name: "name",
    	message: "What is the name of the new department?"
	};

	let questionTwo =
	{
		name: "cost",
    	message: "What is the over_head_costs of the new department?"
	};

	let promptSet = [questionOne, questionTwo ];

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
			console.log("I'm in processAnswers for the create department menu.");
			console.log("name is "+ answers.name);
			console.log("over_head_cost is "+ answers.cost);
		}

		doCreateNewDepartment(answers.name, answers.cost);
	}
         
	inquirer.prompt(promptSet).
	  then(processAnswers ).
	  catch(handlePromptError);

} // End of doCreateNewDepartmentMenu()

function doCreateNewDepartment(name, cost)
{
	
	let queryString = "INSERT INTO departments SET ?";
	let queryObject = 
	{
		department_name: name,
		over_head_costs: cost
	};
	let queryCallback = function(err, res)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log("\n")
			connection.end();
		}
		
	};
	let query = connection.query(queryString, queryObject, queryCallback);


} // End of doCreateNewDepartment()


function doViewProductSales()
{
	let queryString = "select departments.department_id, products.department_name, over_head_costs, sum(product_sales) as product_sales, (sum(product_sales) - over_head_costs) as total_profit  from products inner join departments on products.department_name = departments.department_name group by department_name";

	let queryCallback = function(err, res)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			let i      = 0;
			let data   = [];
			let header = ["Dept ID", "Dept Name", "Over Head Costs", "Product Sales", "Total Profit"];
			
			data.push(header);
			for(i=0; i < res.length; ++i)
			{
				let row = 
				[
					res[i].department_id, 
					res[i].department_name,
					res[i].over_head_costs,
					res[i].product_sales,
					res[i].total_profit
				];
				data.push(row);
			}

			output = table(data);
	 
			console.log("\n" +output + "\n");

			connection.end();
		}
	};
	let query = connection.query(queryString, queryCallback);

} // End of doViewProductSales()

getPassword();