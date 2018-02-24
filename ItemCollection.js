/***********************************************************************
 * Copyright (c) 2018 Charles W. Roberts
 * All Rights Reserved
 *
 * No portion of this code may be copied or modified without the
 * prior written permission of Charles Roberts.
 *
 ***********************************************************************/

/**
 * @file Contains the Object definition of Word objects.  
 * @author Charles Roberts
 * @copyright Charles Roberts 2018
 */

let Item           = require("./Item.js");
const {table}      = require('table');


/**
 * @classdesc Word objects are the artist's name in the Hangman game.
 */
class ItemCollection
{
	/**
 * The constructor for Word objects
 * @param {String} word_in The actual word.
 * @param {String} hint_in The hint for the Hangman game.
 */
 	constructor()
	 	{
	 	let _collection = [];

	 	/**
	 	 * [addItem description]
	 	 * @param {[type]} itemIn [description]
	 	 */
	 	this.addItem = function(itemIn)
	 	{
	 		_collection.push(itemIn);
	 	};

	 	/**
	 	 * [getItem description]
	 	 * @param  {[type]} id [description]
	 	 * @return {[type]}    [description]
	 	 */
	 	this.getItem = function(id)
	 	{
	 		let retValue = null;

	 		let i = 0;
	 		for (i = 0; i < _collection.length; ++i)
	 		{
	 			if(_collection[i].getID() === parseInt(id) )
	 			{
	 				retValue = _collection[i];
	 				break;
	 			}
	 		}

	 		return retValue;

	 	}; // End of getItem()

	 	this.hasItemWithId = function(id_in)
	 	{
	 		let retValue = false;
	 		let i        = 0;

	 		for(i = 0; i < _collection.length; ++i)
	 		{
	 			if(_collection[i].getID() == id_in)
	 			{
	 				retValue = true;
	 				break;
	 			}
	 		}

	 		return retValue;
	 		
	 	}; // End of hasItemWithId()

	 	this.getItemAtIndex = function(index)
	 	{
	 		return _collection[index];
	 	};

	 	this.getItemCount = function()
	 	{
	 		return _collection.length;
	 	}; // End of this.getItemCount()

	 	this.logCollection = function()
	 	{
	 		let i      = 0;
	 		var data   = [];
	 		let temp   = [];
	 		let output = "";
	 		let header = 
	 			[
	 				"ID",
	 				"Name",
	 				"Department",
	 				"Price",
	 				"Stock Quantity",
	 				"Product Sales"

	 			]; // End of header = []

	 		temp.push(header);

	 		// Walk the collection putting values in temp
	 		for(i = 0; i < _collection.length; ++i)
	 		{
	 			let obj = _collection[i];

	 			let row =
				[
					obj.getID(),
					obj.getName(),
					obj.getDepartment(),
					obj.getPrice(),
					obj.getStockQuantity(),
					obj.getProductSales()

				]; // End of let row = []

				temp.push(row);

	 		} // End of for(i = 0; i < _collection.length; ++i)

	 		// Log the data as a table
	 		data = temp;
			output = table(data);
			console.log(output);	

	 	}; // End of logCollection()

	 } // End of constructor()

} // End of Class ItemCollection

 module.exports = ItemCollection;
