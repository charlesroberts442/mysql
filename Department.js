/***********************************************************************
 * Copyright (c) 2018 Charles W. Roberts
 * All Rights Reserved
 *
 * No portion of this code may be copied or modified without the
 * prior written permission of Charles Roberts.
 *
 ***********************************************************************/

/**
 * @file Contains the Object definition of Department objects.  
 * @author Charles Roberts
 * @copyright Charles Roberts 2018
 */

/**
 * @classdesc Item objects represent the departments from the mysql homework.
 */
class Department
{
	/**
	 * The constructor for Department objects
	 * @param {String} id_in The department's id.
	 * @param {String} name_in The department's name.
	 * @param {String} costs_in The department's over head costs.
	
	 */
	constructor(id_in, name_in, costs_in )
	{

		let _id = id_in;
		let _name = name_in;
		let _over_head_costs = costs_in;

		this.getID = function()
		{
			return _id;
		};

	} // End of constructor()

} // End of class Department

module.exports = Department;
