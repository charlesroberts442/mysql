/***********************************************************************
 * Copyright (c) 2018 Charles W. Roberts
 * All Rights Reserved
 *
 * No portion of this code may be copied or modified without the
 * prior written permission of Charles Roberts.
 *
 ***********************************************************************/

/**
 * @file Contains the Object definition of DepartmentCollection objects.  
 * @author Charles Roberts
 * @copyright Charles Roberts 2018
 */

/**
 * @classdesc DepartmentCollection objects are used in the mysql homework.
 * */
class DepartmentCollection
{
	/**
 * The constructor for DepartmentCollection objects
 * */
 
 	constructor()
	 	{

	 	let _collection = [];

	 	
	 	this.addDepartment = function(departmentIn)
	 	{
	 		_collection.push(departmentIn);
	 	};

	} // End of constructor

} // End of class DepartmentCollection

module.exports = DepartmentCollection;