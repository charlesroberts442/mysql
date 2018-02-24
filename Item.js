/***********************************************************************
 * Copyright (c) 2018 Charles W. Roberts
 * All Rights Reserved
 *
 * No portion of this code may be copied or modified without the
 * prior written permission of Charles Roberts.
 *
 ***********************************************************************/

/**
 * @file Contains the Object definition of Item objects.  
 * @author Charles Roberts
 * @copyright Charles Roberts 2018
 */

/**
 * @classdesc Item objects represent the products from the mysql homework.
 */
class Item
{
	/**
	 * The constructor for Item objects
	 * @param {String} id_in The item's id.
	 * @param {String} name_in The item's name.
	 * @param {String}  department_in The item's department.
	 * @param {String} price_in The item's price.
	 * @param {String} stock_quantity_in The amount of the item in stock
	 */
	constructor(id_in, name_in, 
		        department_in, 
		        price_in, 
		        stock_quantity_in,
		        product_sales_in)
	{
		const _id             = id_in;
		const _name           = name_in;
		const _department     = department_in;
		const _price          = parseFloat(price_in);
		const _stock_quantity = parseInt(stock_quantity_in);
		const _product_sales  = parseFloat(product_sales_in);

		/**
		 * [getID description]
		 * @return {[type]} [description]
		 */
		this.getID = function()
		{
			return _id;
		};

		/**
		 * [getName description]
		 * @return {[type]} [description]
		 */
		this.getName = function()
		{
			return _name;
		};

		/**
		 * [getPrice description]
		 * @return {[type]} [description]
		 */
		this.getPrice = function()
		{
			return _price;
		};

		/**
		 * [getDepartment description]
		 * @return {[type]} [description]
		 */
		this.getDepartment = function()
		{
			return _department;
		};

		/**
		 * [getStockQuantity description]
		 * @return {[type]} [description]
		 */
		this.getStockQuantity = function()
		{
			return _stock_quantity;
		};

		this.getProductSales = function()
		{
			return _product_sales;
		};


	} // End of constructor(id, name, price)

} // End of class Item


module.exports = Item;
